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

function filter(ele){
    filteropt = ele.innerText;
    ExpandBtn(document.getElementById("filterbtn"))
}

var load = 1;
var blog = []
window.addEventListener("load", async function(){
    const url = "./blogs.json"
    const response = await fetch(url);
    var data = await response.json();
    data = data.all;
    for(var i=0; i<4; i++){
        blog.push(`blogs/${data[i]}.html`);
    }
    document.getElementById("blogcnt").data=blog[0];
})

async function fill(){
    if(load <= 4){
        cnt = document.getElementById("blogcnt").contentWindow.document;
        while(cnt.getElementById("loaded").innerText == "false"){
            cnt = document.getElementById("blogcnt").contentWindow.document;
            await new Promise(r => setTimeout(r, 0));
        }
        var name = cnt.getElementById("name").innerText;
        console.log(document.getElementById("blogcnt").contentWindow.document.getElementById("datetime").innerText);
        document.getElementById(`row${load}`).innerHTML += `<h3 align="left">${name}</h3>`;

        document.getElementById("blogcnt").data=blog[load];
        load += 1
        if(load == 5){
            document.getElementById("blogcnt").data = "";
            for(var i=3; i<document.getElementById("blogdis").childNodes.length; i+=2){
                document.getElementById("blogdis").childNodes[i].removeAttribute("hidden");
            }
            lscr = document.getElementById("cntloadingscreen");
            lscr.parentNode.removeChild(lscr);
        }
    }
}