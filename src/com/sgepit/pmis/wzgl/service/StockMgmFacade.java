package com.sgepit.pmis.wzgl.service;

import java.util.List;

import com.sgepit.pmis.wzgl.hbm.ViewWzArriveCgjh;
import com.sgepit.pmis.wzgl.hbm.ViewWzCollectApply;
import com.sgepit.pmis.wzgl.hbm.ViewWzConCgjh;
import com.sgepit.pmis.wzgl.hbm.WzArriveApply;
import com.sgepit.pmis.wzgl.hbm.WzBm;
import com.sgepit.pmis.wzgl.hbm.WzCdjinPb;
import com.sgepit.pmis.wzgl.hbm.WzCjhxb;
import com.sgepit.pmis.wzgl.hbm.WzCjspb;
import com.sgepit.pmis.wzgl.hbm.WzCjspbHzSub;
import com.sgepit.pmis.wzgl.hbm.WzCjsxb;
import com.sgepit.pmis.wzgl.hbm.WzInput;
import com.sgepit.pmis.wzgl.hbm.WzUser;

/**
 * @author admin
 *
 */
public interface StockMgmFacade {	

	/**获取汇总申请计划列表
	 * @param whereStr
	 * @param start
	 * @param limit
	 * @return List
	 */
	public List<ViewWzCollectApply> getCollectApply(String whereStr,Integer start, Integer limit);
	
	/**汇总选择的申请计划，生成采购计划，同时更新申请计划表中的采购计划编号和计划人
	 * @param stockBh:采购计划编号
	 * @param bmStr,多个物资编码 以,分隔
	 * @param applyBHStr:多个申请计划编号','分隔，Example: '123','BBB'
	 * @param ygslStr 应采购数量，以,分隔
	 * @return 
	 */
	public boolean collectApplyAndCreateStock(String stockBh,String bmStr, String applyBhStr);
	
	/**删除采购计划的物资清单
	 * @param uids：物资清单的主键，以`进行分割
	 * @return
	 */
	public boolean deleteStockPlanMat(String uids);
	
	
	/**删除一份采购采购计划
	 * @param bh：采购计划的主键uids
	 * @return
	 */
	public boolean deleteStockPlan(String bh);
	/**获取某个表编号的最大值
	 * @param prefix:编号前缀
	 * @param col: 列名称
	 * @param table: 表名称
	 * @param lsh：最大的流水号（null，表示没有传入，需要从数据库中获取）
	 * @return
	 */
	public String getStockPlanNewBh(String prefix, String col, String table, Long lsh);
	public String getStockPlanNewBhNoSession(String prefix, String col, String table, Long lsh, String pid);
	/**到货时，列出采购计划的物资清单
	 * @param where:where条件
	 * @param order: 排序列
	 * @return List<ViewWzArriveCgjh>
	 */
	public List<ViewWzArriveCgjh>getArriveCgjh(String where,String order,Integer start, Integer limit);
	
	
	/** 根据到货记录生成到货入库单
	 * @param arriveBh：到货记录编号
	 * @param fph：发票号
	 * @@return boolean（是否成功）
	 */
	public boolean arriveAndCreateInput(ViewWzArriveCgjh hbm, WzCdjinPb cdjInPbHbm,String fph, String rkbh, String pid);
	
	
	/** 根据到货记录生成到货入库单
	 * @param uis：主键
	 * @@return WzInput
	 */
	public WzInput getArriveMatByID(String uids);
	
	public WzCdjinPb getWzCdjInPb(String uids);
	
	public List<WzArriveApply> getArriveApply(String whereStr,String arriveBh,String sort);
	
	public boolean saveArriveApply(WzArriveApply item,String arriveBh);
	
	public boolean saveArriveMat(WzInput item);
	
	public Integer deleteArriveMat(String[] ida) throws Exception;
	
	//采购需用计划申请添加修改
	public String addOrUpdateWzCjspb(WzCjspb cjspb);
	
	//验证需用计划申请编号唯一
	public boolean checkBHno(String bh);
	
	//需用计划申请细表中选择物资明细
	public boolean wzcjsxbSelectWz(String bh,WzBm [] wzbarr);
	
	public List<WzUser> getWzUser(String where);
	
	//入库验收，申请验收
	public boolean modifyWzInputCheckin(String uidsStr);
	
	

	/**采购合同录入时，列出采购计划的物资清单
	 * @param where:where条件
	 * @param order: 排序列
	 * @return List<ViewWzArriveCgjh>
	 */
	public List<ViewWzArriveCgjh>getConCgjh(String where,String order,Integer start, Integer limit);
	
	public boolean crateConMatFromCgjh(String conBh,ViewWzConCgjh hbm);
	
	public Integer deleteConMat(String[] ida) throws Exception;
	public boolean createConMatFromStorage(String hth,WzBm [] wzbarr);
	//到货中选择库存物资
	public boolean createArriveMatFromStorage(String bh,WzBm [] wzbarr,  String fph,String userId);
	public boolean saveArriveMatAfterEdit(WzInput inputHbm);
	
	
	public boolean saveApplyHzSub(WzCjspbHzSub[] hzSubs,String uids,String bh);
	public boolean deleteApplyHzById(String uids);
	public boolean deleteApplyHzSubById(String[] uids);
	public boolean saveStockPlanWzFromApplyHz(String[] uids, String cgbh);
	public boolean saveStockPlanWzFromApply(String[] uids, String cgbh);

	public boolean deleteApplyPlan(String uids, String bh);
	
	/**
	 * 国锦移植方法，流程中有用到
	 * @param dhbh
	 * @return
	 */
	public String getArriveBh(String dhbh);
}
