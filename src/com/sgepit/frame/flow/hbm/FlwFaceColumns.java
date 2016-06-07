package com.sgepit.frame.flow.hbm;

import java.io.Serializable;

public class FlwFaceColumns
    implements Serializable
{

    public FlwFaceColumns()
    {
    }

    public FlwFaceColumns(String faceid, String colname)
    {
        this.faceid = faceid;
        this.colname = colname;
    }

    public String getColid()
    {
        return colid;
    }

    public void setColid(String colid)
    {
        this.colid = colid;
    }

    public String getFaceid()
    {
        return faceid;
    }

    public void setFaceid(String faceid)
    {
        this.faceid = faceid;
    }

    public String getColname()
    {
        return colname;
    }

    public void setColname(String colname)
    {
        this.colname = colname;
    }

    private String colid;
    private String faceid;
    private String colname;
}
