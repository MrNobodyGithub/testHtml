//公共预约
$(function(){
//	var $booksparam = JSON.parse( decodeURIComponent( getQueryString('booksparam') ));
	var $booksparam = {"goods_id":"101207","gc_id":"20","books_price":"70.00","books_amount":"70.00","books_unit":"次","books_qty":1,"spec":{"spec_name":{"2":"保洁类型","3":"保洁时间"},"spec_value":{"2":"日常保洁","3":"2小时"}},"type_info":{"gc_id":"20","gc_name":"保洁","type_id":"19","type_name":"保洁","gc_parent_id":"1","commis_rate":"19","gc_sort":"0","gc_virtual":"0","gc_title":"","gc_keywords":"","gc_description":"","show_type":"1","prop":"1","sec_id":"0","gc_img":null,"type_sort":"0","class_id":"1","class_name":"","is_face":"0","is_needs":"1","is_services":"1","is_books":"0","is_show_num":"1","pay_method":"1","deposit":"0.00","pc_list_templet":"","pc_detail_templet":"","app_list_templet":"tmpl/common-list.html","app_detail_templet":"common-detail.html","form_needs_id":"27","form_books_id":"28","type_model":"0","response_type":"1","agreement":"","timeout_cancel":"5","timeout_eval":"0","books_desc":"订单生成后：服务开始前3小时以内（含3小时），取消订单扣除订单全部金额；服务后：不予退单；备注：上门服务后可追加时间，30元/小时","needs_desc":"订单生成后：服务开始前3小时以内（含3小时），取消订单扣除订单全部金额；服务后：不予退单；备注：上门服务后可追加时间，30元/小时","is_need_period":"1","period_days":"10","interval_minute":"60","have_items":"0","service_begin_time":"9:1","service_end_time":"18:11"}};
//	var key = _.userInfo.getKey();
//	var key = 'a06cd75f74176499bcfa0e6d9d699a67';
	var key = 'e509dd4f6f33f263dac3b5391bff1d3d';
	var index = '';
	var data_relatedfield = '';
	var bjspec = window.localStorage.getItem('bjspec') ? window.localStorage.getItem('bjspec') : '';
	var bjdangqi = window.localStorage.getItem('bjdangqi') ? window.localStorage.getItem('bjdangqi') : '';
	var address = window.localStorage.getItem('address_from') ? window.localStorage.getItem('address_from') : '';
//	console.log(bjspec);
//	console.log(bjdangqi);
	
	if($booksparam){
		if($booksparam.gc_id == 20){
			$('.baojie_bottom').css('display', 'block');
		}
		loaddata($booksparam);
	}
	console.log(key);
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
//					console.log(data);
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
				
				$booksparam.books_amount = parseFloat($('input[name="books_price"]').val());
				console.log($booksparam.books_amount);
				//转到预约确认页面
				data.orderinfo = {};
				data.orderinfo.goods_id = $booksparam.goods_id;
				data.orderinfo.prop = 0;  //预约订单
				data.orderinfo.order_amount = $booksparam.books_amount;
				data.type_info = booksparam.type_info;
				window.location.href = 'order/service_buy.html?param='+encodeURI(JSON.stringify(data) );
			}
			$(this).removeAttr('disabled');
		})
	}
})
