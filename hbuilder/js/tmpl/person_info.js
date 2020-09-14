//
//
//	获取userinfo
//	首次进入 填充注册时的默认信息
//	修改用户名之后 重置userinfo.username
//	修改基本资料之后 重置userinfo.sex
//	修改头像之后 重置userinfo.photo
//
//

var $userinfo = _.userInfo.get();

function ProcessFile( e ) { 
    var file = document.getElementsByClassName('file-person')[0].files[0];
    console.log(file)
    if (file) {
        
        var reader = new FileReader();
        reader.onload = function ( event ) { 
            var txt = event.target.result;
            $(".person-img").attr("src",txt)
            };
            
    }
    reader.readAsDataURL( file );
}
function contentLoaded () {
    document.getElementsByClassName('file-person')[0].addEventListener( 'change' ,ProcessFile , false );
}


if( $userinfo && $userinfo.key.length >= 1 ) {
	console.log($userinfo);
	//	填充值需要的资料
	var name 	= 	$userinfo.username,
		photo	=	$userinfo.photo,
		sex 		,
		birth 	= 	$userinfo.birth ? $userinfo.birth : '保密';
	
	if( $userinfo.sex == 0 ) {
		sex = '保密';
	} else if( $userinfo.sex == 1 ) {
		sex = '男';
	} else if( $userinfo.sex == 2 ) {
		sex = '女';
	} else {
		sex = '呵呵';
	}
	
	console.log('name'+name);
	console.log(photo);
	
	//	填充数据
	$('.form-upload img').attr('src',photo);
	$('input[name="name"]').val(name);
	$('input[name="sex"]').val(sex);
	$('input[name="birth"]').val(birth);
	
}


contentLoaded();
//mui.plusReady(function(){	

	//	修改基本资料
	$('input[name="birth"]').on('tap',function(){
		console.log($(this).val());
		plus.nativeUI.pickDate( function(e){
			var d=e.date,
				$this = $(this),
				$date = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
				
			$('input[name="birth"]').val($date);
		},function(e){
			console.log( "未选择日期："+e.message );
		});
	})
	

	//	修改用户名
	$('header .icon-link').on('tap',function(){
		//修改头像
		var txt1=$(".person-img").attr("src")
		//console.log(txt1)
		$.ajax({
			url: ApiUrl+"/index.php?act=member_account&op=editMemberAvatar",
			type: "post",
			data:{
				key:$userinfo.key,
				member_avatar:encodeURIComponent(txt1)
			},
			success: function(res){
				if( res.code == 200 ) {
					var data = $.parseJSON(res);
					$userinfo.photo=data.datas.member_avatar
					console.log($userinfo.photo);
				}
			}
		})
		
		//	修改用户名
		var
			$name 	= 	$('input[name="name"]').val(),
			$photo 	= 	$('.form-upload img').attr('src'),
			$sex 	= 	$('input[name="sex"]').val(),
			$birth 	= 	$('input[name="birth"]').val();
			
		
						
		//	修改用户名
		$.ajax({
			type:"post",
			url:ApiUrl+"/index.php?act=member_account&op=editMemberName",
			async:true,
			data: {
				key: $userinfo.key,
				member_name: $name 
			},
			success: function(data) {
				if( data.code == 200 ) {
					$userinfo.username = $name
					console.log($userinfo.username);
				} else if (  data.code == 400 ) {
					console.log(data.datas.error);
				}
			},
			error: function(err){
				console.log(err);
			}
		});
		
		//	修改基本资料
		$.ajax({
			url: ApiUrl+"/index.php?act=member_account&op=editMemberInfo",
			type: 'post',
			dataType: 'json',
			data: {
				key: $userinfo.key,
				member_sex: $sex,
				member_birthday: $birth
			},
			success: function(data){
				if( data.code == 200 ) {
					$userinfo.sex = 	$sex,
					$userinfo.birth = $birth;
				}
			}
		})
		
		
		window.localStorage.setItem('userinfo',JSON.stringify($userinfo));
		
		console.log('修改成功了吧');
		
		var $userinfo2 = _.userInfo.get();
		console.log('new name'+$userinfo2.username);
		console.log('new birth'+$userinfo2.birth);
		console.log('new sex'+$userinfo2.sex);
		console.log('new sex'+$userinfo2.photo);
		
		//	回传刷新
		var info = null;
		
		if( !info ) {
			info = plus.webview.getWebviewById('info');
		}
		
		mui.fire(info,'info',{
			name: $name ,
			src: txt1
		})
		
		mui.openWindow({
			url: '../ucenter.html',
			id: 'member',
			createNew: true,
			waiting: {
				autoShow: true
			}
		})
		
		
		console.log('change end');
		console.log(JSON.stringify($userinfo));
	})

//})









