function exportTabs() {
  return browser.storage.local.get(null).then((localStore) => {
    store = localStore;

    const props = Object.keys(store).reverse();

    let textArea = document.getElementById("export-form");

    for (let i = 0; i < props.length; i++) {
      let listOfTabs = store[props[i]]["tabList"];

      for (let j = 0; j < listOfTabs.length; j++) {
        textArea.value +=
          listOfTabs[j].url + " | " + listOfTabs[j].title + "\n";
      }
      textArea.value += "\n";
    }
  });
}
const textArea=document.querySelector('.text-area');
const copyText=document.querySelector('.copy-text');
copyText.addEventListener('click', ()=>{
    textArea.select();
    document.execCommand('copy');
});
exportTabs();
