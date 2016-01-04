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
var defaultPwd = MD5("123456");
var defaultStatus = "1";
var cutUserBtn, pasteUserBtn,setPasswordBtn ,loadSignBtn, sycUserBtn, searchTriggerField ;
var orgIdWhenCopied, usersToMove, moveAction;
var uploadWindow;
var unitArr = new Array();
var userArr = new Array();
var userDS;
var toolBarEnable = false;
var signAndPasswartEnable = true;
var newTime;
//HR同步过滤条件
var hrUserOnly = false;

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
    UserSync.getNewTime(function (r){
     newTime=r;
    })
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
        		console.log(node)
        		if(unitTypeId != '9'){
        			//9为岗位，岗位上才能新增用户
        			gridPanel.getTopToolbar().items.get('add').disable();
        		}else{
        			gridPanel.getTopToolbar().items.get('add').enable();
        		}
        		
				PlantInt.posid = node.id;
				PlantInt.deptId = node.attributes.upunit;
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
				
				//在项目单位系统中，只能修改三级单位及项目单位及下面本部单位的用户信息；
//				gridPanel.getTopToolbar().enable();
//			    roleGridPanel.showHideTopToolbarItems("del",true);
//			    roleGridPanel.showHideTopToolbarItems("add",true);
//				roleGridPanel.showHideTopToolbarItems("save",true);						
				toolBarEnable = true;
				var tempSelectedUnitNode = selectedUnitNode;
				if(selectedUnitNode.attributes.unitTypeId=="1") {
					selectedUnitNode.bubble(function(n){
		    			if(n.id==defaultOrgRootId||n.attributes.unitTypeId=="A"||n.attributes.unitTypeId=="3"){
			    			tempSelectedUnitNode = n;
			    			return false;
		    			}
		    		});
				}
				if(DEPLOY_UNITTYPE=="A") {
					if (tempSelectedUnitNode.attributes.unitTypeId=="A"||tempSelectedUnitNode.attributes.unitTypeId=="3") {
//						gridPanel.getTopToolbar().enable();
//					    roleGridPanel.showHideTopToolbarItems("del",true);
//					    roleGridPanel.showHideTopToolbarItems("add",true);
//						roleGridPanel.showHideTopToolbarItems("save",true);						
//						toolBarEnable = true;
					} else {
//					    roleGridPanel.showHideTopToolbarItems("del",false);
//					    roleGridPanel.showHideTopToolbarItems("add",false);
//						roleGridPanel.showHideTopToolbarItems("save",false);
//						gridPanel.getTopToolbar().disable();
//						searchTriggerField.enable();
//						toolBarEnable = false;
					}
				} else {
					//如果是集团系统，不能修改三级单位、项目单位及下级单位用户的密码及上传签名等；
					if (tempSelectedUnitNode.attributes.unitTypeId=="A"||tempSelectedUnitNode.attributes.unitTypeId=="3") {
						signAndPasswartEnable = false;
					} else {
						signAndPasswartEnable = true;
					}
				}
        	}
        }
	});

    var fc = {		// 创建编辑域配置
    	'userid': {
			name: 'userid',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
        },  'useraccount': {
			name: 'useraccount',
			fieldLabel: '用户名',
			allowBlank: false,
			anchor:'95%'
		}, 'userpassword': {
			name: 'userpassword',
			fieldLabel: '用户口令',
			readOnly:true,
			allowBlank: false,
			//inputType: 'userpassword',
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
			listeners:{
				'beforequery':function(obj){	
					var _this = obj.combo;
					var _thisStore = _this.store;
					var record = userSM.getSelected();
			    	if(!record) {
			    		return false;
			    	}
			    	if(record.data.uids == ''){
			    		Ext.Msg.alert('提示', '请先保存用户信息！');
			    		return false;
			    	}
			    	var upUserArr = new Array();
			    	var _thisDeptId = record.data.deptId;
			    	var _thisPosid = record.data.posid;
			    	
			    	DWREngine.setAsync(false);
			    	var sql = "select userid, realname from rock_user where dept_id = '"+_thisDeptId+"' " +
			    			" AND posid in (SELECT t.unitid FROM sgcc_ini_unit t WHERE t.upunit = '"+_thisDeptId+"' " +
	    					" AND t.unit_type_id = '9' " +
	    					" AND t.view_order_num = (SELECT s.view_order_num-1 FROM sgcc_ini_unit s WHERE s.unitid = '"+_thisPosid+"'))";
		    		baseMgm.getData(sql,function(list){
						for(var i = 0; i < list.length; i++) {
							var temp = new Array();
							temp.push(list[i][0]);
							temp.push(list[i][1]);
							upUserArr.push(temp);
						}
				    });
					_thisStore.loadData(upUserArr);
					DWREngine.setAsync(true);
			    	return true;
		        }
			},
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
        }, 'receiveSMS': {
			name: 'receiveSMS',
			fieldLabel: '是否接收系统短信',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            //allowBlank: false,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: [['0', '否'],['1', '是']]
			}),
            lazyRender:true,
            listClass: 'x-combo-list-small',
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
		{name: 'posid', type: 'string'},
		{name: 'receiveSMS', type: 'string'}
		];
		
    var Plant = Ext.data.Record.create(Columns);			//定义记录集
    var PlantInt = {
    	userid: '',
    	useraccount: '', 
    	userpassword: defaultPwd,
    	realname: '',
    	sex: '0',
    	userstate: defaultStatus,
    	guidetype: '',
    	phone: '',
    	mobile: '',
    	email: '',
    	unitid:selectedUnitId,
    	deptId: '',
    	posid: selectedOrgId
    };
    
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
           width: 100,
           editor: new Ext.form.TextField(fc['useraccount'])
        }, {
           id:'realname',
           header: fc['realname'].fieldLabel,
           dataIndex: fc['realname'].name,
           width: 100,
           editor: new Ext.form.TextField(fc['realname'])
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
           },
           editor: new Ext.form.ComboBox(fc['sex'])
        }, {
           id:'mobile',
           header: fc['mobile'].fieldLabel,
           dataIndex: fc['mobile'].name,
           width: 100,
           editor: new Ext.form.TextField(fc['mobile'])
       }, {
           id:'email',
           header: fc['email'].fieldLabel,
           dataIndex: fc['email'].name,
           width: 160,
           editor: new Ext.form.TextField(fc['email'])
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
           hidden:true,
           editor: new Ext.form.ComboBox(fc['userstate'])
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
           },
           editor: new Ext.form.ComboBox(fc['guidetype'])
        }, {
           id:'lastlogon',
           align: 'center',
           header: fc['lastlogon'].fieldLabel,
           dataIndex: fc['lastlogon'].name,
           //hidden:true,
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
           width: 0,
           editor: new Ext.form.TextField(fc['phone'])
       
        },  {
        	id:'unitid',
           header: fc['unitid'].fieldLabel,
           dataIndex: fc['unitid'].name,
           renderer: showDeptOrPosNameFun,
           hideable:false,
           hidden:true,
           width: 0
        
         }, {
           id:'receiveSMS',
           header: fc['receiveSMS'].fieldLabel,
           dataIndex: fc['receiveSMS'].name,
           hideable:false,
           hidden:true,
           width: 0,
           renderer: function(value){
           	  if (value!="")
           	  	return value=='0' ? '否':'是';
           	  else
           	  	return value;
           },
           editor: new Ext.form.ComboBox(fc['receiveSMS'])
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
    	triggerClass:'x-form-clear-trigger',
    	onTriggerClick:function(){
    		this.setValue("");
    		searchUser();
    	},
//    	loadData:function(){
//    		var _ds = gridPanel.getStore();
//			_ds.baseParams.params = "useraccount like'%"+this.getValue()+"%'" +
//									" or REALNAME like '%"+this.getValue()+"%'";
//			_ds.baseParams.business = "baseMgm";
//			_ds.baseParams.method   = "findWhereOrderby";
//			_ds.load({params:{start:0,limit:PAGE_SIZE}});
//    	},
     	listeners:{
     		specialkey : function(textField, event ){
     			if(event.getKey()==13){
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
 					html:"输入【账号或用户名】关键字，按回车查询"
 				});   
			}   
     	}
	});
	
	//过滤显示HR同步的用户
	var hrViewCombo = new Ext.form.ComboBox({
	name: 'hrview-combo',
	width : 80,
	editable : false,
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
				fields: ['k','v'],   
				data: 	[['0', '所有用户'], ['1', 'HR同步用户']]
			}),
			value : '0',
            lazyRender:true,
            listClass: 'x-combo-list-small',
            listeners:{
            	select : function(  ){
            		searchUser();
            	}
            }
	});
	
	function searchUser(){
		var searchStr = searchTriggerField.getValue();
		var hrFilter = hrViewCombo.getValue() == '1';
		
		var _ds = gridPanel.getStore();
			var searchCondition = "useraccount like'%"+searchStr+"%'" +
									" or REALNAME like '%"+searchStr+"%'";
			if ( hrFilter ){
				searchCondition = '(' + searchCondition + ') and email is not null';
			}
			_ds.baseParams.params = searchCondition;
			_ds.baseParams.business = "baseMgm";
			_ds.baseParams.method   = "findWhereOrderby";
			_ds.load({params:{start:0,limit:PAGE_SIZE}});
	}
	
