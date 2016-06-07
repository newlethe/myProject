package com.sgepit.pmis.budget.hbm;

/**
 * BdgInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class VBdgInfo implements java.io.Serializable {

	// Fields

	private String bdgid;
	private String pid;
	private String bdgno;
	private String bdgname;
	private Long bdgflag;
	private Double bdgmoney;
	private Double matrmoney;
	private Double buildmoney;
	private Double equmoney;
	private Long isleaf;
	private String parent;
	private Double contmoney;
	private Long isfinish;
	private String correspondbdg;
	private Long isAudit;
	private String auditNo;
	private String auditId;
	private String assetNo;
	private Double bdgmoneyCal;
	private Double bdgmoneyDiffer;
	private String gcType;
	private Double remainingMoney;//预计未签订合同金额
	private Double expectedBdgActMoney;//预计概算执行金额
	private Double expectedAmountMoney;//预计概算超概金额
	private String flag;//概算合同分摊总金额改变时Grid行颜色变化标识符
	private String prono;//序号用于施工进度
	//extends

	private Double remainder;
	private String cobdgno ;
	private String cobdgname ;
	private Double sumfactpay;//已付款总金额
	private Double difference;//合同分摊总金额-已付款总金额
	private Double conbdgappmoney;//合同分摊总金额
	private Double conapp;//合同签订分摊总金额
	private Double changeapp;//合同变更分摊总金额
	private Double breachapp;//合同违约分摊总金额
	private Double claapp;//索赔分摊总金额
	private Double payapp;//付款分摊总金额
	private Boolean ischeck;//treeGrid是否勾选上的标识
	private Double ratifyBdg;//批准概算金额
	private Double conjymoney;//合同结余金额
	private Double expectedjyMoney;//预计结余金额
	
	
	private Double bidbdgmoney;//招标对应概算金额
	private Double signconbidbdgmoney;//（已签合同）招标对应概算金额
	private Double bidconappmoney;//招标合同分摊金额
	private Double notbidconappmoney;//非招标合同分摊金额
	private Double bidconothermoney;//招标合同结余金额
	
	// Constructors

	public Double getRemainder() {
		return remainder;
	}

	public void setRemainder(Double remainder) {
		this.remainder = remainder;
	}

	public String getCobdgno() {
		return cobdgno;
	}

	public void setCobdgno(String cobdgno) {
		this.cobdgno = cobdgno;
	}

	public String getCobdgname() {
		return cobdgname;
	}

	public void setCobdgname(String cobdgname) {
		this.cobdgname = cobdgname;
	}

	/** default constructor */
	public VBdgInfo() {
	}

	/** minimal constructor */
	public VBdgInfo(String pid) {
		this.pid = pid;
	}

	public VBdgInfo(String bdgid, String pid, String bdgno, String bdgname,
			Long bdgflag, Double bdgmoney, Double matrmoney, Double buildmoney,
			Double equmoney, Long isleaf, String parent, Double contmoney,
			Long isfinish, String correspondbdg, Long isAudit, String auditNo,
			String auditId, String assetNo, Double bdgmoneyCal,
			Double bdgmoneyDiffer, String gcType, Double remainingMoney,
			Double expectedBdgActMoney, Double expectedAmountMoney,
			String flag, String prono, Double remainder, String cobdgno,
			String cobdgname, Double sumfactpay, Double difference,
			Double conbdgappmoney, Double conapp, Double changeapp,
			Double breachapp, Double claapp, Double payapp, Boolean ischeck,
			Double ratifyBdg,Double conjymoney,Double expectedjyMoney) {
		super();
		this.bdgid = bdgid;
		this.pid = pid;
		this.bdgno = bdgno;
		this.bdgname = bdgname;
		this.bdgflag = bdgflag;
		this.bdgmoney = bdgmoney;
		this.matrmoney = matrmoney;
		this.buildmoney = buildmoney;
		this.equmoney = equmoney;
		this.isleaf = isleaf;
		this.parent = parent;
		this.contmoney = contmoney;
		this.isfinish = isfinish;
		this.correspondbdg = correspondbdg;
		this.isAudit = isAudit;
		this.auditNo = auditNo;
		this.auditId = auditId;
		this.assetNo = assetNo;
		this.bdgmoneyCal = bdgmoneyCal;
		this.bdgmoneyDiffer = bdgmoneyDiffer;
		this.gcType = gcType;
		this.remainingMoney = remainingMoney;
		this.expectedBdgActMoney = expectedBdgActMoney;
		this.expectedAmountMoney = expectedAmountMoney;
		this.flag = flag;
		this.prono = prono;
		this.remainder = remainder;
		this.cobdgno = cobdgno;
		this.cobdgname = cobdgname;
		this.sumfactpay = sumfactpay;
		this.difference = difference;
		this.conbdgappmoney = conbdgappmoney;
		this.conapp = conapp;
		this.changeapp = changeapp;
		this.breachapp = breachapp;
		this.claapp = claapp;
		this.payapp = payapp;
		this.ischeck = ischeck;
		this.ratifyBdg = ratifyBdg;
		this.conjymoney = conjymoney;
		this.expectedjyMoney = expectedjyMoney;
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

	public String getBdgno() {
		return this.bdgno;
	}

	public void setBdgno(String bdgno) {
		this.bdgno = bdgno;
	}

	public String getBdgname() {
		return this.bdgname;
	}

	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}

	public Long getBdgflag() {
		return this.bdgflag;
	}

	public void setBdgflag(Long bdgflag) {
		this.bdgflag = bdgflag;
	}

	public Double getBdgmoney() {
		return this.bdgmoney;
	}

	public void setBdgmoney(Double bdgmoney) {
		this.bdgmoney = bdgmoney;
	}

	public Double getMatrmoney() {
		return this.matrmoney;
	}

	public void setMatrmoney(Double matrmoney) {
		this.matrmoney = matrmoney;
	}

	public Double getBuildmoney() {
		return this.buildmoney;
	}

	public void setBuildmoney(Double buildmoney) {
		this.buildmoney = buildmoney;
	}

	public Double getEqumoney() {
		return this.equmoney;
	}

	public void setEqumoney(Double equmoney) {
		this.equmoney = equmoney;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getParent() {
		return this.parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public Double getContmoney() {
		return this.contmoney;
	}

	public void setContmoney(Double contmoney) {
		this.contmoney = contmoney;
	}

	public Long getIsfinish() {
		return this.isfinish;
	}

	public void setIsfinish(Long isfinish) {
		this.isfinish = isfinish;
	}

	public String getCorrespondbdg() {
		return this.correspondbdg;
	}

	public void setCorrespondbdg(String correspondbdg) {
		this.correspondbdg = correspondbdg;
	}

	public Long getIsAudit() {
		return this.isAudit;
	}

	public void setIsAudit(Long isAudit) {
		this.isAudit = isAudit;
	}

	public String getAuditNo() {
		return this.auditNo;
	}

	public void setAuditNo(String auditNo) {
		this.auditNo = auditNo;
	}

	public String getAuditId() {
		return this.auditId;
	}

	public void setAuditId(String auditId) {
		this.auditId = auditId;
	}

	public String getAssetNo() {
		return this.assetNo;
	}

	public void setAssetNo(String assetNo) {
		this.assetNo = assetNo;
	}

	public Double getBdgmoneyCal() {
		return bdgmoneyCal;
	}

	public void setBdgmoneyCal(Double bdgmoneyCal) {
		this.bdgmoneyCal = bdgmoneyCal;
	}

	public Double getBdgmoneyDiffer() {
		if(this.bdgmoneyCal==null){
			this.bdgmoneyCal=0.0; 
		}
		return this.bdgmoney - this.bdgmoneyCal ;
	}

	public void setBdgmoneyDiffer(Double bdgmoneyDiffer) {
		this.bdgmoneyDiffer = bdgmoneyDiffer;
	}

	public Double getSumfactpay() {
		return sumfactpay;
	}

	public void setSumfactpay(Double sumfactpay) {
		this.sumfactpay = sumfactpay;
	}

	public Double getRemainingMoney() {
		return remainingMoney;
	}

	public void setRemainingMoney(Double remainingMoney) {
		this.remainingMoney = remainingMoney;
	}

	public Double getDifference() {
		return difference;
	}

	public void setDifference(Double difference) {
		this.difference = difference;
	}

	public String getGcType() {
		return gcType;
	}

	public void setGcType(String gcType) {
		this.gcType = gcType;
	}

	public Double getConbdgappmoney() {
		return conbdgappmoney;
	}

	public void setConbdgappmoney(Double conbdgappmoney) {
		this.conbdgappmoney = conbdgappmoney;
	}

	public Double getConapp() {
		return conapp;
	}

	public void setConapp(Double conapp) {
		this.conapp = conapp;
	}

	public Double getChangeapp() {
		return changeapp;
	}

	public void setChangeapp(Double changeapp) {
		this.changeapp = changeapp;
	}

	public Double getBreachapp() {
		return breachapp;
	}

	public void setBreachapp(Double breachapp) {
		this.breachapp = breachapp;
	}

	public Double getClaapp() {
		return claapp;
	}

	public void setClaapp(Double claapp) {
		this.claapp = claapp;
	}

	public Double getPayapp() {
		return payapp;
	}

	public void setPayapp(Double payapp) {
		this.payapp = payapp;
	}

	public Double getExpectedBdgActMoney() {
		return expectedBdgActMoney;
	}

	public void setExpectedBdgActMoney(Double expectedBdgActMoney) {
		this.expectedBdgActMoney = expectedBdgActMoney;
	}

	public Double getExpectedAmountMoney() {
		return expectedAmountMoney;
	}

	public void setExpectedAmountMoney(Double expectedAmountMoney) {
		this.expectedAmountMoney = expectedAmountMoney;
	}

	public Boolean getIscheck() {
		return ischeck;
	}

	public void setIscheck(Boolean ischeck) {
		this.ischeck = ischeck;
	}

	public String getFlag() {
		return flag;
	}

	public void setFlag(String flag) {
		this.flag = flag;
	}

	public Double getRatifyBdg() {
		return ratifyBdg;
	}

	public void setRatifyBdg(Double ratifyBdg) {
		this.ratifyBdg = ratifyBdg;
	}

	public String getProno() {
		return prono;
	}

	public void setProno(String prono) {
		this.prono = prono;
	}

	public Double getConjymoney() {
		return conjymoney;
	}

	public void setConjymoney(Double conjymoney) {
		this.conjymoney = conjymoney;
	}

	public Double getExpectedjyMoney() {
		return expectedjyMoney;
	}

	public void setExpectedjyMoney(Double expectedjyMoney) {
		this.expectedjyMoney = expectedjyMoney;
	}

	public Double getBidbdgmoney() {
		return bidbdgmoney;
	}

	public void setBidbdgmoney(Double bidbdgmoney) {
		this.bidbdgmoney = bidbdgmoney;
	}

	public Double getSignconbidbdgmoney() {
		return signconbidbdgmoney;
	}

	public void setSignconbidbdgmoney(Double signconbidbdgmoney) {
		this.signconbidbdgmoney = signconbidbdgmoney;
	}

	public Double getBidconappmoney() {
		return bidconappmoney;
	}

	public void setBidconappmoney(Double bidconappmoney) {
		this.bidconappmoney = bidconappmoney;
	}

	public Double getNotbidconappmoney() {
		return notbidconappmoney;
	}

	public void setNotbidconappmoney(Double notbidconappmoney) {
		this.notbidconappmoney = notbidconappmoney;
	}

	public Double getBidconothermoney() {
		return bidconothermoney;
	}

	public void setBidconothermoney(Double bidconothermoney) {
		this.bidconothermoney = bidconothermoney;
	}

}