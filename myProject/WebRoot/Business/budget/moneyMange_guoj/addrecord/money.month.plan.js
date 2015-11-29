
var bean = "com.sgepit.pmis.budget.hbm.BdgMonthMoneyPlan"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'enddate'

var bean_fw = "com.sgepit.pmis.budget.hbm.BdgMonthMoneyPlanSub"
var primaryKey_fw = 'uids'
var orderColumn_fw = 'puids'

var insertFlag = 0;
var PlantInt_fw, selectedData,ds_fw;
var filterStr = " ifbl='1' and dept='"+USERDEPTID+"' and pid='"+CURRENTAPPID+"' ";
Ext.onReady(function(){
	var jhztArr = [['0','新增'],['1','已上报'],['2','汇总'],['4','审批完成'],['5','下达'],['6','上报中'],['-1','退回']];
	var billStateArr = [['0','未完成'],['1','已完成'],['-1','未完成']];		//特殊处理， 资金上班，汇总，补录，下达流程状态始终为未完成
	//--用户userid:realname
	var userArray = new Array();
   	DWREngine.setAsync(false);
	baseMgm.getData("select userid,realname from rock_user",function(list){
	//baseMgm.getData("select userid,realname from rock_user where unitid='"+USERDEPTID+"'",function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			userArray.push(temp);
		}
	})
	DWREngine.setAsync(true);
 	var getuserSt = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:userArray
 	})
 
	//-----------------部门（bmbz：sgcc_ini_unit==unitname)
	var bmbzArr = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select unitid,unitname from sgcc_ini_unit order by unitid",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			bmbzArr.push(temp);
		}
    });
 	DWREngine.setAsync(true);	
 
 ///-------获取年份
 	var sj_yearArray = new Array();
   	DWREngine.setAsync(false);
   	var sql_year ="select distinct substr(to_char(sbsj,'yyyy-mm-dd'),1,4) year,  substr(to_char(sbsj,'yyyy-mm-dd'),1,4)||'年' years from bdg_month_money_plan where pid='"+CURRENTAPPID+"' order by year ";
	baseMgm.getData(sql_year,function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			sj_yearArray.push(temp);
		}
	})
	DWREngine.setAsync(true);
 	var getSj_yearSt = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:sj_yearArray
 	})
    var jhStore = new Ext.data.SimpleStore({
 		fields:['k','v'],
 		data:jhztArr
 	}) 	
	//----------------------费用计划主表信息----------------------------//
	var fm = Ext.form;
	
	var fc = {
		'uids':{name:'uids',fieldLabel:'流水号',hidden:true,hideLabel:true,anchor:'95%'},
		'bh':{name:'bh',fieldLabel:'编号',anchor:'95%'},
		'content':{name:'content',fieldLabel:'工作内容',allowBlank: false,anchor:'95%'},
		'planmoney':{name:'planmoney',fieldLabel:'计划费用',allowBlank: false,anchor:'95%'},
		'enddate':{name:'enddate',fieldLabel:'工作完成日期',format: 'Y-m-d',anchor:'95%'},
		'sbsj':{name:'sbsj',fieldLabel:'上报日期',format: 'Y-m-d',anchor:'95%'},
		'fzr' : {
			name : 'fzr',
			fieldLabel : '负责人',
			valueField:'k',
			displayField: 'v', 
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: getuserSt,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
            allowBlank: false,
			anchor : '95%'
		},
		'deptuser':{name:'deptuser',fieldLabel:'分管领导审批',anchor:'95%'},
		'zbr':{name:'zbr',fieldLabel:'制表人',anchor:'95%'},
		'memo':{name:'memo',fieldLabel:'备注',anchor:'95%'},
		'memo1':{name:'memo1',fieldLabel:'备用字段',anchor:'95%'},
		'dept':{name:'dept',fieldLabel:'上报部门',anchor:'95%'},
		'jhzt' : {
			name : 'jhzt',
			fieldLabel : '计划状态',
			valueField:'k',
			displayField: 'v', 
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: jhStore,
            lazyRender:true,
            listClass: 'x-combo-list-small',
            allowNegative: false,
            allowBlank: false,
			anchor : '95%'
		},
		'billState':{name:'billState',fieldLabel:'执行状态',anchor:'95%'},
		'ifbl':{name:'ifbl',fieldLabel:'是否补录',anchor:'95%'}
	}
	
	var Columns = [
		{name:'uids',type:'string'}, 	 {name:'content',type:'string'},		{name:'planmoney',type:'float'},
		{name:'bh',type:'string'}, 
		{name:'enddate',type:'date',dateFormat:'Y-m-d H:i:s'},       
		{name:'sbsj',type:'date',dateFormat:'Y-m-d H:i:s'},       
		{name:'fzr',type:'string'},{name:'deptuser',type:'string'},
		{name:'zbr',type:'string'},     {name:'memo',type:'string'},	{name:'memo1',type:'string'},
		{name:'dept',type:'string'},     {name:'jhzt',type:'string'},	{name:'billState',type:'string'},
		{name:'ifbl',type:'string'}
	]	
	
	var Plant = Ext.data.Record.create(Columns);

	var PlantInt = {
		uids:'',  content:'',  bh:bh_flow,  planmoney:'',   enddate:'',sbsj:'',    fzr:'',   deptuser:'',
		zbr:'',   memo:'',  memo1:'',dept:USERDEPTID,jhzt:'0',billState:'0',ifbl:'1'
	}
	var sm =  new Ext.grid.CheckboxSelectionModel();

	var cm = new Ext.grid.ColumnModel([
		sm,
		{id:'uids'     ,	  header:fc['uids'].fieldLabel     ,  dataIndex:fc['uids'].name, hidden: true},
		{id:'bh'       , 	  header:fc['bh'].fieldLabel       ,  dataIndex:fc['bh'].name},
		{id:'content'       , 	  header:fc['content'].fieldLabel       ,  dataIndex:fc['content'].name,type: 'string'},
		{id:'planmoney'     , 	  header:fc['planmoney'].fieldLabel     ,  dataIndex:fc['planmoney'].name,type: 'float'},
		{id:'enddate'      , 	  header:fc['enddate'].fieldLabel     ,  dataIndex:fc['enddate'].name,renderer: formatDate,type: 'date'},
		{id:'sbsj'      , 	  header:fc['sbsj'].fieldLabel     ,  dataIndex:fc['sbsj'].name,renderer: formatDate,type: 'date'},
		{id:'fzr'      ,  	  header:fc['fzr'].fieldLabel      ,  dataIndex:fc['fzr'].name,store: getuserSt,
			renderer:function(value){
				for(var i = 0;i<userArray.length;i++){
					if(value == userArray[i][0]){
						return userArray[i][1]
					}
				}
			},type: 'combo'
		},
		{id:'deptuser'      ,  	  header:fc['deptuser'].fieldLabel      ,  dataIndex:fc['deptuser'].name,hidden:true,
			renderer:function(value){
				for(var i = 0;i<userArray.length;i++){
					if(value == userArray[i][0]){
						return userArray[i][1]
					}
				}
			}
		},
		{id:'dept'      ,  	  header:fc['dept'].fieldLabel      ,  dataIndex:fc['dept'].name,
			renderer:function(value){
				for(var i = 0;i<bmbzArr.length;i++){
					if(value == bmbzArr[i][0]){
						return bmbzArr[i][1]
					}
				}
			}
		},
		{id:'jhzt'      ,  	  header:fc['jhzt'].fieldLabel      ,  dataIndex:fc['jhzt'].name,store: jhStore,
			renderer:function(value){
				for(var i = 0;i<jhztArr.length;i++){
					if(value == jhztArr[i][0]){
						if(value==0){return "<font color=blue>"+jhztArr[i][1]+"</font>"}
						else if(value==5){return "<font color=red>"+jhztArr[i][1]+"</font>"}
						else{return jhztArr[i][1]}
					}
				}
			},type: 'combo'
		},
		{id:'billState'      ,  	  header:fc['billState'].fieldLabel      ,  dataIndex:fc['billState'].name,
			renderer:function(value){
				for(var i = 0;i<billStateArr.length;i++){
					if(value == billStateArr[i][0]){
						return billStateArr[i][1]
					}
				}
			}
		},
		{id:'zbr'      ,  	  header:fc['zbr'].fieldLabel      ,  dataIndex:fc['zbr'].name,hidden:true,
			renderer:function(value){
				for(var i = 0;i<userArray.length;i++){
					if(value == userArray[i][0]){
						return userArray[i][1]
					}
				}
			}
		},
		{id:'memo'       ,  	  header:fc['memo'].fieldLabel       ,  dataIndex:fc['memo'].name},
		{id:'memo1'   , 	  header:fc['memo1'].fieldLabel   ,  dataIndex:fc['memo1'].name,hidden:true},
		{id:'ifbl'   , 	  header:fc['ifbl'].fieldLabel   ,  dataIndex:fc['ifbl'].name,hidden:true}
	]);
	cm.defaultSortable = true;//可排序
	
	var ds = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean,
			business:business,
			method: listMethod
		},
		proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
		reader: new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
		},Columns),
		remoteSort: true,
        pruneModifiedRecords: true
	})
	ds.setDefaultSort(orderColumn, 'desc');

	var addBtn = new Ext.Button({
    	text:'新增',
    	disabled :true,
    	iconCls : 'add',
    	handler:insertFun_plan
    })
    var editBtn = new Ext.Button({
    	text:'修改',
    	iconCls:'btn',
    	handler:toEditHandler_plan
    })
    var delBtn = new Ext.Button({
    	text:'删除',
    	iconCls:'remove',
    	handler:DelFun
    })
    var sbBtn = new Ext.Button({
    	text:'领导审批',
    	iconCls:'btn',
    	handler:sbFun
    })
    var queryBtn = new Ext.Button({
    	text:'查询',
    	iconCls:'option',
    	handler:showWindow
    })
	function DelFun(){
    	gridPanel.defaultDeleteHandler()
    }
     var comboFilter_y =  new Ext.form.ComboBox({
    		name:'sj_y',
			readOnly : true,
			width:90,
			store:getSj_yearSt,
			valueField: 'k',
			displayField: 'v',
			triggerAction: 'all',
			mode: 'local',
			listeners:{select:function(combo,record,index){
				if(comboFilter_m.getValue()!=""){
		        	ds.baseParams.params = "ifbl='1' and dept='"+USERDEPTID+"' and to_char(sbsj,'yyyy-mm')='"+record.data.k+'-'+comboFilter_m.getValue()+"'";
					ds.load({
						params : {
							start : 0,
							limit : 20
						}
					});
				}
	        }}
    });
    var comboFilter_m =  new Ext.form.ComboBox({
    		name:'sj_m',
			readOnly : true,
			width:90,
         	store: new Ext.data.SimpleStore({
         		fields: ['id', 'name'],
           		data: [
	                 ['01', '01月'],['02', '02月'],['03', '03月'], ['04', '04月'],
	                 ['05', '05月'],['06', '06月'],['07', '07月'], ['08', '08月'],
	                 ['09', '09月'],['10', '10月'],['11', '11月'], ['12', '12月']
                  ]}),
            mode: 'local',        
            displayField:'name',
            valueField:'id',
            triggerAction: 'all',
            listeners:{select:function(combo,record,index){
            	if(comboFilter_y.getValue()!=""){
	            	ds.baseParams.params = "ifbl='1' and dept='"+USERDEPTID+"' and to_char(sbsj,'yyyy-mm')='"+comboFilter_y.getValue()+'-'+record.data.id+"'";
					ds.load({
						params : {
							start : 0,
							limit : 20
						}
					});
            	}
	            }}
    });   
    var textTotalMoney = new Ext.form.TextField({
		readOnly:true,
		style:"color:blue"
	})
	gridPanel = new Ext.grid.EditorGridTbarPanel({
		name:'fyjh',
		title:'费用计划',
		ds : ds,
		cm : cm,
		sm : sm,
		border : false,
		region : 'center',
		addBtn:false,
		saveBtn:false,
		delBtn:false,
		clicksToEdit : 2,
		header : false,
		autoScroll : true, // 自动出现滚动条
		//tbar : ['<font color=#15428b><B>费用计划表<B></font>','-',addBtn,editBtn,delBtn,'-',sbBtn,'-','按上报时间查询:',comboFilter_y,comboFilter_m,'->','合计费用:',textTotalMoney],
		tbar : ['<font color=#15428b><B>费用计划表<B></font>','-',addBtn,'-',editBtn,'-',delBtn,'-',sbBtn,'-','->',queryBtn,'合计费用:',textTotalMoney],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : 20,
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
	if(isFlwTask==true||isFlwView==true){
				addBtn.enable();
		}
	//bill_state:0新计划，-1审批中，1已审批
	ds.baseParams.params = "ifbl='1' and dept='"+USERDEPTID+"' and pid='"+CURRENTAPPID+"' ";
	
	ds.load({
		params : {
			start : 0,
			limit : 20
		}
	});
	ds.on('load',function(){
		//textTotalMoney.setValue(cnMoney(ds.sum('planmoney')))
    })
    var totalmoney = 0;
   /* sm.on('rowselect',function(sm,rowIndex,record){
	    var money = 0;
    	var records = sm.getSelections();
    	for(var i=0;i<records.length;i++){
    		money+=records[i].get("planmoney");
    	}
    	totalmoney=money
    	textTotalMoney.setValue(cnMoney(money))
    })
    sm.on('rowdeselect',function(sm,rowIndex,record){
	    var money = totalmoney;
    	var records = sm.getSelections();
    	for(var i=0;i<records.length;i++){
    		totalmoney-=records[i].get("planmoney");
    	}
    	textTotalMoney.setValue(cnMoney(money-totalmoney))
    })*/
    
    function insertFun_plan(){
    	var url = BASE_PATH+"Business/budget/moneyMange_guoj/addrecord/money.month.plan.addorupdate.jsp?bh="+bh_flow;
		window.location.href = url;
    }
    function toEditHandler_plan(){
		var record = gridPanel.getSelectionModel().getSelected();
		var url = BASE_PATH+"Business/budget/moneyMange_guoj/addrecord/money.month.plan.addorupdate.jsp?uids="+record.get('uids');
		window.location.href = url;
    }
    function sbFun(){
 		var records = sm.getSelections();
    	var uids = "''";
    	if(records.length<1){Ext.example.msg("提示","请选择要审批的数据");return}
    	var flag = false;
    	for(var i=0;i<records.length;i++){
    		if(records[i].get("jhzt")!=0){flag=true}
    		uids+=",'"+records[i].get("uids")+"'";
    	}
    	if(flag){
    		Ext.example.msg("提示","计划状态为‘新增’的数据才能上报！");
    		return;
    	}
    	DWREngine.setAsync(false);
    	bdgMoneyMonthPlan.sbPlanbl(uids,function(dat){
    		if(dat==true){
    			Ext.example.msg("提示","上报审批成功");
    			ds.reload();
    			if (isFlwTask == true || isFlwView == true){
    				Ext.Msg.show({
					   title: '成功！',
					   msg: '成功上报审批资金补录计划！　　　<br>可以发送流程到下一步操作！',
					   buttons: Ext.Msg.OK,
					   icon: Ext.MessageBox.INFO,
					   fn: function(value){
					   		if ('ok' == value){
					   			parent.IS_FINISHED_TASK = true;
								parent.mainTabPanel.setActiveTab('common');
					   		}
					   }
					});
    			}
    		}else{
    			Ext.example.msg("提示","上报失败");
    		}
    	})
    	DWREngine.setAsync(true);   	
    }
    //----------------------细表范围----------------------------//
 	var fm_fw = Ext.form;
   		
	var fc_fw = {
		'uids':{name:'uids',fieldLabel:'流水号',hidden:true,hideLabel:true,anchor:'95%'},
		'puids':{name:'puids',fieldLabel:'父编号',allowBlank: false,value:'',anchor:'95%'},
		'memo':{name:'memo',fieldLabel:'明细内容',allowBlank: false,anchor:'95%'},
		'memo1':{name:'memo1',fieldLabel:'备用字段1',anchor:'95%'},
		'memo2':{name:'memo2',fieldLabel:'备用字段2',anchor:'95%'},
		'memo3':{name:'memo3',fieldLabel:'备用字段3',anchor:'95%'}
	}
	
	var Columns_fw = [
		{name:'uids',type:'string'},   {name:'puids',type:'string'},     {name:'memo',type:'string'},
		{name:'memo1',type:'string'},	   {name:'memo2',type:'string'}, 	   {name:'memo3',type:'string'}
	]	
	
	var Plant_fw = Ext.data.Record.create(Columns_fw);
	PlantInt_fw = {
		uids:'', puids:'',   memo:'',    memo1:'',   memo2:'',memo3:''
	}
	var sm_fw=  new Ext.grid.CheckboxSelectionModel();

	var cm_fw = new Ext.grid.ColumnModel([
		sm_fw,
		{   id:'uids',       header:fc_fw['uids'].fieldLabel,       dataIndex:fc_fw['uids'].name,     hidden: true},
		{	id:'puids',   	 header:fc_fw['puids'].fieldLabel,        dataIndex:fc_fw['puids'].name,      width:90 ,hidden: true},
		{	id:'memo',   		 header:fc_fw['memo'].fieldLabel,      	dataIndex:fc_fw['memo'].name,editor:new Ext.form.TextField() },
		{	id:'memo1',   		 header:fc_fw['memo1'].fieldLabel,      	dataIndex:fc_fw['memo1'].name,       width:90,hidden: true    },
		{	id:'memo2',   		 header:fc_fw['memo2'].fieldLabel,      	dataIndex:fc_fw['memo2'].name,       width:90,hidden: true    },
		{	id:'memo3',   		 header:fc_fw['memo3'].fieldLabel,      	dataIndex:fc_fw['memo3'].name,       width:90,hidden: true    }
		
	]);
	
	cm_fw.defaultSortable = true;//可排序
	
    ds_fw = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean_fw,
			business:business,
			method: listMethod
		},
		proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
		reader: new Ext.data.JsonReader({
			root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey_fw
		},Columns_fw),
		remoteSort: true,
        pruneModifiedRecords: true
	})
	ds_fw.setDefaultSort(orderColumn_fw, 'asc');
	
    
    
	gridPanel_fw = new Ext.grid.EditorGridTbarPanel({
		ds : ds_fw,
		cm : cm_fw,
		sm : sm_fw,
		border : false,
		region : 'south',
		height: 300, 
		split:true,
		model: 'mini',
		clicksToEdit : 1,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>明细<B></font>'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : 20,
			store : ds_fw,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		insertHandler:insertFun,
		plant : Plant_fw,
		plantInt : PlantInt_fw,
		servletUrl : MAIN_SERVLET,
		bean : bean_fw,
		business : business,
		primaryKey : primaryKey_fw
	});
	
 
	
	//----------------------------------关联----------------------------------
	
	sm.on('rowselect',function(sm,rowIndex,record){
		var bh_fw = record.get('uids');
		ds_fw.baseParams.params = " puids='"+bh_fw+"'";
		ds_fw.load({params:{start:0,limit:PAGE_SIZE}});
		selectedData = record.get('uids');
	    if(record.get('jhzt')==0){
			//gridPanel_fw.getTopToolbar().disable();
			if(isFlwTask==true||isFlwView==true){
				delBtn.enable();
				editBtn.enable();
			}else{
	    		editBtn.enable();
	    		delBtn.enable();
	    	}
		}else if(record.get('jhzt')==-1){
			if(isFlwTask==true||isFlwView==true){
				delBtn.enable();
				editBtn.disable();
			}else{
				editBtn.disable();
		    	delBtn.enable();
		    }
		}else{
			if(isFlwTask==true||isFlwView==true){
				delBtn.disable();
				editBtn.disable();
			}else{
				delBtn.disable();
				editBtn.disable();
			}
		}
	})

    function insertFun(){
    	if(selectedData==null){
    		Ext.Msg.show({
				title : '提示',
				msg : '请先选择上面的主表信息！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}else{
    		PlantInt_fw.puids = selectedData;
    		gridPanel_fw.defaultInsertHandler()
    	}
    }	

    
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[gridPanel]
    });	
     
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };  
    
});