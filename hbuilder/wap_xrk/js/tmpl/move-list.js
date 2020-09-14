$(function() {
	mui.init({
		swipeBack: true,
		pullRefresh: {
			container: '.content',
			down: {
				style: 'circle',
				color: '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
				height: 50, //可选,默认50.触发下拉刷新拖动距离,
				auto: false, //可选,默认false.首次加载自动上拉刷新一次
				callback: pulldownRefresh
			},
			up: {
				height: 100, //可选.默认50.触发上拉加载拖动距离
				auto: false, //可选,默认false.自动上拉加载一次
				contentrefresh: '正在加载...',
				callback: pullupRefresh
			}
		}
	});
	
	var $cityInfo = _.getCityInfo() || _.getDefaultCityInfo(); //当前城市对象
	var $key = _.userInfo.getKey();
	var $classInfo = null;
	var activeIndex = 0; //当前激活tab
	var filterCondition = null; //高级过滤条件
	
	//plusReady后加载页面内容
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		$classInfo = self.classInfo;
		$(".common-header-yellow h1").html($classInfo.className);
		$('header .city').text($cityInfo.area_name).attr('data-id', $cityInfo.area_id);
		loadPage();
	})
	
	//加载页面内容
	function loadPage() {
		getBannerList();//获取banner
		getCityArea();
		pulldownRefresh();
	}
	
	//选择城市事件
	document.addEventListener('changecity', function(event) {
		var eventContent = event.detail;
		$cityInfo = {
			'area_id': eventContent.id,
			'area_name': eventContent.name
		};
		$('header .city').text(eventContent.name).attr('data-id', eventContent.id);
		//重新加载页面数据
		//清除所有列表数据
		$('.product').html('');
		cleanFilter();
		loadPage();
	}, false);
	
	//绑定元素事件
	//选择城市点击
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
	// tab 点击
	$('.filter nav').on('tap', 'a', function() {
		var $this = $(this);
		activeIndex = $this.index();
		var isLoad = false;
		if($this.hasClass("active")) {
			$this.toggleClass('changeBg');
			isLoad = true;
		} else {
			$this.addClass('active').siblings('a').removeClass('active');
			$('.product').eq(activeIndex).show().siblings('.product').hide();
		}
		var listContainer = $('.product').eq(activeIndex);
		var oldLen = listContainer.children(".product-item").length;
		if(oldLen === 0 || isLoad) {
			pulldownRefresh();
		} else {
			//滚动到第一个
			var pullRefresh = mui('.content').pullRefresh();
			pullRefresh.scrollTo(0, 0, 100); //滚动置顶
			if(listContainer.data("hasmore")){
				pullRefresh.enablePullupToRefresh();
			}else{
				pullRefresh.endPullupToRefresh(true);
			}
		}
	});
	
	//高级搜索确认
	$(".screening .confirm").on('tap', function() {
		//设置高级搜索条件
		filterCondition = {
			is_person: $('.screening .type .active').attr('data-is-person'),
		};
		var rdoSel = $(":radio[name='rdoArea']:checked").val();
		if(rdoSel) {
			var rdoSelArr = rdoSel.split('|');
			filterCondition.area_id = rdoSelArr[0];
		}
		//调用搜索
		pulldownRefresh();
		$(".screening").slideUp("slow");
		$(".filter_mask").removeClass("filter_active");
	});
	//高级搜索取消
	$(".screening .cancle").on('tap', function() {
		//取消高级搜索条件
		cleanFilter();
		//调用搜索
		pulldownRefresh();
		$(".screening").slideUp("slow");
		$(".filter_mask").removeClass("filter_active");
	});
	//清空高级搜索条件
	function cleanFilter() {
		filterCondition = null;
		$.each($("input[name='rdoArea']"), function() {
			this.checked = false;
			$(this).removeAttr("checked");
		});
		$('.screening .type').children("dd").removeClass("active");
	}
	
	
	//获取列表页banner
	function getBannerList() {
		$.ajax({
			type: "get",
			url: ApiUrl + "/index.php?act=banner&op=get20171009",
			async: true,
			data: {
				gc_id: $classInfo.gcId,
				area_id: $cityInfo.area_id
			},
			success: function(res) {
				var html = '';
//				console.log('zhaob11111')
//				console.log(res)
				var data = JSON.parse(res);
				var result = data.datas.banner_position_list;
				if(result != '') {
					html = '<img src="' + result[0][0].banner_img + '" alt="">';
				} else {
					html = '<img src="../images/banner_02.jpg" alt="">';
				}

				$(".swiper").html(html);
			}
		});
	}
	
	//获取城市对应的区域
	function getCityArea() {
		$.ajax({
			type: "post",
			url: ApiUrl + "/index.php?act=zx_cityarea&op=cityarea",
			async: true,
			dataType: 'json',
			data: {
				parent_id: $cityInfo.area_id
			},
			success: function(data) {
				_.debug(data);
				console.log("   " + JSON.stringify(data));
				var _area = "";

				for(var iCount = 0; iCount < data.datas.length; iCount++) {
					for(var j = iCount + 1; j < data.datas.length; j++) {
						var datas = data.datas;
						if(datas[iCount].area_sort < datas[j].area_sort) {
							var tmp = datas[iCount];
							console.log(tmp);
							datas[iCount] = datas[j];
							datas[j] = tmp;
						}
					}
					
					console.log("is_show  " + data.datas[iCount].is_show);
					var is_show = data.datas[iCount].is_show;
					if(is_show == 0) {
						_area == "";
					} else {
						_area += "<input type='radio' name='rdoArea' value='" + data.datas[iCount].area_id + "|" + data.datas[iCount].area_name + "' style='width:0.5rem;height:0.5rem;' /><span style='font-size:0.5rem;'>" + data.datas[iCount].area_name + "</span>&nbsp;&nbsp;";
					}
					if(_area == ""){
						$('.price dt').css('display', 'none');
					}else{
						$('.price dt').css('display', 'block');
					}
				}
				console.log("排序之后的结果" + JSON.stringify(data));
				$("#spanArea").html(_area);
			}
		});
	}
	
	//获取当前激活的tab参数
	function getActiveParam() {
		var key = $('.filter nav a').eq(activeIndex).attr("data-key") || 0;
		var order = $('.filter nav a').eq(activeIndex).hasClass('changeBg') ? 1 : 0;
		var listContainer = $('.product').eq(activeIndex);
		var curpage = parseInt(listContainer.data("data-current-page")) || 0;
		curpage++;
		return {
			key: key,
			order: order,
			curpage: curpage,
			page: pagesize || 10
		}
	}
	//下拉刷新
	function pulldownRefresh() {
		var param = getActiveParam();
		getListData(1, param.page, param.key, param.order, 0);
	}
	//上拉更多
	function pullupRefresh() {
		var param = getActiveParam();
		getListData(param.curpage, param.page, param.key, param.order, 1);
	}
	
	//加载列表数据
	function getListData(curpage, pagesize, orderKind, order, pullDirect) {
		pullDirect = pullDirect || 0; //默认下拉
		var gc_id = $classInfo.gcId;
		var city_id = $cityInfo.area_id;
		var pullRefresh = mui('.content').pullRefresh();
		//TODO 地区id,后台只能按照具体的地区id查询，不能按照市区id查询，是否也没有多个id查询条件
		//globalLoading 补充设置 钢琴加载动画
		var param = {
			gc_id: gc_id,
			city_id:city_id,
			curpage: Number(curpage) || 1,
			page: pagesize || 10,
			key: orderKind || 0,
			order: order || 0,
			globalLoading:true
		};
		if(filterCondition != null) {
			param = $.extend(param, filterCondition);
		}
		console.log(JSON.stringify(param));
		$.ajax({
			type: 'GET',
			url: ApiUrl + "/index.php?act=service_goods&op=goods_list",
			data: param,
			dataType: 'json',
			success: function(data) {
				//console.log(JSON.stringify(data));
				var result = template.render("list", data);
				var listContainer = $('.product').eq(activeIndex);
				var currentNumber = data.datas.goods_list.length;
				if(curpage == 1) {
					listContainer.html(result);
					//pullRefresh.enablePullupToRefresh();
					pullRefresh.refresh(true); //恢复滚动
					pullRefresh.scrollTo(0, 0, 100); //滚动置顶
				} else {
					listContainer.append(result);
				}
				listContainer.data("data-current-page", curpage);

				var hasmore = data.hasmore || false;
				listContainer.data("hasmore", hasmore);
				if(curpage == 1) {
					if(hasmore){
						pullRefresh.enablePullupToRefresh();
					}else{
						pullRefresh.disablePullupToRefresh();
					}
				}
				if(pullDirect == 1) {
					pullRefresh.endPullupToRefresh(!hasmore);
				} else {
					pullRefresh.endPulldown(true);
				}
				// 获取模板url
				var $url = data.datas.extend.app_detail_templet;
				$('.product').eq(activeIndex).off('tap').on('tap', '.product-item', function() {
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
				if(pullDirect == 1) {
					pullRefresh.endPullupToRefresh(true);
				} else {
					pullRefresh.endPulldownToRefresh(true);
				}
				mui.toast('网络异常,请稍候再试');
			}
		});
	}
})
