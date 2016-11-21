$('body *').map(function(i, v) { applyReplacements(v); } );

function applyReplacements(node) {
    var gReplacements = ["teste", "velocidade", "não habilitados"];
    var gBannedTags = ["STYLE", "SCRIPT", "NOSCRIPT", "TEXTAREA"];

	// Ignore any node whose tag is banned
	if( !node || $.inArray( node.tagName, gBannedTags ) !== -1 ) return;

	try 
	{
		$(node).contents().each(function(i, v) {
			// Ignore any child node that has been replaced already or doesn't contain text
			if( v.isReplaced || v.nodeType !== Node.TEXT_NODE ) return;

			// Apply each replacement in order
			gReplacements.forEach( function(replacement) {
				//if( !replacement.active ) return;
                var matchedText = v.textContent.match(new RegExp(replacement, "i"));

                if (matchedText) {
                    // Use `` instead of '' or "" if you want to use ${variable} inside a string
                    // For more information visit https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
                    var replacedText = node.innerHTML.replace(new RegExp(`(${replacement})`, "i"), "<span class='toHighlight' style=\"background-color: yellow\">$1</span>");

                    node.innerHTML = replacedText;
                }
			});

			v.isReplaced = true;
		});
	} catch( err ) {
		// Basically this means that an iframe had a cross-domain source, and WR can't do much about it.
		if( err.name === "SecurityError" ); 
		else throw err;
	}
}