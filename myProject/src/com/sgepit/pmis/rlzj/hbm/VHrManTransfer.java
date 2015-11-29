package com.sgepit.pmis.rlzj.hbm;

import java.util.Date;

/**
 * VHrManTansferId entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class VHrManTransfer implements java.io.Serializable {

	// Fields

	private String transferid;
	private String userid;
	private String realname;
	private String usernum;
	private Date transferdate;
	private String olddeptid;
	private String olddeptname;
	private String newdeptid;
	private String newdeptname;
	private String oldpro;
	private String oldproname;
	private String newpro;
	private String newproname;
	private String oldpost;
	private String oldpostname;
	private String newpost;
	private String newpostname;
	private String reason;
	private String handleruserid;
	private String handlerusername;
	private String demo;
	private String transfertype;
	private String pid;
	private String posttrasnstype;

	// Constructors

	/** default constructor */
	public VHrManTransfer() {
	}

	/** minimal constructor */
	public VHrManTransfer(String transferid, String userid, String transfertype) {
		this.transferid = transferid;
		this.userid = userid;
		this.transfertype = transfertype;
	}

	/** full constructor */
	public VHrManTransfer(String transferid, String userid, String realname,
			String usernum, Date transferdate, String olddeptid,
			String olddeptname, String newdeptid, String newdeptname,
			String oldpro, String oldproname, String newpro, String newproname,
			String oldpost, String oldpostname, String newpost,
			String newpostname, String reason, String handleruserid,String handlerusername,
			String demo, String transfertype, String pid, String posttrasnstype) {
		this.transferid = transferid;
		this.userid = userid;
		this.realname = realname;
		this.usernum = usernum;
		this.transferdate = transferdate;
		this.olddeptid = olddeptid;
		this.olddeptname = olddeptname;
		this.newdeptid = newdeptid;
		this.newdeptname = newdeptname;
		this.oldpro = oldpro;
		this.oldproname = oldproname;
		this.newpro = newpro;
		this.newproname = newproname;
		this.oldpost = oldpost;
		this.oldpostname = oldpostname;
		this.newpost = newpost;
		this.newpostname = newpostname;
		this.reason = reason;
		this.handleruserid = handleruserid;
		this.handlerusername = handlerusername;
		this.demo = demo;
		this.transfertype = transfertype;
		this.pid = pid;
		this.posttrasnstype = posttrasnstype;
	}

	// Property accessors

	public String getTransferid() {
		return this.transferid;
	}

	public void setTransferid(String transferid) {
		this.transferid = transferid;
	}

	public String getUserid() {
		return this.userid;
	}

	public void setUserid(String userid) {
		this.userid = userid;
	}

	public String getRealname() {
		return this.realname;
	}

	public void setRealname(String realname) {
		this.realname = realname;
	}

	public String getUsernum() {
		return this.usernum;
	}

	public void setUsernum(String usernum) {
		this.usernum = usernum;
	}

	public Date getTransferdate() {
		return this.transferdate;
	}

	public void setTransferdate(Date transferdate) {
		this.transferdate = transferdate;
	}

	public String getOlddeptid() {
		return this.olddeptid;
	}

	public void setOlddeptid(String olddeptid) {
		this.olddeptid = olddeptid;
	}

	public String getOlddeptname() {
		return this.olddeptname;
	}

	public void setOlddeptname(String olddeptname) {
		this.olddeptname = olddeptname;
	}

	public String getNewdeptid() {
		return this.newdeptid;
	}

	public void setNewdeptid(String newdeptid) {
		this.newdeptid = newdeptid;
	}

	public String getNewdeptname() {
		return this.newdeptname;
	}

	public void setNewdeptname(String newdeptname) {
		this.newdeptname = newdeptname;
	}

	public String getOldpro() {
		return this.oldpro;
	}

	public void setOldpro(String oldpro) {
		this.oldpro = oldpro;
	}

	public String getOldproname() {
		return this.oldproname;
	}

	public void setOldproname(String oldproname) {
		this.oldproname = oldproname;
	}

	public String getNewpro() {
		return this.newpro;
	}

	public void setNewpro(String newpro) {
		this.newpro = newpro;
	}

	public String getNewproname() {
		return this.newproname;
	}

	public void setNewproname(String newproname) {
		this.newproname = newproname;
	}

	public String getOldpost() {
		return this.oldpost;
	}

	public void setOldpost(String oldpost) {
		this.oldpost = oldpost;
	}

	public String getOldpostname() {
		return this.oldpostname;
	}

	public void setOldpostname(String oldpostname) {
		this.oldpostname = oldpostname;
	}

	public String getNewpost() {
		return this.newpost;
	}

	public void setNewpost(String newpost) {
		this.newpost = newpost;
	}

	public String getNewpostname() {
		return this.newpostname;
	}

	public void setNewpostname(String newpostname) {
		this.newpostname = newpostname;
	}

	public String getReason() {
		return this.reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public String getHandleruserid() {
		return this.handleruserid;
	}

	public void setHandleruserid(String handleruserid) {
		this.handleruserid = handleruserid;
	}

	public String getDemo() {
		return this.demo;
	}

	public void setDemo(String demo) {
		this.demo = demo;
	}

	public String getTransfertype() {
		return this.transfertype;
	}

	public void setTransfertype(String transfertype) {
		this.transfertype = transfertype;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public boolean equals(Object other) {
		if ((this == other))
			return true;
		if ((other == null))
			return false;
		if (!(other instanceof VHrManTransfer))
			return false;
		VHrManTransfer castOther = (VHrManTransfer) other;

		return ((this.getTransferid() == castOther.getTransferid()) || (this
				.getTransferid() != null
				&& castOther.getTransferid() != null && this.getTransferid()
				.equals(castOther.getTransferid())))
				&& ((this.getUserid() == castOther.getUserid()) || (this
						.getUserid() != null
						&& castOther.getUserid() != null && this.getUserid()
						.equals(castOther.getUserid())))
				&& ((this.getRealname() == castOther.getRealname()) || (this
						.getRealname() != null
						&& castOther.getRealname() != null && this
						.getRealname().equals(castOther.getRealname())))
				&& ((this.getUsernum() == castOther.getUsernum()) || (this
						.getUsernum() != null
						&& castOther.getUsernum() != null && this.getUsernum()
						.equals(castOther.getUsernum())))
				&& ((this.getTransferdate() == castOther.getTransferdate()) || (this
						.getTransferdate() != null
						&& castOther.getTransferdate() != null && this
						.getTransferdate().equals(castOther.getTransferdate())))
				&& ((this.getOlddeptid() == castOther.getOlddeptid()) || (this
						.getOlddeptid() != null
						&& castOther.getOlddeptid() != null && this
						.getOlddeptid().equals(castOther.getOlddeptid())))
				&& ((this.getOlddeptname() == castOther.getOlddeptname()) || (this
						.getOlddeptname() != null
						&& castOther.getOlddeptname() != null && this
						.getOlddeptname().equals(castOther.getOlddeptname())))
				&& ((this.getNewdeptid() == castOther.getNewdeptid()) || (this
						.getNewdeptid() != null
						&& castOther.getNewdeptid() != null && this
						.getNewdeptid().equals(castOther.getNewdeptid())))
				&& ((this.getNewdeptname() == castOther.getNewdeptname()) || (this
						.getNewdeptname() != null
						&& castOther.getNewdeptname() != null && this
						.getNewdeptname().equals(castOther.getNewdeptname())))
				&& ((this.getOldpro() == castOther.getOldpro()) || (this
						.getOldpro() != null
						&& castOther.getOldpro() != null && this.getOldpro()
						.equals(castOther.getOldpro())))
				&& ((this.getOldproname() == castOther.getOldproname()) || (this
						.getOldproname() != null
						&& castOther.getOldproname() != null && this
						.getOldproname().equals(castOther.getOldproname())))
				&& ((this.getNewpro() == castOther.getNewpro()) || (this
						.getNewpro() != null
						&& castOther.getNewpro() != null && this.getNewpro()
						.equals(castOther.getNewpro())))
				&& ((this.getNewproname() == castOther.getNewproname()) || (this
						.getNewproname() != null
						&& castOther.getNewproname() != null && this
						.getNewproname().equals(castOther.getNewproname())))
				&& ((this.getOldpost() == castOther.getOldpost()) || (this
						.getOldpost() != null
						&& castOther.getOldpost() != null && this.getOldpost()
						.equals(castOther.getOldpost())))
				&& ((this.getOldpostname() == castOther.getOldpostname()) || (this
						.getOldpostname() != null
						&& castOther.getOldpostname() != null && this
						.getOldpostname().equals(castOther.getOldpostname())))
				&& ((this.getNewpost() == castOther.getNewpost()) || (this
						.getNewpost() != null
						&& castOther.getNewpost() != null && this.getNewpost()
						.equals(castOther.getNewpost())))
				&& ((this.getNewpostname() == castOther.getNewpostname()) || (this
						.getNewpostname() != null
						&& castOther.getNewpostname() != null && this
						.getNewpostname().equals(castOther.getNewpostname())))
				&& ((this.getReason() == castOther.getReason()) || (this
						.getReason() != null
						&& castOther.getReason() != null && this.getReason()
						.equals(castOther.getReason())))
				&& ((this.getHandleruserid() == castOther.getHandleruserid()) || (this
						.getHandleruserid() != null
						&& castOther.getHandleruserid() != null && this
						.getHandleruserid()
						.equals(castOther.getHandleruserid())))
				&& ((this.getDemo() == castOther.getDemo()) || (this.getDemo() != null
						&& castOther.getDemo() != null && this.getDemo()
						.equals(castOther.getDemo())))
				&& ((this.getTransfertype() == castOther.getTransfertype()) || (this
						.getTransfertype() != null
						&& castOther.getTransfertype() != null && this
						.getTransfertype().equals(castOther.getTransfertype())))
				&& ((this.getPid() == castOther.getPid()) || (this.getPid() != null
						&& castOther.getPid() != null && this.getPid().equals(
						castOther.getPid())));
	}

	public int hashCode() {
		int result = 17;

		result = 37
				* result
				+ (getTransferid() == null ? 0 : this.getTransferid()
						.hashCode());
		result = 37 * result
				+ (getUserid() == null ? 0 : this.getUserid().hashCode());
		result = 37 * result
				+ (getRealname() == null ? 0 : this.getRealname().hashCode());
		result = 37 * result
				+ (getUsernum() == null ? 0 : this.getUsernum().hashCode());
		result = 37
				* result
				+ (getTransferdate() == null ? 0 : this.getTransferdate()
						.hashCode());
		result = 37 * result
				+ (getOlddeptid() == null ? 0 : this.getOlddeptid().hashCode());
		result = 37
				* result
				+ (getOlddeptname() == null ? 0 : this.getOlddeptname()
						.hashCode());
		result = 37 * result
				+ (getNewdeptid() == null ? 0 : this.getNewdeptid().hashCode());
		result = 37
				* result
				+ (getNewdeptname() == null ? 0 : this.getNewdeptname()
						.hashCode());
		result = 37 * result
				+ (getOldpro() == null ? 0 : this.getOldpro().hashCode());
		result = 37
				* result
				+ (getOldproname() == null ? 0 : this.getOldproname()
						.hashCode());
		result = 37 * result
				+ (getNewpro() == null ? 0 : this.getNewpro().hashCode());
		result = 37
				* result
				+ (getNewproname() == null ? 0 : this.getNewproname()
						.hashCode());
		result = 37 * result
				+ (getOldpost() == null ? 0 : this.getOldpost().hashCode());
		result = 37
				* result
				+ (getOldpostname() == null ? 0 : this.getOldpostname()
						.hashCode());
		result = 37 * result
				+ (getNewpost() == null ? 0 : this.getNewpost().hashCode());
		result = 37
				* result
				+ (getNewpostname() == null ? 0 : this.getNewpostname()
						.hashCode());
		result = 37 * result
				+ (getReason() == null ? 0 : this.getReason().hashCode());
		result = 37
				* result
				+ (getHandleruserid() == null ? 0 : this.getHandleruserid()
						.hashCode());
		result = 37 * result
				+ (getDemo() == null ? 0 : this.getDemo().hashCode());
		result = 37
				* result
				+ (getTransfertype() == null ? 0 : this.getTransfertype()
						.hashCode());
		result = 37 * result
				+ (getPid() == null ? 0 : this.getPid().hashCode());
		return result;
	}

	public String getHandlerusername() {
		return handlerusername;
	}

	public void setHandlerusername(String handlerusername) {
		this.handlerusername = handlerusername;
	}

	public String getPosttrasnstype() {
		return posttrasnstype;
	}

	public void setPosttrasnstype(String posttrasnstype) {
		this.posttrasnstype = posttrasnstype;
	}

}