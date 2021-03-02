//create an XMLHttpRequest object;
function getXHR(callback) {

  //create the XMLHttpRequest object;
  var xhr;
  
  try {
    // Firefox, Opera 8.0+, Safari
	xhr = new XMLHttpRequest();
  }
  
  catch (e) {
    //IE;
	try {
	xhr = new ActiveXObject("Msxml2.XMLHTTP");
	}
    catch (e) {
	  try {
	    xhr = new ActiveXObject("Microsoft.XMLHTTP");
	  }
      catch (e) {
	    alert("Your browser does not support Ajax!");
		return false;
	  }
	}
  }

  return xhr;
  
}