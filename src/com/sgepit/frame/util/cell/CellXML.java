package com.sgepit.frame.util.cell;

import java.io.StringReader;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;

import org.directwebremoting.WebContextFactory;
import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.db.SnUtil;

public class CellXML {

	private Props props;
	private HashMap colMap;
	private HashMap typeMap;
	private HashMap rowMap;
	private String corp = "";
	private String inx = "";
	private String date = "";
	private String keyCol = "";
	private String keyValue = "";
	HttpSession session = null;
	String userId = null;
	public CellXML() {
		props = new Props();
		colMap = props.getPropsMap("REPORT_COL");
		typeMap = props.getColTypeMap();
	}
	
	//将Document对象转换为xml字符串
	public static String toString(Document  doc,  String  encoding)  {  
		Format format = Format.getRawFormat();
		format.setEncoding(encoding);
		XMLOutputter xop = new XMLOutputter(format);
		return xop.outputString(doc);
	}
	
	//判断字符串是否可转换成数字
	public static boolean isNum(String p_str) {
		if(p_str.matches("^[-+]?\\d*[.]?\\d+([Ee][-+]\\d+)?$")) {
			return true;
		}
		else {
			return false;
		}
	}
	
	//将数据库数据转换为xml字符串
	public String db2xml(String p_xml, String p_date, String p_corp, String p_inx) {
		colMap = props.getPropsMap("REPORT_COL");
		typeMap = props.getColTypeMap();
		this.session = WebContextFactory.get().getSession();
		this.userId = (String) this.session.getAttribute(com.sgepit.frame.base.Constant.USERID);
		this.date = p_date;
		this.corp = p_corp;
		this.inx = p_inx;
		
		String xmlStr = "";
		try {
			//替换关键字
			p_xml = this.replace( p_xml );
			SAXBuilder sb = new SAXBuilder();
			Document doc = sb.build(new StringReader(p_xml));

			rowMap = new HashMap();
			String sql = this.xml2sql(doc);
			//System.out.println(sql);
			if(!sql.equals("")) {
				//填充数据
				this.sql2xml( doc, sql );
			}
			rowMap.clear();
			xmlStr = this.toString(doc,"GBK");
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		//System.out.println(toString(doc,"GBK"));
		return xmlStr;
	}

	//通过报表的行列代码生成查询语句
	private String xml2sql( Document p_doc) {
		String sql = "";
		try {
			//SAXBuilder sb = new SAXBuilder();
			//Document doc = sb.build(new StringReader(p_xml));
			Element root = p_doc.getRootElement();
			List ls = XPath.selectNodes( root, "/Workbook/Worksheet/Table/Row/Cell/Data[starts-with(text(),'table:')]");
			for (int i = 0; i < ls.size(); i++) {
				Element el = (Element) ls.get(i);
				String tabType = el.getText().split("[:]")[1];
				Element colEl = el.getParentElement();
				String colIndex = colEl.getAttributeValue("Index");
				Element rowEl = colEl.getParentElement();
				String rowIndex = rowEl.getAttributeValue("Index");
				Element wsEl = rowEl.getParentElement().getParentElement();
				String sheetName = wsEl.getAttributeValue("Name");
				
				if(!sql.equals("")) {
					sql += " union all ";
				}
				if(tabType.equals("corp")) {
					sql += this.getCorpSql(root, sheetName, rowIndex, colIndex);
				}
				else if(tabType.equals("inx")) {
					sql += this.getInxSql(root, sheetName, rowIndex, colIndex);
				}
				else if(tabType.equals("mix")) {
					sql += this.getMixSql(root, sheetName, rowIndex, colIndex);
				}
			}
			//System.out.println(sql);
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return sql;
	}
	
	private String getCorpSql(Element p_root, String p_sheetName, String p_rowInx, String p_colInx) {
		String sql = "";
		try {
			String decodeRow = "";
			String filterStr = "";
			List rowList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index>" + p_rowInx + "]/Cell[@Index='" + p_colInx + "']/Data");
			for (int r = 0; r < rowList.size(); r++) {
				Element rl = (Element)rowList.get(r);
				String rTxt = rl.getText();
				
				if(rTxt.indexOf("table:")>-1){
					break;
				}
				
				String rInx = rl.getParentElement().getParentElement().getAttributeValue("Index");
				//decodeRow += ",'" + rTxt + "','" + rInx + "'";
				rowMap.put(p_sheetName + "|" + rTxt+"|"+(p_rowInx+"/"+p_colInx), rInx);
				filterStr += ",'" + rTxt + "'";
			}
			List colList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index=" + p_rowInx + "]/Cell[@Index>'" + p_colInx + "']/Data");
			for (int c = 0; c < colList.size(); c++) {
				Element cl = (Element) colList.get(c);
				String cTxt = cl.getText();
				String cInx = cl.getParentElement().getAttributeValue("Index");
				
				if(cTxt.indexOf("table:")>-1){
					continue;
				}
				
				if(!cTxt.equals("")) {
					// tab.col/date/inx*num/sav
					String[] s = cTxt.split("[/]");
					String tabCol = (String)colMap.get(s[0].toUpperCase());
					String[] t = tabCol.split("[.]");
					String[] n = s[2].split("[*]");
					if(!sql.equals("")) {
						sql += " union all ";
					}
					sql += "select '" + p_sheetName + "' as sheetName,"
						//+ "decode(unit_id" + decodeRow +") as rowInx,"
						//注：oracle10g后的版本decode函数只支持127个参数
						+ "unit_id as rowInx,"
						+ "'" + cInx + "' as colInx,"
						+"'"+(p_rowInx+"/"+p_colInx)+"' as tabPlace,"
						+ "to_char(" + t[1] + (n.length>1?"*"+n[1]:"") + ") as value from " + t[0] 
						+ " where unit_id in (''" + filterStr + ")"
						+ " and sj_type='" + props.transDate(this.date, s[1] ) + "'"
						+ " and zb_seqno='" + (n[0].equals("X")?this.inx:n[0]) + "'"
						+ " and " + t[1] + " is not null";
				}
			}
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return sql;
	}
	
	private String getInxSql(Element p_root, String p_sheetName, String p_rowInx, String p_colInx) {
		String sql = "";
		try {
			String decodeRow = "";
			String filterStr = "";
			String decodeNum = "";
			List rowList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index>" + p_rowInx + "]/Cell[@Index='" + p_colInx + "']/Data");
			for (int r = 0; r < rowList.size(); r++) {
				Element rl = (Element)rowList.get(r);
				String rTxt = rl.getText();
				
				if(rTxt.indexOf("table:")>-1){
					break;
				}
				String rInx = rl.getParentElement().getParentElement().getAttributeValue("Index");
				//用于多指标合并填报 //指标&指标 格式
				if(rTxt.indexOf("&")>-1) {
					String[] m = rTxt.split("[&]");
					for(int i=0; i<m.length; i++) {
						String[] s = m[i].split("[*]");
						rowMap.put(p_sheetName + "|" + s[0], rInx + "@" + i);
						filterStr += ",'" + s[0] + "'";
						if(s.length>1) {
							decodeNum += ",'" + s[0] + "'," + s[1];
						}
					}
				}
				else {
					String[] s = rTxt.split("[*]");
					//decodeRow += ",'" + s[0] + "','" + rInx + "'";
					rowMap.put(p_sheetName + "|" + s[0]+"|"+(p_rowInx+"/"+p_colInx), rInx);
					filterStr += ",'" + s[0] + "'";
					if(s.length>1) {
						decodeNum += ",'" + s[0] + "'," + s[1];
					}
				}
			}
			List colList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index=" + p_rowInx + "]/Cell[@Index>'" + p_colInx + "']/Data");
			for (int c = 0; c < colList.size(); c++) {
				Element cl = (Element) colList.get(c);
				String cTxt = cl.getText();
				String cInx = cl.getParentElement().getAttributeValue("Index");
				
				if(cTxt.indexOf("table:")>-1){
					continue;
				}
				
				if(!cTxt.equals("")) {
					// tab.col/date/corp/sav
					String[] s = cTxt.split("[/]");
					String tabCol = (String)colMap.get(s[0].toUpperCase());
					String[] t = tabCol.split("[.]");
					if(!sql.equals("")) {
						sql += " union all ";
					}
					sql += "select '" + p_sheetName + "' as sheetName,"
						//+ "decode(zb_seqno" + decodeRow +") as rowInx,"
						+ "zb_seqno as rowInx,"
						+ "'" + cInx + "' as colInx,"
						+"'"+(p_rowInx+"/"+p_colInx)+"' as tabPlace,"
						+ "to_char(" + t[1] 
						+ ( (!decodeNum.equals("") && this.typeMap.get(tabCol.toUpperCase()).equals("NUMBER"))?"*decode(zb_seqno" + decodeNum + ",1)":"") + ") as value"
						+ " from " + t[0] + " where zb_seqno in (''" + filterStr + ")"
						+ " and sj_type='" + props.transDate(this.date, s[1] ) + "'"
						+ " and unit_id='" + (s[2].equals("X")?this.corp:s[2]) + "'"
						+ " and " + t[1] + " is not null";
				}
			}
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return sql;
	}
	
