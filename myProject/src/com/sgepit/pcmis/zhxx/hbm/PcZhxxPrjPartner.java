package com.sgepit.pcmis.zhxx.hbm;



public class PcZhxxPrjPartner implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String unitTypeId;
	private String unitid;
	private String unitname;
	private String address;
	private String corporate;
	private String phone;
	private String email;
	private String fax;

	// Constructors

	/** default constructor */
	public PcZhxxPrjPartner() {
	}

	/** full constructor */
	public PcZhxxPrjPartner(String pid, String unitTypeId, String unitid,
			String unitname, String address, String corporate, String phone,
			String email, String fax) {
		this.pid = pid;
		this.unitTypeId = unitTypeId;
		this.unitid = unitid;
		this.unitname = unitname;
		this.address = address;
		this.corporate = corporate;
		this.phone = phone;
		this.email = email;
		this.fax = fax;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getUnitTypeId() {
		return this.unitTypeId;
	}

	public void setUnitTypeId(String unitTypeId) {
		this.unitTypeId = unitTypeId;
	}

	public String getUnitid() {
		return this.unitid;
	}

	public void setUnitid(String unitid) {
		this.unitid = unitid;
	}

	public String getUnitname() {
		return this.unitname;
	}

	public void setUnitname(String unitname) {
		this.unitname = unitname;
	}

	public String getAddress() {
		return this.address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getCorporate() {
		return this.corporate;
	}

	public void setCorporate(String corporate) {
		this.corporate = corporate;
	}

	public String getPhone() {
		return this.phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getFax() {
		return this.fax;
	}

	public void setFax(String fax) {
		this.fax = fax;
	}

}