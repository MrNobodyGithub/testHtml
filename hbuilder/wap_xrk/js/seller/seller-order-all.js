$(function() {
    /*
	 * 服务商状态就该js文件
	 * 修改慎重！！！
	 * 修改慎重！！！
	 * 修改慎重！！！
	 * */
    var $key = _.userInfo.getKey();
    console.log($key);
    var $pageSize = 10; //分页记录数

    var $activeIndex = 0; //当前激活tab
    var keyword = "";
    var $typeid;

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
    })

    mui.plusReady(function() {
        var self = plus.webview.currentWebview();

        //加载数据
        setTimeout(pulldownRefresh, 1000);
    })
window.addEventListener('refresh', function(e){//执行刷新
    pulldownRefresh();
});
    //订单搜索关键字
    // $('#suggestId').keyup(function() {
    //     keyword = $(this).val();
    //     pulldownRefresh();
    // });
    $('#suggestId').keypress(function(e) {  
        // 回车键事件  
        if(e.which == 13) {
            keyword = $(this).val(); 
            pulldownRefresh(); 
        }  
    });
    $('.own-search .search-img').on('tap', function() {
        keyword = $(this).val(); 
        pulldownRefresh(); 
    });

    // 订单tab切换
    $('.first1 a').on('tap', function() {
        var $this = $(this),
            $index = $this.index();

        console.log('tab index ' + $index);
        console.log($('.first1').html());

        if (!$this.hasClass('active')) {
            //更改样式
            $this.addClass('active').siblings().removeClass('active');
            //处理列表下标
            $activeIndex = $index;
            //计算显示
            $('.order .order-list').eq($index).show().siblings('.order-list').hide();

            //判断是否需要加载数据
            var listContainer = $('.order-list').eq($activeIndex);
            if (listContainer.find('.order-item').length == 0) {
                //加载数据
                pulldownRefresh();
            } else {
                //不加载，但要把下拉刷新处理下
                var pullRefresh = mui('.content').pullRefresh();
              //  pullRefresh.scrollTo(0, 0, 100); //滚动置顶
                var hasmore = listContainer.data('hasmore');
                if (hasmore) {
                    pullRefresh.enablePullupToRefresh();
                } else {
                    pullRefresh.endPullupToRefresh(true);
                }
            }
        }
    })


    //获取当前激活的tab参数
    function getActiveParam() {
        // var key = $('.filter nav a').eq($activeIndex).attr("data-key") || 0;
        // var order = $('.filter nav a').eq($activeIndex).hasClass('changeBg') ? 1 : 0;
        var listContainer = $('.order-list').eq($activeIndex);
        var curpage = parseInt(listContainer.data("data-current-page")) || 0;
        var status = $('.first').find('.active').data('status');
        console.log("getActiveParam $activeIndex" + $activeIndex);
        console.log("getActiveParam curpage" + curpage);
        curpage++;
        return {
            // key: key,
            status: status,
            curpage: curpage,
            page: $pageSize
        }
    }

    //根据当前活动的页面，下拉数显
    function pulldownRefresh() {
        var param = getActiveParam();
        param.curpage = 1;
        orderList(keyword, param, 0);

    }

    //根据当前活动的页面，上拉加载
    function pullupRefresh() {
        var param = getActiveParam();
        orderList(keyword, param, 1);
    }

    // 我购买的
    function orderList(keyword, param, pullDirect) {
        pullDirect = pullDirect || 0; //默认下拉
        var pullRefresh = mui('.content').pullRefresh();
        var $typeid = $('#typeid').val();
        console.log("April===搜索类型" + $typeid);
        console.log("April===搜索key" + keyword);
        var $url = ApiUrl + '/index.php?act=service_order&op=order_list&curpage=' + param.curpage,
            $load = true,
            $data = {
                keyword: keyword,
                type_id: $typeid,
                key: $key, 
                status: param.status, 
                page: param.page
            };
        _.data.send($url, 'post', $load, $data, function(data) {
            if (data.code == 200) {
                console.log("April----------"+JSON.stringify(data));
                var result = template('order-item', data.datas);
                var listContainer = $('.order-list').eq($activeIndex);
                var curpage = param.curpage;
                if (curpage == 1) {
                    listContainer.html(result);
                    pullRefresh.refresh(true);  //恢复滚动
                   // pullRefresh.scrollTo(0, 0, 100); //滚动置顶
                } else {
                    listContainer.append(result);
                }
                listContainer.data("data-current-page", curpage);
                var hasmore = data.hasmore || false;
                listContainer.data("hasmore", hasmore);
                if (curpage == 1) {
                    if (hasmore) {
                        pullRefresh.enablePullupToRefresh();
                    } else {
                        pullRefresh.disablePullupToRefresh();
                    }
                }
                if (pullDirect == 1) {
                    pullRefresh.endPullupToRefresh(!hasmore);
                } else {
                    pullRefresh.endPulldown(true);
                }
            } else {
                if (pullDirect == 1) {
                    pullRefresh.endPullupToRefresh(true);
                } else {
                    pullRefresh.endPulldownToRefresh(true);
                }
                mui.toast('网络异常,请稍候再试');
            }
        })
    }

    //订单状态操作
    $(".order").on("tap", ".order-item footer a", function() {
        var $order_id = $(this).parent().attr('data-order-id');
        console.log("订单id====="+$order_id);

        //修改金额
        if ($(this).text() == '修改金额') {
            $('.mui-popup-input input').attr('type', 'number');
            var goodsAmount = $(this).parent().siblings('.info').find('.goods_amount').attr('data-price');
            var btnArray = ['取消', '确定'];
            mui.prompt('请输入要修改的金额', goodsAmount, '向日葵来了', btnArray, function(e) {
                console.log(JSON.stringify(e));
                console.log($key);
                if (e.index == 1) {
                    /**
                     * @author: zhaoyangyue
                     * @description: 修改金额校验
                     * @version: 2017-7-24
                     */
                    if (isNaN(e.value) || e.value <= 0 || e.value == '') {
                        mui.alert('修改金额有误');
                    }
                    $.ajax({
                        type: "post",
                        url: ApiUrl + "/index.php?act=service_order&op=order_spay_price",
                        dataType: "json",
                        async: true,
                        data: {
                            key: $key,
                            order_id: $order_id,
                            order_fee: e.value
                        },
                        success: function(res) {
                            console.log(JSON.stringify(res));
                            if (res.code == 400) {
                                mui.alert(res.datas.error);
                                return false;
                            }

                            if (res.code == 200) {
                                mui.toast(res.datas);
                                pulldownRefresh();
                            }
                        },
                        error: function(xhr) {
                            console.log(JSON.stringify(xhr));
                        }
                    });
                } else {
                    mui.toast("您取消了修改金额");
                }
            }, 'div');
            document.querySelector('.mui-popup-input input').type = 'number';
        }

        //开始服务
        if ($(this).html() == "开始服务") {
            var btn = ["取消", "确认"];
            var $url = ApiUrl + '/index.php?act=service_order&op=update_orderStatus',
                $load = true,
                status = 24,
                $latitude = 0,
                $longitude = 0,
                $address = '';
            mui.confirm('确认开始服务？', '向日葵来了', btn, function(e) {
                if (e.index == 1) {
                    //测试是否因为调用地理位置而导致无法点击完成服务
                    plus.nativeUI.showWaiting("正在定位...");
                    plus.geolocation.getCurrentPosition(function(p) {
                        plus.nativeUI.closeWaiting();
                        $latitude = p.coords.latitude; //纬度
                        $longitude = p.coords.longitude; //经度
                        $address = p.addresses;

                        console.log("开始服务位置：" + $address);
                        var $data = { key: $key, order_id: $order_id, status: status, location_x: $longitude, location_y: $latitude, address: $address };
                        console.log($data);
                        _.data.send($url, "post", $load, $data, function(data) {
                            if (data.code == 200) {
                                console.log(data);
                                // window.location.reload();
                                pulldownRefresh(); 
                            }
                        })
                    }, function(e) {
                        plus.nativeUI.closeWaiting();
                        _.debug(e);
                        mui.alert('定位失败,请打开GPS！');
                    });
                }
            }, 'div')
        }
        if ($(this).html() == '追加服务') {
            $('.pay_end').fadeIn(500);
            //取消尾款
            $('.pay_end').on('tap', function(event) {
                if (event.target && event.target.className == $(this).attr('class')) {
                    $('.pay_end').fadeOut(500);
                }
            })
            $('.pay_end .paybtn').find('.cancle').on('tap', function() {
                //取消按钮
                $('.pay_end').fadeOut(300);
            })
            $('.pay_end .paybtn').find('.confirm').on('tap', function() {
            	var inputmoney = parseFloat($('#appendmoney').val());
            	/**
                 *@author: zhaoyangyue
                 * @desc: 判断追加金额是否是非数字和空值  如果是提示错误
                 * @version: 2017-7-24
                 */
            	if (isNaN(inputmoney) || inputmoney <= 0 || inputmoney == '') {
                    mui.alert('追加金额有误！');
                    return false;
                }else{
                	$(this).attr("disabled", "disabled");
	                
	                console.log("inputmoney========" + isNaN(inputmoney))
	                $('.pay_end').fadeOut(300);
	                var $url = ApiUrl + '/index.php?act=service_order&op=create_child_order';
	                var $remark = $('#appendremark').text();
	                var $data = { key: $key, order_id: $order_id, money: inputmoney, remark: $remark, order_type: 1 };
	                _.debug($data);
	                _.data.send($url, "post", true, $data, function(data) {
	                    _.debug(data);
	                    if (data.code == 200) {
                            // window.location.reload();
                            pulldownRefresh(); 
	                    } else {
	                        mui.alert(data.datas.error);
	                    }
	                })
                }
            })
        }
        //用户确认完成
        if ($(this).html() == "完成服务") {
            var $url = ApiUrl + '/index.php?act=service_order&op=update_orderStatus',
                $load = true,
                status = 26,
                $latitude = 0,
                $longitude = 0,
                $address = '';
            var btn = ["取消", "确认"];
            mui.confirm("完成服务？", "向日葵来了", btn, function(e) {
                if (e.index == 1) {
                    //屏蔽定位
                    plus.nativeUI.showWaiting("请打开GPS，正在定位");
                    plus.geolocation.getCurrentPosition(function(p) {
                        plus.nativeUI.closeWaiting();
                        $latitude = p.coords.latitude;
                        $longitude = p.coords.longitude;
                        $address = p.addresses;
                        console.log("完成服务位置：" + $address);
                        var $data = {
                            key: $key,
                            order_id: $order_id,
                            status: status,
                            location_x: $latitude,
                            location_y: $longitude,
                            address: $address
                        };
                        console.log($data);
                        _.data.send($url, "post", $load, $data, function(data) {

                            if (data.code == 200) {
                                console.log(JSON.stringify(data));
                                // window.location.reload();
                                pulldownRefresh(); 
                            }
                        })
                    }, function(e) {
                        plus.nativeUI.closeWaiting();
                        _.debug(e);
                        mui.alert('定位失败,请打开GPS！');
                    })
                }
            }, 'div')
        }

         //核销
         if ($(this).html() == "核销") {
            var $url = ApiUrl + '/index.php?act=service_order&op=update_order_used';
            var btn = ["取消", "确认"];
            var $load = true;
            console.log("April===订单id"+ $order_id);
            mui.confirm("确定核销？", "向日葵来了", btn, function(e) {
                if (e.index == 1) {
                    var $data = { 
                        key: $key,
                        order_id: $order_id, 
                    };
                    console.log("submit");
                    _.data.send($url, "post", true, $data, function(data) {
                        console.log("April===200 "+data);
                        // window.location.reload();
                        pulldownRefresh(); 
                    })
                }
            }, 'div')
        }
        //确认服务
        if ($(this).html() == "确认") {
            var btn = ["取消", "确认"];
            var $url = ApiUrl + '/index.php?act=service_order&op=update_orderStatus',
                $load = true,
                status = 22,
                $latitude = 0,
                $longitude = 0;
            //屏蔽确认定位
            plus.nativeUI.showWaiting();
            plus.geolocation.getCurrentPosition(function(position) {
                plus.nativeUI.closeWaiting();
                _.debug(position);
                $latitude = position.coords.latitude;
                $longitude = position.coords.longitude;
                $address = position.addresses;
                console.log("确认服务位置：" + $address);
                var $data = { key: $key, order_id: $order_id, status: status, location_x: $longitude, location_y: $latitude, address: $address };
                mui.confirm("确认服务？", "向日葵来了", btn, function(e) {

                    if (e.index == 1) {
                        console.log(JSON.stringify($data));
                        _.data.send($url, "post", $load, $data, function(data) {

                            if (data.code == 200) {
                                console.log(JSON.stringify(data));
                                pulldownRefresh(); 
                            } else {
                                console.log(data.datas.error);
                            }
                        })
                    }
                }, 'div')

            }, function(e) {
                plus.nativeUI.closeWaiting();
                _.debug(e);
                mui.alert('定位失败,请打开GPS！');
            })
        }

        //拒绝服务
        if ($(this).html() == "拒绝") {
            console.log($(this).parent().attr("data-id"));
            var $url = ApiUrl + '/index.php?act=service_order&op=update_orderStatus',
                $load = true,
                status = 23,
                $latitude = 0,
                $longitude = 0,
                $address = '';

            var btn = ["取消", "确认"];
            mui.confirm("拒绝服务？", "向日葵来了", btn, function(e) {
                if (e.index == 1) {
                    //屏蔽拒绝服务定位
                    plus.nativeUI.showWaiting();
                    plus.geolocation.getCurrentPosition(function(position) {

                        plus.nativeUI.closeWaiting();
                        _.debug(position);
                        $latitude = position.coords.latitude;
                        $longitude = position.coords.longitude;
                        $address = position.addresses;
                        console.log("拒绝服务位置：" + $address);
                        var $data = { key: $key, order_id: $order_id, status: status, location_x: $longitude, location_y: $latitude, address: $address };
                        console.log($data);

                        _.data.send($url, "post", $load, $data, function(data) {

                            if (data.code == 200) {
                                console.log(JSON.stringify(data));
                                // window.location.reload();
                                pulldownRefresh(); 
                            }

                            if (data.code == 400) {
                                console.log(JSON.styingify(data));
                            }
                        })
                    }, function(e) {
                        plus.nativeUI.closeWaiting();
                        _.debug(e);
                        mui.alert('定位失败,请打开GPS！');
                    })
                }
            }, 'div')
        }

        //评论
        if ($(this).html() == "评价") {
            console.log($(this).parent().attr('data-id'));
            mui.openWindow({
                url: "evaluate-seller.html",
                id: "evaluate-seller",
                extras: {
                    orderId: $order_id
                },
                waiting: {
                    autoShow: true,
                    title: "正在加载..."
                }
            })
        }
    })
    //点击进入详情
    $(".order-list").on("tap", ".info", function() {
        console.log($(this).attr('orderid'))
        mui.openWindow({
            url: "../order/order-status-daifuwu.html",
            //id: "seller-order-detail",
            extras: {
                orderId: $(this).attr('orderid')
            },
            waiting: {
                autoShow: true,
                title: "正在加载..."
            }
        })
    })
})