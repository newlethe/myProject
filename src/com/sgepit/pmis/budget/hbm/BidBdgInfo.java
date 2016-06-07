package com.sgepit.pmis.budget.hbm;

import com.sgepit.pmis.budget.dao.BidBdgApportionDAO;
import com.sgepit.pmis.wzgl.dao.WZglDAO;

@SuppressWarnings("all")
public class BidBdgInfo implements java.io.Serializable {

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
	
	/**
	 * 招标对应的概算金额
	 */
	private  Double zbgsMoney;
	
	/**
	 * 设置是否选中
	 */
	private Boolean ischeck;

	// Constructors

	public Boolean getIscheck() {
		return ischeck;
	}

	public void setIscheck(Boolean ischeck) {
		this.ischeck = ischeck;
	}

	/** default constructor */
	public BidBdgInfo() {
	}

	/** minimal constructor */
	public BidBdgInfo(String pid) {
		this.pid = pid;
	}
	
	
	

	/** full constructor */
	
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


	public Double getRemainingMoneyCal() {
		return remainingMoneyCal;
	}

	public void setRemainingMoneyCal(Double remainingMoneyCal) {
		this.remainingMoneyCal = remainingMoneyCal;
	}


	public String getProno() {
		return prono;
	}

	public void setProno(String prono) {
		this.prono = prono;
	}

	public Double getZbgsMoney() {
		double sum = 0;
		try {
			BidBdgApportionDAO bidBdgApportionDao = BidBdgApportionDAO.getFromApplicationContext(com.sgepit.frame.base.Constant.wact);
			sum = bidBdgApportionDao.sumZbgsMoney(this.getBdgid());
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("计算招标对应概算金额时报错");
		}
		return sum;
	}

	public void setZbgsMoney(Double zbgsMoney) {
		this.zbgsMoney = zbgsMoney;
	}
}