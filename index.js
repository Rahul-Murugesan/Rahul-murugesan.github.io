// loading screen
var dot = 1;
const loadingscreen = setInterval(function(){
    ele = document.getElementById("loadingtxt");
    if(dot == 4){
        dot = 1;
    }
    ele.innerHTML = "Loading"+".".repeat(dot)+"&nbsp".repeat(3-dot);
    dot += 1;
}, 500)

// competitve programming 
let urlcf = "https://codeforces.com/api/user.info?handles=Finalgof";
let urlcf_userhandle = "https://codeforces.com/api/user.status?handle=Finalgof";
let urllc = "https://leetcode-stats-api.herokuapp.com/Finalgof";
let urllc_rating = "https://leetcode.com/graphql?query=query%20{%20userContestRanking(username:%20%20%22Finalgof%22)%20{rating}}"
let urlcc;

async function getdata(url){
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

// code forces
(async () => {
    const data = await getdata(urlcf);
    const data2 = await getdata(urlcf_userhandle);

    document.getElementById("ratingcf").innerHTML = data.result[0]["rating"], 
    document.getElementById("maxratingcf").innerHTML = data.result[0]["maxRating"]

    // max problem solved
    var solved = 0;
    for(let i=0; i<data2.result.length; i++){
        if(data2.result[i]["verdict"] === "OK"){
            solved++;
        }
    }
    document.getElementById("pscf").innerHTML = solved;
})();

// leetcode
(async () => {
    const data = await getdata(urllc);
    document.getElementById("ranklc").innerHTML = data["ranking"],
    document.getElementById("pslc").innerHTML = data["totalSolved"]
})();

// menu open
function togglemenu(menu) {
    menu.classList.toggle('open');
}

// dark/light mode change image on hover
function modehover(ele){
    const Body = document.body.classList;
    if(Body.contains("darkmode")){
        ele.src = "image/mode/lightmodehover.png";
    }
    else{
        ele.src = "image/mode/darkmodehover.png";
    }
}

// dark/light mode change image when not hover
function modenothover(ele){
    const Body = document.body.classList;
    if(Body.contains("darkmode")){
        ele.src = "image/mode/lightmode.png";
    }
    else{
        ele.src = "image/mode/darkmode.png";
    }
}

// change dark/light mode
function togglemode(ele){
    const Body = document.body.classList;
    if(Body.contains("darkmode")){
        ele.src = "image/mode/darkmodehover.png";
        localStorage.setItem("mode", "light");
    }
    else{
        ele.src = "image/mode/lightmodehover.png";
        localStorage.setItem("mode", "dark");
    }
    Body.toggle("darkmode");
}

window.onload=function(){
    var lscr = document.getElementById("loadingscreen");
    lscr.parentNode.removeChild(lscr);
    clearInterval(loadingscreen);

    ele = document.getElementById("modeicon");
    if(localStorage.getItem("mode") === "dark"){
        const Body = document.body.classList;
        Body.toggle("darkmode");
        ele.src = "image/mode/lightmode.png";
    }
}