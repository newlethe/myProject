package com.sgepit.pmis.reimburse.service;

import com.sgepit.pmis.reimburse.hbm.DeptReimburse;

public interface ReimburseMgmFacade {
	public String addOrUpdateRe(DeptReimburse deptre);
	public String udpateBillState(String bh);
}
