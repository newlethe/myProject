package com.sgepit.frame.flow.hbm;

import java.io.Serializable;

public class NodeFunModView
    implements Serializable
{

    public NodeFunModView()
    {
    }

    public NodeFunModView(String nodeid, String flowid, String faceid, String funname, String businessname, String methodname, String tablename, 
            String viewname, String modid, String url, String modname)
    {
        this.nodeid = nodeid;
        this.flowid = flowid;
        this.faceid = faceid;
        this.funname = funname;
        this.businessname = businessname;
        this.methodname = methodname;
        this.tablename = tablename;
        this.viewname = viewname;
        this.modid = modid;
        this.url = url;
        this.modname = modname;
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

    public String getFaceid()
    {
        return faceid;
    }

    public void setFaceid(String faceid)
    {
        this.faceid = faceid;
    }

    public String getFunname()
    {
        return funname;
    }

    public void setFunname(String funname)
    {
        this.funname = funname;
    }

    public String getBusinessname()
    {
        return businessname;
    }

    public void setBusinessname(String businessname)
    {
        this.businessname = businessname;
    }

    public String getMethodname()
    {
        return methodname;
    }

    public void setMethodname(String methodname)
    {
        this.methodname = methodname;
    }

    public String getTablename()
    {
        return tablename;
    }

    public void setTablename(String tablename)
    {
        this.tablename = tablename;
    }

    public String getModid()
    {
        return modid;
    }

    public void setModid(String modid)
    {
        this.modid = modid;
    }

    public String getUrl()
    {
        return url;
    }

    public void setUrl(String url)
    {
        this.url = url;
    }

    public String getModname()
    {
        return modname;
    }

    public void setModname(String modname)
    {
        this.modname = modname;
    }

    public String getViewname()
    {
        return viewname;
    }

    public void setViewname(String viewname)
    {
        this.viewname = viewname;
    }

    private String nodeid;
    private String flowid;
    private String faceid;
    private String funname;
    private String businessname;
    private String methodname;
    private String tablename;
    private String viewname;
    private String modid;
    private String url;
    private String modname;
}
