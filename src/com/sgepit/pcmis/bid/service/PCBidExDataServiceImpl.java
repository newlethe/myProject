package com.sgepit.pcmis.bid.service;
/**
 * 招标管理数据交互实现类
 * @author liangwj
 * @since 2011-10-12
 */

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.hibernate.Session;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.sgepit.frame.base.Constant;
import com.sgepit.pcmis.bid.dao.PCBidDAO;
import com.sgepit.frame.dataexchange.PCDataExchangeException;
import com.sgepit.frame.dataexchange.hbm.PcDataExchange;
import com.sgepit.frame.dataexchange.service.PCDataExchangeService;
import com.sgepit.frame.sysman.hbm.SgccAttachList;
import com.sgepit.frame.util.db.SnUtil;
import com.sgepit.pcmis.bid.hbm.PcBidAcceptTbdocAndBond;
import com.sgepit.pcmis.bid.hbm.PcBidAssessCouncil;
import com.sgepit.pcmis.bid.hbm.PcBidClarificateZbdoc;
import com.sgepit.pcmis.bid.hbm.PcBidIssueWinDoc;
import com.sgepit.pcmis.bid.hbm.PcBidAssessPublish;
import com.sgepit.pcmis.bid.hbm.PcBidJudgeBidding;
import com.sgepit.pcmis.bid.hbm.PcBidNoticeContent;
import com.sgepit.pcmis.bid.hbm.PcBidOpenBidding;
import com.sgepit.pcmis.bid.hbm.PcBidProgress;
import com.sgepit.pcmis.bid.hbm.PcBidPublishNotice;
import com.sgepit.pcmis.bid.hbm.PcBidSendZbdoc;
import com.sgepit.pcmis.bid.hbm.PcBidTbUnitInfo;
import com.sgepit.pcmis.bid.hbm.PcBidZbAgency;
import com.sgepit.pcmis.bid.hbm.PcBidZbApply;
import com.sgepit.pcmis.bid.hbm.PcBidZbContent;
import com.sgepit.pcmis.dynamicview.hbm.PcDynamicData;
import com.sgepit.pcmis.dynamicview.util.DynamicDataUtil;
import com.sgepit.pcmis.tzgl.hbm.PcTzglMonthCompM;

