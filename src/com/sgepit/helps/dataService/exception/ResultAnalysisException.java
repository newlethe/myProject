/** 
 * Title:        数据交互服务应用: 
 * Description:  异常应用
 * Company:      sgepit
 */
package com.sgepit.helps.dataService.exception;

/**
 * 交互结果分析异常
 * @author lizp
 * @Date 2010-8-21
 */
public class ResultAnalysisException extends Exception {

	private static final long serialVersionUID = 7685790213829386386L;

	public ResultAnalysisException() {
	}

	public ResultAnalysisException(String message) {
		super(message);
	}
	
	public ResultAnalysisException(Exception e) {
		super(e);
	}

	public ResultAnalysisException(Throwable cause) {
		super(cause);
	}

	public ResultAnalysisException(String message, Throwable cause) {
		super(message, cause);
	}

}
