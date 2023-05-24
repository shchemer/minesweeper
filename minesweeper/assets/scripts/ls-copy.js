export function makeLSCopy(boardInfo) {
  localStorage.setItem('boardInfo', JSON.stringify(boardInfo));
}

export function getLSCopy() {
  return JSON.parse(localStorage.getItem('boardInfo'));
}

export function clearLSCopy() {
  localStorage.removeItem('boardInfo');
}