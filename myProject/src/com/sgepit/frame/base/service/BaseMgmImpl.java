package com.sgepit.frame.base.service;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import net.sf.json.JSONObject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.mapping.Column;
import org.hibernate.mapping.PersistentClass;
import org.hibernate.mapping.Property;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.LocalSessionFactoryBean;
import org.springframework.web.context.WebApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.base.dao.BaseDAO;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;
import com.sgepit.frame.util.JSONUtil;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.MD5Util;


public class BaseMgmImpl implements BaseMgmFacade {	
	/**
	 * 
	 * @param ctx
	 * @return
	 */
	public static BaseMgmImpl getFromApplicationContext(ApplicationContext ctx) {
		return (BaseMgmImpl) ctx.getBean("baseMgm");
	}
	private static final Log log = LogFactory.getLog(BaseMgmImpl.class);
	private BaseDAO baseDAO;	
	private WebApplicationContext wac;
	
	private HashMap<String, Object> businessMap = new HashMap<String, Object>();
	private HashMap<String, Class> businessClassMap = new HashMap<String, Class>();
	private ApplicationContext ctx;
	private Configuration hc;
	
	
	public BaseDAO getBaseDAO() {
		return baseDAO;
	}
	public void setBaseDAO(BaseDAO baseDAO) {
		this.baseDAO = baseDAO;
	}
	/**
	 * get WebApplicationContext
	 * 
	 * @return
	 */
	public WebApplicationContext getWac() {
		return this.wac;
	}	
	/**
	 * set ApplicationContext
	 * 
	 * @param wac
	 */
	public void setWac(WebApplicationContext wac) {
		this.wac = wac;
	}
		
	public List getData(String sql) {
		// TODO Auto-generated method stub
		return baseDAO.getDataAutoCloseSes(sql);
	}

	/**
	 * 通用查找方法，返回按列排序后的实体集合，带分页，子类不可使用
	 * 
	 * @param beanName
	 * @param propertyName
	 * @param value
	 * @param orderby
	 * @param firstRow
	 * @param maxRow
	 * @return
	 * @throws BusinessException
	 */
	public List findByPropertyOrderPage(String beanName, String propertyName,
			Object value, String orderby, Integer firstRow,
			Integer maxRow) throws BusinessException {
		List list = null;
		try {
			Field field = Class.forName(beanName)
					.getDeclaredField(propertyName);
			value = parseFieldType(value, field);
			list = this.baseDAO.findByProperty(beanName, propertyName, value,orderby, firstRow, maxRow);
		} catch (Exception e) {
			throw new BusinessException(e.getMessage());
		}
		return list;
	}
	
	/**
	 * 通用查找调度
	 * 
	 * @param businessName
	 * @param beanName
	 * @param methodName
	 * @param params
	 * @param orderby
	 * @param start
	 * @param limit
	 * @return
	 */
	public List find(String businessName, String beanName, String methodName,
			String params, String orderby, Integer start, Integer limit) {
		List list = new ArrayList();
		try {
			if (methodName.equalsIgnoreCase("findwhereorderby")) {
				list = findWhereOrderPage(businessName, beanName, methodName,
						params, orderby, start, limit);
			} else if (methodName.equalsIgnoreCase("findorderby")) {
				list = findOrderPage(businessName, beanName, methodName, orderby,
						start, limit);
			} else if (methodName.equalsIgnoreCase("findbyproperty")) {
				if (params!=null) {
					String[] p = params.split(Constant.SPLITB);
					list = findByPropertyOrderPage(beanName, p[0], p[1], orderby,
							start, limit);
				}
			} else if (methodName.equalsIgnoreCase("findbysqlforlist")) {
				if (params!=null) {
					String sql = params;
					list = JdbcUtil.query(sql);
				}
			} else if (methodName.equalsIgnoreCase("findwherezlQuery")) {
				list = findWhereOrderPage(businessName, beanName, methodName,
						params, orderby, start, limit);
			}else if(methodName.equalsIgnoreCase("getPublishUser")){
				try {
					Object dao = getBusinessInstance(businessName);
					if (dao != null) {
						String[] p = params.split(Constant.SPLITB);
						
						Class partypes[] = new Class[2];
						partypes[0] = String.class; // uids
						partypes[1] = String.class; // deptid
						Method findMethod = this.businessClassMap.get(businessName)
								.getDeclaredMethod(methodName, partypes);
						list = (List) findMethod.invoke(dao, p[0], p[1]);
					}
				} catch (Exception e) {
					log.error("BaseMgmImpl.findyByParams: finding problem.");
					log.error(e.getMessage());
					e.printStackTrace();
				}
			} else if (methodName.equalsIgnoreCase("findBySql")) {
				if (params!=null) {
					String sql = params;
					list = this.baseDAO.findBySql(beanName, sql, start, limit);
				}
			}else {
				HashMap paramMap = parseParams(params);
				list = findyByParams(businessName, beanName, methodName,
						paramMap, orderby, start, limit);
			}
		} catch (Exception e) {
			log.error("baseMgmImpl.find: finding problem.");
			log.error(e.getMessage());
			e.printStackTrace();
		}
		return list;
	}

