function restore(groupID) {
  store[groupID].forEach((tab) => {
    browser.tabs.create(tab.create).catch((err) => console.debug(err));
  });
}

let store = {};

function initialise() {
  return browser.storage.local.get(null).then((localStore) => {
    store = localStore;
  });
}

function displayGroupList() {
  let groupList = document.getElementById("group-list");

  let props = Object.keys(store).reverse();
  props.forEach((prop) => {
    let groupElement = document.createElement("div");
    groupElement.className = "tab-group";

    groupElement.setAttribute("prop", prop);

    let list = document.createElement("ul");

    list.ondrop = (e) => listonDrop(e, prop, list);

    store[prop].forEach((tab, i) => {
      let tabElement = document.createElement("li");
      list.title = "Click to restore this tab, Drag to drop to another group";

      let deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-tab list-item";
      deleteBtn.innerHTML = "&#x2A09";
      deleteBtn.title = "Click to delete this tab listing";
      deleteBtn.setAttribute("prop", prop);
      deleteBtn.setAttribute("index", i);
      tabElement.appendChild(deleteBtn);

      let bulletPoint = document.createElement("button");
      bulletPoint.className = "bullet list-item";
      bulletPoint.innerHTML = "&#x25A0";
      tabElement.appendChild(bulletPoint);

      tabElement.setAttribute("draggable", true);
      tabElement.setAttribute("prop", prop);
      tabElement.setAttribute("index", i);
      tabElement.id = tab.id;

      let tabLink = document.createElement("span");
      tabLink.setAttribute("prop", prop);
      tabLink.setAttribute("index", i);
      tabLink.appendChild(document.createTextNode(tab.title));
      tabElement.appendChild(tabLink);

      tabElement.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("element-data", tab.id);
      });
      tabElement.addEventListener("dragover", (e) => e.preventDefault());

      list.appendChild(tabElement);
    });

    let header = document.createElement("div");
    header.className = "header";

    let restoreBtn = document.createElement("button");
    restoreBtn.className = "restore";
    restoreBtn.innerHTML = "Restore";
    restoreBtn.setAttribute("prop", prop);
    header.appendChild(restoreBtn);

    let deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.innerHTML = "Delete";
    deleteBtn.setAttribute("prop", prop);
    header.appendChild(deleteBtn);

    groupElement.appendChild(header);
    groupElement.appendChild(list);
    groupList.appendChild(groupElement);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initialise().then(displayGroupList);
});

document.getElementById("group-list").addEventListener("click", (e) => {
  if (e.target && e.target.matches("button.restore")) {
    let prop = e.target.getAttribute("prop");
    return restore(prop);
  }

  if (e.target && e.target.matches("button.delete")) {
    let prop = e.target.getAttribute("prop");
    return (
      confirm("Are you sure you want to delete this group?") &&
      browser.storage.local.remove(prop).then(window.location.reload())
    );
  }

  if (e.target && e.target.matches("button.delete-tab")) {
    let prop = e.target.getAttribute("prop");
    let i = e.target.getAttribute("i");
    store[prop].splice(i, 1);
    return browser.storage.local
      .set({ [prop]: store[prop] })
      .then(() => window.location.reload())
      .catch((err) => console.log(err));
  }

  if ((e.target && e.target.matches("li")) || e.target.matches("span")) {
    let prop = e.target.getAttribute("prop");
    let i = Number(e.target.getAttribute("i"));
    return browser.tabs
      .create(store[prop][i].create)
      .catch((err) => console.debug(err));
  }
});

document.getElementById("clear-storage-btn").addEventListener("click", () => {
  confirm("Yo homie ya ight?") &&
    browser.storage.local.clear().then(window.location.reload());
});

function listonDrop(e, prop, list) {
  e.preventDefault();
  const data = e.dataTransfer.getData("element-data");
  const element = document.getElementById(data);
  list.appendChild(element);
  const elementProp = element.getAttribute("prop");
  const index = element.getAttribute("index");
  const originalStore = store[elementProp];
  const updatedStore = store[prop];
  if (elementProp !== prop) {
    updatedStore.push(originalStore[index]);
    originalStore.splice(index, 1);
    if (originalStore.length === 0) {
      browser.storage.local.set({
        [prop]: updatedStore,
      });
      return browser.storage.local
        .remove(elementProp)
        .then(window.location.reload());
    }
    browser.storage.local
      .set({
        [elementProp]: originalStore,
        [prop]: updatedStore,
      })
      .then(() => window.location.reload())
      .catch((err) => console.log(err));
  }
}
