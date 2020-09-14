mui.init();
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	console.log(JSON.stringify(self.order_info));
	console.log(JSON.stringify(self.is_face));
	//赋值
	var $order_id = self.order_info.order_id;
	var $order_num = self.order_info.order_sn;
	var $price = self.order_info.order_amount + '元';
	//临时处理，后台已经加了goodsamount返回
	var $goods_amount = self.order_info.goods_amount == undefined ? self.order_info.order_amount : self.order_info.goods_amount + '元';
	var $pay = '';
	var $is_face = self.is_face;
	//预约面试的服务没有定金返回？？？
	console.log($goods_amount);
	console.log($is_face + "======================");
	if($is_face == 1) {
		$(".order_num span").html($order_num);
		$('.order_complete .complete-state').html('预约成功');
		$(".order_complete .price i").html('服务金');
		$(".order_complete .price span").html($goods_amount);
		$('.order_complete .pay').hide();
		$('.order_complete .deposit').show();
		$(".order_complete .deposit span").html($price);
		$('.order_complete .complete-msg').show();
	} else {
		if(self.order_info.pay_code == 'alipay_native'){
			$pay = "支付宝支付";
		} else if(self.order_info.pay_code == 'wxpay_native'){
			$pay = "微信支付";
		} else {
			$pay = "其他方式支付";
		}
		$(".order_num span").html($order_num);
		$(".order_complete .price span").html($price);
		$(".order_complete .pay span").html($pay);
	}

	//返回首页,订单完成回到首页，应该关闭所有窗口。
	mui.back = function() {
		_.toHomePageAndCloseAll();
	}
	$(".order_complete .back").on('tap', function() {
		_.toHomePageAndCloseAll();
	})

	//跳转到订单
	$("#order").on('tap', function() {
		console.log("测试" + _.pageName.service_list); //列表
		console.log(_.pageName.service_detail); //详情
		console.log("common_books"); //预约
		console.log("service_buy"); //订单确认

		//关闭之前打开的页面

		var service_list = plus.webview.getWebviewById(_.pageName.service_list);
		var service_detail = plus.webview.getWebviewById(_.pageName.service_detail);
		var common_books = plus.webview.getWebviewById('common_books');
		var service_buy = plus.webview.getWebviewById('service_buy');

		plus.webview.close(service_list);
		plus.webview.close(service_detail);
		plus.webview.close(common_books);
		plus.webview.close(service_buy);

		_.openWindow({
			url: '../member/service-order-all.html',
			id: _.pageName.service_order_list,
			reOpen: true,
			//      	closeOthers:true
		});

		/*mui.openWindow({
			url: '../member/service-order-all.html',
			waiting: {
				autoShow: true,
				title: '正在加载...'
			}
		})*/
	})

	//详情
	$("#detail").on('tap', function() {
		console.log($order_id);
		_.openWindow({
			url: 'order-status-daifuwu.html',
			id: _.pageName.service_order_detail,
			param: {
				orderId: $order_id
			},
			reOpen: true,
			closeOthers: true
		});

		/*mui.openWindow({
			url: 'order-status-daifuwu.html',
			extras: {
				orderId: $order_id
			},
			waiting: {
				autoShow: true,
				title: '正在加载...'
			}
		})*/
		//		var current = plus.webview.currentWebview();
		//		plus.webview.close(current);
	})
})