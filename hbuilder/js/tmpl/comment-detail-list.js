//TODO 逐步改进，业务逻辑不要放在plusReady中。
mui.plusReady(function() {
	mui.plusReady(function() {
		var webview = plus.webview.currentWebview();
		var $goodsId = webview.$goodsId;
		var $key = _.userInfo.getKey();
		get_detail($goodsId);
		console.log($goodsId);
	})
	var $key = _.userInfo.getKey();
	get_detail();

	function get_detail(goodsId) {
		//首次为列表页传过来的goodsid，下次调用为规格点击的goodsid
		console.log(goodsId);
		$.ajax({
			url: ApiUrl + "/index.php?act=service_goods&op=goods_detail",
			type: 'get',
			dataType: 'json',
			data: {
				key: $key,
				goods_id: goodsId
			},
			beforeSend: function() {
				$("#loading").fadeIn();
			},
			success: function(data) {
				console.log(goodsId);
				console.log(JSON.stringify(data));				
				console.log(data.code);

				if(data.code == 200) {
					//	模板渲染=>填充值
					var $html = template.render("store_list", data);
					$(".store-list").html($html);
				}

			},
			error: function(error) {
				console.log('ajax调用异常');
			},
			complete: function() {
				$("#loading").fadeOut();
			}
		})

	}

})