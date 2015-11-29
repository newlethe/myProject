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
var combopermit;
var savePermitBtn,closePermitBtn;
var approvalResult="";
//PID查询条件
var pidWhereString = "pid = '"+CURRENTAPPID+"'"

Ext.onReady(function() {
	var appType = [['0', '不合格'], ['1', '合格']];	
	var dsApp = new Ext.data.SimpleStore({
		fields : ['k', 'v'],
		data : appType
	});
	combopermit = new Ext.form.ComboBox({
			store : dsApp,
			fieldLabel : '请选择是否合格',
			name:"approvalResult",
			id:"approvalResultId",
			displayField : 'v',
			valueField : 'k',
			typeAhead : true,
			mode : 'local',
			triggerAction : 'all',
			emptyText : '请选择是否合格....',
			selectOnFocus : true,
			width : 150,
			listeners : {
				select : comboselect
			}
		});	
	function comboselect(){
		approvalResult=combopermit.getValue();
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
		dsWord.baseParams.params =CURRENTAPPID+" and "+thisNodeBh+" and "+"approval_status<>0";//改变条件
		dsWord.load({params : {	start : 0,limit : PAGE_SIZE}});//刷新Grid
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
	root.expand();
	// -------------------模板管理开始---------------------
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
			return  "<a title='" + value + "' href='javascript:void(0)'  style='color:blue;' onclick='javascript:openFileRecord()'>"+value+"</a>";
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
			params:CURRENTAPPID+" and "+"1"+" and "+"approval_status<>0"
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
	
	var permit = new Ext.Button({
		id : 'permit',
		text : '审批',
		iconCls : 'permit',
		handler : doWordHandler
	})
	var rollback = new Ext.Button({
		id : 'rollback',
		text : '退回',
		iconCls : 'rollback',
		handler : doWordHandler
	})
	var rollpermit = new Ext.Button({
		id : 'rollpermit',
		text : '撤销审批',
		iconCls : 'rollpermit',
		handler : doWordHandler
	})
	var gridPanelWord = new Ext.grid.GridPanel({
		title : '模板管理',
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
		tbar : ['<b><font color=#15428b>验评记录审批</font></b>'],
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
		var approvalStatus=selectWordRecord.data.approvalStatus;
		if(approvalStatus=="-1"){
			permit.setDisabled(false);
			rollback.setDisabled(false);
			rollpermit.setDisabled(true);
		}
		else if(approvalStatus=="1"){
			permit.setDisabled(true);
			rollback.setDisabled(true);
			rollpermit.setDisabled(false);			
		}
		else if(approvalStatus=="-2"){
			permit.setDisabled(true);
			rollback.setDisabled(true);
			rollpermit.setDisabled(true);			
		}		

	})		
	smWord.on('rowdeselect',function(sm, rowIndex, record){
		var approvalStatus=selectWordRecord.data.approvalStatus;
			permit.setDisabled(true);
			rollback.setDisabled(true);
			rollpermit.setDisabled(true);			
	})	
	

	savePermitBtn = new Ext.Button({
		name : 'savePermit',
		text : '保存',
		minWidth : 80,
		handler : permitFormSave
	})	
	
	closePermitBtn = new Ext.Button({
		name : 'closePermit',
		text : '关闭',
		minWidth : 80,
		handler : closePermitWinBtn
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

	function doWordHandler(){
		var btnId = this.id;
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
				case "permit":
					Permit(USERID,1);
					break;
				case "rollback":
					rollBack(USERID,-2);
					break;
				case "rollpermit":
					rollPermit(USERID,-1);
					break;		
				
			}

	}
	

	//保存审批通过
	function permitFormSave(){
		if(approvalResult!=""){
	    	DWREngine.setAsync(false);
			gczlJyxmImpl.uploadApproval(permituids,USERID,permitnewstatus,approvalResult,function(flag){
			if(flag=="1"){
				Ext.example.msg("提示","审批成功");
				dsWord.reload();
				}
			});					
			DWREngine.setAsync(true);	
			approvalResult="";
			permitFormWin.hide();
		}
		else{
			Ext.Msg.alert("提示","请选择是否合格再保存");
		}
	}
	function closePermitWinBtn(){
		approvalResult="";
		combopermit.setValue("");
		permitFormWin.hide();
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
	permit.setDisabled(true);
	rollback.setDisabled(true);
	rollpermit.setDisabled(true);	
	if (ModuleLVL < 3) {	
		gridPanelWord.getTopToolbar().add('-', permit,'-',rollback,'-',rollpermit);
	}
	function formatDate(value) {
		return value ? value.dateFormat('Y-m-d') : '';
	};
	//退回
	function rollBack(userid,newstatus){
		Ext.Msg.show({
		title : '提示！',
		msg : '确认退回吗？',
		buttons : Ext.Msg.YESNO,
		icon: Ext.Msg.QUESTION,
		fn : function(value) {
			if ('yes' == value) {
				DWREngine.setAsync(false);
				gczlJyxmImpl.uploadApproval(selectWordUids,userid,newstatus,"",function(flag){
				if(flag=="1"){
					Ext.example.msg("提示","退回成功");
				    dsWord.reload();
					}
				});					
				DWREngine.setAsync(true);
			}
		}
	});		
	}
	//撤销审批
	function rollPermit(userid,newstatus){
		Ext.Msg.show({
		title : '提示！',
		msg : '确认撤销审批吗？',
		buttons : Ext.Msg.YESNO,
		icon: Ext.Msg.QUESTION,
		fn : function(value) {
			if ('yes' == value) {
				DWREngine.setAsync(false);
				gczlJyxmImpl.uploadApproval(selectWordUids,userid,newstatus,"",function(flag){
				if(flag=="1"){
					Ext.example.msg("提示","撤销审批成功");
					dsWord.reload();
					}
				});					
				DWREngine.setAsync(true);
			}
		}
	});			
	}

	//审批通过
	function Permit(userid,newstatus){
		permituids=selectWordUids;
		permitnewstatus=newstatus;
		if(!permitFormPanel){
			permitFormPanel = new Ext.FormPanel({
				id : 'permit-form-panel',
				header : false,
				border : false,
				layout : 'form',
				region : 'center',
				bodyStyle : 'padding:10px;',
				items : [
				 combopermit
				 ],
				 buttons : [savePermitBtn, closePermitBtn]
		});	
	}
		if(!permitFormWin){
		permitFormWin = new Ext.Window({
			id : 'permit-form-win',
			title : '审批合格选择',
			layout : 'fit',
			width : 300,
			height : 120,
			modal : true,
			plain : true,
			border : false,
			resizable : false,
			closeAction : 'hide',
			items : [permitFormPanel]
		});
		permitFormWin.on("hide",function(){
			combopermit.setValue("");
		});	
	}
		permitFormWin.show();
	}		
});
	function openFileRecord(){//下载文件
        var curComFile = selectWordRecord.data;
        var fileid=curComFile.fileid;
//      if(fileid)
//      window.location.href=MAIN_SERVLET+"?ac=downloadFile&fileid="+fileid;
        
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
	
