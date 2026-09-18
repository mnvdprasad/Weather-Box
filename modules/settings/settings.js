function toggleRemember() {
  const isChecked = document.getElementById("remember-toggle").checked;
  localStorage.setItem("rememberCity", isChecked);

  if (!isChecked) {
    localStorage.removeItem("lastCity");
    localStorage.removeItem("lastLat");
    localStorage.removeItem("lastLon");
    localStorage.removeItem("savedUnits");
    localStorage.removeItem("savedTimeFormat");
    localStorage.removeItem("hideAlerts");
    localStorage.removeItem("disableAnimations");
  } else {
    const cityInput = document.getElementById("city").value.trim();
    if (cityInput) localStorage.setItem("lastCity", cityInput);

    localStorage.setItem("savedUnits", JSON.stringify(currentUnits));
    localStorage.setItem("savedTimeFormat", currentTimeFormat);
    localStorage.setItem(
      "hideAlerts",
      document.getElementById("alerts-toggle").checked,
    );
    localStorage.setItem(
      "disableAnimations",
      document.getElementById("animations-toggle").checked,
    );
  }
}

function toggleAlerts() {
  const isChecked = document.getElementById("alerts-toggle").checked;

  if (document.getElementById("remember-toggle").checked) {
    localStorage.setItem("hideAlerts", isChecked);
  }

  const alertWrapper = document.getElementById("smart-alert-wrapper");
  if (alertWrapper) {
    const hasAlerts = document.getElementById("smart-alerts-display") !== null;

    if (!isChecked && hasAlerts) {
      alertWrapper.style.height = "18px";
      alertWrapper.style.opacity = "1";
      alertWrapper.style.marginTop = "5px";
      alertWrapper.style.marginBottom = "-5px";
    } else {
      alertWrapper.style.height = "0";
      alertWrapper.style.opacity = "0";
      alertWrapper.style.marginTop = "0px";
      alertWrapper.style.marginBottom = "0px";
    }
  }
}

function toggleAnimations() {
  const isChecked = document.getElementById("animations-toggle").checked;

  if (document.getElementById("remember-toggle").checked) {
    localStorage.setItem("disableAnimations", isChecked);
  }

  const weatherBox = document.querySelector(".weather-box");
  if (weatherBox) {
    if (isChecked) {
      weatherBox.classList.add("disable-animations");
    } else {
      weatherBox.classList.remove("disable-animations");
    }
  }

  window.preloadedHomeHTML = null;
  sessionStorage.removeItem("cachedWeatherHTML");
  sessionStorage.removeItem("cachedWeatherCity");

  const homeResult = document.getElementById("home-result");
  const isHomeVisible =
    homeResult &&
    (homeResult.style.display === "block" || homeResult.style.display === "");
  const isResultVisible =
    !isHomeVisible && !!document.querySelector(".details-grid");
  if (isResultVisible) {
    if (document.getElementById("city").value.trim() !== "") {
      getWeather(false, null, null, null, null, true);
    } else if (
      localStorage.getItem("lastLat") !== null &&
      localStorage.getItem("lastLon") !== null
    ) {
      getWeather(
        false,
        localStorage.getItem("lastLat"),
        localStorage.getItem("lastLon"),
        null,
        null,
        true,
      );
    } else {
      fetchStartupCityWeather(false, true);
    }
  } else {
    fetchStartupCityWeather(false, true);
  }
}

