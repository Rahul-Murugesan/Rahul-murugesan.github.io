const mangaurl = "https://api.jikan.moe/v4/manga/";

window.addEventListener("load", async function(){
	const url = mangaurl+document.getElementById("eid").innerText;
	const response = await fetch(url);
	var data = await response.json();
	data = data.data

	document.getElementById("name").innerHTML = data.title;

	data.authors.forEach(function(item){
		document.getElementById("auth").innerHTML += `<br>&nbsp&nbsp${item.name}`
	})

	document.getElementById("type").innerHTML += data.type;
	document.getElementById("pubfrm").innerHTML += data.published.string;
	document.getElementById("sts").innerHTML += data.status;
	document.getElementById("chap").innerHTML += data.chapters;
	document.getElementById("vol").innerHTML += data.volumes;
	document.getElementById("demog").innerHTML += data.demographics[0].name;

	document.getElementById("score").innerHTML += `${data.score} (scored by ${data.scored_by} users)`;
	document.getElementById("rank").innerHTML += data.rank;
	document.getElementById("pop").innerHTML += data.popularity;
	document.getElementById("mem").innerHTML += data.members;

	document.getElementById("loaded").innerText = "true";

})