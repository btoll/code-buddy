
BLUEBOY.xhr={getXHR:function(){var aFactory=[function(){return new XMLHttpRequest();},function(){return new ActiveXObject("Msxml2.XMLHTTP");},function(){return new ActiveXObject("Microsoft.XMLHTTP");}];for(var i=0,iLength=aFactory.length;i<iLength;i++){try{aFactory[i]();}catch(e){continue;}
BLUEBOY.xhr.getXHR=aFactory[i];return aFactory[i]();}
throw new Error("XMLHttpRequest object cannot be created.");},ajax:function(options){options={type:options.type||"POST",header:options.header||"",url:options.url||"",timeout:options.timeout||5000,onComplete:options.onComplete||function(){},onError:options.onError||function(){},onSuccess:options.onSuccess||function(){},customObj:options.customObj||"",image:options.image||"",elem:options.elem||"",data:options.data||"",asynch:options.asynch===false?false:true};var xml=BLUEBOY.xhr.getXHR();options.type=="HEAD"?xml.open(options.type,options.url):xml.open(options.type,options.url,true);var timeoutLength=options.timeout;var requestDone=false;setTimeout(function(){requestDone=true;},timeoutLength);xml.onreadystatechange=function(){if(options.image&&options.elem){if(xml.readyState<4)
$(options.elem).innerHTML="<img src=\""+options.image+"\" alt=\"\" />";}
if(xml.readyState==4&&!requestDone){if(httpSuccess(xml)){options.onSuccess(httpData(xml,options.data));}else options.onError();options.onComplete();xml=null;}};xml.send(null);function httpSuccess(r){try{return!r.status&&location.protocol=="file:"||(r.status>=200&&r.status<300)||r.status==304||navigator.userAgent.indexOf("Safari")>=0&&typeof r.status=="undefined";}catch(e){}
return false;}
function httpData(r,type){var ct=r.getResponseHeader("content-type");if(options.type=="HEAD"&&options.header)
return options.header=="all"?r.getAllResponseHeaders():r.getResponseHeader(options.header);var data=!type&&ct&&ct.indexOf("xml")>=0;data=type=="xml"||data?r.responseXML:r.responseText;if(type=="script")eval.call(window,data);return options.customObj?{responseText:data,options:options.customObj}:data;}}};