function Scrubber(obj) {

//ISSUES:
 //this.writeHTMLDiv is causing the function to be invoked twice???;

  //class Scrubber and its inherited prototype methods:
    // prototype validate();
	// prototype arrayPush();
    // prototype getErrors();
	// prototype errorClasses();
	// prototype insertPassedValues();
	// prototype writeHTMLDiv();
    // prototype insertHTML();
    // prototype hideHTML();
    // prototype resetElements(); #sets the LABELs and text INPUTs back to their default colors;
	// prototype insertIntoSpan(); #should the error message be to the right of the text box in a SPAN?;
	// prototype tooltip();
	// prototype getX();
	// prototype getY();
	// prototype yellowFade();
    // prototype capFirstLetter();
	// prototype insertAfter();

  //PURPOSE OF CONSTRUCTOR: the constructor function takes the form (or a single form element) and loops through its elements looking for any 'required' fields and any fields that need 'attention' and packs them into the 'this.data' array for storage and further analyzing;

  //perform object detection to determine the value for each property;
  if (obj.handler && !scrubber.Class.formSubmit) { //validate a single input, form has not been submitted ('obj' is user-defined);
    this.target = obj.elem;
	this.form = obj.form;
  } else if (obj.handler && scrubber.Class.formSubmit) { //validate a single input, form has been submitted ('obj' is user-defined);
    this.target = obj.form;
	this.form = obj.form;
  } else { //validate the entire form, form has been submitted (obj is a DOM form object => HTMLFormElement);
    this.target = obj;
	this.form = obj;
	scrubber.Class.formSubmit = true; //alert the module that the form has been submitted;
  }

  //some more properties;
  this.data = []; //houses all of the elements that require some level of validation;
  this.errors = []; //temporary collection that houses each element that failed validation (when the event handler is blur it can never hold more than one);
  this.successes = []; //temporary collection that inserts each element that passed validation directly into the DOM each invocation;

  var theLength = this.target.elements == undefined ? 1 : this.target.elements.length; //if this.target.elements is undefined then a single form input element has been passed rather than the entire form;
  for (var i = 0; i < theLength; i++) {

    var elem = this.target.elements == undefined ? this.target : this.target.elements[i];
    if (elem.className && elem.className.indexOf("required") != -1) {
	  if (!elem.value.match(/\S/)) { //flag fields that only contain whitespace;
	    this.data.push(["blank", elem.name]);

	  } else {
		if (scrubber.Class.allErrors.join().indexOf(elem.name) != -1) { //was the element in the allErrors?;
		  this.arrayPush("pass", elem.name); //if so, remove the reference to the element in the scrubber.Class.allErrors array;
		}
		if (elem.className.indexOf(" ") != -1) { //there's more than one class;
		  for (var j = 0; j < elem.className.split(" ").length; j++) { //use 'split' to convert the string into an array and iterate through its elements;
		    if (elem.className.split(" ")[j].indexOf("required-") != -1)
		      var aType = elem.className.split(" ")[j].substring(elem.className.split(" ")[j].indexOf("-")+1); //only keep what's after '-';
		  }
		} else if (elem.className.indexOf("-") != -1) {
	      var aType = elem.className.substring(elem.className.indexOf("-")+1); //only keep what's after '-';
		}
		this.data.push([aType, elem.name, elem.value]);
	  }

    } else if (elem.className && elem.className.indexOf("attention") != -1) {
      //only add the element to the 'attention' array if the user entered a value;
      if (elem.value.match(/\S/)) { //only add to the required array if there's no whitespace;
	    if (elem.className.indexOf(" ") != -1) { //there's more than one class;
	      var rType = elem.className.substring(elem.className.indexOf("-")+1, elem.className.indexOf(" ")); //only keep what's after '-' and before the space (" "), indicating there's another class name;
        } else { //there's only one class;
	      var rType = elem.className.substring(elem.className.indexOf("-")+1); //only keep what's after '-';
	    }
	    this.data.push([rType, elem.name, elem.value]);
	  }
	}

  }

} //end class Scrubber;

