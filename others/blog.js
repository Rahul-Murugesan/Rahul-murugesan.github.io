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