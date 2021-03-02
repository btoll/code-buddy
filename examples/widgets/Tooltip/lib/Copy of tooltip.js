function preTip() {

  //before Tooltip there was preTip...
  
  var links = document.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {

    if (/#tooltip\d+$/.test(links[i].href)) { //does the href contain some variation of #tooltip1?
	  var theSpan = document.createElement("span");
	  theSpan.className = links[i].href.substring(links[i].href.indexOf("#")+1); //if so, chop off everything after the hash mark and it becomes the <span>'s class name;

	  var tooltipText = links[i].removeChild(links[i].firstChild); //remove the text from the anchor but store it;
	  theSpan.appendChild(tooltipText); //and place it w/in the <span> tag;
	  links[i].insertBefore(theSpan, links[i].firstChild); //now insert the node as a child to the parent anchor;
	  
      //make sure to relatively position the link (for IE);
	  //the default, when no class or when 'Tooltip_' isn't a given class don't position any element;
	  if (links[i].className.indexOf("Tooltip_") != -1) {

	    if (links[i].className.indexOf("Tooltip_mouse") == -1) { //only proceed if we're explicitly setting the position to relative as opposed to going by the mouse click coordinates (i.e. don't proceed if Tooltip_mouse is one of the class names);

	      //simply position the link as relative;
	      if (links[i].className.indexOf("Tooltip_default") != -1) {
	        links[i].style.position = "relative";
	      }
		  
          if (links[i].className.indexOf("Tooltip_id") != -1) {
	        var id = links[i].className.substring(links[i].className.indexOf("-")+1);
	        document.getElementById(id).style.position = "relative";
	      }

	      if (links[i].className.indexOf("Tooltip_class") != -1) {
            var theClass = links[i].className.substring(links[i].className.indexOf(".")+1);
		    var classes = getElementsByClassName(theClass);
		    for (var j = 0; j < classes.length; j++) {
		      if (classes[j].className.indexOf("Tooltip") == -1) { //don't target the calling link;
		        classes[j].style.position = "relative";
		      }
		    }
	      }

	      if (/\s*Tooltip_[^id\-]*[.\-]\s*/.test(links[i].className)) { //Tooltip_ID-nodeElement || Tooltip_ID.className;
		    var cn = links[i].className; //cn = class name;
		    var preClass = cn.replace(cn, cn.match(/Tooltip_.+[.\-]{1}[a-zA-Z]+/)); //first chop off everything but the "Tooltip_content-li" (or something similar) class name;
		    var theClass = preClass.substring(preClass.indexOf("_")+1); //then chop off "Tooltip_";

		    if (theClass.indexOf("-") != -1) { //the class contains a dash (-), so that means to start at the ID and iterate through the given element (the part of the class name after the dash);
		      theClass = theClass.split("-");
		      var elems = document.getElementById(theClass[0]).getElementsByTagName(theClass[1]);
		      for (var j = 0; j < elems.length; j++) {
		        elems[j].style.position = "relative";
		      }
		  
		    } else if (theClass.indexOf(".") != -1) { //the class contains a period (.), so that means to iterate through by class name (the part after the period is the class name);
		      theClass = theClass.split(".");
		      var elems = getElementsByClassName(theClass[1]);
		      for (var j = 0; j < elems.length; j++) {
			    if (elems[j].className.indexOf(".") == -1) { //don't position the anchor which contains a period (i.e. test.myClass);
		          elems[j].style.position = "relative";
			    }
		      }
		    }
		  }
	    }
	  }
	  
      //finally, attach the onevent handler to the link;
	  if (document.all) {
        links[i].onclick = function() {	  
          tooltip(this, event);
          return false;
        };
		
	  } else links[i].addEventListener('click', tooltip, false); //i needed to bind the event using w3c binding (DOM2) so FF would have access to the event object for getting the x/y coords;
	  
    }
  }
}

