
'use strict';
var express = require('express');
var ejs 	= require('ejs');
var request = require('request');
var fs = require('fs');
var xml2js = require('xml2js');
var bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use('/static', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	res.render('pages/index');
});

app.get('/about', function(req, res) {
	res.render('pages/about');
});


app.post('/ajax', function(req, res) {

	var url = req.body.url;
	var id = url.slice(-11);
	url = 'http://video.google.com/timedtext?lang=en&v=' + id;
	console.log("Fetching transcript for-" + url);
	request(url, function(error, response, html){
		if (error ) {
			console.log(error);
			return res.send({"error": "Something went wrong"});
		}
		//console.log(response);
		if (response.statusCode != 200) {
			var error = new Error('Error 404 ');
			console.log(error);
			return res.send({"error": "Something went wrong"});
		}
		//console.log("Html-"+html)
		if (html.length == 0) {
			console.log("Transcript does not exist");
			return res.send({"error":"Sorry, transcript does not exist for this video"});
		}
		var parser = new xml2js.Parser();
		var xml = html;
		parser.parseString(xml, function (err, result) {
			if (error) {
				console.log(error);
				return res.send({"error":"Something went wrong"});
			}
	   		var textArray = result.transcript.text;
	   		//console.log(textArray);
			var subs = '';
	   		for (var i in textArray) {
				var obj = textArray[i];
	   			var subs = subs + '\n' +  obj['_'].replace('\\n',' ').replace('--', ' ');
			}
			res.send({"subs":subs});
		});
	});
});

app.listen(8080);
console.log('Server started');
