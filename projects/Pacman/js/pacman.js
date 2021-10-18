'use strict';
const PACMAN = '🥚';

var gPacman;
var gSuperInterval;
function createPacman(board) {
    gPacman = {
        location: {
            i: 3,
            j: 7,
        },
        isSuper: false,
    };
    board[gPacman.location.i][gPacman.location.j] = PACMAN;
}

function movePacman(ev) {
    if (!gGame.isOn) return;
    // console.log('ev', ev);
    var nextLocation = getNextLocation(ev);

    if (!nextLocation) return;
    // console.log('nextLocation', nextLocation);

    var nextCell = gBoard[nextLocation.i][nextLocation.j];

    if (nextCell === CHERRY) {
        updateScore(10);
    }
    if (nextCell === SUPER_FOOD) {
        if (gPacman.isSuper) {
            return;
        } else {
            gPacman.isSuper = true;
            setTimeout(regularPac, 5000);
            setTimeout(moveGhosts, 0);
        }
    }
    if (nextCell === WALL) return;
    if (nextCell === FOOD) {
        gFoodEaten++;
        updateScore(1);
        checkVictory();
    }
    if (nextCell === GHOST) {
        if (gPacman.isSuper) {
            gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;
            renderCell(gPacman.location, EMPTY);
            for (var i = 0; i < gGhosts.length; i++) {
                if (
                    nextLocation.i === gGhosts[i].location.i &&
                    nextLocation.j === gGhosts[i].location.j
                ) {
                    if (gGhosts[i].currCellContent === FOOD) {
                        gFoodEaten++;
                        gGhosts[i].currCellContent = EMPTY;
                    }
                    var deletedGhosts = gGhosts.splice(i, 1)[0];

                    setTimeout(function () {
                        gGhosts.push(deletedGhosts);
                    }, 5000);
                }
            }
        } else {
            gameOver();
            renderCell(gPacman.location, EMPTY);
            return;
        }
    }

    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY;

    // update the dom
    renderCell(gPacman.location, EMPTY);

    gPacman.location = nextLocation;

    // update the model
    gBoard[gPacman.location.i][gPacman.location.j] = PACMAN;
    // update the dom
    renderCell(gPacman.location, getPacmanHTML());
}

function getNextLocation(eventKeyboard) {
    var nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j,
    };
    switch (eventKeyboard.code) {
        case 'ArrowUp':
            nextLocation.i--;
            gPacman.rotate = 'rotate-up';
            break;
        case 'ArrowDown':
            nextLocation.i++;
            gPacman.rotate = 'rotate-down';
            break;
        case 'ArrowLeft':
            nextLocation.j--;
            gPacman.rotate = 'rotate-left';
            break;
        case 'ArrowRight':
            nextLocation.j++;
            gPacman.rotate = 'rotate-right';
            break;
        default:
            return null;
    }
    return nextLocation;
}

function regularPac() {
    gPacman.isSuper = false;
    setTimeout(moveGhosts, 0);
}
function getPacmanHTML() {
    return `<span class="pacman ${gPacman.rotate}">
    <span class="pacman-eye"></span>
    <span class="pacman-mouth"></span>
    </span>`;
}
