
// 
// 	个人信息
// 

var personInfo = {

	photoFile: function(){

	},

	timePick: function(){

	},

	sex: function(){
		plus.nativeUI.showMenu(
			{title:"比价",badge:true},
			[
				{title:"淘宝网"},
				{title:"京东"},
				{title:"唯品会",checked:true}
			],
			function(e){
				console.log("点击了 "+e.target.title+" 菜单项");
			}
		);
	},

	phone: function(){

	}

}

function plusReady() {

	// 
	$('.icon-link').on('tap',function(){
		personInfo.sex();
	})
}

if( window.plus ) {

	plusReady();
	function showMenu() {
		plus.nativeUI.showMenu(
			{title:"比价",badge:true},
			[
				{title:"淘宝网"},
				{title:"京东"},
				{title:"唯品会",checked:true}
			],
			function(e){
				console.log("点击了 "+e.target.title+" 菜单项");
			}
		);
	}

	showMenu();

} else {

}