//  	sycUserBtn = new Ext.Button({
//		text: '从HR系统同步用户信息',
//		tooltip: '从HR系统同步用户信息',
//		iconCls: 'btn',
//		handler: sycUser,
//		disabled: false
//	});
	
	startHRNum  = new Ext.form.NumberField({
	    id : 'startHRNum',
	    name :'startHRNum',
	    width :50,
	    minValue : 0
	})
	endHRNum  = new Ext.form.NumberField({
	    id : 'endHRNum',
	    name : "endHRNum",
	    width :50,
	    minValue : 0
	})
    getCountUserBtn = new Ext.Button({
        text :'获取总数',
        tooltip : '从HR获取用户总数',
        iconCls :'btn',
        handler :getCountHRUser
        
    })
    SysHRUserBtn = new Ext.Button({
        text :'同步所有用户',
        tooltip : '同步HR用户',
        iconCls :'btn',
        handler : sysHRUserInfo
    })
    newPersonInfoBtn = new Ext.Button({
        text : '同步增量用户',
        tooltip :'获取上次同步更新以来HR系统新增和修改的用户信息',
        iconCls : 'btn',
        handler : sysHRnewUserConfirm
    }) 
     
    loadSignBtn = new Ext.Button({
    	text: '上传签名',
    	tooltip: '上传用户手写的签名图片',
    	iconCls: 'upload',
    	handler: loadSign,
    	disabled: true
    });
	cutUserBtn = new Ext.Button({
		text: '剪切',
		tooltip: '剪切用户，表示将用户调整到其他部门',
		iconCls: 'cutUser',
		handler: cutUser,
		disabled: true
	});
	
	pasteUserBtn = new Ext.Button({
		text: '粘贴',
		tooltip: '粘贴用户，只能移动到其他部门',
		iconCls: 'pasteUser',
		handler: pasteUser,
		disabled: true
	});
	
	setPasswordBtn = new Ext.Button({
		text: '重置密码',
		tooltip: '将用户密码重置为默认值123456',
		iconCls: 'setPassword',
		handler: setPassword,
		disabled: false
	});
	timeField = new Ext.form.TextField({
	    id : 'timefield',
	    name : 'timefield',
	    fieldLabel :'最近同步时间',
	    readOnly : true,
	    width : 120
	})
	var addToolbar = new Ext.Toolbar({
		items : ['<b>HR系统用户同步</b>  起始条数',startHRNum,'-','终止条数',endHRNum,'-',SysHRUserBtn,'-',getCountUserBtn,'-',newPersonInfoBtn,'-','最近同步更新时间:',timeField]
	})
	
	if(ModuleLVL=='3'){
		cutUserBtn.setVisible(false);
		//loadSignBtn.setVisible(false);
		pasteUserBtn.setVisible(false);
		setPasswordBtn.setVisible(false);
	}
		
	gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'user-grid-panel',
        ds: userDS,
        cm: userCM,
        sm: userSM,
        tbar: [],
        title: "用户列表，请选择部门",
        border: false, 
        region: 'center',
        clicksToEdit: 1,
        header: true,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
