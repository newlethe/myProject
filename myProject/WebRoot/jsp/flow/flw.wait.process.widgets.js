var gcltzwc;
var myMask;
Ext.ns("Flw","Flw.wait");
/**
 * 流程日志
 * @class Flw.wait.GridOfLog
 * @extends Ext.grid.GridPanel
 */
Flw.wait.GridOfLog=Ext.extend(Ext.grid.GridPanel ,{
	title:"流程步骤 ",
	border: false,
	header: false, stripeRows: true,
	autoScroll: true,
	loadMask: true,
	viewConfig: {
		forceFit: true,
		ignoreAdd: true
	},
	cm:new Ext.grid.ColumnModel([
		new Ext.grid.RowNumberer({
			width: 20
		}),{
			id: 'logid',
			header: '流转日志ID',
			dataIndex: 'logid',
			hidden: true
		},{
			id: 'insid',
			header: '流程实例ID',
			dataIndex: 'insid',
			hidden: true
		},{
			id: 'ftime',
			header: '发送时间',
			dataIndex: 'ftime',
			width: 90,
			renderer: function (value){
			    return value ? value.dateFormat('Y-m-d H:i:s') : '';
			}
		},{
			id: 'fromname',
			header: '发送人',
			dataIndex: 'fromname',
			width: 80
		},{
			id: 'notes',
			header: '发送人意见',//签署意见',
			dataIndex: 'notes',
			width: 300,
			renderer: function(value,c,r){
				var tempFtype=r.get('ftype');
				var str="";
				if(tempFtype=="T"||tempFtype=="7T"||tempFtype=="TA"){
					str+='<font color=red>【退回】</font>'+value
				}else{
					str+=value;
				}
				if (str.length > 50) return str.substring(0, 50)+'.....详细'
				return str;
			}
		},{
			id: 'ftype',
			header: '流程状态',
			dataIndex: 'ftype',
			width: 150,
			renderer: function(type){
				for (var i = 0; i < F_TYPE.length; i++) {
					if (F_TYPE[i][0] == type) return F_TYPE[i][1];
				}
			},
			hidden: true
		},{
			id: 'orgname',
			header: '受理人部门',
			dataIndex: 'orgname',
			width: 80
		},{
			id: 'posname',
			header: '受理人岗位',
			dataIndex: 'posname',
			width: 80
		},{
			id: 'tonode',
			header: '受理人',
			dataIndex: 'toname',
			width: 80
		},{
			id: 'nodename',
			header: '处理说明',
			dataIndex: 'nodename',
			width: 150
		},{
			id: 'fromnode',
			header: '发送人ID',
			dataIndex: 'fromnode',
			hidden: true
		},{
			id: 'flag',
			header: '处理状态',
			dataIndex: 'flag',
			width: 60,
			renderer: function(value){ return ('0' == value || '-1' == value ? '未完成' : '完成'); }
		}
	]),
	ds : new Ext.data.Store({
		baseParams: {
			ac: 'list',
			bean: "com.sgepit.frame.flow.hbm.TaskView",
			business: "baseMgm",
			method: "findWhereOrderBy",
			params: "insid='"+_insid+"' and fromnode <> 'systemuserid' and tonode <> 'systemuserid'"
		},
		proxy: new Ext.data.HttpProxy({
			method: 'GET',
			url: MAIN_SERVLET
		}),
		reader: new Ext.data.JsonReader({
			root: 'topics',
			totalProperty: 'totalCount',
			id: "logid"
		}, [{name: 'logid', type: 'string'},
			{name: 'insid', type: 'string'},
			{name: 'ftime', type: 'date', dateFormat: 'Y-m-d H:i:s'},
			{name: 'ftype', type: 'string'},
			{name: 'fromname', type: 'string'},
			{name: 'fromnode', type: 'string'},
			{name: 'orgname', type: 'string'},
			{name: 'posname', type: 'string'},
			{name: 'notes', type: 'string'},
			{name: 'toname', type: 'string'},
			{name: 'nodename', type: 'string'},
			{name: 'flag', type: 'string'}
		]),
		remoteSort: true,
		pruneModifiedRecords: true
	}),
	initComponent: function(){
		var _self = this;
		this.cm.defaultSortable = true;
		this.ds.setDefaultSort('ftime', 'asc');
		this.bbar = new Ext.PagingToolbar({
	        pageSize: PAGE_SIZE,
	        store: _self.ds,
	        displayInfo: true,
	        displayMsg: ' {0} - {1} / {2}',
	        emptyMsg: "无记录。"
	    });
		Flw.wait.GridOfLog.superclass.initComponent.call(this);
	}
})
Ext.reg("loggrid",Flw.wait.GridOfLog);
/**
 * 用户信息
 * @class Flw.wait.GridOfUser
 * @extends Ext.grid.GridPanel
 */
Flw.wait.GridOfUser=Ext.extend(Ext.grid.GridPanel, {
	border: false,
	autoScroll: true,
	loadMask: true,
	showtbar: true,
	showbbar: true,
	sm:null,
	ds:null,
	bbar:null,
	cm:null,
	viewConfig: {
		forceFit: true,
		ignoreAdd: true
	},
    initComponent: function(){
    	this.sm = new Ext.grid.CheckboxSelectionModel();
		this.cm = new Ext.grid.ColumnModel([
			this.sm, 
			{
				id: 'userid',header: '主键',	dataIndex: 'userid',hidden: true
			},{
				id: 'username',header: '用户名',	dataIndex: 'username',width: 95
			},{
				id: 'realname',header: '用户姓名',dataIndex: 'realname',width: 95
			},{
				id: 'sex',header: '性别',dataIndex: 'sex',width: 40,
				renderer: function(value){
		       	  if (value!=""){
		       	  	return value=='0' ? "<img src='jsp/res/images/shared/icons/user_suit.gif'>" 
		       	  					: "<img src='jsp/res/images/shared/icons/user_female.gif'>";
		       	  }else{
		       	  	return value;
		       	  }
		       }
			}
		]);
		this.cm.defaultSortable = true;
		if(!this.ds){
			var Columns = [
				{name: 'userid', type: 'string'},
				{name: 'username', type: 'string'},
				{name: 'realname', type: 'string'},
				{name: 'sex', type: 'string'}
			];
			this.ds = new Ext.data.Store({
				baseParams: {
					ac: 'list',
					bean: 'com.sgepit.frame.sysman.hbm.RockUser',
					business: 'systemMgm',
					method: 'findUserByRole'
				},
				proxy: new Ext.data.HttpProxy({
					method: 'GET',
					url: MAIN_SERVLET
				}),
				reader: new Ext.data.JsonReader({
					root: 'topics',
					totalProperty: 'totalCount',
					id: 'userid'
				}, Columns),
				remoteSort: true,
				pruneModifiedRecords: true
			});
			this.ds.setDefaultSort('userid', 'desc');
		};
		var _self = this;
		if(!this.bbar&&this.showbbar){
			this.bbar = new Ext.PagingToolbar({
		        pageSize: PAGE_SIZE,
		        store: _self.ds,
		        displayInfo: true,
		        displayMsg: ' {0} - {1} / {2}',
		        emptyMsg: "无记录。"
		    })
		}
		Flw.wait.GridOfUser.superclass.initComponent.call(this);
    }
});
Ext.reg("usergrid",Flw.wait.GridOfUser);
/**
 * 角色树
 * @class Flw.wait.TreeOfRole
 * @extends Ext.TreePanel
 * @xtype roletree
 */
