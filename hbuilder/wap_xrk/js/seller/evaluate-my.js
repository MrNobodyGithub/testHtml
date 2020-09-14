mui.init();
mui.plusReady(function(){
	var self = plus.webview.currentWebview();
	
	//获取店铺星级评分
	$.ajax({
		type:"get",
		url:ApiUrl + "/index.php?act=store&op=service_evallist",
		async:true,
		dataType: 'json',
		data: {
			store_id: self.store_id
		},
		success: function(res){
			console.log(res);
			
			var info = template.render('store_commentinfo', res);
			
//			var	list = template.render('store_commentlist', res);
				
			$('.evaluate').append(info);
//			$('.evaluate .evaluate-my-content').html(list);
			
			//获取好中差	平列表
			$('.evaluate menu').on('tap', 'a', function(){
				plus.nativeUI.showWaiting();
				$(this).addClass('active').siblings().removeClass('active');
				var $type = $(this).attr('data-type');
				console.log($type);
				$.ajax({
					type:"get",
					url:ApiUrl + "/index.php?act=store&op=store_goods_evlist",
					async:true,
					dataType: "json",
					data: {
						store_id: self.store_id,
						type: $type
					},
					success: function(res){
						console.log(JSON.stringify(res));
						
						var list = template.render('store_commentlist', res);
						$('.evaluate .evaluate-my-content').html(list);
						plus.nativeUI.closeWaiting();
					}
				});
			})
		}
	});
	
})
