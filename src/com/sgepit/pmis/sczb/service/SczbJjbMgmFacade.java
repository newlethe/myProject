package com.sgepit.pmis.sczb.service;

import com.sgepit.pmis.sczb.hbm.SczbJjb;

public interface SczbJjbMgmFacade {
	public void initJjb(String pid, String departId);// 初始化交接班中的基本数据和表
	
	public String getBcBy(String pid,String qx);//获得班次
	
	public String getZCBy(String pid,String qx);//获得值次
	
	public boolean initJjbTable(String pid, String departId,String qx);
	
	public void initMendJjb(String pid);
	
	public String isCanJb(String jbPerson,String getPerson,String pid,String qx,String bc_name,String rq);//判断是否可以交接班
	public void updateJjb(SczbJjb jjb);
	
	public Object getJJB(String pid);
	
	public void initJJBQuery(String pid,String beginTime,String endTime);
	
}
