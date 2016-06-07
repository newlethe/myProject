package com.sgepit.frame.base;

/**
 * 业务逻辑层异常信息类
 *  
 * @author xjdawu
 * @since 2007.11.30
 */
public class BusinessException extends RuntimeException {
	public BusinessException(String msg){
		super(msg);
	}
}