public class PCBidExDataServiceImpl implements PCBidExDataService {
	private boolean exchangeEnabled = false;
	private PCBidDAO pcBidDAO;
	public PCBidDAO getPcBidDAO() {
		return pcBidDAO;
	}
	public void setPcBidDAO(PCBidDAO pcBidDAO) {
		this.pcBidDAO = pcBidDAO;
	}
	public PCBidExDataServiceImpl(){
		Object o = Constant.propsMap.get("ENABLE_DATA_EXCHANGE");
		if(o!=null&&o.toString().equals("1")){
			exchangeEnabled = true;
		}
	}
	/**
	 * 用于删除招标申请记录的同时删除各详细过程信息，需要同时删除各详细过程信息对应的附件记录。
	 * @param zbApplyId 招标申请主键ID
	 * @param docType 附件类型
	 * @param tableName 详细阶段对应的表名
	 * @return PcDataExchange 待数据交互的记录
	 */
	public PcDataExchange getZbDetailExcDataForApplyDel(String zbApplyId, String[] docTypes, String tableName){
		String beforeSql = null;
		
		if(docTypes!=null&&docTypes.length>0){
			String docType = "(";
			for (int i = 0; i < docTypes.length; i++) {
				docType += "'" + docTypes[i] + "',";
			}
			docType = docType.substring(0, docType.length() - 1) + ")";
			//1.大对象记录删除sql
			String blobDelSql = "delete from sgcc_attach_blob where file_lsh in " +
					"(select file_lsh from sgcc_attach_list where transaction_type in " + docType +
					" and transaction_id in (select uids from "+tableName+" where content_uids in " +
					"(select uids from pc_bid_zb_content where zb_uids = '"+zbApplyId+"')))";
			//2.附件关联记录删除sql
			String attachDelSql = "delete from sgcc_attach_list where transaction_type in "+docType+
					" and transaction_id in (select uids from "+tableName+" where content_uids in " +
					"(select uids from pc_bid_zb_content where zb_uids = '"+zbApplyId+"'))";
			beforeSql = attachDelSql.concat(";").concat(blobDelSql);
		}
		//3.详细过程记录删除sql
		String detailDelSql ="delete from "+tableName+" where content_uids in " +
				"(select uids from pc_bid_zb_content where zb_uids  = '"+zbApplyId+"')";
		
		PcDataExchange excHbm = new PcDataExchange();
		excHbm.setSqlData(detailDelSql);
		excHbm.setSpareC1(beforeSql);
		
		return excHbm;
	};
	/**
	 * 用于删除招标内容记录的同时删除各详细过程信息，需要同时删除各详细过程信息对应的附件记录。
	 * @param zbApplyId 招标内容主键ID
	 * @param docType 附件类型
	 * @param tableName 详细阶段对应的表名
	 * @return PcDataExchange 待数据交互的记录
	 */
	public PcDataExchange getZbDetailExcDataForContentDel(String contentId, String[] docTypes, String tableName){
		String beforeSql = null;
		
		if(docTypes!=null&&docTypes.length>0){
			String docType = "(";
			for (int i = 0; i < docTypes.length; i++) {
				docType += "'" + docTypes[i] + "',";
			}
			docType = docType.substring(0, docType.length() - 1) + ")";
			//1.大对象记录删除sql
			String blobDelSql = "delete from sgcc_attach_blob where file_lsh in " +
					"(select file_lsh from sgcc_attach_list where transaction_type in " + docType +
					" and transaction_id in (select uids from "+tableName+" where content_uids ='"+contentId+"'))";
			//2.附件关联记录删除sql
			String attachDelSql = "delete from sgcc_attach_list where transaction_type in "+docType+
					" and transaction_id in (select uids from "+tableName+" where content_uids='"+contentId+"')";
			
			beforeSql = attachDelSql.concat(";").concat(blobDelSql);
		}
		
		//3.详细过程记录删除sql
		String detailDelSql ="delete from "+tableName+" where content_uids='"+contentId+"' ";
		
		PcDataExchange excHbm = new PcDataExchange();
		excHbm.setSqlData(detailDelSql);
		excHbm.setSpareC1(beforeSql);
		
		return excHbm;
	};
	/**
	 * 删除各详细过程信息，需要同时删除各详细过程信息对应的附件记录。
	 * @param zbApplyId 某详细过程主键ID
	 * @param docType 附件类型
	 * @param tableName 详细阶段对应的表名
	 * @return PcDataExchange 待数据交互的记录
	 */
	public PcDataExchange getZbDetailExcDataForDel(String uids, String[] docTypes, String tableName){
		String beforeSql = null;
		if(docTypes!=null&&docTypes.length>0){
			String docType = "(";
			for (int i = 0; i < docTypes.length; i++) {
				docType += "'" + docTypes[i] + "',";
			}
			docType = docType.substring(0, docType.length() - 1) + ")";
			//1.大对象记录删除sql
			String blobDelSql = "delete from sgcc_attach_blob where file_lsh in " +
					"(select file_lsh from sgcc_attach_list where transaction_type in "+docType+" " +
					"and transaction_id = '"+uids+"' )";
			//2.附件关联记录删除sql
			String attachDelSql = "delete from sgcc_attach_list where transaction_type in "+docType+
					" and transaction_id='"+uids+"'";
			
			beforeSql = attachDelSql.concat(";").concat(blobDelSql);
		}
		//3.详细过程记录删除sql
		String detailDelSql ="select uids from "+tableName+" where uids='"+uids+"' ";
		
		PcDataExchange excHbm = new PcDataExchange();
		excHbm.setSqlData(detailDelSql);
		excHbm.setSpareC1(beforeSql);
		return excHbm;
	}
	/**
	 * 删除招标申请时数据交互
	 * @param ids 招标申请主键Id串，使用逗号分隔
	 * @param immediate 是否立即发送，如果不是立即发送则加入待发送队列
	 * @param sendUnit 发送单位
	 * @param toUnit 接收单位
	 * @return
	 */
	public String excDataZbApplyForDel(String[] ids, boolean immediate,
			String sendUnit, String toUnit) {
		String flag = "1";
		try {
			PCDataExchangeService exService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			
			List<PcDataExchange> excList = new ArrayList<PcDataExchange>();
			String txGroup = SnUtil.getNewID("tx-"); //事务编号
			long xh = exService.getNewExchangeXh(toUnit);//排序号
			for(String appyId : ids){
				String bizInfo = "招标申请【"+sendUnit+"】删除";
				//1.发送中标通知书删除+对应的附件
				String[] docTypes1 = {"PCBidIssueWinNotice","PCBidIssueWinOther"};
				String tabName1 = "PC_BID_ISSUE_WIN_DOC";
				
				PcDataExchange excHbm1 =  this.getZbDetailExcDataForApplyDel(appyId, docTypes1, tabName1);
				excHbm1.setBizInfo(bizInfo);
				excHbm1.setPid(toUnit);//接收单位
				excHbm1.setSuccessFlag("0");
				excHbm1.setSpareC5(sendUnit);//发送单位
				excHbm1.setTableName(tabName1);
				excHbm1.setXh(xh++);
				excHbm1.setTxGroup(txGroup);

				excList.add(excHbm1);
				
				//2.评标结果公示删除+对应的附件，（含阶段信息）
				String[] docTypes2 = {"PCBidAssessPublishOther"};
				String tabName2 = "PC_BID_ASSESS_PUBLISH";
				
				PcDataExchange excHbm2 =  this.getZbDetailExcDataForApplyDel(appyId, docTypes2, tabName2);
				excHbm2.setBizInfo(bizInfo);
				excHbm2.setPid(toUnit);//接收单位
				excHbm2.setSuccessFlag("0");
				excHbm2.setSpareC5(sendUnit);//发送单位
				excHbm2.setTableName(tabName2);
				excHbm2.setXh(xh++);
				excHbm2.setTxGroup(txGroup);
				
				excList.add(excHbm2);
				
				//3.评标删除+对应的附件
				String[] docTypes3 = {"PCBidFile","PCBidClarifyContent","PCBidAssessReport","PCBidAssessOther"};
				String tabName3 = "PC_BID_JUDGE_BIDDING";
				
				PcDataExchange excHbm3 =  this.getZbDetailExcDataForApplyDel(appyId, docTypes3, tabName3);
				excHbm3.setBizInfo(bizInfo);
				excHbm3.setPid(toUnit);//接收单位
				excHbm3.setSuccessFlag("0");
				excHbm3.setSpareC5(sendUnit);//发送单位
				excHbm3.setTableName(tabName3);
				excHbm3.setXh(xh++);
				excHbm3.setTxGroup(txGroup);
				
				excList.add(excHbm3);
				
				//4.开标删除+对应的附件
				String[] docTypes4 = {"PCBidOpenBidOther","PCBidFile"};
				String tabName4 = "PC_BID_PC_OPEN_BIDDING";
				
				PcDataExchange excHbm4 =  this.getZbDetailExcDataForApplyDel(appyId, docTypes4, tabName4);
				excHbm4.setBizInfo(bizInfo);
				excHbm4.setPid(toUnit);//接收单位
				excHbm4.setSuccessFlag("0");
				excHbm4.setSpareC5(sendUnit);//发送单位
				excHbm4.setTableName(tabName4);
				excHbm4.setXh(xh++);
				excHbm4.setTxGroup(txGroup);
				
				excList.add(excHbm4);
				
				//5.接收招标文件及投标保证金  删除+对应的附件
				String[] docTypes5 = {"PCBidFile","PCBidAcceptTbdocOther"};
				String tabName5 = "PC_BID_ACCEPT_TB_DOC_AND_BOND";
				
				PcDataExchange excHbm5 =  this.getZbDetailExcDataForApplyDel(appyId, docTypes5, tabName5);
				excHbm5.setBizInfo(bizInfo);
				excHbm5.setPid(toUnit);//接收单位
				excHbm5.setSuccessFlag("0");
				excHbm5.setSpareC5(sendUnit);//发送单位
				excHbm5.setTableName(tabName5);
				excHbm5.setXh(xh++);
				excHbm5.setTxGroup(txGroup);
				
				excList.add(excHbm5);
				
				//6.组件评标委员会删除+对应的附件
				String[] docTypes6 = {"PCBidCouncilOther"};
				String tabName6 = "PC_BID_ASSESS_COUNCIL";
				
				PcDataExchange excHbm6 =  this.getZbDetailExcDataForApplyDel(appyId, docTypes6, tabName6);
				excHbm6.setBizInfo(bizInfo);
				excHbm6.setPid(toUnit);//接收单位
				excHbm6.setSuccessFlag("0");
				excHbm6.setSpareC5(sendUnit);//发送单位
				excHbm6.setTableName(tabName6);
				excHbm6.setXh(xh++);
				excHbm6.setTxGroup(txGroup);
				
				excList.add(excHbm6);
				
				//7.招标文件澄清删除+对应的附件
				String[] docTypes7 = {"PCBidZbCla","PCBidZbNeedCla","PCBidZbOther"};
				String tabName7 = "PC_BID_CLARIFICATE_ZBDOC";
				
				PcDataExchange excHbm7 =  this.getZbDetailExcDataForApplyDel(appyId, docTypes7, tabName7);
				excHbm7.setBizInfo(bizInfo);
				excHbm7.setPid(toUnit);//接收单位
				excHbm7.setSuccessFlag("0");
				excHbm7.setSpareC5(sendUnit);//发送单位
				excHbm7.setTableName(tabName7);
				excHbm7.setXh(xh++);
				excHbm7.setTxGroup(txGroup);
				
				excList.add(excHbm7);
				
				//8.发售招标文件删除+对应的附件
				String[] docTypes8 = null;
				String tabName8 = "PC_BID_SEND_ZBDOC";
				
				PcDataExchange excHbm8 =  this.getZbDetailExcDataForApplyDel(appyId, docTypes8, tabName8);
				excHbm8.setBizInfo(bizInfo);
				excHbm8.setPid(toUnit);//接收单位
				excHbm8.setSuccessFlag("0");
				excHbm8.setSpareC5(sendUnit);//发送单位
				excHbm8.setTableName(tabName8);
				excHbm8.setXh(xh++);
				excHbm8.setTxGroup(txGroup);
				
				excList.add(excHbm8);
				
				//9.投标人预审及预审结果删除+对应的附件
				String[] docTypes9 = {"PCBidApplicantOther"};
				String tabName9 = "PC_BID_TB_UNIT_INFO";
				
				PcDataExchange excHbm9 =  this.getZbDetailExcDataForApplyDel(appyId, docTypes9, tabName9);
				excHbm9.setBizInfo(bizInfo);
				excHbm9.setPid(toUnit);//接收单位
				excHbm9.setSuccessFlag("0");
				excHbm9.setSpareC5(sendUnit);//发送单位
				excHbm9.setTableName(tabName9);
				excHbm9.setXh(xh++);
				excHbm9.setTxGroup(txGroup);
				
				excList.add(excHbm9);
				
				//10.招标内容删除
				String tabName10 = "PC_BID_ZB_CONTENT";
				
				PcDataExchange excHbm10 =  new PcDataExchange();
				excHbm10.setPid(toUnit);//接收单位
				excHbm10.setTableName(tabName10);
				excHbm10.setTxGroup(txGroup);
				excHbm10.setXh(xh++);
				excHbm10.setSuccessFlag("0");
				excHbm10.setSpareC5(sendUnit);//发送单位
				excHbm10.setBizInfo(bizInfo);
				excHbm10.setSqlData("delete from PC_BID_ZB_CONTENT where ZB_UIDS in (select uids from PC_BID_ZB_APPLY where uids='"+appyId+"')");

				excList.add(excHbm10);
				
				//11.招标代理机构删除
				String tabName11 = "PC_BID_ZB_AGENCY";
				String docTypes11 = "'PCBidAgency', 'PCBidAgencyContract', 'PCBidAgencyOther'";
				//大对象记录删除sql
				String blobDelSql11 = "delete from sgcc_attach_blob where file_lsh in " +
						"(select file_lsh from sgcc_attach_list where transaction_type in ("+docTypes11+")" + 
						" and transaction_id in (select uids from "+tabName11+" where zb_uids in " +
						"(select uids from pc_bid_zb_content where zb_uids = '"+appyId+"')))";
				//附件关联记录删除sql
				String attachDelSql11 = "delete from sgcc_attach_list where transaction_type in in ("+docTypes11+")" + 
						" and transaction_id in (select uids from "+tabName11+" where zb_uids in " +
						"(select uids from pc_bid_zb_content where zb_uids = '"+appyId+"'))";
				PcDataExchange excHbm11 =  new PcDataExchange();
				excHbm11.setPid(toUnit);//接收单位
				excHbm11.setTableName(tabName11);
				excHbm11.setTxGroup(txGroup);
				excHbm11.setXh(xh++);
				excHbm11.setSuccessFlag("0");
				excHbm11.setSpareC5(sendUnit);//发送单位
				excHbm11.setBizInfo(bizInfo);
				excHbm11.setSqlData("delete from PC_BID_ZB_AGENCY where ZB_UIDS in (select uids from PC_BID_ZB_APPLY where uids='"+appyId+"')");
				excHbm11.setSpareC1(blobDelSql11+";"+attachDelSql11);//前置sql
				
				excList.add(excHbm11);
				
				//12.招标公告删除
				String tabName12 = "PC_BID_PUBLISH_NOTICE";
				String docTypes12 = "'PCBidNotice', 'PCBidNoticeOther'";
				//大对象记录删除sql
				String blobDelSql12 = "delete from sgcc_attach_blob where file_lsh in " +
						"(select file_lsh from sgcc_attach_list where transaction_type in ("+docTypes12+")" + 
						" and transaction_id in (select uids from "+tabName12+" where zb_uids in " +
						"(select uids from pc_bid_zb_content where zb_uids = '"+appyId+"')))";
				//附件关联记录删除sql
				String attachDelSql12 = "delete from sgcc_attach_list where transaction_type in in ("+docTypes12+")" + 
						" and transaction_id in (select uids from "+tabName12+" where zb_uids in " +
						"(select uids from pc_bid_zb_content where zb_uids = '"+appyId+"'))";
				PcDataExchange excHbm12 =  new PcDataExchange();
				excHbm12.setPid(toUnit);//接收单位
				excHbm12.setTableName(tabName12);
				excHbm12.setTxGroup(txGroup);
				excHbm12.setXh(xh++);
				excHbm12.setSuccessFlag("0");
				excHbm12.setSpareC5(sendUnit);//发送单位
				excHbm12.setBizInfo(bizInfo);
				excHbm12.setSqlData("delete from "+tabName12+" where ZB_UIDS in (select uids from PC_BID_ZB_APPLY where uids='"+appyId+"')");
				excHbm12.setSpareC1(blobDelSql12+";"+attachDelSql12);//前置sql
				
				excList.add(excHbm12);
				
				//13.各信息过程阶段的删除
				String tabName13 = "PC_BID_PROGRESS";
				String[] docTypes13 = {"PCBidProgress"};
				
				PcDataExchange excHbm13 =  this.getZbDetailExcDataForApplyDel(appyId, docTypes13, tabName13);
				excHbm13.setPid(toUnit);//接收单位
				excHbm13.setTableName(tabName13);
				excHbm13.setTxGroup(txGroup);
				excHbm13.setXh(xh++);
				excHbm13.setSuccessFlag("0");
				excHbm13.setSpareC5(sendUnit);//发送单位
				excHbm13.setBizInfo(bizInfo);
				
				excList.add(excHbm13);
				
				//14.申请信息删除
				String tabName14 = "PC_BID_ZB_APPLY";
				//大对象记录删除sql
				String blobDelSql14 = "delete from sgcc_attach_blob where file_lsh in " +
						"(select file_lsh from sgcc_attach_list where transaction_type ='PCBidApplyReport'" + 
						" and transaction_id = '"+appyId+"')";
				//附件关联记录删除sql
				String attachDelSql14 = "delete from sgcc_attach_list where transaction_type ='PCBidApplyReport'" +  
						" and transaction_id = '"+appyId+"'";
				
				PcDataExchange excHbm14 =  new PcDataExchange();
				excHbm14.setPid(toUnit);//接收单位
				excHbm14.setTableName(tabName14);
				excHbm14.setTxGroup(txGroup);
				excHbm14.setXh(xh++);
				excHbm14.setSuccessFlag("0");
				excHbm14.setSpareC5(sendUnit);//发送单位
				excHbm14.setBizInfo(bizInfo);
				excHbm14.setSqlData("delete from "+tabName14+" where uids ='"+appyId+"'");
				excHbm14.setSpareC1(blobDelSql14+";"+attachDelSql14);//前置sql
				
				excList.add(excHbm14);
			}
			if(excList.size()>0){
				if (immediate) {// 立即发送
					Map<String, String> rtn = exService.sendExchangeData(excList);
					if(rtn.get("result").toString().equalsIgnoreCase("success")){
						flag = "1";
					}else{
						flag = "0";
					}
				} else {// 加入队列定时发送
					exService.addExchangeListToQueue(excList);
				}
			}
			
		} catch (PCDataExchangeException pce) {
			pce.printStackTrace();
			flag = "0";
		}
		return flag;
	}
	/**
	 * 删除招标内容时数据交互
	 * @param ids 招标内容主键Id
	 * @param immediate 是否立即发送，如果不是立即发送则加入待发送队列
	 * @param sendUnit 发送单位
	 * @param toUnit 接收单位
	 * @return
	 */
	public String excDataZbContentForDel(String[] ids, boolean immediate,
			String sendUnit, String toUnit) {
		String flag = "1";
		try {
			PCDataExchangeService exService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			
			List<PcDataExchange> excList = new ArrayList<PcDataExchange>();
			String txGroup = SnUtil.getNewID("tx-"); //事务编号
			long xh = exService.getNewExchangeXh(toUnit);//排序号
			for(String contentId : ids){
				String bizInfo = "招标内容【"+sendUnit+"】删除";
				//0.招标公告删除+对应的附件
				String[] docTypes0 = {"PCBidNotice","PCBidNoticeOther"};
				String tabName0 = "PC_BID_PUBLISH_NOTICE";
				
				PcDataExchange excHbm0 =  this.getZbDetailExcDataForContentDel(contentId, docTypes0, tabName0);
				excHbm0.setBizInfo(bizInfo);
				excHbm0.setPid(toUnit);//接收单位
				excHbm0.setSuccessFlag("0");
				excHbm0.setSpareC5(sendUnit);//发送单位
				excHbm0.setTableName(tabName0);
				excHbm0.setXh(xh++);
				excHbm0.setTxGroup(txGroup);
				
				excList.add(excHbm0);
				
				//1.发送中标通知书删除+对应的附件
				String[] docTypes1 = {"PCBidIssueWinNotice","PCBidIssueWinOther"};
				String tabName1 = "PC_BID_ISSUE_WIN_DOC";
				
				PcDataExchange excHbm1 =  this.getZbDetailExcDataForContentDel(contentId, docTypes1, tabName1);
				excHbm1.setBizInfo(bizInfo);
				excHbm1.setPid(toUnit);//接收单位
				excHbm1.setSuccessFlag("0");
				excHbm1.setSpareC5(sendUnit);//发送单位
				excHbm1.setTableName(tabName1);
				excHbm1.setXh(xh++);
				excHbm1.setTxGroup(txGroup);

				excList.add(excHbm1);
				
				//2.评标结果公示删除+对应的附件
				String[] docTypes2 = {"PCBidAssessPublishOther"};
				String tabName2 = "PC_BID_ASSESS_PUBLISH";
				
				PcDataExchange excHbm2 =  this.getZbDetailExcDataForContentDel(contentId, docTypes2, tabName2);
				excHbm2.setBizInfo(bizInfo);
				excHbm2.setPid(toUnit);//接收单位
				excHbm2.setSuccessFlag("0");
				excHbm2.setSpareC5(sendUnit);//发送单位
				excHbm2.setTableName(tabName2);
				excHbm2.setXh(xh++);
				excHbm2.setTxGroup(txGroup);
				
				excList.add(excHbm2);
				
				//3.评标删除+对应的附件
				String[] docTypes3 = {"PCBidFile","PCBidClarifyContent","PCBidAssessReport","PCBidAssessOther"};
				String tabName3 = "PC_BID_JUDGE_BIDDING";
				
				PcDataExchange excHbm3 =  this.getZbDetailExcDataForContentDel(contentId, docTypes3, tabName3);
				excHbm3.setBizInfo(bizInfo);
				excHbm3.setPid(toUnit);//接收单位
				excHbm3.setSuccessFlag("0");
				excHbm3.setSpareC5(sendUnit);//发送单位
				excHbm3.setTableName(tabName3);
				excHbm3.setXh(xh++);
				excHbm3.setTxGroup(txGroup);
				
				excList.add(excHbm3);
				
				//4.开标删除+对应的附件
				String[] docTypes4 = {"PCBidOpenBidOther","PCBidFile"};
				String tabName4 = "PC_BID_PC_OPEN_BIDDING";
				
				PcDataExchange excHbm4 =  this.getZbDetailExcDataForContentDel(contentId, docTypes4, tabName4);
				excHbm4.setBizInfo(bizInfo);
				excHbm4.setPid(toUnit);//接收单位
				excHbm4.setSuccessFlag("0");
				excHbm4.setSpareC5(sendUnit);//发送单位
				excHbm4.setTableName(tabName4);
				excHbm4.setXh(xh++);
				excHbm4.setTxGroup(txGroup);
				
				excList.add(excHbm4);
				
				//5.接收招标文件及投标保证金  删除+对应的附件
				String[] docTypes5 = {"PCBidFile","PCBidAcceptTbdocOther"};
				String tabName5 = "PC_BID_ACCEPT_TB_DOC_AND_BOND";
				
				PcDataExchange excHbm5 =  this.getZbDetailExcDataForContentDel(contentId, docTypes5, tabName5);
				excHbm5.setBizInfo(bizInfo);
				excHbm5.setPid(toUnit);//接收单位
				excHbm5.setSuccessFlag("0");
				excHbm5.setSpareC5(sendUnit);//发送单位
				excHbm5.setTableName(tabName5);
				excHbm5.setXh(xh++);
				excHbm5.setTxGroup(txGroup);
				
				excList.add(excHbm5);
				
				//6.组件评标委员会删除+对应的附件
				String[] docTypes6 = {"PCBidCouncilOther"};
				String tabName6 = "PC_BID_ASSESS_COUNCIL";
				
				PcDataExchange excHbm6 =  this.getZbDetailExcDataForContentDel(contentId, docTypes6, tabName6);
				excHbm6.setBizInfo(bizInfo);
				excHbm6.setPid(toUnit);//接收单位
				excHbm6.setSuccessFlag("0");
				excHbm6.setSpareC5(sendUnit);//发送单位
				excHbm6.setTableName(tabName6);
				excHbm6.setXh(xh++);
				excHbm6.setTxGroup(txGroup);
				
				excList.add(excHbm6);
				
				//7.招标文件澄清删除+对应的附件
				String[] docTypes7 = {"PCBidZbCla","PCBidZbNeedCla","PCBidZbOther"};
				String tabName7 = "PC_BID_CLARIFICATE_ZBDOC";
				
				PcDataExchange excHbm7 =  this.getZbDetailExcDataForContentDel(contentId, docTypes7, tabName7);
				excHbm7.setBizInfo(bizInfo);
				excHbm7.setPid(toUnit);//接收单位
				excHbm7.setSuccessFlag("0");
				excHbm7.setSpareC5(sendUnit);//发送单位
				excHbm7.setTableName(tabName7);
				excHbm7.setXh(xh++);
				excHbm7.setTxGroup(txGroup);
				
				excList.add(excHbm7);
				
				//8.发售招标文件删除+对应的附件
				String[] docTypes8 = null;
				String tabName8 = "PC_BID_SEND_ZBDOC";
				
				PcDataExchange excHbm8 =  this.getZbDetailExcDataForContentDel(contentId, docTypes8, tabName8);
				excHbm8.setBizInfo(bizInfo);
				excHbm8.setPid(toUnit);//接收单位
				excHbm8.setSuccessFlag("0");
				excHbm8.setSpareC5(sendUnit);//发送单位
				excHbm8.setTableName(tabName8);
				excHbm8.setXh(xh++);
				excHbm8.setTxGroup(txGroup);
				
				excList.add(excHbm8);
				
				//9.投标人预审及预审结果删除+对应的附件
				String[] docTypes9 = {"PCBidApplicantOther"};
				String tabName9 = "PC_BID_TB_UNIT_INFO";
				
				PcDataExchange excHbm9 =  this.getZbDetailExcDataForContentDel(contentId, docTypes9, tabName9);
				excHbm9.setBizInfo(bizInfo);
				excHbm9.setPid(toUnit);//接收单位
				excHbm9.setSuccessFlag("0");
				excHbm9.setSpareC5(sendUnit);//发送单位
				excHbm9.setTableName(tabName9);
				excHbm9.setXh(xh++);
				excHbm9.setTxGroup(txGroup);
				
				excList.add(excHbm9);
				
				//10.各信息过程阶段的删除
				String tabName10 = "PC_BID_PROGRESS";
				String[] docTypes10 = {"PCBidProgress"};
				
				PcDataExchange excHbm10 =  this.getZbDetailExcDataForContentDel(contentId, docTypes10, tabName10);
				excHbm10.setPid(toUnit);//接收单位
				excHbm10.setTableName(tabName10);
				excHbm10.setTxGroup(txGroup);
				excHbm10.setXh(xh++);
				excHbm10.setSuccessFlag("0");
				excHbm10.setSpareC5(sendUnit);//发送单位
				excHbm10.setBizInfo(bizInfo);
				
				excList.add(excHbm10);
				
				//11.招标内容删除
				String tabName11 = "PC_BID_ZB_CONTENT";
				
				PcDataExchange excHbm11 =  new PcDataExchange();
				excHbm11.setPid(toUnit);//接收单位
				excHbm11.setTableName(tabName11);
				excHbm11.setTxGroup(txGroup);
				excHbm11.setXh(xh++);
				excHbm11.setSuccessFlag("0");
				excHbm11.setSpareC5(sendUnit);//发送单位
				excHbm11.setBizInfo(bizInfo);
				excHbm11.setSqlData("delete from PC_BID_ZB_CONTENT where uids='"+contentId+"'");
				
				excList.add(excHbm11);
				
			}
			if(excList.size()>0){
				if (immediate) {// 立即发送
					Map<String, String> rtn = exService.sendExchangeData(excList);
					if(rtn.get("result").toString().equalsIgnoreCase("success")){
						flag = "1";
					}else{
						flag = "0";
					}
				} else {// 加入队列定时发送
					exService.addExchangeListToQueue(excList);
				}
			}
			
		} catch (PCDataExchangeException pce) {
			pce.printStackTrace();
			flag = "0";
		}
		return flag;
	}
	/**
	 * 各招标详细过程信息的删除
	 * @param ids
	 * @param immediate
	 * @param sendUnit
	 * @param toUnit
	 * @return
	 */
	public String excDataZbProcessForDel(String beanType,String[] ids, boolean immediate,
			String sendUnit, String toUnit) {
		String flag = "1";
		try{
			PCDataExchangeService exService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			
			String txGroup = SnUtil.getNewID("tx-"); //事务编号
			long xh = exService.getNewExchangeXh(toUnit);//排序号
			
			ArrayList<PcDataExchange> dataList = new ArrayList<PcDataExchange>();
			
			if (beanType.equalsIgnoreCase(PcBidIssueWinDoc.class.getName())) { // 发送中标通知书
				String tableName = "PC_BID_ISSUE_WIN_DOC";
				String docTypes = "'PCBidIssueWinNotice', 'PCBidIssueWinOther'";//附件类别
				for (String uids : ids) {
					String afterSql = "delete from sgcc_attach_blob where file_lsh in " +
							"(select file_lsh from sgcc_attach_list where transaction_type " +
							"in ("+docTypes+") and transaction_id = '"+uids+"')";
					afterSql+=";delete from sgcc_attach_list where transaction_type " +
							"in ("+docTypes+") and transaction_id = '"+uids+"'";
					
					PcDataExchange tmp = new PcDataExchange();
					tmp.setPid(toUnit);//接收单位
					tmp.setTableName(tableName);
					tmp.setTxGroup(txGroup);
					tmp.setXh(xh++);
					tmp.setSuccessFlag("0");
					tmp.setSpareC5(sendUnit);//发送单位
					tmp.setBizInfo("【发送中标通知书("+sendUnit+")】删除");
					tmp.setSqlData("delete from "+tableName+" where uids='"+uids+"'");
					tmp.setSpareC1(afterSql);//前置sql
					
					dataList.add(tmp);
				}
			}else if(beanType.equalsIgnoreCase(PcBidAssessPublish.class.getName())){//评标结果公示
				String tableName = "PC_BID_ASSESS_PUBLISH";
				String docTypes = "'PCBidAssessPublishOther'";//附件类别
				for (String uids : ids) {
					String afterSql = "delete from sgcc_attach_blob where file_lsh in " +
							"(select file_lsh from sgcc_attach_list where transaction_type " +
							"in ("+docTypes+") and transaction_id = '"+uids+"')";
					afterSql+=";delete from sgcc_attach_list where transaction_type " +
							"in ("+docTypes+") and transaction_id = '"+uids+"'";
					
					PcDataExchange tmp = new PcDataExchange();
					tmp.setPid(toUnit);//接收单位
					tmp.setTableName(tableName);
					tmp.setTxGroup(txGroup);
					tmp.setXh(xh++);
					tmp.setSuccessFlag("0");
					tmp.setSpareC5(sendUnit);//发送单位
					tmp.setBizInfo("【评标结果公示("+sendUnit+")】删除");
					tmp.setSqlData("delete from "+tableName+" where uids='"+uids+"'");
					tmp.setSpareC1(afterSql);//前置sql
					
					dataList.add(tmp);
				}
			}else if(beanType.equalsIgnoreCase(PcBidJudgeBidding.class.getName())){//评标删除+对应的附件
				String tableName = "PC_BID_JUDGE_BIDDING";
				String docTypes = "'PCBidFile','PCBidClarifyContent','PCBidAssessReport','PCBidAssessOther'";//附件类别
				for (String uids : ids) {
					String afterSql = "delete from sgcc_attach_blob where file_lsh in " +
							"(select file_lsh from sgcc_attach_list where transaction_type " +
							"in ("+docTypes+") and transaction_id = '"+uids+"')";
					afterSql+=";delete from sgcc_attach_list where transaction_type " +
							"in ("+docTypes+") and transaction_id = '"+uids+"'";
					
					PcDataExchange tmp = new PcDataExchange();
					tmp.setPid(toUnit);//接收单位
					tmp.setTableName(tableName);
					tmp.setTxGroup(txGroup);
					tmp.setXh(xh++);
					tmp.setSuccessFlag("0");
					tmp.setSpareC5(sendUnit);//发送单位
					tmp.setBizInfo("【评标("+sendUnit+")】删除");
					tmp.setSqlData("delete from "+tableName+" where uids='"+uids+"'");
					tmp.setSpareC1(afterSql);//前置sql
					
					dataList.add(tmp);
				}
			}else if(beanType.equalsIgnoreCase(PcBidOpenBidding.class.getName())){//开标删除+对应的附件
				String tableName = "PC_BID_PC_OPEN_BIDDING";
				String docTypes = "'PCBidOpenBidOther','PCBidFile'";//附件类别
				for (String uids : ids) {
					String afterSql = "delete from sgcc_attach_blob where file_lsh in " +
							"(select file_lsh from sgcc_attach_list where transaction_type " +
							"in ("+docTypes+") and transaction_id = '"+uids+"')";
					afterSql+=";delete from sgcc_attach_list where transaction_type " +
							"in ("+docTypes+") and transaction_id = '"+uids+"'";
					
					PcDataExchange tmp = new PcDataExchange();
					tmp.setPid(toUnit);//接收单位
					tmp.setTableName(tableName);
					tmp.setTxGroup(txGroup);
					tmp.setXh(xh++);
					tmp.setSuccessFlag("0");
					tmp.setSpareC5(sendUnit);//发送单位
					tmp.setBizInfo("【开标("+sendUnit+")】删除");
					tmp.setSqlData("delete from "+tableName+" where uids='"+uids+"'");
					tmp.setSpareC1(afterSql);//前置sql
					
					dataList.add(tmp);
				}
			}else if(beanType.equalsIgnoreCase(PcBidAcceptTbdocAndBond.class.getName())){//接收招标文件及投标保证金  删除+对应的附件
				String tableName = "PC_BID_ACCEPT_TB_DOC_AND_BOND";
				String docTypes = "'PCBidFile','PCBidAcceptTbdocOther'";//附件类别
				for (String uids : ids) {
					String afterSql = "delete from sgcc_attach_blob where file_lsh in " +
							"(select file_lsh from sgcc_attach_list where transaction_type " +
							"in ("+docTypes+") and transaction_id = '"+uids+"')";
					afterSql+=";delete from sgcc_attach_list where transaction_type " +
							"in ("+docTypes+") and transaction_id = '"+uids+"'";
					
					PcDataExchange tmp = new PcDataExchange();
					tmp.setPid(toUnit);//接收单位
					tmp.setTableName(tableName);
					tmp.setTxGroup(txGroup);
					tmp.setXh(xh++);
					tmp.setSuccessFlag("0");
					tmp.setSpareC5(sendUnit);//发送单位
					tmp.setBizInfo("【接收招标文件及投标保证金("+sendUnit+")】删除");
					tmp.setSqlData("delete from "+tableName+" where uids='"+uids+"'");
					tmp.setSpareC1(afterSql);//前置sql
					
					dataList.add(tmp);
				}
			}else if(beanType.equalsIgnoreCase(PcBidAssessCouncil.class.getName())){//组件评标委员会删除+对应的附件
				String tableName = "PC_BID_ASSESS_COUNCIL";
				String docTypes = "'PCBidCouncilOther'";//附件类别
				for (String uids : ids) {
					String afterSql = "delete from sgcc_attach_blob where file_lsh in " +
							"(select file_lsh from sgcc_attach_list where transaction_type " +
							"in ("+docTypes+") and transaction_id = '"+uids+"')";
					afterSql+=";delete from sgcc_attach_list where transaction_type " +
							"in ("+docTypes+") and transaction_id = '"+uids+"'";
					
					PcDataExchange tmp = new PcDataExchange();
					tmp.setPid(toUnit);//接收单位
					tmp.setTableName(tableName);
					tmp.setTxGroup(txGroup);
					tmp.setXh(xh++);
					tmp.setSuccessFlag("0");
					tmp.setSpareC5(sendUnit);//发送单位
					tmp.setBizInfo("【组件评标委员会("+sendUnit+")】删除");
					tmp.setSqlData("delete from "+tableName+" where uids='"+uids+"'");
					tmp.setSpareC1(afterSql);//前置sql
					
					dataList.add(tmp);
				}
			}else if(beanType.equalsIgnoreCase(PcBidClarificateZbdoc.class.getName())){//招标文件澄清删除+对应的附件
				String tableName = "PC_BID_CLARIFICATE_ZBDOC";
				String docTypes = "'PCBidZbCla','PCBidZbNeedCla','PCBidZbOther'";//附件类别
				for (String uids : ids) {
					String afterSql = "delete from sgcc_attach_blob where file_lsh in " +
							"(select file_lsh from sgcc_attach_list where transaction_type " +
							"in ("+docTypes+") and transaction_id = '"+uids+"')";
					afterSql+=";delete from sgcc_attach_list where transaction_type " +
							"in ("+docTypes+") and transaction_id = '"+uids+"'";
					
					PcDataExchange tmp = new PcDataExchange();
					tmp.setPid(toUnit);//接收单位
					tmp.setTableName(tableName);
					tmp.setTxGroup(txGroup);
					tmp.setXh(xh++);
					tmp.setSuccessFlag("0");
					tmp.setSpareC5(sendUnit);//发送单位
					tmp.setBizInfo("【招标文件澄清("+sendUnit+")】删除");
					tmp.setSqlData("delete from "+tableName+" where uids ='"+uids+"'");
					tmp.setSpareC1(afterSql);//前置sql
					
					dataList.add(tmp);
				}
			}else if(beanType.equalsIgnoreCase(PcBidSendZbdoc.class.getName())){//发售招标文件删除+对应的附件
				String tableName = "PC_BID_SEND_ZBDOC";
				for (String uids : ids) {
					PcDataExchange tmp = new PcDataExchange();
					tmp.setPid(toUnit);//接收单位
					tmp.setTableName(tableName);
					tmp.setTxGroup(txGroup);
					tmp.setXh(xh++);
					tmp.setSuccessFlag("0");
					tmp.setSpareC5(sendUnit);//发送单位
					tmp.setBizInfo("【发售招标文件("+sendUnit+")】删除");
					tmp.setSqlData("delete from "+tableName+" where uids='"+uids+"'");
					
					dataList.add(tmp);
				}
			}else if(beanType.equalsIgnoreCase(PcBidTbUnitInfo.class.getName())){//投标人预审及预审结果删除+对应的附件
				String tableName = "PC_BID_TB_UNIT_INFO";
				String docTypes = "'PCBidApplicantOther','PCBidPreVeryfy'";//附件类别
				for (String uids : ids) {
					String afterSql = "delete from sgcc_attach_blob where file_lsh in " +
							"(select file_lsh from sgcc_attach_list where transaction_type " +
							"in ("+docTypes+") and transaction_id = '"+uids+"')";
					afterSql+=";delete from sgcc_attach_list where transaction_type " +
							"in ("+docTypes+") and transaction_id = '"+uids+"'";
					
					PcDataExchange tmp = new PcDataExchange();
					tmp.setPid(toUnit);//接收单位
					tmp.setTableName(tableName);
					tmp.setTxGroup(txGroup);
					tmp.setXh(xh++);
					tmp.setSuccessFlag("0");
					tmp.setSpareC5(sendUnit);//发送单位
					tmp.setBizInfo("【投标人预审及预审结果("+sendUnit+")】删除");
					tmp.setSqlData("delete from "+tableName+" where uids ='"+uids+"'");
					tmp.setSpareC1(afterSql);//前置sql
					
					dataList.add(tmp);
				}
			}else if(beanType.equalsIgnoreCase(PcBidZbAgency.class.getName())){//招标代理机构删除+对于的附件
				String tableName = "PC_BID_ZB_AGENCY";
				String docTypes = "'PCBidAgency','PCBidAgencyOther','PCBidAgencyContract'";//附件类别
				
				for (String uids : ids) {
					String afterSql = "delete from sgcc_attach_blob where file_lsh in " +
							"(select file_lsh from sgcc_attach_list where transaction_type " +
							"in ("+docTypes+") and transaction_id = '"+uids+"')";
					afterSql+=";delete from sgcc_attach_list where transaction_type " +
							"in ("+docTypes+") and transaction_id = '"+uids+"'";
					
					PcDataExchange tmp = new PcDataExchange();
					tmp.setPid(toUnit);//接收单位
					tmp.setTableName(tableName);
					tmp.setTxGroup(txGroup);
					tmp.setXh(xh++);
					tmp.setSuccessFlag("0");
					tmp.setSpareC5(sendUnit);//发送单位
					tmp.setBizInfo("【招标代理机构("+sendUnit+")】删除");
					tmp.setSqlData("delete from "+tableName+" where uids ='"+uids+"'");
					tmp.setSpareC1(afterSql);//前置sql
					
					dataList.add(tmp);
				}
			}else if(beanType.equalsIgnoreCase(PcBidPublishNotice.class.getName())){//招标公告删除+对于的附件
				String tableName = "PC_BID_PUBLISH_NOTICE";
				String docTypes = "'PCBidNotice','PCBidNoticeOther'";//附件类别
				
				for (String uids : ids) {
					String afterSql = "delete from sgcc_attach_blob where file_lsh in " +
					"(select file_lsh from sgcc_attach_list where transaction_type " +
					"in ("+docTypes+") and transaction_id = '"+uids+"')";
					afterSql+=";delete from sgcc_attach_list where transaction_type " +
					"in ("+docTypes+") and transaction_id = '"+uids+"'";
					
					PcDataExchange tmp = new PcDataExchange();
					tmp.setPid(toUnit);//接收单位
					tmp.setTableName(tableName);
					tmp.setTxGroup(txGroup);
					tmp.setXh(xh++);
					tmp.setSuccessFlag("0");
					tmp.setSpareC5(sendUnit);//发送单位
					tmp.setBizInfo("【招标公告("+sendUnit+")】删除");
					tmp.setSqlData("delete from "+tableName+" where uids ='"+uids+"'");
					tmp.setSpareC1(afterSql);//前置sql
					
					dataList.add(tmp);
				}
			}
			else if(beanType.equalsIgnoreCase(PcBidNoticeContent.class.getName())){//招标公告与招标内容关联
				String tableName = "PC_BID_NOTICE_CONTENT";
				for (String uids : ids) {			
					PcDataExchange tmp = new PcDataExchange();
					tmp.setPid(toUnit);//接收单位
					tmp.setTableName(tableName);
					tmp.setTxGroup(txGroup);
					tmp.setXh(xh++);
					tmp.setSuccessFlag("0");
					tmp.setSpareC5(sendUnit);//发送单位
					tmp.setBizInfo("【招标公告与招标内容关联("+sendUnit+")】删除");
					tmp.setSqlData("delete from "+tableName+" where uids ='"+uids+"'");
					
					dataList.add(tmp);
				}
			}
						
			if(dataList.size()>0){
				if (immediate) {// 立即发送
					Map<String, String> rtn = exService.sendExchangeData(dataList);
					if(rtn.get("result").toString().equalsIgnoreCase("success")){
						flag = "1";
					}else{
						flag = "0";
					}
				} else {// 加入队列定时发送
					exService.addExchangeListToQueue(dataList);
				}
			}
		}catch (PCDataExchangeException e) {
			e.printStackTrace();
			flag = "0";
		}
		return flag;
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
	public String excDataAttachments(String beanName, String id,
			String[] fileLshArr, String sendUnit, String toUnit,
			String bizInfo, boolean immediate) {
		String flag = "1";
		try{
			PCDataExchangeService exService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			if (! exchangeEnabled )	return flag;
			
			
			List<PcDataExchange> exchangeList = new ArrayList<PcDataExchange>();
			Object hbm = pcBidDAO.findById(beanName, id);//业务主记录
			if(hbm!=null){
				PcDataExchange bizExc = exService.getExcData(hbm, toUnit, sendUnit, null, null, bizInfo);
				//事物编号
				String curTxGroup = bizExc.getTxGroup();
				// 当前序号
				long curXh = bizExc.getXh();
				
				for (String lsh : fileLshArr) {
					//找到当前AttachList
					SgccAttachList attach = (SgccAttachList) pcBidDAO.findBeanByProperty(SgccAttachList.class.getName(),"id.fileLsh", lsh);
					if (attach == null) { // 删除
						PcDataExchange attachEx = new PcDataExchange();
						attachEx.setBizInfo(bizInfo);//业务说明
						attachEx.setSpareC5(sendUnit);//发送单位
						attachEx.setXh(++curXh);
						attachEx.setTxGroup(curTxGroup);
						attachEx.setSqlData("delete from SGCC_ATTACH_LIST where file_lsh = '"+lsh+"'");
						attachEx.setPid(toUnit);
						attachEx.setSuccessFlag("0");
						attachEx.setTableName("SGCC_ATTACH_LIST");
						attachEx.setSpareC1("delete from SGCC_ATTACH_BLOB where file_lsh = '"+lsh+"'");//大对象删除
						
						exchangeList.add(attachEx);
					}else{//新增
						
						//为防止接收端不存在主记录，所以将增加主记录
						//exchangeList.add(bizExc);
						//SGCC_ATTACH_LIST交互
						PcDataExchange attachEx = exService.getExcData(attach, toUnit, sendUnit, null, null, bizInfo);
						attachEx.setTxGroup(curTxGroup);
						attachEx.setXh(++curXh);
						exchangeList.add(attachEx);
						
						//项目单位不会将大对象交互给集团，而集团会将大对象交互给项目
						String deployType = Constant.propsMap.get("DEPLOY_UNITTYPE"); 
						if(!(deployType.equals("A") || deployType.equals("S"))) {
							JSONArray kvarr = new JSONArray();
							JSONObject kv = new JSONObject();
							kv.put("FILE_LSH", lsh);
							kvarr.add(kv);
							
							PcDataExchange blobEx = new PcDataExchange();
							blobEx.setTableName("SGCC_ATTACH_BLOB");
							blobEx.setBlobCol("FILE_NR");
							blobEx.setKeyValue(kvarr.toString());
							blobEx.setSuccessFlag("0");
							blobEx.setXh(++curXh);
							blobEx.setPid(toUnit);
							blobEx.setTxGroup(curTxGroup);
							blobEx.setSpareC5(sendUnit);//发送单位
							blobEx.setBizInfo(bizInfo);//业务说明
							
							exchangeList.add(blobEx);
						}
					}
				}
				
				if (immediate) {
					// 立即发送
					Map<String,String> rtnMap = exService.sendExchangeData(exchangeList);
					if(!(rtnMap.get("result").equals("success"))){
						flag = "0";
					}
				} else {
					// 加入队列定时发送
					exService.addExchangeListToQueue(exchangeList);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			flag = "0";
		}
		return flag;
	}
	
	
	/**
	 * 招投标管理数据新增或修改数据交互
	 * @param beanType
	 * @param updateIds 
	 * @param insertIds  
	 * @param immediate
	 * @param sendUnit
	 * @param toUnit
	 * @return
	 */
	public String excDataZbForSave(String beanType, String[] updateId,String[] insertId,
			boolean immediate, String sendUnit, String toUnit) {
		String flag = "1";
		String []updateIds=new String[0];
		String []insertIds=new String[0];
		if(updateId!=null){
			updateIds=updateId;
		}
		if(insertId!=null){
			insertIds=insertId;
		}
		String[] ids=new String[updateIds.length+insertIds.length];
		System.arraycopy(updateIds, 0, ids, 0,updateIds.length);
		System.arraycopy(insertIds, 0, ids,updateIds.length ,insertIds.length);
		try{
			// 获取service实例
			PCDataExchangeService excService = (PCDataExchangeService) Constant.wact.getBean("PCDataExchangeService");
			for (String uids : ids) {
				Object o = pcBidDAO.findById(beanType, uids);
				String bizInfo = "";
				PcDynamicData dyda=null;
				if(beanType.equalsIgnoreCase(PcBidZbApply.class.getName())){
					bizInfo = "【招标申请("+sendUnit+")】新增或修改";
					PcBidZbApply zbApply = (PcBidZbApply)pcBidDAO.findById(beanType, uids);
					dyda=new PcDynamicData();
					dyda.setPid(zbApply.getPid());
					dyda.setPctablebean(PcBidZbApply.class.getName());
					dyda.setPctablename(DynamicDataUtil.getTableNameByEntry(PcBidZbApply.class.getName()));
					dyda.setPctableoptype(DynamicDataUtil.OP_ADD);
					for(int i=0;i<updateIds.length;i++){
						if(zbApply.getUids().equals(updateIds[i])){
							dyda.setPctableoptype(DynamicDataUtil.OP_UPDATE);
						}
					}
					dyda.setPctableuids(zbApply.getUids());
					dyda.setPcdynamicdate(new Date());
					dyda.setPcurl(DynamicDataUtil.BID_APPLY_URL);
					
					Session session =pcBidDAO.getSessionFactory().openSession();
					session.beginTransaction();
					session.save(dyda);
					session.getTransaction().commit();
					session.close();
				}else if(beanType.equalsIgnoreCase(PcBidZbContent.class.getName())){
					bizInfo = "【招标内容("+sendUnit+")】新增或修改";
				}else if(beanType.equalsIgnoreCase(PcBidZbAgency.class.getName())){
					bizInfo = "【招标代理机构("+sendUnit+")】新增或修改";
				}else if(beanType.equalsIgnoreCase(PcBidPublishNotice.class.getName())){
					bizInfo = "【招标公告("+sendUnit+")】新增或修改";
				}else if(beanType.equalsIgnoreCase(PcBidProgress.class.getName())){
					bizInfo = "【招标详细过程进度信息("+sendUnit+")】新增或修改";
					dyda=(PcDynamicData)pcBidDAO.findBeanByProperty(PcDynamicData.class.getName(), "pctableuids", uids);
				}else if(beanType.equalsIgnoreCase(PcBidTbUnitInfo.class.getName())){
					bizInfo = "【投标人报名信息及预审结果("+sendUnit+")】新增或修改";
				}else if(beanType.equalsIgnoreCase(PcBidSendZbdoc.class.getName())){
					bizInfo = "【发售招标文件("+sendUnit+")】新增或修改";
				}else if(beanType.equalsIgnoreCase(PcBidClarificateZbdoc.class.getName())){
					bizInfo = "【招标文件澄清("+sendUnit+")】新增或修改";
				}else if(beanType.equalsIgnoreCase(PcBidAssessCouncil.class.getName())){
					bizInfo = "【组建评标委员会("+sendUnit+")】新增或修改";
				}else if(beanType.equalsIgnoreCase(PcBidAcceptTbdocAndBond.class.getName())){
					bizInfo = "【接受招标文件及投标保证金("+sendUnit+")】新增或修改";
				}else if(beanType.equalsIgnoreCase(PcBidOpenBidding.class.getName())){
					bizInfo = "【开标("+sendUnit+")】新增或修改";
				}else if(beanType.equalsIgnoreCase(PcBidJudgeBidding.class.getName())){
					bizInfo = "【评标("+sendUnit+")】新增或修改";
				}else if(beanType.equalsIgnoreCase(PcBidAssessPublish.class.getName())){
					bizInfo = "【评标结果公示("+sendUnit+")】新增或修改";
				}else if(beanType.equalsIgnoreCase(PcBidIssueWinDoc.class.getName())){
					bizInfo = "【发放中标通知书("+sendUnit+")】新增或修改";
				}
				else if(beanType.equalsIgnoreCase(PcBidNoticeContent.class.getName())){
					bizInfo = "【招标公告与招标内容关联("+sendUnit+")】新增或修改";
				}				
				if(o!=null){
					PcDataExchange excHbm = excService.getExcData(o, toUnit, sendUnit, null, null, bizInfo);
					List<PcDataExchange> excList = new ArrayList<PcDataExchange>();
					excList.add(excHbm);
					if(dyda !=null){
						PcDataExchange dydaHbm = excService.getExcData(dyda, toUnit, sendUnit, null, null, bizInfo);
						//事务编号
						String txGroup = excHbm.getTxGroup();
						dydaHbm.setTxGroup(txGroup);
						excList.add(dydaHbm);
					}
					
					if (immediate) {
						// 立即发送
						Map<String, String> rtnMap = excService.sendExchangeData(excList);
						if(!(rtnMap.get("result").equals("success"))){
							flag = "0";
						}
					} else {
						// 加入队列定时发送
						excService.addExchangeListToQueue(excList);
					}
				}
			}
		}catch (PCDataExchangeException e) {
			e.printStackTrace();
			flag = "0";
		}
		return flag;
	};
}
