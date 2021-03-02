function addLoadEvent(func) {
  var oldOnload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      oldOnload();
      func();
    }
  }
}

function housekeeping() {

  if (!document.getElementById) return false;
  if (!document.getElementsByTagName) return false;

  var links = document.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {

    links[i].onfocus = function() {
      if(this.blur)this.blur();
    };
  }

/*
  cleanWhitespace(document.getElementById("menu"));
  var text = document.getElementsByTagName("body")[0].id.replace(/Page/, "") + "Href";
  var link = document.getElementById(text);
  alert(link.nextSibling.tagName);
  if (link.parentNode.id == "submenu") {
	if (link.nextSibling.tagName == "UL") {
	  link.parentNode.className = "selected";
	}
  } else if (link.parentNode.parentNode.parentNode.id == "submenu") {
    document.getElementById("submenu").className = "selected";
  }
*/

}

function cleanWhitespace(element) {
  var element = element || document;
  for (var x = 0; x < element.childNodes.length; x++) {
    var childNode = element.childNodes[x];
    if (childNode.nodeType == 3 && !/\S/.test(childNode.nodeValue)) {
      element.removeChild(element.childNodes[x]);
      x--;
    }
    if (childNode.nodeType == 1) {
      cleanWhitespace(childNode);
    }
  }
}

addLoadEvent(housekeeping);