//定义全局变量
var sHistory = [];
var $cityInfo = _.getCityInfo() || _.getDefaultCityInfo(); //当前城市对象
var $key = _.userInfo.getKey();
var ApiUrl = "http://test.hisunflower.com/mobile";
var WapSiteUrl = 'http://127.0.0.1:8020/wap_xrk';
var _self;
//方法调用
setCity();//设置城市
pulldownRefresh();//下拉刷新

function pulldownRefresh() {
	getIndexbanner();//轮播图方法
	loadPage();//初始化页面方法
}

function loadPage() {
	recommendKind();// 推荐分类
	getNews();// 头条
	beautifulAunt();//最美孕妈
	haierElectrical();//海尔电器
	couponEvent();//优惠券点击事件
	recommendSeller();// 优质服务商
}

//今日头条 列表页跳转
$(".index-shop-news").on("tap", ".new-list", function() {
	mui.openWindow({
		url: "tmpl/news-list.html"
	})
})

// 城市列表跳转
$('header .city').on('tap', function() {
	mui.openWindow({
		url: 'tmpl/city.html',
		id: 'city.html',
		waiting: {
			autoShow: true,
			title: '正在加载...'
		}
	})
})

//模块跳转
$(".nav1").on('tap', 'a', function() {
	var key = _.userInfo.getKey();
	if(!key) {
		checkLogin(0);
		return;
	}
	var gcId = $(this).attr('data-gc-id');
	var typeId = $(this).attr('data-type-id');
	var typeModel = $(this).attr('data-type-model');
	var className = $(this).find('span').html();
	var tmpl = $(this).attr('data-tmpl');
	console.log(tmpl);
	var wid = _.pageName.service_list;
	if(gcId == "0") {
		wid = _.pageName.service_class_list;
	}
	var classInfo = {}
	classInfo.gcId = gcId;
	classInfo.typeId = typeId;
	classInfo.typeModel = typeModel;
	classInfo.className = className;
	classInfo.tmpl = tmpl;
	_.debug(classInfo);

	console.log("测试id====" + wid);

	mui.openWindow({
		url: tmpl + '?classInfo=' + encodeURIComponent(JSON.stringify(classInfo)),
		id: wid,
		waiting: {
			autoShow: true, //自动显示等待框，默认为true
			title: '正在加载...' //等待对话框上显示的提示内
		}
	})
})
//推荐商家详情
$('.company-list').on('tap', '.company-item', function() {
	var key = _.userInfo.getKey();
	if(!key) {
		checkLogin(0);
		return;
	}
	var store_id = $(this).attr('data-store-id');
	mui.openWindow({
		url: 'tmpl/store-detail.html',
		id: 'store-detail',
		extras: {
			storeId: store_id
		},
		waiting: {
			autoShow: true,
			title: '正在加载...'
		}
	})
})
// 下单
$('footer a').eq(2).on('tap', function() {
	footer.publish();
})

// 个人中心
$('footer a').eq(4).on('tap', function() {
	footer.member();
})

//口碑
$('footer a').eq(3).on('tap', function() {
	footer.bbs();
})

//房产
$('footer a').eq(1).on('tap', function() {
	footer.land();
})
/**
 * @author: zhaoyangyue
 * @desc:之前猜你喜欢、推荐商家、优惠券列表切换 现在只有推荐商家
 */
var
	$tab = $('.index-tab a'),
	$content = $('.index-tab-content .tab-content');

$tab.on('tap', function(e) {

	var $this = $(this),
		$num = $this.index();

	$this.addClass('active').siblings().removeClass('active');
	$content.removeClass('show');
	$content.eq($num).fadeIn().siblings().fadeOut();
	return false;
});

/**
 * @author: zhaoyangyue
 * @desc:保留商城跳转  之前设置跳转文章
 */
$(".index-shop-list").on("tap", "a", function() {
	mui.openWindow({
		url: "tmpl/news-detail.html",
		id: _.pageName.news_detail,
		extras: {
			articleId: $(this).attr("data-articleId")
		},
		createNew: false, //所有窗口不允许创建新的，严重注意！！！
		waiting: {
			autoShow: false, //自动显示等待框，默认为true
			title: '正在加载...' //等待对话框上显示的提示内
		}
	})
})

