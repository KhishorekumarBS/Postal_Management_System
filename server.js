var express     = require('express');
var net = require('net');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var config      = require('./config/database'); // get db config file
var srpschema       = require('./app/models/srp');
var exec = require('child_process').exec;
var apiRoutes = express.Router();
var path = require('path');
var port        = process.env.PORT || 8080;
var fs = require('fs');
var multer  =   require('multer');  

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// connect the api routes under /api/*
app.use('/', apiRoutes);
 
// log to console
app.use(express.static("public"));
app.use(express.static("stockfiles"));
app.use('/css', express.static('public'))
app.use('/css/fonts', express.static('public'))
// Use the passport package in our application
mongoose.connect(config.database);
app.set('view engine', 'ejs');


app.get('/', function(req, res) {
  res.render('display.ejs',{ message: '' });
});

/*app.get('/send', function(req, res) {
  var mac="54:27:1e:8e:20:db";
  var result;
  exec("arp -a", function(error, stdout, stderr){
   result=stdout;console.log(result); 
   var lines=result.split('\n');
  for(var i = 0;i < lines.length;i++){
    var n = lines[i].indexOf(" at ");
    console.log((lines[i].substring(n+4)).substring(0,17));
  }
  var n = result.indexOf(" at ");
  
 });
  var client = net.connect(5050, 'localhost');
  client.write('Hello from node.js');
  client.end();
  var fs = require('fs');
  fs.writeFile("message.txt", "Hey there!", function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 
  res.render('register.ejs',{ message: 'Sent' });
});
*/

app.post('/viewall', function(req, res){
  srpschema.find({}).sort({date: -1}).exec(function(err, obj) { 
      console.log(obj);
       res.json(obj);
        });
});

app.get('/search', function(req, res){
  srpschema.find({}).sort({date: -1}).exec(function(err, obj) { 
      console.log(obj);
       res.render('search.ejs',{ docs : obj});
        });
});

app.get('/get_stockfile/:ids', function(req, res){
     srpschema.find({ '_id': req.params.ids }).exec(function(err, docs) { 
     console.log(docs[0].date); 
      var d = new Date();
    var filename=req.params.ids+'.pdf';
    var filePath = './stockfiles/'+d.getFullYear()+'/'+d.getMonth()+'/'+filename;
    var resolvedPath = path.resolve(filePath);
    console.log(resolvedPath);
    res.header('Content-disposition', 'inline; filename=' + filename);
    res.header('Content-type', 'application/pdf');
    return res.sendFile(resolvedPath);
  });
});


app.post('/fetch_by_dept', function(req, res) {
        console.log("Here");
        srpschema.find({ 'department': req.body.key }).sort({date: -1}).exec(function(err, docs) { 
          res.json(docs);
        });
    });

app.post('/upload_stockfile', function(req, res) {
        console.log("Stockfile");
        var d = new Date();
        var dir = './stockfiles/'+d.getFullYear();
        if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
        }
        console.log(d.getMonth());
        dir = './stockfiles/'+d.getFullYear()+'/'+d.getMonth();
        console.log(dir);
        if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
        }
        dir=dir+"/";
        var storage =   multer.diskStorage({
          destination: function (req, file, callback) {
            callback(null, dir);
          },
          filename: function (req, file, callback) {
            srpschema.findById(req.body.stock_key, (err, doc) => {  
             if (err) {
                console.log(err);
             } else {
                dir=dir.substring(13);
                console.log(dir);
                doc.stockfile=dir+req.body.stock_key+'.pdf';
                doc.save((err, doc) => {
                if (err) {
                    console.log(err);
                }
                else
                { 
                   console.log(doc);
                }
                });
            }
            });
            callback(null,req.body.stock_key+'.pdf');
          }
        });
        var upload = multer({ storage : storage}).single('sfile');
        upload(req,res,function(err) {  
        if(err) {  
            return res.end("Error uploading file.");  
        }  
        res.render('display.ejs',{ message: '' });
    });  
    });

app.post('/fetch_by_id', function(req, res) {
        console.log("Here");
        srpschema.find({ '_id': req.body.key }).exec(function(err, docs) { 
          console.log("-------------");
          console.log(docs); 
          res.json(docs);
        });
    });

app.post('/update_with_id', function(req, res) {
        console.log("Here");
         srpschema.findById(req.body.key, (err, doc) => {  
         if (err) {
            console.log(err);
         } else {
            doc.department=req.body.dept;
            doc.subject=req.body.sub;
            doc.ddnum=req.body.dd;
            doc.amount=req.body.amt;
            doc.sender=req.body.sndr;
            doc.save((err, doc) => {
            if (err) {
                console.log(err);
            }
            });
        }
        });
        srpschema.find({ 'department': req.body.key }).exec(function(err, docs) { 
          res.json(docs);
        });
    });

app.post('/verify', function(req, res) {
        console.log("Here");
         srpschema.findById(req.body.key, (err, doc) => {  
         if (err) {
            console.log(err);
         } else {
            doc.sendflag="0";
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

app.post('/savee', function(req, res){
  var dateobj=new Date;
  var daystr=dateobj.getDate();
  var monthstr=dateobj.getMonth();
  var yearstr=dateobj.getFullYear();
  
  new srpschema({
    _id : req.body.ids,
    date:Date.now(),
    displaydate : daystr+"/"+monthstr+"/"+yearstr,
    department : req.body.dept,
    subject:req.body.sub,
    ddnum: req.body.ddno,
    amount: req.body.amt,
    stockfile: '0',
    dealinghand: '0',
    sendflag : "0",
    sender: req.body.sndr,
    actiondate: '0'
  }).save(function(err, doc){
    if(err) {
      console.log(err);
        }
    else  {
      console.log('success');
    }  
  });
});


app.listen(port);

