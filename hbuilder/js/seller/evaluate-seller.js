mui.init({
	beforeback: function() {　　　　 // 获得父页面的webview   
		//  opener 返回对创建此窗口的窗口的引用。
		var list = plus.webview.currentWebview().opener();　　　　 //触发父页面的自定义事件(refresh),从而进行刷新

		mui.fire(list, 'refresh');
		//返回true,继续页面关闭逻辑
		return true;
	}
});
		
mui.plusReady(function() {
	var $key = _.userInfo.getKey();
	var $order = plus.webview.currentWebview().orderId;
	console.log($key);
	console.log($order);

	//评星
	$(".status ul li").on("tap", "i", function() {

		$(this).addClass("activeImg").prevAll().addClass('activeImg').end()
			.nextAll().removeClass();
	})

	//填写form表单的action
	//  $("#comment-form").attr("action", ApiUrl + "/index.php?act=sns_album&op=file_upload");

	//传key值
	//  $(".img-key").attr("value", $key);

	//上传图片
	//  $(".photo-upload").on("change", function() {
	//      $(".loadingimg").show();
	//      $('#comment-form').submit();
	//  })

	//  $('#comment-form').ajaxForm({
	//      beforeSend: function() {
	//          if ($("#default_pic").val() === '') {
	//              mui.confirm("请选择文件");
	//              $(".loadingimg").hide()
	//              return false;
	//          }
	//      },
	//      success: function(res) {
	//
	//      },
	//      complete: function(xhr) {
	//          $(".loadingimg").hide();
	//          res = eval("(" + xhr.responseText + ")");
	//
	//          if (res.code !== 200) {
	//              mui.confirm(res.datas.error)
	//              return false;
	//          }
	//          //添加图片节点
	//          $(".comment-img").before("<div class='updata-img' data-img-id = '" + res.datas.file_id + "'><img src = '" + res.datas.file_url + "' name = '" + res.datas.file_name + "' /><span style='z-index: 99' class = 'del-img'></span></div>");
	//      }
	//  });
	console.log($key);
	//删除图片
	//  $(".photos").on("tap", ".del-img", function() {
	//      var $this = $(this);
	//      $.ajax({
	//          type: "get",
	//          url: ApiUrl + "/index.php?act=sns_album&op=file_del",
	//          async: true,
	//          data: {
	//              hey: $key,
	//              id: $(this).parent().attr("data-img-id")
	//          },
	//          success: function(res) {
	//              var data = JSON.parse(res);
	//              console.log(data.datas.error);
	//              $this.parent().hide(300);
	//          }
	//      });
	//  })

	//提交评论
	$(".send-comment").on("tap", function() {
		var $val = $(".evaluate textarea").val();
		//          $img = $(".photos").children();
		$des = $(".status ul li").eq(0).find(".activeImg").length;
		//      $atu = $(".status ul li").eq(1).find(".activeImg").length;
		//      $spd = $(".status ul li").eq(2).find(".activeImg").length;
		//      $sto = $(".status ul li").eq(3).find(".activeImg").length;
		//      var $anony = 1;
		//      if (!$(".check").is(':checked')) {
		//          $anony = "";
		//      }
		//      var imgArr = [];
		//      for (var i = 0; i < $img.length - 1; i++) {
		//          var $name = $(".photos div").eq(i).find("img").attr("name")
		//          imgArr.push($name);
		//      }
		//      $(".updata-img img").attr("name");
		if($val == '') {
			mui.toast("请输入评论内容");
			return false;
		}
		if($des == 0) {
			$des = 5;
		}
		//      else if ($atu == 0) {
		//          $atu = 5;
		//      } else if ($spd == 0) {
		//          $spd = 5;
		//      }
		$.ajax({
			type: "post",
			url: ApiUrl + "/index.php?act=service_order&op=evaluate",
			async: true,
			data: {
				key: $key,
				order_id: $order,
				beval_content: $val,
				beval_score: $des
			},
			success: function(res) {
				console.log(JSON.stringify(res));
				var data = JSON.parse(res);
				if(data.code != 200) {
					mui.alert(data.datas.error);
					return false;
				} else {
					mui.toast(data.datas);
					//                  mui.openWindow({
					//                  	url: "seller-order-all.html",
					//                      id: "seller-order-all",
					//                      extras: {
					//                      	order: true
					//                      }
					//                  });
					//                  plus.webview.currentWebview().close();
				}
			}
		});
	})
})