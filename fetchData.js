const infoEl = document.getElementById("songInfo")
const imageEl = document.getElementById("albumArt")
const audioEl = document.getElementById("songAudioSrc")
const audioParentEl = document.getElementById("songAudio")
const filesEl = document.getElementById("fileListing")
const playlistContainer = document.getElementById("playlists")
const playlistEl = document.getElementById("playlistList")
const previousButton = document.getElementById("previous")
const nextButton = document.getElementById("next")

document.addEventListener('DOMContentLoaded', SetListing)
document.addEventListener('DOMContentLoaded', setDetails)

// let apiURL = "http://192.168.68.105:5001/music/"
let apiURL = "https://api.winnerwind.in/music/"
let globalParams = new URLSearchParams(window.location.search)

let imagesAPI = apiURL + "images/"
let dataAPI = apiURL + "data/"
let audioAPI = apiURL + "audio/"
let url = window.location.href
let fileName = (url.split('/')).pop()
let urlWithoutQuery = url.split("?")[0]
let basePath = urlWithoutQuery.substring(0, urlWithoutQuery.lastIndexOf('/'))

let nextSongLink = ""
let previousSongLink = ""

async function setDetails() {
	// Set player content
	let data = await fetch(dataAPI+fileName).then(response => response.json()).
	then(data => {
		if ("title" in data && data.title != "Path does not exist!") {
			infoEl.innerText = `${data.title} - ${data.album} - ${data.artists.join(", ")}`
			imageEl.src = imagesAPI+fileName
			audioEl.src = audioAPI+fileName
			audioParentEl.load()
			if (globalParams.get("list")) {
				fetch(dataAPI+globalParams.get("list")).then(response => response.json()).then(data => SetPlaylistContent(data))
			}
		} else if (data.songs) { //Current URL points to a playlist
			globalParams.set("list", fileName)
			globalParams.set("index", 0)
			SetPlaylistContent(data)
			window.open(basePath + "/" + GetSongFromPlaylistIndex(data, 0) + "?" + globalParams.toString(), "_self")
		} else {
			infoEl.innerText = "NO AUDIO INSERTED"
			imageEl.style.display = 'none'
			playlistContainer.style.display = 'none'
			audioParentEl.style.display = 'none'
		}
	})
}

function SetListing() {
	let listingURL = apiURL + "listing"
	const params = new URLSearchParams(window.location.search)
	const query = params.get("q")

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

function SetPlaylistContent(data) {
data.songs.forEach((songName, songIndex) => {
  let localParams = new URLSearchParams(); // clone globalParams
  localParams.set("q", globalParams.get("q"))
  localParams.set("list", globalParams.get("list"))
  localParams.set("index", songIndex);

  let newPoint = document.createElement('li');
  let newLink = document.createElement('a');
  newLink.href = basePath + "/" + songName + "?" + localParams.toString();
  newLink.classList.add("fileLink");

  if (songIndex == Number(globalParams.get("index"))) {
    newLink.textContent = ">>> " + songName;
    newLink.classList.add("enabledLink");
  } else if (songIndex == Number(globalParams.get("index"))-1) {
	  previousSongLink = newLink.href
	  newLink.textContent = songName
	} else if (songIndex == Number(globalParams.get("index"))+1) {
		nextSongLink = newLink.href
		newLink.textContent = songName
	} else {
    newLink.textContent = songName;
  }

  newPoint.appendChild(newLink);
  playlistEl.appendChild(newPoint);

  previousButton.style.display = "inline-flex"
  nextButton.style.display = "inline-flex"
});
}

function GetSongFromPlaylistIndex(data, index) {
	return data.songs[index]
}

