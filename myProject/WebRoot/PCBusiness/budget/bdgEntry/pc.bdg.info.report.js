var treePanel, treeLoader, contentPanel;
var treePanelTitle = CURRENTAPPNAME + "&nbsp;-&nbsp;概算动态台帐";
var rootText = "所有概算单";
var date = new Date();
var bdgWin;// 概算分摊情况查看
var bdgGrid;// 详情列表
var store;
var showMDType = window.dialogArguments;
var currentPid = CURRENTAPPID;
Ext.onReady(function() {
// parent.lt.expand();
	if (showMDType == "概算动态管理台账") {
	} else {
		if(parent.proTreeCombo){
			parent.proTreeCombo.show();
			parent.proTreeCombo.setValue(CURRENTAPPID);
			if(parent.backToSubSystemBtn){
				parent.backToSubSystemBtn.show();
			}
			
			if(parent.pathButton){
				parent.pathButton.setText("<b>当前位置:" + parent.selectedSubSystemName
				+ "/概算动态台帐</b>");					
			}
		
		}
	}
	var yearStr = date.getFullYear();
	var arrayMonth=new Array();	
	var a = "0";
	var monStr = (date.getMonth()+1).toString();
	for(var i=monStr;i>=1;i--){
		var temp=new Array();
		if(i.length<2){
			temp.push("0".concat(i)+"月");
			temp.push("0".concat(i));			
		}else{
			temp.push(i+"月");
			temp.push(i);
		}

		arrayMonth.push(temp);
	}	
	if (monStr.length < 2) {
		monStr = a.concat(monStr);
	}
	var currentDate = yearStr.toString().concat(monStr)

	var arrayYear = arrayYearCreater();
	var yearStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : arrayYear
			})
	var monthStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data :[['', '']]
			})
			
	var fullMonth=[['12月','12'],['11月','11'],['10月','10'],['09月','09'],['08月','08'],
    ['07月','07'],['06月','06'],['05月','05'],['04月','04'],['03月','03'],['02月','02'],['01月','01']];		
	var yearCom = new Ext.form.ComboBox({
				store : yearStore,
				width : 75,
				displayField : 'k',
				valueField : 'v',
				typeAhead : true,
				value: SYS_DATE_DATE.getFullYear(),
				mode : 'local',
				triggerAction : 'all',
				emptyText : '选择年份',
				selectOnFocus : true
			})
			
