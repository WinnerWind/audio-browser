let filesEl = document.getElementById("fileListing")

document.addEventListener('DOMContentLoaded', SetListing)

function SetListing() {
	let apiURL = "http://192.168.68.105:5001/music/listing"

	let currentPath = window.location.pathname;
	let basePath = currentPath.substring(0, currentPath.lastIndexOf('/'));

	fetch(apiURL).then(response => response.json()).
	then(data => {
		data.forEach(name => {
			let newPoint = document.createElement('li')
			let newLink = document.createElement('a')
			newLink.href = basePath + "/" + name
			newLink.classList.add("fileLink")
			newLink.textContent = name

			newPoint.appendChild(newLink)
			filesEl.appendChild(newPoint)
		})
	})
}
