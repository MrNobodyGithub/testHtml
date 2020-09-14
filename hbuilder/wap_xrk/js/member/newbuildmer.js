$(function() {
	var $userinfo = _.userInfo.get();
	var $storeinfo = _.storeInfo.get();
	//所有分类
	$.ajax({
		type: "get",
		url: ApiUrl + "/index.php?act=service_class",
		async: false,
		dataType: "json",
		success: function(result) {
			var html = template.render('comkind', result);
			$(".merchantsfirst-category-section").html(html);
		}

	});

	//判断以前是否入驻过  若入驻过   先选中

	//mobile/index.php?act=service_store&op=getStoreClass&store_id=3
	console.log("storeid----" + $storeinfo.storeId);
	var review = 0; //公共变量判断是否有新类目正在申请
	$.ajax({
		type: "get",
		url: ApiUrl + "/index.php?act=service_store&op=getApplyAndExamingStoreClass",
		dataType: "json",
		data: {
			store_id: $storeinfo.storeId
			//				store_id: 148
		},
		async: false,
		success: function(res) {
			if(res.code == 200) {
				for(var i = 0; i < $(".form-check").length; i++) {
					for(var x = 0; x < res.datas.length; x++) {
						//						console.log($(".form-check").eq(i).attr("data-id"));
						if($(".form-check").eq(i).attr("data-id") == res.datas[x].class_1) {
							if(res.datas[x].state == 0) {
								$(".form-check").eq(i).find("input").attr("type", "checkbox");
								$(".form-check").eq(i).find("input").attr("checked", "checked");
								$(".form-check").eq(i).find("input").attr("disabled", "disabled");
								$(".form-check").eq(i).css("background", "#e4e4e4");
								review = 1; //有类目正在申请
							} else if(res.datas[x].state == 1) {
								$(".form-check").eq(i).find("input").attr("type", "checkbox");
								$(".form-check").eq(i).find("input").attr("checked", "checked");
								$(".form-check").eq(i).find("input").attr("disabled", "disabled");
							}

						}
					}
				}
			}
		}
	});

	var $txt = [],
		$num = [];
	var num = ""
	$('.merchantsfirst-category-section').on('tap', '.form-check input[type="checkbox"]', function() {
		var $this = $(this);

		if(!$this.prop('checked')) {
			$num.push($this.parent().attr('data-id'));
			$txt.push($this.prev().text());
		} else {
			$num.remove($this.parent().attr('data-id'));
			$txt.remove($this.prev().text());
		}
		//console.log($num)
		console.log($num.join(","));
		num = $num.join(",");
	})

	var classId = $('input[type="radio"]:checked').attr("data-id");
	console.log('classId----' + classId);
	$(".icon-link").on("tap", function() {
		if(review == 1) {
			mui.alert('您有类目正在申请，请等待审核');
		} else {
			if($('input:radio[name="check6"]:checked').val()) {
				console.log("radio选中");
				mui.openWindow({
					url: "newbuildMerimg.html",
					id: "newbuildMerimg.html",
					createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显士
					extras: {
						classId: $('input[type="radio"]:checked').attr('data-id')
					},
					waiting: {
						autoShow: true, //自动显示等待框，默认为true
						title: '正在加载...' //等待对话框上显示的提示内
					}
				})
			} else {
				mui.alert("请选择新类目");
			}
			/*var btnArray = ['否', '是'];
		    mui.confirm('是否确定保存？', '', btnArray, function(e) {
		        if (e.index == 1) { 
		        	console.log('classId----'+classId);
		        	$.ajax({
						type:"get",
						url:ApiUrl+"/index.php?act=member_index&op=addserviceclass",
						data:{
							key:$userinfo.key,
							class_id:$('input[type="radio"]:checked').attr('data-id')
						},
						async: false,
						success:function(res){
							console.log(res)
							var data = $.parseJSON(res);
							if(data.code == 200){ 
								console.log('申请成功------'+res);
								mui.openWindow({
								 	url: "newbuildMerimg.html",
								 	createNew: false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显士
								 	extras:{
								    	classId:$('input[type="radio"]:checked').attr('data-id')
								    },
								 	waiting: {
								 		autoShow: true,//自动显示等待框，默认为true
								 		title: '正在加载...'//等待对话框上显示的提示内
								 	}
								 })
							}else{
								mui.toast(data.datas.error);
								return false;
							}
						}
					})
		        }
		    })*/
		}
	})
})