/* Starts an interval that continually updates the displayed local time for the searched city. */
function startClock(timezoneOffset) {
  if (timeInterval) clearInterval(timeInterval);

  const update = () => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const cityTime = new Date(utc + 1000 * timezoneOffset);

    const day = cityTime.getDate();
    const month = cityTime.toLocaleString("default", { month: "short" });
    let hours = cityTime.getHours();
    const minutes = cityTime.getMinutes().toString().padStart(2, "0");

    let timeString;
    if (
      typeof currentTimeFormat !== "undefined" &&
      currentTimeFormat === "24-hour"
    ) {
      timeString = `${day} ${month} ${hours.toString().padStart(2, "0")}:${minutes}`;
    } else {
      const ampm = hours >= 12 ? "pm" : "am";
      let h12 = hours % 12;
      h12 = h12 ? h12 : 12;
      timeString = `${day} ${month} ${h12.toString().padStart(2, "0")}:${minutes} ${ampm}`;
    }

    const timeEl = document.getElementById("city-time");
    if (timeEl) timeEl.innerText = timeString;
  };
  update();
  timeInterval = setInterval(update, 1000);
}

window.isRadarView = false;
window.toggleRadarView = function (showRadar) {
  if (typeof showRadar !== "undefined") {
    window.isRadarView = showRadar;
  } else {
    window.isRadarView = !window.isRadarView;
  }

  const detailsGrid = document.querySelector(".details-grid");
  const radarContainer = document.getElementById("radar-container");
  const radarBtn = document.getElementById("radar-btn");

  if (window.isRadarView) {
    if (radarBtn) radarBtn.classList.add("active");
    if (detailsGrid) detailsGrid.style.display = "none";

    if (!radarContainer) {
      const resultDiv = document.getElementById("result");
      if (resultDiv) {
        const lat = window.selectedLocation ? window.selectedLocation.lat : 0;
        const lon = window.selectedLocation ? window.selectedLocation.lon : 0;
        const radarHtml = `
            <div id="radar-container" style="display: flex; flex-direction: column; width: 100%; align-items: center; margin-top: 10px; z-index: 10; position: relative; padding: 0 5px; box-sizing: border-box;">
                <div style="display: flex; align-items: center; flex-direction: row; width: 100%; justify-content: space-between; margin-bottom: 5px; color: inherit; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif;">
                    <span style="font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif; color: inherit; font-size: 0.6rem; font-weight: bold; opacity: 0.9;">Weather Radar - Powered by windy.com</span>
                    <span id="close-radar-btn" style="cursor: pointer; font-size: 0.75rem; margin-top: 0; padding: 2px 6px; color: rgba(255, 255, 255, 0.7); transition: color 0.2s, transform 0.2s;" onmouseenter="this.style.color='#F9FAFB'; this.style.transform='scale(1.02)';" onmouseleave="this.style.color='rgba(255, 255, 255, 0.7)'; this.style.transform='scale(1)';">
                        Close
                    </span>
                </div>
                <div class="glass-tab" style="width: 100%; padding: 0; overflow: hidden; border-radius: 10px; display: flex; opacity: 0; animation: zoomOutIn 0.1s ease forwards 0.1s;">
                    <iframe width="100%" height="410" src="https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=5&overlay=satellite&product=radar&level=surface&lat=${lat}&lon=${lon}&sound=false&play=false&lightning=false" frameborder="0" allow="autoplay 'none'"></iframe>
                </div>
            </div>
        `;
        if (detailsGrid) {
          detailsGrid.insertAdjacentHTML("afterend", radarHtml);
        } else {
          resultDiv.insertAdjacentHTML("beforeend", radarHtml);
        }

        const closeBtn = document.getElementById("close-radar-btn");
        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            window.toggleRadarView(false);
          });
        }
      }
    } else {
      radarContainer.style.display = "flex";
      // Update iframe src with current coords
      const iframe = radarContainer.querySelector("iframe");
      if (iframe) {
        const lat = window.selectedLocation ? window.selectedLocation.lat : 0;
        const lon = window.selectedLocation ? window.selectedLocation.lon : 0;
        iframe.src = `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=5&overlay=radar&product=radar&level=surface&lat=${lat}&lon=${lon}&sound=false&play=false&lightning=false`;
      }
    }
  } else {
    if (radarBtn) radarBtn.classList.remove("active");
    if (detailsGrid) detailsGrid.style.display = "flex";
    if (radarContainer) radarContainer.style.display = "none";
  }
};

/* Switches the main forecast view between Hourly and Daily tabs. */
window.currentForecastTab = "daily";
window.currentHourlyTab = "temp";
window.currentDailyTab = "temp";

function switchForecastTab(tab) {
  window.currentForecastTab = tab;
  const hourlyTab = document.getElementById("forecast-hourly-tab");
  const dailyTab = document.getElementById("forecast-daily-tab");
  const hourlyContainer = document.getElementById("hourly-content-container");
  const dailyContainer = document.getElementById("daily-content-container");
  const hourlySubTabs = document.getElementById("hourly-sub-tabs");
  const dailySubTabs = document.getElementById("daily-sub-tabs");

  const hourlyIndicator = hourlyTab.querySelector(".tab-indicator");
  const dailyIndicator = dailyTab.querySelector(".tab-indicator");

  if (tab === "hourly") {
    hourlyTab.style.opacity = "1";
    hourlyTab.style.fontWeight = "bold";
    if (hourlyIndicator) {
      hourlyIndicator.style.opacity = "1";
      hourlyIndicator.style.bottom = "-2px";
    }
    dailyTab.style.opacity = "0.5";
    dailyTab.style.fontWeight = "normal";
    if (dailyIndicator) {
      dailyIndicator.style.opacity = "0";
      dailyIndicator.style.bottom = "-8px";
    }

    hourlyContainer.style.display = "block";
    if (hourlySubTabs) hourlySubTabs.style.display = "flex";
    if (dailySubTabs) dailySubTabs.style.display = "none";
    dailyContainer.style.display = "none";
    if (document.getElementById("custom-scrollbar-track"))
      document.getElementById("custom-scrollbar-track").style.display = "block";
    if (document.getElementById("custom-scrollbar-track-daily"))
      document.getElementById("custom-scrollbar-track-daily").style.display =
        "none";
  } else {
    dailyTab.style.opacity = "1";
    dailyTab.style.fontWeight = "bold";
    if (dailyIndicator) {
      dailyIndicator.style.opacity = "1";
      dailyIndicator.style.bottom = "-2px";
    }
    hourlyTab.style.opacity = "0.5";
    hourlyTab.style.fontWeight = "normal";
    if (hourlyIndicator) {
      hourlyIndicator.style.opacity = "0";
      hourlyIndicator.style.bottom = "-8px";
    }

    hourlyContainer.style.display = "none";
    if (hourlySubTabs) hourlySubTabs.style.display = "none";
    if (dailySubTabs) dailySubTabs.style.display = "flex";
    dailyContainer.style.display = "block";
    if (document.getElementById("custom-scrollbar-track"))
      document.getElementById("custom-scrollbar-track").style.display = "none";
    if (document.getElementById("custom-scrollbar-track-daily"))
      document.getElementById("custom-scrollbar-track-daily").style.display =
        "block";

    const tDaily = document.getElementById("custom-scrollbar-track-daily");
    const thDaily = document.getElementById("custom-scrollbar-thumb-daily");
    if (tDaily && thDaily && dailyContainer) {
      const ratio = dailyContainer.clientWidth / dailyContainer.scrollWidth;
      if (ratio >= 1) {
        tDaily.style.display = "none";
      } else {
        tDaily.style.display = "block";
        thDaily.style.width = `${Math.max(20, ratio * tDaily.clientWidth)}px`;
      }
    }
  }
}

/* Switches the sub-tab view (Temperature and Precipitation) for the Hourly forecast. */
function switchHourlySubTab(tab) {
  window.currentHourlyTab = tab;
  const tempTab = document.getElementById("hourly-temp-tab");
  const precipTab = document.getElementById("hourly-precip-tab");
  const tempContent = document.getElementById("hourly-temp-content");
  const precipContent = document.getElementById("hourly-precip-content");
  const thumb = document.getElementById("custom-scrollbar-thumb");

  if (tab === "temp") {
    tempTab.style.opacity = "1";
    precipTab.style.opacity = "0.6";
    if (tempContent) tempContent.style.display = "block";
    if (precipContent) precipContent.style.display = "none";
    if (thumb) {
      window.currentScrollbarColor =
        "linear-gradient(135deg,rgba(255, 165, 0, 0.8), rgba(249, 220, 178, 0.8), rgba(255, 165, 0, 0.8), rgba(249, 220, 178, 0.8))";
      window.currentScrollbarColorActive =
        "linear-gradient(135deg,rgba(255, 165, 0, 1), rgba(249, 220, 178, 1), rgba(255, 165, 0, 1), rgba(249, 220, 178, 1))";
      thumb.style.background = window.currentScrollbarColor;
    }
  } else {
    precipTab.style.opacity = "1";
    tempTab.style.opacity = "0.6";
    if (tempContent) tempContent.style.display = "none";
    if (precipContent) precipContent.style.display = "block";
    if (thumb) {
      window.currentScrollbarColor =
        "linear-gradient(135deg,rgba(100, 180, 255, 0.8), rgba(184, 218, 250, 0.8), rgba(100, 180, 255, 0.8), rgba(184, 218, 250, 0.8)";
      window.currentScrollbarColorActive =
        "linear-gradient(135deg,rgba(100, 180, 255, 1), rgba(184, 218, 250, 1), rgba(100, 180, 255, 1), rgba(184, 218, 250, 1)";
      thumb.style.background = window.currentScrollbarColor;
    }
  }
}

/* Switches the sub-tab view (Temperature and Precipitation) for the Daily forecast. */
function switchDailySubTab(tab) {
  window.currentDailyTab = tab;
  const tempTab = document.getElementById("daily-temp-tab");
  const precipTab = document.getElementById("daily-precip-tab");
  const tempContent = document.getElementById("daily-temp-content");
  const precipContent = document.getElementById("daily-precip-content");
  const thumb = document.getElementById("custom-scrollbar-thumb-daily");

  if (tab === "temp") {
    tempTab.style.opacity = "1";
    precipTab.style.opacity = "0.6";
    if (tempContent) tempContent.style.display = "block";
    if (precipContent) precipContent.style.display = "none";
    if (thumb) {
      window.currentScrollbarColorDaily =
        "linear-gradient(135deg,rgba(255, 165, 0, 0.8), rgba(249, 220, 178, 0.8), rgba(255, 165, 0, 0.8), rgba(249, 220, 178, 0.8))";
      window.currentScrollbarColorActiveDaily =
        "linear-gradient(135deg,rgba(255, 165, 0, 1), rgba(249, 220, 178, 1), rgba(255, 165, 0, 1), rgba(249, 220, 178, 1))";
      thumb.style.background = window.currentScrollbarColorDaily;
    }
  } else {
    precipTab.style.opacity = "1";
    tempTab.style.opacity = "0.6";
    if (tempContent) tempContent.style.display = "none";
    if (precipContent) precipContent.style.display = "block";
    if (thumb) {
      window.currentScrollbarColorDaily =
        "linear-gradient(135deg,rgba(100, 180, 255, 0.8), rgba(184, 218, 250, 0.8), rgba(100, 180, 255, 0.8), rgba(184, 218, 250, 0.8)";
      window.currentScrollbarColorActiveDaily =
        "linear-gradient(135deg,rgba(100, 180, 255, 1), rgba(184, 218, 250, 1), rgba(100, 180, 255, 1), rgba(184, 218, 250, 1)";
      thumb.style.background = window.currentScrollbarColorDaily;
    }
  }
}

