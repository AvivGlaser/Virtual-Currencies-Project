const DOM = {
  selectedCoinsModal: null,
  parallax: null,
  home: null,
  header: null,
  searchInput: null,
  clearBtn: null,
  content: null,
  navbar: null,
  liveReports: null,
  aboutMe: null,
  alertModal: null,
};

const APIs = {
  cryptoCoins: "https://api.coingecko.com/api/v3/coins/list",
  specificCrypto: "https://api.coingecko.com/api/v3/coins",
};

function init() {
  DOM.parallax = document.querySelector("#parallax");
  DOM.content = document.querySelector("#content");
  DOM.searchInput = document.querySelector("#searchInput");
  DOM.clearBtn = document.querySelector("#clearBtn");
  DOM.selectedCoinsModal = document.querySelector("#selectedCoinsModal");
  DOM.header = document.querySelector("#header");
  DOM.navbar = document.querySelector("#navbar");
  DOM.alertModal = document.querySelector("#alertModal");
  DOM.home = document.querySelector("#home").addEventListener("click", home);
  DOM.liveReports = document
    .querySelector("#liveReports")
    .addEventListener("click", getLiveReports);
  DOM.aboutMe = document
    .querySelector("#aboutMe")
    .addEventListener("click", getAboutMe);
  home();
}
init();

const state = { coins: [], selected: [] };

async function getCoins() {
  try {
    const data = await fetch(`${APIs.cryptoCoins}`);
    const jsonData = await getJSON(data);
    homeElementsVisibility(true);
    setCoinResponse(jsonData);
  } catch {
    getErrorModal("Sorry. Server isn't available at the moment.");
  }
}

function getJSON(data) {
  return data.json();
}

function getErrorModal(error) {
  window.scrollTo(0, 0);
  DOM.alertModal.style.visibility = "visible";
  DOM.alertModal.innerText = `${error}`;
  setTimeout(function () {
    DOM.alertModal.style.visibility = "hidden";
  }, 3000);
  if (DOM.alertModal.innerText.includes("successfully")) {
    DOM.alertModal.style.background = "rgb(74, 223, 106)";
  } else {
    DOM.alertModal.style.background = "pink";
  }
}

function setCoinResponse(data) {
  let data100 = data.slice(1400, 1500);
  const coins = coinFactory(data100);
  state.coins = coins;
  draw();
}

function draw() {
  const cards = state.coins.map(function (c, index) {
    return getCard(c, index);
  });
  clearDOMContent();
  DOM.content.append(...cards);
}

function coinFactory(data) {
  if (!Array.isArray(data)) return;
  return data.map(function (c) {
    return new CoinConstructor(c.id, c.name, c.symbol);
  });
}

function getCard(coinData, index) {
  const mainDiv = document.createElement("div");
  mainDiv.classList.add("mainCard");
  const card = `
  <div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" role="switch" id='toggle${index}' onclick="addToLiveReport('${coinData.name}','${index}')">
  </div>
  <div class= "mainInfo">
    <p class="coinHeaders"> Coin Info: </p>
    <p> <b>ID</b>: ${coinData.id}</p>
    <p> <b>Name</b>: ${coinData.name}</p>
    <p> <b>Symbol</b>: ${coinData.symbol}</p>
    <button class="btn btn-info" id="moreInfoBtn${index}" data-bs-toggle="collapse" href="#collapseExample${index}" onclick="getMoreInfo('${coinData.id}', '${index}'), changeBtnVal('${index}')"> More Info </button>
  </div>
  <div class="collapse" id="collapseExample${index}"></div>`;
  mainDiv.innerHTML = card;
  return mainDiv;
}

function clearInput() {
  DOM.searchInput.value = "";
  getHomeLoader();
  getCoins();
}

function searchCoins() {
  const inputVal = DOM.searchInput.value;
  const inputValLower = inputVal.toLowerCase();
  if (inputVal === "") {
    getCoins();
  }
  const filtredCoins = state.coins.filter(function (c) {
    if (c.name.toLowerCase().includes(inputValLower)) {
      return true;
    }
  });
  if (filtredCoins === false) {
    getErrorModal(
      "Oops. Your search did not match any results. Press `Clear` to retry."
    );
  }
  state.coins = filtredCoins;
  draw(filtredCoins);
}

function homeElementsVisibility(boolean) {
  if (boolean === true) {
    DOM.searchInput.style.visibility = "visible";
    DOM.header.style.visibility = "visible";
    DOM.clearBtn.style.visibility = "visible";
  } else {
    DOM.searchInput.style.visibility = "hidden";
    DOM.header.style.visibility = "hidden";
    DOM.clearBtn.style.visibility = "hidden";
  }
}

function addToLiveReport(name, index) {
  let savedCoin = document.querySelector(`#toggle${index}`);
  savedCoin.classList.toggle(true);
  if (savedCoin.checked === true && state.selected.length < 5) {
    state.selected.push(name);
  } else if (savedCoin.checked === false) {
    const selectedIndex = state.selected.findIndex(function (c) {
      return c === name;
    });
    state.selected.splice(selectedIndex, 1);
  } else {
    getSelectedCoinModal();
  }
}

