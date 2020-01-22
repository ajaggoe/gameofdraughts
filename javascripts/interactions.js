var socket = new WebSocket('ws://localhost:3000')

socket.onopen = function(){
    console.log("WERKT KUT");
    var counter = 0;
    ws.send('hi im client'+counter++)
}