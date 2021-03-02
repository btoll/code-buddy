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

function getElementsByClassName(classname){
  var a = [];
  var re = new RegExp('\\b' + classname + '\\b');
  var els = document.all ? document.all : document.getElementsByTagName("*");
  for (var i = 0, j = els.length; i < j; i++) {
    if (re.test(els[i].className)) {
      a.push(els[i]);
    }
  }
  return a;
}

function insertAfter(newElement, targetElement) {
  var parent = targetElement.parentNode;
  parent.lastChild == targetElement ? parent.appendChild(newElement) : parent.insertBefore(newElement, targetElement.nextSibling);
}

function housekeeping() {
  
  if (!document.getElementById) return false;
  if (!document.getElementsByTagName) return false;
  
  var links = document.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
    links[i].onfocus = function() { if(this.blur)this.blur(); };
  }
  
  var inputs = document.getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].getAttribute("type") == "submit") {
	  inputs[i].onfocus = function() { if(this.blur)this.blur(); };
	}
  }

  //the following are for the demo; check the cookie value and check the checkbox accordingly;
  accordion(document.cookie); //is the accordion set to open upon load?;
  if (document.cookie.indexOf("div=") != -1) 
    document.cookie.substring(document.cookie.indexOf("div=")+4, document.cookie.indexOf(";", document.cookie.indexOf("div=")+4)) == "true" ? document.getElementById("div").checked = true : document.getElementById("div").checked = false;

  if (document.cookie.indexOf("divHeader=") != -1)
    document.getElementById("divHeader").value = document.cookie.substring(document.cookie.indexOf("divHeader=")+10, document.cookie.indexOf(";", document.cookie.indexOf("divHeader=")+10));

  if (document.cookie.indexOf("yellowFade=") != -1)
    document.cookie.substring(document.cookie.indexOf("yellowFade=")+11, document.cookie.indexOf(";", document.cookie.indexOf("yellowFade=")+11)) == "true" ? document.getElementById("yellowFade").checked = true : document.getElementById("yellowFade").checked = false;

  if (document.cookie.indexOf("useSpan=") != -1)
    document.cookie.substring(document.cookie.indexOf("useSpan=")+8, document.cookie.indexOf(";", document.cookie.indexOf("useSpan=")+8)) == "true" ? document.getElementById("useSpan").checked = true : document.getElementById("useSpan").checked = false;

  if (document.cookie.indexOf("zipcode2=") != -1)
    document.getElementById("zipcode2").value = document.cookie.substring(document.cookie.indexOf("zipcode2=")+9, document.cookie.indexOf(";", document.cookie.indexOf("zipcode2=")+9));

  if (document.cookie.indexOf("email2=") != -1)
    document.getElementById("email2").value = document.cookie.substring(document.cookie.indexOf("email2=")+7, document.cookie.indexOf(";", document.cookie.indexOf("email2=")+7));

  if (document.cookie.indexOf("url2=") != -1)
    document.getElementById("url2").value = document.cookie.substring(document.cookie.indexOf("url2=")+5, document.cookie.indexOf(";", document.cookie.indexOf("url2=")+5));

  if (document.cookie.indexOf("date2=") != -1)
    document.getElementById("date2").value = document.cookie.substring(document.cookie.indexOf("date2=")+6, document.cookie.indexOf(";", document.cookie.indexOf("date2=")+6));

  if (document.cookie.indexOf("keepOpen=") != -1)
    document.cookie.substring(document.cookie.indexOf("keepOpen=")+9, document.cookie.length) == "true" ? document.getElementById("keepOpen").checked = true : document.getElementById("keepOpen").checked = false;

  //validation.html;
  if (document.getElementById("theForm")) {
    document.getElementById("theForm").onsubmit = function() { return scrubber.Class.validate(this); };
	for (var i = 0; i < document.getElementById("theForm").elements.length; i++) {
	  if (document.getElementById("theForm").elements[i].getAttribute("type") != "submit") {
		if (document.all) {
		  document.getElementById("theForm").elements[i].attachEvent("onblur", scrubber.Class.validate);
		  document.getElementById("theForm").elements[i].style.backgroundColor = "rgb(255, 255, 255)"; //this fixes the border issue in IE;
		} else {
	      document.getElementById("theForm").elements[i].addEventListener("blur", scrubber.Class.validate, false);
		}
	  }
	}
  }

  //for the Accordion;
  var headers = document.getElementById("accordion-menu").getElementsByTagName("h4");
  for (var k = 0; k < headers.length; k++) {
	var anchor = document.createElement("a");
	anchor.setAttribute("href", "#");
	anchor.onfocus = function() { if(this.blur)this.blur(); }
	anchor.onclick = function() { accordion(this); return false; }
	var text = document.createTextNode(headers[k].firstChild.nodeValue);
	//if (headers[k].className == "first") { anchor.className = "first"; }
	anchor.appendChild(text);
    insertAfter(anchor, headers[k]);
	headers[k].style.display = "none";
  }
  
  var divs = document.getElementById("accordion-menu").getElementsByTagName("div");
  for (var j = 0; j < divs.length; j++) {
	divs[j].style.height = "0px";
	divs[j].style.overflow = "hidden";
	divs[j].divHeight = divs[j].scrollHeight;
	divs[j].state = "closed"; //establish the property that will toggle between the opened or closed state of the div;
  }
  
  if (document.getElementById("cookieForm")) {
    document.getElementById("cookieForm").onsubmit = function() { return setCookies(this); };
  }

}

