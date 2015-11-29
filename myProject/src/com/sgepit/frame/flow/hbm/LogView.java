package com.sgepit.frame.flow.hbm;

import java.io.Serializable;
import java.util.Date;

public class LogView
    implements Serializable
{

    public LogView()
    {
    }

    public LogView(String insid, String fromnode, String tonode, Date ftime, String ftype, String flag)
    {
        this.insid = insid;
        this.fromnode = fromnode;
        this.tonode = tonode;
        this.ftime = ftime;
        this.ftype = ftype;
        this.flag = flag;
    }

    public LogView(String logid, String insid, String fromnode, String tonode, Date ftime, String ftype, String notes, 
            String flag, String nodename, String nodeid)
    {
        this.logid = logid;
        this.insid = insid;
        this.fromnode = fromnode;
        this.tonode = tonode;
        this.ftime = ftime;
        this.ftype = ftype;
        this.notes = notes;
        this.flag = flag;
        this.nodename = nodename;
        this.nodeid = nodeid;
    }

    public String getLogid()
    {
        return logid;
    }

    public void setLogid(String logid)
    {
        this.logid = logid;
    }

    public String getInsid()
    {
        return insid;
    }

    public void setInsid(String insid)
    {
        this.insid = insid;
    }

    public String getFromnode()
    {
        return fromnode;
    }

    public void setFromnode(String fromnode)
    {
        this.fromnode = fromnode;
    }

    public String getTonode()
    {
        return tonode;
    }

    public void setTonode(String tonode)
    {
        this.tonode = tonode;
    }

    public Date getFtime()
    {
        return ftime;
    }

    public void setFtime(Date ftime)
    {
        this.ftime = ftime;
    }

    public String getFtype()
    {
        return ftype;
    }

    public void setFtype(String ftype)
    {
        this.ftype = ftype;
    }

    public String getNotes()
    {
        return notes;
    }

    public void setNotes(String notes)
    {
        this.notes = notes;
    }

    public String getFlag()
    {
        return flag;
    }

    public void setFlag(String flag)
    {
        this.flag = flag;
    }

    public String getNodename()
    {
        return nodename;
    }

    public void setNodename(String nodename)
    {
        this.nodename = nodename;
    }

    public String getNodeid()
    {
        return nodeid;
    }

    public void setNodeid(String nodeid)
    {
        this.nodeid = nodeid;
    }

    private String logid;
    private String insid;
    private String fromnode;
    private String tonode;
    private Date ftime;
    private String ftype;
    private String notes;
    private String flag;
    private String nodename;
    private String nodeid;
}
