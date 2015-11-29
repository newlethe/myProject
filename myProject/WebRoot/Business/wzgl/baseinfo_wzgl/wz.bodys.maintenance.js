var bean = "com.sgepit.pmis.wzgl.hbm.WzGoodsBodys";
var beanCon = "com.sgepit.pmis.contract.hbm.ConOve";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = 'uids';

//从采购合同选择物资
var beanB = "com.sgepit.pmis.wzgl.hbm.ConMat";
var businessB = "baseMgm";
var listMethodB = "findWhereOrderby";
var primaryKeyB = "uids";
var orderColumnB = "bm";

var grid;
var ds;
var btnId;
var dsQc;
var addOrUpdate;
var	formPanel = null;

var equBodysWin;
var equBodysWzWin;

var bdgArr = new Array();
var selectTreeid = '';
var	selectUuid = '';
var selectConid = '';
var selectParentid = '';
var pidWhereString = "pid = '"+CURRENTAPPID+"'";

Ext.onReady(function(){
	
	var fm = Ext.form;
	var sm = new Ext.grid.CheckboxSelectionModel({header:'',singleSelect : false});
	   //概算
	DWREngine.setAsync(false);
	baseMgm.getData("select bdgid,bdgname from bdg_info where pid='" + CURRENTAPPID
                    + "' order by bdgid ", function(list) {
        for (var i = 0; i < list.length; i++) {
            var temp = new Array();
            temp.push(list[i][0]);
            temp.push(list[i][1]+" - "+list[i][0]);
            bdgArr.push(temp);
        }
    })
	DWREngine.setAsync(true);
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
            treeName : "equBdgTree",
            businessName : "equBaseInfo",
            bdgid : CURRENTAPPID+'-0101,'+CURRENTAPPID+'-0102,'+CURRENTAPPID+'-0103,'+CURRENTAPPID+'-0104',
            parent : 0
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
                    if(thisBdgid == null || thisBdgid == "0"){
                        Ext.example.msg('提示信息','请选择概算项！');
                        return false;
                    }
                    if(formPanel!=null){
	                    var form = formPanel.getForm();
	                    form.findField('estimateNo').setValue(thisBdgid);
	                    form.findField('estimateNo').setRawValue(thisBdgname+"-"+thisBdgid);
                    }
                    bdgTreeWin.hide();
                }
            }
        ]
    });
    treePanelNew.on('beforeload', function(node) {
        bdgid = node.attributes.bdgid;
        if (bdgid == null)
            bdgid = CURRENTAPPID +'-01';
        var baseParams = treePanelNew.loader.baseParams
        baseParams.parent = bdgid;
    }) 
    
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
        height: 480,
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
    
	function showBdgTreeWin(){
        bdgTreeWin.show();
    }
	
	// 创建可编辑配置区域
	var fc = { // 创建编辑域配置
		'uids' : {name : 'uids',fieldLabel : '主键'},
		'pid' : {name : 'pid',fieldLabel : 'PID'},
		'equNo' : {name : 'equNo',fieldLabel : '主体材料编码',anchor : '90%', readOnly : true},
		'equName' : {name : 'equName',fieldLabel : '主体材料名称',anchor : '90%',allowBlank: false},
		'equParts' : {name : 'equParts',fieldLabel : '对应部件'},
		'sbQc': {name : 'sbQc',fieldLabel : '对应设备清册信息'},
		'createDate' : {name : 'createDate', fieldLabel : '创建日期',anchor : '90%',readOnly : true,format:'Y-m-d'},
		'conid' : {name : 'conid',fieldLabel : '合同主键'},
		'ggxh' : {name : 'ggxh',fieldLabel : '规格型号',anchor : '90%',width: 200},
		'estimateNo' : {
	        name : 'estimateNo',
	        fieldLabel : '对应概算',
		    triggerClass: 'x-form-date-trigger',
            onTriggerClick: showBdgTreeWin,
//            allowBlank : false, 
            valueField: 'k',
            displayField: 'v',
            mode: 'local',
            typeAhead: true,
            triggerAction: 'all', 
            store: bdginfoDs,
            readOnly : true,
            anchor : '90%',
            width: 200
		 },
		'treeUids' : {name : 'treeUids',fieldLabel : '合同分类树主键'},
		'remark' : {name : 'remark', fieldLabel : '备注',width: 200,anchor : '90%'},//xtype: 'htmleditor',
		'judgmentFlag' :{name : 'judgmentFlag',fieldLabel : '判断是否是主体设备'},
		'totalMoney' : {name : 'totalMoney',fieldLabel : '总金额',anchor : '90%',width: 200},
		'delOrUpdate' :{name : 'delOrUpdate',fieldLabel : '权限：主体材料入库选择后不允许修改删除'}
	}
	
	var columns = [
		{name : 'uids', type : 'string'},
		{name : 'pid', type : 'string'},
		{name : 'equNo', type : 'string'},
		{name : 'equName', type : 'string'},
		{name : 'equParts', type : 'string'},
		{name : 'sbQc', type : 'string'},
		{name : 'createDate',type : 'date',dateFormat: 'Y-m-d H:i:s'},
		{name : 'conid', type : 'string'},
		{name : 'treeUids', type : 'string'},
		{name : 'ggxh',type : 'string'},
		{name : 'estimateNo',type : 'string'},
		{name : 'remark' , type : 'string' },
	    {name : 'judgmentFlag',type : 'string'},
	    {name : 'totalMoney',type : 'float'},
	    {name : 'delOrUpdate' ,type : 'string'}
	];
	
	var plant = Ext.data.Record.create(columns);
	var plantInt = {
		uids : '',
		pid : CURRENTAPPID,
		equNo : '',
		equName : '',
		equParts : '',
		sbQc:'',
		createDate : '',
		conid : selectConid,
		treeUids : selectUuid,
		remark : '',
		totalMoney : '',
		delOrUpdate : '1'
	}
	
	
   ds = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bean,
			business : business,
			method : listMethod,
			params : ''
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : "uids"
		}, columns),
		remoteSort : true,
		pruneModifiedRecords : true, // 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		sortInfo: {field: "uids", direction: "DESC"}
	});
	
    var cm = new Ext.grid.ColumnModel([
		sm,{
			id : 'uids',
			header : fc['uids'].fieldLabel,
			dataIndex : fc['uids'].name,
			hidden : true
		}, {
            id : 'PID',
			header : fc['pid'].fieldLabel,
			dataIndex : fc['pid'].name,
			hidden : true
		}, {
			id : 'equNo',
			header : fc['equNo'].fieldLabel,
			dataIndex : fc['equNo'].name,
			width : 200
	      }, {
			id : 'equName',
			header : fc['equName'].fieldLabel,
			dataIndex : fc['equName'].name,
			width : 100
//			,
//			editor : new fm.TextField(fc['equName'])
		}, {
			id : 'equParts',
			header : fc['equParts'].fieldLabel,
			dataIndex : fc['equParts'].name,
			renderer : renderConid,
			width : 200,
			align : 'center'
		}, {
			id : 'sbQc',
			header : fc['sbQc'].fieldLabel,
			dataIndex : fc['sbQc'].name,
			renderer : renderQc,
			hidden : true,
			width : 200,
			align : 'center'
		},{
			id : 'createDate',
			header : fc['createDate'].fieldLabel,
			dataIndex : fc['createDate'].name,
			width : 100,
			renderer : formatDate 
		}, {
			id : 'estimateNo',
			header : fc['estimateNo'].fieldLabel,
			dataIndex : fc['estimateNo'].name,
//			editor : new fm.ComboBox(fc['estimateNo']),
			renderer:function(value){
				for(var i=0;i<bdgArr.length;i++){
					if(bdgArr[i][0]==value){
						return bdgArr[i][1];
					}
				}
			},
			width : 150
		}, {
			id : 'totalMoney',
			header : fc['totalMoney'].fieldLabel,
			dataIndex : fc['totalMoney'].name,
            align : 'right',
            renderer : function(value){
                return cnMoneyToPrec(value,4);
            },
			width : 140		
		}, {
			id : 'ggxh',
			header : fc['ggxh'].fieldLabel,
			dataIndex : fc['ggxh'].name,
			width : 100
		}, {
			id : 'conid',
			header : fc['conid'].fieldLabel,
			dataIndex : fc['conid'].name,
			hidden : true
		}, {
			id : 'treeUids',
			header : fc['treeUids'].fieldLabel,
			dataIndex : fc['treeUids'].name,
			hidden : true
		}, {
			id : 'remark',
			header : fc['remark'].fieldLabel,
			dataIndex : fc['remark'].name,
			width : 300
		}, {
			id : 'delOrUpdate',
			header : fc['delOrUpdate'].fieldLabel,
			dataIndex : fc['delOrUpdate'].name,
			hidden : true
		}
		]);
	var addWz = new Ext.Button({
  		id : 'addWz',
		text : '从【采购合同】选择',
		iconCls : 'btn',
		handler : addWzFn
	})	
	var addBtn = new Ext.Button({
  		id : 'addBtn',
		text : '新增',
		iconCls : 'add',
		handler : addOrUpdateFun
	})
	var updateBtn = new Ext.Button({
  		id : 'update',
		text : '修改',
		iconCls : 'btn',
		handler : addOrUpdateFun
	})	
	var saveBtn = new Ext.Button({
  		id : 'saveBtn',
		text : '保存',
		iconCls : 'save',
		handler : saveBtnFn
	})	
	var delBtn = new Ext.Button({
  		id : 'delete',
		text : '删除',
		iconCls:'remove',
		handler : delBtnFn
	})

	var winBtn = new Ext.Button({
  		id : 'btn',
		text : '主体材料出入库',
		iconCls : 'add',
		handler : winBtnFn
	})
	grid = new Ext.grid.EditorGridTbarPanel({
		region : 'center',
		ds : ds,
		cm : cm, // 列模型
		sm : sm,
		tbar :  ['<font color=#15428b><B>合同主体材料维护<B></font>','-',addWz,'-',addBtn,'-',updateBtn,'-',delBtn,'-','->',winBtn],//saveBtn,'-',
		border : false,
		addBtn : false, // 是否显示新增按钮
		saveBtn : false, // 是否显示保存按钮
		delBtn : false, // 是否显示删除按钮
		clicksToEdit : 2,
		enableHdMenu : false,
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		saveHandler : false,
		deleteHandler : false,
		viewConfig : {
			forceFit : false,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		plant : plant,
		plantInt : plantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		primaryKey : primaryKey
	});
	var viewport = new Ext.Viewport({
	    layout:'border',
        items:[treePanel,grid]
	})
	
	if(USERDEPTID == "102010103"){
		   addWz.setDisabled(true);	
		   addBtn.setDisabled(true);
		   updateBtn.setDisabled(true);
		   delBtn.setDisabled(true);
    }
	ds.load({params:{start:0,limit:PAGE_SIZE}});
	cm.defaultSortable = true;
	
	if(ModuleLVL>=3){
				   addWz.setDisabled(true);	
				   addBtn.setDisabled(true);
				   updateBtn.setDisabled(true);
				   delBtn.setDisabled(true);
				}
				
	sm.on('rowselect',function(){
	       var record = sm.getSelected();
	       if(record  == null || record == '') return;
	       	if(ModuleLVL>=3){
				   addWz.setDisabled(true);	
				   addBtn.setDisabled(true);
				   updateBtn.setDisabled(true);
				   delBtn.setDisabled(true);
				}else{
					if(record.get('delOrUpdate')=='0'){
				         updateBtn.setDisabled(true);
				         delBtn.setDisabled(true);
			       }else{
				         updateBtn.setDisabled(false);
				         delBtn.setDisabled(false);	       
			       }
				}
		 if(USERDEPTID == "102010103"){
			   addWz.setDisabled(true);	
			   addBtn.setDisabled(true);
			   updateBtn.setDisabled(true);
			   delBtn.setDisabled(true);
         }

	})
	
	sm.on('beforerowselect',function(SelectionModel, rowIndex, keepExisting,record ){
		if(record.data.delOrUpdate =='0'){
			Ext.example.msg("信息提示","该数据不允许删除,修改！");
			return false;
		}else{
			return true;
		}
	})
//*******************************新增或修改 form***************
	

	var saveBtn = new Ext.Button({
		id : 'saveBtn',
		text : '保存',
		iconCls : 'save',
		handler : saveFun
	});
	var cancelBtn = new Ext.Button({
		id : 'cancelBtn',
		text : '关闭',
		iconCls : 'remove',
		handler : function(){
			addOrUpdate.hide();
		}
	});
   formPanel = new Ext.FormPanel({
				region : 'north',
				height : 105,
				border : false,
				labelAlign : 'right',
				bodyStyle : 'padding:5px 10px;',
				labelWidth : 80,
				tbar : ['<font color=#15428b><B>主体材料维护信息<B></font>', '->',
						saveBtn, '-', cancelBtn],
				items : [{
					layout : 'column',
					border : false,
					items : [{
						layout : 'form',
						columnWidth : .99,
						border : false,
						items : [  
									new fm.Hidden(fc['treeUids']),
									new fm.Hidden(fc['equParts']),
									new fm.TextField(fc['equNo']),
									new fm.DateField(fc['createDate']),
									new fm.Hidden(fc['uids']),
									new fm.Hidden(fc['pid']),
									new fm.Hidden(fc['conid']),
			                        new fm.TextField(fc['equName']),
			                        new fm.ComboBox(fc['estimateNo']),
			                        new fm.NumberField(fc['totalMoney']),
			                        new fm.TextField(fc['ggxh']),
			                        new fm.TextField(fc['remark']),
			                        new fm.Hidden(fc['delOrUpdate']),
			                        new fm.Hidden(fc['judgmentFlag'])
		                        ]
					}]
				}]
			})

			
//********************************************从采购合同选择物资grid bagin**************************
		var ColumnsB = [
		  	{name: 'uids', type: 'string'},
		  	{name: 'hth', type: 'string'},
		  	{name: 'pid', type: 'string'},
		  	{name: 'cgjhbh', type: 'string'},
		  	{name: 'bm', type: 'string'},    		
			{name: 'pm', type: 'string'},
			{name: 'gg', type: 'string' },
			{name: 'dw', type: 'string'},
			{name: 'jhdj', type: 'float'},
			{name: 'dj', type: 'float'},	
			{name: 'sl', type: 'float'},
			{name: 'dhsl', type: 'float'},
			{name: 'zj', type: 'float'},
			{name: 'dhrq', type: 'date'},
			{name: 'zzcs', type: 'string'},
			{name: 'bz', type: 'string'},
			{name: 'wzbm', type: 'string'},
			{name : 'innum', type : 'float'},
			{name : 'outnum', type : 'float'},
			{name : 'kcnum', type : 'float'}
			
		];
			
		dsB = new Ext.data.Store({
			baseParams : {
				ac : 'list',
				bean : beanB,
				business : businessB,
				method : listMethodB,
				params : pidWhereString
			},
			proxy : new Ext.data.HttpProxy({
				method : 'GET',
				url : MAIN_SERVLET
			}),
			reader : new Ext.data.JsonReader({
				root : 'topics',
				totalProperty : 'totalCount',
				id : primaryKeyB
			}, ColumnsB),
			remoteSort : true,
			pruneModifiedRecords : true
		});
		dsB.setDefaultSort(orderColumnB, 'asc');
		
	  var smB = new Ext.grid.CheckboxSelectionModel()				
	  var cmB = new Ext.grid.ColumnModel([
			smB, {
				id : 'uids',
				header : '主键',
				dataIndex : 'uids',
				hidden : true
			}, {
				id : 'pid',
				header : "PID",
				dataIndex : 'pid',
				hidden : true
			},{
				id : 'hth',
				header : "采购合同",
				dataIndex : 'hth',
				hidden : true
			},{
				id : 'bm',
				header : '编码',
				dataIndex : 'bm',
				hidden : true,
				width :120
			}, {
				id : 'wzbm',
				header : '物资编码',
				dataIndex : 'wzbm',
				width :120
			}, {
				id : 'pm',
				header : '品名',
				dataIndex : 'pm',
				align:"center",
				width :120
				
			}, {
				id : 'gg',
				header : '规格型号',
				dataIndex : 'gg',
				align:"center",
				width :120
			}, {
				id : 'dw',
				header : '单位',
				dataIndex : 'dw',
				align:"center",
				width :40
			}, {
				id : 'jhdj',
				header : '采购计划单价',
				dataIndex : 'jhdj',
				align:"center",
				//hidden:true,
				width :180
			}, {
				id : 'sl',
				header : '合同数量',
				dataIndex : 'sl',
				align:"center",
				width :100
			}, {
				id : 'innum',
				header : '入库数量',
				dataIndex : 'innum',
				width :100,
				align:"center"
			}, {
				id : 'outnum',
				header : '出库数量',
				dataIndex : 'outnum',
				width :100,
				align:"center"
			}, {
				id : 'kcnum',
				header : '库存数量',
				dataIndex : 'kcnum',
				width : 100,
				align:"center"
			},  {
				id : 'zj',
				header : '总价',
				dataIndex : 'zj',
				align:"center",
				width :100,
				renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
					return record.data.sl*record.data.jhdj;
				}
			}, {
				id : 'bz',
				header : '备注',
				dataIndex : 'bz',
				width :200
				
			}
		])
	cmB.defaultSortable = true;			
	
	var addWzBtn = new Ext.Button({
		id : 'addWz',
		text : '选择物资',
		iconCls : 'add',
		handler : addWzFun
	});	
	
	var   gridPanelMat = new Ext.grid.EditorGridTbarPanel({
			id : 'matPanel',
			ds : dsB,
			cm : cmB,
			sm : smB,
			clicksToEdit : 1,
			loadMask: true,		
			tbar : ['合同物资清单','->',addWzBtn],
			//border : false,
			header : false,
			addBtn : false, // 是否显示新增按钮
	        saveBtn : false, // 是否显示保存按钮
            delBtn : false, // 是否显示删除按钮
			enableHdMenu : false,
			autoScroll : true, // 自动出现滚动条
			collapsible : true, // 是否可折叠
			split:true,
			animCollapse : false, // 折叠时显示动画
			loadMask : true, // 加载时是否显示进度
			stripeRows: true,
			viewConfig : {
				forceFit : false,
				ignoreAdd : true
			},
			servletUrl : MAIN_SERVLET,
			bean : beanB,
			business : businessB,		
			primaryKey : primaryKeyB ,		
			//crudText: {add:'选择采购计划'},
			bbar: new Ext.PagingToolbar({
				pageSize: PAGE_SIZE,
				store: dsB,
				displayInfo: true,
				displayMsg: ' {0} - {1} / {2}',
				emptyMsg: "无记录。"
			})
	});			
