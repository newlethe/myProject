var bean = "com.sgepit.pmis.investmentComp.hbm.ProAcmMonth";
var primaryKey = "uids";
var orderColumn = "month desc";
var business = "baseMgm";
var listMethod = "findwhereorderby";
var title = "<font color=#15428b><b>其他类合同投资完成</b></font>" 	
var billTypes = new Array();
var conComboxSelect = "ALL";
var gridPanel, conComboAll, conStoreAll;
var conOveArr = new Array();
var sm;
var bill = isFlwTask == true ? '0' : '1';

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
    
    investmentPlanService.getConOveInfo("", function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].conid);			
			temp.push(list[i].conname);
			temp.push(list[i].conno);
			conOveArr.push(temp);			
		}
    });
	DWREngine.setAsync(true);
	conStoreAll = new Ext.data.SimpleStore({
		fields : ['conid','conname','conno']
	})
	var contFilterId = "";				//合同一级分类属性代码，格式如('SB','GC','CL')
	//根据属性代码中对应“合同划分类型”中查询出工程合同，“详细设置”列包含GC
	var gcSql = "select c.property_code,c.property_name from property_code c " +
			"where c.type_name = (select t.uids from property_type t where t.type_name = '合同划分类型') " +
			"and c.property_code <> 'SG'";
	DWREngine.setAsync(false);
	baseMgm.getData(gcSql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			contFilterId+="'"+list[i][0]+"',";				
		}
		contFilterId = contFilterId.substring(0,contFilterId.length-1);
	})
	
	var	conSql = "select 'ALL' as conid,'所有合同' as conname,'ALL' as conno,'1' as type from dual " +
			" union select conid,conname ,conno,'2' as type from con_ove t " +
			" where t.condivno in ("+contFilterId+") and PID='" + CURRENTAPPID + "' order by type";
	db2Json.selectSimpleData(conSql, function(dat){
		if(dat && dat!=null && dat.length>0) {
			conStoreAll.loadData(eval(dat))
		}
	});
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
    
    conComboAll = new Ext.form.ComboBox({
        width : 300,
		valueField: 'conid',
		displayField: 'conname', 
		mode: 'local',
        triggerAction: 'all',
        store: conStoreAll,
        readOnly : true,
        hidden : (isFlwTask || isFlwView),
		anchor:'95%'
    }) 
    conComboAll.setValue("ALL");
    
    conComboAll.on("select",function(obj,rec,inx){
   		conComboxSelect = obj.getValue()
    	ds.load({params:{start:0,limit: PAGE_SIZE}});
    });
    
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
			fieldLabel: '投资完成流程主键',
			anchor:'95%'
        }, 'conid': {
			name: 'conid',
			fieldLabel: '合同名称',
			anchor:'95%'
		}, 'month': {
			name: 'month',
			fieldLabel: '时间',
			anchor:'95%'
		}, 'decmoney': {
			name: 'decmoney',
			fieldLabel: '申报金额',
			anchor:'95%'
        }, 'checkmoney': {
			name: 'checkmoney',
			fieldLabel: '核定金额',
			anchor:'95%'
        }, 'ratiftmoney': {
			name: 'ratiftmoney',
			fieldLabel: '批准金额',
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
    	{name: 'decmoney', type: 'float'},
		{name: 'checkmoney', type: 'float'},
		{name: 'ratiftmoney', type: 'float'},
		{name: 'billstate', type: 'string'}
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
//		}, {
//           id:'pid',
//           header: fc['pid'].fieldLabel,
//           dataIndex: fc['pid'].name,
//		   hidden:true
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
        }, {
           id:'decmoney',
           header: fc['decmoney'].fieldLabel,
           dataIndex: fc['decmoney'].name,
           renderer : function(value,cell,record){
			   	var monid = record.data.uids;
			   	var conid = record.data.conid;
			   	var re=0;
       		 	DWREngine.setAsync(false);
	           	baseMgm.getData("select sum(decmoney)sumv from pro_acm_tree where conid='"+conid+"' and mon_id='"+monid+"' and parent='0' ",function(list){
					re=list[0]
			    });
			 	DWREngine.setAsync(true);
			 	return re;
           },
           align: 'right',
           width: 50
        }, {
           id:'checkmoney',
           header: fc['checkmoney'].fieldLabel,
           dataIndex: fc['checkmoney'].name,
          	renderer : function(value,cell,record){
           		var monid = record.data.uids;
           		var conid = record.data.conid;
           		var re=0;
       		 	DWREngine.setAsync(false);
	           	baseMgm.getData("select sum(checkmoney)sumv from pro_acm_tree where conid='"+conid+"' and mon_id='"+monid+"' and parent='0' ",function(list){
					re=list[0]
			    });
			 	DWREngine.setAsync(true);
			 	return re;
           },
           align: 'right',
           width: 50
        }, {
           id:'ratiftmoney',
           header: fc['ratiftmoney'].fieldLabel,
           dataIndex: fc['ratiftmoney'].name,
          	renderer : function(value,cell,record){
           		var monid = record.data.uids;
           		var conid = record.data.conid;
           		var re=0;
       		 	DWREngine.setAsync(false);
	           	baseMgm.getData("select sum(ratiftmoney)sumv from pro_acm_tree where conid='"+conid+"' and mon_id='"+monid+"' and parent='0' ",function(list){
					re=list[0]
			    });
			 	DWREngine.setAsync(true);
			 	return re;
           },
           align: 'right',
           width: 50
        }, {
        	header : '投资完成统计报表',
        	align: 'center',
        	width: 120,
        	renderer : function(value,cell,record){
        		var mon = formatDate(record.data.month);
        		return "<a style='color:blue;' href=javascript:otherReport()>"+mon+"投资完成统计报表</a>"
        	}
        }, {
           id:'billstate',
           header: fc['billstate'].fieldLabel,
           dataIndex: fc['billstate'].name,
           width: 40,
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
    		if(conComboxSelect != "ALL"){    		
	    		baseParams.params = " pid = '"+CURRENTAPPID+"' and conid = '"+conComboxSelect+"'"
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
        tbar: [{text:title},conComboAll],
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
		
	});
	
   // 9. 创建viewport，加入面板action和content
    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [gridPanel]
    });
    if (ModuleLVL < 3) {
	   	gridPanel.getTopToolbar().add(addBtn,'-',editBtn,'-',delBtn);
    }
    gridPanel.getTopToolbar().add('->','计量单位： 元');
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
		if(editMode=='add'){
			loadFormRecord = new formRecord({
				uids : '',
	    		pid : CURRENTAPPID,
				conid: conComboxSelect=='ALL'?'':conComboxSelect,
				monId: '',
				month: '',
				unitId: USERDEPTID,
				operator: USERID,
				decmoney: 0,
				checkmoney: 0,
				ratiftmoney: 0,
				billstate: bill
	    	});
		}else if(editMode=='edit'){
			var record = sm.getSelected();
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
		}
		if(!formWin){
			DWREngine.setAsync(false);  
			conStore = new Ext.data.SimpleStore({
				id: 0,
				fields : ['conid','conname','conno']
			})
			var conSql = "select conid,conname ,conno,'2' as type from con_ove t where t.condivno in ("+contFilterId+") and pid='" + CURRENTAPPID + "' order by type";
			db2Json.selectSimpleData(conSql,function(dat){
				if(dat && dat!=null && dat.length>0) {
					conStore.loadData(eval(dat))
				}
			});
			DWREngine.setAsync(true);
		    conCombo = new Ext.form.ComboBox({
		    	name: "conid",
				fieldLabel: '合同名称',
				valueField: 'conid',
				displayField: 'conname', 
				mode: 'local',
		        typeAhead: true,
		        triggerAction: 'all',
		        store: conStore,
		        lazyRender: true,
		        forceSelection: true,
		        allowBlank: false,
		        width : 300,
		        listClass: 'x-combo-list-small',
				anchor:'95%'
		    })
			conCombo.on("select",function(obj,rec,inx){
		    	conId = obj.getValue();
		    	sjTypeCombo.setValue('');
		    })
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
		    	if(conCombo.getValue()==""){
		    		Ext.Msg.alert('提示', '请先选择合同！');
		    		return false;
		    	}
		    	DWREngine.setAsync(false);
		    	proAcmMgm.getSjTypeForComp(conCombo.getValue(), function(dat){
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
						items : [conCombo,sjTypeCombo,
								new fm.Hidden(fc['uids']),
			         			new fm.Hidden(fc['monId']),
								new fm.Hidden(fc['decmoney']),	
    							new fm.Hidden(fc['checkmoney']),
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
			data.month = sjTypeCombo.getValue();
			data.conid = conCombo.getValue();
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
						    	proAcmMgm.initialProAcmTree(conid, uids, CURRENTAPPID, function(){
						    		Ext.Msg.alert('提示',"其他类合同投资完成保存成功!");
						    		formWin.hide();
						    		ds.reload();
						    	});
						    	DWREngine.setAsync(true);  	
							}else{
								Ext.Msg.alert('提示',"其他类合同投资完成保存成功!");
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

	function otherReport(){
		if(!sm.getSelected())return;
		var rec = sm.getSelected();
		
		var xgridUrl = CONTEXT_PATH + "/dhtmlxGridCommon/xgridview/templateXgridView.jsp";
		var width = 860;//window.screen.width;
		var height = window.screen.height*.8;
		var param = new Object()
		param.sj_type = rec.data.month; // 时间
		param.unit_id = CURRENTAPPID; // 取表头用
		param.company_id = ''; // 取数据用（为空是全部单位）
		param.headtype = 'PRO_COMP_REPORT';
		param.keycol = 'bdgid';
		param.filter = " and mon_id = '"+rec.data["uids"]+"' and month='"+rec.data.month+"' and conid='"+rec.data.conid+"'";
		param.hasFooter = "false";
		
		param.xgridtype = 'simpletree';//'tree';
		
		//增加了prono列，显示概算的序号，且在第一列，要在parentSql中依次写所有要查询的列
		var parentSQL="select t.PRONO,t.BDGNAME,t.UNIT,t.AMOUNT,t.PRICE,t.MONEY,t.TOTALRATIMONTHMONEYLASTALL,t.TOTALRATIMONTHLAST," +
				"t.TOTALRATIMONTHMONEYLAST,t.DECLPRO,t.DECMONEY,t.CHECKPRO,t.CHECKMONEY,t.RATIFTPRO,t.RATIFTMONEY," +
				"t.TOTALRATIMONTH,t.TOTALRATIMONTHMONEY,t.PERCENT2,t.bdgid nestedCol,t.bdgid cnode,t.parent pnode from " +
				"(select t2.* from pro_acm_info_tree_out_view t2 where t2.mon_id='" + rec.data.uids +"' and t2.conid='" +
				rec.data.conid + "' and t2.MONTH='"+ rec.data.month + "' and t2.pid='"+ CURRENTAPPID + "') t start with t.bdgid=" +
				"(select bdgid from bdg_info where bdgno='01' and pid='"+ CURRENTAPPID +"') connect by prior t.bdgid=t.parent";
		param.parentsql = parentSQL;
		param.relatedCol = 'bdgid';
		param.bpnode = '0';
		
		param.hasSaveBtn = true;
		param.hasInsertBtn = false;
		param.hasDelBtn = false;
		//param.saveType = "saveByCol";
		
		var rtn = window.showModalDialog(xgridUrl,param,
				"dialogWidth:" + width + ";dialogHeight:" + height
						+ ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
		if(rtn==null||rtn==""){
			gridPanel.getStore().reload();
			//报表保存完成，关闭时执行数据交互
			//执行工程量数据交换，0为不执行初始化的删除语句的前置SQL
	    	proAcmMgm.proAcmDataExchange(rec.data.uids,defaultOrgRootID,CURRENTAPPID,"0");
		}
	}



