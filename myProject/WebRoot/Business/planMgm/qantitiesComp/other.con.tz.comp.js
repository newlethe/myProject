var bean = "com.sgepit.pmis.investmentComp.hbm.ProAcmMonth";
var primaryKey = "uids";
var orderColumn = "month desc";
var business = "baseMgm";
var listMethod = "findwhereorderby";
var title = "<font color=#15428b><b>其他合同投资完成</b></font>" 	
var billTypes = new Array();
var selectConid = "ALL";
var selectConid = "ALL";
var gridPanel,conTrigger,conTrigger2,conoveWindow;
var conOveArr = new Array();
var contractType = new Array();
var contarctType2 = new Array();
var dsCombo2 = new Ext.data.SimpleStore({
			fields : ['k', 'v'],
			data : [['', '']]
		});
var sm;
var bill = isFlwTask == true ? '0' : '1';
var windowType="query";
Ext.onReady(function (){
	
 	DWREngine.setAsync(false);
	appMgm.getCodeValue('单据状态',function(list){		//获取付款类型
    	for (i = 0; i < list.length; i++){
    		var temp = new Array();
    		temp.push(list[i].propertyCode);
    		temp.push(list[i].propertyName);
    		billTypes.push(temp);
    	}
    });    
    appMgm.getCodeValue('合同划分类型', function(list) { // 获取合同划分类型
    	contractType.push(['-1', '所有合同'])
				for (i = 0; i < list.length; i++) {
					if(list[i].propertyCode != 'QT'&&list[i].propertyCode != 'FW')
                			continue;
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					contractType.push(temp);
				}
			});
    baseMgm.findAll('com.sgepit.pmis.contract.hbm.ConOveView',function(list){ 
  		 var temp1 = new Array();	
   		  temp1.push("ALL");
   		  temp1.push("所有合同");
   		  temp1.push("");
   		  temp1.push("");
   		  temp1.push(0);
   		  conOveArr.push(temp1);   		  
		for(i = 0; i < list.length; i++) {
            if(list[i].condivno != 'QT'&&list[i].condivno != 'FW')
                continue;
			var temp = new Array();	
			temp.push(list[i].conid);		
			temp.push(list[i].conname);	
			temp.push(list[i].conno);
			temp.push(list[i].convaluemoney);	
			conOveArr.push(temp);			
		}
    });
	DWREngine.setAsync(true);
	conStoreAll = new Ext.data.SimpleStore({
		fields : ['conid','conname','conno','convaluemoney']
	})
	var dsContractType = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : contractType
			});
	var contFilterId = "";				//合同一级分类属性代码，格式如('SB','GC','CL')
