//预加载预约页面来传值，通过fire自定义事件触发
mui.init({
	swipeBack: true
});
//定义全局变量
var common_books_Page = null;
var webview;
var $goodsId;
var $key;
//TODO 逐步改进，业务逻辑不要放在plusReady中。
mui.plusReady(function() {
	webview = plus.webview.currentWebview();
	$goodsId = webview.goodsId;
	$key = _.userInfo.getKey();
	get_detail($goodsId);

	//获取商品明细
	function get_detail(goodsId) {
		//首次为列表页传过来的goodsid，下次调用为规格点击的goodsid
		console.log(goodsId);
		$.ajax({
			url: ApiUrl + "/index.php?act=service_goods&op=goods_detail",
			type: 'get',
			dataType: 'json',
			data: {
				key: $key,
				goods_id: $goodsId
			},
			beforeSend: function() {
				$("#loading").fadeIn();
			},
			success: function(data) {
				if(data.code == 400) {
					mui.alert(data.datas.error);
					return false;
				}

				//提前定义商品的一部分基础数据，供后面使用
				var
					$goods_info = data.datas.goods_info,
					$store_info = data.datas.store_info,
					$spec_list = data.datas.spec_list,
					$spec_name = $goods_info.spec_name,
					$spec_value = $goods_info.spec_value,
					$spec_value_simple = {} //简化规格值用

				//	模板渲染=>填充值
				var $html = template.render("contentDetailTpl", data);
				$(".contentDetail").html($html);

				//	服务详情填充
				var $body = $goods_info.mobile_body;
				if($body == "") {
					var $body = '< img src="../images/ucenter/nodata-error.png" />';
					$(".price-img").html($body);
					$(".wenzi").css("display", "block");
				} else {
					$(".wenzi").css("display", "none");
				}

				//电话咨询 这里电话咨询是干什么的，取得谁的电话？是平台还是商户？每次都要取一次？太费劲！！！
				$.ajax({
					type: "get",
					url: ApiUrl + "/index.php?act=zx_setting&op=getphone",
					async: true,
					dataType: 'json',
					success: function(res) {
						//曾旭的接口写的。。。不要用数组不明意思的东西。
						var html = "<p><a href='tel://" + res.datas + "'>" + res.datas + "</a></p>";
						$(".contentDetail .cellphone").append(html);
					}
				});

				//	判断是否收藏
				if(data.datas.is_favorate) {
					$('.footer-menu .like').addClass('active');
				}

				//立即购买
				//先清除以前的事件
				$('.footer-menu .apot').off('tap').on('tap', function() {
					var key = _.userInfo.getKey();
					if(!key) {
						checkLogin(0);
						return;
					}
					var gc_id = $goods_info.gc_id;
					var goods_price = parseFloat($goods_info.goods_price).toFixed(2);
					var goods_amount = goods_price;
					var goods_unit = $goods_info.goods_unit || '';
					if(!common_books_Page) {
						common_books_Page = plus.webview.getWebviewById('common_books');
					}
					//触发预约页面的加载数据事件   
					//这里要传递的数据，要包含商品id，分类id，规格，数量，单位以及金额等数据，到订单页面需要使用。
					var orderinfo = {
						gc_id: $goods_info.gc_id,
						goods_name: $goods_info.goods_name,
						goods_id: $goods_info.goods_id,
						prop: $goods_info.prop,
						goods_price: $goods_info.goods_price,
						store_info: $store_info.company_name,
						goods_image: data.datas.goods_image.split(",")[0],
						mobile_body: $goods_info.mobile_body
					};
					
					mui.openWindow({
						url: '../tmpl/order/coupon_buy.html',
						id: 'coupon_buy',
						extras: {
							orderinfo: orderinfo
						}
					});  

				})

				//加入收藏列表
				//先清除以前的事件,否则会多次绑定事件
				$('.footer-menu .like').off('tap').on('tap', function(e) {
					var $this = $(this);
					if($this.hasClass('active')) {
						if(dropFavoriteGoods(goodsId)) {
							$this.removeClass('active');
						}
					} else {
						if(favoriteGoods(goodsId)) {
							$this.addClass('active');
						}
					}
					return false;
				})

			},
			error: function(error) {
				console.log('ajax调用异常');
			},
			complete: function() {
				$("#loading").fadeOut();
			}
		})
	}

})