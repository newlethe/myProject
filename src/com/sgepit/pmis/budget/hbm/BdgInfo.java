package com.sgepit.pmis.budget.hbm;



/**
 * BdgInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class BdgInfo implements java.io.Serializable {

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
	private Double remainingMoney;//预计未签订合同金额(录入)
	private Double remainingMoneyCal;//预计未签订合同金额(计算)
	private String prono;//序号用于施工进度
	//extends

	private Double remainder;
	private String cobdgno ;
	private String cobdgname;
	private Double sumfactpay;//已付款总金额
	private Double difference;//合同分摊总金额-已付款总金额
	private String flag; //根据合同分摊总金额改变在Grid行显示颜色变化
	private Double ratifyBdg;//批准概算金额(录入)
	private Double ratifyBdgCal;//批准概算金额(计算)
	private Double conjymoney;//合同结余金额
	
	// Constructors

	/** default constructor */
	public BdgInfo() {
	}

	/** minimal constructor */
	public BdgInfo(String pid) {
		this.pid = pid;
	}

	/** full constructor */
	public BdgInfo(String bdgid, String pid, String bdgno, String bdgname,
			Long bdgflag, Double bdgmoney, Double matrmoney, Double buildmoney,
			Double equmoney, Long isleaf, String parent, Double contmoney,
			Long isfinish, String correspondbdg, Long isAudit, String auditNo,
			String auditId, String assetNo, Double bdgmoneyCal,
			Double bdgmoneyDiffer, String gcType, Double remainingMoney,
			Double remainingMoneyCal, String prono, Double remainder,
			String cobdgno, String cobdgname, Double sumfactpay,
			Double difference, String flag, Double ratifyBdg,
			Double ratifyBdgCal,Double conjymoney) {
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
		this.remainingMoneyCal = remainingMoneyCal;
		this.prono = prono;
		this.remainder = remainder;
		this.cobdgno = cobdgno;
		this.cobdgname = cobdgname;
		this.sumfactpay = sumfactpay;
		this.difference = difference;
		this.flag = flag;
		this.ratifyBdg = ratifyBdg;
		this.ratifyBdgCal = ratifyBdgCal;
		this.conjymoney = conjymoney;
	}
	
	// Property accessors

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
	
	public Double getBdgmoneyDiffer() {
		if(this.bdgmoneyCal==null){
			this.bdgmoneyCal=0.0; 
		}
		if(this.bdgmoney==null){
			this.bdgmoney=0.0; 
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
	
	public Double getRemainingMoney() {
		return remainingMoney;
	}

	public void setRemainingMoney(Double remainingMoney) {
		this.remainingMoney = remainingMoney;
	}

	
	public String getFlag() {
		return flag;
	}

	public void setFlag(String flag) {
		this.flag = flag;
	}

	public Double getRemainingMoneyCal() {
		return remainingMoneyCal;
	}

	public void setRemainingMoneyCal(Double remainingMoneyCal) {
		this.remainingMoneyCal = remainingMoneyCal;
	}

	public Double getRatifyBdg() {
		return ratifyBdg;
	}

	public void setRatifyBdg(Double ratifyBdg) {
		this.ratifyBdg = ratifyBdg;
	}

	public Double getRatifyBdgCal() {
		return ratifyBdgCal;
	}

	public void setRatifyBdgCal(Double ratifyBdgCal) {
		this.ratifyBdgCal = ratifyBdgCal;
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

}