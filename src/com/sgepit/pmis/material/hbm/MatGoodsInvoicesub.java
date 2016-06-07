package com.sgepit.pmis.material.hbm;

/**
 * MatGoodsInvoicesub entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class MatGoodsInvoicesub implements java.io.Serializable {

	// Fields

	private String uuid;
	private String sequ;
	private String storeInId;
	private String matId;
	private String catNo;
	private String catName;
	private String spec;
	private Double price;
	private String unit;
	private Double buyFare;
	private Double appFare;
	private Double sum;
	private String fatory;
	private String invoiceId;

	// Constructors

	/** default constructor */
	public MatGoodsInvoicesub() {
	}

	/** full constructor */
	public MatGoodsInvoicesub(String sequ, String storeInId, String matId,
			String catNo, String catName, String spec, Double price,
			String unit, Double buyFare, Double appFare, Double sum,
			String fatory, String invoiceId) {
		this.sequ = sequ;
		this.storeInId = storeInId;
		this.matId = matId;
		this.catNo = catNo;
		this.catName = catName;
		this.spec = spec;
		this.price = price;
		this.unit = unit;
		this.buyFare = buyFare;
		this.appFare = appFare;
		this.sum = sum;
		this.fatory = fatory;
		this.invoiceId = invoiceId;
	}

	// Property accessors

	public String getUuid() {
		return this.uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getSequ() {
		return this.sequ;
	}

	public void setSequ(String sequ) {
		this.sequ = sequ;
	}

	public String getStoreInId() {
		return this.storeInId;
	}

	public void setStoreInId(String storeInId) {
		this.storeInId = storeInId;
	}

	public String getMatId() {
		return this.matId;
	}

	public void setMatId(String matId) {
		this.matId = matId;
	}

	public String getCatNo() {
		return this.catNo;
	}

	public void setCatNo(String catNo) {
		this.catNo = catNo;
	}

	public String getCatName() {
		return this.catName;
	}

	public void setCatName(String catName) {
		this.catName = catName;
	}

	public String getSpec() {
		return this.spec;
	}

	public void setSpec(String spec) {
		this.spec = spec;
	}

	public Double getPrice() {
		return this.price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public String getUnit() {
		return this.unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public Double getBuyFare() {
		return this.buyFare;
	}

	public void setBuyFare(Double buyFare) {
		this.buyFare = buyFare;
	}

	public Double getAppFare() {
		return this.appFare;
	}

	public void setAppFare(Double appFare) {
		this.appFare = appFare;
	}

	public Double getSum() {
		return this.sum;
	}

	public void setSum(Double sum) {
		this.sum = sum;
	}

	public String getFatory() {
		return this.fatory;
	}

	public void setFatory(String fatory) {
		this.fatory = fatory;
	}

	public String getInvoiceId() {
		return this.invoiceId;
	}

	public void setInvoiceId(String invoiceId) {
		this.invoiceId = invoiceId;
	}

}