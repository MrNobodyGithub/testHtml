$(function() {

    mui.plusReady(function() {

        var self = plus.webview.currentWebview(),
            $storeId = self.store_id,
            $orderId = self.order_id;

        console.log('我接收到的数据');
        console.log($storeId);
        console.log($orderId);

        var
            $key = _.userInfo.getKey(),
            $load = true,
            $storeType = 'get',
            $storeUrl = ApiUrl + '/index.php?act=service_store&op=getServiceInfo',
            $storeData = { store_id: $storeId }
        $orderType = 'get',
            $orderUrl = ApiUrl + '/index.php?act=service_member_order&op=order_detail',
            $orderData = { key: $key, order_id: $orderId };

        var order_info = '';
        console.log($key)
        console.log($orderId)
            //	获取订单详情
            //		$.ajax({
            //			url: $orderUrl,
            //			type: $orderType,
            //			data: $orderData,
            //			dataType: 'json',
            //			async: false,
            //			success: function( data ){
            //				console.log('返回数据');
            //				console.log(JSON.stringify(data));
            //				order_info = data.datas.order_info;
            //				if( data.code == 200 ) {
            //					$('.finish').append(template('orderInfo',data.datas));
            //				}
            //			}
            //		})

        //	获取店铺详情
        //		_.data.send($storeUrl,$storeType,$load,$storeData,function(data){
        //			console.log(data);
        //			if( data.code == 200 ) {
        //				$('.finish').append(template('storeInfo',data.datas));
        //			}
        //		})
        //		

        //详情改写
        $.ajax({
            type: "get",
            url: ApiUrl + "/index.php?act=service_member_order&op=order_detail",
            data: {
                order_id: $orderId, //665,
                key: $key
            },
            success: function(res) {
                var data = JSON.parse(res)
                console.log(data);
                order_info = data.datas.order_info;
                var html = template.render("orderInfo", data);
                $(".finish").html(html)
                    //循环出表单信息  修改状态值
                for (var i = 0; i < $(".order-status").find("li").length; i++) {
                    if ($(".order-list10").find("li").eq(i).find("span").eq(1).attr("data_name") == "address_to" || $(".order-list10").find("li").eq(i).find("span").eq(1).attr("data_name") == "address_from") {
                        console.log($(".order-list10").find("li").eq(i).find("span").eq(1).text());
                        var str = $(".order-list10").find("li").eq(i).find("span").eq(1).text();
                        var arr = str.split("|");
                        console.log(arr);
                        console.log(arr[2]);
                        var obj = (arr[4] || '') + (arr[arr.length - 1] || '');
                        console.log(obj);
                        $(".order-list10").find("li").eq(i).find("span").eq(1).text(obj);
                    }
                    if ($(".order-list10").find("li").eq(i).find("span").eq(1).attr("data_type") == 6 && $(".order-list10").find("li").eq(i).find("span").eq(1).text() != "") {
                        var str = $(".order-list10").find("li").eq(i).find("span").eq(1).text();
                        $(".order-list10").find("li").eq(i).find("span").eq(1).text($.formatDate(parseInt(str) * 1000))
                    } else if ($(".order-list10").find("li").eq(i).find("span").eq(1).attr("data_type") == 6 && $(".order-list10").find("li").eq(i).find("span").eq(1).text() == "") {
                        $(".order-list10").find("li").eq(i).find("span").eq(1).text("");
                    }

                }
            }
        });


        //	支付

        var channel = null;

        // 获取支付通道 
        plus.payment.getChannels(function(channels) {
            channel = { alipay: channels[0], wxpay: channels[1] };
        }, function(e) {
            return { state: false, msg: "获取支付通道失败：" + e.message };
        });



        //	确认支付&申请退款
        $('.cleaning-footer a.right').on('tap', function() {
            $('.mask').fadeIn().find('menu').css('bottom', '0');
        })
        var pay_code = 0;
        $('.mask .pay-menu a').on('tap', function() {
            $(this).addClass('active').siblings('a').removeClass('active');
            pay_code = $(this).attr("data-type");
        });

        $('.mask').on('tap', function(event) {
            if (event.target.className == $(this).attr('class')) {
                $(this).fadeOut().find('.pay-menu').css('bottom', '-100%');
            }
        })

        $('#pay_btn').on('tap', function() {
            console.log(pay_code);
            order_info.pay_code = pay_code;
            var $this = $(this),
                $foot = $this.parents('.cleaning-footer'),
                $id = $orderId,
                $ty = 'order',
                $code = $('.pay-menu a.active').attr('data-type'),
                $sn = $('.finish-name').attr('data-sn');

            var
                $url = ApiUrl + '/index.php?act=service_member_order&op=order_receive',
                $load = true,
                $type = 'post',
                $data = { key: $key, pay_sn: $sn, order_type: $ty };

            // console.log('支付信息');
            // console.log($key);
            console.log($sn);
            console.log($ty);
            // console.log(aliChannel);
            mobilePay($data, $code, channel, function(data) {
                if (data.state == true) {
                    console.log(JSON.stringify(order_info));
                    mui.openWindow({
                        url: '../order/order_complete.html',
                        id: 'order_complete',
                        waiting: {
                            auwoShow: true
                        },
                        extras: {
                            order_info: order_info,
                            edit: true,
                            status: 0
                        }
                    })
                } else {
                	mui.toast('支付失败');
                    //mui.alert('支付失败');
                }

            });
        })


    })
})