Scrubber.prototype.validate = function() {

  //NOTE that a default message is provided in case a custom message isn't included in the custom object;
  for (var i = 0; i < this.data.length; i++) {

    switch(this.data[i][0]) {
      case "alpha": //also allows for whitespace;
		if (!this.data[i][2].match(/^[a-zA-Z\s]+$/)) {
		  var defaultMessage = " can can only contain letters.";
		  var message = scrubber.Class.custom ? scrubber.Class.custom.messages.alpha || defaultMessage : defaultMessage;
		  this.errors.push([this.data[i][1], message]);
		  this.arrayPush("error", [this.data[i][1], message]);
		} else this.arrayPush("pass", this.data[i][1]);
	    break;

      case "alphanumeric": //also allows for whitespace;
		if (!this.data[i][2].match(/^[a-zA-Z0-9\s]+$/)) {
		  var defaultMessage = " can only contain letters and/or numbers.";
		  var message = scrubber.Class.custom ? scrubber.Class.custom.messages.alphanumeric || defaultMessage : defaultMessage;
		  this.errors.push([this.data[i][1], message]);
		  this.arrayPush("error", [this.data[i][1], message]);
		} else this.arrayPush("pass", this.data[i][1]);
	    break;

      case "blank":
		var defaultMessage = " cannot be blank.";
		var message = scrubber.Class.custom ? scrubber.Class.custom.messages.blank || defaultMessage : defaultMessage;
		if (scrubber.Class.formSubmit) {
		  this.errors.push([this.data[i][1], message]);
		  this.arrayPush("error", [this.data[i][1], message]);
		}
	    break;

      case "date":
		if (!this.data[i][2].match(/^[0-9]{2}([-\/.]?)[0-9]{2}\1([0-9]{2,4})$/)) { //NOTE the backreference to ensure that the character separators are the same;
		  var defaultMessage = " can only contain numbers and forward slashes, dashes or periods and must include a two-digit month and day and a two-digit or four-digit year.";
		  var message = scrubber.Class.dateCookie || defaultMessage;
		  this.errors.push([this.data[i][1], message]);
		  this.arrayPush("error", [this.data[i][1], message]);
		} else {
		  if (this.data[i][2].length == 8) { //four-digit year;
		    this.successes.push([this.data[i][1], this.data[i][2].substring(0, 2) + "/" + this.data[i][2].substring(2, 4) + "/"+ this.data[i][2].substring(4, 8)]);
		  } else if (this.data[i][2].length == 6) { //two-digit year;
		    this.successes.push([this.data[i][1], this.data[i][2].substring(0, 2) + "/" + this.data[i][2].substring(2, 4) + "/"+ this.data[i][2].substring(4, 6)]);
		  }
		  this.arrayPush("pass", this.data[i][1]);
		}
	    break;

      case "decimal":
		if (!this.data[i][2].match(/^[0-9]*\.[0-9]+$/)) {
		  var defaultMessage = " can only contain decimals.";
		  var message = scrubber.Class.custom ? scrubber.Class.custom.messages.decimal || defaultMessage : defaultMessage;
		  this.errors.push([this.data[i][1], message]);
		  this.arrayPush("error", [this.data[i][1], message]);
		} else this.arrayPush("pass", this.data[i][1]);
	    break;

      case "email":
		if (!this.data[i][2].match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)) {
		  var defaultMessage = " failed validation.";
		  var message = scrubber.Class.emailCookie || defaultMessage;
		  this.errors.push([this.data[i][1], message]);
		  this.arrayPush("error", [this.data[i][1], message]);
		} else this.arrayPush("pass", this.data[i][1]);
	    break;

      case "numeric":
		if (!this.data[i][2].match(/^[0-9]+$/)) {
		  var defaultMessage = " can only contain numbers.";
		  var message = scrubber.Class.custom ? scrubber.Class.custom.messages.numeric || defaultMessage : defaultMessage;
		  this.errors.push([this.data[i][1], message]);
		  this.arrayPush("error", [this.data[i][1], message]);
		} else this.arrayPush("pass", this.data[i][1]);
	    break;

      case "phone":
	    var pattern = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
		//The phone number regular expression accepts phone number in both local format (eg. 02 1234 5678 or 123 123 4567) or international format (eg. +61 (0) 2 1234 5678 or +1 123 123 4567). It also accepts an optional extention of up to five digits prefixed by x or ext (eg. 123 123 4567 x89) - http://javascript.about.com/library/blre.htm;
		if (!this.data[i][2].match(pattern)) {
		  var defaultMessage = " failed validation.";
		  var message = scrubber.Class.custom ? scrubber.Class.custom.messages.phone || defaultMessage : defaultMessage;
		  this.errors.push([this.data[i][1], message]);
		  this.arrayPush("error", [this.data[i][1], message]);
		} else {
		  var theValue = this.data[i][2].replace(/[^a-zA-Z0-9]/g, ''); //strip out anything except alphanumeric chars;
		  if (theValue.charAt(0) == '1') { //we don't want;
		    var defaultMessage = " cannot begin with a one (1).";
		    var message = scrubber.Class.custom ? scrubber.Class.custom.messages.phone || defaultMessage : defaultMessage;
			this.errors.push([this.data[i][1], message]);
		    this.arrayPush("error", [this.data[i][1], message]);

		  } else if (theValue.match(/(x|ext)/)) { //there is an extension;
			if (theValue.indexOf("ext") != -1) {
			  var format = theValue.substring(0, theValue.indexOf("ext")); //chop off 'ext';
			  if (format.length == 10) {
				//formats (717)737-8879 ext1234;
			    this.successes.push([this.data[i][1], "(" + format.substring(0, 3) + ")" + format.substring(3, 6) + "-" + format.substring(6, 10) + " " + theValue.substring(theValue.indexOf("ext"), theValue.length)]);
			  } else if (format.length == 7) {
				//formats 737-8879 ext1234;
				this.successes.push([this.data[i][1], "(" + format.substring(0, 3) + "-" + format.substring(3, 7) +  " " + theValue.substring(theValue.indexOf("ext"), theValue.length)]);
			  }
			} else if (theValue.indexOf("x") != -1) {
			  var format = theValue.substring(0, theValue.indexOf("x")); //chop off 'x';
			  if (format.length == 10) {
				//formats (717)737-8879 x1234;
			    this.successes.push([this.data[i][1], "(" + format.substring(0, 3) + ")" + format.substring(3, 6) + "-" + format.substring(6, 10) + " " + theValue.substring(theValue.indexOf("x"), theValue.length)]);
			  } else if (format.length == 7) {
				//formats 737-8879 x1234;
				this.successes.push([this.data[i][1], "(" + format.substring(0, 3) + "-" + format.substring(3, 7) +  " " + theValue.substring(theValue.indexOf("x"), theValue.length)]);
			  }
			}

		  } else { //there is no extension;
		    if (theValue.length == 10) {
			  //formats (717)737-8879;
			  this.successes.push([this.data[i][1], "(" + theValue.substring(0, 3) + ")" + theValue.substring(3, 6) + "-" + theValue.substring(6, 10)]);
			} else if (theValue.length == 7) {
			  //formats 737-8879;
			  this.successes.push([this.data[i][1], "(" + theValue.substring(0, 3) + "-" + theValue.substring(3, 7)]);
			}
		  }
		  this.arrayPush("pass", this.data[i][1]);
		}
	    break;

      case "ssn":
		if (!this.data[i][2].match(/^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$/)) {
		  var defaultMessage = " failed validation.";
		  var message = scrubber.Class.custom ? scrubber.Class.custom.messages.ssn || defaultMessage : defaultMessage;
		  this.errors.push([this.data[i][1], message]);
		  this.arrayPush("error", [this.data[i][1], message]);
		} else {
		  if (this.data[i][2].length != 11) {
		    var format = this.data[i][2].replace(/-/g, '');
		    var theValue = format.substring(0, 3) + "-" + format.substring(3, 5) + "-" + format.substring(5, 9);
		    this.successes.push([this.data[i][1], theValue]);
		  }
		  this.arrayPush("pass", this.data[i][1]);
		}
	    break;

      case "url":
		if (!this.data[i][2].match(/^((http|ftp|https):\/\/)?(www.?\.)?.+\..{2,3}$/)) { //a good start but needs work;
		  var defaultMessage = " failed validation.";
		  var message = scrubber.Class.urlCookie || defaultMessage;
		  this.errors.push([this.data[i][1], message]);
		  this.arrayPush("error", [this.data[i][1], message]);
		} else {
		  if (!this.data[i][2].match(/^www\./)) this.successes.push([this.data[i][1], "www." + this.data[i][2]]);
		  this.arrayPush("pass", this.data[i][1]);
		}
	    break;

      case "zipcode":
		if (!this.data[i][2].match(/^[0-9]{5}-?([0-9]{4})?$/)) {
		  var defaultMessage = " failed validation.";
		  var message = scrubber.Class.zipcodeCookie || defaultMessage;
		  this.errors.push([this.data[i][1], message]);
		  this.arrayPush("error", [this.data[i][1], message]);
		} else {
		  //correct formatting is either '17057' or '17057-1234';
		  if (this.data[i][2].length == 6) { //length = 6 b/c there's a trailing hyphen;
		    this.successes.push([this.data[i][1], this.data[i][2].substring(0, this.data[i][2].length-1)]); //chop off the hyphen;
		  } else if (this.data[i][2].length == 9) {
			this.successes.push([this.data[i][1], this.data[i][2].substring(0, 5) + "-" + this.data[i][2].substring(5, 9)]);
		  }
		  this.arrayPush("pass", this.data[i][1]);
		}
	    break;

	  default:
	    break;
    }

  }

  this.insertPassedValues(); //insert all values that passed validation into the DOM;

  if (scrubber.Class.formSubmit) {
    if (this.errors.length == 0) { //only flag 'scrubber.Class.allGood' if there are no errors anywhere in the form and 'this.target' contains the Form object;
      scrubber.Class.allGood = true;
	  return false; //this is the last line of code that will run in this Class before the form is successfully submitted;
	}
  }

  return this.errors.length == 0 ? false : true;

}; //end validate method;

