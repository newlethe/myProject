var treePanel, gridPanel, configWindow, portletConfigPanel,rockWindow,unitTree;
var nodes = new Array();
var roleTypeSt, posiTypeSt;
var SYS_SERVLET = BASE_PATH+"servlet/SysServlet";
var treePanelTitle = "角色功能模块权限";
var selectedRoleId = "";
var selectedRoleName = "";
var selectedRoleType = "";
var SPLITB = "`";
var roles = [[ADMIN_ROLE_TYPE, ADMIN_ROLE_NAME],[MANAGER_ROLE_TYPE, MANAGER_ROLE_NAME],[PUBLIC_ROLE_TYPE, PUBLIC_ROLE_NAME],[LEADER_ROLE_TYPE, LEADER_ROLE_NAME]];
var unitidArr = new Array();
var cssCheckOn= 'x-grid3-check-col-on';
var cssCheckOff= 'x-grid3-check-col';

Ext.onReady(function (){
	DWREngine.setAsync(false);  
	baseMgm.getData("select u.unitid,u.unitname,u.unit_type_id,p.detail_type from sgcc_ini_unit u,V_PROPERTY p where" +
			" u.unit_type_id=p.property_code and u.unit_type_id<>'8' and u.unit_type_id<>'9' and p.tname='组织机构类型' " +
			"order by u.VIEW_ORDER_NUM asc",function(list){  
	 	var unitFirst = new Array();
	 	unitFirst.push('share');	
		unitFirst.push('公用角色');    
		unitidArr.push(unitFirst);
		for(var i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);	
			temp.push(list[i][1]);
			unitidArr.push(temp);
			
		}
	 });
	DWREngine.setAsync(true);
	treePanel = new Ext.tree.ColumnTree({
        id:'modules-tree-panel',
        iconCls: 'icon-by-category',
        region:'east',
        split:true,
        width:400,
        minSize: 275,
        maxSize: 600,
        frame: false,
        collapsed: true,
        collapsible: true,
        header:true,
        title:treePanelTitle,
        tbar:[{
            iconCls: 'icon-expand-all',
			tooltip: 'Expand All',
			scope:this,
            handler: function(){ treePanel.root.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: 'Collapse All',
			scope:this,
            handler: function(){ treePanel.root.collapse(true); }
        }, '->', {
	    	id: 'save',
	    	text: '保存',
	        tooltip: '保存',
	        iconCls:'save',
	        handler: saveRolemod
        }],
        border: false,
        cmargins:'0 0 0 0',
        rootVisible: false,
        lines:false,
        autoScroll:true,
        animCollapse:false,
        animate: false,
        collapseMode:'mini',
		columns:[{
            header:'模块',
            width:240,
            dataIndex:'text'
        },{
            header:'读',
            width:30,
            dataIndex:'read',
            renderer: function(value){
				return value ? '<div id="readChecker" class=x-grid3-check-col-on onclick="readChxClick(this)">&#160;</div>'
				 				: '<div id="readChecker" class=x-grid3-check-col onclick="readChxClick(this)">&#160;</div>'
			}
        },{
            header:'完全控制',
            width:55,
            dataIndex:'control',
            renderer: function(value){
				return value ? '<div id="controlChecker" class=x-grid3-check-col-on onclick="controlChxClick(this)">&#160;</div>'
				 			: '<div id="controlChecker" class=x-grid3-check-col onclick="controlChxClick(this)">&#160;</div>'
			}
        },{
            header:'模块ID',
            width:1,
            dataIndex:'id',
            renderer: function(value){
				return '<div id="idColumn">' + value + '</div>'
			}
        },{
            header:'权限级别',
            width:60,
            dataIndex:'lvl',
            renderer: function(value){
				return '<div id="lvlColumn">' + value + '</div>'
			}
        }],        
        loader: new Ext.tree.TreeLoader({
			url: SYS_SERVLET,
			baseParams:{
				ac:'rolemodtree',
				roleid:selectedRoleId,
				unitid:(USERBELONGUNITTYPEID=="0"||USERBELONGUNITTYPEID=="1"?defaultOrgRootID:USERBELONGUNITID)
			},
			clearOnLoad : true,
			baseAttrs:{ifcheck:"none"},
			uiProviders:{
			    'col': Ext.tree.ColumnNodeUI
			},
			listeners:{
				//在tree load的时候全部展开再全部收起，好让renderer函数执行
				load : function(){
					treePanel.root.expand(true);
					treePanel.root.collapse(true);
					treePanel.root.expand(false, true, function(){
						for (var index=0; index<treePanel.root.childNodes.length;index++)
						{
							treePanel.root.childNodes[index].expand()
						}
					})
				}
			}
		}),
        root: new Ext.tree.TreeNode({
	        text:'root'
	    }),
	    listeners:{
	    	click:function(node,e){
	    		var elNode = node.getUI().elNode;
				var chx = e.getTarget()
				var checked = chx.className==cssCheckOn
				if (chx.id && chx.id.indexOf("Checker") > 0) {
					deepCheck(node, chx.id, checked)
				}
				if (checked){
					var p = node.parentNode
					while(p){
						if (p.getUI().elNode && p.getUI().elNode.querySelector("#"+chx.id))
						checkerClick(p.getUI().elNode.querySelector("#"+chx.id), true)			
						p = p.parentNode
					}
				}
	    	}
	    }
	});
	
    var fc = {		// 创建编辑域配置
    	'rolepk': {
			name: 'rolepk',
			fieldLabel: '主键',
			anchor:'95%',
			readOnly:true
        }, 'unitId': {
			name: 'unitId',
			fieldLabel: '单位',
			anchor:'95%',
			readOnly:true
        }, 'rolename': {
			name: 'rolename',
			fieldLabel: '角色名称',
			allowBlank: false,
			anchor:'95%'
		}, 'roletype': {
			name: 'roletype',
			fieldLabel: '类型',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({
				fields: ['k','v'],
				data: roles
			}),
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		}
	};
	
    var Columns = [
    	{name: 'rolepk', type: 'string'},		//Grid显示的列，必须包括主键(可隐藏)
    	{name: 'unitId', type: 'string'},	
		{name: 'rolename', type: 'string'},
		{name: 'roletype', type: 'int'}
		];
		
    var Plant = Ext.data.Record.create(Columns);			//定义记录集
    var PlantInt = {
    	rolepk: '',
    	unitId:USERBELONGUNITID,
    	rolename: '', 
    	roletype: 2
    };
    
    var roleSM =  new Ext.grid.RowSelectionModel({
    	singleSelect:true,
    	listeners:{
    		rowselect  : function(_sm, n, r){
				var items = gridPanel.getTopToolbar().items
				if (r.data["rolepk"] == ADMIN_ROLE_ID || r.data["rolepk"] == PUBLIC_ROLE_ID){
					if(items.get("save")) items.get("save").disable()
				} else{
					if(items.get("save")) items.get("save").enable()
				}
			},
			selectionchange : function (_sm){
		    	if (!treePanel.isVisible())		return
		    	var record = _sm.getSelected();
	    		var treeloader = treePanel.loader;
	    		var root = treePanel.root;
		    	if (record != null) {
		    		treePanel.getEl().mask("loading...")
		    		selectedRoleId = record.get("rolepk");
		    		selectedRoleName = record.get("rolename");
			        selectedRoleType = record.get("roletype");
		    		treePanel.setTitle(selectedRoleName + treePanelTitle);
		    		treeloader.baseParams.roleid = selectedRoleId
		    		treeloader.load(root, function(){
			    		while (root.childNodes.length > 1) {
			    			root.firstChild.remove()
			    		}    			
		    			treePanel.getEl().unmask()
		       		})
				} else {
					selectedRoleId = "";
					selectedRoleName = "";
			        selectedRoleType = "";
			        treePanel.setTitle(treePanelTitle);
		    		while (root.childNodes.length > 0) {
		    			root.firstChild.remove()
		    		}
				}
		    }
    	}
    });
    var roleCM = new Ext.grid.ColumnModel([		// 创建列模型
    	{
           id:'rolepk',
           header: fc['rolepk'].fieldLabel,
           dataIndex: fc['rolepk'].name,
           hidden:true
        },{
           id:'unitId',
           header: fc['unitId'].fieldLabel,
           dataIndex: fc['unitId'].name,
           hidden:true
        }, {
           id:'rolename',
           header: fc['rolename'].fieldLabel,
           dataIndex: fc['rolename'].name,
           width: 120,
           editor: new Ext.form.TextField(fc['rolename'])
        }, {
           id:'roletype',
           header: fc['roletype'].fieldLabel,
           dataIndex: fc['roletype'].name,
           width: 80,
           renderer: function(value){
           	 for(var i=0; i<roles.length; i++){
           	 	if (value == roles[i][0])
           	 		return roles[i][1]
           	 }
           },
           editor: new Ext.form.ComboBox(fc['roletype'])
        }
	]);
    roleCM.defaultSortable = true;

    var roleDS = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: "com.sgepit.frame.sysman.hbm.RockRole",				
	    	business: "baseMgm",
	    	method: "findWhereOrderby",
	    	params:"unit_id<>'UNITROLE'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),

        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: "rolepk"
        }, Columns),

        remoteSort: true,
        pruneModifiedRecords: true
    });
    roleDS.setDefaultSort("rolename", 'asc');
	
	gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'role-grid-panel',
        ds: roleDS,
        cm: roleCM,
        sm: roleSM,
        tbar: [],
        title: "系统角色列表",
        iconCls: 'icon-by-category',
        border: false, 
        region: 'center',
        clicksToEdit: 1,
        header: true,
        autoScroll: true,
        collapsible: false,
        animCollapse: false,
        autoExpandColumn: 1,
        insertHandler:function(){
        	if(unitTree&&unitTree.getSelectionModel().getSelectedNode()){
    			this.plantInt.unitId = unitTree.getSelectionModel().getSelectedNode().id;
	        	this.defaultInsertHandler();
        	}else{
        		Ext.example.msg('','请先选择单位');
        	}
        },
        loadMask: true,
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: roleDS,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: "com.sgepit.frame.sysman.hbm.RockRole",					
      	business: "systemMgm",	
      	primaryKey: "rolepk",		
		insertMethod: 'insertRole',
		saveMethod: 'updateRole',
		deleteMethod: 'deleteRole',
		listeners:{
			render:function(_grid){
				_grid.getTopToolbar().add('&nbsp;&nbsp;角色查询',new Ext.form.TextField({
					xtype:'textfield',
					width: 180,
					emptyText :'输入角色关键字，按回车查询',
					grid:_grid,
					listeners:{
						specialkey :function(_field, ev){
							if(ev.getKey()==13){
								var keyval = _field.getValue()==""?"%":_field.getValue();
								var _roleds = this.grid.getStore();
								_roleds.baseParams.params = "rolename like '%"+keyval+"%'";
								_roleds.load();
							}
						}
					}
				}),'->',{
					text : '设置角色权限',
					iconCls: 'icon-role-tree',
					scope: _grid.getSelectionModel(),
					handler : function(){
						var _sm = this;
						treePanel.expand();
					}
				}, '-' , {
					text : '设置角色Portal',
					iconCls: 'icon-detail-form',
					hidden:true,
					scope: _grid.getSelectionModel(),
					handler : function(){
					 	var _sm = this;
						portalConfig(_sm);
					}
				})
			
			}
		}
	});
    /* portlet config */

	var portalFC = {
		'configId' : {
			name : 'configId',
			fieldLabel : 'configId',
			anchor : '95%',
			readOnly : true,
			hidden : true,
			hideLabel : true
		},
		'userId' : {
			name : 'userId',
			fieldLabel : 'userId',
			anchor : '95%',
			readOnly : true,
			hidden : true,
			hideLabel : true
		},
		'portletId' : {
			name : 'portletId',
			fieldLabel : 'Portlet',
			allowBlank : false,
			anchor : '95%'
		},
		'portletName' : {
			name : 'portletName',
			fieldLabel : 'portletName',
			allowBlank : false,
			anchor : '95%'
		},
		'colIdx' : {
			name : 'colIdx',
			fieldLabel : '列',
			allowNegative : false,
			maxValue : 3,
			allowDecimals : false,
			anchor : '95%'
		},
		'rowIdx' : {
			name : 'rowIdx',
			fieldLabel : '行',
			allowNegative : false,
			maxValue : 10,
			allowDecimals : false,
			anchor : '95%'
		},
		'ph' : {
			name : 'ph',
			fieldLabel : '高度',
			allowNegative : false,
			maxValue : 1000,
			allowDecimals : false,
			anchor : '95%'
		},
		'show' : {
			name : 'show',
			fieldLabel : '是否显示',
			anchor : '95%'
		}
	}

	var portalColumns = [{
		name : 'configId',
		type : 'string'
	},{
		name : 'userId',
		type : 'string'
	}, {
		name : 'portletId',
		type : 'string'
	}, {
		name : 'portletName',
		type : 'string'
	}, {
		name : 'colIdx',
		type : 'int'
	}, {
		name : 'rowIdx',
		type : 'int'
	}, {
		name : 'ph',
		type : 'int'
	}, {
		name : 'show',
		type : 'bool'
	}];
	var checkColumn = new Ext.grid.CheckColumn({
		id: 'show',
		header : portalFC['show'].fieldLabel,
		dataIndex : portalFC['show'].name,
		width: 90
	})
	var portalSM = new Ext.grid.CheckboxSelectionModel()

	var portalCM = new Ext.grid.ColumnModel([portalSM, {
		id : 'configId',
		header : portalFC['configId'].fieldLabel,
		dataIndex : portalFC['configId'].name,
		hidden : true,
		width : 200
	}, {
		id : 'userId',
		header : portalFC['userId'].fieldLabel,
		dataIndex : portalFC['userId'].name,
		hidden : true,
		width : 200
	}, {
		id : 'portletId',
		header : portalFC['portletId'].fieldLabel,
		dataIndex : portalFC['portletId'].name,
		hidden : true,
		width : 200
	}, {
		id : 'portletName',
		header : portalFC['portletName'].fieldLabel,
		dataIndex : portalFC['portletName'].name,
		width : 100,
		readOnly : true
	}, {
		id : 'colIdx',
		align : 'right',
		header : portalFC['colIdx'].fieldLabel,
		dataIndex : portalFC['colIdx'].name,
		width : 60,
		editor : new Ext.form.NumberField(portalFC['colIdx'])
	}, {
		id : 'rowIdx',
		align : 'right',
		header : portalFC['rowIdx'].fieldLabel,
		dataIndex : portalFC['rowIdx'].name,
		width : 60,
		editor : new Ext.form.NumberField(portalFC['rowIdx'])
	}, {
		id : 'ph',
		align : 'right',
		header : portalFC['ph'].fieldLabel,
		dataIndex : portalFC['ph'].name,
		width : 60,
		editor : new Ext.form.NumberField(portalFC['ph'])
	},checkColumn])
	portalCM.defaultSortable = true;

	var portalDS = new Ext.data.Store({
		baseParams : {
			roleid : "",
			ac : "getRolePortletConfig"
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : SYS_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'rows',
			totalProperty : 'results',
			id : "configId"
		}, portalColumns),
		remoteSort : true,
		pruneModifiedRecords : true
	});

	portletConfigPanel = new Ext.grid.EditorGridTbarPanel({
		id : 'portlet-config-panel',
		ds : portalDS,
		cm : portalCM,
		sm : portalSM,
		tbar : [],
		title : false,
		iconCls : 'icon-by-category',
		border : false,
		region : 'center',
		clicksToEdit : 1,
		plugins: checkColumn,
		header : false,
		autoScroll : true,
		loadMask : true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		servletUrl : MAIN_SERVLET,
		bean : "com.sgepit.frame.sysman.hbm.SysPortletConfig",
		addBtn: false,
		delBtn: false,
		business : "systemMgm",
		primaryKey : "configId",
		saveMethod : 'updatePortletConfig'
	});
	
	unitTree = new Ext.tree.TreePanel({
    	region:'west',
    	xtype:'treepanel',
    	width:200,
    	minSize: 199,
        maxSize: 201,
    	margins : '5 0 5 5',
    	split:true,
    	tbar: [],
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
		collapsed: false,
        collapsible: true,
		loader : new Ext.tree.TreeLoader({
			dataUrl: CONTEXT_PATH + "/servlet/SysServlet",
			requestMethod: "GET",
			baseParams:{
				parentId:(USERBELONGUNITTYPEID=="0"||USERBELONGUNITTYPEID=="1"?defaultOrgRootID:USERBELONGUNITID),
				ac:"buildingUnitTree",
				async:true,
				ifcheck:false,
				ignore:false,
				baseWhere:"unitTypeId<>'8' and unitTypeId<>'9'"
			}
		}),
		root : new Ext.tree.AsyncTreeNode({
//	       id  : (USERBELONGUNITTYPEID=="0"||USERBELONGUNITTYPEID=="1"?defaultOrgRootID:USERBELONGUNITID),
//	       text: (USERBELONGUNITTYPEID=="0"||USERBELONGUNITTYPEID=="1"?defaultOrgRootName:USERBELONGUNITNAME),
			id: defaultOrgRootID,
			text: MODULE_ROOT_NAME,
			expanded:true
	    }),
	    listeners:{
	    	beforeload:function(node){
				node.getOwnerTree().loader.baseParams.parentId = node.id; 
			},
			render:function(tree){
				tree.getTopToolbar().add({
		        	iconCls: 'icon-expand-all',tooltip: '全部展开',scope:tree,
		            handler: function(){ this.root.expand(true); }
		        }, '-', {
		            iconCls: 'icon-collapse-all',tooltip: '全部折叠',scope:tree,
		            handler: function(){ this.root.collapse(true); }
		        }, '->',{
		        	iconCls:'option',
		        	text:'功能模块',scope:tree,
		        	handler:function(){
		        		var selNode =  this.getSelectionModel().getSelectedNode();
		        		
		        		if(selNode){
			        		if(!rockWindow)	rockWindow = new RockPowerTree({unitid:selNode.id});
		        			rockWindow.show(selNode.id);
		        		}else{
		        			Ext.example.msg('提示','请先选择需要定义的单位！');
		        		}
		        	}
		        });
			},
			click : function(node,ev){
				ev.preventDefault();
				treePanel.loader.baseParams.unitid = node.id;
				//过滤角色grid
				gridPanel.getStore().baseParams.params = "unitId='"+node.id+"' and unitId<>'UNITROLE'";
				gridPanel.getStore().load({params:{start:0,limit:PAGE_SIZE}});
			}
	    }
    });
	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[unitTree, gridPanel, treePanel],
        listeners:{
        	afterlayout:function(){
        		if(unitTree.getSelectionModel().getSelectedNode()==null){
	        		unitTree.root.select();
        		}
        		var node = unitTree.getSelectionModel().getSelectedNode();
        		if(node){
        			roleDS.baseParams.params = "unitId='"+node.id+"'";
				    roleDS.load({
				    	params:{
					    	start: 0,			//起始序号
					    	limit: PAGE_SIZE		//结束序号，若不分页可不用设置这两个参数
				    	}
				    });
        		}
        	}
        }
    });	

    function saveRolemod(){
    	var obj = deepConcat(treePanel.root)
    	if ( obj.length <=0 || selectedRoleId == "")
    		return
        
        var dataArr = '[' + obj.join(',') + ']';
    	//return
		Ext.Ajax.request({
			waitMsg: 'Saving changes...',
			url: SYS_SERVLET,
			params: {ac: "saverolemod", roleid: selectedRoleId},
	   		method: "POST",
			xmlData: dataArr,
	   		success: function(response, params) {
	   			var rspXml = response.responseXML
	   			var sa = rspXml.documentElement.getElementsByTagName("done").item(0).firstChild.nodeValue;
	   			var msg = rspXml.documentElement.getElementsByTagName("msg").item(0).firstChild.nodeValue;
	   			if(msg == "ok"){
	   				Ext.example.msg('保存成功！', '您成功保存了角色：{0} 的权限信息！', selectedRoleName);
	   			}
	   			else
	   			{
	   				var stackTrace = rspXml.documentElement.getElementsByTagName("stackTrace").item(0).firstChild.nodeValue;
	   				var str = '第 ' + (sa*1+1) + ' 条记录保存出错！<br>失败原因：' + msg;
	   				str += (sa*1>0) ? '<br>本次操作保存成功 ' + sa +  ' 条记录。' : "";

			        Ext.MessageBox.show({
			           title: '保存失败！',
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
	
	function deepConcat(node){
		var arr = new Array();
    	var len = node.childNodes.length;
    	for(var i=0; i<len; i++){
    		var child = node.childNodes[i]
    		var elNode = child.getUI().elNode;
			var lvl = elNode.querySelector("#lvlColumn").innerText
			if (lvl*1 < 4) {
				var id = elNode.querySelector("#idColumn").innerText
				var a = new Object();
				a.rolepk = selectedRoleId;
				a.powerpk = id;
				a.lvl = lvl;
				arr.push(Ext.encode(a))
				arr = arr.concat(deepConcat(child))
			}
    	}
    	return arr	
	}
});

function deepCheck(node, id, checked){
	for(var i=0; i<node.childNodes.length; i++) {		
		var child = node.childNodes[i];
		var elNode = child.getUI().elNode;
		var chx = elNode.querySelector("#"+id)
		checkerClick(chx, checked)
		deepCheck(child, id, checked)
	}
}
function checkerClick(chx, flag){
	var id = chx.id
	if (id == "readChecker") {
		readChxClick(chx, flag);
	} else if (id == "writeChecker") {
		writeChxClick(chx, flag);
	} else if (id == "controlChecker") {
		controlChxClick(chx, flag);
	}	
}

function readChxClick(obj, flag){
	var checked = obj.className == cssCheckOn
	var c = obj.parentElement.parentElement.nextSibling.children[0].children[0]
	var n = obj.parentElement.parentElement.parentElement.querySelector("#lvlColumn")
	if (typeof(flag)=="undefined") {
		obj.className = checked ? cssCheckOff : cssCheckOn
		if (checked) {
			c.className = cssCheckOff
			n.innerText = 4
		} else {
			n.innerText = 3
		}
	} else {
		if (flag != checked) {
			obj.className = flag ? cssCheckOn : cssCheckOff
			if (!flag) {
				c.className = cssCheckOff
				n.innerText = 4
			} else {
				n.innerText = 3
			}
		}
	}
	
}

function writeChxClick(obj, flag){
	var checked = obj.className == cssCheckOn
	var r = obj.parentElement.parentElement.previousSibling.children[0].children[0]
	var c = obj.parentElement.parentElement.nextSibling.children[0].children[0]
	var n = obj.parentElement.parentElement.parentElement.querySelector("#lvlColumn")
	if (typeof(flag)=="undefined") {
		obj.className = checked ? cssCheckOff : cssCheckOn
		if (checked) {
			c.className = cssCheckOff
			n.innerText = 3
		} else {
			r.className = cssCheckOn
			n.innerText = 2
		}
	} else {
		if (flag != checked) {
			obj.className = flag ? cssCheckOn : cssCheckOff
			if (flag) {
				r.className = cssCheckOn
				n.innerText = 2
			} else {
				c.className = cssCheckOff
				n.innerText = 3
			}
		}
	}
}

function controlChxClick(obj, flag){
	var checked = obj.className == cssCheckOn
	var r = obj.parentElement.parentElement.previousSibling.children[0].children[0]
	var n = obj.parentElement.parentElement.parentElement.querySelector("#lvlColumn")
	if (typeof(flag)=="undefined") {
		obj.className = checked ? cssCheckOff : cssCheckOn
		if (!checked) {
			r.className = cssCheckOn
			n.innerText = 1
		} else {
			if (r.className == cssCheckOn) {
				n.innerText = 3
			}
		}
	} else {
		if (flag != checked) {
			obj.className = flag ? cssCheckOn : cssCheckOff
			if (flag) {
				r.className = cssCheckOn
				n.innerText = 1
			} else {
				if (r.className == cssCheckOn) {
					n.innerText = 3
				}
			}
		}
	}
}

function portalConfig(sm){
   	var record = sm.getSelected();
   	if (record != null) {
		if (!configWindow){
			configWindow = new Ext.Window({
				title: '角色Portal设置', iconCls: 'icon-sys-config',
				closeAction: 'hide', modal: true, plain: true, 
				closable: true, border: true, maximizable: true,
				width: 460, height: 300,layout: 'fit',
				items:[
					portletConfigPanel
				]
			});
			configWindow.show();
		} else {
			configWindow.show();
		}
		portletConfigPanel.getStore().baseParams.roleid = record.get("rolepk");
		portletConfigPanel.getStore().load();
	}
}
var RockPowerTree = Ext.extend(Ext.Window ,{
	title:"功能模块",
	width:371,
	height:550,
	layout:'fit',
	closeAction :'hide',
	resizable :false,
	modal:true,
	initComponent: function(){
		var treewin = this;
		var columntree = new Ext.tree.ColumnTree({
	    	rootVisible: false,
		    lines:true,
		    autoScroll:true,
		    animCollapse:false,
		    animate: false,
		    checkModel:"cascade",
		    tbar:[],
		    unitArray:[],
			columns:[{
		        header:'模块名称',
		        width:340,
		        dataIndex:'text'
		    }],    
		    loader: new Ext.tree.TreeLoader({
				url: SYS_SERVLET,
				baseParams:{
					 ac:"buildingRockPowerTree",
					 columnTree:true,
					 ifcheck:true,
					 async:false,
					 type:'getUnitPower',
					 unitid:''
				},
				clearOnLoad : true,
				uiProviders:{
				    'col': Ext.tree.ColumnNodeUI
				}
			}),
		    root: new Ext.tree.AsyncTreeNode({text:'root',id:'0',expanded:true,leaf:false,checked:false}),
		    listeners:{
				beforeload:function(node){
					node.getOwnerTree().loader.baseParams.parentId = node.id; 
				},
				render:function(ctree){
					ctree.getTopToolbar().add({
			            iconCls: 'icon-expand-all',
						tooltip: 'Expand All',
			            handler: function(){ ctree.root.expand(true); }
			        }, '-', {
			            iconCls: 'icon-collapse-all',
			            tooltip: 'Collapse All',
			            handler: function(){ ctree.root.collapse(true); }
			        }, '->', {
				    	id: 'save',
				    	text: '保存',
				        tooltip: '保存',
				        iconCls:'save',
				        handler: function(){
				       		ctree.root.expand(true);
				        	var nodesArr = ctree.getChecked();
				        	var unitid = ctree.unitid;
				        	var ppks = new Array();
				        	if(nodesArr.length>0){
				        		for(var i=0,j=nodesArr.length;i<j;i++){
				        			ppks.push(nodesArr[i].id)
				        		}
				        		systemMgm.saveUnitRockPower((ppks.join("`")),unitid,function(flag){
				        			if(flag!="1"){
										Ext.example.msg('提示','操作失败！');				        				
				        			}else{
				        				treewin.hide();
				        			}
				        		})
				        	}
						}
			        })
				}
		    }
	    });
		this.items = columntree;
		RockPowerTree.superclass.initComponent.call(this);
	},
	show:function(unitid,animateTarget, cb, scope){
		if(unitid!=undefined){
			var root = this.items.get(0).root
			this.items.get(0).unitid = unitid;
			this.items.get(0).loader.baseParams.unitids = unitid
			root.reload(function(){
				if(root.hasChildNodes()){
					root.childNodes[0].expand(false,false,null)
				}
			});
			
			RockPowerTree.superclass.show.call(this);
		};
	}
});
