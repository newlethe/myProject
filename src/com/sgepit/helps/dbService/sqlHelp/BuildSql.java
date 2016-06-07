/** 
 * Title:        数据库应用: 
 * Description:  sql应用
 * Company:      sgepit
 */
package com.sgepit.helps.dbService.sqlHelp;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.sgepit.helps.util.StringUtil;
/**
 * sql生成对象应用
 * 用于生成sql语句
 * @author lizp
 * @Date 2010-8-12
 */
public class BuildSql {
	private String tableName = null ;   //表名
	private String sequencelabel = null ; //序列列列名
	private String sequencelvalue = null ; //序列名称
	private Map<String,Object> filterMap = new HashMap<String,Object>() ; //过滤器对象
	private Map<String,String> likeFilterMap = new HashMap<String,String>() ; //模糊查询对象
	private Map<String,String> relationMap = new HashMap<String,String>() ; //关系对象(应用于多表关联)
	private List<String> extendFilters = new ArrayList<String>() ;//追加过滤条件
	private Map<String,Object> valueMap = new HashMap<String,Object>() ; //值集合对象
	private List<String> colList = new ArrayList<String>() ; //列集合对象
	private List<String> orderList = new ArrayList<String>() ; //排序对象
	
	private Object[] obj = null ;
	private String sql = null ;
	
	private int fromNum = -1 ;  //分页查询开始序号
	private int toNum = -1 ;  //分页查询结束序号
	
	/**
	 * 设置分页查询开始序号
	 * @param fromNum 开始序号
	 */
	public void setFromNum(int fromNum) {
		this.fromNum = fromNum;
	}
	/**
	 * 设置分页查询结束序号
	 * @param toNum 结束序号
	 */
	public void setToNum(int toNum) {
		this.toNum = toNum;
	}
	
	public Object[] getObj() {
		return obj;
	}

	public String getSql() {
		return sql;
	}
	
	public void setSequencelabel(String sequencelabel) {
		this.sequencelabel = sequencelabel;
	}

	public void setSequencelvalue(String sequencelvalue) {
		this.sequencelvalue = sequencelvalue;
	}

	public void setFilterMap(Map<String, Object> filterMap) {
		this.filterMap = filterMap;
	}

	public void setLikeFilterMap(Map<String, String> likeFilterMap) {
		this.likeFilterMap = likeFilterMap;
	}

	public void setValueMap(Map<String, Object> valueMap) {
		this.valueMap = valueMap;
	}

	public void setColList(List<String> colList) {
		this.colList = colList;
	}

