package com.sgepit.pcmis.balance.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pcmis.balance.hbm.PcBalanceSortTree;

/**
 * @ConAccinfoMgmFacade 结算管理-业务逻辑接口
 * 
 */
public interface PCBalanceService {

	public List<ColumnTreeNode> balanceManagerTree(String orderBy,Integer start, Integer limit, HashMap map);
	
	public int addOrUpdateBalanceInfo(PcBalanceSortTree balanceInfo) throws BusinessException, SQLException;
	
	public int deleteBalanceInfo(String uids) throws BusinessException, SQLException;
}
