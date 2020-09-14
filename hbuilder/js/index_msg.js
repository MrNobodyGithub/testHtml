//定义全局socket
var global_socket = null;
connect_chatServer();
//加入自定义loaddata事件，但是需要外面触发，不触发的时候本页面没法加载数据。
	window.addEventListener('disConnect_chatServer', function(event) {
		disConnect_chatServer();
	})
	//加入自定义loaddata事件，但是需要外面触发，不触发的时候本页面没法加载数据。
	window.addEventListener('connect_chatServer', function(event) {
		connect_chatServer();
	})
function disConnect_chatServer(){
	var view = plus.nativeObj.View.getViewById('messageTipsView');
	if(view){
		view.close();
	}
	global_message_count = 1;
	if(global_socket){
		console.log('关闭socket');
		global_socket.close();
	}
	global_socket = null;
}
function connect_chatServer(){
	var userInfo = _.userInfo.get();
	if (userInfo){
		var uid = userInfo.member_id;
		if(uid){
			stock(uid);
		}
	}
}

function stock(myid){
    global_socket = io(chatServerUrl);
    // uid可以是自己网站的用户id，以便针对uid推送以及统计在线人数
    console.log('创建sock连接');
	uid = myid;
    // socket连接后以uid登录
    global_socket.on('connect', function () {
        global_socket.emit('login', uid);
    });
    
    // 后端推送来消息时
    global_socket.on('new_msg', function (msg) {
    	//console.log('收到消息');
    	/*
    	msg = HTMLDecode(msg);
    	var obj = $.parseJSON(msg);
        console.log("收到消息：" + obj.info);
		if(obj.type == 1){
		}        
		*/
		//首页只负责有消息时候处理提示，不做具体工作
		_.openMessageTipsView(global_message_count++);
        return false;
    });
    // 后端推送来在线数据时
    global_socket.on('update_online_count', function (online_stat) {
		//console.log(online_stat);
    });
}