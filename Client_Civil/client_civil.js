var express     = require('express');
var net = require('net');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var config      = require('./config/database'); // get db config file
var srpschema       = require('./app/models/srp');
var apiRoutes = express.Router();
var path = require('path');
var port        = process.env.PORT || 9000;
var fs = require('fs');
var dept_dh="Civil";


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// connect the api routes under /api/*
app.use('/', apiRoutes);
 
// log to console
app.use(express.static("public"));
app.use('/css', express.static('public'))
app.use('/css/fonts', express.static('public'))
// Use the passport package in our application
mongoose.connect(config.database);
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
  res.render('displaycli.ejs',{ message: '' });
});


app.post('/fetch_by_dept', function(req, res) {
        console.log("Here");
        console.log(dept_dh);
        srpschema.find({ 'dealinghand': dept_dh , 'sendflag' : '0'}).exec(function(err, docs) { 
          res.json(docs);
        });
    });

app.post('/verify', function(req, res) {
        console.log("Here");
        var dateobj=new Date;
        var daystr=dateobj.getDate();
        var monthstr=dateobj.getMonth();
        var yearstr=dateobj.getFullYear();
        
         srpschema.findById(req.body.key, (err, doc) => {  
         if (err) {
            console.log(err);
         } else {
            doc.sendflag="1";
            doc.verifydate=daystr+"/"+monthstr+"/"+yearstr;
            doc.save((err, doc) => {
            if (err) {
                console.log(err);
            }
            else
            {  res.json(doc);
               console.log(doc);
            }
            });
        }
        });
    });

app.post('/submit', function(req, res) {
        console.log("Here");
        (req.body.json).save(function(err, doc){
          if(err) {
            console.log(err);
              }
          else  {
            console.log('success');
          }  
        });
    });

app.listen(port);