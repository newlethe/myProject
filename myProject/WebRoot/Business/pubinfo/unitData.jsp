<%@ page language="java" pageEncoding="GBK"%>
<%@ page import="java.sql.*"%>
<%@ page import="javax.sql.*"%>
<%@ page import="javax.naming.*"%>
<%@ page import="com.sgepit.frame.base.Constant"%>
<%@ page import="com.sgepit.frame.util.JNDIUtil"%>
<%
response.setHeader("Pragma","No-cache"); 
response.setHeader("Cache-Control","no-cache"); 
response.setDateHeader("Expires", 0); 

String userID = (String)session.getAttribute(Constant.USERID);
String pubInfo_id = request.getParameter("pid");
String node = request.getParameter("node");
if(userID.equals("1")){
	node = Constant.DefaultOrgRootID;
}
//guox20080511
String sql = "select unitid,unitname,1,unid,"+
	" (select count(unitid) from sgcc_ini_unit where upunit = t.unitid) as leaf "+
	" from (select unitid,unitname,unid,upunit from sgcc_ini_unit,"+
	" (select unitid as unid from sgcc_info_pub_history where pubinfo_id = '"+pubInfo_id+"') p"+ 
	" where sgcc_ini_unit.unitid = p.unid(+)) t"+
	" start with unitid = '"+node+"' connect by prior t.unitid = t.upunit";
//System.out.println(sql);
String jsonStr = "[{@node,expanded:true}]";
try {
	Context initCtx = new InitialContext();

	DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
	Connection conn = ds.getConnection();
	Statement stmt = conn.createStatement();
	ResultSet rs = stmt.executeQuery(sql);
	while(rs.next()) {
		String nodeStr = "id:'" + (rs.getString(1)==null?"":rs.getString(1).trim()) + "',"
					+ "text:'" + (rs.getString(2)==null?"":rs.getString(2).trim()) + "',"
					+ "note:'" + (rs.getString(3)==null?"":rs.getString(3).trim()) + "',"
					+ "checked:" + (rs.getString(4)==null?"false":"true") + ","
					+ "uiProvider:'col',";
		int l = rs.getInt(5);
		if(l>0) {
			nodeStr += "children:[";
			for(int i=1;i<l;i++) {
				nodeStr += "{@node},";
			}
			nodeStr += "{@node}]";
		}
		else {
			nodeStr += "leaf:true";
		}
		jsonStr = jsonStr.replaceFirst("@node",nodeStr);
	}
	rs.close();
	stmt.close();
	conn.close();
	initCtx.close();
}
catch(Exception ex) {
	ex.printStackTrace();
}
out.print(jsonStr);
%>