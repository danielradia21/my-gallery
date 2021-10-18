'use strict';
const WALL = '🔲';
const FOOD = '&#x22C5;';
const EMPTY = ' ';
const SUPER_FOOD = '&#9733;';
const CHERRY = '🍒';
var gFoodCount = -1;
var gFoodEaten = 0;
var gCherryInterval;

var gBoard;
var gGame = {
    score: 0,
    isOn: false,
};
function init() {
    closeModal();
    gFoodEaten = 0;
    gFoodCount = -1;
    gGame.score = 0;
    document.querySelector('h2 span').innerText = gGame.score;
    gBoard = buildBoard();
    createPacman(gBoard);
    createGhosts(gBoard);
    printMat(gBoard, '.board-container');
    gGame.isOn = true;
    gCherryInterval = setInterval(randomCherry, 15000);
}
function buildBoard() {
    const SIZE = 15;
    var board = [];
    for (var i = 0; i < SIZE; i++) {
        board.push([]);
        for (var j = 0; j < SIZE; j++) {
            board[i][j] = FOOD;
            gFoodCount++;
            if (
                (i === 1 && j === 1) ||
                (i === SIZE - 2 && j === 1) ||
                (i === 1 && j === SIZE - 2) ||
                (i === SIZE - 2 && j === SIZE - 2)
            ) {
                board[i][j] = SUPER_FOOD;
                gFoodCount--;
            }

            if (
                i === 0 ||
                i === SIZE - 1 ||
                j === 0 ||
                j === SIZE - 1 ||
                (i > 8 && i < SIZE - 2 && j === 5) ||
                (i > 8 && i < SIZE - 2 && j === 9) ||
                (i === 12 && j > 5 && j < 10) ||
                (i === 9 && j === 6) ||
                (i === 9 && j === 8)
            ) {
                board[i][j] = WALL;
                gFoodCount--;
            }
        }
    }
    return board;
}

function updateScore(diff) {
    gGame.score += diff;
    document.querySelector('h2 span').innerText = gGame.score;
}

function checkVictory() {
    if (gFoodEaten === gFoodCount) {
        openWinModal();
    }
}
function gameOver() {
    openLoseModal();
}

function openWinModal() {
    gGame.isOn = false;
    clearInterval(gIntervalGhosts);
    clearInterval(gCherryInterval);
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'block';
    elModal.innerHTML =
        ' W I N N E R !  </br> <button class="modal-btn" onclick="init()">Reset Game</button>';
}
function closeModal() {
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'none';
}

function openLoseModal() {
    gGame.isOn = false;
    clearInterval(gIntervalGhosts);
    clearInterval(gCherryInterval);
    var elModal = document.querySelector('.modal');
    elModal.style.display = 'block';
    elModal.innerHTML =
        ' Game Over. You Dead. </br> <button class="modal-btn" onclick="init()">Reset Game</button>';
}

function randomCherry() {
    var board = gBoard;
    var randLocation = getRandomEmptyCell(board);
    board[randLocation.i][randLocation.j] = CHERRY;
    renderCell(randLocation, CHERRY);
}

function checkEmptyCells(board) {
    var emptyCells = [];
    for (var i = 1; i < board.length - 1; i++) {
        for (var j = 1; j < board[i].length - 1; j++) {
            if (board[i][j] === EMPTY) {
                emptyCells.push({ i, j });
            }
        }
    }
    return emptyCells;
}
function getRandomEmptyCell(board) {
    var currEmptyCells = CheckEmptyCells(board);
    var currIdx = getRandomInt(0, currEmptyCells.length - 1);
    return currEmptyCells[currIdx];
}
