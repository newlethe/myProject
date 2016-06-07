/** 
 * Title:        数据交互服务应用: 
 * Description:  数据处理应用
 * Company:      sgepit
 */
package com.sgepit.helps.dataService;

import java.io.StringReader;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.Node;

import com.sgepit.helps.dataService.exception.DataActionException;
import com.sgepit.helps.dataService.exception.DataTypeException;
import com.sgepit.helps.dataService.model.HeaderBean;
import com.sgepit.helps.dbService.ConnectFactory;
import com.sgepit.helps.dbService.DbUtil;
import com.sgepit.helps.dbService.ExecuteSql;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.dbService.sqlHelp.BuildSql;
import com.sgepit.helps.scriptService.ScriptUtil;
import com.sgepit.helps.util.StringUtil;

/**
 * 数据交互服务解析框架
 * @author lizp
 * @Date 2010-8-10
 */
public class DataXmlAction {
	/**
	 * 解析数据交互xml请求
	 * @param xml 数据交互xml请求
	 * @return
	 * @throws SQLException 
	 * @throws DataActionException
	 * @throws DbPropertyException 
	 * @throws DataTypeException 
	 */
	public static String dataXmlParse(String xml) throws DataActionException, SQLException, DbPropertyException, DataTypeException {
		Document returnDocument = DocumentHelper.createDocument() ;
		Connection con = null ;
		try {
			if(xml!=null) {
				con = ConnectFactory.getConnection();
				if(con==null) {
					throw new DataActionException("数据连接获取异常！") ;
				}
				
				Document document = DocumentHelper.parseText(xml);
				List<Element> list = document.selectNodes("/data/table") ;
				Element Edata = returnDocument.addElement("data");
				Element state = Edata.addElement("state");
				state.setText("1") ;
				Element Etable = Edata.addElement("table");
				if(list!=null) {
					for(Element table : list) {
						bulidSqlByTable(table,Etable,con);
					}
				}
			}
		} catch (DbPropertyException e) {
			throw e ;
		} catch (DocumentException e) {
			throw new DataActionException("解析交互xml异常！",e);
		} catch (DataTypeException e) {
			throw e ;
		} finally {
			if(con!=null) {
				con.close();
			}
		}
		return returnDocument.asXML() ;
	}
	
	/**
	 * 数据处理(前后置事件执行、数据主体数据插入)
	 * @param table xml的table对象
	 * @param etable 返回的xml的table对象
	 * @param con 数据连接
	 * @throws DataTypeException 
	 */
	private static void bulidSqlByTable(Element table, Element etable, Connection con) throws DataTypeException  {
		String tableName = table.getText();
		//执行前置事件
		List<Element> beforeList = table.elements("before");
		if(beforeList!=null) {
			bulidEvent(beforeList,etable,"before",con) ;
		}
		
		Element header = table.element("header");
		if(header!=null) {
			String type = header.attributeValue("type") ;
			if("saveOrUpdate".equals(type)){
				bulidsaveOrUpdateSql(table,tableName,etable,con,header);
			}else{
				bulidNormalSql(table,tableName,etable,con);
			}
		}
		
		//执行后置事件
		List<Element> afterList = table.elements("after");
		if(afterList!=null) {
			bulidEvent(afterList,etable,"after",con) ;
		}
	}
	
	
	private static void bulidsaveOrUpdateSql(Element table, String tableName, Element etable,Connection con,Element header) {
		try {
			String keys = header.attributeValue("keys") ;
			BuildSql sqlbuilder = new BuildSql();
			sqlbuilder.setTableName(tableName) ;
			ExecuteSql sqlExecute = ExecuteSql.getEsql() ;
			sqlExecute.setCon(con) ;
			if(keys!=null) {
				List<String> keyList = StringUtil.arrayToList(keys.split("[,]")) ;
				int size = 0 ;
				List<Element> columns = table.selectNodes("./header/column");
				List<HeaderBean> list = new ArrayList<HeaderBean>();
				if(columns!=null&&columns.size()>0) {
					for(Element column : columns ){
						HeaderBean bean = new HeaderBean();
						bean.setValuesByElement(column);
						list.add(bean) ;
						String name = column.attributeValue("name") ;
					}
					try {
						List<Element> rows = table.elements("row");
						if(rows!=null) {
							for(Element row : rows) {
								Map<String, Object> sukeys = new HashMap<String, Object>();
								Map<String, Object> suvalues = new HashMap<String, Object>(); 
								String uuid = StringUtil.getAllUUID() ;
								List<Element> cols = row.elements("col");
								for(Element col : cols) {
									String index = col.attributeValue("index") ;
									String isencode = col.attributeValue("isencode") ;
									int i = Integer.parseInt(index) ;
									if(i>0) {
										HeaderBean headbean = HeaderBean.getHeadByIndex(list, index);
										String text = col.getText() ;
										if("1".equals(isencode)) {   //如果已经编码
											text = VariableCoding.decode(text) ;
										}
										String name = headbean.getName() ;
										Object objectValue = headbean.getObjectValue(text) ;
										if(keyList.contains(name)){
											sukeys.put(name, objectValue) ;
										}else{
											suvalues.put(name, objectValue) ;
										}
									}
								}
								sqlbuilder.BuildSaveOrUpdateSql(sukeys, suvalues) ;
								int s = sqlExecute.executesqlSize(sqlbuilder.getSql(), sqlbuilder.getObj()) ;
								size += s ;
							}
						}
						
						etable.addAttribute("flag", "1") ;
						etable.setText("更新"+size+"条数据成功") ;
					} catch (Exception e) {
						etable.addAttribute("flag", "0") ;
						updateAllState(etable, "0") ;
						etable.setText(e.getMessage()) ;
					}
				}
				
				
				
			}else{
				throw new Exception("缺乏关键属性keys！");
			}
		} catch (Exception e) {
			etable.addAttribute("flag", "0") ;
			updateAllState(etable, "0") ;
			etable.setText(e.getMessage()) ;
		}
	}

