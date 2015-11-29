var treePanel, gridPanel;
var orgTypeSt, stateSt; //SimpleStroe
var primaryKey = "id";
var propertyName = "upunit";
var propertyValue = defaultParentId//defaultParentId;
var SPLITB = "`";
var OrgProperties = new Array(),
    stateArr = new Array();
var treeNodeUrl = CONTEXT_PATH + "/servlet/SysServlet";
if (EDIT == 'false') {
    ModuleLVL = 4;
}
//var name = '山西国金电力有限公司'; 
Ext.onReady(function () {
    //////////SimpleStroe初始化////////////////
    DWREngine.setAsync(false);
    systemMgm.getCodeValue("组织机构类型", function (list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i].propertyCode);
            temp.push(list[i].propertyName);
            OrgProperties.push(temp);
        }

        orgTypeSt = new Ext.data.SimpleStore({
            fields: ['k', 'v'],
            data: OrgProperties
        });
    });
    systemMgm.getCodeValue("使用状态", function (list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i].propertyCode);
            temp.push(list[i].propertyName);
            stateArr.push(temp);
        }
        stateSt = new Ext.data.SimpleStore({
            fields: ['val', 'text'],
            data: stateArr
        });
    });
    DWREngine.setAsync(true);
    /////////////////////////////////////////////////////
    /////////组织机构树//////////////////////
    treePanel = new Ext.tree.TreePanel({
        id: 'orgs-tree',
        region: 'west',
        split: true,
        width: 196,
        minSize: 175,
        maxSize: 500,
        frame: false,
        tbar: [{
            iconCls: 'icon-expand-all',
            tooltip: '全部展开',
            handler: function () {
                treePanel.root.expand(true);
            }
        }, '-',
        {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function () {
                treePanel.root.collapse(true);
            }
        }],
        collapsible: true,
        enableDD: true,
        margins: '5 0 5 5',
        cmargins: '0 0 0 0',
        rootVisible: true,
        lines: false,
        autoScroll: true,
        animCollapse: false,
        animate: false,
        collapseMode: 'mini',
        loader: new Ext.tree.TreeLoader({
            dataUrl: treeNodeUrl,
            baseParams: {
                parentId: defaultParentId,
                ac: "buildingUnitTree",
                async: true,
                ifcheck: false,
                ignore: false
            },
            requestMethod: "GET"
        }),
        root: new Ext.tree.AsyncTreeNode({
            text: defaultParentName,
            id: defaultParentId
        }),
        collapseFirst: false,
        listeners: {
        	beforechildrenrendered: function(node) {
        		if(unitids!=null && unitids.length>0)
        		{
	        		if(node.attributes.leaf=='0'||node.attributes.leaf==0||node.id==defaultParentId){
	                	node.eachChild(function(child){
	                		if(unitids.indexOf(child.attributes.unitid)!=-1){
	                			child.setText("<font color='red'>" + child.attributes.text +"</font>")
	                		}
	                	})
	                }
        		}
        	},
        	
            beforeload: function (node) {
                node.getOwnerTree().loader.baseParams.parentId = node.id;
            },
            
             click: function (node, e) {
                e.stopEvent();
                PlantInt.upunit = node.id;
                var titles = [node.text];
                var obj = node.parentNode;
                while (obj != null) {
                    titles.push(obj.text);
                    obj = obj.parentNode;
                }
                //集团公司及集团总部用户,具有编辑权限的用户
//                if (USERBELONGUNITTYPEID == '0' || USERBELONGUNITTYPEID == '1' || node.attributes.modifyauth == true) {
//                    var title = titles.reverse().join(" / ");
//                    gridPanel.setTitle(title);
//                    unitDS.baseParams.params = propertyName + SPLITB + node.id;
//                    unitDS.load({
//                        params: {
//                            start: 0,
//                            limit: PAGE_SIZE
//                        }
//                    });
//                } else {
//                    unitDS.removeAll();
//                }
                var title = titles.reverse().join(" / ");
                gridPanel.setTitle(title);
                unitDS.baseParams.params = propertyName + SPLITB + node.id;
                unitDS.load({params: { start: 0,limit: PAGE_SIZE }});
            }
        }
    });
    ////////////////////////////////

    /////////////grid///////////////////
    var fc = { // 创建编辑域配置
        'id': {
            name: 'id',
            fieldLabel: '主键',
            anchor: '95%',
            hidden: true,
            hideLabel: true
        },
        'unitid': {
            name: 'unitid',
            fieldLabel: '机构代码',
            allowBlank: false,
            anchor: '95%'
        },
        'unitname': {
            name: 'unitname',
            fieldLabel: '机构名称',
            allowBlank: false,
            anchor: '95%'
        },
        'upunit': {
            name: 'upunit',
            fieldLabel: '上级机构ID',
            readOnly: true,
            allowBlank: false,
            hidden: true,
            anchor: '95%'
        },
        'unitTypeId': {
            name: 'unitTypeId',
            fieldLabel: '机构类型',
            valueField: 'k',
            displayField: 'v',
            mode: 'local',
            typeAhead: true,
            allowBlank: false,
            triggerAction: 'all',
            store: orgTypeSt,
            lazyRender: true,
            listClass: 'x-combo-list-small',
            anchor: '95%'
        },
        'viewOrderNum': {
            name: 'viewOrderNum',
            fieldLabel: '显示顺序',
            allowNegative: false,
            maxValue: 1000,
            allowDecimals: false,
            allowBlank: false,
            anchor: '95%'
        },
        'leaf': {
            name: 'leaf',
            fieldLabel: '是否包含下级机构',
            anchor: '95%'
        },
        'startYear': {
            name: 'startYear',
            fieldLabel: '起始年度',
            anchor: '95%'
        },
        'endYear': {
            name: 'endYear',
            fieldLabel: '失效年度',
            anchor: '95%'
        },
        'state': {
            name: 'state',
            fieldLabel: '使用状态',
            allowBlank: false,
            emptyText: '请选择...',
            valueField: 'val',
            displayField: 'text',
            mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            store: stateSt,
            lazyRender: true,
            listClass: 'x-combo-list-small',
            editable: false,
            anchor: '95%'
        }
    };

    var Columns = [{
        name: 'id',
        type: 'string'
    }, //Grid显示的列，必须包括主键(可隐藏)
    {
        name: 'unitid',
        type: 'string'
    }, {
        name: 'unitname',
        type: 'string'
    }, {
        name: 'upunit',
        type: 'string'
    }, {
        name: 'unitTypeId',
        type: 'string'
    }, {
        name: 'viewOrderNum',
        type: 'int'
    }, {
        name: 'leaf',
        type: 'int'
    }, {
        name: 'startYear',
        type: 'string'
    }, {
        name: 'endYear',
        type: 'string'
    }, {
        name: 'state',
        type: 'string'
    }];
    var Fields = Columns;
    var Plant = Ext.data.Record.create(Columns);
    var PlantInt = {
        unitid: '',
        unitname: '',
        upunit: defaultParentId,
        unitTypeId: '',
        viewOrderNum: '',
        leaf: 1,
        startYear: '',
        endYear: '',
        state: '1'
    };
    var unitSM = new Ext.grid.CheckboxSelectionModel();
    var unitCM = new Ext.grid.ColumnModel([ // 创建列模型
    unitSM,
    {
        id: 'id',
        header: fc['id'].fieldLabel,
        dataIndex: fc['id'].name,
        hidden: true,
        width: 100
    }, {
        id: 'unitid',
        header: fc['unitid'].fieldLabel,
        dataIndex: fc['unitid'].name,
        width: 100,
        editor: EDIT?new Ext.form.TextField(fc['unitid']):null
    }, {
        id: 'upunit',
        header: fc['upunit'].fieldLabel,
        dataIndex: fc['upunit'].name,
        hidden: true,
        width: 200
    }, {
        id: 'unitname',
        header: fc['unitname'].fieldLabel,
        dataIndex: fc['unitname'].name,
        width: 100,
        editor: EDIT?new Ext.form.TextField(fc['unitname']):null
    }, {
        id: 'unitTypeId',
        header: fc['unitTypeId'].fieldLabel,
        dataIndex: fc['unitTypeId'].name,
        align: 'center',
        width: 80,
        renderer: function (value) {
            for (var i = 0; i < OrgProperties.length; i++) {
                if (value == OrgProperties[i][0]) return OrgProperties[i][1]
            }
        },
        editor: EDIT?new Ext.form.ComboBox(fc['unitTypeId']):null
    }, {
        id: 'state',
        header: fc['state'].fieldLabel,
        dataIndex: fc['state'].name,
        align: 'center',
        hidden: true,
        width: 80,
        renderer: function (value) {
            for (var i = 0; i < stateArr.length; i++) {
                if (value == stateArr[i][0]) return stateArr[i][1]
            }
        },
        editor: EDIT?new Ext.form.ComboBox(fc['state']):null
    }, {
        id: 'startYear',
        header: fc['startYear'].fieldLabel,
        dataIndex: fc['startYear'].name,
        align: 'center',
        hidden: true,
        width: 80,
        editor: EDIT?new Ext.form.TextField(fc['startYear']):null
    }, {
        id: 'endYear',
        header: fc['endYear'].fieldLabel,
        dataIndex: fc['endYear'].name,
        align: 'center',
        hidden: true,
        width: 80,
        editor: EDIT?new Ext.form.TextField(fc['endYear']):null
    }, {
        id: 'viewOrderNum',
        align: 'right',
        header: fc['viewOrderNum'].fieldLabel,
        dataIndex: fc['viewOrderNum'].name,
        width: 60,
        editor: EDIT?new Ext.form.NumberField(fc['viewOrderNum']):null
    }, {
        id: 'leaf',
        header: fc['leaf'].fieldLabel,
        dataIndex: fc['leaf'].name,
        width: 80,
        align: 'center',
        renderer: function (value) {
            return value ? '否' : '是';
        }
    }]);
    unitCM.defaultSortable = true; //设置是否可排序
    var unitDS = new Ext.data.Store({
        baseParams: {
            ac: 'list',
            //表示取列表
            bean: "com.sgepit.frame.sysman.hbm.SgccIniUnit",
            business: "systemMgm",
            method: "findByProperty",
            params: propertyName + SPLITB + propertyValue
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
        pruneModifiedRecords: true //若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    //以下设置顶部工具栏显示状态，1是从“基建项目概况（非光伏项目）”查询页面点击“项目基本信息”连接功能，2是单击项目信息查询点击”项目基本信息“页面
    var btn='';
    if(flag == "unBtn"){
       btn='';
    }else{
       btn=[];
    }
    unitDS.setDefaultSort('viewOrderNum', 'asc'); //设置默认排序列
    gridPanel = new Ext.grid.EditorGridTbarPanel({
        id: 'org-grid-panel',
        //id,可选
        ds: unitDS,
        //数据源
        cm: unitCM,
        //列模型
        sm: unitSM,
        //行选择模式
        tbar: btn,
        //顶部工具栏，可选
        title: defaultParentName,
        //面板标题
        iconCls: 'icon-by-category',
        //面板样式
        border: false,
        // 
        region: 'center',
        clicksToEdit: 1,
        //单元格单击进入编辑状态,1单击，2双击
        header: true,
        //
        autoScroll: true,
        //自动出现滚动条
        collapsible: false,
        //是否可折叠
        animCollapse: false,
        //折叠时显示动画
        autoExpandColumn: 1,
        //列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,
        //加载时是否显示进度
        viewConfig: {
            forceFit: true,
            ignoreAdd: true
        },
        bbar: new Ext.PagingToolbar({ //在底部工具栏上添加分页导航
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
        getOrgTree: function () {
            return Ext.getCmp("orgs-tree");
        },
        getSelectNode: function () {
            var _tree = this.getOrgTree();
            if (_tree) {
                return _tree.getSelectionModel().getSelectedNode();
            } else {
                return null;
            }
        },
        insertHandler: function () {
            var selNode = this.getSelectNode();
            if (selNode) {
                if (USERBELONGUNITTYPEID == "0" || USERBELONGUNITTYPEID == "1") { //集团公司及集团总部用户
                    this.defaultInsertHandler();
                } else if (selNode.attributes.modifyauth) {
                    this.defaultInsertHandler();
                } else {
                    Ext.example.msg('提示', '权限不足,只能对本公司下的单位进行维护!');
                }
            }
        },
        insertMethod: 'insertOrg',
        saveMethod: 'updateOrg',
        deleteMethod: 'deleteOrg',
        reloadTree: function (_grid) {
            var selNode = this.getSelectNode();
            if (selNode) {
                var path = selNode.getPath();
                if (selNode.parentNode) {
                    selNode.parentNode.reload();
                } else {
                    selNode.reload()
                }
                var tree = this.getOrgTree();
                tree.expandPath(path, null, function () {
                    tree.getNodeById(selNode.id).select();
                })
            }
        },
        listeners: {
 			aftersave: function (grid, idsOfInsert, idsOfUpdate) {
            	//将新增，修改的组织机构的信息添加到动态数据中
            	var idsOfAll = idsOfInsert.concat(idsOfUpdate);
        		if(DEPLOY_UNITTYPE=='A') //项目单位发送到集团二级公司
        		{
        			//找到该项目单位所属二级公司编号
        			var sql =  "select unitid from sgcc_ini_unit where unit_type_id='2' " +
								   "connect by prior upunit=unitid start with unitid='" + CURRENTAPPID +"'";
        			DWREngine.setAsync(false);					
						baseDao.getDataAutoCloseSes(sql, function(list){
							if(list.length>=0)
							{
								 unit2id = list[0];
							} 
						})
					DWREngine.setAsync(true);
					
					pcPrjService.addDydaAfterSaveOrUpdateSgcc(CURRENTAPPID, idsOfAll, unit2id, CURRENTAPPID, function(value) 
					{
						if('0'==value) {
							Ext.Msg.show({
								title: '提示',
								msg: '保存失败!',
								buttons: Ext.Msg.OK,
								icon: Ext.MessageBox.INFO
							});
						}
					})
        		}
        		else 
        		{
        			pcPrjService.addDydaAfterSaveOrUpdateSgcc(CURRENTAPPID, idsOfAll, CURRENTAPPID, USERBELONGUNITID,
        				function(value) {
							if('0'==value) {
								Ext.Msg.show({
									title: '提示',
									msg: '保存失败!',
									buttons: Ext.Msg.OK,
									icon: Ext.MessageBox.INFO
								});
							}
        				}
        			);
        		}
                this.reloadTree()
            },
            
            afterdelete: function () {
                this.reloadTree()
            }
        }
    });
    
    if (!EDIT) {
        gridPanel.addBtn = false;
        gridPanel.saveBtn = false;
        gridPanel.delBtn = false;
    }
    ///////////////////////////////////////////
    var viewport = new Ext.Viewport({
        layout: 'border',
        items: [treePanel, gridPanel],
        listeners: {
            afterlayout: function () {
                treePanel.root.expand();
                treePanel.root.select();
//                if (USERBELONGUNITTYPEID == '0' || USERBELONGUNITTYPEID == '1') {
//                    unitDS.load({
//                        params: {
//                            start: 0,
//                            // 起始序号
//                            limit: PAGE_SIZE
//                            // 结束序号，若不分页可不用设置这两个参数
//                        }
//                    });
//                }
               unitDS.load({params: {start: 0,limit: PAGE_SIZE} });
            }
        }
    });
});