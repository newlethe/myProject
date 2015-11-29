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
String unitID = (String)session.getAttribute(Constant.USERUNITID);

String sql = "select unitid,unitname,"
			+ " (select count(unitid) from sgcc_ini_unit where upunit=t.unitid) as leaf,rownum"
			+ " from (select unitid,unitname,upunit from sgcc_ini_unit) t"
			+ " start WITH unitid='" + unitID + "' connect by PRIOR unitid=upunit";
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
					+ "text:'" + (rs.getString(2)==null?"":rs.getString(2).trim()) + "',";
					
		int l = rs.getInt(3);
		
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