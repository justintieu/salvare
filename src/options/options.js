(function (global) {

	/**
	 * Handles page initialization
	 */
	function initPage() {
		loadPageContent();

		var searchBar = document.getElementById("card-search");
		searchBar.addEventListener("keydown", performSearch);

		var overlay = document.getElementById("overlay");
		overlay.addEventListener("click", toggleModal);

		window.onkeydown = function (event) {
			var charCode = event.keyCode || event.which;
			if (charCode === 27) {
				toggleModal(true);
			}
		};

		var menuListIcon = document.getElementById("toggle-display");
		menuListIcon.addEventListener("click", function (event) {
			if (menuListIcon.classList.contains("fa-list")) {
				menuListIcon.classList.remove("fa-list");
				menuListIcon.classList.add("fa-th-large");
			} else {
				menuListIcon.classList.remove("fa-th-large");
				menuListIcon.classList.add("fa-list");
			}
		});
	}

	/**
	 * Grabs all the objects from chrome storage and loads them into the page
	 * 
	 * @param  {String} searchTerm search term used to narrow search
	 */
	function loadPageContent(searchTerm) {
		chrome.storage.sync.get(null, function (storedWebsites) {
			var websites = Object.values(storedWebsites).sort(function (websiteA, websiteB) {
				return websiteA.lastModifiedDate < websiteB.lastModifiedDate;
			});
			loadWebsiteCards(websites, searchTerm);

		});
	}

	/**
	 * Performs search and updates webpage with content
	 * related to the given search term in the target element.
	 * 
	 * @param  {Object} event performs search based on event
	 */
	function performSearch(event) {
		var charCode = event.keyCode || event.which;
		if (charCode === 13) {
			// enter key
			event.preventDefault();

			var searchTerm = event.target.value.trim();
			loadPageContent(searchTerm)

		}
	}

	/**
	 * Performs logic in toggling overlay and modal
	 * 
	 * @param  {Boolean} isEscKey if esc key is pressed, then overlay and modal is hidden
	 */
	function toggleModal(isEscKey) {
		var overlay = document.getElementById("overlay");
		var modal = document.getElementById("overlay-modal");

		var currentDisplay = overlay.style.display;

		if (isEscKey || currentDisplay === "block") {
			overlay.style.display = "none";
			modal.style.display = "none";
		} else {
			overlay.style.display = "block";
			modal.style.display = "block";
		}

	}

	/**
	 * Performs hard reset to sync latest data for a given website
	 * 
	 * @param  {Object} currentWebsite object that contains metadata
	 */
	function syncWebsite(currentWebsite) {
		loadWebsiteMetadata(currentWebsite.url, loadPageContent);

	}

	/**
	 * Sets dialog with the current website metadata to allow user to perform edits
	 * 
	 * @param {Object} currentWebsite object that contains metadata
	 */
	function setWebsiteDialog(currentWebsite) {
		var modal = document.getElementById("overlay-modal");
		modal.innerHTML = "";

		var header = document.createElement("h3");
		header.innerText = "Edit Website";

		var formElement = document.createElement("form");
		var gridContainer = document.createElement("div");
		gridContainer.classList = "grid-container";
		var gridElement = document.createElement("div");
		gridElement.classList = "grid-x grid-padding-x";

		var titleElement = createTitleElement(currentWebsite.title);
		var urlElement = createUrlElement(currentWebsite.url);
		var descriptionElement = createDescriptionElement(currentWebsite.description);
		var saveElement = createSaveElement(function (event) {
			performSaveWebsite(currentWebsite);
		});
		var closeModalBtn = createCloseButton();

		gridElement.append(titleElement);
		gridElement.append(urlElement);
		gridElement.append(descriptionElement);
		gridElement.append(saveElement);
		gridContainer.append(gridElement);
		formElement.append(gridContainer);

		modal.append(header);
		modal.append(formElement);
		modal.append(closeModalBtn);
		toggleModal();
	}

	/**
	 * Creates edit title element
	 * 
	 * @param  {String} title website title
	 * @return {Object} element that allows user to edit the metadata title
	 */
	function createTitleElement(title) {
		var titleElement = document.createElement("div");
		titleElement.classList = "medium-12 cell";
		var titleLabel = document.createElement("label");
		titleLabel.innerText = "Title";
		titleLabel.setAttribute("for", "title-input");
		var titleInput = document.createElement("input");
		titleInput.id = "title-input";
		titleInput.type = "text";
		titleInput.value = title;
		titleLabel.append(titleInput);
		titleElement.append(titleLabel);
		return titleElement;
	}

	/**
	 * Creates edit url element 
	 * 
	 * @param  {String} url website url
	 * @return {Object} element that allows user to edit the metadata url
	 */
	function createUrlElement(url) {
		var urlElement = document.createElement("div");
		urlElement.classList = "medium-12 cell";
		var urlLabel = document.createElement("label");
		urlLabel.innerText = "URL";
		urlLabel.setAttribute("for", "url-input");
		var urlInput = document.createElement("input");
		urlInput.id = "url-input";
		urlInput.type = "text";
		urlInput.value = url;
		urlLabel.append(urlInput);
		urlElement.append(urlLabel);
		return urlElement;
	}

	/**
	 * Creates edit description element
	 * 
	 * @param  {String} description website description
	 * @return {Object} element that allows user to edit the metadata description
	 */
	function createDescriptionElement(description) {
		var descriptionElement = document.createElement("div");
		descriptionElement.classList = "medium-12 cell";
		var descriptionLabel = document.createElement("label");
		descriptionLabel.innerText = "Description";
		descriptionLabel.setAttribute("for", "description-input");
		var descriptionInput = document.createElement("textarea");
		descriptionInput.id = "description-input";
		descriptionInput.type = "text";
		descriptionInput.rows = "4";
		descriptionInput.value = description;
		descriptionLabel.append(descriptionInput);
		descriptionElement.append(descriptionLabel);
		return descriptionElement;
	}

	/**
	 * Grabs information from the dom and persists the information
	 * 
	 * @param  {Object} currentWebsite object that contains metadata
	 */
	function performSaveWebsite(currentWebsite) {
		var websiteToUpdate = {};
		var titleInput = document.getElementById("title-input");
		if (titleInput && titleInput.value != "") {
			websiteToUpdate.title = titleInput.value;
		} else {
			websiteToUpdate.title = currentWebsite.title;
		}

		var urlInput = document.getElementById("url-input");
		if (urlInput && urlInput.value != "") {
			websiteToUpdate.url = urlInput.value;
		} else {
			websiteToUpdate.url = currentWebsite.url;
		}
		websiteToUpdate.oldUrl = currentWebsite.url;

		var descriptionInput = document.getElementById("description-input");
		if (descriptionInput && descriptionInput.value != "") {
			websiteToUpdate.description = descriptionInput.value;
		} else {
			websiteToUpdate.description = currentWebsite.description;
		}

		websiteToUpdate.tags = currentWebsite.tags;

		saveWebsite(websiteToUpdate, function () {
			loadPageContent();
			toggleModal();
		});
	}

	/**
	 * Creates save button element and attaches callback
	 * 
	 * @param  {Function} callback       callback to be executed on click of button
	 * @return {Object}  save button element
	 */
	function createSaveElement(callback) {
		var saveElement = document.createElement("div");
		saveElement.classList = "medium-12 cell";
		var saveButton = document.createElement("button");
		saveButton.classList = "button";
		saveButton.innerText = "Save";
		saveButton.addEventListener("click", function (event) {
			callback();
		});
		saveElement.append(saveButton);
		return saveElement;
	}

	/**
	 * Creates close button element used in dialog
	 * 
	 * @return {Object} close button element
	 */
	function createCloseButton() {
		var closeModalBtn = document.createElement("button");
		closeModalBtn.id = "reveal-modal-close";
		closeModalBtn.type = "button";
		closeModalBtn.classList = "close-button";
		closeModalBtn.setAttribute("data-close-aria-label", "Close modal");
		closeModalBtn.addEventListener("click", toggleModal);

		var closeModalText = document.createElement("span");
		closeModalText.setAttribute("aria-hidden", true);
		closeModalText.innerHTML = "&times;";
		closeModalBtn.append(closeModalText);
		return closeModalBtn;
	}

	/**
	 * Sets dialog with the current website metadata to allow user to perform edits on tags
	 * 
	 * @param {Object} currentWebsite object that contains metadata
	 */
	function setWebsiteTagDialog(currentWebsite) {
		var modal = document.getElementById("overlay-modal");
		modal.innerHTML = "";

		var header = document.createElement("h3");
		header.innerText = "Edit Tags";

		var formContainer = document.createElement("form");
		var gridContainer = document.createElement("div");
		gridContainer.classList = "grid-container";
		var gridWrapper = document.createElement("div");
		gridWrapper.classList = "grid-x grid-padding-x";

		var tagsContainer = document.createElement("div");
		tagsContainer.id ="tag-container";
		tagsContainer.classList = "cell small-10 medium-10 large-10";
		tagsContainer.addEventListener("click", function (event) {
			var tagInput = document.getElementById("tags-input");
			if (tagInput) {
				tagsInput.focus();
			}
			var selectedInputToken = document.getElementById("selected-input-token");
			if (selectedInputToken && !event.target.classList.contains("input-token")) {
				selectedInputToken.id = "";
			}
		});

		// tags entered
		for (var i = 0; i < currentWebsite.tags.length; i++) {
			var tagSpan = createTagLabel(currentWebsite.tags[i]);
			tagsContainer.append(tagSpan);
		}

		// input field
		var tagsInput = document.createElement("input");
		tagsInput.id = "tags-input";
		tagsInput.addEventListener("keydown", performTagInputActions);

		tagsContainer.append(tagsInput);

		// save button
		var saveBtnContainer = document.createElement("div");
		saveBtnContainer.classList = "cell small-2 medium-2 large-2";
		var submitBtn = document.createElement("input");
		submitBtn.type = "submit";
		submitBtn.classList = "button";
		submitBtn.value = "Save";
		submitBtn.addEventListener("click", function (event) {
			event.preventDefault();
			var tagsInput = document.getElementById("tags-input");
			var tagInputValue = tagsInput.value.trim();
			if (tagInputValue) {
				var tagSpan = createTagLabel(tagInputValue);
				tagsInput.value = "";
				tagsInput.before(tagSpan);
			}
			performSaveTags(currentWebsite);
		});
		saveBtnContainer.append(submitBtn);

		gridWrapper.append(tagsContainer);
		gridWrapper.append(saveBtnContainer);

		var closeModalBtn = createCloseButton();

		gridContainer.append(gridWrapper);
		formContainer.append(gridContainer);

		modal.append(header);
		modal.append(formContainer);
		modal.append(closeModalBtn);
		toggleModal();
	}

	/**
	 * Handles user input for different actions around editing tags
	 * 
	 * @param  {Object} event user event being performed
	 */
	function performTagInputActions(event) {
		var charCode = event.keyCode || event.which;
		var inputString = event.target.value.trim();
		if (charCode === 13) {
			// enter key
			event.preventDefault();
			if (inputString) {
				var tagSpan = createTagLabel(inputString);
				event.target.value = "";

				var tagsInput = document.getElementById("tags-input");
				tagsInput.before(tagSpan);
			}
		} else if (charCode === 8 && inputString === "") {
			// backspace key
			var selectedInputToken = document.getElementById("selected-input-token");
			if (selectedInputToken) {
				selectedInputToken.remove();
			} else {
				var previousSibling = event.target.previousSibling;
				if (previousSibling) {
					previousSibling.id = "selected-input-token";
				}
			}
		} else if ((charCode === 37 || charCode === 38) && inputString === "") {
			// left or up key
			var selectedInputToken = document.getElementById("selected-input-token");
			if (selectedInputToken === null && event.target.previousSibling) {
				event.target.previousSibling.id = "selected-input-token";
			} else if (selectedInputToken && event.target.previousSibling) {
				selectedInputToken.id = "";
				var previousSibling = event.target.previousSibling;
				event.target.previousSibling.outerHTML = event.target.outerHTML;
				event.target.previousSibling.addEventListener("keydown", performTagInputActions);
				event.target.previousSibling.focus();
				event.target.outerHTML = previousSibling.outerHTML;
			}
		} else if ((charCode === 39 || charCode === 40) && inputString === "") {
			// right or down key
			var selectedInputToken = document.getElementById("selected-input-token");
			if (selectedInputToken === null && event.target.nextSibling) {
				event.target.nextSibling.id = "selected-input-token";
			} else if (selectedInputToken && event.target.nextSibling) {
				selectedInputToken.id = "";
				var nextSibling = event.target.nextSibling;
				event.target.nextSibling.outerHTML = event.target.outerHTML;
				event.target.nextSibling.addEventListener("keydown", performTagInputActions);
				event.target.nextSibling.focus();
				event.target.outerHTML = nextSibling.outerHTML;
			}
		} else {
			var selectedInputToken = document.getElementById("selected-input-token");
			if (selectedInputToken) {
				selectedInputToken.id = "";
			}
		}
	}

	/**
	 * Grabs information from the dom about tags and persists the information
	 * 
	 * @param  {Object} websiteToUpdate   website metadata which will be updated with latest tags
	 */
	function performSaveTags(websiteToUpdate) {
		var inputTokens = document.getElementsByClassName("input-token");
		var tags = [];
		for (var i = 0 ; i < inputTokens.length; i++) {
			tags.push(inputTokens[i].innerText);
		}
		websiteToUpdate.tags = tags;
		saveWebsite(websiteToUpdate, function () {
			loadPageContent();
			toggleModal();
		});
	}

	/**
	 * Creates tag label element 
	 * 
	 * @param  {String} text name of tag
	 * @return {Object} span element that is used for a tag
	 */
	function createTagLabel(text) {
		var tagSpan = document.createElement("span");
		tagSpan.classList = "input-token";
		tagSpan.innerText = text;
		tagSpan.addEventListener("click", function (event) {
			var selectedInputToken = document.getElementById("selected-input-token");
			if (selectedInputToken) {
				selectedInputToken.id = "";
			}
			event.target.id = "selected-input-token";
		});

		var xIcon = document.createElement("i");
		xIcon.classList = "fa fa-times";
		xIcon.setAttribute("aria-hidden", true);
		xIcon.addEventListener("click", function (event) {
			event.target.parentElement.remove();
		});

		tagSpan.append(xIcon);
		return tagSpan;
	}

	/**
	 * Reads website metadata and generates card view on the page
	 * @param  {Object} websites   array of website metadata
	 * @param  {String} searchTerm search term used to narrow search
	 */
	function loadWebsiteCards(websites, searchTerm) {
		var body = document.getElementById("body-container");
		if (body) {
			body.innerHTML = "";
			for (var i = 0; i < websites.length; i++) {
				var currentWebsite = websites[i];
				console.log("current website", currentWebsite.title);
				if (isWebsiteDisplayed(currentWebsite, searchTerm)) {
					var card = createCard(currentWebsite);
					body.append(card);
				}
			}
		}
	}

	/**
	 * Uses search term to see if the current website 
	 * metadata should be added to the page
	 * 
	 * @param  {Object}  currentWebsite object that contains metadata
	 * @param  {String}  searchTerm     search term used to narrow search
	 * @return {Boolean} if website should be displayed
	 */
	function isWebsiteDisplayed(currentWebsite, searchTerm) {
		var startTime = Date.now();
		if (searchTerm === "" || typeof searchTerm === "undefined") {
			return true;
		}

		var terms = searchTerm.split(" ");
		for (var i = 0; i < terms.length; i++) {
			var currentTerm = terms[i].toLowerCase();
			if (currentWebsite.tags.length && currentTerm.indexOf("tag:") === 0) {
				var currentTag = currentTerm.substr(4).replace(/-/g, " ").toLowerCase();
				for (var j = 0; j < currentWebsite.tags.length; j++) {
					var websiteTag = currentWebsite.tags[j];
					if (websiteTag.toLowerCase() === currentTag) {
						return true;
					}
				}
			} else {
				var description = currentWebsite.description.toLowerCase();
				var title = currentWebsite.title.toLowerCase();
				if (~description.indexOf(currentTerm) || ~title.indexOf(currentTerm)) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * Creates single card element based on given website metadata
	 * 
	 * @param  {Object} currentWebsite object that contains metadata
	 * @return {Object} website card dom element
	 */
	function createCard(currentWebsite) {
		var title = currentWebsite.title;
		var description = currentWebsite.description;
		var url = currentWebsite.url;

		var cardCell = document.createElement("div");
		cardCell.classList = "cell";

		var cardContainer = document.createElement("div");
		cardContainer.classList = "card";
		cardContainer.setAttribute("data-created-date", currentWebsite.createdDate);
		cardContainer.setAttribute("data-last-modified-date", currentWebsite.lastModifiedDate);

		var cardHeader = createCardHeader(title, url);
		var cardBody = createCardBody(description);
		var cardFooter = createCardFooter(currentWebsite);

		// set up card
		cardContainer.append(cardHeader);
		cardContainer.append(cardBody);
		cardContainer.append(cardFooter);

		// create cell
		cardCell.append(cardContainer);

		return cardCell;
	}

	/**
	 * Creates header section for card element
	 * 
	 * @param  {String} title title of website
	 * @param  {String} url   link to website
	 * @return {Object} card's header section dom element 
	 */
	function createCardHeader(title, url) {
		var cardHeader = document.createElement("div");
		cardHeader.classList = "card-header";

		var cardTitle = document.createElement("a");
		cardTitle.innerText = title;
		cardTitle.href = url;
		cardTitle.target = "_blank";
		cardHeader.append(cardTitle);

		return cardHeader;
	}

	/**
	 * Creates body section for card element
	 * 
	 * @param  {String} description website description metadata
	 * @return {Object} card's body section dom element
	 */
	function createCardBody(description) {
		var cardBody = document.createElement("div");
		cardBody.classList = "card-section";

		var cardDescription = document.createElement("p");
		cardDescription.innerText = description;
		cardBody.append(cardDescription);

		return cardBody;
	}

	/**
	 * Creates footer section for card element
	 * 
	 * @param  {Object} currentWebsite object that contains metadata
	 * @return {Object} card's footer section dom element
	 */
	function createCardFooter(currentWebsite) {
		var cardFooter = document.createElement("div");
		cardFooter.classList = "card-footer";

		var leftSpan = document.createElement("span");
		leftSpan.classList = "left";

		var rightSpan = document.createElement("span");
		rightSpan.classList = "right";
		var refreshIcon = createIcon("fa-refresh", syncWebsite, currentWebsite);
		var penIcon = createIcon("fa-pencil", setWebsiteDialog, currentWebsite);
		var tagIcon = createIcon("fa-tag", setWebsiteTagDialog, currentWebsite);
		var deleteIcon = createIcon("fa-trash", function () {
			deleteWebsite(currentWebsite, loadPageContent);
		});

		rightSpan.append(refreshIcon);
		rightSpan.append(penIcon);
		rightSpan.append(tagIcon);
		rightSpan.append(deleteIcon);

		cardFooter.append(leftSpan);
		cardFooter.append(rightSpan);

		return cardFooter;
	}

	/**
	 * Creates element for a given font awesome icon with an attached callback 
	 * 
	 * @param  {String}   iconClassName  font awesome class name
	 * @param  {Function} callback       callback, if any
	 * @param  {Object}   currentWebsite object that contains metadata
	 * @return {Object} font awesome icon element
	 */
	function createIcon(iconClassName, callback, currentWebsite) {
		var icon = document.createElement("i");
		icon.classList = "fa " + iconClassName;
		icon.setAttribute("aria-hidden", true);
		if (typeof callback === "function") {
			icon.addEventListener("click", function (event) {
					callback(currentWebsite);

			});
		}
		return icon;
	}

	// initialize all page content on load of the page
	initPage();

})(this);
