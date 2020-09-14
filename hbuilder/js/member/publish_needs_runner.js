$(function() {
	mui.init();
	var key = _.userInfo.getKey();
	var $classInfo = null;
	var $cityInfo = _.getCityInfo()||_.getDefaultCityInfo;
	console.log(JSON.stringify($cityInfo));
	mui.init({
		swipeBack: true
	});
	//全局业务类型,分类id
	var type_model = 1;
	//var gc_id = 0;
	var class_model = null;
	var map = {};
	var searchObj = null;
	//跑腿分类默认为2
	var gc_id = 2;
	//获取列表页banner
	function getbanner(){
		$.ajax({
			type: "get",
			url: ApiUrl + "/index.php?act=banner&op=get20171009",
			async: true,
			data: {
				area_id:$cityInfo.area_id || 0,
				gc_id: $classInfo.gcId
			},
			success: function(res) {
				var html = '';
				var data = JSON.parse(res);
				var result = data.datas.banner_position_list;
				console.log("跑腿banner=="+res);
//				console.log(result);
				if(result != '' || result != null) {
					html = '<img src="' + result[0][0].banner_img + '" alt="">';
				}
				$("#runner_daisong .run-swiper").html(html);
				//plus.nativeUI.closeWaiting();
			}
		});
	};
	
	//订单描述
	function getDetail(typeid){
		$.ajax({
			type:"get",
			url:ApiUrl + "/index.php?act=type&op=gettypeinfo",
			data: {
				type_id: typeid
			},
			async:true,
			dataType: "json",
			success: function(res){
				$('.runbuy-text .mui-tips').html(res.datas.type_info.books_desc);
			}
		});
	}
	
	
	$(".runbuy-buttons a").on("tap", function(e) {
		var that = this;
		var btn = $(that).find('button');
		var url = $(that).attr('href');
		var selmodel = btn.attr('type_model');
		gc_id = selmodel;
		console.log(selmodel);
		if(selmodel == '2'){
			mui.alert('排队业务敬请期待...');
			return false;
		}
		if(selmodel == '3'){
			mui.alert('代买业务敬请期待...');
			return false;
		}
		var active = btn.hasClass('active');
		if(!active) {
			$('section').addClass('mui-hidden');
			$(url).removeClass('mui-hidden').show();
			$('footer').addClass('mui-hidden');
			$(url+"_footer").removeClass('mui-hidden').show();
			type_model = selmodel;
			//切换分类id
			gc_id = class_model[type_model];
		}
		e.preventDefault();
	})
	//协议事件绑定
	$('.runbuy-protocol a').on('tap',function(){
		mui.openWindow({
			url: '../common/type_agreement.html',
			id: "type_agreement",
			createNew: false,
			extras: {
				type_id: $classInfo.typeId
			},
			waiting: {
				autoShow: true,
				title: '正在加载...'
			}
		})
	})
	$('.runbuy-Price a').on('tap',function(){
		mui.openWindow({
			url: '../common/type_price.html',
			id: "type_price",
			createNew: false,
			extras: {
				type_id: $classInfo.typeId
			},
			waiting: {
				autoShow: true,
				title: '正在加载...'
			}
		})
	})
	//初始化控件
	$('.timerpicker').each(function() {
		var that = $(this);
		var data_format = that.attr("data-format");
		var begindate = new Date();
		var enddate = new Date(begindate.getFullYear(),begindate.getMonth(),begindate.getDate()+1,23,59);
		var options = {
			type: data_format,
			beginDate: begindate,//设置开始日期 
    		endDate: enddate,//设置结束日期 
    		//minHours:8,
    		//maxHours:18
		};
		//console.log(JSON.stringify(options));
		var dtPicker = new mui.DtPicker(options);
		var el = that.find('input');
		that.on('tap', function() {
			dtPicker.show(function(item) {
				//console.log(item);
				el.val(item.value);
				el.trigger('change');
			});
		})
	})
	//代送物品类型下拉初始化
	$('.runbuy-item.icon-arrow.icon-run-type').on('tap', function() {
		var picker = new mui.PopPicker();
		picker.setData([{
			value: "蛋糕",
			text: "蛋糕",
		}, {
			value: "鲜花",
			text: "鲜花"
		}, {
			value: "美食",
			text: "美食"
		}, {
			value: "海鲜",
			text: "海鲜"
		}, {
			value: "果蔬生鲜",
			text: "果蔬生鲜"
		}, {
			value: "生活用品",
			text: "生活用品"
		}, {
			value: "电子产品",
			text: "电子产品"
		}, {
			value: "文件证件",
			text: "文件证件"
		}, {
			value: "其他",
			text: "其他"
		}])
		var el = $('#needs_goods_kind_daisong');
		picker.show(function(items) {
			el.val(items[0].value);
		});
	})
	//初始化多图片上传TODO 图片数量限制
	$('.runbuy-image .upload input[type="file"]').ajaxUploadImage({
		url: ApiUrl + "/index.php?act=upload_img&op=image_upload_needs",
		data: {
			key: key,
			name: "file"
		},
		start: function(element) {
			//loading...
			element.after('<div class="upload-loading"><i></i></div>');
		},
		success: function(element, result) {
			//close loading...
			element.siblings('.upload-loading').remove();
			checkLogin(result.login);
			if(result.error) {
				mui.alert('图片尺寸过大！', '提示', '确定');
				return false;
			}
			var el = '<li><input data-label="上传图片" type="hidden" name=needs_images[] value="' + result.datas['name'] + '"> <img class="inputimgs" src="' + result.datas['thumb_name'] + '"/><span class="close"></span></li>';
			element.parent().before(el);
			$('.close').on('click', function() {
				$(this).parent().remove();
			})
		}
	})
	//代送小费change事件
	$('#needs_fee_daisong').change(function(){
		var fee = parseInt($('#needs_fee_daisong').val());
		var price = parseFloat($('#needs_price_daisong').val());
		var total = price + fee;
		$('#needs_amount_daisong').val(total);
		$('#daisong_amount').text(total);
	})
	//代送重量change事件
	$('#needs_weight_daisong').change(function(){
		calcPrice();
	})
	//排队开始事件change事件
	$("#needs_time_from_paidui").change(function(){
		calcPrice();
	})
	//排队结束时间change事件
	$("#needs_time_to_paidui").change(function(){
		calcPrice();
	})
	//排队小费change事件
	$('#needs_fee_paidui').change(function(){
		var fee = parseInt($('#needs_fee_paidui').val());
		var price = parseFloat($('#needs_price_paidui').val());
		var total = price + fee;
		$('#needs_amount_paidui').val(total);
		$('#paidui_amount').text(total);
	})
	//代买小费change事件
	$('#needs_fee_daimai').change(function(){
		var fee = parseInt($('#needs_fee_daimai').val());
		var price = parseFloat($('#needs_price_daimai').val());
		var total = price + fee;
		$('#needs_amount_daimai').val(total);
		$('#daimai_amount').text(total);
	})
	//代买重量change事件
	$('#needs_weight_daimai').change(function(){
		calcPrice();
	})
	
	function submit_daisong() {
		gc_id = $("#runner_daisong").find('button').attr('gc_id');
		$.sValid.init({
			breakOnError: true,
			rules: {
				true_name_from_daisong: "required",
				mob_phone_from_daisong: {
					"required": true,
					"mobile": true
				},
				address_from_daisong: "required",
				true_name_to_daisong: "required",
				mob_phone_to_daisong: {
					"required": true,
					"mobile": true
				},
				address_to_daisong: "required",
				needs_weight_daisong: "required",
				needs_time_from_daisong: "required",
				needs_time_to_daisong: "required"
			},
			messages: {
				true_name_from_daisong: "请输入寄件联系人！",
				mob_phone_from_daisong: {
					"required": "请输入寄件人手机！",
					"mobile": "寄件人手机格式不正确！"
				},
				address_from_daisong: "请输入寄件地址！",
				true_name_to_daisong: "请输入收件联系人！",
				mob_phone_to_daisong: {
					"required": "请输入收件人手机！",
					"mobile": "收件人手机格式不正确！"
				},
				address_to_daisong: "请输入收件地址！",
				needs_weight_daisong: "请输入物品重量！",
				needs_time_from_daisong: "请输入下单时间！",
				needs_time_to_daisong: "请输入送达时间！",
			},
			callback: function(isError, errorMsg) {
				if(isError) {
					mui.toast(errorMsg);
				}
			}
		});

		if($.sValid()) {
			//检查交接时间是否大于取物时间，并且要大于当前时间
			var begintime = new Date($('#needs_time_from_daisong').val());
			var endtime = new Date($('#needs_time_to_daisong').val());
			if(begintime < new Date()){
				mui.toast('下单时间不能小于当前时间');
				return false;
			}
			if(endtime < new Date()){
				mui.toast('送达时间不能小于当前时间');
				return false;
			}
			if(begintime >= endtime){
				mui.toast('送达时间不能小于取物时间');
				return false;
			}
			//检查协议
			var checked = $('#agreement_daisong').prop('checked');
			if(!checked) {
				mui.alert('请阅读说明内容并同意！');
				return false;
			}

			var _form_param = $('#daisong_form').serializeArray();
			var param = {};
			var labelparam = [];
			param.key = _.userInfo.getKey();
			param.gc_id = gc_id;
			var imgarr = [];
			for(var i = 0; i < _form_param.length; i++) {
				var field_name = _form_param[i].name;
				var label = $('#daisong_form [name="' + field_name + '"]').attr('data-label');
				var value = _form_param[i].value;
				var text = value;
				if (field_name == 'address_from' || field_name == 'address_to'){
					var input = $('#daisong_form [name="' + field_name + '"]');
					text = (input.attr('address') || '')  + '(' + (input.attr('title') || '') +')' + (input.attr('detail') || '');
					//console.log(input.val());
				}
				if (field_name == 'needs_images[]'){
					var src = $('#daisong_form [name="' + field_name + '"] + img');
					text = src.attr('src');
					continue;
				}
				param[field_name] = value;
				labelparam.push({
					label: label,
					value: text
				});
			}
			
			// 上传的图片整合成数组
            $('.inputimgs').each(function(key,value){
				imgarr[key] = $(this).attr("src");
			});

			labelparam.push({
				label: '图片',
				value: imgarr
			});


			// console.log(parseParam(param));
			console.log("parseParam(labelparam)");
			console.log(parseParam(labelparam));
			//同时生成labelparam供下个页面回显
			var data = {};
			data.param = param;
			data.labelparam = labelparam;
			data.orderinfo = {};
			data.orderinfo.prop = 1;
			data.orderinfo.type_model = 1;
			data.orderinfo.order_amount = param['needs_amount'];
			console.log(JSON.stringify(data));
			mui.openWindow({
				url: '../order/service_buy.html',
				id: 'service_buy',
				extras: data,
				waiting: {
					autoShow: true,
					title: '正在加载...'
				}
			})
			//
		}
	}

	function submit_paidui() {
		gc_id = $("#runner_paidui").find('button').attr('gc_id');
		$.sValid.init({
			breakOnError: true,
			rules: {
				true_name_to_paidui: "required",
				mob_phone_to_paidui: {
					"required": true,
					"mobile": true
				},
				address_to_paidui: "required",
				needs_time_from_paidui: "required",
				needs_time_to_paidui: "required"
			},
			messages: {
				true_name_to_paidui: "请输入联系人！",
				mob_phone_to_paidui: {
					"required": "请输入联系人手机！",
					"mobile": "联系人手机格式不正确！"
				},
				address_to_paidui: "请输入排队地址！",
				needs_time_from_paidui: "请输入下单时间！",
				needs_time_to_paidui: "请输入交接时间！",
			},
			callback: function(isError, errorMsg) {
				if(isError) {
					mui.toast(errorMsg);
				}
			}
		});
		if($.sValid()) {
			//检查交接时间是否大于取物时间，并且要大于当前时间
			var begintime = new Date($('#needs_time_from_paidui').val());
			var endtime = new Date($('#needs_time_to_paidui').val());
			if(begintime < new Date()){
				mui.toast('排队时间不能小于当前时间');
				return false;
			}
			if(endtime < new Date()){
				mui.toast('交接时间不能小于当前时间');
				return false;
			}
			if(begintime >= endtime){
				mui.toast('交接时间不能小于排队时间');
				return false;
			}
			//检查协议
			var checked = $('#agreement_paidui').prop('checked');
			if(!checked) {
				mui.alert('请勾选协议！');
				return false;
			}

			var _form_param = $('#paidui_form').serializeArray();
			var param = {};
			var labelparam = [];
			param.key = _.userInfo.getKey();
			param.gc_id = gc_id;
			for(var i = 0; i < _form_param.length; i++) {
				var field_name = _form_param[i].name;
				var label = $('#paidui_form [name="' + field_name + '"]').attr('data-label');
				var value = _form_param[i].value;
				var text = value;
				if (field_name == 'address_from' || field_name == 'address_to'){
					var input = $('#paidui_form [name="' + field_name + '"]');
					text = (input.attr('address') || '') + (input.attr('detail') || '');
				}
				param[field_name] = value;
				labelparam.push({
					label: label,
					value: text
				});
				//labelparam[label] = text;
			}
			//console.log(parseParam(param));
			//同时生成labelparam供下个页面回显
			var data = {};
			data.param = param;
			data.labelparam = labelparam;
			data.orderinfo = {};
			data.orderinfo.prop = 1;
			data.orderinfo.type_model = 2;
			data.orderinfo.order_amount = param['needs_amount'];
			//console.log(JSON.stringify(data));
			mui.openWindow({
				url: '../order/service_buy.html',
				id: 'service_buy',
				extras: data,
				waiting: {
					autoShow: true,
					title: '正在加载...'
				}
			})
			//
		}
	}

	function submit_daimai() {
		gc_id = $("#runner_daimai").find('button').attr('gc_id');
		$.sValid.init({
			breakOnError: true,
			rules: {
				needs_goods_kind: "required",
				needs_goods_money: {
					"required": true,
					"currency": true
				},
				true_name_to_daimai: "required",
				mob_phone_to_daimai: {
					"required": true,
					"mobile": true
				},
				address_to_daimai: "required",
				needs_weight_daimai: "required",
				needs_time_to_daimai: "required",
			},
			messages: {
				needs_goods_kind: "请选择代买商品类型！",
				needs_goods_money: {
					"required": "请输入商品预估价格！",
					"currency": "商品预估价格格式不正确！"
				},
				true_name_to_daimai: "请输入收件联系人！",
				mob_phone_to_daimai: {
					"required": "请输入收件人手机！",
					"mobile": "收件人手机格式不正确！"
				},
				address_to_daimai: "请输入收件地址！",
				needs_weight_daimai: "请输入物品重量！",
				needs_time_to_daimai: "请输入送达时间！",
			},
			callback: function(isError, errorMsg) {
				if(isError) {
					mui.toast(errorMsg);
				}
			}
		});
		if($.sValid()) {
			//检查交接时间是否大于取物时间，并且要大于当前时间
			var endtime = new Date($('#needs_time_to_daimai').val());
			if(endtime < new Date()){
				mui.toast('送达时间不能小于当前时间');
				return false;
			}
			//检查协议
			var checked = $('#agreement_daimai').prop('checked');
			if(!checked) {
				mui.alert('请勾选协议！');
				return false;
			}

			var _form_param = $('#daimai_form').serializeArray();
			var param = {};
			var labelparam = [];
			param.key = _.userInfo.getKey(); 
			param.gc_id = gc_id;
			for(var i = 0; i < _form_param.length; i++) {
				var field_name = _form_param[i].name;
				var label = $('#daimai_form [name="' + field_name + '"]').attr('data-label');
				console.log(label);
				var value = _form_param[i].value;
				var text = value;
				if (field_name == 'address_from' || field_name == 'address_to'){
					var input = $('#daimai_form [name="' + field_name + '"]');
					text = (input.attr('address') || '')  + '(' + (input.attr('title') || '') +')'  + (input.attr('detail') || '');
				}
				param[field_name] = value;
				//label修正  
				if (field_name == 'needs_address_kind'){
					//text = (value=='1')?'指定':'不指定';
					continue;
				}
				labelparam.push({
					label: label,
					value: text
				});
				//labelparam[label] = text;
			}
			//console.log(parseParam(param));
			//同时生成labelparam供下个页面回显
			var data = {};
			data.param = param;
			data.labelparam = labelparam;
			data.orderinfo = {};
			data.orderinfo.prop = 1;
			data.orderinfo.type_model = 3;
			data.orderinfo.order_amount = param['needs_amount'];
			//console.log(JSON.stringify(data));
			mui.openWindow({
				url: '../order/service_buy.html',
				id: 'service_buy',
				extras: data,
				waiting: {
					autoShow: true,
					title: '正在加载...'
				}
			})
			//
		}
	}

	//提交按钮
	$('footer a.link').on('tap', function() {
		console.log(type_model);
		switch(type_model) {
			case "1":
				console.log("代送");
				submit_daisong();
				break;
			case "2":
				console.log("排队");
				submit_paidui();
				break;
			case "3":
				console.log("代买");
				submit_daimai();
				break;
			default:
				break;
		}
	})

	//寄件地址选择
	//加入自定义fill_address_from_daisong事件
	window.addEventListener('fill_address_from_daisong', function(event) {
		var $param = event.detail;
		console.log(JSON.stringify($param));
		$("#true_name_from_daisong_txt").text($param.true_name);
		$("#true_name_from_daisong").val($param.true_name);
		$("#mob_phone_from_daisong_txt").text($param.mob_phone);
		$("#mob_phone_from_daisong").val($param.mob_phone);
		$("#address_from_daisong_txt").text($param.address + '('+$param.title+')' + $param.detail);
		
		$("#address_from_daisong").val($param.area_info);
		$("#address_from_daisong").attr('city', $param.city);
		$("#address_from_daisong").attr('district', $param.district);
		$("#address_from_daisong").attr('title', $param.title);
		$("#address_from_daisong").attr('address', $param.address);
		$("#address_from_daisong").attr('detail', $param.detail);
		$("#address_from_daisong").attr('lng', $param.lng);
		$("#address_from_daisong").attr('lat', $param.lat);
		
		calDistance();
	})

	//收件地址选择
	//加入自定义fill_address_to_daisong事件
	window.addEventListener('fill_address_to_daisong', function(event) {
		var $param = event.detail;
		console.log(JSON.stringify($param));
		$("#true_name_to_daisong_txt").text($param.true_name);
		$("#true_name_to_daisong").val($param.true_name);
		$("#mob_phone_to_daisong_txt").text($param.mob_phone);
		$("#mob_phone_to_daisong").val($param.mob_phone);
		$("#address_to_daisong_txt").text($param.address  + '('+$param.title+')' + $param.detail);
		
		$("#address_to_daisong").val($param.area_info);
		$("#address_to_daisong").attr('city', $param.city);
		$("#address_to_daisong").attr('district', $param.district);
		$("#address_to_daisong").attr('title', $param.title);
		$("#address_to_daisong").attr('address', $param.address);
		$("#address_to_daisong").attr('detail', $param.detail);
		$("#address_to_daisong").attr('lng', $param.lng);
		$("#address_to_daisong").attr('lat', $param.lat);
		calDistance();
	})
	//排队地址选择
	//加入自定义fill_address_to_paidui事件
	window.addEventListener('fill_address_to_paidui', function(event) {
		var $param = event.detail;
		//console.log(JSON.stringify($param));
		$("#true_name_to_paidui_txt").text($param.true_name);
		$("#true_name_to_paidui").val($param.true_name);
		$("#mob_phone_to_paidui_txt").text($param.mob_phone);
		$("#mob_phone_to_paidui").val($param.mob_phone);
		$("#address_to_paidui_txt").text($param.address  + '('+$param.title+')' + $param.detail);
		
		$("#address_to_paidui").val($param.area_info);
		$("#address_to_paidui").attr('city', $param.city);
		$("#address_to_paidui").attr('district', $param.district);
		$("#address_to_paidui").attr('title', $param.title);
		$("#address_to_paidui").attr('address', $param.address);
		$("#address_to_paidui").attr('detail', $param.detail);
		$("#address_to_paidui").attr('lng', $param.lng);
		$("#address_to_paidui").attr('lat', $param.lat);
	})

	//加入自定义fill_address_to_daima事件
	window.addEventListener('fill_address_to_daimai', function(event) {
		var $param = event.detail;
		//console.log(JSON.stringify($param));
		$("#true_name_to_daimai_txt").text($param.true_name);
		$("#true_name_to_daimai").val($param.true_name);
		$("#mob_phone_to_daimai_txt").text($param.mob_phone);
		$("#mob_phone_to_daimai").val($param.mob_phone);
		$("#address_to_daimai_txt").text($param.address  + '('+$param.title+')' + $param.detail);
		
		$("#address_to_daimai").val($param.area_info);
		$("#address_to_daimai").attr('city', $param.city);
		$("#address_to_daimai").attr('district', $param.district);
		$("#address_to_daimai").attr('title', $param.title);
		$("#address_to_daimai").attr('address', $param.address);
		$("#address_to_daimai").attr('detail', $param.detail);
		$("#address_to_daimai").attr('lng', $param.lng);
		$("#address_to_daimai").attr('lat', $param.lat);
		calDistance();
	})

	//加入自定义fill_address_to_daima事件
	window.addEventListener('fill_goods_daimai', function(event) {
		var $param = event.detail;
		//console.log(JSON.stringify($param));
		$("#needs_goods_kind_txt").text($param.needs_goods_kind);
		$("#needs_goods_kind").val($param.needs_goods_kind);
		$("#needs_goods_money_txt").text($param.needs_goods_money);
		$("#needs_goods_money").val($param.needs_goods_money);
		//商品描述
		$("#needs_goods_description").val($param.needs_goods_description);
		var needs_address_kind = $param.needs_address_kind;
		$("#needs_address_kind").val(needs_address_kind);
		//
		if (needs_address_kind == "1"){
			$("#address_from_daimai_txt").text($param.address  + '('+$param.title+')' + $param.detail);
		
			$("#address_from_daimai").val($param.area_info);
			$("#address_from_daimai").attr('city', $param.city);
			$("#address_from_daimai").attr('district', $param.district);
			$("#address_from_daimai").attr('title', $param.title);
			$("#address_from_daimai").attr('address', $param.address);
			$("#address_from_daimai").attr('detail', $param.detail);
			$("#address_from_daimai").attr('lng', $param.lng);
			$("#address_from_daimai").attr('lat', $param.lat);
		} else {
			$("#address_from_daimai_txt").text('不指定');
			$("#address_from_daimai").val('不指定');
		}
		calDistance();
	})

	//选择地址事件
	$('.runbuy-address-item').on('tap', function() {
		var $this = $(this);
		var eventName = $this.attr('eventName');
		mui.openWindow({
			url: "address_select.html",
			id: "address_select",
			extras: {
				eventName: eventName  
			},
			show: {
				autoShow: true, //不自动显示，等待页面加载完成后自己处理显示
				aniShow: {
					'slide-in-right': 300
				}
			}
		})
	})
	$('.runbuy-address-item.mai').off('tap').on('tap', function() {
		var $this = $(this);
		var eventName = $this.attr('eventName');
		mui.openWindow({
			url: "publish_needs_select_goods.html",
			id: "publish_needs_select_goods",
			extras: {
				eventName: eventName
			},
			show: {
				autoShow: true, //不自动显示，等待页面加载完成后自己处理显示
				aniShow: {
					'slide-in-right': 300
				}
			}
		})
	})

	function calDistance() {
		if(type_model == 1) {
			//代送
			//取得代送的从坐标
			var from_point = null;
			var lng_from = $("#address_from_daisong").attr('lng');
			var lat_from = $("#address_from_daisong").attr('lat');
			if(lng_from && lat_from) {
				from_point = new plus.maps.Point(lng_from, lat_from);
			}
			//取得代送的到坐标
			var to_point = null;
			var lng_to = $("#address_to_daisong").attr('lng');
			var lat_to = $("#address_to_daisong").attr('lat');
			if(lng_to && lat_to) {
				to_point = new plus.maps.Point(lng_to, lat_to);
			}
			if(from_point && to_point) {
				console.log(JSON.stringify(from_point));
				console.log(JSON.stringify(to_point));
				//searchObj.walkingSearch(from_point,'',to_point,'');
				var policy = plus.maps.SearchPolicy.DRIVING_DIS_FIRST;
				//plus.maps.SearchPolicy.DRIVING_TIME_FIRST
				//plus.maps.SearchPolicy.DRIVING_DIS_FIRST
				//plus.maps.SearchPolicy.DRIVING_FEE_FIRST
				searchObj.setDrivingPolicy(policy);
				searchObj.drivingSearch(from_point, '', to_point, '');
				//console.log('before caling');
				plus.nativeUI.showWaiting('正在计算路线距离');
				//console.log('caling');
			}
		} else if(type_model == 3) {
			//代买
			//取得是否指定地址
			var needs_address_kind = $("#needs_address_kind").val();
			if (needs_address_kind == '0') {
				$('#needs_distance_daimai').val("0");
				calcPrice();
				return 0;
			}
			//取得代买的从坐标
			var from_point = null;
			var lng_from = $("#address_from_daimai").attr('lng');
			var lat_from = $("#address_from_daimai").attr('lat');
			if(lng_from && lat_from) {
				from_point = new plus.maps.Point(lng_from, lat_from);
			}
			//取得代买的到坐标
			var to_point = null;
			var lng_to = $("#address_to_daimai").attr('lng');
			var lat_to = $("#address_to_daimai").attr('lat');
			if(lng_to && lat_to) {
				to_point = new plus.maps.Point(lng_to, lat_to);
			}
			if(from_point && to_point) {
				console.log(JSON.stringify(from_point));
				console.log(JSON.stringify(to_point));
				//searchObj.walkingSearch(from_point,'',to_point,'');
				var policy = plus.maps.SearchPolicy.DRIVING_DIS_FIRST;
				//plus.maps.SearchPolicy.DRIVING_TIME_FIRST
				//plus.maps.SearchPolicy.DRIVING_DIS_FIRST
				//plus.maps.SearchPolicy.DRIVING_FEE_FIRST
				searchObj.setDrivingPolicy(policy);
				searchObj.drivingSearch(from_point, '', to_point, '');
				plus.nativeUI.showWaiting('正在计算路线距离');
			}
		} else {
			return 0;
		}
	}

	function calcPrice() {
		switch(type_model) {
			case '1': //代送
				var distance = parseFloat($('#needs_distance_daisong').val());
				var weight = parseInt($('#needs_weight_daisong').val());
				//应该从后台接口取得价格，目前先写在本地
				distance = Math.ceil(distance);
				weight = Math.ceil(weight);
				var price = 12;
				price += (distance > 3) ? (distance - 3) * 2 : 0;
				price += (weight > 3) ? (weight - 3) * 2 : 0;
				$('#needs_price_daisong').val(price);
				var fee = parseInt($('#needs_fee_daisong').val());
				var total = price + fee;
				$('#needs_amount_daisong').val(total);
				$('#daisong_amount').text(total);
				break;
			case '2': //排队
				var begintime = $('#needs_time_from_paidui').val();
				var endtime = $('#needs_time_to_paidui').val();
				var minute = 0;
				if(begintime != '' && endtime !=''){
					begintime = new Date(begintime);
					endtime = new Date(endtime);
					minute = Math.ceil(Math.abs(endtime-begintime)/1000/60);
				}
				var price = 30;
				price += (minute > 60) ? (minute - 60) * 0.5 : 0;
				$('#needs_price_paidui').val(price);
				var fee = parseInt($('#needs_fee_daimai').val());
				var total = price + fee;
				$('#needs_amount_paidui').val(total);
				$('#paidui_amount').text(total);
				break;
			case '3': //代买
				var distance = parseFloat($('#needs_distance_daimai').val());
				var weight = parseInt($('#needs_weight_daimai').val());
				//应该从后台接口取得价格，目前先写在本地
				distance = Math.ceil(distance);
				weight = Math.ceil(weight);
				var price = 15;
				price += (distance > 3) ? (distance - 3) * 2 : 0;
				price += (weight > 10) ? (weight - 10) * 2 : 0;
				$('#needs_price_daimai').val(price);
				var fee = parseInt($('#needs_fee_daimai').val());
				var total = price + fee;
				$('#needs_amount_daimai').val(total);
				$('#daimai_amount').text(total);
				break;
			default:
				break;
		}
	}

	var onRouteSearchComplete = function(state, result) {
		if(state == 0) {
			if(result.routeNumber <= 0) {
				console.log("没有检索到结果");
			}
			var distance = (result.getRoute(0).distance / 1000).toFixed(2);
			//console.log(distance);
			//console.log(type_model);
			if(type_model == "1") {
				$('#needs_distance_daisong').val(distance);
			} else if(type_model == "3") {
				$('#needs_distance_daimai').val(distance);
			}
			//计算费用
			calcPrice();
			//for(var i=0; i<result.routeNumber; i++){
			//map.addOverlay( result.getRoute( i ) );
			//console.log(JSON.stringify(result.getRoute(0).distance));
			//}
		} else {
			if(type_model == "1") {
				$('#needs_distance_daisong').val(0);
			} else if(type_model == "3") {
				$('#needs_distance_daimai').val(0);
			}
			//计算费用
			calcPrice();
			console.log("检索失败");
			mui.toast('路线距离检索失败！');
		}
		//关闭loading
		plus.nativeUI.closeWaiting();
	}
	mui.plusReady(function() {
		var ws = plus.webview.currentWebview();
		mui.back = function() {
			var wo = ws.opener();
			ws.close();
			wo.show();
		}
		$classInfo = ws.classInfo;
		gc_id = $classInfo.gcId;
		type_model = $classInfo.typeModel;
		class_model = $classInfo.classModel;
		switch(type_model) {
			case "1":
				//默认不用动
				break;
			case "2":
				$('section').addClass('mui-hidden');
				$('#runner_paidui').removeClass('mui-hidden');
				$('footer').addClass('mui-hidden');
				$('#runner_paidui_footer').removeClass('mui-hidden');
				break;
			case "3":
				$('section').addClass('mui-hidden');
				$('#runner_daimai').removeClass('mui-hidden');
				$('footer').addClass('mui-hidden');
				$('#runner_daimai_footer').removeClass('mui-hidden');
				break;
			default:
				break;
		}
		getbanner();
		
		//详情描述
		getDetail($classInfo.typeId);
		
		//创建一个隐藏的百度地图
		map = new plus.maps.Map("map");
		searchObj = new plus.maps.Search(map);
		searchObj.onRouteSearchComplete = onRouteSearchComplete;
		ws.show('slide-in-right', 300);
		plus.nativeUI.closeWaiting();
		
		
	})

})