package com.sgepit.pcmis.aqgk.hbm;
// default package

import java.util.Date;


/**
 * PC_AQGK_HIDDENDANGER entity. @author MyEclipse Persistence Tools
 */

public class PcAqgkHiddenDangerInfo {


    // Fields    

     private String uids;
     private String pid;
     private String batUids;
     private String yhbh;
     private String yhnr;
     private Date gxsj;
     private Long state;
     private Date overDate;
     private String memo;
     private String feedBack;


    // Constructors

    /** default constructor */
    public PcAqgkHiddenDangerInfo() {
    }

	/** minimal constructor */
    public PcAqgkHiddenDangerInfo(String pid) {
        this.pid = pid;
    }
    
    /** full constructor */
    public PcAqgkHiddenDangerInfo(String pid, String batUids, String yhbh, 
    							String yhnr, Date gxsj, Long state, Date overDate, String memo, String feedBack) 
    {
        this.pid = pid;
        this.batUids = batUids;
        this.yhbh = yhbh;
        this.yhnr = yhnr;
        this.gxsj = gxsj;
        this.state = state;
        this.overDate = overDate;
        this.memo = memo;
        this.feedBack = feedBack;
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

    public String getBatUids() {
        return this.batUids;
    }
    
    public void setBatUids(String batUids) {
        this.batUids = batUids;
    }

    public String getYhbh() {
        return this.yhbh;
    }
    
    public void setYhbh(String yhbh) {
        this.yhbh = yhbh;
    }

    public String getYhnr() {
        return this.yhnr;
    }
    
    public void setYhnr(String yhnr) {
        this.yhnr = yhnr;
    }

    public Date getGxsj() {
        return this.gxsj;
    }
    
    public void setGxsj(Date gxsj) {
        this.gxsj = gxsj;
    }

    public Long getState() {
        return this.state;
    }
    
    public void setState(Long state) {
        this.state = state;
    }

    public Date getOverDate() {
        return this.overDate;
    }
    
    public void setOverDate(Date overDate) {
        this.overDate = overDate;
    }

    public String getMemo() {
        return this.memo;
    }
    
    public void setMemo(String memo) {
        this.memo = memo;
    }

	public String getFeedBack() {
		return feedBack;
	}

	public void setFeedBack(String feedBack) {
		this.feedBack = feedBack;
	}
   








}