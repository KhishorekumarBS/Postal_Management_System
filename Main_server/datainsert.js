var mongoose    = require('mongoose');
var config      = require('./config/database'); // get db config file
var srpschema       = require('./app/models/srp');
var port        = process.env.PORT || 9000;
mongoose.connect(config.database);

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  for (var i = 0; i < 8; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function seldept()
{
  var textArray = [
    'Civil',
    'Mechanical',
    'Electrical',
    'INC',
    'SnH',
    'MBA',
    'SAP',
    'Technology'
  ];
  var randomNumber = Math.floor(Math.random()*textArray.length);
  return textArray[randomNumber];
}

  var i;
  for(i=0;i<1000;i++)
  {     new srpschema({
        _id : i.toString(),
        date:Date.now(),
        displaydate : makeid(),
        department : seldept(),
        subject:makeid(),
        ddnum: makeid(),
        amount: 0,
        dealinghand: seldept(),
        courierno: makeid(),
        stockfile: '0',
        sendflag : "0",
        backup : "0",
        year : makeid(),
        sender: makeid(),
        verifydate : '0',
        actiondate: '0'
        }).save(function(err, doc){
            if(err) {
              console.log(err);
            }
            else  {
              console.log('success');
            }  
        }); 
  }