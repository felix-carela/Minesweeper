/*----- Constants -----*/
const numRows = 10;
const numCols = 10;
const colors = { 0: 'white', 1: 'blue', 2: 'green', 3: 'red', 4: 'purple', 5: 'maroon', 6: 'turquoise', 7: 'black', 8: 'orange' };
const GAME_BOMBS = 15;
const WINNING_CHECKED = (numRows * numCols) - GAME_BOMBS;

/*----- State Variables -----*/
let numFlags = 15;
let alive = true;
let seconds = 0;

/*----- Cached Elements -----*/
const h1El = document.querySelector('h1');
const tableEl = document.querySelector('table');
const buttonEl = document.querySelector('button');
const flagEl = document.getElementById('flags');
const cells = document.querySelectorAll('table');
const timeEl = document.getElementById('time'); 

/*----- Event Listeners -----*/
tableEl.addEventListener('click', handleClick);
buttonEl.addEventListener('click', plagyAgain);

/*----- Loop through all cells and add event listener -----*/
cells.forEach(cell => {
    cell.addEventListener('contextmenu', addFlag);
});

/*----- Functions -----*/
function startCounter() {
    seconds = 0;
    updateCounter();

    setInterval(() => {
        seconds++;
        updateCounter();
    }, 1000);
}

function updateCounter() {
    timeEl.textContent = seconds;
}

function displayNumFlags() {
    flagEl.textContent = numFlags;
}

function addFlag(event) {
    event.preventDefault();
    if (event.button === 2) {
        let rightClick = event.target;
        if (rightClick.classList.contains('flag')) {
            rightClick.classList.remove('flag');
            numFlags++;
        } else if ((!(rightClick.classList.contains('revealed'))) && numFlags > 0) {
            rightClick.classList.add('flag');
            numFlags--;
        } else {
            return;
        }
    }
    placeFlag(event);
    displayNumFlags();
}

function placeFlag(event) {
    if (event.target.classList.contains('flag')) {
        event.target.innerHTML = '<img src="Minesweeper-flag.png" alt="flag">';
    } else if (!(event.target.classList.contains('flag'))){
        event.target.innerHTML = '';
    }
}

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
    displayNumFlags();
    startCounter();
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
    let cellId = cell.id.split('-');
    let row = parseInt(cellId[0]);
    let col = parseInt(cellId[1]);
    let numBombs = 0;

    if (cell.classList.contains('bomb')) {
        alive = false;
        cell.style.backgroundColor = 'red';
        cell.innerHTML = '<img src="Minesweeper-mine.png" alt="bomb">';
    } else if (event.target.classList.contains('safe')) {
        if (numBombs === 0) {
            floodFill(row, col, cell);
        } else {
            cell.classList.add('revealed');
            numBombs = checkAdjacentBombCount(cell);
            styleBombCount(cell, numBombs);
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

function styleBombCount(cell, numBombs) {
    cell.style.color = colors[numBombs];
    cell.textContent = numBombs;
}

function checkWin() {
    let checkedCells = document.querySelectorAll('.safe revealed');

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
    let numBombs = 0;

    for (let cell of cells) {
        if (cell.classList.contains('bomb')) {
            cell.innerHTML = '<img src="Minesweeper-mine.png" alt="bomb">';;
        } else {
            cell.classList.add('revealed');
            numBombs = checkAdjacentBombCount(cell);
            styleBombCount(cell, numBombs);
        }
    }
}

function floodFill(row, col) {
    let cell = document.getElementById(row + '-' + col);

    if (row < 0 || row >= numRows || col < 0 || col >= numCols) {
        return;
    }

    if (cell.classList.contains('good', 'bomb') || cell.classList.contains('revealed')) {
        return;
    }

    let numBombs = checkAdjacentBombCount(cell);
    cell.classList.replace('safe', 'good');
    styleBombCount(cell, numBombs);
    cell.classList.add('revealed');

    if (numBombs === 0) {
        floodFill(row - 1, col);
        floodFill(row - 1, col + 1);
        floodFill(row - 1, col - 1);
        floodFill(row, col - 1);
        floodFill(row, col + 1);
        floodFill(row + 1, col);
        floodFill(row + 1, col + 1);
        floodFill(row + 1, col - 1);
    }
}
