var treePanel, treeLoader, contentPanel;
var root, saveBtn;
var treePanelTitle = "检验项目结构维护";
var rootText = "验评标准树";
var tempNode = null; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量
var queryBdgid;
var checkBgdWin

var beanWord = "com.sgepit.frame.flow.hbm.GczlJymb"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = ""
var orderColumnWord = "mborder"

var beanFlow = "com.sgepit.frame.flow.hbm.GczlFlow"
//var business = "baseMgm"
//var listMethod = "findwhereorderby"
//var primaryKey = ""
var orderColumnFlow = "uids"

//选中节点后的相关参数
var thisNodeUids = 0;		//当前节点uids
var thisNodeBh = 0;			//当前节点编号
var thisHasChild = true;	//当前节点是否有子节点
var isRootNode = true;		//当前节点是否是跟节点


var selectWordRecord,selectWordUids;
var selectFlowRecord,selectFlowid;

//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"

Ext.onReady(function() {
	
	var thisRootUids;
	//判断当前登陆项目是否有质量验评树的更节点，没有则自动添加
	DWREngine.setAsync(false);
	gczlJyxmImpl.isHaveTreeRoot(CURRENTAPPID,rootText,function(str){
		thisRootUids = str;
	});
	DWREngine.setAsync(true);
	
	var userArr = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select userid,realname from rock_user where unitid='"+CURRENTAPPID+"' ",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			userArr.push(temp);
		}
    });
 	DWREngine.setAsync(true);
 	
 	var flowArr = new Array();
 	DWREngine.setAsync(false);
 	baseMgm.getData("select flowid,flowtitle from flw_definition t where isyp='1' and state='0'",function(list){  
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);
			temp.push(list[i][1]);
			flowArr.push(temp);
		}
    });
 	DWREngine.setAsync(true);

	root = new Ext.tree.AsyncTreeNode({
		text : rootText,
		iconCls : 'form',
		id : thisRootUids // 重要 : 展开第一个节点 !!
	})
	treeLoader = new Ext.tree.TreeLoader({
		url : MAIN_SERVLET,
		baseParams : {
			ac : "columntree",
			treeName : "gczlJyxmTree",
			businessName : "gczlMgmImpl",
			parent : CURRENTAPPID,
			pid : CURRENTAPPID
		},
		clearOnLoad : true,
		uiProviders : {
			'col' : Ext.tree.ColumnNodeUI
		}
	});

	treePanel = new Ext.tree.ColumnTree({
		id : 'budget-tree-panel',
		iconCls : 'icon-by-category',
		region : 'west',
		tbar : [],
		frame : false,
		header : false,
		border : false,
		lines : true,
		autoScroll : true,
		animate : false,
		width : 240,
		// header : true,
		// title : '质量验评分类',
		split : true,
		collapseMode : 'mini',
		collapsible : true,		//滑动展开，左右展开
		maxSize : 280,
		minSize : 200,
		columns : [{
			header : '检验项目名称',
			width : 450,
			dataIndex : 'xmmc'
		}],
		loader : treeLoader,
		root : root
	});

	treePanel.on('beforeload', function(node) {
		var uids = node.attributes.uids;
		if (uids == null)
			uids = thisRootUids;
		var baseParams = treePanel.loader.baseParams
		baseParams.parent = uids;
		baseParams.pid = CURRENTAPPID;
	})
	
	function toHandler() {
		//if (typeof(tempNode) == "undefined") {
		if(tempNode == null){
			Ext.Msg.show({
				title : '提示',
				msg : '请选择检验项目分类!',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
		} else {
			var isRoot = (rootText == tempNode.text);
			var nodeId = isRoot	? "1" : tempNode.attributes.xmbh;
			var uids = (tempNode == root) ? thisRootUids : tempNode.attributes.uids;
			var nodeId_xmbh = isRoot ? "1" : tempNode.attributes.xmbh;

			var loadFormRecord = null;
			var formRecord = Ext.data.Record.create(Columns);
			var thisNodeHasWordOrFlow = false;
			
			DWREngine.setAsync(false);
				gczlJyxmImpl.isHasWordOrFlow(uids,function(bool){
					if (bool) {
						thisNodeHasWordOrFlow = true
					}
				})
			DWREngine.setAsync(true);
			if ("新增" == this.text) {
				if(thisNodeHasWordOrFlow){
					Ext.Msg.show({
						title : '提示',
						msg : '该分类下有模板或流程，暂时不能再添加子分类!',
						buttons : Ext.Msg.OK,
						icon : Ext.MessageBox.ERROR
					});
					return;
				}else{
					treeFormWin.show(true);
					// 获取同一分类编码下最大的BM
					DWREngine.setAsync(false);
					var sql_maxbm = "select max(xmbh)+1 from gczl_jyxm where parentbh='"+ uids + "' and "+pidWhereString+" ";
					var xmbh_add = '';
					baseMgm.getData(sql_maxbm, function(list) {
						xmbh_add = list
					});
					DWREngine.setAsync(true);
					if (xmbh_add == "") {
						xmbh_add = nodeId_xmbh + "01";
					}
					loadFormRecord = new formRecord({
						uids : '',
						xmbh : xmbh_add,
						xmmc : '',
						isleaf : 1,
						parentbh : uids
					});
					formPanel.isNew = true
					formPanel.getForm().loadRecord(loadFormRecord);
				}
			} else if ("修改" == this.text) {
				treeFormWin.show(true);
				DWREngine.setAsync(false);
				baseMgm.findById(beanName, uids, function(obj) {
					loadFormRecord = new formRecord(obj);
				});
				DWREngine.setAsync(true);
				formPanel.isNew = false
				formPanel.getForm().loadRecord(loadFormRecord);
			} else {
				if(thisNodeHasWordOrFlow){
					Ext.Msg.show({
						title : '提示',
						msg : '该分类下有模板或流程，暂时不能删除!',
						buttons : Ext.Msg.OK,
						icon : Ext.MessageBox.ERROR
					});
					return;
				}else{
					delHandler(uids, tempNode);
					tempNode = null;
				}
			}
		}
	}

	function delHandler(uids, node) {
		// 如果存在子節點，則不執行
		if (thisHasChild) {
			Ext.Msg.show({
				title : '提示',
				msg : '父节点不能直接删除操作！',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return
		}
		Ext.Msg.show({
			title : '提示',
			msg : '是否删除' + node.attributes.xmmc + '[' + node.attributes.xmbh + ']',
			buttons : Ext.Msg.YESNO,
			icon : Ext.MessageBox.QUESTION,

			fn : function(value) {
				if ("yes" == value) {
					treePanel.getEl().mask("loading...");
					gczlJyxmImpl.deleteChildNode(uids, function(flag) {
						if ("0" == flag) {
							var formDelRecord = Ext.data.Record.create(Columns);
							var flag = (node.parentNode.childNodes.length == 1)
							var pNode = flag ? node.parentNode.parentNode : node.parentNode;

							var formRecord = Ext.data.Record.create(Columns);
							var emptyRecord = new formRecord({
								xmbh : '',
								xmmc : '',
								isleaf : 1,
								parentbh : ""
							});
							formPanel.getForm().loadRecord(emptyRecord);
							formPanel.getForm().clearInvalid();

							if (flag) {
								var xmbh = pNode.attributes.xmbh;
								var baseParams = treePanel.loader.baseParams
								baseParams.parent = xmbh;
							}
							treeLoader.load(pNode);
							pNode.expand();
							Ext.example.msg('删除成功！', '您成功删除了一条项目检验信息！');
						} else if(flag == "2"){
							Ext.Msg.show({
								title : '提示',
								msg : '该分类下有模板或流程，暂时不能删除!',
								buttons : Ext.Msg.OK,
								icon : Ext.MessageBox.ERROR
							});
						} else {
							Ext.Msg.show({
								title : '提示',
								msg : '数据删除失败！',
								buttons : Ext.Msg.OK,
								icon : Ext.MessageBox.ERROR
							});
						}
						treePanel.getEl().unmask();
					});
				}
			}
		});

	}

	treePanel.on('click', onClick);
	function onClick(node, e) {
		tempNode = node
		isRootNode = (rootText == tempNode.text);
		thisNodeBh= isRootNode	? "1" : tempNode.attributes.xmbh;
		thisNodeUids = isRootNode ? thisRootUids : tempNode.attributes.uids;
		DWREngine.setAsync(false);
		gczlJyxmImpl.isHasChilds(thisNodeUids, function(flag) {
			thisHasChild = flag == true ? true : false;
		})
		DWREngine.setAsync(true);
		selectWordRecord = null;
		selectWordUids = null;
		
		selectFlowRecord = null;
		selectFlowid = null;

		if(isRootNode){
			dsWord.baseParams.params = pidWhereString;
			dsFlow.baseParams.params = pidWhereString;
		}else{
			dsWord.baseParams.params = "jyxm_bh like '"+thisNodeBh+"%' and "+pidWhereString+" ";
			dsFlow.baseParams.params = "xmbh like '"+thisNodeBh+"%' and "+pidWhereString+" ";
		}
		dsWord.load({params : {	start : 0,limit : PAGE_SIZE}});
		dsFlow.load({params : {	start : 0,limit : PAGE_SIZE}});
	}

	var treeFormWin = new Ext.Window({
		id : 'tree-form-win',
		title : '质量验评模板分类管理',
		layout : 'fit',
		width : 300,
		height : 190,
		modal : true,
		plain : true,
		border : false,
		resizable : false,
		closeAction : 'hide',
		items : [formPanel]
	});

	// -------------------模板管理开始---------------------
	var fcWord = {
		'uids' : {name : 'uids',fieldLabel : 'UIDS',hidden : true,hideLabel : true},
		'pid' : {name : 'pid',fieldLabel : 'PID',hidden : true,hideLabel : true},
		'jyxmUids' : {name : 'jyxmUids',fieldLabel : '项目UIDS',hidden : true,hideLabel : true},
		'jyxmBh' : {name : 'jyxmBh',fieldLabel : '项目编号',hidden : true,hideLabel : true},
		'mbname' : {name : 'mbname',fieldLabel : '模板名称'},
		'remark' : {name : 'remark',fieldLabel : '备注说明'},
		'fileid' : {name : 'fileid',fieldLabel : '文件ID',hidden : true,hideLabel : true},
		'filesize' : {name : 'filesize',fieldLabel : '文件大小',hidden : true,hideLabel : true},
		'fileuser' : {name : 'fileuser',fieldLabel : '录入人'	,hidden : true,hideLabel : true},
		'filedate' : {name : 'filedate',fieldLabel : '录入时间',format : 'Y-m-d',hidden : true,hideLabel : true},
		'isdefault' : {name : 'isdefault',fieldLabel : '默认',hidden : true,hideLabel : true},
		'isstart' : {name : 'isstart',fieldLabel : '启用',hidden : true,hideLabel : true},
		'mborder' : {name : 'mborder',fieldLabel : '排序'}
	};
	var ColumnsWord = [
		{name : 'uids',type : 'string'},
		{name : 'pid',type : 'string'},
		{name : 'jyxmUids',type : 'string'},
		{name : 'jyxmBh',type : 'string'},
		{name : 'mbname',type : 'string'},
		{name : 'remark',type : 'string'},
		{name : 'fileid',type : 'string'},
		{name : 'filesize',type : 'float'},
		{name : 'fileuser',type : 'string'},
		{name : 'filedate',type : 'date',dateFormat : 'Y-m-d H:i:s'},
		{name : 'isdefault',type : 'float'},
		{name : 'isstart',type : 'float'},
		{name : 'mborder',type : 'float'}
	];

	var smWord = new Ext.grid.CheckboxSelectionModel({singleSelect : true});
	var cmWord = new Ext.grid.ColumnModel([
		smWord,
		{id : 'uids',header : fcWord['uids'].fieldLabel,dataIndex : fcWord['uids'].name,hidden : true},
		{id : 'pid',header : fcWord['pid'].fieldLabel,dataIndex : fcWord['pid'].name,hidden : true},
		{id : 'jyxmUids',header : fcWord['jyxmUids'].fieldLabel,dataIndex : fcWord['jyxmUids'].name,hidden : true},
		{id : 'jyxmBh',header : fcWord['jyxmBh'].fieldLabel,dataIndex : fcWord['jyxmBh'].name,hidden : true},
		{id : 'mbname',header : fcWord['mbname'].fieldLabel,dataIndex : fcWord['mbname'].name},
		{id : 'fileid',header : fcWord['fileid'].fieldLabel,dataIndex : fcWord['fileid'].name,hidden : true},
		{id : 'filesize',header : fcWord['filesize'].fieldLabel,dataIndex : fcWord['filesize'].name,width : 50,
			renderer : function(value){
				return value/1024+"<B>KB</B>";
			}
		},
		{id : 'fileuser',header : fcWord['fileuser'].fieldLabel,dataIndex : fcWord['fileuser'].name,width : 50,
			renderer:function(value){
				for(var i=0;i<userArr.length;i++){
					if(userArr[i][0]==value){
						return user = userArr[i][1];
					}
				}
			}
		},
		{id : 'filedate',header : fcWord['filedate'].fieldLabel,dataIndex : fcWord['filedate'].name,width : 50,
			renderer : formatDate
		},
		{id : 'remark',header : fcWord['remark'].fieldLabel,dataIndex : fcWord['remark'].name},
		{id : 'isdefault',header : fcWord['isdefault'].fieldLabel,dataIndex : fcWord['isdefault'].name,width : 40,
			renderer : function(value){
				return value=='1'?'默认':'';
			}
		},
		{id : 'isstart',header : fcWord['isstart'].fieldLabel,dataIndex : fcWord['isstart'].name,width : 40,
			renderer : function(value){
				return value=='1'?'启用':'<font color=red>禁用</font>';
			}
		},
		{id : 'mborder',header : fcWord['mborder'].fieldLabel,dataIndex : fcWord['mborder'].name,width : 40}
	]);
	cmWord.defaultSortable = true;// 可排序
	var dsWord = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : beanWord,
			business : business,
			method : listMethod,
			params : pidWhereString
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey
		}, ColumnsWord),
		remoteSort : true,
		pruneModifiedRecords : true
	});

	dsWord.setDefaultSort(orderColumnWord, 'asc');
	
	var addWordBtn = new Ext.Button({
		id : 'addWord',
		text : '新增',
		iconCls : 'add',
		handler : doWordHandler
	})
	var editWordBtn = new Ext.Button({
		id : 'editWord',
		text : '修改',
		iconCls : 'btn',
		handler : doWordHandler
	})
	var delWordBtn = new Ext.Button({
		id : 'delWord',
		text : '删除',
		iconCls : 'remove',
		handler : doWordHandler
	})
	var viewWordBtn = new Ext.Button({
		id : 'viewWord',
		text : '查看',
		iconCls : 'word',
		handler : doWordHandler
	})
	var setDefaultWordBtn = new Ext.Button({
		id : 'setWord',
		text : '默认',
		iconCls : 'btn',
		handler : doWordHandler
	})
	var disableWordBtn = new Ext.Button({
		id : 'disableWord',
		text : '禁用',
		iconCls : 'btn',
		handler : doWordHandler
	})
	var gridPanelWord = new Ext.grid.GridPanel({
		title : '模板管理',
		ds : dsWord,
		cm : cmWord,
		sm : smWord,
		region : 'center',
		border : false,
		height : 286,
		split : true,
		model : 'mini',
		clicksToEdit : 1,
		stripeRows : true,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<b><font color=#15428b>模板管理</font></b>'],
		addBtn : false,
		saveBtn : false,
		delBtn : false,
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows : true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : dsWord,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		})
	})
	dsWord.load({params : {	start : 0,limit : PAGE_SIZE}});	

	smWord.on('rowselect',function(sm, rowIndex, record){
		selectWordRecord = smWord.getSelected();
		selectWordUids = selectWordRecord.data.uids;
		var isDefault = selectWordRecord.data.isdefault;
		var isStart = selectWordRecord.data.isstart;
		//setDefaultWordBtn.setDisabled(isDefault=='1')
		//setDefaultWordBtn.setDisabled(isStart=='0')
		//disableWordBtn.setText(isStart=='1'?'禁用':'启用')
		if(isStart=='1'){
			disableWordBtn.setText('禁用');
			setDefaultWordBtn.setDisabled(isDefault=='1')
		}else{
			disableWordBtn.setText('启用');
			setDefaultWordBtn.disable();
		}
		
	})
	var saveWordBtn = new Ext.Button({
		name : 'save',
		text : '保存',
		minWidth : 80,
		handler : wordFormSave
	})
	var closeWordBtn = new Ext.Button({
		name : 'close',
		text : '关闭',
		minWidth : 80,
		handler : closeWordWinBtn
	})
	
	var nameField = new Ext.form.TextField({
		id : fcWord['mbname'].name,
		name : fcWord['mbname'].name,
		fieldLabel : fcWord['mbname'].fieldLabel,
		allowBlank: false,
		anchor : '90%'
	})

	var remarkField = new fm.TextArea({
		name : fcWord['remark'].name,
		fieldLabel : fcWord['remark'].fieldLabel,
		width : 280,
		anchor : '90%'
	})
	var fileField = new Ext.ux.form.FileUploadField({
		id : 'attach_file',
		emptyText : '选择上传的文件',
		fieldLabel : '上传模板',
		xtype: 'textfield',     
		name: 'filename1',   
		buttonText : '浏 览',
		width : 280,
		anchor : '90%'
	});

	fileField.on('fileselected', function() {
		// 设置默认文件名
		var filePath = this.getValue();
		if (filePath && filePath.length > 0) {
			//var fileName = filePath.substring(filePath.lastIndexOf("\\") + 1,filePath.lastIndexOf("."));
			var fileName = filePath.substring(filePath.lastIndexOf("\\") + 1,filePath.length);
		}
		//过滤扩展名，只接受doc和docx
		var fileSuffix = filePath.substring(filePath.lastIndexOf(".") + 1,filePath.length).toLowerCase();
		if (!(fileSuffix == 'doc' || fileSuffix == 'docx')) {
			fileField.setValue("");
			Ext.Msg.alert("上传文件出错", "只能上传doc和docx格式的文件!");
			return;
		}
		nameField.setValue(fileName);
	});

	var wordFormPanel = new Ext.FormPanel({
		id : 'word-form-panel',
		header : false,
		border : false,
		layout : 'form',
		enctype : 'multipart/form-data',
		fileUpload : 'true',
		method : 'POST',
		url : '',
		region : 'center',
		bodyStyle : 'padding:10px;',
		items : [
			 {
				 border : false,
				 items : [
					new fm.TextField(fcWord['uids']), 
			 		new fm.TextField(fcWord['pid']), 
			 		new fm.TextField(fcWord['jyxmUids']),
			 		new fm.TextField(fcWord['jyxmBh']),
			 		new fm.TextField(fcWord['fileid']),
			 		new fm.TextField(fcWord['fileuser']),
			 		new fm.TextField(fcWord['filesize']),
			 		//new fm.DateField(fcWord['filedate']),
			 		new fm.TextField(fcWord['isdefault']), 
			 		new fm.TextField(fcWord['isstart'])
				]
			 },
			 nameField, 
			 new fm.NumberField(fcWord['mborder']), 
			 fileField,
			 remarkField
			 ],
			 buttons : [saveWordBtn, closeWordBtn]
	});

	var wordFormWin = new Ext.Window({
		id : 'word-form-win',
		title : '模板管理',
		layout : 'fit',
		width : 420,
		height : 240,
		modal : true,
		plain : true,
		border : false,
		resizable : false,
		closeAction : 'hide',
		items : [wordFormPanel]
	});

	function doWordHandler(){
		var btnId = this.id;
		if(btnId=="addWord"){
			addWordData();
		}else{
			selectWordRecord = smWord.getSelected();
			if(selectWordRecord == null || selectWordRecord==""){
				Ext.Msg.show({
					title : '提示',
					msg : '请选择一条模板记录!',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.INFO
				});
				return;
			}	
			switch(btnId){
				case "editWord":
					editWordData();
					break;
				case "delWord":
					delWordData();
					break;
				case "viewWord":
					viewWordData();
					break;
				case "setWord":
					setDefaultWordData();
					break;
				case "disableWord":
					setDisableWordData();
					break;
			}
		}
	}
	
	//添加模板
	function addWordData() {
		//if (typeof(tempNode) == "undefined") {
		if(tempNode == null){
			Ext.Msg.show({
				title : '提示',
				msg : '请选择检验项目分类!',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
			return;
//		}else if (thisHasChild) {
//			Ext.Msg.show({
//				title : '提示',
//				msg : '父节点不能添加模板！',
//				buttons : Ext.Msg.OK,
//				icon : Ext.MessageBox.INFO
//			});
		} else {
			wordFormWin.show();
			var formRecord = Ext.data.Record.create(ColumnsWord);
	    	var loadFormRecord = null;
	    	loadFormRecord = new formRecord({
	    		uids : '',
				pid : CURRENTAPPID,
				jyxmUids : thisNodeUids,
				jyxmBh : thisNodeBh,
				mbname : '',
				remark : '',
				filesize : '',
				fileuser : USERID,
				filedate : '',
				isdefault : 0,
				isstart : 1,
				mborder : 0
	    	});
	    	wordFormPanel.getForm().loadRecord(loadFormRecord);
	    }
	}
	//修改模板
	function editWordData(){	
		wordFormWin.show();
		var formRecord = Ext.data.Record.create(ColumnsWord);
    	var loadFormRecord = null;
    	DWREngine.setAsync(false);
		baseMgm.findById(beanWord, selectWordUids, function(obj) {
			loadFormRecord = new formRecord(obj);
		});
		DWREngine.setAsync(true);
    	wordFormPanel.getForm().loadRecord(loadFormRecord);
	}
	//删除模板
	function delWordData(){
		Ext.Msg.show({
			title : '提示！',
			msg : '此操作将删除模板，并不可恢复，确定要删除吗？<br>点击“是”删除此模板！<br>点击“否”返回其他操作！',
			buttons : Ext.Msg.YESNO,
			icon: Ext.Msg.WARNING,
			fn : function(value) {
				if ('yes' == value) {
					var fileid = selectWordRecord.data.fileid;
					var uids = selectWordRecord.data.uids;
					DWREngine.setAsync(false);
					gczlJyxmImpl.getFlowByFileId(fileid,function(bool){
						if(bool){
							gczlJyxmImpl.deleteWordById(uids,function(str){
								if(str=="0"){
									//成功
									Ext.example.msg('删除成功！', '您成功删除了一条项目检验模板！');
									dsWord.reload();
								}else{
									//失败
									Ext.MessageBox.alert("删除失败", "删除失败！")
								}
							})
						}else{
							Ext.Msg.show({
								title : '提示！',
								msg : '此模板已经被使用过，不能直接删除！<br>点击“是”可以禁用此模板！<br>点击“否”返回其他操作！',
								buttons : Ext.Msg.YESNO,
								icon: Ext.Msg.WARNING,
								fn : function(value) {
									if ('yes' == value) {
										gczlJyxmImpl.setWordDisableById(uids,function(str){
											Ext.MessageBox.alert("操作成功", "该模板已禁用！");
											dsWord.reload();
										})
									}
								}
							});
							
						}
					})
					DWREngine.setAsync(true);
					//
				}
			}
		});
	}
	//查看模板
	function viewWordData(){
		var curComFile = selectWordRecord.data;
		editInWordWindow(curComFile);
	}
	//设置默认模板
	function setDefaultWordData(){
		DWREngine.setAsync(false);
		gczlJyxmImpl.setDefaultById(selectWordUids,thisNodeUids,"word",function(){
			dsWord.reload()
		});
		DWREngine.setAsync(true);
	}
	//禁用启用模板
	function setDisableWordData(){
		DWREngine.setAsync(false);
		gczlJyxmImpl.setDisableWordById(selectWordUids,function(){
			dsWord.reload()
		});
		DWREngine.setAsync(true);
	}
	//保存模板添加表单
	function wordFormSave() {
		var form = wordFormPanel.getForm();
		var uids = form.findField('uids').getValue();
		
		if (fileField.getValue() == "" && uids=="") {
			Ext.MessageBox.alert("提示", "请先上传文件，再进行保存操作！")
			return
		}
			
		if(fileField.getValue() != ""){	
			form.submit({
				method: 'POST',
				url : MAIN_SERVLET+"?ac=upload",
	         	params:{ac:'upload'},
				waitTitle: '请等待...',
				waitMsg: '上传中...',
				success: function(form, action){			           
		            //Ext.MessageBox.alert("提示", "文件信息保存成功!")
					var infos = action.result.msg;
					var fileid = infos[0].fileid; 
					var filename = infos[0].filename;
					var filesize = "";
					DWREngine.setAsync(false);
					baseMgm.getData("select filesize from APP_FILEINFO where fileid = '"+fileid+"'",function(list){
						filesize = list[0];
					});
					DWREngine.setAsync(true);
					form.findField('mbname').setValue(filename);
					form.findField('fileid').setValue(fileid);
					form.findField('filesize').setValue(filesize);
					doFormSave(wordFormPanel);
					dsWord.reload()
					form.reset();
					closeWordWinBtn();
					form.getEl().dom.reset();
				},
				failure : function(response, params) {
					Ext.MessageBox.alert("提示", response.responseText)
				}
			});
		}else{
			doFormSave(wordFormPanel);
			dsWord.reload()
			form.reset();
			closeWordWinBtn();
			form.getEl().dom.reset();
		}
	}

	function doFormSave(formPanel) {
		var form = formPanel.getForm();
		var obj = form.getValues();
		for (var i = 0; i < Columns.length; i++) {
			var n = Columns[i].name;
			var field = form.findField(n);
			if (field) {
				obj[n] = field.getValue();
			}
		}
		DWREngine.setAsync(false);
		if (obj.uids == '' || obj.uids == null) {
			gczlJyxmImpl.saveOrUpdateWord(obj, function(state) {
				if ("1" == state) {
					Ext.example.msg('保存成功！', '您成功新增了一条项目检验模板信息！');			
				} 
			});
		} else {
			gczlJyxmImpl.saveOrUpdateWord(obj, function(state) {
				if ("2" == state) {
					Ext.example.msg('保存成功！', '您成功修改了一条项目检验模板信息！');
				}
			});
		}
		DWREngine.setAsync(true);
	}
	
	function closeWordWinBtn(){
		wordFormWin.hide();
	}
	
	// -------------------流程管理开始---------------------
	var fcFlow = {
		'uids' : {name : 'uids',fieldLabel : 'UIDS',hidden : true,hideLabel : true},
		'pid' : {name : 'pid',fieldLabel : 'PID',hidden : true, value : CURRENTAPPID, hideLabel : true},
		'jyxmUids' : {name : 'jyxmUids',fieldLabel : '项目UIDS',hidden : true,hideLabel : true},
		'xmbh' : {name : 'xmbh',fieldLabel : '项目编号',hidden : true,hideLabel : true},
		'flowid' : {name : 'flowid',fieldLabel : '流程',hidden : true,hideLabel : true},
		'flowuser' : {name : 'flowuser',fieldLabel : '录入人'	,hidden : true,hideLabel : true},
		'flowdate' : {name : 'flowdate',fieldLabel : '录入时间',format : 'Y-m-d',hidden : true,hideLabel : true},
		'isdefault' : {name : 'isdefault',fieldLabel : '默认',hidden : true,hideLabel : true}
	};
	var ColumnsFlow = [
		{name : 'uids',type : 'string'},
		{name : 'pid',type : 'string'},
		{name : 'jyxmUids',type : 'string'},
		{name : 'xmbh',type : 'string'},
		{name : 'flowid',type : 'string'},
		{name : 'flowuser',type : 'string'},
		{name : 'flowdate',type : 'date',dateFormat : 'Y-m-d H:i:s'},
		{name : 'isdefault',type : 'float'}
	];
	var smFlow = new Ext.grid.CheckboxSelectionModel({singleSelect : true});
	var cmFlow = new Ext.grid.ColumnModel([
		smFlow,
		{id : 'uids',header : fcFlow['uids'].fieldLabel,dataIndex : fcFlow['uids'].name,hidden : true},
		{id : 'pid',header : fcFlow['pid'].fieldLabel,dataIndex : fcFlow['pid'].name,hidden : true},
		{id : 'jyxmUids',header : fcFlow['jyxmUids'].fieldLabel,dataIndex : fcFlow['jyxmUids'].name,hidden : true},
		{id : 'xmbh',header : fcFlow['xmbh'].fieldLabel,dataIndex : fcFlow['xmbh'].name,hidden : true},
		{id : 'flowid',header : fcFlow['flowid'].fieldLabel,dataIndex : fcFlow['flowid'].name,
			renderer:function(value){
				for(var i=0;i<flowArr.length;i++){
					if(flowArr[i][0]==value){
						return flowArr[i][1];
					}
				}
			}
		},
		{id : 'flowuser',header : fcFlow['flowuser'].fieldLabel,dataIndex : fcFlow['flowuser'].name,
			width : 30,
			renderer:function(value){
				for(var i=0;i<userArr.length;i++){
					if(userArr[i][0]==value){
						return userArr[i][1];
					}
				}
			}
		},
		{id : 'flowdate',header : fcFlow['flowdate'].fieldLabel,dataIndex : fcFlow['flowdate'].name,
			width : 30,
			renderer : formatDate
		},
		{id : 'isdefault',header : fcFlow['isdefault'].fieldLabel,dataIndex : fcFlow['isdefault'].name,
			width : 30,
			renderer : function(value){
				if(value==1) return "默认";
			}
		}
	]);
	cmFlow.defaultSortable = true;// 可排序
	var dsFlow = new Ext.data.Store({
		baseParams : {
			ac : 'list',
			bean : beanFlow,
			business : business,
			method : listMethod,
			params : pidWhereString
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : MAIN_SERVLET
		}),
		reader : new Ext.data.JsonReader({
			root : 'topics',
			totalProperty : 'totalCount',
			id : primaryKey
		}, ColumnsFlow),
		remoteSort : true,
		pruneModifiedRecords : true
	});

	dsFlow.setDefaultSort(orderColumnFlow, 'asc');
	
	var addFlowBtn = new Ext.Button({
		id : 'addFlow',
		text : '新增',
		iconCls : 'add',
		handler : addFlowData
	})

	var delFlowBtn = new Ext.Button({
		id : 'delFlow',
		text : '删除',
		iconCls : 'remove',
		handler : delFlowData
	})

	var setDefaultFlowBtn = new Ext.Button({
		id : 'setFlow',
		text : '默认',
		iconCls : 'btn',
		handler : setDefaultFlowData
	})
	
	var gridPanelFlow = new Ext.grid.EditorGridTbarPanel({
		title : '流程管理',
		ds : dsFlow,
		cm : cmFlow,
		sm : smFlow,
		region : 'south',
		border : false,
		height : 286,
		split : true,
		model : 'mini',
		clicksToEdit : 1,
		stripeRows : true,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<b><font color=#15428b>流程管理</font></b>'],
		addBtn : false,
		saveBtn : false,
		delBtn : false,
		animCollapse : false, // 折叠时显示动画
		loadMask : true, // 加载时是否显示进度
		stripeRows : true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : dsFlow,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		})
	})
	dsFlow.load({params : {	start : 0,limit : PAGE_SIZE}});
	
	smFlow.on('rowselect',function(sm, rowIndex, record){
		selectFlowRecord = smFlow.getSelected();
		selectFlowid = selectFlowRecord.data.uids;
		var isDefault = selectFlowRecord.data.isdefault;
		setDefaultFlowBtn.setDisabled(isDefault=='1');
	})
	
	var selectFlowBtn = new Ext.Button({
		id : 'selectFlow',
		text : '选择',
		iconCls : 'add',
		handler : selectFlowTreeData
	})
	
	var root1 = new Ext.tree.TreeNode({
		id:'0',
		text:"0"
	});
	var selectFlowTreePanel = new Ext.tree.TreePanel({
		rootVisible: false,
		border : false,
		loader: new Ext.tree.TreeLoader(),
		root: root1,
		selModel : new Ext.tree.MultiSelectionModel(),	//多选
		autoScroll : true,
		onlyLeafCheckable: true ,
		collapseFirst: false
	})
	var selectFlowTreeWin = new Ext.Window({
		width:360,
		height:400,
		title:'质量验评流程',
		layout:'fit',
		modal : true,
		plain : true,
		border : false,
		resizable : false,
		closeAction : 'hide',
		tbar : [selectFlowBtn,'->','<font color=red>按住Ctrl可进行多选</font>'],
		items : [selectFlowTreePanel]
	})
	selectFlowTreePanel.on('beforeclick', function(node,e){
		if(!node.isLeaf()){
			node.unselect();
			node.expand();
			return false
		}
		if(node.id == 0)return false;
	});
	
	function addFlowData(){
		//if (typeof(tempNode) == "undefined") {
		if(tempNode == null){
			Ext.Msg.show({
				title : '提示',
				msg : '请选择检验项目分类!',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
//		}else if (thisHasChild) {
//			Ext.Msg.show({
//				title : '提示',
//				msg : '父节点不能添加流程！',
//				buttons : Ext.Msg.OK,
//				icon : Ext.MessageBox.INFO
//			});
		} else {
			DWREngine.setAsync(false);
				flwZlypMgm.getZlypFlwTree(USERBELONGUNITID,function(json){
	       			var nodes = eval(json);	
	       			selectFlowTreeWin.show();
	       			if(nodes.length>0 && root1.childNodes.length==0){
	       				var node = nodes[0];
	       				node.expanded=false;
	       				root1.appendChild(new Ext.tree.AsyncTreeNode(node));
	       			}
	       		});
	       	DWREngine.setAsync(true);
       	}
	}
	
	function delFlowData(){
		selectFlowRecord = smFlow.getSelected();
		if(selectFlowRecord == null || selectFlowRecord==""){
			Ext.Msg.show({
				title : '提示',
				msg : '请选择一条流程记录!',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
		}else{
			Ext.Msg.show({
				title : '提示！',
				msg : '此操作将删除流程，并不可恢复，确定要删除吗？<br>点击“是”删除此流程！<br>点击“否”返回其他操作！',
				buttons : Ext.Msg.YESNO,
				icon: Ext.Msg.WARNING,
				fn : function(value) {
					if ('yes' == value) {
						var uids = selectFlowRecord.data.uids;
						DWREngine.setAsync(false);
						gczlJyxmImpl.deleteFlowById(uids,function(str){
							if(str=="0"){
								//成功
								Ext.example.msg('删除成功！', '您成功删除了一条项目检验流程信息！');
								dsFlow.reload();
							}else{
								//失败
								Ext.MessageBox.alert("删除失败", "删除失败！")
							}
						})		
						DWREngine.setAsync(true);
					}
				}
			});
		}
	}
	function setDefaultFlowData(){
		selectFlowRecord = smFlow.getSelected();
		if(selectFlowRecord == null || selectFlowRecord==""){
			Ext.Msg.show({
				title : '提示',
				msg : '请选择一条流程记录!',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
		}else{
			DWREngine.setAsync(false);
			gczlJyxmImpl.setDefaultById(selectFlowid,thisNodeUids,"flow",function(){
				dsFlow.reload()
			});
			DWREngine.setAsync(true);
		}
	}
	//选择流程树
	function selectFlowTreeData(){
		var nodes = selectFlowTreePanel.getSelectionModel().getSelectedNodes();
		var thisFlowTreeSelectIds = new Array();
		for(var i=0;i<nodes.length;i++){
			//alert(nodes[i].id+"**"+nodes[i].text+"**"+nodes[i].leaf);
			if(nodes[i].leaf){
				thisFlowTreeSelectIds.push(nodes[i].id)
			}
		}
		if(!nodes.length>0){
			Ext.Msg.show({
				title : '提示',
				msg : '请选择一条流程!',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
		}else if(!thisFlowTreeSelectIds.length>0){
			Ext.Msg.show({
				title : '提示',
				msg : '不能添加流程文件夹!',
				buttons : Ext.Msg.OK,
				icon : Ext.MessageBox.INFO
			});
		}else{
			DWREngine.setAsync(false);
			gczlJyxmImpl.saveFlow(thisFlowTreeSelectIds,USERID,thisNodeUids,function(){
			
			})
			dsFlow.reload();
			selectFlowTreeWin.hide();
			DWREngine.setAsync(true);
		}
	}
	//--------------------
	var tabs = new Ext.Panel({
		activeTab : 0,
		deferredRender : false,
		split : true,
		plain : true,
		border : false,
		region : 'center',
		forceFit : true,
		layout: 'border',
		items : [gridPanelWord,gridPanelFlow]
	});

	// 7. 创建viewport加入面板content
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [treePanel, tabs]
	});
	
	if (ModuleLVL < 3) {
		treePanel.getTopToolbar().add({
				id : 'add',
				text : '新增',
				iconCls : 'add',
				handler : toHandler
			}, '-', {
				id : 'update',
				text : '修改',
				iconCls : 'btn',
				handler : toHandler
			}, '-', {
				id : 'del',
				text : '删除',
				iconCls : 'remove',
				handler : toHandler
			});
		
		gridPanelWord.getTopToolbar().add('-', addWordBtn,'-',editWordBtn,'-',delWordBtn,'-',disableWordBtn,'-',setDefaultWordBtn);
		gridPanelFlow.getTopToolbar().add('-',addFlowBtn,'-',delFlowBtn,'-',setDefaultFlowBtn);
	}
	gridPanelWord.getTopToolbar().add('-',viewWordBtn);

	//treePanel.render(); // 显示树
	//root.expand();
//	treePanel.expand();
	
	//在线编辑word模板
	
	function editInWordWindow(comFile) {
		var filePath = comFile.mbname;
		var fileSuffix = filePath.substring(filePath.lastIndexOf(".") + 1,filePath.length).toLowerCase();
		if (!(fileSuffix == 'doc' || fileSuffix == 'docx' || fileSuffix == 'xls' || fileSuffix == 'xlsx')) {
			Ext.Msg.alert("在线编辑", "在线编辑只支持doc,docx,xls,xlsx格式文件!");
			return;
		}
	
		var filePk = comFile.uids;
		var fileLsh = comFile.fileid;
		//var editable = (comFile.billState == 0) && (comFile.statePublish == 0);
		var editable = true;
		var fileName;
		if (comFile.fileName) {
			fileName = comFile.fileName;
		} else {
			fileName = comFile.fileTile;
		}
		fileName = comFile.mbname;
		var fileid = comFile.fileid;
		var retVal = window
				.showModalDialog(
						CONTEXT_PATH
								//+ "/Business/fileAndPublish/fileManage/OpenViaOffice.jsp?filePk="
								+ "/Business/gczl/zlyp/gczl.jyxm.frame.view.word.jsp?filePk="
								+ filePk + "&fileLsh=" + fileLsh + "&fileName="
								+ encodeURIComponent(fileName) + "&fileSuffix="
								+ fileSuffix + "&editable=" + editable + "&fileid="
								+ fileid,
						null,
						"dialogWidth:1000px;dialogHeight:800px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	
	}
	

	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};
});