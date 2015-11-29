var bean = "com.sgepit.pmis.finalAccounts.complete.hbm.FacompFixedAssetTree";
var selectedPath;
var tmpLeaf;
Ext.onReady(function(){
    
    var fm = Ext.form;
    
    var fc = {
        'uids' : {name:'uids',fieldLabel:'主键',readOnly:true},
        'pid' : {name:'pid',fieldLabel:'PID',readOnly:true},
        'treeid' : {name:'treeid',fieldLabel:'节点编号',readOnly:true},
        'parentid' : {name:'parentid',fieldLabel:'父节点编号',readOnly:true},
        'isleaf' : {name:'isleaf',fieldLabel:'叶子节点',readOnly:true},
        'fixedname' : {name:'fixedname',fieldLabel:'固定资产分类名称',allowBlank:false,width:160},
        'fixedno' : {name:'fixedno',fieldLabel:'固定资产分类编号',allowBlank:false,width:160},
        'remark' : {name:'remark',fieldLabel:'备注',width:160,height:160}
    };
    
    var Columns = [
        {id:'uids',header:fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hidden:true},
        {id:'pid',header:fc['pid'].fieldLabel,dataIndex:fc['pid'].name,hidden:true},
        {id:'treeid',header:fc['treeid'].fieldLabel,dataIndex:fc['treeid'].name,hidden:true},
        {id:'parentid',header:fc['parentid'].fieldLabel,dataIndex:fc['parentid'].name,hidden:true},
        {id:'isleaf',header:fc['isleaf'].fieldLabel,dataIndex:fc['isleaf'].name,hidden:true},
        {id:'fixedname',header:fc['fixedname'].fieldLabel,dataIndex:fc['fixedname'].name,width:240},
        {id:'fixedno',header:fc['fixedno'].fieldLabel,dataIndex:fc['fixedno'].name,width:120},
        {id:'remark',header:fc['remark'].fieldLabel,dataIndex:fc['remark'].name,width:160}
    ];
    
    var store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        autoLoad : true,
        leaf_field_name : 'isleaf',// 是否叶子节点字段
        parent_id_field_name : 'parentid',// 树节点关联父节点字段
        url : MAIN_SERVLET,
        baseParams : {
            ac : 'list',
            method : 'getFACompFixedAssetTree',
            business : 'faFixedAssetService',
            bean : bean,
            params : ''
        },
        reader : new Ext.data.JsonReader({
			id : 'treeid',
			root : 'topics',
			totalProperty : 'totalCount',
			fields : ['uids', 'pid', 'treeid', 'parentid', 'isleaf',
                    'fixedno', 'fixedname', 'remark']
		}),
        listeners : {
            'beforeload' : function(ds, options) {
                var parentid = null;
                if (options.params[ds.paramNames.active_node] == null) {
                    options.params[ds.paramNames.active_node] = '0';
                    parentid = "0"; // 此处设置第一次加载时的parent参数
                } else {
                    parentid = options.params[ds.paramNames.active_node];
                }
                ds.baseParams.params = "parentid" + SPLITB + parentid
                        + ";pid" + SPLITB + CURRENTAPPID;// 此处设置除第一次加载外的加载参数设置
            }
        }
    });
    
    var btnexpendAll = new Ext.Button({
        iconCls : 'icon-expand-all',
        tooltip : '全部展开',
        handler : function() {
           store.expandAllNode();
        }
    }) ;
    var btnexpendClose = new Ext.Button({
        iconCls : 'icon-collapse-all',
        tooltip : '全部收起',
        handler : function() {
	        store.collapseAllNode();
	    }
	}) ;   
             
    var treePanelTitle = '固定资产分类';	              
    var  tbarArr  = ['<font color=#15428b><b>&nbsp;' + treePanelTitle+ '</b></font>', '-',btnexpendAll,'-',btnexpendClose,'-'];      
    var treeGrid = new Ext.ux.maximgb.treegrid.GridPanel({
        id : 'budget-tree-panel',
        iconCls : 'icon-by-category',
        store : store,
        master_column_id : 'fixedname',// 定义设置哪一个数据项为展开定义
        autoScroll : true,
        region : 'center',
        viewConfig : {
            forceFit : true,
            ignoreAdd : true
        },
        frame : false,
        collapsible : false,
        animCollapse : false,
        border : false,
        columns : Columns,
        stripeRows : true
    });
    treeGrid.getSelectionModel().singleSelect = true;
            
    store.on("load", function(ds1, recs) {
        if(selectedPath && selectedPath!="") {
            store.expandPath(selectedPath, "treeid");
        } else {
            if (ds1.getCount() > 0) {
                var rec1 = ds1.getAt(0);
                if (!ds1.isExpandedNode(rec1)) {
                    ds1.expandNode(rec1);
                }
            }
        }
    });
        
    
    store.on('expandnode', function(ds, rc) {
        if (selectedPath && selectedPath != "") {
            var tempArr = selectedPath.split("/");
            if (rc.get("treeid") == tempArr.pop()) {
                treeGrid.getSelectionModel().selectRow(ds.indexOf(rc));
            }
        }
    });
            
    
    //创建表单form-panel
	var saveBtn = new Ext.Button({
		text: '保存',
		iconCls: 'save',
		handler: formSave
	});
    var closeBtn = new Ext.Button({
        text: '关闭',
        iconCls: 'remove',
        handler: function(){
            formPanel.collapse();
        }
    });
    var formPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        border: false,
        width : 320,
        split: true,
        collapsible : true,
        collapsed: true,
        collapseMode : 'mini',
        region: 'east',
        bodyStyle: 'padding:10px 5px;border-left:1px #B5B8C8 solid;',
        iconCls: 'icon-detail-form',    //面板样式
        labelAlign: 'right',
        items: [
            new Ext.form.FieldSet({
                title: '工程量基本信息展示',
                layout: 'form',
                border: true,
                labelWidth : 110,
                items: [
                    new fm.Hidden(fc['uids']),
                    new fm.Hidden(fc['pid']),
                    new fm.Hidden(fc['treeid']),
                    new fm.Hidden(fc['parentid']),
                    new fm.Hidden(fc['isleaf']),
                    new fm.TextField(fc['fixedno']),
                    new fm.TextField(fc['fixedname']),
                    new fm.TextArea(fc['remark'])
                ],
                buttonAlign : 'center',
                buttons : [saveBtn,closeBtn]
            })
        ]
    });
    
    // 表单保存方法
    function formSave(){
        var form = formPanel.getForm();
        if(form.isValid()){
            if (formPanel.isNew) {
                doFormSave(true,tmpLeaf)  //修改
            } else {
                doFormSave(false,tmpLeaf)//新增
            }
        }
    }
    
    function doFormSave(isNew,leaf){
        var form = formPanel.getForm();
        var obj = new Object();
        for (var i=0; i<Columns.length; i++){
            var name = Columns[i].id;
            var field = form.findField(name);
            if (field) obj[name] = field.getValue();
        }
        DWREngine.setAsync(false);
        faFixedAssetService.saveOrUpdateFACompFixedAssetTree(obj,function(str){
            if(str == "1"){
                Ext.example.msg('提示！', '您成功保存了 1 条记录。');
                formPanel.collapse();
                selectCrrentTreeNode();
            }else{
                Ext.example.msg('提示！', '保存失败。');
            }
        });
        DWREngine.setAsync(true);
    }
    
    //定位到上次选择的树节点           
    function selectCrrentTreeNode(){
        var record = treeGrid.getSelectionModel().getSelected();
        selectedPath = store.getPath(record, "treeid");
        store.load();
     }
    
    var contentPanel = new Ext.Panel({
            layout : 'border',
            region : 'center',
            border : false,
            header : false,
            tbar : tbarArr,
            items : [treeGrid, formPanel]
        })
        
    var viewport = new Ext.Viewport({
        layout : 'border',
        items : [contentPanel]
    });
    
    treeGrid.on('rowcontextmenu', contextmenu, this);
    function contextmenu(thisGrid, rowIndex, e) {
        e.preventDefault();//阻止系统默认的右键菜单
        e.stopEvent();
        thisGrid.getSelectionModel().selectRow(rowIndex);
        var menuAdd = {
            id : 'menu_add',
            text : '　新增',
            iconCls : 'add',
            handler : toHandler
        };
        var menuUpdate = {
            id : 'menu_update',
            text : '　修改',
            iconCls : 'btn',
            handler : toHandler
        };
        var menuDelete = {
            id : 'menu_del',
            text : '　删除',
            iconCls : 'remove',
            handler : toHandler
        };
        var treeMenu = new Ext.menu.Menu({
            id : 'treeMenu',
            width : 100,
            items : [menuAdd,'-',menuUpdate,'-',menuDelete]
        });
        var coords = e.getXY();
        treeMenu.showAt([coords[0], coords[1]]); 
    }

    function toHandler(node) {
        var record = treeGrid.getSelectionModel().getSelected();   
        var state = this.id;
        var uids = record.get("uids");
        var treeid = record.get("treeid");
        var parentid = record.get("parentid");
        var isleaf = record.get("isleaf");
        
        if ("menu_add" == state) {
            formPanel.isNew = false
			formPanel.expand();
			formPanel.getForm().reset();
			saveBtn.setDisabled(false);
            var newTreeid = "";
			DWREngine.setAsync(false);
			faFixedAssetService.getNewTreeid(CURRENTAPPID, treeid, "treeid",
				"FACOMP_FIXED_ASSET_TREE", null, function(str) {
				newTreeid = str;
			});
			DWREngine.setAsync(true);
            var formRecord = Ext.data.Record.create(Columns);
            loadFormRecord = new formRecord({
                uids : '',
                pid : CURRENTAPPID,
                treeid : newTreeid,
                isleaf : 1,
                parentid : treeid
            });
            formPanel.getForm().loadRecord(loadFormRecord);
		} else if ("menu_del" == state) {
            if(isleaf == '0'){
                Ext.example.msg('提示！', '节点下包含有子节点，无法删除。');
                return;
            }else if(parentid == '0'){
                Ext.example.msg('提示！', '根节点无法删除。');
                return;
            }
            //查询该分类是否有关联固定资产
            var haxFixed = "0";
            DWREngine.setAsync(false);
            faFixedAssetService.treeHasFACompFixedAsset(uids, function(str) {
                haxFixed = str;
            });
            DWREngine.setAsync(true);
            if(haxFixed == "1"){
                Ext.example.msg('提示！', '节点已关联固定资产信息，不允许删除。');
                return;
            }
            Ext.Msg.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn, text) {
                if (btn == "yes"){
                    DWREngine.setAsync(false);
		            faFixedAssetService.deleteFACompFixedAssetTree(uids, function(str) {
		                if(str == "1"){
		                    Ext.example.msg('提示！', '您成功删除了 1 条记录。');
		                    selectCrrentTreeNode();
		                }else{
		                    Ext.example.msg('提示！', '删除失败。');
		                }
		            });
		            DWREngine.setAsync(true);
                }else{
                    return;
                }
            });
        } else if ("menu_update" == state) {
            formPanel.isNew = true
            formPanel.expand();
            formPanel.getForm().loadRecord(record);
            saveBtn.setDisabled(false);
        }
    }
    
});