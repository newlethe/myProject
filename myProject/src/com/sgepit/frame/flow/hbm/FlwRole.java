package com.sgepit.frame.flow.hbm;

import java.io.Serializable;

public class FlwRole
    implements Serializable
{

    public FlwRole()
    {
    }

    public FlwRole(String id, String rolename, String userid)
    {
        this.id = id;
        this.rolename = rolename;
        this.userid = userid;
    }

    public String getId()
    {
        return id;
    }

    public void setId(String id)
    {
        this.id = id;
    }

    public String getRolename()
    {
        return rolename;
    }

    public void setRolename(String rolename)
    {
        this.rolename = rolename;
    }

    public String getUserid()
    {
        return userid;
    }

    public void setUserid(String userid)
    {
        this.userid = userid;
    }

    private String id;
    private String rolename;
    private String userid;
}
