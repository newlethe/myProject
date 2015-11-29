package com.sgepit.frame.flow.hbm;

import java.io.Serializable;

public class NodePathView
    implements Serializable
{

    public NodePathView()
    {
    }

    public NodePathView(String pathid, String flowid, String startid, String starttype, String endid, String bname, String ename, 
            String handler, String role, String funid)
    {
        this.pathid = pathid;
        this.flowid = flowid;
        this.startid = startid;
        this.starttype = starttype;
        this.endid = endid;
        this.bname = bname;
        this.ename = ename;
        this.handler = handler;
        this.role = role;
        this.funid = funid;
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

    public String getStarttype()
    {
        return starttype;
    }

    public void setStarttype(String starttype)
    {
        this.starttype = starttype;
    }

    public String getBname()
    {
        return bname;
    }

    public void setBname(String bname)
    {
        this.bname = bname;
    }

    public String getEname()
    {
        return ename;
    }

    public void setEname(String ename)
    {
        this.ename = ename;
    }

    public String getHandler()
    {
        return handler;
    }

    public void setHandler(String handler)
    {
        this.handler = handler;
    }

    public String getRole()
    {
        return role;
    }

    public void setRole(String role)
    {
        this.role = role;
    }

    public String getFunid()
    {
        return funid;
    }

    public void setFunid(String funid)
    {
        this.funid = funid;
    }

    private String pathid;
    private String flowid;
    private String startid;
    private String starttype;
    private String endid;
    private String bname;
    private String ename;
    private String handler;
    private String role;
    private String funid;
}
