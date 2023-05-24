// dark mode cookie
window.onload=function(){
    if(localStorage.getItem("mode") === "dark"){
        document.body.classList.toggle("darkmode");
        const ele = document.getElementById("modeimg");
        ele.src = "image/mode/lightmodehover.png";
        ele.alt = "lightmodehover";
}};

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
    if(ele.alt === "darkmode"){
        ele.src = "image/mode/darkmodehover.png";
        ele.alt = "darkmodehover";
    }
    else if(ele.alt === "lightmode"){
        ele.src = "image/mode/lightmodehover.png";
        ele.alt = "lightmodehover";
    }
}

// dark/light mode change image when not hover
function modenothover(ele){
    if(ele.alt === "darkmodehover"){
        ele.src = "image/mode/darkmode.png";
        ele.alt = "darkmode";
    }
    else if(ele.alt === "lightmodehover"){
        ele.src = "image/mode/lightmode.png";
        ele.alt = "lightmode";
    }
}

// change dark/light mode
function togglemode(ele){
    if(ele.alt === "darkmodehover"){
        ele.src = "image/mode/lightmodehover.png";
        ele.alt = "lightmodehover";
        document.body.classList.toggle("darkmode");
        localStorage.setItem("mode", "dark");
    }
    else if(ele.alt === "lightmodehover"){
        ele.src = "image/mode/darkmodehover.png";
        ele.alt = "darkmodehover";
        document.body.classList.toggle("darkmode");
        localStorage.setItem("mode", "light");
    }
}