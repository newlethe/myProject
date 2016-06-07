package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * RzglKqglKqImport entity. @author MyEclipse Persistence Tools
 */

public class RzglKqglKqImport implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String userNum;
	private String deptId;
	private String userId;
	private Date kqDate;
	private String kqSituationAm;
	private Date kqStarttimeAm;
	private Date kqEndtimeAm;
	private String kqSituationPm;
	private Date kqStarttimePm;
	private Date kqEndtimePm;
	private String isModAm;
	private String isModPm;

	// Constructors

	

	/** default constructor */
	public RzglKqglKqImport() {
	}

	
	public RzglKqglKqImport(String uids, String pid, String userNum,
			String deptId, String userId, Date kqDate, String kqSituationAm,
			Date kqStarttimeAm, Date kqEndtimeAm, String kqSituationPm,
			Date kqStarttimePm, Date kqEndtimePm, String isModAm, String isModPm) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.userNum = userNum;
		this.deptId = deptId;
		this.userId = userId;
		this.kqDate = kqDate;
		this.kqSituationAm = kqSituationAm;
		this.kqStarttimeAm = kqStarttimeAm;
		this.kqEndtimeAm = kqEndtimeAm;
		this.kqSituationPm = kqSituationPm;
		this.kqStarttimePm = kqStarttimePm;
		this.kqEndtimePm = kqEndtimePm;
		this.isModAm = isModAm;
		this.isModPm = isModPm;
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

	public String getUserNum() {
		return this.userNum;
	}

	public void setUserNum(String userNum) {
		this.userNum = userNum;
	}

	public String getDeptId() {
		return this.deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getUserId() {
		return this.userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Date getKqDate() {
		return this.kqDate;
	}

	public void setKqDate(Date kqDate) {
		this.kqDate = kqDate;
	}

	public String getKqSituationAm() {
		return this.kqSituationAm;
	}

	public void setKqSituationAm(String kqSituationAm) {
		this.kqSituationAm = kqSituationAm;
	}

	public Date getKqStarttimeAm() {
		return this.kqStarttimeAm;
	}

	public void setKqStarttimeAm(Date kqStarttimeAm) {
		this.kqStarttimeAm = kqStarttimeAm;
	}

	public Date getKqEndtimeAm() {
		return this.kqEndtimeAm;
	}

	public void setKqEndtimeAm(Date kqEndtimeAm) {
		this.kqEndtimeAm = kqEndtimeAm;
	}

	public String getKqSituationPm() {
		return this.kqSituationPm;
	}

	public void setKqSituationPm(String kqSituationPm) {
		this.kqSituationPm = kqSituationPm;
	}

	public Date getKqStarttimePm() {
		return this.kqStarttimePm;
	}

	public void setKqStarttimePm(Date kqStarttimePm) {
		this.kqStarttimePm = kqStarttimePm;
	}

	public Date getKqEndtimePm() {
		return this.kqEndtimePm;
	}

	public void setKqEndtimePm(Date kqEndtimePm) {
		this.kqEndtimePm = kqEndtimePm;
	}


	public String getIsModAm() {
		return isModAm;
	}


	public void setIsModAm(String isModAm) {
		this.isModAm = isModAm;
	}


	public String getIsModPm() {
		return isModPm;
	}


	public void setIsModPm(String isModPm) {
		this.isModPm = isModPm;
	}

}