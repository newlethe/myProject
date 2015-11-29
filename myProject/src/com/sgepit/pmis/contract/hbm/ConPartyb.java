package com.sgepit.pmis.contract.hbm;

/**
 * ConPartyb entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ConPartyb implements java.io.Serializable {

	// Fields

	private String cpid;
	private String pid;
	private String partybno;
	private String partyb;
	private String partybshort;
	private String partyblawer;
	private String partybbank;
	private String partybbankno;
	private String address;
	private String postalcode;
	private String phoneno;
	private String email;
	private String homepage;
	private String brief;
	private String linkman;
	private String fax;

	// Constructors

	/** default constructor */
	public ConPartyb() {
	}

	/** minimal constructor */
	public ConPartyb(String cpid, String pid) {
		this.cpid = cpid;
		this.pid = pid;
	}

	/** full constructor */
	public ConPartyb(String cpid, String pid, String partybno, String partyb,
			String partybshort, String partyblawer, String partybbank,
			String partybbankno, String address, String postalcode,
			String phoneno, String email, String homepage, String brief, String linkman, String fax) {
		this.cpid = cpid;
		this.pid = pid;
		this.partybno = partybno;
		this.partyb = partyb;
		this.partybshort = partybshort;
		this.partyblawer = partyblawer;
		this.partybbank = partybbank;
		this.partybbankno = partybbankno;
		this.address = address;
		this.postalcode = postalcode;
		this.phoneno = phoneno;
		this.email = email;
		this.homepage = homepage;
		this.brief = brief;
		this.linkman = linkman;
		this.fax = fax;
	}

	// Property accessors

	public String getCpid() {
		return this.cpid;
	}

	public void setCpid(String cpid) {
		this.cpid = cpid;
	}

	public String getPid() {
		return this.pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getPartybno() {
		return this.partybno;
	}

	public void setPartybno(String partybno) {
		this.partybno = partybno;
	}

	public String getPartyb() {
		return this.partyb;
	}

	public void setPartyb(String partyb) {
		this.partyb = partyb;
	}

	public String getPartybshort() {
		return this.partybshort;
	}

	public void setPartybshort(String partybshort) {
		this.partybshort = partybshort;
	}

	public String getPartyblawer() {
		return this.partyblawer;
	}

	public void setPartyblawer(String partyblawer) {
		this.partyblawer = partyblawer;
	}

	public String getPartybbank() {
		return this.partybbank;
	}

	public void setPartybbank(String partybbank) {
		this.partybbank = partybbank;
	}

	public String getPartybbankno() {
		return this.partybbankno;
	}

	public void setPartybbankno(String partybbankno) {
		this.partybbankno = partybbankno;
	}

	public String getAddress() {
		return this.address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPostalcode() {
		return this.postalcode;
	}

	public void setPostalcode(String postalcode) {
		this.postalcode = postalcode;
	}

	public String getPhoneno() {
		return this.phoneno;
	}

	public void setPhoneno(String phoneno) {
		this.phoneno = phoneno;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getHomepage() {
		return this.homepage;
	}

	public void setHomepage(String homepage) {
		this.homepage = homepage;
	}

	public String getBrief() {
		return this.brief;
	}

	public void setBrief(String brief) {
		this.brief = brief;
	}

	public String getLinkman() {
		return linkman;
	}

	public void setLinkman(String linkman) {
		this.linkman = linkman;
	}

	public String getFax() {
		return fax;
	}

	public void setFax(String fax) {
		this.fax = fax;
	}

}