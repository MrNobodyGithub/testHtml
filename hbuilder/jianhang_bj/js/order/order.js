$(function(){
	var $cityInfo = _.getCityInfo() || _.getDefaultCityInfo(); //当前城市对象
	var key = _.userInfo.getKey();
	var param = '';
	var gc_id = "";
	var order_amount = "";
	
	var self = JSON.parse(decodeURIComponent( getQueryString('param')) );
	console.log(self);
	param = self.param;
	var labelparam = self.labelparam;
	var orderinfo = self.orderinfo;
	order_amount = orderinfo.order_amount;
	var goods_id = orderinfo.goods_id;
	//  护工计算总价
	var totalPrice = orderinfo.totalPrice;
	
	gc_id = param.gc_id;
	var	is_face = 0;
	var	create_url = ApiUrl + "/index.php?act=service_member_order&op=create_new_order20171009";
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
		$('.btn-yellow').text('0元预约');
		labelparam.push({
			"label": "备注",
			"value": "预约不收费，预约成功进行线下面试及订金支付流程"
		});
	}
	
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
	
	var submitmun = 0;
	// 提交订单
	$('.btn-yellow').on('tap', function() {
		if(window.localStorage.getItem('address_from') || window.localStorage.getItem('bjspec') || window.localStorage.getItem('bjdangqi')){
			window.localStorage.removeItem('address_from');
			window.localStorage.removeItem('bjspec')
			window.localStorage.removeItem('bjdangqi')
		}
		if(window.localStorage.getItem('$classInfo')){
			window.localStorage.removeItem('$classInfo');
		}
		if(submitmun < 1) {
			submitmun = submitmun + 1;
			// 创建订单跳页面
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
			_.data.send(create_url, 'post', true, data, function(data) {
				console.log(data);
				if(data.code == 200) {
					var order_info = data.datas.order_info;
					order_info.order_id = data.datas.order_id;
					MBC_PAY();
					$.ajax({
						type:"post",
						url:ApiUrl + "/index.php?act=member_payment&op=ccb_inner_service_pay",
						async:true,
						data: {
							key: key,
							pay_sn: data.datas.pay_sn
						},
						dataType: 'json',
						success: function(res){
							console.log(res);
							if(res.code == 200){
								MBC_PAY();
								//					window.location.href = encodeURI(WapSiteUrl + '/order_complete.html?order_info='+order_info+'&is_face'+is_face);
							}else if(res.code == 400){
								mui.alert(res.datas.error);
							}
						}
					});
				} else {
					mui.alert(data.datas.error);
				}
			})
		}
	});
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
})
	
function bigImg() {
	$(".mui-slider").show();
}

function closeimg() {
	console.log("关闭图片");
	$(".mui-slider").hide();
}