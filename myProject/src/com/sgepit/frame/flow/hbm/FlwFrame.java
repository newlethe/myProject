package com.sgepit.frame.flow.hbm;

import java.io.Serializable;

public class FlwFrame
    implements Serializable
{

    public FlwFrame()
    {
    }

    public FlwFrame(String framename)
    {
        this.framename = framename;
    }

    public String getFrameid()
    {
        return frameid;
    }

    public void setFrameid(String frameid)
    {
        this.frameid = frameid;
    }

    public String getFramename()
    {
        return framename;
    }

    public void setFramename(String framename)
    {
        this.framename = framename;
    }
	public String getIsyp() {
		return isyp;
	}

	public void setIsyp(String isyp) {
		this.isyp = isyp;
	}
	
	public String getUnitid() {
		return unitid;
	}

	public void setUnitid(String unitid) {
		this.unitid = unitid;
	}
	
	private String frameid;
	private String framename;
	private String isyp;
	private String unitid;
}
