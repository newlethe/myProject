package com.sgepit.frame.util.db;

import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;

import com.sgepit.frame.base.Constant;
/**
 * 生成时间流水号加随机数作为唯一id的工具类
 *
 */
public class SnUtil {
	
	private static int sn = 0;
	
	/**
	 * 生成一个新的唯一id，21位：17位时间+四位流水号
	 * @return 返回生成的流水号
	 */
	public synchronized static String getNewID() {
		if(sn>=9999) {
			sn = 0;
		}
		// 年4月2日2时2分2秒2毫秒3序列4共21位
		return new java.text.SimpleDateFormat("yyyyMMddHHmmssSSS").format(new java.util.Date()) 
				+ new java.text.DecimalFormat("0000").format( sn++ );
	}
	
	/**
	 * 生成一个新的唯一id，使用自定义前缀，前缀+17位时间+四位流水号
	 * @param prefix 指定前缀
	 * @return 返回生成的流水号
	 */
	public synchronized static String getNewID(String prefix) {
		if(sn>=9999) {
			sn = 0;
		}
		// 年4月2日2时2分2秒2毫秒3序列4共21位
		return prefix.concat(new java.text.SimpleDateFormat("yyyyMMddHHmmssSSS").format(new java.util.Date()) 
				+ new java.text.DecimalFormat("0000").format( sn++ ));
	}
	/**
	 * 生成一个新的唯一id，使用单位id作为前缀，前缀+17位时间+四位流水号
	 * @deprecated
	 * @return
	 */
	public synchronized static String getNewIDByUnitid() {
		WebContext wc = WebContextFactory.get();
		String unitId =(String)wc.getHttpServletRequest().getSession().getAttribute(Constant.USERUNITID);		
		return getNewID(unitId);
	}
	
	/**
	 * 生成一个新的唯一id，使用部门id作为前缀，前缀+17位时间+四位流水号
	 * @deprecated
	 * @return
	 */
	public synchronized static String getNewIDByDeptid() {
		WebContext wc = WebContextFactory.get();
		String deptId =(String)wc.getHttpServletRequest().getSession().getAttribute(Constant.USERDEPTID);		
		return getNewID(deptId);
	}
	
}
