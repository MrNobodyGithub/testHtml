$(function() {
	mui.init({
		swipeBack: true,
		pullRefresh: {
			container: '.map-list', //待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
			up: {
				height: 50, //可选.默认50.触发上拉加载拖动距离
				auto: false, //可选,默认false.自动上拉加载一次
				contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
				contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
				callback: searchMore //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
			}
		}
	});

	var $cityinfo = _.getCityInfo() || _.getDefaultCityInfo();
	var ws = null,
		wo = null;
	var em = null,
		map = null;
	var searchObj = null;
	//搜索相关
	var current_province = "山东省"; //暂时没用
	var current_city = $cityinfo.area_name;
	var searchKind = 0; //0周边，1城市
	var searchState = 0; //0成功，其他失败
	var searchComplete = 0; //0正在搜索，1搜索完成
	var search_current_point = null;
	var search_current_keyword = null;
	//当前搜索页码
	var search_page_capacity = 10; //每页搜索记录数量
	var search_current_pageNumber = 0;
	var search_current_pageIndex = 0;
	var search_hasMore = false;
	var local_point = {}; //定位坐标
	setCity();
	mui.plusReady(function() {
		ws = plus.webview.currentWebview();
		wo = ws.opener();
		getCurrentPosition();

		//		console.log("存储城市==="+JSON.stringify($cityinfo));
		//		console.log('plusready当前城市：'+current_city);
	})

	// 设置首页城市
	function setCity() {
		//		console.log('设置当前城市：'+current_city);
		var $cityinfo = _.getCityInfo() || _.getDefaultCityInfo();
		if($cityinfo) {
			$('header .city').text($cityinfo.area_name).attr('data-id', $cityinfo.area_id);
		}
	}
	//选择城市事件
	document.addEventListener('changecity', function(event) {
		//		console.log('选择城市：'+current_city);
		//		console.log("1==="+event);
		var eventContent = event.detail;
		$cityinfo = {
			'area_id': eventContent.id,
			'area_name': eventContent.name
		};
		$('header .city').text(eventContent.name).attr('data-id', eventContent.id);
		current_city = $cityinfo.area_name;
		var keyword = $('#suggestId').val();
		searchInCity(current_city, keyword, 0);
		//重置map
	}, false);
	//选择城市点击
	$('header .city').on('tap', function() {
		mui.openWindow({
			url: '../city.html',
			id: 'selectcity',
			waiting: {
				autoShow: true,
				title: '正在加载...'
			}
		})
	})
	/*
	 * 创建居中的小蜜蜂标志
	 */
	function createMarkView() {
		//计算顶部高度
		var maptop = $('#l-map').offset().top;
		var mapheight = $('#l-map').height();
		var mapwidth = $('#l-map').width();
		//顶部距离以小蜜蜂的下边为地图正中心
		var marktop = (Math.round(maptop + mapheight / 2 - 50)) + 'px';
		var markleft = (Math.round(mapwidth / 2 - 25)) + 'px';
		view = new plus.nativeObj.View('mapmarkview', {
			top: marktop,
			left: markleft,
			height: '50px',
			width: '50px'
		}, [{
			tag: 'img',
			id: 'mapmark',
			src: '/images/mapmark.png',
			position: {
				top: '0px',
				left: '0px',
				width: '100%',
				height: '100%'
			}
		}]);
		ws.append(view);
		//TODO 目前是绝对定位，下面的地址列表必须做好样式，保证始终是一屏的高度。
	}
	//定义回调函数
	function callback(addressObject) {
		if(ws.eventName) {
			mui.fire(wo, ws.eventName, addressObject);
		}
		ws.close();
	}
	//初始化地址,正常应该从上个页面带出来
	function baidu_init(point) { //初始化地图
		map = new plus.maps.Map("l-map", {
			//zoomControls: true,
			zoom: 18,
			center: point
		});
		//createMarkView();
		searchObj = new plus.maps.Search(map);
		searchObj.setPageCapacity(search_page_capacity);
		searchObj.onPoiSearchComplete = onPoiSearchComplete;
		//		map.onstatuschanged = function( e ){
		//			//地图拖动或者缩放后的中间位置
		//			console.log( "中间位置: "+JSON.stringify(e.center) );
		//			plus.maps.Map.reverseGeocode(e.center,{},function(event){
		//						console.log(JSON.stringify(event))
		//						var address = event.address;  // 转换后的地理位置
		//						var point = event.coord;  // 转换后的坐标信息
		//						//先填充一次自己的坐标
		//						var $ul = $(".map-list ul");
		//						var addressObj = {};
		//						addressObj.province = '';
		//						addressObj.city = current_city;
		//						addressObj.district = '';
		//						addressObj.streetNum = '';
		//						addressObj.lng = point.longitude;
		//						addressObj.lat = point.latitude;
		//						addressObj.title = address;
		//						addressObj.address = address;
		//						var content = $('<a href="javascript:void(0)" ><li><span style="font-size:1rem !important;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; ">[当前位置]' + addressObj.title + '</span><p style="font-size:0.8rem !important;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; ">' + addressObj.address + '</p></li></a>');
		//						content.on('tap',function(){
		//							callback(addressObj);
		//						})
		//						$ul.html(content);
		//						//
		//						searchNearBy(point,address,0);
		//					},function(e){
		//						console.log("获取当前坐标位置信息失败："+JSON.stringify(e));
		//					});
		//		}
		//绑定搜索框事件
		$("#suggestId").unbind("input propertychange").bind("input propertychange", function() {
			var current_city = $cityinfo.area_name;
			var keyword = this.value;
						console.log('搜索事件==='+current_city);
			//			console.log("存储城市==="+JSON.stringify($cityinfo));
			if(keyword) {
				console.log('搜索' + keyword);
				searchInCity(current_city, keyword, 0);
			}
		});
		//		document.getElementById("suggestId").addEventListener('input propertychange',function(){
		//			var keyword = this.value;
		//			console.log(keyword);
		//			searchInCity(current_city,keyword,0);
		//		}); 

		//绑定搜索框事件
		document.getElementById("suggestId").addEventListener('keydown', function(e) {
			if(e.keyCode == 13) {
				var keyword = this.value;
				if(keyword.length > 0) {
					_.debug(keyword);
					searchInCity(current_city, keyword, 0);
					document.activeElement.blur();
				}

			}
		});

		//绑定搜索框事件
		/*$('#suggestId').change(function(){
			var keyword = $(this).val();
			searchInCity(current_city,keyword,0);
		})*/
	}
	var onPoiSearchComplete = function(state, result) {
		console.log('2====' + JSON.stringify(result));
		mui('.map-list').pullRefresh().disablePullupToRefresh();
		if(state == 0) {
			search_hasMore = false;
			if(result.currentNumber <= 0) {
				console.log("没有检索到结果");
				if(result.pageIndex == 0) {
					//如果是第一页，是否应该清除内容
				}
			}
			if(result.currentNumber < search_page_capacity) {
				console.log("结果小于每页数");
			}
			if(result.pageIndex == result.pageNumber - 1) {
				console.log("结果到达最尾页");
			} else {
				search_hasMore = true;
			}
			if(search_hasMore) {
				mui('.map-list').pullRefresh().enablePullupToRefresh();
			}
			mui('.map-list').pullRefresh().endPullupToRefresh(!search_hasMore);
			var $ul = $(".map-list ul");
			if(result.pageIndex == 0 && searchKind == 0) {
				$ul.empty();
			}
			for(var i = 0; i < result.currentNumber; i++) {
				var pos = result.getPosition(i);
				var addressObj = {};
				addressObj.province = '';
				addressObj.city = pos.city || '';
				addressObj.district = '';
				addressObj.streetNum = '';
				addressObj.lng = pos.point.longitude || '';
				addressObj.lat = pos.point.latitude || '';
				addressObj.title = pos.name || '';
				addressObj.address = pos.address || '';
				//console.log(JSON.stringify(addressObj));
				if(i == 0 && searchKind == 0 && result.pageIndex == 0) {
					map.setCenter(pos.point);
				}
				var content = $('<a href="javascript:void(0)"><li><span style="font-size: 1rem!important;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; ">' + addressObj.title + '</span><p style="font-size: 0.8rem !important;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; ">' + addressObj.address + '</p></li></a>');
				content.on('tap', (function(addressObj) {
					return function() {
						callback(addressObj);
					}
				})(addressObj));
				$ul.append(content);
			}
		} else {
			console.log("检索失败");
			search_hasMore = false;
			//清空搜索结果
			mui('.map-list').pullRefresh().disablePullupToRefresh();
			mui('.map-list').pullRefresh().endPullupToRefresh(true);
		}
	}

	/**
	 * 指定城市搜索
	 * @param {Object} city
	 * @param {Object} keyword
	 */
	function searchInCity(city, keyword, index) {
		
		var current_city = $cityinfo.area_name;
		searchKind = 0;
		search_current_keyword = keyword;
		search_current_pageIndex = index || 0;
		searchObj.poiSearchInCity(city, keyword, index || 0);
	}

	/**
	 * 指定坐标搜索周边
	 * @param {Object} point
	 * @param {Object} keyword
	 */
	function searchNearBy(point, keyword, index) {
		searchKind = 1;
		search_current_point = point;
		search_current_keyword = keyword;
		search_current_pageIndex = index || 0;
		searchObj.poiSearchNearBy(keyword, point, 1000, index || 0);
	}

	function searchMore() {
		//判断是否有更多数据
		//如果上面配置了自动上拉一次，会执行，应该上面配置为false
		//配置了false，下面的判断可以不要
		if(!search_hasMore) {
			this.endPullupToRefresh(true);
			return false;
		}
		//		console.log('more');
		if(searchKind == 0) {
			searchInCity(current_city, search_current_keyword, search_current_pageIndex + 1);
		} else {
			searchNearBy(search_current_point, search_current_keyword, search_current_pageIndex + 1);
		}

	}

	function getCurrentPosition() {
		mui.plusReady(function a() {
			plus.nativeUI.showWaiting('正在获取您的地址');
			plus.geolocation.getCurrentPosition(function(position) {
				plus.nativeUI.closeWaiting();

				//				console.log('3======'+JSON.stringify(position));
				var coords = position.coords; //获取地理坐标信息；
				var lng = coords.longitude; //获取到当前位置的经度
				var lat = coords.latitude; //获取到当前位置的纬度；
				var point = new plus.maps.Point(lng, lat);
				local_point = point;
				//console.log(JSON.stringify(point));
				baidu_init(point);
				//map.centerAndZoom(point, 18);
				//map.addOverlay(new plus.maps.Marker(point)); //添加标注
				//封装传输对象
				var addressObj = {};
				addressObj.province = position.address.province || '';
				addressObj.city = position.address.city || '';
				addressObj.district = position.address.district || '';
				addressObj.streetNum = position.address.streetNum || '';
				addressObj.lng = lng || '';
				addressObj.lat = lat || '';
				addressObj.title = position.addresses || '';
				if(addressObj.streetNum) {
					addressObj.address = addressObj.province + addressObj.city + addressObj.district + addressObj.streetNum;
				} else {
					addressObj.address = addressObj.province + addressObj.city + addressObj.district;
				}
				current_province = addressObj.province || current_province;
				current_city = addressObj.city || current_city;
				//console.log(JSON.stringify(addressObj));
				//直接在底下显示当前位置，不采用搜索
				var content = $('<a href="javascript:void(0)"><li><span style="font-size: 1rem!important; overflow:hidden;text-overflow:ellipsis;white-space:nowrap; ">[当前位置]' + addressObj.title + '</span><p style="font-size: 0.8rem !important; overflow:hidden;text-overflow:ellipsis;white-space:nowrap; ">' + addressObj.address + '</p></li></a>');
				$(".map-list ul").html(content);
				content.on('tap', function() {
					callback(addressObj);
				})

			}, function(e) {
				//TODO 定位失败后，应该设置默认值，目前是没有创建map对象
				//还是提前创建地图对象，默认点定位到哪里？不设置，会默认在北京，或者设置一个青岛中心地址？
				//
				plus.nativeUI.closeWaiting();
//				

				mui.confirm('由于未开启定位，获取当前位置失败', '提示', ['关闭', '打开定位'], function(e) {

					if(e.index == 1) {
						if(mui.os.android) {

							var main = plus.android.runtimeMainActivity(); //获取activity
							var Intent = plus.android.importClass('android.content.Intent');
							var Settings = plus.android.importClass('android.provider.Settings');
							var intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS); //可设置表中所有Action字段
							main.startActivity(intent);
							setTimeout(function() {
//								console.log("延时")
								a();
							}, 5000)
							console.log("安卓系统")
							//						console.log(aa)
						} else if(mui.os.ios) {
							plus.runtime.launchApplication({
								action: 'App-Prefs:root=Privacy'
							}, function(e) {});
							setTimeout(function() {
//								console.log("延时")
									a();
							}, 9000)
							console.log("ios系统");
						} else {
							console.log("其他系统")
						}

					} else if(e.index == 0) {
						return false
					}

				})
			}, {
				geocode: true,
				provider: 'baidu'
			});
		});
	}

});