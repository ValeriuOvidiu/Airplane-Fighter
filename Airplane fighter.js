class plane {
  
  constructor() {
    this.x = 300
    this.y = 600
    this.vx = 5
    this.color = "white"
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color
    ctx.moveTo(this.x + 10, this.y - 10);
    ctx.lineTo(this.x, this.y - 20);
    ctx.lineTo(this.x - 10, this.y - 10);
    ctx.lineTo(this.x - 10, this.y - 10)
    ctx.lineTo(this.x - 20, this.y - 10)
    ctx.lineTo(this.x - 20, this.y + 10)
    ctx.lineTo(this.x - 10, this.y + 10)
    ctx.lineTo(this.x - 10, this.y + 20)
    ctx.lineTo(this.x + 10, this.y + 20)
    ctx.lineTo(this.x + 10, this.y + 10)
    ctx.lineTo(this.x + 20, this.y + 10)
    ctx.lineTo(this.x + 20, this.y - 10)
    ctx.lineTo(this.x + 10, this.y - 10)
    ctx.fill();
  }
}
class ball {

  constructor() {
    this.x = Math.floor(Math.random() * (700 - 0) + 0)
    this.y = -20
    this.radius = Math.floor(Math.random() * (80 - 30) + 30)
    this.color = "grey"

  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.shadowColor = this.shadowColor
    ctx.shadowBlur = this.shadowBlur
    ctx.fillStyle = this.color;
    for (let i = 0; i < this.whinnerStyle; i++) {
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 10 * i, 0, Math.PI * 2, true);
      ctx.fill();
    }
    ctx.fill();
  }
}

const image = new Image();
image.src = "background.png"
const flyingPlane = new plane()

window.onload = function () {
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d")
  ctx.drawImage(image, 0, 0, 700, 700)
  ctx.fillStyle = "green"
  ctx.fillRect(200, 300, 300, 100)
  ctx.fillStyle = "purple"
  ctx.font = "48px serif";
  ctx.fillText("Start", 300, 350);
  canvas.addEventListener("click", start)
}

let newObstacolInterval

function start(event) {
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d")
  if (event.offsetX > 200 && event.offsetX < 500 && event.offsetY > 300 && event.offsetY < 400) {
    canvas.removeEventListener("click", start)
    flyingPlane.draw(ctx)
    window.requestAnimationFrame(drawObstacles)
    addEvent(canvas)
    newObstacolInterval = setInterval(newObstacol, 300)
    intervalID = setInterval(countScore, 1000)
  }
 
}

let rightPressed = false;
let leftPressed = false;


function addEvent(canvas) {
  document.addEventListener("keydown", keyDownHandler)
  document.addEventListener("keyup", keyUpHandler);
}

let animationId

function keyDownHandler(event) {
  if (event.keyCode === 39) {
    rightPressed = true;
  }
  if (event.keyCode === 37) {
    leftPressed = true;
  }
  animationId = window.requestAnimationFrame(draw);
}

function keyUpHandler(event) {
  if (event.keyCode === 39) {
    rightPressed = false;
  }
  if (event.keyCode === 37) {
    leftPressed = false;
  }
  lastTime = null
  window.cancelAnimationFrame(animationId)
}

let speed = 40
let lastTime = null;

function draw(currentTime) {
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d")
  if (rightPressed && flyingPlane.x < 700) {
    if (!lastTime) {
      lastTime = currentTime;
    }
    const elapsedTime = currentTime - lastTime;
    const distance = speed * elapsedTime / 100;
    flyingPlane.x += distance;
  }
  if (leftPressed && flyingPlane.x > 0) {
    if (!lastTime) {
      lastTime = currentTime;
    }
    const elapsedTime = currentTime - lastTime;
    const distance = speed * elapsedTime / 100;
    flyingPlane.x -= distance;
  }
  lastTime = currentTime;
  flyingPlane.draw(ctx)
}

const arrayOfObstacles = []
for (let i = 0; i < 50; ++i) {
  arrayOfObstacles[i] = new ball()
}
let numbreOfDrows = 0;
let speedOfMeteor = 40
let timeMemory = null;
let maxNumbre = 1
let min = 0

function newObstacol() {
  ++maxNumbre
}

let score = 0
let intervalID 
function countScore() {
  ++score
}

function reset() {
  for (let i = 0; i < 50; ++i) {
    arrayOfObstacles[i] = new ball()
  }
  min = 0
  maxNumbre = 1
  lastTime = null
  speedOfMeteor +=10
  speed +=10
  timeMemory = null
  newObstacolInterval = setInterval(newObstacol, 300)
  secondAnimationId = window.requestAnimationFrame(drawObstacles)  
}

let secondAnimationId

function drawObstacles(timeStamp) {
  if (!timeMemory) {
    timeMemory = timeStamp
  }
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, 700, 700);
  ctx.drawImage(image, 0, 0, 700, 700)
  let crash = false
  for (let i = min; i < maxNumbre; ++i) {
    if (maxNumbre == 48) {
      clearInterval(newObstacolInterval)
      maxNumbre=49
    }
    if (arrayOfObstacles[i].y > 800) {
      ++min;
    }
    if(arrayOfObstacles[48].y>800){
      reset()
      return
    }
    let a = flyingPlane.x - arrayOfObstacles[i].x;
    let b = flyingPlane.y - arrayOfObstacles[i].y;
    let c = Math.sqrt(a * a + b * b);
    if (c < arrayOfObstacles[i].radius + 20) {
      crash = true
    }
    const elapsedTime = timeStamp - timeMemory;
    const distance = speedOfMeteor * elapsedTime / 100
    arrayOfObstacles[i].y += distance
    arrayOfObstacles[i].draw(ctx)
  }
  timeMemory = timeStamp
  ctx.fillStyle = "white"
  ctx.font = "30px serif";
  ctx.fillText("score: " + score, 10, 650);
  if (crash) {
    cancelAnimationFrame(secondAnimationId)
    document.removeEventListener("keydown", keyDownHandler)
    flyingPlane.color = "red"
    flyingPlane.draw
    gameOver(ctx, canvas)
    return;
  }
  secondAnimationId = window.requestAnimationFrame(drawObstacles)
  window.requestAnimationFrame(draw)
}

function gameOver(ctx, canvas) {
  clearInterval(newObstacolInterval)
  ctx.fillStyle = "green"
  ctx.fillRect(200, 300, 300, 100)
  ctx.fillRect(280, 410, 150, 50)
  ctx.fillStyle = "purple"
  ctx.font = "48px serif";
  ctx.fillText("Score: " + score, 270, 360);
  ctx.fillText("Restart", 290, 450)
  canvas.addEventListener("click", restart)

}

function restart(event) {
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d")
  for (let i = 0; i < 50; ++i) {
    arrayOfObstacles[i] = new ball()
  }
  if (event.offsetX > 280 && event.offsetX < 430 && event.offsetY > 410 && event.offsetY < 460) {
    canvas.removeEventListener("click", restart)
    flyingPlane.draw(ctx)
    window.requestAnimationFrame(drawObstacles)
    addEvent(canvas)
    min = 0
    maxNumbre = 1
    score = 0
    lastTime = null
    speedOfMeteor = 40
    speed = 40
    timeMemory = null
    flyingPlane.color = "white"
    newObstacolInterval = setInterval(newObstacol, 300)
  }
}
