/** 
 * Title:        数据交互服务应用: 
 * Description:  异常应用
 * Company:      sgepit
 */
package com.sgepit.helps.dataService.exception;

/**
 * 类型转换异常
 * @author lizp
 * @Date 2010-8-21
 */
public class DataTypeException extends Exception {

	private static final long serialVersionUID = -4979027509618132278L;

	public DataTypeException() {
	}
	
	public DataTypeException(Exception e) {
		super(e.getMessage(), e.getCause());
	}

	public DataTypeException(String message) {
		super(message);
	}

	public DataTypeException(Throwable cause) {
		super(cause);
	}

	public DataTypeException(String message, Throwable cause) {
		super(message, cause);
	}

}
