mui.init();
var $classInfo = null;
var $userinfo = _.userInfo.get();
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	$classInfo = self.classInfo;
	$(".nanny").attr("data-gcid", $classInfo.gcId);

})
//获取预产期
var $date = new Date(),
	$year = $date.getFullYear(),
	$mon = $date.getMonth() + 1,
	$arr = [];
for(var i = 0; i < 9; i++) {
	if($mon + i > 12) {
		var $fullyear = $year + 1,
			$fullmon = $mon + i - 12;
		$arr.push($fullyear + '-' + '0' + $fullmon);
	} else {
		var $fullmon = $mon + i >= 10 ? $mon + i : '0' + parseInt($mon + i);
		$arr.push($year + '-' + $fullmon);
	}
}
var html = '';
for(var i = 0; i < $arr.length; i++) {
	html += '<label for="">' + $arr[i].substring(0, 4) + '年<strong class="six">' + $arr[i].substring(5, 7) + '月</strong><input type="radio" name="yeary"/><span></span></label>';
}
$('.monthTime menu').html(html);
$('.monthTime menu label').eq(0).find('input[type="radio"]').prop('checked', true);
//获取预产期结束

mui.plusReady(function() {
	if($userinfo != null) {
		$('#sex').val($userinfo.username);
		$('#phone').val($userinfo.phone);
	}

	$(".select-month").find("button").on("tap", function(e) {
		var tel = $(".month-timeinp").val();
		var name = $(".month-name").val();
		if(name == "") {
			alert("请输入姓名");
		} else if(!(/^1[3-8]\d{9}$/.test(tel))) {
			alert("请输入正确手机号码");
		} else {
			$(".nanny").css("display", "block").siblings("section").css("display", "none");
		}
	})
})


document.addEventListener('.city', function(event) {
	console.log(event);
	$('header .city').text(event.detail.name).attr('data-id', event.detail.id);
}, false);

$('header .city').on('tap', function() {
	mui.openWindow({
		url: 'city.html',
		id: 'city.html',
		waiting: {
			autoShow: true,
			title: '正在加载...'
		}
	})
})

setTimeout(function() {
	var gc_id = $classInfo.gcId;
	//获取列表页banner
	$.ajax({
		type: "get",
		url: ApiUrl + "/index.php?act=banner&op=get20171009",
		async: true,
		data: {
			gc_id: gc_id
		},
		success: function(res) {
			var html = '';
			var data = JSON.parse(res);
			var result = data.datas.banner_position_list;
			//			for(var i = 0;i < result.length;i++){
			//				for(var j = 0;j < result[i].length;j++){
			//					html += '<img src="'+result[i][j].banner_img+'" alt="">'
			//				}
			//			}
			if(result != '') {
				html = '<img src="' + result[0][0].banner_img + '" alt="">'
			} else {
				html = '<img src="../images/month/month-1.png" alt="">'
			}
			$(".nanny .swiper").html(html);
		}
	});

	$(function() {
		var itemIndex = 0;
		var tab1LoadEnd = false;
		var tab2LoadEnd = false;
		var tab3LoadEnd = false;
		var tab4LoadEnd = false;
		var counter = 0;
		var order = 0;

		// tab
		$('.filter nav').on('click', 'a', function() {
			var $this = $(this);
			itemIndex = $this.index();
			$this.addClass('active').siblings('a').removeClass('active');
			$('.product').eq(itemIndex).show().siblings('.product').hide();
			counter = 0;
			$('.product').eq(itemIndex).html("");
			if($this.hasClass('traget')) {

				console.log('---traget')
				$this.toggleClass('changeBg');

				if($this.hasClass('changeBg')) {
					console.log('--------desc')
					order = 1;
					$('.product').eq(itemIndex).html("");
				} else {
					order = 0;
					$('.product').eq(itemIndex).html("");
					console.log('---------ss');
				}

			} else {

				console.log('------ddd');

			}

			// 如果选中菜单一
			if(itemIndex == '0') {
				// 如果数据没有加载完
				if(!tab1LoadEnd) {
					// 解锁
					dropload.unlock();
					dropload.noData(false);
				} else {
					// 锁定
					dropload.lock('down');
					dropload.noData();
				}
				// 如果选中菜单二
			} else if(itemIndex == '1') {
				if(!tab2LoadEnd) {
					// 解锁
					dropload.unlock();
					dropload.noData(false);
				} else {
					// 锁定
					dropload.lock('down');
					dropload.noData();
				}
			} else if(itemIndex == '2') {
				if(!tab3LoadEnd) {
					// 解锁
					dropload.unlock();
					dropload.noData(false);
				} else {
					// 锁定
					dropload.lock('down');
					dropload.noData();
				}
			} else if(itemIndex == '3') {
				if(!tab4LoadEnd) {
					// 解锁
					dropload.unlock();
					dropload.noData(false);
				} else {
					// 锁定
					dropload.lock('down');
					dropload.noData();
				}
			}
			// 重置
			dropload.resetload();
		});

		// 每页展示4个
		var num = 4;
		var pageStart = 0,
			pageEnd = 0;

		// dropload
		var dropload = $('.content').dropload({
			scrollArea: window,
			domDown: {
				domClass: 'dropload-down',
				domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
				domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
				domNoData: '<div class="dropload-noData">--暂无更多数据--</div>'
			},
			loadDownFn: function(me) {
				counter++;
				// 加载菜单一的数据
				if(itemIndex == '0') {

					getListData(gc_id, counter, 0, "", me, itemIndex);
					// 加载菜单二的数据
				} else if(itemIndex == '1') {
					//	            	counter++;
					console.log("order----" + order);
					getListData(gc_id, counter, 3, order, me, itemIndex);
				} else if(itemIndex == '2') {
					//	            	counter++;
					console.log("order----" + order);
					getListData(gc_id, counter, 1, order, me, itemIndex);
				} else if(itemIndex == '3') {
					//	            	counter++;
					getListData(gc_id, counter, 4, order, me, itemIndex);
				}
			}
		});
	});
}, 1000);

function getListData(gcId, page, key, order, me, index) {
	$.ajax({
		type: 'GET',
		url: ApiUrl + "/index.php?act=service_goods&op=goods_list",
		data: {
			gc_id: gcId,
			curpage: page,
			key: key,
			order: order
		},
		dataType: 'json',
		success: function(data) {
			//console.log(JSON.stringify(data));
			pageEnd = data.page_total;
			//console.log(pageEnd);
			if(page <= pageEnd) {
				var html = template.render("list", data);
				$('.product').eq(index).append(html);
			} else {
				tab1LoadEnd = true;
				me.lock("down");
				me.noData();
				counter = 0;
			}
			// 为了测试，延迟1秒加载
			setTimeout(function() {
				// 每次数据加载完，必须重置
				me.resetload();
			}, 300);
			//	模板url
			var $url = data.datas.extend.app_detail_templet;
			console.log($url);
			$('.product').eq(index).on('tap', '.product-item', function() {
				var goodsId = $(this).attr('data-goods-id');
				mui.openWindow({
					url: $url,
					id: _.pageName.service_detail,
					extras: {
						goodsId: goodsId
					},
					waiting: {
						autoShow: true,
						title: '正在加载...'
					}
				})
			})
		},
		error: function(xhr, type) {
			console.log('Ajax error!');
			// 即使加载出错，也得重置
			me.resetload();
		}
	});
}