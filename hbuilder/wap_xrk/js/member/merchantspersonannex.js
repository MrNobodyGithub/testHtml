

var
	$organization_code_electronic,
	$general_taxpayer,
	$other_book,
	$person_code_organization;
var $userinfo = _.userInfo.get();
//填写form表单的action
$("form").attr("action",ApiUrl+"/index.php?act=upload_img&op=service_pic_add")
	//若验证失败，重新填写信息时将以前的信息带出
	//首先判断状态值，如果审核未通过则带入信息  否则  不带入信息
	$.ajax({
		type:"get",
		url:ApiUrl+"/index.php?act=check_join&op=check",
		data:{
			key:$userinfo.key
		},
		dataType:"json",
		success:function(res){
			console.log(res)
			if(res.datas.join_info.joinin_state==30){
				$.ajax({
					type:"get",
					url:ApiUrl+"/index.php?act=store_joinin&op=getstep2",
					data:{
						key:$userinfo.key
					},
					dataType:"json",
					success:function(res){
						console.log(JSON.stringify(res))
						if(res.datas.is_person==1){
							$(".img2").attr("src",res.datas.organization_code_electronic);
							$(".img3").attr("src",res.datas.general_taxpayer);
							$(".img4").attr("src",res.datas.person_code_organization);
							for(var i = 0;i<res.datas.other_book.length;i++){
								$(".addimgother1").before("<div class='active11'><img src = '" + res.datas.other_book[i] + "'><span class = 'del-img3'></span></div>")
							}
						}
					}
				})
			}
		}
	})





$(".merchantsperson-footer").find("a").find("button").on("click", function () {
	
	console.log($("#default_pic2").val())
	if($(".img2").attr("src") === '') {
			//alert('请选择文件');
			
			mui.confirm('请上传身份证正面');
			return false;
	}
	
	if($(".img3").attr("src") === '') {
			//alert('请选择文件');
			
			mui.confirm('请上传身份证反面');
			return false;
	}
	
	if($(".img4").attr("src") === '') {
			//alert('请选择文件');
			
			mui.confirm('请上传经营者手持身份证照')
			return false;
	}
	var str4 = "";
	for (var i = 0; i < $(".active11").length; i++) {
		str4 += $(".active11").eq(i).find("img").attr("src") + ","
		var $str2 = str4.substring(0, str4.length - 1)
		console.log($str2)
	}
	
	console.log(1)
	
	$.ajax({
		url: ApiUrl+"/index.php?act=store_joinin&op=step2",
		type: "GET",
		data: {
			key: $userinfo.key,
			is_person: 1,
            organization_code_electronic: $(".img2").attr("src"),//身份证正面
            general_taxpayer: $(".img3").attr("src"),//身份证反面
			person_code_organization: $(".img4").attr("src"),//手持身份证件照
            other_book: $str2//其他证书
		},
		success: function (res) {
			var data = $.parseJSON(res);
			console.log(res)
			if (data.code !== 200) {
				mui.confirm(data.datas.error)
			} else {
				//_.jump('merchantsthird3.html');
				 mui.openWindow({
				 	url: "merchantsthird3.html",
				 	createNew: false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显
				 	waiting: {
				 		autoShow: true,//自动显示等待框，默认为true
				 		title: '正在加载...'//等待对话框上显示的提示内
				 	}
				 })
			}
		}
	})


})

//正面照上传
$(".addimg2").on("change", function () {
	$(".loadingimg").show()
	$('#form2').submit();
	$(this).parent().css("background", "#fff")
})



$('#form2').ajaxForm({
	beforeSend: function () {
		if ($("#default_pic2").val() === '') {
			mui.confirm('请选择文件')
			//alert('请选择文件');
			return false;
		}
	},
	success: function () {
	},
	complete: function (xhr) {

		//upload_status.html(xhr.responseText);
		res = eval("(" + xhr.responseText + ")");
		console.log(res)
		
		if(res.code !== 200){
			mui.confirm(res.message)
			return false;
		}
		
		
		
				$(".loadingimg").hide();
		
		//$(".default").before("<div class='upload-moreimg'><img src = '"+data.datas.thumb_name+"'><span class = 'del-img1'></span></div>")
		$(".img2").attr("src", res.datas.file_path);
		$organization_code_electronic = res.datas.file_path
	}
});
//反面照上传
$(".addimg3").on("change", function () {
	$(".loadingimg").show()
	$('#form3').submit();
	$(this).parent().css("background", "#fff")
})



