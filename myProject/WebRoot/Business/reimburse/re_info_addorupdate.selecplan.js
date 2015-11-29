
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
var filterStr = "dept='"+USERDEPTID+"' and jhzt='5'";

var gridPanel;
Ext.onReady(function(){
	//var jhztArr = [['0','新增'],['1','上报'],['2','汇总'],['3','审批中'],['4','审批完成'],['5','下达']];
	var jhztArr = [['5','下达']];
	var billStateArr = [['0','未完成'],['1','已完成'],['2','处理中'],['-1','退回']];
	//--用户userid:realname
	var userArray = new Array();
   	DWREngine.setAsync(false);
	baseMgm.getData("select userid,realname from rock_user where unitid='"+USERDEPTID+"'",function(list){
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
   	var sql_year ="select distinct substr(to_char(sbsj,'yyyy-mm-dd'),1,4) year,  substr(to_char(sbsj,'yyyy-mm-dd'),1,4)||'年' years from bdg_month_money_plan order by year ";
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
		'jhzt':{name:'jhzt',fieldLabel:'计划状态',anchor:'95%'},
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
		uids:'',  content:'',  bh:'',  planmoney:'',   enddate:'',sbsj:'',    fzr:'',   deptuser:'',
		zbr:'',   memo:'',  memo1:'',dept:USERDEPTID,jhzt:'0',billState:'0',ifbl:'0'
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
	
    var queryBtn = new Ext.Button({
    	text:'查询',
    	iconCls:'option',
    	handler:showWindow
    })
    var selectBtn = new Ext.Button({
    	text:'选择',
    	iconCls:'btn',
    	handler:selectHander
    })
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
		        	ds.baseParams.params = "  jhzt='5' and dept='"+USERDEPTID+"' and to_char(sbsj,'yyyy-mm')='"+record.data.k+'-'+comboFilter_m.getValue()+"'";
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
	            	ds.baseParams.params = " jhzt='5' and  dept='"+USERDEPTID+"' and to_char(sbsj,'yyyy-mm')='"+comboFilter_y.getValue()+'-'+record.data.id+"'";
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
		//tbar : ['<font color=#15428b><B>费用计划表<B></font>','-',addBtn,editBtn,delBtn,sbBtn,'-','按上报时间查询:',comboFilter_y,comboFilter_m,'->',queryBtn,'合计费用:',textTotalMoney],
		tbar : ['<font color=#15428b><B>费用计划<B></font>','-',selectBtn,'->',queryBtn,'合计费用:',textTotalMoney],
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

	//bill_state:0新计划，-1审批中，1已审批
	ds.baseParams.params = " jhzt='5' and dept='"+USERDEPTID+"'";
	
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
    sm.on('rowselect',function(sm,rowIndex,record){
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
    })
	function selectHander(){
		var record = gridPanel.getSelectionModel().getSelected();
		if(record){
			window.returnValue=record.get('planmoney')+"||"+record.get('content')+"||"+record.get('uids')
			window.close()
		}else{
			Ext.MessageBox.alert("提示","请选择一条数据！")
		}
	}    
    

    
    var viewport = new Ext.Viewport({
        layout:'border',
       // items:[gridPanel]
        items:[gridPanel]
    });	
     
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };  
    
});