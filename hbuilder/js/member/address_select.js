$(function() {
	mui.init({
		swipeBack: true
	});

	var key = _.userInfo.getKey();
	//初始化默认值,正常应该从上个页面带出来
	var userinfo = _.userInfo.get();
	$('#true_name').val(userinfo['username']);
	$('#mob_phone').val(userinfo['phone']);
	//
	//定义回调函数
	var callback = function(){};
	$.sValid.init({
		breakOnError: true,
		rules: {
			true_name: "required",
			mob_phone: {"required":true,"mobile":true},
			area_info: "required",
			address: "required"
		},
		messages: {
			true_name: "请输入联系人！",
			mob_phone: {"required":"请输入手机！","mobile":"手机格式不正确！"},
			area_info: "请输入地址！",
			address: "请输入详细地址！"
		},
		callback: function(isError, errorMsg) {
			if(isError) {
				mui.toast(errorMsg);
			}
		}
	});

	$('.btn-yellow').click(function() {
		if($.sValid()) {
			var true_name = $('#true_name').val();
			var mob_phone = $('#mob_phone').val();
			
			var city_id = $('#area_info').attr('data-city_id') || 0;
			var area_id = $('#area_info').attr('data-area_id') || 0;
			
			var city = $('#area_info').attr('city') || '';
			var	district = $('#area_info').attr('district') || '';
			
			var title = $('#area_info').val() || '';
			var address = $('#area_info').attr('address') || '';
			
			var detail = $('#address').val();
			
			var lng = $('#area_info').attr('lng') || '';
			var lat = $('#area_info').attr('lat') || '';

			var area_info = city + '|' + district + '|'+ title + '|' + address + '|' + detail+ '|' + lng + ',' + lat;
			//
			var is_default = $('#is_default').hasClass('mui-active') ? 1 : 0;
			var savetoaddress = $('#savetoaddress').prop('checked');
			//如果勾选了保存到地址库
			if(savetoaddress){
			$.ajax({
				type: 'post',
				url: ApiUrl + "/index.php?act=member_address&op=address_add",
				data: {
					key: key,
					true_name: true_name,
					mob_phone: mob_phone,
					city_id: city_id,
					area_id: area_id,
					address: detail,
					area_info: area_info,
					is_default: is_default
				},
				dataType: 'json',
				success: function(result) {
				}
			});
			}
			//执行回调函数
			mui.plusReady(function(){
				var self = plus.webview.currentWebview();
				var opener = self.opener();
				var eventName = self.eventName;
				var eventData = {
					true_name:true_name,
					mob_phone:mob_phone,
					area_info:area_info,
					city:city,
					district:district,
					title:title,
					address:address,
					detail:detail,
					lng:lng,
					lat:lat
				}
				if(eventName){
					mui.fire(opener,eventName,eventData);
				}
				//会有切场干扰
				self.close();
			})
			
		}
	});

	//加入自定义fill_address_to事件
	window.addEventListener('fill_area_info', function(event) {
		var $param = event.detail;
		//console.log(JSON.stringify($param));
		$('#area_info').val($param.title);
		$('#area_info').attr('city',$param.city);
		$('#area_info').attr('district',$param.district);
		$('#area_info').attr('address',$param.address);
		$('#area_info').attr('lng',$param.lng);
		$('#area_info').attr('lat',$param.lat);

	})
	// 地图选择地址
	$('#area_info').on('click', function() {
		mui.openWindow({
			url: "../common/address_select_map.html",
			id: "address_select_map",
			extras: {
				eventName: 'fill_area_info'
			},
			show: {
				autoShow: true,  //不自动显示，等待页面加载完成后自己处理显示
				aniShow:{'slide-in-right': 300}
			}
		})
	});
});