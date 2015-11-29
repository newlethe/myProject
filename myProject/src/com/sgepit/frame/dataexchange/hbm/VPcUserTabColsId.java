package com.sgepit.frame.dataexchange.hbm;

/**
 * VPcUserTabColsId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class VPcUserTabColsId implements java.io.Serializable {

	// Fields

	private String tableName;
	private String columnName;
	private String dataType;

	// Constructors

	/** default constructor */
	public VPcUserTabColsId() {
	}

	/** minimal constructor */
	public VPcUserTabColsId(String tableName, String columnName) {
		this.tableName = tableName;
		this.columnName = columnName;
	}

	/** full constructor */
	public VPcUserTabColsId(String tableName, String columnName, String dataType) {
		this.tableName = tableName;
		this.columnName = columnName;
		this.dataType = dataType;
	}

	// Property accessors

	public String getTableName() {
		return this.tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getColumnName() {
		return this.columnName;
	}

	public void setColumnName(String columnName) {
		this.columnName = columnName;
	}

	public String getDataType() {
		return this.dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof VPcUserTabColsId))
			return false;
		VPcUserTabColsId castOther = (VPcUserTabColsId) other;

		return ((this.getTableName() == castOther.getTableName()) || (this
				.getTableName() != null
				&& castOther.getTableName() != null && this.getTableName()
				.equals(castOther.getTableName())))
				&& ((this.getColumnName() == castOther.getColumnName()) || (this
						.getColumnName() != null
						&& castOther.getColumnName() != null && this
						.getColumnName().equals(castOther.getColumnName())))
				&& ((this.getDataType() == castOther.getDataType()) || (this
						.getDataType() != null
						&& castOther.getDataType() != null && this
						.getDataType().equals(castOther.getDataType())));
	}

	public int hashCode() {
		int result = 17;

		result = 37 * result
				+ (getTableName() == null ? 0 : this.getTableName().hashCode());
		result = 37
				* result
				+ (getColumnName() == null ? 0 : this.getColumnName()
						.hashCode());
		result = 37 * result
				+ (getDataType() == null ? 0 : this.getDataType().hashCode());
		return result;
	}

}