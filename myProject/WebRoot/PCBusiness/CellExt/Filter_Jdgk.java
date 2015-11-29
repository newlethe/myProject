//集团审查二级企业报表
//cell报表的过滤条件:二级公司审核通过的项目，并且所在的二级公司汇总表主记录已上报至集团
String unitid = map.get("UNITID").toString();
String unitTypeId = map.get("UNIT_TYPE_ID").toString();
if (unitTypeId.equals("A")) {
	List list = com.baselib.JdbcUtil.query("select state from PC_EDO_REPORT_INPUT where pid='"
					+ unitid + "' and sj_type='"+sjType+"' and state='3'");
	if (list!=null && list.size() > 0) {
		return true;
	}else{
		return false;
	}
} else {
	return true;
}