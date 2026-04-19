// Virtual Guitar Logic using Tone.js

const samplerUrls = {
    "A2": "A2.mp3",
    "A3": "A3.mp3",
    "A4": "A4.mp3",
    "B2": "B2.mp3",
    "B3": "B3.mp3",
    "B4": "B4.mp3",
    "C3": "C3.mp3",
    "C4": "C4.mp3",
    "C5": "C5.mp3",
    "D2": "D2.mp3",
    "D3": "D3.mp3",
    "D4": "D4.mp3",
    "E2": "E2.mp3",
    "E3": "E3.mp3",
    "E4": "E4.mp3",
    "F2": "F2.mp3",
    "F3": "F3.mp3",
    "F4": "F4.mp3",
    "G2": "G2.mp3",
    "G3": "G3.mp3",
    "G4": "G4.mp3"
};

const baseUrl = "https://nbrosowsky.github.io/tonejs-instruments/samples/guitar-acoustic/";

let sampler;
let isStarted = false;

// DOM Elements
const startBtn = document.getElementById('start-btn');
const startOverlay = document.getElementById('start-overlay');
const statusText = document.getElementById('status');
const stringWrappers = document.querySelectorAll('.string-wrapper');

// Initialize Sampler
function initSampler() {
    statusText.innerText = "Loading High Quality Samples...";
    
    sampler = new Tone.Sampler({
        urls: samplerUrls,
        baseUrl: baseUrl,
        onload: () => {
            statusText.innerText = "Ready to Play!";
            console.log("Sampler loaded");
        },
        onerror: (err) => {
            statusText.innerText = "Error loading samples. Using fallback synth.";
            console.error("Sampler error", err);
            // Fallback to simple poly synth if samples fail
            sampler = new Tone.PolySynth(Tone.Synth).toDestination();
        }
    }).toDestination();
}

// Play a note
function playNote(note, wrapperElement) {
    if (!sampler) return;

    // Trigger sound
    sampler.triggerAttackRelease(note, "2n");

    // Animation
    wrapperElement.classList.remove('playing');
    void wrapperElement.offsetWidth; // Force reflow
    wrapperElement.classList.add('playing');

    // Remove animation class after some time
    setTimeout(() => {
        wrapperElement.classList.remove('playing');
    }, 500);
}

// Start button click
startBtn.addEventListener('click', async () => {
    await Tone.start();
    initSampler();
    startOverlay.classList.add('hidden');
    isStarted = true;
});

// String Interactions
stringWrappers.forEach(wrapper => {
    const note = wrapper.getAttribute('data-note');
    
    wrapper.addEventListener('mousedown', () => {
        if (isStarted) playNote(note, wrapper);
    });

    wrapper.addEventListener('mouseenter', (e) => {
        // Only play if mouse button is held (strumming effect)
        if (isStarted && e.buttons === 1) {
            playNote(note, wrapper);
        }
    });
});

// Keyboard mapping
window.addEventListener('keydown', (e) => {
    if (!isStarted) return;
    
    const key = e.key;
    const wrapper = document.querySelector(`.string-wrapper[data-key="${key}"]`);
    
    if (wrapper) {
        const note = wrapper.getAttribute('data-note');
        playNote(note, wrapper);
    }
});
