// loading screen
var dot = 1;
const loadingscreen = setInterval(function(){
    ele = document.getElementById("loadingtxt");
    if(dot == 5){
        dot = 1;
    }
    ele.innerHTML = "Loading"+".".repeat(dot)+"&nbsp".repeat(4-dot);
    dot += 1;
}, 350)

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
    ele = document.getElementById("modeicon");
    if(localStorage.getItem("mode") === "dark"){
        const Body = document.body.classList;
        Body.toggle("darkmode");
        if(window.location.pathname == "/"){
            ele.src = "image/mode/lightmode.png";
        }
    }
    clearInterval(loadingscreen);
    var lscr = document.getElementById("loadingscreen");
    lscr.parentNode.removeChild(lscr);
}