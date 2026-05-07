const emoji = document.getElementById("emoji");
const mainText = document.getElementById("mainText");
const subText = document.getElementById("subText");

let toggled = false;

emoji.addEventListener("click", () => {
    toggled = !toggled;

    emoji.classList.remove("wave");
    void emoji.offsetWidth;
    emoji.classList.add("wave");

    if (toggled) {
        mainText.textContent = "Fuck you🖕";
        subText.textContent = "A well deserved f*** you!";
    } 
});