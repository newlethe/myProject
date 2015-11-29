package com.sgepit.pmis.sczb.hbm;

import java.io.Serializable;
import java.util.Date;

public class SczbZbjl implements Serializable {
	private String uids;// 主键
	private String jjbUids;// 交接班id
	private String content;// 值班记录内容
	private Date jlDate;// 记录的时间

	public String getUids() {
		return uids;
	}

	public void setUids(String uids) {
		this.uids = uids;
	}

	public String getJjbUids() {
		return jjbUids;
	}

	public void setJjbUids(String jjbUids) {
		this.jjbUids = jjbUids;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Date getJlDate() {
		return jlDate;
	}

	public void setJlDate(Date jlDate) {
		this.jlDate = jlDate;
	}
}
