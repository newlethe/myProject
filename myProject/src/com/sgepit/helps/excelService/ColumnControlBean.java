/** 
 * Title:        excel应用: 
 * Description:  excel应用
 * Company:      sgepit
 */
package com.sgepit.helps.excelService;

import com.sgepit.helps.dataService.model.HeaderBean;

/**
 * 列控制对象
 * @author lizp
 * @Date 2010-8-19
 */
public class ColumnControlBean {
	public static int COL_TYPE_NONE = 0 ;
	public static int COL_TYPE_NOTNULL = 1 ;
	public static int COL_TYPE_KEY = 2 ;
	public static int COL_TYPE_AUTOUUID = 9 ;
	private int rowIndex ;  //行号
	private int colIndex ; //列号
	private String tableName ;  //表名
	private String colName ;  //列名
	private String colLabel ;  //列标识名
	private String dbType ; //数据库类型
	private int keyType ; //主键类型(0为不控制，1为不为空，2为主键，9为自动uuid填充值)为主键时可以多个构成联合主键，主键时使用saveOrUpdate更新
	
	public String getColLabel() {
		return colLabel;
	}
	public void setColLabel(String colLabel) {
		this.colLabel = colLabel;
	}
	public int getRowIndex() {
		return rowIndex;
	}
	public void setRowIndex(int rowIndex) {
		this.rowIndex = rowIndex;
	}
	public int getColIndex() {
		return colIndex;
	}
	public void setColIndex(int colIndex) {
		this.colIndex = colIndex;
	}
	public String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	public String getColName() {
		return colName;
	}
	public void setColName(String colName) {
		if(colName!=null) {
			colName = colName.toLowerCase() ;
		}
		this.colName = colName;
	}
	public String getDbType() {
		return dbType;
	}
	public void setDbType(String dbType) {
		this.dbType = dbType;
	}
	public int getKeyType() {
		return keyType;
	}
	public void setKeyType(int keyType) {
		this.keyType = keyType;
	}
	
	/**
	 * 获得头对象
	 * @return
	 */
	public HeaderBean getByHeadBean() {
		HeaderBean bean = new HeaderBean();
		bean.setColType(keyType) ;
		bean.setIndex(colIndex) ;
		bean.setName(colName) ;
		bean.setType(dbType) ;
		bean.setValue(colLabel) ;
		return bean;
	}
	
}
