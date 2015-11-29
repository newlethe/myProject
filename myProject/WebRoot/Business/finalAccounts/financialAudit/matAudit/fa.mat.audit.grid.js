var AUDIT_TYPE_MAT = "MAT";
var beanDetail = "com.sgepit.pmis.finalAccounts.interfaces.vo.MatStockOutDetailVO"
var businessDetail = "financialAuditService";
var listMethodDetail = "getMatStockOutDetail";

var orderColumnSub = "outNo";
var selectedGgId;
var sbId, sm;

var userArray = new Array();
DWREngine.setAsync(false);
baseMgm.getData("select userid,realname from rock_user ", function(list) {
			for (var i = 0; i < list.length; i++) {
				var temp = new Array();
				temp.push(list[i][0]);
				temp.push(list[i][1]);
				userArray.push(temp);
			}
		})
DWREngine.setAsync(true);

var singleAuditBtn = new Ext.Button({
			id : 'single',
			text : '单独稽核',
			iconCls : 'btn',
			handler : auditFun
		});

/*
 * var mergeAuditBtn = new Ext.Button({ id: 'merge', text: '合并稽核', iconCls:
 * 'btn', handler: auditFun });
 * 
 * var mergeToAuditBtn = new Ext.Button({ id: 'mergeTo', text: '合并到稽核', iconCls:
 * 'btn', handler: auditFun });
 */

var deleteAuditBtn = new Ext.Button({
			id : 'deleteAudit',
			text : '撤销稽核',
			iconCls : 'remove',
			handler : deleteAuditFun
		});

var btnLook = new Ext.Button({
			text : '查看固定资产',
			iconCls : 'add',
			handler : lookAsset
		});

var smSub = new Ext.grid.CheckboxSelectionModel() // 创建选择模式
var fmSub = Ext.form; // 包名简写（缩写）

var fcSub = { // 创建编辑域配置
	'outId' : {
		name : 'outId',
		fieldLabel : '出库单主键',
		hidden : true,
		hideLabel : true
	},
	'outNo' : {
		name : 'outNo',
		fieldLabel : '出库单编号',
		hidden : true,
		anchor : '95%'
	},
	'auditId' : {
		name : 'auditId',
		fieldLabel : '稽核主键',
		hidden : true,
		anchor : '95%'
	},
	'auditNo' : {
		name : 'auditNo',
		fieldLabel : '稽核流水号',
		anchor : '95%'
	},
	'matId' : {
		name : 'matId',
		fieldLabel : '物资主键',
		hidden : true,
		anchor : '95%'
	},
	'matCode' : {
		name : 'matCode',
		fieldLabel : '物资编码',
		anchor : '95%'
	},
	'matName' : {
		name : 'matName',
		fieldLabel : '物资名称',
		anchor : '95%'
	},
	'matSpec' : {
		name : 'matSpec',
		fieldLabel : '规格型号',
		anchor : '95%'
	},
	'matUnit' : {
		name : 'matUnit',
		fieldLabel : '单位',
		anchor : '95%'
	},
	'matPrice' : {
		name : 'matPrice',
		fieldLabel : '单价',
		anchor : '95%'
	},
	'num' : {
		name : 'num',
		fieldLabel : '出库数量',
		anchor : '95%'
	},
	'amount' : {
		name : 'amount',
		fieldLabel : '总金额',
		anchor : '95%'
	}
}

