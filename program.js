var http = require('http');
var _ = require('lodash');

var statusHtml = "<html><body>No data available</body></html>";

	http.createServer(function (req, res) {
  		res.writeHead(200, {'Content-Type': 'text/html'});
  		res.end(statusHtml);

		var url = 'http://metadata.helmet-kirjasto.fi/search/author.json?query=Campbell';

		http.get(url, function(res) {

		    var body = "";
		    var books = [];

		    res.on("data", function(chunk) {
		        body += chunk;
		    });

		    res.on("end", function() {

		        var authorRes = JSON.parse(body);

		        for (var i = 0; i < authorRes.records.length; i++) {
		        	var title = authorRes.records[i].title;
		        	var year = authorRes.records[i].year;

		        	books.push({displayName: title, year: year});

		        	console.log(title, ", ", year);
		        };

		        statusHtml = "<html><body>";
			        _.forEach(books, function(print) {
			            statusHtml += "<h1>" + print.displayName + "</h1>";
			            statusHtml += "<p>" + print.year + "</p>";
			        });

			        statusHtml += "</body></html>";
			    });

		})

		.on("error", function(e) {
		      console.log("Error: ", e);
		});

	})
	.listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');