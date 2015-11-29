package com.sgepit.pmis.gantt.Edo.util;
import java.util.Calendar;
import java.util.Date; 
import java.util.GregorianCalendar;
import java.text.SimpleDateFormat; 
import java.text.DateFormat; 
public class DateUtil {
	public static Calendar calendar = Calendar.getInstance();
	public static Date createDate(int year, int month, int date){
		calendar.set(year, month-1, date);
		return calendar.getTime();
	}
	public static String format(Date date){
		return DateUtil.getYear(date)+"-"+DateUtil.getMonth(date)+"-"+DateUtil.getDate(date)
				+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
	}
    /** 
     * 获取日期中的年 
     * @param date 日期 
     * @return 年份 
     */ 
    public static int getYear(Date date){
    	calendar.setTime(date);
    	return calendar.get(Calendar.YEAR);
    } 

    /** 
     * 获取日期中的月 
     * @param date 日期 
     * @return 月份 (1~12)
     */ 
    public static int getMonth(Date date){
    	calendar.setTime(date);
    	return calendar.get(Calendar.MONTH) + 1;
    } 
    /** 
     * 获取日期(月)
     * @param date 日期 
     * @return 天 
     */ 
    public static int getDate(Date date){         
    	calendar.setTime(date);    	 
    	int day = calendar.get(Calendar.DAY_OF_MONTH);    	    	               
        return day;
    } 
    /** 
     * 获取星期天 (1(星期日)~7(星期六)
     * @param date 日期 
     * @return 天 
     */ 
    public static int getDay(Date date){
    	calendar.setTime(date);
    	int day = calendar.get(Calendar.DAY_OF_WEEK);    	    	               
        return day;
    } 
    
    public static Date clearTime(Date date){    	
    	Date d = DateUtil.createDate(DateUtil.getYear(date), DateUtil.getMonth(date), DateUtil.getDate(date));
    	return d;
    }
    
    public static Date clone(Date date){
    	return new Date(date.getTime());
    }
    public static void setHour(Date date, double hour){    	
    	int m = Convert.doubleToInt(hour*60);    	
    	date.setHours(0);
    	date.setMinutes(m);
    }
}
