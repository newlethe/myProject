var bean = "com.sgepit.pcmis.jdgk.hbm.PcJdgkWeekWorkList";
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
        'masterid' : {name:'masterid',fieldLabel:'主表主键',readOnly:true},
        'workNum' : {name:'workNum',fieldLabel:'序号', width:280},
        'workPlan' : {name:'workPlan',fieldLabel:'周工作计划', width:280},
        'workFinish' : {name:'workFinish',fieldLabel:'周工作计划完成情况及分析', width:280},
        'workProblem' : {name:'workProblem',fieldLabel:'存在的问题', width:280},
        
        'memo' : {name:'memo',fieldLabel:'备注',width:280,height:100}
    };
    
    var Columns = [
        {id:'uids',header:fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hidden:true},
        {id:'pid',header:fc['pid'].fieldLabel,dataIndex:fc['pid'].name,hidden:true},
        {id:'treeid',header:fc['treeid'].fieldLabel,dataIndex:fc['treeid'].name,hidden:true},
        {id:'parentid',header:fc['parentid'].fieldLabel,dataIndex:fc['parentid'].name,hidden:true},
        {id:'isleaf',header:fc['isleaf'].fieldLabel,dataIndex:fc['isleaf'].name,hidden:true},
        
        {id:'masterid',header:fc['masterid'].fieldLabel,dataIndex:fc['masterid'].name,hidden:true},
        {id:'workNum',header:fc['workNum'].fieldLabel,dataIndex:fc['workNum'].name,width:80,align:'center'},
        {id:'workPlan',header:fc['workPlan'].fieldLabel,dataIndex:fc['workPlan'].name,width:340},
        {id:'workFinish',header:fc['workFinish'].fieldLabel,dataIndex:fc['workFinish'].name,width:340},
        {id:'workProblem',header:fc['workProblem'].fieldLabel,dataIndex:fc['workProblem'].name,width:340},
        {id:'memo',header:fc['memo'].fieldLabel,dataIndex:fc['memo'].name,width:160,hidden:true}
    ];
    
    
    var store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        autoLoad : true,
        leaf_field_name : 'isleaf',// 是否叶子节点字段
        parent_id_field_name : 'parentid',// 树节点关联父节点字段
        url : MAIN_SERVLET,
        baseParams : {
            ac : 'list',
            method : 'getPcJdgkWeekWorkListTree',
            business : 'pcJdgkMgm',
            bean : bean
        },
        reader : new Ext.data.JsonReader({
            id : 'treeid',
            root : 'topics',
            totalProperty : 'totalCount',
            fields : ['uids', 'pid', 'treeid', 'parentid', 'isleaf','workNum',
                    'masterid','workPlan','workFinish','workProblem',
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
             
    var treePanelTitle = CURRENTAPPNAME+"项目"+sj.substring(0,4)+"年"+sj.substring(4,6)+"月第"+sj.substring(6,7)+"周工作计划及完成";
    var  tbarArr  = ['<font color=#15428b><b>&nbsp;' + treePanelTitle+ '</b></font>',
        '-',btnexpendAll,'-',btnexpendClose,'-',
        menuAdd,'-',menuUpdate,'-',menuDelete
        ];
    if(editAbleFlag=='false'){
    	tbarArr  = ['<font color=#15428b><b>&nbsp;' + treePanelTitle+ '</b></font>',
        '-',btnexpendAll,'-',btnexpendClose
        ];
    }
       
    var treeGrid = new Ext.ux.maximgb.treegrid.GridPanel({
        id : 'budget-tree-panel',
        iconCls : 'icon-by-category',
        store : store,
        master_column_id : 'workPlan',// 定义设置哪一个数据项为展开定义
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
        if(editAbleFlag=='true'){
	        var rootid = CURRENTAPPID+'-'+sj;
	            menuAdd.disable();
	            menuUpdate.disable();
	            menuDelete.disable();
	        
	        var menuArr = [menuAdd,'-',menuUpdate,'-',menuDelete];
	        if(treeid == rootid+'-01' || treeid == rootid+'-02'){
	            menuAdd.enable();
	        }
	        if(treeid.indexOf(rootid+'-010') == 0 || treeid.indexOf(rootid+'-020') == 0){
	            menuAdd.enable();
	            menuUpdate.enable();
	            menuDelete.enable();
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
            new fm.Hidden(fc['masterid']),
            new fm.TextField(fc['workNum']),
            new fm.TextField(fc['workPlan']),
            new fm.TextField(fc['workFinish']),
            new fm.TextField(fc['workProblem']),
            new fm.Hidden(fc['memo'])
        ]
    });
    var saveTaskBtn = new Ext.Button({
        text: '保存',
        iconCls: 'save',
        handler: function(){
            var form = taskListForm.getForm();
            var taskName = form.findField('workPlan').getValue();
            if(!taskName){
                Ext.example.msg('提示！', '周工作计划必须填写！');
                return false;
            }
            var obj = new Object();
            for (var i=0; i<Columns.length; i++){
                var name = Columns[i].id;
                var field = form.findField(name);
                if (field) obj[name] = field.getValue();
            }
            DWREngine.setAsync(false);
            pcJdgkMgm.saveWeekWorkList(obj,function(str){
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
        title:"编辑周工作计划",
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
        {name: 'workNum', type: 'string'},
        {name: 'workPlan', type: 'string'},
        {name: 'workFinish', type: 'string'},
        {name: 'workProblem', type: 'string'},
        {name: 'memo', type: 'string'}
    ]);
    
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
                "PC_JDGK_WEEK_WORK_LIST", null, function(str) {
                newTreeid = str;
            });
            DWREngine.setAsync(true);
            var loadTaskListFormRecord = new taskListFormRecord({
                uids : '',
                pid : CURRENTAPPID,
                treeid : newTreeid,
                parentid : treeid,
                isleaf : 1,
                masterid : record.get('masterid'),
                workNum : '',
                workPlan : '',
                workFinish : '',
                workProblem : '',
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
                    pcJdgkMgm.deleteWeekWorkList("",uids, function(str) {
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
        } 
    }
    
    
    // 其他自定义函数(日期格式化)
    function formatDate(value) {
        //return value ? value.dateFormat('Y-m-d H:i:s') : '';
        return value ? value.substr(0,10) : '';
    };  
    
});