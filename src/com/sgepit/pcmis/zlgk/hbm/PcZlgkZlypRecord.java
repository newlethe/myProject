package com.sgepit.pcmis.zlgk.hbm;
/**
 * @author yangl 2013-6-20
 * 质量验评记录管理
 *
 */
import java.util.Date;

public class PcZlgkZlypRecord implements java.io.Serializable {

	private String uuid;
	private String treeUuid;
	private String fileNo;
	private String fileName;
	private String filelsh;
	private String checkLevel;
	private String checkResult;
	private Date   checkDate;
	private String billstategl;
	private String billstatesp;
	private String billstatecx;
	private String unit;
	private String createMan;
	private String createManId;
	private String approvalMan;
	private String pid;
	private String memo;
	private String backMan;
	
	public PcZlgkZlypRecord(){
		
	}
	
	public PcZlgkZlypRecord(String uuid) {
		this.uuid = uuid;
	}
	
	public PcZlgkZlypRecord(String uuid,String treeUuid,String fileNo,String fileName,String filelsh,
	                String checkLevel,String checkResult,Date   checkDate,String billstategl,
	                String unit,String createMan,String createManId,String pid,String memo,
	                String approvalMan,String backMan,String billstatesp,String billstatecx){
			this.uuid = uuid;
			this.treeUuid = treeUuid;
			this.fileNo = fileNo;
			this.fileName = fileName;
			this.filelsh = filelsh;
			this.checkLevel = checkLevel;
			this.checkResult = checkResult;
			this.checkDate = checkDate;
			this.billstategl = billstategl;
			this.unit = unit;
			this.createMan = createMan;
			this.createManId = createManId;
			this.pid = pid;
			this.memo = memo;
			this.approvalMan = approvalMan;
			this.backMan = backMan;
			this.billstatesp = billstatesp;
			this.billstatecx = billstatecx;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getTreeUuid() {
		return treeUuid;
	}

	public void setTreeUuid(String treeUuid) {
		this.treeUuid = treeUuid;
	}

	public String getFileNo() {
		return fileNo;
	}

	public void setFileNo(String fileNo) {
		this.fileNo = fileNo;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFilelsh() {
		return filelsh;
	}

	public void setFilelsh(String filelsh) {
		this.filelsh = filelsh;
	}

	public String getCheckLevel() {
		return checkLevel;
	}

	public void setCheckLevel(String checkLevel) {
		this.checkLevel = checkLevel;
	}

	public String getCheckResult() {
		return checkResult;
	}

	public void setCheckResult(String checkResult) {
		this.checkResult = checkResult;
	}

	public Date getCheckDate() {
		return checkDate;
	}

	public void setCheckDate(Date checkDate) {
		this.checkDate = checkDate;
	}

	public String getBillstategl() {
		return billstategl;
	}

	public void setBillstategl(String billstategl) {
		this.billstategl = billstategl;
	}

	public String getBillstatesp() {
		return billstatesp;
	}

	public void setBillstatesp(String billstatesp) {
		this.billstatesp = billstatesp;
	}

	public String getBillstatecx() {
		return billstatecx;
	}

	public void setBillstatecx(String billstatecx) {
		this.billstatecx = billstatecx;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public String getCreateMan() {
		return createMan;
	}

	public void setCreateMan(String createMan) {
		this.createMan = createMan;
	}

	public String getCreateManId() {
		return createManId;
	}

	public void setCreateManId(String createManId) {
		this.createManId = createManId;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getApprovalMan() {
		return approvalMan;
	}

	public void setApprovalMan(String approvalMan) {
		this.approvalMan = approvalMan;
	}

	public String getBackMan() {
		return backMan;
	}

	public void setBackMan(String backMan) {
		this.backMan = backMan;
	}
	
}
