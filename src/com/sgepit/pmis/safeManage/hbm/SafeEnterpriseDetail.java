package com.sgepit.pmis.safeManage.hbm;

/**
 * SafeEnterpriseDetail entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class SafeEnterpriseDetail implements java.io.Serializable {

	// Fields

	private String gcbh;
	private String xh;
	private Long jssjsw;
	private Long jssjzs;
	private Long sbsssw;
	private Long sbsszs;
	private Long aqsssw;
	private Long sqsszs;
	private Long sccdhjsw;
	private Long sccdhjzs;
	private Long grfhsw;
	private Long grfhzs;
	private Long myaqczsw;
	private Long myaqczzs;
	private Long wfczsw;
	private Long wfczzs;
	private Long ldzzsw;
	private Long ldzzzs;
	private Long sjcsw;
	private Long sjczs;
	private Long jybzsw;
	private Long jybzzs;
	private Long qtsw;
	private Long qtzs;
	private String sglb;
	private String bh;
	private String rqlx;

	// Constructors

	/** default constructor */
	public SafeEnterpriseDetail() {
	}

	/** minimal constructor */
	public SafeEnterpriseDetail(String gcbh, String bh, String rqlx) {
		this.gcbh = gcbh;
		this.bh = bh;
		this.rqlx = rqlx;
	}

	/** full constructor */
	public SafeEnterpriseDetail(String gcbh, String xh, Long jssjsw,
			Long jssjzs, Long sbsssw, Long sbsszs, Long aqsssw, Long sqsszs,
			Long sccdhjsw, Long sccdhjzs, Long grfhsw, Long grfhzs,
			Long myaqczsw, Long myaqczzs, Long wfczsw, Long wfczzs,
			Long ldzzsw, Long ldzzzs, Long sjcsw, Long sjczs, Long jybzsw,
			Long jybzzs, Long qtsw, Long qtzs, String sglb, String bh,
			String rqlx) {
		this.gcbh = gcbh;
		this.xh = xh;
		this.jssjsw = jssjsw;
		this.jssjzs = jssjzs;
		this.sbsssw = sbsssw;
		this.sbsszs = sbsszs;
		this.aqsssw = aqsssw;
		this.sqsszs = sqsszs;
		this.sccdhjsw = sccdhjsw;
		this.sccdhjzs = sccdhjzs;
		this.grfhsw = grfhsw;
		this.grfhzs = grfhzs;
		this.myaqczsw = myaqczsw;
		this.myaqczzs = myaqczzs;
		this.wfczsw = wfczsw;
		this.wfczzs = wfczzs;
		this.ldzzsw = ldzzsw;
		this.ldzzzs = ldzzzs;
		this.sjcsw = sjcsw;
		this.sjczs = sjczs;
		this.jybzsw = jybzsw;
		this.jybzzs = jybzzs;
		this.qtsw = qtsw;
		this.qtzs = qtzs;
		this.sglb = sglb;
		this.bh = bh;
		this.rqlx = rqlx;
	}

	// Property accessors

	public String getGcbh() {
		return this.gcbh;
	}

	public void setGcbh(String gcbh) {
		this.gcbh = gcbh;
	}

	public String getXh() {
		return this.xh;
	}

	public void setXh(String xh) {
		this.xh = xh;
	}

	public Long getJssjsw() {
		return this.jssjsw;
	}

	public void setJssjsw(Long jssjsw) {
		this.jssjsw = jssjsw;
	}

	public Long getJssjzs() {
		return this.jssjzs;
	}

	public void setJssjzs(Long jssjzs) {
		this.jssjzs = jssjzs;
	}

	public Long getSbsssw() {
		return this.sbsssw;
	}

	public void setSbsssw(Long sbsssw) {
		this.sbsssw = sbsssw;
	}

	public Long getSbsszs() {
		return this.sbsszs;
	}

	public void setSbsszs(Long sbsszs) {
		this.sbsszs = sbsszs;
	}

	public Long getAqsssw() {
		return this.aqsssw;
	}

	public void setAqsssw(Long aqsssw) {
		this.aqsssw = aqsssw;
	}

	public Long getSqsszs() {
		return this.sqsszs;
	}

	public void setSqsszs(Long sqsszs) {
		this.sqsszs = sqsszs;
	}

	public Long getSccdhjsw() {
		return this.sccdhjsw;
	}

	public void setSccdhjsw(Long sccdhjsw) {
		this.sccdhjsw = sccdhjsw;
	}

	public Long getSccdhjzs() {
		return this.sccdhjzs;
	}

	public void setSccdhjzs(Long sccdhjzs) {
		this.sccdhjzs = sccdhjzs;
	}

	public Long getGrfhsw() {
		return this.grfhsw;
	}

	public void setGrfhsw(Long grfhsw) {
		this.grfhsw = grfhsw;
	}

	public Long getGrfhzs() {
		return this.grfhzs;
	}

	public void setGrfhzs(Long grfhzs) {
		this.grfhzs = grfhzs;
	}

	public Long getMyaqczsw() {
		return this.myaqczsw;
	}

	public void setMyaqczsw(Long myaqczsw) {
		this.myaqczsw = myaqczsw;
	}

	public Long getMyaqczzs() {
		return this.myaqczzs;
	}

	public void setMyaqczzs(Long myaqczzs) {
		this.myaqczzs = myaqczzs;
	}

	public Long getWfczsw() {
		return this.wfczsw;
	}

	public void setWfczsw(Long wfczsw) {
		this.wfczsw = wfczsw;
	}

	public Long getWfczzs() {
		return this.wfczzs;
	}

	public void setWfczzs(Long wfczzs) {
		this.wfczzs = wfczzs;
	}

	public Long getLdzzsw() {
		return this.ldzzsw;
	}

	public void setLdzzsw(Long ldzzsw) {
		this.ldzzsw = ldzzsw;
	}

	public Long getLdzzzs() {
		return this.ldzzzs;
	}

	public void setLdzzzs(Long ldzzzs) {
		this.ldzzzs = ldzzzs;
	}

	public Long getSjcsw() {
		return this.sjcsw;
	}

	public void setSjcsw(Long sjcsw) {
		this.sjcsw = sjcsw;
	}

	public Long getSjczs() {
		return this.sjczs;
	}

	public void setSjczs(Long sjczs) {
		this.sjczs = sjczs;
	}

	public Long getJybzsw() {
		return this.jybzsw;
	}

	public void setJybzsw(Long jybzsw) {
		this.jybzsw = jybzsw;
	}

	public Long getJybzzs() {
		return this.jybzzs;
	}

	public void setJybzzs(Long jybzzs) {
		this.jybzzs = jybzzs;
	}

	public Long getQtsw() {
		return this.qtsw;
	}

	public void setQtsw(Long qtsw) {
		this.qtsw = qtsw;
	}

	public Long getQtzs() {
		return this.qtzs;
	}

	public void setQtzs(Long qtzs) {
		this.qtzs = qtzs;
	}

	public String getSglb() {
		return this.sglb;
	}

	public void setSglb(String sglb) {
		this.sglb = sglb;
	}

	public String getBh() {
		return this.bh;
	}

	public void setBh(String bh) {
		this.bh = bh;
	}

	public String getRqlx() {
		return this.rqlx;
	}

	public void setRqlx(String rqlx) {
		this.rqlx = rqlx;
	}

}