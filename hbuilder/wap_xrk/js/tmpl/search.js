mui.init();
var sHistory = [];
search();
// 搜索
function search() {
	//获取本地存储历史搜索
	var _hisicon = window.localStorage.getItem("sHistory");
	//	console.log(_hisicon);

	//历史搜索
	var $hisicon = JSON.parse(_hisicon);
	//	console.log("历史搜索记录--" + $hisicon);
	var hs = '';
	var hh = '';
	if(_hisicon) {
		for(var i = 0; i < $hisicon.length; i++) {
			hh = '<span>' + $hisicon[$hisicon.length - 1] + '</span>';
			if($hisicon[i] != null) {
				if(i == 0) {
					hs += '<span>' + $hisicon[i] + '</span>';
				} else {
					if($hisicon[i] != $hisicon[0]) {
						hs += '<span>' + $hisicon[i] + '</span>';
					} else {
						delete $hisicon[i];
					}
				}
			} else {
				$(".hisicon div").find('span').eq($hisicon.length - 1).css("display", "none");
			}

		}
		window.localStorage.setItem("sHistory", JSON.stringify($hisicon));

		console.log("删除====" + $hisicon);

		$(".hisicon div").html(hs);
		$(".hisicon div").find('span').eq(0).attr('class', 'active');
		$(".hisicon div").find('span').eq(1).attr('class', 'active');
	}

	//搜索
	$('.search-header a input').keypress(function() {
		var word = $(this).val();
		_hisicon = window.localStorage.getItem("sHistory");
		if(word != '') {
			if(_hisicon) {
				sHistory = JSON.parse(_hisicon);
				sHistory.unshift(word);
				window.localStorage.setItem("sHistory", JSON.stringify(sHistory));
				//				console.log('本地存储长度--' + sHistory.length);
				if(sHistory.length > 10) {
					sHistory.pop();
					//					console.log('长度超出时搜索长度--' + sHistory);
					window.localStorage.setItem("sHistory", JSON.stringify(sHistory));
				}
			} else {
				sHistory.unshift(word)
				window.localStorage.setItem("sHistory", JSON.stringify(sHistory));
				//				console.log(sHistory);
				//				console.log('上面是历史数据');
			}
			//			console.log("length--" + sHistory.length);

			var hs = '<span>' + word + '</span>';
			$(".hisicon div").prepend(hs);
			$(".hisicon div").find('span').eq(0).attr('class', 'active');
			$(".hisicon div").find('span').eq(1).attr('class', 'active');

			mui.openWindow({
				url: '../tmpl/search-1.html',
				id: 'search1_list',
				extras: {
					goodsName: word
				},
				waiting: {
					autoShow: true,
					title: '正在加载...'
				}
			})
		}
		//window.localStorage.removeItem("sHistory");
	})

	$(".hisicon div").on("tap", "span", function() {
		//		console.log($(this).html());
		var word = $(this).html();
		mui.openWindow({
			url: '../tmpl/search-1.html',
			id: 'search1_list',
			extras: {
				goodsName: word
			},
			waiting: {
				autoShow: true,
				title: '正在加载...'
			}
		})
	})

	//删除历史搜索
	$('.hisicon').on('tap', '.del', function() {
		var content = document.getElementById("j_content").getElementsByTagName('span');
		//		console.log(content.length);
		if(content.length == 0) {
			//			console.log("我的内容为空！");
		} else {
			//			console.log("我不为空");
			mui.confirm('清除历史搜索？', '', ['确定', '取消'], function(e) {
				if(e.index == 0) {
					$('.hisicon div').html('');
					window.localStorage.removeItem('sHistory');
				}
			})

		}

	})
	//	//点击关闭搜索
	//	$(".search_back").on("tap", function() {
	//		$(".index").css("display", "block").siblings("section").css("display", "none");
	//		//plus.nativeUI.showWaiting();
	//		window.location.reload();
	//
	//		//window.localStorage.removeItem("sHistory");
	//	})
	//热门服务
	$.getJSON(ApiUrl + '/index.php?act=service_class', {
		globalLoading: true
	}, function(res) {
		//	console.log(res);
		var html = template.render('index-hoticon', res);
		$('.search-icon .hoticon').find('div').html(html);

		$('.search-icon .hoticon').find('div').find('span').eq(0).attr('class', 'active');
		$('.search-icon .hoticon').find('div').find('span').eq(1).attr('class', 'active');

		$('.search-icon .hoticon').find('div').on('tap', 'span', function() {
			var key = $(this).html();

			_hisicon = window.localStorage.getItem("sHistory");
			if(_hisicon) {
				sHistory = JSON.parse(_hisicon);
				sHistory.unshift(key);
				window.localStorage.setItem("sHistory", JSON.stringify(sHistory));
				//				console.log(sHistory);

				if(sHistory.length > 10) {
					sHistory.pop();
					//					console.log('长度超出时搜索长度--' + sHistory);
					window.localStorage.setItem("sHistory", JSON.stringify(sHistory));
				}
			} else {
				sHistory.unshift(key)
				window.localStorage.setItem("sHistory", JSON.stringify(sHistory));
				//				console.log(sHistory);
				//				console.log('上面是历史数据');
			}
			//console.log(key);

			mui.openWindow({
				url: '../tmpl/search-1.html',
				id: 'search1.html',
				extras: {
					goodsName: key
				},
				waiting: {
					autoShow: true,
					title: '正在加载...'
				}
			})
		})
	});
	//删除输入内容
	$('#delete').on('tap', function() {
		$('.search-header a input').val("");
	});
}