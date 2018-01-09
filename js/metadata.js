(function (global) {

	/**
	 * Performs a GET call to retrieve the metadata of a given URL.
	 * After metadata has been retrieved, the information will be 
	 * persisted within chrome storage.
	 * 
	 * @param  {String} url website with metadata will be retrieved from
	 */
	function loadWebsiteMetadata(url, callback) {
		console.info("Loading url:", url);
		if (url.indexOf("http") !== 0) {
			console.log("Invalid url has been passed");
			return;
		}

		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			var startsWithPattern = new RegExp(/^(https:\/\/\.(messenger|facebook)\.com)/)

			// handles messenger intermediate page
			if (startsWithPattern.test(url)) {
				var redirectUrlRegex = /document\.location\.replace\("(.+)"\);/
				var regexResults = redirectUrlRegex.exec(this.responseText);

				if (regexResults.length === 2) {
					var intermediateUrl = regexResults[1];
					loadWebsiteMetadata(intermediateUrl.replace(/\\/gi, ''));

				}

			} else if (this.responseText) {
				var response = document.createElement("html");
				response.innerHTML = this.responseText;

				var currentWebsite = {};
				currentWebsite.tags = [];

				currentWebsite.title = getTitleMetadata(response);
				if (!currentWebsite.title) {
					currentWebsite.title = url;

				}

				currentWebsite.description = getDescriptionMetadata(response);
				currentWebsite.url = url;

				saveWebsite(currentWebsite, callback);

			}
		};

		xhttp.open("GET", url, true);
		xhttp.send();
	}

	/**
	 * Looks at the current date and builds an iso date string
	 * 
	 * @return {String} iso date string
	 */
	function getISODate() {
		var date = new Date();
		var isoDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
		return isoDate;
	}

	/**
	 * Persists the given website object
	 * If it has been persisted before, we store all the newest information,
	 * but maintain the previous created date.
	 * 
	 * @param  {Object}   currentWebsite object that contains metadata
	 * @param  {Function} callback       performs any necessary callback, if defined
	 */
	function saveWebsite(currentWebsite, callback) {
		chrome.storage.sync.get(null, function (items) {
			var allKeys = Object.keys(items);
			var url = currentWebsite.url;

			var isoDate = getISODate();
			currentWebsite.lastModifiedDate = isoDate;

			// maintaining createdDate because the website was already stored previously
			if (~allKeys.indexOf(url)) {
				currentWebsite.createdDate = items[url].createdDate;

			} else {
				currentWebsite.createdDate = isoDate;

			}

			if (currentWebsite.oldUrl && (currentWebsite.oldUrl !== url)) {
				chrome.storage.sync.remove(currentWebsite.oldUrl);
			}

			// persisting website into storage
			var objectToPersist = {};
			objectToPersist[url] = currentWebsite;
			chrome.storage.sync.set(objectToPersist);

			if (typeof callback === "function") {
				callback();
			}

		});
	}

	/**
	 * Deletes the given website 
	 * 
	 * @param  {Object}   currentWebsite object that contains metadata
	 * @param  {Function} callback       performs any necessary callback, if defined
	 */
	function deleteWebsite(currentWebsite, callback) {
		chrome.storage.sync.remove(currentWebsite.url, function () {
			console.log(currentWebsite.title, "has been removed");

			if (typeof callback === "function") {
				callback();
			}
		});
	}

	/**
	 * Based on the given element, we will attempt to retrieve the 
	 * title metadata. 
	 * If the requested title metadata does not exist, we will 
	 * attempt to look at the current title element.
	 * If neither titles exist, we will return null.
	 * 
	 * @param  {Object} element current html element to find metadata in
	 * @return {String} title metadata retrieved from the element
	 */
	function getTitleMetadata(element) {
		var metadata = getElementMetadata(element, "og:title");
		if (metadata === null) {
			var titleObj = element.getElementsByTagName("title");
			if (titleObj.length) {
				return titleObj[0].innerText;

			} else {
				return null;

			}

		}
		return metadata;
	}

	/**
	 * Based on the given element, we will attempt to retrieve the
	 * description metadata. 
	 * If neither description metadata attributes exists, we will
	 * return null.
	 * 
	 * @param  {Object} element current html element to find metadata in
	 * @return {String} description metadata retrieved from the element
	 */
	function getDescriptionMetadata(element) {
		var metadata = getElementMetadata(element, "description");
		if (metadata === null) {
			metadata = getElementMetadata(element, "og:description");

		}
		return metadata;
	}

	/**
	 * Based on the given element, we will attempt to retrieve the
	 * given metadata based on the requested attribute.
	 * If the requested metadata does not exist, we will return null.
	 * 
	 * @param  {Object} element   current html element to find metadata in
	 * @param  {String} attribute name of metadata attribute to be found
	 * @return {String} metadata retrieved from element
	 */
	function getElementMetadata(element, attribute) {
		var metadata = null;

		if (attribute.indexOf("og:") === -1) {
			element.querySelector("meta[name=" + attribute + "]");
			if (metadata) {
				return metadata.content;

			}
		}

		metadata = element.querySelector('meta[property="' + attribute + '"]');
		if (metadata) {
			return metadata.content;

		}
		return metadata;
	}

	global.loadWebsiteMetadata = loadWebsiteMetadata;
	global.saveWebsite = saveWebsite;
	global.deleteWebsite = deleteWebsite;

})(this);