	private static void bulidNormalSql(Element table,String tableName,Element etable,Connection con) {
		//处理table数据部分
		List<Element> columns = table.selectNodes("./header/column");
		List<HeaderBean> list = new ArrayList<HeaderBean>();
		if(columns!=null&&columns.size()>0) {
			String sql = "insert into "+tableName ;
			String lable = "" ;
			String value = "" ;
			for(Element column : columns ){
				HeaderBean bean = new HeaderBean();
				bean.setValuesByElement(column);
				list.add(bean) ;
				String name = column.attributeValue("name") ;
				lable += "," +name ;
				value += ",?" ;
			}
			sql = sql+" ("+lable.substring(1)+") values (" + value.substring(1)+")" ;
			
			try {
				PreparedStatement pstmt = con.prepareStatement(sql) ;
				List<Element> rows = table.elements("row");
				int size = 0 ;
				int failSize = 0 ;
				boolean f = true ;
				if(rows!=null) {
					for(Element row : rows) {
						bulidTableRow(row,pstmt,list) ;
					}
					int[] rs = pstmt.executeBatch() ;
					for(int i : rs) {
						if(i==Statement.SUCCESS_NO_INFO) {
							size ++ ;
						}else if (i==Statement.EXECUTE_FAILED) {
							failSize ++ ;
						}else if(i>-1) {
							f = false ;
							size += i ;
						}
					}
				}
				
				if(pstmt!=null) {
					pstmt.close() ;
				}
				String text = "插入"+size+"条数据成功！" ;
				if(f) {
					text = "执行成功"+size+"条！" ;
					if(failSize>0) {
						text += "执行失败"+failSize+"条！"; 
					}
				}
				
				etable.addAttribute("flag", "1") ;
				etable.setText(text) ;
			} catch (Exception e) {
				etable.addAttribute("flag", "0") ;
				updateAllState(etable, "0") ;
				etable.setText(e.getMessage()) ;
			}
		}
	}

	/**
	 * 生成行对象sql
	 * @param row xml行对象
	 * @param pstmt 预编译的statement
	 * @param headerBeans 头对象
	 * @return 更新数据库条数
	 * @throws DataTypeException 
	 * @throws SQLException 
	 */
	private static void bulidTableRow(Element row, PreparedStatement pstmt, List<HeaderBean> headerBeans) throws DataTypeException, SQLException  {
		String uuid = StringUtil.getAllUUID() ;
		List<Element> cols = row.elements("col");
		for(Element col : cols) {
			String index = col.attributeValue("index") ;
			String isencode = col.attributeValue("isencode") ;
			int i = Integer.parseInt(index) ;
			if(i>0) {
				HeaderBean header = HeaderBean.getHeadByIndex(headerBeans, index);
				String text = col.getText() ;
				if("1".equals(isencode)) {   //如果已经编码
					text = VariableCoding.decode(text) ;
				}
				header.setValue(text) ;
				header.setUuid(uuid) ;
			}
		}
		pstmt.clearParameters() ;
		int k = 0 ;
		for(HeaderBean bean : headerBeans) {
			k++ ;
//			int i = bean.getIndex() ;
			Object obj = bean.getValue() ;
			String type = bean.getType() ;
			if(uuid.equals(bean.getUuid())) { //当前行处理过的数据
				if(obj==null||type==null) {
					pstmt.setNull(k, bean.getNullType()) ;
				}else{
					try {
						bean.setPstmtObjectValue(k,pstmt) ;
					} catch (Exception e) {
						
					}
				}
			}else{
				pstmt.setNull(k, bean.getNullType()) ;
			}
		}
		pstmt.addBatch();
	}
	
	/**
	 * 前置后续事件处理
	 * @param list 事件集合
	 * @param etable 返回对象
	 * @param str 前后置事件标识
	 * @param con 数据库连接
	 * @throws DataTypeException 
	 */
	private static void bulidEvent(List<Element> list,  Element etable, String str, Connection con) throws DataTypeException  {
		if(list!=null&&list.size()>0)  {
			for(Element el : list) {
				Element ebel = etable.addElement(str);
				String type = el.attributeValue("type") ;
				String isencode = el.attributeValue("isencode") ;
				ebel.addAttribute("type", type) ;
				if("sql".equalsIgnoreCase(type)) {
					String text = el.getText() ;
					if("1".equals(isencode)) {   //如果为已编码
						text =  VariableCoding.decode(text) ;
					}
					if(text!=null&&(!"".equals(text))) {
						executeSql(text,null,con,ebel);
					}else{
						ebel.addAttribute("flag", "1") ;
						ebel.setText("事件内容为空！") ;
					}
				}else if("script".equalsIgnoreCase(type)) {
					doScriptEvent(el,ebel) ;
				}
			}
		}
	}
	
