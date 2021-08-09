let store = {};

function restore(groupID) {
  store[groupID].tabList.forEach((tab) => {
    browser.tabs.create(tab.create).catch((err) => console.debug(err));
  });
}

function restoreToNewWindow(groupID) {
  function onCreated() {
    restore(groupID);
  }

  function onError(error) {
    console.debug(`Error: ${error}`);
  }

  const creating = browser.windows.create();
  creating.then(onCreated, onError);
}

function initialise() {
  return browser.storage.local.get(null).then((localStore) => {
    store = localStore;
  });
}

function displayGroupProperties(parent, id) {
  const num = store[id].tabList.length;
  const groupTitle = document.createElement("div");
  groupTitle.className = "title";
  const numberLabel = document.createElement("p");
  numberLabel.setAttribute("prop", id);
  const word = num === 1 ? " Tab" : " Tabs";
  numberLabel.innerHTML = num + word;
  numberLabel.className = "number-of-tabs";

  const groupNameLabel = document.createElement("input");
  groupNameLabel.setAttribute("prop", id);
  groupNameLabel.value = store[id].groupName;
  groupNameLabel.placeholder = "( ͡ ° ͜ʖ ͡ ° )";
  groupNameLabel.className = "group-name";
  groupNameLabel.title = "Enter the name of the group here";

  groupNameLabel.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      const out = {
        groupName: groupNameLabel.value,
        tabList: store[id].tabList,
      };
      browser.storage.local
        .set({ [id]: out })
        .then(() => window.location.reload())
        .catch((err) => console.debug(err));

      document.activeElement.blur();
    }
  });

  groupNameLabel.addEventListener("change", () => {
    const out = {
      groupName: groupNameLabel.value,
      tabList: store[id].tabList,
    };
    browser.storage.local
      .set({ [id]: out })
      .then(() => window.location.reload())
      .catch((err) => console.debug(err));
  });

  const divider = document.createElement("div");
  divider.className = "divider";

  groupTitle.appendChild(numberLabel);
  groupTitle.appendChild(divider);
  groupTitle.appendChild(groupNameLabel);
  parent.appendChild(groupTitle);
}

function displayGroupList() {
  const groupList = document.getElementById("group-list");

  const props = Object.keys(store).reverse();
  props.forEach((prop) => {
    const groupElement = document.createElement("div");
    groupElement.className = "tab-group";

    groupElement.setAttribute("prop", prop);

    let list = document.createElement("ul");
    list.id="collapsible";

    list.ondrop = (e) => listonDrop(e, prop, list);

    store[prop].tabList.forEach((tab, i) => {
      const tabElement = document.createElement("div");
      tabElement.classList.add("tab-container");
      list.title = "Click to restore this tab, Drag to drop to another group";

      const buttons = document.createElement("label");
      buttons.classList.add("bullet-container");

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-tab list-item";
      deleteBtn.innerHTML = "&#x2A09";
      deleteBtn.title = "Click to delete this tab listing";
      deleteBtn.setAttribute("prop", prop);
      deleteBtn.setAttribute("index", i);
      buttons.appendChild(deleteBtn);

      const bulletPoint = document.createElement("button");
      bulletPoint.className = "bullet list-item";
      bulletPoint.innerHTML = "&#x25A0";
      buttons.appendChild(bulletPoint);

      tabElement.appendChild(buttons);

      tabElement.setAttribute("draggable", true);
      tabElement.setAttribute("prop", prop);
      tabElement.setAttribute("index", i);
      tabElement.id = tab.id;

      const tabLink = document.createElement("span");
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

    const header = document.createElement("div");
    header.className = "header";
    const groupButtons = document.createElement("div");
    groupButtons.className = "group-buttons";

    displayGroupProperties(header, prop);

    const restoreBtn = document.createElement("button");
    restoreBtn.className = "restore";
    restoreBtn.innerHTML = "Restore";
    restoreBtn.setAttribute("prop", prop);
    groupButtons.appendChild(restoreBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.innerHTML = "Delete";
    deleteBtn.setAttribute("prop", prop);
    groupButtons.appendChild(deleteBtn);

    let expandBtn = document.createElement("button");
    expandBtn.className = "expand";
    expandBtn.innerHTML = "Expand";
    expandBtn.setAttribute("prop", prop);
    groupButtons.appendChild(expandBtn);
    


    groupElement.appendChild(header);
    header.appendChild(groupButtons);
    groupElement.appendChild(list);
    groupList.appendChild(groupElement);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initialise().then(displayGroupList);
});

document.getElementById("group-list").addEventListener("click", (e) => {
  if (e?.target.matches("button.restore")) {
    const prop = e.target.getAttribute("prop");
    return restore(prop);
  } if (e.target && e.target.matches("button.delete")) {
    let prop = e.target.getAttribute("prop");
    return (
      confirm("Are you sure you want to delete this group?") &&
      browser.storage.local.remove(prop).then(window.location.reload())
    );
  }
  
    if (e.target && e.target.matches("button.expand")) {
      console.log("working");
     var content = document.getElementById("collapsible");
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  }



  if (e?.target.matches("button.delete-tab")) {
    const prop = e.target.getAttribute("prop");
    const i = e.target.getAttribute("index");
    //deletes the group when the last element is deleted
    if (store[prop].tabList.length == 1) {
      return browser.storage.local.remove(prop).then(window.location.reload());
    }
    store[prop].tabList.splice(i, 1);
    const out = {
      groupName: store[prop].groupName,
      tabList: store[prop].tabList,
    };
    return browser.storage.local
      .set({ [prop]: out })
      .then(() => window.location.reload())
      .catch((err) => console.log(err));
  }

  if (e?.target.matches("div.tab-container") || e?.target.matches("span")) {
    const prop = e.target.getAttribute("prop");
    const i = Number(e.target.getAttribute("index"));
    return browser.tabs
      .create(store[prop].tabList[i].create)
      .catch((err) => console.debug(err));
  }
});
document.getElementById("group-list").addEventListener("auxclick", (e) => {
  if (e?.target.matches("button.restore")) {
    const prop = e.target.getAttribute("prop");
    if (e.button == 1) return restoreToNewWindow(prop);
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
  const originalTabList = store[elementProp].tabList;
  const updatedTabList = store[prop].tabList;

  if (elementProp !== prop) {
    updatedTabList.push(originalTabList[index]);
    originalTabList.splice(index, 1);
    if (originalTabList.length === 0) {
      const out = {
        groupName: store[prop].groupName,
        tabList: updatedTabList,
      };

      browser.storage.local.set({
        [prop]: out,
      });
      return browser.storage.local
        .remove(elementProp)
        .then(window.location.reload());
    }

    const originalOut = {
      groupName: store[elementProp].groupName,
      tabList: originalTabList,
    };
    const updatedOut = {
      groupName: store[prop].groupName,
      tabList: updatedTabList,
    };

    browser.storage.local
      .set({
        [elementProp]: originalOut,
        [prop]: updatedOut,
      })
      .then(() => window.location.reload())
      .catch((err) => console.log(err));
  }
}
