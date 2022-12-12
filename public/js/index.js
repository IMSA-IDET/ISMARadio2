if (localStorage.getItem("volume") == null) {
    localStorage.setItem("volume", 1);
}

// Volume slider lower range background
let volumeSlider = document.getElementById("volcontrol");
volumeSlider.value = parseInt(localStorage.getItem("volume"));

const setVolume = () => {
    volumeSlider.style.background = `linear-gradient(to right, var(--iconcolor) 0%, var(--iconcolor) ${volumeSlider.value}%, #000 ${volumeSlider.value}%, #000 100%)`;
    volume = volumeSlider.value / 100;
    localStorage.setItem("volume", volume);
}

setVolume();
volumeSlider.addEventListener("input", () => setVolume());