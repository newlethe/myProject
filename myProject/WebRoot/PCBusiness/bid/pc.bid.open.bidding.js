/**
 * 开标
 */
var openBidGrid;
var openBidDs;
var openBidBeanName = "com.sgepit.pcmis.bid.hbm.PcBidOpenBidding";
var plantInt;
var bidContentId = null; //招标内容主键
var bidFileBusinessType = "PCBidFile";
var openBidOhterBusinessType = "PCBidOpenBidOther";
var tbUnitStore, tbUnitCombo;
var curDeletedOpenBidId;
var disableBtn = ModuleLVL != '1';
var doExchange = DEPLOY_UNITTYPE != '0';
// 招标类型array
var bidApplySelectBar;
// 招标内容array
var zbContentArr = new Array();
var zbContentStore;
var zbContentCombo;
var progressType = 'OpenBidding';
var progressInitialized = false;
var gridTbUnitWin;
var	smTbUnit;
var gridTbUnit;
var tbUidsArray=new Array();
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
				listWidth:600,
				editable : false,
				allowBlank : false,
				name : 'tbUnit'
			});

	var sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : false,
				header : ''
			});

	var cm = new Ext.grid.ColumnModel({
				columns : [new Ext.grid.RowNumberer(), sm,{
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
				header : '参加开标单位',
				dataIndex : 'tbUnit',
				width : 180,
				editor : tbUnitCombo,
				renderer : Ext.util.Format.comboRenderer(tbUnitCombo)
			}, {
				id : 'offer',
				header : '单位报价(元)',
				dataIndex : 'offer',
				width : 60,
				align : 'right',
				editor : new Ext.form.NumberField({
							name : 'offer'
						}),
				renderer:function(value){
					return cnMoneyToPrec(value,2);
				}

			}, {
				id : 'otherData',
				header : '其它资料',
				dataIndex : 'uids',
				align : 'center',
				width : 60,
				renderer : function(value, metadata, record, rowIndex,
						colIndex, store) {
					var downloadStr="";
					var count=0;
					DWREngine.setAsync(false);
			        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+record.data.uids+"' and transaction_type='"+openBidOhterBusinessType+"'", function (jsonData) {
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
							+ openBidOhterBusinessType + '\', ' + !disableBtn
							+ ', \'' + record.data.uids + '\', \'其它资料\',\''+openBidBeanName+'\' )">'
							+ downloadStr + '</a>'
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
				width : 60,
				align : 'center',
				dataIndex : 'respondUser',
				editor : new Ext.form.TextField({
							name : 'respondUser'
						}),
				hidden : true

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
				name : 'offer',
				type : 'float'
			}]

	openBidDs = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : openBidBeanName,
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
	openBidDs.on('beforeload', function(store, options) {
				store.baseParams.params = 'contentUids' + SPLITB + bidContentId;
			});
			
	bidApplySelectBar = new Ext.Toolbar({

				items : ['招标项目: ', zbApplyCombo, ' ', '招标内容: ', zbContentCombo]

			});

	if (bidContentId != '')
		openBidDs.load();

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
		offer : 0,
		memo : ''
	};
	
	var gridLabel = new Ext.form.Label({
				html : '<b>开标</b>',
				cls : 'gridTitle'
			});

	openBidGrid = new Ext.grid.EditorGridTbarPanel({
				region : 'center',
				ds : openBidDs, // 数据源
				cm : cm, // 列模型
				sm : sm,
				tbar :[exportExcelBtn,'-',gridLabel, '-',transBtn,"-"], // 顶部工具栏，可选
				//title : "开标", // 面板标题
				iconCls : 'icon-by-category', // 面板样式
				border : false, // 
				region : 'center',
				clicksToEdit : 1, // 单元格单击进入编辑状态,1单击，2双击
				//header : true, //
				autoScroll : true, // 自动出现滚动条
				deleteHandler : function() {
					var selSm = this.getSelectionModel();
					if (selSm.getCount() > 0) {
						curDeletedOpenBidId = sm.getSelected().data.uids;
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
					store : openBidDs,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				plant : Ext.data.Record.create(Columns),
				plantInt : plantInt,
				servletUrl : MAIN_SERVLET,
				bean : openBidBeanName,
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
					    	var ds = openBidDs;
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

	openBidGrid.on('beforeinsert', function() {
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
					selectTbUnit();//弹出窗口
					return false;
				}
			});

	openBidGrid.on('afterdelete', function() {
				if (curDeletedOpenBidId) {
					deleteOpenBidAttachment();
				}
			});

	formPanel.setTitle('开标-工作进度信息');
	var mainPanel = new Ext.Panel({
				layout : 'border',
				tbar : bidApplySelectBar,
				items : [formPanel, openBidGrid]
			});

	var viewport = new Ext.Viewport({
				layout : 'fit',
				items : [mainPanel]
			});
	//加载数据
	loadProgressForm();
	reloadBidDetail(bidContentId);
	
	if(openBidGrid.getTopToolbar().items.get('del'))		
		openBidGrid.getTopToolbar().items.get('del').disable();
	
	sm.on('rowselect', function(sm, idx, r) {
		if(openBidGrid.getTopToolbar().items.get('del'))		
			openBidGrid.getTopToolbar().items.get('del').enable();				
	});
	sm.on('rowdeselect', function(sm, idx, r) {
		if(openBidGrid.getTopToolbar().items.get('del'))		
			openBidGrid.getTopToolbar().items.get('del').disable();				
	});		
			
	pageInit();
});
//保存选择的单位值
function saveTbUnit(){
	var rateStatus=0;
	var offer=0;
	tbUidsArray=new Array();
	var records=smTbUnit.getSelections();
	if(records&&records.length>0){
		for(var i=0;i<records.length;i++){
			var record=records[i];
			tbUidsArray.push(record.get("uids"));	
		}	
		var uidsAfterInsert=new Array();
		DWREngine.setAsync(false);
		PCBidDWR.savePcBidOpenBiddingByTbUnits(currentPid,bidContentId,rateStatus,offer,tbUidsArray,function(uidsArr){
		    if(uidsArr&&uidsArr.length>0){
		    	uidsAfterInsert=uidsArr;
		    	Ext.example.msg("提示", "保存成功!");
		    }
		});
		if (!doExchange) {
		}else{
			var updArr = new Array();
			//参数说明:业务bean，业务id数据，是否立即发送，发送单位，接收单位
			PCBidDWR.excDataZbForSave(openBidBeanName,updArr,uidsAfterInsert,false, currentPid, defaultOrgRootID,function(flag){	
			})				
		}
		DWREngine.setAsync(true);
		//清空全选框表头
		if( gridTbUnit.getEl()){
			var hd_checker = gridTbUnit.getEl().select('div.x-grid3-hd-checker'); 
			var hd = hd_checker.first();        
		if(hd.hasClass('x-grid3-hd-checker-on')){   
      		hd.removeClass('x-grid3-hd-checker-on'); //x-grid3-hd-checker-on   
      		gridTbUnit.getSelectionModel().clearSelections();   
	 	 } 			
		}			
		gridTbUnitWin.hide();
		openBidGrid.getStore().load();	
		
	}

}

function cancelTbUnit(){
	smTbUnit.clearSelections();
	//清空全选框表头
	if( gridTbUnit.getEl()){
		var hd_checker = gridTbUnit.getEl().select('div.x-grid3-hd-checker'); 
		var hd = hd_checker.first();        
	if(hd.hasClass('x-grid3-hd-checker-on')){   
  		hd.removeClass('x-grid3-hd-checker-on'); //x-grid3-hd-checker-on   
  		gridTbUnit.getSelectionModel().clearSelections();   
 	 } 			
	}		
}
		var saveTbUnit = new Ext.Toolbar.Button({
					id : 'saveTbUnit',
					iconCls : 'save',
					text : "确定",      
					handler : saveTbUnit
				});	
		var cancelTbUnit = new Ext.Toolbar.Button({
			id : 'cancelTbUnit',
			iconCls : 'remove',
			text : "取消",      
			handler : cancelTbUnit
		});	
			var toolbarItems = ['->',saveTbUnit, '-', cancelTbUnit];		
		
		var dataGridRsTbUnit = Ext.data.Record.create([{
				name : 'uids',
				type : 'string'
			}, {
				name : 'tbUnit',
				type : 'string'
			}]);
					
		var dataGridDsReaderTbUnit = new Ext.data.JsonReader({
				id : "uids",
				root : 'topics',
				totalProperty : 'totalCount'
			}, dataGridRsTbUnit)				
		var dsResultTbUnit = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : CONTEXT_PATH
										+ '/servlet/PcBidServlet'
							}),
					reader : dataGridDsReaderTbUnit
				});	
		dsResultTbUnit.on("beforeload", function(ds1) {
					Ext.apply(ds1.baseParams, {
								ac : 'getUnselectTbUnit',
								orderby : "tbUnit",
								bidContentId:bidContentId,
								tbUnitType:'PcBidOpenBidding'
							})
				});	
		smTbUnit = new Ext.grid.CheckboxSelectionModel({
			
					});				
		smTbUnit.on('rowselect', function(sm) { // grid 行选择事件
			var records= sm.getSelections();
			
			
		});					
		var columnModelTbUnit = new Ext.grid.ColumnModel([smTbUnit, 
				 {
					header : '单位编号',
					dataIndex : 'uids',
					align : 'center',
					hidden:true,
					width : 15
				},  
				{
					header : '单位名称',
					dataIndex : 'tbUnit',
					align : 'center',
					width : 350

				}]);		
		var pageToolbarTbUnit = new Ext.PagingToolbar({
					pageSize : PAGE_SIZE,
					beforePageText : "第",
					afterPageText : "页, 共{0}页",
					store : dsResultTbUnit,
					displayInfo : true,
					firstText : '第一页',
					prevText : '前一页',
					nextText : '后一页',
					lastText : '最后一页',
					refreshText : '刷新',
					displayMsg : '显示第 {0} 条到 {1} 条记录，共 {2} 条记录',
					emptyMsg : "无记录。"
				});		
