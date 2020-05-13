// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

chrome.runtime.onInstalled.addListener((details) => {
  console.log("previousVersion", details.previousVersion);
  localStorage.setItem("profileList", "[]");
});

chrome.browserAction.setBadgeText({
  text: `'Not Yet'`,
});

console.log(`'Allo 'Allo! Event Page for Browser Action`);
chrome.runtime.onMessage.addListener((msg, sender) => {
  // First, validate the message's structure.
  if (msg.from === "content" && msg.subject === "showPageAction") {
    // Enable the page-action for the requesting tab.
    chrome.pageAction.show(sender.tab!.id!);
  }
});
// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   // sendResponse();  // if you uncomment this line, error will disappear...
//   // return true; // if you uncomment this line, error will also disappear (indicates async callback)
//   if (msg.from === "content" && msg.subject === "changeBadge") {
//     chrome.browserAction.setBadgeText({
//       text: `'Ready'`,
//     });
//     sendResponse();
//   }
// });
// function sendResponse() {
//   console.log("dinliyorum");
// }
// chrome.webNavigation.onHistoryStateUpdated.addListener(() => {
//   console.log("çalıştı");
//   chrome.browserAction.setBadgeText({
//     text: `'Not Yet'`,
//   });
// });
