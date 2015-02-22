var http = require("http");
var _ = require("lodash");

function start(response) {
	console.log("Request handler 'start' was called.");

	  var body = '<html>'+
	    '<head>'+
	    '<meta http-equiv="Content-Type" '+
	    'content="text/html; charset=UTF-8" />'+
	    '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">' +
	    '</head>'+
	    '<body>'+
	    '<div class="container text-center">' +
	    '<h1>Welcome to mashup</h1>' +
	    '<a href="../books">list books about javascript</a>' +
	    '<br>' +
	    '<a href="../libraries">list libraries in Tampere</a>' +
	    '</div>' +
	    '</body>'+
	    '</html>';

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function books(response) {
	console.log("Request handler 'books' was called.");

	var url = 'http://metadata.helmet-kirjasto.fi/search/title.json?query=javascript';

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
		        	var author = authorRes.records[i].author;
		        	var year = authorRes.records[i].year;
		        	var url = authorRes.records[i].library_url;

		        	books.push({displayName: title, author: author, year: year, url: url});

		        	console.log(title, ", ", author, ", ", year, ", ", url);
		        };

		        var statusHtml = '<html>' + 
		        	'<head>'+
				    '<meta http-equiv="Content-Type" '+
				    'content="text/html; charset=UTF-8" />'+
				    '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">' +
				    '</head>'+
		        	'<body>' +
		        	'<div class="container text-center">' +
		        	'<h1>Books about javascript</h1>' +
	    			'<a href="/">Back to front page</a>';

			        _.forEach(books, function(print) {
			            statusHtml += '<h4 class="bg-info">' + print.displayName + "</h4>";
			            statusHtml += "<p>" + "- " + print.author + "</p>";
			            statusHtml += "<p>" + print.year + "</p>";
			            statusHtml += "<a href=" + print.url + "> link to book" + "</a>";
			        });

			        statusHtml += "</div></body></html>";

			        response.writeHead(200, {"Content-Type": "text/html"});
    				response.write(statusHtml);
    				response.end();
			    });
		})

		.on("error", function(e) {
		      console.log("Error: ", e);
		});
}

function libraries(response) {
	console.log("Request handler 'libraries' was called.");

	var url = 'http://opendata.navici.com/tampere/opendata/ows?service=WFS&version=2.0.0&request=GetFeature&typeName=opendata:KIRJASTOT&outputFormat=json';

		http.get(url, function(res) {
			console.log(url);
		    var body = "";
		    var libraries = [];

		    res.on("data", function(chunk) {
		        body += chunk;
		    });

		    res.on("end", function() {

		        var authorRes = JSON.parse(body);

		        for (var i = 0; i < authorRes.features.length; i++) {
		        	var name = authorRes.features[i].properties.NIMI;
		        	var address = authorRes.features[i].properties.OSOITE;
		        	var zip = authorRes.features[i].properties.POSTINUMERO;
		        	var phone = authorRes.features[i].properties.PUHELIN;

		        	libraries.push({name: name, address: address, zip: zip, phone: phone});
		        	console.log(name, ", ", address, ", ", zip, ", ", phone);
		        };

		        var statusHtml = '<html>' + 
		        	'<head>'+
				    '<meta http-equiv="Content-Type" '+
				    'content="text/html; charset=UTF-8" />'+
				    '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">' +
				    '</head>'+
		        	'<body>' +
		        	'<div class="container text-center">' +
		        	'<h1>Tampere libraries</h1>' +
	    			'<a href="/">Back to front page</a>';

			        _.forEach(libraries, function(print) {
			            statusHtml += '<h3 class="bg-info">' + print.name + "</h3>";
			            statusHtml += "<p>" + print.address + "</p>";
			            statusHtml += "<p>" + print.zip + "</p>";
			            statusHtml += "<p>" + print.phone + "</p>";
			        });

			        statusHtml += "</div></body></html>";

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
exports.libraries = libraries;