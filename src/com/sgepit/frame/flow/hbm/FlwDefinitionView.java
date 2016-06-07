package com.sgepit.frame.flow.hbm;

import java.io.Serializable;

public class FlwDefinitionView
    implements Serializable
{

    public FlwDefinitionView()
    {
    }

    public FlwDefinitionView(String flowid, String flowtitle, String xmlname, String state, String frameid, String isyp)
    {
        this.flowid = flowid;
        this.flowtitle = flowtitle;
        this.xmlname = xmlname;
        this.state = state;
        this.frameid = frameid;
        this.isyp = isyp;
    }

    public String getState()
    {
        return state;
    }

    public void setState(String state)
    {
        this.state = state;
    }

    public String getFlowid()
    {
        return flowid;
    }

    public String getXmlname()
    {
        return xmlname;
    }

    public void setXmlname(String xmlname)
    {
        this.xmlname = xmlname;
    }

    public void setFlowid(String flowid)
    {
        this.flowid = flowid;
    }

    public String getFlowtitle()
    {
        return flowtitle;
    }

    public void setFlowtitle(String flowtitle)
    {
        this.flowtitle = flowtitle;
    }

    public String getFrameid()
    {
        return frameid;
    }

    public void setFrameid(String frameid)
    {
        this.frameid = frameid;
    }

	public String getIsyp() {
		return isyp;
	}

	public void setIsyp(String isyp) {
		this.isyp = isyp;
	}
	
    private String flowid;
    private String flowtitle;
    private String xmlname;
    private String state;
    private String frameid;
    private String isyp;
}
