package com.sgepit.pmis.zlaq.hbm;

import java.util.Date;

/**
 * ZlaqTree entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ZlaqTree implements java.io.Serializable {

	// Fields

	private String treeid;
	private String treename;
	private String parentid;
	private Integer pxh;
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
	private Integer memon1;
	private Integer memon2;
	private Integer memon3;
	private Integer memon4;
	private Integer memon5;
	private Date memod1;
	private Date memod2;
	private Date memod3;

	// Constructors

	/** default constructor */
	public ZlaqTree() {
	}

	/** minimal constructor */
	public ZlaqTree(String treeid) {
		this.treeid = treeid;
	}

	/** full constructor */
	public ZlaqTree(String treeid, String treename, String parentid,
			Integer pxh, String memo, String memoc1, String memoc2, String memoc3,
			String memoc4, String memoc5, String memoc6, String memoc7,
			String memoc8, String memoc9, String memoc10, Integer memon1,
			Integer memon2, Integer memon3, Integer memon4, Integer memon5, Date memod1,
			Date memod2, Date memod3) {
		this.treeid = treeid;
		this.treename = treename;
		this.parentid = parentid;
		this.pxh = pxh;
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
	}

	// Property accessors
	public String getTreeid() {
		return treeid;
	}

	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}

	public String getTreename() {
		return treename;
	}

	public void setTreename(String treename) {
		this.treename = treename;
	}

	public String getParentid() {
		return parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public Integer getPxh() {
		return pxh;
	}

	public void setPxh(Integer pxh) {
		this.pxh = pxh;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getMemoc1() {
		return memoc1;
	}

	public void setMemoc1(String memoc1) {
		this.memoc1 = memoc1;
	}

	public String getMemoc2() {
		return memoc2;
	}

	public void setMemoc2(String memoc2) {
		this.memoc2 = memoc2;
	}

	public String getMemoc3() {
		return memoc3;
	}

	public void setMemoc3(String memoc3) {
		this.memoc3 = memoc3;
	}

	public String getMemoc4() {
		return memoc4;
	}

	public void setMemoc4(String memoc4) {
		this.memoc4 = memoc4;
	}

	public String getMemoc5() {
		return memoc5;
	}

	public void setMemoc5(String memoc5) {
		this.memoc5 = memoc5;
	}

	public String getMemoc6() {
		return memoc6;
	}

	public void setMemoc6(String memoc6) {
		this.memoc6 = memoc6;
	}

	public String getMemoc7() {
		return memoc7;
	}

	public void setMemoc7(String memoc7) {
		this.memoc7 = memoc7;
	}

	public String getMemoc8() {
		return memoc8;
	}

	public void setMemoc8(String memoc8) {
		this.memoc8 = memoc8;
	}

	public String getMemoc9() {
		return memoc9;
	}

	public void setMemoc9(String memoc9) {
		this.memoc9 = memoc9;
	}

	public String getMemoc10() {
		return memoc10;
	}

	public void setMemoc10(String memoc10) {
		this.memoc10 = memoc10;
	}

	public Integer getMemon1() {
		return memon1;
	}

	public void setMemon1(Integer memon1) {
		this.memon1 = memon1;
	}

	public Integer getMemon2() {
		return memon2;
	}

	public void setMemon2(Integer memon2) {
		this.memon2 = memon2;
	}

	public Integer getMemon3() {
		return memon3;
	}

	public void setMemon3(Integer memon3) {
		this.memon3 = memon3;
	}

	public Integer getMemon4() {
		return memon4;
	}

	public void setMemon4(Integer memon4) {
		this.memon4 = memon4;
	}

	public Integer getMemon5() {
		return memon5;
	}

	public void setMemon5(Integer memon5) {
		this.memon5 = memon5;
	}

	public Date getMemod1() {
		return memod1;
	}

	public void setMemod1(Date memod1) {
		this.memod1 = memod1;
	}

	public Date getMemod2() {
		return memod2;
	}

	public void setMemod2(Date memod2) {
		this.memod2 = memod2;
	}

	public Date getMemod3() {
		return memod3;
	}

	public void setMemod3(Date memod3) {
		this.memod3 = memod3;
	}

}