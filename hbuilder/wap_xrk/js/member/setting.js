$(function() {
	mui.init({
		swipeBack: true
	})
	var $key = _.userInfo.getKey();
	var $userInfo = _.userInfo.get();
	var $client = 'wap';
	//获取版本号，使用本地版本号，在这里应该有调用服务器版本号，处理升级
	mui.plusReady(function() {
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			$("input[name='version']").val(inf.version);
		});
		$client = plus.os.name.toLowerCase();
	})
	
	$('.change-word').on('tap', function() {
		mui.openWindow({
			url: 'modifyPassword.html',
			id: 'modifyPassword',
			waiting: {
				autoShow: true
			}
		})
	})

	$(".newAbout").on('tap', function() {
		mui.openWindow({
			url: 'aboutus.html',
			id: 'aboutus',
			waiting: {
				autoShow: true,
				title: '正在加载...'
			}
		})
	})

	//	退出登录
	$('.configa').on('tap', function() {
		//TODO 登录，退出使用的client类型都是wap,这里应该根据实际类型传递
		var btnArray = ['确定', '取消'];
		mui.confirm('确认退出？', '', btnArray, function(e) {
			if(e.index == 1) {
				return false;
			} else if(e.index == 0) {
				data = {
						key:$key,
						client:$client
					}
				console.log(parseParam(data));
				$.ajax({
					type: 'POST',
					url: ApiUrl + "/index.php?act=logout",
					data: data,
					dataType: 'json',
					success: function(data) {
						console.log(JSON.stringify(data));
						//暂时不判断服务器返回状态，直接操作
						_.ST.cls();
						//找到首页，执行关闭通讯服务js
						var indexpage = plus.webview.getLaunchWebview();
						indexpage && mui.fire(indexpage, 'disConnect_chatServer');
						_.openWindow({
							url: 'login.html',
							id: 'login',
							reOpen: true,
							closeOthers: true
						})
					},
					error:function(){
						mui.toast('退出失败');
					}
				})
			}
		})
	})

})