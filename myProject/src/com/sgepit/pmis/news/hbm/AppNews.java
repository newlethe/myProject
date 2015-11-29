package com.sgepit.pmis.news.hbm;

import java.util.Date;


/*
 * 国锦首页新闻表
 * author:shangtw
 * createtime:2012 5 25
 * */
public class AppNews implements java.io.Serializable {
	private String uids;
	private String title;
	private String content;
	private String picture;
	private Date createtime;
    private String author;
    private Long status;
    private Date pubtime;
    private String pubperson;
    private String pid;
    private String newsclass;
    
    //extends
   private String fileSuffix;
   private String fileName;
	/** default constructor */
	public AppNews() {
	}   
    
	public String getUids() {
		return uids;
	}
	public void setUids(String uids) {
		this.uids = uids;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getPicture() {
		return picture;
	}
	public void setPicture(String picture) {
		this.picture = picture;
	}
	public Date getCreatetime() {
		return createtime;
	}
	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}
	public String getAuthor() {
		return author;
	}
	public void setAuthor(String author) {
		this.author = author;
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
	public String getPubperson() {
		return pubperson;
	}
	public void setPubperson(String pubperson) {
		this.pubperson = pubperson;
	}
	public AppNews(String uids, String title, String content, String picture,
			Date createtime, String author, Long status, Date pubtime,
			String pubperson,String pid,String fileSuffix,String fileName) {
		super();
		this.uids = uids;
		this.title = title;
		this.content = content;
		this.picture = picture;
		this.createtime = createtime;
		this.author = author;
		this.status = status;
		this.pubtime = pubtime;
		this.pubperson = pubperson;
		this.pid=pid;
		this.fileSuffix=fileSuffix;
		this.fileName=fileName;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getFileSuffix() {
		return fileSuffix;
	}

	public void setFileSuffix(String fileSuffix) {
		this.fileSuffix = fileSuffix;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getNewsclass() {
		return newsclass;
	}

	public void setNewsclass(String newsclass) {
		this.newsclass = newsclass;
	}
}
















