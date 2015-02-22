var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {};
handle["/"] = requestHandlers.start;
handle["/books"] = requestHandlers.books;
handle["/libraries"] = requestHandlers.libraries;

server.start(router.route, handle);