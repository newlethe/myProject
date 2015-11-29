var bean = "com.sgepit.pmis.budget.hbm.GzJh"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'month'

var bean_fw = "com.sgepit.pmis.budget.hbm.GzJhZj"
var primaryKey_fw = 'uids'
var orderColumn_fw = 'puids'

var insertFlag = 0;
var PlantInt_fw, selectedData,ds_fw;
Ext.onReady(function(){
	//--用户userid:realname
	var userArray = new Array();
   	DWREngine.setAsync(false);
	baseMgm.getData("select userid,realname from rock_user ",function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			userArray.push(temp);
		}
	})
	DWREngine.setAsync(true);
 	var getuserSt = new Ext.data.SimpleStore({
 		fields:['userid','realname'],
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
 	
	//----------------------费用计划主表信息----------------------------//
	var fm = Ext.form;
	
	var fc = {
		'uids':{name:'uids',fieldLabel:'流水号',hidden:true,hideLabel:true,anchor:'95%'},
		'content':{name:'content',fieldLabel:'工作内容',allowBlank: false,anchor:'95%'},

		'month':{name:'month',fieldLabel:'上报日期',format: 'Y-m-d',anchor:'95%'},
		'shr':{name:'shr',fieldLabel:'审核人',anchor:'95%'},
		'gzhbr':{name:'gzhbr',fieldLabel:'汇报人',anchor:'95%'}

	}
	
	var Columns = [
		{name:'uids',type:'string'}, 	 {name:'content',type:'string'},		    
		{name:'month',type:'date',dateFormat:'Y-m-d H:i:s'},       
		{name:'shr',type:'string'},
		{name:'gzhbr',type:'string'}
	]	
	
	var Plant = Ext.data.Record.create(Columns);

	var PlantInt = {
		uids:'',  content:'', sbsj:'',    shr:'',  	gzhbr:''
	}

	var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true});

	var cm = new Ext.grid.ColumnModel([
		sm,
		{id:'uids'     ,	  header:fc['uids'].fieldLabel     ,  dataIndex:fc['uids'].name, hidden: true},
		{id:'content'       , 	  header:fc['content'].fieldLabel       ,  dataIndex:fc['content'].name},
		{id:'month'      , 	  header:fc['month'].fieldLabel     ,  dataIndex:fc['month'].name,renderer: formatDate},	
		{id:'gzhbr'      ,  	  header:fc['gzhbr'].fieldLabel      ,  dataIndex:fc['gzhbr'].name,
			renderer:function(value){
				for(var i = 0;i<userArray.length;i++){
					if(value == userArray[i][0]){
						return userArray[i][1]
					}
				}
			}
		},
		{id:'shr'      ,  	  header:fc['shr'].fieldLabel      ,  dataIndex:fc['shr'].name,
			renderer:function(value){
				for(var i = 0;i<userArray.length;i++){
					if(value == userArray[i][0]){
						return userArray[i][1]
					}
				}
			}
		}
	
		
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
		        	ds.baseParams.params = "gzhbr in (select userid from com.sgepit.frame.sysman.hbm.RockUser where unitid='"+USERUNITID+"') and to_char(month,'yyyy-mm')='"+record.data.k+'-'+comboFilter_m.getValue()+"'";
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
	            	ds.baseParams.params = "gzhbr in (select userid from com.sgepit.frame.sysman.hbm.RockUser where unitid='"+USERUNITID+"') and to_char(month,'yyyy-mm')='"+comboFilter_y.getValue()+'-'+record.data.id+"'";
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
		name:'dyzj',
		title:'当月工作总结',
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
		tbar : ['<font color=#15428b><B>当月工作总结<B></font>','-',addBtn,editBtn,delBtn,'-','按上报时间查询:',comboFilter_y,comboFilter_m,'->'],
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
	ds.baseParams.params = "gzhbr in (select userid from com.sgepit.frame.sysman.hbm.RockUser where unitid='"+USERUNITID+"')";
	
	ds.load({
		params : {
			start : 0,
			limit : 20
		}
	});/*
	   ds.on('load',function(){
		textTotalMoney.setValue(cnMoney(ds.sum('planmoney')))
    })*/
    function insertFun_plan(){
    	var url = BASE_PATH+"Business/budget/moneyMange/gz.month.plan.addorupdate.jsp";
		window.location.href = url;
    }
    function toEditHandler_plan(){
		var record = gridPanel.getSelectionModel().getSelected();
		var url = BASE_PATH+"Business/budget/moneyMange/gz.month.plan.addorupdate.jsp?uids="+record.get('uids');
		window.location.href = url;
    }
    //----------------------细表范围----------------------------//
 	var fm_fw = Ext.form;
   		
	var fc_fw = {
		'uids':{name:'uids',fieldLabel:'流水号',hidden:true,hideLabel:true,anchor:'95%'},
		'puids':{name:'puids',fieldLabel:'父编号',allowBlank: false,value:'',anchor:'95%'},
		'dyzj':{name:'dyzj',fieldLabel:'当月总结',allowBlank: false,anchor:'95%'},
		'xyjh':{name:'xyjh',fieldLabel:'下月计划',allowBlank: false,anchor:'95%'},
		'state1':{name:'state1',fieldLabel:'总结状态',hidden:true,hideLabel:true},
		'state2':{name:'state2',fieldLabel:'计划状态',hidden:true,hideLabel:true}
		}
	
	var Columns_fw = [
		{name:'uids',type:'string'},   {name:'puids',type:'string'},     {name:'dyzj',type:'string'},
		{name:'xyjh',type:'string'},{name:'state1',type:'float'},{name:'state2',type:'float'}
	]	
	
	var Plant_fw = Ext.data.Record.create(Columns_fw);
	PlantInt_fw = {
		uids:'', puids:'',   dyzj:'',    xyjh:'', state1:'0', state2:'0'
	}
	var sm_fw=  new Ext.grid.CheckboxSelectionModel({singleSelect:true});

	var cm_fw = new Ext.grid.ColumnModel([
		sm_fw,
		{   id:'uids',       header:fc_fw['uids'].fieldLabel,       dataIndex:fc_fw['uids'].name,     hidden: true},
		{	id:'puids',   	 header:fc_fw['puids'].fieldLabel,        dataIndex:fc_fw['puids'].name,      width:90 ,hidden: true},
		{	id:'dyzj',       header:fc_fw['dyzj'].fieldLabel,		dataIndex:fc_fw['dyzj'].name,editor:new Ext.form.TextField(), renderer:renderDyzj},
		{	id:'xyjh',   	 header:fc_fw['xyjh'].fieldLabel,      	dataIndex:fc_fw['xyjh'].name, editor:new Ext.form.TextField(), renderer: renderXyjh},
		{	id:'state1',	 header:fc_fw['state1'].fieldLabel,		dataIndex:fc_fw['state1'].name,			hidden:true},
		{	id:'state2',	 header:fc_fw['state2'].fieldLabel,		dataIndex:fc_fw['state2'].name,		hidden:true}
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
	
    var zjBtn = new Ext.Button({
		id : 'zjBtn',
		text : '总结标识',
		tooltip : '总结标识',
		iconCls : 'btn',
		handler :chgZjHandler
	});
	var jhBtn = new Ext.Button({
		id : 'jhBtn',
		text : '计划标识',
		tooltip : '计划标识',
		iconCls : 'btn',
		handler:chgJhHandler
	});
	var canBtn =new Ext.Button({
		id : 'canBtn',
		text :'取消标识',
		tooltip:'取消',
		iconCls :'btn',
		handler:canHandler
	});

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
		tbar : ['<font color=#15428b><B>工作汇报计划审核单<B></font>','-',zjBtn,jhBtn,canBtn],
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
	function chgZjHandler(){

		//gridPanel_fw.getSelectionModel().getSelected().set('state1','1')
	if(gridPanel_fw.getSelectionModel().getSelected()==null){//如果选择为空
    		Ext.Msg.show({
				title : '提示',
				msg : '请先选择要标识的总结！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}else{
    		gridPanel_fw.getSelectionModel().getSelected().set('state1','1')//将state1改为1，字体为红色
    	}
		
	}
    function chgJhHandler(){
    	if(gridPanel_fw.getSelectionModel().getSelected()==null){
    		Ext.Msg.show({
				title : '提示',
				msg : '请先选择要标识的总结！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}else{
    		gridPanel_fw.getSelectionModel().getSelected().set('state2','1')
    	}
 }
 	function canHandler(){
 		if(gridPanel_fw.getSelectionModel().getSelected()==null){
 			Ext.Msg.show({
 				title :'',
 				msg:'请选择要取消的标识',
 				buttons:Ext.MessageBox.INFO
 			});
 			return;
 		}else{
 			gridPanel_fw.getSelectionModel().getSelected().set('state1','0')
 			gridPanel_fw.getSelectionModel().getSelected().set('state2','0')
 		}
 	}
	function renderDyzj(value, metadata, record){
		if(record.get('state1')==1){
			var getUids = record.get('uids');
			var output = '<span style="color:red;" onmouseover="this.style.cursor = \'hand\';"'
			output += 'onmouseout="this.style.cursor = \'default\';"'
			output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
			output += 'window.location.href=\''+BASE_PATH
			output += 'Business/budget/gz.month.plan.addorupdate?uids='+getUids+'\'">'+ value+'</span>'
			return output;
			}
		else{
			var getUids = record.get('uids');
			var output = '<span style="color:black;" onmouseover="this.style.cursor = \'hand\';"'
			output += 'onmouseout="this.style.cursor = \'default\';"'
			output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
			output += 'window.location.href=\''+BASE_PATH
			output += 'Business/budget/gz.month.plan.addorupdate?uids='+getUids+'\'">'+ value+'</span>'
			return output;
		}	
			
	}
	function renderXyjh(value, metadata, record){
		if(record.get('state2')==1){
			var getUids = record.get('uids');
			var output = '<span style="color:red;" onmouseover="this.style.cursor = \'hand\';"'
			output += 'onmouseout="this.style.cursor = \'default\';"'
			output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
			output += 'window.location.href=\''+BASE_PATH
			output += 'Business/budget/gz.month.plan.addorupdate?uids='+getUids+'\'">'+ value+'</span>'
			return output;
			}
		else{
			var getUids = record.get('uids');
			var output = '<span style="color:black;" onmouseover="this.style.cursor = \'hand\';"'
			output += 'onmouseout="this.style.cursor = \'default\';"'
			output += 'onclick="Ext.get(\'loading\').show();Ext.get(\'loading-mask\').show();';
			output += 'window.location.href=\''+BASE_PATH
			output += 'Business/budget/gz.month.plan.addorupdate?uids='+getUids+'\'">'+ value+'</span>'
			return output;
		}	
			
}
	
	//----------------------------------关联----------------------------------
	
	sm.on('rowselect',function(sm,rowIndex,record){
		var bh_fw = record.get('uids');
		ds_fw.baseParams.params = " puids='"+bh_fw+"'";
		ds_fw.load({params:{start:0,limit:PAGE_SIZE}});
		selectedData = record.get('uids');
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
        items:[gridPanel,gridPanel_fw]
    });	
     
    function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };  
    
});