package com.sgepit.frame.util.cell;

import java.io.StringReader;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;
import org.jdom.xpath.XPath;

import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.db.SnUtil;


public class CellXMLComm {

	private Props props;
	private HashMap colMap;
	private HashMap typeMap;
	private HashMap rowMap;
	private String corp = "";
	private String inx = "";
	private String userid = "";
	private String date = "";
	private String keyCol = "";
	private String keyValue = "";
	private String report_code = "";
	private String period_flag = "";
	private String report_flag = "";

	public CellXMLComm() {
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
	public String db2xml(String p_xml, String p_date, String p_corp, String p_inx,String p_userid) {
		this.date = p_date;
		this.corp = p_corp;
		this.inx = p_inx;
		this.userid = p_userid;
		
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
	
	//将数据库数据转换为xml字符串(通用)
	public String db2xmlComm(String p_xml, String p_date, String p_corp, String p_inx,String p_userid,String p_report_code,String p_period_flag,String p_report_flag) {
		this.date = p_date;
		this.corp = p_corp;
		this.inx = p_inx;
		this.userid = p_userid;
		this.report_code = p_report_code;
		this.period_flag = p_period_flag;
		this.report_flag = p_report_flag;
		
		String xmlStr = "";
		try {
			//替换关键字
			p_xml = this.replace( p_xml );
			SAXBuilder sb = new SAXBuilder();
			Document doc = sb.build(new StringReader(p_xml));
			
			rowMap = new HashMap();
			String sql = this.xml2sqlComm(doc);
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
	
	//通过报表的行列代码生成查询语句（通用）
	private String xml2sqlComm( Document p_doc) {
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
					sql += this.getCorpSqlComm(root, sheetName, rowIndex, colIndex);
				}
				else if(tabType.equals("inx")) {
					sql += this.getInxSqlComm(root, sheetName, rowIndex, colIndex);
				}
				else if(tabType.equals("mix")) {
					sql += this.getMixSqlComm(root, sheetName, rowIndex, colIndex);
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
				String rInx = rl.getParentElement().getParentElement().getAttributeValue("Index");
				//decodeRow += ",'" + rTxt + "','" + rInx + "'";
				rowMap.put(p_sheetName + "|" + rTxt, rInx);
				filterStr += ",'" + rTxt + "'";
			}
			List colList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index=" + p_rowInx + "]/Cell[@Index>'" + p_colInx + "']/Data");
			for (int c = 0; c < colList.size(); c++) {
				Element cl = (Element) colList.get(c);
				String cTxt = cl.getText();
				String cInx = cl.getParentElement().getAttributeValue("Index");
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
	
	private String getCorpSqlComm(Element p_root, String p_sheetName, String p_rowInx, String p_colInx) {
		String sql = "";
		try {
			String decodeRow = "";
			String filterStr = "";
			List rowList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index>" + p_rowInx + "]/Cell[@Index='" + p_colInx + "']/Data");
			for (int r = 0; r < rowList.size(); r++) {
				Element rl = (Element)rowList.get(r);
				String rTxt = rl.getText();
				String rInx = rl.getParentElement().getParentElement().getAttributeValue("Index");
				//decodeRow += ",'" + rTxt + "','" + rInx + "'";
				rowMap.put(p_sheetName + "|" + rTxt, rInx);
				filterStr += ",'" + rTxt + "'";
			}
			List colList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index=" + p_rowInx + "]/Cell[@Index>'" + p_colInx + "']/Data");
			for (int c = 0; c < colList.size(); c++) {
				Element cl = (Element) colList.get(c);
				String cTxt = cl.getText();
				String cInx = cl.getParentElement().getAttributeValue("Index");
				if(!cTxt.equals("")) {
					// tab.col/date/inx*num/sav
					String[] s = cTxt.split("[/]");
					String tabCol = (String)colMap.get(s[0].toUpperCase());
					String[] t = tabCol.split("[.]");
					String[] n = s[2].split("[*]");
					if(!sql.equals("")) {
						sql += " union all ";
					}
					sql += "select '"
							+ p_sheetName
							+ "' as sheetName,"
							// + "decode(unit_id" + decodeRow +") as rowInx,"
							// 注：oracle10g后的版本decode函数只支持127个参数
							+ "unit_id as rowInx," + "'" + cInx
							+ "' as colInx," + "to_char(" + t[1]
							+ (n.length > 1 ? "*" + n[1] : "")
							+ ") as value from " + t[0]
							+ " where unit_id in (''" + filterStr + ")"
							 +(t[0].toUpperCase().equals("COMM_REPORT_DETAIL")?" and report_code='"+this.report_code+"' and period_flag='"+this.period_flag+"' and report_flag='"+this.report_flag+"'":"")
							+ " and sj_type='"
							+ props.transDate(this.date, s[1]) + "'"
							+ " and zb_seqno='"
							+ (n[0].equals("X") ? this.inx : n[0]) + "'"
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
					rowMap.put(p_sheetName + "|" + s[0], rInx);
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
	
	private String getInxSqlComm(Element p_root, String p_sheetName, String p_rowInx, String p_colInx) {
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
					rowMap.put(p_sheetName + "|" + s[0], rInx);
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
					+ "to_char(" + t[1] 
	                 + ( (!decodeNum.equals("") && this.typeMap.get(tabCol.toUpperCase()).equals("NUMBER"))?"*decode(zb_seqno" + decodeNum + ",1)":"") + ") as value"
	                 + " from " + t[0] + " where zb_seqno in (''" + filterStr + ")"
	                 + " and sj_type='" + props.transDate(this.date, s[1] ) + "'"
	                 + " and unit_id='" + (s[2].equals("X")?this.corp:s[2]) + "'"
	                 +(t[0].toUpperCase().equals("COMM_REPORT_DETAIL")?" and report_code='"+this.report_code+"' and period_flag='"+this.period_flag+"' and report_flag='"+this.report_flag+"'":"")
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
				//指标*系数/公司
				String[] s = rTxt.split("[/]");
				String[] n = s[0].split("[*]");
				//decodeRow += ",'" + n[0] + "/" + s[1] + "','" + rInx + "'";
				rowMap.put(p_sheetName + "|" + n[0] + "/" + s[1], rInx);
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
	
	private String getMixSqlComm(Element p_root, String p_sheetName, String p_rowInx, String p_colInx) {
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
				//指标*系数/公司
				String[] s = rTxt.split("[/]");
				String[] n = s[0].split("[*]");
				//decodeRow += ",'" + n[0] + "/" + s[1] + "','" + rInx + "'";
				rowMap.put(p_sheetName + "|" + n[0] + "/" + s[1], rInx);
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
					+ "to_char(" + t[1] 
	                 + ( (!decodeNum.equals("") && this.typeMap.get(tabCol.toLowerCase()).equals("NUMBER"))?"*decode(zb_seqno||'/'||unit_id" + decodeNum + ",1)":"") + ") as value"
	                 + " from " + t[0] + " where zb_seqno||'/'||unit_id in (''" + filterStr + ")"
	                 + " and sj_type='" + props.transDate(this.date, s[1] ) + "'"
	                 +(t[0].toUpperCase().equals("COMM_REPORT_DETAIL")?" and report_code='"+this.report_code+"' and period_flag='"+this.period_flag+"' and report_flag='"+this.report_flag+"'":"")
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
				String rowInx = (String)rowMap.get(sheetName + "|" + rs.getString("rowInx").trim());
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
			if(this.date.length()==6) {
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
				p_xml = p_xml.replaceAll("\\{Q\\}", this.date.substring(4,5));
			}
			if( p_xml.indexOf("{CORP}")>-1 || p_xml.indexOf("{INX}")>-1||p_xml.indexOf("{U}")>-1) {
				Context initCtx = new InitialContext();
				DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
				//DataSource ds = (DataSource)initCtx.lookup("java:comp/env/jdbc/LiferayPool");
				Connection conn = ds.getConnection();
				if(!this.corp.equals("")) {
					Statement stmt = conn.createStatement();
					ResultSet rs = stmt.executeQuery("select unitname from sgcc_ini_unit where unitid='" + this.corp + "'");
					if(rs.next()) {
						p_xml = p_xml.replaceAll("\\{CORP\\}", rs.getString(1));
					}else{
						rs = stmt.executeQuery("select realname from hr_man_info where userid='" + this.corp + "'");
						if(rs.next()) {
							p_xml = p_xml.replaceAll("\\{CORP\\}", rs.getString(1));
						}
					}
					rs.close();
					stmt.close();
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
				if(!this.userid.equals("")) {
					p_xml = p_xml.replaceAll("\\{U\\}",this.userid );
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
		try {
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
						el.setAttribute("editType", "none");
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
	
	//保存数据（通用）
	public String xml2dbComm(String p_old_xml, String p_new_xml, String p_date, String p_corp, String p_inx, String p_keyCol, String p_keyValue,String p_report_code,String p_period_flag,String p_report_flag) {
		this.date = p_date;
		this.corp = p_corp;
		this.inx = p_inx;
		this.keyCol = p_keyCol;
		this.keyValue = p_keyValue;
		this.report_code = p_report_code;
		this.period_flag = p_period_flag;
		this.report_flag = p_report_flag;
		String str = "true";
		try {
			//比较xml差异
			Document doc = this.differ(p_old_xml, p_new_xml);
			//System.out.println(this.toString(doc, "GBK"));
			Element root = doc.getRootElement();
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
					flag = this.savCorpXmlComm(conn, root, sheetName, rowInx, colInx);
				}
				else if(tabType.equals("inx")) {
					flag = this.savInxXmlComm(conn, root, sheetName, rowInx, colInx);
				}
				else if(tabType.equals("mix")) {
					flag = this.savMixXmlComm(conn, root, sheetName, rowInx, colInx);
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
	
	private boolean savCorpXml(Connection p_conn, Element p_root, String p_sheetName, String p_rowInx, String p_colInx) {
		boolean flag = false;
		try {
			Statement stmt = p_conn.createStatement();
			List colList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index='" + p_rowInx + "']/Cell[@Index>'" + p_colInx + "']/Data[contains(text(),'/SAVE')]");
			for(int c=0; c<colList.size(); c++) {
				Element cl = (Element) colList.get(c);
				String cInx = cl.getParentElement().getAttributeValue("Index");
				String[] s = cl.getText().split("[/]");
				//时间
				String savDate = props.transDate( this.date, s[1] );
				String[] tabCol = ((String)colMap.get(s[0].toUpperCase())).split("[.]");
				//has "DETAIL_ID" column 判断是否有DETAIL_ID字段
				boolean d = typeMap.get(tabCol[0]+".DETAIL_ID")==null;
				
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
					}
					String sql = "";
					
					if(editType==null || editType.equals("update")) {
						//tab.col/date/ut or it/edit 
						sql = "MERGE into " + tabCol[0] + " tab1 USING"
							+ " (select '" + this.keyValue + "' as mainID,"
							+ "'" + el.getText() + "' as unit_id,"
							+ "'" + (s[2].equals("X")?this.inx:s[2]) + "' as zb_seqno,"
							//+ "'" + this.date + "' as sj_type,"savDate
							+ "'" + savDate + "' as sj_type,"
							+ "'" + value + "'" + (n.length>1?"/"+n[1]:"") + " as value from dual) tab2"
							+ " on (tab1.unit_id=tab2.unit_id and tab1.zb_seqno=tab2.zb_seqno and tab1.sj_type=tab2.sj_type)"
							+ " when matched then update set " + tabCol[1] + "=tab2.value"
							+ " when not matched then insert (" 
							//has DETAIL_ID
							+(d?"":"detail_id,")
							+ this.keyCol + ",unit_id,zb_seqno,sj_type," + tabCol[1] + ")"
							+ " values ("
							//has DETAIL_ID
							+ (d?"": ("'" + SnUtil.getNewID() + "',") )
							+ "tab2.mainID,tab2.unit_id,tab2.zb_seqno,tab2.sj_type,tab2.value)";
					}
					else if(editType.equals("delete")) {
						sql = "update " + tabCol[0] + " set " + tabCol[1] + "=''"
							//+ " where sj_type='" + this.date + "'"
							+ " where sj_type='" + savDate + "'"
							+ " and unit_id='" + el.getText() + "'"
							+ " and zb_seqno='" + (s[2].equals("X")?this.inx:s[2]) + "'";
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
				String cInx = cl.getParentElement().getAttributeValue("Index");
				String[] s = cl.getText().split("[/]");
				//时间
				String savDate = props.transDate( this.date, s[1] );
				String t = (String)colMap.get(s[0].toUpperCase());
				String[] tabCol = t.split("[.]");
				//has "DETAIL_ID" column 判断是否有DETAIL_ID字段
				boolean d = typeMap.get(tabCol[0]+".DETAIL_ID")==null;
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
					}
					//指标&指标&指标
					String[] m = el.getText().split("[&]");
					//数值/数值/数值
					String[] v = rl.getText().split("/");
					for(int i=0;i<m.length;i++) {
						String[] n = m[i].split("[*]");
						String sql = "";
						if(editType==null || editType.equals("update")) {
							//tab.col/date/ut or it/edit 
							sql = "MERGE into " + tabCol[0] + " tab1 USING"
								+ " (select '" + this.keyValue + "' as mainID,"
								+ "'" + (s[2].equals("X")?this.corp:s[2]) + "' as unit_id,"
								+ "'" + n[0] + "' as zb_seqno,"
								//+ "'" + this.date + "' as sj_type,"
								+ "'" + savDate + "' as sj_type,"
								+ "'" + v[i] + "'" + ( (colType.equals("NUMBER")&&n.length>1)?"/"+n[1]:"") + " as value from dual) tab2"
								+ " on (tab1.unit_id=tab2.unit_id and tab1.zb_seqno=tab2.zb_seqno and tab1.sj_type=tab2.sj_type)"
								+ " when matched then update set " + tabCol[1] + "=tab2.value"
								+ " when not matched then insert ("
								//has DETAIL_ID
								+(d?"":"detail_id,")
								+ this.keyCol + ",unit_id,zb_seqno,sj_type," + tabCol[1] + ")"
								+ " values ("
								//has DETAIL_ID
								+ (d?"": ("'" + SnUtil.getNewID() + "',") )
								+ "tab2.mainID,tab2.unit_id,tab2.zb_seqno,tab2.sj_type,tab2.value)";
						}
						else if(editType.equals("delete")) {
							sql = "update " + tabCol[0] + " set " + tabCol[1] + "=''"
								//+ " where sj_type='" + this.date + "'"
								+ " where sj_type='" + savDate + "'"
								+ " and unit_id='" + (s[2].equals("X")?this.corp:s[2]) + "'"
								+ " and zb_seqno='" + n[0] + "'";
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
				String cInx = cl.getParentElement().getAttributeValue("Index");
				String[] s = cl.getText().split("[/]");
				//时间
				String savDate = props.transDate( this.date, s[1] );
				String t = (String)colMap.get(s[0].toUpperCase());
				String[] tabCol = t.split("[.]");
				//has "DETAIL_ID" column 判断是否有DETAIL_ID字段
				boolean d = typeMap.get(tabCol[0]+".DETAIL_ID")==null;
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
					}
					String[] m = el.getText().split("[/]");
					String[] n = m[0].split("[*]");
					String sql = "";
					
					if(editType==null || editType.equals("update")) {
						//tab.col/date/ut or it/edit 
						sql = "MERGE into " + tabCol[0] + " tab1 USING"
							+ " (select '" + this.keyValue + "' as mainID,"
							+ "'" + m[1] + "' as unit_id,"
							+ "'" + n[0] + "' as zb_seqno,"
							//+ "'" + this.date + "' as sj_type,"
							+ "'" + savDate + "' as sj_type,"
							+ "'" + value + "'" + ( (colType.equals("NUMBER")&&n.length>1)?"/"+n[1]:"") + " as value from dual) tab2"
							+ " on (tab1.unit_id=tab2.unit_id and tab1.zb_seqno=tab2.zb_seqno and tab1.sj_type=tab2.sj_type)"
							+ " when matched then update set " + tabCol[1] + "=tab2.value"
							+ " when not matched then insert (" 
							//has DETAIL_ID
							+(d?"":"detail_id,")
							+ this.keyCol + ",unit_id,zb_seqno,sj_type," + tabCol[1] + ")"
							+ " values ("
							//has DETAIL_ID
							+ (d?"": ("'" + SnUtil.getNewID() + "',") )
							+ "tab2.mainID,tab2.unit_id,tab2.zb_seqno,tab2.sj_type,tab2.value)";
					}
					else if(editType.equals("delete")) {
						sql = "update " + tabCol[0] + " set " + tabCol[1] + "=''"
							//+ " where sj_type='" + this.date + "'"
							+ " where sj_type='" + savDate + "'"
							+ " and unit_id='" + m[1] + "'"
							+ " and zb_seqno='" + n[0] + "'";
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
	
	private boolean savCorpXmlComm(Connection p_conn, Element p_root, String p_sheetName, String p_rowInx, String p_colInx) {
		boolean flag = false;
		try {
			Statement stmt = p_conn.createStatement();
			List colList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index='" + p_rowInx + "']/Cell[@Index>'" + p_colInx + "']/Data[contains(text(),'/SAVE')]");
			for(int c=0; c<colList.size(); c++) {
				Element cl = (Element) colList.get(c);
				String cInx = cl.getParentElement().getAttributeValue("Index");
				String[] s = cl.getText().split("[/]");
				//时间
				String savDate = props.transDate( this.date, s[1] );
				String[] tabCol = ((String)colMap.get(s[0].toUpperCase())).split("[.]");
				//has "DETAIL_ID" column 判断是否有DETAIL_ID字段
				boolean d = typeMap.get(tabCol[0]+".DETAIL_ID")==null;
				
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
					}
					String sql = "";
					
					if(editType==null || editType.equals("update")) {
						//tab.col/date/ut or it/edit 
						sql = "MERGE into " + tabCol[0] + " tab1 USING"
						+ " (select '" + this.keyValue + "' as mainID,"
						+ "'" + el.getText() + "' as unit_id,"
						+ "'" + (s[2].equals("X")?this.inx:s[2]) + "' as zb_seqno,"
						//+ "'" + this.date + "' as sj_type,"savDate
						+ "'" + savDate + "' as sj_type,"
						+(tabCol[0].toUpperCase().equals("COMM_REPORT_DETAIL")?"'"+this.report_code+"' as report_code,'"+this.period_flag+"' as period_flag,'"+this.report_flag+"' as report_flag,":"")
						+ "'" + value + "'" + (n.length>1?"/"+n[1]:"") + " as value from dual) tab2"
						+ " on (tab1.unit_id=tab2.unit_id and tab1.zb_seqno=tab2.zb_seqno and tab1.sj_type=tab2.sj_type"
						+ (tabCol[0].toUpperCase().equals("COMM_REPORT_DETAIL")?" and tab1.report_code = tab2.report_code and tab1.period_flag = tab2.period_flag and tab1.report_flag = tab2.report_flag":"")
						+ ") when matched then update set " + tabCol[1] + "=tab2.value"
						+ " when not matched then insert (" 
						//has DETAIL_ID
						+(d?"":"detail_id,")
						+ this.keyCol + (tabCol[0].toUpperCase().equals("COMM_REPORT_DETAIL")?",report_code,period_flag,report_flag":"" )
						+ ",unit_id,zb_seqno,sj_type," + tabCol[1] + ")"
						+ " values ("
						//has DETAIL_ID
						+ (d?"": ("'" + SnUtil.getNewID() + "',") )
						+ "tab2.mainID,"
						+ (tabCol[0].toUpperCase().equals("COMM_REPORT_DETAIL")?"tab2.report_code,tab2.period_flag,tab2.report_flag,":"")
						+ "tab2.unit_id,tab2.zb_seqno,tab2.sj_type,tab2.value)";
					}
					else if(editType.equals("delete")) {
						sql = "update " + tabCol[0] + " set " + tabCol[1] + "=''"
						//+ " where sj_type='" + this.date + "'"
						+ " where sj_type='" + savDate + "'"
						+ " and unit_id='" + el.getText() + "'"
						+ (tabCol[0].toUpperCase().equals("COMM_REPORT_DETAIL")?" and report_code='"+this.report_code+"' and period_flag='"+this.period_flag+"' and report_flag='"+this.report_flag+"'":"")
						+ " and zb_seqno='" + (s[2].equals("X")?this.inx:s[2]) + "'";
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
	
	private boolean savInxXmlComm(Connection p_conn, Element p_root, String p_sheetName, String p_rowInx, String p_colInx) {
		boolean flag = false;
		try {
			Statement stmt = p_conn.createStatement();
			List colList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index='" + p_rowInx + "']/Cell[@Index>'" + p_colInx + "']/Data[contains(text(),'/SAVE')]");
			for(int c=0; c<colList.size(); c++) {
				Element cl = (Element) colList.get(c);
				String cInx = cl.getParentElement().getAttributeValue("Index");
				String[] s = cl.getText().split("[/]");
				//时间
				String savDate = props.transDate( this.date, s[1] );
				String t = (String)colMap.get(s[0].toUpperCase());
				String[] tabCol = t.split("[.]");
				//has "DETAIL_ID" column 判断是否有DETAIL_ID字段
				boolean d = typeMap.get(tabCol[0]+".DETAIL_ID")==null;
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
					}
					//指标&指标&指标
					String[] m = el.getText().split("[&]");
					//数值/数值/数值
					String[] v = rl.getText().split("/");
					for(int i=0;i<m.length;i++) {
						String[] n = m[i].split("[*]");
						String sql = "";
						if(editType==null || editType.equals("update")) {
							//tab.col/date/ut or it/edit 
							sql = "MERGE into " + tabCol[0] + " tab1 USING"
							+ " (select '" + this.keyValue + "' as mainID,"
							+ "'" + (s[2].equals("X")?this.corp:s[2]) + "' as unit_id,"
							+ "'" + n[0] + "' as zb_seqno,"
							//+ "'" + this.date + "' as sj_type,"
							+ "'" + savDate + "' as sj_type,"
							+(tabCol[0].toUpperCase().equals("COMM_REPORT_DETAIL")?"'"+this.report_code+"' as report_code,'"+this.period_flag+"' as period_flag,'"+this.report_flag+"' as report_flag,":"")
							+ "'" + v[i] + "'" + ( (colType.equals("NUMBER")&&n.length>1)?"/"+n[1]:"") + " as value from dual) tab2"
							+ " on (tab1.unit_id=tab2.unit_id and tab1.zb_seqno=tab2.zb_seqno and tab1.sj_type=tab2.sj_type "
							+ (tabCol[0].toUpperCase().equals("COMM_REPORT_DETAIL")?"and tab1.report_code = tab2.report_code and tab1.period_flag = tab2.period_flag and tab1.report_flag = tab2.report_flag":"")
							+ ") when matched then update set " + tabCol[1] + "=tab2.value"
							+ " when not matched then insert ("
							//has DETAIL_ID
							+(d?"":"detail_id,")
							+ this.keyCol + ","
							+ (tabCol[0].toUpperCase().equals("COMM_REPORT_DETAIL")?"report_code,period_flag,report_flag,":"")
							+ "unit_id,zb_seqno,sj_type," + tabCol[1] + ")"
							+ " values ("
							//has DETAIL_ID
							+ (d?"": ("'" + SnUtil.getNewID() + "',") )
							+ "tab2.mainID,"
							+ (tabCol[0].toUpperCase().equals("COMM_REPORT_DETAIL")?"tab2.report_code,tab2.period_flag,tab2.report_flag,":"")
							+ "tab2.unit_id,tab2.zb_seqno,tab2.sj_type,tab2.value)";
						}
						else if(editType.equals("delete")) {
							sql = "update " + tabCol[0] + " set " + tabCol[1] + "=''"
							//+ " where sj_type='" + this.date + "'"
							+ " where sj_type='" + savDate + "'"
							+ " and unit_id='" + (s[2].equals("X")?this.corp:s[2]) + "'"
							+ (tabCol[0].toUpperCase().equals("COMM_REPORT_DETAIL")?" and report_code='"+this.report_code+"' and period_flag='"+this.period_flag+"' and report_flag='"+this.report_flag+"'":"")
							+ " and zb_seqno='" + n[0] + "'";
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
	
	private boolean savMixXmlComm(Connection p_conn, Element p_root, String p_sheetName, String p_rowInx, String p_colInx) {
		boolean flag = false;
		try {
			Statement stmt = p_conn.createStatement();
			List colList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index='" + p_rowInx + "']/Cell[@Index>'" + p_colInx + "']/Data[contains(text(),'/SAVE')]");
			for(int c=0; c<colList.size(); c++) {
				Element cl = (Element) colList.get(c);
				String cInx = cl.getParentElement().getAttributeValue("Index");
				String[] s = cl.getText().split("[/]");
				//时间
				String savDate = props.transDate( this.date, s[1] );
				String t = (String)colMap.get(s[0].toUpperCase());
				String[] tabCol = t.split("[.]");
				//has "DETAIL_ID" column 判断是否有DETAIL_ID字段
				boolean d = typeMap.get(tabCol[0]+".DETAIL_ID")==null;
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
					}
					String[] m = el.getText().split("[/]");
					String[] n = m[0].split("[*]");
					String sql = "";
					
					if(editType==null || editType.equals("update")) {
						//tab.col/date/ut or it/edit 
						sql = "MERGE into " + tabCol[0] + " tab1 USING"
						+ " (select '" + this.keyValue + "' as mainID,"
						+ "'" + m[1] + "' as unit_id,"
						+ "'" + n[0] + "' as zb_seqno,"
						//+ "'" + this.date + "' as sj_type,"
						+ "'" + savDate + "' as sj_type,"
						+(tabCol[0].toUpperCase().equals("COMM_REPORT_DETAIL")?"'"+this.report_code+"' as report_code,'"+this.period_flag+"' as period_flag,'"+this.report_flag+"' as report_flag,":"")
						+ "'" + value + "'" + ( (colType.equals("NUMBER")&&n.length>1)?"/"+n[1]:"") + " as value from dual) tab2"
						+ " on (tab1.unit_id=tab2.unit_id and tab1.zb_seqno=tab2.zb_seqno and tab1.sj_type=tab2.sj_type "
						+ (tabCol[0].toUpperCase().equals("COMM_REPORT_DETAIL")?"and tab1.report_code = tab2.report_code and tab1.period_flag = tab2.period_flag and tab1.report_flag = tab2.report_flag":"")
						+ ") when matched then update set " + tabCol[1] + "=tab2.value"
						+ " when not matched then insert (" 
						//has DETAIL_ID
						+(d?"":"detail_id,")
						+ this.keyCol + ","
						+ (tabCol[0].toUpperCase().equals("COMM_REPORT_DETAIL")?"report_code,period_flag,report_flag,":"")
						+ "unit_id,zb_seqno,sj_type," + tabCol[1] + ")"
						+ " values ("
						//has DETAIL_ID
						+ (d?"": ("'" + SnUtil.getNewID() + "',") )
						+ "tab2.mainID," 
						+ (tabCol[0].toUpperCase().equals("COMM_REPORT_DETAIL")?"tab2.report_code,tab2.period_flag,tab2.report_flag,":"") 
						+ "tab2.unit_id,tab2.zb_seqno,tab2.sj_type,tab2.value)";
					}
					else if(editType.equals("delete")) {
						sql = "update " + tabCol[0] + " set " + tabCol[1] + "=''"
						//+ " where sj_type='" + this.date + "'"
						+ " where sj_type='" + savDate + "'"
						+ " and unit_id='" + m[1] + "'"
						+ (tabCol[0].toUpperCase().equals("COMM_REPORT_DETAIL")?" and report_code='"+this.report_code+"' and period_flag='"+this.period_flag+"' and report_flag='"+this.report_flag+"'":"")
						+ " and zb_seqno='" + n[0] + "'";
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
	
}