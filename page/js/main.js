const https = require("https");
const url = "https://kreuzberg.google.tracking.exposed/api/v1/sites/krgotrex";

const opt = {
    host: url.split(".com/")[0] + ".com",
    path: "/" + url.split(".com/")[1]
};

function callback(response) {
    let str = "";

    response.on("data", function (chunk) {
        str += chunk;
    });

    response.on("end", function () {
        console.log(str);
    });
}

const request = https.request(opt, callback);

request.on("error", function (error) {
    console.error(error);
});
request.end();


const cta = document.getElementById('hero-cta'),
      btnFetch = document.getElementById('btn-fetch');

function evaluateWebsite(event) {
  if (event) {
    console.log(event.target.value);
  }
}

// async function getAnalyzedData() {
//   const res = await fetch(urlAnalyzedSitesList);
//   let data = res ? res.json() : null;

//   if (data) {
//     console.log(data);
//   }
// }

cta.addEventListener('click', (event) => evaluateWebsite(event));
// btnFetch.addEventListener('click', () => getAnalyzedData());
