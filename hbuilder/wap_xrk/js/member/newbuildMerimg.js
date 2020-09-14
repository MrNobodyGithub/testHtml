var
	$organization_code_electronic,
	$general_taxpayer,
	$other_book,
	$person_code_organization;
var $userinfo = _.userInfo.get();
var $storeinfo = _.storeInfo.get();

//填写form表单的action
$("form").attr("action", ApiUrl + "/index.php?act=upload_img&op=service_pic_add");

//判断商家入驻0、个人入驻1
var $html = template.render("certificate", {
	is_person: $storeinfo.is_person
});
$(".merchantsdetails-section").html($html);

mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	console.log(self);
	console.log(self.classId);

	$(".merchantsperson-footer").find("a").find("button").on("click", function() {

		//循环查找img的 src
		var str4 = "";
		for(var i = 0; i < $(".active11").length; i++) {
			var imgSrc = $(".active11").eq(i).find("img").attr("src");
			if(str4.indexOf(imgSrc) == -1) {
				str4 += imgSrc + ",";
				var $str2 = str4.substring(0, str4.length - 1)
				console.log($str2)
			}
		}
		//点击

		var btnArray = ['否', '是'];
		mui.confirm('是否确定保存？', '', btnArray, function(e) {
			if(e.index == 1) {
				var datas = {
					key: $userinfo.key,
					images: $str2,
					class_id: self.classId
				};
				console.log("---------" + JSON.stringify(datas));
				$.ajax({
					url: ApiUrl + "/index.php?act=member_index&op=addserviceclass",
					type: "post",
					data: datas,
					success: function(res) {
						var data = $.parseJSON(res);
						console.log(res)
						if(data.code !== 200) {
							mui.toast(data.datas.error)
						} else {
							mui.toast("申请新类目成功，请等待审核");
							//							mui.openWindow({
							//								url: "member.html",
							//								createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显
							//								waiting: {
							////									autoShow: true, //自动显示等待框，默认为true
							////									title: '正在加载...' //等待对话框上显示的提示内
							//								}
							//							})
							_.openWindow({
								url: "member.html",
								id: _.pageName.member,
								reOpen: true
							})
							
							//关闭服务新类目申请和上传个人信息页面
							setTimeout(function() {
								var wv1 = plus.webview.getWebviewById('newbuildmer');
								var wv2 = plus.webview.getWebviewById('newbuildMerimg.html');
								wv1.close();
								wv2.close();
							}, 2000)

						}
					},
					error: function(xrk) {
						console.log(xrk);
					}
				})
			} else {
				return false
			}
		})
	})

});

//上传其他资质

$(".addimg7").on("change", function() {
	$(".loadingimg").show()
	$('#form7').submit();
})

$('#form7').ajaxForm({
	beforeSend: function() {
		if($("#default_pic7").val() === '') {
			//alert('请选择文件');
			mui.toast('请选择文件')
			return false;
		}
	},
	success: function() {},
	complete: function(xhr) {
		$(".loadingimg").hide();
		//upload_status.html(xhr.responseText);
		res = eval("(" + xhr.responseText + ")");
		console.log(res)

		if(res.code !== 200) {
			mui.toast(res.message)
			return false;
		}

		$(".addimgother1").before("<div class='active11'><img src = '" + res.datas.file_path + "'><span class = 'del-img3'></span></div>")
	}
});

$("body .merchantsenterlist3").on("click", ".del-img3", function() {
	//alert(22);
	var $this = $(this);
	var path = $(this).prev().attr('src');

	$.ajax({
		url: ApiUrl + "/index.php?act=upload_img&op=service_pic_del",
		type: "post",
		data: {
			pic_path: path
		},
		success: function(res) {
			var data = $.parseJSON(res);
			console.log(res)
			if(data.code !== 200) {
				mui.toast(data.datas.error)

			} else {
				console.log($this.prev());
				$this.parent().fadeOut(function() {
					$(this).remove();
				});
			}
		}
	})

})