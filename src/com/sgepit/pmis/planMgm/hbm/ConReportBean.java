package com.sgepit.pmis.planMgm.hbm;

public class ConReportBean {
	private String conid;
	private String contypename;
	private String conno;
	private String batch;
	private Double convaluemoney;
	private String partybno;
	private Double conpay;
	private Double predictPayment1;
	private Double predictPayment2;
	private Double predictPayment3;
	private String remark;
	private String reportId;
	private String uids;
	private Long isleaf;
	private String parent;
	private String condivno;
	public ConReportBean() {
		super();
		// TODO Auto-generated constructor stub
	}
	public ConReportBean(String conid, String contypename, String conno,
			String batch, Double convaluemoney, String partybno, Double conpay,
			Double predictPayment1, Double predictPayment2,
			Double predictPayment3, String remark, String reportId,
			String uids, Long isleaf, String parent, String condivno) {
		super();
		this.conid = conid;
		this.contypename = contypename;
		this.conno = conno;
		this.batch = batch;
		this.convaluemoney = convaluemoney;
		this.partybno = partybno;
		this.conpay = conpay;
		this.predictPayment1 = predictPayment1;
		this.predictPayment2 = predictPayment2;
		this.predictPayment3 = predictPayment3;
		this.remark = remark;
		this.reportId = reportId;
		this.uids = uids;
		this.isleaf = isleaf;
		this.parent = parent;
		this.condivno = condivno;
	}
	public String getConid() {
		return conid;
	}
	public void setConid(String conid) {
		this.conid = conid;
	}
	public String getContypename() {
		return contypename;
	}
	public void setContypename(String contypename) {
		this.contypename = contypename;
	}
	public String getConno() {
		return conno;
	}
	public void setConno(String conno) {
		this.conno = conno;
	}
	public String getBatch() {
		return batch;
	}
	public void setBatch(String batch) {
		this.batch = batch;
	}
	public Double getConvaluemoney() {
		return convaluemoney;
	}
	public void setConvaluemoney(Double convaluemoney) {
		this.convaluemoney = convaluemoney;
	}
	public String getPartybno() {
		return partybno;
	}
	public void setPartybno(String partybno) {
		this.partybno = partybno;
	}
	public Double getConpay() {
		return conpay;
	}
	public void setConpay(Double conpay) {
		this.conpay = conpay;
	}
	public Double getPredictPayment1() {
		return predictPayment1;
	}
	public void setPredictPayment1(Double predictPayment1) {
		this.predictPayment1 = predictPayment1;
	}
	public Double getPredictPayment2() {
		return predictPayment2;
	}
	public void setPredictPayment2(Double predictPayment2) {
		this.predictPayment2 = predictPayment2;
	}
	public Double getPredictPayment3() {
		return predictPayment3;
	}
	public void setPredictPayment3(Double predictPayment3) {
		this.predictPayment3 = predictPayment3;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getReportId() {
		return reportId;
	}
	public void setReportId(String reportId) {
		this.reportId = reportId;
	}
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public Long getIsleaf() {
		return isleaf;
	}
	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}
	public String getParent() {
		return parent;
	}
	public void setParent(String parent) {
		this.parent = parent;
	}
	public String getCondivno() {
		return condivno;
	}
	public void setCondivno(String condivno) {
		this.condivno = condivno;
	}

	
}
