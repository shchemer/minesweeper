import { createTheme } from './theme.js';
import { timer, timerTime, stopTimer, clearTimer } from './timer.js';
import { clearLSCopy } from './ls-copy.js';
import { createVolumeSwitcher } from './sound.js';

let wrapper, flagsCounter, stepsCounter, resetBtn, gameMessage;

function createHeaderStats(createBoard) {
  wrapper = document.createElement('div');
  wrapper.className = 'wrapper';
  document.body.append(wrapper);

  let headerItem = document.createElement('header');
  headerItem.className = 'header';
  wrapper.append(headerItem);
  let headerTitle = document.createElement('h1');
  let headerNav = document.createElement('nav');
  let headerResults = document.createElement('span');
  headerNav.className = 'header__nav';
  headerTitle.className = 'header__title';
  headerResults.className = 'header__results';
  headerTitle.textContent = 'Minesweeper';
  headerResults.textContent = 'Results';
  headerItem.append(headerTitle, headerNav);
  headerNav.append(headerResults, createVolumeSwitcher(), createTheme());

  let gameStats = document.createElement('div');
  gameStats.className = 'game-stats';
  wrapper.append(gameStats);

  timer.className = 'timer';
  timer.textContent = timerTime;
  gameStats.append(timer);

  let gameStatsWrap = document.createElement('div');
  gameStatsWrap.className = 'game-stats__wrap';
  gameStats.append(gameStatsWrap);

  stepsCounter = document.createElement('span');
  resetBtn = document.createElement('img');
  flagsCounter = document.createElement('span');
  
  stepsCounter.className = 'game-stats__item steps-counter';
  stepsCounter.textContent = 0;
  resetBtn.className = 'game-stats__item btn-reset'
  resetBtn.setAttribute('src', './assets/images/smile-icon.png');
  flagsCounter.className = 'game-stats__item flags-counter';

  gameStatsWrap.append(stepsCounter, resetBtn, flagsCounter);

  gameMessage = document.createElement('p');
  gameMessage.className = 'game-message';
  gameStats.append(gameMessage);

  resetBtn.addEventListener('click', () => {
    let { boardSize, minesNumber } = JSON.parse(localStorage.getItem('gameSettings'));
    stopTimer();
    clearTimer();
    clearLSCopy();
    stepsCounter.textContent = 0;
    resetBtn.setAttribute('src', './assets/images/smile-icon.png');
    flagsCounter.textContent = minesNumber;
    gameMessage.textContent = '';
    createBoard(boardSize, minesNumber, createBoard);
  })

  headerResults.addEventListener('click', () => {
    let results = JSON.parse(localStorage.getItem('results'));
    results = results ? results : [];
    let result = document.createElement('div');
    let resultWrap = document.createElement('div');
    let resultTitle = document.createElement('h2');
    let resultList = document.createElement('ol');
    let listItem = document.createElement('li');
    let itemNumber = document.createElement('span');
    let itemTime = document.createElement('span'); 
    let itemSteps = document.createElement('span'); 
    result.className = 'result';
    resultWrap.className = 'result__wrap';
    resultTitle.className = 'result__title';
    resultList.className = 'result__list';
    resultTitle.textContent = 'Last 10 results:';
    listItem.className = 'result__item';
    itemNumber.className = 'result__elem result__elem_number'
    itemTime.className = 'result__elem';
    itemTime.textContent = 'Time';
    itemSteps.className = 'result__elem';
    itemSteps.textContent = 'Steps';
    wrapper.prepend(result);
    result.prepend(resultWrap);
    resultWrap.append(resultTitle);
    resultWrap.append(resultList);
    resultList.append(listItem);
    listItem.append(itemNumber, itemTime, itemSteps);
    for (let i = 0; i < results.length; i++) {
      listItem = document.createElement('li');
      itemNumber = document.createElement('span');
      itemTime = document.createElement('span'); 
      itemSteps = document.createElement('span'); 
      listItem.className = 'result__item';
      itemNumber.className = 'result__elem result__elem_number'
      itemTime.className = 'result__elem';
      itemSteps.className = 'result__elem';
      itemNumber.textContent = `${i + 1}.`;
      itemTime.textContent = results[i].timerTime;
      itemSteps.textContent = results[i].stepsCount;
      resultList.append(listItem);
      listItem.append(itemNumber, itemTime, itemSteps);
    }

    result.classList.add('result-appearance');
    document.body.style.overflow = 'hidden';

    result.addEventListener('click', () => {
      result.classList.add('reverse-animation');
      result.classList.add('result-appearance');
    })

    result.addEventListener('animationend', () => {
      result.classList.remove('result-appearance');
      if (result.classList.contains('reverse-animation')) {
        result.remove();
        document.body.style.overflow = 'visible';
      }
    })
  })
}

