	console.log("using form");
	
	//create a new instance LIKE var validator = new core.form(frmElement), the validations are
	//automatically setup according to the data attributes on the individual elements.
	//Use validator.validate() == true/false to check if the form is validated.
	//Form needs to have an element with 'data-validation-messages' attribute to receive messages (set to display:none to not use)
	core.form = (function(){
		//var factory = {forms:[],onFailure:[]}
		var init = function(frm,ajaxFunc){
			if(typeof frm === 'undefined' || frm === null){ console.log('core.form: form not defined');return; }
			var self = {
				pattern:{members:[],patterns:[],messages:[]},
				matching:{groups:[],members:[],status:[],messages:[]},
				required:{members:[],messages:[]},
				minLength:{members:[],lengths:[],messages:[]},
				maxLength:{members:[],lengths:[],messages:[]},
				messageBox: frm.querySelector('[data-validation-messages]'),
				isValid: false
			};
			if(frm.tagName && frm.tagName==="FORM"){
				var coreRef = core.form.validate;
				var type,elems,l,input,pattern,current;
				
				//use primes to check which validations have failed to prevent events from stepping on each other
				//a new instance of isValid is created for each input to track it individually
				//use the class level to check form overall validity (isValid.valid)
				//accepts the following data-attributes:
					//data-validate=pattern OR a preset (alpha,numeric,alphanumeric,streetaddress,phone,phoneint (international),zipcodedom (US),zipcodeint (international),country,email)
					//data-validate-onchange=pattern OR a preset. Same as above except will validate with change event instead of keyup
					//data-required - Doesnt need a value. Onchange, checks if data is blank.
					//data-min-length=intMinLength. Onchange checks if data length is under intMinLength.
					//data-max-length=intMaxLength. Onchange checks if data length is under intMaxLength.
					//data-matching=groupName. Onchange checks if all the elements with the same attribute and value are equal within the same form.
				//Will add a property to each input, 'validate', exposing methods affecting that input. 
					//Use input.validate.setOnPass(func) and ..setOnFail(func) to set callbacks for pass/fail validations.
						//func should be of structure function(){doSomething to this;} where this is the input
					//Calling input.validate() will run every validation for that specific input.
					//Use core.form.setOnPass/setOnFail(groupName,func) to set the onPass/onFail callBacks for a matching group.
						//Within func, this will refer to the members as they are iterated through within the group
				//*NOT CURRENTLY WORKING* Will add a box to data-validation-messages for each validation or matching group.
					//Each of these boxes specific animations for pass/fail can be changed using input.validate.messageBox.onPass/.onFail(func)
				
				var isValid = (function(){
					var factory = {status:1};
					var init = function(){
						var self = {current:1,pattern:2,matching:3,required:5,minLength:7,maxLength:11,between:13};
						//testFor is the validation type ^
						var init = function(testFor){
							if(self.current===1) return true;
							if(self.current / self[testFor] === 1) return true;
							return false;
						}
						init.set = function(testFor){
							if(self.current % self[testFor] === 0) return;
							self.current *= self[testFor];
							factory.status *= self[testFor];
						};
						init.unset = function(testFor){
							if(self.current % self[testFor] === 0){
								self.current /= self[testFor];
								factory.status /= self[testFor];
							}
						};
						init.report = function(){
							console.log('isValid report:');
							console.log(self);
						};
						return init;
					};
					init.valid = function(){
						//alert(factory.status);
						if(factory.status === 1) return true;
						return false;
					};
					return init;
				}());
				
				self.isValid = function(){
					return isValid.valid();
				}
				
				//The individual validation types can also be called using input.validate.pattern,input.validate.matching...etc
				//This function, input.validate(), will call all of them and push a result obj into the input.validate.results
				//input.validate.results is an array with result objects: [{type:type of validate failure, message:specific message, associate: the inputs involved in the failure}]
				//failures using input.validate() will be added as errors to factory. Associated by index to the specific form reference in factory
				
				function setupValidateElement(input){
					
					input.validate = function(){
						this.validate.result = [];
						var result = [];
						for(var x=0, l=this.validate.funcs.length; x<l; x++){
							this.validate.funcs[x]();
						}
					};
					input.validate.funcs = [];
					input.validate.isValid = new isValid();
					
					input.validate.setOnFail = (function(input){return function(func){ input.validate.onFail = function(){func.call(input);}; };}(input));
					input.validate.setOnPass = (function(input){return function(func){ input.validate.onPass = function(){func.call(input);}; };}(input));
				
					input.validate.setOnFail(function(){this.style.borderColor='rgb(255,0,0)';});
					input.validate.setOnPass(function(){this.style.borderColor='rgb(0,0,0)';});
					
					var msgBox;
					
					
					//data-validate=pattern
					if((pattern = input.getAttribute('data-validate')) || (pattern = input.getAttribute('data-validate-onchange'))){ 
						if(pattern.substring(0,7) === 'between'){ input.validate.range = pattern.substring(8).trim().split('-'); pattern = 'between'; }
						self.pattern.members.push(input); 
						self.pattern.patterns.push(pattern);
						msgBox = document.createElement('div');
						self.messageBox.appendChild(msgBox);
						self.pattern.messages.push(msgBox);
					}
					//data-matching=group
					if(groupName = input.getAttribute('data-matching')){
						index = self.matching.groups.indexOf(groupName);
						if(index===-1){ index=self.matching.groups.push(groupName)-1; self.matching.members[index] = []; }
						self.matching.members[index].push(input);
						msgBox = document.createElement('div');
						self.messageBox.appendChild(msgBox);
						self.matching.messages.push(msgBox);
					}
					//data-required
					if(input.hasAttribute('data-required')){
						if(input.value.length === 0 || Number(input.value) == 0){input.validate.isValid.set('required');}//invalidate required attributes on instantiation
						self.required.members.push(input);
						msgBox = document.createElement('div');
						self.messageBox.appendChild(msgBox);
						self.required.messages.push(msgBox);
					}
					//data-min-length=length
					if(minLength = input.getAttribute('data-min-length')){
						self.minLength.members.push(input); 
						self.minLength.lengths.push(minLength);
						msgBox = document.createElement('div');
						self.messageBox.appendChild(msgBox);
						self.minLength.messages.push(msgBox);
					}
					//data-max-length=length
					if(maxLength = input.getAttribute('data-max-length')){
						self.maxLength.members.push(input); 
						self.maxLength.lengths.push(maxLength);
						msgBox = document.createElement('div');
						self.messageBox.appendChild(msgBox);
						self.maxLength.messages.push(msgBox);						
					}
				}
				var len=frm.elements.length,l=-1;
				while(++l < len){ setupValidateElement(frm.elements[l]); }
				
					//*** FOR ANY INPUT YOU CAN CALL input.eventTriggers.[Event Name]() TO TRIGGER THE EVENT PROGRAMMATICALLY ex: input.eventTrigger.blur()***//
				//PATTERNS
				self.pattern.members.forEach(function(input,index){
					var pattern = self.pattern.patterns[index];
					var isValid = input.validate.isValid;
					var msgBox = self.pattern.messages[index];
					core.form.initMsgBox(msgBox);
					
					if(typeof coreRef[pattern] !== 'undefined'){
						input.validate.pattern = (function(input){
							var isValid = input.validate.isValid;
							return function(){
								var result = coreRef[pattern](input);
								var valid = isValid('pattern');
								isValid.report;
								if(result.status==='fail'){ input.validate.onFail(); isValid.set('pattern'); msgBox.fail(result.message); }
								else{ if(valid) input.validate.onPass(); isValid.unset('pattern'); msgBox.pass(); }
							};
						}(input));
					}
					else{
						input.validate.pattern = (function(input){
							var isValid = input.validate.isValid;
							return function(){
								var result = coreRef.pattern(input,pattern);
								var valid = isValid('pattern');
								if(result.status==='fail'){ input.validate.onFail(); isValid.set('pattern'); msgBox.innerHTML=result.message; msgBox.style.display='block'; }
								else{ if(valid) input.validate.onPass(); isValid.unset('pattern'); msgBox.innerHTML=""; msgBox.style.display='none'; }
							};
						}(input));
					}
					input.validate.funcs.push(input.validate.pattern);
					if(input.hasAttribute('data-validate-onchange')){	
						core.events.setEventTrigger(input,'change');
						input.addEventListener('change',input.validate.pattern,false);
					}
					else{
						core.events.setEventTrigger(input,'keyup');
						input.addEventListener('keyup',input.validate.pattern,false);
						input.addEventListener('change',input.validate.pattern,false);
					}
				});
				
				//MATCHING
				self.matching.groups.forEach(function(groupName,index){
					var msgBox = self.matching.messages[index];
					self.matching.members[index].forEach(function(input){
						//isValid functionality is handled within the matching class
						coreRef.matching(input,groupName);						
						input.validate.matching = (function(groupName){
							return function(){
								var result = coreRef.matching.check(groupName);
								console.log(result);
								if(result.status==='fail'){ coreRef.matching.onFail(result.associated); msgBox.innerHTML=result.message; msgBox.style.display='block'; }
								else{coreRef.matching.onPass(result.associated); msgBox.innerHTML=""; msgBox.style.display='none'; }
							};
						}(groupName));
						input.validate.funcs.push(input.validate.matching);
						core.events.setEventTrigger(input,'change');
						input.addEventListener('change',input.validate.matching,false);
					});
				});
				
				//REQUIRED
				self.required.members.forEach(function(input,index){
					var isValid = input.validate.isValid;
					var msgBox = self.required.messages[index];
					input.validate.required = (function(input){
						return function(){
							//console.log(input.name);
							var result = coreRef.required(input);
							var valid = isValid('required');
							if(result.status==='fail'){ 
								input.validate.onFail(); 
								isValid.set('required'); 
								msgBox.innerHTML=result.message;
								msgBox.style.display='block'; 
							}
							else{ if(valid) input.validate.onPass(); isValid.unset('required'); msgBox.innerHTML=""; msgBox.style.display='none'; }
						};
					}(input));
					input.validate.passRequired = (function(input){
						return function(){	
							var isValid = input.validate.isValid;
							var valid = isValid('required');
							if(valid){ input.validate.onPass(); msgBox.innerHTML=""; msgBox.style.display='none'; } 
							isValid.unset('required');
						};
					}(input));
					input.validate.funcs.push(input.validate.required);
					core.events.setEventTrigger(input,'blur');
					core.events.setEventTrigger(input,'focus');
					input.addEventListener('blur',function(){this.validate.required();},false);
					input.addEventListener('focus',function(){this.validate.passRequired();},false);
				});
				
				//MAX LENGTH
				self.maxLength.members.forEach(function(input,index){
					var msgBox = self.maxLength.messages[index];
					var length = self.maxLength.lengths[index];					
					input.validate.maxLength = (function(input){	
						return function(){
							var result = coreRef.maxlength(input,length);
							var isValid = input.validate.isValid;
							var valid = isValid('maxLength');
							if(result.status==='fail'){ input.validate.onFail(); isValid.set('maxLength'); msgBox.innerHTML=result.message; msgBox.style.display='block'; }
							else{ if(valid) input.validate.onPass(); isValid.unset('maxLength'); msgBox.innerHTML=""; msgBox.style.display='none'; }
						};
					}(input));
					input.validate.funcs.push(input.validate.maxLength);
					core.events.setEventTrigger(input,'keyup');
					input.addEventListener('keyup',input.validate.maxLength,false);
				});
				
				//MIN LENGTH
				self.minLength.members.forEach(function(input,index){
					var msgBox = self.minLength.messages[index];					
					var length = self.minLength.lengths[index];
					input.validate.minLength = (function(input){	
						return function(){
							var result = coreRef.minlength(input,length);
							var isValid = input.validate.isValid;
							var valid = isValid('minLength');
							if(result.status==='fail'){ input.validate.onFail(); isValid.set('minLength'); msgBox.innerHTML=result.message; msgBox.style.display='block'; }
							else{ if(valid) input.validate.onPass(); isValid.unset('minLength'); msgBox.innerHTML=""; msgBox.style.display='none'; }
						};
					}(input));
					input.validate.funcs.push(input.validate.minLength);
					core.events.setEventTrigger(input,'keyup');
					input.addEventListener('keyup',input.validate.minLength,false);
				});

				this.validate = function(){ 
					var l = frm.elements.length,x=-1;
					while(++x < l){
						if(!frm.elements[x].validate) setupValidateElement(frm.elements[x]);
						frm.elements[x].validate();
					}
					return self.isValid();
				};
				frm.validator = this;
			}
			else{
				console.log('error: the value passed to the core.form constructor should be a FORM element. The value passed was '+frm);
			}
			
			if(frm.hasAttribute("data-ajax-submit")) core.form.ajaxSubmit(frm,ajaxFunc);
		};
		
		init.validate = {};
		
		init.validate.pattern = function(input,pattern){
			if(!new RegExp(pattern).test(input.value)){
				return {status:'fail',type:'pattern',subType:'custom',message:(input.getAttribute('data-validate-name')||input.name)+' contains disallowed characters',associated:input};
			}
			return {status:'pass',type:'pattern',subType:'custom',name:input.name};
		};
		
		init.validate.alpha = function(input){
			if(!/^[a-zA-Z\s_]*$/.test(input.value)){
				return {status:'fail',type:'pattern',subType:'alpha',message:(input.getAttribute('data-validate-name')||input.name)+' must contain only letters, spaces, or underscores (_)',associated:input};
			}
			return {status:'pass',type:'pattern',subType:'alpha',name:input.name};
		};
		
		init.validate.numeric = function(input){
			if(!Number(input.value) && Number(input.value) !== 0){	
				return {status:'fail',type:'pattern',subType:'numeric',message:(input.getAttribute('data-validate-name')||input.name)+' must contain only numbers',associated:input};
			}
			return {status:'pass',type:'pattern',subType:'numeric',name:input.name};
		};
		
		init.validate.alphanumeric = function(input){
			if(!/^[\w\s]*$/.test(input.value)){
				return {status:'fail',type:'pattern',subType:'alphanumeric',message:(input.getAttribute('data-validate-name')||input.name)+' must contain only letters, numbers, spaces, or underscores (_)',associated:input};
			}
			return {status:'pass',type:'pattern',subType:'alphanumeric',name:input.name};
		};
		
		init.validate.streetaddress = function(input){
			if(!/^[A-Za-z0-9'\.\-\s\,]*$/.test(input.value)){
				return {status:'fail',type:'pattern',subType:'streetaddress',message:(input.getAttribute('data-validate-name')||input.name)+' must be a properly formatted address with street number and street name',associated:input};
			}
			return {status:'pass',type:'pattern',subType:'streetaddress',name:input.name};
		};
		
		init.validate.phone = function(input){
			if(input.value.length > 0){	
				var tv = input.value.replaceAll("[^0-9]","");
				if(tv.length < 10){
					return {status:'fail',type:'pattern',subType:'phone',message:(input.getAttribute('data-validate-name')||input.name)+' must be a full 10-digit phone number including area code',associated:input};
				}
			}
			return {status:'pass',type:'pattern',subType:'phone',name:input.name};
		};
		
		init.validate.phoneint = function(input){
			if(input.value.length > 0){		
				var tv = input.value.replaceAll("[^0-9]","");
				if(tv.length < 11){
					return {status:'fail',type:'pattern',subType:'phoneint',message:(input.getAttribute('data-validate-name')||input.name)+' must be a full internation phone number including area code and country code',associated:input};
				}
			}
			return {status:'pass',type:'pattern',subType:'phoneint',name:input.name};
		};
		
		init.validate.day = function(input){
			if(input.value > -1 && input.value < 32){
				return {status:'pass',type:'pattern',subType:'day',name:input.name};
			}
			else{
				return {status:'fail',type:'pattern',subType:'day',message:(input.getAttribute('data-validate-name')||input.name)+' exceeded the range for a day of the month.',associated:input};
			}
		}
		
		init.validate.zipcodedom = function(input){
			if(!/^[0-9]{5}$/.test(input.value) && input.value.length > 0){
				return {status:'fail',type:'pattern',subType:'zipcodedom',message:(input.getAttribute('data-validate-name')||input.name)+' must be a 5 digit US zip code',associated:input};
			}
			return {status:'pass',type:'pattern',subType:'zipcodedom',name:input.name};
		};
		
		init.validate.zipcodeint = function(input){
			if(!/^[0-9a-zA-Z\s]{5,}$/.test(input.value) && input.value.length > 0){
				return {status:'fail',type:'pattern',subType:'zipcodeint',message:(input.getAttribute('data-validate-name')||input.name)+' must be a valid postal code',associated:input};
			}
			return {status:'pass',type:'pattern',subType:'zipcodeint',name:input.name};
		};
		
		init.validate.country = function(input){
			if(!/^[a-zA-Z\s]+$/.test(input.value) && input.value.length > 0){
				return {status:'fail',type:'pattern',subType:'country',message:(input.getAttribute('data-validate-name')||input.name)+' must be a 5 digit US zip code',associated:input};
			}
			return {status:'pass',type:'pattern',subType:'country',name:input.name};
		};
		
		init.validate.email = function(input){
			if(!/^.+@.+\..+$/.test(input.value) && input.value.length > 0){
				return {status:'fail',type:'pattern',subType:'email',message:(input.getAttribute('data-validate-name')||input.name)+' must be a valid email like user@domain.tld',associated:input};
			}
			return {status:'pass',type:'pattern',subType:'email',name:input.name};
		};
		
		init.validate.password = function(input){
			if(input.value.length > 20 && input.value.length < 40){
				return {status:'pass',type:'pattern',subType:'password',name:input.name};
			}
			else if(!input.value.length){
				return {status:'pass',type:'pattern',subType:'password',name:input.name};
			}
			else if(/[!@#$%\^&\*]/.test(input.value)){
				if(/[A-Z]/.test(input.value)){
					if(/[0-9]/.test(input.value)){
						if(input.value.length > 6 && input.value.length < 40){
							return {status:'pass',type:'pattern',subType:'password',name:input.name};
						}
						else{ $error = "<li>Must be a minimum of 6 characters and a maximum of 40.</li>" }
					}
					else{ $error = "<li>Must contain at least one number.</li>" }
				}
				else{ $error = "<li>Must contain at least one capital letter.</li>" }
			}
			else{
				$error = "<li>Must contain at least one of the following: ! @ # $ % ^ & *</li>"
			}
			var msg = "<ul><li>"+(input.getAttribute('data-validate-name')||input.name)+" must meet the following requirement:</li>"+$error+"<li>OR</li><li>Your password can be at least 20 characters in length (Max 40).</li></ul>";
			return {status:'fail',type:'pattern',subType:'password',message:msg,associated:input};
		};
		
		init.validate.between = function(input){
			var range = input.validate.range;
			if(input.value.length && !(Number(input.value) >= Number(range[0]) && Number(input.value) <= Number(range[1]))){
				return {status:'fail',type:'pattern',subType:'between',message:(input.getAttribute('data-validate-name')||input.name)+' must be between '+range[0]+' and '+range[1],associated:input};
			}
			return {status:'pass',type:'pattern',name:input.name};
		};
		
		init.validate.required = function(input){
			if(!input.value.length > 0){
				return {status:'fail',type:'required',message:(input.getAttribute('data-validate-name')||input.name)+' cannot be empty',associated:input};
			}
			return {status:'pass',type:'required',name:input.name};
		};
		
		init.validate.minlength = function(input,minLength){
			if(input.value.length && input.value.length < minLength){
				return {status:'fail',type:'required',message:(input.getAttribute('data-validate-name')||input.name)+' must be more than '+(Number(minLength)-1)+' characters in length.',associated:input};
			}
			return {status:'pass',type:'minLength',name:input.name};
		};
		
		init.validate.maxlength = function(input,maxLength){
			if(input.value.length && input.value.length > maxLength){
				return {status:'fail',type:'required',message:(input.getAttribute('data-validate-name')||input.name)+' must be under '+(Number(maxLength)+1)+' characters.',associated:input};
			}
			return {status:'pass',type:'maxLength',name:input.name};
		};
		
		init.validate.matching = (function(){//use core.form.validate.matching(input,groupName) to add an input to a group
			var factory = {groups:{}};
			
			var init = function(el,groupName){				
				if(typeof factory[groupName]==='undefined'){
					factory[groupName] = {members:[]};
					factory[groupName].checkFunc = core.form.validate.matching.checkFunc(groupName);
					
					core.form.validate.matching.setOnFail(groupName,function(){this.style.borderColor='rgb(255,0,0)';});
					core.form.validate.matching.setOnPass(groupName,function(){this.style.borderColor='rgb(0,0,0)';});
				}
				
				if(factory[groupName].members.indexOf(el) > -1) return false;
				
				factory[groupName].members.push(el);
				
				el.validate.matching = factory[groupName].checkFunc;
			};
			
			//this function returns a function to check each member in a group for matching.
			init.checkFunc = function(groupName){//returns a function to be associated with the elements group
				var group = factory[groupName];
				return function(){
					var input;
					var l=group.members.length-1;
					while(--l > -1){
						input = group.members[l];
						if(input.value!==group.members[l+1].value){
							return {status:'fail',type:'matching',message:'the '+groupName+' inputs must match',associated:groupName};
						}
					}
					return {status:'pass',type:'matching',associated:groupName};
				};
			};
			
			//call this to check an entire group
			init.check = function(groupName){
				return factory[groupName].checkFunc();
			};
			
			//use this to set the action for a group fail. This is specific to the group
			init.setOnFail = function(groupName,func){
				factory[groupName].onFail = function(){
					factory[groupName].members.forEach(function(el){
						func.call(el);
						el.validate.isValid.set('matching');
					});
				};
			};
			
			//use this to set the action for a group pass. This is specific to the group and does not work on inputs that otherwise do not validate
			init.setOnPass = function(groupName,func){
				factory[groupName].onPass = function(){
					factory[groupName].members.forEach(function(el){
						if(el.validate.isValid('matching')) func.call(el);
						el.validate.isValid.unset('matching');
					});
				};
			};
			
			//** these functions are used to call specific fail/pass functions **//
			init.onFail = function(groupName){
				factory[groupName].onFail();
			};
			
			init.onPass = function(groupName){
				factory[groupName].onPass();
			};
			//** end **//
			
			return init;
		}());
		
		init.initMsgBox = function(msgBox){
			msgBox.fail = (function(msgBox){ return function(msg){ msgBox.innerHTML=msg; msgBox.style.display='block'; }; }(msgBox));
			msgBox.pass = (function(msgBox){ return function(){ msgBox.innerHTML=""; msgBox.style.display='none'; }; }(msgBox));
		};
		
		init.setInputValues = function(o,frm){//o={elementId:newValue}
			frm=frm||document;
			var el,tagName;
			for(var prop in o){
				el=frm.getElementsByName(prop);
				if(typeof el!=="undefined"){
					l=el.length;
					while(--l > -1){
						tagName=el[l].tagName;
						if(tagName==="SELECT"){
							for(var x=0,l=el[l].options;x<l;x++){
								if(el[l].options[x].value==o[prop]){
									el[l].options[x].selected="selected";
									break;
								}
							}
						}
						if(tagName==="TEXTAREA"){
							el[l].value=o[prop];
						}
						if(tagName==="INPUT"){
							el[l].value=o[prop];
						}
						if(tagName==="RADIO"){
							if(el[l].value===o[prop]) el[l].checked="checked";
						}
						if(tagName==="CHECKBOX"){
							if(el[l].value===o[prop]) el[l].checked="checked";
						}
					}
				}
			}
		};
		
		init.imageInput = function(input){
			var self={},init=function(){};	
			
				init.showImage=function(imgTarg){
				var func=function(){
					if (input.files && input.files[0]) {
						var reader = new FileReader();
			
							reader.onload = function (e) {
							imgTarg.src=e.target.result;
						};
			
							reader.readAsDataURL(input.files[0]);
					}
				};
				input.addEventListener('change',func,false);
			};
			
			return init;
		};
		
		//**SAVE FORMS**
		init.saveForms = (function(){
			// add an attribute to a form to save its current state to cookie ie <form data-some-attr="form-unique-value">...
			// Then call core.form.saveForms.saveAllFormStates('data-some-attr') to save the form(s) state to cookie.
			// Restore the form(s) by calling core.form.saveForms.restoreFormStates('data-some-attr')
			var self={pageName:window.location.pathname.replace(/[^\w]/g,"")},
				init=function(){}
			;
			
			init.saveFormState=function(frm){//name is the cookie key for later recall and is mandatory
				frm=frm;
				frm.core=frm.core||{};
				frm.core.saveFormState={};
				var fs=frm.core.saveFormState,
					inputs=frm.getElementsByTagName('INPUT'),
					textareas=frm.getElementsByTagName('TEXTAREA'),
					selects=frm.getElementsByTagName('SELECT'),
					el,
					si,
					type,
					regex_type,
					regex_state
				;
				inputs=core.concatNodeLists([inputs,textareas]);
				
				for(var x=0,l=inputs.length;x<l;x++){
					el=inputs[x],type=el.type.toLowerCase(),regex_type=new RegExp("^(radio|checkbox)$"),regex_state=new RegExp("^(checked|selected)$");
					if(regex_type.test(type)){
						if(typeof fs[el.name]==='undefined'){fs[el.name]=[];}
						fs[el.name].push({state:(regex_state.test(el.checked)?1:0),value:el.value,type:el.type})
					}
					else{
						fs[el.name]={value:(typeof el.value === 'undefined' ? '' : el.value)};
					}
				}
				
				for(var x=0,l=selects.length;x<l;x++){
					var el=selects[x],si=el.selectedIndex;
					fs[el.name]={selectedIndex:si,value:el.options[el.selectedIndex].value};
				}
			};
			
			init.saveAllFormStates=function(attr){
				var frms=document.querySelectorAll("FORM["+attr+"]"),
					l=frms.length,
					json={},
					frm,
					name
				;
				while(--l > -1){
					frm=frms[l];
					name=frm.getAttribute(attr);
					init.saveFormState(frm);
					json[name]=frm.core.saveFormState;
				}
				var obj={};
				obj[self.pageName]={value:JSON.stringify(json),seconds:600};
				core.cookie.setValue(obj);
			};
			
			init.restoreFormState=function(attr){
			    var frms=document.querySelectorAll('FORM['+attr+']'),
					l=frms.length
				;
				if(typeof self.info==='undefined') self.info = core.cookie.getValue(self.pageName).value;
				if(typeof self.info!=='object') return;
				//self.info=JSON.parse(self.info);
				var name,
					info,
					value,
					el
				;
			    while(--l > -1){
			        name=frms[l].getAttribute(attr);
			        info=self.info[name];
					for(var prop in info){
						if(prop.length===0){continue;}
						if(Array.isArray(info[prop])){
							info[prop].forEach(function(val,index,array){
								var el=frms[l].querySelector('input[type="'+val.type+'"][value="'+val.value+'"][name="'+this.prop+'"]');
								if(val.state===1){el.setAttribute("checked","checked");}
								else{el.removeAttribute("checked");}
							},{prop:prop});
						}
						else{
							if(typeof (el=frms[l].elements[prop]) === 'undefined') continue;
							if(el.tagName==="SELECT"){
								if(el.options.length===0){console.log('beware a select box has 0 options');continue;}
								if(info[prop.value]===el.options[info[prop].selectedIndex].value){
									el.options[info[prop].selectedIndex].setAttribute("selected","selected");
									el.selectedIndex=info[prop].selectedIndex;
								}
								else{
									core.castToArray(el.options).forEach(function(opt,index,array){
										if(opt.value===this.value){
											opt.setAttribute("selected","selected");
										}
									},{value:info[prop].value});
								}
							}
							else if(frms[l].elements[prop].type !== "file"){
								frms[l].elements[prop].value=info[prop].value;
							}
						}
					}
			    }
			};
			
			return init;
		}());
		
	// ************* AJAX SUBMIT ******************
		init.ajaxSubmit = function(frm,responseFunc,data){//use data as an object to add extra params
			var __private = {active:false};
			var func = function(e){
				core.preventDefault(e);
				
				if(__private.active){console.log('wait for request to complete');return false;}
				if(!frm.validator.validate()){ console.log('validation failed'); return false; }
				
				var url = frm.action;
				var transportType = frm.method||"POST";
				__private.active = true;
				var formData = new FormData();
				//save the cookie cache
				core.cookie.commit();					
				
				var l = frm.elements.length,input,checkboxes={};
				while(--l > -1){
					input = frm.elements[l];
					if(input.type !== 'file'){
						if(input.type === 'checkbox'){
							checkboxes[input.name] = checkboxes[input.name]||[];
							if(input.checked === true) checkboxes[input.name].push(input.value);
						}
						else if(input.type !== 'submit'){
							formData.append(input.name,String(input.value));
						}
					}
					else{
						if(input.value.length){
							if(!input.getAttribute('data-file-target')){ console.log('a file target was not found for file input '+input.name); return false; }
							if(!(targ = document.getElementById(input.getAttribute('data-file-target')))){ console.log('a file target was not found for target id '+input.getAttribute('data-file-target')); return false; }
							formData.append(input.name,targ.toDataURL('image/jpeg'));
						}
					}
				}
				for(var prop in checkboxes){
					if(checkboxes.hasOwnProperty(prop)) formData.append(prop,checkboxes[prop].join(','));
				}
				
				if(typeof data !== 'undefined'){
					for(var prop in data){
						formData.append(prop,data[prop]);
					}
				}
				
				if((frm.ajaxWaitingScreen = frm.getAttribute('data-ajax-waiting')) !== null){
					frm.ajaxWaitingScreen = document.getElementById(frm.ajaxWaitingScreen);
				}
				
				var async = true;
				if(frm.getAttribute('data-ajax-sync') !== null){
					async = false;
				}
				
				var ajax = new XMLHttpRequest();
				ajax.open(transportType, url, async);
				ajax.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				ajax.onload = (function(frm,formData){
					return function(ajaxEvent) {
						if(frm.ajaxWaitingScreen !== 'undefined' && frm.ajaxWaitingScreen !== null){
							frm.ajaxWaitingScreen.style.display = 'none';
						}
						if (ajax.status == 200) {
							__private.active = false;
							if(typeof responseFunc === 'undefined'){ console.log('A function is not supplied for the ajax response'); responseFunc = function(r){console.log('response',r);}; }
							responseFunc.call(ajaxEvent,ajax.response,frm,formData);
						} else {
							__private.active = false;
							console.log("Error " + ajax.status + " occurred uploading form.");
						}
					};
				}(this,formData))
				if(frm.ajaxWaitingScreen !== 'undefined' && frm.ajaxWaitingScreen !== null){
					frm.ajaxWaitingScreen.style.display = 'block';
				}
				ajax.send(formData);
				return false;
			};
			frm.addEventListener("submit",func,false);
		};
		
		init.setInput = function(input,value){
			if(input.type === 'radio' && input.name){
				var others = input.form[input.name],l=others.length;
				while(--l > -1){
					if(String(others[l].value) === String(value)){
						others[l].checked = true;
					}						
					else{ others[l].checked = false; }
				}
			}
			else if(input.type === 'checkbox'){
				if(value.length > 0){ input.setAttribute('checked','true'); }
			}
			else if(input.tagName === 'SELECT'){
				var opts = input.options,l=opts.length;
				while(--l > -1){
					if(opts[l].value == value){
						opts[l].setAttribute('selected','true');
						input.selectedIndex = l;
					}
					else{
						opts[l].removeAttribute('selected');
					}
				}
			}
			else{
				input.value = value;
			}
		};
		
		return init;
	}());
