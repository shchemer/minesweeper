import { makeDefaultSettings, boardSize, minesNumber } from './assets/scripts/game-settings.js';
import { createHeaderStats, createSettings } from './assets/scripts/game-interface.js';
import { createBoard } from './assets/scripts/minesweeper.js';

makeDefaultSettings();
createHeaderStats(createBoard);
createBoard(boardSize, minesNumber);
createSettings();