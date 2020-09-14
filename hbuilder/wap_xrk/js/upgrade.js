mui.plusReady(function() {
	//10秒后开始检查升级
	setTimeout(mui.checkUpdate(),10000);
})
(function() {
	// 检测更新
	function checkUpdate() {
		var wgtVer = null;
		// 获取本地应用资源版本号
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			wgtVer = inf.version;
			console.log("当前应用版本：" + wgtVer);
		});
		//plus.nativeUI.showWaiting("检测更新...");
		var checkUrl = ApiUrl + "/index.php?act=zx_setting&op=getversion";
		$.getJSON(checkUrl, function(ret) {
			//console.log(JSON.stringify(ret));
			//plus.nativeUI.closeWaiting();
			if(ret.code == 200) {
				//console.log(JSON.stringify(ret));
				var newApkVer = ret.datas.mobile_apk_version; //安卓版本号
				var newIosVer = ret.datas.mobile_ios_version || '0.0.0'; //ios版本号
				var forceupgrade = ret.datas.force_upgrade;
				//var upgradeurl = ret.datas.upgradeurl;
				var mobile_apk = ret.datas.mobile_apk;
				var mobile_ios = ret.datas.mobile_ios;
				var upgrade_tips = ret.datas.upgrade_tips;
				/*if(upgradeurl == "" || upgradeurl == undefined || upgradeurl == null){
					return;
				}*/
				//分开安卓和ios
				//console.log(plus.os.name);
				if(plus.os.name=="Android") {
					if(wgtVer && newApkVer && compareVersion(wgtVer,newApkVer)) {
					//if(wgtVer && newApkVer && (wgtVer != newApkVer)) {
						//强制升级时，启动升级
						if(forceupgrade == 1) {
							mui.toast('发现新的版本'+newApkVer+'，开始升级中...');
							downPackage(mobile_apk); // 下载升级包
						} else if(upgrade_tips == 1){
							//弹出提示有新的更新，是否升级
							mui.confirm('发现新的版本'+newApkVer, '向日葵来了', ['我要升级', '下次再说'], function(e) {
								if(e.index == 0) {
									downPackage(mobile_apk); // 下载升级包
								}
							})
						}
					}
				} else if(plus.os.name == 'iOS') {
					if(wgtVer && newIosVer && compareVersion(wgtVer,newIosVer)) {
					//if(wgtVer && newIosVer && (wgtVer != newIosVer)) {
						//强制升级时，启动升级
						if(forceupgrade == 1) {
							$('#upgrade').show();
							$('#upgrade').on('tap', '.jump', function(){
								plus.runtime.launchApplication( {action:"http://itunes.apple.com/app/id1263862500"}, function ( e ) {
									mui.alert( "Open system default browser failed: " + e.message );
								} );
							})
//							mui.toast('发现新的版本'+newIosVer+'，开始升级中...');
//							plus.runtime.openURL(mobile_ios);
						} else if(upgrade_tips == 1){
							//弹出提示有新的更新，是否升级
							mui.confirm('发现新的版本'+newIosVer, '向日葵来了', ['我要升级', '下次再说'], function(e) {
								if(e.index == 0) {
									plus.runtime.openURL(mobile_ios);
								}
							})
						}
					}
				}
			}
		})
	}

	//下载安装包文件
	function downPackage(packageUrl) {
		var w = plus.nativeUI.showWaiting("准备下载升级文件...");
		//mui.toast("正在下载升级文件...");
		var dtask = plus.downloader.createDownload(packageUrl, {
			method: "GET",
			filename: "_doc/update/"
		});
		var oldrate = 0;
		dtask.addEventListener("statechanged", function(task, status) {
			switch(task.state) {
				case 1: // 开始
					w.setTitle("正在下载升级文件...");
					break;
				case 2: // 已连接到服务器
					w.setTitle("已连接更新服务器...");
					break;
				case 3:
					var newrate = parseInt(task.downloadedSize / task.totalSize * 100);
					if(w) {
						//console.log(parseInt(newrate));
						if(newrate>oldrate){
							oldrate = newrate;
							w.setTitle("正在下载，已下载" + newrate + "%...");
						}
						//直接不停的更新setTitle会报递归错误
						//w.setTitle("正在下载，已下载" + parseInt(rate) + "%...");
					}
					break;
				case 4: // 下载完成
					if(status == 200) {
						if(w) {
							w.close();
						}
						console.log("下载升级文件成功：" + task.filename);
						setTimeout(installPackage(task.filename), 1000); // 安装wgt包
					} else {
						console.log("下载升级文件失败！");
						mui.toast("下载升级文件失败！");
						plus.nativeUI.closeWaiting();
					}
					break;
			}
		});
		dtask.start();
	}

	// 安装
	function installPackage(path) {
		//plus.nativeUI.showWaiting("正在安装升级文件...");
		mui.toast("正在安装升级文件...");
		plus.runtime.install(path, {}, function() {
			plus.nativeUI.closeWaiting();
			console.log("安装升级文件成功！");
			plus.nativeUI.alert("向日葵来了更新完成！", function() {
				delPackage(path);
				plus.runtime.quit();
				//调用重启会造成启动原有应用
				//plus.runtime.restart();
			});
		}, function(e) {
			plus.nativeUI.closeWaiting();
			delPackage(path);
			console.log("安装升级文件失败[" + e.code + "]：" + e.message);
			mui.toast("安装升级文件失败！");
			//plus.nativeUI.alert("非常抱歉\n安装升级文件失败！");
		});
	}

	//删除安装包
	function delPackage(path) {
		//执行删除升级包
		plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
			fs.root.getDirectory(path, {
				create: false
			}, function(dirEntry) {
				dirEntry.removeRecursively(function() {
					console.log("删除升级包成功")
				}, function(e) {
					console.log("删除升级包失败：" + e.message)
				});
			})
		})
	}
	/**
	 * 比较版本大小，如果新版本nv大于旧版本ov则返回true，否则返回false
	 * @param {String} ov
	 * @param {String} nv
	 * @return {Boolean} 
	 */
	function compareVersion( ov, nv ){
		if ( !ov || !nv || ov=="" || nv=="" ){
			return false;
		}
		var b=false,
		ova = ov.split(".",4),
		nva = nv.split(".",4);
		for ( var i=0; i<ova.length&&i<nva.length; i++ ) {
			var so=ova[i],no=parseInt(so),sn=nva[i],nn=parseInt(sn);
			if ( nn>no || sn.length>so.length  ) {
				return true;
			} else if ( nn<no ) {
				return false;
			}
		}
		if ( nva.length>ova.length && 0==nv.indexOf(ov) ) {
			return true;
		}
	}
	mui.checkUpdate = checkUpdate;
	mui.compareVersion = compareVersion;
	mui.downPackage = downPackage;
	return mui;
})();