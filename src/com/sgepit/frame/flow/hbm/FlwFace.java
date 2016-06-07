package com.sgepit.frame.flow.hbm;

import java.io.Serializable;

public class FlwFace
    implements Serializable
{

    public FlwFace()
    {
    }

    public FlwFace(String modid, String businessname, String methodname, String funname, String tablename, String viewname)
    {
        this.modid = modid;
        this.businessname = businessname;
        this.methodname = methodname;
        this.funname = funname;
        this.tablename = tablename;
        this.viewname = viewname;
    }

    public String getFaceid()
    {
        return faceid;
    }

    public void setFaceid(String faceid)
    {
        this.faceid = faceid;
    }

    public String getModid()
    {
        return modid;
    }

    public void setModid(String modid)
    {
        this.modid = modid;
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

    public String getFunname()
    {
        return funname;
    }

    public void setFunname(String funname)
    {
        this.funname = funname;
    }

    public String getTablename()
    {
        return tablename;
    }

    public void setTablename(String tablename)
    {
        this.tablename = tablename;
    }

    public String getViewname()
    {
        return viewname;
    }

    public void setViewname(String viewname)
    {
        this.viewname = viewname;
    }

	public String getUnitid() {
		return unitid;
	}

	public void setUnitid(String unitid) {
		this.unitid = unitid;
	}
	
    private String faceid;
    private String modid;
    private String businessname;
    private String methodname;
    private String funname;
    private String tablename;
    private String viewname;
    private String unitid;
	
}
