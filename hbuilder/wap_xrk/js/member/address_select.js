$(function() {
	var key = _.userInfo.getKey();
	//初始化默认值,正常应该从上个页面带出来
	var userinfo = _.userInfo.get();
	var eventName = getQueryString('eventName');
	$('#true_name').val(userinfo['username']);
	$('#mob_phone').val(userinfo['phone']);
	console.log(userinfo);
	console.log(key);
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
			};
			window.localStorage.setItem(eventName, JSON.stringify(eventData))
			console.log(eventData);
			mui.openWindow({
				url: 'publish_needs_runner.html?eventName='+ eventName 
			})
			
		}
	});
	$('#area_info').each(function(){
		var $input = $(this);
		if(eventName){
			var address = window.localStorage.getItem(eventName);
			if(address){
				var $param = JSON.parse(address) ;
				console.log($param);
				$input.val(($param.address || ''));
				$input.attr('city',$param.city || '');
				$input.attr('district',$param.district || '');
				$input.attr('title',$param.title || '');
				$input.attr('address',$param.address || '');
				$input.attr('lng',$param.lng || '');
				$input.attr('lat',$param.lat || '');
			}
		}
	})
	// 地图选择地址
	$('#area_info').on('click', function() {
		mui.openWindow({
			url: "../common/address_select_map.html?eventName=" + getQueryString('eventName'),
			id: "address_select_map"
		})
	});
});