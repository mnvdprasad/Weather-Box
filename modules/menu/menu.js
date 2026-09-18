function toggleAbout(skipPushState = false) {
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
    togglePrivacy(true);
  }

  const termsPanel = document.getElementById("terms-panel");
  if (termsPanel && termsPanel.classList.contains("active")) {
    toggleTerms(true);
  }

  if (aboutPanel) {
    aboutPanel.classList.toggle("active");
    const isActive = aboutPanel.classList.contains("active");

    if (searchContainer)
      searchContainer.style.display = isActive ? "none" : "flex";
    if (resultContainer)
      resultContainer.style.display = isActive ? "none" : "block";
    const homeResult = document.getElementById("home-result");
    if (homeResult)
      homeResult.style.display = isActive
        ? "none"
        : window.location.hash.startsWith("#weather/")
          ? "none"
          : "block";
    if (timeDisplay) timeDisplay.style.display = isActive ? "none" : "block";
    if (settingsBtn) settingsBtn.style.display = isActive ? "none" : "block";

    const weatherBox = document.querySelector(".weather-box");
    if (weatherBox) {
      if (isActive) {
        weatherBox.classList.add("about-mode");
      } else {
        weatherBox.classList.remove("about-mode");
      }
    }

    if (typeof window.pushAppState === "function" && !skipPushState) {
      window.pushAppState(isActive ? "#about" : "#home");
    }
  }
}

function togglePrivacy(skipPushState = false) {
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
    toggleAbout(true);
  }

  const termsPanel = document.getElementById("terms-panel");
  if (termsPanel && termsPanel.classList.contains("active")) {
    toggleTerms(true);
  }

  if (privacyPanel) {
    privacyPanel.classList.toggle("active");
    const isActive = privacyPanel.classList.contains("active");

    if (searchContainer)
      searchContainer.style.display = isActive ? "none" : "flex";
    if (resultContainer)
      resultContainer.style.display = isActive ? "none" : "block";
    const homeResult = document.getElementById("home-result");
    if (homeResult)
      homeResult.style.display = isActive
        ? "none"
        : window.location.hash.startsWith("#weather/")
          ? "none"
          : "block";
    if (timeDisplay) timeDisplay.style.display = isActive ? "none" : "block";
    if (settingsBtn) settingsBtn.style.display = isActive ? "none" : "block";

    const weatherBox = document.querySelector(".weather-box");
    if (weatherBox) {
      if (isActive) {
        weatherBox.classList.add("about-mode");
      } else {
        weatherBox.classList.remove("about-mode");
      }
    }

    if (typeof window.pushAppState === "function" && !skipPushState) {
      window.pushAppState(isActive ? "#privacy" : "#home");
    }
  }
}

