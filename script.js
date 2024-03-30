const board = document.getElementById('game-board');
const instructionsText = document.getElementById('instructions-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score')
const highScoreText = document.getElementById('high-score')
const snakeHead = document.getElementsByClassName('snake');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }]
let food = generateFood();
let highScore = localStorage.getItem('high-score') ?? 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

function draw() {
    board.innerHTML = '';

    drawSnake();
    drawFood();
    updateScore();
    setSnakeHeadClass(direction);
    setSnakeTailClass(direction);
}

function drawSnake() {
    if(gameStarted) {
        snake.forEach((segment, index) => {
            const snakeElement = createGameElement('div', 'snake');
            setPosition(snakeElement, segment);

            if (index === 0) {
                snakeElement.classList.remove('snake-top');
                snakeElement.classList.remove('snake-bottom');
                snakeElement.classList.remove('snake-left');
                snakeElement.classList.remove('snake-right');
            }

            board.appendChild(snakeElement)
        });
    }
}

function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;

    return element;
}

// Set the position of the snake or the food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food)
        board.appendChild(foodElement)
    }
}

function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;

    return { x, y }
}

function move() {
    const head = { ...snake[0] }

    switch (direction) {
        case 'right':
            head.x++;
            break;
        case 'left':
            head.x--;
            break;
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
    }

    setSnakeHeadClass(direction);
    setSnakeTailClass(direction);

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();

        increaseSpeed();
        clearInterval(gameInterval);

        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}

function setSnakeHeadClass(direction) {
    const head = snakeHead[0];

    if (head) {
        switch (direction) {
            case 'right':
                head.classList.remove('snake-top');
                head.classList.remove('snake-bottom');
                head.classList.remove('snake-left');
                head.classList.add('snake-right');
                break;
            case 'left':
                head.classList.remove('snake-top');
                head.classList.remove('snake-bottom');
                head.classList.remove('snake-right');
                head.classList.add('snake-left');
                break;
            case 'up':
                head.classList.remove('snake-right');
                head.classList.remove('snake-left');
                head.classList.remove('snake-bottom');
                head.classList.add('snake-top');
                break;
            case 'down':
                head.classList.remove('snake-right');
                head.classList.remove('snake-left');
                head.classList.remove('snake-top');
                head.classList.add('snake-bottom');
                break;
        }
    }
}

function setSnakeTailClass(direction) {
    let tail = snakeHead[snakeHead.length - 1];

    if (tail === -1) {
        tail = snakeHead[0]
    }

    if (tail) {
        switch (direction) {
            case 'right':
                tail.classList.remove('snake-tail-top');
                tail.classList.remove('snake-tail-bottom');
                tail.classList.remove('snake-tail-left');
                tail.classList.add('snake-tail-right');
                break;
            case 'left':
                tail.classList.remove('snake-tail-top');
                tail.classList.remove('snake-tail-bottom');
                tail.classList.remove('snake-tail-right');
                tail.classList.add('snake-tail-left');
                break;
            case 'up':
                tail.classList.remove('snake-tail-right');
                tail.classList.remove('snake-tail-left');
                tail.classList.remove('snake-tail-bottom');
                tail.classList.add('snake-tail-top');
                break;
            case 'down':
                tail.classList.remove('snake-tail-right');
                tail.classList.remove('snake-tail-left');
                tail.classList.remove('snake-tail-top');
                tail.classList.add('snake-tail-bottom');
                break;
        }
    }
}

function startGame() {
    gameStarted = true;
    instructionsText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay)
}

function handleKeyPress(event) {
    if (
        (!gameStarted && event.code === 'Space') ||
        (!gameStarted && event.key === ' ')
    ) {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowRight':
                if (direction !== 'left') direction = 'right';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') direction = 'left';
                break;
            case 'ArrowUp':
                if (direction !== 'down') direction = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') direction = 'down';
                break;
        }
    }
}

function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if(gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    }  else if(gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if(gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

function checkCollision() {
    const head = snake[0];

    if (
        head.x < 1 ||
        head.x > gridSize ||
        head.y < 1 ||
        head.y > gridSize
    ) {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    updateHighScore();
    stopGame();

    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;

    updateScore();
}

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

function updateHighScore() {
    const currentScore = snake.length - 1;

    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
        localStorage.setItem('high-score', highScore.toString());
    }

    highScoreText.style.display = 'block';
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionsText.style.display = 'block';
    logo.style.display = 'block';
}

document.addEventListener('keydown', handleKeyPress);