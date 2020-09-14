$(function() {

	getHotcity(); //热门城市方法调用
	ajaxGetCityList(); //获取城市列表方法

	//热门城市
	function getHotcity() {
		$.ajax({
			type: "get",
			url: ApiUrl + "/index.php?act=zx_cityarea&op=servicecity",
			dataType: "json",
			async: true,
			success: function(res) {
				var html = '';
				for(var i = 0; i < res.datas.length; i++) {
					html += '<span data-id = "' + res.datas[i].area_id + '">' + res.datas[i].area_name + '</span>'
				}
				$('.hotcity dd').html(html);
			}
		});
	}

	function fillCityList(cityList) {
		var $len = cityList.length;
		var $html = '',
			$menu = '<span>#</span>';
		$city = [],
			$farr = [];
		for(var i = 0; i < $len; i++) {
			if(cityList[i].area_name == "重庆市" || cityList[i].area_name == "长沙市" || cityList[i].area_name == "长春市") {
				var $first = 'C';
			} else if(cityList[i].area_name == "佛山市") {
				var $first = 'F';
			} else if(cityList[i].area_name == "厦门市") {
				var $first = 'X';
			} else {
				//或取首字母
				var $first = pinyinUtil.getFirstLetter(cityList[i].area_name).substring(0, 1);
			}

			console.log("============" + $first);
			//数组添加
			$city.push([$first, cityList[i].area_id, cityList[i].area_name, cityList[i].area_service]);
			//首字母数组
			$farr.push($first);
		}

		// 生成城市列表
		var $arr = $city.sort();
		for(var j = 0; j < $arr.length; j++) {
			$html += '<li data-open="' + $arr[j][3] + '" data-num="' + $arr[j][0] + '" data-id="' + $arr[j][1] + '"><a style="display: block;">' + $arr[j][2] + '</a></li>'
		}

		$('.city-list ul').append($html);
		// 生成aside列表
		var $narr = $.unique($farr.sort());
		console.log($narr);
		for(var k = 0; k < $narr.length; k++) {
			$menu += '<span>' + $narr[k] + '</span>';
			$('.city-list li[data-num="' + $narr[k] + '"]').eq(0).before('<li class="group">' + $narr[k] + '</li>');
		}
		$('aside').html($menu);
		//	选择城市事件，不开通的提示
		$('.city-list').on('tap', 'li', function() {
			var cityList = $(this).attr('data-open');
			if(cityList == 1) {
				//页面传值（城市名称）
				var area_name = $(this).children("a").html();
				console.log(area_name);
				var area_id = $(this).data("id")
				console.log(area_id);
				_.setCityInfo(area_id, area_name);
				$(this).children("a").attr('href', '../../wap_xrk/index.html');

			} else if(cityList == 0) {
				mui.alert("系统尚未开通，请关注！");
			}

		})
	}
	// 数据
	function ajaxGetCityList() {
		$.ajax({
			type: 'get',
			url: ApiUrl + '/index.php?act=service_store&op=getArea',
			dataType: 'json',
			success: function(data) {
				_.debug(data);
				window.localStorage.setItem('citylist', JSON.stringify(data.datas));
				fillCityList(data.datas);

			},
			error: function(err) {
				console.log(err)
			}
		})
	}

	// 滚动侦测
	$('.city').on('tap', 'aside span', function() {
		var
			$this = $(this),
			$index = $this.index(),
			$last = $('aside span').length - 1,
			$height = $('.city-list').height();
		if($index == 0) {
			$('html,body').animate({
				scrollTop: '0px'
			}, 300);
		} else {
			var $offset = $('.group').eq($index - 1).offset().top - 155;
			$('html,body').animate({
				scrollTop: $offset + 'px'
			}, 300);
		}
	})

})