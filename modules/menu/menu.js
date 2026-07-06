function toggleAbout() {
  const aboutPanel = document.getElementById("about-us-panel");
  const mainMenu = document.getElementById("main-menu");
  const searchContainer = document.querySelector(".search-container");
  const resultContainer = document.getElementById("result");
  const timeDisplay = document.getElementById("current-time");
  const settingsBtn = document.getElementById("settings-btn");

  const menuBtn = document.getElementById("menu-btn");
  if (mainMenu && mainMenu.classList.contains("open")) {
    mainMenu.classList.remove("open");
    if (menuBtn) menuBtn.style.display = "";
  }

  const privacyPanel = document.getElementById("privacy-panel");
  if (privacyPanel && privacyPanel.classList.contains("active")) {
    togglePrivacy();
  }

  const termsPanel = document.getElementById("terms-panel");
  if (termsPanel && termsPanel.classList.contains("active")) {
    toggleTerms();
  }

  if (aboutPanel) {
    aboutPanel.classList.toggle("active");
    const isActive = aboutPanel.classList.contains("active");

    if (searchContainer)
      searchContainer.style.display = isActive ? "none" : "flex";
    if (resultContainer)
      resultContainer.style.display = isActive ? "none" : "block";
    if (timeDisplay) timeDisplay.style.display = isActive ? "none" : "block";
    if (settingsBtn) settingsBtn.style.display = isActive ? "none" : "block";
    if (menuBtn) menuBtn.style.display = isActive ? "none" : "";

    const weatherBox = document.querySelector(".weather-box");
    if (weatherBox) {
      if (isActive) {
        weatherBox.classList.add("about-mode");
      } else {
        weatherBox.classList.remove("about-mode");
      }
    }
  }
}

function togglePrivacy() {
  const privacyPanel = document.getElementById("privacy-panel");
  const mainMenu = document.getElementById("main-menu");
  const searchContainer = document.querySelector(".search-container");
  const resultContainer = document.getElementById("result");
  const timeDisplay = document.getElementById("current-time");
  const settingsBtn = document.getElementById("settings-btn");

  const menuBtn = document.getElementById("menu-btn");
  if (mainMenu && mainMenu.classList.contains("open")) {
    mainMenu.classList.remove("open");
    if (menuBtn) menuBtn.style.display = "";
  }

  const aboutPanel = document.getElementById("about-us-panel");
  if (aboutPanel && aboutPanel.classList.contains("active")) {
    toggleAbout();
  }

  const termsPanel = document.getElementById("terms-panel");
  if (termsPanel && termsPanel.classList.contains("active")) {
    toggleTerms();
  }

  if (privacyPanel) {
    privacyPanel.classList.toggle("active");
    const isActive = privacyPanel.classList.contains("active");

    if (searchContainer)
      searchContainer.style.display = isActive ? "none" : "flex";
    if (resultContainer)
      resultContainer.style.display = isActive ? "none" : "block";
    if (timeDisplay) timeDisplay.style.display = isActive ? "none" : "block";
    if (settingsBtn) settingsBtn.style.display = isActive ? "none" : "block";
    if (menuBtn) menuBtn.style.display = isActive ? "none" : "";

    const weatherBox = document.querySelector(".weather-box");
    if (weatherBox) {
      if (isActive) {
        weatherBox.classList.add("about-mode");
      } else {
        weatherBox.classList.remove("about-mode");
      }
    }
  }
}

function toggleTerms() {
  const termsPanel = document.getElementById("terms-panel");
  const mainMenu = document.getElementById("main-menu");
  const searchContainer = document.querySelector(".search-container");
  const resultContainer = document.getElementById("result");
  const timeDisplay = document.getElementById("current-time");
  const settingsBtn = document.getElementById("settings-btn");

  const menuBtn = document.getElementById("menu-btn");
  if (mainMenu && mainMenu.classList.contains("open")) {
    mainMenu.classList.remove("open");
    if (menuBtn) menuBtn.style.display = "";
  }

  const aboutPanel = document.getElementById("about-us-panel");
  if (aboutPanel && aboutPanel.classList.contains("active")) {
    toggleAbout();
  }

  const privacyPanel = document.getElementById("privacy-panel");
  if (privacyPanel && privacyPanel.classList.contains("active")) {
    togglePrivacy();
  }

  if (termsPanel) {
    termsPanel.classList.toggle("active");
    const isActive = termsPanel.classList.contains("active");

    if (searchContainer)
      searchContainer.style.display = isActive ? "none" : "flex";
    if (resultContainer)
      resultContainer.style.display = isActive ? "none" : "block";
    if (timeDisplay) timeDisplay.style.display = isActive ? "none" : "block";
    if (settingsBtn) settingsBtn.style.display = isActive ? "none" : "block";
    if (menuBtn) menuBtn.style.display = isActive ? "none" : "";

    const weatherBox = document.querySelector(".weather-box");
    if (weatherBox) {
      if (isActive) {
        weatherBox.classList.add("about-mode");
      } else {
        weatherBox.classList.remove("about-mode");
      }
    }
  }
}

