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
      let groupElement = document.createElement("ul");

      store[prop].forEach((tab, i) => {
        let tabElement = document.createElement("li");
        let tabLink = document.createElement("a");
        tabLink.href = tab.url;
        tabLink.innerText = tab.title;
        tabLink.setAttribute("target", "__blank");
        tabElement.appendChild(tabLink);
        let deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-tab";
        deleteBtn.innerHTML = "&#x2717";
        tabElement.appendChild(deleteBtn);

        deleteBtn.addEventListener("click", () => {
          tabElement.parentNode.removeChild(tabElement);
          store[prop].splice(i, 1);
          return browser.storage.local.set({ [prop]: store[prop] });
        });

        groupElement.appendChild(tabElement);
      });

      let restoreBtn = document.createElement("button");
      restoreBtn.className = "restore";
      restoreBtn.innerHTML = "Restore";
      groupList.appendChild(restoreBtn);

      restoreBtn.addEventListener("click", () => {
        restore(store[prop]);
      });

      let deleteBtn = document.createElement("button");
      deleteBtn.className = "delete";
      deleteBtn.innerHTML = "Delete";
      groupList.appendChild(deleteBtn);

      deleteBtn.addEventListener("click", () => {
        confirm("Are you sure you want to delete this group?") &&
          browser.storage.local.remove(prop).then(window.location.reload());
      });

      groupList.appendChild(groupElement);
    });
  });
}

document.addEventListener("DOMContentLoaded", displayGroupList);

document.getElementById("clear-storage-btn").addEventListener("click", () => {
  confirm("Yo homie ya ight?") &&
    browser.storage.local.clear().then(window.location.reload());
});
