package com.sgepit.pmis.gczl.hbm;

import java.util.Date;

public class GczlJyDetailView {

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
	
	private Double sumJyp; // 检验批累计
	private Double sumFxPrj; // 分项工程累计
	private Double sumZfbPrj; // 子分布工程累计
	private Double sumFbPrj; // 分布工程累计
	private Double sumZdwPrj; // 子单位工程累计
	private String xmmc; 	// 项目名称
	

	public Double getSumJyp() {
		return sumJyp;
	}

	public void setSumJyp(Double sumJyp) {
		this.sumJyp = sumJyp;
	}

	public Double getSumFxPrj() {
		return sumFxPrj;
	}

	public void setSumFxPrj(Double sumFxPrj) {
		this.sumFxPrj = sumFxPrj;
	}

	public Double getSumZfbPrj() {
		return sumZfbPrj;
	}

	public void setSumZfbPrj(Double sumZfbPrj) {
		this.sumZfbPrj = sumZfbPrj;
	}

	public Double getSumFbPrj() {
		return sumFbPrj;
	}

	public void setSumFbPrj(Double sumFbPrj) {
		this.sumFbPrj = sumFbPrj;
	}

	public Double getSumZdwPrj() {
		return sumZdwPrj;
	}

	public void setSumZdwPrj(Double sumZdwPrj) {
		this.sumZdwPrj = sumZdwPrj;
	}

	public String getXmmc() {
		return xmmc;
	}

	public void setXmmc(String xmmc) {
		this.xmmc = xmmc;
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
