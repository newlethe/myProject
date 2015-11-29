package com.sgepit.pcmis.zlgk.hbm;
/**
 * @version 质量验评分类维护
 * @author yanglh
 * @date 2013-6-3
 */
public class PcZlgkZlypTree implements java.io.Serializable{
	private String uuid;
	private String engineerName;
	private String engineerNo;
	private String engineerType;
	private String parentNo;
	private Long isleaf;
	private String memo;
	private String pid;
	private String treeId;
	private String parentId;
	
	
	public PcZlgkZlypTree(){
		super();
	};
	
	public PcZlgkZlypTree(String uuid,String engineerName,String engineerNo,
				String engineerType,String parentNo,Long isleaf,String memo,
				String pid,String treeId,String parentId){
		this.uuid = uuid;
		this.engineerName = engineerName;
		this.engineerNo = engineerNo;
		this.engineerType =engineerType;
		this.parentNo = parentNo;
		this.isleaf = isleaf;
		this.memo = memo;
		this.pid = pid;
		this.treeId = treeId;
		this.parentId = parentId;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	public String getEngineerName() {
		return engineerName;
	}

	public void setEngineerName(String engineerName) {
		this.engineerName = engineerName;
	}

	public String getEngineerNo() {
		return engineerNo;
	}

	public void setEngineerNo(String engineerNo) {
		this.engineerNo = engineerNo;
	}

	public String getEngineerType() {
		return engineerType;
	}

	public void setEngineerType(String engineerType) {
		this.engineerType = engineerType;
	}

	public String getParentNo() {
		return parentNo;
	}

	public void setParentNo(String parentNo) {
		this.parentNo = parentNo;
	}

	public Long getIsleaf() {
		return isleaf;
	}

	public void setIsleaf(Long isleaf) {
		this.isleaf = isleaf;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getTreeId() {
		return treeId;
	}

	public void setTreeId(String treeId) {
		this.treeId = treeId;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
}
