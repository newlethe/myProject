package com.sgepit.frame.flow.hbm;

import java.io.Serializable;


public class FlwNodePath
    implements Serializable
{

    public FlwNodePath()
    {
    }

    public FlwNodePath(String pathid, FlwDefinition flwDefinition, String startid, String startType, String endid)
    {
        this.pathid = pathid;
        this.flwDefinition = flwDefinition;
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

    public FlwDefinition getFlwDefinition()
    {
        return flwDefinition;
    }

    public void setFlwDefinition(FlwDefinition flwDefinition)
    {
        this.flwDefinition = flwDefinition;
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
    private FlwDefinition flwDefinition;
    private String startid;
    private String startType;
    private String endid;
}
