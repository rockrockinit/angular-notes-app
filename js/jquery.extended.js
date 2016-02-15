/**
 * jQuery Extensions
 * This is a collection of jQuery extensions that act as utilities and migration tools.
 * 
 * @version 1.0
 * @requires
 * 		jquery.js 1.7+
 * @author Ed Rodriguez
 * @minify true
 */
(function($){
	
	/**
	 * Serves as a migration tool for the deprecated $.browser
	 *
	 * @usage Widely used by various plugins
	 */
	var userAgent = navigator.userAgent.toLowerCase();
	$.browser = {
		version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [0,'0'])[1],
		safari: /webkit/.test(userAgent),
		opera: /opera/.test(userAgent),
		msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
		mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
	};
    
	/**
	 * Selects a range in form field elements.
	 *
	 * @usage Widely Used
	 * @param integer start The start position.
	 * @param integer end The end position.
	 */
	$.fn.selectRange = function(start, end){
		if(!end) end = start; 
		return this.each(function(){
			if(typeof(this.setSelectionRange) !== 'undefined'){
				this.focus();
				this.setSelectionRange(start, end);
			}else if(typeof(this.createTextRange) !== 'undefined'){
				var range = this.createTextRange();
				range.collapse(true);
				range.moveEnd('character', end);
				range.moveStart('character', start);
				range.select();
			}
		});
	};
	
	/**
	 * Returns the element's true html or can be used to replace the current element.
	 *
	 * @usage Widely Used
	 * @param string s The html string to repalce the current element with.
	 * @return string The current elements outer html.
	 */
	$.fn.outerHTML = function(s){
		return (s)
		? this.before(s).remove()
		: $('<p>').append(this.eq(0).clone()).html();
	};
	
	/**
	 * Serializes an array of forms into a single data object.
	 * 
	 * @usage Widely Used
	 * @return object An object with key/value pairs.
	 */
	$.fn.serializeObject = function(){
		var o = {}, a = this.serializeArray(), h = $('[data-hint]', this);
		$.each(a, function(){
			if(o[this.name] !== undefined){
				if(!o[this.name].push){
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			}else{
				o[this.name] = this.value || '';
			}
			
			var hint = h.filter('[name="'+this.name+'"]');
			if(hint.length === 1 && o[this.name] === hint.attr('data-hint')){
				o[this.name] = '';
			}
		});
		return o;
	};
	
	/**
	 * Converts an element into a form for serialization.
	 *
	 * @usage Widely Used
	 * @bug-fixes
	 * 		2012-04-30 | edr | Form values not cloning properly
	 * 		2013-07-25 | edr | Added hidden, checkbox, radio
	 * @link http://stackoverflow.com/questions/742810/clone-isnt-cloning-select-values
	 * @return object An object with key/value pairs.
	 */
	$.fn.serializeElement = function(){
		var src = $(this),
		clone = $('<form></form>').append(src.clone()),
		fields = ['textarea', 'select', 'input[type="text"]', 'input[type="hidden"]', 'input[type="checkbox"]', 'input[type="radio"]'];
		
		for(var i=0; i<fields.length; i++){ 
			var selector = fields[i],
			items = src.find(selector);
			items.each(function(index){
				var field = $(this);
				if(field.get(0).tagName.match(/^(input)$/i) && typeof(field.attr('type')) !== 'undefined' && field.attr('type').match(/^(checkbox|radio)$/i)){
					$(clone).find(selector).eq(index).attr('checked', field.attr('checked'));
				}else{
					$(clone).find(selector).eq(index).val(field.val());
				}
			});
		}
		return clone.serializeObject();
	};
	
	/**
	 * Fires a callback when images have loaded for an element.
	 *
	 * @usage
	 * 		- image, file & video modules
	 * @param function callback The event to trigger when each image loads.
	 * @param function callonlast The event to trigger when the last image loads.
	 */
	$.fn.imagesLoaded = function(callback, callonlast){
		callonlast = (typeof(callonlast) === 'undefined') ? 0 : callonlast;
		var elems = $('img', this),
		elemsLen = elems.length,
		check = 1;
		
		$.cms.log('Images Total: '+elems.length);
		if(elems.length){
			elems.each(function(index, item){
				var elem = $(this);
				elem.on('load', function(e){
					if(check){
						elemsLen--;
						if(callonlast){
							$.cms.log('Loaded');
							if(!elemsLen){
								if(typeof(callback) === 'function'){
									callback.call(elems, e);
								}
								$.cms.log('Images Loaded');
								check = 0;
							}
						}else{
							//$.cms.log('Loaded');
							if(typeof(callback) === 'function'){
								callback.call(elems, e);
							}
							if(!elemsLen){
								$.cms.log('Images Loaded');
								check = 0;
							}
						}
					}
				});
				
				// cached images don't fire load sometimes, so we reset src.
				if(this.complete || this.complete === undefined){
					this.src = this.src;
				}
			});
		}else{
			if(typeof(callback) === 'function'){
				callback.call(this);
			}
		}
	};
	
	/**
	 * Adds custom hooks to jquery events.
	 *
	 * @usage
	 * 		- menu module
	 * @param string method The name of the method to add a hook to.
	 * @param method fn The function to call as a hook.
	 */
    $.hook = function(methods, fn){
		methods = (typeof methods === 'string') ? methods.split(/,? +/) : methods;
		methods = (methods instanceof Array) ? methods : [];
		
		for(var i=0; i<methods.length; i++){
			var method = methods[i];
			if(!isEmpty(method) && $.fn[method]){
				var def = $.fn[method];
				if(def){
					$.fn[method] = function(){
						var r = def.apply(this, arguments); //original method
						fn(this, method, arguments); //injected method
						return r;
					}
					$.cms.log(method);
				}
			}
		}
    };
	
	/**
	 * Performs jsonp ajax requests.
	 * 
	 * @param string s The ajax object to process.
	 */
	$.getJSONP = function(s){
		s.dataType = 'jsonp';
		var xhr = $.ajax(s);
		
		// figure out what the callback fn is
		var $script = $(document.getElementsByTagName('head')[0].firstChild);
		var url = $script.attr('src') || '';
		var cb = (url.match(/callback=(\w+)/)||[])[1];
		if (!cb)
			return; // bail
		var t = 0, cbFn = window[cb];
		
		$script[0].onerror = function(e){
			$script.remove();
			handleError(s, {}, 'error', e);
			clearTimeout(t);
		};
		
		if (!s.timeout)
			return;
		
		window[cb] = function(json){
			clearTimeout(t);
			cbFn(json);
			cbFn = null;
		};
		
		t = setTimeout(function(){
			$script.remove();
			handleError(s, {}, 'timeout');
			if (cbFn)
				window[cb] = function(){};
		}, s.timeout);
		
		function handleError(params, obj, type, textStatus){
			params.error(xhr, textStatus);
			if(0){
				$.cms.log(params);
				$.cms.log(obj);
				$.cms.log(type);
				$.cms.log(textStatus);
			}
			// support jquery versions before and after 1.4.3
			//($.ajax.handleError || $.handleError)(s, o, msg, e);
		}
	};
	
	/**
	 * Converts a query string into an object.
	 *
	 * @link http://stackoverflow.com/questions/1162791/jquery-query-string-traversal
	 * @param string s The query string to convert.
	 * @return object The query string object.
	 */
	$.query = function(s){
		var r = {};
		s = (typeof(s) === 'undefined') ? document.location.search : s;
		if(s){
			if(s.indexOf('?') >= 0){
				s = s.substring(s.indexOf('?') + 1); // remove everything up to the ?
			}
			if(s.indexOf('#') >= 0){
				s = s.substring(0, s.indexOf('#')); // get everything before hash
			}
			s = s.replace(/\&amp;/, '&'); // fix amps
			s = s.replace(/\&$/, ''); // remove the trailing &
			$.each(s.split('&'), function(){
				var splitted = this.split('=');
				if(splitted.length === 2){
					var key = splitted[0];
					var val = splitted[1];
					// convert numbers
					if(/^[0-9.]+$/.test(val)){
					  val = parseFloat(val);
					}
					// convert booleans
					if(val == 'true'){
					  val = true;
					}
					if(val == 'false'){
					  val = false;
					}
					// ignore empty values
					if(typeof val == 'number' || typeof val == 'boolean' || val.length > 0){
					  r[key] = val;
					}
				}else if(splitted.length === 1){
					r[splitted[0]] = '';
				}
			});
		}
		return r;
	};
	
	/**
	 * Converts a json object to a string for browsers that don't support the latest JSON lib.
	 *
	 * @param string s The query string to convert.
	 * @return object The query string object.
	 */
	$.extend({
		stringify: function stringify(obj){         
			if('JSON' in window){
				return JSON.stringify(obj);
			}
			var t = typeof (obj);
			if(t != 'object' || obj === null){
				// simple data type
				if (t == 'string') obj = '"' + obj + '"';
				return String(obj);
			}else{
				// recurse array or object
				var n, v, json = [], arr = (obj && obj.constructor == Array);
				for(n in obj){
					v = obj[n];
					t = typeof(v);
					if(obj.hasOwnProperty(n)){
						if (t == 'string') {
							v = '"' + v + '"';
						} else if (t == "object" && v !== null){
							v = $.stringify(v);
						}
						json.push((arr ? "" : '"' + n + '":') + String(v));
					}
				}
				return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
			}
		}
	});
})(jQuery);