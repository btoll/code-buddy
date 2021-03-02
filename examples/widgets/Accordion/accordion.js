var Accordion = {
 
  addLoadEvent: function (func) {
    var oldOnload = window.onload;
    if (typeof window.onload != 'function') {
      window.onload = func;
    } else {
      window.onload = function() {
        oldOnload();
        func();
      }
    }
  },

  cleanWhitespace: function (vElem) {
    var oRoot = (vElem && vElem.constructor == String ? document.getElementById(vElem) : vElem) || document; //if an argument is provided then use that as the parent element, else use the document object;
    for (var i = 0; i < oRoot.childNodes.length; i++) {
      var oChildNode = oRoot.childNodes[i];
      if (oChildNode.nodeType == 3 && !/\S/.test(oChildNode.nodeValue)) {
        oRoot.removeChild(oRoot.childNodes[i]);
        i--;
      }
      if (oChildNode.nodeType == 1) {
        arguments.callee(oChildNode);
      }
    }
  },

  insertAfter: function (oNewElement, oTargetElement) {
    var oParent = oTargetElement.parentNode;
    if (oParent.lastChild == oTargetElement) {
      oParent.appendChild(oNewElement);
    } else {
      oParent.insertBefore(oNewElement, oTargetElement.nextSibling);
    }
  },

  housekeeping: function () {
    if (!document.getElementById) return false;
    if (!document.getElementsByTagName) return false;

    Accordion.cleanWhitespace("accordion-menu");
    var cHeaders = document.getElementById("accordion-menu").getElementsByTagName("h4");
    for (var k = 0; k < cHeaders.length; k++) {
      var oAnchor = document.createElement("a");
      oAnchor.setAttribute("href", "#");
      oAnchor.onfocus = function() { if(this.blur)this.blur(); }
      oAnchor.onclick = function(oDiv) { return function() { Accordion.accordion(oDiv); return false; }; }(cHeaders[k].nextSibling);
      var oText = document.createTextNode(cHeaders[k].firstChild.nodeValue);
      if (cHeaders[k].className == "first") { oAnchor.className = "first"; }
      oAnchor.appendChild(oText);
      Accordion.insertAfter(oAnchor, cHeaders[k]);
      cHeaders[k].style.display = "none";
    }
  
    var cDivs = document.getElementById("accordion-menu").getElementsByTagName("div");
    var iDivsLength = cDivs.length;
    for (var j = 0; j < iDivsLength; j++) {
      cDivs[j].style.height = "0px";
      cDivs[j].style.overflow = "hidden";
      cDivs[j].divHeight = cDivs[j].scrollHeight;
      cDivs[j].state = "closed"; //establish the property that will toggle between the opened or closed state of the div;
    }
  },

  accordion: function (oDiv) {
    var iCurrentHeight = parseInt(oDiv.style.height.replace(/px/, "")); //convert the height to a number or "currentHeight + 10" will add two strings together instead of two numbers;

    if (oDiv.state == "closed") { //open the div;
      if (iCurrentHeight < oDiv.divHeight) { //remember oDiv.divHeight is the total height of the <div>;
        oDiv.style.height = (iCurrentHeight + 10) + "px";
        setTimeout(function () { Accordion.accordion(oDiv); }, 10);
      } else {
        oDiv.state = "opened"; //div is fully opened so let div.state reflect that;
        oDiv.previousSibling.style.backgroundImage = "url(images/minus.gif)";
      }

    } else if (oDiv.state == "opened") { //close the div;
      if (iCurrentHeight > 10) {
        oDiv.style.height = (iCurrentHeight - 15) + "px";  //close the accordion faster than it's opened;
        setTimeout(function () { Accordion.accordion(oDiv); }, 10);
      } else { //div is fully closed so let div.state reflect that;
        oDiv.state = "closed";
        oDiv.style.height = "0";
        oDiv.previousSibling.style.backgroundImage = "url(images/plus.gif)";
      }
    }
  }

};

Accordion.addLoadEvent(Accordion.housekeeping);
