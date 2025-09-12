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
			let params = new URLSearchParams
			params.set("list", fileName)
			params.set("index", 0)
			console.log(params.toString())
			SetPlaylistContent(data)
			window.open(basePath + "/" + GetSongFromPlaylistIndex(data, 0) + "?" + params.toString(), "_self")
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
	const params = new URLSearchParams()
	const query = globalParams.get("q")
	params.set("q", query)

	fetch(listingURL).then(response => response.json()).
	then(data => {
		let searchData = data.filter(name => {
		  return !query || query.trim() === "" || name.toLowerCase().includes(query.toLowerCase());
		})
		let newPoint = document.createElement('li')
		newPoint.textContent = `${searchData.length} entries found${data.length != searchData.length ? " out of " + data.length + " entries.": "."}`
		newPoint.classList.add("metadataLabel")
		filesEl.appendChild(document.createElement('hr'))
		filesEl.appendChild(newPoint)
		filesEl.appendChild(document.createElement('hr'))

		data.forEach(name => {
			if (!query || query.trim() === "" || name.toLowerCase().includes(query.toLowerCase())) {
				let newPoint = document.createElement('li')
				let newLink = document.createElement('a')
				newLink.href = basePath + "/" + name
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
  localParams.set("list", globalParams.get("list"))
  localParams.set("index", songIndex);

  let newPoint = document.createElement('li');
  let newLink = document.createElement('a');
  newLink.href = basePath + "/" + songName;
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

