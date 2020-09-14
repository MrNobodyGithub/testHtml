var footer = {

    // 跳转链接
    index: function(){
        mui.openWindow({
            url: WapSiteUrl + '/index.html',
            id: 'index',
            waiting:{
                autoShow:true,
                title:'正在加载...'
            }
        })
    },

    // 圈子
    bbs: function(){
        mui.openWindow({
            url: 'http://bbs.hisunflower.com/forum.php?key='+_.userInfo.getKey(),
            id: 'bbs',
            waiting: {
                autoShow: true,
                title: '正在加载...'
            }
        })
    },

    // 发布需求
    demand: function(){

    },

    // 消息
    info: function(){

    },

    // 我的
    member: function(){
        var store = JSON.parse(window.localStorage.getItem('store'));
        if( store == null ) {
            mui.openWindow({
                url: WapSiteUrl + '/tmpl/member/member.html',
                id: 'member',
                waiting: {
                    autoShow: true,
                    title: '正在加载'
                }
            })
        } else {
            mui.openWindow({
                url: WapSiteUrl + '/tmpl/seller/seller.html',
                id: 'seller',
                waiting: {
                    autoShow: true,
                    title: '正在加载'
                }
            })
        }
    },

    // 如果active == now 跳出
    // 没开启
    active: function(param){
        if( $('footer .active').index() == param ) {
            return false;
        }
    }

}

$('footer.footer-bar nav a').on('tap',function(){

    var $this   =   $(this),
        $index  =   $this.index();
    
    console.log($index);

    switch( $index ) {
        case 0 :
            footer.index(0);
            break;
        case 1:
            footer.bbs(1);
            break;
        case 2:
            footer.demand(2);
            break;
        case 3:
            footer.info(3)
            break;
        case 4:
            footer.member(4);
            break;
    }

})