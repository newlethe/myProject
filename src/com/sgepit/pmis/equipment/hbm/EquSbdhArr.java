package com.sgepit.pmis.equipment.hbm;

import com.sgepit.pmis.equipment.dao.EquipmentDAO;

/**
 * EquSbdhArr entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class EquSbdhArr implements java.io.Serializable {

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
	private Double dhsl;
	private Double dj;
	private Double zj;
	private String jzh;
	private Long iskx;
	private String kxdh;
	private String sx;
	private String parentid;
	private String dhzt;
	private String sbbm;
	private String sbmc;
	private String wztype;
	private String boxno;
	private String partno;
	
	private String dz;
	private String zz;
	private String dhtj;
	private String zcd;
	private String czcdj;

	// Constructors

	public EquSbdhArr(String uuid, String pid, String dhId, String conid,
			String sbId, String sccj, String ggxh, String dw, Double zs,
			Double dhsl, Double dj, Double zj, String jzh, Long iskx,
			String kxdh, String sx, String parentid, String dhzt, String sbbm,
			String sbmc, String wztype, String boxno, String partno, String dz,
			String zz, String dhtj, String zcd, String czcdj) {
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
		this.dhzt = dhzt;
		this.sbbm = sbbm;
		this.sbmc = sbmc;
		this.wztype = wztype;
		this.boxno = boxno;
		this.partno = partno;
		this.dz = dz;
		this.zz = zz;
		this.dhtj = dhtj;
		this.zcd = zcd;
		this.czcdj = czcdj;
	}

	/** default constructor */
	public EquSbdhArr() {
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
		if(equ==null) return;
		this.sbbm = equ.getSbBm();
		this.sbmc = equ.getSbMc();
		this.dw = equ.getDw();
		this.sccj = equ.getSccj();
		this.ggxh = equ.getGgxh();
		this.sx = equ.getSx();	
		this.jzh = equ.getJzh();
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

	public Double getDhsl() {
		return dhsl;
	}

	public void setDhsl(Double dhsl) {
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

	public String getDhzt() {
		return dhzt;
	}

	public void setDhzt(String dhzt) {
		this.dhzt = dhzt;
	}

	public String getBoxno() {
		return boxno;
	}

	public void setBoxno(String boxno) {
		this.boxno = boxno;
	}

	public String getPartno() {
		return partno;
	}

	public void setPartno(String partno) {
		this.partno = partno;
	}

	public String getDz() {
		return dz;
	}

	public void setDz(String dz) {
		this.dz = dz;
	}

	public String getZz() {
		return zz;
	}

	public void setZz(String zz) {
		this.zz = zz;
	}

	public String getDhtj() {
		return dhtj;
	}

	public void setDhtj(String dhtj) {
		this.dhtj = dhtj;
	}

	public String getZcd() {
		return zcd;
	}

	public void setZcd(String zcd) {
		this.zcd = zcd;
	}

	public String getCzcdj() {
		return czcdj;
	}

	public void setCzcdj(String czcdj) {
		this.czcdj = czcdj;
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

	public String getSbbm() {
		return sbbm;
	}

	public String getSbmc() {
		return sbmc;
	}

	public String getWztype() {
		return wztype;
	}

	public void setJzh(String jzh) {
		this.jzh = jzh;
	}

	/** full constructor */

	// Property accessors

	
	

}