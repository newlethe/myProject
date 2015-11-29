package com.sgepit.pcmis.warn.hbm;

import java.util.Date;


/**
 * PcWarnDowithInfo entity. @author MyEclipse Persistence Tools
 */

public class PcWarnDowithInfo  implements java.io.Serializable {


    // Fields    

     private String uids;
     private String pid;
     private String warninfoid;
     private Date dowithtime;
     private String comments;
     private String dowithperson;
     private String dowithunits;
     private String dowithtype;
     private String senduserid;
     private Date sendtime;
     private String guidecomments;//指导人意见

    // Constructors
	public PcWarnDowithInfo(String uids, String pid, String warninfoid,
			Date dowithtime, String comments, String dowithperson,
			String dowithunits, String dowithtype, String senduserid,
			Date sendtime, String guidecomments) {
		super();
		this.uids = uids;
		this.pid = pid;
		this.warninfoid = warninfoid;
		this.dowithtime = dowithtime;
		this.comments = comments;
		this.dowithperson = dowithperson;
		this.dowithunits = dowithunits;
		this.dowithtype = dowithtype;
		this.senduserid = senduserid;
		this.sendtime = sendtime;
		this.guidecomments = guidecomments;
	}

	public String getGuidecomments() {
		return guidecomments;
	}

	public void setGuidecomments(String guidecomments) {
		this.guidecomments = guidecomments;
	}

	public String getSenduserid() {
		return senduserid;
	}

	public void setSenduserid(String senduserid) {
		this.senduserid = senduserid;
	}

	public Date getSendtime() {
		return sendtime;
	}

	public void setSendtime(Date sendtime) {
		this.sendtime = sendtime;
	}

	/** default constructor */
    public PcWarnDowithInfo() {
    }

	/** minimal constructor */
    public PcWarnDowithInfo(String pid, String warninfoid) {
        this.pid = pid;
        this.warninfoid = warninfoid;
    }
    
    /** full constructor */

   
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

    public String getWarninfoid() {
        return this.warninfoid;
    }
    
    public void setWarninfoid(String warninfoid) {
        this.warninfoid = warninfoid;
    }

    public Date getDowithtime() {
        return this.dowithtime;
    }
    
    public void setDowithtime(Date dowithtime) {
        this.dowithtime = dowithtime;
    }

    public String getComments() {
        return this.comments;
    }
    
    public void setComments(String comments) {
        this.comments = comments;
    }

    public String getDowithperson() {
        return this.dowithperson;
    }
    
    public void setDowithperson(String dowithperson) {
        this.dowithperson = dowithperson;
    }

    public String getDowithunits() {
        return this.dowithunits;
    }
    
    public void setDowithunits(String dowithunits) {
        this.dowithunits = dowithunits;
    }

	public String getDowithtype() {
		return dowithtype;
	}

	public void setDowithtype(String dowithtype) {
		this.dowithtype = dowithtype;
	}
}