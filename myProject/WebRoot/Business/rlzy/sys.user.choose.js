var treePanel, gridPanel, userGridPanel, userInfoPanel, userInfoTabPanel;
var gridResumePanel,gridJndjPanel,gridArtPanel,gridJfPanel
var PlantInt,PlantIntResume,PlantIntJndj,PlantIntArt,PlantIntJf
var ds,dsResume,dsJndj,dsArt,dsJf
var nodes = new Array();
var roleTypeSt;
var bean = "com.sgepit.frame.sysman.hbm.RockUser";
//var bean = "com.sgepit.pmis.rlzj.hbm.HrManInfo";
var roleBean = "com.sgepit.frame.sysman.hbm.RockRole2user";
var beanResume = "com.sgepit.pmis.rlzj.hbm.HrManResume";
var beanJndj = "com.sgepit.pmis.rlzj.hbm.HrManJndj";
var beanArt = "com.sgepit.pmis.rlzj.hbm.HrManArt";
var beanJf = "com.sgepit.pmis.rlzj.hbm.HrManJf";
var business = "systemMgm";
var listMethod = "findUserByOrgNotInManInfo";
var roleListMethod = "findByProperty";
var listResumeMethod = "findByProperty";
var listJndjMethod = "findByProperty";
var listArtMethod = "findByProperty";
var listJfMethod = "findByProperty";
var primaryKey = "userid";
var rolePrimaryKey = "uids";
var primaryResumeKey = "seqnum";
var primaryJndjKey = "seqnum";
var primaryArtKey = "seqnum";
var primaryJfKey = "seqnum";
var orderColumn = "realname";
var gridPanelTitle = "用户列表，请选择部门";
var roleGridPanelTitle = "用户角色，请选择用户";//"个人简历";
var gridResumePanelTitle = "教育及培训情况";
var gridJndjPanelTitle = "主要技能信息";//"技能鉴定/职业资格";
var gridArtPanelTitle = "专业技术资格";
var gridJfPanelTitle = "积分登记";
var formPanelTitle = "编辑记录（查看详细信息）";
var paramStr = "unitid" + SPLITB +defaultOrgRootId;
var SPLITB = "`";
var root;
var selectedUserId = "-1";
var selectedOrgId = defaultOrgRootId;
var COMPANY = defaultOrgRootName
var selectedOrgName = COMPANY;
var roles = new Array();
var jllxs = new Array();//经历类型
var ghs = new Array();//技能职业类型
var zyjszgs = new Array();//专业技术资格
var nds = new Array();//预算年度
//（0 禁用；1激活；2锁定）
var statusList = [['1', '激活'],['2', '锁定'],['0', '禁用']];
var defaultPwd = MD5("123456");
var defaultStatus = "1";
var cutUserBtn, pasteUserBtn,setPasswordBtn ,loadSignBtn;
var orgIdWhenCopied, usersToMove, moveAction;
var uploadWindow;
var treeNodeUrl = CONTEXT_PATH + "/servlet/SysServlet?ac=tree";
var selectRecords = new Array();

if(ROLETYPE=="0")
{	
	if(defaultOrgRootId == defaultOrgRootID)
	{
		paramStr = ""
	}	
}

if((ROLETYPE != '0') )
{
	treeNodeUrl = treeNodeUrl +"&attachUnit=" + UNITID
}