var cmSub = new Ext.grid.ColumnModel([ // 创建列模型
smSub, {
			id : 'outId',
			header : fcSub['outId'].fieldLabel,
			dataIndex : fcSub['outId'].name,
			hidden : true
		}, {
			id : 'auditId',
			header : fcSub['auditId'].fieldLabel,
			dataIndex : fcSub['auditId'].name,
			hidden : true
		}, {
			header : fcSub['auditNo'].fieldLabel,
			dataIndex : fcSub['auditNo'].name,
			width : 120
		}, {
			header : fcSub['outNo'].fieldLabel,
			dataIndex : fcSub['outNo'].name,
			width : 120
		}, {
			id : 'matId',
			header : fcSub['matId'].fieldLabel,
			dataIndex : fcSub['matId'].name,
			width : 120,
			hidden : true,
			width : 90
		}, {
			id : 'matCode',
			header : fcSub['matCode'].fieldLabel,
			dataIndex : fcSub['matCode'].name,
			width : 90
		}, {
			id : 'matName',
			header : fcSub['matName'].fieldLabel,
			dataIndex : fcSub['matName'].name,
			width : 90
		}, {
			id : 'matSpec',
			header : fcSub['matSpec'].fieldLabel,
			dataIndex : fcSub['matSpec'].name,
			width : 90
		}, {
			id : 'matUnit',
			header : fcSub['matUnit'].fieldLabel,
			dataIndex : fcSub['matUnit'].name,
			width : 90
		}, {
			id : 'matPrice',
			header : fcSub['matPrice'].fieldLabel,
			dataIndex : fcSub['matPrice'].name,
			width : 90
		}, {
			header : fcSub['num'].fieldLabel,
			dataIndex : fcSub['num'].name,
			width : 70
		}, {
			header : fcSub['amount'].fieldLabel,
			dataIndex : fcSub['amount'].name,
			width : 70
		}]);
cmSub.defaultSortable = true; // 设置是否可排序

// 3. 定义记录集
var ColumnsSub = [{
			name : 'outId',
			type : 'string'
		}, {
			name : 'auditId',
			type : 'string'
		}, {
			name : 'auditNo',
			type : 'string'
		}, {
			name : 'outNo',
			type : 'string'
		}, {
			name : 'matId',
			type : 'string'
		}, {
			name : 'matCode',
			type : 'string'
		}, {
			name : 'matName',
			type : 'string'
		}, {
			name : 'matSpec',
			type : 'string'
		}, {
			name : 'matUnit',
			type : 'string'
		}, {
			name : 'matPrice',
			type : 'float'
		}, {
			name : 'num',
			type : 'float'
		}, {
			name : 'amount',
			type : 'float'
		},
		{
			name : 'usingUser',
			type : 'string'
		}
		];

// 4. 创建数据源
var dsSub = new Ext.data.Store({
			baseParams : {
				ac : 'list', // 表示取列表
				bean : beanDetail,
				business : businessDetail,
				method : listMethodDetail,
				params: ''
			},
			proxy : new Ext.data.HttpProxy({
						method : 'GET',
						url : MAIN_SERVLET
					}),
			reader : new Ext.data.JsonReader({
						root : 'topics',
						totalProperty : 'totalCount'
					}, ColumnsSub),
			remoteSort : false,
			pruneModifiedRecords : true
		});
dsSub.setDefaultSort(orderColumnSub, 'asc');

// 5. 创建可编辑的grid: grid-panel
var gridSub = new Ext.grid.GridPanel({
			id : 'grid-panel', // id,可选
			ds : dsSub, // 数据源
			cm : cmSub, // 列模型
			sm : smSub, // 行选择模式
			tbar : [], // 顶部工具栏，可选
			width : 1000, // 宽
			height : 410, // 高
			border : false, // 
			region : 'south',
			clicksToEdit : 2, // 单元格单击进入编辑状态,1单击，2双击
			header : false, //
			frame : false, // 是否显示圆角边框
			autoScroll : true, // 自动出现滚动条
			split : true,
			animCollapse : false, // 折叠时显示动画
			autoExpandColumn : 2, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
			loadMask : true, // 加载时是否显示进度
			stripeRows : true,
			viewConfig : {
				forceFit : true,
				ignoreAdd : true
			},
			bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
				pageSize : PAGE_SIZE,
				store : dsSub,
				displayInfo : true,
				displayMsg : ' {0} - {1} / {2}',
				emptyMsg : "无记录。"
			})
		});


function formatDate(value) {
	return value ? value.dateFormat('Y-m-d') : '';
};

