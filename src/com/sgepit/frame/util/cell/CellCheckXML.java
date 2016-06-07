package com.sgepit.frame.util.cell;

import java.io.StringReader;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.List;

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

public class CellCheckXML {
	private HashMap rowMap;
	private HashMap colMap;
	private Props props;
	private String sjlx = "";
	private String reportType = "";
	private String deptid = "";
	private String userid="";
	
	public CellCheckXML() {
		props = new Props();
		colMap = props.getPropsMap("REPORT_COL");
	}
	
	//获取数据库连接
	/*public Connection getConnection() throws ClassNotFoundException, SQLException{
		Connection conn = null;
		String username = "chongqing";
		String password = "chongqing";
		String url = "jdbc:oracle:thin:@192.168.102.79:1521:orcl";
		Class.forName("oracle.jdbc.driver.OracleDriver");
		conn = DriverManager.getConnection(url, username, password);
		return conn;
	}*/
	//判断字符串是否可转换成数字
	public static boolean isNum(String p_str) {
		if(p_str.matches("^[-+]?\\d*[.]?\\d+([Ee][-+]\\d+)?$")) {
			return true;
		}
		else {
			return false;
		}
	}
	//将Document对象转换为xml字符串
	public static String toString(Document  doc,  String  encoding)  {  
		Format format = Format.getRawFormat();
		format.setEncoding(encoding);
		XMLOutputter xop = new XMLOutputter(format);
		return xop.outputString(doc);
	}
	//获得包含table的单元格的行列代码
	public String getTabPlace(String p_xml, String p_type, String sjlx){
		String str = "";
		Document doc;
		try {
			SAXBuilder sb = new SAXBuilder();
			doc = sb.build(new StringReader(p_xml));
			Element root = doc.getRootElement();
			//sheet遍历
			List ls = XPath.selectNodes( root, "/Workbook/Worksheet/Table/Row/Cell/Data[starts-with(text(),'table:')]");
			for (int i = 0; i < ls.size(); i++) {
				Element el = (Element) ls.get(i);
				Element colEl = el.getParentElement();
				String colIndex = colEl.getAttributeValue("Index");
				Element rowEl = colEl.getParentElement();
				String rowIndex = rowEl.getAttributeValue("Index");
				Element wsEl = rowEl.getParentElement().getParentElement();
				String sheetName = wsEl.getAttributeValue("Name");
				str+=rowIndex+":"+colIndex+":"+sheetName+"/";
			}
			if(!(str.equals(""))){
				str = str.substring(0, str.length()-1);
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return str;
	}
	//将数据库数据转换为xml字符串
	public String db2checkXml(String p_xml, String p_type, String sjlx, String p_corp, String p_dept,String p_userid) {
		this.sjlx = sjlx;
		this.deptid = p_dept;
		this.userid = p_userid;
		this.reportType = p_type;
		
		String xmlStr = "";
		try {
			SAXBuilder sb = new SAXBuilder();
			Document doc = sb.build(new StringReader(p_xml));

			rowMap = new HashMap();
			String sql = this.xml2checkSql(doc);
			//System.out.println(sql);
			if(!sql.equals("")) {
				//填充数据
				this.sql2checkXml( doc, sql );
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
	private String xml2checkSql( Document p_doc) {
		String sql = "";
		String uAll = " union all ";
		try {
			Element root = p_doc.getRootElement();
			//sheet遍历
			List ls = XPath.selectNodes( root, "/Workbook/Worksheet/Table/Row/Cell/Data[starts-with(text(),'table:')]");
			for (int i = 0; i < ls.size(); i++) {
				Element el = (Element) ls.get(i);
				String tabType = el.getText().split("[:]")[1];//得到inx或corp或mix
				Element colEl = el.getParentElement();
				String colIndex = colEl.getAttributeValue("Index");
				Element rowEl = colEl.getParentElement();
				String rowIndex = rowEl.getAttributeValue("Index");
				Element wsEl = rowEl.getParentElement().getParentElement();
				String sheetName = wsEl.getAttributeValue("Name");
				
				if(!sql.equals("")) {
					sql += uAll;
				}
				if(tabType.equals("corp")) {
					sql += this.getCorpCheckSql(root, sheetName, rowIndex, colIndex);
				}
				else if(tabType.equals("inx")) {
					sql += this.getInxCheckSql(root, sheetName, rowIndex, colIndex);
				}
				else if(tabType.equals("mix")) {
					sql += this.getMixCheckSql(root, sheetName, rowIndex, colIndex);
				}
			}
			//System.out.println(sql);
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		if(sql.endsWith(uAll)){
			sql = sql.substring(0,(sql.lastIndexOf(uAll)));
		}
		return sql;
	}
	@SuppressWarnings("unchecked")
	private String getInxCheckSql(Element p_root, String p_sheetName, String p_rowInx, String p_colInx) {
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
					rowMap.put(p_sheetName + "|" + s[0], rInx);
					filterStr += ",'" + s[0] + "'";
					if(s.length>1) {
						decodeNum += ",'" + s[0] + "'," + s[1];
					}
				}
			}
			//col遍历
			List colList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index=" + p_rowInx + "]/Cell[@Index>'" + p_colInx + "']/Data[contains(text(),'/SAVE')]");
			for (int c = 0; c < colList.size(); c++) {
				Element cl = (Element) colList.get(c);
				String cTxt = cl.getText();
				String cInx = cl.getParentElement().getAttributeValue("Index");
				//System.out.println("cTxt="+cTxt+",cInx="+cInx);
				if(!cTxt.equals("")) {
					// tab.col/date/corp/sav
					String[] s = cTxt.split("[/]");
					if(!sql.equals("")) {
						sql += " union all ";
					}
					sql += "select '" + p_sheetName + "' as sheetName,"
						//+ "decode(zb_seqno" + decodeRow +") as rowInx,"
						+ "zb_seqno as rowInx,"
						+ "'" + cInx + "' as colInx,"
						+ " isablenull  as value"
						+ " from SGCC_CELL_CHECK  where zb_seqno in (''" + filterStr + ")"
						+ " and dept_id='"+this.deptid+"'"
						+ " and report_type='"+this.reportType+"'"
						+ " and sjlx='"+this.sjlx+"'"
						+ " and report_col='"+s[0]+"'"
						+ " and trans_date = '"+s[1]+"'"
						+ " and queryunit = '"+s[2]+"'"
						+ " and zblx = 'inx'";
				}
			}
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return sql;
	}
	private String getCorpCheckSql(Element p_root, String p_sheetName, String p_rowInx, String p_colInx) {
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
			//col遍历
			List colList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index=" + p_rowInx + "]/Cell[@Index>'" + p_colInx + "']/Data[contains(text(),'/SAVE')]");
			for (int c = 0; c < colList.size(); c++) {
				Element cl = (Element) colList.get(c);
				String cTxt = cl.getText();
				String cInx = cl.getParentElement().getAttributeValue("Index");
				if(!cTxt.equals("")) {
					// tab.col/date/inx*num/sav
					String[] s = cTxt.split("[/]");//形式：查询项/时间类型/指标编码/是否保存
					String[] n = s[2].split("[*]");
					if(!sql.equals("")) {
						sql += " union all ";
					}
					sql += "select '" + p_sheetName + "' as sheetName,"
						//+ "decode(unit_id" + decodeRow +") as rowInx,"
						//注：oracle10g后的版本decode函数只支持127个参数
						+ "queryunit as rowInx,"
						+ "'" + cInx + "' as colInx,"
						+ "isablenull as value from SGCC_CELL_CHECK" 
						+ " where queryunit in (''" + filterStr + ")"
						+ " and sjlx='" + this.sjlx + "' and zblx = 'corp'"
						+ (n[0].equals("X")?" and 1=2":" and zb_seqno='" + n[0] + "'")
						+ " and report_col = '"+s[0]+"'";
				}
			}
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return sql;
	}

	@SuppressWarnings("unchecked")
	private String getMixCheckSql(Element p_root, String p_sheetName, String p_rowInx, String p_colInx) {
		String sql = "";
		try {
			String decodeRow = "";
			String filterStr = "";
			String decodeNum = "";
			List rowList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index>" + p_rowInx + "]/Cell[@Index='" + p_colInx + "']/Data");
			for (int r = 0; r < rowList.size(); r++) {
				Element rl = (Element)rowList.get(r);
				String rTxt = rl.getText();//指标*系数/公司
				String rInx = rl.getParentElement().getParentElement().getAttributeValue("Index");//得到行号
				//指标*系数/公司
				String[] s = rTxt.split("[/]");
				String[] n = s[0].split("[*]");
				rowMap.put(p_sheetName + "|" + n[0] + "/" + s[1], rInx);
				filterStr += ",'" + n[0] + "/" + s[1] + "'";
				if(n.length>1) {
					decodeNum += ",'" + n[0] + "/" + s[1] + "'," + n[1];
				}
			}
			List colList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index=" + p_rowInx + "]/Cell[@Index>'" + p_colInx + "']/Data[contains(text(),'/SAVE')]");
			for (int c = 0; c < colList.size(); c++) {
				Element cl = (Element) colList.get(c);
				String cTxt = cl.getText();
				String cInx = cl.getParentElement().getAttributeValue("Index");
				if(!cTxt.equals("")) {
					// tab.col/date/corp/sav
					String[] s = cTxt.split("[/]");
					if(!sql.equals("")) {
						sql += " union all ";
					}
					sql += "select '" + p_sheetName + "' as sheetName,"
						//+ "decode(zb_seqno||'/'||unit_id" + decodeRow +") as rowInx,"
						+ "zb_seqno||'/'||queryunit as rowInx,"
						+ "'" + cInx + "' as colInx,"
						+ "isablenull as value from SGCC_CELL_CHECK" 
						+ " where zb_seqno||'/'||queryunit in (''" + filterStr + ")"
						+ " and sjlx='" + this.sjlx + "' and zblx = 'mix'" 
						+ " and report_col = '"+s[0]+"'";
				}
			}
		}
		catch(Exception ex) {
			ex.printStackTrace();
		}
		return sql;
	}
	
