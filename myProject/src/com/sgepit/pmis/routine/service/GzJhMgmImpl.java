package com.sgepit.pmis.routine.service;



import java.util.Date;
import java.util.List;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.BusinessException;

import com.sgepit.frame.base.service.BaseMgmImpl;

import com.sgepit.pmis.routine.dao.GzJhDAO;

import com.sgepit.pmis.routine.hbm.GzJh;
import com.sgepit.pmis.routine.hbm.GzMonthReport;
import com.sgepit.pmis.routine.hbm.GzMonthReportList;
import com.sgepit.pmis.routine.hbm.GzWeekReport;
import com.sgepit.pmis.routine.hbm.GzWeekReportList;



public class GzJhMgmImpl extends BaseMgmImpl implements GzJhMgmFacade {

	
	private BusinessException businessException;

	public static GzJhMgmImpl getFromApplicationContext(
			ApplicationContext ctx) {
		
		return (GzJhMgmImpl) ctx.getBean("gzJhMgm");
	}
	

	private GzJhDAO gzJhDao;
	
	public void setGzJhDao(GzJhDAO gzJhDao) {
		this.gzJhDao = gzJhDao;
	}

	public String addOrUpdateGzJh(GzJh gzjh) {
		String flag = "0";
		System.out.print(gzjh.getUids());
		try{
			if("".equals(gzjh.getUids())||gzjh.getUids()==null){//新增
				/*if ("Thu Jan 01 08:00:00 CST 1970".equals(cjspb.getPzrq().toString())){
					cjspb.setPzrq(null);
				}*/
				this.gzJhDao.insert(gzjh);
				flag="1";
			}else{//修改
				this.gzJhDao.saveOrUpdate(gzjh);
				flag = "2";
			}
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		System.out.print(flag);
		return flag;
	}
	
	//------------周报
	
	//2010-11-9 zhangh 添加或者修改部门工作周报
	public String addOrUpdateWeekReport(GzWeekReport gzWeekReport){
		String flag = "0";
		try{
			if("".equals(gzWeekReport.getUuid())||gzWeekReport.getUuid()==null){//新增
				this.gzJhDao.insert(gzWeekReport);
				flag = "1";
			}else{//修改
				this.gzJhDao.saveOrUpdate(gzWeekReport);
				flag = "2";
			}
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		System.out.print(flag);
		return flag;
	}
	//2010-11-10 zhangh 删除周报
	public void deleteWeekReport(String beanName,String beanCont,String uuid) {
		GzWeekReport gzWeekReport = (GzWeekReport) this.gzJhDao.findById(beanName, uuid);
		List<GzWeekReportList> list = this.gzJhDao.findByProperty(beanCont, "reportuuid", uuid); 
		this.gzJhDao.deleteAll(list);
		this.gzJhDao.delete(gzWeekReport);
	}
		
	//2010-11-9 zhangh 添加或者修改部门工作周报内容
	public String addOrUpdateWeekReportList(GzWeekReportList gzWeekReportList){
		String flag = "0";
		System.out.print(gzWeekReportList.getUuid());
		try{
			if("".equals(gzWeekReportList.getUuid())||gzWeekReportList.getUuid()==null){//新增
				this.gzJhDao.insert(gzWeekReportList);
				flag = "1";
			}else{//修改
				this.gzJhDao.saveOrUpdate(gzWeekReportList);
				flag = "2";
			}
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		System.out.print(flag);
		return flag;
	}
	
	//2010-11-10 zhangh 删除周报内容
	public void deleteWeekReportList(String beanCont,String uuid) {
		GzWeekReportList gzWeekReportList = (GzWeekReportList) this.gzJhDao.findById(beanCont, uuid);
		this.gzJhDao.delete(gzWeekReportList);
	}
	
	//2010-11-10 zhang 通过updateBySQL修改记录状态
	public Integer hzReportWeek(String ids,GzWeekReport gzWeekReport){
		//修改周报计划状态
		Integer i = 0;
		i = this.gzJhDao.updateBySQL("update gz_week_report set planstate='1' where uuid in ("+ids+")");
		this.gzJhDao.updateBySQL("update gz_week_report_list set remove='1' where reportuuid in ("+ids+")");
		//增加或者更新公司汇总
		String beanName = gzWeekReport.getClass().getName();
		String where = "reportweek='"+gzWeekReport.getReportweek()+"' and recordstate='1'";
		List<GzWeekReport> list = this.gzJhDao.findByWhere(beanName, where);
		
		if(list.size()>0){
			GzWeekReport report = list.get(0);
			report.setReporttime(new Date());
			this.gzJhDao.saveOrUpdate(report);
		}else{
			gzWeekReport.setReporttime(new Date());
			this.gzJhDao.insert(gzWeekReport);
		}		
		return i;
	} 	
	
	//------------月报
	
	//2010-11-16 zhangh 添加或者修改部门工作月报
	public String addOrUpdateMonthReport(GzMonthReport gzMonthReport){
		String flag = "0";
		try{
			if("".equals(gzMonthReport.getUuid())||gzMonthReport.getUuid()==null){//新增
				this.gzJhDao.insert(gzMonthReport);
				flag = "1";
			}else{//修改
				this.gzJhDao.saveOrUpdate(gzMonthReport);
				flag = "2";
			}
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		System.out.print(flag);
		return flag;
	}
	
	//2010-11-16 zhangh 删除月报
	public void deleteMonthReport(String beanName,String beanCont,String uuid) {
		GzMonthReport gzMonthReport = (GzMonthReport) this.gzJhDao.findById(beanName, uuid);
		List<GzWeekReportList> list = this.gzJhDao.findByProperty(beanCont, "reportuuid", uuid); 
		this.gzJhDao.deleteAll(list);
		this.gzJhDao.delete(gzMonthReport);
	}

	//2010-11-16 zhangh 添加或者修改部门工作周报内容
	public String addOrUpdateMonthReportList(GzMonthReportList gzMonthReportList) {
		String flag = "0";
		System.out.print(gzMonthReportList.getUuid());
		try{
			if("".equals(gzMonthReportList.getUuid())||gzMonthReportList.getUuid()==null){//新增
				this.gzJhDao.insert(gzMonthReportList);
				flag = "1";
			}else{//修改
				this.gzJhDao.saveOrUpdate(gzMonthReportList);
				flag = "2";
			}
		} catch (Exception e) {
			flag = "0";
			e.printStackTrace();
			return flag;
		}
		System.out.print(flag);
		return flag;
	}

	//2010-11-16 zhangh 删除月报内容
	public void deleteMonthReportList(String beanCont, String uuid) {
		GzMonthReportList gzMonthReportList = (GzMonthReportList) this.gzJhDao.findById(beanCont, uuid);
		this.gzJhDao.delete(gzMonthReportList);
	}
	
	//2010-11-16 zhangh 通过updateBySQL修改记录状态
	public Integer hzReportMonth(String ids,GzMonthReport gzMonthReport){
		//修改周报计划状态
		Integer i = 0;
		i = this.gzJhDao.updateBySQL("update gz_month_report set planstate='1' where uuid in ("+ids+")");
		this.gzJhDao.updateBySQL("update gz_month_report_list set remove='1' where reportuuid in ("+ids+")");
		//增加或者更新公司汇总
		String beanName = gzMonthReport.getClass().getName();
		String where = "reportmonth='"+gzMonthReport.getReportmonth()+"' and recordstate='1'";
		List<GzMonthReport> list = this.gzJhDao.findByWhere(beanName, where);
		
		if(list.size()>0){
			GzMonthReport report = list.get(0);
			report.setReporttime(new Date());
			this.gzJhDao.saveOrUpdate(report);
		}else{
			gzMonthReport.setReporttime(new Date());
			this.gzJhDao.insert(gzMonthReport);
		}		
		return i;
	} 	
	
	
}
