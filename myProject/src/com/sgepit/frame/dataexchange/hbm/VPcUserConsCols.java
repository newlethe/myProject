package com.sgepit.frame.dataexchange.hbm;

/**
 * VPcUserConsCols entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class VPcUserConsCols implements java.io.Serializable {

	// Fields

	private VPcUserConsColsId id;
	private String dataType;
	private String constraintType;

	// Constructors

	/** default constructor */
	public VPcUserConsCols() {
	}

	/** full constructor */
	public VPcUserConsCols(VPcUserConsColsId id,String dataType,String constraintType) {
		this.id = id;
		this.dataType = dataType;
		this.constraintType = constraintType;
	}

	public VPcUserConsColsId getId() {
		return id;
	}

	public void setId(VPcUserConsColsId id) {
		this.id = id;
	}

	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	public String getConstraintType() {
		return constraintType;
	}

	public void setConstraintType(String constraintType) {
		this.constraintType = constraintType;
	}

}