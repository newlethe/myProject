var pwSortTree, pwGrid, pwjyGrid;
var primaryKey = "uids";
var propertyName = "sortUids";
var pwblStatus = new Array(); // 批文办理状态
var sortList = new Array();
var bussinessType = "PWFILES";

var approvalStatus = [['%', '全部'], ['2', '已办理'], ['0', '未办理'], ['1', '办理中']];
var dsPwStatus = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : approvalStatus
			});
Ext.onReady(function() {
	
	//按照批文名称查询输入框的悬停提示信息
	Ext.QuickTips.init();
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
		
	//批文办理选择模型
	var multiSelModel = new Ext.grid.CheckboxSelectionModel({
		singleSelect : false
	});	
	
	var pwStatusCombo = new Ext.form.ComboBox({
				name : 'approval-status',
				readOnly : true,
				valueField : 'k',
				displayField : 'v',
				mode : 'local',
				triggerAction : 'all',
				store : dsPwStatus,
				lazyRender : true,
				allowBlank : true,
				listClass : 'x-combo-list-small',
				value : '%',
				width : 70,
				id:'statusCombo',
				listeners : {
					select : function(combo) {
						doSerach();
					}
				}
			});
	
			//批文建立column
	var pwColumns = [{
				name : 'uids',
				type : 'string'
			}, // Grid显示的列，必须包括主键(可隐藏)
			{
				name : 'pid',
				type : 'string'
			}, {
				name : 'sortUids',
				type : 'string'
			}, {
				name : 'pwNo',
				type : 'string'
			}, {
				name : 'pwName',
				type : 'string'
			}, {
				name : 'pwFileId',
				type : 'string'
			}, {
				name : 'pwFileName',
				type : 'string'
			}, {
				name : 'fileId',
				type : 'string'
			}, {
				name : 'mgmStatus',
				type : 'string'
			}, {
			    name : 'rateStatus',
				type : 'float'
			}, {
				name : 'dealStatus',
				type : 'string'
			}, {
				name : 'mgmUser',
				type : 'string'
			}, {
				name : 'mgmUser',
				type : 'string'
			}, {
				name : 'nodepath',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'planStartDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},{
				name : 'planEndDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'realStartDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'realEndDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},{
				name : 'pwFileOverview',
				type : 'string'
			}]
			
	var pwCm = new Ext.grid.ColumnModel([multiSelModel, {
				id : 'uids',
				header : '唯一约束',
				dataIndex : 'uids',
				hidden : true
			}, {
				id : 'pid',
				header : '项目编号',
				dataIndex : 'pid',
				hidden : true
			}, {
				id : 'sortUids',
				header : '批文分类',
				dataIndex : 'sortUids',
				hidden : true
			}, {
				id : 'pwName',
				header : '批文名称',
				dataIndex : 'pwName',
				hidden : false,
				sortable: true,
				width : 200,
				align: 'left',
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
				header: '文件概述',
				dataIndex : 'pwFileOverview',
				hidden : false,
				renderer : function(v) {
							return "<a href='javascript:showOverview(\"" +v+ "\")'>查看概述</a>";
				}
			},{
				id : 'pwNo',
				header : '批文编号',
				dataIndex : 'pwNo',
				hidden : true,
				align: 'center'
			}, {
				id : 'pwFileId',
				header : '批文文件id',
				dataIndex : 'pwFileId',
				hidden : true
			}, {
				id: 'uids',
				header : '',
				dataIndex : 'uids',
				hidden : false,
				align: 'center',
				width : 80,
				renderer : function(v) {
								return "<a href='javascript:downloadfile(\"" + v
														+ "\",\"PWFILES\")'>"+'附件'+"</a>"
						}
			}, {
				id : 'fileId',
				header : '批文标准文件ID',
				dataIndex : 'fileId',
				hidden : true
			}, {
				id : 'mgmStatus',
				header : '备注',
				dataIndex : 'mgmStatus',
				width : 160,
				align: 'left',
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
				header : '进度状态',
				dataIndex : 'rateStatus',
				width : 120,
				align: 'center',
				sortable: true,
				renderer: function(value){
			        var columnWidth = (120-10);
			        var width = columnWidth * value / 100;
			        return '<div style="background:#C6D6EE;position:absolute;width:'+width+'px;height:22px"></div>'
			            + '<div style="border:solid 1px #FF0000;position:relative;height:20px;line-height:20px;width:'+columnWidth+'px;">'+value+'%</div>';
			    }
			}, {
				id : 'dealStatus',
				header : '办理状态',
				dataIndex : 'dealStatus',
				hidden: false,
				sortable: true,
				align: 'center',
				width : 60,
				renderer : statusShow
			}, {
				id : 'mgmUser',
				header : '负责人',
				dataIndex : 'mgmUser',
				hidden : true
			}, {
				id : 'planStartDate',
				header : '计划开始时间',
				dataIndex : 'planStartDate',
				width : 90,
				sortable: true,
				align: 'center',
				renderer : formatDate
				
			}, {
				id : 'planEndDate',
				header : '计划结束时间',
				dataIndex : 'planEndDate',
				width : 90,
				align: 'center',
				sortable: true,
				renderer : formatDate
			}, {
				id : 'realStartDate',
				header : '实际开始时间',
				dataIndex : 'realStartDate',
				width : 90,
				align: 'center',
				sortable: true,
				renderer : formatDate
			}, {
				id : 'realEndDate',
				header : '实际结束时间',
				dataIndex : 'realEndDate',
				sortable: true,
				width : 90,
				align: 'center',
				renderer : formatDate
			}]);
	//批文办理数据源
	var pwDS = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : 'com.sgepit.pcmis.approvl.hbm.PcPwApprovalMgm',
			business : 'baseMgm',
			method : 'findWhereOrderby',
			params : "pid='" + pid + "' order by inputDate desc"
		},
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : MAIN_SERVLET
				}),
      		 
		reader : new Ext.data.JsonReader({
					root : 'topics',
					totalProperty : 'totalCount',
					id : "uids"
				}, pwColumns),
		remoteSort : true,
		pruneModifiedRecords : true
			// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		});
	
	// 创建显示批文办理情况的grid
	pwGrid = new Ext.grid.EditorGridTbarPanel({
		region : 'center',
		ds : pwDS,
		cm : pwCm, // 列模型
		sm : multiSelModel,
		saveBtn: false,
		addBtn: false,
		delBtn: false,
		tbar : ['&nbsp;&nbsp; 批文名称：&nbsp;&nbsp;&nbsp;&nbsp', 
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
				 				doSerach();
				 			}
				 		}
					}
				}, 
				'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp','办理状态: &nbsp;&nbsp;', pwStatusCombo,
				'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp','|',
				{
					xtype: 'tbbutton',
					width: 40,
					text: '返回'.bold(),
					iconCls: 'returnTo',
					handler: function(){ history.back()}
				},	
				'|',
				{
					xtype: 'tbbutton',
					width: 40,
					text: '下载附件'.bold(),
					iconCls: 'download',
					handler: function(){
						var returnFlag = false;  //函数是否返回标识
						var records = pwGrid.getSelectionModel().getSelections();
						if(records.length==0)
						{
							Ext.Msg.alert('提示信息', '请至少选中一条记录!');
							return;
						}
						
						var selectedUids = "(";     //用户选中记录主键组成的字符串
						for(var i=0; i<records.length; i++)
						{
							selectedUids += "'"+(records[i].get('uids')+"',")
						}
						
						selectedUids = selectedUids.substr(0,selectedUids.length-1)+")";
						//前台根据用户选中的主键值, 查询一次数据库获得fileLsh的数据集, 如果集为空, 提示用户选中的记录没有附件

						DWREngine.setAsync(false);
							baseDao.findByWhere2("com.sgepit.frame.sysman.hbm.SgccAttachList", 
									"transaction_type='"+bussinessType+"' and transaction_id in"+
									selectedUids,function(list){
													if(list.length==0)
													{
															returnFlag = true;
															Ext.Msg.alert('提示信息','您选中的批文记录没有附件!');
													}
												}
							)		
						DWREngine.setAsync(true);
						//选中批文记录没有附件就给提示然后返回, 不提交请求
						if(returnFlag)
						{
							return;
						}
						var openUrl = CONTEXT_PATH + "/servlet/ApprovlServlet?ac=downloadApprovls&selectedUids="
											+selectedUids+"&bussinessType="+bussinessType;
						document.all.formAc.action = openUrl;       
						document.all.formAc.submit();
					}
				}
