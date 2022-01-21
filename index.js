let boardData = []
let snake = {
  positions: [
    {
      x: 5,
      y: 3
    },
    {
      x: 5,
      y: 4
    },
    {
      x: 5,
      y: 5
    }
  ],
  direction: 'right'
}
let food = {
  x: 0,
  y: 0,
}
let score = 0
let isStart = false

function createBoardData(boardData) {
  for (let i = 0; i < 25; i++) {
    let row = []
    for (let j = 0; j < 25; j++) {
      let col = 'gray'
      row.push(col)
    }
    boardData.push(row)
  }
  return boardData
}

function setSnake(boardData, snake) {
  let position = snake.positions
  for (let i = 0; i < position.length; i++) {
    boardData[position[i].x][position[i].y] = 'red'
  }
  return boardData
}

function setFood(boardData, food) {
  food.x = Math.floor(Math.random()*25)
  food.y = Math.floor(Math.random()*25)
  boardData[food.x][food.y] = 'green'
  return boardData
}

function updateBoard(boardData) {
  let board = document.getElementById('game-board')
  
  if(board.hasChildNodes()) board.removeChild(board.firstChild)
  let div = document.createElement('div')
  
  for (let i = 0; i < 25; i++) {
    let row = document.createElement('tr')
    for (let j = 0; j < 25; j++) {
      let col = document.createElement('td')
      col.style.backgroundColor = boardData[i][j]
      if (boardData[i][j] === 'red') {
        col.style.borderRadius = '50%'
      }
      row.appendChild(col)
    }
    div.appendChild(row)
  }
  board.appendChild(div)
}

function updateSnake(boardData, snake) {
  let body = snake.positions
  let head = {
    x : body[body.length-1].x,
    y : body[body.length-1].y
  }
  let tail = snake.positions[0]
  if (snake.direction === 'up') head.x--
  if (snake.direction === 'right') head.y++
  if (snake.direction === 'down') head.x++
  if (snake.direction === 'left') head.y--
  snake.positions.push(head);
  boardData[head.x][head.y] = 'red'
  boardData[tail.x][tail.y] = 'gray'
  snake.positions.shift()
  return [boardData, snake]
}

function isFoodEaten(snake, food) {
  let head = snake.positions[snake.positions.length - 1]
  if (food.x == head.x && food.y == head.y) return true
  return false
}

function snakeGrowing(snake) {
  snake.positions.unshift({
    x: snake.positions[0].x,
    y: snake.positions[0].y,
  })
  return snake
}

function isHitWall(snake) {
  let head = snake.positions[snake.positions.length -1]
  return head.x >= 25 || head.x < 0 || head.y >= 25 || head.y < 0
}

function isHitBody(snake) {
  let body = snake.positions
  let head = body[body.length - 1]
  for (let i = body.length - 2; i >= 0; i--) {
    if (head.x == body[i].x && head.y == body[i].y) {
      return true
    }
  }
  return false
}

document.onkeydown = function (event) {
  let code = event.code
  let direction = {
    ArrowRight: 'right',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowUp: 'up',
  }
  if (!isStart && direction[code] != undefined) {
    isStart = true;
    play()
  }

  let isHorizontalMove = snake.direction === 'left' || snake.direction === 'right'
  let isVerticalMove = snake.direction === 'up' || snake.direction === 'down'
  let isHorizontalCode = code === 'ArrowLeft' || code === 'ArrowRight'
  let isVerticalCode = code === 'ArrowDown' || code === 'ArrowUp'
  if(isHorizontalMove &&  isVerticalCode){
    snake.direction = direction[code]
  }else if (isVerticalMove && isHorizontalCode){
    snake.direction = direction[code]
  }
}

let scoreView = document.getElementById('scoreValue')

const start = () => {
  boardData = createBoardData(boardData)
  boardData = setSnake(boardData, snake)
  boardData = setFood(boardData, food)
  updateBoard(boardData)
}


const play = () => {
  const start = setInterval(() => {
    if (isHitWall(snake) || isHitBody(snake)) {
      document.getElementById('score').style.display = 'block'
      document.getElementById('score-result').innerHTML = score
      clearInterval(start)
    }
    if (isFoodEaten(snake, food)) {
      setFood(boardData, food)
      snake = snakeGrowing(snake)
      score += 10
      scoreView.innerHTML = `score : ${score}`
    }
    [boardData, snake] = updateSnake(boardData, snake)
    updateBoard(boardData)
  }, 100);
}

const reset = () => {
  document.getElementById('score').style.display = 'none'
  score = 0
  snake.positions = [
    {
      x: 5,
      y: 3
    },
    {
      x: 5,
      y: 4
    },
    {
      x: 5,
      y: 5
    }
  ]
  snake.direction = 'right'
  isStart = false
  boardData = []
  scoreView.innerHTML = '0'
  start()
}

start()