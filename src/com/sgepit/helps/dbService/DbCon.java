/** 
 * Title:        数据库应用: 
 * Description:  数据库操作应用
 * Company:      sgepit
 */
package com.sgepit.helps.dbService;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.naming.NamingException;

import com.sgepit.helps.dbService.beanHelp.BaseBean;
import com.sgepit.helps.dbService.exception.DbPropertyException;
import com.sgepit.helps.dbService.sqlHelp.BuildSql;
/**
 * 数据库操作应用
 * 使用连接工厂提供的连接，进行数据库的相关操作
 * 在每次执行结束后即关闭连接，需要执行reConnect()方法重新加载连接，或者重新实例化对象
 * @author lizp
 * @Date 2010-8-12
 */
public class DbCon {
	private Connection connect ;
	
	public DbCon() throws DbPropertyException {
		connect = ConnectFactory.getConnection() ;
	}
	
	/**
	 * 重新获得连接
	 * @throws DbPropertyException
	 * @throws ClassNotFoundException
	 * @throws SQLException
	 * @throws NamingException
	 */
	public void reConnect() throws DbPropertyException {
		if(connect==null) {
			connect = ConnectFactory.getConnection() ;
		}
	}

	/**
	 * 执行查询sql(列名与数据库返回相同)
	 * @param buildSql sql生成对象
	 * @return 返回List<Map<String,Object>>结构的数据集合
	 * @throws SQLException
	 */
	public List<Map<String,Object>> queryOriginalSql(BuildSql buildSql) throws SQLException {
		return queryOriginalSql(buildSql.getSql(), buildSql.getObj()) ;
	}
	
	/**
	 * 执行查询sql(列名与数据库返回相同)
	 * @param sql sql语句
	 * @return 返回List<Map<String,Object>>结构的数据集合
	 * @throws SQLException
	 */
	public List<Map<String,Object>> queryOriginalSql(String sql) throws SQLException {
		return queryOriginalSql(sql,null) ;
	}
	/**
	 * 执行查询sql(列名与数据库返回相同)
	 * 预编译的sql，可以传递参数
	 * @param sql sql语句
	 * @param obj 参数数组
	 * @return 返回List<Map<String,Object>>结构的数据集合
	 * @throws SQLException
	 */
	public List<Map<String,Object>> queryOriginalSql(String sql,Object[] obj) throws SQLException {
		DbUtil util = new DbUtil() ;
		if(connect!=null) {
			try {
				return util.queryOriginalSql(sql, obj,connect) ;
			} catch (SQLException e) {
				throw e ;
			} finally {
				destroy() ;
			}
		} else {
			return new ArrayList<Map<String,Object>>() ;
		}
	}
	/**
	 * 执行查询sql
	 * @param buildSql sql生成对象
	 * @return 返回List<Map<String,Object>>结构的数据集合
	 * @throws SQLException
	 */
	public List<Map<String,Object>> querySql(BuildSql buildSql) throws SQLException {
		return querySql(buildSql.getSql(), buildSql.getObj()) ;
	}
	
	/**
	 * 执行查询sql
	 * @param sql sql语句
	 * @return 返回List<Map<String,Object>>结构的数据集合
	 * @throws SQLException
	 */
	public List<Map<String,Object>> querySql(String sql) throws SQLException {
		return querySql(sql,null) ;
	}
	/**
	 * 执行查询sql
	 * 预编译的sql，可以传递参数
	 * @param sql sql语句
	 * @param obj 参数数组
	 * @return 返回List<Map<String,Object>>结构的数据集合
	 * @throws SQLException
	 */
	public List<Map<String,Object>> querySql(String sql,Object[] obj) throws SQLException {
		DbUtil util = new DbUtil() ;
		if(connect!=null) {
			try {
				return util.querySql(sql, obj,connect) ;
			} catch (SQLException e) {
				throw e ;
			} finally {
				destroy() ;
			}
		} else {
			return new ArrayList<Map<String,Object>>() ;
		}
	}
	
	/**
	 * 执行查询sql
	 * @param buildSql sql生成对象
	 * @return 返回List<BaseBean>结构的数据集合
	 * @throws SQLException 
	 */
	public List<BaseBean> queryBean(BuildSql buildSql,BaseBean baseBean) throws SQLException {
		return queryBean(buildSql.getSql(),buildSql.getObj(),baseBean);
	}
	
	/**
	 * 执行查询sql
	 * @param sql sql语句
	 * @return 返回List<BaseBean>结构的数据集合
	 * @throws SQLException 
	 */
	public List<BaseBean> queryBean(String sql,BaseBean baseBean) throws SQLException {
		return queryBean(sql,null,baseBean);
	}
	
	/**
	 * 执行查询sql
	 * @param sql sql语句
	 * @param obj 参数数组
	 * @return 返回List<BaseBean>结构的数据集合
	 * @throws SQLException 
	 */
	public List<BaseBean> queryBean(String sql, Object[] obj,BaseBean baseBean) throws SQLException {
		DbUtil util = new DbUtil() ;
		if(connect!=null) {
			try {
				return util.queryBean(sql, obj,connect,baseBean) ;
			} catch (SQLException e) {
				throw e ;
			} finally {
				destroy() ;
			}
		} else {
			return new ArrayList<BaseBean>() ;
		}
	}

