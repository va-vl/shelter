const WIDTH_DESKTOP = 1280;
const WIDTH_TABLET = 768;
const CARD_HEIGHT = document.querySelector('.card').getBoundingClientRect().height;
const OFFSET_DESKTOP = (CARD_HEIGHT + 30) * 2;
const OFFSET_TABLET = (CARD_HEIGHT + 30) * 3;
const MAX_PAGES_DESKTOP = 6;
const MAX_PAGES_TABLET = 8;
const MAX_PAGES_MOBILE = 16;

const pagElem = document.body.querySelector('.pagination');
const pageCounterElem = pagElem.querySelector('.pagination__counter');
const pagButtons = pagElem.querySelectorAll('.pagination__button');

let maxPages = MAX_PAGES_DESKTOP;
let moveOffset = OFFSET_DESKTOP;
let pageCounter = 1;
let lastWidthPag = window.innerWidth;

function updatePaginationButtons() {
  if (pageCounter === 1) {
    pagButtons.forEach((button, index) => {
      button.disabled = index < 2;
    });
  } else if (pageCounter === maxPages) {
    pagButtons.forEach((button, index) => {
      button.disabled = index >= 2;
    });
  } else {
    pagButtons.forEach((button) => {
      button.disabled = false;
    });
  }

  pageCounterElem.textContent = pageCounter;
}

const moveParamCreators = {
  'fast-forward': () => [`${moveOffset * (maxPages - 1)}px`, () => maxPages],
  forward: () => [`${moveOffset * pageCounter}px`, (i) => i + 1],
  backward: () => [`${moveOffset * (pageCounter - 2)}px`, (i) => i - 1],
  'fast-backward': () => [`0px`, () => 1],
  to: () => [`${moveOffset * (pageCounter - 1)}px`, (i) => i],
};

const screenModeChangeParamCreators = {
  'desktop-tablet': () => [MAX_PAGES_DESKTOP, MAX_PAGES_TABLET, OFFSET_TABLET],
  'desktop-mobile': () => [MAX_PAGES_DESKTOP, MAX_PAGES_MOBILE, OFFSET_TABLET],
  'tablet-desktop': () => [MAX_PAGES_TABLET, MAX_PAGES_DESKTOP, OFFSET_DESKTOP],
  'tablet-mobile': () => [MAX_PAGES_TABLET, MAX_PAGES_MOBILE, OFFSET_TABLET],
  'mobile-desktop': () => [MAX_PAGES_MOBILE, MAX_PAGES_DESKTOP, OFFSET_DESKTOP],
  'mobile-tablet': () => [MAX_PAGES_MOBILE, MAX_PAGES_TABLET, OFFSET_TABLET],
};

const startScreenModeParamCreators = {
  desktop: () => [MAX_PAGES_DESKTOP, OFFSET_DESKTOP],
  tablet: () => [MAX_PAGES_TABLET, OFFSET_TABLET],
  mobile: () => [MAX_PAGES_MOBILE, OFFSET_TABLET],
};

function move(mode) {
  const [str, func] = moveParamCreators[mode]();

  slideshowList.style.bottom = str;
  pageCounter = func(pageCounter);
}

function updateCardsPerPage(oldMaxPages, newMaxPages, newMoveOffset) {
  pageCounter = getProportion(pageCounter, oldMaxPages, newMaxPages);

  console.log(pageCounter);

  maxPages = newMaxPages;
  moveOffset = newMoveOffset;

  move('to');
  updatePaginationButtons();
}

function getScreenMode(width) {
  if (width >= WIDTH_DESKTOP) {
    return 'desktop';
  } else if (width >= WIDTH_TABLET && width < WIDTH_DESKTOP) {
    return 'tablet';
  } else if (width < WIDTH_TABLET) {
    return 'mobile';
  }
}

window.addEventListener('load', () => {
  let w = window.innerWidth;
  const mode = getScreenMode(w);

  [maxPages, moveOffset] = startScreenModeParamCreators[mode]();
  lastWidthPag = w;
});

window.addEventListener('resize', () => {
  let w = window.innerWidth;
  const oldScreenMode = getScreenMode(lastWidthPag);
  const newScreenMode = getScreenMode(w);

  if (oldScreenMode === newScreenMode) {
    return;
  }

  const tag = `${oldScreenMode}-${newScreenMode}`;
  updateCardsPerPage(...screenModeChangeParamCreators[tag]());
  cleanStyle(slideshowList);
  lastWidthPag = w;
});

pagButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    if (isMoving) {
      return;
    }

    isMoving = true;
    await playAnimationOnce(slideshowList, 'dissolve 200ms');
    cleanStyle(slideshowList);
    move(button.dataset.direction);
    updatePaginationButtons();
    isMoving = false;
  });
});
