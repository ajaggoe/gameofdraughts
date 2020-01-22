var express = require('express');
var http = require('http');
var websocket = require("ws");
var path = require('path');

var port = process.argv[2];
var app = express();

var players = 0;
var timesVisited = 0;

var indexRouter = require('./routes/index');
var Game = require('./game')
//var messages = require('./public/javascripts/messages')
var server = http.createServer(app);

var gameStatus = require("./stattrack")
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"));

app.get("/play", indexRouter);
app.get("/splash", (req, res) => {
  res.render("splash.ejs", {
    stark: gameStatus.gamesCompletedRed,
    lannister: gameStatus.gamesCompletedWhite,
    ongoingGames: gameStatus.gamesInitialized-1
  });

});

app.get("/", (req, res) => {
  res.render("splash.ejs", {
    stark: gameStatus.gamesCompletedRed,
    lannister: gameStatus.gamesCompletedWhite,
    ongoingGames: gameStatus.gamesInitialized-1,
  });

});



const wss = new websocket.Server({ server }); 
var websockets = {};

// app.use(cookies("myrandomsecret")); // this will encrypt cookies to avoid users tampering with them

// app.use(function(req, res, next) {
//     var userId = req.signedCookies.userId;
//     if(userId === undefined) { // no cookie
//         userId = ++usersCount; // The app now identified a new user
//         console.log("# Setting new cookie for user " + userId);
//     }
//     req.userId = parseInt(userId); // store the parsed userId for the next components
//     next(); // call on the next component
// });



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
  con.id = connectionID++;
  let playerType = currentGame.addPlayer(con);
  websockets[con.id] = currentGame;

  var i;
  let player1 = {};
  console.log(
    "Player %s placed in game %s as %s",
    con.id,
    currentGame.id,
    playerType
  );

  con.send(playerType == "1" ? '{"type": "isplayer", "player": 1}' : '{"type": "isplayer", "player": 2}');

  if (currentGame.hasTwoConnectedPlayers()) {
    currentGame = new Game(gameStatus.gamesInitialized++);
    websockets[con.id].player1.send('{"type": "start"}');
    websockets[con.id].player2.send('{"type": "start"}');

  }

  // if (!player1[i]) {
  //   var obj = websockets[con.id]
  //   con.send('{"type": "player", "player": 1}')
  //   player1[i] = 1;
  // } else {
  //   con.send(JSON.parse('{"player": 2}'))
  //   i++
  // }

  con.on("message", function incoming(message) {
    let msg = JSON.parse(message);
    let gameObj = websockets[con.id];
    let isPlayer1 = gameObj.player1 == con ? true : false;
    let isPlayer2 = gameObj.player2 == con ? true : false;


    if(gameObj.hasTwoConnectedPlayers()) {
      if(isPlayer1) {
        // gameObj.player1.send(JSON.stringify(msg))
        gameObj.player2.send(JSON.stringify(msg))
        console.log(JSON.stringify(msg))
      }

      if(isPlayer2) {
        gameObj.player1.send(JSON.stringify(msg))
        console.log(JSON.stringify(msg))
        // gameObj.player2.send(JSON.stringify(msg))
      }

     
    }

    if(msg.type == "winner") {
      if(msg.winner == '1') { gameStatus.gamesCompletedRed++; };
      if(msg.winner == '2') { gameStatus.gamesCompletedWhite++; };
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

      gameObj.setStatus("ABORTED");

      /*
        * determine whose connection remains open;
        * close it
        */
      try {
        gameObj.player1.close();
        gameObj.player1 = null;
      } catch (e) {
        console.log("Stark closing: " + e);
      }

      try {
        gameObj.player2.close();
        gameObj.player2 = null;
      } catch (e) {
        console.log("Lannister closing: " + e);
      }
    }
  });

});

server.listen(port);  