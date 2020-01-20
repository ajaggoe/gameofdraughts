window.onload = function() {

    //gameBoard.position[1] == x
    //gameBoard.position[0] == y
    var gameBoard = [   [-1    ,21   ,-1    ,22     ,-1     ,23     ,-1     ,24],
                        [17    ,-1   ,18    ,-1     ,19     ,-1     ,20     ,-1],
                        [-1    ,13   ,-1    ,14     ,-1     ,15     ,-1     ,16],
                        [0     ,-1   ,0     ,-1     ,0      ,-1     ,0      ,-1],
                        [-1    ,0    ,-1    ,0      ,-1     ,0      ,-1     ,0 ],
                        [12    ,-1   ,11    ,-1     ,10     ,-1     ,9      ,-1],
                        [-1    ,8    ,-1    ,7      ,-1     ,6      ,-1     ,5 ],
                        [4     ,-1   ,3     ,-1     ,2      ,-1     ,1      ,-1]];

    //used to save all piece instances
    var Pieces = [];
    //used to save all tile instances
    var Tiles = [];

    var Board = {
        board: gameBoard,
        score: {player1: 0, player2: 0},
        player1pieces: 12,
        player2pieces: 12,
        playerTurn: 1,
        opponentJumpAvailable: false,
        tiles: $('div.tiles'),
        location: ['0px','64px','128px','192px','256px','320px','384px','448px'],
        
        init: function (){
            this.changeScore();
        //    new Audio("../data/NyanCatoriginal.wav").play()
            for(row in this.board) {
                for(column in this.board[row]) {
                    if(row%2==0) {
                        if(column%2==1) {
                            var index = (parseInt(row*8) + parseInt(column)).toString();

                            let tile = document.createElement('div');
                            tile.classList.add("tile");
                            tile.id = 't'+index.toString();
                            tile.style.width = '64px';
                            tile.style.height = '64px';
                            tile.style.backgroundColor = 'black';
                            tile.style.position = 'absolute';
                            tile.style.top = this.location[row];
                            tile.style.left = this.location[column];
                            this.tiles.append(tile); 

                            Tiles[index] = new Tile($('#'+tile.id), [parseInt(column),parseInt(row)]);
                        } 
                        
                    }else {
                        if(column%2==0) {
                            var index = (parseInt(row*8) + parseInt(column)).toString();

                            let tile = document.createElement('div');
                            tile.classList.add("tile");
                            tile.id = 't'+index.toString();
                            tile.style.width = '64px';
                            tile.style.height = '64px';
                            tile.style.backgroundColor = 'black';
                            tile.style.position = 'absolute';
                            tile.style.top = this.location[row];
                            tile.style.left = this.location[column];
                            this.tiles.append(tile);                           

                            Tiles[index] = new Tile($('#'+tile.id), [parseInt(column),parseInt(row)]);
                        }
                    }
                    if(this.board[row][column] > 12) {
                        let piece = document.createElement('div');
                        piece.id = this.board[row][column].toString();
                        piece.classList.add('piece');

                        piece.style.top = this.location[row];
                        piece.style.left = this.location[column];
                        $('.redpiece').append(piece);

                        Pieces[this.board[row][column]] = new Piece($("#"+this.board[row][column]),[parseInt(column),parseInt(row)]);
                    }
                    else if(this.board[row][column] < 13 && this.board[row][column] > 0) {
                        let piece = document.createElement('div');
                        piece.id = this.board[row][column].toString();
                        piece.classList.add('piece');

                        piece.style.top = this.location[row];
                        piece.style.left = this.location[column];
                        $('.whitepiece').append(piece);

                        Pieces[this.board[row][column]] = new Piece($("#"+this.board[row][column]),[parseInt(column),parseInt(row)]);
                    }
                }
            }

            this.whoCanMove();
            removePieceAvailability(this.playerTurn);
        },

        // returns 0 if nobody won, 1 if p1 won, 2 if p2 won
        checkIfWon: function() {
            if(this.score.player1 == 12) { return 1; }
            if(this.score.player2 == 12) { return 2; }
            return 0;
        },

        // changes the players turn, and sets the game-status text
        changePlayer: function() {
            if(this.playerTurn == 1) {
                $('.game-status').html('Red\'s turn!');
                this.playerTurn = 2;
                console.log('changu puleyaru');
                removePieceAvailability(this.playerTurn);
                return;
            }
            if(this.playerTurn == 2) {
                $('.game-status').html('White\'s turn!');
                this.playerTurn = 1;
                console.log('changu puleyaru');
                removePieceAvailability(this.playerTurn);
                return;
            }
        }, 
        
        // checks if the selected piece is of the player in turn
        isPlayerTurn: function(element) {
            if(element.parent().attr("class") == "redpiece" && this.playerTurn == 2) return true;
            if(element.parent().attr("class") == "whitepiece" && this.playerTurn == 1) return true;
            return false;
        },

        //piece = the piece to mremvove; position = position to move to
        isValidNormalPosition: function(piece, position) {
             
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
        },

        isValidJumpPosition: function(piece, position) {
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
        },

        // loops through all pieces and checks who can move and sets the canMove attr to true;
        // and adds the class "available" to that piece
        whoCanMove: function() {

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
        },

        changeScore: function(){
            $('.values').html('Remaining pieces:<br>'+this.player1pieces+' white pieces<br>'+this.player2pieces+' red pieces');

            if(this.player1pieces == 0) {
                $('.game-status').html('RED HAS WON');
            }
            if(this.player2pieces == 0) {
                $('.game-status').html('WHITE HAS WON');
            }
        }
        
    }

    // position = [x,y]
    function Tile(element, position) {
        //element on the DOM
        this.element = element;
        //position on the board [x,y]
        this.position = position;
    }

    // position = [x,y]
    function Piece(element, position) {
        //element on the DOM
        this.element = element;
        //position on the board [x,y]
        this.position = position;
        this.player = '';

         // not all pieces are allowed to move initially
        this.canMove = false;

        this.isDefeated = false;
        

        // assigns a piece to the corresponding player by checking the id
        if(this.element.attr('id') < 13) {
            this.player = 1;
        } else {
            this.player = 2;
        }
        this.isKing = false;
        //TODO
        this.makeKing = function () {
            if(!this.isKing) {
                if(this.player == 1) {
                    if(this.position[1] == 0) {
                        this.isKing = true;
                        this.element.css('backgroundColor', 'lightgray');
                    }
                }
                if(this.player == 2) {
                    if(this.position[1] == 7) {
                        this.isKing = true;
                        this.element.css('backgroundColor', 'pink');
                    }
                }
            }
        };

        this.remove = function() {
            Board.board[this.position[1]][this.position[0]] = 0;
            this.element.css('display', 'none');
            Board.changeScore();
            this.isDefeated = true;
            if(this.player == '1'){
                Board.player1pieces--;
                Board.score.player1++;
            }
            if(this.player == '2') {
                Board.player2pieces--;
                Board.score.player2++;
            }
            return;
        };
       

        this.cleanUpCode = function(pos){
            this.element.css('top', Board.location[this.position[1]]);
            this.element.css("left", Board.location[this.position[0]]);
            Board.changeScore();
            console.log("new position: x = "+pos[0]+", y = "+pos[1]);
        };
        // move function for the selected piece
        // piece selection in at bottom of document
        this.move = function(pos) {
            
            if(Board.isValidNormalPosition(this, pos)) {
                removeAvailableTiles();
                Board.board[pos[1]][pos[0]] = Board.board[this.position[1]][this.position[0]];
                Board.board[this.position[1]][this.position[0]] = 0;
                this.position = pos;
               
                this.makeKing();

                this.cleanUpCode(pos);

                this.element.removeClass("selected");
                Board.changePlayer();
                Board.whoCanMove();

                // if(this.canJump){
                //     this.jumpOverPiece();
                // }
            }
        };

        this.jump = function(pos) {
            debugger;
            if(Board.isValidJumpPosition(this, pos)) {
                removeAvailableTiles();

                var dx = this.position[0]-pos[0];
                var dy = this.position[1]-pos[1];
                var killed = Pieces[Board.board[(dy/2)+pos[1]][(dx/2)+pos[0]]]

                Board.board[pos[1]][pos[0]] = Board.board[this.position[1]][this.position[0]];
                Board.board[this.position[1]][this.position[0]] = 0;
                this.position = pos;

                killed.remove();

                this.makeKing();

                if(this.canOpponentJump()) {
                    Pieces.forEach(function(tile){ tile.element.removeClass("available") });
                    this.element.addClass('available');
                    addAvailableTiles();
                    this.cleanUpCode();
                } 
                else {
                    this.cleanUpCode(pos);
                    this.element.removeClass("selected");
                    Board.changePlayer();
                    Board.whoCanMove();
                }
            }
        }

        //TODO checks for KINGU
        this.canNormalJump = function(){
            if(this.canOpponentJump()) { return false; }
            else {
                if(this.player == '1'){
                    if(Board.isValidNormalPosition(this, [this.position[0]-1,this.position[1]-1]) || Board.isValidNormalPosition(this, [this.position[0]+1,this.position[1]-1])) {
                        return true;
                    }
                    if(this.isKing) {
                        if(Board.isValidNormalPosition(this,[this.position[0]-1,this.position[1]+1]) || Board.isValidNormalPosition(this,[this.position[0]+1,this.position[1]+1])) {
                            return true;
                        }
                    }
                }
                if(this.player == '2'){
                    if(Board.isValidNormalPosition(this, [this.position[0]-1,this.position[1]+1]) || Board.isValidNormalPosition(this, [this.position[0]+1,this.position[1]+1])) {
                        return true;
                    }
                }
                if(this.isKing) {
                    if(Board.isValidNormalPosition(this,[this.position[0]-1,this.position[1]-1]) || Board.isValidNormalPosition(this,[this.position[0]+1,this.position[1]-1])) {
                        return true;
                    }
                }
                return false;
            }
        };

        //TODO checks for KING
        this.canOpponentJump = function(){
            if(this.player == '1') {
                if(Board.isValidJumpPosition(this,[this.position[0]-2,this.position[1]-2]) || Board.isValidJumpPosition(this,[this.position[0]+2,this.position[1]-2])) {
                    return true;
                }
                if(this.isKing) {
                    if(Board.isValidJumpPosition(this,[this.position[0]-2,this.position[1]+2]) || Board.isValidJumpPosition(this,[this.position[0]+2,this.position[1]+2])) {
                        return true;
                    }
                }
                return false;
            }
            else if(this.player == '2') {
                if(Board.isValidJumpPosition(this,[this.position[0]-2,this.position[1]+2]) || Board.isValidJumpPosition(this,[this.position[0]+2,this.position[1]+2])) {
                    return true;
                }
                if(this.isKing) {
                    if(Board.isValidJumpPosition(this,[this.position[0]-2,this.position[1]-2]) || Board.isValidJumpPosition(this,[this.position[0]+2,this.position[1]-2])) {
                        return true;
                    }
                }
                return false;
            }
        };
    }

    Board.init();


/* 
EVENTS
*/

    $('div.piece').on("click", function() {
        //var tileHighlights = checkTiles();
        var player = Board.isPlayerTurn($(this));
         
        console.log("piece selected");  
        if(player && $(this).hasClass('available')) {
            console.log("correct player");
            if($(this).hasClass("selected")) {

                removeAvailableTiles();

                $(this).removeClass("selected"); 
            }
            else {
                removeAvailableTiles();

                $(".piece").each(function() { $(this).removeClass("selected"); });
                $(this).addClass("selected");

                addAvailableTiles();
            }

            


        } else { console.log("incorrect player... NO"); }
    });
    
    $('.tile').on('click', function(){
        if($(this).hasClass('available')) {
            //select the tile selected
            var piece = Pieces[parseInt($('.piece.selected').attr('id'))];
            console.log("attricute piece id "+$('.piece.selected').attr('id'))
            var tile = Tiles[parseInt($(this).attr('id').replace('t',''))];


            console.log("tile id "+$(this).attr('id'));
            if(!Board.opponentJumpAvailable) { piece.move(tile.position); }
            else if(Board.opponentJumpAvailable) { piece.jump(tile.position); }
            
        }
    });
    



    function removeAvailableTiles() {
        Tiles.forEach(function(tile) {
            tile.element.removeClass('available');
        })
    }

    function addAvailableTiles() {
        var jumpPieces = returnJumpPieces();
        var normalPieces = returnNormalPieces();
        if(jumpPieces.length > 0) {
            var piece = Pieces[parseInt($('.piece.selected').attr('id'))];
            var x = piece.position[0];
            var y = piece.position[1];
            var tile = undefined;
        
            if(Board.isValidJumpPosition(piece, [x-2,y-2])) {
                tile = Tiles[parseInt(parseInt((y-2)*8) + parseInt(x-2))];
                tile.element.addClass('available');
            }
            if(Board.isValidJumpPosition(piece, [x-2,y+2])) {
                tile = Tiles[parseInt(parseInt((y+2)*8) + parseInt(x-2))];
                tile.element.addClass('available');
            }
            if(Board.isValidJumpPosition(piece, [x+2,y-2])) {
                tile = Tiles[parseInt(parseInt((y-2)*8) + parseInt(x+2))];
                tile.element.addClass('available');
            }
            if(Board.isValidJumpPosition(piece, [x+2,y+2])) {
                tile = Tiles[parseInt(parseInt((y+2)*8) + parseInt(x+2))];
                tile.element.addClass('available');
            }
            
        }
        else {
            var piece = Pieces[parseInt($('.piece.selected').attr('id'))];
            var x = piece.position[0];
            var y = piece.position[1];
            var tile = undefined;
        
            if(Board.isValidNormalPosition(piece, [x-1,y-1])) {
                tile = Tiles[parseInt(parseInt((y-1)*8) + parseInt(x-1))];
                tile.element.addClass('available');
            }
            if(Board.isValidNormalPosition(piece, [x-1,y+1])) {
                tile = Tiles[parseInt(parseInt((y+1)*8) + parseInt(x-1))];
                tile.element.addClass('available');
            }
            if(Board.isValidNormalPosition(piece, [x+1,y-1])) {
                tile = Tiles[parseInt(parseInt((y-1)*8) + parseInt(x+1))];
                tile.element.addClass('available');
            }
            if(Board.isValidNormalPosition(piece, [x+1,y+1])) {
                tile = Tiles[parseInt(parseInt((y+1)*8) + parseInt(x+1))];
                tile.element.addClass('available');
            }
        }
    }

    // function addAvailableTiles() {
    //     checkTiles().forEach(function(tile){
    //         tile.element.addClass('available');
    //     });
    // }

    function removePieceAvailability(playerTurn) {
        for(index in Pieces) {
            if(Pieces[index] && playerTurn == 1) {
                if(parseInt(Pieces[index].element.attr("id")) > 12) { Pieces[index].element.removeClass('available'); }
            }else if(Pieces[index] && playerTurn == 2) {
                if(parseInt(Pieces[index].element.attr("id")) < 13) { Pieces[index].element.removeClass('available'); }
            }
        }
    }

    // returns all pieces that can and are allowed to normal jump
    function returnNormalPieces() {
        var normalPieces = [];
        Pieces.forEach(function(piece, index) {
            if(Board.playerTurn == 1) {
                if(index < 13) {
                    if(piece.canNormalJump() && !piece.isDefeated) {
                        normalPieces.push(piece);
                    }
                }
            }
            else if(Board.playerTurn == 2) {
                if(index > 12) {
                    if(piece.canNormalJump() && !piece.isDefeated) {
                        normalPieces.push(piece);
                    }
                }
            }
        });

        return normalPieces;
    }

    // returns all pieces that can and are allowed to opponent jump
    function returnJumpPieces() {
        var jumpPieces = [];
        Pieces.forEach(function(piece, index) {
            if(Board.playerTurn == 1) {
                if(index < 13) {
                    if(piece.canOpponentJump() && !piece.isDefeated) {
                        jumpPieces.push(piece);
                    }
                }
            }
            else if(Board.playerTurn == 2) {
                if(index > 12) {
                    if(piece.canOpponentJump() && !piece.isDefeated) {
                        jumpPieces.push(piece);
                    }
                }
            }
        });

        return jumpPieces;
    }

}

