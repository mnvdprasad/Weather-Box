document.addEventListener("DOMContentLoaded", function () {
  const hash = window.location.hash;

  if (hash.startsWith("#weather/")) {
    const hashCity = decodeURIComponent(hash.replace("#weather/", ""));
    const cityInput = document.getElementById("city");
    if (cityInput) cityInput.value = hashCity;

    try {
      const lastWeatherClass = localStorage.getItem("lastWeatherClass");
      if (lastWeatherClass) {
        const weatherBox = document.querySelector(".weather-box");
        if (weatherBox) {
          lastWeatherClass.split(" ").forEach(cls => weatherBox.classList.add(cls));
        }
      }
      
      const cachedCity = sessionStorage.getItem("cachedWeatherCity");
      if (cachedCity && cachedCity.toLowerCase() === hashCity.toLowerCase()) {
        const cachedHTML = sessionStorage.getItem("cachedWeatherHTML");
        const resultDiv = document.getElementById("result");
        if (cachedHTML && resultDiv) {
          resultDiv.innerHTML = cachedHTML;
        }
      }
    } catch(e) {}

    if (typeof getWeather === "function") {
      getWeather(false, null, null, hashCity);
    }
  }

  if (hash === "#about" && typeof toggleAbout === "function") {
    toggleAbout(true);
  } else if (hash === "#privacy" && typeof togglePrivacy === "function") {
    togglePrivacy(true);
  } else if (hash === "#terms" && typeof toggleTerms === "function") {
    toggleTerms(true);
  } else if (
    hash === "#radar" &&
    typeof window.toggleRadarView === "function"
  ) {
    window.toggleRadarView(true, true);
  }

  const isModalHash = ["#about", "#privacy", "#terms"].includes(hash);
  if (!hash.startsWith("#weather/") && !isModalHash) {
    if (localStorage.getItem("rememberCity") === "true") {
      const lastCity = localStorage.getItem("lastCity");
      if (lastCity) {
        const cityInput = document.getElementById("city");
        if (cityInput) cityInput.value = lastCity;
        if (typeof fetchStartupCityWeather === "function") {
          window.currentStartupCity = lastCity;
          fetchStartupCityWeather();
        }
      } else {
        if (typeof showRandomStartupCity === "function")
          showRandomStartupCity();
      }
    } else {
      if (typeof showRandomStartupCity === "function") showRandomStartupCity();
    }
  }
});

window.pushAppState = function (hashName) {
  if (window.location.hash !== hashName) {
    window.history.pushState(null, "", hashName);
  }
};

window.addEventListener("popstate", function () {
  const hash = window.location.hash;
  const aboutPanel = document.getElementById("about-us-panel");
  const privacyPanel = document.getElementById("privacy-panel");
  const termsPanel = document.getElementById("terms-panel");

  if (
    aboutPanel &&
    aboutPanel.classList.contains("active") &&
    hash !== "#about"
  ) {
    if (typeof toggleAbout === "function") toggleAbout(true);
  }

  if (
    privacyPanel &&
    privacyPanel.classList.contains("active") &&
    hash !== "#privacy"
  ) {
    if (typeof togglePrivacy === "function") togglePrivacy(true);
  }

  if (
    termsPanel &&
    termsPanel.classList.contains("active") &&
    hash !== "#terms"
  ) {
    if (typeof toggleTerms === "function") toggleTerms(true);
  }

  if (
    typeof window.toggleRadarView === "function" &&
    window.isRadarView &&
    hash !== "#radar"
  ) {
    window.toggleRadarView(false, true);
  }

  if (hash.startsWith("#weather/")) {
    const hashCity = decodeURIComponent(hash.replace("#weather/", ""));
    const cityInput = document.getElementById("city");
    if (cityInput) cityInput.value = hashCity;
    
    if (
      window.currentRenderedCityHash && 
      window.currentRenderedCityHash.toLowerCase() === hashCity.toLowerCase()
    ) {
      const detailsGrid = document.querySelector(".details-grid");
      const resultDiv = document.getElementById("result");
      const homeResult = document.getElementById("home-result");
      
      if (detailsGrid) detailsGrid.style.display = "";
      if (resultDiv) resultDiv.style.display = "block";
      if (homeResult) homeResult.style.display = "none";
      
      const radarBtn = document.getElementById("radar-btn");
      if (radarBtn) radarBtn.style.display = "block";
      
      try {
        const lastWeatherClass = localStorage.getItem("lastWeatherClass");
        if (lastWeatherClass) {
          const weatherBox = document.querySelector(".weather-box");
          if (weatherBox) {
            weatherBox.className = "weather-box";
            lastWeatherClass.split(" ").forEach(cls => weatherBox.classList.add(cls));
          }
        }
      } catch(e) {}
      
      const radarContainer = document.getElementById("radar-container");
      if (radarContainer) radarContainer.style.display = "none";
    } else if (typeof getWeather === "function") {
      getWeather(false, null, null, hashCity);
    }
  } else if (hash === "#about" && typeof toggleAbout === "function") {
    toggleAbout(true);
  } else if (hash === "#privacy" && typeof togglePrivacy === "function") {
    togglePrivacy(true);
  } else if (hash === "#terms" && typeof toggleTerms === "function") {
    toggleTerms(true);
  } else if (
    hash === "#radar" &&
    typeof window.toggleRadarView === "function"
  ) {
    window.toggleRadarView(true, true);
  } else if (hash === "" || hash === "#home") {
    const cityInput = document.getElementById("city");
    if (cityInput) {
      cityInput.value = "";
      cityInput.blur();
    }

    const suggestionsBox = document.getElementById("suggestions-box");
    if (suggestionsBox) suggestionsBox.innerHTML = "";
    const messageBox = document.getElementById("message-box");
    if (messageBox) messageBox.style.display = "none";

    const radarBtn = document.getElementById("radar-btn");
    if (radarBtn) radarBtn.style.display = "none";

    if (localStorage.getItem("rememberCity") === "true") {
      const lastCity = localStorage.getItem("lastCity");
      if (lastCity) {
        if (typeof fetchStartupCityWeather === "function") {
          window.currentStartupCity = lastCity;
          fetchStartupCityWeather();
        }
      } else {
        if (typeof showRandomStartupCity === "function")
          showRandomStartupCity();
      }
    } else {
      if (typeof showRandomStartupCity === "function") showRandomStartupCity();
    }
  }
});