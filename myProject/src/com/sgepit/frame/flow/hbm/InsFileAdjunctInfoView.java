package com.sgepit.frame.flow.hbm;

import java.io.Serializable;
import java.util.Date;

public class InsFileAdjunctInfoView
    implements Serializable
{

    public InsFileAdjunctInfoView()
    {
    }

    public InsFileAdjunctInfoView(String fileid, String insid,String flowno, String filetype, String nodeid, String userid, String ismove, String worklog, String filename, 
            Date filedate)
    {
        this.fileid = fileid;
        this.insid = insid;
        this.flowno = flowno;
        this.filetype = filetype;
        this.nodeid = nodeid;
        this.userid = userid;
        this.ismove = ismove;
        this.worklog = worklog;
        this.filename = filename;
        this.filedate = filedate;
    }

    public String getFileid()
    {
        return fileid;
    }

    public void setFileid(String fileid)
    {
        this.fileid = fileid;
    }

    public String getInsid()
    {
        return insid;
    }

    public void setInsid(String insid)
    {
        this.insid = insid;
    }

    public String getNodeid()
    {
        return nodeid;
    }

    public void setNodeid(String nodeid)
    {
        this.nodeid = nodeid;
    }

    public String getUserid()
    {
        return userid;
    }

    public void setUserid(String userid)
    {
        this.userid = userid;
    }

    public String getWorklog()
    {
        return worklog;
    }

    public void setWorklog(String worklog)
    {
        this.worklog = worklog;
    }

    public String getFilename()
    {
        return filename;
    }

    public void setFilename(String filename)
    {
        this.filename = filename;
    }

    public String getIsmove()
    {
        return ismove;
    }

    public void setIsmove(String ismove)
    {
        this.ismove = ismove;
    }

    public Date getFiledate()
    {
        return filedate;
    }

    public void setFiledate(Date filedate)
    {
        this.filedate = filedate;
    }

    public String getFiletype() {
    	return filetype;
    }
    
    public void setFiletype(String filetype) {
    	this.filetype = filetype;
    }

    public String getFlowno() {
    	return flowno;
    }
    
    public void setFlowno(String flowno) {
    	this.flowno = flowno;
    }

    public String getTitle() {
    	return title;
    }
    
    public void setTitle(String title) {
    	this.title = title;
    }

    public String getStatus() {
    	return status;
    }
    
    public void setStatus(String status) {
    	this.status = status;
    }
    private String fromnode;
    private String ftype;
    private String status;
    private String fileid;
    private String insid;
    private String title;
    private String flowno;
    private String filetype;
    private String nodeid;
    private String userid;
    private String ismove;
    private String worklog;
    private String filename;
    private Date filedate;
	public String getFromnode() {
		return fromnode;
	}

	public void setFromnode(String fromnode) {
		this.fromnode = fromnode;
	}

	public String getFtype() {
		return ftype;
	}

	public void setFtype(String ftype) {
		this.ftype = ftype;
	}
}