	/**
	 * 脚本事件执行
	 * @param el 事件对象
	 * @param ebel 返回值对象
	 * @throws DataTypeException 
	 */
	private static void doScriptEvent(Element el, Element ebel) throws DataTypeException  {
		String isencode = el.attributeValue("isencode") ;
		String text = el.getText() ;
		Map map = new HashMap() ;
		List<Element> variables = el.elements("variable");
		if(variables!=null) {
			for(Element e : variables) {
				String type = e.attributeValue("type") ;
				String id = e.attributeValue("id") ;
				String encode = e.attributeValue("isencode") ;
				String value = e.getText() ;
				if("1".equals(encode)) {
					value = VariableCoding.decode(value) ;
				}
				Object val = tranObjectValue(type,value) ;
				map.put(id, val) ;
			}
		}
		if(text!=null) {
			if("1".equals(isencode))  {   //如果加密后
				text = VariableCoding.decode(text) ;
			}
			try {
				Object obj = ScriptUtil.exeScript(text, map) ;
				ebel.addAttribute("flag", "1") ; //返回执行成功
				ebel.addAttribute("isencode", "1") ; //是否加密
				ebel.setText(VariableCoding.encode(StringUtil.objectToString(obj))) ;
			} catch (Exception e) {
				ebel.addAttribute("flag", "0") ; //返回执行失败
				ebel.setText(e.getMessage()) ;
				updateAllState(ebel,"0") ;
			}
		}
	}
	
	/**
	 * 更新返回状态
	 * @param ebel
	 * @param string
	 * @param message
	 */
	private static void updateStateFlag(Element e, String state,String message) {
		List<Element> node = e.selectNodes("/data/state");
		if(node!=null&&node.size()>0) {
			Element stateEl = node.get(0);
			String flag = stateEl.attributeValue("flag") ;
			if("1".equalsIgnoreCase(flag)&&"0".equalsIgnoreCase(state)) {
				stateEl.addAttribute("flag", "0") ;
				stateEl.setText(message) ;
			} else {
				stateEl.addAttribute("flag", "1") ;
			}
		}
	}

	/**
	 * 变量数据类型转换
	 * 目前仅处理了Integer，BigDecimal，Date类型，其他都以String
	 * @param type 类型字符串
	 * @param value 字符串值
	 * @return
	 */
	private static Object tranObjectValue(String type, String value) {
		Object str = value ;
		// TODO
		if("java.lang.Integer".equalsIgnoreCase(type)) {
			str = Integer.parseInt(value) ;
		} else if("java.math.BigDecimal".equalsIgnoreCase(type)) {
			str = new BigDecimal(value) ;
		} else if("java.util.Date".equalsIgnoreCase(type)) {
			str = new java.util.Date(value) ;
		} else if("java.sql.Date".equalsIgnoreCase(type)) {
			str = java.sql.Date.valueOf(value) ;
		}
		return str;
	}

	/**
	 * 调用sql
	 * @param sql 预编译sql语句
	 * @param obj 参数数组
	 * @param con 连接
	 * @param el 返回xml对象
	 */
	private static void executeSql(String sql,Object[] obj, Connection con, Element el) {
		try {
			PreparedStatement pstmt = con.prepareStatement(sql) ;
			if(obj!=null) {
				for (int i = 0; i < obj.length; i++) {
					setObjectToPreparedStatement(pstmt,i + 1,obj[i]) ;
				}
			}
			pstmt.execute() ;
			int count = pstmt.getUpdateCount();
			if(pstmt!=null){
				pstmt.close() ;
				el.addAttribute("flag", "1") ;
				if(count==-1) {
					count = 0 ;
				}
				el.addCDATA("更新了"+count+"条记录！") ;
			}
		} catch (SQLException e) {
			el.addAttribute("flag", "0") ;
			updateAllState(el,"0");
			el.addCDATA(e.getMessage()) ;
		}
	}

	/**
	 * 设置预编译参数
	 * @param pstmt
	 * @param index
	 * @param obj
	 * @throws SQLException 
	 */
	private static void setObjectToPreparedStatement(PreparedStatement pstmt,int index,Object obj) throws SQLException {
		if(obj instanceof String &&obj.toString().length()>3999) {
			String objStr = obj.toString() ;
			pstmt.setCharacterStream(index, new StringReader(objStr), objStr.length()) ;
		} else {
			pstmt.setObject(index, obj) ;
		}
	}
	
	/**
	 * 更新全局状态
	 * @param el
	 * @param string
	 */
	private static void updateAllState(Element el, String flag) {
		Node state = el.selectSingleNode("/data/state");
		state.setText(flag) ;
	}
}