//	yearCom.setValue(yearStr);
	
	yearCom.on('select', yearComselect);
	function yearComselect(){
		var curYear=yearCom.getValue();
		if(curYear==yearStr){
			monthStore.loadData(arrayMonth);
			monthCom.setValue(monStr); 
		}else{
			monthStore.loadData(fullMonth);
		}
	}
	
	monthStore.loadData(arrayMonth);	
	
	var monthCom = new Ext.form.ComboBox({
				store : monthStore,
				width : 75,
				displayField : 'k',
				valueField : 'v',
				typeAhead : true,
				mode : 'local',
				triggerAction : 'all',
				emptyText : '选择月份',
				selectOnFocus : true
			})
			
	monthCom.setValue(monStr);
	var columns = [{
				id : 'bdgname',
				header : '<div align="center">概算名称</div>',
				width : 280,
				sortable : true,
				dataIndex : 'bdgname',
				renderer : function(v) {
					return v;
				}
			}, {
				id : 'bdgid',
				header : '<div align="center">概算主键</div>',
				width : 0, // 隐藏字段
				dataIndex : 'bdgid',
				sortable : true,
				hidden : true,
				renderer : function(value) {
					return "<div id='bdgid'>" + value + "</div>";
				}
			}, {
				header : '<div align="center">概算金额</div>',
				width : 100, // 隐藏字段
				sortable : true,
				// cls : 'numberCell',
				dataIndex : 'bdgmoney',
				align : 'right',
				renderer : function(value) {
					if (value != 0) {
						value = (value / 10000).toFixed(2);
						return cnMoneyToPrec(value, 2);
					} else
						return value;
				}
			}, {
				//BUG8335新增字段 zhangh 2015-11-18
				//系统自动计算，取所有招标项分摊到概算的累计金额；
				header : '招标对应概算金额',
				width : 140, align : 'right',
				dataIndex : 'bidbdgmoney',
				renderer : function(value) {
					if (value != 0) {
						value = (value / 10000).toFixed(2);
						return cnMoneyToPrec(value, 2);
					} else
						return value;
				}
			}, {
				header : '<div align="center">已签合同金额</div>',
				// cls : 'numberCell',
				sortable : true,
				width : 120,
				dataIndex : 'contmoney',
				align : 'right',
				renderer : function(value) {
					if (value != 0) {
						value = (value / 10000).toFixed(2);
						return cnMoneyToPrec(value, 2);
					} else
						return value;
				}
			}, {
				header : '<div align="center">索赔、变更金额</div>',
				cls : 'numberCell',
				sortable : true,
				width : 140,
				dataIndex : 'changeappmoney',
				align : 'right',
				renderer : function(value) {
					if (value != 0) {
						value = (value / 10000).toFixed(2);
						return cnMoneyToPrec(value, 2);
					} 
					else
						return value;
				}
			}, {
				header : '<div align="center">合同分摊总金额</div>',
				// cls : 'numberCell',
				sortable : true,
				width : 120,
				dataIndex : 'changemoney',
				align : 'right',
				renderer : function(value) {
					if(value!=0){
						value=(value/10000).toFixed(2);
						return cnMoneyToPrec(value, 2);
					}
					else
					return value;
					
				}
			}, {
				header : '<div align="center">差值</div>',
				// cls : 'numberCell',
				sortable : true,
				width : 80,
				dataIndex : 'bdgcalconmoney',
				align : 'right',
				renderer : function(value) {
					if(value!=0){
						value=(value/10000).toFixed(2);
						return cnMoneyToPrec(value, 2);
					}
					else
					return value;			
				}
			}, {
				header : '<div align="center">本月完成投资</div>',
				// cls : 'numberCell',
				hidden:true,
				sortable : true,
				width : 80,
				dataIndex : 'monthmoney',
				align : 'right',
				renderer : function(value) {
					if(value!=0){
						value=(value/10000).toFixed(2);
						return cnMoneyToPrec(value, 2);
					}
					else
					return value;			
				}
			}, {
				header : '<div align="center">本年完成投资</div>',
				// cls : 'numberCell',
				hidden:true,
				sortable : true,
				width : 80,
				dataIndex : 'yearmoney',
				align : 'right',
				renderer : function(value) {
					if(value!=0){
						value=(value/10000).toFixed(2);
						return cnMoneyToPrec(value, 2);
					}
					else
					return value;				
				}
			}, {
				header : '<div align="center">累计完成投资</div>',
				// cls : 'numberCell',
				hidden:true,
				sortable : true,
				width : 80,
				dataIndex : 'allmoney',
				align : 'right',
				renderer : function(value) {
					if(value!=0){
						value=(value/10000).toFixed(2);
						return cnMoneyToPrec(value, 2);
					}
					else
					return value;					
				}
			}, {
				header : '<div align="center">累计完成比例</div>',
				// cls : 'numberCell',
				hidden:true,
				sortable : true,
				width : 80,
				align : 'center',
				dataIndex : 'percent'
			}, {
				header : '<div align="center">概算对应合同情况</div>',
				width : 120,
				// cls : 'centerCell',
				align : 'center',
				sortable : true,
				dataIndex : 'bdgid',
				renderer : function(value, metadata, record) {
					var output = '<span style="color: blue;">'
					output += '<a style="color: blue;cursor:hand"  onClick="look(\''
							+ value + '\');">查 询</a> </span>'
					return output;
				}
			}]

	store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
				autoLoad : true,
				leaf_field_name : 'isleaf',// 是否叶子节点字段
				parent_id_field_name : 'parent',// 树节点关联父节点字段
				url : MAIN_SERVLET,
				baseParams : {
					ac : 'list',
					method : 'buildTreeGridNodeTree',// 后台java代码的业务逻辑方法定义
					business : 'pcBdgInfoMgm',// spring 管理的bean定义
					bean : 'com.sgepit.pcmis.budget.hbm.PCBudgetProInof',// gridtree展示的bean
					params : 'pid' + SPLITB + currentPid + SPLITB// 查询条件
				},
				reader : new Ext.data.JsonReader({
							id : 'bdgid',
							root : 'topics',
							totalProperty : 'totalCount',
							fields : ['bdgname', 'bdgid', 'bdgmoney',
									'contmoney', 'changeappmoney',
									'bidbdgmoney',
									'changemoney', 'bdgcalconmoney',
									'monthmoney', 'yearmoney', 'allmoney',
									'percent', 'parent', 'isleaf']
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
						var cyear = yearCom.getValue().toString();
						var cmonth = monthCom.getValue().toString();
						var nowDate = cyear.concat(cmonth);
						ds.baseParams.params = 'pid' + SPLITB + currentPid
								+ ";parent" + SPLITB + parent + ";nowdate"
								+ SPLITB + nowDate;// 此处设置除第一次加载外的加载参数设置
					}
				}
			});

	var treeGrid = new Ext.ux.maximgb.treegrid.GridPanel({
		id : 'budget-tree-panel',
		iconCls : 'icon-by-category',
		store : store,
		master_column_id : 'bdgname',// 定义设置哪一个数据项为展开定义
		autoScroll : true,
		region : 'center',
		viewConfig : {
			forceFit : true,
			ignoreAdd : true
		},
		frame : false,
		collapsible : false,
		animCollapse : false,
		border : true,
		tbar : tbarArr,
		columns : columns,
		stripeRows : true
			// ,
			// title : '概算树动态台帐' // 设置标题
		});

	store.on("load", function(ds1, recs) {
				if (ds1.getCount() > 0) {
					var rec1 = ds1.getAt(0);
					if (!ds1.isExpandedNode(rec1)) {
						ds1.expandNode(rec1);
					}
				}
			});

	var btn = new Ext.Button({
				id : 'btn',
				text : '查询',
				handler : function() {

					store.load();
				}
			})
	var backbtn = new Ext.Button({
				id : 'backbtn',
				text : '返回子系统',
				iconCls : 'returnTo',
				handler : function() {
					window.location.href = BASE_PATH
							+ 'PCBusiness/budget/bdgEntry/pcbdg.summary.project.jsp';
				}
			})
	var tbarArr = [
		'<font color=#15428b><b>&nbsp;' + treePanelTitle + '</b></font>', 
		'-',{
				iconCls : 'icon-expand-all',
				tooltip : '全部展开',
				handler : function() {
					store.expandAllNode();
				}
			}, '-', {
				iconCls : 'icon-collapse-all',
				tooltip : '全部收起',
				handler : function() {
					store.collapseAllNode();
				}
			}, '-', "年份：", yearCom, " 月份:", monthCom, '-', btn, '->',"计量单位： 万元"];

	var contentPanel = new Ext.Panel({
				layout : 'border',
				region : 'center',
				border : false,
//				title : treePanelTitle,
				header : false,
				tbar : tbarArr,
				items : [treeGrid]
			})
	// 7. 创建viewport加入面板content
	if (Ext.isAir) { // create AIR window
		var win = new Ext.air.MainWindow({
					layout : 'border',
					items : [contentPanel],
					title : 'Simple Tasks',
					iconCls : 'icon-show-all'
				}).render();
	} else {
		var viewport = new Ext.Viewport({
					layout : 'border',
					items : [contentPanel]
				});
	}
});

