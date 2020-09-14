$(function() {
	mui.init({
		swipeBack: true
	});
	var typeId = getQueryString('type_id');
	$.ajax({
		url: ApiUrl + "/index.php?act=type&op=getTypeInfo",
		type: "GET",
		dataType: 'json',
		data: {
			type_id: typeId
		},
		success: function(res) {
			var agreement = '';
			if(res.code == '200') {
				agreement = HTMLDecode(res.datas.type_info.agreement);
			}
			$(".agreement-text").find("p").html(agreement);
		}
	})
})