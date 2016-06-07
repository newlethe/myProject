package com.sgepit.pmis.finalAccounts.bdgStructure.hbm;

public class FABdgInfo {
	
	private String bdgid;
	private String pid;
	private String bdgno;
	private String bdgname;
	private String gcType;
	private String buildbdg;
	private String equipbdg;
	private String installbdg;
	private String otherbdg;
	private Boolean isLeaf;
	private String parent;
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
	
	
	
	
	public String getBdgid() {
		return bdgid;
	}
	public void setBdgid(String bdgid) {
		this.bdgid = bdgid;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
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
	public Boolean getIsLeaf() {
		return isLeaf;
	}
	public void setIsLeaf(Boolean isLeaf) {
		this.isLeaf = isLeaf;
	}
	public String getParent() {
		return parent;
	}
	public void setParent(String parent) {
		this.parent = parent;
	}
	public String getCorrespondbdg() {
		return correspondbdg;
	}
	public void setCorrespondbdg(String correspondbdg) {
		this.correspondbdg = correspondbdg;
	}
	public Double getBuildmoney() {
		return buildmoney;
	}
	public void setBuildmoney(Double buildmoney) {
		this.buildmoney = buildmoney;
	}
	public Double getEquipmoney() {
		return equipmoney;
	}
	public void setEquipmoney(Double equipmoney) {
		this.equipmoney = equipmoney;
	}
	public Double getInstallmoney() {
		return installmoney;
	}
	public void setInstallmoney(Double installmoney) {
		this.installmoney = installmoney;
	}
	public Double getOthermoney() {
		return othermoney;
	}
	public void setOthermoney(Double othermoney) {
		this.othermoney = othermoney;
	}
	public String getBuildname() {
		return buildname;
	}
	public void setBuildname(String buildname) {
		this.buildname = buildname;
	}
	public String getEquipname() {
		return equipname;
	}
	public void setEquipname(String equipname) {
		this.equipname = equipname;
	}
	public String getInstallname() {
		return installname;
	}
	public void setInstallname(String installname) {
		this.installname = installname;
	}
	public String getOthername() {
		return othername;
	}
	public void setOthername(String othername) {
		this.othername = othername;
	}
	public String getBuildno() {
		return buildno;
	}
	public void setBuildno(String buildno) {
		this.buildno = buildno;
	}
	public String getEquipno() {
		return equipno;
	}
	public void setEquipno(String equipno) {
		this.equipno = equipno;
	}
	public String getInstallno() {
		return installno;
	}
	public void setInstallno(String installno) {
		this.installno = installno;
	}
	public String getOtherno() {
		return otherno;
	}
	public void setOtherno(String otherno) {
		this.otherno = otherno;
	}
	
}