export function createTheme() {
  let theme = document.createElement('div');
  let themeWrapper = document.createElement('div');
  let themeModeDark = document.createElement('div');
  let themeModeLight = document.createElement('div');
  let darkIcon = document.createElement('img');
  let lightIcon = document.createElement('img');

  if (localStorage.getItem('theme')) {
    let chosenTheme = localStorage.getItem('theme');
    document.body.className = `theme-${chosenTheme}`;
  }
  else {
    localStorage.setItem('theme', 'light');
    document.body.className = 'theme-light';
  }
  theme.className = 'theme';
  themeWrapper.className = 'theme__wrapper';
  themeModeDark.className = 'theme-mode theme-mode_dark';
  themeModeLight.className = 'theme-mode theme-mode_light';
  darkIcon.setAttribute('src', './assets/images/moon-icon.png');
  darkIcon.setAttribute('alt', 'moon');
  lightIcon.setAttribute('src', './assets/images/sun-icon.png');
  lightIcon.setAttribute('alt', 'sun');

  theme.append(themeWrapper);
  themeWrapper.append(themeModeDark, themeModeLight);
  themeModeDark.append(darkIcon);
  themeModeLight.append(lightIcon);

  theme.addEventListener('click', () => {
    if (document.body.classList.contains('theme-light')) {
      localStorage.setItem('theme', 'dark');
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    }
    else {
      localStorage.setItem('theme', 'light');
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    }
  })
  return theme;
}