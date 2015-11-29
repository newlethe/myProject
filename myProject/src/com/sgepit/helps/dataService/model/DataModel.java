/** 
 * Title:        数据交互服务应用: 
 * Description:  数据主体模型应用
 * Company:      sgepit
 */
package com.sgepit.helps.dataService.model;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.dom4j.Element;

import com.sgepit.helps.dataService.exception.DataHelpException;
import com.sgepit.helps.dataService.exception.DataTypeException;
import com.sgepit.helps.dbService.ConnectFactory;
import com.sgepit.helps.dbService.exception.DbPropertyException;

/**
 * 数据主体模型
 * @author lizp
 * @Date 2010-8-10
 */
public class DataModel {
	private List<HeaderBean> header = new ArrayList<HeaderBean>() ;
	private List<DataRowBean> datas = new ArrayList<DataRowBean>() ;
	private String tableName ;  //数据交互中作为表名，excel导出中作为sheet页的名称
	private Map<String,String> propertys = new HashMap<String,String>(); //其他配置信息
	
	public String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	public List<HeaderBean> getHeader() {
		return header;
	}
	public void setHeader(List<HeaderBean> header) {
		this.header = header;
	}
	
	public List<DataRowBean> getDatas() {
		return datas;
	}
	public void setDatas(List<DataRowBean> datas) {
		this.datas = datas;
	}
	
	public Map<String, String> getPropertys() {
		return propertys;
	}
	public void setPropertys(Map<String, String> propertys) {
		this.propertys = propertys;
	}
	public void addPropertys(String key,String value) {
		this.propertys.put(key, value) ;
	}
	
	/**
	 * 构造表头xml对象
	 * @param head
	 */
	public void buildHeader(Element head) {
		if(this.header!=null) {
			for(HeaderBean bean : this.header) {
				Element column = head.addElement("column");
				column.addAttribute("index", bean.getIndex()+"") ;
				column.addAttribute("type", bean.getType()) ;
				column.addAttribute("name", bean.getName());
				column.addAttribute("nullType", bean.getNullType()+"");
				column.addAttribute("colType", bean.getColType()+"");
			}
			//add propertys
			if(this.propertys!=null) {
				Iterator<String> keyIterator = this.propertys.keySet().iterator();
				while(keyIterator.hasNext()) {
					String key = keyIterator.next() ;
					String value = this.propertys.get(key) ;
					head.addAttribute(key, value) ;
				}
			}
		}
	}
	
	/**
	 * 构造数据主体xml对象
	 * @param table
	 * @throws DataTypeException 
	 */
	
	public void buildDatas(Element table) throws DataTypeException  {
		if(this.datas!=null) {
			for(DataRowBean row : this.datas) {
				if(row!=null) {
					Element rowElement = table.addElement("row");
					List<DataColBean> cols = row.getCols();
					if(cols!=null) {
						for(DataColBean col : cols) {
							Element colElelemt = rowElement.addElement("col");
							colElelemt.addAttribute("index", col.getIndex()+"");
							HeaderBean bean = getHeadByIndex(col.getIndex());
							if(bean!=null) {
								colElelemt.addCDATA(HeaderBean.TranColValueToString(bean.getType(),col.getValue()));
							}
						}
					}
				}
			}
		}
	}
	
	/**
	 * 通过索引获得头对象
	 * @param index
	 * @return
	 */
	private HeaderBean getHeadByIndex(int i) {
		List<HeaderBean> list = this.header;
		return HeaderBean.getHeadByIndex(list, i) ;
	}
	/**
	 * 构造数据集合
	 * @param sql
	 * @param tableName
	 * @throws DataHelpException 
	 */
	public void buildDataObject(String sql, String tableName) throws DataHelpException {
		this.tableName = tableName ;
		List<HeaderBean> header = new ArrayList<HeaderBean>() ;
		List<DataRowBean> datas = new ArrayList<DataRowBean>() ;
		Connection con = null ;
		try {
			int rowNumber = 0 ;
			con = ConnectFactory.getConnection();
			if(con!=null)  {
				Statement stmt = con.createStatement();
				ResultSet rs = stmt.executeQuery(sql);
				ResultSetMetaData rsmd = rs.getMetaData();
				int columnCount = rsmd.getColumnCount();
				while(rs.next())  {
					DataRowBean row = new DataRowBean();
					List<DataColBean> cols = new ArrayList<DataColBean>() ;
					for(int i=0;i<columnCount;i++){
						Object value = rs.getObject(i+1);
						String name = rsmd.getColumnName(i+1) ;
						String type = rsmd.getColumnTypeName(i+1) ;
						if(rowNumber==0) {  //第一行
							HeaderBean head = new HeaderBean() ;
							head.setIndex(i+1) ;
							head.setType(type) ;
							head.setName(name) ;
							header.add(head) ;
						}
						if(value!=null) {
							DataColBean col = new DataColBean();
							col.setIndex(i+1) ;
							col.setValue(value) ;
							cols.add(col) ;
						}
					}
					row.setRownum(rowNumber++) ;
					row.setCols(cols) ;
					datas.add(row) ;
				}
				rs.close() ;
				stmt.close() ;
			}else{
				throw new DataHelpException("数据连接获取异常！") ;
			}
		} catch (SQLException e) {
			throw new DataHelpException("由sql生成数据主体对象出错！") ;
		} catch (DbPropertyException e) {
			throw new DataHelpException(e) ;
		} finally {			
			if(con!=null) {
				try {
					con.close() ;
				} catch (SQLException e) {
					throw new DataHelpException("关闭连接失败！") ;
				}
			}
		}
		this.datas = datas ;
		this.header = header ;
	}
}
