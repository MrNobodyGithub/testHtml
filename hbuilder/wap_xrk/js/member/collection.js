//
//	获取收藏列表
//	

var $templet = '';
console.log(_.userInfo.getKey());

$.ajax({
	type: 'get',
	url: ApiUrl + "/index.php?act=member_favorites&op=favorites_list",
	dataType: 'json',
	data: {
		key: _.userInfo.getKey()
	},
	success: function(data) {
		console.log(JSON.stringify(data));
		if(data.code == 200 && data.datas != null) {
			$('.layout').append(template('collection1', data));
			if(data.datas.favorites_list.length >= 1) {
				$templet = data.datas.favorites_list[0].extend.app_detail_templet;
				console.log("collection---"+$templet);
			}
		}
	},
	error: function(err) {
		console.log(err);
	}
})

//	取消收藏
$('.mui-content').on('tap', '.product-item .control a', function() {

	var
		$this = $(this),
		$goodsId = $this.parents('.mark').attr('data-id');

	$.ajax({
		url: ApiUrl + "/index.php?act=member_favorites&op=favorites_del",
		type: 'post',
		dataType: 'json',
		data: {
			key: _.userInfo.getKey(),
			fav_id: $goodsId
		},
		success: function(data) {
			console.log(data);
			if(data.code == 200) {
				$this.parents('.mark').slideUp(function() {
					$(this).remove();
				})
			}
		}
	})

})

//	跳详情页
$('.mui-content').on('tap', '.product-item img , h2, .raty, .label, .tdesc', function() {

	//	获取gc_id goodsId 根据goodsId跳详情页 根据gc_id决定模板
	//
	var
		$this = $(this).parents('.product-item'),
		$gcId = $this.attr('data-gc'),
		$tmpl = $this.attr('data-tmpl'),
		$goodsId = $this.attr('data-id');

	$.ajax({
		url: ApiUrl + "/index.php?act=service_goods&op=goods_detail",
		type: 'get',
		dataType: 'json',
		data: {
			goods_id: $goodsId
		},
		success: function(data) {
			console.log(data);
			if(data.code == 200) {
				mui.openWindow({
					url: "../common-detail.html",
					id: $templet,
					extras: {
						goodsId: $goodsId
					},
					waiting: {
						autoShow: true
					}
				})
			} else {
				alert(data.datas.err);
				console.log('虽然接口通了 但是你请求的参数可能有问题。');
			}
		}
	})

})