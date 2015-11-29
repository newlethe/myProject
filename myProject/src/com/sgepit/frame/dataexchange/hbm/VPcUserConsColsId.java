package com.sgepit.frame.dataexchange.hbm;

/**
 * VPcUserConsColsId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class VPcUserConsColsId implements java.io.Serializable {

	// Fields
	private String tableName;
	private String columnName;
	private String constraintName;

	// Constructors

	public VPcUserConsColsId() {
	}

	public VPcUserConsColsId(String tableName, String columnName,String constraintName) {
		this.tableName = tableName;
		this.columnName = columnName;
		this.constraintName = constraintName;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getColumnName() {
		return columnName;
	}

	public void setColumnName(String columnName) {
		this.columnName = columnName;
	}

	public String getConstraintName() {
		return constraintName;
	}

	public void setConstraintName(String constraintName) {
		this.constraintName = constraintName;
	}

}