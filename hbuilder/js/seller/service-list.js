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
		getListData(1, 10, 0);
	}
	//上拉更多
	function pullupRefresh() {
		curPage ++ ;
		getListData(curPage, 10, 1);
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
			type: 'GET',
			url: ApiUrl + "/index.php?act=seller_service&op=service_list",
			data: param,
			dataType: 'json',
			success: function(data) {
				console.log(JSON.stringify(data));
				var result = template.render("server-list", data);
//				var currentNumber = data.datas.goods_list.length;
				var hasmore = data.hasmore || false;
				if(curpage == 1) {
					$('.send_list').html(result);
					pullRefresh.refresh(true); //恢复滚动
					pullRefresh.scrollTo(0, 0, 100); //滚动置顶
					if(hasmore){
						pullRefresh.enablePullupToRefresh();
					}else{
						pullRefresh.endPulldownToRefresh(true);
						pullRefresh.disablePullupToRefresh();
					}
				} else {
					$('.send_list').append(result);
				}
				if(pullDirect == 1) {
					pullRefresh.endPullupToRefresh(!hasmore);
				} else {
					pullRefresh.endPulldownToRefresh(true);
				}
			},
			error: function(xhr, type) {
				curPage = 0;
				if(pullDirect == 1) {
					pullRefresh.endPullupToRefresh(true);
				} else {
					pullRefresh.endPulldownToRefresh(true);
				}
				mui.toast('网络异常,请稍候再试');
			}
		});
	}
	//绑定事件
	//1.修改
	$(".send_list").on("tap",".edit",function(){
		mui.openWindow({
		    url:"service-edit.html?commonid="+$(this).attr("commonid"),
		    id:"service-edit",
		    waiting:{
		      autoShow:true,//自动显示等待框，默认为true
		      title:'正在加载...'//等待对话框上显示的提示内
		    }
		})
	});
	//2.删除,接口改为下架，不做物理删除
	$(".send_list").on("tap",".sendser-del",function(){
		var $this = $(this)
		var btnArray = ['否', '是'];
        mui.confirm('是否确定下架该服务项目？', '向日葵来了', btnArray, function(e) {
            if (e.index == 1) {
				$.ajax({
					type:"post",
					url:ApiUrl+"/index.php?act=seller_service&op=service_unshow",
					data:{
						commonids:$this.attr("commonid"),
						key:$key
					},
					success:function(res){
						console.log(res)
						var data = $.parseJSON(res)
						if(data.code == 200){
							mui.toast("下架成功")
							//$this.parent().parent().remove();
							//重新刷新
							pulldownRefresh();
						}else{
							mui.toast("下架失败");
						}
					}
				});
			}
		})	
	});
	//3.发布
	$(".footer-img").on("tap",function(){
		mui.openWindow({
		    url:"service-add.html",
		    id:"service-add",
		    waiting:{
		      autoShow:true,//自动显示等待框，默认为true
		      title:'正在加载...'//等待对话框上显示的提示内
		    }
		})
	})
	//4.定义刷新事件
	document.addEventListener('refresh', function(event) {
		pulldownRefresh();
	})
})