package com.sgepit.pmis.wzgl.hbm;

public class WzGoodsArrivalSmsUser {
	   private String uids;
	   private String userid;
	   private String arrivalid;
	   private String issend;
	   
	   public WzGoodsArrivalSmsUser(){}
	   public WzGoodsArrivalSmsUser(String uids,String userid,String arrivalid,String issend){
		      this.uids = uids;
		      this.userid = userid;
		      this.arrivalid = arrivalid;
		      this.issend  = issend;
	   }
		public String getUids() {
			return uids;
		}
		public void setUids(String uids) {
			this.uids = uids;
		}
		public String getUserid() {
			return userid;
		}
		public void setUserid(String userid) {
			this.userid = userid;
		}
		public String getArrivalid() {
			return arrivalid;
		}
		public void setArrivalid(String arrivalid) {
			this.arrivalid = arrivalid;
		}
		public String getIssend() {
			return issend;
		}
		public void setIssend(String issend) {
			this.issend = issend;
		}
}