Scrubber.prototype.getErrors = function() {

  //first test to see if there's a custom object and if not use the defaults defined in the else clause;
  var args = scrubber.Class.custom || null;

  if (args) {
    if (args.changeElementColors) this.resetElements(); //reset the LABELs and text INPUTs if they were set to be changed;

    if (args.div) this.writeHTMLDiv(args.divHeader); //construct an error list to be inserted into the DOM; 

    if (args.changeElementColors) {
	  if (scrubber.Class.yellowFadeCookie == "true") { //Yellow Fade Technique;
	    for (var i = 0; i < this.errors.length; i++) {
	      this.yellowFade(document.getElementById(this.errors[i][0]), args.fadeColor[0], args.fadeColor[1], args.fadeColor[2]); //apply the YFT to the appropriate text inputs;
		}
	  }
	  //rewrite and insert the error div immediately into the DOM;
	  this.errorClasses();
	  this.writeHTMLDiv();
	  //if (scrubber.Class.custom.div) this.insertHTML(); //only insert the HTML if the custom object defines it;
	  if (scrubber.Class.divCookie == "true") this.insertHTML(); //only insert the HTML if the custom object defines it;
	  else this.hideHTML(); //for demo;
	}

    if (args.div && args.divID) { //display the error div and insert the html immediately in the provided div;
	  this.insertHTML();
	  return false;
	} else if (args.div && !args.divID) { //return the html and then stuff it into whatever div the programmer chose;
      return this.html;
	}

  /************************************************************************************************************/
  /*********************default style (no args scrubber.Class.passed to this.getErrors();)*********************/
  /************************************************************************************************************/
  } else if (!args) { //fire this code block if no arguments are passed to this.getErrors();

    //the default errors will be:
	// 1. text inputs - background-color: yellow;
	// 2. labels - color: red;
	//also, there will be no error div or YFT;

    this.resetElements(); //reset the LABELs and text INPUTs if they were set to be changed;

	for (var i = 0; i < this.errors.length; i++) {
	  for (var j = 0; j < this.form.childNodes.length; j++) {
	    var elem = this.form.childNodes[j];
	    document.getElementById(this.errors[i][0]).style.backgroundColor = scrubber.Class.defaultErrorBackground;
	    if (this.errors[i][0] == elem.htmlFor) elem.style.color = scrubber.Class.defaultErrorLabel; //next, take care of the LABELs;
	  }
	}

  }

}; //end getErrors method;

