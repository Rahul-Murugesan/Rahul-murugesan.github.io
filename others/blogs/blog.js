const mangaurl = "https://api.jikan.moe/v4/manga/2";

window.addEventListener("load", async function(){
	const url = mangaurl;
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

})