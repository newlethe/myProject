package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * HrManInfo entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class HrManInfo implements java.io.Serializable {

	// Fields

	private String userid;
	private String realname;
	private String sex;
	private String phone;
	private String mobile;
	private String email;
	private String im;
	private String orgid;
	private String orgname;
	private String posid;
	private String posname;
	private String onthejob;
	private String nativeplace;
	private String race;
	private Date birthday;
	private String edurecord;
	private String height;
	private String weight;
	private String politicalfeatures;
	private String paperstype;
	private String papersno;
	private String maritalstatus;
	private String professionalpost;
	private String homeaddress;
	private Date workingtime;
	private String status;
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
	private String userNum;
	private String userEmpType;

	// Constructors

	/** default constructor */
	public HrManInfo() {
	}

	/** minimal constructor */
	public HrManInfo(String userid) {
		this.userid = userid;
	}

	/** full constructor */
	public HrManInfo(String userid, String realname, String sex, String phone,
			String mobile, String email, String im, String orgid,
			String orgname, String posid, String posname, String onthejob,
			String nativeplace, String race, Date birthday, String edurecord,
			String height, String weight, String politicalfeatures,
			String paperstype, String papersno, String maritalstatus,
			String professionalpost, String homeaddress, Date workingtime,
			String status, String memo, String memoc1, String memoc2,
			String memoc3, String memoc4, String memoc5, String memoc6,
			String memoc7, String memoc8, String memoc9, String memoc10,
			Long memon1, Long memon2, Long memon3, Long memon4, Long memon5,
			Date memod1, Date memod2, Date memod3, Date memod4, Date memod5,
			String memolong, String memoblob,String userNum,String userEmpType) {
		this.userid = userid;
		this.realname = realname;
		this.sex = sex;
		this.phone = phone;
		this.mobile = mobile;
		this.email = email;
		this.im = im;
		this.orgid = orgid;
		this.orgname = orgname;
		this.posid = posid;
		this.posname = posname;
		this.onthejob = onthejob;
		this.nativeplace = nativeplace;
		this.race = race;
		this.birthday = birthday;
		this.edurecord = edurecord;
		this.height = height;
		this.weight = weight;
		this.politicalfeatures = politicalfeatures;
		this.paperstype = paperstype;
		this.papersno = papersno;
		this.maritalstatus = maritalstatus;
		this.professionalpost = professionalpost;
		this.homeaddress = homeaddress;
		this.workingtime = workingtime;
		this.status = status;
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
		this.userNum=userNum;
		this.userEmpType=userEmpType;
	}

	// Property accessors

	public String getUserid() {
		return this.userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getRealname() {
		return this.realname;
	}

	public void setRealname(String realname) {
		this.realname = realname;
	}

	public String getSex() {
		return this.sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public String getPhone() {
		return this.phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getMobile() {
		return this.mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getIm() {
		return this.im;
	}

	public void setIm(String im) {
		this.im = im;
	}

	public String getOrgid() {
		return this.orgid;
	}

	public void setOrgid(String orgid) {
		this.orgid = orgid;
	}

	public String getOrgname() {
		return this.orgname;
	}

	public void setOrgname(String orgname) {
		this.orgname = orgname;
	}

	public String getPosid() {
		return this.posid;
	}

	public void setPosid(String posid) {
		this.posid = posid;
	}

	public String getPosname() {
		return this.posname;
	}

	public void setPosname(String posname) {
		this.posname = posname;
	}

	public String getOnthejob() {
		return this.onthejob;
	}

	public void setOnthejob(String onthejob) {
		this.onthejob = onthejob;
	}

	public String getNativeplace() {
		return this.nativeplace;
	}

	public void setNativeplace(String nativeplace) {
		this.nativeplace = nativeplace;
	}

	public String getRace() {
		return this.race;
	}

	public void setRace(String race) {
		this.race = race;
	}

	public Date getBirthday() {
		return this.birthday;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}

	public String getEdurecord() {
		return this.edurecord;
	}

	public void setEdurecord(String edurecord) {
		this.edurecord = edurecord;
	}

	public String getHeight() {
		return this.height;
	}

	public void setHeight(String height) {
		this.height = height;
	}

	public String getWeight() {
		return this.weight;
	}

	public void setWeight(String weight) {
		this.weight = weight;
	}

	public String getPoliticalfeatures() {
		return this.politicalfeatures;
	}

	public void setPoliticalfeatures(String politicalfeatures) {
		this.politicalfeatures = politicalfeatures;
	}

	public String getPaperstype() {
		return this.paperstype;
	}

	public void setPaperstype(String paperstype) {
		this.paperstype = paperstype;
	}

	public String getPapersno() {
		return this.papersno;
	}

	public void setPapersno(String papersno) {
		this.papersno = papersno;
	}

	public String getMaritalstatus() {
		return this.maritalstatus;
	}

	public void setMaritalstatus(String maritalstatus) {
		this.maritalstatus = maritalstatus;
	}

	public String getProfessionalpost() {
		return this.professionalpost;
	}

	public void setProfessionalpost(String professionalpost) {
		this.professionalpost = professionalpost;
	}

	public String getHomeaddress() {
		return this.homeaddress;
	}

	public void setHomeaddress(String homeaddress) {
		this.homeaddress = homeaddress;
	}

	public Date getWorkingtime() {
		return this.workingtime;
	}

	public void setWorkingtime(Date workingtime) {
		this.workingtime = workingtime;
	}

	public String getStatus() {
		return this.status;
	}

	public void setStatus(String status) {
		this.status = status;
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

	public String getUserNum() {
		return userNum;
	}

	public void setUserNum(String userNum) {
		this.userNum = userNum;
	}

	public String getUserEmpType() {
		return userEmpType;
	}

	public void setUserEmpType(String userEmpType) {
		this.userEmpType = userEmpType;
	}
}