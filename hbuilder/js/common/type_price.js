$(function() {
	mui.init({
		swipeBack: true
	});
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		$.ajax({
			url: ApiUrl + "/index.php?act=type&op=getTypeInfo",
			type: "GET",
			dataType: 'json',
			data: {
				type_id: self.type_id
			},
			success: function(res) {
				var price = '';
				if(res.code == '200') {
					price = HTMLDecode(res.datas.type_info.price);
				}
				$(".price-text").find("p").html(price);
			}
		})
	})
})