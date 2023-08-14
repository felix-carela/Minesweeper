/*----- Constants -----*/
const numRows = 10;
const numCols = 10;
const colors = { 0: 'white', 1: 'blue', 2: 'green', 3: 'red', 4: 'purple', 5: 'maroon', 6: 'turquoise', 7: 'black', 8: 'orange' };
const GAME_BOMBS = 15;
const WINNING_CHECKED =  (numRows * numCols) - GAME_BOMBS;

/*----- State Variables -----*/
let alive = true;

/*----- Cached Elements -----*/
const h1El = document.querySelector('h1');
const tableEl = document.querySelector('table');
const buttonEl = document.querySelector('button');

/*----- Event Listeners -----*/
tableEl.addEventListener('click', handleClick);
buttonEl.addEventListener('click', plagyAgain);

/*----- Functions -----*/
initialize();

function plagyAgain() {
    initialize();
    tableEl.addEventListener('click', handleClick);
}

function initialize() {
    alive = true;
    h1El.innerText = 'Minesweeper';
    let tableEl = document.querySelector('table');
    let html = '';

    for (let i = 0; i < numRows; i++) {
        html += '<tr>';
        for (let j = 0; j < numCols; j++) {
            html += '<td id="' + i + '-' + j + '" class="safe"></td>';
        }
        html += '</tr>';
    }
    tableEl.innerHTML = html;

    buttonEl.style.visibility = 'hidden';
    randomnizeBombs();
}

function randomnizeBombs() {
    for (let i = 0; i < GAME_BOMBS; i++) {
        let randomRow = Math.floor(Math.random() * numRows);
        let randomCol = Math.floor(Math.random() * numCols);
        let bombLocation = document.getElementById(randomRow + '-' + randomCol);
        if (bombLocation.classList.contains('bomb')) {
            i--;
        } else {
            bombLocation.classList.replace('safe', 'bomb');
        }
    }
}

function handleClick(event) {
    let cell = event.target;
    if (cell.classList.contains('bomb')) {
        alive = false;
        cell.style.backgroundColor = 'red';
    } else if (event.target.classList.contains('safe')) {
        cell.classList.replace('safe', 'safe-checked');
        numBombs = checkAdjacentBombCount(cell);
        cell.style.color = colors[numBombs];
        cell.textContent = numBombs;
        if (numBombs === 0) {
            showAdjacent(cell);
        }
    }
    checkWin();
}

function checkAdjacentBombCount(cell) {
    let cellId = cell.id.split('-');
    let row = parseInt(cellId[0]);
    let col = parseInt(cellId[1]);
    let adjacentBombs = 0;

    for (i = -1; i <= 1; i++) {
        for (j = -1; j <= 1; j++) {
            if (row + i >= 0 && row + i < numRows && col + j >= 0 && col + j < numCols) {
                let cell = document.getElementById((row + i) + '-' + (col + j));
                if (cell.classList.contains('bomb')) {
                    adjacentBombs++;
                }
            }
        }
    }

    return adjacentBombs;
}

function checkWin() {
    let checkedCells = document.querySelectorAll('.safe-checked');

    if (checkedCells.length === WINNING_CHECKED) {
        h1El.innerText = 'You survived!';
        tableEl.removeEventListener('click', handleClick);
        buttonEl.style.visibility = 'visible';

    } else if (!alive) {
        h1El.innerText = 'You died!';
        tableEl.removeEventListener('click', handleClick);
        buttonEl.style.visibility = 'visible';
        revealAllCells();
    }
}

function revealAllCells() {
    let cells = document.querySelectorAll('td');
    for (let cell of cells) {
        if (cell.classList.contains('bomb')) {
            cell.style.backgroundColor = 'red';
        } else {
            cell.classList.replace('safe', 'safe-checked');
            numBombs = checkAdjacentBombCount(cell);
            cell.style.color = colors[numBombs];
            cell.textContent = numBombs;
        }
    }
}

function showAdjacent(cell) {
    let cellId = cell.id.split('-');
    let row = parseInt(cellId[0]);
    let col = parseInt(cellId[1]);

    for (i = -1; i <= 1; i++) {
        for (j = -1; j <= 1; j++) {
            if (row + i >= 0 && row + i < numRows && col + j >= 0 && col + j < numCols) {
                let adjacentCell = document.getElementById((row + i) + '-' + (col + j));
                if (adjacentCell.classList.contains('safe-checked')) {
                    continue;
                }
                else if (adjacentCell.classList.contains('safe')) {
                    adjacentCell.classList.replace('safe', 'safe-checked');
                    numBombs = checkAdjacentBombCount(adjacentCell);
                    adjacentCell.style.color = colors[numBombs];
                    adjacentCell.textContent = numBombs;
                    if (numBombs === 0) {
                        showAdjacent(adjacentCell);
                    } else {
                        adjacentCell = cell.get;
                        continue;
                    }
                }
            }
        }
    }
}
