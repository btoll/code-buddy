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

function getElementsByClassName(classname) {
  var a = [];
  var re = new RegExp('\\b' + classname + '\\b');
  var els = document.all?document.all:document.getElementsByTagName("*");
  for (var i = 0, j = els.length; i < j; i++) {
    if (re.test(els[i].className)) {
      a.push(els[i]);
    }
  }
  return a;
}

function $(sName) {
  return document.getElementById(sName);
}

var ScrollMenu = (function () {

  var setMenu = function (vElem) {

    var oDiv, iCurrentHeight, iTimeout;
    var getCurrentHeight = function (oDiv) {
      return parseInt(oDiv.style.height.replace(/px/,""), 10); //convert the height to a number or 'currentHeight + 10' will add two strings together instead of two numbers;
    };

    var closeDiv = function (sId) {
      /*NOTE if more than one argument was passed then use these as the function args for setTimeout*/
      var oDiv = $(sId);
      iCurrentHeight = getCurrentHeight(oDiv);

      if (iCurrentHeight > 10) {
        oDiv.style.height = (iCurrentHeight - 10) + "px";
        iTimeout = setTimeout(arguments[1] || function () { closeDiv(oDiv.id); }, arguments[2] || 450); //increasing the milliseconds creates a cool sliding effect;
      } else { //div is fully closed so let div.state reflect that;
        clearTimeout(iTimeout);
        oDiv.className = "closed";
        oDiv.state = "closed";
        oDiv.style.height = "0";
      }
    };
  
    oDiv = typeof vElem === "object" ? $("menu-" + vElem.rel) : $(vElem);

    //first close any divs (other than the selected div) that may currently be opened;
    var cOpenDivs = getElementsByClassName("opened");
    if (cOpenDivs.length > 0) {
      for (var i = 0, iLength = cOpenDivs.length; i < iLength; i++) {
        if (cOpenDivs[i].id != oDiv.id) { //close the previously opened div;
          closeDiv(cOpenDivs[i].id);
        }
      }
    }

    iCurrentHeight = getCurrentHeight(oDiv);
	
    if (oDiv.state == "closed") { //open the div;
      if (iCurrentHeight < oDiv.divHeight) {
        oDiv.style.height = (iCurrentHeight + 10) + "px";
        oDiv.className = "opened";
        iTimeout = setTimeout(function () { setMenu(oDiv.id); }, 50);
      } else { //div is fully opened so let div.state reflect that;
        clearTimeout(iTimeout);
        oDiv.state = "opened";
      }
	
    } else if (oDiv.state == "opened") { //close the div;
      closeDiv(oDiv.id, function () { setMenu(oDiv.id); }, 50);
    }

    //setTimeout(function () { closeDiv(myDiv.id); }, 10000); //close any opened div after 10 seconds;

  };

  return function () {

    if (!document.getElementById) return false;
    if (!document.getElementsByTagName) return false;

    var cLinks = document.getElementsByTagName("a");
    for (var i = 0, iLength = cLinks.length; i < iLength; i++) {
      cLinks[i].onfocus = function() { if(this.blur)this.blur(); };
      cLinks[i].onclick = function() { return false; };
    }

    cLinks = $("nav").getElementsByTagName("a");
    for (var i = 0, iLength = cLinks.length; i < iLength; i++) {
      cLinks[i].onclick = function() { setMenu(this); return false; }
    }

    var cDivs = $("accordion-menu").getElementsByTagName("div");
    for (var i = 0, iLength = cDivs.length; i < iLength; i++) {
      cDivs[i].style.overflow = "hidden";
      cDivs[i].style.height = "0px";
      cDivs[i].divHeight = cDivs[i].scrollHeight;
      cDivs[i].state = "closed"; //establish the property that will toggle between the opened or closed state of the div;
    }
  };

})();

addLoadEvent(ScrollMenu);
