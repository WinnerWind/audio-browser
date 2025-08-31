const songInfo = document.getElementById('songInfo');

// Scroll function
function scrollTextJittery() {
let text = songInfo.textContent;
if (text.length > 1) {
  text = text.slice(1) + text[0];
  songInfo.textContent = text;
}
}

// Only start scrolling after text is updated for the first time
const observer = new MutationObserver((mutations, obs) => {
mutations.forEach(mutation => {
  if (mutation.type === 'childList' && songInfo.textContent.trim().length > 0) {
    // Start the interval timer to scroll text
    setInterval(scrollTextJittery, 200);
    // Stop observing once started
    obs.disconnect();
  }
});
});

observer.observe(songInfo, { childList: true, subtree: false });
