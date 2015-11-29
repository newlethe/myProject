var bean = 'com.sgepit.pmis.finalAccounts.complete.hbm.FacompOtherCostCont';
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn = "uids"
var subBean = 'com.sgepit.pmis.finalAccounts.complete.hbm.FacompCostFixedAssetCont';
var subPrimaryKey = "uids"
var subOrderColumn = "uids"

var fixedBean="com.sgepit.pmis.finalAccounts.complete.hbm.FacompCostFixedAssetCont";
// 合同类型‘QT’、‘SG’
var conOveArr = new Array();
var contFormulaArr = new Array();

var conGrid,sm,ds,cm;
var conListWin;

var fixedStore,fixedTreeGrid,formPanel;
var selectMasterid,selectContFormula;
var selectedPath="";
var selectRecord;
var prefixStr=costType=='0001'?'FIRST':'SECOND';
Ext.onReady(function() {
	DWREngine.setAsync(false);
	appMgm.getCodeValue('分摊公式', function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					if(list[i].propertyCode.indexOf(prefixStr)!=-1){
						temp.push(list[i].propertyCode);
						temp.push(list[i].propertyName);
						contFormulaArr.push(temp);
					}
					if(list[i].propertyCode=='0001'){
						temp.push(list[i].propertyCode);
						temp.push(list[i].propertyName);
						contFormulaArr.push(temp);
					}
				}
			});
	baseMgm.findAll('com.sgepit.pmis.contract.hbm.ConOveView',function(list){ 
			for(i = 0; i < list.length; i++) {
                if(list[i].condivno != 'QT'&&list[i].condivno != 'SG'&&list[i].condivno != 'FW')
                    continue;
				var temp = new Array();	
				temp.push(list[i].conid);		
				temp.push(list[i].conname);	
				temp.push(list[i].conno);
				temp.push(list[i].convaluemoney);	
				conOveArr.push(temp);			
			}
	    }); 
	DWREngine.setAsync(true);
	//分摊公式store
	var contFormulaDs=new Ext.data.SimpleStore({
	    fields: ['k', 'v'],   
	    data: contFormulaArr
	});
	var fm = Ext.form; // 包名简写（缩写）
	/*********************************参与分摊合同信息   start*************************************/
	var addBtn = new Ext.Button({
		id : 'add',
		text : '新增',
		iconCls : 'add',
		handler : onItemClick
	});
	var editBtn = new Ext.Button({
		id : 'edit',
		text : '修改',
		iconCls : 'btn',
		handler : onItemClick
	});
	var saveBtn = new Ext.Button({
		id : 'save',
		text : '保存',
		iconCls : 'save',
		handler : onItemClick
	});
	var delBtn = new Ext.Button({
		id : 'del',
		text : '删除',
		iconCls : 'remove',
		handler : onItemClick
	});
	var contTotalBtn = new Ext.Button({
		id : 'contTotal',
		text : costType=='0001'?'一类费用分摊汇总':'二类费用分摊汇总',
		iconCls : 'btn',
		handler : onItemClick
	});
	var contFormulaCombo = new Ext.form.ComboBox({
	    store: contFormulaDs,
	    displayField:'v',
	    valueField : 'k',
	    typeAhead: true,
	    mode: 'local',
	    triggerAction: 'all',
	    width:80,
	    allowBlank :false,
	    editable :false,
	    selectOnFocus:true,
		anchor : '95%'
	});
	contFormulaCombo.on('select', function(obj, record, index){
		selectContFormula = record.data.k;
	});
	sm = new Ext.grid.CheckboxSelectionModel(); // 创建选择模式
	var fc = { // 创建编辑域配置
		'uids' : {
			name : 'uids',
			fieldLabel : '主键',
			hidden : true,
			hideLabel : true
		},
		'pid' : {
			name : 'pid',
			fieldLabel : '工程项目编号',
			hidden : true,
			hideLabel : true
		},
		'conid' : {
			name : 'conid',
			fieldLabel : '合同主键',
			hidden : true,
			hideLabel : true
		},
		'costContMoney' : {
			name : 'costContMoney',
			fieldLabel : costType=='0001'?'参与一类费用分摊总金额':'参与二类费用分摊总金额',
			anchor : '95%'
		},
		'contFormula' : {
			name : 'contFormula',
			fieldLabel : '分摊公式<font color=red>*</font>',
			displayField : 'v',
			valueField : 'k',
			mode : 'local',
			typeAhead : true,
			triggerAction : 'all',
			editable : false,
			store : contFormulaDs,
			allowBlank : false,
			anchor : '95%'
		},
		'alContMoney' : {
			name : 'alContMoney',
			fieldLabel : '已分摊金额',
			anchor : '95%'
		},
		'unContMoney' : {
			name : 'unContMoney',
			fieldLabel : '未分摊金额',
			anchor : '95%'
		},
		'otherCostType' : {
			name : 'otherCostType',
			fieldLabel : '其他费用类型',
			anchor : '95%'
		},
		'remark' : {
			name : 'remark',
			fieldLabel : '备注',
			anchor : '95%'
		}
	}

	// 3. 定义记录集
	var Columns = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'conid',
				type : 'string'
			}, {
				name : 'costContMoney',
				type : 'float'
			}, {
				name : 'contFormula',
				type : 'string'
			}, {
				name : 'alContMoney',
				type : 'float'
			}, {
				name : 'unContMoney',
				type : 'float'
			}, {
				name : 'otherCostType',
				type : 'string'
			}, {
				name : 'remark',
				type : 'string'
			}];

	var Plant = Ext.data.Record.create(Columns); // 定义记录集
	var PlantInt = {
		uids:'',
		pid : CURRENTAPPID,
		conid : '',
		costContMoney : '',
		contFormula : '',
		alContMoney : '',
		unContMoney : '',
		otherCostType : '',
		remark : ''
	} // 设置初始值

	cm = new Ext.grid.ColumnModel([ // 创建列模型
	new Ext.grid.RowNumberer({
						header : '序号',
						width : 33
					}), {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : 'uids',
				header : fc['uids'].fieldLabel,
				dataIndex : fc['uids'].name,
				hidden : true
			}, {
				id : 'conid',
				header : fc['conid'].fieldLabel,
				dataIndex : fc['conid'].name,
				hidden : true
			},	{
				id : 'conno',
				header : '合同编号',
				dataIndex : 'conno',
				width : 160,
				renderer : function(value, cell, record) {
					var str = '';
					for (var i = 0; i < conOveArr.length; i++) {
						if (conOveArr[i][0] == record.data.conid) {
							str = conOveArr[i][2]
							break;
						}
					}
					var qtip = "qtip=" + str;
					return '<span ' + qtip + '>' + str + '</span>';
				}
			}, {
				id : 'conname',
				header : '合同名称',
				dataIndex : 'conname',
				width : 280,
				renderer : function(value, cell, record) {
					var str = '';
					for (var i = 0; i < conOveArr.length; i++) {
						if (conOveArr[i][0] == record.data.conid) {
							str = conOveArr[i][1]
							break;
						}
					}
					var qtip = "qtip=" + str;
					return '<span ' + qtip + '>' + str + '</span>';
				}
            }, {
				id : 'convaluemoney',
				header : '合同总金额',
				dataIndex : 'convaluemoney',
				width : 100,
                align : 'right',
				renderer : function(value, cell, record) {
					var str = '';
					for (var i = 0; i < conOveArr.length; i++) {
						if (conOveArr[i][0] == record.data.conid) {
							str = conOveArr[i][3]
							break;
						}
					}
					return cnMoneyToPrec(str, 2);
				}
			}, {
				id : 'costContMoney',
				align : 'right',
				header : fc['costContMoney'].fieldLabel,
				dataIndex : fc['costContMoney'].name,
				width : 180
			}, {
				id : 'contFormula',
				header : fc['contFormula'].fieldLabel,
				dataIndex : fc['contFormula'].name,
				editor : contFormulaCombo,
				renderer : contFormulaRender,
				width : 200
			}, {
				id : 'alContMoney',
				header : fc['alContMoney'].fieldLabel,
				dataIndex : fc['alContMoney'].name,
				align : 'right',
				width : 100
			}, {
				id : 'unContMoney',
				header : fc['unContMoney'].fieldLabel,
				dataIndex : fc['unContMoney'].name,
				align : 'right',
				width : 100
			}, {
				id : 'otherCostType',
				header : fc['otherCostType'].fieldLabel,
				dataIndex : fc['otherCostType'].name,
				hidden : true
			}, {
				id : 'remark',
				header : fc['remark'].fieldLabel,
				dataIndex : fc['remark'].name,
				editor : new fm.TextField(fc['remark']),
				renderer : function(v, m, r) {
					m.attr = "style=background-color:#FBF8BF";
					return v;
				},
				width : 80
			}]);

	cm.defaultSortable = true; // 设置是否可排序
	
	// 4. 创建数据源
	ds = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			params : "contState='1' and otherCostType='"+costType+"' and pid='" + CURRENTAPPID + "'"
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
			// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		});
	ds.setDefaultSort(orderColumn, 'asc'); // 设置默认排序列
	ds.on('load', function(t, rs) {
		if(selectRecord){
			sm.selectRecords([selectRecord],true);
			selectRecord=null;
		}else{
			if (t.getTotalCount() > 0) {
				sm.selectFirstRow();
			}else{
				fixedStore.removeAll();
				formPanel.getForm().reset();
			}
		}
	})
	// 5. 创建可编辑的grid: grid-panel
	conGrid = new Ext.grid.EditorGridTbarPanel({
				ds : ds, // 数据源
				cm : cm, // 列模型
				sm : sm, // 行选择模式
				tbar : ['<font color=#15428b><B>参与分摊合同信息<B></font>', '-',addBtn,'-',editBtn,'-',saveBtn,'-',delBtn,'-',contTotalBtn], // 顶部工具栏，可选
				border : false, // 
				region : 'center',
				clicksToEdit : 2, // 单元格单击进入编辑状态,1单击，2双击
				header : false, //
				addBtn : false, // 是否显示新增按钮
				saveBtn : false, // 是否显示保存按钮
				delBtn : false, // 是否显示删除按钮
				frame : false, // 是否显示圆角边框
				autoScroll : true, // 自动出现滚动条
				collapsible : false, // 是否可折叠
				animCollapse : false, // 折叠时显示动画
				loadMask : true, // 加载时是否显示进度
				stripeRows : true,
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : ds,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				// expend properties
				plant : Plant,
				plantInt : PlantInt,
				servletUrl : MAIN_SERVLET,
				bean : bean,
				business : business,
				primaryKey : primaryKey
			});
	conGrid.on('aftersave',function(){
		ds.reload();
		selectCrrentTreeNode();
	})
	sm.on('rowselect', function() {
		var record = sm.getSelected();
		fixedStore.removeAll();
		selectMasterid=record.get("uids");
		selectContFormula=record.get("contFormula");
		DWREngine.setAsync(false);
        if(costType=='0001'){
		    faCostManageService.initFixedAssetTreeForFirstCon(selectMasterid,function(){
		    });
        }else if(costType=='0002'){
        	 faCostManageService.initFixedAssetTreeForSecondCon(selectMasterid,function(){
		    });
        }
        DWREngine.setAsync(true);
		fixedStore.load();
	});
	ds.load({
				params : {
					start : 0,
					limit : PAGE_SIZE
				}
			});
	/*********************************参与分摊合同信息   end*************************************/
	/*********************************固定资产信息   start*************************************/
	var contBtn = new Ext.Button({
		id : 'cont',
		text : '分摊',
		iconCls : 'btn',
		handler : onItemClick
	});
	var editContBtn = new Ext.Button({
		id : 'editCont',
		text : '修改',
		iconCls : 'btn',
		handler : onItemClick
	});
	var saveContBtn = new Ext.Button({
		id : 'saveCont',
		text : '保存',
		iconCls : 'save',
		handler : onItemClick
	});
	var btnexpendAll = new Ext.Button({
                            iconCls : 'icon-expand-all',
                            tooltip : '全部展开',
                            handler : function() {
                               fixedStore.expandAllNode();
                            }
                        }) ;
     var btnexpendClose = new Ext.Button({
                           iconCls : 'icon-collapse-all',
                            tooltip : '全部收起',
                            handler : function() {
                                fixedStore.collapseAllNode();
                            }
                        }) ;
	fixedStore = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
				autoLoad : true,
				leaf_field_name : 'isleaf',// 是否叶子节点字段
				parent_id_field_name : 'parentid',// 树节点关联父节点字段
				url : MAIN_SERVLET,
				baseParams : {
					ac : 'list',
					method : 'getFACompFixedAssetList',// 后台java代码的业务逻辑方法定义
					business : 'faCostManageService',// spring 管理的bean定义
					bean : fixedBean,// gridtree展示的bean
					params : 'masterid' + SPLITB +  selectMasterid+SPLITB// 查询条件
				},
				reader : new Ext.data.JsonReader({
							id : 'treeid',
							root : 'topics',
							totalProperty : 'totalCount',
							fields : ["uids", "treeid", "masterid", "fixedno","fixedname","costValue1",
									"costValue2","costValue3","remark", "parentid","isleaf"]
						}),
				listeners : {
					'beforeload' : function(ds2, options) {
						var parent = null;
						if (options.params[ds2.paramNames.active_node] == null) {
							options.params[ds2.paramNames.active_node] = '0';	
							parent = "0"; // 此处设置第一次加载时的parent参数
						} else {
							parent = options.params[ds2.paramNames.active_node];
						}
						ds2.baseParams.params = 'masterid' + SPLITB + selectMasterid
								+ ";parent" + SPLITB + parent;// 此处设置除第一次加载外的加载参数设置
					}
				}
			});
	var fixedColumns=[{
			id:"fixedno",
            header: '固定资产编号',
            width: 150,
            dataIndex: 'fixedno'
        },{
        	id:"uids",
            header: '固定资产主键',	
            width:0,				//隐藏字段
            hidden:true,
            dataIndex: 'uids'
        },{
        	id:"masterid",
            header: '主表主键',
            width: 0,				//隐藏字段
            hidden:true,
            dataIndex: 'masterid'
        },{
        	id:"treeid",
            header: '固定资产树主键',
            width: 0,				//隐藏字段
            hidden:true,
            dataIndex: 'treeid'
        },{
        	id:"fixedname",
            header: '项目名称',
            width: 200,
            dataIndex: 'fixedname'
        },{
        	id:"costValue2",
            header: costType=='0001'?'一类费用分摊':'二类费用分摊',
            width: 120,
            align:"right",
            dataIndex: 'costValue2',
            renderer: cnMoneyToPrec
        },{
        	id:"costValue3",
            header: '含一类费用造价',
            width: 120,
            align:"right",
            dataIndex: 'costValue3',
            renderer: cnMoneyToPrec
        },{
        	id:"remark",
            header: '备注',
            width: 150,
            dataIndex: 'remark'
        },{
        	id:"isleaf",
            header: '是否子节点',
            width: 0,
            hidden:true,
            dataIndex: 'isleaf'
            
        },{
        	id:"parentid",
            header: '父节点',
            width: 0,
            hidden:true,
            dataIndex: 'parentid',
            cls : 'parentid'
            
        }]
    var extraMode={
        	id:"costValue1",
            header: '不含一类费用造价',
            width: 120,
            align:"right",
            dataIndex: 'costValue1',
            renderer: cnMoneyToPrec
        }
    if(costType=='0001'){
    	fixedColumns.splice(5,0,extraMode)
    }
    var fixedSm = new Ext.grid.CheckboxSelectionModel({singleSelect:true});
	fixedTreeGrid = new Ext.ux.maximgb.treegrid.GridPanel({
				id : 'fixed-tree-panel',
				iconCls : 'icon-by-category',
				store : fixedStore,
				sm:fixedSm,
				master_column_id : 'fixedname',// 定义设置哪一个数据项为展开定义
				autoScroll : true,
				region : 'center',
//				height : document.body.clientHeight * 0.5,
				viewConfig : {
//					forceFit : true,
					ignoreAdd : true
				},
				frame : false,
				collapsible : false,
				animCollapse : false,
				border : true,
				stripeRows : true,
				title : '', // 设置标题	      
        tbar:['<font color=#15428b><b>&nbsp;生产用固定资产</b></font>'
        		,'-',btnexpendAll,'-',btnexpendClose,'-',contBtn],
		columns:fixedColumns
	});
	fixedStore.on("load", function(ds1, recs) {
        if(selectedPath && selectedPath!="") {
            fixedStore.expandPath(selectedPath, "treeid");
        } else {
            if (ds1.getCount() > 0) {
                var rec1 = ds1.getAt(0);
                fixedSm.selectFirstRow();
                if (!ds1.isExpandedNode(rec1)) {
                    ds1.expandNode(rec1);
                }
            }else{
            	formPanel.getForm().reset();
            }
        }
    });
        
    
   fixedStore.on('expandnode', function(ds, rc) {
        if (selectedPath && selectedPath != "") {
            var equidArr = selectedPath.split("/");
            if (rc.get("treeid") == equidArr.pop()) {
                fixedTreeGrid.getSelectionModel().selectRow(ds.indexOf(rc));
                selectedPath="";
            }
        }
    });
	/*********************************固定资产信息   end*************************************/
	/*********************************固定资产信息表单   start*************************************/
    var fcSub = {
        'fixedno':{
        	id:"fixedno",
            name: 'fixedno',
            fieldLabel: '项目编码',
            readOnly:true,
            anchor:'95%'
        },'fixedname':{
        	id:"fixedname",
            name: 'fixedname',
            fieldLabel: '项目名称',
            readOnly:true,
            anchor:'95%'
        },'costValue1':{
        	id:"costValue1",
            name: 'costValue1',
            fieldLabel: '不含一类费用造价',
            readOnly:true,
            anchor:'95%'
        },'costValue3':{
        	id:"costValue3",
            name: 'costValue3',
            fieldLabel: '含一类费用造价',
            readOnly:true,
            anchor:'95%'
        },'costValue2':{
        	id:"costValue2",
            name: 'costValue2',
            fieldLabel: costType=='0001'?'一类费用分摊':'二类费用分摊',
            allowBlank:false,
            anchor:'95%'
        }, 'remark': {
        	id:"remark",
            name: 'remark',
            fieldLabel: '备注',
            anchor:'95%'
        }
        ,'masterid':{id:"masterid",name:'masterid',fieldLabel:'主表主键'}
        ,'treeid':{id:"treeid",name:'treeid',fieldLabel:'固定资产树主键'}
        ,'parentid':{id:"parentid",name:'parentid',fieldLabel:'父节点'}
        ,'isleaf':{id:"isleaf",name:'isleaf',fieldLabel:'叶子节点'}
        ,'uids':{id:"uids",name:'uids',fieldLabel:'主键'}
        
    }
	//创建表单form-panel
    var saveFormBtn = new Ext.Button({
        name: 'save',
       text: '保存',
       iconCls: 'save',
       disabled:true,
       handler: formSave
    })
    formPanel = new Ext.FormPanel({
        id: 'form-panel',
        header: false,
        border: false,
        width : 250,
        height: document.body.clientHeight * 0.5,
        split: true,
        collapsible : true,
//        collapsed: false,
        collapseMode : 'mini',
//        minSize: 250,
//        maxSize: 400,
        border: false,
//        autoScroll:true,
        region: 'east',
        bodyStyle: 'padding:10px 10px; border:0px dashed #3764A0',
        iconCls: 'icon-detail-form',    //面板样式
        labelAlign: 'left',
        items: [
            new Ext.form.FieldSet({
                title: '生产用固定资产信息',
                layout: 'form',
                width : 250,
                border: true,
                labelWidth : 100,
                items: [
	                new fm.Hidden(fcSub['uids']),
	                new fm.Hidden(fcSub['isleaf']),
	                new fm.Hidden(fcSub['parentid']),
	                new fm.Hidden(fcSub['masterid']),
	                new fm.Hidden(fcSub['treeid']),
                    new fm.TextField(fcSub['fixedno']),
                    new fm.TextField(fcSub['fixedname']),
                    costType=='0001'?new fm.NumberField(fcSub['costValue1']):new fm.Hidden(fcSub['costValue1']),
                    new fm.NumberField(fcSub['costValue2']),
                    new fm.NumberField(fcSub['costValue3']),
                    new fm.TextArea(fcSub['remark']),
                    saveFormBtn
                ]
            })
        ]
    });
    fixedSm.on('rowselect', rowClickFunction);
    function rowClickFunction(thisGrid, rowIndex, record) {
//        fixedSm.selectRow(rowIndex);
//        var record = fixedTreeGrid.getStore().getAt(rowIndex);
        var isleaf = record.get("isleaf");
        if (isleaf=="0"){
        	formPanel.getForm().reset();
        	saveFormBtn.setDisabled(true);
        	formPanel.getForm().loadRecord(record);
            return;
        }
        if(selectContFormula!="0001"){
        	formPanel.getForm().reset();
        	saveFormBtn.setDisabled(true);
        	formPanel.getForm().loadRecord(record);
            return;
        }
        formPanel.getForm().loadRecord(record);
        saveFormBtn.setDisabled(false);
    }
    // 表单保存方法
    function formSave(){
        var form = formPanel.getForm();
        if (form.isValid()){
        	saveFormBtn.setDisabled(true);   
            doFormSave(true)  //修改
        }else{
        	var title=costType=='0001'?'一类费用分摊不能为空！':'二类费用分摊不能为空！'
        	Ext.Msg.alert("提示",title);
        }
    }
    
    function doFormSave(isNew){
        var form = formPanel.getForm();
        var obj = new Object();
        for (var i=0; i<fixedColumns.length; i++){
            var name = fixedColumns[i].id;
            var field = form.findField(name);
            if (field){
            	obj[name] = field.getValue();
            }
        }
        selectRecord=sm.getSelected();
        DWREngine.setAsync(false);
        if(costType=='0001'){
		    faCostManageService.updateCostFixedAssetCont(obj,function(str){
		        if(str == "1"){
		            Ext.example.msg('保存成功！', '您成功保存了 1条记录。');
		        }
		    });
        }else if(costType=='0002'){
        	 faCostManageService.updateCost2FixedAssetCont(obj,function(str){
		        if(str == "1"){
		            Ext.example.msg('保存成功！', '您成功保存了 1条记录。');
		        }
		    });
        }
        faCostManageService.updateOtherCostContMoney(selectMasterid,function(){
        	ds.reload();
        	selectCrrentTreeNode();
        });
        DWREngine.setAsync(true);
    }
    
    //定位到上次选择的树节点           
    function selectCrrentTreeNode(){
        var rec = fixedTreeGrid.getSelectionModel().getSelected();
        if(rec){
	        selectedPath = fixedStore.getPath(rec, "treeid");
//	        fixedStore.load();
        }
     }
	/*********************************固定资产信息表单   end*************************************/
     var contentPanle = new Ext.Panel({
		layout : 'border',
		region : 'south',
		border : false,
		height: document.body.clientHeight * 0.5,
		items : [fixedTreeGrid,formPanel]
	});
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [conGrid,contentPanle]
			});
});
// 属性值
function contFormulaRender(value, m, r) {
	var str = "";
	m.attr = "style=background-color:#FBF8BF";
	for (var i = 0; i < contFormulaArr.length; i++) {
		if (contFormulaArr[i][0] == value) {
			str = contFormulaArr[i][1]
			break;
		}
	}
	return str;
}
function onItemClick(item){
	switch(item.id) {
		case 'add':
			addFun();
			break
		case 'edit':
			editFun();
			break
		case 'save':
			saveFun();
			break
		case 'cont':
			contFun();
			break
		case 'del':
			delFun();
			break
		case 'contTotal':
			contTotalFun();
			break
	}
}
function contFun(){
	Ext.MessageBox.confirm('确认', '分摊后会初始化当前数据，确认要分摊吗？', function(btn,
					text) {
		if (btn == "yes") {
			var processbar = Ext.MessageBox.show({
					title: '请稍候...',
					msg: '数据分摊中 ...',
					width:240,
					progress:true,
					closable:false
			});
			var t = 0;
			var f = function(){
				t = (t == 100) ? 0 : t+1;
				Ext.MessageBox.updateProgress(t/100, '');
			};
		    var timer = setInterval(f, 30);
			 faCostManageService.doContByContFormula(selectMasterid,selectContFormula,function(str){
		        if(str == "1"){
		            Ext.example.msg('提示', '分摊操作成功！');
		        }
		        window.clearInterval(timer);
				processbar.updateProgress(0, '');
				processbar.hide();
	            ds.load();
		        	
		    });
		}
	}, this);
}
function addFun(){
	var url = BASE_PATH
			+ "Business/finalAccounts/complete/fa.other.cost.manage.addorupdate.jsp?costType="+ costType;
	createConListWin(url);
}
function contTotalFun(){
	var url = BASE_PATH
			+ "Business/finalAccounts/complete/fa.other.cost.total.jsp?costType="+ costType;
	createConListWin(url);
}
function createConListWin(targetUrl){
	conListWin = new Ext.Window({
		width: 1000,
		height: 500,
		modal: true, 
		plain: true, 
		border: false, 
		resizable: false,
		closable:true,
		html:"<iframe id='detailFrame' src='' width='100%' height='100%' frameborder='0'></iframe>",
		listeners : {
			'close' : function(){
				ds.reload();
			},
			'show' : function(){
				detailFrame.location.href  = targetUrl;
			}
		}
    });
	conListWin.show();
}
function editFun(){
	var record = sm.getSelected();
	if(record == null){
		Ext.example.msg('提示信息','请先选择一条合同信息！');
    	return ;
	}
	var url = BASE_PATH+"Business/finalAccounts/complete/fa.other.cost.manage.addorupdate.jsp?costType="+ costType+"&masterid="+record.get("uids");
	createConListWin(url);
}
function saveFun(){
	conGrid.defaultSaveHandler();
}
function delFun(){
	if (sm.hasSelection()) {
		Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,
				text) {
			if (btn == "yes") {
				var record = sm.getSelected();
				var alContMoney=record.get('alContMoney');
				if(alContMoney&&alContMoney>0){
					Ext.Msg.alert("提示","本记录已有合同分摊信息，不允许删除！");
					return;
				}
				DWREngine.setAsync(false);
				faCostManageService.deleteContConById(record.get('uids'), function(flag) {
							if (flag == 1) {
								Ext.example.msg('提示', '删除成功，成功删除了1条记录！');
								selectRecord=null;
							}else{
								Ext.example.msg('提示', '删除失败！');
							}
							ds.reload();
//							fixedStore.reload();
						})
				DWREngine.setAsync(true);
			}
		})
	}else{
		Ext.example.msg('提示信息','请先选择一条合同信息！');
	}
}