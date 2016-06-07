package com.sgepit.pmis.wzgl.hbm;


import java.util.Date;

/**
 * EquList entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzList implements java.io.Serializable {

	// Fields

	private String sbId;
	private String pid;
	private String indexId;
	private String sbBm;
	private String sbMc;
	private String sccj;
	private String ggxh;
	private String dw;
	private Long zs;
	private Long dhzs;
	private Long dj;
	private Long zj;
	private String jzh;
	private String sx;
	private String parentid;
	private Long isleaf;
	private String conid;
	private Date returnDate;
	private String boxNo;
	private String partNo;
	private String recordman;
	private String projectDept;
	private String supervision;
	private String storeBillstate;
	private String kks;
	private Long jhsl;
	private String bdgid;
	private String bdgno;
	private Long azsl;
	private Date azrq;
	private String azwz;
	private String azdw;
	private Long dhzsl;
	private Long yszsl;
	private Long rkzsl;
	private Long ckzsl;
	private Long kczsl;

	// Constructors

	/** default constructor */
	public WzList() {
	}

	/** full constructor */
	public WzList(String pid, String indexId, String sbBm, String sbMc,
			String sccj, String ggxh, String dw, Long zs, Long dhzs,
			Long dj, Long zj, String jzh, String sx, String parentid,
			Long isleaf, String conid, Date returnDate, String boxNo,
			String partNo, String recordman, String projectDept,
			String supervision, String storeBillstate, String kks, Long jhsl,
			String bdgid, String bdgno, Long azsl, Date azrq, String azwz, String azdw,
			Long dhzsl, Long yszsl, Long rkzsl, Long ckzsl, Long kczsl) {
		this.pid = pid;
		this.indexId = indexId;
		this.sbBm = sbBm;
		this.sbMc = sbMc;
		this.sccj = sccj;
		this.ggxh = ggxh;
		this.dw = dw;
		this.zs = zs;
		this.dhzs = dhzs;
		this.dj = dj;
		this.zj = zj;
		this.jzh = jzh;
		this.sx = sx;
		this.parentid = parentid;
		this.isleaf = isleaf;
		this.conid = conid;
		this.returnDate = returnDate;
		this.boxNo = boxNo;
		this.partNo = partNo;
		this.recordman = recordman;
		this.projectDept = projectDept;
		this.supervision = supervision;
		this.storeBillstate = storeBillstate;
		this.kks = kks;
		this.jhsl = jhsl;
		this.bdgid = bdgid;
		this.bdgno = bdgno;
		this.azsl = azsl;
		this.azrq = azrq;
		this.azwz = azwz;
		this.azdw = azdw;
		this.dhzsl = dhzsl;
		this.yszsl = yszsl;
		this.rkzsl = rkzsl;
		this.ckzsl = ckzsl;
		this.kczsl = kczsl;
	}

	// Property accessors

	public String getSbId() {
		return this.sbId;
	}

	public void setSbId(String sbId) {
		this.sbId = sbId;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getIndexId() {
		return this.indexId;
	}

	public void setIndexId(String indexId) {
		this.indexId = indexId;
	}

	public String getSbBm() {
		return this.sbBm;
	}

	public void setSbBm(String sbBm) {
		this.sbBm = sbBm;
	}

	public String getSbMc() {
		return this.sbMc;
	}

	public void setSbMc(String sbMc) {
		this.sbMc = sbMc;
	}

	public String getSccj() {
		return this.sccj;
	}

	public void setSccj(String sccj) {
		this.sccj = sccj;
	}

	public String getGgxh() {
		return this.ggxh;
	}

	public void setGgxh(String ggxh) {
		this.ggxh = ggxh;
	}

	public String getDw() {
		return this.dw;
	}

	public void setDw(String dw) {
		this.dw = dw;
	}

	public Long getZs() {
		return this.zs;
	}

	public void setZs(Long zs) {
		this.zs = zs;
	}

	public Long getDhzs() {
		return this.dhzs;
	}

	public void setDhzs(Long dhzs) {
		this.dhzs = dhzs;
	}

	public Long getDj() {
		return this.dj;
	}

	public void setDj(Long dj) {
		this.dj = dj;
	}

	public Long getZj() {
		return this.zj;
	}

	public void setZj(Long zj) {
		this.zj = zj;
	}

	public String getJzh() {
		return this.jzh;
	}

	public void setJzh(String jzh) {
		this.jzh = jzh;
	}

	public String getSx() {
		return this.sx;
	}

	public void setSx(String sx) {
		this.sx = sx;
	}

	public String getParentid() {
		return this.parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public Long getIsleaf() {
		return this.isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getConid() {
		return this.conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public Date getReturnDate() {
		return this.returnDate;
	}

	public void setReturnDate(Date returnDate) {
		this.returnDate = returnDate;
	}

	public String getBoxNo() {
		return this.boxNo;
	}

	public void setBoxNo(String boxNo) {
		this.boxNo = boxNo;
	}

	public String getPartNo() {
		return this.partNo;
	}

	public void setPartNo(String partNo) {
		this.partNo = partNo;
	}

	public String getRecordman() {
		return this.recordman;
	}

	public void setRecordman(String recordman) {
		this.recordman = recordman;
	}

	public String getProjectDept() {
		return this.projectDept;
	}

	public void setProjectDept(String projectDept) {
		this.projectDept = projectDept;
	}

	public String getSupervision() {
		return this.supervision;
	}

	public void setSupervision(String supervision) {
		this.supervision = supervision;
	}

	public String getStoreBillstate() {
		return this.storeBillstate;
	}

	public void setStoreBillstate(String storeBillstate) {
		this.storeBillstate = storeBillstate;
	}

	public String getKks() {
		return this.kks;
	}

	public void setKks(String kks) {
		this.kks = kks;
	}

	public Long getJhsl() {
		return this.jhsl;
	}

	public void setJhsl(Long jhsl) {
		this.jhsl = jhsl;
	}

	public String getBdgid() {
		return this.bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public Long getAzsl() {
		return this.azsl;
	}

	public void setAzsl(Long azsl) {
		this.azsl = azsl;
	}

	public Date getAzrq() {
		return this.azrq;
	}

	public void setAzrq(Date azrq) {
		this.azrq = azrq;
	}

	public String getAzwz() {
		return this.azwz;
	}

	public void setAzwz(String azwz) {
		this.azwz = azwz;
	}

	public String getAzdw() {
		return this.azdw;
	}

	public void setAzdw(String azdw) {
		this.azdw = azdw;
	}

	public Long getDhzsl() {
		return this.dhzsl;
	}

	public void setDhzsl(Long dhzsl) {
		this.dhzsl = dhzsl;
	}

	public Long getYszsl() {
		return this.yszsl;
	}

	public void setYszsl(Long yszsl) {
		this.yszsl = yszsl;
	}

	public Long getRkzsl() {
		return this.rkzsl;
	}

	public void setRkzsl(Long rkzsl) {
		this.rkzsl = rkzsl;
	}

	public Long getCkzsl() {
		return this.ckzsl;
	}

	public void setCkzsl(Long ckzsl) {
		this.ckzsl = ckzsl;
	}

	public Long getKczsl() {
		return this.kczsl;
	}

	public void setKczsl(Long kczsl) {
		this.kczsl = kczsl;
	}

	public String getBdgno() {
		return bdgno;
	}

	public void setBdgno(String bdgno) {
		this.bdgno = bdgno;
	}

}