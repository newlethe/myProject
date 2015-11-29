var bean = "com.sgepit.pmis.budget.hbm.BdgProject"
var listMethod = "findWhereOrderby";
var primaryKey = "proappid";
var orderColumn = "conid";
var SPLITB = "`";
var business = "baseMgm";
var gridPanelTitle = "合同:" +　conname  +　"   工程量分摊记录"
var rootText = "工程量分摊";
var unit = new Array();
var treeMoney;
var totalMoney;
var winChooseNode,chooseParentNode,viewWin
//选择的树节点的path路径
var selTreePath;
var currentPid = CURRENTAPPID;
var addBdgProWin;//新增工程量窗口
var formPanel;
var bdgid;//设置选择关联工程连
Ext.onReady(function (){
	
	var conUnit = new Array();
	var subjectArr = new Array();//财务科目
	var assetArr = new Array();//固定资产清单
    DWREngine.setAsync(false);
    appMgm.getCodeValue('工程量施工单位',function(list){
        for(i = 0; i<list.length; i++){
            var temp = new Array(); 
            temp.push(list[i].propertyCode);        
            temp.push(list[i].propertyName);                
            conUnit.push(temp)
        }
    });
	baseDao.getData("select TREEID,SUBJECT_ALLNAME from FACOMP_FINANCE_SUBJECT where PID='" + CURRENTAPPID
					+ "'", function(list){
	    for(i = 0; i < list.length; i++) {
	        var temp = new Array();
	        temp.push(list[i][0]);
	        temp.push(list[i][1]);
	        subjectArr.push(temp);
	    }
	});
	baseDao.getData("select t.treeid,t.fixedname from FACOMP_FIXED_ASSET_LIST t where PID='" + CURRENTAPPID
    				+ "'", function(list){
        for(i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]);
            assetArr.push(temp);
        }
    });
    DWREngine.setAsync(true);
    
    var dsConUnit = new Ext.data.SimpleStore({
        fields:['k','v'],
        data:conUnit
    });
	//--------------------------------------------------------------------------
	var fm = Ext.form;
	var fc = {		// 创建编辑域配置
    	'proappid': {
			name: 'proappid',
			fieldLabel: '工程量主键',
			anchor:'95%',
			hidden:true,
			hideLabel:true
        }, 'pid':{
        	name : 'pid',
        	fieldLabel : 'pid',
        	hidden : true
        },
        'conid': {
			name: 'conid',
			fieldLabel: '合同主键',
			allowBlank: false,
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		}, 'bdgid': {
			name: 'bdgid',
			fieldLabel: '概算主键',
			readOnly:true,
			hidden:true,
			hideLabel:true,
			anchor:'95%'
		}, 'prono': {
			name: 'prono',
			fieldLabel: '工程量编号',
			allowBlank: false,
			anchor:'95%'
        }, 'proname': {
			name: 'proname',
			fieldLabel: '工程量名称',
			allowBlank: false,
			anchor:'95%'
        }, 'unit': {
			name: 'unit',
			fieldLabel: '单位',
			anchor:'95%'
		}, 'price': {
			name: 'price',
			fieldLabel: '单价',
			allowBlank: false,
			anchor:'95%'
		}, 'amount': {
			id : 'amountField',
			name: 'amount',
			fieldLabel: '总工程量',
			allowBlank: false,
			anchor:'95%'
		}, 'money': {
			name: 'money',
			fieldLabel: '金额',
			anchor:'95%'
		}, 'state': {
			name: 'state',
			fieldLabel: '状态',
			anchor:'95%'
		}, 'constructionUnit' : {
			name : 'constructionUnit',
			fieldLabel : '施工单位',
			valueField:'k',
            displayField:'v',
            readOnly : true,
            mode:'local',
            triggerAction:'all',
            anchor : '95%',
//            allowBlank : false,
            store:dsConUnit
		}, 'quantitiesType' : {
			name : 'quantitiesType',
			fieldLabel : '工程量类型',
			anchor : '95%'
		}, 'financialAccount' : {
			name : 'financialAccount',
			fieldLabel : '财务科目',
			anchor : '95%'
		}, 'isper': {
			name : 'isper',
			fieldLabel : '总工程量是否带百分号'
		},'fixedAssetList' : {
			name : 'fixedAssetList',
			fieldLabel : '所属固定资产'
		}
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
		{name: 'amount', type: 'float'},
		{name: 'money', type: 'float'},
		{name: 'state', type: 'string'},
		{name: 'constructionUnit', type: 'string'},
		{name: 'quantitiesType', type: 'string'},
		{name: 'financialAccount', type: 'string'},
		{name: 'isper', type: 'string'},
		{name: 'fixedAssetList', type: 'string'}
		];
		
    var Plant = Ext.data.Record.create(Columns);
	var PlantInt = {
    		pid : currentPid,
	    	conid:  null, 
	    	bdgid: null,
	    	prono: null,
	    	proname: null,
	    	unit: null,
	    	price: null,
	    	amount: null,
	    	money:null,
	    	state:'4',
	    	constructionUnit : '',	//施工单位
		    quantitiesType : '',	//工程量类型
		    financialAccount : '',	//财务科目
		    fixedAssetList : ''		//固定资产清单
    }
    
    var sm =  new Ext.grid.CheckboxSelectionModel();
    
	var amountField = new Ext.form.TextField(fc['amount']);
	amountField.on('show',function(){
		var rec = sm.getSelected();
    	var amount = rec.get('isper')=='1' ? (rec.get('amount')*100).toFixed(2) + "%" : rec.get('amount');
    	amountField.setValue(amount);
	});

	var subjectTreeCombo = new Ext.ux.TreeCombo({
				name : 'financialAccount',
				fieldLabel : '财务科目',
				resizable : true,
				treeWidth : 250,
				anchor : '95%',
				loader : new Ext.tree.TreeLoader({
							url : MAIN_SERVLET,
							requestMethod : "GET",
							baseParams : {
								ac : "tree",
								treeName : "subjectColumnTree",
								businessName : 'faBaseInfoService',
								parent : '01',
								pid : CURRENTAPPID
							},
							clearOnLoad : true,
							uiProviders : {
								'col' : Ext.tree.ColumnNodeUI
							}
						}),
				root : new Ext.tree.AsyncTreeNode({
							id : "01",
							text : "财务科目",
							iconCls : 'form',
							expanded : true
						})
			});
	subjectTreeCombo.getTree().on('beforeload', function(node) {
				subjectTreeCombo.getTree().loader.baseParams.parent = node.id;
			});
	subjectTreeCombo.on('select', function(tree, node) {
				if (node.id == '01') {
					Ext.example.msg("信息提示：", "请选择分类下的子分类！");
					this.setRawValue("");
					return;
				}
				this.setRawValue(node.text);
			});
	subjectTreeCombo.on('show', function(){
				var rec = sm.getSelected();
				var subjectTreeid = rec.get('financialAccount');
				if(subjectTreeid){
					for (var i = 0; i < subjectArr.length; i++) {
						if (subjectTreeid == subjectArr[i][0]){
							subjectTreeCombo.value = subjectTreeid;
							subjectTreeCombo.setRawValue(subjectArr[i][1]);
							break;
						}
					}
				}else {
					subjectTreeCombo.value = '';
					subjectTreeCombo.setRawValue('');
				}
	})

	var assetTreeCombo = new Ext.ux.TreeCombo({
				name : 'fixedAssetList',
				fieldLabel : '固定资产',
				resizable : true,
				treeWidth : 250,
				anchor : '95%',
				loader : new Ext.tree.TreeLoader({
							url : MAIN_SERVLET,
							requestMethod : "GET",
							baseParams : {
								ac : "tree",
								treeName : "getFACompFixedAssetList",
								businessName : 'faBaseInfoService',
								parent : '01',
								pid : CURRENTAPPID
							},
							clearOnLoad : true,
							uiProviders : {
								'col' : Ext.tree.ColumnNodeUI
							}
						}),
				root : new Ext.tree.AsyncTreeNode({
							id : "01",
							text : "固定资产",
							iconCls : 'icon-pkg',
							expanded : true
						})
			});

	assetTreeCombo.getTree().on('beforeload', function(node) {
				assetTreeCombo.getTree().loader.baseParams.parent = node.id;
			});

	assetTreeCombo.on('select', function(tree, node) {
				if (node.id == '01') {
					Ext.example.msg("信息提示：", "请选择分类下的子分类！");
					this.setRawValue("");
					return;
				}
				this.setRawValue(node.text);
			});
	assetTreeCombo.on('show', function(){
				var rec = sm.getSelected();
				var assetTreeid = rec.get('fixedAssetList');
				if(assetTreeid){
					for (var i = 0; i < assetArr.length; i++) {
						if (assetTreeid == assetArr[i][0]){
							assetTreeCombo.value = assetTreeid;
							assetTreeCombo.setRawValue(assetArr[i][1]);
							break;
						}
					}
				}else {
					assetTreeCombo.value = '';
					assetTreeCombo.setRawValue('');
				}
	})

    var cm = new Ext.grid.ColumnModel([
    	new Ext.grid.RowNumberer(),
    	{
           id:'proappid',
           header: fc['proappid'].fieldLabel,
           dataIndex: fc['proappid'].name,
		   hidden:true,
		   hideLabel:true
        }, {
        	id : 'pid',
        	header : fc['pid'].fieldLabel,
        	dataIndex : fc['pid'].name,
        	hidden : true
        },{
           id:'conid',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,
           hidden:true,
           hideLabel:true
        }, {
           id:'bdgid',
           header: fc['bdgid'].fieldLabel,
           dataIndex: fc['bdgid'].name,
           hidden:true,
           hideLabel:true
        },{
           id:'prono',
           header : fc['prono'].fieldLabel,
           dataIndex : fc['prono'].name,
           width :80,
           editor : new Ext.form.TextField(fc['prono']),
           align : 'center'
        },{
           id:'proname',
           header: fc['proname'].fieldLabel,
           dataIndex: fc['proname'].name,
           width: 120,
           editor : new Ext.form.TextField(fc['proname']),
           align : 'center'
        }, {
           id:'unit',
           header: fc['unit'].fieldLabel,
           dataIndex: fc['unit'].name,
           width: 50,
           align : 'center',
           editor : new Ext.form.TextField(fc['unit'])
        }, {
           id:'price',
           align: 'price',
           header: fc['price'].fieldLabel,
           dataIndex: fc['price'].name,
           width: 80,
           align: 'right',
           allowBlank: true,
           renderer: cnMoney,
           editor : new Ext.form.NumberField(fc['price'])
        }, {
           id:'amount',
           header: fc['amount'].fieldLabel,
           dataIndex: fc['amount'].name,
           width: 70,
           align: 'right',
           editor : amountField,
           renderer : function(v,m,r){
				return r.get('isper') == '1' ? (v*100).toFixed(2) + "%" : v;
           }
        }, {
           id:'money',
           header: fc['money'].fieldLabel,
           dataIndex: fc['money'].name,
           align: 'right',
           width: 70
        }, {
           id:'constructionUnit',
           header: fc['constructionUnit'].fieldLabel,
           dataIndex: fc['constructionUnit'].name,
           editor : new fm.ComboBox(fc['constructionUnit']),	//施工单位
           renderer : function(v){
                for (var i = 0; i < conUnit.length; i++) {
                    if(conUnit[i][0] == v){
                        return conUnit[i][1];
                    }
                }
           }
        }, {
           id:'quantitiesType',
           header: fc['quantitiesType'].fieldLabel,
           dataIndex: fc['quantitiesType'].name,
           editor :  new fm.TextField(fc['quantitiesType']),	//工程量类型
           width :120
       }, {
           id:'financialAccount',
           header: fc['financialAccount'].fieldLabel,
           dataIndex: fc['financialAccount'].name,
           editor : subjectTreeCombo,	//财务科目
           width: 200,
           renderer : function(v){
				for(var i = 0; i < subjectArr.length; i++){
					if(v == subjectArr[i][0]){
						return subjectArr[i][1];
					}
				}
           }
        }, {
           id:'fixedAssetList',
           header: fc['fixedAssetList'].fieldLabel,
           dataIndex: fc['fixedAssetList'].name,
           editor : assetTreeCombo,	//固定资产清单树
           width : 150,
           renderer : function(v){
				for(var i = 0; i < assetArr.length; i++){
					if(v == assetArr[i][0]){
						return assetArr[i][1];
					}
				}
           }
       }, {
           id:'state',
           header: fc['state'].fieldLabel,
           dataIndex: fc['state'].name,
           width: 40,
           align : 'center',
           renderer: function(value){
           		if(value == '4'){
           			value = '签订';
           		}
           	    return value;
           }
        }, {
			id:'isper',
			header: fc['isper'].fieldLabel,
			dataIndex: fc['isper'].name,
        	hidden : true
        }
	])
    cm.defaultSortable = true;
    var totalField = new Ext.Button({
    		id:'total'
    		});
    var ds = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',
	    	bean: bean,				
	    	business: business,
	    	method: listMethod
	    	//params: propertyName+SPLITB+propertyValue   // where 子句
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true
    });
    ds.setDefaultSort(orderColumn, 'asc');

	gridPanel = new Ext.grid.EditorGridTbarPanel({
    	id: 'module-grid-panel',
        ds: ds,
        cm: cm,
        sm: sm,
        header: false,
        tbar: [
        {
			id : 'down',
			text : '下载模板',
			tooltip : '如果需要通过Excel导入数据,请先下载模板',
			iconCls : 'download',
			pressed : true,
			handler : downloadExcelTemp
		},'-',{
        	id : 'upload',
			text : 'excel导入',
			tooltip : '请先选好左侧概算树节点,导入之后直接进行概算关联!',
			iconCls : 'upload',
			pressed : true,
			disabled : true,
			handler : importDataFile
		},'-',{
			id:'relating',
			text:'关联工程量',
			tooltip:'请选择左边的概算树节点进行关联工程量！',
			iconCls:'btn',
			pressed:true,
			disabled:true,
			handler:showViewWin
		},'-',{
			id:'refreshmoney',
			text:'关联金额',
			tooltip:'点击此按钮刷新左边概算的实际金额!',
			iconCls:'btn',
			pressed:true,
			disabled:true,
			hidden: true,
			handler:refreshRealMoney
		}
        ],
        //title: "所有工程量",
        iconCls: 'icon-by-category',
        region: 'east',
        split: true,
        width: 850,
        collapsible : true,
        collapseMode : 'mini',
        minSize: 100,
        maxSize: 800,
        border: true,
        autoScroll: true,			//自动出现滚动条
        animCollapse: false,		//折叠时显示动画
//        autoExpandColumn: 1,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
        loadMask: true,				//加载时是否显示进度
		viewConfig:{
			forceFit: false,
			ignoreAdd: true
		},
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,	
      	saveBtn : true,
      	addBtn : true,
      	business: "baseMgm",	
      	primaryKey: primaryKey,	
      	insertHandler: insertFun,
      	saveHandler: saveFun,
      	deleteHandler: deleFun,
      	listeners : {
		    aftersave : function (grid,idsOfInsert,idsOfUpdate,primaryKey,bean){
		               conpartybMgm.immediatelySendPartybSave(idsOfInsert,idsOfUpdate,bean,function(rtn){
		               });
		    },
		    beforeedit :function (o){
		        var rec = o.record;
		        var proappid=rec.get('proappid');
		        var conid = rec.get('conid');
		        var pid = rec.get('pid');
		        var res;
		        DWREngine.setAsync(false);
		        bdgProjectMgm.checkBdgProjectIsUse(proappid,conid,pid,function (rtn){
		            res = rtn; 
		        })
		        DWREngine.setAsync(true);
		        if(res=='1'){
//		            return false;
		        }
		    },
		    afteredit : function(e){
		    	if(e.field == "amount"){
					var editRecord=e.record;
					var newValue=e.value;
					var oldValue=e.originalValue ;
					var regex = /^\-?\d+(\.\d+)?\%?$/;// 可以为负数，一个或多个数字，0个或1个.和至少1个数字，0个或1个%
				    if(!regex.exec(newValue)){
				    	Ext.example.msg("提示","格式错误,只能输入百分数或数字");
				    	editRecord.set("amount",oldValue);
				    	return false;
				    }else{
				    	if(newValue.indexOf("%") != -1){
							newValue = parseFloat(newValue.substring(0,newValue.length-1))/100;
				    		editRecord.set('isper', '1');
				    		editRecord.set('amount', newValue);
				    	}else{
				    		editRecord.set('isper', '0');
				    	}
				    	editRecord.set('money', (editRecord.get('price')*newValue).toFixed(2));
				    }
				}
				if(e.field == "price"){
					var editRecord=e.record;
					var price = e.value;
					var amount = editRecord.get('amount');
		    		editRecord.set('money', (price*amount).toFixed(2));
				}
		    }
      	}
      	,
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: 15,
            store: ds,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	});	
	
	function insertFun(){
		if(winChooseNode == ''||winChooseNode == null){
			alert('请选择左边的概算树后再进行操作!')
			return
		}

	var subjectTreeComboForm = new Ext.ux.TreeCombo({
				name : 'financialAccountForm',
				fieldLabel : '财务科目',
				resizable : true,
				treeWidth : 250,
				anchor : '95%',
				loader : new Ext.tree.TreeLoader({
							url : MAIN_SERVLET,
							requestMethod : "GET",
							baseParams : {
								ac : "tree",
								treeName : "subjectColumnTree",
								businessName : 'faBaseInfoService',
								parent : '01',
								pid : CURRENTAPPID
							},
							clearOnLoad : true,
							uiProviders : {
								'col' : Ext.tree.ColumnNodeUI
							}
						}),
				root : new Ext.tree.AsyncTreeNode({
							id : "01",
							text : "财务科目",
							iconCls : 'form',
							expanded : true
						})
			});
	subjectTreeComboForm.getTree().on('beforeload', function(node) {
				subjectTreeComboForm.getTree().loader.baseParams.parent = node.id;
			});
	subjectTreeComboForm.on('select', function(tree, node) {
				if (node.id == '01') {
					Ext.example.msg("信息提示：", "请选择分类下的子分类！");
					this.setRawValue("");
					return;
				}
				this.setRawValue(node.text);
			});

	var assetTreeComboForm = new Ext.ux.TreeCombo({
				name : 'fixedAssetListForm',
				fieldLabel : '固定资产',
				resizable : true,
				treeWidth : 250,
				anchor : '95%',
				loader : new Ext.tree.TreeLoader({
							url : MAIN_SERVLET,
							requestMethod : "GET",
							baseParams : {
								ac : "tree",
								treeName : "getFACompFixedAssetList",
								businessName : 'faBaseInfoService',
								parent : '01',
								pid : CURRENTAPPID
							},
							clearOnLoad : true,
							uiProviders : {
								'col' : Ext.tree.ColumnNodeUI
							}
						}),
				root : new Ext.tree.AsyncTreeNode({
							id : "01",
							text : "固定资产",
							iconCls : 'icon-pkg',
							expanded : true
						})
			});

	assetTreeComboForm.getTree().on('beforeload', function(node) {
				assetTreeComboForm.getTree().loader.baseParams.parent = node.id;
			});

	assetTreeComboForm.on('select', function(tree, node) {
				if (node.id == '01') {
					Ext.example.msg("信息提示：", "请选择分类下的子分类！");
					this.setRawValue("");
					return;
				}
				this.setRawValue(node.text);
			});

	if(!formPanel){
		formPanel = new Ext.form.FormPanel({
	    id:'bdgProForm',
	    frame : false,
	    border : false,
	    buttionAlign : 'center',
	    bodyStyle : 'padding:5px',
	    labelAlign : 'right',
	    items :[
	        {
	            xtype : 'fieldset',
	            baseCls :'x-fieldset',
	            autoShow : true,
	            autoHeight : true,
	            autoWidth : true,
	            border : false,
	            width :1000,
	            layout : 'column',
	            items :[
	                {
	                    columnWidth : .5,
	                    layout : 'form',
	                    border : false,
	                    items :[{
	                            xtype : 'textfield',
	                            id : 'prono',
	                            name : 'prono',
	                            allowBlank : false,
	                            fieldLabel : '工程量编号',
	                            anchor :'95%'
	                        },
	                        new fm.ComboBox(fc['constructionUnit']),	//施工单位
                            new fm.TextField(fc['quantitiesType']),		//工程量类型
	                        {
	                            xtype : 'textfield',
	                            id : 'unit',
	                            name : 'nuit',
	                            allowBlank : false,
	                            fieldLabel : '单位',
	                            anchor : '95%'
	                        },{
	                               xtype :'numberfield',
	                               id :'money',
	                               name :'money',
	                               disabled:true,
	                               fieldLabel :'总金额(元)',
	                               anchor :'95%'
	                        }
	                    ]
	                },{
	                       columnWidth :.5,
	                       layout : 'form',
	                       border : false,
	                       items:[
	                           {
	                               xtype :'textfield',
	                               id : 'proname',
	                               name :'proname',
	                               allowBlank : false,
	                               fieldLabel :'工程量名称',
	                               anchor :'95%'
	                           },
	                           subjectTreeComboForm,	//财务科目
	                           assetTreeComboForm,
	                           {
	                               xtype :'numberfield',
	                               id : 'price',
	                               name : 'price',
	                               allowBlank : false,
	                               fieldLabel :'单价(元)',
	                               anchor :'95%'
	                           },{
	                            xtype : 'textfield',
	                            id : 'amount',
	                            allowBlank : false,
	                            name : 'amount',
	                            fieldLabel :'总工程量',
	                            anchor :'95%'
	                        	}
	                       ]
	                },{
	                       xtype : 'textfield',
	                       id : 'proappid',
	                       name : 'proappid',
	                       fieldLabel : 'ID',
	                       hidden : true,
	                       hideLabel : true
	                }
	            ]
	        }
	    ],
	    buttons :[
	        {
	            text : '保存',
	            handler : function (){
	            	var baseForm = formPanel.getForm();
	                if(baseForm.isValid()){
	                	var prono = baseForm.findField('prono').getValue();
	                	var proname = baseForm.findField('proname').getValue();
	                	var unit = baseForm.findField('unit').getValue();
	                	var amount = baseForm.findField('amount').getValue();
	                	var price = baseForm.findField('price').getValue();
	                	var proappid = baseForm.findField('proappid').getValue();
	                	var money = baseForm.findField('money').getValue();
	                	
	                	var regex = /^\-?\d+(\.\d+)?\%?$/;//一个或多个数字，0个或1个.和至少1个数字，0个或1个%
                        if(amount && !regex.exec(amount)){
                        	Ext.example.msg("提示","总工程量格式错误");
                        	return false;
                        }
                        
	                	var obj = new Object();
	                	    obj.pid=currentPid;
	                	    if(amount.indexOf("%") != -1){
	                	    	obj.amount = parseFloat(amount.substring(0,amount.length-1))/100;
	                	    	obj.isper = '1';
	                	    }else{
	                	    	obj.amount = amount;
	                	    	obj.isper = '0';
	                	    }
	                	    obj.conid=conid;
	                	    obj.money = money;
	                	    obj.bdgid = bdgid;
	                	    obj.price =price;
	                	    obj.proname =proname;
	                	    obj.prono = prono;
                	        obj.state = '4';
	                	    obj.unit = unit;
	                	    obj.proappid =proappid;
	                	    obj.constructionUnit = baseForm.findField('constructionUnit').getValue();
                            obj.quantitiesType = baseForm.findField('quantitiesType').getValue();
                            obj.financialAccount = baseForm.findField('financialAccountForm').getValue();
                            obj.fixedAssetList = baseForm.findField('fixedAssetListForm').getValue();
	                	    //验证工程量编号和工程量名称唯一性(不需要了)
	                	     DWREngine.setAsync(false);
//	                	     var rtnState="";
//	                	     bdgProjectMgm.checkBdgProValid(obj.prono,obj.proname,obj.conid,obj.pid,function (rtn){
//	                	         rtnState = rtn;
//	                	     })
//	                	     if(rtnState==="") {
//	                	     	top.location.href = CONTEXT_PATH + "/jsp/index/SessionTimeOut.jsp";
//	                	     	return;
//	                	     }
//	                	     if(rtnState==true){
//	                	         Ext.Msg.alert('提示信息','该工程量编号或工程量名称已存在!');
//	                	         return ;
//	                	     }
//	                	    
//	                	     if(conid==""||conid==null||conid=="null"){
//	                	     	Ext.Msg.alert('提示信息','保存出错，请重试!');
//	                	     	return;
//	                	     }
	                	    var rtnCon;
							baseMgm.findById("com.sgepit.pmis.contract.hbm.ConOveView",conid,function(rtn){
		    					rtnCon=rtn;
							})
							if(rtnCon && (rtnCon.billstate=='3'||rtnCon.billstate=='4')){
		 						Ext.Msg.alert('提示信息','已结算或已终止的合同不允许进行工程量分摊新增');
		  				    	return;
							}
	                	     if(proappid==""){
	                	         bdgProjectMgm.insertBdgProject(obj,function (){
	                	             ds.baseParams.params = "bdgid='" + obj.bdgid  + "' and conid='" + obj.conid + "'"
	                	             ds.load({
	                	                 callback : function (){
	                	                     totalMoney =caculateTotalMoney(obj.bdgid,obj.conid);	
		                                     if (totalMoney != treeMoney){
			                                      var warninfo = '<font color=red title="实际金额：'+treeMoney+',工程量总金额：'+totalMoney+'"' +
					                                  'style="cursor:default !important;">实际金额与工程量总金额不相等</font>'
			                                      prompt.el.innerHTML = warninfo+"&nbsp;&nbsp;&nbsp;";
			                                      prompt.el.style.cursor = "pointer"
		 	                                      prompt.setVisible(true);
		                                     }else{
			                                      prompt.el.innerHTML = "";
			                                      prompt.setVisible(false);
		                                     }
    	                                     totalField.setText("<font color=red size=2>"+cnMoneyToPrec(totalMoney)+"</font>");	                	                    	           
	                	                 },
	                	        		params : {
										start : 0, // 起始序号
										limit : 15
										// 结束序号，若不分页可不用设置这两个参数
										}
	                	             });
	                	         });
	                	     }else {
	                	         bdgProjectMgm.updateBdgProject(obj,function (){
	                	             ds.baseParams.params = "bdgid='" + obj.bdgid  + "' and conid='" + obj.conid + "'"
	                	             ds.load({
	                	                 callback : function (){
	                	                     totalMoney =caculateTotalMoney(obj.bdgid,obj.conid);	
		                                     if (totalMoney != treeMoney){
			                                      var warninfo = '<font color=red title="实际金额：'+treeMoney+',工程量总金额：'+totalMoney+'"' +
					                                  'style="cursor:default !important;">实际金额与工程量总金额不相等</font>'
			                                      prompt.el.innerHTML = warninfo+"&nbsp;&nbsp;&nbsp;";
			                                      prompt.el.style.cursor = "pointer"
		 	                                      prompt.setVisible(true);
		                                     }else{
			                                      prompt.el.innerHTML = "";
			                                      prompt.setVisible(false);
		                                     }
    	                                     totalField.setText("<font color=red size=2>"+cnMoneyToPrec(totalMoney)+"</font>");	                	                 
	                	                 },
	                	            	params : {
										start : 0, // 起始序号
										limit : 15
										// 结束序号，若不分页可不用设置这两个参数
										}
	                	             });
	                	         })
	                	     }
	                	     DWREngine.setAsync(true);
	                	     Ext.example.msg('保存成功！', '您成功保存了一条信息！');
	                	     baseForm.reset();
	                	     addBdgProWin.hide();
	                	     totalMoney =(bdgid,conid);	
		                     if (totalMoney != treeMoney){
			                     var warninfo = '<font color=red title="实际金额：'+treeMoney+',工程量总金额：'+totalMoney+'"' +
					                            'style="cursor:default !important;">实际金额与工程量总金额不相等</font>'
			                     prompt.el.innerHTML = warninfo+"&nbsp;&nbsp;&nbsp;";
			                     prompt.el.style.cursor = "pointer"
		 	                     prompt.setVisible(true);
		                     }else{
			                     prompt.el.innerHTML = "";
			                     prompt.setVisible(false);
		                      }
    	                      totalField.setText("<font color=red size=2>"+cnMoneyToPrec(totalMoney)+"</font>");
	                }
	            }
	        },{
	            text :'取消',
	            handler : function (){
	                 formPanel.getForm().reset();
	                 addBdgProWin.hide();
	            }
	        }
	    ]
	    
	})
}
		if(!addBdgProWin){
		    addBdgProWin = new Ext.Window({
		        id : 'bdgProWin',
		        title :'新增',
		        iconCls :'form',
		        width: 700,
		        height :240,
		        modal:true,
		        closeAction : 'hide',
		        maximizable : true,
		        minimizable : true,
		        resizable : true,
		        autoScroll:true,
		        plain: true,
		        items :[formPanel],
		        listeners : {
		            'hide' : function (win){
		                win.close();
		            },
                    'show' : function(){
                        var amount = formPanel.getForm().findField('amount');
                        var price = formPanel.getForm().findField('price');
                        var money = formPanel.getForm().findField('money');
				        amount.on("blur",function(){
				            var a = amount.getValue();
                            var p = price.getValue();
                            var regex = /^\-?\d+(\.\d+)?\%?$/;//一个或多个数字，0个或1个.和至少1个数字，0个或1个%
                            if(a && !regex.exec(a)){
                            	Ext.example.msg("提示","总工程量格式错误");
                            	return false;
                            }
                            if(a && p!=""){
                            	a=a.indexOf('%')!=-1?(a.substring(0,a.length-1))/100:a;
                                var v = (a*p).toFixed(2);
                                money.setValue(v);
                            }
				        });
                        price.on("blur",function(){
                            var a = amount.getValue();
                            var p = price.getValue();
                            if(a && p!=""){
                            	a=a.indexOf('%')!=-1?(a.substring(0,a.length-1))/100:a;
                                var v = (a*p).toFixed(2);
                                money.setValue(v);
                            }
                        });
                        subjectTreeComboForm.value = '';
						subjectTreeComboForm.setRawValue('');
						assetTreeComboForm.value = '';
						assetTreeComboForm.setRawValue('');
                    }
		        }
		    })
		}
		addBdgProWin.show();
    }
    
    function deleFun(){
 		if(winChooseNode == ''||winChooseNode == null){
			alert('请选择左边的概算树后再进行操作!')
			return			
		}
		if(gridPanel.getSelectionModel().getSelections()==0){
			alert('请选择需要删除的工程量!')
			return
		}
    	Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,text) {
			if (btn == "yes"){
				var rtnCon;
				DWREngine.setAsync(false)
					baseMgm.findById("com.sgepit.pmis.contract.hbm.ConOveView",conid,function(rtn){
					rtnCon=rtn;
				})
				DWREngine.setAsync(true)
				if(rtnCon.billstate=='3'||rtnCon.billstate=='3'){
					Ext.Msg.alert('提示信息','已结算或已终止的合同不允许进行工程量分摊删除');
					return;
				}
				var appid = winChooseNode.attributes.appid
				var selectRecords = gridPanel.getSelectionModel().getSelections()
				if(typeof('selectRecords')=='undefined'){
				    Ext.Msg.alert('提示信息','请选择要删除的记录');
				    return;
				}
				DWREngine.setAsync(false)
				if(selectRecords.length > 0){
					for(var i=0;i<selectRecords.length;i++){
						var proid = selectRecords[i].get('proappid')
						if(proid ==''||proid == null)
							continue
						else {
							bdgProjectMgm.deleteRelaProject(proid,function(flag){})
						}
					}
				}
				DWREngine.setAsync(true)	
				Ext.example.msg('提示','您成功删除了'+ selectRecords.length +'条信息')		
				ds.load({
					callback:function(){
							totalMoney =caculateTotalMoney(bdgid,conid);
							totalField.setText("<font color=red size=2>"+cnMoneyToPrec(totalMoney)+"</font>");
					},
					params : {
						start : 0, // 起始序号
						limit : 15
						// 结束序号，若不分页可不用设置这两个参数
					}
				});
				refresh()
			}
		})
    }
    
    function saveFun(){
		if(winChooseNode == ''||winChooseNode == null){
			alert('请选择左边的概算树后再进行操作!')
			return			
		}
		var rtnState;
		DWREngine.setAsync(false)
		baseMgm.findById("com.sgepit.pmis.contract.hbm.ConOveView",conid,function(rtn){
		    rtnState=rtn;
		})
		DWREngine.setAsync(true)
		if(rtnState.billstate=='3'||rtnState.billstate=='3'){
		    Ext.Msg.alert('提示信息','已结算或已终止的合同不允许进行工程量分摊修改');
		    return ;
		}
    	var records = ds.getModifiedRecords();
  		
		for (var i=0; i<records.length; i++){
			var r_price = records[i].get('price');
			var r_amount = records[i].get('amount');
			
	    	if (!r_price||!r_amount){
	    		var msg = ((!r_price)?"请先填写单价!":"请先填写工程总量!");
    			Ext.Msg.alert('提示',msg);
    			window.setTimeout("Ext.Msg.hide();",2000);//2秒自动关闭提示
    			//Ext.example.msg('填写不完全！');
    			return;
    		}
    		//  当是工程量变更的时候
    		if (type == 'modify'){
    			records[i].set('state', '变更');	
    		}
		}
		totalMoney =caculateTotalMoney(bdgid,conid);		
		if (totalMoney != treeMoney){
			var warninfo = '<font color=red title="实际金额：'+treeMoney+',工程量总金额：'+totalMoney+'"' +
					'style="cursor:default !important;">实际金额与工程量总金额不相等</font>'
			prompt.el.innerHTML = warninfo+"&nbsp;&nbsp;&nbsp;";
			prompt.el.style.cursor = "pointer"
			prompt.setVisible(true);
		}else{
			prompt.el.innerHTML = "";
			prompt.setVisible(false);
		}
    	totalField.setText("<font color=red size=2>"+cnMoneyToPrec(totalMoney)+"</font>");
    	gridPanel.defaultSaveHandler();
    }
    
    
	//--------------------------------------------------------------------------
	var btnReturn = new Ext.Button({
		text: '返回',
		iconCls: 'returnTo',
		handler: function(){
			window.location.href = BASE_PATH + "Business/budget/bdg.generalInfo.input.jsp?conids="+CONIDS+"&uids="+UIDS+"&optype="+OPTYPE ;
		}
	});
	var btnConIniMoney = new Ext.Button({
		text: '本合同签订分摊金额:',
		id:"conIniMoneyId"
	});
	rootNew = new Ext.tree.AsyncTreeNode({
        text: rootText,
        iconCls: 'form'
        
    })
	treeLoaderNew = new Ext.tree.TreeLoader({
		url: MAIN_SERVLET,
		baseParams: {
			ac:"columntree", 
			treeName:"bdgMoneyProjectTree", 
			businessName:"bdgMgm", 
			conid:conid, 
			conmoney: 0,
			parent:0
		},
		clearOnLoad: true,
		uiProviders:{
		    'col': Ext.tree.ColumnNodeUI
		}
	});
	
	treePanelNew = new Ext.tree.ColumnTree({
        id: 'budget-tree-panel',
        iconCls: 'icon-by-category',
        region: 'center',
        width: 400,
        minSize: 100,
        maxSize: 700,
        frame: false,
        header: false,
        border: false,
        lines: true,
        autoScroll: true,
        animate: false,
		tbar:[/*{text: '<font color=#15428b><b>&nbsp;'+ gridPanelTitle +'</b></font>',
			   //iconCls: 'title'
        		},'-',*/{
                iconCls: 'icon-expand-all',
				tooltip: 'Expand All',
                handler: function(){ rootNew.expand(true); }
            },'-', {
                iconCls: 'icon-collapse-all',
                tooltip: 'Collapse All',
                handler: function(){ rootNew.collapse(true); }
            },'-',btnConIniMoney,'->','-',btnReturn],       
		columns:[{
            header: '概算名称_概算编码(签订分摊金额)',
            width: 700,	
            dataIndex: 'bdgname'
        },{
            header: '概算编码',
            width: 0,
            dataIndex: 'bdgno',
            hidden:true
        },{
            header: '项目工程编号',
            width: 0,				//隐藏字段
            dataIndex: 'pid',
            renderer: function(value){
            	return "<div id='pid'>"+value+"</div>";
            }
        },{
            header: '概算金额主键',	
            width: 0,				
            dataIndex: 'appid',
            renderer: function(value){
            	return "<div id='appid' >"+value+"</div>";
            }
        },{
            header: '概算主键',	
            width: 0,				
            dataIndex: 'bdgid',
            renderer: function(value){
            	return "<div id='bdgid'>"+value+"</div>";
            }
        },{
            header: '内部流水号',
            width: 0,
            dataIndex: 'conid',
            renderer: function(value){
            	return "<div id='conid'>"+value+"</div>";
            }
        },{
            header: '本合同分摊总金额',
            width: 0,
            hidden:true,
            dataIndex: 'conappmoney',
            renderer: function(value){
            	return "<div id='conappmoney' align='right'>"+cnMoneyToPrec(value)+"</div>";
            }
        },{
            header: '本合同签订分摊金额',
            width: 0,
            hidden:true,
            dataIndex: 'initappmoney',
            renderer: function(value){
            	return "<div id='initappmoney' align='right'>"+cnMoneyToPrec(value)+"</div>";
            }
        },
        	{
            header: '是否子节点',
            width: 0,
            dataIndex: 'isleaf',
            renderer: function(value){
            	return "<div id='isleaf'>"+value+"</div>";
            }
        },{
            header: '父节点',
            width: 0,
            dataIndex: 'parent',
            renderer: function(value){
            	return "<div id='parent'>"+value+"</div>";
            }
        },{
            header:'备注',
            width:0,
            dataIndex:'remark'
        }], 
        loader: treeLoaderNew,
        root: rootNew,
        rootVisible: false
	});
	
	
	treePanelNew.on('beforeload', function(node) {
		var bdgid = node.attributes.bdgid;
		if (bdgid == null)
			bdgid = '0';
		var baseParams = treePanelNew.loader.baseParams
		baseParams.conid = conid;
		baseParams.conmoney = 0 ;
		baseParams.parent = bdgid;	
	});
	
    treePanelNew.expand();
	rootNew.expand();
    treePanelNew.on('click', function (node, e ){    	
    	winChooseNode = node
    	chooseParentNode = node.parentNode
		Ext.getCmp('relating').enable();
		Ext.getCmp('refreshmoney').enable();
		Ext.getCmp('upload').enable();
    	if(Ext.getCmp("add"))Ext.getCmp("add").setDisabled(false);
		if(Ext.getCmp("save"))Ext.getCmp("save").setDisabled(false);
		if(Ext.getCmp("del"))Ext.getCmp("del").setDisabled(false);
		var elNode = node.getUI().elNode;
		PlantInt.conid =  conid;
		bdgid =  elNode.all("bdgid").innerText;
		treeMoney = node.attributes.conappmoney;
		var isIeaf = elNode.all("isleaf").innerText;
		btnConIniMoney.setText("本合同签订分摊金额:"+"<font color=red size=2>"+elNode.all("initappmoney").innerText+"</font>");
		if(isIeaf!=1){
			var bdgids="";
    	if(Ext.getCmp("add"))Ext.getCmp("add").setDisabled(true);
		if(Ext.getCmp("save"))Ext.getCmp("save").setDisabled(true);
		if(Ext.getCmp("del"))Ext.getCmp("del").setDisabled(true);
			Ext.getCmp('relating').setDisabled(true);
			Ext.getCmp('upload').setDisabled(true);
			var nodeid=node.id;
			DWREngine.setAsync(false);
       		db2Json.selectData("select bdgid,bdgno from bdg_info where pid='"+currentPid+"' start with parent='"+nodeid+"' connect by prior bdgid=parent",
        		function (jsonData) {
	    	var list = eval(jsonData);
            var money=0;
	    	if(list!=null){
	            for(var i=0;i<list.length;i++){
	            	var bdgid=list[i].bdgid;
	            	bdgids+="'"+bdgid+"'"+",";
	            }
	            bdgids=bdgids.substring(0,bdgids.length-1);
	           money+=caculateTotalMoneyByMulti(bdgids,conid)*1;  
	    	}
	    	totalMoney=money;
	  	 });
	    DWREngine.setAsync(true);
	          ds.baseParams.params = "bdgid in ("+bdgids+") and conid='" + conid + "'";	
		}else{
			  ds.baseParams.params = "bdgid='" + bdgid + "' and conid='" + conid + "'";	
		      totalMoney=caculateTotalMoney(bdgid,conid);  
		}
		ds.load({
			callback:function(){
				//if (isIeaf == 1){  
					if (totalMoney != treeMoney){
						var warninfo = '<font color=red title="实际金额：'+treeMoney+',工程量总金额：'+totalMoney+'"' +
								'style="cursor:default !important;">实际金额与工程量总金额不相等</font>'
						prompt.el.innerHTML = warninfo+"&nbsp;&nbsp;&nbsp;";
						prompt.el.style.cursor = "pointer"
						prompt.setVisible(true);
					}else{
						prompt.el.innerHTML = "";
						prompt.setVisible(false);
					}
					
					totalField.setText("<font color=red size=2>"+cnMoneyToPrec(totalMoney)+"</font>");
				//}
			},
			params : {
				start : 0, // 起始序号
				limit : 15
				// 结束序号，若不分页可不用设置这两个参数
			}
		});
	});
	
	
		
		
	var contentPanel = new Ext.Panel({
			layout: 'border',
			region: 'center',
			border: false,
			header: false,
			tbar:[{text: '<font color=#15428b><b>&nbsp;'+ gridPanelTitle +'</b></font>',
				   iconCls: 'title'
	        		},'-',{
	                iconCls: 'icon-expand-all',
					tooltip: 'Expand All',
	                handler: function(){ rootNew.expand(true); }
	            },'-', {
	                iconCls: 'icon-collapse-all',
	                tooltip: 'Collapse All',
	                handler: function(){ rootNew.collapse(true); }
	            },'->','-',btnReturn],
			items: [treePanelNew]
			
		}) 
			
	// 7. 创建viewport加入面板content
    if(Ext.isAir){ // create AIR window
        var win = new Ext.air.MainWindow({
        	title : gridPanelTitle,
            layout:'border',
            items: [treePanelNew,gridPanel],
            title: 'Simple Tasks',
            iconCls: 'icon-show-all'
        }).render();
	}else{
        var viewport = new Ext.Viewport({
            layout:'border',
            items: [treePanelNew,gridPanel]
        });
      
        
    }
	treePanelNew.render();
	treePanelNew.expand();
	rootNew.expand();
	//gridPanel.collapse();
	//gridPanel.expand();
	
	gridPanel.getTopToolbar().add('->');
	var prompt= new Ext.Toolbar.TextItem('')
	gridPanel.getTopToolbar().add(prompt);
	gridPanel.getTopToolbar().add(new Ext.Toolbar.TextItem('总金额:'));
	gridPanel.getTopToolbar().add(totalField);
	prompt.setVisible(false);
	
	//新增excel导入数据功能的按钮
