package com.sgepit.frame.flow.hbm;

import java.io.Serializable;

public class FlwRoles
    implements Serializable
{

    public FlwRoles()
    {
    }

    public FlwRoles(String id, String rolename)
    {
        this.id = id;
        this.rolename = rolename;
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

    private String id;
    private String rolename;
}
