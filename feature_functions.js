var features = {
    height : 0, //minimize
    holes : 0, //minimize
    cleared : 0, //maximize
    bumpiness : 0, //minimize
}

function calcFeatures() {
    landingHeight();
    bumpiness();
    holes();

}
function landingHeight() {
    let height = 0;
     let rowsArr = board.reduce((a, row) => a.concat(row.filter(col => col != VACANT).length), []);
     for (var i = rowsArr.length; i >= 0;  i --) {
        if (rowsArr[i] == 0) {
            height = ROW - i - 1;
            break;
        }
     }
     features.height = height;
}


function bumpiness() {
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

    features.bumpiness = sum;
}

function holes() {
    let holes = 0;
    for (let r = ROW-1; r > 0; r --) {
        board[r].forEach((col, c) => {
            if (col == VACANT && board[r - 1][c] != VACANT) {
                holes ++;
            }
        })
    }
    features.holes = holes;


}