function setTimeFormat(event, format) {
  const options = event.target.parentElement.querySelectorAll(".time-opt");
  options.forEach((opt) => opt.classList.remove("active"));

  event.target.classList.add("active");
  currentTimeFormat = format;

  if (document.getElementById("remember-toggle").checked) {
    localStorage.setItem("savedTimeFormat", currentTimeFormat);
  }

  window.preloadedHomeHTML = null;
  sessionStorage.removeItem("cachedWeatherHTML");
  sessionStorage.removeItem("cachedWeatherCity");

  const homeResult = document.getElementById("home-result");
  const isHomeVisible =
    homeResult &&
    (homeResult.style.display === "block" || homeResult.style.display === "");
  const isResultVisible =
    !isHomeVisible && !!document.querySelector(".details-grid");
  if (isResultVisible) {
    if (document.getElementById("city").value.trim() !== "") {
      getWeather(false, null, null, null, null, true);
    } else if (
      localStorage.getItem("lastLat") !== null &&
      localStorage.getItem("lastLon") !== null
    ) {
      getWeather(
        false,
        localStorage.getItem("lastLat"),
        localStorage.getItem("lastLon"),
        null,
        null,
        true,
      );
    } else {
      fetchStartupCityWeather(false, true);
    }
  } else {
    fetchStartupCityWeather(false, true);
  }
}

function toggleUnits() {
  const options = document.getElementById("units-options");
  const header = document
    .getElementById("units-format-box")
    .querySelector(".settings-glass-header");

  options.classList.toggle("expanded");
  header.classList.toggle("expanded");
}

function setUnit(event, type, value) {
  const row = event.target.parentElement;
  const options = row.querySelectorAll(".settings-option");
  options.forEach((opt) => opt.classList.remove("active"));

  event.target.classList.add("active");
  currentUnits[type] = value;

  if (document.getElementById("remember-toggle").checked) {
    localStorage.setItem("savedUnits", JSON.stringify(currentUnits));
  }

  window.preloadedHomeHTML = null;
  sessionStorage.removeItem("cachedWeatherHTML");
  sessionStorage.removeItem("cachedWeatherCity");

  const homeResult = document.getElementById("home-result");
  const isHomeVisible =
    homeResult &&
    (homeResult.style.display === "block" || homeResult.style.display === "");
  const isResultVisible =
    !isHomeVisible && !!document.querySelector(".details-grid");
  if (isResultVisible) {
    if (document.getElementById("city").value.trim() !== "") {
      getWeather(false, null, null, null, null, true);
    } else if (
      localStorage.getItem("lastLat") !== null &&
      localStorage.getItem("lastLon") !== null
    ) {
      getWeather(
        false,
        localStorage.getItem("lastLat"),
        localStorage.getItem("lastLon"),
        null,
        null,
        true,
      );
    } else {
      fetchStartupCityWeather(false, true);
    }
  } else {
    fetchStartupCityWeather(false, true);
  }
}

