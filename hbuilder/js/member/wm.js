var $$ = function() {};

//跨域请求框架
$$.CrossWay = function(url, data, func,funcFail) {
	$.ajax({
		url: url,
		dataType: "json",
		type:"post",
		cache: false,
		data: data,
		success: function(data) {
			func(data);
		},
		error:function(){
			funcFail();
		}
	});
}