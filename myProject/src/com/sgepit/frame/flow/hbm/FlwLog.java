package com.sgepit.frame.flow.hbm;

import java.io.Serializable;
import java.util.Date;


public class FlwLog
    implements Serializable
{

    public FlwLog()
    {
    }

    public FlwLog(FlwInstance flwInstance, String fromnode, String tonode, Date ftime, String ftype, String notes, String flag, 
            String nodename, String fromnodeid, String nodeid, String marks, String tocnodes, String isresend)
    {
        this.flwInstance = flwInstance;
        this.fromnode = fromnode;
        this.tonode = tonode;
        this.ftime = ftime;
        this.ftype = ftype;
        this.notes = notes;
        this.flag = flag;
        this.nodename = nodename;
        this.fromnodeid = fromnodeid;
        this.nodeid = nodeid;
        this.marks = marks;
        this.tocnodes = tocnodes;
        this.isresend = isresend;
    }

    public String getLogid()
    {
        return logid;
    }

    public void setLogid(String logid)
    {
        this.logid = logid;
    }

    public FlwInstance getFlwInstance()
    {
    	System.out.println("@@@@@@@@@@@@@@@@@@");
        return flwInstance;
    }

    public void setFlwInstance(FlwInstance flwInstance)
    {
        this.flwInstance = flwInstance;
    }

    public String getFromnode()
    {
        return fromnode;
    }

    public void setFromnode(String fromnode)
    {
        this.fromnode = fromnode;
    }

    public String getTonode()
    {
        return tonode;
    }

    public void setTonode(String tonode)
    {
        this.tonode = tonode;
    }

    public Date getFtime()
    {
        return ftime;
    }

    public void setFtime(Date ftime)
    {
        this.ftime = ftime;
    }

    public String getFtype()
    {
        return ftype;
    }

    public void setFtype(String ftype)
    {
        this.ftype = ftype;
    }

    public String getNotes()
    {
        return notes;
    }

    public void setNotes(String notes)
    {
        this.notes = notes;
    }

    public String getFlag()
    {
        return flag;
    }

    public void setFlag(String flag)
    {
        this.flag = flag;
    }

    public String getNodename()
    {
        return nodename;
    }

    public void setNodename(String nodename)
    {
        this.nodename = nodename;
    }
    
    public void setFromnodeid(String fromnodeid) {
    	this.fromnodeid = fromnodeid;
    }
    
    public String getNodeid() {
    	return nodeid;
    }
    
    public void setNodeid(String nodeid) {
    	this.nodeid = nodeid;
    }

    public String getFromnodeid() {
    	return fromnodeid;
    }
	public String getMarks() {
		return marks;
	}

	public void setMarks(String marks) {
		this.marks = marks;
	}

	public String getTocnodes() {
		return tocnodes;
	}

	public void setTocnodes(String tocnodes) {
		this.tocnodes = tocnodes;
	}
	public String getIsresend() {
		return isresend;
	}

	public void setIsresend(String isresend) {
		this.isresend = isresend;
	}
	
	private String logid;
	private FlwInstance flwInstance;
	private String fromnode;
	private String tonode;
	private Date ftime;
	private String ftype;
	private String notes;
	private String flag;
	private String nodename;
	private String fromnodeid;
	private String nodeid;
	private String marks;
	private String tocnodes;
	private String isresend;
}
