_.customerField = {
	formType : 1,//表单类型 0 普通，1，预约表单 2，需求表单
	gc_id : 0,//分类id，必须设置分类id，需求和预约需要此字段
	type_id : 0,//分类id，必须设置分类id，需求和预约需要此字段
	//验证规则，后面需要填充rules,messages
	validparams : {
		rules:{},
		messages:{},
		breakOnError:true,//首个错误就退出！
		callback:function (isError,errorMsg){
			if(isError){
				mui.toast(errorMsg);
			}
		}
	},
	/**
	 * 字段类型常量
	 * @return array
	 */
	typeField : function() {
		$list = {
			1: {
				name: '单行文本',
				html: 'text',
			},
			2: {
				name: '多行文本',
				html: 'textarea',
			},
			3: {
				name: '编辑器',
				html: 'editor',
			},
			4: {
				name: '整数',
				html: 'number',
			},
			5: {
				name: '小数',
				html: 'double',
			},
			6: {
				name: '日期和时间',
				html: 'timerpicker',
			},
			7: {
				name: '下拉菜单',
				html: 'selectpicker',
			},
			8: {
				name: '单选',
				html: 'radio',
			},
			9: {
				name: '多选',
				html: 'checkbox',
			},
			10: {
				name: '文件上传',
				html: 'fileupload',
			},
			11: {
				name: '单图片上传',
				html: 'imgupload',
			},
			12: {
				name: '多图上传',
				html: 'imagesupload',
			},
			13: {
				name: '地址查询',
				html: 'addresssearch',
			},
			14: {
				name: '链接跳转',
				html: 'selecttaocan',
			},
			15: {
				name: '链接跳转',
				html: 'selectdangqi',
			}
		};
		return $list;
	},

	htmlField : function($config) {
		function processDefaultValue(value){
			var userinfo = _.userInfo.get();
			var ret = "";
			if (userinfo!=null){
				switch (value){
					case "{username}":
						ret = userinfo['username'];
						break;
					case "{mobile}":
						ret = userinfo['phone'];
						break;
					default:
						if(value != '' && value != null){
							ret = value;
						}
						break;
				}
			} else if(value != '' && value != null){
				ret = value;
			}
			return ret;
		}
		//设置HTML
		//TODO 必填项目加星号
		var that = this;
		var rule = {};
		var message = {};
		var $html = '';
		var $fieldname = $config['field_name'];
		var $value = ($config['value'] == undefined) ? "" : $config['value'];
		var $fieldicon = $config['field_icon'];
		var $spanicon = "";
		if($fieldicon == "" || $fieldicon == undefined || $fieldicon == null) {
			//可以根据字段名称来定制一些图标
			$spanicon = '<span class="mui-icon mui-icon-info" style="color:#000000";></span>';
		} else {
			$spanicon = '<span class="sun-field-icon" style="background-image:url(' + $config['field_icon'] + ')"></span>';
		}
		var $fieldlabel = $config['field_title'];
		var $readonly = $config['is_readonly']=='1'?' readonly="true"':'';
		switch($fieldname) {
			case 'spec':
				//只有发布需求的时候需要处理规格
				if(this.formType==2){ 
					var $html = "";
					var $spechtml = "";
					var specprop = $config['specprop'];
					$.each(specprop, function(key,item) {
						//生成规格对象
						//是可以编辑的选择框，还是普通文字	
						//或者直接初始化为空对象
						var data_options = JSON.stringify([{
							value: '',
							text: '请选择'
						}]);
						//处理option值
						var valuelist = item['value'];
						var options = new Array();
						for(var i = 0, length = valuelist.length; i < length; i++) {
							sp_key = valuelist[i]['sp_value_name'];
							sp_value = valuelist[i]['sp_value_name'];
							//直接使用规格值
							//sp_value = valuelist[i]['sp_value_id'];
							options.push({
								value: sp_value,
								text: sp_key
							});
						}
						data_options = JSON.stringify(options);
						$spechtml = '<input data-label="'+item['sp_name']+'" type="hidden" name = "sp_name[' + key + ']" value="' + item['sp_name'] + '">';
						$spechtml += '<li class="mui-table-view-cell selectpicker" data-options=\'' + data_options + '\'>';
						$spechtml += '<input type="hidden" name = "sp_val[' + key + ']" value="">';
						$spechtml += '<a class="mui-navigate-right">' + $spanicon + item['sp_name'];
						$spechtml += '<span class="mui-right-text" value="">请选择</span>';
						$spechtml += '</a></li>';
						$html += $spechtml;
					});
				} else {
					//需求采用只读显示并且构造hidden字段传递到下一步
					var $html = "";
					var $spechtml = "";
					var $spec = $config['value'];
					var $spec_name = $spec['spec_name'];
					var $spec_value = $spec['spec_value'];
					if(!isEmpty($spec_name)){
						$.each($spec_name, function(key,value) {
							$spechtml = '<li class="mui-input-row">';
							$spechtml += '<label>' + $spanicon + value +'</label>';
							$spechtml += '<input data-label="'+value+'" type="hidden" name = "sp_name[' + key + ']" value="' + value + '">';
							$spechtml += '<input type="hidden" name = "sp_val[' + key + ']" value="'+ $spec_value[key] +'">';
							$spechtml += '<span class="mui-right-text">'+$spec_value[key]+'</span>';
							$spechtml += '</li>';
							$html += $spechtml;
						})
					}
				}
				break;
			case 'address_from':
				if($config['verify_require'] == 1){
					rule['required'] = true;
					message['required'] = $config['field_title'] + '未录入!';
					$fieldlabel = $fieldlabel + '<span class="sun-required">*</span>'
				}
				//非空加入校验规则
				if (!isEmpty(rule)) {
					that.validparams.rules[$config['field_name']] = rule;
					that.validparams.messages[$config['field_name']] = message;
				}
				//
				$html = '<li class="mui-input-row sun_address_select">';
				$html += '<label>' + $spanicon + $fieldlabel +'</label>';
				$html += '<input data-label="'+$config['field_title'] + '" type="text" id="address_from" name = "address_from" value="' + "" + '" placeholder="' + $config['field_tips'] + '" readonly>';
				$html += '<span class="sun-select-btn mui-icon mui-icon-location"></span>';
				$html += '</li>';
				$html += '<li class="mui-input-row">';
				$html += '<label></label>';
				$html += '<input type="text" class="mui-input-clear" id="address_from_detail" placeholder="请输入具体楼栋门牌号">';
				$html += '</li>';
				break;
			case 'address_to':
				if($config['verify_require'] == 1){
					rule['required'] = true;
					message['required'] = $config['field_title'] + '未录入!';
					$fieldlabel = $fieldlabel + '<span class="sun-required">*</span>'
				}
				//非空加入校验规则
				if (!isEmpty(rule)) {
					that.validparams.rules[$config['field_name']] = rule;
					that.validparams.messages[$config['field_name']] = message;
				}
				//
				$html = '<li class="mui-input-row sun_address_select">';
				$html += '<label>' + $spanicon + $fieldlabel +'</label>';
				$html += '<input data-label="'+$config['field_title'] + '" type="text" id="address_to" name = "address_to" value="' + $value + '" placeholder="' + $config['field_tips'] + '" readonly>';
				$html += '<span class="sun-select-btn mui-icon mui-icon-location"></span>';
				$html += '</li>';
				$html += '<li class="mui-input-row">';
				$html += '<label></label>';
				$html += '<input type="text" class="mui-input-clear" id="address_to_detail" placeholder="请输入具体楼栋门牌号">';
				$html += '</li>';
				break;
			//看看要不要处理不同的格式显示，否则可以写成一个case
			//预约价格
			case 'books_price':
				if($value == "") {
					$value = '0.00';
					//数量加减
				}
				$html = '<li class="mui-input-row">';
				$html += '<label>' + $spanicon + $fieldlabel +'</label>';
				$html += '<input data-label="'+$config['field_title']+'" type="hidden" name = "'+$config['field_name'] + '" value="' + $value + '">';
				$html += '<span class="mui-right-text">￥'+$value+'</span>';
				$html += '</li>';
				break;
			//预约单位
			case 'books_unit':
//			case 'books_time_from':
					
					$html = '<li class="mui-input-row">';
					$html += '<label>' + $spanicon + $fieldlabel +'</label>';
					$html += '<input data-label="'+$config['field_title']+'" type="hidden" name = "'+$config['field_name'] + '" value="' + $value + '">';
					$html += '<span class="mui-right-text">'+$value+'</span>';
					$html += '</li>';
				break;
			case 'books_qty':
				if($value == "") {
					$value = 0;
					//数量加减
				}
				$html = '<li class="mui-input-row">';
				$html += '<label>' + $spanicon + $fieldlabel +'</label>';
				$html += '<input data-label="'+$config['field_title']+'" type="hidden" name = "'+$config['field_name'] + '" value="' + $value + '">';
				$html += '<span class="mui-right-text">'+$value+'</span>';
				$html += '</li>';
				break;
			case 'books_amount':
				if($value == "") {
					$value = '0.00';
					//数量加减
				}
				$html = '<li class="mui-input-row">';
				$html += '<label>' + $spanicon + $fieldlabel +'</label>';
				$html += '<input data-label="'+$config['field_title']+'" type="hidden" name = "'+$config['field_name'] + '" value="' + $value + '">';
				$html += '<span class="mui-right-text">￥'+$value+'</span>';
				$html += '</li>';
				break;
			default:
				//如果发布需求的时候，有数量，单价，小费，那么需要计算金额
				//TODO 目前暂时不处理。
				//处理校验规则
				//错误消息文字
				var errorMsg = $config['errormsg'];
				if(errorMsg == "" || errorMsg == undefined || errorMsg == null) {
					errorMsg = $config['field_title'] + '格式不正确!';
				}
				//判断是否必填
				if($config['verify_require'] == 1){
					rule['required'] = true;
					message['required'] = $config['field_title'] + '未录入!';
					$fieldlabel = $fieldlabel + '<span class="sun-required">*</span>'
				}
				switch ($config['verify_type']){
                    case "length":
                    	var verify_rule = $config['verify_rule'].split(',');
                    	verify_rule[0] = parseInt(verify_rule[0]);
                    	if(!(isNaN(verify_rule[0]))){
	                    	rule['minlength'] = verify_rule[0];
	                    	message['minlength'] = $config['field_title'] + '长度应该大于' + verify_rule[0];
                    	}
                    	verify_rule[1] = parseInt(verify_rule[1]);
                    	if(!(isNaN(verify_rule[1]))){
	                    	rule['maxlength'] = verify_rule[1];
	                    	message['maxlength'] = $config['field_title'] + '长度应该小于' + verify_rule[1];
                    	}
                    	break;
                    case "range":
                        var verify_rule = $config['verify_rule'].split(',');
                        verify_rule[0] = parseFloat(verify_rule[0]);
                    	if(!(isNaN(verify_rule[0]))){
	                        rule['min'] = verify_rule[0];
	                        message['min'] = $config['field_title'] + '应该大于' + verify_rule[0];
                        
                    	}
                    	verify_rule[1] = parseFloat(verify_rule[1]);
                    	if(!(isNaN(verify_rule[1]))){
	                    	rule['max'] = verify_rule[1];
	                    	message['max'] = $config['field_title'] + '应该小于' + verify_rule[1];
                    	}
                        break;
                    case "default":
	                    if(!($config['verify_rule'] == "" || $config['verify_rule'] == undefined || $config['verify_rule'] == null)){
	                    	rule[$config['verify_rule']] = true;
	                    	message[$config['verify_rule']] = errorMsg;
	                    }
                        break;
                }
//				console.log(rule);
				//非空加入校验规则
				if (!isEmpty(rule)) {
					that.validparams.rules[$config['field_name']] = rule;
					that.validparams.messages[$config['field_name']] = message;
				}
				//
				var $typeField = this.typeField();
				var $type = $typeField[$config['field_type']].html;
				switch($type) {
					case 'text':
						if($value == ""){
							$value = processDefaultValue($config['field_default']);
						}
						$html = '<li class="mui-input-row">';
						$html += '<label>' + $spanicon + $fieldlabel +'</label>';
						$html += '<input  data-label="'+$config['field_title']+'" type="text" class="mui-input-clear" id="' + $config['field_name'] + '" name = "' + $config['field_name'] + '" value="' + $value + '" placeholder="' + $config['field_tips'] + '"'  + $readonly +'>';
						$html += '</li>';
						break;
						//需求描述
					case 'textarea':
					case 'editor':
						if($value == ""){
							$value = processDefaultValue($config['field_default']);
						}
						$html = '<li class="mui-input-row txtDescription" style="height: 6em; padding-top: 10px;padding-left:15px;">';
						$html += '<textarea data-label="'+$config['field_title']+'" style="padding-top:0px; padding-left:0px;font-size:14px; padding-bottom: 0;" rows="4" id = "' + $config['field_name'] + '" name = "' + $config['field_name'] + '" placeholder="' + $config['field_tips'] + '"'+ $readonly + '>' + $value + '</textarea>';
						$html += '</li>';
						break;
					case 'fileupload':
						$html = '';
						break;
					case 'imgupload':
						$html = '<div class="sun-photo-group">';
						$html += '<h5>' + $spanicon + $config['field_title'] + '</h5>';
						$html += '<ul>';
						$html += '<input data-label="'+$config['field_title']+'" type="hidden" id="' + $config['field_name'] + '" name = "' + $config['field_name'] + '" value="' + $value + '" >';
						$html += '<li class="sun-photo-add single mui-icon mui-icon-plusempty">';
						$html += '<input type="file"  name="file" id="file" accept="image/*"  capture="camera" multiple="">';
						$html += '</li>';
						$html += '</ul>';
						$html += '</div>';
						break;
					case 'imagesupload':
						$html = '<div class="sun-photo-group">';
						$html += '<h5>' + $spanicon + $config['field_title'] + '</h5>';
						$html += '<ul name="' + $config['field_name']+'">';
						$html += '<li class="sun-photo-add multi mui-icon mui-icon-plusempty">';
						$html += '<input type="file" name="file" id="file" accept="image/*" capture="camera" multiple="" >';
						$html += '</li>';
						$html += '</ul>';
						$html += '</div>';
						break;
					case 'selectpicker':
						//或者直接初始化为空对象
						var data_options = JSON.stringify([{
							value: '',
							text: '请选择'
						}]);
						//处理option值
						var optionsStr = $config['field_option'];
						if(!(optionsStr == "" || optionsStr == undefined || optionsStr == null)) {
							var options = new Array();
							var optionsArray = optionsStr.split("\n");
							for(var i = 0, length = optionsArray.length; i < length; i++) {
								var keyvalue = optionsArray[i].split("|");
								var key, value;
								key = keyvalue[0];
								if(keyvalue.length == 1) {
									value = key;
								} else {
									value = keyvalue[1];
								}
								options.push({
									value: value,
									text: key
								});
							}
							data_options = JSON.stringify(options);
						}
						var relatedfield = $config['field_related_field'] || '';
						
						$html = '<li class="mui-table-view-cell selectpicker" data-options=\'' + data_options + '\'' + ' data-relatedfield="' + relatedfield + '">';
						$html += '<input data-label="'+$config['field_title']+'" type="hidden" id="' + $config['field_name'] + '" name = "' + $config['field_name'] + '" value="' + $value + '">';
						$html += '<a class="mui-navigate-right">' + $spanicon + $fieldlabel + '<span class="sun-required"></span>';
						$html += '<span class="mui-right-text" value="" style="color:#000000">请选择</span>';
						$html += '</a></li>';
						break;
					case 'selecttaocan':
						//或者直接初始化为空对象
						var data_options = JSON.stringify([{
							value: '',
							text: '选择套餐'
						}]);
						//处理option值
//						var optionsStr = $config['field_option'];
//						if(!(optionsStr == "" || optionsStr == undefined || optionsStr == null)) {
//							var options = new Array();
//							var optionsArray = optionsStr.split("\n");
//							for(var i = 0, length = optionsArray.length; i < length; i++) {
//								var keyvalue = optionsArray[i].split("|");
//								var key, value;
//								key = keyvalue[0];
//								if(keyvalue.length == 1) {
//									value = key;
//								} else {
//									value = keyvalue[1];
//								}
//								options.push({
//									value: value,
//									text: key
//								});
//							}
//							data_options = JSON.stringify(options);
//						}
						var relatedfield = $config['field_related_field'] || '';
						
						$html = '<li class="mui-table-view-cell selecttaocan" data-options=\'' + data_options + '\'' + ' data-relatedfield="' + relatedfield + '">';
						$html += '<input data-label="'+$config['field_title']+'" type="hidden" id="' + $config['field_name'] + '" name = "' + $config['field_name'] + '" value="' + $value + '">';
						$html += '<a class="mui-navigate-right">' + $spanicon + $fieldlabel + '<span class="sun-required"></span>';
						$html += '<span class="mui-right-text" value="" style="color:#000000">选择套餐</span>';
						$html += '</a></li>';
						$html += '<li class="mui-input-row" id="selecttaocan_detail">';
						
						$html += '</li>';
						
						break;
					case 'selectdangqi':
						//或者直接初始化为空对象
						var data_options = JSON.stringify([{
							value: '',
							text: '请选择'
						}]);
						//处理option值
						var optionsStr = $config['field_option'];
						if(!(optionsStr == "" || optionsStr == undefined || optionsStr == null)) {
							var options = new Array();
							var optionsArray = optionsStr.split("\n");
							for(var i = 0, length = optionsArray.length; i < length; i++) {
								var keyvalue = optionsArray[i].split("|");
								var key, value;
								key = keyvalue[0];
								if(keyvalue.length == 1) {
									value = key;
								} else {
									value = keyvalue[1];
								}
								options.push({
									value: value,
									text: key
								});
							}
							data_options = JSON.stringify(options);
						}
						var relatedfield = $config['field_related_field'] || '';
						
						$html = '<li class="mui-table-view-cell selectdangqi" data-options=\'' + data_options + '\'' + ' data-relatedfield="' + relatedfield + '">';
						$html += '<input data-label="'+$config['field_title']+'" type="hidden" id="' + $config['field_name'] + '" name = "' + $config['field_name'] + '" value="' + $value + '">';
						$html += '<a class="mui-navigate-right">' + $spanicon + $fieldlabel + '<span class="sun-required"></span>';
						$html += '<span class="mui-right-text" value="" style="color:#000000">请选择</span>';
						$html += '</a></li>';
						break;
					case 'radio':
						//处理option值
						var optionsStr = $config['field_option'];
						if(!(optionsStr == "" || optionsStr == undefined || optionsStr == null)) {
							$html = '<h5>' + $spanicon + $fieldlabel + '</h5>';
							var optionsArray = optionsStr.split("\n");
							for(var i = 0, length = optionsArray.length; i < length; i++) {
								var keyvalue = optionsArray[i].split("|");
								var key, value;
								key = keyvalue[0].trim();
								if(keyvalue.length == 1) {
									value = key;
								} else {
									value = keyvalue[1].trim();
								}
								$html += '<li class="mui-input-row mui-radio mui-left">';
								$html += '<label>' + key + '</label>';
								if(value == $config['field_default']) {
									$html += '<input data-label="'+$config['field_title']+'" name="' + $config['field_name'] + '" type="radio" checked="checked" value="' + value + '">';
								} else {
									$html += '<input data-label="'+$config['field_title']+'" name="' + $config['field_name'] + '" type="radio" value="' + value + '">';
								}
								$html += '</li>';
							}

						}
						break;
					
					case 'checkbox':
						//处理option值
						var optionsStr = $config['field_option'];
						if(!(optionsStr == "" || optionsStr == undefined || optionsStr == null)) {
							$html = '<h5>' + $spanicon + $fieldlabel + '</h5>';
							var optionsArray = optionsStr.split("\n");
							for(var i = 0, length = optionsArray.length; i < length; i++) {
								var keyvalue = optionsArray[i].split("|");
								var key, value;
								key = keyvalue[0].trim();
								if(keyvalue.length == 1) {
									value = key;
								} else {
									value = keyvalue[1].trim();
								}
								$html += '<li class="mui-input-row mui-checkbox">';
								$html += '<label>' + key + '</label>';
								if(value == $config['field_default']) {
									$html += '<input data-label="'+$config['field_title']+'" name="' + $config['field_name'] + '" type="checkbox" checked="checked" value="' + value + '">';
								} else {
									$html += '<input data-label="'+$config['field_title']+'" name="' + $config['field_name'] + '" type="checkbox" value="' + value + '">';
								}
								$html += '</li>';
							}

						}
						break;
					case 'timerpicker':
						/*
						'datetime'	完整日期视图(年月日时分)
						'date'	年视图(年月日)
						'time'	时间视图(时分)
						'month'	月视图(年月)
						'hour'	时视图(年月日时)
						*/
						var format_array = ['datetime','date','time','month','hour'];
						var data_format = $config['field_option'];
						if(data_format == "" || data_format == undefined || data_format == null) {
							data_format = 'date';
						}
						data_format = data_format.toLowerCase();
						if(!contains(format_array,data_format)){
							data_format = 'date';
						}
						//设置默认值
						$html = '<li class="mui-table-view-cell timerpicker" data-format="' + data_format + '">';
						$html += '<input data-label="'+$config['field_title']+'" type="hidden" id="' + $config['field_name'] + '" name = "' + $config['field_name'] + '" value="' + $value + '">';
						$html += '<a class="mui-navigate-right">' + $spanicon + $fieldlabel + '<span class="sun-required"></span>';
						$html += '<span class="mui-right-text" value="" style="color:#000000;">请选择</span>';
						$html += '</a></li>';
						break;
					case 'number':
						if($value == "") {
							$value = 1;
							//数量加减
						}
						$html = '<li class="mui-input-row">';
						$html += '<label>' + $spanicon + $fieldlabel + '</label>';
						$html += '<div class="mui-numbox  data-numbox-min="1">';
						$html += '<button class="mui-btn mui-numbox-btn-minus" style="background:#ffffff;color:#ef742c;" type="button">-</button>';
						$html += '<input data-label="'+$config['field_title']+'" style="background:#ffffff; border-left:none !important; border-right:none !important;"" type="number" min="1" class="mui-numbox-input" id="' + $config['field_name'] + '" name = "' + $config['field_name'] + '" value="' + $value +'"'+ $readonly + '>';
						$html += '<button class="mui-btn mui-numbox-btn-plus" style="background:#ffffff;color:#ef742c;" type="button">+</button>';
						$html += '</div>';
						$html += '</li>';
						break;
					case 'double':
						if($value == ""){
							if($config['field_default']){
								var defaultValue = parseFloat($config['field_default']);
								if(!isNaN(defaultValue)){
									$value = defaultValue;
								}
							}
						}
						$html = '<li class="mui-input-row txtPriceContain">';
						$html += '<label>' + $spanicon + $fieldlabel + '</label>';
						$html += '<input data-label="'+$config['field_title']+'" type="text" class="mui-input-clear" id="' + $config['field_name'] + '" name = "' + $config['field_name'] + '" value="' + $value + '" placeholder="' + $config['field_tips'] +'"'+ $readonly + '>';//'+ $readonly + '
						$html += '</li>';
						break;
					case 'addresssearch':
						var relatedfield = $config['field_related_field'] || '';
						$html = '<li class="mui-input-row">';
						$html += '<label>' + $spanicon + $fieldlabel +'</label>';
						$html += '<input data-label="'+$config['field_title']+'" data-relatedfield="' + relatedfield+ '" type="text" id="' + $config['field_name'] + '" name = "' + $config['field_name'] + '" value="' + $value + '" placeholder="' + $config['field_tips'] + '"'  + $readonly +'>';
						$html += '<span class="addresssearch sun-select-btn mui-icon mui-icon-location"></span>';
						$html += '</li>';
						break;
				}
		}
		return $html;
	},

	htmlFields : function($fieldList,$formType) {
		var that = this;
		that.formType = $formType;
		$html = '<form id="customerForm" class="mui-input-group">';
		$.each($fieldList, function(index, item) {
			$html += that.htmlField(item);
		});
		$html += '</form>';
//		console.log($html);
		return $html;
	},
	/**
	 * 初始化自定义控件
	 */
	initcontrols : function() {
		var self = this;
		//初始化校验规则
		$.sValid.init(self.validparams);
		//
		mui.init();
		var key = _.userInfo.getKey();
		var $cityInfo = _.getCityInfo() || _.getDefaultCityInfo(); //当前城市对象
		var city_id = $cityInfo.area_id;
		$("[readonly]").removeClass('mui-input-clear');
		//只读的不具有清除属性
		mui(".mui-input-clear:not([readonly])").input();
		mui('.mui-numbox').numbox();
		mui('.mui-switch').switch();
		var weekday = [ '周日','周一', '周二', '周三', '周四', '周五', '周六'];
		// 选择套餐
		$('.selecttaocan').on('click', function(){
			var html = '<div id="select-spec" class="hide content" >'+
							'<header id="header" class="mui-bar">'+
								'<i class="back"></i>'+
								'<h1 class="mui-title">选择套餐</h1>'+
							'</header>'+
							'<section class="mui-content">'+
								'<div class="spec"></div>'+
								'<div class="own-search"></div>'+
								'<div class="detail">'+
									
								'</div>'+
							'</section>'+
							'<footer class="mui-bar" id="footer">'+
								'<button type="button" class="mui-btn-yellow">确定选择</button>'+
							'</footer>'+
						'</div>';
			$('body').append(html);
			$('#select-spec').removeClass('hide').siblings('.content').addClass('hide');
			
			var selectType = '';
			// 选择套餐
				$.ajax({
					url: ApiUrl+ '/index.php?act=books&op=getTaoCanDetail',
					type: 'get',
					dataType: 'json',
					data: {
						area_id: city_id,
						gc_id: _.customerField.gc_id
					},
					async: false,
					success: function(result){
						 var data = result.datas;
//						 console.log(data);
						 var itemsHtml = '';
						 selectType = data.custom.select_type;
						 if(selectType == 1){
						 	for(var i in data.items){
						 		if(i == 0){
						 			itemsHtml += '<div class="active" data-items-num = "'+i+'"><p>'+data.items[i].item_name+'</p><p>'+data.items[i].default_price+'元/'+data.items[i].unit+'</p></div>'
						 		}else{
						 			itemsHtml += '<div data-items-num="'+i+'"><p>'+data.items[i].item_name+'</p><p>'+data.items[i].default_price+'元/'+data.items[i].unit+'</p></div>'
						 		}
						 	}
						 }else if(selectType == 2){
						 	for(var i in data.items){
						 		if(i == 0){
						 			itemsHtml = '<dl data-items-num="'+i+'">'
						 			+'<dt><img src="'+data.items[i].item_img+'" /></dt>'
						 			+'<dd style="">'
						 			+'<p>'+data.items[i].item_name+'</p>'
						 			+'<p>'+data.items[i].default_price+'/'+data.items[i].unit+'</p>'
						 			+'<span><em class="left">-</em><i class="qty">0</i><em class="right">+</em><span>'
						 			+'</dd></dl>';
						 		}else{
						 			itemsHtml += '<dl data-items-num="'+i+'">'
						 			+'<dt><img src="'+data.items[i].item_img+'" /></dt>'
						 			+'<dd style="">'
						 			+'<p>'+data.items[i].item_name+'</p>'
						 			+'<p>'+data.items[i].default_price+'/'+data.items[i].unit+'</p>'
						 			+'<span><em class="left">-</em><i class="qty">0</i><em class="right">+</em><span>'
						 			+'</dd></dl>';
						 		}
						 	}
						 }
						 $('#select-spec .spec').html(itemsHtml);
						 console.log(data.custom.is_custom);
						 if(data.custom.is_custom != 0){
						 	$('#select-spec .own-search').show();
						 	var custom = '<p class="left">'+data.custom.custom_name+'<span>(￥'+data.custom.unit_price+'/'+data.custom.unit+')</span></p><p class="right"><input type="number" name="" id="" value="" />'+data.custom.unit+'</p>';
						 	$('#select-spec .own-search').html(custom);
						 }else{
						 	$('#select-spec .own-search').hide();
						 }
						 
						 var detail = '<p class="mui-tips">'+data.custom.custom_desc!='' ? data.custom.custom_desc : '' +'</p>'
						 $('#select-spec .detail').html('<span>温馨提示：</span> '+ detail);
					},
					complete: function(res){
						var data = res.responseJSON.datas;
						var totalPrice = 0;
						var $html1 = '';
						$('#select-spec .spec').on('click', 'dl dd span .left', function(){
							var qty = parseInt($(this).siblings('.qty').html());
						  	console.log(qty)
						  	if(qty > 0){
						  		qty--;
						  		$(this).siblings('i').html(qty);
						  	}
						})
						$('#select-spec .spec dl').on('click', 'dd span .right', function(){
						  	var qty = parseInt($(this).siblings('i').html());
						  	if(qty >= 0){
						  		qty++;
						  		$(this).siblings('i').html(qty);
						  	}
						})
						   
					    $('#select-spec .spec').on('click','div', function(){
					  		$(this).addClass('active').siblings().removeClass('active');
					    })
						$('#select-spec #footer').on('click', 'button', function(){
						  	$('#selecttaocan_detail').show();
						  	if(selectType == 2){
						  		var len = parseInt( $('#select-spec .spec dl').length );
						  		for(var i = len-1;i>=0;i--){
						  			if($('#select-spec .spec dl').eq(i).find('.qty').html() == 0){
						  				data.items.splice(i, 1); 
						  			}else{
						  				data.items[i].qty = $('#select-spec .spec dl').eq(i).find('.qty').html();
						  			}
						  		}
						  		for(var i=0;i<data.items.length;i++){
						  			$html1 += '<dl><dt><img src="'+data.items[i].item_img+'" /></dt>'
									+'<dd><p>'+data.items[i].item_name+'</p><p>'+data.items[i].default_price+'</p><span class="qty">x'+data.items[i].qty+'</span></dd></dl>';
									totalPrice += data.items[i].default_price * data.items[i].qty;
					  			}
						  	}else{
						  		if($('.own-search .right input').val()){
						  			data.items = [];
						  			data.custom.qty = parseInt($('.own-search .right input').val());
						  			$html1 += '<dl><dt><img src="'+data.custom.item_img+'" /></dt>'
								+'<dd><p>'+data.custom.custom_name+'</p><p>'+data.custom.unit_price+'</p><span class="qty">x'+data.custom.qty+'</span></dd></dl>';
								totalPrice = data.custom.unit_price * data.custom.qty;
						  		}else{
						  			var selectitem = $('#select-spec .spec').find('.active').attr('data-items-num');
						  			console.log(selectitem);
						  			for(var i = data.items.length-1;i>=0;i--){
						  				if(i != selectitem){
						  					data.items.splice(i, 1);
						  				}else{
						  					data.items[i].qty = 1;
						  				}
						  			}
						  			for(var i=0;i<data.items.length;i++){
							  			$html1 += '<dl><dt><img src="'+data.items[i].item_img+'" /></dt>'
										+'<dd><p>'+data.items[i].item_name+'</p><p>'+data.items[i].default_price+'</p><span class="qty">x'+data.items[i].qty+'</span></dd></dl>';
										totalPrice += data.items[i].default_price * data.items[i].qty;
						  			}
						  		}
						  	}
							$('#home').removeClass('hide').siblings('.content').addClass('hide');
				  			//  选择后返回显示
				  			
				  			$('#selecttaocan_detail').html($html1);
				  			window.localStorage.setItem('bjspec', JSON.stringify(data));
				  			$('.selecttaocan input').val(JSON.stringify(data));
				  			data_relatedfield = $('.selecttaocan').attr('data-relatedfield');
							if(data_relatedfield){
								$('input[name='+data_relatedfield+']').val(parseInt(totalPrice));
								$('input[name='+data_relatedfield+']').siblings('span').html(parseInt(totalPrice));
							}
						})
						$('.content').on('click', '.back', function(){
							$('#home').removeClass('hide').siblings('.content').addClass('hide');
						})
					},
					error: function(xhr){
						mui.alert('网络错误');
					}
				})
		})
		// 选择档期
		$('.selectdangqi').on('click', function(){
			var html = '<div id="select-time" class=" content hide" >'+
							'<header id="header" class="mui-bar">'+
								'<i class="back"></i>'+
								'<h1 class="mui-title">时间选择</h1>'+
							'</header>'+
							'<section class="mui-content">'+
								'<div class="time">'+
									'<div class="week"></div>'+
									'<div class="hour"></div>'+
								'</div>'+
								'<div class="detail">'+
									'<p class="mui-tips">温馨提示：实际到达时间可能会有30分钟浮动</p>'+
								'</div>'+
							'</section>'+
							'<footer class="mui-bar" id="footer">'+
								'<button type="button" class="mui-btn-yellow">确定选择</button>'+
							'</footer>'+
						'</div>';
			$('body').append(html);
			var index = '';
			$('#select-time').removeClass('hide').siblings('.content').addClass('hide');
			//选择档期
				$.ajax({
					url: ApiUrl + '/index.php?act=seller_work&op=getSellerBusy',
					type: 'get',
					data: {
						gc_id: _.customerField.gc_id,
						key: key
					},
					dataType: 'json',
					success: function(res){
						var data = res.datas.data;
						var date = '';
						for(var i in data){
							if(i==0){
								if(data[i].state==1){
									date += '<div class="active"><p>'+weekday[data[i].week]+'</p><p>'+getTime(data[i].data, '-')+'</p></div>';
									var seller_time = '<div style="display: block;">';
								}else{
									date += '<div class="busy"><p>'+weekday[data[i].week]+'</p><p>'+getTime(data[i].data, '-')+'</p></div>';
									var seller_time = '<div style="display: block;">';
								}
							}else{
								date += '<div class=""><p>'+weekday[data[i].week]+'</p><p>'+getTime(data[i].data, '-')+'</p></div>';
								var seller_time = '<div>';
							}
							for(var j in data[i].seller_time){
								if(j==0){
									if(data[i].seller_time[j].busy==0){
										seller_time += '<span class="active">'+getHour(data[i].seller_time[j].work_time)+'</span>'
									}else{
										seller_time += '<span class="busy">'+getHour(data[i].seller_time[j].work_time)+'</span>'
									}
								}else{
									if(data[i].seller_time[j].busy==0){
										seller_time += '<span>'+getHour(data[i].seller_time[j].work_time)+'</span>'
									}else{
										seller_time += '<span class="busy">'+getHour(data[i].seller_time[j].work_time)+'</span>'
									}
								}
							}
							seller_time += '</div>';
							$('.hour').append(seller_time);
						}
						$('.week').html(date);
						
						$('.week').on('click', 'div', function(){
							index = $(this).index();
							if($(this).hasClass('busy')){
								mui.alert('改时间已有预约，请选择其他时间！');
								return false;
							}else{
								$(this).addClass('active').siblings().removeClass('active');
								$('.hour').find('div').eq(index).css('display', 'block').siblings().css('display', 'none');
							}
						})
						
						if($('.week div').hasClass('active')){
							var index1 = $('.week').find('.active').index();
							$('.hour').find('div').eq(index1).css('display', 'block').siblings().css('display', 'none');
						}
						$('.hour div').on('click','span', function(){
							if($(this).hasClass('busy')){
								mui.alert('改时间已有预约，请选择其他时间！');
								return false;
							}else{
								$(this).addClass('active').siblings().removeClass('active');	
							}
						})
					},
					complete: function(){
						$('#select-time #footer').on('click', 'button', function(){
								var year = new Date().getFullYear();
								var date = $('#select-time .week').find('.active').find('p').eq(1).html();
								var time = $('#select-time .hour').find('div').eq(index).find('.active').html();
								$('.selectdangqi input').val(year+'-'+date+' '+time);
								$('.selectdangqi .mui-right-text').html(year+'-'+date+' '+time);
								$('#home').removeClass('hide').siblings('.content').addClass('hide');
								window.localStorage.setItem('bjdangqi', year+'-'+date+' '+time, 24);
			 			})
						$('.content').on('click', '.back', function(){
							$('#home').removeClass('hide').siblings('.content').addClass('hide');
						})
					}
				})
		});
		function getTime(time,format){
			var time = new Date(time*1000);
			return (time.getUTCMonth()+1) + format + time.getUTCDate()
		}
		function getHour(time){
			var hour = new Date(time*1000).getHours();
			var minutes = new Date(time*1000).getMinutes();
			if(minutes == 0){
				return hour+':00';
			}else{
				return hour+':'+minutes;
			}
		}
		//初始化PopPicker
		$('.selectpicker').each(function() {
			var that = $(this);
			var data_options = that.attr("data-options");
			var data_relatedfield = that.attr("data-relatedfield");
			var picker = new mui.PopPicker();
			picker.setData(JSON.parse(data_options));
			var el = that.find('a span.mui-right-text');
			that.on('tap', function() {
				picker.show(function(items) {
					//el.val(items[0].value);
					el.text(items[0].text);
					//下拉框直接赋值为text，不使用value
					that.children('input[type="hidden"]').val(items[0].text);
					//that.children('input[type="hidden"]').val(items[0].value);
					if(data_relatedfield){
						$('#'+data_relatedfield).val(items[0].value);
					}
				});
			})
		})

		//初始化datePicker
		$('.timerpicker').each(function() {
			
			var that = $(this);
			var data_format = that.attr("data-format");
			var begindate=new Date();
			var extOptions = {};
			//目前日期扩展选项中加入了minHours,maxHours来限制每天的最早，最晚小时
			switch (self.type_id){
				case '19'://保洁
					begindate.setDate(begindate.getDate()+2);
					begindate.setHours(0);
					extOptions = {minHours:8,maxHours:18};
				case '33'://搬家
					begindate.setHours(begindate.getHours()+2);
				default:
					break;
			}
			var options = {
				type: data_format,
				beginDate: begindate//设置开始日期
			};
			$.extend(options, extOptions);
			var dtPicker = new mui.DtPicker(options);
			var el = that.find('a span.mui-right-text');
			that.on('tap', function() {
				dtPicker.show(function(item) {
					//console.log(item);
					el.val(item.value);
					el.text(item.text);
					that.children('input[type="hidden"]').val(item.value);
				});
			})
		})
		var uploadUrl,file_name,file_url;
		switch (self.formType){
			case 1:
				//预约
				uploadUrl = ApiUrl + "/index.php?act=upload_img&op=image_upload_books";
				file_name = 'name';
				file_url  = 'thumb_name';
				break;
			case 2:
				//需求
				uploadUrl = ApiUrl + "/index.php?act=upload_img&op=image_upload_needs";
				file_name = 'name';
				file_url  = 'thumb_name';
				break;
			default:
				//普通 使用个人相册
				uploadUrl = ApiUrl + "/index.php?act=sns_album&op=file_upload";
				file_name = 'file_name';
				file_url  = 'file_url';
				break;
		}
		//初始化单图片上传
		$('.sun-photo-add.single input[type="file"]').ajaxUploadImage({
			url : uploadUrl,
			data:{
	                key:key,
	                name:"file"
	            },
            start :  function(element){
            	//loading...
            	 element.after('<div class="upload-loading"><i></i></div>');
            	 element.siblings('img').remove();
            },
            success : function(element, result){
            	//close loading...
            	element.siblings('.upload-loading').remove();
                checkLogin(result.login);
                if (result.error) {
                    mui.alert('图片尺寸过大！','提示','确定');
                    return false;
                }
                var el = '<img src="'+result.datas[file_url]+'"/>';
                element.after(el);
                element.parent().siblings('input[type="hidden"]').val(result.datas[file_name]);
            }
		})
		//初始化多图片上传TODO 图片数量限制
		$('.sun-photo-add.multi input[type="file"]').ajaxUploadImage({
			url : ApiUrl + "/index.php?act=upload_img&op=image_upload_needs",
			data:{
	                key:key,
	                name:"file"
	            },
            start :  function(element){
            	//loading...
            	 element.after('<div class="upload-loading"><i></i></div>');
            },
            success : function(element, result){
            	//close loading...
            	element.siblings('.upload-loading').remove();
                checkLogin(result.login);
                if (result.error) {
                    mui.alert('图片尺寸过大！','提示','确定');
                    return false;
                }
                var fieldname = element.parent().parent().attr('name');
                var el = '<li class="sun-photo-simp"><input type="hidden" name='+fieldname+'[] value="'+result.datas[file_name] +'"> <img src="'+result.datas[file_url]+'"/><span class="sun-photo-close mui-icon mui-icon-closeempty"></span></li>';
                element.parent().before(el);
                $('.sun-photo-close').on('click',function(){
                	$(this).parent().remove();
                })
            }
		})
		//初始化地图选择控件
		$('.addresssearch').each(function(){
			var $this = $(this);
			var $input = $this.parent().children('input');
			var data_relatedfield = $input.attr("data-relatedfield");
			var eventName = 'fill_address_'+$input.attr('id');
			window.addEventListener(eventName, function(event) {
				var $param = event.detail;
				$input.val($param.title || '');
				$input.attr('city',$param.city || '');
				$input.attr('district',$param.district || '');
				$input.attr('address',$param.address || '');
				$input.attr('lng',$param.lng || '');
				$input.attr('lat',$param.lat || '');
				if(data_relatedfield){
					$('#'+data_relatedfield).val($param.address);
				}
			});
			$this.on('tap', function() {
				window.location.href ="address_select_map.html?eventName="+eventName;
			});
	})
		//初始化地址选择
		$('.sun_address_select').each(function(){
			var $this = $(this);
			var $input = $this.children('input');
			var eventName = 'fill_address_'+$input.attr('id');
			if(window.localStorage.getItem('address_from')){
				var $param = JSON.parse(window.localStorage.getItem('address_from')) ;
				$input.val(($param.address || ''));
				$input.attr('city',$param.city || '');
				$input.attr('district',$param.district || '');
				$input.attr('title',$param.title || '');
				$input.attr('address',$param.address || '');
				$input.attr('lng',$param.lng || '');
				$input.attr('lat',$param.lat || '');
			}
			$this.on('tap', function() {
				window.location.href ='address_select_map.html';
			});
		})
	},
	//处理预约中传递过来的替换字段
	/*
	goodsparam.goodsid = goods_id;
	goodsparam.gc_id = gc_id;
	goodsparam.goods_price = goods_amount;
	goodsparam.goods_amount = goods_amount;
	goodsparam.goods_unit = '';
	goodsparam.goods_qty = 1;
	goodsparam.spec = {
		spec_name: {
			"2": "服务内容",
			"5": "时长"
		},
		spec_value: {
			"2": "专业婴儿看护",
			"5": "12小时"
		}
	};
	*/
	updateBooksFieldsValue : function($fieldList,$booksparam){
		// 详情传值  重新对表单赋值
		$.each($fieldList, function(index, item) {
			$fieldName = item['field_name'];
			switch ($fieldName){
				case 'spec':
				case 'books_price':
				case 'books_unit':
				case 'books_qty':
				case 'books_amount':
					item['value'] = $booksparam[$fieldName];
//					console.log(item);
					break;
				default:
					break;
			}
		});
//		console.log($fieldList);
	},
	//返回表单数据
	processdata:function(){
		var that = this;
		var _form_param = $('#customerForm').serializeArray();
//		console.log(_form_param);
        var param = {};
        _.debug(_form_param);
        param.key = _.userInfo.getKey();
		param.gc_id = that.gc_id;
        for (var i=0; i<_form_param.length; i++) {
        	var field_name = _form_param[i].name;
        	var field_value = _form_param[i].value;
        	switch (field_name){
        		case 'address_from':
        		case 'address_to':
        			var $input = $('#'+field_name);
        			var $input_detail = $('#'+field_name+'_detail');
        			field_value = ($input.attr('city') || '') + '|' +($input.attr('district') || '')  + '|' + ($input.attr('title') || '') + '|' + ($input.attr('address') || '') + '|' + ($input_detail.val() || '') + '|' + ($input.attr('lng') || '') + ',' + ($input.attr('lat') || '');
        			break;
        		default:
        			break;
        	}
        	//对待input name 中带有中括号的处理
        	if(field_name.indexOf('[')>0){
        		var leftindex = field_name.indexOf('[');
        		var inputname = field_name.substring(0,leftindex);
        		var inputkey = field_name.substring(leftindex+1,field_name.length-1);
        		var inputObject = {};
        		inputObject[inputkey] = field_value;
        		if(param[inputname] == undefined){
        			param[inputname] = [];
        		}
        		param[inputname].push(inputObject);
        		continue;
        	}
			param[field_name] = field_value;
        }
        //加入地区参数
        var $cityInfo = _.getCityInfo() || _.getDefaultCityInfo(); //当前城市对象
		var city_id = $cityInfo.area_id;
		param['city_id_from'] = city_id;
        return param;
	},
	//处理带标签的表单数据，用于回显
	processlabeldata:function(){
		var that = this;
		var _form_param = $('#customerForm').serializeArray();
		//_.debug(_form_param);
        var param = {};
        var labelparam = [];
        param.key = _.userInfo.getKey();
		param.gc_id = that.gc_id;
		var paramlenth = _form_param.length;
        for (var i=0; i<paramlenth; i++) {
            var field_name = _form_param[i].name;
        	var field_value = _form_param[i].value;
        	switch (field_name){
        		case 'address_from':
        		case 'address_to':
        			var $input = $('#'+field_name);
        			var $input_detail = $('#'+field_name+'_detail');
        			field_value = ($input.attr('city') || '') + '|' +($input.attr('district') || '')  + '|' + ($input.attr('title') || '') + '|' + ($input.attr('address') || '') + '|' + ($input_detail.val() || '') + '|' + ($input.attr('lng') || '') + ',' + ($input.attr('lat') || '');
        			break;
        		default:
        			break;
        	}
        	//对待input name 中带有中括号的处理
        	if(field_name.indexOf('[')>0){
        		var leftindex = field_name.indexOf('[');
        		var inputname = field_name.substring(0,leftindex);
        		var inputkey = field_name.substring(leftindex+1,field_name.length-1);
        		var inputObject = {};
        		inputObject[inputkey] = field_value;
        		if(param[inputname] == undefined){
        			param[inputname] = [];
        		}
        		param[inputname].push(inputObject);
        		continue;
        	}
			param[field_name] = field_value;
        }
        //加入地区参数
        var $cityInfo = _.getCityInfo() || _.getDefaultCityInfo(); //当前城市对象
		var city_id = $cityInfo.area_id;
		param['city_id_from'] = city_id;
          _.debug(param);
        //表单提交参数和显示参数分开处理
        var sp_name_length = 'sp_name'.length;
        for (var i=0; i<paramlenth; i++) {
        	var field_name = _form_param[i].name;
        	var field_value = _form_param[i].value;
        	var label = $('[name="'+field_name+'"]').attr('data-label');
        	var isspec = (field_name.indexOf('sp_name[')==0)?true:false;
        	if(isspec){
	        	if(i<paramlenth-1){
	        		var field_next_name = _form_param[i+1].name;
	        		if(field_next_name.indexOf('sp_val[')==0){
	        			var spec_value_name = 'sp_val'+field_name.substr(sp_name_length);
	        			var spec_value = $('[name="'+spec_value_name+'"]').val();
	            		labelparam.push({label:label,value:spec_value});
	            		i++;
	            		continue;
	        		}
	        	}
        	} else {
        		if(field_name == 'address_from' || field_name == 'address_to'){
        			var $input = $('#'+field_name);
        			var $input_detail = $('#'+field_name+'_detail');
        			field_value = ($input.attr('title') || '') + ($input_detail.val() || '');
        		}
        		/* @description 预约时间到小时的增加处理（原 2017-07-19 10  改为2017-07-19 10:00）
	        	 * @author zhaobing
	        	 * @version 2017年7月19日10:57:11
	        	 * TODO hwh 这个时间字段应该根据字段类型来处理，不应该根据字段名称处理
	        	 */
	        	if(field_name == 'books_time_from'){
	        		var $inputPar = $('#'+field_name).parent();
	        		if('hour' == $inputPar.data('format')){
	        			field_value = field_value==''?'':(field_value+':00')
	        		}
	        	}
        	}
        	
        	labelparam.push({label:label,value:field_value});
            //labelparam[label] = _form_param[i].value;
        }
        var data = {};
        data.param = param;
        data.labelparam = labelparam;
        return data;
	}
}