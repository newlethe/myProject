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
String modelID = request.getParameter("modelID");
//guox20080511
String sql = "select zb_seqno,realname,jldw,zbno,"
			+ " (select count(zb_seqno) from sgcc_guideline_info where parentid=t.zb_seqno) as leaf,rownum"
			+ " from (select zb_seqno,realname,jldw,parentid,zbno from sgcc_guideline_info,"
			+ " (select zb_seqno as zbno from sgcc_guideline_model_detail where model_id='" + modelID + "') m"
			+ " where sgcc_guideline_info.zb_seqno=m.zbno(+) order by zb_seqno) t"
			+ " start WITH zb_seqno='d' connect by PRIOR zb_seqno=parentid";
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