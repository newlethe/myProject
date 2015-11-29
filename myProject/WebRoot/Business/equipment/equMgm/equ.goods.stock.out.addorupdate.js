var beanOut = "com.sgepit.pmis.equipment.hbm.EquGoodsStockOut";
var businessOut = "baseMgm";
var listMethodOut = "findWhereOrderby";
var primaryKeyOut = "uids";
var orderColumnOut = "uids";

var beanOutSub = "com.sgepit.pmis.equipment.hbm.EquGoodsStockOutSub";
var businessOutSub = "baseMgm";
var listMethodOutSub = "findWhereOrderby";
var primaryKeyOutSub = "uids";
var orderColumnOutSub = "uids";

var equTypeArr = new Array();
var unitArr = new Array();
var getEquidstore = new Array();
var bdgArr = new Array();
var formPanel;

var billStateArr = new Array();

Ext.onReady(function(){
	DWREngine.setAsync(false);
	//设备类型equTypeArr
	appMgm.getCodeValue("设备合同树分类",function(list){
		for(i = 0; i < list.length; i++) {
			if(list[i].propertyCode == "4")
				continue;
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			equTypeArr.push(temp);			
		}
	});
	//领用单位
	var sql = "select unitid,unitname from sgcc_ini_unit t where t.unit_type_id ='7'";
	baseDao.getData(sql,function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1]);			
			unitArr.push(temp);			
		}
	});
	//领料用途
	baseMgm.getData("select bdgid,bdgname from bdg_info where pid='" + CURRENTAPPID
                    + "' order by bdgid ", function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]+" - "+list[i][0]);
            bdgArr.push(temp);
        }
    })
	//按需求要求领用单位能在属性代码中进行维护，由于主体设备中已经存在
	appMgm.getCodeValue('设备出库领用单位',function(list){
	        for(i = 0; i < list.length; i++) {
				var temp = new Array();
				temp.push(list[i].propertyCode);	
				temp.push(list[i].propertyName);			
				unitArr.push(temp);
	        }
	    });	
	baseMgm.getData("select uids,detailed from equ_warehouse where pid='" + CURRENTAPPID
					+ "' order by uids ", function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i][0]);
					temp.push(list[i][1]);
					getEquidstore.push(temp);
				}
			})
            
    //流程审批状态
    appMgm.getCodeValue('流程状态',function(list){
        for(i = 0; i < list.length; i++) {
            var temp = new Array(); 
            temp.push(list[i].propertyCode);        
            temp.push(list[i].propertyName);    
            billStateArr.push(temp);   
        }
    });
    
	DWREngine.setAsync(true);
	var equTypeDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: equTypeArr
    });
    var unitDs = new Ext.data.SimpleStore({
    	fields: ['k', 'v'],   
        data: unitArr
    });
    //领料用途
    var bdginfoDs = new Ext.data.SimpleStore({
        fields: ['k', 'v'],   
        data: bdgArr
    });
    //生成概算树
    var rootText = "工程概算";
    
    var rootNew = new Ext.tree.AsyncTreeNode({
        text : rootText,
        iconCls : 'task-folder',
        expanded : true,
        id : '01'
    })
    var treeLoaderNew = new Ext.tree.TreeLoader({
        url : MAIN_SERVLET,
        baseParams : {
            ac : "columntree",
//            treeName : "equBdgTree",
            treeName : "equBdgTree",
            businessName : "equBaseInfo",
            bdgid : '0101,0102,0103,0104',
            parent : 0,
            codeName : '损坏赔偿'  //和属性代码中的损坏赔偿想对应 yanglh 2013-11-22
        },
        clearOnLoad : true,
        uiProviders : {
            'col' : Ext.tree.ColumnNodeUI
        }
    });
     var treePanelNew = new Ext.tree.ColumnTree({
        width : 550,
        header : false,
        border : false,
        lines : true,
        autoScroll : true,
        rootVisible : false,
        listeners: {  
            /*
            // 监听beforenodedrop事件，主要就是在这里工作，拖动后处理数据 
            beforenodedrop: function(dropEvent){
                var node = dropEvent.target;    // 目标结点
                var data = dropEvent.data;      // 拖拽的数据
                if(data.node)return;
                if(!node.attributes.leaf)return;
                for(var i=0;i<data.selections.length;i++){
                    var record = data.selections[i];
                    record.set('bdgno',node.attributes.bdgno);
                    record.set('bdgid',node.attributes.bdgid);
                }
                grid.defaultSaveHandler();
            }
            */
        },
        columns : [{
            header : '概算名称',
            width : 380, // 隐藏字段
            dataIndex : 'bdgname'
        }, {
            header : '概算编号',
            width : 140,
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
        //rootVisible : false,
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
            }, '-', {
                text : '选择概算',
                iconCls : 'add',
                handler : function(){
                    if(thisBdgid == null || thisBdgid == "0" || thisBdgid == '02'){
                        Ext.example.msg('提示信息','请选择该分类下的子项！');
                        return false;
                    }
                    var form = formPanel.getForm();
					var	getBdgid = thisBdgid.substring(0, 2);//损坏赔偿中不需要处理 对应财务科目 yanglh 2013-11-22
					if(getBdgid == '02'){
						form.findField('using').setValue(thisBdgid);
						form.findField('using').setRawValue(thisBdgname + "-" + thisBdgid);
						DWREngine.setAsync(false);
						baseMgm.getData("select subject_allname from FACOMP_FINANCE_SUBJECT where pid = '"+CURRENTAPPID+"' and subject_bm = '25208'", function(str) {
							if (str.length > 0) {
								form.findField('financialSubjects').setValue(str);
							}
						});
						DWREngine.setAsync(true);
						bdgTreeWin.hide();
						return;
					}
					var len = thisBdgid.length;
					if (len == 4) {
						form.findField('financialSubjects').setValue(thisBdgname + "-" + thisBdgname);
					} else if (len > 4 && len < 9) {
						var bdgidFour = thisBdgid.substring(0, 4);// 对应财务科目长度为4的父节点信息
						DWREngine.setAsync(false);
						baseMgm.getData("select t.bdgname from BDG_INFO  t where t.bdgno='" + bdgidFour + "'", function(str) {
									if (str.length > 0) {
										form.findField('financialSubjects').setValue(str + "-" + thisBdgname);
									}
								});
						DWREngine.setAsync(true);
					} else if (len > 8) {
						var bdgidFour = thisBdgid.substring(0, 4);// 对应财务科目长度为4的父节点信息
						var bdgidEight = thisBdgid.substring(0, 8);// 对应财务科目长度为8的父节点信息
						var nameF,nameE;
						DWREngine.setAsync(false);
						baseMgm.getData("select t.bdgname from BDG_INFO t where t.bdgno ='" + bdgidFour + "'",function(str) {
									if (str.length > 0) {
										nameF = str;
									}
								});
						baseMgm.getData("select t.bdgname from BDG_INFO t where t.bdgno ='" + bdgidEight + "'",function(str) {
									if (str.length > 0) {
										nameE = str;
									}
								});
						DWREngine.setAsync(true);
						if(nameF && nameE)
							form.findField('financialSubjects').setValue(nameF + "-" + nameE);
					}
					form.findField('using').setValue(thisBdgid);
					form.findField('using').setRawValue(thisBdgname + "-" + thisBdgid);
					bdgTreeWin.hide();
				}
			}]
		});

    treePanelNew.on('beforeload', function(node) {
        bdgid = node.attributes.bdgid;
        if (bdgid == null)
            bdgid = '0';
        var baseParams = treePanelNew.loader.baseParams
        baseParams.parent = bdgid;
    })
    //点击的树不是叶子，则补选中，并展开
    treePanelNew.on('beforeclick', function(node,e){
//        if(!node.isLeaf()){
//            node.expand();
//            return false;
//        }
    });
    
    treePanelNew.on('click', function(node, e){
        var tempNode = node
        var isRootNode = (rootText == tempNode.text);
        thisBdgid = isRootNode  ? "0" : tempNode.attributes.bdgid;
        thisBdgno = isRootNode ? "0" : tempNode.attributes.bdgno;
        thisBdgname = isRootNode ? "0" : tempNode.attributes.bdgname;
    });
    var bdgTreeWin = new Ext.Window({
        id:'selectwin',
        title:'选择概算',
        width: 550,
        height: document.body.clientHeight*0.9,
        layout : 'fit',
        border: false, 
        resizable: false,
        closeAction :"hide",
        items : [treePanelNew],
        listeners : {
            'show' : function(){
	            treePanelNew.render(); // 显示树
	            treePanelNew.expand();
            }
        }
    });
    var fm = Ext.form;
    var fcOut = {
		'uids' : {	name : 'uids',	fieldLabel : '主键'},
		'pid' : {	name : 'pid',	fieldLabel : 'PID'},
		'conid' : {	name : 'conid',	fieldLabel : '合同主键'},
		'treeuids' : {name : 'treeuids',fieldLabel : '设备合同分类树主键'},
		'finished' : {name : 'finished',fieldLabel : '完结'},
		'isInstallation' : {name : 'isInstallation',fieldLabel : '已安装'},
		'outNo' : {
			name : 'outNo',
			fieldLabel : '出库单号',
			readOnly : CURRENTAPPID == "1030902"?false:true,//国金项目要求可以手动修改 yanglh 2013-12-03
			width : 160
		},
		'outDate' : {
			name : 'outDate',
			fieldLabel : '出库日期',
			readOnly : true,
			width : 160, 
			format: 'Y-m-d'
		},
		'recipientsUnit' : {
			name : 'recipientsUnit',
			fieldLabel : '领用单位',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
            typeAhead: true,
           	triggerAction: 'all', 
           	store: unitDs,
			width : 160
		},
		'using' : {
            name : 'using', 
            fieldLabel : '领料用途',
            triggerClass: 'x-form-date-trigger',
            onTriggerClick: showBdgTreeWin,
            //allowBlank : getFlag == "write"?false:true,
            //allowBlank : false,
            valueField: 'k',
            displayField: 'v',
            mode: 'local',
            typeAhead: true,
            triggerAction: 'all', 
            store: bdginfoDs,
            readOnly : true,
            width : 160
        },
		'grantDesc' : {name : 'grantDesc',fieldLabel : '发放描述',width : 160},
		'recipientsUser' : {name : 'recipientsUser',fieldLabel : '领用人',width : 160},
		'recipientsUnitManager' : {name : 'recipientsUnitManager',fieldLabel : '领用单位负责人',width : 160},
		'handPerson' : {name : 'handPerson',fieldLabel : '经手人',width : 160},
		'shipperNo' : {name : 'shipperNo',fieldLabel : '出门证编号',width : 160},
		'proUse' : {name : 'proUse',fieldLabel : '工程部位（工程项目或用途）',width : 160},
		'remark' : {name : 'remark',fieldLabel : '备注',width : 160},
		'billState' : {name : 'billState',fieldLabel : '审批状态'},
		'flowid' : {name : 'flowid',fieldLabel : '流程编号'},
		'createMan' : {name : 'createMan',fieldLabel : '创单人ID',width : 100},
        'createUnit' : {name : 'createUnit',fieldLabel : '填写单位',width : 100},
        'dataType' : {name : 'dataType',fieldLabel : '数据类型',width : 100},
        'conPartybNo' : {name : 'conPartybNo', fieldLabel : '供货单位', width : 160},
        'type' : {name : 'type',fieldLabel : '出库类型',width : 160}
	}
	var saveBtn = new Ext.Button({
		id : 'saveBtn',
		text : '保存',
		iconCls : 'save',
		handler : saveOut
	});
	var changePartBtn = new Ext.Button({
		id : 'changePartBtn',
		text : '更改部件',
		iconCls : 'btn',
		handler : changePart
	});
	var cancelBtn = new Ext.Button({
		id : 'cancelBtn',
		text : '关闭',
		iconCls : 'remove',
		handler : function(){
			parent.selectWin.hide();
            if(isFlwTask == true) parent.flowToNext();
		}
	});
	var ColumnsOut = [
		{name : 'uids', type : 'string'},
		{name : 'pid', type : 'string'},
		{name : 'conid', type : 'string'},
		{name : 'treeuids', type : 'string'},
		{name : 'finished', type : 'float'},
		{name : 'isInstallation', type : 'float'},
		{name : 'outNo', type : 'string'},
		{name : 'outDate', type : 'date', dateFormat: 'Y-m-d H:i:s'},
		{name : 'recipientsUnit', type : 'string'},
		{name : 'grantDesc', type : 'string'},
		{name : 'using',type : 'string'},
		{name : 'recipientsUser', type : 'string'},
		{name : 'recipientsUnitManager', type : 'string'},
		{name : 'handPerson', type : 'string'},
		{name : 'shipperNo', type : 'string'},
		{name : 'proUse', type : 'string'},
		{name : 'remark', type : 'string'}
        ,{name : 'billState', type : 'string'}
        ,{name : 'flowid', type : 'string'},
        {name : 'createMan',type : 'string'},
        {name : 'createUnit',type : 'string'},
        {name : 'dataType',type : 'string'},
        {name : 'type',type:'string'},
        {name : 'conPartybNo', type : 'string'}
	];
	var formRecord = Ext.data.Record.create(ColumnsOut);
    var loadFormRecord = null;
    DWREngine.setAsync(false);
		baseMgm.findById(beanOut, edit_uids,function(obj){
			loadFormRecord = new formRecord(obj);
		});
	DWREngine.setAsync(true);
	
	formPanel = new Ext.FormPanel({
		id:"formOut",
		region : 'north',
		height : 140,
		border : false,
		labelAlign : 'right',
		bodyStyle : 'padding:5px 10px;',
		tbar : ['<font color=#15428b><B>设备出库单<B></font>','->',saveBtn,'-',cancelBtn,'-'],
		items : [
			{
				layout : 'column',
				border : false,
				items : [
					{
					layout : 'form',
					columnWidth : .33,
					border : false,
					items : [
						new fm.Hidden(fcOut['uids']),
						new fm.Hidden(fcOut['pid']),
						new fm.Hidden(fcOut['conid']),
						new fm.Hidden(fcOut['treeuids']),
						new fm.Hidden(fcOut['finished']),
                        new fm.Hidden(fcOut['billState']),
                        new fm.Hidden(fcOut['flowid']),
						new fm.Hidden(fcOut['isInstallation']),
						new fm.Hidden(fcOut['createMan']),
						new fm.Hidden(fcOut['createUnit']),
						new fm.Hidden(fcOut['dataType']),
						new fm.Hidden(fcOut['type']),
						new fm.Hidden(fcOut['conPartybNo']),
						new fm.TextField(fcOut['outNo']),
						new fm.TextField(fcOut['grantDesc']),					
						new fm.TextField(fcOut['handPerson']),
						new fm.TextField(fcOut['remark'])
					]
				},{
					layout : 'form',
					columnWidth: .33,
					border : false,
					items : [
						new fm.DateField(fcOut['outDate']),
						new fm.TextField(fcOut['recipientsUser']),
						new fm.TextField(fcOut['shipperNo']),
						new fm.ComboBox(fcOut['using'])
					]
				},{
					layout : 'form',
					columnWidth: .33,
					border : false,
					items : [
						new fm.ComboBox(fcOut['recipientsUnit']),
						new fm.TextField(fcOut['recipientsUnitManager']),
						new fm.TextField(fcOut['proUse'])
					]
				}]
			}
		]
	});
	
	var fcOutSub = {
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'stockId' : {name : 'stockId',fieldLabel : '设备库存主键'},
		'outId' : {name : 'outId',fieldLabel : '出库单主键'},
		'outNo' : {name : 'outNo',fieldLabel : '出库单号'},
		'boxNo' : {name : 'boxNo',fieldLabel : '箱件号/构件号'},
		'equType' : {name : 'equType',fieldLabel : '设备类型'},
		'equPartName' : {name : 'equPartName',fieldLabel : '设备部件名称'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号'},
		'graphNo' : {name : 'graphNo',fieldLabel : '图号'},
		'unit' : {name : 'unit',fieldLabel : '单位'},
		'outNum' : {name : 'outNum',fieldLabel : '出库数量', decimalPrecision : 4},
		'price' : {name : 'price',fieldLabel : '单价'},
		'totalPrice' : {name : 'totalPrice',fieldLabel : '总价'},
		'storage' : {name : 'storage',fieldLabel : '存放库位'},
		'kksNo' : {name : 'kksNo',fieldLabel : 'KKS编码'},
		'remark' : {name : 'remark',fieldLabel : '备注'}
	};
	var smOutSub = new Ext.grid.CheckboxSelectionModel({singleSelect : true});
	var cmOutSub = new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer({
			header : '序号',
			width : 35
		}),
//	smOutSub,
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
			id : 'stockId',
			header : fcOutSub['stockId'].fieldLabel,
			dataIndex : fcOutSub['stockId'].name,
			hidden : true
		},{
			id : 'outId',
			header : fcOutSub['outId'].fieldLabel,
			dataIndex : fcOutSub['outId'].name,
			hidden : true
		},{
			id : 'outNo',
			header : fcOutSub['outNo'].fieldLabel,
			dataIndex : fcOutSub['outNo'].name,
			hidden : true
		},{
			id : 'boxNo',
			header : fcOutSub['boxNo'].fieldLabel,
			dataIndex : fcOutSub['boxNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'equType',
			header : fcOutSub['equType'].fieldLabel,
			dataIndex : fcOutSub['equType'].name,
			renderer : function(v,m,r){
				var equ = "";
				for(var i=0;i<equTypeArr.length;i++){
					if(v == equTypeArr[i][0])
						equ = equTypeArr[i][1];
				}
				return equ;
			},
			align : 'center',
			width : 100
		},{
			id : 'equPartName',
			header : fcOutSub['equPartName'].fieldLabel,
			dataIndex : fcOutSub['equPartName'].name,
			align : 'center',
			width : 180
		},{
			id : 'ggxh',
			header : fcOutSub['ggxh'].fieldLabel,
			dataIndex : fcOutSub['ggxh'].name,
			align : 'center',
			width : 100
		},{
			id : 'graphNo',
			header : fcOutSub['graphNo'].fieldLabel,
			dataIndex : fcOutSub['graphNo'].name,
			align : 'center',
			width : 100
		},{
			id : 'unit',
			header : fcOutSub['unit'].fieldLabel,
			dataIndex : fcOutSub['unit'].name,
			width : 80
		},{
			id : 'outNum',
			header : fcOutSub['outNum'].fieldLabel,
			dataIndex : fcOutSub['outNum'].name,
			editor : new fm.NumberField(fcOutSub['outNum']),
			renderer : function(v,m,r){
					m.attr = "style=background-color:#FBF8BF";
					return v;
			    },
			align : 'right',
			width : 80
		},{
			id : 'stockNum',
			header : "库存数量",
			dataIndex:'stockNum',
			align : 'right',
			renderer:function(value,cell,record){
				var stocknum="";
				DWREngine.setAsync(false);
    			equMgm.getStockNumFromStock(record.get('stockId'),function(num){
    				stocknum=num;
    			});
    			DWREngine.setAsync(true);
    			return stocknum;
			}
		},{
			id : 'price',
			header : fcOutSub['price'].fieldLabel,
			editor : new fm.NumberField(fcOutSub['price']),
			dataIndex : fcOutSub['price'].name,
			align : 'right',
			renderer : function(v,m,r){
					m.attr = "style=background-color:#FBF8BF";
					return v;
			    },
			width : 80
		},{
			id : 'totalPrice',
			header : fcOutSub['totalPrice'].fieldLabel,
			editor : new fm.NumberField(fcOutSub['totalPrice']),
			dataIndex : fcOutSub['totalPrice'].name,
			align : 'right',
			renderer : function(v,m,r){
					m.attr = "style=background-color:#FBF8BF";
					return v;
			    },
			width : 80
		},{
			id : 'storage',
			header : fcOutSub['storage'].fieldLabel,
			dataIndex : fcOutSub['storage'].name,
			renderer : function(v,m,r){
				var storage = "";
				for(var i=0;i<getEquidstore.length;i++){
					if(v == getEquidstore[i][0])
						storage = getEquidstore[i][1];
				}
				return storage;
			},
			align : 'center',
			width : 80
		},{
			id : 'kksNo',
			header : fcOutSub['kksNo'].fieldLabel,
			dataIndex : fcOutSub['kksNo'].name,
			editor : new fm.TextField(fcOutSub['kksNo']),
			align : 'center',
			renderer : function(v,m,r){
					m.attr = "style=background-color:#FBF8BF";
					return v;
			    },
			width : 100
		},{
			id : 'remark',
			header : fcOutSub['remark'].fieldLabel,
			editor : new fm.TextField(fcOutSub['remark']),
			dataIndex : fcOutSub['remark'].name,
			align : 'center',
			renderer : function(v,m,r){
					m.attr = "style=background-color:#FBF8BF";
					return v;
			    },
			width : 120
		}
	]);
	var ColumnsOutSub = [
		{name:'uids', type:'string'},
		{name:'pid', type:'string'},
		{name:'stockId', type:'string'},
		{name:'outId', type:'string'},
		{name:'outNo', type:'string'},
		{name:'boxNo', type:'string'},
		{name:'equType', type:'string'},
		{name:'equPartName', type:'string'},
		{name:'ggxh', type:'string'},
		{name:'graphNo', type:'string'},
		{name:'unit', type:'string'},
		{name:'outNum', type:'float'},
		{name:'price', type:'float'},
		{name:'totalPrice', type:'float'},
		{name:'storage', type:'string'},
		{name:'kksNo', type:'string'},
		{name:'remark', type:'string'}
	];
	var PlantSub = Ext.data.Record.create(ColumnsOutSub);
    var PlantIntSub = {
		uids : '',
		pid : CURRENTAPPID,
		outId : '',
		outNo : '',
		boxNo : '',
		equType : '',
		equPartName : '',
		ggxh : '',
		graphNo : '',
		unit : '',
		outNum : 0,
		storage : ''
	}
	var dsOutSub = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: beanOutSub,
	    	business: businessOutSub,
	    	method: listMethodOutSub,
	    	params: "pid='"+CURRENTAPPID+"' and outId='"+edit_uids+"'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKeyOutSub
        }, ColumnsOutSub),
        remoteSort: true,
        pruneModifiedRecords: true	
    });
    dsOutSub.setDefaultSort(orderColumnOutSub, 'desc');	//设置默认排序列
    dsOutSub.load({params:{start:0,limit:PAGE_SIZE}});
    var gridPanelSub = new Ext.grid.EditorGridTbarPanel({
    	id:"gridPanelSub",
		ds : dsOutSub,
		cm : cmOutSub,
		sm : smOutSub,
		title : '出库单明细',
		clicksToEdit : 2,
		tbar : ['<font color=#15428b><B>设备出库单明细<B></font>','-',changePartBtn,'-'],
		addBtn : false,
		saveHandler : saveOutSub,
		deleteHandler : deleteOutSub,
		saveBtn : true,
		delBtn : true,
		header: false,
		height : document.body.clientHeight*0.5,
	    border: false,
	    //layout: 'fit',
	    region: 'center',
        stripeRows:true,
        loadMask : true,
	    viewConfig: {
	        forceFit: false,
	        ignoreAdd: true
	    },
	    bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsOutSub,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        plant : PlantSub,
		plantInt : PlantIntSub,
		servletUrl : MAIN_SERVLET,
		bean : beanOutSub,
		business : businessOutSub,
		primaryKey : primaryKeyOutSub,
		listeners:{
			afteredit:function(e){
				var record = e.record;
		    	var realOld = e.originalValue;
		    	var valOld = "";
		    	//var realNew = e.value;
		    	var realNew = record.get('outNum')
		    	if(realNew<0){
		    		record.set('outNum',realOld);
		    		return false;
		    	}
				var stocknum;
				DWREngine.setAsync(false);
    			equMgm.getStockNumFromStock(record.get('stockId'),function(num){
    				stocknum=num;
    			});
    			equMgm.getOutNumFromOutSub(record.get('uids'),function(num){
	    				valOld=num;
	    			});
    			DWREngine.setAsync(true);
    			if(realNew - valOld > stocknum){
					Ext.Msg.show({
						title: '提示',
			            msg: '出库数量修改出错，出库数量只能再增加'+stocknum+record.get('unit'),
			            icon: Ext.Msg.WARNING, 
			            width:200,
			            buttons: Ext.MessageBox.OK
					});
					record.set('outNum',realOld);
				}
			}
		}
	});
	
	var url = BASE_PATH+"Business/equipment/equMgm/equ.file.list.jsp" +
				"?uids="+edit_uids+"&uuid="+edit_treeuids+"&conid="+edit_conid+"&edit=true&type=CK";
	var filePanel = new Ext.Panel({
		id : 'filePanel',
		title : '附件',
		layout: 'fit',
		html:"<iframe id='fileWinFrame' src='"+url+"' width='100%' height='100%' frameborder='0'></iframe>"
	});
	var tabPanel = new Ext.TabPanel({
		activeTab : 0,
        border: false,
        region: 'center',
    	items: [gridPanelSub]
	})
	
	var view = new Ext.Viewport({
		layout:'border',
        items: [formPanel, tabPanel]
	});
	if(CURRENTAPPID == "1030902"){
		cmOutSub.setHidden(14,false);
		cmOutSub.setHidden(15,false);
	}else{
		cmOutSub.setHidden(14,true);
		cmOutSub.setHidden(15,true);
	}
	formPanel.getForm().loadRecord(loadFormRecord);
	function saveOut(){
		var form = formPanel.getForm();
		if(CURRENTAPPID == "1030902"){
			//允许修改到货单号，修改后判断是否修该的单号是否存在 yanglh 2013-12-03
			var getUids  = '';
			DWREngine.setAsync(false);
			baseDao.getData("select uids from EQU_GOODS_STOCK_OUT where out_no='"+form.findField("outNo").getValue()+"'",function(list){
				if(list.length>0){
					getUids = list;
				}
			});
			DWREngine.setAsync(false);
			if((getUids != '')&& (getUids != form.findField("uids").getValue())){
				Ext.example.msg('系统提示','该出库单号已存在！请修改！');
				return;
			}		
		}
    	var obj = form.getValues();
		for(var i=0; i<ColumnsOut.length; i++) {
    		var n = ColumnsOut[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	DWREngine.setAsync(false);
    	equMgm.addOrUpdateEquOut(obj,function(str){
    		if(str == "0"){
    			Ext.example.msg('提示信息','设备出库保存失败！');
    		}else{
    			Ext.example.msg('提示信息','设备出库保存成功！');
    		}
    	});
    	DWREngine.setAsync(true);
	}
	function changePart(){
		parent.tabPanel.setActiveTab(0);
        parent.expandTreePanelPath(edit_conid);
		parent.selectWin.close();
	}
	//保存设备部件信息，并更新设备库存数量
	function saveOutSub(){
		var records=dsOutSub.getModifiedRecords();
		var flag=true;
		if(records.length!=0){
			for(var i=0;i<records.length;i++){
				var oldstocknum;
				var oldoutNum;
				DWREngine.setAsync(false);
    			equMgm.getStockNumFromStock(records[i].get('stockId'),function(num){
    				oldstocknum=num;
    			});
    			equMgm.getOutNumFromOutSub(records[i].get('uids'),function(num){
    				oldoutNum=num;
    			});
    			DWREngine.setAsync(true);
    			var newstockNum=oldstocknum+oldoutNum-records[i].get('outNum');
    			if(newstockNum<0){
					Ext.Msg.show({
						title: '提示',
			            msg: '设备'+records[i].get('equPartName')+'的出库数量不能大于库存数量',
			            icon: Ext.Msg.WARNING, 
			            width:200,
			            buttons: Ext.MessageBox.OK
					});
					flag = false;
					break;
			    }
			}
			if(flag){
			    for(var i=0;i<records.length;i++){
					var oldstocknum;
					var oldoutNum;
					DWREngine.setAsync(false);
	    			equMgm.getStockNumFromStock(records[i].get('stockId'),function(num){
	    				oldstocknum=num;
	    			});
	    			equMgm.getOutNumFromOutSub(records[i].get('uids'),function(num){
	    				oldoutNum=num;
	    			});
	    			DWREngine.setAsync(true);
	    			var newstockNum=oldstocknum+oldoutNum-records[i].get('outNum');
	    			DWREngine.setAsync(false);
					equMgm.updateStockNum(newstockNum, records[i].get('stockId'), 0, function() {

					});
	    			DWREngine.setAsync(true);
			   }
		      gridPanelSub.defaultSaveHandler();
		    }
		}
	};
	//删除选中的设备部件信息，并更新设备库存数量
	function deleteOutSub(){
		var record=smOutSub.getSelected();
		var oldstocknum;
		if(!record){
			return Ext.example.msg('提示信息','请先选择要删除的数据！');
		}
		DWREngine.setAsync(false);
		equMgm.getStockNumFromStock(record.get('stockId'),function(num){
			oldstocknum=num;
		});
		DWREngine.setAsync(true);
		var newstockNum=oldstocknum+record.get('outNum');
		DWREngine.setAsync(false);
		  equMgm.updateStockNum(newstockNum,record.get('stockId'),0,function(){
				    			  	
		  });
		DWREngine.setAsync(true);
		gridPanelSub.defaultDeleteHandler();
	}
	//领料用途
	function showBdgTreeWin(){
        bdgTreeWin.show();
    }
});