package com.sgepit.frame.flow.hbm;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

public class FlwDefinition
    implements Serializable
{

    public FlwDefinition()
    {
        flwNodes = new HashSet(0);
        flwInstances = new HashSet(0);
        flwNodePaths = new HashSet(0);
    }

    public FlwDefinition(String flowid, String flowtitle, String xmlname, String state, String frameid)
    {
        flwNodes = new HashSet(0);
        flwInstances = new HashSet(0);
        flwNodePaths = new HashSet(0);
        this.flowid = flowid;
        this.flowtitle = flowtitle;
        this.xmlname = xmlname;
        this.state = state;
        this.frameid = frameid;
    }

    public FlwDefinition(String flowid, String flowtitle, String xmlname, String state, String frameid, String isyp, Set flwNodes, 
    		Set flwInstances, Set flwNodePaths)
    {
        this.flwNodes = new HashSet(0);
        this.flwInstances = new HashSet(0);
        this.flwNodePaths = new HashSet(0);
        this.flowid = flowid;
        this.flowtitle = flowtitle;
        this.xmlname = xmlname;
        this.state = state;
        this.frameid = frameid;
        this.flwNodes = flwNodes;
        this.flwInstances = flwInstances;
        this.flwNodePaths = flwNodePaths;
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

    public Set getFlwNodes()
    {
        return flwNodes;
    }

    public void setFlwNodes(Set flwNodes)
    {
        this.flwNodes = flwNodes;
    }

    public Set getFlwInstances()
    {
        return flwInstances;
    }

    public void setFlwInstances(Set flwInstances)
    {
        this.flwInstances = flwInstances;
    }

    public Set getFlwNodePaths()
    {
        return flwNodePaths;
    }

    public void setFlwNodePaths(Set flwNodePaths)
    {
        this.flwNodePaths = flwNodePaths;
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
	public String getUnitid() {
		return unitid;
	}

	public void setUnitid(String unitid) {
		this.unitid = unitid;
	}
	
	private String flowid;
    private String flowtitle;
    private String xmlname;
    private String state;
    private String frameid;
    private Set flwNodes;
    private Set flwInstances;
    private Set flwNodePaths;
    private String unitid;
    private String isyp;
}
