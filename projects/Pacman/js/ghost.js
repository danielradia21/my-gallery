'use strict';
const GHOST = '&#9760;';
var gGhosts = [];
var gIntervalGhosts;

function createGhost(board) {
    var ghost = {
        location: {
            i: 11,
            j: 7,
        },
        currCellContent: FOOD,
        color: getRandomColor(),
    };

    gGhosts.push(ghost);
    board[ghost.location.i][ghost.location.j] = GHOST;
    setTimeout(moveGhosts, 0);
}

function createGhosts(board) {
    gGhosts = [];
    createGhost(board);
    createGhost(board);
    createGhost(board);
    gIntervalGhosts = setInterval(moveGhosts, 500);
}

function moveGhosts() {
    for (var i = 0; i < gGhosts.length; i++) {
        var ghost = gGhosts[i];
        moveGhost(ghost);
    }
}
function moveGhost(ghost) {
    var moveDiff = getMoveDiff();
    var nextLocation = {
        i: ghost.location.i + moveDiff.i,
        j: ghost.location.j + moveDiff.j,
    };
    var nextCell = gBoard[nextLocation.i][nextLocation.j];
    if (nextCell === WALL) return;
    if (nextCell === GHOST) return;
    if (nextCell === PACMAN) {
        if (gPacman.isSuper) {
            var deletedGhosts = gGhosts.splice(i, 1)[0];

            setTimeout(function () {
                gGhosts.push(deletedGhosts);
            }, 5000);
        } else {
            gameOver();
            return;
        }
    }

    // model
    gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent;
    // dom
    renderCell(ghost.location, ghost.currCellContent);

    // model
    ghost.location = nextLocation;
    ghost.currCellContent = gBoard[ghost.location.i][ghost.location.j];
    gBoard[ghost.location.i][ghost.location.j] = GHOST;
    // dom
    renderCell(ghost.location, getGhostHTML(ghost.color));
}

function getMoveDiff() {
    var randNum = getRandomInt(0, 100);
    if (randNum < 25) {
        return { i: 0, j: 1 };
    } else if (randNum < 50) {
        return { i: -1, j: 0 };
    } else if (randNum < 75) {
        return { i: 0, j: -1 };
    } else {
        return { i: 1, j: 0 };
    }
}

function getGhostHTML(ghostColor) {
    ghostColor = gPacman.isSuper ? 'white' : ghostColor;
    return `<span style="color :${ghostColor}">${GHOST}</span>`;
}

//RANDOM COLOR TO EVERY GHOST
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
