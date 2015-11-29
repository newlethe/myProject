/**
 * 评标委员会
 */
var assessCouncilGrid;
var assessCouncilDs;
var assessCouncilBeanName = "com.sgepit.pcmis.bid.hbm.PcBidAssessCouncil";
var plantInt;
var bidContentId = null; //招标内容主键
var councilOtherBusinessType = "PCBidCouncilOther";
var resumeBusinessType = "PCBidCouncilResume";
var curDeletedAssessCouncilId;
var disableBtn = ModuleLVL != '1';
var doExchange = DEPLOY_UNITTYPE != '0';
// 招标类型array
var bidApplySelectBar;
// 招标内容array
var zbContentArr = new Array();
var zbContentStore;
var zbContentCombo;
var progressType = 'AssessCouncil';
var progressInitialized = false;
Ext.onReady(function() {
	var downloadColStr = disableBtn ? '查看' : '上传';

	// 招标项目下拉框
	var zbApplyArr = new Array();

	DWREngine.setAsync(false);

	PCBidDWR.getBidApplyForCurrentPrj(parent.outFilter,currentPid, function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].uids);
					temp.push(list[i].zbName);
					temp.push(list[i].zbType)
					zbApplyArr.push(temp);
				}
			});

	DWREngine.setAsync(true);
	zbApplyStore = new Ext.data.SimpleStore({
				fields : ['k', 'v', 't'],
				data : zbApplyArr
			});

	zbContentStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : []

			});

	zbApplyCombo = new Ext.form.ComboBox({
				triggerAction : 'all',
				emptyText : '请选择招标项目',
				mode : 'local',
				lazyRender : false,
				lazyInit : false,
				store : zbApplyStore,
				listWidth:400,
				valueField : 'k',
				displayField : 'v',
				editable : false,
				width:280,
				name : 'zbApplyId'
			});

	zbContentCombo = new Ext.form.ComboBox({
				triggerAction : 'all',
				emptyText : '请选择招标内容',
				mode : 'local',
				width:280,
				listWidth:400,
				store : zbContentStore,
				lazyRender : true,
				valueField : 'k',
				displayField : 'v',
				width:280,
				editable : false
			});

	zbApplyCombo.on('select', function(combo, record, index) {
				var applyId = record.data.k;
				if (parent.curZbStat) {
					parent.curZbStat.applyId = applyId;
				}
				loadZbContentCombo(applyId, function(length) {
								var rec = zbContentStore.getAt(0);
								zbContentCombo.setValue(rec.data.v);
								selectContentCombo(rec);
						});
			});

	zbContentCombo.on('select', function(combo, record, index) {
				selectContentCombo(record);

			});

	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true,
				header : ''
			});

	var cm = new Ext.grid.ColumnModel({
		columns : [new Ext.grid.RowNumberer(), {
				id : 'uids',
				header : 'uids',
				dataIndex : 'uids',
				width : 100,
				hidden : true
			}, {
				id : 'pid',
				header : '项目编号',
				width : 100,
				dataIndex : 'pid',
				hidden : true
			}, {

				id : 'contentUids',
				header : '招标内容编号',
				width : 100,
				dataIndex : 'contentUids',
				hidden : true
			}, {
				id : 'juryName',
				header : '评委姓名',
				dataIndex : 'juryName',
				width : 40,
				editor : new Ext.form.TextField({
							name : 'juryName'
						})
			}, {
				hidden:true,
				id : 'jobTitle',
				header : '评委职称',
				dataIndex : 'jobTitle',
				width : 60,
				editor : new Ext.form.TextField({
							name : 'jobTitle'
						})
			},{
				id : 'resume',
				header : '评委简历',
				dataIndex : 'uids',
				align : 'center',
//				width : 60,
				hidden: true,
				renderer : function(value, metadata, record, rowIndex,
						colIndex, store) {
					return '<a href="javascript:parent.showUploadWin(\''
							+ resumeBusinessType + '\', ' + !disableBtn
							+ ', \'' + record.data.uids + '\', \'评委简历\',\''+assessCouncilBeanName+'\' )">'
							+ downloadColStr + '</a>'
				}
			}, {
				id : 'otherData',
				header : '其它资料',
				dataIndex : 'uids',
				align : 'center',
				width : 60,
				renderer : function(value, metadata, record, rowIndex,
						colIndex, store) {
					return '<a href="javascript:parent.showUploadWin(\''
							+ councilOtherBusinessType + '\', ' + !disableBtn
							+ ', \'' + record.data.uids + '\', \'其它资料\' )">'
							+ downloadColStr + '</a>'
				},
				hidden : true
			}, {
				id : 'startDate',
				header : '开始时间',
				dataIndex : 'startDate',
				width : 100,
				renderer : Ext.util.Format.dateRenderer('Y-m-d'), // Ext内置日期renderer
				type : 'date',
				editor : new Ext.form.DateField({
							name : 'startDate',
							readOnly:true,
							format : 'Y-m-d'
						}),
				hidden : true
			}, {
				id : 'endDate',
				header : '结束时间',
				dataIndex : 'endDate',
				width : 100,
				renderer : Ext.util.Format.dateRenderer('Y-m-d'), // Ext内置日期renderer
				type : 'date',
				editor : new Ext.form.DateField({
							name : 'endDate',
							readOnly:true,
							format : 'Y-m-d'
						}),
				hidden : true
			}, {
				id : 'rateStatus',
				header : '工作进度',
				dataIndex : 'rateStatus',
				width : 100,
				editor : new Ext.form.NumberField({
							name : 'rateStatus'
						}),
				hidden : true

			}, {
				id : 'respondDept',
				header : '负责部门',
				width : 100,
				dataIndex : 'respondDept',
				editor : new Ext.form.TextField({
							name : 'respondDept'
						}),
				hidden : true

				// ,hidden : true
		}	, {
				id : 'respondUser',
				header : '负责人',
				width : 40,
				dataIndex : 'respondUser',
				editor : new Ext.form.TextField({
							name : 'respondUser'
						}),
				hidden : true

				// ,hidden : true
		}	, {
				id : 'memo',
				header : '备注',
				dataIndex : 'memo',
				width : 140,
				editor : new Ext.form.TextField({
							name : 'memo'
						})
			}]
	});

	var Columns = [{
				name : 'uids',
				type : 'string'
			}, // Grid显示的列，必须包括主键(可隐藏)
			{
				name : 'pid',
				type : 'string'
			}, {
				name : 'contentUids',
				type : 'string'
			}, {
				name : 'startDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'

			}, {
				name : 'endDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}, {
				name : 'rateStatus',
				type : 'float'
			}, {
				name : 'respondDept',
				type : 'string'
			}, {
				name : 'respondUser',
				type : 'string'
			}, {
				name : 'memo',
				type : 'string'
			}, {
				name : 'juryName',
				type : 'string'
			},{
				name : 'jobTitle',
				type : 'string'
			}]

	assessCouncilDs = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : assessCouncilBeanName,
			business : "baseMgm",
			method : "findByProperty"
		},
		proxy : new Ext.data.HttpProxy({
					method : 'GET',
					url : MAIN_SERVLET
				}),
		reader : new Ext.data.JsonReader({
					root : 'topics',
					totalProperty : 'totalCount',
					id : "uids"
				}, Columns),
		remoteSort : true,
		pruneModifiedRecords : true
			// 若remoteSort为真，则必须为真,否则新增行未保存时按列排序报错
		});
	assessCouncilDs.on('beforeload', function(store, options) {
				store.baseParams.params = 'contentUids' + SPLITB + bidContentId;
			});
			
	bidApplySelectBar = new Ext.Toolbar({

				items : ['招标项目: ', zbApplyCombo, ' ', '招标内容: ', zbContentCombo]

			});

	if (bidContentId != '')
		assessCouncilDs.load();

	plantInt = {
		uids : '',
		pid : currentPid,
		contentUids : bidContentId,
		startDate : null,
		endDate : null,
		rateStatus : 0,
		respondDept : '',
		respondUser : '',
		juryName : '',
		memo : '',
		jobTitle:''
	};
	
	var gridLabel = new Ext.form.Label({
				html : '<b>评标委员会成员信息</b>',
				cls : 'gridTitle'
			});

	assessCouncilGrid = new Ext.grid.EditorGridTbarPanel({
				region : 'center',
				ds : assessCouncilDs, // 数据源
				cm : cm, // 列模型
				sm : sm,
				tbar : [gridLabel, '-'], // 顶部工具栏，可选
				//title : "组建评标委员会", // 面板标题
				iconCls : 'icon-by-category', // 面板样式
				border : false, // 
				region : 'center',
				clicksToEdit : 1, // 单元格单击进入编辑状态,1单击，2双击
				//header : true, //
				autoScroll : true, // 自动出现滚动条
				deleteHandler : function() {
					var selSm = this.getSelectionModel();
					if (selSm.getCount() > 0) {
						curDeletedAssessCouncilId = sm.getSelected().data.uids;
						this.defaultDeleteHandler();
					}
				},
				loadMask : true, // 加载时是否显示进度
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : assessCouncilDs,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				plant : Ext.data.Record.create(Columns),
				plantInt : plantInt,
				servletUrl : MAIN_SERVLET,
				bean : assessCouncilBeanName,
				business : "baseMgm",
				primaryKey : "uids",
				listeners : {
					aftersave : function(grid, idsOfInsert, idsOfUpdate,
							primaryKey, bean) {
						if (!doExchange) {
							return;
						}
						var insArr = new Array();
						var updArr = new Array();
						if (idsOfInsert.length > 0) {
							insArr = idsOfInsert.split(',');

						}
						if (idsOfUpdate.length > 0) {
							updArr = idsOfUpdate.split(',');
						}
						var allArr = insArr.concat(updArr);
						if (allArr.length > 0) {
							//参数说明:业务bean，业务id数据，是否立即发送，发送单位，接收单位
							PCBidDWR.excDataZbForSave(bean,updArr,insArr,false, currentPid, defaultOrgRootID,function(flag){
							
							})
						}
					},
					afterdelete : function(grid, ids, primaryKey, bean) {
						if (!doExchange) {
							return;
						}
						var delArr = ids.split(',');
						if (delArr.length > 0) {
							//参数说明：业务bean名称，数据主键数据，是否立即发送，发送单位，接收单位
							PCBidDWR.excDataZbProcessForDel(bean,delArr,false,currentPid,defaultOrgRootID,function(flag){
							
							})
						}
					}
				}
			});

	assessCouncilGrid.on('beforeinsert', function() {
				if (bidContentId == null || bidContentId == '') {
					Ext.Msg.show({
								title : '新增记录',
								msg : '请先选择一条招标内容！',
								buttons : Ext.Msg.OK,
								icon : Ext.MessageBox.INFO
							});
					return false;

				} else if (!progressInitialized) {
					Ext.Msg.show({
								title : '新增记录',
								msg : '请先保存工作进度信息！',
								buttons : Ext.Msg.OK,
								icon : Ext.MessageBox.INFO
							});
					return false;
				}

				else {
					return true;
				}
			});

	assessCouncilGrid.on('afterdelete', function() {
				if (curDeletedAssessCouncilId) {
					deleteAssessCouncilAttachment();
				}
			});
			
	formPanel.setTitle('组建评标委员会-工作进度信息');
	var mainPanel = new Ext.Panel({
				layout : 'border',
				tbar : bidApplySelectBar,
				items : [formPanel, assessCouncilGrid]
			});

	var viewport = new Ext.Viewport({
				layout : 'fit',
				items : [mainPanel]
			});
			
	loadProgressForm();
	reloadBidDetail(bidContentId);
			
	if(assessCouncilGrid.getTopToolbar().items.get('del'))
		assessCouncilGrid.getTopToolbar().items.get('del').disable();
	
	sm.on('rowselect', function(sm, idx, r) {
		if(assessCouncilGrid.getTopToolbar().items.get('del'))
			assessCouncilGrid.getTopToolbar().items.get('del').enable();				
	});
	sm.on('rowdeselect', function(sm, idx, r) {
		if(assessCouncilGrid.getTopToolbar().items.get('del'))
			assessCouncilGrid.getTopToolbar().items.get('del').disable();				
	});		
			
	pageInit();
});

