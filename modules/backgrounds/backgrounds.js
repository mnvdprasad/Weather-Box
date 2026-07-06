function triggerLightning(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  const weatherBox = document.querySelector(".weather-box");
  if (!weatherBox.className.includes("thunderstorm")) {
    return;
  }
  el.classList.remove("striking");
  void el.offsetWidth;
  el.classList.add("striking");

  // Randomize position
  el.style.left = Math.floor(Math.random() * 70) + "%";
  el.style.right = "auto";
  const scale = Math.random() > 0.5 ? 1 : -1;
  el.style.transform = `scaleX(${scale})`;

  const isSlow = selector.includes("3") || selector.includes("4");
  const animationDuration = isSlow ? 4000 : 3000;
  const nextDelay = Math.random() * 5000 + 15000; // Calculate a random delay for the next strike (between 15 and 20 seconds)
  lightningTimers[selector] = setTimeout(() => {
    el.classList.remove("striking");
    if (weatherBox.className.includes("thunderstorm")) {
      lightningTimers[selector] = setTimeout(
        () => triggerLightning(selector),
        nextDelay,
      );
    }
  }, animationDuration);
}

function triggerThunderFlash(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  const weatherBox = document.querySelector(".weather-box");
  if (!weatherBox.className.includes("thunderstorm")) {
    return;
  }
  el.classList.remove("flashing");
  void el.offsetWidth;
  el.classList.add("flashing");
  const animationDuration = 2000; // Define the duration of the thunder flash animation
  const nextDelay = Math.random() * 6000 + 4000; // Calculate a random delay for the next flash (between 4 and 10 seconds)
  lightningTimers[selector] = setTimeout(() => {
    el.classList.remove("flashing");
    if (weatherBox.className.includes("thunderstorm")) {
      lightningTimers[selector] = setTimeout(
        () => triggerThunderFlash(selector),
        nextDelay,
      );
    }
  }, animationDuration);
}

