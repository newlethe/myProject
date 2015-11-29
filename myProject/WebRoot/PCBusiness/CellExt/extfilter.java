String unitid = map.get("UNITID").toString();
String unitTypeId = map.get("UNIT_TYPE_ID").toString();
if (unitTypeId.equals("A")) {
	List list = com.baselib.JdbcUtil
			.query("select report_status from Pc_Tzgl_Month_Comp_M where pid='"
					+ unitid + "' and sj_type='"+sjType+"'");
	String reportStatus = "";
	if (list!=null && list.size() > 0) {
		reportStatus = ((java.util.Map) list.get(0)).get(
				"REPORT_STATUS").toString();
	}
	if (reportStatus.equals("3")) {
		return true;
	} else {
		return false;
	}
} else {
	List list = com.baselib.JdbcUtil
	.query("select report_status from Pc_Tzgl_Month_Comp_M m where m.pid in (select t.unitid from "+
			"sgcc_ini_unit t where t.upunit='"+unitid+"' ) and m.report_status='3' and m.sj_type='"+sjType+"'");
	if (list!=null && list.size() > 0) 
		return true;
	else
		return false;
}