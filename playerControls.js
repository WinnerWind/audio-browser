const playPauseButton = document.getElementById("playPauseButton")
const downloadButton = document.getElementById("download")
const homeButton = document.getElementById("home")

const progress = document.getElementById("playerProgress")
const timeEl = document.getElementById("time")

const audio = document.getElementById("songAudio")
const audioSrc = document.getElementById("songAudioSrc")

playPauseButton.addEventListener('click', (event) => {
	if (playPauseButton.classList.contains("playButton")) {
		songAudio.pause()
		playPauseButton.classList.remove("playButton")
		playPauseButton.classList.add("pauseButton")
	} else {
		songAudio.play()
		playPauseButton.classList.add("playButton")
		playPauseButton.classList.remove("pauseButton")
	}
})

download.addEventListener('click', (event) => {
	const a = document.createElement('a');
	a.href = audioSrc.src;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
})

let totalSeconds = 0

audio.addEventListener('loadedmetadata', () => {
	progress.max = audio.duration
	totalSeconds = audio.duration
	let totalSecondsFormatted = String(parseInt(totalSeconds % 60)).padStart(2, '0')
	let totalMinutes = String(parseInt(totalSeconds / 60)).padStart(2, '0')
	let totalHours = String(parseInt(totalSeconds / 3600)).padStart(2, '0')
	timeEl.innerText = `00:00:00 / ${totalHours}:${totalMinutes}:${totalSecondsFormatted}`
})

audio.addEventListener('timeupdate', () =>{
	let timeInt = parseInt(audio.currentTime)
	let timeInTwoSeconds = timeInt % 2 == 0 ? timeInt : timeInt + 1
	let seconds = String(timeInt % 60).padStart(2, '0')
	let minutes = String(parseInt(timeInt / 60)).padStart(2, '0')
	let hours = String(parseInt(timeInt / 3600)).padStart(2, '0')

	let totalSecondsFormatted = String(parseInt(totalSeconds % 60)).padStart(2, '0')
	let totalMinutes = String(parseInt(totalSeconds / 60)).padStart(2, '0')
	let totalHours = String(parseInt(totalSeconds / 3600)).padStart(2, '0')
	let text = `${hours}:${minutes}:${seconds} / ${totalHours}:${totalMinutes}:${totalSecondsFormatted}`

	progress.value = timeInTwoSeconds
	timeEl.innerText = text
})

progress.addEventListener('input', () => {
	audio.currentTime = progress.value
})

home.addEventListener('click', () => {
	let url = window.location.href
	let fileName = (url.split('/')).pop()
	let homeUrl = url.replace(fileName, "")
	window.open(homeUrl, "_self")
})

previousButton.addEventListener('click', () => {
	window.open(previousSongLink, "_self")
})
nextButton.addEventListener('click', () => {
	window.open(nextSongLink, "_self")
})
