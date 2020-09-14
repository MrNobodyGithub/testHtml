$(function() {

	get_kind_list();

	mui.init({
		swipeBack: true
	});
	mui.plusReady(function() {
		$('.mui-content').on('tap', '.mui-collapse-content i', function() {
			var key = _.userInfo.getKey();
			if(!key) {
				checkLogin(0);
				return;
			}
			var
				classInfo = {},
				$this = $(this),
				gcId = $this.attr('data-gc-id'),
				typeId = $this.attr('data-type-id'),
				typeModel = $this.attr('data-type-model'),
				className = $this.text().trim(),
				parentName = $this.parent().prev().text().trim();
			//对于跑腿业务，处理同级的分类id属性，带到跑腿页面
			if($.inArray(typeModel, [1, 2, 3])) {
				var classModel = {};
				$this.parent().find('i').each(function() {
					//得到同级i元素的分类和类型属性
					var model = $(this).attr('data-type-model');
					var gc = $(this).attr('data-typ-id');
					classModel[model] = gc;
				})
				classInfo.classModel = classModel;
				//console.log(JSON.stringify(runner));
			}
			
			classInfo.gcId = gcId;
			classInfo.typeId = typeId;
			classInfo.typeModel = typeModel;
			classInfo.className = className;
			//$classInfo.parentName = $parentName;
			var wid = _.pageName.service_list;
			var tmpl = $this.attr('data-tmpl');
			tmpl = tmpl.substring(5, tmpl.length);
			classInfo.tmpl = tmpl;
			switch(typeModel) {
				case "1": //代送
				case "2": //排队
				case "3": //代买
					//获取同级的分类id属性
					var url = 'member/publish_needs_runner.html';
					wid = _.pageName.publish_needs_step2;
					classInfo.tmpl = url;
					if(typeModel == '2') {
						mui.alert('排队业务敬请期待...');
						return false;
					}
					if(typeModel == '3') {
						mui.alert('代买业务敬请期待...');
						return false;
					}
					break;
			}
			_.debug(classInfo);
			mui.openWindow({
				url: classInfo.tmpl,
				id: wid,
				createNew: false,
				extras: {
					classInfo: classInfo
				},
				show: {
					autoShow: false //不自动显示，等待页面加载完成后自己处理显示
				},
				waiting: {
					autoShow: true,
					title: '正在加载...'
				}
			})
			//	
		})
	})

});

function get_kind_list() {
	//  $('.mui-content').addClass('comkind');	
	$.getJSON(ApiUrl + "/index.php?act=service_class&op=get_service_class_and_child", function(result) {
		var html = template.render('comkind', result);
		$(".comkind").html(html);
	});
}