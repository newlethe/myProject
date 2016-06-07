/** 
 * Title:        数据库应用: 
 * Description:  连接应用
 * Company:      sgepit
 */
package com.sgepit.helps.dbService;

import java.sql.Connection;
import java.sql.SQLException;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

import com.sgepit.frame.util.JNDIUtil;
import com.sgepit.helps.dbService.exception.DbPropertyException;

/**
 * 连接工厂类
 * 复制获取配置文件中的连接
 * @author lizp
 * @Date 2010-8-12
 */
public class ConnectFactory {
	
	/**
	 * 获得连接
	 * @return 
	 * @throws DbPropertyException 
	 * @throws SQLException 
	 * @throws ClassNotFoundException 
	 * @throws NamingException 
	 */
	public static Connection getConnection() throws DbPropertyException {
		Connection c = null ;
		
		Context initCtx;
		try {
			initCtx = new InitialContext();
			DataSource ds = (DataSource)JNDIUtil.lookup(initCtx) ;
			c = ds.getConnection();
		} catch (NamingException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return c ;
	}
	
}
