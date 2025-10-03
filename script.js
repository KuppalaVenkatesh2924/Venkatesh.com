const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 25;
let snake, direction, food, score;

// Initialize game
function initGame() {
  snake = [{ x: 10 * box, y: 10 * box }];
  direction = null;
  food = randomFood();
  score = 0;
  drawGame(); // Draw initial frame
  document.getElementById("score").innerText = "Score: " + score;
}

// Random food generator
function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

// Keyboard controls
document.addEventListener("keydown", (event) => changeDirection(event.key));

// On-screen buttons
document.getElementById("up").addEventListener("click", () => changeDirection("ArrowUp"));
document.getElementById("down").addEventListener("click", () => changeDirection("ArrowDown"));
document.getElementById("left").addEventListener("click", () => changeDirection("ArrowLeft"));
document.getElementById("right").addEventListener("click", () => changeDirection("ArrowRight"));

// Change direction and move snake manually
function changeDirection(key) {
  if ((key === "ArrowLeft") && direction !== "RIGHT") direction = "LEFT";
  if ((key === "ArrowUp") && direction !== "DOWN") direction = "UP";
  if ((key === "ArrowRight") && direction !== "LEFT") direction = "RIGHT";
  if ((key === "ArrowDown") && direction !== "UP") direction = "DOWN";
  
  moveSnake(); // Move snake on every key press
}

// Draw snake with gradient
function drawSnake() {
  for (let i = 0; i < snake.length; i++) {
    let gradient = ctx.createLinearGradient(snake[i].x, snake[i].y, snake[i].x + box, snake[i].y + box);
    gradient.addColorStop(0, "#00ff00");
    gradient.addColorStop(1, "#00cc00");
    ctx.fillStyle = gradient;
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "#003300";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }
}

// Draw food
function drawFood() {
  let gradient = ctx.createRadialGradient(food.x + box/2, food.y + box/2, 5, food.x + box/2, food.y + box/2, box/2);
  gradient.addColorStop(0, "#ff0000");
  gradient.addColorStop(1, "#aa0000");
  ctx.fillStyle = gradient;
  ctx.fillRect(food.x, food.y, box, box);
}

// Draw background grid
function drawBackground() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < canvas.width; i += box) {
    for (let j = 0; j < canvas.height; j += box) {
      ctx.strokeStyle = "#111";
      ctx.strokeRect(i, j, box, box);
    }
  }
}

// Check collision
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) return true;
  }
  return false;
}

// Move snake manually
function moveSnake() {
  drawBackground();
  drawSnake();
  drawFood();

  if (!direction) return; // Do not move if no direction selected

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  // Eat food
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = randomFood();
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  // Game over
  if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
    alert("Game Over! Score: " + score);
    initGame();
    return;
  }

  snake.unshift(newHead);
  document.getElementById("score").innerText = "Score: " + score;
}

// Initialize game on page load
initGame();
