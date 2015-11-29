package com.sgepit.pmis.rlzj.hbm;



/**
 * HrAccountSet entity. @author MyEclipse Persistence Tools
 */

public class HrAccountSet  implements java.io.Serializable {


    // Fields    

     private String uids;
     private String code;
     private String name;
     private String items;
     private String formula;
     private String state;
     private String remark;
     private String deptid;
     private String pid;

    // Constructors

    /** default constructor */
    public HrAccountSet() {
    }

	/** minimal constructor */
    public HrAccountSet(String code, String name, String items, String state) {
        this.code = code;
        this.name = name;
        this.items = items;
        this.state = state;
    }
    
    /** full constructor */
    public HrAccountSet(String code, String name, String items, String formula, String state, String remark) {
        this.code = code;
        this.name = name;
        this.items = items;
        this.formula = formula;
        this.state = state;
        this.remark = remark;
    }

   
    // Property accessors

    public String getUids() {
        return this.uids;
    }
    
    public void setUids(String uids) {
        this.uids = uids;
    }

    public String getCode() {
        return this.code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return this.name;
    }
    
    public void setName(String name) {
        this.name = name;
    }

    public String getItems() {
        return this.items;
    }
    
    public void setItems(String items) {
        this.items = items;
    }

    public String getFormula() {
        return this.formula;
    }
    
    public void setFormula(String formula) {
        this.formula = formula;
    }

    public String getState() {
        return this.state;
    }
    
    public void setState(String state) {
        this.state = state;
    }

    public String getRemark() {
        return this.remark;
    }
    
    public void setRemark(String remark) {
        this.remark = remark;
    }

	public String getDeptid() {
		return deptid;
	}

	public void setDeptid(String deptid) {
		this.deptid = deptid;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}
   








}