//================================支付宝==========================
var $cityInfo = _.getCityInfo() || _.getDefaultCityInfo(); //当前城市对象
//var key = _.userInfo.getKey();
var key = 'e509dd4f6f33f263dac3b5391bff1d3d';
var param = '';
var channel = new Object(); //支付方式数组
var gc_id = "";
var order_amount = "";
var needs_fee = 0;
var hasvoucher = false;   //是否有优惠券
var hasrcb = false;			//是否有充值卡

var self = JSON.parse(decodeURI( getQueryString('param')) );

	param = self.param;
	console.log(param);
	 /**
	  * @author: zhaoyangyue
	  * @desc: 由于优惠券不包括消费金额 所以优惠券传值价格 减去小费
	  * @version:2017-7-25
	  */
	 // 跑腿小费
	 if(param.needs_fee){
	 	needs_fee = param.needs_fee;
	 }
	var labelparam = self.labelparam;
	console.log(JSON.stringify(labelparam));
	var orderinfo = self.orderinfo;
	order_amount = orderinfo.order_amount;
	var goods_id = orderinfo.goods_id;
	//  护工计算总价
	var totalPrice = orderinfo.totalPrice;

	// var type_info = self.type_info;
	// var type_model = orderinfo.type_model;
	gc_id = param.gc_id;
	var	is_face = 0;
	var	create_url = ApiUrl + "/index.php?act=service_member_order&op=create_new_order";
	if(gc_id > 0) {
		_.data.send(ApiUrl + '/index.php?act=type&op=getclassinfo', 'get', true, {
			gc_id: gc_id
		}, function(data) {
			if(data.code == 200) {
				// 搬家的显示预约金
				if(data.datas.type_info != '' && data.datas.type_info.type_model == 4) {
					$('#type_model').html('预约金');
				} else {
					$('#type_model').html('合计');
				}

				// 定金模式
				if(data.datas.type_info != '' && data.datas.type_info.pay_method == 2 && data.datas.type_info.is_face != 1) {
					var deposit = data.datas.type_info.deposit,
						dep_amount = 0;
					if(deposit < 1) {
						dep_amount = deposit * order_amount;
					} else {
						dep_amount = deposit;
					}
					$('#order_amount').html(dep_amount);
				} else {
					if(totalPrice){
						$('#order_amount').html(totalPrice);
					}else{
						$('#order_amount').html(order_amount);
					}
				}
				if(data.datas.type_info.is_face == 1) is_face = 1;
			}
		}, false);
	}
	if(is_face == 1) {
		/**
		 * @description: 0元预约也可以选优惠券充值卡
		 * @author: zhaoyangyue
		 * @version: 2017-7-21
		 */
		$('.btn-yellow').text('0元预约');
		labelparam.push({
			"label": "备注",
			"value": "预约不收费，预约成功进行线下面试及订金支付流程"
		});
	}

	//TODO
	// var orderinfo = JSON.parse('{"order_amount":"80.00","prop":0,"goods_id":"100536"}');
	// var param = JSON.parse('{"books_time_from":"2017-07-08","gc_id":"23","true_name_from":"向日葵1497991348","books_description":"1234","address_from":"11111","key":"bbf7def1d8b6ed59d69dcf7caa6c4f76","mob_phone_from":"13255553420"}');
	// var labelparam = JSON.parse('[{"label":"预约地址","value":"11111"},{"label":"预约时间","value":"2017-07-08"},{"label":"联系人","value":"向日葵1497991348"},{"label":"联系方式","value":"13255553420"},{"label":"描述","value":"1234"}]');
	// var order_amount = orderinfo.order_amount;
	// var goods_id = orderinfo.goods_id;

	// key = 'e4a4459abd70eab93c6e0353a58356d4';

	//填充订单确认模板
	
	
	for(var i = 0;i<labelparam.length;i++ ){
		if(labelparam[i].label == '保洁套餐'){
			var data = JSON.parse( labelparam[i].value );
			var html = '';
			if(data.items.length>0){
				for(var j=0;j<data.items.length;j++){
					html += data.items[j].item_name + 'x'+ data.items[j].qty + '  ';
				}
			}else{
				html = data.custom.custom_name + data.custom.unit_price + '/' + data.custom.unit + 'x'+ data.custom.qty;
			}
			
			labelparam[i].value = html;
		}
	}
	var $html = template.render("order-info", {
		labelparam: labelparam
	});
	$(".appoint-detail-content ol").html($html);

	if(totalPrice) {
		var total = '<li><i>总价：</i><span>' + totalPrice + '</span></li>';
		$(".appoint-detail-content ol").append(total);
	}

	//图片轮播
	var html = template.render("swiper-img", {
		labelparam: labelparam
	});
	$(".mui-slider .mui-slider-group").html(html);

	var gallery = mui('.mui-slider');
	gallery.slider({
		interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
	});

	// 获取支付通道
