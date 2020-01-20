var express = require('express');
var http = require('http');

var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));
http.createServer(app).listen(port);


app.get("/", function(){
  res.sendFile("game.html", {root: "./public"});
});


// app.get("/game.html", function(){

// })