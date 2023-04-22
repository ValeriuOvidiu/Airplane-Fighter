const ten=10
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
    ctx.moveTo(this.x + ten, this.y - ten);
    ctx.lineTo(this.x, this.y - ten*2);
    ctx.lineTo(this.x - ten, this.y - ten);
    ctx.lineTo(this.x - ten, this.y - ten)
    ctx.lineTo(this.x - ten*2, this.y - ten)
    ctx.lineTo(this.x - ten*2, this.y + ten)
    ctx.lineTo(this.x - ten, this.y + ten)
    ctx.lineTo(this.x - ten, this.y + ten*2)
    ctx.lineTo(this.x + ten, this.y + ten*2)
    ctx.lineTo(this.x + ten, this.y + ten)
    ctx.lineTo(this.x + ten*2, this.y + ten)
    ctx.lineTo(this.x + ten*2, this.y - ten)
    ctx.lineTo(this.x + ten, this.y - ten)
    ctx.fill();
  }
}

const canvasWidth=700
const canvasHeight=700
const maxSizeBall=80
const minSizeBall=30

class ball {

  constructor() {
    this.x = Math.floor(Math.random() * (canvasWidth - 0) + 0)
    this.y = -20
    this.radius = Math.floor(Math.random() * (maxSizeBall - minSizeBall) + minSizeBall)
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
      ctx.arc(this.x, this.y, ten * i, 0, Math.PI * 2, true);
      ctx.fill();
    }
    ctx.fill();
  }
}

const image = new Image();
image.src = "background.png"
const flyingPlane = new plane()
const startRectX=200
const startRectY=300
const startRectWidth=300
const startRectHeight=100

window.onload = function () {
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d")
  ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight)
  ctx.fillStyle = "green"
  ctx.fillRect(startRectX,  startRectY, startRectWidth, startRectHeight)
  ctx.fillStyle = "purple"
  ctx.font = "48px serif";
  ctx.fillText("Start", 300, 350);
  canvas.addEventListener("click", start)
}

let newObstacolInterval

function start(event) {
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d")
  if (event.offsetX > startRectX && event.offsetX < startRectX+startRectWidth && event.offsetY > startRectY && event.offsetY < startRectY+startRectHeight) {
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
const arrowLeft=37
const arrowRight=39

function keyDownHandler(event) {
  if (event.keyCode === arrowRight) {
    rightPressed = true;
  }
  if (event.keyCode === arrowLeft) {
    leftPressed = true;
  }
  animationId = window.requestAnimationFrame(draw);
}

function keyUpHandler(event) {
  if (event.keyCode === arrowRight) {
    rightPressed = false;
  }
  if (event.keyCode === arrowLeft) {
    leftPressed = false;
  }
  lastTime = null
  window.cancelAnimationFrame(animationId)
}

let speedOfPlane = 40
let lastTime = null;

function draw(currentTime) {
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d")
  if (rightPressed && flyingPlane.x < canvasWidth) {
    if (!lastTime) {
      lastTime = currentTime;
    }
    const elapsedTime = currentTime - lastTime;
    const distance = speedOfPlane * elapsedTime / 100;
    flyingPlane.x += distance;
  }
  if (leftPressed && flyingPlane.x > 0) {
    if (!lastTime) {
      lastTime = currentTime;
    }
    const elapsedTime = currentTime - lastTime;
    const distance = speedOfPlane * elapsedTime / 100;
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
let  endOfSegment = 1
let startOfSegment = 0

function newObstacol() {
  ++ endOfSegment
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
  startOfSegment = 0
   endOfSegment = 1
  lastTime = null
  speedOfMeteor +=ten
  speedOfPlane +=ten
  timeMemory = null
  newObstacolInterval = setInterval(newObstacol, 300)
  secondAnimationId = window.requestAnimationFrame(drawObstacles)  
}

let secondAnimationId
const endOfDanger=800

function drawObstacles(timeStamp) {
  if (!timeMemory) {
    timeMemory = timeStamp
  }
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d")
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight)
  let crash = false
  for (let i = startOfSegment; i <  endOfSegment; ++i) {
    if ( endOfSegment == 48) {
      clearInterval(newObstacolInterval)
       endOfSegment=49
    }
    if (arrayOfObstacles[i].y > endOfDanger) {
      ++startOfSegment;
    }
    if(arrayOfObstacles[48].y>endOfDanger){
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
  ctx.fillText("score: " + score, ten, 650);
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

const scoreRectX=200
const scoreRectY=300
const scoreRectWidth=300
const scoreRectHeight=100
const restartRectX=280
const restartRectY=410
const restartRectWidth=150
const restartRectHeight=50

function gameOver(ctx, canvas) {
  clearInterval(newObstacolInterval)
  ctx.fillStyle = "green"
  ctx.fillRect(scoreRectX, scoreRectY, scoreRectWidth, scoreRectHeight)
  ctx.fillRect(restartRectX, restartRectY, restartRectWidth, restartRectHeight)
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
  if (event.offsetX > restartRectX && event.offsetX < restartRectX+restartRectWidth && event.offsetY > restartRectY && event.offsetY < restartRectY+restartRectHeight) {
    canvas.removeEventListener("click", restart)
    flyingPlane.draw(ctx)
    window.requestAnimationFrame(drawObstacles)
    addEvent(canvas)
    startOfSegment = 0
     endOfSegment = 1
    score = 0
    lastTime = null
    speedOfMeteor = 40
    speedOfPlane = 40
    timeMemory = null
    flyingPlane.color = "white"
    newObstacolInterval = setInterval(newObstacol, 300)
  }
}
