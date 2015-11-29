package com.sgepit.treeprocess;

import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.XMLUtil;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jdom.Document;
import org.jdom.Element;

public class component extends HttpServlet
{
  private static final long serialVersionUID = 1L;

  public synchronized void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException
  {
    String param;
    String treeid;
    String nodeid;
    String params;
    request.setCharacterEncoding("gb2312");

    ServletInputStream stream = request.getInputStream();
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    byte[] buffer = new byte[1024];
    int bytesRead = 0;
    while ((bytesRead = stream.read(buffer, 0, 1024)) != -1)
      baos.write(buffer, 0, bytesRead);

    byte[] b = baos.toByteArray();
    String xmlStr = new String(b);

    String rtn = "";
    String event = request.getParameter("event");
    if (event.equalsIgnoreCase("getSubNodes")) {
      param = xmlStr;
      treeid = null; nodeid = null; params = null; String params1 = null; String params2 = null;
      int lvl = 0;
      if (param != null) {
        params1 = param.split("~")[0];
        params2 = param.split("~")[1];
        treeid = param.split("~")[2];
        String levelcode = param.split("~")[3];
        nodeid = levelcode.substring(1);
        lvl = Integer.parseInt(param.split("~")[4]);
        rtn = getNodesXML(treeid, nodeid, false, params1, params2, lvl);
      }
    } else if (event.equalsIgnoreCase("loadNode")) {
      param = xmlStr;
      treeid = null; nodeid = null; params = null;
      int lvl = 0;
      if (param != null) {
        params = param.split(":")[0];
        treeid = param.split(":")[1];
        nodeid = param.split(":")[2];
        lvl = Integer.parseInt(param.split(":")[3]);
        rtn = getNodesXML(treeid, nodeid, true, params, params, lvl);
      }
    } else if (event.equalsIgnoreCase("deleteNode")) {
      param = xmlStr;
      treeid = null; nodeid = null;
      if (param != null) {
        treeid = param.split(":")[0];
        nodeid = param.split(":")[1];
        rtn = deleteNode(treeid, nodeid);
      }
    }
    response.setContentType("text/xml;charset=gb2312;");
    response.getWriter().write(rtn);
  }

  public String deleteNode(String treeid, String nodeid) {
    String rtn = "false";
    String sql = "update tree_node set enabled = 'N' where treeid = '" + treeid + "' and " + 
      " id = '" + nodeid + "'";
    int rowcount = JdbcUtil.update(sql);
    if (rowcount == 1)
      rtn = "true";

    return rtn;
  }

