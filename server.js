var express = require('express');
var app = express();
var CB = require('cloudboost');
var bodyParser = require('body-parser');

CB.CloudApp.init('a12','497sBHgxCAyEBpeF6ytaqXCoKgTq+Ew6dS0ahlPKp9M=');
var cache = new CB.CloudObject('items');
var port = process.env.PORT || 4000;


app.set('port', port);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

router = express.Router();

router.use(function(req, res, next){
  next();
});

router.get('/', function(req, res){
  res.json({ message : 'Message is here!'});
});

router.post('/item', function(req, res){
  cache.set('name', req.body.name);
  cache.save({
    success: function(result){
      console.log(result);
      var test = JSON.stringify(result);
      res.status(200).send(test);
    }, error: function(err){
      res.status(500).send(err);
    }
  })
});

router.get('/item/:key', function(req, res){
  console.log(req.params.key);
  cache.get(req.params.key,{
    success: function(value){
      res.status(200).send({ key: req.params.key, value: value})
    },error: function(error){
      res.status(500).send(error);
    }
  })
});

router.get('/item/:key', function(req, res){
  cache.deleteItem(req.params.key,{
    success: function(value){
      res.status(200).send({ key: req.params.key, value: value});
    }, error: function(error){
      res.status(500).send(error);
    }
  })
});

app.use('/api', router); 

app.listen(app.get('port'), function(){
  console.log('Server listening on port '+ app.get('port') + '');
});