	/*
	 * 通过id获取实体Bean (non-Javadoc)
	 * 
	 * @see com.ocean.webpmis.domain.business.BaseMgmFacade#findById(java.lang.String,
	 *      java.lang.String)
	 */
	public Object findById(String beanName, String ids) {
		return this.baseDAO.findById(beanName, ids);
	}

	/**
	 * 通过某个属性查找并返回单个实体
	 * 
	 * @param beanName
	 * @param propertyName
	 * @param value
	 * @return
	 */
	public Object findBeanByProperty(String beanName, String propertyName,
			Object value) {
		return this.baseDAO.findBeanByProperty(beanName, propertyName, value);
	}

	/**
	 * 查找全部
	 * 
	 * @param beanName
	 * @return
	 */
	public List findAll(String beanName) {
		return this.baseDAO.findByWhere(beanName, null, null, null, null);
	}

	/**
	 * 通过参数查找
	 * 
	 * @param businessName
	 * @param beanName
	 * @param methodName
	 * @param params
	 * @param orderby
	 * @param start
	 * @param limit
	 * @return
	 */
	private List findyByParams(String businessName, String beanName,
			String methodName, HashMap params, String orderby, Integer start,
			Integer limit) {
		List list = new ArrayList();
		try {
			Object dao = getBusinessInstance(businessName);
			if (dao != null) {
				Class partypes[] = new Class[4];
				partypes[0] = String.class; // orderBy
				partypes[1] = Integer.class; // firstRow
				partypes[2] = Integer.class; // maxRow
				partypes[3] = HashMap.class; // params
				Method findMethod = this.businessClassMap.get(businessName)
						.getDeclaredMethod(methodName, partypes);
				list = (List) findMethod.invoke(dao, orderby, start, limit,
						params);
			}
		} catch (Exception e) {
			log.error("BaseMgmImpl.findyByParams: finding problem.");
			log.error(e.getMessage());
			e.printStackTrace();
		}
		return list;
	}

	/**
	 * 解析参数字符串
	 * 
	 * @param params
	 * @return
	 */
	private HashMap parseParams(String params) {
		HashMap map = new HashMap();
		if(!params.equals("")){
			String[] a = params.split(Constant.SPLITA);
			for (int i = 0; i < a.length; i++) {
				if(a[i]==null||a[i].equals("")) continue;
				String[] b = a[i].split(Constant.SPLITB);
				if(b.length>1) map.put(b[0], b[1]);
			}
			if(map.isEmpty()) map.put(params, null); 
		}
		return map;
	}

	/**
	 * 通用查找方法，子类不可使用
	 * 
	 * @param businessName
	 * @param beanName
	 * @param methodName
	 * @param where
	 * @param orderBy
	 * @return
	 */
	public List findWhereOrder(String businessName, String beanName,String methodName, String where, String orderBy) {
		List list = new ArrayList();
		if (businessName.equals("baseMgm")) {
			list = this.baseDAO.findByWhere(beanName, where, orderBy,null,null);
		} else {
			try {
				Object dao = getBusinessInstance(businessName);
				if (dao != null) {
					Class partypes[] = new Class[3];
					partypes[0] = String.class; // beanName
					partypes[1] = String.class; // where
					partypes[2] = String.class; // orderBy
					Method findMethod = this.businessClassMap.get(businessName)
							.getDeclaredMethod(methodName, partypes);
					list = (List) findMethod.invoke(dao, beanName, where,
							orderBy);
				}
			} catch (Exception e) {
				log.error("BaseMgmImpl.findWhereOrderby: finding problem.");
				log.error(e.getMessage());
				e.printStackTrace();
			}
		}
		return list;
	}

