function initialise() {
  return browser.storage.local.get(null).then((localStore) => {
    store = localStore;
    const props = Object.keys(store).reverse();

    // console.log(store[props[0]]["tabList"][0]);

    for (let i = 0; i < props.length; i++) {
      // console.log(store[props[i]]["tabList"]);
      let listOfTabs = store[props[i]]['tabList'];
      for (let j = 0; j < listOfTabs.length; j++)
        console.log(listOfTabs[j].url);
      console.log('\n');
    }
  });
}

initialise();
