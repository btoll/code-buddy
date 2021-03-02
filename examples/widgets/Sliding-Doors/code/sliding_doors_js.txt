function $(sElem) {
	return document.getElementById(sElem);
}
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

function getElementsByClassName(classname, rootElem, searchBy) {
  if (!classname) return false; //exit the function if no classname is provided;
  var a = [];
  var re = new RegExp('\\b' + classname + '\\b');
  if (rootElem)
    var els = $(rootElem).getElementsByTagName(searchBy);
  else
    var els = document.getElementsByTagName("*") || document.all;
	
  for (var i = 0, j = els.length; i < j; i++) {
    if (re.test(els[i].className)) {
      a.push(els[i]);
    }
  }
  return a;
}

function slidingDoors(obj) {

   var fnHookup = function (obj) {
      /*exit if the tab is already selected*/
      if (obj.parentNode.id == "selected") return false;
	  
      var cLis = $("slidingDoorsMenu").getElementsByTagName("li");
      for (var i = 0, iLength = cLis.length; i < iLength; i++) {
        cLis[i].id = ""; //clear the id of all elements;
      }
      /*now set the id for the selected tab*/
      obj.parentNode.id = "selected";
   
      /*now iterate through the divs and hide all but the one
        that matches the text of the selected href*/
      var oDivs = getElementsByClassName("slidingDoor");
      for (var i = 0, iLength = oDivs.length; i < iLength; i++) {
        if (oDivs[i].id == obj.rel) {
          oDivs[i].className = oDivs[i].className.replace(/hide/, "");
        } else {
          /*only add the classname if it doesn't already have it*/
          if (oDivs[i].className.indexOf("hide") == -1) {
            oDivs[i].className += " hide";
          }
        }
      }
    };

    var cLinks = $("slidingDoorsMenu").getElementsByTagName("a");
    for (var i = 0, iLength = cLinks.length; i < iLength; i++) {
      cLinks[i].onclick = function(that) {
        fnHookup(this);
        return false;
      };
      cLinks[i].onfocus = function () { if (this.blur) this.blur(); };
    }

}

addLoadEvent(slidingDoors);