class Tetromino {
  constructor(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;

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
    this.gY = this.y;
    this.hide();
    while (!this.collision(0, 1, this.currTetromino, true)) {
      this.gY++;
    }
    this.show(true);
  }

  moveDown() {
    if (!this.collision(0, 1, this.currTetromino)) {
      this.hide();
      this.y ++;
      this.show();
    } else {
      this.lock();
      piece = randomPiece();}
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
        if (board[r][c] != VACANT) {
          filled ++;
        }
      }
      if (filled == 10) {
        this.clearLine(r);
        linesCleared ++;
        features.cleared = linesCleared;
      }
    }

    drawGrid(board, tetrisCtx);

  }

  clearLine(row) {
    for (let y = row; y > 1; y--) {
      for (let c = 0; c < COL; c++) {
        board[y][c] = board[y-1][c];
      }
    }

    board[0] = Array.from(new Array(COLUMN), (c,j) => c = VACANT);
  }

  collision(x,y,piece,ghost) {
    let currentX = this.x;
    let currentY = this.y;
    if (ghost) {
      currentY = this.gY;
    }
    for (let r = 0; r < piece.length; r++) {
      for (let c = 0; c < piece.length; c++) {
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

            if(board[nextY][nextX] != VACANT)
              return true;
          }
        }
        return false;
      }

      lock() {
        for (let r = 0; r < this.currTetromino.length; r++) {
          for (let c = 0; c < this.currTetromino.length; c++) {
            if (this.currTetromino[r][c]) {
              if (this.y + r < 0) {
                alert("GAME OVER");
                gameOver = true;
                break
              }
              board[this.y +r][this.x + c] = this.color;
              this.checkLines();
            }
          }
        }
        if (ai == false) {
          calcFeatures();
        }
        canHold = true;
      }

    }
