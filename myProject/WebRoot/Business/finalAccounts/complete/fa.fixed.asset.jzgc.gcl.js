/**
 * 竣工决算 - 固定资产 
 * 固定资产信息中，建筑工程 - 工程量，安装工程 - 工程量 取值窗口
 * @author zhangh 2013-07-17 
 */

var jzgcGclSelectContWin,jzgcGclListWin
var partBs = new Array();
var contarctType2 = new Array()
contarctType2.push(['-1', '所有合同'])

var selectConid = '';
var selectConno = '';
var selectConname = '';
var selectedBdgid = '';
var selectedPath = '';
var myMask;

var rootText_gcl = '建筑部分';
var rootBdgid_gcl = CURRENTAPPID+'-0101';
var editFieldtype_gcl = 'jzgc_Gcl';

Ext.onReady(function(){
    var fm = Ext.form;
    
    //TODO:建筑工程-工程量
    //建筑工程 - 工程量：选中合同列表
    DWREngine.setAsync(false);
    conpartybMgm.getPartyB(function(list) { // 获取乙方单位
        for (i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i].cpid);
            temp.push(list[i].partyb);
            partBs.push(temp);
        }
    }); 
    appMgm.getCodeValue('施工合同', function(list1) {
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
        //{name:'conmoneyno',type:'string'},
        {name:'conname',type:'string'},
        {name:'partybno',type:'string'},
        {name:'condivno',type:'string'},
        {name:'sotr',type:'string'}
    ];
    var smCont = new Ext.grid.CheckboxSelectionModel({
        singleSelect : true
    });
	smCont.on('rowselect', function() {
				var recordCont = smCont.getSelected();
				selectConid = recordCont.get('conid');
				var record = sm.getSelected();
//				var fixeduids = record.get('uids')
				// 选择合同后，异步初始化数据，将投资完成工程量和金额，赋值给所属工程量和金额
//				faFixedAssetService.initFacompFixedAssetBdgNum(fixeduids, selectConid, rootBdgid_gcl);
				rootNew.reload();
				update_tzwc_sum();
			})

    var cmCont = new Ext.grid.ColumnModel([
        smCont,
        {id:'conid',header:'合同主键',dataIndex:'conid',hidden:true},
        {id:'pid',header:'PID',dataIndex:'pid',hidden:true},
        {id:'condivno',header:'分类一',dataIndex:'condivno',hidden:true},
        {id:'sotr',header:'分类二',dataIndex:'sotr',hidden:true},
        {id:'conno',header:'合同编号',dataIndex:'conno',width:120},
        //{id:'conmoneyno',header:'财务合同编号',dataIndex:'conmoneyno',width:120},
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
        }
    ]);
    var dsCont = new Ext.data.Store({
        baseParams : {
            ac : 'list',
            bean : 'com.sgepit.pmis.contract.hbm.ConOve',
            business : business,
            method : listMethod,
            params : "condivno = 'SG'"
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

	dsCont.on('load', function() {
		if (dsCont.getCount() > 0) {
			smCont.selectFirstRow();
			bdgTreePanel.expand();
		} else {
			bdgTreePanel.collapse();
		}
	})

    // 建筑工程 - 工程量：合同分类二下拉菜单
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
                    dsCont.baseParams.params = "condivno='SG'";
                }else{
                    dsCont.baseParams.params = "condivno='SG' and sort='"+v+"'";
                }
                dsCont.load({start:0,limit:PAGE_SIZE});
            }
        }
    });
