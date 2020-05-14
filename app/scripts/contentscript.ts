// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

chrome.runtime.sendMessage({
  from: "content",
  subject: "showPageAction",
});
// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  // First, validate the message's structure.
  if (msg.from === "popup" && msg.subject === "DOMInfo") {
    // Collect the necessary data.
    // (For your specific requirements `document.querySelectorAll(...)`
    //  should be equivalent to jquery's `$(...)`.)
    let name = checkInfoExist(
      document.getElementsByClassName(
        "inline t-24 t-black t-normal break-words"
      )[0],
      true
    );
    let title = checkInfoExist(
      document.getElementsByClassName(
        "mt1 t-18 t-black t-normal break-words"
      )[0],
      true
    );
    let location = checkInfoExist(
      document.getElementsByClassName("t-16 t-black t-normal inline-block")[0],
      true
    );
    let about =
      document.getElementsByClassName(
        "pv-about__summary-text mt4 t-14 ember-view"
      ).length === 0
        ? "Not information"
        : checkInfoExist(
            document.getElementsByClassName(
              "pv-about__summary-text mt4 t-14 ember-view"
            )[0],
            false
          );

    // TODO: burası düzeltilecek innerHTML veya innerText lerin kontrolü şart func a bağlanabilinir.
    // let imgUrl = document
    //   .getElementsByClassName(
    //     "pv-top-card__photo presence-entity__image EntityPhoto-circle-9 lazy-image ember-view"
    //   )[0]
    //   .getAttribute("src");
    // console.log("imgurl", imgUrl);
    // if (imgUrl) imgUrl = "";
    let experience = document
      .getElementsByClassName(
        "pv-profile-section__section-info section-info"
      )[0]
      .getElementsByClassName(
        "pv-entity__position-group-pager pv-profile-section__list-item ember-view"
      );
    // if(!experience) experience = "" as HTMLCollectionOf<HTMLElement>();
    const skills = document.getElementsByClassName(
      "pv-skill-category-entity__name-text t-16 t-black t-bold"
    );
    const expInfo = processExp(experience);
    const domInfo = {
      name: name?.trim(),
      title: title?.trim(),
      location: location?.trim(),
      about: about?.trim(),
      experiences: expInfo,
      skills: processSkill(skills),
    };
    // Directly respond to the sender (popup),
    // through the specified callback.
    console.log("dom inf", domInfo);
    response(domInfo);
  }
});

function processExp(exp: HTMLCollectionOf<Element>) {
  let experiences: string[] = [];
  for (const key in exp) {
    if (exp.hasOwnProperty(key)) {
      const element = exp[key];
      if (
        element.getElementsByClassName("pv-entity__position-group mt2").length >
        0
      ) {
        const company = checkInfoExist(
          element.getElementsByClassName("t-16 t-black t-bold")[0],
          false
        );
        const experienceDetail: any = {};
        if (company) {
          experienceDetail.company = {
            name: company
              .trim()
              .replace(/(\r\n|\n|\r)/gm, " ")
              .replace(
                '<span class="pv-entity__secondary-title separator">',
                "-"
              )
              .replace("</span>", ""),
            item: {},
          };
          const subPosition = element.getElementsByTagName("li");
          for (const subKey in subPosition) {
            const positionDetail: any = {};
            if (subPosition.hasOwnProperty(subKey)) {
              const title = subPosition[subKey]
                .getElementsByTagName("h3")[0]
                .innerText.replace("Title", "")
                .trim();
              if (title) positionDetail.title = title;
              const duration = subPosition[subKey]
                .getElementsByTagName("h4")[0]
                .innerText.replace("Dates Employed", "")
                .trim();
              if (duration) positionDetail.duration = duration;
              experienceDetail.company.item[subKey] = positionDetail;
            }
          }
        }
        experiences.push(experienceDetail);
      } else {
        const position = checkInfoExist(
          element.getElementsByClassName("t-16 t-black t-bold")[0],
          true
        );
        const company = checkInfoExist(
          element.getElementsByClassName(
            "pv-entity__secondary-title t-14 t-black t-normal"
          )[0],
          true
        );
        const date = checkInfoExist(
          element.getElementsByClassName(
            "pv-entity__date-range t-14 t-black--light t-normal"
          )[0],
          true
        );
        const experienceDetail: any = {};
        if (company)
          experienceDetail.company = {
            name: company
              .trim()
              .replace(/(\r\n|\n|\r)/gm, " ")
              .replace("</span>", "")
              .replace(
                '<span class="pv-entity__secondary-title separator">',
                "-"
              )
              .replace("</span>", ""),
          };
        if (position) experienceDetail.company.position = position;
        if (date) experienceDetail.company.date = date;
        console.log("detail", experienceDetail);
        experiences.push(experienceDetail);
      }
    }
  }
  return experiences;
}
function processSkill(exp: HTMLCollectionOf<Element>) {
  let skills: string[] = [];
  for (const key in exp) {
    if (exp.hasOwnProperty(key)) {
      const element = exp[key];
      skills.push(checkInfoExist(element, true)!.trim());
    }
  }
  return skills;
}
let isExpanded = false;
document.onscroll = whellActivated;
function whellActivated() {
  if (!isExpanded) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      console.log("you're at the bottom of the page");

      // show loading spinner and make fetch request to api
      const moreExperiences = document.getElementsByClassName(
        "pv-profile-section__see-more-inline pv-profile-section__text-truncate-toggle link link-without-hover-state"
      )[0] as HTMLElement;
      if (moreExperiences) {
        moreExperiences.click();
      }
      document.getElementById("line-clamp-show-more-button")?.click();
      const skills = document.getElementsByClassName(
        "pv-profile-section__card-action-bar pv-skills-section__additional-skills"
      )[0] as HTMLElement;
      if (skills) {
        if (skills.innerText.toLocaleLowerCase().search("more") !== -1)
          skills.click();
      }
      chrome.runtime.sendMessage(
        {
          from: "content",
          subject: "changeBadge",
        },
        log
      );
    }
  }
}
function log() {
  console.log("gitti");
}
function checkInfoExist(htmlParam: Element, isHTML: boolean) {
  if (htmlParam === undefined) return "Not Information";
  if (isHTML) return htmlParam.innerHTML;
  return htmlParam.textContent;
}
