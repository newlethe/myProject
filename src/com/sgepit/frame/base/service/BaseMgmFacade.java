package com.sgepit.frame.base.service;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.web.context.WebApplicationContext;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.datastructure.TreeNode;


public interface BaseMgmFacade {
	
	/**
	 * general finding dispatcher
	 * @param businessName
	 * @param beanName
	 * @param methodName
	 * @param params
	 * @param orderby
	 * @param start
	 * @param limit
	 * @return
	 */
	List find(String businessName, String beanName, String methodName,
			String params, String orderby, Integer start, Integer limit);
	
	/**
	 * common finding Entity Bean
	 * @param ids required, use uuid
	 * @param beanName
	 * @return: Object identify by beanName 
	 */
	Object findById(String ids, String beanName);
	
	/**
	 * common finding operation, with orderby, pagenation
	 * @businessName: required
	 * @beanName: required while businessName is not BaseMgm 
	 * @methodName: required while businessName is not BaseMgm
	 * @orderby: optional, null is vaild
	 * @firstRow: optional, null is vaild, once null would no pagenation
	 * @maxRow: optional, null is vaild, once null would no pagenation
	 * @return: List of Object, while pagenation is effective, the last element is the total count of current query.
	*/
	List findOrderPage(String businessName, String beanName, String methodName, String orderby, Integer firstRow, Integer maxRow) throws Exception;

	
	
	/**
	 * finding operation, with where conditions, orderby, pagenation
	 * @businessName: required
	 * @beanName: required while businessName is not baseMgm 
	 * @methodName: required while businessName is not baseMgm
	 * @where: required
	 * @orderby: optional, null is vaild
	 * @firstRow: optional, null is vaild, once null would no pagenation
	 * @maxRow: optional, null is vaild, once null would no pagenation
	 * @return: List of Object, while pagenation is effective, the last element is the total count of current query.
	*/
	List findWhereOrderPage(String businessName, String beanName, String methodName, String where, String orderby, Integer firstRow, Integer maxRow) throws Exception;
	
	
	
	/**
	 * finding operation, with bean's property and value, where conditions, orderby, pagenation 
	 * @beanName: required
	 * @propertyName: required
	 * @value: required
	 * @orderby: optional, null is valid
	 * @firstRow: optional, null is vaild, once null would no pagenation
	 * @maxRow: optional, null is vaild, once null would no pagenation
	 * @return: List of Object, while pagenation is effective, the last element is the total count of current query.
	*/
	List findByPropertyOrderPage(String beanName, String propertyName, Object value, String orderby, Integer firstRow, Integer maxRow) throws Exception;

	/**
	 * finding operation, with bean's property and value, no pagenation
	 * @param beanName
	 * @param propertyName
	 * @param value
	 * @return single object of bean
	 */
	Object findBeanByProperty(String beanName, String propertyName, Object value);
	
	/**
	 * common save
	 * @businessName: required
	 * @beanName: required while businessName is not baseMgm 
	 * @methodName: required while businessName is not baseMgm
	 * @object: required
	*/
	void save(String businessName, String beanName, String methodName, Object object) throws Exception;
	
	
	
	/**
	 * common insert
	 * @businessName: required
	 * @beanName: required while businessName is not baseMgm 
	 * @methodName: required while businessName is not baseMgm
	 * @object: required
	*/
	void insert(String businessName, String beanName, String methodName, Object object) throws Exception;


	
	/**
	 * common delete
	 * @businessName: required, if it's not baseMgm, it must has a method named 'findById'
	 * @beanName: required while businessName is not baseMgm 
	 * @methodName: required while businessName is not baseMgm
	 * @ida: required, array contains beans's id, split by ","
	 * @return: how many beans has bean deleted successfully. 
	*/
	Integer delete(String businessName, String beanName,  String methodName, String[] ida) throws Exception;
	
	/**
	 * 设置 web application context
	 * @param wac
	 */
	void setWac(WebApplicationContext wac);

	/**
	 * 获取实体Bean的属性个数，仅限私有成员
	 * @param beanName
	 * @return
	 */
	Integer getBeanPropertyCount(String beanName);
	
	/**
	 * 更新之前，先将客户端提交的内容和实体Bean的全部属性进行合并
	 * @param beanName
	 * @param object
	 * @param primaryKey
	 * @param id
	 * @param set
	 * @return
	 * @throws Exception
	 */
	Object mergeBean(String beanName, Object object, String primaryKey,
			String id, Set<String> set) throws Exception;
	
	
	List getData(String sql);
	
	List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, String businessName, Map params) throws BusinessException;
	List<TreeNode> buildTree(String treeName, String parentId, String businessName, Map params) throws BusinessException;

	public List findWhereOrder(String businessName, String beanName,String methodName, String where, String orderBy);
	public List findByProperty(String beanName, String propertyName,Object value) throws BusinessException;		
	public List findByPropertyOrder(String beanName, String propertyName,Object value, String orderby) throws BusinessException;
	public List findAll(String beanName);
	public void deleteAll(String beanName);
	public Integer delete(Object object) throws SQLException;
	public Integer deleteAll(List list) throws SQLException;
	public Integer delete(String beanName, String id) throws SQLException;
	public Integer delete(String beanName, String[] ida) throws SQLException;

	/**
	 * 从Hibernate影射文件中获取实体bean属性的相关配置信息
	 * @param entityName
	 * @return
	 */
	public String getPropertyInfo(String entityName);

	String retrieve(String beanName, String id);

	String saveFormBean(String json, String bean, String id);
	
	public String getMd5Str(String str);
	
}