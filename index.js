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


// Detect browser name
function getBrowser() {
    const userAgent = navigator.userAgent;
    let browserName;

    if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Chrome";
    } else if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Firefox";
    } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "Safari";
    } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
        browserName = "Internet Explorer";
    } else {
        browserName = "Unknown";
    }

    return browserName;
}
// Detect OS name
function getOS(){
    const userAgent = navigator.userAgent;
    let osName;

    if (userAgent.indexOf("Win") > -1) {
        osName = "Windows";
    } else if (userAgent.indexOf("Mac") > -1) {
        osName = "MacOS";
    } else if (userAgent.indexOf("Android") > -1) {
        osName = "Android";
    } else if (userAgent.indexOf("X11") > -1 || userAgent.indexOf("Linux") > -1) {
        osName = "Linux";
    } else if (userAgent.indexOf("like Mac") > -1) {
        osName = "iOS";
    } else {
        osName = "Unknown";
    }

    return osName;
}

// write access log
async function write_access_log(){
    // get public ip
    publicip = null;
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json(); 
        publicip = data.ip;
    } 
    catch (error) {

    }
    
    // time and url
    const url = window.location.href;
    const time = new Date().toString().replace(' GMT+0530 (India Standard Time)','');
    const log = ["Access log", publicip, time, url, getBrowser(), getOS()];
    
    // POST logs to api
    const linux_server_api = "https://linux-server-api-default-rtdb.firebaseio.com/log.json";
    fetch(linux_server_api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log)
      })
}

// when window loads
window.onload=function(){

    // enable dark/light mode from user setting
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

    write_access_log();
}