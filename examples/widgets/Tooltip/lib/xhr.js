//create an XMLHttpRequest object;
function getXHR() {

  if (typeof XMLHttpRequest == "undefined") { //check if the browser natively supports the object;
    XMLHttpRequest = function() { //if not, it's IE and get the active x object based upon the browser version;
	  return new ActiveXObject(navigator.userAgent.indexOf("MSIE 5") >= 0 ? "Microsoft.XMLHTTP" : "Msxml2.XMLHTTP");
	}
  }
  
  return new XMLHttpRequest();
  
}

//a generic function for performing Ajax requests;
//it takes one argument, an object that contains a set of options;
function ajax(options) {

  //load the options object w/ defaults if no values were provided;
  options = {
    //the type of HTTP request;
	type: options.type || "POST",
	
	//the url the request will be made to;
	url: options.url || "",
	
	//how long to wait before considering the request to be a timeout;
	timeout: options.timeout || 5000,
	
	//functions to call when the request fails, succeeds, or completes (either fail or succeed);
	onComplete: options.onComplete || function(){},
	onError: options.onError || function(){},
	onSuccess: options.onSuccess || function(){},
	
	//the data type that'll be returned from the server;
	//the default is simply to determine what data was returned and act accordingly;
	data: options.data || ""
  };
  
  //create the request object;
  var xml = getXHR();

  //open the asynchronous request;
  xml.open(options.type, options.url, true);
  
  //we're going to wait for a request for 5 seconds before giving up;
  var timeoutLength = options.timeout;
  
  //keep track of whent the request has been successfully completed;
  var requestDone = false;
  
  //initialize a callback which will fire 5 seconds from now, canceling the request if it has not already occurred;
  setTimeout(function() { requestDone = true;}, timeoutLength);
  
  //watch for when the state of the document gets updated;
  xml.onreadystatechange = function() {
    //wait until the data is fully loaded and make sure that the request hasn't already timed out;
	if (xml.readyState == 4 && !requestDone) {
		
	  //check to see if the request was successful;
	  if (httpSuccess(xml)) {
	    //execute the success callback w/ the data returned from the server;
		options.onSuccess(httpData(xml, options.data));
		
	  //otherwise, an error occurred so execute the error callback;
	  } else {
	    options.onError();
	  }

	  //call the completion callback;
	  options.onComplete();
	  
	  //clean up after ourselves to avoid memory leaks;
	  xml = null;
	}
  };
  
  //establish the connection to the server;
  xml.send(null);
  
  //determine the success of the HTTP response;
  function httpSuccess(r) {
    try {
	  //if no server status is provided and we're actually requesting a local file then it was successful;
	  return !r.status && location.protocol == "file:" ||
	  
	    //any status in the 200 range is good;
		(r.status >= 200 && r.status < 300) ||
		
		//successful if the document has not been modified;
		r.status == 304 ||
		
		//Safari returns an empty status if the file has not been modified
		navigator.userAgent.indexOf("Safari") >= 0 && typeof r.status == "undefined";
		
	} catch(e) {}
	
      //if checking the status failed then assume that the request failed;
      return false;
  
  }
  
  //extract the correct data from the HTTP response;
  function httpData(r, type) {

    //get the content-type header;
	var ct = r.getResponseHeader("content-type");

	//if no default type was provided determine if some form of xml was returned from the server;
	var data = !type && ct && ct.indexOf("xml") >= 0;

	//get the xml document object if xml was returned from the server, otherwise return the text contents;
	data = type == "xml" || data ? r.responseXML : r.responseText;

	//if the specified type is "script", execute the returned text response as if it were javascript;
	if (type == "script") {
	  eval.call(window, data);
	}

	//return the response data (either an xml document or a text string);
	return data;
  }
  
}