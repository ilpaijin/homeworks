
function vkDomClass()
{
	this.loadCallbacks = new Array();
	this.unloadCallbacks = new Array();
	this.loadFirst = true;
	this.unloadFirst = true;
	this.loaded = false;
	this.loadIE = null;
}

vkDomClass.prototype.onLoad = function(callback)
{
	this.loadCallbacks[this.loadCallbacks.length] = callback;

	if(this.loadFirst)
	{
		this.loadFirst = false;

		if(document.readyState === 'complete')
		{
			setTimeout(function()
			{
				vkDom._setLoaded()
			},1);
		}
		else if(document.addEventListener)
		{
			var eventCallback = function()
			{
				vkDom._setLoaded();
				document.removeEventListener('DOMContentLoaded',eventCallback,false);
				window.removeEventListener('load',eventCallback,false);
			};

			document.addEventListener('DOMContentLoaded',eventCallback,false);
			window.addEventListener('load',eventCallback,false);
		}
		else if(document.attachEvent)
		{
			var IEHackTimer = null;

			var eventCallback = function()
			{
				if(document.readyState==='complete')
				{
					cleanup();
					vkDom._setLoaded();
				}
			};

			function cleanup()
			{
				clearTimeout(IEHackTimer);

				document.detachEvent('onreadystatechange',eventCallback);
				window.detachEvent('onload',eventCallback);
			}

			document.attachEvent('onreadystatechange',eventCallback);
			window.attachEvent('onload',eventCallback);

			var toplevel;
			
			try
			{
				toplevel = window.frameElement==null;
			}
			catch(e)
			{

			}

			if(document.documentElement.doScroll&&toplevel)
			{
				(function(){
					try
					{
						document.documentElement.doScroll('left');
					}
					catch(e)
					{
						return(IEHackTimer = setTimeout(arguments.callee,50));
					}
					cleanup();

					vkDom._setLoaded();
				})();
			}
		}
		else
		{
			(function(){
				if(document.getElementsByTagName('body') != null)
					vkDom._setLoaded();
				else
					setTimeout(arguments.callee,50);
			})();
		}
	}
	else if(this.loaded)
		vkDom._setLoaded();
};

vkDomClass.prototype._setLoaded = function()
{
	this.loaded = true;

	var i;

	for(i=0;i<this.loadCallbacks.length;i++)
	{
		if(!document.body)
			return;

		this.loadCallbacks[i]();
	}
	this.loadCallbacks = new Array();
};

vkDomClass.prototype.onUnload = function(callback)
{
	this.unloadCallbacks[this.unloadCallbacks.length] = callback;

	if(this.unloadFirst)
	{
		if(window.attachEvent)
			window.attachEvent('onunload',function(){
				vkDom._onUnload();
			});
		else
			window.onunload = function()
			{
				vkDom._onUnload();
			};

		this.unloadFirst=false;
	}
}

vkDomClass.prototype._onUnload = function()
{
	var i;

	for(i=0;i<this.unloadCallbacks.length;i++) this.unloadCallbacks[i]();
	this.unloadCallbacks = new Array();
}

