package com.sgepit.frame.util.cell;

import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.output.Format;
import org.jdom.output.XMLOutputter;

import com.sgepit.frame.util.JNDIUtil;

public class FusionXML {
	//////////////////////////////////////////////////
	private Props props;
	private HashMap<String,String> colMap;
	private String type = "";
	private String corp = "";
	private String date = "";
	private String dateType = "";
	private String inx = "";
	private String tab = "";
	private String col = "";
	
	public FusionXML() {
		props = new Props();
		colMap = props.getPropsMap("REPORT_COL");
		
	}	
	
	public String getData(HashMap<String,String> p_map) {
		String sql = "";
		try {
			this.type = p_map.get("type");
			this.corp = p_map.get("corp");
			this.date = p_map.get("date");
			this.dateType = p_map.get("dateType");
			this.inx = p_map.get("inx");
			String tabCol = colMap.get(p_map.get("tabCol").toUpperCase());
			this.tab = tabCol.split("[.]")[0];
			this.col = tabCol.split("[.]")[1];
			String path = this.getClass().getResource("chartSql.props").getPath();
			InputStream is = new FileInputStream(path);
			Properties pp = new Properties();
			pp.load(is);
		
			sql = pp.getProperty(this.type+"_"+this.dateType+"_"+this.tab+"_"+this.col);
			if(sql==null) {
				sql = pp.getProperty(this.type+"_"+this.dateType+"_"+this.tab+"_*");
			}
			if(sql==null) {
				sql = pp.getProperty(this.type+"_"+this.dateType+"_*");
			}
			if(sql!=null) {
				Pattern p = Pattern.compile("(#\\w+)");
				Matcher m = p.matcher(sql);
				while(m.find()) {
					sql = sql.replaceAll(m.group(1), pp.getProperty(m.group(1).substring(1)));
				}
				sql = sql.replaceAll("&corp", corp)
							.replaceAll("&inx", inx)
							.replaceAll("&date", date)
							.replaceAll("&tab", tab)
							.replaceAll("&col", col);
			}
			is.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		//System.out.println(this.cn(sql));
		return this.getSqlData(this.cn(sql));
	}
	
	public String getSqlData(String sql) {
		String xmlStr = "";
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery(sql);
			////////////////////////////////////////////////// XML
			xmlStr = rs2xml(rs);
			////////////////////////////////////////////////// XML
			rs.close();
			stmt.close();
			conn.close();
			initCtx.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return xmlStr;
	}
	
	public static String toString(Document  doc,  String  encoding)  {  
		Format format = Format.getRawFormat();
		format.setEncoding(encoding);
		XMLOutputter xop = new XMLOutputter(format);
		return xop.outputString(doc);
	}
	
	public static String cn(String s) {
		try {
			return new String(s.getBytes("iso-8859-1"));
		}
		catch(Exception ex) {
			return "";
		}
	}
	
	private String rs2xml(ResultSet p_rs) {
		String xmlStr = "";
		try {
			Document doc = new Document();
			Element chart = new Element("chart");
			chart.setAttribute("caption",this.corpName(this.corp)+ "  " + this.inxName(this.inx));
			doc.addContent(chart);
			Element categories = new Element("categories");
			chart.addContent(categories);
			
			ResultSetMetaData rsmd = p_rs.getMetaData();
			int colcn = rsmd.getColumnCount();
			for(int i=2; i<=colcn; i++) {
				Element dataset = new Element("dataset");
				dataset.setAttribute("seriesname", rsmd.getColumnName(i));
				chart.addContent(dataset);
			}
			while(p_rs.next()) {
				Element category = new Element("category");
				category.setAttribute("label", p_rs.getString(1));
				categories.addContent(category);
				
				List ls = chart.getChildren("dataset");
				Iterator iter = ls.iterator();
				int c = 2;
				while(iter.hasNext()) {
					Element dataset = (Element) iter.next();
					Element set = new Element("set");
					String val = p_rs.getString(c++);
					set.setAttribute("value", val==null?"":val);
					dataset.addContent(set);
				}
			}
			xmlStr = this.toString(doc, "GBK");
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return xmlStr;
	}
	
	private String corpName(String p_corp) {
		String corp = "";
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery("select unitName from sgcc_ini_unit where unitid='" + p_corp + "'");
			if(rs.next()) {
				corp = rs.getString(1);
			}
			rs.close();
			stmt.close();
			conn.close();
			initCtx.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return corp;
	}
	
	private String inxName(String p_inx) {
		String inx = "";
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery("select realname||'('||jldw||')' from sgcc_guideline_info where zb_seqno='" + p_inx + "'");
			if(rs.next()) {
				inx = rs.getString(1);
			}
			rs.close();
			stmt.close();
			conn.close();
			initCtx.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return inx;
	}
	
	private String colName(String p_col) {
		String col = "";
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			ResultSet rs = stmt.executeQuery("select property_name from property_code where type_name='REPORT_COL'");
			if(rs.next()) {
				col = rs.getString(1);
			}
			rs.close();
			stmt.close();
			conn.close();
			initCtx.close();
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return col;
	}
}