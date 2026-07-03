/* Generates context-aware weather alerts based on current conditions and forecasts. */
function generateSmartAlerts(context) {
  const {
    officialAlerts = [],
    temp = 0,
    windKmh = 0,
    uvData = null,
    wId = 800,
    currentHourIndex = 0,
    aqi = 0,
    precip = 0,
    visibility = 10,
    uvIndex = 0,
    feelsLike = 0,
    humidity = 0,
    currentTimeFormat = "12-hour",
    currentUnits = { temp: "Celsius", wind: "km/h" },
    pressureTrend = "steady",
    pressureHpa = 1013,
    grassStatus = null,
    treeStatus = null,
    weedStatus = null,
    displayFeelsLike = 0,
    dewPoint = 0,
    cloudCover = 0,
    visibilityVal = 10,
    isNight = false
  } = context;

          let smartAlerts = [];
          const addAlert = (msg) => {
            if (smartAlerts.length < 25 && !smartAlerts.includes(msg))
              smartAlerts.push(msg);
          };

          // Official Government Alerts (Highest Priority)
          if (officialAlerts.length > 0) {
            officialAlerts.forEach((alertText) => {
              addAlert(`🚨 OFFICIAL WARNING: ${alertText}`);
            });
          }

          // Comprehensive Predictive Forecasting (Next 12 Hours)
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
            maxWind: windKmh,
            maxWindHour: currentHourIndex,
            highPrecipProbHour: -1,
            maxPrecipProb: 0,
            maxRainRate: 0,
            rainDuration: 0,
            snowAccumulation: 0,
            iceRisk: false,
          };

          let currentCode =
            uvData && uvData.hourly && uvData.hourly.weather_code
              ? uvData.hourly.weather_code[currentHourIndex]
              : wId;
          let isCurrentlyRaining =
            (currentCode >= 51 && currentCode <= 67) ||
            (currentCode >= 80 && currentCode <= 82) ||
            (wId >= 500 && wId < 600);
          let isCurrentlySnowing =
            (currentCode >= 71 && currentCode <= 77) ||
            (currentCode >= 85 && currentCode <= 86) ||
            (wId >= 600 && wId < 700);
          let isCurrentlyStorming =
            (currentCode >= 95 && currentCode <= 99) ||
            (wId >= 200 && wId < 300);
          let isCurrentlyFoggy =
            currentCode === 45 || currentCode === 48 || wId === 741;
          let isCurrentlyClear =
            currentCode === 0 || currentCode === 1 || wId === 800;
          let isCurrentlyOvercast = currentCode === 3 || wId === 804;

          if (uvData && uvData.hourly && uvData.hourly.time) {
            for (
              let i = currentHourIndex + 1;
              i <= currentHourIndex + 12;
              i++
            ) {
              if (i >= uvData.hourly.time.length) break;
              let hCode = uvData.hourly.weather_code[i];
              let hTempOrig = uvData.hourly.temperature_2m[i];
              let hWindOrig = uvData.hourly.wind_speed_10m[i];
              let hHumidity = uvData.hourly.relative_humidity_2m[i];
              let hPop = uvData.hourly.precipitation_probability[i];

              if (hTempOrig > predictions.maxTemp) {
                predictions.maxTemp = hTempOrig;
                predictions.maxTempHour = i;
              }
              if (hTempOrig < predictions.minTemp) {
                predictions.minTemp = hTempOrig;
                predictions.minTempHour = i;
              }
              if (hWindOrig > predictions.maxWind) {
                predictions.maxWind = hWindOrig;
                predictions.maxWindHour = i;
              }

              let hIsRaining =
                (hCode >= 51 && hCode <= 67) ||
                (hCode >= 80 && hCode <= 82) ||
                hCode >= 95;
              let hIsSnowing =
                (hCode >= 71 && hCode <= 77) || (hCode >= 85 && hCode <= 86);
              let hIsStorming = hCode >= 95 && hCode <= 99;
              let hIsFoggy = hCode === 45 || hCode === 48;
              let hIsClear = hCode === 0 || hCode === 1;
              let hIsOvercast = hCode === 3;

              let hRain =
                uvData.hourly.rain && uvData.hourly.rain[i]
                  ? uvData.hourly.rain[i]
                  : 0;
              let hSnow =
                uvData.hourly.snowfall && uvData.hourly.snowfall[i]
                  ? uvData.hourly.snowfall[i]
                  : 0;
              if (hRain > predictions.maxRainRate)
                predictions.maxRainRate = hRain;
              if (hIsRaining || hRain > 0) predictions.rainDuration += 1;
              predictions.snowAccumulation += hSnow;
              if ((hIsRaining || hRain > 0) && hTempOrig <= 0)
                predictions.iceRisk = true;

              if (
                !isCurrentlyRaining &&
                hIsRaining &&
                predictions.rainStart === -1
              )
                predictions.rainStart = i;
              if (
                isCurrentlyRaining &&
                !hIsRaining &&
                predictions.rainStop === -1
              )
                predictions.rainStop = i;

              if (
                !isCurrentlySnowing &&
                hIsSnowing &&
                predictions.snowStart === -1
              )
                predictions.snowStart = i;
              if (
                isCurrentlySnowing &&
                !hIsSnowing &&
                predictions.snowStop === -1
              )
                predictions.snowStop = i;

              if (
                !isCurrentlyStorming &&
                hIsStorming &&
                predictions.stormStart === -1
              )
                predictions.stormStart = i;
              if (!isCurrentlyFoggy && hIsFoggy && predictions.fogStart === -1)
                predictions.fogStart = i;

              if (
                !isCurrentlyClear &&
                hIsClear &&
                predictions.clearSkiesStart === -1
              )
                predictions.clearSkiesStart = i;
              if (
                !isCurrentlyOvercast &&
                hIsOvercast &&
                predictions.overcastStart === -1
              )
                predictions.overcastStart = i;

              if (hHumidity > 85 && predictions.highHumidityStart === -1)
                predictions.highHumidityStart = i;
              if (hPop > predictions.maxPrecipProb) {
                predictions.maxPrecipProb = hPop;
                if (hPop >= 60 && predictions.highPrecipProbHour === -1)
                  predictions.highPrecipProbHour = i;
              }
            }
          }

          const formatHour = (index) => {
            if (index === -1) return "now";
            if (!uvData || !uvData.hourly || !uvData.hourly.time) return "now";
            const timeStr = uvData.hourly.time[index];
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
              ? Math.round(predictions.maxWind * 0.621371)
              : currentUnits.wind === "m/s"
                ? Math.round(predictions.maxWind / 3.6)
                : Math.round(predictions.maxWind);
          let dispMax =
            currentUnits.temp === "Fahrenheit"
              ? Math.round((predictions.maxTemp * 9) / 5 + 32)
              : Math.round(predictions.maxTemp);
          let dispMin =
            currentUnits.temp === "Fahrenheit"
              ? Math.round((predictions.minTemp * 9) / 5 + 32)
              : Math.round(predictions.minTemp);
          let unit = currentUnits.temp === "Fahrenheit" ? "°F" : "°C";
          let lightningProbability =
            predictions.stormStart !== -1 ? predictions.maxPrecipProb : 0;

          // ==============================
          // EXTREME WEATHER ALERTS
          // ==============================
          if (predictions.maxTemp >= 45)
            addAlert(
              `☠️ EXTREME HEAT EMERGENCY! Temperatures could reach ${dispMax}${unit}. Avoid outdoor activities unless absolutely necessary.`,
            );
          if (predictions.minTemp <= -20)
            addAlert(
              `🧊 EXTREME COLD WARNING! Temperatures as low as ${dispMin}${unit}. Limit outdoor exposure, dress in layers, and protect exposed skin.`,
            );
          if (predictions.maxWind >= 200)
            addAlert(
              `☠️ LIFE-THREATENING WINDS! Sustained winds up to (${dispWind} ${currentUnits.wind}). Stay indoors and away from windows.`,
            );
          if (predictions.maxWind >= 150)
            addAlert(
              `🌀 VIOLENT STORM CONDITIONS! Wind gusts up to ${dispWind} ${currentUnits.wind}. Stay indoors and avoid all unnecessary travel.`,
            );
          if (predictions.maxWind >= 118)
            addAlert(
              `🌀 HURRICANE FORCE WINDS! Wind gusts up to ${dispWind} ${currentUnits.wind} expected around ${formatHour(predictions.maxWindHour)}. Stay indoors and avoid unnecessary travel.`,
            );
          if (predictions.stormStart !== -1 && lightningProbability >= 90)
            addAlert(
              `⚡ INTENSE LIGHTNING ACTIVITY! Expected around ${formatHour(predictions.stormStart)}. Stay away from trees, open areas and metal objects.`,
            );
          if (predictions.maxRainRate >= 80)
            addAlert(`🌊 FLASH FLOOD RISK! Extremely heavy rainfall is expected.`);
          if (predictions.snowAccumulation >= 20)
            addAlert(
              `❄️ HEAVY SNOW EXPECTED! Significant snowfall is expected.`,
            );
          if (aqi > 300)
            addAlert(
              `☠️ HAZARDOUS AIR QUALITY! AQI ${aqi}. Health emergency conditions.`,
            );
          if (uvIndex >= 11)
            addAlert(
              `☠️ EXTREME UV INDEX! Avoid direct sun exposure during peak UV hours.`,
            );

          // ==============================
          // SEVERE WEATHER & COMBINATION ALERTS
          // ==============================
          if (predictions.stormStart !== -1 && predictions.maxWind >= 70)
            addAlert(
              `🌪️ Expect some wild winds! Thunderstorms may bring gusts up to ${dispWind} ${currentUnits.wind}.`,
            );
          if (predictions.stormStart !== -1 && predictions.maxWind >= 60)
            addAlert(
              `⛈️ Severe thunderstorms could arrive around ${formatHour(predictions.stormStart)}, bringing damaging wind gusts up to ${dispWind} ${currentUnits.wind}.`,
            );
          if (predictions.maxWind >= 89)
            addAlert(
              `⚠️ Strong storms are expected around  expected around ${formatHour(predictions.maxWindHour)}, bringing wind gusts up to ${dispWind} ${currentUnits.wind}.`,
            );
          if (predictions.maxWind >= 75)
            addAlert(
              `🌪️ Wind gusts could reach ${dispWind} ${currentUnits.wind} today. Be prepared for difficult travel and isolated damage.`,
            );
          if (predictions.maxWind >= 50 && predictions.rainStart !== -1)
            addAlert(
              `🌧️💨 A spell of windy rain is expected around ${formatHour(predictions.rainStart)}. Travel could be slower with poor visibility.`,
            );
          if (predictions.stormStart !== -1 && predictions.rainStart !== -1)
            addAlert(
              `⛈️ Thunderstorms with heavy rain are expected today. Be ready for wet roads and changing weather.`,
            );
          if (predictions.stormStart !== -1 && uvIndex >= 8)
            addAlert(
              `⚡ Hot weather and an unstable atmosphere could spark thunderstorms later today.`,
            );
          if (predictions.stormStart !== -1 && humidity > 80 && temp > 30)
            addAlert(
              `🌩️ Warm, humid air could fuel strong thunderstorms around ${formatHour(predictions.stormStart)}.`,
            );
          if (humidity > 85 && temp >= 30)
            addAlert(
              `🥵 It's going to feel hot and sticky today. Stay cool and keep hydrated.`,
            );
          if (pressureTrend === "falling_fast")
            addAlert(
              `📉 Air pressure is falling quickly, which could lead to stormy weather later today.`,
            );
          if (pressureHpa <= 990)
            addAlert(
              `🌪️ Very low air pressure could bring windy, wet, and unsettled weather today.`,
            );

          // ==============================
          // AIR QUALITY & HEALTH ALERTS
          // ==============================
          if (aqi > 200 && aqi <= 300)
            addAlert(
              `😷 Air quality is very unhealthy today (AQI ${aqi}). It's best to reduce outdoor activities whenever possible.`,
            );
          if (aqi > 150 && aqi <= 200)
            addAlert(`😷 The air quality is unhealthy today (AQI ${aqi}). Consider spending less time outdoors.`);
          if (aqi > 150 && predictions.maxWind < 10)
            addAlert(
              `😷 Light winds may prevent polluted air from clearing today.`,
            );
          if (aqi > 100 && aqi <= 150)
            addAlert(
              `⚠️ Air quality may be unhealthy for sensitive groups (AQI ${aqi}). Limit prolonged outdoor activity.`,
            );
          if (
            grassStatus.label === "High" ||
            grassStatus.label === "Very High" ||
            treeStatus.label === "High" ||
            treeStatus.label === "Very High" ||
            weedStatus.label === "High" ||
            weedStatus.label === "Very High"
          )
            addAlert(
              `🤧 High pollen levels are expected today. Allergy symptoms may be worse than usual.`,
            );
          if (humidity > 80 && temp > 28)
            addAlert(
              `💦 It's going to feel hot and sticky today. Stay hydrated if you're outdoors.`,
            );

          // ==============================
          // THUNDERSTORM & LIGHTNING ALERTS
          // ==============================
          if (predictions.stormStart !== -1) {
            addAlert(
              `⛈️ Thunderstorms are expected around ${formatHour(predictions.stormStart)}. Keep an eye on the weather if you're heading out.`,
            );
          }
          if (lightningProbability >= 90)
            addAlert(`⚡ Intense lightning is expected today. Avoid being outdoors whenever possible`);
          else if (lightningProbability >= 80)
            addAlert(`⚡ Frequent lightning is expected. Avoid open areas.`);
          else if (lightningProbability >= 70)
            addAlert(`⚡ There's a chance of lightning today. Keep an eye on the weather.`);
          if (lightningProbability >= 50 && predictions.rainStart === -1)
            addAlert(`⚡ Dry lightning is possible today.`);

          // ==============================
          // TEMPERATURE & HEAT/COLD ALERTS
          // ==============================
          if (predictions.maxTemp >= 40)
            addAlert(
              `🔥 Extreme heat is on the way! Temperatures could climb to ${dispMax}${unit} around ${formatHour(predictions.maxTempHour)}. Stay hydrated!`,
            );
          else if (predictions.maxTemp >= 35)
            addAlert(
              `🔥 It's going to be very hot today, with temperatures reaching ${dispMax}${unit} around ${formatHour(predictions.maxTempHour)}.`,
            );
          else if (predictions.maxTemp >= 30)
            addAlert(
              `🌡️ It will be a warm day, with highs around ${dispMax}${unit} by ${formatHour(predictions.maxTempHour)}.`,
            );

          if (predictions.minTemp <= -10)
            addAlert(
              `🥶 Bitterly cold conditions are expected, with temperatures dropping to ${dispMin}${unit} around ${formatHour(predictions.minTempHour)}. Stay warm and limit outdoor exposure!`,
            );
          else if (predictions.minTemp <= 0)
            addAlert(
              `🧊 Freezing temperatures are expected around ${formatHour(predictions.minTempHour)}, with lows near ${dispMin}${unit}.`,
            );
          else if (predictions.minTemp <= 5)
            addAlert(
              `❄️ It will be chilly today, with temperatures dropping to ${dispMin}${unit} around ${formatHour(predictions.minTempHour)}.`,
            );

          if (predictions.maxTemp - predictions.minTemp >= 20)
            addAlert(`🌡️ Expect a dramatic temperature change today, from ${dispMin}${unit} to ${dispMax}${unit}.`);
          else if (predictions.maxTemp - predictions.minTemp >= 15)
            addAlert(
              `🧥 A big temperature swing is expected today, from ${dispMin}${unit} to ${dispMax}${unit}.`,
            );
          else if (predictions.maxTemp - predictions.minTemp >= 10)
            addAlert(
              `🧥 Temperatures will vary noticeably today, ranging from ${dispMin}${unit} to ${dispMax}${unit}.`,
            );

          if (predictions.maxTemp - temp >= 12)
            addAlert(
              `📈 Expect a big warm-up today, with temperatures reaching ${dispMax}${unit} around ${formatHour(predictions.maxTempHour)}.`,
            );
          else if (predictions.maxTemp - temp >= 8)
            addAlert(
              `📈 Temperatures will continue to rise, reaching ${dispMax}${unit} around ${formatHour(predictions.maxTempHour)}.`,
            );

          if (temp - predictions.minTemp >= 12)
            addAlert(
              `📉 Expect a big cooldown tonight, with temperatures dropping to ${dispMin}${unit} around ${formatHour(predictions.minTempHour)}.`,
            );
          else if (temp - predictions.minTemp >= 8)
            addAlert(
              `📉 Temperatures will cool down tonight, reaching ${dispMin}${unit} around ${formatHour(predictions.minTempHour)}.`,
            );

          if (feelsLike >= 42)
            addAlert(
              `🔥 It could feel as hot as ${Math.round(displayFeelsLike)}${unit} today. Limit outdoors activities.`,
            );
          else if (feelsLike >= 38)
            addAlert(
              `🔥 It may feel like ${Math.round(displayFeelsLike)}${unit}. Outdoor activity could become uncomfortable.`,
            );

          if (feelsLike <= -5)
            addAlert(
              `🧊 It could feel as cold as ${Math.round(displayFeelsLike)}${unit} today. Dress warmly and limit time outdoors.`,
            );
          else if (feelsLike <= 0)
            addAlert(
              `🥶 It will feel below freezing today, with ${Math.round(displayFeelsLike)}${unit}. Bundle up before heading out.`,
            );

          if (Math.abs(feelsLike - temp) >= 5) {
            let direction = feelsLike > temp ? "warmer" : "colder";
            addAlert(
              `🌡️ It will feel much ${direction} than the actual temperature, around ${Math.round(displayFeelsLike)}${unit}.`,
            );
          } else if (Math.abs(feelsLike - temp) >= 3) {
            let direction = feelsLike > temp ? "warmer" : "colder";
            addAlert(
              `🌡️ It will feel ${direction} than the actual temperature, around ${Math.round(displayFeelsLike)}${unit}.`,
            );
          }

          if (temp >= 30 && predictions.minTemp >= 25)
            addAlert(
              `🥵 It will remain warm overnight with a low of ${dispMin}${unit}, may make sleeping uncomfortable.`,
            );
          if (temp <= 0 && predictions.maxWind >= 30)
            addAlert(`🥶 Strong winds will make the freezing temperatures feel even colder today.`);

          // ==============================
          // RAIN ALERTS
          // ==============================
          if (predictions.rainStart !== -1) {
            let timing =
              predictions.rainStart === currentHourIndex + 1
                ? "shortly"
                : `around ${formatHour(predictions.rainStart)}`;
            addAlert(`🌧️ Rain is expected to begin ${timing}.`);
          } else if (predictions.rainStop !== -1) {
            addAlert(
              `🌤️ Rain may clear up around ${formatHour(predictions.rainStop)}.`,
            );
          }

          if (predictions.maxRainRate >= 50)
            addAlert(
              `🌧️ Torrential rain is expected. Flash flooding is possible.`,
            );
          else if (predictions.maxRainRate >= 25)
            addAlert(`⛈️ Heavy rain with intense downpours is expected today.`);
          else if (predictions.maxRainRate >= 20)
            addAlert(`🌦️ Heavy rain is expected today.`);
          else if (predictions.maxRainRate >= 10)
            addAlert(`🌧️ Moderate rain is expected today.`);
          else if (predictions.maxRainRate >= 5)
            addAlert(`🌦️ Light to moderate rain is expected today.`);
          else if (predictions.rainStart !== -1 && predictions.maxRainRate < 5)
            addAlert(
              `🌦️ Light rain is expected around ${formatHour(predictions.rainStart)}.`,
            );

          if (predictions.rainDuration >= 6)
            addAlert(`🌧️ Rain is expected to continue for about ${predictions.rainDuration} hours.`);

          if (
            predictions.highPrecipProbHour !== -1 &&
            predictions.rainStart === -1 &&
            predictions.snowStart === -1
          ) {
            let probTemp =
              uvData.hourly.temperature_2m[predictions.highPrecipProbHour];
            let precipType = probTemp <= 0 ? "snow" : "rain";
            let precipIcon = probTemp <= 0 ? "❄️" : "☔";
            addAlert(
              `${precipIcon} There is a ${predictions.maxPrecipProb}% chance of ${precipType} around ${formatHour(predictions.highPrecipProbHour)}.`,
            );
          }

          if (predictions.rainStop !== -1 && predictions.clearSkiesStart !== -1)
            addAlert(
              `🌤️ Brighter weather is expected after the rain moves out around ${formatHour(predictions.rainStop)}.`,
            );
          if (predictions.rainStart !== -1 && visibilityVal < 3)
            addAlert(
              `🚗 Expect tricky driving conditions with rain and reduced visibility.`,
            );

          // ==============================
          // SNOW & ICE ALERTS
          // ==============================
          if (predictions.snowStart !== -1) {
            let timing =
              predictions.snowStart === currentHourIndex + 1
                ? "shortly"
                : `around ${formatHour(predictions.snowStart)}`;
            addAlert(`❄️ Snow fall is expected to begin ${timing}.`);
          } else if (predictions.snowStop !== -1) {
            addAlert(
              `🌤️ Snow fall may stop around ${formatHour(predictions.snowStop)}.`,
            );
          }

          if (predictions.snowAccumulation >= 15)
            addAlert(`❄️ Heavy snow is expected, with enough accumulation to affect travel.`);
          else if (predictions.snowAccumulation >= 5)
            addAlert(`☃️ Expect accumulating snow throughout the day.`);

          if (predictions.maxWind >= 50 && predictions.snowStart !== -1)
            addAlert(
              `🌨️ Blowing snow with ${dispWind} ${currentUnits.wind} winds may reduce visibility.`,
            );
          if (temp <= -5 && predictions.snowStart !== -1)
            addAlert(`🧊 Snow may quickly freeze on untreated surfaces.`);
          if (predictions.iceRisk === true)
            addAlert(
              `🧊 Icy patches may develop on roads and sidewalks.`,
            );

          // ==============================
          // WIND ALERTS
          // ==============================
          if (predictions.maxWind >= 62 && predictions.maxWind < 75)
            addAlert(
              `⚠️ Strong force winds could reach ${dispWind} ${currentUnits.wind} around ${formatHour(predictions.maxWindHour)}.`,
            );
          if (predictions.maxWind >= 55 && predictions.maxWind < 75)
            addAlert(
              `⚠️ Strong winds up to ${dispWind} ${currentUnits.wind} are expected today.`,
            );
          if (predictions.maxWind >= 45 && humidity < 25)
            addAlert(`🌵 Dry, windy conditions could create blowing dust and reduce visibility.`,
          );
          if (predictions.maxWind >= 35 && predictions.maxWind < 55)
            addAlert(
              `💨 Gusty winds up to ${dispWind} ${currentUnits.wind} are expected today.`,
            );
          if (predictions.maxWind >= 20 && predictions.maxWind < 35)
            addAlert(
              `🍃 Expect breezy conditions today, with winds reaching ${dispWind} ${currentUnits.wind}.`,
            );
          if (predictions.maxWind >= 15 && predictions.maxWind < 20)
            addAlert(
              `🍃 A light breeze is expected around ${formatHour(predictions.maxWindHour)}, with winds up to ${dispWind} ${currentUnits.wind}.`,
            );
          if (
            predictions.maxWind < 5 &&
            predictions.rainStart === -1 &&
            predictions.snowStart === -1
          )
            addAlert(`🍃 Enjoy a calm day with gentle winds and stable weather.`);

          // ==============================
          // FOG & VISIBILITY ALERTS
          // ==============================
          if (visibilityVal < 0.5)
            addAlert(`☠️ Visibility is near zero in dense fog. Avoid unnecessary travel.`);
          else if (visibilityVal < 1)
            addAlert(
              `☠️ Dense fog has reduced visibility to dangerous levels. Travel only if necessary.`,
            );
          else if (visibilityVal < 2)
            addAlert(`🚗 Fog is reducing visibility. Roads may be harder to see`);
          else if (visibilityVal < 5)
            addAlert(`🌫️ Expect occasional patches of fog, especially in low-lying areas.`);
          else if (visibilityVal < 10)
            addAlert(`🌫️ A slight haze is expected, especially in the distance.`);

          if (predictions.fogStart !== -1)
            addAlert(
              `🌫️ Fog is expected around ${formatHour(predictions.fogStart)}. Visibility could drop quickly.`,
            );

          // ==============================
          // DRIVING & TRAVEL ALERTS
          // ==============================
          if (visibilityVal < 1 && predictions.maxWind >= 30)
            addAlert(`🚧 Driving could be difficult due to poor visibility and strong winds.`,
          );
          if (visibilityVal < 2 && predictions.maxWind >= 30)
            addAlert(
              `🚗 Reduced visibility and ${dispWind} ${currentUnits.wind} winds may make driving more difficult.`,
            );
          if (predictions.rainStart !== -1 && predictions.maxWind >= 40)
            addAlert(
              `🚗 Wet and ${dispWind} ${currentUnits.wind} windy conditions may affect driving.`,
            );
          if (predictions.rainStart !== -1 && temp <= 2)
            addAlert(
              `🧊 Rain could freeze on contact around ${formatHour(predictions.rainStart)}, creating icy roads.`,
            );
          if (predictions.snowStart !== -1 && predictions.maxWind >= 40)
            addAlert(
              `🚙 Snow and ${dispWind} ${currentUnits.wind} winds may reduce visibility and affect travel conditions.`,
            );
          if (predictions.maxWind >= 70)
            addAlert(
              `🚧 Strong ${dispWind} ${currentUnits.wind} winds may affect the vehicles on exposed roads.`,
            );

          // ==============================
          // UV ALERTS
          // ==============================
          if (uvIndex >= 8 && uvIndex < 11)
            addAlert(
              `☢️ The sun is especially strong today about ${uvIndex} UV index. Limit time outdoors during peak hours.`,
            );
          if (uvIndex >= 6 && uvIndex < 8)
            addAlert(
              `🔆 The sun is quite strong today with ${uvIndex} UV index. Protect your skin if you're outdoors.`,
            );
          if (uvIndex >= 3 && uvIndex < 6)
            addAlert(
              `🕶️ UV levels are moderate today with ${uvIndex} UV index. Consider wearing sunglasses and sunscreen.`,
            );
          if (uvIndex >= 1 && uvIndex < 3 && !isNight)
            addAlert(
              `⛅ Low UV today, ${uvIndex} UV index. Outdoor conditions are generally comfortable.`,
            );

          // ==============================
          // HUMIDITY & DEW POINT ALERTS
          // ==============================
          if (
            humidity >= 90 &&
            predictions.rainStart === -1 &&
            predictions.snowStart === -1
          )
            addAlert(
              `💦 Humidity is very high today with ${humidity}%. It may feel hot, sticky, and uncomfortable outdoors.`,
            );
          if (
            humidity >= 75 &&
            humidity < 90 &&
            predictions.rainStart === -1 &&
            predictions.snowStart === -1
          )
            addAlert(`😓 High humid conditions today with ${humidity}%. It may feel warm and muggy outdoors.`);
          if (humidity <= 10)
            addAlert(`🌵 The air is extremely dry today with ${humidity}%.`);
          else if (humidity <= 20)
            addAlert(
              `🌵 The air is very dry today with ${humidity}%.`,
            );
          else if (humidity <= 30)
            addAlert(
              `🏜️ Humidity is on the low side today with ${humidity}%`,
            );

          if (
            predictions.highHumidityStart !== -1 &&
            predictions.rainStart === -1
          )
            addAlert(
              `💧 Humidity is expected to increase around ${formatHour(predictions.highHumidityStart)}.`,
            );

          if (dewPoint >= 26)
            addAlert(
              `🥵 The air will feel extremely humid and uncomfortable today.`,
            );
          else if (dewPoint >= 24)
            addAlert(`🥵 Expect very humid, tropical-like conditions today.`);
          else if (dewPoint >= 21)
            addAlert(
              `😓 Expect very humid, tropical-like conditions today.`,
            );
          if (dewPoint <= 0) addAlert(`❄️ The air will feel cool, dry, and crisp today.`);

          // ==============================
          // PRESSURE ALERTS
          // ==============================
          if (pressureHpa <= 1000 && pressureHpa > 990)
            addAlert(
              `📉 Low pressure (${Math.round(pressureHpa)} hPa) developed. Unsettled weather with clouds, wind, or rain is possible.`,
            );
          if (pressureHpa >= 1040)
            addAlert(`📈 Strong high pressure (${Math.round(pressureHpa)} hPa). Expect calm, dry, and generally stable weather.`);
          else if (pressureHpa >= 1025)
            addAlert(
              `📈 High pressure (${Math.round(pressureHpa)} hPa). Conditions are likely to stay calm and mostly clear.`,
            );

          // ==============================
          // SKY CONDITION & NIGHT ALERTS
          // ==============================
          if (cloudCover <= 10)
            addAlert(`☀️ Expect bright, sunny skies for most of the day.`);
          if (cloudCover >= 30 && cloudCover <= 60)
            addAlert(`⛅ A pleasant mix of sun and clouds is expected today.`);
          if (cloudCover >= 80 && cloudCover < 95)
            addAlert(`☁️ A pleasant mix of sun and clouds is expected today.`);
          if (cloudCover >= 95)
            addAlert(`🌑 Thick cloud cover will keep skies gray today.`);

          if (
            predictions.clearSkiesStart !== -1 &&
            predictions.rainStart === -1 &&
            predictions.snowStart === -1
          )
            addAlert(
              `☀️ The sky should clear up around ${formatHour(predictions.clearSkiesStart)}.`,
            );
          if (
            predictions.overcastStart !== -1 &&
            predictions.rainStart === -1 &&
            predictions.snowStart === -1
          )
            addAlert(
              `☁️ Cloud cover is expected to increase around ${formatHour(predictions.overcastStart)}.`,
            );

          if (predictions.clearSkiesStart !== -1 && !isNight)
            addAlert(`🌅 A colorful sunset may be possible this evening if skies continue to clear.`);
          if (predictions.clearSkiesStart !== -1 && isNight)
            addAlert(
              `✨ Clear skies are expected tonight from around ${formatHour(predictions.clearSkiesStart)}.`,
            );

          if (isNight && cloudCover < 20 && visibilityVal >= 10)
            addAlert(`🌌 A clear night ahead should offer great views of the stars.`);
          else if (isNight && cloudCover < 40 && visibilityVal >= 8)
            addAlert(`🌌 Conditions look favorable for watching the night sky.`);
          if (isNight && cloudCover > 80)
            addAlert(`☁️ Thick clouds may hide much of the night sky tonight.`);
          if (isNight && predictions.fogStart !== -1)
            addAlert(
              `🌫️ Fog may develop overnight around ${formatHour(predictions.fogStart)}.`,
            );
          if (!isNight && cloudCover > 90)
            addAlert(`☁️ Thick cloud cover will block much of the sunshine today.`);

          // ==============================
          // COMFORT & POSITIVE ALERTS
          // ==============================
          if (aqi <= 50 && aqi > 0)
            addAlert(
              `🌿 Air quality is excellent today (AQI ${aqi}). Enjoy the fresh air outdoors.`,
            );
          if (visibilityVal > 15 && cloudCover < 15)
            addAlert(
              `📸 Excellent visibility should provide stunning views today.`,
            );
          else if (
            visibilityVal > 9 &&
            predictions.rainStart === -1 &&
            predictions.snowStart === -1 &&
            predictions.fogStart === -1
          )
            addAlert(`👁️ Excellent visibility is expected across the area today.`);

          if (
            predictions.maxTemp >= 20 &&
            predictions.maxTemp <= 27 &&
            predictions.maxWind < 20 &&
            predictions.rainStart === -1 &&
            predictions.snowStart === -1 &&
            predictions.stormStart === -1
          )
            addAlert(
              `😊 Absolutely perfect weather today! Enjoy the outdoors.`,
            );
          if (
            temp >= 22 &&
            temp <= 28 &&
            humidity >= 40 &&
            humidity <= 60 &&
            predictions.maxWind < 20
          )
            addAlert(`👌 It looks like a beautiful day to enjoy the outdoors.`);
          if (temp >= 21 && temp <= 27 && humidity >= 40 && humidity <= 60)
            addAlert(`😊 Enjoy pleasant weather and comfortable temperatures today.`);
          if (temp >= 18 && temp <= 24 && cloudCover < 40)
            addAlert(`🌤️ Expect a bright and pleasant day.`);
          if (temp >= 25 && temp <= 32 && predictions.maxWind >= 20)
            addAlert(
              `🍃 Expect warm weather with a cooling breeze throughout the day.`,
            );
          if (
            uvIndex < 3 &&
            temp >= 20 &&
            temp <= 26 &&
            predictions.maxWind < 15
          )
            addAlert(`🌤️ The weather should be comfortable for most outdoor activities today.`);

          // ==============================
          // RANDOM ATMOSPHERE & SEASONAL ALERTS
          // ==============================
          if (cloudCover < 5 && humidity < 40)
            addAlert(`☀️ Expect crystal-clear skies with comfortably dry air.`);
          if (humidity > 85 && cloudCover > 90)
            addAlert(`☁️ Expect overcast skies and humid conditions for much of the day.`);
          if (predictions.maxTemp >= 35 && predictions.maxWind < 10)
            addAlert(`🥵 Hot weather and light winds may make it feel uncomfortable outdoors.`);
          if (predictions.maxTemp <= 10 && predictions.maxWind >= 40)
            addAlert(
              `🥶 Cold temperatures and strong winds will make it feel even colder.`,
            );
          if (
            predictions.maxPrecipProb === 0 &&
            predictions.rainStart === -1 &&
            predictions.snowStart === -1 &&
            predictions.stormStart === -1
          )
            addAlert(`🌂 No precipitation is expected over the next 12 hours.`);

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
      const icon = spaceIndex > -1 ? alertString.substring(0, spaceIndex) : "🔔";
      const text = spaceIndex > -1 ? alertString.substring(spaceIndex + 1) : alertString;

      textEl.style.transition = "opacity 0.3s ease";
      textEl.style.opacity = "0";
      iconEl.style.opacity = "0";
      textEl.style.transform = "translateX(0px)";

      setTimeout(() => {
        iconEl.innerText = icon;
        textEl.innerText = text;
        textEl.style.opacity = "1";
        iconEl.style.opacity = "1";

        // Wait 1 second before starting to roll
        setTimeout(() => {
          const textWidth = textEl.scrollWidth;
          const containerWidth = containerEl.clientWidth;

          if (textWidth > containerWidth) {
            const distance = textWidth - containerWidth;
            const speed = 90; // ms per pixel for a very slow roll
            const duration = distance * speed;

            textEl.style.transition = `transform ${duration}ms linear`;
            textEl.style.transform = `translateX(-${distance}px)`;

            window.alertTimer = setTimeout(() => {
              if (window.currentSmartAlerts.length > 1) nextAlert();
            }, duration + 3000); // Wait 3s after it reaches the end
          } else {
            // If it perfectly fits and doesn't need to roll, wait 4s total
            window.alertTimer = setTimeout(() => {
              if (window.currentSmartAlerts.length > 1) nextAlert();
            }, 4000);
          }
        }, 1000);
      }, 300);
    };

    const nextAlert = (e) => {
      if (e) e.stopPropagation();
      window.currentAlertIndex = (window.currentAlertIndex + 1) % window.currentSmartAlerts.length;
      updateAlertUI();
    };

    const nextBtn = document.getElementById("smart-alert-next");
    if (nextBtn) {
      nextBtn.style.display = "flex";
      // Prevent multiple listeners if called multiple times
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
  }
}

function getSmartAlertsHTML(smartAlerts) {
  if (!smartAlerts || smartAlerts.length === 0) return '';
  const toggle = document.getElementById('alerts-toggle');
  const displayStyle = toggle && !toggle.checked ? 'height: 18px; opacity: 1; margin-top: 5px; margin-bottom: -5px;' : 'margin-top: 0px; margin-bottom: 0px;';
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