function createSettings() {
  let gameSettings = document.createElement('div');
  gameSettings.className = 'game-settings';
  wrapper.append(gameSettings);
  let gameSettingsTitle = document.createElement('h2');
  gameSettingsTitle.className = 'game-settings__title';
  gameSettingsTitle.textContent = 'Game settings:';
  gameSettings.append(gameSettingsTitle);
  
  let gameSettingsWrap = document.createElement('div');
  gameSettingsWrap.className = 'game-settings__wrap';
  gameSettings.append(gameSettingsWrap);

  let settings = JSON.parse(localStorage.getItem('gameSettings'));

  let gameSettingsSize = document.createElement('div');
  let gameSettingsMines = document.createElement('div');
  gameSettingsSize.className = 'game-settings__size';
  gameSettingsMines.className = 'game-settings__mines';
  gameSettingsWrap.append(gameSettingsSize, gameSettingsMines);

  let boardSizeTitle = document.createElement('h2');
  boardSizeTitle.className = 'board-size-title';
  boardSizeTitle.textContent = 'Board size -';
  gameSettingsSize.append(boardSizeTitle);

  let levels = document.createElement('select');
  levels.className = 'levels';
  gameSettingsSize.append(levels);
  let gameLevels = [10, 15, 25];
  for (let gameLevel of gameLevels) {
    let level = document.createElement('option');
    level.className = 'level';
    if (gameLevel === settings.boardSize) level.setAttribute('selected', true);
    level.setAttribute('value', gameLevel);
    level.textContent = `${gameLevel} x ${gameLevel}`;
    levels.append(level);
  }

  let minesTitle = document.createElement('h2');
  minesTitle.className = 'mines-title';
  minesTitle.textContent = 'Mines -';
  gameSettingsMines.append(minesTitle);

  let minesCounter = document.createElement('p');
  minesCounter.className = 'mines-counter';
  minesCounter.textContent = settings.minesNumber;
  gameSettingsMines.append(minesCounter);
  let minesRange = document.createElement('input');
  minesRange.className = 'mines-range';
  minesRange.setAttribute('type', 'range');
  minesRange.setAttribute('min', 10);
  minesRange.setAttribute('max', 99);
  minesRange.setAttribute('value', settings.minesNumber);
  gameSettingsMines.append(minesRange);

  levels.addEventListener('change', () => {
    localStorage.setItem('gameSettings', JSON.stringify({
      boardSize: parseInt(levels.value),
      minesNumber: parseInt(minesRange.value),
    }));
  });

  minesRange.addEventListener('input', () => {
    minesCounter.textContent = minesRange.value;
  })

  minesRange.addEventListener('change', () => {
    localStorage.setItem('gameSettings', JSON.stringify({
      boardSize: parseInt(levels.value),
      minesNumber: parseInt(minesRange.value),
    }));
  })
}

export { wrapper, flagsCounter, stepsCounter, resetBtn, gameMessage, createHeaderStats, createSettings }