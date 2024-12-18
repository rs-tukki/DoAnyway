const redirectUrlInput = document.getElementById("redirect-url");
const saveUrlButton = document.getElementById("save-url");
const redirectCountSpan = document.getElementById("redirect-count");
const totalTimeSpan = document.getElementById("total-time");
const resetStatsButton = document.getElementById("reset-stats");

chrome.storage.local.get(["redirectUrl", "redirectCount", "totalTimeSpent"], (data) => {
  redirectUrlInput.value = data.redirectUrl || "https://www.youtube.com/watch?v=JV3KOJ_Z4Vs";
  redirectCountSpan.textContent = data.redirectCount || 0;
  totalTimeSpan.textContent = data.totalTimeSpent || 0;
});

saveUrlButton.addEventListener("click", () => {
  const newUrl = redirectUrlInput.value;
  chrome.storage.local.set({ redirectUrl: newUrl }, () => {
    alert("URLを更新しました。");
  });
});

resetStatsButton.addEventListener("click", () => {
  const defaultUrl = "https://www.youtube.com/watch?v=JV3KOJ_Z4Vs";
  chrome.storage.local.set({ redirectUrl: defaultUrl, redirectCount: 0, totalTimeSpent: 0 }, () => {
    redirectUrlInput.value = defaultUrl;
    redirectCountSpan.textContent = "0";
    totalTimeSpan.textContent = "0";
    alert("データを初期化しました。");
  });
});