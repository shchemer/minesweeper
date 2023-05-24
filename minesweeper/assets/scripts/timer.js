let timer = document.createElement('span');
let timerTime = 0;
let timerId;

function runTimer() {
  timer.textContent = timerTime;
  timerId = setInterval(() => {
    timerTime++;
    if (timerTime === 999) stopTimer();
    timer.textContent = timerTime;
  }, 1000)
}

function stopTimer() {
  clearInterval(timerId);
}

function setTimerTime(newTime) {
  timerTime = newTime;
}

function clearTimer() {
  timerTime = 0;
}

export {timer, timerTime, runTimer, stopTimer, setTimerTime, clearTimer}