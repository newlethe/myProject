var bean = "com.sgepit.pmis.wzgl.hbm.WzUser"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'userrole'

var bean_fw = "com.sgepit.pmis.wzgl.hbm.WzUserCkclb"
var primaryKey_fw = 'uids'
var orderColumn_fw = 'bm'

//zhangh 2010-10-21 物资部对应员工的部门编号DEPT_ID=05
var deptId = "05";

//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"

var insertFlag = 0;
var PlantInt_fw, selectedData,ds_fw,gridPanel_fw;
var SqlUser="select userid,realname from rock_user where userstate='1' and (UNITID = '"+CURRENTAPPID+"'";
Ext.onReady(function(){	    
	DWREngine.setAsync(false);
	baseMgm.getData(
			"select t3.unitid,t3.unitname from sgcc_ini_unit t3 where t3.upunit in (select t.unitid from sgcc_ini_unit t start with unitid = '"+CURRENTAPPID+"' connect by prior upunit = unitid) and t3.unit_type_id = '1'", function(list) {	
				if(list!=null){
					for (i = 0; i <list.length; i++) {	
			   	SqlUser+=" or UNITID = '"+list[i][0]+"'"; 		
				   }	
				}       
			});     
	DWREngine.setAsync(true);
	//--用户userid:realname  
	SqlUser+=")"; 
	var userArray = new Array();
   	DWREngine.setAsync(false);
	baseMgm.getData(SqlUser,function(list){
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
 	
	//--角色userrole:(propertycode-propertyname)
 	var roleArray = new Array();
 	DWREngine.setAsync(false);
 	appMgm.getCodeValue('wz_role',function(list){         //参数:type_name
		for(i = 0; i < list.length; i++) {
			var temp = new Array();		
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);
			roleArray.push(temp);
		}
    });
 	DWREngine.setAsync(true);
 	var getroleSt = new Ext.data.SimpleStore({
 		fields:['userrole','rolename'],
 		data:roleArray
 	}) 	
 
	//--物资编码bm:pm
	var wzArray = new Array();
   	DWREngine.setAsync(false);
	baseMgm.getData("select bm,pm from wz_ckclb where "+pidWhereString,function(list){
		for(var i = 0;i<list.length;i++){
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			wzArray.push(temp);
		}
	})
	DWREngine.setAsync(true);
	
	//----------------------人员角色信息----------------------------//
	var fm = Ext.form;
	
	var fc = {
		'uids':{
			name:'uids',
			fieldLabel:'流水号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		},
		'userrole':{
			name:'userrole',
			fieldLabel:'用户角色',
			valueField:'userrole',
			displayField:'rolename',
			mode:'local',
			store:getroleSt,
			triggerAction: 'all',
			allowBlank: false,
			anchor:'95%'
		},
		'userid':{
			name:'userid',
			fieldLabel:'物资部人员',
			valueField:'userid',
			displayField:'realname',
			mode:'local',
			triggerAction: 'all',
			store:getuserSt,
			allowBlank: false,
			anchor:'95%'
		},
		'pid':{
			name:'pid',
			fieldLabel:'PID',
			value:CURRENTAPPID,
			hidden:true
		}
	}
	
	var Columns = [
		{name:'uids',type:'string'},
		{name:'userrole',type:'string'},
		{name:'userid',type:'string'},
		{name:'pid',type:'string'}
	]	
	
	var Plant = Ext.data.Record.create(Columns);

	var PlantInt = {
		uids : '',
		userid : '',
		userrole : '',
		pid:CURRENTAPPID
	}
	var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true});

	var cm = new Ext.grid.ColumnModel([
		sm,
		{id:'uids'    ,  header:fc['uids'].fieldLabel    ,  dataIndex:fc['uids'].name, hidden: true},
		{id:'userrole',  header:fc['userrole'].fieldLabel,  dataIndex:fc['userrole'].name,  width:90,
			renderer:function(value){
				for(var i = 0;i<roleArray.length;i++){
					if(value == roleArray[i][0]){
						return roleArray[i][1]
					}
				}
			},
			editor:new Ext.form.ComboBox(fc['userrole'])},
		{id:'userid'  ,  header:fc['userid'].fieldLabel  ,  dataIndex:fc['userid'].name, width:90,
			renderer:function(value){
				for(var i = 0;i<userArray.length;i++){
					if(value == userArray[i][0]){
						return userArray[i][1]
					}
				}
			},
			editor:new Ext.form.ComboBox(fc['userid'])
		},
		{id:'pid',  header:fc['pid'].fieldLabel,   dataIndex:fc['pid'].name,  hidden:true}
	]);
	
	cm.defaultSortable = true;//可排序
	
	var ds = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean,
			business:business,
			method: listMethod,
			params: pidWhereString
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
	
	gridPanel = new Ext.grid.EditorGridTbarPanel({
		id : 'ff-grid-panel',
		ds : ds,
		cm : cm,
		sm : sm,
		border : false,
		region : 'center',
		clicksToEdit : 2,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>物资人员角色信息<B></font>','-'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		viewConfig : {
			forceFit : true,
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
		saveHandler: saveFunWzUser,
		deleteHandler:deleteWzUser,
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
	});
	
	ds.load({
		params : {
			start : 0,
			limit : PAGE_SIZE
		}
	});
	
 	gridPanel.on('cellclick',function(gridPanel,rowIndex,event){
		var record = gridPanel.getStore().getAt(rowIndex);
 		var role =record.get('userrole');
 		var userid =record.get('userid');
 		var confirmFlag = false;
 		DWREngine.setAsync(false);
 		baseMgm.getData("select uids from wz_user_ckclb where userid='"+userid+"' and userrole='"+role+"' and "+pidWhereString+" ",function(list){
			 if(list.length>0){confirmFlag=true}			
 		});
 		if(role==1){
	 		baseMgm.getData("select uids from wz_ckh_user where userid='"+userid+"' and userrole='1' and "+pidWhereString+" ",function(list){
				 if(list.length>0){confirmFlag=true}
	 		});
 		}
 		
		if(confirmFlag){//当物资范围和仓库管理员一项不为空则不能编辑
			cm.setEditable(1,false);
			cm.setEditable(2,false);
			cm.setEditable(3,false);
		}else{
			cm.setEditable(2,true);
			cm.setEditable(3,true);
		}
		DWREngine.setAsync(true);
	}) 	
    
	function saveFunWzUser(){
		var conf = false;
		var ds = this.getStore()
		var records = ds.getModifiedRecords();
		DWREngine.setAsync(false);
		for(var i = 0; i < records.length; i++){
			baseMgm.getData("select uids from wz_user where userid='"+records[i].get('userid')+"' and userrole='"+records[i].get('userrole')+"' and "+pidWhereString+" ",function(list){
				 if(list.length>0){
				 	conf=true
				 	ds.getAt(gridPanel.getStore().indexOf(records[i])).set('userid','');//设userid为空
				 }			
	 		});
		}
		if(conf){
			Ext.MessageBox.alert("提示","数据已经存在，请重新选取!")
		}else{
			gridPanel.defaultSaveHandler()
		}
		DWREngine.setAsync(true);
	}
	
	
	
	function deleteWzUser(){
		var record = gridPanel.getSelectionModel().getSelected();
		if(record){
			Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,
					text) {
				if (btn == "yes") {
					    DWREngine.setAsync(false);
						wzbaseinfoMgm.delWzUser(record.get('userid'),record.get('userrole'),function(flag){
							if(flag){
								Ext.example.msg('提示', '删除成功!');		
								ds.reload();
								ds_fw.reload();
							}else{
								Ext.example.msg('提示', '删除失败!');			
							}
						});
					    DWREngine.setAsync(true);
						
					}
			}, this);
		}
	}
    //----------------------物资范围----------------------------//
 	var fm_fw = Ext.form;
   		
	var fc_fw = {
		'uids':{
			name:'uids',
			fieldLabel:'流水号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		},
		'userid':{
			name:'userid',
			fieldLabel:'用户',
			allowBlank: false,
			value:'',
			anchor:'95%'
		},
		'userrole':{
			name:'userrole',
			fieldLabel:'角色',
			allowBlank: false,
			anchor:'95%'
		},
		'bm':{
			name:'bm',
			fieldLabel:'编码',
			anchor:'95%'
		},
		'pid':{
			name:'pid',
			fieldLabel:'PID',
			value:CURRENTAPPID,
			hidden:true
		}
	}
	
	var Columns_fw = [
		{name:'uids',type:'string'},
		{name:'bm',type:'string'},
		{name:'userid',type:'string'},
		{name:'userrole',type:'string'},
		{name:'pid',type:'string'}
	]	
	
	var Plant_fw = Ext.data.Record.create(Columns_fw);

	PlantInt_fw = {
		bm : '',
		userid : '',
		userrole : '',
		pid: CURRENTAPPID
	}
	var sm_fw=  new Ext.grid.CheckboxSelectionModel();

	var cm_fw = new Ext.grid.ColumnModel([
		sm_fw,
		{   id:'uids',  
			header:fc_fw['uids'].fieldLabel,  
			dataIndex:fc_fw['uids'].name,
			hidden: true
		},
		{	id:'bm',  
			header:"物资分类编码",  
			dataIndex:fc_fw['bm'].name,  
			width:90
		},
		{	id:'pm',  
			header:"物资分类名称",  
			dataIndex:fc_fw['bm'].name,
			width:90,
			renderer:function(value){
				for(var i = 0;i<wzArray.length;i++){
					if(value == wzArray[i][0]){
						return wzArray[i][1]
					}
				}
			}
		},
		{	id:'userid', 
			header:fc_fw['userid'].fieldLabel, 
			dataIndex:fc_fw['userid'].name, 
			hidden:true,
			width:0
			},
		{	id:'userrole',   
			header:fc_fw['userrole'].fieldLabel,   
			dataIndex:fc_fw['userrole'].name,  
			hidden:true,
			width:0},
		{id:'pid',  header:fc['pid'].fieldLabel,   dataIndex:fc['pid'].name,  hidden:true}
	]);
	
	cm_fw.defaultSortable = true;//可排序
	
    ds_fw = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean_fw,
			business:business,
			method: listMethod,
			params: pidWhereString
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
		border : true,
		region : 'east',
		width: 300, 
		split:true,
		model: 'mini',
		clicksToEdit : 2,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>物资范围<B></font>','-'],
		animCollapse : false, // 折叠时显示动画
		saveBtn:false,
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		insertHandler: insertFun,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds_fw,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		plant : Plant_fw,
		plantInt : PlantInt_fw,
		servletUrl : MAIN_SERVLET,
		bean : bean_fw,
		business : business,
		primaryKey : primaryKey_fw
	});
	
 
	
	//----------------------------------关联----------------------------------
	
	sm.on('rowselect',function(sm,rowIndex,record){
		var userid_fw = record.get('userid');
		ds_fw.baseParams.params = " userid='"+userid_fw+"' and userrole='"+record.get('userrole')+"' and "+pidWhereString+" ";
		ds_fw.load({params:{start:0,limit:PAGE_SIZE}});
		selectedData = record.get('userid');
		PlantInt_fw.userid = record.get('userid');
		PlantInt_fw.userrole = record.get('userrole');
	})

/*	gridPanel_fw.on('cellclick',function(gridPanel_fw,rowIndex,event){
		var record = gridPanel_fw.getStore().getAt(rowIndex);
		if(record.get('bm')==""){//如果bm为空，则进行选择
			//alert(gridPanel_fw.getColumnModel().getDataIndex(1)+"="+rowIndex+"==="+record.get('bm'))
		treePanel.root.reload()
		selectWin.show(true);
		}
	})*/
    
    function insertFun(){
    	if(selectedData==null){
    		Ext.Msg.show({
				title : '提示',
				msg : '请先选择左边面的人员角色信息！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}else{
    		treePanel.root.reload()
			selectWin.show(true);
    	}
    }	

    
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[gridPanel,gridPanel_fw]
    });	
    
});