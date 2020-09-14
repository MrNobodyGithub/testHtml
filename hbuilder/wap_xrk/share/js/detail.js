/*
王敏

 需要传参key，goodsId
* */



//预加载预约页面来传值，通过fire自定义事件触发
//mui.init({
//	swipeBack: true,
//	preloadPages: [{
//		id: 'common_books',
//		url: 'common_books.html'
//	}]
//});
var common_books_Page = null;
//TODO 逐步改进，业务逻辑不要放在plusReady中。
//mui.plusReady(function() {
//	var webview = plus.webview.currentWebview();
//	var $goodsId = webview.goodsId;
	var $goodsId = '110657';
	//console.log($goodsId);

//	var $key = _.userInfo.getKey();
	var $key = 'e0eaf92ef837246e959cafe1d1d8f8fe';
	//console.log($key);
	var $goodsId = encodeURI(getQueryString("goodsId"));
	var $key = encodeURI(getQueryString("key"));
	console.log("$goodsId" + $goodsId);
	console.log("$key" + $key);
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
				goods_id: goodsId
			},
			beforeSend: function () {
				$("#loading").fadeIn();
			},
			success: function (data) {
				//				console.log($key);
				//				console.log(goodsId);
				console.log(JSON.stringify(data));
				if (data.code == 400) {
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
					$geval_content = data.datas,
					$spec_value_simple = {}; //简化规格值用
				//	模板渲染=>填充值
				var $html = template.render("contentDetailTpl", data);
				$(".contentDetail").html($html);

				//	服务详情填充
				var $body = $goods_info.mobile_body;
				if ($body != "") {
					$(".product-detail .product").html($body);
				} else {
					var $body = '<div class="detail_nodata" style=""><img src="../images/ucenter/nodata-error.png" /></div><div style="text-align:center;font-size: 25px;">暂无数据</div>';
					$(".product-detail .worktime-check").html($body);
				}

				//电话咨询 这里电话咨询是干什么的，取得谁的电话？是平台还是商户？每次都要取一次？太费劲！！！
				$.ajax({
					type: "get",
					url: ApiUrl + "/index.php?act=zx_setting&op=getphone",
					async: true,
					dataType: 'json',
					success: function (res) {
						//曾旭的接口写的。。。不要用数组不明意思的东西。
						var html = "<p><a href='tel:" + res.datas + "'>" + res.datas + "</a></p>";

						$(".contentDetail .cellphone").append(html);
					}
				});

				//	更多资料跳转
				var $is_person = $store_info.is_person || 1;
				console.log("是否个人" + $is_person);
				$('.detail-info .bottom').on('tap', 'a', function () {
					if ($is_person == 0) {
						if(plus.webview.getWebviewById("store-detail")){
							var view = plus.webview.getWebviewById("store-detail");
							view.reload(true);
						}
						mui.openWindow({
							url: 'store-detail.html',
							id: 'store-detail',
							extras: {
								storeId: $store_info.store_id
							},
							waiting: {
								autoShow: true,
								title: "正在加载..."
							}
						})
					} else if ($is_person == 1) {
						mui.openWindow({
							url: 'personal-detail.html',
							id: 'personal-detail',
							extras: {
								goods_id: goodsId
							},
							waiting: {
								autoShow: true,
								title: "正在加载..."
							}
						})
					} else {
						console.log("$is_person == else");

					}

				})

				//	判断是否收藏
				//	console.log(data.datas.is_favorate);
				if (data.datas.is_favorate) {
					$('.footer-menu .like').addClass('active');
				}

				//规格点击函数
				var fn_spec_tap = function (el) {
					var $this = $(el);
					var $active = $this.hasClass('active');
					if ($active) {
						return false;
					}
					//本来只在未激活的元素上触发事件，可以不需要上面的判断
					$this.addClass('active').siblings().removeClass('active');
					var curEle = $(".price-content dd.active");
					var curSpec = [];
					$.each(curEle, function (i, v) {
						// convert to int type then sort
						curSpec.push(parseInt($(v).attr("spec_value_id")) || 0);
					});
					var spec_string = curSpec.sort(function (a, b) {
						return a - b;
					}).join("|");
					//获取商品ID
					$goodsId = $spec_list[spec_string];
					get_detail($goodsId);
				}

				//规格内容填充
				//清空规格存储容器
				//规格的容器怎么取这个名字？？spec-content
				$('.price-content').empty();
				if ($spec_name != null && $spec_value != null) {
					for (x in $spec_name) {
						var $dl_spec_name = $('<dl spec_name_id="' + x + '"><dt>' + $spec_name[x] + '</dt></dl>');
						for (k in $spec_value[x]) {
							var isactive = ($goods_info.goods_spec[k]) ? true : false;
							var $dd_spec_value = $('<dd spec_value_id="' + k + '">' + $spec_value[x][k] + '</dd>');
							if (isactive) {
								$spec_value_simple[x] = $spec_value[x][k];
								$dd_spec_value.addClass('active');
							} else {
								//绑定事件
								$dd_spec_value.on('tap', function () {
									fn_spec_tap(this);
								})
							}
							$dl_spec_name.append($dd_spec_value);
						}
						$('.price-content').append($dl_spec_name);
					}
				}
				//立即预约
				//先清除以前的事件
				$('.footer-menu .apot').off('tap').on('tap', function () {
//					var key = _.userInfo.getKey();
//					if (!key) {
//						checkLogin(0);
//						return;
//					}
					var gc_id = $goods_info.gc_id;
					var goods_price = parseFloat($goods_info.goods_price).toFixed(2);
					var goods_amount = goods_price;
					var goods_unit = $goods_info.goods_unit || '';
//					if (!common_books_Page) {
//						common_books_Page = plus.webview.getWebviewById('common_books');
//					}
					//触发预约页面的加载数据事件   
					//这里要传递的数据，要包含商品id，分类id，规格，数量，单位以及金额等数据，到订单页面需要使用。
					var booksparam = {};
					booksparam.goods_id = goodsId;
					booksparam.gc_id = gc_id;
					booksparam.books_price = goods_price;
					booksparam.books_amount = goods_amount;
					booksparam.books_unit = goods_unit;
					booksparam.books_qty = 1; //数量暂时为1，需要录入数量的时候需要从dom上取
					//简化规格值存储
					booksparam.spec = {
						spec_name: $spec_name,
						spec_value: $spec_value_simple
					};
					booksparam.type_info = $goods_info.type;
					mui.fire(common_books_Page, 'loaddata', booksparam);
//					mui.openWindow({
//						url: 'common_books.html',
//						id: 'common_books',
//						extras: {
//							booksparam: booksparam
//						}
//					});
					window.location.href = 'common_books.html?booksparam='+ encodeURIComponent(JSON.stringify(booksparam));

				})
				//评论查看更多
				//TODO
				$('.mui-pull-right').off('tap').on('tap', function(e) {
					mui.openWindow({
						url: 'comment-detail-list.html',
						id: 'comment-detail-list.html',
						extras: {
							$goodsId: $goodsId
						}
					})
				})

				//客服，TODO 应该加入商品id
				//先清除以前的事件
				$('.footer-menu .kf').off('tap').on("tap", function () {
//					var key = _.userInfo.getKey();
//					if (!key) {
//						checkLogin(0);
//						return;
//					}
					mui.openWindow({
						url: 'chat.html',
						id: 'message_chat',
						waiting: {
							autoShow: true,
							title: "正在加载..."
						}
					})
				})

				//加入收藏列表
				//先清除以前的事件,否则会多次绑定事件
				$('.footer-menu .like').off('tap').on('tap', function (e) {
					var $this = $(this);
					if ($this.hasClass('active')) {
						if (dropFavoriteGoods(goodsId)) {
							$this.removeClass('active');
						}
					} else {
						if (favoriteGoods(goodsId)) {
							$this.addClass('active');
						}
					}
					return false;
				})

			},
			error: function (error) {
				console.log('ajax调用异常');
			},
			complete: function () {
				$("#loading").fadeOut();
			}
		})

	}
	



	//日历 TODO 根本就没有放入档期！！！
	function calendar(starttime, endtime) {
		var mysData = new Date(starttime * 1000);
		var myeData = new Date(endtime * 1000);
		var syear = mysData.getFullYear()
		var smonth = mysData.getMonth();
		var sday = mysData.getDay();
		var eyear = myeData.getFullYear()
		var emonth = myeData.getMonth();
		var eday = myeData.getDay();

		//日历插件
		var
			prevday = syear + "-" + (smonth + 1) + "-" + sday,
			today = eyear + "-" + (emonth + 1) + "-" + (eday - 1);

		$('.date').zdatepicker({
			show: true,
			selected: true,
			viewmonths: 1,
			daystr: ["日", "一", "二", "三", "四", "五", "六"],
			disable: {
				0: {
					0: "1900-06-05",
					1: prevday
				},
				1: {
					0: today,
					1: "2017-07-07" //TODO 写的些什么
				}
			},
			selected: {
				0: {
					0: today
				}
			},
			onReturn: function (date, dateObj, obj, calendar, a, selected) {
				if (selected) $(obj).val(selected.join(','));
			}
		});
	}

//})