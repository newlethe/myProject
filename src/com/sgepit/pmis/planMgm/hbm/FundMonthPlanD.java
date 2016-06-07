package com.sgepit.pmis.planMgm.hbm;

/**
 * FundMonthPlanD entity. @author MyEclipse Persistence Tools
 */

public class FundMonthPlanD implements java.io.Serializable {

	// Fields

	private String uids;
	private String reportId;
	private String condivno;
	private String conid;
	private String batch;
	private Double predictPayment1;
	private Double predictPayment2;
	private Double predictPayment3;
	private String remark;
	private String conno;
	private String partybno;
	private Double convaluemoney;
	private Double conpay;

	// Constructors

	/** default constructor */
	public FundMonthPlanD() {
	}

	/** full constructor */
	public FundMonthPlanD(String reportId, String condivno, String conid,
			String batch, Double predictPayment1, Double predictPayment2,
			Double predictPayment3, String remark, String conno,
			String partybno, Double convaluemoney, Double conpay) {
		this.reportId = reportId;
		this.condivno = condivno;
		this.conid = conid;
		this.batch = batch;
		this.predictPayment1 = predictPayment1;
		this.predictPayment2 = predictPayment2;
		this.predictPayment3 = predictPayment3;
		this.remark = remark;
		this.conno = conno;
		this.partybno = partybno;
		this.convaluemoney = convaluemoney;
		this.conpay = conpay;
	}

	// Property accessors

	public String getUids() {
		return this.uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getReportId() {
		return this.reportId;
	}

	public void setReportId(String reportId) {
		this.reportId = reportId;
	}

	public String getCondivno() {
		return this.condivno;
	}

	public void setCondivno(String condivno) {
		this.condivno = condivno;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getBatch() {
		return this.batch;
	}

	public void setBatch(String batch) {
		this.batch = batch;
	}

	public Double getPredictPayment1() {
		return this.predictPayment1;
	}

	public void setPredictPayment1(Double predictPayment1) {
		this.predictPayment1 = predictPayment1;
	}

	public Double getPredictPayment2() {
		return this.predictPayment2;
	}

	public void setPredictPayment2(Double predictPayment2) {
		this.predictPayment2 = predictPayment2;
	}

	public Double getPredictPayment3() {
		return this.predictPayment3;
	}

	public void setPredictPayment3(Double predictPayment3) {
		this.predictPayment3 = predictPayment3;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getConno() {
		return this.conno;
	}

	public void setConno(String conno) {
		this.conno = conno;
	}

	public String getPartybno() {
		return this.partybno;
	}

	public void setPartybno(String partybno) {
		this.partybno = partybno;
	}

	public Double getConvaluemoney() {
		return this.convaluemoney;
	}

	public void setConvaluemoney(Double convaluemoney) {
		this.convaluemoney = convaluemoney;
	}

	public Double getConpay() {
		return this.conpay;
	}

	public void setConpay(Double conpay) {
		this.conpay = conpay;
	}

}