	/*
	 * 通用查找方法，分页，子类不可使用 (non-Javadoc)
	 * 
	 * @see com.ocean.webpmis.domain.business.BaseMgmFacade#findWhereOrderby(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String,
	 *      java.lang.String, java.lang.Integer, java.lang.Integer)
	 */
	public List findWhereOrderPage(String businessName, String beanName,
			String methodName, String where, String orderBy, Integer firstRow,
			Integer maxRow) {
		if (firstRow == null || maxRow == null) {
			return findWhereOrder(businessName, beanName, methodName, where,
					orderBy);
		}
		List list = new ArrayList();
		if (businessName.equals("baseMgm")) {
			list = this.baseDAO.findByWhere(beanName, where, orderBy,firstRow, maxRow);
		} else {
			try {
				Object dao = getBusinessInstance(businessName);
				if (dao != null) {
					Class partypes[] = new Class[5];
					partypes[0] = String.class; // beanName
					partypes[1] = String.class; // where
					partypes[2] = String.class; // orderBy
					partypes[3] = Integer.class; // firstRow
					partypes[4] = Integer.class; // maxRow
					Method findMethod = this.businessClassMap.get(businessName).getMethod(methodName, partypes);
					list = (List) findMethod.invoke(dao, beanName, where,orderBy, firstRow, maxRow);
				}
			} catch (Exception e) {
				log
						.error("BaseMgmImpl.findWhereOrderby(with pagenation): finding problem.");
				log.error(e.getMessage());
				e.printStackTrace();
			}
		}
		return list;
	}

	/**
	 * 通用查找方法，子类不可使用
	 * 
	 * @param businessName
	 * @param beanName
	 * @param methodName
	 * @param orderBy
	 * @return
	 */
	private List findOrder(String businessName, String beanName,
			String methodName, String orderBy) {
		List list = new ArrayList();
		if (businessName.equals("baseDao") || businessName.equals("baseMgm")) {
			list = this.baseDAO.findByWhere(beanName,null,orderBy,null,null);
		} else {
			try {
				Object dao = getBusinessInstance(businessName);
				if (dao != null) {
					Class partypes[] = new Class[2];
					partypes[0] = String.class; // beanName
					partypes[1] = String.class; // orderby
					Method findMethod = this.businessClassMap.get(businessName)
							.getDeclaredMethod(methodName, partypes);
					list = (List) findMethod.invoke(dao, beanName, orderBy);
				}
			} catch (Exception e) {
				log.error("BaseMgmImpl.findOrderby: finding problem.");
				log.error(e.getMessage());
				e.printStackTrace();
			}
		}
		return list;
	}

	/*
	 * 通用查找方法，分页，子类不可使用 (non-Javadoc)
	 * 
	 * @see com.ocean.webpmis.domain.business.BaseMgmFacade#findOrderby(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String,
	 *      java.lang.Integer, java.lang.Integer)
	 */
	public List findOrderPage(String businessName, String beanName,
			String methodName, String orderBy, Integer firstRow, Integer maxRow) {
		if (firstRow == null || maxRow == null) {
			return findOrder(businessName, beanName, methodName, orderBy);
		}
		List list = new ArrayList();
		if (businessName.equals("baseDao") || businessName.equals("baseMgm")) {
			list = this.baseDAO
					.findByWhere(beanName,null, orderBy, firstRow, maxRow);
		} else {
			try {
				Object dao = getBusinessInstance(businessName);
				if (dao != null) {
					Class partypes[] = new Class[4];
					partypes[0] = String.class; // beanName
					partypes[1] = String.class; // orderBy
					partypes[2] = Integer.class; // firstRow
					partypes[3] = Integer.class; // maxRow
					Method findMethod = this.businessClassMap.get(businessName)
							.getDeclaredMethod(methodName, partypes);
					list = (List) findMethod.invoke(dao, beanName, orderBy,
							firstRow, maxRow);
				}
			} catch (Exception e) {
				log
						.error("BaseMgmImpl.findOrderby(with pagenation): finding problem.");
				log.error(e.getMessage());
				e.printStackTrace();
			}
		}
		return list;
	}