//********************************************从采购合同选择物资grid end**************************			
	function delBtnFn(){
		 var record = sm.getSelected();
		 if(record == null || record == ""){
		    Ext.example.msg('提示信息','请选择要删除的记录！');
			return ;
		 }
	     grid.defaultDeleteHandler();
	}
	
	function saveBtnFn(){
	   grid.defaultSaveHandler();
	}
	addOrUpdate = new Ext.Window({
			width : 400,
			height : 300,
			modal: true, 
			plain: true, 
			border: false, 
			resizable: false,
			layout : 'fit',
			closeAction : 'hide',
			items : [formPanel],
			listeners : {
				'close' : function(){
					ds.reload();
                    formPanel.getForm().reset();
				},
				'hide' : function(){
					ds.reload();
                    formPanel.getForm().reset();
				},
				'show' : function(){
					addOrUpdate.show();
				}
			}
		});
	btnId =	 "";
	
	function addOrUpdateFun(btn){
		    btnId = this.id;
			var record = sm.getSelected();
			var formRecord = Ext.data.Record.create(columns);
			var loadFormRecord = null;
			if(btnId == "update") {
				
				if(record == null || record == ''){
				   Ext.example.msg('提示信息','请选择您要修改的记录！');
				   return;
				}
				var edit_uids = record.get('uids');
			    DWREngine.setAsync(false);
				baseMgm.findById(bean, edit_uids,function(obj){
					loadFormRecord = new formRecord(obj);
				});
				DWREngine.setAsync(true);
				addOrUpdate.show();
				formPanel.getForm().loadRecord(loadFormRecord);
				return;
			}
			if(selectUuid == "" ){
					Ext.example.msg('提示信息','请先选择左边的合同分类树！');
			    	return ;
				}
			if(selectConid == ""){
					Ext.example.msg('提示信息','请先选择该分类下的合同分类！');
			    	return ;			
			}	
			if(selectTreeid.indexOf("4") == 0){
					Ext.example.msg('提示信息','技术资料分类下不能添加主体材料信息！');
			    	return ;
				}
			var newRkNo="";	
//			DWREngine.setAsync(false);
//            var getSql = "select equ_no from Wz_Goods_bodys t where conid='"+selectConid+"' and treeUids ='"+selectUuid+
//                         "' and equ_no=(select max(equ_no)  from Equ_Goods_bodys t where conid = '"+selectConid+"' and treeUids = '"+selectUuid+"')";
//		    baseMgm.getData(getSql, function(str){
//		        newRkNo = str.toString();
//		    });			
//			DWREngine.setAsync(true);
//			newRkNo = newRkNo.substring(0,newRkNo.length-4);
//			if(newRkNo == null || newRkNo == ""){
//			    //获取单号前缀。前缀获取说明：在属性代码中配置“单号前缀”
//				DWREngine.setAsync(false);
//			    var prefix = "";
//			    var sql = "select c.property_name from PROPERTY_CODE c " +
//			            " where c.TYPE_NAME = (select t.uids from Property_Type t where t.TYPE_NAME = '单号前缀')" +
//			            " and c.property_code = '"+USERDEPTID+"' ";
//			    baseMgm.getData(sql, function(str){
//			        prefix = str.toString();
//			    });
				
			    
			    //处理入库检验单编号
			    var conno='';//财务合同编码
				DWREngine.setAsync(false);
				baseMgm.findById(beanCon, selectConid,function(obj){
			        conno = obj.conno;
				});
				
				DWREngine.setAsync(true);
//				if(prefix == ''){
				   newRkNo = conno.replace(/^\s+|\s+$/g,"")+"-";
//				}else{
//				   newRkNo = prefix+"-"+conno+"-";
//				}
//			}
			DWREngine.setAsync(false);
			equMgm.getEquNewDhNo(CURRENTAPPID,newRkNo,"equ_no","WZ_GOODS_BODYS",null,function(str){
				newRkNo = str;
			});
			DWREngine.setAsync(true);
			loadFormRecord = new formRecord({
					uids : '',
					pid : CURRENTAPPID,
					equNo : newRkNo,
					equName : '',
					createDate : new Date(),
					equParts : '1',
					conid : selectConid,
					treeUids : selectUuid,
					remark : '',
					judgmentFlag : 'body',
					delOrUpdate : '1'
			 });
			
			if(btnId == "addBtn"){
				 addOrUpdate.show();
                 formPanel.getForm().loadRecord(loadFormRecord);
                 return;
			    }
	}

	function havePartFun(c){
		partWin.show();
		c.checked = c.checked == true ? false : true;
		return false;
	}

	function winBtnFn() {
		var record = sm.getSelected();
		if (selectUuid == "") {
			Ext.example.msg('提示信息', '请先选择左边的合同分类树！');
			return;
		}
		if (selectParentid == 0 && selectConid == "") {
			Ext.example.msg('提示信息', '请先选择该分类下的合同分类！');
			return;
		}
		if (selectTreeid.indexOf("4") == 0) {
			Ext.example.msg('提示信息', '技术资料分类下不能添加主体材料信息！');
			return;
		}
		if (!equBodysWin) {
			equBodysWin = new Ext.Window({
						title : '主体材料出入库维护',
						layout : 'fit',
						border : false,
						modal : true,
						maximizable : true,
						closeAction : 'hide',
						items : [new Ext.Panel({
									contentEl : 'equBodysWin2'
								})],
						listeners : {
							'close' : function() {
								ds.reload();
							},
							'show' : function() {
								this.toggleMaximize();
							},
							'hide' : function() {
								ds.reload();
							},
							'restore' : function(win) {
								win.setPosition(7, 7);
								win.setSize(document.body.clientWidth - 20, document.body.clientHeight - 20);
							}
						}
					});
		}
		equBodysWin.show();
		if (equBodysWin) {
			var conid = selectConid;
			var partUids = selectUuid;
			var equName = '';
			var treeUids = selectUuid;
			var selectParentid = selectParentid;
			document.all('equBodysWin').src = "Business/wzgl/baseinfo_wzgl/wz.bodys.maintenance.main.jsp?conid="
					+ conid + "&partUids=" + partUids + "&equName=" + equName + "&treeUids=" + treeUids;
		}
	}

	function saveFun(){
	    var form = formPanel.getForm()
		if (form.isValid()) {
			doFormSave(true)	
		}
	}

	function doFormSave(dataArr){
		var form = formPanel.getForm()
    	var obj = form.getValues()
    	for(var i=0; i<columns.length; i++) {
    		var n = columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	DWREngine.setAsync(false);
    	wzbaseinfoMgm.wzBodySaveOrUpdate(obj,function(str){
    	    if(str == 'success'){
    	        Ext.example.msg('信息提示','您保存了一条记录');
    	    }else{
    	        Ext.example.msg('信息提示','保存失败');
    	    }
    	    
    	})
    	DWREngine.setAsync(true);
    	addOrUpdate.hide();
//    	if(selectParentid =='0'){
//            ds.baseParams.params="conid='"+selectConid+"' " +
//            		" and treeUids in (select uuid from EquTypeTree where conid='"+selectConid+"' )";
//    	}else{
//    		if(btnId == 'update' && (selectParentid ==null || selectParentid =="")){
//    		     ds.baseParams.params=''
//    		}else{
////                 ds.baseParams.params="conid='"+selectConid+"' and treeUids='"+selectUuid+"'";   	
//    		       ds.baseParams.params="conid='"+selectConid+"' " +
//            		      " and treeUids in (select uuid from EquTypeTree where conid='"+selectConid+"' )";
//    		}
//    	}
//    	ds.load({params:{start:0,limit:PAGE_SIZE}});
		ds.reload({params:{start:0,limit:PAGE_SIZE}});
	}
	function renderConid(value, metadata, record) {
		var getConid = record.get('conid');
	    conname = record.get('equName');
    	DWREngine.setAsync(false);
	    var prefix = "";
	    var num=0;
	    var sql = "select count(uids) from  wz_goods_openbox_sub_part  t where  t.equ_bodys='"+ record.get('uids')+"'";
	    baseMgm.getData(sql, function(str){
	    	if(str != null || str !='')
	            num = str;
	    });
	    DWREngine.setAsync(false);
		var output ="";
		output ="<a title='"+value+"' style='color:blue;' href=Business/wzgl/baseinfo_wzgl/wz.bodys.maintenance.have.jsp?conid="
		         +getConid+"&partUids="+record.get('uids')+"&equName="+conname+"&edit_flagLayout="+edit_flagLayout+"&treeUids="+record.get('treeUids')+"\>" +"部件明细"+"【"+ num+"】</a>"		
		return output;
	}
	
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    
 //从采购合同选择
	function addWzFn() {
		var record = sm.getSelected();
		if (selectUuid == "") {
			Ext.example.msg('提示信息', '请先选择左边的合同分类树！');
			return;
		}
		if (selectParentid == 0 && selectConid == "") {
			Ext.example.msg('提示信息', '请先选择该分类下的合同分类！');
			return;
		}
		if (selectTreeid.indexOf("4") == 0) {
			Ext.example.msg('提示信息', '技术资料分类下不能添加主体材料信息！');
			return;
		}
		if (!equBodysWzWin) {
			 equBodysWzWin = new Ext.Window({
						title : '采购合同对应物资明细',
						layout : 'fit',
						border : false,
						modal : true,
						width : document.body.clientWidth,
						height : document.body.clientHeight,
						closeAction : 'hide',
						items : [gridPanelMat],
						listeners : {
							'close' : function() {
								ds.reload();
							},
							'show' : function() {
								equBodysWzWin.show();
							},
							'hide' : function() {
								ds.reload();
							}
						}
					});
		}
        dsB.baseParams.params=" hth='"+selectConid+"'";
    	dsB.load({params:{start:0,limit:PAGE_SIZE}});
		equBodysWzWin.show();
	}
//从采购合同中选择物资选择按钮功能实现
	function addWzFun(){
	    var  records = smB.getSelections();
	    if(records == null || records == ""){
	         Ext.example.msg('提示信息', '请选择物资！');
			 return;
	    }else{
	    	var getUids = new Array();
	    	var conno='';//财务合同编码
			DWREngine.setAsync(false);
			baseMgm.findById(beanCon, selectConid,function(obj){
		        conno = obj.conno;
			});
			DWREngine.setAsync(true);
			//获取财物合同编码
	        var newRkNo = conno.replace(/^\s+|\s+$/g,"")+"-";;	
	        for(var i = 0 ;i < records.length; i ++){
	            getUids.push(records[i].get('uids'));
	        }
	        DWREngine.setAsync(false);
            wzbaseinfoMgm.wzAddBodyFromConMat(getUids,newRkNo,CURRENTAPPID,selectConid,selectUuid,function(){
		         Ext.example.msg('提示信息', '您选择了<span style="color:red;">'+records.length+'</span>条物资信息！');
				 smB.clearSelections();
            })
            DWREngine.setAsync(true);
	    }
	    
	}

	function renderQc(value, metadata, record) {
		var getEquNo = record.get('equNo');
		DWREngine.setAsync(false);
		var qcuids = "";
		var num = 0;
		wzbaseinfoMgm.getQcCount(getEquNo, function(count) {
					if (count != null || count != '')
						num = count;
				});
		wzbaseinfoMgm.getQcUids(getEquNo, function(str) {
					qcuids = str;
				});
		DWREngine.setAsync(false);
		var output = "";
		output = "<a title='" + value + "' style='color:blue;' href=javaScript:ckQcmx('"
				+ record.get('equNo') + "')\>" + "清册明细" + "【" + num + "】</a>"
		return output;
	}

	//设备清册
	var smQc =  new Ext.grid.CheckboxSelectionModel({});   //  创建选择模式

    var fm = Ext.form;			// 包名简写（缩写）

    var fc = {		// 创建编辑域配置
    	 'uids': {name: 'uids',fieldLabel: '设备主键',hidden:true,hideLabel:true}, 
    	 'pid': {name: 'pid',fieldLabel: '工程项目编号',hidden:true,hideLabel:true},
    	 'treeId': {name: 'treeId',fieldLabel: '设备清册树ID' ,hidden:true,hideLabel:true,anchor:'95%'},
    	 'equNo': {name: 'equNo',fieldLabel: '序号', anchor:'95%', allowBlank:false}, 
    	 'equName': {name: 'equName',fieldLabel: '设备名称',anchor:'95%',allowBlank:false}, 
    	 'kksNo': {name: 'kksNo',fieldLabel: 'KKS编码', anchor:'95%', allowBlank:false},
    	 'ggxh': {name: 'ggxh',fieldLabel: '设备型号规格',anchor:'95%',allowBlank:false}, 
    	 'equMake': {name: 'equMake',fieldLabel: '生产厂家', anchor:'95%'}, 
    	 'remark': {name: 'remark',fieldLabel: '备注',anchor:'95%'}
    }

     // 3. 定义记录集
    var Columns = [
    	{name: 'uids', type: 'string'},
    	{name: 'pid', type: 'string'},
    	{name: 'treeId', type: 'string'},
    	{name: 'equNo', type: 'string'},    		//Grid显示的列，必须包括主键(可隐藏)
		{name: 'equName', type: 'string'},    	
		{name: 'kksNo', type: 'string' },
		{name: 'ggxh', type: 'string'},
		{name: 'equMake', type: 'string'},
		{name: 'remark', type: 'string'}
		];
		
    var Plant = Ext.data.Record.create(Columns);			//定义记录集   	
    var PlantInt = {uids:'',pid:CURRENTAPPID, treeId: '', equNo:'', equName:'', kksNo:'', ggxh:'',  equMake:'',remark:''}	//设置初始值 
        
    
    var cm = new Ext.grid.ColumnModel([		// 创建列模型
    	//sm,
    	{	id:"equNo",
    		header:fc['equNo'].fieldLabel,
    		dataIndex: fc['equNo'].name
    	},
    	{	id:'pid',
    		header: fc['pid'].fieldLabel,
    		dataIndex: fc['pid'].name,
    		hidden: true
    	},
        {	id:'uids',
        	header: fc['uids'].fieldLabel,
        	dataIndex: fc['uids'].name,
        	hidden: true
        },
        {	id:'treeId', 
        	header: fc['treeId'].fieldLabel, 
        	dataIndex: fc['treeId'].name, 
        	hidden: true
        },
        {	id:'equName',
        	header: fc['equName'].fieldLabel,
        	width:120,
        	dataIndex: fc['equName'].name
        },
        {	id:'kksNo', 
        	header: fc['kksNo'].fieldLabel,
        	width:120,
        	dataIndex: fc['kksNo'].name
        },
        {
         	id:'ggxh',
           	header: fc['ggxh'].fieldLabel,
           	dataIndex: fc['ggxh'].name
        },
        {
        	id:'equMake',header: fc['equMake'].fieldLabel,
        	width:150,
        	dataIndex: fc['equMake'].name
        },
        {
           id:'remark',
           header: fc['remark'].fieldLabel,
           width:200,
           dataIndex: fc['remark'].name
        }
    ]);

    cm.defaultSortable = true;						//设置是否可排序
      
    // 4. 创建数据源
   dsQc = new Ext.data.Store({
		baseParams: {
	    	ac: 'list',				//表示取列表
	    	bean: "com.sgepit.pmis.equipment.hbm.EquGoodsQc",				
	    	business: "baseMgm",
	    	method: "findWhereOrderby",
	    	params: "pid='" + CURRENTAPPID + "'"
		},
        proxy: new Ext.data.HttpProxy({
            method: 'GET',
            url: MAIN_SERVLET
        }),
        reader: new Ext.data.JsonReader({
            root: 'topics',
            totalProperty: 'totalCount',
            id: 'uids'
        }, Columns),
        remoteSort: true,
        pruneModifiedRecords: true	//若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
    });
    dsQc.setDefaultSort("equNo", 'asc');	//设置默认排序列
    dsQc.load({params : {start : 0,limit : PAGE_SIZE}});
    // 5. 创建可编辑的grid: grid-panel
    var gridQc = new Ext.grid.EditorGridPanel({
        // basic properties
    	id: 'grffid-panel',			//id,可选
        ds: dsQc,						//数据源
        cm: cm,						//列模型
        sm: smQc,						//行选择模式
        region: 'center',
        clicksToEdit: 2,			//单元格单击进入编辑状态,1单击，2双击
        autoScroll: true,			//自动出现滚动条
        collapsible: false,			//是否可折叠
        animCollapse: false,		//折叠时显示动画
        loadMask: true,				//加载时是否显示进度
        stripeRows: true,
		viewConfig:{
			ignoreAdd: true
		},
		tbar:["<font style='color:blue;>设备清册明细</font>"],
		bbar: new Ext.PagingToolbar({//在底部工具栏上添加分页导航
            pageSize: PAGE_SIZE,
            store: dsQc,
            displayInfo: true,
            displayMsg: ' {0} - {1} / {2}',
            emptyMsg: "无记录。"
        }),
        // expend properties
        plant: Plant,				
      	plantInt: PlantInt,			
      	servletUrl: MAIN_SERVLET,		
      	bean:"com.sgepit.pmis.equipment.hbm.EquGoodsQc",					
      	business: "baseMgm",
      	primaryKey:"uids"
   }); 
   
	function showqCWin(){
		qcWin.show();
		dsQc.baseParams.params = "pid='" + CURRENTAPPID + "'";
		dsQc.load({params : {start : 0,limit : PAGE_SIZE}});
	}
	qcWin = new Ext.Window({
        id:'selectqcwin',
        title:'设备清册明细',
        width: 800,
        height: document.body.clientHeight*0.7,
        layout : 'fit',
        border: false, 
        resizable: false,
        closeAction :"hide",
        items : [gridQc]
    });
})
var qcWin;
function ckQcmx(quids) {
	var qcuids = "";
	DWREngine.setAsync(false);
	wzbaseinfoMgm.getQcUids(quids, function(str) {
				qcuids = str;
			});
	DWREngine.setAsync(true);
	dsQc.baseParams.params = "pid='" + CURRENTAPPID + "' and uids in(" + qcuids + ")";
	dsQc.reload();
	qcWin.show();

}