package com.sgepit.frame.flow.hbm;

import java.io.Serializable;

public class FlwCommonNodePath
    implements Serializable
{

    public FlwCommonNodePath()
    {
    }

    public FlwCommonNodePath(String flowid, String nodeid, String startid, String endid, String starttype)
    {
        this.flowid = flowid;
        this.nodeid = nodeid;
        this.startid = startid;
        this.endid = endid;
        this.starttype = starttype;
    }

    public String getCpathid()
    {
        return cpathid;
    }

    public void setCpathid(String cpathid)
    {
        this.cpathid = cpathid;
    }

    public String getFlowid()
    {
        return flowid;
    }

    public void setFlowid(String flowid)
    {
        this.flowid = flowid;
    }

    public String getStartid()
    {
        return startid;
    }

    public void setStartid(String startid)
    {
        this.startid = startid;
    }

    public String getEndid()
    {
        return endid;
    }

    public void setEndid(String endid)
    {
        this.endid = endid;
    }

    public String getStarttype()
    {
        return starttype;
    }

    public void setStarttype(String starttype)
    {
        this.starttype = starttype;
    }

    public String getNodeid()
    {
        return nodeid;
    }

    public void setNodeid(String nodeid)
    {
        this.nodeid = nodeid;
    }

    private String cpathid;
    private String flowid;
    private String nodeid;
    private String startid;
    private String endid;
    private String starttype;
}
