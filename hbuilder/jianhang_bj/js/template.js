!function(e){"use strict";var n=function(e,r){return n["string"==typeof r?"compile":"render"].apply(n,arguments)};n.version="2.0.3",n.openTag="<%",n.closeTag="%>",n.isEscape=!0,n.isCompress=!1,n.parser=null,n.render=function(e,r){var t=n.get(e)||i({id:e,name:"Render Error",message:"No Template"});return t(r)},n.compile=function(e,t){function a(r){try{return new s(r,e)+""}catch(o){return u?i(o)():n.compile(e,t,!0)(r)}}var c=arguments,u=c[2],l="anonymous";"string"!=typeof t&&(u=c[1],t=c[0],e=l);try{var s=o(e,t,u)}catch(p){return p.id=e||t,p.name="Syntax Error",i(p)}return a.prototype=s.prototype,a.toString=function(){return s.toString()},e!==l&&(r[e]=a),a};var r=n.cache={},t=n.helpers=function(){var e=function(n,r){return"string"!=typeof n&&(r=typeof n,"number"===r?n+="":n="function"===r?e(n.call(n)):""),n},r={"<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","&":"&#38;"},t=function(n){return e(n).replace(/&(?![\w#]+;)|[<>"']/g,function(e){return r[e]})},i=Array.isArray||function(e){return"[object Array]"==={}.toString.call(e)},o=function(e,n){if(i(e))for(var r=0,t=e.length;t>r;r++)n.call(e,e[r],r,e);else for(r in e)n.call(e,e[r],r)};return{$include:n.render,$string:e,$escape:t,$each:o}}();n.helper=function(e,n){t[e]=n},n.onerror=function(n){var r="Template Error\n\n";for(var t in n)r+="<"+t+">\n"+n[t]+"\n\n";e.console&&console.error(r)},n.get=function(t){var i;if(r.hasOwnProperty(t))i=r[t];else if("document"in e){var o=document.getElementById(t);if(o){var a=o.value||o.innerHTML;i=n.compile(t,a.replace(/^\s*|\s*$/g,""))}}return i};var i=function(e){return n.onerror(e),function(){return"{Template Error}"}},o=function(){var e=t.$each,r="break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",i=/\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|[\s\t\n]*\.[\s\t\n]*[$\w\.]+/g,o=/[^\w$]+/g,a=new RegExp(["\\b"+r.replace(/,/g,"\\b|\\b")+"\\b"].join("|"),"g"),c=/^\d[^,]*|,\d[^,]*/g,u=/^,+|,+$/g,l=function(e){return e.replace(i,"").replace(o,",").replace(a,"").replace(c,"").replace(u,"").split(/^$|,+/)};return function(r,i,o){function a(e){return m+=e.split(/\n/).length-1,n.isCompress&&(e=e.replace(/[\n\r\t\s]+/g," ").replace(/<!--.*?-->/g,"")),e&&(e=x[1]+p(e)+x[2]+"\n"),e}function c(e){var r=m;if($?e=$(e):o&&(e=e.replace(/\n/g,function(){return m++,"$line="+m+";"})),0===e.indexOf("=")){var i=!/^=[=#]/.test(e);if(e=e.replace(/^=[=#]?|[\s;]*$/g,""),i&&n.isEscape){var a=e.replace(/\s*\([^\)]+\)/,"");t.hasOwnProperty(a)||/^(include|print)$/.test(a)||(e="$escape("+e+")")}else e="$string("+e+")";e=x[1]+e+x[2]}return o&&(e="$line="+r+";"+e),u(e),e+"\n"}function u(n){n=l(n),e(n,function(e){y.hasOwnProperty(e)||(s(e),y[e]=!0)})}function s(e){var n;"print"===e?n=T:"include"===e?(v.$include=t.$include,n=O):(n="$data."+e,t.hasOwnProperty(e)&&(v[e]=t[e],n=0===e.indexOf("$")?"$helpers."+e:n+"===undefined?$helpers."+e+":"+n)),w+=e+"="+n+","}function p(e){return"'"+e.replace(/('|\\)/g,"\\$1").replace(/\r/g,"\\r").replace(/\n/g,"\\n")+"'"}var f=n.openTag,d=n.closeTag,$=n.parser,g=i,h="",m=1,y={$data:1,$id:1,$helpers:1,$out:1,$line:1},v={},w="var $helpers=this,"+(o?"$line=0,":""),b="".trim,x=b?["$out='';","$out+=",";","$out"]:["$out=[];","$out.push(",");","$out.join('')"],E=b?"$out+=$text;return $text;":"$out.push($text);",T="function($text){"+E+"}",O="function(id,data){data=data||$data;var $text=$helpers.$include(id,data,$id);"+E+"}";e(g.split(f),function(e){e=e.split(d);var n=e[0],r=e[1];1===e.length?h+=a(n):(h+=c(n),r&&(h+=a(r)))}),g=h,o&&(g="try{"+g+"}catch(e){"+"throw {"+"id:$id,"+"name:'Render Error',"+"message:e.message,"+"line:$line,"+"source:"+p(i)+".split(/\\n/)[$line-1].replace(/^[\\s\\t]+/,'')"+"};"+"}"),g=w+x[0]+g+"return new String("+x[3]+");";try{var S=new Function("$data","$id",g);return S.prototype=v,S}catch(P){throw P.temp="function anonymous($data,$id) {"+g+"}",P}}}();"function"==typeof define?define(function(){return n}):"undefined"!=typeof exports&&(module.exports=n),e.template=n}(this);

template.helper("formatDate", function(date, fmt) {
	date = date == undefined ? new Date() : date;
	date = typeof date == 'number' ? new Date(date*1000) : date;
	date = typeof date == 'string' ? new Date(parseInt(date)*1000) : date;
	fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
	var obj = {
		'y': date.getFullYear(), // 年份，注意必须用getFullYear
		'M': date.getMonth() + 1, // 月份，注意是从0-11
		'd': date.getDate(), // 日期
		'q': Math.floor((date.getMonth() + 3) / 3), // 季度
		'w': date.getDay(), // 星期，注意是0-6
		'H': date.getHours(), // 24小时制
		'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
		'm': date.getMinutes(), // 分钟
		's': date.getSeconds(), // 秒
		'S': date.getMilliseconds() // 毫秒
	};
	var week = ['天', '一', '二', '三', '四', '五', '六'];
	for(var i in obj) {
		fmt = fmt.replace(new RegExp(i + '+', 'g'), function(m) {
			var val = obj[i] + '';
			if(i == 'w') return(m.length > 2 ? '星期' : '周') + week[val];
			for(var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
			return m.length == 1 ? val : val.substring(val.length - m.length);
		});
	}
	return fmt;
});