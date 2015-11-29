/** 
 * Title:        数据库应用: 
 * Description:  数据库操作应用
 * Company:      sgepit
 */
package com.sgepit.helps.dbService;

import java.io.StringReader;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.sgepit.helps.dbService.beanHelp.BaseBean;

/**
 * 数据库操作实现
 * 单例模式(饿汉式单例)
 * @author lizp
 * @Date 2010-8-12
 */
public class ExecuteSql {
	/**
	 * 私有化构造方法
	 */
	private ExecuteSql() {
		
	}
	private static final ExecuteSql _stance = new ExecuteSql();
	public static ExecuteSql getEsql() {
		return _stance;
	}
	
	private Connection con  ;
	
	public void setCon(Connection con) {
		this.con = con;
	}
	
	/**
	 * 执行查询操作
	 * @param sql 预编译sql语句
	 * @param obj 参数数组
	 * @return 返回List<Map<String,Object>>结构
	 * @throws SQLException
	 */
	public List<Map<String,Object>> query(String sql,Object[] obj) throws SQLException {
		List<Map<String, Object>> list = new ArrayList<Map<String,Object>>();
		try {
			PreparedStatement pstmt = this.con.prepareStatement(sql);
			if (obj!=null) {
				for (int i = 0; i < obj.length; i++) {
					setObjectToPreparedStatement(pstmt,i + 1,obj[i]) ;
				}
			}		
			list = new ArrayList<Map<String,Object>>();
			ResultSet rs = pstmt.executeQuery();
			ResultSetMetaData rsm = null ;
			if(rs!=null) {
				rsm = rs.getMetaData() ;
			}
			while(rs.next())  {
				Map<String,Object> map = new LinkedHashMap<String,Object>() ;
				for(int i=0;i<rsm.getColumnCount();i++) {
					Object value = rs.getObject(i+1) ;
					map.put(rsm.getColumnName(i+1).toLowerCase(),value) ;
				}
				list.add(map) ;
			}
			rs.close() ;
			if(pstmt!=null) pstmt.close() ;
		} catch (SQLException e) {
			throw e;
		} 
		return list;
	}
	
	/**
	 * 执行查询操作(列名与数据库返回相同)
	 * @param sql 预编译sql语句
	 * @param obj 参数数组
	 * @return 返回List<Map<String,Object>>结构
	 * @throws SQLException
	 */
	public List<Map<String,Object>> queryOriginal(String sql,Object[] obj) throws SQLException {
		List<Map<String, Object>> list = new ArrayList<Map<String,Object>>();
		try {
			PreparedStatement pstmt = this.con.prepareStatement(sql);
			if (obj!=null) {
				for (int i = 0; i < obj.length; i++) {
					setObjectToPreparedStatement(pstmt,i + 1,obj[i]) ;
				}
			}		
			list = new ArrayList<Map<String,Object>>();
			ResultSet rs = pstmt.executeQuery();
			ResultSetMetaData rsm = null ;
			if(rs!=null) {
				rsm = rs.getMetaData() ;
			}
			while(rs.next())  {
				Map<String,Object> map = new LinkedHashMap<String,Object>() ;
				for(int i=0;i<rsm.getColumnCount();i++) {
					Object value = rs.getObject(i+1) ;
					map.put(rsm.getColumnName(i+1),value) ;
				}
				list.add(map) ;
			}
			rs.close() ;
			if(pstmt!=null) pstmt.close() ;
		} catch (SQLException e) {
			throw e;
		} 
		return list;
	}
	
