package com.sgepit.pmis.budget.service;

import java.util.List;


public interface ConCompletionMgmFacade {
	/**
	 * @description 删除主表前判断从表是否有数据
	 * @param equids
	 * @return String
	 */
	public String checkDelete(String[] concomids);
	/**
	 * @description 获得所有有合同投资完成的合同ID
	 * @return conidList
	 */
	public List getCompleteConids();
	/**
	 * @description 合同投资完成初始化从表数据
	 * @param conid
	 * @param concomid
	 */
	public void initConCompletionSub(String conid, String concomid);
	
	public List setTotalMoney(String conid, String bdgid, String month);
	
}
