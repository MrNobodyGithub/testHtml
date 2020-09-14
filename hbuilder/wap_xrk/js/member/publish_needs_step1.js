$(function() {
    //1、初始化
    mui.init({});

    //4.对接数据
    function get_kind_list() {
        $.getJSON(ApiUrl + '/index.php?act=service_class&op=get_service_class_and_child', {
            globalLoading: true
        }, function(result) {
            //                  console.log(JSON.stringify(result));
            //console.log(result.datas.class_list[1].image);
            /*
             * @description 目前只有 保洁、跑腿、护工 模块可以发布订单，故将其他的模块数据去掉
             * @author wangmin
             * @version 2017年7月31日15:25:50
             */

            var module = result.datas.class_list;
            //筛选二级 删除不允许发布服务的项目
            if (module != null && module.length > 0) {
                for (var i = 0; i < module.length; i++) {
                    if (module[i].child != null && module[i].child.length > 0) {
                        for (var j = module[i].child.length - 1; j >= 0; j--) {
                            if (module[i].child[j].goods_class_type.is_needs == 0) {
                                module[i].child.splice(j, 1);
                            }
                        }
                    }
                }
            }
            console.log(module);
            // 通过child是否包含子项目  判断一级类目是否显示
            if (module != null && module.length > 0) {
                for (var i = module.length - 1; i >= 0; i--) {
                    if (module[i].child.length == 0) {
                        module.splice(i, 1);
                    }
                }
            }

            var html = template.render('comkind', result);
            $(".comkind").html(html);
            //2.滚动条的定位
            var deceleration = mui.os.ios ? 0.0003 : 0.0009;
            mui('.item-left-box.mui-scroll-wrapper').scroll({
                bounce: false, //是否启用回弹 一个友好的滑动效果
                indicators: false, //是否显示滚动条
                deceleration: deceleration
            });
            mui('.item-right-box.mui-scroll-wrapper').scroll({
                bounce: false, //是否启用回弹 一个友好的滑动效果
                indicators: false, //是否显示滚动条
                deceleration: deceleration
            });

            //左侧第一个 默认样式
            $('#segmentedControls li:nth-child(1)').addClass("active");
            $('#segmentedControlss li:nth-child(1) .clean').addClass("actives");
            //选项卡切换的点击事件
            $('#segmentedControls').on('tap', '.list', function() {

                if ($('.location')) {
                    $('.location').addClass("block");
                }

                $(this).addClass("active");
                $(this).siblings().removeClass("active");

                $(".item-right").find(".list").eq($(this).index()).find(".clean").addClass("actives");
                $(".item-right").find(".list").eq($(this).index()).find("div").find(".clean").parent().parent().siblings().children("div").children(".clean").removeClass("actives");

                console.log($(this).index());
            });
            //3.三级列表的显示与隐藏
            $('body').on('tap', '.list-jiantou', function() {
                //							console.log(e);
                $(this).next("ul").toggleClass('block').parent().siblings("div").children("ul").addClass("block");
                $(this).parent().siblings("div").children(".list-jiantou").children(".jiantou").attr('src', '../../images/classify/xianjiantou@2x.png');
                if ($(this).next("ul").hasClass('block')) {
                    $(this).children(".jiantou").attr('src', '../../images/classify/xianjiantou@2x.png');
                } else {
                    $(this).children(".jiantou").attr('src', '../../images/classify/shangjiantou@2x.png');
                }
            });

        });
    }

    get_kind_list();
});
//5.二三级列表的页面跳转
mui.plusReady(function() {

    $('.mui-content').on('tap', '.item-right .cleans', function() {
        var key = _.userInfo.getKey();
        if (!key) {
            checkLogin(0);
            return;
        }
        var
            classInfo = {},
            $this = $(this),
            gcId = $this.attr('data-gc-id'),
            typeId = $this.attr('data-type-id'),
            typeModel = $this.attr('data-type-model'),
            className = $this.text().trim(),
            parentName = $this.parent().parent().prev().text().trim();
        //对于跑腿业务，处理同级的分类id属性，带到跑腿页面
        if ($.inArray(typeModel, [1, 2, 3])) {
            var classModel = {};
            $this.parent().find('i').each(function() {
                //得到同级i元素的分类和类型属性
                var model = $(this).attr('data-type-model');
                var gc = $(this).attr('data-typ-id');
                classModel[model] = gc;
            })
            classInfo.classModel = classModel;
            //console.log(JSON.stringify(runner));
        }

        classInfo.gcId = gcId;
        classInfo.typeId = typeId;
        classInfo.typeModel = typeModel;
        classInfo.className = className;
        classInfo.parentName = parentName;
        var url = 'publish_needs_step2.html';
        classInfo.tmpl = url;
        switch (typeModel) {
            case "1": //代送
            case "2": //排队
            case "3": //代买
                //获取同级的分类id属性
                url = 'publish_needs_runner.html';
                classInfo.tmpl = url;
                if (typeModel == '2') {
                    mui.alert('排队业务敬请期待...');
                    return false;
                }
                if (typeModel == '3') {
                    mui.alert('代买业务敬请期待...');
                    return false;
                }
                break;
            case "4": //搬家 模板做好后替换搬家对应模板
                url = 'publish_needs_step2.html';
                break;
            default:
                url = 'publish_needs_step2.html';
                break;
        }
        _.debug(classInfo);
        mui.openWindow({
            url: classInfo.tmpl,
            id: "publish_needs_step2",
            createNew: false,
            extras: {
                classInfo: classInfo
            },
            show: {
                autoShow: false //不自动显示，等待页面加载完成后自己处理显示
            },
            waiting: {
                autoShow: true,
                title: '正在加载...'
            }
        })
    })

});