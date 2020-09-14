//var _cityinfo=window.localStorage.getItem('cityinfo') ? window.localStorage.getItem('cityinfo') : 224;;
var _cityinfo= 224;;
var gc_id="";
mui.init();
var $classInfo = null;
var $userinfo = _.userInfo.get();
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	$classInfo = self.classInfo;
	$(".clean").attr("data-gcid", $classInfo.gcId);
	$(".common-header-yellow h1").html($classInfo.className);
	plus.nativeUI.showWaiting();
	gc_id = $classInfo.gcId;
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

/*setTimeout(function() {
	var gc_id = $classInfo.gcId;
}, 1000);*/


	$(function() {
		var itemIndex = 0;
		var tab1LoadEnd = false;
		var tab2LoadEnd = false;
		var tab3LoadEnd = false;
		var tab4LoadEnd = false;
		var counter = 0;
		var order = 0;

	//获取列表页banner
	$.ajax({
		type: "get",
		url: ApiUrl + "/index.php?act=banner&op=get20171009",
		async: true,
		data: {
			gc_id: gc_id,
			area_id: 224
		},
		success: function(res) {
			var html = '';
			var data = JSON.parse(res);
			var result = data.datas.banner_position_list;
			if(result != '') {
				html = '<img src="' + result[0][0].banner_img + '" alt="">';
			} else {
				html = '<img src="../images/banner_02.jpg" alt="">';
			}

			$(".clean .swiper").html(html);
			plus.nativeUI.closeWaiting();
		}
	});


		//查询区
		$.ajax({
			type: "post",
			url: ApiUrl + "/index.php?act=zx_cityarea&op=cityarea",
			async: true,
			dataType: 'json',
			data: {
				parent_id: _cityinfo
			},
			success: function(data) {
				console.log(data);
				var _area = "";
				/*$.each(data,function(i,item){
				});*/
				for(var iCount = 0; iCount < data.datas.length; iCount++) {
					_area += "<input type='radio' name='rdoArea' value='" + data.datas[iCount].area_id + "|" + data.datas[iCount].area_name + "' style='width:20px;height:20px;' /><span style='font-size:20px;'>" + data.datas[iCount].area_name + "</span>&nbsp;&nbsp;";
				}
				$("#spanArea").html(_area);
			}
		});

		$("body").on('tap', ".confirm", function() {
			console.log('测试高级筛选条件');
			var $type = $('.screening .type .active').attr('data-is-person');
			var $start = $('.screening .price .start').val();
			var $end = $('.screening .price .end').val();
			var rdoSel = $(":radio[name='rdoArea']:checked").val();
			var rdoSelArr = rdoSel.split('|');
			$.ajax({
				type: "post",
				url: ApiUrl + "/index.php?act=service_goods&op=goods_list",
				async: true,
				dataType: 'json',
				data: {
					gc_id: gc_id,
					order: order,
					//minPrice: $start,
					//maxPrice: $end,
					area_id: rdoSelArr[0] //"109",  //市ID
					//area_id_1: rdoSelArr[1] //"鞍山市" //区ID
				},
				success: function(res) {
					console.log(JSON.stringify(res));
					if(res.code == 200) {
						$('.screening').slideUp("slow");
						if($(".content").css("position") == "fixed") {
							$(".content").css("position", "");
							$(".screening").css("top", parseInt(_top));
						}
						var result = template.render("list", res);
						$('.clean .product').eq(0).html(result);
					}
				}
			});
		})
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
		var pageStart = 0,
			pageEnd = 0;

		// dropload
		var dropload = $('.content').dropload({
			scrollArea: window,
			domDown: {
				domClass: 'dropload-down',
				domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
				domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
				domNoData: '<div class="dropload-noData">暂无更多数据</div>'
			},
			loadDownFn: function(me) {
				// 加载菜单一的数据
				console.log(counter);
				if(itemIndex == '0') {
					counter++;
					getListData(gc_id, counter, 0, "", me, itemIndex);
					// 加载菜单二的数据
				} else if(itemIndex == '1') {
					counter++;
					console.log("order----" + order);
					getListData(gc_id, counter, 3, order, me, itemIndex);
				} else if(itemIndex == '2') {
					counter++;
					console.log("order----" + order);
					getListData(gc_id, counter, 1, order, me, itemIndex);
				} else if(itemIndex == '3') {
					counter++;
					getListData(gc_id, counter, 4, order, me, itemIndex);
				}
			}
		});
	});



function getListData(gcId, page, key, order, me, index) {
	$.ajax({
		type: 'GET',
		url: ApiUrl + '/index.php?act=service_goods&op=goods_list',
		data: {
			gc_id: gcId,
			curpage: page,
			key: key,
			order: order
		},
		dataType: 'json',
		success: function(data) {
			pageEnd = data.page_total;
			console.log(pageEnd);
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
			//	转换url
			var $url = data.datas.extend.app_detail_templet;
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