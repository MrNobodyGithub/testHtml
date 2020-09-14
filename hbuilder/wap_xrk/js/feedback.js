mui.init({
	swipeBack: true
});

var self = null;
mui.plusReady(function() {
	self = plus.webview.currentWebview();

	//帮助与反馈的列表
	$.ajax({
		url: ApiUrl + "/index.php?act=help&op=help_list",
		type: 'get',
		data: {
			type_id: 101
		},
		success: function(res) {
			var data = JSON.parse(res);
			console.log(data);
			var html = template.render('feedback', data);
			$('.feedback .notice').append(html);
			$(".feedback .notice li").on("tap", "a", function() {
				var index = $(this).parent().index();
				var len = $(this).parent().parent().children().length;
				console.log($(this).attr("data-feedback-id"));
				console.log(len);
				if(index != len - 1) {
					mui.openWindow({
						url: "feedback-notice-detail.html",
						id: "feedback-notice-detail",
						extras: {
							$helpId: $(this).attr("data-feedback-id")
						},
						waiting: {
							autoShow: true,
							title: "正在加载..."
						}
					})
				} else {
					mui.openWindow({
						url: "feedback-notice.html",
						id: "feedback-notice",
						extras: {
							type_id: $(this).attr("data-feedback-id")
						},
						waiting: {
							autoShow: true,
							title: "正在加载..."
						}
					})
				}

			})

		}
	})

	$(".problem li>a").on("tap", function() {
		var $type = $(this).find('span').attr("data-pay-id")
		console.log($type)
		$.ajax({
			type: "get",
			url: ApiUrl + "/index.php?act=help&op=help_list",
			data: {
				type_id: $type
			},
			success: function(res) {
				console.log(res);
				var $data = JSON.parse(res);
				if($data.code == 200) {
					console.log($type);
					mui.openWindow({
						url: "feedback-problem-pay.html",
						id: "feedback-problem-pay",
						extras: {
							type_id: $type
						},
						waiting: {
							autoShow: true,
							title: "正在加载..."

						}
					})
				}
			}
		})
	})
	//拨打电话
	$.ajax({
		type: "get",
		url: ApiUrl + "/index.php?act=zx_setting&op=getphone",
		async: true,
		dataType: 'json',
		success: function(res) {
			console.log(res.datas);
			$('.contact .kf').attr('href', 'tel:' + res.datas);
		}
	});
	$('#j_feedback').on('tap', function() {
		var key = _.userInfo.getKey();
		if(!key) {
			checkLogin(0);
			return;
		}
		mui.openWindow({
			url: "feedback-content.html",
			id: "feedback-content",
		})
	})
	$('#j_questions').on('tap',function(){
		mui.openWindow({
			url: "asked_questions.html",
			id: "asked_questions",
		})
	})
})