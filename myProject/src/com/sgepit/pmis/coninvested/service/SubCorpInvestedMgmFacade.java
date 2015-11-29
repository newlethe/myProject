/***********************************************************************
 * Module:  ProjectConMgmFacade.java
 * Author:  lxb
 * Purpose: Defines the Interface ProjectConMgmFacade
 ***********************************************************************/

package com.sgepit.pmis.coninvested.service;


/** @pdOid 02e68e9e-2ad7-4333-99e2-0cfbd93573a3 */
public interface SubCorpInvestedMgmFacade {
	/**
	 * 重新计算累计金额和百分比
	 */
	public void reCalculate(String[] ids, String[] bdgid, Double[] curMoney, String month);
	public void saveGetBudgetTree(String corpbasicid, String[] ids,String month);
	  
}