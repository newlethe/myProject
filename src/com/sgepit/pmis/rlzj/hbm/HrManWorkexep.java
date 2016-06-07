package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * HrManWorkexep entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class HrManWorkexep implements java.io.Serializable {

	// Fields

	private String seqnum;
	private String personnum;
	private String company;
	private Date starttime;
	private Date endtime;
	private String companytype;
	private String achievement;
	private String posname;
	private String professionalpost;
	private String worktype;
	private String otherinfo;
	private String leavereason;
	private String memo;
	private String memoc1;
	private String memoc2;
	private String memoc3;
	private String memoc4;
	private String memoc5;
	private String memoc6;
	private String memoc7;
	private String memoc8;
	private String memoc9;
	private String memoc10;
	private Long memon1;
	private Long memon2;
	private Long memon3;
	private Long memon4;
	private Long memon5;
	private Date memod1;
	private Date memod2;
	private Date memod3;
	private Date memod4;
	private Date memod5;
	private String memolong;
	private String memoblob;

	// Constructors

	/** default constructor */
	public HrManWorkexep() {
	}

	/** minimal constructor */
	public HrManWorkexep(String seqnum, String personnum) {
		this.seqnum = seqnum;
		this.personnum = personnum;
	}

	/** full constructor */
	public HrManWorkexep(String seqnum, String personnum, String company,
			Date starttime, Date endtime, String companytype,
			String achievement, String posname, String professionalpost,
			String worktype, String otherinfo, String leavereason, String memo,
			String memoc1, String memoc2, String memoc3, String memoc4,
			String memoc5, String memoc6, String memoc7, String memoc8,
			String memoc9, String memoc10, Long memon1, Long memon2,
			Long memon3, Long memon4, Long memon5, Date memod1, Date memod2,
			Date memod3, Date memod4, Date memod5, String memolong,
			String memoblob) {
		this.seqnum = seqnum;
		this.personnum = personnum;
		this.company = company;
		this.starttime = starttime;
		this.endtime = endtime;
		this.companytype = companytype;
		this.achievement = achievement;
		this.posname = posname;
		this.professionalpost = professionalpost;
		this.worktype = worktype;
		this.otherinfo = otherinfo;
		this.leavereason = leavereason;
		this.memo = memo;
		this.memoc1 = memoc1;
		this.memoc2 = memoc2;
		this.memoc3 = memoc3;
		this.memoc4 = memoc4;
		this.memoc5 = memoc5;
		this.memoc6 = memoc6;
		this.memoc7 = memoc7;
		this.memoc8 = memoc8;
		this.memoc9 = memoc9;
		this.memoc10 = memoc10;
		this.memon1 = memon1;
		this.memon2 = memon2;
		this.memon3 = memon3;
		this.memon4 = memon4;
		this.memon5 = memon5;
		this.memod1 = memod1;
		this.memod2 = memod2;
		this.memod3 = memod3;
		this.memod4 = memod4;
		this.memod5 = memod5;
		this.memolong = memolong;
		this.memoblob = memoblob;
	}

	// Property accessors

	public String getSeqnum() {
		return this.seqnum;
	}

	public void setSeqnum(String seqnum) {
		this.seqnum = seqnum;
	}

	public String getPersonnum() {
		return this.personnum;
	}

	public void setPersonnum(String personnum) {
		this.personnum = personnum;
	}

	public String getCompany() {
		return this.company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public Date getStarttime() {
		return this.starttime;
	}

	public void setStarttime(Date starttime) {
		this.starttime = starttime;
	}

	public Date getEndtime() {
		return this.endtime;
	}

	public void setEndtime(Date endtime) {
		this.endtime = endtime;
	}

	public String getCompanytype() {
		return this.companytype;
	}

	public void setCompanytype(String companytype) {
		this.companytype = companytype;
	}

	public String getAchievement() {
		return this.achievement;
	}

	public void setAchievement(String achievement) {
		this.achievement = achievement;
	}

	public String getPosname() {
		return this.posname;
	}

	public void setPosname(String posname) {
		this.posname = posname;
	}

	public String getProfessionalpost() {
		return this.professionalpost;
	}

	public void setProfessionalpost(String professionalpost) {
		this.professionalpost = professionalpost;
	}

	public String getWorktype() {
		return this.worktype;
	}

	public void setWorktype(String worktype) {
		this.worktype = worktype;
	}

	public String getOtherinfo() {
		return this.otherinfo;
	}

	public void setOtherinfo(String otherinfo) {
		this.otherinfo = otherinfo;
	}

	public String getLeavereason() {
		return this.leavereason;
	}

	public void setLeavereason(String leavereason) {
		this.leavereason = leavereason;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getMemoc1() {
		return this.memoc1;
	}

	public void setMemoc1(String memoc1) {
		this.memoc1 = memoc1;
	}

	public String getMemoc2() {
		return this.memoc2;
	}

	public void setMemoc2(String memoc2) {
		this.memoc2 = memoc2;
	}

	public String getMemoc3() {
		return this.memoc3;
	}

	public void setMemoc3(String memoc3) {
		this.memoc3 = memoc3;
	}

	public String getMemoc4() {
		return this.memoc4;
	}

	public void setMemoc4(String memoc4) {
		this.memoc4 = memoc4;
	}

	public String getMemoc5() {
		return this.memoc5;
	}

	public void setMemoc5(String memoc5) {
		this.memoc5 = memoc5;
	}

	public String getMemoc6() {
		return this.memoc6;
	}

	public void setMemoc6(String memoc6) {
		this.memoc6 = memoc6;
	}

	public String getMemoc7() {
		return this.memoc7;
	}

	public void setMemoc7(String memoc7) {
		this.memoc7 = memoc7;
	}

	public String getMemoc8() {
		return this.memoc8;
	}

	public void setMemoc8(String memoc8) {
		this.memoc8 = memoc8;
	}

	public String getMemoc9() {
		return this.memoc9;
	}

	public void setMemoc9(String memoc9) {
		this.memoc9 = memoc9;
	}

	public String getMemoc10() {
		return this.memoc10;
	}

	public void setMemoc10(String memoc10) {
		this.memoc10 = memoc10;
	}

	public Long getMemon1() {
		return this.memon1;
	}

	public void setMemon1(Long memon1) {
		this.memon1 = memon1;
	}

	public Long getMemon2() {
		return this.memon2;
	}

	public void setMemon2(Long memon2) {
		this.memon2 = memon2;
	}

	public Long getMemon3() {
		return this.memon3;
	}

	public void setMemon3(Long memon3) {
		this.memon3 = memon3;
	}

	public Long getMemon4() {
		return this.memon4;
	}

	public void setMemon4(Long memon4) {
		this.memon4 = memon4;
	}

	public Long getMemon5() {
		return this.memon5;
	}

	public void setMemon5(Long memon5) {
		this.memon5 = memon5;
	}

	public Date getMemod1() {
		return this.memod1;
	}

	public void setMemod1(Date memod1) {
		this.memod1 = memod1;
	}

	public Date getMemod2() {
		return this.memod2;
	}

	public void setMemod2(Date memod2) {
		this.memod2 = memod2;
	}

	public Date getMemod3() {
		return this.memod3;
	}

	public void setMemod3(Date memod3) {
		this.memod3 = memod3;
	}

	public Date getMemod4() {
		return this.memod4;
	}

	public void setMemod4(Date memod4) {
		this.memod4 = memod4;
	}

	public Date getMemod5() {
		return this.memod5;
	}

	public void setMemod5(Date memod5) {
		this.memod5 = memod5;
	}

	public String getMemolong() {
		return this.memolong;
	}

	public void setMemolong(String memolong) {
		this.memolong = memolong;
	}

	public String getMemoblob() {
		return this.memoblob;
	}

	public void setMemoblob(String memoblob) {
		this.memoblob = memoblob;
	}

}