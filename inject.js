const TITLE_APPLY = 'Inject Tailwindcss';
const APPLICABLE_PROTOCOLS = ['http:', 'https:'];
const CDN_LINK = 'https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css';
const CODE = `var headID = document.getElementsByTagName('head')[0];var link = document.createElement('link');link.rel = 'stylesheet';link.href = '${CDN_LINK}';headID.insertBefore(link, headID.firstChild);const prevName = document.title; document.title = "Tailwindcss Injected";  setTimeout(function(){ document.title = prevName; }, 2000);`;

/*
Inject Tailwindcss, will inject with CDN
*/
function injectTailwind(tab) {
  function gotTitle(title) {
    browser.tabs.executeScript({ code: CODE });
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
    browser.pageAction.setIcon({ tabId: tab.id, path: 'icons/tailwindcss-injector-48.png' });
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
browser.pageAction.onClicked.addListener(injectTailwind);
