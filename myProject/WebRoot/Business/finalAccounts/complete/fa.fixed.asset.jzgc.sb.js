/**
 * 竣工决算 - 固定资产 
 * 固定资产信息中，设备购置费  取值窗口
 * @author zhangh 2013-07-17 
 */

var sbSelectContWin,sbListWin
var partBs = new Array();
var contarctType2 = new Array()
contarctType2.push(['-1', '所有合同'])

var selectConid = '';
var selectConno = '';
var selectConname = '';
var selectedBdgid = '';
var selectedPath = '';
var myMask;

var rootText_gcl = '设备部分';
var rootBdgid_gcl = '0102';

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
    appMgm.getCodeValue('设备合同', function(list1) {
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
        smCont,
        {id:'conid',header:'合同主键',dataIndex:'conid',hidden:true},
        {id:'pid',header:'PID',dataIndex:'pid',hidden:true},
        {id:'condivno',header:'分类一',dataIndex:'condivno',hidden:true},
        {id:'sotr',header:'分类二',dataIndex:'sotr',hidden:true},
        {id:'conno',header:'合同编号',dataIndex:'conno',width:120},
        {id:'conmoneyno',header:'财务合同编号',dataIndex:'conmoneyno',width:120},
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
            params : "condivno = 'SB'"
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
    //建筑工程 - 工程量：合同分类二下拉菜单
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
                    dsCont.baseParams.params = "condivno='SB'";
                }else{
                    dsCont.baseParams.params = "condivno='SB' and sort='"+v+"'";
                }
                dsCont.load({start:0,limit:PAGE_SIZE});
            }
        }
    });
    var selectContBtn = new Ext.Button({
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
            sbSelectContWin.hide();
            setTimeout("",1000);
            sbListWin.show();
        }
    })
    //建筑工程 - 工程量：合同列表
    var jzgcGclSelectContGridPanel=new Ext.grid.GridPanel({
        ds : dsCont,
        sm : smCont,
        cm : cmCont,
        tbar :['设备合同分类：',selectContCombo,'-',selectContBtn],
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
    sbSelectContWin = new Ext.Window({
        title : '选择设备合同信息',
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
    }); 
    
    //----------------------------------
    //建筑工程 - 工程量：概算树
    //生成概算树
    
    var rootNew = new Ext.tree.AsyncTreeNode({
        text : rootText_gcl,
        iconCls : 'task-folder',
        expanded : true,
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
        dsSb.baseParams.params="conid='"+selectConid+"' and estimateNo = '"+selectedBdgid+"'";
        dsSb.load();
    });
    
    
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

    var fcSb = { // 创建编辑域配置
        'uids' : {name : 'uids',fieldLabel : '主键'},
        'pid' : {name : 'pid',fieldLabel : 'PID'},
        'equNo' : {name : 'equNo',fieldLabel : '主体设备编码'},
        'equName' : {name : 'equName',fieldLabel : '主题设备名称'},
        'conid' : {name : 'conid',fieldLabel : '合同主键'},
        'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
        'estimateNo' : {name : 'estimateNo',fieldLabel : '对应概算'},
        'equParts' : {name : 'equParts',fieldLabel : '部件明细'},
        'totalMoney' : {name : 'totalMoney',fieldLabel : '总金额'}
    }
    
    var columnsSb = [
        {name : 'uids', type : 'string'},
        {name : 'pid', type : 'string'},
        {name : 'equNo', type : 'string'},
        {name : 'equName', type : 'string'},
        {name : 'conid', type : 'string'},
        {name : 'ggxh',type : 'string'},
        {name : 'equParts', type : 'string'},
        {name : 'estimateNo',type : 'string'},
        {name : 'totalMoney' ,type : 'float'}
    ];
    
   dsSb = new Ext.data.Store({
        baseParams : {
            ac : 'list', // 表示取列表
            bean : 'com.sgepit.pmis.equipment.hbm.EquGoodsBodys',
            business : business,
            method : listMethod,
            params : "conid='"+selectConid+"'"
        },
        proxy : new Ext.data.HttpProxy({
            method : 'GET',
            url : MAIN_SERVLET
        }),
        reader : new Ext.data.JsonReader({
            root : 'topics',
            totalProperty : 'totalCount',
            id : "uids"
        }, columnsSb),
        remoteSort : true,
        pruneModifiedRecords : true, // 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
        sortInfo: {field: "uids", direction: "DESC"}
    });
    var smSb = new Ext.grid.CheckboxSelectionModel({header:'',singleSelect : false});
    var cmSb = new Ext.grid.ColumnModel([
        smSb,{
            id : 'uids',
            header : fcSb['uids'].fieldLabel,
            dataIndex : fcSb['uids'].name,
            hidden : true
        }, {
            id : 'PID',
            header : fcSb['pid'].fieldLabel,
            dataIndex : fcSb['pid'].name,
            hidden : true
        }, {
            id : 'conid',
            header : fcSb['conid'].fieldLabel,
            dataIndex : fcSb['conid'].name,
            hidden : true
        }, {
            id : 'equNo',
            header : fcSb['equNo'].fieldLabel,
            dataIndex : fcSb['equNo'].name,
            width : 200
        }, {
            id : 'equName',
            header : fcSb['equName'].fieldLabel,
            dataIndex : fcSb['equName'].name,
            width : 200
        }, {
            id : 'ggxh',
            header : fcSb['ggxh'].fieldLabel,
            dataIndex : fcSb['ggxh'].name,
            width : 100
        }, {
            id : 'estimateNo',
            header : fcSb['estimateNo'].fieldLabel,
            dataIndex : fcSb['estimateNo'].name,
            hidden : true
        }, {
            id : 'equParts',
            header : fcSb['equParts'].fieldLabel,
            dataIndex : fcSb['equParts'].name,
            renderer : renderConid,
            width : 200,
            align : 'center'
        }, {
            id : 'totalMoney',
            header : fcSb['totalMoney'].fieldLabel,
            dataIndex : fcSb['totalMoney'].name,
            align : 'right',
            renderer : function(value){
                return cnMoneyToPrec(value,4);
            },
            width : 140
        }]);

    sbGridPanel = new Ext.grid.GridPanel({
        region : 'center',
        ds : dsSb,
        cm : cmSb,
        sm : smSb,
        tbar :  ['<font color=#15428b><B>设备信息<B></font>',
            {
                xtype : 'button',
				  text : '确定选择',
				  iconCls : 'btn',
				  handler : function(){
				    var fixeduids = sm.getSelected().get('uids');
				    var recArr = collectionToRecords();
                    var bodysArr = new Array();
                    for (var i = 0; i < recArr.length; i++) {
                        bodysArr.push(recArr[i].data)
                    }
				  DWREngine.setAsync(false);
                  faFixedAssetService.updateFacompFixedAssetSbbodysNum(fixeduids,selectConid,bodysArr,function(str){
				      if(str == '1'){
				          Ext.example.msg('提示','【设备购置费】 操作成功！');
				          ds.load();
				            sbListWin.hide();
                            collection.clear();
				      }else{
				          Ext.example.msg('提示','保存失败！');
				          }
				      });
				      DWREngine.setAsync(true);
                  }     
			  },'->','设备总价值：',{
                id : 'sb_sum',
                xtype : 'textfield',
                value : 0,
                width : 120,
                style : 'text-align:right'
            },'元'
        ],
        loadMask : true,
        viewConfig : {
            forceFit : true,
            ignoreAdd : true
        }
    });
    
    dsSb.on('load', function(s, r, o) {
        DWREngine.setAsync(false);
        var arr = new Array();
        var sql = "select outuids from FACOMP_FIXED_ASSET_SBBODYS_NUM where conid = '"+selectConid+"'";
        baseDao.getData(sql, function(list) {
            for (i = 0; i < list.length; i++) {
                arr.push(list[i]);
            }
        });
        DWREngine.setAsync(true);
        s.each(function(rec) {
            for (var i = 0; i < arr.length; i++) {
                if (rec.get("uids") == arr[i]) {
                    smSb.selectRecords([rec], true);
                    continue;
                }
            }
        });
    })
    
    
    storeSelects(dsSb,smSb);
    
    //切换概算后保留之前勾选的设备
	var collection=new Ext.util.MixedCollection();
	function storeSelects(dsSelect,smSelect){
	    dsSelect.on('load',function(store1, records, options){
	        store1.each(function(rec) {   
	             if (collection.containsKey(rec.get("uids"))) {   
	                 smSelect.selectRecords([rec], true);   
	             }   
	        }); 
	    });
	    dsSelect.on('beforeload',function(store2, options){
	         store2.each(function(rec) {   
	             if (smSelect.isSelected(rec)) {   
	                 collection.add(rec.get("uids"),rec);   
	             } else {   
	                 collection.removeKey(rec.get("uids"));   
	             }   
	         });   
	    });
	    smSelect.on('rowselect',function(sm, rowIndex, rec){
            if(!collection.get(rec.get("uids"))){
	            var v = parseFloat(Ext.getCmp('sb_sum').getValue());
	            v += parseFloat(rec.get('totalMoney'));
	            Ext.getCmp('sb_sum').setValue(v);
	        }
	        collection.add(rec.get("uids"),rec); 
	    });
	    smSelect.on('rowdeselect',function(sm, rowIndex, rec){
	        collection.removeKey(rec.get("uids")); 
            if(!collection.get(rec.get("uids"))){
                var v = parseFloat(Ext.getCmp('sb_sum').getValue());
                v -= parseFloat(rec.get('totalMoney'));
                Ext.getCmp('sb_sum').setValue(v);
            }
	    });
	}
	function collectionClear(){
	    collection.clear();
	}
	function collectionToRecords(){
	    var recs=new Array();
	    for(var i = 0;i<collection.getCount();i++){
	        recs.push(collection.item(i));
	    }
	    collectionClear();
	    return recs;
	}
    
    
    //建筑工程 - 工程量：工程量列表
    sbListWin = new Ext.Window({
        width : document.body.clientWidth * .96,
        height : document.body.clientHeight * .96,
        border : false,
        modal : true,
        layout : 'border',
        closeAction : 'hide',
        tbar : ['所选合同名称：' +
	        '<span id="selectconname" style="font-weight:700;"></span>','-',
            {
	            xtype : 'button',
	            text : '重新选择合同',
	            iconCls : 'add',
	            handler : function(){
	                sbSelectContWin.show();
	                sbListWin.hide();
                    selectConid = selectConname = selectConno = "";
                    selectedBdgid = "";
	            }
	        }],
        items : [bdgTreePanel,sbGridPanel],
        listeners : {
            'show' : function() {
				Ext.get('selectconname').update(selectConname);
				rootNew.reload();
				dsSb.reload();
                sbListWin.setTitle('设备购置费');
                Ext.getCmp('sb_sum').getValue(0);
                dsSb.removeAll();
			}
        }
    }); 
    
    function renderConid(value, metadata, record) {
        var getConid = record.get('conid');
        conname = record.get('equName');
        DWREngine.setAsync(false);
        var prefix = "";
        var num=0;
        var sql = "select count(uids) from  equ_goods_openbox_sub_part  t where  t.equ_bodys='"+ record.get('uids')+"'";
        baseMgm.getData(sql, function(str){
            if(str != null || str !='')
                num = str;
        });
        DWREngine.setAsync(false);
        var output ="";
        output ="<a title='"+value+"' style='color:blue;' href=Business/equipment/baseInfo/equ.bodys.maintenance.have.jsp?conid="
                 +getConid+"&partUids="+record.get('uids')+"&equName="+conname+"&treeUids="+record.get('treeUids')+"\>" +"部件明细"+"【"+ num+"】</a>"        
        return output;
    }
})