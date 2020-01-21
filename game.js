/* every game has two players, identified by their WebSocket */
var game = function(gameID) {
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.redpieces = null; //first player to join the game, can set the word
    this.whitepieces = null; //first player to join the game, can set the word
    this.player1pieces = 12,
    this.player2pieces = 12,
    this.playerTurn = 1,
    this.opponentJumpAvailable = false,
    this.Pieces = [];
    //used to save all tile instances
    this.Tiles = [];


    this.gameState = "0 JOINT"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted
    this.gameBoard = [  [-1    ,21   ,-1    ,22     ,-1     ,23     ,-1     ,24],
                        [17    ,-1   ,18    ,-1     ,19     ,-1     ,20     ,-1],
                        [-1    ,13   ,-1    ,14     ,-1     ,15     ,-1     ,16],
                        [0     ,-1   ,0     ,-1     ,0      ,-1     ,0      ,-1],
                        [-1    ,0    ,-1    ,0      ,-1     ,0      ,-1     ,0 ],
                        [12    ,-1   ,11    ,-1     ,10     ,-1     ,9      ,-1],
                        [-1    ,8    ,-1    ,7      ,-1     ,6      ,-1     ,5 ],
                        [4     ,-1   ,3     ,-1     ,2      ,-1     ,1      ,-1]];

  };
  
  
    game.prototype.setStatus = function(w) {
        console.assert(
        typeof w == "string",
        "%s: Expecting a string, got a %s",
        arguments.callee.name,
        typeof w
    );
  
    this.gameState = w;
    console.log("[STATUS] %s", this.gameState);
  };



        // changes the players turn, and sets the game-status text
    game.prototype.changePlayer = function() {
        if(this.playerTurn == 1) {
            this.playerTurn = 2;
            console.log('changu puleyaru');
            removePieceAvailability(this.playerTurn);
            return;
        }
        if(this.playerTurn == 2) {
            this.playerTurn = 1;
            console.log('changu puleyaru');
            removePieceAvailability(this.playerTurn);
            return;
        }
    };


    game.prototype.whoCanMove = function() {

        var jumpPieces = returnJumpPieces();
        var normalPieces = returnNormalPieces();

        Pieces.forEach(function(piece) {
            piece.element.removeClass('available');
        });

        if(jumpPieces.length > 0){
            this.opponentJumpAvailable = true;
            jumpPieces.forEach(function(piece){
                piece.element.addClass('available');
            });
            
        }
        else if(normalPieces.length > 0) {
            this.opponentJumpAvailable = false;
            normalPieces.forEach(function(piece) {
                piece.element.addClass('available');
            })
        }
        else {
            this.changePlayer();
            this.whoCanMove();
        }
    }

    game.prototype.changeScore = function(){
        $('.red-captured .center').html(parseInt(12-this.player2pieces));
        $('.white-captured .center').html(parseInt(12-this.player1pieces));

        if(this.player1pieces == 0) {
            $('.game-status').html('RED HAS WON');
            alert("HOUSE STARK HAS WON");
        }
        if(this.player2pieces == 0) {
            $('.game-status').html('WHITE HAS WON');
            alert("HOUSE LANNISTER HAS WON");
        }
    }

    game.prototype.isValidNormalPosition = function(piece, position) {
             
        if(position[0] > -1 && position[0] < 8 && position[1] > -1 && position[1] < 8) {
            if(this.board[position[1]][position[0]] == 0){ 
                var piece = piece;
                
                if(piece) {
                    
                    if(piece.position[0]-position[0] === 1 || piece.position[0]-position[0] === -1) {
                            // console.log("PLACE");
                            // console.log(piece.position[1]-position[1]);
                        if(piece.player == '1' && piece.position[1]-position[1] == 1) {

                            return true;
                        }
                        if(piece.player == '2' && piece.position[1]-position[1] == -1) {
                            return true;
                        }
                        if(piece.isKing) {
                            if(piece.player == '1' && piece.position[1]-position[1] == -1){
                                return true;
                            }
                            if(piece.player == '2' && piece.position[1]-position[1] == 1) {
                                return true;
                            }
                        }
                    }
                }
            }
            else return false;
        }
    }

    game.prototype.isValidJumpPosition= function(piece, position) {
        if(position[0] > -1 && position[0] < 8 && position[1] > -1 && position[1] < 8) {
            var dx = piece.position[0]-position[0];
            var dy = piece.position[1]-position[1];
            var x = piece.position[0];
            var y = piece.position[1]

            if(this.board[position[1]][position[0]] == 0) {
                if(piece) {
                    
                    if(dy == 2 && piece.player == '1') { 
                        if(dx == 2 || dx == -2) {
                            if(this.board[dy/2 + position[1]][dx/2 + position[0]] > 12) {
                                return true
                            }
                        }
                    } 
                    if(dy == -2 && piece.player == '2') {
                       
                        if(dx == 2 || dx == -2) {
                            if(this.board[dy/2 + position[1]][dx/2 + position[0]] < 13 && this.board[dy/2 + position[1]][dx/2 + position[0]] > 0) {
                                return true
                            }
                        }

                    }
                    if((dy == -2 || dy == 2) && piece.isKing) {
                        if(dx == 2 || dx == -2) {
                           
                            if(piece.player == '1' && this.board[dy/2 + position[1]][dx/2 + position[0]] > 12) {
                                return true;
                            }
                            if(piece.player == '2' && this.board[dy/2 + position[1]][dx/2 + position[0]] < 13 && this.board[dy/2 + position[1]][dx/2 + position[0]] > 0) {
                                return true;
                            }
                        }
                       
                    }
                }
            }
        }
        return false;
    }

  game.prototype.hasTwoConnectedPlayers = function() {
    return this.gameState == "2 JOINT";
  };
  
  game.prototype.addPlayer = function(p) {
    console.assert(
      p instanceof Object,
      "%s: Expecting an object (WebSocket), got a %s",
      arguments.callee.name,
      typeof p
    );
  
    // if (this.gameState != "0 JOINT" && this.gameState != "1 JOINT") {
    //   return new Error(
    //     "Invalid call to addPlayer, current state is %s",
    //     this.gameState
    //   );
    // }
  
    /*
     * revise the game state
     */
  
    if(this.gameState == '1 JOINT') {
        this.setStatus("2 JOINT")
      }
      else {
        this.setStatus("1 JOINT")
      }
    
    // var error = this.setStatus("1 JOINT");
    // if (error instanceof Error) {
    //   this.setStatus("2 JOINT");
    // }
  
    if (this.player1 == null) {
      this.player1 = p;
      return "1";
    } else {
      this.player2 = p;
      return "2";
    }
  };

  module.exports = game;