//	plus.payment.getChannels(function(channels) {
//		channel = {
//			alipay: channels[0],
//			wxpay: channels[1]
//		};
//	}, function(e) {
//		return {
//			state: false,
//			msg: "获取支付通道失败：" + e.message
//		};
//	});
	getAvailablevoucher();
	
	function getAvailablevoucher(){
		// 获取可用优惠券
		var voucher_url = ApiUrl + "/index.php?act=service_member_order&op=get_available_voucher";
		$.ajax({
			type: "post",
			url: voucher_url,
			async: true,
			dataType: "json",
			data: {
				total_price: totalPrice ? totalPrice : (order_amount - needs_fee), //优惠券的价钱不包括小费
				key: key,
				gc_id: param.gc_id,
				area_id: $cityInfo.area_id
			},
			success: function(data) {
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
	
	function getAvailable_rcb_list(){
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
		if(window.localStorage.getItem('address_from') || window.localStorage.getItem('bjspec') || window.localStorage.getItem('bjdangqi')){
			window.localStorage.removeItem('address_from');
			window.localStorage.removeItem('bjspec')
			window.localStorage.removeItem('bjdangqi')
		}
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

		if(param == '') {
			mui.alert('参数不正确，请重新填写');
			return false;
		}

		//生成单
		var voucher_id = $('#voucher_id').attr('data-voucher-id');
		var card_id = $('#card_id').attr('data-card-id');
		var data = {};
		if(orderinfo.prop == 0) {
			data = {
				param: param,
				key: key,
				prop: 0,
				goods_data: [goods_id]
			};
		} else if(orderinfo.prop == 1) {
			data = {
				param: param,
				key: key,
				prop: 1,
				order_amount: totalPrice ? totalPrice : order_amount  //护工有合计 判断合计是否存在 不存在取order_amount
			};
		}
		if(voucher_id > 0) data.voucher = voucher_id;
		if(card_id > 0) data.rcb_pay_id = card_id;
		if(paymun<1){
			console.log(data);
			paymun++;
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
								console.log(WapSiteUrl);
								window.location.href = encodeURI('order_complete.html?oeder_info='+order_info+'&status=2&edit=true');
								
							} else {
								//失败
								location.href = encodeURI('../member/service-order-all.html?status=0&edit=true');
							}

						});
					} else {
						mui.toast('支付完成');
						window.location.href = encodeURI('order_complete.html?oeder_info='+order_info+'&status=2&edit=true');
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
		if(window.localStorage.getItem('address_from') || window.localStorage.getItem('bjspec') || window.localStorage.getItem('bjdangqi')){
			window.localStorage.removeItem('address_from');
			window.localStorage.removeItem('bjspec')
			window.localStorage.removeItem('bjdangqi')
		}
		if(!$('#agreement').prop('checked')) {
			mui.alert('请勾选协议');
			return false;
		}
		if(is_face == 0) {
			$('#payMask').fadeIn().find('menu').css('bottom', '0');
		} else if(submitmun < 1) {
			submitmun = submitmun + 1;
			var voucher_id = $('#voucher_id').attr('data-voucher-id');
			var card_id = $('#card_id').attr('data-card-id');

			// 创建订单跳页面
			console.log("跳转");
			var data = {};
			if(orderinfo.prop == 0) {
				data = {
					param: param,
					key: key,
					prop: 0,
					goods_data: [goods_id]
				};
			} else if(orderinfo.prop == 1) {
				data = {
					param: param,
					key: key,
					prop: 1,
					order_amount: order_amount
				};
			}
			if(voucher_id > 0) data.voucher = voucher_id;
			if(card_id > 0) data.rcb_pay_id = card_id;
			_.data.send(create_url, 'post', true, data, function(data) {
				if(data.code == 200) {
					var order_info = data.datas.order_info;
					order_info.order_id = data.datas.order_id;
					window.location.href = encodeURI(WapSiteUrl + '/order_complete.html?order_info='+order_info+'&is_face'+is_face);

				} else {
					mui.alert(data.datas.error);
				}

			})

		}
		
	});
	$('.mask').on('tap', function(event) {
		if(event.target.className == $(this).attr('class')) {
			$(this).fadeOut().find('.pay-menu').css('bottom', '-100%');
		}
	})
	
	//	优惠券页面
	$('#coupon-btn-voucher').on('tap', function() {
		if(hasvoucher){
			$('#page-coupon-voucher').show();
		}else{
			mui.toast('没有可用的优惠券');
			return false;
		};

	})
	// 充值卡
	$('#coupon-btn-card').on('tap', function() {
		if(hasrcb){
			$('#page-coupon-card').show();
		}else{
			mui.toast('没有可用的充值卡');
			return false;
		};
	})
	
	$('#page-coupon-voucher').on('tap', '.nouese', function(){
		$(this).closest('.page-coupon').fadeOut();  
		$('#voucher_id').removeAttr('data-voucher-id');
		$("#coupon-btn-voucher").find('span').text('请选择优惠券');
		$("#coupon-btn-voucher").find('small').text('不使用');
	})
	$('#page-coupon-card').on('tap', '.nouese', function(){
		$(this).closest('.page-coupon').fadeOut();
		$('#card_id').removeAttr('data-card-id');
		$("#coupon-btn-card").find('span').text('请选择充值卡');
		$("#coupon-btn-card").find('small').text('不使用');
		
	})
	//选择优惠券
	$('#page-coupon-voucher').on('tap', ".coupon-item-voucher", function() {
		$(this).closest('.page-coupon').fadeOut();
		$("#coupon-btn-voucher").find('span').text($(this).find('strong').text());
		$("#coupon-btn-voucher").find('small').text('已选择');
		var voucher_id = $(this).attr('data-voucher');
		$('#voucher_id').attr('data-voucher-id', voucher_id);
	});
	//选择充值卡
	$('.page-coupon').on('tap', '#coupon-item-card', function() {
		$(this).closest('.page-coupon').fadeOut();
		$("#coupon-btn-card").find('span').text($(this).find('strong').text());
		$("#coupon-btn-card").find('small').text('已选择');
		var card_id = $(this).attr('data-card-id');
		$('#card_id').attr('data-card-id', card_id);
	});

	$('.page-coupon .icon-back').on('tap', function() {
		$(this).closest('.page-coupon').fadeOut();
	})

function bigImg() {
	$(".mui-slider").show();
}

function closeimg() {
	console.log("关闭图片");
	$(".mui-slider").hide();
}