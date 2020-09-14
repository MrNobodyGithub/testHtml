var $business_licence_number_elc,
	$organization_code_electronic,
	$general_taxpayer,
	$other_book,
	$company_apply_book,
	$person_code_organization;

var str = "";
var str4 = ""
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
						if(res.datas.is_person==0){
							$(".img1").attr("src",res.datas.business_licence_number_elc );
							$(".img2").attr("src",res.datas.organization_code_electronic);
							$(".img3").attr("src",res.datas.general_taxpayer);
							$(".img4").attr("src",res.datas.person_code_organization);
							for(var i = 0;i<res.datas.other_book.length;i++){
								$(".addimgother1").before("<div class='active11'><img src = '" + res.datas.other_book[i] + "'><span class = 'del-img3'></span></div>")
							}
							
							for(var i = 0;i<res.datas.company_apply_book.length;i++){
								$(".addimgother").before("<div class='active10'><img src = '" + res.datas.company_apply_book[i] + "'><span class = 'del-img2'></span></div>")
							}
						}
					}
				})
			}
		}
	})






$(".merchantsenter-footer").find("a").find("button").on("click", function () {
	
	if($(".img1").attr("src") === '') {
			mui.confirm('请上传营业证照片');
			return false;
	}
	
	if($(".img2").attr("src") === '') {
			mui.confirm('请上传身份证正面');
			return false;
	}
	
	if($(".img3").attr("src") === '') {
			mui.confirm('请上传身份证反面');
			return false;
	}
	
	if($(".img4").attr("src") === '') {
			mui.confirm('请上传经营者手持身份证照');
			return false;
	}
	
	
	
	
	for (var i = 0; i < $(".active10").length; i++) {
		str += $(".active10").eq(i).find("img").attr("src") + ","
		var $str = str.substring(0, str.length - 1)
		console.log($str)
	}
	for (var i = 0; i < $(".active11").length; i++) {
		str4 += $(".active11").eq(i).find("img").attr("src") + ","
		var $str2 = str4.substring(0, str4.length - 1)
		console.log($str2)
	}
	
	
	
	
	
	$.ajax({
		url: ApiUrl+"/index.php?act=store_joinin&op=step2",
		type: "GET",
		data: {
			key: $userinfo.key,
			is_person: 0,
			business_licence_number_elc: $(".img1").attr("src"),//营业执照
			organization_code_electronic: $(".img2").attr("src"),//身份证正面
			general_taxpayer: $(".img3").attr("src"),//身份证反面
			person_code_organization: $(".img4").attr("src"),//手持身份证件照
			company_apply_book: $str,//公司授权书,多张图片用英文逗号 隔开
			other_book: $str2,//其他证书
		},
		success: function (res) {
			var data = $.parseJSON(res);
			console.log(res)
			if (data.code !== 200) {
				mui.confirm(data.datas.error);
			} else {
				//_.jump('merchantsthird.html');
				mui.openWindow({
					url: 'merchantsthird.html',
					//id: 'appoint',
					waiting: {
						autoShow: true,
						title: '正在加载...'
					}
				
				})
			}
		}
	})

})

 
 
