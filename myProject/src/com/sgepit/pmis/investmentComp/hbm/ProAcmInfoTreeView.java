package com.sgepit.pmis.investmentComp.hbm;

/**
 * 施工合同投资完成工程量树
 * @crearetime 2014-02-27
 * @author pengy
 */
public class ProAcmInfoTreeView implements java.io.Serializable {

	// Fields

	private String acmId;
	private String proname;
	private String unit;
	private Double amount;
	private Double price;
	private Double money;
	private String bdgid;
	private String pid;
	private Double totalratimonthmoneylastall;
	private String totalratimonthlast;
	private Double totalratimonthmoneylast;
	private String declpro;
	private String checkpro;
	private String ratiftpro;
	private Double decmoney;
	private Double checkmoney;
	private Double ratiftmoney;
	private String totalratimonth;
	private Double totalratimonthmoney;
	private Double percent1;
	private String proid;
	private String monId;
	private String month;
	private String conid;
	private String prono;

	// Constructors

	/** default constructor */
	public ProAcmInfoTreeView() {
	}

	/** minimal constructor */
	public ProAcmInfoTreeView(String pid, String month, String conid) {
		this.pid = pid;
		this.month = month;
		this.conid = conid;
	}

	/** full constructor */
	public ProAcmInfoTreeView(String acmId, String proname, String unit,
			Double amount, Double price, Double money, String bdgid,
			String pid, Double totalratimonthmoneylastall,
			String totalratimonthlast, Double totalratimonthmoneylast,
			String declpro, String checkpro, String ratiftpro, Double decmoney,
			Double checkmoney, Double ratiftmoney, String totalratimonth,
			Double totalratimonthmoney, Double percent1, String proid,
			String monId, String month, String conid, String prono) {
		super();
		this.acmId = acmId;
		this.proname = proname;
		this.unit = unit;
		this.amount = amount;
		this.price = price;
		this.money = money;
		this.bdgid = bdgid;
		this.pid = pid;
		this.totalratimonthmoneylastall = totalratimonthmoneylastall;
		this.totalratimonthlast = totalratimonthlast;
		this.totalratimonthmoneylast = totalratimonthmoneylast;
		this.declpro = declpro;
		this.checkpro = checkpro;
		this.ratiftpro = ratiftpro;
		this.decmoney = decmoney;
		this.checkmoney = checkmoney;
		this.ratiftmoney = ratiftmoney;
		this.totalratimonth = totalratimonth;
		this.totalratimonthmoney = totalratimonthmoney;
		this.percent1 = percent1;
		this.proid = proid;
		this.monId = monId;
		this.month = month;
		this.conid = conid;
		this.prono = prono;
	}

	// Property accessors

	public String getAcmId() {
		return this.acmId;
	}

	public void setAcmId(String acmId) {
		this.acmId = acmId;
	}

	public String getProname() {
		return this.proname;
	}

	public void setProname(String proname) {
		this.proname = proname;
	}

	public String getUnit() {
		return this.unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Double getAmount() {
		return this.amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public Double getPrice() {
		return this.price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Double getMoney() {
		return this.money;
	}

	public void setMoney(Double money) {
		this.money = money;
	}

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public Double getTotalratimonthmoneylastall() {
		return this.totalratimonthmoneylastall;
	}

	public void setTotalratimonthmoneylastall(
			Double totalratimonthmoneylastall) {
		this.totalratimonthmoneylastall = totalratimonthmoneylastall;
	}

	public String getTotalratimonthlast() {
		return this.totalratimonthlast;
	}

	public void setTotalratimonthlast(String totalratimonthlast) {
		this.totalratimonthlast = totalratimonthlast;
	}

	public Double getTotalratimonthmoneylast() {
		return this.totalratimonthmoneylast;
	}

	public void setTotalratimonthmoneylast(Double totalratimonthmoneylast) {
		this.totalratimonthmoneylast = totalratimonthmoneylast;
	}

	public String getDeclpro() {
		return this.declpro;
	}

	public void setDeclpro(String declpro) {
		this.declpro = declpro;
	}

	public String getCheckpro() {
		return this.checkpro;
	}

	public void setCheckpro(String checkpro) {
		this.checkpro = checkpro;
	}

	public String getRatiftpro() {
		return this.ratiftpro;
	}

	public void setRatiftpro(String ratiftpro) {
		this.ratiftpro = ratiftpro;
	}

	public Double getDecmoney() {
		return this.decmoney;
	}

	public void setDecmoney(Double decmoney) {
		this.decmoney = decmoney;
	}

	public Double getCheckmoney() {
		return this.checkmoney;
	}

	public void setCheckmoney(Double checkmoney) {
		this.checkmoney = checkmoney;
	}

	public Double getRatiftmoney() {
		return this.ratiftmoney;
	}

	public void setRatiftmoney(Double ratiftmoney) {
		this.ratiftmoney = ratiftmoney;
	}

	public String getTotalratimonth() {
		return this.totalratimonth;
	}

	public void setTotalratimonth(String totalratimonth) {
		this.totalratimonth = totalratimonth;
	}

	public Double getTotalratimonthmoney() {
		return this.totalratimonthmoney;
	}

	public void setTotalratimonthmoney(Double totalratimonthmoney) {
		this.totalratimonthmoney = totalratimonthmoney;
	}

	public Double getPercent1() {
		return this.percent1;
	}

	public void setPercent1(Double percent1) {
		this.percent1 = percent1;
	}

	public String getProid() {
		return this.proid;
	}

	public void setProid(String proid) {
		this.proid = proid;
	}

	public String getMonId() {
		return this.monId;
	}

	public void setMonId(String monId) {
		this.monId = monId;
	}

	public String getMonth() {
		return this.month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getProno() {
		return prono;
	}

	public void setProno(String prono) {
		this.prono = prono;
	}

}