/* Adds custom logic to allow click-and-drag horizontal scrolling on the forecast chart containers, including momentum scrolling. */
function attachDragToScroll() {
  document.querySelectorAll(".hourly-scroll-container").forEach((container) => {
    let isDown = false;
    let startX;
    let scrollLeft;
    let velX = 0;
    let momentumID;

    const isDaily = container.id === "daily-content-container";
    const trackId = isDaily
      ? "custom-scrollbar-track-daily"
      : "custom-scrollbar-track";
    const thumbId = isDaily
      ? "custom-scrollbar-thumb-daily"
      : "custom-scrollbar-thumb";

    const track = document.getElementById(trackId);
    const thumb = document.getElementById(thumbId);

    const updateThumb = () => {
      if (!track || !thumb) return;
      const scrollableWidth = container.scrollWidth - container.clientWidth;
      if (scrollableWidth <= 0) return;
      const scrollPercentage = container.scrollLeft / scrollableWidth;
      const maxThumbLeft = track.clientWidth - thumb.clientWidth;
      thumb.style.left = `${scrollPercentage * maxThumbLeft}px`;
    };

    if (
      track &&
      thumb &&
      (container.id === "hourly-content-container" ||
        container.id === "daily-content-container")
    ) {
      const ratio = container.clientWidth / container.scrollWidth;
      if (ratio >= 1) {
        track.style.display = "none";
      } else {
        if (container.style.display !== "none") {
          track.style.display = "block";
          thumb.style.width = `${Math.max(20, ratio * track.clientWidth)}px`;
        }
        container.addEventListener("scroll", updateThumb);
      }

      thumb.onmousedown = (e) => {
        window.isThumbDown = true;
        window.activeThumb = thumb;
        window.activeTrack = track;
        window.activeContainer = container;
        window.thumbStartX = e.pageX;
        window.thumbStartLeft = parseFloat(thumb.style.left) || 0;
        thumb.style.cursor = "grabbing";
        thumb.style.background =
          (isDaily
            ? window.currentScrollbarColorActiveDaily
            : window.currentScrollbarColorActive) || "rgba(255, 165, 0, 1)";
        thumb.style.height = "6px";
        thumb.style.top = "-2px";
        cancelAnimationFrame(momentumID);
        e.stopPropagation();
      };

      track.onmousedown = (e) => {
        if (e.target === thumb) return;
        const trackRect = track.getBoundingClientRect();
        const clickX = e.clientX - trackRect.left;
        const maxThumbLeft = track.clientWidth - thumb.clientWidth;
        let newLeft = clickX - thumb.clientWidth / 2;
        newLeft = Math.max(0, Math.min(newLeft, maxThumbLeft));
        const scrollableWidth = container.scrollWidth - container.clientWidth;
        container.scrollLeft = (newLeft / maxThumbLeft) * scrollableWidth;
      };

      if (!window.customScrollHandlersAttached) {
        document.addEventListener("mouseup", () => {
          if (window.isThumbDown) {
            window.isThumbDown = false;
            const t = window.activeThumb;
            if (t) {
              t.style.cursor = "grab";
              const isD = t.id === "custom-scrollbar-thumb-daily";
              t.style.background =
                (isD
                  ? window.currentScrollbarColorDaily
                  : window.currentScrollbarColor) || "rgba(255, 165, 0, 0.8)";
              t.style.height = "4px";
              t.style.top = "-1px";
            }
          }
        });

        document.addEventListener("mousemove", (e) => {
          if (!window.isThumbDown) return;
          e.preventDefault();
          const t = window.activeThumb;
          const tr = window.activeTrack;
          const c = window.activeContainer;
          if (!t || !tr || !c) return;

          const walk = e.pageX - window.thumbStartX;
          const maxThumbLeft = tr.clientWidth - t.clientWidth;
          let newLeft = window.thumbStartLeft + walk;
          newLeft = Math.max(0, Math.min(newLeft, maxThumbLeft));

          const scrollableWidth = c.scrollWidth - c.clientWidth;
          c.scrollLeft = (newLeft / maxThumbLeft) * scrollableWidth;
        });
        window.customScrollHandlersAttached = true;
      }
    }

    container.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      container.style.cursor = "grabbing";
      cancelAnimationFrame(momentumID);
    });
    container.addEventListener("mouseleave", () => {
      isDown = false;
      container.style.cursor = "grab";
    });
    container.addEventListener("mouseup", () => {
      isDown = false;
      container.style.cursor = "grab";
      beginMomentum();
    });
    container.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2.5;
      const prevScrollLeft = container.scrollLeft;
      container.scrollLeft = scrollLeft - walk;
      velX = container.scrollLeft - prevScrollLeft;
    });

    function beginMomentum() {
      container.scrollLeft += velX;
      velX *= 0.96;
      if (Math.abs(velX) > 0.5) {
        momentumID = requestAnimationFrame(beginMomentum);
      }
    }

    container.style.cursor = "grab";
  });
}

