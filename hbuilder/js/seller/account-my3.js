
mui.init({
	swipeBack:true
});
//
mui.plusReady(function(){
	var self = plus.webview.currentWebview();
	console.log(self.cashId);
	var $key    =   _.userInfo.getKey();
//	var $key ="64f6185d0ce5ec17d1aed8a240e0d77c";
	console.log("key="+$key);
	
	//我的账户列表
	$.ajax({
		url: ApiUrl + '/index.php?act=service_store_cash_new&op=cashrecorddetail',
		type: 'get',
		data: {
			key: $key,
			cash_id: self.cashId,
			globalLoading: true
		},
		success: function(res){
			var data = JSON.parse(res);
			console.log("提现详情----"+res);
			var html = template.render('account-my3', data);
			$('.account-my3').append(html);
		}
		
	})
	
//	

})

