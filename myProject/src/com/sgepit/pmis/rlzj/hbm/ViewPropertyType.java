package com.sgepit.pmis.rlzj.hbm;

import java.io.Serializable;
/**
 *属性类型实体类
 */
public class ViewPropertyType implements Serializable {

	private String uids;
	private String typeName;
	private String moduleName;
	private int xh;

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public String getModuleName() {
		return moduleName;
	}

	public void setModuleName(String moduleName) {
		this.moduleName = moduleName;
	}

	public int getXh() {
		return xh;
	}

	public void setXh(int xh) {
		this.xh = xh;
	}

}
