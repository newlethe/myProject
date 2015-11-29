package com.sgepit.frame.flow.hbm;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

public class FlwInstanceView
    implements Serializable
{

    public FlwInstanceView()
    {
    }

    public FlwInstanceView(String insid, String flowid, String status)
    {
        this.insid = insid;
        this.flowid = flowid;
        this.status = status;
    }

    public FlwInstanceView(String insid, String flowid, String status, String params, String worklog, String title, Set flwLogs)
    {
        this.insid = insid;
        this.flowid = flowid;
        this.status = status;
        this.params = params;
        this.worklog = worklog;
        this.title = title;
    }

    public String getInsid()
    {
        return insid;
    }

    public void setInsid(String insid)
    {
        this.insid = insid;
    }

    public String getFlowid()
    {
        return flowid;
    }

    public void setFlowid(String flowid)
    {
        this.flowid = flowid;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public String getParams()
    {
        return params;
    }

    public void setParams(String params)
    {
        this.params = params;
    }

    public String getWorklog()
    {
        return worklog;
    }

    public void setWorklog(String worklog)
    {
        this.worklog = worklog;
    }

    public String getTitle()
    {
        return title;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    private String insid;
    private String flowid;
    private String status;
    private String params;
    private String worklog;
    private String title;
    
    private String isyp;
    private String xmbh;
    private String fileid;
    private String filename;
    private Date filedate;
	public String getIsyp() {
		return isyp;
	}

	public void setIsyp(String isyp) {
		this.isyp = isyp;
	}

	public String getXmbh() {
		return xmbh;
	}

	public void setXmbh(String xmbh) {
		this.xmbh = xmbh;
	}

	public String getFileid() {
		return fileid;
	}

	public void setFileid(String fileid) {
		this.fileid = fileid;
	}

	public String getFilename() {
		return filename;
	}

	public void setFilename(String filename) {
		this.filename = filename;
	}

	public Date getFiledate() {
		return filedate;
	}

	public void setFiledate(Date filedate) {
		this.filedate = filedate;
	}
}
