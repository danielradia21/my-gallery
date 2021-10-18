'use strict';
//vars ⬇
//mat with cells, every cell is an object
//object with sizes and mines

var happy = '😃';
var sad = '😭';
var winner = '😎';
var gCurrLevel = 'beg';
var gLevel = {
    SIZE: 4,
    MINES: 2,
    FLAGS: 2,
    HEARTS: 2,
};
var gTimerInterval;
var gBoard = buildBoard(4);

var isFirstClick = true;

var gFlag = '🚩';
var gMine = '💣';
var gEmpty = '';
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secPassed: 0,
};
var gBombCounter = 0;
var elModal = document.querySelector('.modal');
//functions ⬇

function initGame() {
    gGame.isOn = true;
    document.querySelector('.smiley').innerText = happy;
    elModal.style.display = 'none';
    gBombCounter = 0;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secPassed = 0;
    gBoard = buildBoard();
    renderHearts();
    renderFlags();
    renderBoard(gBoard);

    document.querySelector('.timer').innerText = '-Timer-';
    stopTime();
}

function buildBoard() {
    var size = gLevel.SIZE;
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            };
            board[i][j] = cell;
        }
    }
    randomMines(board, gLevel.MINES);

    renderHearts(gLevel.HEARTS);
    renderFlags(gLevel.FLAGS);
    return board;
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = board[i][j];
            cell.minesAroundCount = setMinesNegsCount(i, j, board);
            if (cell.minesAroundCount === 0) {
                cell.minesAroundCount = '';
            }

            if (cell.isMine) {
                cell.innerText = gMine;
            }
            if (!cell.isShown) {
                cell.innerText = '';
            } else {
                cell.innerText = cell.minesAroundCount;
            }
            // figure class name
            var className = (i + j) % 2 === 0 ? 'even' : 'odd';

            strHtml += `<td oncontextmenu="cellMarked(this,event,${i},${j})" class="cell-${i}-${j} ${className} cell " onclick="cellClicked(this,${i},${j},event)"> ${cell.innerText}
                            
                        </td>`;
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}

function setMinesNegsCount(cellI, cellJ, board) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= board[0].length) continue;
            var currCell = board[i][j];
            if (currCell.isMine) {
                neighborsCount++;
            }
        }
    }
    return neighborsCount;
}

function firstClicked(elCell, i, j) {
    var neighborsCount = setMinesNegsCount(i, j, gBoard);
    if (isFirstClick) {
        startTime();
        if (gBoard[i][j].isMine) {
            gBoard[i][j].isMine = false;
            randomMines(gBoard, 1);
            if (neighborsCount > 0) {
                elCell.innerText = neighborsCount;
            }
        }
    }
}
function cellClicked(elCell, i, j, ev) {
    if (!gGame.isOn) {
        return;
    }
    if (elCell.innerText === gFlag) {
        return;
    }
    firstClicked(elCell, i, j);
    isFirstClick = false;

    if (elCell.isShown) {
        return;
    }

    if (!gBoard[i][j].isMine) {
        if (gBoard[i][j].minesAroundCount === '') {
            elCell.classList.add('show');
            gGame.shownCount++;
        } else {
            elCell.classList.add('show');
            gGame.shownCount++;
        }
    }
    if (gBoard[i][j].isMine) {
        elCell.classList.add('exploed');
    }

    gBoard[i][j].isShown = true;
    // elCell[i][j].isShown = true;

    elCell.innerText = gBoard[i][j].isMine
        ? gMine
        : gBoard[i][j].minesAroundCount;
    if (gBoard[i][j].isMine) {
        gLevel.HEARTS--;
        gLevel.MINES--;
        gLevel.FLAGS--;
        gGame.shownCount++;
        renderFlags(gLevel.FLAGS);
        renderHearts(gLevel.HEARTS);
    }
    if (gBoard[i][j].minesAroundCount === '' && !gBoard[i][j].isMine) {
        expandShown(gBoard, elCell, i, j);
    }
    gGame.isOn = checkGameOver(gBoard, elCell);
}

function cellMarked(elCell, ev, i, j) {
    ev.preventDefault();
    if (gGame.isOn === false) {
        return;
    }

    if (elCell.isShown) {
        return;
    }
    firstClicked(elCell, i, j);
    isFirstClick = false;
    if (elCell.innerText === gFlag) {
        elCell.innerText = '';
        gBoard[i][j].isMarked = false;
        gGame.markedCount--;
        gLevel.FLAGS++;
        if (gBoard[i][j].isMine) {
            gBombCounter--;
        }
    } else {
        elCell.innerText = gFlag;
        gBoard[i][j].isMarked = true;
        gGame.markedCount++;
        gLevel.FLAGS--;
        if (gBoard[i][j].isMine) {
            gBombCounter++;
        }
    }

    renderFlags(gLevel.FLAGS);
    gGame.isOn = checkGameOver(gBoard);
}

