var rockTree, zbContentGrid;
var contentBeanName = 'com.sgepit.pcmis.bid.hbm.PcBidZbContent';
var menuTreePanel;
var currentPrjObj;
var contentDs; // 从表ds
var currentZbUids; // 当前选中的主表
var zbApplyCombo;
var zbApplyStore;
// 招标类型array
var bidTypeArr = new Array();
var bidTypeStroe;
var zbTypeLabel;
var bidApplySelectBar;

Ext.onReady(function() {

	// 招标项目下拉框
	var zbApplyArr = new Array();

	DWREngine.setAsync(false);
	baseDao.findByWhere2('com.sgepit.pcmis.zhxx.hbm.PcZhxxPrjInfo', "pid = '"
					+ currentPid + "'", function(retVal) {
				if (retVal.length > 0) {
					currentPrjObj = retVal[0];
				}

			});
	PCBidDWR.getBidApplyForCurrentPrj(null,currentPid, function(list) {
				for (var i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].uids);
					temp.push(list[i].zbName);
					temp.push(list[i].zbType)
					zbApplyArr.push(temp);
				}
			});

	appMgm.getCodeValue('招标类型', function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i].propertyCode);
					temp.push(list[i].propertyName);
					bidTypeArr.push(temp);
				}
			});
	DWREngine.setAsync(true);
	zbApplyStore = new Ext.data.SimpleStore({
				fields : ['k', 'v', 't'],
				data : zbApplyArr
			});

	// 招标类型store
	bidTypeStroe = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : bidTypeArr
			});

	zbApplyCombo = new Ext.form.ComboBox({
				triggerAction : 'all',
				emptyText : '请选择招标项目',
				mode : 'local',
				lazyRender : true,
				store : zbApplyStore,
				valueField : 'k',
				displayField : 'v',
				editable : false,
				name : 'zbApplyId'
			});

	zbApplyCombo.on('select', function(combo, record, index) {
		zbApplyComboSelect(record);
			});
	function zbApplyComboSelect(record) {
		currentZbUids = record.data.k;
		reloadBidContent();
		var bidTypeStr = record.data.t;

		var index = bidTypeStroe.find('k', record.data.t);
		if (index > -1) {
			bidTypeStr = bidTypeStroe.getAt(index).get('v');
		}

		Ext.get(zbTypeLabel.getEl()).update(bidTypeStr);

	}

	// //////功能菜单//////////////////////
	zbContentGrid = createZbContentGrid();
	menuTreePanel = new Ext.tree.TreePanel({
		region : 'west',
		width : 200,
		xtype : 'treepanel',
		rootVisible : false,
		loader : new Ext.tree.TreeLoader(),
		root : new Ext.tree.AsyncTreeNode({
			id : 'bid-procedure',
			text : '详细过程',
			leaf : false,
			children : [{
						text : '投标人报名信息及预审结果',
						href : "PCBusiness/bid/pc.bid.applicant.jsp?pid="
								+ currentPid,
						hrefTarget : "bidDetailFrame",
						leaf : true
					}, {
						text : '发售招标文件',
						href : "PCBusiness/bid/pc.bid.send.zbdoc.jsp?pid="
								+ currentPid,
						hrefTarget : "bidDetailFrame",
						leaf : true
					}, {
						text : '招标文件澄清',
						href : "PCBusiness/bid/pc.bid.clarificate.zbdoc.jsp?pid="
								+ currentPid,
						hrefTarget : "bidDetailFrame",
						leaf : true
					}, {
						text : '组建评标委员会',
						href : "PCBusiness/bid/pc.bid.assess.council.jsp?pid="
								+ currentPid,
						hrefTarget : "bidDetailFrame",
						leaf : true
					}, {
						text : '接受招标文件及投标保证金',
						href : "PCBusiness/bid/pc.bid.accept.tbdoc.jsp?pid="
								+ currentPid,
						hrefTarget : "bidDetailFrame",
						leaf : true
					}, {
						text : '开标',
						href : "PCBusiness/bid/pc.bid.open.bidding.jsp?pid="
								+ currentPid,
						hrefTarget : "bidDetailFrame",
						leaf : true
					}, {
						text : '投标文件澄清',
						href : "PCBusiness/bid/pc.bid.clarificate.tbdoc.jsp?pid="
								+ currentPid,
						hrefTarget : "bidDetailFrame",
						leaf : true
					}, {
						text : '发放中标通知书',
						href : "PCBusiness/bid/pc.bid.issue.win.doc.jsp?pid="
								+ currentPid,
						hrefTarget : "bidDetailFrame",
						leaf : true
					}, {
						text : '合同签订情况跟踪',
						href : "PCBusiness/bid/pc.bid.contract.track.jsp?pid="
								+ currentPid,
						hrefTarget : "bidDetailFrame",
						leaf : true
					}]
		})
	});

	menuTreePanel.on('beforeclick', function(node, e) {
				var curContentRecord = zbContentGrid.getSelectionModel()
						.getSelected();
				if (curContentRecord) {
					e.stopEvent();
					var bidContentId = curContentRecord.data.uids;
					var url = CONTEXT_PATH + '/' + node.attributes.href
							+ '&bidContentId=' + bidContentId;
					var target = node.attributes.hrefTarget;
					window.frames[target].location.href = url;
				}

			});

	var viewport = new Ext.Viewport({
		layout : 'border',
		items : [zbContentGrid, {
			title : '详细过程',
			region : 'south',
			layout : 'border',
			height : 300,
			items : [menuTreePanel, {
				region : 'center',
				html : '<iframe name="bidDetailFrame" src="" frameborder=0 style="width:100%;height:100%;"></iframe>'
			}]
		}]
	});
	if (zbApplyArr.length > 0) {
		zbApplyCombo.setValue(zbApplyArr[0][0]);
		var record = zbApplyStore.getAt(0);
		zbApplyComboSelect(record);
	}

	// 招标内容
	function createZbContentGrid() {
		var smContent = new Ext.grid.CheckboxSelectionModel({
					singleSelect : true,
					header : ''
				});
		smContent.on('rowselect', function(sm, idx, r) {

			var currentNode = menuTreePanel.getSelectionModel()
					.getSelectedNode();
			if (currentNode) {
				if (document.getElementById('bidDetailFrame').contentWindow.reloadBidDetail) {

					document.getElementById('bidDetailFrame').contentWindow
							.reloadBidDetail(r.data.uids);
				}

			}

		});

		var columns = [{
					id : 'uids',
					header : 'uids',
					dataIndex : 'uids',
					width : 100,
					hidden : true
				},

				{
					id : 'pid',
					header : '项目编号',
					width : 100,
					dataIndex : 'pid',
					hidden : true
				}, {
					id : 'zbUids',
					header : '招标申请主键',
					dataIndex : 'zbUids',
					width : 100,
					hidden : true
				}, {
					id : 'contentes',
					header : '投标内容',
					dataIndex : 'contentes',
					width : 100
					// ,
				// editor : new Ext.form.TextField({
				// name : 'contentes',
				// allowBlank : false
				// })

			}	, {
					id : 'startDate',
					header : '开始时间',
					dataIndex : 'startDate',
					align : 'center',
					width : 100,
					renderer : Ext.util.Format.dateRenderer('Y-m-d'), // Ext内置日期renderer
					type : 'date'// ,
					// editor : new Ext.form.DateField({
					// name : 'startDate',
					// readOnly:true,
					// format : 'Y-m-d'
					// })
				}, {
					id : 'endDate',
					header : '结束时间',
					dataIndex : 'endDate',
					align : 'center',
					width : 100,
					renderer : Ext.util.Format.dateRenderer('Y-m-d'), // Ext内置日期renderer
					type : 'date'// ,
					// editor : new Ext.form.DateField({
					// name : 'endDate',
					// readOnly:true,
					// format : 'Y-m-d'
					// })
				}, {
					id : 'rateStatus',
					header : '工作进度',
					dataIndex : 'rateStatus',
					width : 100// ,
					// editor : new Ext.form.NumberField({
					// name : 'rateStatus'
					// })
					,
					align : 'right',
					renderer : function(value) {
						return (value * 100).toFixed() + "%";
					}

				}, {
					id : 'respondDept',
					header : '负责部门',
					align : 'center',
					width : 100,
					dataIndex : 'respondDept'// ,
					// editor : new Ext.form.TextField({
					// name : 'respondDept'
					// })
				}, {
					id : 'respondUser',
					header : '负责人',
					align : 'center',
					width : 100,
					dataIndex : 'respondUser'// ,
					// editor : new Ext.form.TextField({
					// name : 'respondUser'
					// })
				},

				{
					id : 'applyAmount',
					header : '申请金额',
					dataIndex : 'applyAmount',
					width : 100,
					align : 'right',
					renderer : cnMoneyToPrec
				}, {
					id : 'memo',
					header : '备注',
					dataIndex : 'memo',
					width : 100
					// ,
				// editor : new Ext.form.TextField({
				// name : 'memo'
				// })
			}

		];

		var Columns = [{
					name : 'uids',
					type : 'string'
				}, {
					name : 'pid',
					type : 'string'
				}, {
					name : 'zbUids',
					type : 'string'
				}, {
					name : 'contentes',
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
					name : 'applyAmount',
					type : 'float'
				}

		]
		contentDs = new Ext.data.Store({
			baseParams : {
				ac : 'list', // 表示取列表
				bean : contentBeanName,
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
		contentDs.on('beforeload', function(store, options) {
					store.baseParams.params = 'zbUids' + SPLITB + currentZbUids;
				});

		var contentPlantInt = {
			uids : '',
			pid : currentPid,
			zbUids : '',
			contentes : '',
			startDate : new Date(),
			endDate : null,
			rateStatus : 0,
			respondDept : '',
			respondUser : '',
			memo : '',
			applyAmount : 0
		};

		// 招标类型标签
		zbTypeLabel = new Ext.form.Label({
					text : '',
					autoWidth : false,
					width : 50

				});
		// 第二行工具栏
		bidApplySelectBar = new Ext.Toolbar({
					items : ['项目名称: ' + currentPrjObj.prjName, '-',
							'&nbsp;招标项目名称: ', zbApplyCombo, '-', '招标类型: ',
							zbTypeLabel, '-']

				});

		var tmpGrid = new Ext.grid.EditorGridTbarPanel({
					region : 'center',
					sm : smContent,
					ds : contentDs, // 数据源,
					saveBtn : false,
					addBtn : false,
					delBtn : false,
					columns : columns, // 列模型
					height : 200,
					tbar : bidApplySelectBar, // 顶部工具栏，可选
					iconCls : 'icon-by-category', // 面板样式
					border : false, // 
					clicksToEdit : 2, // 单元格单击进入编辑状态,1单击，2双击
					autoScroll : true, // 自动出现滚动条
					collapsible : false, // 是否可折叠
					animCollapse : false, // 折叠时显示动画
					loadMask : true, // 加载时是否显示进度
					viewConfig : {
						forceFit : true,
						ignoreAdd : true
					},
					bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
						pageSize : PAGE_SIZE,
						store : contentDs,
						displayInfo : true,
						displayMsg : ' {0} - {1} / {2}',
						emptyMsg : "无记录。"
					}),
					plant : Ext.data.Record.create(Columns),
					plantInt : contentPlantInt,
					servletUrl : MAIN_SERVLET,
					bean : contentBeanName,
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
								PCBidDWR.exchangeSavedZbData(bean, allArr,
										false);
							}

						},
						afterdelete : function(grid, ids, primaryKey, bean) {
							if (!doExchange) {
								return;
							}
							var delArr = ids.split(',');
							if (delArr.length > 0) {
								PCBidDWR.exchangeDeletedZbData(bean, delArr,
										false);
							}

						}
					}
				});
		return tmpGrid;
	}

});

