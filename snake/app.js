const canvas = document.getElementById("myCanvas");

//getContext() method會回傳一個canvas的drawing context
const ctx = canvas.getContext("2d");

const unit = 20;
const row = canvas.height / unit; // 400 / 20 = 20
const column = canvas.width / unit;
let direction = "down";

let score = 0;
let updete_score = document.getElementById("myScore");
let updete_bestScore = document.getElementById("bestScore");
let bestScore = localStorage.getItem("bestScore") || 0;

let snake = []; //array中的每個元素都是物件，用於儲存身體座標

function creatSnake() {
  snake[0] = {
    x: 80,
    y: 20,
  };

  snake[1] = {
    x: 60,
    y: 20,
  };

  snake[2] = {
    x: 40,
    y: 20,
  };

  snake[3] = {
    x: 20,
    y: 20,
  };
}

class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    function cheakOverlap(new_x, new_y) {
      snake.forEach((x, y) => {
        if (new_x == x || new_y == y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      });
      return;
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      cheakOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

creatSnake();
let myFruit = new Fruit();

function draw() {
  for (let j = 1; j < snake.length; j++) {
    if (snake[j].x == snake[0].x && snake[j].y == snake[0].y) {
      clearInterval(myGame);
      alert("Game Over");
      localStorage.setItem("bestScore", bestScore);
      return;
    }
  }

  if (bestScore < score) {
    bestScore = score;
  }
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  updete_score.innerHTML = "Score: " + score;
  updete_bestScore.innerHTML = "Best score: " + bestScore;

  myFruit.drawFruit();
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white";
    //    fillRect(x,y,width,height)
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  //以目前方向，決定蛇的下一幀要放在哪個座標
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (direction == "left") {
    snakeX -= unit;
    if (snakeX < 0) {
      snakeX = canvas.width - unit;
    }
  } else if (direction == "right") {
    snakeX += unit;
    if (snakeX >= canvas.width) {
      snakeX = 0;
    }
  } else if (direction == "up") {
    snakeY -= unit;
    if (snakeY < 0) {
      snakeY = canvas.height - unit;
    }
  } else if (direction == "down") {
    snakeY += unit;
    if (snakeY >= canvas.height) {
      snakeY = 0;
    }
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.pickALocation();
    score += 1;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

function changeDirection(event) {
  if (event.key == "ArrowUp" && direction != "down") {
    direction = "up";
  } else if (event.key == "ArrowDown" && direction != "up") {
    direction = "down";
  } else if (event.key == "ArrowRight" && direction != "left") {
    direction = "right";
  } else if (event.key == "ArrowLeft" && direction != "right") {
    direction = "left";
  }

  window.removeEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);
