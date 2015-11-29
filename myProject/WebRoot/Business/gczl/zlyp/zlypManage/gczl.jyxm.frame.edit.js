var treePanel, treeLoader, contentPanel;
var root, saveBtn;
var treePanelTitle = "检验项目结构维护";
var rootText = "验评标准树";
var tempNode = null; // 两个js之间树Node临时变量
var tmpLeaf; // 两个js之间树Node临时变量
var queryBdgid;
var checkBgdWin
var ServletUrl = CONTEXT_PATH + "/servlet/ZlypServlet";
var beanWord = "com.sgepit.pmis.gczl.hbm.GczlJyxmApproval"
var business = "baseMgm"
var listMethod = "findwhereorderby"
var primaryKey = "jymbUids"
var orderColumnWord = "mborder"
//选中节点后的相关参数
var thisNodeUids = 0;		//当前节点uids
var thisNodeBh = 0;			//当前节点编号
var thisHasChild = true;	//当前节点是否有子节点
var isRootNode = true;		//当前节点是否是跟节点
var permitFormWin;
var permitFormPanel;
var selectWordRecord,selectWordUids,selectmbuids;
var permituids,permitnewstatus;
var dsWord;
var savePermitBtn,closePermitBtn;
var approvalResult="";
//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"

Ext.onReady(function() {
	var gridPanelName="验评记录管理";
	if(query==true){
		gridPanelName="验评记录查询";
	}
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
			var formRecord = Ext.data.Record.create(ColumnsWord);
			var thisNodeHasWordOrFlow = false;
			
			DWREngine.setAsync(false);
				gczlJyxmImpl.isHasWordOrFlow(uids,function(bool){
					if (bool) {
						thisNodeHasWordOrFlow = true
					}
				})
			DWREngine.setAsync(true);
			if ("新增" == this.text) {
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
					delHandler(uids, tempNode);
					tempNode = null;	
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
							var formDelRecord = Ext.data.Record.create(ColumnsWord);
							var flag = (node.parentNode.childNodes.length == 1)
							var pNode = flag ? node.parentNode.parentNode : node.parentNode;

							var formRecord = Ext.data.Record.create(ColumnsWord);
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
								msg : '该分类下有验评记录，暂时不能删除!',
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
		dsWord.baseParams.params =CURRENTAPPID+" and "+thisNodeBh+" and "+"1=1";//改变条件
		dsWord.load({params : {	start : 0,limit : PAGE_SIZE}});//刷新Grid
	}

	var treeFormWin = new Ext.Window({
		id : 'tree-form-win',
		title : '质量验评记录分类管理',
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
	root.expand();
	// -------------------管理开始---------------------
	var fcWord = {
		'jymbUids' : {name : 'jymbUids',fieldLabel : 'jymbUids',hidden : true,hideLabel : true},
		'uids' : {name : 'uids',fieldLabel : 'UIDS',hidden : true,hideLabel : true},
		'pid' : {name : 'pid',fieldLabel : 'PID',hidden : true,hideLabel : true},
		'jyxmUids' : {name : 'jyxmUids',fieldLabel : '项目UIDS',hidden : true,hideLabel : true},
		'jyxmBh' : {name : 'jyxmBh',fieldLabel : '项目编号',hidden : true,hideLabel : true},
		'mbname' : {name : 'mbname',fieldLabel : '文件名称'},
		'fileid' : {name : 'fileid',fieldLabel : '文件ID',hidden : true,hideLabel : true},
		'filesize' : {name : 'filesize',fieldLabel : '文件大小',hidden : true,hideLabel : true},
		'fileuser' : {name : 'fileuser',fieldLabel : '录入人'	,hidden : true,hideLabel : true},
		'filedate' : {name : 'filedate',fieldLabel : '录入时间',hidden : true,format : 'Y-m-d',hidden : true,hideLabel : true},
		'grade' : {name : 'grade',fieldLabel : '验收等级',hidden : true,hideLabel : true},
		'result' : {name : 'result',fieldLabel : '验收结果',hidden : true,hideLabel : true},
		'checkDate' : {name : 'checkDate',fieldLabel : '验收日期',hideLabel : true,format: 'Y-m-d'},
		'approvalStatus' : {name : 'approvalStatus',fieldLabel : '审批状态',hidden : true},
		'remark' : {name : 'remark',fieldLabel : '备注说明'}
	};
	var ColumnsWord = [
		{name : 'jymbUids',type : 'string'},
		{name : 'mbname',type : 'string'},
		{name : 'uids',type : 'string'},
		{name : 'pid',type : 'string'},
		{name : 'jyxmUids',type : 'string'},
		{name : 'remark',type : 'string'},
		{name : 'fileid',type : 'string'},
		{name : 'filesize',type : 'float'},
		{name : 'fileuser',type : 'string'},
		{name : 'filedate',type : 'date',dateFormat : 'Y-m-d H:i:s'},
		{name : 'mborder',type : 'float'},
		{name : 'grade',type : 'string'},
		{name : 'result',type : 'string'},
		{name : 'checkDate',type : 'date',dateFormat : 'Y-m-d H:i:s'},
		{name : 'approvalStatus',type : 'string'},
		{name : 'approvalResult',type : 'string'},
		{name : 'jyxmBh',type : 'string'}
		
	];

	var smWord = new Ext.grid.CheckboxSelectionModel({singleSelect : true});
	var cmWord = new Ext.grid.ColumnModel([
		smWord,
		{id : 'uids',header : fcWord['uids'].fieldLabel,dataIndex : fcWord['uids'].name,hidden : true},
		{id : 'jymbUids',header : fcWord['jymbUids'].fieldLabel,dataIndex : fcWord['jymbUids'].name,hidden : true},
		{id : 'pid',header : fcWord['pid'].fieldLabel,dataIndex : fcWord['pid'].name,hidden : true},
		{id : 'jyxmUids',header : fcWord['jyxmUids'].fieldLabel,dataIndex : fcWord['jyxmUids'].name,hidden : true},
		{id : 'jyxmBh',header : fcWord['jyxmBh'].fieldLabel,dataIndex : fcWord['jyxmBh'].name,hidden : true},
		{id : 'mbname',width:150,header : fcWord['mbname'].fieldLabel,dataIndex : fcWord['mbname'].name,
		renderer:function(value,num,record){			
			return  "<a title='" + value + "' href='javascript:void(0)' style='color:blue;' onclick='javascript:openFileRecord()'>"+value+"</a>";
		}
		},
		{id : 'grade',header : fcWord['grade'].fieldLabel,dataIndex : fcWord['grade'].name},
		{id : 'result',header : fcWord['result'].fieldLabel,dataIndex : fcWord['result'].name},
		{id : 'checkDate',header : fcWord['checkDate'].fieldLabel,dataIndex : fcWord['checkDate'].name,renderer : formatDate},
		{id : 'approvalStatus',width:80,header : fcWord['approvalStatus'].fieldLabel,dataIndex : fcWord['approvalStatus'].name,
			renderer:function(value,num,record){
				if(value=="0"){
					return "未上报";
				}else if(value=="-1"){
					return "已上报";			
				}else if(value=="1"){
					if(record.data.approvalResult==0){
						return "审批  不合格";
					}else if(record.data.approvalResult==1){
						return "审批 合格";
						}
				}else if(value=="-2"){
					return "退回";
				}
			}		
		
		},
		
		{id : 'fileid',header : fcWord['fileid'].fieldLabel,dataIndex : fcWord['fileid'].name,hidden : true},
		{id : 'filesize',header : fcWord['filesize'].fieldLabel,dataIndex : fcWord['filesize'].name,width : 50,hidden:true,
			renderer : function(value){
				return value/1024+"<B>KB</B>";
			}
		},
		{id : 'fileuser',header : fcWord['fileuser'].fieldLabel,dataIndex : fcWord['fileuser'].name,width : 50,hidden:true,
			renderer:function(value){
				for(var i=0;i<userArr.length;i++){
					if(userArr[i][0]==value){
						return user = userArr[i][1];
					}
				}
			}
		},
		{id : 'filedate',header : fcWord['filedate'].fieldLabel,dataIndex : fcWord['filedate'].name,width : 50,
			renderer : formatDate,hidden:true
		},
		{id : 'remark',header : fcWord['remark'].fieldLabel,dataIndex : fcWord['remark'].name}
	]);
	cmWord.defaultSortable = true;// 可排序
	dsWord = new Ext.data.Store({
		baseParams : {
			ac : 'listGczlApproval',
			params:CURRENTAPPID+" and "+"1"+" and "+"1=1"
		},
		proxy : new Ext.data.HttpProxy({
			method : 'GET',
			url : ServletUrl
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
	var uploadWordBtn = new Ext.Button({
		id : 'uploadWord',
		text : '上报',
		iconCls : 'upload',
		handler : doWordHandler
	})	
	var gridPanelWord = new Ext.grid.GridPanel({
		title : '管理',
		ds : dsWord,
		cm : cmWord,
		sm : smWord,
		region : 'center',
		border : false,
		height : 800,
		split : true,
		model : 'mini',
		clicksToEdit : 1,
		stripeRows : true,
		header : false,
		autoScroll : true, // 自动出现滚动条
		tbar : ['<b><font color=#15428b>' +gridPanelName+ '</font></b>'],
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
		selectmbuids = selectWordRecord.data.jymbUids;
		
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
	var gardeField = new Ext.form.TextField({
		id : fcWord['grade'].name,
		name : fcWord['grade'].name,
		fieldLabel : fcWord['grade'].fieldLabel,
		allowBlank: true,
		anchor : '90%'
	})	
	var resultField = new Ext.form.TextField({
		id : fcWord['result'].name,
		name : fcWord['result'].name,
		fieldLabel : fcWord['result'].fieldLabel,
		allowBlank: true,
		anchor : '90%'
	})	
	var checkDateField = new Ext.form.DateField({
		id : fcWord['checkDate'].name,
		name : fcWord['checkDate'].name,
		fieldLabel : fcWord['checkDate'].fieldLabel,
		allowBlank: false,
		format:"Y-m-d",
		//type:'date',
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
		fieldLabel : '上传文件',
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
			var fileName = filePath.substring(filePath.lastIndexOf("\\") + 1,filePath.length);
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
					new fm.TextField(fcWord['jymbUids']), 
			 		new fm.TextField(fcWord['pid']), 
			 		new fm.TextField(fcWord['jyxmUids']),
			 		new fm.TextField(fcWord['fileid']),
			 		new fm.TextField(fcWord['fileuser']),
			 		new fm.TextField(fcWord['filesize']),
			 		new fm.TextField(fcWord['approvalStatus']),
			 		new fm.TextField(fcWord['jyxmBh'])
				]
			 },
			 fileField,
			 nameField, 
			 gardeField,
			 resultField,
			 checkDateField,
			 remarkField
			 ],
			 buttons : [saveWordBtn, closeWordBtn]
	});

	var wordFormWin = new Ext.Window({
		id : 'word-form-win',
		title : '验评记录管理',
		layout : 'fit',
		width : 420,
		height : 340,
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
					msg : '请选择一条验评记录!',
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
			    case "uploadWord":
			        uploadWordData();
			        break;
				
			}
		}
	}
	
	//添加
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
		} else {
			wordFormWin.show();
			var formRecord = Ext.data.Record.create(ColumnsWord);
	    	var loadFormRecord = null;
	    	loadFormRecord = new formRecord({
	    		uids : '',
	    		jymbUids:'',
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
				mborder : 0,
				checkDate:new Date(),
				approvalStatus:0
	    	});
	    	wordFormPanel.getForm().loadRecord(loadFormRecord);
	    }
	}
	//修改
	function editWordData(){	
		var approvalStatus=selectWordRecord.data.approvalStatus;	
		if(approvalStatus=="-1"||approvalStatus=="1"){
			Ext.Msg.alert("提示","已上报或审批通过不允许修改");
		}
		else
		{	wordFormWin.show();
			var formRecord = Ext.data.Record.create(ColumnsWord);
    		var loadFormRecord = null;
    		DWREngine.setAsync(false);
			gczlJyxmImpl.findByDoubleId(selectWordUids,selectmbuids,function(obj) {
			loadFormRecord = new formRecord(obj);
			});
			DWREngine.setAsync(true);
    		wordFormPanel.getForm().loadRecord(loadFormRecord);
    	}
	}
	//删除
	function delWordData(){
		var approvalStatus=selectWordRecord.data.approvalStatus;
		if(approvalStatus=="-1"||approvalStatus=="1"||approvalStatus=="-2"){
			Ext.Msg.alert("提示","已上报或审批通过或退回时不允许删除");
		}	
		else{			
		Ext.Msg.show({
			title : '提示！',
			msg : '此操作将删除验评信息，并不可恢复，确定要删除吗？<br>点击“是”删除此！<br>点击“否”返回其他操作！',
			buttons : Ext.Msg.YESNO,
			icon: Ext.Msg.WARNING,
			fn : function(value) {
				if ('yes' == value) {
					var fileid = selectWordRecord.data.fileid;
					var jymbUids = selectWordRecord.data.jymbUids;
					var uids = selectWordRecord.data.uids;						
					DWREngine.setAsync(false);
					gczlJyxmImpl.getFlowByFileId(fileid,function(bool){
						if(bool){
							gczlJyxmImpl.deleteWordApprovalById(uids,function(str){
						
							})							
							gczlJyxmImpl.deleteWordById(jymbUids,function(str){
								if(str=="0"){
									//成功
									Ext.example.msg('删除成功！', '您成功删除了一条项目验评信息！');
									dsWord.reload();
								}else{
									//失败
									Ext.MessageBox.alert("删除失败", "删除失败！")
								}
							})
						}else{
							Ext.Msg.show({
								title : '提示！',
								msg : '此已经被使用过，不能直接删除！<br>点击“是”可以禁用此！<br>点击“否”返回其他操作！',
								buttons : Ext.Msg.YESNO,
								icon: Ext.Msg.WARNING,
								fn : function(value) {
									if ('yes' == value) {
										gczlJyxmImpl.setWordDisableById(jymbUids,function(str){
											Ext.MessageBox.alert("操作成功", "该已禁用！");
											dsWord.reload();
										})
									}
								}
							});
							
						}
					})
					DWREngine.setAsync(true);
					}
				}
		});
	}
}
	
	//上报
	function uploadWordData(){
		var recordData=selectWordRecord.data;
		var approvalUids=recordData.uids;
		var userid=USERID;
		var approvalStatus=recordData.approvalStatus;
		if(approvalStatus=="-1"||approvalStatus=="1"){
			Ext.Msg.alert("提示","已上报或审批通过不允许再上报");
		}else{
			Ext.Msg.show({
			title : '提示！',
			msg : '确认上报吗？',
			buttons : Ext.Msg.YESNO,
			icon: Ext.Msg.QUESTION,
			fn : function(value) {
				if ('yes' == value) {
					DWREngine.setAsync(false);
					gczlJyxmImpl.uploadApproval(approvalUids,userid,"-1","",function(flag){
					if(flag=="1"){
						Ext.example.msg("提示","上报成功");
						dsWord.reload();
						}
					});					
					DWREngine.setAsync(true);
				}
			}
		});
			
	}
}	
	//保存添加表单
	function wordFormSave() {
		var form = wordFormPanel.getForm();
		var jymbUids = form.findField('jymbUids').getValue();
		if (fileField.getValue() == "" && jymbUids=="") {
			Ext.MessageBox.alert("提示", "请先上传文件，再进行保存操作！")
			return;
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
		for (var i = 0; i < ColumnsWord.length; i++) {
			var n = ColumnsWord[i].name;
			var field = form.findField(n);
			if (field) {
				obj[n] = field.getValue();
			}
		}
		DWREngine.setAsync(false);
		if (obj.uids == '' || obj.uids == null) {
			gczlJyxmImpl.saveOrUpdateApproval(obj, function(state) {
				if ("1" == state) {
					Ext.example.msg('保存成功！', '您成功新增了一条项目验评信息！');			
				} 
			});
		} else {
			gczlJyxmImpl.saveOrUpdateApproval(obj, function(state) {
				if ("2" == state) {
					Ext.example.msg('保存成功！', '您成功修改了一条项目验评信息！');
				}
			});
		}
		DWREngine.setAsync(true);
	}

	function closeWordWinBtn(){
		wordFormWin.hide();
	}
	var root1 = new Ext.tree.TreeNode({
		id:'0',
		text:"0"
	});

	var tabs = new Ext.Panel({
		activeTab : 0,  
		deferredRender : false,
		split : true,
		plain : true,
		border : false,
		region : 'center',
		forceFit : true,
		layout: 'border',
		items : [gridPanelWord]
	});

	// 7. 创建viewport加入面板content
	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [treePanel, tabs]
	});

	if (ModuleLVL < 3) {
		if(query==false){
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
			gridPanelWord.getTopToolbar().add('-', addWordBtn,'-',editWordBtn,'-',delWordBtn,'-',uploadWordBtn);
		}
	}
	

	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};
});
	function openFileRecord(){//下载文件
		var curComFile = selectWordRecord.data;
		var fileid=curComFile.fileid;
//		if(fileid)
//		window.location.href=MAIN_SERVLET+"?ac=downloadFile&fileid="+fileid;
        
		//根据文件流水号，查询文件类型，只有office类型文件才能在线打开
        var filename;
        var suffix;
        var _office = false;
        var sql="select fileid,filename from app_fileinfo where fileid='"+fileid+"'";
        DWREngine.setAsync(false);
        db2Json.selectData(sql, function(jsonData) {
            var list = eval(jsonData);
            if (list != null && list && list[0]) {
                filename = list[0].filename;
            }
        });
        DWREngine.setAsync(true);
        if(filename){
            suffix=filename.substring(filename.lastIndexOf(".")+1,filename.length);  
            if(suffix=="doc"||suffix=="xls"||suffix=="ppt"||suffix=="docx"||suffix=="xlsx"||suffix=="pptx"){
                _office = true;
            }
        }
        if((NTKOWAY!=null&&NTKOWAY==1)&&(_office)){
            var docUrl = BASE_PATH + "jsp/common/open.file.online.jsp" +
                    "?fileid="+fileid+"" +
                    "&filetype=appfile" +
                    "&ModuleLVL="+ModuleLVL;
                window.showModalDialog(docUrl,"","dialogWidth:"
                    + screen.availWidth + "px;dialogHeight:"
                    + screen.availHeight + "px;status:no;center:yes;resizable:yes;Minimize:no;Maximize:yes");
        }else{
            var openUrl = CONTEXT_PATH + "/servlet/BlobCrossDomainServlet" +
                    "?ac=appfile" +
                    "&fileid="+fileid+"" +
                    "&pid="+CURRENTAPPID;
            document.all.formAc.action = openUrl;
            document.all.formAc.submit();
        }
	}

	
