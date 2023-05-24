import { wrapper, flagsCounter, stepsCounter, resetBtn, gameMessage } from './game-interface.js'
import { timerTime, runTimer, stopTimer, setTimerTime } from './timer.js';
import { makeLSCopy, getLSCopy, clearLSCopy } from './ls-copy.js';
import { addToResults } from './results.js';
import { openSound, markSound, winSound, loseSound } from './sound.js';

const CELL_STATES = {
   closed: 'closed',
   opened: 'opened',
   marked: 'marked',
   mine: 'mine',
}

let flagsCount;
let boardSize;
let minesNumber;
let board;
let boardContent = [];
let hasBombs;
let stepsCount;
let openedCellsCount;
let isEnd;

export function createBoard(_boardSize, _minesNumber) {
   if (!localStorage.getItem('boardInfo')) {
      flagsCount = _minesNumber;
      boardSize = _boardSize;
      minesNumber = _minesNumber;
      boardContent.length = 0;
      hasBombs = false;
      stepsCount = 0;
      openedCellsCount = 0;
      isEnd = false;
   }
   else {
      let _timerTime;
      ({ flagsCount, boardSize, minesNumber, boardContent, hasBombs, stepsCount, openedCellsCount, timerTime: _timerTime } = getLSCopy());
      setTimerTime(_timerTime);
      stepsCounter.textContent = stepsCount;
   }

   flagsCounter.textContent = flagsCount;

   board = document.querySelector('.board');

   if (!board) {
      board = document.createElement('div');
      board.addEventListener('contextmenu', (e) => e.preventDefault());
      wrapper.append(board);
   }

   board.className = `board board_size_${boardSize}`;

   board.innerHTML = '';
   
   if (!boardContent.length) {
      for (let i = 0; i < boardSize; i++) {
         const boardRow = [];
         for (let j = 0; j < boardSize; j++) {
            const element = document.createElement('div');
            element.className = 'board__cell';
            let cellId = j + 1 + i * boardSize;
            element.setAttribute('id', `cell${cellId}`);
            element.dataset.state = CELL_STATES.closed;
            board.append(element);

            const boardCell = {
               element,
               state: CELL_STATES.closed,
               mine: false,
               x: j,
               y: i,
            }
            boardRow.push(boardCell);
         }
         boardContent.push(boardRow);
      }
   }
   else {
      for (let row of boardContent) {
         for (let cell of row) {
            const element = document.createElement('div');
            element.className = 'board__cell';
            let cellId = cell.x + 1 + cell.y * boardSize;
            element.setAttribute('id', `cell${cellId}`);
            boardContent[cell.y][cell.x].element = element;
            if (!(cell.state === CELL_STATES.mine)) {
               element.dataset.state = cell.state;
               let minesAround = boardContent[cell.y][cell.x].minesAround;
               if (minesAround) {
                  element.textContent = minesAround;
                  element.dataset['minesAround'] = minesAround;
               }
            }
            else {
               element.dataset.state = CELL_STATES.closed;
            }
            board.append(element);
         }
      }
   }
   board.addEventListener('click', leftCellListener);
   board.addEventListener('contextmenu', rightCellListener);
   runTimer();
}

function leftCellListener(e) {
   if (e.target.classList.contains('board__cell')) {
      const cell = findCellCors(e);
      const boardCell = boardContent[cell.y][cell.x];
      const element = boardCell.element;
      if (!hasBombs) {
         generateMines(boardCell);
      }
      if (element.dataset.state === CELL_STATES.opened || element.dataset.state === CELL_STATES.marked) return;
      openCell(boardCell);
      openSound();
      if (!isEnd) {
         stepsCount++;
         makeLSCopy({flagsCount, boardSize, minesNumber, boardContent, hasBombs, stepsCount, openedCellsCount, timerTime});
         stepsCounter.textContent = stepsCount;
         if (openedCellsCount === Math.pow(boardSize, 2) - minesNumber) {
            checkEnd(false);
            clearLSCopy();
            winSound();
         }
      }
      else {
         clearLSCopy();
         loseSound();
      }
   }
}

