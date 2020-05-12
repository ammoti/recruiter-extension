// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

console.log(`'Allo 'Allo! Content script`);

chrome.runtime.sendMessage({
  from: "content",
  subject: "showPageAction",
});

// document.addEventListener("wheel", whellActivated);

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  // First, validate the message's structure.
  if (msg.from === "popup" && msg.subject === "DOMInfo") {
    // Collect the necessary data.
    // (For your specific requirements `document.querySelectorAll(...)`
    //  should be equivalent to jquery's `$(...)`.)
    const name = document.getElementsByClassName(
      "inline t-24 t-black t-normal break-words"
    )[0].innerHTML;
    const title = document.getElementsByClassName(
      "mt1 t-18 t-black t-normal break-words"
    )[0].innerHTML;
    const location = document.getElementsByClassName(
      "t-16 t-black t-normal inline-block"
    )[0].innerHTML;
    // let about = document.getElementsByClassName(
    //   "pv-about__summary-text mt4 t-14 ember-view"
    // )[0] as HTMLElement;
    // TODO: burası düzeltilecek innerHTML veya innerText lerin kontrolü şart func a bağlanabilinir.
    // if (!about) about = new HTMLElement();
    const imgUrl = document
      .getElementsByClassName(
        "pv-top-card__photo presence-entity__image EntityPhoto-circle-9 lazy-image ember-view"
      )[0]
      .getAttribute("src");
    const experience = document
      .getElementsByClassName(
        "pv-profile-section__section-info section-info"
      )[0]
      .getElementsByTagName("li");
    const skills = document.getElementsByClassName(
      "pv-skill-category-entity__name-text t-16 t-black t-bold"
    );
 
    const domInfo = {
      name: name,
      title: title,
      location: location,
      imgUrl: imgUrl,
      // about: about.innerText,
      experiences: processExp(experience),
      skills: processSkill(skills),
    };

    // Directly respond to the sender (popup),
    // through the specified callback.
    response(domInfo);
  }
});

function processExp(exp: HTMLCollectionOf<HTMLElement>) {
  let experiences: string[] = [];
  for (const key in exp) {
    if (exp.hasOwnProperty(key)) {
      const element = exp[key];
      const position = element.getElementsByClassName("t-16 t-black t-bold")[0]
        .innerHTML;
      const company = element.getElementsByClassName(
        "pv-entity__secondary-title t-14 t-black t-normal"
      )[0].innerHTML;
      const date = element.getElementsByClassName(
        "pv-entity__date-range t-14 t-black--light t-normal"
      )[0].innerHTML;
      const experienceDetail: any = {};
      if (position) experienceDetail.position = position;
      if (company) experienceDetail.company = company;
      if (date) experienceDetail.date = date;
      experiences.push(experienceDetail);
    }
  }
  console.log("experiences",experiences);
  return experiences;
}
function processSkill(exp: HTMLCollectionOf<Element>) {
  let skills: string[] = [];
  for (const key in exp) {
    if (exp.hasOwnProperty(key)) {
      const element = exp[key];
      skills.push(element.innerHTML);
    }
  }
  console.log("skill",skills);
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
      const skills = document.getElementsByClassName(
        "pv-profile-section__card-action-bar pv-skills-section__additional-skills"
      )[0] as HTMLElement;
      if (skills) {
        console.log(skills.innerText);
        if (skills.innerText.toLocaleLowerCase().search("more") !== -1)
          skills.click();
      }
      // chrome.runtime.sendMessage(
      //   {
      //     from: "content",
      //     subject: "changeBadge",
      //   },
      //   log
      // );
    }
  }
}
function log() {
  console.log("gitti");
}