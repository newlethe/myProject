package com.sgepit.pmis.finalAccounts.complete.hbm;

public class FaInventoryAssetsView {
	// Fields
    private String uids;
	private String pid;
	private String stockNo;
	private String equPartName;
	private String ggxh;
	private String unit;
	private String graphNo;
	private String storage;
	private Double stockNum;
	private Double kcMoney;
	private String conid;
	private String datetype;
	
	/** default constructor */
	public FaInventoryAssetsView() {
	}

	/** full constructor */
	public FaInventoryAssetsView(String pid, String stockNo,
			String equPartName, String ggxh, String unit, String graphNo,
			String storage, Double stockNum, Double kcMoney, String conid,
			String datetype,String uids) {
		this.pid = pid;
		this.stockNo = stockNo;
		this.equPartName = equPartName;
		this.ggxh = ggxh;
		this.unit = unit;
		this.graphNo = graphNo;
		this.storage = storage;
		this.stockNum = stockNum;
		this.kcMoney = kcMoney;
		this.conid = conid;
		this.datetype = datetype;
		this.uids = uids;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getStockNo() {
		return stockNo;
	}

	public void setStockNo(String stockNo) {
		this.stockNo = stockNo;
	}

	public String getEquPartName() {
		return equPartName;
	}

	public void setEquPartName(String equPartName) {
		this.equPartName = equPartName;
	}

	public String getGgxh() {
		return ggxh;
	}

	public void setGgxh(String ggxh) {
		this.ggxh = ggxh;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public String getGraphNo() {
		return graphNo;
	}

	public void setGraphNo(String graphNo) {
		this.graphNo = graphNo;
	}

	public String getStorage() {
		return storage;
	}

	public void setStorage(String storage) {
		this.storage = storage;
	}

	public Double getStockNum() {
		return stockNum;
	}

	public void setStockNum(Double stockNum) {
		this.stockNum = stockNum;
	}

	public Double getKcMoney() {
		return kcMoney;
	}

	public void setKcMoney(Double kcMoney) {
		this.kcMoney = kcMoney;
	}

	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}

	public String getDatetype() {
		return datetype;
	}

	public void setDatetype(String datetype) {
		this.datetype = datetype;
	}

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

}
