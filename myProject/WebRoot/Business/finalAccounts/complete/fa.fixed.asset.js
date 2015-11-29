var bean = "com.sgepit.pmis.finalAccounts.complete.hbm.FacompFixedAsset";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = "uids";
var orderColumn = "uids";

var tmpLeaf;
//固定资产详细信息配置参数
var gridPanel,ds,sm,cm;

Ext.onReady(function(){
    
    //TODO:固定资产清单树
    var fm = Ext.form;
    
    var fcTree = {
        'uids' : {name:'uids',fieldLabel:'主键',readOnly:true},
        'pid' : {name:'pid',fieldLabel:'PID',readOnly:true},
        'treeid' : {name:'treeid',fieldLabel:'节点编号',readOnly:true},
        'parentid' : {name:'parentid',fieldLabel:'父节点编号',readOnly:true},
        'isleaf' : {name:'isleaf',fieldLabel:'叶子节点',readOnly:true},
        'fixedname' : {name:'fixedname',fieldLabel:'固定资产名称',allowBlank:false,width:160},
        'fixedno' : {name:'fixedno',fieldLabel:'固定资产编号',allowBlank:false,width:160}
    };
    
    var ColumnsTree = [
        {id:'uids',header:fcTree['uids'].fieldLabel,dataIndex:fcTree['uids'].name,hidden:true},
        {id:'pid',header:fcTree['pid'].fieldLabel,dataIndex:fcTree['pid'].name,hidden:true},
        {id:'treeid',header:fcTree['treeid'].fieldLabel,dataIndex:fcTree['treeid'].name,hidden:true},
        {id:'parentid',header:fcTree['parentid'].fieldLabel,dataIndex:fcTree['parentid'].name,hidden:true},
        {id:'isleaf',header:fcTree['isleaf'].fieldLabel,dataIndex:fcTree['isleaf'].name,hidden:true},
        {id:'fixedname',header:fcTree['fixedname'].fieldLabel,dataIndex:fcTree['fixedname'].name,width:240},
        {id:'fixedno',header:fcTree['fixedno'].fieldLabel,dataIndex:fcTree['fixedno'].name,width:120}
    ];
    
    var root = new Ext.tree.AsyncTreeNode({
        id : "01",
        text : "固定资产",
        expanded : true,
        iconCls : 'form'
    })
    
    var treeLoader = new Ext.tree.TreeLoader({
        url: MAIN_SERVLET,
        baseParams: {
            ac:"columntree", 
            treeName:"getFACompFixedAssetList", 
            businessName:"faFixedAssetService",
            parentid:"0",
            pid: CURRENTAPPID
        },
        clearOnLoad: true,
        uiProviders:{
            'col': Ext.tree.ColumnNodeUI
        }
    });
    
    var addTreeBtn = new Ext.Button({
        id : 'tree_add',
        text : '新增',
        iconCls : 'add',
        handler : toHandler
    });
    var editTreeBtn = new Ext.Button({
        id : 'tree_edit',
        text : '修改',
        iconCls : 'btn',
        handler : toHandler
    });
    var delTreeBtn = new Ext.Button({
        id : 'tree_del',
        text : '删除',
        iconCls : 'remove',
        handler : toHandler
    });
    
    var treePanelObj = {
        id : 'list',
        region: 'west',
        width: 240,
        minSize: 240,
        maxSize: 550,
        frame: false,
        header: false,
        border: false,
        collapsible : true,
        collapseMode : 'mini',
        rootVisible: true,
        split: true,
        lines: true,
        autoScroll: true,
        animate: false,
        tbar: [
        '<font color=#15428b><b>固定资产清单</b></font>','-',
        {
            iconCls: 'icon-expand-all',
            tooltip: '全部展开',
            handler: function(){ root.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function(){ root.collapse(true); }
        }
        //,'-',addTreeBtn,'-',editTreeBtn,'-',delTreeBtn
        ],
        columns:[{
            header: '固定资产名称',
            dataIndex: 'fixedname',
            width: 380
        },{
            header: '固定资产编码',
            dataIndex: 'fixedno',
            width: 160
        },{
            header: '主键',
            dataIndex: 'uids',
            width: 0,
            renderer: function(value){
                return "<div id='uids'>"+value+"</div>";
            }
        },{
            header: '树编码',
            dataIndex: 'treeid',
            width: 0,
            renderer: function(value){
                return "<div id='treeid'>"+value+"</div>";
            }
        }, {
            header: '是否子节点',
            dataIndex: 'isleaf',
            width: 0,
            renderer: function(value){
                return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '父节点',
            dataIndex: 'parentid',
            width: 0,
            renderer: function(value){
                return "<div id='parentid'>"+value+"</div>";
            }
        }], 
        loader: treeLoader,
        root: root
    };

    var treePanel = new Ext.tree.ColumnTree(treePanelObj);
    
    treePanel.on('contextmenu', contextmenu, this);
    function contextmenu(node, e) {
        e.preventDefault();//阻止系统默认的右键菜单
        e.stopEvent();
        node.fireEvent("click", node, e)
        var menuAdd = {
            id : 'tree_add',
            text : '　新增',
            iconCls : 'add',
            handler : toHandler
        };
        var menuUpdate = {
            id : 'tree_edit',
            text : '　修改',
            iconCls : 'btn',
            handler : toHandler
        };
        var menuDelete = {
            id : 'tree_del',
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
    
    treePanel.on('beforeload', function(node) {
        var treeid = node.attributes.treeid;
        if (treeid == null){
            treeid = "01";
        }
        treePanel.loader.baseParams.parentid = treeid
        treePanel.loader.baseParams.pid = CURRENTAPPID;
    });
    
    treePanel.on('click', onClick);
    function onClick(node, e){
        var elNode = node.getUI().elNode;
        var isRoot = node == root;
        if(isRoot){
            ds.baseParams.params = "pid = '"+CURRENTAPPID+"'";
        }else{
            var treeid = node.attributes.treeid;
            ds.baseParams.params = "pid = '"+CURRENTAPPID+"' and treeid like '"+treeid+"%'";
        }
        ds.load();
    }
    
    function toHandler(){
        var state = this.id;
        var selNode = treePanel.getSelectionModel().getSelectedNode();
        if(!selNode){
            Ext.example.msg('提示！', '请先选中需要操作的节点！');
            return;
        }
        var uids = selNode.attributes.uids;
        var treeid = selNode.attributes.treeid;
        var parentid = selNode.attributes.parentid;
        var isleaf = selNode.attributes.isleaf;
        
        if(selNode == root && state != 'tree_add'){
            Ext.example.msg('提示！', '根节点不允许编辑！');
            return;
        }
        if(selNode == root){
            udis = '0';
            treeid = '01';
        }
        
        if(state == 'tree_add'){
            treeFromPanel.isNew = false;
            treeFromWin.show();
            treeFromPanel.getForm().reset();
            var newTreeid = "";
            DWREngine.setAsync(false);
            faFixedAssetService.getNewTreeid(CURRENTAPPID, treeid, "treeid",
                "FACOMP_FIXED_ASSET_LIST", null, function(str) {
                newTreeid = str;
            });
            DWREngine.setAsync(true);
            var formRecord = Ext.data.Record.create(ColumnsTree);
            loadFormRecord = new formRecord({
                uids : '',
                pid : CURRENTAPPID,
                treeid : newTreeid,
                isleaf : 1,
                parentid : treeid
            });
            treeFromPanel.getForm().loadRecord(loadFormRecord);
        }else if(state == 'tree_edit'){
            treeFromPanel.isNew = true;
            treeFromWin.show();
            treeFromPanel.getForm().reset();
            var formRecord = Ext.data.Record.create(ColumnsTree);
            loadFormRecord = new formRecord({
                uids : uids,
                pid : CURRENTAPPID,
                treeid : treeid,
                isleaf : isleaf,
                parentid : parentid,
                fixedname : selNode.attributes.fixedname,
                fixedno : selNode.attributes.fixedno
            });
            treeFromPanel.getForm().loadRecord(loadFormRecord);
        }else if(state == 'tree_del'){
            if(isleaf == '0'){
                Ext.example.msg('提示！', '节点下包含有子节点，无法删除。');
                return;
            }else if(parentid == '0'){
                Ext.example.msg('提示！', '根节点无法删除。');
                return;
            }
            //查询该固定资产是否有详细信息
            var haxFixed = "0";
            DWREngine.setAsync(false);
            faFixedAssetService.listHasFACompFixedAsset(uids, function(str) {
                haxFixed = str;
            });
            DWREngine.setAsync(true);
            if(haxFixed == "1"){
                Ext.example.msg('提示！', '节点已关联固定资产信息，不允许删除。');
                return;
            }
            //查询该固定资产在其他费用中是否有使用
            DWREngine.setAsync(false);
                //后续补充完善操作
            DWREngine.setAsync(true);
            
            Ext.Msg.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn, text) {
                if (btn == "yes"){
                    DWREngine.setAsync(false);
                    faFixedAssetService.deleteFACompFixedAssetList(uids, function(str) {
                        if(str == "1"){
                            Ext.example.msg('提示！', '您成功删除了 1 条记录。');
                            selectCrrentTreeNode('del');
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
    
    //TODO:新增修改固定资产清单表单
    var treeFromPanel = new Ext.FormPanel({
        width : 320,
        bodyStyle: 'padding:10px 5px;border-left:1px #B5B8C8 solid;',
        labelAlign: 'right',
        items: [
                new fm.Hidden(fcTree['uids']),
                new fm.Hidden(fcTree['pid']),
                new fm.Hidden(fcTree['treeid']),
                new fm.Hidden(fcTree['parentid']),
                new fm.Hidden(fcTree['isleaf']),
                new fm.TextField(fcTree['fixedno']),
                new fm.TextField(fcTree['fixedname'])
            ],
        buttonAlign : 'center',
        buttons : [{
			text : '保存',
			iconCls : 'save',
			handler : formSave
		}, {
			text : '关闭',
			iconCls : 'remove',
			handler : function() {
				treeFromWin.hide();
			}
		}]
    });
    
    //TODO:新增修改固定资产清单窗口
    var treeFromWin = new Ext.Window({
        title : '固定资产清单',
        width : 350,
        height : 140,
        border : false,
        modal : true,
        layout : 'fit',
        closeAction : 'hide',
        items : [treeFromPanel]
    });
    
    function formSave(){
        var form = treeFromPanel.getForm();
        if(form.isValid()){
            if (treeFromPanel.isNew) {
                doFormSave(true,tmpLeaf)  //修改
            } else {
                doFormSave(false,tmpLeaf)//新增
            }
        }
    }
    
    function doFormSave(isNew,leaf){
        var form = treeFromPanel.getForm();
        var obj = new Object();
        for (var i=0; i<ColumnsTree.length; i++){
            var name = ColumnsTree[i].id;
            var field = form.findField(name);
            if (field) obj[name] = field.getValue();
        }
        DWREngine.setAsync(false);
        faFixedAssetService.saveOrUpdateFACompFixedAssetList(obj,function(str){
            if(str == "1"){
                Ext.example.msg('提示！', '您成功保存了 1 条记录。');
                treeFromWin.hide();
                selectCrrentTreeNode(isNew);
                ds.reload();
            }else{
                Ext.example.msg('提示！', '保存失败。');
            }
        });
        DWREngine.setAsync(true);
    }
    
    //定位到上次选择的树节点           
    function selectCrrentTreeNode(state){
        var selNode = treePanel.getSelectionModel().getSelectedNode();
        if(selNode == root) root.reload();
        if(selNode){
            var path = selNode.getPath();
            if(selNode.parentNode && selNode.parentNode.parentNode && state == 'del'){
                selNode.parentNode.parentNode.reload();
            }else if(selNode.parentNode && state == true){
                //修改
                selNode.parentNode.reload();
            }else {
                //新增
                if(selNode.attributes.isleaf == '0'){
                    selNode.reload();
                }else{
                    if(selNode.parentNode)selNode.parentNode.reload();
                }
            }
        }
     }
    
    
    
    
    //TODO:固定资产
    var typetreeArr = new Array();
    var listtreeArr = new Array();
    DWREngine.setAsync(false);
    var sql1 = "select t.uids,t.treeid,t.fixedno,t.fixedname from Facomp_Fixed_Asset_Tree t";
    baseDao.getData(sql1,function(list){
        for(i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);          
            temp.push(list[i][1]);          
            temp.push(list[i][2]);          
            temp.push(list[i][3]);          
            typetreeArr.push(temp);         
        }
    });
    
    var sql2 = "select t.uids,t.treeid,t.fixedno,t.fixedname from Facomp_Fixed_Asset_List t";
    baseDao.getData(sql2,function(list){
        for(i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);          
            temp.push(list[i][1]);          
            temp.push(list[i][2]);          
            temp.push(list[i][3]);          
            listtreeArr.push(temp);         
        }
    });
    DWREngine.setAsync(true);
	var typetreeDs = new Ext.data.SimpleStore({
	   fields: ['k', 'v'],   
	   data: typetreeArr
	});
	var listtreeDs = new Ext.data.SimpleStore({
	   fields: ['k', 'v'],   
	   data: listtreeArr
	});
    var fc = {
        'uids' : {name : 'uids', fieldLabel : '主键',anchor : '95%'},
        'pid' : {name : 'pid', fieldLabel : 'PID',anchor : '95%'},
        'treeuids' : {name : 'treeuids', fieldLabel : '固定资产树主键',anchor : '95%'},
        'treeid' : {name : 'treeid', fieldLabel : '固定资产树节点编码',anchor : '95%'},
        'fixedno' : {name : 'fixedno', fieldLabel : '固定资产编码', readOnly:true,anchor : '95%'},
        'fixedname' : {name : 'fixedname', fieldLabel : '固定资产名称',readOnly:true,anchor : '95%'},
        'typetreeuids' : {name : 'typetreeuids', fieldLabel : '固定资产分类',anchor : '95%'},
        'typetreeid' : {name : 'typetreeid', fieldLabel : '固定资产分类',anchor : '95%'},
        'remark' : {name : 'remark', fieldLabel : '摘要',anchor : '95%'},
        'constructionUnit' : {name : 'constructionUnit', fieldLabel : '施工单位',anchor : '95%'},
        'deliveryUnit' : {name : 'deliveryUnit', fieldLabel : '供货单位',anchor : '95%'},
        'unit' : {name : 'unit', fieldLabel : '单位',anchor : '95%'},
        'num' : {name : 'num', fieldLabel : '数量',anchor : '95%'}
        ,'jgcc' : {name : 'jgcc', fieldLabel : '结构及层次',anchor : '95%'}
        ,'scwz' : {name : 'scwz', fieldLabel : '所处位置',anchor : '95%'}
        ,'jzgcGcl' : {name : 'jzgcGcl', fieldLabel : '建筑工程-工程量',anchor : '95%'}
        ,'jzgcCl' : {name : 'jzgcCl', fieldLabel : '建筑工程-材料',anchor : '95%'}
        ,'azgcGcl' : {name : 'azgcGcl', fieldLabel : '安装工程-工程量',anchor : '95%'}
        ,'azgcCl' : {name : 'azgcCl', fieldLabel : '安装工程-材料',anchor : '95%'}
        
        ,'sbgzf' : {name : 'sbgzf', fieldLabel : '设备购置费',anchor : '95%'}
        ,'qtfyOne' : {name : 'qtfyOne', fieldLabel : '其他费用-一类费用',anchor : '95%'}
        ,'qtfyTwo' : {name : 'qtfyTwo', fieldLabel : '其他费用-二类费用',anchor : '95%'}
    }
    
    sm = new Ext.grid.CheckboxSelectionModel({
        singleSelect : true
    });

    cm = new Ext.grid.ColumnModel([
        //sm,
        {id:'uids',header:fc['uids'].fieldLabel,dataIndex:fc['uids'].name,hidden:true},
        {id:'pid',header:fc['pid'].fieldLabel,dataIndex:fc['pid'].name,hidden:true},
        {id:'treeuids',header:fc['treeuids'].fieldLabel,dataIndex:fc['treeuids'].name,hidden:true},
        {id:'treeid',header:fc['treeid'].fieldLabel,dataIndex:fc['treeid'].name,hidden:true},
        {id:'fixedno',header:fc['fixedno'].fieldLabel,dataIndex:fc['fixedno'].name,width:100,allowblank:false},
        {id:'fixedname',header:fc['fixedname'].fieldLabel,dataIndex:fc['fixedname'].name,width:160,allowblank:false},
        {id:'typetreeuids',header:fc['typetreeuids'].fieldLabel,dataIndex:fc['typetreeuids'].name,hidden:true},  
        {id:'typetreeid',header:fc['typetreeid'].fieldLabel,dataIndex:fc['typetreeid'].name,width:200,
            renderer : function(v){
                var v6 = v.length > 6 ? v.substring(0,6) : v;
                var str = '';
                for (var i = 0; i < typetreeArr.length; i++) {
                    if(v6 == typetreeArr[i][1]){
                        str = typetreeArr[i][3]
                    }
                }
                for (var i = 0; i < typetreeArr.length; i++) {
                    if(v == typetreeArr[i][1]){
                        str += ' - ' + typetreeArr[i][3]
                    }
                }
                return str
            }
        },
        {id:'remark',header:fc['remark'].fieldLabel,dataIndex:fc['remark'].name,width:120},
        {id:'constructionUnit',header:fc['constructionUnit'].fieldLabel,dataIndex:fc['constructionUnit'].name,width:160},
        {id:'deliveryUnit',header:fc['deliveryUnit'].fieldLabel,dataIndex:fc['deliveryUnit'].name,width:160},
        {id:'unit',header:fc['unit'].fieldLabel,dataIndex:fc['unit'].name,width:80,align:'center'},
        {id:'num',header:fc['num'].fieldLabel,dataIndex:fc['num'].name,width:80,align:'right'}
        
        ,{id:'jgcc',header:fc['jgcc'].fieldLabel,dataIndex:fc['jgcc'].name,width:100,align:'center'}
        ,{id:'scwz',header:fc['scwz'].fieldLabel,dataIndex:fc['scwz'].name,width:100,align:'center'}
        ,{id:'jzgcGcl',header:fc['jzgcGcl'].fieldLabel,dataIndex:fc['jzgcGcl'].name,width:120,align:'right',
            renderer : function(v,m,r){
                m.attr = "style=background-color:#FBF8BF";
                return v;
            }
        }
        ,{id:'jzgcCl',header:fc['jzgcCl'].fieldLabel,dataIndex:fc['jzgcCl'].name,width:120,align:'right',
            renderer : function(v,m,r){
                m.attr = "style=background-color:#FBF8BF";
                return v;
            }
        }
        ,{
            header:'建筑工程-合计',dataIndex:'jzgcHj',width:120,align:'right',
            renderer : function(v,m,r){
                return r.get('jzgcGcl') + r.get('jzgcCl') 
            }
        }
        ,{id:'azgcGcl',header:fc['azgcGcl'].fieldLabel,dataIndex:fc['azgcGcl'].name,width:120,align:'right',
            renderer : function(v,m,r){
                m.attr = "style=background-color:#FBF8BF";
                return v;
            }
        }
        ,{id:'azgcCl',header:fc['azgcCl'].fieldLabel,dataIndex:fc['azgcCl'].name,width:120,align:'right',
            renderer : function(v,m,r){
                m.attr = "style=background-color:#FBF8BF";
                return v;
            }
        }
        ,{
            header:'安装工程-合计',dataIndex:'azgcHj',width:120,align:'right',
            renderer : function(v,m,r){
                return r.get('azgcGcl') + r.get('azgcCl') 
            }
        }
        ,{id:'sbgzf',header:fc['sbgzf'].fieldLabel,dataIndex:fc['sbgzf'].name,width:120,align:'right',
            renderer : function(v,m,r){
                m.attr = "style=background-color:#FBF8BF";
                return v;
            }
        }
        ,{id:'qtfyOne',header:fc['qtfyOne'].fieldLabel,dataIndex:fc['qtfyOne'].name,width:120,align:'right',
            renderer : function(v,m,r){
                m.attr = "style=background-color:#FBF8BF";
                return v;
            }
        }
        ,{id:'qtfyTwo',header:fc['qtfyTwo'].fieldLabel,dataIndex:fc['qtfyTwo'].name,width:120,align:'right',
            renderer : function(v,m,r){
                m.attr = "style=background-color:#FBF8BF";
                return v;
            }
        }
        ,{
            header:'待摊合计',dataIndex:'dthj',width:120,align:'right',
            renderer : function(v,m,r){
                return r.get('qtfyOne') + r.get('qtfyTwo') 
            }
        }
        
    ]);
    cm.defaultSortable = true;
    
    var Columns = [
		{name:'uids',type:'string'},
		{name:'pid',type:'string'},
		{name:'treeuids',type:'string'},
		{name:'treeid',type:'string'},
		{name:'fixedno',type:'string'},
		{name:'fixedname',type:'string'},
		{name:'typetreeuids',type:'string'},
		{name:'typetreeid',type:'string'},
		{name:'remark',type:'string'},
		{name:'constructionUnit',type:'string'},
		{name:'deliveryUnit',type:'string'},
		{name:'unit',type:'string'},
		{name:'num',type:'float'}
		
        ,{name:'jgcc',type:'string'}
		,{name:'scwz',type:'string'}
        
        ,{name:'jzgcGcl',type:'float'}
        ,{name:'jzgcCl',type:'float'}
        ,{name:'azgcGcl',type:'float'}
        ,{name:'azgcCl',type:'float'}
        ,{name:'sbgzf',type:'float'}
        ,{name:'qtfyOne',type:'float'}
        ,{name:'qtfyTwo',type:'float'}
    ];
    
    ds = new Ext.data.Store({
        baseParams : {
            ac : 'list',
            bean : bean,
            business : business,
            method : listMethod,
            params: "pid='"+CURRENTAPPID+"'"
        },
        proxy : new Ext.data.HttpProxy({
            method : 'GET',
            url : MAIN_SERVLET
        }),
        reader : new Ext.data.JsonReader({
            root : 'topics',
            totalProperty : 'totalCount',
            id : primaryKey
        }, Columns),
        remoteSort : true,
        pruneModifiedRecords : true
    });
    
    
    var addFixedBtn = new Ext.Button({
        id : 'fixed_add',
        text : '新增',
        iconCls : 'add',
        handler : toFixedHandler
    });
    var editFixedBtn = new Ext.Button({
        id : 'fixed_edit',
        text : '修改',
        iconCls : 'btn',
        handler : toFixedHandler
    });
    
    var updateOtherCostBtn = new Ext.Button({
		text : '更新一类费用及二类费用',
		iconCls : 'btn',
		handler : function() {
			var record = sm.getSelected();
//			if (!record) {
//				Ext.example.msg('提示！', '请选择需要更新的固定资产！');
//				return;
//			}
            //调整为按钮一次更新所有数据
			var sql = "UPDATE Facomp_Fixed_Asset t SET " +
                    "t.qtfy_One = " +
                    "(SELECT v.cost_Value2 FROM Facomp_Cost_Fixed_Total_View v " +
                    "WHERE v.other_cost_Type = '0001' AND t.treeid = v.treeid), " +
                    "t.qtfy_Two = " +
                    "(SELECT v.cost_Value2 FROM Facomp_Cost_Fixed_Total_View v " +
                    "WHERE v.other_cost_Type = '0002' AND t.treeid = v.treeid) " +
                    "WHERE 1=1";
                    //"WHERE t.uids = '" + record.get('uids') + "'";
            DWREngine.setAsync(false);
            baseDao.updateBySQL(sql,function(str){
                if(str >= '1'){
                    Ext.example.msg('提示','一类费用及二类费用更新成功！');
                    ds.load();
                }else{
                    Ext.example.msg('提示','更新失败！');
                }
            });
            DWREngine.setAsync(true);
		}
	});

	var initGclAndSbgzf = new Ext.Button({
		text : '初始化固定资产信息',
		tooltip : '若选择了左侧固定资产清单节点,则初始化此节点下所有数据的建筑工程-工程量,安装工程-工程量,设备购置费。若未选择节点，则初始化所有数据',
		iconCls : 'btn',
		handler : function() {
			var count = ds.getCount();
			if (count == 0){
				Ext.example.msg('提示','此固定资产下无信息!');
				return;
			}
			var selNode = treePanel.getSelectionModel().getSelectedNode();
			var treeid = '01';
			if (selNode){
				treeid = selNode.attributes.treeid;
			}
            DWREngine.setAsync(false);
            faFixedAssetService.initGclAndSbgzf(CURRENTAPPID, treeid, function(str){
                if(str == '0'){
                    Ext.example.msg('提示','初始化失败！');
                }else{
                    Ext.example.msg('提示','成功初始化' + str + '条数据!');
                    ds.reload();
                }
            });
            DWREngine.setAsync(true);
		}
	});

    function toFixedHandler(){
        var id = this.id;
        var form = fixedForm.getForm();
        if(id == 'fixed_add'){
            var selNode = treePanel.getSelectionModel().getSelectedNode();
            if(!selNode){
	            Ext.example.msg('提示！', '请先选择固定资产！');
	            return;
	        }
            if(!selNode.isLeaf()){
                Ext.example.msg('提示！', '只能在子节点上新增！');
                return;
            }
            fixedWin.show();
            form.reset();
            form.findField('pid').setValue(CURRENTAPPID);
            form.findField('treeuids').setValue(selNode.attributes.uids);
            form.findField('treeid').setValue(selNode.attributes.treeid);
            form.findField('fixedno').setValue(selNode.attributes.fixedno);
            form.findField('fixedname').setValue(selNode.attributes.fixedname);
        }else if(id == 'fixed_edit'){
            var record = sm.getSelected();
            if(!record){
                Ext.example.msg('提示！', '请选择需要修改的固定资产！');
                return;
            }
            fixedWin.show();
            fixedForm.getForm().loadRecord(record);
            var typetreeuids = record.get('typetreeuids');
            var typetreename = '';
            for (var i = 0; i < typetreeArr.length; i++) {
                if(typetreeuids == typetreeArr[i][0]){
                    typetreename =  typetreeArr[i][3];
                    break;
                }
            }
            typetreeCombo.setValue(typetreeuids);
            typetreeCombo.setRawValue(typetreename);
        }
    }
    
    gridPanel = new Ext.grid.GridPanel({
        ds : ds,
        sm : sm,
        cm : cm,
        tbar :['<font color=#15428b><B>固定资产信息<B></font>','-',addFixedBtn,'-',editFixedBtn,'-',updateOtherCostBtn,'-',initGclAndSbgzf],
        region : 'center',
        border : false,
        stripeRows : true,
        loadMask : true,
        viewConfig : {
            forceFit : false,
            ignoreAdd : true
        },
        listeners : {
            'cellclick' : function(grid, rowIndex, columnIndex, e){
//                  var record = grid.getStore().getAt(rowIndex);  // Get the Record
//                  var fieldName = grid.getColumnModel().getDataIndex(columnIndex); // Get field name
//                  var data = record.get(fieldName);
                var fieldName = grid.getColumnModel().getDataIndex(columnIndex);
                //建筑工程 - 工程量
                if(fieldName == 'jzgcGcl'){
                    rootText_gcl = '建筑部分';
                    rootBdgid_gcl =  CURRENTAPPID+'-0101';
                    editFieldtype_gcl = 'jzgc_Gcl';
                    jzgcGclListWin.show();
//                  jzgcGclSelectContWin.show();
                }
                //建筑工程 - 材料
                if(fieldName == 'jzgcCl'){
                    rootText_cl = '建筑部分';
                    rootBdgid_cl =  CURRENTAPPID+'-0101';
                    editFieldtype_cl = 'jzgc_cl';
                    jzgcClSelectWin.show();
                }
                //安装工程 - 工程量
                if(fieldName == 'azgcGcl'){
                    rootText_gcl = '安装部分';
                    rootBdgid_gcl =  CURRENTAPPID+'-0103';
                    editFieldtype_gcl = 'azgc_Gcl';
                    jzgcGclListWin.show();
//                  jzgcGclSelectContWin.show();
                }
                //安装工程 - 材料
                if(fieldName == 'azgcCl'){
                    rootText_cl = '安装部分';
                    rootBdgid_cl =  CURRENTAPPID+'-0103';
                    editFieldtype_cl = 'azgc_cl';
                    jzgcClSelectWin.show();
                }
                //设备购置费
                if(fieldName == 'sbgzf'){
//                	rootText_gcl = '设备部分';
//                  rootBdgid_gcl =  CURRENTAPPID+'-0102';
                    sbListWin.show();
                }
            }
        }
    });
    
    var typetreeCombo = new fm.ComboBox({
        readOnly : true,
        triggerClass: 'x-form-date-trigger',
        onTriggerClick: function(){
            fixedTypeWin.show();
        },
        listClass : 'display : none',
        mode : 'local',
        anchor : '95%',
        valueField: 'k',
        displayField: 'v',
        lazyRender:true,
        triggerAction: 'all',
        store : typetreeDs
    });
    
    Ext.applyIf(typetreeCombo,fc['typetreeuids']);
    
    //TODO:新增修改固定资产表单
    var fixedForm = new Ext.form.FormPanel({
        width : 320,
        bodyStyle: 'padding:10px 5px;border-left:1px #B5B8C8 solid;',
        labelAlign: 'right',
        items: [
                    new fm.Hidden(fc['uids']),
                    new fm.Hidden(fc['pid']),
                    new fm.Hidden(fc['treeuids']),
                    new fm.Hidden(fc['treeid']),
                    new fm.TextField(fc['fixedno']),
                    new fm.TextField(fc['fixedname']),
                    typetreeCombo,
                    new fm.Hidden(fc['typetreeid']),
                    new fm.TextField(fc['remark']),
                    new fm.TextField(fc['constructionUnit']),
                    new fm.TextField(fc['deliveryUnit']),
                    new fm.TextField(fc['unit']),
                    new fm.NumberField(fc['num'])
                    ,new fm.TextField(fc['jgcc'])
                    ,new fm.TextField(fc['scwz'])
                    ,new fm.Hidden(fc['jzgcGcl'])
                    ,new fm.Hidden(fc['jzgcCl'])
                    ,new fm.Hidden(fc['azgcGcl'])
                    ,new fm.Hidden(fc['azgcCl'])
                    ,new fm.Hidden(fc['sbgzf'])
                    ,new fm.Hidden(fc['qtfyOne'])
                    ,new fm.Hidden(fc['qtfyTwo'])
                ],
        buttonAlign : 'center',
        buttons : [{
            text : '保存',
            iconCls : 'save',
            handler : fixedFormSave
        }, {
            text : '关闭',
            iconCls : 'remove',
            handler : function() {
                fixedWin.hide();
            }
        }]
    });
    
    //TODO:新增修改固定资产窗口
    var fixedWin = new Ext.Window({
        title : '固定资产',
        width : 350,
        height : 350,
        border : false,
        modal : true,
        layout : 'fit',
        closeAction : 'hide',
        items : [fixedForm]
    });
    
    function fixedFormSave(){
        var form = fixedForm.getForm();
        if(form.isValid()){
            if (fixedForm.isNew) {
                doFixedFormSave(true,tmpLeaf)  //修改
            } else {
                doFixedFormSave(false,tmpLeaf)//新增
            }
        }
    }
    
    //保存固定资产
    function doFixedFormSave(isNew,leaf){
        var form = fixedForm.getForm();
        var obj = new Object();
        for (var i=0; i<Columns.length; i++){
            var name = Columns[i].name;
            var field = form.findField(name);
            if (field) obj[name] = field.getValue();
        }
        DWREngine.setAsync(false);
        faFixedAssetService.saveOrUpdateFACompFixedAsset(obj,function(str){
            if(str == "1"){
                Ext.example.msg('提示！', '您成功保存了 1 条记录。');
                fixedWin.hide();
                ds.load();
            }else{
                Ext.example.msg('提示！', '保存失败。');
            }
        });
        DWREngine.setAsync(true);
    }
    
    
    var rootType = new Ext.tree.AsyncTreeNode({
        id : "01",
        text : "固定资产分类",
        expanded : true,
        iconCls : 'form'
    })
    
    var treeLoaderType = new Ext.tree.TreeLoader({
        url: MAIN_SERVLET,
        baseParams: {
            ac:"columntree", 
            treeName:"getFACompFixedAssetTree", 
            businessName:"faFixedAssetService",
            parentid:"0",
            pid: CURRENTAPPID
        },
        clearOnLoad: true,
        uiProviders:{
            'col': Ext.tree.ColumnNodeUI
        }
    });
    
    
    var chooseBtn = new Ext.Button({
        text : '确定选择',
        iconCls : 'add',
        handler : function(){
            var selNode = fixedTypeTree.getSelectionModel().getSelectedNode();
            if(!selNode){
                Ext.example.msg('提示！', '请先选中需要操作的节点！');
                return;
            }
            if(selNode == root){
                Ext.example.msg('提示','不能选择根节点');
                return;
            }            
            var form = fixedForm.getForm();
            form.findField('typetreeuids').setValue(selNode.attributes.uids);
            form.findField('typetreeuids').setRawValue(selNode.attributes.fixedname);
            form.findField('typetreeid').setValue(selNode.attributes.treeid);
            fixedTypeWin.hide();
        }
    })
    var treePanelObj2 = treePanelObj;
    treePanelObj2.id = 'tree';
    treePanelObj2.root = rootType;
    treePanelObj2.loader = treeLoaderType;
    treePanelObj2.region = 'center';
    treePanelObj2.tbar = [{
            iconCls: 'icon-expand-all',
            tooltip: '全部展开',
            handler: function(){ rootType.expand(true); }
        }, '-', {
            iconCls: 'icon-collapse-all',
            tooltip: '全部折叠',
            handler: function(){ rootType.collapse(true); }
        },'-',chooseBtn
    ]
    
    var fixedTypeTree = new Ext.tree.ColumnTree(treePanelObj2);
    
    //TODO:固定资产分类树窗口
    var fixedTypeWin = new Ext.Window({                 
         title: '<font color=#15428b><b>固定资产分类</b></font>',
         layout: 'fit',
         width: 560,
         height: 480,
         modal: true,
         closeAction: 'hide',
         items: [fixedTypeTree]
     });
    
    fixedTypeTree.on('beforeload', function(node) {
        var treeid = node.attributes.treeid;
        if (treeid == null){
            treeid = "01";
        }
        fixedTypeTree.loader.baseParams.parentid = treeid
        fixedTypeTree.loader.baseParams.pid = CURRENTAPPID;
    });
    
    
    var view = new Ext.Viewport({
        layout : 'border',
        items : [treePanel, gridPanel]
    });
    
    ds.load();
    ds.on('load',function(){
		if(ds.getCount() >= 1){
            addFixedBtn.setDisabled(true);
		}else{
            addFixedBtn.setDisabled(false);
        }
    })
});