function loadZbContentCombo(zbUids, callback) {
	zbContentArr = new Array();
	DWREngine.setAsync(false);
		PCBidDWR.getContentForCurrentApply(parent.outFilter,zbUids, function(list) {
					for (var i = 0; i < list.length; i++) {
						var temp = new Array();
						temp.push(list[i].uids);
						temp.push(list[i].contentes);
						zbContentArr.push(temp);
					}
					if(list.length==0){
						var temp = new Array();
						temp.push("");
						temp.push("");
						zbContentArr.push(temp);
					}
					zbContentStore.loadData(zbContentArr);
					if (callback) {
						callback(list.length);
					}
	
				});
	DWREngine.setAsync(true);		
}
function clickByFormText(uids){
		var fileIdArr = [];
		fileIdArr.push(uids);
		yjzlsByFormText(fileIdArr.join(','));
}
function yjzlsByFormText(filePk) {
	var rtn = window
			.showModalDialog(
					CONTEXT_PATH
							+ "/PCBusiness/bid/com.fileTrans.jsp?type=PcBidProgress&fileId="
							+ filePk,
					null,
					"dialogWidth:1000px;dialogHeight:500px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	if (rtn) {
	}
}
function loadProgressForm() {
	if (bidContentId == null || bidContentId == '') {
		formPanel.getForm().reset();
		formPanel.setTitle('组建评标委员会-工作进度信息');
		return;
	}
	DWREngine.setAsync(false);
		PCBidDWR.getCurrentPhaseProgress(bidContentId, progressType, function(
						retVal) {
					var curProgress;
					if (retVal) {
						//选择招标内容时重新加载根据负责部门重新加载负责人
					if(retVal.respondDept){
						PCBidDWR.getUserInDept(retVal.respondDept,function(list){
						array_user=new Array();
						for(i = 0; i < list.length; i++) {
							var temp = new Array();	
							temp.push(list[i].userid);
							temp.push(list[i].realname);
							array_user.push(temp);			
							}
			 			});	
			 			if(array_user&&array_user.length>0){
			 					dsCombo_user.loadData(array_user);	
			 			}
					}						
						curProgress = new BidProgress(retVal);
						progressInitialized = true;
						curProgress.respondDept=retVal.respondDept;		
					} else {
						// 创建新对象
						var curDate = new Date();
						var curProgress = new BidProgress({
									pid : currentPid,
									contentUids : bidContentId,
									progressType : progressType
	
								});
						progressInitialized = false;
					}
					formPanel.getForm().reset();
					formPanel.getForm().loadRecord(curProgress);
					var curZbContentName = zbContentCombo.getRawValue();
			   		var uids=formPanel.getForm().findField('uids').getValue();		
					formPanel.setTitle('【' + curZbContentName
					+ '】组建评标委员会-工作进度信息'+"     "+"<a style='cursor:hand;text-decoration:underline' onclick='clickByFormText(\""+ uids+ "\")'>"+"移交文件"+"</a>");								
		});
	DWREngine.setAsync(true);
}

