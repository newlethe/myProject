package com.sgepit.pmis.material.service;

import java.sql.SQLException;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.pmis.material.hbm.MatStoreIn;
import com.sgepit.pmis.material.hbm.MatStoreInReplace;
import com.sgepit.pmis.material.hbm.MatStoreInsub;
import com.sgepit.pmis.material.hbm.MatStoreOutsub;
import com.sgepit.pmis.wzgl.hbm.WzCjsxb;


/**
 * BdgChangeMgmFacade 合同变更概算 - 业务逻辑接口
 * @author Zhugx
 */
public interface MatStoreMgmFacade {
	void insertMatIn(MatStoreInsub matStoreIn) throws SQLException, BusinessException;
	void updateMatIn(MatStoreInsub matStoreIn) throws SQLException, BusinessException;
	void deleteMatIn(MatStoreInsub matStoreIn) throws SQLException, BusinessException;
	
	public void saveMatFrameTree(String inId, String[] ids) throws SQLException, BusinessException;
	public void selectInMatBuy(String inId, String[] matIds, String formId) throws SQLException, BusinessException;
	public void selectInMatGoods(String inId, String[] matIds, String goodsId) throws SQLException, BusinessException;
	public List getAppMat(String appId) throws SQLException, BusinessException;
	public void selectOutMaApp(String outId, String[] matIds, String appId) throws SQLException, BusinessException;
	
	
	public String insertRkd(MatStoreIn matStoreIn) throws SQLException, BusinessException;
	public boolean updateRkd(MatStoreIn matStoreIn);
	
	public boolean saveStoreInByCon(String inId,String[] ids,String[] cgbh);
	public boolean saveStoreInByPlan(String inId,String[] uids,String[] ids);
	
	//非计划出库,计划内领用
	public void saveMatStoreOutSub(MatStoreOutsub[] matStoreOutsub);
	
	
	/**
	 * 选择替代物资
	 * @param tdBmArr
	 * @param bh
	 * @param bm
	 * @param pid
	 * @return
	 * @author zhangh 2012-11-06
	 */
	public String getTdWz(String[] tdBmArr, String bh, String bm, String pid);
	
	/**
	 * 保存替代物资
	 * @param replaces
	 * @param bh
	 * @param bm
	 * @param pid
	 * @return
	 * @author zhangh 2012-11-06
	 */
	public String saveTdWz(MatStoreInReplace[] replaces, String bh, String bm, String pid);
	
	
	/**
	 * 删除替代物资
	 * @param uidsArr
	 * @param bh
	 * @param bm
	 * @param pid
	 * @return
	 * @author zhangh 2012-11-06
	 */
	public String deleteTdWz(String[] uidsArr, String bh, String bm, String pid);
}