Flw.wait.TreeOfRole=Ext.extend(Ext.tree.TreePanel ,{
    split:true,
    width: 196,
    minSize: 175,
    maxSize: 500,
    frame: false,
    layout: 'accordion',
    margins:'5 0 5 5',
    cmargins:'0 0 0 0',
    rootVisible: true,
    lines:true,
    autoScroll:true,
    collapsible: true,
    animCollapse:false,
    animate: true,
    collapseMode:'mini',
    collapseFirst:false	,
    tbar:null,
    loader:null,
    root:null,
	initComponent: function(){
		this.tbar = [{
	        iconCls: 'icon-expand-all',
			tooltip: '全部展开',
	        scope:this,
	        handler: function(){ this.root.expand(true); }
	    }, '-', {
	        iconCls: 'icon-collapse-all',
	        tooltip: '全部折叠',
	        scope:this,
	        handler: function(){ this.root.collapse(true); }
	    }];
	    this.loader =  new Ext.tree.TreeLoader({
			preloadChildren: true,
			clearOnLoad: false
		});
	    this.root = new Ext.tree.TreeNode({
		   text: "组织机构",
		   id: 'rootid',
		   expanded: true
		});
		Flw.wait.TreeOfRole.superclass.initComponent.call(this);
	}
})
Ext.reg("roletree",Flw.wait.TreeOfRole);
/**
 * 附件上传
 * @class Flw.wait.WinOfAdjunct
 * @extends Ext.Panle
 */
Flw.wait.WinOfAdjunct = Ext.extend(Ext.Window,{
	title: '附件上传',
	iconCls: 'form',
	width: 650,
	height: 390,
	modal: true,
	closeAction: 'hide',
	maximizable: false,
	resizable: false,
	plain: true,
	autoLoad: {
		url: BASE_PATH + 'jsp/flow/viewDispatcher.jsp',
		params: 'type=uploadAdjunct',
		text: 'Loading...'
	},
	initComponent : function(){
		this.on('beforehide', function(){
			displayOCX(true);
		});
		this.on('beforeshow',function(win){
			displayOCX(false);
		});		
		Flw.wait.WinOfAdjunct.superclass.initComponent.call(this);
	}
});
Ext.reg('adjunctwindow',Flw.wait.WinOfAdjunct);
/**
 * 流程编号窗口
 * @class Flw.wait.WinOfEditFlwNO
 * @extends Ext.Window
 */
Flw.wait.WinOfEditFlwNO = Ext.extend(Ext.Window, {
    title: '修改流程编号',iconCls: 'btn',layout: 'fit',width: 230, height: 150,
	x: 5, y: 240,border: false, closeAction: 'hide',
	modal: true, resizable: false,maximizable: false, plain: true,
	logid:'',//当前日志ID(必须)
	hideHandler:null,
	items:null,
	bbar:null,
    initComponent : function(){
    	var _self = this;
    	this.items = [{
			xtype: 'form', layout: 'form', bodyStyle: 'padding: 5px 8px;', border: false, labelAlign: 'top',
			items: [
				{xtype: 'textarea', fieldLabel: '流程编号', name: 'flwno', id: 'flw_no', width:200,height: 60},
				{xtype: 'textfield', fieldLabel: '以前编号', name: 'old', id: 'old_flw_no', hidden: true, hideLabel: true},
				{xtype: 'textfield', fieldLabel: '流程实例ID', name: 'insid', id: 'ins_id',hidden: true, hideLabel: true}
			]
		}],
		this.bbar = ['->', {text: '保存', iconCls: 'save',scope:_self,handler: _self.saveHandler}],
		this.on("beforeshow",this.beforeshowHandler);
		this.on("hide",this.hideHandler);
        Flw.wait.WinOfEditFlwNO.superclass.initComponent.call(this);
    },
    //显示前调用函数
    beforeshowHandler:function(){
    	var _self = this;
    	if(_self.logid&&_self.logid!=""){
			baseMgm.findById("com.sgepit.frame.flow.hbm.TaskView",this.logid, function(obj){
				if(obj){
					var flwno = obj.flowno?obj.flowno:"";
					var insid = obj.insid?obj.insid:"";
					_self.items.get(0).items.get(0).setValue(flwno);
					_self.items.get(0).items.get(1).setValue(flwno);
					_self.items.get(0).items.get(2).setValue(insid);
				}
			});
		}else{
			Ext.example.msg('提示', '未定义当前日志ID！');
			return false;
		};
    },
    //保存处理
    saveHandler:function(){
    	var _self = this;
		var _thisValue = _self.items.get(0).items.get(0).getValue();
		var _oldValue  = _self.items.get(0).items.get(1).getValue();
		var _flwInsId  = _self.items.get(0).items.get(2).getValue();
		if (_oldValue == _thisValue){
			Ext.example.msg('提示', '没做任何修改！');
		} else if (_thisValue == ''){
			Ext.example.msg('提示', '不能为空！');
		} else {
			flwInstanceMgm.saveFlwNo(_flwInsId, _thisValue, function(){
				Ext.example.msg('提示', '保存成功！');
				_self.hide();
			});
		}
	}
});
Ext.reg('flwnowindow',Flw.wait.WinOfEditFlwNO);
/**
 * 接受人窗口 (流程发送)
 * @class Flw.wait.WinOfUser
 * @extends Ext.Window
 */