function initSettings() {
  const weatherBox = document.querySelector(".weather-box");
  if (weatherBox) {
    weatherBox.insertAdjacentHTML("beforeend", settingsHTML);
  }

  const rememberToggle = document.getElementById("remember-toggle");
  if (localStorage.getItem("rememberCity") !== "false") {
    localStorage.setItem("rememberCity", "true");
    if (rememberToggle) rememberToggle.checked = true;

    const savedTimeFormat = localStorage.getItem("savedTimeFormat");
    if (savedTimeFormat) {
      currentTimeFormat = savedTimeFormat;
      document
        .querySelectorAll(".time-opt")
        .forEach((opt) => opt.classList.remove("active"));
      if (savedTimeFormat === "24-hour") {
        const opt24 = document.querySelector(".time-opt.opt-24");
        if (opt24) opt24.classList.add("active");
      } else {
        const opt12 = document.querySelector(".time-opt.opt-12");
        if (opt12) opt12.classList.add("active");
      }
    }

    const savedUnits = localStorage.getItem("savedUnits");
    if (savedUnits) {
      try {
        const parsedUnits = JSON.parse(savedUnits);
        currentUnits = { ...currentUnits, ...parsedUnits };
        for (const [type, value] of Object.entries(currentUnits)) {
          const unitOption = document.querySelector(
            `.unit-group .settings-option[data-unit-type="${type}"][data-unit-value="${value}"]`,
          );
          if (unitOption) {
            const siblings =
              unitOption.parentElement.querySelectorAll(".settings-option");
            siblings.forEach((opt) => opt.classList.remove("active"));
            unitOption.classList.add("active");
          }
        }
      } catch (e) {}
    }

    const lastCity = localStorage.getItem("lastCity");
    if (lastCity) {
      const cityInput = document.getElementById("city");
      if (cityInput) cityInput.value = lastCity;
      window.currentStartupCity = lastCity;
    }
  } else {
    if (rememberToggle) rememberToggle.checked = false;
  }

  const alertsToggle = document.getElementById("alerts-toggle");
  if (localStorage.getItem("hideAlerts") === "true") {
    if (alertsToggle) alertsToggle.checked = true;
  }

  const animationsToggle = document.getElementById("animations-toggle");
  if (localStorage.getItem("disableAnimations") === "true") {
    if (animationsToggle) {
      animationsToggle.checked = true;
      const weatherBox = document.querySelector(".weather-box");
      if (weatherBox) weatherBox.classList.add("disable-animations");
    }
  }

  const rememberToggleEl = document.getElementById("remember-toggle");
  if (rememberToggleEl) {
    rememberToggleEl.addEventListener("change", toggleRemember);
  }

  const alertsToggleEl = document.getElementById("alerts-toggle");
  if (alertsToggleEl) {
    alertsToggleEl.addEventListener("change", toggleAlerts);
  }

  const animationsToggleEl = document.getElementById("animations-toggle");
  if (animationsToggleEl) {
    animationsToggleEl.addEventListener("change", toggleAnimations);
  }

  const timeOpts = document.querySelectorAll(".time-opt");
  timeOpts.forEach((opt) => {
    opt.addEventListener("click", function (e) {
      setTimeFormat(e, this.getAttribute("data-format"));
    });
  });

  const unitsToggleBtn = document.getElementById("units-toggle-btn");
  if (unitsToggleBtn) {
    unitsToggleBtn.addEventListener("click", toggleUnits);
  }

  const unitOptionsList = document.querySelectorAll(".settings-option");
  unitOptionsList.forEach((opt) => {
    opt.addEventListener("click", function (e) {
      setUnit(
        e,
        this.getAttribute("data-unit-type"),
        this.getAttribute("data-unit-value"),
      );
    });
  });

  const settingsBtn = document.getElementById("settings-btn");
  const settingsMenu = document.getElementById("settings-menu");
  const closeSettingsBtn = document.getElementById("close-settings-btn");

  if (settingsBtn) {
    settingsBtn.addEventListener("click", function () {
      if (settingsMenu) settingsMenu.classList.toggle("open");
    });
  }

  if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener("click", function () {
      if (settingsMenu) settingsMenu.classList.remove("open");
    });
  }

  const radarBtn = document.getElementById("radar-btn");
  if (radarBtn) {
    radarBtn.addEventListener("click", function () {
      if (typeof window.toggleRadarView === "function") {
        window.toggleRadarView();
      }
    });
  }

  document.addEventListener("click", function (e) {
    if (
      settingsMenu &&
      settingsMenu.classList.contains("open") &&
      !settingsMenu.contains(e.target) &&
      (!settingsBtn || !settingsBtn.contains(e.target))
    ) {
      settingsMenu.classList.remove("open");
    }
  });
}

document.addEventListener("DOMContentLoaded", initSettings);

