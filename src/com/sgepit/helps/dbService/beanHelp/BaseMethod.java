/** 
 * Title:        数据库应用: 
 * Description:  数据库对象基础方法应用
 * Company:      sgepit
 */
package com.sgepit.helps.dbService.beanHelp;

import java.lang.reflect.Field;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.sgepit.helps.dbService.DbCon;
import com.sgepit.helps.dbService.exception.AttributeException;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.dbService.exception.InvokeException;
import com.sgepit.helps.dbService.sqlHelp.BuildSql;
import com.sgepit.helps.util.StringUtil;

/**
 * 数据库对象基础方法应用(提供增删改查基础方法)
 * 同时提供saveorupdate方法
 * @author lizp
 * @Date 2010-8-12
 */
public class BaseMethod extends BeanContrl {
	/**
	 * 将bean对象插入数据库
	 * @return 返回更新条数，-1为更新失败
	 * @throws AttributeException 
	 * @throws InvokeException 
	 * @throws SQLException 
	 * @throws DbPropertyException 
	 * 
	 *  zz_frame_test zft = new zz_frame_test(); javabean
	 *	copyItem.MoveCorrespond(zft, element); 把 节点数据保存到  zft中
	 *	int j =  zft.insert(); 添加到数据。 如果返回 -1 说明返回失败。
	 * 
	 */
	public Integer insert() throws InvokeException, AttributeException, DbPropertyException, SQLException {
		List<String> keyList = this.getKeys();
		for(String str : keyList) {
			if(getAttributeValue(str)==null) {
				setAttributeValue(str,UUID.randomUUID() ) ;
			}
		}
		BuildSql buildSql = new BuildSql() ;
		Map<String, Object> valueMap = getBeanValuesMap() ;
		String tableName = getBeanTableName();
		buildSql.setValueMap(valueMap) ;
		buildSql.setTableName(tableName) ;
		buildSql.BuildInsertSql() ;
		DbCon db = new DbCon();
		return db.updateSql(buildSql) ;
	}
	
	/**
	 * 将bean对象更新进数据库
	 * @return 返回更新条数，-1为更新失败
	 * @throws AttributeException 
	 * @throws InvokeException 
	 * @throws DbPropertyException 
	 * @throws SQLException 
	 * 
	 * 如添加同理。
	 */
	public Integer update() throws InvokeException, AttributeException, DbPropertyException, SQLException  {
		String tableName = getBeanTableName();
		List<String> keyList = super.getKeys();
		BuildSql sqlHelper = new BuildSql() ;
		Map<String, Object> valueMap = getBeanValuesMap() ;
		Map<String, Object> filteMap = new HashMap<String, Object>() ;
		Map<String, Object> values = new HashMap<String, Object>() ;
		Iterator<String> it = valueMap.keySet().iterator();
		while(it.hasNext()) {
			String key = it.next() ;
			if(keyList.contains(key)) {
				filteMap.put(key, valueMap.get(key)) ;
			}else{
				values.put(key, valueMap.get(key)) ;
			}
		}
		BuildSql buildSql = new BuildSql() ;
		buildSql.setTableName(tableName) ;
		buildSql.setFilterMap(filteMap) ;
		buildSql.setValueMap(values) ;
		buildSql.BuildUpdateSql() ;
		DbCon db = new DbCon();
		return db.updateSql(buildSql) ;
	}
	
	/**
	 * 删除满足bean对象主键值条件的对象
	 * @return 返回更新条数，-1为更新失败
	 * @throws InvokeException
	 * @throws AttributeException
	 * @throws DbPropertyException
	 * @throws SQLException
	 */
	public Integer delete() throws InvokeException, AttributeException, DbPropertyException, SQLException  {
		String tableName = getBeanTableName();
		Map<String, String> mappingMap = super.getMappingMap() ;
		List<String> keyList = super.getKeys();
		List<String> excluList = super.getExclusiveList() ;
		BuildSql sqlHelper = new BuildSql() ;
		Map<String, Object> filteMap = new HashMap<String, Object>() ;
		Field[] fields = this.getClass().getDeclaredFields();
		for(Field field : fields) {
			String fieldName = field.getName() ;
			String name = fieldName ;
			Object value = getAttributeValue(fieldName) ;
			if(!excluList.contains(fieldName)) { //如果不在排除列中
				if(mappingMap.containsKey(fieldName)) {  //如果存在映射关系
					name = mappingMap.get(fieldName) ;
				}
				if(keyList.contains(fieldName)) {
					filteMap.put(name, value) ;
				}
			}
		}
		BuildSql buildSql = new BuildSql() ;
		buildSql.setTableName(tableName) ;
		buildSql.setFilterMap(filteMap) ;
		buildSql.BuildDeleteSql() ;
		DbCon db = new DbCon();
		return db.updateSql(buildSql) ;
	}
	
