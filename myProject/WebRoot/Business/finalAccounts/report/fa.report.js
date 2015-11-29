var reportPid = indexReportPid == "" ? CURRENTAPPID : indexReportPid;
var showReportBtn = DEPLOY_UNITTYPE == 'A';
Ext.onReady(function() {
	var myData = [
			['竣工工程概况表【竣建01表】',
					'<a href="javascript:openReport(\'FA_01\')">报表</a>', '', '<a href="javascript:reportData(\'FA_01\')">上报</a>'],
			['竣工工程决算一览表【竣建02表】',
					'<a href="javascript:openReport(\'FA_OVERALL_REPORT\')">报表</a>', '<a href="javascript:initData(\'FA_OVERALL_REPORT\')">初始化</a>', '<a href="javascript:reportData(\'FA_OVERALL_REPORT\')">上报</a>'],
			['竣工工程决算一览表（建筑工程部分）【竣建02-1表】',
					'<a href="javascript:openReport(\'FA_BUILD_OVE_REPORT\')">报表</a>', '<a href="javascript:initData(\'FA_BUILD_OVE_REPORT\')">初始化</a>', '<a href="javascript:reportData(\'FA_BUILD_OVE_REPORT\')">上报</a>'],
			['竣工工程决算一览表（安装工程和设备购置部分）【竣建02-2表】',
					'<a href="javascript:openReport(\'FA_INSTALL_EQU_REPORT\')">报表</a>', '<a href="javascript:initData(\'FA_INSTALL_EQU_REPORT\')">初始化</a>', '<a href="javascript:reportData(\'FA_INSTALL_EQU_REPORT\')">上报</a>'],
			['预计未完工程明细表【竣建02表附表】',
					'<a href="javascript:openReport(\'FA_UNFINISHED_PRJ_REPORT\')">报表</a>', '<a href="javascript:initData(\'FA_UNFINISHED_PRJ_REPORT\')">初始化</a>', '<a href="javascript:reportData(\'FA_UNFINISHED_PRJ_REPORT\')">上报</a>'],
			['其他费用明细表【竣建03表】',
					'<a href="javascript:openReport(\'FA_OTHER_DETAIL_REPORT\')">报表</a>', '<a href="javascript:initData(\'FA_OTHER_DETAIL_REPORT\')">初始化</a>', '<a href="javascript:reportData(\'FA_OTHER_DETAIL_REPORT\')">上报</a>'],
			['待摊基建支出分摊明细表【竣建03表附表】',
					'<a href="javascript:openReport(\'FA_OUTCOME_APP_REPORT\')">报表</a>', '', '<a href="javascript:reportData(\'FA_OUTCOME_APP_REPORT\')">上报</a>'],
			['移交资产总表【竣建04表】',
					'<a href="javascript:openReport(\'FA_ASSETS_REPORT\')">报表</a>', '', '<a href="javascript:reportData(\'FA_ASSETS_REPORT\')">上报</a>'],
			['房屋及建筑物【竣建04-1表】',
					'<a href="javascript:openReport(\'FA_BUILDING_AUDIT_REPORT\')">报表</a>', '', '<a href="javascript:reportData(\'FA_BUILDING_AUDIT_REPORT\')">上报</a>'],
			['安装机械设备一览表【竣建04-2表】',
					'<a href="javascript:openReport(\'FA_EQU_AUDIT_REPORT\')">报表</a>', '', '<a href="javascript:reportData(\'FA_EQU_AUDIT_REPORT\')">上报</a>'],
			['不需安装机械设备一览表【竣建04-4表】',
					'<a href="javascript:openReport(\'FA_MAT_AUDIT_REPORT\')">报表</a>', '', '<a href="javascript:reportData(\'FA_MAT_AUDIT_REPORT\')">上报</a>'],
			['长期待摊费用、无形资产一览表【竣建04-5表】',
					'<a href="javascript:openReport(\'FA_INTANGIBLE_ASSETS_REPORT\')">报表</a>', '', '<a href="javascript:reportData(\'FA_INTANGIBLE_ASSETS_REPORT\')">上报</a>'],
			['竣工工程财务决算表【竣建05表】',
					'<a href="javascript:openReport(\'FA_SETTLEMENT_REPORT\')">报表</a>', '', '<a href="javascript:reportData(\'FA_SETTLEMENT_REPORT\')">上报</a>']];

	// create the data store
	var store = new Ext.data.SimpleStore({
				fields : [{
							name : 'reportName'
						}, {
							name : 'detail'
						}, {
							name : 'init'
						},{
							name : 'report'
						}]

			});

	// create the Grid
	var grid = new Ext.grid.GridPanel({
				region : 'center',
				store : store,
				columns : [{
							id : 'reportName',
							header : "报表名称",
							width : 400,
							sortable : true,
							dataIndex : 'reportName'
						}, {
							header : "报表",
							width : 80,
							dataIndex : 'detail'
						}, {
							header : "报表数据初始化",
							width : 90,
							dataIndex : 'init',
							hidden : !showReportBtn
						},{
							header : '上报',
							width : 80,
							dataIndex : 'report',
							hidden : !showReportBtn
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
	var xgridUrl = CONTEXT_PATH
			+ "/dhtmlxGridCommon/xgridview/templateXgridView.jsp";
	var param = new Object()
	param.sj_type = '2010'; // 时间
	param.unit_id = reportPid; // 取表头用
	param.company_id = ''; // 取数据用（为空是全部单位）
	param.editable = true; // 是否能编辑，不传为不能编辑
	if (ModuleLVL < 3) {
		param.editable = true;
	} else {
		param.editable = false;
	}
	if (tableName == 'FA_01') {
		db2Json.selectSimpleData(
				"select fileid from app_template where templatecode='"
						+ tableName + "'", function(data) {
					if (data && data.length > 0 && eval(data).length > 0) {
						var fileid = eval(data);
						var url = MAIN_SERVLET + "?ac=downloadFile&fileid="
								+ fileid;
						var param = new Object()
						param.url = url;
						param.sqlParam = "P_pid`" + reportPid;
						window
								.showModelessDialog(
										CONTEXT_PATH
												+ "/Business/finalAccounts/report/excel.report.jsp",
										param,
										"dialogWidth:1000;dialogHeight:600;center:yes;resizable:yes;")
					}
				});
	}
	if (tableName == 'FA_OVERALL_REPORT') {
		// alert("竣建02");
		faReportDWR.initFAOverallReport(false, function() {
			param.headtype = 'FA_OVERALL_02';
			param.keycol = 'uids';
			param.xgridtype = 'simpletree';
			param.parentsql = "select bdgname , bdgid nestedCol, bdgid cnode, parent pnode from fa_bdg_info t where t.bdgid in ( select t2.fa_bdgid from fa_overall_report t2 ) and t.pid='" + reportPid + "' order by t.bdgno";
			param.relatedCol = 'fa_bdgid';
			param.bpnode = '0';
			// param.hasSaveBtn = false;
			param.hasInsertBtn = false;
			param.hasDelBtn = false;

			window
					.showModelessDialog(
							xgridUrl,
							param,
							"dialogWidth:"
									+ screen.availWidth
									+ ";dialogHeight:"
									+ screen.availHeight
									+ ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");

		});
	}
	if (tableName == 'FA_BUILD_OVE_REPORT') {
		faReportDWR.initFABuildOveReport(false, function() {
			param.headtype = 'FA_BUILD_OVE_02-1';
			param.keycol = 'uids';
			param.xgridtype = 'simpletree';
			param.parentsql = "select bdgname , bdgid nestedCol, bdgid cnode, parent pnode from fa_bdg_info t where t.bdgid in ( select t2.bdgid from fa_build_ove_report t2 ) and t.pid='" + reportPid + "' order by t.bdgno";
			param.relatedCol = 'bdgid';
			param.bpnode = '0';
			param.hasInsertBtn = false;
			param.hasDelBtn = false;
			window
					.showModelessDialog(
							xgridUrl,
							param,
							"dialogWidth:"
									+ screen.availWidth
									+ ";dialogHeight:"
									+ screen.availHeight
									+ ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
		});
	}
	if (tableName == 'FA_INSTALL_EQU_REPORT') {
		faReportDWR.initFAInstallEquReport(false, function() {
			param.headtype = 'FA_INSTALL_EQU_02-2';
			param.keycol = 'uids';
			param.xgridtype = 'simpletree';
			param.parentsql = "select bdgname, bdgid nestedCol, bdgid cnode, parent pnode from fa_bdg_info t where t.bdgid in ( select t2.bdgid from fa_install_equ_report t2 ) and t.pid='" + reportPid + "' order by t.bdgno";
			param.relatedCol = 'bdgid';
			param.bpnode = '0';
			param.hasInsertBtn = false;
			param.hasDelBtn = false;
			window
					.showModelessDialog(
							xgridUrl,
							param,
							"dialogWidth:"
									+ screen.availWidth
									+ ";dialogHeight:"
									+ screen.availHeight
									+ ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
		});
	}
	if (tableName == 'FA_UNFINISHED_PRJ_REPORT') {
		faReportDWR.initFAUnfinishedPrjReport(false, function() {
			param.headtype = 'FA_UNFINISHED_PRJ_02A';
			param.keycol = 'uids';
			param.xgridtype = 'simpletree';
			param.parentsql = "select bdgname, bdgid nestedCol, bdgid cnode, parent pnode from fa_bdg_info t where t.bdgid in ( select t2.bdgid from fa_unfinished_prj_report t2 ) and t.pid='" + reportPid + "' order by t.bdgno";
			param.relatedCol = 'bdgid';
			param.bpnode = '0';
			param.hasInsertBtn = false;
			param.hasDelBtn = false;
			window
					.showModelessDialog(
							xgridUrl,
							param,
							"dialogWidth:"
									+ screen.availWidth
									+ ";dialogHeight:"
									+ screen.availHeight
									+ ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
		});

	}
	if (tableName == 'FA_OTHER_DETAIL_REPORT') {
		faReportDWR.initFAOtherDetailReport(false, function() {
			param.headtype = 'FA_OTHER_03';
			param.keycol = 'uids';
			param.xgridtype = 'simpletree';
			param.parentsql = "select bdgname, bdgid nestedCol, bdgid cnode, parent pnode from fa_bdg_info t where t.bdgid in ( select t2.bdgid from fa_other_detail_report t2 ) and t.pid='" + reportPid + "' order by t.bdgno";
			param.relatedCol = 'bdgid';
			param.bpnode = '01';
			param.hasInsertBtn = false;
			param.hasDelBtn = false;
			window
					.showModelessDialog(
							xgridUrl,
							param,
							"dialogWidth:"
									+ screen.availWidth
									+ ";dialogHeight:"
									+ screen.availHeight
									+ ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
		});
	}
	if (tableName == 'FA_OUTCOME_APP_REPORT') {
		param.headtype = 'FA_OUTCOME_APP_03A';
		param.keycol = 'uids';
		param.xgridtype = 'simpletree';
		param.parentsql = "select bdgname, bdgid nestedCol, bdgid cnode, parent pnode from fa_bdg_info t where t.bdgid in ( select t2.bdgid from fa_outcome_app_report t2 ) and t.pid='" + reportPid + "' order by t.bdgno";
		param.relatedCol = 'bdgid';
		param.bpnode = '01';
		param.hasInsertBtn = false;
		param.hasDelBtn = false;
		window
				.showModelessDialog(
						xgridUrl,
						param,
						"dialogWidth:"
								+ screen.availWidth
								+ ";dialogHeight:"
								+ screen.availHeight
								+ ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	}
	if (tableName == 'FA_ASSETS_REPORT') {
		faReportDWR.initAssetsReportData(reportPid, function(r) {
			if (r == "OK") {
				param.headtype = 'FA_ASSETS_04';
				param.keycol = 'uids';
				param.xgridtype = "simpletree";
				param.parentsql = "select assets_name, assets_no nestedCol, uids cnode, parent_id pnode from fa_assets_sort start with parent_id='0' and pid='" + reportPid + "' connect by prior uids=parent_id";
				param.bpnode = "0";
				param.relatedCol = "assets_id";
				if (ModuleLVL < 3) {
					param.hasSaveBtn = true;
				} else {
					param.hasSaveBtn = false;
				}
				param.hasInsertBtn = false;
				param.hasDelBtn = false;
				window
						.showModelessDialog(
								xgridUrl,
								param,
								"dialogWidth:"
										+ screen.availWidth
										+ ";dialogHeight:"
										+ screen.availHeight
										+ ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
			}
		});
	}
	if (tableName == 'FA_BUILDING_AUDIT_REPORT') {
		param.headtype = 'FA_BUILDING_04-1';
		param.keycol = 'uids';
		param.xgridtype = "tree";
		param.parentsql = "select assets_name, assets_no nestedCol, uids cnode, parent_id pnode from fa_assets_sort start with parent_id='0' and pid='" + reportPid + "' connect by prior uids=parent_id";
		param.bpnode = "0";
		param.relatedCol = "assets_no";
		param.filter = " and fa_building_audit_report.assets_no is not null and fa_building_audit_report.mainflag='1' and fa_building_audit_report.pid='" + reportPid + "'";
		param.initInsertData = "pid`" + reportPid + ";mainflag`1";
		if (ModuleLVL < 3) {
			param.hasSaveBtn = true;
		} else {
			param.hasSaveBtn = false;
		}
		param.hasInsertBtn = false;
		param.hasDelBtn = false;
		window
				.showModelessDialog(
						xgridUrl,
						param,
						"dialogWidth:"
								+ screen.availWidth
								+ ";dialogHeight:"
								+ screen.availHeight
								+ ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	}
	if (tableName == 'FA_EQU_AUDIT_REPORT') {
		param.headtype = 'FA_EQU_04-2';
		param.keycol = 'uids';
		param.xgridtype = "tree";
		// param.parentsql = "select bdgname, bdgid nestedCol, bdgid cnode,
		// parent pnode from bdg_info start with bdgid = '010201' connect by
		// prior bdgid = parent";
		param.parentsql = "select distinct bdgname, bdgid nestedCol, bdgid cnode, parent pnode from bdg_info "
				+ " start with bdgid in (select distinct bdgid from fa_equ_audit_report where bdgid is not null) and pid = '" + reportPid + "'"
				+ " connect by prior parent = bdgid order by bdgid";
		// param.parentsql = "select assets_name, assets_no nestedCol, uids
		// cnode, parent_id pnode from fa_assets_sort start with uids='111'
		// connect by prior uids=parent_id" ;
		param.bpnode = "01";
		param.relatedCol = "bdgid";
		param.filter = " and fa_equ_audit_report.assets_no is not null and fa_equ_audit_report.mainflag is null and fa_equ_audit_report.equ_id is not null and fa_equ_audit_report.pid='" + reportPid + "'";
		if (ModuleLVL < 3) {
			param.hasSaveBtn = true;
		} else {
			param.hasSaveBtn = false;
		}
		param.hasInsertBtn = false;
		param.hasDelBtn = false;
		window
				.showModelessDialog(
						xgridUrl,
						param,
						"dialogWidth:"
								+ screen.availWidth
								+ ";dialogHeight:"
								+ screen.availHeight
								+ ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	}
	if (tableName == 'FA_MAT_AUDIT_REPORT') {
		param.headtype = 'FA_MAT_04-4';
		param.keycol = 'uids';
		param.xgridtype = "tree";
		param.parentsql = "select assets_name, assets_no nestedCol, uids cnode, parent_id pnode from fa_assets_sort start with parent_id='0' and pid='" + reportPid + "' connect by prior uids=parent_id";
		param.bpnode = "0";
		param.relatedCol = "assets_no";
		param.filter = " and fa_mat_audit_report.assets_no is not null and fa_mat_audit_report.mainflag is null and fa_mat_audit_report.mat_id is not null and fa_mat_audit_report.pid='" + reportPid + "'";
		if (ModuleLVL < 3) {
			param.hasSaveBtn = true;
		} else {
			param.hasSaveBtn = false;
		}
		param.hasInsertBtn = false;
		param.hasDelBtn = false;
		window
				.showModelessDialog(
						xgridUrl,
						param,
						"dialogWidth:"
								+ screen.availWidth
								+ ";dialogHeight:"
								+ screen.availHeight
								+ ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	}

	if (tableName == 'FA_INTANGIBLE_ASSETS_REPORT') {
		param.headtype = 'FA_04-5';
		param.keycol = 'uids';
		param.xgridtype = "grid";
		param.initInsertData = "pid`" + reportPid;
		if (ModuleLVL < 3) {
			param.hasSaveBtn = true;
		} else {
			param.hasSaveBtn = false;
		}
		param.hasInsertBtn = false;
		param.hasDelBtn = false;
		window
				.showModelessDialog(
						xgridUrl,
						param,
						"dialogWidth:"
								+ screen.availWidth
								+ ";dialogHeight:"
								+ screen.availHeight
								+ ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	}
	if (tableName == 'FA_SETTLEMENT_REPORT') {
		param.headtype = 'FA_05';
		param.keycol = 'uids';
		param.xgridtype = "grid";
		if (ModuleLVL < 3) {
			param.hasSaveBtn = true;
		} else {
			param.hasSaveBtn = false;
		}
		param.hasInsertBtn = false;
		param.hasDelBtn = false;
		param.initInsertData = "pid`" + reportPid;
		window
				.showModelessDialog(
						xgridUrl,
						param,
						"dialogWidth:"
								+ screen.availWidth
								+ ";dialogHeight:"
								+ screen.availHeight
								+ ";center:yes;resizable:yes;Minimize=yes;Maximize=yes");
	}
}

function initData(tableName) {

	switch (tableName) {
		case 'FA_OVERALL_REPORT' :

			var mask = new Ext.LoadMask(Ext.getBody(), {
						msg : "正在初始化报表数据，请稍候..."
					});
			mask.show();
			faReportDWR.initFAOverallReport(true, function() {
						mask.hide();
						Ext.example.msg('初始化', '报表数据成功初始化!');
					});
			break;

		case 'FA_BUILD_OVE_REPORT' :
			var mask = new Ext.LoadMask(Ext.getBody(), {
						msg : "正在初始化报表数据，请稍候..."
					});
			mask.show();
			faReportDWR.initFABuildOveReport(true, function() {
						mask.hide();
						Ext.example.msg('初始化', '报表数据成功初始化!');
					});
			break;

		case 'FA_INSTALL_EQU_REPORT' :
			var mask = new Ext.LoadMask(Ext.getBody(), {
						msg : "正在初始化报表数据，请稍候..."
					});
			mask.show();
			faReportDWR.initFAInstallEquReport(true, function() {
						mask.hide();
						Ext.example.msg('初始化', '报表数据成功初始化!');
					});
			break;

		case 'FA_UNFINISHED_PRJ_REPORT' :
			var mask = new Ext.LoadMask(Ext.getBody(), {
						msg : "正在初始化报表数据，请稍候..."
					});
			mask.show();
			faReportDWR.initFAUnfinishedPrjReport(true, function() {
						mask.hide();
						Ext.example.msg('初始化', '报表数据成功初始化!');
					});
			break;
			
		case 'FA_OTHER_DETAIL_REPORT' :
			var mask = new Ext.LoadMask(Ext.getBody(), {
						msg : "正在初始化报表数据，请稍候..."
					});
			mask.show();
			faReportDWR.initFAOtherDetailReport(true, function() {
						mask.hide();
						Ext.example.msg('初始化', '报表数据成功初始化!');
					});
			break;
			
		

	}
}

function reportData(reportType){
	Ext.getBody().mask("上报中...");
	faReportDWR.reportFAReportsToGroup(reportPid, reportType, function(retVal){
		Ext.getBody().unmask();
		if ( retVal == 'success' ){
			Ext.MessageBox.alert('上报', '上报成功!');
		}else{
			Ext.MessageBox.alert('上报', '上报失败!');
		}
		
	});
}

//过滤显示已经部署MIS的项目单位
var _combo = parent.proTreeCombo;
var _data = _combo ? _combo.store : null;
	if(_combo){
		var notUrlArr = new Array();
		var isHave = false;
		DWREngine.setAsync(false);
		var sql = "select unitid,unitname from Sgcc_Ini_Unit "
				+ " where app_url is not null and unit_type_id = 'A'"
				+ " start with unitid = '"+USERBELONGUNITID+"' connect by prior unitid = upunit";
		baseMgm.getData(sql,function(list){
			for(i = 0; i < list.length; i++) {
				if(list[i][0] == reportPid) 
					isHave = true;
				var temp = new Array();	
				temp.push(list[i][0]);
				temp.push(list[i][1]);
				notUrlArr.push(temp);			
			}
	    }); 
	    DWREngine.setAsync(true);
		_data.loadData(notUrlArr);
	    _combo.setValue(reportPid);
	    if(!isHave){
	    	_combo.setValue(notUrlArr[0][0]);
	    	switchoverProj(notUrlArr[0][0], notUrlArr[0][1]);
			parent.window.frames["contentFrame"].location.reload();
	    }	
	    if(_combo.list)_combo.list.hide();
	}

window.onbeforeunload = function(){
	if(_combo){
		_data.loadData(parent.array_prjs);
		if(_combo.list)_combo.list.hide();
	}
}
