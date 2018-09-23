function blink_element(el){
	color1 = "#FF0000"
	color2 = "#FFFFFF"
	el.animate({"background-color": color1}, 200)
	.animate({"background-color": color2}, 200)
	.animate({"background-color": color1}, 200)
	.animate({"background-color": color2}, 200)
	.animate({"background-color": color1}, 200)
	.animate({"background-color": color2}, 200)
}

function trim_char(s, c){
	if (c === "]") c = "\\]";
	if (c === "\\") c = "\\\\";
	return s.replace(new RegExp(
		"^[" + c + "]+|[" + c + "]+$", "g"
	), "");
}
function alert_json(obj){
	alert( JSON.stringify(obj) )
}
function log_json(obj){
	$("#out").val( JSON.stringify(obj) + "\n" + $("#out").val() )
}

function replace_spaces(str, char){
	return str.replace(/\s/g, char)
}

function fix_jquery_selector( id ) { //https://learn.jquery.com/using-jquery-core/faq/how-do-i-select-an-element-by-an-id-that-has-characters-used-in-css-notation/
	// works ()@#/,[ ]|~`!$%^*&=+{};':<>?,./
	// jquery invalid characters space
	// id = id.replace( /(\||\@|\#|\s|\,|\/|\[|\]|\(|\))/g, "\\$1" );
	id = id.replace( /(;|:|=|`|'|<|>|,|\.|\?|!|@|#|\/|\{|\}|~|%|\^|&|\+|\s|\[|\]|\\|\^|\$|\.|\||\?|\*|\+|\(|\))/g, "\\$1" );

	return id
}

function getSelectionText(id) {
    var text = "";

    var activeEl = document.getElementById(id);

    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;

    if (
      (activeElTagName == "textarea") || (activeElTagName == "input" && /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) && (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);

    } else if (window.getSelection) {
		text = window.getSelection().toString();

	}
	// window.getSelection().removeAllRanges()
    return text;
}

function press_key(letter, alt, ctrl, shift, meta, bubbles){
	var e = new Event("keydown");
	e.key=letter;    // just enter the char you want to send
	e.keyCode=e.key.charCodeAt(0);
	e.which=e.keyCode;
	e.altKey=alt;
	e.ctrlKey=ctrl;
	e.shiftKey=shift;
	e.metaKey=meta;
	e.bubbles=bubbles;
	document.dispatchEvent(e);
}

function openURL(url){
	var shell = new ActiveXObject("WScript.Shell");
	shell.run(url);
}

function genguid() {
		function s4() {
				return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function copyToClipboard(elem) {
	// create hidden text element, if it doesn't already exist
	var targetId = "_hiddenCopyText_";
	var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
	var origSelectionStart, origSelectionEnd;
	if (isInput) {
		// can just use the original source element for the selection and copy
		target = elem;
		origSelectionStart = elem.selectionStart;
		origSelectionEnd = elem.selectionEnd;
	} else {
		// must use a temporary form element for the selection and copy
		target = document.getElementById(targetId);
		if (!target) {
			var target = document.createElement("textarea");
			target.style.position = "absolute";
			target.style.left = "-9999px";
			target.style.top = "0";
			target.id = targetId;
			document.body.appendChild(target);
		}
		target.textContent = elem.textContent;
	}
	// select the content
	var currentFocus = document.activeElement;
	target.focus();
	target.setSelectionRange(0, target.value.length);

	// copy the selection
	var succeed;
	try {
		succeed = document.execCommand("copy");
	} catch(e) {
		succeed = false;
	}
	// restore original focus
	if (currentFocus && typeof currentFocus.focus === "function") {
		currentFocus.focus();
	}

	if (isInput) {
		// restore prior selection
		elem.setSelectionRange(origSelectionStart, origSelectionEnd);
	} else {
		// clear temporary content
		target.textContent = "";
	}
	return succeed;
}