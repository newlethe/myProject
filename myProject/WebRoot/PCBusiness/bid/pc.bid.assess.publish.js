/**
 * 评标结果公示
 */
var bidAssessPublishGrid;
var bidAssessPublishDs;
var bidAssessPublishBeanName = "com.sgepit.pcmis.bid.hbm.PcBidAssessPublish";
var plantInt;
//其它资料
var bidAssessPublishOther = "PCBidAssessPublishOther";
var tbUnitStore, tbUnitCombo;
var curDeletedBidAssessPublishId;
var disableBtn = ModuleLVL != '1';
var doExchange = DEPLOY_UNITTYPE != '0';
// 招标类型array
var bidApplySelectBar;
// 招标内容array
var zbContentArr = new Array();
var zbContentStore;
var zbContentCombo;
var progressType = 'BidAssessPublish';
var progressInitialized = false;

Ext.onReady(function() {
	var downloadColStr = disableBtn ? '查看' : '上传';

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

	// appMgm.getCodeValue('招标类型', function(list) {
	// for (i = 0; i < list.length; i++) {
	// var temp = new Array();
	// temp.push(list[i].propertyCode);
	// temp.push(list[i].propertyName);
	// bidTypeArr.push(temp);
	// }
	// });
	DWREngine.setAsync(true);
	zbApplyStore = new Ext.data.SimpleStore({
				fields : ['k', 'v', 't'],
				data : zbApplyArr
			});

	zbContentStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : []

			});

	// 招标类型store
	// bidTypeStroe = new Ext.data.SimpleStore({
	// fields : ['k', 'v'],
	// data : bidTypeArr
	// });

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
				width:280,
				name : 'zbApplyId'
			});

	zbContentCombo = new Ext.form.ComboBox({
				triggerAction : 'all',
				emptyText : '请选择招标内容',
				mode : 'local',
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

	function selectContentCombo(record) {
		var contentUids = record.data.k;
		if (parent.curZbStat) {
			parent.curZbStat.contentId = contentUids;
		}
		reloadBidDetail(contentUids);
		loadProgressForm();
	}

	tbUnitStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : []

			});
	loadTbUnitCombo();
	// 选择已通过预审单位
	tbUnitCombo = new Ext.form.ComboBox({
				triggerAction : 'all',
				mode : 'local',
				store : tbUnitStore,
				lazyRender : true,
				valueField : 'k',
				displayField : 'v',
				editable : false,
				allowBlank : false,
				name : 'tbUnit'
			});


	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true,
				header : ''
			});

	// sm.on('rowselect', function(sm, idx, r) {
	//						
	// });

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
							id : 'tbUnit',
							header : '投标单位',
							dataIndex : 'tbUnit',
							width : 180,
							editor : tbUnitCombo,
							renderer : Ext.util.Format
									.comboRenderer(tbUnitCombo)
						},{
							id : 'assessResult',
							header : '评标结果',
							dataIndex : 'assessResult',
							width : 100,
							editor : new Ext.form.TextField({
										name : 'assessResult'
									})
						}, {
							id : 'otherData',
							header : '其它资料',
							dataIndex : 'uids',
							width : 50,
							align : 'center',
							renderer : function(value, metadata, record,
									rowIndex, colIndex, store) {
								return '<a href="javascript:parent.showUploadWin(\''
										+ bidAssessPublishOther
										+ '\', '
										+ !disableBtn
										+ ', \''
										+ record.data.uids
										+ '\', \'其它资料\',\''+bidAssessPublishBeanName+'\' )">'
										+ downloadColStr + '</a>'
							}
						}, {
							id : 'memo',
							header : '备注',
							dataIndex : 'memo',
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
				name : 'assessResult',
				type : 'string'
			}, {
				name : 'memo',
				type : 'string'
			}, {
				name : 'tbUnit',
				type : 'string'
			}]

	bidAssessPublishDs = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bidAssessPublishBeanName,
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
	bidAssessPublishDs.on('beforeload', function(store, options) {
				store.baseParams.params = 'contentUids' + SPLITB + bidContentId;
			});
			
	bidApplySelectBar = new Ext.Toolbar({

				items : ['招标项目: ', zbApplyCombo, ' ', '招标内容: ', zbContentCombo]

			});

	if (bidContentId != '')
		bidAssessPublishDs.load();

	plantInt = {
		uids : '',
		pid : currentPid,
		contentUids : bidContentId,
		tbUnit : '',
		assessResult :'',
		memo : ''
	};
	
	var gridLabel = new Ext.form.Label({
				html : '<b>评标结果公示</b>',
				cls : 'gridTitle'
			});

	bidAssessPublishGrid = new Ext.grid.EditorGridTbarPanel({
				region : 'center',
				ds : bidAssessPublishDs, // 数据源
				cm : cm, // 列模型
				sm : sm,
				tbar : [gridLabel, '-'], // 顶部工具栏，可选
				//title : "接受招标文件及投标保证金", // 面板标题
				iconCls : 'icon-by-category', // 面板样式
				border : false, // 
				region : 'center',
				clicksToEdit : 1, // 单元格单击进入编辑状态,1单击，2双击
			//	header : true, //
				autoScroll : true, // 自动出现滚动条
				deleteHandler : function() {
					var selSm = this.getSelectionModel();
					if (selSm.getCount() > 0) {
						curDeletedBidAssessPublishId = sm.getSelected().data.uids;
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
					store : bidAssessPublishDs,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				plant : Ext.data.Record.create(Columns),
				plantInt : plantInt,
				servletUrl : MAIN_SERVLET,
				bean : bidAssessPublishBeanName,
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
						// alert(allArr)
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
					},
					afteredit : function(e){
						if(e.field == 'tbUnit'){ 	
					    	var record = e.record;
					    	var realOld = e.originalValue;
					    	var realNew = e.value;
					    	var flag = false;
					    	var ds = bidAssessPublishDs;
					    	for(var i=0;i<ds.getCount();i++){   
							    for(var j=i+1;j<ds.getCount();j++){
							    	var tbUnit_i = ds.getAt(i).get('tbUnit');
							    	var tbUnit_j = ds.getAt(j).get('tbUnit');
									if(tbUnit_i!=null&&tbUnit_i!=""&&tbUnit_j!=null&&tbUnit_j!=""&&tbUnit_j==tbUnit_i) {   
										Ext.Msg.show({
											title : '保存出错',
											msg : '您选择的单位存在重复，请重新选择！',
											buttons : Ext.Msg.OK,
											icon : Ext.MessageBox.INFO,
											fn : function(value) {
												if(value == 'ok')
												record.set('tbUnit',realOld);
												}
										});
										flag = true;
										break;
							    	}  
							    } 
							    if(flag) break;
							}   
						}
					}
				}
			});

	bidAssessPublishGrid.on('beforeinsert', function() {
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

	bidAssessPublishGrid.on('afterdelete', function() {
				if (curDeletedBidAssessPublishId) {
					deleteBidAssessAttachment();
				}
			});
			
	formPanel.setTitle('评标结果公示-工作进度信息');
	var mainPanel = new Ext.Panel({
				layout : 'border',
				tbar : bidApplySelectBar,
				items : [formPanel, bidAssessPublishGrid]
			});

	var viewport = new Ext.Viewport({
				layout : 'fit',
				items : [mainPanel]
			});
	if(bidAssessPublishGrid.getTopToolbar().items.get('del'))		
		bidAssessPublishGrid.getTopToolbar().items.get('del').disable();
	
	sm.on('rowselect', function(sm, idx, r) {
		if(bidAssessPublishGrid.getTopToolbar().items.get('del'))		
			bidAssessPublishGrid.getTopToolbar().items.get('del').enable();				
	});
	sm.on('rowdeselect', function(sm, idx, r) {
		if(bidAssessPublishGrid.getTopToolbar().items.get('del'))		
			bidAssessPublishGrid.getTopToolbar().items.get('del').disable();				
	});			
			
	// 设置当前选择的项目
	if (parent.curZbStat) {
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

	}

});