const settingsHTML = `
      <i class="bx bx-radar radar-icon" id="radar-btn" title="Radar Map"></i>
      <i class="bx bx-cog settings-icon" id="settings-btn" title="Settings"></i>
      <div id="settings-menu" class="settings-menu">
        <div class="settings-header">
          <span class="settings-title">Settings</span>
          <i class="bx bx-x close-settings" id="close-settings-btn"></i>
        </div>
        <div class="settings-content">
          <div class="settings-glass-box row-layout">
            <span><i class="ti ti-bookmarks"></i> Remember Settings</span>
            <label class="switch">
              <input type="checkbox" id="remember-toggle" checked />
              <span class="slider"></span>
            </label>
          </div>
          <div class="settings-glass-box row-layout">
            <span><i class="ti ti-bell-off"></i> Hide alerts</span>
            <label class="switch">
              <input type="checkbox" id="alerts-toggle" />
              <span class="slider"></span>
            </label>
          </div>
          <div class="settings-glass-box row-layout">
            <span><i class="bx bx-pause-circle"></i> Disable animations</span>
            <label class="switch">
              <input type="checkbox" id="animations-toggle" />
              <span class="slider"></span>
            </label>
          </div>
          <div class="settings-glass-box row-layout" id="time-format-box">
            <span><i class="ti ti-clock-24"></i> Time format</span>
            <div id="time-format-options" class="time-format-toggle">
              <div class="time-opt opt-24" data-format="24-hour">24H</div>
              <div class="time-opt opt-12 active" data-format="12-hour">
                AM/PM
              </div>
            </div>
          </div>
          <div class="settings-glass-box" id="units-format-box">
            <div class="settings-glass-header" style="font-weight: bold;" id="units-toggle-btn">
              <span><i class="ti ti-adjustments-horizontal"></i> Units</span>
              <i class="bx bx-chevron-down" style="transition: transform 0.3s ease;"></i>
            </div>
            <div class="settings-glass-options col-layout" id="units-options">
              <div class="unit-group">
                <div class="unit-label">
                  <i class="bx bxs-thermometer"></i> Temperature
                </div>
                <div class="unit-row">
                  <div
                    class="settings-option active"
                    data-unit-type="temp"
                    data-unit-value="Celsius"
                  >
                    °C
                  </div>
                  <div
                    class="settings-option"
                    data-unit-type="temp"
                    data-unit-value="Fahrenheit"
                  >
                    °F
                  </div>
                </div>
              </div>
              <div class="unit-group">
                <div class="unit-label">
                  <i class="bx bx-cloud-rain"></i> Precipitation
                </div>
                <div class="unit-row">
                  <div
                    class="settings-option active"
                    data-unit-type="precip"
                    data-unit-value="mm"
                  >
                    mm
                  </div>
                  <div
                    class="settings-option"
                    data-unit-type="precip"
                    data-unit-value="cm"
                  >
                    cm
                  </div>
                  <div
                    class="settings-option"
                    data-unit-type="precip"
                    data-unit-value="in"
                  >
                    in
                  </div>
                </div>
              </div>
              <div class="unit-group">
                <div class="unit-label"><i class="bx bx-wind"></i> Wind</div>
                <div class="unit-row">
                  <div
                    class="settings-option active"
                    data-unit-type="wind"
                    data-unit-value="km/h"
                  >
                    km/h
                  </div>
                  <div
                    class="settings-option"
                    data-unit-type="wind"
                    data-unit-value="mph"
                  >
                    mph
                  </div>
                  <div
                    class="settings-option"
                    data-unit-type="wind"
                    data-unit-value="m/s"
                  >
                    m/s
                  </div>
                </div>
              </div>
              <div class="unit-group">
                <div class="unit-label">
                  <i class="bx bx-show"></i> Visibility
                </div>
                <div class="unit-row">
                  <div
                    class="settings-option active"
                    data-unit-type="vis"
                    data-unit-value="km"
                  >
                    km
                  </div>
                  <div
                    class="settings-option"
                    data-unit-type="vis"
                    data-unit-value="mi"
                  >
                    mi
                  </div>
                </div>
              </div>
              <div class="unit-group">
                <div class="unit-label">
                  <i class="ti ti-fold"></i> Pressure
                </div>
                <div class="unit-row">
                  <div
                    class="settings-option active"
                    data-unit-type="press"
                    data-unit-value="mb"
                  >
                    mb
                  </div>
                  <div
                    class="settings-option"
                    data-unit-type="press"
                    data-unit-value="hPa"
                  >
                    hPa
                  </div>
                  <div
                    class="settings-option"
                    data-unit-type="press"
                    data-unit-value="atm"
                  >
                    atm
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
`;
