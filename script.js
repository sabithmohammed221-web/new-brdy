// ========================================
// SCREEN NAVIGATION
// ========================================

const screenIds = [
    "welcome",
    "letter",
    "memories",
    "surprise",
    "loveQuestion"
];

let currentScreen = 0;
let storyEnded = false;

function showScreen(index) {
    if (storyEnded) return;
    if (index < 0 || index >= screenIds.length) return;

    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    currentScreen = index;

    document.getElementById(screenIds[index]).classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ========================================
// BACKGROUND MUSIC
// ========================================

const music = document.getElementById("birthdayMusic");
const musicButton = document.getElementById("musicButton");

let musicStarted = false;

async function startMusic() {
    if (storyEnded || !music.paused) return;

    try {
        await music.play();
        musicStarted = true;
        musicButton.textContent = "♫";
    } catch (error) {
        musicButton.textContent = "▶";
    }
}

async function toggleMusic() {
    if (storyEnded) return;

    if (music.paused) {
        await startMusic();
    } else {
        music.pause();
        musicButton.textContent = "▶";
    }
}


// ========================================
// FIRST SURPRISE
// ========================================

function startSurprise() {
    if (storyEnded) return;

    startMusic();
    showScreen(1);
}


// ========================================
// LOVE LETTER
// ========================================

function revealLetter() {
    if (storyEnded) return;

    document.getElementById("letterContent").classList.remove("hidden");
    document.getElementById("letterButton").classList.add("hidden");
    document.getElementById("letterContinue").classList.remove("hidden");
    document.getElementById("envelope").textContent = "💖";

    launchHearts(15);
}

function goToMemories() {
    showScreen(2);
}


// ========================================
// THREE JPEG PHOTOS
// ========================================

const photos = [
    "images/photo1.jpeg",
    "images/photo2.jpeg",
    "images/photo3.jpeg"
];

const captions = [
    "A beautiful memory ❤️",
    "A moment close to my heart 💕",
    "A memory worth keeping forever 💖"
];

let photoIndex = 0;
let photoChanging = false;
let automaticPhotoCount = 0;

const memoryPhoto = document.getElementById("memoryPhoto");
const photoCaption = document.getElementById("photoCaption");

function changePhoto(index) {
    if (storyEnded || photoChanging) return;

    photoChanging = true;
    photoIndex = (index + photos.length) % photos.length;

    memoryPhoto.classList.add("fade");

    setTimeout(() => {
        if (storyEnded) {
            photoChanging = false;
            return;
        }

        memoryPhoto.onload = () => {
            memoryPhoto.classList.remove("fade");
            photoChanging = false;
        };

        memoryPhoto.onerror = () => {
            memoryPhoto.classList.remove("fade");

            photoCaption.textContent =
                "Please check the JPEG filenames in the images folder.";

            photoChanging = false;
        };

        memoryPhoto.src = photos[photoIndex];
        photoCaption.textContent = captions[photoIndex];

        if (memoryPhoto.complete && memoryPhoto.naturalWidth > 0) {
            memoryPhoto.classList.remove("fade");
            photoChanging = false;
        }
    }, 300);
}

function nextPhoto() {
    changePhoto(photoIndex + 1);
}

function previousPhoto() {
    changePhoto(photoIndex - 1);
}


// AUTOMATIC SLIDESHOW: PHOTO 1 → 2 → 3, THEN STOP

const photoTimer = setInterval(() => {
    if (storyEnded) {
        clearInterval(photoTimer);
        return;
    }

    if (currentScreen !== 2) return;

    if (automaticPhotoCount >= 2) {
        clearInterval(photoTimer);
        return;
    }

    nextPhoto();
    automaticPhotoCount++;
}, 3500);


// ========================================
// GIFT SURPRISE
// ========================================

function openNextSurprise() {
    showScreen(3);
}

function openGift() {
    if (storyEnded) return;

    document.getElementById("giftBox").textContent = "💝";
    document.getElementById("giftReveal").classList.remove("hidden");
    document.getElementById("giftButton").classList.add("hidden");
    document.getElementById("loveQuestionButton").classList.remove("hidden");

    launchHearts(20);
    launchConfetti(40);
}

function goToLoveQuestion() {
    showScreen(4);
}


// ========================================
// ROAMING NO BUTTON
// ========================================

const noButton = document.getElementById("noButton");
const answerArea = document.getElementById("answerArea");

function runAway() {
    if (storyEnded) return;

    if (!document.getElementById("yesResult").classList.contains("hidden")) {
        return;
    }

    const area = answerArea.getBoundingClientRect();
    const button = noButton.getBoundingClientRect();

    const maxX = Math.max(0, area.width - button.width);
    const maxY = Math.max(0, area.height - button.height);

    noButton.style.position = "absolute";
    noButton.style.left = Math.random() * maxX + "px";
    noButton.style.top = Math.random() * maxY + "px";

    document.getElementById("questionHint").textContent =
        "Hehe! Catch me if you can, Babe! 🙈💕";
}

noButton.addEventListener("pointerdown", function(event) {
    if (storyEnded) return;

    event.preventDefault();
    runAway();
});


// ========================================
// YES BUTTON
// ========================================

function sayYes() {
    if (storyEnded) return;

    document.getElementById("yesResult").classList.remove("hidden");
    document.getElementById("answerArea").classList.add("hidden");
    document.getElementById("questionHint").classList.add("hidden");

    launchHearts(25);
    launchConfetti(100);

    // Music continues until the final ending button is clicked.
}


// ========================================
// FLOATING HEARTS: CREATE ONLY 25
// ========================================

const heartsContainer = document.getElementById("hearts-container");

function createHeart() {
    if (storyEnded) return;

    const heart = document.createElement("span");

    heart.className = "floating-heart";

    const types = ["❤️", "💖", "💕", "💗", "💘", "✨"];

    heart.textContent = types[Math.floor(Math.random() * types.length)];
    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = (14 + Math.random() * 22) + "px";
    heart.style.animationDuration = (5 + Math.random() * 5) + "s";

    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 10000);
}

