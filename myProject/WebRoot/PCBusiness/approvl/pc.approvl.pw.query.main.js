var pwSortTree, pwjyGrid;
var approvalStatus = [['%', '全部'], ['0', '未办理'], ['1', '办理中'], ['2', '已办理']];
var pwblStatus = new Array(); // 批文办理状态
var businessType = 'PWFILES';  //批文办理业务类型
var RW = (ModuleLVL < 3 ? true : false);// 读写权限
var OverviewWindow = null;
var uidCountArr = new Array();   //生成[uid, count]格式的数组
Ext.onReady(function() {
	
	Ext.QuickTips.init();
	/**
	 * 左侧树部分定义
	 */
	//生成项目切换下拉框树
	unitTree=_createUniteTree();
	unitTree.getTree().on('click', function(){
		//首先让批文分类树刷新
		var pid = unitTree.getValue();
		pwSortTree.loader.baseParams.pid = pid;
		pwSortTree.root.reload();
		//刷新批文办理grid数据
		pwDS.baseParams.params = "pid='" + pid + "'";
		pwDS.load({params:{start:0,limit:20}});
		
	});
	
	//生成批文分类树
	pwSortTree = getPwSortTree({
		id: 'sortTree',
		rootVisible : false,
		root : new Ext.tree.AsyncTreeNode({
					id : '0',
					text : '批文分类树',
					classfiyNo : '0',
					expanded : true
				}),
		listeners : {
			load : function(node) {
				node.attributes.ifcheck = undefined;
				node.attributes.checked = undefined;
			},
			click : function(node, e) {
				var treeLoader = pwSortTree.loader;
				treeLoader.baseParams.parent = node.attributes.classfiyNo;
				var selectedPid = unitTree.getValue();
					if(selectedPid==''||selectedPid==null)
						selectedPid = CURRENTAPPID;
				if (node.attributes.classfiyNo == '0') {        //根节点已设置为不可见, 所以这个条件不会成立
//					pwDS.baseParams.params = "pid='" + CURRENTAPPID + "'";
					pwDS.baseParams.params = "pid='" + selectedPid + "'";
				} else {
					//获得项目下拉框中的项目单位编号
					pwDS.baseParams.params = "Instr(nodepath||'/','"
											+ node.getPath('classfiyNo') + "/')>0 and pid='"
											+ selectedPid + "'";
					//清空搜索功能输入
					pwStatusCombo.setValue('%');
					Ext.getCmp('pwField').setValue('');
											
				}
				pwDS.load({params:{start:0, limit:20}});
			},
			beforeload : function(node, e) {
				var parentid = node.attributes.classfiyNo;
				if (parentid == null || parentid == "" || parentid == undefined) {
					parentid = "0";
				}
				var baseParams = pwSortTree.loader.baseParams
				baseParams.parent = parentid;
			}
		}
	});

	var spinner = new Ext.ux.form.Spinner({
	    strategy: new Ext.ux.form.Spinner.NumberStrategy({minValue:'0', maxValue:'100'})
	});

	var pwCm = new Ext.grid.ColumnModel([slModel, {
				id : 'uids',
				header : fc['uids'].fieldLabel,
				dataIndex : fc['uids'].name,
				hidden : true
			}, {
				id : 'pid',
				header : fc['pid'].fieldLabel,
				dataIndex : fc['pid'].name,
				hidden : true
			}, {
				id : 'sortUids',
				header : fc['sortUids'].fieldLabel,
				dataIndex : fc['sortUids'].name,
				hidden : true
			}, {
				id : 'pwName',
				header : fc['pwName'].fieldLabel,
				dataIndex : fc['pwName'].name,
				hidden : false,
				align: 'left',
				sortable: true,
				width : 200,
				renderer: function(data, metadata, record){
					var tip =  record.get('pwName');
					if(tip==''||tip==null)
						return ;
					else
					{
						metadata.attr = 'ext:qwidth=200  ext:qtip="'+tip.bold()+'"';
						return   tip;
					}
				}
			}, {
				id: 'uids',
				header: fc['pwFileOverview'].fieldLabel,
				dataIndex : fc['pwFileOverview'].name,
				hidden : false,
				editor:null,
				align: 'center',
				renderer : function(v) {
			
							return "<a href='javascript:showOverview(\"" + v
									+ "\")'>查看概述</a>"
						}
			},{
				id : 'pwNo',
				header : fc['pwNo'].fieldLabel,
				dataIndex : fc['pwNo'].name,
				hidden: true
			}, {
				id : 'pwFileId',
				header : fc['pwFileId'].fieldLabel,
				dataIndex : fc['pwFileId'].name,
				hidden : true
			}, {
				id: 'uids',
				header : fc['pwFileName'].fieldLabel,
				dataIndex : fc['uids'].name,
				hidden : false,
				align: 'center',
				width : 80,
				renderer: adjustRenderFn
			}, {
				id : 'fileId',
				header : fc['fileId'].fieldLabel,
				dataIndex : fc['fileId'].name,
				hidden : true
			}, {
				id : 'mgmStatus',
				header : fc['mgmStatus'].fieldLabel,
				dataIndex : fc['mgmStatus'].name,
				width : 160,
				align: 'left',
				sortable: true,
				renderer: function(data, metadata, record){
					var tip =  record.get('mgmStatus');
					if(tip==''||tip==null)
						return ;
					else
					{	
	                	metadata.attr = 'ext:qwidth=200 ext:qtip="' + tip.bold() + '"';
	                	return   tip;
					}
				}
			}, {
				id : 'rateStatus',
				header : fc['rateStatus'].fieldLabel,
				dataIndex : fc['rateStatus'].name,
				width : 120,
				align: 'center',
				sortable: true,
				editor:spinner,
				renderer: function(value){
			        var columnWidth = (120-10);
			        var width = columnWidth * value / 100;
			        return '<div style="background:#C6D6EE;position:absolute;width:'+width+'px;height:22px"></div>'
			            + '<div style="border:solid 1px #FF0000;position:relative;height:20px;line-height:20px;width:'+columnWidth+'px;">'+value+'%</div>';
			    }
			}, {
				id : 'dealStatus',
				header : fc['dealStatus'].fieldLabel,
				dataIndex : fc['dealStatus'].name,
				width : 60,
				align: 'center',
				sortalbe: true,
				renderer : statusShow
			}, {
				id : 'mgmUser',
				header : fc['mgmUser'].fieldLabel,
				dataIndex : fc['mgmUser'].name,
				hidden : true
			}, {
				id : 'planStartDate',
				header : fc['planStartDate'].fieldLabel,
				dataIndex : fc['planStartDate'].name,
				sortable: true,
				align: 'center',
				renderer : Ext.util.Format.dateRenderer('Y-m-d'),
				width : 90
			}, {
				id : 'planEndDate',
				header : fc['planEndDate'].fieldLabel,
				dataIndex : fc['planEndDate'].name,
				sortable: true,
				align: 'center',
				renderer : Ext.util.Format.dateRenderer('Y-m-d'),
				width : 90
			}, {
				id : 'realStartDate',
				header : fc['realStartDate'].fieldLabel,
				dataIndex : fc['realStartDate'].name,
				sortable: true,
				align: 'center',
				renderer : Ext.util.Format.dateRenderer('Y-m-d'),
				width : 90
			}, {
				id : 'realEndDate',
				header : fc['realEndDate'].fieldLabel,
				dataIndex : fc['realEndDate'].name,
				sortable: true,
				align: 'center',
				renderer : Ext.util.Format.dateRenderer('Y-m-d'),
				width : 90
			}]);
			
	// 列模型创建完毕
			
	//批文建议选择模式		
	var jySelModel = new Ext.grid.CheckboxSelectionModel({
		header:'',
		singleSelect : true
	});
	
	// 创建显示批文办理情况的grid,如果是批文办理查询页面必须禁用"添加"，"保存","删除"功能，并且行设定为不可以编辑的
	pwGrid = new Ext.grid.GridPanel({
		region : 'center',
		ds : pwDS,
		cm : pwCm, // 列模型
		sm : jySelModel,
		tbar : ['批文名称：&nbsp;&nbsp;', 
				{
					xtype : 'textfield',
					id : 'pwField',
					readOnly : false,
					emptyText: '全部',
					listeners:{
						render : function(field) {
							Ext.QuickTips.register({
							target : field.el,
							title: '查询功能说明:',
							text : '输入批文名称后按回车键进行查询!'
							})
							}, 
						specialkey:function(textField, event){
				 			if(event.getKey()==13){
				 				doSearch()
				 			}
				 		}
					}
				}, 
				'&nbsp;&nbsp', 
				'办理状态: &nbsp;&nbsp', pwStatusCombo,
				'&nbsp;&nbsp',batchDownLoad,
				'->',
				'切换项目单位: &nbsp;&nbsp;',unitTree
				],// 顶部工具栏，可选
		header:false,
		width : 1000,
		border : false, // 
		autoScroll : true, // 自动出现滚动条
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
//		autoExpandColumn : 'pwName', // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
		loadMask : true, // 加载时是否显示进度
		viewConfig : {
			forceFit : false,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : pwDS,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		listeners : {
			// 绑定pwgrid的行被选中处理函数，用以动态显示对应的批文建议
			rowclick : function(grid, rowIndex, e) {
				var rowRecord = grid.getSelectionModel().getSelected();
				if (rowRecord) {
					pwjyGrid.setTitle("【" + rowRecord.get('pwName') + "】批文建议内容") // 设置批文建议的标题
					pwjyGrid.getTopToolbar().show();
					pwjyDS.baseParams.params = "mgmUids='"
							+ rowRecord.get('uids') + "'";
					pwjyDS.load({params: {start:0, limit:3}});
					Ext.apply(pwjyGrid.plantInt, {mgmUids : rowRecord.get('uids')}
					);
				} else {
					pwjyGrid.getTopToolbar().hide();
					pwjyDS.removeAll();
				}
			}
		}
	});
	// 让grid加载数据
	pwDS.load({params: {start:0, limit:20}})
	
	/**
	 * 定义批文建议Grid
	 */
	// 创建可批文建议的可编辑配置区域
	var pwjyColumns = [{
				name : 'uids',
				type : 'string'
			}, // 定义的这个列是为了让ds正确的读取数据，与是否在grid中显示出来无关
			{
				name : 'pid',
				type : 'string'
			}, {
				name : 'mgmUids',
				type : 'string'
			}, {
				name : 'username',
				type : 'string'
			}, {
				name : 'adviseContent',
				type : 'string'
			}, {
				name : 'adviseDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'userid',
				type : 'string'
			}, {
				name : 'userdep',
				type : 'string'
			}];
			
	var adviseCm = new Ext.grid.ColumnModel([slModel, {
				id : 'uids',
				header : adviseFc['uids'].fieldLabel,
				dataIndex : adviseFc['uids'].name,
				hidden : true
			}, {
				id : 'pid',
				header : adviseFc['pid'].fieldLabel,
				dataIndex : adviseFc['pid'].name,
				hidden : true
			}, {
				id : 'mgmUids',
				header : adviseFc['mgmUids'].fieldLabel,
				dataIndex : adviseFc['mgmUids'].name,
				hidden : true,
				editor : new fm.TextField(fc['mgmUids'])
			},{
				id : 'userdep',
				width : 100,
				header : adviseFc['userdep'].fieldLabel,
				dataIndex: adviseFc['userdep'].name,
				align: 'left'
			},{
				id : 'username',
				width : 50,
				header : adviseFc['username'].fieldLabel,
				dataIndex : adviseFc['username'].name,
				align: 'left'
			}, {
				id : 'adviseDate',
				width : 60,
				header : adviseFc['adviseDate'].fieldLabel,
				dataIndex : adviseFc['adviseDate'].name,
				editor : (RW?new fm.DateField(adviseFc['adviseDate']):null),
				renderer : formatDate,
				align: 'center'
			}, {
				id : 'adviseContent',
				width : 150,
				header : adviseFc['adviseContent'].fieldLabel,
				dataIndex : adviseFc['adviseContent'].name,
				hidden : false,
				editor : (RW?new fm.TextField(fc['adviseContent']):null),
				renderer: function(data, metadata, record){
					var tip =  record.get('adviseContent');
					if(tip==''||tip==null)
						return ;
					else
					{
						metadata.attr = 'ext:qwidth=200  ext:qtip="'+tip.bold()+'"';
						return   tip;
					}
				}
			}, {
				id : 'userid',
				header : adviseFc['userid'].fieldLabel,
				dataIndex : adviseFc['userid'].name,
				hidden : true
			}
			])
		
	// 批文分类录入见面关于建议部分是只读的(GridPanel)，而在查询页面是可以编辑的()
	 pwjyGrid = new Ext.grid.EditorGridTbarPanel({
				region : 'south',
				height : 188,
				ds : pwjyDS, // 数据源
				cm : adviseCm,
				sm : slModel,
				clickstoEdit : 2,
				title : "批文建议内容", // 面板标题
				border : false, // 
				autoScroll : true, // 自动出现滚动条
				collapsible : false, // 是否可折叠
				animCollapse : false, // 折叠时显示动画
				autoExpandColumn : 'adviseContent', // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
				loadMask : true, // 加载时是否显示进度
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				tbar:[],	     
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : 3,
					store : pwjyDS,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				
				// 点击顶部工具栏上"添加"需要以下初始化内容
				plant : Ext.data.Record.create(pwjyColumns),
				
				plantInt : {
					uids : '',
					pid : CURRENTAPPID,
					mgmUids : '',                 //批文办理的mgmUids可能为空, 也可能不为空
					username : REALNAME, 
					adviseContent : '',
					adviseDate : SYS_DATE_DATE,
					userid : USERID,
					userdep : USERBELONGUNITNAME
				},
				servletUrl : MAIN_SERVLET,
				bean : 'com.sgepit.pcmis.approvl.hbm.PcPwApprovalAdvise',
				primaryKey : "uids",
				deleteHandler : function() {
					var sm = this.getSelectionModel();
					var ds = this.getStore();
					if (sm.getCount() > 0) {
						if (sm.getSelected().get("username") == REALNAME) {
							this.defaultDeleteHandler();
						} else {
							Ext.example.msg('', '只能删除本人填写的建议内容！')
						}
					}
				},
				
				saveHandler: function() {
					var record = this.getSelectionModel().getSelected();
					if(null==record)
					{
						Ext.example.msg('提示', '请选中一条记录!');
						return;
					}
					else 
					{
						//对批文建议内容长度进行进行判断
						var desc = record.get('adviseContent');
						if(bytesOfString(desc)>300)
						{
							Ext.Msg.show({
								title: '提示',
								msg: '批文建议内容长度超出系统允许范围!',
								buttons: Ext.Msg.OK,
								icon: Ext.MessageBox.INFO
							});
							return;
						}
						this.defaultSaveHandler();
					}
				},
				listeners: {
					beforeedit: function(o){
						var record = o.record;
						var creatUserName = record.get('username');
						var creatUserId = record.get('userid');
						var currentUserName = REALNAME;
						
						if(creatUserName==currentUserName||creatUserId==USERID) {
							return true;
						} else {
							return false;
						}
					}
					
//					render: function(o){
//						o.getTopToolbar().hide();
//					}
				}
			});
			
	// pwjyGrid.getTopToolbar().enable();
			
	// 布局-----------------------------------------------------------------
	var viewPort = new Ext.Viewport({
				layout : 'border',
				items : [pwSortTree, {
							layout : 'border',
							region : 'center',
							items : [pwjyGrid, pwGrid]
						}]
			})
	unitTree.value=pid;
	unitTree.setRawValue(projectName);
	
	pwGrid.store.on('beforeload', function(){
		var value = unitTree.getValue();
		getAdjustCount(value);
	})
	multiFileWin.on("hide", function(){
		var value = unitTree.getValue();
		pwDS.reload();
		
	})
	
	pwGrid.store.load({params:{start:0, limit:20}});
	pwGrid.store.on('load', function() {
				if (pwGrid.store.getCount() > 0) {
					pwGrid.getSelectionModel().selectFirstRow();
					pwjyGrid.getTopToolbar().enable();
					var defaultRecord = pwGrid.getSelectionModel()
							.getSelected();
					Ext.apply(pwjyGrid.plantInt, {
								mgmUids : defaultRecord.get('uids')
							});
					pwjyDS.baseParams.params = "mgmUids='"
							+ defaultRecord.get('uids') + "'";
					pwjyDS.load({params:{start:0,limit:3}});
				} else {
					pwjyGrid.getTopToolbar().disable();
					pwjyDS.removeAll();
				}
			})
			
	 OverviewWindow=Ext.extend(Ext.Window ,{
		title:"文件概述",
		width:380,
		height:232,
		layout:"border",
		modal : true,
		initComponent: function(){
			this.items=[{
				region:"center",
				xtype:"textarea",
				border:false,
				hideBorders :false,
				bodyBorder  :false,
				maxLength : 200,
				readOnly: true,
				value:this.value
			},{
				region:"south",
				border:false,
				hideBorders :false,
				frame:false,
				plain:true,
				bodyBorder :true,
				bodyStyle:'background-color:#EBEBEB;color:green;'
			}
		];
		
		OverviewWindow.superclass.initComponent.call(this);
	},
	listeners:{
		render:function(win){
			win.items.get(0).on('render',function(cmp){
				cmp.el.on("keyup", this.displayInfo,this);
				cmp.el.dom.style.fontSize="14px";
				cmp.el.dom.style.lineHeight= "15pt";
				cmp.el.dom.style.letterSpacing = "1pt";
			},this)	
		},
	show:function(){
			this.displayInfo();
		}
	},
	displayInfo:function(){
			var txt = this.items.get(0);
			var info = this.items.get(1);
			var data = {
				num:(200-txt.getValue().length<0)?0:(200-txt.getValue().length),
				warn:(200-txt.getValue().length<0)?("，<font color=red>超出"+(txt.getValue().length-200)+"个字</font>"):""
			};
	},
	buttonAlign:'center'
	}) 
});

function downloadfile(pid, biztype) {
	var param = {
		businessId : pid,
		businessType : biztype,
		editable : false
	};
	showMultiFileWin(param);
}

function formatDate(value) {
	return value ? value.dateFormat('Y-m-d') : '';
}

//附件批量下载按钮
	var batchDownLoad = new Ext.Button({
		id: 'batchDownLoad',
		text: '附件批量下载',
		iconCls: 'add',
		handler: function(){
		var pid = Ext.getCmp('prjTree').getValue();
		var URL = CONTEXT_PATH+ "/PCBusiness/approvl/pc.approvl.pw.batchDownLoad.jsp?pid="+pid;
		window.location.href = URL;
//	    dailogWin = new Ext.Window({
//			id: 'batchDownLoadWin',
//			title: CURRENTAPPNAME+'－批文附件批量下载',
//			width: 560,
//			height: 360,
//			modal :true,
//			resizable: false,
//			draggable : false,
//			html: '<iframe name="fileFrm" src="'+URL+'" frameborder=0 style="width:100%;height:100%;"></iframe>'
//		});
//		
//		dailogWin.show()
		}
	});

	//附件renderer方法
function adjustRenderFn(value, metadata, record) {
		var uids = value;
		var count = 0;
		for(var i=0; i<uidCountArr.length; i++)
		{
			if(uids==uidCountArr[i][0])
			{
				count = uidCountArr[i][1];
				break;
			}
		}
	    if(count!=0){
	    	return "<a href='javascript:void(0)'  style='color:blue;' onclick='downloadfile(\"" + uids + "\",\"" + businessType + "\")'>查看["+count+"]</a>";
	    }else{
	    	return "<a href='javascript:void(0)' style='color:gray;' onclick='downloadfile(\"" + uids + "\",\"" + businessType + "\")'>查看["+count+"]</a>";
	    }
	}
	
function getAdjustCount(pid)
{
	DWREngine.setAsync(false);
		var sql = "select transaction_id tid, count(*) count  from sgcc_attach_list " +
					"where transaction_id in (select uids from pc_pw_approval_mgm where pid='" + pid + "' ) " +
					"group by transaction_id"
		baseMgm.getData(sql, function(list) {
			uidCountArr = new Array()
	    	if(list.length>0){
	    		for(var i=0 ; i<list.length; i++){
		   	 		var temp = new Array();
		   	 		temp.push(list[i][0]);
		   	 		temp.push(list[i][1]);
		   	 		uidCountArr.push(temp);
	    		}	
	     	}  
	    });
	DWREngine.setAsync(true);
}