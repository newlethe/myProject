/**
 * 竣工决算 - 固定资产 
 * 固定资产信息中，建筑工程 - 材料，安装工程 - 材料 取值窗口
 * @author zhangh 2013-07-18
 */

var jzgcClSelectWin;
var selectConid = '';

var rootText_cl = "建筑部分";
var rootBdgid_cl = '0101';
var editFieldtype_cl = 'jzgc_cl';

 
Ext.onReady(function(){
    var fm = Ext.form;
    
    //TODO:建筑工程-工程量
    DWREngine.setAsync(false);
    conpartybMgm.getPartyB(function(list) { // 获取乙方单位
        for (i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i].cpid);
            temp.push(list[i].partyb);
            partBs.push(temp);
        }
    }); 
    appMgm.getCodeValue('材料合同', function(list1) {
        for (var j = 0; j < list1.length; j++) {
            var temp = new Array();
            temp.push(list1[j].propertyCode);
            temp.push(list1[j].propertyName);
            contarctType2.push(temp);
        }
    });
    DWREngine.setAsync(true);
    var dsCombo2 = new Ext.data.SimpleStore({
        fields : ['k', 'v'],
        data : contarctType2
    });
    var ColumnsCont = [
        {name:'conid',type:'string'},
        {name:'pid',type:'string'},
        {name:'conno',type:'string'},
        {name:'conmoneyno',type:'string'},
        {name:'conname',type:'string'},
        {name:'partybno',type:'string'},
        {name:'condivno',type:'string'},
        {name:'sotr',type:'string'}
    ];
    var smCont = new Ext.grid.CheckboxSelectionModel({
        singleSelect : true
    });
    var cmCont = new Ext.grid.ColumnModel([
        {id:'conid',header:'合同主键',dataIndex:'conid',hidden:true},
        {id:'pid',header:'PID',dataIndex:'pid',hidden:true},
        {id:'condivno',header:'分类一',dataIndex:'condivno',hidden:true},
        {id:'sotr',header:'分类二',dataIndex:'sotr',hidden:true},
        {id:'conno',header:'合同编号',dataIndex:'conno',width:120},
        {id:'conmoneyno',header:'财务合同编号',dataIndex:'conmoneyno',hidden:true},
        {id:'conname',header:'合同名称',dataIndex:'conname',width:220},
        {id:'partybno',header:'乙方单位',dataIndex:'partybno',width:220,
            renderer : function(value) {
                var str = '';
                for (var i = 0; i < partBs.length; i++) {
                    if (partBs[i][0] == value) {
                        str = partBs[i][1]
                        break;
                    }
                }
              return str;
            }
        },{
            id:'clmoney',header:'所属材料金额',dataIndex:'clmoney',width:120,
            renderer : function(v,m,r){
                var sql1 = "SELECT nvl(sum(T.usemoney),0) usemoney FROM FACOMP_FIXED_WZOUT_VIEW T "
                    + " WHERE T.CONID = '" + r.get('conid') + "' AND T.BDGIDTYPE = '"+rootBdgid_cl+"'";
	            var sum1 = 0;
	            DWREngine.setAsync(false);
	            baseMgm.getData(sql1, function(list) {
	                sum1 = (list!=null&&list.length>0) ? list[0] : 0;
	            });
	            DWREngine.setAsync(true);
                return sum1;
            }
        }
    ]);
    var dsCont = new Ext.data.Store({
        baseParams : {
            ac : 'list',
            bean : 'com.sgepit.pmis.contract.hbm.ConOve',
            business : business,
            method : listMethod,
            params : "condivno = 'CL'"
        },
        proxy : new Ext.data.HttpProxy({
            method : 'GET',
            url : MAIN_SERVLET
        }),
        reader : new Ext.data.JsonReader({
            root : 'topics',
            totalProperty : 'totalCount',
            id : 'conid'
        }, ColumnsCont),
        remoteSort : true,
        pruneModifiedRecords : true
    });
    //jzgcGclListWin：合同分类二下拉菜单
    var selectContCombo = new Ext.form.ComboBox({
        store : dsCombo2,
        displayField : 'v',
        valueField : 'k',
        typeAhead : true,
        mode : 'local',
        triggerAction : 'all',
        selectOnFocus : true,
        width : 110,
        listeners : {
            'select' : function(combo,record,index){
                var v = this.getValue();
                if(v == '-1'){
                    dsCont.baseParams.params = "condivno='CL'";
                }else{
                    dsCont.baseParams.params = "condivno='CL' and sort='"+v+"'";
                }
                dsCont.load({start:0,limit:PAGE_SIZE});
            }
        }
    });
    var selectContBtn = new Ext.Button({
        text : '确定',
        iconCls : 'btn',
        handler : function(){
            if(!smCont.getSelected()){
                Ext.example.msg('提示','请先选择合同！');
                return;
            }
            
            var v = Ext.getCmp('conttotalmoney').getValue();
            var fixeduids = sm.getSelected().get('uids');
            var sql = "update Facomp_Fixed_Asset " +
                " set "+editFieldtype_cl+"=("+v+") " +
                " where uids='"+fixeduids+"'";        
            DWREngine.setAsync(false);
            baseDao.updateBySQL(sql,function(str){
                if(str == '1'){
                    Ext.example.msg('提示','【'+rootText_cl.substring(0,2)+'工程-材料】操作成功！');
                    ds.load();
                    jzgcClSelectWin.hide();
                }else{
                    Ext.example.msg('提示','保存失败！');
                }
            });
            DWREngine.setAsync(true);
            
        }
    })
    //合同列表
    var jzgcClContGridPanel=new Ext.grid.GridPanel({
        ds : dsCont,
        sm : smCont,
        cm : cmCont,
        tbar :['材料合同分类：',selectContCombo,'-',selectContBtn,'->',
            '材料总额：',{
                id : 'conttotalmoney',
                xtype : 'textfield',
                value : 0,
                width : 120,
                style : 'text-align:right'
            },'元'
        ],
        region : 'center',
        border : false,
        stripeRows : true,
        loadMask : true,
        viewConfig : {
            forceFit : true,
            ignoreAdd : true
        },
        bbar:new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: dsCont,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
    });
    
    smCont.on('rowselect',function(){
        var recordCont = smCont.getSelected();
        selectConid = recordCont.get('conid');
        var baseParams = bdgTreePanel.loader.baseParams
        baseParams.conid = selectConid;
        
            var record = sm.getSelected();
            var fixeduids = record.get('uids')

            //选择合同后，异步初始化数据，将物资出库数量和金额，赋值给使用数量和金额
            faFixedAssetService.initFacompFixedAssetWzoutNum(fixeduids,selectConid,rootBdgid_cl);
            myMask = new Ext.LoadMask(Ext.getBody(), {msg: "数据处理中，请稍等 ！"});
            myMask.show();
            setTimeout("myMask.hide();",2000);
//        if(bdgTreePanel.hidden == true){
//            bdgTreePanel.expand();
//        }
        rootNew.reload();
        //默认只查询概算中 "建筑部分"概算项
        dsOutSub.baseParams.params = "conid = '"+selectConid+"' and using like '"+rootBdgid_cl+"%' and fixeduids = '"+fixeduids+"'";
        dsOutSub.load({params:{start:0,limit:PAGE_SIZE}});
        update_wzout_sum();
    });
    dsCont.on('load',function(){
	    if(dsCont.getCount() > 0){
            bdgTreePanel.expand();
	        smCont.selectFirstRow();
        }else{
            bdgTreePanel.collapse();
        }
    })
    
    //概算树结构
    //生成概算树
    
    var rootNew = new Ext.tree.AsyncTreeNode({
        text : rootText_cl,
        iconCls : 'task-folder',
        id : rootBdgid_cl
    })
    //获取所选合同的概算分摊中的建筑部分
    var treeLoaderNew = new Ext.tree.TreeLoader({
        url: MAIN_SERVLET,
        baseParams: {
            ac:"columntree", 
            treeName:"getBdgTree", 
            businessName:"faFixedAssetService",
            conid : '',
            parentid : '0',
            bdgid : '',
            pid: CURRENTAPPID
        },
        clearOnLoad: true,
        uiProviders:{
            'col': Ext.tree.ColumnNodeUI
        }
    });

    var bdgTreePanel = new Ext.tree.ColumnTree({
        region: 'west',
        width: 260,
        height : document.body.clientHeight * .5,
        minSize: 100,
        maxSize: 700,
        frame: false,
        header: false,
        border: false,
        split : true,
        collapsed : true,
        collapsible : true,
        collapseMode : 'mini',
        lines: true,
        autoScroll: true,
        listeners: {  
        },
        columns : [{
            header : '概算名称',
            width : 380, // 隐藏字段
            dataIndex : 'bdgname'
        }, {
            header : '概算编号',
            width : 0,
            dataIndex : 'bdgno'
        }, {
            header : '概算主键',
            width : 0,
            dataIndex : 'bdgid'
        }, {
            header : '是否子节点',
            width : 0,
            dataIndex : 'isleaf'
        }, {
            header : '父节点',
            width : 0,
            dataIndex : 'parent'
        }],
        loader : treeLoaderNew,
        root : rootNew,
        tbar : [
             {
                iconCls : 'icon-expand-all',
                tooltip : 'Expand All',
                text    : '全部展开',
                handler : function() {
                    rootNew.expand(true);
                }
            }, '-', {
                iconCls : 'icon-collapse-all',
                tooltip : 'Collapse All',
                text    : '全部收起',
                handler : function() {
                    rootNew.collapse(true);
                }
            }
        ]
    });
    //第一次隐藏概算树，选择合同后才显示
    //bdgTreePanel.collapse();

    bdgTreePanel.on('beforeload', function(node) {
        var bdgid = node.attributes.bdgid;
        if (bdgid == null)
            bdgid = rootBdgid_cl;
        rootNew.setText(rootText_cl);
        var baseParams = bdgTreePanel.loader.baseParams
        baseParams.parentid = bdgid;
        baseParams.conid = selectConid;
        baseParams.pid = CURRENTAPPID;
    })
    
    bdgTreePanel.on('click', function(node, e){
        var tempNode = node
        selectedBdgid = tempNode.attributes.bdgid;
        if (selectedBdgid == null)
            selectedBdgid = rootBdgid_cl;
        var record = sm.getSelected();
        var fixeduids = record.get('uids');
        dsOutSub.baseParams.params = "conid = '"+selectConid+"' " +
                " and fixeduids = '"+fixeduids+"'" +
                " and using like '"+selectedBdgid+"%'"
        dsOutSub.load({params:{start:0,limit:PAGE_SIZE}});
        update_wzout_sum();
    });
    
    
    //材料列表
    //材料名称，材料编码，材料用途，施工单位，单位，单价，出库数量，使用量，使用金额
    var fcOutSub = {
        'uids' : {name : 'uids',fieldLabel : '主键'},
        'pid' : {name : 'pid',fieldLabel : 'PID'},
        'conid' : {name : 'conid',fieldLabel : '合同主键'},
        'outuids' : {name : 'outuids',fieldLabel : '物资明细主键'},
        'fixeduids' : {name : 'fixeduids',fieldLabel : '固定资产信息主键'},
        'outId' : {name : 'outId',fieldLabel : '出库单主键'},
        'equPartName' : {name : 'equPartName',fieldLabel : '物资名称'},
        'boxNo' : {name : 'boxNo',fieldLabel : '物资编码'},
        'using' : {name : '',fieldLabel : '领料用途'},
        'recipientsUnit' : {name : '',fieldLabel : '施工单位'},
        'unit' : {name : 'unit',fieldLabel : '单位'},
        'price' : {name : 'price', fieldLabel : '单价'},
        'outNum' : {name : 'outNum',fieldLabel : '数量'}
        ,'usenum' : {name : 'usenum',fieldLabel : '使用数量'}
        ,'usemoney' : {name : 'usemoney',fieldLabel : '使用金额'}
    };
    var smOutSub = new Ext.grid.CheckboxSelectionModel({singleSelect : true});
    var cmOutSub = new Ext.grid.ColumnModel([
        {
            id : 'uids',
            header : fcOutSub['uids'].fieldLabel,
            dataIndex : fcOutSub['uids'].name,
            hidden : true
        },{
            id : 'pid',
            header : fcOutSub['pid'].fieldLabel,
            dataIndex : fcOutSub['pid'].name,
            hidden : true
        },{
            id : 'conid',
            header : fcOutSub['conid'].fieldLabel,
            dataIndex : fcOutSub['conid'].name,
            hidden : true
        },{
            id : 'outuids',
            header : fcOutSub['outuids'].fieldLabel,
            dataIndex : fcOutSub['outuids'].name,
            hidden : true
        },{
            id : 'fixeduids',
            header : fcOutSub['fixeduids'].fieldLabel,
            dataIndex : fcOutSub['fixeduids'].name,
            hidden : true
        },{
            id : 'outId',
            header : fcOutSub['outId'].fieldLabel,
            dataIndex : fcOutSub['outId'].name,
            hidden : true
        },{
            id : 'equPartName',
            header : fcOutSub['equPartName'].fieldLabel,
            dataIndex : fcOutSub['equPartName'].name,
            align : 'center',
            width : 180
        },{
            id : 'boxNo',
            header : fcOutSub['boxNo'].fieldLabel,
            dataIndex : fcOutSub['boxNo'].name,
            align : 'center',
            width : 160
        },{
            id : 'using',
            header : fcOutSub['using'].fieldLabel,
            dataIndex : fcOutSub['using'].name,
            align : 'center',
            width : 120
        },{
            id : 'recipientsUnit',
            header : fcOutSub['recipientsUnit'].fieldLabel,
            dataIndex : fcOutSub['recipientsUnit'].name,
            align : 'center',
            width : 120
        },{
            id : 'unit',
            header : fcOutSub['unit'].fieldLabel,
            dataIndex : fcOutSub['unit'].name,
            align : 'center',
            width : 80
        },{
            id : 'price',
            header : fcOutSub['price'].fieldLabel,
            dataIndex : fcOutSub['price'].name,
            align : 'right',
            width : 80
        },{
            id : 'outNum',
            header : fcOutSub['outNum'].fieldLabel,
            dataIndex : fcOutSub['outNum'].name,
            align : 'right',
            width : 80
        },{
            id : 'usenum',
            header : fcOutSub['usenum'].fieldLabel,
            dataIndex : fcOutSub['usenum'].name,
            align : 'right',
            width : 80,
            renderer : function(v,m,r){
                m.attr = "style=background-color:#FBF8BF";
                return v;
            }
        },{
            id : 'usemoney',
            header : fcOutSub['usemoney'].fieldLabel,
            dataIndex : fcOutSub['usemoney'].name,
            align : 'right',
            width : 80,
            renderer : function(v,m,r){
                m.attr = "style=background-color:#FBF8BF";
                return v;
            }
        }
    ]);
    var ColumnsOutSub = [
        {name:'uids', type:'string'},
        {name:'pid', type:'string'},
        {name:'conid', type:'string'},
        {name:'outuids', type:'string'},
        {name:'fixeduids', type:'string'},
        {name:'outId', type:'string'},
        {name:'equPartName', type:'string'},
        {name:'boxNo', type:'string'},
        {name:'using', type:'string'},
        {name:'recipientsUnit', type:'string'},
        {name:'unit', type:'string'},
        {name:'price', type:'float'},
        {name:'outNum', type:'float'},
        {name:'usenum', type:'float'},
        {name:'usemoney', type:'float'}
    ];
    dsOutSub = new Ext.data.Store({
        baseParams: {
            ac: 'list',
            bean: "com.sgepit.pmis.finalAccounts.complete.hbm.FacompFixedWzoutView",
            business: business,
            method: listMethod,
            params: "pid='"+CURRENTAPPID+"' and 1=2"
        },
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'uids'
        }, ColumnsOutSub),
        remoteSort: true,
        pruneModifiedRecords: true  
    });
    
    var jzgcClListGridPanel=new Ext.grid.GridPanel({
        ds : dsOutSub,
        cm : cmOutSub,
        sm : smOutSub,
        tbar :['材料清单','->',
            '当前概算材料总额：',{
                id : 'bdgcltotalmoney',
                xtype : 'textfield',
                value : 0,
                width : 120,
                style : 'text-align:right'
            },'元','-',
            '材料总额：',{
                id : 'cltotalmoney',
                xtype : 'textfield',
                value : 0,
                width : 120,
                style : 'text-align:right'
            },'元'
        ],
        region : 'center',
        frame : false,
        header : false,
        border : false,
        stripeRows : true,
        loadMask : true,
        viewConfig : {
            forceFit : false,
            ignoreAdd : true
        },
        bbar:new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: dsOutSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        listeners : {
            'celldblclick' : function(grid, rowIndex, columnIndex, e){
                var record = grid.getStore().getAt(rowIndex);
                var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
                //if(fieldName == 'usenum' || fieldName == 'usemoney'){
                    editNumOrMoneyWin.show();
                    var form = editNumOrMoneyForm.getForm();
                    form.findField('fixeduids').setValue(record.get('fixeduids'));
                    form.findField('outuids').setValue(record.get('outuids'));
                    form.findField('conid').setValue(record.get('conid'));
                    form.findField('usenum').setValue(record.get('usenum'));
                    form.findField('usemoney').setValue(record.get('usemoney'));
                //}
            }
        }
    });
    
    var editNumOrMoneyForm = new Ext.form.FormPanel({
        bodyStyle: 'padding:10px 5px;',
        labelAlign: 'right',
        items: [
            new fm.Hidden(fcOutSub['fixeduids']),
            new fm.Hidden(fcOutSub['outuids']),
            new fm.Hidden(fcOutSub['conid']),
            
            new fm.TextField(fcOutSub['usenum']),
            new fm.NumberField(fcOutSub['usemoney'])
        ],
        buttonAlign : 'center',
        buttons : [{
            text : '保存',
            iconCls : 'save',
            handler : function(){
                var form = editNumOrMoneyForm.getForm();
                var usenum = form.findField('usenum').getValue();
                var usemoney = form.findField('usemoney').getValue();
                //开始保存
                var fixeduids = form.findField('fixeduids').getValue();        
                var outuids = form.findField('outuids').getValue();        
                var conid = form.findField('conid').getValue();  
                    
                var sql = "update FACOMP_FIXED_ASSET_WZOUT_NUM " +
                        " set usenum=("+usenum+"),usemoney=("+usemoney+") " +
                        " where fixeduids='"+fixeduids+"' and conid='"+conid+"' " +
                        " and outuids='"+outuids+"'";        
                DWREngine.setAsync(false);
                baseDao.updateBySQL(sql,function(str){
                    if(str == '1'){
                        Ext.example.msg('提示','使用数量和金额保存成功！');
                        editNumOrMoneyWin.hide();
                        //dsOutSub.load({params:{start:0,limit:PAGE_SIZE}});
                        dsOutSub.reload();
                        update_wzout_sum();
                        var v = Ext.getCmp('cltotalmoney').getValue();
                        smCont.getSelected().set('clmoney',v);
                    }else{
                        Ext.example.msg('提示','保存失败！');
                    }
                });
                DWREngine.setAsync(true);
            }
        }, {
            text : '关闭',
            iconCls : 'remove',
            handler : function() {
                editNumOrMoneyWin.hide();
            }
        }]
    })
    
    var editNumOrMoneyWin = new Ext.Window({
        title : '修改使用数量和使用金额',
        width : 300,
        height : 140,
        border : false,
        modal : true,
        layout : 'fit',
        closeAction : 'hide',
        items : [editNumOrMoneyForm],
        listeners : {
            'show' : function(){
                
            },
            'hide' : function(){
                editNumOrMoneyForm.getForm().reset();
            }
        }
    })
    
    function update_wzout_sum(){
        var record = sm.getSelected();
        var fixeduids = record.get('uids');
        if(!!selectConid && !!selectedBdgid){
            //查询 "当前概算总金额"
            var sql2 = "SELECT nvl(sum(T.usemoney),0) usemoney FROM FACOMP_FIXED_WZOUT_VIEW T "
                    + " WHERE T.CONID = '"+selectConid+"' AND t.using = '"+selectedBdgid+"' "
                    + " AND T.BDGIDTYPE = '"+rootBdgid_cl+"'"
                    + " AND T.fixeduids = '"+fixeduids+"'"; 
            var sum2 = 0;
            DWREngine.setAsync(false);
            baseMgm.getData(sql2,function(list){
                sum2 = (list!=null&&list.length>0) ? list[0] : 0;
            });
            DWREngine.setAsync(true);
            Ext.getCmp('bdgcltotalmoney').setValue(sum2);
        }
        if(!!selectConid){
            //查询 "总金额"
            var sql1 = "SELECT nvl(sum(T.usemoney),0) usemoney FROM FACOMP_FIXED_WZOUT_VIEW T "
                    + " WHERE T.CONID = '" + selectConid + "' AND T.BDGIDTYPE = '"+rootBdgid_cl+"'";
            var sum1 = 0;
            DWREngine.setAsync(false);
            baseMgm.getData(sql1, function(list) {
                sum1 = (list!=null&&list.length>0) ? list[0] : 0;
            });
            DWREngine.setAsync(true);
            Ext.getCmp('cltotalmoney').setValue(sum1);
        }
            //查询 合同列表上"材料总额"
            var sql1 = "SELECT nvl(sum(T.usemoney),0) usemoney FROM FACOMP_FIXED_WZOUT_VIEW T "
                    + " WHERE T.BDGIDTYPE = '"+rootBdgid_cl+"'"
                    + " AND T.fixeduids = '"+fixeduids+"'"; 
            var sum3 = 0;
            DWREngine.setAsync(false);
            baseMgm.getData(sql1, function(list) {
                sum3 = (list!=null&&list.length>0) ? list[0] : 0;
            });
            DWREngine.setAsync(true);
            Ext.getCmp('conttotalmoney').setValue(sum3);
    }
    
    var bdgAndClPanel = new Ext.Panel({
        border : false,
        height : document.body.clientHeight * .5,
        region : 'south',
        layout : 'border',
        items : [bdgTreePanel,jzgcClListGridPanel]
    })
    
    
    jzgcClSelectWin = new Ext.Window({
        width : document.body.clientWidth * .96,
        height : document.body.clientHeight * .96,
        border : false,
        modal : true,
        layout : 'border',
        closeAction : 'hide',
        items : [jzgcClContGridPanel,bdgAndClPanel],
        listeners : {
            'show' : function(){
                dsCont.load({start:0,limit:PAGE_SIZE});
                selectContCombo.setValue('-1');
                jzgcClSelectWin.setTitle(rootText_cl.substring(0,2)+'工程 - 材料')
            },
            'hide' : function(){
                selectConid = '';
                bdgTreePanel.collapse();
                update_wzout_sum();
            }
        }
    });
});