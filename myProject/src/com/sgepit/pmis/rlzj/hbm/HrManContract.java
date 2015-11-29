package com.sgepit.pmis.rlzj.hbm;

import java.io.Serializable;
import java.util.Date;

public class HrManContract implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
 private String seqnum;  //主键
 private Date  entryDate;//入职日期
 private Integer workYears;//本单位工龄
 private Date leftDate;//离职日期
 private Date signedDate;//合同签订日期
 private Date endDate;//合同结束日期
 private String employModus;//用工形式
 private String personnum;//用户Id
 private String extends1;//扩展字段1
 
public HrManContract() {
}

public String getSeqnum() {
	return seqnum;
}

public void setSeqnum(String seqnum) {
	this.seqnum = seqnum;
}

public Date getEntryDate() {
	return entryDate;
}

public void setEntryDate(Date entryDate) {
	this.entryDate = entryDate;
}
public Integer getWorkYears() {
	return workYears;
}

public void setWorkYears(Integer workYears) {
	this.workYears = workYears;
}

public Date getLeftDate() {
	return leftDate;
}

public void setLeftDate(Date leftDate) {
	this.leftDate = leftDate;
}

public Date getSignedDate() {
	return signedDate;
}

public void setSignedDate(Date signedDate) {
	this.signedDate = signedDate;
}

public Date getEndDate() {
	return endDate;
}

public void setEndDate(Date endDate) {
	this.endDate = endDate;
}

public String getEmployModus() {
	return employModus;
}

public void setEmployModus(String employModus) {
	this.employModus = employModus;
}



public String getPersonnum() {
	return personnum;
}

public void setPersonnum(String personnum) {
	this.personnum = personnum;
}

public String getExtends1() {
	return extends1;
}

public void setExtends1(String extends1) {
	this.extends1 = extends1;
}

public static long getSerialVersionUID() {
	return serialVersionUID;
}

public HrManContract(String seqnum, Date entryDate, Integer workYears,
		Date leftDate, Date signedDate, Date endDate, String employModus,
		String personnum, String extends1) {
	super();
	this.seqnum = seqnum;
	this.entryDate = entryDate;
	this.workYears = workYears;
	this.leftDate = leftDate;
	this.signedDate = signedDate;
	this.endDate = endDate;
	this.employModus = employModus;
	this.personnum = personnum;
	this.extends1 = extends1;
}



}
