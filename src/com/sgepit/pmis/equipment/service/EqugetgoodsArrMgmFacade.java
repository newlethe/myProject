package com.sgepit.pmis.equipment.service;

import com.sgepit.frame.flow.hbm.ZlInfo;
import com.sgepit.pmis.equipment.hbm.EquGetGoodsArr;
import com.sgepit.pmis.equipment.hbm.EquSbdhArr;

public interface EqugetgoodsArrMgmFacade {
	public void insertGetGoods(EquGetGoodsArr equGetGoodsArr);
	public void updateGetGoods(EquGetGoodsArr equGetGoodsArr);
	public String initGetGoodsBh(String initBh);
	public boolean checkBhExist(String bh);
	/**
	 * 保存设备资料
	 * @param fileid
	 * @param filename
	 * @param dhbh
	 * @param pid
	 * @return
	 * @createDate: May 4, 2011
	 */
	public boolean insertSbZl(String fileid,String filename,String dhbh, String pid);
	
	public boolean removeSbZl(ZlInfo zlinfo);
	public void deleteGetGoods(String ggid, String type);
	public String checkDelete(String ggid);
	public String saveEquSbdh(EquSbdhArr equ);
	public String checkDeleteEqu(EquSbdhArr equ);
	public boolean deleteGetGoodsSub(String[] uuids);
	public String saveGetGoodsSub(EquSbdhArr[] equSbdhArr, String conid);
	
}
