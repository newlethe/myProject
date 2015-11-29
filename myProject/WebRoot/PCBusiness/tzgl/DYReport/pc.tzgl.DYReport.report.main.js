var months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11",
		"12"];
var currDate = new Date();
var currYear = currDate.getYear();
var currMonth = (currDate.getMonth() + 101 + "").substring(1);
var curSjType = currDate.getFullYear() + months[currDate.getMonth()];
var cellURL = "/" + ROOT_CELL + "/cell/eReport.jsp?";
var m_record = window.dialogArguments;
var dyreportType = null;
var reportTable = "";
var saveAble = false;
var f_date = null;
var reportParams = null;
var sjArr = null;
var timeCombo = null;
if (Ext.isEmpty(m_record)) {
	dyreportType = edit_dyreportType;
	f_date = currYear + "" + currMonth;
} else {
	dyreportType = edit_dyreportType;
	f_date = m_record.get('sjType');
	curSjType = f_date;
	var state = m_record.get('state');
	saveAble = ((state == '0' || state == '2') ? true : false);
}
if (dyreportType == 1) {
	reportTable = 'pc_tzgl_dyreport1_m';
	reportParams = {
		p_type : "DY_MONTHREPORT1",
		p_date : f_date,
		p_inx : "DY_MONTHREPORT1",
		savable : saveAble,
		openCellType : 'frame'
	};

}
if (dyreportType == 2) {
	reportTable = 'pc_tzgl_dyreport2_m';
	reportParams = {
		p_type : "DY_MONTHREPORT2",
		p_date : f_date,
		p_inx : "DY_MONTHREPORT2",
		savable : saveAble,
		openCellType : 'frame'
	};

}
if (dyreportType == 3) {
	reportTable = 'pc_tzgl_dyreport3_m';
	reportParams = {
		p_type : "DY_MONTHREPORT3",
		p_date : f_date,
		p_inx : "DY_MONTHREPORT3",
		savable : saveAble,
		openCellType : 'frame'
	};
}

var sjSql = "";
if (dyreportType == "1" || dyreportType == "2" || dyreportType == "3") {
	if (USERBELONGUNITTYPEID == "2") {
		sjSql = "select distinct sj_type val, substr(sj_type, 0, 4)||'年'||substr(sj_type, 5, 2)||'月' txt from "
				+ reportTable
				+ " where pid in "
				+ "(select unitid from (select unitid, unit_type_id from sgcc_ini_unit start with unitid = '"
				+ USERBELONGUNITID
				+ "' "
				+ "connect by prior unitid = upunit) where unit_type_id='A') and state = '3' order by sj_type desc";
	} else if (USERBELONGUNITTYPEID == "0") {
		sjSql = "select distinct sj_type val, substr(sj_type, 0, 4)||'年'||substr(sj_type, 5, 2)||'月' txt from "
				+ reportTable
				+ " where pid in "
				+ "(select unitid from sgcc_ini_unit where unit_type_id='2') and state = '3' order by sj_type desc";
	}
	var sjArrTemp = new Array();
	DWREngine.setAsync(false);
	baseDao.getData(sjSql, function(list) {
				if (list && list != null && list.length > 0) {
					for (i = 0; i < list.length; i++) {
						var temp = new Array();
						temp.push(list[i][0] + "");
						temp.push(list[i][1] + "");
						sjArrTemp.push(temp);
					}
				}
			})
	DWREngine.setAsync(true);
	sjArr = sjArrTemp;
}

if (dyreportType == 4) {
	if (Ext.isEmpty(m_record)) {
		curSjType = currYear;
	} else {
		curSjType = f_date.substr(0, 4);
	}
	reportParams = {
		p_type : "DY_YEARREPORT4",
		p_date : curSjType,
		p_inx : "DY_YEARREPORT4",
		openCellType : 'frame'
	};
	sjSql = "select t.sj_type from v_pc_tzgl_dyreport4 t group by t.sj_type order by t.sj_type desc";
}

if (dyreportType == 5) {
	if (Ext.isEmpty(m_record)) {
		curSjType = currYear;
	} else {
		curSjType = f_date.substr(0, 4);
	}
	reportParams = {
		p_type : "DY_YEARREPORT5",
		p_date : curSjType,
		p_inx : "DY_YEARREPORT5",
		openCellType : 'frame'
	};
	sjSql = "select t.sj_type from v_pc_tzgl_dyreport5 t group by t.sj_type order by t.sj_type desc";
}

if (dyreportType == "4" || dyreportType == "5") {
	var sjArrTemp = new Array();
	DWREngine.setAsync(false);
	baseDao.getData(sjSql, function(list) {
				for (i = 0; i < list.length; i++) {
					var temp = new Array();
					temp.push(list[i] + "");
					temp.push(list[i] + "年");
					sjArrTemp.push(temp);
				}
			})
	DWREngine.setAsync(true);
	sjArr = sjArrTemp;
}

