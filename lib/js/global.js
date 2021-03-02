/************************************
methods in this file
****************************
 - init()
 - accordion()
 - createCategoriesList()
 - fadeOut()
 - HEAD
   + lastModified
   + link
   + getHeaders()
 - setMenu
   + bOpen
   + oElem
   + iTimer
   + fnHandler()
   + init()
   + slideMenu()
 - slideMenu()
 - sorting()
****************************
************************************/

BLUEBOY.global = {

  /************************************************************************************************************
  *************************************************************************************************************
  ************************************************************************************************************/
  init: function () {

    BLUEBOY.utility.invoker([
      "utility.targetBlank",
      "events.setAccordion",
      "events.setInstructions",
      "events.setMenuHandle",
      "events.setRegex",
      "events.setSearchEngine",
      "events.setSorting",
      "global.createCategoriesList"
    ]);
    //BLUEBOY.utility.blur(["a"], ["input", "categoriesForm"]); //blur all links and inputs;
    BLUEBOY.utility.blur(["a"], ["input", document.getElementsByTagName("form")[0]]); //blur all links and inputs;

    setTimeout(function() { BLUEBOY.global.fadeOut($("splashScreen")); }, 2000); //activate the splash screen;
    document.forms[0].elements["clear"].onclick = function () { $("phrase").focus(); }; //use the HTML DOM to target the "Clear" button;

  },

  /************************************************************************************************************
  *************************************************************************************************************
  ************************************************************************************************************/
  accordion: function (oDiv) {

    var iCurrentHeight = parseInt(oDiv.style.height.replace(/px/, "")); //convert the height to a number or "currentHeight + 10" will add two strings together instead of two numbers;

    if (oDiv.state == "closed") { //open the div;
      if (iCurrentHeight < oDiv.divHeight) { //remember oDiv.divHeight is the total height of the <div>;
        oDiv.style.height = (iCurrentHeight + 10) + "px";
        setTimeout(function () { BLUEBOY.global.accordion(oDiv); }, 10);  
      } else {
        oDiv.state = "opened"; //div is fully opened so let div.state reflect that;
        oDiv.previousSibling.style.backgroundImage = "url(images/minus.gif)";

        if (!document.accordions) document.accordions = []; //create an array that will hold all of the "open" accordion <div>s so when the menu is hidden these can be closed if they are still open (attach it to the document object);
        document.accordions.push(oDiv);
      }
	
    } else if (oDiv.state == "opened") { //close the div;
      if (iCurrentHeight > 10) {
        oDiv.style.height = (iCurrentHeight - 15) + "px";  //close the accordion faster than it's opened;
        setTimeout(function () { BLUEBOY.global.accordion(oDiv); }, 10);
      } else { //div is fully closed so let div.state reflect that;
        oDiv.state = "closed";
        oDiv.style.height = "0";
        oDiv.previousSibling.style.backgroundImage = "url(images/plus.gif)";

        /*remove from the array the <div> that's been closed*/
        for (var i = 0; i < document.accordions.length; i++) {
          if (oDiv == document.accordions[i]) {
            document.accordions.splice(i, 1);
            if (document.accordions.length == 0) { //if the array is empty then delete it;
              delete document.accordions;
            }
            return;
          }
        }
          
      }
    }

    if (arguments.length > 1) { //override (for when closing multiple divs when hiding the menu)
      for (var i = 1; arguments[i] != null; i++) {
        arguments.callee(arguments[i]);
      }
    }

  },

  /************************************************************************************************************
  *************************************************************************************************************
  ************************************************************************************************************/
  createCategoriesList: function () {

    BLUEBOY.xhr.ajax({ //create the drop-down list from the xml doc;
      url: "lib/xml/code_buddy.xml",
      data: "xml",
      //type: "GET",
      onSuccess: function(xmldoc) { //parse the XML;
        var oList = $("selectType"); //the <select> list to where all the categories will be appended;
        var cTechnologies = xmldoc.getElementsByTagName("technology"); //referes to each Category such as "CSS", "Games", "Widgets", etc.;
        var iTechnologiesLength = cTechnologies.length;
        for (var i = 0; i < iTechnologiesLength; i++) {

          /*create and append all of the more specific subgroups*/
	  if (cTechnologies[i].getAttribute("list") == "subgroup") { //there's a submenu, create an <optgroup> which will be non-clickable (i.e., "DHTML", "GAMES", etc.);
	    var oSubgroup = document.createElement("optgroup");
	    oSubgroup.setAttribute("label", cTechnologies[i].getAttribute("type")); //the non-clickable list item (same as subgroup);
	    for (var j = 0; j < cTechnologies[i].childNodes.length; j++) { //create the selectable categories w/in each subgroup (i.e., "Drag and Drop", "Memory", "Scrubber", etc.);
	      if (cTechnologies[i].childNodes[j].nodeType == 1) { //create the elem w/ its attributes and append it to subgroup;
                BLUEBOY.utility.createElem({elem: "option",
                  attributes: {
                    innerHTML: cTechnologies[i].childNodes[j].getAttribute("app"),
                    value: cTechnologies[i].childNodes[j].getAttribute("app")
                  },
                  parent: oSubgroup
                });
	      }
            }
            oList.appendChild(oSubgroup); //append all the subgroups and their respective menu items to the root <select> element ($("selectType"));
            continue; //skip 'Widgets' as an <option> in the list;
	  }

          /*create and append the general categories, i.e., "Ajax", "CSS", "HTML", and "JavaScript", to the root <select> element*/
          BLUEBOY.utility.createElem({elem: "option",
            attributes: {
              innerHTML: cTechnologies[i].getAttribute("type"),
              value: cTechnologies[i].getAttribute("type")
            },
            parent: oList
          });

        }
      }
    });

  },

  /************************************************************************************************************
  *************************************************************************************************************
  ************************************************************************************************************/
  fadeOut: function (oElem) {

    /*fade out the splash screen and remove it from the DOM*/
    var vOpaque = document.addEventListener ? BLUEBOY.utility.getStyle(oElem, "opacity") : BLUEBOY.utility.getStyle(oElem, "filter");
    if (document.attachEvent) {
      vOpaque = parseInt(vOpaque.replace(/.*=(.+)\)/g, function (a, b) { return b; }));
    }

    if (vOpaque < .05) { //hack; when vOpaque is below .05 it would never reach 0, not sure why;
      vOpaque = 0;
    }
    if (vOpaque > 0) { //fade the elem;
      document.addEventListener ? oElem.style.opacity = vOpaque - .05 : oElem.style.filter = "alpha(opacity=" + (vOpaque - 5) + ")";
      oElem.fade = setTimeout(function() { BLUEBOY.global.fadeOut(oElem); }, 120);
    } else if (vOpaque <= 0) {
      clearTimeout(oElem.fade);
      document.body.removeChild(oElem);
    }


  },

  /************************************************************************************************************
  *************************************************************************************************************
  ************************************************************************************************************/
  submenus: ["Accordion", "Browser Bugs", "Client-side", "Context", "Core", "Design Patterns", "Disabler", "Drag and Drop", "ECMAScript", "Events", "Greater Than", "Inheritance Patterns", "Layout via Absolute Positioning", "Memory", "OOP", "Optimization", "Primitive Types and Reference Types", "(More) Primitive Types and Reference Types", "Scope", "Scroll Menu", "Scrubber", "Select and Option Elements", "Server-side-driven Menu", "Sliding Doors", "Sliding Menu", "Splash Screen", "Text Copy", "Tooltip", "Yellow Fade Technique"],
  links: [],

  HEAD: {

    sLastModified: null,
    links: [],

    getHeaders: function (oTemp) {

      /*this function takes an element and then iterates through all of its child elements to extract info from each file in the node's tree; it's passed either the <technology> element or the <item> element (for widgets) or <location> (when searching by filename)*/
      if (oTemp.nodeName != "location") {
        var cLocations = oTemp.getElementsByTagName("location");
        var cDescriptions = oTemp.getElementsByTagName("description");
      } else {
        var cLocations = oTemp;
      }
		  
      var iLocationsLength = cLocations.length;
      for (var i = 0; i < iLocationsLength; i++) {
        var sLocation = cLocations[i].firstChild.nodeValue;
        var sDescription = cDescriptions[i].firstChild.nodeValue;

        BLUEBOY.xhr.ajax({ //get the Last Modified info from the headers of each file;
          url: sLocation, //contains the location of the file in the filesystem;
          type: "HEAD",
          header: "Last-Modified",
          onSuccess: function(sHeader) {
            BLUEBOY.global.HEAD.sLastModified = sHeader;
          }
        });

        arguments[1] && cLocations[i].getAttribute("content") ? /*submenus have a "content" attribute that tells the script how to draw the colorful box in the right-hand pane (and also a second argument has been passed to the function, so we know to include the "content" as an array element); the array contains ([the location of the file, the description of the file, when it was Last Modified, [and what type of file it is (for widgets)]])*/
        this.links.push([sLocation, sDescription, this.sLastModified, cLocations[i].getAttribute("content")]) : 
          this.links.push([sLocation, sDescription, this.sLastModified]);

      }

    }

  },
		
  /************************************************************************************************************
  *************************************************************************************************************
  ************************************************************************************************************/

  setMenu: {

    bOpen: false,
    oElem: null,
    iTimer: null,

    fnHandler: function (oTemp) {
      $("menuHandle").firstChild.nodeValue = oTemp.text;
      $("menuHandle").className = oTemp.classname || "";
      this.oElem.style.left = oTemp.x + "px";
      clearTimeout(this.iTimer);
      this.iTimer = setTimeout(function () { BLUEBOY.global.setMenu.slideMenu(oTemp.x, oTemp.z); }, 0);
    },

    init: function (sElem, iCoord) {
      this.oElem = $(sElem);
      if (!this.bOpen) {
        this.bOpen = true;
        this.slideMenu(iCoord, 0);

      } else {
        if (document.accordions) { //there are accordions <div>s still open, so pass the array of html objects to the method to close them;
          BLUEBOY.global.accordion.apply(null, document.accordions);
        }
        this.bOpen = false;
        this.slideMenu(0, iCoord);
      }
    },

    slideMenu: function (x, z) {
      if (x > z) {
        this.fnHandler({
          x: x -= 10,
          z: z,
          text: "Show Menu"
        });
      } else if (x < z) {
        this.fnHandler({
          x: x += 10,
          z: z,
          classname: "opened",
          text: "Close Menu"
        });
      } else {
        clearTimeout(this.iTimer);
      }

    }

  },

  /************************************************************************************************************
  *************************************************************************************************************
  ************************************************************************************************************/
  sorting: function (oTemp) {

    var cLis = $("results").getElementsByTagName("li");
    var aSorted = [];
    var fnSortIt = function (a, b) { //if the user clicked on the "Filename" column then obj.id will == "filename" and each object in the comparision function will have a property mapped to "filename" (same wcase for the other sort columns);
      var x = Date.parse(a[oTemp.id].slice(15)) || a[oTemp.id].toLowerCase(); //if we're comparing "Last Modified" date, return everything after "Last Modified: " and convert to Unix timestamp ELSE convert string to lower case before comparison; 
      var y = Date.parse(b[oTemp.id].slice(15)) || b[oTemp.id].toLowerCase(); 
      return (x < y ? -1 : (x > y ? 1 : 0));
    };

    var iLisLength = cLis.length;
    for (var i = 0; i < iLisLength; i++) { //create an object that represents each list item for use by the sortIt() method;
      aSorted.push({ //obj.id contains the column to sort ("filename", "description", or "lastModified") so create an object that contains each property that could be sorted plus a reference to the element itself;
        elem: cLis[i],
        filename: cLis[i].firstChild.firstChild.nodeValue,
        description: cLis[i].firstChild.nextSibling.firstChild.nodeValue,
        lastModified: cLis[i].firstChild.nextSibling.nextSibling.firstChild.nodeValue
      }); //send along an object as each array element;
    }

    if ($("sortable").sortColumn == oTemp.id) {
      aSorted.reverse(fnSortIt);
      oTemp.className = $("sortable").direction; //attach the classname to the sort column that will display the directional sort image;
    } else {
      aSorted.sort(fnSortIt);
      oTemp.className = "ascending"; //attach the classname to the sort column link that will display the directional sort image;
    }

    var oFragment = document.createDocumentFragment();
    var iSortedLength = aSorted.length;
    for (var i = 0; i < iSortedLength; i++) { //remove each list item from the DOM...;
      oFragment.appendChild(aSorted[i].elem);
    }

    $("results").appendChild(oFragment); //...and reinsert;
    $("sortable").sortColumn = oTemp.id; //attach a property containing the column that was just sorted ("filename", "description", or "lastModified") to the <div> that contains the sort links;
    $("sortable").direction = oTemp.className == "descending" ? "ascending" : "descending"; //attach a property containing the classname that will be given to the sort column link which will determine the directional sort image;

    //hide the arrow image of the element that isn't being clicked;
    var cLinks = $("sortable").getElementsByTagName("a");
    var iLinksLength = cLinks.length;
    for (var i = 0; i < iLinksLength; i++) {
      if (cLinks[i].id != oTemp.id) {
        cLinks[i].className = "noImage";
      }
    }

  }

};

BLUEBOY.utility.addLoadEvent(BLUEBOY.global.init);
