//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true });

const articlesSchema = {
  title: String,
  coment: String
}

const Article = mongoose.model("Article", articlesSchema);

///////////////////////////////////ROUTE ANY ARTICLES//////////////////////////

app.route("/articles")

.get(function (req, res) {
  Article.find(function (err, foundArticles) {
    if (!err) {
      res.send(foundArticles);
    }else{
      res.send(err);
    }
  });
})

.post(function (req, res) {
  
  const newArticle = new Article({
    title: req.body.title,
    coment: req.body.coment
  });
  newArticle.save(function () {
    if (!err) {
      res.send("Successfully added new Article");
    }else {
      res.send(err);
    }
  });
})

.delete(function (req, res) {
  Article.deleteMany(function (err) {
    if (!err) {
      res.send("Successfully deleted all articles");
    }else {
      res.send(err);
    }
  });
});

///////////////////////////////////ROUTE PARTICULAR ARTICLE////////////////////

app.route("/articles/:articleTitle")

.get(function (req,res) {
  
  Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {

    if (foundArticle) {
      res.send(foundArticle);
    }else {
      res.send("No articles matching.");
    }
  })
})
  
.put(function (req, res) {
    
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, coment: req.body.coment},
    {overwite: true},
    function (err) {
      if (!err) {
        res.send("successfully updated article.");
      }
    }
  );
})

.patch(function (req, res) {
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function (err, result) {
      if (!err) {
        res.send("successfully updated article");
      }
    }
  );
})

.delete(function (req, res) {
  Article.deleteOne(
    {title: req.params.articleTitle}, 
    function (err) {
      if (!err) {
        res.send("Successfully deleted article.");
      }
  });
});
  

app.listen(3000, function() {
  console.log("Server started on port 3000");
});