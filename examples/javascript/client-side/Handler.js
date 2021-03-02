/*David Flanagan's Handler module,
allows for portable event-handler registration functions.

**************************************************************
NOTE: this has been altered to fit Crockford's module pattern.
**************************************************************

******************
For documentation refer to pages 414 - 419 of the rhino book
******************
*/
var Handler = (function () {
	
	var _find = function (element, eventType, handler) {
		var handlers = element._handlers;
		if (!handlers) return -1;
		
		var d = element.document || element;
		var w = d.parentWindow;
		
		for (var i = handlers.length; i >= 0; i--) {
			var handlerId = handlers[i];
			var h = w._allHandlers[handlerId];
			
			if (h && h.eventType == eventType && h.handler == handler) {
			  return i;
			}
		}
		
		return -1
	};
	
	var _removeAllHandlers = function () {
		var w = this;
		for (var id in w._allHandlers) {
			var h = w._allHandlers[id];
			h.element.detachEvent("on" + h.eventType, h.wrappedHandler);
			delete w._allHandlers[id];
		}
	};

	var _uid = (function () {
	  var _counter = 0;
	  return function () { return "h" + _counter++; };
  })();
	
	return {
		
		add: function (element, eventType, handler) {
      if (document.addEventListener) {
		    element.addEventListener(eventType, handler, false);
				
	    } else if (document.attachEvent) {

				if (_find(element, eventType, handler) != -1) return;
		
				var wrappedHandler = function (e) {
					if (!e) e = window.event;
			
					var event = {
						_event: e,
						type: e.type,
						target: e.srcElement,
						currentTarget: element,
						relatedTarget: e.fromElement ? e.fromElement : e.toElement,
						eventPhase: (e.srcElement == element) ? 2 : 3,
				
						clientX: e.clientX, clientY: e.clientY,
						screenX: e.screenX, screenY: e.screenY,
				
						altKey: e.altKey, ctrlKey: e.ctrlKey,
						shiftKey: e.shiftKey, charCode: e.keyCode,
				
						stopPropagation: function () { this._event.cancelBubble = true; },
						preventDefault: function () { this._event.returnValue = false; }
					};
			
					if (Function.prototype.call) {
			  		handler.call(element, event);
					} else {
						element._currentHandler = handler;
						element._currentHandler(event);
							element._currentHandler = null;
					}
				};
		
				element.attachEvent("on" + eventType, wrappedHandler);
		
				var h = {
					element: element,
					eventType: eventType,
					handler: handler,
						wrappedHandler: wrappedHandler
				};
		
				var d = element.document || element;
				var w = d.parentWindow;
		
				var id = _uid();
				if (!w._allHandlers) w._allHandlers = {};
				w._allHandlers[id] = h;
		
				if (!element._handlers) element._handlers = [];
				element._handlers.push(id);
		
				if (!w._onunloadHandlerRegistered) {
					w._onunloadHandlerRegistered = true;
					w.attachEvent("onunload", _removeAllHandlers);
				}
		
			}
		},
	
		remove: function (element, eventType, handler) {
			if (document.removeEventListener) {
		    element.removeEventListener(eventType, handler, false);
				
			} else if (document.detachEvent) {
				
				var i = _find(element, eventType, handler);
				if (i == -1) return;
		
				var d = element.document || element;
				var w = d.parentWindow;
		
				var handlerId = element._handlers[i];
				var h = w._allHandlers[handlerId];
		
				element.detachEvent("on" + eventType, h.wrappedHandler);
				element._handlers.splice(i, 1);
				delete w._allHandlers[handlerId];
		
			}
		}
		
	}; //end return object;
	
})();