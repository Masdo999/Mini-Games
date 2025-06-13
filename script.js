const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const eatSound = new Audio('eat.mp3');
const gameOverSound = new Audio('gameover.mp3');

const TILE_SIZE = 25;
const ROWS = 25;
const COLS = 25;

let snake = [{ x: TILE_SIZE * 5, y: TILE_SIZE * 5 }];
let velocityX = 0;
let velocityY = 0;
let food = spawnFood();
let score = 0;
let gameOver = false;
let restartBtn = document.getElementById("restartBtn");
let scoreText = document.getElementById("score");

document.addEventListener("keydown", changeDirection);

function gameLoop() {
  if (gameOver) return;

  setTimeout(() => {
    clearCanvas();
    move();
    drawFood();
    drawSnake();
    checkCollision();
    drawScore();
    gameLoop();
  }, 100); // 10 fps
}

function clearCanvas() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, TILE_SIZE, TILE_SIZE);
}

function drawSnake() {
  ctx.fillStyle = "limegreen";
  for (let part of snake) {
    ctx.fillRect(part.x, part.y, TILE_SIZE, TILE_SIZE);
  }
}

function move() {
  const head = { x: snake[0].x + velocityX * TILE_SIZE, y: snake[0].y + velocityY * TILE_SIZE };

  // Check for eating food
  if (head.x === food.x && head.y === food.y) {
    snake.unshift(head);
    score++;
    food = spawnFood();
  } else {
    snake.pop();
    snake.unshift(head);
  }
}

function spawnFood() {
  let x = Math.floor(Math.random() * COLS) * TILE_SIZE;
  let y = Math.floor(Math.random() * ROWS) * TILE_SIZE;
  return { x, y };
}

function changeDirection(e) {
  if (gameOver) return;

  switch (e.key) {
    case "ArrowUp":
      if (velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
      }
      break;
    case "ArrowDown":
      if (velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
      }
      break;
    case "ArrowLeft":
      if (velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
      }
      break;
    case "ArrowRight":
      if (velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
      }
      break;
  }
}

function checkCollision() {
  const head = snake[0];

  // Wall collision
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    endGame();
  }

  // Self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame();
    }
  }
}

function endGame() {
  gameOver = true;
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Game Over: " + score, canvas.width / 2 - 70, canvas.height / 2);
  restartBtn.style.display = "inline-block";
}

function drawScore() {
  scoreText.textContent = "Score: " + score;
}

function resetGame() {
  snake = [{ x: TILE_SIZE * 5, y: TILE_SIZE * 5 }];
  velocityX = 0;
  velocityY = 0;
  food = spawnFood();
  score = 0;
  gameOver = false;
  restartBtn.style.display = "none";
  gameLoop();
}

gameLoop();
