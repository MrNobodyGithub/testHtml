## 目录结构
-----------

## 一级目录（:root代表根目录）

+ css
+ images 修改目录名字
+ js
    + common    :   公共页面的js文件
    - member    :   个人操作  --
    - seller    :   服务商操作--上面两个目录移动到tmpl目录？？？
    - plugins   :   引用的插件
    - tmpl      :   模板对应的脚本
	  模板目录下再分功能目录
    + :root     :   shopnc wap站原来的部分js文件 已经重写window.localStorage方法
        - getStorage(name);         :       获取本地数据
        - setStroage(name,value)    :       存储本地数据,value可以是object 已经在方法内stringfy
        - delStorage(name)          :       删除本地数据
        - clsStorage()              :       清空本地数据
        - jumpLogin()               :       验证是否登录
+ less
+ tmpl
    - common    :   公共页面
    - member    :   个人页面
    - order     :   预约/订单及确认
    - seller    :   服务商页面
    - :root     :   不登录即可浏览的页面

保洁链接跳转将month-detail.html 换成 cleaning-detail.html

+ html文件对应:
首页(index),放在目录外层。

	- common:  
	 
	选择分类：应该放在这里										 				// 分类=>div
	选择城市：应该放在这里										 随意...		   //  
	做成通用函数调用。。。。。。。。。。												 
	城市定位(regionchose),									 随意...	 

	
	footer.js独立页脚部分js-----------						随意...
	
	登录后如果是服务商，跳转到服务商个人中心,					   随意...	
	------>缓存登录后不进入				index.html 赵阳悦
	--------------------------------------------------		
    - member    : 待仔细整理  
    member.html---------*会员个人中心'						随意...						
	选择收获地址												随意...
	收获地址增加，修改 										  随意...
	
	我的收藏(collection),									 随意...
	设置(config),
	优惠券(coupon),										  随意...		
	退款申请(custom-service-list),							 小白... 
	发表评论(evaluate),									     悦悦...
	忘记密码(forgetPassword), 								 悦悦...
	注册(register),										  随意...
	登录(login),											  随意...	
	充值系列(recharge-history								 暂无 
	历史  recharge-index 									  暂无
	首页  recharge-list 									  暂无
	列表												  	  暂无
	订单管理(service-order-all 								 小白...
	我的订单 service-order-list 							 小白...
	订单列表 service-order-detail 							 小白...
	订单详情   service-order-refund 退款申请 ),				  小白...
	发表追加(request),
	
	帮助与反馈(feedback										随意.. 
	帮助与反馈 feedback-notice 		
	公告 feedback-notice-detail 
	详情  feedback-problem-pay 
	支付问题),
	
	实名认证(agreement),									 于瑞鹏
	邀请好友(authentication),								 随意...
	商家入驻一系列(merchantsenterpriseannex),				   于瑞鹏
	个人信息(person-info),									 随意...
	邀请好友(invite),										 随意...
    - order     :   									
    <!--buy_step1.html 商品购买步骤1-->					    参考...
	<!--vr_buy_step1.html 虚拟商品购买步骤1-->				   参考..
	service_buy_step1.html 服务购买步骤1
		这个文件目前是原来的商品购买步骤1，
	    按照这个模式来做，不通的预约样式，
		在这里页面里面写不同的子div模板来做
    
    - seller    :待仔细整理  								
    seller.html---------*卖家个人中心'						随意...
	发表追加(evaluate-my),  								 悦悦...
	历史商机(history history-1),							 暂定
	全部订单(order-list),									 小白
	充值系列(recharge-history 								 暂无
	历史  recharge-index 
	首页  recharge-list 列表),								 
	订单管理(order-refund),
	退款售后(refund-list),									 小白...
	提现(postal),											   暂无
	添加银行卡(add-bankcard),								 暂无
	选择分类(search分类 search-1分类列表),					  悦悦
	发布服务(service-add)									  于瑞鹏
	编辑服务(service-edit)									  于瑞鹏
	服务列表（我发布的）(service-list)						  于瑞鹏
    
    - :root     :
    1.
	预产期(month-time),查询条件，这个应该放在列表里面做， 		   悦悦
	月嫂列表(nanny-list),									  		
	月嫂详情(nanny-detail),
	
	2.
	公共样式应用于（保姆，育婴师，护工，家教）版块
	公共列表(common-list),
	公共详情(common-detail),

	3.
	保洁列表(cleaning-list),
	保洁详情(cleaning-detail),
	
	4.搬家列表(move-list),									于瑞鹏
	搬家详情(move-detail),									于瑞鹏

	5.护工列表(hos-list),
	护工详情(hos-detail),
	
	6.
	车服务列表(car-list),								   元元
	车服务详情(car-detail),								   元元

	今日头条(news-list),								    悦悦
	今日头条详情(news-detail),							  悦悦
	
	全部评论(news-comment-list),							悦悦
	评论列表(comment-list),									悦悦
	
	用于在服务详情页面中查看服务商详情，分个人和商铺两种
	个人详情(personal-detail),								悦悦
	店铺详情(store-detail),									悦悦
	
	<!--选择分类(search分类 search-1分类列表)-->
	
	
	发布需求(publish-needs) 要先选择分类，然后根据分类跳转不同模板。
	

### 	详情页规格 发布服务规格								随意...
### 	多级分页											 随意...
### 	第三方登录/分享 		

### 	资源调优											 元元...