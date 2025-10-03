const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 25; // size of each grid block
let snake, direction, food, score, game;

// Initialize game
function initGame() {
  snake = [{ x: 10 * box, y: 10 * box }];
  direction = null;
  food = randomFood();
  score = 0;
  document.getElementById("score").innerText = "Score: 0";
  clearInterval(game);
  drawGame(); // draw first frame
}

// Random food generator
function randomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box
  };
}

// Start and Restart
document.getElementById("start").addEventListener("click", () => {
  clearInterval(game);
  game = setInterval(drawGame, 120);
});
document.getElementById("restart").addEventListener("click", () => {
  initGame();
  game = setInterval(drawGame, 120);
});

// Keyboard controls
document.addEventListener("keydown", (event) => changeDirection(event.key));

// On-screen buttons
document.getElementById("up").addEventListener("click", () => changeDirection("ArrowUp"));
document.getElementById("down").addEventListener("click", () => changeDirection("ArrowDown"));
document.getElementById("left").addEventListener("click", () => changeDirection("ArrowLeft"));
document.getElementById("right").addEventListener("click", () => changeDirection("ArrowRight"));

// Change direction
function changeDirection(key) {
  if ((key === "ArrowLeft") && direction !== "RIGHT") direction = "LEFT";
  if ((key === "ArrowUp") && direction !== "DOWN") direction = "UP";
  if ((key === "ArrowRight") && direction !== "LEFT") direction = "RIGHT";
  if ((key === "ArrowDown") && direction !== "UP") direction = "DOWN";
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

// Draw food with pattern
function drawFood() {
  let gradient = ctx.createRadialGradient(food.x + box/2, food.y + box/2, 5, food.x + box/2, food.y + box/2, box/2);
  gradient.addColorStop(0, "#ff0000");
  gradient.addColorStop(1, "#aa0000");
  ctx.fillStyle = gradient;
  ctx.fillRect(food.x, food.y, box, box);
}

// Draw background grid pattern
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

// Collision check
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) return true;
  }
  return false;
}

// Main draw function
function drawGame() {
  drawBackground();
  drawSnake();
  drawFood();

  // Old head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // Move snake
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

  // New head
  let newHead = { x: snakeX, y: snakeY };

  // Game Over
  if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
    clearInterval(game);
    alert("Game Over! Score: " + score);
    return;
  }

  snake.unshift(newHead);

  document.getElementById("score").innerText = "Score: " + score;
}
