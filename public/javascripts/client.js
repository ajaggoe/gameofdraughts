window.onload = function() {
    var gameBoard = [   [-1    ,21   ,-1    ,22     ,-1     ,23     ,-1     ,24],
                        [17    ,-1   ,18    ,-1     ,19     ,-1     ,20     ,-1],
                        [-1    ,13   ,-1    ,14     ,-1     ,15     ,-1     ,16],
                        [0     ,-1   ,0     ,-1     ,0      ,-1     ,0      ,-1],
                        [-1    ,0    ,-1    ,0      ,-1     ,0      ,-1     ,0 ],
                        [12    ,-1   ,11    ,-1     ,10     ,-1     ,9      ,-1],
                        [-1    ,8    ,-1    ,7      ,-1     ,6      ,-1     ,5 ],
                        [4     ,-1   ,3     ,-1     ,2      ,-1     ,1      ,-1]];




    var Board = {
        board: gameBoard,
        player1pieces: 12,
        player2pieces: 12,
        tiles: $('div.tile'),
        location: ['0px','64px','128px','192px','256px','320px','384px','448px'],
        
        init: function (){
            for(row in this.board) {
                for(column in this.board[row]) {
                    if(board[row][column] !== -1) {
                        let tile = document.createElement('div');
                        tile.style.width = '64px';
                        tile.style.height = '64px';
                        tile.style.backgroundColor = 'black';
                        tile.style.top = this.location[row];
                        tile.style.left = this.location[column];
                        this.tiles.append(tile);  
                        
                    }
                }
            }
        },

            
        
    }

    // position = [x,y]
    function Tile(element, position) {
        //element on the doc
        this.element = element;
        //position on the board [x,y]
        this.position = position;
    }
}
/*
function Tile{

}

function Piece{
    func canMove(piece){

    }
}
function canJump(piece){

}

function playerMove{

}

function playerWon{

}
*/

