package com.sgepit.pmis.gczl.hbm;

import java.util.Date;

public class GczlJyDetail {

	private String jyDetailId; // 主键
	private String jyStatId; // 对应的统计主表的主键
	private String jyxmBh; // 检验项目编号
	private String parentBh; // 父节点检验项目编号
	private Date jyDetailDate; // 统计日期（年月，根据主表自动生成）
	private Double jyp; // 检验批
	private Double fxPrj; // 分项工程
	private Double zfbPrj; // 子分布工程
	private Double fbPrj; // 分布工程
	private Double zdwPrj; // 子单位工程
	private String prjPd; // 工程评定
	
	public GczlJyDetail(){
		jyp = 0d;
		fxPrj = 0d;
		zfbPrj = 0d;
		fbPrj = 0d;
		zdwPrj = 0d;
	}

	public String getJyDetailId() {
		return jyDetailId;
	}

	public void setJyDetailId(String jyDetailId) {
		this.jyDetailId = jyDetailId;
	}

	public String getJyStatId() {
		return jyStatId;
	}

	public void setJyStatId(String jyStatId) {
		this.jyStatId = jyStatId;
	}

	public String getJyxmBh() {
		return jyxmBh;
	}

	public void setJyxmBh(String jyxmBh) {
		this.jyxmBh = jyxmBh;
	}

	public String getParentBh() {
		return parentBh;
	}

	public void setParentBh(String parentBh) {
		this.parentBh = parentBh;
	}

	public Date getJyDetailDate() {
		return jyDetailDate;
	}

	public void setJyDetailDate(Date jyDetailDate) {
		this.jyDetailDate = jyDetailDate;
	}

	public Double getJyp() {
		return jyp;
	}

	public void setJyp(Double jyp) {
		this.jyp = jyp;
	}

	public Double getFxPrj() {
		return fxPrj;
	}

	public void setFxPrj(Double fxPrj) {
		this.fxPrj = fxPrj;
	}

	public Double getZfbPrj() {
		return zfbPrj;
	}

	public void setZfbPrj(Double zfbPrj) {
		this.zfbPrj = zfbPrj;
	}

	public Double getFbPrj() {
		return fbPrj;
	}

	public void setFbPrj(Double fbPrj) {
		this.fbPrj = fbPrj;
	}

	public Double getZdwPrj() {
		return zdwPrj;
	}

	public void setZdwPrj(Double zdwPrj) {
		this.zdwPrj = zdwPrj;
	}

	public String getPrjPd() {
		return prjPd;
	}

	public void setPrjPd(String prjPd) {
		this.prjPd = prjPd;
	}



}
