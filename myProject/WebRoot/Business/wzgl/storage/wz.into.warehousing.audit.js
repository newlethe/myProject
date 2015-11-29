var bean;
var tableName;
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "warehouseDate";
var businessType;
var whereStr,paramsStr;
var cm;
var ds;

var deptType = new Array(); // 供货单位
var typeArr = new Array(); // 处理设备仓库
var equWareArr = new Array();// 系统编号，仓库号，仓库类别
var warenoArr = new Array();// 仓库号
var waretypeArr = new Array();// 仓库类别
var htType;
var htTypeStore;

Ext.onReady(function() {
	if (treeFlag == "SBIN") {
		bean = "com.sgepit.pmis.equipment.hbm.EquGoodsStorein";
		whereStr = "dataType = 'EQUBODY' and FINISHED = '1' and pid ='" + CURRENTAPPID + "'";
		tableName = "EQU_GOODS_STOREIN";
	} else if (treeFlag == "CLIN") {
		bean = "com.sgepit.pmis.wzgl.hbm.WzGoodsStorein";
		whereStr = "judgmentFlag = 'body' and FINISHED = '0' and pid ='" + CURRENTAPPID + "'";
		tableName = "WZ_GOODS_STOREIN";
	}

	DWREngine.setAsync(false);
	baseMgm.getData("select cpid,partyb from CON_PARTYB ", function(list) {
				deptType.push(['all', '所有']);
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					deptType.push(temp);
				}
			});
	baseMgm.getData("select wareno,waretype,equid from equ_warehouse where pid='"
					+ CURRENTAPPID + "' and parent='01' order by equid ", function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					temp.push(list[i][2]);
					typeArr.push(temp);
				}
			});
	baseMgm.getData("select uids,equid,equno,wareno from equ_warehouse where pid='"
					+ CURRENTAPPID + "' order by equid ", function(list) {
				warenoArr.push(['all', '所有']);
				waretypeArr.push(['all', '所有']);
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					temp.push(list[i][2]);
					warenoArr.push([list[i][1], list[i][2]]);
					waretypeArr.push([list[i][1], list[i][3]]);
					for (var j = 0; j < typeArr.length; j++) {
						if (list[i][3] == typeArr[j][1]) {
							temp.push(typeArr[j][0]);
						}
					}
					equWareArr.push(temp);
				}
			});
	DWREngine.setAsync(true);

	var Columns = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'warehouseNo',
				type : 'string'
			}, {
				name : 'warehouseDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'supplyunit',
				type : 'string'
			}, {
				name : 'treeUids',
				type : 'string'
			}, {
				name : 'conid',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'equid',
				type : 'string'
			}, {
				name : 'fileid',
				type : 'string'
			}, {
				name : 'invoiceno',
				type : 'string'
			}, {
				name : 'remark',
				type : 'string'
			}, {
				name : 'auditState',
				type : 'string'
			}];

	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true
			});
	var cm = new Ext.grid.ColumnModel([sm, {
				id : 'uids',
				header : '主键',
				dataIndex : 'uids',
				hidden : true
			}, {
				id : 'conid',
				header : '合同ID',
				dataIndex : 'conid',
				hidden : true
			}, {
				id : 'treeUids',
				header : '设备合同分类树主键',
				dataIndex : 'treeUids',
				hidden : true
			}, {
				id : 'warehouseNo',
				header : '入库单号',
				dataIndex : 'warehouseNo',
				align : 'center',
				type : 'string',
				width : 180,
				renderer : hrefFun
			}, {
				id : 'warehouseDate',
				header : '入库日期',
				dataIndex : 'warehouseDate',
				align : 'center',
				renderer : formatDate,
				width : 80
			}, {
				id : 'supplyunit',
				header : '供货单位',
				dataIndex : 'supplyunit',
				align : 'center',
				renderer : function(v) {
					var str = '';
					for (var i = 0; i < deptType.length; i++) {
						if (deptType[i][0] == v) {
							str = deptType[i][1]
							break;
						}
					}
					return str;
				},
				width : 180
			}, {
				id : 'pid',
				header : 'PID',
				dataIndex : 'pid',
				hidden : true
			}, {
				id : 'equid',
				header : '仓库号',
				dataIndex : 'equid',
				renderer : function(v) {
					var equid = "";
					for (var i = 0; i < equWareArr.length; i++) {
						if (v == equWareArr[i][1])
							equid = equWareArr[i][2] + " - " + equWareArr[i][1];
					}
					return equid;
				},
				align : 'center',
				width : 160
			}, {
				id : 'invoiceno',
				header : '发票号',
				dataIndex : 'invoiceno',
				align : 'center',
				type : 'string',
				width : 160
			}, {
				id : 'fileid',
				header : '入库单',
				dataIndex : 'fileid',
				align : 'center',
				width : 60,
				renderer : function(v) {
					if (v != '') {
						return "<center><a href='" + BASE_PATH + "servlet/MainServlet?ac=downloadfile&fileid="
								+ v + "'><img src='" + BASE_PATH + "jsp/res/images/word.gif'></img></a></center>";
					} else {
						return "<img src='" + BASE_PATH + "jsp/res/images/word_bw.gif'></img>";
					}
				}
			}, {
				id : 'fileid',
				header : '附件',
				dataIndex : 'fileid',
				renderer : filelistFn,
				align : 'center',
				width : 60
			}, {
				id : 'auditState',
				header : '稽核状态',
				dataIndex : 'auditState',
				width : 80,
				align : 'center',
				renderer : function(v) {
					var str = '未稽核';
					if (v == '1') {
						str = '已稽核';
					} else if (v == '2') {
						str = '撤销稽核';
					}
					return str;
				}
			}]);
	cm.defaultSortable = true;

	ds = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : bean,
					business : business,
					method : listMethod,
					params : whereStr
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : primaryKey
						}, Columns),
				remoteSort : true,
				pruneModifiedRecords : true
			});
	ds.setDefaultSort(orderColumn, 'desc');

	var auditBtn = new Ext.Button({
				id : 'audit',
				text : '稽核',
				iconCls : 'btn',
				handler : function() {
					var record = sm.getSelected();
					if (typeof(record) == 'undefined') {
						Ext.example.msg('提示', '请选择一条数据');
						return false;
					} else if (record.get('auditState') == '1') {
						Ext.example.msg('提示', '此数据已稽核');
						return false;
					}
					Ext.MessageBox.confirm('确认', '确认稽核吗？', function(btn, text) {
								if (btn == 'yes') {
									DWREngine.setAsync(false);
									baseDao.updateBySQL("update " + tableName + " set AUDIT_STATE = '1' where "
													+ primaryKey + " = '" + record.get(primaryKey) + "'", function(flag) {
														if (flag == 1) {
															ds.reload();
															Ext.example.msg('提示', '稽核成功!');
														} else {
															Ext.example.msg('提示', '稽核失败!');
														}
													});
									DWREngine.setAsync(true);
								}
							});
				}
			});
	var auditRevBtn = new Ext.Button({
				id : 'audit',
				text : '撤销稽核',
				iconCls : 'remove',
				handler : function() {
					var record = sm.getSelected();
					if (typeof(record) == 'undefined') {
						Ext.example.msg('提示', '请选择一条数据');
						return false;
					} else if (record.get('auditState') != '1') {
						Ext.example.msg('提示', '此数据未稽核或已撤销稽核');
						return false;
					}
					Ext.MessageBox.confirm('确认', '确认撤销稽核吗?',
							function(btn, text) {
								if (btn == 'yes') {
									DWREngine.setAsync(false);
									baseDao.updateBySQL("update " + tableName + " set AUDIT_STATE = '2' where "
													+ primaryKey + " = '" + record.get(primaryKey) + "'", function(flag) {
														if (flag == 1) {
															ds.reload();
															Ext.example.msg('提示', '撤销稽核成功!');
														} else {
															Ext.example.msg('提示', '撤销稽核失败!');
														}
													});
									DWREngine.setAsync(true);
								}
							});
				}
			});

	var wareTreeCombo = new Ext.ux.TreeCombo({
				id : 'storage',
				fieldLabel : '仓库号',
				resizable : true,
				width : 110,
				treeWidth : 200,
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

	wareTreeCombo.getTree().on('beforeload', function(node) {
				wareTreeCombo.getTree().loader.baseParams.parent = node.id;
			});

	wareTreeCombo.on('select', function(tree, node) {
				if (node.id == '01') {
					Ext.example.msg("信息提示：", "请选择此分类下的子分类！");
					wareTreeCombo.setRawValue("");
					return;
				}
				var equname = "";
				for (var i = 0; i < equWareArr.length; i++) {
					if (node.id == equWareArr[i][1]) {
						equname = equWareArr[i][2] + " - " + equWareArr[i][1];
						break;
					}
				}
				this.setRawValue(equname);
			});

	var addToolbar = new Ext.Toolbar({
				items : [
						'入库日期:',
						new Ext.form.DateField({
									id : 'begin',
									emptyText : '开始时间',
									readOnly : true,
									width : 85,
									format : 'Y-m-d'
								}),
						'至',
						new Ext.form.DateField({
									id : 'end',
									readOnly : true,
									width : 85,
									format : 'Y-m-d',
									value : new Date
								}),
						'-',
						'稽核状态:',
						new Ext.form.ComboBox({
									id : 'state',
									store : new Ext.data.SimpleStore({
												fields : ['k', 'v'],
												data : [['all', '所有'],
														[0, '未稽核'], [1, '已稽核'],
														[2, '撤销稽核']]
											}),
									displayField : 'v',
									valueField : 'k',
									value : 'all',
									typeAhead : true,
									readOnly : true,
									mode : 'local',
									triggerAction : 'all',
									selectOnFocus : true,
									width : 70
								}), '-', '仓库号', wareTreeCombo, '-', '供货单位',
						new Ext.form.ComboBox({
									id : 'dept',
									store : new Ext.data.SimpleStore({
												fields : ['k', 'v'],
												data : deptType
											}),
									displayField : 'v',
									valueField : 'k',
									value : 'all',
									typeAhead : true,
									readOnly : true,
									mode : 'local',
									triggerAction : 'all',
									selectOnFocus : true,
									width : 110,
									listWidth : 220
								}), '-', new Ext.Toolbar.Button({
									id : 'query',
									text : '查 询',
									iconCls: 'btn',
									handler : onItemClick
								}), '-', new Ext.Toolbar.Button({
									id : 'reset',
									text : '重 置',
									iconCls: 'refresh',
									handler : onItemClick
								})]
			});

	//使用高级查询组件的gridPanel,fixedFilterPart为高级查询的自定义参数
	fixedFilterPart = treeSql ? treeSql : whereStr;

	gridPanel = new Ext.grid.QueryExcelGridPanel({
				id : 'ff-grid-panel',
				ds : ds,
				cm : cm,
				sm : sm,
				border : false,
				region : 'center',
				header : false,
				autoScroll : true, // 自动出现滚动条
				tbar : ['<font color=#15428b><B>入库单信息<B></font>', '-',
						auditBtn, '-', auditRevBtn, '->'],
				animCollapse : false, // 折叠时显示动画
				enableHdMenu : false,
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
				viewConfig : {
					forceFit : false,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : ds,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				listeners : {
					"render" : function() {
						addToolbar.render(this.tbar);
					}
				}
			});
	ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});

	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [treePanel, gridPanel]
			});

	function formatDate(value) {
		return value && value instanceof Date
				? value.dateFormat('Y-m-d')
				: value;
	};

	// 跳转至从表详细信息页面
	function hrefFun(v, m, r) {
		var str = '<div id="hrefBar" ><a style="color:blue;" href="javascript:showModelDia(\'' + r.data.conid
				+ '\',\'' + r.data.treeUids + '\',\'' + r.data.uids + '\')">' + v + '</a></div>';
		return str;
	}

	// 附件查看
	function filelistFn(v, m, r) {
		if (treeFlag == 'SBIN') {
			if (v == null || v == "")
				return '查看[0]';
			else
				return "<a href='javascript:viewTemplate(\"" + v + "\")' title='查看'>查看</a>";
		} else {
			var uidsStr = treeFlag == 'CLIN' ? r.get('uids') : r.get('uuid');
			var count = 0;
			var editable = false;
			DWREngine.setAsync(false);
			db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"
							+ uidsStr + "' and transaction_type='" + businessType + "'", function(jsonData) {
						var list = eval(jsonData);
						if (list != null) {
							count = list[0].num;
						}
					});
			DWREngine.setAsync(true);
			var downloadStr = "查看[" + count + "]";
			return '<div id="sidebar"><a href="javascript:showUploadWin(\'' + businessType + '\', ' + editable
					+ ', \'' + uidsStr + '\', \'' + '附件列表' + '\')">' + downloadStr + '</a></div>';
		}
	}

	// 查询
	function onItemClick(item) {
		switch (item.id) {
			case 'query' :
				var begin = Ext.getCmp('begin').getValue();
				var end = Ext.getCmp('end').getValue();
				var state = Ext.getCmp('state').getValue();
				var storageRaw = Ext.getCmp('storage').getRawValue();
				var storage = Ext.getCmp('storage').getValue();
				var dept = Ext.getCmp('dept').getValue();
				var sql = '';
				var timeFiled = 'WAREHOUSE_DATE';
				var deptFiled = 'SUPPLYUNIT';
				if (begin != '') {
					begin = begin.format('Y-m-d') + ' 00:00:00';
				}
				if (end != '') {
					end = end.format('Y-m-d') + ' 23:59:59';
				}
				if (begin != '' && end != '' && end < begin) {
					Ext.example.msg("提示", "结束时间不能早于开始时间!");
					return;
				} else if (begin == '' && end != '') {
					sql += " and " + timeFiled + " <= to_date('" + end + "','yyyy-MM-dd hh24:mi:ss')";
				} else if (begin != '' && end != '') {
					sql += " and " + timeFiled + " >=to_date('" + begin + "','yyyy-MM-dd hh24:mi:ss') and "
							+ timeFiled + " <= to_date('" + end + "','yyyy-MM-dd hh24:mi:ss')";
				} else if (begin != '' && end == '') {
					sql += " and " + timeFiled + " >= to_date('" + begin + "','yyyy-MM-dd hh24:mi:ss')";
				}
				if (state != 'all') {
					sql += " and AUDIT_STATE = '" + state + "'";
				}
				if (storageRaw && storage) {
					sql += " and equid = '" + storage + "'";
				}
				if (dept != 'all') {
					sql += " and " + deptFiled + " = '" + dept + "'";
				}
				//带上高级查询的查询条件queStr,树的查询条件treeSql
				ds.baseParams.params = treeSql ? treeSql + sql + " and " + queStr : whereStr + sql + " and " + queStr;
				//为高级查询带上外部查询的条件
				fixedFilterPart = treeSql ? treeSql + sql : whereStr + sql;
				ds.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
				break;
			case 'reset' :
				Ext.getCmp('begin').setValue('');
				Ext.getCmp('end').setValue(new Date);
				Ext.getCmp('state').setValue('all');
				Ext.getCmp('storage').setRawValue('');
				Ext.getCmp('dept').setValue('all');
				//重置所有查询条件
				ds.baseParams.params = treeSql ? treeSql : whereStr;
				fixedFilterPart = treeSql ? treeSql : whereStr;
				ds.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
				break;

		}
	}
})

