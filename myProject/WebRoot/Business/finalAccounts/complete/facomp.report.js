var reportPid = indexReportPid == "" ? CURRENTAPPID : indexReportPid;
var showReportBtn = DEPLOY_UNITTYPE == 'A';
Ext.onReady(function() {
	var myData = [
			['火电竣工工程概况表【竣建01表】',
					'<a href="javascript:openReport(\'GJ_PROJECT_INFO_REP\')">报表</a>'],
			['竣工工程决算一览表【竣建02表】',
					'<a href="javascript:openReport(\'FACOMP_BDG_INFO_REPORT_2\')">报表</a>', '<a href="javascript:initData(\'FACOMP_BDG_INFO_REPORT_2\')">初始化</a>'],
			['预计未完工收尾工程明细表【竣建02附表】',
					'<a href="javascript:openReport(\'FACOMP_UNCOMP_PRJ\')">报表</a>'],
			['其他费用明细表【竣建03表】',
					'<a href="javascript:openReport(\'FACOMP_OTHER_COST_REPORT_3\')">报表</a>', '<a href="javascript:initData(\'FACOMP_OTHER_COST_REPORT_3\')">初始化</a>'],
			['待摊基建支出分摊明细表【竣建03附表】',
					'<a href="javascript:openReport(\'FACOMP_DTFY_REPORT_ATTACH_3\')">报表</a>', '<a href="javascript:initData(\'FACOMP_DTFY_REPORT_ATTACH_3\')">初始化</a>'],
			['移交资产总表【竣建04表】',
					'<a href="javascript:openReport(\'FACOMP_TRANSFER_ASSETS_R4\')">报表</a>', '<a href="javascript:initData(\'FACOMP_TRANSFER_ASSETS_R4\')">初始化</a>'],
			['移交资产总表——房屋、建筑物一览表【竣建04-1表】',
					'<a href="javascript:openReport(\'FACOMP_TRANSFER_ASSETS_R4_1\')">报表</a>', '<a href="javascript:initData(\'FACOMP_TRANSFER_ASSETS_R4_1\')">初始化</a>'],
			['移交资产总表——安装的机械设备一览表【竣建04-2表】',
					'<a href="javascript:openReport(\'FACOMP_TRANSFER_ASSETS_R4_2\')">报表</a>', '<a href="javascript:initData(\'FACOMP_TRANSFER_ASSETS_R4_2\')">初始化</a>'],
			['移交资产总表——不需要安装的机械设备、工器具及家具一览表【竣建04-3表】',
					'<a href="javascript:openReport(\'FACOMP_TRANSFER_ASSETS_R4_3\')">报表</a>', '<a href="javascript:initData(\'FACOMP_TRANSFER_ASSETS_R4_3\')">初始化</a>'],
			['移交资产总表——长期待摊费用、无形资产一览表【竣建04-4表】',
					'<a href="javascript:openReport(\'FACOMP_TRANSFER_ASSETS_R4_4\')">报表</a>', '<a href="javascript:initData(\'FACOMP_TRANSFER_ASSETS_R4_4\')">初始化</a>']
		];

	// create the data store
	var store = new Ext.data.SimpleStore({
				fields : [{
							name : 'reportName'
						}, {
							name : 'detail'
						}, {
							name : 'init'
						}]
			});

	// create the Grid
	var grid = new Ext.grid.GridPanel({
				region : 'center',
				store : store,
				columns : [{
							id : 'reportName',
							header : "报表名称",
							width : 500,
							sortable : true,
							dataIndex : 'reportName'
						}, {
							header : "报表",
							width : 80,
							dataIndex : 'detail'
						}, {
							header : "报表数据初始化",
							width : 120,
							dataIndex : 'init'
						}],
				stripeRows : true,
				height : 600,
				width : document.body.clientWidth,
				title : '竣工决算报表'
			});

	var viewport = new Ext.Viewport({
				layout : 'border',
				items : [grid]
			});

	store.loadData(myData);
	grid.getSelectionModel().selectFirstRow();
});

