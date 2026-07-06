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
    localStorage.removeItem("autoRefresh");
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
    localStorage.setItem("autoRefresh", currentRefreshInterval);
  }
}

function toggleAlerts() {
  const isChecked = document.getElementById("alerts-toggle").checked;
  
  if (document.getElementById("remember-toggle").checked) {
    localStorage.setItem("hideAlerts", isChecked);
  }
  
  const alertWrapper = document.getElementById("smart-alert-wrapper");
  if (alertWrapper) {
    const hasAlerts =
      document.getElementById("smart-alerts-display") !== null;
      
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
}

function setAutoRefreshSelect(value) {
  const minutes = parseInt(value);
  currentRefreshInterval = minutes;
  
  if (document.getElementById("remember-toggle").checked) {
    localStorage.setItem("autoRefresh", minutes);
  }

  if (weatherInterval) {
    clearTimeout(weatherInterval);
  }
  
  if (minutes > 0) {
    weatherInterval = setTimeout(() => {
      const isMainWeatherRendered = !!document.querySelector(".details-grid");
      if (isMainWeatherRendered) {
        getWeather(true);
      }
    }, currentRefreshInterval * 60000);
  }
}

function setTimeFormat(event, format) {
  const options =
    event.target.parentElement.querySelectorAll(".time-opt");
  options.forEach((opt) => opt.classList.remove("active"));
  
  event.target.classList.add("active");
  currentTimeFormat = format;

  if (document.getElementById("remember-toggle").checked) {
    localStorage.setItem("savedTimeFormat", currentTimeFormat);
  }

  const isResultVisible = !!document.querySelector(".details-grid");
  if (isResultVisible) {
    if (document.getElementById("city").value.trim() !== "") {
      getWeather(true);
    } else if (localStorage.getItem("lastLat") && localStorage.getItem("lastLon")) {
      getWeather(true, localStorage.getItem("lastLat"), localStorage.getItem("lastLon"));
    } else {
      fetchStartupCityWeather();
    }
  } else {
    fetchStartupCityWeather();
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
  
  const isResultVisible = !!document.querySelector(".details-grid");
  if (isResultVisible) {
    if (document.getElementById("city").value.trim() !== "") {
      getWeather(true);
    } else if (localStorage.getItem("lastLat") && localStorage.getItem("lastLon")) {
      getWeather(true, localStorage.getItem("lastLat"), localStorage.getItem("lastLon"));
    } else {
      fetchStartupCityWeather();
    }
  } else {
    fetchStartupCityWeather();
  }
}

function initSettings() {
  const weatherBox = document.querySelector(".weather-box");
  if (weatherBox) {
    weatherBox.insertAdjacentHTML('beforeend', settingsHTML);
  }

  const rememberToggle = document.getElementById("remember-toggle");
  if (localStorage.getItem("rememberCity") === "true") {
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
              unitOption.parentElement.querySelectorAll(
                ".settings-option",
              );
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
      currentStartupCity = lastCity;
    }
  }

  const alertsToggle = document.getElementById("alerts-toggle");
  if (localStorage.getItem("hideAlerts") === "true") {
    if (alertsToggle) alertsToggle.checked = true;
  }

  const animationsToggle = document.getElementById("animations-toggle");
  if (localStorage.getItem("disableAnimations") === "true") {
    if (animationsToggle) {
      animationsToggle.checked = true;
      toggleAnimations();
    }
  }

  let savedRefresh = localStorage.getItem("autoRefresh");
  if (savedRefresh === null) {
    savedRefresh = "0";
    if (localStorage.getItem("rememberCity") === "true") {
      localStorage.setItem("autoRefresh", savedRefresh);
    }
  }

  currentRefreshInterval = parseInt(savedRefresh);
  const refreshText = document.getElementById("refresh-selected-text");
  const refreshOptions = document.querySelectorAll(
    "#refresh-custom-select .refreshCustom-option",
  );

  if (refreshText && refreshOptions.length > 0) {
    refreshOptions.forEach((opt) => opt.classList.remove("active"));
    let activeOpt = document.querySelector(
      `#refresh-custom-select .refreshCustom-option[data-value="${savedRefresh}"]`,
    );
    if (!activeOpt) {
      activeOpt = document.querySelector(
        `#refresh-custom-select .refreshCustom-option[data-value="0"]`,
      );
    }
    if (activeOpt) {
      activeOpt.classList.add("active");
      refreshText.textContent = activeOpt.textContent;
    }
  }

  const refreshWrapper = document.getElementById("refresh-custom-select");
  if (refreshWrapper) {
    const refreshSelect = refreshWrapper.querySelector(".refresh-select");
    const refreshTextLocal = document.getElementById("refresh-selected-text");

    if (refreshSelect) {
      refreshSelect.addEventListener("click", function (e) {
        e.stopPropagation();
        refreshSelect.classList.toggle("open");
      });

      refreshSelect
        .querySelectorAll(".refreshCustom-option")
        .forEach((option) => {
          option.addEventListener("click", function (e) {
            e.stopPropagation();
            refreshSelect
              .querySelectorAll(".refreshCustom-option")
              .forEach((opt) => opt.classList.remove("active"));
            this.classList.add("active");
            if (refreshTextLocal) refreshTextLocal.textContent = this.textContent;
            refreshSelect.classList.remove("open");

            setAutoRefreshSelect(this.getAttribute("data-value"));
          });
        });
    }

    document.addEventListener("click", function (e) {
      if (!refreshWrapper.contains(e.target)) {
        if (refreshSelect) refreshSelect.classList.remove("open");
      }
    });
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
      setUnit(e, this.getAttribute("data-unit-type"), this.getAttribute("data-unit-value"));
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

  const weatherBoxObserver = document.querySelector(".weather-box");
  if (weatherBoxObserver) {
    new ResizeObserver(() => {
      const match = weatherBoxObserver.style.transform.match(/scale\(([^)]+)\)/);
      const scale = match ? parseFloat(match[1]) : 1;
      const visualDiff =
        weatherBoxObserver.offsetHeight * scale - weatherBoxObserver.offsetHeight;
      weatherBoxObserver.style.marginBottom = `${visualDiff}px`;
    }).observe(weatherBoxObserver);
  }

  window.addEventListener("resize", () => {
    if (typeof adjustZoom === "function") adjustZoom();
  });
  setTimeout(() => {
    if (typeof adjustZoom === "function") adjustZoom();
  }, 100);
}

document.addEventListener("DOMContentLoaded", initSettings);

const settingsHTML = `
      <!-- Radar icon -->
      <i class="bx bx-radar radar-icon" id="radar-btn" title="Radar Map"></i>
      <!-- Settings cog icon -->
      <i class="bx bx-cog settings-icon" id="settings-btn" title="Settings"></i>
      <!-- Settings pop-out menu -->
      <div id="settings-menu" class="settings-menu">
        <div class="settings-header">
          <span class="settings-title">Settings</span>
          <i class="bx bx-x close-settings" id="close-settings-btn"></i>
        </div>
        <div class="settings-content">
          <div class="settings-glass-box row-layout">
            <span><i class="ti ti-bookmarks"></i> Remember me</span>
            <label class="switch">
              <input type="checkbox" id="remember-toggle" />
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
          <!-- Dropdown to configure auto-refresh interval -->
          <div
            class="settings-glass-box row-layout refresh-box"
            id="refresh-box-container"
          >
            <span class="refresh-label"
              ><i class="ti ti-refresh"></i> Auto-Refresh</span
            >
            <div
              class="refreshCustom-select-wrapper"
              id="refresh-custom-select"
            >
              <div class="refresh-select">
                <div class="refreshCustom-select-trigger">
                  <span id="refresh-selected-text">None</span>
                  <i class="bx bx-chevron-down"></i>
                </div>
                <div class="refreshCustom-select-options">
                  <div class="refreshCustom-option active" data-value="0">
                    None
                  </div>
                  <div class="refreshCustom-option" data-value="5">5 min</div>
                  <div class="refreshCustom-option" data-value="10">10 min</div>
                  <div class="refreshCustom-option" data-value="15">15 min</div>
                  <div class="refreshCustom-option" data-value="30">30 min</div>
                  <div class="refreshCustom-option" data-value="60">60 min</div>
                </div>
              </div>
            </div>
          </div>
          <!-- Time format toggle (12/24 hour) -->
          <div class="settings-glass-box row-layout" id="time-format-box">
            <span><i class="ti ti-clock-24"></i> Time format</span>
            <div id="time-format-options" class="time-format-toggle">
              <div class="time-opt opt-24" data-format="24-hour">24H</div>
              <div class="time-opt opt-12 active" data-format="12-hour">
                AM/PM
              </div>
            </div>
          </div>
          <!-- Unit selection panel for temperature, precipitation, wind, visibility, pressure -->
          <div class="settings-glass-box" id="units-format-box">
            <div class="settings-glass-header" id="units-toggle-btn">
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