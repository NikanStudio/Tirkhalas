/* =========================================================
   TIR KHOLAS
   NIKAN STUDIO
   TOUCH + SOUND
========================================================= */

const intro = document.getElementById("intro");
const game = document.getElementById("game");

const world = document.getElementById("world");
const scene = document.getElementById("scene");
const target = document.getElementById("target");

const crosshair = document.getElementById("crosshair");
const scoreText = document.getElementById("score");
const message = document.getElementById("message");

const fireButton = document.getElementById("fireButton");
const shot = document.getElementById("shot");
const restartButton = document.getElementById("restartButton");


/* =========================================================
   GAME VARIABLES
========================================================= */

let score = 0;

let cameraX = 0;
let cameraY = 0;

let startX = 0;
let startY = 0;

let startCameraX = 0;
let startCameraY = 0;

let dragging = false;
let shooting = false;

let audioContext = null;


/* =========================================================
   CAMERA LIMITS
========================================================= */

const MAX_X = 240;
const MIN_X = -240;

const MAX_Y = 170;
const MIN_Y = -170;


/* =========================================================
   AUDIO SYSTEM
========================================================= */

function startAudio() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (AudioContext) {
            audioContext = new AudioContext();
        }

    }

    if (
        audioContext &&
        audioContext.state === "suspended"
    ) {

        audioContext.resume();

    }

}


/* =========================================================
   CREATE SOUND
========================================================= */

function sound(
    frequency,
    duration,
    type = "sine",
    volume = 0.08
) {

    if (!audioContext) {
        return;
    }

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    oscillator.type = type;

    oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
    );


    gain.gain.setValueAtTime(
        volume,
        audioContext.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
    );


    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );


    oscillator.start();

    oscillator.stop(
        audioContext.currentTime +
        duration
    );

}


/* =========================================================
   SHOOT SOUND
========================================================= */

function shootSound() {

    if (!audioContext) {
        return;
    }


    const now =
        audioContext.currentTime;


    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    oscillator.type = "triangle";


    oscillator.frequency.setValueAtTime(
        170,
        now
    );


    oscillator.frequency.exponentialRampToValueAtTime(
        55,
        now + 0.14
    );


    gain.gain.setValueAtTime(
        0.22,
        now
    );


    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + 0.16
    );


    oscillator.connect(gain);

    gain.connect(
        audioContext.destination
    );


    oscillator.start(now);

    oscillator.stop(
        now + 0.16
    );

}


/* =========================================================
   HIT SOUND
========================================================= */

function hitSound() {

    sound(
        720,
        0.08,
        "sine",
        0.12
    );


    setTimeout(() => {

        sound(
            1050,
            0.12,
            "sine",
            0.1
        );

    }, 70);

}


/* =========================================================
   MISS SOUND
========================================================= */

function missSound() {

    sound(
        170,
        0.18,
        "sawtooth",
        0.07
    );


    setTimeout(() => {

        sound(
            110,
            0.2,
            "sawtooth",
            0.05
        );

    }, 80);

}


/* =========================================================
   START GAME
========================================================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        intro.style.display = "none";

        game.classList.remove("hidden");

        createTarget();

        resetCamera();

    }, 2000);

});


/* =========================================================
   CREATE TARGET
========================================================= */

function createTarget() {

    const x =
        18 +
        Math.random() * 64;

    const y =
        25 +
        Math.random() * 48;


    target.style.left =
        x + "%";

    target.style.top =
        y + "%";

}


/* =========================================================
   POINTER DOWN
========================================================= */

world.addEventListener(
    "pointerdown",
    (event) => {

        startAudio();


        if (
            event.target.closest("#fireButton") ||
            event.target.closest("#restartButton")
        ) {
            return;
        }


        dragging = true;


        startX =
            event.clientX;

        startY =
            event.clientY;


        startCameraX =
            cameraX;

        startCameraY =
            cameraY;


        world.setPointerCapture(
            event.pointerId
        );

    }
);


/* =========================================================
   POINTER MOVE
========================================================= */

world.addEventListener(
    "pointermove",
    (event) => {

        if (!dragging) {
            return;
        }


        const moveX =
            event.clientX -
            startX;

        const moveY =
            event.clientY -
            startY;


        cameraX =
            startCameraX +
            moveX;


        cameraY =
            startCameraY +
            moveY;


        if (cameraX > MAX_X) {
            cameraX = MAX_X;
        }

        if (cameraX < MIN_X) {
            cameraX = MIN_X;
        }


        if (cameraY > MAX_Y) {
            cameraY = MAX_Y;
        }

        if (cameraY < MIN_Y) {
            cameraY = MIN_Y;
        }


        updateCamera();

    }
);


