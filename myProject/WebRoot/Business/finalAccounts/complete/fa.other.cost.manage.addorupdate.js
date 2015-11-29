var bean = 'com.sgepit.pmis.finalAccounts.complete.hbm.FacompOtherCostConView';
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "conid"
var orderColumn = "conno"
// 合同类型‘QT’、‘SG’
var conGrid,sm,ds,cm;
var baseCondition=masterid!=""?"masterid='"+masterid+"'":"otherCostType='"+costType+"' and contState ='0'"
var conid='';
Ext.onReady(function() {
//	DWREngine.setAsync(false);
//	appMgm.getCodeValue('分摊公式', function(list) {
//				for (var i = 0; i < list.length; i++) {
//					var temp = new Array();
//					temp.push(list[i].propertyCode);
//					temp.push(list[i].propertyName);
//					contFormulaArr.push(temp);
//				}
//			});
//	DWREngine.setAsync(true);
	var fm = Ext.form; // 包名简写（缩写）
	/*********************************参与分摊合同信息   start*************************************/
	var conFirmBtn = new Ext.Button({
		id : 'conFirm',
		text : '确认',
		iconCls : 'btn',
		handler : onItemClick
	});
	sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true}); // 创建选择模式
	var fc = { // 创建编辑域配置
		'pid' : {
			name : 'pid',
			fieldLabel : '工程项目编号',
			hidden : true,
			hideLabel : true
		},
		'conid' : {
			name : 'conid',
			fieldLabel : '合同主键',
			hidden : true,
			hideLabel : true
		},'masterid' : {
			name : 'masterid',
			fieldLabel : '其他费用分摊主键',
			hidden : true,
			hideLabel : true
		},
		'conno' : {
			name : 'conno',
			fieldLabel : '合同编号',
			anchor : '95%'
		},
		'conname' : {
			name : 'conname',
			fieldLabel : '合同名称',
			anchor : '95%'
		},
		'convaluemoney' : {
			name : 'convaluemoney',
			fieldLabel : '合同总金额',
			anchor : '95%'
		},
		'costContMoney' : {
			name : 'costContMoney',
			fieldLabel : costType=='0001'?'参与一类费用分摊总金额':'参与二类费用分摊总金额',
			anchor : '95%'
		},
		'investmentFinishMoney' : {
			name : 'investmentFinishMoney',
			fieldLabel : '投资完成总金额',
			anchor : '95%'
		},
		'otherCostType' : {
			name : 'otherCostType',
			fieldLabel : '其他费用类型',
			anchor : '95%'
		},
		'remark' : {
			name : 'remark',
			fieldLabel : '备注',
			anchor : '95%'
		}
	}

	// 3. 定义记录集
	var Columns = [{
				name : 'pid',
				type : 'string'
			}, {
				name : 'conid',
				type : 'string'
			}, {
				name : 'masterid',
				type : 'string'
			}, {
				name : 'conno',
				type : 'string'
			}, {
				name : 'conname',
				type : 'string'
			}, {
				name : 'convaluemoney',
				type : 'float'
			}, {
				name : 'costContMoney',
				type : 'float'
			}, {
				name : 'investmentFinishMoney',
				type : 'float'
			}, {
				name : 'otherCostType',
				type : 'string'
			}, {
				name : 'remark',
				type : 'string'
			}];

	var Plant = Ext.data.Record.create(Columns); // 定义记录集
	var PlantInt = {
		uids:'',
		pid : CURRENTAPPID,
		conid : '',
		costContMoney : '',
		investmentFinishMoney : '',
		otherCostType : '',
		remark : ''
	} // 设置初始值

	cm = new Ext.grid.ColumnModel([ // 创建列模型
	sm, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : 'masterid',
				header : fc['masterid'].fieldLabel,
				dataIndex : fc['masterid'].name,
				hidden : true
			}, {
				id : 'conid',
				header : fc['conid'].fieldLabel,
				dataIndex : fc['conid'].name,
				hidden : true
			},	{
				id : 'conno',
				header : '合同编号',
				dataIndex : 'conno',
				width : 160,
				renderer : function(value, cell, record) {
//					var str = '';
//					for (var i = 0; i < conOveArr.length; i++) {
//						if (conOveArr[i][0] == record.data.conid) {
//							str = conOveArr[i][2]
//							break;
//						}
//					}
					var qtip = "qtip=" + value;
					return '<span ' + qtip + '>' + value + '</span>';
				}
			}, {
				id : 'conname',
				header : '合同名称',
				dataIndex : 'conname',
				width : 280,
				renderer : function(value, cell, record) {
//					var str = '';
//					for (var i = 0; i < conOveArr.length; i++) {
//						if (conOveArr[i][0] == record.data.conid) {
//							str = conOveArr[i][1]
//							break;
//						}
//					}
					var qtip = "qtip=" + value;
					return '<span ' + qtip + '>' + value + '</span>';
				}
            }, {
				id : 'convaluemoney',
				header : '合同总金额',
				dataIndex : 'convaluemoney',
				width : 160,
                align : 'right',
				renderer : function(value, cell, record) {
//					var str = '';
//					for (var i = 0; i < conOveArr.length; i++) {
//						if (conOveArr[i][0] == record.data.conid) {
//							str = conOveArr[i][4]
//							break;
//						}
//					}
					return cnMoneyToPrec(value, 2);
				}
			}, {
				id : 'investmentFinishMoney',
				header : fc['investmentFinishMoney'].fieldLabel,
				dataIndex : fc['investmentFinishMoney'].name,
				align : 'right',
				width : 160
			}, {
				id : 'costContMoney',
				header : fc['costContMoney'].fieldLabel,
				dataIndex : fc['costContMoney'].name,
				align : 'right',
				width : 200
			}, {
				id : 'otherCostType',
				header : fc['otherCostType'].fieldLabel,
				dataIndex : fc['otherCostType'].name,
				hidden : true
			}, {
				id : 'remark',
				header : fc['remark'].fieldLabel,
				dataIndex : fc['remark'].name,
				editor : new fm.TextField(fc['remark']),
				width : 100
			}]);

	cm.defaultSortable = true; // 设置是否可排序

	// 4. 创建数据源
	ds = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			params : baseCondition+" and condivno in('SG','QT','FW') and pid='" + CURRENTAPPID + "'"
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
			// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		});
	ds.setDefaultSort(orderColumn, 'asc'); // 设置默认排序列
	ds.on('load', function(t, rs) {
		if(selectRecord){
			sm.selectRecords([selectRecord],true);
			selectRecord=null;
		}else{
			selectTreeNodePath="";
			if (t.getTotalCount() > 0) {
				sm.selectFirstRow();
			}
		}
	})
	// 5. 创建可编辑的grid: grid-panel
	conGrid = new Ext.grid.EditorGridTbarPanel({
				ds : ds, // 数据源
				cm : cm, // 列模型
				sm : sm, // 行选择模式
				tbar : ['<font color=#15428b><B>合同选择<B></font>','-','<font color=#15428b>合同编号：</font>',
					{xtype: 'textfield', id: 'q-conno', name: 'conno', width: 110}, '-',
					'<font color=#15428b>合同名称：</font>',
					{xtype: 'textfield', id: 'q-conname', name: 'conname', width: 110}, '-'
					,{text: '查询', iconCls: 'btn', handler: qConOve}, '->',conFirmBtn], // 顶部工具栏，可选
				border : false, // 
				region : 'center',
				clicksToEdit : 2, // 单元格单击进入编辑状态,1单击，2双击
				header : false, //
				addBtn : false, // 是否显示新增按钮
				saveBtn : false, // 是否显示保存按钮
				delBtn : false, // 是否显示删除按钮
				frame : false, // 是否显示圆角边框
				autoScroll : true, // 自动出现滚动条
				collapsible : false, // 是否可折叠
				animCollapse : false, // 折叠时显示动画
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
				// expend properties
				plant : Plant,
				plantInt : PlantInt,
				servletUrl : MAIN_SERVLET,
				bean : bean,
				business : business,
				primaryKey : primaryKey
			});
	sm.on('rowselect', function() {
		var record = sm.getSelected();
		if(conid!=record.get("conid")) selectTreeNodePath="";
		conid=record.get("conid");
		store.removeAll();
		refreshBgdTree();
		investmentFinishMoneyBtn.setText("<font color=red size=2>"+cnMoneyToPrec(record.get("costContMoney"),2)+"</font>")
	});
	/*********************************参与分摊合同信息   end*************************************/
});
function onItemClick(item){
	switch(item.id) {
		case 'conFirm':
			confirmFun();
			break
	}
}
function confirmFun(){
	var record = sm.getSelected();
	if(record == null){
		Ext.example.msg('提示信息','请先选择一条合同信息！');
    	return ;
	}
	var masteridTemp=record.get('masterid');
	if(masteridTemp==null||masteridTemp.length<1){
		Ext.example.msg('提示信息','请先为合同选择要分摊的工程量！');
    	return ;
	}
	if(masterid==""){
		DWREngine.setAsync(false);
	    var sql = "update facomp_other_cost_cont set cont_state='1' where uids='"+masteridTemp+"'";
	    baseDao.updateBySQL(sql,function(str){
	        if(str == "1"){
	            Ext.example.msg("提示","保存成功！");
	            parent.conListWin.close();
	        }
	    })
        if(costType=='0001'){
		    faCostManageService.initFixedAssetTreeForFirstCon(masteridTemp,function(){
		    });
        }else if(costType=='0002'){
        	 faCostManageService.initFixedAssetTreeForSecondCon(masteridTemp,function(){
		    });
        }
	    DWREngine.setAsync(true);
	}else{
		Ext.example.msg("提示","保存成功！");
	    parent.conListWin.close();
	}
}
function qConOve(){
	var fConno = Ext.getCmp('q-conno');
	var fConname = Ext.getCmp('q-conname');
	var sql = '';
	if (fConno.getValue() != ''){
		sql += "UPPER(conno) like '%"+fConno.getValue().toUpperCase()+"%'";
	}
	if (fConname.getValue() != ''){
		if (sql != '') sql += " and ";
		sql += "conname like '%"+fConname.getValue()+"%'";
	}
	var _ds = conGrid.getStore();
	_ds.baseParams.params = (sql==''?'':sql+' and ')+baseCondition+" and condivno in('SG','QT','FW') and pid='" + CURRENTAPPID + "'";
	_ds.load();
}