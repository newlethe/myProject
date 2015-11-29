/**
 * 
 */
package com.sgepit.pmis.INFManage.hbm;

/**
 * @author lixiaob
 *
 */
public class ObjDaml implements java.io.Serializable {

	private String fileid;//附件资料id对应表 uuid 
	private String cid;//附件对象
	private String runningnumber;//资料档案对应id
	/**
	 * @return the fileid
	 */
	public String getFileid() {
		return fileid;
	}
	/**
	 * @param fileid the fileid to set
	 */
	public void setFileid(String fileid) {
		this.fileid = fileid;
	}
	/**
	 * @return the cid
	 */
	public String getCid() {
		return cid;
	}
	/**
	 * @param cid the cid to set
	 */
	public void setCid(String cid) {
		this.cid = cid;
	}
	/**
	 * @return the runningnumber
	 */
	public String getRunningnumber() {
		return runningnumber;
	}
	/**
	 * @param runningnumber the runningnumber to set
	 */
	public void setRunningnumber(String runningnumber) {
		this.runningnumber = runningnumber;
	}
}
