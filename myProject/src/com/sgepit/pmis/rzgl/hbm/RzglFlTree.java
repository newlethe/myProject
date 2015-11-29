package com.sgepit.pmis.rzgl.hbm;

import java.math.BigDecimal;
import java.util.Date;

/**
 * RzglFlTree entity. @author MyEclipse Persistence Tools
 */
public class RzglFlTree implements java.io.Serializable {


    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	// Fields    

     private String uids;
     private String flName;
     private String flCode;
     private String parrentUids;
     private String createUser;
     private String createDept;
     private Date createDate;
     private String remo;
     private String col1;
     private String col2;
     private BigDecimal orderNum;


    // Constructors

    /** default constructor */
    public RzglFlTree() {
    }

	/** minimal constructor */
    public RzglFlTree(String uids) {
        this.uids = uids;
    }
    
    /** full constructor */
    public RzglFlTree(String uids, String flName, String flCode, String parrentUids, String createUser, String createDept, Date createDate, String remo, String col1, String col2,BigDecimal orderNum) {
        this.uids = uids;
        this.flName = flName;
        this.flCode = flCode;
        this.parrentUids = parrentUids;
        this.createUser = createUser;
        this.createDept = createDept;
        this.createDate = createDate;
        this.remo = remo;
        this.col1 = col1;
        this.col2 = col2;
        this.orderNum = orderNum;
    }

   
    // Property accessors

    public String getUids() {
        return this.uids;
    }
    
    public void setUids(String uids) {
        this.uids = uids;
    }
    

    public String getFlName() {
        return this.flName;
    }
    
    public void setFlName(String flName) {
        this.flName = flName;
    }
    

    public String getFlCode() {
        return this.flCode;
    }
    
    public void setFlCode(String flCode) {
        this.flCode = flCode;
    }
    

    public String getParrentUids() {
        return this.parrentUids;
    }
    
    public void setParrentUids(String parrentUids) {
        this.parrentUids = parrentUids;
    }
    

    public String getCreateUser() {
        return this.createUser;
    }
    
    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }
    

    public String getCreateDept() {
        return this.createDept;
    }
    
    public void setCreateDept(String createDept) {
        this.createDept = createDept;
    }
    

    

    public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getRemo() {
        return this.remo;
    }
    
    public void setRemo(String remo) {
        this.remo = remo;
    }
    

    public String getCol1() {
        return this.col1;
    }
    
    public void setCol1(String col1) {
        this.col1 = col1;
    }
    

    public String getCol2() {
        return this.col2;
    }
    
    public void setCol2(String col2) {
        this.col2 = col2;
    }

	public BigDecimal getOrderNum() {
		return orderNum;
	}

	public void setOrderNum(BigDecimal orderNum) {
		this.orderNum = orderNum;
	}
   
    

}