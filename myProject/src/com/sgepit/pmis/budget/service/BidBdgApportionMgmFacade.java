package com.sgepit.pmis.budget.service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.budget.hbm.BidBdgApportion;
import com.sgepit.pmis.budget.hbm.OtherCompletionSub;

/**招标概算分摊 业务逻辑接口
 * @author tengri
 *
 */
public interface BidBdgApportionMgmFacade {
	public void deleteOthComp(OtherCompletionSub othComp) throws SQLException,BusinessException;
	
	public void insertOthComp(OtherCompletionSub othComp) throws SQLException,BusinessException;
	
	public void updateOthComp(OtherCompletionSub othComp) throws SQLException,BusinessException;
	
	public List<ColumnTreeNode> getOtherTree(String parentId, String id) throws BusinessException ;
	
	public List<ColumnTreeNode> otherCompTree(String parentId, String id) throws BusinessException ;
	
	
	/**招标概算分摊树
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param map
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> bidBdgApportionTree(String orderBy,Integer start, Integer limit, HashMap map) throws BusinessException;
	
	/**招标概算树
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param map
	 * @return
	 * @throws BusinessException
	 */
	public List<ColumnTreeNode> getZbgsTree(String orderBy,Integer start, Integer limit, HashMap map) throws BusinessException;
	
	
	/**保存选择 的子树
	 * @param zbUids 招标申请主键
	 * @param conid 招标内容主键
	 * @param ids  选中tree的id集合
	 */
	public void saveGetZbgsTree(String zbUids,String conid, String[] ids);
	
	
	/**删除招投标概算树
	 * @param uids  主键id
	 * @return
	 * @throws Exception
	 */
	public int delChildNodeBidBdgApportion(String uids) throws Exception;
	
	
	/**重新计算操作节点所有父节点对应的【本次计划概算金额】
	 * @param app  操作节点对象
	 * @param flag  标示是删除操作还是修改操作
	 * @param value  操作节点的本次招标计划概算金额
	 * @throws Exception
	 */
	public void reCalcOldPlanMoney(BidBdgApportion app,String flag,String value) throws Exception;
	
	/**更新本次计划概算金额
	 * @param uids  本次节点主键id
	 * @param value  修改后的值
	 * @throws Exception
	 */
	public void updatePlanBgMoney(String uids,String value) throws Exception;
	
	

}
