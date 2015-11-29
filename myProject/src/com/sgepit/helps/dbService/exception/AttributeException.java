/** 
 * Title:        数据库应用: 
 * Description:  异常应用
 * Company:      sgepit
 */
package com.sgepit.helps.dbService.exception;
/**
 * 获取属性异常类
 * @author lizp
 * @Date 2010-8-12
 */
public class AttributeException extends Exception {

	private static final long serialVersionUID = 1834706654916746223L;

	public AttributeException() {
	}

	public AttributeException(String message) {
		super(message);
	}

	public AttributeException(Throwable cause) {
		super(cause);
	}

	public AttributeException(String message, Throwable cause) {
		super(message, cause);
	}

}
