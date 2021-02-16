const HOST = document.body.querySelector('.slideshow');
const WRAPPER = HOST.querySelector('.slideshow__wrapper');
const BUTTONS = [...HOST.querySelectorAll('.slideshow__button')];
let currentSlide = HOST.querySelector('.slideshow__list');

HOST.addEventListener('click', (event) => {
  const t = event.target.closest('.slideshow__button');

  if (BUTTONS.includes(t) && !isMoving) {
    t.blur();
    move(t);
  }
});

const move = async (button) => {
  isMoving = true;

  const isNext = button.classList.contains('slideshow__button--next');
  const direction = isNext ? 'afterbegin' : 'beforeend';
  const newSlide = await createNewSlide();

  newSlide.style = `left: ${isNext ? -100 : 100}%`;
  WRAPPER.insertAdjacentElement(direction, newSlide);

  await new Promise((resolve) => setTimeout(resolve, 50)).then(() =>
    Promise.all([
      playTransitionOnce(currentSlide, `left: ${isNext ? 100 : -100}%`),
      playTransitionOnce(newSlide, `left: 0px`),
    ]),
  );

  currentSlide.remove();
  currentSlide = newSlide;
  cleanStyle(currentSlide);

  isMoving = false;
};

const createNewSlide = async () => {
  const currentTags = [...currentSlide.children].map((card) => getTag(card.dataset));
  const newConfigs = await fetch(JSON_URL)
    .then((res) => res.json())
    .then((res) => res.map(getTag).filter((str) => !currentTags.includes(str)))
    .then((res) => shuffle(res).slice(0, 3).map(parseTag));

  const ul = document.createElement('ul');
  ul.classList.add('slideshow__list');
  ul.innerHTML = newConfigs.reduce((acc, i) => `${acc}${createCardHTML(i)}`, '');

  return ul;
};
