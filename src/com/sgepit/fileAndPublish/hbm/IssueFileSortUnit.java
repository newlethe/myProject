package com.sgepit.fileAndPublish.hbm;



import java.util.Date;


/*
 * 下发分类已选择的下发单位表
 * author:shangtw
 * createtime:2012 6 19
 * */
public class IssueFileSortUnit implements java.io.Serializable {
		private String uids;
		private String sortid;
		private String unitid;
		private Long status;
		private Date pubtime;
		/** default constructor */
		public IssueFileSortUnit() {
		}  	
		public IssueFileSortUnit(String uids,String sortid,String unitid,Long status,Date pubtime) {
			this.uids=uids;
			this.sortid=sortid;
			this.unitid=unitid;
			this.status=status;
			this.pubtime=pubtime;
		} 
		public String getUids() {
			return uids;
		}
		public void setUids(String uids) {
			this.uids = uids;
		}
		public String getSortid() {
			return sortid;
		}
		public void setSortid(String sortid) {
			this.sortid = sortid;
		}
		public String getUnitid() {
			return unitid;
		}
		public void setUnitid(String unitid) {
			this.unitid = unitid;
		}
		public Long getStatus() {
			return status;
		}
		public void setStatus(Long status) {
			this.status = status;
		}
		public Date getPubtime() {
			return pubtime;
		}
		public void setPubtime(Date pubtime) {
			this.pubtime = pubtime;
		}
}
















