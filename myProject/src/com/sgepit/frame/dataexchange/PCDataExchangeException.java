package com.sgepit.frame.dataexchange;

/**
 * 数据交互自定义异常类
 *
 */
public class PCDataExchangeException extends RuntimeException{
	
	private static final long serialVersionUID = 1L;

	public PCDataExchangeException(){
		
	}
	
	public PCDataExchangeException(String message){
		super(message);
	}
	

}
