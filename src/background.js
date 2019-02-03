/* File: background.js
 * ------------------
 *this is the background script
 *used to access chrome history data
 *since the content script is unable to access many of chrome's APIs
 */

// retrieving all chrome history
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	chrome.history.search({text:'', maxResults: 100}, function(results) {
		results.forEach(function(page) {
			if (page.url.indexOf('.com') >= 0) { // to strip everything after .com
				var shortUrl = page.url.substring(0, page.url.indexOf('.com') + '.com'.length);
			console.log(shortUrl);
			} else if (page.url.indexOf('.io') >= 0) { // to strip everything after .io
				var shortUrl = page.url.substring(0, page.url.indexOf('.io') + '.io'.length);
				console.log(shortUrl);
			} else if (page.url.indexOf('.org') >= 0) { // to strip everything after .org
				var shortUrl = page.url.substring(0, page.url.indexOf('.org') + '.org'.length);
				console.log(shortUrl);
			}
		});
	});
	sendResponse({success: "successfully retrieved chrome history data"});
});