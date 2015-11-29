var root;
var treePanel, gridPanel;
var nodes = new Array();
var bodyPanelTitle = "合同：" + selectedConName + "，编号：" + selectedConNo;
var gridPanelTitle = '用户列表，请选择部门';
var bean = "com.sgepit.frame.sysman.hbm.RockUser";
var business = "systemMgm";
var listMethod = "findUserByOrg";
var primaryKey = "userid";
var orderColumn = "realname";
var paramName = "posid";
var paramValue = CURRENTAPPID;
var pageSize = PAGE_SIZE;
var SPLITB = "`";
var statusList = [['active', '正常'],['freeze', '锁定'],['cancel', '注销']];
var defaultPwd = "0000";
var selectedOrgId = USERBELONGUNITID;
var selectedOrgName = USERBELONGUNITNAME;
var Positions = new Array();
var posiTypeSt;
var userName = "";
var RootUpunitunitid= USERBELONGUNITID;
var unitid=CURRENTAPPID;
var upunit=CURRENTAPPID;
var RootName=USERBELONGUNITNAME;
var where="unit_type_id not in ('9')";
var ComFileManageServlet=CONTEXT_PATH + "/servlet/ComFileManageServlet?ac=buildingUnitNewTree";
Ext.onReady(function(){
  	
	posiTypeSt = new Ext.data.SimpleStore({
		fields: ['posid','posname'],   
		data: Positions,
		reader: new Ext.data.ArrayReader({
			id: 0
		}, Ext.data.Record.create([
    		{name: 'posid', mapping: 0}, 
    		{name: 'posname', mapping: 1}
		]))
	});
		 		
      DWREngine.setAsync(false);
      db2Json.selectData("select unitid,upunit,unitname from sgcc_ini_unit where unitid='"+CURRENTAPPID+"'", function (jsonData) {
	  var list = eval(jsonData);
	      if(list!=null){
	        	RootUpunitunitid=list[0].upunit;  
	        	upunit=list[0].upunit;
	     		 }  
	      	 });
	      DWREngine.setAsync(true);
	      DWREngine.setAsync(false);
          db2Json.selectData("select upunit,unitname from sgcc_ini_unit where unitid='"+RootUpunitunitid+"'", function (jsonData) {
	      var list = eval(jsonData);
	      		if(list!=null){
	        		RootName=list[0].unitname;
	     		 }  
	      	 });
	       DWREngine.setAsync(true);
	treePanel = new Ext.tree.TreePanel({
        id:'orgs-tree',
        region:'west',
        split:true,
        width: 196,
        minSize: 175,
        maxSize: 500,
        frame: false,
        tbar: [{
            iconCls: 'icon-expand-all',
			tooltip: '全部展开',
            handler: function(){ treePanel.root.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function(){ treePanel.root.collapse(true); }
        }],
        collapsible : true,
		enableDD : true,
		margins : '5 0 5 5',
		cmargins : '0 0 0 0',
		rootVisible : true,
		lines : false,
		autoScroll : true,
		animCollapse : false,
		animate : false,
		collapseMode : 'mini',
		rootVisible:false,
		loader : new Ext.tree.TreeLoader({
			dataUrl: ComFileManageServlet,
			baseParams:{
				method : "buildingUnitNewTree",
				baseWhere :where,
				unitid:unitid,
			    upunit:upunit,
				async:true,
				ifcheck:false,
				ignore:false,
				hascheck:false
			},
			requestMethod: "GET"
		}),
		root : new Ext.tree.AsyncTreeNode({
	       	text: RootName,
			id: RootUpunitunitid
	    }),
		collapseFirst : false,
		listeners:{
			beforeload:function(node){
				node.getOwnerTree().loader.baseParams.parentId = node.id; 
			}
		}
	});
	
	treePanel.on('click', function(node, e){
		e.stopEvent();
		PlantInt.orgid = node.id;
		var titles = [node.text];
		var obj = node.parentNode;
		while(obj!=null){
			titles.push(obj.text);
			obj = obj.parentNode;
		}
		var title = titles.reverse().join(" / ");
		//gridPanel.setTitle(title);
		var setTitle = '<font color=#15428b><b>&nbsp;'+title+'</b></font>'
		gridTitleBar.setText(setTitle)
		selectedOrgId = node.id
		selectedOrgName = node.text;
		ds.baseParams.params = 'unitType'+ SPLITB+0 + SPLITA + paramName+SPLITB+node.id;
		ds.load({
			params:{
			 	start: 0,
			 	limit: PAGE_SIZE
			}
		});
		Positions = new Array();
    });
    
	///////////////////////////////////////////////////////////////
	
	var sm =  new Ext.grid.RowSelectionModel();
	
	var fm = Ext.form;

    var fc = {		// 创建编辑域配置
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
    	{name: 'userid', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
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
		
    var Plant = Ext.data.Record.create(Columns);			//定义记录集
    var PlantInt = {
    	userid: '',
    	username: '', 
    	password: defaultPwd,
    	realname: '',
    	sex: '0',
    	status: defaultStatus,
    	phone: '',
    	mobile: '',
    	im: '',
    	orgid: selectedOrgId
    };
    
    var sm =  new Ext.grid.RowSelectionModel();
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	{
           id:'userid',
           header: fc['userid'].fieldLabel,
           dataIndex: fc['userid'].name,
           hidden:true,
           width: 200
        }, {
           id:'username',
           header: fc['username'].fieldLabel,
           dataIndex: fc['username'].name,
           width: 120,
           editor: new fm.TextField(fc['username'])
        }, {
           id:'password',
           header: fc['password'].fieldLabel,
           dataIndex: fc['password'].name,
           width: 100,
           hidden:true,
           editor: new fm.TextField(fc['password'])
        }, {
           id:'realname',
           header: fc['realname'].fieldLabel,
           dataIndex: fc['realname'].name,
           width: 120,
           editor: new fm.TextField(fc['realname'])
        }, {
           id:'sex',
           header: fc['sex'].fieldLabel,
           dataIndex: fc['sex'].name,
           width: 80,
           renderer: function(value){
           	  if (value!="")
           	  	return value=='0' ? "<img src='jsp/res/images/shared/icons/user_suit.gif'>" 
           	  					: "<img src='jsp/res/images/shared/icons/user_female.gif'>";
           	  	//return value=='0' ? '男':'女';
           	  else
           	  	return value;
           },
           editor: new fm.ComboBox(fc['sex'])
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
           },
           editor: new fm.ComboBox(fc['status'])
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
           width: 60,
           editor: new fm.TextField(fc['phone'])
        }, {
           id:'mobile',
           header: fc['mobile'].fieldLabel,
           dataIndex: fc['mobile'].name,
           width: 80,
           editor: new fm.TextField(fc['mobile'])
        }, {
           id:'im',
           header: fc['im'].fieldLabel,
           dataIndex: fc['im'].name,
           width: 80,
           editor: new fm.TextField(fc['im'])
        }, {
           id:'orgid',
           header: fc['orgid'].fieldLabel,
           dataIndex: fc['orgid'].name,
           hidden: true,
           width: 80
           
        }
	]);
    cm.defaultSortable = true;						//设置是否可排序

    var ds = new Ext.data.Store({
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
    
    var gridTitleBar = new Ext.Button({
		text: '<font color=#15428b><b>&nbsp;'+gridPanelTitle+'</b></font>',
		iconCls: 'form'
	})
    
	var btnRemove = new Ext.Button({
    	text: '移交',
    	tooltip: '合同移交',
    	iconCls: 'option',
    	disabled: true,
    	handler: function(){
    		Ext.Msg.show({
					title: '提示',
					msg: '是否要移交?　　　　',
					buttons: Ext.Msg.YESNO,
					icon: Ext.MessageBox.QUESTION,
					fn: function(value){
						if ("yes" == value){
				    		Ext.get('loading-mask').show();
							Ext.get('loading').show();
				    		conoveMgm.removeConove(selectedConId, userName, function(msg){
				    			Ext.get('loading-mask').hide();
								Ext.get('loading').hide();
				    			if ("" == msg){
				    				Ext.example.msg('移交成功！', '您成功移交了该条合同！');
				    				parent.location.href = BASE_PATH + "Business/contract/cont.main.frame.jsp";
				    			}else{
				    				Ext.Msg.show({
										title: '提示',
										msg: msg,
										buttons: Ext.Msg.OK,
										icon: Ext.MessageBox.ERROR
									});
				    			}
				    		});
						}
					}
    		});
    	}
    });
	
    gridPanel = new Ext.grid.GridPanel({
	    store: ds,
	    cm: cm,
	    sm: sm,
	    tbar: [gridTitleBar, '->', btnRemove],
	    iconCls: 'icon-by-category',
	    border: false,
	    layout: 'accordion',
	    region: 'center',
	    header: false,
	    autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 2,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,			//加载时是否显示进度
	    viewConfig: {
	        forceFit: true,
	        ignoreAdd: true
	    },
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: pageSize,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
	    minSize: 180,
	    height: 240
	});
	
	///////////////////////////////////////////////////////////////
	var titleBar = new Ext.Button({
		text: '<font color=#15428b><b>&nbsp;'+bodyPanelTitle+'</b></font>',
		iconCls: 'title'
	})
	
	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			//history.back();
		var url = BASE_PATH+"Business/contract/cont.generalInfo.input.jsp?";
		window.location.href = url + "isBack=1";	
		}
	});
	
	var bodyPanel = new Ext.Panel({
		tbar: [titleBar, '->', btnReturn],
		layout: 'border',
		border: false,
		header: false,
		items: [treePanel, gridPanel]
	});
	
	var viewport = new Ext.Viewport({
		layout: 'fit',
		items: [bodyPanel]
	});
	
	//事件绑定
	sm.on("rowselect", function(sm){
		var record = sm.getSelected();
		userName = record.get('username');
		btnRemove.setDisabled(false);
	})
	
	treePanel.render(); // 显示树
	treePanel.root.expand();
	treePanel.expand();
});

//其他自定义函数，如格式化，校验等
function formatDate(value){
    return value ? value.dateFormat('Y-m-d') : '';
}

function formatDateTime(value){
    return (value && value instanceof Date) ? value.dateFormat('Y-m-d H:i:s') : value;
};
    
// 下拉列表中 k v 的mapping 
//乙方单位
function partbRender(value){
	var str = '';
	for(var i=0; i<partBs.length; i++) {
		if (partBs[i][0] == value) {
			str = partBs[i][1]
			break; 
		}
	}
	return str;
}
// 合同状态
function BillStateRender(value){
	var str = '';
	for(var i=0; i<BillState.length; i++) {
		if (BillState[i][0] == value) {
			str = BillState[i][1]
			break; 
		}
	}
	return str;
}