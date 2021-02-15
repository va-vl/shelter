try {
  const body = document.querySelector(".no-js");
  body.classList.remove("no-js");
} catch (err) {
  alert(`Error! ${err.message}`);
}
