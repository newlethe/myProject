/** 
 * Title:        数据库应用: 
 * Description:  数据库对象应用
 * Company:      sgepit
 */
package com.sgepit.helps.dbService.beanHelp;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * 数据库控制模型
 * 主键管理、对应关系管理、排序列管理
 * @author lizp
 * @Date 2010-8-12
 */
public class BeanContrl extends BeanUtil {
	private List<String> keys = new ArrayList<String>() ;  //主键列名称
	private Map<String,String> mappingMap = new HashMap<String,String>() ; //对应关系配置
	private List<String> exclusiveList = new ArrayList<String>() ; //排除列
	private List<String> orderList = new ArrayList<String>() ; //排序列
	private List<String> likeFilterCol = new ArrayList<String>() ; //模糊查询对象
	private Map<String,String> relationMap = new HashMap<String,String>() ; //关系对象(应用于多表关联)
	private List<String> extendFilters = new ArrayList<String>() ;//追加过滤条件
	private String tableName ;
	
	/**
	 * 获得模糊查询列
	 * @return
	 */
	protected List<String> getLikeFilterCol() {
		return likeFilterCol;
	}
	/**
	 * 设置模糊查询列
	 * @param likeFilterCol
	 */
	public void setLikeFilterCol(List<String> likeFilterCol) {
		this.likeFilterCol = likeFilterCol;
	}
	/**
	 * 获得主键列集合
	 * @return
	 */
	public List<String> getKeys() {
		return keys;
	}
	/**
	 * 获取对应关系集合(bean属性名-数据库字段名)
	 * @return
	 */
	protected Map<String, String> getMappingMap() {
		return mappingMap;
	}
	
	/**
	 * 获取对应关系集合(数据库字段名-bean属性名)
	 * @return
	 */
	public Map<String, String> getMapMappingMap() {
		Map<String,String> mapMappingMap = new HashMap<String,String>() ;
		Iterator<String> it = mappingMap.keySet().iterator();
		while(it.hasNext()) {
			String key = it.next() ;
			String value = mappingMap.get(key) ;
			String[] values = value.split("[.]");
			mapMappingMap.put(values[values.length-1], key) ;
		}
		return mapMappingMap;
	}
	/**
	 * 获取排除列
	 * @return
	 */
	protected List<String> getExclusiveList() {
		return exclusiveList;
	}
	/**
	 * 获得排序列
	 * @return
	 */
	protected List<String> getOrderList() {
		return orderList;
	}
	/**
	 * 获得表名
	 * @return
	 */
	protected String getTableName() {
		return tableName;
	}
	/**
	 * 设置表名
	 * @param tableName
	 */
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	/**
	 * 设置主键列名(设置为bean对象属性名)
	 * @param keys 主键列集合
	 */
	public void setKeys(List<String> keys) {
		this.keys = keys;
	}
	/**
	 * 增加主键列名(设置为bean对象属性名)
	 * @param key 主键列
	 */
	protected void addKeys(String key) {
		this.keys.add(key) ;
	}
	
	/**
	 * 设置对应关系
	 * @param mappingMap 对应关系集合
	 */
	protected void setMappingMap(Map<String, String> mappingMap) {
		this.mappingMap = mappingMap;
	}
	/**
	 * 增加对应关系
	 * @param key bean属性列名称
	 * @param value 数据库字段名称
	 */
	protected void addMappingMap(String key,String value) {
		this.mappingMap.put(key, value) ;
	}
	
	/**
	 * 设置排序方式(排序字段设置为数据库字段，并可直接带上排序方式)
	 * @param orderList 排序列集合
	 */
	public void setOrderList(List<String> orderList) {
		this.orderList = orderList;
	}
	
	/**
	 * 设置排除列(设置bean属性字段)
	 * @param exclusiveList
	 */
	public void setExclusiveList(List<String> exclusiveList) {
		this.exclusiveList = exclusiveList;
	}
	/**
	 * 增加排除列
	 * @param exclusive
	 */
	protected void addExclusiveList(String exclusive) {
		this.exclusiveList.add(exclusive) ;
	}
	public Map<String, String> getRelationMap() {
		return relationMap;
	}
	public void setRelationMap(Map<String, String> relationMap) {
		this.relationMap = relationMap;
	}
	public List<String> getExtendFilters() {
		return extendFilters;
	}
	public void setExtendFilters(List<String> extendFilters) {
		this.extendFilters = extendFilters;
	}
}
