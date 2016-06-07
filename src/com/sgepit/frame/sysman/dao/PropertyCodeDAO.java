package com.sgepit.frame.sysman.dao;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.IBaseDAO;
import com.sgepit.frame.sysman.hbm.PropertyCode;
import com.sgepit.frame.sysman.hbm.PropertyType;
import com.sgepit.frame.sysman.service.BusinessConstants;

public class PropertyCodeDAO extends IBaseDAO {
	private static final Log log = LogFactory.getLog(PropertyCodeDAO.class);

	protected void initDao() {
		sBeanName = "com.sgepit.frame.sysman.hbm.PropertyCode";
	}

	public static PropertyCodeDAO getInstence() {
		return (PropertyCodeDAO) Constant.wact.getBean("propertyCodeDAO");
	}

	public static PropertyCodeDAO getFromApplicationContext(
			ApplicationContext ctx) {
		return (PropertyCodeDAO) ctx.getBean("propertyCodeDAO");
	}
	
	/**
	  * 获得属性代码List
	  * @param catagory
	  * @return
	  **/
	public List getCodeValue(String propertyName) {
		List typeList = findByProperty(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_TYPECATAGORY), "typeName", propertyName);
		if(typeList!=null&&typeList.size()>0){
			PropertyType type = (PropertyType)typeList.get(0);
			return findByProperty(sBeanName, "typeName", type.getUids(),"itemId");
		}
		return null;
	}
	
	/**
	  * 根据类型名称和属性代码获得属性名称
	  * @param codeValue
	  * @param propertyName
	  * @return
	  **/
	public String getCodeNameByPropertyName(String codeValue,String propertyName) {
		
		List typeList = findByProperty(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_TYPECATAGORY), "typeName", propertyName);
		if(typeList!=null&&typeList.size()>0){
			PropertyType type = (PropertyType)typeList.get(0);
			List list = findByWhere(sBeanName, "type_name='"+type.getUids()+"' and property_code='"+codeValue+"'");
			if(list!=null&&list.size()>0){
				return ((PropertyCode)list.get(0)).getPropertyName();
			}
		}
		return null;
	}
	
	/**
	  * 根据类型名称和属性代码获得属性名称
	  * @param codeValue
	  * @param propertyName
	  * @return
	  **/
	public String getCodeValueByPropertyName(String codeName,String propertyName) {
		
		List typeList = findByProperty(BusinessConstants.SYS_PACKAGE.concat(BusinessConstants.SYS_TYPECATAGORY), "typeName", propertyName);
		if(typeList!=null&&typeList.size()>0){
			PropertyType type = (PropertyType)typeList.get(0);
			List list = findByWhere(sBeanName, "type_name='"+type.getUids()+"' and property_name='"+codeName+"'");
			if(list!=null&&list.size()>0){
				return ((PropertyCode)list.get(0)).getPropertyCode();
			}
		}
		return null;
	}
}