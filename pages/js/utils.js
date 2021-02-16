const shuffle = (arr) => {
  const lastIndex = arr.length - 1;

  for (let i = lastIndex; i > 0; i -= 1) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
};

const getProportion = (a1, b1, b2) => Math.round((a1 * b2) / b1);

const getTag = (obj) => `${obj.name}-${obj.type}`;

const parseTag = (tag) => {
  const [name, type] = tag.split('-');
  return { name, type };
};

const createCardHTML = ({ name, type }) => `
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

const createModalHTML = ({
  name,
  img,
  type,
  breed,
  description,
  age,
  inoculations,
  diseases,
  parasites,
}) => `
  <div class="modal modal--on" id="modal">
    <div class="modal__background" onclick="closeModal()"></div>
    <article class="modal__item">
      <button class="modal__button button button--hollow" onclick="closeModal()">
        <svg class="modal__button-icon" width="12" height="12">
          <use href="./../../assets/icons/misc.svg#cancel"></use>
        </svg>
      </button>
      <picture class="modal__picture">
        <source srcset="${img.replace('.jpg', '.webp')}" type="image/webp">
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
            <span class="heading--bold">Inoculations:</span> ${inoculations.join(', ')}
          </li>
          <li class="modal__list-item heading heading--h5 heading--modal">
            <span class="heading--bold">Diseases:</span> ${diseases.join(', ')}
          </li>
          <li class="modal__list-item heading heading--h5 heading--modal">
            <span class="heading--bold">Parasites:</span> ${parasites.join(', ')}
          </li>
        </ul>
      </div>
    </article>
  </div>`;

const playAnimationOnce = (elem, animStr) =>
  new Promise((resolve) => {
    const callback = () => {
      elem.removeEventListener('animationend', callback);
      resolve();
    };

    elem.addEventListener('animationend', callback);
    elem.style.animation = animStr;
  });

const playTransitionOnce = (elem, style) =>
  new Promise((resolve) => {
    const callback = () => {
      elem.removeEventListener('transitionend', callback);
      resolve();
    };

    elem.addEventListener('transitionend', callback);
    elem.style = style;
  });

const cleanStyle = (...elements) =>
  elements.forEach((elem) => {
    elem.style = '';
  });
