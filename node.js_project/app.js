var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var leBonCoin = require('./leBonCoin');
var meilleursAgents = require('./meilleursAgents');
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('view engine', 'ejs');

app.get('/home', function (req, res) {
  var data = "";
  res.render('index', {address: req.query, data: data});
});

app.post('/home', urlencodedParser, function (req, res) {
  var url = req.body.url;
  leBonCoin(url, function(dataLeBonCoin) {
		meilleursAgents(dataLeBonCoin, function(resultat){
			isResult = resultat;
			res.render('index', {address: req.query, data: isResult});
		});
	});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
