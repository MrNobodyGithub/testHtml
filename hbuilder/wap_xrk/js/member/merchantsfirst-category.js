
	get_kind_list();


function get_kind_list() {
	$.getJSON(ApiUrl+'/index.php?act=service_class', function (result) {
		var html = template.render('comkind', result);
		$(".merchantsfirst-category-section").html(html);
	});
}

var $txt = [],
	$num = [];

$('.mui-content').on('tap', '.form-check input[type="checkbox"]', function () {

	var $this = $(this);

	if (!$this.prop('checked')) {
		$num.push($this.parent().attr('data-id'));
		$txt.push($this.prev().text());
	} else {
		$num.remove($this.parent().attr('data-id'));
		$txt.remove($this.prev().text());
	}

})


