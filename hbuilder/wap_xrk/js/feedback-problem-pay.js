
mui.init({
	swipeBack:true
});
var self = null;
mui.plusReady(function(){
	self = plus.webview.currentWebview();
	//帮助与反馈的列表
	console.log("----我是----")
	console.log(self.type_id)
	console.log("----我是----")
	$.ajax({
		url:ApiUrl+"/index.php?act=help&op=help_list",
		type: 'get',
		data: {
			type_id: 101
		},
		success: function(res){
			var data = JSON.parse(res);
			console.log(res);
			var html = template.render('feedback2', data);
			$('.feedback-pay-list').append(html);
			

		}
	})

})

