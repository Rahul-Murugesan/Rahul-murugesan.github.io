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

		data.authors.forEach(function(item){
			div.innerHTML += `<h6><span>Authors & Studios:<br>&nbsp&nbsp${item.name}</span></h6>`
		})
		div.innerHTML += `<h6><span>Type:&nbsp${data.type}</span></h6>`;
		div.innerHTML += `<h6><span>Published:&nbsp${data.published.string}</span></h6>`;
		div.innerHTML += `<h6><span>Status:&nbsp${data.status}</span></h6>`;
		div.innerHTML += `<h6><span>Chapters:&nbsp${data.chapters}</span></h6>`;
		div.innerHTML += `<h6><span>Volumes:&nbsp${data.volumes}</span></h6>`;
		if(data.demographics.length){
			div.innerHTML += `<h6><span>Demographics:&nbsp${data.demographics[0].name}</span></h6>`;
		}
		div.innerHTML += '<section class="heading"><h4>MAL Statistics</h4><div class="bar barheading"></div></section>';
		div.innerHTML += `<h6><span>Score:&nbsp${data.score} (scored by ${data.scored_by} users)</span></h6>`;
		div.innerHTML += `<h6 id="rank"><span>Ranked:&nbsp${data.rank}</span></h6>`;
		div.innerHTML += `<h6 id="pop"><span>Popularity:&nbsp${data.popularity}</span></h6>`;
		div.innerHTML += `<h6 id="mem"><span>Members:&nbsp${data.members}</span></h6>`;
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

		data.studios.forEach(function(item){
			div.innerHTML += `<h6><span>Studios:<br>&nbsp&nbsp${item.name}</span></h6>`
		})
		div.innerHTML += `<h6><span>Type:&nbsp${data.type}</span></h6>`;
		div.innerHTML += `<h6><span>Aired:&nbsp${data.aired.string}</span></h6>`;
		div.innerHTML += `<h6><span>Status:&nbsp${data.status}</span></h6>`;
		div.innerHTML += `<h6><span>Episodes:&nbsp${data.episoded}</span></h6>`;
		if(data.demographics.length){
			div.innerHTML += `<h6><span>Demographics:&nbsp${data.demographics[0].name}</span></h6>`;
		}
		div.innerHTML += '<section class="heading"><h4>MAL Statistics</h4><div class="bar barheading"></div></section>';
		div.innerHTML += `<h6><span>Score:&nbsp${data.score} (scored by ${data.scored_by} users)</span></h6>`;
		div.innerHTML += `<h6 id="rank"><span>Ranked:&nbsp${data.rank}</span></h6>`;
		div.innerHTML += `<h6 id="pop"><span>Popularity:&nbsp${data.popularity}</span></h6>`;
		div.innerHTML += `<h6 id="mem"><span>Members:&nbsp${data.members}</span></h6>`;
	}

	document.getElementById("loaded").innerText = "true";

})
