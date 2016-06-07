package com.sgepit.pmis.equipment.hbm;

import com.sgepit.pmis.equipment.dao.EquipmentDAO;

/**
 * EquSbdh entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class EquSbdh implements java.io.Serializable {

	// Fields

	private String uuid;
	private String pid;
	private String dhId;
	private String conid;
	private String sbId;
	private String sccj;
	private String ggxh;
	private String dw;
	private Double zs;
	private Long dhsl;
	private Double dj;
	private Double zj;
	private String jzh;
	private Long iskx;
	private String kxdh;
	private String sx;
	private String parentid;
	private String bdgid;
	private String fitPlace;
	private String assetNo;
	private String auditId;
	
	private String gcbh;
	private String bz;
    private String wztype;
    private String warehouseno;
    private String libraryno;
    
    private String sbno;
    private String sbmc;
    private Long rksl;
    
	// Constructors

	public EquSbdh(String uuid, String pid, String dhId, String conid,
			String sbId, String sccj, String ggxh, String dw, Double zs,
			Long dhsl, Double dj, Double zj, String jzh, Long iskx,
			String kxdh, String sx, String parentid, String bdgid,
			String fitPlace, String assetNo, String auditId, String gcbh,
			String bz, String wztype, String warehouseno, String libraryno,
			String sbno, String sbmc, Long rksl) {
		super();
		this.uuid = uuid;
		this.pid = pid;
		this.dhId = dhId;
		this.conid = conid;
		this.sbId = sbId;
		this.sccj = sccj;
		this.ggxh = ggxh;
		this.dw = dw;
		this.zs = zs;
		this.dhsl = dhsl;
		this.dj = dj;
		this.zj = zj;
		this.jzh = jzh;
		this.iskx = iskx;
		this.kxdh = kxdh;
		this.sx = sx;
		this.parentid = parentid;
		this.bdgid = bdgid;
		this.fitPlace = fitPlace;
		this.assetNo = assetNo;
		this.auditId = auditId;
		this.gcbh = gcbh;
		this.bz = bz;
		this.wztype = wztype;
		this.warehouseno = warehouseno;
		this.libraryno = libraryno;
		this.sbno = sbno;
		this.sbmc = sbmc;
		this.rksl = rksl;
	}

	/** default constructor */
	public EquSbdh() {
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getDhId() {
		return dhId;
	}

	public void setDhId(String dhId) {
		this.dhId = dhId;
	}

	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getSbId() {
		return sbId;
	}

	public void setSbId(String sbId) {
		this.sbId = sbId;
		EquipmentDAO equDao = EquipmentDAO.getFromApplicationContext(com.sgepit.frame.base.Constant.wact);		
		EquList equ = (EquList) equDao.findById("com.sgepit.pmis.equipment.hbm.EquList",sbId);
		this.sbno = equ.getSbBm();
		this.sbmc = equ.getSbMc();
		this.dw = equ.getDw();
		this.sccj = equ.getSccj();
		this.ggxh = equ.getGgxh();
		this.sx = equ.getSx();	
		this.jzh = equ.getJzh();
		this.wztype = equ.getSx();
	}

	public String getGgxh() {
		return ggxh;
	}

	public Double getZs() {
		return zs;
	}

	public void setZs(Double zs) {
		this.zs = zs;
	}

	public Long getDhsl() {
		return dhsl;
	}

	public void setDhsl(Long dhsl) {
		this.dhsl = dhsl;
	}

	public Double getDj() {
		return dj;
	}

	public void setDj(Double dj) {
		this.dj = dj;
	}

	public Double getZj() {
		return zj;
	}

	public void setZj(Double zj) {
		this.zj = zj;
	}

	public Long getIskx() {
		return iskx;
	}

	public void setIskx(Long iskx) {
		this.iskx = iskx;
	}

	public String getKxdh() {
		return kxdh;
	}

	public void setKxdh(String kxdh) {
		this.kxdh = kxdh;
	}

	public String getParentid() {
		return parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public String getBdgid() {
		return bdgid;
	}

	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}

	public String getFitPlace() {
		return fitPlace;
	}

	public void setFitPlace(String fitPlace) {
		this.fitPlace = fitPlace;
	}

	public String getAssetNo() {
		return assetNo;
	}

	public void setAssetNo(String assetNo) {
		this.assetNo = assetNo;
	}

	public String getAuditId() {
		return auditId;
	}

	public void setAuditId(String auditId) {
		this.auditId = auditId;
	}

	public String getGcbh() {
		return gcbh;
	}

	public void setGcbh(String gcbh) {
		this.gcbh = gcbh;
	}

	public String getBz() {
		return bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public String getWarehouseno() {
		return warehouseno;
	}

	public void setWarehouseno(String warehouseno) {
		this.warehouseno = warehouseno;
	}

	public String getLibraryno() {
		return libraryno;
	}

	public void setLibraryno(String libraryno) {
		this.libraryno = libraryno;
	}

	public String getSbno() {
		return sbno;
	}

	public void setSbno(String sbno) {
		this.sbno = sbno;
	}

	public Long getRksl() {
		return rksl;
	}

	public void setRksl(Long rksl) {
		this.rksl = rksl;
	}

	public String getSccj() {
		return sccj;
	}

	public String getDw() {
		return dw;
	}

	public String getJzh() {
		return jzh;
	}

	public String getSx() {
		return sx;
	}

	public String getWztype() {
		return wztype;
	}

	public String getSbmc() {
		return sbmc;
	}

	public void setSbmc(String sbmc) {
		this.sbmc = sbmc;
	}

	public void setSccj(String sccj) {
		this.sccj = sccj;
	}

	public void setGgxh(String ggxh) {
		this.ggxh = ggxh;
	}

	public void setDw(String dw) {
		this.dw = dw;
	}

	public void setJzh(String jzh) {
		this.jzh = jzh;
	}

	public void setSx(String sx) {
		this.sx = sx;
	}

	public void setWztype(String wztype) {
		this.wztype = wztype;
	}
	

	/** full constructor */

	// Property accessors

	

}