function tooltip(obj) {

  if (window.addEventListener) {
	//when the w3c's dom2 event binding method is used (addEventListener), the handle is the parameter passed to the function called from addEventListener - in this case 'obj' - and the 'this' keyword has local scope (so it refers to the anchor) to whatever element was bound by addEventListener (ex. links[i].addEventListener('click', tooltip, false););
	//NOTE: if you assign event handlers via the w3c dom addEventListener() method or an event handler property the event object is passed automatically as the sole parameter to the event handler function.  Include a parameter variable to 'catch' the incoming parameter - in this case tooltip(obj). p. 191, JavaScript Bible;
	var theX = getX(obj); //retrieve the mouse click's x coord;
	var theY = getY(obj); //retrieve the mouse click's y coord;
	obj.preventDefault(); //prevent the default browser behavior of going to the link (same as 'return false;');
    obj = this; //pass the reference to the element object into 'obj';
  }

  if (document.all) { //store the x|y coordinates as custom properties of the object (some implementations of IE returned window.event as NULL so it's best to grab the coords now);
    obj.x = window.event.clientX;
    obj.y = window.event.clientY;
  }
  //create the XMLHttpRequest object and send the request;
  var theURL = obj.href.replace(/#[a-zA-Z]+\d+/, "");
  ajax({
    url: theURL,
	data: "html",
	type: "GET",
	onSuccess: function(data) {
	  //make sure that any div#tooltip element node that was previously created is destroyed;
      if (document.getElementById("tooltip"))
        document.getElementsByTagName("body")[0].removeChild(document.getElementById("tooltip"));
  
      //extract first the tooltip\d class name and then just the number(\d);
      //remember there may be more than one class;
      if (obj.firstChild.getAttribute("class")) //modern browsers;
        var classes = obj.firstChild.getAttribute("class");
      else if (obj.firstChild.className) //IE;
        var classes = obj.firstChild.className;

      var pattern = /\btooltip\d+\b/i; //will match tooltip0, tooltip22, tooltip538, etc.;
      if (classes.match(pattern)) { //now extract the exact class name we're looking for;
        var myClass = classes.replace(classes, classes.match(pattern));
        var myClassNumber = myClass.replace(myClass, myClass.match(/\B\d+\b/)); //now extract just the digit(s) from the class;
      }

      //create the div#tooltip element node;
      var tipDiv = document.createElement("div");
      tipDiv.setAttribute("id", "tooltip");
	  tipDiv.className = "adviceBox";
	  
	  //create the div#tooltip a.tooltipClose node;
	  var close = document.createElement("a");
	  close.appendChild(document.createTextNode("Close"));
	  close.setAttribute("href", "#");
	  close.setAttribute("class", "tooltipClose");
	  //i initially bound these events to the element but it didn't work;
	  close.setAttribute("onfocus", "if(this.blur)this.blur();");
	  close.setAttribute("onclick", "document.getElementById('tooltip').style.display = 'none'; return false;");
	  
	  tipDiv.appendChild(close); //append a.tooltipClose to div#tooltip;
	  document.getElementsByTagName("body")[0].appendChild(tipDiv); //append div#tooltip to the document;

	  var page = data; //the response text is returned as a string to parse;
	  var begin = page.indexOf("<div id=\"tooltip"+myClassNumber+"\""); //get the beginning of the selected tooltip;
	  var end = page.indexOf("<!--end div#tooltip"+myClassNumber+"-->");  //get the end of the selected tooltip;
	  var tip = page.slice(begin, end); //grab all text in between;
	  document.getElementById("tooltip").innerHTML += tip; //stuff the text into the awaiting div#tooltip (but don't overwrite the 'Close' button created above!);
      //get the x/y coordinates of our node element recursing up each parent element to the root node;
      if (obj.className.indexOf("Tooltip_mouse") == -1) {
        var positionX = offsetX(obj);
	    var positionY = offsetY(obj);
		
	  } else {
		//get the mouse coords b/c we're positioning the tooltip by mouse coords;

		if (document.all) { //if IE, the coordinates have already been set as properties of the obj;
		  var positionX = obj.x + document.body.scrollLeft;
		  var positionY = obj.y + document.body.scrollTop;
		  
		} else { //use the coords retrieved from above;
		  var positionX = theX;
		  var positionY = theY;
		}
	  }

	  var divWidth = parseInt(getStyle(tipDiv, "width")); //get the computed value of the width (set in the stylesheet);

      //position the div, and then finally display it;
      if (document.all) { //works in all but it's offset in Windows strict, Mozilla 1.6 strict and Safari;
	    if ( (document.body.clientWidth - positionX) > divWidth ) { //if the viewport won't allow for the tooltip to be fully displayed to the right of the element then position it to the left;
	      tipDiv.style.left = positionX + "px"; //x coord;
          tipDiv.style.top = positionY + "px"; //y coord;
	    } else {
	      tipDiv.style.left = (positionX - divWidth) + "px";
	      tipDiv.style.top = (positionY) + "px";
	    }
	
      } else { //works in all but Opera and Windows quirks mode;
	    if ( (document.body.offsetWidth - positionX) > divWidth ) { //if the viewport won't allow for the tooltip to be fully displayed to the right of the element then position it to the left;
	      tipDiv.style.left = positionX + "px"; //x coord;
          tipDiv.style.top = positionY + "px"; //y coord;
	    } else {
	      tipDiv.style.left = (positionX - divWidth) + "px";
	      tipDiv.style.top = (positionY) + "px";
	    }
      }
      tipDiv.style.display = "block";
	}
  });

}

addLoadEvent(preTip);