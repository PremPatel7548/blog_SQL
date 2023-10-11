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

                // Fetch articles with associated categories using a JOIN
                db.query(
                    'SELECT articles.* categorys.categoryName AS categoryName FROM articles ' +
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

                // Fetch articles with associated categories using a JOIN and first image
                db.query(
                    'SELECT articles.*, categorys.categoryName AS categoryName, ' +
                    '(SELECT image FROM articleImageTB WHERE articleImageTB.articleID = articles.articleID LIMIT 1) AS firstImage ' +
                    'FROM articles ' +
                    'LEFT JOIN categorys ON articles.categoryID = categorys.categoryID ' +
                    'WHERE articles.title LIKE ? OR articles.description LIKE ? ' +
                    'LIMIT ? OFFSET ?',
                    [`%${search}%`, `%${search}%`, limitNumber, startIndex],
                    (error, articles) => {
                        if (error) {
                            throw error;
                        }

                        var des1=[];
                        articles.forEach(article => {
                            des1.push(article.description);
                        });
        
                        const articleDes = des1.map(description => {
                            return description.length > 50
                            ? `${description.slice(0, 50)}...`
                            : description;
                        });

                        db.query('SELECT * FROM Categorys', (error, categorys) => {
                            if (error) {
                                throw error;
                            }

                            res.render('adminArticle', {
                                categorys: categorys,
                                articles: articles,
                                search: search,
                                articleDes,articleDes,
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

        const sql = `
           insert into Articles(title,description,monthAndYear,timestamp,categoryID) values ('${title}','${description}','${monthandyear}',NOW(),${category_id})`;

        db.query(sql, (err, data) => {
            if (err) {
                console.log(err);
            }

            const sql2 = `
             insert into articleImageTB(articleID,image) values(${data.insertId},'${image}')
            `;

            db.query(sql2, (err) => {
                if (err) {
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

        Articles.delete(id, (err) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/article');
        })
    }
    catch (err) {
        console.log(err);
    }
}

const editArticle = async (req,res)=>{
    try{
        const _id = req.params.id;

        db.query(`select categoryID from Categorys where categoryName='${req.body.category}'`,(err,result)=>{
            if(err)
            {
                console.log(err);
            }

            db.query(`update Articles set title='${req.body.title}',description='${req.body.description}',categoryID=${result[0].categoryID} where articleID = ${_id}`,(err)=>{
                if(err)
                {
                    console.log(err);
                }

                res.redirect(`/showArticle/${_id}`);
                
            });
        });
    }
    catch(err)
    {
        console.log(err);
    }
}

const showArticleData = async (req, res) => {
    try {
        const _id = req.params.id;

        db.query(
            'SELECT articles.*, categorys.categoryName AS categoryName FROM articles ' +
            'LEFT JOIN categorys ON articles.categoryID = categorys.categoryID ' +
            'WHERE articles.articleID =' + _id,
            (err, result) => {
                if (err) {
                    console.log(err);
                }

                db.query(`Select * from articleImageTB where articleID = ${_id}`, (err, images) => {
                    if (err) {
                        console.log(err);
                    }
                    db.query('SELECT * FROM Categorys', (err, categorys) => {
                        if (err) {
                            console.log(err);
                        }

                        res.render('adminShowArticle', { articleData: result, images: images, ArticalID: _id, categorys: categorys });
                    })
                })

            }
        )
    }
    catch (err) {
        console.log(err);
    }
}

const addPicture = async (req, res) => {
    try {
        const id = req.params.id;

        db.query(`Select * from articles where articleID = ${id}`, (err, result) => {
            if (err) {
                console.log(err);
            }

            if (result == "") {
                res.send('Article Not found')
            }
            else {

                req.files.forEach(file => {
                    db.query(`Insert into articleImageTB(articleID,image) values(${id},'${file.filename}')`, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    })
                });

                res.redirect(`/showArticle/${id}`);

            }
        })

    } catch (err) {
        console.log(err);
    }
};

const deleteArticlePicture = async (req, res) => {
    try {
        const image = req.params.image;

        db.query(`Select articleID from articleImageTB where image='${image}'`,(err,result)=>{
            if(err)
            {
                console.log(err);
            }

            db.query(`Delete from articleImageTB where image='${image}'`,(err)=>{
                if(err)
                {
                    console.log(err);
                }

                res.redirect(`/showArticle/${result[0].articleID}`);
            })
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

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
    showArticleData,
    deleteArticle,
    editArticle,
    addPicture,
    deleteArticlePicture
};