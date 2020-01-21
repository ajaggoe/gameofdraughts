var express = require('express');
var http = require('http');
var websocket = require("ws");
var path = require('path');

var port = process.argv[2];
var app = express();

var players = 0;

var indexRouter = require('./routes/index');
var Game = require('./game')
//var messages = require('./public/javascripts/messages')
var server = http.createServer(app);


var gameStatus = require("./stattrack")

app.use(express.static(__dirname + "/public"));


app.get("/game", indexRouter);

app.get("/", function(req, res){
  res.sendFile("game.html", {root: "./public"});
  res.sendFile("style.css", {root: "./public/stylesheets"})
});

// app.get("/", (req, res) => {
//   res.render("splash.ejs", {
//     gamesCompletedRed: gameStatus.gamesCompleted,
//     gamesCompletedWhite: gameStatus.recentTime,
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
  websockets[conID] = currentGame;

  console.log(
    "Player %s placed in game %s as %s",
    conID,
    currentGame.id,
    playerType
  );

  if (currentGame.hasTwoConnectedPlayers()) {
    currentGame = new Game(gameStatus.gamesInitialized++);
  }

  con.on("message", function incoming(message) {
    let msg = JSON.parse(message);
    let gameObj = websockets[conID  ];
    let isPlayer1 = gameObj.player1 == con ? true : false;
    let isPlayer2 = gameObj.player2 == con ? true : false;

    if(gameObj.hasTwoConnectedPlayers()) {
      gameObj.playerturn = 1;
      if(isPlayer1 && gameObj.playerturn == 1) {
        gameObj.addToColumn(oMsg)
        let field = gameObj.gameBoard;
        console.log(field);
        gameObj.player1.send(JSON.stringify(field))
        gameObj.player2.send(JSON.stringify(field))
      }

      if(isPlayer2 && gameObj.playerturn == 2) {
        gameObj.addToColumn(oMsg)
        let field = gameObj.gameBoard;
        console.log(field);
        gameObj.player1.send(JSON.stringify(field))
        gameObj.player2.send(JSON.stringify(field))
      }

      if(gameObj.hasEnded()) {
        gameStatus.gamesCompleted++
        gameObj.player1.send(gameObj.gameState)
        gameObj.player2.send(gameObj.gameState)
      }
    }
    else{
      gameObj.playerturn = 0;
      gameObj.player1.send(JSON.stringify(field))
      gameObj.player2.send(JSON.stringify(field))
    }
    
  }) 

  con.on("close", function(code) {
    /*
     * code 1001 means almost always closing initiated by the client;
     * source: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
     */
    console.log(con.id + " disconnected ...");

    if (code == "1001") {
      /*
       * if possible, abort the game; if not, the game is already completed
       */
      let gameObj = websockets[con.id];

      if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
        gameObj.setStatus("ABORTED");

        /*
         * determine whose connection remains open;
         * close it
         */
        try {
          gameObj.playerA.close();
          gameObj.playerA = null;
        } catch (e) {
          console.log("Player A closing: " + e);
        }

        try {
          gameObj.playerB.close();
          gameObj.playerB = null;
        } catch (e) {
          console.log("Player B closing: " + e);
        }
      }
    }
  });

});

server.listen(port);  