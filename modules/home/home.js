let currentStartupCity = null;
let startupInterval;
let weatherInterval;
let debounceTimer;
let currentFocus = -1;
let currentTimeFormat = "12-hour";
let currentRefreshInterval = 0;
let lightningTimers = {};
let currentUnits = {
  temp: "Celsius",
  precip: "mm",
  wind: "km/h",
  vis: "km",
  press: "mb",
};
let timeInterval;

window.homeLastLoadedCity = null;
window.preloadedHomeHTML = null;

async function fetchStartupCityWeather(isPreload = false) {
  const majorCities = [
    "Hyderabad",
    "New Delhi",
    "New York",
    "London",
    "Paris",
    "Tokyo",
    "Dubai",
    "Singapore",
    "Sydney",
    "Rome",
    "Los Angeles",
    "Hong Kong",
    "Madrid",
    "Istanbul",
    "Bangkok",
    "Amsterdam",
    "Berlin",
    "Mumbai",
    "San Francisco",
    "Seoul",
    "Toronto",
    "Rio de Janeiro",
    "Las Vegas",
    "Venice",
    "Cairo",
    "Moscow",
    "Cape Town",
    "Beijing",
    "Jakarta",
    "Stockholm",
  ];
  const randomCity =
    currentStartupCity ||
    majorCities[Math.floor(Math.random() * majorCities.length)];
  currentStartupCity = randomCity;

  if (!isPreload && window.homeLastLoadedCity === currentStartupCity && window.preloadedHomeHTML) {
    document.body.className = "";
    const weatherBox = document.querySelector(".weather-box");
    if (weatherBox) {
      const isAnimDisabled = weatherBox.classList.contains("disable-animations");
      const isAbout = weatherBox.classList.contains("about-mode");
      weatherBox.className = `weather-box${isAnimDisabled ? " disable-animations" : ""}${isAbout ? " about-mode" : ""}`;
    }
    let homeContainer = document.getElementById("home-result");
    if (!homeContainer) {
      homeContainer = document.createElement("div");
      homeContainer.id = "home-result";
      homeContainer.className = "result";
      document.querySelector(".weather-box").appendChild(homeContainer);
    }
    homeContainer.innerHTML = window.preloadedHomeHTML;
    document.getElementById("result").style.display = "none";
    homeContainer.style.display = "block";
    return;
  }

  if (!isPreload) {
    document.body.className = "";
    const weatherBox = document.querySelector(".weather-box");
    if (weatherBox) {
      const isAnimDisabled = weatherBox.classList.contains("disable-animations");
      const isAbout = weatherBox.classList.contains("about-mode");
      weatherBox.className = `weather-box${isAnimDisabled ? " disable-animations" : ""}${isAbout ? " about-mode" : ""}`;
    }

    let homeContainer = document.getElementById("home-result");
    if (!homeContainer) {
      homeContainer = document.createElement("div");
      homeContainer.id = "home-result";
      homeContainer.className = "result";
      document.querySelector(".weather-box").appendChild(homeContainer);
    }
    
    homeContainer.innerHTML = `
      <style>
        @keyframes shimmer-sweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-bg {
          background: linear-gradient(90deg, rgba(255,255,255,0.15) 25%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.15) 75%);
          background-size: 200% 100%;
          animation: shimmer-sweep 1.5s infinite linear;
        }
        .shimmer-text {
          color: transparent !important;
          background: linear-gradient(90deg, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.2) 75%);
          background-size: 200% 100%;
          animation: shimmer-sweep 1.5s infinite linear;
          background-clip: text;
          -webkit-background-clip: text;
          display: inline-block;
        }
        .disable-animations .shimmer-bg, .disable-animations .shimmer-text {
          animation: none !important;
        }
        .disable-animations .shimmer-text {
          background: rgba(255,255,255,0.4) !important;
          background-clip: text;
          -webkit-background-clip: text;
        }
      </style>
      <div class="weather-main-display" style="opacity: 0.9; pointer-events: none; margin-top: 20px;">
          <div class="weather-info" style="width: 100%;">
              <div><div class="shimmer-bg" style="width: 160px; height: 1.6rem; border-radius: 8px; margin-bottom: 4px;"></div></div>
              <div><div class="shimmer-bg" style="width: 120px; height: 1rem; border-radius: 4px; margin-bottom: 6px;"></div></div>
              <div><div class="shimmer-bg" style="width: 90px; height: 3.5rem; border-radius: 12px; margin-bottom: 0px;"></div></div>
              <div><div class="shimmer-bg" style="width: 100px; height: 0.7rem; border-radius: 4px; margin-bottom: 15px; margin-top: 5px;"></div></div>
              
              <div style="display: flex; flex-direction: row; gap: 10px; align-items: center; margin-top: 10px; width: 100%; justify-content: space-around;">
                  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1 1 0;">
                      <div class="shimmer-bg" style="width: 50px; height: 25px; border-radius: 6px;"></div>
                  </div>
                  <div style="width: 0.5px; min-width: 0.5px; height: 25px; background: rgba(255, 255, 255, 0.4); flex-shrink: 0;"></div>
                  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1 1 0;">
                      <div class="shimmer-bg" style="width: 50px; height: 25px; border-radius: 6px;"></div>
                  </div>
                  <div style="width: 0.5px; min-width: 0.5px; height: 25px; background: rgba(255, 255, 255, 0.4); flex-shrink: 0;"></div>
                  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1 1 0;">
                      <div class="shimmer-bg" style="width: 50px; height: 25px; border-radius: 6px;"></div>
                  </div>
                  <div style="width: 0.5px; min-width: 0.5px; height: 25px; background: rgba(255, 255, 255, 0.4); flex-shrink: 0;"></div>
                  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1 1 0;">
                      <div class="shimmer-bg" style="width: 50px; height: 25px; border-radius: 6px;"></div>
                  </div>
              </div>
          </div>
      </div>
      <div class="startup-details-grid" style="gap: 4px; flex-direction: column; opacity: 0.8; pointer-events: none; margin-top: 15px;">
          <div style="display: flex; flex-direction: row; gap: 4px; width: 100%;">
              <div class="startup-glass-tab shimmer-bg" style="flex: 1.45; height: 85px; border-radius: 12px;"></div>
              <div style="display: flex; flex-direction: row; flex: 1; align-items: stretch; gap: 4px;">
                  <div class="startup-glass-tab shimmer-bg" style="flex: 1; height: 85px; border-radius: 12px;"></div>
                  <div class="startup-glass-tab shimmer-bg" style="flex: 1.2; height: 85px; border-radius: 12px;"></div>
              </div>
          </div>
          <div style="display: flex; flex-direction: row; gap: 4px; width: 100%;">
              <div style="flex: 1.6; display: flex; flex-direction: column; gap: 4px;">
                  <div class="startup-glass-tab shimmer-bg" style="width: 100%; height: 70px; border-radius: 12px;"></div>
                  <div class="startup-glass-tab shimmer-bg" style="width: 100%; height: 70px; border-radius: 12px;"></div>
              </div>
              <div class="startup-glass-tab shimmer-bg" style="flex: 1; min-height: 144px; border-radius: 12px;"></div>
          </div>
          <div style="display: flex; flex-direction: row; gap: 4px; width: 100%;">
              <div class="startup-glass-tab shimmer-bg" style="flex: 0.9; height: 40px; border-radius: 12px;"></div>
              <div class="startup-glass-tab shimmer-bg" style="flex: 0.9; height: 40px; border-radius: 12px;"></div>
              <div class="startup-glass-tab shimmer-bg" style="flex: 1.05; height: 40px; border-radius: 12px;"></div>
              <div class="startup-glass-tab shimmer-bg" style="flex: 1.15; height: 40px; border-radius: 12px;"></div>
          </div>
          <div class="startup-glass-tab shimmer-bg" style="width: 100%; height: 80px; border-radius: 12px;"></div>
          <div style="display: flex; flex-direction: row; gap: 4px; width: 100%;">
              <div class="startup-glass-tab shimmer-bg" style="flex: 1; height: 35px; border-radius: 12px;"></div>
              <div class="startup-glass-tab shimmer-bg" style="flex: 1; height: 35px; border-radius: 12px;"></div>
              <div class="startup-glass-tab shimmer-bg" style="flex: 1; height: 35px; border-radius: 12px;"></div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; margin-top: 10px; margin-bottom: 5px; gap: 8px;">
              <div class="shimmer-bg" style="width: 250px; height: 10px; border-radius: 4px;"></div>
              <div class="shimmer-bg" style="width: 150px; height: 10px; border-radius: 4px;"></div>
          </div>
      </div>
    `;
    
    const mainResult = document.getElementById("result");
    if (mainResult) mainResult.style.display = "none";
    homeContainer.style.display = "block";
  }

  try {
    let response;
    const lastCity = localStorage.getItem("lastCity");
    const lastLat = localStorage.getItem("lastLat");
    const lastLon = localStorage.getItem("lastLon");
    if (currentStartupCity === lastCity && lastLat && lastLon) {
      response = await fetch(
        window.getWeatherEndpoint("weather", { lat: lastLat, lon: lastLon }),
      );
    } else {
      response = await fetch(
        window.getWeatherEndpoint("weather", {
          q: encodeURIComponent(randomCity),
        }),
      );
    }
    if (!response.ok) return;
    const data = await response.json();
    const temp = data.main.temp;
    const feels = data.main.feels_like;
    let displayTemp =
      currentUnits.temp === "Fahrenheit" ? (temp * 9) / 5 + 32 : temp;
    let displayFeelsLike =
      currentUnits.temp === "Fahrenheit" ? (feels * 9) / 5 + 32 : feels;
    let tempUnit = currentUnits.temp === "Fahrenheit" ? "°F" : "°C";
    const condition = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind?.speed || 0;
    const windKmh = windSpeed * 3.6;
    let displayWind;
    if (currentUnits.wind === "mph") displayWind = windSpeed * 2.23694;
    else if (currentUnits.wind === "m/s") displayWind = windSpeed;
    else displayWind = windKmh;
    let windStr = Math.round(displayWind);
    const windDeg = data.wind?.deg || 0;
    const clouds = data.clouds?.all || 0;
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
    const visibilityVal =
      (data.visibility !== undefined ? data.visibility : 10000) / 1000;
    let displayVis = visibilityVal;
    if (currentUnits.vis === "mi") displayVis = visibilityVal * 0.621371;
    let visStr = Number(displayVis.toFixed(1)).toString();
    const lat = data.coord.lat;
    const lon = data.coord.lon;
    let forecastHtml = "";
    let precipProb = 0;
    try {
      const forecastRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code,is_day,precipitation_probability,cloudcover,visibility&timezone=auto&forecast_days=2`,
      );
      if (forecastRes.ok) {
        const fData = await forecastRes.json();
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const cityTime = new Date(utc + 1000 * data.timezone);
        const locYear = cityTime.getFullYear();
        const locMonth = String(cityTime.getMonth() + 1).padStart(2, "0");
        const locDay = String(cityTime.getDate()).padStart(2, "0");
        const locHour = String(cityTime.getHours()).padStart(2, "0");
        const locTimeStr = `${locYear}-${locMonth}-${locDay}T${locHour}:00`;

        let startIndex = fData.hourly.time.indexOf(locTimeStr);
        if (startIndex === -1) startIndex = cityTime.getHours();
        precipProb = fData.hourly.precipitation_probability[startIndex] || 0;

        let tabsHtml = "";
        for (let i = startIndex; i < startIndex + 5; i++) {
          if (i >= fData.hourly.time.length) break;
          let timeStr = fData.hourly.time[i];
          let hour = parseInt(timeStr.split("T")[1].substring(0, 2));

          let displayTime;
          if (i === startIndex) {
            displayTime = "Now";
          } else if (
            typeof currentTimeFormat !== "undefined" &&
            currentTimeFormat === "24-hour"
          ) {
            displayTime = `${hour.toString().padStart(2, "0")}:00`;
          } else {
            let ampm = hour >= 12 ? "PM" : "AM";
            let displayHour = hour % 12;
            displayHour = displayHour ? displayHour : 12;
            displayTime = `${displayHour} ${ampm}`;
          }

          let fTempOrig = fData.hourly.temperature_2m[i];
          let fTemp =
            currentUnits.temp === "Fahrenheit"
              ? Math.round((fTempOrig * 9) / 5 + 32)
              : Math.round(fTempOrig);
          let wCode = fData.hourly.weather_code[i];
          let isDay = fData.hourly.is_day[i];

          let hIcon = "clear-day";
          if (wCode === 0 || wCode === 1)
            hIcon = isDay ? "clear-day" : "clear-night";
          else if (wCode === 2)
            hIcon = isDay ? "partly-sunny" : "partly-cloudy";
          else if (wCode === 3) hIcon = "overcast";
          else if (wCode === 45 || wCode === 48) hIcon = "fog";
          else if (wCode >= 51 && wCode <= 57) hIcon = "drizzle";
          else if (wCode === 65 || wCode === 67 || wCode === 82)
            hIcon = "extreme-rain";
          else if (wCode >= 61 && wCode <= 67) hIcon = "rain";
          else if (wCode >= 80 && wCode <= 82) hIcon = "rain";
          else if (wCode === 75 || wCode === 77 || wCode === 86)
            hIcon = "extreme-snow";
          else if (wCode >= 71 && wCode <= 77) hIcon = "snow";
          else if (wCode >= 85 && wCode <= 86) hIcon = "snow";
          else if (wCode >= 96) hIcon = "severe-thunderstorm";
          else if (wCode >= 95) hIcon = "thunderstorm";

          tabsHtml += `
                            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; min-width: 0;">
                                <span style="font-size: 0.5rem; margin-bottom: -1px; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif; color: #F9FAFB">${displayTime}</span>
                                <img src="${window.getCachedAsset(`assets/icons/${hIcon}.svg`)}" style="width: 36px; height: 36px; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4)); margin-bottom: -1px;" alt="${hIcon}">
                                <span style="font-size: 0.6rem; font-weight: 400; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif; color: #F9FAFB; margin-bottom: -3px;">${fTemp}°</span>
                            </div>
                        `;
        }

        let cond = condition.toLowerCase();
        let isRaining =
          cond.includes("rain") ||
          cond.includes("drizzle") ||
          cond.includes("shower");
        let isSnowing =
          cond.includes("snow") ||
          cond.includes("sleet") ||
          cond.includes("blizzard");
        let isThunderstorm =
          cond.includes("thunderstorm") ||
          cond.includes("storm") ||
          cond.includes("lightning");

        let umbrellaAdvice = "No Need";
        if (precipProb > 80 || isRaining) umbrellaAdvice = "Take One";
        else if (precipProb > 50 || isSnowing) umbrellaAdvice = "Better Take";
        else if (precipProb > 20) umbrellaAdvice = "keep Handy";
        else if (precipProb > 0) umbrellaAdvice = "If Needed";

        let clothingAdvice = "Light Wear";
        if (isSnowing || temp <= -5) clothingAdvice = "Thermal Wear";
        else if (temp <= 0) clothingAdvice = "Heavy Coat";
        else if (temp <= 8) clothingAdvice = "Winter Coat";
        else if (temp <= 15) clothingAdvice = "Warm Jacket";
        else if (temp <= 20) clothingAdvice = "Light Jacket";
        else if (temp <= 26) clothingAdvice = "Long Sleeves";
        else if (temp <= 32) clothingAdvice = "T-Shirt";
        else clothingAdvice = "Cool Wear";
        if (isRaining && temp > 10) clothingAdvice = "Rain Jacket";
        if (windKmh >= 30 && temp < 20) clothingAdvice = "Windbreaker";

        let outdoorAdvice = "Excellent";
        if (
          isRaining ||
          isSnowing ||
          windKmh >= 45 ||
          temp >= 38 ||
          temp <= -10 ||
          precipProb >= 80 ||
          visibilityVal < 1
        )
          outdoorAdvice = "Avoid";
        else if (
          windKmh >= 30 ||
          temp >= 35 ||
          temp <= -5 ||
          precipProb >= 60 ||
          visibilityVal < 3
        )
          outdoorAdvice = "Not Advised";
        else if (
          windKmh >= 20 ||
          temp >= 30 ||
          temp <= 8 ||
          precipProb >= 30 ||
          visibilityVal < 5
        )
          outdoorAdvice = "Fair";
        else if (windKmh >= 10 || temp >= 27 || precipProb > 10)
          outdoorAdvice = "Good";
        if (isThunderstorm) outdoorAdvice = "Avoid";

        let drivingAdvice = "Good";
        if (isThunderstorm || visibilityVal < 0.5 || windKmh > 70)
          drivingAdvice = "Dangerous";
        else if (
          isSnowing ||
          visibilityVal < 1 ||
          windKmh >= 50 ||
          (temp <= 0 && (isRaining || precipProb >= 20))
        )
          drivingAdvice = "Risky";
        else if (
          isRaining ||
          visibilityVal < 3 ||
          windKmh >= 35 ||
          precipProb >= 70
        )
          drivingAdvice = "Caution";
        else if (temp <= -2 && precipProb >= 10) drivingAdvice = "Icy Roads";
        else if (precipProb >= 60) drivingAdvice = "Wet Roads";
        else if (visibilityVal < 8 || windKmh >= 25)
          drivingAdvice = "Stay Alert";

        let aqi = 0;
        let avgAqi = 0;
        let pollenIndex = "0.0";
        let pollenLabel = "Low";
        let pollenColor = "#00e400";
        let aqiColor = "#00e400";

        let currentUnix = Math.floor(Date.now() / 1000);
        let sunsetUnix = data.sys?.sunset || currentUnix;
        let sunriseUnix = data.sys?.sunrise || currentUnix + 86400;
        if (sunriseUnix < sunsetUnix) sunriseUnix += 86400;

        let bestViewingStart = sunsetUnix + 90 * 60;
        let bestViewingEnd = sunriseUnix - 90 * 60;
        let viewingHours = Math.max(
          1,
          Math.floor((bestViewingEnd - bestViewingStart) / 3600),
        );

        const getLocalTimeStr = (unix) => {
          const date = new Date(unix * 1000);
          const utc = date.getTime() + date.getTimezoneOffset() * 60000;
          const local = new Date(utc + 1000 * data.timezone);
          return `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, "0")}-${String(local.getDate()).padStart(2, "0")}T${String(local.getHours()).padStart(2, "0")}:00`;
        };

        let locTimeStartStr = getLocalTimeStr(bestViewingStart);

        try {
          const aqResponse = await fetch(
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi&hourly=grass_pollen,alder_pollen,birch_pollen,ragweed_pollen,us_aqi&timezone=auto`,
          );
          if (aqResponse.ok) {
            const aqData = await aqResponse.json();
            aqi = aqData.current?.us_aqi || 0;

            let startAqIndex = aqData.hourly?.time?.indexOf(locTimeStartStr);
            if (startAqIndex !== -1 && startAqIndex !== undefined) {
              let sumAqi = 0,
                countAqi = 0;
              for (let i = 0; i < viewingHours; i++) {
                let idx = startAqIndex + i;
                if (idx < (aqData.hourly?.us_aqi?.length || 0)) {
                  sumAqi += aqData.hourly.us_aqi[idx] || 0;
                  countAqi++;
                }
              }
              avgAqi = countAqi > 0 ? sumAqi / countAqi : aqi;
            } else {
              avgAqi = aqi;
            }

            if (aqi > 50 && aqi <= 100) aqiColor = "#ffff00";
            else if (aqi > 100 && aqi <= 150) aqiColor = "#ff7e00";
            else if (aqi > 150 && aqi <= 200) aqiColor = "#ff007f";
            else if (aqi > 200 && aqi <= 300) aqiColor = "#8f3f97";
            else if (aqi > 300) aqiColor = "#7e0023";

            const now = new Date();
            const utc = now.getTime() + now.getTimezoneOffset() * 60000;
            const cityTime = new Date(utc + 1000 * data.timezone);
            const locTimeStr = `${cityTime.getFullYear()}-${String(cityTime.getMonth() + 1).padStart(2, "0")}-${String(cityTime.getDate()).padStart(2, "0")}T${String(cityTime.getHours()).padStart(2, "0")}:00`;

            let aqHourIndex = aqData.hourly?.time?.indexOf(locTimeStr);
            if (aqHourIndex === -1 || aqHourIndex === undefined)
              aqHourIndex = cityTime.getHours();

            let grass = aqData.hourly?.grass_pollen?.[aqHourIndex] || 0;
            let alder = aqData.hourly?.alder_pollen?.[aqHourIndex] || 0;
            let birch = aqData.hourly?.birch_pollen?.[aqHourIndex] || 0;
            let weed = aqData.hourly?.ragweed_pollen?.[aqHourIndex] || 0;

            const getSubIndex = (val, thresholds) => {
              if (val === 0) return 0;
              if (val < thresholds[0]) return 0.1 + (val / thresholds[0]) * 2.8;
              if (val < thresholds[1])
                return (
                  3.0 +
                  ((val - thresholds[0]) / (thresholds[1] - thresholds[0])) *
                    1.9
                );
              if (val < thresholds[2])
                return (
                  5.0 +
                  ((val - thresholds[1]) / (thresholds[2] - thresholds[1])) *
                    1.9
                );
              if (val < thresholds[3])
                return (
                  7.0 +
                  ((val - thresholds[2]) / (thresholds[3] - thresholds[2])) *
                    1.9
                );
              if (val < thresholds[3] * 1.5)
                return (
                  9.0 + ((val - thresholds[3]) / (thresholds[3] * 0.5)) * 1.9
                );
              return Math.min(
                12.0,
                11.0 + (val - thresholds[3] * 1.5) / (thresholds[3] * 0.5),
              );
            };

            let grassIndex = getSubIndex(grass, [5, 20, 80, 200]);
            let treeIndex = getSubIndex(alder + birch, [10, 15, 90, 1500]);
            let weedIndex = getSubIndex(weed, [5, 10, 50, 500]);

            let pIndex = Math.max(grassIndex, treeIndex, weedIndex);
            pollenIndex = pIndex.toFixed(1);

            if (pIndex === 0) {
              pollenLabel = "None";
              pollenColor = "#03a803";
            } else if (pIndex < 3) {
              pollenLabel = "Very Low";
              pollenColor = "#40e320";
            } else if (pIndex < 5) {
              pollenLabel = "Low";
              pollenColor = "#69db18";
            } else if (pIndex < 7) {
              pollenLabel = "Moderate";
              pollenColor = "#f7c202";
            } else if (pIndex < 9) {
              pollenLabel = "High";
              pollenColor = "#fc1c1c";
            } else if (pIndex < 11) {
              pollenLabel = "Very High";
              pollenColor = "#ab0231";
            } else {
              pollenLabel = "Extreme";
              pollenColor = "#7e0023";
            }
          }
        } catch (err) {
          console.warn("Startup AQI/Pollen fetch failed", err);
        }

        let startForecastIndex = fData.hourly?.time?.indexOf(locTimeStartStr);
        let avgClouds = clouds;
        let avgVis_km = visibilityVal / 1000;

        if (startForecastIndex !== -1 && startForecastIndex !== undefined) {
          let sumC = 0,
            sumV = 0,
            countF = 0;
          for (let i = 0; i < viewingHours; i++) {
            let idx = startForecastIndex + i;
            if (idx < (fData.hourly?.time?.length || 0)) {
              sumC += fData.hourly.cloudcover?.[idx] || 0;
              sumV += (fData.hourly.visibility?.[idx] || 10000) / 1000;
              countF++;
            }
          }
          if (countF > 0) {
            avgClouds = sumC / countF;
            avgVis_km = sumV / countF;
          }
        }

        let starsIndex = 10;
        if (avgClouds > 85) starsIndex -= 9;
        else if (avgClouds > 60) starsIndex -= 6;
        else if (avgClouds > 30) starsIndex -= 3;
        else if (avgClouds > 10) starsIndex -= 1;

        if (avgVis_km < 2) starsIndex -= 4;
        else if (avgVis_km < 5) starsIndex -= 2;
        else if (avgVis_km < 8) starsIndex -= 1;

        if (avgAqi > 150) starsIndex -= 3;
        else if (avgAqi > 100) starsIndex -= 2;
        else if (avgAqi > 50) starsIndex -= 1;

        const synodicMonth = 29.53058867;
        const knownNewMoon = 1704974220;
        const diffDays = (currentUnix - knownNewMoon) / 86400;
        const phasePercent =
          diffDays / synodicMonth - Math.floor(diffDays / synodicMonth);
        const moonIllumination = Math.round(
          ((1 - Math.cos(phasePercent * 2 * Math.PI)) / 2) * 100,
        );

        if (moonIllumination > 80) starsIndex -= 4;
        else if (moonIllumination > 50) starsIndex -= 2;
        else if (moonIllumination > 20) starsIndex -= 1;

        starsIndex = Math.max(0, Math.min(10, Math.round(starsIndex)));

        let starsLabel = "Not Visible";
        if (starsIndex === 10) starsLabel = "Perfect Sky";
        else if (starsIndex >= 8) starsLabel = "Clear Sky";
        else if (starsIndex >= 6) starsLabel = "Mostly Visible";
        else if (starsIndex >= 4) starsLabel = "Partly Visible";
        else if (starsIndex >= 2) starsLabel = "Low Visibility";

        const formatLocalTimeStartup = (unixSecs) => {
          if (!unixSecs) return "--:--";
          const d = new Date(unixSecs * 1000);
          const utc = d.getTime() + d.getTimezoneOffset() * 60000;
          const localD = new Date(utc + 1000 * data.timezone);
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
        const sunriseTime = formatLocalTimeStartup(data.sys?.sunrise);
        const sunsetTime = formatLocalTimeStartup(data.sys?.sunset);

        let aqiDash = Math.min((aqi / 500) * 90.47, 90.47);
        let aqiDashFade1 = aqiDash + (90.47 - aqiDash) / 2;

        forecastHtml = `
                        <div class="startup-details-grid" style="gap: 4px; flex-direction: column;">
                            <div style="display: flex; flex-direction: row; gap: 4px; width: 100%;">
                                <div class="startup-glass-tab" style="flex-direction: row; justify-content: space-around; flex: 1.45; box-sizing: border-box;">
                                    ${tabsHtml}
                                </div>
                                <div style="display: flex; flex-direction: row; flex: 1; align-items: stretch; gap: 4px;">
                                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; padding: 5px; position: relative;">
                                    <div style="position: relative; width: 44px; height: 44px;">
                                        <svg width="44" height="44" viewBox="0 0 44 44" style="position: absolute; top: 0; left: 0; transform: scale(1.5)">
                                            <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="90.47 113.1" transform="rotate(126 22 22)" />
                                            <circle cx="22" cy="22" r="18" fill="none" stroke="${aqiColor}" stroke-opacity="0.2" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="90.47 113.1" transform="rotate(126 22 22)" />
                                            <circle cx="22" cy="22" r="18" fill="none" stroke="${aqiColor}" stroke-opacity="0.4" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="${aqiDashFade1} 113.1" transform="rotate(126 22 22)" />
                                            <circle cx="22" cy="22" r="18" fill="none" stroke="${aqiColor}" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="${aqiDash} 113.1" transform="rotate(126 22 22)" />
                                        </svg>
                                        <div style="position: absolute; top: 12px; left: 0; width: 100%; text-align: center; font-size: 0.95rem; font-weight: bold; color: ${aqiColor};">${aqi}</div>
                                        <div style="position: absolute; bottom: -6px; left: 0; width: 100%; text-align: center; font-size: 0.6rem; font-weight: bold; color: #F9FAFB;">AQI</div>
                                    </div>
                                </div>
                                <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; flex: 1.2; padding: 5px; margin-left: -20px;">
                                    <img src="${window.getCachedAsset(`assets/icons/pollen_interface.svg`)}" style="width: 24px; height: 24px; transform: scaleY(1.8); margin-right: 4px; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4));" alt="Pollen">
                                    <div style="display: flex; flex-direction: column; justify-content: center;">
                                        <span style="font-size: 0.65rem; font-weight: bold; margin-top: -1px; margin-bottom: 3px; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif;">Pollen</span>
                                        <span style="font-size: 0.6rem; font-weight: bold; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif; max-width: 20px; margin-bottom: 3px; color: ${pollenColor};">${pollenLabel}</span>
                                        <span style="font-size: 0.55rem; opacity: 0.8; font-weight: bold; margin-top: 1px;">${pollenIndex} / 12</span>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div style="display: flex; flex-direction: row; gap: 4px; width: 100%; align-items: stretch;">
                                <div style="flex: 1.6; display: flex; flex-direction: column; gap: 4px;">
                                    <div style="display: flex;">
                        <div class="startup-glass-tab" style="flex-direction: row; justify-content: space-around; width: 100%; padding: 10px 5px; box-sizing: border-box; flex: 1;">
                            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; margin-top: 3px;">
                                <img src="${window.getCachedAsset(`assets/icons/umbrella.svg`)}" style="width: 28px; height: 28px; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4)); margin-top: -4px; margin-bottom: 2px;" alt="Umbrella">
                                <span style="font-size: 0.45rem; color: #F9FAFB; font-weight: bold; font-family: 'LocalComicSans', 'Comic Sans MS', 'Comic Sans', cursive; margin-bottom: 2px;">Umbrella</span>
                                <span style="font-size: 0.4rem; color: #F9FAFB; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif; text-align: center;">${umbrellaAdvice}</span>
                            </div>
                            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; margin-top: 3px;">
                                <img src="${window.getCachedAsset(`assets/icons/cloths.svg`)}" style="width: 28px; height: 28px; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4)); margin-top: -4px; margin-bottom: 2px;" alt="Clothing">
                                <span style="font-size: 0.45rem; color: #F9FAFB; font-weight: bold; font-family: 'LocalComicSans', 'Comic Sans MS', 'Comic Sans', cursive; margin-bottom: 2px;">Clothing</span>
                                <span style="font-size: 0.4rem; color: #F9FAFB; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif; text-align: center;">${clothingAdvice}</span>
                            </div>
                            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; margin-top: 3px;">
                                <img src="${window.getCachedAsset(`assets/icons/outdoor.svg`)}" style="width: 28px; height: 28px; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4)); margin-top: -4px; margin-bottom: 2px;" alt="Outdoor">
                                <span style="font-size: 0.45rem; color: #F9FAFB; font-weight: bold; font-family: 'LocalComicSans', 'Comic Sans MS', 'Comic Sans', cursive; margin-bottom: 2px;">Outdoor</span>
                                <span style="font-size: 0.4rem; color: #F9FAFB; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif; text-align: center;">${outdoorAdvice}</span>
                            </div>
                            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; margin-top: 3px;">
                                <img src="${window.getCachedAsset(`assets/icons/driving.svg`)}" style="width: 28px; height: 28px; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4)); margin-top: -4px; margin-bottom: 2px;" alt="Driving">
                                <span style="font-size: 0.45rem; color: #F9FAFB; font-weight: bold; font-family: 'LocalComicSans', 'Comic Sans MS', 'Comic Sans', cursive; margin-bottom: 2px;">Driving</span>
                                <span style="font-size: 0.4rem; color: #F9FAFB; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif; text-align: center;">${drivingAdvice}</span>
                            </div>
                        </div>
                                    </div>
                                    <div class="startup-glass-tab" style="flex-direction: column; width: 100%; padding: 15px; box-sizing: border-box; flex: 1;">
                                        <span style="font-size: 0.6rem; font-weight: bold; margin-top: -11px; margin-left: -10px; margin-bottom: 4px; color: #F9FAFB; text-align: left; display: flex; align-items: center; gap: 4px;"><i class='bx bx-news'></i> Weather News</span>
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <img src="${window.getCachedAsset(`assets/images/weather_news.webp`)}" alt="News" style="width: 90px; height: 48px; border-radius: 6px; margin-left: -10px; margin-bottom:-10px; object-fit: cover;">
                                            <span style="font-size: 0.6rem; margin-left: 15px; opacity: 0.5; font-weight: 500; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif;">Update Soon...!</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="startup-glass-tab" style="flex: 1; padding: 0; overflow: hidden; position: relative; display: flex; flex-direction: column; min-height: 80px;">
                                    <iframe frameborder="0" style="border:0; position: absolute; top: -65px; left: -140px; width: calc(100% + 280px); height: calc(100% + 130px); pointer-events: none;" src="https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&zoom=5&level=surface&overlay=satellite&menu=&message=&marker=false&calendar=&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1&particles=true&playThunder=false" allow="autoplay 'none'"></iframe>
                                    <div style="position: absolute; top: 50%; left: 50%; pointer-events: none; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 3px; transform: translate(-50%, -100%); z-index: 5; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.8));">
                                        <i class='bx bxs-map' style="color: #C62828; font-size: 1rem; transform: scaleX(0.9); margin-left: -0.449px; line-height: 1;"></i>
                                        <div style="width: 2px; height: 2px; background: #C62828; border-radius: 50%; margin-top: -3px; box-shadow: 0 0 2px rgba(0,0,0,0.5);"></div>
                                    </div>
                                    <div style="position: absolute; bottom: -1px; width: 100%; text-align: center; pointer-events: none; z-index: 6;">
                                        <span style="font-size: 0.35rem; font-weight: bold; color: #232323; text-shadow: 0 0 3px rgba(255, 255, 255, 0.8), 0 0 5px rgba(255, 255, 255, 0.8);">Live Radar &bull; Powered by Windy.com</span>
                                    </div>
                                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 12px; box-shadow: inset 0 0 10px rgba(0,0,0,0.5);"></div>
                                </div>
                            </div>
                            <div style="display: flex; flex-direction: row; gap: 4px; width: 100%;">
                                <div class="startup-glass-tab" style="flex: 0.9; padding: 5px 4px; display: flex; align-items: center; justify-content: left; gap: 4px; box-sizing: border-box;">
                                        <img src="${window.getCachedAsset(`assets/icons/cloud_percentage.svg`)}" style="width: 24px; height: 24px; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4));" alt="Clouds">
                                        <div style="display: flex; flex-direction: column; gap: 2px; align-items: center; margin-left: 4px;">
                                            <span style="font-size: 0.55rem; color: #F9FAFB; font-weight: bold; font-family: 'LocalComicSans', 'Comic Sans MS', 'Comic Sans', cursive;">Clouds</span>
                                            <span style="font-size: 0.65rem; font-weight: bold; color: #F9FAFB; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif;">${clouds}%</span>
                                        </div>
                                </div>
                                <div class="startup-glass-tab" style="flex: 0.9; padding: 5px 4px; display: flex; align-items: center; justify-content: left; gap: 4px; box-sizing: border-box;">
                                        <img src="${window.getCachedAsset(`assets/icons/wind_direction.svg`)}" style="width: 24px; height: 24px; margin-left: 1px; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4)); transform: rotate(${windDeg}deg);" alt="Wind Direction">
                                        <div style="display: flex; flex-direction: column; gap: 2px; align-items: center; margin-left: 4px;">
                                            <span style="font-size: 0.55rem; color: #F9FAFB; font-weight: bold; font-family: 'LocalComicSans', 'Comic Sans MS', 'Comic Sans', cursive;">Wind</span>
                                            <span style="font-size: 0.65rem; font-weight: bold; color: #F9FAFB; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif;">${windDir}</span>
                                        </div>
                                </div>
                                <div class="startup-glass-tab" style="flex: 1.05; padding: 5px 2px; display: flex; align-items: center; justify-content: left; gap: 4px; box-sizing: border-box;">
                                    <img src="${window.getCachedAsset(`assets/icons/sun_riseset.svg`)}" style="width: 24px; height: 24px; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4));" alt="Sun">
                                    <div style="display: flex; flex-direction: column; gap: 2px; flex: 1; padding-right: 4px;">
                                        <div style="display: flex; align-items: center; gap: 2px;">
                                            <i class="ti ti-arrow-big-up-lines" style="font-size: 0.6rem; color: #F9FAFB; opacity: 0.9;"></i>
                                            <span style="font-size: 0.55rem; font-weight: 600; color: #F9FAFB; white-space: nowrap; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif;">${sunriseTime}</span>
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 2px;">
                                            <i class="ti ti-arrow-big-down-lines" style="font-size: 0.6rem; color: #F9FAFB; opacity: 0.9; margin-top: 2px;"></i>
                                            <span style="font-size: 0.55rem; font-weight: 600; color: #F9FAFB; white-space: nowrap; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif;">${sunsetTime}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="startup-glass-tab" style="flex: 1.15; padding: 5px 4px; display: flex; align-items: center; justify-content: left; gap: 4px; box-sizing: border-box;">
                                    <img src="${window.getCachedAsset(`assets/icons/stargazing.svg`)}" style="width: 24px; height: 24px; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4));" alt="Star View">
                                    <div style="display: flex; flex-direction: column; gap: 2px; align-items: left;">
                                        <span style="font-size: 0.55rem; color: #F9FAFB; font-weight: bold; font-family: 'LocalComicSans', 'Comic Sans MS', 'Comic Sans', cursive; white-space: nowrap;">Star View</span>
                                        <span style="font-size: 0.55rem; font-weight: bold; color: #F9FAFB; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif;">${starsLabel}</span>
                                    </div>
                                </div>
                                
                            </div>
                            <div class="startup-glass-tab" style="width: 100%; display: flex; flex-direction: row; gap: 8px; box-sizing: border-box; padding: 10px; margin-top: 0px; position: relative; overflow: hidden;">
                                <div style="flex: 1.5; display: flex; flex-direction: column; text-align: left; justify-content: center; z-index: 2;">
                                    <span style="font-size: 0.8rem; font-weight: bold; color: #F9FAFB; font-family: 'LocalComicSans', 'Comic Sans MS', 'Comic Sans', cursive;">About Us</span>
                                    <span style="font-size: 0.38rem; opacity: 0.8; color: #F9FAFB; margin-top: 3px; margin-bottom: 2px; line-height: 1.3; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif;">Weather Box is crafted with passion to deliver accurate, real-time weather updates with a beautiful experience. We believe weather connects us all, and build <span style="cursor: pointer; color: #0AC4E0; font-weight: bold; text-decoration: none;" onclick="if(typeof toggleAbout === 'function') toggleAbout()">...more</span></span>
                                    <span style="font-size: 0.5rem; font-weight: 400; font-style: italic; color: #ffd54f; font-family: 'LocalPacifico', 'Pacifico', cursive;">Thank you for being here! 💛</span>
                                </div>
                                <div style="flex: 2.2; display: flex; flex-direction: row; justify-content: space-around; align-items: stretch; gap: 4px; z-index: 2;">
                                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: top; text-align: center;">
                                        <img src="${window.getCachedAsset(`assets/icons/accurate_aboutus.svg`)}" style="width: 20px; height: 20px; margin-top: 2px;" alt="Accurate">
                                        <span style="font-size: 0.55rem; font-weight: bold; color: #F9FAFB; font-family: 'LocalComicSans', 'Comic Sans MS', 'Comic Sans', cursive;">Accurate</span>
                                        <span style="font-size: 0.38rem; opacity: 0.7; margin-top: 2px; line-height: 1.1; color: #F9FAFB; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif;">We use trusted global sources to deliver live and accurate weather data</span>
                                    </div>
                                    <div style="width: 1px; height: 35px; background: rgba(255,255,255,0.2); margin: auto 0;"></div>
                                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: top; text-align: center;">
                                        <img src="${window.getCachedAsset(`assets/icons/beautiful_aboutus.svg`)}" style="width: 20px; height: 20px; margin-bottom: 2px;" alt="Beautiful">
                                        <span style="font-size: 0.55rem; font-weight: bold; color: #F9FAFB; font-family: 'LocalComicSans', 'Comic Sans MS', 'Comic Sans', cursive;">Compact</span>
                                        <span style="font-size: 0.38rem; opacity: 0.7; margin-top: 2px; line-height: 1.1; color: #F9FAFB; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif;">Crafted for a smooth and delightful weather experience</span>
                                    </div>
                                    <div style="width: 1px; height: 35px; background: rgba(255,255,255,0.2); margin: auto 0;"></div>
                                    <div style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: top; text-align: center;">
                                        <img src="${window.getCachedAsset(`assets/icons/privacy_aboutus.svg`)}" style="width: 20px; height: 20px; margin-bottom: 2px;" alt="Private">
                                        <span style="font-size: 0.55rem; font-weight: bold; color: #F9FAFB; font-family: 'LocalComicSans', 'Comic Sans MS', 'Comic Sans', cursive;">Privacy</span>
                                        <span style="font-size: 0.38rem; opacity: 0.7; margin-top: 2px; line-height: 1.1; color: #F9FAFB; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif;">We respect your privacy, never collect personal information</span>
                                    </div>
                                </div>
                                <div style="flex: 0.8; display: flex; align-items: center; justify-content: center; z-index: 2;"></div>
                                <img src="${window.getCachedAsset(`assets/images/connect_us.webp`)}" alt="Connect Us" style="position: absolute; right: 0; top: 0; bottom: 0; height: 100%; width: 110px; object-fit: cover; z-index: 1; -webkit-mask-image: linear-gradient(to right, transparent 0%, black 50%); mask-image: linear-gradient(to right, transparent 0%, black 50%); opacity: 0.9;">
                            </div>
                            <div style="display: flex; flex-direction: row; gap: 4px; width: 100%;">
                                <div class="startup-glass-tab" style="flex: 1; padding: 6px 4px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; box-sizing: border-box;" onclick="window.open('https://github.com/mnvdprasad/Weather-Box', '_blank')">
                                    <div style="display: flex; align-items: center; gap: 4px; min-width: 0;">
                                        <img src="${window.getCachedAsset(`assets/icons/github.svg`)}" style="width: 1.2rem; height: 1.2rem;" alt="Github">
                                        <div style="display: flex; flex-direction: column; min-width: 0;">
                                            <span style="font-size: 0.55rem; font-weight: bold; color: #F9FAFB; font-family: 'LocalComicSans', 'Comic Sans MS', 'Comic Sans', cursive; white-space: nowrap;">Github</span>
                                            <span style="font-size: 0.4rem; opacity: 0.8; color: #F9FAFB; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif;">Explore the source</span>
                                        </div>
                                    </div>
                                    <i class='bx bx-chevron-right' style="font-size: 0.8rem; opacity: 0.7; flex-shrink: 0;"></i>
                                </div>
                                <div class="startup-glass-tab" style="flex: 1; padding: 6px 4px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; box-sizing: border-box;" onclick="window.open('https://github.com/mnvdprasad/Weather-Box/discussions', '_blank')">
                                    <div style="display: flex; align-items: center; gap: 4px; min-width: 0;">
                                        <img src="${window.getCachedAsset(`assets/icons/feedback.svg`)}" style="width: 1rem; height: 1rem;" alt="Feedback">
                                        <div style="display: flex; flex-direction: column; min-width: 0;">
                                            <span style="font-size: 0.55rem; font-weight: bold; color: #F9FAFB; font-family: 'LocalComicSans', 'Comic Sans MS', 'Comic Sans', cursive; white-space: nowrap;">Feedback</span>
                                            <span style="font-size: 0.4rem; opacity: 0.8; color: #F9FAFB; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif;">Help us improve</span>
                                        </div>
                                    </div>
                                    <i class='bx bx-chevron-right' style="font-size: 0.8rem; opacity: 0.7; flex-shrink: 0;"></i>
                                </div>
                                <div class="startup-glass-tab" style="flex: 1; padding: 6px 4px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; box-sizing: border-box;" onclick="if(navigator.share) { navigator.share({ title: 'Weather Box', url: 'https://weather-box-ten.vercel.app' }); } else { window.open('https://weather-box-ten.vercel.app', '_blank'); }">
                                    <div style="display: flex; align-items: center; gap: 4px; min-width: 0;">
                                        <img src="${window.getCachedAsset(`assets/icons/share.svg`)}" style="width: 1.2rem; height: 1.2rem;" alt="Share">
                                        <div style="display: flex; flex-direction: column; min-width: 0;">
                                            <span style="font-size: 0.55rem; font-weight: bold; color: #F9FAFB; font-family: 'LocalComicSans', 'Comic Sans MS', 'Comic Sans', cursive; white-space: nowrap;">Share</span>
                                            <span style="font-size: 0.4rem; opacity: 0.8; color: #F9FAFB; margin-top: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif;">Share with friends</span>
                                        </div>
                                    </div>
                                    <i class='bx bx-chevron-right' style="font-size: 0.8rem; color: #F9FAFB; opacity: 0.7; flex-shrink: 0;"></i>
                                </div>
                            </div>
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; margin-top: 10px; margin-bottom: 5px; gap: 4px;">
                            <div style="font-size: 0.55rem; opacity: 0.7; display: flex; gap: 6px; align-items: center; color: #F9FAFB; font-weight: 500; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif;">
                                <span style="cursor: pointer;" onclick="if(typeof toggleAbout === 'function') toggleAbout()">&copy; 2026 Weather Box</span>
                                <span style="font-size: 0.5rem;">&bull;</span>
                                <span style="cursor: pointer;" onclick="if(typeof toggleTerms === 'function') toggleTerms()">Terms of Service</span>
                                <span style="font-size: 0.5rem;">&bull;</span>
                                <span style="cursor: pointer;" onclick="if(typeof togglePrivacy === 'function') togglePrivacy()">Privacy Policy</span>
                            </div>
                            <div style="font-size: 0.55rem; opacity: 0.7; text-align:center; margin-top: 5px; margin-bottom: -10px; color: #F9FAFB; font-weight: 500; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif;">
                              Developed by<a href="https://github.com/mnvdprasad" target="_blank" class="developer-link" style="font-weight: bold;">mnvdprasad</a>
                            </div>
                        </div>
                        </div>
                    `;
      }
    } catch (err) {
      console.warn("Startup hourly forecast fetch failed", err);
    }

    let displayCityName = data.name;
    let resolvedFullAddress = "";
    let resolvedCountry = data.sys?.country || "";

    try {
      const nomRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
      );
      if (nomRes.ok) {
        const nomData = await nomRes.json();
        if (nomData) {
          let cName = nomData.name;
          if (!cName || /\d/.test(cName)) {
            cName = nomData.address
              ? nomData.address.village ||
                nomData.address.town ||
                nomData.address.city ||
                nomData.address.hamlet ||
                nomData.address.suburb
              : "";
          }
          if (!cName && nomData.display_name) {
            const parts = nomData.display_name.split(",");
            const textParts = parts
              .map((p) => p.trim())
              .filter((p) => !/\d/.test(p));
            cName = textParts.length > 0 ? textParts[0] : "";
          }
          if (cName) {
            displayCityName = cName;
          }

          if (nomData.address) {
            resolvedCountry = nomData.address.country_code
              ? nomData.address.country_code.toUpperCase()
              : resolvedCountry;

            let parts = [displayCityName];
            let addr = nomData.address;
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

            resolvedFullAddress = parts.filter(Boolean).join(",<br>");
          }
        }
      }
    } catch (err) {
      console.warn("Startup reverse geo failed", err);
    }

    if (
      currentStartupCity === localStorage.getItem("lastCity") &&
      localStorage.getItem("lastCityName")
    ) {
      displayCityName = localStorage.getItem("lastCityName");
    } else if (majorCities.includes(currentStartupCity)) {
      displayCityName = currentStartupCity;
    }

    let fullCountry = resolvedCountry;
    if (fullCountry && fullCountry.length === 2) {
      try {
        const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
        fullCountry = regionNames.of(fullCountry.toUpperCase()) || fullCountry;
      } catch (e) {}
    }

    let finalCityName = displayCityName
      .replace(/[0-9]/g, "")
      .replace(/^[,\s\-]+|[,\s\-]+$/g, "")
      .trim();
    if (!finalCityName) finalCityName = displayCityName;

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

    const htmlString = `
                <div class="weather-main-display">
                    <div class="weather-info">
                        <div class="city-main" style= "color: #F9FAFB; font-family: 'LocalComicSans', 'Comic Sans MS', 'Comic Sans', cursive; text-transform: capitalize;">${finalCityName}</div>
                        <div class="condition-main" style="text-transform: capitalize; font-size: 0.75rem; color: #F9FAFB; font-family: 'LocalComicSans', 'Comic Sans MS', 'Comic Sans', cursive;">${condition}</div>
                        <div class="temp-main" style=" color: #F9FAFB; font-family:'Times New Roman', sans-serif;">${Math.round(displayTemp)}<span class="temp-unit">${tempUnit}</span></div>
                        <div class="feels-like" style="font-size: 0.6rem; color: #F9FAFB; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif;">Feels like ${Math.round(displayFeelsLike)}${tempUnit.toLowerCase()}</div>
                        <div style="display: flex; flex-direction: row; gap: 10px; font-size: 0.55rem; color: #F9FAFB; font-family: 'LocalMerriweatherSans', 'Merriweather Sans', sans-serif; align-items: center; margin-top: 10px; width: 100%; justify-content: space-around;">
                            <div style="display: flex; flex-direction: column; align-items: center; gap: 2px; flex: 1 1 0; white-space: nowrap;">
                                <div style="display: flex; align-items: center; gap: 3px;"><i class='ti ti-droplet'></i> Humidity</div>
                                <span>${humidity}%</span>
                            </div>
                            <div style="width: 0.5px; min-width: 0.5px; height: 25px; background: rgba(255, 255, 255, 0.4); flex-shrink: 0;"></div>
                            <div style="display: flex; flex-direction: column; align-items: center; gap: 2px; flex: 1 1 0; white-space: nowrap;">
                                <div style="display: flex; align-items: center; gap: 3px;"><i class='bx bx-wind'></i> Wind</div>
                                <span>${windStr} ${currentUnits.wind}</span>
                            </div>
                            <div style="width: 0.5px; min-width: 0.5px; height: 25px; background: rgba(255, 255, 255, 0.4); flex-shrink: 0;"></div>
                            <div style="display: flex; flex-direction: column; align-items: center; gap: 2px; flex: 1 1 0; white-space: nowrap;">
                                <div style="display: flex; align-items: center; gap: 3px;"><i class='bx bx-cloud-rain'></i> Precip</div>
                                <span>${precipProb}%</span>
                            </div>
                            <div style="width: 0.5px; min-width: 0.5px; height: 25px; background: rgba(255, 255, 255, 0.4); flex-shrink: 0;"></div>
                            <div style="display: flex; flex-direction: column; align-items: center; gap: 2px; flex: 1 1 0; white-space: nowrap;">
                                <div style="display: flex; align-items: center; gap: 3px;"><i class='bx bx-show'></i> Visibility</div>
                                <span>${visStr} ${currentUnits.vis}</span>
                            </div>
                        </div>
                    </div>
                </div>
                ${forecastHtml}
            `;

    if (isPreload) {
      window.preloadedHomeHTML = htmlString;
      window.homeLastLoadedCity = currentStartupCity;
    } else {
      let homeContainer = document.getElementById("home-result");
      if (!homeContainer) {
        homeContainer = document.createElement("div");
        homeContainer.id = "home-result";
        homeContainer.className = "result";
        document.querySelector(".weather-box").appendChild(homeContainer);
      }
      homeContainer.innerHTML = htmlString;
      document.getElementById("result").style.display = "none";
      homeContainer.style.display = "block";
      
      window.preloadedHomeHTML = htmlString;
      window.homeLastLoadedCity = currentStartupCity;
    }
  } catch (error) {
    console.warn("Startup city fetch failed", error);
  }
}

