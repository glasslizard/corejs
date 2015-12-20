window.onloadFunctions	= [];
window.scriptIncludePath= '/public/js/';
if(typeof jQuery==='undefined') console.log('core: better off using jquery but it is not required');

/*
var old = alert;

alert = function() {
  console.log(new Error().stack);
  old.apply(window, arguments);
};
*/

//PROTOTYPAL ************************
	if(!RegExp.escape){
		RegExp.escape= function(s) {
			return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		};
	}
	
	if(!Array.prototype.last){//get last element in array.	
		Array.prototype.last=function(){
			return this[this.length-1];
		}
	}
	
	if(!Array.prototype.indexOf){//
		Array.prototype.indexOf=function(s){
			var l=this.length;
			while(l){
				l--;
				if(this[l]==s){return l;}
			}
			return -1;
		}
	}
	
	Array.prototype.hasList=function(list,o){//l(list: delimited list),o={ordermatters(order matters: true/false),delimiter(delimiter: default ',')}
		if(!o.delimiter){o.delimiter=',';}
		if(!o.ordermatters){o.ordermatters=false;}
		var l=this.length,a=list.split(o.delimiter),_l=a.length;
		if(!o.ordermatters){	
			while(_l){
				_l--;
				if(!this.indexOf(a[_l])){return false;}
			}
		}else{
			while(_l){
				if(!this[_l]==a[_l]){return false;}
			}
		}
		return true;	
	}
	
	if(!Array.prototype.removeValues){//takes any number of arguments and removes them from the array
		Array.prototype.removeValues = function() {
			var what, a = arguments, L = a.length, ax;
			while (L && this.length) {
				what = a[--L];
				while ((ax = this.indexOf(what)) !== -1) {
					this.splice(ax, 1);
				}
			}
			return this;
		};
	}
	
	if(!Array.prototype.changeCSS){	
		Array.prototype.changeCSS=function(p,v){
			var x=this.length;
			while(--x > l){this[x].style[p]=v;}
		};
	}
	
	if(!Array.prototype.arrayWalk){	
		Array.prototype.arrayWalk=function(f){
			var l=this.length,i=0;
			for(i;i<l;i++){
				this[l]=f(this[l]);
			}
		};
	}
	
	Math.toPercent=function(p,n){//DECIMAL TO PERCENT W/ % SIGN
		return (Number(p)*100.0)+'%';
	}
	
	Math.fromPercent=function(p){//PERCENT TO DECIMAL(WITH OR WITHOUT % SIGN)
		return parseFloat(p)/100.0;
	}
	
	Number.prototype.toPrecision=function(){
		var t=String(this).match(/^\d*\.{0,1}\d{0,2}/);
		return Number(t);
	}
	
	window.offSetY=(function(){
		if(window.pageYOffset){var func=function(){return window.pageYOffset;};}
		else{
			var func=(function(t){
				var func;
				if(t.ScrollTop=='number'){
					func=function(){return t.scrollTop;};}
				else{
					func=function(){return  document.body.scrollTop;};
				}
				return func;
			}(document.documentElement||document.body.parentNode));
		}
		return func;
	}());
	
	String.prototype.stringDifference=function(strB){
		var l=this.length-1;
		for(var x=0;x<l;x++){
			if(strB.charAt(x)!==this.charAt(x)){
				return strB.substr(x);
			}
		}
		return strB.substr(x);
	};
	
	if(!String.prototype.replaceAll){
		String.prototype.replaceAll=function(reg,rep){
			return this.replace(new RegExp(reg,'g'),rep);
		};
	}
	
	if(!String.prototype.replaceAllNoCase){
		String.prototype.replaceAllNoCase=function(reg,rep){
			return this.replace(new RegExp(reg,'ig'),rep);
		};
	}
	
	if(!String.prototype.replaceNoCase){
		String.prototype.replaceNoCase=function(reg,rep){
			return this.replace(new RegExp(reg,'i'),rep);
		};
	}
	
	if(!String.prototype.replaceAllUsing){
		String.prototype.replaceAllUsing=(function(){
			var obj;
			var dynamicReplace = function(match,$1){
				return obj[$1.toLowerCase()];
			};
			return function(reg,repObj){
				obj = repObj;
				return this.replace(new RegExp(reg,'g'),dynamicReplace);
			};
		}())
	}
	
	if(!String.prototype.toggleListValue){
		String.prototype.toggleListValue=function(value,delim){
			value = String(value);
			if(!this.length){ return value; }
			if(this === value){ return ""; }
			
			if(typeof delim ==='undefined'){ delim = ','; }
			var arr = this.split(delim);
			
			if((i = arr.indexOf(value)) === -1) return arr.join(delim) + delim + value;
			return arr.removeValues(value).join(delim);
		};
	}
	
	if(!String.prototype.removeListValue){
		String.prototype.removeListValue=function(value,delim){
			value = String(value);
			if(!this.length || this === value){ return ""; }
			
			if(typeof delim ==='undefined'){ delim = ','; }
			var arr = this.split(delim);
			
			if((i = arr.indexOf(value)) === -1) return this;
			return arr.removeValues(value).join(delim);
		};
	}
	
	if(!String.prototype.decodeHTML){
		String.prototype.decodeHTML=function(){
			return decodeURI(this.replaceAll('[\\r\\t\\n]',' ').replaceAll('&lt;','<').replaceAll('&gt;','>'));
		};
	}
	
