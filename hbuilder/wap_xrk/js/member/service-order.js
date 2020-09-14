/**
 * @description 增加下拉刷新及上拉加载，重新布局，并增加分页
 * @author zhaobing
 * @version 2017年7月22日16:38:41
 */
/**
 * 0、根据进入时传递的参数决定显示那个页面，并加载数据 
 * 1、一级分类 切换时，显示隐藏二级分类，如果存在数据则不刷新，不存在数据则刷新
 * 2、二级分类切换时，如果存在数据则不进行加载刷新
 * 3、下拉刷新及上拉加载只对当前的活动的列表进行处理
 * 4、每个列表增加分页，记录当前显示page
 */
$(function(){
	//设置全局变量
	var $key = _.userInfo.getKey();//用户key
	var $cityInfo = _.getCityInfo() || _.getDefaultCityInfo(); //当前城市对象
	var $buy = ApiUrl + '/index.php?act=service_member_order&op=order_list';//选购订单请求
	var $edit = ApiUrl + '/index.php?act=needs&op=needslist';//发布订单请求
	var $pageSize = 10;//分页记录数
	var $menu1Index = 0;//一级分类活动下标
	var $menu2Index = 0;//二级分类活动下标
	var $orderIndex = 0;//订单展示活动下标
	var keyword = "";
	var $typeid = 1;
	var channel = new Object();  //支付方式数组
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
	
	mui.plusReady(function(){
		var self = plus.webview.currentWebview();
		//判断传入的参数
		if(self.edit){
			$menu1Index = 1;
		}
		$menu2Index = self.status ? self.status : 0;
		$orderIndex = $menu1Index*4 + $menu2Index;
		//根据全局参数，计算应该展示哪个页面
		calculateShow();
		//加载数据
		pulldownRefresh();
		
		// 获取支付通道 
		plus.payment.getChannels(function(channels){
		    channel = { alipay:channels[0], wxpay:channels[1] };
		},function(e){
		    return {state:false, msg:"获取支付通道失败："+e.message};
		});

		  //操作回退页面
		// mui.back = function() {
			
		// 	if( self.edit ) {
		// 		plus.webview.close('publish_needs_step1');
		// 		plus.webview.close('publish_needs_step2');
		// 	}
			
		// 	mui.openWindow({
		// 		url: 'member.html',
		// 		id: 'member',
		// 		waiting: {
		// 			autoShow: true
		// 		}
		// 	})
		// }
		
	})
	window.addEventListener('refresh', function(e){//执行刷新
	    pulldownRefresh();
	});
	
	//订单搜索关键字
    $('#suggestId').keypress(function(e) {  
        // 回车键事件  
        if(e.which == 13) {
            keyword = $(this).val(); 
            pulldownRefresh(); 
        }  
    });

	//计算一级菜单、二级菜单、列表页的展示样式
	function calculateShow(){
		//一级菜单-选中
		$('.first a').removeClass('active').eq($menu1Index).addClass('active');
		//二级菜单-显示
		$('.second').hide();
		$('.second_'+$menu1Index).show();
		//二级菜单-选中
		$('.second_'+$menu1Index+' a').removeClass('active').eq($menu2Index).addClass('active');
		//列表页-显示
		$('.order-list').hide().eq($orderIndex).show();
	}
	
	
	//获取当前激活的tab参数
	function getActiveParam() {
		var listContainer = $('.order-list').eq($orderIndex);
		var curpage = parseInt(listContainer.data("data-current-page")) || 0;
		curpage++;
		var status = $('.second_'+$menu1Index).find('.active').data('status');
		return {
			key: $key,
			status:status,
			curpage: curpage,
			page: $pageSize
		}
	}
	
	//根据当前活动的页面，下拉数显
	function pulldownRefresh(){
		console.log("-----下拉刷新");
		var param = getActiveParam();
		param.curpage = 1;
		getListData(keyword, param, 0);
		
	}
	
	//根据当前活动的页面，上拉加载
	function pullupRefresh(){
		var param = getActiveParam();
		getListData(keyword, param, 1);
	}
	
	//加载数据
	function getListData(keyword, param,pullDirect){
		var $url = $menu1Index == 1?$edit:$buy;
		var $type = $menu1Index == 1?'get':'get';
		var $data;
		var $typeid = $('#typeid').val();
		console.log("April====keyword " + keyword);
		console.log("April====typeid " + $typeid);
		if($menu1Index == 1){
			$data = {
				key:param.key,
				curpage:param.curpage,
				page:param.page,
				order_state:param.status,
				keyword: keyword,
				type_id: $typeid
			}
		}else{
			$data = {
				key:param.key,
				curpage:param.curpage,
				page:param.page,
				status:param.status,
				keyword: keyword,
				type_id: $typeid
			}
		}
		var pullRefresh = mui('.content').pullRefresh();
		console.log($url);
		console.log($type);
		console.log(JSON.stringify($data));
		_.data.send($url,$type,true,$data,function(data){
            console.log('zhaobing11111111');
            console.log(JSON.stringify(data));

            if( data.code == 200 ) {
                var result = template($menu1Index == 1?'edit-item':'order-item',data.datas);
                var listContainer = $('.order-list').eq($orderIndex);
                var curpage = param.curpage;
				if(curpage == 1) {
					listContainer.html(result);
					pullRefresh.refresh(true); //恢复滚动
					pullRefresh.scrollTo(0, 0, 100); //滚动置顶
				} else {
					listContainer.append(result);
				}
				listContainer.data("data-current-page", curpage);
				var hasmore = data.hasmore || false;
				listContainer.data("hasmore", hasmore);
				if(curpage == 1) {
					if(hasmore){
						pullRefresh.enablePullupToRefresh();
					}else{
						pullRefresh.disablePullupToRefresh();
					}
				}
				if(pullDirect == 1) {
					pullRefresh.endPullupToRefresh(!hasmore);
				} else {
					pullRefresh.endPulldown(true);
				}
            } else {
                if(pullDirect == 1) {
					pullRefresh.endPullupToRefresh(true);
				} else {
					pullRefresh.endPulldownToRefresh(true);
				}
				mui.toast('网络异常,请稍候再试');
            }
        })
		
		
	}

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
	
	//一级菜单 点击事件
	$('.first a').on('tap',function(){
		var $this = $(this),
			$index = $this.index();
		if(!$this.hasClass('active')){
			//更改样式
			$this.addClass('active').siblings().removeClass('active');
			//处理全局一级菜单下标
			$menu1Index = $index;
			//处理全局二级菜单下标
			$menu2Index = new Number($('.second_'+$menu1Index).find('.active').data('index'));
			//处理列表下标
			$orderIndex = $menu1Index*4 + $menu2Index;
			//计算显示
			calculateShow();
			//验证是否加载数据(原来有数据，只展示不重新加载)
			var listContainer = $('.order-list').eq($orderIndex);
			if(listContainer.find('.order-item').length == 0){
				//加载数据
				pulldownRefresh();
			}else{
				//不加载，但要把下拉刷新处理下
				var pullRefresh = mui('.content').pullRefresh();
				pullRefresh.scrollTo(0, 0, 100); //滚动置顶
				var hasmore = listContainer.data('hasmore');
				if(hasmore){
					pullRefresh.enablePullupToRefresh();
				}else{
					pullRefresh.endPullupToRefresh(true);
				}
			}
		}
	})
	
	//二级菜单点击事件
	$('.second_0 a').on('tap',function(){
		var $this = $(this),
			$index = $this.index();
    	if(!$this.hasClass('active')){
    		//更改样式
    		$this.addClass('active').siblings().removeClass('active');
    		//处理全局二级菜单下标
			$menu2Index = $index;
			//处理列表下标
			$orderIndex = $menu1Index*4 + $menu2Index;
			//计算显示
			calculateShow();
			//判断是否需要加载数据
			var listContainer = $('.order-list').eq($orderIndex);
			if(listContainer.find('.order-item').length == 0){
				//加载数据
				pulldownRefresh();
			}else{
				//不加载，但要把下拉刷新处理下
				var pullRefresh = mui('.content').pullRefresh();
				pullRefresh.scrollTo(0, 0, 100); //滚动置顶
				var hasmore = listContainer.data('hasmore');
				if(hasmore){
					pullRefresh.enablePullupToRefresh();
				}else{
					pullRefresh.endPullupToRefresh(true);
				}
			}
    	}
    })
	$('.second_1 a').on('tap',function(){
		var $this = $(this),
			$index = $this.index();
    	if(!$this.hasClass('active')){
    		//更改样式
    		$this.addClass('active').siblings().removeClass('active');
    		//处理全局二级菜单下标
			$menu2Index = $index;
			//处理列表下标
			$orderIndex = $menu1Index*4 + $menu2Index;
			//计算显示
			calculateShow();
			//判断是否需要加载数据
			var listContainer = $('.order-list').eq($orderIndex);
			if(listContainer.find('.order-item').length == 0){
				//加载数据
				pulldownRefresh();
			}else{
				//不加载，但要把下拉刷新处理下
				var pullRefresh = mui('.content').pullRefresh();
				pullRefresh.scrollTo(0, 0, 100); //滚动置顶
				var hasmore = listContainer.data('hasmore');
				if(hasmore){
					pullRefresh.endPullupToRefresh(!hasmore);
				}else{
					pullRefresh.endPullupToRefresh(true);
				}
			}
    	}
    })
	
	//	点击进入订单详情
	$(".order-list").on("tap",".info",function(){
		mui.openWindow({
			url: '../order/order-status-daifuwu.html',
			waiting: {
				autoShow: true
			},
			extras: {
				orderId: $(this).attr("data-id"),
			}
		})
	})
	//选择支付方式
    $('.mask .pay-menu a').on('tap',function(){
        $(this).addClass('active').siblings('a').removeClass('active');
        var payCode = $(this).attr('data-type');
        $('input[name="payCode"]').val(payCode);
    });
    
    //取消尾款
	$('.pay_end .cancle').on('tap', function(event){
		$('.pay_end').fadeOut(300);
	})
	//	按钮事件
	$('.content').on('tap','.order-item footer a',function(){
		var $this = $(this),
			$box  = $this.closest('.order-item'),
			$id   = $box.attr('data-id'),
			$sid  = $box.attr('data-storeId'),
			$order_amount = $box.attr('data-order-amount'),
			$gcId = $box.attr('data-gc-id');
			
		//	取消
		if( $this.text() == '取消订单' ) {
			
			var
				$load = true,
				$url  = ApiUrl + '/index.php?act=service_member_order&op=order_cancel',
				$type = 'post',
				$data = { key : $key , order_id : $id };
				var btn = ["取消", "确定"];
		        mui.confirm('确认取消订单？', '提示', btn, function (e) {
		            if (e.index == 1) {
		        		_.data.send($url,$type,$load,$data,function(data){
							if( data.code == 200 ) {
								console.log('--------');
								console.log(JSON.stringify(data));
								console.log(JSON.stringify($data));
							 	//改变状态
							 	var index = $this.parent().parent().index();
							 	$this.parent().siblings('div').find('.status').html("已取消");
							 	$this.text('已取消');
							 	$this.siblings().remove();
							 	//点击消失去掉；不让它消失只改变状态
								/*$box.slideUp(function(){
									$(this).remove();
								})*/
							}else{
								mui.alert(data.datas.error);
							}
						})
		            }
		        }, 'div');
		        document.querySelector('.mui-popup-title').style = 'font-size: 0.8rem';
		} else if( $this.text() == '确认完成' ) {
			var 
				$load = true,
				$url  = ApiUrl + '/index.php?act=service_member_order&op=order_receive',
				$type = 'post',
				$data = { key: $key , order_id: $id };
			var btn = ["取消", "确认"];
			mui.confirm("确定完成？", "提示", btn, function(e){
				if(e.index == 1){
					_.data.send($url,$type,$load,$data,function(data){
						if( data.code == 200 ) {
							pulldownRefresh()
						} else {
							console.log(JSON.stringify(data));
						}
					})
				}
			}, 'div')
		} else if( $this.text() == '评价' ) {
			mui.openWindow({
				url: 'evaluate.html',
				id: 'evaluate',
				waiting: {
					autoShow: true
				},
				extras: {
					orderId: $id
				}
			})
		}
		//	尾款
		var pay_data = {};
		if( $this.text() == '付尾款' ) {
			$('.pay_end').fadeIn(300);
			
			var pay_sn = $(this).attr('data-pay-sn'),
				sy_amount = $(this).attr('data-sy-amount'),
				order_type = $(this).attr('data-order-type'),
				pay_data = {};
				
				pay_data = {
                    pay_sn : pay_sn,
                    order_type : order_type,
                    key : $key
                };
			 console.log(sy_amount);
			$('.pay_end .price').html(sy_amount);
			$('.pay_end .paybtn').find('.confirm').off('tap').on('tap', function(){
//					alert('您要支付的金额：'+sy_amount);
				$('#payMask').fadeIn().find('menu').css('bottom','0');
				$('.mask').off('tap').on('tap',function(event){
			        if( event.target.className == $(this).attr('class') ) {
			            $(this).fadeOut().find('.pay-menu').css('bottom','-100%');
			        }
			    });
			    
			     //确认支付
			    $('#pay_btn').one('tap', function(){
			        var pay_code = $('input[name="payCode"]').val();
			        console.log(pay_code);
			        console.log('channel------'+JSON.stringify(channel));
			        console.log(JSON.stringify(channel));
			        console.log('pay_data-----'+JSON.stringify(pay_data));
			        if( pay_code == '' ){
			            mui.alert('请选择支付方式');
			            return false;
			        }

			        console.log(JSON.stringify(pay_data) + "-----------");
					mobilePay(pay_data, pay_code, channel, function(obj){
	                    if( obj.state == true ){
	                        //成功
	                        $('#payMask').hide().find('.pay-menu').css('bottom','-100%');
	                        $('.pay_end').hide();
	                        pulldownRefresh();
	                        //window.location.reload();
	                    }else {
	                        //失败 TODO 是否要关闭支付界面，还是停留等待继续点击支付？
	                        $('#payMask').hide().find('.pay-menu').css('bottom','-100%');
	                        $('.pay_end').hide();
	                        mui.toast('支付失败');
	                        //window.location.reload();
	                    }
	
	                });
				})
					
		    });
			
		}
		//	去支付
		//	开页面 、 赋值
		if( $this.text() == '去支付' ) {
			
			mui.openWindow({
				url: 'order-detail.html',
				id: 'order-detail',
				waiting: {
					autoShow: true
				},
				extras: {
					order_id: $id,
					store_id: $sid,
					order_amount: $order_amount,
					gc_id: $gcId,
					area_id: $cityInfo.area_id
				}
			})
		}
	})
	
})



