package com.sgepit.pcmis.budget.hbm;

import java.math.BigDecimal;

import javax.persistence.Entity;


@Entity
public class PCBudgetProInof {
    
	private String bdgid;
	private String bdgname;
	private Double bdgmoney;
	private Double contmoney;
	private Double changeappmoney;
	private Double  changemoney;
	private Double bdgcalconmoney;//
	private Double monthmoney;
	private Double yearmoney;
	private Double allmoney;
	private String percent;
	private String conname;
	private BigDecimal bdgTotalMoney;
	private BigDecimal conMoney;
	private BigDecimal leftMoney;
	private BigDecimal balMoney;
	private String pid;
	private Long isleaf;
	private String parent;
	
	//BUG8335新增字段 zhangh 2015-11-16
	private Double bidbdgmoney;
	
	
	public String getParent() {
		return parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public PCBudgetProInof() {
		super();
	}
	
	public PCBudgetProInof(String bdgid, String bdgname, Double bdgmoney,
			Double contmoney, Double changeappmoney, Double changemoney,
			Double bdgcalconmoney, Double monthmoney, Double yearmoney,
			Double allmoney, String percent, String conname,BigDecimal bdgTotalMoney, BigDecimal conMoney,
			BigDecimal leftMoney, String pid,Long isleaf,String parent) {
				super();
				this.bdgid = bdgid;
				this.bdgname = bdgname;
				this.bdgmoney = bdgmoney;
				this.contmoney = contmoney;
				this.changeappmoney = changeappmoney;
				this.changemoney = changemoney;
				this.bdgcalconmoney = bdgcalconmoney;
				this.monthmoney = monthmoney;
				this.yearmoney = yearmoney;
				this.allmoney = allmoney;
				this.percent = percent;
				this.conname = conname;
				this.bdgTotalMoney = bdgTotalMoney;
				this.conMoney = conMoney;
				this.leftMoney = leftMoney;
				this.pid = pid;
				this.isleaf = isleaf;
				this.parent=parent;
	}
	public Long getIsleaf() {
		return isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getBdgid() {
		return bdgid;
	}
	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}
	public String getBdgname() {
		return bdgname;
	}
	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}
	public Double getBdgmoney() {
		return bdgmoney;
	}
	public void setBdgmoney(Double bdgmoney) {
		this.bdgmoney = bdgmoney;
	}
	public Double getContmoney() {
		return contmoney;
	}
	public void setContmoney(Double contmoney) {
		this.contmoney = contmoney;
	}
	public Double getChangeappmoney() {
		return changeappmoney;
	}
	public void setChangeappmoney(Double changeappmoney) {
		this.changeappmoney = changeappmoney;
	}
	public Double getChangemoney() {
		return changemoney;
	}
	public void setChangemoney(Double changemoney) {
		this.changemoney = changemoney;
	}
	public Double getBdgcalconmoney() {
		return bdgcalconmoney;
	}
	public void setBdgcalconmoney(Double bdgcalconmoney) {
		this.bdgcalconmoney = bdgcalconmoney;
	}
	public Double getMonthmoney() {
		return monthmoney;
	}
	public void setMonthmoney(Double monthmoney) {
		this.monthmoney = monthmoney;
	}
	public Double getYearmoney() {
		return yearmoney;
	}
	public void setYearmoney(Double yearmoney) {
		this.yearmoney = yearmoney;
	}
	public Double getAllmoney() {
		return allmoney;
	}
	public void setAllmoney(Double allmoney) {
		this.allmoney = allmoney;
	}
	public String getPercent() {
		return percent;
	}
	public void setPercent(String percent) {
		this.percent = percent;
	}
	public String getConname() {
		return conname;
	}
	public void setConname(String conname) {
		this.conname = conname;
	}
	public BigDecimal getBdgTotalMoney() {
		return bdgTotalMoney;
	}
	public void setBdgTotalMoney(BigDecimal bdgTotalMoney) {
		this.bdgTotalMoney = bdgTotalMoney;
	}
	public BigDecimal getConMoney() {
		return conMoney;
	}
	public void setConMoney(BigDecimal conMoney) {
		this.conMoney = conMoney;
	}
	public BigDecimal getLeftMoney() {
		return leftMoney;
	}
	public void setLeftMoney(BigDecimal leftMoney) {
		this.leftMoney = leftMoney;
	}
	public BigDecimal getBalMoney() {
		return balMoney;
	}
	public void setBalMoney(BigDecimal balMoney) {
		this.balMoney = balMoney;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}

	public Double getBidbdgmoney() {
		return bidbdgmoney;
	}

	public void setBidbdgmoney(Double bidbdgmoney) {
		this.bidbdgmoney = bidbdgmoney;
	}

	
}
