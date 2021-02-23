function restore(group) {
  group.forEach((tab) => {
    browser.tabs.create(tab.create).catch((err) => console.debug(err));
  });
}

function displayGroupList() {
  let groupList = document.getElementById("group-list");
  browser.storage.local.get(null).then((store) => {
    let props = Object.keys(store).reverse();
    props.forEach((prop) => {
      let groupElement = document.createElement("div");
      groupElement.className = "tab-group";

      groupElement.setAttribute("prop", prop);

      let list = document.createElement("ul");

      list.ondrop = listonDrop;

      store[prop].forEach((tab, i) => {
        let tabElement = document.createElement("li");

        let deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-tab list-item";
        deleteBtn.innerHTML = "&#x2A09";
        let bulletPoint = document.createElement("button");
        bulletPoint.className = "bullet list-item";
        bulletPoint.innerHTML = "&#9726";
        tabElement.appendChild(deleteBtn);
        tabElement.appendChild(bulletPoint);

        tabElement.setAttribute("prop", prop);
        tabElement.setAttribute("index", i);
        tabElement.id = tab.id;
        let tabLink = document.createElement("a");
        tabLink.href = tab.url;
        tabLink.innerText = tab.title;
        tabLink.setAttribute("target", "__blank");
        tabElement.appendChild(tabLink);

        tabElement.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("element-data", tab.id);
        });
        tabElement.addEventListener("dragover", (e) => e.preventDefault());

        deleteBtn.addEventListener("click", () => {
          store[prop].splice(i, 1);
          return browser.storage.local
            .set({ [prop]: store[prop] })
            .then(() => window.location.reload())
            .catch((err) => console.log(err));
        });

        list.appendChild(tabElement);
      });

      let header = document.createElement("div");
      header.className = "header";

      let restoreBtn = document.createElement("button");
      restoreBtn.className = "restore";
      restoreBtn.innerHTML = "Restore";
      header.appendChild(restoreBtn);

      restoreBtn.addEventListener("click", () => {
        restore(store[prop]);
      });

      let deleteBtn = document.createElement("button");
      deleteBtn.className = "delete";
      deleteBtn.innerHTML = "Delete";
      header.appendChild(deleteBtn);

      deleteBtn.addEventListener("click", () => {
        confirm("Are you sure you want to delete this group?") &&
          browser.storage.local.remove(prop).then(window.location.reload());
      });

      groupElement.appendChild(header);
      groupElement.appendChild(list);
      groupList.appendChild(groupElement);
    });
  });
}

document.addEventListener("DOMContentLoaded", displayGroupList);

document
  .getElementById("group-list")
  .addEventListener("click", (e) => console.log(e));

document.getElementById("clear-storage-btn").addEventListener("click", () => {
  confirm("Yo homie ya ight?") &&
    browser.storage.local.clear().then(window.location.reload());
});

function listonDrop(e) {
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