//				'&nbsp;&nbsp;&nbsp;&nbsp',batchDownLoad
				],// 顶部工具栏，可选
		border : false, 
		clicksToEdit : 2,              // 单元格单击进入编辑状态,1单击，2双击
		autoScroll : true,             // 自动出现滚动条
		collapsible : false,           // 是否可折叠
		animCollapse : false,          // 折叠时显示动画
		loadMask : true,               // 加载时是否显示进度
		viewConfig : {
			forceFit : false,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : 20,
			store : pwDS,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		})
	});
      
	// 下面是布局的实现-----------------------------------------------------------------
	var viewPort = new Ext.Viewport({
				layout : 'border',
				items :[pwGrid]
			})
	pwDS.load({params:{start:0, limit:20}});
	
     
	//显示文件概述对话框
	OverviewWindow=Ext.extend(Ext.Window ,{
		title:"文件概述",
		width:380,
		height:232,
		layout:"border",
		draggable: false,
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
}) 
// Ext.onReady()结束

//日期格式化
function formatDate(value) {
	if (value instanceof Date) {
		return new Date(value).format("Y-m-d");
	} else if(value==null||value==''||value==undefined){
		return null;
	} else {
		return value.substring(0, 10);
	}
};

function statusShow(value) {
	for (var i = 0; i < approvalStatus.length; i++) {
		if (value == approvalStatus[i][0]) {
			if(value=='0'){
				return "<font color=gray>"+approvalStatus[i][1]+"</font>";
			}else if(value=="1"){
				return "<font color=green>"+approvalStatus[i][1]+"</font>";
			}else if(value=="2"){
				return "<font color=blue>"+approvalStatus[i][1]+"</font>";
			}
			return approvalStatus[i][1];
		}
	}
	return "";
}

function doSerach(){
	var pwName = Ext.getCmp('pwField').getValue()==''? '%':Ext.getCmp('pwField').getValue();
	var status = Ext.getCmp('statusCombo').getValue()==''? '%':Ext.getCmp('statusCombo').getValue();
	//批文办理查询, 批文办理录入有项目单位树
	pwGrid.getStore().baseParams.params = "dealStatus like'" + status + 
										"'and pid='" + pid + "' and pw_name like '%"+
										pwName+"%' order by inputDate desc";
	pwGrid.getStore().load({params:{start:0,limit:20}});
}

function downloadfile(pid,biztype){
	var param = {
		businessId:pid,
		businessType:biztype,
		editable : false
	};
	showMultiFileWin(param);
}