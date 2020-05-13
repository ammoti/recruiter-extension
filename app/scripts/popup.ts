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
//     else if (msg.answer === "Madame... Boconsty")
//       port.postMessage({ question: "I don't get it." });
//   });
// });
let profileInfo: any;
const setDOMInfo = (info: any) => {
  profileInfo = info;
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
      if (element.company.hasOwnProperty("date")) {
        item.textContent =
          element.company.name
            .replace("<!---->", "")
            // tslint:disable-next-line: quotemark
            .replace('<span class="pv-entity__secondary-title separator">', "")
            .replace("</span", "") +
          " - " +
          element.company.position;
        experiences.appendChild(item);
      } else {
        let position = "";
        if (element.company.hasOwnProperty("item")) {
          for (let i = 0; i < Object.keys(element.company.item).length; i++) {
            const subItem = element.company.item[i];
            position += subItem.title + " ";
          }
          item.textContent =
            element.company.name
              .replace("Company Name", "")
              .replace("<!---->", "")
              .replace(
                // tslint:disable-next-line: quotemark
                '<span class="pv-entity__secondary-title separator">',
                ""
              )
              .replace("</span>", "")
              .trim() +
            " - " +
            position;
          experiences.appendChild(item);
        } else {
          item.textContent =
            element.company.name
              .replace("<!---->", "")
              .replace(
                // tslint:disable-next-line: quotemark
                '<span class="pv-entity__secondary-title separator">',
                ""
              )
              .replace("</span>", "")
              .trim() + " - ";
          experiences.appendChild(item);
        }
      }
    }
  }
};
// Once the DOM is ready...
window.addEventListener("DOMContentLoaded", () => {
  const link = document.getElementById("exportCSV");
  // onClick's logic below:
  if (link) {
    link.addEventListener("click", function () {
      exportCSV();
    });
  }
  const addProfile = document.getElementById("addProfile");
  if (addProfile) {
    addProfile.addEventListener("click", function () {
      addLocal(profileInfo);
    });
  }
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
function exportCSV() {
  const downloadData = local.get("profileList");
  JSONToCSVConvertor([downloadData], "LinkedIn Profiles", "Profiles");
}

function JSONToCSVConvertor(JSONData: any, ReportTitle: any, ShowLabel: any) {
  console.log("JSONDATA", JSONData);
  const array = typeof JSONData !== "object" ? JSON.parse(JSONData) : JSONData;
  let str = "";
  let line = "";
  let skillsCount = 1;
  let experienceCount = 1;
  for (const key in array[0]) {
    line = "";
    experienceCount = 1;
    skillsCount = 1;
    for (const item in array[0][key]) {
      if (array[0][key].hasOwnProperty(item)) {
        const value = array[0][key][item];
        switch (item) {
          case "name":
            if (array[key] !== "") {
              let text: string = value;
              line += text
                .trim()
                .replace(/(\r\n|\n|\r)/gm, " ")
                .replace(/,/g, "");
            }
            break;
          case "about":
            if (array[key] !== "") {
              let text: string = value;
              line += text
                .trim()
                .replace(/(\r\n|\n|\r)/gm, " ")
                .replace(/,/g, "");
            }
            break;
          case "location":
            if (array[key] !== "") {
              let text: string = value;
              line += text
                .trim()
                .replace(/(\r\n|\n|\r)/gm, " ")
                .replace(/,/g, "");
            }
            break;
          case "title":
            if (array[key] !== "") {
              let text: string = value;
              line += text
                .trim()
                .replace(/(\r\n|\n|\r)/gm, " ")
                .replace(/,/g, "");
            }
            break;
          case "experiences":
            for (let exp = 0; exp < value.length; exp++) {
              const element = value[exp];
              if (element)
                line +=
                  element.company.name
                    .trim()
                    .replace(/(\r\n|\n|\r)/gm, " ")
                    .replace("Company Name", "")
                    .replace(/,/g, "")
                    .replace("<!---->", "") + "\n";
              line += ",,,,";
            }
            experienceCount = value.length;
            break;
          case "skills":
            for (let exp = 0; exp < value.length; exp++) {
              const element = value[exp];
              if (element) {
                line +=
                  element
                    .trim()
                    .replace(/(\r\n|\n|\r)/gm, " ")
                    .replace("Company Name", "")
                    .replace(/,/g, "")
                    .replace("<!---->", "") + "\n";
              }
              line += ",,,,,";
              skillsCount = value.length;
            }
            break;
          default:
            break;
        }
        line += ",";
      }
    }
    line.slice(0, line.length - 1);
    if (experienceCount < skillsCount) experienceCount = skillsCount;
    for (let b = 0; b < experienceCount; b++) {
      line += "\r\n";
    }
    str += line;
    line = "";
  }
  console.log("final", str);
  // Generate a file name
  let fileName = "MyReport_";
  // this will remove the blank-spaces from the title and replace it with an underscore
  fileName += ReportTitle.replace(/ /g, "_");

  // Initialize file format you want csv or xls
  const uri = "data:text/csv;charset=UTF-8," + escape(str);

  // Now the little tricky part.
  // you can use either>> window.open(uri);
  // but this will not work in some browsers
  // or you will not get the correct file extension

  // this trick will generate a temp <a /> tag
  let link = document.createElement("a");
  link.href = uri;

  // set the visibility hidden so it will not effect on your web-layout
  // link.style = "visibility:hidden";
  link.download = fileName + ".csv";

  // this part will append the anchor tag and remove it after automatic click
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function addLocal(info: any) {
  console.log("get item", local.get("profileList"));
  let profileList: string[] = local.get("profileList");
  profileList.push(info);
  local.set("profileList", profileList);
  console.log(profileList);
}
const local = (function () {
  const setData = function (key: any, obj: any) {
    const values = JSON.stringify(obj);
    localStorage.setItem(key, values);
  };

  const getData = function (key: any) {
    if (localStorage.getItem(key) != null) {
      return JSON.parse(localStorage.getItem(key) || "{}");
    } else {
      return false;
    }
  };

  const updateDate = function (key: any, newData: any) {
    if (localStorage.getItem(key) != null) {
      const oldData = JSON.parse(localStorage.getItem(key) || "{}");
      for (const keyObj in newData) {
        oldData[keyObj] = newData[keyObj];
      }
      const values = JSON.stringify(oldData);
      localStorage.setItem(key, values);
    } else {
      return false;
    }
    return false;
  };

  return { set: setData, get: getData, update: updateDate };
})();