const aboutUsHTML = `
        <div class="about-header">
          <span class="about-close" onclick="toggleAbout()">
            <i class="bx bx-arrow-back"></i> Back
          </span>
        </div>
        <div class="about-content">
          <h2>About Us</h2>
          <h3>The Weather Box</h3>
          <p>WeatherBox is a modern weather platform designed to provide accurate, accessible, and visually engaging weather information for people around the world.</p>
          <p>Our mission is simple: transform complex weather data into information that is easy to understand, useful in daily life, and enjoyable to explore.</p>
          <p>Weather affects nearly every aspect of our lives—from travel and commuting to outdoor activities, work, health, and safety. WeatherBox was created to help users make informed decisions by presenting real-time weather conditions, forecasts, and weather-related insights through an intuitive and carefully crafted experience.</p>
          <p>Unlike traditional weather websites that focus solely on data, WeatherBox combines reliable weather information with interactive visual design, animated weather environments, and customizable settings that adapt to individual user preferences.</p>

          <h3>What We Provide</h3>
          <p>WeatherBox offers a range of weather-related services, including:</p>
          <ul>
          <li>Current weather conditions</li>
          <li>Location-based weather information</li>
          <li>Forecast data</li>
          <li>Weather measurements and atmospheric conditions</li>
          <li>Location search and weather lookup tools</li>
          <li>Unit customization options</li>
          <li>Time and weather visualization features</li>
          <li>Interactive weather displays and animations</li>
          </ul>
          <p>Our platform is continuously improved to provide a faster, more accurate, and more enjoyable weather experience.</p>
          
          <h3>Our Commitment</h3>
          <p>We are committed to:</p>
          <ul>
          <li>Providing clear and understandable weather information</li>
          <li>Respecting user privacy</li>
          <li>Maintaining transparency regarding data sources</li>
          <li>Delivering a reliable and secure service</li>
          <li>Continuously improving the quality and usability of the platform</li>
          </ul>
          <p>WeatherBox is intended to serve users ranging from casual weather enthusiasts to individuals who rely on weather information in their daily planning.</p>

          <h3>Data Sources</h3>
          <p>WeatherBox aggregates weather information from trusted third-party providers.</p>
          <p>Data displayed within the Service may include information supplied by:</p>
          <ul>
          <li>OpenWeather</li>
          <li>Open-Meteo</li>
          <li>Browser Geolocation Services</li>
          <li>Device Location Services</li>
          <li>Other weather and environmental data providers that may be integrated in the future</li>
          </ul>
          <p>WeatherBox does not independently generate meteorological forecasts. Weather information is provided by external data providers and is presented through the WeatherBox platform.</p>
          <p>While we strive to display information accurately and promptly, WeatherBox cannot guarantee the completeness, accuracy, or uninterrupted availability of third-party data.</p>
          <p>Users should consult official meteorological and governmental weather authorities when weather information is required for safety-critical decisions.</p>



          <p>Thank you for using WeatherBox.</p>
        </div>
`;