Ext.onReady(function (){
	var fm = Ext.form;			// 包名简写（缩写）
	root = new Ext.tree.AsyncTreeNode({
       text: defaultOrgRootName,
       id: defaultOrgRootId,
       expanded:true
    });
     treeLoader = new Ext.tree.TreeLoader({
		dataUrl: treeNodeUrl + "&parentId=" + defaultOrgRootId + "&treeName=SysOrgTree",
		requestMethod: "GET"
	})
    
	var 组织结构树
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
            handler: function(){ root.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function(){ root.collapse(true); }
        }],
        loader: treeLoader,
        root: root,
        collapseFirst:false
	});
	treePanel.on('beforeload', function(node){ 
		treePanel.loader.dataUrl = treeNodeUrl+"&parentId="+node.id+"&treeName=SysOrgTree"; 
	});
	
    treePanel.on('click', function(node, e){
		e.stopEvent();
		PlantInt.posid = node.id;
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
		var selectedType = node.attributes.nodeType
		var paramStrCur = "unitType"+SPLITB+selectedType + SPLITA 
		                + "posid" + SPLITB +node.id
		if (selectedOrgId==defaultOrgRootID)
		{
			paramStrCur ="";
		}
		ds.baseParams.params = paramStrCur;
		ds.load({
			params:{
			 	start: 0,
			 	limit: 20
			}
		});
    });
    
var 用户信息
//gridPanel--------------------------------------------------------------------------------------------------	
    var fc = {		// 创建编辑域配置
    	'userid': {
			name: 'userid',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true,
			hidden:true,
			hideLabel:true
        },'unitid': {
			name: 'unitid',
			fieldLabel: '单位ID',
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
		}, 'email': {
			name: 'email',
			fieldLabel: '电子邮件',
			anchor:'95%'
		}, 'posid': {
			name: 'posid',
			fieldLabel: '组织结构ID',
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
    	{name: 'lastlogon', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'createdon', type: 'date', dateFormat: 'Y-m-d H:i:s'},
    	{name: 'phone', type: 'string'},
    	{name: 'mobile', type: 'string'},
		{name: 'email', type: 'string'},
		{name: 'posid', type: 'string'}
		];
		
    var sm =  new Ext.grid.CheckboxSelectionModel();
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	sm, {
           id:'userid',
           header: fc['userid'].fieldLabel,
           dataIndex: fc['userid'].name,
           hidden:true,
           width: 200
        },  {id:'unitid',
           header: fc['unitid'].fieldLabel,
           dataIndex: fc['unitid'].name,
           hidden:true,
           width: 200
        },{
           id:'useraccount',
           header: fc['useraccount'].fieldLabel,
           dataIndex: fc['useraccount'].name,
           width: 120
           //,editor: new fm.TextField(fc['useraccount'])
        }, {
           id:'userpassword',
           header: fc['userpassword'].fieldLabel,
           dataIndex: fc['userpassword'].name,
           width: 100,
           hidden:true
           //,editor: new fm.TextField(fc['userpassword'])
        }, {
           id:'realname',
           header: fc['realname'].fieldLabel,
           dataIndex: fc['realname'].name,
           width: 120
           //,editor: new fm.TextField(fc['realname'])
        }, {
           id:'sex',
           header: fc['sex'].fieldLabel,
           dataIndex: fc['sex'].name,
           width: 80,
           renderer: function(value){
           	  if (value!="")
           	  	return value=='0' ? '男':'女';
           	  else
           	  	return value;
           }
           //,editor: new fm.ComboBox(fc['sex'])
        }, {
           id:'userstate',
           header: fc['userstate'].fieldLabel,
           dataIndex: fc['userstate'].name,
           width: 80,
           renderer: function(value){
           	  for(var i=0; i<statusList.length; i++){
           	  	if (value == statusList[i][0])
           	  		return statusList[i][1]
           	  }
           }
           //,editor: new fm.ComboBox(fc['userstate'])
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
           //,editor: new fm.TextField(fc['phone'])
        }, {
           id:'mobile',
           header: fc['mobile'].fieldLabel,
           dataIndex: fc['mobile'].name,
           width: 80
           //,editor: new fm.TextField(fc['mobile'])
        }, {
           id:'email',
           header: fc['email'].fieldLabel,
           dataIndex: fc['email'].name,
           width: 80
           //,editor: new fm.TextField(fc['email'])
        }, {
           id:'posid',
           header: fc['posid'].fieldLabel,
           dataIndex: fc['posid'].name,
           hidden: true,
           width: 80
           
        }
	]);
    cm.defaultSortable = true;						//设置是否可排序

    ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: bean,				
	    	business: business,
	    	method: listMethod
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
            id: primaryKey
        }, Columns),

        // 设置是否可以服务器端排序
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    ds.setDefaultSort(orderColumn, 'asc');	//设置默认排序列
    
	var getUsers = new Ext.Button({
		text: '导入系统用户',
		iconCls: 'save',
		handler: function(){
			if (selectRecords.length > 0){
				//parent.window['tmp'] = "3"
				//parent.win.hide();
				alert(parent.win)
				//window.returnValue=selectedUserId
				//window.close()
			}else{
				Ext.Msg.confirm('提示', '没有选择用户，确认退出吗？', function(btn, text){
				    if (btn == 'ok'){
						window.returnValue=selectedUserId
						window.close()
				    }
				});
			}
		}
	})
		
	gridPanel = new Ext.grid.GridPanel({
		ds: ds,
		cm: cm,
		sm: sm,
		tbar: [gridPanelTitle, '->', getUsers],
		border: false,
		region: 'center',
		layout: 'accordion',
		header: false,
		autoScroll: true,
		loadMask: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
	        pageSize: 10,
	        store: ds,
	        displayInfo: true,
	        displayMsg: ' {0} - {1} / {2}',
	        emptyMsg: "无记录。"
	    }),
	    width: 200
	});
	sm.on('selectionchange', function (obj){
		var record = sm.getSelections();//getSelected();
		for(i = 0;i<record.length;i++){
			if(i==0)
				selectedUserId = ""
			selectedUserId += (selectedUserId == ""?"":",") + record[i].get("userid")
		}
		selectRecords = record
	});
