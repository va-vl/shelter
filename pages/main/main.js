const slideshowWrapper = document.querySelector(".slideshow__wrapper");
const slideshowButtons = document.querySelectorAll(".slideshow__button");
let currentSlide = document.querySelector(".slideshow__list");

for (let button of slideshowButtons) {
  button.addEventListener("click", async (event) => {
    await move(button);
    button.blur();
  });
}

async function move(elem) {
  if (isMoving) return;
  isMoving = true;

  const isNext = elem.classList.contains("slideshow__button--next");
  const direction = isNext ? "afterbegin" : "beforeend";
  const width = currentSlide.offsetWidth;

  const newSlide = await createNewSlide("./../../assets/pets.json");
  newSlide.style = `left: ${isNext ? -width : width}px`;
  slideshowWrapper.insertAdjacentElement(direction, newSlide);

  await new Promise((resolve) => setTimeout(resolve, 50));

  if (isNext) {
    await Promise.all([
      playTransitionOnce(currentSlide, `left: ${width}px`),
      playTransitionOnce(newSlide, `left: 0px`),
    ]);
  } else {
    await Promise.all([
      playTransitionOnce(currentSlide, `left: ${-width}px`),
      playTransitionOnce(newSlide, `left: 0px`),
    ]);
  }

  currentSlide.remove();
  currentSlide = newSlide;
  cleanStyle(currentSlide);
  isMoving = false;
}

async function createNewSlide(url) {
  let currentTags = [...currentSlide.children].map(
    (card) => card.dataset.name + "-" + card.dataset.type
  );
  let allTags = await fetch(url)
    .then((res) => res.json())
    .then((res) => {
      return res.map((card) => card.name + "-" + card.type);
    });

  let newTags = shuffle(
    allTags.filter((tag) => !currentTags.includes(tag))
  ).slice(0, 3);

  let newItemsStr = [...newTags].reduce((acc, tag) => {
    return acc + createCardHTML(...tag.split("-"));
  }, "");

  let newList = document.createElement("ul");
  newList.classList.add("slideshow__list");
  newList.innerHTML = newItemsStr;
  return newList;
}