const privacyPolicyHTML = `
        <div class="about-header">
          <span class="about-close" onclick="togglePrivacy()">
            <i class="bx bx-arrow-back"></i> Back
          </span>
        </div>
        <div class="about-content">
          <h2>Privacy Policy</h2>
          <p><em>Effective Date: June 2026</em></p>
          <p>WeatherBox respects your privacy and is committed to protecting your information.</p>
          <p>This Privacy Policy explains what information we collect, how we use it, and the choices available to you when using our Service.</p>
          
          <h3>1. Information We Collect</h3>
          <p><strong>Information You Provide</strong></p>
          <p>When using WeatherBox, you may voluntarily provide:</p>
          <ul>
            <li>Location search queries</li>
            <li>Feedback or communications</li>
            <li>User preferences and settings</li>
            <li>Analyze usage trends.</li>
          </ul>
          <p><strong>Location Information</strong></p>
          <p>If you choose to enable location services, WeatherBox may access your device's geographic location to provide local weather information.</p>
          <p>Location access occurs only after permission is granted through your browser or device.</p>
          <p><strong>Automatically Collected Information</strong></p>
          <p>When you access the Service, certain technical information may be collected automatically, including:</p>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device type</li>
            <li>Operating system</li>
            <li>Screen resolution</li>
            <li>Language preferences</li>
            <li>Referring pages</li>
            <li>Usage statistics</li>
            <li>Performance and diagnostic information</li>
          </ul>

          <h3>2. How We Use Information</h3>
          <p>We use information to:</p>
          <ul>
            <li>Deliver weather forecasts and weather-related services</li>
            <li>Provide location-based weather information</li>
            <li>Remember user preferences and settings</li>
            <li>Improve website performance and usability</li>
            <li>Maintain service security</li>
            <li>Diagnose technical issues</li>
            <li>Prevent abuse and unauthorized activity</li>
            <li>Analyze usage trends</li>
          </ul>

          <h3>3. User Preferences and Local Storage</h3>
          <p>WeatherBox may store certain settings locally within your browser or device.</p>
          <p>Examples include:</p>
          <ul>
            <li>Temperature unit preferences</li>
            <li>Wind speed units</li>
            <li>Pressure units</li>
            <li>Visibility units</li>
            <li>Time format settings</li>
            <li>User interface preferences</li>
          </ul>
          <p>These settings are stored to improve user experience and provide continuity between visits.</p>

          <h3>4. Cookies and Similar Technologies</h3>
          <p>WeatherBox may use cookies, local storage technologies, and similar mechanisms to:</p>
          <ul>
            <li>Maintain functionality</li>
            <li>Store user preferences</li>
            <li>Improve performance</li>
            <li>Analyze usage patterns</li>
            <li>Enhance user experience</li>
          </ul>
          <p>You may control cookie behavior through your browser settings. Disabling certain technologies may affect functionality.</p>

          <h3>5. Third-Party Services</h3>
          <p>WeatherBox may use third-party providers that process information on our behalf.</p>
          <p>These providers may include:</p>
          <ul>
            <li>Weather data providers</li>
            <li>Geolocation services</li>
            <li>Hosting providers</li>
            <li>Content delivery networks (CDNs)</li>
            <li>Analytics services</li>
          </ul>
          <p>These providers process information according to their own privacy policies.</p>

          <h3>6. Data Security</h3>
          <p>WeatherBox implements reasonable technical and organizational safeguards designed to protect information from unauthorized access, disclosure, alteration, misuse, or destruction.</p>
          <p>However, no method of transmission or storage can be guaranteed to be completely secure.</p>

          <h3>7. Data Retention</h3>
          <p>Information is retained only as long as reasonably necessary to:</p>
          <ul>
            <li>Operate the Service</li>
            <li>Comply with legal obligations</li>
            <li>Resolve disputes</li>
            <li>Enforce policies</li>
            <li>Improve functionality</li>
          </ul>

          <h3>8. Children's Privacy</h3>
          <p>WeatherBox is not specifically directed toward children under the age required by applicable law.</p>
          <p>We do not knowingly collect personal information from children without appropriate legal authorization.</p>

          <h3>9. Your Rights</h3>
          <p>Depending on your jurisdiction, you may have rights regarding your personal information, including:</p>
          <ul>
            <li>Access</li>
            <li>Correction</li>
            <li>Deletion</li>
            <li>Restriction of processing</li>
            <li>Objection to processing</li>
            <li>Data portability where applicable</li>
          </ul>
          <p>Requests may be submitted through available contact channels.</p>

          <h3>10. International Users</h3>
          <p>WeatherBox may be accessed from multiple countries.</p>
          <p>By using the Service, you acknowledge that information may be processed in jurisdictions different from your country of residence.</p>

          <h3>11. Changes to This Policy</h3>
          <p>We may update this Privacy Policy periodically.</p>
          <p>Updated versions will be posted on this page with a revised effective date.</p>

          <h3>12. Contact</h3>
          <p>Questions regarding this Privacy Policy may be directed through the contact methods provided on the website.</p>
        </div>
`;

