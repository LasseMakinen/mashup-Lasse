var http = require("http");
var _ = require("lodash");

function start(response) {
	console.log("Request handler 'start' was called.");

	  var body = '<html>'+
	    '<head>'+
	    '<meta http-equiv="Content-Type" '+
	    'content="text/html; charset=UTF-8" />'+
	    '</head>'+
	    '<body>'+
	    '<h1>Welcome to books</h1>' +
	    '<a href="../books">list books</a>' +
	    '</body>'+
	    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function books(response) {
	console.log("Request handler 'books' was called.");

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

		        var statusHtml = '<html>' + 
		        	'<head>'+
				    '<meta http-equiv="Content-Type" '+
				    'content="text/html; charset=UTF-8" />'+
				    '</head>'+
		        	'<body>' +
		        	'<h1>Books listed</h1>' +
	    			'<a href="/">Back to frontpage</a>';

			        _.forEach(books, function(print) {
			            statusHtml += "<h1>" + print.displayName + "</h1>";
			            statusHtml += "<p>" + print.year + "</p>";
			        });

			        statusHtml += "</body></html>";

			        response.writeHead(200, {"Content-Type": "text/html"});
    				response.write(statusHtml);
    				response.end();
			    });
		})

		.on("error", function(e) {
		      console.log("Error: ", e);
		});
}
exports.start = start;
exports.books = books;