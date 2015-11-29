package com.sgepit.pmis.equipment.service;

import com.sgepit.pmis.equipment.hbm.EquTkGoods;

public interface EqutkgoodsMgmFacade {
	public void insertTkGoods(EquTkGoods equTkGoods);
	public void updateTkGoods(EquTkGoods equTkGoods);
	public String checkDelete(String ggid);
	public String initTkGoodsBh(String initBh);
	public boolean checkBhExist(String bh);
	public void deleteTkGoods(String ggid, String type);
}
