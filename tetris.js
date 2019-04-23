
//COLORS
RED = "red"; GREEN = "green"; PURPLE = "#eb42f4"; YELLOW = "#f4d942"; ORANGE ="#d1720c"; CYAN = "#41e2f4"; BLUE = "#0b5ed1";
//GAME Variables
const tetrisCvs = document.getElementById("tetris");
const tetrisCtx = tetrisCvs.getContext("2d");
const holdCvs = document.getElementById("hold");
const holdCtx = holdCvs.getContext("2d");
const nextCvs = document.getElementById("next");
const nextCtx = nextCvs.getContext("2d");
const ROW = 20;
const COL = COLUMN = 10;
const WIDTH = 200;
const SIZE = WIDTH/COL;
const HEIGHT= WIDTH * 2;
const VACANT = "WHITE"
const FALL_SPEED = 20;
let gameOver = false;
let canHold = true;
let gameBoard = Array.from(new Array(ROW),(r,i) => Array.from(new Array(COL), (c,j) => c = VACANT));
let holdMatrix = Array.from(new Array(4), (r, i) => Array.from(new Array(4), (c,j) => c = VACANT));
let nextMatrix = Array.from(new Array(12), (r, i) => Array.from(new Array(4), (c,j) => c = VACANT));
let holdPiece;
let nextPieces = [];

const TETROMINOES = [
[Z, RED],
[S, GREEN],
[T, PURPLE],
[O, YELLOW],
[L, ORANGE],
[I, CYAN],
[J, BLUE]
];

//AI Variables

let ai = true;


//Generate intial next pieces.
while (nextPieces.length < 3) {
    let r = Math.floor(Math.random() * TETROMINOES.length);
    let rPiece = new Tetromino(TETROMINOES[r][0], TETROMINOES[r][1]);
    nextPieces.push(rPiece);
}

drawGrid(gameBoard, tetrisCtx);
drawGrid(holdMatrix, holdCtx);
drawGrid(nextMatrix, nextCtx);


var piece = randomPiece();

if (ai == false) {
    var game = setInterval(()=> piece.moveDown(), FALL_SPEED);
    draw();
} else {
    var aiMove = setInterval(()=> piece.moveDown(), FALL_SPEED);
}

var weights = {
    a : -0.810066,
    b : -0.35663,
    c : 0.760666,
    d : -0.184483
}

function evaluation_function(features) {
    return features.height*weights.a + features.holes*weights.b + features.cleared*weights.c + features.bumpiness*weights.d;
}

function decision_function() {
    var maxScore = Number.NEGATIVE_INFINITY;
    var move = {
        rotationNum: 0,
        translationNum: 0,
    }
       for (var translation = 0; translation < 7; translation ++) {
        for (var rotation = 0; rotation < 4; rotation ++) {
            let score = action(rotation,translation);
            if (score > maxScore) {
                maxScore = score;
                move.rotationNum = rotation;
                move.translationNum = translation;
            }
        }
    }
    applyMove(move);
}

function applyMove(move) {
    piece.tetrominoIdx = move.rotationNum;
    piece.currTetromino = piece.tetromino[move.rotationNum];
    piece.x = move.translationNum;
}

function action(rotation, translation) {
    var pieceClone = new Tetromino(piece.tetromino, piece.color);
   // var pieceClone = Object.assign(Object.create(piece), piece);
    if (pieceClone.color == YELLOW) {
        rotation = 0;
    }
    //SpieceClone.tetrominoIdx = rotation;
    pieceClone.currTetromino = pieceClone.tetromino[rotation];
    pieceClone.x = translation;
    let board_copy = copyMatrix(gameBoard);
    pieceClone.calcDropPosition();
    pieceClone.y = pieceClone.gY;
    pieceClone.lock(board_copy);

    return evaluation_function(pieceClone.features);

}

if (ai == true) {
    decision_function();
}

function draw() {
        drawGrid(gameBoard,tetrisCtx);
        if (!gameOver) {
            piece.showGhost();
            requestAnimationFrame(draw);
        }
}

function drawSquare(x,y,color, ctx){
    ctx.fillStyle = color;
    ctx.fillRect(x*SIZE,y*SIZE,SIZE,SIZE);
    ctx.strokeStyle = "BLACK";
    ctx.lineWidth = 1;
    ctx.strokeRect(x*SIZE,y*SIZE,SIZE,SIZE);

}

function drawGhost(x,y,color,ctx) {
    ctx.fillStyle = 255;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    if (color == VACANT)
     ctx.strokeStyle = "BLACK";
 ctx.strokeRect(x*SIZE,y*SIZE,SIZE,SIZE);
}

function drawGrid(matrix,ctx) {
    matrix.forEach((row, i) => row.forEach((col, j) => {
     drawSquare(j, i, matrix[i][j], ctx);
 }));
}

function randomPiece() {
    if (!gameOver) {
        let r = Math.floor(Math.random() * TETROMINOES.length);
    let rPiece = new Tetromino(TETROMINOES[r][0], TETROMINOES[r][1]);
    nextPieces.push(rPiece);
    drawGrid(nextMatrix, nextCtx);
    for (var n = 1; n < nextPieces.length; n++) {
        nextPieces[n].currTetromino.forEach((row,i) => row.forEach((col, j) => {
            if (nextPieces[n].currTetromino[i][j]) {
               drawSquare(j, i + (4 * n) - 3, nextPieces[n].color, nextCtx);
           }
       }))

    }

    }

    return nextPieces.shift();

}

function hold() {
    drawGrid(holdMatrix, holdCtx)
    piece.tetrominoIdx = 0;
    piece.currTetromino = piece.tetromino[0];
    if (holdPiece) {
        temp = holdPiece;
        holdPiece = piece;
        piece = temp;
    } else {
        holdPiece = piece;
        piece = randomPiece();
    }
    holdPiece.currTetromino.forEach((row,i) => row.forEach((col, j) => {
        if (holdPiece.currTetromino[i][j]) {
          drawSquare(j, 1 + i, holdPiece.color, holdCtx);
      }
  }));

    canHold = false;

}
document.addEventListener("keydown", keyPressed);
document.addEventListener("keyup", keyReleased);

let spacePressed = false;

function keyReleased() {
    if (event.keyCode === 32) {
        spacePressed = false;
    }
}

function keyPressed() {
    if (ai == false && !gameOver) {
        if (event.keyCode === 37) {
            piece.moveLeft();
        } else if (event.keyCode === 39) {
            piece.moveRight();
        } else if (event.keyCode === 40) {
            piece.moveDown();
        } else if (event.keyCode === 38) {
            piece.rotate();
        } else if (event.keyCode === 32) {
            if (spacePressed == false) {
                spacePressed = true;
                piece.y = piece.gY;
                piece.lock(gameBoard);
                piece = randomPiece();
            }
        } else if(event.keyCode == 67) {
            if (canHold)
                hold();
        }
    }
}

function copyMatrix(matrix) {
    let newArray = [];
    for (var i = 0; i < matrix.length; i++) {
        newArray[i] = matrix[i].slice();
    }

    return newArray;
}


function clearBoard() {
    clearInterval(game);
    clearInterval(aiMove);

}



