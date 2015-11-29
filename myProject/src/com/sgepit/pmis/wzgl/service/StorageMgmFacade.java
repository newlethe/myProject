package com.sgepit.pmis.wzgl.service;

import java.util.Date;

public interface StorageMgmFacade {
	/**
	 * 从session获取pid
	 * @return
	 */
	public String getPid();
	/**
	 * 计划内领用
	 * @param bh:领用编号
	 * @param bm：编码
	 * @param userid
	 * @return
	 */
	public boolean getGoods(String bh,String bm,Double sqsl,String userid,String username,String flwbh);
    
	public void updateBillState(String bh);

	public boolean deleteGoods(String delbh,String delbm);
	
	/**
	 * 仓储管理：月末结转
	 * @param p_date
	 * @param p_sttime
	 * @param p_edtime
	 * @return
	 */
	public int createMonthStock(String p_date,String p_sttime,Date p_edtime);
	
	public String getJhbh(String bh);
}
