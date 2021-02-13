function restore() {
    let store = browser.storage.local.get(null);
    store.then(store => {
        console.log(store)
        let tabList = store.storedTabs 
        for (var i = 0; i < tabList.length; i++) {
            var creating = browser.tabs.create({
                url: tabList[i].url
            });
            
            Promise.resolve(creating);
        }
    })
}

const restoreBtn = document.getElementById("restore-btn");
restoreBtn.addEventListener("click", restore);