/* The main function responsible for fetching weather data and geocoding */
async function getWeather(
  isAutoUpdate = false,
  overrideLat = null,
  overrideLon = null,
  overrideName = null,
  overrideCountry = null,
) {
  let slowConnTimer = null;

  if (startupInterval) clearInterval(startupInterval);
  const cityInput = document.getElementById("city").value.trim();
  const city = cityInput.toLowerCase();
  const result = document.getElementById("result");
  const messageBox = document.getElementById("message-box");
  const suggestionsBox = document.getElementById("suggestions-box");

  if (suggestionsBox) suggestionsBox.style.display = "none";

  if (
    typeof handleTestAnimations === "function" &&
    handleTestAnimations(city)
  ) {
    return;
  }

  // Handle UI updates (loaders, clear old data) for a fresh manual search
  if (!isAutoUpdate) {
    if (weatherInterval) clearTimeout(weatherInterval);

    document.getElementById("current-time").innerText = "";
    if (timeInterval) clearInterval(timeInterval);
    messageBox.style.display = "none";

    if (!navigator.onLine) {
      showMessage(
        "No internet connection",
        "Please check your network settings and try again.",
      );
      return;
    }

    if (cityInput === "") {
      showMessage(
        "Please enter a city name",
        "The search field is empty. Type a location and try again.",
      );
      return;
    }

    const loaderHtml = `
          <div id="main-loader" class="loader-container" style="position: absolute; top: 10px; left: 0; width: 100%; z-index: 100; display: flex; justify-content: center; align-items: center;">
              <div style="position: relative; padding: 25px 70px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.1); -webkit-backdrop-filter: blur(2px) brightness(0.9); backdrop-filter: blur(2px) brightness(0.9); -webkit-mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent), linear-gradient(to bottom, transparent, black 5%, black 95%, transparent); -webkit-mask-composite: source-in; mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent), linear-gradient(to bottom, transparent, black 5%, black 95%, transparent); mask-composite: intersect; z-index: -1;"></div>
                  <div class="loader-bars" style="margin-top: -10px;">
                      <div class="bar"></div>
                      <div class="bar"></div>
                      <div class="bar"></div>
                      <div class="bar"></div>
                      <div class="bar"></div>
                      <div class="bar"></div>
                  </div>
                  <div class="loader-text" style="text-shadow: 0 0 5px rgba(0,0,0,0.8);">LOADING</div>
                  <div id="slow-conn-msg" class="slow-connection-text" style="text-shadow: 0 0 5px rgba(0,0,0,0.8); position: absolute; margin-top: 75px; text-align: center;">Slow Connection</div>
              </div>
          </div>
      `;

    const existingLoader = document.getElementById("main-loader");
    if (existingLoader) existingLoader.remove();

    if (result.innerHTML.trim() !== '') {
      result.style.position = 'relative';
      result.insertAdjacentHTML('beforeend', loaderHtml);
    } else {
      result.innerHTML = loaderHtml;
    }

    slowConnTimer = setTimeout(() => {
      const el = document.getElementById("slow-conn-msg");
      if (el) el.style.display = "block";
    }, 8000);
  } else if (
    (cityInput === "" &&
      (!overrideLat || !overrideLon) &&
      !window.selectedLocation) ||
    !navigator.onLine
  ) {
    return;
  }

  try {
    let hasGeoData = false;
    let geoLat, geoLon, resolvedCityName, resolvedCountry, resolvedFullAddress;

    if (overrideLat !== null && overrideLon !== null) {
      geoLat = overrideLat;
      geoLon = overrideLon;
      resolvedCityName = overrideName;
      resolvedCountry = overrideCountry;
      if (window.selectedLocation && window.selectedLocation.fullAddress) {
        resolvedFullAddress = window.selectedLocation.fullAddress;
      } else {
        resolvedFullAddress = [overrideName, overrideCountry]
          .filter(Boolean)
          .join(",<br>");
      }
      hasGeoData = true;
    } else if (isAutoUpdate && window.selectedLocation) {
      geoLat = window.selectedLocation.lat;
      geoLon = window.selectedLocation.lon;
      resolvedCityName = window.selectedLocation.name;
      resolvedCountry = window.selectedLocation.country;
      resolvedFullAddress =
        window.selectedLocation.fullAddress ||
        [resolvedCityName, resolvedCountry].filter(Boolean).join(",<br>");
      hasGeoData = true;
    }

    if (!hasGeoData) {
      // 1. Trying Nominatim (OpenStreetMap) for richest address data
      try {
        const nomRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityInput)}&format=json&addressdetails=1&limit=1`,
        );
        const nomData = await nomRes.json();
        if (nomData && nomData.length > 0) {
          geoLat = nomData[0].lat;
          geoLon = nomData[0].lon;

          let cName = nomData[0].name;
          if (!cName || /\d/.test(cName)) {
            cName = nomData[0].address
              ? nomData[0].address.village ||
                nomData[0].address.town ||
                nomData[0].address.city ||
                nomData[0].address.hamlet ||
                nomData[0].address.suburb
              : "";
          }
          if (!cName && nomData[0].display_name) {
            const parts = nomData[0].display_name.split(",");
            const textParts = parts
              .map((p) => p.trim())
              .filter((p) => !/\d/.test(p));
            cName = textParts.length > 0 ? textParts[0] : cityInput;
          }
          resolvedCityName = cName;
          resolvedCountry = nomData[0].address
            ? (nomData[0].address.country_code || "").toUpperCase()
            : "";

          let parts = [cName];
          if (nomData[0].address) {
            let addr = nomData[0].address;
            let mandal = addr.county || addr.municipality || addr.suburb || "";
            let district = addr.state_district || addr.district || "";
            let state = addr.state || addr.region || "";
            let postcode = addr.postcode || "";
            let country = addr.country || "";

            if (mandal && !parts.includes(mandal)) parts.push(mandal);
            if (district && !parts.includes(district)) parts.push(district);
            if (state && !parts.includes(state)) {
              parts.push(postcode ? `${state} ${postcode}` : state);
            } else if (postcode && !parts.includes(postcode)) {
              parts.push(postcode);
            }
            if (country && !parts.includes(country)) parts.push(country);
          }
          resolvedFullAddress = parts.filter(Boolean).join(",<br>");
          hasGeoData = true;
        }
      } catch (e) {
        console.warn("Nominatim Geo failed", e);
      }
    }

    // 2. Fallback to Open-Meteo Geocoding
    if (!hasGeoData) {
      try {
        const omRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityInput)}&count=1&language=en&format=json`,
        );
        const omData = await omRes.json();
        if (omData.results && omData.results.length > 0) {
          geoLat = omData.results[0].latitude;
          geoLon = omData.results[0].longitude;
          resolvedCityName = omData.results[0].name;
          resolvedCountry =
            omData.results[0].country_code || omData.results[0].country || "";

          let parts = [resolvedCityName];
          let mandal =
            omData.results[0].admin3 || omData.results[0].admin4 || "";
          let district = omData.results[0].admin2 || "";
          let state = omData.results[0].admin1 || "";
          let postcode =
            omData.results[0].postcodes &&
            omData.results[0].postcodes.length > 0
              ? omData.results[0].postcodes[0]
              : "";
          let countryFull = omData.results[0].country || "";

          if (mandal && !parts.includes(mandal)) parts.push(mandal);
          if (district && !parts.includes(district)) parts.push(district);
          if (state && !parts.includes(state)) {
            parts.push(postcode ? `${state} ${postcode}` : state);
          } else if (postcode && !parts.includes(postcode)) {
            parts.push(postcode);
          }
          if (countryFull && !parts.includes(countryFull))
            parts.push(countryFull);

          resolvedFullAddress = parts.filter(Boolean).join(",<br>");
          hasGeoData = true;
        }
      } catch (e) {
        console.warn("Open-Meteo Geo failed", e);
      }
    }

    if (!hasGeoData) {
      // 3. Trying OpenWeatherMap Geocoding API
      try {
        let isZip = /\d/.test(cityInput);
        if (isZip) {
          /*
          const owmZipRes = await fetch(
            `https://api.openweathermap.org/geo/1.0/zip?zip=${encodeURIComponent(cityInput)}&appid=${apiKey}`,
          );
          */
          const owmZipRes = await fetch(
            `/api/weather?action=geo_zip&zip=${encodeURIComponent(cityInput)}`,
          );
          if (owmZipRes.ok) {
            const owmZipData = await owmZipRes.json();
            if (owmZipData && owmZipData.lat) {
              geoLat = owmZipData.lat;
              geoLon = owmZipData.lon;
              resolvedCityName = owmZipData.name;
              resolvedCountry = owmZipData.country || "";

              let countryFull = resolvedCountry;
              if (countryFull && countryFull.length === 2) {
                try {
                  const regionNames = new Intl.DisplayNames(["en"], {
                    type: "region",
                  });
                  countryFull =
                    regionNames.of(countryFull.toUpperCase()) || countryFull;
                } catch (e) {}
              }

              resolvedFullAddress = [owmZipData.name, cityInput, countryFull]
                .filter(Boolean)
                .join(",<br>");
              hasGeoData = true;
            }
          }
        }

        if (!hasGeoData) {
          /*
          const owmRes = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityInput)}&limit=1&appid=${apiKey}`,
          );
          */
          const owmRes = await fetch(
            `/api/weather?action=geo_direct&q=${encodeURIComponent(cityInput)}&limit=1`,
          );
          const owmData = await owmRes.json();
          if (owmData && owmData.length > 0) {
            geoLat = owmData[0].lat;
            geoLon = owmData[0].lon;
            resolvedCityName = owmData[0].name;
            resolvedCountry = owmData[0].country || "";

            let countryFull = resolvedCountry;
            if (countryFull && countryFull.length === 2) {
              try {
                const regionNames = new Intl.DisplayNames(["en"], {
                  type: "region",
                });
                countryFull =
                  regionNames.of(countryFull.toUpperCase()) || countryFull;
              } catch (e) {}
            }

            let parts = [resolvedCityName];
            let state = owmData[0].state || "";
            if (state && !parts.includes(state)) parts.push(state);
            if (countryFull && !parts.includes(countryFull))
              parts.push(countryFull);

            resolvedFullAddress = parts.filter(Boolean).join(",<br>");
            hasGeoData = true;
          }
        }
      } catch (e) {
        console.warn("OWM Geo failed", e);
      }
    }

    if (!hasGeoData) {
      throw new Error("City not found");
    }

    window.selectedLocation = {
      lat: geoLat,
      lon: geoLon,
      name: resolvedCityName,
      country: resolvedCountry,
      fullAddress: resolvedFullAddress,
    };

    // Fetch current weather from OpenWeatherMap
    /*
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${geoLat}&lon=${geoLon}&units=metric&appid=${apiKey}`;
    */
    const url = `/api/weather?action=weather&lat=${geoLat}&lon=${geoLon}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      let errMsg = errorData.error || errorData.message || "City not found";
      if (errMsg.includes("Invalid API key")) {
        errMsg = "Invalid API key";
      }
      throw new Error(errMsg);
    }

    const data = await response.json();

    const temp = data.main.temp;
    let condition = data.weather[0].description;
    const cityName = resolvedCityName || data.name;
    const country = data.sys.country || resolvedCountry;

    let fullCountry = country;
    if (fullCountry && fullCountry.length === 2) {
      try {
        const regionNames = new Intl.DisplayNames(["en"], {
          type: "region",
        });
        fullCountry = regionNames.of(fullCountry.toUpperCase()) || fullCountry;
      } catch (e) {}
    }
    if (fullCountry) {
      localStorage.setItem("lastSearchedCountry", fullCountry);
    }

    let finalCityName = cityName
      .replace(/[0-9]/g, "")
      .replace(/^[,\s\-]+|[,\s\-]+$/g, "")
      .trim();
    if (!finalCityName) finalCityName = cityName;

    let finalFullAddress = "";
    if (resolvedFullAddress) {
      let separator = resolvedFullAddress.includes(",<br>") ? ",<br>" : ", ";
      let addrParts = resolvedFullAddress.split(separator);
      if (addrParts.length > 1) {
        finalFullAddress = `<span style="font-size: 0.55rem;">${addrParts[0]}</span>,<br><span style="font-size: 0.35rem; opacity: 0.7;">${addrParts.slice(1).join(",<br>")}</span>`;
      } else {
        finalFullAddress = `<span style="font-size: 0.55rem;">${addrParts[0]}</span>`;
      }
    } else {
      finalFullAddress =
        `<span style="font-size: 0.55rem;">${finalCityName}</span>` +
        (fullCountry
          ? `,<br><span style="font-size: 0.35rem; opacity: 0.7;">${fullCountry}</span>`
          : "");
    }

    if (document.getElementById("remember-toggle").checked) {
      localStorage.setItem(
        "lastCity",
        document.getElementById("city").value.trim(),
      );
      if (data.coord) {
        localStorage.setItem("lastLat", data.coord.lat);
        localStorage.setItem("lastLon", data.coord.lon);
        localStorage.setItem("lastCityName", finalCityName);
      }
    }
    const timezone = data.timezone;
    const iconCode = data.weather[0].icon;
    const humidity = data.main.humidity;
    const wind = data.wind ? data.wind.speed || 0 : 0;
    const windDeg = data.wind ? data.wind.deg || 0 : 0;
    const directions = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    const windDir = directions[Math.round(windDeg / 22.5) % 16];

    let precip = 0;
    let precipCondition = "No Precipitation";
    let precipColor = "rgba(255,255,255,0.7)";

    if (
      data.rain &&
      (data.rain["1h"] !== undefined || data.rain["3h"] !== undefined)
    ) {
      precip =
        data.rain["1h"] !== undefined ? data.rain["1h"] : data.rain["3h"] / 3;
      if (precip < 0.1) {
        precipCondition = "No Precipitation";
        precipColor = "rgba(255,255,255,0.7)";
      } else if (precip < 0.25) {
        precipCondition = "Very Light Rain";
        precipColor = "#e3f2fd";
      } else if (precip < 2.5) {
        precipCondition = "Light Rain";
        precipColor = "#90caf9";
      } else if (precip < 7.6) {
        precipCondition = "Moderate Rain";
        precipColor = "#ffb74d";
      } else if (precip < 15) {
        precipCondition = "Heavy Rain";
        precipColor = "#ef5350";
      } else if (precip < 30) {
        precipCondition = "Very Heavy Rain";
        precipColor = "#d32f2f";
      } else if (precip <= 50) {
        precipCondition = "Intense Rain";
        precipColor = "#c62828";
      } else {
        precipCondition = "Extreme Rain";
        precipColor = "#b71c1c";
      }
    } else if (
      data.snow &&
      (data.snow["1h"] !== undefined || data.snow["3h"] !== undefined)
    ) {
      precip =
        data.snow["1h"] !== undefined ? data.snow["1h"] : data.snow["3h"] / 3;
      if (precip < 0.1) {
        precipCondition = "No Precipitation";
        precipColor = "rgba(255,255,255,0.7)";
      } else if (precip < 1) {
        precipCondition = "Light Snow";
        precipColor = "#e0f7fa";
      } else if (precip < 3) {
        precipCondition = "Moderate Snow";
        precipColor = "#b2ebf2";
      } else if (precip <= 7) {
        precipCondition = "Heavy Snow";
        precipColor = "#80deea";
      } else {
        precipCondition = "Very Heavy Snow";
        precipColor = "#4dd0e1";
      }
    }

    const feelsLike = Math.round(data.main.feels_like);
    const cloudCover = data.clouds ? data.clouds.all : 0;
    let pressureTrend = "steady";

    let displayTemp =
      currentUnits.temp === "Fahrenheit" ? (temp * 9) / 5 + 32 : temp;
    let displayFeelsLike =
      currentUnits.temp === "Fahrenheit" ? (feelsLike * 9) / 5 + 32 : feelsLike;
    let tempUnit = currentUnits.temp === "Fahrenheit" ? "°F" : "°C";

    let displayPrecip = precip;
    let precipFixed = 1;
    if (currentUnits.precip === "cm") {
      displayPrecip = precip / 10;
      precipFixed = 2;
    } else if (currentUnits.precip === "in") {
      displayPrecip = precip / 25.4;
      precipFixed = 2;
    }
    let precipStr = displayPrecip.toFixed(precipFixed);
    if (Number(precipStr) === 0) precipStr = "0";

    let displayWind;
    if (currentUnits.wind === "mph") displayWind = wind * 2.23694;
    else if (currentUnits.wind === "m/s") displayWind = wind;
    else displayWind = wind * 3.6;
    let windStr = Math.round(displayWind);

    const visibilityVal =
      (data.visibility !== undefined ? data.visibility : 10000) / 1000;
    let displayVis = visibilityVal;
    if (currentUnits.vis === "mi") displayVis = visibilityVal * 0.621371;
    let visStr = displayVis.toFixed(1);
    if (Number(visStr) === 0) visStr = "0";

    const pressureHpa = data.main.pressure;
    let displayPress;
    if (currentUnits.press === "hPa") displayPress = pressureHpa;
    else if (currentUnits.press === "mb") displayPress = pressureHpa;
    else displayPress = pressureHpa / 1013.25;
    let pressStr =
      currentUnits.press === "atm"
        ? Number(displayPress.toFixed(2)).toString()
        : Math.round(displayPress);

    let pressColor, pressLabel;
    if (pressureHpa < 995) {
      pressLabel = "Very Low";
      pressColor = "#e53935";
    } else if (pressureHpa < 1010) {
      pressLabel = "Low";
      pressColor = "#fb8c00";
    } else if (pressureHpa <= 1020) {
      pressLabel = "Normal";
      pressColor = "#43a047";
    } else if (pressureHpa <= 1030) {
      pressLabel = "High";
      pressColor = "#42a5f5";
    } else {
      pressLabel = "Very High";
      pressColor = "#1565c0";
    }

    const visibility = visibilityVal.toFixed(1);
    let visColor, visLabel;
    if (visibilityVal < 0.05) {
      visLabel = "Critical";
      visColor = "#6a1b9a";
    } else if (visibilityVal < 0.2) {
      visLabel = "Severe";
      visColor = "#c62828";
    } else if (visibilityVal < 0.5) {
      visLabel = "Poor";
      visColor = "#ef5350";
    } else if (visibilityVal < 1) {
      visLabel = "Low";
      visColor = "#fb8c00";
    } else if (visibilityVal < 2) {
      visLabel = "Moderate";
      visColor = "#ffb300";
    } else if (visibilityVal < 5) {
      visLabel = "Fair";
      visColor = "#fdd835";
    } else if (visibilityVal < 10) {
      visLabel = "Good";
      visColor = "#8bc34a";
    } else {
      visLabel = "Excellent";
      visColor = "#00c853";
    }

    const lat = geoLat;
    const lon = geoLon;

    // Fetch Air Quality data and Hourly/Daily Forecast data from Open-Meteo
    const [aqResponse, uvResponse] = await Promise.all([
      fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,ozone,sulphur_dioxide,nitrogen_dioxide&hourly=grass_pollen,alder_pollen,birch_pollen,ragweed_pollen&timezone=auto`,
      ),
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max,precipitation_probability_max,temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation_probability,dew_point_2m,is_day,rain,snowfall,uv_index&timezone=auto&forecast_days=8`,
      ),
    ]);

    const [aqData, uvData] = await Promise.all([
      aqResponse.json(),
      uvResponse.json(),
    ]);

    // Fetch official government weather alerts Using WeatherAPI.com exclusively for global alerts
    let officialAlerts = [];
    let astroData = null;

    try {
      const alertsRes = await fetch(
        `/api/weather?action=alerts&lat=${lat}&lon=${lon}`,
      );
      if (alertsRes.ok) {
        const alertsData = await alertsRes.json();
        if (
          alertsData.forecast &&
          alertsData.forecast.forecastday &&
          alertsData.forecast.forecastday.length > 0
        ) {
          astroData = alertsData.forecast.forecastday[0].astro;
        }
        if (
          alertsData.alerts &&
          alertsData.alerts.alert &&
          alertsData.alerts.alert.length > 0
        ) {
          alertsData.alerts.alert.forEach((alertItem) => {
            officialAlerts.push(alertItem.event);
          });
        }
      }
    } catch (err) {
      console.warn("WeatherAPI Alerts fetch failed.", err);
    }

    const aqi =
      aqData && aqData.current && aqData.current.us_aqi !== undefined
        ? aqData.current.us_aqi
        : 0;

    const pm10Raw =
      aqData && aqData.current && aqData.current.pm10 !== undefined
        ? aqData.current.pm10
        : "-";
    const pm25Raw =
      aqData && aqData.current && aqData.current.pm2_5 !== undefined
        ? aqData.current.pm2_5
        : "-";
    const coRaw =
      aqData && aqData.current && aqData.current.carbon_monoxide !== undefined
        ? aqData.current.carbon_monoxide
        : "-";
    const o3Raw =
      aqData && aqData.current && aqData.current.ozone !== undefined
        ? aqData.current.ozone
        : "-";
    const so2Raw =
      aqData && aqData.current && aqData.current.sulphur_dioxide !== undefined
        ? aqData.current.sulphur_dioxide
        : "-";
    const no2Raw =
      aqData && aqData.current && aqData.current.nitrogen_dioxide !== undefined
        ? aqData.current.nitrogen_dioxide
        : "-";

    // Convert pollutant raw values to appropriate units and evaluate severity status from Open-Meteo
    const pm10 = pm10Raw !== "-" ? Math.round(pm10Raw) : "-";
    const pm25 = pm25Raw !== "-" ? Math.round(pm25Raw) : "-";
    const co = coRaw !== "-" ? Math.round(coRaw * 0.873) : "-";
    const o3 = o3Raw !== "-" ? Math.round(o3Raw * 0.509) : "-";
    const so2 = so2Raw !== "-" ? Math.round(so2Raw * 0.382) : "-";
    const no2 = no2Raw !== "-" ? Math.round(no2Raw * 0.532) : "-";

    const getPollutantStatus = (val, thresholds) => {
      if (val === "-") return { label: "-", color: "#fff" };
      if (val <= thresholds[0]) return { label: "Good", color: "#00e400" };
      if (val <= thresholds[1]) return { label: "Moderate", color: "#ffff00" };
      if (val <= thresholds[2]) return { label: "Poor", color: "#ff7e00" };
      if (val <= thresholds[3]) return { label: "Unhealthy", color: "#ff2323" };
      if (val <= thresholds[4]) return { label: "Severe", color: "#8f3f97" };
      return { label: "Hazardous", color: "#ff002f" };
    };

    const pm10Status = getPollutantStatus(pm10, [54, 154, 254, 354, 424]);
    const pm25Status = getPollutantStatus(pm25, [30, 60, 90, 120, 250]);
    const coStatus = getPollutantStatus(co, [8330, 16670, 25000, 33330, 41670]);
    const o3Status = getPollutantStatus(o3, [50, 100, 168, 208, 748]);
    const so2Status = getPollutantStatus(so2, [40, 80, 380, 800, 1600]);
    const no2Status = getPollutantStatus(no2, [40, 80, 180, 190, 400]);

    let aqiColor, aqiLabel, aqiDarkColor;
    if (aqi <= 50) {
      aqiColor = "#00e400";
      aqiLabel = "Good";
      aqiDarkColor = "#057d05";
    } else if (aqi <= 100) {
      aqiColor = "#ffff00";
      aqiLabel = "Moderate";
      aqiDarkColor = "#b5b504";
    } else if (aqi <= 150) {
      aqiColor = "#ff7e00";
      aqiLabel = "Poor";
      aqiDarkColor = "#c26406";
    } else if (aqi <= 200) {
      aqiColor = "#ff007f";
      aqiLabel = "Unhealthy";
      aqiDarkColor = "#c20463";
    } else if (aqi <= 300) {
      aqiColor = "#8f3f97";
      aqiLabel = "Severe";
      aqiDarkColor = "#6e026e";
    } else {
      aqiColor = "#7e0023";
      aqiLabel = "Hazardous";
      aqiDarkColor = "#200000";
    }

    let tempCityTime = new Date(
      new Date().getTime() +
        new Date().getTimezoneOffset() * 60000 +
        1000 * timezone,
    );
    let tempLocTimeStr = `${tempCityTime.getFullYear()}-${String(tempCityTime.getMonth() + 1).padStart(2, "0")}-${String(tempCityTime.getDate()).padStart(2, "0")}T${String(tempCityTime.getHours()).padStart(2, "0")}:00`;
    let tempHourIdx =
      uvData && uvData.hourly && uvData.hourly.time
        ? uvData.hourly.time.indexOf(tempLocTimeStr)
        : -1;
    if (tempHourIdx === -1) tempHourIdx = tempCityTime.getHours();

    const uvIndex =
      uvData &&
      uvData.hourly &&
      uvData.hourly.uv_index &&
      uvData.hourly.uv_index[tempHourIdx] !== undefined
        ? Number(uvData.hourly.uv_index[tempHourIdx].toFixed(1))
        : 0;
    const precipProb =
      uvData &&
      uvData.hourly &&
      uvData.hourly.precipitation_probability &&
      uvData.hourly.precipitation_probability[tempHourIdx] !== undefined
        ? uvData.hourly.precipitation_probability[tempHourIdx]
        : 0;

    let uvColor, uvLabel;
    if (uvIndex <= 2) {
      uvColor = "#00e400";
      uvLabel = "Low";
    } else if (uvIndex <= 5) {
      uvColor = "#ffff00";
      uvLabel = "Moderate";
    } else if (uvIndex <= 7) {
      uvColor = "#ff7e00";
      uvLabel = "High";
    } else if (uvIndex <= 10) {
      uvColor = "#ff0000";
      uvLabel = "Very High";
    } else {
      uvColor = "#54025c";
      uvLabel = "Extreme";
    }

    let humidityColor, humidityLabel;
    if (humidity < 20) {
      humidityColor = "#e53935";
      humidityLabel = "Very Dry";
    } else if (humidity < 30) {
      humidityColor = "#fb8c00";
      humidityLabel = "Dry";
    } else if (humidity < 50) {
      humidityColor = "#8bc34a";
      humidityLabel = "Comfortable";
    } else if (humidity <= 60) {
      humidityColor = "#43a047";
      humidityLabel = "Ideal";
    } else if (humidity <= 70) {
      humidityColor = "#fb8c00";
      humidityLabel = "Humid";
    } else if (humidity <= 85) {
      humidityColor = "#ef5350";
      humidityLabel = "Very Humid";
    } else {
      humidityColor = "#c62828";
      humidityLabel = "Extreme Humid";
    }

    let windColor, windLabel;
    const windKmh = wind * 3.6;
    if (windKmh < 2) {
      windColor = "#404ff5";
      windLabel = "Calm";
    } else if (windKmh < 6) {
      windColor = "#52d3fa";
      windLabel = "Light Air";
    } else if (windKmh < 12) {
      windColor = "#46eefa";
      windLabel = "Light Breeze";
    } else if (windKmh < 20) {
      windColor = "#04b518";
      windLabel = "Gentle Breeze";
    } else if (windKmh < 29) {
      windColor = "#02f71f";
      windLabel = "Moderate Breeze";
    } else if (windKmh < 39) {
      windColor = "#b4fa1e";
      windLabel = "Fresh Breeze";
    } else if (windKmh < 50) {
      windColor = "#a0f73b";
      windLabel = "Strong Breeze";
    } else if (windKmh < 62) {
      windColor = "#e7f54e";
      windLabel = "Near Gale";
    } else if (windKmh < 75) {
      windColor = "#e8a143";
      windLabel = "Gale";
    } else if (windKmh < 89) {
      windColor = "#fa8f02";
      windLabel = "Strong Gale";
    } else if (windKmh < 103) {
      windColor = "#eb543d";
      windLabel = "Storm";
    } else if (windKmh < 118) {
      windColor = "#f02a0c";
      windLabel = "Violent Storm";
    } else {
      windColor = "#731203";
      windLabel = "Hurricane";
    }

    // Determine the specific weather condition to set appropriate background classes and icons
    const wId = data.weather[0].id;
    const isNight = iconCode.includes("n");

    if (wId === 800) {
      condition = isNight ? "Clear Sky" : "Sunny";
    } else if (wId === 801) {
      condition = "Few Clouds";
    } else if (wId === 802) {
      condition = isNight ? "Partly Cloudy" : "Partly Sunny";
    } else if (wId === 803) {
      condition = "Mostly Cloudy";
    } else if (wId === 804) {
      condition = "Overcast";
    } else if (wId === 701) {
      condition = "Mist";
    } else if (wId === 721) {
      condition = isNight ? "Haze Night" : "Haze";
    } else if (wId === 741) {
      condition = "Fog";
    } else if (wId === 781) {
      condition = "Tornado";
    }

    let weatherClass = "";
    let amIcon = "";

    if (wId >= 200 && wId < 300) {
      if (wId === 212) {
        weatherClass = isNight
          ? "severe-thunderstorm-night"
          : "severe-thunderstorm-day";
        amIcon = "severe-thunderstorm";
      } else if (
        wId === 200 ||
        wId === 201 ||
        wId === 202 ||
        (wId >= 230 && wId <= 232)
      ) {
        weatherClass = isNight
          ? "thunderstorm-rain-night"
          : "thunderstorm-rain-day";
        amIcon = "thunderstorm-rain";
      } else {
        weatherClass = isNight ? "thunderstorm-night" : "thunderstorm-day";
        amIcon = "thunderstorm";
      }
    } else if (wId >= 300 && wId < 400) {
      weatherClass = isNight ? "drizzle-night" : "drizzle-day";
      amIcon = "drizzle";
    } else if (wId >= 500 && wId < 600) {
      if (wId === 501) {
        weatherClass = isNight ? "moderate-rain-night" : "moderate-rain-day";
        amIcon = "rain";
      } else if (wId === 502 || wId === 503 || wId === 522) {
        weatherClass = isNight ? "heavy-rain-night" : "heavy-rain-day";
        amIcon = "extreme-rain";
      } else if (wId === 504) {
        weatherClass = isNight ? "extreme-rain-night" : "extreme-rain-day";
        amIcon = "extreme-rain";
      } else {
        weatherClass = isNight ? "rain-night" : "rain-day";
        amIcon = "rain";
      }
    } else if (wId >= 600 && wId < 700) {
      if (wId === 600 || wId === 620) {
        weatherClass = isNight ? "light-snow-night" : "light-snow-day";
        amIcon = "snow";
      } else if (wId === 602 || wId === 622) {
        weatherClass = isNight ? "heavy-snow-night" : "heavy-snow-day";
        amIcon = "extreme-snow";
      } else if (wId >= 611 && wId <= 616) {
        weatherClass = isNight ? "rain-snow-night" : "rain-snow-day";
        amIcon = "sleet";
      } else {
        weatherClass = isNight ? "snow-night" : "snow-day";
        amIcon = "snow";
      }
    } else if (wId >= 700 && wId < 800) {
      weatherClass = isNight ? "fog-night" : "fog-day";
      if (wId === 701) amIcon = "mist";
      else if (
        wId === 711 ||
        wId === 721 ||
        wId === 731 ||
        wId === 751 ||
        wId === 761 ||
        wId === 762
      )
        amIcon = "haze";
      else amIcon = "fog";
    } else if (wId === 800 || wId === 801) {
      weatherClass = isNight ? "clear-night" : "clear-day";
      amIcon = isNight ? "clear-night" : "clear-day";
    } else if (wId === 802) {
      weatherClass = isNight ? "partly-cloudy-night" : "partly-cloudy-day";
      amIcon = isNight ? "partly-cloudy" : "partly-sunny";
    } else if (wId === 803) {
      weatherClass = isNight ? "cloudy-night" : "cloudy-day";
      amIcon = isNight ? "mostly-cloudy_night" : "mostly-cloudy";
    } else if (wId === 804) {
      weatherClass = isNight ? "overcast-night" : "overcast-day";
      amIcon = "overcast";
    } else {
      weatherClass = isNight ? "clear-night" : "clear-day";
      amIcon = isNight ? "clear-night" : "clear-day";
    }

    const iconUrl = `assets/icons/${amIcon}.svg`;

    // Applying the determined weather class to the main container to trigger CSS backgrounds/animations
    const weatherBox = document.querySelector(".weather-box");

    const isAnimDisabled = weatherBox.classList.contains("disable-animations");
    const isAbout = weatherBox.classList.contains("about-mode");
    weatherBox.className = `weather-box${isAnimDisabled ? " disable-animations" : ""}${isAbout ? " about-mode" : ""}`;
    document.body.className = "";

    weatherClass.split(" ").forEach((cls) => {
      weatherBox.classList.add(cls);
      document.body.classList.add(cls);
    });

    // Initialize lightning animations if the weather condition warrants it
    Object.values(lightningTimers).forEach(clearTimeout);
    lightningTimers = {};
    document
      .querySelectorAll(".lightning")
      .forEach((el) => el.classList.remove("striking"));
    document
      .querySelectorAll(".thunder-flash")
      .forEach((el) => el.classList.remove("flashing"));
    if (weatherClass.includes("thunderstorm")) {
      lightningTimers[".lightning-1"] = setTimeout(
        () => triggerLightning(".lightning-1"),
        Math.random() * 3000,
      );
      lightningTimers[".lightning-2"] = setTimeout(
        () => triggerLightning(".lightning-2"),
        Math.random() * 4000 + 2000,
      );
      lightningTimers[".lightning-3"] = setTimeout(
        () => triggerLightning(".lightning-3"),
        Math.random() * 5000 + 1000,
      );
      lightningTimers[".lightning-4"] = setTimeout(
        () => triggerLightning(".lightning-4"),
        Math.random() * 6000 + 2000,
      );
      lightningTimers[".thunder-flash-1"] = setTimeout(
        () => triggerThunderFlash(".thunder-flash-1"),
        Math.random() * 2000 + 1000,
      );
      lightningTimers[".thunder-flash-2"] = setTimeout(
        () => triggerThunderFlash(".thunder-flash-2"),
        Math.random() * 3000 + 2000,
      );
      lightningTimers[".thunder-flash-3"] = setTimeout(
        () => triggerThunderFlash(".thunder-flash-3"),
        Math.random() * 2500 + 1500,
      );
    }

    if (precip <= 0.5) {
      weatherBox.classList.add("no-rain");
    }

    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const cityTime = new Date(utc + 1000 * timezone);

    const locYear = cityTime.getFullYear();
    const locMonth = String(cityTime.getMonth() + 1).padStart(2, "0");
    const locDay = String(cityTime.getDate()).padStart(2, "0");
    const locHour = String(cityTime.getHours()).padStart(2, "0");
    const locTimeStr = `${locYear}-${locMonth}-${locDay}T${locHour}:00`;

    const formatLocalTime = (unixSecs) => {
      const d = new Date(unixSecs * 1000);
      const utc = d.getTime() + d.getTimezoneOffset() * 60000;
      const localD = new Date(utc + 1000 * timezone);
      let h = localD.getHours();
      let m = localD.getMinutes().toString().padStart(2, "0");
      if (
        typeof currentTimeFormat !== "undefined" &&
        currentTimeFormat === "24-hour"
      ) {
        return `${h.toString().padStart(2, "0")}:${m}`;
      } else {
        let ampm = h >= 12 ? "PM" : "AM";
        let h12 = h % 12 || 12;
        return `${h12}:${m} ${ampm}`;
      }
    };

    let sunriseTime =
      data.sys && data.sys.sunrise
        ? formatLocalTime(data.sys.sunrise)
        : "--:-- AM";
    let sunsetTime =
      data.sys && data.sys.sunset
        ? formatLocalTime(data.sys.sunset)
        : "--:-- PM";

    const formatAstroTime = (timeStr) => {
      if (!timeStr || timeStr.startsWith("--")) return timeStr;
      if (
        typeof currentTimeFormat !== "undefined" &&
        currentTimeFormat === "24-hour"
      ) {
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (match) {
          let h = parseInt(match[1], 10);
          const m = match[2];
          const ampm = match[3].toUpperCase();
          if (ampm === "PM" && h < 12) h += 12;
          if (ampm === "AM" && h === 12) h = 0;
          return `${h.toString().padStart(2, "0")}:${m}`;
        }
      }
      return timeStr;
    };

    let moonriseTime =
      astroData && astroData.moonrise
        ? formatAstroTime(astroData.moonrise)
        : "--:--";
    let moonsetTime =
      astroData && astroData.moonset
        ? formatAstroTime(astroData.moonset)
        : "--:--";

    // Highly Accurate Moon Phase, Age, and Illumination Calculation
    const synodicMonth = 29.53058867;
    const knownNewMoon = 1704974220; // Jan 11, 2024, 11:57 UTC
    const currentUnix = Math.floor(Date.now() / 1000);
    const diffDays = (currentUnix - knownNewMoon) / 86400;
    let lunarCycles = diffDays / synodicMonth;
    let phasePercent = lunarCycles - Math.floor(lunarCycles);

    let moonAge = (phasePercent * synodicMonth).toFixed(1);
    let moonIllumination = Math.round(
      ((1 - Math.cos(phasePercent * 2 * Math.PI)) / 2) * 100,
    );

    let moonPhase = "Unknown";
    if (typeof astroData !== "undefined" && astroData && astroData.moon_phase) {
      moonPhase = astroData.moon_phase;
      if (astroData.moon_illumination !== undefined) {
        moonIllumination = parseInt(astroData.moon_illumination, 10);
      }
    } else {
      if (moonAge < 1 || moonAge > 28.53) moonPhase = "New Moon";
      else if (moonAge < 6.4) moonPhase = "Waxing Crescent";
      else if (moonAge < 8.4) moonPhase = "First Quarter";
      else if (moonAge < 13.8) moonPhase = "Waxing Gibbous";
      else if (moonAge < 15.8) moonPhase = "Full Moon";
      else if (moonAge < 21.1) moonPhase = "Waning Gibbous";
      else if (moonAge < 23.1) moonPhase = "Last Quarter";
      else moonPhase = "Waning Crescent";
    }

    const moonIconMap = {
      "New Moon": "moon_new-moon.svg",
      "Waxing Crescent": "moon_waxing-crescent.svg",
      "First Quarter": "moon_first-quarter.svg",
      "Waxing Gibbous": "moon_waxing-gibbous.svg",
      "Full Moon": "moon_full-moon.svg",
      "Waning Gibbous": "moon_waning-gibbous.svg",
      "Last Quarter": "moon_last-quarter.svg",
      "Waning Crescent": "moon_waning-crescent.svg",
    };
    const moonIconFile = moonIconMap[moonPhase] || "moon_new-moon.svg";

    let sunPercent = 0;
    let daylightDurationStr = "--h --m";
    if (data.sys && data.sys.sunrise && data.sys.sunset) {
      const currentUnix = Math.floor(Date.now() / 1000);
      const sr = data.sys.sunrise;
      const ss = data.sys.sunset;
      const duration = ss - sr;
      if (duration > 0) {
        const hours = Math.floor(duration / 3600);
        const mins = Math.floor((duration % 3600) / 60);
        daylightDurationStr = `${hours}h ${mins}m`;
      }

      if (currentUnix < sr) {
        sunPercent = 0;
      } else if (currentUnix > ss) {
        sunPercent = 1;
      } else {
        sunPercent = (currentUnix - sr) / (ss - sr);
      }
    } else {
      const hour = cityTime.getHours() + cityTime.getMinutes() / 60;
      if (hour < 6) sunPercent = 0;
      else if (hour > 18) sunPercent = 1;
      else sunPercent = (hour - 6) / 12;
    }

    let mappedPercent = 0.035 + sunPercent * 0.93;
    let sunX = mappedPercent * 100;
    let sunY = 79.598 - Math.sqrt(4489 - Math.pow(sunX - 50, 2));
    let sunLeftCalc = `calc(${sunX}% + ${mappedPercent * 22 - 11}px)`;
    let sunTopCalc = `${sunY - 13}px`;

    let currentHourIndex = -1;
    if (uvData && uvData.hourly && uvData.hourly.time) {
      currentHourIndex = uvData.hourly.time.indexOf(locTimeStr);
    }
    if (currentHourIndex === -1) {
      currentHourIndex = cityTime.getHours();
    }

    // Pollen Data processing
    let grassPollen = 0,
      treePollen = 0,
      weedPollen = 0;
    if (aqData && aqData.hourly && aqData.hourly.time) {
      let aqHourIndex = aqData.hourly.time.indexOf(locTimeStr);
      if (aqHourIndex === -1) aqHourIndex = currentHourIndex;

      if (aqHourIndex !== -1) {
        grassPollen = aqData.hourly.grass_pollen
          ? aqData.hourly.grass_pollen[aqHourIndex] || 0
          : 0;
        let alder = aqData.hourly.alder_pollen
          ? aqData.hourly.alder_pollen[aqHourIndex] || 0
          : 0;
        let birch = aqData.hourly.birch_pollen
          ? aqData.hourly.birch_pollen[aqHourIndex] || 0
          : 0;
        treePollen = alder + birch;
        weedPollen = aqData.hourly.ragweed_pollen
          ? aqData.hourly.ragweed_pollen[aqHourIndex] || 0
          : 0;
      }
    }

    const getPollenStatus = (val, type) => {
      if (val === null || val === undefined || val === 0)
        return { label: "None", color: "#03a803" };
      let thresholds;
      if (type === "grass") thresholds = [5, 20, 80, 200];
      else if (type === "tree") thresholds = [10, 15, 90, 1500];
      else thresholds = [5, 10, 50, 500];
      if (val < thresholds[0]) return { label: "Very Low", color: "#40e320" };
      if (val < thresholds[1]) return { label: "Low", color: "#69db18" };
      if (val < thresholds[2]) return { label: "Medium", color: "#f7c202" };
      if (val < thresholds[3]) return { label: "High", color: "#fc1c1c" };
      return { label: "Very High", color: "#ab0231" };
    };

    const grassStatus = getPollenStatus(grassPollen, "grass");
    const treeStatus = getPollenStatus(treePollen, "tree");
    const weedStatus = getPollenStatus(weedPollen, "weed");

    const dewPoint =
      uvData &&
      uvData.hourly &&
      uvData.hourly.dew_point_2m &&
      uvData.hourly.dew_point_2m[currentHourIndex] !== undefined
        ? Math.round(uvData.hourly.dew_point_2m[currentHourIndex])
        : "N/A";

    let displayDew = dewPoint;
    if (dewPoint !== "N/A" && currentUnits.temp === "Fahrenheit") {
      displayDew = Math.round((dewPoint * 9) / 5 + 32);
    }
    let dewUnitStr =
      dewPoint !== "N/A"
        ? currentUnits.temp === "Fahrenheit"
          ? "°F"
          : "°C"
        : "";

    let dewColor, dewLabel;
    if (typeof dewPoint === "number") {
      if (dewPoint < 10) {
        dewColor = "#66f2ae";
        dewLabel = "Dry";
      } else if (dewPoint < 15) {
        dewColor = "#00e400";
        dewLabel = "Comfortable";
      } else if (dewPoint < 18) {
        dewColor = "#ffff00";
        dewLabel = "Pleasant";
      } else if (dewPoint < 21) {
        dewColor = "#ff7e00";
        dewLabel = "Humid";
      } else if (dewPoint < 24) {
        dewColor = "#ff0000";
        dewLabel = "Very Humid";
      } else {
        dewColor = "#de1e00";
        dewLabel = "Extreme Humid";
      }
    } else {
      dewColor = "#fff";
      dewLabel = "-";
    }

    let smartAlerts = [];
    if (window.generateSmartAlerts) {
      smartAlerts = window.generateSmartAlerts({
        officialAlerts,
        temp,
        windKmh,
        uvData,
        wId,
        currentHourIndex,
        aqi,
        precip,
        visibility,
        uvIndex,
        feelsLike,
        humidity,
        currentTimeFormat,
        currentUnits,
        pressureTrend,
        pressureHpa,
        grassStatus,
        treeStatus,
        weedStatus,
        displayFeelsLike,
        dewPoint,
        cloudCover,
        visibilityVal,
        isNight,
      });
    }
    if (smartAlerts.length === 0) {
      smartAlerts.push(
        "✅ The weather looks calm and stable for the next 12 hours.",
      );
      smartAlerts.push("🌤️ A great day to go about your normal routine.");
    }

    // Restore formatHour for UI usage
    const formatHour = (index) => {
      if (index === -1) return "";
      if (!uvData || !uvData.hourly || !uvData.hourly.time) return "";
      const timeStr = uvData.hourly.time[index];
      const hour = parseInt(timeStr.split("T")[1].substring(0, 2));
      if (
        typeof currentTimeFormat !== "undefined" &&
        currentTimeFormat === "24-hour"
      ) {
        return `${hour.toString().padStart(2, "0")}:00`;
      } else {
        let ampm = hour >= 12 ? "pm" : "am";
        let h = hour % 12 || 12;
        return `${h} ${ampm}`;
      }
    };

    // Build the SVG chart for Hourly Forecasts (Temperature and Precipitation)
    let hourlyTempHtml = "";
    let hourlyPrecipHtml = "";
    if (
      uvData &&
      uvData.hourly &&
      uvData.hourly.time &&
      currentHourIndex !== -1
    ) {
      const numHours = 12;
      const pointWidth = 40; // spacing between points
      const chartWidth = numHours * pointWidth;
      const chartHeight = 60; // top part for curve and temp
      const totalHeight = 100; // 60 + icon (30) + label (10)

      let temps = [];
      let hoursData = [];
      let precipPoints = [];

      for (let i = currentHourIndex; i < currentHourIndex + numHours; i++) {
        if (i >= uvData.hourly.temperature_2m.length) break;
        let t = uvData.hourly.temperature_2m[i];
        let dTemp =
          currentUnits.temp === "Fahrenheit"
            ? Math.round((t * 9) / 5 + 32)
            : Math.round(t);
        temps.push(dTemp);

        let hCode = uvData.hourly.weather_code[i];
        let isDay = uvData.hourly.is_day ? uvData.hourly.is_day[i] : 1;

        let hIcon = "clear-day";
        if (hCode === 0 || hCode === 1)
          hIcon = isDay ? "clear-day" : "clear-night";
        else if (hCode === 2) hIcon = isDay ? "partly-sunny" : "partly-cloudy";
        else if (hCode === 3) hIcon = "overcast";
        else if (hCode === 45 || hCode === 48) hIcon = "fog";
        else if (hCode >= 51 && hCode <= 57) hIcon = "drizzle";
        else if (hCode === 65 || hCode === 67 || hCode === 82)
          hIcon = "extreme-rain";
        else if (hCode >= 61 && hCode <= 67) hIcon = "rain";
        else if (hCode >= 80 && hCode <= 82) hIcon = "rain";
        else if (hCode === 75 || hCode === 77 || hCode === 86)
          hIcon = "extreme-snow";
        else if (hCode >= 71 && hCode <= 77) hIcon = "snow";
        else if (hCode >= 85 && hCode <= 86) hIcon = "snow";
        else if (hCode >= 96) hIcon = "severe-thunderstorm";
        else if (hCode >= 95) hIcon = "thunderstorm";

        let timeStr = i === currentHourIndex ? "Now" : formatHour(i);
        hoursData.push({ temp: dTemp, icon: hIcon, timeStr });

        let hPrecip =
          uvData.hourly.precipitation_probability &&
          uvData.hourly.precipitation_probability[i] !== undefined
            ? uvData.hourly.precipitation_probability[i]
            : 0;
        precipPoints.push(hPrecip);
      }

      if (temps.length > 0) {
        let minT = Math.min(...temps);
        let maxT = Math.max(...temps);
        let range = maxT - minT;

        // Enforce a minimum temperature range to reduce vertical stretching
        if (range < 10) {
          let padding = (10 - range) / 2;
          minT -= padding;
          maxT += padding;
          range = 10;
        }

        let points = [];
        let labelsHtml = "";

        for (let j = 0; j < hoursData.length; j++) {
          let x = (j + 0.5) * pointWidth;
          let normalizedY = (hoursData[j].temp - minT) / range;
          // Y goes from 24 (max temp) to 48 (min temp) for less vertical distance
          let y = 24 + (1 - normalizedY) * 24;
          points.push(`${x},${y}`);

          labelsHtml += `
                      <div style="position: absolute; left: ${x}px; top: 0; width: ${pointWidth}px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; pointer-events: none; height: ${totalHeight}px;">
                          <span style="position: absolute; top: ${y - 22}px; font-size: 0.65rem; font-weight: bold; color: inherit;">${hoursData[j].temp}°</span>
                          <img src="assets/icons/${hoursData[j].icon}.svg" style="position: absolute; top: 55px; width: 28px; height: 28px; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4));" alt="${hoursData[j].icon}" draggable="false">
                          <span style="position: absolute; top: 85px; font-size: 0.55rem; opacity: 0.8; white-space: nowrap; color: inherit;">${hoursData[j].timeStr}</span>
                      </div>
                  `;
        }

        let pathD = `M ${points[0]}`;
        for (let j = 1; j < points.length; j++) {
          let prev = points[j - 1].split(",").map(Number);
          let curr = points[j].split(",").map(Number);
          let midX = (prev[0] + curr[0]) / 2;
          pathD += ` C ${midX},${prev[1]} ${midX},${curr[1]} ${curr[0]},${curr[1]}`;
        }

        hourlyTempHtml = `
                  <div id="hourly-temp-content" style="display: block; position: relative; width: ${chartWidth}px; height: ${totalHeight}px;">
                      <svg width="${chartWidth}" height="${totalHeight}" style="position: absolute; top: 0; left: 0; overflow: visible;">
                          <path d="${pathD}" fill="none" stroke="orange" stroke-width="2" stroke-linecap="round"></path>
                          ${points.map((p) => `<circle cx="${p.split(",")[0]}" cy="${p.split(",")[1]}" r="3" fill="#fff" stroke="rgba(0,0,0,0.3)" stroke-width="1.5" />`).join("")}
                      </svg>
                      ${labelsHtml}
                  </div>
              `;

        let pLabelsHtml = "";
        let pBarsHtml = "";
        for (let j = 0; j < precipPoints.length; j++) {
          let x = (j + 0.5) * pointWidth;
          let barHeight = (precipPoints[j] / 100) * 35;
          let y = 50 - barHeight;

          if (precipPoints[j] > 0) {
            pBarsHtml += `<rect x="${j * pointWidth}" y="${y}" width="${pointWidth}" height="${barHeight}" fill="rgba(11, 35, 58, 1)" />`;
            pBarsHtml += `<line x1="${j * pointWidth}" y1="${y}" x2="${j * pointWidth + pointWidth}" y2="${y}" stroke="rgba(56, 103, 182)" stroke-width="2" />`;
          }

          pLabelsHtml += `
                      <div style="position: absolute; left: ${x}px; top: 0; width: ${pointWidth}px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; pointer-events: none; height: ${totalHeight}px;">
                          <span style="position: absolute; top: ${y - 20}px; font-size: 0.6rem; font-weight: bold; color: inherit;">${precipPoints[j]}%</span>
                          <img src="assets/icons/${hoursData[j].icon}.svg" style="position: absolute; top: 55px; width: 28px; height: 28px; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4));" alt="${hoursData[j].icon}" draggable="false">
                          <span style="position: absolute; top: 85px; font-size: 0.55rem; opacity: 0.8; white-space: nowrap; color: inherit;">${hoursData[j].timeStr}</span>
                      </div>
                  `;
        }

        hourlyPrecipHtml = `
                  <div id="hourly-precip-content" style="display: none; position: relative; width: ${chartWidth}px; height: ${totalHeight}px;">
                      <svg width="${chartWidth}" height="${totalHeight}" style="position: absolute; top: 0; left: 0; overflow: visible;">
                          <line x1="0" y1="50" x2="${chartWidth}" y2="50" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1" />
                          ${pBarsHtml}
                      </svg>
                      ${pLabelsHtml}
                  </div>
              `;
      }
    }

    // Build the SVG chart for Daily Forecasts (Temperature ranges and Precipitation)
    let dailyTempHtml = "";
    let dailyPrecipHtml = "";
    if (uvData && uvData.daily && uvData.daily.time) {
      const numDays = Math.min(8, uvData.daily.time.length);
      const pointWidth = 40;
      const chartWidth = numDays * pointWidth;
      const totalHeight = 100;

      let dailyTemps = [];
      let daysData = [];
      let dailyPrecipPoints = [];

      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      for (let i = 0; i < numDays; i++) {
        let t = uvData.daily.temperature_2m_max[i];
        let dTemp =
          currentUnits.temp === "Fahrenheit"
            ? Math.round((t * 9) / 5 + 32)
            : Math.round(t);
        dailyTemps.push(dTemp);

        let tMin = uvData.daily.temperature_2m_min[i];
        let dMinTemp =
          currentUnits.temp === "Fahrenheit"
            ? Math.round((tMin * 9) / 5 + 32)
            : Math.round(tMin);

        let dCode = uvData.daily.weather_code[i];

        let dIcon = "clear-day";
        if (dCode === 0 || dCode === 1) dIcon = "clear-day";
        else if (dCode === 2) dIcon = "partly-sunny";
        else if (dCode === 3) dIcon = "overcast";
        else if (dCode === 45 || dCode === 48) dIcon = "fog";
        else if (dCode >= 51 && dCode <= 57) dIcon = "drizzle";
        else if (dCode === 65 || dCode === 67 || dCode === 82)
          dIcon = "extreme-rain";
        else if (dCode >= 61 && dCode <= 67) dIcon = "rain";
        else if (dCode >= 80 && dCode <= 82) dIcon = "rain";
        else if (dCode === 75 || dCode === 77 || dCode === 86)
          dIcon = "extreme-snow";
        else if (dCode >= 71 && dCode <= 77) dIcon = "snow";
        else if (dCode >= 85 && dCode <= 86) dIcon = "snow";
        else if (dCode >= 96) dIcon = "severe-thunderstorm";
        else if (dCode >= 95) dIcon = "thunderstorm";

        let timeStr = "Today";
        if (i > 0) {
          let dateObj = new Date(uvData.daily.time[i] + "T00:00:00");
          timeStr = dayNames[dateObj.getDay()];
        }
        daysData.push({
          temp: dTemp,
          minTemp: dMinTemp,
          icon: dIcon,
          timeStr,
        });

        let dPrecip =
          uvData.daily.precipitation_probability_max &&
          uvData.daily.precipitation_probability_max[i] !== undefined
            ? uvData.daily.precipitation_probability_max[i]
            : 0;
        dailyPrecipPoints.push(dPrecip);
      }

      if (dailyTemps.length > 0) {
        let minT = Math.min(...dailyTemps);
        let maxT = Math.max(...dailyTemps);
        let range = maxT - minT;

        if (range < 10) {
          let padding = (10 - range) / 2;
          minT -= padding;
          maxT += padding;
          range = 10;
        }

        let points = [];
        let labelsHtml = "";

        for (let j = 0; j < daysData.length; j++) {
          let x = (j + 0.5) * pointWidth;
          let normalizedY = (daysData[j].temp - minT) / range;
          // Y goes from 24 (max temp) to 48 (min temp) for less vertical distance
          let y = 24 + (1 - normalizedY) * 24;
          points.push(`${x},${y}`);

          labelsHtml += `
                      <div style="position: absolute; left: ${x}px; top: 0; width: ${pointWidth}px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; pointer-events: none; height: ${totalHeight}px;">
                          <div style="position: absolute; top: ${y - 22}px; display: flex; flex-direction: row; align-items: baseline; line-height: 1; white-space: nowrap;">
                              <span style="font-size: 0.65rem; font-weight: bold; color: inherit;">${daysData[j].temp}°</span>
                              <span style="font-size: 0.45rem; opacity: 0.7; color: inherit;">/${daysData[j].minTemp}°</span>
                          </div>
                          <img src="assets/icons/${daysData[j].icon}.svg" style="position: absolute; top: 55px; width: 28px; height: 28px; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4));" alt="${daysData[j].icon}" draggable="false">
                          <span style="position: absolute; top: 85px; font-size: 0.55rem; opacity: 0.8; white-space: nowrap; color: inherit;">${daysData[j].timeStr}</span>
                      </div>
                  `;
        }

        let pathD = `M ${points[0]}`;
        for (let j = 1; j < points.length; j++) {
          let prev = points[j - 1].split(",").map(Number);
          let curr = points[j].split(",").map(Number);
          let midX = (prev[0] + curr[0]) / 2;
          pathD += ` C ${midX},${prev[1]} ${midX},${curr[1]} ${curr[0]},${curr[1]}`;
        }

        dailyTempHtml = `
                  <div id="daily-temp-content" style="display: block; position: relative; width: ${chartWidth}px; height: ${totalHeight}px;">
                      <svg width="${chartWidth}" height="${totalHeight}" style="position: absolute; top: 0; left: 0; overflow: visible;">
                          <path d="${pathD}" fill="none" stroke="orange" stroke-width="2" stroke-linecap="round"></path>
                          ${points.map((p) => `<circle cx="${p.split(",")[0]}" cy="${p.split(",")[1]}" r="3" fill="#fff" stroke="rgba(0,0,0,0.3)" stroke-width="1.5" />`).join("")}
                      </svg>
                      ${labelsHtml}
                  </div>
              `;

        let pLabelsHtml = "";
        let pBarsHtml = "";
        for (let j = 0; j < dailyPrecipPoints.length; j++) {
          let x = (j + 0.5) * pointWidth;
          let barHeight = (dailyPrecipPoints[j] / 100) * 35;
          let y = 50 - barHeight;

          if (dailyPrecipPoints[j] > 0) {
            pBarsHtml += `<rect x="${j * pointWidth}" y="${y}" width="${pointWidth}" height="${barHeight}" fill="rgba(11, 35, 58, 1)" />`;
            pBarsHtml += `<line x1="${j * pointWidth}" y1="${y}" x2="${j * pointWidth + pointWidth}" y2="${y}" stroke="rgba(56, 103, 182)" stroke-width="2" />`;
          }

          pLabelsHtml += `
                      <div style="position: absolute; left: ${x}px; top: 0; width: ${pointWidth}px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; pointer-events: none; height: ${totalHeight}px;">
                          <span style="position: absolute; top: ${y - 20}px; font-size: 0.6rem; font-weight: bold; color: inherit;">${dailyPrecipPoints[j]}%</span>
                          <img src="assets/icons/${daysData[j].icon}.svg" style="position: absolute; top: 55px; width: 28px; height: 28px; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4));" alt="${daysData[j].icon}" draggable="false">
                          <span style="position: absolute; top: 85px; font-size: 0.55rem; opacity: 0.8; white-space: nowrap; color: inherit;">${daysData[j].timeStr}</span>
                      </div>
                  `;
        }

        dailyPrecipHtml = `
                  <div id="daily-precip-content" style="display: none; position: relative; width: ${chartWidth}px; height: ${totalHeight}px;">
                      <svg width="${chartWidth}" height="${totalHeight}" style="position: absolute; top: 0; left: 0; overflow: visible;">
                          <line x1="0" y1="50" x2="${chartWidth}" y2="50" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1" />
                          ${pBarsHtml}
                      </svg>
                      ${pLabelsHtml}
                  </div>
              `;
      }
    }

    let humidityChangeHtml = "";
    if (
      uvData &&
      uvData.hourly &&
      uvData.hourly.relative_humidity_2m &&
      typeof currentHourIndex !== "undefined" &&
      currentHourIndex !== -1
    ) {
      let maxAbsDiff = -1;
      let bestDiff = 0;
      let bestHourOffset = 3;

      for (let offset = 2; offset <= 5; offset++) {
        let checkIndex = currentHourIndex + offset;
        if (checkIndex < uvData.hourly.relative_humidity_2m.length) {
          let fHumidity = uvData.hourly.relative_humidity_2m[checkIndex];
          let diff = fHumidity - humidity;
          let absDiff = Math.abs(Math.round(diff));
          if (absDiff > maxAbsDiff) {
            maxAbsDiff = absDiff;
            bestDiff = diff;
            bestHourOffset = offset;
          }
        }
      }

      if (maxAbsDiff > 0) {
        let isIncrease = bestDiff > 0;
        let arrowIcon = isIncrease ? "bx-trending-up" : "bx-trending-down";
        humidityChangeHtml = `
            <div class="detail-extra-col" style="text-align: right; display: flex; flex-direction: column; justify-content: center; margin-left: auto; margin-top: -10px; padding-right: -5px;">
                <span style="font-size: 0.75rem; color: inherit; font-weight: bold; display: flex; align-items: center; justify-content: flex-end; gap: 3px;">
                    <i class='bx ${arrowIcon}'></i> ${maxAbsDiff}%
                </span>
                <span style="font-size: 0.45rem; color: inherit; opacity: 0.7; margin-top: 2px;">in next ${bestHourOffset} hrs</span>
            </div>
        `;
      } else {
        humidityChangeHtml = `
            <div class="detail-extra-col" style="text-align: right; display: flex; flex-direction: column; justify-content: center; margin-left: auto;  margin-top: -10px; padding-right: -5px;">
                <span style="font-size: 0.75rem; color: inherit; opacity: 0.7; font-weight: bold; display: flex; align-items: center; justify-content: flex-end; gap: 3px;">
                    <i class='bx bx-minus'></i> 0%
                </span>
                <span style="font-size: 0.45rem; color: inherit; opacity: 0.7; margin-top: 2px;">in next 3 hrs</span>
            </div>
        `;
      }
    }

    let peakUvHtml = "";
    if (
      uvData &&
      uvData.hourly &&
      uvData.hourly.uv_index &&
      uvData.hourly.time &&
      typeof locTimeStr !== "undefined"
    ) {
      let todayPrefix = locTimeStr.split("T")[0];
      let peakStartIdx = -1;
      let peakEndIdx = -1;

      let startIdx =
        typeof tempHourIdx !== "undefined" && tempHourIdx !== -1
          ? tempHourIdx
          : 0;
      for (let i = startIdx; i < uvData.hourly.time.length; i++) {
        if (!uvData.hourly.time[i].startsWith(todayPrefix)) break;
        if (uvData.hourly.uv_index[i] >= 8) {
          if (peakStartIdx === -1) peakStartIdx = i;
          peakEndIdx = i;
        } else if (peakStartIdx !== -1) {
          break;
        }
      }

      if (peakStartIdx !== -1) {
        let startTimeStr = formatHour(peakStartIdx).replace(" ", "");
        let timeDisplay = startTimeStr;
        if (peakEndIdx > peakStartIdx) {
          let endTimeStr = formatHour(peakEndIdx).replace(" ", "");
          timeDisplay = `${startTimeStr} - ${endTimeStr}`;
        }

        peakUvHtml = `
            <div class="detail-extra-col" style="text-align: right; display: flex; flex-direction: column; justify-content: center; margin-left: auto; margin-top: -10px; padding-right: -5px;">
                <span style="font-size: 0.75rem; color: inherit; font-weight: bold; display: flex; align-items: center; justify-content: flex-end;">
                    ${timeDisplay}
                </span>
                <span style="font-size: 0.45rem; color: inherit; opacity: 0.7; margin-top: 2px;">Peak uv time</span>
            </div>
        `;
      } else {
        let todayMaxUv =
          uvData &&
          uvData.daily &&
          uvData.daily.uv_index_max &&
          uvData.daily.uv_index_max[0] !== undefined
            ? Number(uvData.daily.uv_index_max[0].toFixed(1))
            : 0;
        peakUvHtml = `
            <div class="detail-extra-col" style="text-align: right; display: flex; flex-direction: column; justify-content: center; margin-left: auto; margin-top: -8px; padding-right: -5px;">
                <span style="font-size: 0.75rem; color: inherit; font-weight: bold; display: flex; align-items: center; justify-content: flex-end;">
                    ${todayMaxUv}
                </span>
                <span style="font-size: 0.45rem; color: inherit; opacity: 0.7; margin-top: 2px;">Today's max</span>
            </div>
        `;
      }
    }

    if (slowConnTimer) clearTimeout(slowConnTimer);

    let todayMaxTempDisplay = Math.round(
      currentUnits.temp === "Fahrenheit"
        ? (data.main.temp_max * 9) / 5 + 32
        : data.main.temp_max,
    );
    let todayMinTempDisplay = Math.round(
      currentUnits.temp === "Fahrenheit"
        ? (data.main.temp_min * 9) / 5 + 32
        : data.main.temp_min,
    );
    if (
      uvData &&
      uvData.daily &&
      uvData.daily.temperature_2m_max &&
      uvData.daily.temperature_2m_min
    ) {
      let tMax = uvData.daily.temperature_2m_max[0];
      let tMin = uvData.daily.temperature_2m_min[0];
      todayMaxTempDisplay = Math.round(
        currentUnits.temp === "Fahrenheit" ? (tMax * 9) / 5 + 32 : tMax,
      );
      todayMinTempDisplay = Math.round(
        currentUnits.temp === "Fahrenheit" ? (tMin * 9) / 5 + 32 : tMin,
      );
    }

    // Inject the finalized HTML structure containing all processed data into the DOM
    result.innerHTML = `
          <div class="weather-main-display">
              <div class="weather-info">
                  <div class="city-main">${finalCityName}, <span class="info-icon-wrapper">${country}<i class='bx bx-info-circle info-icon' tabindex="0"></i><div class="info-tooltip">${finalFullAddress}</div></span></div>
                  <div class="time-main" id="city-time">Loading...</div>
                  <div class="condition-main">${condition}</div>
                  <div class="temp-main">${Math.round(displayTemp)}<span class="temp-unit">${tempUnit}</span></div>
                  <div class="feels-like">Feels like ${Math.round(displayFeelsLike)}${tempUnit.toLowerCase()}<span style="opacity: 0.7; margin: 0 8px; font-weight: bold;">&bull;</span><span style="font-family: Arial, sans-serif; font-weight: bold; opacity: 0.9">${todayMaxTempDisplay}&deg; / ${todayMinTempDisplay}&deg;</span></div>
              </div>
              <div class="weather-icon-container">
                  <img src="${iconUrl}" onerror="this.src='https://openweathermap.org/img/wn/${iconCode}@4x.png'" alt="${condition}" class="weather-icon">
              </div>
          </div>
          ${window.getSmartAlertsHTML ? window.getSmartAlertsHTML(smartAlerts) : ""}
          </div>
          
          <div class="details-grid">
              <!-- Precipitation -->
              <div class="glass-tab detail-tab">
                  <span class="tab-label detail-tab-label" style="margin-top: -6px; margin-left: -3px;"><i class='bx bx-cloud-rain' style="transform: translateY(2px);"></i> Precipitation</span>
                  <div class="detail-tab-content">
                      <div class="detail-val-col">
                          <span class="tab-value" style="text-align: left; margin-left: -1px;">${precipStr} ${currentUnits.precip}</span>
                          <span class="detail-sub-val" style="color: ${precipColor}; text-align: left;">${precipCondition}</span>
                      </div>
                      <div class="detail-extra-col">
                          <span class="tab-value" style="position: relative; top: -4px;">${precipProb}%</span>
                      </div>
                  </div>
              </div>
              <!-- Wind -->
              <div class="glass-tab detail-tab">
                  <span class="tab-label detail-tab-label" style="margin-top: -3px; margin-left: -3px;"><i class='bx bx-wind' style="transform: translateY(1px); font-size: 0.8rem;"></i> Wind</span>
                  <div class="detail-tab-content">
                      <div class="detail-val-col small-margin">
                          <span class="tab-value" style="text-align: left; margin-left: 10px;">${windStr} ${currentUnits.wind}</span>
                          <span class="detail-sub-val" style="color: ${windColor}; text-align: left; margin-left: 10px;">${windLabel}</span>
                      </div>
                      <div class="wind-dir-col">
                          <span class="wind-dir-text">${windDir}</span>
                          <i class='bx bx-navigation wind-dir-icon' style="transform: rotate(${windDeg - 45}deg);"></i>
                      </div>
                  </div>
              </div>
              
              <!-- Humidity, Uv Index -->
              <div class="glass-tab detail-tab">
                  <span class="tab-label detail-tab-label" style="margin-top: -2px; margin-left: -3px;"><i class='ti ti-droplet' style="transform: translateY(0px); font-size: 0.7rem;"></i> Humidity</span>
                  <div class="detail-tab-content">
                      <div class="detail-val-col">
                          <span class="tab-value">${humidity}%</span>
                          <span class="detail-sub-val" style="color: ${humidityColor};">${humidityLabel}</span>
                      </div>
                      ${humidityChangeHtml}
                  </div>
              </div>
              <div class="glass-tab detail-tab">
                  <span class="tab-label detail-tab-label" style="margin-top: -2px; margin-left: -3px;"><i class='ti ti-sun-high' style="transform: translateY(3px); font-size: 0.85rem;"></i> UV Index</span>
                  <div class="detail-tab-content">
                      <div class="detail-val-col">
                          <span class="tab-value" style="text-align: center;">${uvIndex}</span>
                          <span class="detail-sub-val" style="color: ${uvColor}; text-align: center;">${uvLabel}</span>
                      </div>
                      ${peakUvHtml}
                  </div>
              </div>

              <!-- Visibility, Pressure, Dew Point (Row of 3) -->
              <div class="glass-tab one-third detail-tab center">
                  <span class="tab-label detail-tab-label" style="margin-top: -4px; margin-left: -30px;"><i class='ti ti-eye' style="transform: translateY(2px); font-size: 0.85rem;"></i> Visibility</span>
                  <div class="detail-tab-content center">
                      <div class="detail-val-col no-margin">
                          <span class="tab-value ellipsis-text">${visStr} ${currentUnits.vis}</span>
                          <span class="detail-sub-val small ellipsis-text" style="color: ${visColor};">${visLabel}</span>
                      </div>
                  </div>
              </div>
              <div class="glass-tab one-third detail-tab center">
                  <span class="tab-label detail-tab-label" style="margin-top: -4px; margin-left: -30px;"><i class= 'ti ti-fold' style="transform: translateY(1px); font-size: 0.75rem;"></i> Pressure</span>
                  <div class="detail-tab-content center">
                      <div class="detail-val-col no-margin">
                          <span class="tab-value ellipsis-text">${pressStr} ${currentUnits.press}</span>
                          <span class="detail-sub-val small ellipsis-text" style="color: ${pressColor};">${pressLabel}</span>
                      </div>
                  </div>
              </div>
              <div class="glass-tab one-third detail-tab center">
                  <span class="tab-label detail-tab-label" style="margin-top: -3px; margin-left: -24px;"><i class='bx bxs-droplet-half' style="transform: translateY(0.5px); font-size: 0.75rem;"></i> Dew Point</span>
                  <div class="detail-tab-content center">
                      <div class="detail-val-col no-margin">
                          <span class="tab-value ellipsis-text">${displayDew}${dewUnitStr}</span>
                          <span class="detail-sub-val small ellipsis-text" style="color: ${dewColor};">${dewLabel}</span>
                      </div>
                  </div>
              </div>
              
              <!-- AQI (Long) -->
              <div class="glass-tab full-width detail-tab">
                  <div class="aqi-header-row">
                      <span class="tab-label detail-tab-label no-margin" style="margin-top: -14px; margin-left: -3px;"><i class='bx bx-leaf' style="transform: translateY(2px);"></i> Air Quality</span>
                  </div>
                  <div class="aqi-content-row">
                      <div class="aqi-val-col">
                          <span class="tab-value">${aqi}</span>
                          <span class="aqi-sub-val" style="color: ${aqiColor};">${aqiLabel}</span>
                      </div>
                      <div class="aqi-bar-container">
                          <div class="aqi-scale-labels">
                              <span class="aqi-scale-label" style="left: 0%;">0</span>
                              <span class="aqi-scale-label center-align" style="left: 10%;">50</span>
                              <span class="aqi-scale-label center-align" style="left: 20%;">100</span>
                              <span class="aqi-scale-label center-align" style="left: 30%;">150</span>
                              <span class="aqi-scale-label center-align" style="left: 40%;">200</span>
                              <span class="aqi-scale-label center-align" style="left: 60%;">300</span>
                              <span class="aqi-scale-label right-align" style="left: 100%;">500</span>
                          </div>
                          <div class="aqi-bar">
                              <div class="aqi-indicator" style="left: ${Math.min((aqi / 500) * 100, 100)}%; background: ${aqiDarkColor};"></div>
                          </div>
                          <div class="aqi-status-labels">
                              <span class="aqi-scale-label" style="left: 0%;">Good</span>
                              <span class="aqi-scale-label center-align" style="left: 40%;">Unhealthy</span>
                              <span class="aqi-scale-label right-align" style="left: 100%;">Hazardous</span>
                          </div>
                      </div>
                  </div>
              </div>

              <!-- Pollutants -->
              <div class="glass-tab full-width detail-tab" style="padding-top: 10px;">
                  <span class="tab-label detail-tab-label no-margin" style="margin-top: -7px; margin-left: -3px;"><i class='ti ti-building-factory' style="transform: translateY(2px); font-size: 0.85rem;"></i> Pollutants</span>
                  <div class="pollutants-container">
                      <div class="pollutant-item">
                          <span class="pollutant-name">PM10</span>
                          <span class="pollutant-val">${pm10 !== "-" ? pm10.toLocaleString() : "-"}<span class="pollutant-unit">μg/m³</span></span>
                          <span class="pollutant-status" style="color: ${pm10Status.color};">${pm10Status.label}</span>
                      </div>
                      <div class="pollutant-item">
                          <span class="pollutant-name">PM2.5</span>
                          <span class="pollutant-val">${pm25 !== "-" ? pm25.toLocaleString() : "-"}<span class="pollutant-unit">μg/m³</span></span>
                          <span class="pollutant-status" style="color: ${pm25Status.color};">${pm25Status.label}</span>
                      </div>
                      <div class="pollutant-item">
                          <span class="pollutant-name">CO</span>
                          <span class="pollutant-val">${co !== "-" ? co.toLocaleString() : "-"}<span class="pollutant-unit">ppb</span></span>
                          <span class="pollutant-status" style="color: ${coStatus.color};">${coStatus.label}</span>
                      </div>
                      <div class="pollutant-item">
                          <span class="pollutant-name">O₃</span>
                          <span class="pollutant-val">${o3 !== "-" ? o3.toLocaleString() : "-"}<span class="pollutant-unit">ppb</span></span>
                          <span class="pollutant-status" style="color: ${o3Status.color};">${o3Status.label}</span>
                      </div>
                      <div class="pollutant-item">
                          <span class="pollutant-name">SO₂</span>
                          <span class="pollutant-val">${so2 !== "-" ? so2.toLocaleString() : "-"}<span class="pollutant-unit">ppb</span></span>
                          <span class="pollutant-status" style="color: ${so2Status.color};">${so2Status.label}</span>
                      </div>
                      <div class="pollutant-item">
                          <span class="pollutant-name">NO₂</span>
                          <span class="pollutant-val">${no2 !== "-" ? no2.toLocaleString() : "-"}<span class="pollutant-unit">ppb</span></span>
                          <span class="pollutant-status" style="color: ${no2Status.color};">${no2Status.label}</span>
                      </div>
                  </div>
              </div>
              
              <!-- Pollen -->
              <div class="glass-tab full-width detail-tab" style="padding-top: 10px; padding-bottom: 5px;">
                  <span class="tab-label detail-tab-label no-margin" style="margin-top: -6px; margin-left: -3px;"><i class='bx bx-spa' style="transform: translateY(-1px); font-size: 0.85rem;"></i> Pollen</span>
                  <div class="pollutants-container">
                      <div class="pollutant-item" style="flex-direction: row; justify-content: center; gap: 8px;">
                          <img src="assets/icons/grass-pollen.svg" style="width: 64px; height: 64px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4)); margin-top: -18px; margin-bottom: -15px; margin-left: -18px; margin-right: -12px;" alt="Grass">
                          <div style="display: flex; flex-direction: column; align-items: flex-start;">
                              <span class="pollutant-name" style="margin-bottom: 6px; margin-top: -12px; font-size: 0.7rem;">Grass</span>
                              <span class="pollutant-status" style="color: ${grassStatus.color}; text-align: left;">${grassStatus.label}</span>
                          </div>
                      </div>
                      <div class="pollutant-item" style="flex-direction: row; justify-content: center; gap: 8px;">
                          <img src="assets/icons/tree-pollen.svg" style="width: 64px; height: 64px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4)); margin-top: -20px; margin-bottom: -15px; margin-left: -30px; margin-right: -12px;" alt="Tree">
                          <div style="display: flex; flex-direction: column; align-items: flex-start;">
                              <span class="pollutant-name" style="margin-bottom: 6px; margin-top: -1px; font-size: 0.7rem;">Tree</span>
                              <span class="pollutant-status" style="color: ${treeStatus.color}; text-align: left; margin-bottom: 0;">${treeStatus.label}</span>
                          </div>
                      </div>
                      <div class="pollutant-item" style="flex-direction: row; justify-content: center; gap: 8px;">
                          <img src="assets/icons/weed-pollen.svg" style="width: 64px; height: 64px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4)); margin-top: -16px; margin-bottom: -15px; margin-left: -30px; margin-right: -12px;" alt="Weed">
                          <div style="display: flex; flex-direction: column; align-items: flex-start;">
                              <span class="pollutant-name" style="margin-bottom: 6px; margin-top: -4px; font-size: 0.7rem;">Weed</span>
                              <span class="pollutant-status" style="color: ${weedStatus.color}; text-align: left; margin-bottom: 0;">${weedStatus.label}</span>
                          </div>
                      </div>
                  </div>
              </div>
              
              <!-- Sun and Moon -->
              <div class="glass-tab detail-tab" style="flex: 1.35; padding-top: 10px; padding-bottom: 5px;">
                  <span class="tab-label detail-tab-label no-margin" style="margin-top: -6px; margin-left: -3px;">
                      <i class='ti ti-sunset-2' style="transform: translateY(2px); font-size: 0.85rem;"></i> Sun
                  </span>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: -3px; width: 100%;">
                      <!-- Sunrise -->
                      <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                          <img src="assets/icons/sun-rise.svg" style="width: 32px; height: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));" alt="Sunrise">
                          <span style="font-size: 0.5rem; font-weight: bold; opacity: 0.8; margin-top: -4px; margin-bottom: 1px;">Sunrise</span>
                          <span style="font-size: 0.45rem; font-weight: bold; white-space: nowrap;">${sunriseTime}</span>
                      </div>
                      
                      <!-- Curve -->
                      <div style="flex: 1.5; position: relative; height: 22px; margin: 0 5px; display: flex; justify-content: center; align-items: flex-end;">
                          <svg width="calc(100% + 22px)" height="35" viewBox="0 0 100 35" preserveAspectRatio="none" style="position: absolute; bottom: 0; left: -10px;">
                              <path d="M 0 35 A 67 67 0 0 1 100 35" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.8" stroke-dasharray="2 2" vector-effect="non-scaling-stroke"></path>
                          </svg>
                          <i class='ti ti-sun-filled' style="color: #ffd54f; font-size: 0.75rem; line-height: 1; display: inline-flex; align-items: center; justify-content: center; position: absolute; left: ${sunLeftCalc}; top: ${sunTopCalc}; transform: translate(-52%, -50%); filter: drop-shadow(0 0 5px rgba(255, 213, 79, 0.8)); transition: left 1s ease, top 1s ease;"></i>
                          <span style="position: absolute; bottom: -10px; font-size: 0.45rem; opacity: 0.8; font-weight: bold;">${daylightDurationStr}</span>
                      </div>
                      
                      <!-- Sunset -->
                      <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                          <img src="assets/icons/sun-set.svg" style="width: 32px; height: 32px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4)); margin-top: 0px;" alt="Sunset">
                          <span style="font-size: 0.5rem; font-weight: bold; opacity: 0.8; margin-top: -4px; margin-bottom: 1px;">Sunset</span>
                          <span style="font-size: 0.45rem; font-weight: bold; white-space: nowrap;">${sunsetTime}</span>
                      </div>
                  </div>
              </div>
              
              <div class="glass-tab detail-tab" style="flex: 0.85; padding-top: 10px; padding-bottom: 5px; min-width: 0;">
                  <span class="tab-label detail-tab-label no-margin" style="margin-top: -6px; margin-left: -3px;">
                      <i class='ti ti-moon' style="transform: translateY(-2px); font-size: 0.75rem;"></i> Moon
                  </span>
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 5px; width: 100%;">
                      <!-- Left: Moon Phase Icon -->
                      <img src="assets/icons/${moonIconFile}" style="width: 42px; height: 42px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4)); margin-right: 6px;" alt="${moonPhase}">
                      
                      <!-- Details: Phase Name, Illumination, Age, Moonrise, Moonset -->
                      <div style="display: flex; flex-direction: column; flex: 1; min-width: 0;">
                          <span style="font-size: 0.5rem; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif; font-weight: bold; line-height: 1.1; white-space: nowrap; overflow: hidden; max-width: 70px;">${moonPhase}</span>
                          <div style="display: flex; justify-content: space-between; width: 100%;">
                              <!-- Middle: Illumination, Age -->
                              <div style="display: flex; flex-direction: column; align-items: flex-start;">
                                  <span style="font-size: 0.35rem; opacity: 0.6; margin-top: 3px; margin-bottom: 1.5px;">Illum</span>
                                  <span style="font-size: 0.4rem; font-weight: bold;">${moonIllumination}%</span>
                                  <span style="font-size: 0.35rem; opacity: 0.6; margin-top: 1.5px; margin-bottom: 1.5px;">Age</span>
                                  <span style="font-size: 0.4rem; font-weight: bold;">${moonAge}d</span>
                              </div>
                              
                              <!-- Right: Moonrise and Moonset -->
                              <div style="display: flex; flex-direction: column; align-items: flex-start; margin-left: 5px;">
                                  <span style="font-size: 0.35rem; opacity: 0.6; margin-top: 3px; margin-bottom: 1.5px;">Moonrise</span>
                                  <span style="font-size: 0.4rem; font-weight: bold; white-space: nowrap; overflow: hidden; max-width: 40px;">${moonriseTime}</span>
                                  <span style="font-size: 0.35rem; opacity: 0.6; margin-top: 1.5px; margin-bottom: 1.5px;">Moonset</span>
                                  <span style="font-size: 0.4rem; font-weight: bold; white-space: nowrap; overflow: hidden; max-width: 40px;">${moonsetTime}</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

              <!-- Forecast Tab -->
              <div class="glass-tab full-width detail-tab" style="padding-top: 10px; padding-bottom: 5px; min-width: 0; overflow: hidden; display: flex; flex-direction: column;">
                  <div style="display: flex; justify-content: flex-start; align-items: center; gap: 20px; padding-bottom: 8px; width: 100%; padding-left: 5px;">
                      <span class="tab-label detail-tab-label no-margin" style="margin: 0; padding: 0;"><i class='bx bx-time-five' style="font-size: 0.8rem; margin-left: -8px; transform: translateY(-3px);"></i></span>
                      <span id="forecast-hourly-tab" onclick="switchForecastTab('hourly')" style="font-size: 0.75rem; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif; font-weight: bold; margin-left: -20px; margin-top: -6px; cursor: pointer; position: relative; opacity: 1; color: inherit; transition: opacity 0.3s ease;">Hourly<div class="tab-indicator" style="position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%); width: 20px; height: 1px; background: currentColor; border-radius: 2px; transition: all 0.3s ease; opacity: 1;"></div></span>
                      <span id="forecast-daily-tab" onclick="switchForecastTab('daily')" style="font-size: 0.75rem; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif; font-weight: normal; opacity: 0.6; cursor: pointer; margin-left: -10px; margin-top: -6px; position: relative; color: inherit; transition: opacity 0.3s ease;">Daily<div class="tab-indicator" style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 20px; height: 1px; background: currentColor; border-radius: 2px; transition: all 0.3s ease; opacity: 0;"></div></span>
                  </div>
                  
                  <div id="hourly-sub-tabs" style="display: flex; justify-content: flex-start; align-items: center; gap: 15px; width: 100%; margin-top: 1px; margin-bottom: 10px; padding-left: 15px;">
                      <span id="hourly-temp-tab" onclick="switchHourlySubTab('temp')" style="font-size: 0.55rem; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif; font-weight: bold; cursor: pointer; color: inherit; opacity: 1; transition: opacity 0.2s;">Temperature</span>
                      <div style="width: 1px; height: 10px; background: rgba(255, 255, 255, 0.3);"></div>
                      <span id="hourly-precip-tab" onclick="switchHourlySubTab('precip')" style="font-size: 0.55rem; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif; font-weight: bold; cursor: pointer; color: inherit; opacity: 0.6; transition: opacity 0.2s;">Precipitation</span>
                  </div>
                  <div id="daily-sub-tabs" style="display: none; justify-content: flex-start; align-items: center; gap: 15px; width: 100%; margin-top: 1px; margin-bottom: 10px; padding-left: 15px;">
                      <span id="daily-temp-tab" onclick="switchDailySubTab('temp')" style="font-size: 0.55rem; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif; font-weight: bold; cursor: pointer; color: inherit; opacity: 1; transition: opacity 0.2s;">Temperature</span>
                      <div style="width: 1px; height: 10px; background: rgba(255, 255, 255, 0.3);"></div>
                      <span id="daily-precip-tab" onclick="switchDailySubTab('precip')" style="font-size: 0.55rem; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif; font-weight: bold; cursor: pointer; color: inherit; opacity: 0.6; transition: opacity 0.2s;">Precipitation</span>
                  </div>
                  
                  <div id="hourly-content-container" class="hourly-scroll-container" style="position: relative; width: 100%; margin-top: -5px; overflow-x: auto; overflow-y: hidden; scrollbar-width: none; -ms-overflow-style: none; user-select: none; -webkit-user-select: none; touch-action: pan-x; padding-bottom: 0px; overscroll-behavior-x: contain;">
                      <style>
                          .hourly-scroll-container::-webkit-scrollbar { display: none; }
                      </style>
                      <div style="position: relative; width: max-content; min-width: 100%; display: flex; padding-bottom: 0px; padding-top: 5px; background: transparent;">
                          ${hourlyTempHtml}
                          ${hourlyPrecipHtml}
                      </div>
                  </div>
                  <div id="custom-scrollbar-track" style="width: 92%; height: 2px; background: rgba(255, 255, 255, 0.15); border-radius: 2px; margin: 10px auto 5px auto; position: relative; cursor: pointer;">
                      <div id="custom-scrollbar-thumb" style="position: absolute; top: -1px; left: 0; height: 4px; width: 30px; background: rgba(255, 165, 0, 0.8); border-radius: 4px; cursor: grab; transition: background 0.2s, height 0.2s, top 0.2s;"></div>
                  </div>
                  <div id="daily-content-container" class="hourly-scroll-container" style="display: none; position: relative; width: 100%; margin-top: -5px; overflow-x: auto; overflow-y: hidden; scrollbar-width: none; -ms-overflow-style: none; user-select: none; -webkit-user-select: none; touch-action: pan-x; padding-bottom: 0px; overscroll-behavior-x: contain;">
                      <div style="position: relative; width: max-content; min-width: 100%; display: flex; padding-bottom: 0px; padding-top: 5px; background: transparent;">
                          ${dailyTempHtml}
                          ${dailyPrecipHtml}
                      </div>
                  </div>
                  <div id="custom-scrollbar-track-daily" style="width: 92%; height: 2px; background: rgba(255, 255, 255, 0.15); border-radius: 2px; margin: 10px auto 5px auto; position: relative; cursor: pointer; display: none;">
                      <div id="custom-scrollbar-thumb-daily" style="position: absolute; top: -1px; left: 0; height: 4px; width: 30px; background: rgba(255, 165, 0, 0.8); border-radius: 4px; cursor: grab; transition: background 0.2s, height 0.2s, top 0.2s;"></div>
                  </div>
              </div>
          </div>
      `;

    // Restore tab states
    if (window.currentForecastTab) {
      switchForecastTab(window.currentForecastTab);
    }
    if (window.currentHourlyTab) {
      switchHourlySubTab(window.currentHourlyTab);
    }
    if (window.currentDailyTab) {
      switchDailySubTab(window.currentDailyTab);
    }

    startClock(timezone);
    window.currentScrollbarColor = "rgba(255, 165, 0, 0.8)";
    window.currentScrollbarColorActive = "rgba(255, 165, 0, 1)";
    window.currentScrollbarColorDaily = "rgba(255, 165, 0, 0.8)";
    window.currentScrollbarColorActiveDaily = "rgba(255, 165, 0, 1)";
    attachDragToScroll();

    if (window.isRadarView && typeof window.toggleRadarView === "function") {
      window.toggleRadarView(true);
    }

    const radarBtn = document.getElementById("radar-btn");
    if (radarBtn) radarBtn.style.display = "block";

    if (window.initSmartAlertsCycle) {
      window.initSmartAlertsCycle(smartAlerts);
    }
    if (weatherInterval) clearTimeout(weatherInterval);
    if (currentRefreshInterval > 0) {
      weatherInterval = setTimeout(
        () => getWeather(true),
        currentRefreshInterval * 60000,
      );
    }
    setTimeout(adjustZoom, 100);
  } catch (error) {
    if (slowConnTimer) clearTimeout(slowConnTimer);

    if (!isAutoUpdate) {
      result.innerHTML = "";
      let msg = error.message;
      if (
        msg.includes("Failed to fetch") ||
        msg.includes("NetworkError") ||
        !navigator.onLine
      ) {
        msg = "No internet connection";
      }
      showMessage(
        msg,
        "This might be due to a typo, missing data for the location, a connection issue, or an API limitation.",
      );
    }
  }
}

document.addEventListener("click", function (e) {
  const messageBox = document.getElementById("message-box");
  const suggestionsBox = document.getElementById("suggestions-box");
  const searchBar = document.querySelector(".input-group");

  if (messageBox && messageBox.style.display === "block") {
    if (
      !messageBox.contains(e.target) &&
      (!searchBar || !searchBar.contains(e.target))
    ) {
      messageBox.style.display = "none";
    }
  }

  if (suggestionsBox && suggestionsBox.style.display === "flex") {
    if (
      !suggestionsBox.contains(e.target) &&
      (!searchBar || !searchBar.contains(e.target))
    ) {
      suggestionsBox.style.display = "none";
    }
  }
});

document.addEventListener("touchstart", function (e) {
  const messageBox = document.getElementById("message-box");
  const suggestionsBox = document.getElementById("suggestions-box");
  const searchBar = document.querySelector(".input-group");

  if (messageBox && messageBox.style.display === "block") {
    if (
      !messageBox.contains(e.target) &&
      (!searchBar || !searchBar.contains(e.target))
    ) {
      messageBox.style.display = "none";
    }
  }

  if (suggestionsBox && suggestionsBox.style.display === "flex") {
    if (
      !suggestionsBox.contains(e.target) &&
      (!searchBar || !searchBar.contains(e.target))
    ) {
      suggestionsBox.style.display = "none";
    }
  }
});
