window.addEventListener("load", function(){
    const Body = document.body.classList;
    if(Body.contains("darkmode")){
        document.getElementById("cntloadingscreen").src = "../image/loading-darkmode.gif";
        document.getElementById("fbtnimg").src = "../image/arrow.png";
    }
})

async function addifrm(){
    const url = "./blogs.json"
    const response = await fetch(url);
    var data = await response.json();
    data = data.all;
    for(var i=0; i<data.length; i++){
        var embed = document.createElement("embed");
        embed.id = `blog${i}`
        embed.src = `blogs/${data[i]}.html`;
        embed.style.display = "none";
        document.getElementById("cnt").innerHTML += `<embed id=blog${i} src=blogs/${data[i]} style="display: none;></embed>`
    }
}

//addifrm();

var deg = true
var filteropt = "Recent"
function ExpandBtn(ele){
    if(deg){
        ele.childNodes[0].style.transform = "rotate(180deg)";
        document.getElementById("filteropt").innerText = "Select"
        document.getElementById("expand").style.display = "flex";
        deg = false
    }
    else{
        ele.childNodes[0].style.transform = "rotate(0deg)";
        document.getElementById("expand").style.display = "none";
        document.getElementById("filteropt").innerText = filteropt;    
        deg = true;
    }
}

var load;
var blog = [];
var totale = 0;
var option = "Recent"
async function loaddata(){
    load = 1;
    blog = []
    totale = 0;

    const url = "./blogs.json"
    const response = await fetch(url);
    var data = await response.json();
    if(option == "Recent"){
        data = data.all;
    }
    else if(option == "Aniem/Manga"){
        data = data.animanga;
    }
    else if(option == "TV Series"){
        data = data.tvseries;
    }
    else if(option == "Movies"){
        data = data.movies;
    }
    else if(option == "Tech"){
        data = data.tech;
    }
    totale = Math.min(data.length, 4)
    if(totale == 0){
        for(var i=3; i<document.getElementById("blogdis").childNodes.length; i+=2){
            document.getElementById("blogdis").childNodes[i].removeAttribute("hidden");
        }
        document.getElementById("cntloadingscreen").setAttribute("hidden", "hidden");
    }
    else{
        for(var i=0; i<totale; i++){
            blog.push(`blogs/${data[i]}.html`);
        }
        document.getElementById("body").innerHTML += '<object id="blogcnt" data="" onload="fill()" style="position: absolute; top: -1000%"></object>'
        document.getElementById("blogcnt").data=blog[0];
    }
}
loaddata();

async function fill(){
    if(load <= totale){
        cnt = document.getElementById("blogcnt").contentWindow.document;
        while(cnt.getElementById("loaded").innerText == "false"){
            cnt = document.getElementById("blogcnt").contentWindow.document;
            await new Promise(r => setTimeout(r, 0));
        }
        const src = document.getElementById("blogcnt").data.replace(".html", "");
        const name = cnt.getElementById("name").innerText;
        const blogtitle = cnt.getElementById("blogtitle").innerText;
        const datetime = cnt.getElementById("updatedatetime").innerText;
        const poster = cnt.getElementById("img").src;
        document.getElementById(`row${load}`).innerHTML = `<img class="poster" id="poster${load}" onclick="expandimg(this)" src=""><div class="info"><a href=${src}><h3 align="left">${name}: <span>${blogtitle}</span></h3></a> <h6 align="left">${datetime}</h6></div>`;
        document.getElementById(`poster${load}`).src = poster;

        document.getElementById("blogcnt").data=blog[load];
        load += 1
        if(load > totale){
            console.log(document.getElementById("blogdis").childNodes)
            for(var i=3; i<document.getElementById("blogdis").childNodes.length; i+=2){
                document.getElementById("blogdis").childNodes[i].removeAttribute("hidden");
            }
            for(var i=3; i<document.getElementById("blogdis").childNodes.length; i+=4){
                document.getElementById("blogdis").childNodes[i].style.display = "flex";
            }
            const obj = document.getElementById("blogcnt");
            obj.parentNode.removeChild(obj);
            document.getElementById("cntloadingscreen").setAttribute("hidden", "hidden");
        }
    }
}

function filter(ele){
    filteropt = ele.innerText;
    option = ele.innerText
    ExpandBtn(document.getElementById("filterbtn"))
    document.getElementById("cntloadingscreen").removeAttribute("hidden");
    for(var i=3; i<document.getElementById("blogdis").childNodes.length; i+=2){
        document.getElementById("blogdis").childNodes[i].setAttribute("hidden", "hidden");
    }
    for(var i=3; i<document.getElementById("blogdis").childNodes.length; i+=4){
        document.getElementById("blogdis").childNodes[i].style.display = "none";
    }
    for(var i=1; i<=4; i++){
        document.getElementById(`row${i}`).innerHTML = "";
    }
    loaddata();
    fill();
}

function expandimg(ele){
    document.getElementById("expandedimg").src = ele.src;
    document.getElementById("expandimg").style.display = "flex";
}

var clicked = false;
function CloseBtn(ele, opt=0){
    if(clicked == false){
        document.getElementById("closebtn").removeAttribute("hidden");
    }
    if(opt == 0){
        clicked = true;
        document.getElementById("closebtn").setAttribute("hidden", "hidden");
        document.getElementById("expandimg").style.display = "none";
        document.getElementById("expandimg").src = "";
    }
    else if(opt == 1){
        clicked = false;
        ele.src = "../image/closehover.png";
    }
    else{
        clicked = false;
        ele.src = "../image/close.png";
    }
}

function ShowClosebtn(show){
    if(show){
        document.getElementById("closebtn").removeAttribute("hidden");
    }
    else{
        document.getElementById("closebtn").setAttribute("hidden", "hidden");
    }
}