Scrubber.prototype.arrayPush = function(type, data) {

  var which = type == "error" ? [scrubber.Class.allErrors, scrubber.Class.passed, data[0]] : [scrubber.Class.passed, scrubber.Class.allErrors, data]; //pass the data in an array depending upon if it's an "error" or if it "pass"ed;

  if (which[0].join().indexOf(which[2]) == -1) { //only add if there is no duplicate;
    which[0].push(data); //add it to the appropriate array;
  }

  if (which[1].join().indexOf(which[2]) != -1) { //remove it from the array;
	for (var i = 0; i < which[1].length; i++) {
	  if (which[1][i][0] == which[2]) { //first find the array index;
	    which[1].splice(i, 1); //remove it from the appropriate array;
	  }
	}
  }

  if (type == "pass") { //make sure to 'redraw' the error elements minus the element(s} that just passed validation;
    this.resetElements();
    this.errorClasses();
  }

  if (scrubber.Class.custom) {
    //if (scrubber.Class.custom.div) { //only output to the error div if explicitly specified to do so;
	if (scrubber.Class.divCookie == "true") { //only output to the error div if explicitly specified to do so;
      this.writeHTMLDiv();
      this.insertHTML();
    }
  
    if (scrubber.Class.useSpanCookie == "true") { //are errors supposed to be to the right of the input boxes?;
	  if (type == "error") {
        this.insertIntoSpan(); //there was a validation error so display the SPAN;
	  } else if (type == "pass") {
	    if (document.getElementById(data+"Span")) //test for the SPAN's existence;
		  scrubber.Class.tables ? document.getElementById(data+"Cell").removeChild(document.getElementById(data+"Span")) /*if it's a table remove the SPAN w/in the parent TD*/ : this.form.removeChild(document.getElementById(data+"Span")) /*if it's not a table remove the SPAN w/in the parent FORM*/;
	  }
    } else {
	  var spans = document.getElementsByTagName("span");
	  if (spans.length > 0) {
	    for (var i = 0; i < spans.length; i++) {
	      scrubber.Class.tables ? document.getElementById(data+"Cell").removeChild(document.getElementById(spans[i].id)) : this.form.removeChild(document.getElementById(spans[i].id));
		}
	  }
	  //if (document.getElementById(data+"Span")) //test for the SPAN's existence;
		  //scrubber.Class.tables ? document.getElementById(data+"Cell").removeChild(document.getElementById(data+"Span")) /*if it's a table remove the SPAN w/in the parent TD*/ : this.form.removeChild(document.getElementById(data+"Span")) /*if it's not a table remove the SPAN w/in the parent FORM*/;
	}
  }

}; //end arrayPush method;