//banner
var bannerObj = {}; //轮播图片对象
var bannerArr = []; //轮播图片数组
function getIndexbanner() {
	bannerObj = {};
	bannerArr = [];
	$('.index-slide .mui-slider-group').html('');
	var $cityInfo = _.getCityInfo() || _.getDefaultCityInfo();
	//全国 banner
	$.ajax({
		url: ApiUrl + '/index.php?act=banner&op=get',
		async: false,
		dataType: "json",
		data: {
			gc_id: 0,
			area_id: 0 //全国
		},
		success: function(res) {
			if(res.datas.banner_position_list != '' && res.datas.banner_position_list[0].length > 0) {
				var banner = res.datas.banner_position_list[0];
				for(var i = 0; i < banner.length; i++) {
					bannerArr.push(banner[i]);
				}
			}
			//本地banner
			$.ajax({
				url: ApiUrl + '/index.php?act=banner&op=get20171009',
				async: false,
				dataType: "json",
				data: {
					gc_id: 0,
					area_id: $cityInfo.area_id
				},
				success: function(data) {
					//解决本地图片为空时默认展示全国图片的bug
					if(bannerArr.length > 0 && bannerArr.length == data.datas.banner_position_list[0].length) {
						var indexArr = [];
						for(var i = 0; i < bannerArr.length; i++) {
							if(bannerArr[i].banner_img == data.datas.banner_position_list[0][i].banner_img) {
								indexArr.push(i);
							}
						}
						if(indexArr.length != 0) {
							for(var i = 0; i < indexArr.length; i++) {
								var index = indexArr[i];
								data.datas.banner_position_list[0].splice(index, 1);
								index--;
							}
						} else {
							if(data.datas.banner_position_list != '') {
								var banner = data.datas.banner_position_list[0];
								for(var i = 0; i < banner.length; i++) {
									bannerArr.push(banner[i]);
								}
							}
						}

					} else {
						if(data.datas.banner_position_list != '') {
							var banner = data.datas.banner_position_list[0];
							for(var i = 0; i < banner.length; i++) {
								bannerArr.push(banner[i]);
							}
						}
					}

					if(data.code == 200) {
						var str = {};
						str.banner_position_list = bannerArr;
						bannerObj.code = 200;
						bannerObj.datas = str;
					}
				}
			});
			if(bannerObj.datas.banner_position_list != '') {
				//插入重复节点 轮播图支持循环  插入最后一个节点
				var before = '<div class="mui-slider-item mui-slider-item-duplicate">\
								<a href="javascript: void(0);">\
									<img src="' + bannerObj.datas.banner_position_list[bannerObj.datas.banner_position_list.length - 1].banner_img + '" />\
								</a>\
							</div>';
				$('.index-slide .mui-slider-group').append(before);

				//插入正常顺序dom
				var html = template.render('index', bannerObj);
				$('.index-slide .mui-slider-group').append(html);

				//插入第一个节点
				var after = '<div class="mui-slider-item mui-slider-item-duplicate">\
								<a href="javascript: void(0);">\
									<img src="' + bannerObj.datas.banner_position_list[0].banner_img + '" />\
								</a>\
							</div>';
				$('.index-slide .mui-slider-group').append(after);

				var indicator = template.render('indicator', bannerObj);
				$('.index-slide .mui-slider-indicator').html(indicator);

				//获得slider插件对象
				var gallery = mui('.mui-slider');
				gallery.slider({
					interval: 3000,
					indicators: true //自动轮播周期，若为0则不自动播放，默认为0；
				});
				//轮播图每次从第一个开始
				gallery.slider().gotoItem('0');
			}

		}
	})
	//只显示本地banner图
	//	$.getJSON(ApiUrl + '/index.php?act=banner&op=get', {
	//		gc_id: 0,
	//		area_id: $cityInfo.area_id
	//	}, function(res) {
	//		console.log(JSON.stringify(res));
	//		//插入重复节点 轮播图支持循环  插入最后一个节点
	//		var before = '<div class="mui-slider-item mui-slider-item-duplicate">\
	//						<a href="javascript: void(0);">\
	//							<img src="'+res.datas.banner_position_list[0][res.datas.banner_position_list[0].length-1].banner_img+'" />\
	//						</a>\
	//					</div>';
	//		$('.index-slide .mui-slider-group').append(before);
	//		
	//		//插入正常顺序dom
	//		var html = template.render('index', res);
	//		$('.index-slide .mui-slider-group').append(html);
	//		
	//		//插入第一个节点
	//		var after = '<div class="mui-slider-item mui-slider-item-duplicate">\
	//						<a href="javascript: void(0);">\
	//							<img src="'+res.datas.banner_position_list[0][0].banner_img+'" />\
	//						</a>\
	//					</div>';
	//		$('.index-slide .mui-slider-group').append(after);
	//
	//		var indicator = template.render('indicator', res);
	//		$('.index-slide .mui-slider-indicator').html(indicator);
	//
	//		//获得slider插件对象
	//		var gallery = mui('.mui-slider');
	//		gallery.slider({
	//			interval: 3000,
	//			indicators: true //自动轮播周期，若为0则不自动播放，默认为0；
	//		});
	//		//轮播图每次从第一个开始
	//		gallery.slider().gotoItem('0');
	//	})
}

