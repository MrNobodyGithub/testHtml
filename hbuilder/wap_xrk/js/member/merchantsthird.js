$(function () {
	
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
				//console.log(res)
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
	// 城市展开
	$('.page-city').on('click','.regionchose-leftlist a',function(){
		var $this = $(this);

		$this.addClass('active3').siblings().removeClass('active3');
		$('.regionchose-rightlist dl').eq($this.index()).fadeIn().siblings('dl').hide();
	});

	$('.page-city .icon-back').on('click',function(){
		$('.page-city').hide().prev('.page-money').show();
	})
	// 跳转选择城市页面
	$('.bankcity').on("click", function () {
		var $this = $(this);
		$('.page-city').fadeIn().siblings('.page-money').hide();

	})
	//点击保存
	$('.page-city').on('click',".merchantsthird-footer" ,function () {

		var cityStr = '';

		for (var i = 0; i < $('.page-city .active4').length; i++) {
			cityStr += $.trim($('.page-city .active4').eq(i).text()) + ',';
		}
		var $str = cityStr.substring(0, cityStr.length - 1);
		$('.page-city').hide().prev().show();
		var $str2 = $(".active3").text()
		$('input[name="bankcity"]').val($str);
		console.log($str2)
		var city_id = $(".active4").attr("city_id");
		var area_id = $(".active3").attr("area_id");
		$(".bankcity").attr("city_id",city_id)
		$(".bankcity").attr("area_id",area_id)
		//console.log(cityStr);

	})
	
	// 选择银行
	//加载列表
	
	get_kind_list();


	function get_kind_list() {
		$.getJSON(ApiUrl+'/index.php?act=bank', function (result) {
			console.log(result)
			var html = template.render('comkind', result);
			$(".merchantsfirst-category-section").html(html);
		});
	}
	
	var $txt = [],
		$num = [];
	
	$('.mui-content').on('tap', '.form-check input[type="checkbox"]', function () {
	
		var $this = $(this);
	
		if (!$this.prop('checked')) {
			$num.push($this.parent().attr('data-id'));
			$txt.push($this.prev().text());
		} else {
			$num.remove($this.parent().attr('data-id'));
			$txt.remove($this.prev().text());
		}
	
	})
	
	
	
	
	
	//点击隐藏
	
	$('.bankName').on("click", function () {
		$('.page-money').fadeOut().siblings().hide();
		$('.page-service').fadeIn().siblings().hide();
		
	});
	$(".page-service .icon-back").on("click", function () {
		$('.page-service').fadeOut().siblings().hide();
		$('.page-money').fadeIn().siblings().hide();
	});
	
	$('input[name="fircategory"]').on("click", function () {
		$('.page-form').fadeOut().siblings().hide();
		$('.page-service').fadeIn().siblings().hide();
		
	});
	$(".page-service .icon-back").on("click", function () {
		$('.page-service').hide().prev('.page-money').show();
	});
	$('.page-service .icon-link').on('click', function () {
		var $this = $(this),
			$str = [],
			//$com = [],
			$num = [],
			$check = $('.form-check input[type="radio"]:checked');

		for (var i = 0; i < $check.length; i++) {
			$str.push($check.eq(i).prev().text());
			$num.push($check.eq(i).parent().attr('data-id'));
			//$com.push($check.eq(i).attr('data-com'));
		}

		console.log($str);
		$('.bankName').val($str).attr({ 'data-id': $num });
		// $('.form-check input[type="checkbox"]').prop('checked', false);
		$('.page-money').fadeIn().siblings().hide();

	})
	$('.page-service .icon-back').on('tap',function(){
		$('.page-service').hide();
		$('.page-money').show();
	})
	
	
	
	
	
	
	
	
	
	
	//原本
	$('.bankAccountname').val(window.localStorage.getItem('name') ? window.localStorage.getItem('name') : '');
	//console.log(window.localStorage.getItem("cpname"));
	var cpname = window.localStorage.getItem("cpname");
	$(".bankAccountname").val(cpname)
	
	
	
	var $userinfo = _.userInfo.get();
		
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
						url:ApiUrl+"/index.php?act=store_joinin&op=getstep3",
						data:{
							key:$userinfo.key
						},
						dataType:"json",
						success:function(res){
							console.log(JSON.stringify(res))
							//console.log(res.datas.bank_account_name)
								$(".bankAccountname").val(res.datas.bank_account_name)
								$(".bankAccountnumber").attr("value",res.datas.bank_account_number)
								$(".bankName").attr("value",res.datas.bank_name)
								$(".bankAddress").val(res.datas.bank_branch_name)
								$(".bankCode").val(res.datas.bank_code)
								$(".bankcity").val(res.datas.bank_city_name)
								$(".bankcity").attr("area_id",res.datas.bank_province_id)
								$(".bankcity").attr("city_id",res.datas.bank_city_id)
								$(".bankName").attr("data-id",res.datas.bank_sn)
							
						}
					})
				}
			}
		})
	
	$(".page-money .merchantsthird-footer").find("button").on("click", function () {
		//重新修改时候，所有的验证必须使用$.sValid方法来做。
		//验证注册地址是否为空
		// if ($(".bankAccountname").val() == "") {
		// 	alert("请填写开户名")
		// 	return false;
		// }
		//验证法人姓名是否为空

		// var reg = /^[0-9]{16,19}$/,
		// 	bank = $('.bankAccountnumber').val();
		// if ( !reg.test(bank) ) {
		// 	alert("请填写16-19位银行卡号")
		// 	return false;
		// }
		// //验证法人证件类型是否为空
		// if ($(".bankName").val() == "") {
		// 	alert("请填写开户行")
		// 	return false;
		// }
		// //验证法人证件号码是否为空
		// if ($(".bankAddress").val() == "") {
		// 	alert("请填写支行")
		// 	return false;
		// }




		
		
		
		
		
		
		
		
		
		var $bank_account_name = $('input[name="bankAccountname"]').val(),
			$bank_account_number = $('input[name="bankAccountnumber"]').val(),
			$bank_name = $('input[name="bankName"]').attr("data-id"),
			$bank_address = $('input[name="bankAddress"]').val();
			$bankCode = $('input[name="bankCode"]').val();
		$.ajax({
			url: ApiUrl+"/index.php?act=store_joinin&op=step3",
			type: "GET",
			data: {
				key: $userinfo.key,
				bank_account_name: $bank_account_name,  //银行开户姓名
				bank_account_number: $bank_account_number, //开户账号
				bank_name: $bank_name,		//接口
				bank_branch_name: $bank_address,//开户行所在地自己数
				bank_code:$bankCode,		//支行号
				bank_city:$(".bankcity").attr("city_id"),                 //城市
				bank_provice:$(".bankcity").attr("area_id")				//省份
			},
			success: function (res) {
				var data = $.parseJSON(res);
				console.log(res)
				if (data.code !== 200) {
					mui.confirm(data.datas.error)
				}
				else {
					//_.jump('merchantsthird2.html');
					mui.openWindow({
					 	url: "merchantsthird2.html",
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

})