const termsOfServiceHTML = `
        <div class="about-header">
          <span class="about-close" onclick="toggleTerms()">
            <i class="bx bx-arrow-back"></i> Back
          </span>
        </div>
        <div class="about-content">
          <h2>Terms of Service</h2>
          <p><em>Last Updated: June 2026</em></p>
          <p>Welcome to Weather Box.</p>
          <p>These Terms of Service ("Terms") govern your access to and use of the WeatherBox website, applications, services, and related features (collectively, the "Service").</p>
          <p>By accessing or using WeatherBox, you agree to be bound by these Terms. If you do not agree with these Terms, you should discontinue use of the Service.</p>
          
          <h3>1. Eligibility</h3>
          <p>You may use WeatherBox only in compliance with applicable laws and regulations.</p>
          <p>By using the Service, you represent that you have the legal capacity to enter into these Terms under the laws of your jurisdiction.</p>
          
          <h3>2. Description of Service</h3>
          <p>WeatherBox provides weather-related information, forecasts, environmental conditions, location-based weather services, visual weather displays, and related informational tools.</p>
          <p>The Service may use third-party data providers to supply weather and location information.</p>
          <p>WeatherBox may modify, update, improve, suspend, or discontinue any portion of the Service at any time without prior notice.</p>
          
          <h3>3. Informational Nature of Weather Data</h3>
          <p>Weather information is provided for general informational purposes only.</p>
          <p>Although WeatherBox strives to present accurate and timely information, weather forecasts are inherently predictive and may contain inaccuracies, delays, interruptions, or errors.</p>
          <p>Users should not rely solely on WeatherBox for decisions involving:</p>
          <ul>
            <li>Personal safety</li>
            <li>Emergency response</li>
            <li>Aviation</li>
            <li>Marine activities</li>
            <li>Disaster preparedness</li>
            <li>Severe weather events</li>
            <li>Medical situations</li>
            <li>Commercial operations where weather accuracy is critical</li>
          </ul>
          <p>Official government weather agencies and emergency management authorities should always be consulted when safety-related decisions are involved.</p>
          
          <h3>4. Location Services</h3>
          <p>Certain features may request access to your device's location in order to provide localized weather information.</p>
          <p>Location access is entirely optional.</p>
          <p>If permission is granted, WeatherBox may use location information solely for providing relevant weather services and improving location-based functionality.</p>
          <p>You may revoke location permissions at any time through your browser or device settings.</p>
          
          <h3>5. Acceptable Use</h3>
          <p>You agree not to:</p>
          <ul>
            <li>Violate any applicable law or regulation</li>
            <li>Attempt unauthorized access to systems or networks</li>
            <li>Interfere with the operation of the Service</li>
            <li>Circumvent security mechanisms</li>
            <li>Introduce malware, malicious code, or harmful software</li>
            <li>Scrape, harvest, or collect data through automated means in a manner that places unreasonable load on the Service</li>
            <li>Reverse engineer, copy, or replicate proprietary components of the platform without authorization</li>
          </ul>
          
          <h3>6. Intellectual Property</h3>
          <p>Unless otherwise stated, all content, design elements, visual assets, branding, software code, graphics, animations, text, interfaces, and features made available through WeatherBox are protected by applicable intellectual property laws.</p>
          <p>Ownership remains with WeatherBox or its licensors.</p>
          <p>Nothing in these Terms grants users ownership rights in the Service.</p>
          
          <h3>7. Third-Party Services</h3>
          <p>WeatherBox relies on third-party providers for weather, mapping, geolocation, analytics, hosting, and infrastructure services.</p>
          <p>WeatherBox does not control third-party services and cannot guarantee their availability, accuracy, performance, or reliability.</p>
          <p>Use of third-party services may also be subject to separate terms and privacy policies maintained by those providers.</p>
          
          <h3>8. Service Availability</h3>
          <p>While we strive to maintain continuous availability, WeatherBox does not guarantee uninterrupted access to the Service.</p>
          <p>Temporary interruptions may occur due to:</p>
          <ul>
            <li>Maintenance</li>
            <li>Software updates</li>
            <li>Network failures</li>
            <li>API invulnerability</li>
            <li>Infrastructure issues</li>
            <li>Third-party service outages</li>
            <li>Events beyond our reasonable control</li>
          </ul>
          
          <h3>9. Disclaimer of Warranties</h3>
          <p>The Service is provided on an "as is" and "as available" basis.</p>
          <p>To the maximum extent permitted by law, WeatherBox disclaims all warranties, express or implied, including warranties of accuracy, reliability, availability, merchantability, fitness for a particular purpose, and non-infringement.</p>
          
          <h3>10. Limitation of Liability</h3>
          <p>To the fullest extent permitted by applicable law, WeatherBox and its operators shall not be liable for any indirect, incidental, consequential, special, punitive, or exemplary damages arising from:</p>
          <ul>
            <li>Use of the Service</li>
            <li>Reliance upon weather information</li>
            <li>Forecast inaccuracies</li>
            <li>Data interruptions</li>
            <li>Service outages</li>
            <li>Technical errors</li>
            <li>Loss of data</li>
            <li>Loss of profits or business opportunities</li>
          </ul>

          <h3>11. Modifications to These Terms</h3>
          <p>WeatherBox reserves the right to update these Terms at any time.</p>
          <p>Updated versions will become effective upon publication.</p>
          <p>Continued use of the Service after updates constitutes acceptance of the revised Terms.</p>
          
          <h3>12. Contact</h3>
          <p>Questions regarding these Terms may be submitted through the contact methods provided on the website.</p>
        </div>
`;

