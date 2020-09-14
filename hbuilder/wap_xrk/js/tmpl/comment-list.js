


mui.init({
	swipeBack: true
});
mui.plusReady(function(){
	var self = plus.webview.currentWebview();
	console.log(self.articleId);
	var $articleId = self.articleId;
	//评论列表
		var counter = 0;
		var tab1LoadEnd = false;
		var dropload = $('.commentList-content').dropload({
	        scrollArea : window,
	        domDown : {
			   domClass : 'dropload-down',
			   domRefresh : '<div class="dropload-refresh">↑上拉加载更多</div>',
			   domLoad : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
			   domNoData : '<div class="dropload-noData">暂无更多数据</div>'
			},
	        loadDownFn : function(me){
	        	counter++;
	            getNewslist("/index.php?act=service_store&op=pingmore", $articleId, counter, me);
	        }
	    });
	    
	    if(!tab1LoadEnd){
	            // 解锁
	        dropload.unlock();
	        dropload.noData(false);
	    }else{
	        // 锁定
	        dropload.lock('down');
	        dropload.noData();
	    }
	
	
//	$.ajax({
//		type:"get",
//		url:ApiUrl+"/index.php?act=service_store&op=pingmore",
//		data: {
//			articleid: self.articleId
//		},
//		async:true,
//		dataType: 'json',
//		success:function(res) {
//			console.log(JSON.stringify(res));
//			var html = template.render("store-list", res);
//			$(".nannyDetail .store-list").html(html);
//			
//		}
//	});
	
	
	
})

//获取全部评论列表
function getNewslist(url,articleid, page, me){
	var pageEnd = 0;
	$.ajax({
        type: 'GET',
        url:ApiUrl+url,
        data: {
        	articleid: articleid,
        	curpage: page
        },
        dataType: 'json',
        success: function(data){
            pageEnd = data.page_total;
            console.log(pageEnd);
            console.log(data);
			if(page <= pageEnd){
				// 替换模板id
				var html = template.render("store-list", data);
				//替换append 节点
				$(".nannyDetail .store-list").append(html);
				
			}else{
				tab1LoadEnd = true;
            	me.lock("down");
            	me.noData();
			}
            // 为了测试，延迟1秒加载
            setTimeout(function(){
                // 每次数据加载完，必须重置
                me.resetload();
            },300);
			//跳转详情
			
			//今日头条列表
			$(".todayHeadlines-margin").on("tap",function(){
			    mui.openWindow({
				    url:"news-detail.html",
				    id: "news-detail.html",
				    extras: {
				    	articleId: $(this).attr('data-news-id')
				    },
				    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显
				    waiting:{
				      autoShow:false,//自动显示等待框，默认为true
				      title:'正在加载...'//等待对话框上显示的提示内
				    }
				})
			})
                
        },
        error: function(xhr, type){
            console.log('Ajax error!');
            // 即使加载出错，也得重置
            me.resetload();
        }
    });
}