//        autoExpandColumn: 1,
        loadMask: true,
		viewConfig:{
			forceFit: false,
			ignoreAdd: false
		},
		bbar: new Ext.PagingToolbar({
            pageSize: 20,
            store: userDS,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: "com.sgepit.frame.sysman.hbm.RockUser",					
      	business: "systemMgm",	
      	primaryKey: "userid",		
      	deleteHandler: deleteFun,
		insertMethod: 'insertUser',
		saveMethod: 'updateUser',
		deleteMethod: 'deleteUser',
//		getOrgTree:function(){
//      		return Ext.getCmp("orgs-tree");
//      	},
//      	getSelectNode:function(){
//      		var _tree = this.getOrgTree();
//      		if(_tree){
//      			return _tree.getSelectionModel().getSelectedNode();
//      		}else{
//      			return null;
//      		}
//      	},
//      	insertHandler: function(){
//      		var _grid = this;
//			var selNode = this.getSelectNode();
//			//用户的UnitId 存在的组织机构类型： 集团公司0、二级企业2、三级企业3、四级单位4、直属单位6、外部单位7、项目单位A
//			if(selNode){
//				_grid.plantInt = Ext.apply(_grid.plantInt,{unitid:selectedUnitId});
//	    		
//				if(USERBELONGUNITTYPEID=="0"||USERBELONGUNITTYPEID=="1"){//集团公司及集团总部用户
//					this.defaultInsertHandler();
//				}else if(selNode.attributes.modifyauth){
//					this.defaultInsertHandler();
//				}else{
//					Ext.example.msg('提示','权限不足,只能对本公司下的单位进行维护!');
//				}
//			}else{
//	    		Ext.example.msg('','请先选择组织机构!')
//			}
//      	},
      	listeners:{
      		afteredit:function(o){
      			if(o.record.isNew===true&&o.field=="useraccount"&&o.value!=""){
      				baseMgm.getData("select useraccount from rock_user " +
      						"where useraccount='"+o.value+"'",function(lt){
	      					if(lt.length>0){
	      						Ext.example.msg("提示","用户名“"+o.value+"”已存在！");
	      						o.record.set("useraccount","");
	      					}
	      			})
      			}
      		},
      		"render" : function (){
      			//if(DEPLOY_UNITTYPE == "0"){
      				//addToolbar.render(this.tbar);
      			//}
		    },
      		aftersave:function(grid, idsOfInsert, idsOfUpdate, primaryKey,  bean){
				//reportUserData()
			},
			afterdelete:function(grid,ids,  primaryKey,  bean){
				//reportUserData()
			}
      	}
	});
	userSM.on('selectionchange', orgGridRowSelected);
	
    var roleCols = [
    	{name: 'rolepk', type: 'string'},
    	{name: 'rolename', type: 'string'}];

	/** 用户角色 **/
    var roleColumns = [
    	{name: 'uids', type: 'string'},
    	{name: 'unitid', type: 'string'},
		{name: 'userid', type: 'string'},
		{name: 'rolepk', type: 'string'}];
    var rolePlant = Ext.data.Record.create(roleColumns);
    var rolePlantInt = {
    	uids: '',
    	unitid: UNITID,
    	userid: selectedUserId,
    	rolepk: ''
    };
    var roleDs = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: "com.sgepit.frame.sysman.hbm.RockRole2user",				
	    	business: "baseMgm",
	    	method: "findByProperty"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: "uids"
        }, roleColumns),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    roleDs.setDefaultSort("uids", 'asc');	//设置默认排序列
    
    var roleSelStore =  new Ext.data.Store({
		autoLoad: true,
		baseParams: {
	    	ac: 'list',
	    	bean: "com.sgepit.frame.sysman.hbm.RockRole",				
	    	business: "baseMgm",
	    	method: "findBySql",
	    	params: ""
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: "rolepk"
        }, roleCols),    
         		remoteSort: true
    });
	
    var roleSm =  new Ext.grid.CheckboxSelectionModel();
    var roleCm = new Ext.grid.ColumnModel([		// 创建列模型
    	roleSm, {
           id:'uids',
           header: '主键',
           dataIndex: 'uids',
           hidden:true,
           hideable:false,
           width: 0
        }, {
           id:'unitid',
           header: '单位',
           dataIndex: 'unitid',
           hidden:true,
           hideable:false,
           width: 0
        },{
           id:'userid',
           header: '用户ID',
           dataIndex: 'userid',
           hidden:true,
           hideable:false,
           width: 0
        }, {
           id:'rolepk',
           header: '角色',
           dataIndex: 'rolepk',
           width: 120,
           renderer: function(value){
           		for(var i=0; i<roles.length; i++){
           			if (roles[i][0] == value) {
           				return roles[i][1];
           			}
           		}
           },
           editor: new Ext.form.ComboBox({
				name: 'rolepk',
		        store: roleSelStore,
				valueField: 'rolepk', 
		        displayField: 'rolename',
				mode: 'local',
            	typeAhead: true,
            	triggerAction: 'all',
            	lazyRender:true,
            	listClass: 'x-combo-list-small'
		   })
        }
    ]);
    roleCm.defaultSortable = true;						//设置是否可排序
    
    
  	roleGridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'role-grid-panel',
        ds: roleDs,
        cm: roleCm,
        sm: roleSm,
        tbar: [],
        title: roleGridPanelTitle,
        iconCls: 'icon-by-category',
        border: false,
        //height: 240,
        minSize: 180,
        region: 'center',
        layout: 'accordion',
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
      	bean: "com.sgepit.frame.sysman.hbm.RockRole2user",					
      	business: "systemMgm",	
      	primaryKey: "uids",		
      	insertHandler: insertUserRole,
      	//saveHandler: saveUserRole,
		insertMethod: 'insertUserRole',
		saveMethod: 'updateUserRole',
		deleteMethod: 'deleteUserRole',
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
        items:[roleGridPanel]
    });
	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[ treePanel, gridPanel, contentPanel],
        listeners:{
        	afterlayout:function(){
        	}
        }
    });	
	gridPanel.getTopToolbar().items.get('add').disable();
	gridPanel.getTopToolbar().add('&nbsp查询&nbsp', searchTriggerField);	
	if ( DEPLOY_UNITTYPE=="0" ){
	
	gridPanel.getTopToolbar().add('-',hrViewCombo);
	}
