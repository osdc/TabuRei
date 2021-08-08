document.getElementById("elem").addEventListener("click", getelement);

async function getelement() {
  let s = document.getElementById("importform").value;
  //differetiating into groups
  let groups = s.split("\n\n");
  var numofgroup = groups.length;
  for (i = 0; i < numofgroup; i++) {
    //differentiating into
    var group = groups[i].split("\n");
    var grouplength = group.length;
    var grouplist = [];
    for (j = 0; j < grouplength; j++) {
      var temp = group[j].split("|");
      grouplist.push({ url: temp[0], title: temp[1] });
    }
    console.log(grouplist);
    await storeTabs(grouplist, []);
  }
  // Redirect to index after storing
  location.href = "index.html";
}

function storeTabs(tabs) {
  let allowedProperties = [
    "url",
    "cookieStoreId",
    "openInReaderMode",
    "pinned",
  ];

  const storedTabs = tabs.map((tab) => {
    return {
      url: tab.url,
      id: tab.id,
      title: tab.title,
      create: Object.keys(tab)
        .filter((key) => allowedProperties.includes(key))
        .reduce((obj, key) => {
          obj[key] = tab[key];
          return obj;
        }, {}),
    };
  });

  let groupId = performance.timeOrigin + performance.now();

  let groupInfo = {
    groupName: "",
    tabList: storedTabs,
  };

  let store = {
    [groupId]: groupInfo,
  };

  return browser.storage.local.set(store);
}
