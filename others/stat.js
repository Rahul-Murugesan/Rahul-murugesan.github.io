async function getdata(url){
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

async function updatemovie(){
    const data = await getdata("https://rahulm-3.github.io/others/movies.json");
    var movie_name = Object.keys(data["Recent Movies"]).slice(0, 5);
    for(var i=0; i<5; i++){
        var url = data["Recent Movies"][movie_name[i]][0];
        var name = movie_name[i];
        var star = data["Recent Movies"][movie_name[i]][1];
        document.getElementById("rmdata").innerHTML += "<li><a href="+url+">"+name+"</a> - "+star+"</li>"
    }

    var movie_name = Object.keys(data["Watchlist"]).slice(0, 5);
    for(var i=0; i<5; i++){
        var url = data["Watchlist"][movie_name[i]][0];
        var name = movie_name[i];
        document.getElementById("wldata").innerHTML += "<li><a href="+url+">"+name+"</a></li>"
    }
}
updatemovie()