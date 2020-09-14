mui.init({
				swipeBack:true
			});
			var $userinfo =  _.userInfo.get();
			$.ajax({
				type:"get",
				url:ApiUrl+"/index.php?act=member_address&op=address_list",
				data:{
					key:$userinfo.key
				},
				success:function(res){
					var data = $.parseJSON(res)
					var html = template.render("addresslist", data);
					$(".wrap-add").append(html);
					console.log(res)
					
				}
			});
			$(".wrap-add").on("tap",".del",function(){
				var _this = ($(this))
				console.log($(this).attr("addressid"))
				$.ajax({
					type:"post",
					url:ApiUrl+"/index.php?act=member_address&op=address_del",
					data:{
						key:$userinfo.key,
						address_id:$(this).attr("addressid")
					},
					success:function(res){
						
						console.log(res)
						var data = $.parseJSON(res)
						if(data.code == 200){
							mui.toast("删除成功")
							_this.parent().parent().parent().remove()
						}else{
							mui.toast("删除失败")
						}
					}
				});
			})
			$(".wrap-add").on("tap",".edit",function(){
				mui.openWindow({
				    url:"move-addressedit.html",
				    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显
				    extras:{
					    addressId:$(this).attr("addressid"),
					},
				    waiting:{
				      autoShow:true,//自动显示等待框，默认为true
				      title:'正在加载...'//等待对话框上显示的提示内
				    }
				})
			})
			$(".link").on("tap",function(){
				mui.openWindow({
				    url:"move-address.html",
				    createNew:false,//是否重复创建同样id的webview，默认为false:不重复创建，直接显
				    waiting:{
				      autoShow:true,//自动显示等待框，默认为true
				      title:'正在加载...'//等待对话框上显示的提示内
				    }
				})
			})