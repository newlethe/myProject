package com.sgepit.pmis.equipment.hbm;

import com.sgepit.pmis.equipment.dao.EquipmentDAO;

/**
 * EquOpenBoxSub entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class EquOpenBoxSub implements java.io.Serializable {

	// Fields

	private String uuid;
	private String openId;
	private String sbId;
	private String sbbm;
	private String sbbmc;
	private String ggxh;
	private Double sl;
	private Double yssl;
	private String dw;
	private String sccj;
	private String getgoodsDiff;
	private Long slDiff;
	private String outshow;
	private String process;
	private String pictureno;
	private Double opensl;
	private String jzh;
	private Double dz;
	private Double zz;
	private String dhtj;
	private String zcd;
	private String czcdj;
	private String sx;
	private String pid;
	private String conid;
	// Constructors

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}
	
	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public EquOpenBoxSub(String uuid, String openId, String sbId, String sbbm,
			String sbbmc, String ggxh, Double sl,Double yssl, String dw, String sccj,
			String getgoodsDiff, Long slDiff, String outshow, String process,
			String pictureno, Double opensl, String jzh, Double dz, Double zz,
			String dhtj, String zcd, String czcdj, String sx) {
		super();
		this.uuid = uuid;
		this.openId = openId;
		this.sbId = sbId;
		this.sbbm = sbbm;
		this.sbbmc = sbbmc;
		this.ggxh = ggxh;
		this.sl = sl;
		this.yssl = yssl;
		this.dw = dw;
		this.sccj = sccj;
		this.getgoodsDiff = getgoodsDiff;
		this.slDiff = slDiff;
		this.outshow = outshow;
		this.process = process;
		this.pictureno = pictureno;
		this.opensl = opensl;
		this.jzh = jzh;
		this.dz = dz;
		this.zz = zz;
		this.dhtj = dhtj;
		this.zcd = zcd;
		this.czcdj = czcdj;
		this.sx = sx;
	}

	/** default constructor */
	public EquOpenBoxSub() {
	}

	/** minimal constructor */
	public EquOpenBoxSub(String openId, String sbId) {
		this.openId = openId;
		this.sbId = sbId;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getOpenId() {
		return openId;
	}

	public void setOpenId(String openId) {
		this.openId = openId;
	}

	public String getSbId() {
		return sbId;
	}

	public void setSbId(String sbId) {
		this.sbId = sbId;
		EquipmentDAO equDao = EquipmentDAO.getFromApplicationContext(com.sgepit.frame.base.Constant.wact);		
		EquList equ = (EquList) equDao.findById("com.sgepit.pmis.equipment.hbm.EquList",sbId);
		this.sbbm = equ.getSbBm();
		this.sbbmc = equ.getSbMc();
		this.dw = equ.getDw();
		this.sccj = equ.getSccj();
		this.ggxh = equ.getGgxh();
		this.sx = equ.getSx();	
		this.jzh = equ.getJzh();
	}

	public String getGgxh() {
		return ggxh;
	}

	public Double getSl() {
		return sl;
	}

	public void setSl(Double sl) {
		this.sl = sl;
	}

	public Double getYssl() {
		return yssl;
	}

	public void setYssl(Double yssl) {
		this.yssl = yssl;
	}

	public String getGetgoodsDiff() {
		return getgoodsDiff;
	}

	public void setGetgoodsDiff(String getgoodsDiff) {
		this.getgoodsDiff = getgoodsDiff;
	}

	public Long getSlDiff() {
		return slDiff;
	}

	public void setSlDiff(Long slDiff) {
		this.slDiff = slDiff;
	}

	public String getOutshow() {
		return outshow;
	}

	public void setOutshow(String outshow) {
		this.outshow = outshow;
	}

	public String getProcess() {
		return process;
	}

	public void setProcess(String process) {
		this.process = process;
	}

	public String getPictureno() {
		return pictureno;
	}

	public void setPictureno(String pictureno) {
		this.pictureno = pictureno;
	}

	public Double getOpensl() {
		return opensl;
	}

	public void setOpensl(Double opensl) {
		this.opensl = opensl;
	}

	public Double getDz() {
		return dz;
	}

	public void setDz(Double dz) {
		this.dz = dz;
	}

	public Double getZz() {
		return zz;
	}

	public void setZz(Double zz) {
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

	public String getSbbm() {
		return sbbm;
	}

	public String getSbbmc() {
		return sbbmc;
	}

	public String getDw() {
		return dw;
	}

	public String getSccj() {
		return sccj;
	}

	public String getJzh() {
		return jzh;
	}

	public String getSx() {
		return sx;
	}

	/** full constructor */

	// Property accessors

	

}