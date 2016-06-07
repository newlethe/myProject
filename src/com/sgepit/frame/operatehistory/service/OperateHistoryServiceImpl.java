/**
 * 
 */
package com.sgepit.frame.operatehistory.service;

import java.util.Date;

import org.springframework.context.ApplicationContext;

import com.sgepit.frame.base.service.BaseMgmImpl;
import com.sgepit.frame.operatehistory.dao.OperateHistoryDAO;
import com.sgepit.frame.operatehistory.hbm.UOperateHistory;
import com.sgepit.frame.util.db.SnUtil;

/**
 * @author qiupy 2013-1-29 
 *
 */
public class OperateHistoryServiceImpl extends BaseMgmImpl implements
		OperateHistoryService {

	private OperateHistoryDAO operateHistoryDAO;

	public OperateHistoryDAO getOperateHistoryDAO() {
		return operateHistoryDAO;
	}

	public void setOperateHistoryDAO(OperateHistoryDAO operateHistoryDAO) {
		this.operateHistoryDAO = operateHistoryDAO;
	}
	public static OperateHistoryServiceImpl getFromApplicationContext(ApplicationContext ctx) {
		return (OperateHistoryServiceImpl) ctx.getBean("operateHistoryService");
	}
	/**
	 * 增加操作历史记录
	 * @param userId     操作人ID
	 * @param unitId     操作人所在单位
	 * @param opType     用户操作类型,同时对应property_code中的 type_name = 'OPERATE_TYPE'
	 * @param opDescription    操作描述
	 * @param opState    操作状态
	 * @return
	 */
	public String addOperateHistory(String userId,String unitId,String opType,String opDescription,String opState){
		UOperateHistory op = new UOperateHistory();
		op.setUids(SnUtil.getNewID());
		op.setOperateUser(userId);
		op.setUnitId(unitId);
		op.setOperateTime(new Date());
		op.setOperateType(opType);
		op.setOperateDescription(opDescription);
		op.setOperateState(opState);
		operateHistoryDAO.insert(op);
		return "OK";
	}
}
