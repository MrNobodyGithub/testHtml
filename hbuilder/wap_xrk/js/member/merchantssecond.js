	 	//获取cookie里存储的项目
	 	var strStoreDate = window.localStorage? localStorage.getItem("menuTitle"): Cookie.read("menuTitle");
		console.log(strStoreDate);
         $(".page-service").find("input[data-id=strStoreDate]").attr("checked","checked");
//测试一下
//		for(var i = 0; i < $("body").find(".form-check").length; i++) {
//			if($(".form-check").eq(i).attr("data-id") == strStoreDate) {
//				$(".form-check").eq(i).find("input").attr("checked", "checked")
//				var name = $(".form-check").eq(i).find("span").text()
//				console.log($(".form-check").eq(i).find("input"))
//				$(".fircategory1").attr("data-id", strStoreDate)
//				$(".fircategory1").val(name)
//			}
//		}

// 省市dom创建
function createCity() {
	$.ajax({
		url: ApiUrl + "/index.php?act=area&op=area_list",
		type: "GET",
		success: function(res) {
			var data = $.parseJSON(res);
			var html = template.render('regison', data);
			$(".regionchose-leftlist").html(html);
			$(".regionchose-leftlist").find('a').eq(0).addClass('active3');
		}
	})
	$.ajax({
		url: ApiUrl + "/index.php?act=area&op=area_list_arr",
		type: "GET",
		success: function(res) {
			var data = $.parseJSON(res);
			var html2 = template.render('regison2', data);
			$(".regionchose-rightlist").html(html2);
			$('.regionchose-rightlist dl').eq(0).show();
			$(".regionchose-rightlist").find("dl").find("dd").find("ol").on("click", "li", function() {
				$(".regionchose-rightlist").find("dl").find("dd").find("ol").find("li").removeClass('active4');
				if($(this).hasClass("active4")) {
					$(this).removeClass("active4")
				} else {
					$(".regionchose-rightlist").find("dl").find("dd").find("ol").removeClass('active4');
					$(this).addClass("active4").siblings().removeClass('active4');
				}
			})

		}
	})
}

