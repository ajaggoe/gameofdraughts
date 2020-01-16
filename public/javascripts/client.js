window.onload = function() {
    var gameBoard = [   [-1    ,21   ,-1    ,22     ,-1     ,23     ,-1     ,24],
                        [17    ,-1   ,18    ,-1     ,19     ,-1     ,20     ,-1],
                        [-1    ,13   ,-1    ,14     ,-1     ,15     ,-1     ,16],
                        [0     ,-1   ,0     ,-1     ,0      ,-1     ,0      ,-1],
                        [-1    ,0    ,-1    ,0      ,-1     ,0      ,-1     ,0 ],
                        [12    ,-1   ,11    ,-1     ,10     ,-1     ,9      ,-1],
                        [-1    ,8    ,-1    ,7      ,-1     ,6      ,-1     ,5 ],
                        [4     ,-1   ,3     ,-1     ,2      ,-1     ,1      ,-1]];

    //used to save all piece instances
    var pieces = [];


    var Board = {
        board: gameBoard,
        score: {player1: 0, player2: 0},
        player1pieces: 12,
        player2pieces: 12,
        playerTurn: 1,
        tiles: $('div.tile'),
        location: ['0px','64px','128px','192px','256px','320px','384px','448px'],
        
        init: function (){
            for(row in this.board) {
                for(column in this.board[row]) {
                    if(row%2==0) {
                        if(column%2==1) {
                            let tile = document.createElement('div');
                            tile.style.width = '64px';
                            tile.style.height = '64px';
                            tile.style.backgroundColor = 'black';
                            tile.style.position = 'absolute';
                            tile.style.top = this.location[row];
                            tile.style.left = this.location[column];
                            this.tiles.append(tile); 
                        } 
                        
                    }else {
                        if(column%2==0) {
                            let tile = document.createElement('div');
                            tile.style.width = '64px';
                            tile.style.height = '64px';
                            tile.style.backgroundColor = 'black';
                            tile.style.position = 'absolute';
                            tile.style.top = this.location[row];
                            tile.style.left = this.location[column];
                            this.tiles.append(tile); 
                        }
                    }
                    if(this.board[row][column] > 12) {
                        let piece = document.createElement('div');
                        piece.id = this.board[row][column].toString();
                        piece.classList.add('piece');
                        piece.style.display = 'inline-box';
                        piece.style.width = '60px';
                        piece.style.height = '60px';
                        piece.style.margin = '2px';
                        piece.style.borderRadius = '50%';
                        piece.style.backgroundColor = 'red';
                        piece.style.position = 'absolute';
                        piece.style.top = this.location[row];
                        piece.style.left = this.location[column];
                        $('.redpiece').append(piece);

                        pieces[this.board[row][column]] = new Piece($("#"+this.board[row][column]),[parseInt(row),parseInt(column)]);
                    }
                    else if(this.board[row][column] < 13 && this.board[row][column] > 0) {
                        let piece = document.createElement('div');
                        piece.id = this.board[row][column].toString();
                        piece.classList.add('piece');
                        piece.style.display = 'inline-box';
                        piece.style.width = '60px';
                        piece.style.height = '60px';
                        piece.style.margin = '2px';
                        piece.style.borderRadius = '50%';
                        piece.style.backgroundColor = 'white';
                        piece.style.position = 'absolute';
                        piece.style.top = this.location[row];
                        piece.style.left = this.location[column];
                        $('.whitepiece').append(piece);

                        pieces[this.board[row][column]] = new Piece($("#"+this.board[row][column]),[parseInt(row),parseInt(column)]);
                    }
                }
            }
        },

        // returns 0 if nobody won, 1 if p1 won, 2 if p2 won
        checkIfWon: function() {
            if(this.score.player1 == 12) { return 1; }
            if(this.score.player2 == 12) { return 2; }
            return 0;
        },

        // changes the players turn, and sets the game-status text
        changePlayer: function() {
            if(this.player == 1) {
                $('.game-status').html('Opponents turn');
                this.player = 2;
                return;
            }
            if(this.player == 2) {
                $('.game-status').html('Your turn');
                this.player = 1;
                return;
            }
        },            
        
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
        // this.makeKing = function () {};

        // all pieces are allowed to move initially
        this.canMove = true;
    }

    Board.init();
}

/* 
EVENTS
*/

$('.piece').click(function() {
    var selected;
    var isPlayersTurn = function() {
        if($(this).parent().attr('class') == "redpiece") {
            return 2 == parseInt(Board.playerTurn);
        }
        if($(this).parent().attr('class') == "whitepiece") {
            return 2 == parseInt(Board.playerTurn);
        }
    }
    if(isPlayersTurn) {
        if($(this).hasClass('selected')) selected = true;
        $('.pieces').each(function(index) { $('.piece').eq(index).removeClass('selected') });
        if(!selected) { selected = true; }
    }
});

