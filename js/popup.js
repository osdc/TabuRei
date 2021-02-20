function getCurrentWindowTabs() {
  return browser.tabs.query({ currentWindow: true });
}

function listTabs() {
  getCurrentWindowTabs().then((tabs) => {
    let tabsList = document.getElementById("tabs-list");
    let currentTabs = document.createDocumentFragment();
    for (let tab of tabs) {
      if (!tab.url.startsWith("about:")) {
        let tabElement = document.createElement("li");
        let tabLink = document.createElement("a");
        tabLink.href = tab.url;
        tabLink.innerText = tab.title;
        tabElement.appendChild(tabLink);
        currentTabs.appendChild(tabElement);
      }
    }

    tabsList.appendChild(currentTabs);
  });
}

function storeTabs(tabs) {
  const validTabs = tabs.filter((tab) => !tab.url.startsWith("about:"));

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

  let store = {
    [groupId]: storedTabs,
  };

  return browser.storage.local.set(store);
}

document.addEventListener("DOMContentLoaded", listTabs);
document.getElementById("collapse").addEventListener("click", function () {
  getCurrentWindowTabs().then((tabs) => {
    let storing = storeTabs(tabs);
    Promise.resolve(storing);

    let creating = browser.tabs.create({
      url: "index.html",
    });

    Promise.resolve(creating);

    for (let tab of tabs) {
      let removing = browser.tabs.remove(tab.id);
      Promise.resolve(removing);
    }
  });
});

document.getElementById("tab-manager").addEventListener("click", function () {
  let creating = browser.tabs.create({
    url: "index.html",
  });
  Promise.resolve(creating);
});
