var primaryKey = 'uids';
var gridPanel;
var business;
var bean="com.sgepit.pmis.rlzj.hbm.HrSalaryType";
var business = "baseMgm"
var listMethod = "findwhereorderby";
var sendArr = [['1','是'],['0','否']];
var sm;
var code="BONUS";
Ext.onReady(function(){
	
	var sendStore = new Ext.data.SimpleStore({
	 	fields : ['k','v'],
	 	data : sendArr
	 })
	 
	var fm =Ext.form;
	
	var fc={
		'uids':{name:'uids',fieldLabel:'系统编号',hidden:true,hideLabel:true},
		'code':{name:'code',fieldLabel:'编码'},
		'name':{name:'name',fieldLabel:'名称'},
		'sendType':{name:'sendType',fieldLabel:'是否发放'},
		'state':{name:'state',fieldLabel:'是否有效',hidden:true,hideLabel:true}
	}
	
	var Columns = [
		{name:'uids',type:'string'}     ,  {name:'code',type:'string'},     {name:'name',type:'string'},
		{name:'sendType',type:'string'},{name:'state',type:'string'}
	]
	
	var Plant =Ext.data.Record.create(Columns);
	
	sm = new Ext.grid.CheckboxSelectionModel();
	
	var addBtn = new Ext.Button({
    	text:'新增',
    	iconCls : 'add',
    	handler : InsertHandler
    })
    
	var editBtn = new Ext.Button({
		id:'edit',
		text : '修改',
		iconCls : 'btn',
		handler : toHandlerUpdate
	})
	
	PlantInt = {
		uids:'',code:'',name:'',sendType:'',state:'1'
	}
	
	var cm =new Ext.grid.ColumnModel([
		sm,
		{id:'uids',        header:fc['uids'].fieldLabel,    	dataIndex:fc['uids'].name,   hidden:true},
		{id:'code',        header:fc['code'].fieldLabel,    	dataIndex:fc['code'].name},
		{id:'name',        header:fc['name'].fieldLabel,    	dataIndex:fc['name'].name },
		{id:'sendType',   header:fc['sendType'].fieldLabel,   	dataIndex:fc['sendType'].name, renderer:function(value){
			for(var k=0;k<sendArr.length;k++){
				if(value==sendArr[k][0]){
					return sendArr[k][1]
				}
			}
		}},
		{id:'state',       header:fc['state'].fieldLabel,		dataIndex:fc['state'].name,   hidden:true}
	])
	
	ds = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean,
			business:business,
			method: listMethod,
			params:"UIDS!='BONUS'"
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
	
	//ds.setDefaultSort(orderColumn, 'asc');
	
	gridPanel = new Ext.grid.EditorGridTbarPanel({
		ds : ds,
		cm : cm,
		sm : sm,
		region:'center',
		border : false,
		height: 300, 
		split:true,
		model: 'mini',
		clicksToEdit : 1,
		stripeRows:true,
		addBtn:false,
		//delBtn:false,
		saveBtn:false,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>工资类型维护<B></font>',addBtn,'-',editBtn],
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
		plant : Plant,
		plantInt : PlantInt,
		//insertHandler : InsertHandler,
		deleteHandler : delHandler,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
	});
	ds.load({params:{start:0,limit:PAGE_SIZE}});
	 var viewport = new Ext.Viewport({
        layout:'border',
        items:[gridPanel]
    });	
    
     function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };  
    
    function delHandler(){
	var record = gridPanel.getSelectionModel().getSelected();
	var salaryType = record.get('uids');
	if(record==""||record==null){
		Ext.MessageBox.alert("提示","请选择数据!");
	}
	else{
		rlzyXcglMgm.deleteVerify(salaryType,CURRENTAPPID,function(dat){
			if(dat==true){
				gridPanel.defaultDeleteHandler()
			}
			else{
				Ext.MessageBox.alert("提示","您选择的数据正在被使用，不能被删除!");
			}
		})
	}
 }
function toHandlerUpdate(){
	var record = gridPanel.getSelectionModel().getSelected();
	if(record==""||record==null){
		Ext.MessageBox.alert("提示","请选择数据");
	}
	else{
	var flag = true;
	var uids = record.get('uids');
	var code = record.get('code');
	var name = record.get('name');
	var send = record.get('sendType');
	var url =  BASE_PATH + "Business/rlzy/salary/rlzy.hr.salary.type.addorupdate.jsp?uids="+uids+"&code="+code+"&name="+name+"&sendType="+send+"&flag="+flag;
	window.location.href = url
	}
}

	
})
function InsertHandler(){
	var url = BASE_PATH + "Business/rlzy/salary/rlzy.hr.salary.type.addorupdate.jsp"
	window.location.href = url;
}



