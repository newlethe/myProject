/**
 * 合同签订情况跟踪
 */
var contractTrackGrid;
var contractTrackDs;
var contractBeanName = 'com.sgepit.pmis.contract.hbm.ConOveView';
var curDeletedContractTrackId;
var partyBs = new Array();

var bidApplySelectBar; // 招标类型array
var zbContentArr = new Array();  // 招标内容array
var zbContentStore;
var zbContentCombo;
var progressType = 'BidAssessPublish';
var progressInitialized = false;

Ext.onReady(function() {
	// 通用combobox renderer
	Ext.util.Format.comboRenderer = function(combo) {
		return function(value) {
			var record = combo.findRecord(combo.valueField, value);
			return record
					? record.get(combo.displayField)
					: combo.valueNotFoundText;
		}
	}
	DWREngine.setAsync(false);
	conpartybMgm.getPartyB(function(list) { // 获取乙方单位
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].cpid);
					temp.push(list[i].partyb);
					partyBs.push(temp);
				}
			});
	DWREngine.setAsync(true);
	
	// 招标项目下拉框
	var zbApplyArr = new Array();

	DWREngine.setAsync(false);
    if(hasCon!=""&&hasCon!=null){
     	PCBidDWR.getBidApplyForCurrentPrjByBean("ConOve",parent.outFilter,currentPid, function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].uids);
					temp.push(list[i].zbName);
					temp.push(list[i].zbType)
					zbApplyArr.push(temp);
				}
			}); 	  
    }else{
	 	PCBidDWR.getBidApplyForCurrentPrj(parent.outFilter,currentPid, function(list) {
					for (var i = 0; i < list.length; i++) {
						var temp = new Array();
						temp.push(list[i].uids);
						temp.push(list[i].zbName);
						temp.push(list[i].zbType)
						zbApplyArr.push(temp);
					}
				});   		
    }
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
				listWidth:400,
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
				listWidth:400,
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

	var dsPartyB = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : partyBs
			});

	var fc = { // 创建编辑域配置
		'conid' : {
			name : 'conid',
			fieldLabel : '主键',
			anchor : '95%',
			hidden : true,
			hideLabel : true
		},
		'pid' : {
			name : 'pid',
			fieldLabel : '工程项目编号',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'conno' : {
			name : 'conno',
			fieldLabel : '合同编号',
			anchor : '95%'
		},
		'conname' : {
			name : 'conname',
			fieldLabel : '合同名称',
			anchor : '95%'
		},
		'signdate' : {
			name : 'signdate',
			fieldLabel : '签订日期',
			format : 'Y-m-d',
			minValue : '2000-01-01',
			anchor : '95%'
		},
		'conmoney' : {
			name : 'conmoney',
			fieldLabel : '合同签订金额(元)',
			anchor : '95%'
		},
		'convaluemoney' : {
			name : 'convaluemoney',
			fieldLabel : '合同总金额(元)',
			anchor : '95%'
		},
		'partybno' : {
			name : 'partybno',
			fieldLabel : '中标单位',
			anchor : '95%'
		},
		'billstate' : {
			name : 'billstate',
			fieldLabel : '合同状态',
			anchor : '95%'
		},
		'isChange' : {
			name : 'isChange',
			fieldLabel : '是否变更',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		},
		'bidtype' : {
			name : 'bidtype',
			fieldLabel : '招标内容主键',
			hidden : true,
			hideLabel : true,
			anchor : '95%'
		}

	}

	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true,
				header : ''
			});

	// sm.on('rowselect', function(sm, idx, r) {
	//						
	// });
	//列模型
	var cm =  new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),{
				id : 'partybno',
				type : 'combo',
				header : fc['partybno'].fieldLabel,
				dataIndex : fc['partybno'].name,
				width : 120,
				renderer : function(value) {
					var index = dsPartyB.find('k', value);
					if (index > -1) {
						var vdis=dsPartyB.getAt(index).get('v');
						var qtip = "qtip=" + vdis;
						return'<span ' + qtip + '>' + vdis + '</span>';
					} else {
						return '';
					}

				}
			},  {
				id : 'conno',
				type : 'string',
				header : fc['conno'].fieldLabel,
				dataIndex : fc['conno'].name,
				width : 60,
				renderer : function (value, metadata, record){
					var conid = record.data.conid;
					var qtip = "qtip=" + value;
					//alert('<a href="javascript:void(0)" onclick="parent.showContractWindow(\'' + conid + '\')">' + value + '</a>')
					var output = '<a style="color:blue; text-decoration:none; cursor:pointer" href="javascript:void(0)" onclick="parent.showContractWindow(\'' + conid + '\')"><span ' + qtip + '>' + value + '</span></a>';
					return output;
				}
			}, {
				id : 'conname',
				type : 'string',
				header : fc['conname'].fieldLabel,
				dataIndex : fc['conname'].name,
				width : 180,
				renderer : function(value){
					var qtip = " qtip= " + value + " >";
							return '<span ' + qtip + value + '</span>';

				}
			},  {
				id : 'signdate',
				type : 'date',
				header : fc['signdate'].fieldLabel,
				dataIndex : fc['signdate'].name,
				align : 'center',
				width : 60,
				renderer : Ext.util.Format.dateRenderer('Y-m-d')// Ext内置日期renderer
			}, {
				id : 'conmoney',
				type : 'float',
				header : fc['conmoney'].fieldLabel,
				dataIndex : fc['conmoney'].name,
				width : 70,
				align : 'right',
				renderer : cnMoneyToPrec
			}, {
				id : 'convaluemoney',
				type : 'float',
				header : fc['convaluemoney'].fieldLabel,
				dataIndex : fc['convaluemoney'].name,
				width : 70,
				align : 'right',
				renderer : cnMoneyToPrec
			}, {
				id : 'bidtype',
				type : 'string',
				header : fc['bidtype'].fieldLabel,
				dataIndex : fc['bidtype'].name,
				hidden : true
			}
		]);
		cm.defaultSortable = true; // 设置是否可排序

	// 3. 定义记录集
	var Columns = [{
				name : 'conid',
				type : 'string'
			}, // Grid显示的列，必须包括主键(可隐藏)
			{
				name : 'pid',
				type : 'string'
			}, {
				name : 'conno',
				type : 'string'
			}, {
				name : 'conname',
				type : 'string'
			}, {
				name : 'partybno',
				type : 'string'
			}, {
				name : 'conmoney',
				type : 'float'
			}, {
				name : 'convaluemoney',
				type : 'float'
			}, {
				name : 'billstate',
				type : 'string'
			}, {
				name : 'isChange',
				type : 'string'
			}, {
				name : 'signdate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			},
			// zhangh 2010-10-27 bidtype
			{
				name : 'bidtype',
				type : 'string'
			}];

	contractTrackDs = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : contractBeanName,
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
		remoteSort : true
		});
	
		contractTrackDs.setDefaultSort('signdate', 'desc'); // 设置默认排序列
	
	contractTrackDs.on('beforeload', function(store, options) {
				store.baseParams.params = 'bidtype' + SPLITB + bidContentId;
			});
			
	bidApplySelectBar = new Ext.Toolbar({

				items : ['招标项目: ', zbApplyCombo, ' ', '招标内容: ', zbContentCombo]

			});

	if (bidContentId != '')
		contractTrackDs.load();
		
	var gridLabel = new Ext.form.Label({
				html : '<b>合同签订情况跟踪</b>',
				cls : 'gridTitle'
			});

	contractTrackGrid = new Ext.grid.GridPanel({
				region : 'center',
				ds : contractTrackDs, // 数据源
				cm : cm, // 列模型
				sm : sm,
				title : "合同签订情况跟踪", // 面板标题
				iconCls : 'icon-by-category', // 面板样式
				border : false, // 
				region : 'center',
				autoScroll : true, // 自动出现滚动条
				loadMask : true, // 加载时是否显示进度
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : contractTrackDs,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				})
			});
	var mainPanel = new Ext.Panel({
				layout : 'border',
				tbar : bidApplySelectBar,
				items : [contractTrackGrid]
			});

	var viewport = new Ext.Viewport({
				layout : 'fit',
				items : [mainPanel]
			});
			
	pageInit();
});

function loadZbContentCombo(zbUids, callback) {
	zbContentArr = new Array();
		DWREngine.setAsync(false);
		if(hasCon&&hasCon!=""){
			var whereStr="zbUids='"+zbUids+"'";
			PCBidDWR.getContentForCurrentApplyByWhere("ConOve",parent.outFilter,whereStr, function(list) {
						for (var i = 0; i < list.length; i++) {
							var temp = new Array();
							temp.push(list[i].uids);
							temp.push(list[i].contentes);
							temp.push(list[i].respondDept);
							temp.push(list[i].respondUser);
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
	else{
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
		DWREngine.setAsync(true);
}


function reloadBidDetail(contentId) {
	bidContentId = contentId;

//	if (contentId != null && contentId != '')
		contractTrackDs.reload();
}

//页面初始化加载数据的
function pageInit()
{
	if (parent.curZbStat&&parent.curZbStat.applyId) {
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
			var applyId = applyRecord.data.k;
			zbApplyCombo.setValue(applyRecord.data.v);
			loadZbContentCombo(applyId, function() {
				if(zbContentStore.data.length > 0){
					var contentRecord = zbContentStore.getAt(0);
					//parent.curZbStat.contentId = contentRecord.data.k;
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
}