Scrubber.prototype.errorClasses = function() {

  if (scrubber.Class.allErrors.length > 0) {
	var args = scrubber.Class.custom;
    for (var i = 0; i < scrubber.Class.allErrors.length; i++) { //iterate through all the current errors;

	  for (var j = 0; j < this.form.elements.length; j++) { //iterate through the form and flag the elem;
	    if (this.form.elements[j].id == scrubber.Class.allErrors[i][0]) {
		  scrubber.Class.custom ? document.getElementById(this.form.elements[j].id).style.backgroundColor = "rgb("+args.errorColor[0]+", "+args.errorColor[1]+", "+args.errorColor[2]+")" : document.getElementById(this.form.elements[j].id).style.backgroundColor = scrubber.Class.defaultErrorBackground /*there is no custom object, use default values*/;
		  if (scrubber.Class.tables) {
		    var path = document.all ? this.form.elements[j].parentNode.previousSibling : this.form.elements[j].parentNode.previousSibling.previousSibling;
		    path.style.color = scrubber.Class.defaultErrorLabel;
	      }
		}
	  }
	  
	  var labels = document.getElementsByTagName("label"); //iterate through the LABELs;
	  for (var k = 0; k < labels.length; k++) {
	    if (labels[k].htmlFor == scrubber.Class.allErrors[i][0]) {
		  if (scrubber.Class.custom) {
		    labels[k].style.color = "rgb("+args.labelColor[0]+", "+args.labelColor[1]+", "+args.labelColor[2]+")";
		  } else labels[k].style.color = scrubber.Class.defaultErrorLabel;
		}
	  }
	}
  }

}; //end errorClasses method;

