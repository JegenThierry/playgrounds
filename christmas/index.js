const sweetMessages = [
  "You are the best gift I could ask for!",
  "Thank you for being such an amazing person.",
  "Wishing you a year filled with laughter and joy.",
  "You make the world a brighter place just by being in it.",
  "I am proud of everything you do!",
];

const messageToTemplate = {
  ["messages"]: "modal-messages-template",
  ["vouchers"]: "modal-vouchers-template",
  ["picture"]: "modal-image-template",
};

let currentMessageIndex = 0;

let modal = document.getElementById("modal");
let modalBody = document.getElementById("modal-body");

function openGift(type) {
  modalBody.innerHTML = "";
  modalBody.innerHTML = document.getElementById(
    messageToTemplate[type]
  ).innerHTML;
  modal.classList.add("active");
}

function closeModal(event) {
  modal.classList.remove("active");
}

function nextMessage() {
  currentMessageIndex = (currentMessageIndex + 1) % sweetMessages.length;
  const display = document.getElementById("msg-display");

  display.style.opacity = 0;
  setTimeout(() => {
    display.textContent = sweetMessages[currentMessageIndex];
    display.style.opacity = 1;
  }, 100);
}

function createSnow() {
  const snowCount = 50;
  for (let i = 0; i < snowCount; i++) {
    const snow = document.createElement("div");
    snow.className = "snowflake";
    snow.textContent = "❄";
    snow.style.left = Math.random() * 100 + "vw";
    snow.style.top = Math.random() * -100 + "vh";
    snow.style.fontSize = Math.random() * 20 + 10 + "px";
    snow.style.animationDuration = Math.random() * 3 + 2 + "s";
    snow.style.opacity = Math.random();
    document.body.appendChild(snow);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  createSnow();
  modal = document.getElementById("modal");
  modalBody = document.getElementById("modal-body");
});
