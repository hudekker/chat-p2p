let myDropdown = document.querySelector("#btn-dropdown");
let dropdownId;
let sendReceivers = [];

document.querySelector("#input-msg").addEventListener("keyup", (evt) => {
  if (evt.key !== "Enter") return;
  sendMsg.click();
  evt.preventDefault();
});

// Display message to screen
const displayMsg = (msg, partnerId, boolMe = true) => {
  let msgHead = document.querySelector("#msg-head");

  let dateString = getMyDateStamp(new Date());
  let tagClassname = boolMe ? "tag-me" : "tag-you";
  let tagText = boolMe ? "" : "";
  // let tagText = boolMe ? 'To ' : 'From ';
  let bubble = boolMe ? "msg-me d-inline-flex" : "msg-you d-inline-flex";
  let flowDir = boolMe ? "flex-row-reverse" : "flex-row";
  // msgHead.innerHTML += `<p class="${tagClassname}">${tagText} ${partnerId}</p>`
  msgHead.innerHTML += `<div class="d-flex ${flowDir}">
                              <p class="${tagClassname} mx-1">${tagText} ${partnerId} ${dateString}</p>
                          </div>`;
  msgHead.innerHTML += `<div class="d-flex ${flowDir}">
                              <p class="${bubble} shadow-lg rounded-pill py-1 px-4">${msg}</p>
                          </div>`;
  msgHead.scrollTop = msgHead.scrollHeight;
};

const addToDropdown = (conn) => {
  let ul = document.querySelector("#ul-dropdown");
  ul.innerHTML += `<li><a class="dropdown-item" href="#" data-id="${conn.peer}">${conn.peer}</a></li>`;
  if (document.querySelector("#btn-dropdown").innerText.trim() == "Choose receiver") {
    document.querySelector("#btn-dropdown").innerText = conn.peer;
    sendReceivers = [];
    sendReceivers.push(conn.peer);
  }
};

myDropdown.addEventListener("hide.bs.dropdown", function (evt) {
  if (evt.clickEvent && evt.clickEvent.target) {
    let dropdownId = evt.clickEvent.target.dataset.id;

    if (dropdownId == undefined) {
      return false;
    }

    document.querySelector("#btn-dropdown").innerText = dropdownId;

    sendReceivers = [];

    if (dropdownId == "All") {
      let list = [...document.querySelector("#ul-dropdown").querySelectorAll("a")].map((el) => el.dataset.id).filter((el) => el != "All");
      sendReceivers = [...list];
    } else {
      sendReceivers.push(dropdownId);
    }
  }
});
