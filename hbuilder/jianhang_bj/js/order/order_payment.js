var ua = navigator.userAgent.toLowerCase();
var data = {"TXCODE":"SP7010","WAPVER":"1.2","MERCHANTID":"105370260120019","ORDERID":"620562689105717149","PAYMENT":"1.00","BRANCHID":"371000000","POSID":"296406757","CURCODE":"01","REMARK1":"r","REMARK2":"","SUPPORTACCOUNTTYPE":"3","MAGIC":"9ae85cd2063d9ecab6fe0fe67d50f377"};
if(ua.indexOf('iphone') > 0){
	console.log('您正在使用苹果手机支付');
	function MBC_PAY(){
		console.log(MBC_PAYINFO());
//	  	window.location="/mbcpay.b2c ";
	}
	function MBC_PAYINFO(){
	  	var orderinfo = "TXCODE="  +  data.TXCODE + 
						",WAPVER="  +  data.WAPVER + 
		  				",MERCHANTID="  +  data.MERCHANTID + 
		  				",ORDERID=" + data.ORDERID + 
		  				",PAYMENT=" + data.PAYMENT + 
		  				",BRANCHID=" + data.BRANCHID + 
		  				",POSID=" + data.POSID + 
		  				",CURCODE=" + data.CURCODE + 
		  				",REMARK1=" + data.REMARK1 + 
		  				",REMARK2=" + data.REMARK2 + 
		  				",SUPPORTACCOUNTTYPE=" + data.SUPPORTACCOUNTTYPE + 
		  				",MAGIC=" + data.MAGIC;
	  	return "{"  +  orderinfo  +  "}";
	}

}else if(ua.indexOf('android') > 0){
	console.log('您正在使用安卓手机支付');
	function MBC_PAY(){
	 	var orderinfo = "TXCODE=" + data.TXCODE + 
						",WAPVER=" + data.WAPVER + 
		  				",MERCHANTID=" + data.MERCHANTID + 
		  				",ORDERID=" + data.ORDERID + 
					  	",PAYMENT=" + data.PAYMENT + 
					  	",BRANCHID=" + data.BRANCHID + 
					  	",POSID=" + data.POSID + 
					  	",CURCODE=" + data.CURCODE + 
					  	",REMARK1=" + data.REMARK1 + 
						",REMARK2=" + data.REMARK2 + 
		  				",SUPPORTACCOUNTTYPE=" + data.SUPPORTACCOUNTTYPE + 
		  				",MAGIC=" + data.MAGIC; 
		console.log(orderinfo);
//		window.mbcpay.b2c(orderinfo);
	}
}
