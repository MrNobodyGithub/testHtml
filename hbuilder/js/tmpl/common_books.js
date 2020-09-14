//公共预约
$(function(){
	var $booksparam;
	
	function loaddata(booksparam) {
		var key = _.userInfo.getKey();
		if(!key) {
			checkLogin(0);
			return;
		}
//		console.log("booksparam:"+JSON.stringify(booksparam));
		$.getJSON(ApiUrl + '/index.php?act=books&op=getFieldList', {
			gc_id: booksparam.gc_id,
			key: key
		}, function(result) {
			console.log(JSON.stringify(result));
			if(result.code == 200) {
				_.customerField.gc_id = $booksparam.gc_id;
				_.customerField.type_id = $booksparam.type_info.type_id;
				var fieldslist = result.datas;
				//提前处理需求表中的字段
				_.customerField.updateBooksFieldsValue(fieldslist,$booksparam);
				var html = _.customerField.htmlFields(fieldslist, 1);
				$('#fieldscontent').html(html);
				//动态添加元素后，绑定事件
				_.customerField.initcontrols();
			}
		});
		
		//订单描述
		var type_id = booksparam.type_info.type_id;
		console.log('type_id:'+ type_id);
		$.ajax({
			type:"get",
			url:ApiUrl + "/index.php?act=type&op=gettypeinfo",
			data: {
				type_id: type_id
			},
			async:true,
			dataType: "json",
			success: function(res){
//				console.log('预约描述----'+res.datas);
				$('.mui-tips').html(res.datas.type_info.books_desc);
			}
		});
		//处理提交事件，到下一个页面显示预约详情
		$('#submit').on('tap', function() {
			$(this).attr('disabled', 'disabled');
			if($.sValid()) {
                var data = _.customerField.processlabeldata();
				// @author thanatos 判断是否面试
				/*
				if( booksparam.type_info != '' &&  booksparam.type_info.is_face == 1 ){
					// 创建订单
                    var create_url = ApiUrl+"/index.php?act=service_member_order&op=create_order",
						create_data = {
                    		param: data.param,
							key: key,
							prop:0,
                            goods_data:[booksparam.goods_id]
						};

                    _.data.send(create_url, 'post', true, create_data, function(data){
                    	console.log(JSON.stringify(data));
						if( data.code == 200 ){
							mui.alert('预约成功', '',function(){
								mui.openWindow({
                                    url: 'member/service-order-all.html',
                                    id: '',
                                    extras: {
                                    	status:1
									},
                                    waiting: {
                                        autoShow: true,
                                        title: '正在加载...'
                                    }
                            		})
							});

						}else{
							mui.alert(data.datas.error);
						}
                    });
					$(this).removeAttr('disabled');
	                return false;
				}
				*/
				//转到预约确认页面
				data.orderinfo = {};
				data.orderinfo.goods_id = $booksparam.goods_id;
				data.orderinfo.prop = 0;  //预约订单
				data.orderinfo.order_amount = $booksparam.books_amount;
				data.type_info = booksparam.type_info;
				//console.log(JSON.stringify(data));
				mui.openWindow({
					url: 'order/service_buy.html',
					id: 'service_buy',
					extras: data,
					waiting: {
						autoShow: true,
						title: '正在加载...'
					}
				})
			}
			$(this).removeAttr('disabled');
		})
	}
	
	//加入自定义loaddata事件，但是需要外面触发，不触发的时候本页面没法加载数据。
	window.addEventListener('loaddata', function(event) {
		$booksparam = event.detail;
		console.log(JSON.stringify($booksparam));
		loaddata($booksparam);

	})
	
	mui.plusReady(function(){
		var webview = plus.webview.currentWebview();
		$booksparam = webview.booksparam;
		if($booksparam){
			console.log(JSON.stringify($booksparam));
			loaddata($booksparam);
		}
	})
})
