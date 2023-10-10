const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const session = require('express-session');
const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination:function(req,file,res){
        res(null,"../blog_SQL/public/uploads");
    },
    filename:function(req,file,res){
        res(null,Date.now()+path.extname(file.originalname));
    }
});

var upload = multer({
    storage:storage
});

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
router.get('/logout',adminController.logout);

//Category
router.get('/Category',adminVarify,adminController.showCategory);
router.post('/Category',adminVarify,adminController.addCategory);
router.get('/deleteCategory/:id',adminVarify,adminController.deleteCategory);
router.get('/editCategory/:id',adminVarify,adminController.viewEdit);
router.post('/editCategory/:id',adminVarify,adminController.editCategory);

//Article
router.get('/article',adminVarify,adminController.viewArticle);
router.get('/showArticle/:id',adminVarify,adminController.showArticleData);
router.post('/addArticle',adminVarify,upload.single('image'),adminController.addArticle);
router.get('/deleteArticle/:id',adminVarify,adminController.deleteArticle); 
router.post('/editArticle/:id',adminVarify,adminController.editArticle);
router.post('/uploadImage/:id',adminVarify,upload.array('image[]',50),adminController.addPicture);
router.get('/deleteArticleImage/:image',adminVarify,adminController.deleteArticlePicture);

module.exports = router;