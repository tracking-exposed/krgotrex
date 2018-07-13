function evaluateWebsite(event) {
  if (event) {
    console.log(event);
  }
}

const cta = document.getElementById('hero-cta');
cta.addEventListener('click', (event) => {
  evaluateWebsite(event);
});
