var express = require('express');
var http = require('http');
var websocket = require("ws");
var path = require('path');

var port = process.argv[2];
var app = express();


var indexRouter = require('./routes/index');
var Game = require('./game')
var messages = require('./public/javascripts/messages')
var server = http.createServer(app);


var gameStatus = require("./stattrack")

app.use(express.static(__dirname + "/public"));


app.get("/game", indexRouter);

app.get("/", function(req, res){
  res.sendFile("game.html", {root: "./public"});
});

// app.get("/", (req, res) => {
//   res.render("splash.ejs", {
//     gamesCompleted: gameStatus.gamesCompleted,
//     recentTime: gameStatus.recentTime,
//     onlinePlayers: players
//   });
// });

const wss = new websocket.Server({ server }); 
var websockets = {};

setInterval(function() {
  for (let i in websockets) {
    if (Object.prototype.hasOwnProperty.call(websockets,i)) {
      let gameObj = websockets[i];
      //if the gameObj has a final status, the game is complete/aborted
      if (gameObj.finalStatus != null) {
        delete websockets[i];
      }
    }
  }
}, 50000);

var currentGame = new Game(gameStatus.gamesInitialized++);
var connectionID = 0; //each websocket receives a unique ID

wss.on('connection', function connection(ws) {

  players++
  let con = ws;
  let conID = connectionID++;
  let playerType = currentGame.addPlayer(con);
  websockets[conId] = currentGame;

  console.log(
    "Player %s placed in game %s as %s",
    conid,
    currentGame.id,
    playerType
  );

  if (currentGame.hasTwoConnectedPlayers()) {
    currentGame = new Game(gameStatus.gamesInitialized++);
  }

  con.on("message", function incoming(message) {
    let msg = JSON.parse(message);
    let gameObj = websockets[conid];
    let isRed = gameObj.red == con ? true : false;
    let isYellow = gameObj.yellow == con ? true : false;

    
  }) 

  con.on("close", function(code) {
    /*
     * code 1001 means almost always closing initiated by the client;
     * source: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
     */
    console.log(conid + " disconnected ...");
    players--;


  });

});

server.listen(port);  