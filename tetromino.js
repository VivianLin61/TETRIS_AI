class Tetromino {
  constructor(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;


    this.features = {
      height : 0, //minimize
      holes : 0, //minimize
      cleared : 0, //maximize
      bumpiness : 0, //minimize
}


    this.tetrominoIdx = 0;
    this.currTetromino = this.tetromino[this.tetrominoIdx];

    this.x = 3;
    this.y = -1;
    this.gY = this.y;
  }

  fill(color,ghost) {
    this.currTetromino.forEach((row,i) => row.forEach((col, j) => {
      if (col) {
        if (ghost)
          drawGhost(this.x + j, this.gY + i, color, tetrisCtx);
        drawSquare(this.x + j, this.y + i, color, tetrisCtx);
      }
    }))
  }

  show(ghost) {
    this.fill(this.color,ghost);
  }

  hide() {
    this.fill(VACANT);
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
        piece = randomPiece();
        if (ai == true )
          decision_function();
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

    if (this.collision(0,0,nextTetromino)) {
      if (this.x > COL/2) {
        if (this.color == CYAN && nxtIdx == 0) {
          kick -= 1;
        }
        kick -= 1;
      } else {
        if (this.color == CYAN && nxtIdx == 0) {
          kick += 1 ;
        }
        kick += 1;
      }
    }
    if(!this.collision(kick,0,nextTetromino)) {
     this.hide();
     this.x += kick;
     this.tetrominoIdx = nxtIdx;
     this.currTetromino = nextTetromino;
     this.show();

   }

 }

 checkLines() {
    let linesCleared = 0;
    for (var r = ROW -1; r > 0; r --) {
      let filled = 0;
      for (var c = 0; c < COL; c ++) {
        if (gameBoard[r][c] != VACANT) {
          filled ++;
        }
      }
      if (filled == 10) {
        this.clearLine(r);
        if (ai == true) {
          linesCleared ++;
          this.features.cleared = linesCleared;
        }
      }
    }

    drawGrid(gameBoard, tetrisCtx);

  }

  clearLine(row) {
    for (let y = row; y > 1; y--) {
      for (let c = 0; c < COL; c++) {
        gameBoard[y][c] = gameBoard[y-1][c];
      }
    }

    gameBoard[0] = Array.from(new Array(COLUMN), (c,j) => c = VACANT);
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

            //check left or right of grid.
            if (nextX < 0 || nextX >= COL || nextY >= ROW)
              return true;
            //check if below grid
            if(nextY < 0)
              continue;

            if(gameBoard[nextY][nextX] != VACANT)
              return true;
          }
        }
        return false;
      }

      lock(board) {
        for (let r = 0; r < this.currTetromino.length; r++) {
          for (let c = 0; c < this.currTetromino.length; c++) {
            if (this.currTetromino[r][c]) {
              if (this.y + r < 0) {
                gameOver = true;
                clearBoard();
                break;
              }
              board[this.y + r][this.x + c] = this.color;
              this.checkLines();
            }
          }
        }
        if (ai == true) {
          this.calcFeatures(board);
        }
        canHold = true;
      }

//Feature functions
calcFeatures(board) {
  //landing height
  let height = 0;
    let rowsArr = board.reduce((a, row) => a.concat(row.filter(col => col != VACANT).length), []);
     for (var i = rowsArr.length; i >= 0;  i --) {
        if (rowsArr[i] == 0) {
            height = ROW - i - 1;
            break;
        }
     }
     this.features.height = height;

     //bumpiness
     //the sum of the absolute differeces between the heights of adjacent columns.
    let temp = copyMatrix(board);
    let transpose = temp[0].map((col, i) => temp.map(row => row[i]));
    let colHeights = [];
    transpose.forEach((elm, i) => {
        for (let j = ROW - 1; j >= 0; j--) {
            if (transpose[i][j] == "WHITE") {
                colHeights.push(ROW - j - 1);
                break;
            }
        }
    })

    let sum = 0;
    for (let i = 0; i < colHeights.length - 1; i++) {
        sum += Math.abs(colHeights[i] - colHeights[i+1]);
    }

    this.features.bumpiness = sum;

//the number of vacant sqaures with a filled sqaure above it.
    let holes = 0;
    for (let r = ROW-1; r > 0; r --) {
        board[r].forEach((col, c) => {
            if (col == VACANT && board[r - 1][c] != VACANT) {
                holes ++;
            }
        })
    }
    this.features.holes = holes;
}
}

