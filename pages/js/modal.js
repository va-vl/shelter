let modalElem, buttonElem;

const closeModal = () => {
  document.getElementById('modal').remove();
  cleanStyle(document.body, headerMenuWrapper);
  modalElem = null;
  buttonElem = null;
};

document.body.addEventListener('click', async (event) => {
  if (!event.target.closest('.card')) {
    return;
  }

  const modalHTML = await fetch(JSON_URL)
    .then((res) => res.json())
    .then((res) => res.find((obj) => obj.name === event.target.closest('.card').dataset.name))
    .then((str) => createModalHTML(str));

  document.body.style = `margin-right: ${SCROLL_BAR_WIDTH}px; overflow-y: hidden;`;

  if (header.classList.contains('page-header--pets')) {
    headerMenuWrapper.style = `margin-right: ${SCROLL_BAR_WIDTH}px;`;
  }

  document.body.insertAdjacentHTML('beforeend', modalHTML);
});

document.addEventListener('keydown', (event) => {
  if (modalElem && event.key === 'Escape') {
    closeModal();
  }
});
