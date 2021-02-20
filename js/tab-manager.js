function restore(group) {
  group.forEach(({ url, cookieStoreId }) => {
    let tab = {};
    tab.url = url;
    if (cookieStoreId) {
      tab.cookieStoreId = cookieStoreId;
    }
    browser.tabs.create(tab).catch((err) => console.debug(err));
  });
}

function displayGroupList() {
  let groupList = document.getElementById("group-list");
  browser.storage.local.get(null).then((store) => {
    for (let prop in store) {
      let groupElement = document.createElement("ul");

      store[prop].forEach((tab, i) => {
        let tabElement = document.createElement("li");
        let tabLink = document.createElement("a");
        tabLink.href = tab.url;
        tabLink.innerText = tab.title;
        tabLink.setAttribute("target", "__blank");
        tabElement.appendChild(tabLink);
        let deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "delete ";
        tabElement.appendChild(deleteBtn);

        deleteBtn.addEventListener("click", () => {
          tabElement.parentNode.removeChild(tabElement);
          store[prop].splice(i, 1);
          return browser.storage.local.set({ [prop]: store[prop] });
        });

        groupElement.appendChild(tabElement);
      });

      let restoreBtn = document.createElement("button");
      restoreBtn.innerHTML = "Restore";
      groupList.appendChild(restoreBtn);

      restoreBtn.addEventListener("click", () => {
        restore(store[prop]);
      });

      let deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "Delete";
      groupList.appendChild(deleteBtn);

      deleteBtn.addEventListener("click", () => {
        confirm("Yo homie ya ight?") && browser.storage.local.remove(prop).then(window.location.reload());
      });

      groupList.appendChild(groupElement);
    }
  });
}

document.addEventListener("DOMContentLoaded", displayGroupList);

document.getElementById("clear-storage-btn").addEventListener("click", () => {
  confirm("Do you really wanna delete everything?") && browser.storage.local.clear().then(window.location.reload());
});
