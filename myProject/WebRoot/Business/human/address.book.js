var treePanel, gridPanel;
var roleGridPanelTitle = "用户角色，请选择用户";
var SPLITB = "`";
var selectedUserId = "-1";
var selectUserPosId = "";
var selectedOrgId = defaultOrgRootId;
var COMPANY = defaultOrgRootName
var selectedOrgName = COMPANY;
var selectedUnitId = defaultOrgRootId;
var selectedUnitNode = null;
var roles = new Array();
//（0 禁用；1激活；2锁定）
var statusList = [['1', '激活'],['2', '锁定'],['0', '禁用']];
var searchTriggerField ;
var unitArr = new Array();
var userArr = new Array();
var userDS;

Ext.onReady(function (){
	Ext.QuickTips.init();
	DWREngine.setAsync(false);
	baseMgm.getData("select rolepk, rolename,unit_id from rock_role ",function(list){
		for(var i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			temp.push(list[i][2]);
			roles.push(temp);
		}
    });
    baseMgm.getData("select unitid, unitname from sgcc_ini_unit ",function(list){
		for(var i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			unitArr.push(temp);
		}
    });
    baseMgm.getData("select userid, realname from rock_user ",function(list){
		for(var i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			userArr.push(temp);
		}
    });
    DWREngine.setAsync(true);
    
	//组织结构树
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
        rootVisible: true,
        lines:false,
        autoScroll:true,
        collapsible: true,
        animCollapse:false,
        animate: false,
        collapseMode:'mini',
        tbar: [{
            iconCls: 'icon-expand-all',
			tooltip: '全部展开',
            handler: function(){ treePanel.root.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function(){ treePanel.root.collapse(true); }
        }],
        loader: new Ext.tree.TreeLoader({
			dataUrl: CONTEXT_PATH + "/servlet/SysServlet",
			requestMethod: "GET",
			baseParams:{
				parentId:defaultOrgRootId,
				ac:"buildingUnitTree"
			}
		}),
        root:  new Ext.tree.AsyncTreeNode({
	       text: MODULE_ROOT_NAME,
	       id: defaultOrgRootId,
	       expanded:true
	    }),
        collapseFirst:false,
        listeners:{
        	beforeload:function(node){
        		treePanel.loader.baseParams.parentId = node.id; 
        	},
        	click:function(node,e){
        		e.stopEvent();
        		
        		var unitTypeId = node.attributes.unitTypeId;
				var titles = [node.text];
				var obj = node.parentNode;
				while(obj!=null){
					titles.push(obj.text);
					obj = obj.parentNode;
				}
				var title = titles.reverse().join(" / ");
				gridPanel.setTitle(title);
				selectedOrgId = node.id
				selectedOrgName = node.text
				
				var selNode = node;
				selectedUnitNode = node;
				if(selNode){
					if(selNode.id==defaultOrgRootId||userBelongUnitType.indexOf(selNode.attributes.unitTypeId)>-1 || selNode.attributes.unitTypeId=="1"){
		    			selectedUnitId = selNode.id;
		    		}else{
			    		selNode.bubble(function(n){
			    			if(n.id==defaultOrgRootId||userBelongUnitType.indexOf(n.attributes.unitTypeId)>-1 || n.attributes.unitTypeId=="1"){
				    			selectedUnitId = n.id;
				    			selectedUnitNode = n;
				    			return false;
			    			}
			    		});
		    		}
			    }
				var selectedType = node.attributes.unitTypeId
				var paramStrCur = "posid" + SPLITB +node.id + SPLITA + "unitType"+SPLITB+selectedType;
				if (selectedOrgId==defaultOrgRootID)
				{
					paramStrCur ="";
				}
				//集团公司及集团总部用户,具有编辑权限的用户
				userDS.baseParams.business="systemMgm";
    			userDS.baseParams.method="findUserByOrg";
	    		userDS.baseParams.params = paramStrCur;
				userDS.load({params:{start: 0,limit: PAGE_SIZE}});	
				
				var tempSelectedUnitNode = selectedUnitNode;
				if(selectedUnitNode.attributes.unitTypeId=="1") {
					selectedUnitNode.bubble(function(n){
		    			if(n.id==defaultOrgRootId||n.attributes.unitTypeId=="A"||n.attributes.unitTypeId=="3"){
			    			tempSelectedUnitNode = n;
			    			return false;
		    			}
		    		});
				}
        	}
        }
	});

    var fc = {		// 创建编辑域配置
    	'userid': {
			name: 'userid',
			fieldLabel: '主键',
			hidden:true,
			hideLabel:true
        },  'useraccount': {
			name: 'useraccount',
			fieldLabel: '用户账号'
		}, 'userpassword': {
			name: 'userpassword',
			fieldLabel: '用户口令',
			hidden:true,
			hideLabel:true
		}, 'realname': {
			name: 'realname',
			fieldLabel: '用户姓名'
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
		}, 'userstate': {
			name: 'userstate',
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
		}, 'guidetype': {
			name: 'guidetype',
			fieldLabel: '上级领导',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: userArr
			}),
			listeners:{},
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
			allowBlank: false,
			anchor:'95%'
		}, 'email': {
			name: 'email',
			fieldLabel: 'Email',
			allowBlank: false,
			anchor:'95%'
		},'unitid': {
			name: 'unitid',
			fieldLabel: '所在公司',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
        }, 'deptId': {
			name: 'deptId',
			fieldLabel: '部门',
			anchor:'95%'
        }, 'posid': {
			name: 'posid',
			fieldLabel: '岗位',
			anchor:'95%'
        }
	};
	
    var Columns = [
    	{name: 'userid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'unitid', type: 'string'},
		{name: 'useraccount', type: 'string'},
		{name: 'userpassword', type: 'string'},    	
		{name: 'realname', type: 'string'},
    	{name: 'sex', type: 'string'},
    	{name: 'userstate', type: 'string'},
    	{name: 'guidetype', type: 'string'},
    	{name: 'lastlogon', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'createdon', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'phone', type: 'string'},
    	{name: 'mobile', type: 'string'},
		{name: 'email', type: 'string'},
		{name: 'deptId', type: 'string'},
		{name: 'posid', type: 'string'}
		];
    
    var userSM =  new Ext.grid.CheckboxSelectionModel();
    var userCM = new Ext.grid.ColumnModel([		// 创建列模型
    	userSM, {
           id:'userid',
           header: fc['userid'].fieldLabel,
           dataIndex: fc['userid'].name,
           hideable:false,
           hidden:true,
           width: 0
        },{
           id:'useraccount',
           header: fc['useraccount'].fieldLabel,
           dataIndex: fc['useraccount'].name,
           width: 100
        }, {
           id:'realname',
           header: fc['realname'].fieldLabel,
           dataIndex: fc['realname'].name,
           width: 100
        }, {
           id:'sex',
           header: fc['sex'].fieldLabel,
           dataIndex: fc['sex'].name,
           width: 50,
           align: 'center',
           renderer: function(value){
           	  if (value!="")
           	  	return value=='0' ? '男':'女';
           	  else
           	  	return value;
           }
        }, {
           id:'mobile',
           header: fc['mobile'].fieldLabel,
           dataIndex: fc['mobile'].name,
           width: 100
       }, {
           id:'email',
           header: fc['email'].fieldLabel,
           dataIndex: fc['email'].name,
           width: 160
       }, {
           id:'deptId',
           header: fc['deptId'].fieldLabel,
           dataIndex: fc['deptId'].name,
           renderer: showDeptOrPosNameFun,
           width: 100
       }, {
           id:'posid',
           header: fc['posid'].fieldLabel,
           dataIndex: fc['posid'].name,
           renderer: showDeptOrPosNameFun,
           width: 100
        }, {
           id:'userstate',
           header: fc['userstate'].fieldLabel,
           dataIndex: fc['userstate'].name,
           width: 60,
           align: 'center',
           renderer: function(value){
           	  for(var i=0; i<statusList.length; i++){
           	  	if (value == statusList[i][0])
           	  		return statusList[i][1]
           	  }
           },
           hideable:false,
           hidden:true
        }, {
           id:'guidetype',
           header: fc['guidetype'].fieldLabel,
           dataIndex: fc['guidetype'].name,
           width: 80,
           align: 'center',
           renderer: function(value){
           	  for(var i=0; i<userArr.length; i++){
           	  	if (value == userArr[i][0])
           	  		return userArr[i][1]
           	  }
           }
        }, {
           id:'lastlogon',
           align: 'center',
           header: fc['lastlogon'].fieldLabel,
           dataIndex: fc['lastlogon'].name,
           renderer:formatDateTime,
           width: 150
        }, {
           id:'createdon',
           align: 'center',
           header: fc['createdon'].fieldLabel,
           dataIndex: fc['createdon'].name,
           width: 150,
           renderer:formatDateTime
        }, {
           id:'phone',
           align: 'center',
           header: fc['phone'].fieldLabel,
           dataIndex: fc['phone'].name,
           hideable:false,
           hidden:true,
           width: 0
        },  {
        	id:'unitid',
           header: fc['unitid'].fieldLabel,
           dataIndex: fc['unitid'].name,
           renderer: showDeptOrPosNameFun,
           hideable:false,
           hidden:true,
           width: 0
         }
	]);
    userCM.defaultSortable = true;						//设置是否可排序

    userDS = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: "com.sgepit.frame.sysman.hbm.RockUser",				
	    	business: "systemMgm",
	    	method: "findUserByOrg"
		},
        // 设置代理（保持默认）
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        // 创建reader读取数据（保持默认）
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: "userid"
        }, Columns),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    userDS.setDefaultSort("realname", 'asc');	//设置默认排序列
    
  	searchTriggerField = new Ext.form.TriggerField({
    	triggerClass:'x-form-search-trigger',
    	enableKeyEvents: true,
    	onTriggerClick: searchUser,
     	listeners:{
     		specialkey : function(textField, e){
     			if(e.getKey()==e.ENTER){
					searchUser();
				}
     		},
     		render:function(texField){
 				new Ext.ToolTip({
 					target:texField.id,
 					trackMouse:false,
 					draggable:true,
 					maxWidth:300,
 					minWidth:150,
 					title:"提示",
 					html:"输入【账号/姓名/手机/email】，按回车查询"
 				});   
			}   
     	}
	});
	
	
	function searchUser(){
		var searchStr = searchTriggerField.getValue();
		var _ds = gridPanel.getStore();
		var searchCondition = "useraccount like '%"+searchStr+"%' or REALNAME like '%"+searchStr+"%' " +
				" or mobile like '%"+searchStr+"%' or email like '%"+searchStr+"%'";
		_ds.baseParams.params = searchCondition;
		_ds.baseParams.business = "baseMgm";
		_ds.baseParams.method   = "findWhereOrderby";
		_ds.load({params:{start:0,limit:PAGE_SIZE}});
	}
	
	
		
	gridPanel = new Ext.grid.GridPanel({
    	id: 'user-grid-panel',
        ds: userDS,
        cm: userCM,
        sm: userSM,
        tbar: [],
        border: false, 
        region: 'center',
        header: false,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
        loadMask: true,
		viewConfig:{
			forceFit: false,
			ignoreAdd: false
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: userDS,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});
	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[ treePanel, gridPanel],
        listeners:{
        	afterlayout:function(){
        	}
        }
    });	
    
	gridPanel.getTopToolbar().add('查询：', searchTriggerField);	
	treePanel.root.select();	
	userDS.baseParams.params = "posid" + SPLITB +defaultOrgRootId + SPLITA +"unitType"+SPLITB +"-1";
	userDS.load({params:{start:0,limit:PAGE_SIZE}});
	
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i:s') : value;
    };
	
	function reportUserData(){
		try{
			var params = gridPanel.store.baseParams.params;
			var arr = params.replace(/;/ , "`").split(SPLITB);
			var tempUserUnit = "";
			if(arr.length==4&&arr[0].toUpperCase()=="POSID"&&arr[1]!=""){
				tempUserUnit = arr[1]
			}
		}catch(e){}
	}
});

 
function showDeptOrPosNameFun(value, metadata, record) {
	var str = '';
	for (var i = 0; i < unitArr.length; i++) {
		if (unitArr[i][0] == value) {
			str = unitArr[i][1]
			break;
		}
	}
	if (value)
		metadata.attr = 'ext:qwidth=200 ext:qtip="' + str.bold() + '"';
	return str;
}