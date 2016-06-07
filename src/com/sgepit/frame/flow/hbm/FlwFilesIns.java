package com.sgepit.frame.flow.hbm;

import java.io.Serializable;

public class FlwFilesIns
    implements Serializable
{

    public FlwFilesIns()
    {
    }

    public FlwFilesIns(String fileid, String insid, String nodeid, String userid, String ismove)
    {
        this.fileid = fileid;
        this.insid = insid;
        this.nodeid = nodeid;
        this.userid = userid;
        this.ismove = ismove;
    }

    public String getFileid()
    {
        return fileid;
    }

    public void setFileid(String fileid)
    {
        this.fileid = fileid;
    }

    public String getInsid()
    {
        return insid;
    }

    public void setInsid(String insid)
    {
        this.insid = insid;
    }

    public String getNodeid()
    {
        return nodeid;
    }

    public void setNodeid(String nodeid)
    {
        this.nodeid = nodeid;
    }

    public String getUserid()
    {
        return userid;
    }

    public void setUserid(String userid)
    {
        this.userid = userid;
    }

    public boolean equals(Object other)
    {
        if(this == other)
            return true;
        if(other == null)
            return false;
        if(!(other instanceof FlwFilesIns))
            return false;
        FlwFilesIns castOther = (FlwFilesIns)other;
        return (getFileid() == castOther.getFileid() || getFileid() != null && castOther.getFileid() != null && getFileid().equals(castOther.getFileid())) && (getInsid() == castOther.getInsid() || getInsid() != null && castOther.getInsid() != null && getInsid().equals(castOther.getInsid())) && (getNodeid() == castOther.getNodeid() || getNodeid() != null && castOther.getNodeid() != null && getNodeid().equals(castOther.getNodeid())) && (getUserid() == castOther.getUserid() || getUserid() != null && castOther.getUserid() != null && getUserid().equals(castOther.getUserid()));
    }

    public int hashCode()
    {
        int result = 17;
        result = 37 * result + (getFileid() != null ? getFileid().hashCode() : 0);
        result = 37 * result + (getInsid() != null ? getInsid().hashCode() : 0);
        result = 37 * result + (getNodeid() != null ? getNodeid().hashCode() : 0);
        result = 37 * result + (getUserid() != null ? getUserid().hashCode() : 0);
        return result;
    }

    public String getIsmove()
    {
        return ismove;
    }

    public void setIsmove(String ismove)
    {
        this.ismove = ismove;
    }

    private String fileid;
    private String insid;
    private String nodeid;
    private String userid;
    private String ismove;
}
