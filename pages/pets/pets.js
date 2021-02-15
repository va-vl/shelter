const pagElem = document.body.querySelector(".pagination");
const pageCounterElem = pagElem.querySelector(".pagination__counter");
const pagButtons = pagElem.querySelectorAll(".pagination__button");
const [fastBackward, backward, forward, fastForward] = pagButtons;

const cardHeight = document.querySelector(".card").getBoundingClientRect()
  .height;

const widthDesktop = 1280;
const widthTablet = 768;
const widthMobile = 0;

const offsetDesktop = (cardHeight + 30) * 2;
const offsetTablet = (cardHeight + 30) * 3;
const offsetMobile = (cardHeight + 30) * 3;

const maxPagesDesktop = 6;
const maxPagesTablet = 8;
const maxPagesMobile = 16;

let pageCounter = 1;
let maxPages = maxPagesDesktop;
let moveOffset = offsetDesktop;

let lastWidthPag = window.innerWidth;

function move(mode) {
  switch (mode) {
    case "fast-forward":
      slideshowList.style.bottom = `${moveOffset * (maxPages - 1)}px`;
      pageCounter = maxPages;
      break;
    case "forward":
      slideshowList.style.bottom = `${moveOffset * pageCounter}px`;
      pageCounter++;
      break;
    case "backward":
      slideshowList.style.bottom = `${moveOffset * (pageCounter - 2)}px`;
      pageCounter--;
      break;
    case "fast-backward":
      slideshowList.style.bottom = `0px`;
      pageCounter = 1;
      break;
    case "to":
      slideshowList.style.bottom = `${moveOffset * (pageCounter - 1)}px`;
      break;
    default:
      console.log("Error: no move mode provided");
      break;
  }
}

function refreshPagElem() {
  if (pageCounter === 1) {
    fastBackward.disabled = true;
    backward.disabled = true;
    forward.disabled = false;
    fastForward.disabled = false;
  } else if (pageCounter === maxPages) {
    fastBackward.disabled = false;
    backward.disabled = false;
    forward.disabled = true;
    fastForward.disabled = true;
  } else {
    fastBackward.disabled = false;
    backward.disabled = false;
    forward.disabled = false;
    fastForward.disabled = false;
  }
  pageCounterElem.textContent = pageCounter;
}

function updateFlags(oldMaxPages, newMaxPages, newMoveOffset) {
  pageCounter = proportion(pageCounter, oldMaxPages, newMaxPages);
  maxPages = newMaxPages;
  moveOffset = newMoveOffset;
}

window.addEventListener("load", function (event) {
  let w = window.innerWidth;
  if (w >= widthDesktop) {
    maxPages = maxPagesDesktop;
    moveOffset = offsetDesktop;
  } else if (w >= widthTablet && w < widthDesktop) {
    maxPages = maxPagesTablet;
    moveOffset = offsetTablet;
  } else if (w < widthTablet) {
    maxPages = maxPagesMobile;
    moveOffset = offsetTablet;
  }
  lastWidthPag = w;
});

window.addEventListener("resize", function (event) {
  let w = window.innerWidth;

  if (lastWidthPag >= widthDesktop) {
    if (w >= widthTablet && w < widthDesktop) {
      updateFlags(maxPagesDesktop, maxPagesTablet, offsetTablet);
      move("to");
      refreshPagElem();
    } else if (w < widthTablet) {
      updateFlags(maxPagesDesktop, maxPagesMobile, offsetMobile);
      move("to");
      refreshPagElem();
    }
  }
  if (lastWidthPag >= widthTablet && lastWidthPag < widthDesktop) {
    if (w >= widthDesktop) {
      updateFlags(maxPagesTablet, maxPagesDesktop, offsetDesktop);
      move("to");
      refreshPagElem();
    } else if (w < widthTablet) {
      updateFlags(maxPagesTablet, maxPagesMobile, offsetMobile);
      move("to");
      refreshPagElem();
    }
  }
  if (lastWidthPag < widthTablet) {
    if (w >= widthDesktop) {
      updateFlags(maxPagesMobile, maxPagesDesktop, offsetDesktop);
      move("to");
      refreshPagElem();
    } else if (w >= widthTablet && w < widthDesktop) {
      updateFlags(maxPagesMobile, maxPagesTablet, offsetTablet);
      move("to");
      refreshPagElem();
    }
  }

  lastWidthPag = w;
});

for (let button of pagButtons) {
  button.addEventListener("click", function () {
    move(button.dataset.direction);
    refreshPagElem();
  });
}
