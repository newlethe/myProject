var bean = "com.sgepit.pmis.planMgm.hbm.FundMonthPlanM"
var bean2 = "com.sgepit.pmis.planMgm.hbm.FundMonthPlanD"
var business = "baseMgm"
var listMethod = "findWhereOrderby"
var primaryKey = "uids"
var orderColumn="sjType";
var gridPanel = null;
var treeStore;
var reportId="";
var selectSjType="";
var selectedConidStr="";
var partBs = new Array();
var treeSm,treeGrid,treeColumns;
var initBtn;
Ext.onReady(function() {
	DWREngine.setAsync(false);
	baseMgm.getData("select CPID,PARTYB from CON_PARTYB", function(list) {
		for(i = 0; i < list.length; i++) {
			var temp = new Array();
			temp.push(list[i][0]);			
			temp.push(list[i][1]);
			partBs.push(temp);			
		}
	});
	DWREngine.setAsync(true);
	var dsPartB = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : partBs
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				header : '',
				singleSelect : true
			})
	var currentDate=SYS_DATE_DATE;//系统服务器的当前时间
	currentDate.setMonth(currentDate.getMonth()+1);//当前月份加1
	var currentYear=currentDate.getFullYear();
	var currentMonth = currentDate.getMonth();
	//最大日期调整为本月的下月
	var endMonth = currentYear+""+(currentMonth+101+"").substring(1);
	var array_yearMonth = getYearMonthBySjType(null, endMonth);

	var dsCombo_yearMonth = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : [['', '']]
			});
	dsCombo_yearMonth.loadData(array_yearMonth);
	var yearMonthCombo = new Ext.form.ComboBox({
				typeAhead : true,
				triggerAction : 'all',
				mode : 'local',
				lazyRender : true,
				store : dsCombo_yearMonth,
				valueField : 'k',
				displayField : 'v',
				emptyText : "请选择",
				editable : false,
				maxHeight : 107,
				allowBlank : false,
				hiddenValue : true,
				listeners : {
					'expand' : function() {
						pcTzglService.sjTypeFilter(CURRENTAPPID, bean,
								function(arr) {
									if (arr.length > 0) {
										dsCombo_yearMonth
												.filterBy(sjTypeFilter);
										function sjTypeFilter(record, id) {
											for (var i = 0; i < arr.length; i++) {
												if (record.get("k") == arr[i])
													return false;
											}
											return true;
										}
									}
								});
					}
				}
			});
	var cm = new Ext.grid.ColumnModel([ // 创建列模型
	sm, {
				id : 'uids',
				type : 'string',
				header : "主键",
				dataIndex : 'uids',
				hidden : true
			}, {
				id : 'pid',
				type : 'string',
				header : "项目编码",
				dataIndex : 'pid',
				hidden : true
			}, {
				id : 'sjType',
				type : 'string',
				header : "月度",
				width : 60,
				dataIndex : "sjType",
				align : 'center',
				editor : yearMonthCombo,
				renderer : function(k) {
					for (var i = 0; i < array_yearMonth.length; i++) {
						if (k == array_yearMonth[i][0]) {
							return array_yearMonth[i][1];
						}
					}
				}
			}, {
				id : 'reportName',
				type : 'string',
				header : "报表名称",
				width : 240,
				align : 'center',
				dataIndex : 'reportName'
			},  {
				id : 'createperson',
				type : 'string',
				header : "填制人",
				width : 100,
				dataIndex : 'createperson',
				align : 'center',
				editor : new Ext.form.TextField({name : 'createperson', allowBlank : true})
			},{
				id : 'createDate',
				type : 'date',
				header : "填制日期",
				width : 80,
				align : 'center',
				dataIndex : 'createDate',
				editor : new Ext.form.DateField({name : 'createDate',format : 'Y-m-d', allowBlank : true}),
				renderer : function(v) {
					if (v)
						return v.format('Y-m-d')
				}
			},  {
				id : 'isInit',
				type : 'string',
				header : "是否初始化",
				width : 100,
				hidden:true,
				hideable: false,
				dataIndex : 'isInit',
				align : 'center'
			}

	]);
	cm.defaultSortable = true; // 设置是否可排序

	// 3. 定义记录集
	var Columns = [{
				name : 'uids',
				type : 'string'
			}, {
				name : 'pid',
				type : 'string'
			}, {
				name : 'sjType',
				type : 'string'
			}, {
				name : 'reportName',
				type : 'string'
			}, {
				name : 'remark',
				type : 'string'
			}, {
				name : 'userId',
				type : 'string'
			}, {
				name : 'createperson',
				type : 'string'
			}, {
				name : 'isInit',
				type : 'string'
			}, {
				name : 'createDate',
				type : 'date',
				dateFormat : 'Y-m-d H:i:s'
			}];
	/**
	 * 创建数据源
	 */
	var ds = new Ext.data.Store({
				baseParams : {
					ac : 'list',
					bean : bean,
					business : business,
					method : listMethod,
					params : "pid='" + CURRENTAPPID + "'"
				},
				proxy : new Ext.data.HttpProxy({
							method : 'GET',
							url : MAIN_SERVLET
						}),
				reader : new Ext.data.JsonReader({
							root : 'topics',
							totalProperty : 'totalCount',
							id : 'uids'
						}, Columns),
				remoteSort : true,
				pruneModifiedRecords : true
			});
	ds.setDefaultSort(orderColumn, 'desc'); // 设置默认排序列
	ds.on('load', function(t, rs) {
		if (t.getTotalCount() > 0) {
			sm.selectFirstRow();
		}else{
			treeStore.removeAll();
		}
	})
	
	var Plant = Ext.data.Record.create(Columns);

	var PlantInt = {
		uids : '',
		pid : CURRENTAPPID,
		sjType : '',
		reportName : '',
		remark : '',
		userId : USERID,
		createDate : new Date(),
		isInit : '0',
		createperson : REALNAME
	}

	gridPanel = new Ext.grid.EditorGridTbarPanel({
		store : ds,
		cm : cm,
		sm : sm,
		tbar : ['<font color=#15428b><b>&nbsp;月度资金计划</b></font>','-'],
		border : false,
		layout : 'fit',
		region : 'center',
		addBtn : !dataView, // 是否显示新增按钮
		saveBtn : !dataView, // 是否显示保存按钮
		delBtn : !dataView, // 是否显示删除按钮
		header : false,
		collapsible : false, // 是否可折叠
		animCollapse : false, // 折叠时显示动画
		autoExpandColumn : 2, // 列宽度自动扩展，可以用列名，也可以用序号（从1开始）
		stripeRows : true,
		trackMouseOver : true,
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		bbar : new Ext.PagingToolbar({// 在底部工具栏上添加分页导航
			pageSize : PAGE_SIZE,
			store : ds,
			displayInfo : true,
			displayMsg : ' {0} - {1} / {2}',
			emptyMsg : "无记录。"
		}),
		insertHandler : function() {
			gridPanel.defaultInsertHandler();
			if (gridPanel.getTopToolbar().items.get('save'))
				gridPanel.getTopToolbar().items.get('save').enable();
		},
		deleteHandler : function() {
			var sm = gridPanel.getSelectionModel();
			var ds = gridPanel.getStore();
			if (sm.getCount() > 0) {
				Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,
								text) {
							if (btn == "yes") {
								var records = sm.getSelections()
								var codes = []
								for (var i = 0; i < records.length; i++) {
									var m = records[i]
											.get(gridPanel.primaryKey)
									if (m == "" || records[i].isNew) { // 主键值为空的记录、未保存的新增记录不计入
										continue;
									}
									codes[codes.length] = m
								}
								var mrc = codes.length
								if (mrc > 0) {
									var ids = codes.join(",");
									gridPanel.doDelete(mrc, ids)
								} else {
									ds.reload();
								}
							}
						}, gridPanel);
			}
		},
		listeners : {
			'render' : function(grid) {
					if (grid.getTopToolbar().items.get('save'))
						grid.getTopToolbar().items.get('save').disable();
			},
			'afterdelete' : function(grid, ids) {
				var hql = "delete from " + bean2 + " where reportId='" + ids
						+ "'";
				baseDao.executeHQL(hql);
			},
			'beforeedit' : function(e) {
				if(ModuleLVL==3||dataView){
					return false;
				}
			},
			'afteredit' : function(o) {
				if (gridPanel.getTopToolbar().items.get('save'))
					gridPanel.getTopToolbar().items.get('save').enable();
				if (o.field === "sjType") {
					var display_value = "";
					for (var i = 0; i < array_yearMonth.length; i++) {
						if (o.value == array_yearMonth[i][0]) {
							display_value = array_yearMonth[i][1];
						}
					}
					o.record.set("reportName", CURRENTAPPNAME+display_value
									+ "资金计划");
				}
			}
		},
		plant : Plant,
		plantInt : PlantInt,
		servletUrl : MAIN_SERVLET,
		bean : bean,
		business : business,
		primaryKey : primaryKey
	});

	sm.on('rowselect', function() {
		var record = sm.getSelected();
		reportId=record.get("uids");
		selectSjType=record.get("sjType");
		var isInit=record.get('isInit');
		if(isInit=='1'){
			initBtn.setDisabled(true);
		}else{
			initBtn.setDisabled(false);
		}
		treeStore.load();
	})
	
	/***********************月度资金计划明细 start**********************************/
	var selectConBtn = new Ext.Button({
    	id: 'selectCon',
    	text:'选择合同',
    	iconCls : 'btn',
    	handler: showConWin
    })
    var editBtn = new Ext.Button({
    	id: 'editbtn',
    	text:'修改',
    	iconCls : 'btn',
    	handler: showFormWin
    })
    var deleteBtn = new Ext.Button({
    	id: 'deletebtn',
    	text:'删除',
    	iconCls : 'remove',
    	handler: deleteFundMonthDPlanFun
    })
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
        initBtn = new Ext.Button({
        	id:'init',
        	text:'初始化',
        	cls : 'x-btn-text-icon',
        	icon:'jsp/res/images/icons/brick.png',
        	handler:init
        });
	var tbarArr1 = ['<font color=#15428b><b>&nbsp;月度资金计划明细</b></font>', 
						 '-',{
                            iconCls : 'icon-expand-all',
                            tooltip : '全部展开',
                            handler : function() {
                            	expandAllTreeNode();
//                               treeStore.expandAllNode();
                            }
                        },
						'-',
						{
                           iconCls : 'icon-collapse-all',
                            tooltip : '全部收起',
                            handler : function() {
                            	collapseAllTreeNode();
//                                treeStore.collapseAllNode();
                            }
                        },
						 '-',selectConBtn,'-',editBtn,'-', deleteBtn,'-',exportExcelBtn,'-',initBtn,
						 '->',"计量单位： 万元" ];
	var tbarArr2 = ['<font color=#15428b><b>&nbsp;月度资金计划明细</b></font>', 
						 '-',{
                            iconCls : 'icon-expand-all',
                            tooltip : '全部展开',
                            handler : function() {
                            	expandAllTreeNode();
//                               treeStore.expandAllNode();
                            }
                        },
						'-',
						{
                           iconCls : 'icon-collapse-all',
                            tooltip : '全部收起',
                            handler : function() {
                            	collapseAllTreeNode();
//                                treeStore.collapseAllNode();
                            }
                        },'-','->',"计量单位： 万元" ];
	treeColumns = [{
			id : 'contypename',
			header : "合同类型/名称",
			width : 240,
			renderer :function(value, metadata, record, rowIndex,
                        columnIndex, store) {
                var qtip = "qtip=" + value;
  				return'<span ' + qtip + '>' + value + '</span>';
			},
			dataIndex : 'contypename'
		}, {
			id : 'parent',
			header : '父节点',
			hidden : true,
			dataIndex : 'parent'
		}, {
			id : 'uids',
			header : '主键',
			hidden : true,
			dataIndex : 'uids'
		}, {
			id : 'reportId',
			header : '报表主键',
			hidden : true,
			dataIndex : 'reportId'
		}, {
			id : 'conid',
			header : '合同主键',
			hidden : true,
			dataIndex : 'conid'
		},{
			id : 'conno',
			header : "合同编号",
			width : 120,
			sortable : true,
			renderer :function(value, metadata, record, rowIndex,
                        columnIndex, store) {
                var qtip = "qtip=" + value;
  				return'<span ' + qtip + '>' + value + '</span>';
			},
			dataIndex : 'conno'
		},{
			id : 'partybno',
			header : "乙方单位",
			width : 280,
			renderer :function(value, metadata, record, rowIndex,
                        columnIndex, store) {
                var str="";
                for (var i = 0; i < partBs.length; i++) {
					if (partBs[i][0] == value) {
						str = partBs[i][1]
						break;
					}
				}
                var qtip = "qtip=" + str;
  				return'<span ' + qtip + '>' + str + '</span>';
			},
			dataIndex : 'partybno'
		},{
			id : 'batch',
			header : "批次",
			width : 100,
			hidden:true,
			dataIndex : 'batch'
		},  {
			id : 'convaluemoney',
			header : '合同总金额',
			width : 85,
			dataIndex : 'convaluemoney',
			align : 'right',
			renderer: function(value){
//				if(value!=0){
//					value=(value/10000).toFixed(2);
//	    			return "<div id='convaluemoney' align='right'>"+cnMoneyToPrec(value,2)+"</div>";
//				} else {
	    			return value;
//				}
   			}
		}, {
			id : 'conpay',
			header : '已付款金额',
			align : 'right',
			width : 95,
			dataIndex : 'conpay',
			renderer: function(value){
//				if(value!=0){
//					value=(value/10000).toFixed(2);
//	    			return "<div id='conpay'>"+cnMoneyToPrec(value,2)+"</div>";
//				} else {
	    			return value;
//				}
   		 	}
		}, {
			id : 'predictPayment1',
			header : '预计本月支付',
			align : 'right',
			width : 105,
			dataIndex : 'predictPayment1',
			renderer: function(value){
//				if(value!=0){
//					value=(value/10000).toFixed(2);
//					return "<div id='predictPayment1'>"+cnMoneyToPrec(value,2)+"</div>";
//				}
//    			else
    			return value;
   		 	}
		}, {
			id : 'predictPayment2',
			header : '预计下月支付',
			align : 'right',
			width : 95,
			dataIndex : 'predictPayment2',
			renderer: function(value){
//				if(value!=0){
//					value=(value/10000).toFixed(2);
//					return "<div id='predictPayment2'>"+cnMoneyToPrec(value,2)+"</div>";
//				}
//    			else
    			return value;
   		 	}
		}, {
			id : 'predictPayment3',
			header : '<div align="center">预计隔月支付</div>',
			align : 'right',
			width : 90,
			dataIndex : 'predictPayment3',
			renderer: function(value){
//				if(value!=0){
//					value=(value/10000).toFixed(2);
//					return "<div id='predictPayment3' align='right'>"+cnMoneyToPrec(value,2)+"</div>";
//				}
//    			else 
    			return value;
   		 	}
		}, {
			id : 'remark',
			header : '备注',
//			align : 'right',
			width : 200,
			dataIndex : 'remark'
		},{
			id : 'condivno',
			header : '合同分类',
			hidden : true,
			dataIndex : 'condivno'
		}];
	
	treeStore = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
		autoLoad : true,
		leaf_field_name : 'isleaf',// 是否叶子节点字段
		parent_id_field_name : 'parent',// 树节点关联父节点字段
		url : MAIN_SERVLET,
		baseParams : {
			ac : 'list',
			method : 'buildConReportTreeGrid',// 后台java代码的业务逻辑方法定义
			business : 'fundMonthPlanService',// spring 管理的bean定义
			bean : 'com.sgepit.pmis.planMgm.hbm.ConReportBean',// gridtree展示的bean
			params : 'pid' + SPLITB +  CURRENTAPPID + SPLITB// 查询条件
		},
		reader : new Ext.data.JsonReader({
			id : 'conid',
			root : 'topics',
			totalProperty : 'totalCount',
			fields : ["conid", "contypename", "conno", "partybno",
					'batch', 'convaluemoney', 'conpay', 'predictPayment1',
					'predictPayment2', 'predictPayment3','remark', 'reportId',
					'uids',"parent","condivno", "isleaf"]
		}),
		listeners : {
			'beforeload' : function(ds, options) {
				var parent = null;
				if (options.params[ds.paramNames.active_node] == null) {
					options.params[ds.paramNames.active_node] = '0';
					parent = "0"; // 此处设置第一次加载时的parent参数
				} else {
					parent = options.params[ds.paramNames.active_node];
				}
				ds.baseParams.params = 'pid' + SPLITB + CURRENTAPPID + ";parent" + SPLITB + parent+ ";reportId" + SPLITB + reportId;// 此处设置除第一次加载外的加载参数设置
			}
		}
	});
	treeStore.on("load", function(ds1, recs) {
        if(selectedPath && selectedPath!="") {
            treeStore.expandPath(selectedPath, "conid");
            treeGrid.getView().getRow(0).style.display='none';
        } else {
            if (ds1.getCount() > 0) {
                var rec1 = ds1.getAt(0);
                treeSm.selectFirstRow();
                if (!ds1.isExpandedNode(rec1)) {
                    ds1.expandNode(rec1);
                }
                treeGrid.getView().getRow(0).style.display='none';
            }else{
            	formPanel.getForm().reset();
            }
        }
    });
        
   treeStore.on('expandnode', function(ds, rc) {
        if (selectedPath && selectedPath != "") {
            var conidArr = selectedPath.split("/");
            if (rc.get("conid") == conidArr.pop()) {
                treeGrid.getSelectionModel().selectRow(ds.indexOf(rc));
                selectedPath="";
            }
        }
    });
   treeSm = new Ext.grid.CheckboxSelectionModel({
				header : '',
				singleSelect : true
			})
	treeGrid = new Ext.ux.maximgb.treegrid.GridPanel({
		id : 'pccon-tree-panel',
		iconCls : 'icon-by-category',
		store : treeStore,
		master_column_id : 'contypename',// 定义设置哪一个数据项为展开定义
		autoScroll : true,
		tbar:dataView?tbarArr2:tbarArr1,
		height : document.body.clientHeight * 0.6,
		region : 'south',
		sm:treeSm,
		frame : false,
		collapsible : false,
		animCollapse : false,
		border : true,
		columns : treeColumns,
		stripeRows : true
	});
	treeSm.on('rowselect',function(){
		var selectRecord=treeSm.getSelected();
		var conType=selectRecord.get("conid")
		if(conType=="FW"||conType=="CL"||conType=="QT"||conType=="SG"||conType=="SB"||conType=="ALL"){
			deleteBtn.setDisabled(true);
			editBtn.setDisabled(true);
		}else{
			deleteBtn.setDisabled(false);
			editBtn.setDisabled(false);
		}
	})
	/***********************月度资金计划明细 end**********************************/
	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [gridPanel,treeGrid]
			});
	ds.load({
							params : {
								start : 0,
								limit : PAGE_SIZE
							}
						});
	if(ModuleLVL==3){
		if (gridPanel.getTopToolbar().items.get('add'))
			gridPanel.getTopToolbar().items.get('add').disable();
		if (gridPanel.getTopToolbar().items.get('save'))
			gridPanel.getTopToolbar().items.get('save').disable();
		if (gridPanel.getTopToolbar().items.get('del'))
			gridPanel.getTopToolbar().items.get('del').disable();
	}

});
function showConWin(){
	if(gridPanel.getSelectionModel().getSelected()){
		selectedConidStr="";
		DWREngine.setAsync(false);
		fundMonthPlanService.getSelectedConidStr(reportId, function(dat) {
			if(dat){
				selectedConidStr=dat;
			}
		})
		DWREngine.setAsync(true);
		showConove();
	}else{
		Ext.example.msg('提示', '请选择一条主记录数据！');
	}
}
function deleteFundMonthDPlanFun(){
	var selectRecord=treeSm.getSelected();
	if(selectRecord){
		Ext.MessageBox.confirm('确认', '删除操作将不可恢复，确认要删除吗？', function(btn,
				text) {
			if (btn == "yes") {
				var uids=selectRecord.get('uids')
				DWREngine.setAsync(false);
				fundMonthPlanService.deleteFundMonthDPlanById(uids, function(dat) {
					if(dat){
						treeStore.load();
					}
				})
				DWREngine.setAsync(true);
			}
		});
	}else{
		Ext.example.msg('提示', '请选择一条数据！');
	}
}
function exportDataFile(){
	if(gridPanel.getSelectionModel().getSelected()){
		var openUrl = CONTEXT_PATH + "/servlet/InvestmentPlanServlet?ac=exportFundData&reportId=" + reportId + "&businessType=FundMonthPlanD&unitId=" + USERDEPTID + "&sjType=" + selectSjType;
		document.all.formAc.action =openUrl
		document.all.formAc.submit();
	}else{
		Ext.example.msg('提示', '请选择一条主记录数据！');
	}
}
function expandAllTreeNode(){
	for(var i=0;i<treeStore.getCount();i++){
		var rec1 = treeStore.getAt(i);
        if (!treeStore.isExpandedNode(rec1)) {
            treeStore.expandNode(rec1);
        }
	}
}
function collapseAllTreeNode(){
	for(var i=0;i<treeStore.getCount();i++){
		var rec1 = treeStore.getAt(i);
		if (rec1.get("conid") != "01") {
           if (treeStore.isExpandedNode(rec1)) {
             treeStore.collapseNode(rec1);
           }
        }
        
	}
}
//初始化
function init(){
	var record = gridPanel.getSelectionModel().getSelected()
	if(record){
	Ext.MessageBox.confirm("提示","初始化数据需要一些时间，您确定要初始化吗",function(btn){
		if(btn == 'yes'){
			var preMonth=getPreNMonth(selectSjType,1);
			var MID = '';
			var sql = "select t.uids from FUND_MONTH_PLAN_M t where t.SJ_TYPE = '"+preMonth+"'";
			DWREngine.setAsync(false);
			baseMgm.getData(sql,function(list){
				if(list.length>0){
					MID = list[0];
				}
			});
			var sql1 = "select t.CONDIVNO,t.CONID,t.PREDICT_PAYMENT1,t.PREDICT_PAYMENT2,t.PREDICT_PAYMENT3,t.REMARK,t.CONNO,t.PARTYBNO,t.CONVALUEMONEY,t.CONPAY from FUND_MONTH_PLAN_D t where t.REPORT_ID = '"+MID+"'";
			var obj;
			baseMgm.getData(sql1,function(list){
				for(var i=0;i<list.length;i++){
					obj = {
						reportId:reportId,
						condivno:list[i][0],
						conid:list[i][1],
						predictPayment1:list[i][3],
						predictPayment2:list[i][4],
						predictPayment3:0,
						remark:list[i][5],
						conno:list[i][6],
						partybno:list[i][7],
						convaluemoney:list[i][8],
						conpay:list[i][9]
					}
					fundMonthPlanService.initFunMonthPlan(obj,function(str){
						if(str == '1'){
							Ext.MessageBox.alert("提示","初始化成功");
						}else{
							Ext.MessageBox.alert("提示","初始化失败");
						}
					});
				}
			});
		    var sql = "update FUND_MONTH_PLAN_M set IS_INIT='1' where uids='"+reportId+"'";
		    baseDao.updateBySQL(sql,function(str){
		    	initBtn.setDisabled(true)
		    	record.set('isInit','1');
		    })
			DWREngine.setAsync(true);
			treeStore.load();
		}
	});
	}else{
		Ext.example.msg('提示', '请选择一条主记录数据！');
	}
}