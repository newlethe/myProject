package com.sgepit.pmis.wzgl.service;

import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.wzgl.hbm.WzBm;
import com.sgepit.pmis.wzgl.hbm.WzBmwh;
import com.sgepit.pmis.wzgl.hbm.WzCkclb;
import com.sgepit.pmis.wzgl.hbm.WzCsb;
import com.sgepit.pmis.wzgl.hbm.WzCsbType;
import com.sgepit.pmis.wzgl.hbm.WzGoodsArrival;
import com.sgepit.pmis.wzgl.hbm.WzGoodsBodys;
import com.sgepit.pmis.wzgl.hbm.WzGoodsOpenbox;
import com.sgepit.pmis.wzgl.hbm.WzGoodsOpenboxNotice;
import com.sgepit.pmis.wzgl.hbm.WzGoodsOpenboxSubPart;
import com.sgepit.pmis.wzgl.hbm.WzGoodsOutEstimate;
import com.sgepit.pmis.wzgl.hbm.WzGoodsStockOut;
import com.sgepit.pmis.wzgl.hbm.WzGoodsStorein;
import com.sgepit.pmis.wzgl.hbm.WzGoodsStoreinEstimate;
import com.sgepit.pmis.wzgl.hbm.WzGoodsStoreinEstimateSub;
import com.sgepit.pmis.wzgl.hbm.WzGoodsStoreinSub;

public interface WzBaseInfoMgmFacade {
	
	List<ColumnTreeNode> getWzBmTree(String parentId,String pid) throws BusinessException;
	List<ColumnTreeNode> getWzBmTreeCheck(String parentId,String userid,String userrole,String pid) throws BusinessException;
	List<ColumnTreeNode> getcsBmTree(String parentId,String pid) throws BusinessException;
	
	int addOrUpdateWzCkclb(WzCkclb ckclb);
	int deleteWzCkclb(String uids);
	void saveWzCkclb(WzCkclb ckclb);
	void updateWzCkclb(WzCkclb ckclb);
	
	int addOrUpdateWzCsType(WzCsbType csbtype);
	int deleteWzCsType(String uids);
	void saveWzCsType(WzCsbType csbtype);
	void updateWzCsType(WzCsbType csbtype);
	
	String addOrUpdateWzBm(WzBm wzbm);
	boolean deleteWzBm(String uids);
	boolean updateWzbmStateChange(String uids,String flag);
	void saveWzBm(WzBm wzbm);
	void updateWzBm(WzBm wzbm);
	
	String addOrUpdateWzBmApply(WzBmwh wzbmwh);
	boolean deleteWzBmApply(String bh);
	
	String addOrUpdateWzCsb(WzCsb wzcsb);
	boolean updateWzCsStateChange(String uids,String flag);
	
	boolean updateWzbmConfirmReturn(String bh);
	
	String addOrUpdateWzBmConfirm(WzBmwh wzbmwh);
	
	public void saveGetResPersonTree(String userid, String userrole, String pid,String[] bm);
	
