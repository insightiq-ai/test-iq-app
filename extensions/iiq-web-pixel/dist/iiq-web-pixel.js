(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // node_modules/@shopify/web-pixels-extension/build/esm/globals.mjs
  var EXTENSION_POINT;
  var init_globals = __esm({
    "node_modules/@shopify/web-pixels-extension/build/esm/globals.mjs"() {
      EXTENSION_POINT = "WebPixel::Render";
    }
  });

  // node_modules/@shopify/web-pixels-extension/build/esm/register.mjs
  var register;
  var init_register = __esm({
    "node_modules/@shopify/web-pixels-extension/build/esm/register.mjs"() {
      init_globals();
      register = (extend) => shopify.extend(EXTENSION_POINT, extend);
    }
  });

  // node_modules/@shopify/web-pixels-extension/build/esm/index.mjs
  var init_esm = __esm({
    "node_modules/@shopify/web-pixels-extension/build/esm/index.mjs"() {
      init_register();
    }
  });

  // node_modules/@shopify/web-pixels-extension/index.mjs
  var init_web_pixels_extension = __esm({
    "node_modules/@shopify/web-pixels-extension/index.mjs"() {
      init_esm();
    }
  });

  // extensions/iiq-web-pixel/src/index.js
  var require_src = __commonJS({
    "extensions/iiq-web-pixel/src/index.js"(exports) {
      init_web_pixels_extension();
      var startTracking = (event2) => {
        console.log("Tracking Script execution start");
        verifyScript(event2);
        generateFingerprint(event2);
        generateUUID(event2);
        getDemographicsInfo(event2);
        getDeviceMetadata(event2);
        getUTMParams(event2);
        return new Promise((resolve, reject) => {
          if (localStorage.getItem("fingerprint-insightiq") && sessionStorage.getItem("sessionid-insightiq") && localStorage.getItem("demographics-info-insightiq") && localStorage.getItem("device-metadata-insightiq") && localStorage.getItem("utm-params-insightiq"))
            resolve();
        });
      };
      var sendTracking = (event2) => __async(exports, null, function* () {
        console.log("Event name: ", event2.name);
        try {
          const response = yield fetch("/apps/measure", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              fingerprint: localStorage.getItem("fingerprint-insightiq"),
              user_session_id: sessionStorage.getItem("sessionid-insightiq"),
              demographics_info: JSON.parse(localStorage.getItem("demographics-info-insightiq")),
              device_metadata: JSON.parse(localStorage.getItem("device-metadata-insightiq")),
              utm_params: JSON.parse(localStorage.getItem("utm-params-insightiq")),
              events: [
                {
                  event_type: getEventTypeAsPerPageViewed(),
                  page_info: {
                    current_page: window.location.href,
                    referrer: document.referrer
                  }
                }
              ]
            })
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const responseData = yield response.json();
          console.log(responseData);
        } catch (error) {
          console.error("Error:", error);
        }
      });
      var verifyScript = (event2) => {
        const { window: window2 } = event2.context;
        const url = new URL(window2.location.href);
        const searchParams = new URLSearchParams(url.search);
        const queryParams = Object.fromEntries(searchParams);
      };
      var generateFingerprint = () => {
        const { window: window2 } = event.context;
        if (!localStorage.getItem("fingerprint-insightiq")) {
          (function() {
            window2._fmOpt = {
              success: function(result) {
                localStorage.setItem("fingerprint-insightiq", result.device_id);
                return result.device_id;
              }
            };
            var fm = document.createElement("script");
            fm.type = "text/javascript";
            fm.async = false;
            fm.src = "https://cdn.jsdelivr.net/npm/@trustdevicejs/trustdevice-js@1.0.0/dist/fm.min.js";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(fm, s);
          })();
        }
      };
      var generateUUID = () => {
        if (!sessionStorage.getItem("sessionid-insightiq")) {
          const sessionId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === "x" ? r : r & 3 | 8;
            return v.toString(16);
          });
          sessionStorage.setItem("sessionid-insightiq", sessionId);
        }
      };
      var getDemographicsInfo = () => __async(exports, null, function* () {
        if (!localStorage.getItem("demographics-info-insightiq")) {
          const response = yield fetch("https://hutils.loxal.net/whois");
          const data = yield response.json();
          const { ip, city, country } = data;
          const language = window.navigator.language;
          const demographicsInfo = {
            ip_address: ip,
            city,
            country,
            languages: language
          };
          localStorage.setItem("demographics-info-insightiq", JSON.stringify(demographicsInfo));
        }
      });
      var getDeviceMetadata = () => __async(exports, null, function* () {
        try {
          yield loadScriptSync("https://cdnjs.cloudflare.com/ajax/libs/platform/1.3.5/platform.min.js");
          if (!localStorage.getItem("device-metadata-insightiq")) {
            const { userAgent } = window.navigator;
            const {
              product,
              manufacturer,
              os: { family: deviceOs },
              os: { version: deviceOsVersion }
            } = platform;
            const { name: browser, version: browserVersion } = platform.parse(userAgent);
            const width = window.screen.width;
            const height = window.screen.height;
            const deviceMetadata = {
              device: product,
              operating_system: deviceOs,
              browser,
              screen_size: `${width}x${height}`
            };
            localStorage.setItem("device-metadata-insightiq", JSON.stringify(deviceMetadata));
          }
        } catch (error) {
          console.error("Error loading CDN script:", error);
        }
      });
      var getUTMParams = () => {
        const currentUrl = window.location.href;
        const urlParams = new URLSearchParams(currentUrl.split("?")[1]);
        if (!localStorage.getItem("utm-params-insightiq")) {
          const utmParams = {
            utm_source: urlParams.has("utm_source") ? urlParams.get("utm_source") : "",
            utm_medium: urlParams.has("utm_medium") ? urlParams.get("utm_medium") : "",
            utm_campaign: urlParams.has("utm_campaign") ? urlParams.get("utm_campaign") : "",
            utm_term: urlParams.has("utm_term") ? urlParams.get("utm_term") : "",
            utm_content: urlParams.has("utm_content") ? urlParams.get("utm_content") : ""
          };
          localStorage.setItem("utm-params-insightiq", JSON.stringify(utmParams));
        } else {
          if (urlParams.has("utm_source") || urlParams.has("utm_medium") || urlParams.has("utm_campaign") || urlParams.has("utm_term") || urlParams.has("utm_content")) {
            const utmParams = {
              utm_source: urlParams.has("utm_source") ? urlParams.get("utm_source") : "",
              utm_medium: urlParams.has("utm_medium") ? urlParams.get("utm_medium") : "",
              utm_campaign: urlParams.has("utm_campaign") ? urlParams.get("utm_campaign") : "",
              utm_term: urlParams.has("utm_term") ? urlParams.get("utm_term") : "",
              utm_content: urlParams.has("utm_content") ? urlParams.get("utm_content") : ""
            };
            localStorage.setItem("utm-params-insightiq", JSON.stringify(utmParams));
          }
        }
      };
      var getEventTypeAsPerPageViewed = () => {
        const currentPath = window.location.pathname;
        const pathArr = currentPath.split("/");
        if (pathArr[1] === "")
          return "landing_page_viewed";
        return pathArr[1] + "_page_viewed";
      };
      function loadScriptSync(src) {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.type = "text/javascript";
          script.src = src;
          script.onload = resolve;
          script.onerror = reject;
          const s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(script, s);
        });
      }
      register((_0) => __async(exports, [_0], function* ({ analytics, browser, settings, init }) {
        analytics.subscribe("all_events", (event2) => {
          startTracking(event2).then(() => sendTracking(event2));
          console.log(`web pixel event ${init.data.customer.id}`);
        });
      }));
    }
  });

  // <stdin>
  var import_src = __toESM(require_src());
})();
