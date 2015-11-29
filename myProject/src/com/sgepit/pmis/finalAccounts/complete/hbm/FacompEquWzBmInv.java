package com.sgepit.pmis.finalAccounts.complete.hbm;

public class FacompEquWzBmInv {
	
    private String uids;
    private String pid;
    private String assetsNo;
    private String assetsName;
    private String stockNo;
    private String assetsFl;
    private String ggxh;
    private String storage;
    private String unit;
    private Double stockNum;
    private Double kcMoney;
    private String remark;
    private String kcUids;
    private String datetype;
    private String conid;
    
    public FacompEquWzBmInv() {
    }

	/** minimal constructor */
    public FacompEquWzBmInv(String uids) {
        this.uids = uids;
    }
    
    /** full constructor */
    public FacompEquWzBmInv(String uids, String assetsNo, String assetsName, 
    		String stockNo, String assetsFl, String ggxh, String storage, 
    		String unit, Double stockNum, Double kcMoney, String remark,
    		String pid,String kcUids,String datetype,String conid) {
        this.uids = uids;
        this.assetsNo = assetsNo;
        this.assetsName = assetsName;
        this.stockNo = stockNo;
        this.assetsFl = assetsFl;
        this.ggxh = ggxh;
        this.storage = storage;
        this.unit = unit;
        this.stockNum = stockNum;
        this.kcMoney = kcMoney;
        this.remark = remark;
        this.pid = pid;
        this.kcUids = kcUids;
        this.datetype = datetype;
        this.conid = conid;
    }

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getAssetsNo() {
		return assetsNo;
	}

	public void setAssetsNo(String assetsNo) {
		this.assetsNo = assetsNo;
	}

	public String getAssetsName() {
		return assetsName;
	}

	public void setAssetsName(String assetsName) {
		this.assetsName = assetsName;
	}

	public String getStockNo() {
		return stockNo;
	}

	public void setStockNo(String stockNo) {
		this.stockNo = stockNo;
	}

	public String getAssetsFl() {
		return assetsFl;
	}

	public void setAssetsFl(String assetsFl) {
		this.assetsFl = assetsFl;
	}

	public String getGgxh() {
		return ggxh;
	}

	public void setGgxh(String ggxh) {
		this.ggxh = ggxh;
	}

	public String getStorage() {
		return storage;
	}

	public void setStorage(String storage) {
		this.storage = storage;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
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

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getKcUids() {
		return kcUids;
	}

	public void setKcUids(String kcUids) {
		this.kcUids = kcUids;
	}

	public String getDatetype() {
		return datetype;
	}

	public void setDatetype(String datetype) {
		this.datetype = datetype;
	}

	public String getConid() {
		return conid;
	}

	public void setConid(String conid) {
		this.conid = conid;
	}
    
}