/*	var excelExp = new Ext.Toolbar({
		renderTo: gridPanel.tbar,
		items: [{
			text:'excel导入',
			tooltip:'导入之后在左边选择概算树右键菜单进行关联;<br>或事先选好树节点导完之后直接进行选择关联!',
			iconCls: 'upload',
			pressed:true,
			hidden:true,
			handler:showExcelWin
		},'-',{
			id:'relating',
			text:'关联工程量',
			tooltip:'请选择左边的概算树节点进行关联工程量！',
			iconCls:'btn',
			pressed:true,
			disabled:true,
			handler:showViewWin
		},'-',{
			id:'refreshmoney',
			text:'关联金额',
			tooltip:'点击此按钮刷新左边概算的实际金额!',
			iconCls:'btn',
			pressed:true,
			disabled:true,
			hidden: true,
			handler:refreshRealMoney
		}]
	});*/
	
	function refreshRealMoney(){
    	var baseParams = treePanelNew.loader.baseParams
		baseParams.parent = chooseParentNode.attributes.bdgid;		
		treeLoaderNew.load(chooseParentNode)
		chooseParentNode.expand()		
//    	treeLoaderNew.load(rootNew)
//    	rootNew.expand(true)
		winChooseNode.fireEvent('click',winChooseNode)
	}