Flw.wait.WinOfUser = Ext.extend(Ext.Window,{
	title: '接受人列表',
	iconCls: 'form',
	layout: 'border',
	width: 600, height: 300,
	modal: true,
	closeAction: 'hide',
	maximizable: false,
	plain: true,
	record:null,
	confirmHandler:Ext.emptyFn,
	cmgridTitleBar:null,
	items:null,
	getUserGrid : function(){
		return this.items.get(1);
	},
	getRoleTree : function(){
		return this.items.get(0);
	},
	initComponent:function(){
		var _self = this;
		if(!this.items){
			this.cmgridTitleBar = new Ext.Button({
				text: '<font color=#15428b><b>&nbsp;用户列表，请选择角色</b></font>',
				iconCls: 'form'
			});
			this.items = [{
				xtype: 'roletree',
				region: 'west',
				listeners:{
					'click':function(node,e){
						var titles = [node.text];
						var obj = node.parentNode;
						while(obj!=null){
							if ("组织机构"!=obj.text) titles.push(obj.text);
							obj = obj.parentNode;
						}
						var title = titles.reverse().join(" / ");
						var setTitle = '<font color=#15428b><b>&nbsp;'+title+'</b></font>';
						_self.cmgridTitleBar.setText(setTitle);
						//点击"默认流程发起人"节点，只会显示当前流程发起人
						if(_self.record&&_self.record.get('userid')&&_self.record.get('userid')==node.id){
							var cms=[
							            {name: 'userid', type: 'string'},
							            {name: 'username', type: 'string'},
							            {name: 'realname', type: 'string'},
							            {name: 'sex', type: 'string'}
							        ];
							var formRecord = Ext.data.Record.create(cms);
							var rec=null;
							DWREngine.setAsync(false);
							baseDao.findById(userBean,node.id,function(roleuser){
								rec = new formRecord({
									userid :roleuser.userid,
									username : roleuser.useraccount,
									realname : roleuser.realname,
									sex : roleuser.sex
								});
							})
							DWREngine.setAsync(true);
							_self.items.get(1).getStore().removeAll();
						   	_self.items.get(1).getStore().add(rec);
						}else{
							_self.items.get(1).getStore().baseParams.params = "roleid"+SPLITB+node.id;
							_self.items.get(1).getStore().load({
								params:{
								 	start: 0,
								 	limit: PAGE_SIZE
								}
							});
						}
					}
				}
			},{
				xtype: 'usergrid',
				region: 'center',
				showtbar: true,
				tbar: [_self.cmgridTitleBar, '->', {
					text: '确定',
					iconCls: 'save',
					scope:_self,
					handler: _self.confirmHandler
				}]
			}]
		}
		Flw.wait.WinOfUser.superclass.initComponent.call(this);
	},
	onRender : function(ct, position) {
		Flw.wait.WinOfUser.superclass.onRender.call(this, ct, position);
	},
	clearChildNodes:function(n){
		if (n.childNodes.length > 0){
			n.childNodes[0].remove();
			this.clearChildNodes(n);
		}
	},
	buildRoleTree:function(){
		var tree = this.items.get(0);
		var root = tree.getRootNode();
		if(this.record){
			this.clearChildNodes(root);
			var _selectRoles = this.record.get('role').split(',');
			DWREngine.setAsync(false);
			for (var i = 0; i < _selectRoles.length; i++) {
				baseMgm.findById(roleBean, _selectRoles[i], function(obj){
					var node = new Ext.tree.TreeNode({
				 		id: obj.rolepk,
				 		text: obj.rolename,
						leaf: true,
						cls: "cls",
						iconCls: "icon-cmp"
				 	});
					root.appendChild(node);
				});
			}
			DWREngine.setAsync(true);
			//当下一个接收节点的处理人类型是："流程发起人（P）"，组织结构中就需添加"默认流程发起人"子节点
			if(this.record.get('istopromoter')&&this.record.get('istopromoter')=="P"){
				var node1 = new Ext.tree.TreeNode({
			 		id: this.record.get('userid'),
			 		text: "默认流程发起人",
					leaf: true,
					cls: "cls",
					iconCls: "icon-cmp"
			 	});
				root.appendChild(node1);
			}
			tree.getLoader().load(root);
			root.expand();
		}else{
			systemMgm.getRoles(function(list){
				for(var i=0; i<list.length; i++) {
				 	var node = new Ext.tree.TreeNode({
				 		id: list[i].rolepk,
				 		text: list[i].rolename,
						leaf: true,
						cls: "cls",
						iconCls: "icon-cmp"
				 	});
					root.appendChild(node);
				}
				tree.getEl().unmask();
			});
		}
	}
});
Ext.reg("userwindow",Flw.wait.WinOfUser);
/**
 * 抄送
 * @class Flw.wait.SendFIleWindow
 * @extends Ext.Window
 * @xtype sendfilewindow
 */
Flw.wait.WinOfSendFile=Ext.extend(Ext.Window ,{
	title: '文件抄送',
	iconCls: 'option',
	layout: 'border',
	width: 310, height: 360,
	modal: true, resizable: false,
	closable: false, 
	maximizable: false, plain: true,
	userwin: null,
	items:null,
	bbar:null,
	initComponent: function(){
		var _self = this;
		this.items=[{
			xtype:"form",
			region:'north',
			header: false, border: false,
			bodyStyle: 'padding:10px 10px;',
			iconCls: 'icon-detail-form',
			height:40,
			labelAlign: 'left',
			items:[{
				xtype:"panel",
				layout:"table",
				layoutConfig: {columns: 2}, 
				border: false,
				items: [{
					width: 215, layout: 'form', border: false,
					items: [{xtype: 'textfield', fieldLabel: '接收人', hidden: true}]
				},{
					width: 60, layout: 'form', border: false,
					items: [{
							xtype: 'button', text: '选择', iconCls: 'select', tooltip: '选择抄送接收人', 
							handler: function(){
								if(!_self.userwin){
									_self.userwin = new Flw.wait.WinOfUser({
										id:'user2',
										closeAction:'hide',
										confirmHandler:function(){
											var selectRecords = this.getUserGrid().getSelectionModel().getSelections();
											if (selectRecords.length > 0){
												var chooseData = new Array();
												for (var i = 0; i < selectRecords.length; i++){
													var obj = new Array();
													obj.push(selectRecords[i].get('userid'));
													obj.push(selectRecords[i].get('username'));
													obj.push(selectRecords[i].get('realname'));
													obj.push(selectRecords[i].get('sex'));
													chooseData.push(obj);
												}
												_self.items.get(1).getStore().loadData(chooseData);
												_self.userwin.hide();
											}
										},
										listeners:{
											'beforeshow':function(cmp){
												cmp.buildRoleTree();
											}
										}
									});
								}
								_self.userwin.show();
							} 
					}]
				}]
			}]
		},{
			xtype:"usergrid",
			title: '已选择的用户',
			region:'center',
	        header: true,
	        iconCls: 'icon-show-all',
	        showtbar:false,
	        showbbar:false,
	    	ds: new Ext.data.SimpleStore({
	    		fields: [
		            {name: 'userid', type: 'string'},
		            {name: 'username', type: 'string'},
		            {name: 'realname', type: 'string'},
		            {name: 'sex', type: 'string'}
		        ]
	    	})
		}];
		this.bbar =  ['->',{
				text: '取消',
				iconCls: 'remove',
				handler: function(){
					_self.items.get(1).getStore().loadData(new Array());
					_self.hide();
				}
			}, '-', {
				text: '发送', 
				iconCls: 'returnTo', 
				handler: function(){
					var baseForm = _self.items.get(0).getForm();
					var userGrid = _self.items.get(1);
					if (baseForm.isValid()){
						if (userGrid.getSelectionModel().getSelections()<1){
							Ext.example.msg('提示', '请先选择[接收用户]！');
						} else {
							Ext.Msg.show({
								title: '提示',
								msg: '确定要抄送所有文件吗？　　　　',
								buttons: Ext.Msg.YESNO,
								icon: Ext.MessageBox.QUESTION,
								fn: function(value){
									if ('yes' == value) {
										var records = userGrid.getSelections();
										var logList = new Array();
										var logStr="";
										for (var i=0; i<records.length; i++) {
											var record = records[i];
											var fromnode = _userid;
											var tonode = record.get('userid');
											var ftime = new Date();
											var ftype = 'S';
											var notes = '文件传阅';
											var flag = '0';
											var nodename = '传阅抄送(非流程节点)';
											var nodeid = '';
											logStr+=fromnode+"`"+tonode+"`"+ftime+"`"+ftype+"`"+notes+"`"+flag+"`"+nodename+"`"+nodeid+"##";
										}
										//flwLogMgm.sendFileToOthers(_insid, logList, function(flag){
										flwLogMgm.sendFileToOthers(_insid, logStr, function(flag){
											if (flag){
												Ext.example.msg('提示', '文件抄送成功!');
												_self.hide();
												userGrid.getStore().loadData(new Array());
												if(FlwButtons&&FlwButtons.sendFileBtn){//屏蔽【抄送】按钮
													FlwButtons.sendFileBtn.disable();
												}
											}
										});
									}
								}
							});//end of Ext.msg.show
						}
					}
				}
			}
		],
		this.on('beforeshow',function(){
			displayOCX(false);
		});
		this.on('beforehide',function(){
			displayOCX(true);
		});
		Flw.wait.WinOfSendFile.superclass.initComponent.call(this);
	}
})
Ext.reg("sendfilewindow",Flw.wait.WinOfSendFile);
/**
 * 发送到普通节点
 * @class Flw.wait.WinOfSend2Cnode
 * @extends Ext.Window
 */
