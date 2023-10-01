// console.log("Welcome to tracking script.js");

// const fingerprint = () => {
//     console.log("Welcome to tracking script1.js");
//     return import('https://openfpcdn.io/fingerprintjs/v4')
//     .then(FingerprintJS => FingerprintJS.load())

//   // Get the visitor identifier when you need it.
//   fpPromise
//     .then(fp => fp.get())
//     .then(result => {
//       // This is the visitor identifier:
//       return result;
//     //   const visitorId = result.visitorId
//     //   console.log(visitorId)
//     })
//     console.log("Welcome to tracking script1.js");
//     return import('https://openfpcdn.io/fingerprintjs/v4')
//         .then(FingerprintJS => FingerprintJS.load())
//         .then(fp => {
//         // Get the visitor identifier when you need it.
//         return fp.get().then(result => {
//             // This is the visitor identifier:
//             return result;
//         });
//         }); 
// }

// const callApi = (dataReceived) => {
//     console.log("Welcome to tracking script2.js");
//     var data = JSON.stringify({
//         urlPath: dataReceived,
//         timestamp: Date.now(),
//     });

//     var xhr = new XMLHttpRequest();
//     xhr.withCredentials = true;


//     xhr.open("POST", "/apps/measure/", true);
//     xhr.timeout = 1000;
//     xhr.setRequestHeader("Content-Type", "application/json");
//     xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age-0");
//     xhr.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
//     xhr.setRequestHeader("Pragma", "no-cache");
//     console.log("Welcome to tracking script3.js");
//     xhr.send(data)



    
// };
// // fingerprintValue = fingerprint()
// // callApi({hello: "Gaurav", fingerprint: fingerprintValue})

// fingerprint()
//   .then(fingerprintValue => {
//     console.log("Welcome to tracking script4.js");
//     callApi({ hello: "Gaurav", fingerprint: fingerprintValue });
//   })
//   .catch(error => {
//     console.log("Welcome to tracking script5.js");
//     console.error("Error:", error);
//   });


