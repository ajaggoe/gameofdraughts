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
        tiles: $('div.tiles'),
        location: ['0px','64px','128px','192px','256px','320px','384px','448px'],
        
        init: function (){
            this.changeScore();
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
                        // piece.style.display = 'inline-box';
                        // piece.style.width = '60px';
                        // piece.style.height = '60px';
                        // piece.style.margin = '2px';
                        // piece.style.borderRadius = '50%';
                        // piece.style.backgroundColor = 'red';
                        // piece.style.position = 'absolute';
                        piece.style.top = this.location[row];
                        piece.style.left = this.location[column];
                        $('.redpiece').append(piece);

                        Pieces[this.board[row][column]] = new Piece($("#"+this.board[row][column]),[parseInt(column),parseInt(row)]);
                    }
                    else if(this.board[row][column] < 13 && this.board[row][column] > 0) {
                        let piece = document.createElement('div');
                        piece.id = this.board[row][column].toString();
                        piece.classList.add('piece');
                        // piece.style.display = 'inline-box';
                        // piece.style.width = '60px';
                        // piece.style.height = '60px';
                        // piece.style.margin = '2px';
                        // piece.style.borderRadius = '50%';
                        // piece.style.backgroundColor = 'white';
                        // piece.style.position = 'absolute';
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

        //piece = the piece to move; position = position to move to
        isValidPosition: function(piece, position) {
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

        // loops through all pieces and checks who can move and sets the canMove attr to true;
        // and adds the class "available" to that piece
        whoCanMove: function() {
            for(index in Pieces) {
                if(Pieces[index]) {
                    let piece = Pieces[index];
                    piece.element.removeClass('available');
                    
                    if(piece.player == 1) {
                        if(this.isValidPosition(piece, [piece.position[0]-1, piece.position[1]-1]) || this.isValidPosition(piece, [piece.position[0]+1, piece.position[1]-1])) {
                            piece.canMove = true;
                            piece.element.addClass("available");
                            console.log(piece.element.attr('id')+' is available');
                        }
                    }
                    else if(piece.player == 2) {
                        if(this.isValidPosition(piece, [piece.position[0]-1, piece.position[1]+1]) || this.isValidPosition(piece, [piece.position[0]+1, piece.position[1]+1])) {
                            piece.canMove = true;
                            piece.element.addClass('available');
                            console.log(piece.element.attr('id')+' is available');
                        }
                    }
                    else {
                        piece.canMove = false;
                    }
                }
            }
        },

        changeScore: function(){
            $('.values').html('Remaining pieces:<br>'+this.player1pieces+' white pieces<br>'+this.player2pieces+' red pieces');
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
        // assigns a piece to the corresponding player by checking the id
        if(this.element.attr('id') < 13) {
            this.player = 1;
        } else {
            this.player = 2;
        }
        this.isKing = false;
        //TODO
        this.makeKing = function () {
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
        };

        // not all pieces are allowed to move initially
        this.canMove = false;

        this.cleanUpCode = function(pos){
            this.element.css('top', Board.location[this.position[1]]);
            this.element.css("left", Board.location[this.position[0]]);
            this.element.removeClass("selected");
            console.log("new position: x = "+pos[0]+", y = "+pos[1]);
        }
        // move function for the selected piece
        // piece selection in at bottom of document
        this.move = function(pos) {
            if(Board.isValidPosition(this, pos)) {
                removeAvailable();
                Board.board[pos[1]][pos[0]] = Board.board[this.position[1]][this.position[0]];
                Board.board[this.position[1]][this.position[0]] = 0;
                this.position = pos;
                this.cleanUpCode(pos);
                this.makeKing();
                Board.whoCanMove();
                Board.changePlayer();
                // if(this.canJump){
                //     this.jumpOverPiece();
                // }
            }
        }

        this.canJump = function(pos){
            var xDistance = pos[1]-this.position[1];
            var yDistance = pos[0]-this.position[1];
            var tileCheckx = this.position[1]+(xDistance/2);
            var tileChecky = this.position[0]+(yDistance/2);
            //out of board check
            if(newPosition[0] > 7 || newPosition[1] > 7 || newPosition[0] < 0 || newPosition[1] < 0) return false;

            //king check and check the tiles
            if(this.player == 1 && this.king == false) {
                if(pos[0] < this.position[0]) {
                    return false;
                }
            } else if (this.player == 2 && this.king == false) {
                if(pos[0] > this.position[0]) {
                    return false;
                }
            }


            return false;
        },

        this.jumpOverPiece = function(){

        },

        this.canJumpOverAny = function(){

        }
    }

    Board.init();


/* 
EVENTS
*/

    $('div.piece').on("click", function() {
        console.log('test');
        //var tileHighlights = checkTiles();
        var player = Board.isPlayerTurn($(this));
        
        console.log("piece selected");  
        if(player) {
            console.log("correct player");
            if($(this).hasClass("selected")) {

                removeAvailable();

                $(this).removeClass("selected"); 
            }
            else {
                removeAvailable();

                $(".piece").each(function() { $(this).removeClass("selected"); });
                $(this).addClass("selected");

                addAvailable();
            }

            


        } else { console.log("incorrect player... NO"); }
    
    $('.tile.available').on('click', function(){
        //select the tile selected
        var piece = Pieces[parseInt($('.piece.selected').attr('id'))];
        console.log("attricute piece id "+$('.piece.selected').attr('id'))
        var tile = Tiles[parseInt($(this).attr('id').replace('t',''))];


        console.log("tile id "+$(this).attr('id'));
        piece.move(tile.position);
        });
    });

    function checkTiles() {
        var availableTiles = [];
        for(row in Board.board) {
            for(column in Board.board[row]) {
                if(Tiles[parseInt(parseInt(row*8) + parseInt(column))]) {
                    var tileToCheck = Tiles[parseInt(parseInt(row*8) + parseInt(column))];
                    var piece = Pieces[parseInt($('.piece.selected').attr('id'))];
                    if(Board.isValidPosition(piece, tileToCheck.position)) {
                        //tileToCheck.element.addClass('available');
                        availableTiles.push(tileToCheck);
                    }
                }
            }
        }

        return availableTiles;
    }

    function removeAvailable() {
        checkTiles().forEach(function(tile){
            tile.element.removeClass('available');
        });
    }

    function addAvailable() {
        checkTiles().forEach(function(tile){
            tile.element.addClass('available');
        });
    }

    function removePieceAvailability(playerTurn) {
        for(index in Pieces) {
            if(Pieces[index] && playerTurn == 1) {
                if(parseInt(Pieces[index].element.attr("id")) > 12) { Pieces[index].element.removeClass('available'); }
            }else if(Pieces[index] && playerTurn == 2) {
                if(parseInt(Pieces[index].element.attr("id")) < 13) { Pieces[index].element.removeClass('available'); }
            }
        }
    }

}