Flw.wait.WinOfSend2Cnode=Ext.extend(Ext.Window ,{
	title: '普通节点',
	iconCls: 'form',
	layout: 'fit',
	width: 310, height: 260,
	modal: true, resizable: false,
	closable: true, border: false,
	maximizable: false, plain: true,
	sendHandler:null,//发送到下一步函数
	closeAction: 'hide',
	flwNode:{},
	sendtoall:false,//发送到grid的所有记录对应的用户(无条件分裂或只有一条记录时，不再显示选择框)
	bbar:null,
	items:null,
	_userid:null,
	initComponent: function(){
		var currentCnodes = this.flwNode.currentCnodes?this.flwNode.currentCnodes:new Array();
		var stateCnodes = this.flwNode.stateCnodes?this.flwNode.stateCnodes:new Array();
		var _self = this;
		if(!this.sendHandler) this.sendHandler = this.defaultSendHandler;
		
		if(currentCnodes&&currentCnodes.length==5&&currentCnodes[2]=='BALL') this.sendtoall = true;//无条件分裂
		if(stateCnodes&&stateCnodes.length==1) this.sendtoall=true;//只有一个普通节点和当前普通节点连接
		
		var sm = new Ext.grid.CheckboxSelectionModel(Ext.apply({},{
			header:"",
			//普通节点时，如果有多个可选节点，则只能选择一个节点
			singleSelect : currentCnodes&&currentCnodes.length==5&&currentCnodes[2]=='S'?true:false
		}));
		this.items=[{
			border: false,
			header: false,
			autoScroll: true,
			clicksToEdit: 1,
			loadMask: true, stripeRows: true,
			viewConfig: {
				forceFit: true,
				ignoreAdd: true
			},
			xtype:"editorgrid",
			sm:sm,
			cm: new Ext.grid.ColumnModel([sm, 
				{id: 'userid',header: '用户ID',dataIndex: 'userid',hidden: true}, 
				{id: 'cnodeid',header: '普通节点ID',dataIndex: 'cnodeid',hidden: true	}, 
				{id: 'role',header: '角色范围',dataIndex: 'role',	hidden: true}, 
				{id: 'name',header: '下一步名称',	dataIndex: 'name',width: .6}, 
				{id: 'realname',header: '处理人(可选)',dataIndex: 'realname',	width: .4,
					editor: new Ext.form.TriggerField({
    					name: 'realname',
    					triggerClass: 'x-form-date-trigger',
    					readOnly: true, selectOnFocus: true,
    					onTriggerClick: function(){
							var userWin = Ext.getCmp('usr1');
							var tempRecord = _self.items.get(0).getSelectionModel().getSelected();
    						var Ext_record = Ext.data.Record.create([{name:'role',type:'string'},{name: 'istopromoter', type: 'string'},{name: 'userid', type: 'string'}]);
    						var cRecord = new Ext_record({role:tempRecord.get('role'),istopromoter:tempRecord.get('istopromoter'),userid:_self._userid});
							if(!userWin){
								userWin = new Flw.wait.WinOfUser({
									id:'usr1',
									record:cRecord,
									confirmHandler:function(){
										var records = this.items.get(1).getSelections();
										var thisRecord = _self.items.get(0).getSelectionModel().getSelected();
										if (thisRecord&&records.length > 0){
											thisRecord.set('userid', records[0].get('userid'));
											thisRecord.set('realname', records[0].get('realname'));
											this.hide();
										}
									},
									listeners:{
										'beforeshow':function(cmp){
											cmp.buildRoleTree();
										}
									}
								});
							}else{
								userWin.record = cRecord;
							}
							userWin.show();
    					}
    				}),
    				renderer: function(value){
    					return "<div>"+value+"<img src='"+BASE_PATH+"jsp/res/images/icon-by-date.gif' " +
    							"style='vertical-align:middle; position: absolute; left: 85px;'></div>";
    				}
				},
				{id: 'istopromoter',header: '处理人类型',dataIndex: 'istopromoter',	hidden: true}
			]),
			ds: new Ext.data.SimpleStore({
				fields: [
					{name: 'userid', type: 'string'},
					{name: 'role', type: 'string'},
					{name: 'cnodeid', type: 'string'},
					{name: 'name', type: 'string'},
					{name: 'realname', type: 'string'},
					{name: 'istopromoter', type: 'string'}
				]
			})
		}];
		if(this.sendtoall){//无条件分裂或只有一条记录时，隐藏checkbox列
			this.items[0].cm.setHidden(0,true);
		};
		this.bbar = ['->',{
			text: '取消',	iconCls: 'remove',	handler: function(){_self.hide();}
		  }, '-', {
			text: '发送',	iconCls: 'returnTo',
			handler: function(){
				Ext.Msg.show({
					title: '提示',
					msg: '您确定要发送流程吗？',
					buttons: Ext.Msg.YESNO,
					icon: Ext.Msg.WARNING,
					fn: function(value){
						if ('yes' == value) {
								_self.sendHandler()
						}
					}
				})
			}
		}];
		this.on('beforeshow',function(){
			var commonDs = new Array(); 
			displayOCX(false);
			var stateCnodes = this.flwNode.stateCnodes?_self.flwNode.stateCnodes:new Array();
			for (var i=0; i<stateCnodes.length; i++){
				var temp = new Array();
				DWREngine.setAsync(false); 
				baseDao.findByWhere2(commonNodeBean, "cnodeid='"+stateCnodes[i][0]+"' and flowid='"+_flowid+"'", function(list){
					if(list[0].istopromoter=="P"){//如果下一个接收节点的处理人类型是："流程发起人（P）"，则默认处理人修改为流程发起人
						flwLogMgm.getFlowActionPerson(_insid, function(user){
							temp.push(user.userid);
							temp.push(list[0].role);
							temp.push(list[0].cnodeid);
							temp.push(list[0].name);
							temp.push(user.realname);
							temp.push(list[0].istopromoter);
							_self._userid = user.userid;
						});
					}else{
						temp.push(list[0].handler);
						temp.push(list[0].role);
						temp.push(list[0].cnodeid);
						temp.push(list[0].name);
						baseMgm.findById(userBean, list[0].handler, function(o){
							temp.push(o.realname);
						});
						temp.push(list[0].istopromoter);
					}
				});
				DWREngine.setAsync(true); 
				commonDs.push(temp);
			}
			this.items.get(0).getStore().loadData(commonDs);
		});
		this.on('beforehide',function(){
			displayOCX(true);
		});
		Flw.wait.WinOfSend2Cnode.superclass.initComponent.call(this);
	},
	defaultSendHandler : function(){
		var THIS=this;
		if(!noteArea) return;//签署意见的面板不存在
		var notes = noteArea.getValue();
		if(notes=="") {
			Ext.example.msg('提示','请先填签署意见?');
			return;
		};
		this.getBottomToolbar().setDisabled(true);
		var records = new Array();
		if(this.sendtoall){
			//无条件分裂
			var ds = this.items.get(0).getStore();
			ds.each(function(r){
				records.push(r)
			})
		}else{
			records = this.items.get(0).getSelectionModel().getSelections();
		}
		if (records.length > 0) {
			this.getEl().mask();
			var currentNodes = this.flwNode.currentNodes;
			var currentCnodes = this.flwNode.currentCnodes;
			var logList = new Array();
			//是否发送即时短信
			var isSendMsg = false;
			DWREngine.setAsync(false);
			for (var i=0; i<records.length; i++) {
				var record = records[i];
				var obj_log = new Object();
				obj_log.fromnode = _userid;
				obj_log.tonode = record.get('userid');
				obj_log.ftime = new Date();
				obj_log.ftype = 'P';
				obj_log.notes = notes;
				obj_log.flag = '0';
				obj_log.nodename = record.get('name');
				obj_log.nodeid = record.get('cnodeid');
				logList.push(obj_log);
			}
			flwLogMgm.sendToCommonFlow(_logid,_insid, currentNodes[0], currentCnodes[0], Ext.encode(logList), function(flag){
				if (flag){
					isSendMsg = true;
					THIS.spread(false);
					window.location.href = BASE_PATH + 'jsp/flow/flw.main.frame.jsp';
				}
			});
			DWREngine.setAsync(true);
			if (isSendMsg){
				flwLogMgm.sendMsgNow(_insid, _logid, Ext.encode(logList), function(){});
			}
		} else {
			this.getBottomToolbar().setDisabled(false);
			Ext.example.msg('提示', '请选择发送人！');
		}
	},
	spread:function(bool){//展开收缩处理
		if(bool){
			if(top&&top.collapsedWestAndNorth){
				top.collapsedWestAndNorth();
			}
		}else{
			if(top&&top.expandWestAndNorth){
				top.expandWestAndNorth();
			}
		}
	}
})
Ext.reg("commonwin",Flw.wait.WinOfSend2Cnode);
/**
 * 发送到状态节点
 * @class Flw.wait.WinOfSend2Node
 * @extends Ext.Window
 * 参数说明
 */
