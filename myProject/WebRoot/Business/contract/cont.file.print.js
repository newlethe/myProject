var isSave = true;// 目前不需要保存功能，暂时设置为true
var isPrint = false;
var obj;
var _bean;
Ext.onReady(function() {
			var printBtn = new Ext.Button({
						text : '关联数据',
						iconCls : 'print',
						handler : doPrintData
					});

			var printDocBtn = new Ext.Button({
						text : '连接打印机',
						iconCls : 'print',
						handler : printDoc
					});

			var saveBtn = new Ext.Button({
						text : '保存文档',
						iconCls : 'save',
						handler : doSaveDate
					});

			var panel = new Ext.Panel({
						id : "docpanel",
						region : "center",
						border : false,
						split : true,
						contentEl : 'ocxDic',
						tbar : ['-', '<font color=#15428b><B>文档数据打印<B></font>',
								'-', printBtn]
					});
			var viewport = new Ext.Viewport({
						layout : 'fit',
						border : false,
						items : [panel]
					});

			if (_save)
				Ext.getCmp("docpanel").getTopToolbar().add('-', saveBtn);
			Ext.getCmp("docpanel").getTopToolbar().add('-', printDocBtn);
			init();
		});

window.onbeforeunload = function() {
	if (isPrint && !isSave) {
		alert("文档已经打印成功，但是还没有保存，确认离开此页面吗？");
		return;
	}
	if (isSave){
		window.returnValue = "true";
	}
}

function init() {
	displayOCX(true);
	TANGER_OCX_OpenDoc(_basePath + "/servlet/FlwServlet?ac=loadDoc", _fileid);
	TANGER_OCX_SetReadOnly(false);//开放用户修改
}

function doSaveDate() {
	if (_hasfile == "false" && !isPrint) {
		alert('请先关联文档数据！');
		return;
	}
	TANGER_OCX_SetReadOnly(false);
	var url = _basePath + '/servlet/ConServlet?ac=saveDoc';
	var params = 'fieldname=' + _fieldname + '&uids=' + _uids + '&fileid='
			+ _fileid + '&hasfile=' + _hasfile;
	var filename;
	if (_filetype == "contPayApply") {
		filename = "付款申请单";
	} else if (_filetype == "contPayInvoice") {
		filename = "增值税专用发票收据单";
	}
	var outHTML = document.all("TANGER_OCX").SaveToURL(url, 'EDITFILE', params,
			filename);
	alert('文档数据保存成功！');
	isSave = true;
}

function printDoc() {
	TANGER_OCX_PrintDoc();
}

function doPrintData() {
	TANGER_OCX_SetReadOnly(false);
	if (_filetype == "contPayApply") {
		// 付款申请单
		_bean = "com.sgepit.pmis.contract.hbm.ConPayApplyView";
	} else if (_filetype == "contPayInvoice") {
		// 增值税专用发票收具单
		_bean = "com.sgepit.pmis.contract.hbm.ConPayApplyView";
	} else {
		alert("需要关联的数据错误！")
		return;
	}
	DWREngine.setAsync(false);

	baseMgm.findById(_bean, _uids, function(object) {
				obj = object;
			});
	DWREngine.setAsync(true);
	ocxBookMarks = TANGER_OCX_OBJ.activeDocument.BookMarks;
	for (var o in obj) {
		for (var i = 0; i < ocxBookMarks.Count; i++) {
			var bookmark = ocxBookMarks(i + 1).Name;
			if (bookmark == o.toUpperCase()) {
				TANGER_OCX_OBJ.SetBookmarkValue(bookmark, obj[o]);
			}
		}
	}
	switch (_filetype) {
		case "contPayApply" :
			printData_applyAndInvoice();
			isPrint = true;
			break;
		case "contPayInvoice" :
			printData_applyAndInvoice();
			isPrint = true;
			break;
		default :
			break;
	}
	if (isPrint) {
		alert('文档数据打印成功！');
		TANGER_OCX_SetReadOnly(false);
	}
}

//付款申请单和增值税专用发票收具单日期、用户名、部门书签一样
function printData_applyAndInvoice() {
	var date = obj['nowdate'];
	var dateArray = date.split("-");
	TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("YYYY"), dateArray[0]);
	TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("MM"), dateArray[1]);
	TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("DD"), dateArray[2]);
	TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("REALNAME"), REALNAME);//当前用户名字
	TANGER_OCX_OBJ.SetBookmarkValue(ocxBookMarks("USERPOSNAME"), USERPOSNAME);//当前用户所在部门
	if (ocxBookMarks.Exists("PAYMONEYGBK")) {
		TANGER_OCX_OBJ.SetBookmarkValue("PAYMONEYGBK", number2num1(obj['paymoney'],"test"));//大写金额字符串
	}
}

// 人民币金额转大写程序
function number2num1(strg, obj) {
	var number = Math.round(strg * 100) / 100; // 取2位小数
	number = number.toString(10).split("."); // 拆分整数和小数部分
	var a = number[0]; // 取整数部分
	if (a.length > 12) {
		obj.value = obj.value.substring(0, 12);
		return "数值超出范围！支持的最大数值为 999999999999.99";
	} else {
		var e = "零壹贰叁肆伍陆柒捌玖";
		var num1 = "";
		var len = a.length - 1;
		for (var i = 0; i <= len; i++)
			num1 += e.charAt(parseInt(a.charAt(i)))
					+ [["圆", "万", "亿"][Math.floor((len - i) / 4)], "拾", "佰",
							"仟"][(len - i) % 4];
		if (number.length == 2 && number[1] != "") { // 判断有无小数部分，以下对小数部分进行处理
			var a = number[1];
			for (var i = 0; i < a.length; i++)
				num1 += e.charAt(parseInt(a.charAt(i))) + ["角", "分"][i];
		}
		num1 = num1.replace(/零佰|零拾|零仟|零角/g, "零");
		num1 = num1.replace(/零{2,}/g, "零");
		num1 = num1.replace(/零(?=圆|万|亿)/g, "");
		num1 = num1.replace(/亿万/, "亿");
		num1 = num1.replace(/^圆零?/, "");
		if (num1 != "" && !/分$/.test(num1))
			num1 += "整";
		return num1;
	}
}
