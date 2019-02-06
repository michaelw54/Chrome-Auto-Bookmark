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
    var minEl = array[0], minCount = 1;
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
	    if (modeMap[el] < minCount)
		{
		    minEl = el;
		    minCount = modeMap[el];
		}
	}
    return [maxEl, modeMap, minEl];
}

// return six keys with the largest values in a map/dict
function getTopSix(modeMap, minEl) {
    var topSix = [];
    while (topSix.length < 6 || topSix.length == modeMap.size) {
      var biggest = minEl;
      for (var key in modeMap) {
        console.log(key + ": " + modeMap[key]);
        console.log(topSix.indexOf(key))
        if (topSix.indexOf(key) == -1) {
          if (modeMap[key] > modeMap[biggest]) biggest = key;
        } else {
          continue;
        }
      }
      topSix.push(biggest);
    }
      return topSix;
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

var autoBookmarksId;
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message == "intialize bookmarks folder") {
  chrome.bookmarks.search({'title': "Automatic Bookmarks"}, function(Autoresults) {
    console.log(Autoresults);
    console.log("CONNECTED!");
    if (Autoresults.length > 0) {
        autoBookmarksId = Autoresults[0].id;
        console.log("automatic bookmarks id: " + autoBookmarksId);
    } else {
        chrome.bookmarks.create({'parentId': '1', 'title': "Automatic Bookmarks"}, function(result) {
        autoBookmarksId = result.id;
        console.log("automatic bookmarks id: " + autoBookmarksId);
      });
    }
  });
  sendResponse({success: "successfully intialized Autobookmarks Folder"});
}
});

// retrieving all chrome history
var fullHistory = [];
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message == "bookmark URLs") {
	chrome.history.search({text:'', maxResults: 1000}, function(results) {
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
  })
  sendResponse({success: "successfully retrieved chrome history data"});
}});

		// logging all shortened URLs in background console
		/*
		fullHistory.forEach(function(url) {
			console.log(url);
		});
		*/

    // mode(fullHistory) is a Map containing {Most visited URL, [URL, # of visits], Least visited URL}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log(fullHistory);
  var mostVisited = getTopSix(mode(fullHistory)[1], mode(fullHistory)[2]);
  if (message == "create bookmarks"){
    mostVisited.forEach(function(URL) {
      console.log(URL);
      chrome.bookmarks.search({'title': URL}, function(results) {
        if (results.length > 0) {
          console.log("Bookmark already exists for this URL: " + URL);
        }
        else {
          chrome.bookmarks.create({'parentId': autoBookmarksId, 'title': URL, 'url': URL}, function(bookmark) {
            console.log("Created bookmark: " + bookmark.url);
          });
        }
      });
    });
  }
    sendResponse({success: "successfully created bookmarks"});
  });
