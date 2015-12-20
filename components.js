if(!core) console.log('compenents must be loaded after core');

core.components = (function(){
	
	__init = {};
	
	__init.popTimer = (function(){
		__private = {isActive: true};
		
		//add import link tag, 
		//create pop menu
		//adds the input for hours and minutes
		//add the click event to open it/swap target inputs
		__private.init = function(){
			/*
			var link = document.createElement('LINK');
			link.setAttribute('data-import-name','pop-timer');
			link.href = '/spotter/js/core/templates/select-time.html';
			link.rel = 'import';
			document.getElementsByTagName('head')[0].appendChild(link);
			core.imports('pop-timer');
			*/
			
			__private.popMenu = new core.popMenu('pop-timer')
				.useTemplate('pop-timer')
				.onMenu(__private.setup)
				.setTitle('')
				.onClose(function(){core.events.fire(core.components.popTimer.event);})
				.loadTemplate()
			;
			
			var cont;
			var input;
			var button;
			var popTimers = document.querySelectorAll('[data-pop-timer]')
				,l = popTimers.length
				,timeZoneOffset
				,frm
				,els
				,lenEls
				,func
			;
			
			while(--l > -1){
				//get hidden inputs for this timer within to parent
				button = popTimers[l];
				button.popTimer = {};
				
				input 		= button.getElementsByTagName('INPUT')[0];
				var surname = button.getAttribute('data-pop-timer');
				
				var tempArr = ['hour','minutes','meridiem'];
				tempArr.forEach(function(val){
					button.popTimer[val] = button.querySelector('input[name="'+surname+'_'+val+'"]');
					if(lenEls = (els = document.querySelectorAll('['+surname+'_'+val+']')).length){
						while(--lenEls > -1){
							if(val === 'hour'){ func = function(content){ return ("0" + (content > 12 ? content - 12 : content)).slice(-2) + ': '; }; }
							else if(val === 'minutes'){ func = function(content){ return ("0" + content).slice(-2); }; }
							core.data.bindElementToInput(els[lenEls],button.popTimer[val],func);
						}
					}
				});
				
				//TO FORMAT THE INPUTS USE ONE OF THESE KEYWORDS IN THE HOURS INPUT:
					//NOW - sets the inputs to the current timeout.
					//+X  - sets the inputs to the current time + X hours.
					//-X  - sets the inputs to the current time - X hours.
				
				var useFormatted 	= false;
				var dateTime 		= new Date();
				var hour			= dateTime.getHours();
				
				var inputs = button.popTimer;
				if(inputs.hour.value === 'NOW'){	
					useFormatted 	= true;
				}
				else if((i = String(inputs.hour.value).indexOf('+')) !== -1){
					useFormatted 	= true;
					hour			= hour + Number(inputs.hour.value.substring(i+1));
					hour			= (hour > 24 ? hour % 24 : hour);
				}
				else if((i = String(inputs.hour.value).indexOf('-')) !== -1){
					useFormatted 	= true;
					hour			= hour - Number(inputs.hour.value.substring(i+1));
					hour			= (hour <= 0 ? 24 - (hour % 24) : hour);
				}
				
				if(useFormatted){
					inputs.hour.value 		= hour;
					inputs.minutes.value	= dateTime.getMinutes();
					inputs.meridiem.value	= (hour > 12 ? 'pm' : 'am');
				}
				else{
					inputs.hour.value 		= String(hour);
					inputs.minutes.value	= String(dateTime.getMinutes());
					inputs.meridiem.value	= String((hour > 12 ? 'pm' : 'am'));
				}
				
				button.addEventListener('click',function(){
					__private.popMenu.setTitle(this.getAttribute('data-pop-title'));
					core.events.appendTo({focus:this.getAttribute('data-pop-timer')},core.components.popTimer.event);
					__private.scrollToInterval.changeInputs(this.popTimer.hour,this.popTimer.minutes,this.popTimer.meridiem);
					__private.scrollToInterval.setTo(this.popTimer.hour,this.popTimer.minutes,this.popTimer.meridiem);
					__private.popMenu.activate();
				},false);
				
				frm = core.findParent(button,'FORM','tagName');
				if(!frm['timeZoneUTCOffsetMinutes']) frm.appendChild(timeZoneOffset = document.createElement('INPUT'));
				timeZoneOffset.type = "hidden";
				timeZoneOffset.value= dateTime.getTimezoneOffset();
				timeZoneOffset.name	= "timeZoneUTCOffsetMinutes";
			}
		};
		
		//a generic scroll detection function //takes a func to execute after a minInterval
		__private.timerScroll = function(doFunc,minInterval){
			var __private = {};
			__private.minInterval 	= minInterval||100;
			__private.start			= new Date().getTime();
			__private.now;
			__private.timer 		= null;
			__private.doFunc		= doFunc;
			__private.changeTime	= 0;
			
		    __private.process = function(e){
				console.log('console timer: ',__private.timer);
				__private.timer = __private.doFunc.call(__private.el,e);
				__private.start = new Date().getTime();
			};
		    
			var __init = function(e){
				if(!core.components.popTimer.isActive()) return;
				__private.el=this;
			    __private.now = new Date().getTime();
				if(__private.timer === null){
					console.log('console timer '+(__private.timer === null ? 'is' : 'is not')+' null.');
					__private.changeTime = __private.now - __private.start;
					if( __private.changeTime > (3 * __private.minInterval) ){
						__private.process(e);
					}
					__private.timer = setTimeout(function(){
						__private.process(e);
					},__private.minInterval);
				}
			};
			
			return __init;
		};
		
		//setup the action when timer wheel is scrolled - called by onscroll timeout
		__private.scrollToInterval = (function(){
			
			var inputHour;
			var inputMinutes;
			var inputMeridiem;
			
			var __public = function(cont,interVal,minScrollInterval,unitFocus){
				
				this.scrollTo = function(e){
					if(typeof inputHour !== 'undefined'){
						var step = Math.round(this.scrollTop / interVal);
						console.log('step',step,'scrollTop',this.scrollTop,'interVal',interVal,'options',this.options[step]);
						if(core.mobile()) this.style.overflowY = "hidden";
						this.scrollTop = this.options[step].scrollTo;
						if(core.mobile()) this.style.overflowY = "scroll";
						if(unitFocus === 'hour'){
							inputHour.value = this.options[step].value;
							var meridiemType = (inputHour.value > 12 ? 'pm' : 'am' );
							var l = __private.meridiemScroll.options.length;
							while(--l > -1){
								if(__private.meridiemScroll.options[l].value === meridiemType) __private.meridiemScroll.scrollTop = __private.meridiemScroll.options[l].scrollTo;
							}
							inputHour.eventTriggers.change();
						}
						else if(unitFocus === 'minutes'){
							inputMinutes.value = this.options[step].value; 
							inputMinutes.eventTriggers.change(); 
						}
						else if(unitFocus === 'meridiem'){
							inputMeridiem.value = this.options[step].value; 
							console.log('inputHour.value',inputHour.value);
							if(inputMeridiem.value === 'pm' && inputHour.value < 13){
								inputHour.value = Number(inputHour.value) + 12;
							}
							else if(inputMeridiem.value === 'am' && inputHour.value > 12){
								inputHour.value = Number(inputHour.value) - 12;
							}
							var l = __private.hourScroll.options.length;
							while(--l > -1){
								if(__private.hourScroll.options[l].value === inputHour.value) __private.hourScroll.scrollTop = __private.hourScroll.options[l].scrollTo;
							}
						}
					}
					return null;
				};
				
				//create a timerScroll object that calls scrollTo on interval when parent is scrolled
					//alert(minScrollInterval);
					var func = new __private.timerScroll(this.scrollTo,minScrollInterval);
			
					cont.addEventListener('scroll',func,false);
			};
			
			//when activated this changes the inputs that will be targeted by the scroll
			__public.changeInputs = function(hourInput,minutesInput,meridiemInput){
				inputHour 		= hourInput;
				inputMinutes 	= minutesInput;
				inputMeridiem	= meridiemInput;
			};
			
			//set the scroller to the corresponding input values
			__public.setTo = function(hourInput,minutesInput,meridiemInput){
				var index,value;
				
				__private.popMenu.container.style.display = 'block';
				core.components.popTimer.setActive(false);
				
				value = Number(hourInput.value);
				if(value > 0 && value < 25){
					__private.hourScroll.scrollTop = __private.hourScroll.options[value - 1].scrollTo;
				}
				
				value = Number(minutesInput.value);
				if(value > -1 && value < 60){
					__private.minutesScroll.scrollTop = __private.minutesScroll.options[value].scrollTo;
				}
				
				__private.popMenu.container.style.display = 'none';
				core.components.popTimer.setActive(true);
			};
			
			return __public;
		}());
		
		__private.setup = function(){//add hours (1-12) and minutes (00-59) to scroller container - use timerScroll
			
			//add hours 1-12 to hour scroll wheel *************************************
			__private.hourScroll = this.querySelector('.hour .scroll-cont');
			var x,
				div,
				common
			;
			
			//console.log('hourScroll',__private.hourScroll);
			
			__private.hourScroll.options = [];
			for(x=1;x<25;x++){
				div = document.createElement('DIV');
				div.className = 'value';
				common = ("0" + String(x)).slice(-2);
				div.innerHTML = (common > 12 ? common - 12 : common);
				__private.hourScroll.appendChild(div);
				__private.hourScroll.options[x-1] = {scrollTo:div.offsetTop,value:x};
			}
			window.testHourDiv = div;
			var divHeight = core.getHeight(div);
			
			//add scroll event
			new __private.scrollToInterval(__private.hourScroll,divHeight,300,'hour');
			
			//add minutes 00-59 to minutes scroll wheel ********************************
			__private.minutesScroll = this.querySelector('.minutes .scroll-cont');
			
			//console.log('minutesScroll',__private.minutesScroll);
			
			__private.minutesScroll.options = [];
			for(x=0;x<60;x++){
			    div = document.createElement('DIV');
			    div.className = 'value';
			    div.innerHTML = ("0" + x).slice(-2);
				__private.minutesScroll.appendChild(div);
				__private.minutesScroll.options[x] = {scrollTo:div.offsetTop,value:x};
				//console.log('scroll setup: ','value',x,'offsetTop',div.offsetTop);
			}
			divHeight = core.getHeight(__private.minutesScroll.childNodes[0]);
			//console.log('minutesScroll Height:',divHeight);
			
			//add scroll event
			new __private.scrollToInterval(__private.minutesScroll,divHeight,300,'minutes');
			
			//meridiem scroll initial populate and setup *******************************
			__private.meridiemScroll = this.querySelector('.meridiem .scroll-cont');
			
			//console.log(__private.meridiemScroll);
			
			__private.meridiemScroll.options = [];
			['am','pm'].forEach(function(label){
				div = document.createElement('DIV');
			    div.className = 'value';
			    div.innerHTML = label;
				__private.meridiemScroll.appendChild(div);
				__private.meridiemScroll.options.push({scrollTo:div.offsetTop,value:label});
			});
			divHeight = core.getHeight(div);
			
			//console.log('testHourDiv',core.getHeight(window.testHourDiv));
			
			//add scroll event
			new __private.scrollToInterval(__private.meridiemScroll,divHeight,300,'meridiem');
		};
		
		//PUBLIC METHODS
		
		var __public = {};
		
		__public.setActive = function(bool){
			__private.isActive = bool;
		};
		
		__public.isActive = function(){
			return __private.isActive;
		};
		
		__public.event = core.events('pop-timer-deactivate');
		
		core.testLoaded(__private.init,'window');
		
		return __public;
	}());
	
	__init.popSelect = (function(){
		// ** setup **
			// add attribute data-pop-select=[options to pull], pull in the template.
			// the option should be registered in the web service options -> options_manager list
		// ** methodology **
			// create a popmenu for each pop-select with data from web service options_list by the value of data-pop-select
			// after the template is parsed, run setupOptions with the associated input given using a closure
			// once setup is complete the event 'pop-select-ready' is fired
		
		var factory = {instances:[],menus:[],inputs:[]};
		
		var init = function(){
			
			//add import to head
			var link = document.createElement('LINK');
			link.setAttribute('data-import-name','pop-select');
			link.href = '/spotter/js/core/templates/pop-select.html';
			link.rel = 'import';
			document.getElementsByTagName('head')[0].appendChild(link);
			core.imports('pop-select');
			
			var setupOptions = function(par,input,multiSelect,exclusive,popMenu){//run once for each menu (this == menu), input is the input assigned to this menu
				var __menu = {multiSelect:multiSelect};
				core.events.setEventTrigger(input,'change');
				__menu.exclusive = {inputs:[],values:exclusive||[],simpleValues:[]};
				return function(ajaxResult){	
					//prep response -- connect element text to the input value through an object linking value to short hand (abbr in the ajax response)
					var data = ajaxResult.template.response.result;
					var info = {},l=data.length;
					while(--l > -1){
						info[String(data[l].value)] = data[l].abbr;
					}
					core.data.bindElementToInput(par,input,function(content){
						content = content.split(',');
						var l=content.length;
						while(--l > -1){
							content[l] = info[content[l]];
						}
						return content.join(',');
					});
					if(!input.value.length){ input.value = data[0].value; }
					else{ input.value = input.value; }
										
					__menu.values = {};
					__menu.options = core.castToArray(this.querySelectorAll('.pop-select-option'));
					
					//get all the options that are exclusive and group into menu
					var l=__menu.exclusive.values.length,val,el;
					while(--l > -1){
						val = __menu.exclusive.values[l];
						el = this.querySelector('[data-value="'+val+'"]')||this.querySelector('[data-simple-value="'+val+'"]');
						if(typeof el !== 'undefined'){
							__menu.exclusive.inputs.push(el);
							__menu.exclusive.values[l] = el.getAttribute('data-value');
						}
					}
					
					var getFunc = (function(options,input){//the onclick/select-an-option function for exclusive options
						return function(option){
							var value = option.getAttribute('data-value')
								,regex = new RegExp('(^|,)'+RegExp.escape(value)+'(,|$)')
							;
							if(__menu.multiSelect === true && __menu.exclusive.inputs.indexOf(option) === -1){
								return function(){//multi select option
									__menu.exclusive.inputs.forEach( function(option){ option.className = option.className.replace(' selected',' unselected'); });
									__menu.exclusive.values.forEach( function(v){ input.value = input.value.removeListValue(v); } );
									input.value = input.value.toggleListValue(value);
									if(regex.test(input.value)){ this.className = this.className.replace(' unselected',' selected'); }
									else{  this.className = this.className.replace(' selected',' unselected'); }
									input.eventTriggers['change']();
									if(input.focus) input.focus();
									if(input.blur) input.blur();
								}
							}
							else{
								return function(){//exclusive option
									options.forEach( function(option){ option.className = option.className.replace(' selected',' unselected'); });
									input.value = value;
									this.className = this.className.replace(' unselected',' selected');
									input.eventTriggers['change']();
									if(input.focus) input.focus();
									if(input.blur) input.blur();
								};
							}
						}
					}(__menu.options,input));
					
					__menu.options.forEach( function(option){
						__menu.values[option.getAttribute('data-value')] = option;
						option.addEventListener('click',getFunc(option),false);
					});
					
					popMenu.onOpen(function(){
						if(input.value !== 'undefined'){
							var list = input.value.split(',');
							list.forEach(function(val){
								if(typeof __menu.values[val] !== 'undefined'){
									__menu.values[val].className =__menu.values[val].className.replace(' unselected',' selected');;
								}
							});
						}
					});
				}
			};
			
			var els = document.querySelectorAll('[data-pop-select]'),l=els.length,input,el,popMenu;
			
			while(--l > -1){//for each pop-select
				el = els[l];
				
				//multi-select attribute will cause the selections to be groupable instead of exclusive	
					var multiSelect = el.getAttribute('data-pop-multi-select'),exclusive=null;
					if(multiSelect !== null){
						exclusive = multiSelect.split(',');
						multiSelect = true;
					}
					else{
						multiSelect = false;
					}
				// ---------------
				
				input = el.getElementsByTagName('INPUT')[0];
				if(typeof input === 'undefined') { console.log('input not found',el); continue; }
				
				popMenu = new core.popMenu('pop-select-'+input.name)
					.useTemplate('pop-select',{url:"services/options_list",data:{requestType:"get",types:input.name}})
					.setTitle(el.getAttribute('data-pop-title'))
				;
				
				popMenu.onMenu(setupOptions(el,input,multiSelect,exclusive,popMenu))
					.loadTemplate()
				;
				
				factory.instances.push(el);
				factory.inputs.push(input);
				factory.menus.push(popMenu);
				
				el.addEventListener('click',popMenu.activate,false);
			}
			
			core.events.fire(core.events('pop-select-ready'));
		};
		
		core.testLoaded(init);
		
		// when calling core.popSelect.onOpen/onClose(func) the function (func) should use the form
		// function(input) where 'this' will be the data-pop-select button and input will be the input created for it
		//
		//	core.components.popSelect.onClose(function(input){
		//		...
		//	});
		//
		// if a data-simple-value attribute is specified in template than onclick that value will be set to
		// input.simpleValue
		var __public = {
			onClose: function(el,func){
				var i;
				if((i = factory.instances.indexOf(el)) > -1){
					var newFunc = function(){ func.call(factory.instances[i],factory.inputs[i]) };
					factory.menus[i].onClose(newFunc);
				}
			},
			onOpen: function(el,func){
				var i;
				if((i = factory.instances.indexOf(el)) > -1){
					var newFunc = function(){ func.call(factory.instances[i],factory.inputs[i]) };
					factory.menus[i].onOpen(newFunc);
				}
			}
		};
		
		return __public;
	}());
	
	return __init;
	
}());
