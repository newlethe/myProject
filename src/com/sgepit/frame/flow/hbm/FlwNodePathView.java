package com.sgepit.frame.flow.hbm;

import java.io.Serializable;

public class FlwNodePathView
    implements Serializable
{

    public FlwNodePathView()
    {
    }

    public FlwNodePathView(String pathid, String flowid, String startid, String startType, String endid)
    {
        this.pathid = pathid;
        this.flowid = flowid;
        this.startid = startid;
        this.startType = startType;
        this.endid = endid;
    }

    public String getPathid()
    {
        return pathid;
    }

    public void setPathid(String pathid)
    {
        this.pathid = pathid;
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

    public String getStartType()
    {
        return startType;
    }

    public void setStartType(String startType)
    {
        this.startType = startType;
    }

    private String pathid;
    private String flowid;
    private String startid;
    private String startType;
    private String endid;
}
