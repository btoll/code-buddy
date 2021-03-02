//get a style property (name) of a specific element (elem);
function getStyle(elem, name) {

  //if the property exists in style[] then it's been set recently and is current;
  if (elem.style[name]) {
    return elem.style[name];
    
  //otherwise, try to use IE's method;
  } else if (elem.currentStyle) {
	return elem.currentStyle[name];
	
  //or the w3c's method, if it exists;
  } else if (document.defaultView && document.defaultView.getComputedStyle) {
    //it uses the traditional 'text-align' style of rule writing instead of 'textAlign';
	name = name.replace(/([A-Z])/g, "-$1");
	name = name.toLowerCase();
	
	//get the style object and get the value of the property if it exists;
	var s = document.defaultView.getComputedStyle(elem, "");
	return s && s.getPropertyValue(name);

  //otherwise, we're using some other browser;
  } else {
    return null;
  }

}

//find the X (horizontal, left) position of an element;
function offsetX(elem) {

  //see if we're at the root element, or not;
  return elem.offsetParent ?
  
    //if we can still go up, add the current offset and recurse upwards;
	elem.offsetLeft + offsetX(elem.offsetParent) :

    //otherwise, just get the current offset;
	elem.offsetLeft;

}

//find the Y (vertical, top) position of an element;
function offsetY(elem) {

  //see if we're at the root element, or not;
  return elem.offsetParent ?
  
    //if we can still go up, add the current offset and recurse upwards;
    elem.offsetTop + offsetY(elem.offsetParent) :
  
    //otherwise, just get the current offset;
    elem.offsetTop;

}

//find the horizontal positioning of an element w/in its parent;
function parentX(elem) {

  //var theStyle = elem.currentStyle ? elem.currentStyle["position"] : document.defaultView.getComputedStyle(elem, "").getPropertyValue("position");

  //if the offsetParent is the element's parent, break early;
  return elem.parentNode == elem.offsetParent ?
    elem.offsetLeft :
	
	//otherwise, we need to find the position relative to the entire page for both elements and find the difference;
	offsetX(elem) - offsetX(elem.parentNode);

}

//find the vertical positioning of an element w/in its parent;
function parentY(elem) {

  //if the offsetParent is the element's parent, break early;
  return elem.parentNode == elem.offsetParent ?
    elem.offsetTop :
	
    //otherwise, we need to find the position relative to the entire page for both elements and find the difference;
	offsetY(elem) - offsetY(elem.parentNode);

}

//find the left position of an element;
function posX(elem) {

  //get the computed style and get the number out of the value;
  return parseInt(getStyle(elem, "left"));

}

//find the top position of an element;
function posY(elem) {

  //get the computed style and get the number out of the value;
  return parseInt(getStyle(elem, "top"));

}

//find the mouse coordinates (X,Y);
function getX(e) {

  //normalize the event object;
  e = e || window.event;

  //check for the non-IE position, then the IE position;
  return e.pageX || e.clientX + document.body.scrollLeft;

}

function getY(e) {
	
  //normalize the event object;
  e = e || window.event;
  
  //check for the non-IE position, then the IE position;
  return e.pageY || e.clientY + document.body.scrollTop;

}

function getElementX(e) {

  return (e && e.layerX) || window.event.offsetX;
	  
}

function getElementY(e) {

  return (e && e.layerY) || window.event.offsetY;

}