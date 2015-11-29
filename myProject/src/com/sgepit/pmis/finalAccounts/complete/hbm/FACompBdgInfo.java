package com.sgepit.pmis.finalAccounts.complete.hbm;
/**
 * 竣工决算概算表
 * @author pengy
 * @createtime 2013-06-27
 */
public class FACompBdgInfo {
	
	private String uids;
	private String pid;
	private String treeid;
	private String bdgno;
	private String bdgname;
	private String gcType;
	private String buildbdg;
	private String equipbdg;
	private String installbdg;
	private String otherbdg;
	private Long isleaf;
	private String parentid;
	private String correspondbdg;
	
	//extended
	//建筑
	private String buildno;
	private Double buildmoney;
	private String buildname;
	//设备
	private String equipno;
	private Double equipmoney;
	private String equipname;
	//安装
	private String installno;
	private Double installmoney;
	private String installname;
	//其它
	private String otherno;
	private Double othermoney;
	private String othername;
	
	
	public FACompBdgInfo() {
		super();
		// TODO Auto-generated constructor stub
	}

	public FACompBdgInfo(String uids, String pid, String treeid, String bdgno,
			String bdgname, String gcType, String buildbdg, String equipbdg,
			String installbdg, String otherbdg, Long isleaf, String parentid,
			String correspondbdg, String buildno, Double buildmoney,
			String buildname, String equipno, Double equipmoney,
			String equipname, String installno, Double installmoney,
			String installname, String otherno, Double othermoney,
			String othername) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.treeid = treeid;
		this.bdgno = bdgno;
		this.bdgname = bdgname;
		this.gcType = gcType;
		this.buildbdg = buildbdg;
		this.equipbdg = equipbdg;
		this.installbdg = installbdg;
		this.otherbdg = otherbdg;
		this.isleaf = isleaf;
		this.parentid = parentid;
		this.correspondbdg = correspondbdg;
		this.buildno = buildno;
		this.buildmoney = buildmoney;
		this.buildname = buildname;
		this.equipno = equipno;
		this.equipmoney = equipmoney;
		this.equipname = equipname;
		this.installno = installno;
		this.installmoney = installmoney;
		this.installname = installname;
		this.otherno = otherno;
		this.othermoney = othermoney;
		this.othername = othername;
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getTreeid() {
		return treeid;
	}

	public void setTreeid(String treeid) {
		this.treeid = treeid;
	}

	public String getBdgno() {
		return bdgno;
	}

	public void setBdgno(String bdgno) {
		this.bdgno = bdgno;
	}

	public String getBdgname() {
		return bdgname;
	}

	public void setBdgname(String bdgname) {
		this.bdgname = bdgname;
	}

	public String getGcType() {
		return gcType;
	}

	public void setGcType(String gcType) {
		this.gcType = gcType;
	}

	public String getBuildbdg() {
		return buildbdg;
	}

	public void setBuildbdg(String buildbdg) {
		this.buildbdg = buildbdg;
	}

	public String getEquipbdg() {
		return equipbdg;
	}

	public void setEquipbdg(String equipbdg) {
		this.equipbdg = equipbdg;
	}

	public String getInstallbdg() {
		return installbdg;
	}

	public void setInstallbdg(String installbdg) {
		this.installbdg = installbdg;
	}

	public String getOtherbdg() {
		return otherbdg;
	}

	public void setOtherbdg(String otherbdg) {
		this.otherbdg = otherbdg;
	}

	public Long getIsleaf() {
		return isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getParentid() {
		return parentid;
	}

	public void setParentid(String parentid) {
		this.parentid = parentid;
	}

	public String getCorrespondbdg() {
		return correspondbdg;
	}

	public void setCorrespondbdg(String correspondbdg) {
		this.correspondbdg = correspondbdg;
	}

	public String getBuildno() {
		return buildno;
	}

	public void setBuildno(String buildno) {
		this.buildno = buildno;
	}

	public Double getBuildmoney() {
		return buildmoney;
	}

	public void setBuildmoney(Double buildmoney) {
		this.buildmoney = buildmoney;
	}

	public String getBuildname() {
		return buildname;
	}

	public void setBuildname(String buildname) {
		this.buildname = buildname;
	}

	public String getEquipno() {
		return equipno;
	}

	public void setEquipno(String equipno) {
		this.equipno = equipno;
	}

	public Double getEquipmoney() {
		return equipmoney;
	}

	public void setEquipmoney(Double equipmoney) {
		this.equipmoney = equipmoney;
	}

	public String getEquipname() {
		return equipname;
	}

	public void setEquipname(String equipname) {
		this.equipname = equipname;
	}

	public String getInstallno() {
		return installno;
	}

	public void setInstallno(String installno) {
		this.installno = installno;
	}
	
	public Double getInstallmoney() {
		return installmoney;
	}

	public void setInstallmoney(Double installmoney) {
		this.installmoney = installmoney;
	}

	public String getInstallname() {
		return installname;
	}

	public void setInstallname(String installname) {
		this.installname = installname;
	}

	public String getOtherno() {
		return otherno;
	}

	public void setOtherno(String otherno) {
		this.otherno = otherno;
	}

	public Double getOthermoney() {
		return othermoney;
	}

	public void setOthermoney(Double othermoney) {
		this.othermoney = othermoney;
	}

	public String getOthername() {
		return othername;
	}

	public void setOthername(String othername) {
		this.othername = othername;
	}
	
}