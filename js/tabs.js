function getCurrentWindowTabs() {
  return browser.tabs.query({ currentWindow: true });
}

function listTabs() {
  getCurrentWindowTabs().then((tabs) => {
    let tabsList = document.getElementById("tabs-list");
    let currentTabs = document.createDocumentFragment();
    for (let tab of tabs) {
      let tabElement = document.createElement("li");
      let tabLink = document.createElement("a");
      tabLink.href = tab.url;
      tabLink.innerText = tab.title;
      tabElement.appendChild(tabLink);
      currentTabs.appendChild(tabElement);
    }

    tabsList.appendChild(currentTabs);
  });
}

function storeTabs(tabs) {
  const storedTabs = tabs.map((tab) => ({
    id: tab.id,
    title: tab.title,
    url: tab.url,
    cookieStoreId: tab.cookieStoreId,
  }));

  let n;
  browser.storage.local
    .get(null)
    .then((store) => {
      n = Object.keys(store).length;
      return n;
    })
    .then((len) => {
      let groupId = len + 1;
      let store = {
        [groupId]: storedTabs,
      };

      return browser.storage.local.set(store);
    });
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

    tabsList.appendChild(currentTabs);
  });
});

document.getElementById("tab-manager").addEventListener("click", function () {
  let creating = browser.tabs.create({
    url: "index.html",
  });
  Promise.resolve(creating);
});
