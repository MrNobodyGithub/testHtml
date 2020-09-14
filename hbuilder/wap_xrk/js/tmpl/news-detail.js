var key = _.userInfo.getKey();

mui.init({
    swipeBack: true
});
mui.plusReady(function() {
    var self = plus.webview.currentWebview();
    console.log(self.articleId);
    console.log(key);
    var articleid = self.articleId;
    newDetail(articleid);

    //文章内容
    function newDetail(articleid) {
        $.ajax({
            url: ApiUrl + "/index.php?act=zx_article&op=detail",
            type: 'get',
            data: {
                key: key,
                articleid: articleid,
                globalLoading: true
            },
            async: true,
            success: function(res) {
                var data = JSON.parse(res);
                console.log(res);
                var html = template.render('today-news', data);
                $('.todayHeadlines-detail').html(html);

                //评论内容
                // $.ajax({
                //     type: "get",
                //     url: ApiUrl + "/index.php?act=service_store&op=ping",
                //     data: {
                //         articleid: articleid
                //     },
                //     async: true,
                //     success: function(res) {
                //         var html = '';
                //         var data = JSON.parse(res);
                //         console.log(data);
                //         for (var i = 0; i < data.datas.length; i++) {
                //             html += '<div class="news-comment-item">\
                // 							<header>\
                // 								<h4>' + data.datas[i].member_name + '</h4>\
                // 								<small>' + data.datas[i].comment_time + '</small>\
                // 							</header>\
                // 							<p>' + data.datas[i].comment_message + '</p>\
                // 						</div>';
                //         }
                //         $(".todayHeadlines-detail .news-comment").append(html);
                //     }
                // });
				
				//判断以前是否点赞过
				if(data.datas.is_zan){
					$("#upvote").addClass("upvoteActive");
				}
				
                //点赞  upvote
                $('#upvote').on('tap', function() {
                        var $this = $(this);
                        if ($this.hasClass("upvoteActive")) {
                            $this.removeClass("upvoteActive");
                            dropUpvote();
                            var $dianzan = $('#dianzan').html();
                            $("#dianzan").html(parseInt($dianzan) - 1);
                        } else {
                            $this.addClass("upvoteActive");
                            upvote();
                            var $dianzan = $('#dianzan').html();
                            $("#dianzan").html(parseInt($dianzan) + 1);
                        }
                    })
                    //点赞
                function upvote() {
                    var $url = ApiUrl + '/index.php?act=zx_article&op=clickok';
                    var $data = {
                        key: key,
                        articleid: articleid
                    };
                    _.data.send($url, "post", true, $data, function(res) {
                        if (res.code == 200) {
                            console.log(JSON.stringify(res));
                            mui.toast("点赞成功");
                            //                          window.location.reload();
                        }
                    }, true)
                }
                //取消点赞
                function dropUpvote() {
                    var $url = ApiUrl + '/index.php?act=zx_article&op=clickoff';
                    var $data = {
                        key: key,
                        articleid: articleid
                    };
                    _.data.send($url, "post", true, $data, function(res) {
                        if (res.code == 200) {
                            console.log(JSON.stringify(res));
                            mui.toast("取消点赞");
                            //                          window.location.reload();
                        }
                    }, true)
                }

                //发表评论
                $(".footer-btn .comment .send").on("tap", function() {
                    var comText = $(this).parent().find("input").val();
                    console.log(comText);
                    console.log(self.articleId);
                    if (!key) {
                        mui.alert("请登录");
                        return false;
                    } else {
                        if (comText == '') {
                            mui.toast("评论内容不能为空");
                        } else {
                            $.ajax({
                                type: "post",
                                url: ApiUrl + "/index.php?act=zx_article&op=writecomment",
                                data: {
                                    key: key,
                                    articleid: articleid,
                                    message: comText
                                },
                                async: false,
                                success: function(res) {
                                    console.log(res);
                                    var data = JSON.parse(res);
                                    if (data.code == 200) {
                                        mui.toast("发送评论成功");
                                        window.location.reload();
                                    } else {
                                        mui.toast("发送评失败");
                                        window.location.reload();
                                    }
                                }
                            })
                        }
                    }
                })
                $(".todayHeadlines-detail .todayHeadlines-all-say .mui-pull-right").on("tap", function() {
                    mui.openWindow({
                        url: "comment-list.html",
                        id: "comment",
                        extras: {
                            articleId: articleid
                        },
                        waiting: {
                            autoShow: true,
                            title: "正在加载..."
                        }
                    })
                })
            }
        })
    }
})