	//将查询结果转换成xml
	private void sql2checkXml(Document p_doc, String p_sql) {
		Element root = p_doc.getRootElement();
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
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
	//保存数据（校验）
	public String checkXml2db(String p_old_xml, String p_new_xml, String sjlx, String p_dept,String p_type, String p_userid) {
		this.sjlx = sjlx;
		this.userid = p_userid;
		String str = "true";
		try {
			//比较xml差异
			Document doc = this.differ(p_old_xml, p_new_xml);
			//System.out.println(this.toString(doc, "GBK"));
			Element root = doc.getRootElement();
			////////////////////
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			Connection conn = ds.getConnection();
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
					flag = this.savCorpCheckXml(conn, root, sheetName, rowInx, colInx,p_dept,p_type);
				}
				else if(tabType.equals("inx")) {
					flag = this.savInxCheckXml(conn, root, sheetName, rowInx, colInx,p_dept,p_type);
				}
				else if(tabType.equals("mix")) {
					flag = this.savMixCheckXml(conn, root, sheetName, rowInx, colInx,p_dept,p_type);
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
			conn.close();
			initCtx.close();
			return str;
		}
		catch(Exception ex) {
			ex.printStackTrace();
			return "false";
		}
	}
	private boolean savCorpCheckXml(Connection p_conn, Element p_root, 
			String p_sheetName, String p_rowInx, String p_colInx,
			String p_dept,String p_type) {
		boolean flag = false;
		try {
			Statement stmt = p_conn.createStatement();
			List colList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index='" + p_rowInx + "']/Cell[@Index>'" + p_colInx + "']/Data[contains(text(),'/SAVE')]");
			for(int c=0; c<colList.size(); c++) {
				Element cl = (Element) colList.get(c);
				String cInx = cl.getParentElement().getAttributeValue("Index");
				String[] s = cl.getText().split("[/]");//cl.getText()的格式如：33/10/X/SAVE
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
						if(!(s[2].equals("X"))){
							sql = "MERGE into SGCC_CELL_CHECK tab1 USING"
								+ " (select '"+p_dept+"' as dept_id,'"+p_type+"' as report_type,'"
								+this.sjlx+"' as sjlx,'"+s[0]+"' as report_col,'"+s[1]+"' as trans_date,'"+s[2]+"' as zb_seqno,'"
								+rl.getText()+"' as isablenull,'"+el.getText()+"' as queryunit ,'corp' as zblx from dual) tab2 on ( " 
								+"tab1.dept_id=tab2.dept_id and tab1.report_type=tab2.report_type and tab1.sjlx=tab2.sjlx and " 
								+"tab1.report_col=tab2.report_col and tab1.trans_date=tab2.trans_date and tab1.zb_seqno=tab2.zb_seqno and " 
								+"tab1.queryunit=tab2.queryunit and tab1.zblx = tab2.zblx )"
								+" when matched then update set isablenull = tab2.isablenull"
								+ " when not matched then insert ( checkid ,dept_id ,report_type ,sjlx ,report_col ,trans_date ," 
								+ " zb_seqno ,isablenull ,create_date ,create_userid ,queryunit,zblx )"
								+ " values ('" + SnUtil.getNewID() + "','"+p_dept+"','"+ p_type+"','"
								+this.sjlx+"','" +s[0]+ "','"+s[1]+"','" + s[2] + "','"+rl.getText()+"',sysdate,'"+this.userid+"','"+el.getText()+"','corp')";
						}
					}
					else if(editType.equals("delete")) {
						sql = "update SGCC_CELL_CHECK set isablenull ='"+rl.getText()+"'"
							+ " where dept_id = '"+p_dept+"' and report_type = '"+p_type+"' and " 
							+ "sjlx = '"+this.sjlx+"' and report_col = '"+s[0]+"' and trans_date = '"+s[1]+"' and " 
							+ "zb_seqno = '"+s[2]+"' and queryunit = '"+el.getText()+"' and zblx = 'corp'";
					}
					if(!sql.equals("")) {
						stmt.addBatch(sql);
						sql = "delete from SGCC_CELL_CHECK where isablenull = '0'";
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
	private boolean savInxCheckXml(Connection p_conn, Element p_root, 
			String p_sheetName, String p_rowInx, String p_colInx, 
			String p_dept,String p_type) {
		boolean flag = false;
		try {
			Statement stmt = p_conn.createStatement();
			//col遍历
			List colList = XPath.selectNodes(p_root,"/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index='" + p_rowInx  + "']/Cell[@Index>'" + p_colInx + "']/Data[contains(text(),'/SAVE')]");
			for(int c=0; c<colList.size(); c++) {
				Element cl = (Element) colList.get(c);
				String cInx = cl.getParentElement().getAttributeValue("Index");
				String[] s = cl.getText().split("[/]");//cl.getText()的格式如：33/10/X/SAVE
				//row遍历
				List rowList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index>'" + p_rowInx + "']/Cell[@Index='" + cInx + "']/Data");
				for(int r=0; r<rowList.size(); r++) {
					Element rl = (Element) rowList.get(r);
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
							sql = "MERGE into SGCC_CELL_CHECK tab1 USING"
							+ " (select '"+p_dept+"' as dept_id,'"+p_type+"' as report_type,'"
							+this.sjlx+"' as sjlx,'"+s[0]+"' as report_col,'"+s[1]+"' as trans_date,'"+n[0]+"' as zb_seqno,'"
							+v[0]+"' as isablenull,'"+s[2]+"' as queryunit,'inx' as zblx from dual) tab2 on ( " 
							+"tab1.dept_id=tab2.dept_id and tab1.report_type=tab2.report_type and tab1.sjlx=tab2.sjlx and " 
							+"tab1.report_col=tab2.report_col and tab1.trans_date=tab2.trans_date and tab1.zb_seqno=tab2.zb_seqno and " 
							+"tab1.queryunit=tab2.queryunit  and tab1.zblx=tab2.zblx)"
							+" when matched then update set isablenull = tab2.isablenull"
							+ " when not matched then insert ( checkid ,dept_id ,report_type ,sjlx ,report_col ,trans_date ," 
							+ " zb_seqno ,isablenull ,create_date ,create_userid ,queryunit,zblx )"
							+ " values ('" + SnUtil.getNewID() + "','"+p_dept+"','"
							+ p_type+"','"+this.sjlx+"','" +s[0]+ "','"+s[1]+"','" + n[0] + "','"+v[0]+"',sysdate,'"+this.userid+"','"+s[2]+"','inx')";
						}
						else if(editType.equals("delete")) {
							sql = "update SGCC_CELL_CHECK set isablenull ='"+v[0]+"'"
								+ " where dept_id = '"+p_dept+"' and report_type = '"+p_type+"' and " 
								+ "sjlx = '"+this.sjlx+"' and report_col = '"+s[0]+"' and trans_date = '"+s[1]+"' and " 
								+ "zb_seqno = '"+n[0]+"' and queryunit = '"+s[2]+"' and zblx = 'inx'";
						}
						if(!sql.equals("")) {
							stmt.addBatch(sql);
							sql = "delete from SGCC_CELL_CHECK where isablenull = '0'";
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

	private boolean savMixCheckXml(Connection p_conn, Element p_root, String p_sheetName, 
			String p_rowInx, String p_colInx,
			String p_dept,String p_type) {
		boolean flag = false;
		try {
			Statement stmt = p_conn.createStatement();
			List colList = XPath.selectNodes(p_root, "/Workbook/Worksheet[@Name='" + p_sheetName + "']/Table/Row[@Index='" + p_rowInx + "']/Cell[@Index>'" + p_colInx + "']/Data[contains(text(),'/SAVE')]");
			for(int c=0; c<colList.size(); c++) {
				Element cl = (Element) colList.get(c);
				String cInx = cl.getParentElement().getAttributeValue("Index");// X7/21/X/SAVE
				String[] s = cl.getText().split("[/]");
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
					String[] m = el.getText().split("[/]"); //001001/50150000000000
					String[] n = m[0].split("[*]");
					String sql = "";
					
					if(editType==null || editType.equals("update")) {
						//tab.col/date/ut or it/edit 
						sql = "MERGE into SGCC_CELL_CHECK tab1 USING"
							+ " (select '"+p_dept+"' as dept_id,'"+p_type+"' as report_type,'"
							+this.sjlx+"' as sjlx,'"+s[0]+"' as report_col,'"+s[1]+"' as trans_date,'"+n[0]+"' as zb_seqno,'"
							+rl.getText()+"' as isablenull,'"+m[1]+"' as queryunit,'mix' as zblx from dual) tab2 on ( " 
							+"tab1.dept_id=tab2.dept_id and tab1.report_type=tab2.report_type and tab1.sjlx=tab2.sjlx and " 
							+"tab1.report_col=tab2.report_col and tab1.trans_date=tab2.trans_date and tab1.zb_seqno=tab2.zb_seqno and " 
							+"tab1.queryunit=tab2.queryunit  and tab1.zblx=tab2.zblx)"
							+" when matched then update set isablenull = tab2.isablenull"
							+ " when not matched then insert ( checkid ,dept_id ,report_type ,sjlx ,report_col ,trans_date ," 
							+ " zb_seqno ,isablenull ,create_date ,create_userid ,queryunit,zblx )"
							+ " values ('" + SnUtil.getNewID() + "','"+p_dept+"','"
							+ p_type+"','"+this.sjlx+"','" +s[0]+ "','"+s[1]+"','" + n[0] + "','"+rl.getText()+"',sysdate,'"+this.userid+"','"+m[1]+"','mix')";

					}
					else if(editType.equals("delete")) {
						sql = "update SGCC_CELL_CHECK set isablenull ='"+rl.getText()+"'"
							+ " where dept_id = '"+p_dept+"' and report_type = '"+p_type+"' and " 
							+ "sjlx = '"+this.sjlx+"' and report_col = '"+s[0]+"' and trans_date = '"+s[1]+"' and " 
							+ "zb_seqno = '"+n[0]+"' and queryunit = '"+m[1]+"' and zblx = 'mix'";
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
				String colInx = col.getAttributeValue("Index");//所在列
				Element row = col.getParentElement();
				String rowInx = row.getAttributeValue("Index");//所在行
				Element sheet = row.getParentElement().getParentElement();
				String sheetName = sheet.getAttributeValue("Name");//所在表页
				//row遍历 rowInx这一行是控制全选操作的，剔除这一行，即rowInx+1
				List ls2 = XPath.selectNodes(oldRoot, 
						"/Workbook/Worksheet[@Name='" + sheetName + "']/Table/Row[@Index>" 
						+ (new Integer(rowInx)+1) + "]/Cell[@Index='" + colInx + "']/Data");
				for (int k = 0; k < ls2.size(); k++) {
					Element cll = (Element)ls2.get(k);
					String val = cll.getText();
					String r = cll.getParentElement().getParentElement().getAttributeValue("Index");//获取行号
					Element el = (Element)XPath.selectSingleNode(newRoot, 
							"/Workbook/Worksheet[@Name='" + sheetName + "']/Table/Row[@Index='" 
							+ r + "']/Cell[@Index='" + colInx + "']/Data");
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
			//如果不存在表页则新建Worksheet
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
	
	/**判断必填项是否为空
	 * @param p_type cell报表编码
	 * @param p_dept 报表使用单位
	 * @param p_date 要检查的时间
	 * @param p_unit 查询指标单位
	 */
	public String checkCell(String xmlStr, String p_type, String p_dept, String p_date, String p_unit){
		String flag = "OK";
		this.validateCheckCell(xmlStr, p_type, p_dept, p_date, p_unit);
		String str = this.getCheckSql(p_type, p_dept, p_date, p_unit);
		if(!str.equals("")){
			try {
				Context initCtx = new InitialContext();
				DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
				Connection conn = ds.getConnection();
				Statement stmt = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY);
				String sql = "select name,zb_seqno from ("+str+") where val is null";
				ResultSet rs = stmt.executeQuery(sql);
				if(rs.next()){
					rs.last(); //游标置最后一行，获取未填报单元格的总数
					flag = ""+rs.getRow()+"";
				}
				
				rs.close();
				stmt.close();
				conn.close();
				initCtx.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return flag;
	}
	/**
	 * 当定义过数据必填项后对原cell报表进行修改时，出现cell报表中指标范围和数据项和校验表中的定义项有偏差，对数据进行更正
	 * @param xmlStr
	 * @param p_type
	 * @param p_dept
	 * @param p_date
	 * @param p_unit
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public void validateCheckCell(String xmlStr, String p_type, String p_dept, String p_date, String p_unit){
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			String sql = "select max(sjlx) sjlx from SGCC_GUIDELINE_MODEL_MASTER where MODEL_TYPE='"+p_type+"' and DEPT_ID='"+p_dept+"' and SJLX<='"+p_date+"'";
			ResultSet rs = stmt.executeQuery(sql);
			if(rs.next()){
				String sjlx = rs.getString(1);
				
				SAXBuilder saxb = new SAXBuilder();
				Document xmlDoc = saxb.build(new StringReader(xmlStr));
				Element xmlRoot = xmlDoc.getRootElement();
				//sheet遍历
				List ls1 = XPath.selectNodes(xmlRoot, "/Workbook/Worksheet/Table/Row/Cell/Data[starts-with(text(),'table:')]");
				if(ls1.size()>0){
					for (int s = 0; s < ls1.size(); s++) {
						Element cll = (Element) ls1.get(s);
						String tabType = cll.getText().split("[:]")[1];
						Element col = cll.getParentElement();
						String colInx = col.getAttributeValue("Index");
						Element row = col.getParentElement();
						String rowInx = row.getAttributeValue("Index");
						Element sheet = row.getParentElement().getParentElement();
						String sheetName = sheet.getAttributeValue("Name");
						
						if(tabType.equals("corp")) {
							String filterStr = "";
							List rowList = XPath.selectNodes(xmlRoot, "/Workbook/Worksheet[@Name='" + sheetName + "']/Table/Row[@Index>" + rowInx + "]/Cell[@Index='" + colInx + "']/Data");
							for (int r = 0; r < rowList.size(); r++) {
								Element rl = (Element)rowList.get(r);
								String rTxt = rl.getText();
								filterStr += ",'" + rTxt + "'";
							}
							
							List colList = XPath.selectNodes(xmlRoot, "/Workbook/Worksheet[@Name='" + sheetName + "']/Table/Row[@Index='" + rowInx + "']/Cell[@Index>'" + colInx + "']/Data[contains(text(),'/SAVE')]");
							for(int c=0; c<colList.size(); c++) {
								Element cl = (Element) colList.get(c);
								String[] text = cl.getText().split("[/]");//格式如：33/10/001001/SAVE
								String _sql = "delete from sgcc_cell_check where dept_id = '" + p_dept + "'"
											 +" and report_type = '" + p_type + "' and sjlx = '" + sjlx + "' "
											 +" and report_col = '" + text[0] + "' and trans_date = '" + text[1] + "'" 
											 +" and zblx = 'corp' and zb_seqno = '" + text[2] + "'"
											 +" and queryunit not in (''''" + filterStr + ")";
								stmt.addBatch(_sql);
							}
						}
						else if(tabType.equals("inx")) {
							String filterStr = "";
							List rowList = XPath.selectNodes(xmlRoot, "/Workbook/Worksheet[@Name='" + sheetName + "']/Table/Row[@Index>" + rowInx + "]/Cell[@Index='" + colInx + "']/Data");
							for (int r = 0; r < rowList.size(); r++) {
								Element rl = (Element)rowList.get(r);
								String rTxt = rl.getText();
								filterStr += ",'" + rTxt + "'";
							}
							
							List colList = XPath.selectNodes(xmlRoot, "/Workbook/Worksheet[@Name='" + sheetName + "']/Table/Row[@Index='" + rowInx + "']/Cell[@Index>'" + colInx + "']/Data[contains(text(),'/SAVE')]");
							for(int c=0; c<colList.size(); c++) {
								Element cl = (Element) colList.get(c);
								String[] text = cl.getText().split("[/]");//格式如：33/10/X/SAVE
								String _sql = "delete from sgcc_cell_check where dept_id = '" + p_dept + "'"
											 +" and report_type = '" + p_type + "' and sjlx = '" + sjlx + "' "
											 +" and report_col = '" + text[0] + "' and trans_date = '" + text[1] + "'" 
											 +" and zblx = 'inx' and queryunit = '" + text[2] + "'"
											 +" and zb_seqno not in (''''" + filterStr + ")";
								//System.out.println(_sql);
								stmt.addBatch(_sql);
							}
						}
						else if(tabType.equals("mix")) {
							String filterStr = "";
							List rowList = XPath.selectNodes(xmlRoot, "/Workbook/Worksheet[@Name='" + sheetName + "']/Table/Row[@Index>" + rowInx + "]/Cell[@Index='" + colInx + "']/Data");
							for (int r = 0; r < rowList.size(); r++) {
								Element rl = (Element)rowList.get(r);
								String rTxt = rl.getText();
								filterStr += ",'" + rTxt + "'";
							}
							
							List colList = XPath.selectNodes(xmlRoot, "/Workbook/Worksheet[@Name='" + sheetName + "']/Table/Row[@Index='" + rowInx + "']/Cell[@Index>'" + colInx + "']/Data[contains(text(),'/SAVE')]");
							for(int c=0; c<colList.size(); c++) {
								Element cl = (Element) colList.get(c);
								String[] text = cl.getText().split("[/]");//格式如：33/10/X/SAVE
								String _sql = "delete from sgcc_cell_check where dept_id = '" + p_dept + "'"
											 +" and report_type = '" + p_type + "' and sjlx = '" + sjlx + "' "
											 +" and report_col = '" + text[0] + "' and trans_date = '" + text[1] + "'" 
											 +" and zb_seqno||'/'||queryunit not in (''''" + filterStr + ")"
											 +" and zblx = 'mix'";
								stmt.addBatch(_sql);
							}
						}
					}
				}else{
					String _sql = "delete from sgcc_cell_check where dept_id = '" + p_dept + "' and report_type = '" + p_type + "' and sjlx = '" + sjlx + "' ";
					stmt.addBatch(_sql);
				}
				stmt.executeBatch();
				stmt.close();
				conn.close();
				initCtx.close();
			}
		} catch (Exception e) {	}
	}
	
	public String getCheckSql(String p_type, String p_dept, String p_date, String p_unit){
		String  str = "";
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			String sql = "select report_col,trans_date,zblx, zb_seqno,queryunit from sgcc_cell_check where " 
						+" sjlx = (select max(sjlx) from SGCC_GUIDELINE_MODEL_MASTER" 
						+" where MODEL_TYPE='"+p_type+"' and DEPT_ID='"+p_dept+"' and SJLX<='"+p_date+"') and "
						+" dept_id = '"+p_dept+"' and report_type = '"+p_type+"' and isablenull = '1' order by zb_seqno";
			ResultSet rs = stmt.executeQuery(sql);
			while(rs.next()) {
				String tabCol = (String)colMap.get(rs.getString(1).toUpperCase());
				String[] t = tabCol.split("[.]");
				String unit_id = (("inx").equals(rs.getString(3)))?(("X".equals(rs.getString(5)))?p_unit:(rs.getString(5))):(rs.getString(5));
				if(!str.equals("")){
					str += " union all ";
				}
				str += "select a.*,b." + t[1] + "||'' as val from 	(select t1.*,t2.name from "
				    + "(select '"+rs.getString(4)+"' as zb_seqno,'"+unit_id+"' as unit_id," 
				    + "'"+props.transDate(p_date, rs.getString(2))+"' as sj_type,'"+rs.getString(3)
				    +"' as zblx, '"+rs.getString(2)+"' as trans_date, '"+rs.getString(5)+"' as queryunit,'"+rs.getString(1)+"' as report_col  from dual) t1,	" 
				    + " sgcc_guideline_info t2 where t1.zb_seqno = t2.zb_seqno(+)) a,"+t[0]+" b" 
				    + " where  a.unit_id = b.unit_id(+) and a.zb_seqno = b.zb_seqno(+) and " 
				    + "a.sj_type = b.sj_type(+)";
			}
			
			rs.close();
			stmt.close();
			conn.close(); 
			initCtx.close();
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return str;
	}
	/**
	 * 删除定义过的校验数据项,重新定义报表后出现指标的范围不一致时，应该先全部清除定义的校验项后重新定义
	 * @param p_type
	 * @param p_dept
	 * @param p_date
	 */
	public void delCellCheck(String p_type, String p_dept, String p_date){
		try {
			Context initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
			Connection conn = ds.getConnection();
			Statement stmt = conn.createStatement();
			
			String sql  = "delete from sgcc_cell_check where dept_id = '"+p_dept+"' and report_type = '"+p_type+"' and sjlx = '"+p_date+"'";
			stmt.execute(sql);
			stmt.close();
			conn.close();
			initCtx.close();
		}catch(Exception e) {
			e.printStackTrace();
		}
	}
	/**标记未填写数据的cell单元格
	 * @author liangwj
	 * @param p_xml 
	 * @param p_type 报表类型
	 * @param p_dept 报表的使用单位
	 * @param p_date 数据的所在时间
	 * @param p_unit 保存数据时用的单位
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	public String markCell(String p_xml, String p_type, String p_dept, String p_date, String p_unit){
		Document m_doc = new Document(new Element("Workbook"));
		Element m_root = m_doc.getRootElement();
		HashMap rcMap = new HashMap();
		String str = this.getCheckSql(p_type, p_dept, p_date, p_unit);
		try {
			if(!"".equals(str)){
				Context initCtx = new InitialContext();
				DataSource ds = (DataSource)JNDIUtil.lookup(initCtx);
				Connection conn = ds.getConnection();
				Statement stmt = conn.createStatement();
				String sql = "select (case zblx when 'inx' then report_col||'/'||trans_date||'/'||queryunit||'/SAVE' "
							+" when 'corp' then  report_col||'/'||trans_date||'/'||zb_seqno||'/SAVE'"
							+" when 'mix' then  report_col||'/'||trans_date||'/X/SAVE' end ) cval ," 
							+" (case zblx  when 'inx' then zb_seqno when 'corp' then queryunit when 'mix' then"
							+" zb_seqno||'/'||queryunit end) rval, t.zblx" +" from (" 
							+ this.getCheckSql(p_type, p_dept, p_date, p_unit) +" ) t where val is null order by zblx,zb_seqno";
				ResultSet rs = stmt.executeQuery(sql);
				
				while(rs.next()){
					rcMap.put(rs.getString(2)+":"+rs.getString(1), rs.getString(3));
				}
				//System.out.println(rcMap.toString());
				rs.close();
				stmt.close();
				conn.close();
				initCtx.close();
				
				if(!rcMap.isEmpty()){
					
					SAXBuilder sb = new SAXBuilder();
					Document markdoc = sb.build(new StringReader(p_xml));
					
					Element root = markdoc.getRootElement();
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
						
						Element sheetE = new Element("Worksheet");
						sheetE.setAttribute("Name", sheetName);
		
						if(rcMap.containsValue(tabType)){
							List colList = XPath.selectNodes(root, "/Workbook/Worksheet[@Name='" + sheetName + "']/Table/Row[@Index=" + rowIndex + "]/Cell[@Index>'" + colIndex + "']/Data[contains(text(),'/SAVE')]");
							for(int c=0;c<colList.size();c++){
								Element cl = (Element) colList.get(c);
								String cTxt = cl.getText();
								
								if(!cTxt.equals("")){
									List rowList = XPath.selectNodes(root, "/Workbook/Worksheet[@Name='" + sheetName + "']/Table/Row[@Index>" + rowIndex + "]/Cell[@Index='" + colIndex + "']/Data");
									for(int r=0;r<rowList.size();r++){
										Element rl = (Element)rowList.get(r);
										String rTxt = rl.getText();
										if(rcMap.containsKey(rTxt+":"+cTxt)){
											Element cell = new Element("Cell");
											cell.setAttribute("colIndex", cl.getParentElement().getAttributeValue("Index"));
											cell.setAttribute("rowIndex", rl.getParentElement().getParentElement().getAttributeValue("Index"));
											sheetE.addContent(cell);
										};
									}
								}
							}
							if(sheetE.getChildren().size()!=0){
								m_root.addContent(sheetE);
							}
						}
					}
					//System.out.println(this.toString(m_doc, "GBK"));	
				}
			}	
		} catch (Exception e) {
			e.printStackTrace();
		}
		return this.toString(m_doc, "GBK");
	}
}
