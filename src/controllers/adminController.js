const express = require('express');
const Categorys = require('../models/categoryModel');
const Articles = require('../models/articleModel');
const session = require('express-session');
const db = require('../database/connection');

const viewLogin = (req, res) => {
    res.render('login');
}

const showCategory = (req, res) => {
    try {
        const search = req.query.search || '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const offset = (page - 1) * limit;

        // Build the SQL query
        const sql = `
        SELECT * FROM Categorys
        WHERE categoryName LIKE ?
        LIMIT ? OFFSET ?
      `;

        db.query(
            sql,
            [`%${search}%`, limit, offset],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal server error');
                }

                Categorys.getAll((err, data) => {
                    if (err) {
                        console.log(err);
                    }
                    const totalRecords = data.length;

                    const totalPages = Math.ceil(totalRecords / limit);

                    res.render('adminCategory', {
                        categorys: result,
                        search: search,
                        totalRecords: totalRecords,
                        currentPage: page,
                        totalPages: totalPages,
                    });
                });
            }
        );
    } catch (err) {
        console.log(err);
    }
};



const login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const sql = `select * from Users Where email ='${email}' AND password = '${password}'`;

        db.query(sql, (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal server error');
            }
            if (data != "") {
                session.username = email;
                res.redirect('/Category');
            }
            else {
                res.render('login', {
                    message: 'Invalid Login Details'
                });
            }
        });

    }
    catch (err) {
        console.log(err);
    }
}

const addCategory = async (req, res) => {
    try {
        const cname = req.body.cname;
        const createdOn = Date.now();

        const sql = `
        insert into Categorys(categoryName,createdOn) values('${cname}',NOW())
        `;

        db.query(sql, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/Category');
        });

    }
    catch (err) {
        console.log(err);
    }
}

const viewEdit = async (req, res) => {
    try {
        const id = req.params.id;

        const sql = `
         select * from Categorys where categoryID = ${id}
        `;

        db.query(sql, (err, data) => {
            if (err) {
                console.log(err);
            }
            res.render('editCategory', {
                category: data
            })
        });
    }
    catch (err) {
        console.log(err);
    }
}

const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;

        Categorys.delete(id, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/Category')
        })
    }
    catch (err) {
        console.log(err);
    }
}

const editCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const cname = req.body.category;
        const createdOn = Date.now();

        const sql = `
          update Categorys set categoryName = '${cname}',createdOn = NOW() where categoryID = ${id}
        `;

        db.query(sql, (err) => {
            if (err) {
                console.log(err);
            }

            res.redirect('/Category');
        });
    }
    catch (err) {
        console.log(err);
    }
}

const viewArticle2 = (req, res) => {
    try {
        var search = "";
        if (req.query.search) {
            search = req.query.search;
        }
        let { page, limit } = req.query;
        if (!page) {
            page = 1;
        }
        if (!limit) {
            limit = 3;
        }

        // Count total records
        db.query(
            'SELECT COUNT(*) AS totalRecords FROM articles WHERE title LIKE ? OR description LIKE ?',
            [`%${search}%`, `%${search}%`],
            (error, results) => {
                if (error) {
                    throw error;
                }

                const totalRecords = results[0].totalRecords;
                let pageNumber = parseInt(page);
                let limitNumber = parseInt(limit);
                const startIndex = (pageNumber - 1) * limitNumber;

                // Fetch articles with pagination
                db.query(
                    'SELECT * FROM Articles WHERE title LIKE ? OR description LIKE ? LIMIT ? OFFSET ?',
                    [`%${search}%`, `%${search}%`, limitNumber, startIndex],
                    (error, articles) => {
                        if (error) {
                            throw error;
                        }

                        // Fetch categories
                        db.query('SELECT * FROM Categorys', (error, categorys) => {
                            if (error) {
                                throw error;
                            }

                            res.render('adminArticle', {
                                categorys: categorys,
                                articles: articles,
                                search: search,
                                totalRecords: totalRecords,
                            });
                        });
                    }
                );
            }
        );
    } catch (err) {
        res.send(err);
    }
};


