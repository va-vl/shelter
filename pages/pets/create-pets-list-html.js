const CARDS_PER_SCREEN = 6;
const PASS_TARGET = 6;
const TAGS_AMOUNT = 8;
const TAGS = [
  'Katrine-Cat',
  'Jennifer-Dog',
  'Woody-Dog',
  'Sophia-Dog',
  'Timmy-Cat',
  'Charly-Dog',
  'Scarlett-Dog',
  'Freddie-Cat',
];

const slideshowList = document.body.querySelector('.slideshow__list');
const tempTags = new Set();
const forbiddenTags = [];
const resultTags = [];
let passCounter = 0;

while (passCounter < PASS_TARGET) {
  const forbiddenAmount = (TAGS_AMOUNT * passCounter) % CARDS_PER_SCREEN;
  let i = resultTags.length - forbiddenAmount;

  for (; i < resultTags.length; i += 1) {
    forbiddenTags.push(resultTags[i]);
  }

  while (tempTags.size < TAGS_AMOUNT) {
    const getFillCondition = () =>
      forbiddenTags.includes(tag) && tempTags.size < CARDS_PER_SCREEN - forbiddenAmount;
    let tag;

    do {
      tag = TAGS[(Math.random() * TAGS_AMOUNT) | 0];
    } while (getFillCondition());

    tempTags.add(tag);
  }

  tempTags.forEach((tag) => {
    resultTags.push(tag);
  });
  tempTags.clear();
  forbiddenTags.length = 0;
  passCounter += 1;
}

slideshowList.innerHTML = resultTags.reduce(
  (acc, tag) => `${acc}${createCardHTML(parseTag(tag))}`,
  '',
);
