function createMat(ROWS, COLS) {
    var mat = [];
    for (var i = 0; i < ROWS; i++) {
        var row = [];
        for (var j = 0; j < COLS; j++) {
            row.push('');
        }
        mat.push(row);
    }
    return mat;
}
function getRandomEmptyCell(board) {
    var currEmptyCells = checkEmptyCells(board);
    var currIdx = getRandomInt(0, currEmptyCells.length - 1);
    return currEmptyCells[currIdx];
}
function checkEmptyCells(board) {
    var emptyCells = [];
    for (var i = 1; i < board.length - 1; i++) {
        for (var j = 1; j < board[i].length - 1; j++) {
            if (
                board[i][j].type === FLOOR &&
                board[i][j].gameElement === null
            ) {
                emptyCells.push({ i, j });
            }
        }
    }
    return emptyCells;
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}
function renderCell(location, value) {
    var cellSelector = '.' + getClassName(location);
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}
