package com.sgepit.helps.dataService.exception;
/**
 * 数据对比异常
 * @author lizp
 *
 */
public class DataCompareException extends Exception {

	public DataCompareException() {
	}

	public DataCompareException(String message) {
		super(message);
	}

	public DataCompareException(Throwable cause) {
		super(cause);
	}

	public DataCompareException(String message, Throwable cause) {
		super(message, cause);
	}

}
