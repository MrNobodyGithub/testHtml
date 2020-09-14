mui.plusReady(function(){
        
  var self = plus.webview.currentWebview();
	console.log(self.orderId)	
	
	var $userinfo =  _.userInfo.get();
	console.log($userinfo.key)
	$.ajax({
		type:"get",
		url:ApiUrl+"/index.php?act=service_member_order&op=order_detail",
		data:{
			order_id:self.orderId,
			key:$userinfo.key
		},
		success:function(res){
			var data = JSON.parse(res)
			console.log(data)
			var html = template.render("order-detail",data)
			$(".customer-service").html(html)
		}
	});
})