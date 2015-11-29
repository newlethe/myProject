package com.sgepit.frame.flow.hbm;

import java.io.Serializable;

public class NodeView
    implements Serializable
{

    public NodeView()
    {
    }

    public NodeView(String nodeid, String flowid, String name, String handler, String role, String type, String funid, 
            String realname, String username, String funname, String modid, String businessname, String methodname, String tablename, 
            String bookmark,String istopromoter)
    {
        this.nodeid = nodeid;
        this.flowid = flowid;
        this.name = name;
        this.handler = handler;
        this.role = role;
        this.type = type;
        this.funid = funid;
        this.realname = realname;
        this.username = username;
        this.funname = funname;
        this.modid = modid;
        this.businessname = businessname;
        this.methodname = methodname;
        this.tablename = tablename;
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

    public String getFlowid()
    {
        return flowid;
    }

    public void setFlowid(String flowid)
    {
        this.flowid = flowid;
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

    public String getRealname()
    {
        return realname;
    }

    public void setRealname(String realname)
    {
        this.realname = realname;
    }

    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    public String getFunname()
    {
        return funname;
    }

    public void setFunname(String funname)
    {
        this.funname = funname;
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

    public String getTablename()
    {
        return tablename;
    }

    public void setTablename(String tablename)
    {
        this.tablename = tablename;
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
    private String flowid;
    private String name;
    private String handler;
    private String role;
    private String type;
    private String funid;
    private String realname;
    private String username;
    private String funname;
    private String modid;
    private String businessname;
    private String methodname;
    private String tablename;
    private String bookmark;
    private String istopromoter;
}
