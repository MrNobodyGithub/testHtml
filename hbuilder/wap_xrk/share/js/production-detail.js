/*
wangmin

 需要传参key，goodsId
* */

var common_books_Page = null;
	var $goodsId = encodeURI(getQueryString("goodsId"));
	var $key = encodeURI(getQueryString("key"));
//var $goodsId = '110657';
//var $key = 'e0eaf92ef837246e959cafe1d1d8f8fe';
console.log("$goodsId" + $goodsId);
console.log("$key" + $key);
get_detail($goodsId);

//获取商品明细
function get_detail(goodsId) {
	//首次为列表页传过来的goodsid，下次调用为规格点击的goodsid
	console.log(goodsId);
	$.ajax({
		url: ApiUrl + "/index.php?act=service_goods&op=goods_detail",
		type: 'get',
		dataType: 'json',
		data: {
			key: $key,
			goods_id: goodsId
		},
		beforeSend: function() {
			$("#loading").fadeIn();
		},
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.code == 400) {
				mui.alert(data.datas.error);
				return false;
			}
			//提前定义商品的一部分基础数据，供后面使用
			var
				$goods_info = data.datas.goods_info,
				$store_info = data.datas.store_info,
				$spec_list = data.datas.spec_list,
				$spec_name = $goods_info.spec_name,
				$spec_value = $goods_info.spec_value,
				$geval_content = data.datas,
				$spec_value_simple = {}; //简化规格值用
			//	模板渲染=>填充值
			var $html = template.render("contentDetailTpl", data);
			$(".contentDetail").html($html);

			//	服务详情填充
			var $body = $goods_info.mobile_body;
			if($body != "") {
				$(".product-detail .product").html($body);
			} else {
				var $body = '<div class="detail_nodata" style=""><img src="../img/nodata-error.png" /></div><div style="text-align:center;font-size: 25px;">暂无数据</div>';
				$(".product-detail .worktime-check").html($body);
			}

			//电话咨询 这里电话咨询是干什么的，取得谁的电话？是平台还是商户？每次都要取一次？太费劲！！！
			$.ajax({
				type: "get",
				url: ApiUrl + "/index.php?act=zx_setting&op=getphone",
				async: true,
				dataType: 'json',
				success: function(res) {
					//曾旭的接口写的。。。不要用数组不明意思的东西。
					var html = "<p><a href='tel:" + res.datas + "'>" + res.datas + "</a></p>";

					$(".contentDetail .cellphone").append(html);
				}
			});

			//	判断是否收藏
			if(data.datas.is_favorate) {
				$('.footer-menu .like').addClass('active');
			}

			//规格点击函数
			var fn_spec_tap = function(el) {
				var $this = $(el);
				var $active = $this.hasClass('active');
				if($active) {
					return false;
				}
				//本来只在未激活的元素上触发事件，可以不需要上面的判断
				$this.addClass('active').siblings().removeClass('active');
				var curEle = $(".price-content dd.active");
				var curSpec = [];
				$.each(curEle, function(i, v) {
					// convert to int type then sort
					curSpec.push(parseInt($(v).attr("spec_value_id")) || 0);
				});
				var spec_string = curSpec.sort(function(a, b) {
					return a - b;
				}).join("|");
				//获取商品ID
				$goodsId = $spec_list[spec_string];
				get_detail($goodsId);
			}

			//规格内容填充
			//清空规格存储容器
			//规格的容器怎么取这个名字？？spec-content
			$('.price-content').empty();
			if($spec_name != null && $spec_value != null) {
				for(x in $spec_name) {
					var $dl_spec_name = $('<dl spec_name_id="' + x + '"><dt>' + $spec_name[x] + '</dt></dl>');
					for(k in $spec_value[x]) {
						var isactive = ($goods_info.goods_spec[k]) ? true : false;
						var $dd_spec_value = $('<dd spec_value_id="' + k + '">' + $spec_value[x][k] + '</dd>');
						if(isactive) {
							$spec_value_simple[x] = $spec_value[x][k];
							$dd_spec_value.addClass('active');
						} else {
							//绑定事件
							$dd_spec_value.on('tap', function() {
								fn_spec_tap(this);
							})
						}
						$dl_spec_name.append($dd_spec_value);
					}
					$('.price-content').append($dl_spec_name);
				}
			}
			//立即预约
			//先清除以前的事件
			$('.footer-menu .apot').off('tap').on('tap', function() {

			})
			//评论查看更多
			//TODO
			$('.mui-pull-right').off('tap').on('tap', function(e) {
				mui.openWindow({
					url: 'comment-detail-list.html',
					id: 'comment-detail-list.html',
					extras: {
						$goodsId: $goodsId
					}
				})
			})
		},
		error: function(error) {
			console.log('ajax调用异常');
		},
		complete: function() {
			$("#loading").fadeOut();
		}
	})
}

document.getElementById("j_btn").addEventListener("click", function() {
	req = new XMLHttpRequest();
	req.open("GET", "http://hisunflower.com/mobile/index.php?act=zx_setting&op=getversion", false);
	req.onreadystatechange = function() {
		if(req.status == 200 && req.readyState == 4) {
			var str = JSON.parse(req.response);
			//ios 下载地址
			mobile_ios = str.datas.mobile_ios;
			console.log(mobile_ios);
			//android下载地址
			mobile_apk = str.datas.mobile_apk;
			console.log(mobile_apk)
			if(str.code === 200) {
				var ua = navigator.userAgent.toLowerCase();
				if(isWeiXin()) {
					if(/iphone|ipad|ipod/.test(ua)) {
						//								window.location.href = mobile_ios;
						window.open(mobile_ios);
					} else if(/android/.test(ua)) {
						//弹出层提示
						document.getElementById("guide_img").style.display = "block";
					}
				} else {
					if(/iphone|ipad|ipod/.test(ua)) {
						//									window.location.href = mobile_ios;
						window.open(mobile_ios);
					} else if(/android/.test(ua)) {
						//									window.location.href = mobile_apk;
						window.open(mobile_apk)
					}
				}
			}
		} else {
			alert(req.onerror);
		}
	}
	req.send(null);
})
//判断用户是否使用微信浏览器
function isWeiXin() {
	var ua = window.navigator.userAgent.toLowerCase();
	if(ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
}