$(function() {
	//1.页面初始化
	mui.init({
		swipeBack: false //启用右滑关闭功能
	});
	//2.定义全局变量
	var index = 1; //页码数
	var size = 10; //每页列表的数量
	var totalpage = 1; //总页数

	//3.阻尼系数
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	mui('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});
	//4.控制选项卡的左右滑动
	mui('.mui-slider').slider().setStopped(true);
	//5.退款售后
	//全局变量定义
	var $key = _.userInfo.getKey();
	console.log($key);
	var $buy = ApiUrl + '/index.php?act=service_member_order&op=order_list&page=' + size;

	function orderList(url, param) {
		var $load = true,
			$data = {
				key: $key,
				curpage: 1,
				//page: size,
				status: param
			};

		_.data.send(url, 'post', $load, $data, function(data) {
			console.log($data.page);
			if(data.code == 200) {
				totalpage = data.datas.totalpage;
				var $list = template.render('order-item', data.datas);
				console.log(data.datas);
				$('.location .main-list').html($list);
			} else {
				mui.alert(data.datas.error);
			}
		})

	}

	//6.页面加载后的事件
	mui.ready(function() {
		orderList($buy, 3);
		//6.1.循环初始化所有下拉刷新，上拉加载。
		mui("#scroll1").pullToRefresh({
			container: mui("#scroll1"),
			up: {
				callback: pullupRefresh, //上拉加载方法的调用
			}
		});

		//6.2.上拉加载具体业务实现
		function pullupRefresh() {
			var self = this;
			setTimeout(function() {
				index++;
				load(document.getElementById("ul1"), index, size,
					function(data) {
						if(data == true) {
							//结束转雪花进度条的“正在加载...”过程
							self.endPullUpToRefresh(true);
						} else {
							self.endPullUpToRefresh(false);
						}
					});
			}, 1000);
		}
	});

	//7.上拉加载方法	
	function load(ul, pageIndex, pageSize, done) {
		$$.CrossWay($buy, {
			key: $key,
			curpage: pageIndex,
			page: pageSize,
			status: 3
		}, function(data) {
			console.log(pageIndex);
			console.log(totalpage);
			if(totalpage < pageIndex) {
				done(true);
			} else {
				var $list = template.render('order-item', data.datas);
				console.log(data.datas);
				$('.location .main-list').append($list);
				done(false);
				/*for(var i = 0; i < data.datas.list.length; i++) {
					var li = document.createElement('li');
					li.className = 'order-list';
					li.setAttribute("data-id", data.datas.list[i].order_id);
					li.innerHTML = '<div class="list-up">' +
						'<div class="list-img">' +
						'<img id ="goods_img_' + data.datas.list[i].order_id + '" src="' + data.datas.list[i].image_240_url + '" alt="">' +
						'</div>' +
						'<div class="list-content">' +
						'<div class="content-details">' +
						'<div id="title_' + data.datas.list[i].order_id + '" class="details-title">' + data.datas.list[i].goods_name + '</div>' +
						'<div class="details-trade">' + data.datas.list[i].order_state + '</div>' +
						'</div>' +
						'<div class="content-price">￥<span>' + data.datas.list[i].order_amount + '</span>元</div>' +
						'</div>' +
						'</div>' +
						'<div class="list-down">' +
						'<div class="down-time">结束时间：<span>' + data.datas.list[i].finished_time + '</span></div>' +
						'<div class="down-apply">' +
						'<div class="txt">申请售后</div>' +
						'</div>' +
						'</div>' +
						'<div class="boundary"></div>';
					ul.appendChild(li);
					done(false);
				}*/
			}
		})

	}
	//8. "申请退款"按钮的点击事件
	$("#ul1").on("tap", '.down-apply', function() {
		console.log($(this).parent().parent().attr("data-id"));
		console.log($('#goods_img_' + $(this).parent().parent().attr("data-id")).attr("src"));
		console.log($('#title_' + $(this).parent().parent().attr("data-id")).text());
		mui.openWindow({
			url: "../../tmpl/member/applicationfordrawback.html",
			waiting: {
				autoShow: true
			},
			extras: {
				orderId: $(this).parent().parent().attr("data-id"),
				img: $('#goods_img_' + $(this).parent().parent().attr("data-id")).attr("src"),
				title: $('#title_' + $(this).parent().parent().attr("data-id")).text()
			}
		});
	});
});