function mineAndShown(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine && board[i][j].isMarked) {
                if (gBombCounter === gLevel.MINES) {
                    return true;
                }
            }
        }
    }
    return false;
}
function allCellsAreOpen(board) {
    var counter = 0;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isShown) {
                counter++;
            }
        }
    }

    console.log(gLevel.SIZE * gLevel.SIZE - gLevel.MINES - gGame.markedCount);

    gGame.shownCount = counter - gLevel.MINES;
    if (
        gGame.shownCount ===
        gLevel.SIZE * gLevel.SIZE - gLevel.MINES - gGame.markedCount
    ) {
        return true;
    }
    return false;
}
function checkGameOver(board, elCell) {
    if (gLevel.HEARTS === 0) {
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[0].length; j++) {
                if (board[i][j].isMine) {
                    board[i][j].isShown = true;
                    renderCell({ i, j }, gMine);
                }
            }
        }

        stopTime();
        document.querySelector('.smiley').innerText = sad;
        gGame.isOn = false;
        //gameOver Model
        elModal.style.display = 'block';
        elModal.innerHTML =
            ' Boom. You Dead. </br> <button class="modal-btn" onclick="resetGame()">Reset Game</button>';
        return false;
    }
    if (mineAndShown(board) && allCellsAreOpen(board)) {
        stopTime();
        document.querySelector('.smiley').innerText = winner;
        //gameWin Model
        elModal.style.display = 'block';
        elModal.innerHTML =
            ' W I N N E R !  </br> <button class="modal-btn" onclick="resetGame()">Reset Game</button>';
        gGame.isOn = false;
        return false;
    }

    return true;
}

function expandShown(board, elCell, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (i === cellI && j === cellJ) continue;
            var currCell = board[i][j];
            if (!currCell.isMarked && !currCell.isShown && !currCell.isMine) {
                currCell.isShown = true;
                if (currCell.minesAroundCount === '') {
                    expandShown(board, elCell, i, j);
                }
                // if (currCell.isShown) {
                //     gGame.shownCount++;
                // }
                renderCell({ i, j }, currCell.minesAroundCount);
            }
        }
    }
}

//recurcia

function renderHearts(hearts) {
    var heart = document.querySelector('.hearts');
    for (var i = 0; i <= hearts; i++) {
        heart.innerText = `Lives: ${hearts}`;
    }
}

function renderFlags(num) {
    var flag = document.querySelector('.flags');
    num = gLevel.FLAGS;
    flag.innerText = ` Flags: ${num}`;
}

function resetGame() {
    if (gCurrLevel === 'beg') {
        levels(4, 2, 2, 2, 'beg');
    }
    if (gCurrLevel === 'med') {
        levels(8, 12, 12, 4, 'med');
    }
    if (gCurrLevel === 'ex') {
        levels(12, 30, 30, 6, 'ex');
    }
    document.querySelector('.smiley').innerText = happy;

    isFirstClick = true;
    initGame();
}

function levels(num, bombs, flags, hearts, lvlName) {
    gCurrLevel = lvlName;
    gLevel = {
        SIZE: num,
        MINES: bombs,
        FLAGS: flags,
        HEARTS: hearts,
    };
    document.querySelector('.smiley').innerText = happy;
    isFirstClick = true;
    gGame.isOn = true;
    document.querySelector('.timer').innerText = '-Timer-';
    stopTime();
    gBoard = buildBoard();
    renderBoard(gBoard);
}

function renderCell(pos, value) {
    var elCell = document.querySelector(`.cell-${pos.i}-${pos.j}`);
    elCell.innerText = value;

    elCell.classList.add('show');
}

function randomMines(board, num) {
    for (var i = 0; i < num; i++) {
        var idxI = getRandomInt(0, board.length - 1);
        var idxJ = getRandomInt(0, board.length - 1);
        console.log(idxI, idxJ);
        if (!board[idxI][idxJ].isMine) {
            board[idxI][idxJ].isMine = true;
        } else {
            i--;
        }
    }
}

function startTime() {
    var gStartTime = Date.now();
    var elTimer = document.querySelector('.timer');
    gTimerInterval = setInterval(function () {
        var passedSeconds = (Date.now() - gStartTime) / 1000;
        elTimer.innerText = `Your Time Is: ${passedSeconds.toFixed(3)}`;
    }, 10);
}

function stopTime() {
    clearInterval(gTimerInterval);
}
