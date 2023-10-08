const express = require('express');
const Categorys = require('../models/categoryModel');
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
          
          Categorys.getAll((err,data)=>{
            if(err)
            {
                console.log(err);
            }
            const totalRecords = data.length;
    
            // Calculate total pages
            const totalPages = Math.ceil(totalRecords / limit);

            res.render('adminCategory', {
              categorys: result,
              search: search,
              totalRecords: totalRecords,
              currentPage: page,
              totalPages: totalPages,
            });
          });
          // Count total records
        //   res.send(result);
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

        db.query(sql,(err,data)=>{
           if(err)
           {
            console.error(err);
            return res.status(500).send('Internal server error');
           }
           if(data != "")
           {
               session.username = email;
               res.redirect('/Category');
            }
            else
            {
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

        const sql =`
        insert into Categorys(categoryName,createdOn) values('${cname}',NOW())
        `;

        db.query(sql,(err)=>{
            if(err)
            {
                console.log(err);
            }
            res.redirect('/Category');
        });
      
    }
    catch (err) {
        console.log(err);
    }
}

const viewEdit = async(req,res)=>{
    try{
        const id = req.params.id;

        const sql = `
         select * from Categorys where categoryID = ${id}
        `;

        db.query(sql,(err,data)=>{
            if(err)
            {
                console.log(err);
            }
            res.render('editCategory',{
                category:data
            })
        });
    }
    catch(err)
    {
        console.log(err);
    }
}

const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
    
        Categorys.delete(id,(err)=>{
            if(err)
            {
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

        db.query(sql,(err)=>{
            if(err)
            {
                console.log(err);
            }
            
            res.redirect('/Category');
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



module.exports = {
    viewLogin,
    login,
    logout,     
    showCategory,
    addCategory,
    deleteCategory,
    viewEdit,
    editCategory
};