bdgStore = new Ext.data.Store({
			baseParams : {
				ac : 'list',
				bean : 'com.sgepit.pcmis.budget.hbm.BdgReportBean',
				business : 'pcBdgInfoMgm',
				method : 'getBdgAppInfoByPidAndBdgId',
				params : '1=1'
			},
			proxy : new Ext.data.HttpProxy({
						url : MAIN_SERVLET,
						method : 'GET'
					}),
			reader : new Ext.data.JsonReader({
						root : 'topics',
						totalProperty : 'totalCount',
						id : 'uids'
					}, [{
								name : 'bdgname',
								type : 'string'
							}, {
								name : 'bdgmoney',
								type : 'float'
							}, {
								name : 'contmoney',
								type : 'float'
							}, {
								name : 'conname',
								type : 'string'
							}])
		})
var colModel = new Ext.grid.ColumnModel([{
			header : '概算名称',
			dataIndex : 'bdgname',
			width : 80,
			renderer :function(value) {
				var qtip = "qtip=" + value;
				return'<span ' + qtip + '>' + value + '</span>';
			},
			align : 'center'
		}, {
			header : '概算金额',
			dataIndex : 'bdgmoney',
			width : 80,
			align : 'right',
			renderer : function(value) {
				if (value != 0) {
					value = (value / 10000).toFixed(2);
					return cnMoneyToPrec(value, 2);
				} else
					return value;
			}			
		}, {
			header : '合同名称',
			dataIndex : 'conname',
			width : 80,
			renderer :function(value) {
				var qtip = "qtip=" + value;
				return'<span ' + qtip + '>' + value + '</span>';
			},
			align : 'center'
		}, {
			header : '合同总金额',
			dataIndex : 'contmoney',
			width : 80,
			align : 'right',
			renderer : function(value) {
				if (value != 0) {
					value = (value / 10000).toFixed(2);
					return cnMoneyToPrec(value, 2);
				} else
					return value;
			}			
		}])

bdgGrid = new Ext.grid.GridPanel({
			height : 300,
			width : 500,
			cm : colModel,
			store : bdgStore,
			border : true,
			layout : 'fit',
			header : true,
			autoScroll : true,
			collapsible : false,
			animCollapse : false,
			loadMask : true,
			trackMouseOver : true,
			tbar : ['->', "单位：万元"],
			viewConfig : {
				forceFit : true,
				ignoreAdd : true
			}
		})

function look(val) {
	if (!bdgWin) {
		bdgWin = new Ext.Window({
					id : 'bdgWin',
					title : '该概算分摊情况查看',
					iconCls : 'form',
					width : 525,
					height : 340,
					layout : 'fit',
					modal : true,
					closeAction : 'hide',
					maximizable : true,
					minimizable : true,
					resizable : true,
					autoScroll : true,
					plain : true,
					items : [bdgGrid],
					listeners : {
						beforerender : function() {
						}
					}
				})
	}
	bdgWin.show();
	bdgStore.baseParams.params = 'pid`' + CURRENTAPPID + ";bdgid`" + val;
	bdgStore.load();
}

function arrayYearCreater() {
	var arrayYear = [];
	var curYear = SYS_DATE_DATE.getFullYear();
	var startYear = 2009;
	for(var i=curYear; i>=startYear; i--) {
		var tmpArray = [];
		tmpArray.push(i + "年");
		tmpArray.push(i);
		arrayYear.push(tmpArray);
	}
	
	return arrayYear;
}