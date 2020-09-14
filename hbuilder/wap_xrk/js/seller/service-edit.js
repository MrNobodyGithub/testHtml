$(function() {
	//初始化全局变量
	var $key = _.userInfo.getKey();
	var commonid = getQueryString('commonid');
	var curType = 0;
	var is_gv = 0;//是否虚拟商品
	//var $key = '2715edd82c247949b37da8d7bff25cd1';
	//var commonid = 103788;
	
	bindEvent();
	get_kind_list();
	getAreaList();
	load_service_info(commonid);
	/**
	 * 绑定事件
	 */
	function bindEvent() {
		//1.分类选择事件
		$('.comkind').on('click', '.mui-collapse-content i', function() {
			var
				$this = $(this),
				$gcId = $this.attr('data-gc-id'),
				$typeId = $this.attr('data-type-id'),
				$className = $.trim($this.text()),
				$parentName = $.trim($this.parent().prev().text()),
				$gc_tag_name = $this.attr('gc_tag_name');
				is_gv = $this.attr('gc_virtual');
			// 传值
			$('.serverkind').find('.sendspan').val($gc_tag_name);
			$('.server2').hide().prev('.server1').show();
			$('#cate_id').val($gcId);
			$('#type_id').val($typeId);
			$('#cate_name').val($className);
			$('#is_gv').val(is_gv);
			//根据是否虚拟商品显示库存
			if(is_gv != 1){
				$('#group_storage').hide();
			} else {
				$('#group_storage').show();
			}
			getSpecList($gcId);
		})
		//2.分类展开收起事件
		$('.comkind').on('click', '.mui-navigate-right ', function() {
			$(this).next().slideDown();
			$(this).parent().siblings().find('.mui-collapse-content').slideUp();
		})
		//3.分类选择点击事件
		$(".serverkind").on("click", function() {
			$('.server1').fadeOut().siblings().hide();
			$('.server2').fadeIn().siblings().hide();

		})
		//4.分类后退事件
		$(".kind-header .icon-back").on("click", function() {
			$('.server2').fadeOut().siblings().hide();
			$('.server1').fadeIn().siblings().hide();
		})
		//5.图片上传事件
		$('.upload-img .default input[type="file"]').ajaxUploadImage({
			url: ApiUrl + "/index.php?act=seller_service&op=image_upload",
			data: {
				key: $key,
				name: "service_image"
			},
			start: function(element) {
				//loading...
				$(".loadingimg").show();
			},
			success: function(element, result) {
				//console.log(JSON.stringify(result));
				//close loading...
				$(".loadingimg").hide();
				if(result.error) {
					mui.alert('图片尺寸过大！', '提示', '确定');
					return false;
				}
				var $el = $('<div class="upload-moreimg"><input type="hidden" name=image_all[] value="' + result.datas.name + '"><img src= "' + result.datas.thumb_name + '"/><span class = "del-img1"></span></div>');
				$el.on('click', ".del-img1", function() {
					$(this).parent().remove();
				})
				element.parent().before($el);
			}
		})
		//6.发布服务按钮点击
		$("footer a").on("click", function() {
			var _form_param = $('#serviceform').serialize();
			var validparams = {
				rules: {
					cate_id: "required",
					type_id: "required",
					cate_name: "required",
					g_name: {
						required: true,
						maxlength: 50
					},
					g_price: {
						required: true,
						currency: true
					},
					g_jingle: {
						required: true,
						minlength: 10,
						maxlength: 150
					},
					price: {
						required: true,
						currency: true
					}
				},
				messages: {
					cate_id: "请选择服务分类",
					type_id: "请选择服务分类",
					cate_name: "请选择服务分类",
					g_name: {
						required: "请填写服务标题",
						maxlength: "标题不能多于50个字"
					},
					g_price: {
						required: "请填写服务价格",
						currency: "价格格式不正确"
					},
					g_jingle: {
						required: "请填写服务介绍",
						minlength: "描述不能少于10个字",
						maxlength: "描述不能多于150个字"
					},
					price: {
						required: "请填写服务规格价格",
						currency: "规格价格格式不正确"
					}
				},
				breakOnError: true, //首个错误就退出！
				callback: function(isError, errorMsg) {
					if(isError) {
						mui.toast(errorMsg);
					}
				}
			}
			//根据是否虚拟来限制库存录入
			if(is_gv == 1){
				validparams.rules['g_storage'] = {required: true,min: 0,max: 9999999};
				validparams.messages['g_storage'] = {required: "请填写库存数量",min: "库存最小值为0",max: "库存最大值为9999999"};
				validparams.rules['stock'] = {required: true,min: 0,max: 9999999};
				validparams.messages['stock'] = {required: "请填写规格库存数量",min: "规格库存最小值为0",max: "规格库存最大值为9999999"};
			}
			$.sValid.init(validparams);
			if($.sValid()) {
				//检查规格是否选择
				var specvalueCount = $('.specvaluelist').length;
				if(specvalueCount > 0) {
					var priceCount = $('.price').length;
					if(priceCount == 0) {
						mui.toast('请选择规格');
						return false;
					}
				}
				//检查地区是否选择
				var areaCount = $('.area input[type="checkbox"]:checked').length;
				if(areaCount == 0) {
					mui.toast('请选择服务区域');
					return false;
				}
				//检查图片是否上传
				var picCount = $('.upload-moreimg input').length;
				if(picCount == 0) {
					mui.toast('请上传服务图片');
					return false;
				}
				//console.log(_form_param);
				$(this).attr("disabled","disabled");
				mui.plusReady(function() {
					plus.nativeUI.showWaiting();
				})
				//提交服务
				$.ajax({
					type: "post",
					url: ApiUrl + "/index.php?act=seller_service&op=service_edit",
					async: true,
					data: _form_param + '&key=' + $key,
					dataType: 'json',
					success: function(result) {
						//console.log(JSON.stringify(result));
						if(result.code == 200) {
							mui.toast("编辑服务成功");
							mui.plusReady(function() {
								plus.webview.currentWebview().close();
								var listView = plus.webview.getWebviewById('service-list');
								if(listView) {
									mui.fire(listView, 'refresh');
									//listView.reload();
								}
								mui.openWindow({
									url: 'service-list.html',
									id: 'service-list',
									waiting: {
										autoShow: true,
										title: '正在加载...'
									}
								});
							})
						} else {
							mui.alert(result.datas.error);
						}
					},
					error: function() {
						mui.alert('服务器开小差了');
					},
					complete: function(){
						mui.plusReady(function() {
							plus.nativeUI.closeWaiting();
						})
						$(this).removeAttr("disabled");
					}
				});
			}
		})
	}
	/**
	 * 加载服务详情
	 */
	function load_service_info(commonid) {
		$.ajax({
			type: "get",
			url: ApiUrl + "/index.php?act=seller_service&op=service_info",
			data: {
				key: $key,
				commonid: commonid
			},
			async: true,
			dataType: "json",
			success: function(result) {
				//console.log(JSON.stringify(result));
				if(result.code == 200) {
					//界面赋值
					curType = result.datas.type_id;
					$('#commonid').val(result.datas.goods_commonid);
					$('#cate_id').val(result.datas.gc_id);
					$('#type_id').val(result.datas.type_id);
					$('#cate_name').val(result.datas.gc_name);
					$('#cate_name_select').val(result.datas.gc_tag_name);
					$('#g_name').val(result.datas.goods_name);
					$('#g_price').val(result.datas.goods_price);
					var goods_unit = result.datas.goods_unit;
					if(goods_unit == undefined || $.trim(goods_unit).length == 0){
						goods_unit = '次';
					}
					$('#g_unit').val(goods_unit);
					$('#g_storage').val(result.datas.g_storage);
					$('#g_jingle').val(result.datas.goods_jingle);
					is_gv = result.datas.is_virtual;
					$('#is_gv').val(is_gv);
					//根据是否虚拟商品显示库存
					if(is_gv != 1){
						$('#group_storage').hide();
					} else {
						$('#group_storage').show();
					}
					//规格选择
					if(result.datas.spec_list == null) {
						$("#specList").html('');
					} else {
						var specListTpl = template.render('specListTpl', {
							speclist: result.datas.spec_list
						});
						$("#specList").html(specListTpl);
						//规格按钮事件
						$('dl[type="spec_group_name"]').on('click', 'ul li input[type="checkbox"]', function() {
							makeSpecPriceContent();
						});
					}
					//规格列表
					if(result.datas.goods_spec == null) {
						$("#skuList").html('');
					} else {
						var skuListTpl = template.render('skuListTpl', {
							specdata:{is_gv:is_gv,speclist: result.datas.goods_spec}
						});
						$("#skuList").html(skuListTpl);
						//置价格,库存输入为只读
						$('#g_price').attr('readonly','readonly');
						$('#g_storage').attr('readonly','readonly');
						$('#skuList input.price').change(function(){
				        	computePrice();    // 最低价格计算
				       	});
						if(is_gv){
							$('#skuList input.stock').change(function(){
				                computeStock();    // 库存计算
				            })
						}
					}
					//属性列表
					if(result.datas.attr_list == null || result.datas.attr_list.length==0) {
						$("#attrList").html('');
					} else {
						var attrListTpl = template.render('attrListTpl', {
							attrlist: result.datas.attr_list
						});
						$("#attrList").html(attrListTpl);
					}
					//地区赋值
					var areaids = result.datas.area_id.split(',');
					$('.area input[type="checkbox"]').each(function() {
						var area_id = $(this).val();
						if($.inArray(area_id, areaids) != -1) {
							$(this).prop("checked", true);
						}
					});
					//照片赋值
					if(result.datas.image_all && $.isArray(result.datas.image_all)) {
						var element = $('.upload-img .default input[type="file"]');
						result.datas.image_all.forEach(function(item) {
							var $el = $('<div class="upload-moreimg"><input type="hidden" name=image_all[] value="' + item.name + '"><img src= "' + item.thumb_name + '"/><span class = "del-img1"></span></div>');
							$el.on('click', ".del-img1", function() {
								$(this).parent().remove();
							})
							element.parent().before($el);
						})
					}
				} else {
					mui.toast('获取服务详情错误');
					//应该关闭自身
					mui.plusReady(function() {
						plus.webview.currentWebview().close();
					})
				}
			},
			complete: function(){
				//console.log("curType"+curType);
				//固定价格显示
				if(curType == 42 || curType == 33){
					$('#g_price').attr('readonly', 'readonly');
					$('#secListprice').attr('readonly', 'readonly');
				}
			}
		});
	}
	/**
	 * 获取服务商服务分类 
	 */
	function get_kind_list() {
		$.getJSON(ApiUrl + '/index.php?act=seller_service&op=get_bind_class', {
				key: $key
			},
			function(result) {
				//console.log(result);
				var html = template.render('comkind', result);
				$(".comkind").html(html);

			});
	}

	/**
	 * 获取服务商服务区域
	 */
	function getAreaList() {
		$.ajax({
			type: "post",
			url: ApiUrl + "/index.php?act=zx_servicearea&op=getarea",
			data: {
				key: $key
			},
			async: true,
			dataType: "json",
			success: function(res) {
				//console.log(JSON.stringify(res));
				if(res.code == 200) {
					var areaListTpl = template.render('areaListTpl', res);
					$("#areaList").html(areaListTpl);
				} else {
					mui.toast('获取您的城市信息错误，可能类目申请正在审核！');
				}
			}
		});
	}
	/**
	 * 获取规格列表
	 * @param {Object} $gcId
	 */
	function getSpecList($gcId) {
		//取消价格，库存只读
		$('#g_price').removeAttr('readonly');
		$('#g_storage').removeAttr('readonly');
		$.ajax({
			url: ApiUrl + '/index.php?act=seller_service&op=get_spec',
			type: 'get',
			dataType: 'json',
			data: {
				key: $key,
				gc_id: $gcId
			},
			success: function(data) {
				//console.log("规格" + $gcId + JSON.stringify(data));
				if(data.code == 200) {
					//规格列表
					if(data.datas.spec == null) {
						$("#specList").html('');
					} else {
						var specListTpl = template.render('specListTpl', {
							speclist: data.datas.spec
						});
						$("#specList").html(specListTpl);
						//规格按钮事件
						$('dl[type="spec_group_name"]').on('click', 'ul li input[type="checkbox"]', function() {
							makeSpecPriceContent();
						});
					}
					$("#skuList").html('');
					//属性列表
					if(data.datas.attr == null) {
						$("#attrList").html('');
					} else {
						var attrListTpl = template.render('attrListTpl', {
							attrlist: data.datas.attr
						});
						$("#attrList").html(attrListTpl);
					}
				} else {
					$("#specList").html('');
					$("#skuList").html('');
					$("#attrList").html('');
				}
			},
			error: function() {
				console.log('获取规格错误');
				$("#specList").html('');
				$("#attrList").html('');
			}
		})
	}
	/**
	 * 生成规格价格列表
	 */
	function makeSpecPriceContent() {
		var spec_group_checked = new Array();
		var checkedAll = true;
		$('#g_price').removeAttr('readonly');
		$('#g_storage').removeAttr('readonly');
		$('#g_storage').val(0);
		$('dl[type="spec_group_name"]').each(function(indexSpec, specGroupItem) {
			var $specnameEl = $(specGroupItem).find('dt input[type="hidden"]');
			var spec_id = $specnameEl.attr('sp_id');
			var spec_name = $specnameEl.val();
			//获取选中规格项目
			var $specvalueEl = $(specGroupItem).find('dd input[type="checkbox"]:checked');
			if($specvalueEl.length == 0) {
				$('#skuList').html('');
				checkedAll = false;
				return;
			}
			var specvalueList = new Array();
			$specvalueEl.each(function(indexSpecvalue, specvalueItem) {
				var sp_value_id = $(specvalueItem).attr('sp_value_id');
				var sp_value_name = $(specvalueItem).val();
				specvalueList.push({
					sp_value_id: sp_value_id,
					sp_value_name: sp_value_name
				});
			});
			spec_group_checked.push({
				spec_id: spec_id,
				spec_name: spec_name,
				specvalueList: specvalueList
			});
		})
		if(!checkedAll) {
			return;
		}
		//console.log(JSON.stringify(spec_group_checked));
		//组合规格笛卡尔数组,采用结果和当前值两两合并
		function combin(specvalues, specvalue) {
			var specList = new Array();
			if(specvalues.length == 0) {
				specvalue.forEach(function(b) {
					var specids = new Array();
					var specnames = new Array();
					specids.push(b.sp_value_id);
					specnames.push(b.sp_value_name);
					specList.push({
						specids: specids,
						specnames: specnames
					});
				})
			} else {
				specvalues.forEach(function(a) {
					specvalue.forEach(function(b) {
						//直接赋值，导致变量指针引用
						var specids = a.specids.slice();
						var specnames = a.specnames.slice();
						specids.push(b.sp_value_id);
						specnames.push(b.sp_value_name);
						specList.push({
							specids: specids,
							specnames: specnames
						});
					})
				})
			}
			return specList;
		}
		//
		var checkedLen = spec_group_checked.length;
		if(checkedLen == 0) {
			$('#skuList').html('');
			return;
		}
		var specList = combin([], spec_group_checked[0].specvalueList);
		for(var i = 1; i < checkedLen; i++) {
			specList = combin(specList, spec_group_checked[i].specvalueList)
		}
		var goodsprice = parseFloat($('#g_price').val());
		if(isNaN(goodsprice)){
			goodsprice = '';
		}
		specList.forEach(function(item) {
			//处理规格值排序
			var sortids = item.specids.slice();
			sortids.sort(function(a, b) {
				return a - b
			});
			item.specidsstr = 'i_' + sortids.join('');
			item.specnamesstr = item.specnames.join('/');
			item.goods_price = goodsprice;
			item.goods_stock = '';
		})
		//console.log(JSON.stringify(specList));
		//规格列表
		var skuListTpl = template.render('skuListTpl', {
			specdata:{is_gv:is_gv,speclist: specList}
		});
		$("#skuList").html(skuListTpl);
		//置价格,库存输入为只读
		$('#g_price').attr('readonly','readonly');
		$('#g_storage').attr('readonly','readonly');
		$('#skuList input.price').change(function(){
        	computePrice();    // 最低价格计算
       	});
		if(is_gv){
			$('#skuList input.stock').change(function(){
                computeStock();    // 库存计算
            })
		}
	}
	// 计算商品库存
	function computeStock(){
	    // 库存
	    var _stock = 0;
	    $('#skuList input.stock').each(function(){
	        if($(this).val() != ''){
	            _stock += parseInt($(this).val());
	        }
	    });
	    $('#g_storage').val(_stock);
	}
	// 计算价格
	function computePrice(){
	    // 计算最低价格
	    var _price = 0;var _price_sign = false;
	    $('#skuList input.price').each(function(){
	        if($(this).val() != '' && $(this)){
	            if(!_price_sign){
	                _price = parseFloat($(this).val());
	                _price_sign = true;
	            }else{
	                _price = (parseFloat($(this).val())  > _price) ? _price : parseFloat($(this).val());
	            }
	        }
	    });
	    $('#g_price').val(number_format(_price, 2));
	}
})