
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

let ai = false;
let ga = true;
let speed = 0.1;
let gameplay;
let moves;
let gameOver = false;
let weights = {
    a : -0.510066,
    b : -0.35663,
    c : 0.760666,
    d : -0.184483
}

function load() {
    if (ga == true){
        ai = true;
        setup();
    } else {
         initialize();
    }
}

function initialize() {
    gameOver = true;
    canHold = true;
    gameBoard = Array.from(new Array(ROW),(r,i) => Array.from(new Array(COL), (c,j) => c = "WHITE"));
    holdMatrix = Array.from(new Array(4), (r, i) => Array.from(new Array(4), (c,j) => c = "WHITE"));
    nextMatrix = Array.from(new Array(4), (r, i) => Array.from(new Array(4), (c,j) => c = "WHITE"));
    holdPiece = null;
    nextPiece = [];
    bag = [];
    lines = 0;
    moves = 0;

    nextPiece[0] = randomPiece();
    piece = randomPiece();

    drawGrid(gameBoard, tetrisCtx);
    drawGrid(holdMatrix, holdCtx);
    drawGrid(nextMatrix, nextCtx);

}

function run() {
    if (ai == false) {
        speed = 200;
        draw();

    } else {
        speed = 0.5;
        decision_function();
    }
    if (gameplay) {
        clearInterval(gameplay);
    }
    gameplay = setInterval(()=> {
        displayInfo();
        piece.moveDown()
    }, speed);
}

// AI Functions
function decision_function() {
    //chooses the piece with the best score.
    let illegalMoves = 0;
    let maxScore = Number.NEGATIVE_INFINITY;
    let move = {
        rotationNum: 0,
        translationNum: 0,
    }
    for (var translation = -1; translation < 9; translation ++) {
        for (var rotation = 0; rotation < 4; rotation ++) {
            let score = action(rotation,translation);
            if(score === Number.NEGATIVE_INFINITY) {
                illegalMoves ++;
            }
            else if (score > maxScore) {
                maxScore = score;
                move.rotationNum = rotation;
                move.translationNum = translation;
            }
        }
    }
    // no more possible moves.
    if (illegalMoves == 40) {
        endGame();
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
    if (pieceClone.color == YELLOW) {
        rotation = 0;
    }
    let xMove = translation - pieceClone.x;
    //check if piece is playable.
    if (!pieceClone.collision(xMove, 0, pieceClone.tetromino[rotation])) {
        pieceClone.currTetromino = pieceClone.tetromino[rotation];
        pieceClone.x = translation;
        let board_copy = copyMatrix(gameBoard);
        pieceClone.y = pieceClone.calcDropPosition();
        pieceClone.lock(board_copy, true);
        return pieceClone.score;
    }
    return Number.NEGATIVE_INFINITY;
}

//Game Functions
function draw() {
    if (ga == true) {
        population.games[num_of_games].update();
    }
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
    if (color == "WHITE")
       ctx.strokeStyle = "BLACK";
   ctx.strokeRect(x*SIZE,y*SIZE,SIZE,SIZE);
}

function drawGrid(matrix,ctx) {
    matrix.forEach((row, i) => row.forEach((col, j) => {
       drawSquare(j, i, matrix[i][j], ctx);
   }));
}

function getPiece() {
    if (!gameOver) {
        nextPiece.push(randomPiece());
        drawGrid(nextMatrix, nextCtx);
        nextPiece[1].currTetromino.forEach((row,i) => row.forEach((col, j) => {
            if (nextPiece[1].currTetromino[i][j]) {
             drawSquare(j, i + (4 ) - 3, nextPiece[1].color, nextCtx);
         }
     }))
    }
    return nextPiece.shift();
}
//tetris bag random generator
function randomPiece() {
    if (bag.length === 0) {
        bag = [0, 1, 2, 3, 4, 5, 6];
        bag = shuffle(bag);
    }
    let r = bag.pop();
    let piece = new Tetromino(TETROMINOES[r][0], TETROMINOES[r][1]);
    return piece;
}

function hold() {
    drawGrid(holdMatrix, holdCtx)
    piece.tetrominoIdx = 0;
    piece.currTetromino = piece.tetromino[0];
    if (holdPiece) {
        [piece, holdPiece] = [holdPiece, piece]
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

function endGame() {
    clearInterval(gameplay);
    gameOver = true;
    console.log(lines);
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
    if (event.keyCode == 65) {
        toggleAI();
    }
    if (event.keyCode == 83) {
        initialize();
        gameOver = false;
        run();
    }
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
                piece = getPiece();
            }
        } else if(event.keyCode == 67) {
            if (canHold)
                hold();
        }
    }
}

function toggleAI() {
    if (ai == true) {
        ai = false;
    } else {
        ai = true;
    }
    run();
}

function displayInfo() {
    document.getElementById("lines").innerHTML = lines;
    document.getElementById("generation").innerHTML = generation;
    document.getElementById("max_fit").innerHTML = maxFitness
    document.getElementById("game_number").innerHTML = num_of_games;
    document.getElementById("moves").innerHTML = moves;
    //document.getElementById("maxfit").innerHTML = maxFit;
}

//HELPER Functions
function copyMatrix(matrix) {
    let newArray = [];
    for (var i = 0; i < matrix.length; i++) {
        newArray[i] = matrix[i].slice();
    }
    return newArray;
}

function sigmoid(t) {
    return 1/(1+Math.pow(Math.E, -t));
}

function shuffle(a) {
    for (let i = a.length -1 ; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

