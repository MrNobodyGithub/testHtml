/**
 *@author：zhaoyangyue
 * @description: 重写上拉加载下拉刷新
 * @version: 2017-08-01
 */
var $key = _.userInfo.getKey();
mui.init({
    swipeBack: true,
    pullRefresh: {
        container: '.newes-box',
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
mui.plusReady(function() {
    pulldownRefresh();
})

//下拉刷新
function pulldownRefresh() {
    mui.plusReady(function() {
        getNewslist(1, 0);
    });
}

//上拉加载
function pullupRefresh() {
    curpage++;
    mui.plusReady(function() {
        getNewslist(curpage, 1);
    })
};

//获取文章列表
function getNewslist(curpage, pullDirect) {
    pullDirect = pullDirect || 0; //默认下拉
    var pullRefresh = mui('.newes-box').pullRefresh();
    var param = {
        article_id: 6,
        curpage: curpage,
        page: 10,
        globalLoading: true
    };
    console.log(JSON.stringify(param));
    $.ajax({
        type: 'GET',
        url: ApiUrl + '/index.php?act=service_store&op=articlelist',
        data: param,
        dataType: 'json',
        success: function(data) {
            console.log(JSON.stringify(data));
            var hasmore = data.hasmore || false;
            var html = template.render('news-list', data);
            if (curpage == 1) {
                $('.todayHeadlines-content').html(html);
                pullRefresh.refresh(true); //恢复滚动
                pullRefresh.scrollTo(0, 0, 100); //滚动置顶
                if (hasmore) {
                    pullRefresh.enablePullupToRefresh();
                } else {
                    //如果只有一页 禁止上拉加载
                    pullRefresh.disablePullupToRefresh();
                }
            } else {
                $('.todayHeadlines-content').append(html);
            }

            //          console.log("hasmore==" + hasmore);
            if (pullDirect == 1) {
                pullRefresh.endPullupToRefresh(!hasmore);
            } else {
                pullRefresh.endPulldown(true);
            }
            
            
            
            //今日头条详情
            $(".todayHeadlines-margin").on("tap", function() {
            	console.log($key);
            	if(!$key){
            		checkLogin(0);
            		return;
            	}else{
            		
            		mui.openWindow({
            		    url: "news-detail.html",
            		    id: "news-detail.html",
            		    extras: {
            		        articleId: $(this).attr('data-news-id')
            		    },
            		    createNew: false, //是否重复创建同样id的webview，默认为false:不重复创建，直接显
            		    waiting: {
            		        autoShow: false, //自动显示等待框，默认为true
            		        title: '正在加载...' //等待对话框上显示的提示内
            		    }
            		})
            	}
            })

        },
        error: function(xhr, type) {
            if (pullDirect == 1) {
                pullRefresh.endPullupToRefresh(true);
            } else {
                pullRefresh.endPulldownToRefresh(true);
            }
            mui.toast('网络异常，请稍后重试!');
        }
    });
}