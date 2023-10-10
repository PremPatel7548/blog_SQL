const express = require('express');
const Categorys = require('../models/categoryModel');
const Articles = require('../models/articleModel');
const session = require('express-session');
const db = require('../database/connection');

const viewContect = (req,res)=>{
    res.render('contectUS',{
        user:session.username
    });
}

const viewArticle = (req, res) => {
    try {
        const query = 'SELECT articles.*, categorys.categoryName AS category_name, ' +
        '(SELECT image FROM articleImageTB WHERE articleImageTB.articleID = articles.articleID LIMIT 1) AS firstImage ' +
        'FROM articles ' +
        'LEFT JOIN categorys ON articles.categoryID = categorys.categoryID ';
    db.query(query,(error,articles) => {
        if(error)
        {
            throw error
        }

        var des=[];
        articles.forEach(article => {
        des.push(article.description);
      });

      const truncatedDescriptions = des.map(description => {
          return description.length > 50
          ? `${description.slice(0, 50)}...`
          : description;
      });

      const categoriesQuery = 'SELECT * FROM categorys';
      db.query(categoriesQuery,(error,category)=>{
        if(error)
        {
            throw error
        }

      const latestArticlesQuery = `
      SELECT *
        FROM articles
        ORDER BY timestamp DESC
        LIMIT 3;
    `;
    db.query(latestArticlesQuery,(error,leArtical) => {
        if(error)
        {
            throw error
        }

    const archivesQuery = `
    SELECT monthAndYear AS monthAndYear, COUNT(*) AS count
    FROM articles
    GROUP BY monthAndYear
    ORDER BY timestamp DESC;
    `;

    db.query(archivesQuery,(error,archives) => {
        if(error)
        {
            throw error
        }

        var Detail = "";
        var DetailData = "";
        if(req.params.id)
        {
            id = req.params.id;
            const detailQuery =`
            SELECT articles.*, categorys.categoryName AS category_name
            FROM articles
            LEFT JOIN categorys ON articles.categoryID = categorys.categoryID
            WHERE articles.articleID = ?
            `;
            db.query(detailQuery, [id],(error,DetailData) => {
                if(error)
                {
                    throw error
                }
                // DetailData = detailRows[0];
                Detail="details";
                res.render('Articals', { 
                  articles: articles,
                  category: category,
                  leArtical:leArtical,
                  showArchives:archives,
                  truncatedDescriptions:truncatedDescriptions,
                  checkArtical: "artical",
                  DetailData:DetailData,
                  detail:Detail
              });
            });
        }else
        {
      res.render('Articals', { 
        articles: articles,
        category: category,
        leArtical:leArtical,
        showArchives:archives,
        truncatedDescriptions:truncatedDescriptions,
        checkArtical: "artical",
        DetailData:DetailData,
        detail:Detail
    });
    }

    });
   });
 });
});
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching articles.');
    }
  };

  const showSearchArticle = (req,res) => {
    try {
        const mnd = req.params.id;
            const cat_id = req.params.id;
            const id = req.params.id;
            var recentPost="";
            var remessage="";
            var recentPostDes = "";
                // if(!mnd)
                // {
                    var des2=[];
                    const recentPostQuery = `
                    SELECT 
                    articles.*,
                    categorys.categoryName AS category_name,
                    (SELECT image FROM articleImageTB WHERE articleImageTB.articleID = articles.articleID LIMIT 1) AS firstImage
                  FROM 
                    articles
                  LEFT JOIN 
                    categorys ON articles.categoryID = categorys.categoryID
                  WHERE 
                    articles.articleID = ?
                  `;            
                  db.query(recentPostQuery, [id],(error,recentPost)=>{
                    if(error)
                    {
                      throw error;
                    }

                    remessage="recentPost";
                    recentPost.forEach(rPost => {
                        des2.push(rPost.description);
                    });

                    recentPostDes = des2.map(description => {
                        return description.length > 50
                        ? `${description.slice(0, 50)}...`
                        : description;
                    });
                  // });
                // }

                const categoriesQuery = 'SELECT * FROM categorys';
                db.query(categoriesQuery,(error,category)=>{
                  if(error)
                    {
                      throw error;
                    }
                

                var des=[];
                const articlesQuery = `
                SELECT 
                articles.*, 
                categorys.categoryName AS category_name,
                (SELECT image FROM articleImageTB WHERE articleImageTB.articleID = articles.articleID LIMIT 1) AS firstImage
              FROM 
                articles
              LEFT JOIN 
                categorys ON articles.categoryID = categorys.categoryID
              WHERE 
                articles.categoryID = ?
              `;

              db.query(articlesQuery, [cat_id],(error,articles)=>{
                if(error)
                    {
                      throw error;
                    }
                articles.forEach(artical => {
                    des.push(artical.description);
                });

                const categoryDes = des.map(description => {
                    return description.length > 50
                    ? `${description.slice(0, 50)}...`
                    : description;
                });

                const latestArticlesQuery = `
                SELECT *
                FROM articles
                ORDER BY timestamp DESC
                LIMIT 3;
              `;
              db.query(latestArticlesQuery,(error,leatestArtical)=>{
                if(error)
                {
                  throw error;
                }

                const archivesQuery = `
                SELECT monthAndYear AS monthAndYear, COUNT(*) AS count
                FROM articles
                GROUP BY monthAndYear
                ORDER BY timestamp DESC;
                `;

                db.query(archivesQuery,(error,archives) => {
                    if(error)
                    {
                        throw error
                    }

                var des1=[];
                const archivesQuery = `
                SELECT 
                  articles.*, 
                  categorys.categoryName AS category_name,
                  (SELECT image FROM articleImageTB WHERE articleImageTB.articleID = articles.articleID LIMIT 1) AS firstImage
                FROM 
                  articles
                LEFT JOIN 
                  categorys ON articles.categoryID = categorys.categoryID
                WHERE 
                  monthAndYear = ?`;

                db.query(archivesQuery, [mnd],(error,showArchives)=>{
                  if(error)
                    {
                        throw error
                    }

                showArchives.forEach(archive => {
                    des1.push(archive.description);
                });

                const archiveDes = des1.map(description => {
                    return description.length > 50
                    ? `${description.slice(0, 50)}...`
                    : description;
                });

        res.render('Articals', {
            searchArtical: articles,
            searchCategory: category,
            leatestArtical:leatestArtical,
            recentPost:recentPost,
            archives:archives,
            showArchives:showArchives,
            remessage:remessage,
            recentPostDes:recentPostDes,
            categoryDes:categoryDes,
            archiveDes:archiveDes,
            checkSearchArtical: "searchArtical",
        });
      });
    });
  });
  });
      });
    });
      } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching articles.');
      }
  }


  module.exports = {
    viewContect,
    viewArticle,
    showSearchArticle
  }