  public synchronized String getNodesXML(String treeid, String nodeid, boolean singalNode, String params1, String params2, int lvl) {
    boolean defaulttable = true;
    String col_id = null; String col_name = null; String frm = ""; String url = ""; String table = null; String where = null; String order = null; String nid = null;
    String col_id1 = null; String col_name1 = null; String frm1 = ""; String url1 = ""; String table1 = null; String where1 = null; String order1 = null; String nid1 = null;
	String parent_id = null;
    if ((params1 != null) && (!(params1.equals("")))) {
      String[] arr = params1.split(";");
      col_id = arr[0];
      col_name = arr[1];
      frm = arr[2];
      url = arr[3];
      table = arr[4];
      if (arr.length > 5)
        where = arr[5];
      else
        where = "1=1";

      if (arr.length > 6)
        order = arr[6];
      else
        order = col_id;

      if (arr.length > 7)
        nid = arr[7];
      else
        nid = col_id;

      if (arr.length > 8)
          parent_id = arr[8];
      
      defaulttable = false;
    }
    if ((params2 != null) && (!(params2.equals("")))) {
      String[] arr1 = params2.split(";");
      col_id1 = arr1[0];
      col_name1 = arr1[1];
      frm1 = arr1[2];
      url1 = arr1[3];
      table1 = arr1[4];
      if (arr1.length > 5)
        where1 = arr1[5];
      else
        where1 = "1=1";

      if (arr1.length > 6)
        order1 = arr1[6];
      else
        order1 = col_id1;

      if (arr1.length > 7)
        nid1 = arr1[7];
      else
        nid1 = col_id1;
      if (arr1.length > 8)
          parent_id = arr1[8];
    }

    String sql = "";
    if (singalNode) {
      if (defaulttable)
        sql = "select id, name, parent_id, frametag, url, id nid from tree_node where treeid = '" + treeid + "' and " + 
          " id = '" + nodeid + "'";
      else
        sql = "select " + col_id + " id, " + col_name + " name, '' parent_id, '" + frm + "' frametag, '" + url + "' url, " + nid + " nid from " + table + " where " + 
          col_id + " = '" + nodeid + "'";

    }
    else if (defaulttable) {
      sql = "select id, name, parent_id, frametag, url, id nid from tree_node where treeid = '" + treeid + "' and " + 
        " length(id) <= decode(nvl(length('" + nodeid + "'), 0), 0, 3, length('" + nodeid + "') + 4)" + 
        " and id like '" + nodeid + "%' and length(id) > nvl(length('" + nodeid + "'), 0)" + 
        " and enabled = 'Y'" + 
        " order by id";
    } else {
      where = where.replaceAll(":parent", "'" + nodeid + "'");
/*      where1 = where1.replaceAll(":parent", "t1." + col_id1);
      sql = "select " + col_id + " id, " + col_name + " name, '' parent_id, '" + frm + "' frametag, '" + url + "' url, " + nid + " nid, " + (lvl + 1) + " lvl, " + 
        " 1 if_plus, '" + nodeid + "' parentid from " + table + " t1 where " + 
        col_id + " like '" + nodeid + "%' and " + 
        " (" + where + ") " + 
        " order by " + order;*/
		String where2 = "1=1";
		String joinPart = " and ";
		String where3 = "";
		if(!nodeid.equals("")){
			where2 = col_id + " like '" + nodeid + "%' ";
			if(where.toUpperCase().trim().startsWith("OR")){
				joinPart = " or ";
			}
		}
		if(where.toUpperCase().trim().startsWith("OR")){
			where3 = where.toUpperCase().replaceFirst("OR", "");
			where = " where " + where3;
		}else if(where.toUpperCase().trim().startsWith("AND")){
			where3 = where.toUpperCase().replaceFirst("AND", "");
			where = "where " + col_id + " like '%" + nodeid + "%' and " + " (" + where + ") ";
		}else{
			where = "where " + col_id + " like '%" + nodeid + "%' and " + " (" + where + ") ";
		}
		String childCount = "1";
		if(parent_id!=null)
			childCount = " (select count("+col_id+") from "+table+" where "+parent_id+" = t1."+col_id+") ";
		sql = "select " + col_id + " id, " + col_name + " name, '' parent_id, '" + frm + "' frametag, '" + url + "' url, " + nid + " nid, " + (lvl + 1) + " lvl, " + childCount + " if_plus, '" + nodeid + "' parentid from " + table + " t1 " +
			where + " order by " + order;
    }

    System.out.println("Tree's sql:" + sql);
    List li = JdbcUtil.query(sql);
    Element tme = null;
    Document doc = new Document();
    Element te = new Element("rowsets");
    doc.addContent(te);
    Element re = te;
    te = new Element("rowset");
    re.addContent(te);
    te.setAttribute("name", treeid);
    re = te;
    int i = 0;
    for (; i < li.size(); ++i) {
      Map m = (Map)li.get(i);
      te = new Element("row");
      te.setAttribute("num", String.valueOf(i));
      tme = new Element("ID");
      tme.setText(m.get("ID").toString());
      te.addContent(tme);
      tme = new Element("NAME");
      tme.setText(m.get("NAME").toString());
      te.addContent(tme);
      tme = new Element("PARENT_ID");
      tme.setText(m.get("PARENT_ID")==null?"":m.get("PARENT_ID").toString());
      te.addContent(tme);
      tme = new Element("LEVEL_CODE");
      tme.setText("0".concat(m.get("ID").toString()));
      te.addContent(tme);
      tme = new Element("FRAMETAG");
      tme.setText(m.get("FRAMETAG").toString());
      te.addContent(tme);
      tme = new Element("URL");
      tme.setText(m.get("URL").toString());
      te.addContent(tme);
      tme = new Element("NID");
      tme.setText(m.get("NID").toString());
      te.addContent(tme);
      tme = new Element("LVL");
      tme.setText(m.get("LVL").toString());
      te.addContent(tme);
      tme = new Element("IF_PLUS");
      tme.setText(m.get("IF_PLUS").toString());
      te.addContent(tme);
      tme = new Element("PARENTID");
      tme.setText(m.get("PARENTID")==null?"":m.get("PARENTID").toString());
      te.addContent(tme);
      re.addContent(te);
    }
    if (i == 0) {
      te = new Element("row");
      te.setAttribute("num", String.valueOf(1));
      tme = new Element("ID");
      tme.setText("-1");
      te.addContent(tme);
      tme = new Element("NAME");
      tme.setText("请添加根节点");
      te.addContent(tme);
      tme = new Element("PARENT_ID");
      tme.setText("");
      te.addContent(tme);
      tme = new Element("LEVEL_CODE");
      tme.setText("00");
      te.addContent(tme);
      tme = new Element("FRAMETAG");
      tme.setText("");
      te.addContent(tme);
      tme = new Element("URL");
      tme.setText("");
      te.addContent(tme);
      tme = new Element("NID");
      tme.setText("-1");
      te.addContent(tme);
      tme = new Element("LVL");
      tme.setText("1");
      te.addContent(tme);
      tme = new Element("IF_PLUS");
      tme.setText("0");
      te.addContent(tme);
      tme = new Element("PARENTID");
      tme.setText("");
      te.addContent(tme);
      re.addContent(te);
    }
    return XMLUtil.getXMLString(doc.getRootElement().getChild("rowset"));
  }

  public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
  {
    doGet(request, response);
  }
}