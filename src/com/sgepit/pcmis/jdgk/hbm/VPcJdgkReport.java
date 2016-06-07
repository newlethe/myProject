package com.sgepit.pcmis.jdgk.hbm;

import java.util.Date;


/**
 * VPcJdgkReport1 entity. @author MyEclipse Persistence Tools
 */

public class VPcJdgkReport  implements java.io.Serializable {


    // Fields    

     private String uids;
     private String pid;
     private Date createdate;
     private String createperson;
     private String reportname;
     private String memo;
     private String state;
     private String projectId;
     private String billState;
     private String sjType;
     private String unitTypeId;
     private String unitname;
     private String reason;
     private String unitUsername;
 	 private String countUsername;
 	 private String createpersonTel;

     private String backUser;

    // Constructors

    /** default constructor */
    public VPcJdgkReport() {
    }

	/** minimal constructor */
    public VPcJdgkReport(String pid, String unitname) {
        this.pid = pid;
        this.unitname = unitname;
    }
    
    /** full constructor */
    public VPcJdgkReport(String pid, Date createdate, String createperson, 
    		String reportname,String memo, String state, String projectId, 
    		String billState, String sjType, String unitTypeId, String unitname, 
    		String reason,String unitUsername,String countUsername,String createpersonTel) {
        this.pid = pid;
        this.createdate = createdate;
        this.createperson = createperson;
        this.reportname = reportname;
        this.memo = memo;
        this.state = state;
        this.projectId = projectId;
        this.billState = billState;
        this.sjType = sjType;
        this.unitTypeId = unitTypeId;
        this.unitname = unitname;
        this.reason = reason;
        this.unitUsername=unitUsername;
        this.countUsername=countUsername;
        this.createpersonTel=createpersonTel;
    }

   
    // Property accessors

    public String getUids() {
        return this.uids;
    }
    
    public void setUids(String uids) {
        this.uids = uids;
    }

    public String getPid() {
        return this.pid;
    }
    
    public void setPid(String pid) {
        this.pid = pid;
    }

    public Date getCreatedate() {
        return this.createdate;
    }
    
    public void setCreatedate(Date createdate) {
        this.createdate = createdate;
    }

    public String getCreateperson() {
        return this.createperson;
    }
    
    public void setCreateperson(String createperson) {
        this.createperson = createperson;
    }

    public String getReportname() {
        return this.reportname;
    }
    
    public void setReportname(String reportname) {
        this.reportname = reportname;
    }

    public String getMemo() {
        return this.memo;
    }
    
    public void setMemo(String memo) {
        this.memo = memo;
    }

    public String getState() {
        return this.state;
    }
    
    public void setState(String state) {
        this.state = state;
    }

    public String getProjectId() {
        return this.projectId;
    }
    
    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getBillState() {
        return this.billState;
    }
    
    public void setBillState(String billState) {
        this.billState = billState;
    }

    public String getSjType() {
        return this.sjType;
    }
    
    public void setSjType(String sjType) {
        this.sjType = sjType;
    }

    public String getUnitTypeId() {
        return this.unitTypeId;
    }
    
    public void setUnitTypeId(String unitTypeId) {
        this.unitTypeId = unitTypeId;
    }

    public String getUnitname() {
        return this.unitname;
    }
    
    public void setUnitname(String unitname) {
        this.unitname = unitname;
    }

    public String getReason() {
        return this.reason;
    }
    
    public void setReason(String reason) {
        this.reason = reason;
    }

	public String getBackUser() {
		return backUser;
	}

	public void setBackUser(String backUser) {
		this.backUser = backUser;
	}

	public String getUnitUsername() {
		return unitUsername;
	}

	public void setUnitUsername(String unitUsername) {
		this.unitUsername = unitUsername;
	}

	public String getCountUsername() {
		return countUsername;
	}

	public void setCountUsername(String countUsername) {
		this.countUsername = countUsername;
	}

	public String getCreatepersonTel() {
		return createpersonTel;
	}

	public void setCreatepersonTel(String createpersonTel) {
		this.createpersonTel = createpersonTel;
	}
	
	
}