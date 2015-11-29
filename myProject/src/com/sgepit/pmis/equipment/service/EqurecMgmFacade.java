package com.sgepit.pmis.equipment.service;

import java.util.List;

import com.sgepit.pmis.equipment.hbm.EquRec;
import com.sgepit.pmis.equipment.hbm.EquRecSub;

public interface EqurecMgmFacade {
	public List equInfoGetGoods();
	public String insertRec(String recid, String[] equids, Double[] dhsls, String[] jzhs);
	public List equRecSub(String recid);
	public String checkDelete(String[] recids);
	public void deleteEquRec(String type, String[] recids);
	public String deleteRecSub(String recSubid);
	public void updateRecSub(EquRecSub ers);
	public void insertequRec(EquRec er);
	public void saveOrUpdate(EquRec er);
	public int storeNum(String equId);
	public int storeNum2(String equId);
	public int storeNum3(String equId);
	public List equGoodsSub(String conId);
	public String getRecNo(String conid);
	public List findRecEqu(String sbMc, String scCj, String jzH);
	public List equRecSub2(String conid);
	public String SaveRecSub(EquRecSub sub,String Erecid);
	public void SaveRecSub2(String[] ids,String recid);
}
