// listening for an event / one-time requests
// coming from the popup/and content

var buddyDB;


buddyDB = new BuddyDB();
chrome.extension.onMessage.addListener(_.curry(messageHandler)(buddyDB));
autoImport(3600000);