Flw.wait.WinOfSend2Node=Ext.extend(Ext.Window ,{
	title: '下一步操作',
	iconCls: 'refresh',
	layout: 'fit',
	width: 520, height: 300,
	modal: true,
	closeAction: 'hide',
	maximizable: true,
	plain: true,
	sendHandler:null,
	flwNode:{},
	items:null,
	roles:null,
	_istopromoter:null,
	_userid:null,
	initComponent: function(){
		var _self = this;
		var stateNode = this.flwNode.stateNodes?this.flwNode.stateNodes:new Array();
		if(!this.sendHandler) this.sendHandler = this.defaultSendHandler;
		this.items=[{
			xtype:"form",
			header: false, border: false,
			bodyStyle: 'padding:10px 10px;',
			iconCls: 'icon-detail-form',
			labelAlign: 'left',
			layout: 'column',
			items:[{
				columnWidth: .5, layout: 'form', border: false,
				items: [{
					xtype:'textfield',name: 'currentNode', fieldLabel: '当前流程',readOnly: true
				
				},{
					xtype: 'hidden', name: 'selhandlerid', fieldLabel: '指定处理人'
				},{
					xtype:'trigger',name: 'selhandler', fieldLabel: '指定处理人<br>(可选)',
					triggerClass: 'x-form-date-trigger',readOnly: true, selectOnFocus: true,width: 125,
					onTriggerClick: function(){
						var form = _self.items.get(0).getForm();
						if (form.findField('defhandlerid').getValue() != ''){
							var userWin = Ext.getCmp('usr');
							var Ext_record = Ext.data.Record.create([{name:'role',type:'string'},{name: 'istopromoter', type: 'string'},{name: 'userid', type: 'string'}]);
    						var cRecord = new Ext_record({role:_self.roles,istopromoter:_self._istopromoter,userid:_self._userid});
							if(!userWin){
								userWin = new Flw.wait.WinOfUser({
									id:'usr',
									record:cRecord,
									confirmHandler:function(){
										var records = this.items.get(1).getSelections();
										if (records.length > 0){
											var filed1 = _self.items.get(0).items.get(0).items.get(1);
											var filed2 = _self.items.get(0).items.get(0).items.get(2);
											filed1.setValue(records[0].get('userid'));
											filed2.setValue(records[0].get('realname'));
											this.hide();
										}
									},
									listeners:{
										'beforeshow':function(cmp){
											cmp.buildRoleTree();
										}
									}
								});
							}else{
								userWin.record = cRecord;
							}
							userWin.show();
						} else {
							Ext.example.msg('提示', '请先选择[可选下一步操作列表]！');
						}
					}
				},{
					xtype: 'textfield', name: 'defhandlerid', fieldLabel: '默认处理人', hidden: true, hideLabel: true
				}]
			},{
				columnWidth: .5, layout: 'form', border: false,
				items: [{
					xtype:'combo',name: 'statenodes', fieldLabel: '进行下一步流程',
					valueField: 'k', displayField: 'v',	emptyText: '可选流程列表...', 
					mode: 'local', typeAhead: true, editable: false,
					width: 125, triggerAction: 'all', disabled: false,
					lazyRender: true,listClass: 'x-combo-list-small',allowBlank: false,
					store:new Ext.data.SimpleStore({
						fields: ['k', 'v'],
						data: stateNode
					}),
					listeners:{
						'select' : function(combo, record, index){
							var form = _self.items.get(0).getForm();
							DWREngine.setAsync(false); 
							baseMgm.findById(nodeBean, record.get('k'), function(obj){
								/* -- modified by Liuay 2011-07-20 不对结束节点特殊处理*/
								if ("P"==obj.istopromoter){//如果下一个接收节点的处理人类型是："流程发起人（P）"，则默认处理人修改为流程发起人
									flwLogMgm.getFlowActionPerson(_insid, function(user){
										form.findField('defhandlerid').setValue(user.userid);
										form.findField('defhandler').setValue(user.realname);
										form.findField('selhandlerid').setValue(user.userid);
										form.findField('selhandler').setValue(user.realname);
										_self._userid = user.userid;
									});
								} else {
								
									form.findField('defhandlerid').setValue(obj.handler);
									form.findField('selhandlerid').setValue(obj.handler);
									baseMgm.findById(userBean, obj.handler, function(o){
										form.findField('defhandler').setValue(o.realname);
										form.findField('selhandler').setValue(o.realname);
									});
									_self._userid = obj.handler;
								}
								
								_self.roles = obj.role;
								_self._istopromoter = obj.istopromoter;
							});
							DWREngine.setAsync(true); 
						}
					}
				},{
					xtype: 'textfield', name: 'defhandler', fieldLabel: '默认处理人', readOnly: true, hidden: true, hideLabel: true
				}]
			}],
			bbar: ['->', {text: '确定', iconCls: 'returnTo', scope:_self,handler: _self.defaultSendHandler}]
		}]
		
		this.on('show', function(){
			var THIS = this;
			var nodeCombo = this.items.get(0).items.get(1).items.get(0);
			if(nodeCombo.store.getCount()==0) return; 
			nodeCombo.fireEvent('select', nodeCombo, nodeCombo.store.getAt(0), 0);
			nodeCombo.setValue(nodeCombo.store.getAt(0).get('k'));
			nodeCombo.setRawValue(nodeCombo.store.getAt(0).get('v'));
			
//			baseMgm.findById(nodeBean, nodeCombo.getValue(), function(obj){
//				THIS.roles = obj.role;
//			});
			
			var currNodeText = this.items.get(0).items.get(0).items.get(0)
			if(this.flwNode.currentNodes&&this.flwNode.currentNodes.length>1){
				currNodeText.setValue(this.flwNode.currentNodes[1]);
			}
		});
		this.on('beforehide',function(){
			displayOCX(true);
		});
		Flw.wait.WinOfSend2Node.superclass.initComponent.call(this);
	},
	defaultSendHandler : function(){
		var THIS=this;
		if(!noteArea) return;//签署意见的面板不存在
		var notes = noteArea.getValue();
		if(notes=="") {
			Ext.example.msg('提示','请先填签署意见?');
			return;
		};
		var changePanel = this.items.get(0);
		var baseForm = changePanel.getForm();
		if (baseForm.isValid()){
			Ext.Msg.show({
				title: '提示',
				msg: '确定要进行下一步操作吗？　　　　',
				buttons: Ext.Msg.YESNO,
				icon: Ext.MessageBox.WARNING,
				fn: function(value){
					if ('yes' == value) {
						THIS.items.get(0).getBottomToolbar().setDisabled(true);
						THIS.getEl().mask();
						var handler = '';
						if (baseForm.findField('selhandlerid').getValue() == ''){
							handler = baseForm.findField('defhandlerid').getValue();
						} else {
							handler = baseForm.findField('selhandlerid').getValue();
						}
						var nodeid = baseForm.findField('statenodes').getValue();
						var nodename = baseForm.findField('statenodes').getRawValue();
						var obj_log = new Object();
						obj_log.fromnode = _userid;
						obj_log.tonode = handler;
						obj_log.ftime = new Date();
						obj_log.ftype = '7';
						obj_log.notes = notes;
						obj_log.flag = 0;
						obj_log.nodename = nodename;//'状态节点';
						obj_log.nodeid = nodeid;
						//是否发送即时短信
						var isSendMsg = false;
						var logList = new Array();
						logList.push(obj_log);
						DWREngine.setAsync(false); 
						flwLogMgm.sendToStateFlow(obj_log, _logid, nodeid, function(flag){
							if (flag){
								isSendMsg = true;
								if (_userid == handler) {
									baseDao.findByWhere2("com.sgepit.frame.flow.hbm.TaskView", "flowid='"+_flowid+"' and insid='"+_insid+"' and tonode='"+_userid+"' and flag=0", function(list){
										if (list.length > 0){
											var log = list[0];
											var url = BASE_PATH + 'jsp/flow/flw.wait.process.jsp';
											window.location.href = url + '?logid='+log.logid
													+'&flowid='+log.flowid+'&title='+encodeURIComponent(log.title)
													+'&insid='+log.insid+'&ftype='+log.ftype
													+'&currentDocNode='+nodeid+'&fromnode='+log.fromnode;
										} else {
											THIS.spread(false);
											window.location.href = BASE_PATH + 'jsp/flow/flw.main.frame.jsp';
										}
									});
								} else {
									THIS.spread(false);
									window.location.href = BASE_PATH + 'jsp/flow/flw.main.frame.jsp';
								}
							}
						});
						DWREngine.setAsync(true);
						if (isSendMsg){
							flwLogMgm.sendMsgNow(_insid, _logid, Ext.encode(logList), function(){});
						}
					}
				}
			});
		} else {
			Ext.example.msg('提示', '请先选择[可选择下一步操作列表]！');
		}
	},
	spread:function(bool){//展开收缩处理
		if(bool){
			if(top&&top.collapsedWestAndNorth){
				top.collapsedWestAndNorth();
			}
		}else{
			if(top&&top.expandWestAndNorth){
				top.expandWestAndNorth();
			}
		}
	}
})
Ext.reg("statewindow",Flw.wait.WinOfSend2Node);
/**
 * 任务接口窗口
 * @class Flw.wait.WinOfFaceParams
 * @extends Ext.Window
 * 扩展参数说明：
 * fields：定义的接口参数数组，如[faceParamsBean1,faceParamsBean2]  【必须参数】
 * taskParams：保存过的接口参数，如[[名称1,值1],[名称2,值2]]          【必须参数】
 * faceName：接口名称
 */