/* =========================================================
   POINTER UP
========================================================= */

world.addEventListener(
    "pointerup",
    () => {

        dragging = false;

    }
);


world.addEventListener(
    "pointercancel",
    () => {

        dragging = false;

    }
);


/* =========================================================
   CAMERA
========================================================= */

function updateCamera() {

    scene.style.transform =
        `translate3d(
            ${cameraX}px,
            ${cameraY}px,
            0
        )`;

}


/* =========================================================
   FIRE BUTTON
========================================================= */

fireButton.addEventListener(
    "pointerdown",
    (event) => {

        event.stopPropagation();

        startAudio();

    }
);


fireButton.addEventListener(
    "click",
    () => {

        shoot();

    }
);


/* =========================================================
   SHOOT
========================================================= */

function shoot() {

    if (shooting) {
        return;
    }


    shooting = true;


    startAudio();


    /* صدای شلیک */

    shootSound();


    /* انیمیشن شلیک */

    shot.classList.remove("active");

    void shot.offsetWidth;

    shot.classList.add("active");


    /* موقعیت هدف */

    const targetRect =
        target.getBoundingClientRect();

    const crossRect =
        crosshair.getBoundingClientRect();


    const targetCenterX =
        targetRect.left +
        targetRect.width / 2;

    const targetCenterY =
        targetRect.top +
        targetRect.height / 2;


    const crossCenterX =
        crossRect.left +
        crossRect.width / 2;

    const crossCenterY =
        crossRect.top +
        crossRect.height / 2;


    /* فاصله هدف تا نشانه */

    const distance =
        Math.sqrt(

            Math.pow(
                targetCenterX -
                crossCenterX,
                2
            )

            +

            Math.pow(
                targetCenterY -
                crossCenterY,
                2
            )

        );


    /* محدوده برخورد */

    const hitRange =
        Math.max(
            38,
            targetRect.width * 0.27
        );


    if (
        distance <=
        hitRange
    ) {

        hitTarget();

    } else {

        missTarget();

    }


    setTimeout(() => {

        shot.classList.remove(
            "active"
        );

        shooting = false;

    }, 180);

}


/* =========================================================
   HIT
========================================================= */

function hitTarget() {

    score++;


    scoreText.textContent =
        score;


    message.textContent =
        "+1 امتیاز 🎯";


    /* صدای موفقیت */

    hitSound();


    target.classList.remove(
        "hit"
    );


    void target.offsetWidth;


    target.classList.add(
        "hit"
    );


    setTimeout(() => {

        createTarget();


        message.textContent =
            "هدف بعدی را پیدا کن!";

    }, 300);

}


/* =========================================================
   MISS
========================================================= */

function missTarget() {

    missSound();


    message.textContent =
        "خطا! هدف را زیر + قرار بده";


    setTimeout(() => {

        message.textContent =
            "با انگشت محیط را حرکت بده";

    }, 700);

}


/* =========================================================
   RESET CAMERA
========================================================= */

function resetCamera() {

    cameraX = 0;

    cameraY = 0;


    scene.style.transform =
        "translate3d(0, 0, 0)";

}


/* =========================================================
   RESTART
========================================================= */

restartButton.addEventListener(
    "click",
    () => {

        startAudio();


        score = 0;


        scoreText.textContent =
            "0";


        message.textContent =
            "با انگشت محیط را حرکت بده";


        resetCamera();

        createTarget();


        sound(
            500,
            0.08,
            "sine",
            0.07
        );

    }
);


/* =========================================================
   KEYBOARD
========================================================= */

window.addEventListener(
    "keydown",
    (event) => {

        startAudio();


        const speed = 25;


        if (
            event.key === "ArrowLeft"
        ) {

            cameraX -= speed;

        }


        if (
            event.key === "ArrowRight"
        ) {

            cameraX += speed;

        }


        if (
            event.key === "ArrowUp"
        ) {

            cameraY -= speed;

        }


        if (
            event.key === "ArrowDown"
        ) {

            cameraY += speed;

        }


        if (
            event.key === " " ||
            event.key === "Enter"
        ) {

            shoot();

        }


        if (cameraX > MAX_X) {
            cameraX = MAX_X;
        }

        if (cameraX < MIN_X) {
            cameraX = MIN_X;
        }

        if (cameraY > MAX_Y) {
            cameraY = MAX_Y;
        }

        if (cameraY < MIN_Y) {
            cameraY = MIN_Y;
        }


        updateCamera();

    }
);
