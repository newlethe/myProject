package com.sgepit.pcmis.balance.hbm;

/**
 * BdgInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

@SuppressWarnings("serial")
public class PcBalanceSortTree implements java.io.Serializable {

	// Fields
	private String uids;
	private String pid;
	private String balanceNo;
	private String balanceName;
	private Double constructionCost;  //工程费用
	private Long isleaf;
	private String parent;
	private Double coMoney;//已完成金额
	
	//extends
	
	private String bak1;
	private String bak2;
//	private Double remainder;
//	private String cobdgno ;
//	private String cobdgname ;
//	private Double sumfactpay;//已付款总金额
//	private Double difference;//合同分摊总金额-已付款总金额
//	private Double conbdgappmoney;//合同分摊总金额
//	private Double conapp;//合同签订分摊总金额
//	private Double changeapp;//合同变更分摊总金额
//	private Double breachapp;//合同违约分摊总金额
//	private Double claapp;//索赔分摊总金额
//	private Double payapp;//付款分摊总金额
//	private Boolean ischeck;//treeGrid是否勾选上的标识
	// Constructors

	/** default constructor */
	public PcBalanceSortTree() {
	}
	
	public PcBalanceSortTree(String uids, String pid, String balanceNo, String balanceName,
			Double constructionCost,Long isleaf, String parent,Double coMoney,String bak1, String bak2) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.balanceNo = balanceNo;
		this.balanceName = balanceName;
		this.constructionCost = constructionCost;
		this.isleaf = isleaf;
		this.parent = parent;
		this.coMoney = coMoney;
		this.bak1 = bak1;
		this.bak2 = bak2;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
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

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getBalanceNo() {
		return balanceNo;
	}

	public void setBalanceNo(String balanceNo) {
		this.balanceNo = balanceNo;
	}

	public String getBalanceName() {
		return balanceName;
	}

	public void setBalanceName(String balanceName) {
		this.balanceName = balanceName;
	}

	public Double getConstructionCost() {
		return constructionCost;
	}

	public void setConstructionCost(Double constructionCost) {
		this.constructionCost = constructionCost;
	}

	public Double getCoMoney() {
		return coMoney;
	}

	public void setCoMoney(Double coMoney) {
		this.coMoney = coMoney;
	}

	public String getBak1() {
		return bak1;
	}

	public void setBak1(String bak1) {
		this.bak1 = bak1;
	}

	public String getBak2() {
		return bak2;
	}

	public void setBak2(String bak2) {
		this.bak2 = bak2;
	}
}