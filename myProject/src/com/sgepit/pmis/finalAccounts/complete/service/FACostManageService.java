package com.sgepit.pmis.finalAccounts.complete.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompCostFixedAssetCont;
import com.sgepit.pmis.finalAccounts.complete.hbm.FacompOtherCostStatistics;

public interface FACostManageService {

	public List<ColumnTreeNode> buildColumnNodeTree(String treeName,
			String parentId, Map params) throws BusinessException;
	public List<ColumnTreeNode> getOtherAssetConTree(String parentId, String pid);
	public List<ColumnTreeNode> getBdgMoneyProjectTree(String parentId, String conId);
	/**
	 * 
	* @Title: getOtherCostProjectTree
	* @Description: 参与其他费用分摊的合同工程量明细树
	* @param orderBy
	* @param start
	* @param limit
	* @param map
	* @return   
	* @return List<ColumnTreeNode>    
	* @throws
	* @author qiupy 2013-7-6
	 */
	public List<ColumnTreeNode> getOtherCostProjectTree(String orderBy, Integer start, Integer limit, HashMap map);
	public void saveSelectProjectTree(String conid,String costType, String[] ids);
	public void initFixedAssetTreeForFirstCon(String masterid);
	public void initFixedAssetTreeForSecondCon(String masterid);
	public void updateFixedAssetTreeForSecondCon(String masterid);
	public void updateFixedAssetTreeForFirstCon(String masterid);
	public List<ColumnTreeNode> getFACompFixedAssetList(String orderBy, Integer start, Integer limit, HashMap map);
	public String deleteContConById(String masterid);
	public String updateCostFixedAssetCont(FacompCostFixedAssetCont facfac);
	public String updateCost2FixedAssetCont(FacompCostFixedAssetCont facfac);
	public void updateOtherCostContMoney(String masterid);
	public List<ColumnTreeNode> getFACompFixedAssetTotalList(String orderBy, Integer start, Integer limit, HashMap map);
	public String updateOtherCostStatistics(FacompOtherCostStatistics focs);
	public String initOtherCostStatisticsTree(String pid);
	public List<ColumnTreeNode> getFacompOtherCostStatisticsTree(String orderBy, Integer start, Integer limit, HashMap map);
	public boolean checkFixedAssetUsed(String treeid);
	public String doContByContFormula(String masterid,String formulaType);
	public void saveFacompOtherCostCon(String conid,String costType);

	/**
	 * 主体材料出库分摊固定资产清单树
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param map
	 * @return 主体材料出库分摊固定资产清单树
	 * @author pengy 2013-11-21
	 */
	public List<ColumnTreeNode> getFACompCloutFixedAssetList(String orderBy, Integer start, Integer limit, HashMap map);

	/**
	 * 初始化主体材料出库分摊固定资产树，仅用于行选中
	 * @param pid 项目ID
	 * @param outsubUids 出库单主键
	 * @param amount 出库金额
	 * @param masterid 主体材料分摊表主键
	 * @param type 设备、材料或工程量
	 * @param using 所属概算id
	 * @param relateAsset 关联资产treeid
	 * @return 主体材料分摊表主键
	 * @author pengy 2013-11-21
	 */
	public String initFixedAssetTreeForClout(String pid, String outsubUids, double amount, String masterid,
			String type, String using, String relateAsset);

	/**
	 * 更新材料出库分摊金额
	 * @param masterid 主体材料出库分摊汇总表主键
	 * @param uids 主键   
	 * @param apportionMoney 分摊金额
	 * @param remark 备注
	 * @author pengy 2013-11-21
	 */
	public void updateCloutApprotionMoney(String masterid, String uids, double apportionMoney, String remark);

	/**
	 * 修改主体材料出库明细的关联资产字段
	 * @param outSubUids 出库明细主键
	 * @param amount 出库金额
	 * @param treeid 选择的关联资产treeid
	 * @author pengy 2014-01-21
	 */
	public void updateRelateAsset(String outSubUids, double amount, String treeid);
	/**
	 * 
	* @Title: getFinanceSubjectTree
	* @Description:  获得竣工决算财务科目 --其他投资树
	* @param orderBy
	* @param start
	* @param limit
	* @param map
	* @return   
	* @return List<ColumnTreeNode>    
	* @throws
	* @author qiupy 2014-3-8
	 */
	public List<ColumnTreeNode> getFinanceSubjectTree(String orderBy, Integer start, Integer limit, HashMap map);
	/**
	 * 
	* @Title: addContConByFinaceSubject
	* @Description: 从财务科目新增其他费用分摊记录
	* @param selectIds  选中的财务科目树treeid
	* @param costType   其他费用类型
	* @return void    
	* @throws
	* @author qiupy 2014-3-8
	 */
	public String  addContConByFinaceSubject(String selectIds,String costType,String pid);
	/**
	 * 
	* @Title: updateContConByFinaceSubject
	* @Description:  更新来源于财务科目的分摊记录的参与分摊额（一类和二类）
	* @param masterId 
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-3-10
	 */
	public String updateContConByFinaceSubject(String masterId);

	/**
	 * 对材料汇总分摊中还未初始化的数据自动选择分摊公式进行分摊
	 * @param pid
	 * @param flag 是否对所有数据分摊
	 * @param flag 入口标志，材料汇总分摊的行选中‘1’，分摊按钮‘2’，固定资产初始化按钮‘3’
	 * @return 分摊数据的条数
	 * @author pengy
	 * @createtime 2014-03-18
	 */
	public String initCloutApportion(String pid, String flag);

	/**
	 * 
	* @Title: initOtherCostStatisticsTreeFromSubject
	* @Description:  初始化其他费用统计树-科目版
	* @param pid
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-3-20
	 */
	public String initOtherCostStatisticsTreeFromSubject(String pid);
	/**
	 * 
	* @Title: updateAllOtherCostCont
	* @Description: 1、	更新“合同总金额”、“参与一类（二类）费用分摊金额”取值于最新财务科目累计发生额
	* 2、	固定资产管理模块相关字段数据同步更新
	* 3、	按原有分摊公式重新分摊（如未选择公式的，可不重新分摊）
	* 4、	统计“已分摊金额”、“未已分摊金额”
	* @param pid
	* @param costType
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-3-22
	 */
	public String updateAllOtherCostCont(String pid ,String costType);

	/**
	 * 材料分摊汇总页面选择分摊公式
	 * @param masterAndFormula 主表主键和分摊公式的二维数组
	 * @param pid
	 * @author pengy 2014-04-10
	 */
	public void chooseFormula(String[][] masterAndFormula, String pid);

	/**
	 * 对安装工程量分摊，建筑材料分摊，安装材料分摊公式分摊的数据向上汇总
	 * 抽出向上汇总的sql，提高整体初始化的效率
	 * @param pid 项目id
	 * @author pengy
	 * @createtime 2014-04-25
	 */
	public void updateParentCloutAppor(String pid);

}