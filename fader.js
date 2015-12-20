	//REQUIRES core.js
	console.log('using fader');
	
	core.fader = (function(){
		__factory = {
			animations: {
				suspend: [],
				fadersoptions:{
					transitiontime:2000
				}
			}
		};
		
		__factory.functions = {};
		__factory.functions.intToAlpha = function(i,t){
			if(!t || t=='small'){
				return String.fromCharCode(Number(i)+97);
			}else if(t=='big'){
				return String.fromCharCode(Number(i)+65);
			}
		};
		
		//SUSPENDS ANIMATIONS WHEN PAGE LOSES FOCUS
		document.cb_addEventListener('visibilitychange',function(){
			//console.log('Visibility change: '+document.visibilityState);
			var l=__factory.animations.suspend.length;
			if(document.visibilityState=='hidden'){	
				while(l){
					l--;
					clearInterval(__factory.animations[__factory.animations.suspend[l].name].animation);
				}
			}else{
				while(l){
					l--;
					//console.log('func: '+__factory.animations.suspend[l].func+' timeout: '+__factory.animations.suspend[l].timeout);
					__factory.animations[__factory.animations.suspend[l].name].animation=__factory.animations.suspend[l].timer=setInterval(__factory.animations.suspend[l].func,__factory.animations.suspend[l].timeout);
				}
			}
		});
		
		
		__factory.functions.animateCSS = function(el,totaltime,interval,prop,endAt,name,startAt,unit){//unit is the type of unit used like px or em, defaults to px->Only used it start is given, will be decided by computed style if style is set to auto
			//interval 
			var S,M,perframe,func,animobj;
			if(typeof startAt==='undefined'){startAt=null;}
			if(typeof unit==='undefined'){unit='';}
			if(__factory.animations[name]){clearInterval(__factory.animations[name].animation);el.style[prop]=__factory.animations[name].startAt+__factory.animations[name].unit;}else{__factory.animations[name]={};}
			__factory.animations[name].status='active';
			animobj=__factory.animations[name];
			//check cssText first for property:
			if(startAt===null){
		        if(!el.style[prop]||el.style[prop]=='auto'){S=window.getComputedStyle(el)[prop];}else{S=el.style[prop]||0;}	
		        M=S.match(/^([0-9\.]+)(.*)$/);//Get the numeric part and unit part -- M[1]=numeric,M[2]=units	
		        animobj.propValue=animobj.startAt=Number(M[1]);
		        animobj.unit=M[2]||'';
		    }else{
		        animobj.propValue=animobj.startAt=Number(startAt);
		        animobj.unit=unit||'';
		    }
		    animobj.totaltime=totaltime;
			animobj.actor=el;
			animobj.interval=interval;
		    perframe=(endAt - animobj.propValue)/(totaltime/interval);//THIS WILL BE THE CHANGE PER TRANSITION
			//console.log('endAt:'+endAt+' start:'+animobj.propValue+' for element with classname '+el.className+' using transition of '+perframe);
			func=(function(animobj,perframe,prop,startAt){
		        animobj.frames=animobj.totalframes=Number(animobj.totaltime/animobj.interval);
				var func=function(n){
					animobj.frames--;
					animobj.propValue=startAt + ((Number(animobj.totalframes)-Number(animobj.frames)) * perframe);
		            //console.log('Current: '+animobj.propValue+animobj.unit+' using animobj transition of '+perframe+' for element with classname '+el.className+' for timer '+name+' occurring every '+interval+' ms having '+animobj.frames+' used occurring for '+animobj.totalframes+' total frames');
		            animobj.actor.style[prop]=animobj.propValue+animobj.unit;
		            if(animobj.frames<=0){clearInterval(animobj.animation);animobj.status='complete';}
		        };
		        return func;
		    }(animobj,perframe,prop,animobj.startAt));
		    animobj.animation=setInterval(func,interval);
		};
		
		//APPLIES ONLY TO FADER -- REQUIRES ELEMENT WITH ID=FADER
		var __public = function(args){
			
			/*ARGUMENTS:
				fadeIn - the number of the element to start fading in, defaults to 1 (so the 0th child would be fading out)
				framenav - the ordered tabs that allow user to skip directly to a frame
					{
						active: true/false - turn on frame jump buttons 
						image: path of image to use for tabs. Can be an array to send multiple, which will be used in order.
					 	text:  [none/int/alphasmall/alphabig] none - no text, (default)int - numeric starting from 1, alphasmall - letters starting from a, alphabig - letters starting from A
					}
				prevnext - the buttons to the left and right that allow moving frames forward/backward
					{
						active: true/false - turn on previous & next navigation buttons
						image: Can be array with two image paths such that [leftimagepath,rightimagepath]
						text: array of text to use (default) ['<','>']
					}
				executeOnStart - true/false - activate fade in as soon as function is called.
			*/
			var el=document.getElementById('fader')||{children:[]},
				c=el.children,
				l=c.length,
				current,
				func;
			if(l<2){return;}//no fader for one member
			if(typeof args.fadeIn==='undefined'){args.fadeIn=1;}
			if(typeof framenav==='undefined'){framenav=false;}
		    __factory.animations.fader={'current':args.fadeIn};
		    func=(function(l,c,animobj){ 
		        return function(){            
					var n=animobj.current,o=n-1;
		            if(n>l){n=animobj.current=0;}
					if(n==0){o=l;}
		            c[o].style.position="absolute";
					c[o].style.zIndex=101;
		            c[n].style.position="relative";
					c[n].style.zIndex=100;
		            __factory.functions.animateCSS(c[o],1000,25,'opacity',0.00,'faderout');
		            __factory.functions.animateCSS(c[n],1000,25,'opacity',1.00,'faderin');
		            animobj.current++;
					if(animobj.framenav && animobj.framenav.navigationbuttons){animobj.framenav.navigationbuttons[n].setAttribute('data-nav','selected');animobj.framenav.navigationbuttons[o].setAttribute('data-nav','');}
		        };
		    }(l-1,c,__factory.animations.fader));
			
			__factory.animations.fader.skipTo=(function(c,l,animobj){
				return function(to,from){
					if(typeof from==='undefined'){from=animobj.current-1;}
					if(to>l){to=0;}
					if(to<0){to=l;}
					if(to==from){console.log('Attempt to fade to current member. Dont make no sense!');return;}
					if(__factory.animations['faderin']){
						var f=__factory.animations['faderin'].actor,
						s=__factory.animations['faderin'].status;
					}
					//if in between, reactivate imageFader and change start child to n if n is not currently active
					console.log('from '+from+' to '+to+' was at '+animobj.current);
					if(s==='complete'){
						clearInterval(animobj.animation);
						clearInterval(__factory.animations['faderin'].animation);
						clearInterval(__factory.animations['faderout'].animation);
						if(animobj.framenav && animobj.framenav.navigationbuttons){animobj.framenav.navigationbuttons[to].setAttribute('data-nav','selected');animobj.framenav.navigationbuttons[animobj.current-1].setAttribute('data-nav','');}
						c[from].style.position="absolute";
						c[to].style.position="relative";
						__factory.functions.animateCSS(c[from],1000,25,'opacity',0.00,'faderout');
			            __factory.functions.animateCSS(c[to],1000,25,'opacity',1.00,'faderin');
						animobj.current=(to>l?0:Number(to)+1);
						animobj.animation=setInterval(func,6000);
					}else{
						var n=c[to];
						__factory.animations['faderout'].actor.style.position='absolute';
						f.style.position="absolute";
						f.style.opacity=0;
						if(animobj.framenav && animobj.framenav.navigationbuttons){animobj.framenav.navigationbuttons[to].setAttribute('data-nav','selected');animobj.framenav.navigationbuttons[animobj.current-1].setAttribute('data-nav','');}
						n.style.position="relative";
						__factory.animations['faderin'].actor=n;
						animobj.current=(to>l?0:Number(to)+1);
					}
				;}
			;}(c,l-1,__factory.animations["fader"]));
			
			//********************** SKIP TO FRAME BUTTONS *************************//
			if(args.framenav && args.framenav.active){
				__factory.animations.fader.framenav={};
				//navigation buttons
				var cpanel=document.createElement('DIV'),button,i=0,evt='click',n;
				cpanel.id="fader-cpanel";
				if(typeof args.framenav.text==='undefined'){args.framenav.text='int';}
				if(typeof args.framenav.image==='undefined'){args.framenav.image=[''];}else{args.framenav.image.arrayWalk(function(v){return '<img src="'+v+'"/>';});}
				__factory.animations.fader.framenav.navigationbuttons=[];
				while(i<l){
					button=document.createElement('A');
					button.className="fader-button";
					button.innerHTML=(args.framenav.image[i]||args.framenav.image[0])+(args.framenav.text=='int'?Number(i)+1:(args.framenav.text=='alphasmall'?__factory.functions.intToAlpha(i,'small'):(args.framenav.text=='alphabig'?__factory.functions.intToAlpha(i,'big'):"")))
					__factory.animations.fader.framenav.navigationbuttons.push(button);
					/*
					if(!button.addEventListener){button.addEventListener=button.attachEvent;evt='onclick'}
					button.addEventListener(evt,(function(i){
						var func=function(){
							__factory.animations.fader.skipTo(i);
						};
						return func;
					}(i)),false);
					*/
					button.addEventListener('click',(function(i){
						return function(){
							__factory.animations.fader.skipTo(i);
						};
					}(i)),false);
					cpanel.appendChild(button);
					i++;
				}
				__factory.animations.fader.framenav.navigationbuttons[0].setAttribute('data-nav','selected');
				core.insertAfter(document.getElementById('fader'),cpanel);
			}
			
			//********************** PREV/NEXT BUTTONS *************************//
			if(args.prevnext && args.prevnext.active){
				var scrollpanel=document.createElement('DIV'),butts;
				if(args.prevnext.text){
					if(typeof args.prevnext.text==='string'){args.prevnext.text=[args.prevnext.text,args.prevnext.text];}
					else{args.prevnext.text[1]=args.prevnext.text[1]||args.prevnext.text[0];}
				}else{
					args.prevnext.text=['',''];
				}
				if(args.prevnext.image){
					if(typeof args.prevnext.image==='string'){args.prevnext.image=['<img class="nav-left-img" src="'+args.prevnext.image+'"/>','<img class="nav-right-img" src="'+args.prevnext.image+'"/>'];}
					else{args.prevnext.image[1]='<img class="nav-right-img" src="'+args.prevnext.image[1]+'"/>'||'<img class="nav-right-img" src="'+args.prevnext.image[0]+'"/>';
						args.prevnext.image[0]='<img class="nav-left-img" src="'+args.prevnext.image[0]+'"/>';
					}
				}else{
					args.prevnext.image=['',''];
				}
				scrollpanel.id="scrollpanel";
				scrollpanel.innerHTML='<table style="height:100%;width:100%;position:absolute;"><tbody><tr><td style="vertical-align:middle;"><div class="leftnav" style="float:left;">'+args.prevnext.text[0]+args.prevnext.image[0]+'</div><div class="rightnav" style="float:right;">'+args.prevnext.text[1]+args.prevnext.image[1]+'</div></td></tr></tbody></table>';
				butts=scrollpanel.getElementsByTagName('DIV');
				butts[0].addEventListener('click',function(){__factory.animations["fader"].skipTo(__factory.animations["fader"].current-2);},false);
				butts[1].addEventListener('click',function(){__factory.animations["fader"].skipTo(__factory.animations["fader"].current);},false);
				document.getElementById('fader-cont').appendChild(scrollpanel);
				
			}
			
			//********************** PAUSE BUTTON *************************//
			if(args.pause && args.pause.active){
				var pausebtn=document.createElement('DIV'),pausedBox=document.createElement('DIV'),playingBox=document.createElement('DIV');
				pausebtn.className='pause-fader';
				args.pause.pauseText=args.pause.pauseText||'||';
				args.pause.playText=args.pause.playText||'>';
				args.pause.pauseImage=args.pause.pauseImage||'';
				args.pause.playImage=args.pause.playImage||'';
				pausedBox.innerHTML=args.pause.pauseText+args.pause.pauseImage;
				playBox.innerHTML=args.pause.playText+args.pause.playImage;
				pausebtn.appendChild(pausedBox);
				pausebtn.appendChild(playBox);
				pausebtn.addEventListener('click',function(){
						__factory.animations.suspend.push({'name':'fader','timer':__factory.animations.fader.animation,'func':func,'timeout':4000});
				},false);
				document.getElementById('fader-cont').appendChild('pausebtn');		
			}
			
			__factory.animations.fader.animation=setInterval(func,6000);
			__factory.animations.suspend.push({'name':'fader','timer':__factory.animations.fader.animation,'func':func,'timeout':4000});
		};
		
		return __public;
	}());

	//INITIALIZE FADER
	core.testLoaded(function(){
		core.fader({
			fadeIn:1,
			framenav:{active:true,text:'none',text:'int'},
			executeOnStart:false,
			prevnext:{active:true,image:['/images/universal/nav_arrow_left.png','/images/universal/nav_arrow_right.png']}
		});
	},'document');
