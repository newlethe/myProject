package com.sgepit.pcmis.aqgk.hbm;

/**
 * PcAqgkSafetytrainInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class PcAqgkSafetytrainInfo implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String traintime;
	private String trainaddr;
	private String trainunit;
	private String traintitle;
	private Long trainnumber;
	private String traincontent;
	private String remarks;
	private Long trainStatus;

	// Constructors

	/** default constructor */
	public PcAqgkSafetytrainInfo() {
	}

	/** minimal constructor */
	public PcAqgkSafetytrainInfo(String pid) {
		this.pid = pid;
	}

	/** full constructor */
	public PcAqgkSafetytrainInfo(String pid, String traintime,
			String trainaddr, String trainunit, String traintitle,
			Long trainnumber, String traincontent, String remarks,
			Long trainStatus) {
		this.pid = pid;
		this.traintime = traintime;
		this.trainaddr = trainaddr;
		this.trainunit = trainunit;
		this.traintitle = traintitle;
		this.trainnumber = trainnumber;
		this.traincontent = traincontent;
		this.remarks = remarks;
		this.trainStatus = trainStatus;
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

	public String getTraintime() {
		return this.traintime;
	}

	public void setTraintime(String traintime) {
		this.traintime = traintime;
	}

	public String getTrainaddr() {
		return this.trainaddr;
	}

	public void setTrainaddr(String trainaddr) {
		this.trainaddr = trainaddr;
	}

	public String getTrainunit() {
		return this.trainunit;
	}

	public void setTrainunit(String trainunit) {
		this.trainunit = trainunit;
	}

	public String getTraintitle() {
		return this.traintitle;
	}

	public void setTraintitle(String traintitle) {
		this.traintitle = traintitle;
	}

	public Long getTrainnumber() {
		return this.trainnumber;
	}

	public void setTrainnumber(Long trainnumber) {
		this.trainnumber = trainnumber;
	}

	public String getTraincontent() {
		return this.traincontent;
	}

	public void setTraincontent(String traincontent) {
		this.traincontent = traincontent;
	}

	public String getRemarks() {
		return this.remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public Long getTrainStatus() {
		return this.trainStatus;
	}

	public void setTrainStatus(Long trainStatus) {
		this.trainStatus = trainStatus;
	}

}