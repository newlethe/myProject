var bean = "com.sgepit.pmis.wzgl.hbm.WzCkh"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = 'uids'
var orderColumn = 'ckh'

var bean_user = "com.sgepit.pmis.wzgl.hbm.WzCkhUser"
var primaryKey_user = 'uids'
var orderColumn_user = 'ckh'

//zhangh 2010-10-21 物资部对应员工的部门编号DEPT_ID=05
//var deptId = "05";
var deptId = USERDEPTID

//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"

var  selectedData;
Ext.onReady(function(){
	
	//----------------------仓库信息----------------------------//
	var fm = Ext.form;
	
	var fc = {
		'uids':{
			name:'uids',
			fieldLabel:'流水号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		},
		'ckh':{
			name:'ckh',
			fieldLabel:'仓库号',
			allowBlank: false,
			anchor:'95%'
		},
		'ckmc':{
			name:'ckmc',
			fieldLabel:'仓库名称',
			allowBlank: false,
			anchor:'95%'
		},
		'bz':{
			name:'bz',
			fieldLabel:'备注',
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
		{name:'ckh',type:'string'},
		{name:'ckmc',type:'string'},
		{name:'bz',type:'string'},
		{name:'pid',type:'string'}
	]	
	
	var Plant = Ext.data.Record.create(Columns);

	var PlantInt = {
		ckh : '',
		ckmc : '',
		bz : '',
		pid : CURRENTAPPID
	}
	var sm =  new Ext.grid.CheckboxSelectionModel({singleSelect:true});

	var cm = new Ext.grid.ColumnModel([
		sm,
		{id:'uids', header:fc['uids'].fieldLabel,  dataIndex:fc['uids'].name, hidden:true},
		{id:'ckh',  header:fc['ckh'].fieldLabel,   dataIndex:fc['ckh'].name,  width:90,editor:new fm.TextField(fc['ckh'])},
		{id:'ckmc', header:fc['ckmc'].fieldLabel,  dataIndex:fc['ckmc'].name, width:90,editor:new fm.TextField(fc['ckmc'])},
		{id:'bz',   header:fc['bz'].fieldLabel,    dataIndex:fc['bz'].name,   width:90,editor:new fm.TextField(fc['bz'])},
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
		tbar : ['<font color=#15428b><B>仓库信息<B></font>','-'],
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
		saveHandler:savewzModify,
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
	
	
    
	
	function savewzModify(){
		var conf = false;
		var ds = this.getStore()
		var records = ds.getModifiedRecords();
		DWREngine.setAsync(false);
		for(var i = 0; i < records.length; i++){
			baseMgm.getData("select ckh from wz_ckh where ckh='"+records[i].get('ckh')+"' and uids<>'"+records[i].get('uids')+"' and "+pidWhereString+"  ",function(list){
				 if(list.length>0){
				 	conf=true
				 	ds.getAt(gridPanel.getStore().indexOf(records[i])).set('ckh','');//设userid为空
				 }			
	 		});
		}
		if(conf){
			Ext.MessageBox.alert("提示","仓库号已经存在，请重新选取!")
		}else{
			gridPanel.defaultSaveHandler()
			setTimeout(loadckUser,0);
		}
		DWREngine.setAsync(true);
	}
	function loadckUser(){
		ds_user.baseParams.params = " "+pidWhereString+" and ckh='"+gridPanel.getSelectionModel().getSelected().get('ckh')+"'";
		ds_user.load({params:{start:0,limit:PAGE_SIZE}});
		}
    
    //----------------------仓库管理员----------------------------//
 	var fm_user = Ext.form;
 	//dept_id = '"+deptId+"' and
 	var SqlUser="select userid,realname from rock_user where userstate='1' and (UNITID = '"+CURRENTAPPID+"'";
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
	//alert(SqlUser);    
	SqlUser+=")"; 
 	var userArray = new Array();
   	DWREngine.setAsync(false);
   	//zhangh 2010-10-21 需要修改为只查询出物资部人员
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
 
   		
 	
	var fc_user = {
		'uids':{
			name:'uids',
			fieldLabel:'流水号',
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		},
		'ckh':{
			name:'ckh',
			fieldLabel:'仓库号',
			allowBlank: false,
			value:'',
			anchor:'95%'
		},
		'userid':{
			name:'userid',
			valueField:'userid',
			displayField:'realname',
			mode:'local',
			triggerAction: 'all',
			store:getuserSt,
			fieldLabel:'仓库保管员',
			//readOnly:true,
			allowBlank: false,
			anchor:'95%'
		},
		'userrole':{
			name:'userrole',
			fieldLabel:'角色',
			value:'保管员',
			anchor:'95%'
		},
		'pid':{
			name:'pid',
			fieldLabel:'PID',
			value:CURRENTAPPID,
			hidden:true
		}
	}
	
	var Columns_user = [
		{name:'uids',type:'string'},
		{name:'ckh',type:'string'},
		{name:'userid',type:'string'},
		{name:'userrole',type:'string'},
		{name:'pid',type:'string'}
	]	
	
	var Plant_user = Ext.data.Record.create(Columns_user);

	var PlantInt_user = {
		ckh : '',
		userid : '',
		userrole : '1',
		pid : CURRENTAPPID
	}
	var sm_user=  new Ext.grid.CheckboxSelectionModel();

	var cm_user = new Ext.grid.ColumnModel([
		sm_user,
		{   id:'uids',  
			header:fc_user['uids'].fieldLabel,  
			dataIndex:fc_user['uids'].name,
			hidden: true
		},
		{	id:'ckh',  
			header:fc_user['ckh'].fieldLabel,  
			dataIndex:fc_user['ckh'].name,  
			width:90
		},
		{	id:'userid', 
			header:fc_user['userid'].fieldLabel, 
			dataIndex:fc_user['userid'].name, 
			width:90,
			renderer:function(value){
				for(var i = 0;i<userArray.length;i++){
					if(value == userArray[i][0]){
						return userArray[i][1]
					}
				}
			},
			editor:new fm_user.ComboBox(fc_user['userid'])},
		{	id:'userrole',   
			header:fc_user['userrole'].fieldLabel,   
			dataIndex:fc_user['userrole'].name,  
			width:90,
			hidden:true
			},
		{	id:'pid',
			header:fc_user['pid'].fieldLabel,
			dataIndex:fc_user['pid'].name,
			hidden:true
			}
	]);
	
	cm_user.defaultSortable = true;//可排序
	
	var ds_user = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean_user,
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
            id: primaryKey_user
		},Columns_user),
		remoteSort: true,
        pruneModifiedRecords: true
	})
	ds_user.setDefaultSort(orderColumn_user, 'desc');
	
	gridPanel_user = new Ext.grid.EditorGridTbarPanel({
		ds : ds_user,
		cm : cm_user,
		sm : sm_user,
		border : false,
		region : 'east',
		width: 350, 
		split:true,
		model: 'mini',
		clicksToEdit : 2,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<font color=#15428b><B>仓库管理员<B></font>','-'],
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows: true,
		insertHandler: insertFun,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds_user,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		// expend properties
		plant : Plant_user,
		plantInt : PlantInt_user,
		servletUrl : MAIN_SERVLET,
		bean : bean_user,
		business : business,
		primaryKey : primaryKey_user
	});
	
 
	
	//----------------------------------关联----------------------------------
	
	sm.on('rowselect',function(sm,rowIndex,record){
		var ckh_user = record.get('ckh');
		ds_user.baseParams.params = " ckh='"+ckh_user+"' and "+pidWhereString+" ";
		ds_user.load({params:{start:0,limit:PAGE_SIZE}});
		selectedData = record.get('ckh');
		PlantInt_user.ckh=selectedData
	})

    function insertFun(){
    	if(selectedData==null){
    		Ext.Msg.show({
				title : '提示',
				msg : '请先选择上面的仓库信息！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
    	}else{
	    	gridPanel_user.defaultInsertHandler()
    	}
    }	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[gridPanel,gridPanel_user]
    });	
    
});