/*function ProcessFile3( e ) { 
	var file = document.getElementsByClassName('addimg3')[0].files[0];
   // console.log(file)
	if (file) {
		var reader = new FileReader();
		reader.onload = function ( event ) { 
			var txt3 = event.target.result;
			$(".img3").attr("src",txt3)
			 var $pic_name= $(".addimg3").val().substring(12)
			$.ajax({
				url: "http://xrk.huazhenginfo.com/mobile/index.php?act=upload_img&op=service_base64_add",
				type: "POST",
				data:{
					pic_name:$pic_name,
					base64:txt3
				},
				success: function(res){
				var data = $.parseJSON( res );
					console.log(res);
					$general_taxpayer=data.datas.file_path
				}
			})
		};
	}
	reader.readAsDataURL( file );
}
function contentLoaded3 () {
	document.getElementsByClassName('addimg3')[0].addEventListener( 'change' ,ProcessFile3 , false );
}
window.addEventListener( "DOMContentLoaded" , contentLoaded3 , false );
 
function ProcessFile4( e ) { 
	var file = document.getElementsByClassName('addimg4')[0].files[0];
	//console.log(file)
	if (file) {
		var reader = new FileReader();
		reader.onload = function ( event ) { 
			var txt4 = event.target.result;
			$(".img4").attr("src",txt4)
			 var $pic_name= $(".addimg4").val().substring(12)
			$.ajax({
				url: "http://xrk.huazhenginfo.com/mobile/index.php?act=upload_img&op=service_base64_add",
				type: "POST",
				data:{
					pic_name:$pic_name,
					base64:txt4
				},
				success: function(res){
				var data = $.parseJSON( res );
					console.log(res);
					$person_code_organization=data.datas.file_path
				}
			})
		};
	}
	reader.readAsDataURL( file );
}
function contentLoaded4 () {
	document.getElementsByClassName('addimg4')[0].addEventListener( 'change' ,ProcessFile4 , false );
}
window.addEventListener( "DOMContentLoaded" , contentLoaded4 , false );
 
function ProcessFile5( e ) { 
	var file = document.getElementsByClassName('addimg5')[0].files[0];
	//console.log(file)
	if (file) {
		var reader = new FileReader();
		reader.onload = function ( event ) { 
			var txt5 = event.target.result;
			$(".img5").attr("src",txt5)
			 var $pic_name= $(".addimg5").val().substring(12)
			$.ajax({
				url: "http://xrk.huazhenginfo.com/mobile/index.php?act=upload_img&op=service_base64_add",
				type: "POST",
				data:{
					pic_name:$pic_name,
					base64:txt5
				},
				success: function(res){
				var data = $.parseJSON( res );
					console.log(res);
					$other_book=data.datas.file_path
				}
			})
		};
	}
	reader.readAsDataURL( file );
}
function contentLoaded5 () {
	document.getElementsByClassName('addimg5')[0].addEventListener( 'change' ,ProcessFile5 , false );
}
window.addEventListener( "DOMContentLoaded" , contentLoaded5 , false );*/



//营业执照图片变换
$(".addimg1").on("change", function () {
	$(".loadingimg").show()
	$('#form1').submit();
	$(this).parent().css("background", "#fff")
})



$('#form1').ajaxForm({
	beforeSend: function () {
		if ($("#default_pic1").val() == '') {
			mui.confirm("请选择文件")
			return false;
		}
	},
	success: function () {
	},
	complete: function (xhr) {
		$(".loadingimg").hide();
		//upload_status.html(xhr.responseText);
		res = eval("(" + xhr.responseText + ")");
		console.log(res.code)
		if(res.code !== 200){
			mui.confirm(res.message)
			return false;
		}

		//$(".default").before("<div class='upload-moreimg'><img src = '"+data.datas.thumb_name+"'><span class = 'del-img1'></span></div>")
		$(".img1").attr("src", res.datas.file_path);
		$business_licence_number_elc = res.datas.file_path
	}

});

//正面照上传
$(".addimg2").on("change", function () {
	$(".loadingimg").show()
	$('#form2').submit();

	$(this).parent().css("background", "#fff")
})



$('#form2').ajaxForm({
	beforeSend: function () {
		if ($("#default_pic2").val() === '') {
			mui.confirm("请选择文件")
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
			mui.confirm("请选择文件")
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
		if ($("#default_pic4").val() === '') {
			//alert('请选择文件');
			//mui.alert("请选择文件")
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
//公司授权书&许可资质证明



$(".addimg6").on("change", function () {
	$(".loadingimg").show()
	$('#form6').submit();
})

$('#form6').ajaxForm({
	beforeSend: function () {
		if ($("#default_pic6").val() === '') {
			mui.confirm("请选择文件")
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
		
		
		
			
		
		
		$(".addimgother").before("<div class='active10'><img src = '" + res.datas.file_path + "'><span class = 'del-img2'></span></div>")
	}
});




//上传其他资质

$(".addimg7").on("change", function () {
	$(".loadingimg").show()
	$('#form7').submit();
})

$('#form7').ajaxForm({
	beforeSend: function () {
		if ($("#default_pic7").val() === '') {
			mui.confirm("请选择文件")
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



















//
var $storeinfo = _.storeInfo.get();

$("body").on("click", ".del-img2", function () {
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





setTimeout(function(){
	
},1000)

$("body").on("click", ".del-img3", function(){
	
	console.log(1)
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








