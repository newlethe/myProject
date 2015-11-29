package com.sgepit.pmis.contract.hbm;

import java.util.Date;

/**
 * ConOve entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ConOve implements java.io.Serializable {

	// Fields

	private String conid;
	private String pid;
	private String conno;
	private String conname;
	private String condivno;
	private Date signdate;
	private Double conmoney;
	private String bidno;
	private String partya;
	private String actionpartya;
	private String partybno;
	private Double advmoney;
	private Double matmoney;
	private String context;
	private Long billstate;
	private String payper;
	private String payway;
	private String conadmin;
	private String sort;
	private Date startdate;
	private Date enddate;
	private Double bdgmoney;
	private Double bidprice;
	private Double auditprice;
	private Date biddate;
	private Date bidenddate;
	private String remark;
	private String isChange;
	private String bidtype;
	private Double judgeprice;
	private String contractors;//承办人
	private String contractordept;//承办部门
	private String projectname ;// 项目名称
	private String yfdwmc;
	private Date performancedate;//履约保函到期日
	
	private String otherCostType;//其他费用类型
	private String isBid;//是否招投标
	private Double performanceMoney;//保函金额

	/** full constructor */
	public ConOve(String conid, String pid, String conno, String conname,
			String condivno, Date signdate, Double conmoney, String bidno,
			String partya, String actionpartya, String partybno,
			Double advmoney, Double matmoney, String context, Long billstate,
			String payper, String payway, String conadmin, String sort,
			Date startdate, Date enddate, Double bdgmoney, Double bidprice,
			Double auditprice, Date biddate, Date bidenddate, String remark,
			String isChange, String bidtype, Double judgeprice,
			String contractors, String contractordept, String projectname,
			String yfdwmc, Date performancedate, String otherCostType,
			String isBid, Double performanceMoney) {
		super();
		this.conid = conid;
		this.pid = pid;
		this.conno = conno;
		this.conname = conname;
		this.condivno = condivno;
		this.signdate = signdate;
		this.conmoney = conmoney;
		this.bidno = bidno;
		this.partya = partya;
		this.actionpartya = actionpartya;
		this.partybno = partybno;
		this.advmoney = advmoney;
		this.matmoney = matmoney;
		this.context = context;
		this.billstate = billstate;
		this.payper = payper;
		this.payway = payway;
		this.conadmin = conadmin;
		this.sort = sort;
		this.startdate = startdate;
		this.enddate = enddate;
		this.bdgmoney = bdgmoney;
		this.bidprice = bidprice;
		this.auditprice = auditprice;
		this.biddate = biddate;
		this.bidenddate = bidenddate;
		this.remark = remark;
		this.isChange = isChange;
		this.bidtype = bidtype;
		this.judgeprice = judgeprice;
		this.contractors = contractors;
		this.contractordept = contractordept;
		this.projectname = projectname;
		this.yfdwmc = yfdwmc;
		this.performancedate = performancedate;
		this.otherCostType = otherCostType;
		this.isBid = isBid;
		this.performanceMoney = performanceMoney;
	}

	/** default constructor */
	public ConOve() {
	}

	/** minimal constructor */
	public ConOve(String pid) {
		this.pid = pid;
	}
   
	// Property accessors
	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getConno() {
		return this.conno;
	}

	public void setConno(String conno) {
		this.conno = conno;
	}

	public String getConname() {
		return this.conname;
	}

	public void setConname(String conname) {
		this.conname = conname;
	}

	public String getCondivno() {
		return this.condivno;
	}

	public void setCondivno(String condivno) {
		this.condivno = condivno;
	}

	public Date getSigndate() {
		return this.signdate;
	}

	public void setSigndate(Date signdate) {
		this.signdate = signdate;
	}

	public Double getConmoney() {
		return this.conmoney;
	}

	public void setConmoney(Double conmoney) {
		this.conmoney = conmoney;
	}

	public String getBidno() {
		return this.bidno;
	}

	public void setBidno(String bidno) {
		this.bidno = bidno;
	}

	public String getPartya() {
		return this.partya;
	}

	public void setPartya(String partya) {
		this.partya = partya;
	}

	public String getActionpartya() {
		return this.actionpartya;
	}

	public void setActionpartya(String actionpartya) {
		this.actionpartya = actionpartya;
	}

	public String getPartybno() {
		return this.partybno;
	}

	public void setPartybno(String partybno) {
		this.partybno = partybno;
	}

	public Double getAdvmoney() {
		return this.advmoney;
	}

	public void setAdvmoney(Double advmoney) {
		this.advmoney = advmoney;
	}

	public Double getMatmoney() {
		return this.matmoney;
	}

	public void setMatmoney(Double matmoney) {
		this.matmoney = matmoney;
	}

	public String getContext() {
		return this.context;
	}

	public void setContext(String context) {
		this.context = context;
	}

	public Long getBillstate() {
		return this.billstate;
	}

	public void setBillstate(Long billstate) {
		this.billstate = billstate;
	}

	public String getPayper() {
		return this.payper;
	}

	public void setPayper(String payper) {
		this.payper = payper;
	}

	public String getPayway() {
		return this.payway;
	}

	public void setPayway(String payway) {
		this.payway = payway;
	}

	public String getConadmin() {
		return this.conadmin;
	}

	public void setConadmin(String conadmin) {
		this.conadmin = conadmin;
	}

	public String getSort() {
		return this.sort;
	}

	public void setSort(String sort) {
		this.sort = sort;
	}

	public Date getStartdate() {
		return this.startdate;
	}

	public void setStartdate(Date startdate) {
		this.startdate = startdate;
	}

	public Date getEnddate() {
		return this.enddate;
	}

	public void setEnddate(Date enddate) {
		this.enddate = enddate;
	}

	public Double getBdgmoney() {
		return this.bdgmoney;
	}

	public void setBdgmoney(Double bdgmoney) {
		this.bdgmoney = bdgmoney;
	}

	public Double getBidprice() {
		return this.bidprice;
	}

	public void setBidprice(Double bidprice) {
		this.bidprice = bidprice;
	}

	public Double getAuditprice() {
		return this.auditprice;
	}

	public void setAuditprice(Double auditprice) {
		this.auditprice = auditprice;
	}

	public Date getBiddate() {
		return this.biddate;
	}

	public void setBiddate(Date biddate) {
		this.biddate = biddate;
	}

	public Date getBidenddate() {
		return this.bidenddate;
	}

	public void setBidenddate(Date bidenddate) {
		this.bidenddate = bidenddate;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getIsChange() {
		return this.isChange;
	}

	public void setIsChange(String isChange) {
		this.isChange = isChange;
	}

	public String getBidtype() {
		return bidtype;
	}

	public void setBidtype(String bidtype) {
		this.bidtype = bidtype;
	}

	public Double getJudgeprice() {
		return judgeprice;
	}

	public void setJudgeprice(Double judgeprice) {
		this.judgeprice = judgeprice;
	}

	public String getYfdwmc() {
		return yfdwmc;
	}

	public void setYfdwmc(String yfdwmc) {
		this.yfdwmc = yfdwmc;
	}



	public String getContractors() {
		return contractors;
	}

	public void setContractors(String contractors) {
		this.contractors = contractors;
	}

	public String getContractordept() {
		return contractordept;
	}

	public void setContractordept(String contractordept) {
		this.contractordept = contractordept;
	}

	public String getProjectname() {
		return projectname;
	}

	public void setProjectname(String projectname) {
		this.projectname = projectname;
	}
	public Date getPerformancedate() {
		return performancedate;
	}

	public void setPerformancedate(Date performancedate) {
		this.performancedate = performancedate;
	}

	public String getOtherCostType() {
		return otherCostType;
	}

	public void setOtherCostType(String otherCostType) {
		this.otherCostType = otherCostType;
	}

	public String getIsBid() {
		return isBid;
	}

	public void setIsBid(String isBid) {
		this.isBid = isBid;
	}

	public Double getPerformanceMoney() {
		return performanceMoney;
	}

	public void setPerformanceMoney(Double performanceMoney) {
		this.performanceMoney = performanceMoney;
	}

}