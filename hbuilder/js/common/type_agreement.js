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
				var agreement = '';
				if(res.code == '200') {
					agreement = HTMLDecode(res.datas.type_info.agreement);
				}
				$(".agreement-text").find("p").html(agreement);
			}
		})
	})
})