	/**
	 * 执行sql
	 * 执行sql返回boolean，主要应用执行sql获得成功与否方面
	 * 需要获得更新条数调用updateSql
	 * @param sql sql语句
	 * @return
	 * @throws SQLException
	 */
	public boolean executeSql(String sql) throws SQLException {
		return executeSql(sql,null) ;
	}
	/**
	 * 执行sql(预编译带参数)
	 * 执行sql返回boolean，主要应用执行sql获得成功与否方面
	 * 需要获得更新条数调用updateSql
	 * @param sql sql语句
	 * @param obj 参数数组
	 * @return
	 * @throws SQLException
	 */
	public boolean executeSql(String sql,Object[] obj) throws SQLException {
		DbUtil util = new DbUtil() ;
		if(connect!=null) {
			try {
				return util.executeSql(sql, obj,connect) ;
			} catch (SQLException e) {
				throw e ;
			} finally {
				destroy();
			}
		} else {
			return false ;
		}
	}
	
	/**
	 * 执行sql(sql生成对象)
	 * 执行sql返回boolean，主要应用执行sql获得成功与否方面
	 * 需要获得更新条数调用updateSql
	 * @param buildsql sql生成对象
	 * @return
	 * @throws SQLException
	 */
	public boolean executeSql(BuildSql buildsql) throws SQLException {
		return executeSql(buildsql.getSql(), buildsql.getObj()) ;
	}
	
	/**
	 * 执行sql
	 * 执行sql返回boolean，主要应用执行sql获得成功与否方面
	 * 需要获得更新条数调用updateSql
	 * @param sql sql语句
	 * @return
	 * @throws SQLException
	 */
	public int executeSqlSize(String sql) throws SQLException {
		return executeSqlSize(sql,null) ;
	}
	/**
	 * 执行sql(预编译带参数)
	 * 执行sql返回boolean，主要应用执行sql获得成功与否方面
	 * 需要获得更新条数调用updateSql
	 * @param sql sql语句
	 * @param obj 参数数组
	 * @return
	 * @throws SQLException
	 */
	public int executeSqlSize(String sql,Object[] obj) throws SQLException {
		DbUtil util = new DbUtil() ;
		if(connect!=null) {
			try {
				return util.executeSqlSize(sql, obj,connect) ;
			} catch (SQLException e) {
				throw e ;
			} finally {
				destroy();
			}
		} else {
			return -1 ;
		}
	}
	
	/**
	 * 执行sql(sql生成对象)
	 * 执行sql返回boolean，主要应用执行sql获得成功与否方面
	 * 需要获得更新条数调用updateSql
	 * @param buildsql sql生成对象
	 * @return
	 * @throws SQLException
	 */
	public int executeSqlSize(BuildSql buildsql) throws SQLException {
		return executeSqlSize(buildsql.getSql(), buildsql.getObj()) ;
	}
	
	/**
	 * 执行sql获得更新记录条数
	 * 只需要获得执行成功与否调用executeSql
	 * @param sql sql语句
	 * @return
	 * @throws SQLException
	 */
	public int updateSql(String sql) throws SQLException {
		return updateSql(sql,null) ;
	}
	
	/**
	 * 执行sql获得更新记录条数(预编译带参数)
	 * 只需要获得执行成功与否调用executeSql
	 * @param sql sql语句
	 * @param obj 参数数组
	 * @return
	 * @throws SQLException
	 */
	public int updateSql(String sql,Object[] obj) throws SQLException {
		DbUtil util = new DbUtil() ;
		if(connect!=null) {
			try {
				return util.updateSql(sql, obj,connect) ;
			} catch (SQLException e) {
				throw e ;
			} finally {
				destroy();
			}
		} else {
			return -1 ;
		}
	}
	/**
	 * 执行sql获得更新记录条数(预编译带参数)
	 * 只需要获得执行成功与否调用executeSql
	 * @param buildsql sql生成对象
	 * @return
	 * @throws SQLException
	 */
	public int updateSql(BuildSql buildsql) throws SQLException {
		return updateSql(buildsql.getSql(), buildsql.getObj()) ;
	}

	/**
	 * 执行批处理sql
	 * 调用数据库批处理方法
	 * @param sqls 批处理sql集合
	 * @return 
	 * @throws SQLException
	 */
	public int[] batchsql(List<String> sqls) throws SQLException {
		int[] ret = null ;
		DbUtil util = new DbUtil() ;
		if(connect!=null) {
			try {
				ret = util.batchsql(sqls,connect) ;
			} catch (SQLException e) {
				throw e ;
			} finally {
				destroy() ;
			}
		}
		return ret ;
	}
	
	/**
	 * 执行存储过程
	 * @param procedureName 存储过程名称
	 * @param parameters 变量集合
	 * @return 成功返回true
	 * @throws SQLException
	 */
	public boolean executeProcedure(String procedureName, Object[] parameters,Connection con) throws SQLException {
		DbUtil util = new DbUtil() ;
		if(connect!=null) {
			try {
				return util.executeProcedure(procedureName, parameters,connect) ;
			} catch (SQLException e) {
				throw e ;
			} finally {
				destroy() ;
			}
		} else {
			return false ;
		}
	}
	
	/**
	 * 查询存储过程
	 * @param procedureName 存储过程名称
	 * @param parameters 变量集合
	 * @param sqlType 此处为 oracle.jdbc.OracleTypes.CURSOR
	 * @return
	 * @throws SQLException 
	 */
	public List<Map<String, Object>> selectProcedure(String procedureName, Object[] parameters,int sqlType,Connection con) throws SQLException {
		DbUtil util = new DbUtil() ;
		if(connect!=null) {
			try {
				return util.selectProcedure(procedureName, parameters,sqlType,connect) ;
			} catch (SQLException e) {
				throw e ;
			} finally {
				destroy();
			}
		} else {
			return new ArrayList<Map<String,Object>>() ;
		}
	}
	
	/**
	 * 关闭连接
	 */
	public void destroy()  {
		if(this.connect!=null) {
			try {
				this.connect.close() ;
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}

}
