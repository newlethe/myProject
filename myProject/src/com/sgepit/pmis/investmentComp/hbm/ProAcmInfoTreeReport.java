package com.sgepit.pmis.investmentComp.hbm;

/**
 * 施工投资完成统计报表
 * @crearetime 2014-02-27
 * @author pengy
 */
public class ProAcmInfoTreeReport implements java.io.Serializable {

	// Fields

	private String uids;
	private String pid;
	private String prono;
	private String bdgid;
	private String bdgname;
	private String unit;
	private Double amount;
	private Double price;
	private Double money;
	private Double totalratimonthmoneylastall;
	private String totalratimonthlast;
	private Double totalratimonthmoneylast;
	private String declpro;
	private Double decmoney;
	private String checkpro;
	private Double checkmoney;
	private String ratiftpro;
	private Double ratiftmoney;
	private String totalratimonth;
	private Double totalratimonthmoney;
	private String percent1;
	private Double percent2;
	private String parent;
	private Long isleaf;
	private String conid;
	private String monId;
	private String month;
	private String acmid;
	private String proid;
	private String proname;

	// Constructors

	/** default constructor */
	public ProAcmInfoTreeReport() {
	}

	/** full constructor */
	public ProAcmInfoTreeReport(String uids, String pid, String prono,
			String bdgid, String bdgname, String unit, Double amount,
			Double price, Double money, Double totalratimonthmoneylastall,
			String totalratimonthlast, Double totalratimonthmoneylast,
			String declpro, Double decmoney, String checkpro,
			Double checkmoney, String ratiftpro, Double ratiftmoney,
			String totalratimonth, Double totalratimonthmoney, String percent1,
			Double percent2, String parent, Long isleaf, String conid,
			String monId, String month, String acmid, String proid,
			String proname) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.prono = prono;
		this.bdgid = bdgid;
		this.bdgname = bdgname;
		this.unit = unit;
		this.amount = amount;
		this.price = price;
		this.money = money;
		this.totalratimonthmoneylastall = totalratimonthmoneylastall;
		this.totalratimonthlast = totalratimonthlast;
		this.totalratimonthmoneylast = totalratimonthmoneylast;
		this.declpro = declpro;
		this.decmoney = decmoney;
		this.checkpro = checkpro;
		this.checkmoney = checkmoney;
		this.ratiftpro = ratiftpro;
		this.ratiftmoney = ratiftmoney;
		this.totalratimonth = totalratimonth;
		this.totalratimonthmoney = totalratimonthmoney;
		this.percent1 = percent1;
		this.percent2 = percent2;
		this.parent = parent;
		this.isleaf = isleaf;
		this.conid = conid;
		this.monId = monId;
		this.month = month;
		this.acmid = acmid;
		this.proid = proid;
		this.proname = proname;
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

	public String getProno() {
		return this.prono;
	}

	public void setProno(String prono) {
		this.prono = prono;
	}

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getBdgname() {
		return this.bdgname;
	}

	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
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

	public Double getTotalratimonthmoneylastall() {
		return this.totalratimonthmoneylastall;
	}

	public void setTotalratimonthmoneylastall(Double totalratimonthmoneylastall) {
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

	public Double getDecmoney() {
		return this.decmoney;
	}

	public void setDecmoney(Double decmoney) {
		this.decmoney = decmoney;
	}

	public String getCheckpro() {
		return this.checkpro;
	}

	public void setCheckpro(String checkpro) {
		this.checkpro = checkpro;
	}

	public Double getCheckmoney() {
		return this.checkmoney;
	}

	public void setCheckmoney(Double checkmoney) {
		this.checkmoney = checkmoney;
	}

	public String getRatiftpro() {
		return this.ratiftpro;
	}

	public void setRatiftpro(String ratiftpro) {
		this.ratiftpro = ratiftpro;
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

	public String getPercent1() {
		return this.percent1;
	}

	public void setPercent1(String percent1) {
		this.percent1 = percent1;
	}

	public Double getPercent2() {
		return this.percent2;
	}

	public void setPercent2(Double percent2) {
		this.percent2 = percent2;
	}

	public String getParent() {
		return this.parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
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

	public String getAcmid() {
		return acmid;
	}

	public void setAcmid(String acmid) {
		this.acmid = acmid;
	}

	public String getProid() {
		return proid;
	}

	public void setProid(String proid) {
		this.proid = proid;
	}

	public String getProname() {
		return proname;
	}

	public void setProname(String proname) {
		this.proname = proname;
	}

}