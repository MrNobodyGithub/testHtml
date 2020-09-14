mui.init({
	swipeBack: true
});
//
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	console.log(self.cashId);
	var $key = _.userInfo.getKey();
	//	var $key ="64f6185d0ce5ec17d1aed8a240e0d77c";
	console.log("key=" + $key);

	//我的账户列表
	$.ajax({
		url: ApiUrl + '/index.php?act=service_store_cash_new&op=cashrecorddetail',
		type: 'get',
		async: false,
		data: {
			key: $key,
			cash_id: self.cashId,
			globalLoading: true
		},
		success: function(res) {
			var data = JSON.parse(res);
			console.log("提现失败详情----" + res);
			var html = template.render('failTemplat', data);
			var failReason = data.datas.record[0].fail_reason; //错误提示
			var member_id = data.datas.record[0].member_id;
			$('.account-my3').append(html);
			//弹出层
			$(".failReason").html("由于您的:  \“ " + failReason + " \” ,致使提现失败,请您重新提交资料申请。");
			$('#cash-fail .close').on('tap', 'img', function() {
				$('#cash-fail').fadeOut();
			})
			//单击重新提交按钮
			$('.resubmit').on('tap', function() {
				var str = "您确定已解决 \“" + data.datas.record[0].fail_reason + "\”问题?";
				mui.confirm(str, "温馨提示:", null, function(e) {
					//单击确认，
					if(e.index == 1) {
						$.ajax({
							type: "post",
							url: ApiUrl + '/index.php?act=service_store_cash_new&op=recash',
							async: true,
							data: {
								key: $key,
								cash_id: self.cashId,
								member_id: member_id,
								globalLoading: true
							},
							success: function(res) {
//								console.log("res"+res);
								var res = JSON.parse(res);
								console.log("res"+res);
								if(200 === res.code){
									mui.toast(res.datas.message);
					                    var wobj = plus.webview.getWebviewById("my-account");//注意 my-account 是   account-my1.html 的 ID  你如果1.html 有ID   要替换掉HBuilder，  
//					                    wobj.show();
					                    wobj.reload(true);
//									})
									//关闭当前页面
									mui.currentWebview.close();
								}else {
									$("#cash-fail").css("display","block");
								}
							}
						});
						//单击取消
					} else {
						mui.toast("您取消了提现操作");
						return false;
					}
				})
			})
		}

	})
})