//选择单位窗口
function selectTbUnit(){
		
			// 创建Grid
			gridTbUnit = new Ext.grid.GridPanel({
						id : 'file-grid',
						ds : dsResultTbUnit,
						cm : columnModelTbUnit,
						sm : smTbUnit,
						region : 'center',
						layout : 'anchor',
						autoScroll : true, // 自动出现滚动条
						collapsible : false, // 是否可折叠
						animCollapse : false, // 折叠时显示动画
						loadMask : true, // 加载时是否显示进度
						stripeRows : true,
						viewConfig : {
							//forceFit : true
						},
						bbar : pageToolbarTbUnit,
						tbar : new Ext.Toolbar({
									items : toolbarItems
								})
					});		
			dsResultTbUnit.load({
						params : {
							start : 0,
							limit : PAGE_SIZE
						}
					});					
	if(!gridTbUnitWin){
	gridTbUnitWin = new Ext.Window({
				title : '选择参加开标单位',
				width : 400,
				height : 400,
				minWidth : 300,
				minHeight : 200,
				layout : 'fit',
				plain : true,
				closeAction : 'hide',
				modal : true,
				items:[gridTbUnit]
			});			
	}
		//清空全选框表头
		if( gridTbUnit.getEl()){
			var hd_checker = gridTbUnit.getEl().select('div.x-grid3-hd-checker'); 
			var hd = hd_checker.first();        
		if(hd.hasClass('x-grid3-hd-checker-on')){   
      		hd.removeClass('x-grid3-hd-checker-on'); //x-grid3-hd-checker-on   
      		gridTbUnit.getSelectionModel().clearSelections();   
	 	 } 			
		}		
		gridTbUnitWin.show();	
	
}
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
		formPanel.setTitle('开标-工作进度信息');
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
				+ '】开标-工作进度信息'+"     "+"<a style='cursor:hand;text-decoration:underline' onclick='clickByFormText(\""+ uids+ "\")'>"+"移交文件"+"</a>");							
			});
	DWREngine.setAsync(true);
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
//	if (contentId != null && contentId != '')
		openBidDs.reload();
}

function deleteOpenBidAttachment() {
	var bizTypes = new Array();
	bizTypes.push(bidFileBusinessType, openBidOhterBusinessType);
	PCBidDWR.deleteZbAttachment(bizTypes, curDeletedOpenBidId,
			function(retVal) {
				curDeletedOpenBidId = null;
			});
}

   //数据导出
	function exportDataFile() {
		var openUrl = CONTEXT_PATH    
				+ "/servlet/PcBidServlet?businessType=openBiddingDataList&ac=exportOpenBiddingData&content_uids="+bidContentId;	
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
		openBidDs.load();
	});
}
function onItemClick(item) {
	switch (item.id) {	
		case 'transfer' :
			var selRecords = openBidGrid.getSelectionModel().getSelections();
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
							+ "/PCBusiness/bid/com.fileTrans.jsp?type=PcBidOpenBidding&fileId="
							+ filePk,
					null,
					"dialogWidth:1000px;dialogHeight:500px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	if (rtn) {
	}
}