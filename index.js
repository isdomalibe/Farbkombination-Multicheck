const colors = ['red', 'blue', 'black'];
let sequence = [];
let userClicks = [];
const patternContainer = document.getElementById('pattern');
const userInputContainer = document.getElementById('userInput');
const checkButton = document.getElementById('checkButton');
const feedback = document.getElementById('feedback');
let isCorrect = false;  // New variable to track if the user has answered correctly

checkButton.addEventListener('click', checkSequence);

function generateSequence(length = 6) {
    sequence = [];
    for (let i = 0; i < length; i++) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        sequence.push(randomColor);
    }
    displayPattern();
}

function displayPattern() {
    patternContainer.innerHTML = '';
    userInputContainer.innerHTML = '';
    sequence.forEach(color => {
        const circle = document.createElement('div');
        circle.classList.add('circle', color);
        patternContainer.appendChild(circle);
    });
    setTimeout(() => {
        patternContainer.innerHTML = '';
        createUserCircles();
    }, 3000);
}

function createUserCircles() {
    for (let i = 0; i < sequence.length; i++) {
        const circle = document.createElement('div');
        circle.classList.add('circle', 'hidden');
        circle.dataset.index = i;
        circle.addEventListener('click', cycleColor);
        userInputContainer.appendChild(circle);
    }
}

function cycleColor(event) {
    // Prevent further cycling if the sequence has already been matched correctly
    if (isCorrect) return;

    const circle = event.target;
    let currentColor = circle.classList[1];
    let nextColorIndex = (colors.indexOf(currentColor) + 1) % colors.length;
    circle.classList.remove('red', 'blue', 'black', 'hidden');
    circle.classList.add(colors[nextColorIndex]);

    // Enable the button once all circles have been clicked
    if (Array.from(userInputContainer.children).every(c => c.classList.length > 1)) {
        checkButton.disabled = false;
    }
}

function checkSequence() {
    const userColors = Array.from(userInputContainer.children).map(c => c.classList[1]);

    // Check if the user's sequence matches the generated sequence
    if (userColors.every((color, index) => color === sequence[index])) {
        feedback.textContent = 'Richtig!';
        feedback.style.color = 'green';
        isCorrect = true; // Set isCorrect to true once the user is correct

        // Freeze the circles after a correct match
        freezeCircles();

        // Disable the button after a correct match
        checkButton.disabled = true;

        // Generate a new sequence after a short delay
        setTimeout(() => {
            feedback.textContent = ''; // Clear feedback
            generateSequence(); // Start a new sequence
            isCorrect = false;  // Reset the correctness flag for the next round
        }, 2000);
    } else {
        feedback.textContent = 'Falsch! Versuche es erneut.';
        feedback.style.color = 'red';
    }
}

// Lock the colors in place so they can't be changed
function freezeCircles() {
    Array.from(userInputContainer.children).forEach(circle => {
        circle.removeEventListener('click', cycleColor);  // Remove the event listener to stop color cycling
        circle.classList.add('frozen');  // Add a class to indicate the circle is "locked"
    });
}

// Start the game by generating the first sequence
generateSequence();
