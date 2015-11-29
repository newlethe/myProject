/**
 * 设备提醒范围选择窗口
 * @author zhangh 2012-07-18
 */
 
﻿var beanUser = "com.sgepit.frame.sysman.hbm.RockUser"
var businessUser = "baseMgm"
var listMethodUser = "findWhereOrderby"
var primaryKeyUser = "userid"
var orderColumnUser = "realname"

﻿var beanGroup = "com.sgepit.pmis.equipment.hbm.EquGoodsUrgeGroup"
var businessGroup = "baseMgm"
var listMethodGroup = "findWhereOrderby"
var primaryKeyGroup = "uids"
var orderColumnGroup = "uids"

var selectUids;
var remindRangeWin;

Ext.onReady(function(){
	// TODO : ======提醒范围选择======
	//包含三个tab，选择部门，选择具体用户，选择用户组
	
	//按部门选择
	var treeRoot = new Ext.tree.AsyncTreeNode({
    	  text: CURRENTAPPNAME,
    	  id: CURRENTAPPID,
          expanded: true
    })
	var byUnit = new Ext.tree.TreePanel({
		id: 'byUnit',
		title : '按部门选择',
		tbar : ['-',{
			id : 'unit',
			text : '选择提醒范围',
			iconCls: 'save',
			handler : remindRangeFun
		}],
        animate : true,
        containerScroll : true,
        rootVisible : true,
        width : 220,
        region: 'west',
        split : true,
        autoScroll : true,
        collapseMode : 'mini',
        border : false,
        loader:new Ext.tree.TreeLoader({
			dataUrl: CONTEXT_PATH + "/servlet/SysServlet",
			requestMethod: "GET",
			baseParams:{
				parentId:CURRENTAPPID,
				ifcheck: true,
				ac:"buildingUnitTree",
				baseWhere:"unitTypeId is not null"
			}
		}),
        root:treeRoot,
        listeners:{
			beforeload:function(node){
				node.getOwnerTree().loader.baseParams.parentId = node.id; 
			}
		}
	});
		
		
	//按用户选择
	var selectUnitRoot = new Ext.tree.AsyncTreeNode({
    	  text: CURRENTAPPNAME,
    	  id: CURRENTAPPID,
          expanded: true
    })
	
//	var selectUnitPanel =  new Ext.tree.ColumnTree({
	var selectUnitPanel =  new Ext.tree.TreePanel({
		id: 'selectUnitPanel',
		tbar : ['-',{
			id : 'user',
			text : '选择提醒范围',
			iconCls: 'save',
			handler : remindRangeFun
		}],
        region: 'west',
        width : 220,
        minSize: 220,
        maxSize: 220,
//		split: true,			//设置可滑动
//		collapsible : true,		//滑动展开，左右展开
//		collapsed: false,		//滑动展开，设置默认为展开
//		collapseMode : 'mini',	//设置可滑动展开与关闭	
		autoScroll : true,
		lines : true,
		animate : false,
        rootVisible : true,
        border : false,
        frame: false,
        header: false,
        loader:new Ext.tree.TreeLoader({
			dataUrl: CONTEXT_PATH + "/servlet/SysServlet",
			requestMethod: "GET",
			baseParams:{
				parentId:CURRENTAPPID,
				ifcheck: true,
				ac:"buildingUnitTree",
				ifcheck : false,
				baseWhere:"unitTypeId is not null"
			},
			clearOnLoad: true,
			uiProviders:{
			    'col': Ext.tree.ColumnNodeUI
			}
		}),
        root:selectUnitRoot,
        columns:[{
            header: CURRENTAPPNAME,
            width: 220,
            dataIndex: 'unitid',
            renderer: function(value){
            	return "<div id='equno'>"+value+"</div>";  }
        },{
			header : '是否子节点',
			dataIndex: 'isleaf',
			width: 0,
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";  }
		},{
			header : '父节点',
			dataIndex: 'upunit',
			width: 0,
            renderer: function(value){
            	return "<div id='upunit'>"+value+"</div>";  }
		}],  
        listeners:{
			beforeload:function(node){
				node.getOwnerTree().loader.baseParams.parentId = node.id; 
			},
			click : function(node){
				if(node.id == CURRENTAPPID){
					dsUser.baseParams.params = "userstate = '1'";
				}else{
					dsUser.baseParams.params = "userstate = '1' and deptId = '"+node.id+"'";
				}
				dsUser.reload();
			}
		}
	});
	
	var smUser = new Ext.grid.CheckboxSelectionModel({
		singleSelect : false
	});
	var fcUser = {
		'userid' : {name : 'userid', fieldLabel : '主键'},
		'realname' : {name : 'realname', fieldLabel : '姓名'}
	}

	var cmUser = new Ext.grid.ColumnModel([ // 创建列模型
		smUser,
		new Ext.grid.RowNumberer({
			header : '序号',
			width : 35
		}),
		{
			id : 'userid',
			header : fcUser['userid'].fieldLabel,
			dataIndex : fcUser['userid'].name,
			hidden : true
		}, {
			id : 'realname',
			header : fcUser['realname'].fieldLabel,
			dataIndex : fcUser['realname'].name,
			width : 180
		}
	]);
	cmUser.defaultSortable = true;

	var ColumnsUser = [
		{name: 'userid', type: 'string'},
		{name: 'realname', type: 'string'}
	];

	var dsUser = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : beanUser,
			business : businessUser,
			method : listMethodUser,
			params : "userstate = '1'"
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKeyUser
		}, ColumnsUser),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	dsUser.setDefaultSort(orderColumnUser, 'asc');
	
	var userPanel = new Ext.grid.GridPanel({
		ds : dsUser,
		cm : cmUser,
		sm : smUser,
		tbar : ['-',{
			text : '加入分组',
			iconCls : 'add',
			handler : selectUser2Group
		}],
		header: false,
	    border: false,
	    region: 'center',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: true,
	        ignoreAdd: true
	    },
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsUser,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	dsUser.load({params:{start:0,limit:PAGE_SIZE}})
	
	var byUser = new Ext.Panel({
		id : 'byUser',
		title : '按用户选择',
		layout : 'border',
		items : [selectUnitPanel,userPanel]
	})
	
	//按分组选择
	var smGroup = new Ext.grid.CheckboxSelectionModel({
		singleSelect : false
	});
	var fcGroup = {
		'uids' : {name : 'uids', fieldLabel : '主键'},
		'pid' : {name : 'pid', fieldLabel : 'PID'},
		'jzDateId' : {name : 'jzDateId', fieldLabel : '催交主表ID'},
		'groupname' : {name : 'groupname', fieldLabel : '分组名称'}
	}

	var cmGroup = new Ext.grid.ColumnModel([ // 创建列模型
		smGroup,
		new Ext.grid.RowNumberer({
			header : '序号',
			width : 35
		}),
		{
			id : 'uids',
			header : fcGroup['uids'].fieldLabel,
			dataIndex : fcGroup['uids'].name,
			hidden : true
		}, {
			id : 'pid',
			header : fcGroup['pid'].fieldLabel,
			dataIndex : fcGroup['pid'].name,
			hidden : true
		}, {
			id : 'jzDateId',
			header : fcGroup['jzDateId'].fieldLabel,
			dataIndex : fcGroup['jzDateId'].name,
			hidden : true
		}, {
			id : 'groupname',
			header : fcGroup['groupname'].fieldLabel,
			dataIndex : fcGroup['groupname'].name,
			width : 180
		}
	]);
	cmGroup.defaultSortable = true;

	var ColumnsGroup = [
		{name: 'uids', type: 'string'},
		{name: 'pid', type: 'string'},
		{name: 'jzDateId', type: 'string'},
		{name: 'groupname', type: 'string'}
	];

	var dsGroup = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : beanGroup,
			business : businessGroup,
			method : listMethodGroup,
			params : "pid = '"+CURRENTAPPID+"'"
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKeyGroup
		}, ColumnsGroup),
		remoteSort : true,
		pruneModifiedRecords : true
	});
	dsGroup.setDefaultSort(orderColumnGroup, 'asc');
	
	var byGroup = new Ext.grid.GridPanel({
		id : 'byGroup',
		ds : dsGroup,
		cm : cmGroup,
		sm : smGroup,
		title : '按分组选择',
		tbar : ['-',{
			id : 'group',
			text : '选择提醒范围',
			iconCls: 'save',
			handler : remindRangeFun
		},'-',{
			text : '删除分组',
			iconCls : 'remove',
			handler : deleteGroupFun
		}],
		header: false,
	    border: false,
	    region: 'center',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: true,
	        ignoreAdd: true
	    },
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsGroup,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	dsGroup.load({params:{start:0,limit:PAGE_SIZE}});
	
	//设置提醒范围FUNCTION
	function remindRangeFun(){
		var type = this.id;
		var tempArr = new Array();
		if(type == "unit"){
			var nodes = byUnit.getChecked();
			if(nodes==null||nodes.length==0) return;
			for(var i = 0; i < nodes.length; i++){
				var node = nodes[i];
				if(node.id==null||node.id=="") continue;
				tempArr.push(node.id);
			}			
		}else if(type == "user"){
			var records = smUser.getSelections();
			if(records==null||records.length==0) return;
			for (var i = 0; i < records.length; i++) {
				var record = records[i];
				tempArr.push(record.get("userid"));
			}
		}else if(type == "group"){
			var records = smGroup.getSelections();
			if(records==null||records.length==0) return;
			for (var i = 0; i < records.length; i++) {
				var record = records[i];
				tempArr.push(record.get("uids"));
			}
		}
		var r = smJz.getSelected();
		DWREngine.setAsync(false);
		equMgm.setRemindRange(r.get("uids"),type,tempArr,CURRENTAPPID,function(str){
			if(str == "1"){
				Ext.example.msg('提示信息','提醒范围设置成功！');
				remindRangeWin.hide();
				dsJz.reload();
			}else{
				Ext.example.msg('提示信息','操作出错！');
			}
		});
		DWREngine.setAsync(true);
	}
	
	//设置分组FUNCTION
	function selectUser2Group(){
		var records = smUser.getSelections();
		if(records==null||records.length==0)return;
		var useridArr = new Array();
		for (var i = 0; i < records.length; i++) {
			useridArr.push(records[i].get("userid"));
		}
		var groupNameWin;
		var groupnameArr = new Array();
		var sql = "select uids,groupname from equ_goods_urge_group order by uids";
		DWREngine.setAsync(false);
		baseDao.getData(sql,function(list){
			for(i = 0; i < list.length; i++) {
				var temp = new Array();
				temp.push(list[i][0]);			
				temp.push(list[i][1]);		
				groupnameArr.push(temp);			
			}
		});
		DWREngine.setAsync(true);
		var groupnameDs = new Ext.data.SimpleStore({
	    	fields: ['k', 'v'],   
	        data: groupnameArr
	    });
		var groupNameForm = new  Ext.FormPanel({
			layout : 'form',
			width : 340,
			bodyStyle:'padding:10px;',
			labelWidth: 60,
			items : [
				{
					xtype : 'combo',
					name : "groupname",
					fieldLabel : '分组名称',
					valueField: 'k',
					displayField: 'v',
					mode: 'local',
		           	triggerAction: 'all', 
		           	store: groupnameDs,
		           	emptyText : '选择已有分组或手动输入创建新分组',
					width : 240
				}
			]
		});
		var saveGroupBtn = {
			text: '保存',   
			handler: function(){
				var groupname = groupNameForm.form.findField("groupname").getRawValue();
				var jdDateUids = smJz.getSelected().get("uids");
				if(groupname == null || groupname == "")return;
				DWREngine.setAsync(false);
				equMgm.saveGroup(groupname,CURRENTAPPID,jdDateUids,useridArr,function(str){
					if(str == "1"){
						Ext.example.msg('提示信息','分组保存成功！');
						groupNameWin.hide();
						tabPanel.setActiveTab(2);
						dsGroup.reload();
					}else if(str == "2"){
						Ext.example.msg('提示信息','该分组名称已经存在！');
					}else{
						Ext.example.msg('提示信息','操作出错！');
					}
				})
				DWREngine.setAsync(true);
			}
		};
		if(!groupNameWin){
			groupNameWin = new Ext.Window({
				width : 360,
				height : 90,
				modal: true, 
				plain: true, 
				border: false, 
				resizable: false,
				layout : 'fit',
				closeAction : 'hide',
				buttonAlign:'center',
				buttons : [saveGroupBtn],
				items : groupNameForm
			});
		}
		groupNameForm.getForm().reset();
		groupNameWin.show();
	}
	
	//删除分组FUNCTION
	function deleteGroupFun(){
		var records = smGroup.getSelections();
		var tempArr = new Array();
		if(records==null||records.length==0) return;
		for (var i = 0; i < records.length; i++) {
			var record = records[i];
			tempArr.push(record.get("uids"));
		}
		Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,text){
			if(btn == "yes"){
				DWREngine.setAsync(false);
				equMgm.deleteEquUrgeGroup(tempArr,function(str){
					if(str == "1"){
						Ext.example.msg('提示信息','设备催交分组删除成功！');
						dsGroup.reload();
					}else{
						Ext.example.msg('提示信息','操作出错！');
					}
				});
				DWREngine.setAsync(true);
			}
		});
	}
	
	var tabPanel = new Ext.TabPanel({
		activeItem : 0,
		items : [byUnit, byUser, byGroup],
		listeners : {
			tabchange : function(panel,newTab){
				if(selectUids && selectUids != smJz.getSelected().get("uids")){
					if(newTab.id == "byUser"){
						selectUnitRoot.reload();
						smUser.clearSelections();
						dsUser.reload();
					}
					if(newTab.id == "byGroup"){
						smGroup.clearSelections();
						dsGroup.reload();
					}
				}
			}
		}
	});
	
	remindRangeWin = new Ext.Window({
		width : 600,
		height : 400,
		modal: true, 
		plain: true, 
		border: false, 
		resizable: false,
		layout : 'fit',
		closeAction : 'hide',
		items : [tabPanel],
		listeners : {
			"show" : function(){
				tabPanel.setActiveTab(0);
				treeRoot.reload();
			},
			"hide" :function(){
				tabPanel.setActiveTab(1);
				selectUids = smJz.getSelected().get("uids");
			}
		} 
	});
});