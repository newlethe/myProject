var treePanel, gridPanel, selectWin;//
var orgTypeSt,stateSt;//SimpleStroe
var primaryKey = "id";
var propertyName = "upunit";
var propertyValue = defaultParentId;
var SPLITB = "`";
//
var OrgProperties = new Array(), stateArr = new Array(), unitModule = new Array();
var treeNodeUrl = CONTEXT_PATH + "/servlet/SysServlet";
var selectedUnitNode;
var dsB;//

Ext.onReady(function (){
	//////////SimpleStroe初始化////////////////
	DWREngine.setAsync(false);	
	systemMgm.getCodeValue("组织机构类型", function(list){
		for(var i = 0; i < list.length; i++) {
			if(list[i].propertyCode=='A') continue;
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			OrgProperties.push(temp);
		}

		orgTypeSt = new Ext.data.SimpleStore({
			fields: ['k','v'],   
			data: OrgProperties
		});
	});	
	systemMgm.getCodeValue("使用状态", function(list){
		for(var i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);
			temp.push(list[i].propertyName);
			stateArr.push(temp);
		}
		stateSt = new Ext.data.SimpleStore({
			fields: ['val','text'],   
			data: stateArr
		});
	});		
    DWREngine.setAsync(true);
	/////////////////////////////////////////////////////
	
	/////////组织机构树//////////////////////
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
		loader : new Ext.tree.TreeLoader({
			dataUrl: treeNodeUrl,
			baseParams:{
				parentId:defaultParentId,
				ac:"buildingUnitTree",
				async:true,
				ifcheck:false,
				ignore:false
			},
			requestMethod: "GET"
		}),
		root : new Ext.tree.AsyncTreeNode({
	       text: MODULE_ROOT_NAME,
	       id: defaultParentId
	    }),
		collapseFirst : false,
		listeners:{
			beforeload:function(node){
				node.getOwnerTree().loader.baseParams.parentId = node.id; 
			},
			click:function(node, e){
				e.stopEvent();
				PlantInt.upunit = node.id;
				var titles = [node.text];
				var obj = node.parentNode;
				while(obj!=null){
					titles.push(obj.text);
					obj = obj.parentNode;
				}
				//集团公司及集团总部用户,具有编辑权限的用户
				if(USERBELONGUNITTYPEID=='0'||USERBELONGUNITTYPEID=='1'||
					node.attributes.modifyauth!==false){
					var title = titles.reverse().join(" / ");
					gridPanel.setTitle(title);    	
		    		unitDS.baseParams.params = propertyName+SPLITB+node.id;
					unitDS.load({params:{start: 0,limit: PAGE_SIZE}});	
				}else{
		    		unitDS.removeAll();
				}
				
				var selNode = node;
				selectedUnitNode = node;
				if(selNode){
					if(selNode.id==defaultParentId||userBelongUnitType.indexOf(selNode.attributes.unitTypeId)>-1){
		    			selectedUnitNode = selNode;
		    		}else{
			    		selNode.bubble(function(n){
			    			if(n.id==defaultParentId||userBelongUnitType.indexOf(n.attributes.unitTypeId)>-1){
				    			selectedUnitNode = n;
				    			return false;
			    			}
			    		});
		    		}
			    }
//				if(DEPLOY_UNITTYPE&&DEPLOY_UNITTYPE=="S"){//如果是系统不属于多项目系统，而是独立的项目系统，能维护项目单位下的组织机构信息
//					gridPanel.getTopToolbar().enable();
//				}else{
//					//在项目单位系统中，只能修改三级单位和项目单位的下级组织机构信息；
//					if(DEPLOY_UNITTYPE && DEPLOY_UNITTYPE=="A") {
//						if (selectedUnitNode.attributes.unitTypeId=="A"||selectedUnitNode.attributes.unitTypeId=="3") {
//							gridPanel.getTopToolbar().enable();
//						} else {
//							gridPanel.getTopToolbar().disable();
//						}
//					} else if(DEPLOY_UNITTYPE&&DEPLOY_UNITTYPE=="0" && node.attributes.unitTypeId=="A") {
//						//如果是集团系统，且属于多项目系统，不能维护项目单位下的组织机构信息
//						gridPanel.getTopToolbar().disable();
//						
//					} else {
//						gridPanel.getTopToolbar().enable();
//					}
//				}
			}
		}
	});
	////////////////////////////////
	
	
	/////////////grid///////////////////
    var fc = {		// 创建编辑域配置
    	'id': {
			name: 'id',
			fieldLabel: '主键',
			anchor:'95%',
			hidden:true,
			hideLabel:true
        },'unitid': {
			name: 'unitid',
			fieldLabel: '机构代码',
			allowBlank: false,
			anchor:'95%'
        }, 'unitname': {
			name: 'unitname',
			fieldLabel: '机构名称',
			allowBlank: false
		}, 'upunit': {
			name: 'upunit',
			fieldLabel: '上级机构ID',
			readOnly:true,
			allowBlank: false,
			hidden:true,
			anchor:'95%'
		}, 'unitTypeId': {
			name: 'unitTypeId',
			fieldLabel: '机构类型',
			valueField: 'k', 
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            store: orgTypeSt,
            lazyRender:true,
            listClass: 'x-combo-list-small',
			anchor:'95%'
		}, 'viewOrderNum': {
			name: 'viewOrderNum',
			fieldLabel: '行政级别',
            allowNegative: false,
            maxValue: 1000,
            allowDecimals: false,
			allowBlank: false,
			anchor:'95%'
        }, 'leaf': {
			name: 'leaf',
			fieldLabel: '是否包含下级机构',
			anchor:'95%'
		}, 'startYear': {
			name: 'startYear',
			fieldLabel: '起始年度',
			anchor:'95%'
		}, 'endYear': {
			name: 'endYear',
			fieldLabel: '失效年度',
			anchor:'95%'
		}, 'state': {
			name: 'state',
			fieldLabel: '使用状态',
			allowBlank : false,
			emptyText : '请选择...',
			valueField: 'val',
			displayField: 'text',
			mode: 'local',
	        typeAhead: true,
	        triggerAction: 'all',
	        store: stateSt,
	        lazyRender: true,
	        listClass: 'x-combo-list-small',
	        editable :false,
			anchor: '95%'
		}, 'appUrl': {
			name: 'appUrl',
			fieldLabel: '远程地址',
			anchor:'95%'
		}
	};
	
    var Columns = [
    	{name: 'id', type: 'string'},			//Grid显示的列，必须包括主键(可隐藏)
    	{name: 'unitid', type: 'string'},		
		{name: 'unitname', type: 'string'},
		{name: 'upunit', type: 'string'},    	
		{name: 'unitTypeId', type: 'string'},
    	{name: 'viewOrderNum', type: 'int'},
		{name: 'leaf', type: 'int'},
		{name: 'startYear', type: 'string'},
		{name: 'endYear', type: 'string'},
		{name: 'state', type: 'string'},
		{name: 'appUrl', type: 'string'}];
	var Fields = Columns;
    var Plant = Ext.data.Record.create(Columns);
    var PlantInt = {
    	unitid:'',
    	unitname: '', 
    	upunit: defaultParentId,
    	unitTypeId: '',
    	viewOrderNum: 10,
    	leaf:1,
    	startYear:'',
    	endYear:'',
    	state:'1'
    };
    var unitSM =  new Ext.grid.CheckboxSelectionModel();
    var unitCM = new Ext.grid.ColumnModel([		// 创建列模型
    	unitSM, {
           id:'id',
           header: fc['id'].fieldLabel,
           dataIndex: fc['id'].name,
           width: 0,
           hidden:true,hideable:false
        }, {
           id:'unitid',
           header: fc['unitid'].fieldLabel,
           dataIndex: fc['unitid'].name,
           width: 100,
           editor: new Ext.form.TextField(fc['unitid'])
        }, {
           id:'upunit',
           header: fc['upunit'].fieldLabel,
           dataIndex: fc['upunit'].name,
           width: 0,
           hidden:true,hideable:false
        }, {
           id:'unitname',
           header: fc['unitname'].fieldLabel,
           dataIndex: fc['unitname'].name,
           width: 200,
           editor: new Ext.form.TextField(fc['unitname'])
        }, {
           id:'unitTypeId',
           header: fc['unitTypeId'].fieldLabel,
           dataIndex: fc['unitTypeId'].name,
           width: 80,
  			renderer: function(value){
           	 for(var i=0; i<OrgProperties.length; i++){
           	 	if(value=="A") return '项目单位';
           	 	if (value == OrgProperties[i][0])
           	 		return OrgProperties[i][1]
           	 }
           },
           editor: new Ext.form.ComboBox(fc['unitTypeId'])
        }, {
           id:'state',
           header: fc['state'].fieldLabel,
           dataIndex: fc['state'].name,
           width: 80,
           renderer: function(value){
           	 for(var i=0; i<stateArr.length; i++){
           	 	if (value == stateArr[i][0])
           	 		return stateArr[i][1]
           	 }
           },
           editor: new Ext.form.ComboBox(fc['state'])
        }, {
           id:'startYear',
           header: fc['startYear'].fieldLabel,
           dataIndex: fc['startYear'].name,
           width: 0,
           hidden: true,hideable:false,
		   editor: new Ext.form.TextField(fc['startYear'])
        }, {
           id:'endYear',
           header: fc['endYear'].fieldLabel,
           dataIndex: fc['endYear'].name,
           width: 0,
           hidden: true,hideable:false,
		   editor: new Ext.form.TextField(fc['endYear'])
        }, {
           id:'viewOrderNum',
           align: 'right',
           header: fc['viewOrderNum'].fieldLabel,
           dataIndex: fc['viewOrderNum'].name,
           width: 60,
           editor: new Ext.form.NumberField(fc['viewOrderNum'])
        }, {
           id:'leaf',
           header: fc['leaf'].fieldLabel,
           dataIndex: fc['leaf'].name,
           width: 0,
           hidden: true,hideable:false,
           align: 'center',
           renderer: function(value){
              return value ? '否' : '是';
		   }
        },{
           id:'appUrl',
           header: fc['appUrl'].fieldLabel,
           dataIndex: fc['appUrl'].name,
           width: 0,
           hidden: true,hideable:false,
           align: 'left',
           tooltip:'如果没有远程地址则可以不填写',
           renderer:function(v){
           		return "<font color='blue'><b>"+(v||"")+"</b></font>"
           },
           editor: new Ext.form.TextField(fc['appUrl'])
        }
	]);
    unitCM.defaultSortable = true;						//设置是否可排序

    var unitDS = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: "com.sgepit.frame.sysman.hbm.SgccIniUnit",				
	    	business: "systemMgm",
	    	method: "findByProperty",
	    	params: propertyName+SPLITB+propertyValue
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
        remoteSort: false,
        pruneModifiedRecords: false	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    unitDS.setDefaultSort('viewOrderNum', 'asc');	//设置默认排序列

	gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'org-grid-panel',			//id,可选
        ds: unitDS,						//数据源
        cm: unitCM,						//列模型
        sm: unitSM,						//行选择模式
        tbar: [],					//顶部工具栏，可选
        title: defaultParentName,		//面板标题
        border: false,				// 
        region: 'center',
        clicksToEdit: 1,			//单元格单击进入编辑状态,1单击，2双击
        header: false,				//
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
//        autoExpandColumn: 'unitname',		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
		viewConfig:{
			forceFit: true,
			ignoreAdd: false
		},
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: unitDS,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: "com.sgepit.frame.sysman.hbm.SgccIniUnit",					
      	business: "systemMgm",	
      	primaryKey: primaryKey,
      	getOrgTree:function(){
      		return Ext.getCmp("orgs-tree");
      	},
      	getSelectNode:function(){
      		var _tree = this.getOrgTree();
      		if(_tree){
      			return _tree.getSelectionModel().getSelectedNode();
      		}else{
      			return null;
      		}
      	},
      	insertHandler: function(){
			var selNode = this.getSelectNode();
			if(selNode){
				if(USERBELONGUNITTYPEID=="0"||USERBELONGUNITTYPEID=="1"){//集团公司及集团总部用户
					this.defaultInsertHandler();
				}else if(selNode.attributes.modifyauth!==false){
					this.defaultInsertHandler();
				}else{
					Ext.example.msg('提示','权限不足,只能对本公司下的单位进行维护!');
				}
			}
      	},
		insertMethod: 'insertOrg',
		saveMethod: 'updateOrg',
		deleteMethod: 'deleteOrg',
		reloadTree:function(_grid){
			var selNode = this.getSelectNode();
			if(selNode){
				var path = selNode.getPath();
				if(selNode.parentNode){
					selNode.parentNode.reload();
				}else{
					selNode.reload()	
				}
				var tree = this.getOrgTree();
				tree.expandPath(path,null,function(){
					 tree.getNodeById(selNode.id).select();
				})
			}
		},
		listeners:{
			aftersave:function(grid, idsOfInsert, idsOfUpdate, primaryKey,  bean){
				this.reloadTree()
				reportUnitData()
			},
			afterdelete:function(grid,ids,  primaryKey,  bean){
				this.reloadTree()
				reportUnitData()
			},
			beforeedit:function(o){
				if(o.field=="unitTypeId"&&o.record.get("unitTypeId")==="A"){
					//return false;
				}
			},
			rowcontextmenu : function(grid,rowIndex,e){
				e.preventDefault();
				grid.getSelectionModel().selectRow(rowIndex,false);
				var menu = new Ext.menu.Menu({
					items:[{
						text:'发送数据'
					}]
				})
				menu.showAt(e.getXY());
			}
		}
	});
	///////////////////////////////////////////
	/** ***************************************************************************** */
	var fcB = {
		'powerpk' : {
			name : 'powerpk',
			fieldLabel : '主键',
			hideLabel : true
		},
		'powername' : {
			name : 'powername',
			fieldLabel : '模块名称',
			anchor : '95%'
		}
	}
	var gbtn = new Ext.Button({
				iconCls : 'option',
				text : '功能模块',
				handler : function() {
					var selrecord = gridPanel.getSelectionModel().getSelections();
					if (selrecord.length>0) {
						if (selrecord.length == 1) {
							if (selrecord[0].get('unitTypeId') == 'A') {
								DWREngine.setAsync(false);
								pcPrjService
										.getSgccUnitModuleByUnitid(
												"com.sgepit.pcmis.zhxx.hbm.SgccUnitModule",
												"unitid", selrecord[0].get('unitid'),
												function(data) {
													unitModule = [];
													for (var i = 0; i < data.length; i++) {
														var temp = new Array();
														temp.push(data[i].uids);
														temp
																.push(data[i].powerpk);
														unitModule.push(temp);
													}
												})
								DWREngine.setAsync(true);
								dsB.load();
								selectWin.show();
							}else{
								Ext.example.msg('提示', '只能对项目单位进行设置');
							}
						}else{
							Ext.example.msg('提示', '只能选择一个单位进行设置');
						}
					} else {
						Ext.example.msg('提示', '请先选择需要定义的单位！');
					}
				}
			});
	var ColumnsB = [{
				name : 'powerpk',
				type : 'string'
			}, {
				name : 'powername',
				type : 'string'
			}]
	var smB = new Ext.grid.CheckboxSelectionModel();
	var cmB = new Ext.grid.ColumnModel([smB, {
				id : 'powerpk',
				header : fcB['powerpk'].fieldLabel,
				dataIndex : fcB['powerpk'].name,
				hidden : true
			}, {
				id : 'powername',
				header : fcB['powername'].fieldLabel,
				dataIndex : fcB['powername'].name
			}]);
	cmB.defaultSortable = true;

	dsB = new Ext.data.Store({
				baseParams : {
					ac : 'list', // 表示取列表
					bean : "com.sgepit.frame.sysman.hbm.RockPower",
					business : "baseMgm",
					method : "findWhereOrderby",
					params : "parentid='01' and url<>null and powername not in ('综合信息管理','批文管理','综合报表','竣工决算','流程管理')"
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : "powerpk"
						}, ColumnsB),
				remoteSort : true,
				pruneModifiedRecords : true
			});
	dsB.setDefaultSort("powerpk", 'desc');
	dsB.on('load', function(s, r, o) {
				var arr = [];
				var flag = false;
				for (var v = 0; v < r.length; v++) {
					for (var i = 0; i < unitModule.length; i++) {
						if (r[v].get('powerpk') == unitModule[i][1]) {
							flag = true;
							break;
						}
					}
					if (flag) {
						arr.push(r[v]);
						flag = false;
					}
				}
				smB.selectRecords(arr);
			});
	var gridPanelB = new Ext.grid.GridPanel({
				id : 'ff-gridB-panel',
				region : 'center',
				ds : dsB,
				cm : cmB,
				sm : smB,
				border : false,
				header : false,
				autoScroll : true, // 自动出现滚动条
				loadMask : true, // 加载时是否显示进度
				height : 240,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				}
			});
	selectWin = new Ext.Window({
				title : '选择模块(勾选，则该项目单位不会显示在勾选模块)',
				buttonAlign : 'center',
				layout : 'border',
				width : 350,
				height : 400,
				modal : true,
				closeAction : 'hide',
				constrain : true,
				maximizable : true,
				plain : true,
				items : [gridPanelB],
				buttons : [{
							id : 'btnSavfe',
							text : '确定选择',
							handler : confirmChoose
						}, {
							text : '取消',
							handler : function() {
								selectWin.hide();
							}
						}]
			});
	function confirmChoose() {
		var selectRows = gridPanelB.getSelectionModel().getSelections();
		var _record = gridPanel.getSelectionModel().getSelected();
		var obj = new Array();
		var unid = _record.get('unitid');
		for (var i = 0; i < selectRows.length; i++) {
			var temp = new Object();
			temp['unitid'] = _record.get('unitid');
			temp['powerpk'] = selectRows[i].get('powerpk');
			obj.push(temp);
		}
		DWREngine.setAsync(false);
		pcPrjService.addOrUpdateSgccUnitModule(obj, unid, function(flag) {
					if (flag == '0') {
						Ext.example.msg('提示', '保存失败');
					} else if (flag == '1') {
						Ext.example.msg('提示', '保存成功');
					}
				})
		DWREngine.setAsync(true);
		selectWin.hide();
		unitDS.load({
					params : {
						start : 0, // 起始序号
						limit : PAGE_SIZE
						// 结束序号，若不分页可不用设置这两个参数
					}
				});
	}
	/** *********************************************************************************** */
	
    var viewport = new Ext.Viewport({
        layout:'border',
        items:[ treePanel, gridPanel ],
        listeners:{
        	afterlayout:function(){
        		treePanel.root.expand();	
				treePanel.root.select();
				if(USERBELONGUNITTYPEID=='0'||USERBELONGUNITTYPEID=='1'||USERBELONGUNITTYPEID=='2'){
					unitDS.load({
						params : {
							start : 0, // 起始序号
							limit : PAGE_SIZE
							// 结束序号，若不分页可不用设置这两个参数
						}
					});
				}
        	}
        }
    });	
    // gbtn
//	gridPanel.getTopToolbar().add(gbtn);
//	if(DEPLOY_UNITTYPE&&DEPLOY_UNITTYPE=="S"){//如果是系统不属于多项目系统，能维护项目单位下的组织机构信息
//		gridPanel.getTopToolbar().enable();
//	}else if(DEPLOY_UNITTYPE=="A") {
//	    gridPanel.getTopToolbar().disable();
//	}
});
function reportUnitData(){
	try{
		if(DEPLOY_UNITTYPE&&DEPLOY_UNITTYPE=="A"){//当前系统部署到项目单位是才将该项目的组织机构报送到集团公司(采用及时报送的方式)
			if(selectedUnitNode && (selectedUnitNode.attributes.unitTypeId=="A" || selectedUnitNode.attributes.unitTypeId=="3")){
				systemMgm.unitDataExchange(selectedUnitNode.id, function(){			
				})					
			}
		} else if (DEPLOY_UNITTYPE&&DEPLOY_UNITTYPE=="0") {	//如果是当前系统部署到集团公司，将组织机构的信息报送到各个项目单位（实时报送）
			systemMgm.unitDataExchange("", function(){});
		}
	}catch(e){}
}