/*	sm.on('rowselect', function(sModel, rowIndex, record){
		if (selectRecords.length > 0){
			if (!isExistRecord(record)) selectRecords.push(record); 
		} else {
			selectRecords.push(record);
		}
	});
	sm.on('rowdeselect', function(sModel, rowIndex, record){
		for (var i = 0; i < selectRecords.length; i++){
			if (selectRecords[i].get('userid') == record.get('userid')){
				selectRecords.splice(i,1);
			}
		}
	});*/
//gridPanel--------------------------------------------------------------------------------------------------	
//userInfoPanel--------------------------------------------------------------------------------------------------	
    userInfoPanel = new Ext.Panel({
    	id:'tab-panel',
    	region: 'center',
    	border: false,
    	split:true,
        layout:'border',
        items:[gridPanel]
    });
//userInfoPanel--------------------------------------------------------------------------------------------------	

//viewport--------------------------------------------------------------------------------------------------	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[ treePanel, userInfoPanel]
    });	
//viewport--------------------------------------------------------------------------------------------------	
	initOthers();
    
    function initOthers(){
		root.select();	
		ds.baseParams.params = paramStr;
	    ds.load({
	    	params:{
		    	start: 0,
		    	limit: 10
	    	}
	    });
    }

	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };

    function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i:s') : value;
    };
    
    function loadSign(){
		USERID = sm.getSelected().get('userid');
		if (!uploadWindow){
			uploadWindow = 	new Ext.Window({	               
				title: '上传手写签名图片',
				iconCls: 'form',
				layout: 'fit',
				width: 450, height: 180,
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
	
    function impUser(){
    	var win
    	if(!win){
    		win = new Ext.Window({	               
				title: '导入用户',
				//iconCls: 'form',
				layout: 'fit',
				width: 450, height: 180,
				modal: true,
				closeAction: 'hide',
				maximizable: false, resizable: false,
				plain: true, border: false,
				/*autoLoad: {
					url: BASE_PATH + 'Business/rlzy/sys.user.setting.jsp',
					params: 'type=uploadSign',
					text: 'Loading...'
				}*/
				items:[
					portletConfigPanel
				]
			});
    	}
    	win.show();
    }
});