	/**
	 * 通用查找方法，返回实体集合，子类不可使用
	 * 
	 * @param beanName
	 * @param propertyName
	 * @param value
	 * @return
	 * @throws BusinessException
	 */
	public List findByProperty(String beanName, String propertyName,
			Object value) throws BusinessException {
		return findByPropertyOrder(beanName, propertyName, value, null);
	}

	/**
	 * 通用查找方法，返回按列排序后的实体集合，子类不可使用
	 * 
	 * @param beanName
	 * @param propertyName
	 * @param value
	 * @param orderby
	 * @return
	 * @throws BusinessException 
	 */
	public List findByPropertyOrder(String beanName, String propertyName,
			Object value, String orderby) throws BusinessException {
		return findByPropertyOrderPage(beanName, propertyName, value, orderby, null, null);
	}

	

	private Object parseFieldType(Object value, Field field) {
		String type = field.getType().getName();
		Object obj = new Object();
		if (type.indexOf("Double") > -1) {
			obj = new Double(value.toString());
		} else if (type.indexOf("Long") > -1) {
			obj = new Long(value.toString());
		} else if (type.indexOf("Integer") > -1) {
			obj = new Integer(value.toString());
		} else if (type.indexOf("String") > -1) {
			obj = value.toString();
		} else {
			obj = value;
		}
		return obj;
	}

	/**
	 * 删除实体Bean所有记录
	 * 
	 * @param beanName
	 */
	public void deleteAll(String beanName) {
		List list = this.baseDAO.findByWhere(beanName,null,null,null,null);
		this.baseDAO.deleteAll(list);
	}

	/**
	 * 通用删除方法，子类不可使用
	 * 
	 * @param object
	 * @return
	 * @throws SQLException
	 */
	public Integer delete(Object object) throws SQLException {
		int c = 0;
		if (object != null) {
			this.baseDAO.delete(object);
			c++;
		}
		return c;
	}

	/**
	 * 通用批量删除方法，子类不可使用
	 * 
	 * @param list
	 * @return
	 * @throws SQLException
	 */
	public Integer deleteAll(List list) throws SQLException {
		int c = 0;
		if (list != null) {
			this.baseDAO.deleteAll(list);
			c = list.size();
		}
		return c;
	}

	/**
	 * 通用删除方法，子类不可使用
	 * 
	 * @param beanName
	 * @param id
	 * @return
	 * @throws SQLException
	 */
	public Integer delete(String beanName, String id) throws SQLException {
		int c = 0;
		Object temp = this.baseDAO.findById(id, beanName);
		if (temp != null) {
			this.baseDAO.delete(temp);
			c++;
		}
		return c;
	}

	/**
	 * 通用删除方法，子类不可使用
	 * 
	 * @param beanName
	 * @param ida
	 * @return
	 * @throws SQLException
	 */
	public Integer delete(String beanName, String[] ida) throws SQLException {
		int c = 0;
		for (int i = 0; i < ida.length; i++) {
			Object temp = this.baseDAO.findById(beanName, ida[i]);
			if (temp != null) {
				this.baseDAO.delete(temp);
				c++;
			}
		}
		return c;
	}

	/*
	 * 通用删除方法，子类不可使用 (non-Javadoc)
	 * 
	 * @see com.ocean.webpmis.domain.business.BaseMgmFacade#delete(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.String[])
	 */
	public Integer delete(String businessName, String beanName,
			String methodName, String[] ida) throws Exception {
		if (businessName.equals("baseMgm") || methodName.equals("delete")) {
			return delete(beanName, ida);
		}
		int c = 0;
		Object dao = getBusinessInstance(businessName);
		if (dao != null) {
			Class partypes[] = new Class[1];
			partypes[0] = Class.forName(beanName);
			Method delMethod = this.businessClassMap.get(businessName)
					.getDeclaredMethod(methodName, partypes);

			for (int i = 0; i < ida.length; i++) {
				Object temp = findById(beanName, ida[i]);
				if (temp != null) {
					delMethod.invoke(dao, temp);
					c++;
				}
			}
		}
		return c;
	}

	/**
	 * 通用新增方法，子类不可使用
	 * 
	 * @param object
	 * @throws SQLException
	 */
	private void insert(Object object) throws SQLException {
		this.baseDAO.insert(object);
	}

