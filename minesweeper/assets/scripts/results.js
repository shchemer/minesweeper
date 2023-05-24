function addToResults(timerTime, stepsCount) {
  if (!localStorage.getItem('results')) {
    localStorage.setItem('results', JSON.stringify([{timerTime, stepsCount}]));
  }
  else {
    let results = JSON.parse(localStorage.getItem('results'));
    if (results.length < 10) {
      results.push({timerTime, stepsCount});
    }
    else {
      results = results.slice(1);
      results.push({timerTime, stepsCount});
    }
    localStorage.setItem('results', JSON.stringify(results));
  }
}

export { addToResults }