// 稽核
function auditFun(btn) {
	var recArr = gridSub.getSelectionModel().getSelections();
	if (recArr == null || recArr.length == 0) {
		Ext.Msg.alert("提示", "请选择要稽核的设备！");
		return;
	}

	var mergeType = "N";
	var checkFlag = true;
	var sourceNos = "";
	var objectIds = "";

	var confirmDataArr = new Array();
	var dataArr = new Array();
	for (i = 0; i < recArr.length; i++) {
		var rec = recArr[i];
		if (rec.data["auditNo"] != null
				&& rec.data["auditNo"].length > 0) {
			checkFlag = false;
			break;
		}
		sourceNos += "`" + rec.data["outNo"];
		objectIds += "`" + rec.data["matId"];
		dataArr.push(rec.data);

		var temp = rec.data;
		temp.finOAmount = rec.data["amount"]
		var userId = rec.data["usingUser"];
		var userRealName = '';
		if ( userId ){
			for ( var i = 0; i < userArray.length; i++ ){
				if ( userArray[i][0] == userId ){
					userRealName = userArray[i][1];
					break;
				}
			} 
		}
		temp.usingUser = userRealName;
		temp.isMain = "1";
		confirmDataArr.push(temp);
	}

	if (checkFlag) {
		if (sourceNos.length > 0 && objectIds.length > 0) {
			sourceNos = sourceNos.substring(1);
			objectIds = objectIds.substring(1);

			var master = new Object();
			master.sourceNos = sourceNos;
			master.objectIDs = objectIds;
			master.businessType = AUDIT_TYPE_MAT;
			master.operator = USERID;

			if (mergeType == "N") {
				var matAuditUrl = CONTEXT_PATH
						+ "/Business/finalAccounts/financialAudit/matAudit/fa.mat.audit.single.info.jsp"
				var param = new Object();
				param.basicData = Ext.encode(confirmDataArr);
				var rtn = showModalDialog(matAuditUrl, param, "dialogWidth:1000px;dialogHeight:600px;center:yes;resizable:yes;");
				if (rtn) {
					master.matStockOutDetailVOArr = Ext.decode(rtn);
					saveAuditDataFun(master, mergeType, "", "");
				}
			}
		}
	} else {
		Ext.Msg.alert("提示", "某些选中的设备已经稽核！");
	}
}

// 稽核信息保存
function saveAuditDataFun(master, mergeType, mainAuditId, mainObjectId) {
	master.pid = CURRENTAPPID;
	financialAuditService.auditAdd(master, mergeType, mainAuditId,
			mainObjectId, function(d) {
				if (d == "OK") {
					Ext.Msg.alert("提示", "选中的设备已经稽核！");
					dsSub.load({
								params : {
									start : 0,
									limit : PAGE_SIZE
								}
							});
				} else {
					Ext.Msg.alert("提示", "稽核失败，原因：" + d);
				}
			});
}

// 查看固定资产
function lookAsset() {
	var mergeConfirmUrl = CONTEXT_PATH
			+ "/Business/finalAccounts/financialAudit/matAudit/fa.mat.assets.main.jsp"
	var param = new Object();
	var rtn = showModalDialog(mergeConfirmUrl, param, "dialogWidth:"
					+ screen.availWidth + ";dialogHeight:" + screen.availHeight
					+ ";center:yes;resizable:yes;");
}

// 撤销稽核
function deleteAuditFun() {
	var checkFlag = true;
	var recArr = gridSub.getSelectionModel().getSelections();
	var delAuditIds = "";

	for (i = 0; i < recArr.length; i++) {
		var rec = recArr[i];
		if (rec.data["auditNo"] == null || rec.data["auditNo"].length == 0) {
			checkFlag = false;
			break;
		}
		delAuditIds += "`" + rec.data["auditId"];
	}

	if (!checkFlag) {
		Ext.Msg.alert("提示", "请选择要撤销的稽核！");
		return;
	}
	if (delAuditIds.length > 0) {
		delAuditIds = delAuditIds.substring(1);
		Ext.Msg.confirm("确认", "确认稽核选中的设备？", function(btn) {
					if (btn == "yes") {
						financialAuditService.delAuditByIds(delAuditIds,
								function(d) {
									if (d == "OK") {
										Ext.Msg.alert("提示", "稽核撤销成功！");
										dsSub.load({
													params : {
														start : 0,
														limit : PAGE_SIZE
													}
												});
									}
								});
					}
				});
	}
}
