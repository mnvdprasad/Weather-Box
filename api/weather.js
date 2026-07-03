export default async function handler(req, res) {
  const { action, q, zip, lat, lon } = req.query;

  // Retrieve API keys from environment variables
  const openWeatherApiKey = process.env.OPENWEATHER_API_KEY;
  const weatherApiKey = process.env.WEATHERAPI_KEY;

  if (!action) {
    return res.status(400).json({ error: "Action parameter is required" });
  }

  let url = "";

  // Route the request based on the action parameter
  if (action === "geo_zip") {
    if (!zip) return res.status(400).json({ error: "Zip parameter required" });
    url = `https://api.openweathermap.org/geo/1.0/zip?zip=${encodeURIComponent(zip)}&appid=${openWeatherApiKey}`;
  } else if (action === "geo_direct") {
    const limit = req.query.limit || 1;
    if (!q) return res.status(400).json({ error: "Query (q) parameter required" });
    url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=${limit}&appid=${openWeatherApiKey}`;
  } else if (action === "geo_reverse") {
    if (!lat || !lon) return res.status(400).json({ error: "Lat and lon parameters required" });
    url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${openWeatherApiKey}`;
  } else if (action === "weather") {
    const cityParam = q || req.query.city;
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${openWeatherApiKey}`;
    } else if (cityParam) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityParam)}&units=metric&appid=${openWeatherApiKey}`;
    } else {
      return res.status(400).json({ error: "Lat/lon or q/city parameters required" });
    }
  } else if (action === "alerts") {
    if (!lat || !lon) return res.status(400).json({ error: "Lat and lon parameters required" });
    url = `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${lat},${lon}&alerts=yes`;
  } else {
    return res.status(400).json({ error: "Invalid action parameter" });
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Weather fetch failed" });
  }
}
