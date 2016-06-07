package com.sgepit.pmis.planMgm.service;

import java.io.IOException;
import java.io.InputStream;
import java.sql.SQLException;
import java.util.List;

import javax.naming.NamingException;

import org.jdom.JDOMException;

import com.sgepit.pmis.budget.hbm.BdgInfo;
import com.sgepit.pmis.contract.hbm.ConOve;
import com.sgepit.pmis.planMgm.hbm.PlanMaster;
import com.sgepit.pmis.planMgm.hbm.PlanOtherCostItem;

public interface InvestmentPlanService {

	/**
	 * 保存投资和资金计划主记录的信息：(包括插入和更新)
	 * @param master
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-12
	 */
	public String savePlanMaster(PlanMaster master);
	
	/**
	 * 根据业务类型、单位、 时间， 获得投资计划的主记录信息；
	 * @param businessType
	 * @param unitId
	 * @param sjType
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-12
	 */
	public PlanMaster getPlanMasterInfo(String businessType, String unitId, String sjType);
	
	/**
	 * 检查要添加的记录中，是否在数据库中已存在；
	 * @param businessType
	 * @param unitId
	 * @param sjType	可能为多个时间，用`连接；
	 * @param contractId
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-19
	 */
	public boolean checkSaveData(String businessType, String sjTypes, String unitId, String contractId);
	
	/**
	 * 初始化投资计划的数据；
	 * 根据businessType做不同的处理； 根据sjType的位数判断初始化的类型；
	 * @param businessType
	 * @param unitId
	 * @param sj_type
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-12
	 */
	public boolean initInvestmentPlanData(String businessType, String unitId, String sj_type);
	
	/**
	 * 插入多条主记录时，对多条主记录的计划数据初始化；
	 * @param businessType
	 * @param unitId
	 * @param sjTypes
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-19
	 */
	public boolean initInvestmentPlanDatas(String businessType, String unitId, String sjTypes);
	
	/**
	 * 根据主键 获得投资计划的主记录信息；
	 * @param masterId
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-12
	 */
	public PlanMaster getPlanMasterInfoById(String masterId);
	
	/**
	 * 计算计划数据的年度、季度的合计值；
	 * @param businessType
	 * @param unitId
	 * @param sj_type
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-16
	 */
	public boolean calCollectData(String businessType, String unitId, String sj_type);
	
	/**
	 * 获得合同的相关信息；
	 * @param whereStr
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-16
	 */
	public List<ConOve> getConOveInfo (String whereStr);
	
	/**
	 * 删除计划主记录及其关联的明细数据信息
	 * @param sjFlag	年：Y；季度Q；月度：M；
	 * @param masterIds	主记录的主键信息；
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-16
	 */
	public boolean deleteMasterAndDetailData(String sjFlag, String masterIds);
	
	/**
	 * 计算数据的累计值和累计%
	 * @param businessType
	 * @param unitId
	 * @param sjType
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-17
	 */
	public boolean updateDataAddup(String businessType, String unitId, String sjType);
	/**
	 * 根据主表ID生成工程量投资计划明细数据
	 * @param masterId
	 * @return
	 */
	public boolean initQuantitiesPlanData(String masterId);
	/**
	 * 获取可以新增的数据期别
	 * @param businessType   业务类型
	 * @param unitId         上报单位ID
	 * @param conId          合同ID
	 * @return
	 */
	public String getSjTypeForPlan(String businessType,String unitId,String conId);
	
	/**
	 * 根据合同ID和所选择的分摊的概算ID，获取包括该概算ID下的所有子节点
	 * @param conId
	 * @param bdgId
	 * @return
	 */
	public String getFullBdgPath(String conId,String bdgId);
	/**
	 * 计划数据上报
	 * @param masterIds
	 * @param state 状态
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-21
	 */
	public boolean reportPlanData(String masterIds, String state);
	
	/**
	 * 计算工程量投资计划在合同上的合计
	 * 
	 * @param businessType
	 * @param unitId
	 * @param sjType
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-22
	 */
	public boolean collectQuantitiesAmount(String businessType, String unitId, String sjType);
	
	/**
	 * 获取其他费用计划的xgridTree的xml数据；
	 * @param businessType
	 * @param unitId
	 * @param sjType
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-22
	 */
	public String getOtherCostPlanXml(String businessType, String unitId, String sjType);
	
	/**
	 * 更新xgrid中填写的投资计划的数据；
	 * @param businessType
	 * @param unitId
	 * @param sjType
	 * @param dataXML
	 * @return
	 * @author: Ivy
	 * @throws IOException 
	 * @throws JDOMException 
	 * @throws NamingException 
	 * @throws SQLException 
	 * @createDate: 2010-12-23
	 */
	public String updateInvestmentData(String businessType, String unitId, String sjType, String dataXML) throws JDOMException, IOException, NamingException, SQLException;
	
	/**
	 * 根据概算项目ID，获得概算项目的相关信息；
	 * @param bdgId
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-24
	 */
	public BdgInfo getBdgInfoById(String bdgId);
	
	/**
	 * 根据其他费用项目ID，获得项目的相关信息；
	 * @param itemId
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-24
	 */
	public PlanOtherCostItem getItemInfoById(String itemId);
	
	/**
	 * 根据其他费用项目编号，获取全路径信息；
	 * @param itemId
	 * @param rootId
	 * @return
	 */
	public String getOtherCostFullPath(String itemId, String rootId);
	
	/**
	 * 根据父节点，获得此节点下新增的项目的编码信息
	 * 
	 * @param parentId
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-1-12
	 */
	public String getCodeForNewItem(String parentId);
	
	//****************************************************** Excel 数据导出   ***************************************
	/**
	 * 根据业务类型，获取最新的数据导出Excel报表模板信息；
	 * @param businessType
	 * @return
	 * @author: Ivy
	 * @createDate: 2010-12-28
	 */
	public InputStream getExcelTemplate(String businessType);
	
	/**
	 * 根据流程编号获取FlowMaster
	 * @param flowbh 流程中业务编号
	 * @return
	 * @author: hanhl
	 * @createDate: 2010-12-24
	 */
	public PlanMaster findPlanMasterByFlowbh(String flowbh);
}