Ext.onReady(function() {

	var timeStore = new Ext.data.SimpleStore({
				fields : ['k', 'v'],
				data : sjArr
			});
	timeCombo = new Ext.form.ComboBox({
				store : timeStore,
				typeAhead : true,
				triggerAction : 'all',
				mode : 'local',
				valueField : 'k',
				displayField : 'v',
				editable : false,
				value : (sjArr && sjArr.length > 0) ? sjArr[0][0] : curSjType,
				maxHeight : 107,
				width : 100,
				listeners : {
					select : resetCellFrm
				}
			});

	if (sjArr && sjArr.length > 0) {
		reportParams.p_date = sjArr[0][0];
	}

	var cellSrc = (cellURL + Ext.urlEncode(reportParams));
	new Ext.Viewport({
		layout : 'fit',
		border : false,
		items : [{
			xtype : 'panel',
			tbar : edit_timeShow == '1'
					? ['&nbsp;&nbsp;时间&nbsp;', timeCombo]
					: '',
			html : '<iframe name="cellFrm" src="'
					+ cellSrc
					+ '" frameborder=0 style="width:100%;height:100%;"></iframe>'
		}]
	});
});
function resetCellFrm() {
	if (timeCombo.getValue() != "") {
		sjType = timeCombo.getValue();
		reportParams.p_date = sjType;
		window.frames["cellFrm"].location.href = (cellURL + Ext
				.urlEncode(reportParams));
	}
}

function onCellOpened(CellWeb1, p_date) {
	var sheets = CellWeb1.GetTotalSheets();
	for (var i = 0; i < sheets; i++) {
		sheetInx = i;
		var firTable = myFindSheetTable(CellWeb1, i);
	}
	var unitIds = USERPIDS.split(",");
	unitIds = getReportPids1(dyreportType, p_date);
	if (unitIds.length == 0) {
		unitIds[0] = " ";
	}
	fliterRowData(CellWeb1, firTable, unitIds);
	CellDoc = new CellXmlDoc(CellWeb1);
	if (m_record) {
		var reportId = m_record.get('uids');
		DWREngine.setAsync(false);
		pcTzglService.findDataByTableId(reportTable, "uids='" + reportId + "'",
				function(masterRecord) {
					if (masterRecord.CREATEPERSON == null)
						masterRecord.CREATEPERSON = REALNAME;
					CellDoc.replaceSign(masterRecord);
				});
		DWREngine.setAsync(true);
	} else {
		var mrd = {
			"CREATEDATE" : "",
			"UNIT_USERNAME" : "",
			"COUNT_USERNAME" : "",
			"CREATEPERSON" : "",
			"CREATE_DATE" : "",
			"corpname" : ""
		};
		if (reportTable && reportTable != "") {
			var sql11 = "select uids, pid, sj_type, to_char(create_date, 'yyyy-mm-dd'), unit_username, count_username, createperson, createperson_tel from "
					+ reportTable
					+ " where pid = '"
					+ USERBELONGUNITID
					+ "' and sj_type='" + p_date + "'";
			DWREngine.setAsync(false);
			baseDao.getData(sql11, function(list) {
						if (list && list != null && list.length > 0) {
							m_record = new Ext.data.Record({
										uids : list[0][0],
										pid : list[0][1]
									});
							mrd.CREATE_DATE = list[0][3];
							mrd.UNIT_USERNAME = list[0][4];
							mrd.COUNT_USERNAME = list[0][5];
							mrd.CREATEPERSON = list[0][6];
							CellDoc.replaceSign(list[0]);
						}
					});
			DWREngine.setAsync(true);
		}
		CellDoc.replaceSign(mrd);
	}
	if (!m_record || !m_record.get('pid')) {
		hideTagRows(CellWeb1);
	}
}

// 定位到"table:"
function myFindSheetTable(CellWeb1, sheet) {
	var firTable = "";
	with (CellWeb1) {
		var maxCol = GetCols(sheet)
		var maxRow = GetRows(sheet)
		for (var c = 1; c < maxCol; c++) {
			for (var r = 1; r < maxRow; r++) {
				var cellStr = GetCellString(c, r, sheet)
				if (cellStr.indexOf("table:") > -1) {
					firTable = new Object();
					firTable.col = c;
					firTable.row = r;
					firTable.sheet = sheet;
					return firTable;
				}
			}
		}
	}
	return firTable;
}

// 过滤行
function fliterRowData(CellWeb1, firTable, unitIds) {
	if (firTable != "" && unitIds.length > 0) {
		var maxCol = CellWeb1.GetCols(firTable.sheet);
		var maxRow = CellWeb1.GetRows(firTable.sheet);
		for (var r = firTable.row + 1; r < maxRow; r++) {
			var flag = true;
			var cellStr = CellWeb1.GetCellString(firTable.col, r,
					firTable.sheet);
			for (var i = 0; i < unitIds.length; i++) {
				if (cellStr == unitIds[i] || cellStr == "") {
					flag = false;
					break;
				}
			}
			if (flag) {
				CellWeb1.ClearArea(firTable.col, r, maxCol, r, firTable.sheet,
						32);
				CellWeb1.SetRowHidden(r, r);
			}
		}
	}
}