//首页今日头条
function getNews() {
	$.getJSON(ApiUrl + '/index.php?act=service_store&op=getarticle', {
		//		ac_id: 8
	}, function(res) {
		var html = template.render('index-list-news', res);
		$('.index-shop-news ul').html(html);
		//今日头条详情  参数名不用连接符
		$(".index-shop-news ul").on("tap", "li", function() {
			var $key = _.userInfo.getKey();
			if(!$key) {
				checkLogin(0);
				return;
			} else {
				mui.openWindow({
					url: "tmpl/news-detail.html",
					id: _.pageName.news_detail,
					extras: {
						articleId: $(this).attr("news-id")
					},
					createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显
					waiting: {
						autoShow: false, //自动显示等待框，默认为true
						title: '正在加载...' //等待对话框上显示的提示内
					}
				})
			}
		})
	});
}

setInterval('AutoScroll("#demo")', 3000);
//添加快讯区域的轮播
function AutoScroll(obj) {
	$(obj).find(".silder00:first").animate({
		marginTop: "-0.65185185rem"
	}, 300, function() {
		$(this).css({
			marginTop: "0px"
		}).find("li:first").appendTo(this);
	});
}
// 设置首页城市
function setCity() {
	var $cityinfo = _.getCityInfo() || _.getDefaultCityInfo();
	if($cityinfo) {
		$('header .city').text($cityinfo.area_name).attr('data-id', $cityinfo.area_id);
	} else {
		$('header .city').text('青岛市').attr('data-id', '224');
	}

}

//模块显示
function recommendKind() {
	$.getJSON(ApiUrl + "/index.php?act=service_goods_class&op=get_best_child", function(res) {
		var html = '';
		for(var i = 0; i < res.datas.length; i++) {
			html += '<a data-tmpl="' + res.datas[i].goods_class_type.app_list_templet + '" data-gc-id="' + res.datas[i].gc_id + '" data-type-id="' + res.datas[i].goods_class_type.type_id + '" data-type-model = "' + res.datas[i].goods_class_type.type_model + '" style="background-image: url(' + res.datas[i].cn_pic + '"><span>' + res.datas[i].gc_name + '</span></a>';
		}
		$(".nav1").html(html);
	})

}
//获取优惠券  --不知以后是否有用 暂放
function getVoucher() {
	$.getJSON(ApiUrl + '/index.php?act=service_store&op=pointvoucher', {
		area_id: $cityInfo.area_id
	}, function(res) {
		var html = template.render('index-actor', res);
		$('.index-actor').html(html);

		$('.index-actor .mui-clearfix a').on('tap', function() {
			var key = _.userInfo.getKey();
			if(!key) {
				checkLogin(0);
				return;
			}
			$.ajax({
				url: ApiUrl + '/index.php?act=member_account&op=voucherexchange',
				type: "post",
				data: {
					key: key,
					vid: $(this).attr("data-vid-id")
				},
				dataType: 'json',
				success: function(res) {
					console.log(JSON.stringify(res))
					if(res.code == 200) {
						mui.toast("领取优惠券成功")
					} else {
						mui.toast(res.datas.error)
					}
				}
			})
		})

	});
}

