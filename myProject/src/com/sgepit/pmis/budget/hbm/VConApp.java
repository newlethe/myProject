package com.sgepit.pmis.budget.hbm;



import java.util.Date;

/**
 * ConOve entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class VConApp implements java.io.Serializable {

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
	private Double conpay;//合同累计付款金额
	private Double concha;//合同累计变更金额
	private Double concla;//合同累计索赔金额
	private Double conbre;//合同累计违约金额
	private Double conbal;//合同累计结算金额
	private Double coninvoicemoney;//累计发票金额
	// Constructors
	private Double initappmoney;//合同签订分摊金额
	private Double changeappmoney;//合同变更分摊金额
	private Double claappmoney;//合同索赔分摊金额
	private Double breachappmoney;//合同违约分摊金额
	private Double conappmoney;//本合同分摊总金额
	private Double convaluemoney;//合同总金额
	private Double factappmoney;//实际付款分摊金额
	
	private Double conbidbdgmoney;//招标对应概算金额
	
	public String getConid() {
		return conid;
	}
	public void setConid(String conid) {
		this.conid = conid;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public String getConno() {
		return conno;
	}
	public void setConno(String conno) {
		this.conno = conno;
	}
	public String getConname() {
		return conname;
	}
	public void setConname(String conname) {
		this.conname = conname;
	}
	public String getCondivno() {
		return condivno;
	}
	public void setCondivno(String condivno) {
		this.condivno = condivno;
	}
	public Date getSigndate() {
		return signdate;
	}
	public void setSigndate(Date signdate) {
		this.signdate = signdate;
	}
	public Double getConmoney() {
		return conmoney;
	}
	public void setConmoney(Double conmoney) {
		this.conmoney = conmoney;
	}
	public String getBidno() {
		return bidno;
	}
	public void setBidno(String bidno) {
		this.bidno = bidno;
	}
	public String getPartya() {
		return partya;
	}
	public void setPartya(String partya) {
		this.partya = partya;
	}
	public String getActionpartya() {
		return actionpartya;
	}
	public void setActionpartya(String actionpartya) {
		this.actionpartya = actionpartya;
	}
	public String getPartybno() {
		return partybno;
	}
	public void setPartybno(String partybno) {
		this.partybno = partybno;
	}
	public Double getAdvmoney() {
		return advmoney;
	}
	public void setAdvmoney(Double advmoney) {
		this.advmoney = advmoney;
	}
	public Double getMatmoney() {
		return matmoney;
	}
	public void setMatmoney(Double matmoney) {
		this.matmoney = matmoney;
	}
	public String getContext() {
		return context;
	}
	public void setContext(String context) {
		this.context = context;
	}
	public Long getBillstate() {
		return billstate;
	}
	public void setBillstate(Long billstate) {
		this.billstate = billstate;
	}
	public String getPayper() {
		return payper;
	}
	public void setPayper(String payper) {
		this.payper = payper;
	}
	public String getPayway() {
		return payway;
	}
	public void setPayway(String payway) {
		this.payway = payway;
	}
	public String getConadmin() {
		return conadmin;
	}
	public void setConadmin(String conadmin) {
		this.conadmin = conadmin;
	}
	public String getSort() {
		return sort;
	}
	public void setSort(String sort) {
		this.sort = sort;
	}
	public Date getStartdate() {
		return startdate;
	}
	public void setStartdate(Date startdate) {
		this.startdate = startdate;
	}
	public Date getEnddate() {
		return enddate;
	}
	public void setEnddate(Date enddate) {
		this.enddate = enddate;
	}
	public Double getBdgmoney() {
		return bdgmoney;
	}
	public void setBdgmoney(Double bdgmoney) {
		this.bdgmoney = bdgmoney;
	}
	public Double getBidprice() {
		return bidprice;
	}
	public void setBidprice(Double bidprice) {
		this.bidprice = bidprice;
	}
	public Double getAuditprice() {
		return auditprice;
	}
	public void setAuditprice(Double auditprice) {
		this.auditprice = auditprice;
	}
	public Date getBiddate() {
		return biddate;
	}
	public void setBiddate(Date biddate) {
		this.biddate = biddate;
	}
	public Date getBidenddate() {
		return bidenddate;
	}
	public void setBidenddate(Date bidenddate) {
		this.bidenddate = bidenddate;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getIsChange() {
		return isChange;
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
	public String getYfdwmc() {
		return yfdwmc;
	}
	public void setYfdwmc(String yfdwmc) {
		this.yfdwmc = yfdwmc;
	}
	public Date getPerformancedate() {
		return performancedate;
	}
	public void setPerformancedate(Date performancedate) {
		this.performancedate = performancedate;
	}
	public Double getInitappmoney() {
		return initappmoney;
	}
	public void setInitappmoney(Double initappmoney) {
		this.initappmoney = initappmoney;
	}
	public Double getChangeappmoney() {
		return changeappmoney;
	}
	public void setChangeappmoney(Double changeappmoney) {
		this.changeappmoney = changeappmoney;
	}
	public Double getClaappmoney() {
		return claappmoney;
	}
	public void setClaappmoney(Double claappmoney) {
		this.claappmoney = claappmoney;
	}
	public Double getBreachappmoney() {
		return breachappmoney;
	}
	public void setBreachappmoney(Double breachappmoney) {
		this.breachappmoney = breachappmoney;
	}
	public Double getConappmoney() {
		return conappmoney;
	}
	public void setConappmoney(Double conappmoney) {
		this.conappmoney = conappmoney;
	}
	public Double getConvaluemoney() {
		return convaluemoney;
	}
	public void setConvaluemoney(Double convaluemoney) {
		this.convaluemoney = convaluemoney;
	}
	public Double getConpay() {
		return conpay;
	}
	public void setConpay(Double conpay) {
		this.conpay = conpay;
	}
	public Double getConcha() {
		return concha;
	}
	public void setConcha(Double concha) {
		this.concha = concha;
	}
	public Double getConcla() {
		return concla;
	}
	public void setConcla(Double concla) {
		this.concla = concla;
	}
	public Double getConbre() {
		return conbre;
	}
	public void setConbre(Double conbre) {
		this.conbre = conbre;
	}
	public Double getConbal() {
		return conbal;
	}
	public void setConbal(Double conbal) {
		this.conbal = conbal;
	}
	public Double getConinvoicemoney() {
		return coninvoicemoney;
	}
	public void setConinvoicemoney(Double coninvoicemoney) {
		this.coninvoicemoney = coninvoicemoney;
	}
	public Double getFactappmoney() {
		return factappmoney;
	}
	public void setFactappmoney(Double factappmoney) {
		this.factappmoney = factappmoney;
	}
	public Double getConbidbdgmoney() {
		return conbidbdgmoney;
	}
	public void setConbidbdgmoney(Double conbidbdgmoney) {
		this.conbidbdgmoney = conbidbdgmoney;
	}



}