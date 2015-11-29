// 材料入库新增或修改
var formPanel;
var noticeArr = new Array();
var beanCon = "com.sgepit.pmis.contract.hbm.ConOve";
var bean = "com.sgepit.pmis.wzgl.hbm.WzGoodsStoreinEstimate";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "uids";

// 材料入库详细信息清单
var beanSub = "com.sgepit.pmis.wzgl.hbm.WzGoodsStoreinEstimateSub";
var businessSub = "baseMgm";
var listMethodSub = "findWhereOrderby";
var primaryKeySub = "uids";
var orderColumnSub = "uids";
var selectUuid = "";
var selectConid = "";
var selectTreeid = "";
var getKxNotice = "";

var pid = CURRENTAPPID;
var dsSub;
var whereSql = "";
var warehouseManDs = new Array();
var equWareArr = new Array();
var equTypeArr = new Array();
var joinUnitArr = new Array();
var equidS = new Array();

var gridPanelFj;
var formPanel;
var equnoComboBox = "";
var formPanelSub;
var noticeWinSub;

Ext.onReady(function() {

	// 处理设备仓库下拉框
	DWREngine.setAsync(false);
	var typeArr = new Array();
	baseMgm.getData("select wareno,waretype from equ_warehouse where pid='"
					+ CURRENTAPPID + "' and parent='01' order by equid ",
			function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					typeArr.push(temp);
				}
			});
	baseMgm.getData(
			"select uids,equid,equno,wareno,waretype from equ_warehouse where pid='"
					+ CURRENTAPPID + "' order by equid ", function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					temp.push(list[i][2]);
					for (var j = 0; j < typeArr.length; j++) {
						if (list[i][3] == typeArr[j][1]) {
							temp.push(typeArr[j][0]);
						}
					}
					// if(list[i][3]=="SBCK")
					// temp.push("设备仓库");
					// else if(list[i][3]=="CLCK")
					// temp.push("材料仓库")
					// else if(list[i][3]=="JGCK")
					// temp.push("建管仓库")
					equWareArr.push(temp);

				}
			});

	// 材料类型equTypeArr
	appMgm.getCodeValue("材料合同树分类", function(list) {
				for (i = 0; i < list.length; i++) {
					if (list[i].propertyCode == "4")
						continue;
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					equTypeArr.push(temp);
				}
			});

	// 合同分类二（财务）
	var conno2cw = new Array();
	appMgm.getCodeValue("合同财务划分类型", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					conno2cw.push(temp);
				}
			});

	// 主体设备参与单位
	appMgm.getCodeValue("主体设备参与单位", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].detailType);
					joinUnitArr.push(temp);
				}
			});
	// 获取仓库号的仓库分类，用于判断仓库号子节点的判断
	baseMgm.getData("select equid from equ_warehouse where parent='01'",
			function(list) {
				for (var i = 0; i < list.length; i++) {
					if (list[i] != null && list[i] != "") {
						var temp = new Array();
						temp.push(list[i]);
						equidS.push(temp);
					}
				}

			})

	DWREngine.setAsync(true);

	// 材料仓库系统编码下来框
	var getEquid = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : equWareArr
			});

	// 处理材料仓库仓库管理员
	DWREngine.setAsync(false);
	baseMgm.getData("select t.realname from rock_user t " + "where t.unitid ='"
					+ pid + "' and t.dept_id='03' ", function(list) {
				for (var i = 0; i < list.length; i++) {
					if (list[i] != null && list[i] != "") {
						var temp = new Array();
						temp.push(list[i]);
						temp.push(list[i]);
						warehouseManDs.push(temp);
					}
				}

			})

	var getArray = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : warehouseManDs
			});

	// 主体设备参与单位下来框
	var getJoinUnit = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : joinUnitArr
			});
	// 材料开箱通知单选择窗口
	var chooseBtn = new Ext.Button({
				id : 'addBtn',
				text : '选择',
				iconCls : 'btn',
				handler : chooseFun
			});

	var noticeWin = new Ext.Window({
				width : 900,
				height : 420,
				tbar : ['<font color=#15428b><B>开箱检验单<B></font>', '->',
						chooseBtn],
				modal : true,
				plain : true,
				border : false,
				resizable : false,
				layout : 'fit',
				closeAction : 'hide',
				items : [gridPanelNotice]
			});

	var adnormalBtn = new Ext.Button({
				id : 'addBtn',
				text : '选择',
				iconCls : 'btn',
				handler : adnormalFun
			})


	var fm = Ext.form;
	var fc = {
		'uids' : {
			name : 'uids',
			fieldLabel : '主键'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : 'PID'
		},
		'conid' : {
			name : 'conid',
			fieldLabel : '合同主键'
		},
		'treeUids' : {
			name : 'treeUids',
			fieldLabel : '材料合同分类树'
		},
		'openBoxId' : {
			name : 'openBoxId',
			fieldLabel : '材料开箱主键',
			width : 0
		},
		'finished' : {
			name : 'finished',
			fieldLabel : '完结'
		},
		'warehouseNo' : {
			name : 'warehouseNo',
			fieldLabel : '入库单号',
			readOnly : true,
			width : 200
		},
		'warehouseDate' : {
			id : 'warehouseDate',
			name : 'warehouseDate',
			fieldLabel : '入库日期',
			readOnly : true,
			format : 'Y-m-d',
			width : 160
		},
		'noticeNo' : {
			id : 'noticeNo',
			name : 'noticeNo',
			fieldLabel : '开箱检验单',
			triggerClass : 'x-form-date-trigger',
			readOnly : true,
			emptyText : '请选择...',
			onTriggerClick : showNoticeWin,
			width : 160
		},
		'warehouseMan' : {
			name : 'warehouseMan',
			fieldLabel : '库管员',
			// readOnly: true,
			// valueField: 'k',
			// displayField: 'v',
			// mode: 'local',
			// typeAhead: true,
			// triggerAction: 'all',
			// emptyText: '请选择...',
			// store: getArray,
			width : 160
		},
		'makeMan' : {
			name : 'makeMan',
			fieldLabel : '制单人',
			readOnly : true,
			width : 160
		},
		'supplyunit' : {
			name : 'supplyunit',
			fieldLabel : '供货单位',
			width : 160
		},
		'invoiceno' : {
			name : 'invoiceno',
			fieldLabel : '发票号',
			width : edit_flagLayout == '' ? 160 : 200
		},
		'equid' : {
			name : 'equid',
			fieldLabel : '仓库号',
			allowBlank : false,
			width : 200
		},
		'remark' : {
			name : 'remark',
			fieldLabel : '入库备注',
			width : 760
		},
		'abnormalOrNo' : {
			name : 'abnormalOrNo',
			fieldLabel : '是否异常',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			width : 140
		},
		'warehouseInType' : {
			name : 'warehouseInType',
			fieldLabel : '入库类型',
			readOnly : true,
			hidden : true,
			hideLabel : true,
			width : 140
		},
		'judgmentFlag' : {
			name : 'judgmentFlag',
			fieldLabel : '判断时是否是主体设备中的出入库'
		},
		'joinUnit' : {
			name : 'joinUnit',
			fieldLabel : '参与单位',
			readOnly : true,
			allowBlank : false,
			width : 160
		}
	};

	var saveBtn = new Ext.Button({
				id : 'saveBtn',
				text : '保存',
				iconCls : 'save',
				handler : saveFun
			});
	var cancelBtn = new Ext.Button({
				id : 'cancelBtn',
				text : '关闭',
				iconCls : 'remove',
				handler : function() {
					parent.ds.reload();
					parent.dsSub.reload();
					parent.selectWin.close();
				}
			});

	var Columns = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'conid',
				type : 'string'
			}, {
				name : 'treeUids',
				type : 'string'
			}, {
				name : 'openBoxId',
				ntype : 'string'
			}, {
				name : 'finished',
				type : 'float'
			}, {
				name : 'warehouseNo',
				type : 'string'
			}, {
				name : 'warehouseDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'noticeNo',
				type : 'string'
			}, {
				name : 'warehouseMan',
				type : 'string'
			}, {
				name : 'makeMan',
				type : 'string'
			}, {
				name : 'remark',
				type : 'string'
			}, {
				name : 'abnormalOrNo',
				type : 'string'
			}, {
				name : 'warehouseInType',
				type : 'string'
			}, {
				name : 'supplyunit',
				type : 'string'
			}, {
				name : 'invoiceno',
				type : 'string'
			}, {
				name : 'equid',
				type : 'string'
			}, {
				name : 'judgmentFlag',
				type : 'string'
			}, {
				name : 'joinUnit',
				type : 'string'
			}];

	var formRecord = Ext.data.Record.create(Columns);
	var loadFormRecord = null;

	var conno;
	var conname;
	var partybno
	var moneysort;// 合同分类二（财务）
	var conmoneyno;// 财务合同编码
	DWREngine.setAsync(false);
	baseMgm.findById(beanCon, edit_conid, function(obj) {
				conno = obj.conno;
				conname = obj.conname;
				partybno = obj.partybno;
				moneysort = obj.moneysort;
				conmoneyno = obj.conmoneyno;
			});
	var moneysortText;
	for (var i = 0; i < conno2cw.length; i++) {
		if (moneysort == conno2cw[i][0]) {
			moneysortText = conno2cw[i][1];
			break;
		}
	}
	DWREngine.setAsync(true);

	// //获取单号前缀。前缀获取说明：在属性代码中配置“单号前缀”
	// var prefix = "";
	// var sql = "select c.property_name from PROPERTY_CODE c " +
	// " where c.TYPE_NAME = (select t.uids from Property_Type t where
	// t.TYPE_NAME = '单号前缀')" +
	// " and c.property_code = '"+USERDEPTID+"' ";
	// baseMgm.getData(sql, function(str){
	// prefix = str.toString();
	// });
	//        
	// //处理暂估入库检验单编号
	// var newRkNo = prefix+"-"+conmoneyno+"-暂估入库-";
	// alert("newRkNo="+newRkNo)
	// equMgm.getEquNewDhNo(CURRENTAPPID,newRkNo,"warehouse_no","wz_goods_storein_estimate",null,function(str){
	// newRkNo = str;
	// });
	// DWREngine.setAsync(true);

	var newRkNo = "";
	// DWREngine.setAsync(false);
	// var getSql = "select warehouse_no from wz_goods_storein_estimate t where
	// conid='"+edit_conid+"' and treeUids ='"+edit_treeuids+
	// "' and warehouse_no=(select max(warehouse_no) from
	// wz_goods_storein_estimate t where conid = '"+edit_conid+"' and treeUids =
	// '"+edit_treeuids+"')";
	// baseMgm.getData(getSql, function(str){
	// newRkNo = str.toString();
	// });
	// DWREngine.setAsync(true);
	// newRkNo = newRkNo.substring(0,newRkNo.length-4);
	// if(newRkNo == null || newRkNo == ""){
	if (edit_flagLayout == '' || edit_flagLayout == null) {
		// 获取单号前缀。前缀获取说明：在属性代码中配置“单号前缀”
		var prefix = "";
		var sql = "select c.property_name from PROPERTY_CODE c "
				+ " where c.TYPE_NAME = (select t.uids from Property_Type t where t.TYPE_NAME = '单号前缀')"
				+ " and c.property_code = '" + USERDEPTID + "' ";
		DWREngine.setAsync(false);
		baseMgm.getData(sql, function(str) {
					prefix = str.toString();
				});
		DWREngine.setAsync(true);
		// 处理暂估入库检验单编号
		newRkNo = prefix + "-" + conmoneyno.replace(/^\n+|\n+$/g, "")
				+ "-暂估入库-";
		// }
		DWREngine.setAsync(false);
		equMgm.getEquNewDhNo(CURRENTAPPID, newRkNo, "warehouse_no",
				"wz_goods_storein_estimate", null, function(str) {
					newRkNo = str;
				});
		DWREngine.setAsync(true);
	}
	// 新材料仓库分类树
	var wareTreeCombo = new Ext.ux.TreeCombo({
				// id : 'equid',
				 name : 'equid',
				fieldLabel : '仓库号',
				resizable : true,
				width : edit_flagLayout == '' ? 200 : 160,
				treeWidth : 230,
				allowBlank : false,
				loader : new Ext.tree.TreeLoader({
							url : MAIN_SERVLET,
							requestMethod : "GET",
							baseParams : {
								ac : "tree",
								treeName : "ckxxTreeNew",
								businessName : "equBaseInfo",
								parent : '01'
							},
							clearOnLoad : true,
							uiProviders : {
								'col' : Ext.tree.ColumnNodeUI
							}
						}),
				root : new Ext.tree.AsyncTreeNode({
							id : "01",
							text : "仓库信息",
							iconCls : 'form',
							expanded : true
						})
			});
	// Ext.apply(wareTreeCombo,fc['equid']);
	wareTreeCombo.getTree().on('beforeload', function(node) {
				wareTreeCombo.getTree().loader.baseParams.parent = node.id;
			});
	wareTreeCombo.on('select', function(tree, node) {
				if (node.id == '01') {
					Ext.example.msg("信息提示：", "请选择此分类下的子分类！");
					wareTreeCombo.setRawValue("");
					return;
				}
//				if (node.id) {
//					for (var j = 0; j < equidS.length; j++) {
//						if (node.id == equidS[j]) {
//							Ext.example.msg("信息提示：", "请选择此分类下的子分类！");
//							wareTreeCombo.setRawValue("");
//							return;
//						}
//					}
//				}
				var equid = "";
				for (var i = 0; i < equWareArr.length; i++) {
					if (node.id == equWareArr[i][1]){
					     equid = equWareArr[i][2] + " - " + equWareArr[i][1];
					     break;
					}
				}
				// this.setValue(node.id);
				formPanel.getForm().findField("equid").setValue(node.id);
				this.setRawValue(equid);
				wareTreeCombo.validate();
			});
	if (edit_uids == null || edit_uids == "") {
		loadFormRecord = new formRecord({
					uids : '',
					pid : CURRENTAPPID,
					conid : edit_conid,
					treeUids : edit_treeuids,
					openBoxId : '',
					finished : 1,
					warehouseNo : newRkNo,
					warehouseDate : new Date(),
					noticeNo : getKxNotice,
					warehouseMan : '',
					makeMan : REALNAME,
					remark : '',
					abnormalOrNo : '',
					judgmentFlag : edit_flagLayout == '' ? 'noBody' : 'body',
					supplyunit : partybno,
					invoiceno : '',
					equid : '',
					joinUnit : ''
				});

		whereSql = "1=2 and pid='" + pid + "'";
	} else {
		DWREngine.setAsync(false);
		baseMgm.findById(bean, edit_uids, function(obj) {
					loadFormRecord = new formRecord(obj);
				});
		DWREngine.setAsync(true);
		whereSql = "sbrk_uids='" + edit_uids + "'  and pid='" + pid + "'";
	}

	var getJoinUnitCom = new Ext.form.ComboBox({
				id : 'joinUnit',
				name : 'joinUnit',
				fieldLabel : '参与单位',
				readOnly : true,
				width : 160,
				valueField : 'k',
				displayField : 'v',
				mode : 'local',
				typeAhead : true,
				allowBlank : false,
				triggerAction : 'all',
				store : getJoinUnit
			})

	var noticeNoCom = ""
	if (edit_flagLayout == '' || edit_flagLayout == null) {
		noticeNoCom = new fm.ComboBox(fc['noticeNo']);

	} else {
		noticeNoCom = new fm.Hidden(fc['noticeNo']);
	}
	if (edit_flagLayout != '') {
		// 对入库单编号的处理
		getJoinUnitCom.on('select', function(node) {
			var newRkNo1 = "";
			var prefix = "";
			DWREngine.setAsync(false);
			var sql = "select c.property_name from PROPERTY_CODE c "
					+ " where c.TYPE_NAME = (select t.uids from Property_Type t where t.TYPE_NAME = '单号前缀')"
					+ " and c.property_code = '" + getJoinUnitCom.getValue()
					+ "' ";
			baseMgm.getData(sql, function(str) {
						prefix = str.toString();
					});
			// 处理暂估入库检验单编号
			newRkNo1 = "-" + conno.replace(/^\n+|\n+$/g, "") + "-暂估入库-";
			equMgm.getEquNewDhNoToSb(CURRENTAPPID, newRkNo1, "warehouse_no",
					"wz_goods_storein_estimate", null, "judgment_flag='body'",
					function(str) {
						newRkNo1 = str;
					});
			DWREngine.setAsync(true);
			var value = formPanel.getForm().findField("warehouseNo").getValue();
			if (value == null || value == "") {
				formPanel.getForm().findField("warehouseNo").setValue(prefix
						+ newRkNo1)
			} else {
//				value = value.substring(prefix.length, value.length);
				var strs = value.split('-');
				var str = prefix;
				for(var i=1;i<strs.length;i++){
				    str +="-"+strs[i];
				}
				formPanel.getForm().findField("warehouseNo").setValue(str)
			}
		})
	}
	if (edit_flagLayout == '' || edit_flagLayout == null) {
		noticeNoCom.setDisabled(false);
		formPanel = new Ext.FormPanel({
					region : 'north',
					height : 85,
					border : false,
					labelAlign : 'right',
					bodyStyle : 'padding:5px 10px;',
					labelWidth : 80,
					tbar : ['<font color=#15428b><B>入库单信息<B></font>', '->',
							saveBtn, '-', cancelBtn],
					items : [{
						layout : 'column',
						border : false,
						items : [{
							layout : 'form',
							columnWidth : .33,
							border : false,
							items : [new fm.Hidden(fc['uids']),
									new fm.Hidden(fc['pid']),
									new fm.Hidden(fc['conid']),
									new fm.Hidden(fc['treeUids']),
									new fm.Hidden(fc['openBoxId']),
									new fm.Hidden(fc['finished']),
									new fm.Hidden(fc['warehouseInType']),
									new fm.Hidden(fc['judgmentFlag']),
									new fm.TextField(fc['warehouseNo']),
									new fm.Hidden(fc['joinUnit']),
									wareTreeCombo, 
//									new fm.Hidden(fc['equid']),
									new fm.Hidden(fc['supplyunit']),
									new fm.Hidden(fc['warehouseMan'])]
						}, {
							layout : 'form',
							columnWidth : .33,
							border : false,
							items : [new fm.DateField(fc['warehouseDate']),
									new fm.TextField(fc['invoiceno']),
									new fm.Hidden(fc['makeMan'])]
						}, {
							layout : 'form',
							columnWidth : .33,
							border : false,
							buttonAlign : 'right',
							items : [
									noticeNoCom,
									new fm.Hidden(fc['abnormalOrNo'])
							]
						}]
					}, {
						layout : 'column',
						border : false,
						items : [{
									layout : 'form',
									columnWidth : .93,
									border : false,
									items : [new fm.Hidden(fc['remark'])]
								}]
					}]
				})
	} else {
		noticeNoCom.setDisabled(true);
		formPanel = new Ext.FormPanel({
					region : 'north',
					height : 85,
					border : false,
					labelAlign : 'right',
					bodyStyle : 'padding:5px 10px;',
					labelWidth : 80,
					tbar : ['<font color=#15428b><B>入库单信息<B></font>', '->',
							saveBtn, '-', cancelBtn],
					items : [{
						layout : 'column',
						border : false,
						items : [{
							layout : 'form',
							columnWidth : .33,
							border : false,
							items : [new fm.Hidden(fc['uids']),
									new fm.Hidden(fc['pid']),
									new fm.Hidden(fc['conid']),
									new fm.Hidden(fc['treeUids']),
									new fm.Hidden(fc['openBoxId']),
									new fm.Hidden(fc['finished']),
									new fm.Hidden(fc['warehouseInType']),
									new fm.Hidden(fc['judgmentFlag']),
									getJoinUnitCom,

									wareTreeCombo, new fm.Hidden(fc['equid']),
									new fm.Hidden(fc['supplyunit']),
									new fm.Hidden(fc['warehouseMan'])]
						}, {
							layout : 'form',
							columnWidth : .33,
							border : false,
							items : [new fm.TextField(fc['warehouseNo']),
									new fm.TextField(fc['invoiceno']),
									new fm.Hidden(fc['makeMan'])]
						}, {
							layout : 'form',
							columnWidth : .33,
							border : false,
							buttonAlign : 'right',
							items : [new fm.DateField(fc['warehouseDate']),
									noticeNoCom,
									new fm.Hidden(fc['abnormalOrNo'])
							]
						}]
					}, {
						layout : 'column',
						border : false,
						items : [{
									layout : 'form',
									columnWidth : .93,
									border : false,
									items : [new fm.Hidden(fc['remark'])]
								}]
					}]
				})
	}

	// 对异常材料和正常开箱材料修改时进行二选一控制
	if (banFlag == '1') {
		Ext.getCmp('noticeNo').setDisabled(true);
	} else if (banFlag == '0') {
		Ext.getCmp('noticeNo').setDisabled(false);
	}
	// ----------------------入库详细清单--------------------------------

	var equTypeArrs = [['1', '主体设备'], ['2', '备品备件'], ['3', '专用工具']]
	var equTypeDs = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : equTypeArrs
			});
	var smSub = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
	var fcSub = {
		'uids' : {
			name : 'uids',
			fieldLabel : '主键'
		},
		'pid' : {
			name : 'pid',
			fieldLabel : 'PID'
		},
		'sbrkUids' : {
			name : 'sbrkUids',
			fieldLabel : '材料入库主表主键'
		},
		'boxSubId' : {
			name : 'boxSubId',
			fieldLabel : '材料开箱明细表主键'
		},
		'boxNo' : {
			name : 'boxNo',
			fieldLabel : '箱件号'
		},
		'warehouseType' : {
			name : 'warehouseType',
			fieldLabel : '材料类型',
			readOnly : true,
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			allowBlank : false,
			triggerAction : 'all',
			store : equTypeDs
		},
		'warehouseName' : {
			name : 'warehouseName',
			fieldLabel : '材料名称',
			allowBlank : false
		},
		'ggxh' : {
			name : 'ggxh',
			fieldLabel : '规格型号',
			allowBlank : false
		},
		'unit' : {
			name : 'unit',
			fieldLabel : '单位'
		},
		'inWarehouseNo' : {
			name : 'inWarehouseNo',
			fieldLabel : '数量',
            decimalPrecision:4
		},
		'unitPrice' : {
			name : 'unitPrice',
			fieldLabel : '单价',
			allowBlank : true,
			decimalPrecision : 6
		},
		'amountMoney' : {
			name : 'amountMoney',
			fieldLabel : '金额',
			allowBlank : true,
			decimalPrecision : 2
		},
		'freightMoney' : {
			name : 'freightMoney',
			fieldLabel : '运费',
			allowBlank : true,
			decimalPrecision : 2
		},
		'insuranceMoney' : {
			name : 'insuranceMoney',
			fieldLabel : '保险',
			allowBlank : true,
			decimalPrecision : 2
		},
		'antherMoney' : {
			name : 'antherMoney',
			fieldLabel : '其他',
			allowBlank : true,
			decimalPrecision : 2
		},
		'intoMoney' : {
			name : 'intoMoney',
			fieldLabel : '入库单价',
			allowBlank : true,
			decimalPrecision : 6
		},
		'totalMoney' : {
			name : 'totalMoney',
			fieldLabel : '入库金额',
			allowBlank : true,
			decimalPrecision : 2
		},
		'amountTax' : {
			name : 'amountTax',
			fieldLabel : '金额税金',
			allowBlank : true,
			decimalPrecision : 2
		},
		'freightTax' : {
			name : 'freightTax',
			fieldLabel : '运费税金',
			allowBlank : true,
			decimalPrecision : 2
		},
		'insuranceTax' : {
			name : 'insuranceTax',
			fieldLabel : '保险税金',
			allowBlank : true,
			decimalPrecision : 2
		},
		'antherTax' : {
			name : 'antherTax',
			fieldLabel : '其他税金',
			allowBlank : true,
			decimalPrecision : 2
		},
		'graphNo' : {
			name : 'graphNo',
			fieldLabel : '图号'
		},
		'warehouseNum' : {
			name : 'warehouseNum',
			fieldLabel : '检验数量'
            ,decimalPrecision:4
		},
		'weight' : {
			name : 'weight',
			fieldLabel : '重量'
		},
		'equno' : {
			id : 'equno',
			name : 'equno',
			fieldLabel : '入库存放库位',
			mode : 'local',
			editable : false,
			valueField : 'k',
			displayField : 'v',
			readOnly : true,
			listWidth : 220,
			lazyRender : true,
			triggerAction : 'all',
			store : getEquid,
			tpl : "<tpl for='.'><div style='height:200px'><div id='tree'></div></div></tpl>",
			listClass : 'x-combo-list-small'
		},

		'stockno' : {
			name : 'stockno',
			fieldLabel : '存货编码',
			allowBlank : false,
			readOnly : true
		},
		'taxes' : {
			name : 'taxes',
			fieldLabel : '税金',
			allowBlank : true,
			decimalPrecision : 2
		},
		'totalnum' : {
			name : 'totalnum',
			fieldLabel : '合计',
			allowBlank : true,
			decimalPrecision : 2
		},
		'memo' : {
			name : 'memo',
			fieldLabel : '备注',
			xtype : 'htmleditor',
			anchor : '95%',
			height : 80,
			width : 800
		}
	};

	equnoComboBox = new fm.ComboBox(fcSub['equno']);
	equnoComboBox.on('beforequery', function() {
				newtreePanel.on('beforeload', function(node) {
							var parent = node.attributes.equid;

							if (parent == null || parent == "")
								parent = '01';
							var baseParams = newtreePanel.loader.baseParams
							baseParams.orgid = '0';
							baseParams.parent = parent;
						})
				newtreePanel.render('tree');
				newroot.reload();

			})
	newtreePanel.on('click', function(node, e) {
				var elNode = node.getUI().elNode;
				var treename = node.attributes.treename;
				var uids = elNode.all("uids").innerText;
				if (elNode.all('isleaf').innerText == '0') {
					Ext.example.msg('提示信息', '请选择该仓库下面的分类！');
					return;
				} else {
					if (formPanelSub) {
						formPanelSub.getForm().findField('equno')
								.setValue(uids);
					}
					for (var i = 0; i < equWareArr.length; i++) {
						if (node.id == equWareArr[i][1]) {
							equnoComboBox.setValue(uids);
							equnoComboBox.setRawValue(equWareArr[i][2] + " - "
									+ equWareArr[i][1])
							break;
						}
					}
					equnoComboBox.collapse();
				}
			})

	var cmSub = new Ext.grid.ColumnModel([
			// smSub,
			new Ext.grid.RowNumberer({
						header : '序号',
						width : 35
					}), {
				id : 'uids',
				header : fcSub['uids'].fieldLabel,
				dataIndex : fcSub['uids'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fcSub['pid'].fieldLabel,
				dataIndex : fcSub['pid'].name,
				hidden : true
			}, {
				id : 'sbrkUids',
				header : fcSub['sbrkUids'].fieldLabel,
				dataIndex : fcSub['sbrkUids'].name,
				hidden : true
				// boxSubId
		}	, {
				id : 'boxSubId',
				header : fcSub['boxSubId'].fieldLabel,
				dataIndex : fcSub['boxSubId'].name,
				hidden : true
			}
			// ,{
			// id : 'boxNo',
			// header : fcSub['boxNo'].fieldLabel,
			// dataIndex : fcSub['boxNo'].name,
			// hidden : true,
			// editor : new fm.TextField(fcSub['boxNo']),
			// align : 'right'
			// }
			, {
				id : 'warehouseType',
				header : fcSub['warehouseType'].fieldLabel,
				dataIndex : fcSub['warehouseType'].name,
				align : 'center',
				renderer : function(v,m,r) {
					var equ = "";
					m.attr = "style=background-color:#FBF8BF";
					for (var i = 0; i < equTypeArr.length; i++) {
						if (v == equTypeArr[i][0]){
						     equ = equTypeArr[i][1];
						     break;
						}
					}
					return equ;
				},
				editor : new fm.ComboBox(fcSub['warehouseType'])
			}, {
				id : 'warehouseName',
				header : fcSub['warehouseName'].fieldLabel,
				dataIndex : fcSub['warehouseName'].name,
				align : 'center',
				editor : new fm.TextField(fcSub['warehouseName']),
				width : 200
			}, {
				id : 'ggxh',
				header : fcSub['ggxh'].fieldLabel,
				dataIndex : fcSub['ggxh'].name,
				editor : new fm.TextField(fcSub['ggxh']),
				align : 'center',
				width : 100
			}, {
				id : 'unit',
				header : fcSub['unit'].fieldLabel,
				dataIndex : fcSub['unit'].name,
				editor : new fm.TextField(fcSub['unit']),
				align : 'center',
				width : 100
			}, {
				id : 'inWarehouseNo',
				header : fcSub['inWarehouseNo'].fieldLabel,
				dataIndex : fcSub['inWarehouseNo'].name,
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				editor : new fm.NumberField(fcSub['inWarehouseNo']),
				align : 'right',
				width : 80
			}, {
				id : 'unitPrice',
				header : fcSub['unitPrice'].fieldLabel,
				dataIndex : fcSub['unitPrice'].name,
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				editor : new fm.NumberField(fcSub['unitPrice']),
				align : 'right',
				hidden : edit_flagLayout == '' ? true : false,
				width : 80
			}, {
				id : 'amountMoney',
				header : fcSub['amountMoney'].fieldLabel,
				dataIndex : fcSub['amountMoney'].name,
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				editor : new fm.NumberField(fcSub['amountMoney']),
				align : 'right',
				hidden : edit_flagLayout == '' ? true : false,
				width : 80
			}, {
				id : 'freightMoney',
				header : fcSub['freightMoney'].fieldLabel,
				dataIndex : fcSub['freightMoney'].name,
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				editor : new fm.NumberField(fcSub['freightMoney']),
				align : 'right',
				hidden : edit_flagLayout == '' ? true : false,
				width : 80
			}, {
				id : 'insuranceMoney',
				header : fcSub['insuranceMoney'].fieldLabel,
				dataIndex : fcSub['insuranceMoney'].name,
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				editor : new fm.NumberField(fcSub['insuranceMoney']),
				align : 'right',
				hidden : edit_flagLayout == '' ? true : false,
				width : 80
			}, {
				id : 'antherMoney',
				header : fcSub['antherMoney'].fieldLabel,
				dataIndex : fcSub['antherMoney'].name,
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				editor : new fm.NumberField(fcSub['antherMoney']),
				align : 'right',
				hidden : edit_flagLayout == '' ? true : false,
				width : 80
			}, {
				id : 'intoMoney',
				header : fcSub['intoMoney'].fieldLabel,
				dataIndex : fcSub['intoMoney'].name,
				align : 'right',
				hidden : edit_flagLayout == '' ? true : false,
				renderer : function(v){
					if(isNaN(v) ==  true){
						return v.toFixed(2);
					}else{
					  return parseFloat(v,10).toFixed(2);
					}
				},
				width : 80
			}, {
				id : 'totalMoney',
				header : fcSub['totalMoney'].fieldLabel,
				dataIndex : fcSub['totalMoney'].name,
				align : 'right',
				hidden : edit_flagLayout == '' ? true : false,
				width : 80
			}, {
				id : 'amountTax',
				header : fcSub['amountTax'].fieldLabel,
				dataIndex : fcSub['amountTax'].name,
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				editor : new fm.NumberField(fcSub['amountTax']),
				align : 'right',
				hidden : edit_flagLayout == '' ? true : false,
				width : 80
			}, {
				id : 'freightTax',
				header : fcSub['freightTax'].fieldLabel,
				dataIndex : fcSub['freightTax'].name,
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				editor : new fm.NumberField(fcSub['freightTax']),
				align : 'right',
				hidden : edit_flagLayout == '' ? true : false,
				width : 80
			}, {
				id : 'insuranceTax',
				header : fcSub['insuranceTax'].fieldLabel,
				dataIndex : fcSub['insuranceTax'].name,
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				editor : new fm.NumberField(fcSub['insuranceTax']),
				align : 'right',
				hidden : edit_flagLayout == '' ? true : false,
				width : 80
			}, {
				id : 'antherTax',
				header : fcSub['antherTax'].fieldLabel,
				dataIndex : fcSub['antherTax'].name,
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				editor : new fm.NumberField(fcSub['antherTax']),
				align : 'right',
				hidden : edit_flagLayout == '' ? true : false,
				width : 80
			}, {
				id : 'graphNo',
				header : fcSub['graphNo'].fieldLabel,
				dataIndex : fcSub['graphNo'].name,
				align : 'center',
				width : 100,
				hidden : true
			}, {
				id : 'warehouseNum',
				header : fcSub['warehouseNum'].fieldLabel,
				dataIndex : fcSub['warehouseNum'].name,
				align : 'right',
				width : 80,
				hidden : true
			}, {
				id : 'weight',
				header : fcSub['weight'].fieldLabel,
				dataIndex : fcSub['weight'].name,
				align : 'right',
				width : 80,
				hidden : true
			}, {
				id : 'totalnum',
				header : fcSub['totalnum'].fieldLabel,
				dataIndex : fcSub['totalnum'].name,
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				editor : new fm.NumberField(fcSub['totalnum']),
				align : 'right',
				hidden : true,
				width : 80
			}, {
				id : 'taxes',
				header : fcSub['taxes'].fieldLabel,
				dataIndex : fcSub['taxes'].name,
				renderer : function(v, m, r) {
					return v;
				},
				align : 'right',
				hidden : edit_flagLayout == '' ? true : false,
				width : 80
			}, {
				id : 'equno',
				header : fcSub['equno'].fieldLabel,
				dataIndex : fcSub['equno'].name,
				renderer : function(v, m, r) {
					var equno = "";
					m.attr = "style=background-color:#FBF8BF";
					for (var i = 0; i < equWareArr.length; i++) {
						if (v == equWareArr[i][0]){
						    equno = equWareArr[i][2] + " - " + equWareArr[i][1];
						    break;
						}
					}
					return equno;
				},
				align : 'center',
				editor : equnoComboBox
			}, {
				id : 'stockno',
				header : fcSub['stockno'].fieldLabel,
				dataIndex : fcSub['stockno'].name,
				editor : new fm.TextField(fcSub['stockno']),
				align : 'center',
				width : 200
			}, {
				id : 'memo',
				header : fcSub['memo'].fieldLabel,
				dataIndex : fcSub['memo'].name,
				align : 'center',
				editor : new fm.TextField(fcSub['memo']),
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				width : 200
			}]);

	var ColumnsSub = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'sbrkUids',
				type : 'string'
			}, {
				name : 'boxSubId',
				type : 'string'
			}, {
				name : 'boxNo',
				type : 'string'
			}, {
				name : 'warehouseType',
				type : 'string'
			}, {
				name : 'warehouseName',
				type : 'string'
			}, {
				name : 'ggxh',
				type : 'string'
			}, {
				name : 'unit',
				type : 'string'
			}, {
				name : 'inWarehouseNo',
				type : 'float'
			}, {
				name : 'unitPrice',
				type : 'float'
			}, {
				name : 'amountMoney',
				type : 'float'
			}, {
				name : 'freightMoney',
				type : 'float'
			}, {
				name : 'insuranceMoney',
				type : 'float'
			}, {
				name : 'antherMoney',
				type : 'float'
			},
			// {name:'intoMoney', type:'float'},
			{
				name : 'totalMoney',
				type : 'float'
			}, {
				name : 'amountTax',
				type : 'float'
			}, {
				name : 'freightTax',
				type : 'float'
			}, {
				name : 'insuranceTax',
				type : 'float'
			}, {
				name : 'antherTax',
				type : 'float'
			}, {
				name : 'graphNo',
				type : 'string'
			}, {
				name : 'warehouseNum',
				type : 'float'
			}, {
				name : 'weight',
				type : 'float'
			}, {
				name : 'intoMoney',
				type : 'float'
			}, {
				name : 'totalMoney',
				type : 'float'
			}, {
				name : 'equno',
				type : 'string'
			}, {
				name : 'memo',
				type : 'string'
			}, {
				name : 'stockno',
				type : 'string'
			}, {
				name : 'taxes',
				type : 'float'
			}, {
				name : 'totalnum',
				type : 'float'
			}];

	var dsSub = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : beanSub,
					business : businessSub,
					method : listMethodSub,
					params : whereSql
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : primaryKeySub
						}, ColumnsSub),
				remoteSort : true,
				pruneModifiedRecords : true
			});
	dsSub.setDefaultSort(orderColumnSub, 'desc'); // 设置默认排序列

	var PlantSub = Ext.data.Record.create(ColumnsSub);
	var PlantIntSub = {
		uids : '',
		pid : CURRENTAPPID,
		sbrkUids : '',
		boxSubId : '',
		warehouseType : '',
		warehouseName : '',
		ggxh : '',
		unit : '',
		inWarehouseNo : 0,
		unitPrice : 0,
		amountMoney : 0,
		antherMoney : 0,
		freightMoney : 0,
		// intoMoney : 0,
		totalMoney : 0,
		amountTax : 0,
		freightTax : 0,
		insuranceMoney : 0,
		insuranceTax : 0,
		antherTax : 0,
		boxNo : '',
		boxName : '',
		warehouseNum : 0,
		weight : '',
		intoMoney : 0,
		totalMoney : 0,
		equno : '',
		stockno : '',
		taxes : 0,
		totalnum : 0,
		memo : ''
	}
	var addGridBtn = new Ext.Button({
				id : 'addGridBtn',
				text : '新增',
				iconCls : 'add',
				handler : addGridFun
			});
	var saveGridBtn = new Ext.Button({
				id : 'saveBtn',
				text : '保存',
				iconCls : 'save',
				handler : saveGridFun
			});

	var delBtn = new Ext.Button({
				text : '删除',
				iconCls : 'remove',
				handler : delGridFun
			});
	var selectFromEquBodyBtn = new Ext.Button({
				text : '从主体材料选择',
				iconCls : 'btn',
				handler : selectFromEquBodyFun
			});
	if (banFlag == '1') {
		delBtn.setDisabled(false);
	} else if (banFlag == '0') {
		delBtn.setDisabled(true);
	}
	if (edit_flagLayout == '' || edit_flagLayout == null) {
		addGridBtn.setDisabled(true);
		selectFromEquBodyBtn.hide();
	} else {
		addGridBtn.setDisabled(false);
		selectFromEquBodyBtn.show();
	}
	var gridPanelSub = new Ext.grid.EditorGridTbarPanel({
				ds : dsSub,
				cm : cmSub,
				sm : smSub,
				title : '入库单明细',
				tbar : ['<font color=#15428b><B>入库单明细<B></font>', '-',
						saveGridBtn, '-', delBtn, '-', selectFromEquBodyBtn],// '-',addGridBtn,
				header : false,
				height : document.body.clientHeight * 0.5,
				border : false,
				autoWidth : true,
				region : 'center',
				addBtn : false, // 是否显示新增按钮
				saveBtn : false, // 是否显示保存按钮
				delBtn : false, // 是否显示删除按钮
				stripeRows : true,
				loadMask : true,
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : dsSub,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				saveHandler : saveGridFun,// 自定义保存方法，可选
				plant : PlantSub,
				plantInt : PlantIntSub,
				servletUrl : MAIN_SERVLET,
				bean : beanSub,
				business : businessSub,
				primaryKey : primaryKeySub
			});
	gridPanelSub.on("aftersave", function() {
				dsSub.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
			});
	gridPanelSub.on("afteredit", function(obj) {
		var r = obj.record;
		if (r != null) {
			if (r.get('amountMoney') != null || r.get('amountMoney') != "") {
				if (r.get('inWarehouseNo') != 0)
					r.set('unitPrice', (r.get('amountMoney') / r
									.get('inWarehouseNo')).toFixed(6))
			}
			if (r.get('amountMoney') != "" || r.get('antherMoney') != null) {
				var totalMonety = r.get('freightMoney')
						+ r.get('insuranceMoney') + r.get('antherMoney')
						+ r.get('amountMoney');
				r.set('totalMoney', totalMonety.toFixed(2));
			}

			if (r.get('inWarehouseNo') != null
					&& (r.get('totalMoney') != null || r.get('totalMoney') != '')) {
				if (r.get('inWarehouseNo') != 0)
					r.set('intoMoney', (r.get('totalMoney') / r
									.get('inWarehouseNo')).toFixed(6))
			}
			if (r.get('amountTax') != null && r.get('freightTax') != null
					&& r.get('insuranceTax') != null
					&& r.get('antherTax') != null) {
				r.set('taxes', (r.get('amountTax') / 1 + r.get('freightTax') / 1
								+ r.get('insuranceTax') / 1
								+ r.get('antherTax') / 1).toFixed(2))
			}
		}
	});

	// {name:'inWarehouseNo', type:'float'},
	// {name:'unitPrice', type:'string'},
	// {name:'amountMoney', type:'float'},

	var tabPanel = new Ext.TabPanel({
				activeTab : 0,
				border : false,
				region : 'center',
				items : [gridPanelSub]
			})

	var viewPort = new Ext.Viewport({
				layout : 'border',
				items : [formPanel, tabPanel]
			});

	// yanglh 2013年4月22日 材料主体设备出入库新增入库单明细给你实现

	function addGridFun() {
		var sbrkUids = '';
		if (edit_uids == null || edit_uids == '') {
			sbrkUids = formPanel.getForm().findField("uids").getValue();

		} else {
			sbrkUids = edit_uids
		}
		if (sbrkUids == '') {
			Ext.example.msg('提示信息','请先保存【<span style="color:red">入库单信息</span>】，' +
					         ' 在新增【<span style="color:red">入库单明细</span>】！');
			return;
		}
		equnoComboBox.enable();
		if (!formPanelSub) {
			formPanelSub = new Ext.FormPanel({
				id : 'form-panel',
				header : false,
				border : false,
				region : 'center',
				bodyStyle : 'padding:5px 5px;',
				iconCls : 'icon-detail-form', // 面板样式
				labelAlign : 'right',
				items : [new Ext.form.FieldSet({
							title : '基本信息',
							autoWidth : true,
							border : true,
							width : 600,
							layout : 'column',
							items : [{
								layout : 'form',
								columnWidth : .3,
								bodyStyle : 'border: 0px;',
								items : [
										new fm.Hidden(fcSub['uids']),
										new fm.Hidden(fcSub['pid']),
										new fm.Hidden(fcSub['sbrkUids']),
										new fm.Hidden(fcSub['boxNo']),
										new fm.TextField(fcSub['warehouseName']),
										new fm.TextField(fcSub['graphNo'])]
							}, {
								layout : 'form',
								columnWidth : .35,
								bodyStyle : 'border: 0px;',
								items : [
										new fm.Hidden(fcSub['boxSubId']),
										new fm.ComboBox(fcSub['warehouseType']),
										// new fm.TextField(fcSub['equno'])
										equnoComboBox

								]
							}, {
								layout : 'form',
								columnWidth : .33,
								bodyStyle : 'border: 0px;',
								items : [new fm.TextField(fcSub['ggxh']),
										new fm.TextField(fcSub['stockno'])]
							}]
						}), new Ext.form.FieldSet({
							title : '其他信息',
							layout : 'column',
							border : true,
							autoWidth : true,
							items : [{
								layout : 'form',
								columnWidth : .33,
								bodyStyle : 'border: 0px;',
								items : [
										new fm.NumberField(fcSub['inWarehouseNo']),
										new fm.NumberField(fcSub['unitPrice']),
										new fm.NumberField(fcSub['amountMoney']),
										new fm.NumberField(fcSub['intoMoney']),
										new fm.NumberField(fcSub['totalMoney'])

								]
							}, {
								layout : 'form',
								columnWidth : 0.33,
								bodyStyle : 'border: 0px;',
								items : [
										new fm.NumberField(fcSub['warehouseNum']),
										new fm.TextField(fcSub['unit']),
										new fm.NumberField(fcSub['antherMoney']),
										new fm.NumberField(fcSub['freightMoney']),
										new fm.NumberField(fcSub['insuranceMoney']),
										new fm.NumberField(fcSub['totalnum'])

								]
							}, {
								layout : 'form',
								columnWidth : .33,
								bodyStyle : 'border: 0px;',
								items : [
										new fm.NumberField(fcSub['weight']),
										new fm.NumberField(fcSub['amountTax']),
										new fm.NumberField(fcSub['freightTax']),
										new fm.NumberField(fcSub['insuranceTax']),
										new fm.NumberField(fcSub['antherTax']),
										new fm.NumberField(fcSub['taxes'])]
							}]
						}), new Ext.form.FieldSet({
							layout : 'form',
							border : true,
							title : '备注',
							cls : 'x-plain',
							items : [fcSub['memo']

							]
						})],
				buttons : [{
							id : 'save',
							text : '保存',
							disabled : false,
							handler : formSave
						}, {
							id : 'cancel',
							text : '取消',
							handler : function() {
								noticeWinSub.hide();
								dsSub.reload();
							}
						}]

			})
		}
		if (!noticeWinSub) {
			noticeWinSub = new Ext.Window({
						width : 920,
						height : 400,
						tbar : ['<font color=#15428b><B>入库单明细<B></font>'],
						modal : true,
						plain : true,
						border : false,
						resizable : false,
						autoScroll : true,
						closeAction : 'hide',
						items : [formPanelSub]
					});
		}
		noticeWinSub.show();
		var loadFormRecord = null;
		if (edit_uids == null || edit_uids == '') {
			PlantIntSub.sbrkUids = formPanel.getForm().findField("uids")
					.getValue();
			edit_uids = formPanel.getForm().findField("uids").getValue();
		} else {
			PlantIntSub.sbrkUids = edit_uids
		}
		var getEquid = formPanel.getForm().findField("equid").getValue();

		if (getEquid == null || getEquid == "") {
			Ext.example.msg('信息提示！', '仓库号为空，请选择仓库号！');
			noticeWinSub.hide();
			return;
		} else {
			var getBoxNo = "";
			DWREngine.setAsync(false);
			baseMgm
					.getData(
							"select t.equid,t.waretypecode,t.warenocode from equ_warehouse t where t.equid='"
									+ getEquid + "'", function(str) {
								if (str.length > 0) {
									getBoxNo = str[0][1] + "-" + str[0][2]
											+ "-"
								}
							})
			DWREngine.setAsync(true);
			DWREngine.setAsync(false);
			equMgm.getEquNewDhNo(CURRENTAPPID, getBoxNo, "stockno",
					"wz_goods_storein_estimate_sub", null, function(str) {
						PlantIntSub.stockno = str;
					});
			DWREngine.setAsync(true);

		}
		var formRecord = Ext.data.Record.create(ColumnsSub);
		loadFormRecord = new formRecord(PlantIntSub);
		formPanelSub.getForm().loadRecord(loadFormRecord);

		function formSave() {
			var form = formPanelSub.getForm()
			if (form.isValid()) {
				doFormSave(true)
			}
		}

		function doFormSave() {
			var form = formPanelSub.getForm()
			var obj = form.getValues()
			for (var i = 0; i < ColumnsSub.length; i++) {
				var n = ColumnsSub[i].name;
				var field = form.findField(n);
				if (field) {
					obj[n] = field.getValue();
				}
			}
			DWREngine.setAsync(false);
			if (obj.uids == '' || obj.uids == null) {
				wzbaseinfoMgm.saveOrUpdataWzGoodsStoreinEstimateSub(obj,
						function(str) {
							if (str == 'success') {
								Ext.example.msg('保存成功！', '您成功新增了一条信息！');
								Ext.Msg.show({
									title : '提示',
									msg : '是否继续新增?',
									buttons : Ext.Msg.YESNO,
									fn : function(btn) {
										if (btn == 'yes') {
											addGridFun();
											dsSub.baseParams.params = " sbrkUids='"
													+ sbrkUids
													+ "' and pid='"
													+ pid + "'";
											dsSub.load();
										} else {
											dsSub.baseParams.params = " sbrkUids='"
													+ sbrkUids
													+ "' and pid='"
													+ pid + "'";
											dsSub.load();
											noticeWinSub.hide();
										}
									},
									icon : Ext.MessageBox.QUESTION
								});
							} else {
								Ext.example.msg('信息提示', '保存失败！');
								dsSub.baseParams.params = " sbrkUids='"
										+ sbrkUids + "' and pid='" + pid + "'";;
								dsSub.load();
								noticeWinSub.hide();
							}
						});
			}
			DWREngine.setAsync(true);
		}
	}
	// 新增时根据合同分类二（财务）属性代码的中文配置，与仓库号中文对比匹配，自动设置
	if (edit_uids == null || edit_uids == "") {
	    //新增时根据合同分类二（财务）属性代码的中文配置，与仓库号中文对比匹配，自动设置
	    if(wareTreeCombo.getValue() == null || wareTreeCombo.getValue() == ""){
	        for (var i = 0; i < equWareArr.length; i++) {
	            if (moneysortText == equWareArr[i][1]){
	                wareTreeCombo.setValue(equWareArr[i][1]);
	                loadFormRecord.set("equid",equWareArr[i][1]);
	                wareTreeCombo.setRawValue(equWareArr[i][2]+" - "+equWareArr[i][1]);
	                break;
	            }
	        }
	    }
   }else{
		    wareTreeCombo.setValue(loadFormRecord.get("equid"));
		    for (var i = 0; i < equWareArr.length; i++) {
		        if (loadFormRecord.get("equid") == equWareArr[i][1]){
		              wareTreeCombo.setRawValue(equWareArr[i][2]+" - "+equWareArr[i][1]);
		              break;
		        }
		    }
    }


	formPanel.getForm().loadRecord(loadFormRecord);
	wareTreeCombo.validate();
	dsSub.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
	// ---------------function-------------

	// form表单保存
	function saveFun() {
		var flag = true;
		var form = formPanel.getForm();
		var equid = wareTreeCombo.getRawValue();
		if (equid == null || equid == "") {
			Ext.example.msg('保存出错', '请选择仓库号！');
			return;
		}
		var getConid = form.findField("conid").getValue();
		form.findField('warehouseInType').setValue("暂估入库");
		var getWarehouseNo = form.findField("warehouseNo").getValue();
		form.findField("abnormalOrNo").setValue(banFlag);
		if (edit_flagLayout == '' || edit_flagLayout == null) {
			form.findField("judgmentFlag").setValue("noBody");
		} else {
			form.findField("judgmentFlag").setValue("body");
		}
		var obj = new Object();
		for (var i = 0; i < Columns.length; i++) {
			var name = Columns[i].name;
			var field = form.findField(name);
			if (field != null) {
				obj[name] = field.getValue();
			}
		}
		DWREngine.setAsync(false);
		wzbaseinfoMgm.saveOrUpdataWzZGRkGoodsStorein(obj, pid, edit_uids,
				function(text) {
					if (text == 'success') {
						Ext.example.msg('提示信息', '保存成功！');
					} else if (text == 'failure') {
						Ext.example.msg('提示信息', '保存失败！');
					} else if (text == 'repeat') {
						Ext.example.msg('提示信息', '您保存的记录已存在！');
					}
				})
		DWREngine.setAsync(true);
		DWREngine.setAsync(false);
		baseMgm.getData("select uids from wz_goods_storein_estimate "
						+ "where conid='" + getConid + "' and  warehouse_no='"
						+ getWarehouseNo + "' and pid='" + pid + "'", function(
						text) {
					formPanel.getForm().findField("uids").setValue(text);
				})
		DWREngine.setAsync(true);

	}

	// 材料详细信息保存
	function saveGridFun() {
		var records = dsSub.getModifiedRecords();
		if (records == null || records == "") {
			Ext.example.msg('提示信息', '请修改数据后，再进行保存！');
			return;
		}
		gridPanelSub.defaultSaveHandler();
	}

	// 材料详细信息删除
	function delGridFun() {
		var records = smSub.getSelections();
		if (records == null || records == "") {
			Ext.example.msg('提示信息', '请选择您要删除的记录！');
			return;
		}
		if(edit_flagLayout == "WZBODY"){
			var updateSql = "update Wz_Goods_Bodys set del_or_update='1' where equ_no not in (" +
	    			        " select stockno from ( select * from WZ_GOODS_STOREIN_ESTIMATE_SUB t where  t.uids<>'"+
	    			         records[0].data.uids+"' union select * from (select * from Wz_Goods_Storein_Sub  where " +
	    			         " sbrk_uids in (select uids from WZ_GOODS_STOREIN t where t.judgment_flag='body' )) )) " +
             		        " and equ_name='"+records[0].data.warehouseName+"' and ggxh='"+records[0].data.ggxh+"'";
            DWREngine.setAsync(false);
            baseDao.updateBySQL(updateSql);
            DWREngine.setAsync(false);		
		}
		gridPanelSub.defaultDeleteHandler();
	}

	// 打开材料开箱选择窗口
	function showNoticeWin() {
		if (edit_flagLayout != "") {
			return;
		}
		if (banFlag == "1")
			return;
		var uids = formPanel.getForm().findField("uids").getValue();
		if (uids == null || uids == "") {
			Ext.example.msg('提示信息', '请先保存材料入库单信息！');
			return;
		}
		dsNotice.baseParams.params = "open_no not in (select noticeNo from WzGoodsStorein t "
				+ " where pid='"
				+ pid
				+ "' and NOTICE_NO <>' ') "
				+ " and finished='1' and isStorein <>1 and pid='"
				+ pid
				+ "' and ( conid='"
				+ edit_conid
				+ "' or treeuids='"
				+ edit_conid + "')";
		dsNotice.load();
		noticeWin.show();
		var noticeId = formPanel.getForm().findField("noticeNo").getValue();
		if (noticeId == "") {
			dsSub.baseParams.params = " 1=2 and pid='" + pid + "'";
		} else {
			dsSub.baseParams.params = "sbrk_uids='" + uids + "' and pid='"
					+ pid + "'";
		}
		dsSub.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
	}

	// 材料正常开箱处理
	function chooseFun() {
		/*
		 * var rec = gridPanelNotice.getSelectionModel().getSelected(); var
		 * getUids = formPanel.getForm().findField('uids').getValue(); if(rec ==
		 * null || rec == ""){ Ext.example.msg('提示信息','请选择材料开箱检验记录！'); return ;
		 * }else{ getKxNotice=rec.data.openNo;
		 * Ext.example.msg('提示信息','您请选择了一条材料开箱检验记录！');
		 * formPanel.getForm().findField('noticeNo').setValue(getKxNotice);
		 * DWREngine.setAsync(false);
		 * equMgm.SetListEquRkGoodsStorein(rec.data.uids,rec.data.pid,getUids,rec.data.openNo,function(text){
		 * if(text == "success"){
		 * dsSub.baseParams.params="sbrk_uids='"+getUids+"' and pid='"+pid+"'";
		 * dsSub.load({params:{start:0,limit:PAGE_SIZE}}); } })
		 * DWREngine.setAsync(true); noticeWin.hide(); delBtn.setDisabled(true);
		 * formPanel.getForm().findField("openBoxId").setValue(rec.get('uids'));
		 * banFlag = "0"; }
		 */

		// 入库单选择检验单修改为多选临时处理办法。
		var records = gridPanelNotice.getSelectionModel().getSelections();
		if (records == null || records.length == 0) {
			Ext.example.msg('提示信息', '请选择材料开箱检验记录！');
			return;
		} else {
			var getUids = formPanel.getForm().findField('uids').getValue();
			var uidsArr = new Array();
			var openNoArr = new Array();
			for (var i = 0; i < records.length; i++) {
				var rec = records[i];
				uidsArr.push(rec.data.uids);
				openNoArr.push(rec.data.openNo);
			}
			DWREngine.setAsync(false);
			wzbaseinfoMgm.selectWzCheckToEquInEstimate(uidsArr, getUids,
					function(text) {

					});
			DWREngine.setAsync(true);
			formPanel.getForm().findField('noticeNo').setValue(openNoArr);
			formPanel.getForm().findField("openBoxId").setValue(uidsArr);

			noticeWin.hide();
			delBtn.setDisabled(true);
			banFlag = "0";

			dsSub.baseParams.params = "sbrk_uids='" + getUids + "' and pid='"
					+ pid + "'";
			dsSub.load({
						params : {
							start : 0,
							limit : PAGE_SIZE
						}
					});
		}

	}

	// 异常材料处理
	function abnormalOrNoFun() {
		var uids = formPanel.getForm().findField("uids").getValue();
		if (uids == null || uids == "") {
			Ext.example.msg('提示信息', '请先保存材料入库单信息！');
			return;
		}
		dsAdnoral.baseParams.params = "uids not in(select boxSubId from EquGoodsStoreinSub  where pid='"
				+ pid
				+ "' and boxSubId <> ' ')"
				+ " and exception ='1' and isStorein <> 1 and finished = '1' and pid='"
				+ pid + "'"
		dsAdnoral.load();
	}

	// 异常材料选择保存
	function adnormalFun() {
		var flag = 0;
		var recored = gridPanelAdnoral.getSelectionModel().getSelections();
		var getUids = formPanel.getForm().findField('uids').getValue();
		if (recored == null || recored == "") {
			Ext.example.msg('提示信息', '请选择异常材料入库信息！');
			return false;
		} else {
			var temp = new Array();
			for (var i = 0; i < recored.length; i++) {
				temp.push(recored[i].data)
			}
			gridPanelAdnoral.getEl().mask("loading...");
			DWREngine.setAsync(false);
			equMgm.addAbnormalListEstimate(temp, getUids, pid, function(text) {
						if (text == "success")
							flag = 1;
					})
			DWREngine.setAsync(true);
			gridPanelAdnoral.getEl().unmask();
			if (flag == '1') {
				var uids = formPanel.getForm().findField("uids").getValue();
				Ext.example.msg('提示信息', '您选择了' + recored.length + '异常材料入库信息！');
				dsSub.baseParams.params = "sbrk_uids='" + uids + "' and pid='"
						+ pid + "'";
				dsSub.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
			}
			Ext.getCmp("noticeNo").setDisabled(true);
			// delBtn.setDisabled(false);
			banFlag = "1";
			return true;
		}
		return false;
	}
	// 主体设备出入库中入库从主体设备选择
	var chooseEquBodyBtn = new Ext.Button({
				text : '确认选择',
				iconCls : 'btn',
				handler : chooseEquBodyFun
			});
	var equBodyWin = new Ext.Window({
				width : document.body.clientWidth - 20,
				height : document.body.clientHeight - 20,
				tbar : ['<font color=#15428b><B>主体设备选择<B></font>', '->',
						chooseEquBodyBtn],
				modal : true,
				plain : true,
				border : false,
				resizable : false,
				layout : 'fit',
				closeAction : 'hide',
				items : [gridEquBody]
			});

	function selectFromEquBodyFun() {
		var sbrkUids = '';
		if (edit_uids == null || edit_uids == '') {
			sbrkUids = formPanel.getForm().findField("uids").getValue();

		} else {
			sbrkUids = edit_uids
		}
		if (sbrkUids == '') {
			Ext.example
					.msg(
							'提示信息',
							'请先保存【<span style="color:red">入库单信息</span>】，在新增【<span style="color:red">入库单明细</span>】！');
			return;
		}
		dsEquBody.baseParams.params = "pid='" + CURRENTAPPID + "' and conid='"
				+ edit_conid + "'";
		dsEquBody.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
		equBodyWin.show();
	}

	function chooseEquBodyFun() {
		var sbrkUids = '';
		if (edit_uids == null || edit_uids == '') {
			sbrkUids = formPanel.getForm().findField("uids").getValue();

		} else {
			sbrkUids = edit_uids
		}
		var records = smEquBody.getSelections();
		if (records == null || records.length == 0) {
			Ext.example.msg('提示信息', '请选择主体设备！');
			return;
		} else {
			var getUids = new Array();
        	var getGGXHNull = new Array();
        	for(var i=0;i<records.length;i++){
        	    getUids.push(records[i].get('uids'));
        	    var querySql = "select ggxh from WZ_GOODS_BODYS where uids='"+records[i].get('uids')+"'"
        	    DWREngine.setAsync(false);
        	    baseMgm.getData(querySql,function(list){
	             	    if(list == null || list  == ""){
	            	       var temp = new Array();
	            	       temp.push(records[i].get('equNo'));
	            	       temp.push(records[i].get('equName'));
	            	       getGGXHNull.push(temp);
	            	    }
        	    })
        	    DWREngine.setAsync(true);
        	}
           if(getGGXHNull.length>0){
            		 var getGgxhNull = "";
            		 for(var k = 0; k <getGGXHNull.length ; k++){
            		     if(getGGXHNull.length == 1){
            		     	 getGgxhNull = "编码："+getGGXHNull[k][0]+",名称："+getGGXHNull[k][1]+"</br>";
            		     }else{
            		         if(k == getGGXHNull.length-1){
            		         	 getGgxhNull += "编码：【"+getGGXHNull[k][0]+"】,名称：【"+getGGXHNull[k][1]+"】</br>";
            		         }else{
            		         	 getGgxhNull += "编码：【"+getGGXHNull[k][0]+"】,名称：【"+getGGXHNull[k][1]+"】、</br>";
            		         }
            		     }
            		 }
            		 Ext.Msg.alert('信息提示','您选择的主体材料中:</br><span style="color:red;">'+getGgxhNull+'</span>【规格型号】为空,请填写完整保存后在选择' +
            		 		'</br>或选择规格型号不为空的记录！');
            	     return ;
            	}
			Ext.Msg.confirm('系统提示', '是否确定选择？', function(btn) {
						if (btn == 'yes') {
							DWREngine.setAsync(false);
							wzbaseinfoMgm.saveWzEsSubFromEquGoodsBody(getUids,
									sbrkUids, function(str) {
										if (str == "success") {
											Ext.example
													.msg(
															'提示信息',
															'您成功选择了<span style="color:red;">'
																	+ records.length
																	+ '</span>条主体设备信息！');
											equBodyWin.hide();
											dsSub.baseParams.params = "sbrk_uids='"
													+ sbrkUids
													+ "' and pid='"
													+ pid + "'";
											dsSub.load({
														params : {
															start : 0,
															limit : PAGE_SIZE
														}
													});
											smEquBody.clearSelections();
										}
									})
							DWREngine.setAsync(true);
						} else {
							smEquBody.clearSelections();
						}

					})
		}
	}
})