	/**
	 * 执行查询操作
	 * @param sql sql语句
	 * @param obj 参数数组
	 * @return 返回List<BaseBean>结构
	 * @throws SQLException 
	 * @throws IllegalAccessException 
	 * @throws InstantiationException 
	 */
	public List<BaseBean> queryBean(String sql, Object[] obj,BaseBean baseBean) throws SQLException {
		List<BaseBean> list = new ArrayList<BaseBean>();
		try {
			PreparedStatement pstmt = this.con.prepareStatement(sql);
			if (obj!=null) {
				for (int i = 0; i < obj.length; i++) {
					setObjectToPreparedStatement(pstmt,i + 1,obj[i]) ;
				}
			}		
			ResultSet rs = pstmt.executeQuery();
			ResultSetMetaData rsm = null ;
			if(rs!=null) {
				rsm = rs.getMetaData() ;
			}
			Map<String, String> map = baseBean.getMapMappingMap();
			while(rs.next())  {
				try {
					BaseBean bean = baseBean.getClass().newInstance();
					for(int i=0;i<rsm.getColumnCount();i++) {
						try {
							Object value = rs.getObject(i+1) ;
							String name = rsm.getColumnName(i+1).toLowerCase() ;
							if(map.containsKey(name)) {
								name = map.get(name) ;
							} 
							bean.setAttributeValue(name, value) ;
						} catch (Exception e) {
							System.out.println(e);
						}
					}
					list.add(bean) ;
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			rs.close() ;
			if(pstmt!=null) pstmt.close() ;
		} catch (SQLException e) {
			throw e;
		} 
		return list;
	}
	
	/**
	 * 执行更新操作
	 * @param sql 预编译sql语句
	 * @param obj 参数数组
	 * @return 操作状态，true为成功
	 * @throws SQLException
	 */
	public boolean executesql(String sql,Object[] obj) throws SQLException {
		PreparedStatement pstmt = this.con.prepareStatement(sql);
		if (obj != null) {
			for (int i = 0; i < obj.length; i++) {
				setObjectToPreparedStatement(pstmt,i + 1,obj[i]) ;
			}
		}
		try {
			int i = pstmt.executeUpdate();
			if(pstmt!=null) pstmt.close() ;
			if(i>-1) {
				return true ;
			}else{
				return false ;
			}
		} catch (SQLException e) {
			throw e;
		}
	}
	
	/**
	 * 执行更新
	 * @param sql 预编译sql语句
	 * @param obj 参数数组
	 * @return 操作影响的记录数
	 * @throws SQLException
	 */
	public int executesqlSize(String sql,Object[] obj) throws SQLException {
		PreparedStatement pstmt = this.con.prepareStatement(sql);
		if (obj != null) {
			for (int i = 0; i < obj.length; i++) {
				setObjectToPreparedStatement(pstmt,i + 1,obj[i]) ;
			}
		}
		try {
			int i = pstmt.executeUpdate();
			if(pstmt!=null) pstmt.close() ;
			return i ;
		} catch (SQLException e) {
			throw e;
		}
	}
	
	/**
	 * 执行批处理sql
	 * @param sqls
	 * @return
	 * @throws SQLException
	 */
	public int[] batchsql(List<String> sqls) throws SQLException {
		int[] rult = null ;
		try {
			Statement statem = con.createStatement();
			for(String sql : sqls) {
				if(sql!=null) {
					statem.addBatch(sql) ;
				}
			}
			rult = statem.executeBatch() ;
			if(statem!=null) statem.close() ;
		} catch (SQLException e) {
			throw e ;
		}
		return rult ;
	}
	
	/**
	 * 执行存储过程
	 * @param procedureName
	 * @param parameters
	 * @return
	 * @throws SQLException
	 */
	public boolean executeProcedure(String procedureName, Object[] parameters) throws SQLException {
		boolean flag  = false ;
		String sql = "" ;
		for(Object o : parameters) {
			sql += "?," ;
		}
		if(!sql.equals("")) {
			sql = sql.substring(0,sql.length()-1) ;
		}
		sql = "{call "+procedureName+" ( "+sql+")}" ;
		try {
			CallableStatement call = con.prepareCall(sql) ;
			for(int i=0;i<parameters.length;i++) {
				setObjectToPreparedStatement(call,i + 1,parameters[i]) ;
			}
			call.execute();
			if(call!=null) call.close() ;
			flag = true ;
		} catch (SQLException e) {
			throw e ;
		} 
		return flag ;
	}
	
	/**
	 * 查询存储过程
	 * @param procedureName
	 * @param parameters 
	 * @param sqlType = oracle.jdbc.OracleTypes.CURSOR
	 * @return
	 * @throws SQLException 
	 */
	public List<Map<String, Object>> selectProcedure(String procedureName, Object[] parameters,int sqlType) throws SQLException {
		List<Map<String, Object>> list = new ArrayList<Map<String,Object>>();
		boolean flag  = false ;
		String sql = "" ;
		for(Object o : parameters) {
			sql += "?," ;
		}
		if(!sql.equals("")) {
			sql = sql.substring(0,sql.length()-1) ;
		}
		sql = "{?=call "+procedureName+" ( "+sql+")}" ;
		try {
			CallableStatement call = con.prepareCall(sql) ;
			for(int i=0;i<parameters.length;i++) {
				setObjectToPreparedStatement(call,i + 2,parameters[i]) ;
			}
			call.registerOutParameter(1, sqlType);
			call.execute();
			ResultSet rs = (ResultSet)call.getObject(1);
			ResultSetMetaData rsmd = rs.getMetaData();
			while(rs.next())  {
				Map<String,Object> map = new HashMap<String,Object>() ;
				for(int i=0;i<rsmd.getColumnCount();i++) {
					Object value = rs.getObject(i+1) ;
					map.put(rsmd.getColumnName(i+1).toLowerCase(),value) ;
				}
				list.add(map) ;
			}
			rs.close() ;
			if(call!=null) call.close() ;
		} catch (SQLException e) {
			throw e ;
		} 
		return list ;
	}
	
	/**
	 * 设置预编译参数
	 * @param pstmt
	 * @param index
	 * @param obj
	 * @throws SQLException 
	 */
	private static void setObjectToPreparedStatement(PreparedStatement pstmt,int index,Object obj) throws SQLException {
		if(obj instanceof String &&obj.toString().length()>3999) {
			String objStr = obj.toString() ;
			pstmt.setCharacterStream(index, new StringReader(objStr), objStr.length()) ;
		} else {
			pstmt.setObject(index, obj) ;
		}
	}
	
	/**
	 * 执行更新sql，返回更新条数
	 * @param sql sql语句
	 * @param obj 参数集合
	 * @return
	 * @throws SQLException
	 */
	public int updatesql(String sql, Object[] obj) throws SQLException {
		int  count = -1 ;
		PreparedStatement pstmt = this.con.prepareStatement(sql);
		if (obj != null) {
			for (int i = 0; i < obj.length; i++) {
				setObjectToPreparedStatement(pstmt,i + 1,obj[i]) ;
			}
		}
		try {
			pstmt.executeUpdate();
			count = pstmt.getUpdateCount() ;
			if(pstmt!=null) pstmt.close() ;
		} catch (SQLException e) {
			throw e;
		}
		return count ;
	}
	
}