function rightCellListener(e) {
   if (e.target.classList.contains('board__cell')) {
      const cell = findCellCors(e);
      const boardCell = boardContent[cell.y][cell.x];
      if (boardCell.state === CELL_STATES.opened) return flagsCount;
      markCell(boardCell, flagsCount);
      makeLSCopy({flagsCount, boardSize, minesNumber, boardContent, hasBombs, stepsCount, openedCellsCount, timerTime});
      markSound();
   }
}

function findCellCors(e) {
   let index = parseInt(e.target.getAttribute('id').match(/\d+/)) - 1;
   return {
      x: index % boardSize,
      y: Math.floor(index / boardSize),
   }
}

function changeCellState(boardCell, state) {
   boardCell.state = state;
   boardCell.element.dataset.state = state;
}

function generateMines(boardCell) {
   const positions = [];
   while (positions.length !== minesNumber) {
      const {x, y} = randomPositions(boardSize);
      if (!(positions.some(item => item.x === x && item.y === y)) && !(boardCell.x === x && boardCell.y === y)) {
         positions.push({x, y});
      }
   }
   for (let pos of positions) {
      const {x, y} = pos;
      boardContent[y][x].mine = true;
   }
   hasBombs = true;
}

function randomPositions() {
   return {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize),
   }
}

function openCell(boardCell) {
   if (boardCell.mine) {
      openMines();
      checkEnd(true);
      return;
   }
   openedCellsCount++;
   let cellsAround = getCellsAround(boardCell);
   let minesAround = cellsAround.filter(cell => cell.mine).length;
   if (!minesAround) {
      let emptyCells = new Array().concat(cellsAround);
      changeCellState(boardCell, CELL_STATES.opened);
      while (emptyCells.length) {
         let emptyCell = emptyCells.pop();
         cellsAround = getCellsAround(emptyCell, emptyCells);
         minesAround = cellsAround.filter(cell => cell.mine).length;
         if (emptyCell.state !== CELL_STATES.marked) {
            if (minesAround) {
               changeCellState(emptyCell, CELL_STATES.opened);
               openedCellsCount++;
               emptyCell.element.textContent = minesAround;
               boardContent[emptyCell.y][emptyCell.x].minesAround = minesAround;
               emptyCell.element.dataset['minesAround'] = minesAround;
            }
            else {
               changeCellState(emptyCell, CELL_STATES.opened);
               openedCellsCount++;
               emptyCells = emptyCells.concat(cellsAround);
            }
         }
      }
   }
   else {
      changeCellState(boardCell, CELL_STATES.opened);
      boardCell.element.textContent = minesAround;
      boardContent[boardCell.y][boardCell.x].minesAround = minesAround;
      boardCell.element.dataset['minesAround'] = minesAround;
   }
}

function getCellsAround(boardCell, emptyCells = []) {
   let cellsAround = [];
   const {x, y} = boardCell;
   for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
         if (boardContent[y + i]?.[x + j] && !(i == 0 && j == 0) && boardContent[y + i][x + j].state !== CELL_STATES.opened && !emptyCells.includes(boardContent[y + i][x + j])) {
            cellsAround.push(boardContent[y + i][x + j]);
         }
      }
   }
   return cellsAround;
}

function markCell(boardCell) {
   if (!(boardCell.state === CELL_STATES.marked)) {
      changeCellState(boardCell, CELL_STATES.marked);
      flagsCounter.textContent = --flagsCount;
   }
   else {
      changeCellState(boardCell, CELL_STATES.closed);
      flagsCounter.textContent = ++flagsCount;
   }
}

function openMines() {
   for (let row of boardContent) {
      for (let cell of row) {
         if (cell.mine) {
            changeCellState(cell, CELL_STATES.mine);
         }
      }
   }
}

function checkEnd(isMine) {
   if (isMine) {
      board.removeEventListener('click', leftCellListener);
      board.removeEventListener('contextmenu', rightCellListener);
      stopTimer();
      resetBtn.setAttribute('src', './assets/images/sad-icon.png');
      gameMessage.textContent = 'You lose (-_-) Try again';
      isEnd = true;
   }
   else {
      board.removeEventListener('click', leftCellListener);
      board.removeEventListener('contextmenu', rightCellListener);
      stopTimer();
      openMines();
      gameMessage.textContent = 'Hooray! You win. Try again';
      addToResults(timerTime, stepsCount);
   }
}