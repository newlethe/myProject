package com.sgepit.frame.flow.hbm;

import java.io.Serializable;
import java.util.Date;

public class FlwAdjunctIns
    implements Serializable
{

    public FlwAdjunctIns()
    {
    }

    public FlwAdjunctIns(String fileid, String filename, Long filesize, Date filedate, String insid, String ismove)
    {
        this.fileid = fileid;
        this.filename = filename;
        this.filesize = filesize;
        this.filedate = filedate;
        this.insid = insid;
        this.ismove = ismove;
    }

    public String getFileid()
    {
        return fileid;
    }

    public void setFileid(String fileid)
    {
        this.fileid = fileid;
    }

    public String getFilename()
    {
        return filename;
    }

    public void setFilename(String filename)
    {
        this.filename = filename;
    }

    public Long getFilesize()
    {
        return filesize;
    }

    public void setFilesize(Long filesize)
    {
        this.filesize = filesize;
    }

    public Date getFiledate()
    {
        return filedate;
    }

    public void setFiledate(Date filedate)
    {
        this.filedate = filedate;
    }

    public String getInsid()
    {
        return insid;
    }

    public void setInsid(String insid)
    {
        this.insid = insid;
    }

    public String getIsmove()
    {
        return ismove;
    }

    public void setIsmove(String ismove)
    {
        this.ismove = ismove;
    }

    private String fileid;
    private String filename;
    private Long filesize;
    private Date filedate;
    private String insid;
    private String ismove;
}