Scrubber.prototype.insertPassedValues = function() {

  //insert each correctly formatted element value into the DOM;
  for (var i = 0; i < this.successes.length; i++)
    document.getElementById(this.successes[i][0]).value = this.successes[i][1];

}; //end insertPassedValues method;

Scrubber.prototype.writeHTMLDiv = function() {

  //only draw the error div if there's at least one error;
  if (scrubber.Class.allErrors.length > 0) {
    //this.html = scrubber.Class.custom.divHeader ? "\n\t<p>" + scrubber.Class.custom.divHeader + "</p>\n" : "\t<p>Please remedy the following:</p>\n"; //use a default error header if the custom object doesn't provide one;
	this.html = scrubber.Class.divHeaderCookie ? "\n\t<p>" + scrubber.Class.divHeaderCookie + "</p>\n" : "\t<p>Please remedy the following:</p>\n"; //use a default error header if the custom object doesn't provide one;
    this.html += "\t<ul>\n";

    var errorBlock = scrubber.Class.allErrors.length > 0 ? scrubber.Class.allErrors : this.errors;
    for (var i = 0; i < errorBlock.length; i++)
	  this.html += "\t\t<li><strong>" + this.capFirstLetter(errorBlock[i][0]) + "</strong>" + errorBlock[i][1] + "</li>\n";

    this.html += "\t</ul>\n";

  } else this.hideHTML();

}; //end writeHTMLDiv method;

Scrubber.prototype.insertHTML = function() {

  if (scrubber.Class.allErrors.length > 0) {
    var div = scrubber.Class.custom.divID || "scrubberErrors";
    document.getElementById(div).innerHTML = this.html;
    document.getElementById(div).style.display = "block";
  } else this.hideHTML();

}; //end insertHTML method;

Scrubber.prototype.hideHTML = function() {

  var div = scrubber.Class.custom ? scrubber.Class.custom.divID : "scrubberErrors";
  document.getElementById(div).style.display = "none";

}; //end hideHTML method;

