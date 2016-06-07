/** 
 * Title:        数据库应用: 
 * Description:  excel异常应用
 * Company:      sgepit
 */
package com.sgepit.helps.webdynproService.export;

/**
 * excel导入导出异常
 * @author lizp
 * @Date 2010-8-21
 */
public class ExcelPortException extends Exception {

	private static final long serialVersionUID = -9137784356216830418L;

	public ExcelPortException() {
	}

	public ExcelPortException(Exception e) {
		super(e);
	}
	public ExcelPortException(String message) {
		super(message);
	}

	public ExcelPortException(Throwable cause) {
		super(cause);
	}

	public ExcelPortException(String message, Throwable cause) {
		super(message, cause);
	}

}
