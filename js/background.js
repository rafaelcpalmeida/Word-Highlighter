function addHighlightableExpression(info, tab) {
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "wordToHighlight": info.selectionText
        });
    });
}

var contexts = ["selection"];

for (var i = 0; i < contexts.length; i++) {
    var context = contexts[i];
    var title = "Highlight expression";
    var id = chrome.contextMenus.create({
        "title": title,
        "contexts": [context],
        "onclick": addHighlightableExpression
    });
}