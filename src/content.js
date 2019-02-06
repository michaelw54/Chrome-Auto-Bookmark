/* File: content.js
 * ---------------
 * Hello! You'll be making most of your changes
 * in this file. At a high level, this code replaces
 * the substring "cal" with the string "butt" on web pages.
 *
 * This file contains javascript code that is executed
 * everytime a webpage loads over HTTP or HTTPS.
 */

// send a message to background.js to retrieve chrome history
chrome.runtime.sendMessage(
  "intialize bookmarks folder",
  function(response) {
      console.log(response.success);
  }
);

chrome.runtime.sendMessage(
    "bookmark URLs",
    function(response) {
        console.log(response.success);
        chrome.runtime.sendMessage(
            "create bookmarks",
            function(response) {
                console.log(response.success);
              }
            )
    }
);

// setTimeout(chrome.runtime.sendMessage(
//     "create bookmarks",
//     function(response) {
//         console.log(response.success);
//       }
//     ), 10000);

/*
// adding a button to every "div" class of the page
var unorderedLists = document.getElementsByTagName("ul"); // get all dem ULs

for (var i=0; i < unorderedLists.length; i++) {
    // alert("found a list!");
    var greeting = "gotcha bitch";
    var myListEntry = document.createElement('li');
    var myText = document.createTextNode("hahaha gotcha bitch");
    var myButton = document.createElement('button');
    myButton.setAttribute('content', 'test content');
    myButton.setAttribute('class', 'btn');
    myButton.innerHTML = 'test button';

    myButton.addEventListener("click", function() {
	alert(greeting + ".");
    }, false);

    myListEntry.appendChild(myText);
    myListEntry.appendChild(myButton);
    unorderedLists[i].appendChild(myListEntry);
}



// replacing cal with butt
var elements = document.getElementsByTagName('*');

for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    for (var j = 0; j < element.childNodes.length; j++) {
        var node = element.childNodes[j];

        if (node.nodeType === 3) {
            var text = node.nodeValue;
            var replacedText = text.replace(/cal/gi, "butt"); // replaces "cal," "Cal", etc. with "butt"

            if (replacedText !== text) {
                element.replaceChild(document.createTextNode(replacedText), node);
              }
        }
    }
}
*/
