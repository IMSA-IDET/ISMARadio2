
// Volume slider lower range background
let volumeSlider = document.getElementById("volcontrol");
console.log(volumeSlider)
volumeSlider.addEventListener("input", e => {
    volumeSlider.style.background = `linear-gradient(to right, var(--iconcolor) 0%, var(--iconcolor) ${volumeSlider.value}%, #000 ${volumeSlider.value}%, #000 100%)`;
    volume = volumeSlider.value;
});