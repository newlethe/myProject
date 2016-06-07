/** 
 * Title:        数据交互服务应用: 
 * Description:  异常应用
 * Company:      sgepit
 */
package com.sgepit.helps.dataService.exception;
/**
 * 数据组织异常
 * @author lizp
 * @Date 2010-8-21
 */
public class DataHelpException extends Exception {

	private static final long serialVersionUID = 4522329387346955883L;

	public DataHelpException() {
	}
	
	public DataHelpException(Exception e) {
		super(e);
	}

	public DataHelpException(String message) {
		super(message);
	}

	public DataHelpException(Throwable cause) {
		super(cause);
	}

	public DataHelpException(String message, Throwable cause) {
		super(message, cause);
	}

}
