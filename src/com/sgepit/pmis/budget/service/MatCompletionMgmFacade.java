package com.sgepit.pmis.budget.service;

import java.util.List;



public interface MatCompletionMgmFacade {
	/**
	 * 获得材料投资完成的概算
	 * @param acmid
	 * @return
	 */
	public List getBdgData(String acmid);
	/**
	 * 获得材料投资完成的某概算下的乙方单位下所有材料
	 * @param acmid
	 * @param bdgid
	 * @param partyb
	 * @return
	 */
	public List getMat(String acmid,String bdgid,String partyb);
	/**
	 * 获得材料投资完成的某概算下的乙方单位
	 * @param acmid
	 * @param bdgid
	 * @return
	 */
	public List getPartyb(String acmid,String bdgid);
	public void initMatCompletion(String acmid);
	
}
