var conoveWindow;
var contractType = new Array();
var gridConove, combo, dsConove, conSm, gridConove, connoField, connameField;
Ext.onReady(function() {
			DWREngine.setAsync(false);
			appMgm.getCodeValue('合同划分类型', function(list) { // 获取合同划分类型
						contractType.push(['-1', '所有合同'])
						for (i = 0; i < list.length; i++) {
							var temp = new Array();
							temp.push(list[i].propertyCode);
							temp.push(list[i].propertyName);
							contractType.push(temp);
						}
					});
			DWREngine.setAsync(true);
			var dsContractType = new Ext.data.SimpleStore({
						fields : ['k', 'v'],
						data : contractType
					});
			// 合同编号过滤
			connoField = new Ext.form.TextField({
						xtype : 'textfield',
						name : 'conno',
						width : 110
					});
			// 合同名称过滤
			connameField = new Ext.form.TextField({
						xtype : 'textfield',
						name : 'conname',
						width : 110
					});
			combo = new Ext.form.ComboBox({
						store : dsContractType,
						displayField : 'v',
						valueField : 'k',
						typeAhead : true,
						mode : 'local',
						triggerAction : 'all',
						selectOnFocus : true,
						width : 135,
						listeners:{
							select:function(combo, record, index) {
								var sql = selectedConidStr!=null&&selectedConidStr.length>0?
									"conid not in(select conid from " + bean2 + " where reportId='" + reportId + "')":"";
								if (combo.getValue() != '-1'
										&& combo.getValue() != '') {
									if (sql != ''){
										sql += " and ";
										dsConove.baseParams.params = sql
											+ " condivno='"
											+ combo.getValue()
											+ "'";
									}
								} else {
									dsConove.baseParams.params = sql;
								}
								dsConove.load();
							}
						}
					});
			dsConove = new Ext.data.Store({
						baseParams : {
							ac : 'list',
							bean : 'com.sgepit.pmis.contract.hbm.ConOve',
							business : 'baseMgm',
							method : 'findWhereOrderBy',
							params : ""
						},
						proxy : new Ext.data.HttpProxy({
									method : 'GET',
									url : MAIN_SERVLET
								}),
						reader : new Ext.data.JsonReader({
									root : 'topics',
									totalProperty : 'totalCount',
									id : 'conid'
								}, [{
											name : 'conid',
											type : 'string'
										}, {
											name : 'conno',
											type : 'string'
										}, {
											name : 'conname',
											type : 'string'
										}, {
											name : 'condivno',
											type : 'string'
										}, {
											name : 'sort',
											type : 'string'
										}]),
						remoteSort : true,
						pruneModifiedRecords : true
					});
			dsConove.setDefaultSort('conno', 'desc');
			conSm = new Ext.grid.CheckboxSelectionModel({
						singleSelect : false,
						header : ''
					});
			gridConove = new Ext.grid.GridPanel({
						sm : conSm,
						ds : dsConove,
						cm : new Ext.grid.ColumnModel([conSm, {
									id : 'conid',
									header : '合同ID',
									dataIndex : 'conid',
									hidden : true
								}, {
									id : 'conno',
									header : '合同编号',
									dataIndex : 'conno',
									width : .3
								}, {
									id : 'conname',
									header : '合同名称',
									dataIndex : 'conname',
									width : .6
								}, {
									id : 'condivno',
									header : '合同分类一',
									dataIndex : 'condivno',
									hidden : true
								}]),
						region : 'center',
						border : false,
						header : false,
						autoScroll : true,
						loadMask : true,
						stripeRows : true,
						viewConfig : {
							forceFit : true,
							ignoreAdd : true
						}/*,
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: dsConove,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })*/
					});
		});
function showConove() {
	if (!conoveWindow) {
		conoveWindow = new Ext.Window({
					title : '合同列表',
					iconCls : 'form',
					layout : 'border',
					closeAction : 'hide',
					width : 612,
					height : 280,
					modal : true,
					resizable : false,
					closable : true,
					border : false,
					maximizable : false,
					plain : true,
					tbar : [combo, '-',
							'<font color=#15428b>合同编号：</font>', connoField,
							'-', '<font color=#15428b>合同名称：</font>',
							connameField, '-', '->', {
								text : '查询',
								iconCls : 'btn',
								handler : function() {
									var sql = selectedConidStr!=null&&selectedConidStr.length>0?
										"conid not in(select conid from " + bean2 + " where reportId='" + reportId + "')":"";
									if (connoField.getValue() != '') {
										if (sql != '')
											sql += " and ";
										sql += "conno like '%"
												+ connoField.getValue()
												+ "%'";
									}
									if (connameField.getValue() != '') {
										if (sql != '')
											sql += " and ";
										sql += "conname like '%"
												+ connameField.getValue()
												+ "%'";
									}
									if (combo.getValue() != '-1'
										&& combo.getValue() != '') {
									if (sql != ''){
										sql += " and ";
										dsConove.baseParams.params = sql
											+ " condivno='"
											+ combo.getValue()
											+ "'";
									}
								} else {
									dsConove.baseParams.params = sql;
								}
									dsConove.load();
								}
							}, {
								text : '选择',
								iconCls : 'save',
								handler : function() {
									var sm = gridConove.getSelectionModel();
									var records=sm.getSelections();
									if (records&&records!=null&&records.length>0) {
										var selectConidStr="";
										for(var i=0;i<records.length;i++){
											selectConidStr+=",'"+records[i].get('conid')+"'";
										}
										selectConidStr=selectConidStr.substring(1);
										var preMonth=getPreNMonth(selectSjType,1);//取得前一月份
										DWREngine.setAsync(false);
										fundMonthPlanService.insertFundMonthPlanD(selectConidStr,reportId,CURRENTAPPID,preMonth, function(flag) {
											
										})
										DWREngine.setAsync(true);
										conoveWindow.hide();
										treeStore.load();
									} else {
										Ext.example.msg('提示', '请选择数据！');
									}
								}
							}],
					items : [gridConove],
					listeners : {
						'show' : function() {
							conSm.clearSelections();
						}

					}
				});
	}
	conoveWindow.show();
	combo.setValue("");
	connoField.setValue("");
	connameField.setValue("");
	dsConove.baseParams.params=selectedConidStr!=null&&selectedConidStr.length>0?
		"conid not in (select conid from " + bean2 + " where reportId='" + reportId + "')" : "";
	gridConove.getStore().load();
}

function getPreNMonth(strDate,num){
	var now = new Date(strDate.substring(0,4)+"/"+strDate.substring(4,6)+"/01"); 
	var perMonth =new Date( now.setMonth(now.getMonth() - num));
	var returnStr=perMonth.getFullYear()+(perMonth.getMonth()+101+"").substring(1);
	return returnStr;
}