function viewTemplate(fileid) {
	window.open(MAIN_SERVLET + "?ac=downloadFile&fileid=" + fileid);
}

// 显示多附件的文件列表
function showUploadWin(businessType, editable, businessId, winTitle) {
	if (businessId == null || businessId == '') {
		Ext.Msg.show({
					title : '上传文件',
					msg : '请先保存记录再进行上传！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.WARNING
				});
		return;
	}

	var title = '上传文件';
	if (winTitle) {
		title = winTitle;
	}

	fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=" + editable + "&businessId=" + businessId;
	var fileWin = new Ext.Window({
				title : title,
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='" + fileUploadUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	fileWin.show();
}

//打开模态窗口，跳转至SB,CL的新增修改页面，SCXZB,SHB的主页面
function showModelDia(conid, treeuid, uids){
	var docUrl;
	if(tree_flag == 'SB'){
		docUrl = BASE_PATH +"Business/equipment/baseInfo/equbody/equ.bodys.into.warehousing.addorupdata.jsp?conid="
					+ conid + "&treeuids=" + treeuid + "&uids=" + uids + "&mark=markTrue&view=view";
	}else if(tree_flag == 'CL'){
		docUrl = BASE_PATH + "Business/wzgl/baseinfo_wzgl/wz.into.warehousing.addorupdata.jsp?conid="
					+ conid + "&treeuids=" + treeuid + "&uids=" + uids + "&flagLayout=WZBODY&view=view";
	}
	showModalDialog(docUrl,"", "dialogWidth:" + screen.availWidth + "px;dialogHeight:"
				+ screen.availHeight + "px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
}