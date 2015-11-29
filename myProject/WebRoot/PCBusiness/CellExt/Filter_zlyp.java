String unitid = map.get("UNITID").toString();
String unitTypeId = map.get("UNIT_TYPE_ID").toString();
if (unitTypeId.equals("A")) {
	List list = com.baselib.JdbcUtil.query("select report_status from pc_zlgk_qua_info where pid='"
					+ unitid + "' and sj_type='"+sjType+"' and report_status=3");
	if (list!=null && list.size() > 0) {
		return true;
	}else{
		return false;
	}
} else {
	return true;
}