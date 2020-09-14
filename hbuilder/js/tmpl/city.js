$(function() {
    var ws = null,
        wo = null;
    //城市点击方法
    var fn_select_city = function(el) {
        var $this = $(el);
        var area_id = $this.attr('data-id');
        var area_name = $this.text();
        _.setCityInfo(area_id, area_name);
        if (ws) {
            ws.close();
        }
        if (wo) {
            mui.fire(wo, 'changecity', {
                id: $this.attr('data-id'),
                name: $this.text()
            })
        }
        //给首页处理城市变更,去除变更城市的首页刷新，临时解决ios跑腿切换城市闪退
        var indexpage = plus.webview.getLaunchWebview();
        if (indexpage.id != wo.id) {
            mui.fire(indexpage, 'changecity', {
                id: $this.attr('data-id'),
                name: $this.text()
            })
        }
    }

    mui.plusReady(function() {
        ws = plus.webview.currentWebview();
        wo = ws.opener();
        plus.nativeUI.showWaiting('正在定位');
        plus.geolocation.getCurrentPosition(function(position) {
            plus.nativeUI.closeWaiting();
            var $city = position.address.city;
            var locationcity = $('dd.location_area span');
            locationcity.text($city);
            _.debug($city);
            //调用接口获取对应的城市id
            $.getJSON(ApiUrl + '/index.php?act=type&op=getAreaIdByName', {
                area_name: $city
            }, function(ret) {
                if (ret.code == 200) {
                    var area_id = ret.datas.area_id;
                    _.debug(area_id);
                    locationcity.attr('data-id', area_id);
                    locationcity.on('tap', function() {
                        fn_select_city(this);
                    })
                }
            })
        }, function(e) {
            plus.nativeUI.closeWaiting();
            locationcity.text('定位失败');
            mui.toast('定位失败！');
        });


    })

    getHotcity();

    //var $cityList = JSON.parse(window.localStorage.getItem('citylist'));
    //if ($cityList) {
    	//fillCityList($cityList);
    //} else {
        ajaxGetCityList();
    //}
    //热门城市
    function getHotcity() {
        $.ajax({
            type: "get",
            url: ApiUrl + "/index.php?act=zx_cityarea&op=servicecity",
            dataType: "json",
            async: true,
            success: function(res) {
                var html = '';
                for (var i = 0; i < res.datas.length; i++) {
                    html += '<span data-id = "' + res.datas[i].area_id + '">' + res.datas[i].area_name + '</span>'
                }
                $('.hotcity dd').html(html);
                //设置事件
                $('.hotcity dd span').on('tap', function() {
                    fn_select_city(this);
                })
            }
        });
    }

    function fillCityList(cityList) {
        var $len = cityList.length;
        var $html = '',
            $menu = '<span>#</span>';
        $city = [],
            $farr = [];
        for (var i = 0; i < $len; i++) {
            if (cityList[i].area_name == "重庆市" || cityList[i].area_name == "长沙市" || cityList[i].area_name == "长春市") {
                var $first = 'C';
            } else if (cityList[i].area_name == "佛山市") {
                var $first = 'F';
            } else if (cityList[i].area_name == "厦门市") {
                var $first = 'X';
            } else {
                //或取首字母
                var $first = pinyinUtil.getFirstLetter(cityList[i].area_name).substring(0, 1);
            }

            console.log("============" + $first);
            //数组添加
            $city.push([$first, cityList[i].area_id, cityList[i].area_name, cityList[i].area_service]);
            //首字母数组
            $farr.push($first);
        }

        // 生成城市列表
        var $arr = $city.sort();
        for (var j = 0; j < $arr.length; j++) {
            $html += '<li data-open="' + $arr[j][3] + '" data-num="' + $arr[j][0] + '" data-id="' + $arr[j][1] + '">' + $arr[j][2] + '</li>'
        }

        $('.city-list ul').append($html);
        // 生成aside列表
        var $narr = $.unique($farr.sort());
        console.log($narr);
        for (var k = 0; k < $narr.length; k++) {
            $menu += '<span>' + $narr[k] + '</span>';
            $('.city-list li[data-num="' + $narr[k] + '"]').eq(0).before('<li class="group">' + $narr[k] + '</li>');
        }
        $('aside').html($menu);
        //	选择城市事件，不开通的提示
        $('.city-list').on('tap', 'li', function() {
            var cityList = $(this).attr('data-open');
            if (cityList == 1) {
                fn_select_city($(this));
            } else if (cityList == 0) {
                mui.alert("系统尚未开通，请关注！");
            }

        })
    }
    // 数据
    function ajaxGetCityList() {
        $.ajax({
            type: 'get',
            url: ApiUrl + '/index.php?act=service_store&op=getArea',
            dataType: 'json',
            success: function(data) {
                _.debug(data);
                window.localStorage.setItem('citylist', JSON.stringify(data.datas));
                fillCityList(data.datas);

            },
            error: function(err) {
                console.log(err)
            }
        })
    }

    // 滚动侦测
    $('.city').on('tap', 'aside span', function() {
        var
            $this = $(this),
            $index = $this.index(),
            $last = $('aside span').length - 1,
            $height = $('.city-list').height();
        if ($index == 0) {
            $('html,body').animate({
                scrollTop: '0px'
            }, 300);
        } else {
            var $offset = $('.group').eq($index - 1).offset().top - 155;
            $('html,body').animate({
                scrollTop: $offset + 'px'
            }, 300);
        }
    })

})