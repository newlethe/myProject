package com.sgepit.frame.util;


/**
 * 业务类
 * 
 */
public class BusinessUtil {
	
	/**
	  * 将类的包名去掉
	  * 比如com.sgepit.frame.guideline.dao.SgccGuidelineInfo转换成SgccGuidelineInfo
	  * @param beanName
	  * @return
	  **/
	public static String getTableName(String beanName) {
		String table = beanName.indexOf(".") > -1 ? beanName.split("\\.")[beanName
				.split("\\.").length - 1]
				: beanName;
		return table;
	}


}
