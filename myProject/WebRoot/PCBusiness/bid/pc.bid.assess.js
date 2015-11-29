/**
 * 评标
 */
var bidAssessGrid;
var bidAssessDs;
var bidAssessBeanName = "com.sgepit.pcmis.bid.hbm.PcBidJudgeBidding";
var plantInt;
var bidContentId = null; //招标内容主键
//投标文件
var bidFileBusinessType = "PCBidFile";
//澄清内容
var bidClarifyContent = "PCBidClarifyContent";
//评标报告
var bidAssessReport = "PCBidAssessReport";
//其它资料
var bidAssessOther = "PCBidAssessOther";
var tbUnitStore, tbUnitCombo;
var curDeletedBidAssessId;
var disableBtn = ModuleLVL != '1';
var doExchange = DEPLOY_UNITTYPE != '0';
// 招标类型array
var bidApplySelectBar;
// 招标内容array
var zbContentStore;
var zbContentCombo;
var progressType = 'BidAssess';
var progressInitialized = false;
var downloadColStr = disableBtn ? '查看' : '上传';
var gridTbUnitWin;
var	smTbUnit;
var gridTbUnit;
var tbUidsArray=new Array();
var judgeResultArr=new Array();
			// 移交资料室
var transBtn = new Ext.Toolbar.Button({
			id : 'transfer',
			text : '移交文件',
			handler : onItemClick,
			icon : CONTEXT_PATH
					+ "/jsp/res/images/icons/book_go.png",
			cls : "x-btn-text-icon"
		});
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

	//评标结果
	appMgm.getCodeValue("评标结果",function(list){
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i].propertyCode);	
			temp.push(list[i].propertyName);		
			judgeResultArr.push(temp);			
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
	judgeResultStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : judgeResultArr

			});

	judgeResultCombo = new Ext.form.ComboBox({
				triggerAction : 'all',
				mode : 'local',
				lazyRender : false,
				lazyInit : false,
				store : judgeResultStore,
				valueField : 'k',
				displayField : 'v',
				editable : false,
				listWidth:180,
				width:180,
				readOnly:true,
				name : 'judgeResult'
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
				width:180,
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
				editable : false,
				allowBlank : false,
				listWidth:400,
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
							header : '投标单位',
							dataIndex : 'tbUnit',
							width : 180,
							editor : tbUnitCombo,
							renderer : Ext.util.Format
									.comboRenderer(tbUnitCombo)
						}, {
							id : 'clarifyContent',
							header : '澄清内容',
							dataIndex : 'uids',
							align : 'center',
							width : 50,
							renderer : function(value, metadata, record,
									rowIndex, colIndex, store) {
								var downloadStr="";
								var count=0;
								DWREngine.setAsync(false);
						        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+record.data.uids+"' and transaction_type='"+bidClarifyContent+"'", function (jsonData) {
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
										+ bidClarifyContent
										+ '\', '
										+ !disableBtn
										+ ', \''
										+ record.data.uids
										+ '\', \'澄清内容\',\''+bidAssessBeanName+'\' )">'
										+ downloadStr + '</a>'
							}
						},{
							id : 'judgeResult',
							header : '评标结果',
							align : 'center',
							dataIndex : 'judgeResult',
							width : 100,
							editor : judgeResultArr.length>0?judgeResultCombo:new Ext.form.TextField({
										name : 'judgeResult'
									}),
							renderer : function(value, metadata, record,
									rowIndex, colIndex, store) {
										if(judgeResultArr.length>0){
											for(var i=0;i<judgeResultArr.length;i++){
												if(value==judgeResultArr[i][0]){
													return judgeResultArr[i][1];
												}
											}
										}
										return value;
									}
						}/*, {
							id : 'assessReport',
							header : '评标报告',
							dataIndex : 'uids',
							width : 50,
							align : 'center',
							renderer : function(value, metadata, record,
									rowIndex, colIndex, store) {
								return '<a href="javascript:parent.showUploadWin(\''
										+ bidAssessReport
										+ '\', '
										+ !disableBtn
										+ ', \''
										+ record.data.uids
										+ '\', \'评标报告\',\''+bidAssessBeanName+'\' )">'
										+ downloadColStr + '</a>'
							}
						}*/, {
							id : 'otherData',
							header : '其它资料',
							dataIndex : 'uids',
							width : 50,
							align : 'center',
							renderer : function(value, metadata, record,
									rowIndex, colIndex, store) {
								var downloadStr="";
								var count=0;
								DWREngine.setAsync(false);
						        db2Json.selectData("select count(file_lsh) as num from sgcc_attach_list where transaction_id='"+record.data.uids+"' and transaction_type='"+bidAssessOther+"'", function (jsonData) {
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
										+ bidAssessOther
										+ '\', '
										+ !disableBtn
										+ ', \''
										+ record.data.uids
										+ '\', \'其它资料\',\''+bidAssessBeanName+'\' )">'
										+ downloadStr + '</a>'
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
				name : 'judgeResult',
				type : 'string'
			}, {
				name : 'memo',
				type : 'string'
			}, {
				name : 'tbUnit',
				type : 'string'
			}]

	bidAssessDs = new Ext.data.Store({
		baseParams : {
			ac : 'list', // 表示取列表
			bean : bidAssessBeanName,
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
	bidAssessDs.on('beforeload', function(store, options) {
				store.baseParams.params = 'contentUids' + SPLITB + bidContentId;
			});
			
	bidApplySelectBar = new Ext.Toolbar({
				items : ['招标项目: ', zbApplyCombo, ' ', '招标内容: ', zbContentCombo]

			});

	if (bidContentId != '')
		bidAssessDs.load();

	plantInt = {
		uids : '',
		pid : currentPid,
		contentUids : bidContentId,
		tbUnit : '',
		judgeResult : '',
		memo : ''
	};
	
	var gridLabel = new Ext.form.Label({
				html : '<b>评标及评标结果公示</b>',
				cls : 'gridTitle'
			});

	bidAssessGrid = new Ext.grid.EditorGridTbarPanel({
				region : 'center',
				ds : bidAssessDs, // 数据源
				cm : cm, // 列模型
				sm : sm,
				tbar : [gridLabel, '-',transBtn,""], // 顶部工具栏，可选
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
						curDeletedBidAssessId = sm.getSelected().data.uids;
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
					store : bidAssessDs,
					displayInfo : true,
					displayMsg : ' {0} - {1} / {2}',
					emptyMsg : "无记录。"
				}),
				plant : Ext.data.Record.create(Columns),
				plantInt : plantInt,
				servletUrl : MAIN_SERVLET,
				bean : bidAssessBeanName,
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
					},
					afteredit : function(e){
						if(e.field == 'tbUnit'){ 	
					    	var record = e.record;
					    	var realOld = e.originalValue;
					    	var realNew = e.value;
					    	var flag = false;
					    	var ds = bidAssessDs;
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

	bidAssessGrid.on('beforeinsert', function() {
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

	bidAssessGrid.on('afterdelete', function() {
				if (curDeletedBidAssessId) {
					deleteBidAssessAttachment();
				}
			});
			
	formPanel.setTitle('评标及评标结果公示-工作进度信息');
	var mainPanel = new Ext.Panel({
				layout : 'border',
				tbar : bidApplySelectBar,
				items : [formPanel, bidAssessGrid]
			});

	var viewport = new Ext.Viewport({
				layout : 'fit',
				items : [mainPanel]
			});
			
	//数据加载
	loadProgressForm();
	reloadBidDetail(bidContentId);
	
	if(bidAssessGrid.getTopToolbar().items.get('del'))		
		bidAssessGrid.getTopToolbar().items.get('del').disable();
	
	sm.on('rowselect', function(sm, idx, r) {
		if(bidAssessGrid.getTopToolbar().items.get('del'))	
			bidAssessGrid.getTopToolbar().items.get('del').enable();				
	});
	sm.on('rowdeselect', function(sm, idx, r) {
		if(bidAssessGrid.getTopToolbar().items.get('del'))
			bidAssessGrid.getTopToolbar().items.get('del').disable();				
	});			
			
	pageInit();

});
	
/*设置评标报告与其他附件的查看上传状态*/
	function getFjValue(){
		var uids = formPanel.getForm().findField('uids').getValue();
		var fjtbean="com.sgepit.pcmis.bid.hbm.PcBidProgress";
		if ( uids == null || uids == '' ){
			return;
		}		  
		parent.showUploadWin(progressBusinessType, !disableBtn, uids, '招标进度附件',fjtbean);
		parent.fileWin.on("close",function(){
			refreshTitle(uids);
		});		
	}
	function getArValue(){
		var uids = formPanel.getForm().findField('uids').getValue();
		var fjtbean="com.sgepit.pcmis.bid.hbm.PcBidProgress";
		if ( uids == null || uids == '' ){
			return;
		}		
		parent.showUploadWin(bidAssessReport, !disableBtn, uids, '评标报告',fjtbean);
		parent.fileWin.on("close",function(){
			refreshTitle(uids);
		});
	}
//保存选择的单位值
function saveTbUnit(){
	tbUidsArray=new Array();
	var records=smTbUnit.getSelections();
	if(records&&records.length>0){
		for(var i=0;i<records.length;i++){
			var record=records[i];
			tbUidsArray.push(record.get("uids"));
		}	
		var uidsAfterInsert=new Array();
		DWREngine.setAsync(false);
		PCBidDWR.savePcBidJudgeBiddingByTbUnits(currentPid,bidContentId,tbUidsArray,function(uidsArr){
		    if(uidsArr&&uidsArr.length>0){
		    	uidsAfterInsert=uidsArr;
		    	Ext.example.msg("提示", "保存成功!");
		    }
		});
		if (!doExchange) {
		}else{
			var updArr = new Array();
			//参数说明:业务bean，业务id数据，是否立即发送，发送单位，接收单位
			PCBidDWR.excDataZbForSave(bidAssessBeanName,updArr,uidsAfterInsert,false, currentPid, defaultOrgRootID,function(flag){	
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
		bidAssessGrid.getStore().load();	
		
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
								tbUnitType:'PcBidJudgeBidding'
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
				title : '选择投标单位',
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


//选择招标项目后加载招标内容方法	
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
	var Fj="上传";
	var ar="上传";
	if (bidContentId == null || bidContentId == '') {
		formPanel.getForm().reset();
		formPanel.setTitle('评标及评标结果公示-工作进度信息');
	if(disableBtn==false){
		Ext.get(fjt.getEl()).update("其他附件：&nbsp;&nbsp;&nbsp;"+"<u style='color:blue;cursor:hand;' onclick='getFjValue()'>"+Fj+"</u>");			
    	Ext.get(assessReport.getEl()).update("评标报告：&nbsp;&nbsp;&nbsp;"+"<u style='color:blue;cursor:hand;' href='javascript:void' onclick='getArValue()'>"+ar+"</u>");	
		}else{
		Ext.get(fjt.getEl()).update("其他附件:&nbsp;&nbsp;&nbsp;<a style='color:gray;underline:none'>无</a>");
		Ext.get(assessReport.getEl()).update("评标报告：&nbsp;&nbsp;&nbsp;<a style='color:gray;underline:none'>无</a>");	
		}
	return;		
	}
	DWREngine.setAsync(false);
	PCBidDWR.getCurrentPhaseProgress(bidContentId, progressType, function(retVal) {
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
/*				formPanel.setTitle('【' + curZbContentName
						+ '】评标及评标结果公示-工作进度信息');*/
			});
	var curZbContentName = zbContentCombo.getRawValue();
	DWREngine.setAsync(true);
	/*根据类型与uids去文件表中查询*/
	if(formPanel.getForm().findField('uids')){
		var uids=formPanel.getForm().findField('uids').getValue();
		formPanel.setTitle('【' + curZbContentName
		+ '】评标及评标结果公示-工作进度信息'+"     "+"<a style='cursor:hand;text-decoration:underline' onclick='clickByFormText(\""+ uids+ "\")'>"+"移交文件"+"</a>");
		
		var uids = formPanel.getForm().findField('uids').getValue();	
  		 if(uids){   	
			refreshTitle(uids);   	
   			 }
    	}
}
//其他附件与评标报告的显示与隐藏
function refreshTitle(uids){
		var Fj="上传[0]";
		var title1="上传",title2="上传";
		var ar="上传[0]";	
		DWREngine.setAsync(false);
        db2Json.selectData("select count(FILE_LSH) as count from SGCC_ATTACH_LIST where transaction_Type='PCBidProgress' and transaction_Id='"+uids+"'", function (jsonData) {
	    var list= eval(jsonData);
	    if(list!=null&&list[0].count>0){
	   		Fj="查看["+list[0].count+"]";
	   		title1="查看";
	     }  
	    else{
	    	Fj="上传["+list[0].count+"]";
	    	title1="上传";
	    }
	      	 });
        db2Json.selectData("select count(FILE_LSH) as count from SGCC_ATTACH_LIST where transaction_Type='PCBidAssessReport' and transaction_Id='"+uids+"'", function (jsonData) {
	    var list = eval(jsonData);
	    if(list!=null&&list[0].count>0){
	   		ar="查看["+list[0].count+"]";
	   		title2="查看";
	     }  
	    else{
	    	ar="上传["+list[0].count+"]";
	    	title2="上传";
	    }
	      	 });	      	 
	    DWREngine.setAsync(true);   
    if(disableBtn==false){
		Ext.get(fjt.getEl()).update("其他附件：&nbsp;&nbsp;&nbsp;"+"<u style='color:blue;cursor:hand;' onclick='getFjValue()'>"+Fj+"</u>");			
    	Ext.get(assessReport.getEl()).update("评标报告：&nbsp;&nbsp;&nbsp;"+"<u style='color:blue;cursor:hand;' href='javascript:void' onclick='getArValue()'>"+ar+"</u>");	
	}
	else if(disableBtn==true){
		if(title1=="查看"){
			Ext.get(fjt.getEl()).update("其他附件：&nbsp;&nbsp;&nbsp;"+"<u style='color:blue;cursor:hand;' onclick='getFjValue()'>"+Fj+"</u>");			
		}
		else{
			Ext.get(fjt.getEl()).update("其他附件:&nbsp;&nbsp;&nbsp;<a style='color:gray;underline:none'>无</a>");					
		}
		if(title2=="查看"){
			Ext.get(assessReport.getEl()).update("评标报告：&nbsp;&nbsp;&nbsp;"+"<u style='color:blue;cursor:hand;' href='javascript:void' onclick='getArValue()'>"+ar+"</u>");	
		}else{
			Ext.get(assessReport.getEl()).update("评标报告：&nbsp;&nbsp;&nbsp;<a style='color:gray;underline:none'>无</a>");	
			
		}
	}	
	
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
		bidAssessDs.reload();
}

function deleteBidAssessAttachment() {
	var bizTypes = new Array();
	bizTypes.push(bidFileBusinessType, bidClarifyContent,bidAssessReport,bidAssessOther);
	PCBidDWR.deleteZbAttachment(bizTypes, curDeletedBidAssessId, function(
					retVal) {
				curDeletedBidAssessId = null;
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
		bidAssessDs.load();
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
			var selRecords = bidAssessGrid.getSelectionModel().getSelections();
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
							+ "/PCBusiness/bid/com.fileTrans.jsp?type=PcBidJudgeBidding&fileId="
							+ filePk,
					null,
					"dialogWidth:1000px;dialogHeight:500px;center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	if (rtn) {
	}
}
