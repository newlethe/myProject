package com.sgepit.pcmis.bid.control;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.sgepit.frame.base.BusinessException;
import com.sgepit.frame.base.Constant;
import com.sgepit.frame.sysman.hbm.RockUser;
import com.sgepit.frame.util.JdbcUtil;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.pcmis.bid.hbm.PcBidIssueWinDoc;
import com.sgepit.pcmis.bid.hbm.PcBidOpenBidding;
import com.sgepit.pcmis.bid.hbm.PcBidProgress;
import com.sgepit.pcmis.bid.hbm.PcBidSupervisereportD;
import com.sgepit.pcmis.bid.hbm.PcBidTbUnitInfo;
import com.sgepit.pcmis.bid.hbm.PcBidZbAgency;
import com.sgepit.pcmis.bid.hbm.PcBidZbApply;
import com.sgepit.pcmis.bid.hbm.PcBidZbContent;
import com.sgepit.pcmis.bid.service.PCBidApplyService;
import com.sgepit.pcmis.bid.service.PCBidExDataService;
import com.sgepit.pcmis.bid.service.PCBidService;
import com.sgepit.pcmis.bid.service.PCBidTbUnitService;
import com.sgepit.pcmis.common.util.MultistageReportUtil;

/**
 * 将招投标各Service方法统一提供前台的DWR代理
 * 
 * @author Administrator
 * 
 */
public class PCBidDWR {

	private PCBidService pcBidService;
	private PCBidApplyService pcBidApplyService;
	private PCBidTbUnitService pcBidTbUnitService;
	private PCBidExDataService pcBidExDataService;

	public PCBidExDataService getPcBidExDataService() {
		return pcBidExDataService;
	}

	public void setPcBidExDataService(PCBidExDataService pcBidExDataService) {
		this.pcBidExDataService = pcBidExDataService;
	}

	public PCBidTbUnitService getPcBidTbUnitService() {
		return pcBidTbUnitService;
	}

	public void setPcBidTbUnitService(PCBidTbUnitService pcBidTbUnitService) {
		this.pcBidTbUnitService = pcBidTbUnitService;
	}

	public PCBidService getPcBidService() {
		return pcBidService;
	}

	public void setPcBidService(PCBidService pcBidService) {
		this.pcBidService = pcBidService;
	}

	public PCBidApplyService getPcBidApplyService() {
		return pcBidApplyService;
	}

	public void setPcBidApplyService(PCBidApplyService pcBidApplyService) {
		this.pcBidApplyService = pcBidApplyService;
	}

	public PCBidDWR() {
		pcBidService = (PCBidService) Constant.wact.getBean("pcBidService");
		pcBidApplyService = (PCBidApplyService) Constant.wact.getBean("pcBidApplyService");
		pcBidTbUnitService = (PCBidTbUnitService) Constant.wact.getBean("pcBidTbUnitService");
		pcBidExDataService = (PCBidExDataService) Constant.wact.getBean("pcBidExDataService");
	}

	public List<PcBidTbUnitInfo> getVeryfiedUnits(String bidContentId) {
		return pcBidTbUnitService.getVeryfiedUnits(bidContentId);
	}

	public boolean deleteZbAttachment(String[] businessTypes, String id) {
		return pcBidService.deleteZbAttachment(businessTypes, id);
	}

	public boolean exchangeDeletedZbData(String beanType, String[] ids,
			boolean immediate) {
		try {
			pcBidService.exchangeDeletedZbData(beanType, ids, immediate);
		} catch (Exception e) {

			e.printStackTrace();
			return false;
		}
		return true;
	}

