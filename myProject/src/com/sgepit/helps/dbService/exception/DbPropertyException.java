/** 
 * Title:        数据库应用: 
 * Description:  异常应用
 * Company:      sgepit
 */
package com.sgepit.helps.dbService.exception;
/**
 * 获取数据库配置异常
 * @author lizp
 * @Date 2010-8-12
 */
public class DbPropertyException extends Exception {

	private static final long serialVersionUID = 3673388994003580662L;

	public DbPropertyException() {
		super("获取数据库配置异常");
	}
	
	public DbPropertyException(Exception e) {
		this(e.getMessage(),e.getCause()) ;
	}

	public DbPropertyException(String message) {
		super(message);
	}

	public DbPropertyException(Throwable cause) {
		super(cause);
	}

	public DbPropertyException(String message, Throwable cause) {
		super(message, cause);
	}

}
