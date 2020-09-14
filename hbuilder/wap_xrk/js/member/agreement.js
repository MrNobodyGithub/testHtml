$(function(){
				
	$.ajax({
		url: ApiUrl+"/index.php?act=document&op=getagreement&doc_code=register",
		type: "GET",
		data:{
			doc_code:self.doc_code
		},
		success: function(res){
			var data = $.parseJSON(res);
			var html = data.datas.doc_row.doc_content;
//			/console.log(html)
			$(".agreement-text").find("p").html(html)
			
		}
	})

				
})