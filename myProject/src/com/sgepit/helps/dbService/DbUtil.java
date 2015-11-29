/** 
 * Title:        数据库应用: 
 * Description:  数据库操作应用
 * Company:      sgepit
 */
package com.sgepit.helps.dbService;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import com.sgepit.helps.dbService.beanHelp.BaseBean;
import com.sgepit.helps.dbService.sqlHelp.BuildSql;

/**
 * 数据库操作(使用外部管理连接)
 * 连接关联外部实现，操作结束需要手动关闭连接
 * 需要手动控制连接使用此类
 * @author lizp
 * @Date 2010-8-12
 */
public class DbUtil {
	
	/**
	 * 执行查询sql
	 * @param sql
	 * @param obj
	 * @param con 数据库连接
	 * @return
	 * @throws SQLException
	 */
	public List<Map<String,Object>> querySql(String sql,Object[] obj,Connection con) throws SQLException {
		ExecuteSql executeSql = ExecuteSql.getEsql() ;
		if(con!=null) {
			executeSql.setCon(con) ;
			return executeSql.query(sql, obj) ;
		} else {
			throw new SQLException("获得连接失败！") ;
		}
	}
	
	/**
	 * 执行查询sql(列名与数据库返回相同)
	 * @param sql
	 * @param obj
	 * @param con
	 * @return
	 * @throws SQLException
	 */
	public List<Map<String,Object>> queryOriginalSql(String sql,Object[] obj,Connection con) throws SQLException {
		ExecuteSql executeSql = ExecuteSql.getEsql() ;
		if(con!=null) {
			executeSql.setCon(con) ;
			return executeSql.queryOriginal(sql, obj) ;
		} else {
			throw new SQLException("获得连接失败！") ;
		}
	}
	
	/**
	 * 执行查询sql
	 * @param sql
	 * @param obj
	 * @param connect
	 * @return 返回List<BaseBean>对象
	 * @throws SQLException 
	 */
	public List<BaseBean> queryBean(String sql, Object[] obj, Connection con,BaseBean baseBean) throws SQLException {
		ExecuteSql executeSql = ExecuteSql.getEsql() ;
		if(con!=null) {
			executeSql.setCon(con) ;
			return executeSql.queryBean(sql, obj,baseBean) ;
		} else {
			throw new SQLException("获得连接失败！") ;
		}
	}
	
	/**
	 * 执行查询sql
	 * @param buildSql sql生成对象
	 * @param con 数据库连接
	 * @return
	 * @throws SQLException
	 */
	public List<Map<String,Object>> querySql(BuildSql buildSql,Connection con) throws SQLException {
		return querySql(buildSql.getSql(), buildSql.getObj(),con) ;
	}
	
	/**
	 * 执行sql
	 * @param sql
	 * @param obj
	 * @param con
	 * @return
	 * @throws SQLException
	 */
	public boolean executeSql(String sql,Object[] obj,Connection con) throws SQLException {
		ExecuteSql executeSql = ExecuteSql.getEsql() ;
		if(con!=null) {
			executeSql.setCon(con) ;
			return executeSql.executesql(sql, obj) ;
		} else {
			throw new SQLException("获得连接失败！") ;
		}
	}
	
	public int executeSqlSize(String sql,Object[] obj,Connection con) throws SQLException {
		ExecuteSql executeSql = ExecuteSql.getEsql() ;
		if(con!=null) {
			executeSql.setCon(con) ;
			return executeSql.executesqlSize(sql, obj) ;
		} else {
			throw new SQLException("获得连接失败！") ;
		}
	}
	
	/**
	 * 执行sql
	 * @param buildsql
	 * @param con
	 * @return
	 * @throws SQLException
	 */
	public boolean executeSql(BuildSql buildsql,Connection con) throws SQLException {
		return executeSql(buildsql.getSql(), buildsql.getObj(),con) ;
	}
	
	/**
	 * 执行更新sql
	 * @param sql
	 * @param obj
	 * @param con
	 * @return
	 * @throws SQLException
	 */
	public int updateSql(String sql,Object[] obj,Connection con) throws SQLException {
		ExecuteSql executeSql = ExecuteSql.getEsql() ;
		if(con!=null) {
			executeSql.setCon(con) ;
			return executeSql.updatesql(sql, obj) ;
		} else {
			throw new SQLException("获得连接失败！") ;
		}
	}
	
	/**
	 * 执行更新sql
	 * @param buildsql
	 * @param con
	 * @return
	 * @throws SQLException
	 */
	public int updateSql(BuildSql buildsql,Connection con) throws SQLException {
		return updateSql(buildsql.getSql(), buildsql.getObj(),con) ;
	}

	/**
	 * 执行批处理sql
	 * @param sqls
	 * @param con
	 * @return 
	 * @throws SQLException
	 */
	public int[] batchsql(List<String> sqls,Connection con) throws SQLException {
		ExecuteSql executeSql = ExecuteSql.getEsql() ;
		if(con!=null) {
			executeSql.setCon(con) ;
			return executeSql.batchsql(sqls) ;
		} else {
			throw new SQLException("获得连接失败！") ;
		}
	}
	
	/**
	 * 执行存储过程
	 * @param procedureName
	 * @param parameters
	 * @param con
	 * @return
	 * @throws SQLException
	 */
	public boolean executeProcedure(String procedureName, Object[] parameters,Connection con) throws SQLException {
		ExecuteSql executeSql = ExecuteSql.getEsql() ;
		if(con!=null) {
			executeSql.setCon(con) ;
			return executeSql.executeProcedure(procedureName, parameters) ;
		} else {
			throw new SQLException("获得连接失败！") ;
		}
	}
	
	/**
	 * 查询存储过程
	 * @param procedureName
	 * @param parameters
	 * @param sqlType = oracle.jdbc.OracleTypes.CURSOR
	 * @param con
	 * @return
	 * @throws SQLException 
	 */
	public List<Map<String, Object>> selectProcedure(String procedureName, Object[] parameters,int sqlType,Connection con) throws SQLException {
		ExecuteSql executeSql = ExecuteSql.getEsql() ;
		if(con!=null) {
			executeSql.setCon(con) ;
			return executeSql.selectProcedure(procedureName, parameters,sqlType) ;
		} else {
			throw new SQLException("获得连接失败！") ;
		}
	}

}
