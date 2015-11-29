/** 
 * Title:        数据库应用: 
 * Description:  数据库对象应用
 * Company:      sgepit
 */
package com.sgepit.helps.dbService.beanHelp;

import java.lang.reflect.Field;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sgepit.helps.dbService.DbCon;
import com.sgepit.helps.dbService.bandHelp.BeanBandUtil;
import com.sgepit.helps.dbService.exception.AttributeException;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.dbService.exception.InvokeException;
import com.sgepit.helps.dbService.sqlHelp.BuildSql;
import com.sgepit.helps.util.StringUtil;

/**
 * 数据库对象应用基础模型
 * 所有基于数据库对象应用的类都需要继承此对象
 * 继承的bean对象中属性类型不能为基本类型，如果需要使用基本类型请使用基本类型的包装对象
 * 如：int使用Integer，short使用Short  数字用 BigDecimal类比较好。
 * @author lizp
 * @Date 2010-8-12
 * 
 * javabean中继承的类，如  public class zz_company extends BaseBean
 * 
 * 
 */
public class BaseBean extends BaseMethod{
	/**
	 * 根据逻辑条键更新
	 * 集合中为主键列名称(bean对象属性名)
	 * @param keys 逻辑主键集合
	 * @return -1为失败 其它为 成功保存的条数
	 * @throws InvokeException  反射书异常
	 * @throws AttributeException 获取属性异常
	 * @throws DbPropertyException  获取数据库配置异常
	 * @throws SQLException  执行sql 异常
	 * 
	 * 更新一条记录。还用zz_company的 javabean举例
	 * 
	 * zz_company zcompany = new zz_company();
	 * zcompany.setKey("sdfsdf");
	 * zcompany.setUsername("pean");
	 * zcompany.update("key");
	 * 
	 * 这里就是为key为条件进行本条数据的更新， 它会执行一个如 update zz_company set username = 'pean'  where key = 'sdfsdf' 这样的sql语句。
	 * 
	 * 
	 */
	public Integer update(String...keys) throws InvokeException, AttributeException,DbPropertyException,SQLException {
		super.setKeys(super.arrayToList(keys)) ;
		return super.update() ;
	}
	
	/**
	 * 根据逻辑主键删除
	 * 集合中为主键列名称(bean对象属性名)
	 * @param keys 逻辑条件集合
	 * @return 返回更新条数，-1为更新失败
	 * @throws InvokeException  反射书异常
	 * @throws AttributeException 获取属性异常
	 * @throws DbPropertyException  获取数据库配置异常
	 * @throws SQLException  执行sql 异常
	 * 
	 * 用我们生成的 javabean 调用这个方法。可以按传入的条件名字来进行删除。
	 * 
	 * zz_company zcompany = new zz_company();
	 * zcompany.setKey("sdfsdf");
	 * zcompany.delete("key"); 
	 * 
	 *  它会执行一个如 delete zz_company  where key = 'sdfsdf' 这样的sql语句。
	 */
	public Integer delete(String...keys) throws InvokeException, AttributeException, DbPropertyException, SQLException  {
		super.setKeys(super.arrayToList(keys)) ;
		return super.delete() ;
	}
	
