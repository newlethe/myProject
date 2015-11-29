package com.sgepit.frame.util;

import java.text.DateFormat;
import java.text.DateFormatSymbols;
import java.text.SimpleDateFormat;
import java.util.*;
/**
 * 用于处理日期格式的工具类
 * 
 *
 */
public class DateUtil
{

    public DateUtil()
    {
    }
/**
 * 获取当前系统日期
 * @return 返回当前系统时间,精确到日.
 */
    public static Date getSystemDate()
    {
        Calendar cal = Calendar.getInstance();
        cal.set(11, 0);
        cal.set(12, 0);
        cal.set(13, 0);
        cal.set(14, 0);
        Date d = new Date(cal.getTimeInMillis());
        return d;
    }
/**
 * 获取当前系统时间
 * @return 返回当前系统时间,精确到毫秒
 */
    public static Date getSystemDateTime()
    {
        Calendar cal = Calendar.getInstance();
        Date d = new Date(cal.getTimeInMillis());
        return d;
    }
/**
 * 获取当前系统时间,返回指定格式的时间字符串
 * @param format 格式参数
 * @return
 */
    public static String getSystemDateTimeStr(String format)
    {
        Calendar cal = Calendar.getInstance();
        Date d = new Date(cal.getTimeInMillis());
        String str = "";
        try
        {
            DateFormat dateFormat = new SimpleDateFormat(format, Locale.ENGLISH);
            dateFormat.setLenient(false);
            str = dateFormat.format(d);
        }
        catch(Exception e)
        {
            DateFormat dateFormat = new SimpleDateFormat(DateTimeFormat, Locale.ENGLISH);
            dateFormat.setLenient(false);
            str = dateFormat.format(d);
        }
        return str;
    }
    /**
     * 将传入的Date类型的参数格式化为指定格式的日期字符串
     * @param d 传入的日期参数
     * @param format 指定的日期格式
     * @return 返回日期格式字符串
     */
    public static String getDateTimeStr(Date d, String format)
    {

        String str = "";
        try
        {
            DateFormat dateFormat = new SimpleDateFormat(format, Locale.ENGLISH);
            dateFormat.setLenient(false);
            str = dateFormat.format(d);
        }
        catch(Exception e)
        {
            DateFormat dateFormat = new SimpleDateFormat(DateTimeFormat, Locale.ENGLISH);
            dateFormat.setLenient(false);
            str = dateFormat.format(d);
        }
        return str;
    }
    /**
     * 获取当前系统时间的星期数
     * @return
     */
    public static String getLocaleDayOfWeek(){
    	Locale usersLocale = Locale.getDefault();
        DateFormatSymbols dfs = new DateFormatSymbols(usersLocale);
        String weekdays[] = dfs.getWeekdays();
        return weekdays[Calendar.getInstance().get(Calendar.DAY_OF_WEEK)];
    }
    private static String DateTimeFormat = "yyyy-MM-dd";

}
