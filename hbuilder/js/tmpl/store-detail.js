mui.init({
    swipeBack: true,
    pullRefresh: {
        container: '.store-list',
        down: {
            style: 'circle',
            color: '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
            height: 50, //可选,默认50.触发下拉刷新拖动距离,
            auto: false, //可选,默认false.首次加载自动上拉刷新一次
            callback: pulldownRefresh
        },
        up: {
            height: 50, //可选.默认50.触发上拉加载拖动距离
            auto: false, //可选,默认false.自动上拉加载一次
            contentrefresh: "正在加载...", //可选，正在 加载状态时，上拉加载控件上显示的标题内容
            contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
            callback: pullupRefresh
        }
    }
});
var curpage = 0;
var id = 0;
mui.plusReady(function() {
    var self = plus.webview.currentWebview();
    console.log(self.storeId);
    $(".nannyDetail").attr("data-storeid", self.storeId);
    id = self.storeId;
    pulldownRefresh();
})

// 下拉刷新
function pulldownRefresh() {
	curpage = 1;
    getStoreinfo(id);
    getListdata(id, 1, 0);
}
// 上拉加载
function pullupRefresh() {
    curpage++;
    getListdata(id, curpage, 1);
}

function getStoreinfo(id) {
    //获取店铺信息
    console.log("id===" + id);
    $.ajax({
        type: "get",
        url: ApiUrl + "/index.php?act=service_store&op=getServiceInfo",
        data: {
            store_id: id
        },
        async: true,
        dataType: 'json',
        success: function(res) {
            console.log(JSON.stringify(res));
            console.log(res.datas.store_info.store_credit_text.split(","));
            var html = template.render("monthDetail", res);
            $(".nannyDetail .store-top").html(html);
            plus.nativeUI.closeWaiting();
        }
    });
}

function getListdata(storeId, curpage, pullDirec) {
	console.log('curpage======'+curpage);
    //获取店铺列表信息
    
    var param = {
        store_id: storeId,
        curpage: curpage,
        globalLoading: true
    };
    console.log("param===" + JSON.stringify(param));
    $.ajax({
        type: 'GET',
        url: ApiUrl + '/index.php?act=service_goods&op=goods_list',
        data: param,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            var hasmore = data.hasmore || false;
            var html = template.render("store-list", data);
            if (curpage == 1) {
            	mui('.store-list').pullRefresh().refresh(true); //恢复滚动
            	if(data.datas.goods_list != ''){
	                $(".nannyDetail .store-list .list").html(html);
	                if (hasmore) {
	                    mui('.store-list').pullRefresh().enablePullupToRefresh(); //重置上拉刷新
	                } else {
		                mui('.store-list').pullRefresh().scrollTo(0, 0, 100); //滚动置顶
	                    //如果只有一页 禁止上拉加载
	                    mui('.store-list').pullRefresh().disablePullupToRefresh();
	                }
            	}else{
            		var html = '<div style="padding-top:50px;font-size: 40px;text-align: center;background: #eee;">暂无服务</div>';
            		$(".nannyDetail .store-list .list").html(html);
            	}
            } else {
                $(".nannyDetail .store-list .list").append(html);
            }
            if (pullDirec == 1) {
                mui('.store-list').pullRefresh().endPullupToRefresh(!hasmore);
            } else {
                mui('.store-list').pullRefresh().endPulldown(true);
            }
            //服务商列表详情
            $('body').on('tap', '.store-d', function() {
                var $url = $(this).data('detail-templet') || 'common-detail.html';
            
                mui.openWindow({
                	url: $url,
                    id: $url,
                    extras: {
                    	goodsId: $(this).attr("data-goods-id")
                    },
                    waiting: {
                    	autoShow: true,
                    	title: '正在加载...'
                    }
                })
            })

        },
        error: function(xhr, type) {
            if (pullDirect == 1) {
                mui('.store-list').pullRefresh().endPullupToRefresh(true);
            } else {
                mui('.store-list').pullRefresh().endPulldownToRefresh(true);
            }
            mui.toast('网络异常，请稍后重试!');
        }
    });
}