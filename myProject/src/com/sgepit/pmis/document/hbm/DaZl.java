package com.sgepit.pmis.document.hbm;

import java.util.Date;

/**
 * DaZl entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class DaZl implements java.io.Serializable {

	// Fields

	private String daid;//,uuid
	private String pid;//项目别
	private String indexid;//过滤条件
	private String mc;//案卷题名
	private Date gdrq;//归档日期
	private String dagh;//档案馆号
	private String swh;//缩微号
	private String bzdw;//编制单位
	private String bgqx;//保管期限
	private String mj;//密级
	private String bzrq;//编制日期
	private Long sl;//数量
	private String ztc;//主题词
	private String flmc;//分类名称
	private Long bfjs;//每份件数
	private Long bfys;//每份页数
	private String kwh;//库位号
	private String bz;//备注
	private String jnsm;//卷内说明
	private String ljr;//立卷人
	private Date ljrq;//立卷日期
	private String jcr;//检查人
	private Date jcrq;//检查日期
	private Long daState;//档案状态
	private String dabh;//档案号
	private String hjh;//互见号
	private String dh;//档号
    private String orgid;//部门id
    private String zy;//专业
    private Long wbxs;//文本形式
    private String filelsh;//
    private String filename;//
    private String jcjsh;//卷册检索号
    private String zys;//总页数
    private Long kcfs; //库存份数
    private String bjhd;//背脊厚度
	// Constructors

	/**
	 * @return the dh
	 */
	public String getDh() {
		return dh;
	}

	/**
	 * @param dh the dh to set
	 */
	public void setDh(String dh) {
		this.dh = dh;
	}

	/** default constructor */
	public DaZl() {
	}

	/** minimal constructor */
	public DaZl(String pid) {
		this.pid = pid;
	}
    
	/** full constructor */
	public DaZl(String pid, String indexid, String mc, Date gdrq, String dagh,
			String swh, String bzdw, String bgqx, String mj, String bzrq,
			Long sl, String ztc, String flmc, Long bfjs, Long bfys, String kwh,
			String bz, String jnsm, String ljr, Date ljrq, String jcr,String bjhd,
			Date jcrq, Long daState, String dabh, String hjh,String dh,String orgid,
			String zy,Long wbxs,String filelsh,String filename,String jcjsh,String zys,Long kcfs) {
		this.pid = pid;
		this.indexid = indexid;
		this.mc = mc;
		this.gdrq = gdrq;
		this.dagh = dagh;
		this.swh = swh;
		this.bzdw = bzdw;
		this.bgqx = bgqx;
		this.mj = mj;
		this.bzrq = bzrq;
		this.sl = sl;
		this.ztc = ztc;
		this.flmc = flmc;
		this.bfjs = bfjs;
		this.bfys = bfys;
		this.kwh = kwh;
		this.bz = bz;
		this.jnsm = jnsm;
		this.ljr = ljr;
		this.ljrq = ljrq;
		this.jcr = jcr;
		this.jcrq = jcrq;
		this.daState = daState;
		this.dabh = dabh;
		this.hjh = hjh;
		this.dh=dh;
		this.orgid=orgid;
		this.zy=zy;
		this.wbxs=wbxs;
		this.filelsh=filelsh;
		this.filename=filename;
		this.jcjsh=jcjsh;
		this.zys=zys;
		this.kcfs = kcfs;
		this.bjhd = bjhd;
	}

	// Property accessors
	
   
	public String getDaid() {
		return this.daid;
	}

	public void setDaid(String daid) {
		this.daid = daid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getIndexid() {
		return this.indexid;
	}

	public void setIndexid(String indexid) {
		this.indexid = indexid;
	}

	public String getMc() {
		return this.mc;
	}

	public void setMc(String mc) {
		this.mc = mc;
	}

	public Date getGdrq() {
		return this.gdrq;
	}

	public void setGdrq(Date gdrq) {
		this.gdrq = gdrq;
	}

	public String getDagh() {
		return this.dagh;
	}

	public void setDagh(String dagh) {
		this.dagh = dagh;
	}

	public String getSwh() {
		return this.swh;
	}

	public void setSwh(String swh) {
		this.swh = swh;
	}

	public String getBzdw() {
		return this.bzdw;
	}

	public void setBzdw(String bzdw) {
		this.bzdw = bzdw;
	}

	public String getBgqx() {
		return this.bgqx;
	}

	public void setBgqx(String bgqx) {
		this.bgqx = bgqx;
	}

	public String getMj() {
		return this.mj;
	}

	public void setMj(String mj) {
		this.mj = mj;
	}

	public String getBzrq() {
		return this.bzrq;
	}

	public void setBzrq(String bzrq) {
		this.bzrq = bzrq;
	}

	public Long getSl() {
		return this.sl;
	}

	public void setSl(Long sl) {
		this.sl = sl;
	}

	public String getZtc() {
		return this.ztc;
	}

	public void setZtc(String ztc) {
		this.ztc = ztc;
	}

	public String getFlmc() {
		return this.flmc;
	}

	public void setFlmc(String flmc) {
		this.flmc = flmc;
	}

	public Long getBfjs() {
		return this.bfjs;
	}

	public void setBfjs(Long bfjs) {
		this.bfjs = bfjs;
	}

	public Long getBfys() {
		return this.bfys;
	}

	public void setBfys(Long bfys) {
		this.bfys = bfys;
	}

	public String getKwh() {
		return this.kwh;
	}

	public void setKwh(String kwh) {
		this.kwh = kwh;
	}

	public String getBz() {
		return this.bz;
	}

	public void setBz(String bz) {
		this.bz = bz;
	}

	public String getJnsm() {
		return this.jnsm;
	}

	public void setJnsm(String jnsm) {
		this.jnsm = jnsm;
	}

	public String getLjr() {
		return this.ljr;
	}

	public void setLjr(String ljr) {
		this.ljr = ljr;
	}

	public Date getLjrq() {
		return this.ljrq;
	}

	public void setLjrq(Date ljrq) {
		this.ljrq = ljrq;
	}

	public String getJcr() {
		return this.jcr;
	}

	public void setJcr(String jcr) {
		this.jcr = jcr;
	}

	public Date getJcrq() {
		return this.jcrq;
	}

	public void setJcrq(Date jcrq) {
		this.jcrq = jcrq;
	}

	public Long getDaState() {
		return this.daState;
	}

	public void setDaState(Long daState) {
		this.daState = daState;
	}

	public String getDabh() {
		return this.dabh;
	}

	public void setDabh(String dabh) {
		this.dabh = dabh;
	}

	public String getHjh() {
		return this.hjh;
	}

	public void setHjh(String hjh) {
		this.hjh = hjh;
	}

	/**
	 * @return the orgid
	 */
	public String getOrgid() {
		return orgid;
	}

	/**
	 * @param orgid the orgid to set
	 */
	public void setOrgid(String orgid) {
		this.orgid = orgid;
	}

	/**
	 * @return the zy
	 */
	public String getZy() {
		return zy;
	}

	/**
	 * @param zy the zy to set
	 */
	public void setZy(String zy) {
		this.zy = zy;
	}

	/**
	 * @return the wbxs
	 */
	public Long getWbxs() {
		return wbxs;
	}

	/**
	 * @param wbxs the wbxs to set
	 */
	public void setWbxs(Long wbxs) {
		this.wbxs = wbxs;
	}

	/**
	 * @return the filelsh
	 */
	public String getFilelsh() {
		return filelsh;
	}

	/**
	 * @param filelsh the filelsh to set
	 */
	public void setFilelsh(String filelsh) {
		this.filelsh = filelsh;
	}

	/**
	 * @return the filename
	 */
	public String getFilename() {
		return filename;
	}

	/**
	 * @param filename the filename to set
	 */
	public void setFilename(String filename) {
		this.filename = filename;
	}

	/**
	 * @return the jcjsh
	 */
	public String getJcjsh() {
		return jcjsh;
	}

	/**
	 * @param jcjsh the jcjsh to set
	 */
	public void setJcjsh(String jcjsh) {
		this.jcjsh = jcjsh;
	}

	public String getZys() {
		return zys;
	}

	public void setZys(String zys) {
		this.zys = zys;
	}

	public Long getKcfs() {
		return kcfs;
	}

	public void setKcfs(Long kcfs) {
		this.kcfs = kcfs;
	}

	public String getBjhd() {
		return bjhd;
	}

	public void setBjhd(String bjhd) {
		this.bjhd = bjhd;
	}
    
}