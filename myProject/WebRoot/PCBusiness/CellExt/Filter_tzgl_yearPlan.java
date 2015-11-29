String unitid = map.get("UNITID").toString();
String unitTypeId = map.get("UNIT_TYPE_ID").toString();
if (unitTypeId.equals("A")) {
	List list = com.baselib.JdbcUtil.query("select state_a from v_pc_tzgl_year_plan_report where pid='"
					+ unitid + "' and sj_type='"+sjType+"' and state_a='3'");
	if (list!=null && list.size() > 0) {
		return true;
	}else{
		return false;
	}
} else {
	return true;
}