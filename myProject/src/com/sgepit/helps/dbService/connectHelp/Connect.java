/** 
 * Title:        数据库应用: 
 * Description:  数据库连接应用
 * Company:      sgepit
 */
package com.sgepit.helps.dbService.connectHelp;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

/**
 * 数据库连接应用
 * 提供基本的获取连接的方式，jndi和jdbc直接连接
 * @author lizp
 * @Date 2010-8-12
 */
public class Connect {
	private Connection con = null ;
	
	public Connection getCon() {
		return con;
	}
	/**
	 * 获得默认jndi连接
	 * 默认jndi连接名称为frame，要使用此连接需要在上下文中能获得到此连接
	 * @throws NamingException
	 * @throws SQLException
	 */
	public Connect() throws NamingException,SQLException {
		InitialContext initialcontext = null ;
		try {
			initialcontext = new InitialContext();
			DataSource ds = (DataSource) initialcontext.lookup("jdbc/frame") ;
			this.con = ds.getConnection() ;
		} catch (NamingException e) {
			throw e ;
		} catch (SQLException e) {
			throw e ;
		} finally {
			if(initialcontext!=null)  {
				initialcontext.close() ;
			}
		}
	}
	/**
	 * 通过指定jndi连接名获得连接
	 * @param name jndi连接名
	 * @throws NamingException
	 * @throws SQLException
	 */
	public Connect(String name) throws NamingException, SQLException {
		InitialContext initialcontext = null ;
		try {
			initialcontext = new InitialContext();
			DataSource ds = (DataSource) initialcontext.lookup(name) ;
			this.con = ds.getConnection() ;
		} catch (NamingException e) {
			throw e ;
		} catch (SQLException e) {
			throw e ;
		} finally {
			if(initialcontext!=null)  {
				initialcontext.close() ;
			}
		}
	}
	
	/**
	 * 使用jdbc直接获取连接
	 * 需要数据库驱动jar包
	 * @param ClassforName 
	 * @param url
	 * @param username
	 * @param password
	 * @throws ClassNotFoundException
	 * @throws SQLException
	 */
	public Connect(String ClassforName,String url,String username,String password) throws ClassNotFoundException, SQLException {
		try {
			Class.forName(ClassforName);
			this.con = DriverManager.getConnection(url, username, password);
		} catch (ClassNotFoundException e) {
			throw e ;
		} catch (SQLException e) {
			throw e ;
		}
	}
	
	/**
	 * 关闭连接及上下文
	 * 在执行完操作需要释放连接时执行
	 */
	private void destroy()  {
		try {
			if(this.con!=null) {
				this.con.close() ;
			}
		} catch (SQLException e) {
		}
	}
}
