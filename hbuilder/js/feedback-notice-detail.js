
mui.init({
	swipeBack:true
});

mui.plusReady(function(){
	self = plus.webview.currentWebview();
	//文章内容
	$.ajax({
		url:ApiUrl+"/index.php?act=help&op=help_show",
		type: 'get',
		data: {
			help_id:self.$helpId 
		},
		success: function(res){
			var data = JSON.parse(res);
			console.log(data);
			var html = '<h3>'+data.datas.help_title+'</h3><article>'+data.datas.help_info+'</article>';
			$('.feedback-notice-detail').append(html);
		}
	})

})

