let urlcf = "https://codeforces.com/api/user.info?handles=Finalgof";
let urlcf_userhandle = "https://codeforces.com/api/user.status?handle=Finalgof";
let urllc = "https://leetcode-stats-api.herokuapp.com/Finalgof";
let urllc_rating = "https://leetcode.com/graphql?query=query%20{%20userContestRanking(username:%20%20%22Finalgof%22)%20{rating}}"
let urlcc;

fetch(urlcf)
.then(res => res.json())
.then(data => {
    document.getElementById("ratingcf").innerHTML = data.result[0]["rating"], 
    document.getElementById("maxratingcf").innerHTML = data.result[0]["maxRating"]
});
fetch(urlcf_userhandle)
.then(res => res.json())
.then(data => {
    var solved = 0;
    for(let i=0; i<data.result.length; i++){
        if(data.result[i]["verdict"] === "OK"){
            solved++;
        }
    }
    document.getElementById("pscf").innerHTML = solved;
})

fetch(urllc)
.then(res => res.json())
.then(data => {
    document.getElementById("ranklc").innerHTML = data["ranking"],
    document.getElementById("pslc").innerHTML = data["totalSolved"]
});

function togglemenu(menu) {
    menu.classList.toggle('open');
}