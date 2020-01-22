// let visited = 0;
// let cookieList = document.cookie.split('; ');
// let cookies = [];
 
// for (let i = 0; i < cookieList.length; i++) {
//     let cookie = cookieList[i].split("=");
//     if (cookie[0] === "visited") {
//         visited = parseInt(cookie[1]);
//         break;
//     }
// }
// visited++;
// document.cookie = "visited=" + visited + "; expires=Mon, 20-Jul-2020 06:45:00 GMT";
// document.getElementById("visited").innerHTML = visited;


let visited = 0;
if(document.cookie){
    let cookieList = document.cookie.split('; ');

    for (let i = 0; i < cookieList.length; i++) {
        let cookie = cookieList[i].split("=");
        if (cookie[0] === "visited") {
            visited = parseInt(cookie[1]);
            break;
        }
    }

    visited++;
    document.cookie = "visited=" + visited + "; expires=Mon, 20-Jul-2999 06:45:00 GMT";
}
else{
    document.cookie = "visited=" + visited + "; expires=Mon, 20-Jul-2999 06:45:00 GMT";

}

document.getElementById("gamesPlayedByPlayer").innerHTML = visited;