/** 
 * Title:        数据库应用: 
 * Description:  对象绑定应用
 * Company:      sgepit
 */
package com.sgepit.helps.dbService.bandHelp;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.sgepit.helps.dbService.beanHelp.BaseBean;
/**
 * 对象绑定应用
 * 主要用于数据库操作两种对象间的绑定(bean、map)
 * 经过绑定后的bean对象类型为BaseBean，可以用过setAttributeValue对属性设置，或者强制转换为具体对象来使用
 * @author lizp
 * @Date 2010-8-12
 */
public class BeanBandUtil {
	/**
	 * 将map值绑定到class的实例对象上
	 * @param map 
	 * @param bean
	 * @throws IllegalAccessException 
	 * @throws InstantiationException 
	 */
	public static BaseBean bandMapToBean(Map<String, Object> map,Class<? extends BaseBean> beanClass) throws InstantiationException, IllegalAccessException {
		BaseBean bean = null ;
		if(beanClass!=null) {
			bean = beanClass.newInstance() ;
			bandMapToBean(map,bean);
		}
		return bean ;
	}
	
	/**
	 * 将map值绑定到bean
	 * @param map
	 * @param bean
	 */
	public static void bandMapToBean(Map<String, Object> map,BaseBean bean) {
		if(bean!=null) {
			Iterator<String> it = map.keySet().iterator();
			while(it.hasNext()) {
				String key = it.next();
				Object value = map.get(key) ;
				try {
					bean.setAttributeValue(key, value) ;
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
	public static List<BaseBean> bandListMapToListBean(List<Map<String, Object>> list,Class<? extends BaseBean> beanClass) {
		List<BaseBean> returnList = new ArrayList<BaseBean>() ;
		if(list!=null&&beanClass!=null) {
			for(Map<String, Object> map : list) {
				try {
					BaseBean obj = beanClass.newInstance();
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
	public static void bandBeanToMap(BaseBean bean,Map<String, Object> map) {
		if(map==null) {
			map = new HashMap<String, Object>() ;
		}
		if(bean!=null) {
			Class<? extends Object> beanclass = bean.getClass();
			Field[] fileds = beanclass.getDeclaredFields();
			for(Field filed : fileds) {
				String name = filed.getName() ;
				try {
					Object value = bean.getAttributeValue(name) ;
					map.put(name, value) ;
				} catch (Exception e) {
				}
			}
		}
	}
	
	/**
	 * 将ListBean值绑定到ListMap
	 * @param list
	 * @return
	 */
	public static List<Map<String, Object>> bandListBeanToListMap(List<BaseBean> list) {
		List<Map<String,Object>> returnList = new ArrayList<Map<String,Object>>() ;
		for(BaseBean bean : list) {
			Map<String,Object> map = new HashMap<String,Object>() ;
			bandBeanToMap(bean,map) ;
			returnList.add(map) ;
		}
		return  returnList ;
	}

}
