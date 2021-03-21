//COLORS
RED = 'red'
GREEN = 'green'
PURPLE = '#eb42f4'
YELLOW = '#f4d942'
ORANGE = '#d1720c'
CYAN = '#41e2f4'
BLUE = '#0b5ed1'
//GAME Variables
const tetrisCvs = document.getElementById('tetris')
const tetrisCtx = tetrisCvs.getContext('2d')
const holdCvs = document.getElementById('hold')
const holdCtx = holdCvs.getContext('2d')
const nextCvs = document.getElementById('next')
const nextCtx = nextCvs.getContext('2d')
const ROW = 20
const COL = (COLUMN = 10)
const WIDTH = 200
const SIZE = WIDTH / COL
const HEIGHT = WIDTH * 2
const TETROMINOES = [
  [Z, RED],
  [S, GREEN],
  [T, PURPLE],
  [O, YELLOW],
  [L, ORANGE],
  [I, CYAN],
  [J, BLUE],
]

//AI Variables
let ai = false
let ga = (geneticAlgorithm = true)
let gameplay
let gameOver

function load() {
  if (ga == true) {
    ai = true
    setup()
  } else {
    initialize()
    gameOver = false
    run()
  }
}

function initialize() {
  gameOver = true
  level = 1
  canHold = true
  gameBoard = Array.from(new Array(ROW), (r, i) =>
    Array.from(new Array(COL), (c, j) => (c = 'WHITE'))
  )
  holdMatrix = Array.from(new Array(4), (r, i) =>
    Array.from(new Array(4), (c, j) => (c = 'WHITE'))
  )
  nextMatrix = Array.from(new Array(4), (r, i) =>
    Array.from(new Array(4), (c, j) => (c = 'WHITE'))
  )
  holdPiece = null
  nextPiece = []
  bag = []
  lines = 0
  moves = 0

  //score used to calculate the fitness of each game.
  game_score = 0

  drawGrid(gameBoard, tetrisCtx)
  drawGrid(holdMatrix, holdCtx)
  drawGrid(nextMatrix, nextCtx)

  nextPiece[0] = randomPiece()
}

function run() {
  piece = getPiece()

  if (ai == false) {
    speed = 1000
    draw()
  } else {
    //if it not learning use fully evolved weights.
    if (ga == false) {
      weights = {
        a: 0.012986105043601821,
        b: -0.33099889329580323,
        c: 0.5446471620000896,
        d: -0.25120763453283845,
        e: -0.13253702980064244,
      }
    }
    speed = 25
    decision_function(piece)
  }
  startGame()
}

// AI Functions
//chooses the piece with the best score.
function decision_function(p) {
  let illegalMoves = 0
  let maxScore = Number.NEGATIVE_INFINITY
  let move = {
    rotation: 0,
    translation: 0,
  }
  //tests all possible moves to find the best move.
  for (var translation = -1; translation < 9; translation++) {
    for (var rotation = 0; rotation < 4; rotation++) {
      //simulates the action and calculates the score the new board.
      let score = action(p, rotation, translation)
      if (score === Number.NEGATIVE_INFINITY) {
        illegalMoves++
      } else if (score > maxScore) {
        maxScore = score
        move.rotation = rotation
        move.translation = translation
      }
    }
  }
  //Mo more possible moves.
  if (illegalMoves == 40) {
    endGame()
  }
  //check if score of current piece less than score of next piece
  makeMove(move)
}

function action(p, rotation, translation) {
  //create a clone of the current piece.
  var pieceClone = new Tetromino(p.tetromino, p.color)
  if (pieceClone.color == YELLOW) {
    rotation = 0
  }
  let xMove = translation - pieceClone.x
  //check if piece is playable. Then simulate the piece being placed on the board.
  if (!pieceClone.collision(xMove, 0, pieceClone.tetromino[rotation])) {
    pieceClone.currTetromino = pieceClone.tetromino[rotation]
    pieceClone.x = translation
    let board_copy = copyMatrix(gameBoard)
    pieceClone.y = pieceClone.calcDropPosition()
    pieceClone.lock(board_copy, true)
    return pieceClone.score
  }
  return Number.NEGATIVE_INFINITY
}

