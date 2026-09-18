const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 50;

function checkRateLimit(ip) {
  const now = Date.now();
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  const record = rateLimitMap.get(ip);
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_LIMIT_WINDOW_MS;
    return true;
  }
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  record.count++;
  return true;
}

function isValidCoordinate(val, min, max) {
  if (val === undefined || val === null || val === "") return false;
  const num = Number(val);
  return !isNaN(num) && num >= min && num <= max;
}

function isValidString(val, maxLength) {
  if (val === undefined || val === null || typeof val !== "string")
    return false;
  const trimmed = val.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip =
    req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
  if (!checkRateLimit(ip)) {
    return res
      .status(429)
      .json({ error: "Too many requests, please try again later." });
  }

  const { action, q, zip, lat, lon } = req.query;

  const openWeatherApiKey =
    req.query.openweather_key || process.env.OPENWEATHER_API_KEY;
  const weatherApiKey = req.query.weatherapi_key || process.env.WEATHERAPI_KEY;

  if (!isValidString(action, 20)) {
    return res
      .status(400)
      .json({ error: "Action parameter is required and must be valid" });
  }

  let url = "";

  if (action === "geo_zip") {
    if (!isValidString(zip, 20)) {
      return res
        .status(400)
        .json({ error: "Valid zip parameter required (max 20 chars)" });
    }
    url = `https://api.openweathermap.org/geo/1.0/zip?zip=${encodeURIComponent(zip.trim())}&appid=${openWeatherApiKey}`;
  } else if (action === "geo_direct") {
    let limit = Math.min(5, Math.max(1, Number(req.query.limit) || 1));
    if (!isValidString(q, 100)) {
      return res
        .status(400)
        .json({ error: "Valid query (q) parameter required (max 100 chars)" });
    }
    url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q.trim())}&limit=${limit}&appid=${openWeatherApiKey}`;
  } else if (action === "geo_reverse") {
    if (
      !isValidCoordinate(lat, -90, 90) ||
      !isValidCoordinate(lon, -180, 180)
    ) {
      return res
        .status(400)
        .json({
          error:
            "Valid lat (-90 to 90) and lon (-180 to 180) parameters required",
        });
    }
    url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${Number(lat)}&lon=${Number(lon)}&limit=1&appid=${openWeatherApiKey}`;
  } else if (action === "weather") {
    const cityParam = q || req.query.city;
    if (lat !== undefined && lon !== undefined) {
      if (
        !isValidCoordinate(lat, -90, 90) ||
        !isValidCoordinate(lon, -180, 180)
      ) {
        return res
          .status(400)
          .json({ error: "Valid lat and lon parameters required" });
      }
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${Number(lat)}&lon=${Number(lon)}&units=metric&appid=${openWeatherApiKey}`;
    } else if (isValidString(cityParam, 100)) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityParam.trim())}&units=metric&appid=${openWeatherApiKey}`;
    } else {
      return res
        .status(400)
        .json({ error: "Valid lat/lon or q/city parameters required" });
    }
  } else if (action === "alerts") {
    if (
      !isValidCoordinate(lat, -90, 90) ||
      !isValidCoordinate(lon, -180, 180)
    ) {
      return res
        .status(400)
        .json({ error: "Valid lat and lon parameters required" });
    }
    url = `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${Number(lat)},${Number(lon)}&alerts=yes`;
  } else {
    return res.status(400).json({ error: "Invalid action parameter" });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=59",
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Weather fetch failed" });
  } finally {
    clearTimeout(timeout);
  }
}
