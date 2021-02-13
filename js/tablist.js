function restore(groupList) {
  for (var i = 0; i < groupList.length; i++) {
    var creating = browser.tabs.create({
      url: groupList[i].url
    });

    Promise.resolve(creating);
  }
}


function displayGroupList() {
  let groupList = document.getElementById("group-list")
  browser.storage.local.get(null).then(store => {
    for (let prop in store) {
      let groupElement = document.createElement("ul")

      store[prop].forEach(tab => {
        let tabElement = document.createElement("li");
        let tabLink = document.createElement("a");
        tabLink.href = tab.url;
        tabLink.innerText = tab.title;
        tabElement.appendChild(tabLink);
        groupElement.appendChild(tabElement);
      })

      groupList.appendChild(groupElement);

      let restoreBtn = document.createElement("button");
      restoreBtn.innerHTML = "Restore" + prop;
      groupList.appendChild(restoreBtn);

      restoreBtn.addEventListener("click", () => {
        restore(store[prop]);
      });
    }

  })
}

document.addEventListener("DOMContentLoaded", displayGroupList)


document.getElementById("clear-storage-btn").addEventListener("click", () => {
  browser.storage.local.clear().then(
    window.location.reload()
  )
})

