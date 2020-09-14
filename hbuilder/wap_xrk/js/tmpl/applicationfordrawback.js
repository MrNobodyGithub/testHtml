var $key = _.userInfo.getKey();

//填写form表单的action
$("form").attr("action", ApiUrl + "/index.php?act=service_member_refund&op=upload_pic&key=" + $key);
//上传照片

$(".addimg7").on("change", function() {
	$(".loadingimg").show();
	$('#form7').submit();
})

$('#form7').ajaxForm({
	beforeSend: function() {
		if($("#default_pic7").val() === '') {
			//alert('请选择文件');
			mui.confirm('请选择文件');
			return false;
		}
	},
	success: function() {},
	complete: function(xhr) {
		//		$(".loadingimg").hide();
		//upload_status.html(xhr.responseText);
		res = eval("(" + xhr.responseText + ")");
		console.log(res)

		if(res.code !== 200) {
			mui.confirm(res.message);
			return false;
		}

		$(".addimgother1").before("<div class='active11'><img src = '" + res.datas.pic + "'></div>");
	}
});