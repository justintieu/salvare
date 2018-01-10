# Chrome Extension: Salvare

Table of Contents
=================
* [What does the Chrome Extension do?](#what-does-the-chrome-extension-do)
* [Install)(#install)
* [How to save a website into Salvare?](#how-to-save-a-website-into-salvare)
* [How to access websites saved to Salvare?](#how-to-acccess-websites-saved-to-salvare)
* [Features](#features)
  * [Configurable Metadata](#configurable-metadata)
  * [Configurable Tags](#configurable-tags)
  * [Resync Metadata](#resync-metadata)
  * [Search](#search)
  * [Sync across Computers](#sync-across-computers)

## What does the Chrome Extension do?
Salvare is an enhanced bookmark manager that has additional capabilities to save and search for saved websites.
Salvare will store both title and description metadata, which are both searchable through the options page.
In addition, there is a tagging system which allows users to add relevant tags for each website they would like to save.

## Install 
Install the Chrome Extension through the [Google Chrome Web Store](https://chrome.google.com/webstore/detail/nheegfpibkcdkjhkecokjgibkbollccd/)

## How to save a website into Salvare?
There are two ways to save a website into Salvare. 
1. Left-click the grey star icon in the Chrome menu bar to save a website.
![Address bar with grey star icon](https://raw.githubusercontent.com/justintieu/salvare/master/markdown-images/chrome-ext-icon-website-not-saved.png) 
After clicking on the grey star icon, it will turn blue to indicate that the current page has been saved.
![Address bar with grey star icon](https://raw.githubusercontent.com/justintieu/salvare/master/markdown-images/chrome-ext-icon-website-saved.png) 

2. Right-click a link and a menu will show with the option to save the link to Salvare.
![Right click menu](https://raw.githubusercontent.com/justintieu/salvare/master/markdown-images/right-click-context-menu.png)

## How to delete a website from Salvare?
If you are already on the page that has been saved by Salvare, you should see the blue star in the Chrome Menu bar. 
Simply click on the blue star, and it will turn grey to indicate that the current page has been deleted from Salvare.
Alternatively, you can delete a website by accessing all websites in Salvare's option page and click on the trash icon for the website you want to remove.

## How to access websites saved to Salvare?
In order to access websites saved to Salvare, you will need to access the extension's option page. 
To find the options page, you would have to go through the chrome menu -> More Tools -> Extensions -> find the Salvare extension -> click on Options
![Salvare Options Page](https://raw.githubusercontent.com/justintieu/salvare/master/markdown-images/options-page.png)

## Features
As of version 1.0.0, we have the following features

### Resync Metadata
The first icon is known as the sync icon. This icon will do a resync of metadata for the title, description and tags.
This resync is irreversible and there is currently no prompt to ask if you would like the latest updates from the website.
Title and description will be updated to the latest information from the given URL, and all tags will be deleted.

### Configurable Metadata
![Edit Website Dialog](https://raw.githubusercontent.com/justintieu/salvare/master/markdown-images/edit-website-dialog.png)
Similarly to Google Chrome's bookmarks, you are allowed to edit a saved website's title and URL. 
Salvare also allows users to add a descriptions, but the read only view will have the description truncated after 7 lines.

### Configurable Tags
![Edit Tags Dialog](https://raw.githubusercontent.com/justintieu/salvare/master/markdown-images/edit-tags-dialog.png)
There is a tagging system that allows users to set multiple tags for each website stored in Salvare. 
You may use the left (or up) and right (or down) arrows to choose where you would like to type your tags. 

### Search
You are allowed to search based on tags or metadata (title or description). The search will only execute after you click on your Enter key.

Any spaces in your tag names will require a hypen in lieu of a space. Searching for tags will require you to search similar to the following: 

```tag:name-of-tag``` 


You are allow to search for multiple tags at the same time by performing search similar to the following: 

```tag:name-of-tag-1 tag:name-of-tag-2```

Searching metadata will be based on the provided keywords typed. If the title or description contains at least one of the keywords, it will appear in the results.

If you were to forget to search without any hyphens, the word(s) that appears after the space will be looked at as a keyword.
If you were not to use hyphens in the first example, search will look for saved websites with the tag `name` or metadata which has the keyword `of` or `tag`

### Sync across Computers
Salvare allows users to sync their saved websites across different computers. The only prerequisite is that you must log into your Gmail account on the browser on the top right corner.
