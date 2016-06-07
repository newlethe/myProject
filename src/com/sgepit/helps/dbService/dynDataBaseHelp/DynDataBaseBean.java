/** 
 * Title:        数据库应用: 
 * Description:  数据库动态对象应用
 * Company:      sgepit
 */
package com.sgepit.helps.dbService.dynDataBaseHelp;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.sgepit.helps.dbService.DbCon;
import com.sgepit.helps.dbService.exception.AttributeException;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.dbService.exception.InvokeException;
import com.sgepit.helps.dbService.sqlHelp.BuildSql;
import com.sgepit.helps.util.StringUtil;

/**
 * 数据库动态对象应用
 * 不需要bean对象，实现数据库对象持久化
 * @author lizp
 * @Date 2010-8-23
 */
public class DynDataBaseBean extends DynDataBaseModel {
	/**
	 * 初始化对象
	 * @param map 数据集
	 * @param tableName 表名
	 */
	public DynDataBaseBean(Map<String, Object> map, String tableName) {
		super(map, tableName);
	}
	
	public DynDataBaseBean(Map<String, Object> map, String tableName,List<String> keys) {
		super(map, tableName,keys);
	}
	
	public DynDataBaseBean(Map<String, Object> map, String tableName,List<String> keys,List<String> exclusiveList) {
		super(map, tableName,keys,exclusiveList);
	}
	
	public DynDataBaseBean(Map<String, Object> map, String tableName,List<String> keys,Map<String,String> mappingMap) {
		super(map, tableName,keys,mappingMap);
	}
	
	public DynDataBaseBean(String tableName,Map<String, Object> map,List<String> keys, 
			 List<String> exclusiveList,Map<String, String> mappingMap,
				List<String> likeFilterCol,List<String> orderList) {
		super(tableName,map,keys,exclusiveList,mappingMap,likeFilterCol,orderList);
	}

	/**
	 * 将Map对象插入数据库
	 * @throws AttributeException 
	 * @throws InvokeException 
	 * @throws SQLException 
	 * @throws DbPropertyException 
	 */
	public Integer insert() throws InvokeException, AttributeException, DbPropertyException, SQLException {
		List<String> keyList = this.getKeys();
		Map<String, Object> valueMap = super.getMap();
		for(String str : keyList) {
			if(super.getMap().get(str)==null){
				super.getMap().put(str, StringUtil.getUUID()) ;
			}
		}
		BuildSql buildSql = new BuildSql() ;
		String tableName = getMapTableName();
		buildSql.setValueMap(getMapValuesMap()) ;
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
	 */
	public Integer update() throws InvokeException, AttributeException, DbPropertyException, SQLException  {
		String tableName = getMapTableName();
		List<String> keyList = super.getKeys();
		BuildSql sqlHelper = new BuildSql() ;
		Map<String, Object> valueMap = getMapValuesMap() ;
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
		String tableName = getMapTableName();
		Map<String, String> mappingMap = super.getMappingMap() ;
		List<String> keyList = super.getKeys();
		List<String> excluList = super.getExclusiveList() ;
		BuildSql sqlHelper = new BuildSql() ;
		Map<String, Object> filteMap = new HashMap<String, Object>() ;
		Iterator<String> it = super.getMap().keySet().iterator();
		while(it.hasNext()) {
			String fieldName = it.next() ;
			Object value = super.getMap().get(fieldName) ;
			String name = fieldName ;
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
	 * @throws DynConfigException 
	 */
	public Integer saveOrUpdate() throws InvokeException, AttributeException, DbPropertyException,SQLException  {
		String tableName = getMapTableName();
		Map<String, String> mappingMap = super.getMappingMap() ;
		List<String> keyList = super.getKeys();
		List<String> excluList = super.getExclusiveList() ;
		BuildSql sqlHelper = new BuildSql() ;
		Map<String, Object> filteMap = new HashMap<String, Object>() ;
		Map<String, Object> valuesMap = new HashMap<String, Object>() ;
		Iterator<String> it = super.getMap().keySet().iterator();
		while(it.hasNext()) {
			String fieldName = it.next() ;
			Object value = super.getMap().get(fieldName) ;
			String name = fieldName ;
			if(!excluList.contains(fieldName)) { //如果不在排除列中
				if(mappingMap.containsKey(fieldName)) {  //如果存在映射关系
					name = mappingMap.get(fieldName) ;
				}
				if(keyList.contains(fieldName)) {
					filteMap.put(name, value) ;
				}else{
					valuesMap.put(name, value) ;
				}
			}
		}
		BuildSql buildSql = new BuildSql() ;
		buildSql.setTableName(tableName) ;
		buildSql.BuildSaveOrUpdateSql(filteMap,valuesMap) ;
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
		String tableName = getMapTableName();
		List<String> keyList = super.getKeys();
		List<String> excluList = super.getExclusiveList() ;
		List<String> likeFilterCol = super.getLikeFilterCol();
		Map<String, String> mappingMap = super.getMappingMap() ;
		BuildSql buildSql = new BuildSql() ;
		List<String> colList = new ArrayList<String>();
		Map<String, Object> filteMap = new HashMap<String, Object>() ;
		Map<String,String> likeFilterMap = new HashMap<String,String>() ; //模糊查询对象
		Iterator<String> it = super.getMap().keySet().iterator();
		while(it.hasNext()) {
			String fieldName = it.next() ;
			String name = fieldName ;
			Object value = super.getMap().get(fieldName) ;
			if(!excluList.contains(fieldName)) { //如果不在排除列中
				if(mappingMap.containsKey(fieldName)) {  //如果存在映射关系
					name = mappingMap.get(fieldName) ;
				}
//				colList.add(name) ;
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
		if(colList.size()>0) {
			buildSql.setColList(colList) ;
		}
		buildSql.setTableName(tableName);
		buildSql.setFilterMap(filteMap) ;
		buildSql.setLikeFilterMap(likeFilterMap) ;
		buildSql.setOrderList(super.getOrderList()) ;
		buildSql.BuildQuerySql() ;
		DbCon db = new DbCon();
		return db.querySql(buildSql) ;
	}
	
	/**
	 * 获得数据库表名
	 * @return
	 * @throws DbPropertyException 
	 */
	protected String getMapTableName() throws DbPropertyException {
		String tableName = super.getTableName() ;
		if(tableName==null) {
			throw new DbPropertyException("缺少表名！");
		}
		return tableName;
	}

	/**
	 * 获得Map对象映射到sql包装对象中
	 * @return 
	 * @throws AttributeException 
	 * @throws InvokeException 
	 */
	private Map<String, Object> getMapValuesMap() throws InvokeException, AttributeException {
		List<String> excluList = super.getExclusiveList() ;
		Map<String, String> mappingMap = super.getMappingMap() ;
		Map<String, Object> valueMap = new HashMap<String, Object>();
		Iterator<String> it = super.getMap().keySet().iterator();
		while(it.hasNext()) {
			String fieldName = it.next() ;
			String name = fieldName ;
			if(!excluList.contains(fieldName)) { //如果不在排除列中
				if(mappingMap.containsKey(fieldName)) {  //如果存在映射关系
					name = mappingMap.get(fieldName) ;
				}
				Object value = super.getMap().get(fieldName) ;
				valueMap.put(name, value) ;
			}
		}
		return valueMap;
	}
}
