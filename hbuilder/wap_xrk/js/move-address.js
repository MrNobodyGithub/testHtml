// 省市dom创建
function createCity(){
	$.ajax({
		url: ApiUrl+"/index.php?act=area&op=area_list",
		type: "GET",
		success: function(res){
			var data = $.parseJSON(res);
			var html = template.render('regison', data);
			$(".regionchose-leftlist").html(html);
			$(".regionchose-leftlist").find('a').eq(0).addClass('active3');
		}
	})
	$.ajax({
		url: ApiUrl+"/index.php?act=area&op=area_list_arr",
		type: "GET",
		success: function(res){
			var data = $.parseJSON(res);
			var html2 = template.render('regison2', data);
			$(".regionchose-rightlist").html(html2);
			$('.regionchose-rightlist dl').eq(0).show();
			$(".regionchose-rightlist").find("dl").find("dd").find("ol").on("click", "li",function(){
				$(".regionchose-rightlist").find("dl").find("dd").find("ol").find("li").removeClass('active4');
				if($(this).hasClass("active4")){
					$(this).removeClass("active4")
				}else{
					$(".regionchose-rightlist").find("dl").find("dd").find("ol").removeClass('active4');
					$(this).addClass("active4").siblings().removeClass('active4');
				}
			})
			
			
		}
	})
}
			
				createCity();
			
			mui.init({
				swipeBack:true
			});
			createCity();
			mui.plusReady(function(){})
				//各种类型页面切换  
				
			
			
			// 城市展开
	$('.page-city').on('click','.regionchose-leftlist a',function(){
		var $this = $(this);

		$this.addClass('active3').siblings().removeClass('active3');
		$('.regionchose-rightlist dl').eq($this.index()).fadeIn().siblings('dl').hide();
	});

	$('.page-city .icon-back').on('click',function(){
		$('.page-city').hide().prev('.page-form').show();
	})

	// 选择城市
	$('.cityadd').on("click", function () {

		var $this = $(this);

		$('.page-city').fadeIn().siblings('.page-form').hide();

	})

	$('.merchantsthird-footer').on('click', function () {

		var cityStr = '';

		for (var i = 0; i < $('.page-city .active4').length; i++) {
			cityStr += $.trim($('.page-city .active4').eq(i).text()) + ',';
		}
		var $str = cityStr.substring(0, cityStr.length - 1);
		$('.page-city').hide().prev().show();
		$('.cityadd').val($str);
		console.log(cityStr);

	})
			
			
			//点击保存
			var $userinfo =  _.userInfo.get();
			$(".btn-yellow").on("tap",function(){
				
				//检查电话
				function checkPhone(str) {
		            var phone = /^(([0-9]{2,3})|([0-9]{3}-))?((0[0-9]{2,3})|0[0-9]{2,3}-)?[1-9][0-9]{6,7}(-[0-9]{1,4})?$/;
		            var mobile = /^1[0-9]{10}$/;
		            if (phone.test(str) || mobile.test(str)) {
		                return true;
		            } else  {
		                return false;
		            }
		        }
				
				
				
				
				
				
				if($(".addman").val() == ""){
					mui.confirm("请填写联系人");
					return false;
				}
				
				var telinput = $('.addtel').val();
	            if (telinput == "" ) {
	                mui.confirm("请输入联系方式");
	                return false;
	            } else {
	                if (!checkPhone(telinput)) {
	                    mui.confirm("请输入有效的联系电话");
	                    return false;
	                }
	            }
				
				
				
				
				if($(".cityadd").val()==""){
					mui.confirm("请填写区域地址");
					return false;
				}
				if($(".detailadd").val() == ""){
					mui.confirm("请填写详细信息");
					return false;
				}
				
				if(!$(".addcheck").is(':checked')){
					$.ajax({
						type:"post",
						url:ApiUrl+"/index.php?act=member_address&op=address_add",
						data:{
							key:$userinfo.key,
							//member_id:
							true_name:$(".addman").val(),
							area_info:$(".cityadd").val(),
							address:$(".detailadd").val(),
							mob_phone:$(".addtel").val(),
							is_default:0
						},
						success:function(res){
							mui.openWindow({
							    url:"move-addresslist.html",
							    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显
							    waiting:{
							      autoShow:true,//自动显示等待框，默认为true
							      title:'正在加载...'//等待对话框上显示的提示内
							    }
							})
						}
					});
				}else{
					$.ajax({
						type:"post",
						url:ApiUrl+"/index.php?act=member_address&op=address_add",
						data:{
							key:$userinfo.key,
							//member_id:
							true_name:$(".addman").val(),
							area_info:$(".detailadd").val(),
							address:$(".detailadd").val(),
							mob_phone:$(".addtel").val(),
							is_default:1
						},
						success:function(res){
							mui.openWindow({
							    url:"move-addresslist.html",
							    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显
							    waiting:{
							      autoShow:true,//自动显示等待框，默认为true
							      title:'正在加载...'//等待对话框上显示的提示内
							    }
							})
						}
					});
				}

			})
			