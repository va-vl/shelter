let modalElem, buttonElem;

async function createModalHTML(choice) {
  let json = await fetch("./../../assets/pets.json").then((res) => res.json());
  let {
    name,
    img,
    type,
    breed,
    description,
    age,
    inoculations,
    diseases,
    parasites,
  } = json.find((obj) => obj.name === choice);

  return `
  <div class="modal">
    <article class="modal__item">
      <button class="modal__button button button--hollow">
        <svg class="modal__button-icon" width="12" height="12">
          <use href="./../../assets/icons/misc.svg#cancel"></use>
        </svg>
      </button>
      <picture class="modal__picture">
        <source srcset="${img.replace(".jpg", ".webp")}" type="image/webp">
        <img class="modal__image" src="${img}" alt="${name} the ${type.toLowerCase()}" width="500">
      </picture>
      <div class="modal__text-wrapper">
        <h3 class="modal__heading heading heading--h3-modal heading--modal">${name}</h3>
        <h4 class="modal__subheading heading heading--h4-modal heading--modal">${type} - ${breed}</h4>
        <p class="modal__text text--modal">${description}</p>
        <ul class="modal__list">
          <li class="modal__list-item heading heading--h5 heading--modal">
            <span class="heading--bold">Age:</span> ${age}
          </li>
          <li class="modal__list-item heading heading--h5 heading--modal">
            <span class="heading--bold">Inoculations:</span> ${inoculations.join(
              ", "
            )}
          </li>
          <li class="modal__list-item heading heading--h5 heading--modal">
            <span class="heading--bold">Diseases:</span> ${diseases.join(", ")}
          </li>
          <li class="modal__list-item heading heading--h5 heading--modal">
            <span class="heading--bold">Parasites:</span> ${parasites.join(
              ", "
            )}
          </li>
        </ul>
      </div>
    </article>
  </div>
  `;
}

function checkInitialHover(event) {
  let article = modalElem.querySelector(".modal__item");
  let articleTop = article.getBoundingClientRect().top;
  let articleBottom = article.getBoundingClientRect().bottom;
  let articleLeft = article.getBoundingClientRect().left;
  let articleRight = article.getBoundingClientRect().right;
  let clickY = event.clientY;
  let clickX = event.clientX - scrollBarWidth;

  if (
    clickY < articleTop ||
    clickY > articleBottom ||
    clickX < articleLeft ||
    clickX > articleRight
  ) {
    buttonElem.classList.add("button--hover");
  }
}

function trackMouseover(event) {
  if (
    event.target === this &&
    !buttonElem.classList.contains("button--hover")
  ) {
    buttonElem.classList.add("button--hover");
  } else if (
    event.target !== this &&
    event.relatedTarget === this &&
    buttonElem.classList.contains("button--hover")
  ) {
    buttonElem.classList.remove("button--hover");
  }
}

function closeModal() {
  document.body.querySelector(".modal").remove();
  cleanStyle(document.body, headerMenuWrapper);
  modalElem = null;
  buttonElem = null;
}

document.body.addEventListener("click", async function (event) {
  if (!event.target.closest(".card")) return;
  else {
    let choice = event.target.closest(".card").dataset.name;
    let modalHTML = await createModalHTML(choice);

    document.body.style = `margin-right: ${scrollBarWidth}px; overflow-y: hidden;`;
    if (header.classList.contains("page-header--pets")) {
      headerMenuWrapper.style = `margin-right: ${scrollBarWidth}px;`;
    }

    document.body.insertAdjacentHTML("beforeend", modalHTML);
    modalElem = document.querySelector(".modal");
    buttonElem = modalElem.querySelector(".modal__button");
    checkInitialHover(event);

    await new Promise((resolve) => setTimeout(resolve, 50));

    modalElem.addEventListener("mouseover", trackMouseover);
    modalElem.addEventListener("click", function (event) {
      if (event.target === this) closeModal();
    });
    buttonElem.addEventListener("click", closeModal);
    modalElem.classList.add("modal--on");
  }
});

document.addEventListener("keydown", function (event) {
  if (modalElem && buttonElem && event.key === "Escape") closeModal();
});
