document.addEventListener("plusready", function() {
	// 监听点击消息事件
	plus.push.addEventListener("click", function(msg) {
		// 判断是从本地创建还是离线推送的消息
		switch(msg.payload) {
			case "LocalMSG":
				_.debug("点击本地创建消息启动：");
				break;
			default:
				_.debug("点击离线推送消息启动：");
				break;
		}
		// 提示点击的内容
		_.debug(msg.content);
		// 处理其它数据
		logoutPushMsg(msg);
	}, false);
	// 监听在线消息事件
	plus.push.addEventListener("receive", function(msg) {
		if(msg.aps) { // Apple APNS message
			_.debug("接收到在线APNS消息：");
		} else {
			_.debug("接收到在线透传消息：");
		}
		logoutPushMsg(msg);
	}, false);

	/**
	 * 日志输入推送消息内容
	 */
	function logoutPushMsg(msg) {
		//应用启动后30秒才开始接受消息，忽略以前的消息
		var now = new Date().getTime();
		var startTime = plus.runtime.startupTime;
		if(now - startTime < 30 * 1000){
			return false;
		}
		//未登录不处理消息
		var $key = _.userInfo.getKey();
		if(!$key){
			return false;
		}
		_.openMessageTipsView(global_message_count++);
		
		//只做显示消息处理
		_.debug("title: " + msg.title);
		_.debug("content: " + msg.content);
		//smt_code = new_needs 为需求消息，考虑添加不同的播放声音
		if(msg.payload) {
			if(typeof(msg.payload) == "string") {
				_.debug("payload(String): " + msg.payload);
			} else {
				_.debug("payload(JSON): " + JSON.stringify(msg.payload));
			}
		} else {
			_.debug("payload: undefined");
		}
		if(msg.aps) {
			_.debug("aps: " + JSON.stringify(msg.aps));
		}
	}

	/**
	 * 清空所有推动消息
	 */
	function clearAllPush() {
		plus.push.clear();
		_.debug("清空所有推送消息成功！");
	}
	
}, false);