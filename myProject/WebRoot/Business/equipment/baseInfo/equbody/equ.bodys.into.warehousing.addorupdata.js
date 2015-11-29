//设备入库新增或修改
var formPanel;
var noticeArr = new Array();
var beanCon = "com.sgepit.pmis.contract.hbm.ConOve";
var bean = "com.sgepit.pmis.equipment.hbm.EquGoodsStorein";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "uids";

//设备入库详细信息清单
var beanSub = "com.sgepit.pmis.equipment.hbm.EquGoodsStoreinSub";
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
var amountRateArr = new Array();
var gridPanelFj;
var formPanel;
var formPanelSub;
var noticeWinSub;
var updateEquid;//用于修改入库单时仓库号的判断
var oldWarehouseNo;//用于修改入库单仓库号时，入库单的判断，防止入库单号重复或变更。
//袁旭云新增
var cpid = "";
var cpname = "";
var equType = parent.parent.selectNodeText;
var warehouseType = "";

Ext.onReady(function() {
	//处理设备类型默认值
	if(equType == '主体设备'){
		warehouseType = 1;
	}
	if(equType == '备品备件'){
		warehouseType = 2;
	}
	if(equType == '专用工具'){
		warehouseType = 3;
	}

	//处理设备仓库下拉框
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
	baseMgm.getData("select uids,equid,wareno,waretype from equ_warehouse where pid='"
			+ CURRENTAPPID + "' order by equid ", function(list) {
		for (var i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][2]);
			temp.push(list[i][1]);
			for (var j = 0; j < typeArr.length; j++) {
				if (list[i][3] == typeArr[j][1]) {
					temp.push(typeArr[j][0]);
				}
			}
			equWareArr.push(temp);
		}
	});
	// 设备类型equTypeArr
	appMgm.getCodeValue("设备合同树分类", function(list) {
		for (i = 0; i < list.length; i++) {
			if (list[i].propertyCode == "4")
				continue;
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			equTypeArr.push(temp);
		}
	});
	appMgm.getCodeValue("金额税率", function(list) {
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			amountRateArr.push(temp);
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
	//根据合同获取乙方单位id
	baseMgm.getData("select b.cpid,b.partyb from con_ove c,con_partyb b where" +
			" c.partybno=b.cpid and c.conid='"+ edit_conid +"'", function(list) {
		if (list[0][0] && list[0][1]) {
			cpid = list[0][0];
			cpname = list[0][1];
			var temp = new Array();
			temp.push(cpid);
			temp.push(cpname);
			joinUnitArr.push(temp);
		}
	});
	// 主体设备参与单位
	appMgm.getCodeValue("主体设备参与单位", function(list) {
		for (i = 0; i < list.length; i++) {
			if (list[i].detailType == cpname){
				cpid = list[i].propertyCode;
				var temp = new Array();
				temp.push(cpid);
				temp.push(list[i].detailType);
				joinUnitArr.push(temp);
				break;
			}
		}
	});
	
	conpartybMgm.getPartyB(function(list) {
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].cpid);
			temp.push(list[i].partyb);
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
			});
	// 处理设备仓库仓库管理员
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
			});
	var specialArr = new Array();
	appMgm.getCodeValue("设备专业分类", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					specialArr.push(temp);
				}
			});
	var jzNoArr = new Array();
	appMgm.getCodeValue("机组号", function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					jzNoArr.push(temp);
				}
			});
	DWREngine.setAsync(true);

	// 设备仓库系统编码下来框
	var getEquid = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : equWareArr
			});
	// 金额税率
	var amountRateStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : amountRateArr
			});
	var equTypeArrs = [['1', '主体设备'], ['2', '备品备件'], ['3', '专用工具']];
	
	var equTypeDs = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : equTypeArrs
			});
	// 主体设备参与单位下来框
	var getJoinUnit = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : joinUnitArr
			});
	var getArray = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : warehouseManDs
			});
	var typeArray = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : [['暂估入库', '暂估入库'], ['正式入库', '正式入库']]
			});
	var specialStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : specialArr
			});
	var jzNoStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : jzNoArr
			});

	// 设备开箱通知单选择窗口
	var chooseBtn = new Ext.Button({
				id : 'addBtn',
				text : '选择',
				iconCls : 'btn',
				handler : chooseFun
			});

	// 异常设备选择
	var abnormalOrNoBtn = new Ext.Button({
				id : "abnormalOrNoBtn",
				text : '异常设备入库选择',
				iconCls : 'add',
				style : {
					top : 100,
					left : 10,
					width : 200
				},
				handler : abnormalOrNoFun
			});

	var noticeWin = new Ext.Window({
				width : 900,
				height : 450,
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
			});

	var adnormalWin = new Ext.Window({
				width : 900,
				height : 450,
				tbar : ['<font color=#15428b><B>异常信息<B></font>', '->',
						adnormalBtn],
				modal : true,
				plain : true,
				border : false,
				resizable : false,
				layout : 'fit',
				closeAction : 'hide',
				items : [gridPanelAdnoral]
			});

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
		'treeuids' : {
			name : 'treeuids',
			fieldLabel : '设备合同分类树'
		},
		'openBoxId' : {
			name : 'openBoxId',
			fieldLabel : '设备开箱主键'
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
			fieldLabel : '库管员'
		},
		'makeMan' : {
			name : 'makeMan',
			fieldLabel : '制单人'
		},
		'supplyunit' : {
			name : 'supplyunit',
			fieldLabel : '供货单位'
		},
		'invoiceno' : {
			name : 'invoiceno',
			fieldLabel : '发票号',
			width : 200
		},
		'equid' : {
			name : 'equid',
			fieldLabel : '仓库号'
		},
		'remark' : {
			name : 'remark',
			fieldLabel : '入库备注'
		},
		'abnormalOrNo' : {
			name : 'abnormalOrNo',
			fieldLabel : '是否异常'
		},
		'type' : {
			id : 'typeType',
			name : 'type',
			fieldLabel : '入库类型',
			readOnly : true,
			width : 200,
			readOnly : true,
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			emptyText : '请选择...',
			store : typeArray
		},
		'dataType' : {
			name : 'dataType',
			fieldLabel : '数据类型'
		},
		'recordUser' : {
			name : 'recordUser',
			fieldLabel : '创单人'
		},
		'createMan' : {
			name : 'createMan',
			fieldLabel : '创单人ID'
		},
		'createUnit' : {
			name : 'createUnit',
			fieldLabel : '填写单位'
		},
		'joinUnit' : {
			name : 'joinUnit',
			fieldLabel : '参与单位'
		},
		'special' : {
			name : 'special',
			fieldLabel : '专业类别',
			readOnly : true,
			width : 200,
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			store : specialStore
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
				name : 'treeuids',
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
				name : 'supplyunit',
				type : 'string'
			}, {
				name : 'invoiceno',
				type : 'string'
			}, {
				name : 'equid',
				type : 'string'
			}, {
				name : 'type',
				type : 'string'
			}, {
				name : 'createMan',
				type : 'string'
			}, {
				name : 'createUnit',
				type : 'string'
			}, {
				name : 'dataType',
				type : 'string'
			}, {
				name : 'recordUser',
				type : 'string'
			}, {
				name : 'joinUnit',
				type : 'string'
			}, {
				name : 'special',
				type : 'string'
			}];

	var formRecord = Ext.data.Record.create(Columns);
	var loadFormRecord = null;

	var conno;
	var conname;
	var partybno
	var moneysort;//合同分类二（财务）
	var conmoneyno;//财务合同编码
	DWREngine.setAsync(false);
	baseMgm.findById(beanCon, edit_conid, function(obj) {
				conno = obj.conno;
				conname = obj.conname;
				partybno = obj.partybno;
				moneysort = obj.moneysort;
				conmoneyno = obj.conmoneyno;
			});
	DWREngine.setAsync(true);
	var moneysortText;
	for (var i = 0; i < conno2cw.length; i++) {
		if (moneysort == conno2cw[i][0]) {
			moneysortText = conno2cw[i][1];
			break;
		}
	}

	var newRkNo = "";

