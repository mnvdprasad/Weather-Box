window.API_KEYS = {
  openWeather: "",
  weatherApi: "",
};

window.getWeatherEndpoint = function (action, params) {
  const hasOwmKey =
    window.API_KEYS.openWeather &&
    window.API_KEYS.openWeather.length > 20 &&
    !window.API_KEYS.openWeather.includes("YOUR_");
  const hasWaKey =
    window.API_KEYS.weatherApi &&
    window.API_KEYS.weatherApi.length > 20 &&
    !window.API_KEYS.weatherApi.includes("YOUR_");

  const cb = `_cb=${Math.floor(Date.now() / 300000)}`;

  let url = "";

  if (action === "geo_direct") {
    url = hasOwmKey
      ? `https://api.openweathermap.org/geo/1.0/direct?q=${params.q}&limit=${params.limit || 5}&appid=${window.API_KEYS.openWeather}`
      : `/api/weather?action=geo_direct&q=${params.q}&limit=${params.limit || 5}`;
  } else if (action === "geo_zip") {
    url = hasOwmKey
      ? `https://api.openweathermap.org/geo/1.0/zip?zip=${params.zip}&appid=${window.API_KEYS.openWeather}`
      : `/api/weather?action=geo_zip&zip=${params.zip}`;
  } else if (action === "geo_reverse") {
    url = hasOwmKey
      ? `https://api.openweathermap.org/geo/1.0/reverse?lat=${params.lat}&lon=${params.lon}&limit=1&appid=${window.API_KEYS.openWeather}`
      : `/api/weather?action=geo_reverse&lat=${params.lat}&lon=${params.lon}`;
  } else if (action === "weather") {
    if (
      params.lat !== undefined &&
      params.lat !== null &&
      params.lon !== undefined &&
      params.lon !== null
    ) {
      url = hasOwmKey
        ? `https://api.openweathermap.org/data/2.5/weather?lat=${params.lat}&lon=${params.lon}&units=metric&appid=${window.API_KEYS.openWeather}`
        : `/api/weather?action=weather&lat=${params.lat}&lon=${params.lon}`;
    } else {
      url = hasOwmKey
        ? `https://api.openweathermap.org/data/2.5/weather?q=${params.q}&units=metric&appid=${window.API_KEYS.openWeather}`
        : `/api/weather?action=weather&q=${params.q}`;
    }
  } else if (action === "alerts") {
    url = hasWaKey
      ? `https://api.weatherapi.com/v1/forecast.json?key=${window.API_KEYS.weatherApi}&q=${params.lat},${params.lon}&alerts=yes`
      : `/api/weather?action=alerts&lat=${params.lat}&lon=${params.lon}`;
  }

  if (url) {
    url += (url.includes("?") ? "&" : "?") + cb;
  }
  return url;
};