//推荐商家
function recommendSeller() {
	var $cityInfo = _.getCityInfo() || _.getDefaultCityInfo();
	$.getJSON(ApiUrl + '/index.php?act=service_store&op=recommend_list', {
		area_id: $cityInfo.area_id
	}, function(res) {
		var html = template.render('index-recommend', res);
		$('.index .company-list').html(html);

		$("#loading").fadeOut();

	});
}
//最美孕妈广告  (首页广告)
function beautifulAunt() {
	var $cityInfo = _.getCityInfo() || _.getDefaultCityInfo(); //当前城市对象;
	//全国的首页广告
	$.ajax({
		type: "get",
		url: ApiUrl + "/index.php?act=banner&op=get20171009",
		data: {
			gc_id: -2,
			area_id: 0 //全国
		},
		async: true,
		dataType: "json",
		success: function(res) {
			if(res.datas.banner_position_list != '' && res.datas.banner_position_list != null) {
				var html = template.render('national', res);
				$('.national-advertising').html(html);

				//最美孕妈点击事件
				$('.national-img').on('tap', function() {
					var $key = _.userInfo.getKey();
					var beautifulUrl = $(this).attr('data-href');
					if(!$key) {
						checkLogin(0);
						return;
					} else if(beautifulUrl != "http://" && beautifulUrl != "") {
						mui.openWindow({
							url: 'tmpl/beautifulAunt.html',
							id: 'beautifulAunt.html',
							extras: {
								beautifulUrl: beautifulUrl,
								title: ''
							},
							waiting: {
								autoShow: true,
								title: '正在加载...'
							}
						})
					}
				})
			} else {
				$('.beautiful-aunt').html("");
			}

		}
	});

	//本地的首页广告
	$.ajax({
		type: "get",
		url: ApiUrl + "/index.php?act=banner&op=get20171009",
		data: {
			gc_id: -2,
			area_id: $cityInfo.area_id
		},
		async: true,
		dataType: "json",
		success: function(res) {
			if(res.datas.banner_position_list != '' && res.datas.banner_position_list != null) {
				var html = template.render('beautiful', res);
				$('.beautiful-aunt').html(html);

				//最美孕妈点击事件
				$('.beautiful-img').on('tap', function() {
					var $key = _.userInfo.getKey();
					var beautifulUrl = $(this).attr('data-href');
					console.log('beautifulUrl' + beautifulUrl);
					if(!$key) {
						checkLogin(0);
						return;
					} else if(beautifulUrl != "http://" && beautifulUrl != "") {
						mui.openWindow({
							url: 'tmpl/beautifulAunt.html',
							id: 'beautifulAunt.html',
							extras: {
								beautifulUrl: beautifulUrl,
								title: ''
							},
							waiting: {
								autoShow: true,
								title: '正在加载...'
							}
						})
					}
				})
			} else {
				$('.beautiful-aunt').html("");
			}

		}
	});

}
//优惠券点击事件
function couponEvent() {
	var $cityInfo = _.getCityInfo() || _.getDefaultCityInfo(); //当前城市对象
	$.ajax({
		type: "get",
		url: ApiUrl + "/index.php?act=banner&op=get20171009",
		data: {
			gc_id: "-4",
			area_id: $cityInfo.area_id
		},
		async: false,
		dataType: "json",
		success: function(res) {
			var couponImg = res.datas.banner_position_list.length;
			if(couponImg != 0) {
				$("#coupons").css('display', 'block');
				var html = template.render('coupons_img', res);
				$('#coupons').html(html);
				//海尔电器点击事件
				$('#coupons').on('tap', function() {
					var $key = _.userInfo.getKey();
					if(!$key) {
						checkLogin(0);
						return;
					} else {
						mui.openWindow({
							url: "tmpl/coupon-detail.html?goodsId=107300",
							id: "coupon-detail",
							waiting: {
								autoShow: true,
								title: '正在加载...'
							}
						})
					}
				})
			} else {
				$("#coupons").css('display', 'none');
			}

		}
	});
}
//海尔电器  (首页商城)
function haierElectrical() {
	//	(全国首页商城)
	$.ajax({
		type: "get",
		url: ApiUrl + "/index.php?act=banner&op=get20171009",
		data: {
			gc_id: "-3",
			area_id: '0'
		},
		async: true,
		dataType: "json",
		success: function(res) {
			console.log(res)
			if(res.datas.banner_position_list != '' && res.datas.banner_position_list != null) {
				var beautifulUrl = res.datas.banner_position_list[0][0].banner_url;
				var html = template.render('electrical', res);
				$('.haier-electrical').html(html);
				//海尔电器点击事件
				if(beautifulUrl != "http://" && beautifulUrl != "") {
					$('.electrical-img').on('tap', function() {
						var $key = _.userInfo.getKey();
						if(!$key) {
							checkLogin(0);
							return;
						} else {
							mui.openWindow({
								url: 'tmpl/beautifulAunt.html',
								id: 'beautifulAunt.html',
								extras: {
									beautifulUrl: beautifulUrl,
									title: '海尔电器'
								}
							})
						}
					})
				}
			} else {
				$('.haier-electrical').html("");
			}

		}
	});
}
//猜你喜欢
function getYoulove() {
	//注释了
	/*
	$.getJSON(ApiUrl + '/index.php?act=service_store&op=mylove', {}, function(res) {
		//console.log(res);
		var html = template.render('index-mylove', res);
		$('.index-mylove').html(html);
		$('.mui-content .index-mylove').on('tap', '.activity-item', function() {
			var key = _.userInfo.getKey();
			if(!key) {
				checkLogin(0);
				return;
			}
			var gc_id = $(this).attr('data-gc-id');
			var goods_id = $(this).attr("data-goods-id");

			mui.openWindow({
				url: 'tmpl/common-detail.html',
				extras: {
					goodsId: goods_id,
					gcId: gc_id
				},
				waiting: {
					autoShow: true,
					title: '正在加载...'
				}
			})
		})

	})
	*/
}
// 搜索
function search() {
	//获取本地存储历史搜索
	var _hisicon = window.localStorage.getItem("sHistory");
	//console.log(_hisicon);
	//点击打开搜索
	$('.search-form').on('tap', function(res) {
		$(".index_search").css("display", "block").siblings("section").css("display", "none");
		$('.search-header a input').val("");

		//历史搜索
		var $hisicon = JSON.parse(_hisicon);
		console.log("历史搜索记录--" + $hisicon);
		var hs = '';
		if(_hisicon) {
			for(var i = 0; i < $hisicon.length; i++) {
				hs += '<span>' + $hisicon[i] + '</span>';
			}
			$(".hisicon div").html(hs);
			$(".hisicon div").find('span').eq(0).attr('class', 'active');
			$(".hisicon div").find('span').eq(1).attr('class', 'active');
		}
	})

	//搜索
	$('.search-header a input').keypress(function() {
		var word = $(this).val();
		_hisicon = window.localStorage.getItem("sHistory");
		if(word != '') {
			if(_hisicon) {
				sHistory = JSON.parse(_hisicon);
				sHistory.unshift(word);
				window.localStorage.setItem("sHistory", JSON.stringify(sHistory));
				console.log('本地存储长度--' + sHistory.length);
				if(sHistory.length > 10) {
					sHistory.pop();
					console.log('长度超出时搜索长度--' + sHistory);
					window.localStorage.setItem("sHistory", JSON.stringify(sHistory));
				}
			} else {
				sHistory.unshift(word)
				window.localStorage.setItem("sHistory", JSON.stringify(sHistory));
				console.log(sHistory);
				console.log('上面是历史数据');
			}
			console.log("length--" + sHistory.length);

			var hs = '<span>' + word + '</span>';
			$(".hisicon div").prepend(hs);
			$(".hisicon div").find('span').eq(0).attr('class', 'active');
			$(".hisicon div").find('span').eq(1).attr('class', 'active');

			mui.openWindow({
				url: 'tmpl/search-1.html',
				id: 'search1_list',
				extras: {
					goodsName: word
				},
				waiting: {
					autoShow: true,
					title: '正在加载...'
				}
			})
		}
		//window.localStorage.removeItem("sHistory");
	})

	$(".hisicon div").on("tap", "span", function() {
		console.log($(this).html());
		var word = $(this).html();
		mui.openWindow({
			url: 'tmpl/search-1.html',
			id: 'search1_list',
			extras: {
				goodsName: word
			},
			waiting: {
				autoShow: true,
				title: '正在加载...'
			}
		})
	})

	//删除历史搜索
	$('.hisicon').on('tap', '.del', function() {
		mui.confirm('清除历史搜索？', '', ['确定', '取消'], function(e) {
			if(e.index == 0) {
				$('.hisicon div').html('');
				window.localStorage.removeItem('sHistory');
			}
		})
	})
	//点击关闭搜索
	$(".search_back").on("tap", function() {
		$(".index").css("display", "block").siblings("section").css("display", "none");
		//plus.nativeUI.showWaiting();
		window.location.reload();

		//window.localStorage.removeItem("sHistory");
	})
	//热门服务
	$.getJSON(ApiUrl + '/index.php?act=service_class', function(res) {
		//	console.log(res);
		var html = template.render('index-hoticon', res);
		$('.search-icon .hoticon').find('div').html(html);

		$('.search-icon .hoticon').find('div').find('span').eq(0).attr('class', 'active');
		$('.search-icon .hoticon').find('div').find('span').eq(1).attr('class', 'active');

		$('.search-icon .hoticon').find('div').on('tap', 'span', function() {
			var key = $(this).html();

			_hisicon = window.localStorage.getItem("sHistory");
			if(_hisicon) {
				sHistory = JSON.parse(_hisicon);
				sHistory.unshift(key);
				window.localStorage.setItem("sHistory", JSON.stringify(sHistory));
				console.log(sHistory);

				if(sHistory.length > 10) {
					sHistory.pop();
					console.log('长度超出时搜索长度--' + sHistory);
					window.localStorage.setItem("sHistory", JSON.stringify(sHistory));
				}
			} else {
				sHistory.unshift(key)
				window.localStorage.setItem("sHistory", JSON.stringify(sHistory));
				console.log(sHistory);
				console.log('上面是历史数据');
			}
			//console.log(key);
			mui.openWindow({
				url: 'tmpl/search-1.html',
				id: 'search1.html',
				extras: {
					goodsName: key
				},
				waiting: {
					autoShow: true,
					title: '正在加载...'
				}
			})
		})
	})
}

