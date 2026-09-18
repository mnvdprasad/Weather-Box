function generateSmartAlerts(context) {
  const {
    officialAlerts = [],
    normalizedWeather,
    aqi = 0,
    currentHourIndex = 0,
    currentTimeFormat = "12-hour",
    currentUnits = { temp: "Celsius", wind: "km/h" },
    grassStatus = null,
    treeStatus = null,
    weedStatus = null,
    dewPoint = 0,
    uvData = null,
    pressureTrend = "steady",
  } = context;

  const { current = {}, hourly = [] } = normalizedWeather || {};
  const temp = current.tempC ?? 0;
  const windKmh = current.windKmh ?? 0;
  const wId = current.weatherCode ?? 800;
  const visibility = current.visibilityKm ?? 10;
  const precip = current.rainMm ?? 0;
  const feelsLike = current.feelsLikeC ?? 0;
  const displayFeelsLike =
    currentUnits.temp === "Fahrenheit" ? (feelsLike * 9) / 5 + 32 : feelsLike;
  const humidity = current.humidityPercent ?? 0;
  let uvIndex = current.uvIndex ?? 0;
  if (
    !uvIndex &&
    uvData &&
    uvData.hourly &&
    uvData.hourly.uv_index &&
    uvData.hourly.uv_index[currentHourIndex] !== undefined
  ) {
    uvIndex = Number(uvData.hourly.uv_index[currentHourIndex].toFixed(1));
  }
  const cloudCover = current.cloudCoverPercent ?? 0;
  const pressureHpa = current.pressureHpa ?? 1013;
  const visibilityVal = visibility;
  const isNight = current.isNight ?? false;

  let smartAlerts = [];
  const addAlert = (msg) => {
    if (smartAlerts.length < 25 && !smartAlerts.includes(msg))
      smartAlerts.push(msg);
  };

  if (officialAlerts.length > 0) {
    const esc =
      window.escapeHTML ||
      ((s) =>
        (s || "").replace(
          /[&<>'"]/g,
          (c) =>
            ({
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              "'": "&#39;",
              '"': "&quot;",
            })[c] || c,
        ));
    officialAlerts.forEach((alertObj) => {
      let eventText = typeof alertObj === "string" ? alertObj : alertObj.event;
      addAlert(
        `🚨 <span style="color: #ff4444; font-weight: bold;">WEATHER ALERT:</span> <span style="color: #ff5555; font-weight: bold;">${esc(eventText)}</span>`,
      );
    });
  }

  let predictions = {
    rainStart: -1,
    rainStop: -1,
    snowStart: -1,
    snowStop: -1,
    stormStart: -1,
    fogStart: -1,
    clearSkiesStart: -1,
    overcastStart: -1,
    highHumidityStart: -1,
    maxTemp: temp,
    maxTempHour: currentHourIndex,
    minTemp: temp,
    minTempHour: currentHourIndex,
    maxWindSpeed: windKmh,
    maxWindSpeedHour: currentHourIndex,
    maxWindGust: windKmh,
    maxWindGustHour: currentHourIndex,
    maxPrecipProb: 0,
    hasValidPrecipProb: false,
    highPrecipProbHour: -1,
    maxRainRate: 0,
    rainDuration: 0,
    snowAccumulationCm: 0,
    iceRisk: false,
    sleetRisk: false,
    maxStormCode: -1,
    maxCape: 0,
  };

  let isCurrentlyRaining = wId >= 300 && wId < 600;
  let isCurrentlySnowing = wId >= 600 && wId < 700;
  let isCurrentlyStorming = wId >= 200 && wId < 300;
  let isCurrentlyFoggy = wId === 741 || wId === 701;
  let isCurrentlyClear = wId === 800;
  let isCurrentlyOvercast = wId === 804 || wId === 803;

  let rainingState = isCurrentlyRaining;
  let snowingState = isCurrentlySnowing;
  let foggyState = isCurrentlyFoggy;
  let clearState = isCurrentlyClear;
  let overcastState = isCurrentlyOvercast;

  if (hourly.length > 0) {
    for (let i = currentHourIndex; i <= currentHourIndex + 12; i++) {
      if (i >= hourly.length) break;
      let hData = hourly[i];
      let hCode = hData.weatherCode;
      let hTempOrig = hData.tempC;
      let hWindOrig = hData.windKmh;
      let hGustOrig = hData.windGustKmh;
      let hHumidity = hData.humidityPercent;
      let hPop = hData.popPercent;

      if (hTempOrig > predictions.maxTemp) {
        predictions.maxTemp = hTempOrig;
        predictions.maxTempHour = i;
      }
      if (hTempOrig < predictions.minTemp) {
        predictions.minTemp = hTempOrig;
        predictions.minTempHour = i;
      }
      if (hWindOrig > predictions.maxWindSpeed) {
        predictions.maxWindSpeed = hWindOrig;
        predictions.maxWindSpeedHour = i;
      }
      if (hGustOrig > predictions.maxWindGust) {
        predictions.maxWindGust = hGustOrig;
        predictions.maxWindGustHour = i;
      }

      let hPrecip = hData.precipMm;
      let hRain = hData.rainMm;
      let hSnowCm = hData.snowfallCm;

      let isWmoSnow = window.isWmoSnow(hCode);
      let isWmoMixed = window.isWmoMixed(hCode);

      let hIsRaining =
        (hCode >= 51 && hCode <= 67) ||
        (hCode >= 80 && hCode <= 82) ||
        isWmoMixed ||
        hRain > 0;
      let hIsSnowing = isWmoSnow || isWmoMixed || hSnowCm > 0;
      let hIsStorming = hCode >= 95 && hCode <= 99;
      let hIsFoggy = hCode === 45 || hCode === 48;
      let hIsClear = hCode === 0 || hCode === 1;
      let hIsOvercast = hCode === 3;

      if (hIsRaining && !hIsSnowing && hPrecip > predictions.maxRainRate) {
        predictions.maxRainRate = hPrecip;
      }
      if (hIsRaining) predictions.rainDuration += 1;
      predictions.snowAccumulationCm += hSnowCm;
      let hIsFreezingPrecip = [56, 57, 66, 67].includes(hCode);
      let hIsSleet = [79].includes(hCode);
      if (hIsFreezingPrecip || (hRain > 0 && hTempOrig <= 0)) {
        predictions.iceRisk = true;
      }
      if (hIsSleet) {
        predictions.sleetRisk = true;
      }

      if (!rainingState && hIsRaining && predictions.rainStart === -1) {
        predictions.rainStart = i;
        rainingState = true;
      } else if (rainingState && !hIsRaining && predictions.rainStop === -1) {
        predictions.rainStop = i;
        rainingState = false;
      }

      if (!snowingState && hIsSnowing && predictions.snowStart === -1) {
        predictions.snowStart = i;
        snowingState = true;
      } else if (snowingState && !hIsSnowing && predictions.snowStop === -1) {
        predictions.snowStop = i;
        snowingState = false;
      }

      if (hIsStorming) {
        if (!isCurrentlyStorming && predictions.stormStart === -1) {
          predictions.stormStart = i;
        }
        if (hCode > predictions.maxStormCode) {
          predictions.maxStormCode = hCode;
        }
      }

      let hCape = hData.cape;
      if (hCape > predictions.maxCape) {
        predictions.maxCape = hCape;
      }

      if (!foggyState && hIsFoggy && predictions.fogStart === -1) {
        predictions.fogStart = i;
        foggyState = true;
      }

      if (!clearState && hIsClear && predictions.clearSkiesStart === -1) {
        predictions.clearSkiesStart = i;
        clearState = true;
      }

      if (!overcastState && hIsOvercast && predictions.overcastStart === -1) {
        predictions.overcastStart = i;
        overcastState = true;
      }

      if (hHumidity > 85 && predictions.highHumidityStart === -1)
        predictions.highHumidityStart = i;

      if (hPop !== "N/A" && hPop !== null && hPop !== undefined) {
        predictions.hasValidPrecipProb = true;
        if (hPop > predictions.maxPrecipProb) {
          predictions.maxPrecipProb = hPop;
          if (hPop >= 60 && predictions.highPrecipProbHour === -1)
            predictions.highPrecipProbHour = i;
        }
      }
    }
  }

  const formatHour = (index) => {
    if (index === -1) return "now";
    if (!hourly || !hourly[index]) return "now";
    const timeStr = hourly[index].timeIso;
    if (!timeStr) return "now";
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

  let dispWind =
    currentUnits.wind === "mph"
      ? Math.round(predictions.maxWindSpeed * 0.621371)
      : currentUnits.wind === "m/s"
        ? Math.round(predictions.maxWindSpeed / 3.6)
        : Math.round(predictions.maxWindSpeed);
  let dispGust =
    currentUnits.wind === "mph"
      ? Math.round(predictions.maxWindGust * 0.621371)
      : currentUnits.wind === "m/s"
        ? Math.round(predictions.maxWindGust / 3.6)
        : Math.round(predictions.maxWindGust);
  let dispMax =
    currentUnits.temp === "Fahrenheit"
      ? Math.round((predictions.maxTemp * 9) / 5 + 32)
      : Math.round(predictions.maxTemp);
  let dispMin =
    currentUnits.temp === "Fahrenheit"
      ? Math.round((predictions.minTemp * 9) / 5 + 32)
      : Math.round(predictions.minTemp);
  let unit = currentUnits.temp === "Fahrenheit" ? "°F" : "°C";

  let isSevere = false;
  let isInclement = false;

  if (officialAlerts && officialAlerts.length > 0) {
    officialAlerts.forEach((alert) => {
      let eText = typeof alert === "string" ? alert : alert.event;
      let sText = typeof alert === "string" ? "" : alert.severity || "";
      let uText = typeof alert === "string" ? "" : alert.urgency || "";
      let combined = (eText + " " + sText + " " + uText).toLowerCase();

      if (
        combined.includes("warning") ||
        combined.includes("severe") ||
        combined.includes("extreme") ||
        combined.includes("emergency") ||
        combined.includes("danger")
      ) {
        isSevere = true;
      } else {
        isInclement = true;
      }
    });
  }

  /* =============== RAIN =============== */
  if (predictions.maxRainRate >= 80) {
    isSevere = true;
    addAlert(
      `🌊 Extremely heavy rainfall is expected. Be alert for potential flash flooding.`,
    );
  } else if (predictions.maxRainRate >= 50) {
    isSevere = true;
    addAlert(
      `🌧️ Torrential rain is expected in this area, with potential for flash flooding.`,
    );
  } else if (predictions.maxRainRate >= 25) {
    isInclement = true;
    addAlert(
      `⛈️ Intense downpours and heavy rain are expected in this area today.`,
    );
  } else if (predictions.maxRainRate >= 20) {
    isInclement = true;
    addAlert(`🌦️ Significant rainfall is expected in this area today.`);
  } else if (predictions.maxRainRate >= 10) {
    isInclement = true;
    addAlert(`🌧️ Steady, moderate rain is expected throughout the day.`);
  } else if (isCurrentlyRaining) {
    if (predictions.rainStop !== -1) {
      addAlert(
        `🌧️ Rain is expected to stop around ${formatHour(predictions.rainStop)}.`,
      );
    } else {
      addAlert(`🌧️ Rain is expected to continue throughout the day.`);
    }
  } else if (predictions.rainStart !== -1) {
    let timing =
      predictions.rainStart <= currentHourIndex + 1
        ? "shortly"
        : `around ${formatHour(predictions.rainStart)}`;
    if (
      predictions.rainStop !== -1 &&
      predictions.rainStop > predictions.rainStart
    ) {
      addAlert(
        `🌧️ Rain is expected to start ${timing} and stop around ${formatHour(predictions.rainStop)}.`,
      );
    } else {
      addAlert(`🌧️ Rain is expected to start ${timing}.`);
    }
  } else if (
    predictions.highPrecipProbHour !== -1 &&
    predictions.snowStart === -1
  ) {
    let probTemp =
      uvData?.hourly?.temperature_2m?.[predictions.highPrecipProbHour];
    if (typeof probTemp !== "number") {
      probTemp = temp;
    }
    let precipType = probTemp <= 0 ? "snow" : "rain";
    let precipIcon = probTemp <= 0 ? "❄️" : "☔";
    addAlert(
      `${precipIcon} There is a ${predictions.maxPrecipProb}% chance of ${precipType} around ${formatHour(predictions.highPrecipProbHour)}.`,
    );
  }

  /* =============== SNOW & ICE =============== */
  if (predictions.snowAccumulationCm >= 20) {
    isSevere = true;
    addAlert(
      `❄️ Significant snow accumulation is expected, creating hazardous travel conditions.`,
    );
  } else if (predictions.snowAccumulationCm >= 15) {
    isSevere = true;
    addAlert(
      `❄️ Winter storm conditions are expected in this area. Accumulating snow will severely impact travel.`,
    );
  } else if (predictions.snowAccumulationCm >= 5) {
    isInclement = true;
    addAlert(
      `☃️ Accumulating snow is expected throughout the day. Watch for slick roads.`,
    );
  } else if (isCurrentlySnowing) {
    if (predictions.snowStop !== -1) {
      addAlert(
        `🌤️ Snow is expected to taper off around ${formatHour(predictions.snowStop)}.`,
      );
    } else {
      addAlert(`❄️ Snow is expected to continue falling today.`);
    }
  } else if (predictions.snowStart !== -1) {
    let timing =
      predictions.snowStart <= currentHourIndex + 1
        ? "shortly"
        : `around ${formatHour(predictions.snowStart)}`;
    if (
      predictions.snowStop !== -1 &&
      predictions.snowStop > predictions.snowStart
    ) {
      addAlert(
        `❄️ Snow is expected to start ${timing} and taper off around ${formatHour(predictions.snowStop)}.`,
      );
    } else {
      addAlert(`❄️ Snow is expected to start ${timing}.`);
    }
  } else if (predictions.iceRisk === true) {
    isInclement = true;
    addAlert(
      `🧊 Freezing rain and icy patches are expected on roads and sidewalks.`,
    );
  } else if (predictions.sleetRisk === true) {
    isInclement = true;
    addAlert(
      `🧊 Ice pellets (sleet) are expected. Watch for slippery conditions.`,
    );
  }

  /* =============== THUNDERSTORM & LIGHTNING =============== */
  if (predictions.stormStart !== -1 && predictions.maxStormCode >= 96) {
    isSevere = true;
    addAlert(
      `⚡ Severe thunderstorms are expected around ${formatHour(predictions.stormStart)}.`,
    );
  } else if (predictions.stormStart !== -1 && predictions.maxWindGust >= 70) {
    isSevere = true;
    addAlert(
      `🌪️ Severe thunderstorms are expected today with destructive gusts up to ${dispGust} ${currentUnits.wind}.`,
    );
  } else if (predictions.stormStart !== -1 && predictions.maxWindGust >= 60) {
    isSevere = true;
    addAlert(
      `⛈️ Severe thunderstorms are arriving around ${formatHour(predictions.stormStart)} with damaging gusts up to ${dispGust} ${currentUnits.wind}.`,
    );
  } else if (isCurrentlyStorming) {
    isInclement = true;
    addAlert(
      `⛈️ Thunderstorms are currently occurring and expected to continue.`,
    );
  } else if (predictions.stormStart !== -1 && predictions.rainStart !== -1) {
    isInclement = true;
    addAlert(
      `⛈️ Thunderstorms and heavy rain are expected around ${formatHour(predictions.stormStart)}.`,
    );
  } else if (predictions.stormStart !== -1) {
    isInclement = true;
    addAlert(
      `⛈️ Thunderstorms are expected around ${formatHour(predictions.stormStart)}.`,
    );
  } else if (predictions.stormStart === -1 && predictions.maxCape >= 2500) {
    isSevere = true;
    addAlert(
      `⚠️ Extreme atmospheric instability. Severe weather is possible if storms develop.`,
    );
  } else if (predictions.stormStart === -1 && predictions.maxCape >= 1500) {
    isInclement = true;
    addAlert(
      `⚠️ High atmospheric instability. The environment is highly favorable for thunderstorms.`,
    );
  }

  /* =============== TEMPERATURE =============== */
  if (predictions.maxTemp >= 45) {
    isSevere = true;
    addAlert(
      `☠️ Extreme heat is expected in this area. Temperatures will reach ${dispMax}${unit}. Avoid outdoor activities.`,
    );
  } else if (predictions.maxTemp >= 40) {
    isSevere = true;
    addAlert(
      `🔥 Severe heat is expected in this area. Temperatures will peak at ${dispMax}${unit} around ${formatHour(predictions.maxTempHour)}.`,
    );
  } else if (predictions.maxTemp >= 35) {
    isSevere = true;
    addAlert(
      `🔥 Dangerously hot conditions are expected. Highs of ${dispMax}${unit} are expected around ${formatHour(predictions.maxTempHour)}.`,
    );
  } else if (predictions.maxTemp >= 30) {
    isInclement = true;
    addAlert(
      `🌡️ Warm conditions are expected today, with highs reaching ${dispMax}${unit} around ${formatHour(predictions.maxTempHour)}.`,
    );
  } else if (predictions.minTemp <= -20) {
    isSevere = true;
    addAlert(
      `🧊 Extreme cold is expected in this area. Temperatures will drop to ${dispMin}${unit}. There is a severe risk of frostbite.`,
    );
  } else if (predictions.minTemp <= -10) {
    isSevere = true;
    addAlert(
      `🥶 Severe cold is expected in this area. Temperatures will drop to ${dispMin}${unit} around ${formatHour(predictions.minTempHour)}.`,
    );
  } else if (predictions.minTemp <= 0) {
    isInclement = true;
    addAlert(
      `🧊 Freezing conditions are expected in this area. Sub-zero temperatures of ${dispMin}${unit} are expected around ${formatHour(predictions.minTempHour)}.`,
    );
  } else if (predictions.minTemp <= 5) {
    isInclement = true;
    addAlert(
      `❄️ Frosty conditions are expected. Temperatures will dip to ${dispMin}${unit} around ${formatHour(predictions.minTempHour)}.`,
    );
  } else if (predictions.maxTemp - predictions.minTemp >= 20) {
    addAlert(
      `🌡️ Extreme temperature swings are expected today, ranging from ${dispMin}${unit} to ${dispMax}${unit}.`,
    );
  } else if (predictions.maxTemp - predictions.minTemp >= 15) {
    addAlert(
      `🧥 Significant temperature swings are expected today, ranging from ${dispMin}${unit} to ${dispMax}${unit}.`,
    );
  } else if (predictions.maxTemp - predictions.minTemp >= 10) {
    addAlert(
      `🧥 Moderate temperature swings are expected today, ranging between ${dispMin}${unit} and ${dispMax}${unit}.`,
    );
  } else if (predictions.maxTemp - temp >= 12) {
    addAlert(
      `📈 Rapid warming is expected today, with temperatures rising to ${dispMax}${unit} around ${formatHour(predictions.maxTempHour)}.`,
    );
  } else if (temp - predictions.minTemp >= 12) {
    addAlert(
      `📉 Rapid cooling is expected, with temperatures dropping to ${dispMin}${unit} around ${formatHour(predictions.minTempHour)}.`,
    );
  }

  /* =============== FEELS LIKE =============== */
  if (feelsLike >= 42) {
    addAlert(
      `🔥 Dangerously hot heat index is expected. It feels like ${Math.round(displayFeelsLike)}${unit}. Limit strenuous activities.`,
    );
  } else if (feelsLike >= 38) {
    addAlert(
      `🔥 Hot and muggy conditions are expected today, feeling like ${Math.round(displayFeelsLike)}${unit}.`,
    );
  } else if (feelsLike <= -20) {
    isSevere = true;
    addAlert(
      `🧊 Extreme wind chill is expected. It feels like ${Math.round(displayFeelsLike)}${unit} outside. Limit exposure.`,
    );
  } else if (feelsLike <= -10) {
    isInclement = true;
    addAlert(
      `🥶 Harsh wind chill is expected. It is freezing outside, feeling like ${Math.round(displayFeelsLike)}${unit}.`,
    );
  } else if (Math.abs(feelsLike - temp) >= 5) {
    let direction = feelsLike > temp ? "warmer" : "colder";
    addAlert(
      `🌡️ It feels significantly ${direction} than the actual temperature, around ${Math.round(displayFeelsLike)}${unit}.`,
    );
  }

  /* =============== WIND =============== */
  if (predictions.maxWindSpeed >= 200) {
    isSevere = true;
    addAlert(
      `☠️ Extreme winds are expected in this area. Sustained winds up to ${dispWind} ${currentUnits.wind} are expected. Seek shelter immediately.`,
    );
  } else if (predictions.maxWindGust >= 150) {
    isSevere = true;
    addAlert(
      `🌀 Violent storms are expected in this area. Gusts up to ${dispGust} ${currentUnits.wind} are expected. Avoid all travel.`,
    );
  } else if (predictions.maxWindGust >= 118) {
    isSevere = true;
    addAlert(
      `🌀 Extreme winds are expected in this area. Gusts up to ${dispGust} ${currentUnits.wind} are expected around ${formatHour(predictions.maxWindGustHour)}.`,
    );
  } else if (predictions.maxWindGust >= 89) {
    isSevere = true;
    addAlert(
      `⚠️ Severe storms are expected in this area. Gusts up to ${dispGust} ${currentUnits.wind} are expected around ${formatHour(predictions.maxWindGustHour)}.`,
    );
  } else if (predictions.maxWindGust >= 75) {
    isSevere = true;
    addAlert(
      `🌪️ High winds are expected in this area. Gusts reaching ${dispGust} ${currentUnits.wind} could cause damage.`,
    );
  } else if (predictions.maxWindSpeed >= 62) {
    isInclement = true;
    addAlert(
      `⚠️ Gale-force winds are expected. Sustained winds reaching ${dispWind} ${currentUnits.wind} are expected around ${formatHour(predictions.maxWindSpeedHour)}.`,
    );
  } else if (predictions.maxWindSpeed >= 55) {
    isInclement = true;
    addAlert(
      `⚠️ High winds are expected today, with sustained winds up to ${dispWind} ${currentUnits.wind}.`,
    );
  } else if (predictions.maxWindSpeed >= 45 && humidity < 25) {
    isSevere = true;
    addAlert(
      `🌵 Critical fire weather conditions are expected. Dry and windy conditions may produce blowing dust.`,
    );
  } else if (predictions.maxWindGust >= 35) {
    isInclement = true;
    addAlert(
      `💨 Strong wind gusts up to ${dispGust} ${currentUnits.wind} are expected today.`,
    );
  } else if (predictions.maxWindSpeed >= 20) {
    addAlert(
      `🍃 Breezy conditions are expected today, with winds reaching ${dispWind} ${currentUnits.wind}.`,
    );
  } else if (predictions.maxWindSpeed >= 15) {
    addAlert(
      `🍃 Light breezes are expected today, with winds up to ${dispWind} ${currentUnits.wind} around ${formatHour(predictions.maxWindSpeedHour)}.`,
    );
  } else if (
    predictions.maxWindSpeed < 5 &&
    predictions.rainStart === -1 &&
    predictions.snowStart === -1
  ) {
    addAlert(
      `🍃 Calm, stable weather is expected today with negligible winds.`,
    );
  }

  /* =============== AIR QUALITY =============== */
  if (aqi > 300) {
    isSevere = true;
    addAlert(
      `☠️ Hazardous air quality is expected in this area (AQI ${aqi}). Minimize all outdoor exposure.`,
    );
  } else if (aqi > 200) {
    isSevere = true;
    addAlert(
      `😷 Very unhealthy air quality is expected today (AQI ${aqi}). Strongly advise reducing outdoor activities.`,
    );
  } else if (aqi > 150) {
    isInclement = true;
    addAlert(
      `😷 Unhealthy air quality is expected today (AQI ${aqi}). Limit prolonged exertion outdoors.`,
    );
  } else if (aqi > 100) {
    isInclement = true;
    addAlert(
      `⚠️ Unhealthy air for sensitive groups is expected today (AQI ${aqi}). Vulnerable individuals should reduce outdoor activities.`,
    );
  } else if (aqi <= 50 && aqi > 0 && !isSevere && !isInclement) {
    addAlert(
      `🌿 Excellent air quality is expected today (AQI ${aqi}). It is a great day to get some fresh air.`,
    );
  }

  /* =============== POLLEN =============== */
  if (
    !isSevere &&
    ((grassStatus &&
      (grassStatus.label === "High" || grassStatus.label === "Very High")) ||
      (treeStatus &&
        (treeStatus.label === "High" || treeStatus.label === "Very High")) ||
      (weedStatus &&
        (weedStatus.label === "High" || weedStatus.label === "Very High")))
  ) {
    addAlert(
      `🤧 Elevated pollen levels are expected today. Sensitive individuals should exercise caution.`,
    );
  }

  /* =============== UV INDEX =============== */
  if (uvIndex >= 11) {
    isSevere = true;
    addAlert(
      `☠️ Extreme UV levels are expected today (Index ${uvIndex}). Avoid direct sun exposure during peak hours.`,
    );
  } else if (uvIndex >= 8) {
    isSevere = true;
    addAlert(
      `☢️ Very high UV levels are expected today (Index ${uvIndex}). Minimize sun exposure during peak hours.`,
    );
  } else if (uvIndex >= 6) {
    isInclement = true;
    addAlert(
      `🔆 High UV levels are expected today (Index ${uvIndex}). Sun protection is recommended for prolonged outdoor activities.`,
    );
  } else if (uvIndex >= 3) {
    addAlert(
      `🕶️ Moderate UV levels are expected today (Index ${uvIndex}). Sun protection is recommended.`,
    );
  } else if (
    uvIndex >= 1 &&
    uvIndex < 3 &&
    !isNight &&
    !isSevere &&
    !isInclement
  ) {
    addAlert(
      `⛅ Low UV levels are expected today (Index ${uvIndex}). Conditions are generally safe for outdoor activities.`,
    );
  }

  /* =============== FOG & VISIBILITY =============== */
  if (visibilityVal < 0.5) {
    isSevere = true;
    addAlert(
      `☠️ A dense fog emergency is in effect. Visibility is near zero. Suspend non-essential travel.`,
    );
  } else if (visibilityVal < 1) {
    isSevere = true;
    addAlert(
      `☠️ Dense fog is severely restricting visibility. Exercise extreme caution.`,
    );
  } else if (visibilityVal < 2) {
    isInclement = true;
    addAlert(
      `🚗 Fog is causing moderately restricted visibility. Ensure headlights are on.`,
    );
  } else if (visibilityVal < 5) {
    isInclement = true;
    addAlert(
      `🌫️ Patches of fog are expected today, particularly in low-lying areas.`,
    );
  } else if (isCurrentlyFoggy) {
    addAlert(`🌫️ Fog is expected to persist in the area.`);
  } else if (predictions.fogStart !== -1) {
    addAlert(
      `🌫️ Fog is expected to develop around ${formatHour(predictions.fogStart)}.`,
    );
  } else if (visibilityVal < 10) {
    addAlert(
      `🌫️ A slight haze is expected today, reducing visual range in the distance.`,
    );
  } else if (
    visibilityVal > 15 &&
    cloudCover < 15 &&
    !isSevere &&
    !isInclement
  ) {
    addAlert(
      `📸 Excellent visibility is expected today, offering perfectly clear views.`,
    );
  } else if (
    visibilityVal > 9 &&
    predictions.rainStart === -1 &&
    predictions.snowStart === -1 &&
    predictions.fogStart === -1 &&
    !isSevere &&
    !isInclement
  ) {
    addAlert(`👁️ Optimal visibility is expected today across the region.`);
  }

  /* =============== HUMIDITY =============== */
  if (humidity > 85 && temp >= 30) {
    addAlert(`🥵 Oppressive and hot humidity is expected. Stay hydrated.`);
  } else if (
    humidity >= 90 &&
    predictions.rainStart === -1 &&
    predictions.snowStart === -1
  ) {
    addAlert(
      `💦 Very high humidity is expected today at ${humidity}%. Uncomfortable conditions are expected outdoors.`,
    );
  } else if (
    humidity >= 75 &&
    humidity < 90 &&
    predictions.rainStart === -1 &&
    predictions.snowStart === -1
  ) {
    addAlert(
      `😓 Quite muggy conditions are expected today, with relative humidity around ${humidity}%.`,
    );
  } else if (humidity <= 10) {
    addAlert(
      `🌵 A critical fire weather outlook is in effect. Relative humidity is critically low at ${humidity}%.`,
    );
  } else if (humidity <= 20) {
    addAlert(
      `🌵 Very dry air is expected today, with relative humidity dipping to ${humidity}%.`,
    );
  } else if (
    predictions.highHumidityStart !== -1 &&
    predictions.rainStart === -1
  ) {
    addAlert(
      `💧 Humidity is expected to increase noticeably around ${formatHour(predictions.highHumidityStart)}.`,
    );
  }
  /* =============== PRESSURE TRENDS =============== */
  let delta3h = 0;
  let delta6h = 0;
  let delta12h = 0;
  let pressureCurrent = pressureHpa;

  if (uvData && uvData.hourly && uvData.hourly.surface_pressure) {
    if (uvData.hourly.surface_pressure[currentHourIndex]) {
      pressureCurrent = uvData.hourly.surface_pressure[currentHourIndex];
    }
    if (
      currentHourIndex >= 3 &&
      uvData.hourly.surface_pressure[currentHourIndex - 3]
    ) {
      delta3h =
        pressureCurrent - uvData.hourly.surface_pressure[currentHourIndex - 3];
    }
    if (
      currentHourIndex >= 6 &&
      uvData.hourly.surface_pressure[currentHourIndex - 6]
    ) {
      delta6h =
        pressureCurrent - uvData.hourly.surface_pressure[currentHourIndex - 6];
    }
    if (
      currentHourIndex >= 12 &&
      uvData.hourly.surface_pressure[currentHourIndex - 12]
    ) {
      delta12h =
        pressureCurrent - uvData.hourly.surface_pressure[currentHourIndex - 12];
    }
  }

  /* =============== PRESSURE ALERTS =============== */
  if (
    delta6h <= -4 &&
    predictions.stormStart !== -1 &&
    predictions.maxWindSpeed >= 40
  ) {
    isSevere = true;
    addAlert(
      `🌪️ Rapidly falling pressure coupled with increasing winds suggests an approaching severe weather system.`,
    );
  } else if (
    delta12h <= -5 &&
    cloudCover >= 70 &&
    predictions.rainStart !== -1
  ) {
    isInclement = true;
    addAlert(
      `📉 Steadily falling pressure indicates an approaching front bringing unsettled weather.`,
    );
  } else if (delta6h >= 4 && cloudCover <= 30) {
    addAlert(
      `📈 Rapidly rising pressure indicates the passage of a front, bringing clearing and stable conditions.`,
    );
  } else if (
    delta12h >= 6 &&
    predictions.maxWindSpeed < 20 &&
    cloudCover <= 20
  ) {
    addAlert(`☀️ Building high pressure will bring very stable, calm weather.`);
  } else if (pressureCurrent <= 990 && delta3h <= -2) {
    isSevere = true;
    addAlert(
      `🌪️ An extremely low pressure system (${Math.round(pressureCurrent)} hPa) is deepening. Unstable weather is imminent.`,
    );
  } else if (pressureCurrent >= 1040 && delta3h >= 1) {
    addAlert(
      `📈 Strong high pressure (${Math.round(pressureCurrent)} hPa) is building. Stable and dry weather is expected.`,
    );
  }

  /* =============== CLOUDS & SKY =============== */
  if (cloudCover <= 10 && !isNight && !isSevere && !isInclement) {
    addAlert(
      `☀️ Clear skies and plenty of sunshine are expected for most of the day.`,
    );
  } else if (cloudCover >= 95 && !isNight) {
    addAlert(
      `🌑 Completely overcast conditions are expected today, with very little direct sunlight.`,
    );
  } else if (
    predictions.clearSkiesStart !== -1 &&
    !isNight &&
    !isSevere &&
    !isInclement
  ) {
    addAlert(
      `☀️ Cloud cover is expected to dissipate around ${formatHour(predictions.clearSkiesStart)}.`,
    );
  } else if (
    predictions.overcastStart !== -1 &&
    predictions.rainStart === -1 &&
    predictions.snowStart === -1
  ) {
    addAlert(
      `☁️ Cloud cover is expected to increase around ${formatHour(predictions.overcastStart)}.`,
    );
  } else if (
    predictions.clearSkiesStart !== -1 &&
    isNight &&
    !isSevere &&
    !isInclement
  ) {
    addAlert(
      `✨ Skies are expected to clear tonight around ${formatHour(predictions.clearSkiesStart)}.`,
    );
  } else if (
    isNight &&
    cloudCover < 20 &&
    visibilityVal >= 10 &&
    !isSevere &&
    !isInclement
  ) {
    addAlert(
      `🌌 Incredibly clear conditions are expected tonight, perfect for stargazing.`,
    );
  } else if (isNight && cloudCover > 80) {
    addAlert(
      `☁️ Dense cloud cover is expected to obscure most of the night sky tonight.`,
    );
  }

  /* =============== COMFORT & POSITIVE ALERTS =============== */
  if (
    predictions.maxTemp >= 20 &&
    predictions.maxTemp <= 27 &&
    predictions.maxWindSpeed < 20 &&
    predictions.rainStart === -1 &&
    predictions.snowStart === -1 &&
    predictions.stormStart === -1 &&
    !isSevere &&
    !isInclement
  ) {
    addAlert(
      `😊 Favorable outdoor conditions are expected today, making it ideal for most outdoor plans.`,
    );
  } else if (
    temp >= 22 &&
    temp <= 28 &&
    humidity >= 40 &&
    humidity <= 60 &&
    predictions.maxWindSpeed < 20 &&
    !isSevere &&
    !isInclement
  ) {
    addAlert(
      `👌 Highly favorable weather is expected today, sitting right in the comfort zone.`,
    );
  } else if (
    predictions.hasValidPrecipProb &&
    predictions.maxPrecipProb === 0 &&
    predictions.rainStart === -1 &&
    predictions.snowStart === -1 &&
    predictions.stormStart === -1 &&
    !isSevere &&
    !isInclement
  ) {
    addAlert(`🌂 No precipitation is expected for the next 12 hours.`);
  }

  return smartAlerts;
}

function initSmartAlertsCycle(smartAlerts) {
  if (smartAlerts && smartAlerts.length > 0) {
    window.currentSmartAlerts = smartAlerts;
    window.currentAlertIndex = 0;

    if (window.alertInterval) clearInterval(window.alertInterval);
    if (window.alertTimer) clearTimeout(window.alertTimer);

    const updateAlertUI = () => {
      const alertEl = document.getElementById("smart-alerts-display");
      const iconEl = document.getElementById("smart-alert-icon");
      const textEl = document.getElementById("smart-alert-text");
      if (!alertEl || !iconEl || !textEl) return;
      const containerEl = textEl.parentElement;

      if (window.alertTimer) clearTimeout(window.alertTimer);
      const alertString = window.currentSmartAlerts[window.currentAlertIndex];
      const spaceIndex = alertString.indexOf(" ");
      const icon =
        spaceIndex > -1 ? alertString.substring(0, spaceIndex) : "🔔";
      const text =
        spaceIndex > -1 ? alertString.substring(spaceIndex + 1) : alertString;

      textEl.style.transition = "opacity 0.3s ease";
      textEl.style.opacity = "0";
      iconEl.style.opacity = "0";
      textEl.style.transform = "translateX(0px)";

      setTimeout(() => {
        iconEl.innerText = icon;
        textEl.innerHTML = text;
        textEl.style.opacity = "1";
        iconEl.style.opacity = "1";

        setTimeout(() => {
          const textWidth = textEl.scrollWidth;
          const containerWidth = containerEl.clientWidth;

          if (textWidth > containerWidth) {
            const distance = textWidth - containerWidth;
            const speed = 90;
            const duration = distance * speed;

            textEl.style.transition = `transform ${duration}ms linear`;
            textEl.style.transform = `translateX(-${distance}px)`;

            window.alertTimer = setTimeout(() => {
              if (window.currentSmartAlerts.length > 1) nextAlert();
            }, duration + 3000);
          } else {
            window.alertTimer = setTimeout(() => {
              if (window.currentSmartAlerts.length > 1) nextAlert();
            }, 4000);
          }
        }, 1000);
      }, 300);
    };

    const nextAlert = (e) => {
      if (e) e.stopPropagation();
      window.currentAlertIndex =
        (window.currentAlertIndex + 1) % window.currentSmartAlerts.length;
      updateAlertUI();
    };

    const nextBtn = document.getElementById("smart-alert-next");
    if (nextBtn) {
      nextBtn.style.display = "flex";
      const newNextBtn = nextBtn.cloneNode(true);
      nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
      newNextBtn.addEventListener("click", (e) => {
        if (e) e.stopPropagation();
        const pill = document.getElementById("smart-alerts-display");
        const icon = newNextBtn.querySelector("i");
        if (pill.style.width === "350px") {
          pill.style.width = "170px";
          if (icon) icon.className = "bx bx-chevron-right";
        } else {
          pill.style.width = "350px";
          if (icon) icon.className = "bx bx-chevron-left";
        }
        updateAlertUI();
      });
    }

    updateAlertUI();

    window.nextAlertFn = nextAlert;
    if (!window.smartAlertsVisibilityHooked) {
      window.smartAlertsVisibilityHooked = true;
      if (window.appVisibility) {
        window.appVisibility.onPause.push(() => {
          if (window.alertTimer) clearTimeout(window.alertTimer);
        });
        window.appVisibility.onResume.push(() => {
          if (
            window.currentSmartAlerts &&
            window.currentSmartAlerts.length > 1
          ) {
            if (window.nextAlertFn) window.nextAlertFn();
          }
        });
      }
    }
  }
}

function getSmartAlertsHTML(smartAlerts) {
  if (!smartAlerts || smartAlerts.length === 0) return "";
  const toggle = document.getElementById("alerts-toggle");
  const displayStyle =
    toggle && !toggle.checked
      ? "height: 18px; opacity: 1; margin-top: 5px; margin-bottom: -5px;"
      : "margin-top: 0px; margin-bottom: 0px;";
  return `<div id="smart-alert-wrapper" class="smart-alert-wrapper" style="${displayStyle}">
    <div id="smart-alerts-display" class="smart-alert-pill" style="display: flex;">
      <div id="smart-alert-icon" class="smart-alert-icon"></div>
      <div class="smart-alert-text-container">
        <div id="smart-alert-text" class="smart-alert-text"></div>
      </div>
      <div id="smart-alert-next" class="smart-alert-arrow"><i class='bx bx-chevron-right'></i></div>
    </div>
  </div>`;
}

window.generateSmartAlerts = generateSmartAlerts;
window.initSmartAlertsCycle = initSmartAlertsCycle;
window.getSmartAlertsHTML = getSmartAlertsHTML;