	boolean checkBMno(String bm);
	boolean checkCSno(String csdm);
	public String getNewbm(String flbm, String pid);
	boolean delWzUser(String userid,String roleid);
	public String getNewWzBm(String flbm);
	public String getStockWzBm(String prefix,String pid);
	public List<ColumnTreeNode> WzTypeTreeList(String parentId, String whereStr,String conid);
	//以下是物质材料模块移植设备的出库入库的相关内容所做的修改
	public String WzArrivalFinished(String uids);
	public void sendSmsByWzGoodsArrival(String uids);
	public String deleteArrival(String uids);
	public String addOrUpdateWzArrival(WzGoodsArrival arrival);
	public String setWzSmsUserFun(String arrivalid, String userid, Boolean bool);
	public String addOrUpdateWzOpenboxNotice(WzGoodsOpenboxNotice notice);
	public String insertWzNoticeSubFromArrivalSub(String[] uids, String id,String no);
	public String addOrUpdateWzOpenbox(WzGoodsOpenbox openbox);
	public String getWzOpenboxSubFromNotice(String openboxUids, String noticeUids);
	public void deleteWzOpenboxSub(String openboxUids);
	public String deleteWzOpenbox(String uids);
	public String wzOpenboxFinished(String uids);
	public String initWzOpenboxResult(String openboxUids);
	public String wzNoticeFinished(String uids);
	public String deleteWzOpenboxNotice(String uids);
	public boolean saveStoreWzInByCon(String appid,String[] ids,String dhNo);
	public String delWzRkGoodsStorein(String uids,String flag ,String pid);
	public int judgmentWzFinished(String uids,String exceFlag, String pid,String flags,String makeType);
	public String saveOrUpdataWzRkGoodsStorein(WzGoodsStorein wzGoodsStorein,String pid,String uids);
	public String selectWzCheckToEquIn(String[] uidsArr, String getUids);
	public Double getWzStockNumFromStock(String id);
	public String addOrUpdateWzOut(WzGoodsStockOut equOut);
	public String insertWzOutSubFromStock(String[] uids, String id,String no);
	public String deleteWzOutAndOutSub(String uids);
	public String wzOutFinished(String uids);
	public Double getWzOutNumFromOutSub(String id);
	public int updateWzStockNum(Double newstocknum,String id);
	/**
	 * 材料暂估入库新增时保存到主表的记录
	 * @param equGoodsZGRKStorein
	 * @param pid
	 * @param uids
	 * @return
	 */
	public String saveOrUpdataWzZGRkGoodsStorein(
			WzGoodsStoreinEstimate wzGoodsZGRKStorein, String pid, String uids);
    /**
     * 从材料开箱单中选择
     * @param uidsArr
     * @param getUids
     * @return
     */
	public String selectWzCheckToEquInEstimate(String[] uidsArr, String getUids);
	/**
	 *  删除暂估入库的记录
	 * @param uids
	 * @param flag
	 * @param pid
	 * @return
	 */
	public String delWzRkGoodsStoreinEstimate(String uids, String flag,String pid);
	/**
	 * 暂估入库完结操作
	 * @param uids
	 * @param exceFlag
	 * @param pid
	 * @return
	 */
	public int judgmentWzFinishedEstimate(String uids, String exceFlag, String pid,String flag,String makeType);
    /**
     *  暂估入库完结操作
     * @param uids
     * @param exceFlag
     * @param pid
     * @return
     */
	public String finishWzZGRkGoodsStorein(String uids, String pid,String flags,String makeType);
	/**
	 * 材料冲回入库从暂估入库中选择后存入冲回入库
	 * @param uids
	 * @param newNo
	 * @return
	 */
	public String resetMaterialGoodsStoreinBack(String uids, String newNo);
	   /**
	    * 删除冲回入库数据
	    * @param uids
	    * @param flag
	    * @param pid
	    * @return
	    */
	public String delWzRkGoodsStoreinBack(String uids, String flag, String pid);
    /**
     * 冲回入库完结操作
     * @param uids
     * @param exceFlag
     * @param pid
     * @return
     */
	public int judgmentWzBackFinished(String uids, String exceFlag, String pid,String flags,String makeType);
    /**
     * 冲回入库完结后数据存入库存
     * @param uids
     * @param exceFlag
     * @param pid
     * @return
     */
	public String finishWzBackRkGoodsStorein(String uids, String pid,String flags,String makeType);
	  /**
     * 从暂估入库中选择
     * @param newNo
     * @param uids
     * @return
     */
	public String wzGoodsIntoWarehousingFromZGRK(String newNo, String uids,String pid);
    /**
     * 更新材料暂估出库主表信息
     * @param equOut
     * @return
     */
	public String addOrUpdateWzOutEstimate(WzGoodsOutEstimate equOut);
    /**
     * 从库存中选择材料到暂估出库单明细
     * @param uids
     * @param id
     * @param no
     * @return
     */
	public String insertWzEstimateOutSubFromStock(String[] uids, String id,String no);
	/**
	 * 选择时做选择
	 * @param uids
	 * @param id
	 * @param no
	 * @return
	 */
	public String insertWzOutEsSubFromStock(String[] uids, String id, String no);
	/**
	 * 从库存中获取设备的库存数量
	 */
	public Double getStockNumFromStock(String id);
	/**
	 * 修改库存数量
	 */
   public int updateStockNum(Double newstocknum,String id);
   /**
    * 暂估出库单完结
    * @param uids
    * @return
    */
	public String wzOutEstimateFinished(String uids);
    /**
     * 暂估出库删除
     * @param uids
     * @return
     */
	public String deleteWzEstimateOutAndOutSub(String uids);
	