//	var getSql = "select warehouse_no from EQU_GOODS_STOREIN t where conid='" + edit_conid
//			+ "' and treeuids ='" + edit_treeuids
//			+ "' and warehouse_no=(select max(warehouse_no)  from EQU_GOODS_STOREIN t where conid = '"
//			+ edit_conid + "' and treeuids = '" + edit_treeuids + "')";
//	DWREngine.setAsync(false);
//	baseMgm.getData(getSql, function(str) {
//				newRkNo = str.toString();
//			});
//	DWREngine.setAsync(true);
//	newRkNo = newRkNo.substring(0, newRkNo.length - 4);
//	if (newRkNo == null || newRkNo == "") {
//		// 获取单号前缀。前缀获取说明：在属性代码中配置“单号前缀”
//		var prefix = "";
//		var sql = "select c.property_name from PROPERTY_CODE c "
//				+ " where c.TYPE_NAME = (select t.uids from Property_Type t where t.TYPE_NAME = '单号前缀')"
//				+ " and c.property_code = '" + USERDEPTID + "' ";
//		DWREngine.setAsync(false);
//		baseMgm.getData(sql, function(str) {
//					prefix = str.toString();
//				});
//		DWREngine.setAsync(true);
//		// 处理入库检验单编号
//		newRkNo = prefix + "-" + conmoneyno.replace(/^\n+|\n+$/g, "") + "-RK-";
//	}
//	DWREngine.setAsync(false);
//	equMgm.getEquNewDhNo(CURRENTAPPID, newRkNo, "warehouse_no", "equ_goods_storein", null, function(str) {
//				newRkNo = str;
//			});
//	DWREngine.setAsync(true);

	//新设备仓库分类树
	var wareTreeCombo = new Ext.ux.TreeCombo({
				fieldLabel : '仓库号',
				resizable : true,
				width : 200,
				treeWidth : 230,
				allowBlank : false,
				loader : new Ext.tree.TreeLoader({
							url : MAIN_SERVLET,
							requestMethod : "GET",
							baseParams : {
								ac : "tree",
								treeName : "ckxxTreeNew",
								businessName : "equBaseInfo",
								parent : '01',
								conid : edit_conid
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
	wareTreeCombo.getTree().on('beforeload', function(node) {
				wareTreeCombo.getTree().loader.baseParams.parent = node.id;
			});
	wareTreeCombo.on('select', function(tree, node) {
		if (node.id == '01') {
			Ext.example.msg("信息提示：", "请选择此分类下的子分类！");
			wareTreeCombo.setRawValue("");
			return;
		}
		
		for (var j = 0; j < equidS.length; j++) {
			if (node.id == equidS[j]) {
				Ext.example.msg("信息提示：", "请选择此分类下的仓库！");
				wareTreeCombo.setRawValue("");
				return;
			}
		}
		var equid = "";
		for (var i = 0; i < equWareArr.length; i++) {
			if (node.id == equWareArr[i][2]) {
				if (equWareArr[i][3] == null || equWareArr[i][1] == null) {
					Ext.example.msg("信息提示：", "请选择主体设备、材料对应的仓库！");
					wareTreeCombo.setRawValue("");
					wareTreeCombo.setValue("");
					return false;
				} else {
					equid = equWareArr[i][3] + " - " + equWareArr[i][1];
					formPanel.getForm().findField("equid").setValue(node.id);
					break;
				}
			}
		}
		this.setRawValue(equid);
		wareTreeCombo.validate();
		var newRkNo = "";
		//获取单号前缀。前缀获取说明：在属性代码中配置“单号前缀”
		var prefix = "";
		DWREngine.setAsync(false);
		baseMgm.getData("select warenocode from equ_warehouse where EQUID='"
				+ node.id + "' and pid='" + CURRENTAPPID + "'", function(str) {
			prefix = str + "";
		});
		DWREngine.setAsync(true);
		var current_year = (new Date().getFullYear() + "").substring(2);
		var current_month = (new Date().getMonth() + 101 + "").substring(1);
		var type = "ZSRK";//正式入库
		//处理入库检验单编号
		if ((edit_mark == "markTrue") && (formPanel.getForm().findField("type").getValue() == "暂估入库")) {
			newRkNo = prefix + "-" + current_year + "-" + current_month + "-ZGRK-";
			type = "ZGRK";
		} else {
			newRkNo = prefix + "-" + current_year + "-" + current_month + "-ZSRK-";
		}
		DWREngine.setAsync(false);
		equMgm.getEquNewDhNoToSbCG(CURRENTAPPID, newRkNo, "warehouse_no", "equ_goods_storein",
				null, "data_type='EQUBODY'", function(str) {
			newRkNo = str;
		});
		DWREngine.setAsync(true);
		if (edit_uids == null || edit_uids == "") {//新增
			formPanel.getForm().findField("warehouseNo").setValue(newRkNo);
		} else {
			var strs = oldWarehouseNo.split('-');//oldWarehouseNo
			var oldType = strs[strs.length-2];
			if (updateEquid == node.id && oldType == type) {
				var str = prefix;
				for (var i = 1; i < strs.length; i++) {
					str += "-" + strs[i];
				}
				formPanel.getForm().findField("warehouseNo").setValue(str);
			} else {
				formPanel.getForm().findField("warehouseNo").setValue(newRkNo);
			}
		}
	});

	if (edit_uids == null || edit_uids == "") {
		loadFormRecord = new formRecord({
					uids : '',
					pid : CURRENTAPPID,
					conid : edit_conid,
					treeuids : edit_treeuids,
					openBoxId : '',
					finished : 0,
					warehouseNo : newRkNo,
					warehouseDate : new Date(),
					noticeNo : getKxNotice,
					warehouseMan : '',
					makeMan : REALNAME,
					remark : '',
					abnormalOrNo : '',
					supplyunit : partybno,
					invoiceno : '',
					equid : '',
					type : '正式入库',
					dataType : dataType,
					createMan : USERID,
					createUnit : USERDEPTID,
					recordUser : REALNAME,
					joinUnit : cpid,
					special : ''
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
				fieldLabel : '供货单位',
				readOnly : true,
				width : 160,
				valueField : 'k',
				displayField : 'v',
				mode : 'local',
				typeAhead : true,
				allowBlank : false,
				triggerAction : 'all',
				disabled:true,
				store : getJoinUnit
			})
	var typeComBox = new fm.ComboBox(fc['type']);

	if (edit_mark == "markTrue") {
		formPanel = new Ext.FormPanel({
					region : 'north',
					height : 110,
					border : false,
					labelAlign : 'right',
					bodyStyle : 'padding:5px 10px;',
					labelWidth : 80,
					tbar : view == 'view' ? ['<font color=#15428b><B>入库单信息<B></font>']
							: ['<font color=#15428b><B>入库单信息<B></font>', '->', saveBtn, '-', cancelBtn],
					items : [{
						layout : 'column',
						border : false,
						items : [{
							layout : 'form',
							columnWidth : .33,
							border : false,
							items : [typeComBox,
									wareTreeCombo,
									new fm.ComboBox(fc['special']),
									new fm.Hidden(fc['uids']),
									new fm.Hidden(fc['pid']),
									new fm.Hidden(fc['conid']),
									new fm.Hidden(fc['treeuids']),
									new fm.Hidden(fc['openBoxId']),
									new fm.Hidden(fc['finished']),
									new fm.Hidden(fc['equid']),
									new fm.Hidden(fc['supplyunit']),
									new fm.Hidden(fc['warehouseMan']),
									new fm.Hidden(fc['createMan']),
									new fm.Hidden(fc['createUnit']),
									new fm.Hidden(fc['recordUser']),
									new fm.Hidden(fc['dataType']),
									new fm.Hidden(fc['abnormalOrNo'])]
						}, {
							layout : 'form',
							columnWidth : .33,
							border : false,
							items : [getJoinUnitCom,
									new fm.DateField(fc['warehouseDate']),
									new fm.Hidden(fc['makeMan'])]
						}, {
							layout : 'form',
							columnWidth : .33,
							border : false,
							buttonAlign : 'right',
							items : [new fm.TextField(fc['warehouseNo']),
									new fm.TextField(fc['invoiceno'])

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
		formPanel = new Ext.FormPanel({
					region : 'north',
					height : 85,
					border : false,
					labelAlign : 'right',
					bodyStyle : 'padding:5px 10px;',
					labelWidth : 80,
					tbar : view == 'view'
							? ['<font color=#15428b><B>入库单信息<B></font>']
							: ['<font color=#15428b><B>入库单信息<B></font>', '->',
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
									new fm.Hidden(fc['treeuids']),
									new fm.Hidden(fc['openBoxId']),
									new fm.Hidden(fc['finished']),
									new fm.Hidden(fc['equid']),
									new fm.Hidden(fc['type']),
									new fm.Hidden(fc['supplyunit']),
									new fm.Hidden(fc['warehouseMan']),
									new fm.Hidden(fc['createMan']),
									new fm.Hidden(fc['createUnit']),
									new fm.Hidden(fc['recordUser']),
									new fm.Hidden(fc['dataType']),
									new fm.Hidden(fc['abnormalOrNo']),
									getJoinUnitCom, wareTreeCombo]
						}, {
							layout : 'form',
							columnWidth : .33,
							border : false,
							items : [new fm.TextField(fc['warehouseNo']),
									new fm.DateField(fc['warehouseDate']),
									new fm.Hidden(fc['makeMan'])]
						}, {
							layout : 'form',
							columnWidth : .33,
							border : false,
							buttonAlign : 'right',
							items : [new fm.TextField(fc['invoiceno'])

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
	typeComBox.on('select', function(node) {
		var gatType = "";
		var getSubNum = 0;
		var getJoinUnit = formPanel.getForm().findField("joinUnit").getValue();
		var getWarehouseNo = formPanel.getForm().findField("warehouseNo").getValue();
		var getEquid = formPanel.getForm().findField("equid").getValue();
		var getUids = formPanel.getForm().findField('uids').getValue();
		var sql = "select t.type,(select count(sbrk_uids) from EQU_GOODS_STOREIN_SUB r "
				+ " where r.sbrk_uids=t.uids) as num,join_unit,warehouse_no,equid from EQU_GOODS_STOREIN t "
				+ " where t.PID = '" + CURRENTAPPID + "' and t.uids = '" + getUids + "'"
		DWREngine.setAsync(false);
		baseMgm.getData(sql, function(list) {
					if (list) {
						for (var i = 0; i < list.length; i++) {
							gatType = list[i][0];
							getSubNum = list[i][1];
							getJoinUnit = list[i][2];
							getWarehouseNo = list[i][3];
							getEquid = list[i][4];
						}
					}
				})
		DWREngine.setAsync(true);
		if (typeComBox.getValue() != gatType) {
			if (getSubNum != 0) {
				typeComBox.setValue(gatType);
				Ext.MessageBox.alert("系统提示",
						"执行该操作要先删除该出库单所有的入库单明细，请先删除该入库单明细在执行此操作！")
				return;
			} else {
				formPanel.getForm().findField("warehouseNo").setValue("");
				wareTreeCombo.setValue("");
				wareTreeCombo.setRawValue("");
			}
		} else {
			formPanel.getForm().findField("joinUnit").setValue(getJoinUnit);
			formPanel.getForm().findField("warehouseNo").setValue(getWarehouseNo);
			wareTreeCombo.setValue(getEquid);
			for (var i = 0; i < equWareArr.length; i++) {
				if (getEquid == equWareArr[i][2]) {
					wareTreeCombo.setRawValue(equWareArr[i][3] + " - " + equWareArr[i][1]);
				}
			}
		}
	})
	//对入库单编号的处理
/*	getJoinUnitCom.on('select', function(node) {
    	var newRkNo = "";
		// 获取单号前缀。前缀获取说明：在属性代码中配置“单号前缀”
		var prefix = "";
		var sql = "select c.property_name from PROPERTY_CODE c "
				+ " where c.TYPE_NAME = (select t.uids from Property_Type t where t.TYPE_NAME = '单号前缀')"
				+ " and c.property_code = '" + getJoinUnitCom.getValue() + "' ";
		DWREngine.setAsync(false);
		baseMgm.getData(sql, function(str) {
					prefix = str + "";
				});
		DWREngine.setAsync(true);
		var length = prefix.length + 1;
		// 处理入库检验单编号
		if ((edit_mark == "markTrue")
				&& (formPanel.getForm().findField("type").getValue() == "暂估入库")) {
			newRkNo = "-" + conno.replace(/^\n+|\n+$/g, "") + "-ZGRK-";
		} else {
			newRkNo = "-" + conno.replace(/^\n+|\n+$/g, "") + "-RK-";
		}
		DWREngine.setAsync(false);
		// equMgm.getEquNewDhNoToSb(CURRENTAPPID,newRkNo,"warehouse_no","equ_goods_storein",null,"data_type='EQUBODY'",function(str){
		// newRkNo = str;
		// });
		equMgm.getEquNewDhNoToSbJn(CURRENTAPPID, newRkNo, "warehouse_no", "equ_goods_storein", null, "data_type='EQUBODY'", length,
				function(str) {
					newRkNo = str;
				});
		DWREngine.setAsync(true);
		var value = formPanel.getForm().findField("warehouseNo").getValue();
		if (value == null || value == "") {
			formPanel.getForm().findField("warehouseNo").setValue(prefix + newRkNo)
		} else {
			var strs = value.split('-');
			var str = prefix;
			for (var i = 1; i < strs.length; i++) {
				str += "-" + strs[i];
			}
			formPanel.getForm().findField("warehouseNo").setValue(str)
		}
	})*/

	// 对异常设备和正常开箱设备修改时进行二选一控制
	if (banFlag == '1') {
		Ext.getCmp('noticeNo').setDisabled(true);
		abnormalOrNoBtn.setDisabled(false);
	} else if (banFlag == '0') {
		Ext.getCmp('noticeNo').setDisabled(false);
		abnormalOrNoBtn.setDisabled(true);
	}
	// ----------------------入库详细清单--------------------------------

	var smSub = new Ext.grid.CheckboxSelectionModel({
				header : '',
				singleSelect : false
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
			fieldLabel : '设备入库主表主键'
		},
		'boxSubId' : {
			name : 'boxSubId',
			fieldLabel : '设备开箱明细表主键'
		},
		'boxNo' : {
			name : 'boxNo',
			fieldLabel : '箱件号'
		},
		'warehouseType' : {
			name : 'warehouseType',
			fieldLabel : '设备类型' + requiredMark,
			readOnly : true,
			allowBlank : false,
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			store : equTypeDs
		},
		'warehouseName' : {
			name : 'warehouseName',
			fieldLabel : '设备名称' + requiredMark,
			allowBlank : false
		},
		'ggxh' : {
			name : 'ggxh',
			fieldLabel : '规格型号' + requiredMark,
			allowBlank : false
		},
		'unit' : {
			name : 'unit',
			fieldLabel : '单位'
		},
		'inWarehouseNo' : {
			name : 'inWarehouseNo',
			fieldLabel : '数量',
			decimalPrecision : 4
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
			decimalPrecision : 2
		},
		'totalMoney' : {
			name : 'totalMoney',
			fieldLabel : '入库金额',
			allowBlank : true,
			decimalPrecision : 2
		},
		'amountRate' : {
			id : 'amountRate',
			name : 'amountRate',
			fieldLabel : '金额税率',
			mode : 'local',
			editable : false,
			valueField : 'k',
			displayField : 'v',
			readOnly : true,
			listWidth : 80,
			lazyRender : true,
			triggerAction : 'all',
			store : amountRateStore,
			//tpl: "<tpl for='.'><div style='height:200px'><div id='tree'></div></div></tpl>",
			listClass : 'x-combo-list-small'
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
			fieldLabel : '检验数量',
			decimalPrecision : 4
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
			allowBlank : true
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
		},
		'jzNo' : {
			name : 'jzNo',
			fieldLabel : '机组号',
			readOnly : true,
			valueField : 'k',
			displayField : 'v',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			store : jzNoStore
		}
	};

	var equnoComboBox = new fm.ComboBox(fcSub['equno']);
	equnoComboBox.on('beforequery', function() {
				newtreePanel.on('beforeload', function(node) {
							var parent = node.attributes.equid;
							if (parent == null || parent == "")
								parent = '01';
							var baseParams = newtreePanel.loader.baseParams;
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
						formPanelSub.getForm().findField('equno').setValue(uids);
					}
					for (var i = 0; i < equWareArr.length; i++) {
						if (node.id == equWareArr[i][2]) {
							equnoComboBox.setValue(uids);
							equnoComboBox.setRawValue(equWareArr[i][3] + " - " + equWareArr[i][1]);
						}
					}
					equnoComboBox.collapse();
				}
			})

	var edit_flag = true;
	if (edit_mark == "markTrue") {
		edit_flag = false;
	}
	var cmSub = new Ext.grid.ColumnModel([smSub,
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
			}, {
				id : 'boxSubId',
				header : fcSub['boxSubId'].fieldLabel,
				dataIndex : fcSub['boxSubId'].name,
				hidden : true
			}, {
				id : 'boxNo',
				header : fcSub['boxNo'].fieldLabel,
				dataIndex : fcSub['boxNo'].name,
				editor : new fm.TextField(fcSub['boxNo']),
				renderer : rendererColumnColorFun,
				align : 'right',
				hidden : true
			}, {
				id : 'warehouseType',
				header : fcSub['warehouseType'].fieldLabel,
				dataIndex : fcSub['warehouseType'].name,
				align : 'center',
				editor : new fm.ComboBox(fcSub['warehouseType']),
				renderer : function(v, m, r) {
					var equ = "";
					m.attr = rendererColumnColorMark;
					for (var i = 0; i < equTypeArr.length; i++) {
						if (v == equTypeArr[i][0])
							equ = equTypeArr[i][1];
					}
					return equ;
				}
			}, {
				id : 'warehouseName',
				header : fcSub['warehouseName'].fieldLabel,
				dataIndex : fcSub['warehouseName'].name,
				align : 'center',
				width : 200
			}, {
				id : 'ggxh',
				header : fcSub['ggxh'].fieldLabel,
				dataIndex : fcSub['ggxh'].name,
				align : 'center',
				width : 100
			}, {
				id : 'jzNo',
				header : fcSub['jzNo'].fieldLabel,
				dataIndex : fcSub['jzNo'].name,
				align : 'center',
				width : 80,
				editor : new fm.ComboBox(fcSub['jzNo']),
				renderer : function(v, m, r){
					m.attr = rendererColumnColorMark;
					for (var i=0; i<jzNoArr.length; i++){
						if (v == jzNoArr[i][0]){
							return jzNoArr[i][1];
						}
					}
				}
			}, {
				id : 'unit',
				header : fcSub['unit'].fieldLabel,
				dataIndex : fcSub['unit'].name,
				editor : new fm.TextField(fcSub['unit']),
				renderer : rendererColumnColorFun,
				align : 'center',
				width : 100
			}, {
				id : 'inWarehouseNo',
				header : fcSub['inWarehouseNo'].fieldLabel,
				dataIndex : fcSub['inWarehouseNo'].name,
				renderer : rendererColumnColorFun,
				editor : new fm.NumberField(fcSub['inWarehouseNo']),
				align : 'right',
				width : 80
			}, {
				id : 'unitPrice',
				header : fcSub['unitPrice'].fieldLabel,
				dataIndex : fcSub['unitPrice'].name,
				renderer : rendererColumnColorFun,
				editor : new fm.NumberField(fcSub['unitPrice']),
				align : 'right',
				hidden : edit_flag,
				width : 80
			}, {
				id : 'amountMoney',
				header : fcSub['amountMoney'].fieldLabel,
				dataIndex : fcSub['amountMoney'].name,
				renderer : rendererColumnColorFun,
				editor : new fm.NumberField(fcSub['amountMoney']),
				align : 'right',
				hidden : edit_flag,
				width : 80
			}, {
				id : 'freightMoney',
				header : fcSub['freightMoney'].fieldLabel,
				dataIndex : fcSub['freightMoney'].name,
				renderer : rendererColumnColorFun,
				editor : new fm.NumberField(fcSub['freightMoney']),
				align : 'right',
				hidden : edit_flag,
				width : 80
			}, {
				id : 'insuranceMoney',
				header : fcSub['insuranceMoney'].fieldLabel,
				dataIndex : fcSub['insuranceMoney'].name,
				renderer : rendererColumnColorFun,
				editor : new fm.NumberField(fcSub['insuranceMoney']),
				align : 'right',
				hidden : edit_flag,
				width : 80
			}, {
				id : 'antherMoney',
				header : fcSub['antherMoney'].fieldLabel,
				dataIndex : fcSub['antherMoney'].name,
				renderer : rendererColumnColorFun,
				editor : new fm.NumberField(fcSub['antherMoney']),
				align : 'right',
				hidden : edit_flag,
				width : 80
			}, {
				id : 'intoMoney',
				header : fcSub['intoMoney'].fieldLabel,
				dataIndex : fcSub['intoMoney'].name,
				align : 'right',
				hidden : edit_flag,
				renderer : function(v) {
					if (isNaN(v) == true) {
						return v.toFixed(2);
					} else {
						return parseFloat(v, 10).toFixed(2);
					}
				},
				width : 80
			}, {
				id : 'totalMoney',
				header : fcSub['totalMoney'].fieldLabel,
				dataIndex : fcSub['totalMoney'].name,
				align : 'right',
				hidden : edit_flag,
				width : 80
			}, {
				id : 'amountRate',
				header : fcSub['amountRate'].fieldLabel,
				dataIndex : fcSub['amountRate'].name,
				align : 'right',
				editor : new fm.ComboBox(fcSub['amountRate']),
				renderer : function(v, m, r) {
					var str = '';
					m.attr = rendererColumnColorMark;
					if (v && v != null) {
						for (var i = 0; i < amountRateArr.length; i++) {
							if (v == amountRateArr[i][0]) {
								str = amountRateArr[i][1];
							}
						}
					}
					return str;
				},
				width : 80
			}, {
				id : 'amountTax',
				header : fcSub['amountTax'].fieldLabel,
				dataIndex : fcSub['amountTax'].name,
				renderer : rendererColumnColorFun,
				editor : new fm.NumberField(fcSub['amountTax']),
				align : 'right',
				hidden : edit_flag,
				width : 80
			}, {
				id : 'freightTax',
				header : fcSub['freightTax'].fieldLabel,
				dataIndex : fcSub['freightTax'].name,
				renderer : rendererColumnColorFun,
				editor : new fm.NumberField(fcSub['freightTax']),
				align : 'right',
				hidden : edit_flag,
				width : 80
			}, {
				id : 'insuranceTax',
				header : fcSub['insuranceTax'].fieldLabel,
				dataIndex : fcSub['insuranceTax'].name,
				renderer : rendererColumnColorFun,
				editor : new fm.NumberField(fcSub['insuranceTax']),
				align : 'right',
				hidden : edit_flag,
				width : 80
			}, {
				id : 'antherTax',
				header : fcSub['antherTax'].fieldLabel,
				dataIndex : fcSub['antherTax'].name,
				renderer : rendererColumnColorFun,
				editor : new fm.NumberField(fcSub['antherTax']),
				align : 'right',
				hidden : edit_flag,
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
				renderer : rendererColumnColorFun,
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
				hidden : edit_flag,
				width : 80
			}, {
				id : 'equno',
				header : fcSub['equno'].fieldLabel,
				dataIndex : fcSub['equno'].name,
				renderer : function(v, m, r) {
					var equno = "";
					m.attr = rendererColumnColorMark;
					for (var i = 0; i < equWareArr.length; i++) {
						if (v == equWareArr[i][0])
							equno = equWareArr[i][3] + " - " + equWareArr[i][1];
					}
					return equno;
				},
				align : 'center',
				width : 160,
				editor : equnoComboBox
			}, {
				id : 'stockno',
				header : fcSub['stockno'].fieldLabel,
				dataIndex : fcSub['stockno'].name,
				align : 'center',
				editor : new fm.TextField(fcSub['stockno']),
				renderer : rendererColumnColorFun,
				width : 200
			}, {
				id : 'memo',
				header : fcSub['memo'].fieldLabel,
				dataIndex : fcSub['memo'].name,
				align : 'center',
				editor : new fm.TextField(fcSub['memo']),
				renderer : rendererColumnColorFun,
				width : 200,
				hidden : true
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
				type : 'string'
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
			}, {
				name : 'intoMoney',
				type : 'float'
			}, {
				name : 'totalMoney',
				type : 'float'
			}, {
				name : 'amountRate',
				type : 'string'
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
			}, {
				name : 'jzNo',
				type : 'string'
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
	dsSub.setDefaultSort(orderColumnSub, 'desc'); //设置默认排序列

	var PlantSub = Ext.data.Record.create(ColumnsSub);
	var PlantIntSub = {
		uids : '',
		pid : CURRENTAPPID,
		sbrkUids : edit_uids == '' ? '' : edit_uids,
		boxSubId : '',
		warehouseType : '',
		warehouseName : '',
		ggxh : '',
		unit : '',
		inWarehouseNo : 0,
		unitPrice : 0,
		amountMoney : 0,
		freightMoney : 0,
		insuranceMoney : 0,
		antherMoney : 0,
		intoMoney : 0,
		totalMoney : 0,
		amountRate : '',
		amountTax : 0,
		freightTax : 0,
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
		memo : '',
		jzNo : ''
	}
	var addGridBtn = new Ext.Button({
				id : 'addBtn',
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
				text : '异常设备部件删除',
				iconCls : 'remove',
				handler : delGridFun
			});
	var chooseEquBodyBtn = new Ext.Button({
				text : '确认选择',
				iconCls : 'btn',
				handler : chooseEquBodyFun
			});
	var equBodyWin = new Ext.Window({
				width : 900,
				height : 450,
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
	var selectFromEquBodyBtn = new Ext.Button({
				text : '从主体设备选择',
				iconCls : 'btn',
				handler : selectFromEquBodyFun
			});
	if (banFlag == null || banFlag == '') {
		delBtn.setVisible(false);
	}
	if (banFlag == '1') {
		delBtn.setVisible(true);
	} else if (banFlag == '0') {
		delBtn.setVisible(false);
	}
	var cmArray = [['selectAll', '全部']];
	var cmHide = new Array();

	var store1 = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : cmArray
			});
	var chooseRow = new Ext.form.MultiSelect({
				id : 'chooserow',
				width : 150,
				store : store1,
				readOnly : true,
				displayField : 'v',
				valueField : 'k',
				emptyText : '显示更多信息',
				value : '显示更多信息',
				mode : 'local',
				triggerAction : 'all',
				onSelect : function(r, i) {
					var colModel = gridPanelSub.getColumnModel();
					if (i == 0) {
						if (r.get(this.checkField)) {
							chooseRow.setValue(cmHide);
							cmSelectById(colModel, cmHide);
						} else {
							this.selectAll();
							cmSelectById(colModel, this.getCheckedValue());
						}
					} else {
						r.set(this.checkField, !r.get(this.checkField));
						chooseRow.setValue(this.getCheckedValue());
						cmSelectById(colModel, this.getCheckedValue());
					}
				}
			});

	function cmSelectById(cm, str) {
		var cmHide = str.toString().split(',');
		var lockedCol = colModel.getLockedCount()
		for (var i = lockedCol + 1; i < cm.getColumnCount(); i++) {
			for (var j = 0; j < cmHide.length; j++) {
				if (cm.getDataIndex(i) == cmHide[j]) {
					cm.setHidden(i, false);
					break;
				} else {
					cm.setHidden(i, true);
				}
			}
		}
	}

	var gridPanelSub = new Ext.grid.EditorGridTbarPanel({
				ds : dsSub,
				cm : cmSub,
				sm : smSub,
				title : '入库单明细',
				tbar : ['<font color=#15428b><B>入库单明细<B></font>'],//,addGridBtn,'-',saveGridBtn,'-',delBtn
				header : false,
				height : document.body.clientHeight * 0.5,
				border : false,
				autoWidth : true,
				region : 'center',
				addBtn : false, // 是否显示新增按钮
				saveBtn : view != 'view', // 是否显示保存按钮
				delBtn : view != 'view', // 是否显示删除按钮
				stripeRows : true,
				loadMask : true,
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({//在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : dsSub,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				insertHandler : insertFn, // 自定义新增方法，可选
				saveHandler : saveFn,// 自定义保存方法，可选
				deleteHandler : deleteFn, // 自定义删除方法，可选
				plant : PlantSub,
				plantInt : PlantIntSub,
				servletUrl : MAIN_SERVLET,
				bean : beanSub,
				business : businessSub,
				primaryKey : primaryKeySub,
				listeners : {
					'beforeedit' : function(e) {
						if (view == 'view')
							return false;
					}
				}
			});
//	gridPanelSub.on("aftersave",function(){
//	    dsSub.load({params:{start:0,limit:PAGE_SIZE}});
//	});
	gridPanelSub.on("afteredit", function(obj) {
		var r = obj.record;
		var amountRate = 0;
		if (r != null) {
			var rate = r.get('amountRate');
			for (var i = 0; i < amountRateArr.length; i++) {
				if (rate == amountRateArr[i][0]) {
					amountRate = amountRateArr[i][1];
				}
			}
			amountRate = parseFloat(amountRate) / 100;
			if (r.get('amountMoney') != null || r.get('amountMoney') != "") {
				if (r.get('inWarehouseNo') == 0) {
					r.set('unitPrice', 0);
				} else {
					r.set('unitPrice', (r.get('amountMoney') / r.get('inWarehouseNo')).toFixed(6))
				}
			}
			if (r.get('amountMoney') != "" || r.get('antherMoney') != null) {
				var totalMonety = r.get('freightMoney') + r.get('insuranceMoney') + r.get('antherMoney') + r.get('amountMoney');
				r.set('totalMoney', totalMonety.toFixed(2));
			}
			if (r.get('inWarehouseNo') != null && (r.get('totalMoney') != null || r.get('totalMoney') != '')) {
				if (r.get('inWarehouseNo') == 0) {
					r.set('intoMoney', 0);
				} else {
					r.set('intoMoney', (r.get('totalMoney') / r.get('inWarehouseNo')).toFixed(6));
				}
			}
			if (obj.field != 'amountTax'){
				r.set('amountTax', (r.get('inWarehouseNo') * r.get('unitPrice') * amountRate).toFixed(2));
//				r.set('taxes', (((r.get('inWarehouseNo')* r.get('unitPrice') * amountRate).toFixed(2)) / 1
//					+ r.get('freightTax') / 1 + r.get('insuranceTax') / 1 + r.get('antherTax')/ 1).toFixed(2));
			}
			r.set('taxes', ((r.get('amountTax') / 1 + r.get('freightTax') / 1 + r.get('insuranceTax') / 1 + r.get('antherTax')/ 1).toFixed(2)));
		}
	});
	//修改数据后如果翻页，提醒先保存在进行下一页的编辑         yanglh 2013-11-21
	dsSub.on('beforeload', function(store, obj) {
				var record = dsSub.getModifiedRecords();
				if (record.length > 0) {
					Ext.example.msg("系统提示", "当前有数据被修改过，请保存后在编辑下一页的数据！");
					return false;
				}
			})

	var url = BASE_PATH + "Business/equipment/equMgm/equ.file.list.jsp" + "?uids=" + edit_uids + "&uuid="
			+ edit_treeuids + "&conid=" + edit_conid + "&edit=true&type=KX";
	var filePanel = new Ext.Panel({
				id : 'filePanel',
				title : '附件',
				layout : 'fit',
				html : "<iframe id='fileWinFrame' src='" + url + "' width='100%' height='100%' frameborder='0'></iframe>"
			});

	var tabPanel = new Ext.TabPanel({
				activeTab : 0,
				border : false,
				region : 'center',
				items : view == 'view' ? [gridPanelSub] : [gridPanelSub, filePanel]
			})

	var viewPort = new Ext.Viewport({
				layout : 'border',
				items : [formPanel, tabPanel]
			});
	var gridTopBar = gridPanelSub.getTopToolbar()
	view == 'view' ? gridTopBar.add('->', chooseRow) : gridTopBar.add('-', selectFromEquBodyBtn, '->', chooseRow);

	for (var o in fcSub) {
		var name = fcSub[o];
		var temp = new Array();
		temp.push(fcSub[o].name);
		temp.push(fcSub[o].fieldLabel);
		var colModel = gridPanelSub.getColumnModel();
		//锁定列不在显示更多信息中出现
		if (colModel.getLockedCount() <= colModel.findColumnIndex(fcSub[o].name)) {
			cmArray.push(temp);
			if (!colModel.isHidden(colModel.getIndexById(o))) {
				cmHide.push(o);
			}
		}
	}
	store1.loadData(cmArray)
	chooseRow.setValue(cmHide);
	chooseRow.setRawValue("显示更多信息");

	Ext.get("chooserow").on("mouseout", function() {
				if (chooseRow.getValue() == "" || chooseRow.getValue() == null) {
					chooseRow.setValue(cmHide);
					chooseRow.setRawValue("显示更多信息");
				}
			}, this);

	function selectFromEquBodyFun() {
		var sbrkUids = '';
		if (edit_uids == null || edit_uids == '') {
			sbrkUids = formPanel.getForm().findField("uids").getValue();

		} else {
			sbrkUids = edit_uids
		}
		if (sbrkUids == '') {
			Ext.example.msg('提示信息', '请先保存【<span style="color:red">入库单信息</span>】，在新增【<span style="color:red">入库单明细</span>】！');
			return;
		}
		dsEquBody.baseParams.params = "pid='" + CURRENTAPPID + "' and conid='" + edit_conid + "'";
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
//		if(edit_uids == null || edit_uids == ''){
		sbrkUids = formPanel.getForm().findField("uids").getValue();
//		}else{
//			sbrkUids = edit_uids
//		}
//		var records = smEquBody.getSelections();
		var records = collectionToRecords();
		if (records == null || records.length == 0) {
			Ext.example.msg('提示信息', '请选择主体设备！');
			return;
		} else {
			var getUids = new Array();
			var getGgxhNull = new Array();
			for (var i = 0; i < records.length; i++) {
				getUids.push(records[i].get('uids'));
				var querySql = "select ggxh from EQU_GOODS_BODYS where uids='" + records[i].get('uids') + "'";
				DWREngine.setAsync(false);
				baseMgm.getData(querySql, function(list) {
							if (list == null || list == "") {
								var temp = new Array();
								temp.push(records[i].get('equNo'));
								temp.push(records[i].get('equName'));
								getGgxhNull.push(temp);
							}
						})
				DWREngine.setAsync(true);
			}
			if (getGgxhNull.length > 0) {
				var getMsg = ""
				for (var k = 0; k < getGgxhNull.length; k++) {
					if (getGgxhNull.length == 1) {
						getMsg = "编码：【" + getGgxhNull[k][0] + "】，名称：【" + getGgxhNull[k][1] + "】</br>";
					} else {
						if (k == getGgxhNull.length - 1) {
							getMsg += "编码：【" + getGgxhNull[k][0] + "】，名称：【" + getGgxhNull[k][1] + "】</br>";
						} else {
							getMsg += "编码：【" + getGgxhNull[k][0] + "】，名称：【" + getGgxhNull[k][1] + "】、</br>";
						}
					}
				}
				Ext.Msg.alert('信息提示', '您选择的主体设备以下：</br>' + '<span style="color:red;">' + getMsg
								+ '</span>【规格型号】为空，请填写完整保存后选择</br>或选择规格型号不为空的记录！')
				return;
			}
			Ext.Msg.confirm('系统提示', '是否确定选择？', function(btn) {
						if (btn == 'yes') {
							DWREngine.setAsync(false);
							equMgm.getEquSubFromEquGoodsBody(getUids, sbrkUids, warehouseType, function(str) {
								if (str == "success") {
									Ext.example.msg('提示信息', '您成功选择了<span style="color:red;">'
												+ records.length + '</span>条主体设备信息！');
									equBodyWin.hide();
									dsSub.baseParams.params = "sbrk_uids='" + sbrkUids + "' and pid='" + pid + "'";
									dsSub.load({
												params : {
													start : 0,
													limit : PAGE_SIZE
												}
											});
									smEquBody.clearSelections();
								}
							});
							DWREngine.setAsync(true);
						} else {
							smEquBody.clearSelections();
						}

					})
		}
	}
	//新增时根据合同分类二（财务）属性代码的中文配置，与仓库号中文对比匹配，自动设置
	if (edit_uids == null || edit_uids == "") {
		for (var i = 0; i < equWareArr.length; i++) {
			if (moneysortText == equWareArr[i][2]) {
				wareTreeCombo.setValue(equWareArr[i][1]);
				wareTreeCombo.setRawValue(equWareArr[i][3] + " - " + equWareArr[i][1]);
			}
		}
	}

	wareTreeCombo.setValue(loadFormRecord.get("equid"));
	for (var i = 0; i < equWareArr.length; i++) {
		if (loadFormRecord.get("equid") == equWareArr[i][2])
			wareTreeCombo.setRawValue(equWareArr[i][3] + " - " + equWareArr[i][1]);
	}
	formPanel.getForm().loadRecord(loadFormRecord);
	wareTreeCombo.validate();
	updateEquid = loadFormRecord.get("equid");
	oldWarehouseNo = loadFormRecord.get("warehouseNo");
	dsSub.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});

	//---------------function-------------
	function insertFn() {
		var sbrkUids = '';
		if (edit_uids == null || edit_uids == '') {
			sbrkUids = formPanel.getForm().findField("uids").getValue();
		} else {
			sbrkUids = edit_uids
		}
		if (sbrkUids == '') {
			Ext.example.msg('提示信息', '请先保存【<span style="color:red">入库单信息</span>】，在新增【<span style="color:red">入库单明细</span>】！');
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
//										new fm.TextField(fcSub['equno']),
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
										new fm.TextField(fcSub['warehouseNum']),
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
							}
						}]

			})
		}
		if (!noticeWinSub) {
			noticeWinSub = new Ext.Window({
						width : 920,
						height : 450,
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
			PlantIntSub.sbrkUids = formPanel.getForm().findField("uids").getValue();
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
			baseMgm.getData("select t.equid,t.waretypecode,t.warenocode from equ_warehouse t where t.equid='" + getEquid + "'", function(str) {
								if (str.length > 0) {
									getBoxNo = str[0][1] + "-" + str[0][2] + "-";
								}
							})
			DWREngine.setAsync(true);
			DWREngine.setAsync(false);
			equMgm.getEquNewDhNo(CURRENTAPPID, getBoxNo, "stockno", "equ_goods_storein_sub", null, function(str) {
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
				equMgm.saveOrUpdataEquGoodsStoreinSub(obj, function(str) {
					if (str == 'success') {
						Ext.example.msg('保存成功！', '您成功新增了一条信息！');
						Ext.Msg.show({
									title : '提示',
									msg : '是否继续新增?',
									buttons : Ext.Msg.YESNO,
									fn : function(btn) {
										if (btn == 'yes') {
											insertFn();
											dsSub.baseParams.params = " sbrkUids='" + sbrkUids + "' and pid='" + pid + "'";;
											dsSub.load();
										} else {
											dsSub.baseParams.params = " sbrkUids='" + sbrkUids + "' and pid='" + pid + "'";;
											dsSub.load();
											noticeWinSub.hide();
										}
									},
									icon : Ext.MessageBox.QUESTION
								});
					} else {
						Ext.example.msg('信息提示', '保存失败！');
						dsSub.baseParams.params = " sbrkUids='" + sbrkUids + "' and pid='" + pid + "'";;
						dsSub.load();
						noticeWinSub.hide();
					}
				});
			}
			DWREngine.setAsync(true);
		}
	}

	//form表单保存
	function saveFun() {
		var flag = true;
		var form = formPanel.getForm();
//     	var equid = wareTreeCombo.getRawValue();
//  	if(equid == null || equid == ""){
//  		Ext.example.msg('保存出错','请选择仓库号！');
//  		return;
//  	}
		var checkBlank = ['joinUnit', 'warehouseNo', 'equid'];
		for (var i = 0; i < checkBlank.length; i++) {
			if (form.findField(checkBlank[i]).getValue() == null || form.findField(checkBlank[i]).getValue() == "") {
				Ext.example.msg('提示信息', '【' + fc[checkBlank[i]].fieldLabel + '】不能为空！');
				return false;
			}
		}
		var getConid = form.findField("conid").getValue();
		var getWarehouseNo = form.findField("warehouseNo").getValue();
		form.findField("abnormalOrNo").setValue(banFlag);
		var obj = new Object();
		for (var i = 0; i < Columns.length; i++) {
			var name = Columns[i].name;
			var field = form.findField(name);
			if (field != null) {
				obj[name] = field.getValue();
			}
		}
		DWREngine.setAsync(false);
		equMgm.saveOrUpdataEquRkGoodsStorein(obj, pid, edit_uids, 'EQUBODY', function(text) {
					if (text == 'success') {
						Ext.example.msg('提示信息', '保存成功！');
					} else if (text == 'failure') {
						Ext.example.msg('提示信息', '保存失败！');
					} else if (text == 'repeat') {
						Ext.example.msg('提示信息', '您保存的记录已存在！');
					}
				})
		baseMgm.getData("select uids from equ_goods_storein where conid='" + getConid + "' and warehouse_no='"
			+ getWarehouseNo + "' and pid='" + pid + "' and data_type='" + dataType + "'", function(text) {
					formPanel.getForm().findField("uids").setValue(text);
					edit_uids = text;
					updateEquid = formPanel.getForm().findField("equid").getValue();
					oldWarehouseNo = formPanel.getForm().findField("warehouseNo").getValue();
				})
		DWREngine.setAsync(true);
	}

	function addGridFun() {
		var sbrkUids = '';
		if (edit_uids == null || edit_uids == '') {
			sbrkUids = formPanel.getForm().findField("uids").getValue();
		} else {
			sbrkUids = edit_uids;
		}
		if (sbrkUids == '') {
			Ext.example.msg('提示信息', '请先保存【<span style="color:red">入库单信息</span>】，在新增【<span style="color:red">入库单明细</span>】！');
			return;
		}
		PlantIntSub.sbrkUids = sbrkUids;
		gridPanelSub.defaultInsertHandler();
		dsSub.baseParams.params = " sbrkUids='" + sbrkUids + "' and pid='" + pid + "'";
	}
	//设备详细信息保存
	function saveGridFun() {
		var records = dsSub.getModifiedRecords();
		gridPanelSub.defaultSaveHandler();
	}

	//异常设备详细信息删除
	function delGridFun() {
		var record = gridPanelSub.getSelectionModel().getSelected();
		var getPid = record.get("pid");
		var getUids = record.get("uids");
		Ext.Msg.confirm('系统提示', '是否要删除记录', function(btn) {
					if (btn == 'yes') {
						DWREngine.setAsync(false);
						equMgm.checkExceBox(getUids, getPid, function(text) {
									if (text == 'success') {
										Ext.example.msg('提示信息', '删除成功！');
										dsSub.baseParams.params = whereSql;
										dsSub.load();
									} else {
										Ext.example.msg('提示信息', '删除失败！');
									}
								})
						DWREngine.setAsync(true);

					}
				})
	}

	//打开设备开箱选择窗口
	function showNoticeWin() {
		if (banFlag == "1")
			return;
		var uids = formPanel.getForm().findField("uids").getValue();
		if (uids == null || uids == "") {
			Ext.example.msg('提示信息', '请先保存设备入库单信息！');
			return;
		}
		dsNotice.baseParams.params = "open_no not in (select noticeNo from EquGoodsStorein t where pid='"
				+ pid + "' and NOTICE_NO <>' ') " + "and finished='1' and isStorein <>1 and pid='"
				+ pid + "' and conid='" + edit_conid + "'" + getWhereSql;
		dsNotice.load();
		noticeWin.show();
		var noticeId = formPanel.getForm().findField("noticeNo").getValue();
		if (noticeId == "") {
			dsSub.baseParams.params = " 1=2 and pid='" + pid + "'";
		} else {
			dsSub.baseParams.params = "sbrk_uids='" + uids + "' and pid='" + pid + "'";
		}
		dsSub.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
	}

	//设备正常开箱处理
	function chooseFun() {
		/*
		 var  rec = gridPanelNotice.getSelectionModel().getSelected();
		 var getUids = formPanel.getForm().findField('uids').getValue();
		 if(rec == null || rec == ""){
		 Ext.example.msg('提示信息','请选择设备开箱检验记录！');
		 return ;
		 }else{
		 getKxNotice=rec.data.openNo;
		 Ext.example.msg('提示信息','您请选择了一条设备开箱检验记录！');
		 formPanel.getForm().findField('noticeNo').setValue(getKxNotice);
		 DWREngine.setAsync(false);
		 equMgm.SetListEquRkGoodsStorein(rec.data.uids,rec.data.pid,getUids,rec.data.openNo,function(text){
		 if(text == "success"){
		 dsSub.baseParams.params="sbrk_uids='"+getUids+"' and pid='"+pid+"'";
		 dsSub.load({params:{start:0,limit:PAGE_SIZE}});
		 }
		 })
		 DWREngine.setAsync(true);
		 noticeWin.hide();
		 delBtn.setDisabled(true);
		 abnormalOrNoBtn.setDisabled(true);
		 formPanel.getForm().findField("openBoxId").setValue(rec.get('uids'));
		 banFlag = "0";
		 }
		 */
		//入库单选择检验单修改为多选临时处理办法。
		var records = gridPanelNotice.getSelectionModel().getSelections();
		if (records == null || records.length == 0) {
			Ext.example.msg('提示信息', '请选择设备开箱检验记录！');
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
			equMgm.selectEquCheckToEquIn(uidsArr, getUids, function(text) {
					});
			DWREngine.setAsync(true);
			formPanel.getForm().findField('noticeNo').setValue(openNoArr);
			formPanel.getForm().findField("openBoxId").setValue(uidsArr);

			noticeWin.hide();
			delBtn.setDisabled(true);
			abnormalOrNoBtn.setDisabled(true);
			banFlag = "0";

			dsSub.baseParams.params = "sbrk_uids='" + getUids + "' and pid='" + pid + "'";
			dsSub.load({
						params : {
							start : 0,
							limit : PAGE_SIZE
						}
					});
		}
	}

	//异常设备处理
	function abnormalOrNoFun() {
		var uids = formPanel.getForm().findField("uids").getValue();
		if (uids == null || uids == "") {
			Ext.example.msg('提示信息', '请先保存设备入库单信息！');
			return;
		}
		dsAdnoral.baseParams.params = "uids not in(select boxSubId from EquGoodsStoreinSub  where pid='" + pid +
				"' and boxSubId <> ' ')" + " and exception ='1' and isStorein <> 1 and finished = '1' and pid='" + pid + "'";
		dsAdnoral.load();
		adnormalWin.show();
	}

	//异常设备选择保存
	function adnormalFun() {
		var flag = 0;
		var recored = gridPanelAdnoral.getSelectionModel().getSelections();
		var getUids = formPanel.getForm().findField('uids').getValue();
		if (recored == null || recored == "") {
			Ext.example.msg('提示信息', '请选择异常设备入库信息！');
			return false;
		} else {
			var temp = new Array();
			for (var i = 0; i < recored.length; i++) {
				temp.push(recored[i].data)
			}
			gridPanelAdnoral.getEl().mask("loading...");
			DWREngine.setAsync(false);
			equMgm.addAbnormalList(temp, getUids, pid, function(text) {
						if (text == "success")
							flag = 1;
					})
			DWREngine.setAsync(true);
			gridPanelAdnoral.getEl().unmask();
			if (flag == '1') {
				var uids = formPanel.getForm().findField("uids").getValue();
				Ext.example.msg('提示信息', '您选择了' + recored.length + '异常设备入库信息！');
				adnormalWin.hide()
				dsSub.baseParams.params = "sbrk_uids='" + uids + "' and pid='" + pid + "'";
				dsSub.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
			}
			adnormalWin.hide();
			Ext.getCmp("noticeNo").setDisabled(true);
//			delBtn.setDisabled(false);
			banFlag = "1";
			return true;
		}
		return false;
	}

	//入库单明细保存按钮重构
	function saveFn() {
		var record = smSub.getSelections();
		if (record == null || record == "") {
			Ext.example.msg('提示信息', '请修改数据后，再进行保存！');
			return;
		} else {
			gridPanelSub.defaultSaveHandler();
		}
	}

	// 入库单明细删除按钮重构
	function deleteFn() {
		var record = smSub.getSelections();
		if (record == null || record == "") {
			Ext.example.msg('提示信息', '请选择您要删除的记录！');
			return;
		} else {
			var updateSql = "update Equ_Goods_Bodys set del_or_update='1' where equ_no not in (select stockno from ( "
					+ " select * from EQU_GOODS_STOREIN_ESTIMATE_SUB t union select * from EQU_GOODS_STOREIN_SUB where "
					+ " sbrk_uids in ( select uids from EQU_GOODS_STOREIN t where t.data_type='EQUBODY')"
					+ " and uids<>'" + record[0].data.uids + "' )) and equ_name='" + record[0].data.warehouseName
					+ "' and ggxh='" + record[0].data.ggxh + "'";
			DWREngine.setAsync(false);
			baseDao.updateBySQL(updateSql);
			DWREngine.setAsync(false);
			gridPanelSub.defaultDeleteHandler();
		}
	}

	// 作展示页面使用，禁用所有功能
	if (view == 'view') {
		formPanel.items.each(function(item, index, length) {
					item.disable();
				})
		formPanel.getForm().findField('joinUnit').disable();
		formPanel.getForm().findField('warehouseDate').disable();
		wareTreeCombo.getTree().on('beforeshow', function() {
					return false;
				})
	}

})