function toggleTerms(skipPushState = false) {
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
    toggleAbout(true);
  }

  const privacyPanel = document.getElementById("privacy-panel");
  if (privacyPanel && privacyPanel.classList.contains("active")) {
    togglePrivacy(true);
  }

  if (termsPanel) {
    termsPanel.classList.toggle("active");
    const isActive = termsPanel.classList.contains("active");

    if (searchContainer)
      searchContainer.style.display = isActive ? "none" : "flex";
    if (resultContainer)
      resultContainer.style.display = isActive ? "none" : "block";
    const homeResult = document.getElementById("home-result");
    if (homeResult)
      homeResult.style.display = isActive
        ? "none"
        : window.location.hash.startsWith("#weather/")
          ? "none"
          : "block";
    if (timeDisplay) timeDisplay.style.display = isActive ? "none" : "block";
    if (settingsBtn) settingsBtn.style.display = isActive ? "none" : "block";

    const weatherBox = document.querySelector(".weather-box");
    if (weatherBox) {
      if (isActive) {
        weatherBox.classList.add("about-mode");
      } else {
        weatherBox.classList.remove("about-mode");
      }
    }

    if (typeof window.pushAppState === "function" && !skipPushState) {
      window.pushAppState(isActive ? "#terms" : "#home");
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
          <p><strong>Weather Box</strong> is a modern, highly responsive web platform designed to provide accurate, accessible, and visually engaging meteorological data for users across the globe.</p>
          <p>Our core mission is straightforward: to transform complex atmospheric data into clear, actionable information that is intuitive to understand, highly useful for daily planning, and enjoyable to interact with.</p>
          <p>Weather fundamentally impacts nearly every aspect of daily life—from commuting and travel to outdoor activities, health, and general safety. Weather Box was meticulously crafted to empower users to make informed decisions by presenting real-time conditions, detailed forecasts, and deep environmental insights through a polished, user-centric experience.</p>
          <p>Unlike traditional, static weather websites that rely exclusively on raw text data, Weather Box bridges the gap by combining reliable meteorological information with immersive visual design, animated dynamic weather environments, and a comprehensive suite of customizable settings tailored to individual preferences.</p>

          <h3>What We Provide</h3>
          <p>Weather Box offers an extensive array of weather-related services and features, including:</p>
          <ul>
            <li>Real-time, hyper-local current weather conditions</li>
            <li>Comprehensive short-term and extended forecast data</li>
            <li>In-depth atmospheric measurements (e.g., humidity, UV index, air quality, visibility)</li>
            <li>Advanced location search, autocomplete, and mapping tools</li>
            <li>Extensive unit customization options (Celsius/Fahrenheit, metric/imperial)</li>
            <li>Time and weather visualization tools synchronizing with local timezones</li>
            <li>Interactive, hardware-accelerated weather displays and dynamic background animations</li>
          </ul>
          <p>Our platform architecture is continuously monitored and refined to ensure a faster, more accurate, and seamless weather tracking experience.</p>
          
          <h3>Our Commitment</h3>
          <p>At Weather Box, we are deeply committed to the following principles:</p>
          <ul>
            <li><strong>Clarity:</strong> Providing clear, understandable, and accessible weather information for everyone.</li>
            <li><strong>Privacy:</strong> Respecting user privacy by minimizing data collection and keeping preferences local.</li>
            <li><strong>Transparency:</strong> Maintaining full transparency regarding our third-party data sources and algorithms.</li>
            <li><strong>Reliability:</strong> Delivering a secure, stable, and high-performance web service.</li>
            <li><strong>Innovation:</strong> Continuously improving the quality, accessibility, and visual aesthetics of the platform.</li>
          </ul>
          <p>Weather Box is designed to scale and serve a diverse user base, ranging from casual weather enthusiasts checking the daily outlook to individuals and professionals who rely heavily on precise weather data for critical daily planning.</p>

          <h3>Data Sources & Transparency</h3>
          <p>To ensure high reliability, Weather Box aggregates its weather intelligence from industry-leading, trusted third-party meteorological providers.</p>
          <p>Data displayed within our platform is directly supplied and powered by:</p>
          <ul>
            <li><a href="https://openweathermap.org/" target="_blank" style="color: #60a5fa; text-decoration: none;">OpenWeather</a></li>
            <li><a href="https://open-meteo.com/" target="_blank" style="color: #60a5fa; text-decoration: none;">Open-Meteo</a></li>
            <li><a href="https://www.weatherapi.com/" target="_blank" style="color: #60a5fa; text-decoration: none;">WeatherAPI.com</a></li>
            <li><a href="https://www.windy.com/" target="_blank" style="color: #60a5fa; text-decoration: none;">Windy.com</a> (Interactive Radar/Maps)</li>
            <li>Browser and Device Geolocation Services</li>
            <li>OpenStreetMap, Photon, and other supplementary mapping data providers</li>
          </ul>
          <p><em>Disclaimer: Weather Box functions as a data aggregator and presentation platform; we do not independently generate meteorological forecasts. While our systems strive to fetch and display information accurately and promptly, we cannot guarantee the absolute completeness or uninterrupted availability of third-party API data. Users should always consult official governmental meteorological authorities when making safety-critical or emergency response decisions.</em></p>

          <h3>Open Source & Community</h3>
          <p>Weather Box operates as a transparent, open-source project. We believe the best software is built collaboratively through community feedback, testing, and contributions. You are encouraged to explore our source code, report any issues, or contribute directly to the project's development on <a href="https://github.com/mnvdprasad/Weather-Box" target="_blank" style="color: #60a5fa; text-decoration: none;">GitHub</a>.</p>
          <p>Experience the production web application live at: <a href="https://weatherboxlive.vercel.app" target="_blank" style="color: #60a5fa; text-decoration: none;">weatherboxlive.vercel.app</a></p>

          <p style="margin-top: 20px; font-weight: bold; font-size: 1.1em;">Thank you for choosing Weather Box!</p>
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
          <p><em>Effective Date: September 2026</em></p>
          <p>At <strong>Weather Box</strong>, we respect your privacy and are deeply committed to protecting your personal information. This Privacy Policy comprehensively outlines the types of information we collect, the purposes for which it is used, and the rights and choices available to you as a user of our Service.</p>
          
          <h3>1. Information We Collect</h3>
          <p><strong>Information You Provide</strong></p>
          <p>When interacting with Weather Box, you may voluntarily provide information to enhance your experience. This includes:</p>
          <ul>
            <li>Location search queries and saved locations</li>
            <li>Feedback, support requests, or communications</li>
            <li>Customized user preferences and UI settings</li>
          </ul>
          <p><strong>Location Information</strong></p>
          <p>To provide accurate, localized weather data, Weather Box may request access to your device's geographic location. This access is entirely optional and only occurs after explicit permission is granted through your web browser or device settings. You may revoke this permission at any time.</p>
          <p><strong>Automatically Collected Information</strong></p>
          <p>When you access the Service, certain technical data is collected automatically to ensure proper functionality and security. This may include:</p>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device type and hardware specifications</li>
            <li>Operating system</li>
            <li>Screen resolution</li>
            <li>Language preferences</li>
            <li>Referring pages and usage statistics</li>
            <li>Performance metrics and diagnostic information</li>
          </ul>

          <h3>2. How We Use Information</h3>
          <p>We process the collected information strictly for the following purposes:</p>
          <ul>
            <li>To deliver accurate weather forecasts and related environmental services</li>
            <li>To provide precise location-based weather updates</li>
            <li>To remember your customized user preferences and settings across sessions</li>
            <li>To optimize website performance, scalability, and overall usability</li>
            <li>To maintain the security and integrity of our platform</li>
            <li>To diagnose technical issues and prevent unauthorized or abusive activity</li>
            <li>To analyze aggregated usage trends to guide future feature development</li>
          </ul>

          <h3>3. User Preferences and Local Storage</h3>
          <p>Weather Box utilizes local storage mechanisms within your browser to persistently save your personal preferences. This ensures continuity and a seamless experience between visits. Data stored locally includes:</p>
          <ul>
            <li>Temperature unit preferences (Celsius/Fahrenheit)</li>
            <li>Wind speed and pressure metrics</li>
            <li>Visibility units</li>
            <li>Time format settings (12-hour/24-hour)</li>
            <li>User interface themes and visual preferences</li>
          </ul>
          <p>We prioritize your privacy by keeping these preferences locally on your device rather than transmitting them to external servers.</p>

          <h3>4. Cookies and Similar Technologies</h3>
          <p>Weather Box may employ cookies, local storage technologies, and similar tracking mechanisms to:</p>
          <ul>
            <li>Maintain essential site functionality</li>
            <li>Store user preferences safely</li>
            <li>Monitor and improve application performance</li>
            <li>Analyze user engagement patterns</li>
          </ul>
          <p>You maintain full control over cookie behavior through your browser's privacy settings. Please note that disabling certain storage technologies may negatively impact the functionality of the Service.</p>

          <h3>5. Third-Party Services</h3>
          <p>To provide highly accurate and comprehensive meteorological data, Weather Box integrates with trusted third-party service providers. These entities process information on our behalf and may include:</p>
          <ul>
            <li><strong>Weather Data Providers:</strong> <a href="https://openweathermap.org/" target="_blank" style="color: #60a5fa; text-decoration: none;">OpenWeather</a>, <a href="https://open-meteo.com/" target="_blank" style="color: #60a5fa; text-decoration: none;">Open-Meteo</a>, <a href="https://www.weatherapi.com/" target="_blank" style="color: #60a5fa; text-decoration: none;">WeatherAPI.com</a></li>
            <li><strong>Interactive Mapping:</strong> <a href="https://www.windy.com/" target="_blank" style="color: #60a5fa; text-decoration: none;">Windy.com</a></li>
            <li><strong>Geolocation Services:</strong> OpenStreetMap Nominatim, Photon, Open-Meteo Geocoding</li>
            <li><strong>Hosting and Infrastructure Providers</strong></li>
            <li><strong>Content Delivery Networks (CDNs)</strong></li>
          </ul>
          <p>These third-party providers process your information in accordance with their own respective privacy policies and legal obligations.</p>

          <h3>6. Data Security</h3>
          <p>Weather Box implements robust technical, organizational, and administrative safeguards designed to protect your information against unauthorized access, accidental loss, alteration, misuse, or destruction.</p>
          <p>However, no method of digital transmission or electronic storage can be guaranteed to be 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee its absolute security.</p>

          <h3>7. Data Retention</h3>
          <p>We retain collected information only for as long as it is reasonably necessary to fulfill the purposes outlined in this policy, including:</p>
          <ul>
            <li>Operating and maintaining the Service</li>
            <li>Complying with applicable legal obligations</li>
            <li>Resolving disputes and enforcing our policies</li>
            <li>Improving platform functionality</li>
          </ul>

          <h3>8. Children's Privacy</h3>
          <p>Weather Box is designed for a general audience and is not specifically directed toward children under the age required by applicable data protection laws. We do not knowingly collect, solicit, or maintain personal information from children without appropriate, verified parental or legal authorization.</p>

          <h3>9. Your Rights</h3>
          <p>Depending on your jurisdiction and applicable data protection laws, you may possess specific rights regarding your personal information, which may include:</p>
          <ul>
            <li>The right to access the data we hold about you</li>
            <li>The right to correct inaccuracies</li>
            <li>The right to request deletion of your personal data</li>
            <li>The right to restrict or object to certain types of processing</li>
            <li>The right to data portability</li>
          </ul>
          <p>Requests to exercise these rights may be submitted through our official contact channels.</p>

          <h3>10. International Users</h3>
          <p>Weather Box operates globally and can be accessed from multiple countries. By using the Service, you acknowledge and consent that your information may be transferred to, processed, and stored in jurisdictions outside of your country of residence, where data protection laws may differ.</p>

          <h3>11. Changes to This Policy</h3>
          <p>We reserve the right to update or modify this Privacy Policy periodically to reflect changes in our practices, technological advancements, or legal requirements. Updated versions will be posted directly on this page, and the "Effective Date" at the top will be revised accordingly.</p>

          <h3>12. Contact Information</h3>
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us directly via our <a href="https://github.com/mnvdprasad/Weather-Box/issues" target="_blank" style="color: #60a5fa; text-decoration: none;">GitHub repository</a> or by opening a discussion thread.</p>
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
          <p><em>Last Updated: September 2026</em></p>
          <p>Welcome to <strong>Weather Box</strong>.</p>
          <p>These Terms of Service ("Terms") govern your access to and use of the Weather Box web application, services, data APIs, and related features (collectively, the "Service").</p>
          <p>By accessing or using Weather Box, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you must immediately discontinue your use of the Service.</p>
          
          <h3>1. Eligibility</h3>
          <p>You may use Weather Box only in compliance with all applicable local, state, national, and international laws, rules, and regulations.</p>
          <p>By using the Service, you represent and warrant that you possess the legal authority and capacity to enter into these Terms under the laws of your jurisdiction.</p>
          
          <h3>2. Description of Service</h3>
          <p>Weather Box provides real-time meteorological data, localized weather forecasts, atmospheric metrics, dynamic visual weather displays, and related location-based search tools.</p>
          <p>The Service integrates data from multiple third-party providers (e.g., OpenWeather, Open-Meteo, WeatherAPI, Windy.com) to present comprehensive weather dashboards and interactive maps.</p>
          <p>We reserve the right to modify, update, improve, suspend, or discontinue any portion of the Service, its features, or its data sources at our sole discretion, at any time, and without prior notice.</p>
          
          <h3>3. Informational Nature of Weather Data</h3>
          <p>All weather information presented via the Service is provided strictly for general informational purposes.</p>
          <p>Although Weather Box aggregates data from highly reputable sources to ensure accuracy, meteorological forecasting is inherently predictive and subject to rapid changes. Therefore, our data may occasionally contain inaccuracies, reporting delays, or temporary interruptions.</p>
          <p>Users must <strong>never</strong> rely solely on Weather Box for decisions involving:</p>
          <ul>
            <li>Personal safety or emergency response</li>
            <li>Aviation, marine, or specialized outdoor activities</li>
            <li>Severe weather preparation or disaster management</li>
            <li>Medical situations affected by environmental conditions</li>
            <li>Commercial operations where weather precision is mission-critical</li>
          </ul>
          <p>Always consult official governmental meteorological and emergency management authorities when safety-critical decisions are involved.</p>
          
          <h3>4. Location Services</h3>
          <p>To provide highly localized weather forecasting, Weather Box may request access to your device's geolocation data.</p>
          <p>This access is completely optional. If permission is granted via your web browser or operating system, Weather Box will utilize your location data exclusively to fetch relevant meteorological conditions.</p>
          <p>You may revoke these location permissions at any time through your device or browser's privacy settings.</p>
          
          <h3>5. Acceptable Use</h3>
          <p>While interacting with the Service, you agree <strong>not</strong> to:</p>
          <ul>
            <li>Violate any applicable local, state, or international law or regulation</li>
            <li>Attempt unauthorized access to the application’s underlying infrastructure, networks, or APIs</li>
            <li>Interfere with, disrupt, or deliberately degrade the operation of the Service</li>
            <li>Bypass, disable, or circumvent any security or rate-limiting mechanisms</li>
            <li>Introduce malicious code, spyware, viruses, or harmful software</li>
            <li>Scrape, harvest, or indiscriminately collect data via automated bots or scripts in a manner that imposes an unreasonable burden on our infrastructure</li>
            <li>Reverse engineer, replicate, or commercially exploit the proprietary components of the platform without explicit authorization</li>
          </ul>
          
          <h3>6. Intellectual Property</h3>
          <p>Unless explicitly stated otherwise or covered under an open-source license, all original content, UI design elements, visual assets, software code, custom graphics, and animations provided within Weather Box are protected by applicable intellectual property and copyright laws.</p>
          <p>The Weather Box name, branding, and original source code remain the intellectual property of the Weather Box project developers and maintainers.</p>
          
          <h3>7. Third-Party Services</h3>
          <p>Weather Box relies heavily on external third-party infrastructure and APIs for weather data, geolocation, mapping, and web hosting.</p>
          <p>Because we do not directly control these third-party services, Weather Box cannot guarantee their continuous availability, absolute accuracy, or uninterrupted performance.</p>
          <p>Your interaction with data sourced from these external entities is also subject to their respective Terms of Service and Privacy Policies.</p>
          
          <h3>8. Service Availability</h3>
          <p>We strive to maintain continuous and highly responsive availability of the Service; however, Weather Box does not guarantee completely uninterrupted access.</p>
          <p>Temporary outages or performance degradation may occur due to:</p>
          <ul>
            <li>Routine platform maintenance or software deployments</li>
            <li>Unforeseen network or cloud infrastructure failures</li>
            <li>Third-party API deprecations or temporary unavailability</li>
            <li>Force majeure events beyond our reasonable control</li>
          </ul>
          
          <h3>9. Disclaimer of Warranties</h3>
          <p>The Service is provided strictly on an <strong>"as is"</strong> and <strong>"as available"</strong> basis.</p>
          <p>To the maximum extent permitted by applicable law, Weather Box and its developers expressly disclaim all warranties of any kind, whether express or implied. This includes, but is not limited to, implied warranties of accuracy, reliability, merchantability, fitness for a particular purpose, and non-infringement.</p>
          
          <h3>10. Limitation of Liability</h3>
          <p>To the fullest extent permitted by applicable law, Weather Box, its operators, contributors, and affiliates shall not be liable for any indirect, incidental, consequential, special, punitive, or exemplary damages arising directly or indirectly from:</p>
          <ul>
            <li>Your access to or use of (or inability to access or use) the Service</li>
            <li>Your reliance upon the meteorological data presented</li>
            <li>Inaccuracies, errors, or delays in the weather forecasts</li>
            <li>Service outages, data interruptions, or technical anomalies</li>
            <li>Loss of data, profits, goodwill, or other intangible business opportunities</li>
          </ul>
          
          <h3>11. Modifications to These Terms</h3>
          <p>Weather Box reserves the right to review, update, and amend these Terms at any time to reflect changes in our services or legal requirements.</p>
          <p>Any updated versions will be posted immediately on this page and will become effective upon publication. Your continued use of the Service following such updates constitutes your binding acceptance of the revised Terms.</p>
          
          <h3>12. Contact Information</h3>
          <p>If you have any questions, concerns, or requests regarding these Terms of Service, please reach out to us via our <a href="https://github.com/mnvdprasad/Weather-Box/issues" target="_blank" style="color: #60a5fa; text-decoration: none;">GitHub repository</a>.</p>
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