//	var contractType = new Array();		//合同一级分类
	//根据属性代码中对应“合同划分类型”中查询出其他合同，“详细设置”列包含
	var gcSql = "select c.property_code,c.property_name from property_code c " +
			"where c.type_name = (select t.uids from property_type t where t.type_name = '合同划分类型') " +
			"and c.property_code like '%QT%' or c.property_code like '%FW%'";
	DWREngine.setAsync(false);
	baseMgm.getData(gcSql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
//			contractType.push(temp);			
			contFilterId+="'"+list[i][0]+"',";				
		}
		contFilterId = contFilterId.substring(0,contFilterId.length-1);
	})
    DWREngine.setAsync(true);
    
    var addBtn = new Ext.Button({
    	id: 'add',
    	text:'新增',
    	iconCls : 'add',
    	handler: saveFormFun
    })
    var editBtn = new Ext.Button({
    	id: 'edit',
    	text:'修改',
    	iconCls:'btn',
    	handler: saveFormFun
    })
    var delBtn = new Ext.Button({
    	id: 'delete',
    	text:'删除',
    	iconCls : 'remove',
    	handler : deleteFormFun
    })
    conTrigger=new Ext.form.TriggerField({
		name: 'title', 
		triggerClass: 'x-form-date-trigger',
		readOnly: true,
		selectOnFocus: true,
		onTriggerClick: showConove1,
		hidden : (isFlwTask || isFlwView),
		width: 300
	})
	conTrigger2=new Ext.form.TriggerField({
		name: 'conname', 
		triggerClass: 'x-form-date-trigger',
		fieldLabel: '合同名称',
		readOnly: true,
		selectOnFocus: true,
		allowBlank:false,
		onTriggerClick: showConove2,
		hidden : (isFlwTask || isFlwView),
		width: 300
	})
	var fm = Ext.form; 

	var fc = {		
    	'uids': {
			name: 'uids',
			fieldLabel: '主键',
			anchor:'95%'
    	}, 'pid': {
			name: 'pid',
			fieldLabel: 'PID',
			anchor:'95%'
    	}, 'monId': {
			name: 'monId',
			fieldLabel: '工程投资完成流程主键',
			anchor:'95%'
        }, 'conid': {
			name: 'conid',
			fieldLabel: '合同名称',
			anchor:'95%'
		}, 'month': {
			name: 'month',
			fieldLabel: '时间',
			anchor:'95%'
		}/*, 'decmoney': {
			name: 'decmoney',
			fieldLabel: '申报金额',
			anchor:'95%'
        }, 'checkmoney': {
			name: 'checkmoney',
			fieldLabel: '核定金额',
			anchor:'95%'
        }*/, 'ratiftmoney': {
			name: 'ratiftmoney',
			fieldLabel: '投资完成金额',
			anchor:'95%'
		}, 'billstate': {
			name: 'billstate',
			fieldLabel: '单据状态',
			anchor:'95%'
		}, 'unitId' : {
			name: 'unitId',
			fieldLabel: '填报单位',
			anchor:'95%'
		}, 'operator' :{
			name: 'operator',
			fieldLabel: '填报人',
			anchor:'95%'
		}, 'auditState' : {
			name : 'auditState',
			fieldLabel : '稽核状态',
			anchor : '95%'
		}
	}
	
    var Columns = [
    	{name: 'uids', type: 'string'},
    	{name: 'pid', type: 'string'},
    	{name: 'monId', type: 'string'},
		{name: 'conid', type: 'string'},
		{name: 'month', type: 'string'},
		{name: 'unitId', type: 'string'},
		{name: 'operator', type: 'string'},
		{name:'per',type:'float'},
//    	{name: 'decmoney', type: 'float'},
//		{name: 'checkmoney', type: 'float'},
		{name: 'ratiftmoney', type: 'float'},
		{name: 'billstate', type: 'string'},
		{name: 'auditState', type: 'string'}
	];
	
	sm = new Ext.grid.CheckboxSelectionModel({singleSelect:true,header:''})
	
    var cm = new Ext.grid.ColumnModel([
    	sm,{
           id:'uids',
           header: fc['uids'].fieldLabel,
           dataIndex: fc['uids'].name,
		   hidden:true
        }, {
           id:'monId',
           header: fc['monId'].fieldLabel,
           dataIndex: fc['monId'].name,
		   hidden:true
        }, {
        	header : '合同编号',
        	align : 'left',
        	width : 100,
        	renderer : function(value,cell,record){
        		var str = '';
				for(var i=0; i<conOveArr.length; i++) {
					if (conOveArr[i][0] == record.data.conid) {
						str = conOveArr[i][2]
						break;
					}
				}
				var qtip = "qtip=" + str;
                return '<span ' + qtip + '>' + str + '</span>';
        	}
		}, {	
			id:'conid',
			header: fc['conid'].fieldLabel,
			dataIndex: fc['conid'].name,
			align : 'left',
			width : 160,
			renderer: function(value){
			  	var str = '';
				for(var i=0; i<conOveArr.length; i++) {
					if (conOveArr[i][0] == value) {
						str = conOveArr[i][1]
						break;
					}
				}
				var qtip = "qtip=" + str;
                return '<span ' + qtip + '>' + str + '</span>';
			}
        }, {
           id:'month',
           header: fc['month'].fieldLabel,
           dataIndex: fc['month'].name,
           width: 60,
           align : 'center',
           renderer: formatDate
        }/*, {
           id:'decmoney',
           header: fc['decmoney'].fieldLabel,
           dataIndex: fc['decmoney'].name,
           renderer: cnMoneyToPrecFun,
           align: 'right',
           width: 80
        }, {
           id:'checkmoney',
           header: fc['checkmoney'].fieldLabel,
           dataIndex: fc['checkmoney'].name,
           renderer: cnMoneyToPrecFun,
           align: 'right',
           width: 80
        }*/, {
				id : 'per',
				header : '投资完成百分比',
				dataIndex : 'per',
				width : 120,
                align : 'right',
				renderer : function(value, cell, record) {
					var str = '';
					for (var i = 0; i < conOveArr.length; i++) {
						if (conOveArr[i][0] == record.data.conid) {
							str = conOveArr[i][3]
							break;
						}
					}
					if(str==0) return "0.00%"
					var per = ((record.data.ratiftmoney / str)*100).toFixed(2);
					return per+ "%";
				}
			}, {
           id:'ratiftmoney',
           header: fc['ratiftmoney'].fieldLabel,
           dataIndex: fc['ratiftmoney'].name,
           renderer: cnMoneyToPrecFun,
           align: 'right',
           width: 80
        }, {
        	header : '工程量统计报表',
        	align: 'center',
        	width: 120,
        	renderer : function(value,cell,record){
        		return "<a style='color:blue;' href='javascript:gclReport()'>工程量统计报表</a>"
        	}
        }, {
        	header : '投资完成统计报表',
        	align: 'center',
        	width:120,
        	renderer : function(value,cell,record){
        		return "<a style='color:blue;' href='javascript:bdgReport()'>投资完成统计报表</a>"
        	}
        }, {
           id:'billstate',
           header: fc['billstate'].fieldLabel,
           dataIndex: fc['billstate'].name,
           width: 50,
           hidden : true,
           align:'center',
           renderer: function(value){
           		var str = '';
		   		for(var i=0; i<billTypes.length; i++) {
		   			if (billTypes[i][0] == value) {
		   				str = billTypes[i][1]
		   				break; 
		   			}
		   		}
		   		return str;
           }
        }, {
        	id : 'auditState',
        	header : fc['auditState'].fieldLabel,
        	dataIndex : fc['auditState'].name,
        	width : 50,
        	align : 'center',
        	hidden:!moneyAudit,
        	renderer : function(v){
        		var str = '未稽核';
        		if(v == '1'){
        			str = '已稽核';
        		}else if(v == '2'){
        			str = '撤销稽核';
        		}
        		return str;
        	}
        }
	])
    cm.defaultSortable = true;

    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,				
	    	business: business,
	    	method: listMethod,
	    	params: "unit_id = '" + USERDEPTID + "' and pid = '"+CURRENTAPPID+"' "   // where 子句
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true
    });
    ds.setDefaultSort(orderColumn, 'asc');
    
	ds.on("beforeload",function(ds1){
    	var baseParams = ds1.baseParams
    	if(isFlwTask || isFlwView){ //流程任务节点
    		if(monid_flow != ""){
    			baseParams.params = "mon_id = '"+monid_flow+"'"
    		}else{
    			baseParams.params = "1=2"
    		}
    	}else{
    		if(selectConid != "ALL"){    		
	    		baseParams.params = " pid = '"+CURRENTAPPID+"' and conid = '"+selectConid+"'"
	    	}else{
	    		baseParams.params  = " pid = '"+CURRENTAPPID+"' and conid in (select conid from com.sgepit.pmis.contract.hbm.ConOve where condivno in ("+contFilterId+"))"
	    	}
    	}	
    });
	
	gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'cat-grid-panelas',
        ds: ds,
        cm: cm,
        sm: sm,
        tbar: [{text:title},conTrigger],
        border: false,
		header: false,
        region: 'center',
        addBtn : false,
		saveBtn : false,
		delBtn : false,
        autoScroll: true,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: business,	
      	primaryKey: primaryKey	
	});
	ds.load({params:{start: 0,limit: PAGE_SIZE}});
	if(isFlwTask){
		ds.baseParams.params="mon_id='" + monid_flow +"' and billstate=0 ";
		ds.load()
	}
	ds.on('load', function(){
		if(isFlwTask){
			if(ds.getCount()>=1){
				gridPanel.getTopToolbar().items.get('add').setVisible(false);
			}
		}
	});
	sm.on('rowselect', function(o, rowIndex, rec){
		var auditState=rec.get('auditState');
		if(auditState=='1'){
			editBtn.setDisabled(true);
			delBtn.setDisabled(true);
		}else{
			editBtn.setDisabled(false);
			delBtn.setDisabled(false);
		}
	});
	var combo = new Ext.form.ComboBox({
				store : dsContractType,
				displayField : 'v',
				valueField : 'k',
				typeAhead : true,
				mode : 'local',
				triggerAction : 'all',
				emptyText : '选择合同分类....',
				selectOnFocus : true,
				width : 135
			});
	combo.on('select', comboselect);

	var combo2 = new Ext.form.ComboBox({
				store : dsCombo2,
				displayField : 'v',
				valueField : 'k',
				typeAhead : true,
				mode : 'local',
				triggerAction : 'all',
				emptyText : '选择合同分类二....',
				selectOnFocus : true,
				disabled : true,
				width : 135
			});

	combo2.on('select', comboselect2);
	function comboselect() {
		combo2.clearValue();
		combo2.setDisabled(true);
		var conDiv = combo.getValue();
		var conDivDesc = combo.getRawValue();
		if (conDiv == "-1") {
			dsConove.baseParams.params = "condivno in('QT','FW') and pid='" + CURRENTAPPID + "'"
		} else {
			dsConove.baseParams.params = " pid='" + CURRENTAPPID + "' and condivno='" + conDiv + "'"
			DWREngine.setAsync(false);
			contarctType2 = new Array();
			contarctType2.push(['-1', '所有合同'])
			appMgm.getCodeValue(conDivDesc, function(list) {
						for (i = 0; i < list.length; i++) {
							var temp = new Array();
							temp.push(list[i].propertyCode);
							temp.push(list[i].propertyName);
							contarctType2.push(temp);
						}
					});
			if (conDiv != "-1" && contarctType2.length > 0) {
				dsCombo2.loadData(contarctType2);
				combo2.setDisabled(false)
			}
			DWREngine.setAsync(true);
		}
		dsConove.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				})
	}
	function comboselect2() {
		var value = combo2.getValue();
		if (value != '-1') {
			dsConove.baseParams.params = " pid='" + CURRENTAPPID + "' and condivno='" + combo.getValue()
					+ "' and sort = '" + value + "'";
		} else {
			dsConove.baseParams.params = " pid='" + CURRENTAPPID + "' and condivno='" + combo.getValue() + "'";
		}
		dsConove.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				})
	}
	var dsConove = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: 'com.sgepit.pmis.contract.hbm.ConOve',
			business: 'baseMgm',
			method: 'findWhereOrderBy',
			params:"condivno in('QT','FW')"
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: 'conid'
		}, [
			{name: 'conid', type: 'string'},
			{name: 'conno', type: 'string'},
			{name: 'conname', type: 'string'},
			{name: 'condivno', type: 'string'},
			{name: 'sort', type: 'string'}
		]),
		remoteSort: true,
		pruneModifiedRecords: true
	});
	var conSm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true,
				header : ''
			});
	var gridConove = new Ext.grid.GridPanel({
		sm:conSm,
		ds: dsConove,
		cm: new Ext.grid.ColumnModel([
			new Ext.grid.RowNumberer({
				width: 20
			}), {
				id: 'conid',
				header: '合同ID',
				dataIndex: 'conid',
				hidden: true
			}, {
				id: 'conno',
				header: '合同编号',
				dataIndex: 'conno',
				width: .3
			}, {
				id: 'conname',
				header: '合同名称',
				dataIndex: 'conname',
				width: .6
			}, {
				id: 'condivno',
				header: '合同分类一',
				dataIndex: 'condivno',
				hidden: true
			}, {
				id: 'sort',
				header: '合同分类二',
				dataIndex: 'sort',
				hidden: true
			}
		]),
		region: 'center',
		border: false,
		header: false,
		autoScroll: true,
		loadMask: true, stripeRows: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: dsConove,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	function showConove1(){
		windowType="query";
		showConove()
	}
	function showConove2(){
		windowType="add";
		showConove()
	}
	function showConove(){
		if (!conoveWindow){	
			conoveWindow = new Ext.Window({
				title: '合同列表',
				iconCls: 'form', layout: 'border',
				closeAction: 'hide',
				width: 592, height: 280,
				modal: true, resizable: false,
				closable: true, border: false,
				maximizable: false, plain: true,
				tbar: [
					'<font color=#15428b>合同分类一：</font>',
					combo, '-',
					'<font color=#15428b>合同分类二：</font>',
					combo2, '-', '->',
					{text: '选择', iconCls: 'save', handler: function(){
							var sm = gridConove.getSelectionModel()
							if (sm.getSelected()){
								var conid = sm.getSelected().get('conid');
								var conname = sm.getSelected().get('conname');
								selectConid=conid;
								if(windowType=="query"){
									conTrigger.setRawValue(conname);
							        ds.load({params:{start: 0,limit: PAGE_SIZE}});
								}else if(windowType=="add"){
									conTrigger2.setRawValue(conname);
								}
								conoveWindow.hide();
							} else {
								if(windowType=="query"){
									conTrigger.setValue("所有合同");
									selectConid='ALL';
									ds.load({params:{start: 0,limit: PAGE_SIZE}});
									conoveWindow.hide();
								}else if(windowType=="add"){
									Ext.example.msg('提示', '请选择数据！');
								}
							}
						}
					}
				],
				items: [gridConove],
				listeners :{'show':function(){
					conSm.clearSelections();
				}
				
				}
			});
		}
		conoveWindow.show();
		gridConove.getStore().load();
	}
	var auditBtn = new Ext.Button({
				id : 'audit',
				text : '稽核',
				iconCls:'btn',
				handler : function() {
					var record = sm.getSelected();
					if(record&&record!=null){
						if(record.get('billstate')!=1){
							Ext.example.msg('提示', '该数据还未审批通过，不能稽核！');
							return ;
						}
						if(record.get('auditState')=='1'){
							Ext.example.msg('提示', '该数据已经稽核！');
							return ;
						}
						Ext.MessageBox.confirm('确认', '确认稽核吗？', function(btn, text) {
									if (btn == 'yes') {
										DWREngine.setAsync(false);
										baseDao.updateBySQL(
												"update Pro_Acm_Month set AUDIT_STATE = '1' where uids = '"
														+ record.get("uids") + "'",
												function(flag) {
													if (flag == 1) {
														ds.reload();
														Ext.example.msg('提示',
																'稽核成功!');
													} else {
														Ext.example.msg('提示',
																'稽核失败!');
													}
												});
										DWREngine.setAsync(true);
									}
								});
					}else{
						Ext.example.msg('提示', '请选择需要稽核的数据！');
					}
				}
			});
	var auditRevBtn = new Ext.Button({
				id : 'audit',
				text : '撤销稽核',
				iconCls:'remove',
				handler : function() {
					var record = sm.getSelected();
					if(record&&record!=null){
						if(record.get('auditState')!='1'){
							Ext.example.msg('提示', '该数据还未稽核！');
							return ;
						}
						Ext.MessageBox.confirm('确认', '确认撤销稽核吗？',
								function(btn, text) {
									if (btn == 'yes') {
										DWREngine.setAsync(false);
										baseDao.updateBySQL(
												"update Pro_Acm_Month set AUDIT_STATE = '2' where uids = '"
														+ record.get("uids") + "'",
												function(flag) {
													if (flag == 1) {
														ds.reload();
														Ext.example.msg('提示',
																'撤销稽核成功!');
													} else {
														Ext.example.msg('提示',
																'撤销稽核失败!');
													}
												});
										DWREngine.setAsync(true);
									}
								});
					}else{
						Ext.example.msg('提示', '请选择需要撤销稽核的数据！');
					}
				}
			});
	var proofBtn = new Ext.Button({
			id : 'proof',
			text : '生成凭证',
			iconCls : 'btn',
			handler : function() {
				var record = sm.getSelected();
    			if(record == null){
    				Ext.example.msg('提示', '请选择一条数据');
					return false;
    			}
				if (record.get('auditState') != '1') {
					Ext.example.msg('提示', '此数据未稽核,不能生成凭证!');
					return false;
				}
				var flag;
				DWREngine.setAsync(false);
				baseMgm.getData("select t.uids from FACOMP_PROOF_INFO t where t.relateuids = '"
							+ record.get('uids') + "'", function(list) {
						flag = list != null && list.length >0 ? false : true;
				});
				DWREngine.setAsync(true);
				if (flag){
					var conid = record.get('conid');
					var time = record.get('month');
					time = "&time=" + time.substring(0,4) + '-' + time.substring(4);
					var	money = '&money=' + record.get('ratiftmoney');
					var relateuids = "&relateuids=" + record.get('uids');
					var docUrl = BASE_PATH + "Business/finalAccounts/complete/facomp.proof.form.jsp?conid=" + conid + time + money + relateuids;
					var rtnstr = showModalDialog(docUrl,"", "dialogWidth:400px;dialogHeight:400px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
					if(rtnstr == 'y'){
						window.location.href = BASE_PATH + "Business/finalAccounts/complete/facomp.proof.info.jsp";
					}
				} else {
					Ext.example.msg('提示', '此数据已生成凭证!');
					return false;
				}
			}
		});

   // 9. 创建viewport，加入面板action和content
    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [gridPanel]
    });
    if (ModuleLVL < 3) {
    	if(moneyAudit!=true){
	   		gridPanel.getTopToolbar().add(addBtn,'-',editBtn,'-',delBtn);
    	}else{
    		gridPanel.getTopToolbar().add(auditBtn,'-',auditRevBtn,'-',proofBtn);
    	}
    }
    conTrigger.setValue("所有合同");
	if(isFlwView){
		with(gridPanel.getTopToolbar().items){
			get('add').setVisible(false);
			get('edit').setVisible(false);
			get('del').setVisible(false);
		}
	}
	
	//新增
	var formWin, conCombo, sjTypeCombo, conStore, sjTypeStore;
	var editMode, loadFormRecord;
	var editData, sjType;
	function saveFormFun(){
		editMode = this.id;
		var formRecord = Ext.data.Record.create(Columns);
		var form = Ext.getCmp('gclForm');
		conTrigger2.setValue("");
		if(editMode=='add'){
			loadFormRecord = new formRecord({
				uids : '',
	    		pid : CURRENTAPPID,
				conname: selectConid=='ALL'?'':conTrigger.getValue(),
				monId: '',
				month: '',
				unitId: USERDEPTID,
				operator: USERID,
//				decmoney: 0,
//				checkmoney: 0,
				ratiftmoney: 0,
				billstate: bill
	    	});
		}else if(editMode=='edit'){
			var record = sm.getSelected();
			var conname="";
			if(!record){
				Ext.Msg.alert('提示', '请先选择需要修改的项目！');
				return;
			}
			DWREngine.setAsync(false); 
			baseDao.findByWhere2(bean, "uids='"+record.data.uids+"'", function(list){
				if(list.length>0){
					editData = list[0];
					sjType = editData.month;
				}
			});
			DWREngine.setAsync(false);
	    	loadFormRecord = new formRecord(editData);
	    	for(var i=0; i<conOveArr.length; i++) {
				if (conOveArr[i][0] == record.data.conid) {
					conname = conOveArr[i][1]
					break;
				}
			}
			loadFormRecord.conid=conname;
		}
		if(!formWin){
			//----------数据期别----------
		    sjTypeStore = new Ext.data.SimpleStore({
		    	id: 0,
		        fields: ['val', 'txt']
		    });
			
		    sjTypeCombo = new Ext.form.ComboBox({
		    	fieldLabel: '数据期别',
		    	id : 'month',
		    	width:100,
		    	maxHeight:300,
		    	store: sjTypeStore,
		    	displayField:'txt',
				valueField:'val',
				triggerAction: 'all',
				mode: 'local',
				editable :false,
				allowBlank: false,
				selectOnFocus:true
		    });
		    sjTypeCombo.on("beforequery",function(obj){
		    	if(conTrigger2.getValue()==""){
		    		Ext.Msg.alert('提示', '请先选择合同！');
		    		return false;
		    	}
		    	var conidTemp=selectConid;
		    	if(editMode=='edit'){
		    		var record = sm.getSelected();
		    		conidTemp=record.data.conid;
		    	}
		    	DWREngine.setAsync(false);
		    	proAcmMgm.getSjTypeForComp(conidTemp, function(dat){
					sjTypeStore.loadData(eval(dat))
				});
				DWREngine.setAsync(true); 
		    	return true;
		    })
			
			formWin = new Ext.Window({
				width : 460,
				height : 150,
				closeAction : 'hide',
				title : '工程量投资完成',
				modal : true,
				border : false,
				resizable: false,
				items : [
					new Ext.FormPanel({
						id : 'gclForm',
						header : false,
						border : false,
						height : 120,
						autoScroll : true,
						labelAlign : 'right',
						bodyStyle: 'padding:10px;',
						items : [conTrigger2,sjTypeCombo,
								new fm.Hidden(fc['uids']),
			         			new fm.Hidden(fc['monId']),
//								new fm.Hidden(fc['decmoney']),	
//    							new fm.Hidden(fc['checkmoney']),
    							new fm.Hidden(fc['ratiftmoney']),
    							new fm.Hidden(fc['billstate']),
								new fm.Hidden(fc['pid']),
				           		new fm.Hidden(fc['unitId']),
				           		new fm.Hidden(fc['operator'])
						],
						buttons: [{
							text: '保存',
							handler: formSave
						}, {
							text: '取消',
							handler: function() {
								formWin.hide();
							}
						}]
					})
				]
			});
		}
		formWin.show();
		Ext.getCmp('gclForm').getForm().loadRecord(loadFormRecord);
		if(editMode=='edit'){
			sjTypeCombo.setRawValue(formatDate(sjType));
		}
	}
	
	//删除
	function deleteFormFun(){
		if(!sm.getSelected())return;
		Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,text) {
			if (btn == "yes") {
				var record = sm.getSelected();
				DWREngine.setAsync(false);
				//删除时执行工程量数据交换，2为执行初始化的删除语句，转为后置SQL，不执行细表数据查询
				proAcmMgm.proAcmDataExchange(record.data.uids,defaultOrgRootID,CURRENTAPPID,"2");
				proAcmMgm.delProAcmMonth(record.data,function(str){
					if(str=="1"){
						Ext.example.msg('删除成功！', '您成功删除了1条记录。');
						ds.reload();
					}else{
						Ext.example.msg('删除失败！', '删除数据发生错误！');
					}	
				})
				DWREngine.setAsync(true);
			}
		})
	}
	
	
	function formSave(){
		var form = Ext.getCmp('gclForm').getForm();
		if(!form)return;
		if(form.isValid()){
			var data = form.getValues()
			var conidTemp=selectConid;
	    	if(editMode=='edit'){
	    		var record = sm.getSelected();
	    		conidTemp=record.data.conid;
	    	}
			data.month = sjTypeCombo.getValue();
			data.conid = conidTemp;
			var uids = data.uids;
			var conid = data.conid;
			var jsonData = Ext.encode(data);
			Ext.Ajax.request({
					waitMsg: '保存中......',
					method: 'POST',
					url : MAIN_SERVLET,
					params : {
								ac : "form-insert",
								id : uids,
								bean : bean
							},
					xmlData : jsonData,			
					success:function(form,action){
				        var obj = Ext.util.JSON.decode(form.responseText);
				        if(obj.success==true)
				        { 		           
				            if(editMode == "add"){
				            	editMode = "edit";		            	
								uids = obj.msg
								DWREngine.setAsync(false);  
//						    	proAcmMgm.initialProAcmInfo(conid, uids, CURRENTAPPID, function(){
								proAcmMgm.initialProAcmTree(conid, uids, CURRENTAPPID, function(){
						    		Ext.Msg.alert('提示',"其他合同投资完成保存成功!");
						    		formWin.hide();
						    		ds.reload();
						    	});
						    	DWREngine.setAsync(true);  	
							}else{
								Ext.Msg.alert('提示',"其他合同投资完成保存成功!");
								formWin.hide();
								ds.reload();
							}
							//新增或修改时执行工程量数据交换，0为不执行初始化的删除语句的前置SQL
							DWREngine.setAsync(false);
    						proAcmMgm.proAcmDataExchange(uids,defaultOrgRootID,CURRENTAPPID,"0");
    						DWREngine.setAsync(true);
				        }else{
				            Ext.Msg.alert('提示',obj.msg);
				        } 
					},
				    failure:function(form,action){
				        Ext.Msg.alert('警告','系统错误');
				    }
				});
		} else {
			Ext.Msg.alert('提示','必填项数据为空，或数据填写不符合规则！');
		}
	}
	
	function formatDate(sj, m, rec){
		return sj ? (sj.substring(0,4)+"年"+sj.substring(4,6)+"月") : '';
	};
});

	function gclReport(){
		if(!sm.getSelected())return;
		var rec = sm.getSelected();
		var width = window.screen.width;
		var height = window.screen.height*.8;
		var viewFlag=moneyAudit;
		if(moneyAudit!=true){
			if(rec.get('auditState')=='1'){
				viewFlag=true;
			}
		}
		var style = "dialogWidth:"+width+"px;dialogHeight:"+height+"px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
		var url = CONTEXT_PATH+"/Business/planMgm/qantitiesComp/other.con.tz.comp.gcl.report.jsp?isTask=" + isFlwTask + "&isView=" + isFlwView + "&step=" + step_flow;
		url += "&conid=" + rec.data["conid"] + "&masterId=" + rec.data["uids"] + "&sjType=" + rec.data["month"]+ "&viewFlag=" + viewFlag;
		var rtn = window.showModalDialog(encodeURI(url), null, style);
		if(rtn==null||rtn==""){
			gridPanel.getStore().reload();
			//优化报表打开时间，直接将报表数据存储到表 pengy 2014-02-27
	    	proAcmMgm.saveProAcmTreeToTable(rec.data["uids"], CURRENTAPPID);
		}
	}
	function bdgReport(){
//		if(!sm.getSelected())return;
//		var rec = sm.getSelected();
//		var width = 800;
//		var height = window.screen.height*.8;
//		var style = "dialogWidth:"+width+"px;dialogHeight:"+height+"px;center:yes;resizable:no;Minimize=yes;Maximize=yes";
//		var url = CONTEXT_PATH+"/Business/planMgm/qantitiesComp/gcl.tz.comp.bdg.tree.jsp?isTask=" + isFlwTask + "&isView=" + isFlwView + "&step=" + step_flow;
//		url += "&conid=" + rec.data["conid"] + "&masterId=" + rec.data["uids"] + "&sjType=" + rec.data["month"];
//		var rtn = window.showModalDialog(encodeURI(url), null, style);
		
		if(!sm.getSelected())return;
		var rec = sm.getSelected();
		
		var xgridUrl = CONTEXT_PATH + "/dhtmlxGridCommon/xgridview/templateXgridView.jsp";
		var width = 860;//window.screen.width;
		var height = window.screen.height*.8;
		var param = new Object()
		param.sj_type = rec.data.month; // 时间
		param.unit_id = CURRENTAPPID; // 取表头用
		param.company_id = ''; // 取数据用（为空是全部单位）
		param.headtype = 'OTHER_PRO_COMP_REPORT';
		param.keycol = 'bdgid';
		param.filter = " and mon_id = '"+rec.data["uids"]+"' and month='"+rec.data.month+"' and conid='"+rec.data.conid+"'";
		param.hasFooter = "false";
		
		param.xgridtype = 'simpletree';//'tree';simpletree
		//在parentSql中依次写所有要查询的列
		var parentSQL="select t.BDGNAME,t.UNIT,t.AMOUNT,t.PRICE,(case when t.isleaf = 0 and t.declpro is null then "+
       			"(select nvl(sum(bb.money),0) from BDG_PROJECT bb where bb.CONID = t.conid and bb.BDGID like t.bdgid||'%')"+
                " else t.money end) as MONEY,t.TOTALRATIMONTHMONEYLASTALL,t.TOTALRATIMONTHLAST,t.TOTALRATIMONTHMONEYLAST," +
                "t.RATIFTPRO,t.RATIFTMONEY,t.TOTALRATIMONTH,t.TOTALRATIMONTHMONEY,t.PERCENT2,t.bdgid nestedCol,t.bdgid cnode," +
                "t.parent pnode from (select t2.* from pro_acm_info_tree_report t2 where t2.mon_id='" + rec.data.uids +
                "' and t2.conid='" + rec.data.conid + "' and t2.MONTH='" + rec.data.month + "' and t2.pid='" + CURRENTAPPID +
                "') t start with t.bdgid=(select bdgid from bdg_info where bdgno='01' and pid='" + CURRENTAPPID +
                "') connect by prior t.bdgid=t.parent order by t.bdgid";
		param.parentsql = parentSQL;
		param.relatedCol = 'bdgid';
		param.bpnode = '0';
		
		param.hasSaveBtn = false;
		param.hasInsertBtn = false;
		param.hasDelBtn = false;
		
		window.showModalDialog(xgridUrl,param,
				"dialogWidth:" + width + ";dialogHeight:" + height
						+ ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	}
function cnMoneyToPrecFun(v){
	return cnMoneyToPrec(v,2);
}


