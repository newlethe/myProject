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

String sql = "select zb_seqno,realname||decode(jldw,null,'','['||jldw||']'),"
			//增加ifpub指标归属属性
			+ " (select count(zb_seqno) from sgcc_guideline_info where parentid=t.zb_seqno and (ifpub<>'3' or unit_id='" + unitID + "')) as leaf,atr,rownum"
			+ " from (select zb_seqno,realname,jldw,parentid,ifpub as atr from sgcc_guideline_info where ifpub<>'3' or unit_id='" + unitID + "' order by zb_seqno) t"
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
					+ "rw:'" + (rs.getString("atr")==null?"":rs.getString("atr").trim()) + "',";
					
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
		//System.out.println(jsonStr);
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