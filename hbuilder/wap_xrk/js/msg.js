var $userinfo = _.userInfo.get();
var key = '';
if ($userinfo){
	var uid = $userinfo.member_id;
	key = $userinfo.key;
	if(uid){
		stock(uid);
	}
}

function stock(myid){
    // 连接服务端，workerman.net:2120换成实际部署web-msg-sender服务的域名或者ip
    var socket = io(chatServerUrl);
    // uid可以是自己网站的用户id，以便针对uid推送以及统计在线人数
	uid = myid;
    // socket连接后以uid登录
    socket.on('connect', function () {
        socket.emit('login', uid);
    });
    // 后端推送来消息时
    socket.on('new_msg', function (msg) {
    	msg = HTMLDecode(msg);
    	var obj = $.parseJSON(msg);
		_.closeMessageTipsView();
        console.log("收到消息：" + obj.info);
		if(obj.type == 1){
        	var str = "<div class='mui-clearfix info-from info-item'>" +
            "<img src='"+$userinfo.photo+"' class='head' alt=''>" +
            "<div class='info-detail'>" + obj.info + "</div></div>";
        	$('#msg').append(str);
			$('body').animate({scrollTop:$('.info').outerHeight()},200)
		}
        return false;
    });
    // 后端推送来在线数据时
    socket.on('update_online_count', function (online_stat) {
//		console.log(online_stat);
    });
}

function message(){
	mui.openWindow({
        url: 'system_notice.html',
        id: 'list',
        waiting: {
            autoShow: true, //自动显示等待框，默认为true
            title: '正在加载...' //等待对话框上显示的提示内
        }
    })
}

function replace_em(str){

    str = str.replace(/\</g,'&lt;');

    str = str.replace(/\>/g,'&gt;');

    str = str.replace(/\n/g,'<br/>');

    str = str.replace(/\[em_([0-9]*)\]/g,"<img src='../../arclist/$1.gif' border='0' />");

    return str;

}
