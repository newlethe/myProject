package com.sgepit.frame.flow.hbm;

import java.io.Serializable;
import java.util.Date;

public class TaskView
    implements Serializable
{

    public TaskView()
    {
    }

    public TaskView(String logid, String insid, String flowid, String flowtitle, String title, String flowno, Date ftime, 
            String ftype, String fromnode, String tonode, String status, String orgname, String posname, String unit, 
            String spec,String removeinfo,String xmbh,String unitid)
    {
        this.logid = logid;
        this.insid = insid;
        this.flowid = flowid;
        this.flowtitle = flowtitle;
        this.title = title;
        this.flowno = flowno;
        this.ftime = ftime;
        this.ftype = ftype;
        this.fromnode = fromnode;
        this.tonode = tonode;
        this.status = status;
        this.orgname = orgname;
        this.posname = posname;
        this.unit = unit;
        this.spec = spec;
        this.xmbh = xmbh;
        this.unitid = unitid;
        this.removeinfo = removeinfo;
    }

    public TaskView(String logid, String insid, String flowid, String flowtitle, String title, Date ftime, String ftype, 
            String fromnode, String tonode, String notes, String flag, String nodename, String fromname, String flowno, 
            String toname, String status, String orgname, String posname, String nodeid, String unit, String spec)
    {
        this.logid = logid;
        this.insid = insid;
        this.flowid = flowid;
        this.flowtitle = flowtitle;
        this.title = title;
        this.flowno = flowno;
        this.ftime = ftime;
        this.ftype = ftype;
        this.fromnode = fromnode;
        this.tonode = tonode;
        this.notes = notes;
        this.flag = flag;
        this.nodename = nodename;
        this.nodeid = nodeid;
        this.fromname = fromname;
        this.toname = toname;
        this.status = status;
        this.orgname = orgname;
        this.posname = posname;
        this.unit = unit;
        this.spec = spec;
    }

    public String getInsid()
    {
        return insid;
    }

    public void setInsid(String insid)
    {
        this.insid = insid;
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

    public String getNotes()
    {
        return notes;
    }

    public void setNotes(String notes)
    {
        this.notes = notes;
    }

    public String getLogid()
    {
        return logid;
    }

    public void setLogid(String logid)
    {
        this.logid = logid;
    }

    public String getFromname()
    {
        return fromname;
    }

    public void setFromname(String fromname)
    {
        this.fromname = fromname;
    }

    public String getToname()
    {
        return toname;
    }

    public void setToname(String toname)
    {
        this.toname = toname;
    }

    public String getTitle()
    {
        return title;
    }

    public void setTitle(String title)
    {
        this.title = title;
    }

    public String getFlowid()
    {
        return flowid;
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

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public String getOrgname()
    {
        return orgname;
    }

    public void setOrgname(String orgname)
    {
        this.orgname = orgname;
    }

    public String getPosname()
    {
        return posname;
    }

    public void setPosname(String posname)
    {
        this.posname = posname;
    }

    public String getFlowno()
    {
        return flowno;
    }

    public void setFlowno(String flowno)
    {
        this.flowno = flowno;
    }

    public String getUnit()
    {
        return unit;
    }

    public void setUnit(String unit)
    {
        this.unit = unit;
    }

    public String getSpec()
    {
        return spec;
    }

    public void setSpec(String spec)
    {
        this.spec = spec;
    }

    public String getNodeid()
    {
        return nodeid;
    }

    public void setNodeid(String nodeid)
    {
        this.nodeid = nodeid;
    }

    private String logid;
    private String insid;
    private String flowid;
    private String flowtitle;
    private String title;
    private String flowno;
    private String unit;
    private String spec;
    private Date ftime;
    private String ftype;
    private String fromnode;
    private String tonode;
    private String notes;
    private String flag;
    private String nodename;
    private String nodeid;
    private String fromname;
    private String toname;
    private String status;
    private String orgname;
    private String posname;
    private String isyp;
    private String xmbh;
    private String removeinfo;//流程移交移交状态  0未移交，-1部分移交，1全部移交完毕，2没有流程资料
    private String unitid;//流程移交移交状态  0未移交，-1部分移交，1全部移交完毕，2没有流程资料
	public String getRemoveinfo() {
		return removeinfo;
	}

	public void setRemoveinfo(String removeinfo) {
		this.removeinfo = removeinfo;
	}

	public String getIsyp() {
		return isyp;
	}

	public void setIsyp(String isyp) {
		this.isyp = isyp;
	}

	public String getXmbh() {
		return xmbh;
	}

	public void setXmbh(String xmbh) {
		this.xmbh = xmbh;
	}

	public String getUnitid() {
		return unitid;
	}

	public void setUnitid(String unitid) {
		this.unitid = unitid;
	}
}
