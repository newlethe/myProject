package com.sgepit.pmis.document.hbm;


public class ZlInfoBlobList implements java.io.Serializable {

	// Fields

	private String uids;
	private String infoid;
	private String blobTableName;
	private String filelsh;
	
	
	public ZlInfoBlobList() {
		super();
	}
		
	public ZlInfoBlobList(String infoid, String blobTableName,
			String filelsh) {
		super();
		this.infoid = infoid;
		this.blobTableName = blobTableName;
		this.filelsh = filelsh;
	}
	
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getInfoid() {
		return infoid;
	}
	public void setInfoid(String infoid) {
		this.infoid = infoid;
	}
	public String getBlobTableName() {
		return blobTableName;
	}
	public void setBlobTableName(String blobTableName) {
		this.blobTableName = blobTableName;
	}
	public String getFilelsh() {
		return filelsh;
	}
	public void setFilelsh(String filelsh) {
		this.filelsh = filelsh;
	}

	
}