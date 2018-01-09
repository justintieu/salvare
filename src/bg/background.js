(function (global) {

	/**
	 * Adds a context menu, which calls a function to store the URL
	 */
	chrome.contextMenus.create({
		title: "Salvare: Save Link", 
		contexts:["link"], 
		onclick: performClickAction
	});

	/**
	 * Handles user action when they click on the chrome extension icon.
	 * If the website has been saved before, it will be deleted.
	 * Otherwise the website will be saved.
	 *
	 * @param  {Object} tab  gets current tab and performs action based on tab url
	 */
	chrome.browserAction.onClicked.addListener(function (tab) {
		chrome.storage.sync.get(tab.url, function (website) {
			if (Object.keys(website).length) {
				deleteWebsite(tab, setIcon("../../icons/icon128-empty.png", tab.id));
			} else {
				loadWebsiteMetadata(tab.url, setIcon("../../icons/icon128.png", tab.id));
			}
		});
	});

	/**
	 * When you open a tab, a request will be sent to set the appropriate
	 * chrome extension icon
	 * 
	 * @param  {Object} request       request object being sent from sender
	 * @param  {Object} sender        information about the sender
	 * @param  {String} sendResponse  send response back if needed
	 */
	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
			chrome.storage.sync.get(sender.tab.url, function (website) {
				var pathToIcon = "../../icons/icon128-empty.png";
				if (Object.keys(website).length) {
					pathToIcon = "../../icons/icon128.png";
				}
				setIcon(pathToIcon, sender.tab.id);
			});
	});


	/**
	 * Sets icon for the chrome extension 
	 * 
	 * @param {String}  pathToIcon   path to icon
	 * @param {Integer} tabId        id of the current tab
	 */
	function setIcon(pathToIcon, tabId) {
		chrome.browserAction.setIcon({
			path: pathToIcon,
			tabId: tabId
		});
	}

	/**
	 * Performs click action by passing current link URL 
	 * 
	 * @param  {Object} info  object that contains info of click event
	 * @param  {Object} tab   object that contains
	 */
	function performClickAction(info, tab) {
		loadWebsiteMetadata(info.linkUrl);
	}

})(this);
