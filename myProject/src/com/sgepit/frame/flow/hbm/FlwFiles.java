package com.sgepit.frame.flow.hbm;

import java.io.Serializable;
import java.util.Date;

public class FlwFiles
    implements Serializable
{

    public FlwFiles()
    {
    }

    public FlwFiles(String fileid, String filename, Long filesize, Date filedate, String nodeid, String flowid)
    {
        this.fileid = fileid;
        this.filename = filename;
        this.filesize = filesize;
        this.filedate = filedate;
        this.nodeid = nodeid;
        this.flowid = flowid;
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

    public String getNodeid()
    {
        return nodeid;
    }

    public void setNodeid(String nodeid)
    {
        this.nodeid = nodeid;
    }

    public String getFlowid()
    {
        return flowid;
    }

    public void setFlowid(String flowid)
    {
        this.flowid = flowid;
    }

    private String fileid;
    private String filename;
    private Long filesize;
    private Date filedate;
    private String nodeid;
    private String flowid;
}
