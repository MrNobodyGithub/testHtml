$(function() {
	mui.init({
		swipeBack: true,
		pullRefresh: {
			container: '.mui-content',
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
				contentrefresh: "正在加载...", //可选，正在 加载状态时，上拉加载控件上显示的标题内容
				contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
				callback: pullupRefresh
			}
		}
	});
	
	//定义全局变量
	var keyword = "";
	var curpage = 0;
	
	mui.plusReady(function() {
		var self = null;
		if(!self) {
			self = plus.webview.currentWebview();
		}
		keyword = self.goodsName;
		console.log(self.goodsName); 

		pulldownRefresh();

		$("header .searchText").val(self.goodsName);
		$('.searchText').keypress(function() {
			keyword = $(this).val();
			getSearchlist(keyword, 1, 10, 0);
		});
	})

	//下拉刷新
	function pulldownRefresh() {
		curpage = 1;
		mui.plusReady(function() {
			getSearchlist(keyword, 1, 10, 0);
		})
	}
	
	//上拉更多
	function pullupRefresh() {
		curpage++;
		mui.plusReady(function() {
			getSearchlist(keyword, curpage, 10, 1);
		})
	}
	
	//DOM封装
	function getSearchlist(keyword, curpage, pagesize, pullDirect) {
		var pullRefresh = mui('.mui-content').pullRefresh();
		var parm = {
			keyword: keyword,
			curpage: curpage,
			page: pagesize,
			globalLoading: true
		}
		//搜索列表
		$.ajax({
			url: ApiUrl + "/index.php?act=service_goods&op=goods_list",
			data: parm,
			dataType: "json",
			success: function(res) {
				console.log('我是搜索列表----------' + JSON.stringify(res.datas));
				console.log(res.datas.goods_list.length);
				var hasmore = res.hasmore || false;
				var html = template.render('search-1', res);
				if(curpage == 1) {
					if(res.datas.goods_list.length == 0) {
						var str = '<div style="padding-top:50%;text-align:center;height:100px;font-size: 40px;">暂无数据</div>';
						$('.nanny .product').html(str);
					} else {
						$('.nanny .product').html(html);
						pullRefresh.refresh(true); //恢复滚动
						pullRefresh.scrollTo(0, 0, 100); //滚动置顶
						if(hasmore) {
							pullRefresh.enablePullupToRefresh(); //重置上拉刷新
						} else {
							//如果只有一页 禁止上拉加载
							pullRefresh.disablePullupToRefresh();
						}
					}
				} else {
					$('.nanny .product').append(html);
				}
				if(pullDirect == 1) {
					pullRefresh.endPullupToRefresh(!hasmore);
				} else {
					pullRefresh.endPulldown(true);
				}

				//跳转详情页面
				//	var $url = res.datas.goods_list.extend.app_detail_templet;
				$('.mark').on('tap', function() {
					var $url = $(this).attr('data-url'),
						$goodsId = $(this).find('h2 a').attr('data-search-id');
					console.log($url);
					mui.openWindow({
						url: $url,
						id: $url,
						extras: {
							goodsId: $goodsId
						},
						waiting: {
							autoShow: true,
							title: "正在加载..."
						}
					})
				})

				$('.nanny .product-item').eq(0).addClass('mark1');
				$('.nanny .product-item').eq(1).addClass('mark2');
				$('.nanny .product-item').eq(2).addClass('mark3');
			},
			error: function(xhr, type) {
				if(pullDirect == 1) {
					pullRefresh.endPullupToRefresh(true);
				} else {
					pullRefresh.endPulldownToRefresh(true);
				}
				mui.toast('网络异常,请稍候再试');
			}
		})
	}
	
	//重写mui的返回事件
	var old_back = mui.back;
	mui.back = function() {
		//刷新上一个界面；
		var page = plus.webview.getWebviewById('search.html');
		page.reload(true);
		//继续当前页面原有返回逻辑
		old_back();
	}
})