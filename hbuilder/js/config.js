var SiteUrl = "http://" + window.location.host + "/shop";
var ApiUrl = "http://test.hisunflower.com/mobile";
//var ApiUrl = "http://xrk.huazhenginfo.com/mobile";
//var ApiUrl = "http://www.hisunflower.com/mobile";
var pagesize = 10;
var global_plat = "app"; //可选值为app(发布app时使用),local(本地测试时使用，同时配置下面的本地目录),wap(线上wap版本)
var global_localPath = "xrkhbuild";
var WapSiteUrl = "http://" + window.location.host + "/wap";
var IOSSiteUrl = "http://" + window.location.host + "/app.ipa";
var AndroidSiteUrl = "http://" + window.location.host + "/app.apk";
var chatServerUrl = "http://jhmis.net:2120";
var bbsUrl = "http://bbs.hisunflower.com"
var global_debug = true;
//WapSiteUrl 在使用app模式或者本地模式的时候自动确定路径,在需要使用绝对路径的时候使用。
// auto url detection
(function() {
	if(global_plat == 'app') {
		//Hbuilder使用_www为页面根目录
		WapSiteUrl = '_www';
		//HBuilder 文件路径 file:///storage/emulated/0/Android/data/io.dcloud.HBuilder/.HBuilder/apps/HBuilder/www/index.html
		/*var m = /^(file?:\/\/.+)\/www/i.exec(location.href);
		if(m && m.length > 1) {
			WapSiteUrl = m[1] + '/www';
		}*/
	} else if(global_plat == 'local') {
		var patt = new RegExp('^(file?:\/\/.+)\/' + global_localPath, "i");
		var m = patt.exec(location.href);
		if(m && m.length > 1) {
			WapSiteUrl = m[1] + '/' + global_localPath;
		}
	} else {
		var m = /^(https?:\/\/.+)\/wap/i.exec(location.href);
		if(m && m.length > 1) {
			SiteUrl = m[1] + '/shop';
			ApiUrl = m[1] + '/mobile';
			WapSiteUrl = m[1] + '/wap';
		}
	}
})();