const infoEl = document.getElementById("songInfo")
const imageEl = document.getElementById("albumArt")

document.addEventListener('DOMContentLoaded', setDetails)

async function setDetails() {
	// let apiURL = "https://api.winnerwind.in/music/"
	let apiURL = "http://192.168.68.105:5001/music/"
	let imagesAPI = apiURL + "images/"
	let dataAPI = apiURL + "data/"
	let url = window.location.href
	let fileName = (url.split('/')).pop()

	let data = await fetch(dataAPI+fileName, {method: 'POST'}).then(response => response.json()).
	then(data => {
		console.log(data)
		infoEl.innerText = `${data.title} - ${data.album} - ${data.artists.join(", ")}`
		console.log(apiURL+imagesAPI+fileName)
		imageEl.src = imagesAPI+fileName
	})
}
