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


function generate_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}


function storeTabs(tabs) {
  const storedTabs = tabs.map((tab) => ({
    id: tab.id,
    title: tab.title,
    url: tab.url,
    cookieStoreId: tab.cookieStoreId,
  }));

  let groupId = generate_UUID()

  let store = {
    [groupId]: storedTabs,
  };

  return browser.storage.local.set(store);
};

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