/**	function showExcelWin(){
		if(!fileWin){
			var fileForm = new Ext.form.FormPanel({
				fileUpload:true,
				labelWidth:150,
				layout:'form',
				baseCls:'x-plain',
				items:[{
					id:'excelfile',
					xtype:'fileuploadfield',
					fieldLabel:'excel',
					buttonText:'excel上传',
					width: 1590,
					border:false,
					listeners:{
						'fileselected':function(field,value){
							var _value = value.split('\\')[value.split('\\').length-1]
							if(_value.indexOf('.xls') != -1){
								this.ownerCt.buttons[0].enable()
							}else{
								field.setValue('')
								this.ownerCt.buttons[0].disable()
								Ext.example.msg('警告','请上传excel格式的文件')
							}
						}
					}
				}],
				buttons:[{
					text:'确定',
					iconCls:'upload',
					disabled:true,
					handler:doExcelUpLoad
				}]
			})
			var fileWin = new Ext.Window({
				id:'excelWin',
				title:'excel导入',
//				closeAction:'hide',
				modal:true,
				width:450,
				height:100,
				items:[fileForm]
			})
		}
		fileWin.show()
	}
	
	function doExcelUpLoad(){
		var win = this.ownerCt.ownerCt
		this.ownerCt.getForm().submit({
			waitTitle:'请稍候...',
			waitMsg:'数据上传中...',
			url:MAIN_SERVLET+"?ac=upExcel&bean="+bean+"&business="+business+"&method=insert",
//			params:{
//				ac:'upExcel',
//				bean:bean,
//				business:business
//			},
			success:function(form,action){
				Ext.Msg.alert('恭喜',action.result.msg,function(v){
					win.close()
					showViewWin()
				})
			},
			failure:function(form,action){
				Ext.Msg.alert('提示',action.result.msg,function(v){
					win.close()
					showViewWin()
				})
			}
		})
	}*/	
	
	//显示所有导入的未和工程量分摊的工程量的window
	var viewDs = new Ext.data.Store({
		baseParams:{
			ac:'list',
			bean:bean,
			business:business,
			method:listMethod,
			params:"conid is null and bdgid is null and pid = '"+CURRENTAPPID+"' "
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: primaryKey
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true
    });
	viewDs.setDefaultSort('proname','asc')
	
    var smView =  new Ext.grid.CheckboxSelectionModel()
    var cmView = new Ext.grid.ColumnModel([
    	smView,
    	{
           id:'proappid',
           header: fc['proappid'].fieldLabel,
           dataIndex: fc['proappid'].name,
		   hidden:true,
		   hideLabel:true
        }, {
           id:'conid',
           header: fc['conid'].fieldLabel,
           dataIndex: fc['conid'].name,
           hidden:true,
           hideLabel:true
        }, {
           id:'bdgid',
           header: fc['bdgid'].fieldLabel,
           dataIndex: fc['bdgid'].name,
           hidden:true,
           hideLabel:true
        }, {
           id:'prono',
           align: 'prono',
           header: fc['prono'].fieldLabel,
           dataIndex: fc['prono'].name,
           hidden:true,
           hideLabel:true
        }, {
           id:'proname',
           header: fc['proname'].fieldLabel,
           dataIndex: fc['proname'].name,
           width: 120
        }, {
           id:'unit',
           header: fc['unit'].fieldLabel,
           dataIndex: fc['unit'].name,
           width: 50
        }, {
           id:'price',
           align: 'price',
           header: fc['price'].fieldLabel,
           dataIndex: fc['price'].name,
           width: 80,
           align: 'right'
        }, {
           id:'amount',
           header: fc['amount'].fieldLabel,
           dataIndex: fc['amount'].name,
           width: 70,
           align: 'right',
           renderer : function(v,m,r){
				return r.get('isper')== '1' ? (v*100).toFixed(2) + "%" : v;
           }
        }, {
           id:'money',
           header: fc['money'].fieldLabel,
           dataIndex: fc['money'].name,
           align: 'right',
           renderer: function(value){
           		return '￥' +　Math.floor(value);
           },
           width: 70
        }, {
           id:'state',
           header: fc['state'].fieldLabel,
           dataIndex: fc['state'].name,
           width: 40,
           renderer: function(value){
           		if(value == '变更'){
           			value = '<font color=#00ff00>'+value+'</font>'
           		}
           			
           		return value;
           }
        }, {
			id:'isper',
			header: fc['isper'].fieldLabel,
			dataIndex: fc['isper'].name,
        	hidden : true
        }
	])
    cmView.defaultSortable = true;
    
    var chooseBtn = new Ext.Button({
    	text:'确定选择关联',
    	iconCls:'btn',
    	handler:winChooseFunction
    })
    
	var viewgrid = new Ext.grid.EditorGridTbarPanel({
		ds:viewDs,
		cm:cmView,
		sm:smView,
		tbar:['<font color=red>所有未和工程量分摊进行关联的工程量记录</font>','->',chooseBtn],
		iconCls:'icon-by-category',
		region:'center',
		width:625,
		height:425,
		addBtn:false,
		saveBtn:false,
		refreshBtn:false,
		split:true,
        border: false,
        clicksToEdit: 2,
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        autoExpandColumn: 1,		//列宽度自动扩展，可以用列名，也可以用序号（从1开始）
		viewConfig:{
			forceFit: true,
			ignoreAdd: true
		},       
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean: bean,					
      	business: "baseMgm",	
      	primaryKey: primaryKey,				
        loadMask: true,			//加载时是否显示进度
        listeners : {
		    afterdelete : function (grid,ids,primaryKey,bean){
		               conpartybMgm.immediatelySendPartybDel(ids,bean,function (rtn){
		               })
		    }
        },
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: 15,
            store: viewDs,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        })
	})

	
	function showViewWin(){
		viewDs.load();
		if(!viewWin){
				viewWin = new Ext.Window({
					title:'选择工程明细窗口',
					closeAction:'hide',
					modal:true,
					width:650,
					height:450,
					items:[viewgrid]
			})			
		}
		viewWin.show()
	}	
	
	function winChooseFunction(){
		if(winChooseNode == ''||winChooseNode == null){
			Ext.Msg.alert('提示','您尚未选择工程概算树节点！')
			viewWin.hide()
			return
		}
		if(smView.getSelections().length == 0){
			Ext.Msg.alert('提示','您尚未选择工程量！')		
			return;
		}
		var bdgid = winChooseNode.getUI().elNode.all('bdgid').innerText
		var rows = smView.getSelections()
		var counts = 0
		DWREngine.setAsync(false);
		for(var i = 0;i<rows.length;i++){
			bdgProjectMgm.relaBdgNewProject(rows[i].data.proappid,bdgid,conid,function(flag){
			})
		}
		DWREngine.setAsync(true);
		Ext.example.msg('提示','您一共成功关联了'+rows.length+'条数据')
		viewWin.hide();
		totalMoney =caculateTotalMoney(bdgid,conid);
		totalField.setText("<font color=red size=2>"+cnMoneyToPrec(totalMoney)+"</font>");
		ds.load({
			callback:function(){		
			},
			params : {
				start : 0, // 起始序号
				limit : 15
				// 结束序号，若不分页可不用设置这两个参数
			}
		});
		refresh()
		
	}
	
	gridPanel.on('aftersave',function(){
		//得到当前的合计
		//TODO
		
		
		refresh()
	})	
	
	function refresh(){
		if(winChooseNode == ''||winChooseNode == null){
			return
		}else{
			//合同分摊中“本合同分摊”金额进行更新
		/*	bdgProjectMgm.refreshApp(winChooseNode.attributes.appid,function() {
				resetBgdTree()
			})	*/		
		}	
	}	
	
	//刷新树
	function refreshBgdTree(){
		//winChooseNode.fireEvent('click',node)		
		rootNew.reload()
		
		treePanelNew.on("expand",function(){
			treePanelNew.expandPath(path,null,function(){
				var curNode = treePanelNew.getNodeById(selectedModuleNode.id);
				curNode.select()
			})
		})
		
		treePanelNew.expandAll()
		

	}
	
	function resetBgdTree(){
			
		var node = winChooseNode 
		winChooseNode.fireEvent('click',node)
		
		var elNode = node.getUI().elNode;
		var curOldMoneyStr = elNode.all("conappmoney").innerText;
		
		var curOldMoney = curOldMoneyStr.replace("￥","")*1
		var differ = 0
		
		//更新左侧概算分摊树的显示金额，获取工程量表的金额合计
		bdgProjectMgm.getProjectTotalByBgdId(conid, elNode.all("bdgid").innerText,function(newCurMoney) {
			//得到最新的工程量分摊和原值的差值
			differ = newCurMoney *1 - curOldMoney *1
			
			while(node.parentNode){					 			
					var elNode = node.getUI().elNode;
					var treeOldMoneyStr = elNode.all("conappmoney").innerText;	
					var treeOldMoney = treeOldMoneyStr.replace("￥","")*1 		
					var treeNewMondy  = treeOldMoney + differ*1	

					node.attributes.conappmoney =		treeNewMondy
					elNode.all("conappmoney").innerText = "￥"+ treeNewMondy
			
				node = node.parentNode
			}
		})			
		
		
	
		
	}
	

	// 下载需要导入数据的excel模板
	function downloadExcelTemp() {
		var filePrintType = "BdgPrjApportionImp";
		var sql = "select t.fileid from APP_TEMPLATE  t where t.templatecode='" + filePrintType + "'";
		DWREngine.setAsync(false);
		baseMgm.getData(sql, function(str) {
					fileid = str;
				});
		DWREngine.setAsync(true);
		var openUrl = CONTEXT_PATH + "/servlet/BlobCrossDomainServlet?ac=appfile&fileid=" + fileid + "&pid=" + CURRENTAPPID;
		document.all.formAc.action = openUrl;
		document.all.formAc.submit();
	}

	function importDataFile(){
	    var allowedDocTypes = "xls,xlsx";
	    var impUrl = CONTEXT_PATH + "/servlet/BdgServlet?ac=importData&pid="+CURRENTAPPID+"&conid="+conid+"&bdgid="+bdgid+"&bean="+bean
	    var uploadForm = new Ext.form.FormPanel({
	        baseCls:'x-plain',
	        labelWidth:80,
	        url:impUrl,
	        fileUpload:true,
	        defaultType:'textfield',
	        items:[{
	            xtype:'textfield',
	            fieldLabel:'请选择文件',
	            name:'filename1',
	            inputType:'file',
	            anchor:'90%'
	        }]
	    });
	    var uploadWin = new Ext.Window({
	        title:'上传',
	        width:450,
	        height:120,
	        minWidth:300,
	        minHeight:100,
	        layout:'fit',
	        plain:true,
	        bodyStyle:'padding:5px;',
	        buttonAlign:'center',
	        items:uploadForm,
	        buttons:[{
	            text:'上传',
	            handler:function(){
	                var filename=uploadForm.form.findField("filename1").getValue()
	                if(filename!=""){
	                    var fileExt=filename.substring(filename.lastIndexOf(".")+1,filename.length).toLowerCase();
	                    if(allowedDocTypes.indexOf(fileExt)==-1){
	                        Ext.MessageBox.alert("提示","请选择Excel文档！");
	                        return;
	                    }else{
	                        uploadWin.hide();
	                        var msg = '';
	                        if(uploadForm.form.isValid()){
	                            uploadForm.getForm().submit({
	                                method:'POST',
	                                params:{
	                                    ac:'importData'
	                                },
	                                success:function(form,action){
	                                    var obj = action.result.msg;
	                                    msg = (!!obj&&obj.length > 0) ? obj[0].result : "报表数据导入成功！";
	                                    Ext.Msg.show({
	                                        title : '导入成功',
	                                        msg : msg,
	                                        buttons : Ext.Msg.OK,
	                                        icon : Ext.MessageBox.INFO
	                                    });
	                                    ds.load({params:{start:0,limit:15}});
	                                },
	                                failure:function(form,action){
	                                    var obj = action.result.msg;
	                                    msg = (!!obj&&obj.length > 0) ? obj[0].result : "报表数据导入错误！";
	                                    Ext.Msg.show({
	                                        title : '导入失败',
	                                        msg : msg,
	                                        buttons : Ext.Msg.OK,
	                                        icon : Ext.MessageBox.ERROR
	                                    });
	                                }
	                            });
	                        }
	                    }
	                }
	            }
	        }, {
	            text:'关闭',
	            handler:function(){uploadWin.hide();}
	        }]
	    });
	    uploadWin.show();
	}

});
	


