var evenName = getQueryString('eventName');
console.log(evenName);
$(function() {
	var $cityinfo = _.getCityInfo() || _.getDefaultCityInfo();
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
	
	$('#l-map').show().html('');
	//初始化地址
	gaode_init();
});
// 设置首页城市
function setCity() {
	var $cityinfo = _.getCityInfo() || _.getDefaultCityInfo();
	if($cityinfo) {
		$('header .city').text($cityinfo.area_name).attr('data-id', $cityinfo.area_id);
	}
}
	
function gaode_init(){
	var windowsArr = [];
	var marker = new AMap.Marker({});
	var geolocation;
	AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
		var map = new AMap.Map('l-map',{
	        resizeEnable: true,
	        zoom: 16,
	        center: [120.424508,36.137135],
	        keyboardEnable: false,
	        scrollWheel: false
	    });
	    // 地图标记
	    map.plugin(["AMap.ToolBar"], function() {
	        map.addControl(new AMap.ToolBar());
	    });
	    // 拖拽地图
	    var positionPicker = new PositionPicker({
	        mode: 'dragMap',
	        map: map,
	        iconStyle:{//自定义外观
		       url:'img/mapmark.png',//图片地址
		       size:[30,30],  //要显示的点大小，将缩放图片
		       ancher:[15,33],//锚点的位置，即被size缩放之后，图片的什么位置作为选中的位置
		    }
	    });
	    positionPicker.on('success', function(positionResult) {
	    	$('#loading').fadeOut();
	    	map.setCenter([ positionResult.position.lng, positionResult.position.lat]);
	        marker.setMap(map);
	    	$('#suggestId').val(positionResult.nearestPOI);
	    	$('.mui-bar-footer a').on('click', function(){
	    		//先填充一次自己的坐标
				var addressObj = {};
				addressObj.province = positionResult.regeocode.addressComponent.province;
				addressObj.city = positionResult.regeocode.addressComponent.city;
				addressObj.district = positionResult.regeocode.addressComponent.district;
				addressObj.streetNum =  positionResult.regeocode.addressComponent.streetNumber;
				addressObj.lng = positionResult.position.lng;
				addressObj.lat = positionResult.position.lat;
				addressObj.title = positionResult.address;
				addressObj.address = positionResult.address;
				if(evenName){
					window.localStorage.setItem(evenName, JSON.stringify(addressObj));
				}else{
					window.localStorage.setItem('address_from', JSON.stringify(addressObj));
					
				}
	    	})
	    });
	    positionPicker.on('fail', function(positionResult) {
	    	mui.alert(positionResult);
	    });
	     var onModeChange = function(e) {
	        positionPicker.setMode(e.target.value)
	    }
	    positionPicker.start();
	
	    map.addControl(new AMap.ToolBar({
	        liteStyle: true
	    }))
	    // 搜索框实时生成地址
	    AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'],function(){
	      	var autoOptions = {
		        city: "青岛", //城市，默认全国
		        input: "suggestId"//使用联想输入的input的id
		     };
	      	autocomplete= new AMap.Autocomplete(autoOptions);
	      	var placeSearch = new AMap.PlaceSearch({
	            city:'青岛',
	            map:map
	  		})
		    AMap.event.addListener(autocomplete, "select", function(e){
		         //TODO 针对选中的poi实现自己的功能
		         placeSearch.setCity(e.poi.adcode);
		         placeSearch.search(e.poi.name)
		    });
			
	    });
    })
}