//Initiates the display of a random startup city.
function showRandomStartupCity() {
  currentStartupCity = null;
  fetchStartupCityWeather();
  if (startupInterval) clearInterval(startupInterval);
}

document.addEventListener("DOMContentLoaded", function () {
  const homeBtnHTML = `
        <i class="ti ti-home top-left-icon" id="home-btn" title="Home"></i>
  `;
  const topLeftControls = document.querySelector(".top-left-controls");
  if (topLeftControls) {
    topLeftControls.insertAdjacentHTML("beforeend", homeBtnHTML);
  }

  const homeBtn = document.getElementById("home-btn");
  if (homeBtn) {
    homeBtn.addEventListener("click", function () {
      if (typeof window.pushAppState === "function") {
        window.pushAppState("#home");
      }

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
      if (typeof window.toggleRadarView === "function" && window.isRadarView) {
        window.toggleRadarView(false);
      }

      if (localStorage.getItem("rememberCity") === "true") {
        const lastCity = localStorage.getItem("lastCity");
        if (lastCity) {
          if (cityInput) cityInput.value = lastCity;
          currentStartupCity = lastCity;
          fetchStartupCityWeather();
        } else {
          showRandomStartupCity();
        }
      } else {
        showRandomStartupCity();
      }
    });
  }
});
