'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const hash = require('js-hash-code');
var bodyParser = require('body-parser');
const validUrl = require('valid-url');


var cors = require('cors');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));


// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());
 
/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});

const make_url = (original_url, short_url)=>{
  app.get("/api/shorturl/" + short_url, (req, res)=>{
    res.redirect(original_url);
  })
}

app.route("/api/shorturl/new").post((req, res)=>{
  var original_url = req.body.url;
  if (validUrl.isUri(original_url)){  
    var short_url = hash(req.body.url)
    make_url(original_url, short_url);
    res.json({
      original_url : original_url,
      short_url: short_url
    });
  } else {
    res.json({
      error: "invalid URL"
    });
  }
});