function accordion(elem) {

  if (typeof elem == "object") { //'elem' is an object the first time the function is called;
    if (elem.nextSibling.nodeType == 1) { //there's no whitespace in between <a> and <div>;
	  var div = elem.nextSibling;
    } else if (elem.nextSibling.nodeType == 3) { //there's whitespace;
	  var div = elem.nextSibling.nextSibling;
    }
    var currentHeight = parseInt(div.style.height.replace(/px/,"")); //convert the height to a number or 'currentHeight + 10' will add two strings together instead of two numbers;
	
  } else if (typeof elem == "number") { //the function is recursing until it fully opens or closes the div and so 'elem' is equal to the id of the div;
    var div = document.getElementById(elem);
	var currentHeight = parseInt(div.style.height.replace(/px/,"")); //convert the height to a number or 'currentHeight + 10' will add two strings together instead of two numbers;
  } else if (typeof elem == "string") { //the cookie is passed when the page is first loaded;
    //since there's only one div w/in div#accordion-menu, hardcode the div id and the currrentheight;
	var theCookie = elem.substring(document.cookie.indexOf("keepOpen=")+9, document.cookie.length);
	if (theCookie == "true") { //open when page loads;
      var div = document.getElementById("1");
	  var currentHeight = 0;
	  div.divHeight = document.getElementById("1").scrollHeight;
	  div.state = "closed";
	} else return; //don't open div#accordion-menu when the page loads;
  }

  if (div.state == "closed") { //open the div;
    if (currentHeight < div.divHeight) {
	  div.style.height = (currentHeight + 10) + "px";
	  div.className = "opened";
      setTimeout("accordion("+div.id+")", 10);  
    } else { //div is fully opened so let div.state reflect that;
	  div.state = "opened";
	}
	
  } else if (div.state == "opened") { //close the div;
    if (currentHeight > 10) {
	  div.style.height = (currentHeight - 10) + "px";
      setTimeout("accordion("+div.id+")", 10);
    } else { //div is fully closed so let div.state reflect that;
	  div.className = "closed";
	  div.state = "closed";
	  div.style.height = "0";
	}
  }

}

function setCookies() {

  if (navigator.cookieEnabled) {
	var div = document.getElementById("div").checked ? true : false;
	var divHeader = document.getElementById("divHeader").value;
	var yellowFade = document.getElementById("yellowFade").checked ? true : false;
	var useSpan = document.getElementById("useSpan").checked ? true : false;
	var zipcode2 = document.getElementById("zipcode2").value;
	var email2 = document.getElementById("email2").value;
	var url2 = document.getElementById("url2").value;
	var date2 = document.getElementById("date2").value;
	var keepOpen = document.getElementById("keepOpen").checked ? true : false;

	document.cookie = "max-age=" + (60*60*24*365); //set for a year;
	document.cookie = "div=" + div;
	document.cookie = "divHeader=" + divHeader;
	document.cookie = "yellowFade=" + yellowFade;
	document.cookie = "useSpan=" + useSpan;
	document.cookie = "zipcode2=" + zipcode2;
	document.cookie = "email2=" + email2;
	document.cookie = "url2=" + url2;
	document.cookie = "date2=" + date2;
	document.cookie = "keepOpen=" + keepOpen;
	validate(document.getElementById("theForm"));
	return false;

  } else {
	alert('Cookies may not be enabled on this browser.');
	return false;
  }

}

addLoadEvent(housekeeping);