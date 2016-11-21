$('body *').map(function(i, v) { applyReplacements(v); } );

function applyReplacements(node) {
    var g_replacements = ['teste'];
    var g_bannedtags = ['STYLE', 'SCRIPT', 'NOSCRIPT', 'TEXTAREA'];

	// Ignore any node whose tag is banned
	if( !node || $.inArray( node.tagName, g_bannedtags ) !== -1 ) return;

	try 
	{
		$(node).contents().each(function(i, v) {
			// Ignore any child node that has been replaced already or doesn't contain text
			if( v.isReplaced || v.nodeType != Node.TEXT_NODE ) return;

			// Apply each replacement in order
			g_replacements.forEach( function(replacement) {
				//if( !replacement.active ) return;
                var matchedText = v.textContent.match(/teste/i);

                if (matchedText) {
                    var replacedText = node.innerHTML.replace(/(teste)/i, "<span class='toHighlight' style=\"background-color: yellow\">$1</span>");

                    node.innerHTML = replacedText;
                }
			});

			v.isReplaced = true;
		});
	} catch( err ) {
		// Basically this means that an iframe had a cross-domain source, and WR can't do much about it.
		if( err.name == 'SecurityError' ); 
		else throw err;
	}
}