function reloadBidContent() {

	contentDs.reload();
	if (document.getElementById('bidDetailFrame').contentWindow.reloadBidDetail) {

		document.getElementById('bidDetailFrame').contentWindow
				.reloadBidDetail('');
	}
}

function prjRenderer(value) {
	var retVal = currentPrjObj[this.id];
	switch (this.id) {
		case 'industryType' : {

			var index = industryTypeStore.find('k', retVal);
			if (index > -1) {
				return industryTypeStore.getAt(index).get('v');
			} else {
				return retVal;
			}
			break;
		}
		case 'prjType' : {

			var index = prjTypeStore.find('k', retVal);
			if (index > -1) {
				return prjTypeStore.getAt(index).get('v');
			} else {
				return retVal;
			}
			break;
		}

		default : {
			return retVal;
		}
	}

}

function showUploadWin(businessType, editable, businessId, winTitle) {

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
			+ businessId;
	var fileWin = new Ext.Window({
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
}

/**
 * 显示合同详细信息窗口（合同跟踪中使用）
 * 
 * @param {}
 *            conid
 */
function showContractWindow(conid) {
	var url = BASE_PATH
			+ 'Business/contract/cont.generalInfo.view.jsp?windowMode=1&conid='
			+ conid;
	var contractWin = new Ext.Window({
		header : false,
		layout : 'fit',
		width : 900,
		height : 400,
		title : "合同详细信息",
		// constrain: true,
		modal : false,
		maximizable : true,
		// minimizable: true,
		closeAction : 'hide',
		plain : true,
		items : [{
			html : '<iframe name="contractDetailFrame" src="'
					+ url
					+ '" frameborder=0 style="width:100%;height:100%;"></iframe>'
		}]
	});

	contractWin.show();
}