const viewArticle = (req, res) => {
    try {
        var search = "";
        if (req.query.search) {
            search = req.query.search;
        }
        let { page, limit } = req.query;
        if (!page) {
            page = 1;
        }
        if (!limit) {
            limit = 3;
        }

        // Count total records
        db.query(
            'SELECT COUNT(*) AS totalRecords FROM articles WHERE title LIKE ? OR description LIKE ?',
            [`%${search}%`, `%${search}%`],
            (error, results) => {
                if (error) {
                    throw error;
                }

                const totalRecords = results[0].totalRecords;
                let pageNumber = parseInt(page);
                let limitNumber = parseInt(limit);
                const startIndex = (pageNumber - 1) * limitNumber;

                // Fetch articles with associated categories using a JOIN
                db.query(
                    'SELECT articles.*, articleImageTB.image AS articleImage, categorys.categoryName AS categoryName FROM articles ' +
                    'LEFT JOIN articleImageTB ON articles.articleID = articleImageTB.articleID ' +
                    'LEFT JOIN categorys ON articles.categoryID = categorys.categoryID ' +
                    'WHERE articles.title LIKE ? OR articles.description LIKE ? ' +
                    'LIMIT ? OFFSET ?',
                    [`%${search}%`, `%${search}%`, limitNumber, startIndex],
                    (error, articles) => {
                        if (error) {
                            throw error;
                        }

                        // console.log(articles);

                        db.query('SELECT * FROM Categorys', (error, categorys) => {
                            if (error) {
                                throw error;
                            }

                            res.render('adminArticle', {
                                categorys: categorys,
                                articles: articles,
                                search: search,
                                totalRecords: totalRecords,
                            });
                        });
                    }
                );
            }
        );
    } catch (err) {
        res.send(err);
    }
};


const addArticle = async (req, res) => {
    try {
        const profileFilenames = [];

        // Iterate through the uploaded files and push their filenames into the array
        // req.files.forEach(file => {
        //     profileFilenames.push(file.filename);
        // });

        const title = req.body.title;
        const description = req.body.desc;
        const image = req.file.filename;
        const category_id = req.body.category_id;

        const currentDate = new Date();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Get current month
        const year = currentDate.getFullYear().toString(); // Get current year

        // Get the full month name
        const options = { month: 'long' };
        const fullMonthName = currentDate.toLocaleString('en-US', options);

        // Set the custom field to "MM/YYYY" format
        const monthandyear = `${fullMonthName} ${year}`;

        // const a = new Article({
        //     title: title,
        //     description: description,
        //     image: image,
        //     monthAndYear: monthandyear,
        //     category_id: category_id
        // });

        const sql = `
           insert into Articles(title,description,monthAndYear,timestamp,categoryID) values ('${title}','${description}','${monthandyear}',NOW(),${category_id})`;

        db.query(sql,(err,data)=>{
            if(err)
            {
                console.log(err);
            }

            const sql2 = `
             insert into articleImageTB(articleID,image) values(${data.insertId},'${image}')
            `;

            db.query(sql2,(err)=>{
                if(err)
                {
                    console.log(err);
                }

                res.redirect('/article');

            })
        });
    }
    catch (err) {
        console.log(err);
    }
}

const deleteArticle = async (req, res) => {
    try {
        const id = req.params.id;
        
        Articles.delete(id,(err)=>{
            if(err)
            {
                console.log(err);
            }
            res.redirect('/article');
        })
    }
    catch (err) {
        console.log(err);
    }
}

const logout = async (req, res) => {
    try {
        session.username = "";
        //session destroy method does not work
        session.destroy;
        res.redirect('/adminLogin');
    }
    catch (err) {
        console.log(err);
    }
}



module.exports = {
    viewLogin,
    login,
    logout,
    showCategory,
    addCategory,
    deleteCategory,
    viewEdit,
    editCategory,
    viewArticle,
    addArticle,
    deleteArticle
};