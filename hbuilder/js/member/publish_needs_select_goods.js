$(function() {
	mui.init({
		swipeBack: true
	});
	bindevent();
	//绑定事件
	function bindevent(){
		//选择商品类型
		$('.tagname li').on('tap',function(){
			$(this).addClass('active').siblings().removeClass('active');
		})
		//购买地址方式
		$('input[name="needs_address_kind"]').on('change',function(){
			$('#area_info_li').toggleClass('mui-hidden');
			$('#address_li').toggleClass('mui-hidden');
		})
		// 地图选择地址
		$('#area_info_li').on('click', function() {
			mui.openWindow({
				url: "address_select_map.html",
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
	}

$('.footer-menu a.link').click(function() {
		var needs_goods_kind = $('ul.tagname li.active').text();
		var needs_goods_money = $('#needs_goods_money').val();
		var needs_goods_description = $('#needs_goods_description').val();
		var needs_address_kind = $('input[name="needs_address_kind"]:checked').val();
		
		var area_info = $('#area_info').val();
		var address = $('#address').val();
		
		var lng = $('#area_info').attr('lng');
		var lat = $('#area_info').attr('lat');
			
		//简单校验
		if(needs_goods_money == null || needs_goods_money == ''){
			mui.toast('请输入商品预期费用！');
			return false;
		}
		if (!(/^[0-9]+(\.[0-9]+)?$/.test(needs_goods_money))){
			mui.toast('请输入商品预期费用格式输入错误！');
			return false;
		}
		if(needs_address_kind == '1'){
			//指定地址，要检验地址是否填写。
			if(area_info == null || area_info == ''){
				mui.toast('请选择地区！');
				return false;
			}
			if(address == null || address == ''){
				mui.toast('请输入详细地址！');
				return false;
			}
		}
		//执行回调函数
		mui.plusReady(function(){
			var self = plus.webview.currentWebview();
			var opener = self.opener();
			var eventName = self.eventName;
			if(eventName){
				mui.fire(opener,eventName,{needs_goods_kind:needs_goods_kind,needs_goods_money:needs_goods_money,needs_goods_description:needs_goods_description,needs_address_kind:needs_address_kind,area_info:area_info,address:address,lng:lng,lat:lat});
			}
			//会有切场干扰
			self.close();
		})

	});

	//加入自定义fill_address_to事件
	window.addEventListener('fill_area_info', function(event) {
		var $param = event.detail;
		console.log(JSON.stringify($param));
		$('#area_info').val($param.address);
		$('#area_info').attr('lng',$param.lng);
		$('#area_info').attr('lat',$param.lat);
		//TODO 省市区有问题
		//console.log($('#area_info').attr('lng'));
	})
	
});