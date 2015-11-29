var treePanel, gridPanel;
var nodes = new Array();
var roleTypeSt;
var bean = "com.sgepit.frame.sysman.hbm.RockUser";
var roleBean = "com.sgepit.frame.flow.hbm.FlwRole";
var rolesBean = "com.sgepit.frame.flow.hbm.FlwRoles";
var business = "systemMgm";
var listMethod = "findUserByOrg";
var roleListMethod = "findByProperty";
var primaryKey = "userid";
var rolePrimaryKey = "id";
var orderColumn = "realname";
var gridPanelTitle = "用户列表，请选择部门";
var roleGridPanelTitle = "用户角色，请选择用户";
var paramName = "posid";//"orgid";
var paramValue = AppOrgRootId;
var SPLITB = "`";
var root;
var selectedUserId = "-1";
var selectedOrgId = AppOrgRootId;
var selectedOrgName = AppOrgRootName;
var statusList = [['active', '正常'],['freeze', '锁定'],['cancel', '注销']];
var Roles = new Array();
var roleTypeDs;

Ext.onReady(function (){
	DWREngine.setAsync(false);
	baseDao.findByWhere2(rolesBean, '', function(list) {
		for (var i=0; i<list.length; i++) {
			var temp = new Array();
			temp.push(list[i].id);
			temp.push(list[i].rolename);
			Roles.push(temp);
		}
	});
	
    DWREngine.setAsync(false);
    
    roleTypeDs = new Ext.data.SimpleStore({
		fields: ['roleid','rolename'],   
		data: Roles
	});
	
	var fm = Ext.form;			// 包名简写（缩写）
	root = new Ext.tree.TreeNode({
       text: "组织机构",
       id: AppOrgRootId,
       expanded:true
    });
	
	treePanel = new Ext.tree.TreePanel({
        id:'orgs-tree',
        region:'west',
        split:true,
        width: 196,
        minSize: 175,
        maxSize: 500,
        frame: false,
        layout: 'accordion',
        margins:'5 0 5 5',
        cmargins:'0 0 0 0',
        rootVisible: false,
        lines:false,
        autoScroll:true,
        collapsible: true,
        animCollapse:false,
        animate: false,
        collapseMode:'mini',
        tbar: [{
            iconCls: 'icon-expand-all',
			tooltip: '全部展开',
            handler: function(){ root.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function(){ root.collapse(true); }
        }],
        loader: new Ext.tree.TreeLoader({
			preloadChildren: true,
			clearOnLoad: false
		}),
        root: root,
        collapseFirst:false
	});
	
    treePanel.on('click', function(node, e){
		e.stopEvent();
		var titles = [node.text];
		var obj = node.parentNode;
		while(obj!=null){
			titles.push(obj.text);
			obj = obj.parentNode;
		}
		var title = titles.reverse().join(" / ");
		gridPanel.setTitle(title);
		ds.baseParams.params = paramName+SPLITB+node.id+";unitType"+SPLITB+"9";
		ds.load({
			params:{
			 	start: 0,
			 	limit: 1000
			}
		});
    });
    

    var fc = {
    	'userid': {
			name: 'userid',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
        }, 'username': {
			name: 'username',
			fieldLabel: '用户名',
			allowBlank: false,
			anchor:'95%'
		}, 'password': {
			name: 'password',
			fieldLabel: '用户口令',
			readOnly:true,
			allowBlank: false,
			//inputType: 'password',
			hidden:true,
			anchor:'95%'
		}, 'realname': {
			name: 'realname',
			fieldLabel: '用户姓名',
			anchor:'95%'
		}, 'sex': {
			name: 'sex',
			fieldLabel: '性别',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: [['0', '男'],['1', '女']]
			}),
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		}, 'status': {
			name: 'status',
			fieldLabel: '状态',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: statusList
			}),
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		}, 'lastlogon': {
			name: 'lastlogon',
			fieldLabel: '最后登录时间',
            format: 'Y-m-d H:i:s',
 			anchor:'95%'
        }, 'createdon': {
			name: 'createdon',
			fieldLabel: '创建时间',
            format: 'Y-m-d H:i:s',
 			anchor:'95%'
        }, 'phone': {
			name: 'phone',
			fieldLabel: '座机',
			anchor:'95%'
		}, 'mobile': {
			name: 'mobile',
			fieldLabel: '手机',
			anchor:'95%'
		}, 'im': {
			name: 'im',
			fieldLabel: '即时通讯IM',
			anchor:'95%'
		}, 'orgid': {
			name: 'orgid',
			fieldLabel: '组织结构ID',
			anchor:'95%'
		}
	};
	
    var Columns = [
    	{name: 'userid', type: 'string'},
		{name: 'username', type: 'string'},
		{name: 'password', type: 'string'},    	
		{name: 'realname', type: 'string'},
    	{name: 'sex', type: 'string'},
    	{name: 'status', type: 'string'},
    	{name: 'lastlogon', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'createdon', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'phone', type: 'string'},
    	{name: 'mobile', type: 'string'},
		{name: 'im', type: 'string'},
		{name: 'orgid', type: 'string'}
	];
		
    var sm =  new Ext.grid.CheckboxSelectionModel();
    var cm = new Ext.grid.ColumnModel([	
    	sm, {
           id:'userid',
           header: fc['userid'].fieldLabel,
           dataIndex: fc['userid'].name,
           hidden:true,
           width: 200
        }, {
           id:'username',
           header: fc['username'].fieldLabel,
           dataIndex: fc['username'].name,
           width: 120
        }, {
           id:'password',
           header: fc['password'].fieldLabel,
           dataIndex: fc['password'].name,
           width: 100,
           hidden:true
        }, {
           id:'realname',
           header: fc['realname'].fieldLabel,
           dataIndex: fc['realname'].name,
           width: 120
        }, {
           id:'sex',
           header: fc['sex'].fieldLabel,
           dataIndex: fc['sex'].name,
           width: 80,
           renderer: function(value){
	       	  if (value!="")
	       	  	return value=='0' ? "<img src='jsp/res/images/shared/icons/user_suit.gif'>" 
	       	  					: "<img src='jsp/res/images/shared/icons/user_female.gif'>";
	       	  else
	       	  	return value;
	       }
        }, {
           id:'status',
           header: fc['status'].fieldLabel,
           dataIndex: fc['status'].name,
           width: 80,
           renderer: function(value){
           	  for(var i=0; i<statusList.length; i++){
           	  	if (value == statusList[i][0])
           	  		return statusList[i][1]
           	  }
           }
        }, {
           id:'lastlogon',
           align: 'center',
           header: fc['lastlogon'].fieldLabel,
           dataIndex: fc['lastlogon'].name,
           hidden:true,
           renderer:formatDateTime,
           width: 120
        }, {
           id:'createdon',
           align: 'center',
           header: fc['createdon'].fieldLabel,
           dataIndex: fc['createdon'].name,
           hidden:true,
           renderer:formatDateTime,
           width: 120
        }, {
           id:'phone',
           align: 'center',
           header: fc['phone'].fieldLabel,
           dataIndex: fc['phone'].name,
           width: 60
        }, {
           id:'mobile',
           header: fc['mobile'].fieldLabel,
           dataIndex: fc['mobile'].name,
           width: 80
        }, {
           id:'im',
           header: fc['im'].fieldLabel,
           dataIndex: fc['im'].name,
           width: 80
        }, {
           id:'orgid',
           header: fc['orgid'].fieldLabel,
           dataIndex: fc['orgid'].name,
           hidden: true,
           width: 80
           
        }
	]);
    cm.defaultSortable = true;

    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
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
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true
    });
    ds.setDefaultSort(orderColumn, 'asc');
	
	gridPanel = new Ext.grid.GridPanel({
    	id: 'user-grid-panel',
        ds: ds,
        cm: cm,
        sm: sm,
        title: gridPanelTitle,
        iconCls: 'icon-by-category',
        border: false, 
        region: 'center',
        header: true,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
        autoExpandColumn: 1,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: 1000,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	sm.on('selectionchange', userSelected);


	/** 用户角色 **/
    var roleColumns = [
    	{name: 'id', type: 'string'},
    	{name: 'userid', type: 'string'},
		{name: 'rolename', type: 'string'}];
    var rolePlant = Ext.data.Record.create(roleColumns);
    var rolePlantInt = {
    	id: '',
    	userid: selectedUserId,
    	rolename: ''
    };
    var roleDs = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: roleBean,				
	    	business: "baseMgm",
	    	method: roleListMethod
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: rolePrimaryKey
        }, roleColumns),
        remoteSort: true,
        pruneModifiedRecords: true
    });
    roleDs.setDefaultSort(rolePrimaryKey, 'asc');
	
    var roleSm = new Ext.grid.CheckboxSelectionModel();
    var roleCm = new Ext.grid.ColumnModel([
    	roleSm, {
           id:'id',
           header: '主键',
           dataIndex: 'id',
           hidden:true,
           width: 200
        }, {
           id:'userid',
           header: '用户ID',
           dataIndex: 'userid',
           hidden:true,
           width: 200
        }, {
           id:'rolename',
           header: '角色名',
           dataIndex: 'rolename',
           width: 120,
           editor: new Ext.form.ComboBox({
				name: 'rolename',
		        store: roleTypeDs,
				valueField: 'roleid', 
		        displayField: 'rolename',
				mode: 'local',
            	typeAhead: true,
            	triggerAction: 'all',
            	lazyRender:true,
            	listClass: 'x-combo-list-small'
		   })
        }
    ]);
    roleCm.defaultSortable = true;
    
  	roleGridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'role-grid-panel',
        ds: roleDs,
        cm: roleCm,
        sm: roleSm,
        tbar: [],
        title: roleGridPanelTitle,
        iconCls: 'icon-by-category',
        border: false,
        height: 200,
        minSize: 180,
        layout: 'accordion',
        region: 'center',
        clicksToEdit: 1,
        header: true,
        autoScroll: true,
        split: true,
        collapsed: false,
        collapsible: false,
        animCollapse: false,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
        // expend properties
        plant: rolePlant,				
      	plantInt: rolePlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: roleBean,					
      	business: "baseMgm",	
      	primaryKey: rolePrimaryKey,		
      	insertHandler: insertRole,
      	crudText: {
      		add:'',
      		save:'',
      		del:'',
      		refresh:''
      	}
	});
	
	/** 用户角色类型 **/
    var rolesColumns = [
    	{name: 'id', type: 'string'},
		{name: 'rolename', type: 'string'}];
    var rolesPlant = Ext.data.Record.create(rolesColumns);
    var rolesPlantInt = {
    	id: '',
    	rolename: ''
    };
    var rolesDs = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: rolesBean,				
	    	business: "baseMgm",
	    	method: "findWhereOrderBy"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: rolePrimaryKey
        }, rolesColumns),
        remoteSort: true,
        pruneModifiedRecords: true
    });
    rolesDs.setDefaultSort(rolePrimaryKey, 'asc');
	
    var rolesSm = new Ext.grid.CheckboxSelectionModel();
    var rolesCm = new Ext.grid.ColumnModel([
    	rolesSm, {
           id:'id',
           header: '主键',
           dataIndex: 'id',
           hidden:true,
           width: 200
        }, {
           id:'rolename',
           header: '角色名',
           dataIndex: 'rolename',
           width: 120,
           editor: new Ext.form.TextField({
           		name: 'rolename'
           })
        }
    ]);
    rolesCm.defaultSortable = true;
    
  	var rolesGridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'roles-grid-panel',
        ds: rolesDs,
        cm: rolesCm,
        sm: rolesSm,
        tbar: [],
        title: '设置角色类型',
        iconCls: 'icon-by-category',
        border: false,
        height: 320,
        minSize: 180,
        layout: 'accordion',
        region: 'south',
        clicksToEdit: 1,
        header: true,
        autoScroll: true,
        split: true,
        collapsed: false,
        collapsible: false,
        animCollapse: false,
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: rolesDs,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: rolesPlant,				
      	plantInt: rolesPlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: rolesBean,					
      	business: "baseMgm",	
      	primaryKey: rolePrimaryKey,		
      	crudText: {
      		add:'',
      		save:'',
      		del:'',
      		refresh:''
      	}
	});
	
	var contentPanel = new Ext.Panel({
        id:'main-panel',
        region: 'east',
        border: false,
        split: true,
        layout:'border',
        width: 220,
        minSize: 180,
        collapsible: true,
        animCollapse:false,
        animate: false,
        collapseMode:'mini',
        items:[roleGridPanel, rolesGridPanel]
    });
	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[ treePanel, gridPanel, contentPanel ]
    });	


	buildOrgTree();
	
	initOthers();
    
    function initOthers(){
		var companyNode = root.findChild("text", AppOrgRootName);
		companyNode.select();
		companyNode.expand();
		ds.baseParams.params = paramName+SPLITB+companyNode.id+";unitType"+SPLITB+"9";
	    ds.load({
	    	params:{
		    	start: 0,
		    	limit: 1000
	    	}
	    });
	    rolesDs.load({
	    	params:{
		    	start: 0,
		    	limit: PAGE_SIZE
	    	}
	    });
    }
    
    function userSelected(){
    	var record = sm.getSelected();
    	if (record){
    		selectedUserId = record.get('userid');
    		var usertitle = record.get("realname")=="" ? record.get("username"):record.get("realname");
    		rolePlantInt.userid = selectedUserId;
    		roleGridPanel.setTitle(usertitle + "，角色");
    		roleDs.baseParams.params = "userid"+SPLITB+selectedUserId;
	    	roleDs.load();	
    	}
    }
    
    function insertRole(){
    	if (selectedUserId != "-1"){
    		roleGridPanel.defaultInsertHandler();
    	}
    }
    
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i:s') : value;
    };
});

function buildOrgTree(){
	for(var i=0; i<treedata.length; i++) { // 遍历生成节点
	 	var flag = treedata[i][2]=='1' ? true : false;
	 	var first = treedata[i][4]=='1' ? true : false;
	 	var node = new Ext.tree.TreeNode({
	 		id: treedata[i][0],
	 		text: treedata[i][1],
			leaf: flag,
			cls: flag ? "cls" : "package",
			iconCls: flag ? "icon-cmp" : "icon-pkg",
			parentId: treedata[i][3]
	 	});
	
		nodes.push(node);
		
		if (first){
			root.appendChild(node);
		} else{
			append(node);
		}
	}
}

function append(node) { // 递归调用
	if (nodes.length > 1) {
		var temp = nodes[nodes.length - 2];
		if (node.attributes.parentId == temp.id){
			temp.appendChild(node);
		} else if (node.attributes.parentId == temp.attributes.parentId &&
				temp.parentNode!=null)
		{
			temp.parentNode.appendChild(node);
			if (node.leaf) {
				nodes.pop();
			}
		} else {
			var tt = temp;
			nodes[nodes.length - 2] = node;
			nodes[nodes.length - 1] = tt;
			nodes.pop();
			append(node);
		}
	}    
}
