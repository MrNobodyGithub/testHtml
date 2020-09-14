
mui.init({
	swipeBack:true
});
//
//mui.plusReady(function(){
//	self = plus.webview.currentWebview();
	var $key    =   _.userInfo.getKey();
//	var $key ="64f6185d0ce5ec17d1aed8a240e0d77c";
	//获取体现订单列表
	 $.ajax({
	 	type:"get",
	 	url:ApiUrl+"/index.php?act=service_store_cash_new&op=cashdetail",
	 	async:true,
	 	data: {
	 		key: $key,
	 		globalLoading: true
	 	},
	 	success: function(res){
	 		var data = JSON.parse(res);
	 		console.log(data);
	 		 var html = template.render("account-my2", data);
	 		 $(".account").append(html);
	 		console.log(res);
	 		
	 		 //点击提现
	 		 console.log($key);
			$(".footer-btn .btn-orange1").on("tap", function(){
				$.ajax({
					type:"get",
					url:ApiUrl+"/index.php?act=service_store_cash_new&op=cash",
					async:true,
					data: {
						key: $key
					},
					dataType: "json",
					success: function(res){
						console.log(JSON.stringify(res));
						if(res.code == '200'){
							mui.alert("提现成功,等待审核");
							mui.openWindow({
								url: "account-my1.html",
								id: "account1",
								waiting: {
									autoShow: true,
									title: "正在加载..."
								}
							})
						}
						if(res.code == '400'){
							mui.alert('提现失败');
							mui.openWindow({
		                     url: "bank-card.html",
		                     waiting: {
									autoShow: true,
									title: "正在加载..."
								}
							})
						}
						if(res.code == '420'){
							mui.alert("银行卡信息不完整");
							mui.openWindow({
		                     url: "bank-card.html",
		                     waiting: {
									autoShow: true,
									title: "正在加载..."
								}
							})
						}
						
					}
				});
			})
	 	}
	 });
	

