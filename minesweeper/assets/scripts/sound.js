let audio = new Audio();
let gameSounds = {
  open: './assets/sounds/open-sound.wav',
  mark: './assets/sounds/mark-sound.wav',
  win: './assets/sounds/win-sound.wav',
  lose: './assets/sounds/lose-sound.wav',
}

function openSound() {
  audio.src = gameSounds.open;
  playAudio();
}

function markSound() {
  audio.src = gameSounds.mark;
  playAudio();
}

function winSound() {
  audio.src = gameSounds.win;
  playAudio();
}

function loseSound() {
  audio.src = gameSounds.lose;
  playAudio();
}

function playAudio() {
  audio.addEventListener('canplaythrough', () => {
    audio.play();
  })
}

function createVolumeSwitcher() {
  let volumeSwitcher = document.createElement('div');
  volumeSwitcher.className = 'volume-switcher volume-switcher_on';

  volumeSwitcher.addEventListener('click', () => {
    if (volumeSwitcher.classList.contains('volume-switcher_on')) {
      volumeSwitcher.classList.remove('volume-switcher_on');
      volumeSwitcher.classList.add('volume-switcher_off');
      audio.volume = 0;
    }
    else {
      volumeSwitcher.classList.remove('volume-switcher_off');
      volumeSwitcher.classList.add('volume-switcher_on');
      audio.volume = 1;
    }
  })

  return volumeSwitcher;
}

export { openSound, markSound, winSound, loseSound, createVolumeSwitcher }