	/*
	 * 通用新增方法，子类不可使用 (non-Javadoc)
	 * 
	 * @see com.ocean.webpmis.domain.business.BaseMgmFacade#insert(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.Object)
	 */
	public void insert(String businessName, String beanName, String methodName,
			Object object) throws Exception {
		if (businessName.equals("baseMgm") && methodName.equals("insert")) {
			this.insert(object);
		} else {
			Object dao = getBusinessInstance(businessName);
			if (dao != null) {
				Class partypes[] = new Class[1];
				partypes[0] = Class.forName(beanName);
				Method insertMethod = this.businessClassMap.get(businessName)
						.getDeclaredMethod(methodName, Class.forName(beanName));
				insertMethod.invoke(dao, object);
			} else {
				throw new BusinessException("Cannot find business: " + businessName);
			}
		}
	}

	/**
	 * 通用保存方法，子类不可使用
	 * 
	 * @param object
	 * @throws SQLException
	 */
	private void save(Object object) throws SQLException {
		this.baseDAO.saveOrUpdate(object);
	}

	/*
	 * 通用保存方法，子类不可使用 (non-Javadoc)
	 * 
	 * @see com.ocean.webpmis.domain.business.BaseMgmFacade#save(java.lang.String,
	 *      java.lang.String, java.lang.String, java.lang.Object)
	 */
	public void save(String businessName, String beanName, String methodName,
			Object object) throws Exception {
		if (businessName.equals("baseMgm") && methodName.equals("save")) {
			this.baseDAO.saveOrUpdate(object);
		} else {
			Object dao = getBusinessInstance(businessName);
			if (dao != null) {
				Class partypes[] = new Class[1];
				partypes[0] = Class.forName(beanName);
				Method saveMethod = this.businessClassMap.get(businessName)
						.getDeclaredMethod(methodName, Class.forName(beanName));
				saveMethod.invoke(dao, object);
			} else {
				throw new BusinessException("Cannot find business: " + businessName);
			}
		}

	}

	/**
	 * 更新之前，先将客户端提交的内容和实体Bean的全部属性进行合并
	 * 
	 * @param beanName
	 * @param object
	 * @param primaryKey
	 * @param id
	 * @param set
	 * @return
	 * @throws Exception
	 */
	public Object mergeBean(String beanName, Object object, String primaryKey,
			String id, Set<String> set) throws Exception {
		Object obj = findById(beanName, id);
		Class<?> cls = obj.getClass();
		Iterator<?> itr = set.iterator();
		try {
			while (itr.hasNext()) {
				String fn = (String) itr.next();
				String cfn = fn.substring(0, 1).toUpperCase() + fn.substring(1);
				Method getMethod = cls.getDeclaredMethod("get" + cfn);
				Method setMethod = cls.getDeclaredMethod("set" + cfn,
						cls.getDeclaredField(fn).getType());
				Object val = getMethod.invoke(object);
				setMethod.invoke(obj, val);
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			log.error("baseMgmImpl.mergeBean: bean Property merging problem.");
			log.error(ex.getMessage());
		}
		return obj;
	}
	/**
	 * 获取实体Bean的属性个数
	 * 
	 * @param beanName
	 * @return
	 */
	public Integer getBeanPropertyCount(String beanName) {
		Class<?> cls;
		Field[] fields;
		int tl = 0;
		try {
			cls = Class.forName(beanName);
			fields = Class.forName(beanName).getDeclaredFields();
			for (int j = 0; j < fields.length; j++) {
				try {
					if (!fields[j].isAccessible()) {
						String fn = fields[j].getName();
						fn = "get" + fn.substring(0, 1).toUpperCase() + fn.substring(1);
						Method md = cls.getDeclaredMethod(fn);
						tl = (md!=null) ? tl + 1 : tl;
					}
				} catch (Exception ex) {
					ex.printStackTrace();
				}
			}
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SecurityException e) {
			e.printStackTrace();
		}
		return new Integer(tl);
	}	
	
	/**
	 * 获取业务逻辑实例
	 * 
	 * @param businessName
	 * @return
	 */
	private Object getBusinessInstance(String businessName) {
		Object obj = null;
		if (this.businessMap.get(businessName) == null) {
			try {
				Class daoClass = wac.getBean(businessName).getClass();
				obj = wac.getBean(businessName);
				this.businessMap.put(businessName, obj);
				this.businessClassMap.put(businessName, daoClass);
			} catch (Exception e) {
				log
						.error("BaseMgmImpl.getBusinessInstance: business instance getting problem.");
				log.error(e.getMessage());
			}
		} else {
			obj = this.businessMap.get(businessName);
		}
		return obj;
	}
	/*
	 * (non-Javadoc)
	 * @see com.ocean.webpmis.domain.business.BaseMgmFacade#buildColumnNodeTree(java.lang.String, java.lang.String, java.lang.String)
	 */
	public List<TreeNode> buildTree(String treeName,
			String parentId, String businessName, Map params) throws BusinessException {
		List<TreeNode> list = new ArrayList<TreeNode>();
		Object business = getBusinessInstance(businessName);
		try {
			Class partypes[] = new Class[3];
			partypes[0] = String.class; // treeName
			partypes[1] = String.class; // parentId
			partypes[2] = Map.class; // params			
			Method buildMethod = this.businessClassMap.get(businessName)
					.getDeclaredMethod("buildTree" ,partypes);
			list = (List<TreeNode>)buildMethod.invoke(business, treeName, parentId, params);
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}
		return list;
	}
	/*
	 * (non-Javadoc)
	 * @see com.ocean.webpmis.domain.business.BaseMgmFacade#buildColumnNodeTree(java.lang.String, java.lang.String, java.lang.String)
	 */
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,
			String parentId, String businessName, Map params) throws BusinessException {
		List<ColumnTreeNode> list = new ArrayList<ColumnTreeNode>();
		Object business = getBusinessInstance(businessName);
		try {
			Class partypes[] = new Class[3];
			partypes[0] = String.class; // treeName
			partypes[1] = String.class; // parentId
			partypes[2] = Map.class; // params			
			Method buildMethod = this.businessClassMap.get(businessName)
					.getDeclaredMethod("buildColumnNodeTree" ,partypes);
			list = (List<ColumnTreeNode>)buildMethod.invoke(business, treeName, parentId, params);
		} catch (SecurityException e) {
			e.printStackTrace();
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}
		return list;
	}
	
