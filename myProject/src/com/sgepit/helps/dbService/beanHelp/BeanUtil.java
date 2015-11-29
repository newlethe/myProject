/** 
 * Title:        数据库应用: 
 * Description:  数据库对象应用
 * Company:      sgepit
 */
package com.sgepit.helps.dbService.beanHelp;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.sgepit.helps.dbService.exception.AttributeException;
import com.sgepit.helps.dbService.exception.InvokeException;
import com.sgepit.helps.util.StringUtil;

/**
 * 数据库对象模型基础对象
 * 包含bean对象基础功能，如复制、设置属性的值、toString()等基础方法
 * @author lizp
 * @Date 2010-8-12
 */
public class BeanUtil {
	/**
	 * 通过指定的属性名设置属性值
	 * 通过反射设置属性值
	 * @param attributeName attributeName the name of the attribute
	 * @param value value the attribute value with the given name as an <code>Object</code>
	 * @throws NoSuchMethodException 
	 * @throws AttributeException 
	 * @throws InvokeException 
	 * @throws SecurityException 
	 * @throws IllegalAccessException 
	 * @throws InvocationTargetException 
	 */
	public void setAttributeValue(String attributeName, Object value) throws AttributeException, InvokeException {
		String methodName = getSetterMethodByAttributeName(attributeName);
		try {
			Method method = this.getClass().getMethod(methodName, value.getClass());
			method.invoke(this, value) ;
		} catch (SecurityException e) {
			throw new InvokeException(e);
		} catch (IllegalArgumentException e) {
			throw new InvokeException(e);
		} catch (NoSuchMethodException e) {
			throw new InvokeException(e);
		} catch (IllegalAccessException e) {
			throw new InvokeException(e);
		} catch (InvocationTargetException e) {
			throw new InvokeException(e);
		}
	}
	
	/**
	 * 获得指定属性名的值
	 * @param attributeName attributeName the name of the attribute
	 * @throws IllegalAccessException 
	 * @throws InvocationTargetException 
	 * @throws NoSuchMethodException 
	 * @throws SecurityException 
	 * @throws AttributeException 
	 */
	public Object getAttributeValue(String attributeName) throws AttributeException, InvokeException {
		String methodName = getGetterMethodByAttributeName(attributeName);
		Method method = null ;
		try {
			method = this.getClass().getMethod(methodName);
			return method.invoke(this) ;
		} catch (SecurityException e) {
			throw new InvokeException("反射(安全管理器SecurityException)异常！",e);
		} catch (IllegalArgumentException e) {
			throw new InvokeException("反射(参数IllegalArgumentException)异常！",e);
		} catch (NoSuchMethodException e) {
			throw new InvokeException("反射(未找到相应的方法NoSuchMethodException)异常！方法名:"+method.getName(),e);
		} catch (IllegalAccessException e) {
			throw new InvokeException("反射(无法访问指定对象IllegalAccessException)异常",e);
		} catch (InvocationTargetException e) {
			throw new InvokeException("反射(目标异常InvocationTargetException)异常",e);
		}
	}
	
	/**
	 * 获得属性名称集合
	 * @return
	 */
	public Field[] getAttributes() {
		return this.getClass().getDeclaredFields();
	}
	
	/**
	 * 获得指定属性名的字符串值
	 * @param attributeName attributeName the name of the attribute
	 * @return 
	 * @throws AttributeException 
	 * @throws NoSuchMethodException 
	 * @throws InvocationTargetException 
	 * @throws IllegalAccessException 
	 * @throws SecurityException 
	 */
	public String getAttributeAsText(String attributeName) throws AttributeException, InvokeException {
		Object obj = getAttributeValue(attributeName);
		return StringUtil.objectToString(obj);
	}
	