	/**
	 * 更新或者新增(根据主键条件判断新增或者更新)
	 * @return 返回更新条数，-1为更新失败
	 * @throws InvokeException
	 * @throws AttributeException
	 * @throws DbPropertyException
	 * @throws SQLException
	 */
	public Integer saveOrUpdate() throws InvokeException, AttributeException, DbPropertyException,SQLException  {
		String tableName = getBeanTableName();
		Map<String, String> mappingMap = super.getMappingMap() ;
		List<String> keyList = super.getKeys();
		List<String> excluList = super.getExclusiveList() ;
		BuildSql sqlHelper = new BuildSql() ;
		Map<String, Object> filteMap = new HashMap<String, Object>() ;
		Map<String, Object> valueMap = new HashMap<String, Object>() ;
		Field[] fields = this.getClass().getDeclaredFields();
		for(Field field : fields) {
			String fieldName = field.getName() ;
			String name = fieldName ;
			Object value = getAttributeValue(fieldName) ;
			if(!excluList.contains(fieldName)) { //如果不在排除列中
				if(mappingMap.containsKey(fieldName)) {  //如果存在映射关系
					name = mappingMap.get(fieldName) ;
				}
				if(keyList.contains(fieldName)) {
					filteMap.put(name, value) ;
				}else{
					valueMap.put(name, value) ;
				}
			}
		}
		BuildSql buildSql = new BuildSql() ;
		buildSql.setTableName(tableName) ;
		buildSql.BuildSaveOrUpdateSql(filteMap,valueMap) ;
		DbCon db = new DbCon();
		return db.updateSql(buildSql) ;
	}
	
	/**
	 * 查询满足bean对象主键值的集合
	 * @return 
	 * @throws InvokeException
	 * @throws AttributeException
	 * @throws DbPropertyException
	 * @throws SQLException
	 */
	public List<Map<String,Object>> query() throws InvokeException, AttributeException, DbPropertyException , SQLException {
		String tableName = getBeanTableName();
		List<String> keyList = super.getKeys();
		List<String> excluList = super.getExclusiveList() ;
		List<String> likeFilterCol = super.getLikeFilterCol();
		Map<String, String> mappingMap = super.getMappingMap() ;
		BuildSql buildSql = new BuildSql() ;
		List<String> colList = new ArrayList<String>();
		Map<String, Object> filteMap = new HashMap<String, Object>() ;
		Map<String,String> likeFilterMap = new HashMap<String,String>() ; //模糊查询对象
		Field[] fields = this.getClass().getDeclaredFields();
		for(Field field : fields) {
			String fieldName = field.getName() ;
			String name = fieldName ;
			Object value = getAttributeValue(fieldName) ;
			if(!excluList.contains(fieldName)) { //如果不在排除列中
				if(mappingMap.containsKey(fieldName)) {  //如果存在映射关系
					name = mappingMap.get(fieldName) ;
				}
				colList.add(name) ;
				if(likeFilterCol.contains(fieldName)) {
					if(value!=null){
						likeFilterMap.put(name, StringUtil.objectToString(value)) ;
					}
				}else if(keyList.contains(fieldName)) {
					if(value!=null) {
						filteMap.put(name, value) ;
					}
				}
			}
		}
		buildSql.setColList(colList) ;
		buildSql.setTableName(tableName);
		buildSql.setFilterMap(filteMap) ;
		buildSql.setLikeFilterMap(likeFilterMap) ;
		buildSql.setExtendFilters(super.getExtendFilters()) ;
		buildSql.setRelationMap(super.getRelationMap()) ;
		buildSql.setOrderList(super.getOrderList()) ;
		buildSql.BuildQuerySql() ;
		DbCon db = new DbCon();
		return db.querySql(buildSql) ;
	}
	
	/**
	 * 获得数据库表名
	 * @return 返回 数据库的表名。
	 * 
	 * javabean 可以是我们的数据库表名。 也可以不是， 我们可以自己设定这个。设的名字必须和数据库的名字一致。
	 * 
	 * public class zz_frame_test extends BaseBean{
	 *
     *	public zz_frame_test(){
     *		super.setTableName("frame");
	 *	}
	 *
	 */
	protected String getBeanTableName() {
		String tableName = super.getTableName() ;
		if(tableName==null) {
			tableName = this.getClass().getSimpleName() ;
		}
		return tableName;
	}

	/**
	 * 获得bean对象映射到sql包装对象中
	 * @return 
	 * @throws AttributeException 
	 * @throws InvokeException 
	 */
	private Map<String, Object> getBeanValuesMap() throws InvokeException, AttributeException {
		List<String> excluList = super.getExclusiveList() ;
		Map<String, String> mappingMap = super.getMappingMap() ;
		Map<String, Object> valueMap = new HashMap<String, Object>();
		Field[] fields = this.getClass().getDeclaredFields();
		for(Field field : fields) {
			String fieldName = field.getName() ;
			String name = fieldName ;
			if(!excluList.contains(fieldName)) { //如果不在排除列中
				if(mappingMap.containsKey(fieldName)) {  //如果存在映射关系
					name = mappingMap.get(fieldName) ;
				}
				Object value = getAttributeValue(fieldName) ;
				valueMap.put(name, value) ;
			}
		}
		return valueMap;
	}
	
	/**
	 * 字符串数组转换成list对象
	 * @param s 字符数组
	 * @return
	 */
	public static List<String> arrayToList(String[] s) {
		List<String> list = new ArrayList<String>() ;
		for(String key : s) {
			list.add(key) ;
		}
		return list ;
	}
}
