const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const session = require('express-session');

const adminVarify = (req,res,next)=>{
    if(session.username != "admin@gmail.com")
    {
        res.render('login');
    }
    else{
        next();
    }
}

const adminLoginVerify = (req,res,next)=>{
    if(session.username === "admin@gmail.com")
    {
        res.redirect('/Category');
    }
    else
    {
        next();
    }
}

router.get('/adminLogin',adminLoginVerify,adminController.viewLogin);
router.post('/login',adminLoginVerify,adminController.login);
router.get('/Category',adminVarify,adminController.showCategory);
router.post('/Category',adminVarify,adminController.addCategory);
router.get('/deleteCategory/:id',adminVarify,adminController.deleteCategory);
router.get('/editCategory/:id',adminVarify,adminController.viewEdit);
router.post('/editCategory/:id',adminVarify,adminController.editCategory);
router.get('/article',adminVarify,adminController.viewArticle);
router.get('/deleteArticle/:id',adminVarify,adminController.deleteArticle);

module.exports = router;