function handleTestAnimations(city) {
  const result = document.getElementById("result");
  const messageBox = document.getElementById("message-box");

  // Start of temporary code for testing animations
  const testAnimations = {
    // Clear Sky
    clear: { class: "clear-day", icon: "clear-day", condition: "Clear" },
    "clear night": {
      class: "clear-night",
      icon: "clear-night",
      condition: "Clear",
    },
    "clear sky": {
      class: "clear-day",
      icon: "clear-day",
      condition: "Clear Sky",
    },
    "clear sky night": {
      class: "clear-night",
      icon: "clear-night",
      condition: "Clear Sky",
    },
    "mostly clear": {
      class: "clear-day",
      icon: "clear-day",
      condition: "Mostly Clear",
    },
    "mostly clear night": {
      class: "clear-night",
      icon: "clear-night",
      condition: "Mostly Clear",
    },
    "few clouds": {
      class: "clear-day",
      icon: "clear-day",
      condition: "Few Clouds",
    },
    "few clouds night": {
      class: "clear-night",
      icon: "clear-night",
      condition: "Few Clouds",
    },
    sunny: { class: "clear-day", icon: "clear-day", condition: "Sunny" },
    "mostly sunny": {
      class: "clear-day",
      icon: "clear-day",
      condition: "Mostly Sunny",
    },

    // Partly Cloudy
    "scattered clouds": {
      class: "partly-cloudy-day",
      icon: "partly-sunny",
      condition: "Scattered Clouds",
    },
    "scattered clouds night": {
      class: "partly-cloudy-night",
      icon: "partly-cloudy",
      condition: "Scattered Clouds",
    },
    "partly cloudy": {
      class: "partly-cloudy-day",
      icon: "partly-sunny",
      condition: "Partly Cloudy",
    },
    "partly cloudy night": {
      class: "partly-cloudy-night",
      icon: "partly-cloudy",
      condition: "Partly Cloudy",
    },
    "partly sunny": {
      class: "partly-cloudy-day",
      icon: "partly-sunny",
      condition: "Partly Sunny",
    },

    // Cloudy
    "broken clouds": {
      class: "cloudy-day",
      icon: "mostly-cloudy",
      condition: "Broken Clouds",
    },
    "broken clouds night": {
      class: "cloudy-night",
      icon: "mostly-cloudy_night",
      condition: "Broken Clouds",
    },
    "mostly cloudy": {
      class: "cloudy-day",
      icon: "mostly-cloudy",
      condition: "Mostly Cloudy",
    },
    "mostly cloudy night": {
      class: "cloudy-night",
      icon: "mostly-cloudy_night",
      condition: "Mostly Cloudy",
    },
    cloudy: {
      class: "cloudy-day",
      icon: "mostly-cloudy",
      condition: "Cloudy",
    },
    "cloudy night": {
      class: "cloudy-night",
      icon: "mostly-cloudy_night",
      condition: "Cloudy",
    },

    // Overcast
    overcast: {
      class: "overcast-day",
      icon: "overcast",
      condition: "Overcast",
    },
    "overcast night": {
      class: "overcast-night",
      icon: "overcast",
      condition: "Overcast",
    },
    "overcast clouds": {
      class: "overcast-day",
      icon: "overcast",
      condition: "Overcast Clouds",
    },
    "overcast clouds night": {
      class: "overcast-night",
      icon: "overcast",
      condition: "Overcast Clouds",
    },

    // Drizzle
    "light intensity drizzle": {
      class: "drizzle-day",
      icon: "drizzle",
      condition: "Light Intensity Drizzle",
    },
    "light intensity drizzle night": {
      class: "drizzle-night",
      icon: "drizzle",
      condition: "Light Intensity Drizzle",
    },
    drizzle: {
      class: "drizzle-day",
      icon: "drizzle",
      condition: "Drizzle",
    },
    "drizzle night": {
      class: "drizzle-night",
      icon: "drizzle",
      condition: "Drizzle",
    },
    "heavy intensity drizzle": {
      class: "drizzle-day",
      icon: "drizzle",
      condition: "Heavy Intensity Drizzle",
    },
    "heavy intensity drizzle night": {
      class: "drizzle-night",
      icon: "drizzle",
      condition: "Heavy Intensity Drizzle",
    },
    "freezing drizzle": {
      class: "drizzle-day",
      icon: "drizzle",
      condition: "Freezing Drizzle",
    },
    "freezing drizzle night": {
      class: "drizzle-night",
      icon: "drizzle",
      condition: "Freezing Drizzle",
    },
    "freezing drizzle": {
      class: "drizzle-day",
      icon: "drizzle",
      condition: "Freezing Drizzle",
    },
    "freezing drizzle night": {
      class: "drizzle-night",
      icon: "drizzle",
      condition: "Freezing Drizzle",
    },

    // Rain
    "light rain": {
      class: "rain-day",
      icon: "rain",
      condition: "Light Rain",
    },
    "light rain night": {
      class: "rain-night",
      icon: "rain",
      condition: "Light Rain",
    },
    rain: { class: "rain-day", icon: "rain", condition: "Rain" },
    "rain night": {
      class: "rain-night",
      icon: "rain",
      condition: "Rain",
    },
    "light intensity shower rain": {
      class: "rain-day",
      icon: "rain",
      condition: "Light Intensity Shower Rain",
    },
    "light intensity shower rain night": {
      class: "rain-night",
      icon: "rain",
      condition: "Light Intensity Shower Rain",
    },
    "shower rain": {
      class: "rain-day",
      icon: "rain",
      condition: "Shower Rain",
    },
    "shower rain night": {
      class: "rain-night",
      icon: "rain",
      condition: "Shower Rain",
    },
    "scattered showers": {
      class: "rain-day",
      icon: "rain",
      condition: "Scattered Showers",
    },
    "scattered showers night": {
      class: "rain-night",
      icon: "rain",
      condition: "Scattered Showers",
    },
    "passing showers": {
      class: "rain-day",
      icon: "rain",
      condition: "Passing Showers",
    },
    "passing showers night": {
      class: "rain-night",
      icon: "rain",
      condition: "Passing Showers",
    },
    "ragged shower rain": {
      class: "rain-day",
      icon: "rain",
      condition: "Ragged Shower Rain",
    },
    "ragged shower rain night": {
      class: "rain-night",
      icon: "rain",
      condition: "Ragged Shower Rain",
    },
    "freezing rain": {
      class: "rain-day",
      icon: "rain",
      condition: "Freezing Rain",
    },
    "freezing rain night": {
      class: "rain-night",
      icon: "rain",
      condition: "Freezing Rain",
    },
    "isolated showers": {
      class: "rain-day",
      icon: "rain",
      condition: "Isolated Showers",
    },
    "isolated showers night": {
      class: "rain-night",
      icon: "rain",
      condition: "Isolated Showers",
    },
    "continuous rain": {
      class: "rain-day",
      icon: "rain",
      condition: "Continuous Rain",
    },
    "continuous rain night": {
      class: "rain-night",
      icon: "rain",
      condition: "Continuous Rain",
    },

    // Moderate Rain
    "moderate rain": {
      class: "moderate-rain-day",
      icon: "rain",
      condition: "Moderate Rain",
    },
    "moderate rain night": {
      class: "moderate-rain-night",
      icon: "rain",
      condition: "Moderate Rain",
    },

    // Heavy & Extreme Rain
    "heavy rain": {
      class: "heavy-rain-day",
      icon: "extreme-rain",
      condition: "Heavy Intensity Rain",
    },
    "heavy rain night": {
      class: "heavy-rain-night",
      icon: "extreme-rain",
      condition: "Heavy Intensity Rain",
    },
    "very heavy rain": {
      class: "heavy-rain-day",
      icon: "extreme-rain",
      condition: "Very Heavy Rain",
    },
    "very heavy rain night": {
      class: "heavy-rain-night",
      icon: "extreme-rain",
      condition: "Very Heavy Rain",
    },
    downpours: {
      class: "heavy-rain-day",
      icon: "extreme-rain",
      condition: "Downpours",
    },
    "downpours night": {
      class: "heavy-rain-night",
      icon: "extreme-rain",
      condition: "Downpours",
    },
    "heavy intensity shower rain": {
      class: "heavy-rain-day",
      icon: "extreme-rain",
      condition: "Heavy Intensity Shower Rain",
    },
    "heavy intensity shower rain night": {
      class: "heavy-rain-night",
      icon: "extreme-rain",
      condition: "Heavy Intensity Shower Rain",
    },
    "extreme rain": {
      class: "extreme-rain-day",
      icon: "extreme-rain",
      condition: "Extreme Rain",
    },
    "extreme rain night": {
      class: "extreme-rain-night",
      icon: "extreme-rain",
      condition: "Extreme Rain",
    },
    "torrential rain": {
      class: "extreme-rain-day",
      icon: "extreme-rain",
      condition: "Torrential Rain",
    },
    "torrential rain night": {
      class: "extreme-rain-night",
      icon: "extreme-rain",
      condition: "Torrential Rain",
    },

    // Rain and Snow
    sleet: { class: "rain-snow-day", icon: "sleet", condition: "Sleet" },
    "sleet night": {
      class: "rain-snow-night",
      icon: "sleet",
      condition: "Sleet",
    },
    "ice pellets": {
      class: "rain-snow-day",
      icon: "sleet",
      condition: "Ice Pellets",
    },
    "ice pellets night": {
      class: "rain-snow-night",
      icon: "sleet",
      condition: "Ice Pellets",
    },
    "light rain and snow": {
      class: "rain-snow-day",
      icon: "sleet",
      condition: "Light Rain and Snow",
    },
    "light rain and snow night": {
      class: "rain-snow-night",
      icon: "sleet",
      condition: "Light Rain and Snow",
    },
    "rain and snow": {
      class: "rain-snow-day",
      icon: "sleet",
      condition: "Rain and Snow",
    },
    "rain and snow night": {
      class: "rain-snow-night",
      icon: "sleet",
      condition: "Rain and Snow",
    },
    "wintry mix": {
      class: "rain-snow-day",
      icon: "sleet",
      condition: "Wintry Mix",
    },
    "wintry mix night": {
      class: "rain-snow-night",
      icon: "sleet",
      condition: "Wintry Mix",
    },

    // Light Snow
    "light snow": {
      class: "light-snow-day",
      icon: "snow",
      condition: "Light Snow",
    },
    "light snow night": {
      class: "light-snow-night",
      icon: "snow",
      condition: "Light Snow",
    },
    flurries: {
      class: "light-snow-day",
      icon: "snow",
      condition: "Flurries",
    },
    "flurries night": {
      class: "light-snow-night",
      icon: "snow",
      condition: "Flurries",
    },
    "light snow showers": {
      class: "light-snow-day",
      icon: "snow",
      condition: "Light Snow Showers",
    },
    "light snow showers night": {
      class: "light-snow-night",
      icon: "snow",
      condition: "Light Snow Showers",
    },

    // Snow
    snow: { class: "snow-day", icon: "snow", condition: "Snow" },
    "snow night": {
      class: "snow-night",
      icon: "snow",
      condition: "Snow",
    },
    "moderate snow": {
      class: "snow-day",
      icon: "snow",
      condition: "Moderate Snow",
    },
    "moderate snow night": {
      class: "snow-night",
      icon: "snow",
      condition: "Moderate Snow",
    },
    "snow showers": {
      class: "snow-day",
      icon: "snow",
      condition: "Snow Showers",
    },
    "snow showers night": {
      class: "snow-night",
      icon: "snow",
      condition: "Snow Showers",
    },

    // Heavy Snow
    "heavy snow": {
      class: "heavy-snow-day",
      icon: "extreme-snow",
      condition: "Heavy Snow",
    },
    "heavy snow night": {
      class: "heavy-snow-night",
      icon: "extreme-snow",
      condition: "Heavy Snow",
    },
    "heavy snow showers": {
      class: "heavy-snow-day",
      icon: "extreme-snow",
      condition: "Heavy Snow Showers",
    },
    "heavy snow showers night": {
      class: "heavy-snow-night",
      icon: "extreme-snow",
      condition: "Heavy Snow Showers",
    },
    "blowing snow": {
      class: "heavy-snow-day",
      icon: "extreme-snow",
      condition: "Blowing Snow",
    },
    "blowing snow night": {
      class: "heavy-snow-night",
      icon: "extreme-snow",
      condition: "Blowing Snow",
    },
    blizzard: {
      class: "heavy-snow-day",
      icon: "extreme-snow",
      condition: "Blizzard",
    },
    "blizzard night": {
      class: "heavy-snow-night",
      icon: "extreme-snow",
      condition: "Blizzard",
    },

    // Hail
    hail: { class: "hail-day", icon: "hail", condition: "Hail" },
    "hail night": {
      class: "hail-night",
      icon: "hail",
      condition: "Hail",
    },

    // Mist / Fog / Haze
    mist: { class: "fog-day", icon: "mist", condition: "Mist" },
    "mist night": { class: "fog-night", icon: "mist", condition: "Mist" },

    fog: { class: "fog-day", icon: "fog", condition: "Fog" },
    "fog night": { class: "fog-night", icon: "fog", condition: "Fog" },
    "patchy fog": {
      class: "fog-day",
      icon: "fog",
      condition: "Patchy Fog",
    },
    "patchy fog night": {
      class: "fog-night",
      icon: "fog",
      condition: "Patchy Fog",
    },
    "dense fog": {
      class: "fog-day",
      icon: "fog",
      condition: "Dense Fog",
    },
    "dense fog night": {
      class: "fog-night",
      icon: "fog",
      condition: "Dense Fog",
    },
    "freezing fog": {
      class: "fog-day",
      icon: "fog",
      condition: "Freezing Fog",
    },
    "freezing fog night": {
      class: "fog-night",
      icon: "fog",
      condition: "Freezing Fog",
    },

    haze: { class: "fog-day", icon: "haze", condition: "Haze" },
    "haze night": { class: "fog-night", icon: "haze", condition: "Haze" },
    smoke: { class: "fog-day", icon: "haze", condition: "Smoke" },
    "smoke night": {
      class: "fog-night",
      icon: "haze",
      condition: "Smoke",
    },
    smog: { class: "fog-day", icon: "haze", condition: "Smog" },
    "smog night": { class: "fog-night", icon: "haze", condition: "Smog" },
    dust: { class: "fog-day", icon: "haze", condition: "Dust" },
    "dust night": { class: "fog-night", icon: "haze", condition: "Dust" },
    sand: { class: "fog-day", icon: "haze", condition: "Sand" },
    "sand night": { class: "fog-night", icon: "haze", condition: "Sand" },
    "dust whirls": {
      class: "fog-day",
      icon: "haze",
      condition: "Dust Whirls",
    },
    "dust whirls night": {
      class: "fog-night",
      icon: "haze",
      condition: "Dust Whirls",
    },
    "dust storm": {
      class: "fog-day",
      icon: "haze",
      condition: "Dust Storm",
    },
    "dust storm night": {
      class: "fog-night",
      icon: "haze",
      condition: "Dust Storm",
    },
    sandstorm: { class: "fog-day", icon: "haze", condition: "Sandstorm" },
    "sandstorm night": {
      class: "fog-night",
      icon: "haze",
      condition: "Sandstorm",
    },
    "volcanic ash": {
      class: "fog-day",
      icon: "haze",
      condition: "Volcanic Ash",
    },
    "volcanic ash night": {
      class: "fog-night",
      icon: "haze",
      condition: "Volcanic Ash",
    },

    // Thunderstorm
    thunderstorm: {
      class: "thunderstorm-day",
      icon: "thunderstorm",
      condition: "Thunderstorm",
    },
    "thunderstorm night": {
      class: "thunderstorm-night",
      icon: "thunderstorm",
      condition: "Thunderstorm",
    },
    "light thunderstorm": {
      class: "thunderstorm-day",
      icon: "thunderstorm",
      condition: "Light Thunderstorm",
    },
    "light thunderstorm night": {
      class: "thunderstorm-night",
      icon: "thunderstorm",
      condition: "Light Thunderstorm",
    },
    "dry thunderstorm": {
      class: "thunderstorm-day",
      icon: "thunderstorm",
      condition: "Dry Thunderstorm",
    },
    "dry thunderstorm night": {
      class: "thunderstorm-night",
      icon: "thunderstorm",
      condition: "Dry Thunderstorm",
    },
    "scattered thunderstorm": {
      class: "thunderstorm-day",
      icon: "thunderstorm",
      condition: "Scattered Thunderstorm",
    },
    "scattered thunderstorm night": {
      class: "thunderstorm-night",
      icon: "thunderstorm",
      condition: "Scattered Thunderstorm",
    },
    "ragged thunderstorm": {
      class: "thunderstorm-day",
      icon: "thunderstorm",
      condition: "Ragged Thunderstorm",
    },
    "ragged thunderstorm night": {
      class: "thunderstorm-night",
      icon: "thunderstorm",
      condition: "Ragged Thunderstorm",
    },
    "isolated thunderstorms": {
      class: "thunderstorm-day",
      icon: "thunderstorm",
      condition: "Isolated Thunderstorms",
    },
    "isolated thunderstorms night": {
      class: "thunderstorm-night",
      icon: "thunderstorm",
      condition: "Isolated Thunderstorms",
    },
    "lightning storm": {
      class: "thunderstorm-day",
      icon: "thunderstorm",
      condition: "Lightning Storm",
    },
    "lightning storm night": {
      class: "thunderstorm-night",
      icon: "thunderstorm",
      condition: "Lightning Storm",
    },
    "electrical storm": {
      class: "thunderstorm-day",
      icon: "thunderstorm",
      condition: "Electrical Storm",
    },
    "electrical storm night": {
      class: "thunderstorm-night",
      icon: "thunderstorm",
      condition: "Electrical Storm",
    },

    // Thunderstorm with Rain
    "thunderstorm with rain": {
      class: "thunderstorm-rain-day",
      icon: "thunderstorm-rain",
      condition: "Thunderstorm with Rain",
    },
    "thunderstorm with rain night": {
      class: "thunderstorm-rain-night",
      icon: "thunderstorm-rain",
      condition: "Thunderstorm with Rain",
    },
    "thunderstorm with heavy rain": {
      class: "thunderstorm-rain-day",
      icon: "thunderstorm-rain",
      condition: "Thunderstorm with Heavy Rain",
    },
    "thunderstorm with heavy rain night": {
      class: "thunderstorm-rain-night",
      icon: "thunderstorm-rain",
      condition: "Thunderstorm with Heavy Rain",
    },
    "thunderstorm with drizzle": {
      class: "thunderstorm-rain-day",
      icon: "thunderstorm-rain",
      condition: "Thunderstorm with Drizzle",
    },
    "thunderstorm with drizzle night": {
      class: "thunderstorm-rain-night",
      icon: "thunderstorm-rain",
      condition: "Thunderstorm with Drizzle",
    },
    rainstorm: {
      class: "thunderstorm-rain-day",
      icon: "thunderstorm-rain",
      condition: "Rainstorm",
    },
    "rainstorm night": {
      class: "thunderstorm-rain-night",
      icon: "thunderstorm-rain",
      condition: "Rainstorm",
    },

    // Severe Thunderstorm
    "heavy thunderstorm": {
      class: "severe-thunderstorm-day",
      icon: "severe-thunderstorm",
      condition: "Heavy Thunderstorm",
    },
    "heavy thunderstorm night": {
      class: "severe-thunderstorm-night",
      icon: "severe-thunderstorm",
      condition: "Heavy Thunderstorm",
    },
    "severe thunderstorm": {
      class: "severe-thunderstorm-day",
      icon: "severe-thunderstorm",
      condition: "Severe Thunderstorm",
    },
    "severe thunderstorm night": {
      class: "severe-thunderstorm-night",
      icon: "severe-thunderstorm",
      condition: "Severe Thunderstorm",
    },
  };

  if (testAnimations[city]) {
    const testData = testAnimations[city];
    const weatherBox = document.querySelector(".weather-box");

    if (weatherInterval) clearTimeout(weatherInterval);
    document.getElementById("current-time").innerText = "";
    if (timeInterval) clearInterval(timeInterval);
    messageBox.style.display = "none";

    const isAnimDisabled = weatherBox.classList.contains("disable-animations");
    const isAbout = weatherBox.classList.contains("about-mode");
    weatherBox.className = `weather-box${isAnimDisabled ? " disable-animations" : ""}${isAbout ? " about-mode" : ""}`;
    document.body.className = "";

    testData.class.split(" ").forEach((cls) => {
      weatherBox.classList.add(cls);
      document.body.classList.add(cls);
    });

    Object.values(lightningTimers).forEach(clearTimeout);
    lightningTimers = {};
    document
      .querySelectorAll(".lightning")
      .forEach((el) => el.classList.remove("striking"));
    document
      .querySelectorAll(".thunder-flash")
      .forEach((el) => el.classList.remove("flashing"));
    if (testData.class.includes("thunderstorm")) {
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

    if (document.getElementById("remember-toggle").checked) {
      localStorage.setItem("lastCity", city);
    }

    const iconUrl = `assets/icons/${testData.icon}.svg`;

    let tempUnit = currentUnits.temp === "Fahrenheit" ? "°F" : "°C";
    let displayTemp =
      currentUnits.temp === "Fahrenheit" ? Math.round((10 * 9) / 5 + 32) : 10;
    let displayFeelsLike =
      currentUnits.temp === "Fahrenheit" ? Math.round((8 * 9) / 5 + 32) : 8;

    let testWind = "5 km/h";
    if (currentUnits.wind === "mph") testWind = "3 mph";
    else if (currentUnits.wind === "m/s") testWind = "1 m/s";

    result.innerHTML = `
                <div class="weather-main-display">
                    <div class="weather-info">
                        <div class="city-main">Test City, <span class="info-icon-wrapper">TC<i class='bx bx-info-circle info-icon' tabindex="0"></i><div class="info-tooltip"><span style="font-size: 0.55rem;">Test City</span>,<br><span style="font-size: 0.35rem; opacity: 0.7;">Test Region,<br>TC</span></div></span></div>
                        <div class="time-main" id="city-time">12 Jan 12:00 pm</div>
                        <div class="condition-main">${testData.condition}</div>
                        <div class="temp-main">${displayTemp}<span class="temp-unit">${tempUnit}</span></div>
                        <div class="feels-like">Feels like ${displayFeelsLike}${tempUnit.toLowerCase()}</div>
                    </div>
                    <div class="weather-icon-container">
                        <img src="${iconUrl}" alt="${testData.condition}" class="weather-icon">
                    </div>
                </div>
                <div class="details-grid">
                    <div class="glass-tab"><span class="tab-label"><i class='bx bx-cloud-rain'></i> Precipitation</span><span class="tab-value">0 ${currentUnits.precip}</span></div>
                    <div class="glass-tab"><span class="tab-label"><i class='bx bx-wind'></i> Wind</span><span class="tab-value">${testWind}</span></div>
                    <div class="glass-tab"><span class="tab-label"><i class='bx bx-droplet'></i> Humidity</span><span class="tab-value">50%</span></div>
                    <div class="glass-tab"><span class="tab-label"><i class='bx bx-sun'></i> UV Index</span><span class="tab-value">3</span></div>
                </div>
                <div class="test-glass-box" onclick="this.classList.toggle('expanded')">
                    Testing purpose only for developers
                </div>
            `;
    setTimeout(adjustZoom, 100);
    return true;
  }
  // End of temporary code for testing animations

  return false;
}

// Strictly disable animations and timers when running in the background to prevent lag
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    document.body.classList.add("animations-paused");
    Object.values(lightningTimers).forEach(clearTimeout);
    document.querySelectorAll(".lightning").forEach(el => el.classList.remove("striking"));
    document.querySelectorAll(".thunder-flash").forEach(el => el.classList.remove("flashing"));
  } else {
    document.body.classList.remove("animations-paused");
    const weatherBox = document.querySelector(".weather-box");
    if (weatherBox && weatherBox.className.includes("thunderstorm")) {
      lightningTimers[".lightning-1"] = setTimeout(() => triggerLightning(".lightning-1"), Math.random() * 3000);
      lightningTimers[".lightning-2"] = setTimeout(() => triggerLightning(".lightning-2"), Math.random() * 4000 + 2000);
      lightningTimers[".lightning-3"] = setTimeout(() => triggerLightning(".lightning-3"), Math.random() * 5000 + 1000);
      lightningTimers[".lightning-4"] = setTimeout(() => triggerLightning(".lightning-4"), Math.random() * 6000 + 2000);
      lightningTimers[".thunder-flash-1"] = setTimeout(() => triggerThunderFlash(".thunder-flash-1"), Math.random() * 2000 + 1000);
      lightningTimers[".thunder-flash-2"] = setTimeout(() => triggerThunderFlash(".thunder-flash-2"), Math.random() * 3000 + 2000);
      lightningTimers[".thunder-flash-3"] = setTimeout(() => triggerThunderFlash(".thunder-flash-3"), Math.random() * 2500 + 1500);
    }
  }
});