Scrubber.prototype.resetElements = function() {

  var theLength = this.target.elements == undefined ? 1 : this.target.elements.length; //if this.target.elements is undefined then a single form input element has been passed rather than the entire form;
  for (var i = 0; i < theLength; i++) {
    var elem = this.target.elements == undefined ? this.target : this.target.elements[i];
    if (elem.getAttribute("type") != "submit") {
	  if (scrubber.Class.custom && scrubber.Class.custom.noErrorColor) {
        elem.style.backgroundColor = "rgb("+scrubber.Class.custom.noErrorColor[0]+", "+scrubber.Class.custom.noErrorColor[1]+", "+scrubber.Class.custom.noErrorColor[2]+")";
	  } else elem.style.backgroundColor = scrubber.Class.defaultBackground || "#fff";

      if (scrubber.Class.tables) {
	    var path = document.all ? elem.parentNode.previousSibling : elem.parentNode.previousSibling.previousSibling;
	    if (path.className.match(/error/)) path.className = path.className.replace(/error/, '');
	  }
	}
  }

  var labels = this.form.getElementsByTagName("label");
  for (var i = 0; i < labels.length; i++) labels[i].style.color = scrubber.Class.defaultLabel || "#000";

}; //end resetElements method;

Scrubber.prototype.insertIntoSpan = function() {

  var spanErrors = []; //create an array to house the ids of the SPANs that are in error;
  var spans = document.getElementsByTagName("span");
  for (var i = 0; i < spans.length; i++)
	if (spanErrors.join().indexOf(spans[i].id) == -1) spanErrors.push(spans[i].id); //only add to the array if it already isn't an array element;

  for (var j = 0; j < scrubber.Class.allErrors.length; j++) {
	if (spanErrors.join().indexOf(scrubber.Class.allErrors[j][0]) == -1) { //only add the SPAN if it's not in the spanErrors array;
	  if (scrubber.Class.tables) {
		if (document.getElementById(scrubber.Class.allErrors[j][0] + "Cell")) { //if the element doesn't already exist then create it;
		  var td = document.getElementById(scrubber.Class.allErrors[j][0] + "Cell");
		} else {
	      var td = document.createElement("td"); //create a TD;
		  td.setAttribute("id", scrubber.Class.allErrors[j][0] + "Cell");
		}
	  }
      var theSpan = document.createElement("span");
	  var link = document.createElement("a");
	  theSpan.setAttribute("id", scrubber.Class.allErrors[j][0] + "Span"); //add "Span" so it's unique, but only if tables aren't being used (in that case the unique id will be set on the TD and it won't be necessary to set it on the SPAN);
      theSpan.className = "error";
	  link.setAttribute("href", scrubber.Class.custom.toolbox+"#tooltip"+i);
	  link.setAttribute("name", this.capFirstLetter(scrubber.Class.allErrors[j][0]) + scrubber.Class.allErrors[j][1]); //set the attribute that will contain the value to be passsed to Tooltip;
	  link.className = "Tooltip_default";
	  if (document.addEventListener) {
	    link.addEventListener("click", this.getX, false);
		link.addEventListener("click", this.getY, false);
	    link.addEventListener("click", this.tooltip, false);
	  } else if (document.attachEvent) { //IE needs the events to be attached in reverse order, i don't know why :( ;
		link.attachEvent("onclick", this.tooltip);
		link.attachEvent("onclick", this.getY);
	    link.attachEvent("onclick", this.getX);
	  }
	  link.onfocus = function() { if(this.blur)this.blur(); };
	  link.onclick = function() { return false; }; //finally, cancel the default browser behavior;
      link.appendChild(document.createTextNode("Required field."));
	  //link.appendChild(document.createTextNode(scrubber.Class.allErrors[i][1]));
	  theSpan.appendChild(link); //insert the A into the SPAN;
	  if (scrubber.Class.tables) td.appendChild(theSpan); //insert the SPAN into the TD;

	  scrubber.Class.tables ? this.insertAfter(td, document.getElementById(scrubber.Class.allErrors[j][0]).parentNode) /*insert the SPAN into the DOM after the TD;*/: this.insertAfter(theSpan, document.getElementById(scrubber.Class.allErrors[j][0])) /*insert the SPAN into the DOM*/;
	}
  }

}; //end insertIntoSpan method;

