function createCity(){
	$.ajax({
		url: ApiUrl+"/index.php?act=area&op=area_list",
		type: "GET",
		success: function(res){
			var data = $.parseJSON(res);
			//console.log(data.datas.area_list[1].area_id)
			var html = template.render('regison', data);
			$(".regionchose-leftlist").html(html);
			$(".regionchose-leftlist").on("tap", "a",function(){
				$(this).addClass("active3").siblings().removeClass("active3");
			})
		}
	})
	$.ajax({
		url: ApiUrl+"/index.php?act=area&op=area_list_arr",
		type: "GET",
		success: function(res){
			var data = $.parseJSON(res);
			//console.log(data.datas.area_list[4].city_list[5].area_name);
			var html2 = template.render('regison2', data);
			$(".regionchose-rightlist").html(html2);
			$(".regionchose-rightlist").find("dl").find("dd").find("ol").on("tap", "li",function(){
				if($(this).hasClass("active4")){
					$(this).removeClass("active4")
				}else{
					$(".regionchose-rightlist").find("dl").find("dd").find("ol").find("li").removeClass("active4");
					$(this).addClass("active4").siblings().removeClass("active4");
					}
			})
			
			
		}
	})
}