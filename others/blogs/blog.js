const mangaurl = "https://api.jikan.moe/v4/manga/";
const animeurl = "https://api.jikan.moe/v4/anime/"

window.addEventListener("load", async function(){
	if(document.getElementById("etype").innerText == "manga"){
		const url = mangaurl+document.getElementById("eid").innerText;
		const response = await fetch(url);
		var data = await response.json();
		data = data.data;

		var div = document.getElementById("einfo");
		document.getElementById("name").innerHTML = data.title;
		if(document.getElementById("img").src == window.location.href){
			document.getElementById("img").src = data.images.jpg.image_url.replace("\\", "");
		}

		var auths = "";
		data.authors.forEach(function(item){
			auths += `<br>&nbsp&nbsp${item.name}`;
		})
		div.innerHTML += `<h6><span>Authors & Studios:</span>${auths}</h6>`;
		div.innerHTML += `<h6><span>Type:&nbsp</span>${data.type}</h6>`;
		div.innerHTML += `<h6><span>Published:&nbsp</span>${data.published.string}</h6>`;
		div.innerHTML += `<h6><span>Status:&nbsp</span>${data.status}</h6>`;
		div.innerHTML += `<h6><span>Chapters:&nbsp</span>${data.chapters}</h6>`;
		div.innerHTML += `<h6><span>Volumes:&nbsp</span>${data.volumes}</h6>`;
		if(data.demographics.length){
			div.innerHTML += `<h6><span>Demographics:&nbsp</span>${data.demographics[0].name}</h6>`;
		}
		div.innerHTML += '<section class="heading"><h4>MAL Statistics</h4><div class="bar barheading"></div></section>';
		div.innerHTML += `<h6><span>Score:&nbsp</span>${data.score} <font size="1">(scored by ${data.scored_by} users)</font></h6>`;
		div.innerHTML += `<h6 id="rank"><span>Ranked:&nbsp</span>${data.rank}</h6>`;
		div.innerHTML += `<h6 id="pop"><span>Popularity:&nbsp</span>${data.popularity}</h6>`;
		div.innerHTML += `<h6 id="mem"><span>Members:&nbsp</span>${data.members}</h6>`;
	}
	else if(document.getElementById("etype").innerText == "anime"){
		url = animeurl+document.getElementById("eid").innerText;
		const response = await fetch(url);
		var data = await response.json();
		data = data.data;

		var div = document.getElementById("einfo");
		document.getElementById("name").innerHTML = data.title;
		if(document.getElementById("img").src == window.location.href){
			document.getElementById("img").src = data.images.jpg.image_url.replace("\\", "");
		}

		var stds = "";
		data.studios.forEach(function(item){
			stds += `<br>&nbsp&nbsp${item.name}`;
		})
		div.innerHTML += `<h6><span>Authors:</span>${stds}</h6>`;
		div.innerHTML += `<h6><span>Type:&nbsp</span>${data.type}</h6>`;
		div.innerHTML += `<h6><span>Aired:&nbsp</span>${data.aired.string}</h6>`;
		div.innerHTML += `<h6><span>Status:&nbsp</span>${data.status}</h6>`;
		div.innerHTML += `<h6><span>Episodes:&nbsp</span>${data.episodes}</h6>`;
		if(data.demographics.length){
			div.innerHTML += `<h6><span>Demographics:&nbsp</span>${data.demographics[0].name}</h6>`;
		}
		div.innerHTML += '<section class="heading"><h4>MAL Statistics</h4><div class="bar barheading"></div></section>';
		div.innerHTML += `<h6><span>Score:&nbsp</span>${data.score} <font size="1">(scored by ${data.scored_by} users)</font></h6>`;
		div.innerHTML += `<h6 id="rank"><span>Ranked:&nbsp</span>${data.rank}</h6>`;
		div.innerHTML += `<h6 id="pop"><span>Popularity:&nbsp</span>${data.popularity}</h6>`;
		div.innerHTML += `<h6 id="mem"><span>Members:&nbsp</span>${data.members}</h6>`;
	}

	document.getElementById("loaded").innerText = "true";

	document.getElementById("mainframe").innerHTML += "<h6><font color='red'>[NOTE]</font> Not all these words are mine. I'm still trying to improve my writting skills with the help of AI.</h6>";

})
