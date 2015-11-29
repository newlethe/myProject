package com.sgepit.helps.util;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;


/**
 * 数据在不同对象间传递(数据绑定)
 * @author lizp 2010-2-23
 *
 */
public class BandUtil {
	/**
	 * 将map值绑定到bean
	 * @param map
	 * @param bean bean 实例后的bean对象
	 */
	public static void bandMapToBean(Map<String, Object> map,Object bean) {
		if(bean!=null) {
			Class<? extends Object> beanclass = bean.getClass();
			Iterator<String> it = map.keySet().iterator();
			while(it.hasNext()) {
				String key = it.next();
				Object value = map.get(key) ;
				try {
					Method method = beanclass.getMethod("set"+StringUtil.toUpperCaseFirstChar(key), value.getClass());
					method.invoke(bean, value) ;
				} catch (Exception e) {
					
				}
			}
		}
	}
	/**
	 * 将ListMap值绑定到ListBean
	 * @param list
	 * @param beanClass
	 * @return
	 */
	public static List<Object> bandListMapToListBean(List<Map<String, Object>> list,Class beanClass) {
		List<Object> returnList = new ArrayList<Object>() ;
		if(list!=null&&beanClass!=null) {
			for(Map<String, Object> map : list) {
				try {
					Object obj = beanClass.newInstance();
					if(obj!=null) {
						bandMapToBean(map,obj) ;
						returnList.add(obj) ;
					}
				} catch (Exception e) {
				}
			}
		}
		return returnList ;
	}
	
	/**
	 * 将bean值绑定到map
	 * @param map
	 * @param bean
	 */
	public static void bandBeanToMap(Object bean,Map<String, Object> map) {
		if(map==null) {
			map = new HashMap<String, Object>() ;
		}
		if(bean!=null) {
			Class<? extends Object> beanclass = bean.getClass();
			Method[] methods = beanclass.getDeclaredMethods();
			for(Method method : methods) {
				String methodName = method.getName() ;
				if(methodName.startsWith("get")) {
					Object value = null ;
					try {
						value = method.invoke(bean) ;
						map.put(StringUtil.getAttributeNameByMethod(method, beanclass), value) ;
					} catch (Exception e) {
						
					}
				}
			}
		}
	}
	
	/**
	 * 将ListBean值绑定到ListMap
	 * @param list
	 * @return
	 */
	public static List<Map<String, Object>> bandListBeanToListMap(List<Object> list) {
		List<Map<String,Object>> returnList = new ArrayList<Map<String,Object>>() ;
		for(Object bean : list) {
			Map<String,Object> map = new HashMap<String,Object>() ;
			bandBeanToMap(bean,map) ;
			returnList.add(map) ;
		}
		return  returnList ;
	}
}
