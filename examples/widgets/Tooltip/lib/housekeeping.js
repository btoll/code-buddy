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
  var els = document.all?document.all:document.getElementsByTagName("*");
  for(var i = 0, j = els.length; i < j; i++) {
    if (re.test(els[i].className)) {
      a.push(els[i]);
    }
  }
 return a;
}

function housekeeping() {

  if (!document.getElementById) return false;
  if (!document.getElementsByTagName) return false;

  var links = document.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
    links[i].onfocus = function() {
      if(this.blur)this.blur();
    }
  }

}

addLoadEvent(housekeeping);