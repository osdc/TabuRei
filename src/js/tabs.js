let tabList = [];
let store;

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
  }));

  store = {
    storedTabs,
  };

  return browser.storage.local.set(store);
}

document.addEventListener("DOMContentLoaded", listTabs);
document.getElementById("remove").addEventListener("click", function () {
  getCurrentWindowTabs().then((tabs) => {
    function onSuccess() {
      console.log(`Success`);
    }

    function onError(error) {
      console.log(`Error: ${error}`);
    }

    var creating = browser.tabs.create({
      url: "index.html",
    });

    creating.then(onSuccess, onError);

    for (let tab of tabs) {
      var removing = browser.tabs.remove(tab.id);
      removing.then(onSuccess, onError);
    }

    tabsList.appendChild(currentTabs);
  });
});

const saveBtn = document.querySelector(".saveBtn");
saveBtn.addEventListener("click", () => {
  getCurrentWindowTabs()
    .then((tabs) => {
      return storeTabs(tabs);
    })
    .then(() => {
      return browser.storage.local.get(store);
    })
    .then((result) => {
      result.storedTabs.forEach((value) => console.log(value));
    });
});
