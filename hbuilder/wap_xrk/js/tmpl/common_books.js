//公共预约
$(function(){
	var $booksparam = JSON.parse( decodeURIComponent( getQueryString('booksparam') ));
	console.log(decodeURIComponent( getQueryString('booksparam')));
//	var key = _.userInfo.getKey();
//	var key = 'a06cd75f74176499bcfa0e6d9d699a67';
	var key = 'e509dd4f6f33f263dac3b5391bff1d3d';
	var index = '';
	var data_relatedfield = '';
	var bjspec = window.localStorage.getItem('bjspec') ? window.localStorage.getItem('bjspec') : '';
	var bjdangqi = window.localStorage.getItem('bjdangqi') ? window.localStorage.getItem('bjdangqi') : '';
	var address = window.localStorage.getItem('address_from') ? window.localStorage.getItem('address_from') : '';
	console.log(bjspec);
	console.log(bjdangqi);
	
	if($booksparam){
		if($booksparam.gc_id == 20){
			$('.baojie_bottom').css('display', 'block');
		}
		loaddata($booksparam);
	}
	function loaddata(booksparam) {
		if(!key) {
			checkLogin(0);
			return false;
		}
		$.getJSON(ApiUrl + '/index.php?act=books&op=getFieldList', {
			gc_id: booksparam.gc_id,
			key: key,
			city_id: 224
		}, function(result) {
			if(result.code == 200) {
				_.customerField.gc_id = booksparam.gc_id;
				_.customerField.type_id = booksparam.type_info.type_id;
				var fieldslist = result.datas;
				//提前处理需求表中的字段    详情传过来的字段
				_.customerField.updateBooksFieldsValue(fieldslist,booksparam);
				var html = _.customerField.htmlFields(fieldslist, 1);
				$('#fieldscontent').html(html);
				//动态添加元素后，绑定事件
				_.customerField.initcontrols();
				
				// 添加套餐
				if(bjspec!=''){
					$('#home').removeClass('hide').siblings('.content').addClass('hide');
					$('#selecttaocan_detail').css('display', 'block');
					var data = JSON.parse(bjspec);
					console.log(data);
					var $html1 = '';
					var totalPrice = 0;
					var selectType = data.custom.select_type;
					if(selectType == 2){
				  		var len = parseInt( $('#select-spec .spec dl').length );
				  		for(var i=0;i<data.items.length;i++){
				  			$html1 += '<dl><dt><img src="'+data.items[i].item_img+'" /></dt>'
							+'<dd><p>'+data.items[i].item_name+'</p><p>'+data.items[i].default_price+'</p><span class="qty">x'+data.items[i].qty+'</span></dd></dl>';
							totalPrice += data.items[i].default_price * data.items[i].qty;
			  			}
				  	}else{
				  		if(data.items == ''){
				  			$html1 += '<dl><dt><img src="'+data.custom.item_img+'" /></dt>'
						+'<dd><p>'+data.custom.custom_name+'</p><p>'+data.custom.unit_price+'</p><span class="qty">x'+data.custom.qty+'</span></dd></dl>';
							totalPrice = data.custom.unit_price * data.custom.qty;
				  		}else{
				  			for(var i=0;i<data.items.length;i++){
					  			$html1 += '<dl><dt><img src="'+data.items[i].item_img+'" /></dt>'
								+'<dd><p>'+data.items[i].item_name+'</p><p>'+data.items[i].default_price+'</p><span class="qty">x'+data.items[i].qty+'</span></dd></dl>';
								totalPrice += data.items[i].default_price * data.items[i].qty;
				  			}
				  		}
				  	}
			  		$('#selecttaocan_detail').html($html1);
				  	$('.selecttaocan input').val(JSON.stringify(data));
					var data_relatedfield = $('.selecttaocan').attr('data-relatedfield');
					if(data_relatedfield){
						$('input[name='+data_relatedfield+']').val(parseInt(totalPrice));
						$('input[name='+data_relatedfield+']').siblings('span').html(parseInt(totalPrice));
					}
				}
				// 添加档期
				if(bjdangqi != ''){
					$('.selectdangqi input').val(bjdangqi);
					$('.selectdangqi .mui-right-text').html(bjdangqi);
				}
				//添加地址
				if(address){
					var address_from = JSON.parse(address);
					
				}
			}
		});
		
		
		
		
		//订单描述
		var type_id = booksparam.type_info.type_id;
		$.ajax({
			type:"get",
			url:ApiUrl + "/index.php?act=type&op=gettypeinfo",
			data: {
				type_id: type_id
			},
			async:true,
			dataType: "json",
			success: function(res){
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
				
				$booksparam.books_amount = parseFloat($('input[name="books_price"]').val());
				console.log($booksparam.books_amount);
				//转到预约确认页面
				data.orderinfo = {};
				data.orderinfo.goods_id = $booksparam.goods_id;
				data.orderinfo.prop = 0;  //预约订单
				data.orderinfo.order_amount = $booksparam.books_amount;
				data.type_info = booksparam.type_info;
				//console.log(JSON.stringify(data));
				window.location.href = 'order/service_buy.html?param='+encodeURI(JSON.stringify(data) );
//				mui.openWindow({
//					url: 'order/service_buy.html',
//					id: 'service_buy',
//					extras: data,
//					waiting: {
//						autoShow: true,
//						title: '正在加载...'
//					}
//				})
			}
			$(this).removeAttr('disabled');
		})
	}
	
	//加入自定义loaddata事件，但是需要外面触发，不触发的时候本页面没法加载数据。
//	window.addEventListener('loaddata', function(event) {
//		$booksparam = event.detail;
//		console.log(JSON.stringify($booksparam));
//		loaddata($booksparam);
//
//	})
	
//	mui.plusReady(function(){
//		var webview = plus.webview.currentWebview();
//		$booksparam = webview.booksparam;
//		console.log("预约表单"+JSON.stringify($booksparam));
		
//	})
})
