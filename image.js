	console.log('using image');
	//*** IMAGES ***
	core.images = {
		//IMPORTANT!! use a 'new' instance when calling this method
		createImageFromFile:function(inputFile){//specific input file from input type=file, event the event name to fire
			var reader,image,self={};
			
			//create promise
			this.hasTriggered = false;
			self.func = function(){this.hasTriggered = true;}
			this.promise = function(newFunc){
				if(this.hasTriggered){
					newFunc(this.canvas);
				}
				else{self.func = newFunc;}
			};
			
			if (inputFile.type.match(/image.*/)){
				reader = new FileReader();
				image = document.createElement('img');
				
				reader.onloadend = function(e) {
					image.src = e.target.result;
					
					image.onload=function(){
						self.func(image);
					};
				};
				reader.readAsDataURL(inputFile);
			}
		},
		shrink:function(o) {//o={image:image,maxWidth:int,maxHeight:int,canvas (optional):the canvas to paint to} returns canvas as argument to o.complete
	
				var canvas = o.canvas||document.createElement('canvas');
			var img = o.image;
					
				var width = img.width;
			var height = img.height;
			var MAX_WIDTH = o.maxWidth;
			var MAX_HEIGHT = o.maxHeight;
			var ctx_width;
			var ctx_height;
			var width_ratio = width/MAX_WIDTH;
			var height_ratio = height/MAX_HEIGHT;
					
				if(width_ratio > 1 || height_ratio > 1){
				if(width_ratio > height_ratio){
					ctx_width = width/width_ratio;
					ctx_height = height/width_ratio;
				}
				else{
					ctx_width = width/height_ratio;
					ctx_height = height/height_ratio;
				}
			}
			else{
				if(width_ratio > height_ratio){
					ctx_width = width/width_ratio;
					ctx_height = height/width_ratio;
				}
				else{
					ctx_width = width/height_ratio;
					ctx_height = height/height_ratio;
				}
			}
			
				canvas.width=ctx_width;
			canvas.height=ctx_height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, ctx_width, ctx_height);
		},
		resizeForCropping:function(o,limit) {
			//TAKES A CANVAS (OR CREATES ONE) THEN FITS IMAGE TO THE CANVAS MAINTAINING ASPECT RATIO USING A MAX WIDTH AND MAX HEIGHT
			/*o={
				image:image,
				maxWidth:int,
				maxHeight:int,
				canvas (optional):the canvas to paint to, will create a floating canvas if none given
			} 
			- Nothing here operates asynchronously so this can be used inline. 
			- Set limit=true to limit the image to the max width instead of allowing it to exceed if height is the limiting dimension.
			- Returns a message of 'NO CROP' when the image is a square or the crop difference is very small (1%) in which case the crop would probably be worthless.
			*/
			var canvas = o.canvas||document.createElement('canvas');
			var img = o.image;
					
			var width = img.width;
			var height = img.height;
			var MAX_WIDTH = o.maxWidth;
			var MAX_HEIGHT = o.maxHeight;
			var ctx_width;
			var ctx_height;
			
			var widthRatio = width/MAX_WIDTH;
			var heightRatio = height/MAX_HEIGHT;
			
			var message = "";
			
			console.log('width',width,'height',height,'Wratio',widthRatio,'Hratio',heightRatio);
			
			if(Math.abs(widthRatio - 1) < .01 && Math.abs(heightRatio - 1) < .01){
				message 		= 'NO CROP';
				ctx_width 		= MAX_WIDTH;
				ctx_height 		= MAX_HEIGHT;
			}
			else if(Math.abs(widthRatio - heightRatio) < .01){//only a very small difference
				message 		= 'NO CROP';
				ctx_width 		= MAX_WIDTH;
				ctx_height 		= MAX_HEIGHT;
			}
			else if(widthRatio > 1 && heightRatio > 1){
				var divideBy 	= Math.min(widthRatio,heightRatio);
				ctx_width 		= width/divideBy;
				ctx_height 		= height/divideBy;
			}
			else if(widthRatio < 1 && heightRatio < 1){
				var divideBy	= Math.min(widthRatio,heightRatio);
				console.log('using ratio X to divideBy',divideBy);
				ctx_width 		= width/divideBy;
				ctx_height 		= height/divideBy;
				console.log('returning the following dimensions',ctx_width,',',ctx_height);
			}
			else if(widthRatio < 1){
				ctx_width 		= width * widthRatio;
				ctx_height 		= height * widthRatio;
			}
			else if(heightRatio < 1){
				ctx_width 		= width * heightRatio;
				ctx_height 		= height * heightRatio;
			}
			
			canvas.width=ctx_width;
			canvas.height=ctx_height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, ctx_width, ctx_height);
			
			return {canvas:canvas,message:message};//this object can be passed directly to 'core.images.userCropToRatio'
		},
		userCropToRatio:function(o) {
			//TAKES A CANVAS AND ADDS THE METHODS AND EVENTS TO IT FOR CROPPING
			/*o={
				canvas:the canvas to paint to (the image is also taken from here. Use core.resizeForCropping or shrink to create automatically),
				cropWidth,
				cropHeight,
				lineThickness:thickness of crop box line
				lineOpacity: 0-1, opacity of crop box line
				lineColor: color of crop box line
				useShade: true/false to use the blur or not
				shadeOpacity: opacity of blur
				shadeColor: color of blur
			}*/
			var __private = {methods:{}};
			
			var active={mousemove:false,mouseup:false,mousedown:true};
			
			__private.imageReady = false;
			var image=new Image();
			image.src = o.canvas.toDataURL();
			/*
			for(var prop in o.canvas.toDataURL){
				console.log('canvas.toDataURL['+prop+']',o.canvas.toDataURL[prop]);
			}
			for(var prop in image){
				console.log('image['+prop+']',image[prop]);
			}
			*/
			
			var lineThickness = Number(o.lineThickness)||2,
				halfLineThickness = lineThickness/2,
				lineOpacity = Number(o.lineOpacity)||1,
				lineColor = o.lineColor||'#000000',
				strokeStyle = 'rgba('+[core.hexToRgb(lineColor),lineOpacity].join()+')',
				useShade = o.useShade||false,
				shadeColor = o.shadeColor||'#000',
				shadeOpacity = o.shadeOpacity||'.8',
				shadeStyle = 'rgba('+[core.hexToRgb(shadeColor),shadeOpacity].join()+')'
			;
			
			var ctx = o.canvas.getContext("2d");
			var canvas = {
				width: ctx.canvas.width,
				height: ctx.canvas.height
			};
			//box is the crop rectangle
			var box = {
				width:o.cropWidth,
				height:o.cropHeight,
				current:{x: canvas.width/2 - o.cropWidth/2,y: canvas.height/2 - o.cropHeight/2},
				bounds:{
					left:{
						min: 0,
						max: canvas.width - o.cropWidth
					},
					top:{
						min: 0,
						max: canvas.height - o.cropHeight
					}
				}
			};
			var mouse = {start:{x:0,y:0},end:{x:0,y:0}};
			ctx.canvas.cropTool = {image:image,coords:{x:0,y:0},width:box.width,height:box.height};
			
				//create the initial box
			ctx.strokeStyle = strokeStyle;
			ctx.lineWidth = lineThickness;
			if(useShade){
				ctx.fillStyle = shadeStyle;
				ctx.fillRect(box.width+box.current.x, 0, canvas.width, canvas.height);//right shade
				ctx.fillRect(0, 0, box.current.x, canvas.height);//left shade
				ctx.fillRect(box.current.x, 0, box.width, box.current.y);//top shade
				ctx.fillRect(box.current.x, box.current.y+box.height, box.width, canvas.height);//bottom shade
			}
			ctx.strokeRect(box.current.x+halfLineThickness, box.current.y+halfLineThickness, box.width-lineThickness, box.height-lineThickness,lineThickness);
			
				//when mousedown set the mousemove to start working
			var mouseDown = function(e){
				if(active.mousedown===true){
					active.mousemove=true;
					active.mouseup=true;
					active.mousedown=false;
				}
				mouse.end.x=(e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft();
				mouse.end.y=(e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();
			};
			o.canvas.addEventListener(core.mobile.events.mouse['mousedown'],mouseDown,false);
			
				//on mouse up disable the mousemove and reenable mousedown
			var mouseUp = function(e){
				if(active.mouseup===true){
					active.mousemove=false;
					active.mouseup=false;
					active.mousedown=true;
				}
			};
			o.canvas.addEventListener(core.mobile.events.mouse['mouseup'],mouseUp,false);
			o.canvas.addEventListener(core.mobile.events.mouse['mouseout'],mouseUp,false);
			
				//activated by mousemove.
			var moveRect=function(e){
				if(active.mousemove===false){return;}
				
				//record current mouse pos
				var mousePosX = (e.clientX || e.pageX || e.touches[0].clientX)+ $(window).scrollLeft(),
					mousePosY = (e.clientY || e.pageY || e.touches[0].clientY) + $(window).scrollTop()
				;
				
				//get change in x and change in y
				var cX=mouse.end.x-mousePosX,
					cY=mouse.end.y-mousePosY
				;
				
				mouse.end.x=mousePosX;
				mouse.end.y=mousePosY;
				
				//calculate change in box position (given no other conditions). These are the ACTUAL coordinates of the crop
				var newX = box.current.x-cX,
					newY = box.current.y-cY
				;
				
				//if box would be outside of x-bounds...
				if((newX + box.width) > canvas.width){ 
					newX = box.bounds.left.max; 
					box.current.x = newX; 
				}
				else if(newX < 0){ 
					newX = box.bounds.left.min; 
					box.current.x = newX;
				}
				else{ box.current.x = newX; }
				
				//if box would be outside of y-bounds
				if(newY > canvas.height - box.height ){ 
					newY = box.bounds.top.max;
					box.current.y = newY; 
				}
				else if(newY < 0){ 
					newY = box.bounds.top.min; 
					box.current.y = newY; 
				}
				else{ box.current.y = newY; }
				
				//clear rect, redraw image, redraw moved box
				ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
				ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);
				
				if(useShade){
					ctx.fillRect(box.width+box.current.x, 0, canvas.width, canvas.height);//right shade
					ctx.fillRect(0, 0, box.current.x, canvas.height);//left shade
					ctx.fillRect(box.current.x, 0, box.width, box.current.y);//top shade
					ctx.fillRect(box.current.x, box.current.y+box.height, box.width, canvas.height);//bottom shade
				}
				ctx.strokeRect(newX+halfLineThickness, newY+halfLineThickness, box.width-lineThickness, box.height-lineThickness,lineThickness);
				
				//the data will be saved to the canvas under cropTool
				ctx.canvas.cropTool.coords = {x:box.current.x,y:box.current.y};
				ctx.canvas.cropTool.width = box.width;
				ctx.canvas.cropTool.height = box.height;
			};
			o.canvas.addEventListener(core.mobile.events.mouse['mousemove'],moveRect,false);
			
				//add a cancel function to the canvas that removes all the event listeners.
			//Call with canvas(element).func.cancel();
			canvas.func = {
				cancel: function(){
					o.canvas.removeEventListener(core.mobile.events.mouse['mousemove'],moveRect,false);
					o.canvas.removeEventListener(core.mobile.events.mouse['mousedown'],mouseDown,false);
					o.canvas.removeEventListener(core.mobile.events.mouse['mouseup'],mouseUp,false);
					o.canvas.removeEventListener(core.mobile.events.mouse['mouseout'],mouseUp,false);
					core.deleteElement(canvas);
				}	
			};
			
			//add a method drawTo to canvas.func
			//this method takes an argument 'canvas'. If the argument is not a canvas element, this will first look for a canvas contained within and barring that, it will create one and add it.
			//this method will save the cropped image to this canvas.
			canvas.drawTo = (function(){
				return function(canvas){
					console.log('drawTo');
					if(canvas.tagName.toLowerCase()!=="canvas"){//check for canvas if not an argument
						console.log('argument not a canvas');
						var el = canvas.getElementsByTagName("canvas")[0];
						if(!el){
							el=document.createElement("canvas");
							canvas.appendChild(el);						
						}
						canvas = $(canvas);
						var cW = canvas.width();
						var cH = canvas.height();
						canvas=el;	
					}
					var ctx_temp = canvas.getContext('2d');
					var width = ctx.canvas.cropTool.width;
					var height = ctx.canvas.cropTool.height;
					//console.log('width',width,'height',height);
					var coords = ctx.canvas.cropTool.coords;
					var resizeToWidth = width;
					var resizeToHeight = height;
					if(canvas!==ctx.canvas){//if writing the image crop to the same canvas, do not resize
						canvas.width = (cW?cW:width);
						canvas.height = (cH?cH:height);
						resizeToWidth = canvas.width;
						resizeToHeight = canvas.height;
					}
					//console.log('drawTo',[coords.x, coords.y, width, height, 0, 0, canvas.width, canvas.height]);
					ctx_temp.clearRect(0, 0, ctx_temp.canvas.width, ctx_temp.canvas.height);
					ctx_temp.drawImage(ctx.canvas.cropTool.image, coords.x, coords.y, width, height, 0, 0, resizeToWidth, resizeToHeight);
				};
			}());
			
			canvas.doOnImageLoad = function(func,args){
				if(!Array.isArray(args)) args = [args];
				if(__private.imageReady === true){
					func.apply(canvas,args);
				}
				else{
					__private.onImageLoad.push({func:func,args:args});
				}
			};
			
			__private.onImageLoad = [];
			__private.methods.onImageLoad = function(){
				__private.imageReady = true;
				__private.onImageLoad.forEach(function(obj){
					obj.func.apply(canvas,obj.args);
				});
			};
			image.addEventListener('load',__private.methods.onImageLoad,false);
					
			return canvas;
		}
	};
