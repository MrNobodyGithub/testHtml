mui.plusReady(function() {

    var self = plus.webview.currentWebview();
    console.log(self.orderId);

    var $userinfo = _.userInfo.get();
    console.log($userinfo.key);
    console.log(self.orderId);
    $.ajax({
        type: "get",
        url: ApiUrl + "/index.php?act=service_member_order&op=order_detail",
        dataType: "json",
        data: {
            order_id: self.orderId, //665,
            key: $userinfo.key
        },
        success: function(res) {
            console.log(JSON.stringify(res));
            if (res.code == 200) {
                var html = template.render("order-status", res);
                $(".order-status").html(html);
                for (var i = 0; i < $(".order-status").find("li").length; i++) {
                    if ($(".order-list10").find("li").eq(i).find("span").eq(1).attr("data_name") == "address_to" || $(".order-list10").find("li").eq(i).find("span").eq(1).attr("data_name") == "address_from") {
                        console.log($(".order-list10").find("li").eq(i).find("span").eq(1).text());
                        var str = $(".order-list10").find("li").eq(i).find("span").eq(1).text()
                        var arr = str.split("|");
                        console.log(arr);
                        console.log(arr[2]);
                        var obj = (arr[5] || '') + '(' + (arr[4] || '') + ')' + (arr[arr.length - 1] || '');
                        console.log(obj);
                        $(".order-list10").find("li").eq(i).find("span").eq(1).text(obj);
                    }
                    if ($(".order-list10").find("li").eq(i).find("span").eq(1).attr("data_name") == "spec") {
                        $(".order-list10").find("li").eq(i).find("span").eq(1).parent().attr("display", "none");
                    }
                    if ($(".order-list10").find("li").eq(i).find("span").eq(1).attr("data_type") == 6 && $(".order-list10").find("li").eq(i).find("span").eq(1).text() != "") {
                        //console.log($(".order-list10").find("li").eq(i).find("span").eq(1).text())
                        var str = $(".order-list10").find("li").eq(i).find("span").eq(1).text();

                        //console.log($.formatDate(parseInt(str)*1000))
                        $(".order-list10").find("li").eq(i).find("span").eq(1).text($.formatDate(parseInt(str) * 1000))
                    } else if ($(".order-list10").find("li").eq(i).find("span").eq(1).attr("data_type") == 6 && $(".order-list10").find("li").eq(i).find("span").eq(1).text() == "") {
                        $(".order-list10").find("li").eq(i).find("span").eq(1).text("");
                    }
                }
            }

            if (res.code == 400) {
                mui.toast(data.datas.error);
            }
        }
    });
})