	console.log("using templates");
	
	core.template = (function(){
		var __factory = {templates:{}};
		return function(str,name){
			var __private = {};
			
			var __init = function(str,name){
				if(typeof name === 'undefined') name = 'last';
				__factory.templates[name] = str;
				__init.template = str;
				__init.result = [];
			};
	
			__init.parseByQuery = function(queryResult){
				if(!Array.isArray(queryResult)) queryResult = array(queryResult);
				
				queryResult.forEach(function(row){
					var current = __init.template;
					for(var prop in row){
						current = current.replaceAllUsing('\\$\\[([^\\]]+)\\]',row);
					}
					__init.result.push(current);
				});
				
				return __init;
			};
			
			__init.loadAsHTML = function(par){
				var d = document.createDocumentFragment(),cont = document.createElement('SPAN');
				
				cont.innerHTML = __init.result.join('');
				d.appendChild(cont);
				if(typeof par !== 'undefined'){
					par.appendChild(d);
					return __init;
				}
				else{ return d; }
			};
			
			__init(str,name);
			return __init;
		};
	}());
