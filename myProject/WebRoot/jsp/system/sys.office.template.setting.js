var treePanel, treeLoader, gridPanel, formPanel, formWin;
var nodes = new Array();
var docTypeSt;
var bean = "com.sgepit.frame.sysman.hbm.AppTemplate";
var business = "systemMgm";
var listMethod = "findByProperty";
var primaryKey = "templateid";
var orderColumn = "lastmodify";
var gridPanelTitle = "模板列表，请选择具体模块";
var propertyName = "powerpk";
var propertyValue = defaultParentId;
var SPLITB = "`";
var root;
var treeNodeUrl = CONTEXT_PATH + "/servlet/SysServlet?ac=tree";
var selectedModuleNode = null;
var uploadRow = {};
var allowedDocTypes = "xls,xlsx,doc,docx";
var currentFileExt;

Ext.onReady(function() {
	docTypeSt = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : [['xls', 'Excel'], ['word', 'Word']]
	});
	var fm = Ext.form; // 包名简写（缩写）
	root = new Ext.tree.AsyncTreeNode({
		text : "业务应用",
		id : defaultParentId
	});


	treeLoader = new Ext.tree.TreeLoader({
		dataUrl: treeNodeUrl + "&parentId=" + defaultParentId + "&treeName=SysModuleTree",
		requestMethod: "GET"
	})
	treePanel = new Ext.tree.TreePanel({
		id : 'modules-tree',
		region : 'west',
		split : true,
		width : 200,
		minSize : 175,
		maxSize : 500,
		frame : false,
		tbar : [{
			iconCls : 'icon-expand-all',
			tooltip : '全部展开',
			handler : function() {
				root.expand(true);
			}
		}, '-', {
			iconCls : 'icon-collapse-all',
			tooltip : '全部折叠',
			handler : function() {
				root.collapse(true);
			}
		}],
		collapsible : true,
		enableDD : true,
		margins : '5 0 5 5',
		cmargins : '0 0 0 0',
		rootVisible : true,
		lines : false,
		autoScroll : true,
		animCollapse : false,
		animate : false,
		collapseMode : 'mini',
		loader : treeLoader,
		root : root,
		collapseFirst : false
	});

	treePanel.on('beforeload', function(node){ 
		treePanel.loader.dataUrl = treeNodeUrl+"&parentId="+node.id+"&treeName=SysModuleTree"; 
	});
	
	treePanel.on('click', function(node, e) {
		e.stopEvent();
		PlantInt.powerpk = node.id;
		var titles = [node.text];
		var obj = node.parentNode
		while (obj != null) {
			titles.push(obj.text);
			obj = obj.parentNode
		}
		var title = titles.reverse().join(" / ");
		gridPanel.setTitle(title);
		ds.baseParams.params = propertyName + SPLITB + node.id
		selectedModuleNode = node
		ds.load({
			params : {
				start : 0,
				limit : PAGE_SIZE
			}
		});
	});
	

	var fc = { // 创建编辑域配置
		'templateid' : {
			name : 'templateid',
			fieldLabel : '主键',
			anchor : '95%',
			readOnly : true,
			hidden : true
			
		},
		'templatecode' : {
			name : 'templatecode',
			fieldLabel : '模板标识符',
			allowBlank : false,
			anchor : '95%'
		},
		'powerpk' : {
			name : 'powerpk',
			fieldLabel : '模块ID',
			readOnly : true,
			hidden : true,
			anchor : '95%'
		},
		'doctype' : {
			name : 'doctype',
			fieldLabel : '文档类型',
			anchor : '95%'
		},
		'fileid' : {
			name : 'fileid',
			fieldLabel : '文件流水号',
			anchor : '95%'
		},
		'filename' : {
			name : 'filename',
			fieldLabel : '模板',
			anchor : '95%'
		},
		'author' : {
			name : 'author',
			fieldLabel : '作者',
			anchor : '95%'
		},
		'lastmodify' : {
			name : 'lastmodify',
			fieldLabel : '更新时间',
			anchor : '95%'
		},
		'datecreated' : {
			name : 'datecreated',
			fieldLabel : '创建时间',
			anchor : '95%'
		}
	}

	var Columns = [{
		name : 'templateid',
		type : 'string'
	}, {
		name : 'fileid',
		type : 'string'
	}, {
		name : 'templatecode',
		type : 'string'
	}, {
		name : 'powerpk',
		type : 'string'
	}, {
		name : 'doctype',
		type : 'string'
	}, {
		name : 'filename',
		type : 'string'
	}, {
		name : 'author',
		type : 'string'
	}, {
		name : 'lastmodify',
		type : 'date',
		dateFormat: 'Y-m-d H:i:s'
		
	}, {
		name : 'datecreated',
		type : 'date',
		dateFormat: 'Y-m-d H:i:s'
	}];
	var Plant = Ext.data.Record.create(Columns);
	var PlantInt = {
		templatecode: '',
		powerpk : defaultParentId,
		doctype : '',
		filename : '',
		fileid : '',
		author : USERNAME
	}

	var sm = new Ext.grid.CheckboxSelectionModel()

	var cm = new Ext.grid.ColumnModel([sm, {
		id : 'templateid',
		header : fc['templateid'].fieldLabel,
		dataIndex : fc['templateid'].name,
		hidden : true,
		width : 200
	}, {
		id : 'templatecode',
		header : fc['templatecode'].fieldLabel,
		dataIndex : fc['templatecode'].name,
		width : 100,
		editor : new fm.TextField(fc['templatecode'])
	}, {
		id : 'powerpk',
		header : fc['powerpk'].fieldLabel,
		dataIndex : fc['powerpk'].name,
		hidden : true,
		width : 200
	}, {
		id : 'filename',
		header : fc['filename'].fieldLabel,
		dataIndex : fc['filename'].name,
		width : 280,
		renderer: filenameRender
	}, {
		id : 'doctype',
		header : fc['doctype'].fieldLabel,
		dataIndex : fc['doctype'].name,
		width : 60,
		renderer : function(value) {
			return value ? (value == 'word' ? 'Word' : 'Excel') : ''
		}
	}, {
		id : 'author',
		header : fc['author'].fieldLabel,
		dataIndex : fc['author'].name,
		width : 100
	}, {
		id : 'lastmodify',
		header : fc['lastmodify'].fieldLabel,
		dataIndex : fc['lastmodify'].name,
		width : 90,
		renderer: formatDateTime
	}, {
		id : 'datecreated',
		header : fc['datecreated'].fieldLabel,
		dataIndex : fc['datecreated'].name,
		width : 90,
		renderer: formatDateTime
	}, {
		id : 'fileid',
		header : fc['fileid'].fieldLabel,
		dataIndex : fc['fileid'].name,
		//hidden : true,
		width : 100
	}])
	cm.defaultSortable = true;

	var ds = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : bean,
			business : business,
			method : listMethod,
			params : propertyName + SPLITB + propertyValue
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
	ds.setDefaultSort(orderColumn, 'asc');

	gridPanel = new Ext.grid.EditorGridTbarPanel({
		id : 'template-grid-panel',
		ds : ds,
		cm : cm,
		sm : sm,
		tbar : [],
		title : gridPanelTitle,
		iconCls : 'icon-by-category',
		border : false,
		region : 'center',
		clicksToEdit : 1,
		header : true,
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		autoExpandColumn : 1, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
		loadMask : true, // 加载时是否显示进度
		// ctCls: 'borderLeft',
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
		business : "systemMgm",
		primaryKey : primaryKey,
		insertHandler : insertFun,
		insertMethod : 'insertTemplate',
		saveMethod : 'updateTemplate',
		deleteMethod : 'deleteTemplate'
	});
	
	var contentPanel = new Ext.Panel({
		id : 'content-panel',
		border : false,
		region : 'center',
		split : true,
		layout : 'border',
		layoutConfig : {
			height : '100%'
		},
		items : [gridPanel]
	});

	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [treePanel, contentPanel]
	});
	
	treePanel.render()
	root.expand();
	root.select();
	selectedModuleNode = root
	ds.load({
		params : {
			start : 0, // 起始序号
			limit : PAGE_SIZE
		// 结束序号，若不分页可不用设置这两个参数
		}
	});
	
    gridPanel.on("cellclick", function(grid, rowIdx, colIdx, e){
    	//if(cm[colIdx].id == ""){
    		var record = grid.getStore().getAt(rowIdx);
    		uploadRow.lsh = record.get("templateid");
    		uploadRow.fileid = record.get("fileid");
    		uploadRow.row = rowIdx
    		uploadRow.col = colIdx
    	//}
    })
    
	function insertFun() {
		gridPanel.defaultInsertHandler()
	}
	
	function formatDateTime(value){
        return (value && value instanceof Date) ? value.dateFormat('Y-m-d') : value;
    };
    
	function filenameRender(vl){
		if (vl != ""){
			return "<a href='javascript: viewTemplate()' title='浏览'>"+vl+"</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href='javascript: uploadTemplate(true)' title='重新上传'>上传</a>"
		} else {
			return "<a href='javascript: uploadTemplate()' title='上传'>上传</a>"
		}
	}

});

