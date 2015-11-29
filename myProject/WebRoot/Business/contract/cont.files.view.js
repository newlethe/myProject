//var arrUploadfields = new Array();
var zlTreeBean = "com.sgepit.pmis.document.hbm.ZlTree";
var zlInfoBean = "com.sgepit.frame.flow.hbm.ZlInfo"
//var gridPanelTitle = "合同：" + selectedConName + "，编号：" + selectedConNo + "，所有附件信息";
var gridPanelTitle = "合同：" + selectedConName + "，编号：" + selectedConNo + "，所有附件信息";
var dsParams = "";
var BillState = new Array();
var formWin, uploadWin, queryWin;
var INDEXID = '-1', INFOID = '-1';
var currentPid = CURRENTAPPID;
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
	
	//让每个人都能看到一样的合同附件信息
//	if (USERORGID){
//		baseDao.findByWhere2(zlTreeBean, "orgid='"+USERORGID+"'", function(list){
//			if(list.length > 0) {
//				INDEXID = list[0].indexid;
			dsParams = "modtabid='"+selectedConId+"'";
		   if(checkOut == 'check'){
		      dsParams += "  and billstate in ('1','2','3','4')"
		    }
//			}
//		});
//	}else{  //让没有岗位的人也能看到附件信息
//		dsParams = " (billstate=2 or billstate=3) and modtabid='"+selectedConId+"'";
//	}

	DWREngine.setAsync(true);
	

	var dsdeptname = new Ext.data.SimpleStore({
		fields: ['k', 'v'],
		data: BillState
	});
	
	var titleBar = new Ext.Button({
		text: '<font color=#15428b><b>&nbsp;'+gridPanelTitle+'</b></font>',
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
			// allowBlank: false,
			anchor: '95%'
		}, 'indexid': {
			name : 'indexid',
			fieldLabel : '分类条件',
			readOnly : true,
			mode: 'local',
			//hidden : true,
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
			// allowBlank: false,
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
		}, 'billstate' : {
			name : 'billstate',
			fieldLabel : '状态',
			anchor : '95%'
		},'weavecompany' : {
		   name : 'weavecompany',
		   fieldLabel : '编制人/单位',
		   allowBlank : false,
		   anchor : '95%'
		},'quantity' : {
		   name : 'quantity',
		   fieldLabel : '张/本/页',
		   allowBlank : true,
		   anchor : '95%'
		}, 'portion': {
			name: 'portion',
			fieldLabel: '每份页数',
			allowBlank: false,
			hidden :  true,
			hideLabel : true,
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
			// allowNegative: false,
			// maxValue: 100000000,
			anchor: '95%'
		}, 'filename': {
			name: 'filename',
			fieldLabel: '附件文件名称',
			anchor: '95%'
		}, 'filelsh': {
			name: 'filelsh',
			fieldLabel: '电子文档',
			anchor: '95%'
		}, 'infgrade': {
			name: 'infgrade',
			fieldLabel: '资料电子文档密级',
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
		}, '备注' : {
		    name : 'remark',
		    fieldLabel : '备注',
		    anchor : '95%'
		}
	}
	
	var sm = new Ext.grid.CheckboxSelectionModel();
	
	var cm = new Ext.grid.ColumnModel([
//		sm, 
			{
			id: 'infoid',
			header: fc['infoid'].fieldLabel,
			dataIndex: fc['infoid'].name,
			hidden: true
		}, {
			id: 'pid',
			header: fc['pid'].fieldLabel,
			dataIndex: fc['pid'].name,
			hidden: true
		}, {
			id: 'orgid',
			header: fc['orgid'].fieldLabel,
			dataIndex: fc['orgid'].name,
			hidden: true,
			renderer: partbRender
		}, {
			id: 'fileno',
			header: fc['fileno'].fieldLabel,
			dataIndex: fc['fileno'].name,
			width: 200,
			align: 'center'
		}, {
			id: 'materialname',
			header: fc['materialname'].fieldLabel,
			dataIndex: fc['materialname'].name,
            renderer:function(v){
                return "<div title='"+v+"'>"+v+"</div>";
            },
			width: 240
		}, {
			id: 'stockdate',
			header: fc['stockdate'].fieldLabel,
			dataIndex: fc['stockdate'].name,
			width: 100,
			renderer: formatDate
		}, {
			id: 'filelsh',
			header: fc['filelsh'].fieldLabel,
			dataIndex: fc['filelsh'].name,
			width: 120,
			renderer: fileicon
		}, {
			id: 'responpeople',
			header: fc['responpeople'].fieldLabel,
			dataIndex: fc['responpeople'].name,
			align: 'center',
			hidden: true,
			width: 40
		}, {
			id: 'indexid',
			header: fc['indexid'].fieldLabel,
			dataIndex: fc['indexid'].name,
			hidden: true
		}, {
			id: 'portion',
			header: fc['portion'].fieldLabel,
			dataIndex: fc['portion'].name,
			hidden: true,
			width: 50
		}, {
			id: 'billstate',
			header: fc['billstate'].fieldLabel,
			dataIndex: fc['billstate'].name,
			width: 80,
			renderer: function(value) {
				if (value == 0) {
					return '未移交';
				} else if (value == 1) {
					return '申请移交';
				} else if (value == 2) {
					return '已入库';
				} else if (value == 3) {
					return '已归档';
				}
			}
		}, {
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
		{name: 'weavecompany', type: 'string'}, //编制人/单位
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
//		sm: sm,
//		tbar: [/*titleBar*/],
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
	
	ds.load({
		params: {
			start: 0,
			limit: PAGE_SIZE
		}
	});
	
	if (INDEXID == '-1'){
		addAdjunct.setDisabled(true); 
		editAdjunct.setDisabled(true);
	}
	
//	grid.on('celldblclick', function(grid, rowIndex, columnIndex){
//		var record = grid.getStore().getAt(rowIndex);
//		doEditAdjunct();
//	});
	
	var comboxWithTree = new fm.ComboBox(fc['indexid']);
	
	comboxWithTree.on('expand', function(){
		newtreePanel.render('tree');
	});
	
/*	new treePanel.on('click', function(node){
		if ("" != node.attributes.mc && "1" == node.attributes.isleaf){
			comboxWithTree.setValue(node.attributes.indexid);
			comboxWithTree.collapse();
		}
	});
	*/
	var adjunctForm = new Ext.form.FormPanel({
        border: false, autoScroll: true,
		bodyStyle: 'padding: 5px 10px; border:0px;',
		labelAlign: 'top', layout: 'form',
	 	items: [
    		new Ext.form.FieldSet({
    			title: '必填项', width: 720,
                layout: 'column',
                items:[
                	{
						layout: 'form', columnWidth: .25,
						bodyStyle: 'border: 0px;',
						items:[
							new fm.ComboBox({
			            		name: 'zltype',
								fieldLabel: '资料类型', emptyText : '请选择...',
								typeAhead: true, allowBlank : false,
								valueField: 'k', displayField: 'v',
								mode: 'local', triggerAction: 'all',
					            store: new Ext.data.SimpleStore({
					            	data: [['1','图纸'],['2','合同'],['3','资料']],
					            	fields: ['k', 'v']
					            }),
					            lazyRender: true, editable: false,
					            listClass: 'x-combo-list-small',
								anchor: '95%'
			            	}),
			            	new fm.TextField(fc['weavecompany'])
						]
					},{
						layout: 'form', columnWidth: .25,
						bodyStyle: 'border: 0px;',
						items:[
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
			            	}),
			            	new fm.NumberField(fc['portion'])
			            	
	    				]
	    			},{
						layout: 'form', columnWidth: .25,
						bodyStyle: 'border: 0px;',
						items:[
							comboxWithTree,
							//hidden
			            	new fm.TextField(fc['infoid'])
	    				]
	    			},{
						layout: 'form', columnWidth: .25,
						bodyStyle: 'border: 0px;',
						items:[
							new fm.TextField(fc['materialname']),
	    					//hidden
	    					new fm.TextField(fc['orgid'])
	    				]
	    			}
    			]
    		}),	
    		new Ext.form.FieldSet({
    			title: '其它', width: 720,
                layout: 'column',
                items:[
                	{
						layout: 'form', columnWidth: .25,
						bodyStyle: 'border: 0px;',
						items:[
							new fm.TextField(fc['fileno']),
							new fm.NumberField(fc['quantity'])
						]
					},{
						layout: 'form', columnWidth: .25,
						bodyStyle: 'border: 0px;',
						items:[
							new fm.TextField(fc['responpeople']),
							new fm.TextField(fc['billstate'])
	    				]
	    			},{
						layout: 'form', columnWidth: .25,
						bodyStyle: 'border: 0px;',
						items:[
							new fm.DateField(fc['rkrq']),
							//hidden
							new fm.TextField(fc['pid'])
	    				]
	    			},{
						layout: 'form', columnWidth: .25,
						bodyStyle: 'border: 0px;',
						items:[
	    					new fm.DateField(fc['stockdate']),
	    					//hidden
	    					new fm.TextField(fc['modtabid'])
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
		bodyStyle: 'padding: 20px 20px;',
		url: "/wbf/servlet/FlwServlet?ac=extUpload",
		autoScroll: true,
		labelAlign: 'right',
		bbar: ['->', {
			id: 'uploadBtn',
			text: '上传附件',
			iconCls: 'upload',
			disabled: true,
			handler: function(){
				fileForm.getForm().submit({
					waitTitle: 'Please waiting...',
					waitMsg: 'Upload data...',
					success: function(form, action){
						var infos = action.result.fileinfo.split(',');
						var fileid = infos[0].split(':')[0]; 
						var filename = infos[0].split(':')[1];
						Ext.Msg.show({
							title: '提示',
							msg: action.result.msg,
							icon: Ext.Msg.INFO,
							buttons: Ext.Msg.OK,
							fn: function(value){
								if('ok' == value){
									uploadWin.hide();
									adjunctForm.getForm().findField('filelsh').setValue(fileid);
									adjunctForm.getForm().findField('filename').setValue(filename);
								}
							}
						});
					},
					failure: function(form, action){
						Ext.Msg.show({
							title: '提示',
							msg: action.result.msg,
							icon: Ext.Msg.ERROR,
							buttons: Ext.Msg.OK,
							fn: function(value){
								if('ok' == value){
									uploadWin.hide();
								}
							}
						});
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
			if(NTKOWAY&&NTKOWAY!=null&&NTKOWAY==1){
				var type="common";
				var filename;
				var suffix;
				var sql="select fileid,mimetype,filename from  APP_FILEINFO where fileid='"+value+"'";
				DWREngine.setAsync(false);
		        db2Json.selectData(sql, function (jsonData) {
			    var list = eval(jsonData);
			    if(list!=null&&list&&list[0]){
			   	 	type=list[0].mimetype;
			   	 	filename=list[0].filename;
			      }  
			     });
			    DWREngine.setAsync(true);
			    var downloadStr="下载";
			    if(filename){
				    var index=filename.lastIndexOf(".");
				    suffix=filename.substring(index+1,filename.length);			    
			    }
			    if(suffix=="doc"||suffix=="xls"||suffix=="ppt"||suffix=="docx"||suffix=="xlsx"||suffix=="pptx"||
                "application/msword"==type||"application/vnd.openxmlformats-officedocument.wordprocessingml.document"==type){
			    	//downloadStr="<img src='" + BASE_PATH+ "jsp/res/images/word.gif'></img>";
                    downloadStr = "打开";
					return '<center><a href="javascript:showUploadWin( \''+ value+ '\')">'
													+ downloadStr + '</a></center>';		
			    }else{
					return "<center><a href='" + BASE_PATH
                            + "servlet/BlobCrossDomainServlet?ac=appfile&fileid="
							+ value + "&pid=" + CURRENTAPPID+"'>下载</a></center>";          	  	
		   			 }					
			}else{
//              return "<center><a href='" + BASE_PATH
//                      + "servlet/MainServlet?ac=downloadFile&action=downloadfile&fileid="
//                      + value + "'><img src='" + BASE_PATH
//                      + "jsp/res/images/word.gif'></img></a></center>";   
                //将合同模块附件打开方式修改为跨域文件下载
                return '<center><a href="javascript:downloadFile(\''+value+'\')"><img src="' + BASE_PATH
                        + 'jsp/res/images/word.gif"></img></a></center>';   				
			}
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
			findField("indexid").setValue(INDEXID);
			findField("pid").setValue(currentPid);
			findField("responpeople").setValue(username);
	        findField("billstate").setValue('2');
	        findField("orgid").setValue(USERORGID);
	        findField("modtabid").setValue(selectedConId);
		}
	}
	
	function showFormWin(){
		if (!formWin){
			formWin = new Ext.Window({
				title: '合同附件',
				layout: 'fit', closeAction: 'hide', iconCls: 'word', 
				maximizable: false, closable: true,
				resizable: false, modal: true, border: true,
				width: 755, height: 522,
				items: [adjunctForm]
			});	
		}
		formWin.show('deactivate',function(){
		   this.setZIndex(111);
		});
	}
//	formWin = new Ext.Window({
//				title: '合同附件',
//				layout: 'fit', closeAction: 'hide', iconCls: 'word', 
//				maximizable: false, closable: true,
//				resizable: false, modal: true, border: true,
//				width: 755, height: 522,
//				items: [adjunctForm]
//			});	
//			formWin.show();
	function doAddAdjunct(){
		showFormWin();
		formWin.setTitle('合同附件新增');
		refreshForm();
		INFOID = '-1';
	}
	
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
					formWin.setTitle('合同附件修改');
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
							Ext.example.msg('删除成功！', '您成功删除了('+ids.length+')条合同附件信息！');
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
				width: 450, height: 230,
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
		if (fileForm.items) fileForm.items.removeAt(0);
		fileForm.insert(1, {
			xtype: 'fileuploadfield',
			name: INFOID,
			hideLabel: true,
			width: 250,
			buttonText: '<div><img src="jsp/res/images/word.gif" align="absmiddle">&nbsp;&nbsp;浏览...</div>',
			listeners: {
				'fileselected': function(fup, v){
					Ext.getCmp('uploadBtn').setDisabled(false);
				}
			}
		});
		uploadWin = new Ext.Window({
			title: '合同附件上传',
			layout: 'fit', closeAction: 'hide', iconCls: 'upload', 
			maximizable: false, closable: true,
			resizable: false, modal: true, border: false,
			width: 300, height: 125,
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
	    if (val){alert(strSql)
	    	with(ds){
	    		baseParams.params = strSql;
	    		load({
   					params : {
						start : 0,
						limit : PAGE_SIZE
					},
   					callback: function(){ /*queryWin.hide();*/ }
   				});
	    	}
	    }
    }
	
//	function checkFileFormat(filename){
//		var _filename = filename.split('\\')[filename.split('\\').length-1];
//		return (_filename.indexOf('.doc') != -1) ? true : true;		//文件格式不做限制
//	}
	
});
function showUploadWin(fileid){
//	var aw = 1024,ah = 768;
//	var type="";
//	try{
//		ah = screen.availHeight;
//		aw = screen.availWidth;
//	}catch(e){}
//	var fileUploadUrl = CONTEXT_PATH
//		+ "/Business/contract/office/openNtkoOffice.jsp?fileid="+fileid;
//	window.showModalDialog(fileUploadUrl,"合同附件","dialogWidth:"+aw+"px;dialogHeight:"+ah+"px;status:no;center:yes;" +
//				"resizable:yes;Minimize:yes;Maximize:yes");		
    //使用新的统一的在线打开的文件，此处使用appfile  zhangh 2013-11-25
    var docUrl = BASE_PATH + "jsp/common/open.file.online.jsp" +
                    "?fileid="+fileid+"" +
                    "&filetype=appfile" +
                    "&ModuleLVL="+ModuleLVL;
    window.showModalDialog(docUrl,"","dialogWidth:"
        + screen.availWidth + "px;dialogHeight:"
        + screen.availHeight + "px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
}

//跨域文件下载
/**
 * 合同模块为单附件上传模式。
 * <pre>
 * BlobCrossDomainServlet参数说明
 * ac        appfile 针对单附件上传模块配置，对应大对象表APP_BLOB
 *           sgccfile 针对多附件上传模式配置，对应大对象表SGCC_ATTACH_BLOB
 * fileid    大对象流水号
 * pid       项目单位PID
 * </pre>
 */
function downloadFile(val){
    var openUrl = CONTEXT_PATH + "/servlet/BlobCrossDomainServlet?ac=appfile&fileid=" + val + "&pid=" + CURRENTAPPID;
	Ext.Ajax.request({
		method : 'post',
		url : openUrl,
		success : function(result, request) {
			if (result.responseText && result.responseText.indexOf("msg:")>0){
				alert(eval("("+result.responseText+")").msg);
			} else {
				document.all.formAc.action = openUrl;
				document.all.formAc.submit();
			}
		},
		failure : function(result, request) {
			document.all.formAc.action = openUrl;
			document.all.formAc.submit();
		}
	});
	
}

