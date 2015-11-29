package com.sgepit.pcmis.zhxx.hbm;

import java.util.Date;


public class PcZhxxProIndex implements java.io.Serializable {
	
	private String prjName;                  //项目名称
	private Double prjNum1;					//在建发电项目
	private Double totalCapacity;			//总装机容量
	private Double bdgTotalMoney1;			//发电项目概算总金额
	
	private Double prjNum2;					//在建非电项目
	private Double bdgTotalMoney2;			//非电项目概算总金额

	private Double yearTzTotalMoney;		//本年投资完成总金额
	private Double monthTzTotalMoney;		//本月投资完成总金额
	private Double allTzTotalMoney;			//自开工累计投资完成
	
	private Double yearTotalPayMoney;		//本年累计付款金额
	private Double monthTotalPayMoney;		//本月付款金额
	private Double allTotalPayMoney;		//自开工累计付款金额
	private Double allTotalPayMoneyNum;		//自开工累计付款个数
	private Double buildScale;				//建设规模
	private Double investScale;				//投资规模
	private String buildStart;				//开工日期
	private String buildEnd;					//预计完工日期
	private String buildStartMonth;           //开工日期月
    private String buildEndMonth;             //预计完工日期月
    
	private Integer totalDateNum;			//总工期
	private Integer finishDateNum;			//离完工还有天数
	
	private Double bdgTotalMoney;			//概算总金额
	private Double conTotalMoney;			//合同签订总金额
	
	private Double monthMoneyIn;			//本月资金到位
	private Double allTotalMoneyIn;			//自开工累计资金到位
	private Double lastMonthNum;			//上月数据完整性考核分数
	
	private Double totalMoneyIn;			//资金到位总金额
	
	private Double conTotalValueMoney;		//合同总金额
	
	private Double conMonthMoney;			//本月签订合同
		
	private Double conMonthMoneyNum;		//本月签订合同个数
    
	private Double monthPayMoney;			//本月合同付款
	
	private Double monthPayMoneyNum;		//本月合同付款个数
	
	private Double conMonthChangeMoney;		//本月合同变更
	
	private Double conMonthChangeMoneyNum;	//本月合同变更个数
	
	private Double allTotalConMoney;		//自开工累计签订合同
	
	private Double allTotalConMoneyNum;		//自开工累计签订合同个数
	
	private Double allTotalChangeMoney;		//自开工累计合同变更
	
	private Double allTotalChangeMoneyNum;	//自开工累计合同变更个数
	private String titleText;               //修改完工与否的标题
	
	private String prjQualityTarget;        //项目质量总目标
	
	public String getPrjName() {
		return prjName;
	}

	public void setPrjName(String prjName) {
		this.prjName = prjName;
	}

	public Double getPrjNum1() {
		return prjNum1;
	}

	public void setPrjNum1(Double prjNum1) {
		this.prjNum1 = prjNum1;
	}

	public Double getTotalCapacity() {
		return totalCapacity;
	}

	public void setTotalCapacity(Double totalCapacity) {
		this.totalCapacity = totalCapacity;
	}

	public Double getBdgTotalMoney1() {
		return bdgTotalMoney1;
	}

	public void setBdgTotalMoney1(Double bdgTotalMoney1) {
		this.bdgTotalMoney1 = bdgTotalMoney1;
	}

	public Double getPrjNum2() {
		return prjNum2;
	}

	public void setPrjNum2(Double prjNum2) {
		this.prjNum2 = prjNum2;
	}

	public Double getBdgTotalMoney2() {
		return bdgTotalMoney2;
	}

	public void setBdgTotalMoney2(Double bdgTotalMoney2) {
		this.bdgTotalMoney2 = bdgTotalMoney2;
	}

	public Double getYearTzTotalMoney() {
		return yearTzTotalMoney;
	}

	public void setYearTzTotalMoney(Double yearTzTotalMoney) {
		this.yearTzTotalMoney = yearTzTotalMoney;
	}

	public Double getMonthTzTotalMoney() {
		return monthTzTotalMoney;
	}

	public void setMonthTzTotalMoney(Double monthTzTotalMoney) {
		this.monthTzTotalMoney = monthTzTotalMoney;
	}

	public Double getAllTzTotalMoney() {
		return allTzTotalMoney;
	}

	public void setAllTzTotalMoney(Double allTzTotalMoney) {
		this.allTzTotalMoney = allTzTotalMoney;
	}

	public Double getMonthTotalPayMoney() {
		return monthTotalPayMoney;
	}

	public void setMonthTotalPayMoney(Double monthTotalPayMoney) {
		this.monthTotalPayMoney = monthTotalPayMoney;
	}

	public Double getAllTotalPayMoney() {
		return allTotalPayMoney;
	}

	public void setAllTotalPayMoney(Double allTotalPayMoney) {
		this.allTotalPayMoney = allTotalPayMoney;
	}

	public Double getBuildScale() {
		return buildScale;
	}

	public void setBuildScale(Double buildScale) {
		this.buildScale = buildScale;
	}

	public Double getInvestScale() {
		return investScale;
	}

	public void setInvestScale(Double investScale) {
		this.investScale = investScale;
	}

	public String getBuildStart() {
		return buildStart;
	}

	public void setBuildStart(String buildStart) {
		this.buildStart = buildStart;
	}

	public String getBuildEnd() {
		return buildEnd;
	}

	public void setBuildEnd(String buildEnd) {
		this.buildEnd = buildEnd;
	}

