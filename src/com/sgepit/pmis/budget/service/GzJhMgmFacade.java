package com.sgepit.pmis.budget.service;

import java.sql.SQLException;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.budget.hbm.BdgMoneyApp;
import com.sgepit.pmis.budget.hbm.BdgMonthMoneyPlan;
import com.sgepit.pmis.routine.hbm.GzJh;



/**
 * @GzJhZjFacade 工作计划总结- 业务逻辑接口
 * @author Louj
 */
public interface GzJhMgmFacade {
	
	/*
	 * 工作计划汇报
	 */
	public String addOrUpdateGzJh(GzJh gzjh);
		

}
