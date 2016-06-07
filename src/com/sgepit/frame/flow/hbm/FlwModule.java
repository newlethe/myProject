package com.sgepit.frame.flow.hbm;

import java.io.Serializable;

public class FlwModule
    implements Serializable
{

    public FlwModule()
    {
    }

    public FlwModule(String modname)
    {
        this.modname = modname;
    }

    public FlwModule(String url, String modname)
    {
        this.url = url;
        this.modname = modname;
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

    private String modid;
    private String url;
    private String modname;
}
