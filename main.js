// if (!alive) {
//     tableEl.removeEventListener('click', handleClick);
// }

/*----- Constants -----*/
const numRows = 10;
const numCols = 10;
const colors = { 0: 'white', 1: 'blue', 2: 'green', 3: 'red', 4: 'purple', 5: 'maroon', 6: 'turquoise', 7: 'black', 8: 'orange' };

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
    let numBombs = 10;

    for (let i = 0; i < numBombs; i++) {
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
    if (event.target.classList.contains('bomb')) {
        alive = false;
        event.target.style.backgroundColor = 'red';
    } else if (event.target.classList.contains('safe')) {
        event.target.classList.replace('safe', 'safe-checked');
        event.target.style.background = colors[checkAdjacent(event.target)];
    }
    checkWin();
}

function checkAdjacent(cell) {
    let cellId = cell.id.split('-');
    let row = parseInt(cellId[0]);
    let col = parseInt(cellId[1]);
    let adjacentBombs = 0;

    for (i = -1; i <= 1; i++) {
        for (j = -1; j <= 1; j++) {
            let cellId = document.getElementById((row + i) + '-' + (col + j));
            if (((row + 1) < numRows && (col + 1) < numCols
                && (row - 1) >= 0 && (col - 1) >= 0) && !(i === 0 && j === 0)) {
                if (cellId.classList.contains('bomb')) {
                    adjacentBombs++;
                }
            }

        }
    }
    return adjacentBombs;
}

function checkWin() {
    let checkedCells = document.querySelectorAll('.safe-checked');
    if (checkedCells.length === 90) {
        h1El.innerText = 'You survived!';
        tableEl.removeEventListener('click', handleClick);
        buttonEl.style.visibility = 'visible';
    } else if (!alive) {
        h1El.innerText = 'You died!';
        tableEl.removeEventListener('click', handleClick);
        buttonEl.style.visibility = 'visible';
    }
}

