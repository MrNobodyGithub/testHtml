/*
 *此框架只依赖zepto.js,修改为依赖jQuery
 *sDialog 是dialog弹出框
 */
(function($) {
	$.extend($, {
		sDialog: function(options) {
			//dialog弹出框
			var opts = $.extend({}, $.sDialog.defaults, options);

			function _init() {
				var mask_height = ($("body").height() > $(window).height()) ? $("body").height() : $(window).height();
				var windowH = parseInt($(window).height());
				var warpTop = windowH / 2;
				var dTmpl = '<div class="simple-dialog-wrapper">';
				if(opts.lock) { //是否有锁定
					dTmpl += '<div class="s-dialog-mask" style="height:' + mask_height + 'px;"></div>';
				}
				dTmpl += '<div style="left: 50%; top:' + warpTop + 'px" class="s-dialog-wrapper s-dialog-skin-' + opts.skin + '">' + '<div class="s-dialog-content">' + opts.content + '</div>'
				if(opts.okBtn || opts.cancelBtn) {
					dTmpl += '<div class="s-dialog-btn-wapper">';
					if(opts.okBtn) {
						dTmpl += '<a href="javascript:void(0)" class="s-dialog-btn-ok">' + opts.okBtnText + '</a>';
					}
					if(opts.cancelBtn) {
						dTmpl += '<a href="javascript:void(0)" class="s-dialog-btn-cancel">' + opts.cancelBtnText + '</a>';
					}
					dTmpl += '</div>';
				}
				dTmpl += '</div>';
				dTmpl += '</div>';
				$("body").append(dTmpl);
				var d_wrapper = $(".s-dialog-wrapper");
				var mLeft = -parseInt(d_wrapper.width()) / 2;
				d_wrapper.css({
					"margin-left": mLeft,
				});
				//绑定事件
				_bind();
			}

			function _bind() {
				var okBtn = $(".s-dialog-btn-ok");
				var cancelBtn = $(".s-dialog-btn-cancel");
				okBtn.click(_okFn);
				cancelBtn.click(_cancelFn);
				if(!opts.okBtn && !opts.cancelBtn) {
					setTimeout(function() {
						_close();
					}, opts.autoTime);
				}
			}

			function _okFn() {
				opts.okFn();
				_close();
			}

			function _cancelFn() {
				opts.cancelFn();
				_close();
			}

			function _close() {
				$(".simple-dialog-wrapper").remove();
			}
			return this.each(function() {
				_init();
			})();
		},
		sValid: function() {
			var $this = $.sValid;
			var sElement = $this.settings.sElement;
			for(var i = 0; i < sElement.length; i++) {
				var element = sElement[i];
				var sEl = $("#" + element).length > 0 ? $("#" + element) : $("." + element);
				for(var j = 0; j < sEl.length; j++) {
					$this.check(element, sEl[j]);
					//如果有错误就退出，并且有错误
					if($this.settings["breakOnError"] && $this.errorFiles['eId'].length >0){
						break;
					}
				}
			}
			$this.callBackData();
			var cEid = $this.errorFiles.eId;
			var cEmsg = $this.errorFiles.eMsg;
			var cErules = $this.errorFiles.eRules;
			var isVlided = false;
			if(cEid.length > 0) {
				isVlided = false;
			} else {
				isVlided = true;
			}
			//首个错误就退出，变更简单的回调方法
			if($this.settings["breakOnError"]){
				var isError = false, errorMsg;
				if (cEid.length>0){
					isError = true;
					var item = cEid[0];
					var rule = cErules[item][0];
					errorMsg = cEmsg[item+'_'+rule];
				}
				$this.settings.callback.apply(this, [isError, errorMsg]);
			} else {
				$this.settings.callback.apply(this, [cEid, cEmsg, cErules]);	
			}
			

			$this.destroyData();
			return isVlided;
		}
	});
	//sDialog
	$.sDialog.defaults = {
		autoTime: '2000', //当没有 确定和取消按钮的时候，弹出框自动关闭的时间
		"skin": 'block', //皮肤，默认黑色
		"content": "我是一个弹出框", //弹出框里面的内容
		"width": 100, //没用到
		"height": 100, //没用到
		"okBtn": true, //是否显示确定按钮
		"cancelBtn": true, //是否显示确定按钮
		"okBtnText": "确定", //确定按钮的文字
		"cancelBtnText": "取消", //取消按钮的文字
		"lock": true, //是否显示遮罩
		"okFn": function() {}, //点击确定按钮执行的函数
		"cancelFn": function() {} //点击取消按钮执行的函数
	};
	//sValid
	$.extend($.sValid, {
		defaults: {
			breakOnError:false,//首次错误就退出
			rules: {},
			messages: {},
			callback: function() {}
		},
		init: function(options) {
			//初始化控件参数
			var opt = $.extend({}, this.defaults, options);
			var rules = opt.rules;
			var messages = opt.messages;
			var sElement = [];
			$.map(rules, function(item, idx) {
				sElement.push(idx);
			});
			this.settings = {};
			this.settings["breakOnError"] = opt.breakOnError;
			this.settings["sElement"] = sElement;
			this.settings["sRules"] = rules;
			this.settings["sMessages"] = messages;
			this.settings['callback'] = opt.callback;
		},
		optional: function(element) {
			var val = this.elementValue(element);
			return !this.methods.required.call(this, val, element);
		},
		methods: {
			required: function(value, element) {
				if(element.nodeName.toLowerCase() === "select") {
					var val = $(element).val();
					return val && val.length > 0;
				}
				return $.trim(value).length > 0;
			},
			//字符长度
			maxlength: function(value, element, param) {
				var length = $.trim(value).length;
				return this.optional(element) || length <= param;
			},
			minlength: function(value, element, param) {
				var length = $.trim(value).length;
				return this.optional(element) || length >= param;
			},
			//长度校验
			length:  function(value, element, param) {
				var length = $.trim(value).length;
				return this.optional(element) || length == param;
			},
			//数字大小
			max: function(value, element, param) {
				var inputvalue = parseFloat(value)
				return this.optional(element) || inputvalue <= param;
			},
			min: function(value, element, param) {
				var inputvalue = $.trim(value).length;
				return this.optional(element) || inputvalue >= param;
			},
			//是否是合法数字（包括正数、负数）
			number: function(value, element, param) {
				return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
			},
			digits: function(value, element, param) {
				return this.optional(element) || /^\d+$/.test(value);
			},
			email: function(value, element, param) {
				return this.optional(element) || /^[a-z0-9-]{1,30}@[a-z0-9-]{1,65}(\.[a-z0-9-]{1,65})*$/.test(value);
			},
			mobile: function(value, element, param) {
				return this.optional(element) || /^(1{1})+\d{10}$/.test(value);
			},
			phone: function(value, element, param) {
				return this.optional(element) || /^(([0-9]{2,3})|([0-9]{3}-))?((0[0-9]{2,3})|0[0-9]{2,3}-)?[1-9][0-9]{6,7}(-[0-9]{1,4})?$/.test(value);
			},
			url: function(value, element, param) {
				return this.optional(element) || /^http[s]?:(\/){2}[A-Za-z0-9]+.[A-Za-z0-9]+[\/=?%-&_~`@\\[\]':+!]*([^<>\"\"])*$/.test(value);
			},
			currency: function(value, element, param) {
				return this.optional(element) || /^[0-9]+(\.[0-9]+)?$/.test(value);
			},
			zip: function(value, element, param) {
				return this.optional(element) || /^[0-9][0-9]{5}$/.test(value);
			},
			qq: function(value, element, param) {
				return this.optional(element) || /^[1-9][0-9]{4,12}$/.test(value);
			},
			integer: function(value, element, param) {
				return this.optional(element) || /^[-+]?[0-9]+$/.test(value);
			},
			integerpositive: function(value, element, param) {
				return this.optional(element) || /^[+]?[0-9]+$/.test(value);
			},
			double: function(value, element, param) {
				return this.optional(element) || /^[-+]?[0-9]+(\.[0-9]+)?$/.test(value);
			},
			doublepositive: function(value, element, param) {
				return this.optional(element) || /^[+]?[0-9]+(\.[0-9]+)?$/.test(value);
			},
			english: function(value, element, param) {
				return this.optional(element) || /^[A-Za-z]+$/.test(value);
			},
			chinese: function(value, element, param) {
				return this.optional(element) || /^[\x80-\xff]+$/.test(value);
			},
			username: function(value, element, param) {
				return this.optional(element) || /^[A-Za-z0-9\x4e00-\x9fa5_]/.test(value);
			},
			nochinese: function(value, element, param) {
				return this.optional(element) || /^[A-Za-z0-9_-]+$/.test(value);
			},
			equalTo: function(value, element, param) {
				return this.optional(element) || value === $(param).val();
			},
			//身份证
			idcard: function(value, element, param) {
				return this.optional(element) || this.checkIdcard(value) === 'ok';
			}
		},
		checkIdcard: function(idcard) {
			var Errors = new Array(
				"ok",
				"身份证号码位数不对!",
				"身份证号码出生日期超出范围或含有非法字符!",
				"身份证号码校验错误!",
				"身份证地区非法!"
			);
			var area = {
				11: "北京",
				12: "天津",
				13: "河北",
				14: "山西",
				15: "内蒙古",
				21: "辽宁",
				22: "吉林",
				23: "黑龙江",
				31: "上海",
				32: "江苏",
				33: "浙江",
				34: "安徽",
				35: "福建",
				36: "江西",
				37: "山东",
				41: "河南",
				42: "湖北",
				43: "湖南",
				44: "广东",
				45: "广西",
				46: "海南",
				50: "重庆",
				51: "四川",
				52: "贵州",
				53: "云南",
				54: "西藏",
				61: "陕西",
				62: "甘肃",
				63: "青海",
				64: "宁夏",
				65: "新疆",
				71: "台湾",
				81: "香港",
				82: "澳门",
				91: "国外"
			}
			var idcard, Y, JYM;
			var S, M;
			var idcard_array = new Array();
			idcard_array = idcard.split("");
			if(area[parseInt(idcard.substr(0, 2))] == null) return Errors[4];
			switch(idcard.length) {
				case 15:
					if((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
						ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;
					} else {
						ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;
					}
					if(ereg.test(idcard)) return Errors[0];
					else return Errors[2];
					break;
				case 18:
					if(parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
						ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式 
					} else {
						ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式 
					}
					if(ereg.test(idcard)) {
						S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 +
							(parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 +
							(parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 +
							(parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 +
							(parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 +
							(parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 +
							(parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 +
							parseInt(idcard_array[7]) * 1 +
							parseInt(idcard_array[8]) * 6 +
							parseInt(idcard_array[9]) * 3;
						Y = S % 11;
						M = "F";
						JYM = "10X98765432";
						M = JYM.substr(Y, 1);
						if(M == idcard_array[17]) return Errors[0];
						else return Errors[3];
					} else return Errors[2];
					break;
				default:
					return Errors[1];
					break;
			}
		},
		elementValue: function(element) {
			var type = $(element).attr("type");
			var value = $(element).val();
			if(typeof value === "string") {
				return value.replace(/\r/g, "");
			}
			return value;
		},
		rulesFormat: {
			required: true,
			email: true
		},
		errorFiles: {
			eId: [],
			eRules: {},
			eMsg: {}
		},
		check: function(element, mEl) {
			var settingsRules = [];
			var breakOnError = this.settings["breakOnError"];
			var methods = this.methods;
			var rules = this.settings["sRules"];
			var mVal = this.elementValue.call(this, mEl);
			var mParam = [];
			var errorFiles = this.errorFiles;
			var errRules = [];
			//rules
			if(typeof rules[element] === "string") {
				if($.inArray(rules[element], settingsRules) < 0) {
					settingsRules.push(rules[element]);
				}
			} else {
				$.each(rules[element], function(idx, item) {
					if($.inArray(idx, settingsRules) < 0) {
						settingsRules.push(idx);
						if(idx == "maxlength" || idx == "minlength" || idx == "length") {
							mParam.push(parseInt(item));
						} else if(idx == "max" || idx == "min") {
							mParam.push(parseFloat(item));
						}else {
							mParam.push(item);
						}
					}
				})
			}
			//checked
			for(var i = 0; i < settingsRules.length; i++) {
				if(!methods[settingsRules[i]].call(this, mVal, mEl, mParam[i])) {
					errRules.push(settingsRules[i]);
					errorFiles['eRules'][element] = errRules;
					if($.inArray(element, errorFiles['eId']) < 0) {
						errorFiles['eId'].push(element);
					}
					//如果有错误就退出并且有错误
					if(breakOnError && errorFiles['eId'].length >0){
						break;
					}
				}
			}
		},
		callBackData: function() {
			var errorFiles = this.errorFiles;
			var errId = errorFiles.eId;
			var eMsg = errorFiles.eMsg;
			var eRules = errorFiles.eRules;
			var sMessages = this.settings.sMessages;
			for(var i = 0; i < errId.length; i++) {
				if(typeof sMessages[errId[i]] === "string") {
					eMsg[errId[i] + "_" + eRules[errId[i]]] = sMessages[errId[i]];
				} else {
					if($.isArray(eRules[errId[i]])) {
						for(var j = 0; j < eRules[errId[i]].length; j++) {
							eMsg[errId[i] + "_" + eRules[errId[i]][j]] = sMessages[errId[i]][eRules[errId[i]][j]]
						}
					}
				}
			}
		},
		destroyData: function() {
			this.errorFiles = {
				eId: [],
				eRules: {},
				eMsg: {}
			};
		}
	});
})(jQuery);