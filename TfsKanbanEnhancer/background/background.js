// listening for an event / one-time requests
// coming from the popup/and content
var GET_KANBAN_BOARD_COLOR_MAPPING = "get-color-map";
var GET_TASK_BOARD_COLOR_MAPPING = "get-task-color-map";
var SET_KANBAN_BOARD_COLOR_MAPPING = "set-color-map";
var SET_TASK_BOARD_COLOR_MAPPING = "set-task-color-map";
var GET_KANBAN_BOARD_DESCRIPTION_MAPPING = "get-description-map";
var GET_TASK_BOARD_DESCRIPTION_MAPPING = "get-task-description-map";
var SET_KANBAN_BOARD_DESCRIPTION_MAPPING = "set-description-map";
var SET_TASK_BOARD_DESCRIPTION_MAPPING = "set-task-description-map";
var buddyDB;


buddyDB = new BuddyDB();
chrome.extension.onMessage.addListener(_.curry(messageHandler)(buddyDB));
autoImport(3600000);