	/**
	 * 调用对象中的方法
	 * @param methodName 方法名
	 * @return
	 * @throws SecurityException
	 * @throws NoSuchMethodException
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	public Object invoke(String methodName) throws AttributeException, InvokeException {
		return invoke(methodName, null) ;
	}
	
	/**
	 * 调用对象中的方法
	 * 方法参数中不能为基本类型
	 * @param methodName 方法名
	 * @param obj 参数值对象
	 * @return
	 * @throws SecurityException
	 * @throws NoSuchMethodException
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	public Object invoke(String methodName,Object[] obj) throws AttributeException, InvokeException {
		if(methodName==null) {
			throw new InvokeException("方法名为空！");
		}
		Class[] cla = null ;
		if(obj!=null) {
			List<Class> list = new ArrayList<Class>() ;
			for(Object o : obj) {
				list.add(o.getClass()) ;
			}
			if(list!=null) {
				cla = new Class[list.size()] ;
				for(int i=0;i<list.size();i++) {
					Object oclass = list.get(i) ;
					if(obj!=null) {
						cla[i] = (Class) oclass ;
					}
				}
			}
		}
		Method method = null ;
		try {
			method = this.getClass().getMethod(methodName,cla);
			if(method==null) throw new InvokeException("获得反射方法异常，方法名："+methodName);
			return method.invoke(this, obj) ;
		} catch (SecurityException e) {
			throw new InvokeException("反射(安全管理器SecurityException)异常！",e);
		} catch (IllegalArgumentException e) {
			throw new InvokeException("反射(参数IllegalArgumentException)异常！",e);
		} catch (NoSuchMethodException e) {
			throw new InvokeException("反射(未找到相应的方法NoSuchMethodException)异常！方法名:"+method.getName(),e);
		} catch (IllegalAccessException e) {
			throw new InvokeException("反射(无法访问指定对象IllegalAccessException)异常",e);
		} catch (InvocationTargetException e) {
			throw new InvokeException("反射(目标异常InvocationTargetException)异常",e);
		}
	}
	
	/**
	 * 通过属性名称获得setter方法名
	 * @param attributeName 属性名称
	 * @return 属性名为null或者为空时抛出AttributeException异常
	 * @throws AttributeException 
	 */
	protected String getSetterMethodByAttributeName(String attributeName) throws AttributeException {
		if(attributeName==null||"".equals(attributeName)) {
			throw new AttributeException("属性名称不能为空！");
		}
		return "set"+StringUtil.toUpperCaseFirstChar(attributeName) ;
	}
	
	/**
	 * 通过属性名称获得getter方法名
	 * @param attributeName 属性名称
	 * @return 属性名为null或者为空时抛出AttributeException异常
	 * @throws AttributeException
	 */
	protected String getGetterMethodByAttributeName(String attributeName) throws AttributeException {
		if(attributeName==null||"".equals(attributeName)) {
			throw new AttributeException("属性名称不能为空！");
		}
		return "get"+StringUtil.toUpperCaseFirstChar(attributeName) ;
	}
	
	/**
	 * 通过getter或者setter方法名，获得属性名
	 * 去掉方法名前三位，并对第四位大小写的情况进行判断处理
	 * @param method getter或者setter方法名
	 * @return 如果为null则表示不存在该属性
	 * @throws AttributeException 
	 */
	private String getAttributeNameByMethod(Method method) throws AttributeException {
		String n = null ;
		String methodName = method.getName() ;
		if(methodName.length()<4) {
			throw new AttributeException("方法名长度不够：method："+methodName);
		}
		String name = StringUtil.toLowerCaseFirstChar(methodName.substring(3)) ;
		try {
			Field filed = this.getClass().getDeclaredField(name);
			if(filed!=null) {
				n = name ;
			}
		} catch (NoSuchFieldException e) {
			name = methodName.substring(3) ;
			try {
				Field filed = this.getClass().getDeclaredField(name);
				if(filed!=null) {
					n = name ;
				}
			} catch (SecurityException e1) {
			} catch (NoSuchFieldException e1) {
			}
		}
		return n ;
	}
	
	/**
	 * bean转换成xml
	 * 	<?xml version="1.0" encoding="UTF-8"?>
		<bean name="com.sgepit.helps.dbService.beanHelp.TestBean">
			<field type="java.lang.String">aaa</field>
			<field type="java.sql.Date">2010-12-08</field>
			<field type="java.lang.Integer">12</field>
			<field type="java.math.BigDecimal">123.222</field>
			<field type="java.lang.Integer">11</field>
		</bean>
	 * @return
	 * @throws InvokeException 
	 * @throws AttributeException 
	 */
	public Document asDocument() throws AttributeException, InvokeException {
		Document document = DocumentHelper.createDocument() ;
		Element bean = document.addElement("bean");
		bean.addAttribute("name",this.getClass().getName()) ;
		Field[] fields = this.getClass().getDeclaredFields();
		for(Field field : fields) {
			Object value = getAttributeValue(field.getName()) ;
			Element fieldEl = bean.addElement("field");
			fieldEl.addAttribute("type",value.getClass().getName()) ;
			fieldEl.setText(value.toString()) ;
		}
		return document ;
	}
	public String asXML() throws AttributeException, InvokeException {
		return asDocument().asXML() ;
	}
	
	@Override
	public String toString() {
		String s = "" ;
		Method[] methods = this.getClass().getDeclaredMethods();
		for(Method method :methods) {
			String name = method.getName() ;
			if(name.startsWith("get")) {
				s += "{" ;
				try {
					Object obj = method.invoke(this) ;
					s += getAttributeNameByMethod(method)+" = " ;
					s += (obj==null?"":obj.toString())+"} " ;
				} catch (IllegalArgumentException e) {
				} catch (IllegalAccessException e) {
				} catch (InvocationTargetException e) {
				} catch (AttributeException e) {
				}
			}
		}
		return s;
	}
}
