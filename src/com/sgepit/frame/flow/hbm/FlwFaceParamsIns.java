package com.sgepit.frame.flow.hbm;

import java.io.Serializable;

public class FlwFaceParamsIns
    implements Serializable
{

    public FlwFaceParamsIns()
    {
    }

    public FlwFaceParamsIns(String insid, String nodeid, String paramvalues)
    {
        this.insid = insid;
        this.nodeid = nodeid;
        this.paramvalues = paramvalues;
    }

    public FlwFaceParamsIns(String insid, String nodeid, String paramvalues, String dataid)
    {
        this.insid = insid;
        this.nodeid = nodeid;
        this.paramvalues = paramvalues;
        this.dataid = dataid;
    }

    public String getValueid()
    {
        return valueid;
    }

    public void setValueid(String valueid)
    {
        this.valueid = valueid;
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

    public String getParamvalues()
    {
        return paramvalues;
    }

    public void setParamvalues(String paramvalues)
    {
        this.paramvalues = paramvalues;
    }

    public String getDataid()
    {
        return dataid;
    }

    public void setDataid(String dataid)
    {
        this.dataid = dataid;
    }

    private String valueid;
    private String insid;
    private String nodeid;
    private String paramvalues;
    private String dataid;
}
