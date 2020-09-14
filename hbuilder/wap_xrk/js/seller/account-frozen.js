
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
	
	//我的已冻结列表
	$.ajax({
		url: ApiUrl + '/index.php?act=service_store_cash_new&op=freezeCashDetail',
		type: 'get',
		data: {
			key: $key,
			cash_id: self.cashId,
			globalLoading: true
		},
		success: function(res){
			
			var data = JSON.parse(res);
			console.log("冻结详情***----"+data);
			console.log("冻结详情***----"+res);
			if(data.code === 200){
				var html = template.render('frozenTemplat', data.datas);
				$('.frozen').append(html);
				//总冻结金额
				$(".frozenTotalMoney").html(data.datas.freeze_cash_amount);
			}
		}
		
	})
	
})