//	gridPanel.getTopToolbar().add('->',  cutUserBtn, pasteUserBtn,loadSignBtn,setPasswordBtn);
	gridPanel.getTopToolbar().add('->', cutUserBtn, pasteUserBtn,setPasswordBtn);
	
	treePanel.root.select();	
	userDS.baseParams.params = "posid" + SPLITB +defaultOrgRootId + SPLITA +"unitType"+SPLITB +"-1";
    userDS.load({
    	params:{
	    	start: 0,
	    	limit: PAGE_SIZE
    	}
    });
    if(DEPLOY_UNITTYPE=="A") {
//	    roleGridPanel.showHideTopToolbarItems("del",false);
//	    roleGridPanel.showHideTopToolbarItems("add",false);
//		roleGridPanel.showHideTopToolbarItems("save",false);   	
//	    gridPanel.getTopToolbar().disable();
//	    searchTriggerField.enable();
//	    searchTriggerField.readOnly = false;
//	    toolBarEnable = false;
    }
    
	/** 关联 **/	
	function orgGridRowSelected(obj){
    	var record = userSM.getSelected();
    	if(!record) {
    		return false;
    	}  		
    	setButtonStatus(record==null || record.get("id")=="" || !toolBarEnable, signAndPasswartEnable);
    	
    	linkLoad(obj, record)
    	//不能修改当前登陆用户所属的角色
    	if(record!=null && ROLETYPE != '0'){
    		if(record.data.userid == USERID){
//    			cutUserBtn.setDisabled(true);
//    			loadSignBtn.setDisabled(true);
//    			roleGridPanel.showHideTopToolbarItems("del",false)
//    			roleGridPanel.showHideTopToolbarItems("add",false)
//    			roleGridPanel.showHideTopToolbarItems("save",false)
    		} else
    		{
//    			roleGridPanel.showHideTopToolbarItems("del",true)
//    			roleGridPanel.showHideTopToolbarItems("add",true)
//    			roleGridPanel.showHideTopToolbarItems("save",true)
    		}
    	}
    	
	}
	
	function setButtonStatus(flag, signAndPasswordFlag){
		cutUserBtn.setDisabled(flag);
		loadSignBtn.setDisabled(flag);
		if(!flag) {
			loadSignBtn.setDisabled(!signAndPasswordFlag);
			setPasswordBtn.setDisabled(!signAndPasswordFlag);
		}
	}
	
	function setPassword(){
    	orgIdWhenCopied = selectedOrgId
    	var records = userSM.getSelections();
    	var ids = new Array();
    	for(var i=0; i<records.length; i++){
    		ids.push(records[i].get("userid"));
    	}
    	var usersToSet = ids.join(SPLITB);
    	if(usersToSet && usersToSet.length>0) {
	    	doSetPassWord(usersToSet)
    	} else {
    		Ext.Msg.alert("提示", "请先选择需要重置密码的用户！");
    	}
    }
	
	function doSetPassWord(usersToSet){
		Ext.Ajax.request({
			waitMsg: 'Seting User Password ...',
			url: SYS_SERVLET,
			params: {ac: "setuserpassword", ids: usersToSet, password:defaultPwd},
	   		method: "GET",
	   		success: function(response, params) {
	   			var rspXml = response.responseXML
	   			var sa = rspXml.documentElement.getElementsByTagName("done").item(0).firstChild.nodeValue;
	   			var msg = rspXml.documentElement.getElementsByTagName("msg").item(0).firstChild.nodeValue;

	   			if(msg == SUCCESS){
	   				Ext.example.msg('操作成功！', '您重置了用户的登陆密码！！', '');
					window.setTimeout(function(){
						userDS.reload();
			    	}, 500);
	   			}
	   			else
	   			{
	   				var stackTrace = rspXml.documentElement.getElementsByTagName("stackTrace").item(0).firstChild.nodeValue;
	   				var str = '<br>失败原因：' + msg;
			        Ext.MessageBox.show({
			           title: '操作失败！',
			           msg: str,
			           width:500,
			           value:stackTrace,
			           buttons: Ext.MessageBox.OK,
			           multiline: true,
			           icon: Ext.MessageBox.ERROR
					});
	   			}
			},
			failure: function(response, params) {
				alert('Error: Save failed!');
			}
   		});    	
    }

    
    function cutUser(){
    	orgIdWhenCopied = selectedOrgId
    	var records = userSM.getSelections();
    	var ids = new Array();
    	for(var i=0; i<records.length; i++){
    		ids.push(records[i].get("userid"));
    	}
    	usersToMove = ids.join(SPLITB);
    	moveAction = 'cut';
    	pasteUserBtn.setText('粘贴(' + ids.length + ")")
    	pasteUserBtn.setDisabled(false);
    	pasteUserBtn.setIconClass('pasteUser1');
    }
    
    function pasteUser(){
    	if (orgIdWhenCopied == selectedOrgId)
    		return;
    	
    	//modified by Liuay 2011-06-02	用户复制粘贴时，获取粘贴到的相应的unitId、deptId、posId;
    	var moveToUnitId = selectedUnitId;
    	var moveToDeptId = selectedOrgId;
    	var moveToPosId = selectedOrgId;
    	var selNode = treePanel.getSelectionModel().getSelectedNode();
    	if(selNode){
			if(selNode.id==defaultOrgRootId||selNode.attributes.orgsort=="CORP"){
    			moveToDeptId = selNode.id;
    			moveToPosId = selNode.id;
    		}else{
	    		selNode.bubble(function(n){
	    			if(n.attributes.orgsort=="DEPT"){
		    			moveToDeptId = n.id;
	    			}
	    		});
    		}
	    	doUsersMove(moveToUnitId, moveToDeptId, moveToPosId)
	    	
	    	pasteUserBtn.setDisabled(true);
	    	
	    	pasteUserBtn.setIconClass('pasteUser');
	    	
	    	pasteUserBtn.setText('粘贴')
	    }
    }
    
	function doUsersMove(moveToUnitId, moveToDeptId, moveToPosId){
		Ext.Ajax.request({
			waitMsg: 'Saving changes...',
			url: SYS_SERVLET,
			params: {ac: "moveuser", move: moveAction, ids: usersToMove, oldorgid: orgIdWhenCopied, orgid: moveToUnitId, newDeptId: moveToDeptId, newPosId: moveToPosId},
	   		method: "GET",
	   		success: function(response, params) {
	   			var rspXml = response.responseXML
	   			var sa = rspXml.documentElement.getElementsByTagName("done").item(0).firstChild.nodeValue;
	   			var msg = rspXml.documentElement.getElementsByTagName("msg").item(0).firstChild.nodeValue;

	   			if(msg == SUCCESS){
	   				//需要对删除单位、粘贴单位用户做数据同步操作
	   				if(DEPLOY_UNITTYPE && DEPLOY_UNITTYPE=="0") {
						systemMgm.userDataExchange(orgIdWhenCopied + "`" + moveToUnitId, "DOWN", function(){});
	   				} 
	   				if(DEPLOY_UNITTYPE && DEPLOY_UNITTYPE=="A") {
						systemMgm.userDataExchange(orgIdWhenCopied + "`" + moveToUnitId, "UP", function(){});
	   				}
	   				Ext.example.msg('操作成功！', '您修改了用户所属的组织机构！', '');
					window.setTimeout(function(){
						userDS.reload();
			    	}, 500);
	   			}
	   			else
	   			{
	   				var stackTrace = rspXml.documentElement.getElementsByTagName("stackTrace").item(0).firstChild.nodeValue;
	   				var str = '<br>失败原因：' + msg;
			        Ext.MessageBox.show({
			           title: '操作失败！',
			           msg: str,
			           width:500,
			           value:stackTrace,
			           buttons: Ext.MessageBox.OK,
			           multiline: true,
			           icon: Ext.MessageBox.ERROR
					});
	   			}
			},
			failure: function(response, params) {
				alert('Error: Save failed!');
			}
   		});    	
    }
	
	function linkLoad(obj, record) {
    	var reload = false;
		if (record == null) {
    		if (selectedUserId != "-1"){
    			reload = true;
    			selectedUserId = "-1";
    			roleGridPanel.setTitle(roleGridPanelTitle);
    		}
    	} else {
    		if (selectedUserId != record.get("userid")){
    			reload = true;
    			selectedUserId = record.get("userid");
    			selectedUserId = selectedUserId==""? "-1":selectedUserId;
    			rolePlantInt.userid = selectedUserId;
    			var usertitle = record.get("realname")=="" ? record.get("username"):record.get("realname");
    			roleGridPanel.setTitle(usertitle + "，角色");
    		}
    	}
    	if (obj!=null && reload) {
    		roleSelStore.baseParams.params = "select * from rock_role r where unit_id = '" + record.get("posid") + "' or (unit_id in (select unitid from sgcc_ini_unit start with unitid = '" + record.get("posid") + "' connect by prior upunit=unitid ) and roletype='2')";
	    	roleSelStore.load();	    	
    		roleDs.baseParams.params = "userid"+SPLITB+selectedUserId;
	    	roleDs.load();	    	
    	}	
	}
    
    function deleteFun(){
    	if (userSM.getCount() > 0) {
    		Ext.Msg.confirm("确认删除吗？", "用户被删除后，将不可恢复！", function(btn){
    			if(btn=="yes"){
    				gridPanel.defaultDeleteHandler(); 
    			}
    		})
    	}
    }    

    function insertUserRole(){
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
    
    function loadSign(){
		USERID = userSM.getSelected().get('userid');
		if (!uploadWindow){
			uploadWindow = 	new Ext.Window({	               
				title: '上传手写签名图片',
				iconCls: 'form',
				layout: 'fit',
				width: 500, height: 280,
				modal: true,
				closeAction: 'hide',
				maximizable: false, resizable: false,
				plain: true, border: false,
				autoLoad: {
					url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
					params: 'type=uploadSign',
					text: 'Loading...'
				}
			});
		} else {
			uploadWindow.doAutoLoad();
		}
		uploadWindow.show();
	}
	
	
	
	function reportUserData(){
		try{
			var params = gridPanel.store.baseParams.params;
			var arr = params.replace(/;/ , "`").split(SPLITB);
			var tempUserUnit = "";
			if(arr.length==4&&arr[0].toUpperCase()=="POSID"&&arr[1]!=""){
				tempUserUnit = arr[1]
			}
			
			if(tempUserUnit!=""){
				if(DEPLOY_UNITTYPE&&DEPLOY_UNITTYPE=="A"){//当前系统部署到项目单位是才将该项目的组织机构报送到集团公司(采用及时报送的方式)
					systemMgm.userDataExchange(tempUserUnit, "UP", function(){});
				} else if (DEPLOY_UNITTYPE&&DEPLOY_UNITTYPE=="0") {	//如果是当前系统部署到集团公司，将组织机构的信息报送到各个项目单位（实时报送）
					systemMgm.userDataExchange(tempUserUnit, "DOWN", function(){});
				}
			}
		}catch(e){}
	}
	Ext.getCmp('timefield').setValue(newTime);
});

