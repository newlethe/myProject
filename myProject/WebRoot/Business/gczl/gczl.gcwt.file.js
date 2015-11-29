var zlTreeBean = "com.sgepit.pmis.document.hbm.ZlTree";
var zlInfoBean = "com.sgepit.frame.flow.hbm.ZlInfo"
var gridPanelTitle = "";
var dsParams = "";
var BillState = new Array();
var formWin, uploadWin, queryWin;
var INDEXID = '-1', INFOID = '-1';

Ext.onReady(function(){
	
	DWREngine.setAsync(false);
	zlMgm.getdeptname(function(list) {
		for (i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].orgid);
			temp.push(list[i].orgname);
			BillState.push(temp);

		}
	});
	
	DWREngine.setAsync(true);
	
	var dsdeptname = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
		data: BillState
	});
	
	var titleBar = new Ext.Button({
		text: '<font color=#15428b><b>&nbsp;附件管理</b></font>',
		iconCls: 'word'
	})
	
	var addAdjunct = new Ext.Button({
		text: '新增',
		iconCls: 'add',
		handler: doAddAdjunct
	});
	
	var editAdjunct = new Ext.Button({
		text: '修改',
		iconCls: 'btn',
		handler: doEditAdjunct
	});
	
	var delAdjunct = new Ext.Button({
		text: '删除',
		iconCls: 'remove',
		handler: doDelAdjunct
	});
	
	var btnQuery = new Ext.Button({
		text: '查询',
		iconCls: 'option',
		handler: doQueryAdjunct
	});
	
	var fm = Ext.form;
	
	var fc = {
		'pid': {
			name: 'pid',
			fieldLabel: '工程项目编号',
			hidden: true,
			hideLabel: true,
			anchor: '95%'
		}, 'infoid': {
			name: 'infoid',
			fieldLabel: '主键',
			readOnly: true,
			hidden: true,
			hideLabel: true,
			anchor: '95%'
		}, 'indexid': {
			name : 'indexid',
			fieldLabel : '分类条件',
			readOnly : true,
			mode: 'local',
			editable: false,
			allowBlank: false,
            listWidth: 220,
            maxHeight: 200,
            triggerAction: 'all',
            store: new Ext.data.SimpleStore({fields: [], data: [[]]}),
			tpl: "<tpl for='.'><div style='height: 200px'><div id='tree'></div></div></tpl>",
            listClass: 'x-combo-list-small',
			anchor: '95%'
		}, 'fileno': {
			name: 'fileno',
			fieldLabel: '文件编号',
			anchor: '95%'
		}, 'responpeople': {
			name: 'responpeople',
			fieldLabel: '录入人',
			anchor: '95%'
		}, 'materialname': {
			name: 'materialname',
			fieldLabel: '文件材料题名',
			allowBlank: false,
			anchor: '95%'
		}, 'stockdate': {
			name: 'stockdate',
			fieldLabel: '文件日期',
			width: 45,
			format: 'Y-m-d',
			value: new Date(),
			anchor: '95%'
		}, 'quantity' : {
			name : 'quantity',
			fieldLabel : '每份数量',
			anchor : '95%'
		}, 'billstate' : {
			name : 'billstate',
			fieldLabel : '状态',
			anchor : '95%'
		}, 'weavecompany': {
			name: 'weavecompany',
			fieldLabel: '责任者',
			allowBlank: false,
			anchor: '95%'
		}, 'book': {
			name: 'book',
			fieldLabel: '单位',
			allowBlank: false,
			anchor: '95%'
		}, 'portion': {
			name: 'portion',
			fieldLabel: '份数',
			allowBlank: false,
			anchor: '95%'
		}, 'orgid': {
			name: 'orgid',
			fieldLabel: '部门名称',
			readOnly: true,
			valueField: 'k',
			displayField: 'v',
			mode: 'local',
			typeAhead: true,
			triggerAction: 'all',
			store: dsdeptname,
			lazyRender: true,
			hidden: true,
			hideLabel: true,
			listClass: 'x-combo-list-small',
			anchor: '95%'
		}, 'filename': {
			name: 'filename',
			fieldLabel: '附件文件名称',
			anchor: '95%'
		}, 'filelsh': {
			name: 'filelsh',
			fieldLabel: '电子文档',
			readOnly:true,
			anchor: '95%'
		}, 'infgrade': {
			name: 'infgrade',
			fieldLabel: '资料电子文档密级',
			anchor: '95%'
		}, 'remark': {
			name: 'remark',
			fieldLabel: '备注',
			hideLabel: true,
			height: 100,
			anchor: '95%'
		}, 'rkrq': {
			name: 'rkrq',
			fieldLabel: '入库日期',
			width: 45,
			format: 'Y-m-d',
			value: new Date(),
			anchor: '95%'
		}, 'zltype': {
			name: 'zltype',
			fieldLabel: '资料类型',
			allowBlank: false,
			anchor: '95%'
		}, 'modtabid': {
			name: 'modtabid',
			fieldLabel: '模块表主键',
			hidden: true,
			hideLabel: true,
			allowBlank: false,
			anchor: '95%'
		}
	}
	
	var sm = new Ext.grid.CheckboxSelectionModel();
	
	var cm = new Ext.grid.ColumnModel([
		sm, {
			id: 'infoid',
			header: fc['infoid'].fieldLabel,
			dataIndex: fc['infoid'].name,
			hidden: true
		}, {
			id: 'pid',
			header: fc['pid'].fieldLabel,
			dataIndex: fc['pid'].name,
			hidden: true
		},  {
			id: 'fileno',
			header: fc['fileno'].fieldLabel,
			dataIndex: fc['fileno'].name,
			width: 100,
			align: 'center'
		}, {
			id: 'materialname',
			header: fc['materialname'].fieldLabel,
			dataIndex: fc['materialname'].name,
			width: 240
		}, {
			id: 'stockdate',
			header: fc['stockdate'].fieldLabel,
			dataIndex: fc['stockdate'].name,
			width: 100,
			renderer: formatDate,hidden:true
		}, {
			id: 'weavecompany',
			header: fc['weavecompany'].fieldLabel,
			dataIndex: fc['weavecompany'].name,
			width: 100
		}, {
			id: 'quantity',
			header: fc['quantity'].fieldLabel,
			dataIndex: fc['quantity'].name,
			width: 80,hidden:true
		}, {
			id: 'portion',
			header: fc['portion'].fieldLabel,
			dataIndex: fc['portion'].name,
			width: 50,hidden:true
		},  {
			id: 'responpeople',
			header: fc['responpeople'].fieldLabel,
			dataIndex: fc['responpeople'].name,
			align: 'center',
			hidden: true,
			width: 40
		},  {
			id: 'remark',
			header: fc['remark'].fieldLabel,
			dataIndex: fc['remark'].name,
			width: 100,
			align: 'center'
		}, {
			id: 'filelsh',
			header: fc['filelsh'].fieldLabel,
			dataIndex: fc['filelsh'].name,
			width: 120,
			renderer: fileicon
		},  {
			id: 'modtabid',
			header: fc['modtabid'].fieldLabel,
			dataIndex: fc['modtabid'].name,
			hidden: true
		}
	]);
	cm.defaultSortable = true;
	
	var Columns = [
		{name: 'infoid', type: 'string'},
		{name: 'pid', type: 'string'}, 
		{name: 'fileno', type: 'string'}, 
		{name: 'filelsh', type: 'string'}, 
		{name: 'materialname', type: 'string'}, 
		{name: 'indexid', type: 'string'}, 
		{name: 'remark', type: 'string'}, 
		{name: 'stockdate', type: 'date', dateFormat: 'Y-m-d H:i:s'}, 
		{name: 'quantity', type: 'float'}, 
		{name: 'responpeople', type: 'string'}, 
		{name: 'weavecompany', type: 'string'}, 
		{name: 'book', type: 'float'}, 
		{name: 'portion', type: 'float'}, 
		{name: 'orgid', type: 'string'},
		{name: 'zltype', type: 'float'},
		{name: 'rkrq', type: 'date', dateFormat: 'Y-m-d H:i:s'},
		{name: 'billstate', type: 'float'},
		{name: 'filename', type: 'string'},
		{name: 'infgrade', type: 'float'},
		{name: 'modtabid', type: 'string'}
	];
	
	var ds = new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: zlInfoBean,
			business: 'baseMgm',
			method: 'findWhereOrderby',
			params: dsParams
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: 'infoid'
		}, Columns),

		remoteSort: true,
		pruneModifiedRecords: true
	});
	ds.setDefaultSort('filelsh', 'desc');
	
	var grid = new Ext.grid.GridPanel({
		id: 'adjunct-grid-panel',
		ds: ds,
		cm: cm,
		sm: sm,
		tbar: [titleBar, '->', addAdjunct, '-', editAdjunct, '-', delAdjunct, '-', btnQuery],
		border: false,
		header: false,
		autoScroll: true,
		stripeRows: true,
		loadMask: true,
		viewConfig: {
			forceFit: true,
			ignoreAdd: true
		},
		bbar: new Ext.PagingToolbar({
			pageSize: PAGE_SIZE,
			store: ds,
			displayInfo: true,
			displayMsg: ' {0} - {1} / {2}',
			emptyMsg: "无记录。"
		})
	});
	
	
	var viewport = new Ext.Viewport({
		border: false,
		layout: 'fit',
		items: [grid]
	});
	
	dsParams = " modtabid='"+selectedxmbh+"'";
	ds.baseParams.params = dsParams;
	ds.load({
		params: {
			start: 0,
			limit: PAGE_SIZE
		}
	});		
	
	
	grid.on('celldblclick', function(grid, rowIndex, columnIndex){
		var record = grid.getStore().getAt(rowIndex);
		doEditAdjunct();
	});
	
	
	var adjunctForm = new Ext.form.FormPanel({
        border: false, autoScroll: true,
		bodyStyle: 'padding: 5px 10px; border:0px;',
		labelAlign: 'top', layout: 'form',
	 	items: [
    		new Ext.form.FieldSet({
    			title: '必填项', width: 720,
                layout: 'column',hidden:true,
                items:[
                	{
						layout: 'form', columnWidth: .25,
						bodyStyle: 'border: 0px;',
						items:[
			            	new fm.TextField(fc['infoid'])
	    				]
	    			},{
						layout: 'form', columnWidth: .25,
						bodyStyle: 'border: 0px;',
						items:[
							new fm.NumberField(fc['quantity']),
	    					new fm.TextField(fc['orgid'])
	    				]
	    			}
    			]
    		}),	
    		new Ext.form.FieldSet({
    			title: '文件信息', width: 720,
                layout: 'column',
                items:[
                	{
						layout: 'form', columnWidth: .25,
						bodyStyle: 'border: 0px;',
						items:[
							new fm.TextField(fc['fileno']),
							new fm.TextField(fc['materialname'])
						]
					},{
						layout: 'form', columnWidth: .25,
						bodyStyle: 'border: 0px;',
						items:[
							new fm.TextField(fc['responpeople']),
							new fm.TextField(fc['weavecompany'])
	    				]
	    			},{
						layout: 'form', columnWidth: .25,
						bodyStyle: 'border: 0px;',
						items:[
	    					new fm.DateField(fc['stockdate']),
	    					//hidden
	    					new fm.TextField(fc['modtabid']),
	    					new fm.TextField(fc['pid'])
	    				]
	    			}
    			]
    		}), {
    			layout: 'column', border: false, width: 720,
    			items: [
    				{
						layout: 'column', columnWidth: .37, bodyStyle: 'border: 0px;',
						items:[
							new Ext.form.FieldSet({
								title: '文件内容',
								layout: 'column', width: 250,
								items: [
									{
										layout: 'form', columnWidth: .85,
										bodyStyle: 'padding: 5px 10px; border: 0px;',
										items:[
											new fm.TextField(fc['filelsh']),
											new fm.TextField(fc['filename'])
										]
									},{
										layout: 'form', columnWidth: .15,
										bodyStyle: 'border: 0px; padding: 25px 5px;',
										items:[
											new Ext.Button({iconCls: 'upload-icon', tooltip: '上传附件', handler: upload})
										]
									}
								]
							})
						]
					},{
						layout: 'form', columnWidth: .63, bodyStyle: 'border: 0px;',
						items:[
							new Ext.form.FieldSet({
								title: '备注',
								layout: 'form', height: 135,
								items: [
									new fm.TextArea(fc['remark'])
								]
							})
						]
					}
    			]
    		}
    	],
    	buttons: [{
			id: 'save',
            text: '保存',
            handler: formSave
        },{
			id: 'cancel',
            text: '取消',
            handler: function(){
            	formWin.hide();
            }
        }]
	});
	
	var fileForm = new Ext.FormPanel({
		fileUpload: true,
		header: false, 
		border: false,
		url: MAIN_SERVLET+"?ac=upload",   
	  	fileUpload: true,
		bodyStyle: 'padding: 20px 20px;',
		//url: "/wbf/servlet/FlwServlet?ac=extUpload",
		autoScroll: true,
		labelAlign: 'right',
		bbar: ['->', {
			id: 'uploadBtn',
			text: '上传附件',
			iconCls: 'upload',
			//disabled: true,
			handler: function(){
				var filename = fileForm.form.findField("filename1").getValue()
				fileForm.getForm().submit({
					method: 'POST',
	          		params:{ac:'upload'},
					waitTitle: '请等待...',
					waitMsg: '上传中...',
					success: function(form, action){
						tip = Ext.QuickTips.getQuickTip();
						tip.setTitle('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上传成功!', 'icon-success')
						tip.show();
						Ext.MessageBox.hide();
			            uploadWin.hide();
						var infos = action.result.msg;
						var fileid = infos[0].fileid; 
						var filename = infos[0].filename;
						adjunctForm.getForm().findField('filelsh').setValue(fileid);
						adjunctForm.getForm().findField('filename').setValue(filename);
						adjunctForm.getForm().findField('materialname').setValue(filename)
					},
					failure: function(form, action){
						Ext.Msg.alert('Error', 'File upload failure.'); 
					}
				})
			}
		}]
	});
	
	var queryPanel = new Ext.form.FormPanel({
        border: false, autoScroll: true,
		bodyStyle: 'padding: 10px 10px; border:0px;',
		labelAlign: 'right', layout: 'form',
	 	items: [
	 		new Ext.form.FieldSet({
	 			title: '关键字',
	 			layout: 'form',
	 			border: true,
	 			items: [
	 				new fm.TextField(fc['fileno']),
	 				new fm.TextField(fc['materialname']),
	 				new fm.ComboBox({
	            		name: 'book',
						fieldLabel: '单位', emptyText : '请选择...',
						typeAhead: true, allowBlank : false, 
						valueField: 'k', displayField: 'v',
						mode: 'local', triggerAction: 'all',
			            store: new Ext.data.SimpleStore({
			            	data: [['1','碟'],['2','张'],['3','页']],
			            	fields: ['k', 'v']
			            }),
			            lazyRender: true, editable: false,
			            listClass: 'x-combo-list-small',
						anchor: '95%'
	            	}),{
	            		border: false, layout: 'column',
	            		items: [
	            			{
		            			layout: 'form', columnWidth: .6, bodyStyle: 'border: 0px;',
		            			items: [
		            				new Ext.form.DateField({
										id: 'stockdate'+'_begin',
										fieldLabel: '文件日期', width: 120,
										format: 'Y-m-d', minValue: '2000-01-01', emptyText: '开始时间'
									})
		            			]
		            		},{
		            			layout: 'form', columnWidth: .4, bodyStyle: 'border: 0px; padding: 0px 16px;',
		            			items: [
									new Ext.form.DateField({
										id: 'stockdate'+'_end',
										hideLabel: true, width: 125,
										format: 'Y-m-d', minValue: '2000-01-01', emptyText: '结束时间'
									})
		            			]
		            		}
	            		]
	            	}
				]
	 		})
	 	],
	 	bbar: ['->',{
			id: 'query',
			text: '查询',
			tooltip: '查询',
			iconCls: 'btn',
			handler: execQuery
		},'-']
	});
	
	function fileicon(value) {
		if (value != '') {
			return "<center><a href='" + BASE_PATH
					+ "servlet/MainServlet?ac=downloadFile&action=downloadfile&fileid="
					+ value + "'><img src='" + BASE_PATH
					+ "jsp/res/images/word.gif'></img></a></center>";
		} else {

		}
	}
	
	function partbRender(value) {
		var str = '';
		for (var i = 0; i < BillState.length; i++) {
			if (BillState[i][0] == value) {
				str = BillState[i][1]
				break;
			}
		}
		return str;
	}
	
	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	}
	
	function refreshForm(){
		with (adjunctForm.getForm()){
			reset();
			findField("pid").setValue(PID);
			findField("responpeople").setValue(username);
			findField("weavecompany").setValue(username);
	        findField("orgid").setValue(USERUNITID);
	        findField("modtabid").setValue(selectedxmbh);
	        findField("fileno").setValue(selectedxmbh);
		}
	}
	
	function showFormWin(){
		if (!formWin){
			formWin = new Ext.Window({
				title: '附件',
				layout: 'fit', closeAction: 'hide', iconCls: 'word', 
				maximizable: false, closable: true,
				resizable: false, modal: true, border: true,
				width: 755, height: 422,
				items: [adjunctForm]
			});	
		}
		formWin.show();
	}
	
	function doAddAdjunct(){
		showFormWin();
		formWin.setTitle('附件新增');
		refreshForm();
		INFOID = '-1';
	}
	

	var v_node="";
	
	function doEditAdjunct(){
		if (sm.getSelected()){
			if (sm.getSelections().length > 1){
				Ext.Msg.show({
					title: '警告',
					msg: '请选择一条数据进行修改！',
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.WARNING
				});
				return;
			}
			var _id = sm.getSelected().get('infoid');
			baseMgm.findById(zlInfoBean, _id, function(obj){
				if (obj) {
					showFormWin();
					formWin.setTitle('附件修改');
					adjunctForm.getForm().reset();
    				var AdjunctRecord = Ext.data.Record.create(Columns);
					var record = new AdjunctRecord(obj);
					adjunctForm.getForm().loadRecord(record);
					INFOID = obj.infoid;
				} else {
					Ext.Msg.show({
    					title: '记录不存在！',
    					msg: '未找到需要修改的记录，请刷新后再试！',
    					buttons: Ext.MessageBox.OK,
    					icon: Ext.MessageBox.WARNING
    				});
				}
			})
		}
	}
	
	function doDelAdjunct(){
		var records = sm.getSelections();
		var ids = new Array();
		if (records.length > 0) {
			for (var i = 0; i < records.length; i++) {
				ids.push(records[i].get('infoid'));
			}
		}
		if (ids.length > 0){
    		Ext.Msg.show({
				title: '提示',
				msg: '您确定要删除吗?　　　',
				buttons: Ext.Msg.YESNO,
				icon: Ext.Msg.QUESTION,
				fn: function(value){
					if ("yes" == value){
						Ext.get('loading-mask').show();
						Ext.get('loading').show();
						zlMgm.deleteinfo(ids, function(){
							Ext.get('loading-mask').hide();
							Ext.get('loading').hide();
							Ext.example.msg('删除成功！', '您成功删除了('+ids.length+')条附件信息！');
							ds.baseParams.params = dsParams;
							ds.load({
								params: {
									start: 0,
									limit: PAGE_SIZE
								}
							});
							if (ds.getCount() > 0)
					    		sm.selectRow(0);
						});
					}
				}
    		});
		}
	}
	
	function doQueryAdjunct(){
		if (!queryWin) {
			queryWin = new Ext.Window({
				title: '查询数据',
				width: 450, height: 240,
				layout: 'fit',
				iconCls: 'option',
				closeAction: 'hide',
				border: true,
				constrain: true,
				maximizable: false,
				resizable: false,
				modal: false,
				items: [queryPanel]
			});
		}
		queryPanel.getForm().reset();
		queryWin.show();
	}
	
	function upload(){
		if (fileForm.items) 
			fileForm.items.removeAt(0);
			fileForm.insert({   
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
		  });
		uploadWin = new Ext.Window({
			title: '附件上传',
			layout: 'fit', closeAction: 'hide', iconCls: 'upload', 
			maximizable: false, closable: true,
			resizable: false, modal: true, border: false,
			width: 380, height: 130,
			items: [fileForm]
		});
		uploadWin.show();
	}
	
	function formSave() {
		var form = adjunctForm.getForm();
		if (form.isValid()) {
			doFormSave(true)	
		} else {
			Ext.example.msg('提示', '请填写必填项！');
		}
	}

	function doFormSave(dataArr){
    	var form = adjunctForm.getForm()
    	var obj = form.getValues()
    	for(var i=0; i<Columns.length; i++) {
    		var n = Columns[i].name;
    		var field = form.findField(n);
    		if (field) {
    			obj[n] = field.getValue();
    		}
    	}
    	DWREngine.setAsync(false);
    	if (obj.infoid == '' || obj.infoid == null){
	   		zlMgm.insertzlinfo(obj, function(){
   				Ext.example.msg('保存成功！', '您成功新增了一条信息！');
   				Ext.Msg.show({
				   title: '提示',
				   msg: '是否继续新增?　　　　',
				   buttons: Ext.Msg.YESNO,
				   fn: processResult,
				   icon: Ext.MessageBox.QUESTION
				});
	   		});
   		}else{
   			zlMgm.updatezlinfo(obj, function(){
   				Ext.example.msg('保存成功！', '您成功修改了一条信息！');
   				formWin.hide();
   				ds.baseParams.params = dsParams;
				ds.load({
					params : {
						start : 0,
						limit : PAGE_SIZE
					}
				});
	   		});
   		}
   		DWREngine.setAsync(true);
    }
    
    function processResult(value){
    	'yes' == value ? refreshForm() : formWin.hide();
    	ds.baseParams.params = dsParams;
    	ds.load({
			params: {
				start: 0,
				limit: PAGE_SIZE
			}
		});
    }
    
    function execQuery(){
    	var val = true;
    	var strSql = dsParams;
    	var form = queryPanel.getForm();
    	var fileno = form.findField('fileno').getValue();
    	var materialname = form.findField('materialname').getValue();
    	var book = form.findField('book').getValue();
    	var stockdate_begin = form.findField('stockdate_begin').getValue();
    	var stockdate_end = form.findField('stockdate_end').getValue();
    	if (fileno != '' && fileno != null){
    		strSql += " and fileno like '%"+fileno+"%'";
    	}
    	if (materialname != '' && materialname != null){
    		strSql += " and materialname like '%"+materialname+"%'";
    	}
    	if (book != '' && book != null){
    		strSql += " and book like '%"+fileno+"%'";
    	}
    	if (fileno != '' && fileno != null){
    		strSql += " and fileno='"+fileno+"'";
    	}
    	if('' == stockdate_begin && '' != stockdate_end){
   			strSql += " and ( stockdate" + " <= to_date('" + formatDate(stockdate_end) + "','YYYY-MM-DD'))";
   		} else if ('' != stockdate_begin && "" == stockdate_end){
	   		strSql += " and ( stockdate" + " >= to_date('" + formatDate(stockdate_begin) + "','YYYY-MM-DD'))";
	   	} else if ('' != stockdate_begin && '' != stockdate_end){
			if (stockdate_begin > stockdate_end){
				Ext.example.msg('提示！','开始时间应该小于等于结束时间！');
				val = false; 
			} else {
				strSql += " and ( stockdate"
						+ " between to_date('" + formatDate(stockdate_begin) + "','YYYY-MM-DD')" 
						+ " and to_date('" + formatDate(stockdate_end)+ "','YYYY-MM-DD'))"; 
				
			}
	    }
	    if (val){ 
	    	with(ds){
	    		baseParams.params = strSql;
	    		load({
   					params : {
						start : 0,
						limit : PAGE_SIZE
					},
   					callback: function(){  }
   				});
	    	}
	    }
    }
	
	
});