function formatDate(value){
		return value ? value.dateFormat('Y-m-d') : '';
};

function caculateTotalMoney(bdgid,conid){
	    var money;
  		DWREngine.setAsync(false);
        db2Json.selectData("select  sum(nvl(bdgproject.MONEY,0))  as money from BDG_PROJECT " +
        		"bdgproject where bdgproject.BDGID = '"+bdgid+"' and" +
        		" bdgproject.CONID = '"+conid+"' order by bdgproject.CONID ASC",
        		function (jsonData) {
	    var list = eval(jsonData);
	    if(list!=null){
	    	 money=list[0].money;
	    	}
	    else{
	    	money=0;
	 	   }
	   });
	    DWREngine.setAsync(true);
	    return money;
}

function caculateTotalMoneyByMulti(bdgids,conid){
	    var money;
  		DWREngine.setAsync(false);
        db2Json.selectData("select  sum(nvl(bdgproject.MONEY,0))  as money from BDG_PROJECT " +
        		"bdgproject where bdgproject.BDGID in ("+bdgids+")  and" +
        		" bdgproject.CONID = '"+conid+"' order by bdgproject.CONID ASC",
        		function (jsonData) {
	    var list = eval(jsonData);
	    if(list!=null){
	    	 money=list[0].money;
	    	}
	    else{
	    	money=0;
	 	   }
	   });
	    DWREngine.setAsync(true);
	    return money;
}
	



