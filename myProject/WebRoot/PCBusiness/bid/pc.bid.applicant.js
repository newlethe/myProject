/**
 * 投标人报名信息及预审结果
 */
var applicantGrid;
var applicantDs;
var bidContentId = null;
var applicantBeanName = "com.sgepit.pcmis.bid.hbm.PcBidTbUnitInfo";
var plantInt;
var bidPreVerifyBusinessType = "PCBidPreVeryfy";
var bidApplicantOtherBusinessType = "PCBidApplicantOther";
var curDeletedApplicantId;
var disableBtn = ModuleLVL != '1';
var doExchange = DEPLOY_UNITTYPE != '0';
// 招标类型array
var bidApplySelectBar;
// 招标内容array
var zbContentArr = new Array();
var zbContentStore;
var zbContentCombo;
var progressType = 'TbUnitInfo';
var progressInitialized = false;
//bidContentId
var fileWin;
Ext.onReady(function() {
			// 移交资料室
	var transBtn = new Ext.Toolbar.Button({
				id : 'transfer',
				text : '移交文件',
				handler : onItemClick,
				icon : CONTEXT_PATH
						+ "/jsp/res/images/icons/book_go.png",
				cls : "x-btn-text-icon"
			});

	var downloadColStr = disableBtn ? '查看' : '上传';
	var exportExcelBtn = new Ext.Button({
				id : 'export',
				text : '导出数据',
				tooltip : '导出数据到Excel',
				cls : 'x-btn-text-icon',
				icon : 'jsp/res/images/icons/page_excel.png',
				handler : function() {
					exportDataFile();
				}
			});
	var importBtn = new Ext.Button({
				id : 'import',
				text : 'EXCEL导入',
				tooltip : '从Excel导入数据到数据库',
				cls : 'x-btn-text-icon',
				iconCls : 'upload',
				handler : showExcelWin
			})
	var downloadBtn = new Ext.Button({
				id : 'download',
				text : '下载模板',
				iconCls : 'download',
				tooltip : '下载已上传的Excel模板',
				handler : downLoadTemple
			})
	// 通用combobox renderer
	Ext.util.Format.comboRenderer = function(combo) {
		return function(value) {
			var record = combo.findRecord(combo.valueField, value);
			return record
					? record.get(combo.displayField)
					: combo.valueNotFoundText;
		}
	}

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
				valueField : 'k',
				displayField : 'v',
				editable : false,
				listWidth:400,
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
				editable : false
			});

	zbApplyCombo.on('select', function(combo, record, index) {
				var applyId = record.data.k;
				if (parent.curZbStat) {
					parent.curZbStat.applyId = applyId;
				}
				loadZbContentCombo(applyId, function(length) {
//							if (length > 0) {
								var rec = zbContentStore.getAt(0);
								zbContentCombo.setValue(rec.data.v);
								selectContentCombo(rec);
//							}
						});
			});

	zbContentCombo.on('select', function(combo, record, index) {
				selectContentCombo(record);
			});
	
	var veryfyResultStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : [[0, '未通过'], [1, '通过']]
			});

	var veryfyResultCombo = new Ext.form.ComboBox({
				triggerAction : 'all',
				mode : 'local',
				value : 0,
				lazyRender : true,
				store : veryfyResultStore,
				valueField : 'k',
				displayField : 'v',
				editable : false,
				name : 'veryfyResult'
			});

	// 按钮

	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : false,
				header : ''
			});


	var cm = new Ext.grid.ColumnModel({
				columns : [new Ext.grid.RowNumberer(),sm, {
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
							id : 'tbUnit',
							header : '投标单位',
							dataIndex : 'tbUnit',
							width : 180,
							editor : new Ext.form.TextField({
										name : 'tbUnit',
										allowBlank : false
									})
						}, {
							id : 'preHearResult',
							header : '预审结果',
							dataIndex : 'preHearResult',
							width :80,
							align : 'center',
							editor : veryfyResultCombo,
							renderer : Ext.util.Format
									.comboRenderer(veryfyResultCombo)
						}, {
							id : 'otherData',
							header : '预审资料',
							dataIndex : 'uids',
							align : 'center',
							width : 80,
							renderer : function(value, metadata, record,
									rowIndex, colIndex, store) {
								var downloadStr="";
								var count=0;
								DWREngine.setAsync(false);
						        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+record.data.uids+"' and transaction_type='"+bidPreVerifyBusinessType+"'", function (jsonData) {
							    var list = eval(jsonData);
							    if(list!=null){
							   	 count=list[0].num;
							     		 }  
							      	 });
							    DWREngine.setAsync(true);
							    if(disableBtn==true){
							    	 downloadStr="查看["+count+"]";
							    }else{
							    	 downloadStr="上传["+count+"]";
							    }
								return '<a href="javascript:showUploadWin(\''
										+ bidPreVerifyBusinessType
										+ '\', '
										+ !disableBtn
										+ ', \''
										+ record.data.uids
										+ '\', \'预审资料\',\'com.sgepit.pcmis.bid.hbm.PcBidTbUnitInfo\' )">'
										+ downloadStr + '</a>'
							}
						}, {
							id : 'otherData',
							header : '其它资料',
							dataIndex : 'uids',
							align : 'center',
							width : 40,
							renderer : function(value, metadata, record,
									rowIndex, colIndex, store) {
								return '<a href="javascript:parent.showUploadWin(\''
										+ bidApplicantOtherBusinessType
										+ '\', '
										+ !disableBtn
										+ ', \''
										+ record.data.uids
										+ '\', \'其它资料\',\'com.sgepit.pcmis.bid.hbm.PcBidTbUnitInfo\' )">'
										+ downloadColStr + '</a>'
							},
							hidden : true
						}, {
							id : 'startDate',
							header : '开始时间',
							dataIndex : 'startDate',
							width : 60,
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
							width : 60,
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
							width : 60,
							align : 'center',
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
						}, {
							id : 'respondUser',
							header : '负责人',
							width : 100,
							dataIndex : 'respondUser',
							editor : new Ext.form.TextField({
										name : 'respondUser'
									}),
							hidden : true
						}, {
							id : 'contactPerson',
							header : '联系人',
							dataIndex : 'contactPerson',
							width : 80,
							editor : new Ext.form.TextField({
										name : 'contactPerson',
										maxLength: 32,
										maxLengthText : 'xxx'
									})
						},{
							id : 'contactPhone',
							header : '联系电话',
							dataIndex : 'contactPhone',
							width : 80,
							editor : new Ext.form.TextField({
										name : 'contactPhone'
									})
						},{
							id : 'contactMail',
							header : '联系人邮箱',
							dataIndex : 'contactMail',
							width : 100,
							editor : new Ext.form.TextField({
										name : 'contactMail',
										listeners:{
											change: function(o)
											{
												if(!checkemail(o.getValue()))
												{
													Ext.Msg.show({
															title: '提示',
															msg: '错误的邮箱地址!',
															buttons: Ext.Msg.OK,
															icon: Ext.MessageBox.INFO
														});
												}
											}
										
										}
									})
						},{
							id : 'memo',
							header : '备注',
							dataIndex : 'memo',
							width : 80,
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
				name : 'contactPerson',
				type : 'string'
			},{
				name : 'contactPhone',
				type : 'string'
			},{
				name : 'contactMail',
				type : 'string'
			},{
				name : 'memo',
				type : 'string'
			}, {
				name : 'tbUnit',
				type : 'string'
			}, {
				name : 'preHearResult',
				type : 'string'
			}]

	applicantDs = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : applicantBeanName,
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
	applicantDs.on('beforeload', function(store, options) {
				store.baseParams.params = 'contentUids' + SPLITB + bidContentId;
			});

	bidApplySelectBar = new Ext.Toolbar({
				items : ['招标项目: ', zbApplyCombo, ' ', '招标内容: ', zbContentCombo]
			});

	if (bidContentId != '')
		applicantDs.load();

	plantInt = {
		uids : '',
		pid : currentPid,
		contentUids : bidContentId,
		startDate : null,
		endDate : null,
		rateStatus : 0,
		respondDept : '',
		respondUser : '',
		tbUnit : '',
		preHearResult : '0',
		contactPerson: '',
		contactPhone: '',
		contactMail: '',
		memo : ''
	};

	var gridLabel = new Ext.form.Label({
				html : '<b>投标单位预审信息&nbsp;&nbsp;&nbsp;&nbsp;</b>',
				cls : 'gridTitle'
			});

	applicantGrid = new Ext.grid.EditorGridTbarPanel({
				region : 'center',
				ds : applicantDs, // 数据源
				cm : cm, // 列模型
				sm : sm,
				tbar : new Ext.Toolbar({
							items : [exportExcelBtn,'-',gridLabel, '-',transBtn,"-"]
						}),
				iconCls : 'icon-by-category', // 面板样式
				border : false, // 
				region : 'center',
				clicksToEdit : 1, // 单元格单击进入编辑状态,1单击，2双击
				header : false, //
				autoScroll : true, // 自动出现滚动条
				deleteHandler : function() {
					var flag_="1";
					var selSm = this.getSelectionModel();
					if (selSm.getCount() > 0) {
						curDeletedApplicantId = sm.getSelected().data.uids;
                   		 //bidContentId招标内容编号
						DWREngine.setAsync(false);
						PCBidDWR.checkIfApplicantDelete(bidContentId,curDeletedApplicantId,function(flag){
							flag_=flag;
						});
					DWREngine.setAsync(true);						
					if(flag_=="2"){
						Ext.example.msg("提示","本投标内容下的投标单位已被引用，不能删除！");
						return;
					}else{
						this.defaultDeleteHandler();
					}					
					}
				},
				saveHandler : function() {
					var flag_="1";
					var selSm = this.getSelectionModel();
					if (selSm.getCount() > 0) {
						curDeletedApplicantId = sm.getSelected().data.uids;
						var preHearResult=sm.getSelected().data.preHearResult;
                   		 //bidContentId招标内容编号
						DWREngine.setAsync(false);
						PCBidDWR.checkIfApplicantDelete(bidContentId,curDeletedApplicantId,function(flag){
							flag_=flag;
						});
					DWREngine.setAsync(true);
					if(flag_=="2"&&preHearResult==0){
						Ext.example.msg("提示","本投标内容下的投标单位已被引用，不能修改预审结果！");
						applicantDs.reload();
						return;
					}else{
						this.defaultSaveHandler();
					}
					}
				},
				loadMask : true, // 加载时是否显示进度
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : applicantDs,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				plant : Ext.data.Record.create(Columns),
				plantInt : plantInt,
				servletUrl : MAIN_SERVLET,
				bean : applicantBeanName,
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
							//投标人报名信息及预审结果
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
						//alert(delArr);
						if (delArr.length > 0) {
							//参数说明：业务bean名称，数据主键数据，是否立即发送，发送单位，接收单位
							PCBidDWR.excDataZbProcessForDel(bean,delArr,false,currentPid,defaultOrgRootID,function(flag){
							})

						}

					}
				}
			});

	applicantGrid.on('beforeinsert', function() {
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

	applicantGrid.on('afterdelete', function() {
				if (curDeletedApplicantId) {
					deleteApplicantAttachment();
				}
			});

	formPanel.setTitle('投标人报名信息及预审结果-工作进度信息');
	var mainPanel = new Ext.Panel({
				layout : 'border',
				tbar : bidApplySelectBar,
				items : [formPanel, applicantGrid]
			});

	var viewport = new Ext.Viewport({
				layout : 'fit',
				items : [mainPanel]
			});
	
	applicantGrid.getTopToolbar().add('->',importBtn,'-',downloadBtn);
	if(applicantGrid.getTopToolbar().items.get('del'))
		applicantGrid.getTopToolbar().items.get('del').disable();
	
	sm.on('rowselect', function(sm, idx, r) {
		if(applicantGrid.getTopToolbar().items.get('del'))
			applicantGrid.getTopToolbar().items.get('del').enable();				
	});
	sm.on('rowdeselect', function(sm, idx, r) {
		if(applicantGrid.getTopToolbar().items.get('del'))
			applicantGrid.getTopToolbar().items.get('del').disable();				
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

function loadProgressForm() {
	if (bidContentId == null || bidContentId == '') {
		formPanel.getForm().reset();
		formPanel.setTitle('投标人报名信息及预审结果-工作进度信息');
		return;
	}
	DWREngine.setAsync(false);
	//这里一定会获取一个progress的对象, 要么是已经存在, 要么是后台新构造并插入数据库的内容
	PCBidDWR.getCurrentPhaseProgress(bidContentId, progressType, function(
					retVal) {
				if(retVal==null)
				{
					Ext.Msg.show({
							title: '提示',
							msg: '数据加载失败!',
							buttons: Ext.Msg.OK,
							icon: Ext.MessageBox.INFO
					});
					return;
				}	
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
	DWREngine.setAsync(true);			
				var curProgress = new BidProgress(retVal);
				progressInitialized = true;					
				formPanel.getForm().reset();
				formPanel.getForm().loadRecord(curProgress);
				var curZbContentName = zbContentCombo.getRawValue();
			    var uids=formPanel.getForm().findField('uids').getValue();		
				formPanel.setTitle('【' + curZbContentName
				+ '】投标人报名信息及预审结果-工作进度信息'+"     "+"<a style='cursor:hand;text-decoration:underline' onclick='clickByFormText(\""+ uids+ "\")'>"+"移交文件"+"</a>");						
					});
}

function reloadBidDetail(contentId) {
	bidContentId = contentId;
	plantInt.contentUids = contentId;
//	if (contentId != null && contentId != '')
		applicantDs.reload();
}

function deleteApplicantAttachment() {
	var bizTypes = new Array();
	bizTypes.push(bidPreVerifyBusinessType);
	PCBidDWR.deleteZbAttachment(bizTypes, curDeletedApplicantId, function(
					retVal) {
				curDeletedApplicantId = null;
			});
}

//mail地址格式验证
function checkemail(str){
	var Expression=/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/; 
	var objExp=new RegExp(Expression);
	if(objExp.test(str)==true){
		return true;
	}else{
		return false;
	}
}
   //数据导出
	function exportDataFile() {
		var openUrl = CONTEXT_PATH    
				+ "/servlet/PcBidServlet?businessType=applicantDataList&ac=exportApplicantData&content_uids="+bidContentId;	
		document.all.formAc.action = openUrl;       
		document.all.formAc.submit();
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
function showUploadWin(businessType, editable, businessId, winTitle,beanName) {

	if (businessId == null || businessId == '') {
		Ext.Msg.show({
					title : '上传文件',
					msg : '请先保存记录再进行上传！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.WARNING
				});
		return;
	}

	var title = '上传文件';
	if (winTitle) {
		title = winTitle;
	}

	fileUploadUrl = CONTEXT_PATH
			+ "/jsp/common/fileUploadMulti/fileUploadSwf.jsp?openType=url&businessType="
			+ businessType + "&editable=" + editable + "&businessId="
			+ businessId+"&beanName="+beanName;
	fileWin = new Ext.Window({
				title : title,
				width : 600,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				closeAction : 'close',
				modal : true,
				html : "<iframe name='fileFrame' src='"
						+ fileUploadUrl
						+ "' frameborder=0 style='width:100%;height:100%;'></iframe>"
			});
	fileWin.show();
	fileWin.on("close",function(){
		applicantDs.load();
	});
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
function onItemClick(item) {
	switch (item.id) {	
		case 'transfer' :
			var selRecords = applicantGrid.getSelectionModel().getSelections();
			if (selRecords.length < 1) {
				return;
			}
			// 取得record数据要加 .data
			// alert(selRecords[0].data.fileTile);
			var fileIdArr = [];
			for (var i = 0; i < selRecords.length; i++) {
				fileIdArr.push(selRecords[i].data.uids);		
			}
			//Ext.log(fileIdArr);
			yjzls(fileIdArr.join(','));

			break;
	}
}
function yjzls(filePk) {
	var rtn = window
			.showModalDialog(
					CONTEXT_PATH
							+ "/PCBusiness/bid/com.fileTrans.jsp?type=PcBidTbUnitInfo&fileId="
							+ filePk,
					null,
					"dialogWidth:1000px;dialogHeight:500px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	if (rtn) {
	}
}
// 下载数据上传模板
function downLoadTemple() {
	var fileid="";
	var sql = "select t.fileid from APP_TEMPLATE  t where t.templatecode='pcBidTbUnitInfo'";
	DWREngine.setAsync(false);
	baseMgm.getData(sql, function(str) {
				fileid = str;
			});
	DWREngine.setAsync(true);
	if (fileid && fileid.length > 0) {
		window.location.href = MAIN_SERVLET
				+ "?ac=downloadFile&fileid=" + fileid;
	} else {
		alert("请先联系管理员，在系统管理中上传模板")
	}
}
function showExcelWin() {
	if (bidContentId == null || bidContentId == '') {
		Ext.Msg.show({
					title : '提示',
					msg : '请先选择一条招标内容！',
					buttons : Ext.Msg.OK,
					icon : Ext.MessageBox.INFO
				});
		return false;

	}
		if (!fileWin) {
			var fileForm = new Ext.form.FormPanel({
						fileUpload : true,
						labelWidth : 70,
						layout : 'form',
						baseCls : 'x-plain',
						items : [{
							id : 'excelfile',
							xtype : 'fileuploadfield',
							fieldLabel : '请选择文件',
							buttonText : '浏览...',
							width : 350,
							border : false,
							listeners : {
								'fileselected' : function(field, value) {
									var _value = value.split('\\')[value
											.split('\\').length
											- 1]
									if ((_value.indexOf('.xls') != -1)
											|| (_value.indexOf('.xlsx') != -1)) {
										this.ownerCt.buttons[0].enable()
									} else {
										field.setValue('')
										this.ownerCt.buttons[0].disable()
										Ext.example.msg('警告', '请上传excel格式的文件')
									}
								}
							}
						},{
							id:'tips',
							xtype:'label',
							width : 390,
							html:'<div><font color="red"><span style="width:440px; display: inline-block; height:20px; line-height:20px; text-align:center;">提示：导入需先下载模板&nbsp;</span></font></div>'
						}],
						buttons : [{
									text : '确定',
									iconCls : 'upload',
									disabled : true,
									handler : doExcelUpLoad
								}]
					})
			var fileWin = new Ext.Window({
						id : 'excelWin',
						title : 'excel导入',
						modal : true,
						width : 450,
						height : 110,
						items : [fileForm]
					})
		}
		fileWin.show()
}
// 导入数据
function doExcelUpLoad() {
	var win = this.ownerCt.ownerCt
	var file = this.ownerCt.getForm().findField("excelfile").getValue();
	this.ownerCt.getForm().submit({
		waitTitle : '请稍候...',
		waitMsg : '数据上传中...',
		url : CONTEXT_PATH
				+ "/servlet/PcBidServlet?ac=importExcelData&pid="+currentPid+"&masterId="+bidContentId,
		method : 'POST',
		success : function(form, action) {
			var obj = action.result.msg;
            msg = (!!obj&&obj.length > 0) ? obj[0].result : "报表数据导入成功！";
			Ext.Msg.alert('恭喜', msg, function(v) {
						win.close();
						applicantDs.reload();
					})
		},
		failure : function(form, action) {
			var obj = action.result.msg;
            msg = (!!obj&&obj.length > 0) ? obj[0].result : "报表数据导入错误！";
			Ext.Msg.alert('提示', action.result.msg, function(v) {
						win.close();
						applicantDs.reload();
					})
		}
	})
}