function getReportPids1(dyreportType, f_date) {
	var sjSql = "";
	if (USERBELONGUNITTYPEID == "2") {
		sjSql = "select distinct pid from "
				+ reportTable
				+ " where pid in "
				+ "(select unitid from (select unitid, unit_type_id from sgcc_ini_unit start with unitid = '"
				+ USERBELONGUNITID
				+ "' "
				+ "connect by prior unitid = upunit) where unit_type_id='A') and state = '3' and sj_type='"
				+ f_date + "'";
	} else if (USERBELONGUNITTYPEID == "0") {
		sjSql = "select unitid from (select * from sgcc_ini_unit start with unitid in ("
				+ " select pid from "
				+ reportTable
				+ " where pid in (select unitid from sgcc_ini_unit where unit_type_id = '2')"
				+ " and state = '3' and sj_type= '"
				+ f_date
				+ "') connect by prior unitid=upunit) where unit_type_id = 'A'";
	}

	if (USERBELONGUNITTYPEID == "2") {
		if (dyreportType == 4) {
			sjSql = "select distinct unit_id from v_pc_tzgl_dyreport4 t "
					+ " where unit_id in "
					+ "(select unitid from (select unitid, unit_type_id from sgcc_ini_unit start with unitid = '"
					+ USERBELONGUNITID
					+ "' "
					+ "connect by prior unitid = upunit) where unit_type_id='A') and sj_type='"
					+ f_date + "'";
		}
		if (dyreportType == 5) {
			sjSql = "select distinct unit_id from v_pc_tzgl_dyreport5 t "
					+ " where unit_id in "
					+ "(select unitid from (select unitid, unit_type_id from sgcc_ini_unit start with unitid = '"
					+ USERBELONGUNITID
					+ "' "
					+ "connect by prior unitid = upunit) where unit_type_id='A') and sj_type='"
					+ f_date + "'";
		}
	} else if (USERBELONGUNITTYPEID == "0") {
		if (dyreportType == 4) {
			sjSql = "select distinct unit_id  from v_pc_tzgl_dyreport4 t where sj_type='"
					+ f_date + "'";
		}
		if (dyreportType == 5) {
			sjSql = "select distinct unit_id from v_pc_tzgl_dyreport5 t where sj_type='"
					+ f_date + "'";
		}
	}

	var unitIds1 = new Array();
	DWREngine.setAsync(false);
	baseDao.getData(sjSql, function(list) {
				if (list && list != null && list.length > 0) {
					for (i = 0; i < list.length; i++) {
						unitIds1.push(list[i]);
					}
				}
			})
	DWREngine.setAsync(true);
	return unitIds1;

}

function getReportPids(dyreportType, f_date) {
	var unitIds1 = null;
	DWREngine.setAsync(false);
	pcTzglService.getReportPids(dyreportType, f_date, function(list) {
				unitIds1 = list;
			});
	DWREngine.setAsync(true);
	return unitIds1;

}

function afterCellSaved(CellWeb1) {
	if (!m_record)
		return;
	var reportId = m_record.get('uids');
	var dataMap = CellDoc.getValues();
	if (dataMap && dataMap.length > 0) {
		DWREngine.setAsync(false);
		pcTzglService.updateDataByTableId(reportTable, " uids='" + reportId
						+ "'", dataMap, function() {
				});
		DWREngine.setAsync(true);
	}

}
var sign = {
	unitUsername : {
		label : '单位负责人',
		id : 'unitUsername',
		column : 'UNIT_USERNAME'
	},
	countUsername : {
		label : '统计负责人',
		id : 'countUsername',
		column : 'COUNT_USERNAME'
	},
	createPerson : {
		label : '填报人',
		id : 'createperson',
		column : 'CREATEPERSON'
	}
}
function beforeCellSaved(CellWeb1, win) {
	var signCells = CellDoc.signCells;
	for (var i in sign) {
		var tag = sign[i].column;
		var flag = win.isNull(signCells[tag].c, signCells[tag].r,
				signCells[tag].s);
		if (flag == "1") {// 单元格数据为空
			return {
				success : false,
				msg : "'" + sign[i].label + "为必填项'"
			}
		}
	}
	return {
		success : true
	};
}

// 如果是集团报表，因为没有主记录，隐藏最后一行；
function hideTagRows(CellWeb1) {
	var signCells = CellDoc.signCells;
	for (var i in sign) {
		var tag = sign[i].column;
		CellWeb1.SetRowHidden(signCells[tag].r, signCells[tag].r);
	}
}
