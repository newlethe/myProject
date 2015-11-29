package com.sgepit.frame.flow.hbm;

import java.io.Serializable;
import java.util.Date;

public class InsFileInfoView
    implements Serializable
{

    public InsFileInfoView()
    {
    }

    public InsFileInfoView(String fileid, String insid, String nodeid, String userid, String ismove, String worklog, String filename, 
            Date filedate)
    {
        this.fileid = fileid;
        this.insid = insid;
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

    private String fileid;
    private String insid;
    private String nodeid;
    private String userid;
    private String ismove;
    private String worklog;
    private String filename;
    private Date filedate;
}
