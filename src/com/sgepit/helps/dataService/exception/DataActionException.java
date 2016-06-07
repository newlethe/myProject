/** 
 * Title:        数据交互服务应用: 
 * Description:  异常应用
 * Company:      sgepit
 */
package com.sgepit.helps.dataService.exception;

/**
 * 数据处理异常
 * @author lizp
 * @Date 2010-8-21
 */
public class DataActionException extends Exception {

	private static final long serialVersionUID = 4471981992755042812L;

	public DataActionException() {
		super();
	}

	public DataActionException(String message, Throwable cause) {
		super(message, cause);
	}

	public DataActionException(String message) {
		super(message);
	}

	public DataActionException(Throwable cause) {
		super(cause);
	}
	
}