	/**
	 * 获取设备出库数量
	 */
	public Double getOutNumFromOutSub(String id);
    /**
     * 冲回入库进行选择后把暂估出库的数据保存到冲回入库表中
     * @param uids
     * @return
     */
	public String insertWzGoodsOutBack(String uids,String newCkNo);
	/**
	 * 材料冲回入库删除
	 * @param uids
	 * @return
	 */
	public String deleteWzOutBackAndOutBackSub(String uids);
	/**
	 * 材料冲回入库完结操作
	 * @param uids
	 * @return
	 */
	public String wzOutBackFinished(String uids);
 	/**
 	 * 正式出库从暂估出库中选
 	 * @param uids
 	 * @param newOutNO
 	 * @return
 	 */
	public String insertWzFromOutEstimateToOutStock(String uids, String newOutNO);
	   /**
     * 暂估出库单冲回出库
     * @param uids
     * @return
     */
	public String resetWzGoodsOutEstimate(String uids);
	public String wzBodySaveOrUpdate(WzGoodsBodys wzGoodsBodys);
	/**
	 * @author yanglh
	 * 2013年4月22日 
	 * 材料主体设备暂估入库从表新增时保存记录
	 * @param equGsESub
	 * @return
	 */
	public String saveOrUpdataWzGoodsStoreinEstimateSub(WzGoodsStoreinEstimateSub  wzGsESub);
	/**
	 * @author yanglh
	 * 2013年4月22日 
	 * 材料主体设备正式入库从表新增时保存记录
	 * @param equGsESub
	 * @return
	 */
	public String saveOrUpdataWzGoodsStoreinSub(WzGoodsStoreinSub  wzGsSub);
	/**
	 * @author yanglh
	 * @date 2013年4月24日
	 * @title 材料主体出入库暂估入库从材料主体设备只选择
	 * @param getUids
	 * @param sbrkUids
	 * @return
	 */
	public String saveWzEsSubFromEquGoodsBody(String[] getUids, String sbrkUids);
	/**
	 * @author yanglh
	 * @date 2013年4月24日
	 * @title 材料主体出入库正式入库从材料主体设备只选择
	 * @param getUids
	 * @param sbrkUids
	 * @return
	 */	
	public String saveWzIntoSubFromEquGoodsBody(String[] getUids, String sbrkUids);
	/**
	 * @author yanglh
	 * @date 2013年4月27日
	 * @title 综合部生产部出入库选择物资功能实现
	 * @param uids
	 * @param inId
	 * @param pid
	 * @return
	 */
	public String insertWzbmIntoMatStoreInSub(String[] uids,String inId,String pid);
	/**
	 * 材料明细有箱件的粘贴功能
	 * @param parts
	 * @return
	 */
	public String pasteWzOpenboxPart(WzGoodsOpenboxSubPart[] parts);
	/**
	 * 材料主体设备中出库单中新增页面对应的主体设备
	 * @param parentId
	 * @param whereStr
	 * @author yanglh 2013-6-4
	 * @return
	 */
	public List<ColumnTreeNode> WzBodyTreeList(String parentId, String whereStr);
	/**
	 * 主体材料从采购合同选择物资
	 * @author yanglh 2013-6-8
	 * @param getUids
	 * @param getBm
	 * @param pid
	 * @param selectConid
	 * @param selectTreeid
	 * @return
	 */
	public boolean wzAddBodyFromConMat(String[] getUids, String getBm,String pid,
			String selectConid,String selectTreeid);
	
	/**
	 * 出入库稽核管理树
	 * @param parentId	父节点ID
	 * @param whereStr	sql查询条件
	 * @param conid		合同ID
	 * @return	出入库稽核管理树节点的稽核
	 */
	List<ColumnTreeNode> intoAndOutAuditTreeList(String parentId, String whereStr, String conid);

	/**
	 * 获取清册明细数量
	 * @param equNo
	 * @return
	 */
	public int getQcCount(String equNo);
	/**
	 * 获取qcId
	 * @param equNo
	 * @return
	 */
	public String getQcUids(String equNo);

	/**
	 * 主体材料记录完结时的出入库主从表信息做台账
	 * yanglh	2013-8-9
	 * @param pid
	 * @param mainTable
	 * @param fromTableUids 从表主键
	 * @param fromTableSubNum 从表填写时的数量
	 * @param inOrOut:RK--记录入库信息，CK--记录出库信息
	 */
	public void insertCLSubToFinishedRecord(String pid, String mainTableUids,String fromTableUids,String fromTableSubNum,String inOrOut);

	public String doSelectInSubToOutSub(String[] inSubUidsArr,String outUids,String outNo);

	/**
	 * 暂估入库冲回
	 * @param uids
	 * @param wz
	 * @return “success” 成功，“failure” 失败
	 * @author yanlgh 2013-11-14
	 */
	public String zgrkInsertChrkAndZsrkWz(String uids,WzGoodsStorein wz);
	
	/**
	 * 暂估出库冲回
	 * @param uids
	 * @param WzGoodsStockOut wzOut
	 * @return  “success” 成功，“failure” 失败
	 * @author yanlgh 2013-11-19
	 */
	public String zgckInsertChckAndZsckWzOut(String uids, WzGoodsStockOut wzOut);

	/**
	 * 入库冲回时判断库存是否小于0
	 * @param uids
	 * @return ‘1’冲回后库存小于0，‘0’冲回后库存没有小于0的
	 * @author yanglh 2013-12-26
	 */
	public String judgmentSubIsSameStock(String uids);

}
