package com.sgepit.pmis.safeManage.hbm;

import java.util.Date;

/**
 * SafetyCheckContent entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SafetyCheckContent implements java.io.Serializable {

	// Fields

	private String uuid;
	private String itemuuid;
	private String checkuser;
	private String problem;
	private String dept;
	private Long problemstate;
	private Long problemimportant;
	private Date resolvetime;
	// Constructors

	/** default constructor */
	public SafetyCheckContent() {
	}

	/** minimal constructor */
	public SafetyCheckContent(String itemuuid, String checkuser, Date resolvetime) {
		this.itemuuid = itemuuid;
		this.checkuser = checkuser;
		this.resolvetime = resolvetime;
	}

	/** full constructor */
	public SafetyCheckContent(String itemuuid, String checkuser,
			Date resolvetime, String problem, String dept, Long problemstate, Long problemimportant) {
		this.itemuuid = itemuuid;
		this.checkuser = checkuser;
		this.resolvetime = resolvetime;
		this.problem = problem;
		this.dept = dept;
		this.problemstate = problemstate;
		this.problemimportant = problemimportant;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getItemuuid() {
		return this.itemuuid;
	}

	public void setItemuuid(String itemuuid) {
		this.itemuuid = itemuuid;
	}

	public String getCheckuser() {
		return this.checkuser;
	}

	public void setCheckuser(String checkuser) {
		this.checkuser = checkuser;
	}

	public Date getResolvetime() {
		return this.resolvetime;
	}

	public void setResolvetime(Date resolvetime) {
		this.resolvetime = resolvetime;
	}

	public String getProblem() {
		return this.problem;
	}

	public void setProblem(String problem) {
		this.problem = problem;
	}

	public String getDept() {
		return this.dept;
	}

	public void setDept(String dept) {
		this.dept = dept;
	}
	public Long getProblemstate() {
		return this.problemstate;
	}

	public void setProblemstate(Long problemstate) {
		this.problemstate = problemstate;
	}

	public Long getProblemimportant() {
		return this.problemimportant;
	}

	public void setProblemimportant(Long problemimportant) {
		this.problemimportant = problemimportant;
	}

}