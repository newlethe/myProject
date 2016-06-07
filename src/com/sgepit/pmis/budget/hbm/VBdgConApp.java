package com.sgepit.pmis.budget.hbm;

import java.util.List;

import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.pmis.budget.dao.BdgInfoDAO;
import com.sgepit.pmis.contract.hbm.ConOve;
import com.sgepit.pmis.wzgl.dao.WZglDAO;
import com.sgepit.pmis.wzgl.hbm.WzBm;

/**
 * 合同概算视图
 * @author shangtw
 * create time:2011 12 15
 */
public class VBdgConApp implements java.io.Serializable{
	private String pid;
	private String conid;
	private String bdgid;
	private String parent;
	private String bdgno;
	private String bdgname;
	private Double bdgmoney;
	private Double conbdgappmoney;//所有合同分摊总金额 
	private Double initappmoney;//合同签订分摊金额
	private Double changeappmoney;//合同变更分摊金额
	private Double claappmoney;//合同索赔分摊金额
	private Double breachappmoney;//合同违约分摊金额
	private Double conappmoney;//本合同分摊总金额
	private Double factappmoney;//实际付款分摊金额
	private Long isleaf;
	private Boolean ischeck;//设置勾选的值
	private String remark;
	
	private Double bidbdgmoney;//招标对应概算金额
	private Double conbidbdgmoney;//本合同招标对应概算金额
	private Long isbid;//判断是否是招投标选择的概算项

	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public String getConid() {
		return conid;
	}
	public void setConid(String conid) {
		this.conid = conid;
	}
	public String getBdgid() {
		return bdgid;
	}
	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}
	public String getParent() {
		return parent;
	}
	public void setParent(String parent) {
		this.parent = parent;
	}
	public String getBdgno() {
		return bdgno;
	}
	public void setBdgno(String bdgno) {
		this.bdgno = bdgno;
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
	public Double getConbdgappmoney() {
		return conbdgappmoney;
	}
	public void setConbdgappmoney(Double conbdgappmoney) {
		this.conbdgappmoney = conbdgappmoney;
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
	public Long getIsleaf() {
		return isleaf;
	}
	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}
	public Double getFactappmoney() {
		return factappmoney;
	}
	public void setFactappmoney(Double factappmoney) {
		this.factappmoney = factappmoney;
	}
	public Boolean getIscheck() {
		return ischeck;
	}
	public void setIscheck(Boolean ischeck) {
		this.ischeck = ischeck;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public Double getBidbdgmoney() {
		return bidbdgmoney;
	}
	public void setBidbdgmoney(Double bidbdgmoney) {
		this.bidbdgmoney = bidbdgmoney;
	}
	public Double getConbidbdgmoney() {
		return conbidbdgmoney;
	}
	public void setConbidbdgmoney(Double conbidbdgmoney) {
		this.conbidbdgmoney = conbidbdgmoney;
	}
	public Long getIsbid() {
		return isbid;
	}
	public void setIsbid(Long isbid) {
		this.isbid = isbid;
	}
	
}