	private String getMixSql(Element p_root, String p_sheetName, String p_rowInx, String p_colInx) {
		String sql = "";
		try {
			String decodeRow = "";
			String filterStr = "";
			String decodeNum = "";
			List rowList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index>" + p_rowInx + "]/Cell[@Index='" + p_colInx + "']/Data");
			for (int r = 0; r < rowList.size(); r++) {
				Element rl = (Element)rowList.get(r);
				String rTxt = rl.getText();
				String rInx = rl.getParentElement().getParentElement().getAttributeValue("Index");
				
				if(rTxt.indexOf("table:")>-1){
					break;
				}
				
				//指标*系数/公司
				String[] s = rTxt.split("[/]");
				String[] n = s[0].split("[*]");
				//decodeRow += ",'" + n[0] + "/" + s[1] + "','" + rInx + "'";
				rowMap.put(p_sheetName + "|" + n[0] + "/" + s[1]+"|"+(p_rowInx+"/"+p_colInx), rInx);
				filterStr += ",'" + n[0] + "/" + s[1] + "'";
				if(n.length>1) {
					decodeNum += ",'" + n[0] + "/" + s[1] + "'," + n[1];
				}
			}
			List colList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index=" + p_rowInx + "]/Cell[@Index>'" + p_colInx + "']/Data");
			for (int c = 0; c < colList.size(); c++) {
				Element cl = (Element) colList.get(c);
				String cTxt = cl.getText();
				String cInx = cl.getParentElement().getAttributeValue("Index");
				
				if(cTxt.indexOf("table:")>-1){
					continue;
				}
				
				if(!cTxt.equals("")) {
					// tab.col/date/corp/sav
					String[] s = cTxt.split("[/]");
					String tabCol = (String)colMap.get(s[0].toUpperCase());
					String[] t = tabCol.split("[.]");
					if(!sql.equals("")) {
						sql += " union all ";
					}
					sql += "select '" + p_sheetName + "' as sheetName,"
						//+ "decode(zb_seqno||'/'||unit_id" + decodeRow +") as rowInx,"
						+ "zb_seqno||'/'||unit_id as rowInx,"
						+ "'" + cInx + "' as colInx,"
						+"'"+(p_rowInx+"/"+p_colInx)+"' as tabPlace,"
						+ "to_char(" + t[1] 
						+ ( (!decodeNum.equals("") && this.typeMap.get(tabCol.toLowerCase()).equals("NUMBER"))?"*decode(zb_seqno||'/'||unit_id" + decodeNum + ",1)":"") + ") as value"
						+ " from " + t[0] + " where zb_seqno||'/'||unit_id in (''" + filterStr + ")"
						+ " and sj_type='" + props.transDate(this.date, s[1] ) + "'"
						+ " and " + t[1] + " is not null";
				}
			}
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return sql;
	}
	
	//将查询结果转换成xml
	private void sql2xml(Document p_doc, String p_sql) {
		Element root = p_doc.getRootElement();
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			//DataSource ds = (DataSource)initCtx.lookup("java:comp/env/jdbc/LiferayPool");
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			////////////////////////////////////////////////// XML
			ResultSet rs = stmt.executeQuery(p_sql);
			
			HashMap<String,Element> sMap = new HashMap();
			HashMap<String,Element> rMap = new HashMap();
			while(rs.next()) {
				int m = -1;
				String sheetName = rs.getString("sheetName").trim();
				String rowInx = (String)rowMap.get(sheetName + "|" + rs.getString("rowInx").trim()+"|"+rs.getString("tabPlace").trim());
				//用于多指标合并填报
				if(rowInx.indexOf("@")>-1) {
					String[] s = rowInx.split("[@]");
					rowInx = s[0];
					m = Integer.parseInt(s[1]);
				}
				String colInx = rs.getString("colInx").trim();
				//用于多指标合并填报
				/*if(colInx.indexOf("@")>-1) {
					String[] s = colInx.split("[@]");
					colInx = s[0];
					m = Integer.parseInt(s[1]);
				}*/
				String value = rs.getString("value").trim();
				
				Element table = sMap.get(sheetName);
				if( table == null ) {
					table = (Element)XPath.selectSingleNode(root, "/Workbook/Worksheet[@Name='" + sheetName + "']/Table");
					sMap.put(sheetName, table);
				}

				Element row = rMap.get(sheetName+"|"+rowInx);
				if( row == null ) {
					row = (Element)XPath.selectSingleNode(root, "/Workbook/Worksheet[@Name='" + sheetName + "']/Table/Row[@Index='" + rowInx + "']");
					row.removeContent();
					rMap.put(sheetName+"|"+rowInx, row);
				}

				Element cell = new Element("Cell");
				cell.setAttribute("Index", colInx);
				row.addContent(cell);

				Element data = new Element("Data");
				cell.addContent(data);

				//通过正则表达式判断数据类型
				if(this.isNum(value) && m==-1) {
					data.setAttribute("Type","Number");
				}
				else {
					data.setAttribute("Type","String");
				}
				//////////////////////////////////////////////////
				if(m==-1) {
					data.setText(value);
				}
				else {
					String t = data.getText();
					String[] l = t.split("[/]");
					String[] s = new String[(m+1)>l.length?(m+1):l.length];
					for(int i=0;i<l.length; i++) {
						if(l[i]!=null) {
							s[i] = l[i];
						}
					}
					s[m] = value;
					String v = "";
					for(int i=0;i<s.length; i++) {
						v += "/" + (s[i]==null?"":s[i]);
					}
					if(!v.equals("")) {
						data.setText(v.substring(1));
					}
				}
			}
			//////////////////////////////////////////////////XML
			rs.close();
			stmt.close();
			conn.close();
			initCtx.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
	}
	
	//替换 日期{YYYY}{MM}{Q}、公司{CORP}、指标{INX}
	private String replace(String p_xml) {
		try {
			StringBuffer sbuf = new StringBuffer();
			Pattern p = Pattern.compile("\\{YYYY([+-]?\\d*)\\}");
			Matcher m = p.matcher(p_xml);
			while (m.find()) {
				String s1 = m.group(1);
				if(s1.equals("")) {
					s1 = "0";
				}
				m.appendReplacement( sbuf, "" + (Integer.parseInt(this.date.substring(0,4)) + (int)Double.parseDouble(s1)) );
			}
			m.appendTail(sbuf);
			p_xml = sbuf.toString();
			//扩展到日
			if(this.date.length()==8) {
				//p_xml = p_xml.replaceAll("\\{MM\\}", this.date.substring(4,6));
				sbuf = new StringBuffer();
				p = Pattern.compile("\\{MM([+-]?\\d*)\\}");
				m = p.matcher(p_xml);
				while (m.find()) {
					String s1 = m.group(1);
					if(s1.equals("")) {
						s1 = "0";
					}
					int month_t = (Integer.parseInt(this.date.substring(4,6)) + (int)Double.parseDouble(s1)) % 12;
					month_t = (month_t < 1)?(month_t + 12):month_t;
					m.appendReplacement( sbuf, "" + month_t );
				}
				m.appendTail(sbuf);
				p_xml = sbuf.toString();
				p_xml = p_xml.replaceAll("\\{DD\\}", this.date.substring(6,8));
				//p_xml = sbuf.toString();
				p_xml = p_xml.replaceAll("\\{Q\\}", this.date.substring(4,5));
				
			}
			if( p_xml.indexOf("{CORP}")>-1 || p_xml.indexOf("{INX}")>-1) {
				Context initCtx = new InitialContext();
				DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
				//DataSource ds = (DataSource)initCtx.lookup("java:comp/env/jdbc/LiferayPool");
				Connection conn = ds.getConnection();
				if(!this.corp.equals("")) {
					boolean flag = false;
					Statement stmt = conn.createStatement();
					ResultSet rs = stmt.executeQuery("select unitname from sgcc_ini_unit where unitid='" + this.corp + "'");
					if(rs.next()) {
						p_xml = p_xml.replaceAll("\\{CORP\\}", rs.getString(1));
					    flag = true;
					}else{
						rs = stmt.executeQuery("select realname from hr_man_info where userid='" + this.corp + "'");
						if(rs.next()) {
							p_xml = p_xml.replaceAll("\\{CORP\\}", rs.getString(1));
							flag = true;
						}
					}
					rs.close();
					stmt.close();
					if(!flag){
					     String sql = "select unitname from sgcc_ini_unit where unitid in (select dept_id from rock_user where userid ='"+this.corp+"')";
					     
					     List list = com.sgepit.frame.util.JdbcUtil.query(sql);
					     if(list.size()>0){
					    	 Map map = (Map) list.get(0);
					    	 p_xml = p_xml.replaceAll("\\{CORP\\}", map.get("unitname").toString());
						}else{
							rs = stmt.executeQuery("select realname from hr_man_info where userid='" + this.corp + "'");
							if(rs.next()) {
								p_xml = p_xml.replaceAll("\\{CORP\\}", rs.getString(1));
							}
						}
					}
					
					
				}
				if(!this.inx.equals("")) {
					Statement stmt = conn.createStatement();
					ResultSet rs = stmt.executeQuery("select realname from sgcc_guideline_info where zb_seqno='" + this.inx + "'");
					if(rs.next()) {
						p_xml = p_xml.replaceAll("\\{INX\\}", rs.getString(1));
					}
					rs.close();
					stmt.close();
				}
				conn.close();
				initCtx.close();
			}
			if( p_xml.indexOf("{CORPID}")>-1) {
				if(!this.corp.equals("")) {
					p_xml = p_xml.replaceAll("\\{CORPID\\}", this.corp);
				}
			}
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return p_xml;
	}

	//添加XML元素
	private void addData(Element p_root, Element p_data) {
		try{
			Element colEl = p_data.getParentElement();
			String colIndex = colEl.getAttributeValue("Index");
			Element rowEl = colEl.getParentElement();
			String rowIndex = rowEl.getAttributeValue("Index");
			Element sheetEl = rowEl.getParentElement().getParentElement();
			String sheetName = sheetEl.getAttributeValue("Name");
			//System.out.println("sheetName:"+sheetName+";rowIndex"+rowIndex+";colIndex"+colIndex+";value:"+p_data.getText());
			
			Element table = (Element)XPath.selectSingleNode(p_root, "/Workbook/Worksheet[@Name='" + sheetName + "']");
			if(table == null) {
				Element workSheet = new Element("Worksheet");
				workSheet.setAttribute("Name", sheetName);
				table = new Element("Table");
				workSheet.addContent(table);
				p_root.addContent(workSheet);
			}
			
			Element row = (Element)XPath.selectSingleNode(p_root, "/Workbook/Worksheet[@Name='" + sheetName + "']/Table/Row[@Index='" + rowIndex + "']");
			if( row == null ) {
				row = new Element("Row");
				row.setAttribute("Index", rowIndex);
				table.addContent(row);
			}
			
			Element col = (Element)XPath.selectSingleNode(p_root, "/Workbook/Worksheet[@Name='" + sheetName + "']/Table/Row[@Index='" + rowIndex + "']/Cell[@Index='" + colIndex + "']");
			if( col == null ) {
				col = new Element("Cell");
				col.setAttribute("Index", colIndex);
				row.addContent(col);
			}
			
			Element data = col.getChild("Data");
			if( data == null) {
				data = new Element("Data");
				data.setAttribute("Type","String");
				col.addContent(data);
			}
			List ls = p_data.getAttributes();
			for( int i=0; i<ls.size(); i++ ) {
				Attribute atr = (Attribute)ls.get(i);
				data.setAttribute( atr.getName(), atr.getValue() );
			}
			data.setText(p_data.getText());
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
	}

	//比较两个XML文件,找出其中的差异
	private Document differ(String p_old_xml, String p_new_xml) {
		Document newDoc = null;
		/**多表头 key=sheet+"/"+col value = null
		 * eg:
		 *    table:inx(row=7  col=9  sheet=表1)   save(row=7  col=9 sheet=表1)  save(row=7  col=11 sheet=表1)
		 *    tabel:inx(row=11 col=10 sheet=表1)   save(row=11 col=9 sheet=表1)  save(row=11 col=13 sheet=表1)
		 *    只需遍历（row>7 col=9 sheet=表1）、（row>7 col=11 sheet=表1）和（row>11 col=13 sheet=表1）
		 **/
		HashMap colMap = null;
		
		try {
			colMap = new HashMap();
			SAXBuilder sb = new SAXBuilder();
			
			Document oldDoc = sb.build(new StringReader(p_old_xml));
			Element oldRoot = oldDoc.getRootElement();
			
			newDoc = sb.build(new StringReader(p_new_xml));
			Element newRoot = newDoc.getRootElement();
			//查找所有需要保存的列(edit and read)
			List ls1 = XPath.selectNodes(newRoot, "/Workbook/Worksheet/Table/Row/Cell/Data[contains(text(),'/SAVE')]");
			
			for (int c = 0; c < ls1.size(); c++) {
				Element data = (Element) ls1.get(c);
				//String[] s = data.getText().split(":");
				Element col = data.getParentElement();
				String colInx = col.getAttributeValue("Index");
				Element row = col.getParentElement();
				String rowInx = row.getAttributeValue("Index");
				Element sheet = row.getParentElement().getParentElement();
				String sheetName = sheet.getAttributeValue("Name");
				
				//System.out.println("sheetName="+sheetName+";row="+rowInx+";col="+colInx);
				if(colMap.containsKey(sheetName+"/"+colInx)){
					continue;
				}
				//System.out.println("**********************:sheetName="+sheetName+";row="+rowInx+";col="+colInx);
				colMap.put(sheetName+"/"+colInx, null);
				
				List ls2 = XPath.selectNodes(oldRoot, "/Workbook/Worksheet[@Name='" + sheetName + "']/Table/Row[@Index>" + rowInx + "]/Cell[@Index='" + colInx + "']/Data");
				for (int k = 0; k < ls2.size(); k++) {
					Element cll = (Element)ls2.get(k);
					String val = cll.getText();
					
					String r = cll.getParentElement().getParentElement().getAttributeValue("Index");
					Element el = (Element)XPath.selectSingleNode(newRoot, "/Workbook/Worksheet[@Name='" + sheetName + "']/Table/Row[@Index='" + r + "']/Cell[@Index='" + colInx + "']/Data");
					if(el==null) {
						cll.setAttribute("editType", "delete");
						this.addData( newRoot, cll );
					}
					else if(el.getText().trim().equals(val.trim())) {
						//取数数据项/取数时间/取数指标/SAVE`保存数据项`保存时间`保存指标
						//【-------取数部分-------------】 【-------保存部分---------】
						//把取数列的值存到要保存的列
						String text = data.getText();
						if(text.endsWith("SAVE")){
							el.setAttribute("editType", "none");
						}else{
							if((el.getText().trim()).equals("")){
								el.setAttribute("editType", "none");
							}else{
								el.setAttribute("editType", "update");
							}
						}
					}
					else {
						el.setAttribute("editType", "update");
					}
				}
			}
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return newDoc;
	}
	
	//保存数据
	public String xml2db(String p_old_xml, String p_new_xml, String p_date, String p_corp, String p_inx, String p_keyCol, String p_keyValue) {

		this.session = WebContextFactory.get().getSession();
		this.userId = (String) this.session.getAttribute(com.sgepit.frame.base.Constant.USERID);
		this.date = p_date;
		this.corp = p_corp;
		this.inx = p_inx;
		this.keyCol = p_keyCol;
		this.keyValue = p_keyValue;
		
		String str = "true";
		try {
			//比较xml差异
			Document doc = this.differ(p_old_xml, p_new_xml);
			//System.out.println(this.toString(doc, "GBK"));
			Element root = doc.getRootElement();
			//System.out.println("p_old_xml"+p_old_xml);
			//System.out.println("p_new_xml"+p_new_xml);
			////////////////////
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
			//DataSource ds = (DataSource)initCtx.lookup("java:comp/env/jdbc/LiferayPool");
			Connection conn = ds.getConnection();
			//////////////////////////////////////////////////XML
			//sheet遍历
			List ls1 = XPath.selectNodes(root, "/Workbook/Worksheet/Table/Row/Cell/Data[starts-with(text(),'table:')]");
			for (int c = 0; c < ls1.size(); c++) {
				Element cll = (Element) ls1.get(c);
				String tabType = cll.getText().split("[:]")[1];
				Element col = cll.getParentElement();
				String colInx = col.getAttributeValue("Index");
				Element row = col.getParentElement();
				String rowInx = row.getAttributeValue("Index");
				Element sheet = row.getParentElement().getParentElement();
				String sheetName = sheet.getAttributeValue("Name");
				boolean flag = false;
				if(tabType.equals("corp")) {
					flag = this.savCorpXml(conn, root, sheetName, rowInx, colInx);
				}
				else if(tabType.equals("inx")) {
					flag = this.savInxXml(conn, root, sheetName, rowInx, colInx);
				}
				else if(tabType.equals("mix")) {
					flag = this.savMixXml(conn, root, sheetName, rowInx, colInx);
				}
				if(!flag) {
					if(str.equals("true")) {
						str = sheetName;
					}
					else {
						str += "," + sheetName;
					}
				}
			}
			//////////////////////////////////////////////////XML
			conn.close();
			initCtx.close();
			return str;
		}
		catch(Exception ex) {
			ex.printStackTrace();
			return "false";
		}
	}
	/**
	 * 生成记录跟踪sql语句
	 * @param zbId 指标
	 * @param unitId 单位
	 * @param sjType 时间
	 * @param afterValue 修改后值
	 * @param tableName 表名
	 * @param colName 字段名
	 * @param colType 数据项类型
	 * @param eType 更新类型
	 * @return
	 */

	private String getInsertUpdateRecord(String zbId,String unitId,String sjType,String afterValue,String tableName,String colName,String colType,String eType){
		String sql1 = "";
/*		try {
			String id = SnUtil.getNewID();
			
			String oldValSql =  "(select max(t." + colName + ") from " + tableName + " t where t.unit_id = '" + unitId + "' and "
								+"t.zb_seqno = '" + zbId + "' and "
					            +"t.sj_type = '" + sjType + "')";
			String versionSql = "(select nvl(max(version),0)+1 from ver_update_record r where "
								+"r.unit_id = '" + unitId + "' and "
								+"r.zb_seqno = '" + zbId + "' and "
								+"r.sj_type = '" + sjType + "' and "
								+"r.col_type = '" + colType + "')";
			
			if(eType==null||(!(eType.equals("none")))){
				sql1="insert into ver_update_record v "
					+"(v.id,v.zb_seqno,v.unit_id,v.sj_type,v.before_update_value,v.col_name,v.update_date,v.table_name,v.after_update_value,v.version,v.col_type,v.userid) "
					+" select '" + id + "','" + zbId + "','" + unitId + "','" + sjType + "',"+oldValSql+",'" + colName + "',"
					+"sysdate,'" + tableName + "','"+ afterValue +"',"+versionSql+",'"+colType+"','" + userId + "' from dual where" +
					" not exists (select 1 from dual where "+oldValSql+" = '"+afterValue+"')";
			}
			//System.out.println(sql1);
		}catch(Exception ex) {
			ex.printStackTrace();
		}
*/		return 	sql1;
	}
	
	private boolean savCorpXml(Connection p_conn, Element p_root, String p_sheetName, String p_rowInx, String p_colInx) {
		boolean flag = false;
		try {
			Statement stmt = p_conn.createStatement();
			List colList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index='" + p_rowInx + "']/Cell[@Index>'" + p_colInx + "']/Data[contains(text(),'/SAVE')]");
			for(int c=0; c<colList.size(); c++) {
				Element cl = (Element) colList.get(c);
				//取数数据项/取数时间/取数指标/SAVE`保存数据项`保存时间`保存指标
				String cInx = cl.getParentElement().getAttributeValue("Index");
				String[] s = cl.getText().split("[/]");
				if(!(s[3].equals("SAVE"))){
					String[] ss = s[3].split("[`]");
					s[0] = ss[1];//保存数据项
					s[1] = ss[2];//保存时间
					s[2] = ss[3];//保存指标
				}
				//时间
				String savDate = props.transDate( this.date, s[1] );
				String[] tabCol = ((String)colMap.get(s[0].toUpperCase())).split("[.]");
				//has "DETAIL_ID" column 判断是否有DETAIL_ID字段
				boolean d = typeMap.get(tabCol[0]+".DETAIL_ID")==null;
				boolean k = typeMap.get(tabCol[0]+"."+this.keyCol.toUpperCase())==null;
				
				String[] n = s[2].split("[*]");
				//row遍历
				List rowList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index>'" + p_rowInx + "']/Cell[@Index='" + cInx + "']/Data");
				for(int r=0; r<rowList.size(); r++) {
					Element rl = (Element) rowList.get(r);
					String value = rl.getText();
					String editType = rl.getAttributeValue("editType");
					String rInx = rl.getParentElement().getParentElement().getAttributeValue("Index");
					Element el = (Element)XPath.selectSingleNode( p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index='" + rInx + "']/Cell[@Index='" + p_colInx + "']/Data" );
					if(el==null) {
						continue;
					}else if((el.getText().indexOf("table:"))>-1){
						break;
					}else if((el.getText()).equals("")){
						continue;
					}
					String sql = "";
					String sql1 = "";

					
					if(editType==null || editType.equals("update") || editType.equals("copy")) {
						//tab.col/date/ut or it/edit 

						sql1 = getInsertUpdateRecord((s[2].equals("X")?this.inx:s[2]),el.getText(),savDate,value+(n.length>1?"/"+n[1]:""),tabCol[0],tabCol[1],s[0].toUpperCase(),editType);
						sql = "MERGE into " + tabCol[0] + " tab1 USING"
							+ " (select '" + this.keyValue + "' as mainID,"
							+ "'" + el.getText() + "' as unit_id,"
							+ "'" + (s[2].equals("X")?this.inx:s[2]) + "' as zb_seqno,"
							//+ "'" + this.date + "' as sj_type,"savDate
							+ "'" + savDate + "' as sj_type,"
							+ "'" + value + "'" + (n.length>1?"/"+n[1]:"") + " as value from dual) tab2"
							+ " on (tab1.unit_id=tab2.unit_id and tab1.zb_seqno=tab2.zb_seqno and tab1.sj_type=tab2.sj_type)"
							+ " when matched then update set " + tabCol[1] + "=tab2.value where not exists (select 1 from dual where tab1."+tabCol[1]+" = tab2.value)"
							+ " when not matched then insert (" 
							//has DETAIL_ID
							+(d?"":"detail_id,")
							+ (k?"":(this.keyCol+",")) + "unit_id,zb_seqno,sj_type," + tabCol[1] + ")"
							+ " values ("
							//has DETAIL_ID
							+ (d?"": ("'" + SnUtil.getNewID() + "',") )
							+ (k?"":"tab2.mainID,")+"tab2.unit_id,tab2.zb_seqno,tab2.sj_type,tab2.value)";
					}
					else if(editType.equals("delete")) {

						sql1 = getInsertUpdateRecord((s[2].equals("X")?this.inx:s[2]),el.getText(),savDate,"",tabCol[0],tabCol[1],s[0].toUpperCase(),editType);
						sql = "update " + tabCol[0] + " set " + tabCol[1] + "=''"
							//+ " where sj_type='" + this.date + "'"
							+ " where sj_type='" + savDate + "'"
							+ " and unit_id='" + el.getText() + "'"
							+ " and zb_seqno='" + (s[2].equals("X")?this.inx:s[2]) + "'";
					}
					if(!sql1.equals("")) {
						//System.out.println(sql);
						stmt.addBatch(sql1);
					}
					if(!sql.equals("")) {
						//System.out.println(sql);
						stmt.addBatch(sql);
					}
				}
			}
			stmt.executeBatch();
			stmt.close();
			flag = true;
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return flag;
	}
	
	private boolean savInxXml(Connection p_conn, Element p_root, String p_sheetName, String p_rowInx, String p_colInx) {
		boolean flag = false;
		try {
			Statement stmt = p_conn.createStatement();
			List colList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index='" + p_rowInx + "']/Cell[@Index>'" + p_colInx + "']/Data[contains(text(),'/SAVE')]");
			for(int c=0; c<colList.size(); c++) {
				Element cl = (Element) colList.get(c);
				//取数数据项/取数时间/取数单位/SAVE`保存数据项`保存时间`保存单位
				String cInx = cl.getParentElement().getAttributeValue("Index");
				String[] s = cl.getText().split("[/]"); 
				if(!(s[3].equals("SAVE"))){
					String[] ss = s[3].split("[`]");
					s[0] = ss[1];//保存数据项
					s[1] = ss[2];//保存时间
					s[2] = ss[3];//保存单位
				}
				//时间
				String savDate = props.transDate( this.date, s[1] );
				
				String t = (String)colMap.get(s[0].toUpperCase());
				String[] tabCol = t.split("[.]");
				
				
				//has "DETAIL_ID" column 判断是否有DETAIL_ID字段
				boolean d = typeMap.get(tabCol[0]+".DETAIL_ID")==null;
				boolean k = typeMap.get(tabCol[0]+"."+this.keyCol.toUpperCase())==null;
				//字段类型
				String colType = (String)this.typeMap.get(t.toUpperCase());
				//row遍历
				List rowList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index>'" + p_rowInx + "']/Cell[@Index='" + cInx + "']/Data");
				for(int r=0; r<rowList.size(); r++) {
					Element rl = (Element) rowList.get(r);
					//String value = rl.getText();
					String editType = rl.getAttributeValue("editType");
					String rInx = rl.getParentElement().getParentElement().getAttributeValue("Index");
					Element el = (Element)XPath.selectSingleNode( p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index='" + rInx + "']/Cell[@Index='" + p_colInx + "']/Data" );
					if(el==null) {
						continue;
					}else if((el.getText().indexOf("table:"))>-1){
						break;
					}else if((el.getText()).equals("")){
						continue;
					}
					//指标&指标&指标
					String[] m = el.getText().split("[&]");
					//数值/数值/数值
					String[] v = rl.getText().split("/");
					for(int i=0;i<m.length;i++) {
						String[] n = m[i].split("[*]");
						//System.out.println(tabCol[1]+","+n[0]+","+editType);
						/*if(editType!=null && editType.equals("none")){
							editType = cellDataFromDB(p_conn, savDate, tabCol, colType, editType, n, s[2].equals("X")?this.corp:s[2], n[0]);
						}*/
						
						String sql = "";
						String sql1 = "";
						//System.out.println(tabCol[1]+","+n[0]+","+editType);
						if(editType==null || editType.equals("update") || editType.equals("copy")) {
							//tab.col/date/ut or it/edit 

							sql1 = getInsertUpdateRecord(n[0],(s[2].equals("X")?this.corp:s[2]),savDate,v[i]+((colType.equals("NUMBER")&&n.length>1)?"/"+n[1]:""),tabCol[0],tabCol[1],s[0].toUpperCase(),editType);
							sql = "MERGE into " + tabCol[0] + " tab1 USING"
								+ " (select '" + this.keyValue + "' as mainID,"
								+ "'" + (s[2].equals("X")?this.corp:s[2]) + "' as unit_id,"
								+ "'" + n[0] + "' as zb_seqno,"
								//+ "'" + this.date + "' as sj_type,"
								+ "'" + savDate + "' as sj_type,"
								+ "'" + v[i] + "'" + ( (colType.equals("NUMBER")&&n.length>1)?"/"+n[1]:"") + " as value from dual) tab2"
								+ " on (tab1.unit_id=tab2.unit_id and tab1.zb_seqno=tab2.zb_seqno and tab1.sj_type=tab2.sj_type)"
								+ " when matched then update set " + tabCol[1] + "=tab2.value  where not exists (select 1 from dual where tab1."+tabCol[1]+" = tab2.value)"
								+ " when not matched then insert ("
								//has DETAIL_ID
								+(d?"":"detail_id,")
								+ (k?"":(this.keyCol+",")) + "unit_id,zb_seqno,sj_type," + tabCol[1] + ")"
								+ " values ("
								//has DETAIL_ID
								+ (d?"": ("'" + SnUtil.getNewID() + "',") )
								+ (k?"":"tab2.mainID,")+"tab2.unit_id,tab2.zb_seqno,tab2.sj_type,tab2.value)";
						}
						else if(editType.equals("delete")) {

							sql1 = getInsertUpdateRecord(n[0],(s[2].equals("X")?this.corp:s[2]),savDate,"",tabCol[0],tabCol[1],s[0].toUpperCase(),editType);
							sql = "update " + tabCol[0] + " set " + tabCol[1] + "=''"
								//+ " where sj_type='" + this.date + "'"
								+ " where sj_type='" + savDate + "'"
								+ " and unit_id='" + (s[2].equals("X")?this.corp:s[2]) + "'"
								+ " and zb_seqno='" + n[0] + "'";
						}
						if(!sql1.equals("")) {
							//System.out.println(sql1+";");
							stmt.addBatch(sql1);
						}
						if(!sql.equals("")) {
							//System.out.println(sql);
							stmt.addBatch(sql);
						}
					}
				}
			}
			stmt.executeBatch();
			stmt.close();
			flag = true;
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return flag;
	}
	
	private boolean savMixXml(Connection p_conn, Element p_root, String p_sheetName, String p_rowInx, String p_colInx) {
		boolean flag = false;
		try {
			Statement stmt = p_conn.createStatement();
			List colList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index='" + p_rowInx + "']/Cell[@Index>'" + p_colInx + "']/Data[contains(text(),'/SAVE')]");
			for(int c=0; c<colList.size(); c++) {
				Element cl = (Element) colList.get(c);
				//取数数据项/取数时间/X/SAVE`保存数据项`保存时间`X
				String cInx = cl.getParentElement().getAttributeValue("Index");
				String[] s = cl.getText().split("[/]");
				if(!(s[3].equals("SAVE"))){
					String[] ss = s[3].split("[`]");
					s[0] = ss[1];//保存数据项
					s[1] = ss[2];//保存时间
				}
				//时间
				String savDate = props.transDate( this.date, s[1] );
				String t = (String)colMap.get(s[0].toUpperCase());
				String[] tabCol = t.split("[.]");
				//has "DETAIL_ID" column 判断是否有DETAIL_ID字段
				boolean d = typeMap.get(tabCol[0]+".DETAIL_ID")==null;
				boolean k = typeMap.get(tabCol[0]+"."+this.keyCol.toUpperCase())==null;
				
				//字段类型
				String colType = (String)this.typeMap.get(t.toUpperCase());
				//row遍历
				List rowList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index>'" + p_rowInx + "']/Cell[@Index='" + cInx + "']/Data");
				for(int r=0; r<rowList.size(); r++) {
					Element rl = (Element) rowList.get(r);
					String value = rl.getText();
					String editType = rl.getAttributeValue("editType");
					String rInx = rl.getParentElement().getParentElement().getAttributeValue("Index");
					Element el = (Element)XPath.selectSingleNode( p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index='" + rInx + "']/Cell[@Index='" + p_colInx + "']/Data" );
					if(el==null) {
						continue;
					}else if((el.getText().indexOf("table:"))>-1){
						break;
					}else if((el.getText()).equals("")){
						continue;
					}
					String[] m = el.getText().split("[/]");
					String[] n = m[0].split("[*]");
					String sql = "";
					String sql1 = "";
					
					if(editType==null || editType.equals("update") || editType.equals("copy")) {
						//tab.col/date/ut or it/edit 

						sql1 = getInsertUpdateRecord(n[0],m[1],savDate,value+((colType.equals("NUMBER")&&n.length>1)?"/"+n[1]:""),tabCol[0],tabCol[1],s[0].toUpperCase(),editType);
						sql = "MERGE into " + tabCol[0] + " tab1 USING"
							+ " (select '" + this.keyValue + "' as mainID,"
							+ "'" + m[1] + "' as unit_id,"
							+ "'" + n[0] + "' as zb_seqno,"
							//+ "'" + this.date + "' as sj_type,"
							+ "'" + savDate + "' as sj_type,"
							+ "'" + value + "'" + ( (colType.equals("NUMBER")&&n.length>1)?"/"+n[1]:"") + " as value from dual) tab2"
							+ " on (tab1.unit_id=tab2.unit_id and tab1.zb_seqno=tab2.zb_seqno and tab1.sj_type=tab2.sj_type)"
							+ " when matched then update set " + tabCol[1] + "=tab2.value  where not exists (select 1 from dual where tab1."+tabCol[1]+" = tab2.value)"
							+ " when not matched then insert (" 
							//has DETAIL_ID
							+(d?"":"detail_id,")
							+ (k?"":(this.keyCol+",")) + "unit_id,zb_seqno,sj_type," + tabCol[1] + ")"
							+ " values ("
							//has DETAIL_ID
							+ (d?"": ("'" + SnUtil.getNewID() + "',") )
							+ (k?"":"tab2.mainID,")+"tab2.unit_id,tab2.zb_seqno,tab2.sj_type,tab2.value)";
					}
					else if(editType.equals("delete")) {

						sql1 = getInsertUpdateRecord(n[0],m[1],savDate,"",tabCol[0],tabCol[1],s[0].toUpperCase(),editType);
						sql = "update " + tabCol[0] + " set " + tabCol[1] + "=''"
							//+ " where sj_type='" + this.date + "'"
							+ " where sj_type='" + savDate + "'"
							+ " and unit_id='" + m[1] + "'"
							+ " and zb_seqno='" + n[0] + "'";
					}
					if(!sql1.equals("")) {
						//System.out.println(sql1+";");
						stmt.addBatch(sql1);
					}
					if(!sql.equals("")) {
						//System.out.println(sql);
						stmt.addBatch(sql);
					}
				}
			}
			stmt.executeBatch();
			stmt.close();
			flag = true;
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return flag;
	}
	
	
	/**
	 * 验证 当前单元格对应的数据库中的数据 是否 与通过公式计算得出并显示在cell表中的数据相同，如果不同则设置editType为“update”，如果库中无数据则设置为null
	 * @param p_conn
	 * @param savDate
	 * @param tabCol
	 * @param colType
	 * @param editType
	 * @param n
	 * @param unitId 
	 * @param zbSeqno 
	 * @return
	 * @throws SQLException
	 */
	private String cellDataFromDB(Connection p_conn, String savDate, String[] tabCol, String colType, String editType, String[] n, String unitId, String zbSeqno) throws SQLException {
		Statement stmtFromDB = p_conn.createStatement();
		String dataFromDB = "select * from "+tabCol[0]+" where sj_type= '"+savDate +"' and unit_id = '"+ unitId+"' and zb_seqno = '"+zbSeqno+"'";
		//System.out.println(dataFromDB);
		ResultSet rsFromDB = stmtFromDB.executeQuery(dataFromDB);
		if (!rsFromDB.next()) {
			editType = null;
		}
		else{
			if (colType.equals("NUMBER")) {
				if(!((n.length>1)?"/"+n[1]:"").equals(rsFromDB.getBigDecimal(tabCol[1]))){
					editType = "update";
				}
			}
		}
		rsFromDB.close();
		stmtFromDB.close();
		return editType;
	}
	/**
	 * 保存cell报表的历史版本
	 * @param p_type 报表类型
	 * @param p_unit 报表使用单位
	 * @param p_date 报表使用时间
	 * @param p_content 报表大对象字符串
	 * @return
	 */
	public boolean saveHistoryToDb(String p_type, String p_unit,String p_date, String p_content){
		boolean flag = false;
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			Connection conn = ds.getConnection();
			PreparedStatement pstmt = conn.prepareStatement("insert into VER_CELL_HISTORY (ID,CELL_TYPE,UNIT_ID,SJ_TYPE,SAVE_DATE,USER_ID,VERSION,CONTENT) values (?,?,?,?,sysdate,?,(select nvl(max(version),0)+1 from ver_cell_history h where h.cell_type='"+p_type+"' and h.unit_id='"+p_unit+"' and h.sj_type='"+p_date+"'),?)");
			String id = SnUtil.getNewID();
			pstmt.setString(1, id);
			pstmt.setString(2, p_type);
			pstmt.setString(3, p_unit);
			pstmt.setString(4, p_date);
			pstmt.setString(5, userId);
			pstmt.setBytes(6, p_content.getBytes());
			pstmt.execute();
			pstmt.close();
			conn.close();
			initCtx.close();
			flag = true;
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}		
		return flag;	
	}
	/**
	 * 获取历史版本
	 * @param p_type 报表类型
	 * @param p_unit 报表使用单位
	 * @param p_date 报表使用时间
	 * @param version 报表版本号
	 * @return
	 */
	public String getCellHistoryContent(String p_type, String p_unit,String p_date, int version) {
		String ctx = "";
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			//DataSource ds = (DataSource)initCtx.lookup("java:comp/env/jdbc/LiferayPool");
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			String sql = "select content from ver_cell_history where cell_type='" + p_type + "' and unit_id='"+p_unit+"' and sj_type='"+p_date+"' and version='"+version+"'";
//			System.out.println("sql:"+sql);
			ResultSet rs = stmt.executeQuery(sql);
			if(rs.next()) {
				Blob blob = rs.getBlob(1);
				ctx = new String(blob.getBytes(1, (int)blob.length()));
			}
			rs.close();
			stmt.close();
			conn.close();
			initCtx.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return ctx;
	}
	/**
	 * 获取历史版本最大版本号
	 * @param p_type 报表类型
	 * @param p_unit 报表使用单位
	 * @param p_date 报表使用时间
	 * @return
	 */
	public int getMaxVersion(String p_type, String p_unit,String p_date){
		int ver = 0;
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			//DataSource ds = (DataSource)initCtx.lookup("java:comp/env/jdbc/LiferayPool");
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			String sql = "select nvl(max(version),0) from ver_cell_history where cell_type='" + p_type + "' and unit_id='"+p_unit+"' and sj_type='"+p_date+"'";
//			System.out.println("sql:"+sql);
			ResultSet rs = stmt.executeQuery(sql);
			if(rs.next()) {
				ver = rs.getInt(1);
			}
			rs.close();
			stmt.close();
			conn.close();
			initCtx.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return ver;
	}
	/**
	 * 根据历史版本号查询记录编号
	 * @param p_type
	 * @param p_unit
	 * @param p_date
	 * @param version
	 * @return
	 */
	public int searchVersionNo(String p_type, String p_unit,String p_date,int version){
		int ver = 0;
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			//DataSource ds = (DataSource)initCtx.lookup("java:comp/env/jdbc/LiferayPool");
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			String sql = "select count(id) from ver_cell_history where cell_type='" + p_type + "' and unit_id='"+p_unit+"' and sj_type='"+p_date+"' and version='"+version+"'";
//			System.out.println("sql:"+sql);
			ResultSet rs = stmt.executeQuery(sql);
			if(rs.next()) {
				ver = rs.getInt(1);
			}
			rs.close();
			stmt.close();
			conn.close();
			initCtx.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return ver;
	}
	/**
	 * 删除历史版本
	 * @param p_type
	 * @param p_unit
	 * @param p_date
	 * @param version
	 * @return
	 */
	public boolean deleteHistoryContent(String p_type, String p_unit,String p_date,int version){
		boolean flag = false;
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			//DataSource ds = (DataSource)initCtx.lookup("java:comp/env/jdbc/LiferayPool");
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			String sql = "delete ver_cell_history where cell_type='" + p_type + "' and unit_id='"+p_unit+"' and sj_type='"+p_date+"' and version='"+version+"'";
//			System.out.println("sql:"+sql);
			stmt.execute(sql);
			stmt.close();
			conn.close();
			initCtx.close();
			flag = true;
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return flag;
	}
	/**
	 * 获取版本修改人和修改日期数组
	 * @param p_type
	 * @param p_unit
	 * @param p_date
	 * @param version
	 * @return
	 */
	public String[] selectHistoryInfor(String p_type, String p_unit,String p_date, int version){
		String[] str = {"",""};
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			//DataSource ds = (DataSource)initCtx.lookup("java:comp/env/jdbc/LiferayPool");
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			String sql = "select u.realname,to_char(ver.save_date,'yyyy-mm-dd hh24:mi:ss') from ver_cell_history ver,rock_user u where ver.user_id=u.userid and ver.cell_type='" + p_type + "' and ver.unit_id='"+p_unit+"' and ver.sj_type='"+p_date+"' and ver.version='"+version+"'";
//			System.out.println("sql:"+sql);
			ResultSet rs = stmt.executeQuery(sql);
			if(rs.next()) {
				str[0] = rs.getString(1);
				str[1] = rs.getString(2);
			}
			
			rs.close();
			stmt.close();
			conn.close();
			initCtx.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
//		System.out.println("str:"+str);
		return str;
	}
	
}