let cards = [];
let flippedCards = [];
let matchedCards = 0;
let attempts = 0;
let timer = 0;
let timerInterval;
let score = 0;

function startGame() {
    const difficultyContainer = document.getElementById('difficulty-container');
    const gameContainer = document.getElementById('game-container');
    const size = parseInt(document.getElementById('difficulty').value);
    let cardCount;

    // Set card count based on difficulty level
    switch (size) {
        case 4:
            cardCount = 10; // Easy: 10 cards (5 pairs)
            break;
        case 5:
            cardCount = 16; // Medium: 16 cards (8 pairs)
            break;
        case 6:
            cardCount = 20; // Hard: 20 cards (10 pairs)
            break;
        default:
            cardCount = 10; // Default to Easy
    }

    difficultyContainer.style.display = 'none';
    gameContainer.style.display = 'block';

    clearInterval(timerInterval);
    timer = 0;
    attempts = 0;
    matchedCards = 0;
    score = 0;
    flippedCards = [];
    cards = generateCards(cardCount);
    renderBoard(cardCount);
    updateStats();
    timerInterval = setInterval(() => {
        timer++;
        updateStats();
    }, 1000);
}

function updateStats() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    document.getElementById('timer').innerText = `Time: ${minutes}m ${seconds}s`;
    document.getElementById('attempts').innerText = `Attempts: ${attempts}`;
    document.getElementById('score').innerText = `Score: ${score}`;
}

function generateCards(cardCount) {
    let cardValues = Array.from({ length: cardCount / 2 }, (_, i) => i + 1);
    let cardSet = [...cardValues, ...cardValues];
    return cardSet.sort(() => 0.5 - Math.random());
}

function renderBoard(cardCount) {
    const board = document.getElementById('board');
    board.innerHTML = '';

    // Calculate the number of rows and columns
    const cols = Math.ceil(Math.sqrt(cardCount));
    const rows = Math.ceil(cardCount / cols);

    // Ensure gridTemplateColumns and gridTemplateRows are set
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    // Adjust card size based on the number of columns and rows
    const cardSize = Math.min(window.innerWidth / cols, window.innerHeight / rows) - 20; // 20 is for gaps and borders

    cards.forEach((value, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.style.width = `${cardSize}px`;
        card.style.height = `${cardSize}px`;
        card.style.fontSize = `${cardSize / 3}px`; // Adjust font size based on card size
        // Ensure the card starts with the back image
        card.style.backgroundImage = 'url(images/card-back.jpg)'; // Set the card back image
        card.addEventListener('click', () => flipCard(card, index));
        board.appendChild(card);
    });
}

function flipCard(card, index) {
    if (flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        card.style.backgroundImage = `url('images/card${card.dataset.value}.jpg')`; // Reveal the image
        flippedCards.push({ card, index });

        if (flippedCards.length === 2) {
            attempts++;
            checkMatch();
        }
    }
}

function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    if (firstCard.card.dataset.value === secondCard.card.dataset.value) {
        matchedCards += 2;
        score += 100;
        firstCard.card.classList.add('matched');
        secondCard.card.classList.add('matched');
        flippedCards = [];
        updateStats();
        if (matchedCards === cards.length) {
            clearInterval(timerInterval);
            alert(`You win! Time: ${Math.floor(timer / 60)}m ${timer % 60}s, Attempts: ${attempts}, Score: ${score}`);
        }
    } else {
        setTimeout(() => {
            firstCard.card.classList.remove('flipped');
            secondCard.card.classList.remove('flipped');
            firstCard.card.style.backgroundImage = 'url(images/card-back.jpg)'; // Hide image again
            secondCard.card.style.backgroundImage = 'url(images/card-back.jpg)'; // Hide image again
            score -= 20;
            updateStats();
            flippedCards = [];
        }, 1000);
    }
}

function restartGame() {
    const difficultyContainer = document.getElementById('difficulty-container');
    const gameContainer = document.getElementById('game-container');
    difficultyContainer.style.display = 'block';
    gameContainer.style.display = 'none';
    clearInterval(timerInterval);
}

window.addEventListener('resize', () => {
    const size = parseInt(document.getElementById('difficulty').value);
    renderBoard(size);
});

document.getElementById('game-container').style.display = 'none';
