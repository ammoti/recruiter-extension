let profileInfo: any;
const setDOMInfo = (info: any) => {
  profileInfo = info;
  const name = document.getElementById("name");
  const title = document.getElementById("title");
  const location = document.getElementById("location");
  const imgUrl = document.getElementById("imgUrl");
  const about = document.getElementById("about");
  const experiences = document.getElementById("experiences");
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
      const ok = document.getElementById("ok");
      if (ok) ok.style.visibility = "visible";
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
  const array = typeof JSONData !== "object" ? JSON.parse(JSONData) : JSONData;
  let str = "";
  let line = "";
  let skillsCount = 1;
  let experienceCount = 1;
  for (const key in array[0]) {
    line = "";
    experienceCount = 1;
    skillsCount = 1;
    let experienceLine = "";
    let skillLine = "";
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
            experienceLine = '"';
            for (let exp = 0; exp < value.length; exp++) {
              let expDetail = "";
              const element = value[exp];
              if (element) {
                if (element.company.name) expDetail += element.company.name;
                if (element.company.position)
                  expDetail +=
                    " " +
                    element.company.position
                      .replace(
                        '<span class=pv-entity__secondary-title separator">',
                        ""
                      )
                      .replace("</span>", "");
                if (element.company.date) {
                  expDetail +=
                    " " +
                    element.company.date
                      .replace(
                        '<span class="visually-hidden">Dates Employed</span>',
                        ""
                      )
                      .replace("<span>", "")
                      .replace("</span>", "");
                  console.log(`data`, element.company.date);
                }
              }
              experienceLine +=
                expDetail
                  .trim()
                  .replace(/(\r\n|\n|\r)/gm, " ")
                  .replace("Company Name", "")
                  .replace(/,/g, "")
                  .replace("<!---->", "") + "\r";
            }
            line += experienceLine + '"';
            experienceCount = value.length;
            break;
          case "skills":
            skillLine = '"';
            for (let exp = 0; exp < value.length; exp++) {
              const element = value[exp];
              if (element) {
                skillLine +=
                  element
                    .trim()
                    .replace(/(\r\n|\n|\r)/gm, " ")
                    .replace(/,/g, "")
                    .replace("<!---->", "") + "\r";
              }
            }
            line += skillLine + '"';
            skillsCount = value.length;
            break;
          default:
            break;
        }
        line += ",";
      }
    }
    line.slice(0, line.length - 1);
    line += "\r\n";
    str += line;
    line = "";
  }
  // Generate a file name
  let fileName = "MyReport_";
  // this will remove the blank-spaces from the title and replace it with an underscore
  fileName += ReportTitle.replace(/ /g, "_") + ".csv";
  downloadFile(str, fileName);
}
function addLocal(info: any) {
  let profileList: string[] = local.get("profileList");
  profileList.push(info);
  local.set("profileList", profileList);
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
function downloadFile(data: any, fileName: any) {
  const csvData = data;
  const blob = new Blob([csvData], {
    type: "application/csv;charset=utf-8;",
  });

  if (window.navigator.msSaveBlob) {
    // FOR IE BROWSER
    navigator.msSaveBlob(blob, fileName);
  } else {
    // FOR OTHER BROWSERS
    const link = document.createElement("a");
    const csvUrl = URL.createObjectURL(blob);
    link.href = csvUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
