package com.sgepit.frame.flow.hbm;

import java.io.Serializable;


public class FlwNode
    implements Serializable
{

    public FlwNode()
    {
    }

    public FlwNode(String nodeid, String funid, FlwDefinition flwDefinition, String name, String handler, String role, String type, 
            String xmlname, String bookmark,String istopromoter)
    {
        this.nodeid = nodeid;
        this.funid = funid;
        this.flwDefinition = flwDefinition;
        this.name = name;
        this.handler = handler;
        this.role = role;
        this.type = type;
        this.xmlname = xmlname;
        this.bookmark = bookmark;
        this.istopromoter = istopromoter;
    }

    public String getNodeid()
    {
        return nodeid;
    }

    public void setNodeid(String nodeid)
    {
        this.nodeid = nodeid;
    }

    public String getFunid()
    {
        return funid;
    }

    public void setFunid(String funid)
    {
        this.funid = funid;
    }

    public FlwDefinition getFlwDefinition()
    {
        return flwDefinition;
    }

    public void setFlwDefinition(FlwDefinition flwDefinition)
    {
        this.flwDefinition = flwDefinition;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
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

    public String getType()
    {
        return type;
    }

    public void setType(String type)
    {
        this.type = type;
    }

    public String getXmlname()
    {
        return xmlname;
    }

    public void setXmlname(String xmlname)
    {
        this.xmlname = xmlname;
    }

    public String getBookmark()
    {
        return bookmark;
    }

    public void setBookmark(String bookmark)
    {
        this.bookmark = bookmark;
    }

    public String getIstopromoter() {
		return istopromoter;
	}

	public void setIstopromoter(String istopromoter) {
		this.istopromoter = istopromoter;
	}

	private String nodeid;
    private String funid;
    private FlwDefinition flwDefinition;
    private String name;
    private String handler;
    private String role;
    private String type;
    private String xmlname;
    private String bookmark;
    private String istopromoter;
}
