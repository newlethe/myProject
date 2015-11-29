package com.sgepit.pmis.finalAccounts.complete.hbm;
/**
 * 未完工合同表
 * @author pengy
 * @createtime 2013-07-05
 */
public class FACompUncompCon {

	private String conid;		//合同Id
	private String pid;			//项目Id
	private String conmoneyno;	//合同财务编号
	private String conno;		//合同编号
	private String conname;		//合同名称
	private Double conmoney;	//合同签订金额
	private Double changemoney;	//合同变更总金额
	private Double convaluemoney;	//合同总金额
	private Double investmoney;		//投资完成汇总

	public FACompUncompCon() {
		super();
		// TODO Auto-generated constructor stub
	}

	public FACompUncompCon(String conid, String pid, String conmoneyno,
			String conno, String conname, Double conmoney, Double changemoney,
			Double convaluemoney, Double investmoney) {
		super();
		this.conid = conid;
		this.pid = pid;
		this.conmoneyno = conmoneyno;
		this.conno = conno;
		this.conname = conname;
		this.conmoney = conmoney;
		this.changemoney = changemoney;
		this.convaluemoney = convaluemoney;
		this.investmoney = investmoney;
	}

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

	public String getConmoneyno() {
		return conmoneyno;
	}

	public void setConmoneyno(String conmoneyno) {
		this.conmoneyno = conmoneyno;
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

	public Double getConmoney() {
		return conmoney;
	}

	public void setConmoney(Double conmoney) {
		this.conmoney = conmoney;
	}

	public Double getChangemoney() {
		return changemoney;
	}

	public void setChangemoney(Double changemoney) {
		this.changemoney = changemoney;
	}

	public Double getConvaluemoney() {
		return convaluemoney;
	}

	public void setConvaluemoney(Double convaluemoney) {
		this.convaluemoney = convaluemoney;
	}

	public Double getInvestmoney() {
		return investmoney;
	}

	public void setInvestmoney(Double investmoney) {
		this.investmoney = investmoney;
	}

}