	public void initHibernateConfiguration() {
		LocalSessionFactoryBean  LocalSessionFactoryBean = (LocalSessionFactoryBean)this.wac.getBean("&sessionFactory1");
		this.hc = LocalSessionFactoryBean.getConfiguration();
	}
	
	public String getPropertyInfo(String entityName){
		if (this.hc == null)
			initHibernateConfiguration();
		PersistentClass pc = this.hc.getClassMapping(entityName);
		Property idp = pc.getIdentifierProperty();
		String idf = idp.getName();
		StringBuffer sbf = new StringBuffer("{identifier:'" + idf + "',properties:{");
		Column idc = (Column)idp.getColumnIterator().next();
		sbf.append(idf + ":" + getColumnInfo(idc)  + ",");
		Iterator itor = pc.getPropertyIterator();
		while(itor.hasNext()){
			Property pro = (Property)itor.next();
			if (!pro.isComposite()) {
				Iterator it = pro.getColumnIterator();
				Column col = (Column)it.next();
				sbf.append(pro.getName()+":");
				sbf.append(getColumnInfo(col)+",");
			}
		}
		if (sbf.lastIndexOf(",") == sbf.length() - 1)
			sbf.deleteCharAt(sbf.length() - 1);
		sbf.append("}}");
		return sbf.toString();
	}
	
	private StringBuffer getColumnInfo(Column col) {
		StringBuffer sbf = new StringBuffer("");
		sbf.append("{colname:'");
		sbf.append(col.getName());
		sbf.append("',comment:'");
		sbf.append(col.getComment());
		sbf.append("',length:");
		sbf.append(col.getLength());
		sbf.append(",nullable:'");
		sbf.append(col.isNullable());
		sbf.append("',javatype:'");
		sbf.append(col.getValue().getType().getReturnedClass().getName());
		sbf.append("'}");
		return sbf;
	}
	public String retrieve(String beanName, String id) {
		return JSONUtil.formObjectToJSONReaderStr(this.baseDAO.findById(beanName, id));
	}
	public String saveFormBean(String json, String bean, String pk) {
		String id = "";
		try {
			Object beanObj = JSONObject.toBean(
					JSONObject.fromObject(json), Class.forName(bean));
			if (pk==null || pk.equals("")) {
				id = this.baseDAO.insert(beanObj);
			}else {
				this.baseDAO.saveOrUpdate(beanObj);
				id = pk;
			}
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}

		return id;
	}
	
	public String getMd5Str(String str) {
		return str == null ? "" : MD5Util.getMd5().md5(str);
	}

}