$(function() {
	createCity();
	var $userinfo = _.userInfo.get();
	var $tab = $('.index-tab a'),
		$content = $('.tab-content');
	var is_person
	$tab.on('click', function(e) {

		var $this = $(this),
			$num = $this.index();

		$this.addClass('active').siblings().removeClass('active');
		$content.eq($num).addClass('show').siblings().removeClass('show');
		if($content.eq($num).hasClass("is_pos")) {
			is_person = "1";
		} else if(!$content.eq($num).hasClass("is_pos")) {
			is_person = "0";
		}
		//console.log(is_person);
		e.stopPropagation();
	})

	//若验证失败，重新填写信息时将以前的信息带出
	//首先判断状态值，如果审核未通过则带入信息  否则  不带入信息
	$.ajax({
		type: "get",
		url: ApiUrl + "/index.php?act=check_join&op=check",
		data: {
			key: $userinfo.key
		},
		async: false,
		dataType: "json",
		success: function(res) {
			console.log(JSON.stringify(res))
			if(res.datas.join_info.joinin_state == 30) {
				$.ajax({
					type: "get",
					url: ApiUrl + "/index.php?act=store_joinin&op=getstep1",
					data: {
						key: $userinfo.key
					},
					async: false,
					dataType: "json",
					success: function(res) {
						console.log(JSON.stringify(res));

						if(res.datas.is_person == 1) {
							is_person = 0;
							console.log(is_person)
							$(".index-tab").find("a").attr("class", "");
							$(".index-tab").find("a").eq(1).attr("class", "active");
							$(".company").addClass("show");
							$(".is_pos").removeClass("show");
							$(".city1").attr("value", res.datas.business_licence_address);
							$(".name1").attr("value", res.datas.contacts_name);
							//$(".fircategory1")
							$(".cardnumber1").attr("value", res.datas.business_licence_number);
							$(".tel1").attr("value", res.datas.contacts_phone);
							$(".address1").attr("value", res.datas.company_address_detail);
							$(".email1").attr("value", res.datas.contacts_email);
							$(".city1").attr("area_id", res.datas.business_licence_address_code)

							//取classId值 使其选中并传值过来
							var cId = res.datas.class_id[0].split(",")[0];
							if(cId == undefined){
								cId = strStoreDate;
							}
							$.getJSON(ApiUrl + '/index.php?act=service_class', function(result) {
								var html = template.render('comkind', result);
								$(".merchantsfirst-category-section").html(html);
								console.log("**************" + html);
								console.log($(".form-check").length)
								for(var i = 0; i < $("body").find(".form-check").length; i++) {
									if($(".form-check").eq(i).attr("data-id") == cId) {
										$(".form-check").eq(i).find("input").attr("checked", "checked")
										var name = $(".form-check").eq(i).find("span").text()
										console.log(name)
										$(".fircategory1").attr("data-id", cId)
										$(".fircategory1").val(name)
									}
								}
							});

						} else {
							is_person = 1;
							console.log(is_person)
							$(".index-tab").find("a").attr("class", "");
							$(".index-tab").find("a").eq(0).attr("class", "active");
							$(".is_pos").addClass("show");
							$(".company").removeClass("show");

							$(".companyaddress0").attr("value", res.datas.company_address)
							//$(".fircategory1")
							$(".city0").attr("value", res.datas.business_licence_address);
							$(".legalpersonName0").attr("value", res.datas.legalperson_name) //法人姓名
							$(".legalpersonCode0").attr("value", res.datas.legalperson_code); //证件号
							$(".tel0").attr("value", res.datas.contacts_phone);
							$(".companyName0").attr("value", res.datas.company_name) //公司名称
							$(".companyweb0").attr("value", res.datas.company_url)
							$(".city0").attr("area_id", res.datas.business_licence_address_code)

							//取classId值 使其选中并传值过来
							var cId = res.datas.class_id[0].split(",")[0]
							if(cId == undefined){
								cId = strStoreDate;
							}
							$.getJSON(ApiUrl + '/index.php?act=service_class', function(result) {
								var html = template.render('comkind', result);
								$(".merchantsfirst-category-section").html(html);
								console.log("**************" + html);
								console.log($(".form-check").length)
								for(var i = 0; i < $("body").find(".form-check").length; i++) {
									if($(".form-check").eq(i).attr("data-id") == cId) {
										$(".form-check").eq(i).find("input").attr("checked", "checked")
										var name = $(".form-check").eq(i).find("span").text()
										console.log(name)
										$(".merserver0").attr("data-id", cId)
										$(".merserver0").val(name)
									}
								}
							});

						}
					}
				});
			}
		}
	})

	console.log(is_person)

	// 城市展开
	$('.page-city').on('click', '.regionchose-leftlist a', function() {
		var $this = $(this);

		$this.addClass('active3').siblings().removeClass('active3');
		$('.regionchose-rightlist dl').eq($this.index()).fadeIn().siblings('dl').hide();
	});

	$('.page-city .icon-back').on('click', function() {
		$('.page-city').hide().prev('.page-form').show();
	})

	// 选择城市
	$('input[name="businessLicenceaddress"]').on("click", function() {

		var $this = $(this);

		$('.page-city').fadeIn().siblings('.page-form').hide();

	})

	$('.merchantsthird-footer').on('click', function() {
		var cityStr = '';
		for(var i = 0; i < $('.page-city .active4').length; i++) {
			cityStr += $.trim($('.page-city .active4').eq(i).text()) + ',';
		}
		var $str = cityStr.substring(0, cityStr.length - 1);
		$('.page-city').hide().prev().show();
		$('input[name="businessLicenceaddress"]').val($str);
		$('input[name="businessLicenceaddress"]').attr('area_id', $(".active4").attr("city_id"));
		//console.log(cityStr);

	})
	// 选择服务
	strStoreDate = Number(strStoreDate);
	$('input[name="fircategory"]').on("click", function() {
		$('.page-form').fadeOut().siblings().hide();
		$('.page-service').fadeIn().siblings().hide();
		//默认选中之前选中的服务项目 
	});
	console.log(strStoreDate)
	$(".page-service .icon-back").on("click", function() {
		$('.page-service').fadeOut().siblings().hide();
		$('.page-form').fadeIn().siblings().hide();
	});
	//服务项目选择
	$('.page-service .icon-link').on('click', function() {
		var $this = $(this),
			$str = [],
			$com = [],
			$num = [],
			$check = $('.form-check input[type="radio"]:checked');

		for(var i = 0; i < $check.length; i++) {
			$str.push($check.eq(i).prev().text());
			$num.push($check.eq(i).parent().attr('data-id'));
			//			$com.push($check.eq(i).attr('data-cdata-idom'));
			$com.push($check.eq(i).attr('data-com'));
		}

//		console.log("服务项目:" + $str);
//		console.log("服务项目$num的data-id:" + $num);
//		console.log("服务项目$com的data-cdata-idom:" + $com);
		$('input[name="fircategory"]').val($str).attr({
			'data-com': $com,
			'data-id': $num
		});
		// $('.form-check input[type="checkbox"]').prop('checked', false);
		$('.page-form').fadeIn().siblings().hide();

	})

	$('.page-service .icon-back').on('tap', function() {
		$('.page-service').hide();
		$('.page-form').show();
	})
	$('.page-form').on('tap', ".address_check", function() {
		$('.page-form').hide();
		$('.page-agreement').show();
	})

	//协议
	$('.page-agreement .icon-back').on('tap', function() {
		$('.page-agreement').hide();
		$('.page-form').show();
	})

	// 选择证件类型
	$('#commonpicker , #commonpicker1').on('click', function() {
		$.ajax({
			url: ApiUrl + "/index.php?act=store&op=get_document_type",
			type: "GET",
			success: function(res) {
				var data = $.parseJSON(res);
				var arr = [],
					arr2 = [];
				var obj = {
					value: "",
					text: ""
				}
				for(var i = 0; i < data.datas.document_type_list.length; i++) {
					var obj = {
						value: "",
						text: ""
					}
					obj.text = data.datas.document_type_list[i];
					obj.value = i;
					arr.push(obj)
					arr2.push(data.datas.document_type_list[i]);
				}
			}
		})
	})
	var $member_id = null,
		$person_type = false,
		$person_warring = false;

	if($userinfo != 0) {
		$member_id = $userinfo.id;
	}
	//点击下一步
	$(".page-form footer").find("button").on("click", function() {
		//		mui.toast("点击了我")
		console.log("打印看看");
//		var data = {};
		var $contacts_name = $('input[name="personname"]').val(),
			$legalperson_code_type = $('input[name="cardkind"]').val(),
			$business_licence_number = $('input[name="cardnumber"]').val(),
			$contacts_phone = $('.tel1').val(),
			$company_address_detail = $('input[name="address"]').val(),
			$contacts_email = $('input[name="email"]').val(),
			$store_name = $('input[name="password"]').val(),
			$company_name = $('input[name="companyName"]').val(),
			$company_address = $('input[name="companyAddress"]').val(),
			$legalperson_code = $('input[name="legalpersonCode"]').val(),
			// $legalperson_code_type = $('input[name="legalpersonCodetype"]').val();
			$business_licence_address = $('input[name="businessLicenceaddress"]').val(),
			$legalperson_name = $('input[name="legalpersonName"]').val(),
			$class_id = $(".fircategory1").attr("data-id")||strStoreDate;
			console.log($class_id)
//			if($class_id == undefined){
//				$class_id = strStoreDate;
//			}
//				将服务项目中的$class_id存入本地
			//存储，IE6~7 cookie 其他浏览器HTML5本地存储
			if (window.localStorage) {
			    localStorage.setItem("menuTitle", $class_id);	
			} else {
			    Cookie.write("menuTitle", $class_id);	
			}
			
//			//选择服务项目
//			for(var i = 0; i < $("body").find(".form-check").length; i++) {
//				if($(".form-check").eq(i).attr("data-id") == $class_id) {
//					$(".form-check").eq(i).find("input").attr("checked", "checked")
//					var name = $(".form-check").eq(i).find("span").text()
//					console.log(name)
//					$(".fircategory1").attr("data-id", $class_id)
//					$(".fircategory1").val(name)
//				}
//			}
//			
//			$(".merchantsfirst-category-section").find("input[data-id=58]").attr("checked","checked")
			
//		//测试数据是否正确
//		data.contacts_name = $contacts_name;
//		data.legalperson_code_type = $legalperson_code_type;
//		data.business_licence_number =$business_licence_number;
//		data.contacts_phone = $contacts_phone;
//		data.company_address_detail = $company_address_detail;
//		data.contacts_email = $contacts_email;
//		data.store_name = $store_name;
//		data.company_name = $company_name;
//		data.company_address = $company_address;
//		data.legalperson_code = $legalperson_code;
//		data.business_licence_address = $business_licence_address;
//		data.legalperson_name = $legalperson_name;
//		
//		console.log('==========='+JSON.stringify(data));
//		console.log("+++++++项目+++++"+$(".fircategory1").val());
//		
//		 var a = $(".fircategory1").attr("data-id");
//		 console.log(a);
		//检查电话;
		function checkPhone(str) {
			var phone = /^(([0-9]{2,3})|([0-9]{3}-))?((0[0-9]{2,3})|0[0-9]{2,3}-)?[1-9][0-9]{6,7}(-[0-9]{1,4})?$/;
			var mobile = /^1[0-9]{10}$/;
			if(phone.test(str) || mobile.test(str)) {
				return true;
			} else {
				return false;
			}
		}

		//检查邮箱
		function checkEmail(str) {
			var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
			if(!re.test(str)) {
				return false;
			} else {
				return true;
			}
		}

		if(is_person == 0) {
			window.localStorage.setItem("cpname", $('input[name="personname"]').val());
			//验证城市是否为空
			if($(".city1").val() == "") {
				mui.toast("请填写要开通的城市")
				return false;
			}
			//验证名称是否为空
			if($(".name1").val() == "") {
				mui.toast("请填写姓名")
				return false;
			}
			//验证服务项目是否为空
			if($(".fircategory1").val() == "") {
				mui.toast("请填写服务项目")
				return false;
			}
			//验证证件类型是否为空
			if($(".cardkind1").val() == "") {
				mui.toast("请填写证件类型")
				return false;
			}
			//验证证件号码是否为空

			var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			var card = $(".cardnumber1").val();
			if(reg.test(card) == false) {
				mui.toast("身份证输入不合法");
				return false;
			} else if(!card.length >= 1) {
				mui.toast("请填写证件号码")
				return false;
			}

			//验证联系方式
			var telinput = $('.tel1').val();
			if(telinput == "") {
				mui.toast("请输入联系方式");
				return false;
			} else {
				if(!checkPhone(telinput)) {
					mui.toast("请输入有效的联系电话");
					return false;
				}
			}

			//同意协议是否放到后面
			if(!$(".arguementcheck.personal").is(':checked')) {
				mui.toast("请阅读协议并选中");
				return false;
			}

			$.ajax({
				url: ApiUrl + "/index.php?act=store_joinin&op=step1",
				type: "GET",
				async: false,
				data: {
					key: $userinfo.key,
					is_person: "1", //必填,区分企业和个人, 1为个人0为企业
					contacts_name: $contacts_name,
					contacts_phone: $contacts_phone,
					contacts_email: $contacts_email, //企业:业务负责人邮箱个人:邮箱
					company_address_detail: $company_address_detail, //企业:公司详细地址个人:居住地址
					business_licence_number: $business_licence_number, //个人证件号码
					business_licence_address: $business_licence_address, //开通城市
					class_id: $class_id, //服务项目,就是服务分类的一级id
					legalperson_code_type: $legalperson_code_type, //法人证件类型，个人证件了宁
					commis_rate: $('input[name="fircategory"]').attr('data-com'),
					business_licence_address_code: $('input[name="businessLicenceaddress"]').attr('area_id')
				},
				success: function(res) {
					var data = $.parseJSON(res);
					console.log("打印看看")
					console.log(data)
					if(data.code !== 200) {
						mui.confirm(data.datas.error)
					} else {
						console.log('$person_type:' + $person_type);
						console.log('$person_warring' + $person_warring);
						//if( $person_type && $person_warring ) {
						//_.jump('merchantspersonannex.html');
						mui.openWindow({
							url: "merchantspersonannex.html",
							createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显
							waiting: {
								autoShow: true, //自动显示等待框，默认为true
								title: '正在加载...' //等待对话框上显示的提示内
							}
						})
						//}
					}
				}
			})

		} else {
			//这个不能放在提交的时候做
			window.localStorage.setItem("cpname", $('input[name="companyName"]').val());
			//验证城市是否为空
			if($(".city0").val() == "") {
				mui.toast("请填写要开通的城市")
				return false;
			}
			//验证公司名称是否为空
			if($(".companyName0").val() == "") {
				mui.toast("请填写公司名称")
				return false;
			}

			//验证服务项目是否为空
			if($(".merserver0").val() == "") {
				mui.toast("请填写服务项目")
				return false;
			}

			//验证注册地址是否为空
			if($(".companyaddress0").val() == "") {
				mui.toast("请填写注册地址")
				return false;
			}
			//验证法人姓名是否为空
			if($(".legalpersonName0").val() == "") {
				mui.toast("请填写法人姓名")
				return false;
			}

			//验证法人证件类型是否为空
			if($(".legalpersonCodetype0").val() == "") {
				mui.toast("请填写法人证件类型")
				return false;
			}
			//验证法人证件号码是否为空
			//alert('------hehehe------');

			var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			var card = $(".legalpersonCode0").val();
			console.log("身份号:" + card);
			if(reg.test(card) == false) {
				mui.toast("身份证输入不合法");
				return false;
			} else if(!card.length >= 1) {
				mui.toast("请填写证件号码")
				return false;
			}

			var telinput = $('.tel0').val();
			if(telinput == "") {
				mui.toast("请输入联系方式");
				return false;
			} else {
				if(!checkPhone(telinput)) {
					mui.toast("请输入有效的联系电话");
					return false;
				}
			}

			//同意协议是否放到后面
			if(!$(".arguementcheck.company").is(':checked')) {
				mui.toast("请阅读协议并选中");
				return false;
			}
			console.log($('input[name="fircategory"]').attr('data-com'));
			
			$.ajax({
				url: ApiUrl + "/index.php?act=store_joinin&op=step1",
				type: "GET",
				data: {
					key: $userinfo.key,
					is_person: "0", //必填,区分企业和个人, 1为个人0为企业
					company_name: $company_name, //公司名称
					company_address: $company_address, //注册地址
					legalperson_code_type: $('#commonpicker1').val(), //法人证件类型，个人证件了宁
					legalperson_code: $legalperson_code, //法人证件号
					legalperson_name: $('.legalpersonName0').val(),
					contacts_phone: $('.tel0').val(), //企业:业务负责人联系方式个人:联系方式
					class_id: $(".merserver0").attr("data-id")||strStoreDate,
					business_licence_address: $business_licence_address, //开通城市
					commis_rate: $('input[name="fircategory"]').attr('data-com'),
					company_url: $(".companyweb0").val(),
					business_licence_address_code: $('input[name="businessLicenceaddress"]').attr('area_id')
				},
				success: function(res) {
					var data = $.parseJSON(res);
					console.log(res)
					if(data.code !== 200) {
						mui.confirm(data.datas.error)
					} else {
						_.jump('merchantsenterpriseannex.html');
					}
				}
			})
		}
	})

	// 向日葵平台服务人员合作协议
	$('.tab-content .address_check').eq(0).on('click', function() {
		$.ajax({
			url: ApiUrl + '/index.php?act=document&op=getagreement&doc_code=open_service',
			type: 'get',
			dataType: 'json',
			success: function(data) {
				// console.log(data);
				$('.person0 .common-header h1').empty().text(data.datas.doc_row.doc_title);
				$('.person0 .agreement-text').empty().append(data.datas.doc_row.doc_content);
			},
			error: function(err) {
				// console.log(err);
			}
		})
	})

	$('.tab-content .address_check').eq(1).on('click', function() {
		$.ajax({
			url: ApiUrl + '/index.php?act=document&op=getagreement&doc_code=open_service_person',
			type: 'get',
			dataType: 'json',
			success: function(data) {
				// console.log(data);
				$('.person0 .common-header h1').empty().text(data.datas.doc_row.doc_title);
				$('.person0 .agreement-text').empty().append(data.datas.doc_row.doc_content);
			},
			error: function(err) {
				console.log(err);
			}
		})
	})

	// 向日葵平台服务商合作协议
	// http://sunflower.huazhenginfo.com/mobile/index.php?act=document&op=getagreement&doc_code=open_service

	// 用户协议
	// $.ajax({
	// 	url: "http://sunflower.huazhenginfo.com/mobile/index.php?act=document&op=getagreementtype",
	// 	type: "GET",
	// 	success: function (res) {
	// 		var data = $.parseJSON(res);
	// 		console.log(data);
	// 		var html = template.render('merchantssecondTem1', data);
	// 		$(".address_center").html(html);
	// 	}
	// })

	// 获取证件类型
	$.ajax({
		url: ApiUrl + "/index.php?act=store&op=get_document_type",
		type: "GET",
		success: function(res) {
			var data = $.parseJSON(res);
			var arr = [];
			var obj = {
					value: "",
					text: ""
				},
				html = '';
			for(var i = 0; i < data.datas.document_type_list.length; i++) {
				var obj = {
					value: "",
					text: ""
				}
				obj.text = data.datas.document_type_list[i];
				obj.value = i;
				arr.push(obj);
				html += '<span data-id=' + i + '>' + data.datas.document_type_list[i] + '</span>'
			}
			$('.mask .layer-up-select .no').before(html);
		}
	})

	var that = null;
	$('#commonpicker , #commonpicker1').on('click', function() {
		that = $(this);
		$('.mask').fadeIn(function() {
			$('.layer-up-select').css('bottom', '.3rem');
		})
	})

	// 关闭
	$('.mask').on('click', function(event) {
		if($(this).attr('class') == event.target.className) {
			$(this).fadeOut();
			$('.layer-up-select').css('bottom', '-100%');

		}
	})

	$('.layer-up-select').on('click', 'span:not(.no)', function() {
		var $this = $(this);
		that.val($this.text()).attr('data-id', $this.attr('data-id'));
		$('.mask').fadeOut();
		$('.layer-up-select').css('bottom', '-100%');
	})

	$('.layer-up-select').on('click', '.no', function() {
		$('.mask').fadeOut();
		$('.layer-up-select').css('bottom', '-100%');
	})
	
	

})
