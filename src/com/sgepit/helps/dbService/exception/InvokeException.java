/** 
 * Title:        数据库应用: 
 * Description:  异常应用
 * Company:      sgepit
 */
package com.sgepit.helps.dbService.exception;

/**
 * 反射异常
 * @author lizp
 * @Date 2010-8-18
 */
public class InvokeException extends Exception {

	private static final long serialVersionUID = -1894661515415091840L;

	public InvokeException(Exception e) {
		this(e.getMessage(), e.getCause());
	}
	public InvokeException(String message, Throwable cause) {
		super(message, cause);
	}

	public InvokeException(String message) {
		super(message);
	}

	public InvokeException(Throwable cause) {
		super(cause);
	}
	
}
