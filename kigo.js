function vkDebug()
{
	this.container = null
	this.log = null;
	this.buttons = null;
	this.enabled=false;}
vkDebug.prototype.enable = function()
{if(arguments.length>0&&!arguments[0])
this.enabled=false;else
this.enabled=true;}
vkDebug.prototype.text = function(string)
{if(this.enabled)
{this._init();if(typeof(string)!='string')
{if(typeof(string)=='number')
string=''+string;else if(string==null)
string='null';else if(typeof(string)=='object')
string=string.toString();else
return;}
string=string.split('\n');for(var i=0;i<string.length;i++)
{this.log.appendChild(document.createTextNode(string[i].replace(new RegExp('^\t','g'),'    ').replace(new RegExp('^[\\s]','g'),'\u00a0')));this.log.appendChild(document.createElement('br'));}
this.log.scrollTop=this.log.scrollHeight;}}

vkDebug.prototype.html = function(string)
{if(this.enabled)
this._write(string+'<br />');}

vkDebug.prototype.domtree = function(element,skiptext)
{if(this.enabled)
{this._init();this._domtree(element,skiptext,0);this.log.scrollTop=this.log.scrollHeight;}}

vkDebug.prototype._domtree = function(node,skiptext,depth)
{var i,str;str='+ ';switch(node.nodeType)
{case 1:str+='ELEMENT_NODE [1] ['+node.tagName+']';if(node.id)
str+=' #'+node.id;if(node.attributes)
{for(i=0;i<node.attributes.length;i++)
str+=' ('+node.attributes[i].name+')';}
break;case 2:str=null;break;case 3:if(!skiptext)
str+='TEXT_NODE [3]';else
str=null;break;case 4:if(!skiptext)
str+='CDATA_SECTION_NODE [4]';else
str=null;break;case 5:str+='ENTITY_REFERENCE_NODE [5]';break;case 6:str+='ENTITY_NODE [6]';break;case 7:str+='PROCESSING_INSTRUCTION_NODE [7]';break;case 8:if(!skiptext)
str+='COMMENT_NODE [8]';else
str=null;break;case 9:str+='DOCUMENT_NODE [9]';break;case 10:str+='DOCUMENT_TYPE_NODE [10]';break;case 11:str+='DOCUMENT_FRAGMENT_NODE [11]';break;case 12:str+='NOTATION_NODE [12]';break;default:str+='UNKNOWN_TYPE ['+node.nodeType+']';}
if(str!=null)
{var spacer='';for(i=0;i<depth*2;i++)
spacer+='\u00a0';this.log.appendChild(document.createTextNode(spacer+str));this.log.appendChild(document.createElement('br'));}
if(node.nodeType==1&&node.tagName=='DIV'&&node.className=='vkDebug')
return;if(node.hasChildNodes())
{depth++;for(i=0;i<node.childNodes.length;i++)
this._domtree(node.childNodes[i],skiptext,depth)}}
vkDebug.prototype._write = function(string)
{this._init();this.log.innerHTML+=string;this.log.scrollTop=this.log.scrollHeight;}
vkDebug.prototype._init = function()
{if(!this.log)
{this._getParams();this.container=document.createElement('div');this.container.className='vkDebug';this.log=document.createElement('div');this.log.className='log';this.log.style.width=this.width+'px';this.log.style.height=this.height+'px';this.container.appendChild(this.log);document.body.appendChild(this.container);this._updatePosition();var self=this;if(window.addEventListener)
{window.addEventListener('resize',function(){self._updatePosition()},false);window.addEventListener('scroll',function(){self._updatePosition()},false);}
else if(window.attachEvent)
{window.attachEvent('onresize',function(){self._updatePosition()});window.attachEvent('onscroll',function(){self._updatePosition()});}}
this.container.style.display='block';}

vkDebug.prototype._getParams = function()
{var cookie,parts;this.width=null;this.height=null;this.position=null;cookie=vkDom.getCookie('vkDebug');if(cookie)
{parts=cookie.split('|');if(parts.length==3)
{this.width=parseInt(parts[0]);this.height=parseInt(parts[1]);this.position=parseInt(parts[2]);}}
if(this.width==null)
{this.width=400;this.height=50;this.position=1;}
this._normalizeParams();}

vkDebug.prototype._updateParams = function()
{vkDom.setCookie('vkDebug',this.width+'|'+this.height+'|'+this.position,7*24*60*60);}

vkDebug.prototype._normalizeParams = function()
{if(this.width<300)
this.width=300;else if(this.width>2000)
this.width=2000;if(this.height<100)
this.height=100;else if(this.height>2000)
this.height=2000;if(this.position<1||this.position>4)
this.position=1;}

vkDebug.prototype._updatePosition = function()
{var x,y;function createButton(text,action)
{var button;button=document.createElement('button');button.innerHTML=vkDom.html(text);button.onclick = function(){return action();};return button;}
if(this.buttons)
this.container.removeChild(this.buttons);else
{var self=this;this.buttons=document.createElement('div');this.buttons.className='buttons';this.buttons.style.width=this.width+'px';function setpos()
{self.position++;self._normalizeParams();self._updateParams();self._updatePosition();return false;}

function resize(width,more)
{if(width)
{if(more)
self.width+=50;else
self.width-=50;}
else
{if(more)
self.height+=50;else
self.height-=50;}
self._normalizeParams();self._updateParams();self.log.style.width=self.width+'px';self.log.style.height=self.height+'px';self.buttons.style.width=self.width+'px';self._updatePosition();return false;}
this.buttons.appendChild(createButton('Hide',function(){self.container.style.display='none';}));this.buttons.appendChild(createButton('Pos',function(){setpos();}));this.buttons.appendChild(createButton('W -',function(){resize(true,false);}));this.buttons.appendChild(createButton('W +',function(){resize(true,true);}));this.buttons.appendChild(createButton('H -',function(){resize(false,false);}));this.buttons.appendChild(createButton('H +',function(){resize(false,true);}));this.buttons.appendChild(createButton('Clear',function(){vkDom.clean(self.log);}));}
switch(this.position)
{case 1:this.buttons.style.textAlign='left';this.container.insertBefore(this.buttons,this.container.firstChild);x=0;y=0;break;case 2:this.buttons.style.textAlign='right';this.container.insertBefore(this.buttons,this.container.firstChild);x=Math.max(document.documentElement.scrollLeft,document.body.scrollLeft)+document.documentElement.clientWidth-this.container.clientWidth;y=0;break;case 3:this.buttons.style.textAlign='right';this.container.appendChild(this.buttons);x=Math.max(document.documentElement.scrollLeft,document.body.scrollLeft)+document.documentElement.clientWidth-this.container.clientWidth;y=Math.max(document.documentElement.scrollTop,document.body.scrollTop)+document.documentElement.clientHeight-this.container.clientHeight;break;case 4:this.buttons.style.textAlign='left';this.container.appendChild(this.buttons);x=0;y=Math.max(document.documentElement.scrollTop,document.body.scrollTop)+document.documentElement.clientHeight-this.container.clientHeight;break;}
this.container.style.left=x+'px';this.container.style.top=y+'px';}

function vkFormMonitor()
{this.els=new Array();this.values=new Array();this.callback=null;this.period=0;this.debug=null;}

vkFormMonitor.prototype.enableDebug = function(debug)
{if(debug==null||(typeof(debug)=='object'&&debug.constructor==vkDebug))
{this.debug=debug;return true;}
this.debug=null;return false;}
vkFormMonitor.prototype.disableDebug = function()
{return this.enableDebug(null);}
vkFormMonitor.prototype.addElement = function(el)
{this.els[this.els.length]=el;this.values[this.values.length]=null;}
vkFormMonitor.prototype.add = function()
{for(var i=0;i<arguments.length;i++)
this.addElement(arguments[i]);}
vkFormMonitor.prototype.reset = function()
{this.callback=null;this.els.length=0;this.values.length=0;}
vkFormMonitor.prototype.sync = function()
{this.checkAndSync();}
vkFormMonitor.prototype.monitor = function(callback,period)
{this.checkAndSync();if(this.callback==null)
{var self=this;setTimeout(function()
{self.checkForChanges()},period);}
this.callback=callback;this.period=period;}
vkFormMonitor.prototype.stop = function()
{this.callback=null;}
vkFormMonitor.prototype.writeDebug = function(text)
{if(this.debug)
this.debug.text('vkFormMonitor: '+text);}
vkFormMonitor.prototype.getValueByIndex = function(i)
{return vkDom.getFormValue(this.els[i]);}
vkFormMonitor.prototype.findElement = function(el)
{var i;for(i=0;i<this.els.length;i++)
{if(this.els[i]==el)
return i;}
return-1;}
vkFormMonitor.prototype.checkAndSync = function()
{var i,val,changed=false;for(i=0;i<this.els.length;i++)
{val=this.getValueByIndex(i);if(this.values[i]!=val)
{changed=true;this.values[i]=val;}}
return changed;}
vkFormMonitor.prototype.checkForChanges = function()
{var changed;if(this.callback==null)
return;if(this.checkAndSync()&&this.callback!=null)
{this.writeDebug('detected changes');this.callback();}
if(this.callback!=null)
{var self=this;setTimeout(function()
{self.checkForChanges();},this.period);}}

function vkJSONRemote()
{this.xmlRequest=null;this.aborted=false;this.currentTimeout=null;this.debug=null;}
vkJSONRemote.prototype.enableDebug = function(debug)
{if(debug==null||(typeof(debug)=='object'&&debug['enable']!='undefined'&&typeof(debug.enable)=='function'))
{this.debug=debug;return true;}
this.debug=null;return false;}
vkJSONRemote.prototype.disableDebug = function()
{return this.enableDebug(null);}
vkJSONRemote.prototype.get = function(url,timeout)
{var self=this;if(!this._prepare())
return false;if(timeout!==undefined)
this.currentTimeout=window.setTimeout(function(){self._onTimeout();},timeout);this.xmlRequest.open('GET',url);this.xmlRequest.setRequestHeader('Content-Type','text/plain; charset=UTF-8')
this.xmlRequest.onreadystatechange = function()
{if(self.aborted)
return;switch(self.xmlRequest.readyState)
{case 3:self.onLoading();break;case 4:self._onLoad();break;case 0:case 1:case 2:default:}}
this.xmlRequest.send(null);return true;}
vkJSONRemote.prototype.post = function(url,data,timeout)
{var self=this;if(!this._prepare())
return false;if(timeout!==undefined)
this.currentTimeout=window.setTimeout(function(){self._onTimeout()},timeout);this.xmlRequest.open('POST',url);this.xmlRequest.setRequestHeader('Content-Type','text/plain; charset=UTF-8')
this.xmlRequest.onreadystatechange = function()
{if(self.aborted)
return;switch(self.xmlRequest.readyState)
{case 3:self.onLoading();break;case 4:self._onLoad();break;case 0:case 1:case 2:default:}}
var json;if(data==null)
json=null;else
{try
{json=JSON.stringify(data,function(k,v){return v===''?'':v});}
catch(e)
{if(this.debug)
{this._writeDebug('========== vkJSONRemote ==========');this._writeDebug('EVENT: Failed building JSON string');this._writeDebug('ERROR NAME: '+e.name);this._writeDebug('ERROR MESSAGE:');this._writeDebug('----------------------------------');this._writeDebug(e.message);this._writeDebug('==================================');}
return false;}}
this.xmlRequest.send(json);return true;}
vkJSONRemote.prototype.abort = function()
{this.aborted=true;if(this.currentTimeout)
{clearTimeout(this.currentTimeout);this.currentTimeout=null;}}
vkJSONRemote.prototype.free = function()
{this.abort();if(this.xmlRequest&&typeof(this.xmlRequest.abort)=='function')
this.xmlRequest.abort();this.xmlRequest=null;}
vkJSONRemote.prototype.onLoading = function()
{}
vkJSONRemote.prototype.onLoad = function(httpStatus,result)
{}
vkJSONRemote.prototype.onTimeout = function()
{}
vkJSONRemote.prototype._prepare = function()
{this.free();try
{if(!window.XMLHttpRequest)
{if(document.all&&window.ActiveXObject)
{try
{this.xmlRequest=new ActiveXObject('Msxml2.XMLHTTP');}
catch(e1)
{try
{this.xmlRequest=new ActiveXObject('Microsoft.XMLHTTP');}
catch(e2)
{throw'vkJSONRemote: Browser lacks XMLHttpRequest support';}}}
else
throw'vkJSONRemote: Browser lacks XMLHttpRequest support';}
else
this.xmlRequest=new XMLHttpRequest();}
catch(e0)
{return false;}
this.aborted=false;this.currentTimeout=null;return true;}
vkJSONRemote.prototype._writeDebug = function(text)
{if(this.debug)
this.debug.text(text);}
vkJSONRemote.prototype._onLoad = function()
{var status,result;this.abort();status=this.xmlRequest.status;if(this.debug)
{this._writeDebug('========== vkJSONRemote ==========');this._writeDebug('EVENT: Received reply');this._writeDebug('HTTP STATUS: '+status);this._writeDebug('DATA:');this._writeDebug('----------------------------------');this._writeDebug(this.xmlRequest.responseText);this._writeDebug('==================================');}
if(status==200)
{var xmlObject,nodeList;if((xmlObject=this.xmlRequest.responseXML)&&(nodeList=xmlObject.getElementsByTagName('JSON'))&&nodeList.length==1&&nodeList[0].firstChild)
{var i,value='';for(i=0;i<nodeList[0].childNodes.length;i++)
value+=nodeList[0].childNodes[i].nodeValue;try
{eval('result='+value);}
catch(e)
{if(this.debug)
{this._writeDebug('========== vkJSONRemote ==========');this._writeDebug('EVENT: Failed parsing JSON reply');this._writeDebug('ERROR NAME: '+e.name);this._writeDebug('ERROR MESSAGE:');this._writeDebug('----------------------------------');this._writeDebug(e.message);this._writeDebug('==================================');}
result=null;}}
else
result=null;}
else
result=null;this.onLoad(status,result);}
vkJSONRemote.prototype._onTimeout = function()
{this.free();if(this.debug)
{this._writeDebug('========== vkJSONRemote ==========');this._writeDebug('EVENT: Request timed out');this._writeDebug('==================================');}
this.onTimeout();}
if(!this.JSON){this.JSON={};}
(function(){function f(n){return n<10?'0'+n:n;}
if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON = function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON = function(key){return this.valueOf();};}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
if(typeof rep==='function'){value=rep.call(holder,key,value);}
switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
v=partial.length===0?'[]':gap?'[\n'+gap+
partial.join(',\n'+gap)+'\n'+
mind+']':'['+partial.join(',')+']';gap=mind;return v;}
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==='string'){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+
mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
if(typeof JSON.stringify!=='function'){JSON.stringify = function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
return str('',{'':value});};}
if(typeof JSON.parse!=='function'){JSON.parse = function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
throw new SyntaxError('JSON.parse');};}}());

function vkXMLRemote()
{this.xmlRequest=null;this.aborted=false;this.currentTimeout=null;this.debug=null;}
vkXMLRemote.prototype.enableDebug = function(debug)
{if(debug==null||(typeof(debug)=='object'&&debug.constructor==vkDebug))
{this.debug=debug;return true;}
this.debug=null;return false;}
vkXMLRemote.prototype.disableDebug = function()
{return this.enableDebug(null);}
vkXMLRemote.prototype.get = function(url,timeout)
{var self=this;if(!this._prepare())
return false;if(timeout!==undefined)
this.currentTimeout=window.setTimeout(function(){self._onTimeout();},timeout);this.xmlRequest.open('GET',url);this.xmlRequest.setRequestHeader('Content-Type','text/plain; charset=UTF-8')
this.xmlRequest.onreadystatechange = function()
{if(self.aborted)
return;switch(self.xmlRequest.readyState)
{case 3:self.onLoading();break;case 4:self._onLoad();break;case 0:case 1:case 2:default:}}
this.xmlRequest.send(null);return true;}
vkXMLRemote.prototype.abort = function()
{this.aborted=true;if(this.currentTimeout)
{clearTimeout(this.currentTimeout);this.currentTimeout=null;}}
vkXMLRemote.prototype.free = function()
{this.abort();if(this.xmlRequest&&typeof(this.xmlRequest.abort)=='function')
this.xmlRequest.abort();this.xmlRequest=null;}
vkXMLRemote.prototype.onLoading = function()
{}
vkXMLRemote.prototype.onLoad = function(httpStatus,result)
{}
vkXMLRemote.prototype.onTimeout = function()
{}
vkXMLRemote.prototype._prepare = function()
{this.free();try
{if(!window.XMLHttpRequest)
{if(document.all&&window.ActiveXObject)
{try
{this.xmlRequest=new ActiveXObject('Msxml2.XMLHTTP');}
catch(e1)
{try
{this.xmlRequest=new ActiveXObject('Microsoft.XMLHTTP');}
catch(e2)
{throw'vkXMLRemote: Browser lacks XMLHttpRequest support';}}}
else
throw'vkXMLRemote: Browser lacks XMLHttpRequest support';}
else
this.xmlRequest=new XMLHttpRequest();}
catch(e0)
{return false;}
this.aborted=false;this.currentTimeout=null;return true;}
vkXMLRemote.prototype._writeDebug = function(text)
{if(this.debug)
this.debug.text(text);}
vkXMLRemote.prototype._onLoad = function()
{var status,result;this.abort();status=this.xmlRequest.status;if(this.debug)
{this._writeDebug('=========== vkXMLRemote ==========');this._writeDebug('EVENT: Received reply');this._writeDebug('HTTP STATUS: '+status);this._writeDebug('DATA:');this._writeDebug('----------------------------------');this._writeDebug(this.xmlRequest.responseText);this._writeDebug('==================================');}
if(status==200&&this.xmlRequest.responseXML)
result=this.xmlRequest.responseXML;else
result=null;this.onLoad(status,result);}
vkXMLRemote.prototype._onTimeout = function()
{this.free();if(this.debug)
{this._writeDebug('=========== vkXMLRemote ==========');this._writeDebug('EVENT: Request timed out');this._writeDebug('==================================');}
this.onTimeout();}

function vkPopupClass()
{this.bg=null;this.currentPopup=null;this.currentModal=null;this.currentModalIsLocal=null;this.currentModalIframe=null;this.currentModalBody=null;this.currentPopupCloseCallback=null;this.disabledControls={'body':null,'modal':null};this.hiddenControls={'body':null,'modal':null};this.deactivatedControls={'body':null,'modal':null};this.prevElId=0;this.eventListeners={'popup_open':[],'popup_close':[],'modal_open':[],'modal_close':[]};this.iconPath='/img/popup/';this.langs={'FR':{'OK':'OK','CANCEL':'Annuler','YES':'Oui','NO':'Non'},'EN':{'OK':'OK','CANCEL':'Cancel','YES':'Yes','NO':'No'}}
this.currentLang=this.langs.EN;this.zIndexBase=10000;if(window.addEventListener)
{window.addEventListener('resize',function(){vkPopup.__reposition()},false);window.addEventListener('scroll',function(){vkPopup.__reposition()},false);}
else if(window.attachEvent)
{window.attachEvent('onresize',function(){vkPopup.__reposition()});window.attachEvent('onscroll',function(){vkPopup.__reposition()});}
var icons=['info','warn','err','wait','question','ok'];this.preloadedImages=new Array;for(var i=0;i<icons.length;i++)
{this.preloadedImages[i]=new Image();this.preloadedImages[i].src=this._iconUrl(icons[i]);}}
vkPopupClass.prototype.setIconPath = function(path)
{if(typeof(path)!='string')
return false;this.iconPath=path;if(path.substring(-1,1)!='/')
this.iconPath+='/';return true;}
vkPopupClass.prototype.setLang = function(lang)
{if(typeof(lang)!='string'||!this.langs[(lang=lang.toUpperCase())])
return false;this.currentLang=this.langs[lang];return true;}
vkPopupClass.prototype.setZIndexBase = function(base)
{if(typeof(base)!='number')
return false;this.zIndexBase=parseInt(base);return true;}
vkPopupClass.prototype.addEventListener = function(event,callback)
{if(typeof(event)!='string'||!this.eventListeners[event]||typeof(callback)!='function')
return false;this.eventListeners[event][this.eventListeners[event].length]=callback;return true;}
vkPopupClass.prototype.message = function(title,text,icon,callback)
{var focusBtnId=this._genId();this._createPopup(title,text,icon,'<button type="button" id="'+focusBtnId+'" onclick="vkPopup._closePopup(true, null);">'+vkDom.html(this.currentLang.OK)+'</button>',focusBtnId,callback);}
vkPopupClass.prototype.status = function(title,text,icon,cancelCallback)
{var buttons,focusBtnId;if(cancelCallback)
{focusBtnId=this._genId();buttons='<button type="button" id="'+focusBtnId+'" onclick="vkPopup._closePopup(true, null);">'+vkDom.html(this.currentLang.CANCEL)+'</button>';}
else
{focusBtnId=null;buttons=null;}
this._createPopup(title,text,icon,buttons,focusBtnId,cancelCallback);}
vkPopupClass.prototype.yesno = function(title,text,icon,callback,defaultYes)
{var yesBtnId=this._genId();var noBtnId=this._genId();this._createPopup(title,text,icon,'<button type="button" id="'+yesBtnId+'" onclick="vkPopup._closePopup(true, true);">'+vkDom.html(this.currentLang.YES)+'</button>'+'<button type="button" id="'+noBtnId+'" onclick="vkPopup._closePopup(true, false);">'+vkDom.html(this.currentLang.NO)+'</button>',(defaultYes?yesBtnId:noBtnId),callback);}
vkPopupClass.prototype.closePopup = function()
{this._closePopup(false);}
vkPopupClass.prototype.isPopupOpen = function()
{return this.currentPopup?true:false;}
vkPopupClass.prototype.modal = function(title,url,width,height)
{if(this.currentPopup||this.currentModal)
return false;this.disabledControls.body=[];this.hiddenControls.body=[];this.deactivatedControls.body=[];this._disableControls(document.body,this.disabledControls.body,this.hiddenControls.body,this.deactivatedControls.body);this._getBg();this._setBgPosition();this.bg.style.zIndex=this.zIndexBase+1;this.bg.style.display='block';var modalBody,iconUrl;var iframeId=this._genId();modalBody='<table class="vkPopupModal">';if(typeof(title)=='string'&&title.length)
modalBody+='<thead class="vkPopupModal">'+'<tr class="vkPopupModal">'+'<td class="vkPopupModal">'+vkDom.html(title)+'</td>'+'</tr>'+'</thead>';modalBody+='<tbody class="vkPopupModal">'+'<tr class="vkPopupModal">'+'<td class="vkPopupModal"><iframe id="'+iframeId+'" src="'+vkDom.html(url)+'" width="'+parseInt(width)+'" height="'+parseInt(height)+'" style="visibility: hidden;"></iframe></td>'+'</tr>'+'</tbody>'+'</table>';this.currentModal=document.createElement('div');this.currentModal.className='vkPopupModal';this.currentModal.style.zIndex=this.zIndexBase+2;this.currentModal.style.visibility='hidden';this.currentModal.innerHTML=modalBody;document.body.appendChild(this.currentModal);this.currentModalIsLocal=false;this.currentModalIframe=vkDom.el(iframeId);this.currentModalBody=null;this._setModalPosition();this.currentModal.style.visibility='visible';this._dispatchEvent('modal_open');return true;}
vkPopupClass.prototype.localModal = function(title,width,height)
{if(this.currentPopup||this.currentModal)
return null;this.disabledControls.body=[];this.hiddenControls.body=[];this.deactivatedControls.body=[];this._disableControls(document.body,this.disabledControls.body,this.hiddenControls.body,this.deactivatedControls.body);this._getBg();this._setBgPosition();this.bg.style.zIndex=this.zIndexBase+1;this.bg.style.display='block';var modalBody,iconUrl;var containerId=this._genId();modalBody='<table class="vkPopupModal">';if(typeof(title)=='string'&&title.length)
modalBody+='<thead class="vkPopupModal">'+'<tr class="vkPopupModal">'+'<td class="vkPopupModal">'+vkDom.html(title)+'</td>'+'</tr>'+'</thead>';modalBody+='<tbody class="vkPopupModal">'+'<tr class="vkPopupModal">'+'<td class="vkPopupModal"><div id="'+containerId+'" style="width: '+parseInt(width)+'px; height: '+parseInt(height)+'px;"></div></td>'+'</tr>'+'</tbody>'+'</table>';this.currentModal=document.createElement('div');this.currentModal.className='vkPopupModal';this.currentModal.style.zIndex=this.zIndexBase+2;this.currentModal.style.visibility='hidden';this.currentModal.innerHTML=modalBody;document.body.appendChild(this.currentModal);this.currentModalIsLocal=true;this.currentModalIframe=null;this.currentModalBody=vkDom.el(containerId);this._setModalPosition();this.currentModal.style.visibility='visible';this._dispatchEvent('modal_open');return this.currentModalBody;}
vkPopupClass.prototype.closeModal = function()
{this._closeModal();}
vkPopupClass.prototype.isModalOpen = function()
{return this.currentModal?true:false;}
vkPopupClass.prototype.__reposition = function()
{if(!vkDom.hasClass(document.body,'ua_os-ios')&&(this.currentPopup||this.currentModal))
{this.bg.style.width='0px';this.bg.style.height='0px';this._setPopupPosition();this._setModalPosition();this._setBgPosition();}}
vkPopupClass.prototype.__modalReady = function(body)
{if(!this.currentModal||this.currentModalIsLocal||this.currentModalBody==body)
return;this.currentModalBody=body;this.currentModalIframe.style.visibility='visible';if(this.currentPopup)
{this.disabledControls.modal=[];this.hiddenControls.modal=[];this.deactivatedControls.modal=[];this._disableControls(this.currentModalBody,this.disabledControls.modal,this.hiddenControls.modal,this.deactivatedControls.modal);}}
vkPopupClass.prototype._createPopup = function(title,text,icon,buttons,focusItem,closeCallback)
{this._closePopup(false);if(this.currentModal)
{this.disabledControls.modal=[];this.hiddenControls.modal=[];this.deactivatedControls.modal=[];if(this.currentModalIsLocal)
this._disableControls(this.currentModal,this.disabledControls.modal,this.hiddenControls.modal,this.deactivatedControls.modal);else
{if(this.currentModalBody)
this._disableControls(this.currentModalBody,this.disabledControls.modal,this.hiddenControls.modal,this.deactivatedControls.modal);}
this.bg.style.zIndex=this.zIndexBase+3;}
else
{this.disabledControls.body=[];this.hiddenControls.body=[];this.deactivatedControls.body=[];this._disableControls(document.body,this.disabledControls.body,this.hiddenControls.body,this.deactivatedControls.body);this._getBg();this._setBgPosition();this.bg.style.zIndex=this.zIndexBase+3;this.bg.style.display='block';}
this.currentPopupCloseCallback=closeCallback;var popupBody,iconUrl;popupBody='<table>';if(typeof(title)=='string'&&title.length)
popupBody+='<thead>'+'<tr>'+'<td colspan="2">'+vkDom.html(title)+'</td>'+'</tr>'+'</thead>';popupBody+='<tbody>'+'<tr>';if((iconUrl=this._iconUrl(icon))==null)
popupBody+='<td colspan="2">'+vkDom.nl2br(vkDom.html(text))+'</td>';else
popupBody+='<td class="icon"><img src="'+iconUrl+'" /></td>'+'<td>'+vkDom.nl2br(vkDom.html(text))+'</td>';popupBody+='</tr>';if(buttons!=null)
popupBody+='<tr>'+'<td class="buttons" colspan="2">'+buttons+'</td>'+'</tr>';popupBody+='</tbody>'+'</table>';this.currentPopup=document.createElement('div');this.currentPopup.className='vkPopup';this.currentPopup.style.zIndex=this.zIndexBase+4;this.currentPopup.style.visibility='hidden';this.currentPopup.innerHTML=popupBody;document.body.appendChild(this.currentPopup);this._setPopupPosition();this.currentPopup.style.visibility='visible';if(focusItem)
vkDom.focus(focusItem);this._dispatchEvent('popup_open');}
vkPopupClass.prototype._closePopup = function(fireCallback,callbackParam)
{if(!this.currentPopup)
return;this.currentPopup.parentNode.removeChild(this.currentPopup);this.currentPopup=null;if(this.currentModal)
{this._enableControls(this.disabledControls.modal,this.hiddenControls.modal,this.deactivatedControls.modal);this.bg.style.zIndex=this.zIndexBase+1;}
else
{this.bg.style.display='none';this._enableControls(this.disabledControls.body,this.hiddenControls.body,this.deactivatedControls.body);this.disabledControls.modal=null;this.hiddenControls.modal=null;this.deactivatedControls.modal=null;}
this._dispatchEvent('popup_close');if(fireCallback&&typeof(this.currentPopupCloseCallback)=='function')
this.currentPopupCloseCallback(callbackParam);}
vkPopupClass.prototype._closeModal = function()
{if(!this.currentModal)
return;this.currentModal.parentNode.removeChild(this.currentModal);this.currentModal=null;this.currentModalIframe=null;this.currentModalBody=null;this.disabledControls.modal=null;this.hiddenControls.modal=null;this.deactivatedControls.modal=null;if(this.currentPopup)
this.bg.style.zIndex=this.zIndexBase+3;else
{this.bg.style.display='none';this._enableControls(this.disabledControls.body,this.hiddenControls.body,this.deactivatedControls.body);this.disabledControls.modal=null;this.hiddenControls.modal=null;this.deactivatedControls.modal=null;}
this._dispatchEvent('modal_close');}
vkPopupClass.prototype._getBg = function()
{if(!this.bg)
{this.bg=document.createElement('div');this.bg.className='vkPopupBg';this.bg.style.display='none';document.body.appendChild(this.bg);}}
vkPopupClass.prototype._setBgPosition = function()
{this.bg.style.width=Math.max(document.documentElement.clientWidth,document.documentElement.scrollWidth)+'px';this.bg.style.height=Math.max(document.documentElement.clientHeight,document.documentElement.scrollHeight)+'px';}
vkPopupClass.prototype._setPopupPosition = function()
{if(this.currentPopup)
{this.currentPopup.style.left=(Math.max(document.documentElement.scrollLeft,document.body.scrollLeft)+((document.documentElement.clientWidth-this.currentPopup.clientWidth)>>1))+'px';this.currentPopup.style.top=(Math.max(document.documentElement.scrollTop,document.body.scrollTop)+((document.documentElement.clientHeight-this.currentPopup.clientHeight)>>1))+'px';}}
vkPopupClass.prototype._setModalPosition = function()
{if(this.currentModal)
{this.currentModal.style.left=(Math.max(document.documentElement.scrollLeft,document.body.scrollLeft)+((document.documentElement.clientWidth-this.currentModal.clientWidth)>>1))+'px';this.currentModal.style.top=(Math.max(document.documentElement.scrollTop,document.body.scrollTop)+((document.documentElement.clientHeight-this.currentModal.clientHeight)>>1))+'px';}}
vkPopupClass.prototype._enableControls = function(disabled,hidden,deactivated)
{var i;if(hidden!=null)
{for(i=0;i<hidden.length;i++)
{if(hidden[i])
hidden[i].style.visibility='visible';}}
if(disabled!=null)
{for(i=0;i<disabled.length;i++)
{if(disabled[i])
disabled[i].disabled=false;}}
if(deactivated!=null)
{for(i=0;i<deactivated.length;i++)
{if(deactivated[i].object)
deactivated[i].object.onclick=deactivated[i].onclick;}}}
vkPopupClass.prototype._disableControls = function(node,disabled,hidden,deactivated)
{var i,list;list=node.getElementsByTagName('input');for(i=0;i<list.length;i++)
{if(list[i].type!='HIDDEN'&&!list[i].disabled)
{list[i].disabled=true;disabled[disabled.length]=list[i];}}
list=node.getElementsByTagName('textarea');for(i=0;i<list.length;i++)
{if(!list[i].disabled)
{list[i].disabled=true;disabled[disabled.length]=list[i];}}
list=node.getElementsByTagName('select');for(i=0;i<list.length;i++)
{if(!list[i].disabled)
{list[i].disabled=true;disabled[disabled.length]=list[i];}
if(/msie|MSIE 6/.test(navigator.userAgent)&&list[i].style.visibility!='hidden')
{list[i].style.visibility='hidden';hidden[hidden.length]=list[i];}}
list=node.getElementsByTagName('button');for(i=0;i<list.length;i++)
{if(!list[i].disabled)
{list[i].disabled=true;disabled[disabled.length]=list[i];}}
function returnFalse()
{kigoDebug.text('Intercepting link');return false;}
list=node.getElementsByTagName('a');for(i=0;i<list.length;i++)
{if(!list[i].disabled)
{list[i].disabled=true;disabled[disabled.length]=list[i];}
deactivated[deactivated.length]={'object':list[i],'onclick':list[i].onclick?list[i].onclick:null}
list[i].onclick=returnFalse;}}
vkPopupClass.prototype._dispatchEvent = function(event)
{for(var i=0;i<this.eventListeners[event].length;i++)
this.eventListeners[event][i]();}
vkPopupClass.prototype._genId = function()
{return'vkPopupEl'+(++this.prevElId);}
vkPopupClass.prototype._iconUrl = function(icon)
{if(typeof(icon)!='string')
return null;switch(icon)
{case'info':return this.iconPath+'Info.png';case'warn':case'warning':return this.iconPath+'Warning.png';case'err':case'error':return this.iconPath+'Error.png';case'wait':return this.iconPath+'Gear.png';case'question':case'ask':return this.iconPath+'Question.png';case'ok':case'success':return this.iconPath+'Good.png';}
return null;}
var vkPopup=new vkPopupClass();

function vkModalClass()
{vkDom.onLoad(function()
{try{if(window.parent&&window.parent.vkPopup&&window.parent.vkPopup.__modalReady)
window.parent.vkPopup.__modalReady(document.body);}catch(err){}});vkDom.onUnload(function()
{try{if(window.parent&&window.parent.vkPopup)
{window.parent.vkPopup.disabledControls.modal=null;window.parent.vkPopup.hiddenControls.modal=null;}}catch(err){}});}
vkModalClass.prototype.opener = function()
{return window.parent;}
vkModalClass.prototype.message = function(title,text,icon,callback)
{window.parent.vkPopup.message(title,text,icon,callback);}
vkModalClass.prototype.status = function(title,text,icon,cancelCallback)
{window.parent.vkPopup.status(title,text,icon,cancelCallback);}
vkModalClass.prototype.yesno = function(title,text,icon,callback,defaultYes)
{window.parent.vkPopup.yesno(title,text,icon,callback,defaultYes);}
vkModalClass.prototype.closePopup = function()
{window.parent.vkPopup.closePopup();}
vkModalClass.prototype.isPopupOpen = function()
{window.parent.vkPopup.isPopupOpen();}
vkModalClass.prototype.close = function()
{window.parent.vkPopup.closeModal();}
var vkModal=new vkModalClass();

function vkUserIdleMonitor()
{var self=this;this.defaultCallback=(arguments.length&&typeof(arguments[0])=='function')?arguments[0]:null;this.defaultPeriod=(arguments.length>1&&typeof(arguments[1])=='number')?parseInt(arguments[1]):null;this.currentCallback=null;this.currentPeriod=null;this.timer=null;this.activityDetected=false;this.activityCallback=null;function eventDetected()
{self.activityDetected=true;}
var events=['mousemove','mousedown','mouseup','keydown','keyup','mousewheel','mousemultiwheel','scroll','resize'];for(var i=0;i<events.length;i++)
{if(window.addEventListener)
window.addEventListener(events[i],eventDetected,false);else if(window.attachEvent)
window.attachEvent('on'+events[i],eventDetected);}
setInterval(function()
{if(self.activityDetected&&self.timer!=null)
{self.resume();if(typeof(self.activityCallback)=='function')
self.activityCallback(self);}},999);}
vkUserIdleMonitor.prototype.monitor = function()
{var self=this;this.activityDetected=false;this.stop();if(arguments.length==2&&typeof(arguments[0])=='function'&&typeof(arguments[1])=='number')
{this.currentCallback=arguments[0];this.currentPeriod=parseInt(arguments[1]);}
else if(arguments.length==1&&typeof(arguments[0])=='function')
{this.currentCallback=arguments[0];this.currentPeriod=this.defaultPeriod;}
else if(arguments.length==1&&typeof(arguments[0])=='number')
{this.currentCallback=this.defaultCallback;this.currentPeriod=parseInt(arguments[0]);}
else if(!arguments.length)
{this.currentCallback=this.defaultCallback;this.currentPeriod=this.defaultPeriod;}
if(this.currentCallback!=null&&this.currentPeriod!=null&&this.currentPeriod>0)
{this.timer=setTimeout(function()
{if(self.stop())
self.currentCallback(self);},this.currentPeriod*1000);return true;}
return false;}
vkUserIdleMonitor.prototype.stop = function()
{if(this.timer!=null)
{clearTimeout(this.timer);this.timer=null;return true;}
return false;}
vkUserIdleMonitor.prototype.resume = function()
{return this.monitor(this.currentCallback,this.currentPeriod);}

var kigo = {
	'CFG':{},
	'CONST':{},
	'toString':function(string)
	{
		if(string==null)
			return'';

		switch(typeof(string))
		{
			case'string':
				return string;
			case'number':
				return ''+string;
			case'boolean':
				return string ? 'true' : 'false';
			case'function':
				return '';
			case'object':
				if(typeof(string['toString']) == 'function' && typeof(string = string.toString()) == 'string')
					return string;
				return'';
			case'undefined':
			default:
				return'';
		}
	},
	'isset':function(v)
	{
		return(typeof(v) == 'undefined' || v==null) ? false : true;
	},
	'is_function':function(f)
	{
		return typeof(f) == 'function' ? true : false;
	},
	'is_null':function(n)
	{
		return(typeof(n)=='object' && n==null) ? true : false;
	},
	'is_array':function(a)
	{
		return(a != null && typeof(a) == 'object' && typeof(a['length']) == 'number' && typeof(a['concat']) == 'function'&&typeof(a['join'])=='function'&&typeof(a['pop'])=='function'&&typeof(a['push'])=='function'&&typeof(a['reverse'])=='function'&&typeof(a['shift'])=='function'&&typeof(a['slice'])=='function'&&typeof(a['splice'])=='function'&&typeof(a['sort'])=='function'&&typeof(a['toString'])=='function'&&typeof(a['unshift'])=='function'&&typeof(a['valueOf'])=='function');
	},
	'in_array':function(value,arr)
	{
		if(!this.is_array(arr) || !arr.length)
			return false;

		if(arguments.length > 2 && arguments[2])
		{
			for(var i=0;i < arr.length;i++)
			{
				if(arr[i] === value)
					return true;
			}
		}
		else
		{
			for(var i=0; i < arr.length; i++)
			{
				if(arr[i] == value)
					return true;
			}
		}
		return false;
	},
	'is_string':function(s)
	{
		return typeof(s) == 'string';
	},
	'is_object':function(o)
	{
		return typeof(o) == 'object' && o != null && !kigo.is_array(o);
	},
	'is_number':function(n)
	{
		return typeof(n) == 'number';
	},
	'is_int':function(i)
	{
		return typeof(i) == 'number' && ''+i == ''+this.intval(i);
	},
	'is_bool':function(b)
	{
		return typeof(b) == 'boolean';
	},
	'intval':function(value)
	{
		switch(typeof(value))
		{
			case'number':
				if(isNaN(value = parseInt(Math.round(value),10)))
					return 0;
				return value;
			case'string':
				if(isNaN(value = parseInt(this.trim(value),10)))
					return 0;
				return value;
			case'boolean':
				return value ? 1 : 0;
			case'object':
			case'function':
			default:
				return 0;
		}
	},
	'floatval':function(value)
	{
		switch(typeof(value))
		{
			case'number':
				if(isNaN(value=parseFloat(value)))
					return 0.0;
				return value;
			case'string':
				if(isNaN(value=parseFloat(this.trim(value))))
					return 0.0;
				return value;
			case'boolean':
				return value ? 1.0 : 0.0;
			case'object':
			case'function':
			default:
				return 0.0;
		}
	},
	'binlen':function(bin)
	{
		var len = 0;

		bin = encodeURI(this.toString(bin));

		for(var i=0;i<bin.length;)
		{
			++len;
			i+ = (bin[i]==='%' ? 3 : 1);
		}
		return len;
	},
	'trim':function(string)
	{
		if(!(string = this.toString(string)).length)
			return'';
		string = string.replace(new RegExp('^[\x20\x09\x0A\x0D\x00\x0B]+','g'),'');
		return string.replace(new RegExp('[\x20\x09\x0A\x0D\x00\x0B]+$','g'),'');
	},
	'substr':function(string,start)
	{
		var length,
			total;

		if((length = arguments.length > 2 ? this.intval(arguments[2]) : null) == 0 || !(total = (string = this.toString(string)).length))
			return'';
		if((start=this.intval(start))>=0)
		{
			if(start>=total)
				return'';
		}
		else if((start+=total)<0)
			start=0;
		if(length==null)
			return string.substr(start);
		if(length>0)
			return string.substr(start,length);
		return string.substr(start,total-start+length);
	},
	'str_repeat':function(text,multiplier)
{var ret='';multiplier=Math.max(0,kigo.intval(multiplier));for(var i=0;i<multiplier;i++)
ret+=text;return ret;},'strpos':function(str,findme)
{for(var i=(arguments.length>2?arguments[2]:0);i<=str.length-findme.length;i++)
{if(this.substr(str,i,findme.length)==findme)
return i;}
return null;},'strrpos':function(str,findme)
{var offset=arguments.length>2?arguments[2]:0;if(offset>0)
str=this.substr(str,offset);else if(offset<0)
{str=this.substr(str,0,offset);offset=0;}
for(var i=str.length-findme.length;i>=0;i--)
{if(this.substr(str,i,findme.length)==findme)
return i+offset;}
return null;},'strlen':function(str)
{return kigo.toString(str).length;},'strtoupper':function(str)
{return this.toString(str).toUpperCase();},'strtolower':function(str)
{return this.toString(str).toLowerCase();},'strcmp':function(a,b)
{return(a=kigo.toString(a))===(b=kigo.toString(b))?0:(a>b?1:-1);},'strcasecmp':function(a,b)
{return(a=kigo.strtolower(a))===(b=kigo.strtolower(b))?0:(a>b?1:-1);},'explode':function(delimiter,str)
{var limit=arguments.length>2?this.intval(arguments[2]):null;if(!(delimiter=this.toString(delimiter)).length)
return false;if(this.strpos(str=this.toString(str),delimiter)===false)
return(limit!==null&&limit<0)?[]:[str];str=str.split(delimiter);if(limit===null)
return str;if(limit<0)
{if((limit=-limit)>str.length)
return[];str.splice(str.length-limit,limit);return str;}
if(!limit)
limit=1;if(str.length>limit)
{for(var i=limit;i<str.length;i++)
str[limit-1]+=delimiter+str[i];str.splice(limit,str.length-limit);}
return str;},'implode':function()
{var glue,pieces,result;if(arguments.length===1)
{if(!this.is_array(pieces=arguments[0]))
return null;return pieces.join('');}
if(arguments.length===2)
{glue=this.toString(arguments[0]);if(!this.is_array(pieces=arguments[1]))
return null;result='';for(var i=0;i<pieces.length;++i)
result+=(i?glue:'')+this.toString(pieces[i]);return result;}
return null;},'coalesce':function()
{for(var i=0;i<arguments.length;i++)
{if(arguments[i]!==null&&arguments[i]!==undefined)
return arguments[i];}
return null;},'rawurlencode':function(str)
{return encodeURIComponent(str);},'text2html':function(text)
{return kigoDom.create('div').append(text).domNode().innerHTML;},'html2text':function(html)
{var tmp=kigoDom.create('div');tmp.domNode().innerHTML=html;return tmp.domNode().innerText||tmp.domNode().textContent||'';},'array_merge':function()
{var res=[];for(var i=0;i<arguments.length;i++)
{if(!this.is_array(arguments[i]))
throw'kigo::array_merge(): invalid arguments';for(var j=0;j<arguments[i].length;j++)
res.push(arguments[i][j]);}
return res;},'object_merge':function()
{var res={};for(var i=0;i<arguments.length;i++)
{(new kigoAssoc(arguments[i])).forEach(function(key,value)
{res[key]=value;});}
return res;},'abs':function(value)
{return Math.abs(value);},'ceil':function(value)
{return Math.ceil(value);},'floor':function(value)
{return Math.floor(value);},'round':function(value)
{var negative=value<0.0;if(arguments.length<2||!arguments[1])
return(negative?-1:1)*Math.round(Math.abs(value));var multiplier=Math.pow(10,arguments[1]);return(negative?-1:1)*(Math.round(Math.abs(value)*multiplier)/multiplier);},'getScroll':function()
{return Math.max(document.body.scrollTop,document.documentElement.scrollTop);},'setScroll':function(scroll)
{document.body.scrollTop=scroll;document.documentElement.scrollTop=scroll;},'base64_encode':function(input)
{function utf_encode(string){string=string.replace(/\r\n/g,'\n');var utftext='';for(var n=0;n<string.length;n++){var c=string.charCodeAt(n);if(c<128){utftext+=String.fromCharCode(c);}
else if((c>127)&&(c<2048)){utftext+=String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128);}
else{utftext+=String.fromCharCode((c>>12)|224);utftext+=String.fromCharCode(((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128);}}
return utftext;}
var output='';var chr1,chr2,chr3,enc1,enc2,enc3,enc4;var i=0;var keyStr='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';input=utf_encode(input);while(i<input.length){chr1=input.charCodeAt(i++);chr2=input.charCodeAt(i++);chr3=input.charCodeAt(i++);enc1=chr1>>2;enc2=((chr1&3)<<4)|(chr2>>4);enc3=((chr2&15)<<2)|(chr3>>6);enc4=chr3&63;if(isNaN(chr2)){enc3=enc4=64;}else if(isNaN(chr3)){enc4=64;}
output=output+
keyStr.charAt(enc1)+
keyStr.charAt(enc2)+
keyStr.charAt(enc3)+
keyStr.charAt(enc4);}
return output;},'base64_decode':function(input)
{function utf8_decode(utftext)
{var string='';var i=0;var c=c1=c2=0;while(i<utftext.length){c=utftext.charCodeAt(i);if(c<128){string+=String.fromCharCode(c);i++;}
else if((c>191)&&(c<224)){c2=utftext.charCodeAt(i+1);string+=String.fromCharCode(((c&31)<<6)|(c2&63));i+=2;}
else{c2=utftext.charCodeAt(i+1);c3=utftext.charCodeAt(i+2);string+=String.fromCharCode(((c&15)<<12)|((c2&63)<<6)|(c3&63));i+=3;}}
return string;}
var keyStr='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';var output='';var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,'');while(i<input.length){enc1=keyStr.indexOf(input.charAt(i++));enc2=keyStr.indexOf(input.charAt(i++));enc3=keyStr.indexOf(input.charAt(i++));enc4=keyStr.indexOf(input.charAt(i++));chr1=(enc1<<2)|(enc2>>4);chr2=((enc2&15)<<4)|(enc3>>2);chr3=((enc3&3)<<6)|enc4;output=output+String.fromCharCode(chr1);if(enc3!=64){output=output+String.fromCharCode(chr2);}
if(enc4!=64){output=output+String.fromCharCode(chr3);}}
output=utf8_decode(output);return output;}};

if(window.location.hash.length && window.location.hash != '#')
	window.location.hash = window.location.hash;

var kigoFront = {
	'user':null,
	'mainCallback':new kigoCallback(null),
	'urlParam':'',
	'liveMenuSelectCallback':new kigoCallback(null),
	'months_short':function()
	{
		return new kigoAssoc().set(1,'Jan').set(2,'Feb').set(3,'Mar').set(4,'Apr').set(5,'May').set(6,'Jun').set(7,'Jul').set(8,'Aug').set(9,'Sep').set(10,'Oct').set(11,'Nov').set(12,'Dec');
	},
	'months_full':function()
	{
		return new kigoAssoc().set(1,'January').set(2,'February').set(3,'March').set(4,'April').set(5,'May').set(6,'June').set(7,'July').set(8,'August').set(9,'September').set(10,'October').set(11,'November').set(12,'December');
	},
	'main':function(mainCallback)
	{
		if(this.mainCallback.defined())
			throw'Cannot redeclare main()';

		this.mainCallback = new kigoCallback(mainCallback);

		if(this.init === null)
			this.mainCallback.invoke(this.urlParam);
	},
	'init':function()
	{
		var self = this;
		var body = kigoDom.getBody();

		kigoDebug.enable(kigo.CFG.APP.VKDEBUG_ENABLE);
		kigoPopup.zIndexBase = 510;

		if((body.hasClass('app')||body.hasClass('corp'))&&body.hasClass('page')&&kigo.intval(kigoCookie.get('OBSOLETE_BROWSER_WARN',0))<10)
{var obsoleteBrowsers={'ua-msie-6':'Internet Explorer 6','ua-msie-7':'Internet Explorer 7'};(new kigoAssoc(obsoleteBrowsers)).any(function(browser,name)
{if(body.hasClass(browser))
{var appHeader=new kigoDom('appheader').orphanize();var global=new kigoDom('global').orphanize();body.append(appHeader,kigoDom.create('div',{'id':'obsolete_browser'}).append(name+' is not supported by Kigo.',kigoDom.create('br'),'Some of the features might not work correctly.',kigoDom.create('br'),kigoDom.create('a',{'href':'#'},null,{'click':function(){kigoZendesk.supportCenter('compatibility');return false;}}).append('Learn more')),global);kigoCookie.set('OBSOLETE_BROWSER_WARN',kigo.intval(kigoCookie.get('OBSOLETE_BROWSER_WARN',0))+1);return true;}
return false;});}
if(body.hasClass('app')&&body.hasClass('page'))
{function singleLoginSetup(accountType,cookieName,userId)
{kigoCookie.set(cookieName,userId);var interval=setInterval(function()
{if(kigoCookie.get(cookieName)!=userId)
{kigoPopup.warn('Account logged out','This '+accountType+' account is logged out.\n'+'\n'+'Only one '+accountType+' account can be open at a time.',function(){kigoFront.goLogout();});clearInterval(interval);}},950);}
if(this.user.isRa())
singleLoginSetup('rental agency','_CURRENT_RA',this.user.id());else if(this.user.isOwner())
singleLoginSetup('owner','_CURRENT_OWNER',this.user.id());}
var quickSearchInput;var quickSearchDefaultText;var tmp;if(body.hasClass('page'))
{var appHeader=new kigoDom('appheader');var menuItems=new kigoList();var currentItem=null;var relativeUrl=kigo.substr(window.location.pathname,kigo.strrpos(window.location.pathname,'/')+1);var queryString=window.location.search;if(body.hasClass('app'))
{quickSearchDefaultText='Reservation search';function quickSearch(text)
{self.ifNoChanges(function()
{kigoCookie.set('QUICK_SEARCH',text);self.goTo('search.php?'+kigo.rawurlencode(text));});}
appHeader.empty().append((this.user.isRa()||this.user.isOwner())?manageAppTickers():null,kigoDom.create('div',{'id':'apptitle'}).append(kigoDom.create('div',{'id':'appuser'}).append(kigoDom.create('span',{'class':'search_box'}).append(quickSearchInput=kigoDom.create('input',{'type':'text','maxLength':30,'value':(tmp=kigoCookie.get('QUICK_SEARCH','')).length?tmp:quickSearchDefaultText,'placeholder':quickSearchDefaultText},null,{'focus':function()
{if(this.value==quickSearchDefaultText)
this.value='';this.select();},'blur':function()
{if(kigo.trim(this.value)=='')
this.value=quickSearchDefaultText;},'keydown':function(ev)
{var tmp;if((ev||(ev=window.event))&&(typeof(ev['keyCode'])!='undefined'&&ev.keyCode==13)&&(this.value=tmp=kigo.trim(this.value)).length)
{quickSearch(tmp);return false;}}})),kigoDom.create('span',{'class':'search_button'},{'display':'block'}).append(kigoDom.create('a',{'href':'#','title':'Search'},null,{'click':function()
{var tmp;if((tmp=kigo.trim(quickSearchInput.domNode().value)).length&&tmp!=quickSearchDefaultText)
quickSearch(tmp);return false;}})),kigoDom.create('span',{'class':'logout'}).append(kigoDom.create('a',{'href':'logout.php','title':'Log out'}).append('Log out')),tmp=kigoDom.create('span',{'class':'separator'}).append('|'),(this.user.isRa()?[kigoDom.create('span',{'class':'report'}).append(kigoDom.create('a',{'href':'#','title':'Report a problem'},null,{'click':function(){kigoZendesk.submitTicket();return false;}}).append('Report a problem')),tmp.clone(),kigoDom.create('span',{'class':'userguide'}).append(kigoDom.create('a',{'href':'#','title':'Support center'},null,{'click':function(){kigoZendesk.supportCenter();return false;}}).append('Get help')),tmp.clone()]:null),kigoDom.create('span',{'class':'account'}).append(kigoDom.create('a',{'href':'myaccount.php','title':'My Account'}).append(kigo.is_string(this.user.displayName())?this.user.displayName():'My Account'))),kigoDom.create('span',{'class':'logo'}).append(kigoDom.create('a',{'href':'calendars.php'}).append('Kigo'))));if(this.user.isRa()||this.user.isOwner())
{var notificationRefreshInterval=40000;var notificationRetryInterval=60000;var notificationInvisibleRetryInterval=750;var notificationItems=new kigoList();var notificationTimer=null;var notificationInProgress=false;var notificationLast=0;this.refreshNotifications = function()
{var force=!(arguments.length&&!arguments[0]);if(notificationInProgress||!notificationItems.length())
return;if(notificationTimer!==null)
{clearTimeout(notificationTimer);notificationTimer=null;}
if(notificationLast+(3*notificationRefreshInterval)<(new Date()).getTime())
clear();else
notificationItems.forEach(function(item){item.dom.addClass('loading');});if(!force)
{try
{if(kigoDom.getById('appmenu').domNode().getBoundingClientRect().bottom<0)
return reschedule(notificationInvisibleRetryInterval);}
catch(e){}}
notificationInProgress=true;new kigoAjaxRequest3('FrontMenu/notifications',force,{'loading':false,'on_timeout':function(){clear();reschedule(notificationRetryInterval);},'on_error':function(){clear();reschedule(notificationRetryInterval);},'on_reply':function(reply)
{if(!kigo.is_object(reply))
return false;reply=new kigoAssoc(reply);notificationItems.forEach(function(item)
{var value=reply.get(item.id,'');item.dom.empty().removeClass('loading');if(kigo.is_string(value)&&kigo.strlen(value))
item.dom.addClass('notification').append(value);else
item.dom.removeClass('notification');});notificationLast=(new Date()).getTime();reschedule(notificationRefreshInterval);return true;}});function reschedule(interval)
{notificationInProgress=false;notificationTimer=setTimeout(function(){kigoFront.refreshNotifications(false);},interval);}
function clear()
{notificationItems.forEach(function(item){item.dom.empty().removeClass('notification').removeClass('loading');});}};this.selectLiveMenu = function(live)
{if(currentItem!==null)
{currentItem.h5.removeClass('selected');currentItem=null;}
menuItems.any(function(item)
{if(item.live!==null&&item.live==live&&item.url==relativeUrl&&(item.qs===null||item.qs==queryString))
{(currentItem=item).h5.addClass('selected');return true;}
return false;});};var keepaliveInterval=600000;var keepaliveRetryInterval=60000;var keepaliveTimer=null;(function sendKeepalive()
{if(keepaliveTimer===null)
return reschedule(keepaliveInterval);new kigoAjaxRequest3('FrontMenu/keepalive',null,{'loading':false,'on_timeout':function(){reschedule(keepaliveRetryInterval);},'on_error':function(){reschedule(keepaliveRetryInterval);},'on_reply':function(reply)
{reschedule(keepaliveInterval);return true;}});function reschedule(interval)
{keepaliveTimer=setTimeout(sendKeepalive,interval);}})();function addMenuItem(label,url,qs,live,notificationId)
{var fullUrl=url+kigo.coalesce(qs,(kigo.is_string(live)?'?'+live:null),'');var notificationDom=null;if(notificationId!==null)
{notificationItems.add({'id':notificationId,'dom':(notificationDom=kigoDom.create('span'))});}
var item={'url':url,'qs':qs,'live':live,'h5':kigoDom.create('h5',(live===null&&url==relativeUrl&&kigo.coalesce(qs,'')==queryString)?{'class':'selected'}:null).append(kigoDom.create('a',{'href':fullUrl,'title':label},null,{'click':function()
{if(live!==null&&url==relativeUrl&&kigo.coalesce(qs,'')==queryString)
{item.h5.getByTagName('a',0).domNode().blur();if(self.liveMenuSelectCallback.defined())
self.liveMenuSelectCallback.invoke(live);}
else
self.ifNoChanges(function(){self.goTo(fullUrl);});return false;}}).append(label),notificationDom)};menuItems.add(item);return item.h5;}
if(this.user.isRa())
{appHeader.append(kigoDom.create('div',{'id':'appmenu'}).append(kigoDom.create('div',{'class':'group first e-1'}).append(kigoDom.create('h4').append('Dashboard'),addMenuItem('Overview','overview.php','',null,null),addMenuItem('Calendars','calendars.php','',null,null),addMenuItem('Check-in/out','cio.php',null,null,null),addMenuItem('Transactions','ws_ob_transactions.php',null,null,'WS_OB_TRANSACTIONS'),null),kigoDom.create('div',{'class':'group middle e-2'}).append(kigoDom.create('h4').append('Reservations'),addMenuItem('Inquiries','reservations.php',null,'INQUIRY','RES_INQUIRIES'),addMenuItem('Hold dates','reservations.php',null,'HOLD','RES_HOLD'),addMenuItem('Confirmed','reservations.php',null,'CONFIRMED','RES_CONFIRMED'),addMenuItem('Canceled','reservations.php',null,'CANCELED','RES_CANCELED'),null),kigoDom.create('div',{'class':'group middle e-3'}).append(kigoDom.create('h4').append('Reports'),addMenuItem('Performance','report_performance.php',null,null,null),addMenuItem('Channels','report_channels.php',null,null,null),addMenuItem('Reservations','report_reservations.php',null,null,null),addMenuItem('Statistics','report_statistics.php',null,null,null),null),kigoDom.create('div',{'class':'group middle e-4'}).append(kigoDom.create('h4').append('Websites'),addMenuItem('Domain names','ws_domains.php',null,null,null),this.user.websiteList().map(function(website){return addMenuItem(website.WEBSITE_NAME,'ws.php','?'+website.WEBSITE_ID,null,null);}),null),kigoDom.create('div',{'class':'group middle e-5'}).append(kigoDom.create('h4').append('Channel manager'),addMenuItem('Directory','directory.php',null,null,null),addMenuItem('My partners','rrc.php',null,null,'RRC_INCOMING_COUNT')),kigoDom.create('div',{'class':'group last e-6'}).append(kigoDom.create('h4').append('Setup'),addMenuItem('Owners','owners.php',null,null,'ORC_INCOMING_COUNT'),addMenuItem('Properties','properties.php',null,null,null),addMenuItem('Email templates','res_email_templates.php',null,null,null),addMenuItem('Email inquiry import','email_inquiry_import.php',null,null,null),null),kigoDom.create('div',{'class':'clear'})));}
else if(this.user.isOwner())
{appHeader.append(kigoDom.create('div',{'id':'appmenu'}).append(kigoDom.create('div',{'class':'group first e-1'}).append(kigoDom.create('h4').append('Dashboard'),addMenuItem('Calendars','calendars.php','',null,null),addMenuItem('Check-in/out','cio.php',null,null,null),addMenuItem('Payments','ri_payments.php',null,null,null),null),kigoDom.create('div',{'class':'group middle e-2'}).append(kigoDom.create('h4').append('Reservations'),addMenuItem('Inquiries','reservations.php',null,'INQUIRY','RES_INQUIRIES'),addMenuItem('Hold dates','reservations.php',null,'HOLD','RES_HOLD'),addMenuItem('Confirmed','reservations.php',null,'CONFIRMED','RES_CONFIRMED'),addMenuItem('Canceled','reservations.php',null,'CANCELED','RES_CANCELED'),null),kigoDom.create('div',{'class':'group middle e-3'}).append(kigoDom.create('h4').append('Reports'),addMenuItem('Monthly','ri_monthly.php',null,null,null),addMenuItem('Annual','ri_annual.php',null,null,null),addMenuItem('Per agency','ri_per_ra.php',null,null,null),addMenuItem('Per guest country','ri_per_country.php',null,null,null),null),kigoDom.create('div',{'class':'group last e-4'}).append(kigoDom.create('h4').append('Setup'),addMenuItem('My Properties','properties.php',null,null,null),(this.user.isMyAgenciesGuiEnabled()||this.user.getRaId()?(this.user.isMyAgenciesGuiEnabled()?addMenuItem('My Agencies','ra.php',null,null,'ORC_INCOMING_COUNT'):kigoTooltip.register(addMenuItem('My Agencies','ra.php',null,null,'ORC_INCOMING_COUNT'),['Not available from owner\'s account.'],'sw')):null),addMenuItem('My Pages','ownerpages.php',null,null,null),addMenuItem('Email templates','res_email_templates.php',null,null,null),null),kigoDom.create('div',{'class':'clear'})));}
this.refreshNotifications();}}
else if(body.hasClass('bo'))
{this.selectLiveMenu = function(live)
{if(currentItem!==null)
{currentItem.h5.removeClass('selected');currentItem=null;}
menuItems.any(function(item)
{if(item.live!==null&&item.live==live&&item.url==relativeUrl)
{(currentItem=item).h5.addClass('selected');return true;}
return false;});};function addBOMenuItem(label,url,live)
{var fullUrl=url+(kigo.is_string(live)?'?'+live:'');var item={'url':url,'live':live,'h5':kigoDom.create('h5',(live===null&&url===relativeUrl)?{'class':'selected'}:null).append(kigoDom.create('a',{'href':fullUrl,'title':label},null,{'click':function()
{if(live!==null&&url===relativeUrl)
{item.h5.getByTagName('a',0).domNode().blur();if(self.liveMenuSelectCallback.defined())
self.liveMenuSelectCallback.invoke(live);}
else
self.ifNoChanges(function(){self.goTo(fullUrl);});return false;}}).append(label))};menuItems.add(item);return item.h5;}
var groups=new kigoList();function addBOMenuGroupDiv(div)
{groups.add(div);return div;}
function BOQuickSearch(text)
{self.ifNoChanges(function()
{kigoCookie.set('BO_QUICK_SEARCH',text);self.goTo('search.php?'+kigo.rawurlencode(text));});}
quickSearchDefaultText='Customer & properties search';appHeader.empty().append(this.user.isBoUser()?manageAppTickers():null,kigoDom.create('div',{'id':'apptitle'}).append(kigoDom.create('div',{'id':'appuser'}).append((this.user.isBoUser()?[kigoDom.create('span',{'class':'search_box'}).append(quickSearchInput=kigoDom.create('input',{'type':'text','maxLength':50,'value':(tmp=kigoCookie.get('BO_QUICK_SEARCH','')).length?tmp:quickSearchDefaultText,'placeholder':quickSearchDefaultText},null,{'focus':function()
{if(this.value==quickSearchDefaultText)
this.value='';this.select();},'blur':function()
{if(kigo.trim(this.value)=='')
this.value=quickSearchDefaultText;},'keydown':function(ev)
{var tmp;if((ev||(ev=window.event))&&(typeof(ev['keyCode'])!='undefined'&&ev.keyCode==13)&&(this.value=tmp=kigo.trim(this.value)).length)
{BOQuickSearch(tmp);return false;}}})),kigoDom.create('span',{'class':'search_button'},{'display':'block'}).append(kigoDom.create('a',{'href':'#','title':'Search'},null,{'click':function()
{var tmp;if((tmp=kigo.trim(quickSearchInput.domNode().value)).length&&tmp!=quickSearchDefaultText)
BOQuickSearch(tmp);return false;}})),kigoDom.create('span',{'class':'logout'}).append(kigoDom.create('a',{'href':'logout.php','title':'Log out'}).append('Log out')),kigoDom.create('span',{'class':'separator'}).append('|'),kigoDom.create('span',{'class':'account'}).append(kigoDom.create('a',{'href':'myaccount.php','title':'My Account'}).append(kigo.is_string(this.user.displayName())?this.user.displayName():'My Account'))]:null)),kigoDom.create('span',{'class':'logo'}).append(kigoDom.create('a',{'href':'/bo/'}).append('Kigo BO'))),(this.user.isBoUser()?kigoDom.create('div',{'id':'appmenu'}).append(addBOMenuGroupDiv(kigoDom.create('div').append(kigoDom.create('h4').append('Customers'),addBOMenuItem('Incoming','customers.php','INCOMING'),addBOMenuItem('Onboarding','customers.php','ONBOARDING'),addBOMenuItem('Active','customers.php','ACTIVE'),addBOMenuItem('Tech','customers.php','TECH'),addBOMenuItem('Kigo','customers.php','KIGO'),null)),addBOMenuGroupDiv(kigoDom.create('div').append(kigoDom.create('h4').append(kigoDom.nbsp),addBOMenuItem('Lost','customers.php','LOST'),addBOMenuItem('Duplicate','customers.php','DUPLICATE'),addBOMenuItem('Out of business','customers.php','OOB'),null)),(this.user.inProfile(kigo.CONST.BO.USER.P_IT,kigo.CONST.BO.USER.P_PRODUCT,kigo.CONST.BO.USER.P_SUPPORT)?addBOMenuGroupDiv(kigoDom.create('div').append(kigoDom.create('h4').append('Support'),addBOMenuItem('App ticker','app_ticker.php',null),addBOMenuItem('Booking.com','pp_bdc.php',null),addBOMenuItem('Logs','logs.php',null),addBOMenuItem('Email queue','emails.php',null),null)):null),(this.user.inProfile(kigo.CONST.BO.USER.P_IT,kigo.CONST.BO.USER.P_PRODUCT,kigo.CONST.BO.USER.P_SUPPORT)?addBOMenuGroupDiv(kigoDom.create('div').append(kigoDom.create('h4').append('Product'),(this.user.inProfile(kigo.CONST.BO.USER.P_IT,kigo.CONST.BO.USER.P_PRODUCT)?addBOMenuItem('Portals','portals.php',null):null),addBOMenuItem('Quick reports','quick_reports.php',null),null)):null),(this.user.inProfile(kigo.CONST.BO.USER.P_IT,kigo.CONST.BO.USER.P_PRODUCT,kigo.CONST.BO.USER.P_SUPPORT)?[addBOMenuGroupDiv(kigoDom.create('div').append(kigoDom.create('h4').append('Billing reports'),addBOMenuItem('Charges / credits','billing_reports.php','CHARGES_CREDITS'),addBOMenuItem('Invoices','billing_reports.php','INVOICES'),addBOMenuItem('Subscriptions','billing_reports.php','SUBSCRIPTIONS'),addBOMenuItem('Per booked night forecast','billing_reports.php','PBN_SUBSCRIPTIONS_FORECAST'),null)),addBOMenuGroupDiv(kigoDom.create('div',null,{'float':'right'}).append(kigoDom.create('h4').append('Old'),addBOMenuItem('Owners','owners.php',null),addBOMenuItem('Rental agencies','ra.php',null),null))]:null),kigoDom.create('div',{'class':'clear'})):null));var len=groups.length();groups.forEach(function(g,idx){g.addClass('group '+(idx==0?'first':(idx<len-1?'middle':'last'))+' e-'+(idx+1));});}
else if(body.hasClass('corp'))
{appHeader.empty().append(kigoDom.create('div',{'id':'apptitle'}).append(kigoDom.create('a',{'href':'http://kigo.net','title':'Kigo home'},null,{'click':function(){window.open('http://kigo.net');return false;}}).append(kigoDom.create('span').append('Kigo home'))));}
else if(body.hasClass('public'))
{appHeader.empty().append(kigoDom.create('div',{'id':'apptitle'}).append(kigoDom.create('span').append(document.title)));}}
(new kigoDom('container')).domNode().style.display='block';this.init=null;if(window.location.hash.length&&window.location.hash!='#')
this.urlParam=kigo.substr(window.location.hash,1);if(this.mainCallback.defined())
this.mainCallback.invoke(this.urlParam);function manageAppTickers()
{var user=self.user.isRa()?'RA':(self.user.isOwner()?'OWNER':(self.user.isBoUser()?'BO':null));var tickerDuration=10000;var tickerRefreshInterval=180000;var tickerRetryInterval=20000;var tickerDismissExpiry=2592000;var tickerTimeout=null;var tickerAjax=null;var tickerList=new kigoList();var currentTicker=null;var tickerDom=kigoDom.create('div',{'id':'appticker'},null,{'mouseover':function()
{if(currentTicker)
tickerAjax.cancel();clearTickerTimeout();}});if(kigoDom.getBody().hasClass('ua-msie'))
{tickerDom.domNode().onmouseleave = function()
{if(currentTicker)
renderTickerList(currentTicker);};}
else
{tickerDom.domNode().addEventListener('mouseout',function()
{if(currentTicker)
renderTickerList(currentTicker);});}
refreshTickers();return tickerDom.addClass('loading');function refreshTickers()
{if(kigoCookie.getSerialized('APP_TICKER_EMPTY',{'RA':false,'OWNER':false,'BO':false})[user])
tickerDom.addClass('none');tickerAjax=new kigoAjaxRequest3('FrontMenu/tickers',null,{'loading':false,'on_timeout':function(){setTickerTimeout(refreshTickers,tickerRetryInterval);},'on_error':function(){setTickerTimeout(refreshTickers,tickerRetryInterval);},'on_reply':function(reply)
{tickerList.empty();var tickerDismissed=new kigoAssoc(kigoCookie.getSerialized('APP_TICKER_DISMISS'));(new kigoList(reply)).forEach(function(ticker)
{if(!tickerDismissed.get(ticker.TICKER_ID))
{for(var i=0;i<ticker.TICKER_WEIGHT;i++)
{tickerList.add({'TICKER_ID':ticker.TICKER_ID,'TICKER_CONTENT':ticker.TICKER_CONTENT,'TICKER_HTML':ticker.TICKER_HTML,'SEEN':false});}}});var tickerEmpty=kigoCookie.getSerialized('APP_TICKER_EMPTY',{'RA':false,'OWNER':false,'BO':false});if(!tickerList.length())
{tickerEmpty[user]=true;tickerDom.removeClass('loading').addClass('none');setTickerTimeout(refreshTickers,tickerRefreshInterval);}
else
{tickerEmpty[user]=false;tickerList=tickerList.shuffle();tickerDom.removeClass('loading').removeClass('none');renderTickerList(null);}
kigoCookie.setSerialized('APP_TICKER_EMPTY',tickerEmpty,{'path':'/'});return true;}});}
function renderTickerList(ticker)
{if(!ticker)
ticker=firstUnseenTicker();if(ticker)
{currentTicker=ticker;ticker.SEEN=true;setTickerTimeout(renderTickerList,tickerDuration);tickerDom.empty().append(kigoFront.link({'title':'Dismiss','class':'dismiss','action':function()
{var tickerDismissed,tickerEmpty,nextTicker;tickerList=tickerList.filter(function(value){return(value.TICKER_ID!==ticker.TICKER_ID);});if(ticker.TICKER_ID>=0)
{tickerDismissed=new kigoAssoc(kigoCookie.getSerialized('APP_TICKER_DISMISS'));tickerDismissed.set(ticker.TICKER_ID,kigo.intval(new Date().getTime()/1000)+tickerDismissExpiry);tickerDismissed=tickerDismissed.filter(function(id,value)
{return(value>(kigo.intval(new Date().getTime()/1000)));});kigoCookie.setSerialized('APP_TICKER_DISMISS',tickerDismissed.object());}
if((nextTicker=firstUnseenTicker())!==false||(nextTicker=tickerList.getLast())!==null)
renderTickerList(nextTicker);else
{tickerDom.addClass('none');currentTicker=null;tickerEmpty=kigoCookie.getSerialized('APP_TICKER_EMPTY',{'RA':false,'OWNER':false,'BO':false});tickerEmpty[user]=true;kigoCookie.setSerialized('APP_TICKER_EMPTY',tickerEmpty,{'path':'/'});setTickerTimeout(refreshTickers,tickerRefreshInterval);}}}).append('×'),ticker.TICKER_HTML==1?kigoDom.create('div',{'class':'tickerContent'}).setHtml(ticker.TICKER_CONTENT):kigoDom.create('div',{'class':'tickerContent'}).append(ticker.TICKER_CONTENT));}
else
refreshTickers();}
function firstUnseenTicker()
{return tickerList.any(function(value){return!value.SEEN?value:false;});}
function setTickerTimeout(fn,timeout)
{clearTickerTimeout();tickerTimeout=setTimeout(fn,timeout);}
function clearTickerTimeout()
{if(tickerTimeout!==null)
{clearTimeout(tickerTimeout);tickerTimeout=null;}}}},'onLiveMenuRequest':function(callback)
{this.liveMenuSelectCallback=new kigoCallback(callback);},'setUrlParam':function(urlParam)
{if(window.history&&window.history.replaceState)
window.history.replaceState(null,document.title,kigo.substr(window.location.pathname,kigo.strrpos(window.location.pathname,'/')+1)+(kigo.is_string(urlParam)&&urlParam.length?'?'+urlParam:''));else
{window.location.replace(window.location.pathname+window.location.search+'#'+(kigo.is_string(urlParam)?urlParam:''));}},'unsavedChanges':function()
{var prev=typeof(window['changesDetected'])!='undefined'?(window['changesDetected']?true:false):false;if(arguments.length)
changesDetected=arguments[0]?true:false;return prev;},'ifNoChanges':function(callback)
{if(!(callback=new kigoCallback(callback)).defined())
throw'Invalid callback';if(!this.unsavedChanges())
{callback.invoke();return true;}
kigoPopup.yesno('Continue without saving?','Unsaved changes will be lost.\n'+'\n'+'Do you want to continue anyway?',function(yesno)
{if(yesno)
callback.invoke();},false);return false;},'saveIfChanges':function(callback)
{if(!(callback=new kigoCallback(callback)).defined())
throw'Invalid callback';if(!this.unsavedChanges())
{callback.invoke(null);return true;}
var popup,saveButton;popup=(new kigoPopup({'title':'Save changes?','width':380,'movable':true,'content':[kigoDom.create('div',{'class':'message yesno'}).append('There are unsaved changes.',kigoDom.create('br'),kigoDom.create('br'),'Save changes before continuing?'),kigoDom.create('div',{'class':'buttons'}).append(saveButton=kigoDom.create('button',{'type':'button'},null,{'click':function(){popup.close();callback.invoke(true);return false;}}).append('Save changes'),kigoDom.create('button',{'type':'button'},null,{'click':function(){popup.close();callback.invoke(false);return false;}}).append('Discard changes'),kigoDom.create('button',{'type':'button'},null,{'click':function(){popup.close();}}).append('Cancel'))]}));saveButton.domNode().focus();return false;},'link':function(opts)
{var node;var url,callback,cls,title;opts=new kigoAssoc(opts);if(!kigo.is_string(cls=opts.get('class',''))||!kigo.is_string(title=opts.get('title','')))
throw'kigoFront::link(): Invalid argument(s)';callback=new kigoCallback(opts.get('action'));if(kigo.is_string(url=opts.get('url',null)))
{if((new kigoList(['http://','https://','ftp://','mailto:'])).any(function(prefix)
{return!kigo.strcasecmp(kigo.substr(url,0,prefix.length),prefix);}))
cls+=' external_link';if(!callback.defined())
{if(kigo.strcasecmp(kigo.substr(url,0,'mailto:'.length),'mailto:'))
callback=new kigoCallback(function(){this.goTo(url);},this);else
callback=new kigoCallback(function(){window.location=url;});}}
else
{if(!callback.defined())
throw'kigoFront::link(): Invalid argument(s)';url='#';}
return(node=kigoDom.create('a',{'href':url,'title':title,'class':cls},null,{'click':function(){callback.invoke(node);return false;}}));},'infoMessage':function(content)
{return kigoDom.create('div',{'class':'infomessage'}).append(content);},'infoBoard':function(opts)
{var type,title,hasTitle;opts=new kigoAssoc(opts);if(!kigoVal.INN(type=opts.get('type',null),'important','warning','notice','info','success')||!opts.isset('content'))
throw'kigoFront::infoBoard(): Invalid argument(s)';hasTitle=kigo.is_string(title=opts.get('title',null))&&kigo.strlen(title);return kigoDom.create('div',{'class':'infoboard infoboard-'+type+' '+(hasTitle?'infoboard-title':'')}).append(hasTitle?kigoDom.create('h2').append(title):null,opts.get('content'));},'goTo':function(url)
{var body=kigoDom.getBody();if(body)
{if(!body.hasClass('page'))
throw'Invalid context.';if(!body.hasClass('corp'))
kigoPopup.loading();}
window.location=url;},'goLogout':function()
{var body=kigoDom.getBody();if(body&&(body.hasClass('app')||body.hasClass('bo')))
this.goTo('logout.php');else
this.goTo('/login.php');},'formatDisplayPrice':function(price)
{var tmp;var decimals=arguments.length>1?kigo.intval(arguments[1]):2;var thsep=arguments.length>2?kigo.toString(arguments[2]):'\'';if(decimals>0)
{var parts=(''+(isNaN(tmp=kigo.round(price,decimals))?'0':tmp)).split('.');if(parts.length==2)
return apply_thsep(parts[0],thsep)+'.'+parts[1]+kigo.str_repeat('0',decimals-parts[1].length);else if(parts.length==1)
return apply_thsep(parts[0],thsep)+'.'+kigo.str_repeat('0',decimals);else
throw'Unexpected condition';}
else if(decimals==0)
return apply_thsep(isNaN(tmp=kigo.round(price))?0:tmp,thsep);else
throw'Invalid argument';function apply_thsep(intPart,thsep)
{var positive,newIntPart='';intPart=kigo.toString(intPart);if(!thsep.length)
return intPart;if(!(positive=(intPart.substr(0,1)=='-')?false:true))
intPart=intPart.substr(1);for(var i=intPart.length-1;i>=0;i--)
{if(i&&!((intPart.length-i)%3))
newIntPart=thsep+intPart.substr(i,1)+newIntPart;else
newIntPart=intPart.substr(i,1)+newIntPart;}
return(positive?'':'-')+newIntPart;}},'formatDisplayRate':function(rate)
{var tmp;var decimals=arguments.length>1?kigo.intval(arguments[1]):2;if(decimals>0)
{var parts=(''+(isNaN(tmp=kigo.round(rate,decimals))?'0':tmp)).split('.');if(parts.length==2)
return''+parts[0]+'.'+parts[1]+kigo.str_repeat('0',decimals-parts[1].length)+' %';else if(parts.length==1)
return''+parts[0]+'.'+kigo.str_repeat('0',decimals)+' %';else
throw'Unexpected condition';}
else if(decimals==0)
return''+(isNaN(tmp=kigo.round(rate))?0:tmp)+' %';else
throw'Invalid argument';}};function kigoOwner(id,raId,displayName,resEmails,myAgencies)
{this._id=id;this._ra_id=raId;this._displayName=displayName;this._resEmails=resEmails;this._myAgencies=myAgencies;}
kigoOwner.prototype.isOwner = function(){return true;};kigoOwner.prototype.isRa = function(){return false;};kigoOwner.prototype.isBoUser = function(){return false;};kigoOwner.prototype.isGuest = function(){return false;};kigoOwner.prototype.id = function(){return this._id;};kigoOwner.prototype.getRaId = function(){return this._ra_id;};kigoOwner.prototype.displayName = function(){return this._displayName;};kigoOwner.prototype.areResEmailsEnabled = function(){return this._resEmails;};kigoOwner.prototype.isMyAgenciesGuiEnabled = function(){return this._myAgencies;};kigoOwner.prototype.websiteList = function(){return new kigoList();};kigoOwner.prototype.getProfile = function(){return null;};kigoOwner.prototype.inProfile = function(){return false;};function kigoRa(id,displayName,resEmails,wsList)
{this._id=id;this._displayName=displayName;this._resEmails=resEmails;this._wsList=new kigoList(wsList);}
kigoRa.prototype.isOwner = function(){return false;};kigoRa.prototype.isRa = function(){return true;};kigoRa.prototype.isBoUser = function(){return false;};kigoRa.prototype.isGuest = function(){return false;};kigoRa.prototype.id = function(){return this._id;};kigoRa.prototype.displayName = function(){return this._displayName;};kigoRa.prototype.areResEmailsEnabled = function(){return this._resEmails;};kigoRa.prototype.websiteList = function(){return this._wsList;};kigoRa.prototype.getProfile = function(){return null;};kigoRa.prototype.inProfile = function(){return false;};function kigoBoUser(id,displayName,profile)
{this._id=id;this._displayName=displayName;this._profile=profile;}
kigoBoUser.prototype.isOwner = function(){return false;};kigoBoUser.prototype.isRa = function(){return false;};kigoBoUser.prototype.isBoUser = function(){return true;};kigoBoUser.prototype.isGuest = function(){return false;};kigoBoUser.prototype.id = function(){return this._id;};kigoBoUser.prototype.displayName = function(){return this._displayName;};kigoBoUser.prototype.areResEmailsEnabled = function(){return null;};kigoBoUser.prototype.websiteList = function(){return new kigoList();};kigoBoUser.prototype.getProfile = function(){return this._profile;};kigoBoUser.prototype.inProfile = function(){return(new kigoList(arguments.length===1&&kigo.is_array(arguments[0])?arguments[0]:arguments)).any(new kigoCallback(function(value){return value===this._profile;},this));};function kigoGuest()
{}
kigoGuest.prototype.isOwner = function(){return false;};kigoGuest.prototype.isRa = function(){return false;};kigoGuest.prototype.isBoUser = function(){return false;};kigoGuest.prototype.isGuest = function(){return true;};kigoGuest.prototype.id = function(){return null;};kigoGuest.prototype.displayName = function(){return null;};kigoGuest.prototype.areResEmailsEnabled = function(){return null;};kigoGuest.prototype.websiteList = function(){return new kigoList();};kigoGuest.prototype.getProfile = function(){return null;};kigoGuest.prototype.inProfile = function(){return false;};vkDom.onLoad(function(){kigoFront.init();});

function kigoMenu()
{this.selected=-1;this.divElements=[];this.liElements=[];this.ulElement=document.createElement('ul');}
kigoMenu.prototype.add = function(label,div)
{var idx,li,d;var self=this;this.divElements[idx=this.divElements.length]=vkDom.el(div);d=document.createElement('div');d.innerHTML=vkDom.html(label);if(window.addEventListener)
d.addEventListener('click',function(){return self._onClick(idx);},false);else if(window.attachEvent)
d.attachEvent('onclick',function(){return self._onClick(idx);});li=document.createElement('li');li.appendChild(d);this.liElements[idx]=li;this.ulElement.appendChild(li);return idx;}
kigoMenu.prototype.dump = function(hostDiv)
{if(!(hostDiv=vkDom.el(hostDiv)))
throw'Host element is NULL';if(!this.ulElement)
throw'Already dumped';vkDom.setText(hostDiv,'');hostDiv.appendChild(this.ulElement);this.ulElement=null;}
kigoMenu.prototype._onClick = function(i)
{if(this.onClick(i))
this.select(i);return false;}
kigoMenu.prototype.select = function(i)
{this.unselect();if(i>=0&&i<this.divElements.length)
{this.liElements[i].className='sel';this.divElements[i].style.display='block';this.selected=i;this.onSelect(i);}}
kigoMenu.prototype.unselect = function()
{for(var i=0;i<this.divElements.length;i++)
{this.liElements[i].className='';this.divElements[i].style.display='none';}
this.selected=-1;}
kigoMenu.prototype.onClick = function(i)
{return true;}
kigoMenu.prototype.onSelect = function(i)
{}

function kigoMenu2(type)
{this.container=kigoDom.create('div',{'class':type}).append(this.list=kigoDom.create('ul'));this.tabs=[];this.currentTab=null;}
kigoMenu2.prototype.domNode = function()
{return this.container.domNode();}
kigoMenu2.prototype.add = function(label)
{var self=this;var li,idx=this.tabs.length;this.list.append(li=kigoDom.create('li').append(kigoDom.create('div',null,null,{'click':function(){self.select(idx,true);return false;}}).append(label)));this.tabs.push({'obj':arguments.length>1&&arguments[1]!=null?new kigoDom(arguments[1]):null,'li':li,'onEnter':arguments.length>2&&kigo.is_function(arguments[2])?arguments[2]:null,'onLeave':arguments.length>3&&kigo.is_function(arguments[3])?arguments[3]:null});if(this.tabs[idx].obj)
this.tabs[idx].obj.domNode().style.display='none';return idx;}
kigoMenu2.prototype.select = function(idx)
{if(idx<0||idx>=this.tabs.length)
return false;if(this.currentTab!=null)
{if(this.currentTab==idx)
return true;if(arguments.length>1&&arguments[1]&&this.tabs[this.currentTab].onLeave!=null&&!this.tabs[this.currentTab].onLeave(idx,this))
return false;this.tabs[this.currentTab].li.domNode().className='';if(this.tabs[this.currentTab].obj!=null)
this.tabs[this.currentTab].obj.domNode().style.display='none';this.currentTab=null;}
if(arguments.length>1&&arguments[1]&&this.tabs[idx].onEnter!=null&&!this.tabs[idx].onEnter(idx,this))
return false;this.tabs[idx].li.domNode().className='sel';if(this.tabs[idx].obj!=null)
this.tabs[idx].obj.domNode().style.display='block';this.currentTab=idx;return true;}

function kigoMenu3(el)
{if(!arguments.length||el===null)
this.node=kigoDom.create('div',{'class':'kigo_menu'}).append(this.list=kigoDom.create('ul'));else
{try
{this.node=new kigoDom(el);}
catch(e)
{throw'kigoMenu3::kigoMenu3(): Invalid DOM node';}
if(this.node.domNode().tagName!='DIV')
throw'kigoMenu3::kigoMenu3(): Not a DIV node';this.node.empty().addClass('kigo_menu').append(this.list=kigoDom.create('ul'));}
this.current=null;this.items=new kigoAssoc();this.beforeChangeCallback=new kigoCallback(null);this.changeCallback=new kigoCallback(null);this.inSelect=false;}
kigoMenu3.prototype.dom = function()
{return this.node;}
kigoMenu3.prototype.domNode = function()
{return this.node.domNode();}
kigoMenu3.prototype.add = function(id,label)
{var li,self=this;if(this.items.isset(id=kigo.toString(id)))
throw'kigoMenu3::add(): entry ['+id+'] already added';this.list.append(li=kigoDom.create('li',arguments.length>2?{'class':arguments[2]}:null).append(kigoDom.create('div',null,null,{'click':function(){self.select(id,true,true);return false;}}).append(label)));this.items.set(id,li);return this;}
kigoMenu3.prototype.get = function()
{return this.items.keys();}
kigoMenu3.prototype.onBeforeChange = function(callback)
{this.beforeChangeCallback=new kigoCallback(callback,this);return this;}
kigoMenu3.prototype.onChange = function(callback)
{this.changeCallback=new kigoCallback(callback,this);return this;}
kigoMenu3.prototype.getSelected = function()
{return this.current;}
kigoMenu3.prototype.select = function(id)
{if(this.inSelect)
throw'kigoMenu3::select(): recursive call detected';this.inSelect=true;if(id!=null&&!this.items.isset(id=kigo.toString(id)))
throw'kigoMenu3::select(): no such entry ['+id+']';if(((this.current==null&&id==null)||(this.current!=null&&this.current==id))&&!(arguments.length>3&&arguments[3]))
{this.inSelect=false;return this;}
if(arguments.length>2&&arguments[2]&&this.beforeChangeCallback.defined()&&this.beforeChangeCallback.invoke(id,this.current,this)!==true)
{this.inSelect=false;return this;}
var prev=this.current;if(this.current!=null)
this.items.get(this.current).removeClass('selected');if(id!=null)
this.items.get(id).addClass('selected');this.current=id;if(!(arguments.length>1&&!arguments[1])&&this.changeCallback.defined())
this.changeCallback.invoke(this.current,prev,this);this.inSelect=false;return this;}

function kigoTable(containerDiv)
{this.containerDiv=containerDiv;this.reset();}
kigoTable.prototype.reset = function()
{this.tattribs='';this.caption='';this.thead='';this.tbody='';this.tfoot='';return true;}
kigoTable.prototype.setTableAttributes = function(attribs)
{if(typeof(attribs)!='object')
throw'Object expected';this.tattribs=this._buildAttr(attribs);}
kigoTable.prototype.setCaption = function()
{this.setCaptionArray(arguments);}
kigoTable.prototype.setCaptionArray = function(args)
{if(args.length==1)
attribs='';else if(args.length==2)
{if(typeof(args[1])!='object')
throw'Second argument expected to be an object';attribs=this._buildAttr(args[1]);}
else
throw'Bad arguments';this.caption='<caption'+attribs+'>'+args[0]+'</caption>';}
kigoTable.prototype.headerLine = function()
{this.headerLineArray(arguments);}
kigoTable.prototype.headerLineArray = function(args)
{this.thead+=this._line(args);}
kigoTable.prototype.bodyLine = function()
{this.bodyLineArray(arguments);}
kigoTable.prototype.bodyLineArray = function(args)
{this.tbody+=this._line(args);}
kigoTable.prototype.footerLine = function()
{this.footerLineArray(arguments);}
kigoTable.prototype.footerLineArray = function(args)
{this.tfoot+=this._line(args);}
kigoTable.prototype._line = function(args)
{var i,attribs,cell,str;if(!args.length)
throw'Bad arguments';if(typeof(args[0])=='object')
{if(args.length<2)
throw'Bad arguments';str='<tr'+this._buildAttr(args[0])+'>';i=1;}
else
{str='<tr>';i=0;}
while(i<args.length)
{if(typeof(args[i])!='string')
throw'Bad arguments';cell=args[i];if(++i<args.length&&typeof(args[i])=='object')
str+='<td'+this._buildAttr(args[i++])+'>'+cell+'</td>';else
str+='<td>'+cell+'</td>';}
return str+'</tr>';}
kigoTable.prototype.dump = function()
{var container;if(!(container=vkDom.el(this.containerDiv)))
throw'Container not found';container.innerHTML='<table'+this.tattribs+'>'+
this.caption+
(this.thead.length?'<thead>'+this.thead+'</thead>':'')+
(this.tfoot.length?'<tfoot>'+this.tfoot+'</tfoot>':'')+
(this.tbody.length?'<tbody>'+this.tbody+'</tbody>':'')+'</table>';return this.reset();}
kigoTable.prototype._encode = function(str)
{str=''+str;str=str.replace(/&/g,'&amp;');str=str.replace(/\"/g,'&quot;');str=str.replace(/</g,'&lt;');return str.replace(/>/g,'&gt;');}
kigoTable.prototype._buildAttr = function(obj)
{var res='';if(typeof(obj)!='object')
return'';for(var i in obj)
{if(typeof(obj[i])=='string'||typeof(obj[i])=='number')
res+=(res.length?' ':'')+i+'="'+this._encode(obj[i])+'"';}
return res.length?' '+res:'';}

function kigoToolTipsClass()
{this.current=-1;this.elements=[];this.tooltips=[];this.timer=null;this.closeTime=150;this.mouseDistance=12;this.environement=null;this.defaultToolTipDiv=document.createElement('div');this.defaultToolTipDiv.id='defaultToolTipDiv';this.defaultToolTipDiv.className='tooltip';}
kigoToolTipsClass.prototype.setCloseTime = function(time)
{this.closeTime=time;}
kigoToolTipsClass.prototype.setMouseDistance = function(dist)
{this.mouseDistance=dist;}
kigoToolTipsClass.prototype.silentAdd = function(id){var idx=this.elements.length;this.elements[idx]={'id':id};}
kigoToolTipsClass.prototype.add = function(overElement,id)
{var idx=this.elements.length;if(!(overElement=vkDom.el(overElement))){return;}
this.elements[idx]={'element':overElement,'id':id};if(!vkDom.el(id)){this.tooltips[id]=id;if(!vkDom.el('defaultToolTipDiv'))
document.getElementById('global').appendChild(this.defaultToolTipDiv);var tip=vkDom.el('defaultToolTipDiv');}else{var tip=vkDom.el(id);}
var setup = function(){var mouseMoveHandler = function(ev){kigoToolTips.__mouseMove(ev,idx);}
var mouseOutHandler = function(){kigoToolTips.__mouseOut(idx);}
tip.enableEvents = function(){if(window.addEventListener)
{overElement.addEventListener('mousemove',mouseMoveHandler,false);overElement.addEventListener('mouseout',mouseOutHandler,false);}
else if(window.attachEvent)
{overElement.attachEvent('onmousemove',mouseMoveHandler);overElement.attachEvent('onmouseout',mouseOutHandler);}}
tip.disableEvents = function(){if(window.addEventListener)
{overElement.removeEventListener('mousemove',mouseMoveHandler,false);overElement.removeEventListener('mouseout',mouseOutHandler,false);}
else if(window.attachEvent)
{overElement.detachEvent('onmousemove',mouseMoveHandler);overElement.detachEvent('onmouseout',mouseOutHandler);}}}
setup();tip.enableEvents();return overElement;}
kigoToolTipsClass.prototype.autoSetup = function(node)
{var i,toolTip;if(!node.hasChildNodes())
return;for(i=0;i<node.childNodes.length;i++)
{if(node.childNodes[i].nodeType==1)
{if((toolTip=node.childNodes[i].getAttribute('tooltip'))!=null)
this.add(node.childNodes[i],toolTip);else
this.autoSetup(node.childNodes[i]);}}}
kigoToolTipsClass.prototype._cancelTimer = function()
{if(this.timer!=null)
{clearTimeout(this.timer);this.timer=null;}}
kigoToolTipsClass.prototype._onTimer = function(idx)
{if(this.current==idx)
this._close();}
kigoToolTipsClass.prototype._close = function()
{if(this.current!=-1)
{var tip=vkDom.el(this.elements[this.current].id);if(!tip){tip=this.defaultToolTipDiv;}
if(tip)
tip.style.display='none';this.current=-1;this.environement=null;}}
kigoToolTipsClass.prototype._open = function(ev,idx)
{ev.cancelBubble=true;ev.returnValue=false;if(navigator.appVersion.indexOf("MSIE")!=-1){ev.keyCode=0;}
var tip=vkDom.el(this.elements[idx].id),mx=ev.clientX,my=ev.clientY,tw,th,tx,ty;if(!tip){tip=this.defaultToolTipDiv;vkDom.setText(tip,this.tooltips[this.elements[idx].id]);}
if(tip)
{if(this.tipDimensions==null){tip.disableEvents();tip.style.display='block';tw=tip.clientWidth;th=tip.clientHeight;tip.style.display='none';this.environement=new Object();var tipDimensions={x:tw,y:th};this.environement.tipDimensions=tipDimensions;var event=ev;var win=window;var doc=win.document.body;var viewWidth=0,viewHeight=0;if(typeof(window.innerWidth)=='number'){viewWidth=window.innerWidth;viewHeight=window.innerHeight;}else if(document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)){viewWidth=document.documentElement.clientWidth;viewHeight=document.documentElement.clientHeight;}else if(document.body&&(document.body.clientWidth||document.body.clientHeight)){viewWidth=document.body.clientWidth;viewHeight=document.body.clientHeight;}
var viewSize={x:viewWidth,y:viewHeight};this.environement.viewSize=viewSize;var scrOfX=0,scrOfY=0;if(typeof(window.pageYOffset)=='number'){scrOfY=window.pageYOffset;scrOfX=window.pageXOffset;}else if(document.body&&(document.body.scrollLeft||document.body.scrollTop)){scrOfY=document.body.scrollTop;scrOfX=document.body.scrollLeft;}else if(document.documentElement&&(document.documentElement.scrollLeft||document.documentElement.scrollTop)){scrOfY=document.documentElement.scrollTop;scrOfX=document.documentElement.scrollLeft;}
var scroll={x:scrOfX,y:scrOfY};this.environement.scroll=scroll;var page={x:event.pageX||event.clientX+scroll.x,y:event.pageY||event.clientY+scroll.y};this.environement.page=page;tip.enableEvents();}else{var tipDimensions=this.environement.tipDimensions;tw=this.tipDimensions.x;th=this.tipDimensions.y;var page=this.environement.page;var presto=this.environement.presto;var webkit=this.environement.webkit;var viewSize=this.environement.viewSize;var scroll=this.environement.scroll;}
tip.style.display='none';switch(tip.getAttribute('pos'))
{case'w':tx=-tw-this.mouseDistance;ty=-(th>>1);break;case'e':tx=this.mouseDistance;ty=-(th>>1);break;case'n':tx=-(tw>>1);ty=-th-this.mouseDistance;break;case's':tx=-(tw>>1);ty=this.mouseDistance;break;case'nw':tx=-tw-this.mouseDistance;ty=-th-this.mouseDistance;break;case'se':tx=this.mouseDistance;ty=this.mouseDistance;break;case'sw':tx=-tw-this.mouseDistance;ty=this.mouseDistance;break;case'ne':default:tx=this.mouseDistance;ty=-th-this.mouseDistance;}
var props={x:'left',y:'top'};var propsID=['x','y'];var obj={};var offset={x:tx,y:ty};var mouse={x:mx,y:my};switch(tip.getAttribute('pos'))
{case'w':case'n':case'nw':for(var pos in propsID){var coordinateIdent=propsID[pos];if(typeof props[coordinateIdent]!='function'){obj[props[coordinateIdent]]=page[coordinateIdent]+offset[coordinateIdent];if((obj[props[coordinateIdent]]-tipDimensions[coordinateIdent]-scroll[coordinateIdent])<-mouse[coordinateIdent])
{obj[props[coordinateIdent]]=page[coordinateIdent]+offset[coordinateIdent]+tipDimensions[coordinateIdent]+(1.3*this.mouseDistance);}}}
break;default:break;}
if(tip.getAttribute('pos')!='w'&&tip.getAttribute('pos')!='n'&&tip.getAttribute('pos')!='nw'){switch(tip.getAttribute('pos'))
{case'e':case's':case'se':case'sw':case'ne':default:for(var pos in propsID){var coordinateIdent=propsID[pos];if(typeof props[coordinateIdent]!='function'){obj[props[coordinateIdent]]=page[coordinateIdent]+offset[coordinateIdent];if((obj[props[coordinateIdent]]+tipDimensions[coordinateIdent]-scroll[coordinateIdent])>viewSize[coordinateIdent]){obj[props[coordinateIdent]]=page[coordinateIdent]-offset[coordinateIdent]-tipDimensions[coordinateIdent];}}}
break;}}
if(obj.left<scroll.x)obj.left=scroll.x;if(obj.top<scroll.y)obj.top=scroll.y;tip.style.left=obj.left+'px';tip.style.top=obj.top+'px';tip.style.display='block';}
this.current=idx;}
kigoToolTipsClass.prototype.__mouseMove = function(ev,idx)
{if(this.current!=idx)
this._close();this._cancelTimer();this._open(ev,idx);}
kigoToolTipsClass.prototype.__mouseOut = function(idx)
{this._cancelTimer();this.timer=setTimeout(function(){kigoToolTips._onTimer(idx)},this.closeTime);}
var kigoToolTips=new kigoToolTipsClass();

var kigoTooltip={'mouseDistance':12,'handlers':{},'nextHandler':0,'tooltip':null,'icon':function(content)
{return this.register(kigoDom.create('img',{'src':'/img/tooltip.png'},{'verticalAlign':'-2px'}),content,arguments.length>1?arguments[1]:'ne');},'register':function(over,content)
{var orientation=arguments.length>2?arguments[2]:'ne';var self=this;over=new kigoDom(over);if(kigo.is_function(content))
content=new kigoCallback(content,window);this.unregister(over);var onOver,onMove,onOut;var width=null,height=null;onOver = function(ev)
{var actualContent;if(!self.tooltip)
kigoDom.getBody().append(self.tooltip=kigoDom.create('div',{'class':'tooltip'},{'display':'none','visibility':'hidden'}));self.tooltip.domNode().style.visibility='hidden';self.tooltip.domNode().style.left='-10000px';self.tooltip.domNode().style.top='-10000px';self.tooltip.empty().append(actualContent=kigoCallback.isInstance(content)?content.invoke(over):content);if(actualContent!==null)
{self.tooltip.domNode().style.display='block';width=self.tooltip.domNode().offsetWidth;height=self.tooltip.domNode().offsetHeight;onMove(ev);self.tooltip.domNode().style.visibility='visible';}};onMove = function(ev)
{var mx=ev.clientX+Math.max(document.documentElement.scrollLeft,document.body.scrollLeft);var my=ev.clientY+Math.max(document.documentElement.scrollTop,document.body.scrollTop);var tx,ty;if(width==null||height==null)
return;var vpTop,vpBottom,vpLeft,vpRight;vpTop=Math.max(document.documentElement.scrollTop,document.body.scrollTop);vpBottom=vpTop+document.documentElement.clientHeight;vpLeft=Math.max(document.documentElement.scrollLeft,document.body.scrollLeft);vpRight=vpLeft+document.documentElement.clientWidth;computeDefault();if(tx<vpLeft)
tx=vpLeft;else if(tx+width>vpRight)
tx=Math.max(vpLeft,vpRight-width);if(ty<vpTop)
ty=vpTop;else if(ty+height>vpBottom)
ty=Math.max(vpTop,vpBottom-height);if(mx>=tx&&mx<=(tx+width)&&my>=ty&&my<=(ty+height))
{computeDefault();if(tx+width>vpRight)
{switch(orientation)
{case'e':case'ne':case'se':tx=mx-width-self.mouseDistance;break;default:tx=vpRight-width;}}
if(tx<vpLeft)
{switch(orientation)
{case'w':case'nw':case'sw':tx=mx+self.mouseDistance;break;default:tx=vpLeft;}}
if(ty+height>vpBottom)
{switch(orientation)
{case's':case'sw':case'se':ty=my-height-self.mouseDistance;break;default:ty=vpBottom-height;}}
if(ty<vpTop)
{switch(orientation)
{case'n':case'nw':case'ne':ty=my+self.mouseDistance;break;default:ty=vpTop;}}
if(mx>=tx&&mx<=(tx+width)&&my>=ty&&my<=(ty+height))
computeDefault();}
self.tooltip.domNode().style.left=tx+'px';self.tooltip.domNode().style.top=ty+'px';function computeDefault()
{switch(orientation)
{case'w':tx=mx-width-self.mouseDistance;ty=my-(height>>1);break;case'e':tx=mx+self.mouseDistance;ty=my-(height>>1);break;case'n':tx=mx-(width>>1);ty=my-height-self.mouseDistance;break;case's':tx=mx-(width>>1);ty=my+self.mouseDistance;break;case'nw':tx=mx-width-self.mouseDistance;ty=my-height-self.mouseDistance;break;case'se':tx=mx+self.mouseDistance;ty=my+self.mouseDistance;break;case'sw':tx=mx-width-self.mouseDistance;ty=my+self.mouseDistance;break;case'ne':default:tx=mx+self.mouseDistance;ty=my-height-self.mouseDistance;}}};onOut = function(ev)
{self.tooltip.domNode().style.display='none';self.tooltip.empty();width=null;height=null;};over.domNode().setAttribute('kigo_tooltip',++this.nextHandler);this.handlers[this.nextHandler]={'onOver':onOver,'onMove':onMove,'onOut':onOut};if(window.addEventListener)
{over.domNode().addEventListener('mouseover',onOver,false);over.domNode().addEventListener('mousemove',onMove,false);over.domNode().addEventListener('mouseout',onOut,false);}
else if(window.attachEvent)
{over.domNode().attachEvent('onmouseover',onOver);over.domNode().attachEvent('onmousemove',onMove);over.domNode().attachEvent('onmouseout',onOut);}
return over;},'unregister':function(over)
{var idx=(over=new kigoDom(over)).domNode().getAttribute('kigo_tooltip');if(idx&&kigo.is_object(this.handlers[idx]))
{if(window.addEventListener)
{over.domNode().removeEventListener('mouseover',this.handlers[idx].onOver,false);over.domNode().removeEventListener('mousemove',this.handlers[idx].onMove,false);over.domNode().removeEventListener('mouseout',this.handlers[idx].onOut,false);}
else if(window.attachEvent)
{over.domNode().detachEvent('onmouseover',this.handlers[idx].onOver);over.domNode().detachEvent('onmousemove',this.handlers[idx].onMove);over.domNode().detachEvent('onmouseout',this.handlers[idx].onOut);}
delete this.handlers[idx];}
over.domNode().removeAttribute('kigo_tooltip');return over;},'hide':function()
{if(this.tooltip)
{this.tooltip.domNode().style.display='none';this.tooltip.empty();}}};

var kigoInputCharFilter={'handlers':{},'nextHandler':0,'register':function(over,filter)
{var self=this;over=new kigoDom(over);if(!vkDom.hasClass(document.body,'ua_os-win')&&!vkDom.hasClass(document.body,'ua_os-mac')&&!vkDom.hasClass(document.body,'ua_os-linux'))
return over;if(!kigo.is_string(filter))
throw'kigoInputCharFilter::kigoInputCharFilter(): Bad filter';var onKeyPress = function(ev)
{var code;if(typeof(ev['charCode'])!='undefined')
code=ev.charCode;else if(typeof(ev['keyCode'])!='undefined')
code=ev.keyCode;else
return true;if(!code||code==8||code==9||code==13||(typeof(ev.which)!='undefined'&&!ev.which)||kigo.strpos(filter,String.fromCharCode(code))!=null)
return true;if(ev.stopPropagation)
ev.stopPropagation();if(typeof(ev.cancelBubble)!='undefined')
ev.cancelBubble=true;if(ev.preventDefault)
ev.preventDefault();if(typeof(ev.returnValue)!='undefined')
ev.returnValue=false;return false;};this.unregister(over);over.domNode().setAttribute('kigo_inputcharfilter',this.nextHandler);this.handlers[this.nextHandler++]=onKeyPress;if(window.addEventListener)
over.domNode().addEventListener('keypress',onKeyPress,false);else if(window.attachEvent)
over.domNode().attachEvent('onkeypress',onKeyPress);return over;},'unregister':function(over)
{var idx;try
{over=new kigoDom(over);}
catch(e)
{return null;}
if(kigo.is_function(this.handlers[idx=over.domNode().getAttribute('kigo_inputcharfilter')]))
{if(window.addEventListener)
over.domNode().removeEventListener('keypress',this.handlers[idx],false);else if(window.attachEvent)
over.domNode().detachEvent('onkeypress',this.handlers[idx]);over.domNode().removeAttribute('kigo_inputcharfilter');delete this.handlers[idx];}
return over;},'builtin':{'none':'','digits':'0123456789'}};

function kigoAjaxRequest2
(loadCallback)
{if(!(this.loadCallback=new kigoCallback(loadCallback)).defined())
throw'kigoAjaxRequest2::kigoAjaxRequest2(): callback expected';this.defaultUrl=(arguments.length>1&&typeof(arguments[1])=='string')?arguments[1]:null;this.objectCallback=new kigoCallback(arguments.length>2?arguments[2]:null);this.timeout=(arguments.length>3&&typeof(arguments[3])=='number')?parseInt(arguments[3],10):20000;this.transformDepth=(arguments.length>4&&typeof(arguments[4])=='number')?parseInt(arguments[4],10):2;this.url=null;this.debug=null;this.postObject=null;this.jsonAjax=null;this.isSilent=false;this.loadingPopupFlag=true;this.loadingPopup=null;}
kigoAjaxRequest2.prototype.run = function()
{if(arguments.length==2&&typeof(arguments[0])=='string'&&typeof(arguments[1])=='object')
{this.url=arguments[0];this.postObject=arguments[1];}
else if(arguments.length==1&&typeof(arguments[0])=='string')
{this.url=arguments[0];this.postObject=(this.objectCallback.defined()?this.objectCallback.invoke():null);}
else if(arguments.length==1&&typeof(arguments[0])=='object')
{this.url=this.defaultUrl;this.postObject=arguments[0];}
else if(!arguments.length)
{this.url=this.defaultUrl;this.postObject=(this.objectCallback.defined()?this.objectCallback.invoke():null);}
else
throw'Bad usage';this.rerun();}
kigoAjaxRequest2.prototype.rerun = function()
{if(this.loadingPopup!==null)
{this.loadingPopup.close();this.loadingPopup=null;}
if(this.loadingPopupFlag&&!this.isSilent)
this.loadingPopup=kigoPopup.loading();this.getAjax().post(this.url,this.postObject,this.timeout);}
kigoAjaxRequest2.prototype.silent = function(tf)
{this.isSilent=tf?true:false;}
kigoAjaxRequest2.prototype.loading = function(tf)
{this.loadingPopupFlag=tf?true:false;}
kigoAjaxRequest2.prototype.enableDebug = function(debug)
{this.getAjax().enableDebug(debug);return this;}
kigoAjaxRequest2.prototype.abort = function()
{if(this.jsonAjax)
this.jsonAjax.free();if(this.loadingPopup!==null&&!kigoAjaxRequest2.unloading)
{this.loadingPopup.close();this.loadingPopup=null}}
kigoAjaxRequest2.prototype.onUnauthenticated = function()
{kigoPopup.warn('Please authenticate','This feature requires user authentication.\n'+'Please log in and try again.',function()
{kigoFront.goLogout();});}
kigoAjaxRequest2.prototype.onTimeout = function()
{var self=this;if(!this.isSilent)
{kigoPopup.yesno('Operation timed out','The operation timed out.\n'+'Do you want to retry?',function(yesno)
{if(yesno)
self.rerun();else
kigoFront.goLogout();},true);}}
kigoAjaxRequest2.prototype.onError = function()
{var self=this;if(!this.isSilent)
{kigoPopup.yesno('Unexpected problem','An unexpected problem occured.\n'+'Would you like to retry?',function(yesno)
{if(yesno)
self.rerun();else
kigoFront.goLogout();},true);}}
kigoAjaxRequest2.prototype.onLoad = function(data)
{if(!this.loadCallback.invoke(this.transformDepth>0?this.transform(data,1):data))
this.onError();}
kigoAjaxRequest2.prototype.getAjax = function()
{if(this.jsonAjax==null)
{var self=this;this.jsonAjax=new vkJSONRemote();this.jsonAjax.onLoad = function(status,data)
{if(self.loadingPopup!==null&&!(!status&&kigoAjaxRequest2.unloading))
{self.loadingPopup.close();self.loadingPopup=null;}
if(status==403)
self.onUnauthenticated();else if(status==504)
self.onTimeout();else if(status!=200||data==null)
{if(!status&&kigoAjaxRequest2.unloading)
return;self.onError();}
else
{self.jsonAjax.free();self.onLoad(data);}}
this.jsonAjax.onTimeout = function()
{if(self.loadingPopup!==null&&!kigoAjaxRequest2.unloading)
{self.loadingPopup.close();self.loadingPopup=null}
self.onTimeout();}}
this.jsonAjax.free();return this.jsonAjax;}
kigoAjaxRequest2.prototype.transform = function(data,depth)
{if(kigo.is_object(data))
{if(data.hasOwnProperty('__kigoRemoteType__'))
{if(data['__kigoRemoteType__']=='kigoAssoc')
{if(!data.hasOwnProperty('assoc')||!kigo.is_array(data['assoc']))
throw'Corrupted input';var assoc=new kigoAssoc();if(++depth>this.transformDepth)
{for(var i=0;i<data.assoc.length;i++)
assoc.set(data.assoc[i][0],data.assoc[i][1]);}
else
{for(var i=0;i<data.assoc.length;i++)
assoc.set(data.assoc[i][0],this.transform(data.assoc[i][1],depth));}
return assoc;}
else if(data['__kigoRemoteType__']=='kigoList')
{if(!data.hasOwnProperty('list')||!kigo.is_array(data['list']))
throw'Corrupted input';if(++depth>this.transformDepth)
return new kigoList(data.list);else
{var list=new kigoList();for(var i=0;i<data.list.length;i++)
list.add(this.transform(data.list[i],depth));return list;}}
else
throw'Corrupted input';}
else if(++depth>this.transformDepth)
return data;else
{var newData={};for(var key in data)
{if(data.hasOwnProperty(key))
newData[key]=this.transform(data[key],depth);}
return newData;}}
else if(kigo.is_array(data))
{if(++depth>this.transformDepth)
return data;var newData=[];for(var i=0;i<data.length;i++)
newData[i]=this.transform(data[i],depth);return newData;}
else
return data;}
kigoAjaxRequest2.unloading=false;if(window.addEventListener)
window.addEventListener('beforeunload',function(){kigoAjaxRequest2.unloading=true;},true);else if(window.attachEvent)
window.attachEvent('onbeforeunload',function(){kigoAjaxRequest2.unloading=true;});

function kigoAjaxRequest3(handler,data,opts)
{var brokenIE=document.all!==undefined&&window.JSON!==undefined&&(window.JSON.stringify(document.createElement('input').value)==='null'||window.JSON.stringify(document.createElement('input').value)==='"null"');var urlPrefix;var transformDepth;var on_auth,on_timeout,on_error,on_reply;this.loadingPopup=null;var submitRequest=new kigoCallback(function()
{var self=this;if(this.xhr)
{this.xhr.onreadystatechange = function(){};this.xhr=null;}
if(window.XMLHttpRequest)
this.xhr=new XMLHttpRequest();else if(document.all&&window.ActiveXObject)
{try
{this.xhr=new ActiveXObject('Msxml2.XMLHTTP.6.0');}
catch(e1)
{try
{this.xhr=new ActiveXObject('Msxml2.XMLHTTP.3.0');}
catch(e2)
{throw'kigoAjaxRequest3::kigoAjaxRequest3(): Browser lacks XMLHttpRequest support';}}}
else
throw'kigoAjaxRequest3::kigoAjaxRequest3(): Browser lacks XMLHttpRequest support';this.xhr.open('POST',urlPrefix+'ajax/router/'+handler);this.xhr.setRequestHeader('Content-Type','text/plain; charset=UTF-8');this.xhr.onreadystatechange = function()
{var data;if(self.xhr.readyState!=4)
return;if(self.loadingPopup!==null&&!(!self.xhr.status&&kigoAjaxRequest3.unloading))
{self.loadingPopup.close();self.loadingPopup=null;}
switch(self.xhr.status)
{case 403:if(on_auth.defined())
on_auth.invoke();break;case 504:if(on_timeout.defined())
on_timeout.invoke();break;case 200:try
{if(!kigo.is_string(self.xhr.responseText)||!self.xhr.responseText.length||(data=window.JSON.parse(self.xhr.responseText))===null||data===undefined)
throw'Oops';}
catch(e)
{if(on_error.defined())
on_error.invoke();break;}
if(on_reply.invoke(transformDepth>0?kigoAjaxRequest3.transform(data,1,transformDepth):data)!==true&&on_error.defined())
on_error.invoke();break;default:if(!self.xhr.status&&kigoAjaxRequest3.unloading)
return;if(on_error.defined())
on_error.invoke();}
self.xhr.onreadystatechange = function(){};self.xhr=null;if(self.timeout)
{window.clearTimeout(self.timeout);self.timeout=null;}};if(this.loading&&this.loadingPopup===null)
this.loadingPopup=kigoPopup.loading();this.timeout=window.setTimeout(function()
{self.cancel();if(on_timeout.defined())
on_timeout.invoke();},kigo.CFG.MISC.AJAXROUTER_CLIENT_TIMEOUT*1000);try
{this.xhr.send(window.JSON.stringify(data,brokenIE?function(k,v){return v===''?'':v;}:undefined));}
catch(e)
{this.cancel();if(on_error.defined())
on_error.invoke();}},this);this.xhr=null;this.timeout=null;this.loading=true;if((urlPrefix=kigo.substr(window.location.pathname,0,4))!=='/ra/'&&(urlPrefix=kigo.substr(window.location.pathname,0,7))!=='/owner/'&&(urlPrefix=kigo.substr(window.location.pathname,0,8))!=='/public/'&&(urlPrefix=kigo.substr(window.location.pathname,0,4))!=='/bo/')
urlPrefix='/';if(!kigo.is_string(handler)||!(opts=new kigoAssoc(opts)).sizeof()||!kigo.is_bool(this.loading=opts.get('loading',true))||!kigo.is_int(transformDepth=opts.get('transform_depth',10))||transformDepth<0||!(on_reply=new kigoCallback(opts.get('on_reply',null),window)).defined())
throw'kigoAjaxRequest3::kigoAjaxRequest3(): Invalid arguments.';try
{on_auth=new kigoCallback(opts.get('on_auth',function()
{kigoPopup.warn('Please authenticate','This feature requires user authentication.\n'+'Please log in and try again.',function()
{kigoFront.goLogout();});}),window);on_timeout=new kigoCallback(opts.get('on_timeout',function()
{kigoPopup.yesno('Operation timed out','The operation timed out.\n'+'Do you want to retry?',function(yesno)
{if(yesno)
submitRequest.invoke();else if(kigoDom.getBody().hasClass('app')||kigoDom.getBody().hasClass('bo'))
kigoFront.goLogout();},true);}),window);on_error=new kigoCallback(opts.get('on_error',function()
{kigoPopup.yesno('Unexpected problem','An unexpected problem occured.\n'+'Would you like to retry?',function(yesno)
{if(yesno)
submitRequest.invoke();else if(kigoDom.getBody().hasClass('app')||kigoDom.getBody().hasClass('bo'))
kigoFront.goLogout();},true);}),window);}
catch(e)
{throw'kigoAjaxRequest3::kigoAjaxRequest3(): Invalid arguments.';}
submitRequest.invoke();}
kigoAjaxRequest3.prototype.cancel = function()
{if(this.timeout!==null)
{window.clearTimeout(this.timeout);this.timeout=null;}
if(this.xhr!==null)
{if(this.loadingPopup!==null&&!kigoAjaxRequest3.unloading)
{this.loadingPopup.close();this.loadingPopup=null;}
this.xhr.onreadystatechange = function(){};this.xhr=null;}};kigoAjaxRequest3.transform = function(data,depth,maxDepth)
{if(kigo.is_object(data))
{if(data.hasOwnProperty('__kigoFrontType__'))
{if(data['__kigoFrontType__']=='kigoAssoc')
{if(!data.hasOwnProperty('assoc')||!kigo.is_array(data['assoc']))
throw'Corrupted input';var assoc=new kigoAssoc();if(++depth>maxDepth)
{for(var i=0;i<data.assoc.length;i++)
assoc.set(data.assoc[i][0],data.assoc[i][1]);}
else
{for(var i=0;i<data.assoc.length;i++)
assoc.set(data.assoc[i][0],kigoAjaxRequest3.transform(data.assoc[i][1],depth,maxDepth));}
return assoc;}
else if(data['__kigoFrontType__']=='kigoList')
{if(!data.hasOwnProperty('list')||!kigo.is_array(data['list']))
throw'Corrupted input';if(++depth>maxDepth)
return new kigoList(data.list);else
{var list=new kigoList();for(var i=0;i<data.list.length;i++)
list.add(kigoAjaxRequest3.transform(data.list[i],depth,maxDepth));return list;}}
else
throw'Corrupted input';}
else if(++depth>maxDepth)
return data;else
{var newData={};for(var key in data)
{if(data.hasOwnProperty(key))
newData[key]=kigoAjaxRequest3.transform(data[key],depth,maxDepth);}
return newData;}}
else if(kigo.is_array(data))
{if(++depth>maxDepth)
return data;var newData=[];for(var i=0;i<data.length;i++)
newData[i]=kigoAjaxRequest3.transform(data[i],depth,maxDepth);return newData;}
else
return data;};kigoAjaxRequest3.unloading=false;if(window.addEventListener)
window.addEventListener('beforeunload',function(){kigoAjaxRequest3.unloading=true;},true);else if(window.attachEvent)
window.attachEvent('onbeforeunload',function(){kigoAjaxRequest3.unloading=true;});

function kigoForm2()
{this.fields=[];this.monitor=new vkFormMonitor();this.monitorCallback=null;this.monitorPeriod=500;}
kigoForm2.FLAG_NONE=0;kigoForm2.FLAG_MANDATORY=1;kigoForm2.FLAG_MONITOR=2;kigoForm2.FLAG_READ=4;kigoForm2.FLAG_WRITE=8;kigoForm2.FLAG_READWRITE=kigoForm2.FLAG_READ|kigoForm2.FLAG_WRITE;kigoForm2.FLAG_VALIDATE=16;kigoForm2.FLAG_USER=32;kigoForm2.prototype.getFieldIndex = function(field)
{for(var i=0;i<this.fields.length;i++)
{if(this.fields[i].name==field)
return i;}
if(arguments.length>1)
throw'kigoForm2::'+arguments[1]+'() : no such field';return null;};kigoForm2.isInstance = function(i)
{return kigo.is_object(i)&&i.constructor===kigoForm2;};kigoForm2.prototype.forEachArray = function(callback,arr)
{var fields=this.fields.slice(0);if(arr.length)
{for(var i=0;i<fields.length;i++)
{for(var j=0;j<arr.length;j++)
{if((arr[j]&fields[i].flags)==arr[j])
{callback(fields[i].name,fields[i].node,this,i);break;}}}}
else
{for(var i=0;i<fields.length;i++)
callback(fields[i].name,fields[i].node,this,i);}};kigoForm2.prototype.define = function(field,element,flags)
{if(field==null)
{do
{field='_AUTO_'+Math.round(Math.random()*1000000);}while(this.getFieldIndex(field)!=null);}
else if(this.getFieldIndex(field)!=null)
throw'kigoForm2::define(): field already define()\'d';if(element===null)
return;try
{element=new kigoDom(element);}
catch(e)
{throw'kigoForm2::define(): Invalid DOM node ('+e+')';}
if(!kigo.is_int(flags))
throw'kigoForm2::define(): invalid flags';var validator;if(arguments.length>3&&arguments[3]!==null)
{if(kigo.is_function(arguments[3]))
validator=arguments[3];else if(kigo.is_array(arguments[3]))
{if(arguments[3].length&&kigo.is_string(arguments[3][0])&&kigo.is_function(kigoVal[arguments[3][0]])&&kigoVal.hasOwnProperty(arguments[3][0]))
validator=arguments[3];else
throw'kigoForm2::define(): invalid validator';}
else
throw'kigoForm2::define(): invalid validator';}
else
validator=null;this.fields.push({'name':field,'node':element,'flags':flags,'default_flags':flags,'validator':validator});return field;};kigoForm2.prototype.defined = function(field)
{return this.getFieldIndex(field)!=null?true:false;};kigoForm2.prototype.resetFlags = function()
{if(arguments.length)
{var idx=this.getFieldIndex(arguments[0],'resetFlags');this.fields[idx].flags=this.fields[idx].default_flags;}
else
{for(var i=0;i<this.fields.length;i++)
this.fields[i].flags=this.fields[i].default_flags;}};kigoForm2.prototype.setFlags = function(field,flags)
{this.fields[this.getFieldIndex(field,'setFlags')].flags=flags;};kigoForm2.prototype.addFlags = function(field,flags)
{this.fields[this.getFieldIndex(field,'addFlags')].flags|=flags;};kigoForm2.prototype.removeFlags = function(field,flags)
{this.fields[this.getFieldIndex(field,'removeFlags')].flags&=~flags;};kigoForm2.prototype.hasFlags = function(field,flags)
{return(this.fields[this.getFieldIndex(field,'hasFlags')].flags&flags)==flags;};kigoForm2.prototype.read = function(obj)
{var self=this;(new kigoAssoc(obj)).forEach(function(field,value)
{var idx=self.getFieldIndex(field);if(idx==null||!(self.fields[idx].flags&kigoForm2.FLAG_READ))
return;var obj=self.fields[idx].node.domNode();switch(obj.tagName)
{case'INPUT':switch(obj.getAttribute('type').toUpperCase())
{case'TEXT':case'PASSWORD':obj.value=(kigo.is_string(value)||kigo.is_number(value))?value:'';break;case'CHECKBOX':obj.checked=(value==1||value==true?true:false);break;case'RADIO':obj.checked=(value==1||value==true?true:false);break;}
break;case'TEXTAREA':obj.value=(kigo.is_string(value)||kigo.is_number(value))?value:'';;break;case'SELECT':(new kigoSelect2(obj)).setValue(value);break;default:throw'kigoForm2::read(): unknown DOM element type for the ['+field+'] field';}});};kigoForm2.prototype.write = function()
{var obj,field;var result=arguments.length&&kigo.is_object(arguments[0])?arguments[0]:{};for(var i=0;i<this.fields.length;i++)
{if(!(this.fields[i].flags&kigoForm2.FLAG_WRITE))
continue;field=this.fields[i].name;switch((obj=this.fields[i].node.domNode()).tagName)
{case'INPUT':switch(obj.getAttribute('type').toUpperCase())
{case'TEXT':case'PASSWORD':result[field]=obj.value;break;case'CHECKBOX':result[field]=obj.checked;break;case'RADIO':result[field]=obj.checked;break;default:throw'kigoForm2::write(): unknown DOM element type for the ['+field+'] field';}
break;case'TEXTAREA':result[field]=obj.value;break;case'SELECT':result[field]=(new kigoSelect2(obj)).getValue();break;default:throw'kigoForm2::write(): unknown DOM element type for the ['+field+'] field';}}
return result;};kigoForm2.prototype.dom = function(field)
{var idx;if((idx=this.getFieldIndex(field))==null)
throw'kigoForm2::dom(): unknown field ['+field+']';return this.fields[idx].node;};kigoForm2.prototype.getValue = function(field)
{var idx,obj;if((idx=this.getFieldIndex(field))==null)
throw'kigoForm2::getValue(): unknown field ['+field+']';switch((obj=this.fields[idx].node.domNode()).tagName)
{case'INPUT':switch(obj.getAttribute('type').toUpperCase())
{case'TEXT':case'PASSWORD':return obj.value;case'CHECKBOX':return obj.checked;case'RADIO':return obj.checked;default:throw'kigoForm2::getValue(): unknown DOM element type for the ['+field+'] field';}
break;case'TEXTAREA':return obj.value;case'SELECT':return(new kigoSelect2(obj)).getValue();default:throw'kigoForm2::getValue(): unknown DOM element type for the ['+field+'] field';}
throw'Unreachable';};kigoForm2.prototype.setupMonitor = function(callback)
{this.stopMonitor();if(typeof(callback)=='function')
{this.monitorCallback=callback;if(arguments.length>1)
this.monitorPeriod=arguments[1];}};kigoForm2.prototype.startMonitor = function()
{var i,cnt=0;this.stopMonitor();if(!this.monitorCallback)
return;for(i=0;i<this.fields.length;i++)
{if(this.fields[i].flags&kigoForm2.FLAG_MONITOR)
{++cnt;this.monitor.addElement(this.fields[i].node.domNode());}}
if(cnt)
this.monitor.monitor(this.monitorCallback,this.monitorPeriod);};kigoForm2.prototype.stopMonitor = function()
{this.monitor.reset();};kigoForm2.prototype.validate = function(field)
{var idx,value,dom,obj,validator;if((idx=this.getFieldIndex(field))==null)
throw'kigoForm2::validate(): unknown field ['+field+']';if((validator=this.fields[idx].validator)==null)
return true;value=null;dom=this.fields[idx].node;obj=dom.domNode();switch(obj.tagName)
{case'INPUT':switch(obj.getAttribute('type').toUpperCase())
{case'TEXT':case'PASSWORD':value=kigo.trim(obj.value);break;case'CHECKBOX':value=obj.checked?true:false;break;}
break;case'TEXTAREA':value=kigo.trim(obj.value);break;case'SELECT':value=(new kigoSelect2(obj)).getValue();break;}
if(kigo.is_function(validator))
{if(!validator(value,field,dom,this))
return false;}
else if(kigo.is_array(validator))
{if(!kigoVal[validator[0]].apply(kigoVal[validator[0]],[value].concat(validator.slice(1))))
return false;}
return true;};kigoForm2.prototype.missingMandatory = function()
{var mark=arguments.length?(arguments[0]?true:false):true;var missing=[];this.forEach(function(field,dom)
{var obj=dom.domNode();switch(obj.tagName)
{case'INPUT':switch(obj.getAttribute('type').toUpperCase())
{case'TEXT':case'PASSWORD':if(!kigo.trim(obj.value).length)
{missing.push(field);if(mark)
vkDom.addClass(obj,'missing');}
break;}
break;case'TEXTAREA':if(!kigo.trim(obj.value).length)
{missing.push(field);if(mark)
vkDom.addClass(obj,'missing');}
break;case'SELECT':if((new kigoSelect2(obj)).getValue()==null)
{missing.push(field);if(mark)
vkDom.addClass(obj,'missing');}
break;}},kigoForm2.FLAG_MANDATORY);return missing;};kigoForm2.prototype.missingInvalid = function()
{var mark=arguments.length?(arguments[0]?true:false):true;var missing=[];this.forEach(function(field,dom,me,idx)
{var validator=me.fields[idx].validator;function failed()
{missing.push(field);if(mark)
vkDom.addClass(dom.domNode(),'missing');}
if(validator==null)
return failed();var value=null;var obj=dom.domNode();switch(obj.tagName)
{case'INPUT':switch(obj.getAttribute('type').toUpperCase())
{case'TEXT':case'PASSWORD':value=kigo.trim(obj.value);break;case'CHECKBOX':value=obj.checked?true:false;break;}
break;case'TEXTAREA':value=kigo.trim(obj.value);break;case'SELECT':value=(new kigoSelect2(obj)).getValue();break;}
if(kigo.is_function(validator))
{if(!validator(value,field,dom,me))
return failed();}
else if(kigo.is_array(validator))
{if(!kigoVal[validator[0]].apply(kigoVal[validator[0]],[value].concat(validator.slice(1))))
return failed();}},kigoForm2.FLAG_VALIDATE);return missing;};kigoForm2.prototype.markMissing = function(field)
{if(!kigo.is_array(field))
field=[field];for(var i=0;i<field.length;i++)
vkDom.addClass(this.fields[this.getFieldIndex(field[i],'markMissing')].node.domNode(),'missing');};kigoForm2.prototype.unmarkMissing = function(field)
{if(!kigo.is_array(field))
field=[field];for(var i=0;i<field.length;i++)
vkDom.removeClass(this.fields[this.getFieldIndex(field[i],'unmarkMissing')].node.domNode(),'missing');};kigoForm2.markMissing = function(field)
{if(!kigo.is_array(field))
field=[field];for(var i=0;i<field.length;i++)
{if(!kigoDom.isInstance(field[i]))
throw'kigoForm2::markMissing() (static): bad argument';field[i].addClass('missing');}};kigoForm2.unmarkMissing = function(field)
{if(!kigo.is_array(field))
field=[field];for(var i=0;i<field.length;i++)
{if(!kigoDom.isInstance(field[i]))
throw'kigoForm2::unmarkMissing() (static): bad argument';field[i].removeClass('missing');}};kigoForm2.prototype.unmarkMissingAll = function()
{this.forEachArray(function(field,dom)
{vkDom.removeClass(dom.domNode(),'missing');},arguments);};kigoForm2.prototype.focus = function(field)
{vkDom.focus(this.fields[this.getFieldIndex(field,'focus')].node.domNode());};kigoForm2.prototype.select = function(field)
{vkDom.select(this.fields[this.getFieldIndex(field,'select')].node.domNode());};kigoForm2.prototype.forEach = function(callback)
{var a=[];for(var i=1;i<arguments.length;i++)
a.push(arguments[i]);this.forEachArray(callback,a);};kigoForm2.prototype.missingMandatoryMessage = function()
{var focusField;if(arguments.length)
{if(kigo.is_array(arguments[0])&&arguments[0].length)
focusField=arguments[0][0];else if(kigo.is_string(arguments[0]))
focusField=arguments[0];else
focusField=null;}
else
focusField=null;kigoPopup.warn('Mandatory fields','Please fill-in the mandatory fields and try again.',new kigoCallback(function()
{if(focusField!=null)
this.focus(focusField);},this));};kigoForm2.prototype.missingInvalidMessage = function()
{var focusField;if(arguments.length)
{if(kigo.is_array(arguments[0])&&arguments[0].length)
focusField=arguments[0][0];else if(kigo.is_string(arguments[0]))
focusField=arguments[0];else
focusField=null;}
else
focusField=null;kigoPopup.warn('Mandatory fields','Please fill-in the highlighted fields correctly and try again.',new kigoCallback(function()
{if(focusField!=null)
this.focus(focusField);},this));};kigoForm2.missingMandatoryMessage = function()
{var focusField;if(!arguments.length)
focusField=null;else if(kigo.is_array(arguments[0]))
{if(!kigoDom.isInstance(arguments[0][0]))
throw'kigoForm2::missingMandatoryMessage() (static): bad argument';focusField=arguments[0][0];}
else if(kigoDom.isInstance(arguments[0]))
focusField=arguments[0];else
throw'kigoForm2::missingMandatoryMessage() (static): bad argument';kigoPopup.warn('Mandatory fields','Please fill-in the mandatory fields and try again.',new kigoCallback(function()
{if(focusField!==null&&!focusField.domNode().disabled)
focusField.domNode().focus();}));};kigoForm2.missingInvalidMessage = function()
{var focusField;if(!arguments.length)
focusField=null;else if(kigo.is_array(arguments[0]))
{if(!kigoDom.isInstance(arguments[0][0]))
throw'kigoForm2::missingMandatoryMessage() (static): bad argument';focusField=arguments[0][0];}
else if(kigoDom.isInstance(arguments[0]))
focusField=arguments[0];else
throw'kigoForm2::missingMandatoryMessage() (static): bad argument';kigoPopup.warn('Mandatory fields','Please fill-in the highlighted fields correctly and try again.',new kigoCallback(function()
{if(focusField!==null&&!focusField.domNode().disabled)
focusField.domNode().focus();}));};

function kigoForm3()
{this.fields=new kigoList();this.ids=new kigoAssoc();this.changeCallback=new kigoCallback(null);}
kigoForm3.prototype.destroy = function()
{this.onChange(null);this.fields=null;this.ids=null;};kigoForm3._getFieldValue = function(field)
{if(kigoSingleSelect.isInstance(field)||kigoCheckbox.isInstance(field)||kigoDatePicker.isInstance(field))
return field.getValue();if((field.domNode().tagName=='INPUT'&&(!kigo.strcasecmp(field.domNode().getAttribute('type'),'text')||!kigo.strcasecmp(field.domNode().getAttribute('type'),'password')))||field.domNode().tagName=='TEXTAREA')
return''+field.domNode().value;return null;};kigoForm3.prototype._monitorField = function(obj)
{var self=this;if(kigoSingleSelect.isInstance(obj.field))
{if(window.addEventListener)
obj.field.domNode().addEventListener('change',obj.__monitor_callback);else if(window.attachEvent)
obj.field.domNode().attachEvent('onchange',obj.__monitor_callback);}
else if(kigoCheckbox.isInstance(obj.field))
{if(window.addEventListener)
obj.field.domNode().addEventListener('click',obj.__monitor_callback);else if(window.attachEvent)
obj.field.domNode().attachEvent('onclick',obj.__monitor_callback);}
else if(kigoDatePicker.isInstance(obj.field)||(obj.field.domNode().tagName=='INPUT'&&(!kigo.strcasecmp(obj.field.domNode().getAttribute('type'),'text')||!kigo.strcasecmp(obj.field.domNode().getAttribute('type'),'password')))||obj.field.domNode().tagName=='TEXTAREA')
{obj.__monitor_content=obj.field.domNode().value;obj.__monitor_timer=setInterval(function()
{var content=obj.field.domNode().value;if(content!==obj.__monitor_content)
{obj.__monitor_content=content;obj.__monitor_callback();}},500);}};kigoForm3.prototype._unmonitorField = function(obj)
{if(kigoSingleSelect.isInstance(obj.field))
{if(window.removeEventListener)
obj.field.domNode().removeEventListener('change',obj.__monitor_callback);else if(window.detachEvent)
obj.field.domNode().detachEvent('onchange',obj.__monitor_callback);}
else if(kigoCheckbox.isInstance(obj.field))
{if(window.removeEventListener)
obj.field.domNode().removeEventListener('click',obj.__monitor_callback);else if(window.detachEvent)
obj.field.domNode().detachEvent('onclick',obj.__monitor_callback);}
else if(kigoDatePicker.isInstance(obj.field)||(obj.field.domNode().tagName=='INPUT'&&(!kigo.strcasecmp(obj.field.domNode().getAttribute('type'),'text')||!kigo.strcasecmp(obj.field.domNode().getAttribute('type'),'password')))||obj.field.domNode().tagName=='TEXTAREA')
{clearInterval(obj.__monitor_timer);delete obj.__monitor_timer;delete obj.__monitor_content;}};kigoForm3.prototype.register = function(opts)
{var self=this;var obj={};if(!(opts=new kigoAssoc(opts)).sizeof()||!(obj.field=opts.get('field',null))||!(kigoDom.isInstance(obj.field)||kigoSingleSelect.isInstance(obj.field)||kigoCheckbox.isInstance(obj.field)||kigoDatePicker.isInstance(obj.field))||((obj.id=opts.get('id',null))!==null&&!kigo.is_string(obj.id))||!kigoCallback.isInstance(obj.validate=(function(f)
{if(kigo.is_array(f)&&f.length&&kigo.is_function(kigoVal[f[0]])&&kigoVal.hasOwnProperty(f[0]))
return new kigoCallback(function(field,value)
{return kigoVal[f[0]].apply(kigoVal[f[0]],[value].concat(f.slice(1)));});try
{return new kigoCallback(f);}
catch(e)
{return null;}})(opts.get('validate',null)))||!kigo.is_bool(obj.monitor=opts.get('monitor',true)))
throw'kigoForm3::register(): Invalid argument(s)';if(obj.id!==null)
{if(this.ids.isset(obj.id))
throw'kigoForm3::register(): Duplicate \'id\'';}
obj.__monitor_callback = function()
{if(self.changeCallback.defined())
self.changeCallback.invoke({'field':obj.field,'id':obj.id});};if(obj.monitor&&this.changeCallback.defined())
this._monitorField(obj);if(obj.id!==null)
this.ids.set(obj.id,this.fields.add(obj));else
this.fields.add(obj);return obj.field.dom();};kigoForm3.prototype.onChange = function(callback)
{var wasMonitoring=this.changeCallback.defined();var isMonitoring=(this.changeCallback=new kigoCallback(callback,this)).defined();if(!wasMonitoring&&isMonitoring)
this.fields.forEach(new kigoCallback(function(obj){if(obj.monitor){this._monitorField(obj);}},this));else if(wasMonitoring&&!isMonitoring)
this.fields.forEach(new kigoCallback(function(obj){if(obj.monitor){this._unmonitorField(obj);}},this));return this;};kigoForm3.prototype.unmarkInvalid = function()
{this.fields.forEach(function(obj){obj.field.dom().removeClass('missing');});};kigoForm3.prototype.validate = function()
{var field,ret;if(arguments.length)
{if((field=this.ids.get(arguments[0],null))===null)
return false;if(!(field=this.fields.get(field)).validate.defined())
return true;return(!kigo.is_string(ret=field.validate.invoke(field.field,kigoForm3._getFieldValue(field.field),field.id,this))&&ret);}
var firstInvalid=null;var errorString=null;this.fields.forEach(function(obj)
{var ret;if(obj.validate.defined()&&(kigo.is_string(ret=obj.validate.invoke(obj.field,kigoForm3._getFieldValue(obj.field),obj.id,this))||!ret))
{obj.field.dom().addClass('missing');if(firstInvalid===null)
firstInvalid=obj.field;if(kigo.is_string(ret)&&errorString===null)
errorString=ret;}});if(firstInvalid===null)
return true;if(!(function(node)
{while(node=node.parent())
{if(node.hasClass('kigo_popup'))
return true;}
return false;})(firstInvalid.dom()))
{try
{if(firstInvalid.dom().parent())
firstInvalid.dom().parent().domNode().scrollIntoView(true);else
firstInvalid.domNode().scrollIntoView(true);}
catch(e){}}
kigoPopup.warn('Information missing or invalid',kigo.coalesce(errorString,'Please fill-in the highlighted fields correctly and try again.'),function()
{try
{if(!firstInvalid.domNode().disabled&&(kigo.is_function(firstInvalid.domNode()['focus'])||kigo.is_object(firstInvalid.domNode()['focus'])))
firstInvalid.domNode().focus();}
catch(e){}});return false;};kigoForm3.prototype.get = function(id)
{var obj;if((id=this.ids.get(id,null))===null)
return null;obj=this.fields.get(id);return{'field':obj.field,'id':obj.id};};kigoForm3.prototype.getField = function(id)
{return(id=this.get(id))!==null?id.field:null;};kigoForm3.prototype.getValue = function(id)
{return(id=this.get(id))!==null?kigoForm3._getFieldValue(id.field):null;};kigoForm3.prototype.focus = function(id)
{if(id=this.get(id))
{if(!(function(node)
{while(node=node.parent())
{if(node.hasClass('kigo_popup'))
return true;}
return false;})(id.field.dom()))
{try
{if(id.field.dom().parent())
id.field.dom().parent().domNode().scrollIntoView(true);else
id.field.domNode().scrollIntoView(true);}
catch(e){}}
try
{if(!id.field.domNode().disabled&&(kigo.is_function(id.field.domNode()['focus'])||kigo.is_object(id.field.domNode()['focus'])))
id.field.domNode().focus();}
catch(e){}
if(arguments.length>1&&arguments[1])
{try
{if(!id.field.domNode().disabled&&(kigo.is_function(id.field.domNode()['select'])||kigo.is_object(id.field.domNode()['select'])))
id.field.domNode().select();}
catch(e){}}}};kigoForm3.prototype.list = function()
{return this.fields.map(function(obj)
{return{'field':obj.field,'id':obj.id};});};kigoForm3.prototype.listFields = function()
{return this.fields.map(function(obj){return obj.field;});};

function kigoSelect(el)
{this.el=vkDom.el(el);}
kigoSelect.prototype.element = function()
{return this.el;}
kigoSelect.prototype.domNode = function()
{return this.el;}
kigoSelect.prototype.reset = function()
{vkDom.clean(this.el);}
kigoSelect.prototype.addOption = function(value,text)
{var o=document.createElement('option');o.value=value;if(arguments.length==3)
o.className=arguments[2];o.appendChild(document.createTextNode(text));this.el.appendChild(o);return this.el.options.length-1;}
kigoSelect.prototype.insertOption = function(value,text)
{if(arguments.length==2)
insertIndex=0;else if(arguments.length==3)
insertIndex=arguments[2];else
throw'Bad usage';if(insertIndex>=this.el.options.length)
return this.addOption(value,text);var o=document.createElement('option');o.value=value;o.appendChild(document.createTextNode(text));this.el.options[insertIndex].parentNode.insertBefore(o,this.el.options[insertIndex]);if(this.el.selectedIndex>=insertIndex)
++this.el.selectedIndex;return insertIndex;}
kigoSelect.prototype.addOptionsFromArray = function(arr)
{if(arguments.length==1)
{var tmp;for(i in arr)
{switch(typeof(arr[i]))
{case'number':case'string':this.addOption(i,arr[i]);break;}}}
else if(arguments.length==3)
{var valueKey=arguments[1];var textKey=arguments[2];for(var i=0;i<arr.length;i++)
this.addOption(arr[i][valueKey],arr[i][textKey]);}
else
throw'Bad usage';}
kigoSelect.prototype.addGroup = function(group)
{this.el.appendChild(group.el);}
kigoSelect.prototype.getIndex = function()
{return this.el.selectedIndex;}
kigoSelect.prototype.setIndex = function(idx)
{return this.el.selectedIndex=idx;}
kigoSelect.prototype.getValue = function()
{if(this.el.selectedIndex<0)
return null;return this.el.options[this.el.selectedIndex].value;}
kigoSelect.prototype.getOption = function()
{if(this.el.selectedIndex<0)
return null;return this.el.options[this.el.selectedIndex];}
kigoSelect.prototype.setValue = function(value)
{if(this.el.selectedIndex<0)
return false;for(var i=0;i<this.el.options.length;i++)
{if(this.el.options[i].value==value)
{this.el.selectedIndex=i;if(vkDom.hasClass(document.body,'ua-msie-6'))
this.el.options[i].setAttribute('selected',true);return true;}}
this.el.selectedIndex=0;if(vkDom.hasClass(document.body,'ua-msie-6'))
this.el.options[0].setAttribute('selected',true);return false;}
function kigoOptgroup(text)
{this.el=document.createElement('optgroup');this.el.label=text;}
kigoOptgroup.prototype.addOption = function(value,text)
{var o=document.createElement('option');o.value=value;if(arguments.length==3)
o.className=arguments[2];o.appendChild(document.createTextNode(text));this.el.appendChild(o);}

function kigoSelect2(el)
{try
{this.node=new kigoDom(el);}
catch(e)
{throw'kigoSelect2::kigoSelect2(): Invalid DOM node';}
if(this.node.domNode().tagName!='SELECT')
throw'kigoSelect2::kigoSelect2(): Not a SELECT node';}
kigoSelect2.prototype.dom = function()
{return this.node;}
kigoSelect2.prototype.domNode = function()
{return this.node.domNode();}
kigoSelect2.prototype.reset = function()
{this.node.empty();return this;}
kigoSelect2.prototype.empty = function()
{if(kigoDom.getBody().hasClass('ua-msie-8'))
{if(!this.node.domNode().options.length)
this.addOption('dummy','dummy');this.node.domNode().options.length=0;}
this.node.empty();return this;}
kigoSelect2.prototype.addOption = function(value,text)
{this.node.append(kigoDom.create('option',{'value':value,'className':arguments.length==3?arguments[2]:''}).append(text));return this;}
kigoSelect2.prototype.addSelectOption = function()
{if(this.node.domNode().options.length)
throw'kigoSelect2::addSelectOption(): options were already added';this.node.append(kigoDom.create('option',{'value':'','className':'please_select','please_select':'1'}).append(arguments.length?arguments[0]:'-- Please select --'));return this;}
kigoSelect2.prototype.addOptions = function(obj)
{var self=this;if(arguments.length>1&&arguments[1])
this.addSelectOption();(new kigoAssoc(obj)).forEach(function(value,text)
{self.addOption(value,text);});return this;}
kigoSelect2.prototype.addNumberedOptions = function(from,to)
{from=kigo.intval(from);to=kigo.intval(to);for(var i=from;i<=to;i++)
this.addOption(i,i);return this;}
kigoSelect2.prototype.addGroup = function(group)
{if(!kigoOptgroup2.isInstance(group))
throw'kigoSelect2::addGroup(): bad argument';this.node.append(group.domNode());return this;}
kigoSelect2.prototype.getIndex = function()
{if(this.node.domNode().options.length)
return this.node.domNode().selectedIndex;return null;}
kigoSelect2.prototype.setIndex = function(idx)
{if(this.node.domNode().options.length&&idx>=0&&idx<this.node.domNode().options.length)
{this.node.domNode().selectedIndex=idx;if(vkDom.hasClass(document.body,'ua-msie-6'))
this.node.domNode().options[idx].setAttribute('selected',true);return true;}
return false;}
kigoSelect2.prototype.getValue = function()
{if(!this.node.domNode().options.length||this.node.domNode().selectedIndex<0)
return arguments.length?arguments[0]:null;var tmp;tmp=this.node.domNode().options[this.node.domNode().selectedIndex];if(tmp.getAttribute('please_select')=='1')
return null;return tmp.value;}
kigoSelect2.prototype.getText = function()
{if(!this.node.domNode().options.length||this.node.domNode().selectedIndex<0)
return arguments.length?arguments[0]:null;return this.node.domNode().options[this.node.domNode().selectedIndex].text;}
kigoSelect2.prototype.getOption = function()
{if(!this.node.domNode().options.length||this.node.domNode().selectedIndex<0)
return arguments.length?arguments[0]:null;return new kigoDom(this.node.domNode().options[this.node.domNode().selectedIndex]);}
kigoSelect2.prototype.setValue = function(value)
{if(!this.node.domNode().options.length||this.node.domNode().selectedIndex<0)
return this;for(var i=0;i<this.node.domNode().options.length;i++)
{if((this.node.domNode().options[i].value===kigo.toString(value)&&this.node.domNode().options[i].getAttribute('please_select')!='1')||(!i&&value==null&&this.node.domNode().options[i].getAttribute('please_select')=='1'))
{var prevIndex=this.node.domNode().selectedIndex;this.node.domNode().selectedIndex=i;if(vkDom.hasClass(document.body,'ua-msie-6'))
this.node.domNode().options[i].setAttribute('selected',true);if(arguments.length>1&&arguments[1]&&prevIndex!=i&&kigo.is_function(this.node.domNode().onchange))
this.node.domNode().onchange();return this;}}
return this;}
kigoSelect2.prototype.clone = function()
{return new kigoSelect2((new kigoDom(this.node)).clone());}
function kigoOptgroup2(text)
{this.node=kigoDom.create('optgroup',{'label':text,'className':arguments.length>1?arguments[1]:''});}
kigoOptgroup2.prototype.domNode = function()
{return this.node.domNode();}
kigoOptgroup2.isInstance = function(i)
{return kigo.is_object(i)&&i.constructor===kigoOptgroup2;}
kigoOptgroup2.prototype.addOption = function(value,text)
{this.node.append(kigoDom.create('option',{'value':value,'className':arguments.length==3?arguments[2]:''}).append(text));return this;}
kigoOptgroup2.prototype.addOptions = function(obj)
{var self=this;(new kigoAssoc(obj)).forEach(function(value,text)
{self.addOption(value,text);});return this;}

function kigoDatePicker(el)
{if(!arguments.length||el===null)
this.node=kigoDom.create('input',{'type':'text'});else
{try
{this.node=new kigoDom(el);}
catch(e)
{throw'kigoDatePicker::kigoDatePicker(): Invalid DOM node';}
if(this.node.domNode().tagName!='INPUT'||typeof(this.node.domNode().type)!='string'||this.node.domNode().type.toUpperCase()!='TEXT')
throw'kigoDatePicker::kigoDatePicker(): Not an INPUT TYPE="TEXT" node';}
this.node.domNode().readOnly=true;this.node.addClass('kigo_datepicker');this.isDate=true;this.current=null;this.openCallback=null;this.defaultDateCallback=null;this.changeCallback=null;this.disableCallback=null;this.displayFormat='%a, %d %b %Y';this.minYear=2000;this.maxYear=2030;var self=this;this.node.domNode().onclick = function()
{self.node.domNode().blur();self.open();}
this.empty();}
kigoDatePicker.isInstance = function(i)
{return kigo.is_object(i)&&i.constructor===kigoDatePicker;};kigoDatePicker.prototype.dom = function()
{return this.node;};kigoDatePicker.prototype.domNode = function()
{return this.node.domNode();};kigoDatePicker.prototype.setDisplayFormat = function(format)
{if(!kigo.is_string(format)||!format.length)
throw'kigoDatePicker::setDisplayFormat(): Invalid argument';var date=this.getDate();this.displayFormat=format;return date?this.setDate(date,false):this;};kigoDatePicker.prototype.setYearsRange = function(from,to)
{if(!kigo.is_int(from)||!kigo.is_int(to)||to<from)
throw'kigoDatePicker::setYearsRange(): Invalid range';this.minYear=from;this.maxYear=to;if(this.current!==null)
this.current.setRange(this.minYear,this.maxYear);return this;};kigoDatePicker.prototype.open = function()
{var self=this;var tmp;this.close();if(this.openCallback==false)
return this;if(kigo.is_function(this.openCallback))
{if(this.openCallback(this.getDate())!=true)
return this;}
this.current=new Calendar(1,this.isDate?this.node.domNode().value:(kigo.is_function(this.defaultDateCallback)&&kigoDate.isInstance(tmp=this.defaultDateCallback(this.getDate()))?tmp.date().print(this.displayFormat):''),function(cal)
{if(cal.dateClicked)
{var previous=self.getDate();self.node.domNode().value=cal.date.print(self.displayFormat);self.isDate=true;self.close();if(kigo.is_function(self.changeCallback)&&(previous===null||previous.compare(kigoDate.createFromDate(cal.date))!=0))
self.changeCallback(kigoDate.createFromDate(cal.date),previous);}},function(cal)
{self.close();});this.current.setDateFormat(this.displayFormat);this.current.setRange(this.minYear,this.maxYear);this.current.setDisabledHandler(function(date)
{return kigo.is_function(self.disableCallback)?self.disableCallback(kigoDate.createFromDate(date)):false;});this.current.create();this.current.refresh();this.current.showAtElement(this.node.domNode());return this;};kigoDatePicker.prototype.close = function()
{if(this.current)
{this.current.hide();this.current.destroy();this.current=null;}
return this;};kigoDatePicker.prototype.setText = function(text)
{var previous=this.getDate();this.close();this.node.domNode().value=text;this.isDate=false;if(arguments.length>1&&arguments[1]&&kigo.is_function(this.changeCallback)&&((arguments.length>2&&arguments[2])||previous!==null))
this.changeCallback(null,previous);return this;};kigoDatePicker.prototype.setDate = function(date)
{var previous=this.getDate();this.close();if(date===null)
{this.node.domNode().value='';this.isDate=false;}
else
{if(!kigoDate.isInstance(date))
throw'kigoDatePicker::setDate(): kigoDate instance expected.';this.node.domNode().value=date.date().print(this.displayFormat);this.isDate=true;}
if(arguments.length>1&&arguments[1]&&kigo.is_function(this.changeCallback)&&((arguments.length>2&&arguments[2])||(previous===null?date!==null:(date===null?true:date.compare(previous)!=0))))
this.changeCallback(date,previous);return this;};kigoDatePicker.prototype.getDate = function()
{if(!this.isDate||this.node.domNode().value=='')
return null;return kigoDate.createFromDisplay(this.node.domNode().value,this.displayFormat);};kigoDatePicker.prototype.getValue = function()
{var date=this.getDate();return date!==null?date.mysql():null;};kigoDatePicker.prototype.empty = function()
{return this.setDate(null,arguments.length&&arguments[0]?true:false,arguments.length>1&&arguments[1]?true:false);};kigoDatePicker.prototype.onOpen = function(callback)
{this.openCallback=callback;return this;};kigoDatePicker.prototype.defaultDate = function()
{if(!arguments.length||arguments[0]===null)
this.defaultDateCallback=null;else if(kigo.is_function(arguments[0]))
this.defaultDateCallback=arguments[0];else if(kigoDate.isInstance(arguments[0]))
{var date=arguments[0];this.defaultDateCallback = function(){return date;};}
else
throw'kigoDatePicker::defaultDate(): Bad arguments';return this;};kigoDatePicker.prototype.onChange = function(callback)
{this.changeCallback=callback;return this;};kigoDatePicker.prototype.disableDates = function()
{if(!arguments.length||(arguments.length==1&&arguments[0]===null)||(arguments.length==2&&arguments[0]===null&&arguments[1]===null))
this.disableCallback=null;else if(arguments.length==1&&kigo.is_function(arguments[0]))
this.disableCallback=arguments[0];else if(arguments.length==1&&kigoDate.isInstance(arguments[0]))
{var start=arguments[0];this.disableCallback = function(date)
{return(start!==null&&date.compare(start)>0);}}
else if(arguments.length==2&&(arguments[0]===null||kigoDate.isInstance(arguments[0]))&&(arguments[1]===null||kigoDate.isInstance(arguments[1])))
{var start=arguments[0],end=arguments[1];this.disableCallback = function(date)
{return((start!==null&&date.compare(start)>0)||(end!==null&&date.compare(end)<0));}}
else
throw'kigoDatePicker::disableDates(): Bad arguments';return this;};kigoDatePicker.prototype.clone = function()
{return new kigoDatePicker((new kigoDom(this.node)).clone());};

function kigoSingleSelect(el)
{var self=this;if(!arguments.length||el===null)
this.node=kigoDom.create('select',{'class':'kigo_singleselect'});else
{try
{this.node=new kigoDom(el);}
catch(e)
{throw'kigoSingleSelect::kigoSingleSelect(): Invalid DOM node';}
if(this.node.domNode().tagName!='SELECT')
throw'kigoSingleSelect::kigoSingleSelect(): Not a SELECT node';this.node.addClass('kigo_singleselect');}
this.config=new kigoAssoc(kigoSingleSelect.defaults);if(arguments.length>1)
{(new kigoAssoc(arguments[1])).forEach(function(key,value)
{if(self.config.isset(key)&&typeof(value)==typeof(self.config.get(key)))
self.config.set(key,value);});}
this.beforeChangeCallback=new kigoCallback(null);this.inBeforeChangeCallback=false;this.changeCallback=new kigoCallback(null);this.inChangeCallback=0;this.node.domNode().onchange = function()
{var tmp;var prevValue=self.value;self.value=self.getValue();if(self.beforeChangeCallback.defined())
{self.inBeforeChangeCallback=true;tmp=self.beforeChangeCallback.invoke(self.value,prevValue,self);self.inBeforeChangeCallback=false;if(tmp!==true)
{++self.inChangeCallback;self.setValue(prevValue);--self.inChangeCallback;return;}}
if(self.changeCallback.defined())
{++self.inChangeCallback;self.changeCallback.invoke(self.value,prevValue,self);--self.inChangeCallback;}};this.iOSBugfix=kigoDom.getBody().hasClass('ua_os-ios');this.empty();}
kigoSingleSelect.defaults={intValues:true,kigoForm2Compatible:false};kigoSingleSelect.isInstance = function(i)
{return kigo.is_object(i)&&i.constructor===kigoSingleSelect;};kigoSingleSelect.prototype.dom = function()
{return this.node;};kigoSingleSelect.prototype.domNode = function()
{return this.node.domNode();};kigoSingleSelect.prototype.empty = function()
{if(this.inBeforeChangeCallback)
throw'kigoSingleSelect::empty() canot be invoked from a onBeforeChange handler';if(kigoDom.getBody().hasClass('ua-msie')&&(kigoDom.getBody().hasClass('ua-msie-7')||kigoDom.getBody().hasClass('ua-msie-8')||kigoDom.getBody().hasClass('ua-msie-9')))
{if(!this.node.domNode().options.length)
{this.node.append(kigoDom.create('option',{'value':'dummy'}).append('dummy'));}
this.node.domNode().options.length=0;}
this.node.empty();this.value=null;this.valueHash=new kigoAssoc();this.indexHash=new kigoAssoc();return this;};kigoSingleSelect.prototype.addOption = function(value)
{if(this.config.get('intValues'))
{if(!(kigo.is_int(value)||(kigo.is_string(value)&&(value=kigo.trim(value)).length&&value===(''+kigo.intval(value)))))
throw'kigoSingleSelect::addOption(): integer value expected due to \'intValues\' config setting';value=kigo.intval(value);}
else
{if(!kigo.is_string(value)&&!kigo.is_int(value))
throw'kigoSingleSelect::addOption(): invalid value type';value=kigo.toString(value);}
if(this.valueHash.isset(value))
throw'kigoSingleSelect::addOption(): attempt to add an existing value';this.node.append(kigoDom.create('option',this.config.get('kigoForm2Compatible')?(arguments.length>2&&arguments[2]!==null?{'value':value,'class':arguments[2]}:{'value':value}):(arguments.length>2&&arguments[2]!==null?{'class':arguments[2]}:null)).append(kigo.toString(arguments.length>1?arguments[1]:value)));var index=this.valueHash.count();this.valueHash.set(value,index);this.indexHash.set(index,value);if(this.value===null)
this.value=value;return this;};kigoSingleSelect.prototype.addOptions = function(obj)
{var self=this;var cls=arguments.length>1?arguments[1]:null;if(kigoList.isInstance(obj))
{obj.forEach(function(text,idx)
{self.addOption(idx,text,cls);});}
else
{try
{obj=new kigoAssoc(obj);}
catch(e)
{throw'kigoSingleSelect::addOptions(): invalid argument';}
obj.forEach(function(value,text)
{self.addOption(value,text,cls);});}
return this;};kigoSingleSelect.prototype.addNumberedOptions = function(from,to)
{var cls=arguments.length>2?arguments[2]:null;from=kigo.intval(from);to=kigo.intval(to);for(var i=from;i<=to;i++)
this.addOption(i,i,cls);return this;};kigoSingleSelect.prototype.addGroup = function(group)
{if(!kigoSingleSelectGroup.isInstance(group))
throw'kigoSingleSelect::addGroup(): bad argument';if(group.used)
throw'kigoSingleSelect::addGroup(): a group may not added more than once';var self=this;var optgroup=kigoDom.create('optgroup',group.className!==null?{'label':group.text,'class':group.className}:{'label':group.text});this.node.append(optgroup);this.node=optgroup;try
{group.options.forEach(function(opt)
{self.addOption(opt.value,opt.text,opt.className);});}
catch(e)
{this.node=this.node.parent();throw'kigoSingleSelect::addGroup(): instance in unconsistent state due to exception: '+e;}
this.node=this.node.parent();group.used=true;return this;};kigoSingleSelect.prototype.onBeforeChange = function(callback)
{this.beforeChangeCallback=new kigoCallback(callback,this);return this;};kigoSingleSelect.prototype.onChange = function(callback)
{this.changeCallback=new kigoCallback(callback,this);return this;};kigoSingleSelect.prototype.getValue = function()
{if(!this.indexHash.count())
return null;return this.indexHash.get(this.node.domNode().selectedIndex);};kigoSingleSelect.prototype.getText = function()
{if(!this.indexHash.count())
return null;return this.node.domNode().options[this.node.domNode().selectedIndex].text;};kigoSingleSelect.prototype.setValue = function(value)
{if(this.inBeforeChangeCallback)
throw'kigoSingleSelect::setValue() canot be invoked from a onBeforeChange handler';if(this.config.get('intValues'))
{if(!(kigo.is_int(value)||(kigo.is_string(value)&&(value=kigo.trim(value)).length&&value===(''+kigo.intval(value)))))
throw'kigoSingleSelect::setValue(): integer value expected due to \'intValues\' config setting';value=kigo.intval(value);}
else
{if(!kigo.is_string(value)&&!kigo.is_int(value))
throw'kigoSingleSelect::setValue(): invalid value type';value=kigo.toString(value);}
if(!this.valueHash.isset(value))
throw'kigoSingleSelect::setValue(): no such value';if(this.value!==value)
{var prevValue=this.value;this.value=value;this.node.domNode().selectedIndex=this.valueHash.get(value);if(this.inChangeCallback&&this.iOSBugfix)
{var node=this.node.domNode(),selectedIndex=this.valueHash.get(value);setTimeout(function(){node.selectedIndex=selectedIndex;},0);}
if(arguments.length>1&&arguments[1]&&this.changeCallback.defined())
this.changeCallback.invoke(this.value,prevValue,this);}
else if(arguments.length>2&&arguments[1]&&arguments[2]&&this.changeCallback.defined())
this.changeCallback.invoke(this.value,this.value,this);return this;};kigoSingleSelect.prototype.clone = function()
{throw'kigoSingleSelect::clone(): Not implemented';};function kigoSingleSelectGroup(text)
{this.text=kigo.toString(text);this.className=arguments.length>1?arguments[1]:null;this.options=new kigoList();this.used=false;}
kigoSingleSelectGroup.isInstance = function(i)
{return kigo.is_object(i)&&i.constructor===kigoSingleSelectGroup;};kigoSingleSelectGroup.prototype.addOption = function(value)
{if(this.used)
throw'kigoSingleSelectGroup::addOption(): No options may be added after the instance was added to a kigoSingleSelect instance';this.options.add({'value':value,'text':kigo.toString(arguments.length>1?arguments[1]:value),'className':arguments.length>2?arguments[2]:null});return this;};kigoSingleSelectGroup.prototype.addOptions=kigoSingleSelect.prototype.addOptions;kigoSingleSelectGroup.prototype.addNumberedOptions=kigoSingleSelect.prototype.addNumberedOptions;

function kigoMultiSelect(el)
{var self=this;try
{this.node=new kigoDom(el);}
catch(e)
{throw'kigoMultiSelect::kigoMultiSelect(): Invalid DOM node';}
if(this.node.domNode().tagName!='INPUT'||typeof(this.node.domNode().type)!='string'||this.node.domNode().type.toUpperCase()!='TEXT')
throw'kigoMultiSelect::kigoMultiSelect(): Not an INPUT TYPE="TEXT" node';this.node.domNode().readOnly=true;this.node.addClass('kigo_multiselect');this.config=new kigoAssoc(kigoMultiSelect.defaults);if(arguments.length>1)
{(new kigoAssoc(arguments[1])).forEach(function(key,value)
{if(self.config.isset(key)&&typeof(value)==typeof(self.config.get(key)))
self.config.set(key,value);});}
this.openCallback=new kigoCallback(null);this.changeCallback=new kigoCallback(null);this.closeCallback=new kigoCallback(null);this.node.domNode().onclick = function()
{self.node.domNode().blur();if(self.current)
self.close(true);else
self.open();};this.current=null;this.empty();}
kigoMultiSelect.defaults={noneSelected:'-- Any --',selectedListPrefix:'',selectedListSurround:'',selectedListSeparator:', ',close:'close'};kigoMultiSelect.prototype.dom = function()
{return this.node;};kigoMultiSelect.prototype.domNode = function()
{return this.node.domNode();};kigoMultiSelect.prototype.addOption = function(value,text)
{this.close();if(this.options.isset(value=kigo.toString(value)))
throw'kigoMultiSelect::addOption(): option ['+value+'] already added';this.options.set(value,kigo.toString(text));if(arguments.length>2)
this.optionsClasses.set(value,arguments[2]);return this;};kigoMultiSelect.prototype.addOptions = function(obj)
{var self=this;this.close();(new kigoAssoc(obj)).forEach(function(value,text)
{if(self.options.isset(value=kigo.toString(value)))
throw'kigoMultiSelect::addOptions(): option ['+value+'] already added';self.options.set(value,kigo.toString(text));});return this;};kigoMultiSelect.prototype.empty = function()
{this.close();this.options=new kigoAssoc();this.optionsClasses=new kigoAssoc();this.selected=new kigoList();return this.set(null,arguments.length&&arguments[0]?true:false,arguments.length>1&&arguments[1]?true:false);};kigoMultiSelect.prototype.set = function(selected)
{var self=this;var previous=this.selected.clone();this.close();this.selected=new kigoList();if((selected=new kigoList(selected)).length())
{selected.forEach(function(value,idx,original)
{if(self.options.isset(value=kigo.toString(value)))
self.selected.add(value);});}
this._updateText();if(this.changeCallback.defined()&&arguments.length>1&&arguments[1]&&((arguments.length>2&&arguments[2])||this._differ(this.selected,previous)))
this.changeCallback.invoke(this.selected,previous,this);return this;};kigoMultiSelect.prototype.get = function()
{return this.selected.clone();};kigoMultiSelect.getAbsolutePoisition = function(el)
{var pos={'x':el.offsetLeft,'y':el.offsetTop};if(el.offsetParent&&getStyle(el.offsetParent,'position')!=='absolute'&&getStyle(el.offsetParent,'position')!=='relative')
{var tmp=kigoMultiSelect.getAbsolutePoisition(el.offsetParent);pos.x+=tmp.x;pos.y+=tmp.y;}
function getStyle(el,styleProp)
{if(el.currentStyle)
return el.currentStyle[styleProp];if(window.getComputedStyle)
return document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);return null;}
return pos;};kigoMultiSelect.prototype.open = function()
{var self=this;this.close();if(this.openCallback.defined()&&!this.openCallback.invoke(this))
return this;var pos=kigoMultiSelect.getAbsolutePoisition(this.node.domNode());var parent=this.node.parentNode();if(!parent)
return this;this.node.addClass('open');this.current=kigoDom.create('div',{'class':'kigo_multiselect'},{'width':this.node.domNode().clientWidth+'px','left':pos.x+'px','top':(pos.y+this.node.domNode().offsetHeight)+'px'});this.options.forEach(function(value,text)
{var myself;self.current.append(kigoDom.create('label').append(myself=kigoDom.create('input',{'type':'checkbox','checked':self.selected.find(value),'class':self.optionsClasses.get(value,'')},null,{'click':function()
{var previous=self.selected.clone();if(myself.domNode().checked)
self.selected.add(value);else
self.selected.remove(self.selected.pos(value));self._updateText();if(self.changeCallback.defined())
self.changeCallback.invoke(self.selected,previous,self);}}),kigoDom.create('span').append(text)));});parent.append(this.current);this._toggleDocumentEvents(true);return this;};kigoMultiSelect.prototype.close = function()
{if(this.current)
{this._toggleDocumentEvents(false);this.current.orphanize().empty();this.current=null;this.node.removeClass('open');if(arguments.length&&arguments[0]&&this.closeCallback.defined())
this.closeCallback.invoke(this);}
return this;};kigoMultiSelect.prototype.onOpen = function(callback)
{if(callback===false)
callback = function(){return false;};this.openCallback=new kigoCallback(callback,this);return this;};kigoMultiSelect.prototype.onChange = function(callback)
{this.changeCallback=new kigoCallback(callback,this);return this;};kigoMultiSelect.prototype.onClose = function(callback)
{this.closeCallback=new kigoCallback(callback);return this;};kigoMultiSelect.prototype._updateText = function()
{if(!this.selected.length())
this.node.domNode().value=this.config.get('noneSelected');else
{var self=this;var surround=this.config.get('selectedListSurround'),separator=this.config.get('selectedListSeparator');var text='';this.options.forEach(function(value,label)
{if(self.selected.find(value))
text+=(text.length?separator:'')+surround+label+surround;});this.node.domNode().value=this.config.get('selectedListPrefix')+text;}
if(kigoDom.getBody().hasClass('ua-msie'))
{try
{this.node.domNode().scrollLeft=this.node.domNode().scrollWidth;}
catch(e){}}};kigoMultiSelect.prototype._differ = function(a,b)
{if(a.length()!=b.length())
return true;try
{a.forEach(function(value)
{if(!b.find(value,true))
throw'Not found';});}
catch(e)
{return true;}
return false;};kigoMultiSelect.prototype._toggleDocumentEvents = function(toggle)
{var self=this;if(toggle)
{this.documentClickEvent = function(ev)
{var target;for(target=new kigoDom(typeof(ev.target)!='undefined'?ev.target:window.event.srcElement);target&&target.domNode()!=self.node.domNode()&&target.domNode()!=self.current.domNode();target=target.parentNode());if(!target)
self.close(true);};this.documentResizeEvent = function()
{var pos=Calendar.getAbsolutePos(self.node.domNode());self.current.domNode().style.left=pos.x+'px';self.current.domNode().style.top=(pos.y+self.node.domNode().offsetHeight)+'px';};if(window.addEventListener)
{document.addEventListener('mousedown',this.documentClickEvent,false);window.addEventListener('resize',this.documentResizeEvent,false);}
else if(window.attachEvent)
{document.attachEvent('onmousedown',this.documentClickEvent);window.attachEvent('onresize',this.documentResizeEvent);}}
else
{if(window.addEventListener)
{document.removeEventListener('mousedown',this.documentClickEvent,false);window.removeEventListener('resize',this.documentResizeEvent,false);}
else if(window.attachEvent)
{document.detachEvent('onmousedown',this.documentClickEvent);window.detachEvent('onresize',this.documentResizeEvent);}
this.documentClickEvent=null;}};

function kigoCallback(method)
{if(method===null)
this.method=null;else if(kigoCallback.isInstance(method))
{this.method=method.method;this.context=method.context;}
else if(kigo.is_function(method))
{this.method=method;this.context=arguments.length>1?arguments[1]:window;}
else
throw'Invalid argument (function or kigoCallback instance expected)';}
kigoCallback.isInstance = function(i)
{return kigo.is_object(i)&&i.constructor===kigoCallback;}
kigoCallback.prototype.defined = function()
{return this.method!==null;}
kigoCallback.prototype.invoke = function()
{if(this.method===null)
throw'Cannot invoke undefined callback';return this.method.apply(this.context,arguments);}
kigoCallback.prototype.passthru = function(args)
{if(this.method===null)
throw'Cannot invoke undefined callback';if(arguments.length!=1||args.constructor!==arguments.constructor)
throw'Invalid argument';return this.method.apply(this.context,args);}

function kigoList()
{if(arguments.length)
{if(kigoList.isInstance(arguments[0]))
this.list=arguments[0].list;else if(kigo.is_array(arguments[0]))
this.list=arguments[0];else if(kigo.is_object(arguments[0])&&arguments[0].constructor===arguments.constructor)
{this.list=[];for(var i=0;i<arguments[0].length;i++)
this.list.push(arguments[0][i]);}
else
this.list=[];}
else
this.list=[];}
kigoList.createFromCSV = function(csv,separator)
{return new kigoList((kigo.is_string(csv)&&csv.length&&kigo.is_string(separator))?csv.split(separator):[]);};kigoList.merge = function()
{var instance=new kigoList();for(var i=0;i<arguments.length;i++)
{(new kigoList(arguments[i])).forEach(function(item)
{instance.add(item);});}
return instance;};kigoList.prototype.empty = function()
{this.list=[];};kigoList.prototype.length = function()
{return this.list.length;};kigoList.prototype.find = function(value)
{if(arguments.length>1&&arguments[1])
return this.any(function(v){return v===value;});return this.any(function(v){return v==value;});};kigoList.prototype.pos = function(value)
{var i;if(arguments.length>1&&arguments[1])
{for(i=0;i<this.list.length;i++)
{if(this.list[i]===value)
return i;}}
else
{for(i=0;i<this.list.length;i++)
{if(this.list[i]==value)
return i;}}
return null;};kigoList.prototype.isSingle = function(idx)
{return(idx>=0&&idx<this.list.length)?(!idx&&this.list.length==1?true:false):null;};kigoList.prototype.isFirst = function(idx)
{return(idx>=0&&idx<this.list.length)?(idx?false:true):null;};kigoList.prototype.isLast = function(idx)
{return(idx>=0&&idx<this.list.length)?(idx==this.list.length-1?true:false):null;};kigoList.prototype.exists = function(idx)
{return(kigo.is_int(idx)||kigo.is_string(idx))&&''+kigo.intval(idx)==''+idx&&idx>=0&&idx<this.list.length;};kigoList.prototype.remove = function(idx)
{var removed;if(!this.exists(idx))
return null;removed=this.list[idx];for(var i=idx;i<this.list.length-1;i++)
this.list[i]=this.list[i+1];this.list.pop();return removed;};kigoList.prototype.shift = function()
{return this.remove(0);};kigoList.prototype.pop = function()
{return this.remove(this.list.length-1);};kigoList.prototype.add = function(value)
{return this.list.push(value)-1;};kigoList.prototype.insertBefore = function(value,idx)
{if(idx==null)
return this.add(value);if(!this.exists(idx))
return null;for(var i=this.list.length;i>idx;i--)
this.list[i]=this.list[i-1];this.list[idx]=value;return idx;};kigoList.prototype.move = function(idx,where)
{if(!this.exists(idx)||!this.exists(where))
return null;if(idx==where)
return idx;var i,tmp;if(where<idx)
{tmp=this.list[idx];for(i=idx;i>where;i--)
this.list[i]=this.list[i-1];this.list[where]=tmp;}
else if(where>idx)
{tmp=this.list[idx];for(i=idx;i<where;i++)
this.list[i]=this.list[i+1];this.list[where]=tmp;}
return where;};kigoList.prototype.get = function(idx)
{if(!this.exists(idx))
return null;return this.list[idx];};kigoList.prototype.getFirst = function()
{return this.get(0);};kigoList.prototype.getLast = function()
{return this.get(this.list.length-1);};kigoList.prototype.forEach = function(callback)
{var clone=this.list.slice(0);if(!(callback=new kigoCallback(callback,arguments.length>1?arguments[1]:window)).defined())
throw'Callback expected';for(var i=0;i<clone.length;i++)
callback.invoke(clone[i],i,this);};kigoList.prototype.every = function(callback)
{var clone=this.list.slice(0);if(!(callback=new kigoCallback(callback,arguments.length>1?arguments[1]:window)).defined())
throw'Callback expected';for(var i=0;i<clone.length;i++)
{if(!callback.invoke(clone[i],i,this))
return false;}
return true;};kigoList.prototype.any = function(callback)
{var tmp,clone=this.list.slice(0);if(!(callback=new kigoCallback(callback,arguments.length>1?arguments[1]:window)).defined())
throw'Callback expected';for(var i=0;i<clone.length;i++)
{if((tmp=callback.invoke(clone[i],i,this)))
return tmp;}
return false;};kigoList.prototype.reduce = function(callback)
{var tmp,clone=this.list.slice(0),result=arguments.length>1?arguments[1]:null;if(!(callback=new kigoCallback(callback,window)).defined())
throw'Callback expected';for(var i=0;i<clone.length;i++)
result=callback.invoke(clone[i],i,result,this);return result;};kigoList.prototype.filter = function(callback)
{var clone=this.list.slice(0);var newList=new kigoList();if(!(callback=new kigoCallback(callback,arguments.length>1?arguments[1]:window)).defined())
throw'Callback expected';for(var i=0;i<clone.length;i++)
{if(callback.invoke(clone[i],i,this))
newList.add(clone[i]);}
return newList;};kigoList.prototype.map = function(callback)
{var clone=this.list.slice(0);var newList=new kigoList();if(!(callback=new kigoCallback(callback,arguments.length>1?arguments[1]:window)).defined())
throw'Callback expected';for(var i=0;i<clone.length;i++)
newList.add(callback.invoke(clone[i],i,this));return newList;}
kigoList.prototype.reverse = function()
{return new kigoList(this.list.slice(0).reverse())};kigoList.prototype.sort = function(callback)
{var clone=this.list.slice(0);if(!(callback=new kigoCallback(callback,window)).defined())
throw'Callback expected';clone.sort(function(a,b)
{return callback.invoke(a,b);});return new kigoList(clone);};kigoList.prototype.shuffle = function()
{var i,j,clone,tempi,tempj;if(!(i=this.list.length))
return new kigoList();clone=this.list.slice(0);while(--i)
{tempi=clone[i];tempj=clone[j=Math.floor(Math.random()*(i+1))];clone[i]=tempj;clone[j]=tempi;}
return new kigoList(clone);};kigoList.prototype.clone = function()
{return new kigoList(this.array());};kigoList.prototype.array = function()
{return this.list.slice(0);};kigoList.prototype.CSV = function(separator)
{return this.list.length?this.list.join(separator):'';};kigoList.isInstance = function(i)
{return kigo.is_object(i)&&i.constructor===kigoList;};

function kigoDate(day,month,year)
{if((this.day=parseInt(day,10))<1||this.day>31||(this.month=parseInt(month,10))<1||this.month>12||this.day<1||this.day>monthDays(this.month,this.year=parseInt(year,10)))
throw'kigoDate::kigoDate(): invalid date';function monthDays(month,year)
{switch(month)
{case 1:case 3:case 5:case 7:case 8:case 10:case 12:return 31;case 4:case 6:case 9:case 11:return 30;case 2:return!(year%4)&&((year%100)||!(year%400))?29:28;default:return 0;}}}
kigoDate.today = function()
{return kigoDate.createFromDate(new Date());};kigoDate.createFromDate = function(date)
{if(date.constructor!=Date.prototype.constructor)
throw'kigoDate::createFromDate(): invalid Date object';return new kigoDate(date.getDate(),date.getMonth()+1,date.getFullYear());};kigoDate.createFromMysql = function(mysql)
{if(typeof(mysql)!='string'||mysql.length<10||!mysql.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}/i))
throw'kigoDate::createFromMysql(): invalid input';return new kigoDate(mysql.substr(8,2),mysql.substr(5,2),mysql.substr(0,4));};kigoDate.createFromDisplay = function(string)
{return kigoDate.createFromDate(Date.parseDate(string,arguments.length>1?arguments[1]:'%a, %d %b %Y'));};kigoDate.prototype.clone = function()
{return new kigoDate(this.day,this.month,this.year);};kigoDate.MON=1;kigoDate.TUE=2;kigoDate.WED=3;kigoDate.THU=4;kigoDate.FRI=5;kigoDate.SAT=6;kigoDate.SUN=7;kigoDate.isInstance = function(i)
{return kigo.is_object(i)&&i.constructor===kigoDate;};kigoDate.prototype.getDay = function(){return this.day;};kigoDate.prototype.getMonth = function(){return this.month;};kigoDate.prototype.getYear = function(){return this.year;};kigoDate.prototype.getDayOfWeek = function()
{var tmp;return(tmp=this.date().getDay())?tmp:7;};kigoDate.prototype.mysql = function()
{function pad(number,digits)
{number=''+number;while(number.length<digits)
number='0'+number;return number;}
return pad(this.year,4)+'-'+pad(this.month,2)+'-'+pad(this.day,2);};kigoDate.prototype.display = function()
{return this.date().print(arguments.length?arguments[0]:'%a, %d %b %Y');};kigoDate.prototype.date = function()
{var d=Date.parseDate(this.mysql(),'%Y-%m-%d');d.setHours(0,0,0,0);return d;};kigoDate.prototype.addYears = function(years)
{years=kigo.intval(years);if(this.month!=2)
return new kigoDate(this.day,this.month,this.year+years);return new kigoDate(Math.min(this.day,(new kigoDate(1,this.month,this.year+years)).date().getMonthDays()),this.month,this.year+years);};kigoDate.prototype.addMonths = function(months)
{var month,year;months=kigo.intval(months);if((month=this.month-1+months)>=0)
{year=this.year+Math.floor(month/12);month=(month%12)+1;}
else
{year=this.year-1-Math.floor((Math.abs(month)-1)/12);month=12-(Math.abs(month)-1)%12;}
return new kigoDate(Math.min(this.day,(new kigoDate(1,month,year)).date().getMonthDays()),month,year);};kigoDate.prototype.addDays = function(days)
{var d=this.date();d.setDate(d.getDate()+kigo.intval(days));return kigoDate.createFromDate(d);};kigoDate.prototype.firstMonthDay = function()
{return new kigoDate(1,this.month,this.year);};kigoDate.prototype.lastMonthDay = function()
{return new kigoDate(this.date().getMonthDays(),this.month,this.year);};kigoDate.prototype.daysDiff = function(other)
{var current=this.date();var other=other.date();return Math.round((other.getTime()-current.getTime())/86400000);};kigoDate.prototype.compare = function(other)
{var diff;if(!kigoDate.isInstance(other))
throw'kigoDate::compare(): not a kigoDate object';if((diff=other.getYear()-this.year)||(diff=other.getMonth()-this.month)||(diff=other.getDay()-this.day))
return diff;return 0;};kigoDate.prototype.inRange = function(begin,end)
{return this.compare(begin)<=0&&this.compare(end)>=0;};kigoDate.min = function(date)
{if(!kigoDate.isInstance(date))
throw'kigoDate::min(): not a kigoDate object';var current=date;for(var i=1;i<arguments.length;i++)
{if(!kigoDate.isInstance(arguments[i]))
throw'kigoDate::min(): not a kigoDate object';if(current.compare(arguments[i])<0)
current=arguments[i];}
return current.clone();};kigoDate.max = function(date)
{if(!kigoDate.isInstance(date))
throw'kigoDate::max(): not a kigoDate object';var current=date;for(var i=1;i<arguments.length;i++)
{if(!kigoDate.isInstance(arguments[i]))
throw'kigoDate::max(): not a kigoDate object';if(current.compare(arguments[i])>0)
current=arguments[i];}
return current.clone();};

function kigoDateTime(day,month,year,hours,minutes,seconds)
{if((this.day=parseInt(day,10))<1||this.day>31||(this.month=parseInt(month,10))<1||this.month>12||this.day<1||this.day>monthDays(this.month,this.year=parseInt(year,10))||(this.hours=parseInt(hours,10))<0||this.hours>23||(this.minutes=parseInt(minutes,10))<0||this.minutes>59||(this.seconds=parseInt(seconds,10))<0||this.seconds>59)
throw'kigoDateTime::kigoDateTime(): invalid datetime';function monthDays(month,year)
{switch(month)
{case 1:case 3:case 5:case 7:case 8:case 10:case 12:return 31;case 4:case 6:case 9:case 11:return 30;case 2:return!(year%4)&&((year%100)||!(year%400))?29:28;default:return 0;}}}
kigoDateTime.createFromDate = function(date)
{if(date.constructor!=Date.prototype.constructor)
throw'kigoDateTime::createFromDate(): invalid Date object';return new kigoDateTime(date.getDate(),date.getMonth()+1,date.getFullYear(),date.getHours(),date.getMinutes(),date.getSeconds());};kigoDateTime.createFromMysql = function(mysql)
{if(typeof(mysql)!='string'||!mysql.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-2][0-9]:[0-6][0-9]:[0-6][0-9]$/i))
throw'kigoDateTime::createFromMysql(): invalid input';return new kigoDateTime(mysql.substr(8,2),mysql.substr(5,2),mysql.substr(0,4),mysql.substr(11,2),mysql.substr(14,2),mysql.substr(17,2));};kigoDateTime.prototype.clone = function()
{return new kigoDateTime(this.day,this.month,this.year,this.hours,this.minutes,this.seconds);};kigoDateTime.prototype.kigoDate = function()
{return new kigoDate(this.day,this.month,this.year);};kigoDateTime.isInstance = function(i)
{return kigo.is_object(i)&&i.constructor===kigoDateTime;};kigoDateTime.prototype.getDay = function(){return this.day;};kigoDateTime.prototype.getMonth = function(){return this.month;};kigoDateTime.prototype.getYear = function(){return this.year;};kigoDateTime.prototype.getHours = function(){return this.hours;};kigoDateTime.prototype.getMinutes = function(){return this.minutes;};kigoDateTime.prototype.getSeconds = function(){return this.seconds;};kigoDateTime.prototype.mysql = function()
{function pad(number,digits)
{number=''+number;while(number.length<digits)
number='0'+number;return number;}
return pad(this.year,4)+'-'+pad(this.month,2)+'-'+pad(this.day,2)+' '+pad(this.hours,2)+':'+pad(this.minutes,2)+':'+pad(this.seconds,2);};kigoDateTime.prototype.display = function(format)
{return this.date().print(arguments.length?arguments[0]:'%a, %d %b %Y %H:%M:%S');};kigoDateTime.prototype.date = function()
{return new Date(this.year,this.month-1,this.day,this.hours,this.minutes,this.seconds,0);};kigoDateTime.prototype.addYears = function(years)
{years=kigo.intval(years);if(this.month!=2)
return new kigoDateTime(this.day,this.month,this.year+years,this.hours,this.minutes,this.seconds);return new kigoDateTime(Math.min(this.day,(new kigoDate(1,this.month,this.year+years)).date().getMonthDays()),this.month,this.year+years,this.hours,this.minutes,this.seconds);};kigoDateTime.prototype.addMonths = function(months)
{var month,year;months=kigo.intval(months);if((month=this.month-1+months)>=0)
{year=this.year+Math.floor(month/12);month=(month%12)+1;}
else
{year=this.year-1-Math.floor((Math.abs(month)-1)/12);month=12-(Math.abs(month)-1)%12;}
return new kigoDateTime(Math.min(this.day,(new kigoDate(1,month,year)).date().getMonthDays()),month,year,this.hours,this.minutes,this.seconds);};kigoDateTime.prototype.addDays = function(days)
{var d=this.date();d.setDate(d.getDate()+kigo.intval(days));return kigoDateTime.createFromDate(d);};kigoDateTime.prototype.addHours = function(hours)
{var d=this.date();d.setHours(d.getHours()+kigo.intval(hours));return kigoDateTime.createFromDate(d);};kigoDateTime.prototype.addMinutes = function(minutes)
{var d=this.date();d.setMinutes(d.getMinutes()+kigo.intval(minutes));return kigoDateTime.createFromDate(d);};kigoDateTime.prototype.addSeconds = function(seconds)
{var d=this.date();d.setSeconds(d.getSeconds()+kigo.intval(seconds));return kigoDateTime.createFromDate(d);};kigoDateTime.prototype.secondsDiff = function(other)
{if(!kigoDateTime.isInstance(other))
throw'kigoDateTime::secondsDiff(): not a kigoDateTime object';return Math.round(Date.UTC(other.year,other.month-1,other.day,other.hours,other.minutes,other.seconds,0)/1000)-Math.round(Date.UTC(this.year,this.month-1,this.day,this.hours,this.minutes,this.seconds,0)/1000);};kigoDateTime.prototype.compare = function(other)
{var diff;if(!kigoDateTime.isInstance(other))
throw'kigoDateTime::compare(): not a kigoDate object';if((diff=other.getYear()-this.year)||(diff=other.getMonth()-this.month)||(diff=other.getDay()-this.day)||(diff=other.getHours()-this.hours)||(diff=other.getMinutes()-this.minutes)||(diff=other.getSeconds()-this.seconds))
return diff;return 0;};kigoDateTime.min = function(date)
{if(!kigoDateTime.isInstance(date))
throw'kigoDateTime::min(): not a kigoDateTime object';var current=date;for(var i=1;i<arguments.length;i++)
{if(!kigoDateTime.isInstance(arguments[i]))
throw'kigoDateTime::min(): not a kigoDateTime object';if(current.compare(arguments[i])<0)
current=arguments[i];}
return current.clone();};kigoDateTime.max = function(date)
{if(!kigoDateTime.isInstance(date))
throw'kigoDateTime::max(): not a kigoDateTime object';var current=date;for(var i=1;i<arguments.length;i++)
{if(!kigoDateTime.isInstance(arguments[i]))
throw'kigoDateTime::max(): not a kigoDateTime object';if(current.compare(arguments[i])>0)
current=arguments[i];}
return current.clone();};

var kigoVal={'IN':function(value)
{var tmp,args=new kigoList(arguments);args.remove(0);if(args.length()==1&&(kigo.is_array(tmp=args.get(0))||kigoList.isInstance(tmp)))
args=new kigoList(tmp);return args.find(value,false);},'INN':function(value)
{var tmp,args=new kigoList(arguments);args.remove(0);if(args.length()==1&&(kigo.is_array(tmp=args.get(0))||kigoList.isInstance(tmp)))
args=new kigoList(tmp);return args.find(value,true);},'CHR':function(value,len)
{return(value=kigo.trim(value)).length==len;},'CHRCONTENT':function(value,pool,len)
{return kigoVal.CHR((value=kigo.trim(value)),len)&&kigoVal.STRCONTENT(value,pool);},'VCHR':function(value,max)
{var len=(value=kigo.trim(value)).length;return len<=max&&len>=(arguments.length<3?0:arguments[2]);},'VCHRCONTENT':function(value,pool,max)
{return kigoVal.VCHR((value=kigo.trim(value)),max,arguments.length<4?0:arguments[3])&&kigoVal.STRCONTENT(value,pool);},'BINARY':function(value,len)
{return kigo.binlen(kigo.trim(value))==len;},'VBINARY':function(value,max)
{var len=kigo.binlen(kigo.trim(value));return len<=max&&len>=(arguments.length<3?0:arguments[2]);},'INT8':function(value)
{return kigoVal.INTX(value,0xFF,arguments.length>1?arguments[1]:null,arguments.length>2?arguments[2]:null);},'INT16':function(value)
{return kigoVal.INTX(value,0xFFFF,arguments.length>1?arguments[1]:null,arguments.length>2?arguments[2]:null);},'INT31':function(value)
{return kigoVal.INTX(value,0x7FFFFFFF,arguments.length>1?arguments[1]:null,arguments.length>2?arguments[2]:null);},'DECIMAL':function(value)
{return kigoVal.DECIMAL_VALUE(value,arguments.length>1?arguments[1]:2,arguments.length>2?arguments[2]:null,arguments.length>3?arguments[3]:null)!==null?true:false;},'DECIMAL_VALUE':function(value)
{var decimals=arguments.length>1?arguments[1]:2;var minValue=arguments.length>2?arguments[2]:null;var maxValue=arguments.length>3?arguments[3]:null;var tmp;if(!kigoVal.VCHRCONTENT(value=kigo.trim(value),((minValue===null||minValue<0?'-':'')+'0123456789.,\''),99,1)||kigo.strpos(value,'-',1)!==null||value=='-')
return null;value=value.split('\'').join('');value=value.split(',').join('.');tmp=value.split('.');if(tmp.length==1)
{value=kigo.intval(value);if((minValue!==null&&value<minValue)||(maxValue!==null&&value>maxValue))
return null;return value;}
else if(tmp.length==2)
{var integer=kigo.intval(tmp[0]);var decimal=tmp[1];while(kigo.substr(decimal,-1)==='0')
decimal=kigo.substr(decimal,0,-1);if(decimal.length)
{if(decimal.length>decimals)
return null;value=integer+'.'+decimal;}
else
value=integer;if((minValue!==null&&kigo.floatval(value)<minValue)||(maxValue!==null&&kigo.floatval(value)>maxValue))
return null;return kigo.floatval(value);}
else
return null;},'BOOL':function(value)
{if(value===true||value===1||value==='1')
value=true;else if(value===false||value===0||value==='0')
value=false;else
return false;return true;},'EMAIL':function(value)
{var mandatory=arguments.length<2?true:(arguments[1]?true:false);var value=kigo.trim(value);if(!mandatory&&!value.length)
return true;if(!kigoVal.VCHR(value,kigo.CFG.MISC.MAXLEN_EMAIL,0))
return false;var atom='[-a-z0-9!#$%&\'*+\\/=?^_`{|}~]';var regex='^'+atom+'+'+'(\\.'+atom+'+)*'+'@'+'('+'[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?'+'\\.)+'+'[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])'+'$';return(new RegExp(regex,'i')).test(value)?true:false;},'USERNAME':function(value)
{return(kigoVal.VCHRCONTENT(value,'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._',kigo.CFG.ACCOUNT.USERNAME_MAX_CHARS,kigo.CFG.ACCOUNT.USERNAME_MIN_CHARS)&&kigo.trim(value).match(/(^[._])|[._]{2}|([._]$)/)===null);},'PASSWORD':function(value)
{return kigoVal.VCHR(value,100,kigo.CFG.ACCOUNT.PASSWORD_MIN_CHARS);},'HOUR':function(value)
{return kigoVal.INT8(value,0,23);},'MINUTE':function(value)
{return kigoVal.INT8(value,0,59);},'GMAPCOORD':function(value)
{var tmp=value.split('.');var s=tmp.length;var decimalPart,floatPart;if(s==1)
{decimalPart=tmp[0];floatPart=null;}
else if(s==2)
{decimalPart=tmp[0];floatPart=tmp[1];}
else
return false;if(decimalPart.length&&decimalPart.substring(0,1)=='-')
decimalPart=decimalPart.substr(1,decimalPart.length-1);if(!kigoVal.INT8(decimalPart,0,180)||floatPart===null)
return false;return kigoVal.VCHRCONTENT(floatPart,'0123456789',20,1);},'GMAPZOOM':function(value)
{return kigoVal.INT8(value,0,23);},'GANALYTICS':function(value)
{var mandatory=arguments.length<2?true:(arguments[1]?true:false);var value=kigo.trim(value);if(!mandatory&&!value.length)
return true;if(!kigoVal.VCHR(value,kigo.CFG.WS.GOOGLE_ANALYTICS_MAX_LENGTH,kigo.CFG.WS.GOOGLE_ANALYTICS_MIN_LENGTH))
return false;var googleCodeFilter=/^UA-[0-9]+-[0-9]+$/i;if(!value.match(googleCodeFilter))
return false;return true;},'URL':function(value)
{var mandatory=arguments.length<2?true:(arguments[1]?true:false);var value=kigo.trim(value);var https;if(!mandatory&&!value.length)
return true;if(!kigoVal.VCHR(value,kigo.CFG.MISC.MAXLEN_URL,0))
return false;if(value.substr(0,7).toLowerCase()=='http://')
{https=false;value=value.substr(7,value.length-1);}
else if(value.substr(0,8).toLowerCase()=='https://')
{https=true;value=value.substr(8,value.length-1);}
else
https=false;if(!value.length)
{if(mandatory)
return false;return true;}
var exp=/^[a-z0-9-]+(\.[a-z0-9-]+)+(:[0-9]+)?(\/.*)?$/i;if(!exp.test(value))
return false;return true;},'DOMAIN':function(value)
{var rgxpDomain="([a-z0-9]([-a-z0-9]*[a-z0-9]+)?)";var exp=new RegExp('^('+rgxpDomain+'{1,63}\\.)+'+rgxpDomain+'{2,63}$','i');if(!kigoVal.VCHR(value,kigo.CFG.MISC.MAXLEN_DOMAIN)||!exp.test(value))
return false;return true;},'REQKEY':function(value)
{return kigoVal.CHRCONTENT(value,'0123456789abcdef',32);},'LATITUDE':function(value)
{var mandatory=arguments.length<2?true:(arguments[1]?true:false);value=kigo.trim(value);if(!mandatory&&!value.length)
return true;var exp=new RegExp(/^-?([0-8]?\d($|\.[\d]+$)|90($|\.[0]+$))/);return exp.test(value);},'LONGITUDE':function(value)
{var mandatory=arguments.length<2?true:(arguments[1]?true:false);value=kigo.trim(value);if(!mandatory&&!value.length)
return true;var exp=new RegExp(/^-?((\d{1,2}|1[0-7]\d)($|\.[\d]+$)|180($|\.[0]+$))/);return exp.test(value);},'STRCONTENT':function(value,pool)
{var len=(value=kigo.trim(value)).length;for(var i=0;i<len;i++)
{if(pool.indexOf(value.substr(i,1))==-1)
return false;}
return true;},'INTX':function(value,Xmax,min,max)
{if(!kigoVal.VCHRCONTENT(value,'0123456789',99,1))
return false;min=(min==null)?0:Math.min(Xmax,Math.max(0,min));max=(max==null)?Xmax:Math.max(1,Math.min(Xmax,max));return(value=parseInt(kigo.trim(value),10))>=min&&value<=max;}};

function kigoPager(containers,text,itemsPerPage,callback)
{var self=this;this.containers=new kigoList();if(!kigo.is_array(containers))
containers=[containers];(new kigoList(containers)).forEach(function(container)
{try
{container=new kigoDom(container);}
catch(e)
{throw'kigoPager::kigoPage(): invalid container(s)';}
container.addClass('kigo_pager');self.containers.add(container);});this.text=text;this.itemsPerPage=itemsPerPage;this.callback=callback;this.currentTotal=0;this.currentPage=1;this.currentPages=0;}
kigoPager.prototype.page = function()
{return this.currentPage;}
kigoPager.prototype.total = function()
{return this.currentTotal;}
kigoPager.prototype.write = function(po)
{po.PAGER={'PERPAGE':this.itemsPerPage,'PAGE':(arguments.length>1&&arguments[1]==true)?1:this.currentPage};return po;}
kigoPager.prototype.read = function(result)
{var self=this;function disableContainers()
{self.containers.forEach(function(container)
{container.empty().domNode().style.display='none';});}
if(!kigo.is_object(result['PAGER']))
{this.currentPages=0;this.currentTotal=0;return disableContainers();}
this.currentPage=kigo.intval(result.PAGER.PAGE);this.currentPages=kigo.intval(result.PAGER.PAGES);this.currentTotal=kigo.intval(result.PAGER.TOTAL);if(!this.currentTotal||this.currentPages==1)
return disableContainers();this.containers.forEach(function(container)
{var dropdown;container.empty().append(kigoDom.create('span',{'class':'label'}).append(self.text),(dropdown=new kigoSelect2(kigoDom.create('select',null,null,{'change':function()
{if(typeof(window['changesDetected'])!='undefined'&&window['changesDetected'])
askExitWithoutSaving(function(){changePage(dropdown.getValue())});else
changePage(dropdown.getValue());}}))).dom(),kigoDom.create('span',{'class':'outof'}).append('/'),kigoDom.create('span',{'class':'total'}).append(self.currentTotal),kigoDom.create('a',{'class':'prev'+(self.currentPage==1?' disabled':''),'href':'#','disabled':self.currentPage==1?true:false},null,{'click':function()
{if(!this.disabled)
{if(typeof(window['changesDetected'])!='undefined'&&window['changesDetected'])
askExitWithoutSaving(function(){changePage(self.currentPage-1)});else
changePage(self.currentPage-1);}
return false;}}).append('\u00AB Previous'),kigoDom.create('span',{'class':'sep'}).append('|'),kigoDom.create('a',{'class':'next'+(self.currentPage==self.currentPages?' disabled':''),'href':'#','disabled':self.currentPage==self.currentPages?true:false},null,{'click':function()
{if(!this.disabled)
{if(typeof(window['changesDetected'])!='undefined'&&window['changesDetected'])
askExitWithoutSaving(function(){changePage(self.currentPage+1)});else
changePage(self.currentPage+1);}
return false;}}).append('Next \u00BB'));container.domNode().style.display='block';if(self.itemsPerPage>1)
{for(var i=1;i<=self.currentPages;i++)
{var from=((i-1)*self.itemsPerPage)+1;var to=Math.min(i*self.itemsPerPage,self.currentTotal);dropdown.addOption(i,from==to?from:from+'-'+to);}}
else
dropdown.addNumberedOptions(1,self.currentPages);dropdown.setValue(self.currentPage);});function changePage(newPage)
{if((self.currentPage=newPage)<1)
self.currentPage=1;else if(self.currentPage>self.currentPages)
self.currentPage=self.currentPages;self.callback(self.currentPage);}}

function kigoPager2(containers,text,perPage,callback)
{this.containers=(new kigoList(containers)).map(function(container)
{try
{return(new kigoDom(container)).addClass('kigo_pager');}
catch(e)
{throw'kigoPager2::kigoPager2(): invalid container(s)';}});this.text=text;if(!kigo.is_int(perPage)||perPage<1)
throw'kigoPager2::kigoPager2(): invalid number of items per page';if(!(this.callback=new kigoCallback(callback,this)).defined())
throw'kigoPager2::kigoPager2(): invalid callback';this.perPage=perPage;this.total=0;this.page=1;this.pages=0;}
kigoPager2.prototype.getPerPage = function()
{return this.perPage;};kigoPager2.prototype.getPage = function()
{return this.page;};kigoPager2.prototype.getPages = function()
{return this.pages;};kigoPager2.prototype.getTotal = function()
{return this.total;};kigoPager2.prototype.render = function(page,total)
{if(!kigo.is_int(page)||page<1)
throw'kigoPager2::render(): invalid page number';if(!kigo.is_int(total)||total<0)
throw'kigoPager2::render(): invalid total';if(!(this.total=total))
{this.page=1;this.pages=0;this.containers.forEach(function(container){container.empty().domNode().style.display='none';});return;}
if((this.page=page)>(this.pages=Math.ceil(this.total/this.perPage)))
this.page=this.pages;this.containers.forEach(new kigoCallback(function(container)
{var from,to;var page=this.page;var self=this;var dropdown=new kigoSingleSelect(kigoDom.create('select')).onChange(function(page)
{kigoFront.ifNoChanges(function(){changePage(page);});});if(this.perPage==1)
dropdown.addNumberedOptions(1,this.pages);else
{for(var i=1;i<=this.pages;i++)
dropdown.addOption(i,(from=((i-1)*this.perPage)+1)==(to=Math.min(i*this.perPage,this.total))?from:from+'-'+to);}
dropdown.setValue(page);container.empty().append(kigoDom.create('span',{'class':'label'}).append(this.text),dropdown.dom(),kigoDom.create('span',{'class':'outof'}).append('/'),kigoDom.create('span',{'class':'total'}).append(this.total),kigoDom.create('a',{'class':'prev'+(this.page==1?' disabled':''),'href':'#','disabled':this.page==1?true:false},null,{'click':function()
{if(!this.getAttribute('disabled'))
kigoFront.ifNoChanges(function(){changePage(page-1);});return false;}}).append('\u00AB Previous'),kigoDom.create('span',{'class':'sep'}).append('|'),kigoDom.create('a',{'class':'next'+(this.page==this.pages?' disabled':''),'href':'#','disabled':this.page==this.pages?true:false},null,{'click':function()
{if(!this.getAttribute('disabled'))
kigoFront.ifNoChanges(function(){changePage(page+1);});return false;}}).append('Next \u00BB')).domNode().style.display='block';function changePage(page)
{self.callback.invoke(page);}},this));};

function getAbsolutePosition(element){var r={x:element.offsetLeft,y:element.offsetTop};if(element.offsetParent){var tmp=getAbsolutePosition(element.offsetParent);r.x+=tmp.x;r.y+=tmp.y;}
return r;};function getRelativeCoordinates(event,reference){var x,y;event=event||window.event;var el=event.target||event.srcElement;if(!window.opera&&typeof event.offsetX!='undefined'){var pos={x:event.offsetX,y:event.offsetY};var e=el;while(e){e.mouseX=pos.x;e.mouseY=pos.y;pos.x+=e.offsetLeft;pos.y+=e.offsetTop;e=e.offsetParent;}
var e=reference;var offset={x:0,y:0}
while(e){if(typeof e.mouseX!='undefined'){x=e.mouseX-offset.x;y=e.mouseY-offset.y;break;}
offset.x+=e.offsetLeft;offset.y+=e.offsetTop;e=e.offsetParent;}
e=el;while(e){e.mouseX=undefined;e.mouseY=undefined;e=e.offsetParent;}}
else{kigoDebug.text('absolute calculus');var pos=getAbsolutePosition(reference);x=event.pageX-pos.x;y=event.pageY-pos.y;}
return{x:x,y:y};}
function kigoCalendar(startMonth,startYear,endMonth,endYear,datas,searchDate,limits)
{this.datas={'i':datas.i,'p':datas.p,'f':datas.f,'a':datas.a,'o':datas.o,'ex':datas.ex,'price':datas.price,'clean':datas.clean,'cleanDone':datas.cleanDone};this.sm=startMonth;this.sy=startYear;this.em=endMonth;this.ey=endYear;this.res=datas.r;this.nbMonth;this.resTooltips=new Array();this.areaTooltips=new Array();this.md=new Array();this.stack=new Array();this.length;this.onReservationClick=null;this.onSearchClick=null;this.onAvailableClick=null;this.parent=null;this.limits=limits||null;this.lim=0;this.search=null;this.div=document.createElement('div');this.br=document.createElement('br');if(searchDate!=null)
{var searchStart=new Date.parseDate(searchDate.s,'%Y-%m-%d');var searchEnd=new Date.parseDate(searchDate.e,'%Y-%m-%d');var newResTab=new Array();var calStart=new Date(this.sy,this.sm-1);var calEnd=new Date(this.ey,this.em);var isOk=true;if(this._compareDate(calStart,searchEnd)>0||this._compareDate(searchStart,calEnd)>0)
{isOk=false;this.onSearchClick=null;}
if(isOk)
{searchDate.t={'n':'Your search'};if(this.res.length==0){this.search=newResTab.length;newResTab.push(searchDate);}
else{var added=false;for(var nbr=0;nbr<this.res.length;nbr++)
{if(!added){var resStart=new Date.parseDate(this.res[nbr].s,'%Y-%m-%d');if(this._compareDate(searchEnd,resStart)<=0){this.search=newResTab.length;newResTab.push(searchDate);added=true;}}
newResTab.push(this.res[nbr]);if(!added&&nbr==this.res.length-1){this.search=newResTab.length;newResTab.push(searchDate);}}}
this.res=newResTab;}}}
kigoCalendar.bei=1;kigoCalendar.prototype._getClass = function(m,c)
{if((parseInt(m)!=0&&parseInt(m)!=1)||(parseInt(c)!=0&&parseInt(c)!=1))return's';else{m=parseInt(m);c=parseInt(c);if(m==c)
{if(m==0)return'oh';else return'mc';}
else if(m==0)return'oc';else return'mh';}}
kigoCalendar.prototype._getDaysBetween = function(d1,d2)
{var days;var d,m,y;if(this._compareDate(d1,d2)==-1)return Math.round((d2.getTime()-d1.getTime())/(1000*60*60*24));else return Math.round((d1.getTime()-d2.getTime())/(1000*60*60*24));}
kigoCalendar.prototype._compareDate = function(d1,d2)
{if(d1.getYear()<d2.getYear())return-1;else if(d1.getYear()==d2.getYear()&&d1.getMonth()<d2.getMonth())return-1;else if(d1.getYear()==d2.getYear()&&d1.getMonth()==d2.getMonth()&&d1.getDate()<d2.getDate())return-1;else if(d1.getYear()==d2.getYear()&&d1.getMonth()==d2.getMonth()&&d1.getDate()==d2.getDate())return 0;else return 1;}
kigoCalendar.prototype._getWidth = function(){return(this.length<this.stack[0])?this.length:this.stack[0];}
kigoCalendar.prototype._createBlock = function(width,className)
{var b=this.div.cloneNode(false);b.style.width=width*this.daySize+'px';b.className=className;return b;}
kigoCalendar.prototype._createFirstArea = function(dateStart,dateEnd)
{var area;var self=this;this.length=this._getDaysBetween(dateStart,dateEnd);var i=0;while(this.length!=0&&this.stack.length!=0)
{area=this._createBlock(this._getWidth(),'n');this.parent.appendChild(area);this._updateLengthAndStack(this._getWidth());var month=dateStart.getMonth();if(typeof(this.onAvailableClick)=='function')
{area.modifiedMonth=month+i;area.onclick = function(event){var e=event||window.event;var pos=getRelativeCoordinates(event,area.parentNode);var day=Math.ceil(pos.x/self.daySize);if(day==0)day=1;var modifiedDate=new Date(dateStart.getFullYear()+(Math.floor(this.modifiedMonth/12)),(this.modifiedMonth%12),day);self.onAvailableClick(self.datas,modifiedDate.print('%a, '+day+' %b %Y'));return false;}
area.className+=' clickable';}
if(this.limits!=null&&typeof(this.limits)=='object')
{kigoTooltip.register(area,this.areaTooltips[0]);}
i++;}
this.length++;this._createBlockEnd('n',this._getClass(this.res[0].m,this.res[0].c),null,0);if(this.lim!=null)this.lim++;}
kigoCalendar.prototype._createFirstReservation = function(numRes,resStart,resEnd)
{var res;var self=this;this.length=this._getDaysBetween(resStart,resEnd);while(this.length!=0&&this.stack.length!=0)
{res=this._createBlock(this._getWidth(),this._getClass(this.res[numRes].m,this.res[numRes].c));if(typeof(this.onReservationClick)=='function'&&this.res[numRes].i!=null)
{res.onclick = function(){self.onReservationClick(parseInt(self.res[numRes].i,10));return false;}
res.className+=' clickable';}
else if(typeof(this.onSearchClick)=='function'&&this.search==numRes)
{res.onclick = function(){self.onSearchClick(self.datas);return false;}
res.className+=' clickable';}
this.parent.appendChild(res);if(this.res[0].t!=null&&typeof(this.res[0].t)=='object')
{kigoTooltip.register(res,this.resTooltips[0]);}
this._updateLengthAndStack(this._getWidth());}}
kigoCalendar.prototype._createFreeArea = function(dateStart,dateEnd)
{var area;var self=this;this.length=this._getDaysBetween(dateStart,dateEnd)-1;if(parseInt(dateStart.print('%d'))==dateStart.getMonthDays()){var i=1;}else{var i=0;}
while(this.length!=0&&this.stack.length!=0)
{area=this._createBlock(this._getWidth(),'n');this.parent.appendChild(area);this._updateLengthAndStack(this._getWidth());var month=dateStart.getMonth();if(typeof(this.onAvailableClick)=='function')
{area.modifiedMonth=month+i;area.onclick = function(event){var e=event||window.event;var pos=getRelativeCoordinates(event,area.parentNode);var day=Math.ceil(pos.x/self.daySize);if(day==0)day=1;var modifiedDate=new Date(dateStart.getFullYear()+(Math.floor(this.modifiedMonth/12)),(this.modifiedMonth%12),day);self.onAvailableClick(self.datas,modifiedDate.print('%a, '+day+' %b %Y'));return false;}
area.className+=' clickable';}
i++;if(this.limits!=null)
{kigoTooltip.register(area,this.areaTooltips[this.lim]);}}}
kigoCalendar.prototype._createReservation = function(numRes,resStart,resEnd)
{var res;var self=this;this.length=this._getDaysBetween(resStart,resEnd)-1;while(this.length!=0&&this.stack.length!=0)
{res=this._createBlock(this._getWidth(),this._getClass(this.res[numRes].m,this.res[numRes].c));if(typeof(this.onReservationClick)=='function'&&this.res[numRes].i!=null)
{res.onclick = function(){self.onReservationClick(parseInt(self.res[numRes].i,10));return false;}
res.className+=' clickable';}
else if(typeof(this.onSearchClick)=='function'&&this.search==numRes)
{res.onclick = function(){self.onSearchClick(self.datas);return false;}
res.className+=' clickable';}
this.parent.appendChild(res);if(this.res[numRes].t!=null&&typeof(this.res[numRes].t)=='object')
{kigoTooltip.register(res,this.resTooltips[numRes]);}
this._updateLengthAndStack(this._getWidth());}}
kigoCalendar.prototype._createBlockEnd = function(cn1,cn2,r1,r2)
{if(r1!=null||r2!=null){var date=(r1==null)?new Date.parseDate(this.res[r2].s,'%Y-%m-%d'):new Date.parseDate(this.res[r1].e,'%Y-%m-%d');}
var block;var self=this;var area1=document.createElement('div');area1.className+=' e'+cn1+' ';var area2=document.createElement('div');area2.className+=' b'+cn2+' ';area1.style.width=area2.style.width=(this.daySize/2)+'px';this._updateLengthAndStack(1);block=this._createBlock(1,'start_end_block');block.style.display="inline";if(r1!=null&&typeof(this.onReservationClick)=='function'&&this.res[r1].i!=null)
{area1.onclick = function(){kigoDebug.text('reserv');self.onReservationClick(parseInt(self.res[r1].i,10));return false;}
area1.className+=' clickable';}
else if(typeof(this.onSearchClick)=='function'&&this.search!=null)
{if(this.search==r1){area1.onclick = function(){kigoDebug.text('search');self.onSearchClick(self.datas);return false;}
area1.className+=' clickable';}}
else if(typeof(this.onAvailableClick)=='function'&&cn1=='n')
{area1.onclick = function(event){var e=event||window.event;var pos=getRelativeCoordinates(event,area1.parentNode.parentNode);var day=Math.ceil(pos.x/self.daySize);self.onAvailableClick(self.datas,date.print('%a, '+day+' %b %Y'));return false;}
area1.className+=' clickable';}
if(r1!=null&&this.res[r1].t!=null&&typeof(this.res[r1].t)=='object')
{kigoTooltip.register(area1,this.resTooltips[r1]);}
if(cn1=='n'&&typeof(this.limits)=='object'&&this.limits!=null)
{kigoTooltip.register(area1,this.areaTooltips[this.lim]);}
if(r2!=null&&typeof(this.onReservationClick)=='function'&&this.res[r2].i!=null)
{area2.onclick = function(){self.onReservationClick(parseInt(self.res[r2].i,10));return false;}
area2.className+=' clickable';}
else if(typeof(this.onSearchClick)=='function'&&this.search!=null)
{if(this.search==r2){area2.onclick = function(){self.onSearchClick(self.datas);return false;}
area2.className+=' clickable';}}
else if(typeof(this.onAvailableClick)=='function'&&cn2=='n')
{area2.onclick = function(event){var e=event||window.event;var pos=getRelativeCoordinates(event,area1.parentNode.parentNode);var day=Math.ceil(pos.x/self.daySize);self.onAvailableClick(self.datas,date.print('%a, '+day+' %b %Y'));return false;}
area2.className+=' clickable';}
if(r2!=null&&this.res[r2].t!=null&&typeof(this.res[r2].t)=='object')
{kigoTooltip.register(area2,this.resTooltips[r2]);}
if(cn2=='n'&&typeof(this.limits)=='object'&&this.limits!=null)
{kigoTooltip.register(area2,this.areaTooltips[this.lim]);}
if(cn1!='n'&&cn2!='n')
block.className+=' in_between';block.appendChild(area1);block.appendChild(area2);if(r1!=null||r2!=null){var date=(r1==null)?new Date.parseDate(this.res[r2].s,'%Y-%m-%d'):new Date.parseDate(this.res[r1].e,'%Y-%m-%d');if(date.getMonthDays()==date.getDate()&&this.parent.lastChild.className=='eom')this.parent.insertBefore(block,this.parent.lastChild);else this.parent.appendChild(block);}
else
this.parent.appendChild(block);kigoCalendar.bei++;}
kigoCalendar.prototype._updateLengthAndStack = function(width)
{this.length-=width;this.stack[0]-=width;if(this.stack[0]==0)
{this.stack.shift();var dif=31-this.md[0];if(dif>0)this.parent.appendChild(this._createBlock(dif,'eom'));this.md.shift();}}
kigoCalendar.prototype._createReservations = function(parent)
{var calStart=new Date(this.sy,this.sm-1);var calEnd=new Date(this.ey,this.em);var self=this;this.parent=parent;if(this.res.length==0){var area;this.length=this._getDaysBetween(calStart,calEnd);if(this.limits!=null)
{var tt=this.div.cloneNode(false);tt.setAttribute('pos','s');var l5f=this.div.cloneNode(false);l5f.className='ttClickForAction';l5f.appendChild(document.createTextNode('Click to reserve!'));tt.appendChild(l5f);var lf=this.div.cloneNode(false);lf.className='ttFreeArea';lf.appendChild(document.createTextNode('Available dates'));tt.appendChild(lf);var l1=this.div.cloneNode(false);l1.className='ttlcout';var lcout;if(this.limits.p==null)lcout='No earlier dates';else
{var d=new Date.parseDate(this.limits.p,'%Y-%m-%d');lcout=d.print('%a, %d %b %Y');}
l1.appendChild(document.createTextNode('Last check-out : '+lcout));tt.appendChild(l1);var l2=this.div.cloneNode(false);l2.className='ttncin';var ncin;if(this.limits.n==null)ncin='No further dates';else
{var d=new Date.parseDate(this.limits.n,'%Y-%m-%d');ncin=d.print('%a, %d %b %Y');}
l2.appendChild(document.createTextNode('Next check-in : '+ncin));tt.appendChild(l2);}
var month=calStart.getMonth();var i=0;while(this.length!=0&&this.stack.length!=0)
{area=this._createBlock(this._getWidth(),'n');this.parent.appendChild(area);this._updateLengthAndStack(this._getWidth());if(typeof(this.onAvailableClick)=='function')
{area.modifiedMonth=month+i;area.onclick = function(event){var e=event||window.event;var pos=getRelativeCoordinates(event,area.parentNode);var day=Math.ceil(pos.x/self.daySize);if(day==0)day=1;var modifiedDate=new Date(calStart.getFullYear()+(Math.floor(this.modifiedMonth/12)),(this.modifiedMonth%12),day);self.onAvailableClick(self.datas,modifiedDate.print('%a, '+day+' %b %Y'));return false;return false;}
area.className+=' clickable';}
if(this.limits!=null)
{kigoTooltip.register(area,tt);}
i++;}}
else
{for(var nbr=0;nbr<this.res.length;nbr++)
{var res=this.res[nbr];if(res.t!=null&&typeof(res.t)=='object')
{var resStart=Date.parseDate(res.s,'%Y-%m-%d');var resEnd=Date.parseDate(res.e,'%Y-%m-%d');var ttRes=this.div.cloneNode(false);ttRes.setAttribute('pos','s');var m=parseInt(res.m);var c=parseInt(res.c);if((m==0||m==1)&&(c==0||c==1))
{ttRes.className+=' m_'+m;ttRes.className+=' c_'+c;ttRes.className+=' resTooltip';var l1=this.div.cloneNode(false);l1.className='ttAgency';l1.appendChild(document.createTextNode(res.t.a));ttRes.appendChild(l1);if(typeof(res.t.g)=='string'&&res.t.g.length)
{var l2=this.div.cloneNode(false);l2.className='ttGuest';l2.appendChild(document.createTextNode(res.t.g));ttRes.appendChild(l2);}}
else
{ttRes.className+=' searchTooltip';var l1=this.div.cloneNode(false);l1.className='ttSearch';l1.appendChild(document.createTextNode(res.t.n));var l5f=this.div.cloneNode(false);l5f.className='ttClickForAction';l5f.appendChild(document.createTextNode('Click to reserve!'));ttRes.appendChild(l5f);ttRes.appendChild(l1);}
var l3=this.div.cloneNode(false);l3.className='ttNights';var nights=this._getDaysBetween(resStart,resEnd);var l3t=nights+' night';if(nights>1)l3t+='s';l3.appendChild(document.createTextNode(l3t));ttRes.appendChild(l3);var l4=this.div.cloneNode(false);l4.className='ttCheckIn';l4.appendChild(document.createTextNode('Check-in : '));if(res.c)
{if(res.t.i!=null)
l4.appendChild(document.createTextNode(res.t.i+', '));else
{var span=document.createElement('span');span.className='important';span.appendChild(document.createTextNode('time?'));l4.appendChild(span);}}
l4.appendChild(document.createTextNode(resStart.print(' %a, %d %b %Y')));ttRes.appendChild(l4);var l5=this.div.cloneNode(false);l5.className='ttCheckOut';l5.appendChild(document.createTextNode('Check-out : '));if(res.c)
{if(res.t.o!=null)
l5.appendChild(document.createTextNode(res.t.o+', '));else
{var span=document.createElement('span');span.className='important';span.appendChild(document.createTextNode('time?'));l5.appendChild(span);}}
l5.appendChild(document.createTextNode(resEnd.print(' %a, %d %b %Y')));ttRes.appendChild(l5);if(res.t.e!=null)
{var l6=this.div.cloneNode(false);l6.className='ttExpiry';var nbSec=res.t.e;if(nbSec<0)l6.appendChild(document.createTextNode('Expiry : About to expire.'));else
{var fd=Math.floor(nbSec/86400);var fh=Math.floor((nbSec-(fd*86400))/3600);var fm=Math.floor((nbSec-(fd*86400)-(fh*3600))/60);if(fd!=0&&fh!=0)l6.appendChild(document.createTextNode('Expiry : '+fd+' days '+fh+'h '+fm+'m'));else if(fh!=0)l6.appendChild(document.createTextNode('Expiry : '+fh+'h '+fm+'m'));else l6.appendChild(document.createTextNode('Expiry : '+fm+'m'));}
ttRes.appendChild(l6);}
var p;if(!((m==0||m==1)&&(c==0||c==1))&&typeof(p=self.datas.price)=='object')
{var dp=this.div.cloneNode(false);dp.appendChild(this.br.cloneNode(false));if(p.CODE!=='E_OK')
{var dw=this.div.cloneNode(false);dw.style.width='200px';dw.appendChild(document.createTextNode(p.TEXT));dp.appendChild(dw);}
else
{function setCalculatedPrice(node,price)
{var cls=['price','calcprice'];if(price.RENT_DISCOUNTS!=null)
{cls.push('discount');(new kigoList(price.RENT_DISCOUNTS.DETAILS)).forEach(function(rentDiscount)
{cls.push('discount-'+kigo.strtolower(rentDiscount.DISCOUNT));});}
node.setClass(cls.join(' ')).empty().append(kigoDom.create('div').append(kigoDom.create('table',{'class':'results-rent-calc'}).append(kigoDom.create('tbody').append(line(kigoDom.create('strong').append('Rent calculation'),''),line('Average nightly rent',kigoFront.formatDisplayPrice(kigo.round(price.RENT_AMOUNT/price.NIGHTS,2))),line('Average nightly rent+discounts+fees',kigoFront.formatDisplayPrice(kigo.round(price.TOTAL_AMOUNT/price.NIGHTS,2))),line(kigoDom.nbsp,''),line('Rent',kigoFront.formatDisplayPrice(price.RENT_RAW_AMOUNT)),(kigo.is_object(price.RENT_FEES)?line('Fees in rent',kigoFront.formatDisplayPrice(price.RENT_FEES.AMOUNT)):null),(function()
{if(price.RENT_DISCOUNTS==null)
return null;var resList=[];(new kigoList(price.RENT_DISCOUNTS.DETAILS)).forEach(function(discount)
{var discountText={'EARLY':'Early bird discount','LATE':'Last minute discount','SPECIAL':'Special discount'};resList.push(line(kigo.is_string(discount.NAME)?discount.NAME:discountText[discount.DISCOUNT],kigoFront.formatDisplayPrice(discount.AMOUNT)));});resList.push(line('Total Discounts',kigoFront.formatDisplayPrice(price.RENT_DISCOUNTS.AMOUNT)));resList.push(line('Discounted rent',kigoFront.formatDisplayPrice(price.RENT_AMOUNT)));resList.push(line(kigoDom.nbsp,''));return resList;})(),(function()
{if(price.FEES==null)
return null;var resList=[];(new kigoList(price.FEES.DETAILS)).forEach(function(fee)
{resList.push(line(fee.LABEL,kigoFront.formatDisplayPrice(fee.AMOUNT)));});return resList;})(),line(kigoDom.create('strong').append('Total'),kigoDom.create('strong').append(kigoFront.formatDisplayPrice(price.TOTAL_AMOUNT))),(price.DEPOSIT!=null?[line(kigoDom.nbsp,''),line('Refundable damage deposit',kigoFront.formatDisplayPrice(price.DEPOSIT.AMOUNT))]:null),null))));function line(title,content)
{return kigoDom.create('tr').append(kigoDom.create('th').append(title),kigoDom.create('td').append(content));}}
var ptable=kigoDom.create('div');setCalculatedPrice(ptable,p.RESULT);dp.appendChild(ptable.domNode());}
ttRes.appendChild(dp);}
this.resTooltips.push(ttRes);if(typeof(this.limits)=='object'&&this.limits!=null)
{if(nbr==0)
{if(this._compareDate(resStart,calStart)>=0)
{var firstAreaStart=(this.limits.p!=null)?new Date.parseDate(this.limits.p,'%Y-%m-%d'):new Date(this.sy,this.sm-1);var firstAreaEnd=resStart;var fTtArea=this.div.cloneNode(false);fTtArea.className+=' freeAreaTooltip';fTtArea.setAttribute('pos','s');var l5f=this.div.cloneNode(false);l5f.className='ttClickForAction';l5f.appendChild(document.createTextNode('Click to reserve!'));fTtArea.appendChild(l5f);var l1f=this.div.cloneNode(false);l1f.className='ttFreeArea';l1f.appendChild(document.createTextNode('Available dates'));fTtArea.appendChild(l1f);if(this._compareDate(firstAreaStart,calStart)!=0)
{var l2f=this.div.cloneNode(false);l2f.className='ttNights';var nights=this._getDaysBetween(firstAreaStart,firstAreaEnd);var l2tf=nights+' night';if(nights>1)l2tf+='s';l2f.appendChild(document.createTextNode(l2tf));fTtArea.appendChild(l2f);}
var l3f=this.div.cloneNode(false);l3f.className='ttCheckIn';l3f.appendChild(document.createTextNode('Last check-out : '));if(this._compareDate(firstAreaStart,calStart)==0)
l3f.appendChild(document.createTextNode('No earlier dates'));else
l3f.appendChild(document.createTextNode(firstAreaStart.print('%a, %d %b %Y')));fTtArea.appendChild(l3f);var l4f=this.div.cloneNode(false);l4f.className='ttCheckOut';l4f.appendChild(document.createTextNode('Next check-in : '));l4f.appendChild(document.createTextNode(firstAreaEnd.print('%a, %d %b %Y')));fTtArea.appendChild(l4f);this.areaTooltips.push(fTtArea);}}
var dateStart=resEnd;var dateEnd=(nbr!=this.res.length-1)?new Date.parseDate(this.res[nbr+1].s,'%Y-%m-%d'):new Date(this.ey,this.em);if(this._compareDate(dateStart,dateEnd)!=0)
{if(this._compareDate(dateEnd,calEnd)==0&&this.limits.n!=null)
dateEnd=new Date.parseDate(this.limits.n,'%Y-%m-%d');var ttArea=this.div.cloneNode(false);ttArea.className+=' freeAreaTooltip';ttArea.setAttribute('pos','s');var l5f=this.div.cloneNode(false);l5f.className='ttClickForAction';l5f.appendChild(document.createTextNode('Click to reserve!'));ttArea.appendChild(l5f);var l1=this.div.cloneNode(false);l1.className='ttFreeArea';l1.appendChild(document.createTextNode('Available dates'));ttArea.appendChild(l1);if(this._compareDate(dateEnd,calEnd)!=0)
{var l2=this.div.cloneNode(false);l2.className='ttNights';var nights=this._getDaysBetween(dateStart,dateEnd);var l2t=nights+' night';if(nights>1)l2t+='s';l2.appendChild(document.createTextNode(l2t));ttArea.appendChild(l2);}
var l3=this.div.cloneNode(false);l3.className='ttCheckIn';l3.appendChild(document.createTextNode('Check-in : '));l3.appendChild(document.createTextNode(dateStart.print('%a, %d %b %Y')));ttArea.appendChild(l3);var l4=this.div.cloneNode(false);l4.className='ttCheckOut';l4.appendChild(document.createTextNode('Check-out : '));if(this._compareDate(dateEnd,calEnd)==0)
l4.appendChild(document.createTextNode('No further dates'));else
l4.appendChild(document.createTextNode(dateEnd.print('%a, %d %b %Y')));ttArea.appendChild(l4);this.areaTooltips.push(ttArea);}}}
else this.resTooltips.push(null);}
for(var nbr=0;nbr<this.res.length;nbr++)
{var res=this.res[nbr];var resStart=new Date.parseDate(res.s,'%Y-%m-%d');var resEnd=new Date.parseDate(res.e,'%Y-%m-%d');if(nbr==0)
{switch(this._compareDate(calStart,resStart))
{case-1:this._createFirstArea(calStart,resStart);break;case 0:this._createBlockEnd('n',this._getClass(res.m,res.c),null,nbr);if(this.lim!=null)this.lim++;break;case 1:this._createFirstReservation(nbr,calStart,resEnd);break;}}
if(this._compareDate(calStart,resStart)!=1)this._createReservation(nbr,resStart,resEnd);if(nbr!=this.res.length-1)
{var nextResStart=new Date.parseDate(this.res[nbr+1].s,'%Y-%m-%d');if(this._compareDate(resEnd,nextResStart)!=0)
{this._createBlockEnd(this._getClass(res.m,res.c),'n',nbr,null);this._createFreeArea(resEnd,nextResStart);this._createBlockEnd('n',this._getClass(this.res[nbr+1].m,this.res[nbr+1].c),null,nbr+1);if(this.lim!=null)this.lim++;}
else this._createBlockEnd(this._getClass(res.m,res.c),this._getClass(this.res[nbr+1].m,this.res[nbr+1].c),nbr,nbr+1);}
else if(this.stack.length>0)
{this._createBlockEnd(this._getClass(res.m,res.c),'n',nbr,null);this._createFreeArea(resEnd,calEnd);if(this.lim!=null)this.lim++;}}}}
kigoCalendar.prototype.dump = function(elm)
{var months=document.createElement('div');elm.appendChild(months);months.className='months';var b=this.div.cloneNode(false);b.className='month';b.innerHTML='<p>&nbsp;</p>';months.appendChild(b);var dim=new Object();dim.monthSize=b.clientWidth;dim.daySize=b.clientHeight;elm.removeChild(months);var pointer=elm.parentNode;this.container=vkDom.el(elm).cloneNode(false);this.daySize=null;this.monthSize=null;var lines=(this.ey-this.sy)*12+(this.em-this.sm)+1;var day,month;var days=this.div.cloneNode(false);this.container.appendChild(days);var months=this.div.cloneNode(false);this.container.appendChild(months);var reservations=this.div.cloneNode(false);this.container.appendChild(reservations);var clear=this.div.cloneNode(false);this.container.appendChild(clear);var todaysMonth=(new Date().print('%b %y'));var todaysDay=(new Date().print('%d'));for(month=0;month<lines;month++)
{var m=this.sm+month-1-12*(Math.ceil((this.sm+month-1)/12)-1);var y=this.sy+Math.ceil((this.sm+month-1)/12)-1;var d=new Date(y,m);var b=this.div.cloneNode(false);var r;var nbr;this.md.push(d.getMonthDays());this.stack.push(d.getMonthDays());b.className='month';b.appendChild(document.createTextNode(d.print('%b %y')));months.appendChild(b);if(this.monthSize==null)this.monthSize=dim.monthSize;if(this.daySize==null)this.daySize=dim.daySize;if(month==0)b.className+=' first';else if(month==lines-1)b.className+=' last';else b.className+=' middle';if(d.print('%b %y')==todaysMonth)b.className+=' today';b.className+=(month%2)?' even':' odd';}
this.nbMonth=this.stack.length;for(day=0;day<=31;day++)
{var b=this.div.cloneNode(false);var r;if(day==0)b.className='month';else
{b.className='day';var z=(day<10)?'0':'';b.appendChild(document.createTextNode(z+day));}
if(day==0)b.className+=' corner';else if(day==1)b.className+=' first';else if(day==31)b.className+=' last';else b.className+=' middle';if(z+day==todaysDay)b.className+=' today';if(day!=0)b.className+=(day%2)?' odd':' even';days.appendChild(b);}
days.style.width=this.monthSize+31*this.daySize+'px';days.style.height=this.daySize+'px';months.style.width=this.monthSize+'px';months.style.height=lines*this.daySize+'px';reservations.style.width=31*this.daySize+'px';reservations.style.height=lines*this.daySize+'px';reservations.style.position='relative';this.container.style.width=days.style.width;this.container.height=parseInt(days.style.height)+parseInt(months.style.height)+'px';months.className='months';days.className='days';reservations.className='reservations';clear.className='clear';this._createReservations(reservations);if(this.datas.clean!=null)
{var startDate=new kigoDate(1,this.sm,this.sy);var cleanDate=kigoDate.createFromMysql(this.datas.clean);if(cleanDate.inRange(startDate,startDate.addMonths(this.nbMonth)))
{var row=-1;var cleanMonthYear=cleanDate.display('%m-%Y');while(startDate.addMonths(++row).display('%m-%Y')!==cleanMonthYear){}
(new kigoDom(reservations)).append(kigoTooltip.register(kigoDom.create('small',null,{'position':'absolute','top':(row*18)+'px','left':(2+((cleanDate.getDay()-1)*18))+'px','fontSize':'6pt','cursor':'default'}).append(this.datas.cleanDone==1?'C':'P'),'Cleaning '+(this.datas.cleanDone==1?'done':'planned')+' on '+cleanDate.display()));}}
pointer.replaceChild(this.container,elm);return this.container;}

function kigoMPCalendar(startMonth,startYear,endMonth,endYear,propList,searchDate)
{this.sm=startMonth;this.sy=startYear;this.em=endMonth;this.ey=endYear;this.prop=propList;this.res=null;this.resTooltips=[];this.areaTooltips=[];this.md=[];this.stack=null;this.length;this.onReservationClick=null;this.onSearchClick=null;this.onPropertyClick=null;this.onAvailableClick=null;this.search=null;this.daySize=null;this.nbDays=0;this.nbMonths;this.lim=0;this.ie6=vkDom.hasClass(document.body,'ua-msie-6');this.div=document.createElement('div');this.span=document.createElement('span');this.h1=document.createElement('h1');this.h2=document.createElement('h2');this.br=document.createElement('br');var p;for(p=0;p<this.prop.length;p++)this.resTooltips[p]=[];if(searchDate!=null)
{var searchStart=Date.parseDate(searchDate.s,'%Y-%m-%d');var searchEnd=Date.parseDate(searchDate.e,'%Y-%m-%d');var calStart=new Date(this.sy,this.sm-1);var calEnd=new Date(this.ey,this.em);var isOk=true;if(this._compareDate(calStart,searchEnd)>0||this._compareDate(searchStart,calEnd)>0)
{isOk=false;this.onSearchClick=null;}
if(isOk)
{var prop;this.search=[];searchDate.t={'n':'Your search'};for(var p=0;p<this.prop.length;p++)
{prop=this.prop[p];var newResTab=[];if(prop.r.length==0){this.search.push(newResTab.length);newResTab.push(searchDate);}
else{var added=false;for(var nbr=0;nbr<prop.r.length;nbr++)
{if(!added){var resStart=Date.parseDate(prop.r[nbr].s,'%Y-%m-%d');if(this._compareDate(searchEnd,resStart)<=0){this.search.push(newResTab.length);newResTab.push(searchDate);added=true;}}
newResTab.push(prop.r[nbr]);if(!added&&nbr==prop.r.length-1){this.search.push(newResTab.length);newResTab.push(searchDate);}}}
this.prop[p].r=newResTab;}}}}
kigoMPCalendar.bei=1;kigoMPCalendar.prototype._ac = function(parent,child){parent.appendChild(child);}
kigoMPCalendar.prototype._sa = function(node,name,value){node.setAttribute(name,value);}
kigoMPCalendar.prototype._ga = function(node,name){return node.getAttribute(name);}
kigoMPCalendar.prototype._ra = function(node,name){node.removeAttribute(name);}
kigoMPCalendar.prototype._getClass = function(m,c)
{if(((m=parseInt(m))!=0&&m!=1)||((c=parseInt(c))!=0&&c!=1))
return's';if(m==c)
{if(!m)
return'oh';return'mc';}
if(!m)
return'oc';return'mh';}
kigoMPCalendar.prototype._getDaysBetween = function(d1,d2)
{return Math.round(Math.abs(d1.getTime()-d2.getTime())/86400000);}
kigoMPCalendar.prototype._compareDate = function(a,b)
{if(a.getFullYear()<b.getFullYear())
return-1;if(a.getFullYear()>b.getFullYear())
return 1;if(a.getMonth()<b.getMonth())
return-1;if(a.getMonth()>b.getMonth())
return 1;if(a.getDate()<b.getDate())
return-1;if(a.getDate()>b.getDate())
return 1;return 0;}

kigoMPCalendar.prototype._createClickOnProperty = function(elm,obj)
{
	var self = this;

	elm.onclick = function(){
		self.onPropertyClick(obj);
		return false;
	}
}

kigoMPCalendar.prototype._getScrollBarWidth = function()
{try
{var d1,d2,w1,w2;d1=this.div.cloneNode(false);d2=this.div.cloneNode(false);d1.style.width='50px';d1.style.height='50px';d1.style.overflow='hidden';d1.style.position='absolute';d1.style.top='-200px';d1.style.left='-200px';d2.style.height='100px';d1.appendChild(d2);document.body.appendChild(d1);w1=d1.clientWidth;d1.style.overflowY='scroll';w2=d1.clientWidth;if(typeof(w1)!='number'||w1<=w2)
throw'Failed to determine the width';return w1-w2;}
catch(e)
{return 20;}}

kigoMPCalendar.prototype._setupAvailableClick = function(prop,area)
{if(!kigo.is_function(this.onAvailableClick))
return;var self=this;area.onclick = function(event)
{var e=event||window.event;var x;if(typeof(e['layerX'])!='undefined')
x=e.layerX;else if(typeof(e['x'])!='undefined')
x=e.x;else
x=null;self.onAvailableClick(prop,x!=null?(new kigoDate(1,self.sm,self.sy)).addDays(Math.floor(x/self.daySize)).display():null);return false;}
area.className+=' clickable';}

kigoMPCalendar.prototype._getWidth = function()
{
	return(this.length < this.stack) ? this.length : this.stack;
}

kigoMPCalendar.prototype._createBlock = function(width,className)
{var b=this.div.cloneNode(false);b.style.width=width*this.daySize+'px';b.className=className;return b;}
kigoMPCalendar.prototype._createReservation = function(pr,numRes,resStart,resEnd)
{var res;var propObject=this.prop[pr];var self=this;this.length=this._getDaysBetween(resStart,resEnd)-1;res=this._createBlock(this._getWidth(),this._getClass(this.res[numRes].m,this.res[numRes].c));this._ac(this.reservations,res);if(typeof(this.onReservationClick)=='function'&&this.res[numRes].i!=null)
{var resId=this.res[numRes].i;res.onclick = function(){self.onReservationClick(resId,propObject);return false;}
res.className+=' clickable';}
else if(typeof(this.onSearchClick)=='function'&&this.search!=null)
{if(this.search[pr]==numRes){res.onclick = function(){self.onSearchClick(propObject);return false;};res.className+=' clickable';}}
if(this.res[numRes].t!=null&&typeof(this.res[numRes].t)=='object')
kigoTooltip.register(res,this.resTooltips[pr][numRes]);this._updateLengthAndStack(this._getWidth());}
kigoMPCalendar.prototype._createFirstArea = function(pr,dateStart,dateEnd)
{var area;this.length=this._getDaysBetween(dateStart,dateEnd);area=this._createBlock(this._getWidth(),'n');this._ac(this.reservations,area);this._updateLengthAndStack(this._getWidth());this.length++;this._createBlockEnd(pr,'n',this._getClass(this.res[0].m,this.res[0].c),null,0);if(typeof(this.prop[pr].l)=='object'&&this.prop[pr].l!=null)
{kigoTooltip.register(area,this.areaTooltips[this.lim]);this.lim++;}
this._setupAvailableClick(this.prop[pr],area);}
kigoMPCalendar.prototype._createFirstReservation = function(pr,numRes,resStart,resEnd)
{var res;var propObject=this.prop[pr];var self=this;this.length=this._getDaysBetween(resStart,resEnd);res=this._createBlock(this._getWidth(),this._getClass(this.res[numRes].m,this.res[numRes].c));if(typeof(this.onReservationClick)=='function'&&this.res[numRes].i!=null)
{var resId=this.res[numRes].i;res.onclick = function(){self.onReservationClick(resId,propObject);return false;}
res.className+=' clickable';}
else if(typeof(this.onSearchClick)=='function'&&this.search!=null)
{if(this.search[pr]==numRes){res.onclick = function(){self.onSearchClick(propObject);return false;}
res.className+=' clickable';}}
this._ac(this.reservations,res);if(this.res[0].t!=null&&typeof(this.res[0].t)=='object')
{kigoTooltip.register(res,this.resTooltips[pr][0]);}
this._updateLengthAndStack(this._getWidth());}
kigoMPCalendar.prototype._createFreeArea = function(pr,dateStart,dateEnd)
{var area;this.length=this._getDaysBetween(dateStart,dateEnd)-1;area=this._createBlock(this._getWidth(),'n');this._ac(this.reservations,area);this._updateLengthAndStack(this._getWidth());if(typeof(this.prop[pr].l)=='object'&&this.prop[pr].l!=null)
{kigoTooltip.register(area,this.areaTooltips[this.lim]);}
this._setupAvailableClick(this.prop[pr],area);}
kigoMPCalendar.prototype._createBlockEnd = function(pr,cn1,cn2,r1,r2)
{var block;var self=this;var propObject=this.prop[pr];var area1=document.createElement('div');area1.className+=' e'+cn1+' ';var area2=document.createElement('div');area2.className+=' b'+cn2+' ';area1.style.width=area2.style.width=(this.daySize/2)+'px';if(r1!=null&&typeof(this.onReservationClick)=='function'&&this.res[r1].i!=null)
{var resId=this.res[r1].i;area1.onclick = function(){self.onReservationClick(resId,propObject);return false;}
area1.className+=' clickable';}
else if(typeof(this.onSearchClick)=='function'&&this.search!=null)
{if(this.search[pr]==r1){area1.onclick = function(){self.onSearchClick(propObject);return false}
area1.className+=' clickable';}}
if(cn1=='n')
this._setupAvailableClick(propObject,area1);if(r1!=null&&this.res[r1].t!=null&&typeof(this.res[r1].t)=='object')
{kigoTooltip.register(area1,this.resTooltips[pr][r1]);}
if(cn1=='n'&&typeof(propObject.l)=='object'&&propObject.l!=null)
{kigoTooltip.register(area1,this.areaTooltips[this.lim]);}
if(r2!=null&&typeof(this.onReservationClick)=='function'&&this.res[r2].i!=null)
{var resId=this.res[r2].i;area2.onclick = function(){self.onReservationClick(resId,propObject);return false;}
area2.className+=' clickable';}
else if(typeof(this.onSearchClick)=='function'&&this.search!=null)
{if(this.search[pr]==r2){area2.onclick = function(){self.onSearchClick(propObject);return false;}
area2.className+=' clickable';}}
if(cn2=='n')
this._setupAvailableClick(propObject,area2);if(r2!=null&&this.res[r2].t!=null&&typeof(this.res[r2].t)=='object')
{kigoTooltip.register(area2,this.resTooltips[pr][r2]);}
if((cn2=='n')&&typeof(propObject.l)=='object'&&propObject.l!=null)
{kigoTooltip.register(area2,this.areaTooltips[this.lim]);}
this._updateLengthAndStack(1);block=this._createBlock(1,'start_end_block');block.style.display="inline";this._ac(block,area1);this._ac(block,area2);this._ac(this.reservations,block);kigoMPCalendar.bei++;if(cn2=='s'&&!this.firstSearchBlock)
this.firstSearchBlock=block;}
kigoMPCalendar.prototype._updateLengthAndStack = function(width)
{this.length-=width;this.stack-=width;if(this.stack==0)this.stack=this.nbDays;}
kigoMPCalendar.prototype._createReservations = function(pr)
{var prop=this.prop[pr];var calStart=new Date(this.sy,this.sm-1);var calEnd=new Date(this.ey,this.em);if(this.res.length==0){var area;this.length=this._getDaysBetween(calStart,calEnd);area=this._createBlock(this._getWidth(),'n');this._ac(this.reservations,area);this._setupAvailableClick(prop,area);{var tt=this.div.cloneNode(false);tt.setAttribute('pos','s');var l7f=this.div.cloneNode(false);l7f.className='ttClickForAction';this._ac(l7f,document.createTextNode('Click to reserve!'));this._ac(tt,l7f);var lf=this.div.cloneNode(false);lf.className='ttFreeArea';this._ac(lf,document.createTextNode('Available dates'));this._ac(tt,lf);var l1=this.div.cloneNode(false);l1.className='ttlcout';var lcout;if(prop.l.p==null)lcout='No earlier dates';else
{var d=Date.parseDate(prop.l.p,'%Y-%m-%d');lcout=d.print('%a, %d %b %Y');}
this._ac(l1,document.createTextNode('Last check-out : '+lcout));this._ac(tt,l1);var l2=this.div.cloneNode(false);l2.className='ttncin';var ncin;if(prop.l.n==null)ncin='No further dates';else
{var d=Date.parseDate(prop.l.n,'%Y-%m-%d');ncin=d.print('%a, %d %b %Y');}
this._ac(l2,document.createTextNode('Next check-in : '+ncin));this._ac(tt,l2);kigoTooltip.register(area,tt);}}
else
{var rl=new kigoList(this.res);rl.forEach(new kigoCallback(function(res,nbr)
{if(res.t!=null&&typeof(res.t)=='object')
{var resStart=Date.parseDate(res.s,'%Y-%m-%d');var resEnd=Date.parseDate(res.e,'%Y-%m-%d');this.resTooltips[pr].push(new kigoCallback(function(){var div=this.div.cloneNode(false);div.setAttribute('pos','s');var m=parseInt(res.m);var c=parseInt(res.c);if((m==0||m==1)&&(c==0||c==1))
{div.className+=' m_'+m;div.className+=' c_'+c;div.className+=' resTooltip';var l1=this.div.cloneNode(false);l1.className='ttAgency';this._ac(l1,document.createTextNode(res.t.a));this._ac(div,l1);if(typeof(res.t.g)=='string'&&res.t.g.length)
{var l2=this.div.cloneNode(false);l2.className='ttGuest';this._ac(l2,document.createTextNode(res.t.g));this._ac(div,l2);}}
else
{div.className+=' searchTooltip';var l1=this.div.cloneNode(false);l1.className='ttSearch';this._ac(l1,document.createTextNode(res.t.n));var l5f=this.div.cloneNode(false);l5f.className='ttClickForAction';this._ac(l5f,document.createTextNode('Click to reserve!'));this._ac(div,l5f);this._ac(div,l1);}
var l3=this.div.cloneNode(false);l3.className='ttNights';var nights=this._getDaysBetween(resStart,resEnd);var l3t=nights+' night';if(nights>1)l3t+='s';this._ac(l3,document.createTextNode(l3t));this._ac(div,l3);var l4=this.div.cloneNode(false);l4.className='ttCheckIn';this._ac(l4,document.createTextNode('Check-in : '));if(c)
{if(res.t.i!=null)this._ac(l4,document.createTextNode(res.t.i+', '));else
{var span=document.createElement('span');span.className='important';this._ac(span,document.createTextNode('time?'));this._ac(l4,span);}}
this._ac(l4,document.createTextNode(resStart.print(' %a, %d %b %Y')));this._ac(div,l4);var l5=this.div.cloneNode(false);l5.className='ttCheckOut';this._ac(l5,document.createTextNode('Check-out : '));if(c)
{if(res.t.o!=null)this._ac(l5,document.createTextNode(res.t.o+', '));else
{var span=document.createElement('span');span.className='important';this._ac(span,document.createTextNode('time?'));this._ac(l5,span);}}
this._ac(l5,document.createTextNode(resEnd.print(' %a, %d %b %Y')));this._ac(div,l5);if(res.t.e!=null)
{var l6=this.div.cloneNode(false);l6.className='ttExpiry';if(nbSec<0)this._ac(l6,document.createTextNode('Expiry : About to expire.'));else
{var nbSec=res.t.e;var fd=Math.floor(nbSec/86400);var fh=Math.floor((nbSec-(fd*86400))/3600);var fm=Math.floor((nbSec-(fd*86400)-(fh*3600))/60);if(fd!=0&&fh!=0)this._ac(l6,document.createTextNode('Expiry : '+fd+' days '+fh+'h '+fm+'m'));else if(fh!=0)this._ac(l6,document.createTextNode('Expiry : '+fh+'h '+fm+'m'));else this._ac(l6,document.createTextNode('Expiry : '+fm+'m'));}
this._ac(div,l6);}
var p;if(!((m==0||m==1)&&(c==0||c==1))&&typeof(p=prop.price)=='object')
{var dp=this.div.cloneNode(false);this._ac(dp,this.br.cloneNode(false));if(p.CODE!=='E_OK')
{var dw=this.div.cloneNode(false);dw.style.width='200px';this._ac(dw,document.createTextNode(p.TEXT));this._ac(dp,dw);}
else
{function setCalculatedPrice(node,price)
{var cls=['price','calcprice'];if(price.RENT_DISCOUNTS!=null)
{cls.push('discount');(new kigoList(price.RENT_DISCOUNTS.DETAILS)).forEach(function(rentDiscount)
{cls.push('discount-'+kigo.strtolower(rentDiscount.DISCOUNT));});}
node.setClass(cls.join(' ')).empty().append(kigoDom.create('div').append(kigoDom.create('table',{'class':'results-rent-calc'}).append(kigoDom.create('tbody').append(line(kigoDom.create('strong').append('Rent calculation'),''),line('Average nightly rent',kigoFront.formatDisplayPrice(kigo.round(price.RENT_AMOUNT/price.NIGHTS,2))),line('Average nightly rent+discounts+fees',kigoFront.formatDisplayPrice(kigo.round(price.TOTAL_AMOUNT/price.NIGHTS,2))),line(kigoDom.nbsp,''),line('Rent',kigoFront.formatDisplayPrice(price.RENT_RAW_AMOUNT)),(kigo.is_object(price.RENT_FEES)?line('Fees in rent',kigoFront.formatDisplayPrice(price.RENT_FEES.AMOUNT)):null),(function()
{if(price.RENT_DISCOUNTS==null)
return null;var resList=[];(new kigoList(price.RENT_DISCOUNTS.DETAILS)).forEach(function(discount)
{var discountText={'EARLY':'Early bird discount','LATE':'Last minute discount','SPECIAL':'Special discount'};resList.push(line(kigo.is_string(discount.NAME)?discount.NAME:discountText[discount.DISCOUNT],kigoFront.formatDisplayPrice(discount.AMOUNT)));});resList.push(line('Total Discounts',kigoFront.formatDisplayPrice(price.RENT_DISCOUNTS.AMOUNT)));resList.push(line('Discounted rent',kigoFront.formatDisplayPrice(price.RENT_AMOUNT)));resList.push(line(kigoDom.nbsp,''));return resList;})(),(function()
{if(price.FEES==null)
return null;var resList=[];(new kigoList(price.FEES.DETAILS)).forEach(function(fee)
{resList.push(line(fee.LABEL,kigoFront.formatDisplayPrice(fee.AMOUNT)));});return resList;})(),line(kigoDom.create('strong').append('Total'),kigoDom.create('strong').append(kigoFront.formatDisplayPrice(price.TOTAL_AMOUNT))),(price.DEPOSIT!=null?[line(kigoDom.nbsp,''),line('Refundable damage deposit',kigoFront.formatDisplayPrice(price.DEPOSIT.AMOUNT))]:null),null))));function line(title,content)
{return kigoDom.create('tr').append(kigoDom.create('th').append(title),kigoDom.create('td').append(content));}}
var ptable=kigoDom.create('div');setCalculatedPrice(ptable,p.RESULT);this._ac(dp,ptable.domNode());}
this._ac(div,dp);}
return new kigoDom(div);},this));if(typeof(prop.l)=='object'&&prop.l!=null)
{if(nbr==0)
{if(this._compareDate(resStart,calStart)>=0)
{this.areaTooltips.push(new kigoCallback(function(){var firstAreaStart=calStart;var firstAreaEnd=resStart;var fTtArea=this.div.cloneNode(false);fTtArea.className+=' freeAreaTooltip';fTtArea.setAttribute('pos','s');var l5f=this.div.cloneNode(false);l5f.className='ttClickForAction';this._ac(l5f,document.createTextNode('Click to reserve!'));this._ac(fTtArea,l5f);var l1f=this.div.cloneNode(false);l1f.className='ttFreeArea';this._ac(l1f,document.createTextNode('Available dates'));this._ac(fTtArea,l1f);if(this._compareDate(firstAreaStart,calStart)!=0)
{var l2f=this.div.cloneNode(false);l2f.className='ttNights';var nights=this._getDaysBetween(firstAreaStart,firstAreaEnd);var l2tf=nights+' night';if(nights>1)l2tf+='s';this._ac(l2f,document.createTextNode(l2tf));this._ac(fTtArea,l2f);}
{var l3f=this.div.cloneNode(false);l3f.className='ttCheckIn';this._ac(l3f,document.createTextNode('Check-in : '));if(prop.l.p==null)
this._ac(l3f,document.createTextNode('No earlier dates'));else
{var d=Date.parseDate(prop.l.p,'%Y-%m-%d');this._ac(l3f,document.createTextNode(d.print('%a, %d %b %Y')));}
this._ac(fTtArea,l3f);}
var l4f=this.div.cloneNode(false);l4f.className='ttCheckOut';this._ac(l4f,document.createTextNode('Check-out : '));this._ac(l4f,document.createTextNode(firstAreaEnd.print('%a, %d %b %Y')));this._ac(fTtArea,l4f);return fTtArea;},this));}}
var dateStart=resEnd;var dateEnd=(nbr!=this.res.length-1)?Date.parseDate(this.res[nbr+1].s,'%Y-%m-%d'):new Date(this.ey,this.em);if(this._compareDate(dateStart,dateEnd)!=0)
{this.areaTooltips.push(new kigoCallback(function(){var ttArea=this.div.cloneNode(false);ttArea.className+=' freeAreaTooltip';ttArea.setAttribute('pos','s');var l5f=this.div.cloneNode(false);l5f.className='ttClickForAction';this._ac(l5f,document.createTextNode('Click to reserve!'));this._ac(ttArea,l5f);var l1=this.div.cloneNode(false);l1.className='ttFreeArea';this._ac(l1,document.createTextNode('Available dates'));this._ac(ttArea,l1);if(this._compareDate(dateEnd,calEnd)!=0)
{var l2=this.div.cloneNode(false);l2.className='ttNights';var nights=this._getDaysBetween(dateStart,dateEnd);var l2t=nights+' night';if(nights>1)l2t+='s';this._ac(l2,document.createTextNode(l2t));this._ac(ttArea,l2);}
var l3=this.div.cloneNode(false);l3.className='ttCheckIn';this._ac(l3,document.createTextNode('Check-in : '));this._ac(l3,document.createTextNode(dateStart.print('%a, %d %b %Y')));this._ac(ttArea,l3);{var l4=this.div.cloneNode(false);l4.className='ttCheckOut';this._ac(l4,document.createTextNode('Check-out : '));if(this._compareDate(dateEnd,calEnd)==0&&prop.l.n==null)
this._ac(l4,document.createTextNode('No further dates'));else if(this._compareDate(dateEnd,calEnd)==0)
{var d=Date.parseDate(prop.l.n,'%Y-%m-%d');this._ac(l4,document.createTextNode(d.print('%a, %d %b %Y')));}
else
this._ac(l4,document.createTextNode(dateEnd.print('%a, %d %b %Y')));this._ac(ttArea,l4);}
return ttArea;},this));}}}
else this.resTooltips[pr].push('');},this));rl.forEach(new kigoCallback(function(res,nbr)
{var resStart=Date.parseDate(res.s,'%Y-%m-%d');var resEnd=Date.parseDate(res.e,'%Y-%m-%d');var em;var ey=this.ey;if(this.em-1<0)
{em=11;ey--;}
else em=this.em-1;var newCalEnd=new Date(ey,em);newCalEnd.setDate(newCalEnd.getMonthDays());var resClass=this._getClass(res.m,res.c);if(nbr==0)
{switch(this._compareDate(calStart,resStart))
{case-1:this._createFirstArea(pr,calStart,resStart);break;case 0:this._createBlockEnd(pr,'n',resClass,null,nbr);this.lim++;break;case 1:this._createFirstReservation(pr,nbr,calStart,resEnd);break;}}
if(this._compareDate(calStart,resStart)!=1&&this._compareDate(newCalEnd,resStart)!=0)
this._createReservation(pr,nbr,resStart,resEnd);if(nbr!=this.res.length-1)
{var nextResStart=Date.parseDate(this.res[nbr+1].s,'%Y-%m-%d');if(this._compareDate(resEnd,nextResStart)!=0)
{this._createBlockEnd(pr,resClass,'n',nbr,null);this._createFreeArea(pr,resEnd,nextResStart);this._createBlockEnd(pr,'n',this._getClass(this.res[nbr+1].m,this.res[nbr+1].c),null,nbr+1);if(typeof(prop.l)=='object'&&prop.l!=null)this.lim++;}
else
{this._createBlockEnd(pr,resClass,this._getClass(this.res[nbr+1].m,this.res[nbr+1].c),nbr,nbr+1);}}
else if(this._compareDate(resEnd,newCalEnd)<=0)
{this._createBlockEnd(pr,resClass,'n',nbr,null);this._createFreeArea(pr,resEnd,calEnd);if(typeof(prop.l)=='object'&&prop.l!=null)this.lim++;}
else if(this._compareDate(resEnd,calEnd)!=0)
if(typeof(prop.l)=='object'&&prop.l!=null)this.lim++;},this));}}
kigoMPCalendar.prototype.dump = function(elm)
{var pointer=elm.parentNode;var divCal=elm;var properties=this.div.cloneNode(false);properties.className='mpcal_properties';divCal.appendChild(properties);var calendar=this.div.cloneNode(false);calendar.className='mpcal_calendar';divCal.appendChild(calendar);var dates=this.div.cloneNode(false);dates.className='mpcal_dates';calendar.appendChild(dates);var months=this.div.cloneNode(false);months.className='mpcal_months';dates.appendChild(months);var days=this.div.cloneNode(false);days.className='mpcal_days';dates.appendChild(days);var reservations=this.div.cloneNode(false);reservations.className='mpcal_reservations';divCal.appendChild(reservations);var res_container=this.div.cloneNode(false);res_container.className='mpcal_res_container';reservations.appendChild(res_container);var mb=this.div.cloneNode(false);mb.className='mpcal_month';mb.innerHTML='<p>&nbsp;</p>';months.appendChild(mb);var db=this.div.cloneNode(false);db.className='mpcal_day';db.innerHTML='<p>&nbsp;</p>';days.appendChild(db);var prop=this.div.cloneNode(false);prop.className='mpcal_property';prop.innerHTML='<p>&nbsp;</p>';properties.appendChild(prop);var dim={'mbH':mb.clientHeight,'dbW':db.clientWidth,'dbH':db.clientHeight,'propW':prop.clientWidth,'propH':prop.clientHeight};vkDom.clean(elm);var dimensions=dim;this.container=vkDom.el(elm).cloneNode(false);var properties=this.div.cloneNode(false);properties.className='mpcal_properties';this._ac(this.container,properties);var calendar=this.div.cloneNode(false);calendar.className='mpcal_calendar';this._ac(this.container,calendar);var dates=this.div.cloneNode(false);dates.className='mpcal_dates';this._ac(calendar,dates);var months=this.div.cloneNode(false);months.className='mpcal_months';this._ac(dates,months);var days=this.div.cloneNode(false);days.className='mpcal_days';this._ac(dates,days);var days_names=this.div.cloneNode(false);days_names.className='mpcal_days_names';this._ac(dates,days_names);var reservations=this.div.cloneNode(false);reservations.className='mpcal_reservations';this._ac(calendar,reservations);var res_container=this.div.cloneNode(false);res_container.className='mpcal_res_container';var clear=this.div.cloneNode(false);clear.className='clear';this._ac(this.container,clear);calendar.id='mpcal_scroller';res_container.style.position="absolute";res_container.style.top=0;reservations.style.position="relative";var p,m,d,sbs;var nbProp=this.prop.length;this.nbMonths=(this.ey-this.sy)*12+(this.em-this.sm)+1;var ligne1=this.div.cloneNode(false);ligne1.className='weekend_delimiter';ligne1.style.height=(nbProp*dimensions.propH)+"px";ligne1.style.position="absolute";ligne1.style.top="0px";ligne1.style.width=(2*dimensions.dbW-1)+'px';var ligne2=this.div.cloneNode(false);ligne2.className='weekend_line';ligne2.style.height=(nbProp*dimensions.propH)+"px";ligne2.style.position="absolute";ligne2.style.top="0px";ligne2.style.width='1px';var lastSplitter=-dimensions.dbW;for(m=0;m<this.nbMonths;m++)
{var month=this.sm+m-1-12*(Math.ceil((this.sm+m-1)/12)-1);var year=this.sy+Math.ceil((this.sm+m-1)/12)-1;var date=new Date(year,month);var mb=this.div.cloneNode(false);mb.className='mpcal_month';this._ac(mb,document.createTextNode(date.print('%B %Y')));this._ac(months,mb);var monthDays=date.getMonthDays();for(d=1;d<=monthDays;d++)
{var curDate=new Date(year,month,d).print('%a');if(curDate=='Sat'){var ligne=ligne1.cloneNode(false);ligne.style.left=(lastSplitter+(dimensions.dbW*d))+1+"px";if(m+1==this.nbMonths&&d==monthDays)
ligne.style.width=(dimensions.dbW-1)+'px';reservations.appendChild(ligne);ligne=ligne2.cloneNode(false);ligne.style.left=(lastSplitter+dimensions.dbW*(d+1))+"px";reservations.appendChild(ligne);}
var isToday=((new Date(year,month,d).print('%Y %m %d'))==new Date().print('%Y %m %d'));if(isToday){var ligneT=ligne1.cloneNode(false);ligneT.className='today_delimiter';ligneT.style.left=(lastSplitter+(dimensions.dbW*d))+"px";ligneT.style.width=(dimensions.dbW-1)+'px';reservations.appendChild(ligneT);}
var db=this.div.cloneNode(false);db.className='mpcal_day';var z=(d<10)?'0':'';this._ac(db,document.createTextNode(z+d));this._ac(days,db);if(m==0&&d==1)db.className+=' first_day';if(m==this.nbMonths-1&&d==date.getMonthDays())db.className+=' last_day';if(d==1)db.className+=' first';else if(d==date.getMonthDays())db.className+=' last';else db.className+=' middle';if(isToday)
db.className+=' today';db.className+=(d%2)?' odd':' even';db.className+=' '+curDate.toLowerCase();var db_name=this.div.cloneNode(false);db_name.className='mpcal_day';this._ac(db_name,document.createTextNode(curDate.substring(0,1)));this._ac(days_names,db_name);if(m==0&&d==1)db_name.className+=' first_day';if(m==this.nbMonths-1&&d==date.getMonthDays())db_name.className+=' last_day';if(d==1)db_name.className+=' first';else if(d==date.getMonthDays())db_name.className+=' last';else db_name.className+=' middle';if(isToday)
db_name.className+=' today';db_name.className+=(d%2)?' odd':' even';db_name.className+=' '+curDate.toLowerCase();this.nbDays++;if(this.daySize==null)this.daySize=dimensions.dbW;}
lastSplitter=lastSplitter+date.getMonthDays()*dimensions.dbW;if(m==0)mb.className+=' first';else if(m==this.nbMonths-1)mb.className+=' last';else mb.className+=' middle';mb.className+=(m%2)?' even':' odd';mb.style.width=date.getMonthDays()*dimensions.dbW+'px';}
for(p=0;p<nbProp;p++)
{if(p==0)
{var corner=this.div.cloneNode(false);corner.className='mpcal_corner';this._ac(properties,corner);}
var prop=this.div.cloneNode(false);prop.className='mpcal_property';prop.className+=(p%2)?' even':' odd';var propNameDiv;prop.appendChild((propNameDiv=kigoDom.create('div',null,this.prop[p].ib!=null?{'marginLeft':'18px'}:null).append(this.prop[p].p)).domNode());if(this.prop[p].ib==true)
{prop.appendChild(kigoDom.create('div',null,{'position':'relative'}).append(kigoTooltip.register(kigoDom.create('img',{'src':'/img/instant-book.png'},{'position':'absolute','left':'0px','top':'-16px'}),'Instant booking OK','se')).domNode());}
this._ac(properties,prop);if(p==0)prop.className+=' first';else if(p==nbProp-1)prop.className+=' last';else prop.className+=' middle';if(typeof(this.onPropertyClick)=='function')
{var propObject=this.prop[p];this._createClickOnProperty(prop,propObject);prop.className+=' clickable';}
var tt=this.div.cloneNode(false);tt.className='tooltip_grouped_calendar_prop';var propName=this.h1.cloneNode(false);this._ac(propName,document.createTextNode(this.prop[p].p));this._ac(tt,propName);if(this.prop[p].o!=null)
{var ownerName=this.div.cloneNode(false);ownerName.className='ttPropOwner';this._ac(ownerName,document.createTextNode('['+this.prop[p].o+']'));this._ac(tt,ownerName);}
if(this.prop[p].b!=null)
{var bedrooms=this.div.cloneNode(false);this._ac(bedrooms,document.createTextNode('Bedrooms: '+this.prop[p].b));this._ac(tt,bedrooms);}
if(this.prop[p].g!=null)
{var guests=this.div.cloneNode(false);this._ac(guests,document.createTextNode('Max. guests: '+this.prop[p].g));this._ac(tt,guests);}
var picture=this.div.cloneNode(false);var img=document.createElement('img');img.style.paddingTop=img.style.paddingBottom="8px";img.src=(this.prop[p].f==null)?'/img/prop_default_list_photo.jpg':'/download/PropertyPhoto/small/'+this.prop[p].f+'.jpg';this._ac(picture,img);picture.className='ttPropPicture';this._ac(tt,picture);if(this.prop[p].a!=null)
{var addr=this.div.cloneNode(false);this._ac(addr,document.createTextNode(this.prop[p].a));this._ac(tt,addr);}
if(this.prop[p].c!=null)
{var city=this.div.cloneNode(false);this._ac(city,document.createTextNode(this.prop[p].c));this._ac(tt,city);}
if(this.prop[p].rt!=null)
{var content=this.div.cloneNode(false);content.className='rate_ranges';vkDom.setTextBr(content,this.prop[p].rt);this._ac(tt,content);}
if(this.prop[p].rd!=null)
{var title=this.h2.cloneNode(false);this._ac(title,document.createTextNode('Rental details'));this._ac(tt,title);content=this.div.cloneNode(false);content.className='rate_details';vkDom.setTextBr(content,this.prop[p].rd);this._ac(tt,content);}
kigoTooltip.register(propNameDiv.domNode(),tt,'se');}
sbs=this._getScrollBarWidth();months.style.height=dimensions.mbH+'px';months.style.width=this.nbDays*dimensions.dbW+'px';days.style.height=dimensions.dbH+'px';days.style.width=this.nbDays*dimensions.dbW+'px';dates.style.height=kigo.intval(days.style.height)+kigo.intval(days.style.height)+kigo.intval(months.style.height)+'px';dates.style.width=this.nbDays*dimensions.dbW+'px';corner.style.height=(dimensions.mbH+2*dimensions.dbH)+'px';corner.style.width=dimensions.propW+'px';properties.style.height=nbProp*dimensions.propH+kigo.intval(corner.style.height)-Math.ceil(dimensions.dbH/2)+15+sbs+'px';properties.style.width=dimensions.propW+'px';reservations.style.height=nbProp*dimensions.propH+15+'px';reservations.style.width=this.nbDays*dimensions.dbW+'px';calendar.style.height=kigo.intval(dates.style.height)-Math.ceil(dimensions.dbH/2)+kigo.intval(reservations.style.height)+sbs+'px';this.reservations=res_container;new kigoList(this.prop).forEach(new kigoCallback(function(prop,pr)
{this.stack=this.nbDays;this.res=this.prop[pr].r;this._createReservations(pr);},this));this._ac(reservations,res_container);pointer.replaceChild(this.container,elm);var startDate=new kigoDate(1,this.sm,this.sy);new kigoList(this.prop).forEach(new kigoCallback(function(prop,pr)
{var cleanDate;if(prop.clean==null||!(cleanDate=kigoDate.createFromMysql(prop.clean)).inRange(startDate,startDate.addMonths(this.nbMonths)))
return;(new kigoDom(res_container)).append(kigoTooltip.register(kigoDom.create('small',null,{'position':'absolute','top':(pr*18)+'px','left':(2+(startDate.daysDiff(cleanDate)*18))+'px','fontSize':'6pt','cursor':'default'}).append(prop.cleanDone==1?'C':'P'),'Cleaning '+(prop.cleanDone==1?'done':'planned')+' on '+cleanDate.display()));},this));this.calendarDiv=calendar;if(kigoMPCalendar.scrollEvent)
{if(window.removeEventListener)
{window.removeEventListener('scroll',kigoMPCalendar.scrollEvent,false);window.removeEventListener('resize',kigoMPCalendar.scrollEvent,false);}
else if(window.detachEvent)
{window.detachEvent('onscroll',kigoMPCalendar.scrollEvent);window.detachEvent('onresize',kigoMPCalendar.scrollEvent);}}
kigoMPCalendar.scrollEvent = function(e)
{var dates_rect=calendar.getBoundingClientRect(),res_rect=res_container.getBoundingClientRect();dates.style.top=Math.min((dates_rect.top<0?(-dates_rect.top+(vkDom.hasClass(document.body,'ua-msie-8')||vkDom.hasClass(document.body,'ua-msie-9')?-1:0)):0),res_rect.bottom-res_rect.top-dimensions.dbW)+'px';};if(window.addEventListener)
{window.addEventListener('scroll',kigoMPCalendar.scrollEvent,false);window.addEventListener('resize',kigoMPCalendar.scrollEvent,false);}
else if(window.attachEvent)
{window.attachEvent('onscroll',kigoMPCalendar.scrollEvent);window.attachEvent('onresize',kigoMPCalendar.scrollEvent);}}
kigoMPCalendar.prototype.scrollToSearch = function()
{if(this.firstSearchBlock)
this.calendarDiv.scrollLeft=this.firstSearchBlock.offsetLeft-30;};

function kigoUpload(opts)
{var handler,client_data,on_complete,file_types,file_types_label,max_files,max_file_size,max_total_size,title,button_label,progress_text_single,progress_text_multiple;if(!(opts=new kigoAssoc(opts)).sizeof()||!kigo.is_string(handler=opts.get('handler',null))||!(on_complete=new kigoCallback(opts.get('on_complete',null),window)).defined()||!kigo.is_int(max_files=opts.get('max_files',1))||max_files<0||!kigo.is_int(max_file_size=opts.get('max_file_size',10485760))||max_file_size<0||!kigo.is_int(max_total_size=opts.get('max_total_size',0))||max_total_size<0||!kigo.is_string(title=opts.get('title',max_files==1?'Select a file':'Select multiple files'))||!kigo.is_string(button_label=opts.get('button_label',max_files==1?'Click here to select a file':'Click here, then use your mouse to select multiple files'))||!kigo.is_string(progress_text_single=opts.get('progress_text_single','Uploading : %n'))||!kigo.is_string(progress_text_multiple=opts.get('progress_text_multiple','Uploading file %c / %t : %n')))
throw'kigoUpload::kigoUpload(): Invalid arguments.';client_data=window.JSON.stringify(opts.get('client_data',null));file_types=opts.get('file_types',[]);file_types=new kigoList(kigo.is_string(file_types)?[file_types]:file_types);if(!kigo.is_string(file_types_label=opts.get('file_types_label',null)))
file_types_label=!file_types.length()?'All files':'(*.'+file_types.array().join(';*.').toUpperCase()+')'+' files';var file_types_flash='';file_types.forEach(function(type){file_types_flash+=(file_types_flash.length?';*.':'*.')+type.toLowerCase()+';*.'+type.toUpperCase();});var instanceName='kigoUpload_'+(++kigoUpload.instanceCounter);var movieId=instanceName+'_movie';kigoUpload.instances[instanceName]=this;if(!kigoUpload.hasFlashMinUpgradeVersion())
return;if(typeof(window['__flash__removeCallback'])!='function')
{window.__flash__removeCallback = function(instance,name)
{kigoDebug.text('__flash__removeCallback() call');try
{if(instance)
instance[name]=null;}catch(e){}};}
if(!kigoUpload.hasFlashRequiredVersion())
return;var flashContainer,cancelButton;var urlPrefix;if((urlPrefix=kigo.substr(window.location.pathname,0,4))!=='/ra/'&&(urlPrefix=kigo.substr(window.location.pathname,0,7))!=='/owner/'&&(urlPrefix=kigo.substr(window.location.pathname,0,4))!=='/bo/')
urlPrefix='/';var uploadPopup=new kigoPopup({'title':title,'width':380,'height':60,'movable':true,'content':kigoDom.create('div',{'class':'form kigo_upload'}).append(flashContainer=kigoDom.create('div',{'id':movieId,'class':'flash_container'}).append('Please wait...'),kigoDom.create('div',{'class':'buttons'}).append(cancelButton=kigoDom.create('button',{'class':'disabled','disabled':true,'type':'button'},null,{'click':function()
{try
{(new kigoDom(movieId)).domNode().CallFunction('<invoke name="cancelUpload" returntype="javascript"></invoke>');}
catch(e){}
setTimeout(function()
{uploadPopup.close();cleanup();},1);return false;}}).append('Cancel')))});this.flashDebug = function(msg)
{kigoDebug.text(kigoUpload.CFG.url+' > '+unserialize(msg));};this.flashReady = function()
{cancelButton.removeClass('disabled');cancelButton.domNode().disabled=false;};this.browseCanceled = function()
{setTimeout(function()
{uploadPopup.close();cleanup();},1);};this.authenticationError = function()
{setTimeout(function()
{uploadPopup.close();cleanup();kigoPopup.warn('Please authenticate','This feature requires user authentication.\n'+'Please log in and try again.',function()
{kigoFront.goLogout();});},1);};this.uploadComplete = function(data)
{data=unserialize(data);setTimeout(function()
{uploadPopup.close();on_complete.invoke(data.transfered,data.failed);cleanup();},1);}
swfobject.embedSWF(kigoUpload.CFG.url+'?'+(new Date()).getTime()+Math.floor(Math.random()*999999999),movieId,flashContainer.domNode().clientWidth,flashContainer.domNode().clientHeight,kigoUpload.CFG.min_version,'',{},{'menu':'false','quality':'high','base':'/','wmode':'opaque','allowScriptAccess':'sameDomain','allowFullScreen':'true','devicefont':'false','salign':'TL','flashvars':['instance=',encodeURIComponent(instanceName),'&debug=',(opts.get('flash_debug',false)?'true':'false'),'&session_name=',encodeURIComponent(kigo.CFG.APP.SESSION_NAME),'&session=',encodeURIComponent(kigoCookie.get(kigo.CFG.APP.SESSION_NAME)),'&client_data=',encodeURIComponent(client_data),'&maxFiles=',encodeURIComponent(max_files),'&maxFileSize=',encodeURIComponent(max_file_size),'&maxTotalSize=',encodeURIComponent(max_total_size),'&uploadUrl=',encodeURIComponent(urlPrefix+'upload/'+handler),'&fileTypes=',encodeURIComponent(file_types_flash),'&fileTypesLabel=',encodeURIComponent(file_types_label),'&buttonLabel=',encodeURIComponent(button_label),'&uploadProgressSingleText=',encodeURIComponent(progress_text_single),'&uploadProgressMultipleText=',encodeURIComponent(progress_text_multiple),''].join('')},{'align':'middle'},function(e)
{if(e.success)
{try
{window[movieId]=(new kigoDom(movieId)).domNode();}
catch(e){}}});function unserialize(data)
{try
{eval('data = '+kigo.base64_decode(data)+';');return data;}
catch(e)
{return null;}}

function cleanup()
{kigoUpload.instances[instanceName]=null;delete kigoUpload.instances[instanceName];}}
kigoUpload.FAIL_SYS=1;kigoUpload.FAIL_TOOMANY=2;kigoUpload.FAIL_EMPTY=3;kigoUpload.FAIL_SIZE=4;kigoUpload.FAIL_TOTAL_SIZE=5;kigoUpload.FAIL_TIMEOUT=6;kigoUpload.FAIL_HANDLER=7;kigoUpload.CFG={'url':'/swf/kigoUpload.swf','install_url':'/swf/kigoUploadFlashUpgrade.swf','min_version':'9.0.28','min_upgrade_version':'6.0.65'};kigoUpload.instanceCounter=1;kigoUpload.instances={};kigoUpload.flashPossiblyInstalled=false;kigoUpload.flashPossiblyUpgraded=false;kigoUpload.upgradePopup=null;kigoUpload.upgradeWaitPopup=null;kigoUpload.hasFlashMinUpgradeVersion = function()
{if(!swfobject.hasFlashPlayerVersion(kigoUpload.CFG.min_upgrade_version)||(arguments.length&&arguments[0]))
{kigoPopup.yesno('Adobe Flash Player required','The Adobe Flash Player is required for the file upload to work.\n'+'Please intall the Adobe Flash Player from the Adobe website: \n'+'\n'+'http://get.adobe.com/fr/flashplayer/\n'+'\n'+'Do you want to download and install Adobe Flash Player now (recommended)?'+
(kigoUpload.flashPossiblyInstalled?'\n'+'\n'+'NOTE: If you have already installed Adobe Flash Player, please select "No" and restart your browser in order to use the file upload feature.':''),function(yn)
{if(yn)
{window.open('http://get.adobe.com/fr/flashplayer/');kigoUpload.flashPossiblyInstalled=true;}},true);return false;}
return true;};kigoUpload.hasFlashRequiredVersion = function()
{if(swfobject.hasFlashPlayerVersion(kigoUpload.CFG.min_version))
return true;if(kigoUpload.flashPossiblyUpgraded)
{kigoPopup.yesno('Adobe Flash Player upgrade','If the Adobe Flash Player has successfully upgraded to the latest version, a browser restart may be required.\n'+'\n'+'Did the Adobe Flash Player upgrade succeed?\n'+'\n'+'Select "Yes" if the upgrade succeed, then restart yout browser.\n'+'Select "No" to attempt to upgrade again.',function(yesno)
{if(!yesno)
{kigoUpload.flashPossiblyUpgraded=false;kigoUpload.hasFlashRequiredVersion();}});return false;}
if(kigoUpload.upgradePopup!==null)
return false;kigoUpload.flashInstallReady = function()
{setTimeout(function()
{if(kigoUpload.upgradeWaitPopup!==null)
{kigoUpload.upgradeWaitPopup.close();kigoUpload.upgradeWaitPopup=null;}
kigoPopup.info('Adobe Flash Player upgrade','Please proceed to the Adobe Flash Player upgrade.\n'+'\n'+'This upgrade is required for using Kigo\'s file upload feature.',null);},2500);};kigoUpload.flashInstallFailed = function()
{if(kigoUpload.upgradeWaitPopup!==null)
{kigoUpload.upgradeWaitPopup.close();kigoUpload.upgradeWaitPopup=null;}
if(kigoUpload.upgradePopup!==null)
{kigoUpload.upgradePopup.close();kigoUpload.upgradePopup=null;}
kigoUpload.hasFlashMinUpgradeVersion(true);};kigoUpload.flashInstallTimedOut=kigoUpload.flashInstallFailed;kigoUpload.flashInstallCanceled=kigoUpload.flashInstallFailed;kigoUpload.flashInstallComplete = function()
{if(kigoUpload.upgradeWaitPopup!==null)
{kigoUpload.upgradeWaitPopup.close();kigoUpload.upgradeWaitPopup=null;}
if(kigoUpload.upgradePopup!==null)
{kigoUpload.upgradePopup.close();kigoUpload.upgradePopup=null;}
kigoPopup.info('Adobe Flash Player upgrade','The Adobe Flash Player is being upgraded.\n'+'\n'+'Once the upgrade has finished, please restart your browser for the changes to take effect.',null);kigoUpload.flashPossiblyUpgraded=true;};kigoUpload.upgradePopup=new kigoPopup({'title':'Adobe Flash Player Upgrade','width':330,'height':200,'content':kigoDom.create('div',{'class':'form kigo_upload_flash_install'}).append(kigoDom.create('div',{'id':'kigoUpload_flashUpgrade'}),kigoDom.create('div',{'class':'buttons'}).append(kigoDom.create('button',{'type':'button'},null,{'click':function()
{kigoUpload.upgradePopup.close();kigoUpload.upgradePopup=null;return false;}}).append('Cancel')))});kigoUpload.upgradeWaitPopup=kigoPopup.wait('Adobe Flash Player Upgrade','Adobe Flash Player Upgrade is required.\n'+'\n'+'Please wait while connecting to Adobe Flash Player servers...');swfobject.embedSWF(kigoUpload.CFG.install_url+'?'+(new Date()).getTime()+Math.floor(Math.random()*999999999),'kigoUpload_flashUpgrade',310,137,kigoUpload.CFG.min_upgrade_version,'',{},{'play':'true','menu':'false','loop':'false','quality':'high','scale':'noscale','base':'/','wmode':'opaque','allowScriptAccess':'sameDomain','allowFullScreen':'true','devicefont':'false','salign':'TL'},{'align':'middle'});return false;};

function kigoDom(el)
{
	if(kigoDom.isNode(el))
		this.node=el;
	else if(kigoDom.isInstance(el))
		this.node=el.domNode();
	else
	{
		if(typeof(el)=='string')
			this.node=document.getElementById(el);
		else
			this.node=null;

		if(!this.node)
			throw'kigoDom::kigoDom(): Invalid DOM node'+(kigo.is_string(el)?'('+el+')':'');
	}
}

kigoDom.__embryon__ = {};

kigoDom.isInstance = function(i)
{
	return kigo.is_object(i) && i.constructor===kigoDom;
};

kigoDom.isNode = function(n)
{
	return kigo.is_object(n) && typeof(n['tagName']) == 'string';
};

kigoDom.mapAttrName = function(name)
{
	switch(name.toLowerCase())
	{
		case'defaultchecked':
			return'defaultChecked';
		case'class':
		case'classname':
			return'className';
		case'colspan':
			return'colSpan';
		case'maxlength':
			return'maxLength';
		case'readonly':
			return'readOnly';
		case'rowspan':
			return'rowSpan';
		default:
			return name;
	}
};

kigoDom.prototype.dom = function()
{
	return this;
};

kigoDom.nbsp = '\u00a0';

kigoDom.getBody = function()
{
	return new kigoDom(document.body);
};

kigoDom.getById = function(id)
{
	var el = document.getElementById(id);

	if(el)
		return new kigoDom(el);

	return null;
};

kigoDom.getByTagName = function(tagName)
{
	var els = document.getElementsByTagName(tagName);

	if(arguments.length>1)
	{
		if(typeof(els[arguments[1]]) != 'undefined')
			return new kigoDom(els[arguments[1]]);
		return null;
	}
	else
	{
		var list = new kigoList();

		for(var i=0;i<els.length;i++)
			list.add(new kigoDom(els[i]));

		return list;
	}
};

kigoDom.create = function(tagName)
{
	if(typeof(tagName) != 'string')
		throw'kigoDom::create(): Bad argument';

	if(typeof(kigoDom.__embryon__[tagName=tagName.toLowerCase()]) == 'undefined')
	{
		try
		{
			kigoDom.__embryon__[tagName] = document.createElement(tagName);
		}
		catch(e)
		{
			throw'Failed creating element: '+e;
		}
	}

	var el = kigoDom.__embryon__[tagName].cloneNode(false);
	var attrName,
		name;

	if(arguments.length > 3 && kigo.is_object(arguments[3]))
	{
		for(name in arguments[3])
		{
			if(arguments[3].hasOwnProperty(name) && name == name.toLowerCase())
			{
				el[kigo.substr(name,0,2) == 'on' ? name : 'on'+name] = (function(callback){
					return function()
					{
						if(callback.defined())
							return callback.passthru(arguments);
					};
				})(new kigoCallback(arguments[3][name],el));
			}
		}
	}

	if(arguments.length > 1 && kigo.is_object(arguments[1]))
	{
		for(name in arguments[1])
{if(arguments[1].hasOwnProperty(name))
{switch(attrName=kigoDom.mapAttrName(name))
{case'id':el.id=arguments[1][name];break;case'className':el.className=arguments[1][name];break;case'checked':case'defaultChecked':if(el.tagName=='INPUT')
{if(el.type.toLowerCase()=='checkbox')
{if(attrName=='checked')
el.checked=arguments[1][name]?true:false;el.defaultChecked=arguments[1][name]?true:false;}
else if(el.type.toLowerCase()=='radio')
{if(attrName=='checked')
el.checked=arguments[1][name]?true:false;el.defaultChecked=arguments[1][name]?true:false;}
else
el.setAttribute(attrName,arguments[1][name]);}
else
el.setAttribute(attrName,arguments[1][name]);break;case'value':if(el.tagName=='INPUT'||el.tagName=='TEXTAREA')
el.value=arguments[1][name];else
el.setAttribute(attrName,arguments[1][name]);break;case'disabled':if(arguments[1][name])
el.setAttribute(attrName,true);break;case'readOnly':if(el.tagName=='INPUT'||el.tagName=='TEXTAREA')
el.readOnly=arguments[1][name]?true:false;else
el.setAttribute(attrName,arguments[1][name]);break;default:el.setAttribute(attrName,arguments[1][name]);}}}}
if(arguments.length>2&&kigo.is_object(arguments[2]))
{for(name in arguments[2])
{if(arguments[2].hasOwnProperty(name))
{switch(name)
{case'cssFloat':case'float':el.style['cssFloat']=arguments[2][name];if(kigoDom.getBody().hasClass('ua-msie'))
el.style['styleFloat']=arguments[2][name];break;default:el.style[name]=arguments[2][name];}}}}
return new kigoDom(el);};kigoDom.nl2br = function(str)
{var ret=[];new kigoList(kigo.toString(str).split('\n')).forEach(function(value,idx){ret.push(idx?kigoDom.create('br'):null,value);});return ret;};kigoDom.prototype.domNode = function()
{return this.node;};kigoDom.prototype.getById = function(id)
{var el=this.node.getElementById(id);if(el)
return new kigoDom(el);return null;};kigoDom.prototype.getByTagName = function(tagName)
{var els=this.node.getElementsByTagName(tagName);if(arguments.length>1)
{if(typeof(els[arguments[1]])!='undefined')
return new kigoDom(els[arguments[1]]);return null;}
else
{var list=new kigoList();for(var i=0;i<els.length;i++)
list.add(new kigoDom(els[i]));return list;}};kigoDom.prototype.empty = function()
{while(this.node.firstChild)
this.node.removeChild(this.node.firstChild);return this;};kigoDom.prototype.append = function()
{var type,self=this;for(var i=0;i<arguments.length;i++)
{if(kigoDom.isInstance(arguments[i]))
this.node.appendChild(arguments[i].domNode());else if((type=typeof(arguments[i]))=='string')
{if(arguments[i].length)
this.node.appendChild(document.createTextNode(arguments[i]));}
else if(type=='number')
this.node.appendChild(document.createTextNode(arguments[i]));else if(kigo.is_array(arguments[i]))
{for(var j=0;j<arguments[i].length;j++)
this.append(arguments[i][j]);}
else if(kigoList.isInstance(arguments[i]))
arguments[i].forEach(function(item){self.append(item);});else if(kigoAssoc.isInstance(arguments[i]))
arguments[i].forEach(function(key,item){self.append(item);});else if(type=='object'&&arguments[i]!=null)
this.node.appendChild(arguments[i]);}
return this;};

kigoDom.prototype.parent = kigoDom.prototype.parentNode = function()
{
	if(!this.node.parentNode || kigo.is_null(this.node.parentElement))
		return null;
	try
	{
		return new kigoDom(this.node.parentNode);
	} catch(e)
	{
		return null;
	}
};

kigoDom.prototype.orphanize = function()
{
	var p;

	if(p = this.parent())
		p.node.removeChild(this.node);

	return this;
};

kigoDom.prototype.clone = function()
{return new kigoDom(this.node.cloneNode(!arguments.length||arguments[0]?true:false));};kigoDom.prototype.swap = function(other)
{var tmp;if(!kigoDom.isInstance(other))
other=new kigoDom(other);if(this.parent())
{if(other.parent())
{tmp=kigoDom.create('span');other.node.parentNode.replaceChild(tmp.node,other.node);this.node.parentNode.replaceChild(other.node,this.node);tmp.node.parentNode.replaceChild(this.node,tmp.node);tmp=null;}
else
this.node.parentNode.replaceChild(other.node,this.node);}
else if(other.parent())
other.node.parentNode.replaceChild(this.node,other.node);tmp=this.node;this.node=other.node;other.node=tmp;tmp=null;return this;};kigoDom.prototype.hasClass = function(className)
{return(new kigoList(this.node.className.split(/\s+/))).find(className);};kigoDom.prototype.addClass = function(className)
{if(!this.hasClass(className))
this.node.className+=this.node.className.length?' '+className:className;return this;};kigoDom.prototype.removeClass = function(className)
{if(this.hasClass(className))
{var newCSS=[];(new kigoList(this.node.className.split(/\s+/))).forEach(function(cls)
{if(cls!=className)
newCSS.push(cls);});this.node.className=newCSS.join(' ');}
return this;};kigoDom.prototype.toggleClass = function(className)
{if(arguments.length>1)
{if(arguments[1])
this.addClass(className);else
this.removeClass(className);}
else
{if(this.hasClass(className))
this.removeClass(className);else
this.addClass(className);}
return this;};kigoDom.prototype.setClass = function(className)
{this.node.className=className;return this;};kigoDom.prototype.resetClass = function()
{return this.setClass('');};kigoDom.prototype.filterClass = function(callback)
{if(!kigo.is_function(callback))
throw'kigoDom::filterClass(): Bad argument';var newCSS=[];(new kigoList(this.node.className.split(/\s+/))).forEach(function(cls)
{if(callback(cls))
newCSS.push(cls);});this.node.className=newCSS.join(' ');return this;};kigoDom.prototype.setHtml = function(content)
{this.empty().node.innerHTML=content;return this;};kigoDom.prototype.getHtml = function()
{return this.node.innerHTML;};

function kigoAssoc(assoc)
{if(!arguments.length)
{this.assoc={};this.order=[];}
else if(kigoAssoc.isInstance(assoc))
{this.assoc=assoc.assoc;this.order=assoc.order;}
else if(kigo.is_object(assoc))
{this.assoc={};this.order=[];for(var key in assoc)
{if(assoc.hasOwnProperty(key))
this.set(key,assoc[key]);}}
else if((kigo.is_array(assoc)&&assoc.length)||(kigoList.isInstance(assoc)&&assoc.length()))
{var self=this;this.assoc={};this.order=[];(new kigoList(assoc)).forEach(function(value,idx)
{self.set(idx,value);});}
else
{this.assoc={};this.order=[];}}
kigoAssoc.merge = function()
{var instance=new kigoAssoc();for(var i=0;i<arguments.length;i++)
{(new kigoAssoc(arguments[i])).forEach(function(key,value)
{instance.set(key,value);});}
return instance;};kigoAssoc.prototype.empty = function()
{this.assoc={};this.order=[];return this;}
kigoAssoc.prototype.isset = function(key)
{return this.assoc.hasOwnProperty(this.testKey(key));};kigoAssoc.prototype.unset = function(key)
{if(!this.assoc.hasOwnProperty(key=this.testKey(key)))
return this;delete this.assoc[key];for(var i=0;i<this.order.length;i++)
{if(this.order[i]==key)
{this.order.splice(i,1);return this;}}
throw'kigoAssoc(): bug #97121';};kigoAssoc.prototype.set = function(key,value)
{key=this.testKey(key);if(typeof(this.assoc[key])!='undefined'&&!this.assoc.hasOwnProperty(key))
throw'Attempt to use a key that matches prototype chain property or method';if(!this.assoc.hasOwnProperty(key))
this.order.push(key);this.assoc[key]=value;return this;};kigoAssoc.prototype.reindex = function(oldKey,newKey)
{oldKey=this.testKey(oldKey);newKey=this.testKey(newKey);if(typeof(this.assoc[newKey])!='undefined'&&!this.assoc.hasOwnProperty(newKey))
throw'Attempt to use a key that matches prototype chain property or method';if(!this.assoc.hasOwnProperty(oldKey))
return null;if(oldKey==newKey)
return this;if(this.assoc.hasOwnProperty(newKey))
this.assoc[newKey]=this.assoc[oldKey];else
this.set(newKey,this.assoc[oldKey]);return this.unset(oldKey);};kigoAssoc.prototype.get = function(key)
{if(!this.assoc.hasOwnProperty(key=this.testKey(key)))
return arguments.length>1?arguments[1]:null;return this.assoc[key];};kigoAssoc.prototype.count=kigoAssoc.prototype.sizeof = function()
{return this.order.length;};kigoAssoc.prototype.forEach = function(callback)
{var key,assocClone,orderClone;if(!(callback=new kigoCallback(callback,arguments.length>1?arguments[1]:window)).defined())
throw'Callback expected';assocClone=this.object();orderClone=this.order.slice(0);for(var i=0;i<orderClone.length;i++)
callback.invoke(key=orderClone[i],assocClone[key],this);};kigoAssoc.prototype.every = function(callback)
{var key,assocClone,orderClone;if(!(callback=new kigoCallback(callback,arguments.length>1?arguments[1]:window)).defined())
throw'Callback expected';assocClone=this.object();orderClone=this.order.slice(0);for(var i=0;i<orderClone.length;i++)
{if(!callback.invoke(key=orderClone[i],assocClone[key],this))
return false;}
return true;};kigoAssoc.prototype.any = function(callback)
{var key,tmp,assocClone,orderClone;if(!(callback=new kigoCallback(callback,arguments.length>1?arguments[1]:window)).defined())
throw'Callback expected';assocClone=this.object();orderClone=this.order.slice(0);for(var i=0;i<orderClone.length;i++)
{if((tmp=callback.invoke(key=orderClone[i],assocClone[key],this)))
return tmp;}
return false;};kigoAssoc.prototype.reduce = function(callback)
{var key,assocClone,orderClone,result=arguments.length>1?arguments[1]:null;if(!(callback=new kigoCallback(callback,window)).defined())
throw'Callback expected';assocClone=this.object();orderClone=this.order.slice(0);for(var i=0;i<orderClone.length;i++)
result=callback.invoke(key=orderClone[i],assocClone[key],result,this);return result;};kigoAssoc.prototype.filter = function(callback)
{var key,assocClone,orderClone;var newAssoc=new kigoAssoc();if(!(callback=new kigoCallback(callback,arguments.length>1?arguments[1]:window)).defined())
throw'Callback expected';assocClone=this.object();orderClone=this.order.slice(0);for(var i=0;i<orderClone.length;i++)
{if(callback.invoke(key=orderClone[i],assocClone[key],this))
newAssoc.set(key,assocClone[key]);}
return newAssoc;};kigoAssoc.prototype.map = function(callback)
{var key,assocClone,orderClone;var newAssoc=new kigoAssoc();if(!(callback=new kigoCallback(callback,arguments.length>1?arguments[1]:window)).defined())
throw'Callback expected';assocClone=this.object();orderClone=this.order.slice(0);for(var i=0;i<orderClone.length;i++)
newAssoc.set(key=orderClone[i],callback.invoke(key,assocClone[key],this));return newAssoc;};kigoAssoc.prototype.kmap = function(callback)
{var key,assocClone,orderClone;var newAssoc=new kigoAssoc();if(!(callback=new kigoCallback(callback,arguments.length>1?arguments[1]:window)).defined())
throw'Callback expected';assocClone=this.object();orderClone=this.order.slice(0);for(var i=0;i<orderClone.length;i++)
newAssoc.set(callback.invoke(key=orderClone[i],assocClone[key],this),assocClone[key]);return newAssoc;};kigoAssoc.prototype.sort = function(callback)
{var assocClone,orderClone;var newAssoc=new kigoAssoc();if(!(callback=new kigoCallback(callback,window)).defined())
throw'Callback expected';assocClone=this.object();orderClone=this.order.slice(0);orderClone.sort(function(a,b)
{return callback.invoke(a,assocClone[a],b,assocClone[b]);});for(var i=0;i<orderClone.length;i++)
newAssoc.set(orderClone[i],this.assoc[orderClone[i]]);return newAssoc;};kigoAssoc.prototype.shuffle = function()
{var instance=new kigoAssoc();instance.assoc=this.object();instance.order=(new kigoList(this.order)).shuffle().array();return instance;};kigoAssoc.prototype.find = function(value)
{var key;if(arguments.length>1&&arguments[1])
{for(key in this.assoc)
{if(this.assoc.hasOwnProperty(key)&&this.assoc[key]===value)
return true;}}
else
{for(key in this.assoc)
{if(this.assoc.hasOwnProperty(key)&&this.assoc[key]==value)
return true;}}
return false;};kigoAssoc.prototype.object = function()
{var clone={};for(var key in this.assoc)
{if(this.assoc.hasOwnProperty(key))
clone[key]=this.assoc[key];}
return clone;};kigoAssoc.prototype.values=kigoAssoc.prototype.array = function()
{var arr=[];for(var i=0;i<this.order.length;i++)
arr.push(this.assoc[this.order[i]]);return arr;};kigoAssoc.prototype.keys = function()
{return new kigoList(this.order.slice(0));};kigoAssoc.prototype.clone = function()
{var instance=new kigoAssoc();instance.assoc=this.object();instance.order=this.order.slice(0);return instance;};kigoAssoc.prototype.testKey = function(key)
{if(kigo.is_string(key))
return key;if(kigo.is_int(key))
return''+key;throw'Bad key value';};kigoAssoc.isInstance = function(i)
{return kigo.is_object(i)&&i.constructor===kigoAssoc;};

var kigoCookie={'set':function(name,value)
{if(!this._is_token(name))
throw'kigoCookie::set(): invalid cookie name';var str=name+'='+this._escape(value);var optobj=new kigoAssoc(arguments.length>2?arguments[2]:{});var self=this;optobj.forEach(function(name,value)
{switch(name)
{case'expires_date':if(optobj.isset('expires_seconds'))
throw'kigoCookie::set(): either "expires_date" or "expires_seconds" option may be specified, not both';if(self._escape(value)!=value)
throw'kigoCookie::set(): invalid value for "expires_date" option';str+='; expires='+value;break;case'expires_seconds':if(optobj.isset('expires_date'))
throw'kigoCookie::set(): either "expires_date" or "expires_seconds" option may be specified, not both';if(kigo.trim(value)!=kigo.toString(value=kigo.intval(value)))
throw'kigoCookie::set(): invalid value for "expires_seconds" option';var expDate=new Date();expDate.setTime(expDate.getTime()+(value*1000));str+='; expires='+expDate.toGMTString();break;case'domain':if(!kigo.is_string(value)||kigo.strpos(value,';')!==null)
throw'kigoCookie::set(): invalid value for "domain" option';if((value=kigo.trim(value)).length)
str+='; domain='+value;break;case'path':if(!kigo.is_string(value)||kigo.strpos(value,';')!==null)
throw'kigoCookie::set(): invalid value for "path" option';if((value=kigo.trim(value)).length)
str+='; path='+value;break;case'secure':if(!kigo.is_bool(value))
throw'kigoCookie::set(): "secure" is a boolean option';if(value)
str+='; secure';break;default:throw'kigoCookie::set(): unexpected option: "'+name+'"';}});document.cookie=str;return this;},'get':function(name)
{if(!this._is_token(name))
throw'kigoCookie::get(): invalid cookie name';var search=name+'=';var parts=document.cookie.split('; ');for(var i=0;i<parts.length;i++)
{if(parts[i].indexOf(search)==0)
return decodeURIComponent(parts[i].substring(search.length));}
return arguments.length>1?arguments[1]:null;},'setSerialized':function(name,value)
{return this.set(name,JSON.stringify(value),arguments.length>2?arguments[2]:{});},'getSerialized':function(name)
{var def=arguments.length>1?arguments[1]:null;try
{return JSON.parse(kigoCookie.get(name,JSON.stringify(def)));}
catch(e)
{return def;}},'unset':function(name)
{if(!this._is_token(name))
throw'kigoCookie::unset(): invalid cookie name';var str=name+'='+'; expires=Thu, 01 Jan 1970 00:00:00 GMT';var optobj=new kigoAssoc(arguments.length>1?arguments[1]:{});var self=this;optobj.forEach(function(name,value)
{switch(name)
{case'domain':if(!kigo.is_string(value)||kigo.strpos(value,';')!==null)
throw'kigoCookie::unset(): invalid value for "domain" option';if((value=kigo.trim(value)).length)
str+='; domain='+value;break;case'path':if(!kigo.is_string(value)||kigo.strpos(value,';')!==null)
throw'kigoCookie::unset(): invalid value for "path" option';if((value=kigo.trim(value)).length)
str+='; path='+value;break;default:throw'kigoCookie::unset(): unexpected option: "'+name+'"';}});document.cookie=str;return this;},'_escape':function(str)
{return encodeURIComponent(str).replace(new RegExp('\\(','g'),'%28').replace(new RegExp('\\)','g'),'%29');},'_is_token':function(str)
{var cc;for(var i=0;i<str.length;i++)
{if((cc=str.charCodeAt(i))<=32||cc>127)
return false;switch(str.substr(i,1))
{case'(':case')':case'<':case'>':case'@':case',':case';':case':':case'\\':case'"':case'/':case'[':case']':case'?':case'=':case'{':case'}':return false;}}
return true;}};

function kigoPopup(optobj)
{var o=new kigoAssoc(optobj);var content=o.get('content',null);if(kigo.is_function(content))
content=new kigoCallback(content,this);this.title=o.get('title',null);this.containerWidth=o.get('width');this.containerHeight=o.get('height',null);this.movable=o.get('movable',false);if(!kigo.is_int(this.containerWidth))
throw'new kigoPopup(): invalid "width"';if(this.containerHeight!==null&&!kigo.is_int(this.containerHeight))
throw'new kigoPopup(): invalid "height"';if(!kigo.is_bool(this.movable))
throw'new kigoPopup(): invalid "movable"';this.open=true;this.containerEl=null;this.innerTitleContainer=null;this.outerTitleContainer=null;this.outline=null;this.dragStart=null;var style={'width':this.containerWidth+'px'};if(this.containerHeight!==null)
style.height=this.containerHeight+'px';this.outline=kigoDom.create('div',{'class':'kigo_popup outline'}).append((this._focusTrap=kigoDom.create('a',{'href':'#','class':'focustrap'})).append('x'),(this.outerTitleContainer=kigoDom.create('div',{'class':'title'},{'display':this.title===null?'none':'block'})).append((this.innerTitleContainer=kigoDom.create('div',{'class':'innertitle'},{'display':this.title===null?'none':'block'})).append(this.title)));this.zIndex=kigoPopup._register(this);this.outline.append((this.containerEl=kigoDom.create('div',{'class':'container'},style)).append(kigoCallback.isInstance(content)?content.invoke(this):content));if(this.movable)
this.initMovable();this.recenter();}
kigoPopup.prototype.close = function()
{if(this.movable)
{if(window.removeEventListener)
this.outerTitleContainer.domNode().removeEventListener('mousedown',this.dragStart,false);else if(window.detachEvent)
this.outerTitleContainer.domNode().detachEvent('onmousedown',this.dragStart);}
if(!kigoPopup._unregister(this.zIndex))
return false;delete this.innerTitleContainer;delete this.containerEl;delete this.outline;this.open=false;return true;};kigoPopup.prototype.isOpen = function()
{return this.open;};kigoPopup.prototype.container = function()
{return this.containerEl;};kigoPopup.prototype.recenter = function()
{kigoPopup.instanceReposition(this.zIndex);};kigoPopup.prototype.setTitle = function(value)
{this.innerTitleContainer.empty().append(value);this.outerTitleContainer.domNode().style.display=this.innerTitleContainer.domNode().style.display=(value==null?'none':'block');};kigoPopup.prototype.initMovable = function()
{var self=this;var element=this.outerTitleContainer.domNode();element.unselectable="on";element.onselectstart = function(){return false;};element.ondragstart = function(){return false;};element.style.userSelect=element.style.MozUserSelect="none";element.onmousedown = function(e)
{e=e||window.event;if(e.button==1&&window.event!=null||e.button==0)
{var cnt=self.outline.domNode();self.startX=e.clientX;self.startY=e.clientY;self.cntStartX=parseInt(cnt.style.left,10);self.cntStartY=parseInt(cnt.style.top,10);if(element.setCapture){element.setCapture();}
kigoPopup.dragMove = function(e)
{var top,left,cnt=self.outline.domNode();e=e||window.event;var scrollTop=Math.max(document.documentElement.scrollTop,document.body.scrollTop);var scrollLeft=Math.max(document.documentElement.scrollLeft,document.body.scrollLeft);cnt.style.left=((left=(self.cntStartX+(e.clientX-self.startX)))>0?(((left+cnt.offsetWidth)<(scrollLeft+document.documentElement.clientWidth))?left:scrollLeft+document.documentElement.clientWidth-cnt.offsetWidth):0)+'px';cnt.style.top=((top=(self.cntStartY+(e.clientY-self.startY)))>0?(((top+cnt.offsetHeight)<(scrollTop+document.documentElement.clientHeight))?top:scrollTop+document.documentElement.clientHeight-cnt.offsetHeight):0)+'px';};kigoPopup.dragEnd = function(e)
{if(window.removeEventListener)
{window.removeEventListener('mousemove',kigoPopup.dragMove,true);window.removeEventListener('mouseup',kigoPopup.dragEnd,true);}
else if(document.detachEvent)
{document.detachEvent('onmousemove',kigoPopup.dragMove);document.detachEvent('onmouseup',kigoPopup.dragEnd);}
kigoPopup.dragMove=null;kigoPopup.dragEnd=null;if(element.releaseCapture){element.releaseCapture();}};if(window.addEventListener)
{window.addEventListener('mousemove',kigoPopup.dragMove,true);window.addEventListener('mouseup',kigoPopup.dragEnd,true);}
else if(window.attachEvent)
{document.attachEvent('onmousemove',kigoPopup.dragMove);document.attachEvent('onmouseup',kigoPopup.dragEnd);}}
return false;};};kigoPopup._createDialog = function(title,text,iconCls,buttons,focusItem)
{var popupInstance,width=380;popupInstance=new kigoPopup({'title':title,'movable':true,'width':width,'content':function()
{return[kigoDom.create('div',{'class':'message '+iconCls}).append((new kigoList(kigo.toString(text).split('\n'))).map(function(value,idx){return[idx?kigoDom.create('br'):null,value];})),buttons===null?null:kigoDom.create('div',{'class':'buttons'}).append(buttons)];}});if(focusItem)
focusItem.domNode().focus();return popupInstance;};kigoPopup.yesno = function(title,text)
{var yesBtn,noBtn,callback=new kigoCallback(arguments.length>2?arguments[2]:null);var popupInstance=kigoPopup._createDialog(title,text,'yesno',[(yesBtn=kigoDom.create('button',{'class':'yes','type':'button'},null,{'click':function(){if(popupInstance.close()&&callback.defined())callback.invoke(true);}})).append('Yes'),(noBtn=kigoDom.create('button',{'class':'no','type':'button'},null,{'click':function(){if(popupInstance.close()&&callback.defined())callback.invoke(false);}})).append('No')],((arguments.length>3&&arguments[3])?yesBtn:noBtn));return popupInstance;};kigoPopup.info = function(title,text)
{var okBtn,callback=new kigoCallback(arguments.length>2?arguments[2]:null);var popupInstance=kigoPopup._createDialog(title,text,'info',(okBtn=kigoDom.create('button',{'class':'ok','type':'button'},null,{'click':function(){if(popupInstance.close()&&callback.defined())callback.invoke();}})).append('OK'),okBtn);return popupInstance;};kigoPopup.warn = function(title,text)
{var okBtn,callback=new kigoCallback(arguments.length>2?arguments[2]:null);var popupInstance=kigoPopup._createDialog(title,text,'warn',(okBtn=kigoDom.create('button',{'class':'ok','type':'button'},null,{'click':function(){if(popupInstance.close()&&callback.defined())callback.invoke();}})).append('OK'),okBtn);return popupInstance;};kigoPopup.error = function(title,text)
{var okBtn,callback=new kigoCallback(arguments.length>2?arguments[2]:null);var popupInstance=kigoPopup._createDialog(title,text,'error',(okBtn=kigoDom.create('button',{'class':'ok','type':'button'},null,{'click':function(){if(popupInstance.close()&&callback.defined())callback.invoke();}})).append('OK'),okBtn);return popupInstance;};kigoPopup.ok = function(title,text)
{var okBtn,callback=new kigoCallback(arguments.length>2?arguments[2]:null);var popupInstance=kigoPopup._createDialog(title,text,'ok',(okBtn=kigoDom.create('button',{'class':'ok','type':'button'},null,{'click':function(){if(popupInstance.close()&&callback.defined())callback.invoke();}})).append('OK'),okBtn);return popupInstance;};kigoPopup.wait = function(title,text)
{return kigoPopup._createDialog(title,text,'wait',null,null);};kigoPopup.loading = function()
{return new kigoPopup({'width':220,'content':kigoDom.create('span',{'class':'loading'}).append()});};kigoPopup.zIndexBase=null;kigoPopup.currentMaskZIndex=-2;kigoPopup.mask=kigoDom.create('div',{'class':'kigo_popup mask'});kigoPopup.updateMasking = function()
{var useMask=!!kigoPopup.instances.count();if(!useMask)
{kigoPopup.mask.orphanize();if(window.removeEventListener)
{window.removeEventListener('keydown',kigoPopup.onTabKey,false);if(!kigoDom.getBody().hasClass('ua_os-ios'))
window.removeEventListener('resize',kigoPopup.reposition,false);window.removeEventListener('focus',kigoPopup.moveNextWithTimeout,false);}
else if(window.detachEvent)
{document.detachEvent('onkeydown',kigoPopup.onTabKey);window.detachEvent('onresize',kigoPopup.reposition);}}
else if(kigoPopup.currentMaskZIndex<kigoPopup.zIndexBase)
{kigoDom.getBody().append(kigoPopup.mask);kigoPopup.maskReposition();if(window.addEventListener)
{window.addEventListener('keydown',kigoPopup.onTabKey,false);if(!kigoDom.getBody().hasClass('ua_os-ios'))
window.addEventListener('resize',kigoPopup.reposition,false);window.addEventListener('focus',kigoPopup.moveNextWithTimeout,false);}
else if(window.attachEvent)
{document.attachEvent('onkeydown',kigoPopup.onTabKey);window.attachEvent('onresize',kigoPopup.reposition);}}
return kigoPopup.mask.domNode().style.zIndex=kigoPopup.currentMaskZIndex=(useMask?kigoPopup.instances.keys().getLast()-1:-2);};kigoPopup.maskReposition = function()
{kigoPopup.mask.domNode().style.width=Math.max(document.documentElement.clientWidth,document.documentElement.scrollWidth)+'px';kigoPopup.mask.domNode().style.height=Math.max(document.documentElement.clientHeight,document.documentElement.scrollHeight)+'px';};kigoPopup.instances=new kigoAssoc();kigoPopup._register = function(popupInstance)
{if(kigoPopup.zIndexBase===null)
throw'new kigoPopup(): zIndexBase is not defined';if(!kigoPopup.instances.count())
kigoPopup.currentMaskZIndex=kigoPopup.zIndexBase-3;var zIndex=kigoPopup.currentMaskZIndex+3;kigoPopup.instances.set(zIndex,popupInstance);popupInstance.outline.domNode().style.zIndex=zIndex;kigoDom.getBody().append(popupInstance.outline);kigoPopup.updateMasking();kigoPopup.blur();return zIndex;};kigoPopup._unregister = function(zIndex)
{var popup=kigoPopup.instances.get(zIndex);if(popup===null||!popup.isOpen())
return false;var isCurrent=(kigoPopup.instances.keys().getLast()==zIndex);kigoPopup.instances.unset(zIndex);popup.outline.orphanize();kigoPopup.updateMasking();if(isCurrent&&kigoPopup.getCurrent())
kigoPopup.moveNext();return true;};kigoPopup.getCurrent = function()
{if(!kigoPopup.instances.count())
return false;return kigoPopup.instances.get(kigoPopup.instances.keys().getLast());};kigoPopup.instanceReposition = function()
{function repo(popup)
{var pop=popup.outline.domNode();pop.style.left=Math.max(0,(document.documentElement.clientWidth-pop.clientWidth)>>1)+'px';pop.style.top=Math.max(0,Math.min((Math.max(document.documentElement.scrollTop,document.body.scrollTop)+((document.documentElement.clientHeight-pop.clientHeight)>>1)),kigoDom.getBody().domNode().clientHeight-pop.clientHeight-10))+'px';}
if(arguments.length>0&&arguments[0]!=null)
repo(kigoPopup.instances.get(arguments[0]));else
kigoPopup.instances.forEach(function(zIndex,popup){repo(popup);});};kigoPopup.reposition = function()
{if(kigoPopup.instances.count())
{kigoPopup.maskReposition();kigoPopup.instanceReposition();}};kigoPopup.onTabKey = function(e)
{if(!kigoPopup.instances.count())
return true;if(e.keyCode==9&&!e.ctrlKey&&!e.altKey)
{var currTab=0,target=null;if(e=(e||window.event))
{if(e.target)
target=e.target;else if(e.srcElement)
target=e.srcElement;if(target&&target.nodeType==3)
target=target.parentNode;}
if(!target||target.tabIndex===undefined||(currTab=target.tabIndex)===-1)
currTab=0;kigoPopup.moveNext(currTab,target,e.shiftKey);if(e.stopPropagation)
e.stopPropagation();if(e.stopImmediatePropagation)
e.stopImmediatePropagation();if(e.preventDefault)
e.preventDefault();e.bubbles=false;if(window.event)
window.event.cancelBubble=true;return false;}};kigoPopup.moveNext = function(currTab,currEl,reverse)
{var currentPopup;if(!(currentPopup=kigoPopup.getCurrent()))
return;var liveNodeList=currentPopup.container().domNode().getElementsByTagName('*'),list=[],rfocusable=/^(?:button|input|object|select|textarea|a)$/i,lowestTabIndex=Infinity,lowestNextTabIndex=Infinity,lowestTabIndexEl=null,lowestNextTabIndexEl=null,seenCurrentFocusedEl=false,i;if(liveNodeList!=null)
{for(var idx=liveNodeList.length;idx-->0;)
list[idx]=liveNodeList[idx];}
if(currTab==null)
currTab=0;if(reverse)
{for(i=list.length-1;i>=0;i--)
calcNext(list[i]);}
else
{for(i=0;i<list.length;i++)
calcNext(list[i]);}
if(lowestNextTabIndexEl!=null)
{try{lowestNextTabIndexEl.focus();}catch(er){return kigoPopup.blur();}}
else if(lowestTabIndexEl!=null)
{try{lowestTabIndexEl.focus();}catch(er){return kigoPopup.blur();}}
else
return kigoPopup.blur();function calcNext(el)
{var tabIndex;if(el.nodeType!==1||!rfocusable.test(el.nodeName)||(tabIndex=el.tabIndex)<0||!el.focus||el.disabled===true)
return;if(el===currEl)
seenCurrentFocusedEl=true;if(tabIndex<lowestTabIndex)
{lowestTabIndex=tabIndex;lowestTabIndexEl=el;}
if(tabIndex<lowestNextTabIndex&&(tabIndex>currTab||(tabIndex===currTab&&el!==currEl&&seenCurrentFocusedEl)))
{lowestNextTabIndex=tabIndex;lowestNextTabIndexEl=el;}}};kigoPopup.moveNextWithTimeout = function(){setTimeout(function(){kigoPopup.moveNext();},0);};kigoPopup.blur = function()
{var currentPopup=kigoPopup.getCurrent();if(!currentPopup)
return false;try{if(document.activeElement!=null&&document.activeElement!=window&&document.activeElement!=document&&kigo.is_function(document.activeElement.blur))
document.activeElement.blur();else
{currentPopup._focusTrap.domNode().focus();currentPopup._focusTrap.domNode().blur();}}
catch(e){}
return false;};

function kigoCheckbox(el)
{var tmp,self=this;if(!arguments.length||el===null)
this.node=kigoDom.create('input',{'type':'checkbox','class':'kigo_checkbox'});else
{try
{this.node=new kigoDom(el);}
catch(e)
{throw'kigoCheckbox::kigoCheckbox(): Invalid DOM node';}
if(this.node.domNode().tagName!='INPUT'||kigo.strtoupper(this.node.domNode().getAttribute('type'))!='CHECKBOX')
throw'kigoCheckbox::kigoCheckbox(): Not an INPUT CHECKBOX node';this.node.addClass('kigo_checkbox');}
this.beforeChangeCallback=new kigoCallback(null);this.inBeforeChangeCallback=false;this.changeCallback=new kigoCallback(null);this.node.domNode().onclick = function()
{var tmp;var value=this.checked?true:false;var prevValue=!value;if(self.beforeChangeCallback.defined())
{self.inBeforeChangeCallback=true;tmp=self.beforeChangeCallback.invoke(value,prevValue);self.inBeforeChangeCallback=false;if(tmp!==true)
return false;}
if(self.changeCallback.defined())
self.changeCallback.invoke(value,prevValue);return true;}
this.setValue(false);}
kigoCheckbox.isInstance = function(i)
{return kigo.is_object(i)&&i.constructor===kigoCheckbox;};kigoCheckbox.prototype.dom = function()
{return this.node;};kigoCheckbox.prototype.domNode = function()
{return this.node.domNode();};kigoCheckbox.prototype.onBeforeChange = function(callback)
{this.beforeChangeCallback=new kigoCallback(callback,this);return this;};kigoCheckbox.prototype.onChange = function(callback)
{this.changeCallback=new kigoCallback(callback,this);return this;};kigoCheckbox.prototype.getValue = function()
{return this.node.domNode().checked?true:false;};kigoCheckbox.prototype.checked=kigoCheckbox.prototype.getValue;kigoCheckbox.prototype.setValue = function(value)
{if(this.inBeforeChangeCallback)
throw'kigoCheckbox::setValue() canot be invoked from a onBeforeChange handler';var prevValue=this.getValue();this.node.domNode().checked=(value=(value&&value!=='0'?true:false));if(this.node.domNode().getAttribute('defaultChecked')!==this.node.domNode().checked)
this.node.domNode().setAttribute('defaultChecked',this.node.domNode().checked);if(this.changeCallback.defined()&&((value!==prevValue&&arguments.length>1&&arguments[1])||(arguments.length>2&&arguments[1]&&arguments[2])))
this.changeCallback.invoke(value,prevValue);return this;};kigoCheckbox.prototype.clone = function()
{throw'kigoCheckbox::clone(): Not implemented';};

var kigoXmlParser={'ELEMENT_NODE':1,'ATTRIBUTE_NODE':2,'TEXT_NODE':3,'CDATA_SECTION_NODE':4,'ENTITY_REFERENCE_NODE':5,'ENTITY_NODE':6,'PROCESSING_INSTRUCTION_NODE':7,'COMMENT_NODE':8,'DOCUMENT_NODE':9,'DOCUMENT_TYPE_NODE':10,'DOCUMENT_FRAGMENT_NODE':11,'NOTATION_NODE':12,'E_SUCCESS':0,'E_SUPPORT':1,'E_MALFORMED':2,'E_CANCELED':3,'parse':function(xmlString,handlers)
{var config,parser,doc,root;if(!kigo.is_string(xmlString))
throw'kigoXmlParser::parse(): Invalid arguments';handlers=new kigoAssoc(handlers);try
{handlers={'element_start':new kigoCallback(handlers.get('element_start')),'element_end':new kigoCallback(handlers.get('element_end')),'character_data':new kigoCallback(handlers.get('character_data'))};}
catch(e)
{throw'kigoXmlParser::parse(): Invalid handler(s)';}
config=new kigoAssoc({'cancellable':false});if(arguments.length>2)
{(new kigoAssoc(arguments[2])).forEach(function(key,value)
{if(config.isset(key)&&typeof(value)==typeof(config.get(key)))
config.set(key,value);});}
function findRootElement(doc)
{var element=null;if(!doc.hasChildNodes())
return null;for(var i=0;i<doc.childNodes.length;i++)
{if(doc.childNodes[i].nodeType===kigoXmlParser.ELEMENT_NODE)
{if(element)
return null;element=doc.childNodes[i];}}
return element;}
if(typeof(DOMParser)==='function'||typeof(DOMParser)==='object')
{parser=new DOMParser();try
{doc=parser.parseFromString(xmlString,'text/xml');}
catch(e)
{return kigoXmlParser.E_MALFORMED;}
parser=null;if(!kigo.is_object(doc)||doc.nodeType!==kigoXmlParser.DOCUMENT_NODE||!doc.firstChild||!(root=findRootElement(doc)))
return kigoXmlParser.E_MALFORMED;if((root.tagName=='parsererror'&&root.namespaceURI==='http://www.mozilla.org/newlayout/xml/parsererror.xml'&&root.getElementsByTagName('sourcetext').length==1)||(root.getElementsByTagName('parsererror').length))
{var errorDoc;var piName='kigoXmlParserPI'+(doc.lastChild!==null&&doc.lastChild.nodeType===kigoXmlParser.PROCESSING_INSTRUCTION_NODE?'_'+doc.lastChild.target:'');parser=new DOMParser();try
{errorDoc=parser.parseFromString(xmlString+'<?'+piName+'?>','text/xml');}
catch(e)
{throw'kigoXmlParser: Unexpected error (#57111).';}
parser=null;if(!kigo.is_object(errorDoc)||errorDoc.nodeType!==kigoXmlParser.DOCUMENT_NODE||!errorDoc.lastChild)
throw'kigoXmlParser: Unexpected error (#57114).';if(errorDoc.lastChild.nodeType!==kigoXmlParser.PROCESSING_INSTRUCTION_NODE||errorDoc.lastChild.target!=piName)
return kigoXmlParser.E_MALFORMED;}}
else if(window.ActiveXObject)
{try
{parser=new ActiveXObject('MSXML.DomDocument');}
catch(e0)
{try
{parser=new ActiveXObject('Microsoft.XMLDOM');}
catch(e1)
{return kigoXmlParser.E_SUPPORT;}}
parser.async=false;parser.validateOnParse=false;parser.preserveWhiteSpace=true;parser.resolveExternals=false;try
{if(!parser.loadXML(xmlString))
throw'Failed';}
catch(e)
{return kigoXmlParser.E_MALFORMED;}
if(!kigo.is_object(parser)||parser.nodeType!==kigoXmlParser.DOCUMENT_NODE||!parser.firstChild||!(root=findRootElement(parser)))
return kigoXmlParser.E_MALFORMED;parser=null;}
else
return kigoXmlParser.E_SUPPORT;return(function(node)
{var tmp,attributes;switch(node.nodeType)
{case kigoXmlParser.ELEMENT_NODE:if(handlers.element_start.defined()||handlers.element_end.defined())
{attributes=buildAttributes(node);if(handlers.element_start.defined()&&handlers.element_start.invoke(node.tagName,attributes.clone())!==true&&config.get('cancellable'))
return kigoXmlParser.E_CANCELED;}
for(var i=0;i<node.childNodes.length;++i)
{if((tmp=arguments.callee(node.childNodes[i]))!==kigoXmlParser.E_SUCCESS)
return tmp;}
if(handlers.element_end.defined()&&handlers.element_end.invoke(node.tagName,attributes)!==true&&config.get('cancellable'))
return kigoXmlParser.E_CANCELED;return kigoXmlParser.E_SUCCESS;case kigoXmlParser.TEXT_NODE:case kigoXmlParser.CDATA_SECTION_NODE:if(handlers.character_data.defined())
{if(handlers.character_data.invoke(node.nodeValue,parentElement(node.parentNode).tagName,buildAttributes(parentElement(node.parentNode)))!==true&&config.get('cancellable'))
return kigoXmlParser.E_CANCELED;}
return kigoXmlParser.E_SUCCESS;case kigoXmlParser.ENTITY_REFERENCE_NODE:for(var i=0;i<node.childNodes.length;++i)
{if((tmp=arguments.callee(node.childNodes[i]))!==kigoXmlParser.E_SUCCESS)
return tmp;}
return kigoXmlParser.E_SUCCESS;case kigoXmlParser.ENTITY_NODE:case kigoXmlParser.PROCESSING_INSTRUCTION_NODE:case kigoXmlParser.COMMENT_NODE:case kigoXmlParser.NOTATION_NODE:return kigoXmlParser.E_SUCCESS;case kigoXmlParser.ATTRIBUTE_NODE:case kigoXmlParser.DOCUMENT_NODE:case kigoXmlParser.DOCUMENT_TYPE_NODE:case kigoXmlParser.DOCUMENT_FRAGMENT_NODE:default:throw'kigoXmlParser: Unexpected error (#57118).';}
function parentElement(node)
{return node.nodeType==kigoXmlParser.ELEMENT_NODE?node:arguments.callee(node.parentNode);}
function buildAttributes(node)
{var attributes=new kigoAssoc();for(var i=0;i<node.attributes.length;++i)
attributes.set(node.attributes[i].name,node.attributes[i].value);return attributes;}})(root);},'hasSupport':function()
{return(typeof(DOMParser)==='function'||typeof(DOMParser)==='object'||(window.ActiveXObject&&(function()
{var parser;try
{parser=new ActiveXObject('MSXML.DomDocument');}
catch(e0)
{try
{parser=new ActiveXObject('Microsoft.XMLDOM');}
catch(e1)
{return false;}}
return true;})()));}};

function kigoExport(handler,opts)
{var waitSeconds=4;var defaultGuiWidth=580;var requiresPassword,emailDelivery,defaultEmailAddress,defaultEmailSubject,defaultEmailText,exportOptions,exportOptionsGui,exportOptionsGuiWidth;var password,jobId,jobSecret,jobEmailAddress,jobDownloadName,jobDownloadExtension;if(!kigo.is_string(handler)||!(opts=new kigoAssoc(opts)).sizeof()||!kigo.is_bool(requiresPassword=opts.get('requiresPassword',false))||!kigo.is_bool(emailDelivery=opts.get('emailDelivery',false))||!(opts.isset('options')^(opts.isset('optionsGui')||opts.isset('optionsGuiWidth')))||(opts.isset('optionsGuiWidth')&&!opts.isset('optionsGui')))
throw'kigoExport::kigoExport(): Invalid arguments.';if(opts.isset('options'))
{exportOptions=opts.get('options');exportOptionsGui=null;}
else
{exportOptions=null;if(!kigo.is_object(exportOptionsGui=opts.get('optionsGui'))||!kigo.is_function(exportOptionsGui['render'])||!kigo.is_function(exportOptionsGui['test'])||!kigo.is_function(exportOptionsGui['get']))
throw'kigoExport::kigoExport(): Invalid optionsGui argument.';if(!kigo.is_int(exportOptionsGuiWidth=opts.get('optionsGuiWidth',defaultGuiWidth)))
throw'kigoExport::kigoExport(): Invalid optionsGuiWidth argument.';}
if(!kigoVal.EMAIL(defaultEmailAddress=opts.get('defaultEmailAddress','')))
defaultEmailAddress=null;defaultEmailSubject=opts.get('defaultEmailSubject','Export file download');defaultEmailText=opts.get('defaultEmailText','');if(requiresPassword)
renderPassword(renderGui);else
renderGui();function renderPassword(cb)
{var pwdInput;var pwdPopup=new kigoPopup({'width':280,'movable':true,'title':'Enter password for export','content':[kigoDom.create('form',null,null,{'submit':function(){return false;}}).append(kigoDom.create('div',{'class':'form'},{'padding':'16px'}).append(kigoDom.create('p').append('Export password',' ',kigoTooltip.icon(['The export password is different from your account password.',kigoDom.create('br'),kigoDom.create('br'),'If you do not have an export password yet, or if you lost your export password,',kigoDom.create('br'),'please contact the Kigo support to obtain a new password.']),kigoDom.create('br'),(pwdInput=kigoDom.create('input',{'type':'password','class':'text wide'})))),kigoDom.create('div',{'class':'buttons'}).append(kigoDom.create('button',{'type':'button'},null,{'click':function(){pwdPopup.close();}}).append('Cancel'),' ',kigoDom.create('button',{'class':'primary','type':'submit'},null,{'click':function(){kigoForm2.unmarkMissing(pwdInput);if(!pwdInput.domNode().value.length)
{kigoForm2.markMissing(pwdInput);kigoForm2.missingMandatoryMessage(pwdInput);return;}
password=pwdInput.domNode().value;pwdPopup.close();cb();return false;}}).append('Proceed')))]});pwdInput.domNode().focus();}

function renderGui()
{if(kigo.is_object(exportOptionsGui))
{var container=kigoDom.create('div',{'class':'kigo_export_gui_container'});exportOptionsGui.render(container);var p=new kigoPopup({'width':exportOptionsGuiWidth,'movable':true,'title':'Export options','content':[container,kigoDom.create('div',{'class':'buttons'}).append(kigoDom.create('button',{'type':'button'},null,{'click':function(){p.close();}}).append('Cancel'),' ',kigoDom.create('button',{'class':'primary','type':'button'},null,{'click':function(){var err;if((err=exportOptionsGui.test())===true)
{exportOptions=exportOptionsGui.get();p.close();doExportRequest();}
else if(kigo.is_string(err))
kigoPopup.warn('Invalid export options',err);else
{}}}).append('Proceed'))]});}
else
doExportRequest();}

function doExportRequest()
{var po={'HANDLER':handler,'OPTIONS':exportOptions};if(requiresPassword)
po.PASSWORD=password;new kigoAjaxRequest3('Export/request',po,{'on_reply':function(ret){switch(ret.REPLY)
{case'E_OK':break;case'E_LIMIT':kigoPopup.yesno('Too many exports','Too many exports have been requested from your account.'+'\n'+'Please wait until the previously requested exports have been delivered.'+'\n'+'\n'+'Retry now?',function(yn){if(yn)doExportRequest();});return true;case'E_BUSY':kigoPopup.warn('Server is busy','The export server is currently overloaded.'+'\n'+'Please wait a couple of seconds before retrying.'+'\n'+'\n'+'Retry now?',function(yn){if(yn)doExportRequest();});return true;case'E_CRED':kigoPopup.warn('Incorrect password','The export password you have provided for this account is incorrect.',function(){renderPassword(doExportRequest);});return true;default:return false;}
jobId=ret.JOB_ID;jobSecret=ret.JOB_SECRET;var waitPopup=kigoPopup.wait('Please wait','Please wait while your export file is being prepared...');doWait();return true;function doWait()
{new kigoAjaxRequest3('Export/query',{'JOB_ID':jobId,'JOB_SECRET':jobSecret},{'on_reply':function(ret){switch(ret.STATUS)
{case'NOT_READY':setTimeout(doWait,waitSeconds*1000);return true;case'FAILED':waitPopup.close();kigoPopup.warn('Export failed','Export could not to be generated.'+'\n'+'\n'+'We have been notified of this problem.');return true;case'READY':jobDownloadName=ret.JOB_DOWNLOAD_NAME;jobDownloadExtension=ret.JOB_DOWNLOAD_NAME_EXT;jobEmailAddress=kigo.is_string(defaultEmailAddress)?defaultEmailAddress:(kigo.is_string(ret.ACCOUNT_EMAIL)?ret.ACCOUNT_EMAIL:'');waitPopup.close();doDeliveryProcess();return true;}
return false;}});}}});}

function doDeliveryProcess()
{var deliveryType,addr,subject,text,filename;var downloadContainer,emailContainer,downloadSpan,emailSpan;filename=kigoDom.create('input',{'type':'text','class':'filename text wide','value':jobDownloadName,'maxLength':kigo.CFG.EXPORT.MAX_DOWNLOAD_NAME_LEN});var deliveryTypeCb = function(v){(v?downloadSpan:emailSpan).empty().append(filename);downloadContainer.domNode().style.display=v?'block':'none';emailContainer.domNode().style.display=!v?'block':'none';};var p=new kigoPopup({'width':450,'movable':true,'title':'Export delivery method','content':[kigoDom.create('div',{'class':'form kigo_export'},{'padding':'16px'}).append(kigoDom.create('p').append((deliveryType=new kigoSingleSelect(kigoDom.create('select'))).addOption(0,'Send export by email').addOption(1,'Download file').onChange(deliveryTypeCb).dom()),downloadContainer=kigoDom.create('div').append(kigoDom.create('p').append('Export filename',' ',kigoTooltip.icon(['Characters not allowed: ',kigoDom.create('br'),kigo.CFG.MISC.FILENAME_RESERVED_CHARS.split('').join(' ')]),kigoDom.create('br'),(downloadSpan=kigoDom.create('span').append(filename)),kigoDom.create('span').append('.'+jobDownloadExtension))),emailContainer=kigoDom.create('div').append(kigoDom.create('h3').append('Compose email'),kigoDom.create('p').append('Email address',kigoDom.create('br'),(addr=kigoDom.create('input',{'type':'email','class':'text wide addr','value':jobEmailAddress}))),kigoDom.create('p').append('Email subject',kigoDom.create('br'),(subject=kigoDom.create('input',{'type':'text','class':'text wide subject','value':defaultEmailSubject}))),kigoDom.create('p').append('Add a message (optional)',kigoDom.create('br'),(text=kigoDom.create('textarea',{'class':'wide message','value':defaultEmailText}))),kigoDom.create('p').append('Export filename',' ',kigoTooltip.icon(['Characters not allowed: ',kigoDom.create('br'),kigo.CFG.MISC.FILENAME_RESERVED_CHARS.split('').join(' ')]),kigoDom.create('br'),(emailSpan=kigoDom.create('span').append(filename)),kigoDom.create('span').append('.'+jobDownloadExtension)))),kigoDom.create('div',{'class':'buttons'}).append(kigoDom.create('button',{'type':'button'},null,{'click':function(){p.close();}}).append('Cancel'),' ',kigoDom.create('button',{'class':'primary','type':'button'},null,{'click':function(){kigoForm2.unmarkMissing(filename);kigoForm2.unmarkMissing(addr);kigoForm2.unmarkMissing(subject);var fname=kigo.trim(filename.domNode().value);if((new kigoList(kigo.CFG.MISC.FILENAME_RESERVED_CHARS.split(''))).any(function(v){return fname.indexOf(v)!=-1;}))
{kigoPopup.warn('Invalid export filename','Please avoid using the following characters in the export filename:'+'\n'+
kigo.CFG.MISC.FILENAME_RESERVED_CHARS.split('').join(' '),function()
{kigoForm2.markMissing(filename);filename.domNode().select();});return false;}
var errs=new kigoList();if(!kigoVal.VCHR(fname,kigo.CFG.EXPORT.MAX_DOWNLOAD_NAME_LEN,1))
errs.add(filename);if(!deliveryType.getValue())
{if(!kigoVal.EMAIL(addr.domNode().value))
errs.add(addr);if(!subject.domNode().value.length)
errs.add(subject);}
if(errs.length())
{kigoForm2.markMissing(errs.array());kigoForm2.missingMandatoryMessage(errs.array());return false;}
if(deliveryType.getValue())
{p.close();window.location='/download/Export/export/'+jobId+'/'+jobSecret+'/'+filename.domNode().value+'.'+jobDownloadExtension;}
else
{new kigoAjaxRequest3('Export/emailDelivery',{'JOB_ID':jobId,'JOB_SECRET':jobSecret,'EMAIL_ADDRESS':addr.domNode().value,'EMAIL_SUBJECT':subject.domNode().value,'EMAIL_TEXT':text.domNode().value,'FILENAME':filename.domNode().value},{'on_reply':function(ret){p.close();if(ret)
{kigoPopup.ok('Email sent','The email containing a link to the download file was sent to:\n'+'\n'+
addr.domNode().value);}
else
{kigoPopup.warn('Account export not available','The export file could not be found.'+'\n'+'\n'+'Please note that the undelivered export files are automatically removed after a few hours.');}
return true;}});}}}).append('Proceed'))]});deliveryType.setValue(emailDelivery?0:1,true,true);}}

function kigoImport(handler,opts)
{var waitSeconds=4;var defaultGuiWidth=580;var importOptions,importOptionsGui,importOptionsGuiWidth,importHandler,importFile,upload_options=arguments.length>2?arguments[2]:null;if(!kigo.is_string(handler)||!(opts=new kigoAssoc(opts)).sizeof()||!opts.isset('on_import')||!(opts.isset('options')^(opts.isset('optionsGui')||opts.isset('optionsGuiWidth')))||(opts.isset('optionsGuiWidth')&&!opts.isset('optionsGui')))
throw'kigoImport::kigoImport(): Invalid arguments.';importHandler=new kigoCallback(opts.get('on_import'));if(opts.isset('options'))
{importOptions=opts.get('options');importOptionsGui=null;}
else
{importOptions=null;if(!kigo.is_object(importOptionsGui=opts.get('optionsGui'))||!kigo.is_function(importOptionsGui['render'])||!kigo.is_function(importOptionsGui['test'])||!kigo.is_function(importOptionsGui['get']))
throw'kigoImport::kigoImport(): Invalid optionsGui argument.';if(!kigo.is_int(importOptionsGuiWidth=opts.get('optionsGuiWidth',defaultGuiWidth)))
throw'kigoImport::kigoImport(): Invalid optionsGuiWidth argument.';}
if(upload_options!==null)
{if(!kigo.is_object(upload_options))
throw'kigoImport::kigoImport(): Invalid upload_options argument.';upload_options=(new kigoAssoc(upload_options)).filter(function(k){return kigo.in_array(k,['file_types','file_types_label','title','button_label','progress_text_single']);});}
if(kigo.is_object(importOptionsGui))
renderGui();else
doUpload();function renderGui()
{var container=kigoDom.create('div',{'class':'kigo_import_gui_container'});importOptionsGui.render(container);var p=new kigoPopup({'width':importOptionsGuiWidth,'movable':true,'title':'Import options','content':[container,kigoDom.create('div',{'class':'buttons'}).append(kigoDom.create('button',{'type':'button'},null,{'click':function(){p.close();}}).append('Cancel'),' ',kigoDom.create('button',{'class':'primary','type':'button'},null,{'click':function(){var err;if((err=importOptionsGui.test())===true)
{importOptions=importOptionsGui.get();p.close();doUpload();}
else if(kigo.is_string(err))
kigoPopup.warn('Invalid import options',err);else
{}}}).append('Proceed'))]});}
function doUpload()
{var defaultUploadOptions={'handler':'Import/file','max_files':1,'max_file_size':kigo.CFG.IMPORT.MAX_UPLOAD_FILE_SIZE_MB*1048576,'file_types_label':'Excel file','title':'Import file selector','button_label':'Click here to upload your file','upload_text_single':'Uploading file: %n','on_complete':new kigoCallback(function(transfered,failed)
{if(transfered.length)
{importFile=transfered[0].handler_data;doImportRequest();return;}
if(failed.length)
{var errorText;switch(failed[0].error)
{case kigoUpload.FAIL_EMPTY:errorText='The provided file was empty.';break;case kigoUpload.FAIL_SIZE:errorText='The provided file size exceeds maximum allowed size ('+kigo.CFG.IMPORT.MAX_UPLOAD_FILE_SIZE_MB+'MB).';break;case kigoUpload.FAIL_TIMEOUT:errorText='The transfer has timed out.';break;case kigoUpload.FAIL_HANDLER+1:errorText='The provided file is not a valid Excel file.';break;default:errorText='An unexpected error occured.';}
kigoPopup.warn('File could not be transfered',errorText,null);}},this)};new kigoUpload(kigoAssoc.merge(defaultUploadOptions,upload_options));}
function doImportRequest()
{new kigoAjaxRequest3('Import/request',{'HANDLER':handler,'FILE':importFile,'OPTIONS':importOptions},{'on_reply':function(ret){switch(ret.REPLY)
{case'OK':break;case'LIMIT':kigoPopup.yesno('Too many imports','Too many imports have been requested from your account.'+'\n'+'Please wait until the previously requested imports have been processed.'+'\n'+'\n'+'Retry now?',function(yn){if(yn)doImportRequest();});return true;case'BUSY':kigoPopup.warn('Server is busy','The import server is currently overloaded.'+'\n'+'Please wait a couple of seconds before retrying.'+'\n'+'\n'+'Retry now?',function(yn){if(yn)doImportRequest();});return true;default:return false;}
var jobId=ret.JOB_ID,jobSecret=ret.JOB_SECRET,waitPopup=kigoPopup.wait('Please wait','Please wait while your import file is being processed...');doQuery();return true;function doQuery()
{new kigoAjaxRequest3('Import/query',{'JOB_ID':jobId,'JOB_SECRET':jobSecret},{'on_reply':function(ret){switch(ret.STATUS)
{case'FINISHED':waitPopup.close();importHandler.invoke(ret.OUTPUT);return true;case'NOT_FINISHED':setTimeout(doQuery,waitSeconds*1000);return true;case'FAILED':waitPopup.close();kigoPopup.warn('Import failed','Import could not to be performed.'+'\n'+'\n'+'We have been notified of this problem.');return true;}
return false;}});}}});}}

var kigoZendesk={'_shortcuts':{'compatibility':'/entries/23604418-Compatibility','gettingstarted':'/entries/24664983-Kigo-Basics','findingconnectingtoapartner':'/entries/23581351-Finding-connecting-to-a-partner','ownerreports':'/entries/23598103-Owner-reports','reservationreports':'/entries/23583281-Reservations-report','statisticsreports':'/entries/24869661-Statistics-report','extraservices':'/entries/23578502-Extra-services','obrentcalcsharedproperties':'/entries/23593047-Online-booking-and-rent-calculation-with-shared-properties','createeditaproperty':'/entries/23578422-Create-and-edit-a-property','emailinquiryimport':'/entries/23594367-Email-inquiry-import','sharingapropertypartner':'/entries/23596763-Sharing-a-property-with-a-partner','notifications':'/entries/23595736-Notifications','pdftemplate':'/entries/23595746-PDF-template','emailtemplates':'/entries/23594247-Email-Templates','emailreminders':'/entries/23597733-Email-reminders','introductiontoreservations':'/entries/23592797-Introduction-to-Reservations','availabilitycalendarssearch':'/entries/23594476-Availability-calendars-Search','cioplanner':'/entries/23592927-Check-in-check-out-planner','rentcalc':'/entries/23596833-Rent-calculation','udpa':'/entries/23581441-User-defined-Property-Attributes','udra':'/entries/23592897-User-defined-Reservation-Attributes','reservationmanagement':'/forums/21993003-Reservation-Management','payments':'/entries/23579952-Payments','contentmanagementsystem':'/entries/23578512-Content-Management-System','pp_bdc':'/entries/23596773-Booking-com-setup','bookingsource':'/entries/25800921-User-defined-sources','overview':'/entries/25791561-Overview','performance':'/entries/25439811-Performance'},'_open':function(url)
{var newWindow=window.open('/please-wait.php');if(!newWindow)
return;new kigoAjaxRequest3('Zendesk/jwt',null,{'on_reply':function(jwt)
{if(!newWindow.closed)
{newWindow.focus();if(jwt.length)
newWindow.location=kigoZendesk.supportCenterURL('/access/jwt?jwt='+kigo.rawurlencode(jwt)+'&return_to='+kigo.rawurlencode(url));else
newWindow.location=url;}
else
newWindow.close();return true;}});},'supportCenterURL':function()
{var path=arguments.length?arguments[0]:'/';if(!kigo.is_string(path)||kigo.substr(path,0,1)!=='/')
throw'Invalid path.';return'https://support.kigo.net'+path;},'supportCenter':function()
{this._open(this.supportCenterURL(arguments.length&&kigo.is_string(arguments[0])&&(new kigoAssoc(this._shortcuts)).isset(arguments[0])?this._shortcuts[arguments[0]]:'/'));},'submitTicket':function()
{var subject=arguments.length&&kigo.is_string(arguments[0])?replace('#','＃',arguments[0]):null;this._open(this.supportCenterURL('/requests/new'+(subject!==null?('?ticket[subject]='+kigo.rawurlencode(subject)):'')));function replace(from,to,subject)
{return kigo.implode(to,kigo.explode(from,subject));}}};

var kigoUA={'V1':1,'addToBody':function(version)
{var cls=this.classes(version);if(!cls.length)
return;document.body.className+=' '+cls.join(' ');},'classes':function(version)
{switch(version)
{case kigoUA.V1:return this.classes_v1();default:return[];}},'version_string_digits_and_dots':function(string,offset)
{var len=kigo.strlen(string);var version='';while(offset<len&&(this.ctype_digit_char(string.charAt(offset))||string.charAt(offset)==='.'))
version+=string.charAt(offset++);return version;},'classes_v1':function(ua)
{var ua=navigator.userAgent,result=[],tmp,major,minor,minLen;if((tmp=ua.indexOf('(compatible; MSIE '))>-1)
{if(kigo.is_array(tmp=this.version_string_digits_and_dots(ua,tmp+18).split('.'))&&tmp.length>=2&&kigo.strlen(tmp[0])&&kigo.strlen(tmp[1]))
{result.push('ua-msie-'+tmp[0]+'-'+tmp[1].charAt(0));result.push('ua-msie-'+tmp[0]);}
result.push('ua-msie');if(ua.indexOf('Windows')>-1)
result.push('ua_os-win');else if(ua.indexOf('Mac')>-1)
result.push('ua_os-mac');return result;}
if(ua.indexOf('Firefox')>-1)
{if((tmp=ua.indexOf('Firefox/'))>-1&&kigo.is_array(tmp=this.version_string_digits_and_dots(ua,tmp+8).split('.'))&&tmp.length>=2&&kigo.strlen(tmp[0])&&kigo.strlen(tmp[1]))
{major=kigo.intval(tmp[0]);minor=kigo.intval(tmp[1]);result.push('ua-firefox-'+major+'-'+minor);result.push('ua-firefox-'+major);}
result.push('ua-firefox');if(ua.indexOf('Win')>-1)
result.push('ua_os-win');else if(ua.indexOf('Mac')>-1)
result.push('ua_os-mac');else if(ua.indexOf('Linux')>-1)
{result.push('ua_os-linux');result.push('ua_os-unix');}
else if(ua.indexOf('FreeBSD')>-1)
{result.push('ua_os-freebsd');result.push('ua_os-bsd');result.push('ua_os-unix');}
else if(ua.indexOf('OpenBSD')>-1)
{result.push('ua_os-openbsd');result.push('ua_os-bsd');result.push('ua_os-unix');}
else if(ua.indexOf('NetBSD')>-1)
{result.push('ua_os-netbsd');result.push('ua_os-bsd');result.push('ua_os-unix');}
else if(ua.indexOf('BSD')>-1)
{result.push('ua_os-bsd');result.push('ua_os-unix');}
else if(ua.indexOf('SunOS')>-1)
{result.push('ua_os-sunos');result.push('ua_os-unix');}
else if(ua.indexOf('BeOS')>-1)
result.push('ua_os-beos');return result;}
if((tmp=ua.indexOf('Chrome/'))>-1)
{if(kigo.is_array(tmp=this.version_string_digits_and_dots(ua,tmp+7).split('.'))&&tmp.length>=2&&kigo.strlen(tmp[0])&&kigo.strlen(tmp[1]))
{major=kigo.intval(tmp[0]);minor=kigo.intval(tmp[1]);result.push('ua-chrome-'+major+'-'+minor);result.push('ua-chrome-'+major);}
result.push('ua-chrome');if(ua.indexOf('Win')>-1)
result.push('ua_os-win');else if(ua.indexOf('Mac')>-1)
result.push('ua_os-mac');else if(ua.indexOf('Linux')>-1)
{result.push('ua_os-linux');result.push('ua_os-unix');}
return result;}
if(ua.indexOf('Safari')>-1)
{if((tmp=ua.indexOf('Version/'))>-1&&kigo.is_array(tmp=this.version_string_digits_and_dots(ua,tmp+8).split('.'))&&tmp.length>=2&&kigo.strlen(tmp[0])&&kigo.strlen(tmp[1]))
{major=kigo.intval(tmp[0]);minor=kigo.intval(tmp[1]);result.push('ua-safari-'+major+'-'+minor);result.push('ua-safari-'+major);}
else if((tmp=ua.indexOf('AppleWebKit/'))>-1&&kigo.strlen(tmp=kigo.substr(ua,tmp+12,2))==2&&this.ctype_digit_char(tmp.charAt(0))&&this.ctype_digit_char(tmp.charAt(1)))
{switch(tmp)
{case'41':result.push('ua-safari-2-0');result.push('ua-safari-2');break;case'31':result.push('ua-safari-1-3');result.push('ua-safari-1');break;case'12':result.push('ua-safari-1-2');result.push('ua-safari-1');break;case'85':result.push('ua-safari-1-0');result.push('ua-safari-1');break;}}
result.push('ua-safari');if(ua.indexOf('Win')>-1)
result.push('ua_os-win');else if(ua.indexOf('iPhone')>-1)
{result.push('ua_os-iphone');result.push('ua_os-ios');}
else if(ua.indexOf('iPad')>-1)
{result.push('ua_os-ipad');result.push('ua_os-ios');}
else if(ua.indexOf('Mac')>-1)
result.push('ua_os-mac');else if(ua.indexOf('Linux')>-1)
{result.push('ua_os-linux');result.push('ua_os-unix');}
return result;}
if(ua.indexOf('Opera')>-1)
{if((tmp=ua.indexOf('Opera/'))>-1)
tmp+=6;else if((tmp=ua.indexOf(' Opera '))>-1)
tmp+=7;else
tmp=null;if(tmp!==null&&kigo.is_array(tmp=this.version_string_digits_and_dots(ua,tmp).split('.'))&&tmp.length>=2&&kigo.strlen(tmp[0])&&(minLen=kigo.strlen(tmp[1])))
{major=kigo.intval(tmp[0]);if(minLen==1)
tmp[1]='0'+tmp[1];result.push('ua-opera-'+major+'-'+tmp[1].charAt(0)+tmp[1].charAt(1));result.push('ua-opera-'+major+'-'+tmp[1].charAt(0)+'x');result.push('ua-opera-'+major);}
result.push('ua-opera');if(ua.indexOf('Win')>-1)
result.push('ua_os-win');else if(ua.indexOf('Mac')>-1)
result.push('ua_os-mac');else if(ua.indexOf('Linux')>-1)
{result.push('ua_os-linux');result.push('ua_os-unix');}
else if(ua.indexOf('FreeBSD')>-1)
{result.push('ua_os-freebsd');result.push('ua_os-bsd');result.push('ua_os-unix');}
else if(ua.indexOf('OpenBSD')>-1)
{result.push('ua_os-openbsd');result.push('ua_os-bsd');result.push('ua_os-unix');}
else if(ua.indexOf('BSD')>-1)
{result.push('ua_os-bsd');result.push('ua_os-unix');}
else if(ua.indexOf('SunOS')>-1)
{result.push('ua_os-sunos');result.push('ua_os-unix');}
else if(ua.indexOf('Nintendo Wii')>-1)
result.push('ua_os-nintendo_wii');else if(ua.indexOf('Nitro')>-1)
result.push('ua_os-nintendo_ds');return result;}
return[];},'ctype_digit_char':function(c)
{var charCode=c.charCodeAt(0);return(charCode>=48&&charCode<=57);}};

Calendar = function(firstDayOfWeek,dateStr,onSelected,onClose){this.activeDiv=null;this.currentDateEl=null;this.getDateStatus=null;this.getDateToolTip=null;this.getDateText=null;this.timeout=null;this.onSelected=onSelected||null;this.onClose=onClose||null;this.dragging=false;this.hidden=false;this.minYear=1970;this.maxYear=2050;this.dateFormat=Calendar._TT["DEF_DATE_FORMAT"];this.ttDateFormat=Calendar._TT["TT_DATE_FORMAT"];this.isPopup=true;this.weekNumbers=true;this.firstDayOfWeek=typeof firstDayOfWeek=="number"?firstDayOfWeek:Calendar._FD;this.showsOtherMonths=false;this.dateStr=dateStr;this.ar_days=null;this.showsTime=false;this.time24=true;this.yearStep=2;this.hiliteToday=true;this.multiple=null;this.table=null;this.element=null;this.tbody=null;this.firstdayname=null;this.monthsCombo=null;this.yearsCombo=null;this.hilitedMonth=null;this.activeMonth=null;this.hilitedYear=null;this.activeYear=null;this.dateClicked=false;if(typeof Calendar._SDN=="undefined"){if(typeof Calendar._SDN_len=="undefined")Calendar._SDN_len=3;var ar=new Array();for(var i=8;i>0;){ar[--i]=Calendar._DN[i].substr(0,Calendar._SDN_len);}Calendar._SDN=ar;if(typeof Calendar._SMN_len=="undefined")Calendar._SMN_len=3;ar=new Array();for(var i=12;i>0;){ar[--i]=Calendar._MN[i].substr(0,Calendar._SMN_len);}Calendar._SMN=ar;}};Calendar._C=null;Calendar.is_ie=(/msie/i.test(navigator.userAgent)&&!/opera/i.test(navigator.userAgent));Calendar.is_ie5=(Calendar.is_ie&&/msie 5\.0/i.test(navigator.userAgent));Calendar.is_opera=/opera/i.test(navigator.userAgent);Calendar.is_khtml=/Konqueror|Safari|KHTML/i.test(navigator.userAgent);Calendar.getAbsolutePos = function(el){var SL=0,ST=0;var is_div=/^div$/i.test(el.tagName);if(is_div&&el.scrollLeft)SL=el.scrollLeft;if(is_div&&el.scrollTop)ST=el.scrollTop;var r={x:el.offsetLeft-SL,y:el.offsetTop-ST};if(el.offsetParent){var tmp=this.getAbsolutePos(el.offsetParent);r.x+=tmp.x;r.y+=tmp.y;}return r;};Calendar.isRelated = function(el,evt){var related=evt.relatedTarget;if(!related){var type=evt.type;if(type=="mouseover"){related=evt.fromElement;}else if(type=="mouseout"){related=evt.toElement;}}while(related){if(related==el){return true;}related=related.parentNode;}return false;};Calendar.removeClass = function(el,className){if(!(el&&el.className)){return;}var cls=el.className.split(" ");var ar=new Array();for(var i=cls.length;i>0;){if(cls[--i]!=className){ar[ar.length]=cls[i];}}el.className=ar.join(" ");};Calendar.addClass = function(el,className){Calendar.removeClass(el,className);el.className+=" "+className;};Calendar.getElement = function(ev){var f=Calendar.is_ie?window.event.srcElement:ev.currentTarget;while(f.nodeType!=1||/^div$/i.test(f.tagName))f=f.parentNode;return f;};Calendar.getTargetElement = function(ev){var f=Calendar.is_ie?window.event.srcElement:ev.target;while(f.nodeType!=1)f=f.parentNode;return f;};Calendar.stopEvent = function(ev){ev||(ev=window.event);if(Calendar.is_ie){ev.cancelBubble=true;ev.returnValue=false;}else{ev.preventDefault();ev.stopPropagation();}return false;};Calendar.addEvent = function(el,evname,func){if(el.attachEvent){el.attachEvent("on"+evname,func);}else if(el.addEventListener){el.addEventListener(evname,func,true);}else{el["on"+evname]=func;}};Calendar.removeEvent = function(el,evname,func){if(el.detachEvent){el.detachEvent("on"+evname,func);}else if(el.removeEventListener){el.removeEventListener(evname,func,true);}else{el["on"+evname]=null;}};Calendar.createElement = function(type,parent){var el=null;if(document.createElementNS){el=document.createElementNS("http://www.w3.org/1999/xhtml",type);}else{el=document.createElement(type);}if(typeof parent!="undefined"){parent.appendChild(el);}return el;};Calendar._add_evs = function(el){with(Calendar){addEvent(el,"mouseover",dayMouseOver);addEvent(el,"mousedown",dayMouseDown);addEvent(el,"mouseout",dayMouseOut);if(is_ie){addEvent(el,"dblclick",dayMouseDblClick);el.setAttribute("unselectable",true);}}};Calendar.findMonth = function(el){if(typeof el.month!="undefined"){return el;}else if(typeof el.parentNode.month!="undefined"){return el.parentNode;}return null;};Calendar.findYear = function(el){if(typeof el.year!="undefined"){return el;}else if(typeof el.parentNode.year!="undefined"){return el.parentNode;}return null;};Calendar.showMonthsCombo = function(){var cal=Calendar._C;if(!cal){return false;}var cal=cal;var cd=cal.activeDiv;var mc=cal.monthsCombo;if(cal.hilitedMonth){Calendar.removeClass(cal.hilitedMonth,"hilite");}if(cal.activeMonth){Calendar.removeClass(cal.activeMonth,"active");}var mon=cal.monthsCombo.getElementsByTagName("div")[cal.date.getMonth()];Calendar.addClass(mon,"active");cal.activeMonth=mon;var s=mc.style;s.display="block";if(cd.navtype<0)s.left=cd.offsetLeft+"px";else{var mcw=mc.offsetWidth;if(typeof mcw=="undefined")mcw=50;s.left=(cd.offsetLeft+cd.offsetWidth-mcw)+"px";}s.top=(cd.offsetTop+cd.offsetHeight)+"px";};Calendar.showYearsCombo = function(fwd){var cal=Calendar._C;if(!cal){return false;}var cal=cal;var cd=cal.activeDiv;var yc=cal.yearsCombo;if(cal.hilitedYear){Calendar.removeClass(cal.hilitedYear,"hilite");}if(cal.activeYear){Calendar.removeClass(cal.activeYear,"active");}cal.activeYear=null;var Y=cal.date.getFullYear()+(fwd?1:-1);var yr=yc.firstChild;var show=false;for(var i=12;i>0;--i){if(Y>=cal.minYear&&Y<=cal.maxYear){yr.innerHTML=Y;yr.year=Y;yr.style.display="block";show=true;}else{yr.style.display="none";}yr=yr.nextSibling;Y+=fwd?cal.yearStep:-cal.yearStep;}if(show){var s=yc.style;s.display="block";if(cd.navtype<0)s.left=cd.offsetLeft+"px";else{var ycw=yc.offsetWidth;if(typeof ycw=="undefined")ycw=50;s.left=(cd.offsetLeft+cd.offsetWidth-ycw)+"px";}s.top=(cd.offsetTop+cd.offsetHeight)+"px";}};Calendar.tableMouseUp = function(ev){var cal=Calendar._C;if(!cal){return false;}if(cal.timeout){clearTimeout(cal.timeout);}var el=cal.activeDiv;if(!el){return false;}var target=Calendar.getTargetElement(ev);ev||(ev=window.event);Calendar.removeClass(el,"active");if(target==el||target.parentNode==el){Calendar.cellClick(el,ev);}var mon=Calendar.findMonth(target);var date=null;if(mon){date=new Date(cal.date);if(mon.month!=date.getMonth()){date.setMonth(mon.month);cal.setDate(date);cal.dateClicked=false;cal.callHandler();}}else{var year=Calendar.findYear(target);if(year){date=new Date(cal.date);if(year.year!=date.getFullYear()){date.setFullYear(year.year);cal.setDate(date);cal.dateClicked=false;cal.callHandler();}}}with(Calendar){removeEvent(document,"mouseup",tableMouseUp);removeEvent(document,"mouseover",tableMouseOver);removeEvent(document,"mousemove",tableMouseOver);cal._hideCombos();_C=null;return stopEvent(ev);}};Calendar.tableMouseOver = function(ev){var cal=Calendar._C;if(!cal){return;}var el=cal.activeDiv;var target=Calendar.getTargetElement(ev);if(target==el||target.parentNode==el){Calendar.addClass(el,"hilite active");Calendar.addClass(el.parentNode,"rowhilite");}else{if(typeof el.navtype=="undefined"||(el.navtype!=50&&(el.navtype==0||Math.abs(el.navtype)>2)))Calendar.removeClass(el,"active");Calendar.removeClass(el,"hilite");Calendar.removeClass(el.parentNode,"rowhilite");}ev||(ev=window.event);if(el.navtype==50&&target!=el){var pos=Calendar.getAbsolutePos(el);var w=el.offsetWidth;var x=ev.clientX;var dx;var decrease=true;if(x>pos.x+w){dx=x-pos.x-w;decrease=false;}else dx=pos.x-x;if(dx<0)dx=0;var range=el._range;var current=el._current;var count=Math.floor(dx/10)%range.length;for(var i=range.length;--i>=0;)if(range[i]==current)break;while(count-->0)if(decrease){if(--i<0)i=range.length-1;}else if(++i>=range.length)i=0;var newval=range[i];el.innerHTML=newval;cal.onUpdateTime();}var mon=Calendar.findMonth(target);if(mon){if(mon.month!=cal.date.getMonth()){if(cal.hilitedMonth){Calendar.removeClass(cal.hilitedMonth,"hilite");}Calendar.addClass(mon,"hilite");cal.hilitedMonth=mon;}else if(cal.hilitedMonth){Calendar.removeClass(cal.hilitedMonth,"hilite");}}else{if(cal.hilitedMonth){Calendar.removeClass(cal.hilitedMonth,"hilite");}var year=Calendar.findYear(target);if(year){if(year.year!=cal.date.getFullYear()){if(cal.hilitedYear){Calendar.removeClass(cal.hilitedYear,"hilite");}Calendar.addClass(year,"hilite");cal.hilitedYear=year;}else if(cal.hilitedYear){Calendar.removeClass(cal.hilitedYear,"hilite");}}else if(cal.hilitedYear){Calendar.removeClass(cal.hilitedYear,"hilite");}}return Calendar.stopEvent(ev);};Calendar.tableMouseDown = function(ev){if(Calendar.getTargetElement(ev)==Calendar.getElement(ev)){return Calendar.stopEvent(ev);}};Calendar.calDragIt = function(ev){var cal=Calendar._C;if(!(cal&&cal.dragging)){return false;}var posX;var posY;if(Calendar.is_ie){posY=window.event.clientY+document.body.scrollTop;posX=window.event.clientX+document.body.scrollLeft;}else{posX=ev.pageX;posY=ev.pageY;}cal.hideShowCovered();var st=cal.element.style;st.left=(posX-cal.xOffs)+"px";st.top=(posY-cal.yOffs)+"px";return Calendar.stopEvent(ev);};Calendar.calDragEnd = function(ev){var cal=Calendar._C;if(!cal){return false;}cal.dragging=false;with(Calendar){removeEvent(document,"mousemove",calDragIt);removeEvent(document,"mouseup",calDragEnd);tableMouseUp(ev);}cal.hideShowCovered();};Calendar.dayMouseDown = function(ev){var el=Calendar.getElement(ev);if(el.disabled){return false;}var cal=el.calendar;cal.activeDiv=el;Calendar._C=cal;if(el.navtype!=300)with(Calendar){if(el.navtype==50){el._current=el.innerHTML;addEvent(document,"mousemove",tableMouseOver);}else addEvent(document,Calendar.is_ie5?"mousemove":"mouseover",tableMouseOver);addClass(el,"hilite active");addEvent(document,"mouseup",tableMouseUp);}else if(cal.isPopup){cal._dragStart(ev);}if(el.navtype==-1||el.navtype==1){if(cal.timeout)clearTimeout(cal.timeout);cal.timeout=setTimeout("Calendar.showMonthsCombo()",250);}else if(el.navtype==-2||el.navtype==2){if(cal.timeout)clearTimeout(cal.timeout);cal.timeout=setTimeout((el.navtype>0)?"Calendar.showYearsCombo(true)":"Calendar.showYearsCombo(false)",250);}else{cal.timeout=null;}return Calendar.stopEvent(ev);};Calendar.dayMouseDblClick = function(ev){Calendar.cellClick(Calendar.getElement(ev),ev||window.event);if(Calendar.is_ie){document.selection.empty();}};Calendar.dayMouseOver = function(ev){var el=Calendar.getElement(ev);if(Calendar.isRelated(el,ev)||Calendar._C||el.disabled){return false;}if(el.ttip){if(el.ttip.substr(0,1)=="_"){el.ttip=el.caldate.print(el.calendar.ttDateFormat)+el.ttip.substr(1);}el.calendar.tooltips.innerHTML=el.ttip;}if(el.navtype!=300){Calendar.addClass(el,"hilite");if(el.caldate){Calendar.addClass(el.parentNode,"rowhilite");var cal=el.calendar;if(cal&&cal.getDateToolTip){var d=el.caldate;window.status=d;el.title=cal.getDateToolTip(d,d.getFullYear(),d.getMonth(),d.getDate());}}}return Calendar.stopEvent(ev);};Calendar.dayMouseOut = function(ev){with(Calendar){var el=getElement(ev);if(isRelated(el,ev)||_C||el.disabled)return false;removeClass(el,"hilite");if(el.caldate)removeClass(el.parentNode,"rowhilite");if(el.calendar)el.calendar.tooltips.innerHTML=_TT["SEL_DATE"];}};Calendar.cellClick = function(el,ev){var cal=el.calendar;var closing=false;var newdate=false;var date=null;if(typeof el.navtype=="undefined"){if(cal.currentDateEl){Calendar.removeClass(cal.currentDateEl,"selected");Calendar.addClass(el,"selected");closing=(cal.currentDateEl==el);if(!closing){cal.currentDateEl=el;}}cal.date.setDateOnly(el.caldate);date=cal.date;var other_month=!(cal.dateClicked=!el.otherMonth);if(!other_month&&!cal.currentDateEl&&cal.multiple)cal._toggleMultipleDate(new Date(date));else newdate=!el.disabled;if(other_month)cal._init(cal.firstDayOfWeek,date);}else{if(el.navtype==200){Calendar.removeClass(el,"hilite");cal.callCloseHandler();return;}date=new Date(cal.date);if(el.navtype==0)date.setDateOnly(new Date());cal.dateClicked=false;var year=date.getFullYear();var mon=date.getMonth();function setMonth(m){var day=date.getDate();var max=date.getMonthDays(m);if(day>max){date.setDate(max);}date.setMonth(m);};switch(el.navtype){case 400:Calendar.removeClass(el,"hilite");var text=Calendar._TT["ABOUT"];if(typeof text!="undefined"){text+=cal.showsTime?Calendar._TT["ABOUT_TIME"]:"";}else{text="Help and about box text is not translated into this language.\n"+"If you know this language and you feel generous please update\n"+"the corresponding file in \"lang\" subdir to match calendar-en.js\n"+"and send it back to <mihai_bazon@yahoo.com> to get it into the distribution  ;-)\n\n"+"Thank you!\n"+"http://dynarch.com/mishoo/calendar.epl\n";}alert(text);return;case-2:if(year>cal.minYear){date.setFullYear(year-1);}break;case-1:if(mon>0){setMonth(mon-1);}else if(year-->cal.minYear){date.setFullYear(year);setMonth(11);}break;case 1:if(mon<11){setMonth(mon+1);}else if(year<cal.maxYear){date.setFullYear(year+1);setMonth(0);}break;case 2:if(year<cal.maxYear){date.setFullYear(year+1);}break;case 100:cal.setFirstDayOfWeek(el.fdow);return;case 50:var range=el._range;var current=el.innerHTML;for(var i=range.length;--i>=0;)if(range[i]==current)break;if(ev&&ev.shiftKey){if(--i<0)i=range.length-1;}else if(++i>=range.length)i=0;var newval=range[i];el.innerHTML=newval;cal.onUpdateTime();return;case 0:if((typeof cal.getDateStatus=="function")&&cal.getDateStatus(date,date.getFullYear(),date.getMonth(),date.getDate())){return false;}break;}if(!date.equalsTo(cal.date)){cal.setDate(date);newdate=true;}else if(el.navtype==0)newdate=closing=true;}if(newdate){ev&&cal.callHandler();}if(closing){Calendar.removeClass(el,"hilite");ev&&cal.callCloseHandler();}};Calendar.prototype.create = function(_par){var parent=null;if(!_par){parent=document.getElementsByTagName("body")[0];this.isPopup=true;}else{parent=_par;this.isPopup=false;}this.date=this.dateStr?Date.parseDate(this.dateStr,this.dateFormat):new Date();var table=Calendar.createElement("table");this.table=table;table.cellSpacing=0;table.cellPadding=0;table.calendar=this;Calendar.addEvent(table,"mousedown",Calendar.tableMouseDown);var div=Calendar.createElement("div");this.element=div;div.className="calendar";if(this.isPopup){div.style.position="absolute";div.style.display="none";}div.appendChild(table);var thead=Calendar.createElement("thead",table);var cell=null;var row=null;var cal=this;var hh = function(text,cs,navtype){cell=Calendar.createElement("td",row);cell.colSpan=cs;cell.className="button";if(navtype!=0&&Math.abs(navtype)<=2)cell.className+=" nav";Calendar._add_evs(cell);cell.calendar=cal;cell.navtype=navtype;cell.innerHTML="<div unselectable='on'>"+text+"</div>";return cell;};row=Calendar.createElement("tr",thead);var title_length=6;(this.isPopup)&&--title_length;(this.weekNumbers)&&++title_length;hh("?",1,400).ttip=Calendar._TT["INFO"];this.title=hh("",title_length,300);this.title.className="title";if(this.isPopup){this.title.ttip=Calendar._TT["DRAG_TO_MOVE"];this.title.style.cursor="move";hh("&#x00d7;",1,200).ttip=Calendar._TT["CLOSE"];}row=Calendar.createElement("tr",thead);row.className="headrow";this._nav_py=hh("&#x00ab;",1,-2);this._nav_py.ttip=Calendar._TT["PREV_YEAR"];this._nav_pm=hh("&#x2039;",1,-1);this._nav_pm.ttip=Calendar._TT["PREV_MONTH"];this._nav_now=hh(Calendar._TT["TODAY"],this.weekNumbers?4:3,0);this._nav_now.ttip=Calendar._TT["GO_TODAY"];this._nav_nm=hh("&#x203a;",1,1);this._nav_nm.ttip=Calendar._TT["NEXT_MONTH"];this._nav_ny=hh("&#x00bb;",1,2);this._nav_ny.ttip=Calendar._TT["NEXT_YEAR"];row=Calendar.createElement("tr",thead);row.className="daynames";if(this.weekNumbers){cell=Calendar.createElement("td",row);cell.className="name wn";cell.innerHTML=Calendar._TT["WK"];}for(var i=7;i>0;--i){cell=Calendar.createElement("td",row);if(!i){cell.navtype=100;cell.calendar=this;Calendar._add_evs(cell);}}this.firstdayname=(this.weekNumbers)?row.firstChild.nextSibling:row.firstChild;this._displayWeekdays();var tbody=Calendar.createElement("tbody",table);this.tbody=tbody;for(i=6;i>0;--i){row=Calendar.createElement("tr",tbody);if(this.weekNumbers){cell=Calendar.createElement("td",row);}for(var j=7;j>0;--j){cell=Calendar.createElement("td",row);cell.calendar=this;Calendar._add_evs(cell);}}if(this.showsTime){row=Calendar.createElement("tr",tbody);row.className="time";cell=Calendar.createElement("td",row);cell.className="time";cell.colSpan=2;cell.innerHTML=Calendar._TT["TIME"]||"&nbsp;";cell=Calendar.createElement("td",row);cell.className="time";cell.colSpan=this.weekNumbers?4:3;(function(){function makeTimePart(className,init,range_start,range_end){var part=Calendar.createElement("span",cell);part.className=className;part.innerHTML=init;part.calendar=cal;part.ttip=Calendar._TT["TIME_PART"];part.navtype=50;part._range=[];if(typeof range_start!="number")part._range=range_start;else{for(var i=range_start;i<=range_end;++i){var txt;if(i<10&&range_end>=10)txt='0'+i;else txt=''+i;part._range[part._range.length]=txt;}}Calendar._add_evs(part);return part;};var hrs=cal.date.getHours();var mins=cal.date.getMinutes();var t12=!cal.time24;var pm=(hrs>12);if(t12&&pm)hrs-=12;var H=makeTimePart("hour",hrs,t12?1:0,t12?12:23);var span=Calendar.createElement("span",cell);span.innerHTML=":";span.className="colon";var M=makeTimePart("minute",mins,0,59);var AP=null;cell=Calendar.createElement("td",row);cell.className="time";cell.colSpan=2;if(t12)AP=makeTimePart("ampm",pm?"pm":"am",["am","pm"]);else cell.innerHTML="&nbsp;";cal.onSetTime = function(){var pm,hrs=this.date.getHours(),mins=this.date.getMinutes();if(t12){pm=(hrs>=12);if(pm)hrs-=12;if(hrs==0)hrs=12;AP.innerHTML=pm?"pm":"am";}H.innerHTML=(hrs<10)?("0"+hrs):hrs;M.innerHTML=(mins<10)?("0"+mins):mins;};cal.onUpdateTime = function(){var date=this.date;var h=parseInt(H.innerHTML,10);if(t12){if(/pm/i.test(AP.innerHTML)&&h<12)h+=12;else if(/am/i.test(AP.innerHTML)&&h==12)h=0;}var d=date.getDate();var m=date.getMonth();var y=date.getFullYear();date.setHours(h);date.setMinutes(parseInt(M.innerHTML,10));date.setFullYear(y);date.setMonth(m);date.setDate(d);this.dateClicked=false;this.callHandler();};})();}else{this.onSetTime=this.onUpdateTime = function(){};}var tfoot=Calendar.createElement("tfoot",table);row=Calendar.createElement("tr",tfoot);row.className="footrow";cell=hh(Calendar._TT["SEL_DATE"],this.weekNumbers?8:7,300);cell.className="ttip";if(this.isPopup){cell.ttip=Calendar._TT["DRAG_TO_MOVE"];cell.style.cursor="move";}this.tooltips=cell;div=Calendar.createElement("div",this.element);this.monthsCombo=div;div.className="combo";for(i=0;i<Calendar._MN.length;++i){var mn=Calendar.createElement("div");mn.className=Calendar.is_ie?"label-IEfix":"label";mn.month=i;mn.innerHTML=Calendar._SMN[i];div.appendChild(mn);}div=Calendar.createElement("div",this.element);this.yearsCombo=div;div.className="combo";for(i=12;i>0;--i){var yr=Calendar.createElement("div");yr.className=Calendar.is_ie?"label-IEfix":"label";div.appendChild(yr);}this._init(this.firstDayOfWeek,this.date);parent.appendChild(this.element);};Calendar._keyEvent = function(ev){var cal=window._dynarch_popupCalendar;if(!cal||cal.multiple)return false;(Calendar.is_ie)&&(ev=window.event);var act=(Calendar.is_ie||ev.type=="keypress"),K=ev.keyCode;if(ev.ctrlKey){switch(K){case 37:act&&Calendar.cellClick(cal._nav_pm);break;case 38:act&&Calendar.cellClick(cal._nav_py);break;case 39:act&&Calendar.cellClick(cal._nav_nm);break;case 40:act&&Calendar.cellClick(cal._nav_ny);break;default:return false;}}else switch(K){case 32:Calendar.cellClick(cal._nav_now);break;case 27:act&&cal.callCloseHandler();break;case 37:case 38:case 39:case 40:if(act){var prev,x,y,ne,el,step;prev=K==37||K==38;step=(K==37||K==39)?1:7;function setVars(){el=cal.currentDateEl;var p=el.pos;x=p&15;y=p>>4;ne=cal.ar_days[y][x];};setVars();function prevMonth(){var date=new Date(cal.date);date.setDate(date.getDate()-step);cal.setDate(date);};function nextMonth(){var date=new Date(cal.date);date.setDate(date.getDate()+step);cal.setDate(date);};while(1){switch(K){case 37:if(--x>=0)ne=cal.ar_days[y][x];else{x=6;K=38;continue;}break;case 38:if(--y>=0)ne=cal.ar_days[y][x];else{prevMonth();setVars();}break;case 39:if(++x<7)ne=cal.ar_days[y][x];else{x=0;K=40;continue;}break;case 40:if(++y<cal.ar_days.length)ne=cal.ar_days[y][x];else{nextMonth();setVars();}break;}break;}if(ne){if(!ne.disabled)Calendar.cellClick(ne);else if(prev)prevMonth();else nextMonth();}}break;case 13:if(act)Calendar.cellClick(cal.currentDateEl,ev);break;default:return false;}return Calendar.stopEvent(ev);};Calendar.prototype._init = function(firstDayOfWeek,date){var today=new Date(),TY=today.getFullYear(),TM=today.getMonth(),TD=today.getDate();this.table.style.visibility="hidden";var year=date.getFullYear();if(year<this.minYear){year=this.minYear;date.setFullYear(year);}else if(year>this.maxYear){year=this.maxYear;date.setFullYear(year);}this.firstDayOfWeek=firstDayOfWeek;this.date=new Date(date);var month=date.getMonth();var mday=date.getDate();var no_days=date.getMonthDays();date.setDate(1);var day1=(date.getDay()-this.firstDayOfWeek)%7;if(day1<0)day1+=7;date.setDate(day1==0?0:(day1<0?Math.abs(day1):0-day1));date.setDate(date.getDate()+1);var row=this.tbody.firstChild;var MN=Calendar._SMN[month];var ar_days=this.ar_days=new Array();var weekend=Calendar._TT["WEEKEND"];var dates=this.multiple?(this.datesCells={}):null;for(var i=0;i<6;++i,row=row.nextSibling){var cell=row.firstChild;if(this.weekNumbers){cell.className="day wn";cell.innerHTML=date.getWeekNumber();cell=cell.nextSibling;}row.className="daysrow";var hasdays=false,iday,dpos=ar_days[i]=[];for(var j=0;j<7;++j,cell=cell.nextSibling,date.setDate(iday+1)){iday=date.getDate();var wday=date.getDay();cell.className="day";cell.pos=i<<4|j;dpos[j]=cell;var current_month=(date.getMonth()==month);if(!current_month){if(this.showsOtherMonths){cell.className+=" othermonth";cell.otherMonth=true;}else{cell.className="emptycell";cell.innerHTML="&nbsp;";cell.disabled=true;continue;}}else{cell.otherMonth=false;hasdays=true;}cell.disabled=false;cell.innerHTML=this.getDateText?this.getDateText(date,iday):iday;if(dates)dates[date.print("%Y%m%d")]=cell;if(this.getDateStatus){var status=this.getDateStatus(date,year,month,iday);if(status===true){cell.className+=" disabled";cell.disabled=true;}else{if(/disabled/i.test(status))cell.disabled=true;cell.className+=" "+status;}}if(!cell.disabled){cell.caldate=new Date(date);cell.ttip="_";if(!this.multiple&&current_month&&iday==mday&&this.hiliteToday){cell.className+=" selected";this.currentDateEl=cell;}if(date.getFullYear()==TY&&date.getMonth()==TM&&iday==TD){cell.className+=" today";cell.ttip+=Calendar._TT["PART_TODAY"];}if(weekend.indexOf(wday.toString())!=-1)cell.className+=cell.otherMonth?" oweekend":" weekend";}}if(!(hasdays||this.showsOtherMonths))row.className="emptyrow";}this.title.innerHTML=Calendar._MN[month]+", "+year;this.onSetTime();this.table.style.visibility="visible";this._initMultipleDates();};Calendar.prototype._initMultipleDates = function(){if(this.multiple){for(var i in this.multiple){var cell=this.datesCells[i];var d=this.multiple[i];if(!d)continue;if(cell)cell.className+=" selected";}}};Calendar.prototype._toggleMultipleDate = function(date){if(this.multiple){var ds=date.print("%Y%m%d");var cell=this.datesCells[ds];if(cell){var d=this.multiple[ds];if(!d){Calendar.addClass(cell,"selected");this.multiple[ds]=date;}else{Calendar.removeClass(cell,"selected");delete this.multiple[ds];}}}};Calendar.prototype.setDateToolTipHandler = function(unaryFunction){this.getDateToolTip=unaryFunction;};Calendar.prototype.setDate = function(date){if(!date.equalsTo(this.date)){this._init(this.firstDayOfWeek,date);}};Calendar.prototype.refresh = function(){this._init(this.firstDayOfWeek,this.date);};Calendar.prototype.setFirstDayOfWeek = function(firstDayOfWeek){this._init(firstDayOfWeek,this.date);this._displayWeekdays();};Calendar.prototype.setDateStatusHandler=Calendar.prototype.setDisabledHandler = function(unaryFunction){this.getDateStatus=unaryFunction;};Calendar.prototype.setRange = function(a,z){this.minYear=a;this.maxYear=z;};Calendar.prototype.callHandler = function(){if(this.onSelected){this.onSelected(this,this.date.print(this.dateFormat));}};Calendar.prototype.callCloseHandler = function(){if(this.onClose){this.onClose(this);}this.hideShowCovered();};Calendar.prototype.destroy = function(){var el=this.element.parentNode;el.removeChild(this.element);Calendar._C=null;window._dynarch_popupCalendar=null;};Calendar.prototype.reparent = function(new_parent){var el=this.element;el.parentNode.removeChild(el);new_parent.appendChild(el);};Calendar._checkCalendar = function(ev){var calendar=window._dynarch_popupCalendar;if(!calendar){return false;}var el=Calendar.is_ie?Calendar.getElement(ev):Calendar.getTargetElement(ev);for(;el!=null&&el!=calendar.element;el=el.parentNode);if(el==null){window._dynarch_popupCalendar.callCloseHandler();return Calendar.stopEvent(ev);}};Calendar.prototype.show = function(){var rows=this.table.getElementsByTagName("tr");for(var i=rows.length;i>0;){var row=rows[--i];Calendar.removeClass(row,"rowhilite");var cells=row.getElementsByTagName("td");for(var j=cells.length;j>0;){var cell=cells[--j];Calendar.removeClass(cell,"hilite");Calendar.removeClass(cell,"active");}}this.element.style.display="block";this.hidden=false;if(this.isPopup){window._dynarch_popupCalendar=this;Calendar.addEvent(document,"keydown",Calendar._keyEvent);Calendar.addEvent(document,"keypress",Calendar._keyEvent);Calendar.addEvent(document,"mousedown",Calendar._checkCalendar);}this.hideShowCovered();};Calendar.prototype.hide = function(){if(this.isPopup){Calendar.removeEvent(document,"keydown",Calendar._keyEvent);Calendar.removeEvent(document,"keypress",Calendar._keyEvent);Calendar.removeEvent(document,"mousedown",Calendar._checkCalendar);}this.element.style.display="none";this.hidden=true;this.hideShowCovered();};Calendar.prototype.showAt = function(x,y){var s=this.element.style;s.left=x+"px";s.top=y+"px";this.show();};Calendar.prototype.showAtElement = function(el,opts){var self=this;var p=Calendar.getAbsolutePos(el);if(!opts||typeof opts!="string"){this.showAt(p.x,p.y+el.offsetHeight);return true;}function fixPosition(box){if(box.x<0)box.x=0;if(box.y<0)box.y=0;var cp=document.createElement("div");var s=cp.style;s.position="absolute";s.right=s.bottom=s.width=s.height="0px";document.body.appendChild(cp);var br=Calendar.getAbsolutePos(cp);document.body.removeChild(cp);if(false&&Calendar.is_ie){br.y+=document.body.scrollTop;br.x+=document.body.scrollLeft;}else{br.y+=window.scrollY;br.x+=window.scrollX;}var tmp=box.x+box.width-br.x;if(tmp>0)box.x-=tmp;tmp=box.y+box.height-br.y;if(tmp>0)box.y-=tmp;};this.element.style.display="block";Calendar.continuation_for_the_fucking_khtml_browser = function(){var w=self.element.offsetWidth;var h=self.element.offsetHeight;self.element.style.display="none";var valign=opts.substr(0,1);var halign="l";if(opts.length>1){halign=opts.substr(1,1);}switch(valign){case"T":p.y-=h;break;case"B":p.y+=el.offsetHeight;break;case"C":p.y+=(el.offsetHeight-h)/2;break;case"t":p.y+=el.offsetHeight-h;break;case"b":break;}switch(halign){case"L":p.x-=w;break;case"R":p.x+=el.offsetWidth;break;case"C":p.x+=(el.offsetWidth-w)/2;break;case"l":p.x+=el.offsetWidth-w;break;case"r":break;}p.width=w;p.height=h+40;self.monthsCombo.style.display="none";fixPosition(p);self.showAt(p.x,p.y);};if(Calendar.is_khtml)setTimeout("Calendar.continuation_for_the_fucking_khtml_browser()",10);else Calendar.continuation_for_the_fucking_khtml_browser();};Calendar.prototype.setDateFormat = function(str){this.dateFormat=str;};Calendar.prototype.setTtDateFormat = function(str){this.ttDateFormat=str;};Calendar.prototype.parseDate = function(str,fmt){if(!fmt)fmt=this.dateFormat;this.setDate(Date.parseDate(str,fmt));};Calendar.prototype.hideShowCovered = function(){if(!Calendar.is_ie&&!Calendar.is_opera)return;function getVisib(obj){var value=obj.style.visibility;if(!value){if(document.defaultView&&typeof(document.defaultView.getComputedStyle)=="function"){if(!Calendar.is_khtml)value=document.defaultView.getComputedStyle(obj,"").getPropertyValue("visibility");else value='';}else if(obj.currentStyle){value=obj.currentStyle.visibility;}else value='';}return value;};var tags=new Array("applet","iframe","select");var el=this.element;var p=Calendar.getAbsolutePos(el);var EX1=p.x;var EX2=el.offsetWidth+EX1;var EY1=p.y;var EY2=el.offsetHeight+EY1;for(var k=tags.length;k>0;){var ar=document.getElementsByTagName(tags[--k]);var cc=null;for(var i=ar.length;i>0;){cc=ar[--i];p=Calendar.getAbsolutePos(cc);var CX1=p.x;var CX2=cc.offsetWidth+CX1;var CY1=p.y;var CY2=cc.offsetHeight+CY1;if(this.hidden||(CX1>EX2)||(CX2<EX1)||(CY1>EY2)||(CY2<EY1)){if(!cc.__msh_save_visibility){cc.__msh_save_visibility=getVisib(cc);}cc.style.visibility=cc.__msh_save_visibility;}else{if(!cc.__msh_save_visibility){cc.__msh_save_visibility=getVisib(cc);}cc.style.visibility="hidden";}}}};Calendar.prototype._displayWeekdays = function(){var fdow=this.firstDayOfWeek;var cell=this.firstdayname;var weekend=Calendar._TT["WEEKEND"];for(var i=0;i<7;++i){cell.className="day name";var realday=(i+fdow)%7;if(i){cell.ttip=Calendar._TT["DAY_FIRST"].replace("%s",Calendar._DN[realday]);cell.navtype=100;cell.calendar=this;cell.fdow=realday;Calendar._add_evs(cell);}if(weekend.indexOf(realday.toString())!=-1){Calendar.addClass(cell,"weekend");}cell.innerHTML=Calendar._SDN[(i+fdow)%7];cell=cell.nextSibling;}};Calendar.prototype._hideCombos = function(){this.monthsCombo.style.display="none";this.yearsCombo.style.display="none";};Calendar.prototype._dragStart = function(ev){if(this.dragging){return;}this.dragging=true;var posX;var posY;if(Calendar.is_ie){posY=window.event.clientY+document.body.scrollTop;posX=window.event.clientX+document.body.scrollLeft;}else{posY=ev.clientY+window.scrollY;posX=ev.clientX+window.scrollX;}var st=this.element.style;this.xOffs=posX-parseInt(st.left);this.yOffs=posY-parseInt(st.top);with(Calendar){addEvent(document,"mousemove",calDragIt);addEvent(document,"mouseup",calDragEnd);}};Date._MD=new Array(31,28,31,30,31,30,31,31,30,31,30,31);Date.SECOND=1000;Date.MINUTE=60*Date.SECOND;Date.HOUR=60*Date.MINUTE;Date.DAY=24*Date.HOUR;Date.WEEK=7*Date.DAY;Date.parseDate = function(str,fmt){var today=new Date();var y=0;var m=-1;var d=0;var a=str.split(/[\t ,;\-\\\/]+/);var b=fmt.match(/%./g);var i=0,j=0;var hr=0;var min=0;for(i=0;i<a.length;++i){if(!a[i])continue;switch(b[i]){case"%d":case"%e":d=parseInt(a[i],10);break;case"%m":m=parseInt(a[i],10)-1;break;case"%Y":case"%y":y=parseInt(a[i],10);(y<100)&&(y+=(y>29)?1900:2000);break;case"%b":case"%B":for(j=0;j<12;++j){if(Calendar._MN[j].substr(0,a[i].length).toLowerCase()==a[i].toLowerCase()){m=j;break;}}break;case"%H":case"%I":case"%k":case"%l":hr=parseInt(a[i],10);break;case"%P":case"%p":if(/pm/i.test(a[i])&&hr<12)hr+=12;else if(/am/i.test(a[i])&&hr>=12)hr-=12;break;case"%M":min=parseInt(a[i],10);break;}}if(isNaN(y))y=today.getFullYear();if(isNaN(m))m=today.getMonth();if(isNaN(d))d=today.getDate();if(isNaN(hr))hr=today.getHours();if(isNaN(min))min=today.getMinutes();if(y!=0&&m!=-1&&d!=0)return new Date(y,m,d,hr,min,0);y=0;m=-1;d=0;for(i=0;i<a.length;++i){if(a[i].search(/[a-zA-Z]+/)!=-1){var t=-1;for(j=0;j<12;++j){if(Calendar._MN[j].substr(0,a[i].length).toLowerCase()==a[i].toLowerCase()){t=j;break;}}if(t!=-1){if(m!=-1){d=m+1;}m=t;}}else if(parseInt(a[i],10)<=12&&m==-1){m=a[i]-1;}else if(parseInt(a[i],10)>31&&y==0){y=parseInt(a[i],10);(y<100)&&(y+=(y>29)?1900:2000);}else if(d==0){d=a[i];}}if(y==0)y=today.getFullYear();if(m!=-1&&d!=0)return new Date(y,m,d,hr,min,0);return today;};Date.prototype.getMonthDays = function(month){var year=this.getFullYear();if(typeof month=="undefined"){month=this.getMonth();}if(((0==(year%4))&&((0!=(year%100))||(0==(year%400))))&&month==1){return 29;}else{return Date._MD[month];}};Date.prototype.getDayOfYear = function(){var now=new Date(this.getFullYear(),this.getMonth(),this.getDate(),0,0,0);var then=new Date(this.getFullYear(),0,0,0,0,0);var time=now-then;return Math.floor(time/Date.DAY);};Date.prototype.getWeekNumber = function(){var d=new Date(this.getFullYear(),this.getMonth(),this.getDate(),0,0,0);var DoW=d.getDay();d.setDate(d.getDate()-(DoW+6)%7+3);var ms=d.valueOf();d.setMonth(0);d.setDate(4);return Math.round((ms-d.valueOf())/(7*864e5))+1;};Date.prototype.equalsTo = function(date){return((this.getFullYear()==date.getFullYear())&&(this.getMonth()==date.getMonth())&&(this.getDate()==date.getDate())&&(this.getHours()==date.getHours())&&(this.getMinutes()==date.getMinutes()));};Date.prototype.setDateOnly = function(date){var tmp=new Date(date);this.setDate(1);this.setFullYear(tmp.getFullYear());this.setMonth(tmp.getMonth());this.setDate(tmp.getDate());};Date.prototype.print = function(str){var m=this.getMonth();var d=this.getDate();var y=this.getFullYear();var wn=this.getWeekNumber();var w=this.getDay();var s={};var hr=this.getHours();var pm=(hr>=12);var ir=(pm)?(hr-12):hr;var dy=this.getDayOfYear();if(ir==0)ir=12;var min=this.getMinutes();var sec=this.getSeconds();s["%a"]=Calendar._SDN[w];s["%A"]=Calendar._DN[w];s["%b"]=Calendar._SMN[m];s["%B"]=Calendar._MN[m];s["%C"]=1+Math.floor(y/100);s["%d"]=(d<10)?("0"+d):d;s["%e"]=d;s["%H"]=(hr<10)?("0"+hr):hr;s["%I"]=(ir<10)?("0"+ir):ir;s["%j"]=(dy<100)?((dy<10)?("00"+dy):("0"+dy)):dy;s["%k"]=hr;s["%l"]=ir;s["%m"]=(m<9)?("0"+(1+m)):(1+m);s["%M"]=(min<10)?("0"+min):min;s["%n"]="\n";s["%p"]=pm?"PM":"AM";s["%P"]=pm?"pm":"am";s["%s"]=Math.floor(this.getTime()/1000);s["%S"]=(sec<10)?("0"+sec):sec;s["%t"]="\t";s["%U"]=s["%W"]=s["%V"]=(wn<10)?("0"+wn):wn;s["%u"]=w+1;s["%w"]=w;s["%y"]=(''+y).substr(2,2);s["%Y"]=y;s["%%"]="%";var re=/%./g;if(!Calendar.is_ie5&&!Calendar.is_khtml)return str.replace(re,function(par){return s[par]||par;});var a=str.match(re);for(var i=0;i<a.length;i++){var tmp=s[a[i]];if(tmp){re=new RegExp(a[i],'g');str=str.replace(re,tmp);}}return str;};Date.prototype.__msh_oldSetFullYear=Date.prototype.setFullYear;Date.prototype.setFullYear = function(y){var d=new Date(this);d.__msh_oldSetFullYear(y);if(d.getMonth()!=this.getMonth())this.setDate(28);this.__msh_oldSetFullYear(y);};window._dynarch_popupCalendar=null;

Calendar._DN=new Array
("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday");Calendar._SDN=new Array
("Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun");Calendar._FD=0;Calendar._MN=new Array
("January","February","March","April","May","June","July","August","September","October","November","December");Calendar._SMN=new Array
("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");Calendar._TT={};Calendar._TT["INFO"]="About the calendar";Calendar._TT["ABOUT"]="DHTML Date/Time Selector\n"+"(c) dynarch.com 2002-2005 / Author: Mihai Bazon\n"+"For latest version visit: http://www.dynarch.com/projects/calendar/\n"+"Distributed under GNU LGPL.  See http://gnu.org/licenses/lgpl.html for details."+"\n\n"+"Date selection:\n"+"- Use the \xab, \xbb buttons to select year\n"+"- Use the "+String.fromCharCode(0x2039)+", "+String.fromCharCode(0x203a)+" buttons to select month\n"+"- Hold mouse button on any of the above buttons for faster selection.";Calendar._TT["ABOUT_TIME"]="\n\n"+"Time selection:\n"+"- Click on any of the time parts to increase it\n"+"- or Shift-click to decrease it\n"+"- or click and drag for faster selection.";Calendar._TT["PREV_YEAR"]="Prev. year (hold for menu)";Calendar._TT["PREV_MONTH"]="Prev. month (hold for menu)";Calendar._TT["GO_TODAY"]="Go Today";Calendar._TT["NEXT_MONTH"]="Next month (hold for menu)";Calendar._TT["NEXT_YEAR"]="Next year (hold for menu)";Calendar._TT["SEL_DATE"]="Select date";Calendar._TT["DRAG_TO_MOVE"]="Drag to move";Calendar._TT["PART_TODAY"]=" (today)";Calendar._TT["DAY_FIRST"]="Display %s first";Calendar._TT["WEEKEND"]="0,6";Calendar._TT["CLOSE"]="Close";Calendar._TT["TODAY"]="Today";Calendar._TT["TIME_PART"]="(Shift-)Click or drag to change value";Calendar._TT["DEF_DATE_FORMAT"]="%Y-%m-%d";Calendar._TT["TT_DATE_FORMAT"]="%a, %b %e";Calendar._TT["WK"]="wk";Calendar._TT["TIME"]="Time:";

Calendar.setup = function(params){function param_default(pname,def){if(typeof params[pname]=="undefined"){params[pname]=def;}};param_default("inputField",null);param_default("displayArea",null);param_default("button",null);param_default("eventName","click");param_default("ifFormat","%Y/%m/%d");param_default("daFormat","%Y/%m/%d");param_default("singleClick",true);param_default("disableFunc",null);param_default("dateStatusFunc",params["disableFunc"]);param_default("dateTooltipFunc",null);param_default("dateText",null);param_default("firstDay",null);param_default("align","Br");param_default("range",[1900,2999]);param_default("weekNumbers",true);param_default("flat",null);param_default("flatCallback",null);param_default("onSelect",null);param_default("onClose",null);param_default("onUpdate",null);param_default("date",null);param_default("showsTime",false);param_default("timeFormat","24");param_default("electric",true);param_default("step",2);param_default("position",null);param_default("cache",false);param_default("showOthers",false);param_default("multiple",null);var tmp=["inputField","displayArea","button"];for(var i in tmp){if(typeof params[tmp[i]]=="string"){params[tmp[i]]=document.getElementById(params[tmp[i]]);}}if(!(params.flat||params.multiple||params.inputField||params.displayArea||params.button)){alert("Calendar.setup:\n  Nothing to setup (no fields found).  Please check your code");return false;}function onSelect(cal){var p=cal.params;var update=(cal.dateClicked||p.electric);if(update&&p.inputField){p.inputField.value=cal.date.print(p.ifFormat);if(typeof p.inputField.onchange=="function")p.inputField.onchange();}if(update&&p.displayArea)p.displayArea.innerHTML=cal.date.print(p.daFormat);if(update&&typeof p.onUpdate=="function")p.onUpdate(cal);if(update&&p.flat){if(typeof p.flatCallback=="function")p.flatCallback(cal);}if(update&&p.singleClick&&cal.dateClicked)cal.callCloseHandler();};if(params.flat!=null){if(typeof params.flat=="string")params.flat=document.getElementById(params.flat);if(!params.flat){alert("Calendar.setup:\n  Flat specified but can't find parent.");return false;}var cal=new Calendar(params.firstDay,params.date,params.onSelect||onSelect);cal.setDateToolTipHandler(params.dateTooltipFunc);cal.showsOtherMonths=params.showOthers;cal.showsTime=params.showsTime;cal.time24=(params.timeFormat=="24");cal.params=params;cal.weekNumbers=params.weekNumbers;cal.setRange(params.range[0],params.range[1]);cal.setDateStatusHandler(params.dateStatusFunc);cal.getDateText=params.dateText;if(params.ifFormat){cal.setDateFormat(params.ifFormat);}if(params.inputField&&typeof params.inputField.value=="string"){cal.parseDate(params.inputField.value);}cal.create(params.flat);cal.show();return false;}var triggerEl=params.button||params.displayArea||params.inputField;triggerEl["on"+params.eventName] = function(){var dateEl=params.inputField||params.displayArea;var dateFmt=params.inputField?params.ifFormat:params.daFormat;var mustCreate=false;var cal=window.calendar;if(dateEl)params.date=Date.parseDate(dateEl.value||dateEl.innerHTML,dateFmt);if(!(cal&&params.cache)){window.calendar=cal=new Calendar(params.firstDay,params.date,params.onSelect||onSelect,params.onClose||function(cal){cal.hide();});cal.setDateToolTipHandler(params.dateTooltipFunc);cal.showsTime=params.showsTime;cal.time24=(params.timeFormat=="24");cal.weekNumbers=params.weekNumbers;mustCreate=true;}else{if(params.date)cal.setDate(params.date);cal.hide();}if(params.multiple){cal.multiple={};for(var i=params.multiple.length;--i>=0;){var d=params.multiple[i];var ds=d.print("%Y%m%d");cal.multiple[ds]=d;}}cal.showsOtherMonths=params.showOthers;cal.yearStep=params.step;cal.setRange(params.range[0],params.range[1]);cal.params=params;cal.setDateStatusHandler(params.dateStatusFunc);cal.getDateText=params.dateText;cal.setDateFormat(dateFmt);if(mustCreate)cal.create();cal.refresh();if(!params.position)cal.showAtElement(params.button||params.displayArea||params.inputField,params.align);else cal.showAt(params.position[0],params.position[1]);return false;};return cal;};

var swfobject = function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M = function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k = function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload = function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return!a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d = function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();

var E_OK=0;var E_INPUT=1;var E_SYS=2;var E_CRED=3;var E_DEACTIVATED=4;var E_AUTH=5;var E_NOSUCH=6;var E_CONFLICT=7;var E_LIMIT=8;var E_ALREADY=9;var E_EMPTY=10;var E_SYNC=11;var E_TIMEOUT=12;var E_SIZE=13;function goTo(url)
{if(!vkDom.hasClass(document.body,'corp')||(arguments.length>1&&arguments[1]==true))
loading();window.location=url;return false;}
function loading()
{(vkDom.hasClass(document.body,'modal')?vkModal:vkPopup).status('Loading...','Please wait while loading','wait',null);}
function errorRetry(retry)
{(vkDom.hasClass(document.body,'modal')?vkModal:vkPopup).yesno('Unexpected problem','An unexpected problem occured.\nWould you like to retry?','question',retry,true);}
function timeoutRetry(retry)
{(vkDom.hasClass(document.body,'modal')?vkModal:vkPopup).yesno('Operation timed out','The operation timed out.\nDo you want to retry?','question',retry);}
function authError()
{(vkDom.hasClass(document.body,'modal')?vkModal:vkPopup).message('Please authenticate','This feature requires user authentication.\nPlease log in and try again.','warn',goLogin);}
function askExitWithoutSaving(callback)
{if(typeof(callback)!='function')
return;(vkDom.hasClass(document.body,'modal')?vkModal:vkPopup).yesno('Exit without saving?','Not saved.\n'+'\n'+'Do you want to exit anyway?','ask',function(yn)
{if(yn)
callback();},false);}
function goLogin()
{if(arguments.length&&arguments[0])
goTo('/login.php');else
goTo('logout.php');return false;}
var kigoDebug=new vkDebug();function resetMissingFields(arr)
{var i;if(arr==null||typeof(arr)!='object'||!arr['length'])
{kigoDebug.text('resetMissingFields(): bad argument.');return;}
for(i=0;i<arr.length;i++)
{if(!vkDom.el(arr[i]))
{kigoDebug.text('resetMissingFields(): skipping unknown field: '+arr[i]);continue;}
vkDom.removeClass(arr[i],'missing');}}
function setMissingField(field,first)
{if(!vkDom.el(field))
{kigoDebug.text('setMissingField(): no such field: '+field);return first;}
vkDom.addClass(field,'missing');return(first==null?field:first);}
var ajax;function getAjax()
{if(ajax!=null)
ajax.free();ajax=new vkJSONRemote();}
var kigoFormMonitor=new vkFormMonitor();vkDom.onLoad(function()
{kigoDebug.enable(kigo.CFG.APP.VKDEBUG_ENABLE);vkPopup._kigo_localModal=vkPopup.localModal;vkPopup.localModal = function(title,width,height,content)
{var modal;if(!(content=vkDom.el(content)))
return;this._kigo_localModal_content=content;this._kigo_localModal_content_parent=content.parentNode;content.parentNode.removeChild(content);modal=this._kigo_localModal(title,width,height);vkDom.addClass(modal,'localmodalcontainer');vkDom.addClass(content,'localmodal');modal.appendChild(content);return modal;}
vkPopup._kigo_closeModal=vkPopup.closeModal;vkPopup.closeModal = function()
{if(this._kigo_localModal_content!=undefined&&this._kigo_localModal_content!=null)
{this._kigo_localModal_content.parentNode.removeChild(this._kigo_localModal_content);this._kigo_localModal_content_parent.appendChild(this._kigo_localModal_content);this._kigo_localModal_content=null;this._kigo_localModal_content_parent=null;}
this._kigo_closeModal();}
kigoToolTips.autoSetup(document.body);function inputFilter(ev)
{var obj;var charCode;if(ev.target)
obj=ev.target;else if(ev.srcElement)
obj=ev.srcElement;else
return true;if(!obj.getAttribute('filter'))
return true;if(ev['charCode'])
charCode=ev.charCode;else if(ev['keyCode'])
charCode=ev.keyCode;else
return true;switch(charCode)
{case 8:case 9:case 13:case 35:case 36:case 37:case 38:case 39:case 40:return true;}
function _if_cancel(ev)
{if(ev.preventDefault)
ev.preventDefault();return false;}
switch(obj.getAttribute('filter'))
{case'money':if((charCode>=48&&charCode<=57)||charCode==44||charCode==45||charCode==46)
return true;else
return _if_cancel(ev);case'money_positive':if((charCode>=48&&charCode<=57)||charCode==44||charCode==46)
return true;else
return _if_cancel(ev);case'digits':if(charCode==46)
{return true;}
if((charCode>=48&&charCode<=57))
return true;else
return _if_cancel(ev);break;case'hour':break;case'minute':break;case'custom':break;case'url':switch(charCode)
{case 32:case 47:case 92:case 91:case 93:return _if_cancel(ev);default:return true;}
break;}
return true;}
if(window.addEventListener)
window.addEventListener('keypress',inputFilter,false);else if(window.attachEvent)
document.body.attachEvent('onkeypress',inputFilter);vkPopup.setZIndexBase(500);vkPopup.setLang('EN');});

kigo.CFG = {
	"APP":{
		"VKDEBUG_ENABLE":false,
		"APP_URL":"app.kigo.net",
		"SESSION_NAME":"KIGO_SESSION"
	},
	"MISC":{
		"YEAR_MIN":2000,
		"YEAR_MAX":2030,
		"MAXLEN_EMAIL":200,
		"MAXLEN_URL":200,
		"MAXLEN_DOMAIN":80,
		"FILENAME_RESERVED_CHARS":"\\/?%*:|\"<>.+[]",
		"AJAXROUTER_CLIENT_TIMEOUT":55
	},
	"ACCOUNT":{
		"USERNAME_MIN_CHARS":4,
		"USERNAME_MAX_CHARS":20,
		"PASSWORD_MIN_CHARS":5
	},
	"PROP":{
		"AVGCLEAN_START_HOURS":0,
		"AVGCLEAN_END_HOURS":12,
		"CIN_START_HOUR":10,
		"CIN_END_HOUR":17,
		"COUT_START_HOUR":9,
		"COUT_END_HOUR":15,
		"MAX_BATHROOMS":30,
		"MAX_TOILETS":30,
		"MAX_BEDROOMS":20,
		"MAX_BEDS":20,
		"MAX_MAXGUESTS":30,
		"MAXLEN_PROP_NAME":100,
		"MAXLEN_STREETNO":8,
		"MAXLEN_ADDR1":60,
		"MAXLEN_ADDR2":35,
		"MAXLEN_ADDR3":35,
		"MAXLEN_APTNO":10,
		"MAXLEN_POSTCODE":8,
		"MAXLEN_CITY":26,
		"MAXLEN_REGION":35,
		"MAXLEN_PHONE":30,
		"MAXLEN_FLOOR":4,
		"MAXLEN_PHOTO_NAME":50,
		"PRICING":{
			"MAX_PERIODS":50,
			"MAX_RANGES":40,
			"MAXLEN_PERIOD":50,
			"MAX_RENT_DAYS":99,
			"MAX_FEE_DAYS":99,
			"MAX_DEPOSIT_DAYS":99,
			"MAX_EARLY_DISCOUNT_DAYS":999,
			"MAX_LATE_DISCOUNT_DAYS":99,
			"MAX_LATE_DISCOUNT_PERIODS":10,
			"MAX_SPECIAL_DISCOUNT_PERIODS":20,
			"MAXLEN_DISCOUNT_NAME":50,
			"PERIOD_DATE_MIN":"2000-01-01",
			"PERIOD_DATE_MAX":"2029-12-31"
		},
		"RESELLER_PRICING":{
			"MAX_RENT_DAYS":99
		},
		"UDPA":{
			"MAXLEN_SINGLE_LINE_TEXT":200,
			"MAXLEN_MULTI_LINE_TEXT":65535,
			"MAXLEN_UDPA_NAME":100,
			"MAXLEN_UDPA_CHOICE_NAME":100,
			"MAXLEN_UDPA_GROUP_NAME":100
		},
		"UDPS":{
			"MAXLEN_NAME":100,
			"MAX_QT_MAX":20
		},"
		UDPC":{
			"MAXLEN_NAME":100,
			"MAXLEN_CODE":20
		}
	},
	"PROP_GUI":{
		"PAGER_PERPAGE":50
	},
	"RES":{
		"MAXLEN_GUEST_NAME":50,
		"MAXLEN_GUEST_PHONE":30,
		"MIN_IN_DATE":"1990-01-01",
		"MAX_IN_DATE":"2099-12-31",
		"UDRA":{
			"MAXLEN_SINGLE_LINE_TEXT":200,
			"MAXLEN_MULTI_LINE_TEXT":65535,
			"MAXLEN_UDRA_NAME":100,
			"MAXLEN_UDRA_CHOICE_NAME":100
		}
	},
	"RES_PMT":{
		"MAXLEN_METHOD":100
	},
	"RES_BOOKING_SOURCE":{
		"MAX_CUSTOM_SOURCES":20,
		"MAXLEN_LABEL":100
	},
	"RES_GUI":{
		"PAGER_PERPAGE":30,
		"HISTORY_PAGER_PERPAGE":50
	},
	"RES_EMAIL":{
		"MAXLEN_LABEL":100,
		"MAXLEN_SUBJECT":200,
		"MAX_FILES":5,
		"MAX_RCPT_TO":5,
		"MAX_RCPT_CC":5,
		"MAX_RCPT_BCC":5,
		"MAX_ATTACHED_FILE_SIZE_MB":3,
		"MAX_ATTACHED_TOTAL_SIZE_MB":5,
		"MAX_ATTACHED_FILES":5,
		"MAX_REMINDER_OPT_DAYS":999,
		"MAX_REMINDER_OPT_HOURS":999,
		"SUBST_STRING":"(PLEASE ENTER TEXT)",
		"SUBST_DATE":"(PLEASE ENTER A DATE)",
		"SUBST_AMOUNT":"(PLEASE ENTER AN AMOUNT)",
		"SUBST_AMOUNT_NC":"(PLEASE ENTER AN AMOUNT)",
		"SUBST_UDPA":"(PLEASE ENTER TEXT)",
		"SUBST_UDRA":"(PLEASE ENTER TEXT)",
		"PDF":{
			"MAX_BANNER_FILESIZE_KB":512,
			"ESTIMATED_TEXT_SIZE":262144,
			"MAXLEN_TEMPLATE_LABEL":100,
			"MAXLEN_TEMPLATE_FILENAME":100
		},
		"REMINDER_OPT_PMT_DUE_THRESHOLD_PERCENT_MAX":20
	},
	"RES_EMAIL_GUI":{
		"SENT_EMAILS_PAGER_PERPAGE":50
	},
	"EMAIL_GUI":{
		"PAGER_PERPAGE":50
	},
	"ERI":{
		"IMAP_ACCOUNT":"inquiries",
		"AT_DOMAIN":"@mail.kigo.net",
		"MAXLEN_PROP_REF":100
	},
	"WS":{
		"GOOGLE_SITE_VERIFY_MIN_LENGTH":1,
		"GOOGLE_SITE_VERIFY_MAX_LENGTH":100,
		"GOOGLE_ANALYTICS_MIN_LENGTH":6,
		"GOOGLE_ANALYTICS_MAX_LENGTH":32,
		"REDIR_URL_MAX_LENGTH":200,
		"WSL_FS":{
			"URL_MAXLENGTH":100,
			"CUSTOMICO_MAX_WIDTH":256,
			"CUSTOMICO_MAX_HEIGHT":256,
			"CUSTOMICO_MAX_FILESIZE":524288
		}
	},
	"CIO":{
		"PERSON":{
			"NAME_MAX":50
		}
	},
	"RA_INFO":{
		"MAXLEN_NAME":50,
		"MAXLEN_PHONE":30,
		"MAXLEN_STREETNO":8,
		"MAXLEN_ADDR1":60,
		"MAXLEN_ADDR2":35,
		"MAXLEN_ADDR3":35,
		"MAXLEN_POSTCODE":8,
		"MAXLEN_CITY":26
	},
	"RA":{
		"MAX_LOGO_FILESIZE":1048576,
		"NO_AGENCY_LOGO":"ffffffffffffffff000000020000000000000000000000000000000000000000",
		"MAXLEN_DESCRIPTION":250
	},
	"DIRECTORY":{
		"PAGER_PERPAGE":50,
		"MAXLEN_SEARCH_TEXT":250
	},
	"RI_GUI":{
		"PER_PAGE":100
	},
	"EXPORT":{
		"MAX_DOWNLOAD_NAME_LEN":200
	},
	"IMPORT":{
		"MAX_UPLOAD_FILE_SIZE_MB":20
	},
	"BO":{
		"LOG_GUI":{
			"PER_PAGE":200
		},
		"CUSTOMER":{
			"PROFILE_MAX_PROP":99999,
			"MAX_ATTACHED_FILE_SIZE_MB":16
		},
		"CUSTOMER_GUI":{
			"PER_PAGE":50
		},
		"CUSTOMER_SUPPORT_GUI":{
			"LOGIN_HISTORY":{
				"PER_PAGE":100
			}
		},
		"SUBSCRIPTION":{
			"MAXLEN_LABEL":100
		},
		"ADJUSTMENT":{
			"MAXLEN_LABEL":100
		},
		"WS":{
			"NEW_DOMAIN_SUFFIX":".kigosite.net",
			"FTP":{
				"FOLDER_VCHRCONTENT":"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
				"FOLDER_MAXLEN":100
			},
			"DNS":{
				"MAX_RR":25,
				"MAXLEN_FQDN":80,
				"MAXLEN_TXT":200
			}
		},
		"REPORT":{
			"INVOICE_GUI":{
				"PAGER_PERPAGE":100
			},
			"SUBSCRIPTION_GUI":{
				"PAGER_PERPAGE":100
			},
			"ADJUSTMENT_GUI":{
				"PAGER_PERPAGE":100
			},
			"PBNS_FORECAST_GUI":{
				"PAGER_PERPAGE":100
			}
		}
	},
	"PP":{
		"CC_DESTROY_DAYS":45,
		"BDC":{
			"ROOM":{
				"MAX_PROP_PER_ROOM":100
			},
			"DFU_MAX":999,
			"DMN_MAX":999
		},
		"BDC_GUI":{
			"HOTEL":{
				"PER_PAGE":10
			},
			"RESERVATION":{
				"PER_PAGE":50
			}
		},
		"BDC_BO_GUI":{
			"HOTEL":{
				"PER_PAGE":50
			},
			"LOGS":{
				"PER_PAGE":100
			}
		}
	}
};
kigo.CONST = {"RES":{"T_RRC_SHARE":"RRC_SHARE","T_ORC_SHARE":"ORC_SHARE","T_OWNER":"OWNER","ST_INQUIRY":"INQUIRY","ST_HOLD":"HOLD","ST_EXPIRED_HOLD":"EXPIRED_HOLD","ST_CONFIRMED":"CONFIRMED","ST_CANCELED_INQUIRY":"CANCELED_INQUIRY","ST_CANCELED_HOLD":"CANCELED_HOLD","ST_CANCELED_CONFIRMED":"CANCELED_CONFIRMED","UDRA":{"T_SINGLE_LINE_TEXT":"SINGLE_LINE_TEXT","T_MULTI_LINE_TEXT":"MULTI_LINE_TEXT","T_SINGLE_CHOICE":"SINGLE_CHOICE","T_MULTI_UNORDERED_CHOICE":"MULTI_UNORDERED_CHOICE"}},"RES_PMT":{"VATT_APPLIED":"APPLIED","VATT_DEDUCED":"DEDUCED"},"RES_GUI":{"HL_ALL":"ALL","HL_NONE":"NONE","UF_ALL":"ALL","UF_READ":"READ","UF_UNREAD":"UNREAD","PS_ALL":"ALL"},"RES_EMAIL":{"TO":"TO","CC":"CC","BCC":"BCC","FROM_GUEST":"GUEST","FROM_ORC_SHARE":"ORC_SHARE","FROM_OWNER":"OWNER","FROM_RRC_SHARE":"RRC_SHARE","FROM_SELF":"SELF","FROM_CUSTOM":"CUSTOM","T_GUI":"GUI","T_NOTIFICATION":"NOTIFICATION","T_REMINDER":"REMINDER","AF_FILE":"FILE","AF_PDF":"PDF","CONDITION_AVAILABILITY":"AVAILABILITY","CONDITION_CONTACT_OWNER":"CONTACT_OWNER","REMINDER_COND_CHECKIN_DAYS":"CHECKIN_DAYS","REMINDER_COND_CHECKOUT_DAYS":"CHECKOUT_DAYS","REMINDER_COND_CREATE_DAYS":"CREATE_DAYS","REMINDER_COND_PMT_DAYS":"PMT_DAYS","REMINDER_COND_HOLD_HOURS":"HOLD_HOURS","REMINDER_COND_HOLD_EXPIRE_HOURS":"HOLD_EXPIRE_HOURS","REMINDER_OPT_WHEN_BEFORE":"BEFORE","REMINDER_OPT_WHEN_AFTER":"AFTER","REMINDER_OPT_PMT_G2RA_RENTDOWN":"G2RA_RENTDOWN","REMINDER_OPT_PMT_G2RA_RENTREMAINING":"G2RA_RENTREMAINING","REMINDER_OPT_PMT_G2RA_DEPOSIT":"G2RA_DEPOSIT","REMINDER_OPT_PMT_G2RA_OTHER":"G2RA_OTHER","REMINDER_OPT_PMT_G2O_RENTDOWN":"G2O_RENTDOWN","REMINDER_OPT_PMT_G2O_RENTREMAINING":"G2O_RENTREMAINING","REMINDER_OPT_PMT_G2O_DEPOSIT":"G2O_DEPOSIT","REMINDER_OPT_PMT_G2O_OTHER":"G2O_OTHER","REMINDER_OPT_PMT_RA2O_RENTDOWN":"RA2O_RENTDOWN","REMINDER_OPT_PMT_RA2O_RENTREMAINING":"RA2O_RENTREMAINING","REMINDER_OPT_PMT_RA2O_DEPOSIT":"RA2O_DEPOSIT","REMINDER_OPT_PMT_RA2O_OTHER":"RA2O_OTHER","REMINDER_OPT_PMT_DUE_THRESHOLD_NONE":"NONE","REMINDER_OPT_PMT_DUE_THRESHOLD_AMOUNT":"AMOUNT","REMINDER_OPT_PMT_DUE_THRESHOLD_PERCENT":"PERCENT","PDF":{"FONT_XSMALL":"11px","FONT_SMALL":"12px","FONT_NORMAL":"18px","FONT_LARGE":"22px","FONT_XLARGE":"31px","FONT_XXLARGE":"48px"}},"RES_BOOKING_SOURCE":{"BST_PP":"PP","BST_ERI":"ERI","BST_RRC":"RRC","BST_WEBSITE":"WEBSITE","BST_CUSTOM":"CUSTOM"},"CALENDAR_GUI":{"CIO_CLEAN":1,"CIO_NOT_CLEAN_PLANNED":2,"CIO_NOT_CLEAN_NOT_PLANNED":4},"PROP":{"SZUT_SQMETER":"SQMETER","SZUT_SQFEET":"SQFEET","GT_ANY":"ANY","GT_ADULT":"ADULT","GT_CHILD":"CHILD","GT_BABY":"BABY","TI_NIGHT":"NIGHT","TI_MONTH":"MONTH","TI_YEAR":"YEAR","TI_NIGHT_MAX":27,"TI_MONTH_MAX":11,"TI_YEAR_MAX":5,"PRICING":{"CT_WEEKLY":"WEEKLY","RCPT_RA":"RA","RCPT_OWNER":"OWNER","N_MON":1,"N_TUE":2,"N_WED":4,"N_THU":8,"N_FRI":16,"N_SAT":32,"N_SUN":64,"N_NONE":0,"N_ALL":127,"PGC_ADULTS":"ADULTS","PGC_ADULTS_CHILDREN":"ADULTS_CHILDREN","PGC_ADULTS_CHILDREN_BABIES":"ADULTS_CHILDREN_BABIES","SCHT_DAYS_AFTER_CREATE":"DAYS_AFTER_CREATE","SCHT_END_CREATE_MONTH":"END_CREATE_MONTH","SCHT_DAYS_BEFORE_CI":"DAYS_BEFORE_CI","SCHT_DAYS_AFTER_CI":"DAYS_AFTER_CI","SCHT_END_CI_MONTH":"END_CI_MONTH","SCHT_END_NEXT_CI_MONTH":"END_NEXT_CI_MONTH","SCHT_END_CO_MONTH":"END_CO_MONTH","SCHT_END_NEXT_CO_MONTH":"END_NEXT_CO_MONTH","SCHT_DAY_NEXT_CO_MONTH":"DAY_NEXT_CO_MONTH","FDT_CREATE":"CREATE","FDT_CHECKIN":"CHECKIN","U_AMOUNT_PER_QT":"AMOUNT_PER_QT","U_AMOUNT":"AMOUNT","U_AMOUNT_PER_NIGHT":"AMOUNT_PER_NIGHT","U_AMOUNT_PER_NIGHT_PER_GUEST":"AMOUNT_PER_NIGHT_PER_GUEST","U_AMOUNT_PER_GUEST":"AMOUNT_PER_GUEST","U_PERCENT_RENT":"PERCENT_RENT","U_PERCENT_RENT_FEES":"PERCENT_RENT_FEES","U_PERCENT_DOWNRENT":"PERCENT_DOWNRENT","U_PERCENT_DOWNRENT_FEES":"PERCENT_DOWNRENT_FEES","U_STAYLENGTH":"STAYLENGTH","SLU_AMOUNT":"AMOUNT","SLU_PERCENT_RENT":"PERCENT_RENT","SLU_AMOUNT_PER_NIGHT_PER_GUEST":"AMOUNT_PER_NIGHT_PER_GUEST","SLU_AMOUNT_PER_GUEST":"AMOUNT_PER_GUEST","DDT_CREATE":"CREATE","DDT_CHECKIN":"CHECKIN","ADC_FROM_RA_COMMISSION":"RA_COMMISSION","ADC_FROM_OWNER_RENT":"OWNER_RENT","ADC_FROM_BOTH":"BOTH","ADC_TO_DOWN":"DOWN","ADC_TO_REMAINING":"REMAINING","ADC_TO_BOTH":"BOTH"},"RESELLER_PRICING":{"RCPT_RESELLER":"RESELLER","RCPT_PROVIDER":"PROVIDER"},"WEBSITE_OB":{"WE_WE":"WE","WE_FRI":"FRI","WE_THU":"THU","DFU_MAX":999,"DMN_MAX":999},"UDPA":{"T_SINGLE_LINE_TEXT":"SINGLE_LINE_TEXT","T_MULTI_LINE_TEXT":"MULTI_LINE_TEXT","T_SINGLE_CHOICE":"SINGLE_CHOICE","T_MULTI_UNORDERED_CHOICE":"MULTI_UNORDERED_CHOICE"}},"RA_PROP":{"ORIGIN_ORC_SHARE":"ORC_SHARE","ORIGIN_RRC_SHARE":"RRC_SHARE","ORIGIN_NONE":"NONE"},"CIO":{"TF_ALL":3,"TF_IN":2,"TF_OUT":1,"PER_PAGE":100,"EXPORT_CLEANING":1,"EXPORT_RECEPTION":2,"EXPORT_CHECKOUT":3,"EXPORT_CLEANING_POST_STAY":4},"RI":{"O_G2RA":1,"O_G2O":2,"O_RA2O":4,"O_DUE":8,"O_PAYED":16,"O_STILL_DUE":32,"RENT_DOWNMPT":"RENT_DOWNMPT","RENT_REMPMT":"RENT_REMPMT","RENT_DOWNPMT_AND_REMPMT":"RENT_DOWNPMT_AND_REMPMT","RENT_AND_OTHER_PMT":"RENT_AND_OTHER_PMT","DEPOSIT_PMT":"DEPOSIT_PMT","OTHER_PMT":"OTHER_PMT","OWNER_SPREAD_NIGHTS":"NIGHTS","OWNER_BASED_DUE_DATES":"DATES","OWNER_SPREAD_NIGHTS_EXPORT_TABLE":"NIGHTS_TABLE","OWNER_SPREAD_NIGHTS_EXPORT_STATEMENT":"NIGHTS_STATEMENT","OWNER_BASED_DUE_DATES_EXPORT_TABLE":"DATES_TABLE","OWNER_BASED_DUE_DATES_EXPORT_STATEMENT":"DATES_STATEMENT","STATS_CONFIRMATION_DATE":1,"STATS_SPREAD_NIGHTS":2,"STATS_BASED_DUE_DATES":3,"RM_CHECKIN":"CHECKIN","RM_CONFIRM":"CONFIRM","BSP_LAST_30_DAYS":30,"BSP_LAST_90_DAYS":90,"BSP_LAST_180_DAYS":180,"BSP_LAST_365_DAYS":365},"REPORT_CHARTS":{"STATS_CONFIRMATION_DATE":1,"STATS_SPREAD_NIGHTS":2,"STATS_BASED_DUE_DATES":3,"SERIES_GUEST_RENT":1,"SERIES_OWNER_RENT":2,"SERIES_COMMISSION":3,"SERIES_AVG_RENT":4,"SERIES_NB_OF_BOOKED_NIGHTS":5},"WS":{"OB":{"ST":{"PENDING":"PENDING","TIMEOUT":"TIMEOUT","TIMEOUT_PAID":"TIMEOUT_PAID","ABORTED":"ABORTED","RESFAIL_PAID":"RESFAIL_PAID","PAID":"PAID","UNKNOWN":"UNKNOWN"},"ELA":{"VISITOR":"VISITOR","KIGO":"KIGO","BANK":"BANK","USER":"USER"},"RFR":{"DBLBOOK":"DBLBOOK","UNAVAIL":"UNAVAIL","UNKNOWN":"UNKNOWN"}},"WSL_FS":{"IMGTYPE_JPEG":1,"IMGTYPE_SWF":2,"IMGTYPE_GIF":8,"IMGTYPE_PNG":4,"IMGTYPE_ICO":16}},"PP":{"BDC":{"HOTEL":{"HS_CONFIGURING":"CONFIGURING","HS_CONFIGURED":"CONFIGURED","HS_WAIT_BDC":"WAIT_BDC","HS_LIVE":"LIVE"},"RESERVATION":{"ST_NEW":"new","ST_MODIFIED":"modified","ST_CANCELLED":"cancelled"},"WE":{"WE":"WE","FRI":"FRI","THU":"THU"},"LOGS":{"LO_KIGO":"KIGO","LO_BO":"BO","LO_RA":"RA","LT_HOTEL_CONNECT":"HOTEL_CONNECT","LT_HOTEL_SC_CONFIGURED":"HOTEL_SC_CONFIGURED","LT_HOTEL_SC_WAIT_BDC":"HOTEL_SC_WAIT_BDC","LT_HOTEL_SC_LIVE":"HOTEL_SC_LIVE","LT_HOTEL_DISCONNECT":"HOTEL_DISCONNECT","LT_HOTEL_NAME":"HOTEL_NAME","LT_ROOM_ADD":"ROOM_ADD","LT_ROOM_REMOVE":"ROOM_REMOVE","LT_ROOM_NAME":"ROOM_NAME","LT_ROOM_RATE":"ROOM_RATE","LT_ROOM_SETUP":"ROOM_SETUP","LT_RES_NOTIFY":"RES_NOTIFY","LT_RES_CREATE":"RES_CREATE","LT_API_ROOMRATES":"API_ROOMRATES","LT_API_RESERVATIONS":"API_RESERVATIONS","LT_API_AVAILABILITY":"API_AVAILABILITY","LT_API_LOS":"API_LOS"}},"BP":[]},"BO":{"USER":{"P_IT":"IT","P_PRODUCT":"PRODUCT","P_SUPPORT":"SUPPORT","P_SALES":"SALES"},"LOG":{"INFO":"INFO","NOTICE":"NOTICE","WARN":"WARN","ERROR":"ERROR"},"LOG_GUI":{"ACK_ALL":1,"ACK_NOT":2,"ACK_ACK":3},"CUSTOMER":{"CS_INCOMING":"INCOMING","CS_ONBOARDING":"ONBOARDING","CS_ACTIVE":"ACTIVE","CS_TECH":"TECH","CS_KIGO":"KIGO","CS_LOST":"LOST","CS_DUPLICATE":"DUPLICATE","CS_OOB":"OOB","LC_CUSTOMER":"CUSTOMER","LC_DOCUMENT":"DOCUMENT","LC_PROFILE":"PROFILE","LC_BILLING":"BILLING","LC_SUPPORT":"SUPPORT","LT_TECH":"TECH","LT_BUSINESS":"BUSINESS"},"CURRENCY_EUR":"EUR","CURRENCY_USD":"USD","CURRENCY_GBP":"GBP","PT_ONLINE":"ONLINE","PT_OFFLINE":"OFFLINE","INVOICE":{"ST_DUE":"DUE","ST_PAID":"PAID","ST_VOID":"VOID"},"ADJUSTMENT":{"CAT_SUBSCRIPTION":"SUBSCRIPTION","CAT_PS_ORIGINAL":"PS_ORIGINAL","CAT_PS_ADDON":"PS_ADDON","CAT_OTHER":"OTHER"},"API_GUI":{"PAGER_PERPAGE":100},"WS_SETTING_TYPES":{"ST_NULL":"NULL","ST_BOOL":"BOOL","ST_INT":"INT","ST_TEXT":"TEXT"},"WS_DNS":{"RR_MX":"MX","RR_KIGO_WS":"KIGO_WS","RR_A":"A","RR_CNAME":"CNAME","RR_NS":"NS","RR_TXT":"TXT","RR_SPF":"SPF"}}};