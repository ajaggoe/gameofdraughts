
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
    document.cookie = "visited=" + visited + "; expires=Mon, 20-Apr-2999 12:00:00 GMT";
}
else{
    document.cookie = "visited=" + visited + "; expires=Mon, 20-Apr-2999 12:00:00 GMT";

}

document.getElementById("visited").innerHTML = visited;