	public boolean exchangeSavedZbData(String beanType, String[] ids,
			boolean immediate) {
		try {
			pcBidService.exchangeSavedZbData(beanType, ids, immediate);
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}

	public PcBidProgress getCurrentPhaseProgress(String contentUids,
			String progressType) {
		return pcBidService.getCurrentPhaseProgress(contentUids, progressType);
	}

	/**
	 * 找出当前项目所有招标项目
	 * 
	 * @param pid
	 * @return
	 */
	public List<PcBidZbApply> getBidApplyForCurrentPrj(String[] outFilter,String pid) {
		return pcBidApplyService.getBidApplyForCurrentPrj(outFilter,pid);
	}

	public List<PcBidZbContent> getContentForCurrentApply(String[] outFilter,String zbUids) {
		return pcBidApplyService.getContentForCurrentApply(outFilter,zbUids);
	}

	public Boolean saveBidProgress(PcBidProgress progress)
			 {
		boolean isInsert = false;
		try {
			if ( progress.getUids() != null && progress.getUids().equals("") ){
				progress.setUids(null);
				isInsert = true;
			} 
			
			pcBidService.saveBidProgress(progress);
			//需要进行数据交互
			String[] updateIds = new String[1];
			String[] insertIds = new String[1];
			if ( isInsert ){
				insertIds[0] = progress.getUids();
				updateIds = null;
			}
			else{
				updateIds[0] = progress.getUids();
				insertIds = null;
			}
			if(progress.getUids()!=null&&!(progress.getUids().equals(""))){
				pcBidExDataService.excDataZbForSave(PcBidProgress.class.getName(),updateIds,insertIds, false, progress.getPid(), Constant.DefaultOrgRootID);
			}
			return true;
		} catch (BusinessException e) {
			return false;
		}
	}
	
	public boolean clearZbDetailAttachment(String[] uidArr) {
		return pcBidService.clearZbDetailAttachment(uidArr);
	}

	public boolean clearZbApplyAttachment(String[] uidArr) {
		return pcBidService.clearZbApplyAttachment(uidArr);
	}
	/**
	 * 删除招标申请时数据交互（需要同时删除对应的招标内容及招标内容下的详细过程信息和附件）
	 * @param ids 招标申请主键Id
	 * @param immediate 是否立即发送，如果不是立即发送则加入待发送队列
	 * @param sendUnit 发送单位
	 * @param toUnit 接收单位
	 * @return
	 */
	public String excDataZbApplyForDel(String[] ids, boolean immediate, String sendUnit, String toUnit){
		return pcBidExDataService.excDataZbApplyForDel(ids, immediate, sendUnit, toUnit);
	}
	/**
	 * 删除招标内容时数据交互
	 * @param ids 招标内容主键Id
	 * @param immediate 是否立即发送，如果不是立即发送则加入待发送队列
	 * @param sendUnit 发送单位
	 * @param toUnit   接收单位
	 * @return
	 */
	public String excDataZbContentForDel(String[] ids, boolean immediate, String sendUnit, String toUnit){
		return pcBidExDataService.excDataZbContentForDel(ids, immediate, sendUnit, toUnit);
	}
	/**
	 * 各招标详细过程信息的删除
	 * @param beanType
	 * @param ids
	 * @param immediate
	 * @param sendUnit
	 * @param toUnit
	 * @return
	 */
	public String excDataZbProcessForDel(String beanType, String[] ids, boolean immediate, String sendUnit, String toUnit){
		return pcBidExDataService.excDataZbProcessForDel(beanType, ids, immediate, sendUnit, toUnit);
	}
	/**
	 * 招投标管理附件的数据交互
	 * @param beanName 业务bean名称
	 * @param id 业务主键
	 * @param fileLshArr 附件流水号号
	 * @param sendUnit 发送单位
	 * @param toUnit 接收单位
	 * @param bizInfo 交互说明
	 * @param immediate 是否立即发送
	 * @return
	 */
	public String excDataAttachments(String beanName, String id, String[] fileLshArr,String sendUnit, String toUnit,String bizInfo,boolean immediate){
		return pcBidExDataService.excDataAttachments(beanName, id, fileLshArr, sendUnit, toUnit, bizInfo, immediate);
	}
	/**
	 * 招投标管理数据新增或修改数据交互
	 * @param beanType
	 * @param ids
	 * @param immediate
	 * @param sendUnit
	 * @param toUnit
	 * @return
	 */
	public String excDataZbForSave(String beanType, String[] updateIds,String[] insertIds,boolean immediate, String sendUnit, String toUnit) {
		return pcBidExDataService.excDataZbForSave(beanType,updateIds ,insertIds,immediate, sendUnit, toUnit);
	}
	/**
	 * 项目单位向二级单位上报 招标（合同）月报。如果不存在二级单位则直接报到集团
	 * @param uids
	 * @param fromUnit
	 * @param toUnit
	 * @param dataExchangeFlag : 是否需要进行数据交换（光伏项目无需数据交换）
	 * @return
	 */
	public String misToLev2OfSuperviseReport(String uids ,String fromUnit,String toUnit,String reportMan, String dataExchangeFlag){
		return pcBidService.misToLev2OfSuperviseReport(uids, fromUnit, toUnit, reportMan, dataExchangeFlag);
	}
	/**
	 * 招标（合同）月报的回退方法
	 * @param uids
	 * @param reason
	 * @param backUser
	 * @param fromUnit
	 * @return
	 */
	public String sendBackSuperviseReport(String uids, String reason,String backUser, String fromUnit,String unitname){
		return pcBidService.sendBackSuperviseReport(uids, reason, backUser, fromUnit,unitname);
	} 
	/**
	 * 配置每个月的中标信息
	 * @param zbNrIds
	 * @param pid
	 * @param sjType
	 * @return
	 */
	public boolean addZbNr2Report(String[] zbNrIds, String pid, String sjType){
		return pcBidService.addZbNr2Report(zbNrIds, pid, sjType);
	}
	public String updateState(String uids,String backUser,String unitname,String reason,String fromUnit,String state){
		return pcBidService.updateState(uids, backUser, unitname, reason, fromUnit, state);
	}
	public String secondReport(String bizSql,String bussbackSql){
		return MultistageReportUtil.secondReport(bizSql, bussbackSql);
	}
	public String [] filterBidDetailTreeNode(String[] outFilter){
		return pcBidApplyService.filterBidDetailTreeNode(outFilter);
	}
	/**
	 * 找出当前项目所有招标代理机构名称
	 * 
	 * @param pid
	 * @return
	 */
	public List<PcBidZbAgency> getBidPcBidZbAgencyForCurrentPrj(String pid) {
		return pcBidApplyService.getBidPcBidZbAgencyForCurrentPrj(pid);
	}	
	/**
	 * 配置每个月的中标信息,未上报不重新选择时更新报表信息
	 * @param pid
	 * @param sjType
	 * @return
	 */
	public boolean updateZbNr2Report(String pid, String sjType){
		return pcBidService.updateZbNr2Report(pid, sjType);
	}
	/**
	 * 获取三级企业部门所有员工；
	 * @param deptId
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-4
	 */		
	public List<RockUser> getUserInDept(String deptId){
		return pcBidService.getUserInDept(deptId);
	}
	/**
	 * 判断投标单位预审信息是否能被删除
	 * @param bidContentId
	 * @param uids
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-5
	 */		
	public String checkIfApplicantDelete(String bidContentId,String uids){
		return pcBidService.checkIfApplicantDelete(bidContentId,uids);	
	}	

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
	public String[] savePcBidSendZbdocByTbUnits(String currentPid,String bidContentId,Double rateStatus,String tbUidsArray[]){
		return pcBidService.savePcBidSendZbdocByTbUnits(currentPid,bidContentId,rateStatus,tbUidsArray);
	}
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
	public String[] savePcBidAcceptTbdocAndBondByTbUnits(String currentPid,String bidContentId,Double rateStatus,String isPayBond,String tbUidsArray[]){
		return pcBidService.savePcBidAcceptTbdocAndBondByTbUnits(currentPid,bidContentId,rateStatus,isPayBond,tbUidsArray);
	}
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
	public String[] savePcBidOpenBiddingByTbUnits(String currentPid,String bidContentId,Double rateStatus,Double offer,String tbUidsArray[]){
		return pcBidService.savePcBidOpenBiddingByTbUnits(currentPid,bidContentId,rateStatus,offer,tbUidsArray);
	}
	/**
	 * 评标及评标结果公示选择的单位
	 * @param currentPid
	 * @param bidContentId
	 * @param tbUidsArray
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-6
	 */		
	public String[] savePcBidJudgeBiddingByTbUnits(String currentPid,String bidContentId,String tbUidsArray[]){
		return pcBidService.savePcBidJudgeBiddingByTbUnits(currentPid,bidContentId,tbUidsArray);
	}	
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
	public String[] savePcBidIssueWinDocByTbUnits(String currentPid,String bidContentId,Double rateStatus,String USERDEPTID,String USERID,String tbUidsArray[]){
		return pcBidService.savePcBidIssueWinDocByTbUnits(currentPid,bidContentId,rateStatus,USERDEPTID,USERID,tbUidsArray);
	}	
	
	
	/**
	 * 发放中标通知书自定义保存方法
	 * @param records  修改的记录集合
	 * @param currentPid 数据交换发送单位
	 * @param defaultOrgRootID  数据交换接收单位
	 * @return
	 */
	public boolean saveWindocs(List<PcBidIssueWinDoc> records, String currentPid, String defaultOrgRootID)
	{
		return pcBidService.saveWindocs(records, currentPid, defaultOrgRootID);	
	}
	
	
	/**
	 * 保存光伏项目的报表明细数据到数据库中
	 * @param bidSupervisereportD
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-6-12
	 */
	public String insertZbNr2Report(PcBidSupervisereportD bidSupervisereportD) {
		if(bidSupervisereportD.getUids()==null || bidSupervisereportD.getUids().length()==0) {
			bidSupervisereportD.setZbSeqno(SnUtil.getNewID());
		}
		return pcBidService.insertZbNr2Report(bidSupervisereportD);
	}
	
	/**
	 * 删除招投标报表的一条记录【光伏】
	 * @param sjType	时间
	 * @param pid		项目单位ID
	 * @param zbSeqno	指标ID
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-6-13
	 */
	public String deleteZbNr2Report(String sjType , String pid, String zbSeqno) {
		return pcBidService.deleteZbNr2Report(sjType, pid, zbSeqno);
	}
	
	/**
	 * 获取招投标报表的一条记录【光伏】
	 * @param sjType	时间
	 * @param pid		项目单位ID
	 * @param zbSeqno	指标ID
	 * @return
	 * @author: Liuay
	 * @createDate: 2012-6-13
	 */
	public PcBidSupervisereportD getZbNr2Report(String sjType , String pid, String zbSeqno) {
		return pcBidService.getZbNr2Report(sjType, pid, zbSeqno);
	}
	/**
	 * 根据招标公告选择招标内容进行保存
	 * @param pid		项目单位ID
	 * @param noticeUids	公告主键
	 * @param contentUidsArray	招标内容数组
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-6-13
	 */	
	public String[] saveContentByNotice(String currentPid,String noticeUids,String contentUidsArray[]){
		return pcBidService.saveContentByNotice(currentPid,noticeUids,contentUidsArray);
	}
	/**
	 * 根据招标项目等条件找出符合条件的招标内容
	 * @param outFilter		外部动态参数
	 * @param whereStr		其他条件
	 * @param bean存在发放中标通知书并且中标通知书工作进度为100%的招标内容或选了招标内容的合同
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-7-30
	 */		
	public List<PcBidZbContent> getContentForCurrentApplyByWhere(String bean,String[] outFilter,String whereStr) {
		return pcBidApplyService.getContentForCurrentApplyByWhere(bean,outFilter, whereStr);
	}
	/**
	 找出存在发放中标通知书或合同下的招标项目下的招标内容存在的记录的招标项目
	 *@param outFilter
	 * @param bean
	 * @param pid
	 * @return
	 */
	public List<PcBidZbApply> getBidApplyForCurrentPrjByBean(String bean,String[] outFilter,String pid) {
		return pcBidApplyService.getBidApplyForCurrentPrjByBean(bean,outFilter,pid);
	}
	/**
	 * 根据招标内容得到开标信息
	 * DWR调用中重载的方法有冲突，此方法屏蔽处理 zhangh 2013-04-11
	 * @param pid		项目单位ID
	 * @param bidContentId	招标内容
	 * @return
	 * @author: shangtw
	 * @createDate: 2012-9-6
	 */	
//	public List<PcBidOpenBidding> getVeryfiedUnits(String bidContentId,String pid) {
//		return pcBidService.getVeryfiedUnits(bidContentId, pid);
//	}
	/**
	 * 根据招标类型得到所有招标内容
	 * @param pid		项目单位ID
	 * @author: shangtw
	 * @createDate: 2012-9-19
	 */	
	public int  getContentBidCountByType(String pid,String zbType,String isBid,String bidcontent,String bidstarttime,String tbunit,String bidway) {
		return pcBidService.getContentBidCountByType(pid,zbType,isBid,bidcontent,bidstarttime,tbunit,bidway);
	}	
	/**
	 * 根据招标类型得到所有招标合同价格 
	 * @param pid		项目单位ID
	 * @author: shangtw
	 * @createDate: 2012-9-19
	 */	
	public Double  getContentConMoneyByType(String pid,String zbType,String isBid,String bidcontent,String bidstarttime,String tbunit,String bidway) {
		return pcBidService.getContentConMoneyByType(pid,zbType,isBid,bidcontent,bidstarttime,tbunit,bidway);
	}
	/**
	 * 根据招标类型得到所有概算金额 
	 * @param pid		项目单位ID
	 * @author: shuz
	 * @createDate: 2014-7-15
	 */	
	public Double getContentBdgMoneyByType(String pid,String zbType,String isBid,String bidcontent,String bidstarttime,String tbunit,String bidway) {
		return pcBidService.getContentBdgMoneyByType(pid,zbType,isBid,bidcontent,bidstarttime,tbunit,bidway);
	}
	/**
	 * 根据招标类型得到中标价格 
	 * @param pid		项目单位ID
	 * @author: shuz
	 * @createDate: 2012-9-19
	 */	
	public Double  getContentBidPriceByType(String pid,String zbType,String isBid,String bidcontent,String bidstarttime,String tbunit,String bidway) {
		return pcBidService.getContentBidPriceByType(pid,zbType,isBid,bidcontent,bidstarttime,tbunit,bidway);
	}	
}