const mainMenuHTML = `
      <i class="ti ti-menu-2 top-left-icon" id="menu-btn" title="Menu"></i>
`;

const mainMenuBoxHTML = `
      <!-- Main menu pop-out -->
      <div id="main-menu" class="settings-menu">
        <div class="settings-header">
          <span class="weatherboxMenu-title"
            >Weather<span class="box-text">Box</span></span
          >
          <i class="bx bx-x close-settings" id="close-main-menu-btn"></i>
        </div>
        <div class="settings-content">
          <div id="about-btn"><i class="ti ti-file-info" style="margin-right: 6px; font-size: 1.1em; vertical-align: middle;"></i><span style="vertical-align: middle;">About Weather Box</span></div>
          <div id="privacy-btn"><i class="ti ti-shield-search" style="margin-right: 6px; font-size: 1.1em; vertical-align: middle;"></i><span style="vertical-align: middle;">Privacy Policy</span></div>
          <div id="terms-btn"><i class="bx bx-file" style="margin-right: 6px; font-size: 1.1em; vertical-align: middle;"></i><span style="vertical-align: middle;">Terms of Service</span></div>
        </div>
      </div>
`;

document.addEventListener("DOMContentLoaded", function () {
  const topLeftControls = document.querySelector(".top-left-controls");
  if (topLeftControls) {
    topLeftControls.insertAdjacentHTML("afterbegin", mainMenuHTML);
  }
  
  const weatherBox = document.querySelector(".weather-box");
  if (weatherBox) {
    weatherBox.insertAdjacentHTML("beforeend", mainMenuBoxHTML);
  }

  const aboutPanel = document.getElementById("about-us-panel");
  if (aboutPanel) aboutPanel.innerHTML = aboutUsHTML;

  const privacyPanel = document.getElementById("privacy-panel");
  if (privacyPanel) privacyPanel.innerHTML = privacyPolicyHTML;

  const termsPanel = document.getElementById("terms-panel");
  if (termsPanel) termsPanel.innerHTML = termsOfServiceHTML;

  const homeBtn = document.getElementById("home-btn");
  if (homeBtn) {
    homeBtn.addEventListener("click", function () {
      if (aboutPanel && aboutPanel.classList.contains("active")) toggleAbout();
      if (privacyPanel && privacyPanel.classList.contains("active"))
        togglePrivacy();
      if (termsPanel && termsPanel.classList.contains("active")) toggleTerms();
    });
  }

  const aboutBtn = document.getElementById("about-btn");
  if (aboutBtn) {
    aboutBtn.addEventListener("click", toggleAbout);
  }

  const privacyBtn = document.getElementById("privacy-btn");
  if (privacyBtn) {
    privacyBtn.addEventListener("click", togglePrivacy);
  }

  const termsBtn = document.getElementById("terms-btn");
  if (termsBtn) {
    termsBtn.addEventListener("click", toggleTerms);
  }

  const menuBtn = document.getElementById("menu-btn");
  const mainMenu = document.getElementById("main-menu");
  const closeMainMenuBtn = document.getElementById("close-main-menu-btn");

  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      if (mainMenu) {
        mainMenu.classList.toggle("open");
        if (mainMenu.classList.contains("open")) {
          menuBtn.style.display = "none";
        } else {
          menuBtn.style.display = "";
        }
      }
    });
  }

  if (closeMainMenuBtn) {
    closeMainMenuBtn.addEventListener("click", function () {
      if (mainMenu) mainMenu.classList.remove("open");
      if (menuBtn) menuBtn.style.display = "";
    });
  }

  document.addEventListener("click", function (e) {
    const settingsMenu = document.getElementById("settings-menu");
    const settingsBtn = document.getElementById("settings-btn");
    if (
      settingsMenu &&
      settingsMenu.classList.contains("open") &&
      !settingsMenu.contains(e.target) &&
      (!settingsBtn || !settingsBtn.contains(e.target))
    ) {
      settingsMenu.classList.remove("open");
    }

    const mainMenu = document.getElementById("main-menu");
    const menuBtn = document.getElementById("menu-btn");
    if (
      mainMenu &&
      mainMenu.classList.contains("open") &&
      !mainMenu.contains(e.target) &&
      (!menuBtn || !menuBtn.contains(e.target))
    ) {
      mainMenu.classList.remove("open");
      if (menuBtn) menuBtn.style.display = "";
    }
  });

});
