const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const hbs = require('hbs');
const session = require("express-session");
const port = process.env.PORT||8000;
require('./src/database/connection');
const router = require('./src/routers/routes');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const static_path = path.join(__dirname, '/public');
const partials_path = path.join(__dirname, '/views/partials');
app.use(express.static(static_path));
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    resave: false
}));

app.use(router);
app.set('view engine', 'hbs');
hbs.registerPartials(partials_path);

app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
})