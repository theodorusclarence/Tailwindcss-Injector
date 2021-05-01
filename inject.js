// var headID = document.getElementsByTagName('head')[0];
// var link = document.createElement('link');
// link.rel = 'stylesheet';
// link.href = 'https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css';

// headID.insertBefore(link, headID.firstChild);
// console.log('loads');
// browser.browserAction.onClicked.addListener(() => {
//   console.log('clicked');
// });

// browser.browserAction.onClicked.addListener((tab) => {
//   browser.tabs.executeScript(tab.id, {
//     code: `document.body.style.border = "5px solid red"`,
//   });
// });
// document.body.style.border = '5px solid blue';

// function toggleDebugCSS(tab) {
//   var e = '';
//   e += 'document.body.style.border = "5px solid red"';
//   browser.tabs.executeScript({
//     code: e,
//   });
// }

// browser.commands.onCommand.addListener(function (tab) {
//   toggleDebugCSS(tab);
// });
// browser.browserAction.onClicked.addListener(function (tab) {
//   toggleDebugCSS(tab);
// });

// browser.pageAction.onClicked.addListener(toggleDebugCSS);

const CSS = 'body { border: 20px solid red; }';
const TITLE_APPLY = 'Inject Tailwindcss';
const TITLE_REMOVE = 'Remove CSS';
const APPLICABLE_PROTOCOLS = ['http:', 'https:'];

/*
Toggle CSS: based on the current title, insert or remove the CSS.
Update the page action's title and icon to reflect its state.
*/
function toggleCSS(tab) {
  function gotTitle(title) {
    if (title === TITLE_APPLY) {
      browser.pageAction.setTitle({ tabId: tab.id, title: TITLE_REMOVE });
      browser.tabs.insertCSS({ code: CSS });
      browser.tabs.executeScript({ code: 'console.log("hi");' });
    } else {
      browser.pageAction.setTitle({ tabId: tab.id, title: TITLE_APPLY });
      browser.tabs.removeCSS({ code: CSS });
      browser.tabs.executeScript({ code: 'console.log("hi");' });
    }
  }
  var gettingTitle = browser.pageAction.getTitle({ tabId: tab.id });
  gettingTitle.then(gotTitle);
}

/*
Returns true only if the URL's protocol is in APPLICABLE_PROTOCOLS.
Argument url must be a valid URL string.
*/
function protocolIsApplicable(url) {
  const protocol = new URL(url).protocol;
  return APPLICABLE_PROTOCOLS.includes(protocol);
}

/*
Initialize the page action: set icon and title, then show.
Only operates on tabs whose URL's protocol is applicable.
*/
function initializePageAction(tab) {
  if (protocolIsApplicable(tab.url)) {
    browser.pageAction.setIcon({ tabId: tab.id, path: 'icons/tailwindcss.png' });
    browser.pageAction.setTitle({ tabId: tab.id, title: TITLE_APPLY });
    browser.pageAction.show(tab.id);
  }
}

/*
When first loaded, initialize the page action for all tabs.
*/
var gettingAllTabs = browser.tabs.query({});
gettingAllTabs.then((tabs) => {
  for (let tab of tabs) {
    initializePageAction(tab);
  }
});

/*
Each time a tab is updated, reset the page action for that tab.
*/
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  initializePageAction(tab);
});

/*
Toggle CSS when the page action is clicked.
*/
browser.pageAction.onClicked.addListener(toggleCSS);
