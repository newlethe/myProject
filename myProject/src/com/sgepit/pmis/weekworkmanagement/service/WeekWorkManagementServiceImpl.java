/**
 * 
 */
package com.sgepit.pmis.weekworkmanagement.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import com.sgepit.pmis.weekworkmanagement.dao.WeekWorkManagementDAO;
import com.sgepit.pmis.weekworkmanagement.hbm.WeekworkManagementM;
import com.sgepit.pmis.weekworkmanagement.util.WeekUtil;

/**
 * @author qiupy 2013-5-3 
 *
 */
public class WeekWorkManagementServiceImpl implements WeekWorkManagementService {

	private WeekWorkManagementDAO weekWorkManagementDAO;

	public WeekWorkManagementDAO getWeekWorkManagementDAO() {
		return weekWorkManagementDAO;
	}

	public void setWeekWorkManagementDAO(WeekWorkManagementDAO weekWorkManagementDAO) {
		this.weekWorkManagementDAO = weekWorkManagementDAO;
	}
	public String getUuidValue() {
		return getUUID().replaceAll("-", "");
	}
	/**
	 * 返回随机主键36位（带'-'号）
	 * @return
	 */
	public static String getUUID(){
		return java.util.UUID.randomUUID().toString();
	}
	public String getWeekPeriod(){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date currentDate=new Date();
		int currentYear=currentDate.getYear()+ 1900;
		StringBuffer sb=new StringBuffer("[");
		for(int year=2013;year<currentYear;year++){
			int totalWeek=WeekUtil.getMaxWeekNumOfYear(year);
			for(int week=1;week<totalWeek;week++){
				Date firstDayOfWeek=WeekUtil.getFirstDayOfWeek(year,week);
				Date lastDayOfWeek=WeekUtil.getLastDayOfWeek(year,week);
				sb.append("['").append(year+""+week+"','").append(sdf.format(firstDayOfWeek)).append("~").append(sdf.format(lastDayOfWeek)).append("'],");
			}
		}
		int currentWeekPeriod=WeekUtil.getWeekOfYear(currentDate);
		int totalWeekPeriod=WeekUtil.getMaxWeekNumOfYear(currentYear);
		for(int week=1;week<currentWeekPeriod+3;week++){
			Date firstDayOfWeek=WeekUtil.getFirstDayOfWeek(currentYear,week);
			Date lastDayOfWeek=WeekUtil.getLastDayOfWeek(currentYear,week);
			sb.append("['").append(currentYear+""+week+"','").append(sdf.format(firstDayOfWeek)).append("~").append(sdf.format(lastDayOfWeek)).append("'],");
		}
		String arr=sb.substring(0,sb.length()-1)+"]";
		return arr;
	}
	/**
	 * 
	 */
	public WeekworkManagementM getCurrentWeekPeriod(String pid,String professional){
        List<WeekworkManagementM> list=this.weekWorkManagementDAO.findByWhere(WeekworkManagementM.class.getName(), "pid='"+pid+"' and professionalId='"+professional+"' order by weekPeriod desc");
		if(list!=null&&list.size()>0){
			WeekworkManagementM weekWork=list.get(0);
			return weekWork;
		}
        return null;
	}
	/**
	 * 取得本周次最近的周次
	 */
	public WeekworkManagementM getLastWeekPeriod(String pid,String professional,String currentWeekPeriod){
        List<WeekworkManagementM> list=this.weekWorkManagementDAO.findByWhere(WeekworkManagementM.class.getName(), "pid='"+pid+"' and professionalId='"+professional+"' and weekPeriod<"+currentWeekPeriod+" order by weekPeriod desc");
		if(list!=null&&list.size()>0){
			WeekworkManagementM weekWork=list.get(0);
			return weekWork;
		}
        return null;
	}
}