	public Integer getTotalDateNum() {
		return totalDateNum;
	}

	public void setTotalDateNum(Integer totalDateNum) {
		this.totalDateNum = totalDateNum;
	}

	public Integer getFinishDateNum() {
		return finishDateNum;
	}

	public void setFinishDateNum(Integer finishDateNum) {
		this.finishDateNum = finishDateNum;
	}

	public Double getBdgTotalMoney() {
		return bdgTotalMoney;
	}

	public void setBdgTotalMoney(Double bdgTotalMoney) {
		this.bdgTotalMoney = bdgTotalMoney;
	}

	public Double getConTotalMoney() {
		return conTotalMoney;
	}

	public void setConTotalMoney(Double conTotalMoney) {
		this.conTotalMoney = conTotalMoney;
	}

	public Double getMonthMoneyIn() {
		return monthMoneyIn;
	}

	public void setMonthMoneyIn(Double monthMoneyIn) {
		this.monthMoneyIn = monthMoneyIn;
	}

	public Double getLastMonthNum() {
		return lastMonthNum;
	}

	public void setLastMonthNum(Double lastMonthNum) {
		this.lastMonthNum = lastMonthNum;
	}

	public String getBuildStartMonth() {
		return buildStartMonth;
	}

	public void setBuildStartMonth(String buildStartMonth) {
		this.buildStartMonth = buildStartMonth;
	}

	public String getBuildEndMonth() {
		return buildEndMonth;
	}

	public void setBuildEndMonth(String buildEndMonth) {
		this.buildEndMonth = buildEndMonth;
	}
	
	public Double getYearTotalPayMoney() {
		return yearTotalPayMoney;
	}

	public void setYearTotalPayMoney(Double yearTotalPayMoney) {
		this.yearTotalPayMoney = yearTotalPayMoney;
	}


	public Double getTotalMoneyIn() {
		return totalMoneyIn;
	}

	public void setTotalMoneyIn(Double totalMoneyIn) {
		this.totalMoneyIn = totalMoneyIn;
	}

	public Double getConTotalValueMoney() {
		return conTotalValueMoney;
	}

	public void setConTotalValueMoney(Double conTotalValueMoney) {
		this.conTotalValueMoney = conTotalValueMoney;
	}

	public Double getConMonthMoneyNum() {
		return conMonthMoneyNum;
	}

	public void setConMonthMoneyNum(Double conMonthMoneyNum) {
		this.conMonthMoneyNum = conMonthMoneyNum;
	}

	public Double getMonthPayMoney() {
		return monthPayMoney;
	}

	public void setMonthPayMoney(Double monthPayMoney) {
		this.monthPayMoney = monthPayMoney;
	}

	public Double getMonthPayMoneyNum() {
		return monthPayMoneyNum;
	}

	public void setMonthPayMoneyNum(Double monthPayMoneyNum) {
		this.monthPayMoneyNum = monthPayMoneyNum;
	}

	public Double getConMonthChangeMoney() {
		return conMonthChangeMoney;
	}

	public void setConMonthChangeMoney(Double conMonthChangeMoney) {
		this.conMonthChangeMoney = conMonthChangeMoney;
	}

	public Double getConMonthChangeMoneyNum() {
		return conMonthChangeMoneyNum;
	}

	public void setConMonthChangeMoneyNum(Double conMonthChangeMoneyNum) {
		this.conMonthChangeMoneyNum = conMonthChangeMoneyNum;
	}

	public Double getAllTotalConMoney() {
		return allTotalConMoney;
	}

	public void setAllTotalConMoney(Double allTotalConMoney) {
		this.allTotalConMoney = allTotalConMoney;
	}

	public Double getAllTotalConMoneyNum() {
		return allTotalConMoneyNum;
	}

	public void setAllTotalConMoneyNum(Double allTotalConMoneyNum) {
		this.allTotalConMoneyNum = allTotalConMoneyNum;
	}

	public Double getAllTotalChangeMoney() {
		return allTotalChangeMoney;
	}

	public void setAllTotalChangeMoney(Double allTotalChangeMoney) {
		this.allTotalChangeMoney = allTotalChangeMoney;
	}

	public Double getAllTotalChangeMoneyNum() {
		return allTotalChangeMoneyNum;
	}

	public void setAllTotalChangeMoneyNum(Double allTotalChangeMoneyNum) {
		this.allTotalChangeMoneyNum = allTotalChangeMoneyNum;
	}

	public Double getAllTotalPayMoneyNum() {
		return allTotalPayMoneyNum;
	}

	public void setAllTotalPayMoneyNum(Double allTotalPayMoneyNum) {
		this.allTotalPayMoneyNum = allTotalPayMoneyNum;
	}

	public Double getConMonthMoney() {
		return conMonthMoney;
	}

	public void setConMonthMoney(Double conMonthMoney) {
		this.conMonthMoney = conMonthMoney;
	}


	public Double getAllTotalMoneyIn() {
		return allTotalMoneyIn;
	}

	public void setAllTotalMoneyIn(Double allTotalMoneyIn) {
		this.allTotalMoneyIn = allTotalMoneyIn;
	}

	public String getTitleText() {
		return titleText;
	}

	public void setTitleText(String titleText) {
		this.titleText = titleText;
	}

	public String getPrjQualityTarget() {
		return prjQualityTarget;
	}

	public void setPrjQualityTarget(String prjQualityTarget) {
		this.prjQualityTarget = prjQualityTarget;
	}


}
