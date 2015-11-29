package com.sgepit.pmis.finalAccounts.financialAudit.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.pmis.finalAccounts.financialAudit.hbm.FAAssetsSort;
import com.sgepit.pmis.finalAccounts.financialAudit.hbm.FaAuditMaster;


public interface FinancialAuditService {

	/**
	 * 新增稽核
	 * @param auditMaster
	 * @param mergeFlag
	 * 			N：表示单独稽核；（mainAuditId为null；mainObjectID为null）
	 *			M：表示合并稽核；（mainAuditId为null，系统自动生成，mainObjectID必须有值，为主设备或主建筑物编号）
	 *			MT：表示合并到稽核（mainAuditId不为null，为稽核到的主设备的稽核系统编号；mainObjectID为null）
	 * @param mainAuditId	当mergeFlag==MT,此字段标识合并到稽核的已稽核的主设备的稽核系统编号；
	 * @param mainObjectID	当mergeFlag==M，此字段标识合并稽核时主设备或主建筑物的编号； 
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-9
	 */
	public String auditAdd(FaAuditMaster auditMaster, String mergeFlag, String mainAuditId, String mainObjectID);
	
	/**
	 * 撤销设备稽核
	 * @param delAuditIds
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-14
	 */
	public String delAuditByIds(String delAuditIds); 
	
	/**
	 * 设置或取消稽核的资产分类设置
	 * @param pid	项目编号
	 * @param ids	需要设置的ids；如果是批量设置，用`分隔
	 * @param ids	设置资产分类的对象编号：物资编号、设备编号、房屋建筑物的概算编号；
	 * @param businessType	MAT 物资、 EQU 设备、BUILDING 房屋建筑物
	 * @param assetsNo	选中的资产编号，如果此值为空，表示取消固定资产设置；
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-10
	 */
	public String setAssetsNo(String pid, String ids, String objectIds, String businessType, String assetsNo);
	
	
	
	/**
	 * @param sourceNo
	 * @param objectId
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-10
	 */
	public FaAuditMaster getAuditMasterBySource(String sourceNo, String objectId);
	
	//-------------------------------------------------------------------------------begin【物资部分】
	/**
	 * 获取物资出库单信息
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param param
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-20
	 */
	public List getMatStockOut(String orderBy, Integer start, Integer limit, HashMap<String, String> param);
	
	/**
	 * 根据物资出库单的主键，获取出库单出库物资明细信息；
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param param
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-20
	 */
	public List getMatStockOutDetail(String orderBy, Integer start, Integer limit, HashMap<String, String> param);
	
	
	//-------------------------------------------------------------------------------end【物资部分】
	
	/**
	 * 根据设备合同信息，获取该合同对应设备的出库单出库设备的信息；
	 * @param orderby	排序信息
	 * @param start	分页信息
	 * @param limit	分页信息
	 * @param param	查询的条件信息
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-10
	 */
	public List getEquStockOutDetail(String orderBy, Integer start, Integer limit, HashMap<String, String> param);
	
	/**
	 * 根据设备或物资的出库单号及物资设备编码，获取此物资有效的稽核信息
	 * @param businessType
	 * @param outno
	 * @param objectno
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-12
	 */
	public FaAuditMaster getAuditInfoByOutno(String businessType, String outno, String objectno);
	
	/**
	 * 获取稽核信息；
	 * @param businessType
	 * @param whereStr
	 * @param orderByStr
	 * @param start
	 * @param limit
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-3-14
	 */
	public List getAuditReportInfo(String orderByStr, Integer start, Integer limit, HashMap<String, String> param);
	
	public List<ColumnTreeNode> buildColumnNodeTree(String treeName, String parentId, Map params) throws BusinessException;
	
	/**
	 * 获得需要稽核的房屋建筑物的概算树
	 * @param parentId
	 * @param pid
	 * @return
	 * @throws BusinessException
	 * @author: Ivy
	 * @createDate: 2011-3-15
	 */
	public List<ColumnTreeNode> getBuildingTree(String parentId, String pid) throws BusinessException;
	
	/** 初始化竣建04表的数据
	 * @return
	 * @author: Ivy
	 * @createDate: 2011-4-6
	 */
	public String initAssetsReportData(String pid);
	
	public List<FAAssetsSort> getFAAssetsSortTree(String pid);
	
	/**
	 * 计算Fa_assets_report 表中 父节点的数据的合计；
	 * @return
	 * @author: Liuay
	 * @createDate: Jul 15, 2011
	 */
	public String updateAssetsReportData(String pid);
}