/**    var selectContBtn = new Ext.Button({
        text : '确定选择',
        iconCls : 'btn',
        handler : function(){
            var record = smCont.getSelected();
            if(!record){
                Ext.example.msg('提示','请先选择合同！');
                return;
            }
            selectConid = record.get('conid');
            selectConno = record.get('conno');
            selectConname = record.get('conname');
            var record = sm.getSelected();
            var fixeduids = record.get('uids')
            jzgcGclSelectContWin.hide();
            //选择合同后，异步初始化数据，将投资完成工程量和金额，赋值给所属工程量和金额
            faFixedAssetService.initFacompFixedAssetBdgNum(fixeduids,selectConid,rootBdgid_gcl);
            myMask = new Ext.LoadMask(Ext.getBody(), {msg: "数据处理中，请稍等 ！"});
            myMask.show();
            setTimeout("myMask.hide();jzgcGclListWin.show();",2000);
        }
    })*/
    //建筑工程 - 工程量：合同列表
    var jzgcGclSelectContGridPanel=new Ext.grid.GridPanel({
        ds : dsCont,
        sm : smCont,
        cm : cmCont,
//        tbar :['施工合同分类：',selectContCombo,'-',selectContBtn],
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
    cmCont.defaultSortable = true;
    
    //建筑工程 - 工程量：选择合同窗口
/**    jzgcGclSelectContWin = new Ext.Window({
        title : '选择施工合同信息',
        width : 780,
        height : 380,
        border : false,
        modal : true,
        layout : 'fit',
        closeAction : 'hide',
        items : [jzgcGclSelectContGridPanel],
        listeners : {
            'show' : function(){
                dsCont.load({start:0,limit:PAGE_SIZE});
                selectContCombo.setValue('-1');
            }
        }
    }); */
    
    //----------------------------------
    //建筑工程 - 工程量：概算树
    //生成概算树
    
    var rootNew = new Ext.tree.AsyncTreeNode({
        text : rootText_gcl,
        iconCls : 'task-folder',
        id : rootBdgid_gcl
    })
    //获取所选合同的概算分摊中的建筑部分
    var treeLoaderNew = new Ext.tree.TreeLoader({
        url: MAIN_SERVLET,
        baseParams: {
            ac:"columntree", 
            treeName:"getBdgTree", 
            businessName:"faFixedAssetService",
            conid : selectConid,
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
        minSize: 100,
        maxSize: 700,
        frame: false,
        header: false,
        border: false,
        split : true,
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

    bdgTreePanel.on('beforeload', function(node) {
        bdgid = node.attributes.bdgid;
        if (bdgid == null)
            bdgid = rootBdgid_gcl;
            
        rootNew.setText(rootText_gcl);
        var baseParams = bdgTreePanel.loader.baseParams
        baseParams.parentid = bdgid;
        baseParams.conid = selectConid;
        baseParams.pid = CURRENTAPPID;
    })
    
    bdgTreePanel.on('click', function(node, e){
        var tempNode = node
        selectedBdgid = tempNode.attributes.bdgid;
        dsGcl.load({start:0,limit:PAGE_SIZE});
        update_tzwc_sum();
    });

    bdgTreePanel.on('load', function() {
		rootNew.expand(false, false, null);
		dsGcl.load();
	});

    //查询 "当前概算工程量总金额"和"工程量总金额"
    function update_tzwc_sum(){
        var record = sm.getSelected();
        var fixeduids = record.get('uids');
        if(!!selectConid && !!selectedBdgid){
            //查询 "当前概算工程量总金额"
	        var sql2 = "SELECT nvl(sum(T.tzwc_je),0) je FROM FACOMP_ASSET_LIST_REPORT_VIEW T WHERE PID='"
	                + CURRENTAPPID + "' AND T.CONID='"+selectConid+"' AND T.BDGID like '"+selectedBdgid+"%'";
	        var sum2 = 0;
	        
	        DWREngine.setAsync(false);
	        baseMgm.getData(sql2,function(list){
	            sum2 = (list!=null&&list.length>0) ? list[0] : 0;
	        });
	        DWREngine.setAsync(true);
	        Ext.getCmp('dq_tzwc_sum').setValue(sum2);
        }
        if(!!selectConid){
            //查询 "工程量总金额"
            var sql1 = "SELECT nvl(sum(T.tzwc_je),0) je FROM FACOMP_ASSET_LIST_REPORT_VIEW T WHERE PID='"
                    + CURRENTAPPID + "' AND T.CONID='" + selectConid + "' AND T.BDGID like '"+rootBdgid_gcl+"%'";
            var sum1 = 0;
            DWREngine.setAsync(false);
            baseMgm.getData(sql1, function(list) {
                sum1 = (list!=null&&list.length>0) ? list[0] : 0;
            });
            DWREngine.setAsync(true);
            Ext.getCmp('tzwc_sum').setValue(sum1);
        }
    }
    
    //建筑工程 - 工程量：工程量树
    var conUnit = new Array();
    DWREngine.setAsync(false);
    appMgm.getCodeValue('工程量施工单位',function(list){
        for(i = 0; i<list.length; i++){
            var temp = new Array(); 
            temp.push(list[i].propertyCode);        
            temp.push(list[i].propertyName);                
            conUnit.push(temp)
        }
    });
    DWREngine.setAsync(true);
    var fc={
        'proappid':{name:'proappid',fieldLabel:'工程量主键'},
        'pid':{name:'pid',fieldLabel:'pid'},
        'conid':{name:'conid',fieldLabel:'合同主键'},
        'bdgid':{name:'bdgid',fieldLabel:'概算主键'},
        'proname':{name:'proname',fieldLabel:'工程量名称'},
        'prono':{name:'prono',fieldLabel:'工程量编码'},
        'unit':{name:'unit',fieldLabel:'单位'},
        'price':{name:'price',fieldLabel:'单价'},
        'parent':{name:'parent',fieldLabel:'父节点编号'},
        'isleaf':{name:'isleaf',fieldLabel:'是否是叶子节点'},
        'treeid':{name:'treeid',fieldLabel:'工程量编码'},
        'constructionUnit':{name:'constructionUnit',fieldLabel:'施工单位'}
        
        ,'tzwcGcl':{name:'tzwcGcl',fieldLabel:'投资完成工程量'}
        ,'tzwcJe':{name:'tzwcJe',fieldLabel:'投资完成金额'}
//        ,'fixeduids':{name:'fixeduids',fieldLabel:'固定资产信息主键'}
//        ,'gcl':{name:'gcl',fieldLabel:'所属工程量',anchor:'95%'}
//        ,'je':{name:'je',fieldLabel:'所属金额',anchor:'95%'}
        ,'isper':{name:'isper',fieldLabel:'百分比'}
    }
    
    var Columns = [
        {name: 'proappid', type: 'string'},
        {name: 'pid', type : 'string'},
        {name: 'conid', type: 'string'},
        {name: 'bdgid', type: 'string'},        
        {name: 'prono', type: 'string'},
        {name: 'proname', type: 'string'},
        {name: 'unit', type: 'string'},
        {name: 'price', type: 'float'},
        {name: 'parent', type: 'string'},
        {name: 'isleaf', type: 'float'},
        {name: 'treeid', type: 'string'},
        {name: 'constructionUnit', type: 'string'}
        
        ,{name: 'tzwcGcl', type: 'float'}
        ,{name: 'tzwcJe', type: 'float'}
//        ,{name: 'fixeduids', type: 'string'}
//        ,{name: 'gcl', type: 'float'}
//        ,{name: 'je', type: 'float'}
        ,{name: 'isper', type: 'string'}
        ];
        
    
    var columns = [
        {
           id:'proappid',
           header: fc['proappid'].fieldLabel,
           dataIndex: fc['proappid'].name,
           hidden:true
        }, {
            id : 'pid',
            header : fc['pid'].fieldLabel,
            dataIndex : fc['pid'].name,
            hidden : true
        },{
           id:'conid',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,
           hidden:true
        }, {
           id:'bdgid',
           header: fc['bdgid'].fieldLabel,
           dataIndex: fc['bdgid'].name,
           hidden:true
        },{
           id:'proname',
           header: fc['proname'].fieldLabel,
           dataIndex: fc['proname'].name,
           width: 200
        },{
           id:'prono',
           header : fc['prono'].fieldLabel,
           dataIndex : fc['prono'].name,
           width :80
        }, {
           id:'unit',
           header: fc['unit'].fieldLabel,
           dataIndex: fc['unit'].name,
           width: 80,
           align : 'center'
        }, {
           id:'price',
           align: 'price',
           header: fc['price'].fieldLabel,
           dataIndex: fc['price'].name,
           width: 100,
           align: 'right'
        },{
           id:'parent',
           header: fc['parent'].fieldLabel,
           dataIndex: fc['parent'].name,
           hidden:true
       },{
           id:'isleaf',
           header: fc['isleaf'].fieldLabel,
           dataIndex: fc['isleaf'].name,
           hidden:true
       },{
           id:'treeid',
           header: fc['treeid'].fieldLabel,
           dataIndex: fc['treeid'].name,
           hidden:true
       },{
           id:'constructionUnit',
           header: fc['constructionUnit'].fieldLabel,
           dataIndex: fc['constructionUnit'].name,
           renderer : function(v){
                for (var i = 0; i < conUnit.length; i++) {
                    if(conUnit[i][0] == v){
                        return conUnit[i][1];
                    }
                }
           },
           width :160
        }
        ,{
			id:'tzwcGcl',
			header: fc['tzwcGcl'].fieldLabel,
			dataIndex: fc['tzwcGcl'].name,
            align: 'right',
            renderer : function(value,cell,record){
                if(record.get('isper') == '1')
                    return (value*100).toFixed(2)+"%";
                else
                    return value;
           }
        },{
            id:'tzwcJe',
            header: fc['tzwcJe'].fieldLabel,
            dataIndex: fc['tzwcJe'].name,
            align: 'right'
        },
/**        {
            id:'fixeduids',
            header: fc['fixeduids'].fieldLabel,
            dataIndex: fc['fixeduids'].name,
            hidden : true
        },{
            id:'gcl',
            header: fc['gcl'].fieldLabel,
            dataIndex: fc['gcl'].name,
            align: 'right',
            renderer : function(value,cell,record){
                cell.attr = "style=background-color:#FBF8BF";
                if(record.get('isper') == '1')
                    return (value*100).toFixed(2)+"%";
                else
                    return value;
            }
        },{
            id:'je',
            header: fc['je'].fieldLabel,
            dataIndex: fc['je'].name,
            align: 'right',
            renderer : function(v,m,r){
                m.attr = "style=background-color:#FBF8BF";
                return v;
            }
        },*/
        {
            id : 'isper',
            header : fc['isper'].fieldLabel,
            dataIndex : fc['isper'].name,
            hidden : true
        }
    ];
    
    var smGcl = new Ext.grid.CheckboxSelectionModel({
        singleSelect : true
    })
    var cmGcl = new Ext.grid.ColumnModel(columns);
    
    var dsGcl = new Ext.data.Store({
        baseParams : {
            ac : 'list',
            bean : 'com.sgepit.pmis.finalAccounts.complete.hbm.FacompAssetListReportView',
            business : business,
            method : listMethod,
            params : "1=2"
        },
        proxy : new Ext.data.HttpProxy({
            method : 'GET',
            url : MAIN_SERVLET
        }),
        reader : new Ext.data.JsonReader({
            root : 'topics',
            totalProperty : 'totalCount',
            id : 'proappid'
        }, Columns),
        remoteSort : true,
        pruneModifiedRecords : true
    })

    dsGcl.on('beforeload', function() {
    	if (!selectConid){
    		return false;
    	}
		if (selectedBdgid == null || selectedBdgid == '') {
			selectedBdgid = rootBdgid_gcl;
		}
		var record = sm.getSelected();
		var treeid = record.get('treeid');
		dsGcl.baseParams.params = "pid = '" + CURRENTAPPID + "' and bdgid like '" + selectedBdgid
				+ "%' and conid = '" + selectConid + "' and fixedAssetList = '" + treeid + "'";
	})

    var treeGridPanel = new Ext.grid.GridPanel({
        ds : dsGcl,
        sm : smGcl,
        cm : cmGcl,
        tbar :['<font color=#15428b><B>工程量结构清单<B></font>',
/**            {
                xtype : 'button',
                text : '确定选择',
                iconCls : 'btn',
                handler : function(){
                    var v = Ext.getCmp('tzwc_sum').getValue();
                    var record = sm.getSelected();
                    var fixeduids = record.get('uids');
                    var sql = "update Facomp_Fixed_Asset " +
                        " set "+editFieldtype_gcl+"=("+v+") " +
                        " where uids='"+fixeduids+"'";        
                    DWREngine.setAsync(false);
                    baseDao.updateBySQL(sql,function(str){
                        if(str == '1'){
                            Ext.example.msg('提示','【'+rootText_gcl.substring(0,2)+'-工程量】 操作成功！');
                            ds.load();
                            jzgcGclListWin.hide();
                        }else{
                            Ext.example.msg('提示','保存失败！');
                        }
                    });
                    DWREngine.setAsync(true);
                    
                }
            },*/
            '->','当前概算工程量总金额：',{
                id : 'dq_tzwc_sum',
                xtype : 'textfield',
                value : 0,
                width : 120,
                style : 'text-align:right'
            },'元',
            '-','工程量总金额：',{
                id : 'tzwc_sum',
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
            forceFit : false,
            ignoreAdd : true
        },
        bbar:new Ext.PagingToolbar({
            pageSize: PAGE_SIZE,
            store: dsGcl,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
    })
/**        listeners : {
            'celldblclick' : function(grid, rowIndex, columnIndex, e){
                var record = grid.getStore().getAt(rowIndex);
                var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
                //点击工程量或金额后开启编辑窗口
                //if(fieldName == 'gcl' || fieldName == 'je'){
                    editGclOrJeWin.show();
                    var form = editGclOrJeForm.getForm();
                    form.findField('fixeduids').setValue(record.get('fixeduids'));
                    form.findField('proappid').setValue(record.get('proappid'));
                    form.findField('conid').setValue(record.get('conid'));
                    var isper = record.get('isper');
                    form.findField('isper').setValue(isper);
                    var gcl = record.get('gcl');
                    if(isper == '1'){
                        gcl = (gcl*100).toFixed(2)+"%";
                    }
                    form.findField('gcl').setValue(gcl);
                    form.findField('je').setValue(record.get('je'));
                //}
            }
        }
    })

    var editGclOrJeForm = new Ext.form.FormPanel({
        bodyStyle: 'padding:10px 5px;',
        labelAlign: 'right',
        items: [
            new fm.Hidden(fc['fixeduids']),
            new fm.Hidden(fc['proappid']),
            new fm.Hidden(fc['conid']),
            new fm.Hidden(fc['isper']),
            
            new fm.TextField(fc['gcl']),
            new fm.NumberField(fc['je'])
        ],
        buttonAlign : 'center',
        buttons : [{
            text : '保存',
            iconCls : 'save',
            handler : function(){
                var form = editGclOrJeForm.getForm();
                var gcl = form.findField('gcl').getValue()+"";
                var je = form.findField('je').getValue();
	            var strRegular=/^(\-)?(0|[0-9](\d)*)(\.(\d)+)?(\%)?$/;
	            if(!strRegular.test(gcl)){
	                Ext.example.msg('提示','工程量输入格式不对，只能输入数字或百分数！');
	                return false;
	            }
                if(gcl != '0'){
	                if(form.findField('isper').getValue() == '1'){
	                    if(gcl.indexOf('%') < 0){
	                        Ext.example.msg('提示','投资完成工程量为百分数，因此只能输入百分数！');
	                        return false;  
	                    }
	                }else{
	                    if(gcl.indexOf('%') > 0){
	                        Ext.example.msg('提示','投资完成工程量为数字类型，因此只能输入数字类型！');
	                        return false;  
	                    }
	                }
	            }
                //开始保存
                //判断工程量是否有输入百分号
	            if(gcl.indexOf('%') > 0){
	                gcl=parseFloat((gcl.substring(0,gcl.indexOf('%'))))/100;
	            }
                var fixeduids = form.findField('fixeduids').getValue();        
                var proappid = form.findField('proappid').getValue();        
                var conid = form.findField('conid').getValue();  
                    
                var sql = "update Facomp_Fixed_Asset_Bdg_Num " +
                        " set gcl=("+gcl+"),je=("+je+") " +
                        " where fixeduids='"+fixeduids+"' and conid='"+conid+"' " +
                        " and proappid='"+proappid+"'";        
                DWREngine.setAsync(false);
                baseDao.updateBySQL(sql,function(str){
                    if(str == '1'){
	                    Ext.example.msg('提示','工程量和金额保存成功！');
                        editGclOrJeWin.hide();
                        dsGcl.load({start:0,limit:PAGE_SIZE});
                        update_tzwc_sum();
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
                editGclOrJeWin.hide();
            }
        }]
    })
    
    var editGclOrJeWin = new Ext.Window({
        title : '修改所属工程量和所属金额',
        width : 300,
        height : 140,
        border : false,
        modal : true,
        layout : 'fit',
        closeAction : 'hide',
        items : [editGclOrJeForm],
        listeners : {
            'show' : function(){
                
            },
            'hide' : function(){
                editGclOrJeForm.getForm().reset();
            }
        }
    });*/

	var bdgAndGclPanel = new Ext.Panel({
		border : false,
		height : document.body.clientHeight * .5,
		region : 'south',
		layout : 'border',
		items : [bdgTreePanel, treeGridPanel]
	})

    //建筑工程 - 工程量：工程量列表
    jzgcGclListWin = new Ext.Window({
        width : document.body.clientWidth * .96,
        height : document.body.clientHeight * .96,
        border : false,
        modal : true,
        layout : 'border',
        closeAction : 'hide',
/**        tbar : ['所选合同名称：' +
	        '<span id="selectconname" style="font-weight:700;"></span>','-',
            {
	            xtype : 'button',
	            text : '重新选择合同',
	            iconCls : 'add',
	            handler : function(){
	                jzgcGclSelectContWin.show();
	                jzgcGclListWin.hide();
                    selectConid = selectConname = selectConno = "";
                    selectedBdgid = "";
	            }
	        }],*/
        items : [jzgcGclSelectContGridPanel, bdgAndGclPanel],
        listeners : {
            'show' : function() {
				var treeid = sm.getSelected().get('treeid');
            	DWREngine.setAsync(false);
            	var conidstr = "''";
            	var sql = "select distinct(t.conid) from FACOMP_ASSET_LIST_REPORT_VIEW t where t.bdgid like '"
            			+ rootBdgid_gcl + "%' and t.fixed_asset_list = '" + treeid + "'";
            	baseMgm.getData(sql, function(list){
            		for (var i=0; i<list.length; i++){
            			if (i==0){
            				conidstr = "'" + list[0] + "'";
            			}else {
            				conidstr += ",'" + list[i] + "'";
            			}
            		}
            	})
            	DWREngine.setAsync(true);
            	dsCont.baseParams.params = "condivno = 'SG' and conid in (" + conidstr + ")"
            	dsCont.load({start:0,limit:PAGE_SIZE});
                dsGcl.removeAll();
                jzgcGclListWin.setTitle(rootText_gcl.substring(0,2)+'工程 - 工程量');
			},
            'hide' : function(){
                selectConid = '';
                selectedBdgid = '';
                bdgTreePanel.collapse();
            }
        }
    });
})