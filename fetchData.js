const infoEl = document.getElementById("songInfo")
const imageEl = document.getElementById("albumArt")
const audioEl = document.getElementById("songAudioSrc")
const audioParentEl = document.getElementById("songAudio")
const filesEl = document.getElementById("fileListing")

document.addEventListener('DOMContentLoaded', SetListing)
document.addEventListener('DOMContentLoaded', setDetails)

// let apiURL = "http://192.168.68.105:5001/music/"
let apiURL = "https://api.winnerwind.in/music/"

async function setDetails() {
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

function SetListing() {
	let listingURL = apiURL + "listing"
	const params = new URLSearchParams(window.location.search)
	const query = params.get("q")

	let currentPath = window.location.pathname;
	let basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));

	fetch(listingURL).then(response => response.json()).
	then(data => {
		data.forEach(name => {
			if (!query || query.trim() === "" || name.toLowerCase().includes(query.toLowerCase())) {
				let newPoint = document.createElement('li')
				let newLink = document.createElement('a')
				newLink.href = basePath + "/" + name + "?" + params.toString() //Preserve search query
				newLink.classList.add("fileLink")
				newLink.textContent = name

				newPoint.appendChild(newLink)
				filesEl.appendChild(newPoint)
			}
		})
	})
}

