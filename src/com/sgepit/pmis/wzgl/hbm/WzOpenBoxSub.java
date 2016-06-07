package com.sgepit.pmis.wzgl.hbm;

import com.sgepit.pmis.equipment.dao.EquipmentDAO;
import com.sgepit.pmis.wzgl.dao.WZglDAO;

/**
 * EquOpenBoxSub entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class WzOpenBoxSub implements java.io.Serializable {

	// Fields

	private String uuid;
	private String openId;
	private String sbId;
	private String sbbm;
	private String sbbmc;
	private String ggxh;
	private Long sl;
	private Long yssl;
	private String dw;
	private String sccj;
	private String getgoodsDiff;
	private Long slDiff;
	private String outshow;
	private String process;
	private String pictureno;
	private Long opensl;
	private String jzh;
	private Long dz;
	private Long zz;
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

	public WzOpenBoxSub(String uuid, String openId, String sbId, String sbbm,
			String sbbmc, String ggxh, Long sl,Long yssl, String dw, String sccj,
			String getgoodsDiff, Long slDiff, String outshow, String process,
			String pictureno, Long opensl, String jzh, Long dz, Long zz,
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
	public WzOpenBoxSub() {
	}

	/** minimal constructor */
	public WzOpenBoxSub(String openId, String sbId) {
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
		WZglDAO wzglDAO = WZglDAO.getFromApplicationContext(com.sgepit.frame.base.Constant.wact);		
		WzList equ = (WzList) wzglDAO.findById("com.sgepit.pmis.equipment.hbm.WzList",sbId);
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

	public Long getSl() {
		return sl;
	}

	public void setSl(Long sl) {
		this.sl = sl;
	}

	public Long getYssl() {
		return yssl;
	}

	public void setYssl(Long yssl) {
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

	public Long getOpensl() {
		return opensl;
	}

	public void setOpensl(Long opensl) {
		this.opensl = opensl;
	}

	public Long getDz() {
		return dz;
	}

	public void setDz(Long dz) {
		this.dz = dz;
	}

	public Long getZz() {
		return zz;
	}

	public void setZz(Long zz) {
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