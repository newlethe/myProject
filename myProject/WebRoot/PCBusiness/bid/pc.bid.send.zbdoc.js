/**
 * 发售招标文件      pc.bid.send.zbdoc.js
 */
var sendZbdocGrid;
var sendZbdocDs;
var sendZbdocBeanName = "com.sgepit.pcmis.bid.hbm.PcBidSendZbdoc";
var plantInt;
var bidContentId = null;
var bidSendOtherBusinessType = "PCBidZbdocther";
var bidBookBusinessType = "PCBidBook";
var tbUnitStore, tbUnitCombo;
var curDeletedSendZbdocId;
var disableBtn = ModuleLVL != '1';
var doExchange = DEPLOY_UNITTYPE != '0';
// 招标类型array
var bidApplySelectBar;
// 招标内容array
var zbContentArr = new Array();
var zbContentStore;
var zbContentCombo;
var progressType = 'TbSendZbDoc';
var progressInitialized = false;
var gridTbUnitWin;
var	smTbUnit;
var gridTbUnit;
var tbUidsArray=new Array();
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
				listWidth:400,
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
				listWidth:400,
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

	tbUnitStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : []

			});
	loadTbUnitCombo();
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
							id : 'tbUnit',
							header : '购买单位',
							dataIndex : 'tbUnit',
							width : 180,
							editor : tbUnitCombo,
							renderer : Ext.util.Format
									.comboRenderer(tbUnitCombo)
						}, {
							id : 'bidBook',
							header : '招标书',
							dataIndex : 'uids',
							align : 'center',
							width : 40,
							renderer : function(value, metadata, record,
									rowIndex, colIndex, store) {
								return '<a href="javascript:parent.showUploadWin(\''
										+ bidBookBusinessType
										+ '\', '
										+ !disableBtn
										+ ', \''
										+ record.data.uids
										+ '\', \'招标书\' )">'
										+ downloadColStr + '</a>'
							},
							hidden : true
						}, {
							id : 'otherData',
							header : '其它资料',
							dataIndex : 'uids',
							align : 'center',
							width : 40,
							renderer : function(value, metadata, record,
									rowIndex, colIndex, store) {
								return '<a href="javascript:parent.showUploadWin(\''
										+ bidSendOtherBusinessType
										+ '\', '
										+ !disableBtn
										+ ', \''
										+ record.data.uids
										+ '\', \'其它资料\' )">'
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
			}]

	sendZbdocDs = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : sendZbdocBeanName,
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
		
	sendZbdocDs.on('beforeload', function(store, options) {
				store.baseParams.params = 'contentUids' + SPLITB + bidContentId;
			});
	bidApplySelectBar = new Ext.Toolbar({

				items : ['招标项目: ', zbApplyCombo, ' ', '招标内容: ', zbContentCombo]

			});

	if (bidContentId != '')
		sendZbdocDs.load();

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
		memo : ''
	};
	
	var gridLabel = new Ext.form.Label({
				html : '<b>发售招标文件</b>',
				cls : 'gridTitle'
			});

	sendZbdocGrid = new Ext.grid.EditorGridTbarPanel({
				region : 'center',
				ds : sendZbdocDs, // 数据源
				cm : cm, // 列模型
				sm : sm,
				tbar : [gridLabel, '-'], // 顶部工具栏，可选
				//title : "发售招标文件", // 面板标题
				iconCls : 'icon-by-category', // 面板样式
				border : false, // 
				region : 'center',
				clicksToEdit : 1, // 单元格单击进入编辑状态,1单击，2双击
				//header : true, //
				autoScroll : true, // 自动出现滚动条
				deleteHandler : function() {
					var selSm = this.getSelectionModel();
					if (selSm.getCount() > 0) {
						curDeletedAgencyId = sm.getSelected().data.uids;
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
					store : sendZbdocDs,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				plant : Ext.data.Record.create(Columns),
				plantInt : plantInt,
				servletUrl : MAIN_SERVLET,
				bean : sendZbdocBeanName,
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
					    	var ds = sendZbdocDs;
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

	sendZbdocGrid.on('beforeinsert', function() {
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
			
	formPanel.setTitle('发售招标文件-工作进度信息');
	var mainPanel = new Ext.Panel({
				layout : 'border',
				tbar : bidApplySelectBar,
				items : [formPanel, sendZbdocGrid]
			});

	var viewport = new Ext.Viewport({
				layout : 'fit',
				items : [mainPanel]
			});
			
	//formPanel和ds加载数据
	loadProgressForm();
	reloadBidDetail(bidContentId);
	
	if(sendZbdocGrid.getTopToolbar().items.get('del'))		
		sendZbdocGrid.getTopToolbar().items.get('del').disable();
	
	sm.on('rowselect', function(sm, idx, r) {
		if(sendZbdocGrid.getTopToolbar().items.get('del'))		
			sendZbdocGrid.getTopToolbar().items.get('del').enable();				
	});
	sm.on('rowdeselect', function(sm, idx, r) {
		if(sendZbdocGrid.getTopToolbar().items.get('del'))		
			sendZbdocGrid.getTopToolbar().items.get('del').disable();				
	});		
	
	pageInit();
});

//保存选择的单位值
function saveTbUnit(){
	var rateStatus=0;
	tbUidsArray=new Array();
	var records=smTbUnit.getSelections();
	if(records&&records.length>0){
		for(var i=0;i<records.length;i++){
			var record=records[i];
			tbUidsArray.push(record.get("uids"));
			//向列表中添加一条数据	
		}	
		var uidsAfterInsert=new Array();
		DWREngine.setAsync(false);
		PCBidDWR.savePcBidSendZbdocByTbUnits(currentPid,bidContentId,rateStatus,tbUidsArray,function(uidsArr){
		    if(uidsArr&&uidsArr.length>0){
		    	uidsAfterInsert=uidsArr;
		    	Ext.example.msg("提示", "保存成功!");
		    }
		});
		if (!doExchange) {
		}else{
			var updArr = new Array();
			//参数说明:业务bean，业务id数据，是否立即发送，发送单位，接收单位
			PCBidDWR.excDataZbForSave(sendZbdocBeanName,updArr,uidsAfterInsert,false, currentPid, defaultOrgRootID,function(flag){
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
		sendZbdocGrid.getStore().load();
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
								tbUnitType:'PcBidSendZbdoc'
							})
				});		
			smTbUnit = new Ext.grid.CheckboxSelectionModel({
			
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
				title : '选择购买单位',
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
		formPanel.setTitle('发售招标文件-工作进度信息');
		return;
	}
	//这里一定会获取一个progress的对象, 要么是已经存在, 要么是后台新构造并插入数据库的内容
	DWREngine.setAsync(false);
		PCBidDWR.getCurrentPhaseProgress(bidContentId, progressType, function(retVal) {
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
					var curProgress = new BidProgress(retVal);
					progressInitialized = true;					
					formPanel.getForm().reset();
					formPanel.getForm().loadRecord(curProgress);
					var curZbContentName = zbContentCombo.getRawValue();
   					var uids=formPanel.getForm().findField('uids').getValue();
					formPanel.setTitle('【' + curZbContentName
					+ '】发售招标文件-工作进度信息'+"     "+"<a style='cursor:hand;text-decoration:underline' onclick='clickByFormText(\""+ uids+ "\")'>"+"移交文件"+"</a>");								
				});
	DWREngine.setAsync(true);	
	var uids = formPanel.getForm().findField('uids').getValue();	
	 if(uids){   	
		refreshTitle(uids);   	
		 }	
}
//其他附件与评标报告的显示与隐藏
function refreshTitle(uids){
		var Fj="上传[0]";
		var title="上传";	
		DWREngine.setAsync(false);
        db2Json.selectData("select count(FILE_LSH) as count from SGCC_ATTACH_LIST where transaction_Type='PcBidProgress' and transaction_Id='"+uids+"'", function (jsonData) {
	    var list= eval(jsonData);
	    if(list!=null&&list[0].count>0){
	   		Fj="查看["+list[0].count+"]";
	   		title="查看";
	     }  
	    else{
	    	Fj="上传["+list[0].count+"]";
	    	title="上传";
	    }
	      	 });      	 
	    DWREngine.setAsync(true);   
    if(disableBtn==false){
		Ext.get(PcBidSendZbdoc.getEl()).update("招标文件：&nbsp;&nbsp;&nbsp;"+"<u style='color:blue;cursor:hand;' onclick='getFjValue()'>"+Fj+"</u>");			
    	}
	else if(disableBtn==true){
		if(title=="查看"){
			Ext.get(PcBidSendZbdoc.getEl()).update("招标文件：&nbsp;&nbsp;&nbsp;"+"<u style='color:blue;cursor:hand;' onclick='getFjValue()'>"+Fj+"</u>");			
		}
		else{
			Ext.get(PcBidSendZbdoc.getEl()).update("招标文件:&nbsp;&nbsp;&nbsp;<a style='color:gray;underline:none'>无</a>");					
		}
	}	
	
}
/*设置评标报告与其他附件的查看上传状态*/
function getFjValue(){
	var uids = formPanel.getForm().findField('uids').getValue();
	var fjtbean="com.sgepit.pcmis.bid.hbm.PcBidProgress";
	if ( uids == null || uids == '' ){
		return;
	}		  
	parent.showUploadWin("PcBidProgress", !disableBtn, uids, '招标进度附件',fjtbean);
	parent.fileWin.on("close",function(){
		refreshTitle(uids);
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
//	if (contentId != null && contentId != '')
	sendZbdocDs.reload();
}

function deleteSendZbdocAttachment() {
	var bizTypes = new Array();
	bizTypes.push(bidSendOtherBusinessType, bidBookBusinessType);
	PCBidDWR.deleteZbAttachment(bizTypes, curDeletedSendZbdocId, function(
					retVal) {
				curDeletedSendZbdocId = null;
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