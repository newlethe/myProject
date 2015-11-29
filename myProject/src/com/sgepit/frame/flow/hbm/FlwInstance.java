package com.sgepit.frame.flow.hbm;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;


public class FlwInstance
    implements Serializable
{
    public FlwInstance()
    {
        flwLogs = new HashSet(0);
    }

    public FlwInstance(String insid, FlwDefinition flwDefinition, String status)
    {
        flwLogs = new HashSet(0);
        this.insid = insid;
        this.flwDefinition = flwDefinition;
        this.status = status;
    }

    public FlwInstance(String insid, FlwDefinition flwDefinition, String status, String params, String worklog, String title, String flowno, 
            String unit, String spec, String isyp, Set flwLogs)
    {
        this.flwLogs = new HashSet(0);
        this.insid = insid;
        this.flwDefinition = flwDefinition;
        this.status = status;
        this.params = params;
        this.worklog = worklog;
        this.title = title;
        this.flowno = flowno;
        this.unit = unit;
        this.spec = spec;
        this.isyp = isyp;
        this.flwLogs = flwLogs;
    }

    public String getInsid()
    {
        return insid;
    }

    public void setInsid(String insid)
    {
        this.insid = insid;
    }

    public FlwDefinition getFlwDefinition()
    {
        return flwDefinition;
    }

    public void setFlwDefinition(FlwDefinition flwDefinition)
    {
        this.flwDefinition = flwDefinition;
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

    public Set getFlwLogs1()
    {
    	//FlwLog flwLog = new FlwLog();
    	System.out.println("!!!!!!!!!!!");
    	//flwLogs.add(flwLog);
        return flwLogs;
    }

    public void setFlwLogs(Set flwLogs)
    {
        this.flwLogs = flwLogs;
    }

    public String getFlowno()
    {
        return flowno;
    }

    public void setFlowno(String flowno)
    {
        this.flowno = flowno;
    }

    public String getUnit()
    {
        return unit;
    }

    public void setUnit(String unit)
    {
        this.unit = unit;
    }

    public String getSpec()
    {
        return spec;
    }

    public void setSpec(String spec)
    {
        this.spec = spec;
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
	public String getIsyp() {
		return isyp;
	}

	public void setIsyp(String isyp) {
		this.isyp = isyp;
	}
	
	private String insid;
	private FlwDefinition flwDefinition;
	private String status;
	private String params;
	private String worklog;
	private String title;
	private String flowno;
	private String unit;
	private String spec;
	private String xmbh;
	private String fileid;
	private String filename;
	private String isyp;
	private Date filedate;
	private Set flwLogs;
}
