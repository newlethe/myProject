package com.sgepit.pcmis.dynamicview.hbm;

public class PcDynamicIndex {
private String  pid;
private String projectName;

private String projectInfo;
private String basicState;         //项目基本信息审核状态
private Double basicValue;         //项目基本信息在打分时所占考核比重 

private String approvalData;

private String bidData;
private String bidState;          //招投标审核状态 
private Double bidValue;          //招投标审核所占比重值

private String conoveData;
private String conState;
private Double conValue;

private String bdgData;
private String bdgState;
private Double bdgValue;

private String securityData;
private String securityState;
private Double securityValue;

private String qualityData;
private String qualityState;
private Double qualityValue;

private String scheduleData;
private String scheduleState;
private Double scheduleValue;

private String investData;

private String statementsData;
private String statementState;
private Double statementValue;

public String getBasicState() {
	return basicState;
}
public void setBasicState(String basicState) {
	this.basicState = basicState;
}
public String getBidState() {
	return bidState;
}
public void setBidState(String bidState) {
	this.bidState = bidState;
}
public String getConState() {
	return conState;
}
public void setConState(String conState) {
	this.conState = conState;
}
public String getBdgState() {
	return bdgState;
}
public void setBdgState(String bdgState) {
	this.bdgState = bdgState;
}
public String getSecurityState() {
	return securityState;
}
public void setSecurityState(String securityState) {
	this.securityState = securityState;
}
public String getQualityState() {
	return qualityState;
}
public void setQualityState(String qualityState) {
	this.qualityState = qualityState;
}
public String getScheduleState() {
	return scheduleState;
}
public void setScheduleState(String scheduleState) {
	this.scheduleState = scheduleState;
}
public String getStatementState() {
	return statementState;
}
public void setStatementState(String statementState) {
	this.statementState = statementState;
}
public String getPid() {
	return pid;
}
public void setPid(String pid) {
	this.pid = pid;
}
public String getProjectName() {
	return projectName;
}
public void setProjectName(String projectName) {
	this.projectName = projectName;
}
public String getProjectInfo() {
	return projectInfo;
}
public void setProjectInfo(String projectInfo) {
	this.projectInfo = projectInfo;
}
public String getApprovalData() {
	return approvalData;
}
public void setApprovalData(String approvalData) {
	this.approvalData = approvalData;
}
public String getBidData() {
	return bidData;
}
public void setBidData(String bidData) {
	this.bidData = bidData;
}
public String getConoveData() {
	return conoveData;
}
public void setConoveData(String conoveData) {
	this.conoveData = conoveData;
}
public String getBdgData() {
	return bdgData;
}
public void setBdgData(String bdgData) {
	this.bdgData = bdgData;
}
public String getSecurityData() {
	return securityData;
}
public void setSecurityData(String securityData) {
	this.securityData = securityData;
}
public String getQualityData() {
	return qualityData;
}
public void setQualityData(String qualityData) {
	this.qualityData = qualityData;
}
public String getScheduleData() {
	return scheduleData;
}
public void setScheduleData(String scheduleData) {
	this.scheduleData = scheduleData;
}
public String getInvestData() {
	return investData;
}
public void setInvestData(String investData) {
	this.investData = investData;
}
public String getStatementsData() {
	return statementsData;
}
public void setStatementsData(String statementsData) {
	this.statementsData = statementsData;
}
public Double getBasicValue() {
	return basicValue;
}
public void setBasicValue(Double basicValue) {
	this.basicValue = basicValue;
}
public Double getBidValue() {
	return bidValue;
}
public void setBidValue(Double bidValue) {
	this.bidValue = bidValue;
}
public Double getConValue() {
	return conValue;
}
public void setConValue(Double conValue) {
	this.conValue = conValue;
}
public Double getBdgValue() {
	return bdgValue;
}
public void setBdgValue(Double bdgValue) {
	this.bdgValue = bdgValue;
}
public Double getSecurityValue() {
	return securityValue;
}
public void setSecurityValue(Double securityValue) {
	this.securityValue = securityValue;
}
public Double getQualityValue() {
	return qualityValue;
}
public void setQualityValue(Double qualityValue) {
	this.qualityValue = qualityValue;
}
public Double getScheduleValue() {
	return scheduleValue;
}
public void setScheduleValue(Double scheduleValue) {
	this.scheduleValue = scheduleValue;
}
public Double getStatementValue() {
	return statementValue;
}
public void setStatementValue(Double statementValue) {
	this.statementValue = statementValue;
}
}
