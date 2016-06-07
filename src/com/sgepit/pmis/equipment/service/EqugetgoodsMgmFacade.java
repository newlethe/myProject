package com.sgepit.pmis.equipment.service;

import java.util.List;

import com.sgepit.pmis.equipment.hbm.EquGetGoods;
import com.sgepit.pmis.equipment.hbm.EquHouseout;

public interface EqugetgoodsMgmFacade {
	public void insertGetGoods(EquGetGoods equGetGoods);
	public void updateGetGoods(EquGetGoods equGetGoods);
	public void inserthousOutGoods(EquHouseout equhouseout);
	public void updateGetOuseoutGoods(EquHouseout equhouseout);
	public String checkDelete(String ggid);
	public List getGoodsSub(String ggid);
	public String initGetGoodsBh(String initBh);
	public String initHouseOutBh(String initBh);
	
	public boolean checkBhExist(String bh,String type);
	public void deleteGetGoods(String ggid, String type);
	/**
	 * 设备入库时允许多选 2010年10月27日 hanhl
	 * @param sbdhid 设备到货ID
	 * @param sbids 到货清单中选择的设备的主键，多个用,分隔
	 * @return
	 */
	public boolean insertEquSbrk(String sbrkId,String sbdhid,String sbids);
	public boolean insertEqusbdh(String dhid,String sbid,String sbbm,String sbmc,String ggxh,String dw,String opensl,String haveFlag);
	public boolean insertEquSbrkFromEquList(String rkid,String conid,String sbids);
	
	/**
	 * 删除出库单信息
	 * @param ckdId
	 * @return
	 */
	public boolean deleteCkd(String ckdId);
	
	
	public void saveHoustOutSub(String uuid,String conid );
	public boolean deleteGetGoodInputSub(String[] uuids);
	public boolean deleteGetGoodInput(String ggid);
	public int deleteHouseOutSub(String[] uuids);
	public int deleteHouseOut(String outid);
}