//set the values of the current piece to the best move.
function makeMove(move) {
  piece.tetrominoIdx = move.rotation
  piece.currTetromino = piece.tetromino[move.rotation]
  piece.x = move.translation
}

//Game Functions
function draw() {
  displayInfo()
  if (ai == false) {
    updateLevel()
  }
  drawGrid(gameBoard, tetrisCtx)
  if (!gameOver) {
    piece.showGhost()
    requestAnimationFrame(draw)
  }
}

function updateLevel() {
  if (lines >= level * 5) {
    lines = 0
    level++
    updateSpeed()
  }
}

function updateSpeed() {
  speed = 1000 * Math.pow(0.8 - (level - 1) * 0.007, level - 1)
  startGame()
}

function drawSquare(x, y, color, ctx) {
  ctx.fillStyle = color
  ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE)
  ctx.strokeStyle = 'BLACK'
  ctx.lineWidth = 1
  ctx.strokeRect(x * SIZE, y * SIZE, SIZE, SIZE)
}

function drawGhost(x, y, color, ctx) {
  ctx.fillStyle = 255
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  if (color == 'WHITE') ctx.strokeStyle = 'BLACK'
  ctx.strokeRect(x * SIZE, y * SIZE, SIZE, SIZE)
}

function drawGrid(matrix, ctx) {
  matrix.forEach((row, i) =>
    row.forEach((col, j) => {
      drawSquare(j, i, matrix[i][j], ctx)
    })
  )
}

//gets the next piece.
function getPiece() {
  if (!gameOver) {
    nextPiece.push(randomPiece())
    //Draw next piece
    drawGrid(nextMatrix, nextCtx)
    nextPiece[1].currTetromino.forEach((row, i) =>
      row.forEach((col, j) => {
        if (nextPiece[1].currTetromino[i][j]) {
          drawSquare(j, i + 1, nextPiece[1].color, nextCtx)
        }
      })
    )
  }
  return nextPiece.shift()
}

//Tetris bag random generator
function randomPiece() {
  if (bag.length === 0) {
    if (ga == true) {
      //when training incrase the likelihood of 'S' and 'Z' pieces. This decreases training time.
      bag = [0, 0, 1, 1, 2, 3, 4, 5, 6]
    } else {
      bag = [0, 1, 2, 3, 4, 5, 6]
    }
    bag = shuffle(bag)
  }
  let r = bag.pop()
  let piece = new Tetromino(TETROMINOES[r][0], TETROMINOES[r][1])
  return piece
}

//Using the hold queue.
function hold() {
  drawGrid(holdMatrix, holdCtx)
  piece.tetrominoIdx = 0
  piece.currTetromino = piece.tetromino[0]
  if (holdPiece) {
    ;[piece, holdPiece] = [holdPiece, piece]
  } else {
    holdPiece = piece
    piece = randomPiece()
  }
  holdPiece.currTetromino.forEach((row, i) =>
    row.forEach((col, j) => {
      if (holdPiece.currTetromino[i][j]) {
        drawSquare(j, 1 + i, holdPiece.color, holdCtx)
      }
    })
  )
  canHold = false
}

function endGame() {
  clearInterval(gameplay)
  gameOver = true
}

function startGame() {
  if (gameplay) {
    clearInterval(gameplay)
  }
  gameplay = setInterval(() => {
    displayInfo()
    piece.moveDown()
  }, speed)
}
document.addEventListener('keydown', keyPressed)
document.addEventListener('keyup', keyReleased)

let spacePressed = false
let pPressed = false
let ePressed = false

function keyReleased() {
  if (event.keyCode === 32) {
    spacePressed = false
  }
  if (event.keyCode === 69) {
    ePressed = false
    if (pPressed == true) {
      pPressed = false
    }
  }
}

