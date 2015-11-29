var bean = "com.sgepit.pcmis.jdgk.hbm.PcJdgkMonthTaskList";
var selectedPath;
var tmpLeaf;
Ext.onReady(function(){
    
    var currDate = new Date();
    var dataSZ = currDate.setMonth(currDate.getMonth());//改变当前月为上一月
    var currMonth = (currDate.getMonth()+101+"").substring(1);
    var curSjType = currDate.getFullYear() +(currMonth);
    
    var array_yearMonth = getYearMonthBySjType('2013', null);

    var dsCombo_yearMonth = new Ext.data.SimpleStore({
                fields : ['k', 'v'],
                data : [['', '']]
            });
    dsCombo_yearMonth.loadData(array_yearMonth);
    
    var selectSjTypeCombo = new Ext.form.ComboBox({
                width:100,
                store: dsCombo_yearMonth,
                displayField:'v',
                valueField:'k',
                typeAhead: id,
                triggerAction: 'all',
                mode: 'local',
                editable :false,
                allowBlank: false,
                selectOnFocus:true,
                value : curSjType,
                listeners:{
                    'select':function(combo){
                        var sj = combo.getValue();
                        var title = "各项目"+sj.substr(0,4)+'年'+parseInt(sj.substr(4,2),10)+'月'+'月度任务分析汇总';
                        //Ext.get('title').update(title);
                        store.load();
                    }
                }
            });
    
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
                        + ";sjType" + SPLITB + selectSjTypeCombo.getValue()
                        + ";masterid" + SPLITB + '0'
                        + ";pid" + SPLITB + '0';// 此处设置除第一次加载外的加载参数设置
            }
        }
    });
    
    var btnexpendAll = new Ext.Button({
        iconCls : 'icon-expand-all',
        tooltip : '全部展开',
        handler : function() {
           //store.expandAllNode();
            for (var i = 0; i < store.getCount(); i++) {
                var rec1 = store.getAt(i);
                if(!store.isExpandedNode(rec1)){
	                store.expandNode(rec1);
                }
            }
        }
    }) ;
    var btnexpendClose = new Ext.Button({
        iconCls : 'icon-collapse-all',
        tooltip : '全部收起',
        handler : function() {
            //store.collapseAllNode();
            for (var i = 0; i < store.getCount(); i++) {
                var rec1 = store.getAt(i);
                if(store.isExpandedNode(rec1)){
                    store.collapseNode(rec1);
                }
            }
        }
    }) ;   
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
                + "/servlet/PCZlgkServlet?ac=exportDataJdgkMonthTask&businessType=PcJdgkMonthTaskAll"
                + "&unitId="+ CURRENTAPPID
                //+ "&masterId=" + MASTER_RECORD.get('uids')
                + "&sjType=" + selectSjTypeCombo.getValue();
        document.all.formAc.action = openUrl
        document.all.formAc.submit();
    }
             
    var treePanelTitle = "各项目"+curSjType.substr(0,4)+'年'+parseInt(curSjType.substr(4,2),10)+'月'+'月度任务分析汇总';
    treePanelTitle = '';
    var  tbarArr  = ['<font color=#15428b><b id="title">' + treePanelTitle+ '</b></font>',
        '-',btnexpendAll,'-',btnexpendClose,'-','选择月份：',selectSjTypeCombo,'-',exportExcelBtn];      
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
            
    store.on("load", function(ds1, recs) {
        if(selectedPath && selectedPath!="") {
            store.expandPath(selectedPath, "treeid");
        } else {
            if (ds1.getCount() > 0) {
                //var rec1 = ds1.getAt(0);
                //if (!ds1.isExpandedNode(rec1)) {
                    //ds1.expandNode(rec1);
                //}
                for (var i = 0; i < ds1.getCount(); i++) {
                    var rec1 = ds1.getAt(i);
                    if(rec1.get('parentid') == '0'){
                        ds1.expandNode(rec1);
                    }
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
    
    
    
    // 其他自定义函数(日期格式化)
    function formatDate(value) {
        //return value ? value.dateFormat('Y-m-d H:i:s') : '';
        return value ? value.substr(0,10) : '';
    };  
    
});