Flw.wait.WinOfFaceParams=Ext.extend(Ext.Window ,{
	title: '填写任务接口参数值',
	iconCls: 'btn',
	layout: 'fit',
	width: 410, height: 360,
	modal: true, resizable: false,
	closable: false, border: false,
	maximizable: false, plain: true,
	faceName:'任务参数',
	taskParams : null,//本流程实例走过的任务中的参数-键值对
	fields : null,//任务接口Array
	currentNode: "",//当前状态节点【必须参数】
	paramFs:null,
	fieldSet:null,
	bbar:null,
	items:null,
	findTaskParams :function(faceName,pname){
		var savedParams = this.taskParams;
		return getTaskParamValue(savedParams,faceName,pname);
	},
	initComponent: function(){
		var _self = this;
		this.paramFs = new Ext.form.FieldSet({
			title: '任务参数', hidden: true
		});
		this.fieldSet = new Ext.form.FieldSet({
			title: _self.faceName
		});
		//本流程实例走过的任务中的参数-键值对
		if(_self.taskParams&&_self.taskParams.length&&_self.taskParams.length>0){
			for(var t=0; t<_self.taskParams.length; t++){
				var fieldObj = {
					xtype: 'textfield', 
					fieldLabel: _self.taskParams[t][0], 
					value: _self.taskParams[t][1], 
					readOnly: true
				};
				_self.paramFs.add(fieldObj);
			}
		};
		if(_self.fields&&_self.fields.length&&_self.fields.length>0){
			var faceName = _self.faceName;
			for(var i=0; i<_self.fields.length; i++){
				var fieldParam = _self.fields[i];
				var fieldObj = {//公共属性
					fieldLabel: fieldParam.pcname, 
					width: 200,
					name: fieldParam.pname,
					biz:fieldParam.biz,
					failmsg:fieldParam.failmsg,
					isexist:fieldParam.isexist,
					validatefn:fieldParam.validatefn,
					triggertype:fieldParam.ontrigger,
					onTriggerClick : window['triggerClick']?triggerClick:Ext.emptyFn,
					allowBlank: false
				};
				if(fieldParam.ontrigger!=null){//可以选择合同、物资等信息。可以自定义一些选择窗口
					fieldObj.xtype = 'trigger';
					fieldObj.triggerClass = 'x-form-date-trigger';
					fieldObj.value = _self.findTaskParams(faceName, fieldParam.pname);
				}else{
					if (fieldParam.ptype == 'string') {
						fieldObj.xtype = 'textfield';
						fieldObj.value = _self.findTaskParams(faceName, fieldParam.pname);
					} else if (fieldParam.ptype == 'float') {
						fieldObj.xtype = 'numberfield';
						fieldObj.maxValue = 10000000000;
					} else if (fieldParam.ptype == 'date') {
						fieldObj.xtype = 'datefield';
						fieldObj.format = 'Y-m-d';
						fieldObj.minValue = '2000-01-01';
					}
				}
				
				for(var t=0; t<this.taskParams.length; t++){
					if (this.taskParams[t][0] == fieldParam.pname && this.taskParams[t][1]!=null && this.taskParams[t][1]!="") {
						fieldObj.disabled = true;
						break;
					}
				}
				_self.fieldSet.add(fieldObj);
			};
		};	
		this.bbar = [{
			xtype:'tbfill'
		},{
			text: '<font color=#15428b>取消</font>',
			handler: function(){
				window.location.href = BASE_PATH + 'jsp/flow/flw.main.frame.jsp';
			}
		},{
			xtype:'tbseparator'
		},{
			text: '<font color=#15428b>确定</font>',
			scope:_self,
			handler: _self.saveFaceValue
		}];
		this.items=[{
				header: false,
				border: false,
				layout:"form",
				xtype:"form",
				bodyStyle: 'padding: 10px 10px;',
				labelAlign: 'right',
				autoScroll: true,
				items:[_self.paramFs,_self.fieldSet]
			}
		]
		Flw.wait.WinOfFaceParams.superclass.initComponent.call(this);
	},
	checkDataIsExist : function(bean, where){
		var flag = false;
		DWREngine.setAsync(false); 
		baseDao.findByWhere2(bean, where, function(list){
			flag = (list.length > 0) ? true : false;
		});
		DWREngine.setAsync(true); 
		return flag;
	},
	//保存参数
	saveFaceValue: function(){
		var _self = this;
		var baseForm = _self.items.get(0).getForm();
		if (baseForm.isValid()){
			var fields = _self.fieldSet.items;
			var paramValues = "";
			for(var i=0; i<fields.length; i++){
				var field = fields.get(i);
				var fieldvalue = field.getValue();
				if(fieldvalue==""){
					Ext.example.msg('提示', '请填写参数数值！');
					return
				}else if(_self.validatefn){
					_self.validatefn(field);
				}else{
					if(field.biz&&field.biz!=""){
						var isexist = field.isexist?field.isexist:"-1";//1存在时验证失败,-1不存在时验证失败
						var flag = _self.checkDataIsExist(field.biz, field.getName()+"='"+fieldvalue+"'");
						if(isexist=="1"){
							if (flag){
								var failmag = (field.failmsg&&field.failmsg!="")?field.failmsg:"业务数据已存在!";
								var t = new Ext.Template(failmag);
								failmag = t.applyTemplate({VALUE:fieldvalue});
								Ext.example.msg('提示', failmag);
								field.getEl().dom.select();
								return;
							}
						}else{
							if (!flag){
								var failmag = (field.failmsg&&field.failmsg!="")?field.failmsg:"业务数据不存在!";
								var t = new Ext.Template(failmag);
								failmag = t.applyTemplate({VALUE:fieldvalue});
								Ext.example.msg('提示', failmag);
								field.getEl().dom.select();
								return;
							}
						}
					}
				};
				
				if(field.getXType() == 'textfield'||field.getXType() == 'trigger'){
					paramValues += field.getName()+":"+field.getValue()+":string`";	
				} else if(field.getXType() == 'numberfield'){
					paramValues += field.getName()+":"+fieldvalue+":float`";	
				} else if(f.getXType() == 'datefield'){
					paramValues += field.getName()+":"+fieldvalue+":date`";	
				} 
			};
			paramValues = paramValues.substring(0, paramValues.lastIndexOf('`'));
			flwFrameMgm.insertFaceParamsIns(_insid, _self.currentNode, paramValues, function(){
				Ext.example.msg('提示', '成功保存任务接口参数值！');
				_self.hide();
				if(window['ProcessTask']){
					ProcessTask();
				}
			});
		}
	}
});
Ext.reg("facewin",Flw.wait.WinOfFaceParams);
/**
 * 签字处理
 * @class Flw.wait.WinOfSign
 * @extends Ext.Window
 */
