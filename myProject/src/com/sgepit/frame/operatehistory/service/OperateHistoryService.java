/**
 * 
 */
package com.sgepit.frame.operatehistory.service;

/**
 * 中煤物资采购系统，日志操作类
 * @author qiupy 2013-1-29 
 *
 */
public interface OperateHistoryService {

	/**
	 * 增加操作历史记录
	 * @param userId     操作人ID
	 * @param unitId     操作人所在单位
	 * @param opType     用户操作类型,同时对应property_code中的 type_name = 'OPERATE_TYPE'
	 * @param opDescription    操作描述
	 * @param opState    操作状态
	 * @return
	 */
	public String addOperateHistory(String userId,String unitId,String opType,String opDescription,String opState);
}
