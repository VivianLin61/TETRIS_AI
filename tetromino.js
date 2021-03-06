class Tetromino {
  constructor(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;

    this.features = {
      height : 0, //minimize
      holes : 0, //minimize
      cleared : 0, //maximize
      bumpiness : 0, //minimize
      vacant : 0 //minimize
    }

    //score used to calculte the best move the make.
    this.score = 0;

    this.tetrominoIdx = 0;
    this.currTetromino = this.tetromino[this.tetrominoIdx];
    this.x = 3;
    this.y = -1;
    //position of ghost piece.
    this.gY;
  }

  fill(color,ghost) {
    this.currTetromino.forEach((row,i) => row.forEach((col, j) => {
      if (col) {
        if (ghost){
          drawGhost(this.x + j, this.gY + i, color, tetrisCtx);
        }
        drawSquare(this.x + j, this.y + i, color, tetrisCtx);
      }
    }))
  }

  show(ghost) {
    this.fill(this.color,ghost);
  }

  hide() {
    this.fill("WHITE");
  }
  showGhost() {
    this.calcDropPosition();
    this.show(true);
  }

  calcDropPosition() {
    this.gY = this.y;
    while (!this.collision(0, 1, this.currTetromino, true)) {
      this.gY++;
    }
    return this.gY;
  }

  moveDown() {
    if (!this.collision(0, 1, this.currTetromino)) {
      this.hide();
      this.y ++;
      this.show();
    } else {
      this.lock(gameBoard);
      if (!gameOver) {
        moves++;
        piece = getPiece();
        if (ai == true )
          decision_function(piece);
      }
    }
  }

  moveLeft() {
    if(!this.collision(-1,0, this.currTetromino)) {
      this.hide();
      this.x --;
      this.show();
    }
  }
  moveRight() {
    if (!this.collision(1,0,this.currTetromino)) {
     this.hide();
     this.x ++;
     this.show();
   }
 }

 rotate() {
  let nxtIdx = (this.tetrominoIdx + 1) % this.tetromino.length;
  let nextTetromino = this.tetromino[nxtIdx];
  let kick = 0;

  //Apply kick
  if (this.collision(0,0,nextTetromino)) {
    if (this.x > COL/2) {
      //rotate the I piece.
      if (this.color == CYAN && nxtIdx == 0) {
        kick -= 1;
      }
      kick -= 1;
    } else {
      //rotate the I piece.
      if (this.color == CYAN && nxtIdx == 0) {
        kick += 1 ;
      }
      kick += 1;
    }
  }
  //rotate piece
  if(!this.collision(kick,0,nextTetromino)) {
   this.hide();
   this.x += kick;
   this.tetrominoIdx = nxtIdx;
   this.currTetromino = nextTetromino;
   this.show();
 }
}

clearLine(row) {
  if ( row != 0) {
    for (let y = row; y >= 1; y--) {
      for (let c = 0; c < COL; c++) {
        gameBoard[y][c] = gameBoard[y-1][c];
      }
    }
  }
  gameBoard[0] = Array.from(new Array(COLUMN), (c,j) => c = "WHITE");
}

collision(x,y,piece,ghost) {
  let currentX = this.x;
  let currentY = this.y;
  if (ghost) {
    currentY = this.gY;
  }
  for (let r = 0; r < this.currTetromino.length; r++) {
    for (let c = 0; c < this.currTetromino.length; c++) {
      if (!piece[r][c])
        continue;

      let nextX = currentX + c + x;
      let nextY = currentY + r + y;

      if (nextX < 0 || nextX >= COL || nextY >= ROW)
        return true;

      if(nextY < 0)
        continue;

      if(gameBoard[nextY][nextX] != "WHITE")
        return true;
    }
  }
  return false;
}

checkLines() {
  let linesCleared = 0;
  for (var r = 0; r < ROW; r++) {
    let filled = 0;
    for (var c = 0; c < COL; c ++) {
      if (gameBoard[r][c] != "WHITE") {
        filled ++;
      }
    }
    if (filled == 10) {
     this.clearLine(r);
     r--;
     lines ++;
     linesCleared ++;
   }
 }
//updates the game_score
 switch(linesCleared) {
  case 1:
    game_score += 1;
    break;
  case 2:
    game_score += 3;
     break;
  case 3:
    game_score += 6;
     break;
  case 4:
    game_score += 12;
     break;
 }

 drawGrid(gameBoard, tetrisCtx);

}
lock(board, clone) {
  for (let r = 0; r < this.currTetromino.length; r++) {
    for (let c = 0; c < this.currTetromino.length; c++) {
      if (this.currTetromino[r][c]) {
        if (this.y + r < 0) {
          if (clone) {
            this.score = Number.NEGATIVE_INFINITY;
          } else {
            endGame();
          }
          return;
        }
        board[this.y + r][this.x + c] = this.color;
      }
    }
  }

  if (clone) {
    this.calcFeatures(board);
    this.evaluation_function(this.features);
  } else {
    this.checkLines();
    canHold = true;
  }
}

//Feature functions
calcFeatures(board) {
  //the height where right above it the whole row is empty.
  let height = 0;
  let rowsArr = board.reduce((a, row) => a.concat(row.filter(col => col != "WHITE").length), []);
  for (var i = rowsArr.length-1; i >= 0;  i --) {
    if (rowsArr[i] == 0) {
      height = ROW - i - 1;
      break;
    }
  }
  this.features.height = height;

 //the sum of the absolute differeces between the heights of adjacent columns.
 let colHeights = [0,0,0,0,0,0,0,0,0,0];
 for (let c = 0; c < board[0].length; c ++) {
  for (let r = 0; r < board.length; r++) {
    if (board[r][c] != "WHITE") {
      colHeights[c] = ROW - r;
      break;
      }
    }
  }
  let bumpiness = 0;
  for (let j = 0; j < colHeights.length - 1; j++) {
    bumpiness += Math.abs(colHeights[j] - colHeights[j+1]);
  }
  this.features.bumpiness = bumpiness;

  //the number of empty sqaures with a filled sqaure above it.
  let holes = 0;
  for (let r = ROW-1; r > 0; r --) {
    board[r].forEach((col, c) => {
      if (col == "WHITE" && board[r - 1][c] != "WHITE") {
        holes ++;
      }
    })
  }
  this.features.holes = holes * 5;

  //Number of lines cleared
  let linesCleared = 0;
  for (var r = 0; r < ROW; r++) {
    let filled = 0;
      for (var c = 0; c < COL; c ++) {
        if (board[r][c] != "WHITE") {
          filled ++;
        }
      }
      if (filled == 10) {
        linesCleared ++;
      }
    }
     switch(linesCleared) {
  case 1:
    linesCleared = 1;
    break;
  case 2:
    linesCleared = 3;
     break;
  case 3:
    linesCleared = 6;
     break;
  case 4:
    linesCleared = 12;
     break;
 }
  this.features.cleared = linesCleared;

  //calculate number of holes below placed piece.
  var columns = [];
  var rows = [];
  this.currTetromino.forEach((row,i) => row.forEach((col, j) => {
      if (col) {
        if (columns.indexOf(j + this.x) == -1) {
          columns.push(j + this.x);
        rows.push(i + this.y);
        }
      }
    }))
let vacant = 0;
    for (var j = 0; j < columns.length; j++) {
      let c = columns[j];
      for (var r = rows[j]; r < ROW; r++) {
        if (board[r][c] == "WHITE") {
          vacant ++;
        }
      }
    }

  this.features.vacant = vacant;
}
  //combination of the features and their respective weights.
  evaluation_function(features) {
    this.score = features.height*weights.a + features.holes*weights.b + features.cleared*weights.c + features.bumpiness*weights.d + features.vacant*weights.e;
  }
}


