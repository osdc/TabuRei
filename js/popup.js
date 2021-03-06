let blacklist = [];

function getCurrentWindowTabs() {
  return browser.tabs.query({ currentWindow: true });
}

function isValidTab(tab) {
  if (!tab.url.startsWith("about:") && tab.title != "TabuRei") return true;
  return false;
}

function listTabs() {
  getCurrentWindowTabs().then((tabs) => {
    let tabsList = document.getElementById("tabs-list");
    let currentTabs = document.createDocumentFragment();
    for (let tab of tabs) {
      if (!tab.url.startsWith("about:")) {
        const tabContainer = document.createElement("div");
        tabContainer.classList.add("tab-container");
        let tabElement = document.createElement("label");
        tabElement.classList.add("popup-element-container");
        let tabTitle = document.createElement("span");
        tabTitle.innerText = tab.title;
        tabTitle.addEventListener("click", activateTab);
        tabContainer.setAttribute("tab-id", tab.id);
        let checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.addEventListener("click", removeTab);
        tabElement.appendChild(checkbox);
        let checkmark = document.createElement("span");
        checkmark.classList.add("checkmark");
        tabElement.appendChild(checkmark);
        tabContainer.appendChild(tabElement);
        tabContainer.appendChild(tabTitle);
        currentTabs.appendChild(tabContainer);
      }
    }

    tabsList.appendChild(currentTabs);
  });
}

function storeTabs(tabs, blacklistedTabs) {
  const validTabs = tabs.filter(
    (tab) => isValidTab(tab) && !blacklistedTabs.includes(tab.id)
  );

  let allowedProperties = [
    "url",
    "cookieStoreId",
    "openInReaderMode",
    "pinned",
  ];

  const storedTabs = validTabs.map((tab) => {
    return {
      url: tab.url,
      id: tab.id,
      title: tab.title,
      create: Object.keys(tab)
        .filter((key) => allowedProperties.includes(key))
        .reduce((obj, key) => {
          obj[key] = tab[key];
          return obj;
        }, {}),
    };
  });

  let groupId = performance.timeOrigin + performance.now();

  let groupInfo = {
    groupName: "",
    tabList: storedTabs,
  };

  let store = {
    [groupId]: groupInfo,
  };

  return browser.storage.local.set(store);
}

function onBtnClick(blackedlistedArray) {
  getCurrentWindowTabs().then((tabs) => {
    let storing = storeTabs(tabs, blackedlistedArray);
    Promise.resolve(storing);

    let creating = browser.tabs.create({
      url: "index.html",
    });

    Promise.resolve(creating);

    for (let tab of tabs) {
      if (!blackedlistedArray.includes(tab.id)) {
        let removing = browser.tabs.remove(tab.id);
        Promise.resolve(removing);
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", listTabs);

document
  .getElementById("collapse")
  .addEventListener("click", () => onBtnClick([]));

document
  .getElementById("collapse-unselected")
  .addEventListener("click", () => onBtnClick(blacklist));

document.getElementById("tab-manager").addEventListener("click", function () {
  let creating = browser.tabs.create({
    url: "index.html",
  });
  Promise.resolve(creating);
});

const removeTab = (e) => {
  const parent = e.target.parentElement.parentElement;
  const tabId = +parent.getAttribute("tab-id");
  const conditionalBtn = document.getElementById("collapse-unselected");
  if (e.target.checked) {
    blacklist.push(tabId);
    parent.classList.add("crossed");
    conditionalBtn.classList.remove("hidden-btn");
  } else {
    blacklist = blacklist.filter((id) => id != tabId);
    parent.classList.remove("crossed");
    if (blacklist.length === 0) {
      conditionalBtn.classList.add("hidden-btn");
    }
  }
};

const activateTab = (e) => {
  const tabId = +e.target.parentElement.getAttribute("tab-id");
  browser.tabs.update(tabId, { active: true });
};
