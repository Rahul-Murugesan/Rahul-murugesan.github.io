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

var option = "Recent"
function filter(ele){
    filteropt = ele.innerText;
    option = ele.innerText
    console.log(option)
    ExpandBtn(document.getElementById("filterbtn"))
}

var load = 1;
var blog = []
var totale = 0;
window.addEventListener("load", async function(){
    const url = "./blogs.json"
    const response = await fetch(url);
    var data = await response.json();
    data = data.all;
    totale = data.length
    for(var i=0; i<4; i++){
        blog.push(`blogs/${data[i]}.html`);
    }
    document.getElementById("blogcnt").data=blog[0];
})

async function fill(){
    if(load <= Math.min(totale, 4)){
        cnt = document.getElementById("blogcnt").contentWindow.document;
        while(cnt.getElementById("loaded").innerText == "false"){
            cnt = document.getElementById("blogcnt").contentWindow.document;
            await new Promise(r => setTimeout(r, 0));
        }
        const src = document.getElementById("blogcnt").data;
        const name = cnt.getElementById("name").innerText;
        const blogtitle = cnt.getElementById("blogtitle").innerText;
        const datetime = cnt.getElementById("datetime").innerText;
        const poster = cnt.getElementById("img").src;
        document.getElementById(`poster${load}`).src = poster
        document.getElementById(`row${load}`).innerHTML += `<div class="info"> <a href=${src}><h3 align="left">${name}: <span>${blogtitle}</span></h3></a> <h6 align="left">${datetime}</h6> </div>`;

        document.getElementById("blogcnt").data=blog[load];
        load += 1
        if(load > totale){
            document.getElementById("blogcnt").data = "";
            for(var i=3; i<document.getElementById("blogdis").childNodes.length; i+=2){
                document.getElementById("blogdis").childNodes[i].removeAttribute("hidden");
            }
            for(var i=3; i<document.getElementById("blogdis").childNodes.length; i+=4){
                document.getElementById("blogdis").childNodes[i].style.display = "flex";
            }
            lscr = document.getElementById("cntloadingscreen");
            lscr.parentNode.removeChild(lscr);
        }
    }
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