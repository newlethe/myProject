package com.sgepit.pmis.zlaq.hbm;

import java.util.Date;

/**
 * ZlaqFile entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class ZlaqFile implements java.io.Serializable {

	// Fields

	private String lsh;
	private String name;
	private String type;
	private String modelid;
	private String fileLsh;
	private String fileName;
	private String fileNr;
	private Long isCompress;
	private String author;
	private Long version;
	private String transFlag;
	private String transId;
	private String billState;
	private String memo;
	private String memoc1;
	private String memoc2;
	private String memoc3;
	private String memoc4;
	private String memoc5;
	private Long memon1;
	private Long memon2;
	private Long memon3;
	private Long memon4;
	private Long memon5;
	private Date memod1;
	private Date memod2;
	private Date memod3;

	// Constructors

	/** default constructor */
	public ZlaqFile() {
	}

	/** minimal constructor */
	public ZlaqFile(String lsh, String type, String fileLsh, String fileName,
			Long isCompress) {
		this.lsh = lsh;
		this.type = type;
		this.fileLsh = fileLsh;
		this.fileName = fileName;
		this.isCompress = isCompress;
	}

	/** full constructor */
	public ZlaqFile(String lsh, String name, String type, String modelid,
			String fileLsh, String fileName, String fileNr, Long isCompress,
			String author, Long version, String transFlag, String transId,
			String billState, String memo, String memoc1, String memoc2,
			String memoc3, String memoc4, String memoc5, Long memon1,
			Long memon2, Long memon3, Long memon4, Long memon5, Date memod1,
			Date memod2, Date memod3) {
		this.lsh = lsh;
		this.name = name;
		this.type = type;
		this.modelid = modelid;
		this.fileLsh = fileLsh;
		this.fileName = fileName;
		this.fileNr = fileNr;
		this.isCompress = isCompress;
		this.author = author;
		this.version = version;
		this.transFlag = transFlag;
		this.transId = transId;
		this.billState = billState;
		this.memo = memo;
		this.memoc1 = memoc1;
		this.memoc2 = memoc2;
		this.memoc3 = memoc3;
		this.memoc4 = memoc4;
		this.memoc5 = memoc5;
		this.memon1 = memon1;
		this.memon2 = memon2;
		this.memon3 = memon3;
		this.memon4 = memon4;
		this.memon5 = memon5;
		this.memod1 = memod1;
		this.memod2 = memod2;
		this.memod3 = memod3;
	}

	// Property accessors

	public String getLsh() {
		return this.lsh;
	}

	public void setLsh(String lsh) {
		this.lsh = lsh;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getModelid() {
		return this.modelid;
	}

	public void setModelid(String modelid) {
		this.modelid = modelid;
	}

	public String getFileLsh() {
		return this.fileLsh;
	}

	public void setFileLsh(String fileLsh) {
		this.fileLsh = fileLsh;
	}

	public String getFileName() {
		return this.fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFileNr() {
		return this.fileNr;
	}

	public void setFileNr(String fileNr) {
		this.fileNr = fileNr;
	}

	public Long getIsCompress() {
		return this.isCompress;
	}

	public void setIsCompress(Long isCompress) {
		this.isCompress = isCompress;
	}

	public String getAuthor() {
		return this.author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public Long getVersion() {
		return this.version;
	}

	public void setVersion(Long version) {
		this.version = version;
	}

	public String getTransFlag() {
		return this.transFlag;
	}

	public void setTransFlag(String transFlag) {
		this.transFlag = transFlag;
	}

	public String getTransId() {
		return this.transId;
	}

	public void setTransId(String transId) {
		this.transId = transId;
	}

	public String getBillState() {
		return this.billState;
	}

	public void setBillState(String billState) {
		this.billState = billState;
	}

	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getMemoc1() {
		return this.memoc1;
	}

	public void setMemoc1(String memoc1) {
		this.memoc1 = memoc1;
	}

	public String getMemoc2() {
		return this.memoc2;
	}

	public void setMemoc2(String memoc2) {
		this.memoc2 = memoc2;
	}

	public String getMemoc3() {
		return this.memoc3;
	}

	public void setMemoc3(String memoc3) {
		this.memoc3 = memoc3;
	}

	public String getMemoc4() {
		return this.memoc4;
	}

	public void setMemoc4(String memoc4) {
		this.memoc4 = memoc4;
	}

	public String getMemoc5() {
		return this.memoc5;
	}

	public void setMemoc5(String memoc5) {
		this.memoc5 = memoc5;
	}

	public Long getMemon1() {
		return this.memon1;
	}

	public void setMemon1(Long memon1) {
		this.memon1 = memon1;
	}

	public Long getMemon2() {
		return this.memon2;
	}

	public void setMemon2(Long memon2) {
		this.memon2 = memon2;
	}

	public Long getMemon3() {
		return this.memon3;
	}

	public void setMemon3(Long memon3) {
		this.memon3 = memon3;
	}

	public Long getMemon4() {
		return this.memon4;
	}

	public void setMemon4(Long memon4) {
		this.memon4 = memon4;
	}

	public Long getMemon5() {
		return this.memon5;
	}

	public void setMemon5(Long memon5) {
		this.memon5 = memon5;
	}

	public Date getMemod1() {
		return this.memod1;
	}

	public void setMemod1(Date memod1) {
		this.memod1 = memod1;
	}

	public Date getMemod2() {
		return this.memod2;
	}

	public void setMemod2(Date memod2) {
		this.memod2 = memod2;
	}

	public Date getMemod3() {
		return this.memod3;
	}

	public void setMemod3(Date memod3) {
		this.memod3 = memod3;
	}

}