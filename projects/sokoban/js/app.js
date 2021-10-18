'use strict';
var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BOX = 'BOX';
var GAMER = 'GAMER';
var GAMER_IMG = '🧛‍♂️';
var BOX_IMG = '🎁';
var TARGET = 'TARGET';
var GOLD = '📀';
var CLOCK = '🕛';
var MAGNET = '📎';
var GLUE = 'GLUE';
var GLUE_IMG = '🍌';
var WATER = 'WATER';
var gBonusInterval;
var gBoard;
var gGamerPos;
var gUserSteps = 0;
var gScore = 100;
var isGame = true; //gIsGame
var gEventKey;
var isMagnet = false; //gIsMagnet
var elScore = document.querySelector('h1 span');
var elModal = document.querySelector('.modal');
var elBoard = document.querySelector('.board');
var gBoardCopy = null;
var gGamerLastPos = null;

function initGame() {
    isGame = true;
    elModal.style.display = 'none';
    gScore = 100;
    gUserSteps = 0;
    gBonusInterval = setInterval(randomBonus, 200);
    gGamerPos = { i: 2, j: 9 };
    gGamerLastPos = { i: 2, j: 9 };
    gBoard = buildBoard();
    renderBoard(gBoard);
    elScore.innerText = gScore;
}
function buildBoard() {
    var board = createMat(13, 13);
    gBoardCopy = createMat(13, 13);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = { type: FLOOR, gameElement: null };
            if ((i === 9 && j === 7) || (i === 3 && j === 4)) {
                cell.type = WATER;
                cell.gameElement = WATER;
            }
            if (
                (i === 2 && j === 5) ||
                (i === 5 && j === 2) ||
                (i === 8 && j === 2) ||
                (i === 8 && j === 8)
            ) {
                cell.type = TARGET;
                cell.gameElement = TARGET;
            }
            if (
                i === 0 ||
                i === board.length - 1 ||
                j === 0 ||
                j === board[0].length - 1 ||
                (i <= 3 && j === 2) ||
                (i >= 7 && j === 3) ||
                (i === 5 && j >= 5)
            ) {
                cell.type = WALL;
            }
            board[i][j] = cell;
        }
    }
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
    board[2][7].gameElement = GLUE;
    board[10][6].gameElement = GLUE;
    board[8][9].gameElement = GLUE;
    board[3][8].gameElement = BOX;
    board[7][4].gameElement = BOX;
    board[6][7].gameElement = BOX;
    board[8][6].gameElement = BOX;
    return board;
}
function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j];
            var cellClass = getClassName({ i: i, j: j });
            if (currCell.type === FLOOR) {
                cellClass += ' floor';
            }
            if (currCell.type === WALL) {
                cellClass += ' wall';
            }
            if (currCell.type === TARGET) {
                cellClass += ' target';
            }
            if (currCell.type === WATER) {
                cellClass += ' water';
            }
            strHTML += `\t<td class="cell ${cellClass}" 
            onclick="moveTo(${i},${j})">\n`;
            switch (currCell.gameElement) {
                case GAMER:
                    strHTML += GAMER_IMG;
                    break;
                case BOX:
                    strHTML += BOX_IMG;
                    break;
                case GLUE:
                    strHTML += GLUE_IMG;
                default:
                    break;
            }
            strHTML += '\t</td>\n';
        }
        strHTML += '</tr>\n';
    }
    elBoard.innerHTML = strHTML;
}
function moveTo(i, j) {
    copyObjectMat();
    if (isGame) {
        var targetCell = gBoard[i][j];
        if (targetCell.type === WALL) return;
        var iAbsDiff = Math.abs(i - gGamerPos.i);
        var jAbsDiff = Math.abs(j - gGamerPos.j);
        if (
            (iAbsDiff === 1 && jAbsDiff === 0) ||
            (jAbsDiff === 1 && iAbsDiff === 0)
        ) {
            if (targetCell.gameElement === GOLD) {
                gScore += 100;
                elScore.innerText = gScore;
            }
            if (targetCell.gameElement === CLOCK) {
                gUserSteps -= 10;
            }
            if (targetCell.gameElement === GLUE) {
                gUserSteps += 5;
                isGame = false;
                setTimeout(function () {
                    isGame = true;
                }, 4800);
            }
            if (targetCell.gameElement === MAGNET) {
                isMagnet = true;
            }
            if (targetCell.gameElement === BOX) {
                if (j < gGamerPos.j) {
                    if (gBoard[gGamerPos.i][gGamerPos.j - 2].type === WALL)
                        if (isMagnet) {
                            i = i;
                            j += 2;
                            renderCell(gGamerPos, '');
                            gGamerPos.i = i;
                            gGamerPos.j = j;
                            gBoard[gGamerPos.i][gGamerPos.j].gameElement =
                                GAMER;
                            renderCell(gGamerPos, GAMER_IMG);
                            pushTheBox(i, j - 1);
                            gBoard[i][j - 2].gameElement = null;
                            renderCell({ i, j: j - 2 }, '');
                            isMagnet = false;
                        } else {
                            return;
                        }
                    if (
                        gBoard[gGamerPos.i][gGamerPos.j - 2].gameElement === BOX
                    )
                        return;
                    if (gBoard[gGamerPos.i][gGamerPos.j - 2].type === WATER) {
                        while (gBoard[i][j - 2].type !== WALL) {
                            i = i;
                            j = j - 1;
                            if (gBoard[i][j - 1].gameElement === BOX) {
                                return;
                            }
                            renderCell(gGamerPos, '');
                            gGamerPos.i = i;
                            gGamerPos.j = j;
                            gBoard[gGamerPos.i][gGamerPos.j].gameElement =
                                GAMER;
                            renderCell(gGamerPos, GAMER_IMG);
                            pushTheBox(i, j - 1);
                            gBoard[i][j + 1].gameElement = null;
                            renderCell({ i, j: j + 1 }, '');
                            gUserSteps++;
                        }
                    }
                    pushTheBox(i, j - 1);
                }
                if (i < gGamerPos.i) {
                    if (gBoard[gGamerPos.i - 2][gGamerPos.j].type === WALL) {
                        if (isMagnet) {
                            i += 2;
                            j = j;
                            if (gBoard[i][j - 1].gameElement === BOX) {
                                return;
                            }
                            renderCell(gGamerPos, '');
                            gGamerPos.i = i;
                            gGamerPos.j = j;
                            gBoard[gGamerPos.i][gGamerPos.j].gameElement =
                                GAMER;
                            renderCell(gGamerPos, GAMER_IMG);
                            pushTheBox(i - 1, j);
                            gBoard[i - 2][j].gameElement = null;
                            renderCell({ i: i - 2, j }, '');
                            isMagnet = false;
                        } else {
                            return;
                        }
                    }
                    if (
                        gBoard[gGamerPos.i - 2][gGamerPos.j].gameElement ===
                        TARGET
                    ) {
                        var currCell = document.querySelector(
                            `.cell-${gGamerPos.i - 2}-${gGamerPos.j}`
                        );
                        currCell.style.backgroundColor = '#97ff97';
                    }
                    if (
                        gBoard[gGamerPos.i - 2][gGamerPos.j].gameElement === BOX
                    )
                        return;

                    if (gBoard[gGamerPos.i - 2][gGamerPos.j].type === WATER) {
                        while (gBoard[i - 2][j].type !== WALL) {
                            i = i - 1;
                            j = j;
                            if (gBoard[i - 1][j].gameElement === BOX) {
                                return;
                            }
                            renderCell(gGamerPos, '');
                            gGamerPos.i = i;
                            gGamerPos.j = j;
                            gBoard[gGamerPos.i][gGamerPos.j].gameElement =
                                GAMER;
                            renderCell(gGamerPos, GAMER_IMG);
                            pushTheBox(i - 1, j);
                            gBoard[i + 1][j].gameElement = null;
                            renderCell({ i: i + 1, j: j }, '');
                            gUserSteps++;
                        }
                    }
                    pushTheBox(i - 1, j);
                }
                if (i > gGamerPos.i) {
                    if (gBoard[gGamerPos.i + 2][gGamerPos.j].type === WALL)
                        if (isMagnet) {
                            i -= 2;
                            j = j;
                            renderCell(gGamerPos, '');
                            gGamerPos.i = i;
                            gGamerPos.j = j;
                            gBoard[gGamerPos.i][gGamerPos.j].gameElement =
                                GAMER;
                            renderCell(gGamerPos, GAMER_IMG);
                            pushTheBox(i + 1, j);
                            gBoard[i + 2][j].gameElement = null;
                            renderCell({ i: i + 2, j }, '');
                            isMagnet = false;
                        } else {
                            return;
                        }
                    if (
                        gBoard[gGamerPos.i + 2][gGamerPos.j].gameElement === BOX
                    )
                        return;

                    if (gBoard[gGamerPos.i + 2][gGamerPos.j].type === WATER) {
                        while (gBoard[i + 2][j].type !== WALL) {
                            i = i + 1;
                            j = j;
                            if (gBoard[i + 1][j].gameElement === BOX) {
                                return;
                            }
                            renderCell(gGamerPos, '');
                            gGamerPos.i = i;
                            gGamerPos.j = j;
                            gBoard[gGamerPos.i][gGamerPos.j].gameElement =
                                GAMER;
                            renderCell(gGamerPos, GAMER_IMG);
                            pushTheBox(i + 1, j);
                            gBoard[i - 1][j].gameElement = null;
                            renderCell({ i: i - 1, j: j }, '');
                            gUserSteps++;
                        }
                    }
                    pushTheBox(i + 1, j);
                }
                if (j > gGamerPos.j) {
                    if (gBoard[gGamerPos.i][gGamerPos.j + 2].type === WALL)
                        if (isMagnet) {
                            i = i;
                            j -= 2;
                            renderCell(gGamerPos, '');
                            gGamerPos.i = i;
                            gGamerPos.j = j;
                            gBoard[gGamerPos.i][gGamerPos.j].gameElement =
                                GAMER;
                            renderCell(gGamerPos, GAMER_IMG);
                            pushTheBox(i, j + 1);
                            gBoard[i][j + 2].gameElement = null;
                            renderCell({ i, j: j + 2 }, '');
                            isMagnet = false;
                        } else {
                            return;
                        }

                    if (
                        gBoard[gGamerPos.i][gGamerPos.j + 2].gameElement === BOX
                    )
                        return;

                    if (gBoard[gGamerPos.i][gGamerPos.j + 2].type === WATER) {
                        while (gBoard[i][j + 2].type !== WALL) {
                            i = i;
                            j = j + 1;
                            if (gBoard[i][j + 1].gameElement === BOX) {
                                return;
                            }
                            renderCell(gGamerPos, '');
                            gGamerPos.i = i;
                            gGamerPos.j = j;
                            gBoard[gGamerPos.i][gGamerPos.j].gameElement =
                                GAMER;
                            renderCell(gGamerPos, GAMER_IMG);
                            pushTheBox(i, j + 1);
                            gBoard[i][j - 1].gameElement = null;
                            renderCell({ i: i, j: j - 1 }, '');
                            gUserSteps++;
                        }
                    }

                    pushTheBox(i, j + 1);
                }
            }
            gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
            renderCell(gGamerPos, '');
            gGamerPos.i = i;
            gGamerPos.j = j;
            gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
            renderCell(gGamerPos, GAMER_IMG);
            gUserSteps++;
            console.log('User steps ' + gUserSteps);
            gScore--;
            elScore.innerText = gScore;
            checkGameOver(gBoard);
        }
    }
}
function pushTheBox(i, j) {
    gBoard[i][j].gameElement = BOX;
    renderCell({ i: i, j: j }, BOX_IMG);
}
function handleKey(event) {
    if (isGame) {
        var i = gGamerPos.i;
        var j = gGamerPos.j;
        gEventKey = event.key;
        switch (event.key) {
            case 'ArrowLeft':
                moveTo(i, j - 1);
                break;
            case 'ArrowRight':
                moveTo(i, j + 1);
                break;
            case 'ArrowUp':
                moveTo(i - 1, j);
                break;
            case 'ArrowDown':
                moveTo(i + 1, j);
                break;
        }
    }
}
function checkGameOver(board) {
    if (
        board[2][5].gameElement === BOX &&
        board[5][2].gameElement === BOX &&
        board[8][2].gameElement === BOX &&
        board[8][8].gameElement === BOX
    ) {
        gameOver();
        elModal.innerHTML =
            ' W I N N E R !  </br> <button class="modal-btn" onclick="initGame()">Reset Game</button>';
    }
    if (gUserSteps === 100 || gScore === 0) {
        gameOver();
        elModal.innerHTML =
            ' Game Over. You Dead. </br> <button class="modal-btn" onclick="initGame()">Reset Game</button>';
        return;
    }
}
function gameOver() {
    isGame = false;
    elModal.style.display = 'block';
    clearInterval(gBonusInterval);
}
function randomBonus() {
    var board = gBoard;
    var randLocation = getRandomEmptyCell(board);
    var randomNum = getRandomInt(1, 100);
    if (randomNum <= 99) {
        board[randLocation.i][randLocation.j].gameElement = GOLD;
        renderCell(randLocation, GOLD);
    }
    if (randomNum <= 66) {
        board[randLocation.i][randLocation.j].gameElement = MAGNET;
        renderCell(randLocation, MAGNET);
    }
    if (randomNum <= 33) {
        board[randLocation.i][randLocation.j].gameElement = CLOCK;
        renderCell(randLocation, CLOCK);
    }
    setTimeout(function () {
        if (board[randLocation.i][randLocation.j].gameElement) return;
        board[randLocation.i][randLocation.j].gameElement = null;
        renderCell(randLocation, '');
    }, 5000);
}
function magnetMoves(i, j) {
    console.log(i, j);
    renderCell(gGamerPos, '');
    gGamerPos.i = i;
    gGamerPos.j = j;
    gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
    renderCell(gGamerPos, GAMER_IMG);
}

function undoSteps() {
    if (!isGame) return;
    if (!gBoardCopy) return;
    for (var i = 0; i < gBoardCopy.length; i++) {
        for (var j = 0; j < gBoardCopy[0].length; j++) {
            var currCell = {
                type: gBoardCopy[i][j].type,
                gameElement: gBoardCopy[i][j].gameElement,
            };
            gBoard[i][j] = currCell;
        }
        gGamerPos = { i: gGamerLastPos.i, j: gGamerLastPos.j };
        renderBoard(gBoard);
    }
}

function copyObjectMat() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = {
                type: gBoard[i][j].type,
                gameElement: gBoard[i][j].gameElement,
            };
            gBoardCopy[i][j] = currCell;
        }
    }
    gGamerLastPos = { i: gGamerPos.i, j: gGamerPos.j };
}
