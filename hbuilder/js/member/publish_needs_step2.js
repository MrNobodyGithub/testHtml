$(function() {
	var key = _.userInfo.getKey();
	console.log(key);
	var $classInfo = null;
	var gcId = null;
	var ws = null,
		wo = null;
	var typeModel;
	mui.plusReady(function() {
		ws = plus.webview.currentWebview();
		wo = ws.opener();
		$classInfo = ws.classInfo;
		var gcId = $classInfo.gcId;
		typeModel = $classInfo.typeModel || 0;
		var typeId = $classInfo.typeId;
		console.log(gcId);
		console.log(typeId);
		loaddata(gcId, typeId);

		//不同订单类型 不同描述
		$.ajax({
			type: "get",
			url: ApiUrl + "/index.php?act=type&op=gettypeinfo",
			data: {
				type_id: typeId
			},
			async: true,
			dataType: "json",
			success: function(res) {
				//								console.log('预约描述----'+JSON.stringify(res));
				console.log("gcId  " + gcId);
				if(gcId == 20) {
					$('.mui-tips').html(res.datas.type_info.books_desc + "<br/><span><img src='../../images/biaozhun.png'style='width:100%;'/><span>");
				} else {
					$('.mui-tips').html(res.datas.type_info.books_desc);
				}

			}
		});
	})

	function loaddata(gc_id, type_id) {
		var $cityInfo = _.getCityInfo() || _.getDefaultCityInfo();
		$.getJSON(ApiUrl + '/index.php?act=needs&op=getFieldList', {
			gc_id: gc_id,
			city_id: $cityInfo.area_id,
			key: key //key
		}, function(result) {
			//console.log(JSON.stringify(result));
			if(result.code == 200) {
				_.customerField.gc_id = gc_id;
				_.customerField.type_id = type_id;
				var html = _.customerField.htmlFields(result.datas, 2);
				$('#fieldscontent').html(html);
				//动态添加元素后，绑定事件
				_.customerField.initcontrols();
			} else {
				//如果没有表单，跳转图片
				_.customerField.gc_id = gc_id;
				var html = "<img src='../../images/weikaitong.png' style='width:100%;  height:100%;'/>";
				$('#fieldscontent').html(html);
				$('.mui-tips').html('');
				$('.mui-content-padded').html('');
			}

			ws.show('slide-in-right', 300);
			plus.nativeUI.closeWaiting();
		});
	}

	window.addEventListener('loaddata', function(event) {
		var gcId = event.detail.gcId;
		loaddata(gcId);
	})

	//处理提交事件
	$('#submit').on('tap', function() {
		var beginDate = $("#needs_time_from").val();
		var endDate = $("#needs_time_to").val();

		var needs_price = $('#needs_price').val();

		if(beginDate != "" && endDate != "" && d1 > d2) {
			mui.alert("开始时间不能大于结束时间！");
			return false;
		}
		//		console.log($classInfo);
		if($classInfo.typeId == "23") {
			var d1 = Date.parse(new Date(beginDate));
			var d2 = Date.parse(new Date(endDate));
			console.log("护工天数--" + (parseInt(d2 - d1) / 1000 / 3600 / 24 + 1));
			var totalPrice = ((parseInt(d2 - d1) / 1000 / 3600 / 24) + 1) * parseInt(needs_price);
			console.log("money" + totalPrice);
		}
		if($.sValid()) {
			//转到需求确认页面
			var data = _.customerField.processlabeldata();
			data.orderinfo = {};
			data.orderinfo.prop = 1;
			data.orderinfo.type_model = typeModel;
			data.orderinfo.order_amount = data.param.needs_amount || data.param.needs_price;
			if(totalPrice) {
				data.orderinfo.totalPrice = totalPrice;
			}
			console.log(JSON.stringify(data));
			if(data.param.needs_price == "0" || data.param.needs_price == "0.0" || data.param.needs_price == "0.00" || data.param.needs_price == "") {} else {
				mui.openWindow({
					url: '../order/service_buy.html',
					id: 'service_buy',
					extras: data,
					waiting: {
						autoShow: true,
						title: '正在加载...'
					}
				})
			}
		}
	})

});