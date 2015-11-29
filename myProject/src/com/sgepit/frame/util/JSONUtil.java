package com.sgepit.frame.util;

import java.util.List;
import net.sf.json.JSONArray;
import net.sf.json.JSONNull;
import net.sf.json.JsonConfig;
import net.sf.json.processors.JsonValueProcessor;

/**
 * 工具类：JSON 
 * 
 * @author xjdawu
 * @since 2007.12.6
 */
public class JSONUtil {
	
	/**
	 * 将包含一组实体Bean的List转换成JSON格式的字符串
	 * @param list
	 * @return
	 */
	public static String formObjectsToJSONStr(List<?> list) {
		JSONArray json = JSONArray.fromObject(list);
		return json.size()>0?json.toString():"[]";
	}

	/**
	 * 将实体Bean转换成JSON格式的字符串
	 * @param obj
	 * @return
	 */
	public static String formObjectToJSONStr(Object obj) {
		JSONArray json = JSONArray.fromObject(obj);
		return json.size()>0?json.toString():"[]";
	}

	/**
	 * 将一组实体转换为Ext.data.Reader所需的JSON字符串格式
	 * @param list
	 * @return
	 */
	public static String formObjectsToJSONReaderStr(List<?> list) {
		int size = list.size();
		if (list != null && list.size() > 0) {
			if (list.get(list.size() - 1).getClass().getName().equals(
					"java.lang.Integer")) {
				size = (Integer) list.get(list.size() - 1);
				list.remove(list.size() - 1);
			}
		}		
		StringBuffer sbf = new StringBuffer("");
		sbf.append("{ 'results': ");
		sbf.append(size);
		sbf.append(", 'rows': ");
		sbf.append(formObjectsToJSONStr(list));
		sbf.append("}");
		return sbf.toString();
	}
	
	/**
	 * 将单个实体转换为Ext.data.Reader所需的JSON字符串格式
	 * @param obj
	 * @return
	 */
	public static String formObjectToJSONReaderStr(Object obj) {
		StringBuffer sbf = new StringBuffer("");
		sbf.append("{ 'results': 1, 'rows': ");
		sbf.append(formObjectToJSONStr(obj));
		sbf.append("}");
		return sbf.toString();
	}

	public static class NullValueProcesser implements JsonValueProcessor{

		public Object processArrayValue(Object arg0, JsonConfig arg1) {
			if (arg0==null) {
				return JSONNull.getInstance();
			} else {
				return arg0;
			}
		}

		public Object processObjectValue(String arg0, Object arg1,
				JsonConfig arg2) {
			if (arg1==null) {
				return JSONNull.getInstance();
			} else {
				return arg1;
			}
		}
		
	}
}
