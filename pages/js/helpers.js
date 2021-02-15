const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
let lastWidth = window.innerWidth;

function playAnimationOnce(elem, animStr) {
  return new Promise((resolve) => {
    function callback() {
      elem.removeEventListener("animationend", callback);
      resolve();
    }
    elem.addEventListener("animationend", callback);
    elem.style.animation = animStr;
  });
}

function playTransitionOnce(elem, style) {
  return new Promise((resolve) => {
    function callback() {
      elem.removeEventListener("transitionend", callback);
      resolve();
    }
    elem.addEventListener("transitionend", callback);
    elem.style = style;
  });
}

function cleanStyle(...elems) {
  for (let elem of elems) elem.style = "";
}

function createCardHTML(name, type) {
  return `
  <li class="slideshow__card card" data-name="${name}" data-type="${type}">
    <picture>
      <source srcset="./../../assets/pets-${name.toLowerCase()}.webp" type="image/webp">
      <img class="card__image" src="./../../assets/pets-${name.toLowerCase()}.jpg" width="270" alt="${name} the ${type}">
    </picture>
    <p class="card__heading heading heading--card">
      ${name}
    </p>
    <button class="card__button button button--hollow">Learn more</button>
  </li>`;
}

function createCardListHTML(arr) {
  let ul = document.createElement("ul");
  ul.classList.add("slideshow__list");

  for (let { name, type } of arr) ul.innerHTML += createCardHTML(name, type);
  return ul;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function proportion(a1, b1, b2) {
  return Math.round((a1 * b2) / b1);
}
