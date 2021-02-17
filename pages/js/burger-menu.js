const menuButton = document.getElementById('nav-button');
const header = menuButton.closest('.page-header');
const headerMenuWrapper = header.querySelector('.page-header__menu-wrapper');
const headerWrapper = header.querySelector('.page-header__wrapper');
const scrollLink = header.querySelector('.link__header--active');

let lastWidth = window.innerWidth;

async function openMenu() {
  if (!isMoving && !header.classList.contains('page-header--menu-open')) {
    isMoving = true;

    document.body.style = `margin-right: ${SCROLL_BAR_WIDTH}px; overflow-y: hidden;`;
    if (header.classList.contains('page-header--pets')) {
      headerMenuWrapper.style = `margin-right: ${SCROLL_BAR_WIDTH}px;`;
    }

    await playAnimationOnce(menuButton, 'turn 200ms ease 100ms forwards');

    header.classList.add('page-header--menu-open');
    await playAnimationOnce(headerMenuWrapper, 'fade 200ms ease forwards');
    await playAnimationOnce(headerWrapper, 'slideBurgerMenu 600ms ease forwards');

    cleanStyle(menuButton, headerMenuWrapper, headerWrapper);
    isMoving = false;
  }
}

async function closeMenu() {
  if (!isMoving && header.classList.contains('page-header--menu-open')) {
    isMoving = true;

    await Promise.all([
      playAnimationOnce(menuButton, 'turn 400ms ease reverse forwards'),
      playAnimationOnce(headerMenuWrapper, 'fade 400ms ease reverse forwards'),
      playAnimationOnce(headerWrapper, 'slideBurgerMenu 400ms ease reverse forwards'),
    ]);

    header.classList.remove('page-header--menu-open');
    cleanStyle(document.body, menuButton, headerMenuWrapper, headerWrapper);
    isMoving = false;
  }
}

document.addEventListener('click', (event) => {
  if (event.target === headerMenuWrapper || event.target === menuButton) {
    closeMenu();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeMenu();
  }
});

menuButton.addEventListener('click', openMenu);

scrollLink.addEventListener('click', () => {
  window.scrollTo(0, 0);
  closeMenu();
});

window.addEventListener('resize', () => {
  let currentWidth = window.innerWidth;

  if (currentWidth > lastWidth && header.classList.contains('page-header--menu-open')) {
    header.classList.remove('page-header--menu-open');
    cleanStyle(document.body);
  }

  lastWidth = currentWidth;
});
