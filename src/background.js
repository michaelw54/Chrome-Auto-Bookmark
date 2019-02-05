/* File: background.js
 * ------------------
 *this is the background script
 *used to access chrome history data
 *since the content script is unable to access many of chrome's APIs
 */

// function that returns the highest occurence element in an array
function mode(array)
{
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
	{
	    var el = array[i];
	    if(modeMap[el] == null)
		modeMap[el] = 1;
	    else
		modeMap[el]++;  
	    if(modeMap[el] > maxCount)
		{
		    maxEl = el;
		    maxCount = modeMap[el];
		}
	}
    return [maxEl, modeMap];
}

// used this to retrieve the id of all bookmarks/the bookmarks bar
function printBookmarks(id) {
    chrome.bookmarks.getChildren(id, function(children) {
	    children.forEach(function(bookmark) { 
		    console.log(bookmark.title + ": " + bookmark.id);
		    printBookmarks(bookmark.id);
		});
	});
}

// printBookmarks('0');

// retrieving all chrome history
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	chrome.history.search({text:'', maxResults: 1000}, function(results) {
		var fullHistory = [];
		results.forEach(function(page) {
			if (page.url.indexOf('.com') >= 0) { // to strip everything after .com
				var shortUrl = page.url.substring(0, page.url.indexOf('.com') + '.com'.length);
				fullHistory[fullHistory.length] = shortUrl;
			} else if (page.url.indexOf('.io') >= 0) { // to strip everything after .io
				var shortUrl = page.url.substring(0, page.url.indexOf('.io') + '.io'.length);
				fullHistory[fullHistory.length] = shortUrl;
			} else if (page.url.indexOf('.org') >= 0) { // to strip everything after .org
				var shortUrl = page.url.substring(0, page.url.indexOf('.org') + '.org'.length);
				fullHistory[fullHistory.length] = shortUrl;
			} else if (page.url.indexOf('.edu') >= 0) { // to strip everything after .edu
				var shortUrl = page.url.substring(0, page.url.indexOf('.edu') + '.edu'.length);
				fullHistory[fullHistory.length] = shortUrl;
			}		
		});
		// logging all shortened URLs in background console
		/*
		fullHistory.forEach(function(url) {
			console.log(url);
		});
		*/

		//search if bookmark already created
		chrome.bookmarks.search({title: mode(fullHistory)[0]},
					function(results) {
					    var bookmarkExists = false;
					    var bookmarksId;
					    // create a bookmarks folder called "automatic bookmarks" (if not already created) in the bookmarks bar
					    
					    chrome.bookmarks.search({'title': "automatic bookmarks"}, function(Autoresults) {
						    if (Autoresults.length > 0) {
							bookmarksId = Autoresults[0].id;
							console.log("automatic bookmarks id: " + bookmarksId);
							if (results.length > 0) {
							    bookmarkExists = true;
							    console.log("Bookmark already exists for this URL!");
							}
							else if (mode(fullHistory)[1][mode(fullHistory)[0]] > 15 && !(bookmarkExists)) {
							    alert("You've visited " + mode(fullHistory)[0] + " " + mode(fullHistory)[1][mode(fullHistory)[0]] + " times today, so we've decided to bookmark it for you!");
							    // create a new bookmark
							    var bookmarkString = mode(fullHistory)[0];
							    console.log("parentId: " + bookmarksId);
							    chrome.bookmarks.create({'parentId': bookmarksId, 'url': bookmarkString, 'title': bookmarkString},
										    function(result) {
											console.log("bookmark created: " + result.url);
										    });
							}
						    }
						    else {
							chrome.bookmarks.create({'parentId': '1', 'title': "automatic bookmarks"}, function(result) {
								bookmarksId = result.id;
								console.log("automatic bookmarks id: " + bookmarksId);
								if (results.length > 0) {
								    bookmarkExists = true;
								    console.log("Bookmark already exists for this URL!");
								}
								else if (mode(fullHistory)[1][mode(fullHistory)[0]] > 15 && !(bookmarkExists)) {
								    alert("You've visited " + mode(fullHistory)[0] + " " + mode(fullHistory)[1][mode(fullHistory)[0]] + " times today, so we've decided to bookmark it for you!");
								    // create a new bookmark
								    var bookmarkString = mode(fullHistory)[0];
								    console.log("parentId: " + bookmarksId);
								    chrome.bookmarks.create({'parentId': bookmarksId, 'url': bookmarkString, 'title': bookmarkString},
											    function(result) {
												console.log("bookmark created: " + result.url);
											    });
								}
							    });						       
						    }						    
						});
					});
	    });
	sendResponse({success: "successfully retrieved chrome history data"});
    });