function reloadBidDetail(contentId) {
	bidContentId = contentId;
	plantInt.contentUids = contentId;
//	if (contentId != null && contentId != '')
		assessCouncilDs.reload();
}

function deleteAssessCouncilAttachment() {
	var bizTypes = new Array();
	bizTypes.push(resumeBusinessType);
	PCBidDWR.deleteZbAttachment(bizTypes, curDeletedAssessCouncilId, function(
					retVal) {
				curDeletedAssessCouncilId = null;
			});
}

//页面初始化加载数据的
function pageInit()
{
	if (parent.curZbStat.applyId) {
		var applyId = parent.curZbStat.applyId;
		var idx = zbApplyStore.find('k', applyId);
		if (idx != -1) {
			var rec = zbApplyStore.getAt(idx);
			zbApplyCombo.setValue(rec.data.v);
			loadZbContentCombo(applyId, function() {
						if (parent.curZbStat.contentId) {
							var contentId = parent.curZbStat.contentId;
							var idx = zbContentStore.find('k', contentId);
							if (idx != -1) {
								var rec = zbContentStore.getAt(idx);
								zbContentCombo.setValue(rec.data.v);
								selectContentCombo(rec);
							}
						}
					});
	
		}
	}
	else
	{
		if(zbApplyStore.data.length > 0){
			var applyRecord = zbApplyStore.getAt(0);
			parent.curZbStat.applyId = applyRecord.data.k;
			zbApplyCombo.setValue(applyRecord.data.v);
			loadZbContentCombo(parent.curZbStat.applyId, function() {
				if(zbContentStore.data.length > 0){
					var contentRecord = zbContentStore.getAt(0);
					parent.curZbStat.contentId = contentRecord.data.k;
					zbContentCombo.setValue(contentRecord.data.v);
					selectContentCombo(contentRecord)
				}
			});
		}
	}
}

function selectContentCombo(record) {
	var contentUids = record.data.k;
	if (parent.curZbStat) {
		parent.curZbStat.contentId = contentUids;
	}
	reloadBidDetail(contentUids);
	loadProgressForm();
}