function getSelectedCoinModal() {
  setCoinsInModal();
  DOM.selectedCoinsModal.style.display = "block";
  DOM.selectedCoinsModal.style.opacity = "1";
}

function setCoinsInModal() {
  let coinList = document.querySelector("#selectedCoinsList");
  coinList.innerHTML = "";
  state.selected.forEach(function (c) {
    coinList.innerHTML +=
      "<li><input type='radio' name='selectedCoins' class='ulCoins'>" +
      c +
      "</input></li>";
  });
}

function removeSelectedCoin() {
  const ulCoins = document.querySelectorAll(".ulCoins");
  let selectedCoinToRemove = Object.entries(ulCoins).find(function (c) {
    return c[1].checked === true;
  });
  if (!selectedCoinToRemove) {
    getErrorModal(
      "No coin selected. Please remove coin to procced or cancel..."
    );
    return;
  }
  state.selected.splice(selectedCoinToRemove[0], 1);
  closeSelectedCoinsModal();
  getErrorModal("Changes were saved successfully!");
}

function closeSelectedCoinsModal() {
  DOM.selectedCoinsModal.style.display = "none";
  DOM.selectedCoinsModal.style.opacity = "0";
}

function changeBtnVal(index) {
  let btn = document.querySelector(`#moreInfoBtn${index}`);
  if (btn.innerText === "More Info") btn.innerText = "Less Info";
  else btn.innerText = "More Info";
}

function drawMoreInfo(coinData, id, index) {
  let backCard = document.querySelector(`#collapseExample${index}`);
  let defaultImage =
    "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg";
  if (!coinData.ils_Price || !coinData.usd_Price || !coinData.eur_Price) {
    getErrorModal("Sorry. More info isn't available right now.");
  }
  const moreInfo = `
  <div class= "moreInfo">
    <p class="coinHeaders"> Price: </p>
    <p><b>ILS</b>: ₪${coinData.ils_Price.toFixed(3)}</p>
    <p><b>USD</b>: $${coinData.usd_Price.toFixed(3)}</p>
    <p><b>EUR</b>: €${coinData.eur_Price.toFixed(3)}</p>
    <img src=${coinData.image} alt=${defaultImage}> </img>
  </div>`;
  backCard.innerHTML = moreInfo;
  return backCard;
}

async function getMoreInfo(coinID, index) {
  let backCard = document.querySelector(`#collapseExample${index}`);
  try {
    if (sessionStorage.getItem(coinID) === null) {
      backCard.append(getLoader());
      const moreData = await fetch(`${APIs.specificCrypto}/${coinID}`);
      const jsonMoreData = await getJSON(moreData);
      moreDataCoin = await MoreInfoFactory(jsonMoreData);
    } else {
      const storageData = getDataFromSession(coinID);
      const parsedData = JSON.parse(storageData);
      moreDataCoin = parsedData;
    }
    //setTimeout to demonstrate loader works properly
    setTimeout(function () {
      drawMoreInfo(moreDataCoin, coinID, index);
    }, 2000);
    saveToSessionStorage(coinID, moreDataCoin);
  } catch {
    getErrorModal("Sorry. More info isn't available right now.");
  }
}

async function MoreInfoFactory(c) {
  return new MoreInfoConstructor(
    c.image.small,
    c.market_data.current_price.ils,
    c.market_data.current_price.usd,
    c.market_data.current_price.eur
  );
}

function getDataFromSession(coinID) {
  const data = sessionStorage.getItem(coinID);
  return data;
}

function saveToSessionStorage(coinName, coin) {
  const savedCacheCoin = JSON.stringify(coin);
  sessionStorage.setItem(coinName, savedCacheCoin);
  setTimeout(function () {
    sessionStorage.removeItem(coinName);
  }, 1000 * 120);
}

function getLoader() {
  const mainDiv = document.createElement("div");
  const loader = `
  <div class="loader">
   <div class="loaderImage">
    <div class="loaderCoin">
		 <img src="https://www.dropbox.com/s/fzc3fidyxqbqhnj/loader-coin.png?raw=1" alt="">
		</div>
    <div class="loader__hand">
		  <img src="https://www.dropbox.com/s/y8uqvjn811z6npu/loader-hand.png?raw=1" alt="">
    </div>
   </div>
  </div>`;
  mainDiv.innerHTML = loader;
  return mainDiv;
}

function drawLoader() {
  clearDOMContent();
  DOM.content.append(getLoader());
}

function clearDOMContent() {
  DOM.content.innerHTML = "";
}

function getHomeLoader() {
  clearDOMContent();
  let homeDiv = document.createElement("div");
  homeLoader = `
    <div class="middle">
    <div class="bar bar1"></div>
    <div class="bar bar2"></div>
    <div class="bar bar3"></div>
    <div class="bar bar4"></div>
    <div class="bar bar5"></div>
    <div class="bar bar6"></div>
    <div class="bar bar7"></div>
    <div class="bar bar8"></div>
  </div>`;
  homeDiv.innerHTML = homeLoader;
  DOM.content.append(homeDiv);
}
