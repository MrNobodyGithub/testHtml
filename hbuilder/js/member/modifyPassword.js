
var $userinfo =  _.userInfo.get();
console.log($userinfo);

 // 验证码倒计时
//$('.yzm').on('tap',function(){
//  var $msgUrl = ApiUrl + "/index.php?act=login&op=send_sms_msg";
//  var $phone				=	$userinfo.phone;
//  var $this = $(this);
//  var num = 60;
//  var timer = null;
//  console.log($phone);
//  $.ajax({
//      type:"post",
//      url:$msgUrl,
//      async:true,
//      data: {
//          phone: $phone,
//      },
//      success: function(res){
//          var data = JSON.parse(res);
//          if(data.code == 200){
//              timer = setInterval(function(){
//                  num--;
//                  $this.prop('disabled',true).html(num+"秒后重发");
//                  if(num == 0){
//                      clearInterval(timer);
//                      $this.prop('disabled',false).html("获取验证码");
//                      num = 60;
//                  }
//              }, 1000);
//              console.log(num);
//          }else if(data.code == 400){
//              mui.alert(data.datas.error);
//          }
//      },
//      error: function(err){
//          console.log(err);
//      }
//  });
//
//
//})

var isYes = true;
//是否显示密码
$('.form-control').on('tap', '.eye_icon', function(){
	if(isYes){
		$(this).addClass("active_eye");		
		$(this).parent().find('input').attr('type', 'text');
		isYes = false;
	}else{
		$(this).removeClass("active_eye");
		$(this).parent().find('input').attr('type', 'password');
		isYes = true;
	}
})


$('.box-button').on('tap',function(){
	
//	//	提交
	var	
		$password 			= 	$('.icon-password').val(),
		$password_confirm	=	$('.icon-password2').val(),
		$vcode 				= 	$('.icon-confirm').val(),
		
//		$vcode 				= 	"1111",
		$url 				=	ApiUrl+"/index.php?act=member_account&op=editPassword";
		
		
		if($password==""&&$password_confirm=="") {
			mui.alert("密码不能为空");
			return false;
		}else if($password.length < 6){
			mui.alert("密码长度不能小于6位");
			return false;
			
		}else if($password!=$password_confirm){
			mui.alert("密码不一致");
			return false;
		}
		
		console.log("修改密码");
		$.ajax({
			type:"post",
			url:$url,
			dataType: 'json',
			data: {
				key: _.userInfo.getKey(),
				password: $password,
				password_confirm: $password_confirm,
				vcode: $vcode,
				client: 'ios'
			},
			success: function(data) {
	
				if( data.code == 200 ) {				
	
					mui.openWindow({
						url: 'login.html',
						id: 'login',
						waiting: {
							autoShow: true
						}
					})
				} else if(data.code == 400){
					mui.alert(data.datas.error);
				}
			},
			error: function(err) {
				console.log(err);
			}
		});
	
	
})

