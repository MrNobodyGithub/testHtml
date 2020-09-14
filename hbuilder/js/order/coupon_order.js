//================================================支付宝==========================
//定义全局变量
var $cityInfo = _.getCityInfo() || _.getDefaultCityInfo(); //当前城市对象
var key = _.userInfo.getKey();
var channel = new Object(); //支付方式数组
var hasvoucher = false; //是否有优惠券
var hasrcb = false; //是否有充值卡
var mobile = _.userInfo.get().phone;
console.log("手机号   " + mobile);

var self;
var orderinfo = {};
var goods_name = '';
var goods_price = '';
var goods_id = '';
var gc_id = '';
var create_url = '';
var company_name;
var goods_url;
var mobile_body;
var param = {};

mui.plusReady(function() {
	//接受上一个页面传递过来的参数
	self = plus.webview.currentWebview();

	orderinfo = self.orderinfo;
	console.log("测试数据    " + JSON.stringify(self.orderinfo));

	goods_name = orderinfo.goods_name;
	goods_price = orderinfo.goods_price;
	goods_id = orderinfo.goods_id;
	gc_id = orderinfo.gc_id;
	company_name = orderinfo.store_info;
	goods_image = orderinfo.goods_image;
	console.log(goods_image);
	mobile_body = orderinfo.mobile_body;
	create_url = ApiUrl + "index.php?act=service_member_order&op=create_new_order20171009";

	//填充订单确认模板
	$('#store_name').html(company_name);
	$("#coupon_name").html(goods_name);
	$('#coupon_img').attr('src', goods_image);
	$('#sales_process').html(mobile_body);
	$('#order_amount').html(goods_price);

	//兑换流程效果
	$('#is_more').on('tap', function() {
		$('#sales_process').removeClass("hidden");
		$('#is_more').css("display", "none");
	})

	// 获取支付通道
	plus.payment.getChannels(function(channels) {
		channel = {
			alipay: channels[0],
			wxpay: channels[1]
		};
	}, function(e) {
		return {
			state: false,
			msg: "获取支付通道失败：" + e.message
		};
	});
	getAvailablevoucher();

	function getAvailablevoucher() {
		// 获取可用优惠券
		var voucher_url = ApiUrl + "/index.php?act=service_member_order&op=get_available_voucher";
		$.ajax({
			type: "post",
			url: voucher_url,
			async: true,
			dataType: "json",
			data: {
				total_price: goods_price,
				key: key,
				gc_id: gc_id,
				area_id: $cityInfo.area_id
			},
			success: function(data) {
								console.log("aaa" + JSON.stringify(data));
				if(data.code == 200) {
					if(data.datas.voucher_list != null && data.datas.voucher_list.length > 0) {
						hasvoucher = true;
						var $html = template.render("voucher_list", data.datas);
						$("#coupon-list-voucher").html($html);
						$("#voucher_id small").html("请选择");
					}
				}
			}
		});
	};
	getAvailable_rcb_list();

	function getAvailable_rcb_list() {
		//获取充值卡
		var card_url = ApiUrl + "/index.php?act=member_fund&op=available_rcb_list";
		$.ajax({
			type: "post",
			url: card_url,
			async: true,
			dataType: "json",
			data: {
				key: key
			},
			success: function(data) {
				//				console.log(JSON.stringify(data));
				if(data.datas.available_rcb_list && data.datas.available_rcb_list.length > 0) {
					var $html = template.render("card_list", data);
					hasrcb = true;
					$("#coupon-list-card").html($html);
					$("#coupon-btn-card small").html("请选择");
				}
			}
		});
	}

	//选择支付方式
	$('.mask .pay-menu a').on('tap', function() {
		$(this).addClass('active').siblings('a').removeClass('active');
		var payCode = $(this).attr('data-type');
		$('input[name="payCode"]').val(payCode);
	});

	var paymun = 0;
	//确认支付
	$('#pay_btn').on('tap', function() {
		var pay_code = $('input[name="payCode"]').val();
		if(pay_code == '') {
			mui.alert('请选择支付方式');
			return false;
		}
		//TODO 临时
		/*if(pay_code != 'alipay_native') {
			mui.alert('不支持的支付方式');
			return false;
		}*/
		if(orderinfo == '') {
			mui.alert('参数不正确，请重新填写');
			return false;
		}
		//生成单
		var voucher_id = $('#voucher_id').attr('data-voucher-id');
		var card_id = $('#card_id').attr('data-card-id');
		param = {
			gc_id: gc_id,
			mob_phone_from: mobile
		};
		console.log("测试数据  "+JSON.stringify(param));
		var data = {
			param: param,
			key: key,
			area_id: $cityInfo.area_id,
			goods_data: [goods_id],
			is_virtual: 1,
			prop: 0
		};

		if(voucher_id > 0) data.voucher = voucher_id;
		if(card_id > 0) data.rcb_pay_id = card_id;
		if(paymun < 1) {
			_.data.send(create_url, 'post', true, data, function(data) {
				if(data.code == 200) {
					var datas = data.datas,
						pay_data = {
							pay_sn: datas.pay_sn,
							order_type: datas.order_type,
							key: key
						},
						order_info = datas.order_info;
					order_id = datas.order_id;
					order_info.pay_code = pay_code; //支付方式
					order_info.order_id = order_id; //订单id
					if(datas.order_info.final_pay_amount > 0) {
						//传入支付方式
						mobilePay(pay_data, pay_code, channel, function(obj) {
							if(obj.state == true) {
								//成功
								_.openWindow({
									url: 'order_complete.html',
									id: _.pageName.service_order_success,
									param: {
										order_info: order_info,
										status: 2,
										edit: true
									},
									reOpen: true,
									closeOthers: true
								});

							} else {
								//失败
								_.openWindow({
									url: '../member/service-order-all.html',
									id: _.pageName.service_order_list,
									param: {
										status: 0,
										eidt: true
									},
									reOpen: true,
									closeOthers: true
								});
							}

						});
					} else {
						mui.toast('支付完成');
						_.openWindow({
							url: 'order_complete.html',
							id: _.pageName.service_order_success,
							param: {
								order_info: order_info,
								status: 2,
								edit: true
							},
							reOpen: true,
							closeOthers: true
						});
					}
				} else {
					mui.alert(data.datas.error);
				}
			});
			paymun++;
		}
	});
	var submitmun = 0;
	// 提交订单
	$('.btn-yellow').on('tap', function() {
		$("#payMask").fadeIn().find('.pay-menu').css('bottom', '0');
	});
	$('.mask').on('tap', function(event) {
		if(event.target.className == $(this).attr('class')) {
			$(this).fadeOut().find('.pay-menu').css('bottom', '-100%');
		}
	})

	//	优惠券页面
	$('#coupon-btn-voucher').on('tap', function() {
		if(hasvoucher) {
			$('#page-coupon-voucher').show();
		} else {
			mui.toast('没有可用的优惠券');
			return false;
		};

	})
	// 充值卡
	$('#coupon-btn-card').on('tap', function() {
		if(hasrcb) {
			$('#page-coupon-card').show();
		} else {
			mui.toast('没有可用的充值卡');
			return false;
		};
	})

	$('#page-coupon-voucher').on('tap', '.nouese', function() {
		$(this).closest('.page-coupon').fadeOut();
		$('#voucher_id').removeAttr('data-voucher-id');
		$("#coupon-btn-voucher").find('span').text('请选择优惠券');
		$("#coupon-btn-voucher").find('small').text('不使用');
	})
	$('#page-coupon-card').on('tap', '.nouese', function() {
		$(this).closest('.page-coupon').fadeOut();
		$('#card_id').removeAttr('data-card-id');
		$("#coupon-btn-card").find('span').text('请选择充值卡');
		$("#coupon-btn-card").find('small').text('不使用');

	})
	//选择优惠券
	$('#page-coupon-voucher').on('tap', ".coupon-item-voucher", function() {
		$(this).closest('.page-coupon').fadeOut();
		/*$('.coupon-btn').find('span').text($(this).find('h3').text());
		$('.coupon-btn').find('small').text('已选择');*/
		$("#coupon-btn-voucher").find('span').text($(this).find('strong').text());
		$("#coupon-btn-voucher").find('small').text('已选择');
		var voucher_id = $(this).attr('data-voucher');
		$('#voucher_id').attr('data-voucher-id', voucher_id);
	});
	//选择充值卡
	$('.page-coupon').on('tap', '#coupon-item-card', function() {
		$(this).closest('.page-coupon').fadeOut();
		/*$('.coupon-btn').find('span').text($(this).find('h3').text());
		$('.coupon-btn').find('small').text('已选择');*/
		$("#coupon-btn-card").find('span').text($(this).find('strong').text());
		$("#coupon-btn-card").find('small').text('已选择');
		var card_id = $(this).attr('data-card-id');
		$('#card_id').attr('data-card-id', card_id);
		//		$("#layPassword").css("display", "block");
	});

	$('.page-coupon .icon-back').on('tap', function() {
		$(this).closest('.page-coupon').fadeOut();
	})

});