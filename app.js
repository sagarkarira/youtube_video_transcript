'use strict';
var express = require('express');
var ejs 	= require('ejs');
var request = require('request');
var fs = require('fs');
var xml2js = require('xml2js');


var app = express();

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('pages/index');
});

app.post('/ajax', function(req, res) {
	// console.log(req.body);
	// var url = req.body.url;
	var url = 'http://video.google.com/timedtext?lang=en&v=1A_CAkYt3GY';

	request(url, function(error, response, html){
		if (error) {
			console.log(error);
			return res.send("Something went wrong");
		}
		var parser = new xml2js.Parser();
		var xml = html;
		parser.parseString(xml, function (err, result) {
			if (error) {
				console.log(error);
				return res.send("Something went wrong");
			}
	   		var textArray = result.transcript.text;
	   		//console.log(textArray);
			var subs = '';
	   		for (var i in textArray) {
				var obj = textArray[i];
	   			var subs = subs + '\n' +  obj['_'].replace('\\n',' ').replace('--', ' ');
			}
			res.send(subs);
		});
	});
});

app.listen(8080);
console.log('Server started');
