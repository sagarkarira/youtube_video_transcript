'use strict';
var request = require('request');
var fs = require('fs');
var xml2js = require('xml2js');

var url = 'http://video.google.com/timedtext?lang=en&v=1A_CAkYt3GY';

request(url, function(error, response, html){
	var parser = new xml2js.Parser();
	var xml = html;
	parser.parseString(xml, function (err, result) {
   		var textArray = result.transcript.text;
   		console.log(textArray);
   		for (var i in textArray) {
			var obj = textArray[i];
   			console.log(obj['_'].replace('\\n',' ').replace('--', ' '));
   		}

   	
	});
});