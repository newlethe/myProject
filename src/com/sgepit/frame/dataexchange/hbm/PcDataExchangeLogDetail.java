package com.sgepit.frame.dataexchange.hbm;

public class PcDataExchangeLogDetail {
	
	private String uids;
	private String txGroupId;
	private String sqlData;
	private String errorMessage;
	private String logId;
	public String getLogId() {
		return logId;
	}
	public void setLogId(String logId) {
		this.logId = logId;
	}
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	
	public String getSqlData() {
		return sqlData;
	}
	public void setSqlData(String sqlData) {
		this.sqlData = sqlData;
	}
	public String getErrorMessage() {
		return errorMessage;
	}
	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
	public String getTxGroupId() {
		return txGroupId;
	}
	public void setTxGroupId(String txGroupId) {
		this.txGroupId = txGroupId;
	}

}
