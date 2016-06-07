package com.sgepit.pcmis.bid.service;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.fileupload.FileItem;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.datastructure.ColumnTreeNode;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.pcmis.bid.hbm.PcBidIssueWinDoc;
import com.sgepit.pcmis.bid.hbm.PcBidOpenBidding;
import com.sgepit.pcmis.bid.hbm.PcBidProgress;
import com.sgepit.pcmis.bid.hbm.PcBidSupervisereportD;
import com.sgepit.pcmis.bid.hbm.PcBidTbUnitInfo;
import com.sgepit.pcmis.bid.hbm.VPcJiaJieReportIndex;

public interface PCBidService {

	List getZtbStatisticsByWhereOrderBy(String orderBy, Integer start, Integer limit, HashMap<String, String> params);
	boolean deleteZbApplyById(String zbApplyId);
	boolean deleteZbContentById(String zbContentId);
	boolean deleteZbAttachment(String[] businessTypes, String id);
	void exchangeDeletedZbData(String beanType, String[] ids, boolean immediate);
	void exchangeSavedZbData(String beanType, String[] ids, boolean immediate);
	PcBidProgress getCurrentPhaseProgress(String contentUids, String progressType);
	
	/**
	 *说明: 在保存招标过程信息对象之前, 判断该招标过程信息对象是否要写入动态数据表(新增的,或者进度字段修改了的招标过程信息要写入动态数据表)
	 * @param progress 招标过程对象
	 * @throws BusinessException
	 */
	void saveBidProgress(PcBidProgress progress) throws BusinessException;
	boolean clearZbDetailAttachment(String[] uidArr);
	boolean clearZbApplyAttachment(String[] uidArr);
	String misToLev2OfSuperviseReport(String uids ,String fromUnit,String toUnit,String reportMan, String dataExchangeFlag);
	List<ColumnTreeNode> buildColumnNodeTree(String treeName,String parentId, Map params);
	String sendBackSuperviseReport(String uids, String reason,String backUser, String fromUnit,String unitname);
	/**
	 * 配置每个月的中标信息
	 * @param zbNrIds
	 * @param pid
	 * @param sjType
	 * @return
	 */
	public abstract boolean addZbNr2Report(String[] zbNrIds, String pid, String sjType);
	String updateState(String uids,String backUser,String unitname,String reason,String fromUnit,String state);
	/**
	 * 配置每个月的中标信息,未上报不重新选择时更新报表信息
	 * @param pid
	 * @param sjType
	 * @return
	 */	
	boolean updateZbNr2Report(String pid, String sjType);
	
	/**
	 * 发放中标通知书自定义保存方法
	 * @param records  修改的记录集合
	 * @param currentPid 数据交换发送单位
	 * @param defaultOrgRootID  数据交换接收单位
	 * @return
	 */
	boolean saveWindocs(List<PcBidIssueWinDoc> records, String currentPid, String defaultOrgRootID);
	/**
	 * 根据业务类型，获取最新的数据导出Excel报表模板信息；
	 * @param businessType
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-4
	 */
	public InputStream getExcelTemplate(String businessType);	
	/**
	 * 获取三级企业部门信息；
	 * @param businessType
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-4
	 */	
	public abstract String syncBuilding3GroupUnitTree(Map paramsmap);
	/**
	 * 获取三级企业部门所有员工；
	 * @param deptId
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-4
	 */		
	public List<RockUser> getUserInDept(String deptId);	
	/**
	 * 判断投标单位预审信息是否能被删除
	 * @param bidContentId
	 * @param uids
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-5
	 */		
	public String checkIfApplicantDelete(String bidContentId,String uids);	
	/**
	 * 【发售招标文件】、【接收投标文件及投标保证金】、【开标】、【评标及评标结果公示】、【发放中标通知书】
	 * 选择预审结果里面的单位
	 * @param tbUnitType
	 * @param bidContentId
	 * @param orderby
	 * @param start
	 * @param limit
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-5
	 */
	public List<PcBidTbUnitInfo> getUnselectTbUnit( String tbUnitType,String bidContentId,String orderby, Integer start,
			Integer limit);
	
	/**
	 * 保存发售招标文件选择的单位
	 * @param currentPid
	 * @param bidContentId
	 * @param rateStatus
	 * @param tbUidsArray
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-6
	 */		
	public String[] savePcBidSendZbdocByTbUnits(String currentPid,String bidContentId,Double rateStatus,String tbUidsArray[]);	
	/**
	 * 保存接收投标文件及投标保证金选择的单位
	 * @param currentPid
	 * @param bidContentId
	 * @param rateStatus
	 * @param isPayBond
	 * @param tbUidsArray
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-6
	 */		
	public String[] savePcBidAcceptTbdocAndBondByTbUnits(String currentPid,String bidContentId,Double rateStatus,String isPayBond,String tbUidsArray[]);	
	/**
	 * 开标选择的单位
	 * @param currentPid
	 * @param bidContentId
	 * @param rateStatus
	 * @param offer
	 * @param tbUidsArray
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-6
	 */		
	public String[] savePcBidOpenBiddingByTbUnits(String currentPid,String bidContentId,Double rateStatus,Double offer,String tbUidsArray[]);	
	/**
	 * 评标及评标结果公示选择的单位
	 * @param currentPid
	 * @param bidContentId
	 * @param tbUidsArray
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-6
	 */		
	public String[] savePcBidJudgeBiddingByTbUnits(String currentPid,String bidContentId,String tbUidsArray[]);	
	/**
	 * 发放中标通知书选择的单位
	 * @param currentPid
	 * @param bidContentId
	 * @param rateStatus
	 * @param USERDEPTID
	 * @param USERID
	 * @param tbUidsArray
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-6
	 */		
	public String[] savePcBidIssueWinDocByTbUnits(String currentPid,String bidContentId,Double rateStatus,String USERDEPTID,String USERID,String tbUidsArray[]);
	
