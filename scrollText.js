const songInfo = document.getElementById('songInfo');
const scrollTime = 150;

let originalText = "";          // Will hold text + trailing spaces
let scrollingText = "";         // The string being scrolled

// Scroll function
function scrollTextJittery() {
  if (!audio.paused) {
    if (scrollingText.length > 1) {
      scrollingText = scrollingText.slice(1) + scrollingText[0];
      songInfo.textContent = scrollingText;
    }
  } else {
    songInfo.textContent = originalText
    scrollingText = originalText
  }
}

// Mutation Observer to wait for text set
const observer = new MutationObserver((mutations, obs) => {
  mutations.forEach(mutation => {
    if (mutation.type === 'childList' && songInfo.textContent.trim().length > 0) {
      // Initialize the text with trailing spaces added once
      originalText = songInfo.textContent + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0";
      scrollingText = originalText;

      setInterval(scrollTextJittery, scrollTime);
      obs.disconnect();
    }
  });
});

observer.observe(songInfo, { childList: true, subtree: false });