function openReport(tableName) {
	var xgridUrl = CONTEXT_PATH + "/dhtmlxGridCommon/xgridview/templateXgridView.jsp";
	var param = new Object()
	param.sj_type = '2013'; // 时间
	param.unit_id = reportPid; // 取表头用
	param.company_id = ''; // 取数据用（为空是全部单位）
	param.editable = ModuleLVL < 3 ? true : false; // 是否能编辑，不传为不能编辑

	if (tableName == 'GJ_PROJECT_INFO_REP') {
		db2Json.selectSimpleData("select fileid from app_template where templatecode='"
						+ tableName + "'", function(data) {
					if (data && data.length > 0 && eval(data).length > 0) {
						var fileid = eval(data);
						var url = MAIN_SERVLET + "?ac=downloadFile&fileid=" + fileid;
						var param = new Object()
						param.url = url;
						param.sqlParam = "P_pid`" + reportPid;
						window.showModelessDialog(CONTEXT_PATH + "/Business/finalAccounts/report/excel.report.jsp",
										param, "dialogWidth:1000;dialogHeight:600;center:yes;resizable:yes;")
					}
				});
	}
	if (tableName == 'FACOMP_BDG_INFO_REPORT_2') {
		faReportService.initFacompBdgInfoReport2(false,reportPid, function(str) {
			if(str=="1"){	
					param.headtype = 'FACOMP_BDG_INFO_REPORT_2';
					param.keycol = 'treeid';
					param.xgridtype = "simpletree";
					param.parentsql = "select bdgno,bdgname,buildbdgmoney,buildbdgsbjzmoney,equipbdgmoney,installbdgmoney,otherbdgmoney," +
							"bdg_money_total,build_money_total,buildrealsbjzmoney," +
							"install_money_total,equipbuymoney,other_money_total," +
							"real_money_total,upordown_money,upordown_rate, treeid nestedCol, treeid cnode, parentid pnode from FACOMP_BDG_INFO_REPORT_2 where treeid like '"+reportPid+"-01%' and pid='" + reportPid + "' order by treeid";
					param.bpnode = reportPid+"-0";
					param.relatedCol = "treeid";
					param.ordercol = "treeid";
					param.hasFooter = "false";
					param.hasSaveBtn = false;
					param.hasInsertBtn = false;
					param.hasDelBtn = false;
					window.showModelessDialog(xgridUrl, param, "dialogWidth:" + screen.availWidth + ";dialogHeight:"
											+ screen.availHeight + ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
			}else{
				Ext.example.msg('提示', '请先初始化报表数据!');
			}
		});
	}
	if (tableName == 'FACOMP_OTHER_COST_REPORT_3') {
		faReportService.initFacompOtherCostReport3(false,reportPid, function(str) {
			if(str=="1"){	
					param.headtype = 'FACOMP_OTHER_COST_REPORT_3';
					param.keycol = 'treeid';
					param.xgridtype = "simpletree";
					param.parentsql = "select subject_bm,subject_name,bdg_money,deferred_expenses_money,fixed_assets_money,current_assets_money," +
							"intangible_assets_money,long_term_unamortized_money,real_total_money,remark" +
							",treeid nestedCol, treeid cnode, parentid pnode from FACOMP_OTHER_COST_REPORT_3 where treeid like '"+reportPid+"-0%' and pid='" + reportPid + "' order by treeid";
					param.bpnode = reportPid+"-01";
					param.relatedCol = "treeid";
					param.ordercol = "treeid";
					param.hasFooter = "false";
					param.hasSaveBtn = false;
					param.hasInsertBtn = false;
					param.hasDelBtn = false;
					window.showModelessDialog(xgridUrl, param, "dialogWidth:" + screen.availWidth + ";dialogHeight:"
											+ screen.availHeight + ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
			}else{
				Ext.example.msg('提示', '请先初始化报表数据!');
			}
		});
	}
	if (tableName == 'FACOMP_DTFY_REPORT_ATTACH_3') {
		faReportService.initFacompDtfyContDetail3(false,reportPid, function(str) {
			if(str=="1"){
	 			window.showModelessDialog(CONTEXT_PATH+ "/Business/finalAccounts/complete/facomp.dtfycontdetailview.jsp",
							param, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight
									+ ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
				}else{
					Ext.example.msg('提示', '请先初始化报表数据!');
				}
		});
	}
	if (tableName == 'FACOMP_TRANSFER_ASSETS_R4') {
		faReportService.initFacompTransferAssetsR4(false,reportPid, function(str) {
			if(str=="1"){	
					param.headtype = 'FACOMP_TRANSFER_ASSETS_R4';
					param.keycol = 'treeid';
					param.xgridtype = "simpletree";
					param.parentsql = "select assetno,assetname,build_money,equip_buy_money,install_money,cont_money," +
							"fixed_assets_money,current_assets_money,intangible_assets_money,long_term_unamortized_money" +
							",other_cost_money,transfer_total_money,treeid nestedCol, treeid cnode, parentid pnode from FACOMP_TRANSFER_ASSETS_R4 where treeid like '"+reportPid+"-01%' and pid='" + reportPid + "' order by treeid";
					param.bpnode = reportPid+"-01";
					param.relatedCol = "treeid";
					param.ordercol = "treeid";
					param.hasFooter = "false";
					param.hasSaveBtn = false;
					param.hasInsertBtn = false;
					param.hasDelBtn = false;
					window.showModelessDialog(xgridUrl, param, "dialogWidth:" + screen.availWidth + ";dialogHeight:"
											+ screen.availHeight + ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
			}else{
				Ext.example.msg('提示', '请先初始化报表数据!');
			}
		});
	}
	if (tableName == 'FACOMP_TRANSFER_ASSETS_R4_1') {
		faReportService.initFacompTransferAssetsR41(false,reportPid, function(str) {
			if(str=="1"){	
					param.headtype = 'FACOMP_TRANSFER_ASSETS_R4_1';
					param.keycol = 'treeid';
					param.xgridtype = "simpletree";
					param.parentsql = "select assetno,assetname,structure,position,unit,num,buildmoney," +
							"contmoney,transfertotalmoney,remark," +
							"treeid nestedCol, treeid cnode, parentid pnode from FACOMP_TRANSFER_ASSETS_R4_1 where treeid like '"+reportPid+"-0101%' and pid='" + reportPid + "' order by treeid";
					param.bpnode = reportPid+"-0101";
					param.relatedCol = "treeid";
					param.ordercol = "treeid";
					param.hasFooter = "false";
					param.hasSaveBtn = false;
					param.hasInsertBtn = false;
					param.hasDelBtn = false;
					window.showModelessDialog(xgridUrl, param, "dialogWidth:" + screen.availWidth + ";dialogHeight:"
											+ screen.availHeight + ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
			}else{
				Ext.example.msg('提示', '请先初始化报表数据!');
			}
		});
	}
	if (tableName == 'FACOMP_TRANSFER_ASSETS_R4_2') {
		faReportService.initFacompTransferAssetsR42(false,reportPid, function(str) {
			if(str=="1"){	
					param.headtype = 'FACOMP_TRANSFER_ASSETS_R4_2';
					param.keycol = 'treeid';
					param.xgridtype = "simpletree";
					param.parentsql = "select assetno,assetname,structure,delivery_unit,position,unit,num,equip_buy_money," +
							"equip_bed_money,install_money,other_cost_money,transfer_total_money,remark," +
							"treeid nestedcol, treeid cnode, parentid pnode from facomp_transfer_assets_r4_2 where treeid like '"+reportPid+"-0101%' and pid='" + reportPid + "' order by treeid";
					param.bpnode = reportPid+"-0101";
					param.relatedCol = "treeid";
					param.ordercol = "treeid";
					param.hasFooter = "false";
					param.hasSaveBtn = false;
					param.hasInsertBtn = false;
					param.hasDelBtn = false;
					window.showModelessDialog(xgridUrl, param, "dialogWidth:" + screen.availWidth + ";dialogHeight:"
											+ screen.availHeight + ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
			}else{
				Ext.example.msg('提示', '请先初始化报表数据!');
			}
		});
	}
	if (tableName == 'FACOMP_TRANSFER_ASSETS_R4_3') {
		faReportService.initFacompTransferAssetsR43(false,reportPid, function(str) {
			if(str=="1"){	
					param.headtype = 'FACOMP_TRANSFER_ASSETS_R4_3';
					param.keycol = 'treeid';
					param.xgridtype = "simpletree";
					param.parentsql = "select assetno,assetname,structure,delivery_unit,position,unit,num,fixed_assets_money," +
							"current_assets_money,remark,treeid nestedcol, treeid cnode, parentid pnode from" +
							" FACOMP_TRANSFER_ASSETS_R4_3 where treeid like '"+reportPid+"-01%' and pid='" + reportPid + "' order by treeid";
					param.bpnode = reportPid+"-01";
					param.relatedCol = "treeid";
					param.ordercol = "treeid";
					param.hasFooter = "false";
					param.hasSaveBtn = false;
					param.hasInsertBtn = false;
					param.hasDelBtn = false;
					window.showModelessDialog(xgridUrl, param, "dialogWidth:" + screen.availWidth + ";dialogHeight:"
											+ screen.availHeight + ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
			}else{
				Ext.example.msg('提示', '请先初始化报表数据!');
			}
		});
	}
	if (tableName == 'FACOMP_TRANSFER_ASSETS_R4_4') {
		faReportService.initFacompTransferAssetsR44(false,reportPid, function(str) {
			if(str=="1"){	
					param.headtype = 'FACOMP_TRANSFER_ASSETS_R4_4';
					param.keycol = 'treeid';
					param.xgridtype = "simpletree";
					param.parentsql = "select assetno,assetname,position,unit,num,long_term_unamortized_money," +
							"intangible_assets_money,remark,treeid nestedcol, treeid cnode, parentid pnode from" +
							" facoMP_TRANSFER_ASSETS_R4_4 where treeid like '"+reportPid+"-01%' and pid='" + reportPid + "' order by treeid";
					param.bpnode = reportPid+"-01";
					param.relatedCol = "treeid";
					param.ordercol = "treeid";
					param.hasFooter = "false";
					param.hasSaveBtn = false;
					param.hasInsertBtn = false;
					param.hasDelBtn = false;
					window.showModelessDialog(xgridUrl, param, "dialogWidth:" + screen.availWidth + ";dialogHeight:"
											+ screen.availHeight + ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
			}else{
				Ext.example.msg('提示', '请先初始化报表数据!');
			}
		});
	}
	if (tableName == 'FACOMP_UNCOMP_PRJ') {
		param.headtype = 'FACOMP_UNCOMPLETE_PROJECT_REPORT';
		param.keycol = 'uids';
		param.xgridtype = 'grid';
		param.initInsertData = "pid`" + reportPid;
		param.hasInsertBtn = false;
		param.hasDelBtn = false;
		param.ordercol = "XH";
		window.showModelessDialog(xgridUrl, param, "dialogWidth:" + screen.availWidth + ";dialogHeight:" + screen.availHeight
								+ ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	}
	if(tableName == 'FACOMP_OTHER_STATISTICS_VIEW'){
		param.headtype = 'FACOMP_OTHER_STATISTICS_VIEW';
		param.keycol = 'treeid';
		param.xgridtype = "simpletree";
		param.parentsql = "select prono,proname,bdgmoney,investment_finish_money,tjmoeny,sbmoney,ldmoney,wxmoney,cqdtmoney,totalmoney,remark, treeid nestedCol, treeid cnode, parentid pnode from FACOMP_OTHER_STATISTICS_VIEW" +
				" start with parentid = '01' and pid = '"+reportPid+"' connect by prior treeid = parentid and isleaf<>'1'";
		param.bpnode = "01";
		param.relatedCol = "treeid";
		param.hasSaveBtn = ModuleLVL < 3 ? true : false;
		param.hasInsertBtn = false;
		param.hasDelBtn = false;
		window.showModelessDialog(xgridUrl, param, "dialogWidth:" + screen.availWidth + ";dialogHeight:"
								+ screen.availHeight + ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	}
	if(tableName == 'FACOMP_COST_FIXED_TOTAL_VIEW'){
		param.headtype = 'FACOMP_COST_FIXED_TOTAL_VIEW';
		param.keycol = 'treeid';
		param.xgridtype = "simpletree";
		param.parentsql = "select fixedno,fixedname,cost_value1,cost_value2,cost_value3,treeid nestedCol, " +
				" treeid cnode, parentid pnode from (select * from (select * from FACOMP_COST_FIXED_TOTAL_VIEW  " +
				" where other_cost_type='0001') start with parentid='0' connect by prior treeid=parentid) " +
				" where pid = '"+reportPid+"'";
		param.bpnode = "0";
		param.relatedCol = "treeid";
		param.hasSaveBtn = ModuleLVL < 3 ? true : false;
		param.hasInsertBtn = false;
		param.hasDelBtn = false;
		window.showModelessDialog(xgridUrl, param, "dialogWidth:" + screen.availWidth + ";dialogHeight:"
								+ screen.availHeight + ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	}
}

function initData(tableName) {
	switch (tableName) {
		case 'FACOMP_BDG_INFO_REPORT_2' :
			var mask = new Ext.LoadMask(Ext.getBody(), {
						msg : "正在初始化报表数据，请稍候..."
					});
			mask.show();
			faReportService.initFacompBdgInfoReport2(true,reportPid, function() {
						mask.hide();
						Ext.example.msg('初始化', '报表数据成功初始化!');
					});
			break;
		case 'FACOMP_OTHER_COST_REPORT_3' :
			var mask = new Ext.LoadMask(Ext.getBody(), {
						msg : "正在初始化报表数据，请稍候..."
					});
			mask.show();
			faReportService.initFacompOtherCostReport3(true,reportPid, function() {
						mask.hide();
						Ext.example.msg('初始化', '报表数据成功初始化!');
					});
			break;
		case 'FACOMP_DTFY_REPORT_ATTACH_3' :
			var mask = new Ext.LoadMask(Ext.getBody(), {
						msg : "正在初始化报表数据，请稍候..."
					});
			mask.show();
			faReportService.initFacompDtfyContDetail3(true,reportPid, function() {
						mask.hide();
						Ext.example.msg('初始化', '报表数据成功初始化!');
					});
			break;
		case 'FACOMP_TRANSFER_ASSETS_R4' :
			var mask = new Ext.LoadMask(Ext.getBody(), {
						msg : "正在初始化报表数据，请稍候..."
					});
			mask.show();
			faReportService.initFacompTransferAssetsR4(true,reportPid, function() {
						mask.hide();
						Ext.example.msg('初始化', '报表数据成功初始化!');
					});
			break;
		case 'FACOMP_TRANSFER_ASSETS_R4_1' :
			var mask = new Ext.LoadMask(Ext.getBody(), {
						msg : "正在初始化报表数据，请稍候..."
					});
			mask.show();
			faReportService.initFacompTransferAssetsR41(true,reportPid, function() {
						mask.hide();
						Ext.example.msg('初始化', '报表数据成功初始化!');
					});
			break;
		case 'FACOMP_TRANSFER_ASSETS_R4_2' :
			var mask = new Ext.LoadMask(Ext.getBody(), {
						msg : "正在初始化报表数据，请稍候..."
					});
			mask.show();
			faReportService.initFacompTransferAssetsR42(true,reportPid, function() {
						mask.hide();
						Ext.example.msg('初始化', '报表数据成功初始化!');
					});
			break;
		case 'FACOMP_TRANSFER_ASSETS_R4_3' :
			var mask = new Ext.LoadMask(Ext.getBody(), {
						msg : "正在初始化报表数据，请稍候..."
					});
			mask.show();
			faReportService.initFacompTransferAssetsR43(true,reportPid, function() {
						mask.hide();
						Ext.example.msg('初始化', '报表数据成功初始化!');
					});
			break;
		case 'FACOMP_TRANSFER_ASSETS_R4_4' :
			var mask = new Ext.LoadMask(Ext.getBody(), {
						msg : "正在初始化报表数据，请稍候..."
					});
			mask.show();
			faReportService.initFacompTransferAssetsR44(true,reportPid, function() {
						mask.hide();
						Ext.example.msg('初始化', '报表数据成功初始化!');
					});
			break;
	}
}