const startTracking = () => {
    console.log('Tracking Script execution start')
    verifyScript();
    generateFingerprint();
    generateUUID();
    getDemographicsInfo();
    getDeviceMetadata();
    getUTMParams();
    return new Promise((resolve, reject) => {
      if (
        localStorage.getItem("fingerprint-insightiq") &&
        sessionStorage.getItem("sessionid-insightiq") &&
        localStorage.getItem("demographics-info-insightiq") &&
        localStorage.getItem("device-metadata-insightiq") &&
        localStorage.getItem("utm-params-insightiq")
      )
        resolve();
    });
  };

  const sendTracking = async ({ event, fingerprint, demographics_info, device_metadata, utm_params, windowObj, documentObj, customerId }) => {
  console.log("Event Name", event.name, fingerprint, demographics_info, device_metadata, utm_params);
  const currentTimestampMilliseconds = new Date().getTime();
    const currentTimestampSeconds = Math.floor(currentTimestampMilliseconds / 1000);
    console.log(currentTimestampSeconds);
  try {
    const baseUrl = "https://api4.dev.insightiq.ai/v1/store-management/stores/shopify/pixel/events"
    const url = new URL(`${baseUrl}`);
    !isEmpty(windowObj) && url.searchParams.append("shop", windowObj.origin);
    !isEmpty(customerId) && url.searchParams.append("logged_in_customer_id", customerId);
    !isEmpty(event) && url.searchParams.append("timestamp", currentTimestampSeconds);
     
    const payload = {
    fingerprint,
    user_session_id: event?.clientId,
    demographics_info,
    device_metadata,
    utm_params,
    events: [
        {
            event_type: event.name,
            page_info: {
                current_page: windowObj.href,
                referrer: documentObj.referrer,
            },
            event_data: event
        }
    ]
}

    const response = await axios.post(url.href, payload);
    console.log("response", response)
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log(responseData);
  } catch (error) {
    console.error("Error:", error);
  }
};
  // const sendTracking = async () => {
  //   console.log("tracking script called");
  //   try {
  //     const response = await fetch("/apps/measure", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         fingerprint: localStorage.getItem("fingerprint-insightiq"),
  //         user_session_id: sessionStorage.getItem("sessionid-insightiq"),
  //         demographics_info: JSON.parse(localStorage.getItem("demographics-info-insightiq")),
  //         device_metadata: JSON.parse(localStorage.getItem("device-metadata-insightiq")),
  //         utm_params: JSON.parse(localStorage.getItem("utm-params-insightiq")),
  //         events: [
  //           {
  //             event_type: getEventTypeAsPerPageViewed(),
  //             page_info: {
  //               current_page: window.location.href,
  //               referrer: document.referrer,
  //             },
  //           },
  //         ],
  //       }),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  
  //     const responseData = await response.json();
  //     console.log(responseData);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };
  
  const verifyScript = () => {
    const url = new URL(window.location);
    const searchParams = new URLSearchParams(url.search);
    const queryParams = Object.fromEntries(searchParams);
    if (queryParams["pixel_verify"]) {
      alert("Script is installed. Click 'OK' to close the window.");
      if (window.opener === null || window.opener === "undefined") window.close();
      window.close();
    }
  };
  
  const generateFingerprint = () => {
    if (!localStorage.getItem("fingerprint-insightiq")) {
      (function () {
        window._fmOpt = {
          success: function (result) {
            localStorage.setItem("fingerprint-insightiq", result.device_id);
            return result.device_id;
          },
        };
  
        // Installing fingerprint CDN
        var fm = document.createElement("script");
        fm.type = "text/javascript";
        fm.async = false;
        fm.src = "https://cdn.jsdelivr.net/npm/@trustdevicejs/trustdevice-js@1.0.0/dist/fm.min.js";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(fm, s);
      })();
    }
  };
  
  const generateUUID = () => {
    if (!sessionStorage.getItem("sessionid-insightiq")) {
      const sessionId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      sessionStorage.setItem("sessionid-insightiq", sessionId);
    }
  };
  
  const getDemographicsInfo = async () => {
    if (!localStorage.getItem("demographics-info-insightiq")) {
      const response = await fetch("https://hutils.loxal.net/whois");
  
      const data = await response.json();
      const { ip, city, country } = data;
      const language = window.navigator.language;
      const demographicsInfo = {
        ip_address: ip,
        city: city,
        country: country,
        languages: language,
      };
      localStorage.setItem("demographics-info-insightiq", JSON.stringify(demographicsInfo));
    }
  };
  
  const getDeviceMetadata = async () => {
    try {
      await loadScriptSync("https://cdnjs.cloudflare.com/ajax/libs/platform/1.3.5/platform.min.js");
      // Your code that depends on the CDN script being loaded goes here
      if (!localStorage.getItem("device-metadata-insightiq")) {
        const { userAgent } = window.navigator;
        const {
          product,
          manufacturer,
          os: { family: deviceOs },
          os: { version: deviceOsVersion },
        } = platform;
        const { name: browser, version: browserVersion } = platform.parse(userAgent);
        const width = window.screen.width;
        const height = window.screen.height;
  
        const deviceMetadata = {
          device: product,
          operating_system: deviceOs,
          browser: browser,
          screen_size: `${width}x${height}`,
        };
        localStorage.setItem("device-metadata-insightiq", JSON.stringify(deviceMetadata));
      }
    } catch (error) {
      console.error("Error loading CDN script:", error);
    }
  };
  
  const getUTMParams = () => {
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(currentUrl.split("?")[1]);
  
    if (!localStorage.getItem("utm-params-insightiq")) {
      const utmParams = {
        utm_source: urlParams.has("utm_source") ? urlParams.get("utm_source") : "",
        utm_medium: urlParams.has("utm_medium") ? urlParams.get("utm_medium") : "",
        utm_campaign: urlParams.has("utm_campaign") ? urlParams.get("utm_campaign") : "",
        utm_term: urlParams.has("utm_term") ? urlParams.get("utm_term") : "",
        utm_content: urlParams.has("utm_content") ? urlParams.get("utm_content") : "",
      };
      localStorage.setItem("utm-params-insightiq", JSON.stringify(utmParams));
    } else {
      // This is to ensure that the new UTM params gets updated if newer URL params comes
      if (
        urlParams.has("utm_source") ||
        urlParams.has("utm_medium") ||
        urlParams.has("utm_campaign") ||
        urlParams.has("utm_term") ||
        urlParams.has("utm_content")
      ) {
        const utmParams = {
          utm_source: urlParams.has("utm_source") ? urlParams.get("utm_source") : "",
          utm_medium: urlParams.has("utm_medium") ? urlParams.get("utm_medium") : "",
          utm_campaign: urlParams.has("utm_campaign") ? urlParams.get("utm_campaign") : "",
          utm_term: urlParams.has("utm_term") ? urlParams.get("utm_term") : "",
          utm_content: urlParams.has("utm_content") ? urlParams.get("utm_content") : "",
        };
        localStorage.setItem("utm-params-insightiq", JSON.stringify(utmParams));
      }
    }
  };
  
  const getEventTypeAsPerPageViewed = () => {
    const currentPath = window.location.pathname;
    const pathArr = currentPath.split("/");
    if (pathArr[1] === "") return "landing_page_viewed";
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
  startTracking().then(() => sendTracking());