/** 
 * Title:       字符串应用: 
 * Description:  字符串处理应用
 * Company:      sgepit
 */
package com.sgepit.helps.util;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * 字符串处理应用
 * @author lizp
 * @Date 2010-8-11
 */
public class StringUtil {
	/**
	 * 字符串数组转换成list对象
	 * @param s 字符数组
	 * @return
	 */
	public static List<String> arrayToList(String[] s) {
		List<String> list = new ArrayList<String>() ;
		for(String key : s) {
			list.add(key) ;
		}
		return list ;
	}
	
	/**
	 * 将对象转化成字符串
	 * 为null时返回null，其它用对象自带的toString()方法转换
	 * @param obj
	 * @return
	 */
	public static String objectToString(Object obj){
		if(obj==null) {
			return null;
		} else {
			return obj.toString() ;
		}
	}
	public static String getUUID(){
		return UUID.randomUUID().toString() ;
	}
	public static String getAllUUID(){
		return UUID.randomUUID().toString() ;
	}
	
	/**
	 * 将对象转化成int型
	 * @param obj
	 * @return 转化失败时为0
	 */
	public static int objectToInt(Object obj){
		int i = 0 ;
		if(obj!=null) {
			try {
				i = Integer.parseInt(objectToString(obj)) ;
			} catch (NumberFormatException e) {
			}
		}
		return i ;
	}
	
	/**
	 * 对象转化为boolean型
	 * @param obj
	 * @return 对象为空返回false，对象为0或者false返回为false，其它为true
	 */
	public static boolean objectToBoolean(Object obj){
		String value = objectToString(obj) ;
		if(value==null) {
			return false ;
		} else {
			if(value.equals("0")||value.equalsIgnoreCase("false")) {
				return false ;
			} else {
				return true ;
			}
		}
	}
	
	
	/**
	 * 对象转换成java.sql.Date
	 * 对象会强制转换成java.util.Date
	 * @param obj java.util.Date对象
	 * @return 转换失败返回null
	 */
	public static java.sql.Date objectToDate(Object obj){
		java.sql.Date date = null;
		if(obj!=null) {
			try {
				java.util.Date d = (java.util.Date)obj;
				date = utilDateToSqlDate(d);
			} catch (RuntimeException e) {
			}
		}
		return date;
	}
	
	/**
	 * 对象(java.util.Date)转换成java.sql.Date
	 * @param date java.util.Date对象
	 * @return
	 */
	public static java.sql.Date utilDateToSqlDate(java.util.Date date){
		if(date!=null) {
			return new java.sql.Date(date.getTime()) ;
		} else {
			return null ;
		}
	}
	
	/**
	 * 字符串转换成java.sql.Date
	 * 字符串格式为yyyy-mm-dd
	 * @param str 日期字符串
	 * @return
	 */
	public static java.sql.Date stringToDate(String str){
		return stringToDate(str,"yyyy-mm-dd") ;
	}
	
	/**
	 * 按照格式要求转换字符串为java.sql.Date
	 * @param str 待转换字符串
	 * @param simpleFormat 字符串格式表达式，如yyyy-mm-dd
	 * @return
	 */
	public static java.sql.Date stringToDate(String str,String simpleFormat){
		if(str==null) {
			return null ;
		} else {
			SimpleDateFormat dformat = new SimpleDateFormat(simpleFormat);
			java.util.Date date = null ;
			try {
				date = dformat.parse(str);
			} catch (ParseException e) {
				e.printStackTrace();
			}
			return new java.sql.Date(date.getTime()) ;
		}
	}
	
	/**
	 * 字符串首字母大写
	 * @param attriName 待转换字符串
	 * @return
	 */
	public static String toUpperCaseFirstChar(String value) {
		return (value.charAt(0)+"").toUpperCase()+value.substring(1);
	}
	
	/**
	 * 字符串首字母小写
	 * @param attriName 待转换字符串
	 * @return
	 */
	public static String toLowerCaseFirstChar(String value) {
		return (value.charAt(0)+"").toLowerCase()+value.substring(1);
	}
	
	/**
	 * 转换字符(xml中特殊字符转义)
	 * 处理字符包括:<,>,',"
	 * @param str 待处理的xml
	 * @return
	 */
	public static String tranXmlToString(String str){
		String s = ""; 
		if(str!=null){
			s = str.replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("<", "&amp;").replaceAll("\"", "&quot;").replaceAll("'", "&apos;");
		}
		return s;
	}
	
	/**
	 * 还原转义后的xml字符串
	 * 处理字符包括:<,>,',"
	 * @param str 待处理的字符串
	 * @return
	 */
	public static String tranStringToXml(String str){
		String s = ""; 
		if(str!=null){
			s = str.replaceAll("&lt;","<").replaceAll("&gt;",">").replaceAll("&amp;","<").replaceAll( "&quot;","\"").replaceAll( "&apos;","'");
		}
		return s;
	}
	
	/**
	 * 通过getter或者setter方法名，获得属性名
	 * 去掉方法名前三位，并对第四位大小写的情况进行判断处理
	 * @param method getter或者setter方法名
	 * @return 如果为null则表示不存在该属性,或者方法不是getter或者setter方法
	 */
	public static String getAttributeNameByMethod(Method method,Class objClass) {
		String n = null ;
		String methodName = method.getName() ;
		if(methodName.length()<4) {
			return null;
		}
		String name = toLowerCaseFirstChar(methodName.substring(3)) ;
		try {
			Field filed = objClass.getDeclaredField(name);
			if(filed!=null) {
				n = name ;
			}
		} catch (NoSuchFieldException e) {
			name = methodName.substring(3) ;
			try {
				Field filed = objClass.getDeclaredField(name);
				if(filed!=null) {
					n = name ;
				}
			} catch (SecurityException e1) {
			} catch (NoSuchFieldException e1) {
			}
		}
		return n ;
	}
	
	/*public static void main(String args[]) {
		 java.util.Date d = new java.util.Date();
		 Date prlTimeTreat = new Date(System.currentTimeMillis());
		 String format = "yyyy-MM-dd hh:mm:ss" ;
		 SimpleDateFormat simpleDateFormat = new SimpleDateFormat(format);
		 String a = simpleDateFormat.format(prlTimeTreat) ;
		 java.sql.Date date = new java.sql.Date(d.getTime()) ;
		 System.out.println(date.toString()) ;
	}*/
	
}