//搜索页面跳转
$('.search-form').on('tap', function() {
	//	_.openWindow({
	//		url: "tmpl/search.html",
	//		id: _.pageName.member,
	//		reOpen: true
	//	})
	mui.openWindow({
		url: 'tmpl/search.html',
		id: 'search.html'
	})
});

//	首页footer
var footer = {
	//	口碑
	bbs: function() {
		var key = _.userInfo.getKey();
		if(!key) {
			checkLogin(0);
			return;
		}
		window.location.href = 'tmpl/common/feedback-content.html';
	},
	//下单
	publish: function() {
		var key = _.userInfo.getKey();
		if(!key) {
			checkLogin(0);
			return;
		}
		window.location.href = 'tmpl/member/publish_needs_step1.html';
	},
	info: function() {
		var key = _.userInfo.getKey();
		if(!key) {
			checkLogin(0);
			return;
		}
		window.location.href = 'tmpl/message/message_list.html';
	},
	//房产
	land: function() {
		var key = _.userInfo.getKey();
		if(!key) {
			checkLogin(0);
			return;
		}
		window.location.href = 'tmpl/land.html';
	},
	//个人中心(我的)
	member: function() {
		var storeInfo = _.storeInfo.get();
		if(storeInfo && storeInfo.storeId) {
			window.location.href = 'tmpl/seller/seller.html';
		} else {
			window.location.href = 'tmpl/member/member.html';
		}
	}
}