//STANDARDIZING FUNCTIONS ************************
	document.cb_addEventListener=(function(){
		if(document.addEventListener){
			var func=function(a,b,c){
				this.addEventListener(a,b,c);
			};
		}else{
			var func=function(a,b,c){
				this.attachEvent('on'+a,b);
			};
		}
		return func;
	}());

	document.cb_removeEventListener=(function(){
		if(document.removeEventListener){
			var func=function(a,b,c){
				this.removeEventListener(a,b,c);
			};
		}else{
			var func=function(a,b,c){
				this.detachEvent('on'+a,b);
			};
		}
		return func;
	}());
	
	
	if(!document.querySelectorAll){
		if(!jQuery){
			document.querySelectorAll=function(str){
				var p,m,l,_l,__l,c,i,j;
				if(str.indexOf('#')!==-1){
					m=str.split('#'),m=m.last().split(' '),p;
					if(m.length===1){return document.getElementById(m[0].match(/^([^#\.]+)/)[1]);}else{p=[document.getElementById(m[0])];}
				}else{
					m=str.split(' '),l=m.length;
				}
				for(i=0;i<l;i++){//recurse through css blocks starting from left-most
					_l=p.length;
					while(_l){
						_l--;
						c=document.getElementsByTagName(m[i].match(/^([^.]+)/)[1])||p.children||p.childNodes;__l=c.length;
						while(__l){//check all children for matches, pop each child off as checked and add on any matches.
							__l--;						
							if(!p[_l][c[__l]].className.split(' ').hasList(m[i].replace('.',','))){c.splice(__l,1);}
						}
					}
					p=c;
				}
				return c;
			}
		}else{
			document.querySelector=function(str){
				return jQuery(str)[0];
			}
		}
	}
	

//CORE object ************************
var core=(function(){
	var 
		d 			= document||documentElement,
		self		= {},
		init		= {},
		__private 	= {}
	;
	
	window.height = window.innerHeight || d.clientHeight || d.getElementsByTagName('BODY')[0].clientHeight;
	window.width = window.innerWidth || d.clientWidth || d.getElementsByTagName('BODY')[0].clientWidth;
	
	window.addEventListener('resize',function(){
		window.height = window.innerHeight || d.clientHeight || d.getElementsByTagName('BODY')[0].clientHeight;
	},false);
	
	__private.whichTransitionEvent = function(){
		var t;
		var el = document.createElement('fakeelement');
		var transitions = {
		'transition':'transitionend',
		'OTransition':'oTransitionEnd',
		'MozTransition':'transitionend',
		'WebkitTransition':'webkitTransitionEnd'
		}
	
		for(t in transitions){
			if( el.style[t] !== undefined ){
				return transitions[t];
			}
		}
	};
	
	init.onPageOut =  (function(){
		var self={executeFuncs:[]},
			init=function(func){self.executeFuncs.push(func);}
		;
		init.getFuncs=self.executeFuncs;
		
		window.addEventListener('beforeunload',function(e){
			var funcs=core.onPageOut.getFuncs;
			var l=funcs.length;
			funcs.forEach(function(val,index,array){val();});					
		},false);
		
		return init;
	}());
	
	init.getFirstTextNode = function(el){
		for(var i=0,l=el.childNodes.length; i<l && el.childNodes[i].nodeName !== "#text"; i++){}
		return el.childNodes[i]||(el = el.insertBefore(document.createTextNode(''), el.firstChild)||el.firstChild);
	};
	
	init.onTransformEnd = (function(){
		var transitionVernacular = __private.whichTransitionEvent();
		return function(el,func){
			func = function(e){ func(e); this.removeEventListener(transitionVernacular,func,false); };
			el.addEventListener(transitionVernacular,func,false);
		};
	}());
	
	init.onResize = (function(){
		var __private	= {onResize:[]};
		var __public	= function(func,args){
			if(!Array.isArray(args)) args = [args];
			__private.onResize.push({func:func,args:args});
		};
		window.addEventListener('resize',function(){__private.onResize.forEach(function(obj,key){
			obj.func.apply(this,obj.args);
		});},false);
		return __public;
	}());
	
	init.addEventListener = (function(){
		var func;
		if(document.addEventListener){
			func=function(el,a,b,c){
				el.addEventListener(a,b,c);
			};
		}else{
			func=function(el,a,b,c){
				el.attachEvent('on'+a,b);
			};
		}
		return func;
	}());
	
	//set the values of obj by sending in comparisonObj (will add the properties (of comparisonObj) to obj if not exists)
	init.setNestedProperties = function(obj,comparisonObj){
		//console.log('setNestedProperties',obj,comparisonObj);
		for(var prop in comparisonObj){
			if(typeof obj[prop] === 'undefined') obj[prop] = {};
			if(typeof comparisonObj[prop] === 'object' && comparisonObj[prop] !== null){ init.setNestedProperties(obj[prop],comparisonObj[prop]); }
			else{ obj[prop] = comparisonObj[prop]; }
		}
	};
	
	//delete the values of obj by sending in comparisonObj
	init.deleteNestedProperties = function(obj,comparisonObj){
		//console.log('deleteNestedProperties',obj,comparisonObj);
		for(var prop in comparisonObj){
			if(typeof obj[prop] === 'undefined') continue;
			if(typeof comparisonObj[prop] === 'object' && comparisonObj[prop] !== null){ init.deleteNestedProperties(obj[prop],comparisonObj[prop]); }
			else{ delete obj[prop]; }
		}
	};
	
	init.prependChild = function(par,child){
		par.insertBefore(child,par.firstChild);
	};

	init.insertAfter = function(elder,younger){
		elder.parentNode.insertBefore(younger, elder.nextSibling);
	};

	init.deleteElement = function(el){
		el.parentNode.removeChild(el);
	};

	init.replaceElement = function(el,replacement){
		var elder=el.parentNode,sibling=el.nextSibling;
		elder.removeChild(el);
		elder.insertBefore(replacement,sibling);
	};

	init.replaceByHTML = function(el,HTMLStringReplacement){
		var sibling=el.previousSibling,command='afterend',whereSibling="nextSibling";
		if(!sibling){command='beforebegin';sibling=el.nextSibling,whereSibling="previousSibling";}
		core.deleteElement(el);
		sibling.insertAdjacentHTML(command, HTMLStringReplacement);
		return sibling[whereSibling];
	};

	init.castToArray = function(o){
		var arr=[],i;
		for(i=o.length;i--;arr.unshift(o[i]));
		return arr;
	};

	init.isNumeric = function(o){
		return !Array.isArray(o) && (o - parseFloat(o) + 1) >= 0;
	};

	init.hexToRgb = function(hex){
		if(hex.charAt(0)==='#'){hex=hex.substr(1);}
		if(hex.length===3){hex=hex.replace(/^(.)(.)(.)$/,function(m,r,g,b){return r+r+g+g+b+b;});}
		var bigint = parseInt(hex, 16),
			r = (bigint >> 16) & 255,
			g = (bigint >> 8) & 255,
			b = bigint & 255
		;
	
		return r + "," + g + "," + b;
	};

	init.addElementAsParent = function(el,par) {
		if(typeof el === 'string') { el = document.getElementById(el); }
		
		var cur_par	= el.parentNode;
		var new_el 	= document.createElement(par);
		
		cur_par.replaceChild(new_el,el);
		new_el.appendChild(el);
		
			return new_el ;
	};
		
	init.unpackParent = function(p) {//can pass true or 1 as argument[1] to allow recursion and unpacking or entire container
		var g=p.parentNode,c=p.childNodes,i=0,len=c.length;
		for(i;i<len;i++){
			g.appendChild(c[i]);
				if(arguments[1]){unpackparent(c[i]);}
		}
	};
		
	init.unpackChild = function(c) {
		var g=c.parentNode.parentNode;
		g.appendChild(c);
	};

	init.reCloak = function(a){
		var l=a[0].length-1;
		while(l){
			l--;
			//a[0][l].style.cssText=a[0][l].cacheStyle.pop();
			a[0][l].className=a[0][l].className.replace(' uncloak','');
		}
	};

	init.unCloak = function(el,i){//el is element to uncloak, i the number of parents to test, returns array of the uncloaked elements
		var a=[[]];
		i=i||999;
		while(el.tagName!='BODY' && i){
			i--;
			a[0].push(el);	
			//if(!el.cacheStyle){el.cacheStyle=[];}else{el.cacheStyle.push(el.style.cssText);}
			el.className=el.className+' uncloak';
			el=el.parentNode;
		};
		return a;
	};

	init.effectiveWidth = function(el,W){//0:total width, 1:width-(minus)padding, 2:left padding 3:right padding, 4:left margin, 5:right margin
		var st=el.style.cssText,S=el.currentStyle || window.getComputedStyle(el),pL=S.paddingLeft.match(/[0-9\.]+/),pR=S.paddingRight.match(/[0-9\.]+/),mL=S.marginLeft.match(/[0-9\.]+/),mR=S.marginRight.match(/[0-9\.]+/);
		//console.log('effectiveWidth: '+el.tagName+'.'+el.className+': -> '+([W,W-pL-pR,pL,pR,mL,mR]).toString());
		return [W,W-pL-pR,pL,pR,mL,mR];	
	};

	init.effectiveHeight = function(el,H){//0:total width, 1:width-padding, 2:left padding 3:right padding, 4:left margin, 5:right margin
		var st=el.style.cssText,S=el.currentStyle || window.getComputedStyle(el),pT=S.paddingTop.match(/[0-9\.]+/),pB=S.paddingBottom.match(/[0-9\.]+/),mT=S.marginTop.match(/[0-9\.]+/),mB=S.marginBottom.match(/[0-9\.]+/);
		return [H,H-pT-pB,pT,pB,mT,mB];	
	};

	init.getHeight = function(el,e){//if e (true/false) return array with effective height and padding
		if(el && el.tagName){
			var b = el.getBoundingClientRect(),w;
			if(b){
				w = b.height || b.bottom-b.top;
				if(!w){
					//var p=this.unCloak(el);
					//b=el.getBoundingClientRect();w=b.bottom-b.top;
					//this.reCloak(p);
				}
				if(!w){
					console.log(b);
					console.log('Failed to get height for=',el); window.failedHeight = window.failedHeight||[]; window.failedHeight.push(el); return 0;
				}else if(e){
					return this.effectiveHeight(el,w);
				}else{
					return w;
				}
			}else{
				w=el.offsetWidth||el.clientWidth||el.scrollWidth;
				//if(!w){var p=this.unCloak(el);w=el.offsetWidth||el.clientWidth||el.scrollWidth;this.reCloak(p);}
				if(!w){console.log('Failed to get height for '+el.tagName+'.'+el.className); return 0;
				}else if(e){return this.effectiveHeight(el,w);
				}else{return w;}
			}
		}else{return 0;}
	};

	init.getWidth = function(el,e){//if e return array with effective width and padding
		if(el && el.tagName){
			var b=el.getBoundingClientRect(),w;
			if(b){
				w=b.right-b.left;
				if(!w){
					//var p=this.unCloak(el);
					//b=el.getBoundingClientRect();w=b.right-b.left;
					//this.reCloak(p);
				}
				if(!w){
					console.log('Failed to get width for '+el.tagName+'.'+el.className);
					return 0;
				}else if(e){
					return this.effectiveWidth(el,w);
				}else{
					return w;
				}
			}else{
				w=el.offsetWidth||el.clientWidth||el.scrollWidth;
				//if(!w){var p=this.unCloak(el);w=el.offsetWidth||el.clientWidth||el.scrollWidth;this.reCloak(p);}
				if(!w){console.log('Failed to get width for '+el.tagName+'.'+el.className); return 0;
				}else if(e){return this.effectiveWidth(el,w);
				}else{return w;}
			}
		}else{return 0;}
	};

	init.testLoaded = function(func,type){
		var t		= window.onloadFunctions.push(""),
			status	= (type=='window'?'complete':(type=='document'?'interactive,DOMContentLoaded,complete':'complete'))
		;
		if(status.indexOf(document.readyState)!==-1){//IF ALREADY LOADED
			func();
		}
		else{
			window.onloadFunctions[t]=(function(func,t,status){
				var f=function(){
					if(status.indexOf(document.readyState)!==-1){
						document.cb_removeEventListener('readystatechange',window.onloadFunctions[t]);	func();
					}
				};
				return f;
			}(func,t,status));
		}
		document.cb_addEventListener('readystatechange',window.onloadFunctions[t]);
	};
		
	init.dumpObject = function(o,a){
		for(var prop in o){
			console.log(a+'['+prop+']='+typeof o[prop]);
			if(typeof o[prop]==='object'){
				dumpObject(o[prop],prop);
			}
		}
	};
	
	init.findParent = function(c,id,byAttr){//USE BY ATTR TO FIND PARENT BY A PARTICULAR ATTRIBUTE (ex: 'tagName') - c: child, id: parent selector, byAttr: compare this attribute
		var p=c.parentNode,s=id.substr(0,1);
		if(s==="#"){
			id=id.substr(1);
			while(p.id!==id){
				p=p.parentNode;
			}
		}else if(s==="."){
			id=id.substr(1);
			while(p.className!==id){
				p=p.parentNode;
			}
		}else if(byAttr){
			while(p[byAttr]!==id){
				p=p.parentNode;
			}
		}else if(typeof id==="string"){
			while(p.byAttr!==id){
				p=p.parentNode;
			}
		}else{
			console.log(id+" is not a valid argument for find parent");
			return false;
		}
		return p;
	};

	init.toggle = (function(){		
		var fn=function(el){
			if( el.style.display === "none" ){ el.style.removeProperty('display'); }
			else{ el.style.display = "none"; }
		}
		fn.hide=function(el){
			el.style.display = "none";
		}
		fn.show=function(el){
			if(!el.style.display.length){ el.style.display = 'block'; }
			else{ el.style.removeProperty('display'); }
		}
		return fn;
	}());

	init.toggleClass = (function(){
		var fn=function(el,className){
			el.className = el.className.toggleListValue(className,' ');
		}
		fn.add=function(el,className){
			if(el.className.indexOf(className)===-1){el.className+=' '+className;}
		},
		fn.remove=function(el,className){
			el.className=el.className.replace(className,'').replace('  ',' ').trim();
		}
		return fn;
	}());

	init.toggleValue = (function(){
		var fn=function(el,text){
			if(el.value.trim() === ""){el.value=text;}
			else{el.value="";}
		}
		fn.toDefault=function(el,text){
			if(el.value.trim() === "") el.value=text;
		}
		fn.removeDefault=function(el,text){
			if(el.value.trim()===text) el.value="";
		}
		return fn;
	}());
	
	init.toggleContent = function(par,char1,char2){
		if(par.innerHTML === char1){
			par.innerHTML = char2;
		}
		else{
			par.innerHTML = char1;
		}
	};

	init.toggleCSS = (function(){//calling toggleCSS returns a function that will handle the toggle.
		var self={clubs:{}},
			init=function(el,prop,val){
				el.coreToggleCSS=el.coreToggleCSS||{};
				if(typeof el.coreToggleCSS[prop]==='undefined') el.coreToggleCSS[prop]=el.style[prop];
				return function(){
					if(el.style[prop]===el.coreToggleCSS[prop]){ el.style[prop]=val; }
					else{ el.style[prop]=el.coreToggleCSS[prop]; }
				};
			}
		;
		
		init.createGroup=function(arr,prop,val,groupName){
			if(!Array.isArray(arr)) arr=core.castToArray(arr);
			arr.forEach(function(el){
				init.addToGroup(el,prop,val,groupName);
			});
		};
		
		init.toggleGroup=function(groupName){
			if(typeof self.clubs[groupName]!=='undefined'){
				var func=self.clubs[groupName].memberFuncs,l=func.length;
				while(--l > -1){
					func[l]();
				}
			}
		};
		
		init.memberActive=function(el,groupName){//Use toggleMember() over toggleCSS() 
			var funcs=self.clubs[groupName].memberFuncs;
			self.clubs[groupName].active.forEach(function(el){
				funcs[el.coreToggleCSS[groupName].memberNum]();
			});
			self.clubs[groupName].active=[el];
			funcs[el.coreToggleCSS[groupName].memberNum]();
		};
		
			init.memberReset=function(el,groupName){//use this to 'close' an element in a group
			self.clubs[groupName].active.removeValues(el);
			self.clubs[groupName].memberFuncs[el.coreToggleCSS[groupName].memberNum]();
		};
		
			init.addToGroup=function(el,prop,val,groupName){
			if(typeof self.clubs[groupName]==='undefined'){
				self.clubs[groupName]={memberFuncs:[],active:[]};
			}
			el.coreToggleCSS=el.coreToggleCSS||{};
			el.coreToggleCSS[groupName]={};
			el.coreToggleCSS[groupName].memberNum=self.clubs[groupName].memberFuncs.push(init(el,prop,val))-1;
		};
		
			return init;
	}());

	init.activateAjaxButton =  {
		setup:function(button){
			var setup = JSON.parse(button.getAttribute('data-ajax-button'));
			button.activateAjaxButton={};
			button.activateAjaxButton.setup=setup;
			return function(){
				return jQuery.ajax({
					url: setup.url,
					data: setup.argumentString,
					type: setup.method,
					dataType: setup.returnType,
					cache: setup.cache||true
				});
			};
		}
	};

	init.concatNodeLists = function(a){//array of nodelists
		var arr=[];
		for(var x=0,l=a.length;x<l;x++){
			arr=arr.concat(Array.prototype.slice.call(a[x]));
		}
		return arr;
	};
	
	init.consoleError = function(msg,data){
		console.log("ERROR: "+arguments.callee.caller.toString()+": "+msg);
		if(data){console.log("---DATA EMPTY---");}
		else{console.log(data);}
		console.log("/ERROR END");
	}
	
	init.uniqueId = (function(){
		var factory = {current:0,members:[]};
		var init = function(member){
			factory.current = factory.members.push(member);
			return factory.current;
		};
	}());

	init.preventDefault = function(e){
		var evt = e||window.event;
		if (evt.preventDefault) evt.preventDefault();
		evt.returnValue = false;
	};

	init.fancySelect = function(par,evtName){
		//for parent container this appends to each .fancy-option element contained within an onclick event that will toggle the class 'selected', change the element '.fancy-value' innerhtml to the text value of the clicked element, and set par.selectedValue to that same value, then fire off the event name with the value attached by event.content. Returns the event name to use when change occurs.
		
			//This is setup to use onmouseover on the parent element for initial setup but can be assigned directly as well.
		par.removeAttribute('onmouseover');
		var opts=par.querySelectorAll('.fancy-option'),l=opts.length,val=par.querySelector('.fancy-value'),func,removeClass=(function(){
			return function(){
				var x=opts.length;
				while(x){
					x--;
					core.toggleClass.remove(opts[x],'selected');
				}
			};
		}());
		par.selectedValue=(function(){return function(){return val.innerHTML;};}());//call par.selectedValue() to get the current value
		var evt=core.events(evtName);
		while(--l > -1){
			func=(function(opt){
				return function(e){
					val.innerHTML=opt.innerHTML;
					removeClass();
					core.toggleClass.add(opt,'selected');
					core.events.appendTo(opt.innerHTML,evt);
					core.events.fireEvent(evt);
				};
			}(opts[l]));
			opts[l].addEventListener('click',func,false);
		}
		return evt;
	};
	
	//**FORWARDTO**
	init.forwardTo = (function(){//the core version uses cookies
		var 
			goTo,
			params="",
			init=function(){
				if((goTo = core.forwardTo.get()).substring(0,5) !== 'false'){
					window.location.href = goTo;
				}
				else{
					console.log(init.caller,'forwardTo not set');
				}
			}
		;
		
		init.set=function(str){
			//var regex=new RegExp('(http)s?://(www\.)?([^\?$]+)');
			//if(regex.test(str)){core.cookie.setValue({forwardTo:{value:str}});}
			core.cookie.setValue({forwardTo:{value:str}});
		};
		
		init.appendParams=function(o){
			for(var prop in o){
				params += "&"+prop+"="+o[prop];
			}
		};
		
		init.get=function(){return (core.cookie.getValue('forwardTo').value||false)+"?"+params.substring(1);};
		
		init.unset=function(){core.cookie.removeValue('forwardTo');};
		
		return init;
	}());
	
	//**COOKIE**
	init.cookie = (function(){
		var self={cache:{}};//cache does not 'set' the values but holds it into an object. cache works with data binding.
		//use core.cookie.commit(timeout) to set the cache values to cookie.
		
		var init={};
		
		init.refresh = function(){//repopulate cache with values from cookie. Use commit to set cache values to cookie
			var arr=document.cookie.split('; '),temp;
			for(var x=0,l=arr.length;x<l;x++){
				temp=arr[x].split('=');
				temp[1] = unescape(temp[1]);
				if(temp[1].substr(0,1)==='{' || temp[1].substr(0,1)==='[') temp[1] = JSON.parse(temp[1]);
				self.cache[temp[0].trim()]={value:temp[1],seconds:3600};
			}
			console.log('cookie cache: ',self.cache);
		};
		
		init.getNestedProperty = function(bindTo,propertyChain){
			//bindTo will be the element to bindTo and propertyChain will be an ARRAY containing (in order) the property chain 
			//that will be in self.cache terminating in the variable to be bound.
			var current = self.cache[propertyChain[0]];
			if(typeof current !== 'undefined'){ var current = current.value; }else{ return {}; }
			propertyChain.shift();
			console.log('getNestedProperty: before iteration: ',current);
			for(var i=0,l=propertyChain.length-1;i<l;i++){
				console.log('getNestedProperty',propertyChain[i],current);
				if(typeof current[propertyChain[i]] === 'undefined'){
					current[propertyChain[i]] = {};
				}
				var current = current[propertyChain[i]];
			}
			return current;
		};
		
		init.getValue=function(name){
			/*
			var value = "; " + document.cookie;
			var parts = value.split("; " + name + "=");
			if (parts.length===2) {
				value = unescape(parts.pop().split(";").shift());
				if(value.substr(0,1)==='{' || value.substr(0,1)==='[') value = JSON.parse(value);
				return value;
			}
			else if(parts.length===1){
				console.log("getValue: error: cookie 'key' was not found - "+name);
			}
			return false;
			*/
			if(typeof name !== 'undefined' && typeof name === 'string' && name.length){	
				if(typeof self.cache[name] === 'undefined') self.cache[name] = {value:{},seconds:3600};
				return self.cache[name];
			}
			else{ return self.cache; }
		};
		
		init.setValue = function(o){//o of the form {key:{value:value,seconds:seconds_till_expiration},...}
			//Use this during the use of a page
			console.log('setValue',o);
			for(var prop in o){
				if(typeof o[prop].value === 'undefined'){ console.log('set cookie value: object passed was wrong format'); continue; }
				if(typeof self.cache[prop] === 'undefined') self.cache[prop] = {value:{},seconds:3600};
				
				if(Array.isArray(o[prop].value) || typeof o[prop].value === 'string'){ self.cache[prop].value = o[prop].value; }	
				else if(typeof o[prop].value === 'object'){ core.setNestedProperties(self.cache[prop].value,o[prop].value); }
				else{ console.log('cookie setValue unnaccounted type: ',typeof o[prop].value); }
				
				if(typeof o[prop].seconds !== 'undefined' && o[prop].seconds > 0) self.cache[prop].seconds = o[prop].seconds;
			}
		}
		
		init.commitValue=function(o){//o of the form {key:{value:value,seconds:seconds_till_expiration},...}
			//setValue DOES NOT change the cache value
			console.log('commitValue:',o);
			for(var prop in o){
				if(typeof o[prop]==='undefined'){console.log(prop+' undefined');continue;}
				if(typeof o[prop].seconds!=='undefined' && o[prop].seconds > 0){
					var d=new Date();
					d=new Date(d.getTime() + (1000 * o[prop].seconds));
					d=' expires='+d.toUTCString();
				}
				else{
					d='';
				}
				if(typeof o[prop].ignoreEmpty === 'undefined'){
					o[prop].ignoreEmpty = false;
				}
				/*
				try{	
					var current = core.cookie.getValue(prop);
				}
				catch(error){ var current = false; };
				*/
				var obj = o[prop].value;
				/*
				//current is the existing values
				//obj is the passed in values
				if(current!==false){//the values stored in the cookie
					if(typeof current === "object"){
						if(Array.isArray(obj)){
							if(Array.isArray(current)){
								var l = current.length;
								while(--l > -1){
									if(o[prop].ignoreEmpty && !current[l]) continue;
									obj[l] = current[l];
								}
							}
						}
						else if(typeof obj === "object"){
							if(Array.isArray(current)){
								var l = current.length;
								while(--l > -1){
									if(o[prop].ignoreEmpty && !current[l]) continue;
									obj[String(l)] = current[l];
								}
							}
							else{	
								for(var trait in current){
									if(o[prop].ignoreEmpty && !current[trait]) continue;
									obj[trait] = current[trait];
								}
							}
						}
					}
				}
				*/
				if(typeof obj === 'object') obj = escape(JSON.stringify(obj));
				console.log('commitValue',prop+'='+obj+'; Path=/;'+d);
				document.cookie=prop+'='+obj+'; Path=/;'+d;
			}
		};
		init.removeValue=function(a){
			if(typeof a === 'string'){ a = [a]; }
			if(Array.isArray(a)){
				var l=a.length;
				while(l){
					l--;
					document.cookie=a[l]+"=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';";
					delete(self.cache[a[l]]);
				}
			}
			else if(typeof a === 'object'){
				for(var prop in a){
					if(typeof a[prop].value !== 'undefined'){	
						core.deleteNestedProperties(self.cache[prop].value,a[prop].value);
					}
					else{
						document.cookie=prop+"=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';";
						delete(self.cache[prop]);
					}
				}
			}
		};
		
		init.unset = function(objMap){
			var cookieObj;
			var removeKey = function (objMap,objDelete){//objMap is the object whos keys will be recursively deleted, objDelete is the actual cookie obj
				for(var prop in objMap){
					if(typeof objDelete[prop] !== 'undefined'){
						if(typeof objMap[prop]==='object'){
							objDelete[prop] = removeKey(objMap[prop],objDelete[prop]);
						}
						else{
							delete(objDelete[prop]);
						}
					}
				}
				return objDelete;
			};
			for(var prop in objMap){//objName equivalent to the cookie name/key
				if(cookieObj = core.cookie.getValue(prop)){
					cookieObj = removeKey(objMap,cookieObj);//perform recursion to remove nested keys
					newObj = {};
					newObj[prop]=cookieObj;
					core.cookie.setValue(newObj);
				}
				else{
					console.log('cookie key '+prop+' was not found in document.cookie');
				}
			}
		};
		
		init.JSON = {
			save:function(key,jsonString){
				init.setValue({key:JSON.stringify(jsonString)});
			},
			load:function(key){
				return JSON.parse(init.getValue(key));
			}
		};
		
		init.commit = function(){
			init.commitValue(self.cache);
		};
		
		init.finalCommit = function(e){
			e = e || window.event;
			e.preventDefault = true;
			e.cancelBubble = true;
			init.commitValue(self.cache);
		};
		
		init.dump=function(){
			console.log(self.cache);
		};
		
		init.refresh();
		
		window.addEventListener('beforeunload',init.finalCommit,false);
		
		return init;
	}());
	
	//**URL**
	init.URL = (function(){	
		var self={result:{}},init={};			
		init.getParams=function(){//get url parameters
			window.location.search.substring(1).split('&').forEach(function(item){
				var split=item.split('=');
				self.result[split[0]]=decodeURIComponent(split[1]);
			});
			return self.result;
		};
		init.forwardParams=function(){//attach current parameters to every anchor tag
			var els=document.getElementsByTagName('A'),l=els.length,regex=new RegExp("\.[0-9a-zA-Z]{2,}\?"),href;
			while(l){
				l--;
				href=els[l].href;
				if(regex.test(href)){
					els[l].href=els[l].href+window.location.search.substring(1);
				}
				else{
					els[l].href=els[l].href+window.location.search.substring(1);
				}
			}
		};
		init.previousURL=(function(){
			//console.log('previousURL:');
			var regex=/(previousURL[A-Z])\=([^;\?]+)/g,result={};
			while(match=regex.exec(document.cookie)){
				result[match[1]]=match[2];
				//console.log('result['+match[1]+']='+match[2]);
			}
			if(result.length===0){//no results found 
				console.log('no result');
				document.cookie='previousURLA='+window.location.href+'; PATH=/;';
				document.cookie='previousURLB='+window.location.href+'; PATH=/;';
				return window.location.href;
			}else{
				if(result['previousURLA']===result['previousURLB']){//cookie was set at last page. This could be considered the starting point.
					console.log('cookie values equal');
					document.cookie="previousURLB="+window.location.href+'; PATH=/;';
					return result["previousURLA"];
				}
				else if(result['previousURLA']===window.location.href || result['previousURLB']===window.location.href){//current page is the same as the past page
					console.log('current page matches last page');
					return result["previousURLB"];
				}
				else{//set urlA to the old page and urlB to the current page
					//console.log('moving old url out, setting A to current page and B to the last page.');
					document.cookie="previousURLA="+result["previousURLB"]+'; PATH=/;';
					document.cookie="previousURLB="+window.location.href+'; PATH=/;';
					return result["previousURLA"];
				}
				console.log('/previousURL');
			}
		}());
		init.previousDomain=function(){
			return core.URL.previousURL.match(/^[^\?]+/)[0];
		};
		
		/*
		init.forwardTo = (function(){
			self={};
			
			var temp = core.cookie.getValue('forwardTo');
			if(typeof temp==='undefined') temp = {value:{}};
			core.cookie.setValue({forwardTo:temp});
			self = temp;
			
			var init=function(){
				var goToParams = core.cookie.getValue('forwardTo');
				if(typeof goToParams.forwardTo === 'undefined'){ window.location.href = ''; }
				else{ window.location.href = goToParams.forwardTo; }
			};
			
			init.set = function(str){
				core.cookie.setValue({forwardTo:{value:{forwardTo:str,previous:self.forwardTo}}});
				self.previous = self.forwardTo;
				self.forwardTo = str;
			};
			
			init.unset = function(){//only unsets for current page. The values will still be preserved across pages
				self = {};
			}
			
			init.remove = function(){//unsets the cookie level forwardTo. Use rewind to use it again.
				core.cookie.setValue({forwardTo:{value:{previous:self.forwardTo}}});
			}
			
			init.rewind = function(){//rewinds to previous
				if(typeof self.previous === 'undefined') self.previous = '';
				self.forwardTo = self.previous;
				core.cookie.setValue({forwardTo:{value:self}});
			};
			
			return init;
		}());
		*/
		
		init.getParams();
		init.params=self.result;
		return init;
	}());
	
	init.events = (function(){//on initial call ( core.events(eventName) ) this will create an event by name. If the event is already created (a name conflict) then it will generate a randomized event. Returns the event name. Use core.events.fireEvent(eventName) to trigger the event.
		var self={},
			init=function(evtName){
				if(typeof self[evtName]!=='undefined'){evtName=evtName+core.makeId(5);}
				self[evtName] = document.createEvent('HTMLEvents');
				self[evtName].initEvent(evtName, true, true);
				return evtName;
			}
		;
		
		init.appendTo=function(o,evtName){
			self[evtName].content=self[evtName].content||{};
			for(var prop in o){	
				self[evtName].content[prop]=o[prop];
			}
		};
			
		init.fire=function(evtName){
			if(typeof self[evtName] === 'undefined') console.log('The event '+evtName+' sent to core.events.fire is not a registered event');
			document.dispatchEvent(self[evtName]);
		}
		
		//arguments(el to add eventTrigger, type: the event name)
		//call the event with el.eventTriggers[name]()
		//sending an existing trigger type (ie change,mouseover etc) will cause the existing trigger type to be triggerable (useful for change events for hidden inputs & similar cases)
		init.setEventTrigger = (function(){
			if (document.createEvent && document.dispatchEvent) {
				return function(el,type){
					el.eventTriggers = el.eventTriggers || {};
					if(typeof el.eventTriggers[type] !== 'undefined') return false;
					var evt = document.createEvent("HTMLEvents");
					var subtype = (type.substring(0,2) === 'on' ? type.substring(2) : type);
					evt.initEvent(subtype, true, true);
					el.eventTriggers[type] = (function(el,evt){ return function(){ el.dispatchEvent(evt); }; }(el,evt));// for DOM-compliant browsers
				};
			} else if (document.fireEvent) {
				return function(el,type){
					type = (type.substring(0,2) !== 'on' ? 'on'+type : type);
					el.eventTriggers[type] = (function(el){ return function(){ el.fireEvent(type); }; }(el)); // for IE
				};
			}
			else{
				console.log("bweh that taint gonna werk");
			}
		}());
			
		return init;
	}());

	init.imports = function(){
		var factory = {
			supported: ('import' in document.createElement('link'))
		}
		
		//to use - run core.imports.init() after the imports are declared. For each import add a custom attribute 'data-event-name'
		//each with a unique name. For each of these unique names, add an event listener to document for these events. The import
		//data will be included on the event object as event.content.
		var self={members:{},templates:{},eventName:{},complete:{},onComplete:{}},
		init=function(importName){
			if(typeof importName !== 'undefined'){
				var imports = document.querySelector('link[data-import-name="'+importName+'"]');
				if(!imports){ console.log('import not found for '+importName); }
				else{ imports = [imports]; }
			}
			else{
				var imports = document.querySelectorAll('link[rel="import"]');
				if(!imports) console.log('no imports found');
			}
			if(imports === null) {console.log('import not found for '+importName);return;}
			var l=imports.length,current,name
			while(--l > -1){
				member = imports[l];
				name = member.getAttribute('data-import-name');
				self.members[name] = member;
				self.eventName[name] = core.events(name);
				self.complete[name] = 'in progress';
				if(factory.supported){//imports supported
					if(typeof member.import !== 'undefined' && member.import !== null){
						response = member.import.body.innerHTML;
						self.complete[name] = 'complete';
						self.templates[name] = response;
						core.events.appendTo({template:response},self.eventName[name]); 
						core.events.fire(self.eventName[name]);
					}
					else{
						member.addEventListener('load',function(e){
							response = this.import.body.innerHTML;
							self.complete[name] = 'complete';
							self.templates[name] = response;
							core.events.appendTo({template:response},self.eventName[name]); 
							core.events.fire(self.eventName[name]);
						},false);
					}
				}
				else{//imports not supported
					jQuery.ajax({
						url: member.getAttribute('href'),
						data: window.location.search.substring(1),
						dataType: 'HTML',
						cache: false,
						success:(function(name){
							return function(response){
								self.complete[name] = 'complete';
								self.templates[name] = response;
								core.events.appendTo({template:response},self.eventName[name]); 
								core.events.fire(self.eventName[name]);
							};
						}(name)),
						error: function(){
							console.log(arguments);
						}
					});
				}
			}
		};
			
		//USE THIS FUNCTION TO USE AN IMPORT TEMPLATE BY SENDING THE IMPORT NAME AND THE FUNCTION IT SHOULD SEND TO
		init.useImport = function(importName,func){
			if(typeof self.complete[importName] === 'undefined'){ console.log('setting new import '+importName); core.imports(importName); }
			if(self.complete[importName] === 'complete'){ func({content:{template:self.templates[importName]}}); }
			else{ 
				document.addEventListener(self.eventName[importName],(function(func){
					var active = false;
					return function(e){
						if(active) return;
						func(e);
					};
				}(func)),false);
			}
		};
		
		init.self = function(){
			return self;
		};
		
		init();
		
		return init;
	};

	init.makeId = (function(){//returns an unused random string 
		var self=[];
		return function(n){
			var text = "",
				possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
			;
			
				do{	
				for( var i=0; i < n; i++ )	text += possible.charAt(Math.floor(Math.random() * possible.length));
			}while(self.indexOf(text)!==-1)
				
				self.push(text);
		
				return text;
		};
	}());
	
	window.previousposition = 0;
	
	init.scroll = {
		to:function(el){
			var b=el.parentNode.getBoundingClientRect();
			var yoffset=window.offSetY();
			window.scrollTo(0,(yoffset+b.top)*.98);
		},
		reset:function(){
			window.scrollTo(0,window.previousposition||0);
			window.previousposition = 0;
		},
		recordPosition:function(){
			if(window.previousposition = 0)	window.previousposition=document.documentElement.scrollTop||document.body.scrollTop;
		}
	};
	
	init.onScrollBottom = function(container,eventName){//returns eventName.
	
		if(typeof container === 'undefined') container = window;
	
		if(typeof eventName === 'undefined') eventName = 'onScrollBottom';
		eventName = core.events(eventName);
		
		var onScroll = (function(container,eventName){
			var scrollDirection = 0;
			var constant = 0;
			return function(e){
				//var height = core.getHeight(container);
				var scrollHeight = container.scrollHeight;
				var scrollTop = container.scrollTop;
				var offsetHeight = container.offsetHeight;
				var clientHeight = container.clientHeight;
				/*
				console.log('height: '+height);
				console.log('scrollTop: '+container.scrollTop);
				console.log('scrollHeight: '+container.scrollHeight);
				console.log('scrollPoint: '+container.scrollPoint);
				console.log('offsetHeight',container.offsetHeight);
				console.log('innerHeight',container.innerHeight);
				*/
				if(scrollTop >= scrollHeight - clientHeight && scrollDirection - scrollTop < 0){
					//console.log('onScroll: container: '+container.id+' - scrollHeight & offsetHeight: '+scrollHeight+'&'+offsetHeight+' - height: '+height+' - scrollTop: '+scrollTop+' - scrollDirection: '+scrollDirection);
					//console.log('onScroll: container: '+container.id+' - offsetHeight + scrollTop: '+(offsetHeight+scrollTop)+' - scrollHeight: '+scrollHeight);
					core.events.fire(eventName);
				}
				scrollDirection = scrollTop;
			};
		}(container,eventName));
		
		container.addEventListener('scroll',onScroll,false);
		
		return eventName;
	};
	
	init.shade = (function(){
	
		factory = {shades:[],instances:[],openShades: []};
		
		init.onResize(function(){
			factory.shades.forEach(function(shade){
				shade.style.height = window.height+'px';
				if(factory.openShades.indexOf(shade) === -1) shade.style.bottom = window.height+'px';
			});
		});
	
		return function(name,type){//utilize shade by setting the action of the close button core.shade.onClose(func) then open with core.shade.open(). Type is optional [vertical|horizontal] default: vertical
			type = type || "vertical";
			
			var self={
				open:false,
				onClose:function(){console.log('onClose not set');},
				onOpen:function(){console.log('onOpen not set');},
				hasBeenOpened: false,
				fill: {}//functions expand/shrink that cause he absolute positioning properties to fill the window (scroll open the shade)
			};
			
			//Build shade and closebutton
			var shade = document.createElement('div');
			factory.shades.push(shade);
			shade.id = 'shade-'+name;
			shade.className = 'shade force-open '+type;
			var 
				content = document.createElement('div'),
				closeButton = document.createElement('div')
			;
			content.className = 'content';
			closeButton.className = 'close-button';
			closeButton.innerHTML = '[X]';
			shade.appendChild(content);
			shade.appendChild(closeButton);
			
			content.className += ' core-hide-scroll';
			
			shade.style.visibility = 'hidden';
			shade.style.zIndex = 9998;
			if(type === 'vertical'){	
				shade.style.bottom = window.height+'px';
				shade.style.height = window.height+'px';
				self.fill.expand = function(){
					shade.style.bottom = 0;
				};
				self.fill.shrink = function(){
					shade.style.bottom = window.height+'px';
				};
			}
			else if(type === 'horizontal'){
				shade.style.right = window.width+'px';
				shade.style.width = window.width+'px';
				shade.style.height= window.height+'px';
				self.fill.expand = function(){
					shade.style.right = 0;
				};
				self.fill.shrink = function(){
					console.log(window.width+'px');
					shade.style.right = window.width+'px';
				};
			}
			
			document.body.appendChild(shade);
			
			//the methods
				//close and open are static
				//onClose/onOpen set extra functions activated by close/open
			var init = {
				shade: shade,
				content: content,
				closeButton: closeButton,
				onClose: function(func){ self.onClose=func;},
				close: function(){
					factory.openShades.removeValues(shade);
					if(factory.openShades.length > 0) factory.openShades[factory.openShades.length - 1].style.zIndex = 9998;
					self.open=false;
					self.fill.shrink();
				},
				open: function(){
					if(!self.hasBeenOpened) init.shade.className = init.shade.className.replace(' force-open',' animated');
					factory.openShades.forEach(function(el){el.style.zIndex = 9998;});
					factory.openShades.push(shade);
					shade.style.visibility = 'visible';
					shade.style.zIndex = 9999;
					self.fill.expand();
					self.open = true;
				},
			};
			
			factory.instances.push(init);
			
			shade.addEventListener('transitionend',function(){
				if(self.open){//transition will be the opposite bc open state will have been changed before transition event is fired`
				}
				else{
					shade.style.visibility = 'hidden';
					self.onClose();
				}
			},false);
			
			closeButton.addEventListener('click',function(){
				if(self.open){
					init.close();
				}
			},false);
			
			return init;
		};
	}());
	
	init.popMenu = (function(){
		var factory={
			menus: {}
		};
	
		var init = function(name,type){//container of menu, name is the index in factory referencing this instance, type[vertical|horizontal] dictates how the menu will open
			
			var shade = new core.shade(name,type);
			
			//add a custom container to shade
			var container = document.createElement('DIV');
			container.id = name;
			container.className = "pop-menu";
			shade.content.appendChild(container);//move container to shade
			
			var self={
					state: false,//false = not opened, true = is opened
					container: container,//container added to the shade instance
					shade: shade,//shade instance
					closeButton: shade.closeButton,
					beforeOpen: [function(){}],//array of functions to run before open
					onOpen: [function(){}],//array of functions to run after open
					beforeClose: [function(){}],//array of functions to run before closing
					onClose: [function(){console.log('close');}],//array of functions to run after closing
					onMenu: [],//array of functions to run after template is done loading. These run everytime the template is loaded.
					onResponse: [],//array of functions to run on dynamic template ajax response
					onScrollBottom: function(){},//function to run when shade container is scrolled to the bottom.
					pagination: {use:false,start:0,current:0},
					limit: {use:false,to:25},
					menus: [],//array of the spans created for dynamic data
					activationCount: 0,//used to count the number of activations, 0 of course being the first
					activateOnReady: 0//used to trigger activate again after asynchronous events
				},
				init={
					shade: shade,
					container: self.container,
					closeButton: self.closeButton,
					beforeOpen: function(func){
						if(typeof func !== 'function'){ 
							console.log('argument (beforeOpen) must be a function'); return this;
						}
						self.beforeOpen.push(func);
						return this;
					},
					onOpen: function(func){
						if(typeof func !== 'function'){ 
							console.log('argument (onOpen) must be a function'); return this;
						}
						self.onOpen.push(func);
						return this;
					},
					beforeClose: function(func){
						if(typeof func !== 'function'){ 
							console.log('argument (beforeClose) must be a function'); return this;
						}
						self.beforeClose.push(func);
						return this;
					},
					onClose: function(func){
						if(typeof func !== 'function'){ 
							console.log('argument (onClose) must be a function'); return this;
						}
						self.onClose.push(func);
						return this;
					}
				}
			;
			
			self.enable = function(){//enable activation. If activated prior to download thsi will also run it
				self.template.suspended = false;
				self.template.loaded = true;
				if(self.activateOnReady === true){ init.open(); self.activateOnReady = false; }
			};
			
			init.deActivateProcess = (function(){//thsi is set to shade onClose. Use deActivate to trigger closing this popmenu bc this functions doesnt handle closing the shade.
				return function(){
					self.beforeClose.forEach(function(func){ func(self); });
					core.scroll.reset();
					self.container.style.display = 'none';
					self.pagination.current = 0;
					document.removeEventListener(self.onScrollBottomEventName,self.onScrollBottom,false);
					self.onClose.forEach(function(func){ func(self); });
					self.activationCount = 0;
					self.state = false;
					self.template.suspended = false;
				};
			}());
			
			init.deActivate = function(){ self.shade.closeButton.click(); }
			
			init.forceOpen = function(){//this will remove the animated class and add on the force-open class with will open the shade up and push it under everything else. This is good when offsets or heights are needed.
				self.shade.shade.className = self.shade.shade.className.replace(' animated',' force-open');
			};
			
			init.forceClose = function(){//use to undo forceOpen change
				self.shade.shade.className = self.shade.shade.className.replace(' force-open',' animated');
			};
			
			init.open 	= function(reopen){//use activate or refreshCurrent to turn on pop menu, this is more the animation 
				var l = self.beforeOpen.length;
				while(--l > -1){
					if(self.beforeOpen[l](self) === false){
						return;
					}
				}
				self.shade.open();
				self.shade.onClose(init.deActivateProcess);
				core.scroll.recordPosition();
				core.scroll.to(self.container);
				self.container.style.display = 'block';
				self.onOpen.forEach(function(func){ func(self); });
				self.state=true;
				self.template.suspended = false;
			};
			
			//================== on scroll bottom =======================
			self.onScrollBottomEventName = core.onScrollBottom(shade.content,'onScrollBottom');
			
			init.onScrollBottom = function(func){
				if(typeof func === 'function') { self.onScrollBottom = (function(self){ return function(){func(self);}; }(self)); }
				else if(func === 'refresh') { self.onScrollBottom = (function(){
					return function(){
						if(self.template.suspended === true) return;
						init.dynamicTemplate();
					}; 
				}()); }
				return this;
			};
			
			self.setupScrollBottom = function(){				
				document.removeEventListener(self.onScrollBottomEventName,self.onScrollBottom,false);
				document.addEventListener(self.onScrollBottomEventName,self.onScrollBottom,false);
			};
			//================= end scroll bottom =======================
			
			init.refreshCurrent = function(){//call this method to refresh without running deactivate
				self.container.style.display = 'none';
				self.pagination.current = 0;
				document.removeEventListener(self.onScrollBottomEventName,self.onScrollBottom,false);
				self.activationCount = 0;
				self.state = false;
				self.template.suspended = false;
				this.activate();
			};
			
			init.activate = function(){
				if(self.state === true) { console.log('menu already open'); return; }
				self.state = true;
				
				self.activateOnReady = true;
				
				if(typeof self.title !== 'undefined') self.titleBar.innerHTML = self.title;
				
				self.setupScrollBottom();
				
				if(self.template.enabled === true){
					if(self.template.suspended === false){
						if(self.template.loaded.status === false){
							console.log('template not loaded');
							init.loadTemplate();
						}
						else if(self.template.refresh === true){
							console.log('refresh template');
							init.dynamicTemplate();
						}
						else{
							init.open();
						}
					}
				}
				else{
					self.enable();
				}
			};
			
			//------------------------------------------------------------------------------
			//template storage
			self.template 			= {};
			self.template.enabled 	= false;
			self.template.refresh	= 3;
			self.template.suspended	= false;
			self.template.refresh	= false;
			self.template.loaded	= {status:false}; 
			self.template.showEmpty	= false;//show the empty results div. Use .showEmpty(bool) method to set
			
			self.emptyResult = document.createElement("DIV");
			self.emptyResult.className = 'popmenu-empty-result';
			self.emptyResult.innerHTML = "No Results Found";
			
			init.limitResult = function(lim){//lim is required
				self.limit.use = true;
				self.limit.to = Number(lim);
				return this;
			};
			
			init.usePagination = function(start){//start is optional and will be the start page if called
				self.pagination.use = true;
				if(typeof start !== 'undefined') self.pagination.start = self.pagination.current = start;
				return this;
			};
			
			self.getParams = function(){
				if(self.pagination.use) self.template.dynamic.params.data['page'] = self.pagination.current;
				if(self.limit.use) self.template.dynamic.params.data['limit'] = self.limit.to;
				if(typeof self.form !== 'undefined'){
					var l = self.form.elements.length;
					while(--l > -1){
						input = self.form.elements[l];
						self.template.dynamic.params.data[input.name] = input.value;
					}
					if(typeof self.template.dynamic.params.url === 'undefined'){ self.template.dynamic.params.url = self.form.action; }
				}
				if(typeof self.dataSet !== 'undefined'){
					for(var prop in self.dataSet){
						if(prop !== 'url') self.template.dynamic.params.data[prop] = self.dataSet[prop];
					}
					if(typeof self.dataSet !== 'undefined'){ self.template.dynamic.params.url = self.dataSet.url; }
				}
				console.log(self.template.dynamic);
				return self.template.dynamic.params.data;
			};
			
			init.dynamicTemplate = function(){//for getting json data to replace data in the template
				self.template.suspended = true;
				if(self.pagination.current === 0) self.container.innerHTML = "";
				var requestParams = self.getParams();
				jQuery.ajax({
					url: self.template.dynamic.params.url,
					data: requestParams,
					dataType: "JSON",
					type: "POST",
					cache: false,
					success: function(response){
						self.onResponse.forEach(function(func){
							func.call(response,self);
						});
						
						//if request failure
						if(response.status !== 'success'){
							if(self.template.showEmpty === true) self.container.appendChild(self.emptyResult);
							return;
						}
						
						var html="",iter="";
						var l = self.menus.push(document.createElement('SPAN')) - 1;
						
						self.template.response = response;
						response.result.forEach(function(obj){
							iter=self.template.result;
							for(var prop in obj){
								iter=iter.replaceAllNoCase("\\$"+prop,obj[prop]);
							}
							iter = iter.replaceAllNoCase("\\$[^\s]+","");
							html+=iter;
						});
						
						self.menus[l].innerHTML = html;
						self.container.appendChild(self.menus[l]);
						
						self.onMenu.forEach(function(func){
							func.call(self.menus[l],self);
						});
						
						self.pagination.current++;
						self.enable();
					},
					error:function(requestObj,textStatus,errorThrown){
						console.log(arguments);
						self.enable();
					}
				});
			};
			
			self.parseTemplate = function(){//loads template into html, dynamicTemplate will skip this function
				self.container.innerHTML = self.template.result;
				self.onMenu.forEach(function(func){
					func.call(self.container,self);
				});
				self.enable();
			};
			
			self.getTemplate = function(){//gets the static template
				core.imports.useImport(self.template.name,function(event){
					self.template.result = event.content.template;
					self.template.loaded.status = true;
					if(typeof self.template.dynamic !== 'undefined'){ core.events.fire(self.template.dynamic.event); }//calls dynamicTemplate
					else{ self.parseTemplate(); }
				});
			};
			
			init.loadTemplate = function(){//called by first activation or call manually to preLoad. This template should not change
				self.template.suspended = true;
				core.events.fire(self.template.loaded.event);//activates getTemplate
				return this;
			};
			
			init.useTemplate = function(name,params){//setup to use a template by 'name'. Params is optional but will be sent to a dynamic template request along with any info from a bound form.
				self.template.name = name;
				self.template.enabled = true;
				self.template.loaded.event = core.events('loadTemplateEvent');
				document.addEventListener(self.template.loaded.event,self.getTemplate,false);
				if(typeof params !== 'undefined'){
					if(typeof self.template.dynamic === 'undefined'){//other methods may have set this up
						self.template.dynamic = {};
						self.template.dynamic.event = core.events('PopMenuDynamicTemplate');
						document.addEventListener(self.template.dynamic.event,init.dynamicTemplate,false);	
					}
					self.template.dynamic.params = params;
					self.template.dynamic.params.data = self.template.dynamic.params.data||{};
				}
				return this;
			};
			
			init.enableRefresh = function(bool){
				if(!!bool){ self.template.refresh = true; }
				else{ self.template.refresh = false; }
				return this;
			};
			
			init.showEmpty = function(bool){
				if(!!bool){ self.template.showEmpty = true; }
				else{ self.template.showEmpty = false; }
				return this;
			}
			//---------------------------------------------------------------
			
			init.onMenu = function(func){
				if(self.template.suspended === false || self.template.loaded === false){ self.onMenu.push(func); }
				else{ func.call(self.menus[l],self); }
				return this;
			};
			
			init.onResponse = function(func){
				if(self.template.suspended === false || self.template.loaded === false){ self.onResponse.push(func); }
				else{ func.call(self.template.response,self); }
				return this;
			};
			
			init.attachTo = function(el){
				var func = (function(init){ return function(e){ e.preventDefault(); init.activate.call(init); }; }(this));
				el.addEventListener('click',func,false);
				return this;
			};
			
			init.bindForm = function(frm){
				if(frm.tagName !== 'FORM'){ console.log('argument one of bindForm must be a form element'); return; }
				if(typeof self.template.dynamic === 'undefined'){//other methods may have set this up
					self.template.dynamic = {};
					self.template.dynamic.params = {data:{}};
					self.template.dynamic.event = core.events('PopMenuDynamicTemplate');
					document.addEventListener(self.template.dynamic.event,init.dynamicTemplate,false);
				}	
				self.form = frm;
				return this;
			};
			
			init.bindData = function(data){//use thsi for a dynamic dataset
				if(typeof data !== 'object'){ console.log('argument one of bindData must be an object of params: value pairs'); return; }
				if(typeof self.template.dynamic === 'undefined'){//other methods may have set this up
					self.template.dynamic = {};
					self.template.dynamic.params = {data:data};
					self.template.dynamic.event = core.events('PopMenuDynamicTemplate');
					document.addEventListener(self.template.dynamic.event,init.dynamicTemplate,false);
				}
				self.dataSet = data;
				return this;
			};
			
			init.setTitle = function(str){
				self.title = str;
				self.titleBar = document.createElement('DIV');
				self.titleBar.className = 'title';
				core.prependChild(self.shade.content,self.titleBar);
				
				this.setTitle = function(str){ self.title = str; return this; }
				
				return this;
			};
	
			return init;
		};
		
		return init;
	}());
	
	init.confirmation = function(){
		//USE: core.confirmation().method()...
		
		var factory = {onAccept:function(){},onDeny:function(){}};
		
		factory.popMenu = new core.popMenu('confirmation-box')
			.useTemplate('confirmation-box')
			.onMenu(function(popMenu){
				console.log('core confirmation');
				console.log(factory);
				factory.title = document.getElementById('core-confirmation-title');
				factory.msg = document.getElementById('core-confirmation-msg');
				factory.ok = document.getElementById('core-confirmation-ok');
				factory.cancel = document.getElementById('core-confirmation-cancel');
				console.log(popMenu);
				factory.cancel.addEventListener('click',function(){popMenu.shade.closeButton.click();},false);				
			})
			.loadTemplate()
		;
		
		var __init = function(){
			
			var self = {};
			
			console.log(factory);
			factory.ok.removeEventListener('click',factory.onAccept,false);
			factory.cancel.removeEventListener('click',factory.onDeny,false);
			
			__constructor = {};
			
			__constructor.setTitle = function(str){
				factory.title.innerHTML = String(str);
				return this;
			};
			
			__constructor.setMessage = function(str){
				factory.msg.innerHTML = String(str);
				return this;
			};
			
			__constructor.onAccept = function(func){
				self.onAccept = factory.onAccept = func;
				factory.ok.addEventListener('click',self.onAccept,false);
				return this;
			};
			
			__constructor.onDeny = function(func){
				self.onDeny = factory.onDeny = func;
				factory.cancel.addEventListener('click',self.onDeny,false);
				return this;
			};

			__constructor.activate = function(){
				factory.popMenu.activate();
				return this;
			};
			
			__constructor.deActivate = function(){
				factory.popMenu.shade.closeButton.click();
				return this;
			};
			
			return __constructor;
		};
		
		return __init;
	};
	
	init.isEventSupported = (function(){
		var TAGNAMES = {
			'select':'input','change':'input',
			'submit':'form','reset':'form',
			'error':'img','load':'img','abort':'img'
		}
		function isEventSupported(eventName) {
			var el = document.createElement(TAGNAMES[eventName] || 'div');
			eventName = 'on' + eventName;
			var isSupported = (eventName in el);
			if (!isSupported) {
			el.setAttribute(eventName, 'return;');
			isSupported = typeof el[eventName] == 'function';
			}
			el = null;
			return isSupported;
		}
		return isEventSupported;
	})();
	
	/*
	init.onScrollBottom = function(){//Adds the onScrollBottom event to document
		var init = {eventName: init.events('onScrollBottom')},
			fn=function(obj,eventName){
				if(typeof eventName==='undefined') eventName = 'onScrollBottom';
				eventName = init.events(eventName);
				var docHeight = document.body.offsetHeight | 0
					,winHeight = window.innerHeight | 0
					,scrollPoint = window.scrollY | 0
				;
				docHeight = typeof docHeight === 'undefined' ? window.document.documentElement.scrollHeight | 0 : docHeight;
				winHeight = typeof winHeight === 'undefined' ? document.documentElement.clientHeight | 0 : winHeight;
				scrollPoint = typeof scrollPoint === 'undefined' ? window.document.documentElement.scrollTop | 0 : scrollPoint;
				
				if((scrollPoint + winHeight + 1)>=docHeight){
					console.log("winHeight: "+winHeight+" scrollPoint: "+scrollPoint+" docHeight: "+docHeight+" "+scrollPoint+"+"+winHeight+">="+docHeight+" --- "+(scrollPoint+winHeight)+">="+docHeight+" evaluates to "+((scrollPoint + winHeight)>=docHeight));
					core.events.fire(eventName);
				}else{
					console.log("height something aint workin: winHeight: "+winHeight+" scrollPoint: "+scrollPoint+" docHeight: "+docHeight+" "+scrollPoint+"+"+winHeight+">="+docHeight+" --- "+(scrollPoint+winHeight)+">="+docHeight+" evaluates to "+((scrollPoint + winHeight)>=docHeight));
				}
			}
		;
		window.addEventListener('scroll',fn,false);
		init.cancel=function(){window.removeEventListener("scroll",fn,false);}
		return init;
	};
	*/
		
	init.createWorker = function(str){
		// URL.createObjectURL
		window.URL = window.URL || window.webkitURL;
		
		// "Server response", used in all examples
		var response = str,blob;
		//var response = "self.onmessage=function(e){setInterval(function(){postMessage('Worker: '+e.data);self.close();},1000);};";
		try {
			blob = new Blob([response], {type: 'application/javascript'});
		}
		catch(e){ // Backwards-compatibility
			window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
			blob = new BlobBuilder();
			blob.append(response);
			blob = blob.getBlob();
		}
		return new Worker(URL.createObjectURL(blob));
	};
	
	init.scrollBarWidth = (function() {
		var __self = {calculatedValue:-1,onReady:[],isReady:false};
		__self.runOnReady = function(){
			if(__self.calculatedValue !== -1){
				__self.onReady.forEach(function(func){	
					func(__self.calculatedValue);
				});
				__self.onReady = [];
			}
		};
		var __init = {	
			calc: function(){
				if(document.body){
					var outer = document.createElement("div");
					outer.style.visibility = "hidden";
					outer.style.width = "100px";
					outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps
					
					document.body.appendChild(outer);
				
					var widthNoScroll = outer.offsetWidth;
					// force scrollbars
					outer.style.overflow = "scroll";
				
					// add innerdiv
					var inner = document.createElement("div");
					inner.style.width = "100%";
					outer.appendChild(inner);        
				
					var widthWithScroll = inner.offsetWidth;
				
					// remove divs
					outer.parentNode.removeChild(outer);
				
					__self.calculatedValue = (widthNoScroll - widthWithScroll);
					__self.isReady = true;
					__self.runOnReady();
				}
				else{ console.log('core.scrollBarWidth document.body is not ready'); }
			},
			get: function(){ 
				if(__self.calculatedValue === -1){ 
					__init.calc(); 
					if(__self.calculatedValue === -1) console.log('getScrollBarWidth is not functioning. Make sure page has loaded before calling');
				}
				return __self.calculatedValue;
			} ,
			onReady: function(func){
				if(typeof func === 'function') {
					if(__self.isReady === true){ func(__self.calculatedValue); }
					else{ __self.onReady.push(func); }
				}
			}
		}
		init.testLoaded(function(){ core.scrollBarWidth.calc(); });
		return __init;
	}());
	
	//FROM MODERNIZER
	init.transitionEndEventName = (function() {
		var i,
			undefined,
			el = document.createElement('div'),
			transitions = {
				'transition':'transitionend',
				'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
				'MozTransition':'transitionend',
				'WebkitTransition':'webkitTransitionEnd'
			};
	
		for (i in transitions) {
			if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
				return transitions[i];
			}
		}
	
		//TODO: throw 'TransitionEnd event is not supported in this browser'; 
	}());
	
	init.data = (function(){
		var __public = {variables:{}};
		var __private = {
			createDOMElementObserver:(function(){
				var __self = {
					members: [],
					evts: []
				};
				__self.observer = function(val,el,prop,eventType){
					var linkVar = val;
					var memId = __self.members.indexOf(el) || __self.members.push(el);
					__self.evts[memId] = __self.evts[memId] || [];
					__self.evts[memId].push(eventType);
					var l = __self.evts[memId].length;
					Object.defineProperty(el,prop,{
						get: function(){return linkVar;},
						set: function(newValue){
							//console.log('the old value is: '+linkVar+' and the new value is '+newValue);
							var i = l;
							linkVar = newValue;
							while(--i > -1) this.eventTriggers[__self.evts[memId][i]]();//activates events for the setter
						},
						configurable:true,
						enumerable:true
					});
				};

				return function(el,prop,eventType){	
					core.events.setEventTrigger(el,eventType);
			
					__self.observer(el[prop],el,prop,eventType);
				};
			}())	
		};
		
		__public.bindElementToEvent = function(el,prop,eventType){
			//whenever the property is changed, the event (attached to the element) is triggered
			if(typeof el.eventTriggers[eventType] === 'undefined') core.events.setEventTrigger(el,eventType);
			__private.createDOMElementObserver(el,prop,eventType);
		};
		
		__public.createBoundVariables = function(arrNames,arrValues){
			//variable bindings CANNOT be created from static single dimensional variables because the parent is unknown.
			//Use this function to create variables by name by sending in a var name or array of var names and their initial
			// values
			//Returns an array with references to the created variables. Some might be false if the variable already existed.
			var returnSingle = false;
			if(typeof arrNames === 'string'){ arrNames = [arrNames]; returnSingle = true; }
			if(typeof arrValues === 'string'){ arrValues = [arrValues]; }
			var l = arrNames.length;
			while(--l > -1){
				if(typeof __public.variables[arrNames[l]] === 'undefined'){ 
					__public.variables[arrNames[1]] = arrValues[l];
					arrNames[l] = __public.variables[arrNames[1]];
				}
				else{ arrNames[l] = false; }
			}
			return (returnSingle === true ? arrNames[0] : arrNames);
		};
		
		__public.bindElementToInput = (function(){
			var previous = [];
			return function(el,input,filter){
				filter = filter || function(content){return content;};
				var func;
				if(previous.indexOf(input) === -1) {//avoid changing observer and ruining another one
					__private.createDOMElementObserver(input,'value','change');
					previous.push(input);
				}
				if((el.tagName == 'input' && el.type == 'text') || el.tagName == 'textarea'){
					func = function(){el.value = filter(this.value);};
				}
				else{
					func = function(){ core.getFirstTextNode(el).nodeValue = filter(this.value); /*console.log('filter result: '+filter(this.value));*/ };
				}
				input.addEventListener('change',func,false);
			};
		}());
		
		__public.bindElementToElement = (function(){
			var previous = [];
			return function(targEl,sourceEl,attribute,filter){
				filter = filter || function(content){return content;};
				var func;
				if(previous.indexOf(sourceEl) === -1) {
					__private.createDOMElementObserver(sourceEl,attribute,'change');
					previous.push(sourceEl);
				}
				if((targEl.tagName == 'input' && targEl.type == 'text') || targEl.tagName == 'textarea'){
					func = function(){targEl[attribute] = filter(this[attribute]);};
				}
				else{
					func = function(){ core.getFirstTextNode(targEl).nodeValue = filter(this[attribute]); };
				}
				sourceEl.addEventListener('change',func,false);
			};
		}());
		
		__public.setupBinding = function(el){
			console.log('*** SETUPBINDING ***');
			var propertyChain = el.getAttribute('core-data-bind').split(':');
			var type = propertyChain[0];
			propertyChain.shift();
			var attr = propertyChain.last();
			//console.log('binding type: ',type);
			//console.log('property chain: ',propertyChain);
			//console.log('attr: ',attr)
			var fallBack = el.getAttribute('core-data-bind-default') || "";
			var getSetter = function(el,attr,fallBack){
				return function(newValue) {
					if(typeof newValue === 'undefined' || newValue === 'undefined') newValue = fallBack;
					__private.setValue(el,newValue);
					value = newValue;
				};
			};
			switch(type){
				case 'cookie':
					var n = 1;
					var result = core.cookie.getNestedProperty(el,propertyChain);
					var value = String(result[attr]);
					console.log('result = ',result,' --string value of result[attr] = ',value);
					result = Object.defineProperty(result, attr, {
						get: function() { return value; },
						set: getSetter(el,attr,fallBack),
						enumerable: true,
						configurable: true
					});
					result[attr] = value;
					break;
				case 'element'://core-data-bind="element:[element id]:[property name]"
					var targ;
					if(targ = document.getElementById(propertyChain[0]) && propertyChain.length == 2){
						var value = targ[attr];
						var result = Object.defineProperty(targ, attr, {
							get: function(){ return value; },
							set: getSetter(el,attr,fallBack),
							enumerable: true,
							configurable: true
						});
						result[attr] = value;
					}
					break;
				default:
					el.binding = el.binding||{};
					Object.defineProperty(el.binding, type, {
						get: function() { return this.value; },
						set: function(newValue) {
							// a certain property is being changed
							alert('is changed');
							this.value = newValue;
						}
					});
					break;
			}
			console.log('*** END SETUPBINDING ***');
		};
		
		__private.setValue = function(el,val){
			if((el.tagName == 'input' && el.type == 'text') || el.tagName == 'textarea'){
				el.value = val;
			}
			else{
				core.getFirstTextNode(el).nodeValue = val;
			}
		};
		
		return __public;
	}());
	
	init.date = (function(){
		__public = {};
		__private.today = new Date();
		
		__private.format = function(a,f){
			//format in string form with $[d] as day, $[m|M] as month (M is word), $[y|Y] as year (Y is 4 digit)
			var d = a.getDate();
			var D = ("0" + d).slice(-2);
			  
			var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			var m = a.getMonth();
			var M = months[m];
			m = ("0" + (Number(m)+1)).slice(-2);
			
			var Y = a.getFullYear();
			var y = String(Y).slice(-2);
			
			var hour = a.getHours();
			var min = a.getMinutes();
			var sec = a.getSeconds();
			
			time = f.replace('$[d]', d);
			time = time.replace('$[D]', D);
			time = time.replace('$[m]', m);
			time = time.replace('$[M]', m);
			time = time.replace('$[Y]', Y);
			time = time.replace('$[y]', y);
			return time;
		};
		
		__public.formatUnix = function(UNIX_timestamp,format){
			//format in string form with $[d] as day, $[m|M] as month (M is word), $[y|Y] as year (Y is 4 digit)
			var a = new Date(UNIX_timestamp * 1000);
			return __private.format(a,format); 
		};
		
		__public.formatDate = function(date,format){
			if(Object.prototype.toString.call(date) !== '[object Date]'){
				if(date === 'today'){ date = __private.today; }
				else{ date = new Date(date); }
			}
			return __private.format(date,format);
		};
		
		return __public;
	}());
	
	init.DOMObject = (function(){
		var __public = function(){};
		
		__public.getRelativeWidth = function(el){
			var w = core.getWidth(el);
			if(w > 0){
				var p = el.parentNode,count=0;
				while(!((wP = core.getWidth(p)) > 0) && count < 5){ p = p.parentNode; count++; }
				return Number((w/wP)*100) + '%';
			}
			else{
				return w;
			}
		};
		
		return __public;
	}());
	
	return init;
	
}());

//INITIALIZE ENTANGLED FUNCTIONS (METHODS REQUIRING USE OF CORE)
core.imports = core.imports();

core.testLoaded(function(){
	
	var d=document,b=document.getElementsByTagName('BODY')[0],c=b.childNodes,l=b.length;
	while(l){
		l--;
		if(typeof c[l].style!=='undefined'){alert(c[l].tagName+' width= '+c[l].style.width);}
	}
	
	core.sharedShade = new core.shade('shared');
	
	core.confirmation = core.confirmation();
	
	var developerMachineViewPortWidth = 1280;
	//set font-size for other machines:
	var multiplyBy = core.getWidth(document.body) / 1280;
	var fontDiv = document.createElement('DIV');
	document.body.appendChild(fontDiv);
	fontDiv.style.width = '1rem';
	var html = document.getElementsByTagName('HTML')[0];
	html.style.fontSize = Number(multiplyBy * 100) + '%';
	
	//hide scrollbars
	//document.getElementById('content').className += ' core-hide-scroll';
	
	document.createElement('STYLE');
	
	core.css = (function(){
		var __private	= {};
		var __public	= {};
		
		__private.createStyleSheet = function(){
			__private.styleSheet = document.createElement('STYLE');
			__private.styleSheet.type = 'text/css';
			core.testLoaded(function(){	
				var head = document.head || document.getElementsByTagName('head')[0]
				head.appendChild(__private.styleSheet);
			});
		};
		
		__public.addRule = function(rule){
			if(typeof __private.styleSheet === 'undefined') __private.createStyleSheet();
			if (__private.styleSheet.styleSheet){
				__public.addRule = function(rule){	
					__private.styleSheet.styleSheet.cssText += rule;
				};
			} else {
				__public.addRule = function(rule){
					__private.styleSheet.appendChild(document.createTextNode(rule));
				};
			}
			__public.addRule(rule);
		};
		
		return __public;
	}());
	
	core.scrollBarWidth.onReady(function(get){
		core.css.addRule('.vertical .core-hide-scroll { width: calc(100% + '+get+'px) !important; overflow-y:scroll; }');
		core.css.addRule('.horizontal .core-hide-scroll { overflow-x:scroll; height:calc(100% + '+get+'px); }');
		core.css.addRule('.shade.horizontal .content{ width:calc(85% + '+get+'px); }');
	});
	
	//alert(core.isEventSupported('scroll'));
});
	
