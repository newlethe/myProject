package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquGoodsOpenboxExce entity. @author MyEclipse Persistence Tools
 */

public class EquGoodsOpenboxExce implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String openboxId;
	private String openboxNo;
	private String resultId;
	private Integer finished;
	private Integer isStorein;
	private Double excePassNum;
	private Double applyInNum;
	private Date excePassDate;
	private String handleUser;
	private String handleProcess;
	private String remark;

	// Constructors

	/** default constructor */
	public EquGoodsOpenboxExce() {
	}

	/** minimal constructor */
	public EquGoodsOpenboxExce(String pid, String openboxId, String resultId) {
		this.pid = pid;
		this.openboxId = openboxId;
		this.resultId = resultId;
	}

	/** full constructor */
	public EquGoodsOpenboxExce(String pid, String openboxId, String openboxNo,
			String resultId, Integer finished, Integer isStorein, Double excePassNum,
			Double applyInNum, Date excePassDate, String handleUser,
			String handleProcess, String remark) {
		this.pid = pid;
		this.openboxId = openboxId;
		this.openboxNo = openboxNo;
		this.resultId = resultId;
		this.finished = finished;
		this.isStorein = isStorein;
		this.excePassNum = excePassNum;
		this.applyInNum = applyInNum;
		this.excePassDate = excePassDate;
		this.handleUser = handleUser;
		this.handleProcess = handleProcess;
		this.remark = remark;
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

	public String getOpenboxId() {
		return this.openboxId;
	}

	public void setOpenboxId(String openboxId) {
		this.openboxId = openboxId;
	}

	public String getOpenboxNo() {
		return this.openboxNo;
	}

	public void setOpenboxNo(String openboxNo) {
		this.openboxNo = openboxNo;
	}

	public String getResultId() {
		return this.resultId;
	}

	public void setResultId(String resultId) {
		this.resultId = resultId;
	}

	public Integer getFinished() {
		return this.finished;
	}

	public void setFinished(Integer finished) {
		this.finished = finished;
	}

	public Double getExcePassNum() {
		return this.excePassNum;
	}

	public void setExcePassNum(Double excePassNum) {
		this.excePassNum = excePassNum;
	}

	public Double getApplyInNum() {
		return this.applyInNum;
	}

	public void setApplyInNum(Double applyInNum) {
		this.applyInNum = applyInNum;
	}

	public Date getExcePassDate() {
		return this.excePassDate;
	}

	public void setExcePassDate(Date excePassDate) {
		this.excePassDate = excePassDate;
	}

	public String getHandleUser() {
		return this.handleUser;
	}

	public void setHandleUser(String handleUser) {
		this.handleUser = handleUser;
	}

	public String getHandleProcess() {
		return this.handleProcess;
	}

	public void setHandleProcess(String handleProcess) {
		this.handleProcess = handleProcess;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Integer getIsStorein() {
		return isStorein;
	}

	public void setIsStorein(Integer isStorein) {
		this.isStorein = isStorein;
	}

}