const searchEl = document.getElementById("searchBar")

searchEl.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		let params = new URLSearchParams(window.location.search)
		params.set("q", searchEl.value)
		window.location.href = window.location.pathname+"?"+params.toString()
	}
})

document.addEventListener('DOMContentLoaded', () => {
	const params = new URLSearchParams(window.location.search)
	searchEl.value = params.get("q")
})

