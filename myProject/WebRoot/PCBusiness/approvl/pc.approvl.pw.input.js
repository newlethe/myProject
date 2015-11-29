var pwSortTree, pwGrid, pwjyGrid;
var primaryKey = "uids";
var propertyName = "sortUids";
var businessType = 'PWFILES';

var pwblStatus = new Array(); // 批文办理状态

var RW = (ModuleLVL < 3 ? true : false);// 读写权限

var sortList = new Array();

Ext.onReady(function() {
	
	//按照批文名称查询输入框的悬停提示信息
	Ext.QuickTips.init();

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
	
	pwSortTree = getPwSortTree({
		id: 'sortTree',
		rootVisible : false,
		title : '&nbsp;',
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
	})

	var spinner = new Ext.ux.form.Spinner({
			width:100,
			name:'rateStatus',
		    strategy: new Ext.ux.form.Spinner.NumberStrategy({minValue:'0', maxValue:'100'}),
		    listeners:{
		    	change : function(field,no,oo){
		    		if(isNaN(parseInt(no))||parseInt(no)>100||parseInt(no)<0){
		    			if(isNaN(parseInt(oo))||parseInt(oo)>100){
		    				field.setValue(0)	
		    			}else{
		    				field.setValue(parseInt(oo))
		    			}
		    		}else{
		    			field.setValue(parseInt(no));
		    		}
		    	}
		    }
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
				sortable: true,
				width : 200,
				align: 'left',
				editor : (RW ? new fm.TextField(fc['pwName']) : null)
			}, {
				id: 'uids',
				header: fc['pwFileOverview'].fieldLabel,
				dataIndex : fc['pwFileOverview'].name,
				hidden : false,
				editor:null,
				renderer : function(v) {
						if(v==''||v==null)
							return "<a href='javascript:showOverview(\"" +v+ "\")'>录入概述</a>";
						else
							return "<a href='javascript:showOverview(\"" +v+ "\")'>修改概述</a>";
						}
			},{
				id : 'pwNo',
				header : fc['pwNo'].fieldLabel,
				dataIndex : fc['pwNo'].name,
				hidden : true,
				align: 'center',
				editor : (RW&&false ? new fm.TextField(fc['pwNo']) : null)
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
				renderer : function(v) {
							if(v==''||v==null)
								return '';
							else
								return "<a href='javascript:uploadfile(\"" + v
														+ "\",\"PWFILES\")'>"+'附件'+"</a>"
						}
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
				editor : (RW ? new fm.TextField(fc['mgmStatus']) : null),
				renderer: function(data, metadata, record){
					var tip =  record.get('mgmStatus');
					if(tip==''||tip==null)
						return;
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
				editor : (RW ? spinner : null),                     //只有办理状态为"办理中"的才可以编辑批文办理进度列,办理状态为"未办理"的必须先修改为"办理中"才可以编辑办理进度
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
				hidden: false,
				sortable: true,
				align: 'center',
				width : 60,
				editor : (RW?new fm.ComboBox(fc['dealStatus']):null),
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
				width : 90,
				sortable: true,
				align: 'center',
				editor : (RW ? new fm.DateField(fc['planStartDate']) : null),
				renderer : formatDate
				
			}, {
				id : 'planEndDate',
				header : fc['planEndDate'].fieldLabel,
				dataIndex : fc['planEndDate'].name,
				width : 90,
				align: 'center',
				sortable: true,
				editor : (RW ? new fm.DateField(fc['planEndDate']) : null),
				renderer : formatDate
			}, {
				id : 'realStartDate',
				header : fc['realStartDate'].fieldLabel,
				dataIndex : fc['realStartDate'].name,
				width : 90,
				align: 'center',
				sortable: true,
				editor : (RW ? new fm.DateField(fc['realStartDate']) : null),
				renderer : formatDate
			}, {
				id : 'realEndDate',
				header : fc['realEndDate'].fieldLabel,
				dataIndex : fc['realEndDate'].name,
				sortable: true,
				width : 90,
				align: 'center',
				editor : (RW ? new fm.DateField(fc['realEndDate']) : null),
				renderer : formatDate
			}]);

	// 创建显示批文办理情况的grid
	pwGrid = new Ext.grid.EditorGridTbarPanel({
		region : 'center',
		ds : pwDS,
		cm : pwCm, // 列模型
		sm : slModel,
		saveBtn: false,
		addBtn: false,
		delBtn: false,
		tbar : [{
					xtype: 'tbbutton',
					id: 'addPW',
					text: '新增',
					iconCls: 'add',
					handler: addHandler
				},'|',{
					xtype: 'tbbutton',
					id: 'savePW',
					text: '保存',
					disabled: true,
					iconCls: 'save',
					handler: saveHandler
				},'|',
				{
					xtype: 'tbbutton',
					id: 'delPW',
					text: '删除',
					disabled: true,
					iconCls: 'remove',
					handler: deleteHandler
				},'&nbsp;&nbsp','-',
				'&nbsp;&nbsp; 批文名称：&nbsp;&nbsp;&nbsp;&nbsp', 
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
							anchor: 'right',
							text : '输入批文名称后按回车键进行查询!'
							})
							}, 
						specialkey:function(textField, event){
				 			if(event.getKey()==13){
				 				doSearch();
				 			}
				 		}
					}
				}, 
				'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp','办理状态: &nbsp;&nbsp;', pwStatusCombo,
				{
						xtype: 'tbbutton',
						text: '上报',
						hidden: true,
						iconCls: 'upload',
						handler: exchangeDate
				},
				'->','切换项目单位: &nbsp;&nbsp;','&nbsp;&nbsp',unitTree
				],// 顶部工具栏，可选
		border : false, 
		clicksToEdit : 2,              // 单元格单击进入编辑状态,1单击，2双击
		header : false, 
		autoScroll : true,             // 自动出现滚动条
		collapsible : false,           // 是否可折叠
		animCollapse : false,          // 折叠时显示动画
		loadMask : true,               // 加载时是否显示进度
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
		servletUrl : MAIN_SERVLET,
		bean : 'com.sgepit.pcmis.approvl.hbm.PcPwApprovalMgm',
		primaryKey : "uids",
		plant : Ext.data.Record.create(pwColumns),
		plantInt:  {
			uids:'',
			pid: CURRENTAPPID,
			sortUids:'',
			pwNo: '',
			pwName:'',
			pwFileId:'',
			pwFileName: '',
			fileId: '',
			mgmStatus: '',
			rateStatus: 0.0,
			dealStatus:'0',
			mgmUser:'',
			nodepath: '',
			planStartDate:'',
			planEndDate:'',
			realStartDate:'',
			realEndDate:'',
			pwFileOverview:''
			},
		listeners : {
			rowclick : function(grid, rowIndex, e) {
				var rowRecord = grid.getSelectionModel().getSelected();
				if (rowRecord) {
					Ext.getCmp('savePW').enable();
					if(rowRecord.get('dealStatus')!='1')
					{
						Ext.getCmp('delPW').enable();
					}
					else
					{
						Ext.getCmp('delPW').disable();
					}
					pwjyGrid.setTitle("【" + rowRecord.get('pwName') + "】批文建议内容")
					pwjyDS.baseParams.params = "mgmUids='"
							+ rowRecord.get('uids') + "'";
					pwjyDS.reload();
				} else {
					Ext.getCmp('savePW').disable();
					pwjyGrid.setTitle("批文建议内容")
					pwjyDS.removeAll();
				}
			},
			afteredit: function(o){
				var rate = o.record.get('rateStatus');
				var deal = o.record.get('dealStatus');
				
				if(rate==100)
				{
					o.record.set('dealStatus','2');
				}
				else if(rate==0)
				{
					//o.record.set('dealStatus','0');
				}
				else if(rate>0&&rate<100)
				{
					o.record.set('rateStatus',rate);
					//o.record.set('dealStatus','1');
				}
		    }
	    }
	});

	var adviseCm = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(), {
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
				hidden : true
			}, {
				id : 'userdep',
				width : 100,
				header : adviseFc['userdep'].fieldLabel,
				dataIndex: adviseFc['userdep'].name,
				align: 'left'
			},{
				id : 'username',
				header : adviseFc['username'].fieldLabel,
				dataIndex : adviseFc['username'].name,
				align: 'left',
				width: 50,
				hidden : false
			},{
				id : 'adviseDate',
				header : adviseFc['adviseDate'].fieldLabel,
				dataIndex : adviseFc['adviseDate'].name,
				hidden : false,
				align: 'center',
				width: 60,
				renderer : formatDate
			},  {
				id : 'adviseContent',
				header : adviseFc['adviseContent'].fieldLabel,
				dataIndex : adviseFc['adviseContent'].name,
				width: 150,
				hidden : false,
				renderer: function(data, metadata, record){
					var tip =  record.get('adviseContent');
					if(tip==''||tip==null)
					{
						return;
					}
					else
					{
						metadata.attr = 'ext:qwidth=200 ext:qtip="' + tip.bold() + '"';
						return   tip;
					}
				}
			}, {
				id : 'userid',
				header : adviseFc['userid'].fieldLabel,
				dataIndex : adviseFc['userid'].name,
				hidden : true
			}
			]);

	
    pwjyDS.setDefaultSort('adviseDate','DESC');
      
	pwjyGrid = new Ext.grid.GridPanel({
				region : 'south',
				height : 240,
				ds : pwjyDS, // 数据源
				cm : adviseCm,
				title : "批文建议内容", // 面板标题
				border : false, // 
				autoScroll : true, // 自动出现滚动条
				collapsible : false, // 是否可折叠
				animCollapse : false, // 折叠时显示动画
				autoExpandColumn : "adviseContent", // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
				loadMask : false, // 加载时是否显示进度
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				addBtn : true,
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : pwDS,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				})
			});
	// 下面是布局的实现-----------------------------------------------------------------
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
	pwDS.load();
	
	//数据交互，实现批文办理情况的上报
	function exchangeDate(){
		var record = pwGrid.getSelectionModel().getSelected();
		if(record==null||record==undefined||record==''){
			Ext.example.msg('提示', '请选择一条批文办理情况');
		}else {
			DWREngine.setAsync(false);
			approvlMgm.submitPcPwMgm(record.get('pid'), function(flag) {
						if (flag=='success'||flag=='SUCESS') {
							Ext.example.msg('提示', '数据交互成功!');
						} else {
							Ext.example.msg('提示', '数据交互失败!');
						}
					});
			DWREngine.setAsync(true);
        }
     }	
     
     function addHandler(){
     	var node = pwSortTree.getSelectionModel().getSelectedNode();
     	var selPid = unitTree.getValue();
     	if(selPid==''||selPid==null){
			selPid = CURRENTAPPID;
		}
		pwGrid.plantInt.pid = selPid;
     	if(node==null||node=='null')
     	{
     		Ext.example.msg('提示', '请您选中一个批文分类!');
     		return;
     	}
     	//指定新增批文的批文分类
     	pwGrid.plantInt.sortUids = node.attributes.uids;
     	
     	//生成新增批文办理的批文编号
     	DWREngine.setAsync(false);
		var sql_maxbh = "select max(pw_no) maxNo from pc_pw_approval_mgm where "
				+ "sort_uids='" + node.attributes.uids + "'and pid='" + selPid + "'";	
		
		//生成批文路径的sql语句
		var sql_path = "select t1.classfiy_no pwpath from (select t.* from pc_pw_sort_tree_sub t where t.pid='"+selPid+"') t1 connect by " +
							 	  "prior t1.parentid=t1.classfiy_no start with t1.classfiy_no='"+node.attributes.classfiyNo+"'";
		
		baseMgm.getData(sql_maxbh, function(list) {
					if(list[0]==null)
					{
						pwGrid.plantInt.pwNo = node.attributes.classfiyNo + '01';
					}
					else
					{
						var tempNo = parseInt(list[0]) + 1;
						pwGrid.plantInt.pwNo = tempNo + '';
					}
		});
		
		baseMgm.getData(sql_path, function(list) {
			if(list!=null&&list.length>0){
				var nodepath = '/0';
				for(var i=list.length-1; i>=0; i--)
				{
					nodepath += '/' + list[i];
				}
			}
			nodepath += '/' + pwGrid.plantInt.pwNo;
			pwGrid.plantInt.nodepath = nodepath;
		});
		DWREngine.setAsync(true);
     	pwGrid.defaultInsertHandler();
     }
     
     function deleteHandler()
     {
     	//删除批文办理附件
     	var record = pwGrid.getSelectionModel().getSelected();
     	if(record==null||record=='null')
     	{
     		Ext.example.msg('提示', '请选中一条记录!');
			return;
     	}
		
     	var whereSql="TRANSACTION_TYPE='"+businessType+"' and TRANSACTION_ID='"+record.get('uids')+"'";
		var fileLshs="";
		fileServiceImpl.geAttachListByWhere(whereSql,null,null,function(list){
			if(list.length>0){
				for(var j=0; j<list.length-1; j++){
					fileLshs+="'"+list[j].fileLsh+"',";
					
					//1.删除附件表的从表(sgcc_attach_blob)中对应将要删除附件的记录
					fileServiceImpl.deleteAttachBlob(list[j]);
				}
				fileLshs+="'"+list[list.length-1].fileLsh+"'";
					//2.删除附件(sgcc_attach_list)
					fileServiceImpl.deleteAttachList(fileLshs,null);
			}
		});
     	pwGrid.defaultDeleteHandler();
     }
     function saveHandler()
	{
		var record = pwGrid.getSelectionModel().getSelected();
		
		var selPid = unitTree.getValue();
		if(selPid==''||selPid==null)
			selPid = CURRENTAPPID;
		//pwGrid.plantInt.pid = selPid;
		//保存时设定该批文所属的批文分类
		if(null==record)
		{
			Ext.example.msg('提示', '请选中一条记录!');
			return;
		} else {
			//对备注内容长度进行进行判断
			var desc = record.get('mgmStatus');
			if(bytesOfString(desc)>200)
			{
				Ext.Msg.show({
					title: '提示',
					msg: '办理情况内容长度超出系统允许范围!',
					buttons: Ext.Msg.OK,
					icon: Ext.MessageBox.INFO
				});
				return;
			}
			pwGrid.defaultSaveHandler();
		}
	}
     
	//显示文件概述对话框
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
		this.tpl = new Ext.XTemplate(
		    "<div style='float:right;padding-right:20px;'>",
		    "可以输入100汉字  ，",
		    "剩余字数：{num}{warn}",
		    '</div>'
		);
		this.buttons = [{
				text:'确定',
				scope:this,
				handler:function(){
					var overView = this.items.get(0).getValue();
					
					if(overView.length>200){
						Ext.example.msg('提示','退回原因超过100汉字');
						return;
					}else if(overView==""){
						Ext.example.msg('提示','请先输入文件概述');
						return;
					}
					
					var record = pwGrid.getSelectionModel().getSelected();
					record.set('pwFileOverview', overView);
					this.hide();
				}
			},{
				text:'取消',
				scope:this,
				handler:function(){
					this.items.get(0).setValue("");
					this.hide();
				}
		}]
		
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
				num:(200-bytesOfString(txt.getValue())<0)?0:(Math.floor((parseInt(200-bytesOfString(txt.getValue()))/2))),
				warn:(200-bytesOfString(txt.getValue())<0)?("，<font color=red>超出"+(Math.ceil((parseInt(200-bytesOfString(txt.getValue()))/2))-100)+"个字</font>"):""
			};
			this.tpl.overwrite(info.body, data);
			},
	buttonAlign:'center'
	})
}) 
// Ext.onReady()结束

function formatDate(value) {
		return value ? value.dateFormat('Y-m-d'):null;
  } 
//上传附件
function uploadfile(pid, biztype) {
	var param = {
		businessId : pid,
		businessType : biztype,
		editable : true
	};
	showMultiFileWin(param);
}