function keyPressed() {
  //P Pressed
  //Turn Off AI
  if (event.keyCode == 80) {
    if (pPressed == false) {
      pPressed = true
      ga = false
      ai = false
      showText('how_to_play')
      load()
    }
  }
  //Toggle Between Evolved and Training AI.
  if (event.keyCode === 69) {
    if (ePressed == false) {
      ePressed = true
      toggleGA()
    }
  }
  if (ai == false && !gameOver) {
    if (event.keyCode === 37) {
      piece.moveLeft()
    } else if (event.keyCode === 39) {
      piece.moveRight()
    } else if (event.keyCode === 40) {
      piece.moveDown()
    } else if (event.keyCode === 38) {
      piece.rotate()
    } else if (event.keyCode === 32) {
      if (spacePressed == false) {
        spacePressed = true
        piece.y = piece.gY
        piece.lock(gameBoard)
        piece = getPiece()
      }
    } else if (event.keyCode == 67) {
      if (canHold) hold()
    }
  } else {
    //change speed
    if (event.keyCode === 83) {
      speedArray = [1, 25, 1000]
      var speedIdx = speedArray.indexOf(speed)
      speed = speedArray[(speedIdx + 1) % 3]
      startGame()
    }
  }
}

function toggleGA() {
  if (ga == true) {
    ga = false
    showText('evolved_ai')
    load()
  } else {
    showText('the_genetic_algorithm')
    ga = true
    initialize()
    load()
  }
}

function showText(text) {
  switch (text) {
    case 'the_genetic_algorithm':
      document.getElementById('genetic_algorithm').style.display = 'block'
      document.getElementById('how_to_play').style.display = 'none'
      document.getElementById('eKeyMsg').innerHTML = '[E] Evolved AI'
      document.getElementById('evolved_weights').style.display = 'none'
      document.getElementById('level_div').style.display = 'none'
      break
    case 'evolved_ai':
      document.getElementById('genetic_algorithm').style.display = 'none'
      document.getElementById('how_to_play').style.display = 'none'
      document.getElementById('eKeyMsg').innerHTML = '[E] Training AI'
      document.getElementById('evolved_weights').style.display = 'block'
      document.getElementById('level_div').style.display = 'none'
      break
    case 'how_to_play':
      document.getElementById('genetic_algorithm').style.display = 'none'
      document.getElementById('how_to_play').style.display = 'block'
      document.getElementById('eKeyMsg').innerHTML = '[E] Training AI'
      document.getElementById('level_div').style.display = 'block'
      document.getElementById('evolved_weights').style.display = 'none'
      break
  }
}

function displayInfo() {
  document.getElementById('level').innerHTML = level
  document.getElementById('lines').innerHTML = lines
  document.getElementById('game_score').innerHTML = game_score
  document.getElementById('generation').innerHTML = generation
  document.getElementById('max_fit').innerHTML = maxFitness
  document.getElementById('max_lines').innerHTML = maxLines
  document.getElementById('game_number').innerHTML = game_num
  document.getElementById('moves').innerHTML = moves
  document.getElementById('max_games').innerHTML = POPSIZE
  document.getElementById('height').innerHTML = best_weights.a
  document.getElementById('holes').innerHTML = best_weights.b
  document.getElementById('cleared').innerHTML = best_weights.c
  document.getElementById('bumpiness').innerHTML = best_weights.d
  document.getElementById('vacant').innerHTML = best_weights.e
  document.getElementById('c.height').innerHTML = weights.a
  document.getElementById('c.holes').innerHTML = weights.b
  document.getElementById('c.cleared').innerHTML = weights.c
  document.getElementById('c.bumpiness').innerHTML = weights.d
  document.getElementById('c.vacant').innerHTML = weights.e
}

//HELPER Functions
function copyMatrix(matrix) {
  let newArray = []
  for (var i = 0; i < matrix.length; i++) {
    newArray[i] = matrix[i].slice()
  }
  return newArray
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
