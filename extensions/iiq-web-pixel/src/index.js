import { register } from "@shopify/web-pixels-extension";
import axios from "axios";


// import {register} from '@shopify/web-pixels-extension';


// const getEventTypeAsPerPageViewed = (windowObj, event) => {
//   const currentPath = windowObj.pathname;
//   const pathArr = currentPath.split("/");
// if (pathArr[1] === "") return "landing_page_viewed";
// return pathArr[1] + "_page_viewed";
//   return event.name
// };

const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
};

const sendTracking = async ({ event, fingerprint, demographics_info, device_metadata, utm_params, windowObj, documentObj, customerId }) => {
  console.log("Event Name", event.name, fingerprint, demographics_info, device_metadata, utm_params);

  // get current timestamp
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


register(async ({ analytics, browser, settings, init }) => {

  // subscribe to events
  analytics.subscribe('all_events', async (event) => {

    // get Data from local storage
    const fingerprint = await browser.localStorage.getItem("fingerprint-insightiq")
    let demographics_info = await browser.localStorage.getItem("demographics-info-insightiq")
    let device_metadata = await browser.localStorage.getItem("device-metadata-insightiq")
    let utm_params = await browser.localStorage.getItem("utm-params-insightiq")
    const windowObj = event.context.window.location;
    const documentObj = event.context.document;
    const customerId = init.data?.customer?.id;


    demographics_info = JSON.parse(demographics_info)
    utm_params = JSON.parse(utm_params)
    device_metadata = JSON.parse(device_metadata)


    if (
      fingerprint && demographics_info && device_metadata && utm_params
    ) sendTracking({ event, fingerprint, demographics_info, device_metadata, utm_params, windowObj, documentObj, customerId })

  });
});



// function loadScriptSync(src) {
//   return new Promise((resolve, reject) => {
//     const script = document.createElement("script");
//     script.type = "text/javascript";
//     script.src = src;

//     script.onload = resolve;
//     script.onerror = reject;

//     const s = document.getElementsByTagName("script")[0];
//     s.parentNode.insertBefore(script, s);
//   });
// }


// const startTracking = (event) => {
//   console.log('Tracking Script execution start')
//   verifyScript(event);
//   generateFingerprint(event);
//   generateUUID(event);
//   getDemographicsInfo(event);
//   getDeviceMetadata(event);
//   getUTMParams(event);
//   return new Promise((resolve, reject) => {
//     if (
//       localStorage.getItem("fingerprint-insightiq") &&
//       sessionStorage.getItem("sessionid-insightiq") &&
//       localStorage.getItem("demographics-info-insightiq") &&
//       localStorage.getItem("device-metadata-insightiq") &&
//       localStorage.getItem("utm-params-insightiq")
//     )
//       resolve();
//   });
// };
// const verifyScript = (event) => {
//   console.log("event",event);
//   const {window} = event.context
//   const url = new URL(window.location.href);
//   const searchParams = new URLSearchParams(url.search);
//   const queryParams = Object.fromEntries(searchParams);
//   // if (queryParams["pixel_verify"]) {
//   //   alert("Script is installed. Click 'OK' to close the window.");
//   //   if (window.opener === null || window.opener === "undefined") window.close();
//   //   window.close();
//   // }
// };
// const generateFingerprint = () => {
//   const {window} = event.context
//   if (!localStorage.getItem("fingerprint-insightiq")) {
//     (function () {
//       window._fmOpt = {
//         success: function (result) {
//           localStorage.setItem("fingerprint-insightiq", result.device_id);
//           return result.device_id;
//         },
//       };

//       // Installing fingerprint CDN
//       var fm = document.createElement("script");
//       fm.type = "text/javascript";
//       fm.async = false;
//       fm.src = "https://cdn.jsdelivr.net/npm/@trustdevicejs/trustdevice-js@1.0.0/dist/fm.min.js";
//       var s = document.getElementsByTagName("script")[0];
//       s.parentNode.insertBefore(fm, s);
//     })();
//   }
// };

// const generateUUID = () => {
//   if (!sessionStorage.getItem("sessionid-insightiq")) {
//     const sessionId = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
//       var r = (Math.random() * 16) | 0,
//         v = c === "x" ? r : (r & 0x3) | 0x8;
//       return v.toString(16);
//     });
//     sessionStorage.setItem("sessionid-insightiq", sessionId);
//   }
// };

// const getDemographicsInfo = async () => {
//   if (!localStorage.getItem("demographics-info-insightiq")) {
//     const response = await fetch("https://hutils.loxal.net/whois");

//     const data = await response.json();
//     const { ip, city, country } = data;
//     const language = window.navigator.language;
//     const demographicsInfo = {
//       ip_address: ip,
//       city: city,
//       country: country,
//       languages: language,
//     };
//     localStorage.setItem("demographics-info-insightiq", JSON.stringify(demographicsInfo));
//   }
// };

// const getDeviceMetadata = async () => {
//   try {
//     await loadScriptSync("https://cdnjs.cloudflare.com/ajax/libs/platform/1.3.5/platform.min.js");
//     // Your code that depends on the CDN script being loaded goes here
//     if (!localStorage.getItem("device-metadata-insightiq")) {
//       const { userAgent } = window.navigator;
//       const {
//         product,
//         manufacturer,
//         os: { family: deviceOs },
//         os: { version: deviceOsVersion },
//       } = platform;
//       const { name: browser, version: browserVersion } = platform.parse(userAgent);
//       const width = window.screen.width;
//       const height = window.screen.height;

//       const deviceMetadata = {
//         device: product,
//         operating_system: deviceOs,
//         browser: browser,
//         screen_size: `${width}x${height}`,
//       };
//       localStorage.setItem("device-metadata-insightiq", JSON.stringify(deviceMetadata));
//     }
//   } catch (error) {
//     console.error("Error loading CDN script:", error);
//   }
// };

// const getUTMParams = () => {
//   const currentUrl = window.location.href;
//   const urlParams = new URLSearchParams(currentUrl.split("?")[1]);

//   if (!localStorage.getItem("utm-params-insightiq")) {
//     const utmParams = {
//       utm_source: urlParams.has("utm_source") ? urlParams.get("utm_source") : "",
//       utm_medium: urlParams.has("utm_medium") ? urlParams.get("utm_medium") : "",
//       utm_campaign: urlParams.has("utm_campaign") ? urlParams.get("utm_campaign") : "",
//       utm_term: urlParams.has("utm_term") ? urlParams.get("utm_term") : "",
//       utm_content: urlParams.has("utm_content") ? urlParams.get("utm_content") : "",
//     };
//     localStorage.setItem("utm-params-insightiq", JSON.stringify(utmParams));
//   } else {
//     // This is to ensure that the new UTM params gets updated if newer URL params comes
//     if (
//       urlParams.has("utm_source") ||
//       urlParams.has("utm_medium") ||
//       urlParams.has("utm_campaign") ||
//       urlParams.has("utm_term") ||
//       urlParams.has("utm_content")
//     ) {
//       const utmParams = {
//         utm_source: urlParams.has("utm_source") ? urlParams.get("utm_source") : "",
//         utm_medium: urlParams.has("utm_medium") ? urlParams.get("utm_medium") : "",
//         utm_campaign: urlParams.has("utm_campaign") ? urlParams.get("utm_campaign") : "",
//         utm_term: urlParams.has("utm_term") ? urlParams.get("utm_term") : "",
//         utm_content: urlParams.has("utm_content") ? urlParams.get("utm_content") : "",
//       };
//       localStorage.setItem("utm-params-insightiq", JSON.stringify(utmParams));
//     }
//   }
// };




//event object
// {
//   "id": "sh-c817767a-2AE9-4EA6-CD38-B6B34AD5D272",
//   "name": "page_viewed",
//   "clientId": "9d374981-753b-462f-ba9d-d026a42b0fdf",
//   "timestamp": "2023-09-24T16:48:13.518Z",
//   "context": {
//     "document": {
//       "location": {
//         "href": "https://quickstart-5b8f5392.myshopify.com/checkouts/cn/c1-313a8c1e2e1747567896bad0fdf45d7f/information",
//         "hash": "",
//         "host": "quickstart-5b8f5392.myshopify.com",
//         "hostname": "quickstart-5b8f5392.myshopify.com",
//         "origin": "https://quickstart-5b8f5392.myshopify.com",
//         "pathname": "/checkouts/cn/c1-313a8c1e2e1747567896bad0fdf45d7f/information",
//         "port": "",
//         "protocol": "https:",
//         "search": ""
//       },
//       "referrer": "https://quickstart-5b8f5392.myshopify.com/cart",
//       "characterSet": "UTF-8",
//       "title": "Information - Quickstart (5b8f5392) - Checkout"
//     },
//     "navigator": {
//       "language": "en-GB",
//       "cookieEnabled": true,
//       "languages": [
//         "en-GB",
//         "en-US",
//         "en"
//       ],
//       "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
//     },
//     "window": {
//       "innerHeight": 889,
//       "innerWidth": 823,
//       "outerHeight": 1006,
//       "outerWidth": 1728,
//       "pageXOffset": 0,
//       "pageYOffset": 0,
//       "location": {
//         "href": "https://quickstart-5b8f5392.myshopify.com/checkouts/cn/c1-313a8c1e2e1747567896bad0fdf45d7f/information",
//         "hash": "",
//         "host": "quickstart-5b8f5392.myshopify.com",
//         "hostname": "quickstart-5b8f5392.myshopify.com",
//         "origin": "https://quickstart-5b8f5392.myshopify.com",
//         "pathname": "/checkouts/cn/c1-313a8c1e2e1747567896bad0fdf45d7f/information",
//         "port": "",
//         "protocol": "https:",
//         "search": ""
//       },
//       "origin": "https://quickstart-5b8f5392.myshopify.com",
//       "screenX": 0,
//       "screenY": 38,
//       "scrollX": 0,
//       "scrollY": 0
//     }
//   }
// }


//INIT Object
// {
//   "context": {
//     "document": {
//       "location": {
//         "href": "https://quickstart-5b8f5392.myshopify.com/checkouts/cn/c1-313a8c1e2e1747567896bad0fdf45d7f/information",
//         "hash": "",
//         "host": "quickstart-5b8f5392.myshopify.com",
//         "hostname": "quickstart-5b8f5392.myshopify.com",
//         "origin": "https://quickstart-5b8f5392.myshopify.com",
//         "pathname": "/checkouts/cn/c1-313a8c1e2e1747567896bad0fdf45d7f/information",
//         "port": "",
//         "protocol": "https:",
//         "search": ""
//       },
//       "referrer": "https://quickstart-5b8f5392.myshopify.com/account/register?checkout_url=https%3A%2F%2Fquickstart-5b8f5392.myshopify.com%2Fcheckouts%2Fcn%2Fc1-313a8c1e2e1747567896bad0fdf45d7f",
//       "characterSet": "UTF-8",
//       "title": "Information - Quickstart (5b8f5392) - Checkout"
//     },
//     "navigator": {
//       "language": "en-GB",
//       "cookieEnabled": true,
//       "languages": [
//         "en-GB",
//         "en-US",
//         "en"
//       ],
//       "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
//     },
//     "window": {
//       "innerHeight": 889,
//       "innerWidth": 812,
//       "outerHeight": 1006,
//       "outerWidth": 1728,
//       "pageXOffset": 0,
//       "pageYOffset": 0,
//       "location": {
//         "href": "https://quickstart-5b8f5392.myshopify.com/checkouts/cn/c1-313a8c1e2e1747567896bad0fdf45d7f/information",
//         "hash": "",
//         "host": "quickstart-5b8f5392.myshopify.com",
//         "hostname": "quickstart-5b8f5392.myshopify.com",
//         "origin": "https://quickstart-5b8f5392.myshopify.com",
//         "pathname": "/checkouts/cn/c1-313a8c1e2e1747567896bad0fdf45d7f/information",
//         "port": "",
//         "protocol": "https:",
//         "search": ""
//       },
//       "origin": "https://quickstart-5b8f5392.myshopify.com",
//       "screenX": 0,
//       "screenY": 38,
//       "scrollX": 0,
//       "scrollY": 0
//     }
//   },
//   "data": {
//     "customer": {
//       "email": "shivaniprk4@gmail.com",
//       "firstName": "Neha",
//       "id": "7249780670782",
//       "lastName": "Pareek"
//     },
//     "cart": {
//       "cost": {
//         "totalAmount": {
//           "amount": 729.95,
//           "currencyCode": "INR"
//         }
//       },
//       "lines": [
//         {
//           "discountAllocations": [],
//           "id": "46834889851198",
//           "quantity": 1,
//           "title": "The Multi-location Snowboard",
//           "variant": {
//             "id": "46834889851198",
//             "image": {
//               "src": "https://cdn.shopify.com/s/files/1/0816/4701/0110/products/Main_0a4e9096-021a-4c1e-8750-24b233166a12_64x64.jpg?v=1693226560"
//             },
//             "price": {
//               "amount": 729.95,
//               "currencyCode": "INR"
//             },
//             "product": {
//               "id": "9767870333246",
//               "title": "The Multi-location Snowboard",
//               "vendor": "Quickstart (5b8f5392)",
//               "type": "",
//               "untranslatedTitle": "The Multi-location Snowboard"
//             }
//           }
//         }
//       ],
//       "totalQuantity": 1
//     }
//   }
// }