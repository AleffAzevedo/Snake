document.addEventListener("DOMContentLoaded", function(event) {
      const canvas = document.getElementById("gameCanvas");
      const context = canvas.getContext("2d");
      const gridSize = 25;
      const tileCount = canvas.width / gridSize;

      let snake = [{ x: 10, y: 10 }];
      let apple = { x: 5, y: 5 };
      let score = 0;
      let lives = 3;
      let gamePaused = false;

      let dx = 0;
      let dy = 0;

      function drawSnake() {
        snake.forEach(function(segment) {
          context.fillStyle = "#39ff14";
          context.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });
      }

      function drawApple() {
        context.fillStyle = "#ff073a";
        context.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
      }

      function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        if (snake[0].x === apple.x && snake[0].y === apple.y) {
          score++;
          generateApple();
        } else {
          snake.pop();
        }
      }

      function generateApple() {
        apple.x = Math.floor(Math.random() * tileCount);
        apple.y = Math.floor(Math.random() * tileCount);
      }

      function checkCollision() {
        if (snake[0].x < 0 || snake[0].y < 0 || snake[0].x >= tileCount || snake[0].y >= tileCount) {
          return true; // Collision with wall
        }

        for (let i = 1; i < snake.length; i++) {
          if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true; // Collision with own body
          }
        }

        return false;
      }

      function updateScore() {
        const scoreElement = document.getElementById("score");
        scoreElement.textContent = `Score: ${score}`;
      }

      function updateLives() {
        const livesElement = document.getElementById("lives");
        livesElement.textContent = `Lives: ${lives}`;
      }

      function updateGame() {
        if (gamePaused) {
          return;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);

        moveSnake();
        drawSnake();
        drawApple();

        if (checkCollision()) {
          lives--;

          if (lives === 0) {
            endGame();
          } else {
            resetGame();
          }
        }

        updateScore();
        updateLives();

        setTimeout(updateGame, 100);
      }

      function endGame() {
        gamePaused = true;
        alert("Game Over");
      }

      function resetGame() {
        snake = [{ x: 10, y: 10 }];
        score = 0;
        generateApple();
        gamePaused = false;
      }

      function handleKeyPress(event) {
        const keyPressed = event.keyCode;

        // Arrow Up
        if (keyPressed === 38 && dy !== 1) {
          dx = 0;
          dy = -1;
        }
        // Arrow Down
        else if (keyPressed === 40 && dy !== -1) {
          dx = 0;
          dy = 1;
        }
        // Arrow Left
        else if (keyPressed === 37 && dx !== 1) {
          dx = -1;
          dy = 0;
        }
        // Arrow Right
        else if (keyPressed === 39 && dx !== -1) {
          dx = 1;
          dy = 0;
        }
        // Spacebar
        else if (keyPressed === 32) {
          gamePaused = !gamePaused;
        }
      }

      document.addEventListener("keydown", handleKeyPress);

      updateGame();
    });