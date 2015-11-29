/** 
 * Title:        数据库应用: 
 * Description:  数据库动态对象模型
 * Company:      sgepit
 */
package com.sgepit.helps.dbService.dynDataBaseHelp;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 数据库动态对象模型
 * 不需要bean对象，实现数据库对象持久化
 * @author lizp
 * @Date 2010-8-23
 */
public class DynDataBaseModel {
	private List<String> keys = new ArrayList<String>() ;  //主键列名称
	private Map<String,String> mappingMap = new HashMap<String,String>() ; //对应关系配置
	private Map<String,Object> map = new HashMap<String,Object>() ; //属性值集合
	private List<String> exclusiveList = new ArrayList<String>() ; //排除列
	private List<String> orderList = new ArrayList<String>() ; //排序列
	private List<String> likeFilterCol = new ArrayList<String>() ; //模糊查询对象
	private String tableName ;

	public DynDataBaseModel(Map<String, Object> map, String tableName) {
		if(map!=null) {
			this.map = map;
		}
		if(tableName!=null) {
			this.tableName = tableName;
		}
	}
	
	public DynDataBaseModel(Map<String, Object> map, String tableName,List<String> keys) {
		if(map!=null) {
			this.map = map;
		}
		if(tableName!=null) {
			this.tableName = tableName;
		}
		if(keys!=null) {
			this.keys = keys;
		}
	}
	
	public DynDataBaseModel(Map<String, Object> map, String tableName,List<String> keys,List<String> exclusiveList) {
		if(map!=null) {
			this.map = map;
		}
		if(tableName!=null) {
			this.tableName = tableName;
		}
		if(keys!=null) {
			this.keys = keys;
		}
		if(exclusiveList!=null) {
			this.exclusiveList = exclusiveList;
		}
	}
	
	public DynDataBaseModel(Map<String, Object> map, String tableName,List<String> keys,Map<String,String> mappingMap) {
		if(map!=null) {
			this.map = map;
		}
		if(tableName!=null) {
			this.tableName = tableName;
		}
		if(keys!=null) {
			this.keys = keys;
		}
		if(mappingMap!=null) {
			this.mappingMap = mappingMap;
		}
	}
	
	public DynDataBaseModel(String tableName,Map<String, Object> map,List<String> keys, 
			 List<String> exclusiveList,Map<String, String> mappingMap,
			List<String> likeFilterCol,List<String> orderList) {
		if(keys!=null) {
			this.keys = keys;
		}
		if(mappingMap!=null) {
			this.mappingMap = mappingMap;
		}
		if(map!=null) {
			this.map = map;
		}
		if(exclusiveList!=null) {
			this.exclusiveList = exclusiveList;
		}
		if(orderList!=null) {
			this.orderList = orderList;
		}
		if(likeFilterCol!=null) {
			this.likeFilterCol = likeFilterCol;
		}
		if(tableName!=null) {
			this.tableName = tableName;
		}
	}

	public List<String> getKeys() {
		return keys;
	}
	public void setKeys(List<String> keys) {
		this.keys = keys;
	}
	protected Map<String, String> getMappingMap() {
		return mappingMap;
	}
	public void setMappingMap(Map<String, String> mappingMap) {
		this.mappingMap = mappingMap;
	}
	protected Map<String, Object> getMap() {
		return map;
	}
	public void setMap(Map<String, Object> map) {
		this.map = map;
	}
	protected List<String> getExclusiveList() {
		return exclusiveList;
	}
	public void setExclusiveList(List<String> exclusiveList) {
		this.exclusiveList = exclusiveList;
	}
	protected List<String> getOrderList() {
		return orderList;
	}
	public void setOrderList(List<String> orderList) {
		this.orderList = orderList;
	}
	protected List<String> getLikeFilterCol() {
		return likeFilterCol;
	}
	public void setLikeFilterCol(List<String> likeFilterCol) {
		this.likeFilterCol = likeFilterCol;
	}
	protected String getTableName() {
		return tableName;
	}
	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
}
