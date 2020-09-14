$(function() {
	//获取验证码
	_.getConfirmmsg();
	
	$('#submit_btn').on('tap', function() {
		var member_name = $('#tel_number').val();
		console.log(member_name);
		var $vcode = $('#confirm').val();
		console.log($vcode);
		console.log(_.userInfo.getKey());
		// 非空验证
		if(member_name == '' || $vcode == '') {
			mui.toast('请将信息填写完整');
			return false;
		}
		$.ajax({
			type: 'post',
			url: ApiUrl + '/index.php?act=service_store_account&op=account_save',
			data: {
				key: _.userInfo.getKey(),
				member_name: member_name,
				vcode: $vcode
			},
			success: function(res) {
				console.log(res);
				var data = $.parseJSON(res);
				if(data.code == 200) {
					mui.toast(data.datas.message);
					_.openWindow({
						url: "../seller/seller.html",
						id: _.pageName.seller,
						reOpen: true
					})
				} else {
					mui.toast(data.datas.error);
				}
			}
		});
	});

});