	/**
	 * 根据逻辑主键更新或者新增(根据主键条件判断新增或者更新)
	 * 集合中为主键列名称(bean对象属性名)
	 * @param keys 逻辑主键集合
	 * @return 返回更新条数，-1为更新失败
	 * @throws InvokeException  反射书异常
	 * @throws AttributeException 获取属性异常
	 * @throws DbPropertyException  获取数据库配置异常
	 * @throws SQLException  执行sql 异常
	 * 
	 * 把添加和修改方法以写到了一起。
	 * 
	 */
	public Integer saveOrUpdate(String...keys) throws InvokeException, AttributeException, DbPropertyException, SQLException {
		super.setKeys(super.arrayToList(keys)) ;
		return super.saveOrUpdate();
	}
	/**
	 * 查询满足bean对象主键值的集合
	 * @return 返回List<BaseBean>对象，便于操作使用BaseBean对象
	 * @throws InvokeException  反射书异常
	 * @throws AttributeException 获取属性异常
	 * @throws DbPropertyException  获取数据库配置异常
	 * @throws SQLException  执行sql 异常
	 * 
	 * 查询的方法。
	 * 
	 * zz_company zcompany = new zz_company();
	 * zcompany.setKey("sdfsdf");
	 * List<zz_company> list = zcompany.queryByBaseBean();
	 * 
	 * 如果我们给  zcompany set 值 那我们就是按条件进行查询。
	 * 上面我们只会查到一条  key 为 sdfsdf 的记录。
	 */
	public List<BaseBean> queryByBaseBean() throws InvokeException, AttributeException, DbPropertyException, SQLException  {
		String tableName = super.getBeanTableName();
		List<String> keyList = super.getKeys();
		List<String> excluList = super.getExclusiveList() ;
		List<String> likeFilterCol = super.getLikeFilterCol();
		Map<String, String> mappingMap = super.getMappingMap() ;
		Map<String,String> likeFilterMap = new HashMap<String,String>() ; //模糊查询对象
		BuildSql buildSql = new BuildSql() ;
		List<String> colList = new ArrayList<String>();
		Map<String, Object> filteMap = new HashMap<String, Object>() ;
		Field[] fields = this.getClass().getDeclaredFields();
		for(Field field : fields) {
			String fieldName = field.getName() ;
			String name = fieldName ;
			if(!excluList.contains(fieldName)) { //如果不在排除列中
				if(mappingMap.containsKey(fieldName)) {  //如果存在映射关系
					name = mappingMap.get(fieldName) ;
				}
				colList.add(name) ;
				if(likeFilterCol.contains(fieldName)) {
					Object value = getAttributeValue(fieldName) ;
					if(value!=null){
						likeFilterMap.put(name, StringUtil.objectToString(value)) ;
					}
				}else if(keyList.contains(fieldName)) {
					Object value = getAttributeValue(fieldName) ;
					if(value!=null) {
						filteMap.put(name, value) ;
					}
				}
			}
		}
		buildSql.setColList(colList) ;
		buildSql.setTableName(tableName);
		buildSql.setFilterMap(filteMap) ;
		buildSql.setExtendFilters(super.getExtendFilters()) ;
		buildSql.setRelationMap(super.getRelationMap()) ;
		buildSql.setLikeFilterMap(likeFilterMap) ;
		buildSql.setOrderList(super.getOrderList()) ;
		buildSql.BuildQuerySql() ;
		DbCon db = new DbCon();
		return db.queryBean(buildSql,this) ;
	}
	/**
	 * 查询满足bean对象主键值的集合
	 * @return 返回无特定类型的List对象，便于强制类型转换
	 * @throws InvokeException  反射书异常
	 * @throws AttributeException 获取属性异常
	 * @throws DbPropertyException  获取数据库配置异常
	 * @throws SQLException  执行sql 异常
	 * 如上面的同理。
	 */
	public List queryBean() throws InvokeException, AttributeException, DbPropertyException, SQLException  {
		return queryByBaseBean() ;
	}
	
	/**
	 * 根据逻辑主键查询满足bean对象主键值的集合
	 * 集合中为主键列名称(bean对象属性名)
	 * @param keys 逻辑主键集合
	 * @return 
	 * @throws InvokeException  反射书异常
	 * @throws AttributeException 获取属性异常
	 * @throws DbPropertyException  获取数据库配置异常
	 * @throws SQLException  执行sql 异常
	 * 
	 * 这个方法 只是返回一个  存有 map的 list 数据集合。 map 中存放着  以  数据库列名为key 数据集合。
	 * 
	 * zz_company zcompany = new zz_company();
	 * List<Map<String,Object>> list = zcompany.query(“key”);
	 * 
	 */
	public List<Map<String,Object>> query(String...keys) throws InvokeException, AttributeException, DbPropertyException, SQLException  {
		super.setKeys(super.arrayToList(keys)) ;
		return super.query() ;
	}
	
	/**
	 * 根据逻辑主键查询满足bean对象主键值的集合
	 * 集合中为主键列名称(bean对象属性名)
	 * @param keys 逻辑主键集合
	 * @return 返回List<BaseBean>对象，便于操作使用BaseBean对象
	 * @throws InvokeException  反射书异常
	 * @throws AttributeException 获取属性异常
	 * @throws DbPropertyException  获取数据库配置异常
	 * @throws SQLException  执行sql 异常
	 */
	public List<BaseBean> queryByBaseBean(String...keys) throws InvokeException, AttributeException, DbPropertyException, SQLException  {
		List<Map<String,Object>> list = query(keys) ;
		return BeanBandUtil.bandListMapToListBean(list, this.getClass()) ;
	}
	/**
	 * 根据逻辑主键查询满足bean对象主键值的集合
	 * 集合中为主键列名称(bean对象属性名)
	 * @param keys 逻辑主键集合
	 * @return 返回无特定类型的List对象，便于强制类型转换
	 * @throws InvokeException  反射书异常
	 * @throws AttributeException 获取属性异常
	 * @throws DbPropertyException  获取数据库配置异常
	 * @throws SQLException  执行sql 异常
	 */
	public List queryBean(String...keys) throws InvokeException, AttributeException, DbPropertyException, SQLException  {
		super.setKeys(super.arrayToList(keys)) ;
		return queryByBaseBean() ;
	}
	
}
