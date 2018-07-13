const urlAnalyzedSitesList = 'https://kreuzberg.google.tracking.exposed/api/v1/sites/krgotrex',
      cta = document.getElementById('hero-cta'),
      btnFetch = document.getElementById('btn-fetch');

function evaluateWebsite(event) {
  if (event) {
    console.log(event.target.value);
  }
}

async function getAnalyzedData() {
  const res = await fetch(urlAnalyzedSitesList);
  let data = res ? res.json() : null;

  if (data) {
    console.log(data);
  }
}

cta.addEventListener('click', (event) => evaluateWebsite(event));
btnFetch.addEventListener('click', () => getAnalyzedData());
