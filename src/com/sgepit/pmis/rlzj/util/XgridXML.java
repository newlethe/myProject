package com.sgepit.pmis.rlzj.util;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import org.apache.commons.collections.map.ListOrderedMap;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.jdom.JDOMException;

import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.StringUtil;
import com.sgepit.frame.util.db.SnUtil;


public class XgridXML {
	/**
	 * 根据Xgrid表头字符串、人员信息，获取工资单数据
	 * @param headerStr
	 * @return
	 * @author: Liuay
	 * @throws DocumentException 
	 * @throws JDOMException 
	 * @createDate: Jun 20, 2011
	 */
	public String getXgridXMLByHeader(String headerStr, String userId, String sjType, String readOnly) throws DocumentException {
		if (headerStr!=null && headerStr.length()>0 && !headerStr.equals("0")) {
			Document document = DocumentHelper.parseText(headerStr);
			
			String userSql = "(select userid, posid, rownum from HR_MAN_INFO ";
			if (userId!=null && userId.length()>0) {
				userSql += " where userid in (" + StringUtil.transStrToIn(userId, "`") + ")";
			}
			userSql += " order by posid)";
			
			String querySql = "";
			List<Element> list = document.selectNodes("/rows/head/column");
			int colNum = 0;
			for(Iterator<Element> it = list.iterator();it.hasNext();) {
				Element el = (Element) it.next();
				String colId = el.attributeValue("colSource") ;
				String[] c = colId.split("[/]");
				String colType = el.attributeValue("type");
				if(c.length==1) {
					String colSql = "select config_info from hr_salary_basic_info where uids ='" + colId + "'";
					List<Map> colList = JdbcUtil.query(colSql);
					String colConfigStr = "";
					if (colList.size()==1) {
						colConfigStr = (String) colList.get(0).get("config_info");
						String[] t = colConfigStr.split("[.]");
						String tablename = t[0];
						String colName = t[1];
						
						if(!querySql.equals("")) {
							querySql += " union all ";
						}
						
						querySql += "select '" + colNum + "' as colInx, to_char(tab1.userid)||'`'||to_char(tab1.posid) as rowInx, to_char(tab2." + colName + ") as val from " + userSql + " tab1 " +
							" left join " + tablename + " tab2 on tab1.userid=tab2.userid";
					}
				} else {
					String[] t = c[0].split("[.]");
					String tablename = t[0];
					String colName = t[1];
					String zbId = c[1];
					
					if(!querySql.equals("")) {
						querySql += " union all ";
					}
					// 不读取有计算公式的列					
					if(colType.indexOf("=")==-1 || (readOnly!=null && readOnly.equals("true"))){
						querySql += "select '" + colNum + "' as colInx, to_char(tab1.userid)||'`'||to_char(tab1.posid) as rowInx, to_char(tab2." + colName + ") as val from " + userSql + " tab1 " +
							" left join (select * from " + tablename + " where item_id='" + zbId + "' and sj_type ='" + sjType + "') tab2 on tab1.userid=tab2.userid";
					} else {
						querySql += "select '" + colNum + "' as colInx, to_char(tab1.userid)||'`'||to_char(tab1.posid) as rowInx, '' as val from " + userSql + " tab1 ";
					}
				}
				colNum ++;
			}
			
			Element rows = document.getRootElement() ;
//			System.out.println("getXgridXMLByHeader:::" + querySql);
			List<ListOrderedMap> dataList = JdbcUtil.query(querySql);
			for (int i = 0; i < dataList.size(); i++) {
				Element row = null;
				Element cell = null;
				ListOrderedMap sqlmap = dataList.get(i) ;
				String colInx = (String) sqlmap.get("colInx");
				String rowInx = (String) sqlmap.get("rowInx");
				String value = (String) sqlmap.get("val");
				row = (Element) rows.selectSingleNode("/rows/row[@id='" + rowInx + "']");
				if(row!=null) {
					cell = (Element)row.selectSingleNode("/row/cell[@Index='" + colInx + "']");
					if(cell!=null) {
						cell.addCDATA(value==null?"":value.toString())  ;
					} else {
						cell = row.addElement("cell") ;
						cell.addAttribute("Index",  colInx) ;
						cell.addCDATA(value==null?"":value.toString())  ;
					}
				} else {
					row = rows.addElement("row") ;
					row.addAttribute("id",  rowInx) ;
					cell = row.addElement("cell") ;
					cell.addAttribute("Index",  colInx) ;
					cell.addCDATA(value==null?"":value)  ;
				}
				
			}
			String xml = document.asXML() ;
//			System.out.println("getXgridXml::" + xml);
			return xml;
		} else {
			System.out.println("所选模板配置不正确！");
		}
		return null;
	}

