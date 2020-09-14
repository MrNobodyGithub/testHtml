$(function() {

	mui.init({
		swipeBack: true
	});
	var self = 0;
	mui.plusReady(function() {
		self = plus.webview.currentWebview();
		//console.log(self.doc_code)
		$.ajax({
			url: ApiUrl + "/index.php?act=document&op=getagreement",
			type: "GET",
			data: {
				doc_code: self.doc_code
			},
			success: function(res) {
				var data = $.parseJSON(res);
				var html = data.datas.doc_row.doc_content;
				console.log(html)
				$(".agreement-text").find("p").html(html)

			}
		})
	})

})