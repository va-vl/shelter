try {
  const body = document.querySelector('.no-js');
  body.classList.remove('no-js');
} catch (err) {
  console.log(`Error! ${err.message}`);
}
