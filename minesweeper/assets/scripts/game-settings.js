let boardSize, minesNumber;

function makeDefaultSettings() {
  if (localStorage.getItem('boardInfo')) {
    let boardInfo = JSON.parse(localStorage.getItem('boardInfo'));
    ({ boardSize, minesNumber } = boardInfo);
    localStorage.setItem('gameSettings', JSON.stringify({
      boardSize,
      minesNumber,
    }))
  }
  else if (localStorage.getItem('gameSettings')) {
    let settings = JSON.parse(localStorage.getItem('gameSettings'));
    ({ boardSize, minesNumber } = settings);
  }
  else {
    boardSize = 10;
    minesNumber = 10;
    localStorage.setItem('gameSettings', JSON.stringify({
      boardSize,
      minesNumber,
    }));
  }
}

export { boardSize, minesNumber, makeDefaultSettings }