package com.sgepit.pmis.routine.service;

import java.sql.SQLException;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.budget.hbm.BdgMoneyApp;
import com.sgepit.pmis.budget.hbm.BdgMonthMoneyPlan;
import com.sgepit.pmis.routine.hbm.GzJh;
import com.sgepit.pmis.routine.hbm.GzMonthReport;
import com.sgepit.pmis.routine.hbm.GzMonthReportList;
import com.sgepit.pmis.routine.hbm.GzWeekReport;
import com.sgepit.pmis.routine.hbm.GzWeekReportList;



/**
 * @GzJhZjFacade 工作计划总结- 业务逻辑接口
 * @author Louj
 */
public interface GzJhMgmFacade {
	
	/*
	 * 工作计划汇报
	 */
	public String addOrUpdateGzJh(GzJh gzjh);
		
	//2010-11-9 zhangh 添加或者修改部门工作周报
	public String addOrUpdateWeekReport(GzWeekReport gzWeekReport);
	public String addOrUpdateWeekReportList(GzWeekReportList gzWeekReportList);
	//2010-11-10 zhangh 删除周报
	public void deleteWeekReport(String beanName,String beanCont,String uuid);
	public void deleteWeekReportList(String beanCont,String uuid);
	//2010-11-10 zhang 通过updateBySQL修改记录状态
	public Integer hzReportWeek(String ids,GzWeekReport gzWeekReport);
	
	//2010-11-16 zhangh 添加或者修改部门工作月报
	public String addOrUpdateMonthReport(GzMonthReport gzMonthReport);
	public String addOrUpdateMonthReportList(GzMonthReportList gzMonthReportList);
	//2010-11-10 zhangh 删除周报
	public void deleteMonthReport(String beanName,String beanCont,String uuid);
	public void deleteMonthReportList(String beanCont,String uuid);
	
	public Integer hzReportMonth(String ids,GzMonthReport gzMonthReport);
}
