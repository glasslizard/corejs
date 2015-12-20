console.log("using error");

core.error = (function(){
	var __private 	= {};
	var __public 	= function(error,msg){ __public.defaultErrorHandling(error,msg); return false; };
	
	//setup
	__public.targetCont = document.createElement("DIV");
	__public.targetCont.id="errors-popup";
	__public.targetCont.className = "hide";
	__public.targetCont.addEventListener('click',function(){ core.toggleClass.add(core.error.errorShade,"hide");core.toggleClass.add(this,"hide"); },false);
	
	__public.errorShade = document.createElement("DIV");
	__public.errorShade.id = "error-shade";
	__public.errorShade.className = "hide";
	__public.errorShade.addEventListener('click',function(){ core.toggleClass.add(core.error.targetCont,"hide");core.toggleClass.add(this,"hide"); },false);
	
	__public.errorMatrix = {};
	__public.errorMatrix["query error"] = function(msg){
		if(msg.indexOf('Duplicate')!==-1){ return('Attempt to insert duplicate row.'); }
	};
	__public.errorMatrix["form validation"] = function(msg){
		return('You are attempting to send information that does not fit the format intended.');
	};
	__public.errorMatrix["ajax busy"] = function(msg){
		return('The request is busy.'+msg);
	};
	__public.errorMatrix["general error"] = function(msg){
		return('The following error occurred: '+msg);
	};
	__public.errorMatrix["credentials error"] = function(msg){
		return(msg);
	};
	
	__private.errorBox = function(str){
		__public.targetCont.innerHTML = str;
		core.toggleClass(__public.targetCont,"hide");
		core.toggleClass(__public.errorShade,"hide");
	};
	
	__public.defaultErrorHandling = function(error,msg){
		if(typeof error === 'undefined') return;
		if(typeof msg === 'undefined') { 
			if(Array.isArray(error) && error.length > 1){
				msg = error[1];
				error = error[0];
			}
			else if(typeof error === 'string'){ 
				__private.errorBox(error);
			}
		}
		if(typeof error === 'string' && typeof __public.errorMatrix[error.toLowerCase()] !== 'undefined'){
			__private.errorBox(__public.errorMatrix[error.toLowerCase()](msg));
		}
		else{
			console.log('ERROR TYPE UNKNOWN ('+error+')',' error types handled: ',Object.keys(__public.errorMatrix));
		}
		return false;
	};
	
	return __public;
}());

core.testLoaded(function(){
	document.body.appendChild(core.error.targetCont);
	document.body.appendChild(core.error.errorShade);
});
