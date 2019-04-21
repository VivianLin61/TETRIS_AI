
//COLORS
RED = "red"; GREEN = "green"; PURPLE = "#eb42f4"; YELLOW = "#f4d942"; ORANGE ="#d1720c"; CYAN = "#41e2f4"; BLUE = "#0b5ed1";
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
const FALL_SPEED = 1000;
let gameOver = false;
let canHold = true;
let board = Array.from(new Array(ROW),(r,i) => Array.from(new Array(COL), (c,j) => c = VACANT));
let holdMatrix = Array.from(new Array(4), (r, i) => Array.from(new Array(4), (c,j) => c = VACANT));
let nextMatrix = Array.from(new Array(12), (r, i) => Array.from(new Array(4), (c,j) => c = VACANT));
let holdPiece;
let nextPieces = [];
let ai = false;

const TETROMINOES = [
[Z, RED],
[S, GREEN],
[T, PURPLE],
[O, YELLOW],
[L, ORANGE],
[I, CYAN],
[J, BLUE]
];

while (nextPieces.length < 3) {
    let r = Math.floor(Math.random() * TETROMINOES.length);
    let rPiece = new Tetromino(TETROMINOES[r][0], TETROMINOES[r][1]);
    nextPieces.push(rPiece);
}
drawGrid(board, tetrisCtx);
drawGrid(holdMatrix, holdCtx);
drawGrid(nextMatrix, nextCtx);
var piece = randomPiece();
setInterval( () => piece.moveDown(), FALL_SPEED);
draw();

function draw() {
    if (ai == false) {
        drawGrid(board,tetrisCtx);
        piece.show();
        piece.showGhost();
        if (!gameOver) {
            requestAnimationFrame(draw);
        }
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

function keyPressed() {
    if (ai == false) {
        if (event.keyCode === 37) {
            piece.moveLeft();
        } else if (event.keyCode === 39) {
            piece.moveRight();
        } else if (event.keyCode === 40) {
            piece.moveDown();
        } else if (event.keyCode === 38) {
            piece.rotate();
        } else if (event.keyCode === 32) {
            piece.y = piece.gY;
            piece.lock();
            piece = randomPiece();
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



