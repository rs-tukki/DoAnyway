let redirectUrl = "";
let redirectCount = 0;
let totalTimeSpent = 0;
let startTime = null;
let intervalId = null;
const defaultRedirectUrl = "https://www.youtube.com/watch?v=JV3KOJ_Z4Vs";

  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
      redirectUrl: defaultRedirectUrl,
      redirectCount: 0,
      totalTimeSpent: 0
    }, () => {
      redirectUrl = defaultRedirectUrl;
    });
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url.startsWith("http")) {
      chrome.storage.local.get("redirectUrl", (data) => {
        const currentRedirectUrl = data.redirectUrl || defaultRedirectUrl;
        if (tab.url !== currentRedirectUrl) {
          chrome.tabs.update(tabId, { url: currentRedirectUrl });
          redirectCount++;
          chrome.storage.local.set({ redirectCount });
          startTime = Date.now();
          startInterval();
        }
      });
    }
  });

  chrome.tabs.onActivated.addListener(() => {
    if (startTime) {
      recordElapsedTime();
      stopInterval();
    }
  });
  
  chrome.tabs.onRemoved.addListener(() => {
    if (startTime) {
      recordElapsedTime();
      stopInterval();
    }
  });
  
  function recordElapsedTime() {
    if (startTime) {
      const elapsedTime = (Date.now() - startTime) / 1000;
      totalTimeSpent += elapsedTime;
      chrome.storage.local.set({ totalTimeSpent });
      startTime = null;
    }
  }
  
  function startInterval() {
    if (!intervalId) {
      intervalId = setInterval(() => {
        recordElapsedTime();
        startTime = Date.now();
      }, 1000);
    }
  }
  
  function stopInterval() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }