var bean = "com.sgepit.pcmis.jdgk.hbm.PcJdgkMonthTaskList";
var selectedPath;
var tmpLeaf;
var MASTER_RECORD = window.dialogArguments;
var sj = MASTER_RECORD.get('sjType');
Ext.onReady(function(){
    
    var fm = Ext.form;
    
    var fc = {
        'uids' : {name:'uids',fieldLabel:'主键',readOnly:true},
        'pid' : {name:'pid',fieldLabel:'PID',readOnly:true},
        'treeid' : {name:'treeid',fieldLabel:'节点编号',readOnly:true},
        'parentid' : {name:'parentid',fieldLabel:'父节点编号',readOnly:true},
        'isleaf' : {name:'isleaf',fieldLabel:'叶子节点',readOnly:true},
        'sjType' : {name : 'sjType',fieldLabel : '月度'},
        'masterid' : {name:'masterid',fieldLabel:'主表主键',readOnly:true},
        'edoTaskUid' : {name:'edoTaskUid',fieldLabel:'任务编号',readOnly:true},
        'edoProjectUid' : {name:'edoProjectUid',fieldLabel:'一级网络编号',readOnly:true},
        'taskName' : {name:'taskName',fieldLabel:'任务名称', width:280, allowBlank:false},
        
        'planStartTime' : {name : 'planStartTime',fieldLabel : '计划开始时间', readOnly:true, format : 'Y-m-d'},
        'planCompTime' : {name : 'planCompTime',fieldLabel : '计划完成时间', readOnly:true, format : 'Y-m-d'},
        'realStartTime' : {name : 'realStartTime',fieldLabel : '实际开始时间', readOnly:true, format : 'Y-m-d'},
        'realCompTime' : {name : 'realCompTime',fieldLabel : '实际完成时间', readOnly:true, format : 'Y-m-d'},
        
        'memo' : {name:'memo',fieldLabel:'月度任务完成情况分析',width:280,height:100}
    };
    
    var Columns = [
        {id:'uids',header:fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hidden:true},
        {id:'pid',header:fc['pid'].fieldLabel,dataIndex:fc['pid'].name,hidden:true},
        {id:'treeid',header:fc['treeid'].fieldLabel,dataIndex:fc['treeid'].name,hidden:true},
        {id:'parentid',header:fc['parentid'].fieldLabel,dataIndex:fc['parentid'].name,hidden:true},
        {id:'isleaf',header:fc['isleaf'].fieldLabel,dataIndex:fc['isleaf'].name,hidden:true},
        {id:'sjType',header:fc['sjType'].fieldLabel,dataIndex:fc['sjType'].name,hidden:true},
        
        {id:'masterid',header:fc['masterid'].fieldLabel,dataIndex:fc['masterid'].name,hidden:true},
        {id:'edoTaskUid',header:fc['edoTaskUid'].fieldLabel,dataIndex:fc['edoTaskUid'].name,hidden:true},
        {id:'edoProjectUid',header:fc['edoProjectUid'].fieldLabel,dataIndex:fc['edoProjectUid'].name,hidden:true},
        {id:'taskName',header:fc['taskName'].fieldLabel,dataIndex:fc['taskName'].name,width:340},
        
        {id:'planStartTime',header:fc['planStartTime'].fieldLabel,dataIndex:fc['planStartTime'].name,width:100,align:'center',renderer:formatDate},
        {id:'planCompTime',header:fc['planCompTime'].fieldLabel,dataIndex:fc['planCompTime'].name,width:100,align:'center',renderer:formatDate},
        {id:'realStartTime',header:fc['realStartTime'].fieldLabel,dataIndex:fc['realStartTime'].name,width:100,align:'center',renderer:formatDate},
        {id:'realCompTime',header:fc['realCompTime'].fieldLabel,dataIndex:fc['realCompTime'].name,width:100,align:'center',renderer:formatDate},
        
        {id:'memo',header:fc['memo'].fieldLabel,dataIndex:fc['memo'].name,width:160}
    ];
    
    
    var store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        autoLoad : true,
        leaf_field_name : 'isleaf',// 是否叶子节点字段
        parent_id_field_name : 'parentid',// 树节点关联父节点字段
        url : MAIN_SERVLET,
        baseParams : {
            ac : 'list',
            method : 'getPcJdgkMonthTaskList',
            business : 'pcJdgkMgm',
            bean : bean
        },
        reader : new Ext.data.JsonReader({
            id : 'treeid',
            root : 'topics',
            totalProperty : 'totalCount',
            fields : ['uids', 'pid', 'treeid', 'parentid', 'isleaf','sjType',
                    'masterid','edoTaskUid','edoProjectUid','taskName',
                    'planStartTime','planCompTime','realStartTime','realCompTime',
                    'memo']
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
                        + ";masterid" + SPLITB + MASTER_RECORD.get('uids')
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
    
    
        var menuAdd = new Ext.Button({
            id : 'menu_add',
            text : '新增',
            iconCls : 'add',
            disabled : true,
            handler : toHandler
        });
        var menuUpdate = new Ext.Button({
            id : 'menu_update',
            text : '修改',
            iconCls : 'btn',
            disabled : true,
            handler : toHandler
        });
        var menuDelete = new Ext.Button({
            id : 'menu_del',
            text : '删除',
            iconCls : 'remove',
            disabled : true,
            handler : toHandler
        });
        
        var selectTaskBtn = new Ext.Button({
            id : 'show_task',
            text : '选择一级网络计划',
            iconCls : 'add',
            disabled : true,
            hidden:true,
            handler : toHandler
        });
        var editRealTimeBtn = new Ext.Button({
            id : 'real_time',
            text : '修改实际时间',
            iconCls : 'btn',
            disabled : true,
            handler : toHandler
        });
        var exportExcelBtn = new Ext.Button({
            id : 'export',
            text : '导出数据',
            tooltip : '导出数据到Excel',
            cls : 'x-btn-text-icon',
            icon : 'jsp/res/images/icons/page_excel.png',
            handler : function() {
                exportDataFile();
            }
        }); 
    //数据的导出
    function exportDataFile() {
        var openUrl = CONTEXT_PATH
                + "/servlet/PCZlgkServlet?ac=exportDataJdgkMonthTask&businessType=PcJdgkMonthTask"
                + "&unitId="+ CURRENTAPPID
                + "&masterId=" + MASTER_RECORD.get('uids')
                + "&sjType=" + MASTER_RECORD.get('sjType');
        document.all.formAc.action = openUrl
        document.all.formAc.submit();
    }
             
    var treePanelTitle = CURRENTAPPNAME+sj.substr(0,4)+'年'+parseInt(sj.substr(4,2),10)+'月'+'工程进度任务分析';
    var  tbarArr  = ['<font color=#15428b><b>&nbsp;' + treePanelTitle+ '</b></font>',
        '-',btnexpendAll,'-',btnexpendClose,'-',
        menuAdd,'-',menuUpdate,'-',menuDelete,'-',selectTaskBtn,'-',editRealTimeBtn,'-',exportExcelBtn
        ];      
       
    var treeGrid = new Ext.ux.maximgb.treegrid.GridPanel({
        id : 'budget-tree-panel',
        iconCls : 'icon-by-category',
        store : store,
        master_column_id : 'taskName',// 定义设置哪一个数据项为展开定义
        autoScroll : true,
        region : 'center',
        viewConfig : {
            forceFit : true,
            ignoreAdd : true
        },
        frame : false,
        border : false,
        columns : Columns,
        stripeRows : true
    });
    treeGrid.getSelectionModel().singleSelect = true;
    
    var smTreeGrid = treeGrid.getSelectionModel();
    smTreeGrid.on('rowselect', rowSelectFunction, this);
    function rowSelectFunction(thisSm, rowIndex, thisRecord){
        var selectedRow = thisSm.getSelected();
        var treeid = selectedRow.get('treeid');
        //1、默认全部禁用
        toolbarDisable([menuAdd,menuUpdate,menuDelete,selectTaskBtn,editRealTimeBtn]);
        //2、数据上报后，除了导出按钮以外，均不可用
        if(_flag == 'true' || _flag == true){
        	var rootid = CURRENTAPPID+'-'+sj;
        	selectedPath = store.getPath(thisRecord, "treeid");
        	var paths = selectedPath.split("/");
        	if(treeid == rootid+"-01" || treeid == rootid+"-03"){
        		//选择一级网络计划根节点，所有按钮均不可用
        		toolbarDisable([menuAdd,menuUpdate,menuDelete,selectTaskBtn,editRealTimeBtn]);
        	}else if(paths.contains(rootid+"-01") || paths.contains(rootid +"-03")){
        		//选择一级网络计划下的子节点只允许修改实际时间
        		toolbarEnable([editRealTimeBtn]);
        		toolbarDisable([menuAdd,menuUpdate,menuDelete,selectTaskBtn]);
        	}else if(treeid == rootid+"-02" || treeid == rootid+"-04"){ 
        		//选择 “本月其他工作完成情况”和“下月其他工作完成情况”根节点， 只允许新增
        		toolbarEnable([menuAdd]);
        		toolbarDisable([menuUpdate,menuDelete,selectTaskBtn,editRealTimeBtn]);
        	}else if(paths.contains(rootid+"-02") || paths.contains(rootid +"-04")){
        		//选择 “本月其他工作完成情况”和“下月其他工作完成情况”下的子节点，可以新增、删除、修改
        		toolbarEnable([menuAdd,menuUpdate,menuDelete]);
        		toolbarDisable([selectTaskBtn,editRealTimeBtn]);
        	}
        }
    }
            
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
            items : [treeGrid]
        })
        
    var viewport = new Ext.Viewport({
        layout : 'border',
        items : [contentPanel]
    });
    
    //选择一级网络计划的窗口
    var taskRoot = new Ext.tree.AsyncTreeNode({
		text : 'root',
		id : '0',
		expanded : true,
		leaf : false,
		checked : false
	});
    
    var taskTreeLoader = new Ext.tree.TreeLoader({
        url: MAIN_SERVLET,
        baseParams: {
            ac:"columntree", 
            treeName:"getEdoTask", 
            businessName:"pcJdgkMgm",
            ifcheck:true,
            projectuid:MASTER_RECORD.get('edoProjectUid'), 
            parent:'-1',
            treeid : '',
            pid : CURRENTAPPID
        },
        clearOnLoad : true,
        uiProviders:{
            'col': Ext.tree.ColumnNodeUI
        }
    });
    
    var taskColumntree = new Ext.tree.ColumnTree({
        rootVisible: false,
        lines:true,
        autoScroll:true,
        animCollapse:false,
        animate: false,
        checkModel:"cascade",
        tbar:[],
        unitArray:[],
        columns:[{
            header:'任务名称',
            width:400,
            dataIndex:'text'
        }],
        root : taskRoot,
        loader : taskTreeLoader,
        listeners:{
            beforeload:function(node){
                var treeid = node.attributes.treeid;
                if (treeid == null){
                    treeid = "1";
                }
                var selectedRow = treeGrid.getSelectionModel().getSelected();
                node.getOwnerTree().loader.baseParams.projectuid = MASTER_RECORD.get('edoProjectUid');
                node.getOwnerTree().loader.baseParams.parent = treeid;
                node.getOwnerTree().loader.baseParams.treeid = selectedRow.get('treeid');
                node.getOwnerTree().loader.baseParams.pid = CURRENTAPPID;
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
                        var ppks = new Array();
                        if(nodesArr.length>0){
                            for(var i=0,j=nodesArr.length;i<j;i++){
                                ppks.push(nodesArr[i].id)
                            }
                            var selectedRow = treeGrid.getSelectionModel().getSelected();
                            DWREngine.setAsync(false);
                            pcJdgkMgm.saveEdoTaskToMonthTask(ppks+"",selectedRow.get('uids'),sj,function(flag){
                               if(flag!="1"){
                                   Ext.example.msg('提示','操作失败！');                                      
                               }else{
                                   taskWin.hide();
                                   selectCrrentTreeNode();
                               }
                            });
                            DWREngine.setAsync(true);
                        }
                    }
                })
            }
        }
    });
    
    var taskWin = new Ext.Window({
        title:"选择一级网络计划",
        width:435,
        height:550,
        layout:'fit',
        closeAction :'hide',
        resizable :false,
        border : false,
        modal:true,
        items : [taskColumntree],
        listeners : {
            show : function(){
                taskRoot.reload();
            }
        }
    });
    
    //修改实际开始时间和实际完成时间
    var editRealTimeForm = new Ext.FormPanel({
        height : 190,
        header: false,
	    border: false,
	    region: 'center',
	    bodyStyle: 'padding:10px 10px;',
	    layout: 'form',
        labelAlign: 'right',
        items: [
            new fm.Hidden(fc['uids']),
            new fm.DateField(fc['realStartTime']),
            new fm.DateField(fc['realCompTime']),
            new fm.TextArea(fc['memo'])
        ]
    });
    var saveBtn = new Ext.Button({
        text: '保存',
        iconCls: 'save',
        handler: function(){
            var form = editRealTimeForm.getForm();
            var realStartTime = form.findField('realStartTime').getValue();
            var realCompTime = form.findField('realCompTime').getValue();
            if(realCompTime != '' && realStartTime > realCompTime){
                Ext.example.msg('提示！', '实际开始时间必须早于实际完成时间！');
                return false;
            }
	        var obj = new Object();
	        for (var i=0; i<Columns.length; i++){
	            var name = Columns[i].id;
	            var field = form.findField(name);
	            if (field) obj[name] = field.getValue();
	        }
	        DWREngine.setAsync(false);
	        pcJdgkMgm.saveTaskListRealTime(obj,function(str){
	            if(str == "1"){
	                Ext.example.msg('提示！', '您成功保存了 1 条记录。');
                    //保存成功后不刷新树，直接更新数据
                    var selectedRow = treeGrid.getSelectionModel().getSelected();
                    selectedRow.set('realStartTime',obj.realStartTime ? (obj.realStartTime).dateFormat('Y-m-d') : '');
                    selectedRow.set('realCompTime', obj.realCompTime ? (obj.realCompTime).dateFormat('Y-m-d') : '');
                    selectedRow.set('memo',obj.memo);
                    selectedRow.commit();
                    editRealTimeWin.hide();
	            }else{
	                Ext.example.msg('提示！', '保存失败。');
	            }
	        });
	        DWREngine.setAsync(true);
            
        }
    });
    var closeBtn = new Ext.Button({
        text: '关闭',
        iconCls: 'remove',
        handler: function(){
            editRealTimeWin.hide();
        }
    });
    var editRealTimeWin = new Ext.Window({
        title:"修改实际开始时间和实际完成时间",
        width:435,
        height:240,
        layout:'fit',
        closeAction :'hide',
        resizable :false,
        border : false,
        modal: true,
        items : [editRealTimeForm],
        listeners : {
            show : function(){
                var selectedRow = treeGrid.getSelectionModel().getSelected();
                var uids = selectedRow.get('uids');
                var formRecord = Ext.data.Record.create([
			        {name: 'uids', type: 'string'},
			        {name: 'realStartTime', type: 'date',dateFormat: 'Y-m-d'},
			        {name: 'realCompTime', type: 'date',dateFormat: 'Y-m-d'},
			        {name: 'memo', type: 'string'}
                ]);
                var loadFormRecord = null;
                DWREngine.setAsync(false);
                baseMgm.findById(bean, uids,function(obj){
                    if(obj){
                        loadFormRecord = new formRecord(obj);
                        editRealTimeForm.getForm().loadRecord(loadFormRecord);
                    }
                })
                DWREngine.setAsync(true);
            },
            hide : function(){
                editRealTimeForm.getForm().reset();
            }
        },
        buttonAlign : 'center',
        buttons : [saveBtn,closeBtn]
    });
    
    //
    var taskListForm = new Ext.FormPanel({
        header: false,
        border: false,
        region: 'center',
        bodyStyle: 'padding:10px 10px;',
        layout: 'form',
        labelAlign: 'right',
        items: [
            new fm.Hidden(fc['uids']),
            new fm.Hidden(fc['pid']),
            new fm.Hidden(fc['treeid']),
            new fm.Hidden(fc['parentid']),
            new fm.Hidden(fc['isleaf']),
            new fm.Hidden(fc['sjType']),
            new fm.Hidden(fc['masterid']),
            new fm.Hidden(fc['edoTaskUid']),
            new fm.Hidden(fc['edoProjectUid']),
            new fm.TextField(fc['taskName']),
            new fm.DateField(fc['planStartTime']),
            new fm.DateField(fc['planCompTime']),
            new fm.DateField(fc['realStartTime']),
            new fm.DateField(fc['realCompTime']),
            new fm.TextArea(fc['memo'])
        ]
    });
    var saveTaskBtn = new Ext.Button({
        text: '保存',
        iconCls: 'save',
        handler: function(){
            var form = taskListForm.getForm();
            var taskName = form.findField('taskName').getValue();
            var planStartTime = form.findField('planStartTime').getValue();
            var planCompTime = form.findField('planCompTime').getValue();
            var realStartTime = form.findField('realStartTime').getValue();
            var realCompTime = form.findField('realCompTime').getValue();
            if(!taskName){
                Ext.example.msg('提示！', '任务名称必须填写！');
                return false;
            }
            if(planCompTime != '' && planStartTime > planCompTime){
                Ext.example.msg('提示！', '计划开始时间必须早于计划完成时间！');
                return false;
            }
            if(realCompTime != '' && realStartTime > realCompTime){
                Ext.example.msg('提示！', '实际开始时间必须早于实际完成时间！');
                return false;
            }
            var obj = new Object();
            for (var i=0; i<Columns.length; i++){
                var name = Columns[i].id;
                var field = form.findField(name);
                if (field) obj[name] = field.getValue();
            }
            DWREngine.setAsync(false);
            pcJdgkMgm.saveTaskList(obj,function(str){
                if(str == "1"){
                    Ext.example.msg('提示！', '您成功保存了 1 条记录。');
                    selectCrrentTreeNode();
                    taskListWin.hide();
                }else{
                    Ext.example.msg('提示！', '保存失败。');
                }
            });
            DWREngine.setAsync(true);
            
        }
    });
    var closeTaskBtn = new Ext.Button({
        text: '关闭',
        iconCls: 'remove',
        handler: function(){
            taskListWin.hide();
        }
    });
    
    var taskListWin = new Ext.Window({
        title:"编辑其他工作计划",
        width:435,
        height:330,
        layout:'fit',
        closeAction :'hide',
        resizable :false,
        border : false,
        modal: true,
        items : [taskListForm],
        listeners : {
            hide : function(){
                taskListForm.getForm().reset();
            }
        },
        buttonAlign : 'center',
        buttons : [saveTaskBtn,closeTaskBtn]
    });
    
    var taskListFormRecord = Ext.data.Record.create([
        {name: 'uids', type: 'string'},
        {name: 'pid', type: 'string'},
        {name: 'treeid', type: 'string'},
        {name: 'parentid', type: 'string'},
        {name: 'isleaf', type: 'string'},
        {name: 'masterid', type: 'string'},
        {name: 'edoTaskUid', type: 'string'},
        {name: 'edoProjectUid', type: 'string'},
        {name: 'taskName', type: 'string'},
        {name: 'planStartTime', type: 'date',dateFormat: 'Y-m-d'},
        {name: 'planCompTime', type: 'date',dateFormat: 'Y-m-d'},
        {name: 'realStartTime', type: 'date',dateFormat: 'Y-m-d'},
        {name: 'realCompTime', type: 'date',dateFormat: 'Y-m-d'},
        {name: 'memo', type: 'string'}
    ]);
    
    
    
    //treeGrid.on('rowcontextmenu', contextmenu, this);
    function contextmenu(thisGrid, rowIndex, e) {
        e.preventDefault();//阻止系统默认的右键菜单
        e.stopEvent();
        thisGrid.getSelectionModel().selectRow(rowIndex);
        
        var selectedRow = thisGrid.getSelectionModel().getSelected();
        var treeid = selectedRow.get('treeid');
        var rootid = CURRENTAPPID+'-'+sj;
        if(treeid == rootid)return false;
        
        var menuAdd = {
            id : 'menu_add',
            text : '新增',
            iconCls : 'add',
            handler : toHandler
        };
        var menuUpdate = {
            id : 'menu_update',
            text : '修改',
            iconCls : 'btn',
            handler : toHandler
        };
        var menuDelete = {
            id : 'menu_del',
            text : '删除',
            iconCls : 'remove',
            handler : toHandler
        };
        
        var selectTaskBtn = {
            id : 'show_task',
	        text : '选择一级网络计划',
            iconCls : 'add',
            handler : toHandler
	    };
        var editRealTimeBtn = {
            id : 'real_time',
            text : '修改实际时间',
            iconCls : 'btn',
            handler : toHandler
        }
        
        var menuArr = [menuAdd,'-',menuUpdate,'-',menuDelete];
        var menuWidth = 100;
        if(treeid == rootid+'-01' || treeid == rootid+'-03'){
            //修改01和03根节点，添加一级网络计划
            menuArr = [selectTaskBtn];
            menuWidth = 160;
        }
        if(treeid.indexOf(rootid+'-01-') == 0 || treeid.indexOf(rootid+'-03-') == 0){
            //修改01和03的子节点，修改实际时间
            menuArr = [editRealTimeBtn,'-',menuDelete];
            menuWidth = 160;
        }
        if(treeid == rootid+'-02' || treeid == rootid+'-04'){
            //02和04根节点，只能新增
            menuArr = [menuAdd];
            menuWidth = 100;
        }
        var treeMenu = new Ext.menu.Menu({
            id : 'treeMenu',
            width : menuWidth,
            items : menuArr
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
            var newTreeid = "";
            DWREngine.setAsync(false);
            pcJdgkMgm.getNewTreeid(CURRENTAPPID, treeid, "treeid",
                "pc_jdgk_month_task_list", null, function(str) {
                newTreeid = str;
            });
            DWREngine.setAsync(true);
            var loadTaskListFormRecord = new taskListFormRecord({
                uids : '',
                pid : CURRENTAPPID,
                treeid : newTreeid,
                parentid : treeid,
                isleaf : 1,
                sjType : sj,
                masterid : record.get('masterid'),
                edoTaskUid : '',
                edoProjectUid : record.get('edoProjectUid'),
                taskName : '',
                planStartTime : '',
                planCompTime : '',
                realStartTime : '',
                realCompTime : '',
                memo : ''
            });
            taskListWin.show();
            taskListForm.getForm().loadRecord(loadTaskListFormRecord);
        } else if ("menu_update" == state) {
            var selectedRow = treeGrid.getSelectionModel().getSelected();
            var uids = selectedRow.get('uids');
            var loadTaskListFormRecord = null;
            DWREngine.setAsync(false);
            baseMgm.findById(bean, uids,function(obj){
                if(obj){
                    loadTaskListFormRecord = new taskListFormRecord(obj);
                    taskListWin.show();
                    taskListForm.getForm().loadRecord(loadTaskListFormRecord);
                }
            })
            DWREngine.setAsync(true);
        } else if ("menu_del" == state) {
            if(isleaf == '0'){
                Ext.example.msg('提示！', '节点下包含有子节点，无法删除。');
                return;
            }else if(parentid == '0'){
                Ext.example.msg('提示！', '根节点无法删除。');
                return;
            }
            Ext.Msg.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn, text) {
                if (btn == "yes"){
                    DWREngine.setAsync(false);
                    pcJdgkMgm.deleteMonthTaskList("",uids, function(str) {
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
        } else if("show_task" == state){
            var type = treeid.substr(treeid.length - 2);
            taskWin.show();
        } else if("real_time" == state){
            editRealTimeWin.show();
        }
    }
    
    
    // 其他自定义函数(日期格式化)
    function formatDate(value) {
        //return value ? value.dateFormat('Y-m-d H:i:s') : '';
        return value ? value.substr(0,10) : '';
    };  
    
});