var hwReplacements;
var hwBannedTags = ["STYLE", "SCRIPT", "NOSCRIPT", "TEXTAREA"];

function applyReplacementRule(node) {
    // Ignore any node whose tag is banned
    if (!node || $.inArray(node.tagName, hwBannedTags) !== -1) { return; }

    try {
        $(node).contents().each(function (i, v) {
            // Ignore any child node that has been replaced already or doesn't contain text
            if (v.isReplaced || v.nodeType !== Node.TEXT_NODE) { return; }

            // Apply each replacement in order
            hwReplacements.then(function (replacements) {
                replacements.words.forEach(function (replacement) {
                    //if( !replacement.active ) return;
                    var matchedText = v.textContent.match(new RegExp(replacement, "i"));

                    if (matchedText) {
                        // Use `` instead of '' or "" if you want to use ${variable} inside a string
                        // For more information visit https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
                        var replacedText = node.innerHTML.replace(new RegExp(`(${replacement})`, "i"), "<span style=\"background-color: #ffff00\">$1</span>");

                        node.innerHTML = replacedText;
                    }
                });
            }).catch(function (reason) {
                console.log("Handle rejected promise (" + reason + ") here.");
            });

            v.isReplaced = true;
        });
    } catch (err) {
        // Basically this means that an iframe had a cross-domain source
        if (err.name !== "SecurityError")
        { throw err; }
    }
}

function storeWords(wordList) {
    chrome.storage.local.set({ "words": wordList }, function () { });
}

function getWordList() {
    var words = [];

    $(".wordList li").each(function (index, element) {
        words.push(element.textContent.trim());
    });

    return words;
}

chrome.extension.onMessage.addListener(function (message, sender, callback) {
    if (message.wordToHighlight) {
        console.log(message.wordToHighlight);
        hwReplacements.then(function (wordList) {
            wordList.words.push(message.wordToHighlight);
            storeWords(wordList.words);
        });
    }
});

hwReplacements = new Promise(function (resolve, reject) {
    chrome.storage.local.get("words", function (items) {
        resolve(items);
    });
});

$(function () {
    $("body *").map(function (i, v) { applyReplacementRule(v); });

    $(document).on("click", ".fa-trash", function () {
        $(this).parent().remove();

        storeWords(getWordList());
    });

    $(document).on("click", ".fa-plus-circle", function () {
        var newWord = "array";

        $(".wordList").append(`<li>${newWord} <i class="fa fa-trash right" aria-hidden="true"></i></li>`);

        storeWords(getWordList());
    });

    hwReplacements.then(function (replacements) {
        replacements.words.forEach(function (replacement, index) {
            $(".wordList").append(`<li>${replacement} <i class="fa fa-trash right" aria-hidden="true"></i></li>`);
        });
    }).catch(function (reason) {
        console.log("Handle rejected promise (" + reason + ") here.");
    });
});