let heartCount = 0;

const heartTimer = setInterval(() => {
    if (storyEnded || heartCount >= 25) {
        clearInterval(heartTimer);
        return;
    }

    createHeart();
    heartCount++;
}, 650);

function launchHearts(amount) {
    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            if (!storyEnded) createHeart();
        }, i * 90);
    }
}


// ========================================
// CONFETTI
// ========================================

const confettiContainer = document.getElementById("confetti-container");

function launchConfetti(amount) {
    if (storyEnded) return;

    const colors = [
        "#ff69b4",
        "#ffd700",
        "#ffffff",
        "#c084fc",
        "#ff4d6d",
        "#ffaddb"
    ];

    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            if (storyEnded) return;

            const piece = document.createElement("span");

            piece.className = "confetti-piece";
            piece.style.left = Math.random() * 100 + "%";
            piece.style.width = (5 + Math.random() * 7) + "px";
            piece.style.height = (8 + Math.random() * 10) + "px";

            piece.style.backgroundColor =
                colors[Math.floor(Math.random() * colors.length)];

            piece.style.animationDuration = (2 + Math.random() * 3) + "s";

            confettiContainer.appendChild(piece);

            setTimeout(() => piece.remove(), 5500);
        }, i * 12);
    }
}


// ========================================
// FINAL ENDING — NO RESTART
// ========================================

function endBirthdayStory() {
    if (storyEnded) return;

    storyEnded = true;

    // Stop music.
    music.pause();
    music.currentTime = 0;
    musicStarted = false;

    // Hide music control.
    musicButton.style.display = "none";

    // Stop automatic effects.
    clearInterval(heartTimer);
    clearInterval(photoTimer);

    // Remove all floating effects.
    heartsContainer.replaceChildren();
    confettiContainer.replaceChildren();

    // Keep only the final love message visible.
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    const finalScreen = document.getElementById("loveQuestion");
    finalScreen.classList.add("active");

    document.getElementById("answerArea").classList.add("hidden");
    document.getElementById("questionHint").classList.add("hidden");

    const result = document.getElementById("yesResult");
    result.classList.remove("hidden");

    // Remove the ending button so it cannot restart anything.
    const endingButton = result.querySelector("button");

    if (endingButton) {
        endingButton.remove();
    }

    // Replace the final heading with the ending message.
    const heading = result.querySelector("h2");

    if (heading) {
        heading.textContent = "Forever in My Heart ❤️";
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ========================================
// INITIALIZE
// ========================================

showScreen(0);
