/**
 * 投标文件澄清
 */
var tbClarificateGrid;
var tbClarificateDs;
var tbClarificateBeanName = "com.sgepit.pcmis.bid.hbm.PcBidClarificateTbdoc";
var plantInt;
var tbNeedClaBusinessType = "PCBidTbNeedCla";
var tbClaBusinessType = "PCBidTbCla";
var tbClaOtherBusinessType = "PCBidTbOther";
var tbUnitStore, tbUnitCombo;
var curDeletedClarificateTbdocId;
var disableBtn = ModuleLVL != '1';
var doExchange = DEPLOY_UNITTYPE != '0';

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

	var columns = [
			new Ext.grid.RowNumberer(),
			{
				id : 'uids',
				header : 'uids',
				dataIndex : 'uids',
				width : 100,
				hidden : true
			}, {
				id : 'pid',
				header : '项目编号',
				width : 100,
				dataIndex : 'pid'
				,hidden : true
			}, {

				id : 'contentUids',
				header : '投标内容编号',
				width : 100,
				dataIndex : 'contentUids'
				,hidden : true
			}, {
				id : 'tbUnit',
				header : '投标单位',
				dataIndex : 'tbUnit',
				width : 180,
				editor : tbUnitCombo,
				renderer : Ext.util.Format.comboRenderer(tbUnitCombo)
			}, {
				id : 'needClarContent',
				header : '需澄清内容',
				dataIndex : 'needClarContent',
				align : 'center',
				width : 60,
				renderer : function(value, metadata, record, rowIndex,
						colIndex, store) {
					return '<a href="javascript:parent.showUploadWin(\''
							+ tbNeedClaBusinessType + '\', ' + !disableBtn + ', \''
							+ record.data.uids + '\', \'需澄清内容\' )">' + downloadColStr +'</a>'
				}
			}, {
				id : 'clarContent',
				header : '澄清内容',
				dataIndex : 'clarContent',
				align : 'center',
				width : 60,
				renderer : function(value, metadata, record, rowIndex,
						colIndex, store) {
					return '<a href="javascript:parent.showUploadWin(\''
							+ tbClaBusinessType + '\', ' + !disableBtn + ', \''
							+ record.data.uids + '\', \'澄清内容\' )">' + downloadColStr +'</a>'
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
							+ tbClaOtherBusinessType + '\', ' + !disableBtn + ', \''
							+ record.data.uids + '\', \'其它资料\' )">' + downloadColStr +'</a>'
				}
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
				id : 'memo',
				header : '备注',
				dataIndex : 'memo',
				width : 140,
				editor : new Ext.form.TextField({
							name : 'memo'
						})
			}];

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
				name : 'tbUnit',
				type : 'string'
			}, {
				name : 'needClarContent',
				type : 'string'
			}, {
				name : 'clarContent',
				type : 'string'
			}]

	tbClarificateDs = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : tbClarificateBeanName,
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
	tbClarificateDs.on('beforeload', function(store, options) {
				store.baseParams.params = 'contentUids' + SPLITB + bidContentId;
			});

	if (bidContentId != '')
		tbClarificateDs.load();

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
		memo : '',
		needClarContent : '',
		clarContent : ''
	};

	tbClarificateGrid = new Ext.grid.EditorGridTbarPanel({
				region : 'center',
				ds : tbClarificateDs, // 数据源
				columns : columns, // 列模型
				sm : sm,
				tbar : [], // 顶部工具栏，可选
				title : "投标文件澄清", // 面板标题
				iconCls : 'icon-by-category', // 面板样式
				border : false, //
				region : 'center',
				clicksToEdit : 1, // 单元格单击进入编辑状态,1单击，2双击
				header : true, //
				autoScroll : true, // 自动出现滚动条
				deleteHandler : function() {
					curDeletedClarificateTbdocId = sm.getSelected().data.uids;
					this.defaultDeleteHandler();
				},
				loadMask : true, // 加载时是否显示进度
				viewConfig : {
					forceFit : true,
					ignoreAdd : true
				},
				bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
					pageSize : PAGE_SIZE,
					store : tbClarificateDs,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				plant : Ext.data.Record.create(Columns),
				plantInt : plantInt,
				servletUrl : MAIN_SERVLET,
				bean : tbClarificateBeanName,
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
							PCBidDWR.exchangeSavedZbData(bean, allArr, false);
						}

					},
					afterdelete : function(grid, ids, primaryKey, bean) {
						if (!doExchange) {
							return;
						}
						var delArr = ids.split(',');
						if (delArr.length > 0) {
							PCBidDWR.exchangeDeletedZbData(bean, delArr, false);
						}

					}
				}
			});

	tbClarificateGrid.on('beforeinsert', function() {
				if (bidContentId == null || bidContentId == '') {
					Ext.Msg.show({
								title : '新增记录',
								msg : '请先选择一条投标内容！',
								buttons : Ext.Msg.OK,
								icon : Ext.MessageBox.INFO
							});
					return false;

				} else {
					return true;
				}
			});

	tbClarificateGrid.on('afterdelete', function() {
				if (curDeletedClarificateTbdocId) {
					deleteClarificateTbdocAttachment();
				}
			});

	var viewport = new Ext.Viewport({
				layout : 'fit',
				items : [tbClarificateGrid]
			});

});

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
		tbClarificateDs.reload();
}

function deleteClarificateTbdocAttachment() {
	var bizTypes = new Array();
	bizTypes.push(tbNeedClaBusinessType, tbClaBusinessType,
			tbClaOtherBusinessType);
	PCBidDWR.deleteZbAttachment(bizTypes, curDeletedClarificateTbdocId,
			function(retVal) {
				curDeletedClarificateTbdocId = null;
			});
}