	public void setOrderList(List<String> orderList) {
		this.orderList = orderList;
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
	/**
	 * 设置表名
	 * @param tableName 表名
	 */
	public void setTableName(String tableName) {
		this.tableName = tableName ;
	}
	
	/**
	 * 设置模糊查询过滤条件(for select)
	 * @param colname
	 * @param value
	 */
	public void setlikeFilter(String colname,String value) {
		likeFilterMap.put(colname,value.replaceAll("\\*", "%")) ;
	}
	
	/**
	 * 设置过滤条件(for update or select)
	 * @param colname 列名
	 * @param value 列对应的值
	 */
	public void setFilter(String colname,Object value) {
		filterMap.put(colname,value) ;
	}
	/**
	 * 设置序列主键
	 * @param colname 列名
	 * @param value 列对应的值
	 */
	public void setKeyMap(String sequencelabel,String sequencevalue) {
		this.sequencelabel = sequencelabel ;
		this.sequencelvalue = sequencevalue ;
	}
	
	/**
	 * 设置查询列(for select)
	 * @param colname
	 */
	public void setCol(String colname) {
		colList.add(colname) ;
	}
	
	/**
	 * 设置列值(for update or insert)
	 * @param colname
	 * @param value
	 */
	public void setValue(String colname,Object value) {
		valueMap.put(colname, value) ;
	}
	
	/**
	 * 生成查询sql
	 * @return 
	 */
	public void BuildQuerySql() {
		query() ;
	}
	
	/**
	 * 生成查询sql实现
	 */
	private void query()  {
		this.sql = "select " ;
		if(colList!=null&&filterMap!=null) {
			this.obj = new Object[filterMap.size()] ;
		}
		String col = "" ;
		int index = 1 ;
		if(colList.size()==0)  {
			col = "*" ;
		} else {
			for(int i=0;i<colList.size();i++)  {
				col +=","+colList.get(i) ;
			}
			col = col.substring(1) ;
		}
		this.sql += col+" from "+tableName ;
		int size = 0 ;
		String filter = "" ;
		if(filterMap!=null&&filterMap.size()>0) {
			Iterator<String> it = filterMap.keySet().iterator() ;
			while(it.hasNext()) {
				Object key = it.next() ;
				filter +="and "+key.toString()+"=? " ;
				this.obj[size++] = filterMap.get(key) ;
			}
		}
		String likefilter = "" ;
		if(likeFilterMap!=null&&likeFilterMap.size()>0)  {
			Iterator<String> it = likeFilterMap.keySet().iterator() ;
			while(it.hasNext()) {
				Object key = it.next() ;
				likefilter +=" and "+key+" like  '%"+likeFilterMap.get(key)+"%'" ;
			}
		}
		String relations = "" ;
		if(this.relationMap!=null&&relationMap.size()>0) {
			Iterator<String> it = relationMap.keySet().iterator() ;
			while(it.hasNext()) {
				Object key = it.next() ;
				relations +=" and "+key+" = "+relationMap.get(key) ;
			}
		}
		String extendstr = "" ;
		if(this.extendFilters!=null&&extendFilters.size()>0) {
			for(String s : extendFilters) {
				extendstr += " and "+s ;
			}
		}
		this.sql += " where 1=1 "+filter+likefilter+relations+extendstr ;
		if(this.orderList.size()>0) {
			this.sql += " order by " ;
			for(String order : orderList) {
				this.sql += order+"," ;
			}
			this.sql = sql.substring(0, sql.length()-1) ;
		}
		System.out.println(this.sql);
		BuildPageSql() ;
	}
	
	/**
	 * 生成更新sql
	 */
	public void BuildUpdateSql() {
		update() ;
	}
	/**
	 * 生成更新sql实现
	 */
	private void update() {
		sql = "update "+tableName+" set " ;
		this.obj = new Object[valueMap.size()+filterMap.size()] ;
		String valuesql = "" ;
		int index = 0 ;
		Iterator<String> vit = valueMap.keySet().iterator() ;
		while(vit.hasNext()) {
			Object key = vit.next() ;
			valuesql +=","+key.toString()+"=? " ;
			this.obj[index++] = valueMap.get(key) ;
		}
		sql += valuesql.substring(1) ;
		String filter = " 1=1 " ;
		if(filterMap.size()>0) {
			Iterator<String> it = filterMap.keySet().iterator() ;
			while(it.hasNext()) {
				Object key = it.next() ;
				filter +=" and "+key.toString()+"=? " ;
				this.obj[index++] = filterMap.get(key) ;
			}
			sql += " where "+filter ;
		}
	}
	
	/**
	 * 生成新增sql
	 */
	public void BuildInsertSql(){
		insert() ;
	}
	/**
	 * 生成新增sql实现
	 */
	private void insert(){
		if(valueMap.size()>0) {
			sql = "insert into "+tableName+" " ;
			obj = new Object[valueMap.size()] ;
			String valuesql = "" ;
			String labelsql = "" ;
			int index = 0 ;
			Iterator<String> vit = valueMap.keySet().iterator() ;
			while(vit.hasNext()) {
				Object key = vit.next() ;
				labelsql +=","+key.toString()+"" ;
				valuesql +=",?" ;
				obj[index++] = valueMap.get(key) ;
			}
			if(sequencelabel!=null) {
				sql += "("+sequencelabel+","+labelsql.substring(1)+") values ("+sequencelvalue+".NEXTVAL,"+valuesql.substring(1)+")" ;
			} else {
				sql += "("+labelsql.substring(1)+") values ("+valuesql.substring(1)+")" ;
			}
		}
	}
	
	/**
	 * 生成删除sql
	 */
	public void BuildDeleteSql() {
		delete() ;
	}
	/**
	 * 生成删除sql实现
	 */
	private void delete() {
		obj = new Object[filterMap.size()] ;
		int index = 0 ;
		sql = "delete from "+tableName+" " ;
		String filter = " 1=1 " ;
		if(filterMap.size()>0) {
			Iterator<String> it = filterMap.keySet().iterator() ;
			while(it.hasNext()) {
				Object key = it.next() ;
				filter +=" and "+key.toString()+"=? " ;
				obj[index++] = filterMap.get(key) ;
			}
			sql += " where "+filter ;
		}
	}
	
	/**
	 * 生成多表查询sql
	 * @param cols
	 * @param tables
	 * @param filters
	 */
	public void BuildUnitSql(List<String> cols,Collection<String> tables,List<String> filters) {
		if(tables.size()>0) {
			this.sql = "select  " ;
			if(cols.size()>0) {
				for(String col : cols) {
					this.sql += col+"," ;
				}
				this.sql = this.sql.substring(0, this.sql.length()-1) ;
				this.sql += " " ;
			} else {
				this.sql += " * " ;
			}
			this.sql += " from " ; 
			for(String table : tables) {
				this.sql += table+"," ; 
			}
			this.sql = this.sql.substring(0, this.sql.length()-1) ;
			this.sql += " " ;
			this.sql += " where 1=1 " ; 
			for(String filter : filters) {
				this.sql += " and "+filter ; 
			}
			if(this.orderList.size()>0) {
				this.sql += " order by " ;
				for(String order : orderList) {
					this.sql += order+"," ;
				}
				this.sql = sql.substring(0, sql.length()-1) ;
			}
		}
		System.out.println(this.sql);
		BuildPageSql() ;
	}
	
	/**
	 * 生成新增或者更新sql
	 * @param keys 条件集合对象
	 * @param values 值集合对象
	 */
	public void BuildSaveOrUpdateSql(Map<String, Object> keys, Map<String, Object> values) {
		if(keys.size()>0&&values.size()>0) {
			Object keyvalue = null ;
			ArrayList<Object> objArray = new ArrayList<Object>() ;
			String on_sql = " 1=1 " ; //条件部分
			String b_tablesql = " select  " ; //值表部分
			String insert_sql1 = "" ; //新增部分1
			String insert_sql2 = "" ; //新增部分2
			String update_sql = "" ; //更新部分
			Iterator<String> keyit = keys.keySet().iterator();
			while(keyit.hasNext()) {
				String key = keyit.next();
				Object value = keys.get(key) ;
				b_tablesql += " ? "+key +"," ;
				on_sql += "and a."+key+"="+"b."+key+" " ;
				insert_sql1 += key+"," ;
				insert_sql2 += "b."+key+"," ;
				objArray.add(value) ;
			}
			
			Iterator<String> valueit = values.keySet().iterator();
			while(valueit.hasNext()) {
				String key = valueit.next() ;
				Object value = values.get(key) ;
				update_sql += " a."+key+"=b."+key+"," ;
				b_tablesql += " ? "+key +"," ;
				objArray.add(value) ;
				insert_sql1 += key+"," ;
				insert_sql2 += "b."+key+"," ;
			}
			b_tablesql = b_tablesql.substring(0, b_tablesql.length()-1) ;
			b_tablesql += " from dual " ;
			update_sql = update_sql.substring(0, update_sql.length()-1) ;
			insert_sql1 = insert_sql1.substring(0, insert_sql1.length()-1) ;
			insert_sql2 = insert_sql2.substring(0, insert_sql2.length()-1) ;
			if(sequencelabel!=null) {
				this.sql = " merge into "+this.tableName+" a using ("+b_tablesql+") b on ("+on_sql+") when matched then " +
					" update set "+update_sql+" when not matched then insert ("+sequencelabel+","+insert_sql1+") values("+sequencelvalue+".NEXTVAL,"+insert_sql2+")" ;
			} else {
				this.sql = " merge into "+this.tableName+" a using ("+b_tablesql+") b on ("+on_sql+") when matched then " +
					" update set "+update_sql+" when not matched then insert ("+insert_sql1+") values("+insert_sql2+")" ;
			}
			this.obj = objArray.toArray() ;
		}
	}
	
	/**
	 * 生成分页sql
	 * 分页sql是在原有sql基础上进行rownum包装，仅适用在查询中
	 */
	public void BuildPageSql() {
		if(sql==null) {
			this.BuildQuerySql() ;
		}
		if(this.fromNum>-1&&this.toNum>-1)  {
			this.sql = "select * from (select rownum num,"+this.sql.substring(7)+") t_t where 1=1 ";
			if(this.fromNum>-1) {
				this.sql += " and t_t.num>"+this.fromNum ;
			}
			if(this.toNum>-1) {
				this.sql += " and t_t.num<"+this.toNum ;
			}
		}
	}
	
	@Override
	public String toString() {
		String s = "" ;
		for(Object o : obj){
			s += ";"+o ;
		}
		s = s.substring(1) ;
		return "sql:"+sql+"。obj:"+ s;
	}
	
	
	
}