	/**
	 * 通过Xgrid表头字符串，保存修改的数据到对应的表中
	 * @param header
	 * @param dataXml
	 * @return
	 * @author: Liuay
	 * @throws DocumentException 
	 * @createDate: Jun 21, 2011
	 */
	public String saveXgridXMLByHeader(String header, String dataXml) throws DocumentException {
//		System.out.println("dataXml::" + dataXml);
		if (header!=null && header.length()>0 && dataXml!=null && dataXml.length()>0) {
			Document headerDoc = DocumentHelper.parseText(header);
			Document dataDoc = DocumentHelper.parseText(dataXml);
			
			Context initCtx = null;
			DataSource ds = null;
			Connection conn = null;
			try {
				initCtx = new InitialContext();
				ds = (DataSource)JNDIUtil.lookup(initCtx) ;
				conn = ds.getConnection();
				Statement stmt = conn.createStatement();
				
				List<Element> list = headerDoc.selectNodes("/rows/head/column");
				Map<String, Map<String, String>> headerMap = new HashMap<String, Map<String, String>>();
				Map<String, String> map = null;
				int colNum = 0;
				for(Iterator<Element> it = list.iterator();it.hasNext();) {
					Element el = (Element) it.next();
					String colId = el.attributeValue("colSource") ;
					map = new HashMap<String, String>();
					map.put("colConfig", colId);
					map.put("type", el.attributeValue("type"));
					headerMap.put(String.valueOf(colNum), map);
					colNum ++ ;
				}
				
				List<Element> dataList = dataDoc.selectNodes("/rows/row");
				for(Iterator<Element> it = dataList.iterator();it.hasNext();) {
					Element row = (Element) it.next();
					Element p = row.getParent();
					String reportId = p.attributeValue("report_id");
					String sjType = p.attributeValue("sj_type");
					String rowid = row.attributeValue("id");
					String[] ids = rowid.split("`");
					String userId = ids[0];
					String deptId = ids[1];;
					List<Element> cellList = row.elements("cell");
					
					String saveSql = "";
					int colIndex = 0;
					for(Iterator<Element> cellIt = cellList.iterator(); cellIt.hasNext();) {
						Element cell = (Element) cellIt.next();
						Map<String, String> colMap = headerMap.get(String.valueOf(colIndex));
						String cellType = colMap.get("type");
						boolean saveable = (cellType.equals("ro")|| cellType.equals("co"))? false : true;
						String colConfig = colMap.get("colConfig");
						
						if (saveable) {
							String[] c = colConfig.split("[/]");
							if(c.length>0){
								String[] t = c[0].split("[.]");
								String tablename = t[0];
								String colName = t[1];
								String zbId = c[1];
								
								saveSql = "MERGE into " + tablename + " tab1" +
									" USING (select '" + reportId + "' as mainID," +
									" '" + userId + "' as userid," +
									" '" + deptId + "' as dept_id," +
									" '" + zbId + "' as item_id," +
									" '" + sjType + "' as sj_type," +
									" '" + cell.getText() + "' as value from dual) tab2" +
									" on (tab1.userid = tab2.userid and tab1.item_id = tab2.item_id and tab1.sj_type = tab2.sj_type) " +
									" when matched then" +
									" update set " + colName + " = tab2.value" +
									" when not matched then" +
									" insert (uids, report_id, dept_id, userid, item_id, sj_type, " + colName + ") values" +
									" ('" + SnUtil.getNewID() + "',	tab2.mainID, tab2.dept_id, tab2.userid, tab2.item_id, tab2.sj_type, tab2.value)";
								
//								System.out.println("saveSql::" + saveSql);
								stmt.addBatch(saveSql);
							}
							colIndex ++ ;
						} else {
							colIndex ++ ;
							continue;
						}
					}
				}
				stmt.executeBatch();
				stmt.close();
			} catch (NamingException e) {
				e.printStackTrace();
			} catch (SQLException e) {
				e.printStackTrace();
			} finally {
				try {
					conn.close();
					initCtx.close();
					return "OK";
				} catch (SQLException e) {
					e.printStackTrace();
				} catch (NamingException e) {
					e.printStackTrace();
				}
			}
			
			
		}
		return null;
	}
	
}
