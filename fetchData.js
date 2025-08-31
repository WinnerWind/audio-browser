const infoEl = document.getElementById("songInfo")
const imageEl = document.getElementById("albumArt")
const audioEl = document.getElementById("songAudioSrc")
const audioParentEl = document.getElementById("songAudio")

document.addEventListener('DOMContentLoaded', setDetails)

async function setDetails() {
	// let apiURL = "https://api.winnerwind.in/music/"
	let apiURL = "http://192.168.68.105:5001/music/"
	let imagesAPI = apiURL + "images/"
	let dataAPI = apiURL + "data/"
	let audioAPI = apiURL + "audio/"
	let url = window.location.href
	let fileName = (url.split('/')).pop()

	let data = await fetch(dataAPI+fileName).then(response => response.json()).
	then(data => {
		if (data.title != "Path does not exist!") {
			infoEl.innerText = `${data.title} - ${data.album} - ${data.artists.join(", ")}`
			imageEl.src = imagesAPI+fileName
			audioEl.src = audioAPI+fileName
			audioParentEl.load()
		} else {
			infoEl.innerText = "Browse files on the left."
			imageEl.style.display = 'none'
			audioParentEl.style.display = 'none'
		}
	})
}
