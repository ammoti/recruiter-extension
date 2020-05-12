// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

console.log(`'Allo 'Allo! Popup`);
// Update the relevant fields with the new data.

// chrome.runtime.onConnect.addListener(function (port) {
//   console.assert(port.name === "knockknock");
//   port.onMessage.addListener(function (msg) {
//     if (msg.joke === "Knock knock")
//       port.postMessage({ question: "Who's there?" });
//     else if (msg.answer === "Madame")
//       port.postMessage({ question: "Madame who?" });
//     else if (msg.answer === "Madame... Bovary")
//       port.postMessage({ question: "I don't get it." });
//   });
// });

const setDOMInfo = (info: any) => {
  const name = document.getElementById("name");
  const title = document.getElementById("title");
  const location = document.getElementById("location");
  const imgUrl = document.getElementById("imgUrl");
  const about = document.getElementById("about");
  const experiences = document.getElementById("experiences");
  console.log("info", info);
  if (info.name && name) name.innerText = info.name;
  if (info.title && title) title.innerText = info.title;
  if (info.location && location) location.innerText = info.location;
  if (info.imgUrl && imgUrl) {
    imgUrl.setAttribute("src", info.imgUrl);
  }
  if (info.about && about) about.innerText = info.about;
  if (info.experiences && experiences) {
    for (let i = 0; i < info.experiences.length; i++) {
      const element = info.experiences[i];
      const item: Node = document.createElement("li");
      item.textContent = element.company.replace("<!---->", "");
      experiences.appendChild(item);
    }
  }
};

// Once the DOM is ready...
window.addEventListener("DOMContentLoaded", () => {
  // ...query for the active tab...
  console.log("loaded");
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      // ...and send a request for the DOM info...
      chrome.tabs.sendMessage(
        tabs[0].id!,
        { from: "popup", subject: "DOMInfo" },
        // ...also specifying a callback to be called
        //    from the receiving end (content script).
        setDOMInfo
      );
    }
  );
});
