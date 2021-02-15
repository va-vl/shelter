const WIDTH_DESKTOP = 1280;
const WIDTH_TABLET = 768;
const CARD_HEIGHT = document.querySelector(".card").getBoundingClientRect().height;
const OFFSET_DESKTOP = (CARD_HEIGHT + 30) * 2;
const OFFSET_TABLET = (CARD_HEIGHT + 30) * 3;
const MAX_PAGES_DESKTOP = 6;
const MAX_PAGES_TABLET = 8;
const MAX_PAGES_MOBILE = 16;

const pagElem = document.body.querySelector(".pagination");
const pageCounterElem = pagElem.querySelector(".pagination__counter");
const pagButtons = pagElem.querySelectorAll(".pagination__button");
const [ fastBackward, backward, forward, fastForward ] = pagButtons;

let maxPages = MAX_PAGES_DESKTOP;
let moveOffset = OFFSET_DESKTOP;
let pageCounter = 1;
let lastWidthPag = window.innerWidth;

function move(mode) {
  switch (mode) {
    case "fast-forward":
      slideshowList.style.bottom = `${moveOffset * (maxPages - 1)}px`;
      pageCounter = maxPages;
      break;
    case "forward":
      slideshowList.style.bottom = `${moveOffset * pageCounter}px`;
      pageCounter += 1;
      break;
    case "backward":
      slideshowList.style.bottom = `${moveOffset * (pageCounter - 2)}px`;
      pageCounter -= 1;
      break;
    case "fast-backward":
      slideshowList.style.bottom = `0px`;
      pageCounter = 1;
      break;
    case "to":
      slideshowList.style.bottom = `${moveOffset * (pageCounter - 1)}px`;
      break;
  }
}

function refreshPagElem() {
  if (pageCounter === 1) {
    pagButtons.forEach((button, index) => { button.disabled = index < 2; })
  } else if (pageCounter === maxPages) {
    pagButtons.forEach((button, index) => { button.disabled = index >= 2; })
  } else {
    pagButtons.forEach((button) => { button.disabled = false;});
  }

  pageCounterElem.textContent = pageCounter;
}

function updateFlags(oldMaxPages, newMaxPages, newMoveOffset) {
  pageCounter = getProportion(pageCounter, oldMaxPages, newMaxPages);
  maxPages = newMaxPages;
  moveOffset = newMoveOffset;
}

window.addEventListener("load", () => {
  let w = window.innerWidth;

  if (w >= WIDTH_DESKTOP) {
    maxPages = MAX_PAGES_DESKTOP;
    moveOffset = OFFSET_DESKTOP;
  } else if (w >= WIDTH_TABLET && w < WIDTH_DESKTOP) {
    maxPages = MAX_PAGES_TABLET;
    moveOffset = OFFSET_TABLET;
  } else {
    maxPages = MAX_PAGES_MOBILE;
    moveOffset = OFFSET_TABLET;
  }

  lastWidthPag = w;
});

window.addEventListener("resize", async () => {
  let w = window.innerWidth;

  if (lastWidthPag >= WIDTH_DESKTOP) {
    if (w >= WIDTH_TABLET && w < WIDTH_DESKTOP) {
      updateFlags(MAX_PAGES_DESKTOP, MAX_PAGES_TABLET, OFFSET_TABLET);
    } else if (w < WIDTH_TABLET) {
      updateFlags(MAX_PAGES_DESKTOP, MAX_PAGES_MOBILE, OFFSET_TABLET);
    }
  }

  if (lastWidthPag >= WIDTH_TABLET && lastWidthPag < WIDTH_DESKTOP) {
    if (w >= WIDTH_DESKTOP) {
      updateFlags(MAX_PAGES_TABLET, MAX_PAGES_DESKTOP, OFFSET_DESKTOP);
    } else if (w < WIDTH_TABLET) {
      updateFlags(MAX_PAGES_TABLET, MAX_PAGES_MOBILE, OFFSET_TABLET);
    }
  }

  if (lastWidthPag < WIDTH_TABLET) {
    if (w >= WIDTH_DESKTOP) {
      updateFlags(MAX_PAGES_MOBILE, MAX_PAGES_DESKTOP, OFFSET_DESKTOP);
    } else if (w >= WIDTH_TABLET && w < WIDTH_DESKTOP) {
      updateFlags(MAX_PAGES_MOBILE, MAX_PAGES_TABLET, OFFSET_TABLET);
    }
  }

  await playAnimationOnce(slideshowList, 'fade 200ms ease forwards');
  console.log('asdf');

  move("to");

  refreshPagElem();
  lastWidthPag = w;
});

pagButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    await playAnimationOnce(slideshowList, 'fade 200ms ease forwards');
    console.log('asdf');

    move(button.dataset.direction);

    refreshPagElem();
  });
})
