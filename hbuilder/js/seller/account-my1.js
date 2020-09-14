



$(function() {
	//
	mui.init({
		swipeBack: true,
		pullRefresh: {
			container: '#pullrefresh',
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
	var $key = _.userInfo.getKey();
	//var $key = 'c322bde5f9666559f09c366e2dbdde41';
	var curPage = 0;
	mui.plusReady(function() {
		pulldownRefresh();
	})

	//下拉刷新
	function pulldownRefresh() {
		curPage = 1;
		mui.plusReady(function(){
		getListData(1, 10, 0);
	})
	}
	//上拉更多
	function pullupRefresh() {
		curPage ++ ;
		mui.plusReady(function(){
		getListData(curPage, 10, 1);
	})
		
	}
	//加载列表数据
	function getListData(curpage, pagesize, pullDirect) {
		pullDirect = pullDirect || 0; //默认下拉
		var pullRefresh = mui('#pullrefresh').pullRefresh();
		var param = {
			curpage: Number(curpage) || 1,
			page: pagesize || 10,
			key: $key,
			globalLoading:true
		};
		console.log(JSON.stringify(param));
		$.ajax({
			type: 'get',
			url:ApiUrl+"/index.php?act=service_store_cash_new&op=getlist",
			data: param,
			dataType: 'json',
			success: function(data) {
//				var data = JSON.parse(data);
				console.log("list----___________"+JSON.stringify(data));	
				var html = template.render('account-my', data); // 我的收入 ,可提现,已冻结template
				var detailsHtml = template.render('details-tem', data); //列表template
				$('.account').html(html);//我的收入 ,可提现,已冻结渲染
				//判断是否可提现
	//			console.log(data.datas.is_cash);
				$("nav .cash").on("tap", function(){
					if(data.datas.is_cash == true){
						mui.openWindow({
							url: "account-my2.html",
							id: "account",
							waiting: {
								autoShow: true,
								title: "正在加载..."
							}
						})
					}else{
						mui.alert("亲!您没有可提现金额!","温馨提示:");
						return false;
					}
				})
				$(".send_list").on("tap","li",function(){
//					mui.toast("kkk")
					//获取自定义属性
					var $cash_id = $(this).attr("data-cash-id");
					if($(this).find("span").hasClass("clearfixFail")){
						//提现失败
						mui.openWindow({
							url: "cash-fail.html",
							id: "cash-fail",
							extras: {
								cashId: $cash_id,
							//	memberId:$member_id
							},
							waiting: {
								autoShow: true,
								title: "正在加载..."
							}
						})
					}else {
						//提现审核中,审核通过,提现成功
						mui.openWindow({
							url: "account-my3.html",
							id: "account-my3",
							extras: {
								cashId: $cash_id
							},
							waiting: {
								autoShow: true,
								title: "正在加载..."
							}
						})
					}
				})
			
				//单击"已冻结"按钮事件
				$("nav .frozenAmount").on("tap", function(){
					// mui.toast("呵呵");
					// if(data.datas.is_cash == true){
					if(0 < data.datas.freeze_cash_amount){
						mui.openWindow({
							url: "account-frozen.html",
							id: "frozen",
							waiting: {
								autoShow: true,
								title: "正在加载..."
							}
						})
					}else{
						mui.alert("亲,您没有冻结金额!","温馨提示:");
						return false;
						
					}
				})
				

              //判断刷新和加载和列表渲染
				var hasmore = data.datas.hasmore || false;
				if(curpage == 1) {
					$('.send_list').html(detailsHtml);
					pullRefresh.refresh(true); //恢复滚动
					pullRefresh.scrollTo(0, 0, 100); //滚动置顶
					if(hasmore){
						pullRefresh.enablePullupToRefresh();//再次启用上拉加载
					}else{
						pullRefresh.endPulldownToRefresh(true);//没有更多数据了
						pullRefresh.disablePullupToRefresh();//禁止用上拉加载
					}
				} else {
					$('.send_list').append(detailsHtml);
				}
				if(pullDirect == 1) {
					pullRefresh.endPullupToRefresh(!hasmore);//hasmore=false结束上拉加载
				} else {
					pullRefresh.endPulldownToRefresh(true); //没有更多数据了
				}
			},
			error: function(xhr, type) {
				curPage = 0;
				if(pullDirect == 1) {
					pullRefresh.endPullupToRefresh(true); //结束上拉加载
				} else {
					pullRefresh.endPulldownToRefresh(true);
				}
				mui.toast('网络异常,请稍候再试');
			}
		});
	}
	
	
	//4.定义刷新事件
	document.addEventListener('refresh', function(event) {
		pulldownRefresh();
	})
	
	
	$(".common-header .bank").on("tap", function(){
	mui.openWindow({
		url: "bank-card.html",
		id: "account",
		waiting: {
			autoShow: true,
			title: "正在加载..."
		}
	})
})
})




















/*

mui.init({
	swipeBack:true,
	
});

 
//mui.plusReady(function(){
//	self = plus.webview.currentWebview();
	var $key    =   _.userInfo.getKey();
//	var $key ="64f6185d0ce5ec17d1aed8a240e0d77c";
//	console.log("**********"+ $key +"="+$key);
	//我的账户列表
	$.ajax({
		url:ApiUrl+"/index.php?act=service_store_cash_new&op=getlist",
		type: 'get',
		data: {
			key: $key,
			globalLoading: true
		},
		success: function(res){
			var data = JSON.parse(res);
			console.log("list----___________"+res);	
			var html = template.render('account-my', data);
			var detailsHtml = template.render('details-tem', data);
			
			$('.account').append(html);
			$('.send_list').append(detailsHtml);
			//判断是否可提现
//			console.log(data.datas.is_cash);
			$("nav .cash").on("tap", function(){
				if(data.datas.is_cash == true){
					mui.openWindow({
						url: "account-my2.html",
						id: "account",
						waiting: {
							autoShow: true,
							title: "正在加载..."
						}
					})
				}else{
					mui.alert("亲!您没有可提现金额!","温馨提示:");
					return false;
				}
			})
			$(".list").on("tap","li",function(){
				//获取自定义属性
				var $cash_id = $(this).attr("data-cash-id");
				if($(this).find("span").hasClass("clearfixFail")){
					//提现失败
					mui.openWindow({
						url: "cash-fail.html",
						id: "cash-fail",
						extras: {
							cashId: $cash_id,
						//	memberId:$member_id
						},
						waiting: {
							autoShow: true,
							title: "正在加载..."
						}
					})
				}else {
					//提现审核中,审核通过,提现成功
					mui.openWindow({
						url: "account-my3.html",
						id: "account-my3",
						extras: {
							cashId: $cash_id
						},
						waiting: {
							autoShow: true,
							title: "正在加载..."
						}
					})
				}
			})
		
			//单击"已冻结"按钮事件
			$("nav .frozenAmount").on("tap", function(){
				// mui.toast("呵呵");
				// if(data.datas.is_cash == true){
				if(0 < data.datas.freeze_cash_amount){
					mui.openWindow({
						url: "account-frozen.html",
						id: "frozen",
						waiting: {
							autoShow: true,
							title: "正在加载..."
						}
					})
				}else{
					mui.alert("亲,您没有冻结金额!","温馨提示:");
					return false;
					
				}
			})
			
		}
		
	})
	


//})
*/

/**
 * @description 增加银行家页面跳转
 * @author zhaobing
 * @version 2017年7月20日14:12:07
 */
/*
$(".common-header .bank").on("tap", function(){
	mui.openWindow({
		url: "bank-card.html",
		id: "account",
		waiting: {
			autoShow: true,
			title: "正在加载..."
		}
	})
})
*/