//function sycUser(){
//	if(confirm("该操作将从HR系统中获取最新的用户信息并同步到基建MIS系统中，该操作将对基建MIS用户表进行更新，请慎重执行！")){
//		UserSync.syncUser(function(dat){
//			Ext.Msg.alert("操作提示",dat)
//			userDS.reload();
//		})
//	}
//}

 function getCountHRUser(){
    var  str;
    DWREngine.setAsync(false);
   	UserSync.getHRUserCont(function (r){
        str=r;
    })
    DWREngine.setAsync(true);
    Ext.getCmp('endHRNum').setValue(str);
 }
 function sysHRUserInfo(){
     var start =Ext.getCmp('startHRNum').getValue();
     var end= Ext.getCmp('endHRNum').getValue();
     if(start==''){
       start = 0;
     }
     if(end==''){
        end=0;
     }
     if(start>=end){
         Ext.Msg.alert('提示信息','开始条目数不能大于结束条目数');
         return ;
     }
     
     importUserConfirm(start,end,'');
     
     if ( importWindow ){
		importWindow.show();
	}
	else{
		var impWinWidth = Ext.get("orgs-tree").getWidth()  +Ext.get("user-grid-panel").getWidth() ;
		var impWinHeight = Ext.get("user-grid-panel").getHeight(); 
		if ( impWinWidth > 100 ) impWinWidth -= 100;
		if ( impWinHeight > 100 ) impWinHeight -= 100;
		
		importWindow = new Ext.Window({
				id : 'import-window',
				title : 'HR同步用户信息确认',
			width : impWinWidth,
			height : impWinHeight,
			modal : true,
			layout : 'border',
			closeAction : 'hide',
			maximizable : true,
			items : [importGrid]});
			importWindow.show();
	
	}
 }
 
 function sysHRnewUserConfirm(){
 	if(newTime==""){
         Ext.Msg.alert('提示信息','请先同步所有数据！');
         return 
	}
 	//先检查配置文件中是否已有最近更新的时间
 	UserSync.checkLastUpdate(function(retVal){
 		if ( retVal == 'success' ){
 			//将同步的数据读取到grid,方法在sys.user.hr.importWindow.js中
			importUserConfirm('','',1);
			if ( importWindow ){
				importWindow.show();
			}
			else{
				var impWinWidth = Ext.get("orgs-tree").getWidth()  +Ext.get("user-grid-panel").getWidth() ;
				var impWinHeight = Ext.get("user-grid-panel").getHeight(); 
				if ( impWinWidth > 100 ) impWinWidth -= 100;
				if ( impWinHeight > 100 ) impWinHeight -= 100;
				
				importWindow = new Ext.Window({
					id : 'import-window',
					title : 'HR同步用户信息确认',
					width : impWinWidth,
					height : impWinHeight,
					modal : true,
					layout : 'border',
					closeAction : 'hide',
					maximizable : true,
					items : [importGrid]
				});
				importWindow.show();
			}
 		}
 		else{
 			Ext.Msg.alert("操作提示",retVal);
 		
 		}
 	});
 }

// function sysHRnewUserInfo(){
//     var rtn;
//     if(newTime==""){
//         Ext.Msg.alert('提示信息','请先同步所有数据！');
//         return 
//     }
//     
//     if(confirm("该操作将从HR系统中获取最新的用户信息并同步到基建MIS系统中，该操作将对基建MIS用户表进行更新，请慎重执行！")){
//		DWREngine.setAsync(false);
//	     UserSync.sysHRUserByNum("","","1",function (r){
//	         rtn = r;
//	     })
//	     DWREngine.setAsync(true);
//	      Ext.Msg.alert("操作提示",rtn.split(',')[0]);
//	       if(rtn.split(',').length){
//	           newTime=rtn.split(',')[1]
//	           Ext.getCmp('timefield').setValue(newTime);
//	       }
//	      userDS.reload();
//	}
// }
 
 function showDeptOrPosNameFun(value,metadata,record) {
		var str = '';
   		for(var i=0; i<unitArr.length; i++) {
   			if (unitArr[i][0] == value) {
   				str = unitArr[i][1]
   				break; 
   			}
   		}
   		if ( value )
       	metadata.attr = 'ext:qwidth=200 ext:qtip="' + str.bold() + '"';
   		return str;
	}
