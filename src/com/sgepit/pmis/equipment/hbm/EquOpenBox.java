package com.sgepit.pmis.equipment.hbm;

import java.util.Date;

/**
 * EquOpenBox entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class EquOpenBox implements java.io.Serializable {

	// Fields

	private String uuid;
	private String conid;
	private String boxno;
	private Date opendate;
	private Date checkdate;
	private String appearance;
	private String equipment;
	private String filedetail;
	private String problems;
	private String comments;
	private String pid;
	private String ggId;
	private String buildPart;
	private String fixPart;
	private String openAddress;
	private String kxdh;
	private String partno;
	private String box_no;
	private String bz;
	private String jzh;
	private String sysbh;
	private String sysmc;
	private String sbmc;
	private String sbid;
	private Long billstate;
	private String jsbm;//接收编号
	private String ggxh;//规格型号
	private String wztype;//物资类别
	
	private Long kxzt;
	private String ghfwys;
	private String qdys;
	private String zlys;
	private String hjdwjry;

	public EquOpenBox(String uuid, String conid, String boxno, Date opendate,
			Date checkdate, String appearance, String equipment,
			String filedetail, String problems, String comments, String pid,
			String ggId, String buildPart, String fixPart, String openAddress,
			String kxdh, String partno, String box_no, String bz, String jzh,
			String sysbh, String sysmc, String sbmc, String sbid,
			Long billstate, String jsbm, String ggxh, String wztype, Long kxzt,
			String ghfwys, String qdys, String zlys, String hjdwjry) {
		super();
		this.uuid = uuid;
		this.conid = conid;
		this.boxno = boxno;
		this.opendate = opendate;
		this.checkdate = checkdate;
		this.appearance = appearance;
		this.equipment = equipment;
		this.filedetail = filedetail;
		this.problems = problems;
		this.comments = comments;
		this.pid = pid;
		this.ggId = ggId;
		this.buildPart = buildPart;
		this.fixPart = fixPart;
		this.openAddress = openAddress;
		this.kxdh = kxdh;
		this.partno = partno;
		this.box_no = box_no;
		this.bz = bz;
		this.jzh = jzh;
		this.sysbh = sysbh;
		this.sysmc = sysmc;
		this.sbmc = sbmc;
		this.sbid = sbid;
		this.billstate = billstate;
		this.jsbm = jsbm;
		this.ggxh = ggxh;
		this.wztype = wztype;
		this.kxzt = kxzt;
		this.ghfwys = ghfwys;
		this.qdys = qdys;
		this.zlys = zlys;
		this.hjdwjry = hjdwjry;
	}

	// Constructors
	/** default constructor */
	public EquOpenBox() {
	}

	/** full constructor */
	
	
	public String getJsbm() {
		return jsbm;
	}

	public void setJsbm(String jsbm) {
		this.jsbm = jsbm;
	}

	public String getGgxh() {
		return ggxh;
	}

	public void setGgxh(String ggxh) {
		this.ggxh = ggxh;
	}

	public String getWztype() {
		return wztype;
	}

	public void setWztype(String wztype) {
		this.wztype = wztype;
	}



	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getBoxno() {
		return this.boxno;
	}

	public void setBoxno(String boxno) {
		this.boxno = boxno;
	}

	public Date getOpendate() {
		return this.opendate;
	}

	public void setOpendate(Date opendate) {
		this.opendate = opendate;
	}

	public Date getCheckdate() {
		return this.checkdate;
	}

	public void setCheckdate(Date checkdate) {
		this.checkdate = checkdate;
	}

	public String getAppearance() {
		return this.appearance;
	}

	public void setAppearance(String appearance) {
		this.appearance = appearance;
	}

	public String getEquipment() {
		return this.equipment;
	}

	public void setEquipment(String equipment) {
		this.equipment = equipment;
	}

	public String getFiledetail() {
		return this.filedetail;
	}

	public void setFiledetail(String filedetail) {
		this.filedetail = filedetail;
	}

	public String getProblems() {
		return this.problems;
	}

	public void setProblems(String problems) {
		this.problems = problems;
	}

	public String getComments() {
		return this.comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getGgId() {
		return this.ggId;
	}

	public void setGgId(String ggId) {
		this.ggId = ggId;
	}

	public String getBuildPart() {
		return this.buildPart;
	}

	public void setBuildPart(String buildPart) {
		this.buildPart = buildPart;
	}

	public String getFixPart() {
		return this.fixPart;
	}

	public void setFixPart(String fixPart) {
		this.fixPart = fixPart;
	}

	public String getOpenAddress() {
		return this.openAddress;
	}

	public void setOpenAddress(String openAddress) {
		this.openAddress = openAddress;
	}

	public String getKxdh() {
		return this.kxdh;
	}

	public void setKxdh(String kxdh) {
		this.kxdh = kxdh;
	}

	public String getPartno() {
		return partno;
	}

	public void setPartno(String partno) {
		this.partno = partno;
	}

	public String getBz() {
		return bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public String getJzh() {
		return jzh;
	}

	public void setJzh(String jzh) {
		this.jzh = jzh;
	}

	public String getSysbh() {
		return sysbh;
	}

	public void setSysbh(String sysbh) {
		this.sysbh = sysbh;
	}

	public String getSysmc() {
		return sysmc;
	}

	public void setSysmc(String sysmc) {
		this.sysmc = sysmc;
	}

	public String getSbmc() {
		return sbmc;
	}

	public void setSbmc(String sbmc) {
		this.sbmc = sbmc;
	}

	public String getSbid() {
		return sbid;
	}

	public void setSbid(String sbid) {
		this.sbid = sbid;
	}

	public String getBox_no() {
		return box_no;
	}

	public void setBox_no(String box_no) {
		this.box_no = box_no;
	}

	public Long getBillstate() {
		return billstate;
	}

	public void setBillstate(Long billstate) {
		this.billstate = billstate;
	}

	public Long getKxzt() {
		return kxzt;
	}

	public void setKxzt(Long kxzt) {
		this.kxzt = kxzt;
	}

	public String getGhfwys() {
		return ghfwys;
	}

	public void setGhfwys(String ghfwys) {
		this.ghfwys = ghfwys;
	}

	public String getQdys() {
		return qdys;
	}

	public void setQdys(String qdys) {
		this.qdys = qdys;
	}

	public String getZlys() {
		return zlys;
	}

	public void setZlys(String zlys) {
		this.zlys = zlys;
	}

	public String getHjdwjry() {
		return hjdwjry;
	}

	public void setHjdwjry(String hjdwjry) {
		this.hjdwjry = hjdwjry;
	}

}