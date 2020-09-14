
mui.init({
	swipeBack:true
});

mui.plusReady(function(){
	self = plus.webview.currentWebview();
	//文章内容
	$.ajax({
		url:ApiUrl+"/index.php?act=help&op=help_list",
		type: 'get',
		data: {
			type_id: 101
		},
		success: function(res){
			var data = JSON.parse(res);
			console.log(data);
			var html = template.render('feedback', data);
			$('.feedback-notice .notice-list').html(html);
			
			$(".feedback-notice  li").on("tap","a", function(){
				mui.openWindow({
					url: "feedback-notice-detail.html",
					id: "feedback-notice-detail",
					extras: {
						$helpId: $(this).attr("data-help-id")
					},
					waiting: { 
						autoShow: true,
						title: "正在加载..."
					}
				})
			})
		}
	})

})