	/**
	 * 保存光伏项目的报表明细数据到数据库中
	 * @param bidSupervisereportD
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-6-12
	 */
	public String insertZbNr2Report(PcBidSupervisereportD bidSupervisereportD);


	/**
	 * 删除招投标报表的一条记录【光伏】
	 * @param sjType	时间
	 * @param pid		项目单位ID
	 * @param zbSeqno	指标ID
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-6-13
	 */
	public String deleteZbNr2Report(String sjType, String pid, String zbSeqno);
	
	/**
	 * 获取招投标报表的一条记录【光伏】
	 * @param sjType	时间
	 * @param pid		项目单位ID
	 * @param zbSeqno	指标ID
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-6-13
	 */
	public PcBidSupervisereportD getZbNr2Report(String sjType, String pid,	String zbSeqno);	
	/**
	 * 嘉节首页查询七大报表【嘉节】
	 * @param pid		项目单位ID
	 * @return list
	 * @author: shangtw
	 * @createDate: 2012-7-10
	 */
	public List<VPcJiaJieReportIndex>getJiaJieReportIndex(String pid);
	/**
	 * 根据招标公告选择招标内容进行保存
	 * @param pid		项目单位ID
	 * @param noticeUids	公告主键
	 * @param contentUidsArray	招标内容数组
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-13
	 */	
	public String[] saveContentByNotice(String currentPid,String noticeUids,String contentUidsArray[]);	
	/**
	 * 根据招标内容得到开标信息
	 * @param pid		项目单位ID
	 * @param bidContentId	招标内容
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-9-6
	 */	
	public List<PcBidOpenBidding> getVeryfiedUnits(String bidContentId,String pid);
	/**
	 * 根据招标类型得到所有招标内容
	 * @param pid		项目单位ID
	 * @author: shangtw
	 * @createDate: 2012-9-19
	 */	
	public int  getContentBidCountByType(String pid,String zbType,String isBid,String bidcontent,String bidstarttime,String tbunit,String bidway);
	/**
	 * 根据招标类型得到所有招标合同价格 
	 * @param pid		项目单位ID
	 * @author: shangtw
	 * @createDate: 2012-9-19
	 */	
	public Double  getContentConMoneyByType(String pid,String zbType,String isBid,String bidcontent,String bidstarttime,String tbunit,String bidway);	
	/**
	 * 根据招标类型得到所有中标价格 
	 * @param pid		项目单位ID
	 * @author: shuz
	 * @createDate: 2012-9-19
	 */	
	public Double  getContentBidPriceByType(String pid,String zbType,String isBid,String bidcontent,String bidstarttime,String tbunit,String bidway);
	/**
	 * 根据招标类型得到所有概算金额 
	 * @param pid		项目单位ID
	 * @author: shuz
	 * @createDate: 2014-7-15
	 */	
	public Double getContentBdgMoneyByType(String pid,String zbType,String isBid,String bidcontent,String bidstarttime,String tbunit,String bidway);
	/**
	 * 获取招投标模块文件移交资料室的grid 的数据
	 * @param type
	 * @param fileId
	 * @param fileTypes
	 * @param yjrId
	 * @return
	 */
	public String getJsonStrForTransToZLSByType(String type,String fileId, String fileTypes,
			String yjrId);	
	/**
	 * 招投标模块文件移交资料室
	 * @param pid	
	 * @param userdeptid
	 * @param username
	 * @param type			招标文件类型
	 * @param fileLshs		移交的文件流水号
	 * @param fileNames		移交的文件名称
	 * @param fileIds		移交业务主记录ID
	 * @param zlSortId		移交分类
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-10-16
	 */
	public boolean transToZLSByType(String pid, String userdeptid, String username, String type, String fileLshs, 
			String fileNames, String fileIds, String zlSortId);
	
	/**
	 * 撤销资料移交
	 * @param fileLsh
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-10-17
	 */
	public boolean cancelTrans(String fileLsh);
	
	/**
	 * 投标单位预审信息数据导入
	* @Title: importData
	* @Description: 
	* @param map
	* @param fileItem
	* @return   
	* @return String    
	* @throws
	* @author qiupy 2014-7-3
	 */
	public String importData(Map<String,String> map,
			FileItem fileItem);

	/**
	 * 招标项目及内容信息树
	 * @param orderBy
	 * @param start
	 * @param limit
	 * @param map
	 * @return
	 */
	public List<ColumnTreeNode> getPcBidZbApplyTree(String orderBy,
			Integer start, Integer limit, HashMap map);

}