function loadZbContentCombo(zbUids, callback) {
	zbContentArr = new Array();
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
}

function loadProgressForm() {
	if (bidContentId == null || bidContentId == '') {
		return;
	}
	PCBidDWR.getCurrentPhaseProgress(bidContentId, progressType, function(
					retVal) {
				var curProgress;
				if (retVal) {
					curProgress = new BidProgress(retVal);
					progressInitialized = true;
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
				formPanel.setTitle('【' + curZbContentName
						+ '】评标结果公示-工作进度信息');
			});
}

/**
 * 加载通过预审单位Combo
 */
function loadTbUnitCombo() {
	var tbUnitArr = new Array();

	DWREngine.setAsync(false);
	// tbUnitStore.removeAll();
	PCBidDWR.getVeryfiedUnits(bidContentId, function(list) {

				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].uids);
					temp.push(list[i].tbUnit);
					tbUnitArr.push(temp);
				}

			});
	if (tbUnitArr.length == 0) {
		tbUnitArr.push(['-1', '(无)']);
	}

	DWREngine.setAsync(true);
	tbUnitStore.loadData(tbUnitArr);

}

function reloadBidDetail(contentId) {
	bidContentId = contentId;
	plantInt.contentUids = contentId;
	loadTbUnitCombo();
	if (contentId != null && contentId != '')
		bidAssessPublishDs.reload();
}

function deleteBidAssessAttachment() {
	var bizTypes = new Array();
	bizTypes.push(bidAssessPublishOther);
	PCBidDWR.deleteZbAttachment(bizTypes, curDeletedBidAssessPublishId, function(
					retVal) {
				curDeletedBidAssessPublishId = null;
			});
}