$('#form3').ajaxForm({
	beforeSend: function () {
		if ($("#default_pic3").val() === '') {
			mui.confirm('请选择文件')
			//alert('请选择文件');
			return false;
		}
	},
	success: function () {
	},
	complete: function (xhr) {
		$(".loadingimg").hide();
		//upload_status.html(xhr.responseText);
		res = eval("(" + xhr.responseText + ")");
		console.log(res)
		// if(res.code == 200){
		if(res.code !== 200){
			mui.confirm(res.message)
			return false;
		}	
			
				
		
		//$(".default").before("<div class='upload-moreimg'><img src = '"+data.datas.thumb_name+"'><span class = 'del-img1'></span></div>")
		$(".img3").attr("src", res.datas.file_path);
		$general_taxpayer = res.datas.file_path
	}
});

//手持身份证照上传
$(".addimg4").on("change", function () {
	$(".loadingimg").show()
	$('#form4').submit();
	$(this).parent().css("background", "#fff")
})



$('#form4').ajaxForm({
	beforeSend: function () {
		
		
		if(res.code !== 200){
			mui.confirm(res.message)
			return false;
		}
		
		if ($("#default_pic4").val() === '') {
			mui.confirm('请选择文件')
			//alert('请选择文件');
			return false;
		}
	},
	success: function () {
	},
	complete: function (xhr) {
$(".loadingimg").hide();
		//upload_status.html(xhr.responseText);
		res = eval("(" + xhr.responseText + ")");
		console.log(res)
		// if(res.code == 200){
			
			
				
		
		//$(".default").before("<div class='upload-moreimg'><img src = '"+data.datas.thumb_name+"'><span class = 'del-img1'></span></div>")
		$(".img4").attr("src", res.datas.file_path);
		$person_code_organization = res.datas.file_path
	}
});
//其他证明上传
/*$(".addimg5").on("change", function () {
	$('#form5').submit();
	$(this).parent().css("background", "#fff")
})

$('#form5').ajaxForm({
	beforeSend: function () {
		if ($("#default_pic5").val() === '') {
			alert('请选择文件');
			return false;
		}
	},
	success: function () {
	},
	complete: function (xhr) {

		//upload_status.html(xhr.responseText);
		res = eval("(" + xhr.responseText + ")");
		console.log(res)
		
		
		if(res.code !== 200){
			alert(res.message)
			return false;
		}
		
		if(res.code == 200){
			$(".loadingimg").show()
			setTimeout(function(){
				$(".loadingimg").hide();
			},3000)
		}
		//$(".default").before("<div class='upload-moreimg'><img src = '"+data.datas.thumb_name+"'><span class = 'del-img1'></span></div>")
		$(".img5").attr("src", res.datas.file_path);
		$other_book = res.datas.file_path
	}
});*/




//上传其他资质


$(".addimg7").on("change", function () {
	$(".loadingimg").show()
	$('#form7').submit();
})

$('#form7').ajaxForm({
	beforeSend: function () {
		if ($("#default_pic7").val() === '') {
			//alert('请选择文件');
			mui.confirm('请选择文件')
			return false;
		}
	},
	success: function () {
	},
	complete: function (xhr) {
		$(".loadingimg").hide();
		//upload_status.html(xhr.responseText);
		res = eval("(" + xhr.responseText + ")");
		console.log(res)
		
		if(res.code !== 200){
			mui.confirm(res.message)
			return false;
		}
		
		
		
				
		
		
		$(".addimgother1").before("<div class='active11'><img src = '" + res.datas.file_path + "'><span class = 'del-img3'></span></div>")
	}
});




$("body .merchantsenterlist3").on("click", ".del-img3", function(){
	//alert(22);
	var $this = $(this);
	var path = $(this).prev().attr('src');
	
	$.ajax({
		url: ApiUrl+"/index.php?act=upload_img&op=service_pic_del",
		type: "post",
		data: {
			pic_path: path
		},
		success: function (res) {
			var data = $.parseJSON(res);
			console.log(res)
			if (data.code !== 200) {
				mui.confirm(data.datas.error)
				
			} else {
				console.log($this.prev());
				$this.parent().fadeOut(function(){
					$(this).remove();
				});
			}
		}
	})

})



















