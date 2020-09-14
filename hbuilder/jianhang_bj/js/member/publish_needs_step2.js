var key = _.userInfo.getKey();
var $classInfo = window.localStorage.getItem('$classInfo') || '';
var gcId = '';
var	typeModel = '';
var	typeId = '';
var index = '';
var data_relatedfield = '';

$(function() {
	if(!key){
		mui.confirm('请登录', '向日葵来了', ['去登陆'], function(e){
			mui.openWindow({
				url: '../login.html'
			})
		});
		return false;
	}
	//保洁固定分类
	var userPicker = new mui.PopPicker();
	userPicker.setData(getKind());
	// 初始 默认值
	if($classInfo){
		$classInfo = JSON.parse($classInfo);
		$('#showUserPicker .mui-right-text').html($classInfo.text);
		gcId = $classInfo.gcId;
		typeModel = $classInfo.typeModel || 0;
		typeId = $classInfo.typeId;
	}else{
		$('#showUserPicker .mui-right-text').html(userPicker.pickers[0].items[0].text);
		$classInfo = userPicker.pickers[0].items[0];
		gcId = $classInfo.gcId;
		typeModel = $classInfo.typeModel || 0;
		typeId = $classInfo.typeId
	}
	$('#showUserPicker').on('tap', function(event) {
		var bjspec = window.localStorage.getItem('bjspec') ? window.localStorage.getItem('bjspec') : '';
		var bjdangqi = window.localStorage.getItem('bjdangqi') ? window.localStorage.getItem('bjdangqi') : '';
		var address = window.localStorage.getItem('address_from') ? window.localStorage.getItem('address_from') : '';
		userPicker.show(function(items) {
			$('#kind').val(JSON.stringify(items[0]));
			$('#showUserPicker .mui-right-text').html(items[0].text);
			$classInfo = items[0];
			window.localStorage.setItem('$classInfo', JSON.stringify($classInfo));
			gcId = $classInfo.gcId;
			typeModel = $classInfo.typeModel || 0;
			typeId = $classInfo.typeId;
			if(bjspec){
				window.localStorage.removeItem('bjspec');
			}
			if(bjdangqi){
				window.localStorage.removeItem('bjdangqi');
			}
			if(address){
				window.localStorage.removeItem('address_from');
			}
			if($classInfo){
				loaddata(gcId, typeId);
				getTips(typeId);
			}
		});
	});
	
	if($classInfo){
		loaddata(gcId, typeId);
		getTips(typeId);
	}
	//处理提交事件
	$('#submit').on('tap', function() {
		var beginDate = $("#needs_time_from").val();
		var endDate = $("#needs_time_to").val();
		var needs_price = $('#needs_price').val();
		if(beginDate != "" && endDate != "" && d1 > d2) {
			mui.alert("开始时间不能大于结束时间！");
			return false;
		}
		if($classInfo.typeId == "23") {
			var d1 = Date.parse(new Date(beginDate));
			var d2 = Date.parse(new Date(endDate));
			var totalPrice = ((parseInt(d2 - d1) / 1000 / 3600 / 24) + 1) * parseInt(needs_price);
		}
		//订单详情页
		if($.sValid()) {
			var data = _.customerField.processlabeldata();
			data.labelparam.unshift({label: '保洁类型', value: $classInfo.value})
			data.orderinfo = {};
			data.orderinfo.prop = 1;
			data.orderinfo.type_model = typeModel;
			data.orderinfo.order_amount = data.param.needs_amount || data.param.needs_price;
			if(totalPrice) {
				data.orderinfo.totalPrice = totalPrice;
			}
			
			if(data.param.needs_price == "0" || data.param.needs_price == "0.0" || data.param.needs_price == "0.00" || data.param.needs_price == "") {} else {
				mui.openWindow({
					url: 'order/service_buy.html?param=' + encodeURIComponent(JSON.stringify(data))
				})
			}
		}
	})
});
function getKind(){
	var setData = [];
	$.ajax({
		type:'get',
		url:ApiUrl + '/index.php?act=service_class&op=get_service_class_and_child',
		data: {
			key: key
		},
		async:false,
		dataType: 'json',
		success: function(res){
			for(var i in res.datas.class_list[0].child){
  				var data = {}; 
  				data.value = res.datas.class_list[0].child[i].gc_name;
  				data.gcId = res.datas.class_list[0].child[i].gc_id;
  				data.typeId = res.datas.class_list[0].child[i].goods_class_type.type_id;
  				data.parentName = res.datas.class_list[0].child[i].goods_class_type.type_name;
  				data.text = res.datas.class_list[0].child[i].gc_name;
  				data.typeModel = res.datas.class_list[0].child[i].goods_class_type.type_model;
  				data.needs_desc = res.datas.class_list[0].child[i].goods_class_type.needs_desc;
  				setData.push(data);
  			}
		}
	});
	return setData;
}
//不同订单类型 不同描述
function getTips(typeId) {
	$.ajax({
		type: "get",
		url: ApiUrl + "/index.php?act=type&op=gettypeinfo",
		data: {
			type_id: typeId
		},
		async: true,
		dataType: "json",
		success: function(res) {
			$('.mui-tips').html("<span><img src='../images/biaozhun.png'style='width:100%;'/><span><br />"+res.datas.type_info.books_desc);

		}
	});
}

function loaddata(gc_id, type_id) {
	var $cityInfo = _.getCityInfo() || _.getDefaultCityInfo();
	var bjspec = window.localStorage.getItem('bjspec') ? window.localStorage.getItem('bjspec') : '';
	var bjdangqi = window.localStorage.getItem('bjdangqi') ? window.localStorage.getItem('bjdangqi') : '';
	var address = window.localStorage.getItem('address_from') ? window.localStorage.getItem('address_from') : '';
	$.getJSON(ApiUrl + '/index.php?act=needs&op=getFieldList', {
		gc_id: gc_id,
		city_id: $cityInfo.area_id,
		key: key //key
	}, function(result) {
		if(result.code == 200) {
			_.customerField.gc_id = gc_id;
			_.customerField.type_id = type_id;
			var html = _.customerField.htmlFields(result.datas, 2);
			$('#fieldscontent').html(html);
			//动态添加元素后，绑定事件
			_.customerField.initcontrols();
			
			// 添加套餐
			if(bjspec){
				$('#home').removeClass('hide').siblings('.content').addClass('hide');
				$('#selecttaocan_detail').css('display', 'block');
				var data = JSON.parse(bjspec);
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
			if(bjdangqi){
				$('.selectdangqi input').val(bjdangqi);
				$('.selectdangqi .mui-right-text').html(bjdangqi);
			}
			//添加地址
			if(address){
				var address_from = JSON.parse(address);
				
			}
		} else {
			mui.alert(result.datas.error);
			//如果没有表单，跳转图片
			_.customerField.gc_id = gc_id;
			var html = "<img src='../images/weikaitong.png' style='width:100%;  height:100%;'/>";
			$('#fieldscontent').html(html);
			$('.mui-tips').html('');
			$('.mui-content-padded').html('');
			$('#showUserPicker').hide();
		}

	});
}