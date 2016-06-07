package com.sgepit.pmis.safeManage.hbm;

import java.util.Date;

/**
 * SafetyMoneyApplyPg entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SafetyMoneyApplyPg implements java.io.Serializable {

	// Fields

	private String uuid;
	private String flowid;
	private String applyuuid;
	private Date pgtime;
	private String pguser;
	private String using;
	private String billstate;
	private String pid;
	
	// Constructors

	/** default constructor */
	public SafetyMoneyApplyPg() {
	}

	/** full constructor */
	public SafetyMoneyApplyPg(String flowid, String applyuuid, Date pgtime,
			String pguser, String using, String billstate) {
		this.flowid = flowid;
		this.applyuuid = applyuuid;
		this.pgtime = pgtime;
		this.pguser = pguser;
		this.using = using;
		this.billstate = billstate;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getFlowid() {
		return this.flowid;
	}

	public void setFlowid(String flowid) {
		this.flowid = flowid;
	}

	public String getApplyuuid() {
		return this.applyuuid;
	}

	public void setApplyuuid(String applyuuid) {
		this.applyuuid = applyuuid;
	}

	public Date getPgtime() {
		return this.pgtime;
	}

	public void setPgtime(Date pgtime) {
		this.pgtime = pgtime;
	}

	public String getPguser() {
		return this.pguser;
	}

	public void setPguser(String pguser) {
		this.pguser = pguser;
	}

	public String getUsing() {
		return this.using;
	}

	public void setUsing(String using) {
		this.using = using;
	}

	public String getBillstate() {
		return this.billstate;
	}

	public void setBillstate(String billstate) {
		this.billstate = billstate;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

}