Flw.wait.WinOfSign=Ext.extend(Ext.Window ,{
	title: '请输入密码',
	iconCls: 'key', layout: 'fit',
	closeAction: 'hide',
	width: 300, height: 140,
	modal: true, resizable: false,
	closable: true, border: false,
	maximizable: false, plain: true,
	initComponent: function(){
		var _self = this;
		var defPassword = "";
		if(FlwControl&&FlwControl.defPassword) defPassword = FlwControl.defPassword;
		this.items=[{
			header: false, border: false,
			bodyStyle: 'padding: 20px 0px;',
			labelAlign: 'right',
			xtype:'form',
			items: [
				{xtype: 'textfield', name: 'username', fieldLabel: '用户名', readOnly: true, value: USERNAME},
				{xtype: 'textfield', name: 'password', fieldLabel: '密　码', inputType : 'password',value:defPassword,
				    listeners:{
				 	 	specialkey:function(pwdField,ev){
					 		if(ev.getKey()==13){
					 			_self.valPass();
					 		} 
					 	} 
					}
				}
			],
			bbar: ['->',{text: '确定', iconCls: 'save',scope:_self,handler:_self.valPass}]
		}];
		this.on('beforeshow',function(){
			displayOCX(false);
			this.getPassFiled().focus(false,200);
		},this);
		this.on('beforehide',function(){
			displayOCX(true);
			this.getPassFiled().setValue('');
		},this);
		Flw.wait.WinOfSign.superclass.initComponent.call(this);
	},
	getPassFiled:function(){
		return  this.items.get(0).getForm().findField('password');
	},
	valPass:function(){
		var THIS = this;
		var passField = THIS.getPassFiled();
		var pword = passField.getValue();
		if ('' != pword){
			DWREngine.setAsync(false);
			baseMgm.findById(userBean, _userid, function(o){
				baseMgm.getMd5Str(pword, function(s) {
					pword=s;
				});
				if (o.userpassword == pword) {
					THIS.hide();
					if (FlwControl.isModelOpen) {
						if(FlwControl.ISYP)
							THIS.doPrintZlyp();
						else
							THIS.doPrint();
					}else if(TANGER_OCX_bDocOpen){
						if(FlwControl.ISYP)
							THIS.doPrintZlyp();
						else
							THIS.doPrint();
					}
				} else {
					Ext.example.msg('错误', '请重新输入密码！');
					passField.setValue('');
				}
			});
		}
	},
	doPrintZlyp:function(){//质量验评流程签字处理
		if(FlwControl.ISYP){//质量验评流程
			if(TANGER_OCX_OBJ.ActiveDocument.Application.Selection){
			}else{
				Ext.example.msg('提示','请现在文档区域使用鼠标定位需要签名的地方！');
				return
			}
		};
		//this.doPrint();
		DWREngine.setAsync(false);
		TANGER_OCX_SetReadOnly(false);
		flwFileMgm.isUploadSign(_userid, function(flag){
			if (flag){
				var url = _basePath+"servlet/FlwServlet?ac=loadDoc&fileid="+_userid;
				TANGER_OCX_OBJ.ActiveDocument.Application.Selection.Range.Select();
				var bu = "" + _username;
				try{
					var obj = TANGER_OCX_OBJ.ActiveDocument.Application.Selection.InlineShapes.AddPicture(url,false,true);
					//签名图片与工号绑定
					obj.AlternativeText = bu;
				}catch(e){}									
			} else {
				Ext.example.msg('提示', '您没有上传签名图片！可以到【系统管理】-【用户管理】上传！');
				TANGER_OCX_OBJ.SetBookmarkValue(bookmark,REALNAME)
			}
		});
		var url = _basePath+'/servlet/FlwServlet?ac=saveDoc';
		document.all('TANGER_OCX').SaveToURL(url,'EDITFILE','fileid='+FlwControl.currFileID,FlwControl.currFileName);
		Ext.example.msg('提示', '签名成功！');
		var params = 'insid='+_insid+'&nodeid='+FlwNode.currentNodes[0]+'&userid='+_userid;
		var filename = _title+'-'+FlwNode.currentNodes[1]+'.doc';
		var outHTML = document.all('TANGER_OCX').SaveToURL(url,'EDITFILE',params,filename);
		FlwButtons.signBtn.disable();
		FlwControl.isSigned = true;
		if(FlwControl.docReadOnly)TANGER_OCX_SetReadOnly(true);
		DWREngine.setAsync(true);
	},
	doPrint:function(){//根据角色打印书签
		var bkList = new Array();
		DWREngine.setAsync(false);
		if(!FlwControl){
			Ext.example.msg('提示','打印失败')
		};
		if (FlwControl.isStateNode){//状态节点，查找该节点配置的书签
			baseDao.findByWhere2(nodeBean, 
				"flowid='"+_flowid+"' and nodeid='"+FlwNode.currentNodes[0]+"'", function(list){
				if (list.length > 0){
					if (list[0].bookmark != '' && list[0].bookmark != null)
					bkList = list[0].bookmark.split(',');
				}
			});
		} else {//普通节点，查找该节点配置的书签
			var filter = "flowid='"+_flowid+"' and nodeid='"+FlwNode.currentNodes[0]
						+"' and cnodeid='"+FlwNode.currentCnodes[0]+"'" ;
			baseDao.findByWhere2(commonNodeBean,filter, function(list){
				if (list.length > 0){
					if (list[0].bookmark!=''&&list[0].bookmark!=null)
						bkList = list[0].bookmark.split(',');
				}
			});
		}	
		DWREngine.setAsync(true);
		if (bkList.length > 0){
            FlwButtons.sendBtn.disable();
			var ocxBookMarks = TANGER_OCX_OBJ.activeDocument.BookMarks;
			var isSign = false;
			TANGER_OCX_SetReadOnly(false);
			for (var i=0; i<bkList.length; i++){
				for (var j=0; j<ocxBookMarks.Count; j++){
					var bookmark = ocxBookMarks(j+1).Name;
					if (bookmark.indexOf(bkList[i]) > -1){
						if (bkList[i].indexOf('意见') > -1){
							var notes = noteArea.getValue();
							TANGER_OCX_OBJ.SetBookmarkValue(bookmark, notes);
							isSign = true;
							continue;
						} else if (bkList[i].indexOf('签字时间') > -1 && bookmark.indexOf('签字时间') > -1){
							var format = new Date().dateFormat('Y-m-d');
							TANGER_OCX_OBJ.SetBookmarkValue(bookmark, format);
							isSign = true;
							continue;
						} else if (bkList[i].indexOf('签字') > -1 && bkList[i].indexOf('时间') < 0 && bkList[i].indexOf('盖章') < 0
								&& bookmark.indexOf('签字') > -1 && bookmark.indexOf('时间') < 0 && bookmark.indexOf('盖章') < 0){
							TANGER_OCX_OBJ.SetBookmarkValue(bookmark,"");
							DWREngine.setAsync(false);
							flwFileMgm.isUploadSign(_userid, function(flag){
								if (flag){
									var url = _basePath+"servlet/FlwServlet?ac=loadDoc&fileid="+_userid;
									//选中书签
									ocxBookMarks(bookmark).Select();
									//得到书签上的所有图形
									var _shapes = TANGER_OCX_OBJ.ActiveDocument.InlineShapes;
									//书签员工编号
									var bu = bookmark + _username;
									for (var i=_shapes.Count; i>0; i--){
										if(_shapes(i).AlternativeText == bu){
											_shapes(i).Delete();
										}
									}
									try{
										var obj = TANGER_OCX_OBJ.ActiveDocument.Application.Selection.InlineShapes.AddPicture(url,false,true);
										//签名图片与工号绑定
										obj.AlternativeText = bu;
									}catch(e){}									
								} else {
									Ext.example.msg('提示', '您没有上传签名图片！可以到【系统管理】-【用户管理】上传！');
									TANGER_OCX_OBJ.SetBookmarkValue(bookmark,REALNAME)
								}
							});
							DWREngine.setAsync(true);
							isSign = true;
							continue;
                        } else if (bkList[i].indexOf('签字盖章') > -1 && bookmark.indexOf('签字盖章') > -1){
                            TANGER_OCX_OBJ.SetBookmarkValue(bookmark,"");
                            DWREngine.setAsync(false);
                            appMgm.getCodeValue('流程签字盖章',function(list){
                                for(n = 0; n < list.length; n++) {
                                    //alert(bkList[i]+">>>"+list[n].propertyName)
                                    if(bkList[i].indexOf(list[n].propertyName) > -1){
                                        baseDao.findByWhere2("com.sgepit.frame.sysman.hbm.AppFileinfo","businessid = '"+_userid+"-"+list[n].propertyCode+"'",function(listApp){
                                            if(listApp.length > 0){
                                                //prompt(list[n].propertyName+">>>"+listApp[0].filename,listApp[0].fileid);
                                                var fileid = listApp[0].fileid;
                                                var url = _basePath+"servlet/FlwServlet?ac=loadDoc&fileid="+fileid;
                                                //选中书签
			                                    ocxBookMarks(bookmark).Select();
			                                    //得到书签上的所有图形
			                                    var _shapes = TANGER_OCX_OBJ.ActiveDocument.InlineShapes;
			                                    //书签员工编号
			                                    var bu = bookmark + _username;
			                                    for (var i=_shapes.Count; i>0; i--){
			                                        if(_shapes(i).AlternativeText == bu){
			                                            _shapes(i).Delete();
			                                        }
			                                    }
			                                    try{
			                                        var obj = TANGER_OCX_OBJ.ActiveDocument.Application.Selection.InlineShapes.AddPicture(url,false,true);
			                                        //签名图片与工号绑定
			                                        obj.AlternativeText = bu;
			                                    }catch(e){} 
                                            }
                                        });
                                    }
                                }
                            });
                                
                            DWREngine.setAsync(true);
                            isSign = true;
                            continue;
                        }
					}
				}
			};
			var url = _basePath+'/servlet/FlwServlet?ac=saveDoc';
			document.all('TANGER_OCX').SaveToURL(url,'EDITFILE','fileid='+FlwControl.currFileID,FlwControl.currFileName);
            myMask = new Ext.LoadMask(Ext.getCmp('maintab').getEl(), {msg: "审批单后台保存中，请稍等 ！"});
            myMask.show();
            setTimeout("myMask.hide();Ext.example.msg('提示', '签名成功！');FlwButtons.sendBtn.enable();",10000);
            //Ext.example.msg('提示', '签名成功！');
            var params = 'insid='+_insid+'&nodeid='+FlwNode.currentNodes[0]+'&userid='+_userid;
			var filename = _title+'-'+FlwNode.currentNodes[1]+'.doc';
			var outHTML = document.all('TANGER_OCX').SaveToURL(url,'EDITFILE',params,filename);
			FlwButtons.signBtn.disable();
			FlwControl.isSigned = true;
			if(FlwControl.docReadOnly)TANGER_OCX_SetReadOnly(true);
		}else{
			FlwButtons.signBtn.disable();
			FlwControl.isSigned = true;
		}
	}
});
Ext.reg('signwindow',Flw.wait.WinOfSign);
/**
 * 流转日志窗口
 * @class Flw.wait.WinOfLog
 * @extends Ext.Window
 */
Flw.wait.WinOfLog=Ext.extend(Ext.Window ,{
	title:"流转日志",
	width:850,
	height:400,
	modal:true,
	layout:"fit",
	draggable:false,
	initComponent: function(){
		this.items=[{
			xtype:"loggrid"
		}];
		this.on("beforeshow",function(){
			displayOCX(false);
			var loggrid = this.items.get(0);
			var logds = loggrid.getStore();
			logds.baseParams.params = "insid = '" + _insid + "' and fromnode <> 'systemuserid' and tonode <> 'systemuserid'";
			logds.load({
				params: {
					start: 0,
					limit: PAGE_SIZE
				}
			});
		});
		this.on("beforehide",function(){
			displayOCX(true);
		})
		Flw.wait.WinOfLog.superclass.initComponent.call(this);
	},
	show:function(){
		var logStore = this.items.get(0).getStore();
		logStore.removeAll();
		logStore.load({
			params: {
				start: 0,
				limit: PAGE_SIZE
			}
		});
		Flw.wait.WinOfLog.superclass.show.call(this);
	}
});
Ext.reg("logwin",Flw.wait.WinOfLog);