function viewTemplate(){
	window.open(MAIN_SERVLET+"?ac=downloadFile&fileid="+uploadRow.fileid)
}

function uploadTemplate(flag){
	var uploadForm = new Ext.form.FormPanel({   
	  baseCls: 'x-plain',   
	  labelWidth: 80,   
	  url: MAIN_SERVLET+"?ac=upload",   
	  fileUpload: true,   
	  defaultType: 'textfield',   
	
	  items: [{   
	    xtype: 'textfield',   
	    fieldLabel: '流水号',   
	    name: 'fileid1',
	    readOnly: true,
	    hidden: true,
	    hideLabel: true,
	    anchor: '90%'  // anchor width by percentage   
	  },{   
	    xtype: 'textfield',   
	    fieldLabel: '请选择文件',   
	    name: 'filename1',   
	    inputType: 'file',   
	    allowBlank: false,   
	    blankText: 'File can\'t not empty.',   
	    anchor: '90%'  // anchor width by percentage   
	  }]   
	});   
	
	var uploadWin = new Ext.Window({   
	  title: '上传',   
	  width: 450,   
	  height: 180,   
	  minWidth: 300,   
	  minHeight: 100,   
	  layout: 'fit',   
	  plain:true,   
	  bodyStyle:'padding:5px;',   
	  buttonAlign:'center',   
	  items: uploadForm,   
	
	  buttons: [{   
	    text: '上传',   
	    handler: function() {
	      var filename = uploadForm.form.findField("filename1").getValue()
	      if (filename!= ""){
	      	var fileExt = filename.substring(filename.lastIndexOf(".")+1,filename.length).toLowerCase();
	     	if (allowedDocTypes.indexOf(fileExt) == -1) {
	     		Ext.MessageBox.alert("提示", "请选择Office文档！");
	     		return;
	     	}else{
	     		currentFileExt = fileExt
	     	}
	      }
	      if(uploadForm.form.isValid()){   
	        Ext.MessageBox.show({   
	             title: '请等待',   
	             msg: '上传中...',   
	             progressText: '',   
	             width:300,   
	             progress:true,   
	             closable:false,   
	             animEl: 'loading'  
	           });   
	        uploadForm.getForm().submit({
	          method: 'POST',
	          params:{ac:'upload'},
	          success: function(form, action){
				tip = Ext.QuickTips.getQuickTip();
				tip.setTitle('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上传成功!', 'icon-success')
				tip.show();
				Ext.MessageBox.hide();
	            uploadWin.hide();
	            var rtn = action.result.msg;
	            var fileid = rtn[0].fileid;
	            var filename = rtn[0].filename;
	            fileUploaded(fileid,filename);
	          },       
	           failure: function(){       
	            Ext.Msg.alert('Error', 'File upload failure.');       
	           }   
	        })              
	      }   
	     }   
	  },{   
	    text: '关闭',   
	    handler:function(){uploadWin.hide();}   
	  }]   
	});
	
	uploadWin.show();
	if (flag) {
		uploadForm.getForm().findField("fileid1").setValue(uploadRow.fileid);
	}
}

function fileUploaded(fileid, filename){
	var record = gridPanel.getStore().getAt(uploadRow.row)
	record.set("fileid", fileid);
	record.set("filename", filename);
	record.set("doctype", currentFileExt);
}