Scrubber.prototype.tooltip = function(obj) {

  //make sure that any div#tooltip element node that was previously created is destroyed;
  if (document.getElementById("tooltip")) document.getElementsByTagName("body")[0].removeChild(document.getElementById("tooltip"));

  var tipDiv = document.createElement("div");
  tipDiv.setAttribute("id", "tooltip");
  tipDiv.innerHTML = this.name || obj.srcElement.name; //remember IE doesn't support the w3c's events module!!!!;
 
  //create the div#tooltip a.tooltipClose node;
  var close = document.createElement("a");
  close.appendChild(document.createTextNode("Close"));
  close.setAttribute("href", "#");
  close.setAttribute("class", "tooltipClose");
  //i initially bound these events to the element but it didn't work;
  close.onfocus = function() { if(this.blur)this.blur(); };
  close.onclick = function() { document.getElementById('tooltip').style.display = 'none'; return false; };
  tipDiv.appendChild(close);
  document.getElementsByTagName("body")[0].appendChild(tipDiv); //append div#tooltip to the document;

  //position the div, and then finally display it;
  if (document.all) { //works in all but it's offset in Windows strict, Mozilla 1.6 strict and Safari;
	if ((document.body.clientWidth - this.x) > 250) { //if the viewport won't allow for the tooltip to be fully displayed to the right of the element then position it to the left;
	  tipDiv.style.left = this.x + "px"; //x coord;
      tipDiv.style.top = this.y + "px"; //y coord;
	} else {
	  tipDiv.style.left = (this.x - 250) + "px";
	  tipDiv.style.top = this.y + "px";
	}
	
  } else { //works in all but Opera and Windows in quirks mode;
	if ((document.body.offsetWidth - this.x) > 250) { //if the viewport won't allow for the tooltip to be fully displayed to the right of the element then position it to the left;
	  tipDiv.style.left = this.x + "px"; //x coord;
      tipDiv.style.top = this.y + "px"; //y coord;
	} else {
	  tipDiv.style.left = (this.x - 250) + "px";
	  tipDiv.style.top = this.y + "px";
	}
  }
  tipDiv.style.display = "block";
  return false;

}; //end tooltip method;

Scrubber.prototype.getX = function(e) {

  e = window.event || e;
  this.x = e.pageX || e.clientX + document.body.scrollLeft; //check for the non-IE position, then the IE position;

}; //end getX method;

Scrubber.prototype.getY = function(e) {

  e = e || window.event;
  this.y = e.pageY || e.clientY + document.body.scrollTop; //check for the non-IE position, then the IE position;

}; //end getY method;

Scrubber.prototype.yellowFade = function(elem, red, green, blue) {

  if (elem.fade) clearTimeout(elem.fade);
  elem.style.backgroundColor = "rgb(" + red + ", " + green + ", " + blue + ")";
  if (red == 255 && green == 255 && blue == 204) return;

  var newred = red + Math.ceil((255 - red) / 10);
  var newgreen = green + Math.ceil((255 - green) / 10);
  var newblue = blue + Math.ceil((204 - blue) / 10);
  var repeat = function() { yellowFade(elem, newred, newgreen, newblue); };

  elem.fade = setTimeout(repeat, 100);

}; //end yellowFade method;

Scrubber.prototype.capFirstLetter = function(field) {
	
  if (field.indexOf("_") != -1) { //replace any underscores w/ spaces and then capitalize the first letter of each word;
	field = field.replace(/_/, " ");
	var fields = field.split(" "); //create an array of the field chunks;
	for (var i = 0; i < fields.length; i++) { //capitalize the first letter of each chunk;
	  fields[i] = fields[i].substring(0, 1).toUpperCase() + fields[i].substring(1, fields[i].length);
	}
	return field = fields.join(" ");

  } else return field.substring(0, 1).toUpperCase() + field.substring(1, field.length); //'field' is only one word;

}; //end capFirstLetter method;

Scrubber.prototype.insertAfter = function(newElement, targetElement) {

  var parent = targetElement.parentNode;
  parent.lastChild == targetElement ? parent.appendChild(newElement) : parent.insertBefore(newElement, targetElement.nextSibling);

}; //end insertAfter method;