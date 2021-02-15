const slideshowList = document.querySelector(".slideshow__list");
const cards = [...slideshowList.children].map((card) => card.cloneNode(true));
const tags = cards.map((card) => card.dataset.name + "-" + card.dataset.type);
const tagsAmount = tags.length;

let resultTags = [];
let tempTags = new Set();
let forbiddenTags = [];
let cardsPerScreen = 6;
let passCounter = 0;
let passTarget = 6;

while (passCounter < passTarget) {
  let forbiddenAmount = (tagsAmount * passCounter) % cardsPerScreen;
  for (
    let i = resultTags.length - forbiddenAmount;
    i < resultTags.length;
    i++
  ) {
    forbiddenTags.push(resultTags[i]);
  }

  while (tempTags.size < tagsAmount) {
    let tag;
    do {
      tag = tags[(Math.random() * tagsAmount) | 0];
    } while (
      forbiddenTags.includes(tag) &&
      tempTags.size < cardsPerScreen - forbiddenAmount
    );
    tempTags.add(tag);
  }
  for (let tag of tempTags) resultTags.push(tag);

  tempTags.clear();
  forbiddenTags.length = 0;
  passCounter++;
}

let resultHTML = resultTags.reduce((acc, tagStr) => {
  return acc + createCardHTML(...tagStr.split("-"));
}, "");

slideshowList.innerHTML = resultHTML;
