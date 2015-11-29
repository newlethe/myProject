var bean = "com.sgepit.pmis.equipment.hbm.EquGoodsBodys";
var beanCon = "com.sgepit.pmis.contract.hbm.ConOve";
var business = "baseMgm";
var listMethod = "findWhereOrderby";
var primaryKey = 'uids';
var grid;
var ds;
var btnId;

var addOrUpdate;
var	formPanel = null;

var  equBodysWin;
var bdgArr = new Array();
//袁旭云新增
//选中节点的名称
var selectNodeText ="";
Ext.onReady(function(){
	
	var fm = Ext.form;
	var sm = new Ext.grid.CheckboxSelectionModel({header:'',singleSelect : true});
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
        id : CURRENTAPPID+'-01'
    })
    var treeLoaderNew = new Ext.tree.TreeLoader({
        url : MAIN_SERVLET,
        baseParams : {
            ac : "columntree",
            treeName : "equBdgTree",
            businessName : "equBaseInfo",
            bdgid : CURRENTAPPID+"-0101,"+CURRENTAPPID+"-0102,"+CURRENTAPPID+"-0103,"+CURRENTAPPID+"-0104",
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
            bdgid = CURRENTAPPID+'-01';
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
		'equNo' : {name : 'equNo',fieldLabel : '主体设备编码',anchor : '90%', readOnly : true},
		'equName' : {name : 'equName',fieldLabel : '主体设备名称',anchor : '90%',allowBlank: false},
		'equParts' : {name : 'equParts',fieldLabel : '对应部件'},
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
		'totalMoney' : {name : 'totalMoney',fieldLabel : '金额',anchor : '90%',width: 200},
		'delOrUpdate' : {name : 'delOrUpdate',fieldLabel : '修改删除权限'}
	}
	
	var columns = [
		{name : 'uids', type : 'string'},
		{name : 'pid', type : 'string'},
		{name : 'equNo', type : 'string'},
		{name : 'equName', type : 'string'},
		{name : 'equParts', type : 'string'},
		{name : 'createDate',type : 'date',dateFormat: 'Y-m-d H:i:s'},
		{name : 'conid', type : 'string'},
		{name : 'treeUids', type : 'string'},
		{name : 'ggxh',type : 'string'},
		{name : 'estimateNo',type : 'string'},
		{name : 'remark' , type : 'string' },
		{name : 'totalMoney' ,type : 'float'},
		{name : 'delOrUpdate',type : 'string'}
	];
	
	var plant = Ext.data.Record.create(columns);
	var plantInt = {
		uids : '',
		pid : CURRENTAPPID,
		equNo : '',
		equName : '',
		equParts : '',
		createDate : '',
		conid : selectConid,
		treeUids : selectUuid,
		remark : '',
		totalMoney :'',
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
			hidden :true,
			align : 'center'
		}, {
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
		
		}]);
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
	var impBtn = new Ext.Button({
        id : 'import',
        text : '导入数据',
        tooltip : '如果需要通过Excel导入数据，请先下载模板',
        cls : 'x-btn-text-icon',
        icon : 'jsp/res/images/icons/page_excel.png',
        handler : importDataFile
    })
    var downBtn = new Ext.Button({
        id : 'down',
        text : '下载模板',
        tooltip : '如果需要通过Excel导入数据，请先下载模板',
        cls : 'x-btn-text-icon',
        icon : 'jsp/res/images/icons/page_excel.png',
        handler : function(){
            var filePrintType = "EquBodyMaintenance";
            downloadExcelTemp(filePrintType);
        }
    })
	var winBtn = new Ext.Button({
  		id : 'btn',
		text : '主体设备出入库',
		iconCls : 'add',
		handler : winBtnFn
	})
	grid = new Ext.grid.EditorGridTbarPanel({
		region : 'center',
		ds : ds,
		cm : cm, // 列模型
		sm : sm,
		tbar :  ['<font color=#15428b><B>合同主体设备维护<B></font>','-',addBtn,'-',updateBtn,'-',delBtn,'-',downBtn,'-',impBtn,'->',winBtn],//saveBtn,'-',
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
	//权限控制
	if(ModuleLVL>=3){
	   addBtn.setDisabled(true);
       updateBtn.setDisabled(true);
	   delBtn.setDisabled(true);	 
	}
	
	ds.load({params:{start:0,limit:PAGE_SIZE}});
	cm.defaultSortable = true;
	
	sm.on('rowselect',function(){
	       var record = sm.getSelected();
	       if(record  == null || record == '') return;
	       	if(ModuleLVL>=3){
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
				tbar : ['<font color=#15428b><B>主体设备维护信息<B></font>', '->',
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
			                        new fm.Hidden(fc['delOrUpdate']),
			                        new fm.TextField(fc['remark'])
		                        ]
					}]
				}]
			})
					
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
	btnId = "";
	function addOrUpdateFun(btn) {
		btnId = this.id;
		var record = sm.getSelected();
		var formRecord = Ext.data.Record.create(columns);
		var loadFormRecord = null;
		if (btnId == "update") {
			var edit_uids = record.get('uids');
			if (edit_uids == null || edit_uids == '') {
				Ext.Msg.alert("系统提示", '请选择您要修改的记录！');
				return;
			}
			DWREngine.setAsync(false);
			baseMgm.findById(bean, edit_uids, function(obj) {
				loadFormRecord = new formRecord(obj);
			});
			DWREngine.setAsync(true);
			addOrUpdate.show();
			formPanel.getForm().loadRecord(loadFormRecord);
			return;
		}
		if (selectUuid == "") {
			Ext.example.msg('提示信息', '请先选择左边的合同分类树！');
			return;
		}
//		if (selectParentid == 0 && selectConid == "") {
//			Ext.example.msg('提示信息', '请先选择该分类下的合同分类！');
//			return;
//		}
		// 限制能添加物资的节点只有主设备、备品备件、专用工具和其下子节点 pengy 2015-03-09
		if (selectTreeid.indexOf("01") != 0 && selectTreeid.indexOf("02") != 0
				&& selectTreeid.indexOf("03") != 0 && selectTreeid.indexOf("04") != 0) {
			Ext.example.msg('提示信息', '请选择合同分类下的的物资分类！');
			return;
		}
		if (selectTreeid.indexOf("04") == 0) {
			Ext.example.msg('提示信息', '技术资料分类下不能添加主体设备信息！');
			return;
		}
		var newRkNo = "";
		DWREngine.setAsync(false);
		var getSql = "select equ_no from Equ_Goods_bodys t where conid='"+selectConid+"' and treeUids='"+selectUuid
				+"' and equ_no=(select max(equ_no) from Equ_Goods_bodys t where conid='"+selectConid+"' and treeUids='"+selectUuid+"')";
		baseMgm.getData(getSql, function(str) {
			newRkNo = str.toString();
		});
		DWREngine.setAsync(true);
		newRkNo = newRkNo.substring(0, newRkNo.length - 4);
		if (newRkNo == null || newRkNo == "") {
			// 获取单号前缀。前缀获取说明：在属性代码中配置“单号前缀”
			DWREngine.setAsync(false);
			var prefix = "";
			var sql = "select c.property_name from PROPERTY_CODE c where c.TYPE_NAME=(select t.uids " +
					"from Property_Type t where t.TYPE_NAME='单号前缀') and c.property_code='" + USERDEPTID + "' ";
			baseMgm.getData(sql, function(str) {
				prefix = str.toString();
			});

			// 处理入库检验单编号
			var conmoneyno = '';// 财务合同编码
			baseMgm.findById(beanCon, selectConid, function(obj) {
				conmoneyno = obj.conno;
			});

			DWREngine.setAsync(true);
			// if(prefix == ''){
			newRkNo = conmoneyno + "-";
			// }else{
			// newRkNo = prefix+"-"+conmoneyno+"-";
			// }
		}
		DWREngine.setAsync(false);
		equMgm.getEquNewDhNo(CURRENTAPPID, newRkNo, "equ_no", "EQU_GOODS_BODYS", null, function(str) {
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
			delOrUpdate : '1'
		});

		if (btnId == "addBtn") {
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
		selectNodeText = nodeText;
		var record = sm.getSelected();
		if (selectUuid == "") {
			Ext.example.msg('提示信息', '请先选择左边的合同分类树！');
			return;
		}
//		if (selectParentid == 0 && selectConid == "") {
//			Ext.example.msg('提示信息', '请先选择该分类下的合同分类！');
//			return;
//		}
		// 限制能添加物资的节点只有主设备、备品备件、专用工具和其下子节点 pengy 2015-03-09
		if (selectTreeid.indexOf("01") != 0 && selectTreeid.indexOf("02") != 0
				&& selectTreeid.indexOf("03") != 0 && selectTreeid.indexOf("04") != 0) {
			Ext.example.msg('提示信息', '请选择合同分类下的的物资分类！');
			return;
		}
		if (selectTreeid.indexOf("04") == 0) {
			Ext.example.msg('提示信息', '技术资料分类下不能添加主体设备信息！');
			return;
		}
		if (!equBodysWin) {
			equBodysWin = new Ext.Window({
				title : '主体设备出入库维护',
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
			document.all('equBodysWin').src = "Business/equipment/baseInfo/equbody/equ.bodys.maintenance.main.jsp?conid="
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
    	equBaseInfo.equBodySaveOrUpdate(obj,function(str){
    	    if(str == 'success'){
    	        Ext.example.msg('信息提示','您保存了一条记录');
    	    }else{
    	        Ext.example.msg('信息提示','保存失败');
    	    }
    	    
    	})
    	DWREngine.setAsync(true);
    	addOrUpdate.hide();
    	if(selectParentid =='0'){
            ds.baseParams.params="conid='"+selectConid+"' " +
            		" and treeUids in (select uuid from EquTypeTree where conid='"+selectConid+"' )";
    	}else{
    		if(btnId == 'update' && (selectParentid ==null || selectParentid =="")){
    		     ds.baseParams.params=''
    		}else{
//                 ds.baseParams.params="conid='"+selectConid+"' and treeUids='"+selectUuid+"'";  
    			ds.baseParams.params="conid='"+selectConid+"' " +
            		" and treeUids in (select uuid from EquTypeTree where conid='"+selectConid+"' )";
    		}
    	}
    	ds.load({params:{start:0,limit:PAGE_SIZE}});
	}
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
		output ="<a title='"+value+"'   style='color:blue;' href=Business/equipment/baseInfo/equbody/equ.bodys.maintenance.have.jsp?conid="
		         +getConid+"&partUids="+record.get('uids')+"&equName="+conname+"&treeUids="+record.get('treeUids')+"\>" +"部件明细"+"【"+ num+"】</a>"		
		return output;
	}
	
	function formatDate(value){
        return value ? value.dateFormat('Y-m-d') : '';
    };
    //导入数据
    function importDataFile(){
    	if(selectUuid == "" ){
				Ext.example.msg('提示信息','请先选择左边的合同分类树！');
		    	return ;
			}
		if(selectParentid == 0 && selectConid == ""){
				Ext.example.msg('提示信息','请先选择该分类下的合同分类！');
		    	return ;			
		}	
		if(selectParentid == 0001){ 
			Ext.example.msg('提示信息','请先选择该合同分类下的的物资分类！');
			return ;
		}
		if(selectTreeid.indexOf("4") == 0){
			Ext.example.msg('提示信息','技术资料分类下不能添加主体设备信息！');
	    	return ;
		}
        var allowedDocTypes = "xls,xlsx";
        var impUrl = CONTEXT_PATH + "/servlet/EquServlet?ac=importData&pid="+CURRENTAPPID+"&selectUuid="+selectUuid+"&selectConid="+selectConid+"&userDept="+USERDEPTID+"&bean="+bean
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

        var uploadWin=new Ext.Window({
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
                                        ds.load({params:{start:0,limit:10}});
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
    //下载需要导入数据的excel模板
	function downloadExcelTemp(filePrintType) {
	    var sql = "select t.fileid from APP_TEMPLATE  t where t.templatecode='"
	            + filePrintType + "'";
	    DWREngine.setAsync(false);
	    baseMgm.getData(sql, function(str) {
	                fileid = str;
	            });
	    DWREngine.setAsync(true);
	    var openUrl = CONTEXT_PATH
	            + "/servlet/BlobCrossDomainServlet?ac=appfile&fileid=" + fileid
	            + "&pid=" + CURRENTAPPID;
	    document.all.formAc.action = openUrl;
	    document.all.formAc.submit();
	}
})