vkDomClass.prototype.html = function(str)
{
	str = ''+str;

	str = str.replace(/&/g,'&amp;');
	str = str.replace(/\"/g,'&quot;');
	str = str.replace(/</g,'&lt;');
	return str.replace(/>/g,'&gt;');
}

vkDomClass.prototype.nl2br = function(str)
{
	str = ''+str;
	return str.replace(/\n/g,'<br />');
}

vkDomClass.prototype.htmlbr = function(str)
{
	return this.nl2br(this.html(str));
}

vkDomClass.prototype.js = function(str)
{
	str = ''+str;

	str = str.replace(/\'/g,'\\\'');
	return str;
}

vkDomClass.prototype.uri = function(str)
{
	return encodeURIComponent(str);
}

vkDomClass.prototype.el = function(id)
{
	if(typeof(id) == 'string')
		return document.getElementById(id);
	else if(typeof(id) == 'object')
		return id;
	else
		return null;
}

vkDomClass.prototype.visibility = function(id)
{
	var el = this.el(id);

	if(!el)
		return;

	if(arguments.length == 2 && !arguments[1])
		el.style.visibility='hidden';
	else
		el.style.visibility='visible';
}

vkDomClass.prototype.display = function(id)
{
	var el = this.el(id);

	if(!el)
		return;
	if(arguments.length>1)
	{
		if(typeof(arguments[1]) == 'string')
			el.style.display = arguments[1];
		else if(arguments[1])
			el.style.display='';
		else
			el.style.display = 'none';
	}
	else
		el.style.display='';
}

vkDomClass.prototype.value = function(id)
{
	var el = this.el(id);

	if(el)
		return el.value;
	return null;
}

vkDomClass.prototype.enable = function(id)
{
	var el = this.el(id);

	if(el)
		el.disabled =  !(arguments.length < 2 || arguments[1]);
}

vkDomClass.prototype.disable = function(id)
{
	var el = this.el(id);

	if(el)
		el.disabled=true;
}

vkDomClass.prototype.focus = function(id)
{
	var el=this.el(id);
	if(el && !el.disabled)
		el.focus();
}

vkDomClass.prototype.select = function(id)
{
	var el=this.el(id);
	if(el&&!el.disabled)
	{
		el.focus();
		el.select();
	}
}

vkDomClass.prototype.clean = function(id)
{
	var el=this.el(id);
	if(el)
	{
		while(el.firstChild)
			el.removeChild(el.firstChild);
	}
}

vkDomClass.prototype.setHtml = function(id,html)
{var el=this.el(id);if(el)
el.innerHTML=html;}
vkDomClass.prototype.setText = function(id,text)
{var el=this.el(id);if(el)
el.innerHTML=this.html(text);}
vkDomClass.prototype.setTextBr = function(id,text)
{var el=this.el(id);if(el)
el.innerHTML=this.htmlbr(text);}
vkDomClass.prototype.setFormValue = function(id,value)
{var i,el=this.el(id);if(!el)
return;switch(el.tagName)
{case'INPUT':switch(el.getAttribute('type').toUpperCase())
{case'TEXT':case'PASSWORD':case'HIDDEN':if(typeof(value)!='string'&&typeof(value)!='number')
value='';el.value=value;break;case'CHECKBOX':case'RADIO':el.checked=value?true:false;break;}
break;case'TEXTAREA':if(typeof(value)!='string'&&typeof(value)!='number')
value='';el.value=value;break;case'SELECT':if(el.selectedIndex>=0)
{el.selectedIndex=0;if(typeof(value)=='string'||typeof(value)=='number')
{for(i=0;i<el.options.length;i++)
{if(el.options[i].value==value)
{el.selectedIndex=i;return;}}}}}}
vkDomClass.prototype.getFormValue = function(id)
{var i,el=this.el(id);if(!el)
return null;switch(el.tagName)
{case'INPUT':switch(el.getAttribute('type').toUpperCase())
{case'TEXT':case'PASSWORD':case'HIDDEN':return el.value;case'CHECKBOX':case'RADIO':return el.checked;default:return null;}
case'TEXTAREA':return el.value;case'SELECT':if(el.selectedIndex<0)
return null;return el.options[el.selectedIndex].value;default:return null;}}
vkDomClass.prototype.listClass = function(id)
{var el=this.el(id);if(!el)
return null;return el.className.split(/\s+/);}
vkDomClass.prototype.hasClass = function(id,name)
{var el=this.el(id);var cls;if(!el)
return false;cls=this.listClass(id);for(var i=0;i<cls.length;i++)
{if(cls[i]==name)
return true;}
return false;}
vkDomClass.prototype.addClass = function(id,name)
{var el=this.el(id);var cls;if(!el||this.hasClass(id,name))
return;el.className=el.className.length?(el.className+' '+name):name;}
vkDomClass.prototype.removeClass = function(id,name)
{var el=this.el(id);var oldCls,newCls;if(!el)
return;oldCls=this.listClass(id);newCls=[];for(var i=0;i<oldCls.length;i++)
{if(oldCls[i]!=name)
newCls[newCls.length]=oldCls[i];}
if(newCls.length)
el.className=newCls.join(' ');else
el.className='';}
vkDomClass.prototype.getAbsolutePosition = function(el)
{el=this.el(el);if(!el)
return{x:0,y:0};var r={x:el.offsetLeft-el.scrollLeft,y:el.offsetTop-el.scrollTop};if(el.offsetParent)
{var tmp=this.getAbsolutePosition(el.offsetParent);r.x+=tmp.x;r.y+=tmp.y;}
return r;}
vkDomClass.prototype.setCookie = function(name,value,seconds,path,domain)
{var str;if(seconds)
{var expiryDate=new Date();expiryDate.setTime(expiryDate.getTime()+seconds*1000);str=name+'='+encodeURIComponent(value)+'; expires='+expiryDate.toGMTString();}
else
str=name+'='+encodeURIComponent(value);if(path)
str+='; path='+path;if(domain)
str+='; domain='+domain;document.cookie=str;}
vkDomClass.prototype.setSessionCookie = function(name,value,path,domain)
{this.setCookie(name,value,0,path,domain);}
vkDomClass.prototype.getCookie = function(name)
{var i,search,parts;search=name+'=';parts=document.cookie.split('; ');for(i=0;i<parts.length;i++)
{if(parts[i].indexOf(search)==0)
return unescape(parts[i].substring(search.length));}
if(arguments.length>1)
return arguments[1];return null;}
vkDomClass.prototype.removeCookie = function(name,path,domain)
{this.setCookie(name,'',-1,path,domain);}

var vkDom = new vkDomClass();